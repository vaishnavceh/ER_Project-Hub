import { FileText } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const requirements = [
  "Project title",
  "Team name and members",
  "Batch, semester, and subject",
  "Project description",
  "Problem statement",
  "Tools used for creation",
  "Technologies used",
  "Sources or references used for coding, circuit design, learning, or implementation",
  "Installation/setup instructions",
  "Steps to run or test the project",
  "Screenshots/photos/demo output",
  "Project report PDF, if available",
  "Google Drive report link if the report PDF is too large",
  "Presentation details, if available",
  "Future improvements, if any"
];

export default function ReadmeRequirements() {
  return (
    <div>
      <PageHeader eyebrow="README Requirements" title="Every project needs a useful README">
        The backend auto-generates a starter README from the upload form, and teams can improve it after review if needed.
      </PageHeader>

      <InfoCard icon={FileText} title="Required README Sections" accent="teal">
        <ul className="grid gap-2 sm:grid-cols-2">
          {requirements.map((item) => (
            <li key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
              {item}
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}
