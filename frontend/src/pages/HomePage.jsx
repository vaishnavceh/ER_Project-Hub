import { BookOpen, FolderOpen, FolderTree, GitPullRequest, UploadCloud } from "lucide-react";

import AdminPane from "../components/AdminPane.jsx";
import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function HomePage({ onNavigate }) {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <PageHeader title="Electrical & Computer Project Repository Hub">
            Upload, review, and browse Electrical and Computer student projects without using Git commands.
          </PageHeader>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate("upload")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-700"
            >
              <UploadCloud size={18} aria-hidden="true" />
              Upload Project
            </button>
            <button
              type="button"
              onClick={() => onNavigate("guidelines")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <BookOpen size={18} aria-hidden="true" />
              View Guidelines
            </button>
            <button
              type="button"
              onClick={() => onNavigate("files")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <FolderOpen size={18} aria-hidden="true" />
              View Repository Files
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
              <GitPullRequest size={21} aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">Safe GitHub workflow</h2>
              <p className="text-sm text-slate-500">Every upload becomes a branch and pull request.</p>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
{`main
  ^
  | maintainer review
upload/batch-2027-sem5-dbms-team-01-library-management
  |
  + project files + README.md`}
          </pre>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard icon={UploadCloud} title="Student friendly" accent="teal">
          Students submit batch, semester, subject, team details, project files, and report links through one form.
        </InfoCard>
        <InfoCard icon={FolderTree} title="Organized folders" accent="sky">
          Projects are placed under batches, semesters, subjects, and team project folders in a predictable structure.
        </InfoCard>
        <InfoCard icon={GitPullRequest} title="Maintainer review" accent="emerald">
          The backend creates a pull request so maintainers can inspect, request fixes, and merge safely.
        </InfoCard>
      </section>

      <AdminPane />
    </div>
  );
}
