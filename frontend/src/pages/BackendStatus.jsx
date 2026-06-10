import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  ExternalLink,
  GitBranch,
  Loader2,
  RefreshCcw,
  Server,
  Terminal
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";

const renderBackendUrl = "https://er-project-hub-backend.onrender.com";
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || renderBackendUrl).replace(/\/$/, "");

const checkTemplate = [
  {
    id: "target",
    title: "Render target",
    description: "Configured backend URL",
    status: "idle"
  },
  {
    id: "health",
    title: "Health endpoint",
    description: "GET /api/health",
    status: "idle"
  },
  {
    id: "repository",
    title: "Storage repo access",
    description: "GET /api/repository/files",
    status: "idle"
  }
];

export default function BackendStatus({ showHeader = true }) {
  const [overallStatus, setOverallStatus] = useState({ type: "idle", message: "Backend check has not run yet." });
  const [checks, setChecks] = useState(checkTemplate);
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const [isCommandOpen, setIsCommandOpen] = useState(true);
  const requestIdRef = useRef(0);

  const healthUrl = useMemo(() => `${apiBaseUrl}/api/health`, []);
  const repositoryUrl = useMemo(() => `${apiBaseUrl}/api/repository/files`, []);
  const isChecking = overallStatus.type === "checking";

  useEffect(() => {
    void runBackendCheck();
  }, []);

  async function runBackendCheck() {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const startedAt = performance.now();

    setSummary(null);
    setLastCheckedAt(null);
    setOverallStatus({ type: "checking", message: "Checking the Render backend now." });
    setChecks(
      checkTemplate.map((check) => ({
        ...check,
        status: check.id === "target" ? "success" : check.id === "health" ? "running" : "idle",
        detail: check.id === "target" ? apiBaseUrl : undefined
      }))
    );
    setEvents([
      createEvent("info", `Target backend: ${apiBaseUrl}`),
      createEvent("info", `Command: GET ${healthUrl}`)
    ]);

    try {
      const healthStartedAt = performance.now();
      const healthResponse = await fetch(healthUrl, { cache: "no-store" });
      const healthPayload = await readJson(healthResponse);
      const healthDuration = Math.round(performance.now() - healthStartedAt);

      if (!healthResponse.ok) {
        throw new Error(`Health check failed with HTTP ${healthResponse.status}.`);
      }

      if (healthPayload?.status !== "ok") {
        throw new Error("Health endpoint responded, but status was not ok.");
      }

      if (!isCurrentRequest(requestId)) {
        return;
      }

      updateCheck("health", {
        status: "success",
        detail: `Status ok in ${healthDuration} ms`
      });
      appendEvent("success", `Health response: ${formatJson(healthPayload)}`);
      appendEvent("info", `Command: GET ${repositoryUrl}`);
      updateCheck("repository", { status: "running", detail: "Checking GitHub storage access..." });
    } catch (error) {
      if (!isCurrentRequest(requestId)) {
        return;
      }

      const message = getConnectionMessage(error);
      updateCheck("health", { status: "error", detail: message });
      updateCheck("repository", { status: "idle", detail: "Skipped because the health check failed." });
      appendEvent("error", message);
      setOverallStatus({ type: "error", message: "Render backend is not reachable from this frontend." });
      setLastCheckedAt(new Date());
      return;
    }

    try {
      const repositoryStartedAt = performance.now();
      const repositoryResponse = await fetch(repositoryUrl, { cache: "no-store" });
      const repositoryPayload = await readJson(repositoryResponse);
      const repositoryDuration = Math.round(performance.now() - repositoryStartedAt);

      if (!repositoryResponse.ok) {
        throw new Error(repositoryPayload?.error || `Repository check failed with HTTP ${repositoryResponse.status}.`);
      }

      if (!isCurrentRequest(requestId)) {
        return;
      }

      const itemCount = Array.isArray(repositoryPayload?.items) ? repositoryPayload.items.length : 0;
      updateCheck("repository", {
        status: "success",
        detail: `${itemCount} root item${itemCount === 1 ? "" : "s"} found in ${repositoryDuration} ms`
      });
      appendEvent(
        "success",
        `Repository response: ${repositoryPayload?.owner || "owner"}/${repositoryPayload?.repo || "repo"} on ${repositoryPayload?.branch || "main"}`
      );
      setSummary({
        owner: repositoryPayload?.owner,
        repo: repositoryPayload?.repo,
        branch: repositoryPayload?.branch,
        itemCount,
        duration: Math.round(performance.now() - startedAt)
      });
      setOverallStatus({ type: "success", message: "Render backend is online and can read the GitHub storage repository." });
      setLastCheckedAt(new Date());
    } catch (error) {
      if (!isCurrentRequest(requestId)) {
        return;
      }

      const message = error.message || "Repository check failed.";
      updateCheck("repository", { status: "warning", detail: message });
      appendEvent("warning", message);
      setOverallStatus({ type: "warning", message: "Render backend is online, but the GitHub storage check needs attention." });
      setLastCheckedAt(new Date());
    }
  }

  function isCurrentRequest(requestId) {
    return requestIdRef.current === requestId;
  }

  function updateCheck(id, patch) {
    setChecks((current) => current.map((check) => (check.id === id ? { ...check, ...patch } : check)));
  }

  function appendEvent(type, message) {
    setEvents((current) => [...current, createEvent(type, message)]);
  }

  return (
    <div className="space-y-6">
      {showHeader ? (
        <PageHeader eyebrow="Backend Status" title="Backend working status">
          Check whether the Render backend is reachable and whether it can read the GitHub project storage repository.
        </PageHeader>
      ) : null}

      <section className={`rounded-lg border p-5 shadow-soft ${getOverallClasses(overallStatus.type)}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/80">
              <OverallIcon status={overallStatus.type} />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">{getOverallTitle(overallStatus.type)}</h2>
              <p className="mt-2 text-sm leading-6">{overallStatus.message}</p>
              <p className="mt-3 break-all rounded-lg bg-white/70 px-3 py-2 text-sm font-medium">{apiBaseUrl}</p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={healthUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-current bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white"
            >
              <ExternalLink size={16} aria-hidden="true" />
              Open health
            </a>
            <button
              type="button"
              onClick={() => void runBackendCheck()}
              disabled={isChecking}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
            >
              {isChecking ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <RefreshCcw size={16} aria-hidden="true" />}
              {isChecking ? "Checking" : "Run check"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {checks.map((check) => (
          <CheckCard key={check.id} check={check} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <CommandMenu events={events} isOpen={isCommandOpen} onToggle={() => setIsCommandOpen((value) => !value)} />

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-100 text-sky-800">
                <Server size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-950">Render service</h2>
                <p className="text-sm text-slate-500">Production Node backend</p>
              </div>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-slate-700">Health path</dt>
                <dd className="mt-1 break-all rounded-lg bg-slate-100 px-3 py-2 text-slate-700">/api/health</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Last checked</dt>
                <dd className="mt-1 text-slate-600">{lastCheckedAt ? lastCheckedAt.toLocaleString() : "Not checked yet"}</dd>
              </div>
            </dl>
          </section>

          <RepositorySummary summary={summary} />
        </aside>
      </section>
    </div>
  );
}

function CheckCard({ check }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950">{check.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{check.description}</p>
        </div>
        <CheckIcon status={check.status} />
      </div>
      <p className="mt-4 min-h-10 break-words rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
        {check.detail || getCheckMessage(check.status)}
      </p>
    </article>
  );
}

function CommandMenu({ events, isOpen, onToggle }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-soft">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-slate-100 hover:bg-slate-900"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Terminal size={20} aria-hidden="true" />
          <span>
            <span className="block font-semibold">Command menu</span>
            <span className="block text-sm text-slate-400">Backend process log</span>
          </span>
        </span>
        {isOpen ? <ChevronDown size={19} aria-hidden="true" /> : <ChevronRight size={19} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div className="border-t border-slate-800 p-4">
          {events.length ? (
            <div className="space-y-2 font-mono text-sm leading-6 text-slate-100">
              {events.map((event) => (
                <div key={event.id} className="grid gap-2 rounded-lg bg-slate-900 px-3 py-2 sm:grid-cols-[92px_1fr]">
                  <span className="text-slate-400">{event.time}</span>
                  <span className={`break-words ${getEventTextClass(event.type)}`}>{event.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-400">Run a check to show backend process output.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}

function RepositorySummary({ summary }) {
  if (!summary) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-soft">
        Repository details will appear after the storage check completes.
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-emerald-800">
          <Database size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold">Storage repo connected</h2>
          <p className="text-sm text-emerald-800">Backend can read project files.</p>
        </div>
      </div>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-medium">Repository</dt>
          <dd className="break-words">{summary.owner && summary.repo ? `${summary.owner}/${summary.repo}` : "Connected"}</dd>
        </div>
        <div>
          <dt className="font-medium">Branch</dt>
          <dd className="flex items-center gap-2">
            <GitBranch size={15} aria-hidden="true" />
            {summary.branch || "main"}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Root items</dt>
          <dd>{summary.itemCount}</dd>
        </div>
        <div>
          <dt className="font-medium">Total check time</dt>
          <dd>{summary.duration} ms</dd>
        </div>
      </dl>
    </section>
  );
}

function OverallIcon({ status }) {
  if (status === "checking") {
    return <Loader2 className="animate-spin text-sky-700" size={22} aria-hidden="true" />;
  }

  if (status === "success") {
    return <CheckCircle2 className="text-emerald-700" size={22} aria-hidden="true" />;
  }

  if (status === "warning") {
    return <AlertCircle className="text-amber-700" size={22} aria-hidden="true" />;
  }

  if (status === "error") {
    return <AlertCircle className="text-rose-700" size={22} aria-hidden="true" />;
  }

  return <Clock3 className="text-slate-700" size={22} aria-hidden="true" />;
}

function CheckIcon({ status }) {
  const baseClass = "mt-0.5 shrink-0";

  if (status === "running") {
    return <Loader2 className={`${baseClass} animate-spin text-sky-700`} size={20} aria-hidden="true" />;
  }

  if (status === "success") {
    return <CheckCircle2 className={`${baseClass} text-emerald-700`} size={20} aria-hidden="true" />;
  }

  if (status === "warning") {
    return <AlertCircle className={`${baseClass} text-amber-700`} size={20} aria-hidden="true" />;
  }

  if (status === "error") {
    return <AlertCircle className={`${baseClass} text-rose-700`} size={20} aria-hidden="true" />;
  }

  return <Clock3 className={`${baseClass} text-slate-400`} size={20} aria-hidden="true" />;
}

function getOverallTitle(status) {
  const titles = {
    checking: "Checking backend",
    success: "Backend online",
    warning: "Backend online with warning",
    error: "Backend not reachable",
    idle: "Ready to check"
  };

  return titles[status] || titles.idle;
}

function getOverallClasses(status) {
  const classes = {
    checking: "border-sky-200 bg-sky-50 text-sky-950",
    success: "border-emerald-200 bg-emerald-50 text-emerald-950",
    warning: "border-amber-200 bg-amber-50 text-amber-950",
    error: "border-rose-200 bg-rose-50 text-rose-950",
    idle: "border-slate-200 bg-white text-slate-900"
  };

  return classes[status] || classes.idle;
}

function getCheckMessage(status) {
  const messages = {
    idle: "Waiting for the check to run.",
    running: "Checking now...",
    success: "Completed successfully.",
    warning: "Completed with a warning.",
    error: "Check failed."
  };

  return messages[status] || messages.idle;
}

function getEventTextClass(type) {
  const classes = {
    success: "text-emerald-300",
    warning: "text-amber-300",
    error: "text-rose-300",
    info: "text-slate-100"
  };

  return classes[type] || classes.info;
}

function createEvent(type, message) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    message,
    time: new Date().toLocaleTimeString()
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function formatJson(payload) {
  if (!payload) {
    return "empty response";
  }

  return JSON.stringify(payload);
}

function getConnectionMessage(error) {
  if (error instanceof TypeError) {
    return "Connection blocked or failed. Check Render status, the backend URL, and the backend CORS origin setting.";
  }

  return error.message || "Backend health check failed.";
}
