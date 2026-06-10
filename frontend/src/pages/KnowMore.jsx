import { CalendarClock, Code2, Rocket, UserRound } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const upcomingFeatures = [
  "LaTeX templates for seminar submissions",
  "Project report templates for Electrical and Computer students",
  "Presentation templates for project reviews",
  "Admin dashboard for review, merge, and rejection notes",
  "Student login and team submission history",
  "Search and filters by batch, semester, subject, team, and technology",
  "Full deployment plan for a department-scale platform"
];

export default function KnowMore() {
  return (
    <div>
      <PageHeader eyebrow="Know More" title="About this platform">
        This local-first project is being prepared as a full-scale repository platform for Electrical and Computer project submissions.
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard icon={Code2} title="Version" accent="sky">
          <p>Version 1.0.0 local-first Docker preview.</p>
        </InfoCard>
        <InfoCard icon={UserRound} title="Project Creator" accent="teal">
          <p>Created for the Electrical and Computer project repository workflow by Vaishnav Ceh.</p>
        </InfoCard>
        <InfoCard icon={CalendarClock} title="Deployment Plan" accent="emerald">
          <p>Not deployed yet. The current goal is local testing before moving to a full department platform.</p>
        </InfoCard>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-100 text-amber-800">
            <Rocket size={21} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Upcoming Features</h2>
            <p className="text-sm text-slate-500">Planned additions for the full-scale Electrical and Computer platform.</p>
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
