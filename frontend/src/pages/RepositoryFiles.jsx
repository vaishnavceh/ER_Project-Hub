import { AlertCircle, ChevronRight, ExternalLink, File, Folder, Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import { deployedBackendUrl, storageRepository } from "../config/platform.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || deployedBackendUrl;

export default function RepositoryFiles() {
  const [currentPath, setCurrentPath] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: "loading" });

  const breadcrumbs = useMemo(() => buildBreadcrumbs(currentPath), [currentPath]);

  useEffect(() => {
    let ignore = false;

    async function loadFiles() {
      setStatus({ type: "loading" });

      try {
        const params = new URLSearchParams();
        if (currentPath) {
          params.set("path", currentPath);
        }

        const response = await fetch(`${apiBaseUrl}/api/repository/files?${params.toString()}`);
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || "Could not load repository files.");
        }

        if (!ignore) {
          setResult(payload);
          setStatus({ type: "success" });
        }
      } catch (error) {
        if (!ignore) {
          const message =
            error instanceof TypeError
              ? `Backend connection error. Check the configured backend at ${apiBaseUrl}.`
              : error.message;

          setStatus({ type: "error", message });
        }
      }
    }

    loadFiles();

    return () => {
      ignore = true;
    };
  }, [currentPath, refreshKey]);

  return (
    <div>
      <PageHeader eyebrow="Repository Files" title="Browse GitHub files inside the website">
        View uploaded project folders from {storageRepository} through the deployed backend without opening GitHub separately.
      </PageHeader>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {result ? `${result.owner}/${result.repo}` : "Repository"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Branch: {result?.branch || "main"}</p>
          </div>
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Refresh
          </button>
        </div>

        <nav className="mt-4 flex flex-wrap items-center gap-2 text-sm" aria-label="Repository path">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path || "root"} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPath(crumb.path)}
                className={`rounded-lg px-2 py-1 font-medium ${
                  index === breadcrumbs.length - 1 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {crumb.label}
              </button>
              {index < breadcrumbs.length - 1 ? <ChevronRight size={15} className="text-slate-400" aria-hidden="true" /> : null}
            </span>
          ))}
        </nav>

        <RepositoryFileList status={status} result={result} onOpenFolder={setCurrentPath} />
      </section>
    </div>
  );
}

function RepositoryFileList({ status, result, onOpenFolder }) {
  if (status.type === "loading") {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        <Loader2 className="animate-spin" size={18} aria-hidden="true" />
        Loading repository files...
      </div>
    );
  }

  if (status.type === "error") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950">
        <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
        <p>{status.message}</p>
      </div>
    );
  }

  if (!result?.items?.length) {
    return <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">No files found in this repository path.</p>;
  }

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
      {result.items.map((item) => {
        const isDirectory = item.type === "dir";
        const Icon = isDirectory ? Folder : File;

        return (
          <div key={item.path} className="flex flex-col gap-3 border-b border-slate-200 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={!isDirectory}
              onClick={() => isDirectory && onOpenFolder(item.path)}
              className={`flex min-w-0 items-center gap-3 text-left ${isDirectory ? "text-sky-800 hover:text-sky-950" : "cursor-default text-slate-700"}`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${isDirectory ? "bg-sky-100 text-sky-800" : "bg-slate-100 text-slate-600"}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block break-words text-sm font-semibold">{item.name}</span>
                <span className="block break-words text-xs text-slate-500">{item.path}</span>
              </span>
            </button>
            <div className="flex shrink-0 items-center gap-2">
              {item.htmlUrl ? (
                <a
                  href={item.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  GitHub
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function buildBreadcrumbs(path) {
  const parts = path ? path.split("/") : [];
  const crumbs = [{ label: "root", path: "" }];

  parts.forEach((part, index) => {
    crumbs.push({
      label: part,
      path: parts.slice(0, index + 1).join("/")
    });
  });

  return crumbs;
}
