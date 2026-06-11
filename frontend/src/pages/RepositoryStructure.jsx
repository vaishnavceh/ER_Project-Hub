import { ExternalLink, FolderTree } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { templatesFolderUrl } from "../config/platform.js";

export default function RepositoryStructure() {
  return (
    <div>
      <PageHeader eyebrow="Repository Structure" title="Batch to semester to subject to team project">
        Uploaded student files are stored separately from the website source code. Batch and semester folder names are generated from dropdown selections.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-5 text-sm leading-7 text-slate-100 shadow-soft">
{`batches/
  batch-2027/
    semester-1/
    semester-2/
    semester-3/
    semester-4/
    semester-5/
    semester-6/
      dbms/
        team-01-library-management/
    semester-7/
    semester-8/
TEMPLATES/
  reports/
  seminars/
  presentations/
  lab-records/`}
        </pre>
        <InfoCard icon={FolderTree} title="Path Meaning" accent="sky">
          <p>
            Batch identifies the graduating group, semester identifies the academic term, subject groups the course or area, and the team project folder contains files, README, reports, links, guide metadata, and faculty metadata.
          </p>
          <p className="mt-3">
            Selecting Batch 2027 stores batch-2027. Selecting Semester 6 stores semester-6. Students do not need to type these folder names.
          </p>
          <a
            href={templatesFolderUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            Open official TEMPLATES folder
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </InfoCard>
      </div>
    </div>
  );
}
