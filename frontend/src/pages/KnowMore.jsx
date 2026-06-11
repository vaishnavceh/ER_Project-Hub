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
  "Students select batch and semester instead of typing repository folder names.",
  "Project title and subject values are converted into repository-safe folder names automatically.",
  "Guide information is required and stored with the generated project README.",
  "Faculty attribution can be added when available.",
  "GitHub repository links are validated before upload.",
  "Department metadata defaults to Electrical & Electronics Engineering (EEE)."
];

const latestUpdates = [
  "Version bumped to 2.5.0 nightly build.",
  "Upload form now uses searchable batch and semester dropdowns.",
  "Batch 2027 is stored as batch-2027 and Semester 6 is stored as semester-6.",
  "Generated README files include guide, faculty, department, and GitHub repository metadata.",
  "Validation messages now explain missing required metadata and invalid GitHub URLs.",
  "Repository documentation now shows the standardized batch and semester structure."
];

export default function KnowMore() {
  return (
    <div>
      <PageHeader eyebrow="Know More" title="About this platform">
        This project is in 2.5.0 nightly build for department project submissions, with guided metadata collection, automated GitHub upload, merge support, live template browsing, and in-site documentation reading enabled.
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
        <InfoCard icon={Rocket} title="2.5.0 Nightly Updates" accent="teal">
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
