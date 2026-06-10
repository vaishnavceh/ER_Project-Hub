import { inflateSync } from "node:zlib";

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function optionalLink(label, value) {
  return value ? `- ${label}: ${value}` : `- ${label}: Not provided`;
}

function optionalSection(title, value) {
  return value ? `\n## ${title}\n${value}\n` : "";
}

function valueOrNotAvailable(value) {
  return value ? value : "Not available.";
}

function firstAvailable(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() || "";
}

function derivedProblemStatement(data) {
  if (data.problemStatement) {
    return data.problemStatement;
  }

  const description = (data.projectDescription || "").trim();
  if (!description) {
    return "Not available.";
  }

  const sentences = description
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const summary = sentences.slice(0, 2).join(" ") || description;

  return summary.length > 700 ? `${summary.slice(0, 697).trim()}...` : summary;
}

export function generateProjectReadme(data, { hasReportPdf, reportText = "" }) {
  const projectTitle = titleFromSlug(data.projectName);
  const reportSections = extractReportSections(reportText);
  const problemStatement = firstAvailable(data.problemStatement, reportSections.problemStatement) || derivedProblemStatement(data);
  const setupInstructions = valueOrNotAvailable(firstAvailable(data.setupInstructions, reportSections.setupInstructions));
  const runTestSteps = valueOrNotAvailable(firstAvailable(data.runTestSteps, reportSections.runTestSteps));
  const demoOutput = valueOrNotAvailable(firstAvailable(data.demoOutput, reportSections.demoOutput));
  const presentationDetails = valueOrNotAvailable(firstAvailable(data.presentationDetails, reportSections.presentationDetails));
  const futureImprovements = valueOrNotAvailable(firstAvailable(data.futureImprovements, reportSections.futureImprovements));

  return `# ${projectTitle}

## Team Members
${data.teamMembers}

## Project Details
- Batch: ${data.batch}
- Semester: ${data.semester}
- Subject: ${data.subject}
- Project type: ${data.projectType}
- Team folder: ${data.teamNumber}-${data.projectName}

## Project Description
${data.projectDescription}

## Problem Statement
${problemStatement}

## Tools Used for Creation
${data.toolsUsed}

## Technologies Used
${data.technologiesUsed}

## Sources or References Used
${data.sourcesUsed}

## Project Files
Uploaded project files are stored in the \`project-files/\` folder.

## Installation or Setup Instructions
${setupInstructions}

## Steps to Run or Test
${runTestSteps}

## Screenshots, Photos, or Demo Output
${demoOutput}

## Project Report
- Report PDF uploaded: ${hasReportPdf ? "Yes, see `reports/project-report.pdf`." : "No PDF report uploaded."}
${optionalLink("Google Drive report link", data.googleDriveReportLink)}

## Working Video
${optionalLink("Working video link", data.workingVideoLink)}
${optionalSection("Additional Comments", data.additionalReadmeComments)}

## Presentation Details
${presentationDetails}

## Future Improvements
${futureImprovements}
`;
}

export function extractTextFromPdfBuffer(buffer) {
  if (!buffer?.length) {
    return "";
  }

  const source = buffer.toString("binary");
  const chunks = [];
  const streamPattern = /(\d+\s+\d+\s+obj[\s\S]*?)stream\r?\n?([\s\S]*?)\r?\n?endstream/g;
  let match;

  while ((match = streamPattern.exec(source))) {
    const objectHeader = match[1];
    let streamBuffer = Buffer.from(match[2], "binary");

    if (objectHeader.includes("/FlateDecode")) {
      try {
        streamBuffer = inflateSync(streamBuffer);
      } catch {
        continue;
      }
    }

    const extracted = extractTextFromPdfContent(streamBuffer.toString("latin1"));
    if (extracted) {
      chunks.push(extracted);
    }
  }

  if (chunks.length === 0) {
    return extractTextFromPdfContent(source);
  }

  return normalizeExtractedText(chunks.join("\n"));
}

function extractTextFromPdfContent(content) {
  const pieces = [];
  const textPattern = /\((?:\\.|[^\\)])*\)\s*Tj|\[(.*?)\]\s*TJ/gs;
  let match;

  while ((match = textPattern.exec(content))) {
    const token = match[0];
    if (token.endsWith("Tj")) {
      pieces.push(decodePdfString(token.replace(/\s*Tj$/, "")));
      continue;
    }

    const arrayContent = match[1] || "";
    const arrayStringPattern = /\((?:\\.|[^\\)])*\)/g;
    let arrayMatch;

    while ((arrayMatch = arrayStringPattern.exec(arrayContent))) {
      pieces.push(decodePdfString(arrayMatch[0]));
    }
  }

  return normalizeExtractedText(pieces.join(" "));
}

function decodePdfString(value) {
  const raw = value.replace(/^\(/, "").replace(/\)$/, "");

  return raw.replace(/\\([nrtbf()\\]|[0-7]{1,3}|\r?\n)/g, (match, escape) => {
    if (/^[0-7]/.test(escape)) {
      return String.fromCharCode(Number.parseInt(escape, 8));
    }

    const replacements = {
      n: "\n",
      r: "\r",
      t: "\t",
      b: "\b",
      f: "\f",
      "(": "(",
      ")": ")",
      "\\": "\\"
    };

    return replacements[escape] ?? "";
  });
}

