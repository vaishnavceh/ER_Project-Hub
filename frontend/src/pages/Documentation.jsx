import { ExternalLink, FileText } from "lucide-react";
import { useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import { documentationPdfGitHubUrl, documentationPreviewUrl } from "../config/platform.js";

export default function Documentation() {
  const [previewLoaded, setPreviewLoaded] = useState(false);

  return (
    <div>
      <PageHeader eyebrow="Documentation" title="Read project documentation">
        View the latest compiled project documentation inside the website.
      </PageHeader>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <FileText size={21} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">ER Project Hub Documentation</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                The PDF preview loads only when requested, so opening Home will not trigger a browser download.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPreviewLoaded(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <FileText size={16} aria-hidden="true" />
              Preview PDF
            </button>
            <a
              href={documentationPdfGitHubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Open on GitHub
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        {previewLoaded ? (
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <iframe
              title="Electrical and Computer Project Repository Hub Documentation"
              src={documentationPreviewUrl}
              className="h-[72vh] min-h-[520px] w-full bg-white"
            />
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            PDF preview is ready. Use Preview PDF to load it inside this page.
          </div>
        )}
      </section>
    </div>
  );
}
