import { CalendarClock, Code2, GitPullRequest, Rocket, UserRound } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { appVersion } from "../config/platform.js";

const upcomingFeatures = [
  "Admin dashboard for review, merge, and rejection notes",
  "Student login and team submission history",
  "Search and filters by batch, semester, subject, team, and technology",
  "Frontend production deployment after testing is stable",
  "Template/resource workflow after construction testing is complete"
];

const testChecklist = [
  "Frontend loads the project hub correctly",
  "Upload form creates a GitHub branch and pull request",
  "Auto-merge and auto-pull workflow completes after checks pass",
  "Merged projects appear in the repository browser",
  "Admin Pane can check system status when needed"
];

export default function KnowMore() {
  return (
    <div>
      <PageHeader eyebrow="Know More" title="About this platform">
        This project is in nightly testing for Electrical and Computer project submissions, with automated GitHub upload and merge support enabled.
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard icon={Code2} title="Version" accent="sky">
          <p>Version {appVersion}.</p>
        </InfoCard>
        <InfoCard icon={UserRound} title="Project Creator" accent="teal">
          <p>Created for the Electrical and Computer project repository workflow by Vaishnav Ceh.</p>
        </InfoCard>
        <InfoCard icon={CalendarClock} title="Deployment Plan" accent="emerald">
          <p>The production frontend connects to the configured project service. Server details are kept out of public pages.</p>
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
          </dl>
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
            <p className="text-sm text-slate-500">Planned additions after the nightly deployment test is stable.</p>
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
