import fs from "node:fs/promises";

import { createProjectPullRequest, getPullRequestStatus } from "../services/githubService.js";
import { extractTextFromPdfBuffer, generateProjectReadme } from "../services/readmeService.js";
import { buildProjectPath, validateProjectSubmission } from "../services/validation.js";

export async function uploadProject(req, res, next) {
  const projectFiles = req.files?.projectFiles || [];
  const reportFile = req.files?.reportPdf?.[0] || null;

  try {
    const data = validateProjectSubmission(req.body, req.files);
    const projectPath = buildProjectPath(data);
    const reportText = reportFile ? await readReportText(reportFile.path) : "";
    const readmeContent = generateProjectReadme(data, { hasReportPdf: Boolean(reportFile), reportText });

    const result = await createProjectPullRequest({
      data,
      projectFiles,
      reportFile,
      readmeContent
    });

    res.status(201).json({
      message: "Project uploaded successfully. A pull request has been created and is being checked for acceptance.",
      branchName: result.branchName,
      pullRequestNumber: result.pullRequestNumber,
      pullRequestUrl: result.pullRequestUrl,
      projectPath
    });
  } catch (error) {
    next(error);
  } finally {
    await cleanupTemporaryFiles([...projectFiles, ...(reportFile ? [reportFile] : [])]);
  }
}

async function readReportText(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    return extractTextFromPdfBuffer(buffer);
  } catch {
    return "";
  }
}

async function cleanupTemporaryFiles(files) {
  await Promise.allSettled(files.map((file) => fs.unlink(file.path)));
}

export async function pullRequestStatus(req, res, next) {
  try {
    const status = await getPullRequestStatus(req.params.number);
    res.json(status);
  } catch (error) {
    next(error);
  }
}
