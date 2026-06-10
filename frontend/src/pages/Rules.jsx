import { ShieldCheck } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { deployedBackendUrl, storageRepository } from "../config/platform.js";

const rules = [
  "Upload only under correct batch folder",
  "Select correct semester folder",
  "Select correct subject folder",
  "Use team project folder format",
  "Do not upload passwords, API keys, tokens, or secrets",
  "Avoid unnecessary large files",
  "Upload report PDF if available",
  "Use Google Drive link if report is large",
  "Mention tools used",
  "Mention sources/references used",
  "Follow academic honesty rules",
  "Do not edit deployment or backend settings from student submissions"
];

export default function Rules() {
  return (
    <div>
      <PageHeader eyebrow="Rules" title="Keep the repository clean and safe">
        These rules protect other teams' work, keep {storageRepository} clean, and make review faster through the deployed backend.
      </PageHeader>

      <InfoCard icon={ShieldCheck} title="Submission Rules" accent="rose">
        <ul className="grid gap-2 sm:grid-cols-2">
          {rules.map((rule) => (
            <li key={rule} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
              {rule}
            </li>
          ))}
        </ul>
      </InfoCard>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-soft">
        Current backend endpoint: {deployedBackendUrl}. Uploads must go through the website so every change arrives as a pull request.
      </section>
    </div>
  );
}
