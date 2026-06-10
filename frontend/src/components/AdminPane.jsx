import { Eye, EyeOff, LockKeyhole, LogOut, ShieldCheck, UnlockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import BackendStatus from "../pages/BackendStatus.jsx";
import FrontendStatus from "./FrontendStatus.jsx";

const sessionKey = "department-project-hub-admin";

export default function AdminPane() {
  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const configuredPasskeys = useMemo(() => getConfiguredPasskeys(), []);
  const isConfigured = configuredPasskeys.length > 0;

  useEffect(() => {
    setIsAuthenticated(window.sessionStorage.getItem(sessionKey) === "active");
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isConfigured) {
      setError("Admin passkey is not configured.");
      return;
    }

    if (!configuredPasskeys.includes(passkey.trim())) {
      setError("Wrong passkey.");
      return;
    }

    window.sessionStorage.setItem(sessionKey, "active");
    setIsAuthenticated(true);
    setPasskey("");
  }

  function handleLogout() {
    window.sessionStorage.removeItem(sessionKey);
    setIsAuthenticated(false);
    setPasskey("");
    setError("");
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-900 text-white">
            <LockKeyhole size={21} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">Admin Pane</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">System status checks</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Backend and frontend checks are available after admin login.</p>
          </div>
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} aria-hidden="true" />
            Logout
          </button>
        ) : null}
      </div>

      {isAuthenticated ? (
        <div className="mt-6 space-y-8">
          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-100 text-teal-800">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-950">Frontend status check</h3>
                <p className="text-sm text-slate-500">Current client app and runtime configuration</p>
              </div>
            </div>
            <FrontendStatus />
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-100 text-sky-800">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-950">Backend status check</h3>
                <p className="text-sm text-slate-500">Project API and GitHub storage connection</p>
              </div>
            </div>
            <BackendStatus showHeader={false} />
          </section>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 max-w-md">
          <label className="block">
            <span className="text-sm font-medium text-slate-800">Admin passkey</span>
            <span className="mt-2 flex rounded-lg border border-slate-300 bg-white focus-within:border-sky-600">
              <input
                type={showPasskey ? "text" : "password"}
                value={passkey}
                onChange={(event) => setPasskey(event.target.value)}
                disabled={!isConfigured}
                className="min-w-0 flex-1 rounded-l-lg border-0 px-3 py-3 text-sm text-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                placeholder={isConfigured ? "Enter passkey" : "Passkey not configured"}
              />
              <button
                type="button"
                onClick={() => setShowPasskey((value) => !value)}
                disabled={!isConfigured}
                className="grid w-11 place-items-center rounded-r-lg text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                aria-label={showPasskey ? "Hide passkey" : "Show passkey"}
              >
                {showPasskey ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
              </button>
            </span>
          </label>

          {error ? <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-950">{error}</p> : null}

          {!isConfigured ? (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              Add VITE_ADMIN_PASSKEY to the frontend environment.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!isConfigured}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <UnlockKeyhole size={17} aria-hidden="true" />
            Login
          </button>
        </form>
      )}
    </section>
  );
}

function getConfiguredPasskeys() {
  const rawValue = import.meta.env.VITE_ADMIN_PASSKEYS || import.meta.env.VITE_ADMIN_PASSKEY || "";

  return rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}
