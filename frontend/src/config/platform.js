export const appVersion = "2.5.0 nightly build";

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const backendHealthPath = "/api/health";
export const sourceRepository = "vaishnavceh/ER_Project-Hub";
export const storageRepository = "ELECTRICAL-AND-COMPUTER-TKMCE/ELECTRICAL-AND-COMPUTER-PROJECT-REPOSITORY-OFFICIAL";
export const storageRepositoryUrl = `https://github.com/${storageRepository}`;
export const creatorProfileUrl = "https://github.com/vaishnavceh";
export const documentationPdfUrl =
  "https://raw.githubusercontent.com/vaishnavceh/ER_Project-Hub/main/docs/ER_Project_Hub_Overleaf_Documentation.pdf";
export const documentationPdfGitHubUrl =
  "https://github.com/vaishnavceh/ER_Project-Hub/blob/main/docs/ER_Project_Hub_Overleaf_Documentation.pdf";
export const templatesFolderUrl =
  `${storageRepositoryUrl}/tree/main/TEMPLATES`;

export const deploymentNotes = [
  "Website source code is maintained in ER_Project-Hub.",
  "Student project files are stored in the official department project repository.",
  "Course templates are available in the official repository TEMPLATES folder.",
  "The frontend connects to the configured project service.",
  "System health and deployment checks are available through the Admin Pane."
];

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
