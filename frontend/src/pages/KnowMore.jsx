import { CalendarClock, Code2, ExternalLink, GitPullRequest, Rocket, UserRound } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { appVersion, creatorProfileUrl, templatesFolderUrl } from "../config/platform.js";

const upcomingFeatures = [
  "Admin dashboard for workflow logs, accepted uploads, and rejection notes",
  "Student login and team submission history",
  "Search and filters by batch, semester, subject, team, and technology",
  "More detailed template previews inside the website",
  "Template download status checks from the Admin Pane"
];

const testChecklist = [
  "Frontend loads the project hub correctly",
  "Upload form creates a GitHub branch and pull request",
  "Auto-merge and auto-pull workflow completes after checks pass",
  "Merged projects appear in the repository browser",
  "Admin Pane can check system status when needed"
];

const solvedIssues = [
  "Team number validation now supports team-01 through team-100.",
  "Optional README comments now appear in generated README.md files when provided.",
  "Generated README files no longer contain unfinished placeholder instructions.",
  "Existing project folders can now be replaced through a new upload PR.",
  "Storage repository configuration now targets the official Electrical and Computer project repository.",
  "Auto-merge workflow guidance is documented for upload branches.",
  "Templates are now live in the official storage repository TEMPLATES folder."
];

const latestUpdates = [
  "Version bumped to 1.6.0 stable build.",
  "Templates page now lists the actual files and folders inside the official TEMPLATES directory.",
  "Creator GitHub profile is linked in public project information.",
  "Existing project uploads now replace previous folder contents through a new pull request.",
  "Generated README files use form input, readable report PDF sections, and clean fallback text.",
  "Documentation, README, repository, and guidelines pages were refreshed for the stable build."
];

export default function KnowMore() {
  return (
    <div>
      <PageHeader eyebrow="Know More" title="About this platform">
        This project is in 1.6.0 stable build for Electrical and Computer project submissions, with automated GitHub upload, merge support, and live template file browsing enabled.
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard icon={Code2} title="Version" accent="sky">
          <p>Version {appVersion}.</p>
        </InfoCard>
        <InfoCard icon={UserRound} title="Project Creator" accent="teal">
          <p>Created for the Electrical and Computer project repository workflow by Vaishnav Ceh.</p>
          <a
            href={creatorProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            GitHub profile
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </InfoCard>
        <InfoCard icon={CalendarClock} title="Deployment Plan" accent="emerald">
          <p>The production frontend connects to the configured project service, and templates are served from the official repository.</p>
        </InfoCard>
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <InfoCard icon={GitPullRequest} title="Workflow Status" accent="emerald">
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-slate-800">Upload mode</dt>
              <dd>Website form to GitHub pull request</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-800">Merge mode</dt>
              <dd>Auto-merge enabled after checks pass</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-800">Support</dt>
              <dd>Contact the admin for concerns, failed uploads, or incorrect submissions.</dd>
            </div>
          </dl>
        </InfoCard>
        <InfoCard icon={Code2} title="Repository Access" accent="sky">
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-slate-800">Students</dt>
              <dd>Use the website to submit and browse project files.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-800">Git users</dt>
              <dd>Use the Git window after upload if you need pull commands.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-800">Templates</dt>
              <dd>
                <a href={templatesFolderUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-900">
                  Open official TEMPLATES folder
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </dd>
            </div>
          </dl>
        </InfoCard>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <InfoCard icon={Rocket} title="1.6.0 Stable Updates" accent="teal">
          <ul className="grid gap-2">
            {latestUpdates.map((item) => (
              <li key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard icon={GitPullRequest} title="Issues Solved" accent="emerald">
          <ul className="grid gap-2">
            {solvedIssues.map((item) => (
              <li key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </InfoCard>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <InfoCard icon={CalendarClock} title="Testing Checklist" accent="emerald">
          <ul className="grid gap-2">
            {testChecklist.map((item) => (
              <li key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard icon={Rocket} title="Operational Notes" accent="teal">
          <ul className="grid gap-2">
            {[
              "Normal student uploads are handled by the automated workflow after checks pass.",
              "Auto-merge and auto-pull are enabled after the configured checks pass.",
              "Incorrect folders, failed uploads, or duplicate submissions should be reported to the admin.",
              "Do not share tokens, passwords, or private files in project uploads."
            ].map((note) => (
              <li key={note} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                {note}
              </li>
            ))}
          </ul>
        </InfoCard>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-100 text-amber-800">
            <Rocket size={21} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Upcoming Features</h2>
            <p className="text-sm text-slate-500">Planned additions for the next deployment cycle.</p>
          </div>
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {upcomingFeatures.map((feature) => (
            <li key={feature} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
