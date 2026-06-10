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
        For electronics, electrical, embedded systems, IoT, robotics, or hardware-based projects, upload the available design, implementation, and testing material.
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
    </div>
  );
}
