import { BookOpen, ExternalLink, GitPullRequest, UsersRound } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { templatesFolderUrl } from "../config/platform.js";

export default function Guidelines() {
  return (
    <div>
      <PageHeader eyebrow="Upload Guidelines" title="Students do not need Git commands">
        Students upload through the website. The system creates a GitHub branch, opens a pull request, and completes the automated merge flow after checks pass.
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard icon={GitPullRequest} title="How uploads are accepted" accent="emerald">
          <p>
            Normal uploads are handled by the automated workflow. If the checks pass, the project can be merged and pulled into the accepted repository workflow.
          </p>
        </InfoCard>
        <InfoCard icon={UsersRound} title="Team projects only" accent="amber">
          <p>Only team projects are supported. Individual project uploads should not be submitted through this hub.</p>
        </InfoCard>
        <InfoCard icon={BookOpen} title="Use official templates" accent="sky">
          <p>Course, seminar, lab, and review templates are available in the official storage repository.</p>
          <a
            href={templatesFolderUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            Open TEMPLATES folder
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </InfoCard>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-950">Team Folder Format</h2>
        <p className="mt-2 text-sm text-slate-600">Use lowercase names with hyphens so folders remain readable in GitHub and inside the website file browser.</p>
        <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
          <code className="rounded-lg bg-slate-100 px-3 py-2">team-01-project-name</code>
          <code className="rounded-lg bg-slate-100 px-3 py-2">team-02-project-name</code>
          <code className="rounded-lg bg-slate-100 px-3 py-2">team-100-project-name</code>
        </div>
      </section>
    </div>
  );
}
