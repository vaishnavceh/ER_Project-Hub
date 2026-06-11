import path from "node:path";

import { HttpError } from "./httpError.js";

const allowedProjectTypes = new Set([
  "Software Project",
  "Electronics/Electrical Project",
  "Mini Project",
  "Final Year Project"
]);

const defaultDepartmentId = "eee";
const departments = new Map([
  [defaultDepartmentId, "Electrical & Electronics Engineering (EEE)"]
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
  ["projectName", "Project title is required."],
  ["batch", "Batch is required."],
  ["semester", "Semester is required."],
  ["subject", "Subject is required."],
  ["teamNumber", "Team number is required."],
  ["teamMembers", "Student information is required."],
  ["githubRepositoryLink", "GitHub repository link is required."],
  ["guideName", "Guide name is required."],
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

  if (data.batch && !/^batch-20\d{2}$/.test(data.batch)) {
    errors.push("Invalid batch selection. Choose a valid batch year, for example 2027.");
  }

  if (data.semester && !/^semester-[1-8]$/.test(data.semester)) {
    errors.push("Invalid semester selection. Choose Semester 1 through Semester 8.");
  }

  if (data.subject && !isUrlSafeLowercase(data.subject)) {
    errors.push("Subject could not be converted into a repository-safe folder name.");
  }

  if (data.teamNumber && !/^team-(0[1-9]|[1-9][0-9]|100)$/.test(data.teamNumber)) {
    errors.push("Team number must be between team-01 and team-100.");
  }

  if (data.projectName && !isUrlSafeLowercase(data.projectName)) {
    errors.push("Project title could not be converted into a repository-safe folder name.");
  }

  if (data.projectType && !allowedProjectTypes.has(data.projectType)) {
    errors.push("Invalid project type selected.");
  }

  if (data.githubRepositoryLink && !isGitHubRepositoryUrl(data.githubRepositoryLink)) {
    errors.push("Enter a valid GitHub repository URL, for example https://github.com/owner/project.");
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
  const data = Object.fromEntries(
    Object.entries(body || {}).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
  );
  const rawProjectTitle = data.projectTitle || data.projectName || "";
  const departmentId = normalizeDepartmentId(data.departmentId);
  const department = departments.get(departmentId);

  return {
    ...data,
    batch: normalizeBatchValue(data.batch || ""),
    semester: normalizeSemesterValue(data.semester || ""),
    subject: toSlug(data.subject || ""),
    projectName: toSlug(rawProjectTitle),
    projectTitle: rawProjectTitle.trim(),
    departmentId,
    department,
    guideDepartment: department,
    facultyDepartment: department
  };
}

function isUrlSafeLowercase(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function normalizeBatchValue(value) {
  const normalized = String(value || "").trim();

  if (/^batch-\d{4}$/.test(normalized)) {
    return normalized;
  }

  if (/^\d{4}$/.test(normalized)) {
    return `batch-${normalized}`;
  }

  return "";
}

function normalizeSemesterValue(value) {
  const normalized = String(value || "").trim().toLowerCase().replace(/\s+/g, "-");
  const semesterMatch = /^(?:semester-?|sem-?)?([1-8])$/.exec(normalized);

  return semesterMatch ? `semester-${semesterMatch[1]}` : "";
}

function normalizeDepartmentId(value) {
  const candidate = String(value || defaultDepartmentId).trim().toLowerCase();

  return departments.has(candidate) ? candidate : defaultDepartmentId;
}

function toSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isGitHubRepositoryUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const pathParts = url.pathname.replace(/\.git$/, "").split("/").filter(Boolean);

    return (url.protocol === "https:" || url.protocol === "http:") && hostname === "github.com" && pathParts.length >= 2;
  } catch {
    return false;
  }
}
