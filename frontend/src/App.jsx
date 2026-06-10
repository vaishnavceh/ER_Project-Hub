import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Cpu,
  FileText,
  FolderTree,
  Home,
  Info,
  ShieldCheck,
  UploadCloud,
  FolderOpen
} from "lucide-react";
import { useState } from "react";

import Navigation from "./components/Navigation.jsx";
import ElectronicsGuidance from "./pages/ElectronicsGuidance.jsx";
import Guidelines from "./pages/Guidelines.jsx";
import HomePage from "./pages/HomePage.jsx";
import KnowMore from "./pages/KnowMore.jsx";
import ReadmeRequirements from "./pages/ReadmeRequirements.jsx";
import RepositoryFiles from "./pages/RepositoryFiles.jsx";
import RepositoryStructure from "./pages/RepositoryStructure.jsx";
import Rules from "./pages/Rules.jsx";
import UploadProject from "./pages/UploadProject.jsx";

const pages = [
  { id: "home", label: "Home", icon: Home, component: HomePage },
  { id: "upload", label: "Upload Project", icon: UploadCloud, component: UploadProject },
  { id: "files", label: "Files", icon: FolderOpen, component: RepositoryFiles },
  { id: "guidelines", label: "Guidelines", icon: BookOpen, component: Guidelines },
  { id: "structure", label: "Repository", icon: FolderTree, component: RepositoryStructure },
  { id: "readme", label: "README", icon: FileText, component: ReadmeRequirements },
  { id: "electronics", label: "Hardware", icon: Cpu, component: ElectronicsGuidance },
  { id: "rules", label: "Rules", icon: ShieldCheck, component: Rules },
  { id: "know-more", label: "Know More", icon: Info, component: KnowMore }
];

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const ActiveComponent = pages.find((page) => page.id === activePage)?.component || HomePage;

  return (
    <div className="min-h-screen text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setActivePage("home")}
              className="flex w-fit items-center gap-3 text-left"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-600 text-white">
                <ClipboardList size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-semibold">Electrical & Computer Project Repository Hub</span>
                <span className="block text-sm text-slate-500">GitHub submissions, review, and repository browsing</span>
              </span>
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              <CheckCircle2 size={17} aria-hidden="true" />
              Pull-request only workflow
            </div>
          </div>
          <Navigation pages={pages} activePage={activePage} onChange={setActivePage} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ActiveComponent onNavigate={setActivePage} />
      </main>
    </div>
  );
}
