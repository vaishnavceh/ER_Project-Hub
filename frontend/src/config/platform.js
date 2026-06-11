export const appVersion = "1.5.0 stable build";

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const backendHealthPath = "/api/health";
export const sourceRepository = "vaishnavceh/ER_Project-Hub";
export const storageRepository = "ELECTRICAL-AND-COMPUTER-TKMCE/ELECTRICAL-AND-COMPUTER-PROJECT-REPOSITORY-OFFICIAL";
export const creatorProfileUrl = "https://github.com/vaishnavceh";
export const templatesFolderUrl =
  "https://github.com/ELECTRICAL-AND-COMPUTER-TKMCE/ELECTRICAL-AND-COMPUTER-PROJECT-REPOSITORY-OFFICIAL/tree/main/TEMPLATES";

export const deploymentNotes = [
  "Website source code is maintained in ER_Project-Hub.",
  "Student project files are stored in the official Electrical and Computer project repository.",
  "Course templates are available in the official repository TEMPLATES folder.",
  "The frontend connects to the configured project service.",
  "System health and deployment checks are available through the Admin Pane."
];

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
