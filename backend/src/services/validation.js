import path from "node:path";

import { HttpError } from "./httpError.js";

const allowedProjectTypes = new Set([
  "Software Project",
  "Electronics/Electrical Project",
  "Mini Project",
  "Final Year Project"
]);

const blockedExtensions = new Set([
  ".bat",
  ".cmd",
  ".com",
  ".dll",
  ".dylib",
  ".exe",
  ".msi",
  ".p12",
  ".pem",
  ".pfx",
  ".ps1",
  ".scr",
  ".so",
  ".vbs"
]);

const secretNamePattern =
  /(^|[.\-_\s])(env|secret|secrets|token|tokens|password|passwords|credential|credentials|private-key|private_key|id_rsa|id_dsa|id_ed25519|aws_credentials)([.\-_\s]|$)/i;

const requiredFields = [
  ["batch", "Batch year is required."],
  ["semester", "Semester is required."],
  ["subject", "Subject is required."],
  ["teamNumber", "Team number is required."],
  ["projectName", "Project name is required."],
  ["teamMembers", "Team members are required."],
  ["projectDescription", "Project description is required."],
  ["toolsUsed", "Tools used are required."],
  ["technologiesUsed", "Technologies used are required."],
  ["sourcesUsed", "Sources or references used are required."],
  ["projectType", "Project type is required."]
];

export function validateProjectSubmission(body, files = {}) {
  const errors = [];
  const data = normalizeBody(body);

  for (const [field, message] of requiredFields) {
    if (!data[field]) {
      errors.push(message);
    }
  }

  if (data.batch && !/^batch-\d{4}$/.test(data.batch)) {
    errors.push("Invalid batch format. Use batch-YYYY, for example batch-2027.");
  }

  if (data.semester && !/^semester-[1-9][0-9]?$/.test(data.semester)) {
    errors.push("Invalid semester format. Use semester-N, for example semester-5.");
  }

  if (data.subject && !isUrlSafeLowercase(data.subject)) {
    errors.push("Subject must be lowercase and URL-safe, for example dbms or web-development.");
  }

  if (data.teamNumber && !/^team-\d{2}$/.test(data.teamNumber)) {
    errors.push("Team number must match team-01, team-02, etc.");
  }

  if (data.projectName && !isUrlSafeLowercase(data.projectName)) {
    errors.push("Project name must be lowercase and URL-safe, for example library-management.");
  }

  if (data.projectType && !allowedProjectTypes.has(data.projectType)) {
    errors.push("Invalid project type selected.");
  }

  if (data.confirmation !== "true" && data.confirmation !== "on") {
    errors.push("Please confirm that the upload belongs to your team and does not contain private data.");
  }

  const projectFiles = files.projectFiles || [];
  if (projectFiles.length === 0) {
    errors.push("Please upload at least one project file.");
  }

  for (const file of [...projectFiles, ...(files.reportPdf || [])]) {
    const fileError = validateUploadFileName(file.originalname, file.fieldname);
    if (fileError) {
      errors.push(fileError);
    }
  }

  if (errors.length > 0) {
    throw new HttpError(400, errors[0]);
  }

  return data;
}

export function validateUploadFileName(originalName, fieldName = "projectFiles") {
  if (!originalName) {
    return "Every uploaded file must have a valid filename.";
  }

  if (originalName.includes("..") || originalName.includes("/") || originalName.includes("\\")) {
    return "Filenames cannot contain folder paths or path traversal characters.";
  }

  const baseName = path.basename(originalName).trim();
  const lowerName = baseName.toLowerCase();
  const extension = path.extname(lowerName);

  if (!baseName) {
    return "Every uploaded file must have a valid filename.";
  }

  if (fieldName === "reportPdf" && extension !== ".pdf") {
    return "Project report upload must be a PDF file.";
  }

  if (blockedExtensions.has(extension)) {
    return `The file "${baseName}" uses a blocked extension. Please remove executable or private-key files.`;
  }

  if (lowerName === ".env" || lowerName.endsWith(".env") || secretNamePattern.test(lowerName)) {
    return `The file "${baseName}" looks like it may contain passwords, tokens, private keys, or secrets.`;
  }

  return null;
}

export function buildProjectPath(data) {
  return `batches/${data.batch}/${data.semester}/${data.subject}/${data.teamNumber}-${data.projectName}/`;
}

export function createBranchName(data) {
  const sem = data.semester.replace("semester-", "sem");
  return `upload/${data.batch}-${sem}-${data.subject}-${data.teamNumber}-${data.projectName}`;
}

export function safeUploadFileName(originalName) {
  const parsed = path.parse(path.basename(originalName));
  const safeBase =
    parsed.name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^\.+/, "")
      .slice(0, 100) || "uploaded-file";

  const safeExt = parsed.ext.toLowerCase().replace(/[^a-z0-9.]/g, "");
  return `${safeBase}${safeExt}`;
}

export function uniqueGitHubFilePath(projectPath, folder, originalName, usedNames) {
  const safeName = safeUploadFileName(originalName);
  const parsed = path.parse(safeName);
  let candidate = safeName;
  let counter = 2;

  while (usedNames.has(candidate.toLowerCase())) {
    candidate = `${parsed.name}-${counter}${parsed.ext}`;
    counter += 1;
  }

  usedNames.add(candidate.toLowerCase());
  return `${projectPath}${folder}/${candidate}`;
}

function normalizeBody(body) {
  return Object.fromEntries(
    Object.entries(body || {}).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
  );
}

function isUrlSafeLowercase(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
