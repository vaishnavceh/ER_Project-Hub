export const appVersion = "1.2.0 nightly build";

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const backendHealthPath = "/api/health";
export const sourceRepository = "vaishnavceh/ER_Project-Hub";
export const storageRepository = "vaishnavceh/Test_Department-Projecthub";

export const deploymentNotes = [
  "Website source code is maintained in ER_Project-Hub.",
  "Student project files are stored in Test_Department-Projecthub.",
  "The frontend connects to the configured project service.",
  "System health and deployment checks are available through the Admin Pane."
];

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
