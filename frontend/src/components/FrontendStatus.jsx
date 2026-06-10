import { AlertCircle, CheckCircle2, Clock3, Loader2, Monitor, RefreshCcw, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const renderBackendUrl = "https://er-project-hub-backend.onrender.com";
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || renderBackendUrl).replace(/\/$/, "");

const checkTemplate = [
  {
    id: "origin",
    title: "Frontend origin",
    description: "Browser URL",
    status: "idle"
  },
  {
    id: "app",
    title: "App shell",
    description: "Current page response",
    status: "idle"
  },
  {
    id: "config",
    title: "Runtime config",
    description: "API base URL",
    status: "idle"
  }
];

export default function FrontendStatus() {
  const [overallStatus, setOverallStatus] = useState({ type: "idle", message: "Frontend check has not run yet." });
  const [checks, setChecks] = useState(checkTemplate);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const [events, setEvents] = useState([]);

  const currentUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.href;
  }, []);

  const isChecking = overallStatus.type === "checking";

  useEffect(() => {
    void runFrontendCheck();
  }, []);

  async function runFrontendCheck() {
    const startedAt = performance.now();

    setOverallStatus({ type: "checking", message: "Checking the frontend app now." });
    setLastCheckedAt(null);
    setEvents([
      createEvent("info", `Frontend URL: ${currentUrl}`),
      createEvent("info", `API target: ${apiBaseUrl}`)
    ]);
    setChecks(
      checkTemplate.map((check) => ({
        ...check,
        status: check.id === "origin" ? "success" : check.id === "app" ? "running" : "idle",
        detail: check.id === "origin" ? window.location.origin : undefined
      }))
    );

    try {
      const response = await fetch(currentUrl, { cache: "no-store" });
      const contentType = response.headers.get("content-type") || "";
      const duration = Math.round(performance.now() - startedAt);

      if (!response.ok) {
        throw new Error(`Frontend app shell returned HTTP ${response.status}.`);
      }

      updateCheck("app", {
        status: "success",
        detail: `Loaded in ${duration} ms`
      });
      appendEvent("success", `App shell response: HTTP ${response.status} ${contentType}`);
    } catch (error) {
      updateCheck("app", {
        status: "error",
        detail: error.message || "Frontend app shell check failed."
      });
      appendEvent("error", error.message || "Frontend app shell check failed.");
      setOverallStatus({ type: "error", message: "Frontend app shell is not responding correctly." });
      setLastCheckedAt(new Date());
      return;
    }

    if (apiBaseUrl) {
      updateCheck("config", {
        status: "success",
        detail: apiBaseUrl
      });
      appendEvent("success", "Runtime config has an API base URL.");
      setOverallStatus({ type: "success", message: "Frontend is online and configured with an API target." });
    } else {
      updateCheck("config", {
        status: "warning",
        detail: "Missing API base URL."
      });
      appendEvent("warning", "Runtime config is missing the API base URL.");
      setOverallStatus({ type: "warning", message: "Frontend is online, but API config needs attention." });
    }

    setLastCheckedAt(new Date());
  }

  function updateCheck(id, patch) {
    setChecks((current) => current.map((check) => (check.id === id ? { ...check, ...patch } : check)));
  }

  function appendEvent(type, message) {
    setEvents((current) => [...current, createEvent(type, message)]);
  }

  return (
    <section className="space-y-4">
      <div className={`rounded-lg border p-5 shadow-soft ${getOverallClasses(overallStatus.type)}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/80">
              <OverallIcon status={overallStatus.type} />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">{getOverallTitle(overallStatus.type)}</h2>
              <p className="mt-2 text-sm leading-6">{overallStatus.message}</p>
              <p className="mt-3 break-all rounded-lg bg-white/70 px-3 py-2 text-sm font-medium">{currentUrl}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void runFrontendCheck()}
            disabled={isChecking}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {isChecking ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <RefreshCcw size={16} aria-hidden="true" />}
            {isChecking ? "Checking" : "Run check"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {checks.map((check) => (
          <CheckCard key={check.id} check={check} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-soft">
          <div className="flex items-center gap-3 px-5 py-4 text-slate-100">
            <Settings size={20} aria-hidden="true" />
            <div>
              <h3 className="font-semibold">Frontend process log</h3>
              <p className="text-sm text-slate-400">App shell and runtime config</p>
            </div>
          </div>
          <div className="border-t border-slate-800 p-4">
            <div className="space-y-2 font-mono text-sm leading-6 text-slate-100">
              {events.map((event) => (
                <div key={event.id} className="grid gap-2 rounded-lg bg-slate-900 px-3 py-2 sm:grid-cols-[92px_1fr]">
                  <span className="text-slate-400">{event.time}</span>
                  <span className={`break-words ${getEventTextClass(event.type)}`}>{event.message}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-100 text-teal-800">
              <Monitor size={20} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-950">Frontend service</h3>
              <p className="text-sm text-slate-500">React/Vite client</p>
            </div>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-slate-700">API base URL</dt>
              <dd className="mt-1 break-all rounded-lg bg-slate-100 px-3 py-2 text-slate-700">{apiBaseUrl}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Last checked</dt>
              <dd className="mt-1 text-slate-600">{lastCheckedAt ? lastCheckedAt.toLocaleString() : "Not checked yet"}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
}

function CheckCard({ check }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{check.title}</h3>
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
    checking: "Checking frontend",
    success: "Frontend online",
    warning: "Frontend online with warning",
    error: "Frontend not reachable",
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
