import { CalendarClock, Code2, Rocket, UserRound } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import {
  appVersion,
  backendHealthPath,
  deployedBackendUrl,
  deploymentNotes,
  localFrontendUrl,
  sourceRepository,
  storageRepository
} from "../config/platform.js";

const upcomingFeatures = [
  "Admin dashboard for review, merge, and rejection notes",
  "Student login and team submission history",
  "Search and filters by batch, semester, subject, team, and technology",
  "Vercel frontend deployment after local testing is stable",
  "Template/resource workflow after construction testing is complete"
];

const testChecklist = [
  "Local frontend runs on port 5174",
  "Frontend calls the Render backend",
  "Render health path responds at /api/health",
  "Uploads create a branch and pull request",
  "Merged projects appear in the repository browser",
  "Admin Pane can check frontend and backend status"
];

export default function KnowMore() {
  return (
    <div>
      <PageHeader eyebrow="Know More" title="About & deployment">
        This project is now in nightly deployment testing for Electrical and Computer project submissions, with the deployment details kept here in one place.
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard icon={Code2} title="Version" accent="sky">
          <p>Version {appVersion}.</p>
        </InfoCard>
        <InfoCard icon={UserRound} title="Project Creator" accent="teal">
          <p>Created for the Electrical and Computer project repository workflow by Vaishnav Ceh.</p>
        </InfoCard>
        <InfoCard icon={CalendarClock} title="Deployment Plan" accent="emerald">
          <p>Backend is deployed on Render. Frontend is being tested locally on {localFrontendUrl} before Vercel deployment.</p>
        </InfoCard>
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <InfoCard icon={Rocket} title="Deployment Status" accent="emerald">
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-slate-800">Backend</dt>
              <dd className="break-words">{deployedBackendUrl}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-800">Health path</dt>
              <dd>{backendHealthPath}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-800">Frontend test URL</dt>
              <dd>{localFrontendUrl}</dd>
            </div>
          </dl>
        </InfoCard>
        <InfoCard icon={Code2} title="GitHub Repositories" accent="sky">
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-slate-800">Website source</dt>
              <dd className="break-words">{sourceRepository}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-800">Student project storage</dt>
              <dd className="break-words">{storageRepository}</dd>
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
        <InfoCard icon={Rocket} title="Deployment Notes" accent="teal">
          <ul className="grid gap-2">
            {deploymentNotes.map((note) => (
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
