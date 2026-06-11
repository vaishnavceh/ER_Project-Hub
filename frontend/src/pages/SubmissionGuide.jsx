import { Cpu, FileText, ShieldCheck } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const readmeItems = [
  "Project title, student information, batch, semester, subject, and GitHub repository link",
  "Guide name, guide designation, faculty attribution, and default EEE department metadata",
  "Project description and problem statement",
  "Tools, technologies, sources, and references used",
  "Setup steps, run/test steps, demo evidence, and future improvements",
  "Project report PDF, Google Drive links, presentation notes, and extra comments"
];

const hardwareItems = [
  "Circuit diagram, block diagram, component list, and equipment list",
  "Simulation files, source code, datasheets, and configuration files",
  "Hardware photos, testing procedure, output result, and working video link"
];

const safetyRules = [
  "Select the correct batch and semester from the dropdowns",
  "Use a valid GitHub repository URL for the project source link",
  "Do not upload passwords, API keys, tokens, private keys, or private data",
  "Avoid unnecessary large files and use Drive links for large reports or videos",
  "Follow academic honesty rules and contact the admin for wrong uploads or merge concerns"
];

export default function SubmissionGuide() {
  return (
    <div>
      <PageHeader eyebrow="Submission Guide" title="One checklist before upload">
        A compact guide for project metadata, README content, hardware evidence, and repository safety rules.
      </PageHeader>

      <section className="grid gap-4 lg:grid-cols-3">
        <GuideCard icon={FileText} title="README" accent="teal" items={readmeItems}>
          Generated README files use upload form details first, readable report PDF sections second, and Not available when no detail is found.
        </GuideCard>
        <GuideCard icon={Cpu} title="Hardware" accent="amber" items={hardwareItems}>
          Electronics, electrical, embedded, IoT, robotics, and hardware projects should include enough evidence for review after upload.
        </GuideCard>
        <GuideCard icon={ShieldCheck} title="Rules" accent="rose" items={safetyRules}>
          Uploads must go through the website. Auto-merge and auto-pull run after checks pass.
        </GuideCard>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-soft">
        Select Batch 2027 to store the project under batch-2027, select Semester 6 to store it under semester-6, and let the platform create the final repository path automatically.
      </section>
    </div>
  );
}

function GuideCard({ icon, title, accent, items, children }) {
  return (
    <InfoCard icon={icon} title={title} accent={accent}>
      <p className="mb-4">{children}</p>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </InfoCard>
  );
}
