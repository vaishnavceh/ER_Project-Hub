import {
  CalendarClock,
  Code2,
  ExternalLink,
  GitPullRequest,
  Rocket,
  UserRound
} from "lucide-react";

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
  <p>
    Created for Electrical and Computer students to upload, organize, and preserve
    their academic projects.
  </p>

  <div className="mt-4 flex items-center gap-4 rounded-xl border border-[var(--poster-line)] bg-[linear-gradient(135deg,var(--poster-paper),var(--poster-cream))] p-4 shadow-sm">
    <img
      src="https://github.com/vaishnavceh.png"
      alt="Vaishnav Venugopal GitHub profile"
      className="h-16 w-16 rounded-full border-2 border-[var(--poster-gold-soft)] object-cover shadow-sm ring-2 ring-[var(--poster-gold)]"
    />

    <div className="min-w-0 flex-1">
      <h3 className="truncate font-bold text-[var(--poster-navy)]">
        Vaishnav Venugopal
      </h3>

      <p className="text-sm text-[var(--poster-muted)]">
        Creator • ER Project Hub
      </p>

      <p className="mt-1 text-xs font-medium text-[var(--poster-gold-2)]">
        @vaishnavceh
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {["React", "GitHub", "Vercel"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--poster-gold)] bg-[var(--poster-gold-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--poster-navy)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>

  <a
    href={creatorProfileUrl}
    target="_blank"
    rel="noreferrer"
    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--poster-gold-2)] hover:text-[var(--poster-navy)]"
  >
    Visit GitHub Profile
    <ExternalLink size={15} aria-hidden="true" />
  </a>
</InfoCard>

        <InfoCard icon={CalendarClock} title="Deployment Plan" accent="emerald">
          <p>
            The production frontend connects to the configured project service, and
            templates are served from the official repository.
          </p>
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
              <dd>
                Contact the admin for concerns, failed uploads, or incorrect
                submissions.
              </dd>
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
                <a
                  href={templatesFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-900"
                >
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
            <h2 className="text-lg font-semibold text-slate-950">
              Upcoming Features
            </h2>
            <p className="text-sm text-slate-500">
              Planned additions for the next deployment cycle.
            </p>
          </div>
        </div>

        <ul className="grid gap-2 md:grid-cols-2">
          {upcomingFeatures.map((feature) => (
            <li
              key={feature}
              className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}