function normalizeExtractedText(value) {
  return value
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractReportSections(reportText) {
  const normalized = normalizeExtractedText(reportText || "");
  if (!normalized) {
    return {};
  }

  return {
    problemStatement: extractSection(normalized, ["problem statement", "problem definition"]),
    setupInstructions: extractSection(normalized, ["installation or setup instructions", "installation", "setup instructions", "system setup"]),
    runTestSteps: extractSection(normalized, ["steps to run or test", "steps to run", "testing", "test procedure", "execution"]),
    demoOutput: extractSection(normalized, ["screenshots, photos, or demo output", "screenshots", "demo output", "results", "output"]),
    presentationDetails: extractSection(normalized, ["presentation details", "presentation"]),
    futureImprovements: extractSection(normalized, ["future improvements", "future scope", "future work", "scope for future"])
  };
}

function extractSection(text, headings) {
  const escapedHeadings = headings.map((heading) => escapeRegExp(heading).replace(/\s+/g, "\\s+"));
  const headingPattern = new RegExp(`(?:^|\\n|\\b)\\s*(?:${escapedHeadings.join("|")})\\s*:?\\s+`, "i");
  const match = headingPattern.exec(text);

  if (!match) {
    return "";
  }

  const start = match.index + match[0].length;
  const afterHeading = text.slice(start);
  const nextHeading = /(?:\n|\b)\s*(?:abstract|introduction|objectives?|methodology|requirements?|implementation|architecture|database|results?|conclusion|references?|appendix|problem statement|installation|setup instructions|steps to run|testing|screenshots|demo output|presentation details|future improvements|future scope|future work)\s*:?\s+/i.exec(afterHeading);
  const sectionText = (nextHeading ? afterHeading.slice(0, nextHeading.index) : afterHeading).trim();

  return sectionText.length > 1200 ? `${sectionText.slice(0, 1197).trim()}...` : sectionText;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function generateReportLinkMarkdown(data) {
  return `# Project Report Link

The project report is stored externally because it may be too large for this repository.

- Project: ${titleFromSlug(data.projectName)}
- Team: ${data.teamNumber}
- Report link: ${data.googleDriveReportLink}
`;
}

export function generateFolderIndexReadmes(data) {
  const batchPath = `batches/${data.batch}`;
  const semesterPath = `${batchPath}/${data.semester}`;
  const subjectPath = `${semesterPath}/${data.subject}`;

  return [
    {
      path: "batches/README.md",
      content: `# Batches

Student team projects are organized by batch, semester, subject, and team project folder.

Folder format:

\`\`\`text
batches/{batch}/{semester}/{subject}/{team-number}-{project-name}/
\`\`\`
`
    },
    {
      path: `${batchPath}/README.md`,
      content: `# ${data.batch}

Projects for ${data.batch}.

Next level: semester folders.
`
    },
    {
      path: `${semesterPath}/README.md`,
      content: `# ${data.semester}

Projects for ${data.batch}, ${data.semester}.

Next level: subject folders.
`
    },
    {
      path: `${subjectPath}/README.md`,
      content: `# ${data.subject}

Team projects for ${data.batch}, ${data.semester}, ${data.subject}.

Next level: team project folders.
`
    }
  ];
}

export function generatePullRequestBody(data, { hasReportPdf, overwrittenExistingProject = false, replacedFileCount = 0 }) {
  return `## Project Upload Summary

- Batch: ${data.batch}
- Semester: ${data.semester}
- Subject: ${data.subject}
- Team: ${data.teamNumber}
- Project title: ${titleFromSlug(data.projectName)}
- Tools used: ${data.toolsUsed}
- Technologies used: ${data.technologiesUsed}
- Sources/references used: ${data.sourcesUsed}
- Report PDF uploaded: ${hasReportPdf ? "yes" : "no"}
- Google Drive report link: ${data.googleDriveReportLink ? "yes" : "no"}
- Working video link: ${data.workingVideoLink ? "yes" : "no"}
- Problem statement: ${data.problemStatement ? "provided" : "derived from description"}
- Setup instructions: ${data.setupInstructions ? "provided" : "not available"}
- Run/test steps: ${data.runTestSteps ? "provided" : "not available"}
- Demo output details: ${data.demoOutput ? "provided" : "not available"}
- Additional README comments: ${data.additionalReadmeComments ? "yes" : "no"}
- Existing project folder replaced: ${overwrittenExistingProject ? `yes (${replacedFileCount} file${replacedFileCount === 1 ? "" : "s"})` : "no"}
- Confirmation: The submitter confirmed that no passwords, API keys, tokens, or private data were intentionally uploaded.

Automated checks should verify the generated README and uploaded files before the merge workflow completes.
`;
}

export function pullRequestTitle(data) {
  return `Add project: ${data.teamNumber}-${data.projectName} - ${data.batch} ${data.semester} ${data.subject}`;
}
