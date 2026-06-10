import fs from "node:fs/promises";

import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

import { HttpError } from "./httpError.js";
import {
  buildProjectPath,
  createBranchName,
  uniqueGitHubFilePath
} from "./validation.js";
import {
  generateFolderIndexReadmes,
  generatePullRequestBody,
  generateReportLinkMarkdown,
  pullRequestTitle
} from "./readmeService.js";

export async function createProjectPullRequest({ data, projectFiles, reportFile, readmeContent }) {
  const config = getGitHubConfig();
  const octokit = createGitHubClient(config);
  const projectPath = buildProjectPath(data);

  const baseSha = await getBaseBranchSha(octokit, config);
  await ensureProjectFolderDoesNotExist(octokit, config, projectPath);

  let branchName = createBranchName(data);
  branchName = await createUploadBranch(octokit, config, branchName, baseSha);

  await uploadProjectFiles(octokit, config, branchName, projectPath, {
    data,
    projectFiles,
    reportFile,
    readmeContent
  });

  const pullRequest = await openPullRequest(octokit, config, branchName, data, {
    hasReportPdf: Boolean(reportFile)
  });

  return {
    branchName,
    pullRequestNumber: pullRequest.number,
    pullRequestUrl: pullRequest.html_url,
    projectPath
  };
}

export async function getPullRequestStatus(pullRequestNumber) {
  const config = getGitHubConfig();
  const octokit = createGitHubClient(config);
  const number = Number(pullRequestNumber);

  if (!Number.isInteger(number) || number <= 0) {
    throw new HttpError(400, "Invalid pull request number.");
  }

  try {
    const { data } = await octokit.pulls.get({
      owner: config.owner,
      repo: config.repo,
      pull_number: number
    });

    let status = "pending";
    let message = "Pull request is waiting for GitHub Actions or maintainer review.";

    if (data.merged) {
      status = "accepted";
      message = "Pull request accepted and merged into the main repository.";
    } else if (data.state === "closed") {
      status = "not_accepted";
      message = "Pull request was closed without merging. Contact the repository administrator.";
    }

    return {
      number: data.number,
      status,
      state: data.state,
      merged: Boolean(data.merged),
      title: data.title,
      url: data.html_url,
      message
    };
  } catch (error) {
    throw new HttpError(502, `GitHub API error while checking pull request status: ${githubErrorMessage(error)}`);
  }
}

export async function listRepositoryFiles(requestedPath = "") {
  const config = getGitHubConfig();
  const octokit = createGitHubClient(config);
  const safePath = normalizeRepositoryPath(requestedPath);

  try {
    const { data } = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: safePath,
      ref: config.baseBranch
    });

    const items = Array.isArray(data) ? data : [data];

    return {
      owner: config.owner,
      repo: config.repo,
      branch: config.baseBranch,
      path: safePath,
      items: items
        .map((item) => ({
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size,
          htmlUrl: item.html_url,
          downloadUrl: item.download_url
        }))
        .sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "dir" ? -1 : 1;
          }

          return a.name.localeCompare(b.name);
        })
    };
  } catch (error) {
    if (error.status === 404) {
      throw new HttpError(404, "Repository path not found.");
    }

    throw new HttpError(502, `GitHub API error while reading repository files: ${githubErrorMessage(error)}`);
  }
}

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = normalizePrivateKey(process.env.GITHUB_APP_PRIVATE_KEY);
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const baseBranch = process.env.GITHUB_BASE_BRANCH || "main";

  if (!owner || !repo) {
    throw new HttpError(500, "GitHub repository details missing. Add GITHUB_OWNER and GITHUB_REPO to backend/.env.");
  }

  if (appId && privateKey && installationId) {
    return {
      authMode: "app",
      appId,
      privateKey,
      installationId,
      owner,
      repo,
      baseBranch
    };
  }

  if (!token) {
    throw new HttpError(
      500,
      "GitHub credentials missing. Add GITHUB_TOKEN, or configure GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, and GITHUB_APP_INSTALLATION_ID in backend/.env."
    );
  }

  return { authMode: "token", token, owner, repo, baseBranch };
}

function createGitHubClient(config) {
  if (config.authMode === "app") {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: config.appId,
        privateKey: config.privateKey,
        installationId: config.installationId
      }
    });
  }

  return new Octokit({ auth: config.token });
}

function normalizePrivateKey(privateKey) {
  if (!privateKey) {
    return "";
  }

  return privateKey.replace(/\\n/g, "\n");
}

