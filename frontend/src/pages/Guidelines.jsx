import { GitPullRequest, UsersRound } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function Guidelines() {
  return (
    <div>
      <PageHeader eyebrow="Upload Guidelines" title="Students do not need Git commands">
        Students can upload project files through the website. The website creates a pull request on GitHub, and the maintainer checks and merges the project.
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard icon={GitPullRequest} title="How uploads are reviewed" accent="emerald">
          <p>Each upload is sent to a new branch. A pull request is opened against the main branch for maintainer review.</p>
        </InfoCard>
        <InfoCard icon={UsersRound} title="Team projects only" accent="amber">
          <p>Only team projects are supported. Individual project uploads should not be submitted through this hub.</p>
        </InfoCard>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-950">Team Folder Format</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
          <code className="rounded-lg bg-slate-100 px-3 py-2">team-01-project-name</code>
          <code className="rounded-lg bg-slate-100 px-3 py-2">team-02-project-name</code>
          <code className="rounded-lg bg-slate-100 px-3 py-2">team-03-project-name</code>
        </div>
      </section>
    </div>
  );
}
