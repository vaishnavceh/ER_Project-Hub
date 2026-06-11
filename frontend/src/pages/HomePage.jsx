import { BookOpen, FileText, FolderOpen, FolderTree, GitPullRequest, UploadCloud } from "lucide-react";

import AdminPane from "../components/AdminPane.jsx";
import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function HomePage({ onNavigate }) {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <PageHeader title="Electrical & Computer Project Repository Hub">
            Upload, auto-merge, auto-pull, and browse department student projects without using Git commands or repository naming rules.
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
            <button
              type="button"
              onClick={() => onNavigate("documentation")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <FileText size={18} aria-hidden="true" />
              Read Documentation
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
              <GitPullRequest size={21} aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">Automated GitHub workflow</h2>
              <p className="text-sm text-slate-500">Uploads become pull requests and auto-merge after checks pass.</p>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
{`main
  ^
  | auto-merge + auto-pull after checks
upload/batch-2027-sem6-dbms-team-01-library-management
  |
  + project files + README.md`}
          </pre>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard icon={UploadCloud} title="Student friendly" accent="teal">
          Students select batch and semester, then add project, guide, faculty, file, and report details through one form.
        </InfoCard>
        <InfoCard icon={FolderTree} title="Organized folders" accent="sky">
          Projects are placed under batches, semesters, subjects, and team project folders in a predictable structure.
        </InfoCard>
        <InfoCard icon={GitPullRequest} title="Auto pull enabled" accent="emerald">
          The system creates a pull request and completes the automated merge/pull workflow after checks pass. Contact the admin for concerns.
        </InfoCard>
      </section>

      <AdminPane />
    </div>
  );
}
