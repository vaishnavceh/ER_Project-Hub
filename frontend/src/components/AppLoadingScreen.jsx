import { CheckCircle2, ClipboardList, Server } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { appVersion, backendHealthPath } from "../config/platform.js";

const statusMessages = [
  "Preparing frontend workspace...",
  "Checking Render backend...",
  "Connecting GitHub storage repository...",
  "Loading project hub..."
];

const terminalLines = [
  `GET ${backendHealthPath}`,
  "Render backend ready",
  "Repository workflow loaded"
];

export default function AppLoadingScreen({ ready = false, onFinished }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [hidden, setHidden] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % statusMessages.length);
    }, 1600);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (visibleLines >= terminalLines.length) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setVisibleLines((count) => count + 1);
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [visibleLines]);

  function handleTransitionEnd(event) {
    if (event.target !== event.currentTarget || !ready || finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    setHidden(true);
    onFinished?.();
  }

  if (hidden) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!ready}
      onTransitionEnd={handleTransitionEnd}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-50 px-6 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-20 w-20 rounded-2xl bg-teal-500/10 motion-safe:animate-ping motion-reduce:hidden" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-soft">
            <ClipboardList className="h-9 w-9 text-teal-600" aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-semibold tracking-normal text-slate-900 sm:text-2xl">
            Electrical &amp; Computer Project Repository Hub
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <Server className="h-3.5 w-3.5" aria-hidden="true" />
            {appVersion}
          </span>
        </div>

        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500 motion-safe:animate-bounce motion-reduce:opacity-60 [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500 motion-safe:animate-bounce motion-reduce:opacity-60 [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500 motion-safe:animate-bounce motion-reduce:opacity-60" />
        </div>

        <p key={messageIndex} className="min-h-5 text-sm text-slate-500">
          {statusMessages[messageIndex]}
        </p>

        <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-left shadow-soft">
          <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-900 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span className="ml-2 font-mono text-xs text-slate-400">status</span>
          </div>
          <div className="space-y-1.5 p-4 font-mono text-xs leading-relaxed sm:text-sm">
            {terminalLines.map((line, index) => {
              const shown = index < visibleLines;
              const isCommand = index === 0;

              return (
                <p
                  key={line}
                  className={`flex items-center gap-2 transition-opacity duration-300 motion-reduce:transition-none ${
                    shown ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {isCommand ? (
                    <span className="text-teal-400">$</span>
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                  )}
                  <span className={isCommand ? "text-slate-200" : "text-slate-400"}>{line}</span>
                </p>
              );
            })}
            {visibleLines >= terminalLines.length ? (
              <span className="inline-block h-4 w-2 bg-teal-400 align-middle motion-safe:animate-pulse motion-reduce:opacity-60" aria-hidden="true" />
            ) : null}
          </div>
        </div>

        <span className="sr-only">Loading the Electrical and Computer Project Repository Hub. Please wait.</span>
      </div>
    </div>
  );
}
