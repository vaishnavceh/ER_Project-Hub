import { FolderTree } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function RepositoryStructure() {
  return (
    <div>
      <PageHeader eyebrow="Repository Structure" title="Batch to semester to subject to team project">
        The generated project path follows this order: Batch to Semester to Subject to Team Project.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-5 text-sm leading-7 text-slate-100 shadow-soft">
{`batches/
  batch-2027/
    semester-5/
      dbms/
        team-01-library-management/
      web-development/
      electronics-projects/
    semester-6/
      final-year-projects/`}
        </pre>
        <InfoCard icon={FolderTree} title="Path Meaning" accent="sky">
          <p>
            Batch identifies the graduating group, semester identifies the academic term, subject groups the course or area, and the team project folder contains files, README, reports, and links.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
