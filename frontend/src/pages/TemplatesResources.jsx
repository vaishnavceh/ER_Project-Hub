import { BookOpen, CheckCircle2, ExternalLink, FileText, FolderOpen, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { templatesFolderUrl } from "../config/platform.js";

const templateAreas = [
  "Course material templates",
  "Seminar report templates",
  "Seminar presentation templates",
  "Lab record and experiment documentation templates",
  "Project review and evaluation templates",
  "Department announcement and circular templates"
];

const resourceAreas = [
  "Reference README examples",
  "Report structure examples",
  "Presentation structure examples",
  "Hardware documentation checklist",
  "Software testing checklist",
  "Submission review checklist"
];

export default function TemplatesResources() {
  const [mode, setMode] = useState("light");
  const isDark = mode === "dark";

  return (
    <div className={isDark ? "rounded-lg bg-slate-950 p-5 text-slate-100 shadow-soft" : "rounded-lg bg-white p-5 text-slate-950 shadow-soft"}>
      <div className="flex flex-col gap-4 border-b border-current/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className={isDark ? "mb-2 text-sm font-semibold uppercase text-teal-300" : "mb-2 text-sm font-semibold uppercase text-teal-700"}>
            Templates & Resources
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">Course resources workspace</h1>
          <p className={isDark ? "mt-3 text-base leading-7 text-slate-300" : "mt-3 text-base leading-7 text-slate-600"}>
            Official templates for course materials, seminars, labs, and project reviews are now available in the storage repository.
          </p>
        </div>

        <div className={isDark ? "flex rounded-lg border border-slate-700 bg-slate-900 p-1" : "flex rounded-lg border border-slate-200 bg-slate-50 p-1"}>
          <button
            type="button"
            onClick={() => setMode("light")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
              !isDark ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-100"
            }`}
          >
            <Sun size={16} aria-hidden="true" />
            Light
          </button>
          <button
            type="button"
            onClick={() => setMode("dark")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
              isDark ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-950"
            }`}
          >
            <Moon size={16} aria-hidden="true" />
            Dark
          </button>
        </div>
      </div>

      <section className={isDark ? "mt-6 rounded-lg border border-emerald-400/30 bg-emerald-300/10 p-5 text-emerald-100" : "mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className={isDark ? "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-300/20 text-emerald-200" : "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-emerald-800"}>
              <CheckCircle2 size={21} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Templates folder is live</h2>
              <p className="mt-2 text-sm leading-6">
                Students can download official templates directly from the repository folder named <span className="font-semibold">TEMPLATES</span>.
              </p>
            </div>
          </div>
          <a
            href={templatesFolderUrl}
            target="_blank"
            rel="noreferrer"
            className={isDark ? "inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-200" : "inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"}
          >
            <FolderOpen size={16} aria-hidden="true" />
            Open templates
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className={isDark ? "mt-6 rounded-lg border border-slate-800 bg-slate-900 p-5" : "mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5"}>
        <div className="flex items-start gap-3">
          <span className={isDark ? "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-300/15 text-sky-200" : "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800"}>
            <BookOpen size={21} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">How to use templates</h2>
            <p className="mt-2 text-sm leading-6">
              Download the required file, complete it for your course or seminar, and upload the finished project report or supporting files through the Upload Project page.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <ResourcePanel
          isDark={isDark}
          icon={FileText}
          title="Available Template Areas"
          description="Structured files available for students and faculty."
          items={templateAreas}
        />
        <ResourcePanel
          isDark={isDark}
          icon={BookOpen}
          title="Reference Resource Areas"
          description="Reference material for improving submission quality."
          items={resourceAreas}
        />
      </section>
    </div>
  );
}

function ResourcePanel({ isDark, icon: Icon, title, description, items }) {
  return (
    <article className={isDark ? "rounded-lg border border-slate-800 bg-slate-900 p-5" : "rounded-lg border border-slate-200 bg-slate-50 p-5"}>
      <div className="flex items-center gap-3">
        <span className={isDark ? "grid h-10 w-10 place-items-center rounded-lg bg-teal-300/15 text-teal-200" : "grid h-10 w-10 place-items-center rounded-lg bg-teal-100 text-teal-800"}>
          <Icon size={21} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-500"}>{description}</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => (
          <li key={item} className={isDark ? "rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200" : "rounded-lg bg-white px-3 py-2 text-sm text-slate-700"}>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
