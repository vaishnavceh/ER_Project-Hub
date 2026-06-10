import { Cpu } from "lucide-react";

import InfoCard from "../components/InfoCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const hardwareItems = [
  "Project report",
  "Circuit diagram",
  "Block diagram",
  "Components used",
  "Equipment used",
  "Simulation files",
  "Code",
  "Datasheets",
  "Photos of hardware setup",
  "Testing procedure",
  "Output result",
  "Working video link"
];

export default function ElectronicsGuidance() {
  return (
    <div>
      <PageHeader eyebrow="Electronics and Electrical Guidance" title="Hardware projects need clear evidence">
        For electronics, electrical, embedded systems, IoT, robotics, or hardware projects, upload design, implementation, and testing material that can be reviewed after deployment.
      </PageHeader>

      <InfoCard icon={Cpu} title="Suggested Hardware Uploads" accent="amber">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {hardwareItems.map((item) => (
            <li key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
              {item}
            </li>
          ))}
        </ul>
      </InfoCard>

      <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 shadow-soft">
        Course-material and seminar templates for hardware documentation are still under development. Until they are released, include clear diagrams, component details, and test evidence.
      </section>
    </div>
  );
}
