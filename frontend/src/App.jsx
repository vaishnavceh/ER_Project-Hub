import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Cpu,
  FileText,
  FolderTree,
  Home,
  Info,
  Moon,
  ShieldCheck,
  Sun,
  UploadCloud,
  FolderOpen
} from "lucide-react";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

import AppLoadingScreen from "./components/AppLoadingScreen.jsx";
import Navigation from "./components/Navigation.jsx";
import { appVersion, backendHealthPath, buildApiUrl } from "./config/platform.js";
import ElectronicsGuidance from "./pages/ElectronicsGuidance.jsx";
import Guidelines from "./pages/Guidelines.jsx";
import HomePage from "./pages/HomePage.jsx";
import KnowMore from "./pages/KnowMore.jsx";
import ReadmeRequirements from "./pages/ReadmeRequirements.jsx";
import RepositoryFiles from "./pages/RepositoryFiles.jsx";
import RepositoryStructure from "./pages/RepositoryStructure.jsx";
import Rules from "./pages/Rules.jsx";
import TemplatesResources from "./pages/TemplatesResources.jsx";
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
  { id: "templates", label: "Templates", icon: BookOpen, component: TemplatesResources },
  { id: "know-more", label: "Know More", icon: Info, component: KnowMore }
];

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [isAppReady, setIsAppReady] = useState(false);
  const [theme, setTheme] = useState(() => window.localStorage.getItem("project-hub-theme") || "light");
  const ActiveComponent = pages.find((page) => page.id === activePage)?.component || HomePage;

  useEffect(() => {
    window.localStorage.setItem("project-hub-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    let ignore = false;

    async function prepareApp() {
      const minimumDelay = wait(1500);

      await Promise.allSettled([
        minimumDelay,
        fetch(buildApiUrl(backendHealthPath), { cache: "no-store" })
      ]);

      if (!ignore) {
        setIsAppReady(true);
      }
    }

    void prepareApp();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className={`min-h-screen text-slate-900 ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <AppLoadingScreen ready={isAppReady} />
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
                <span className="block text-sm text-slate-500">GitHub submissions, auto-merge, and repository browsing</span>
              </span>
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                <CheckCircle2 size={17} aria-hidden="true" />
                <span>{appVersion}</span>
              </div>
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1" aria-label="Theme mode">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  aria-label="Use light mode"
                  title="Light mode"
                  className={`grid h-9 w-9 place-items-center rounded-md transition ${
                    theme === "light" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <Sun size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  aria-label="Use dark mode"
                  title="Dark mode"
                  className={`grid h-9 w-9 place-items-center rounded-md transition ${
                    theme === "dark" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <Moon size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <Navigation pages={pages} activePage={activePage} onChange={setActivePage} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ActiveComponent onNavigate={setActivePage} />
      </main>
      <Analytics />
    </div>
  );
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}