function normalizeRepositoryPath(pathValue) {
  const value = String(pathValue || "").trim().replace(/^\/+|\/+$/g, "");

  if (value.includes("..") || value.includes("\\") || value.startsWith(".")) {
    throw new HttpError(400, "Invalid repository path.");
  }

  return value;
}

async function getBaseBranchSha(octokit, config) {
  try {
    const { data } = await octokit.git.getRef({
      owner: config.owner,
      repo: config.repo,
      ref: `heads/${config.baseBranch}`
    });

    return data.object.sha;
  } catch (error) {
    const message = githubErrorMessage(error);
    if (/git repository is empty/i.test(message)) {
      throw new HttpError(
        400,
        `The GitHub repository is empty. Create one initial commit, such as a README.md file, on the ${config.baseBranch} branch before uploading projects.`
      );
    }

    throw new HttpError(502, `GitHub API error while reading the base branch: ${githubErrorMessage(error)}`);
  }
}

async function ensureProjectFolderDoesNotExist(octokit, config, projectPath) {
  try {
    await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: projectPath.replace(/\/$/, ""),
      ref: config.baseBranch
    });

    throw new HttpError(409, "Duplicate project folder already exists in the GitHub repository.");
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    if (error.status === 404) {
      return;
    }

    throw new HttpError(502, `GitHub API error while checking for duplicate project folder: ${githubErrorMessage(error)}`);
  }
}

async function createUploadBranch(octokit, config, branchName, baseSha) {
  try {
    await octokit.git.createRef({
      owner: config.owner,
      repo: config.repo,
      ref: `refs/heads/${branchName}`,
      sha: baseSha
    });

    return branchName;
  } catch (error) {
    if (error.status !== 422) {
      throw new HttpError(502, `GitHub API error while creating the upload branch: ${githubErrorMessage(error)}`);
    }

    const fallbackBranchName = `${branchName}-${Date.now()}`;
    await octokit.git.createRef({
      owner: config.owner,
      repo: config.repo,
      ref: `refs/heads/${fallbackBranchName}`,
      sha: baseSha
    });

    return fallbackBranchName;
  }
}

async function uploadProjectFiles(octokit, config, branchName, projectPath, payload) {
  const usedProjectFileNames = new Set();
  const uploads = [
    ...generateFolderIndexReadmes(payload.data).map((file) => ({
      path: file.path,
      content: Buffer.from(file.content, "utf8").toString("base64"),
      createIfMissing: true
    })),
    {
      path: `${projectPath}README.md`,
      content: Buffer.from(payload.readmeContent, "utf8").toString("base64")
    }
  ];

  for (const file of payload.projectFiles) {
    uploads.push({
      path: uniqueGitHubFilePath(projectPath, "project-files", file.originalname, usedProjectFileNames),
      content: await fileToBase64(file.path)
    });
  }

  if (payload.reportFile) {
    uploads.push({
      path: `${projectPath}reports/project-report.pdf`,
      content: await fileToBase64(payload.reportFile.path)
    });
  }

  if (payload.data.googleDriveReportLink) {
    uploads.push({
      path: `${projectPath}report-link.md`,
      content: Buffer.from(generateReportLinkMarkdown(payload.data), "utf8").toString("base64")
    });
  }

  for (const upload of uploads) {
    try {
      if (upload.createIfMissing && (await fileExists(octokit, config, branchName, upload.path))) {
        continue;
      }

      await octokit.repos.createOrUpdateFileContents({
        owner: config.owner,
        repo: config.repo,
        path: upload.path,
        message: `Add ${payload.data.teamNumber}-${payload.data.projectName}`,
        content: upload.content,
        branch: branchName
      });
    } catch (error) {
      throw new HttpError(502, `GitHub API error while uploading project files: ${githubErrorMessage(error)}`);
    }
  }
}

async function fileExists(octokit, config, branchName, filePath) {
  try {
    await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: filePath,
      ref: branchName
    });

    return true;
  } catch (error) {
    if (error.status === 404) {
      return false;
    }

    throw error;
  }
}

async function openPullRequest(octokit, config, branchName, data, options) {
  try {
    const response = await octokit.pulls.create({
      owner: config.owner,
      repo: config.repo,
      title: pullRequestTitle(data),
      body: generatePullRequestBody(data, options),
      head: branchName,
      base: config.baseBranch
    });

    return response.data;
  } catch (error) {
    throw new HttpError(502, `Pull request creation failed: ${githubErrorMessage(error)}`);
  }
}

async function fileToBase64(filePath) {
  const buffer = await fs.readFile(filePath);
  return buffer.toString("base64");
}

function githubErrorMessage(error) {
  return error?.response?.data?.message || error?.message || "Unknown GitHub API error";
}
