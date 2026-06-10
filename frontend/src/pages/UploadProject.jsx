import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Loader2,
  Terminal,
  UploadCloud
} from "lucide-react";
import { useMemo, useState } from "react";

import { SelectInput, TextArea, TextInput } from "../components/FormControls.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { buildApiUrl } from "../config/platform.js";

const storageRepositoryUrl =
  import.meta.env.VITE_STORAGE_REPOSITORY_URL ||
  "https://github.com/ELECTRICAL-AND-COMPUTER-TKMCE/ELECTRICAL-AND-COMPUTER-PROJECT-REPOSITORY-OFFICIAL.git";
const storageRepositoryName = repositoryNameFromUrl(storageRepositoryUrl);

const initialForm = {
  batch: "",
  semester: "",
  subject: "",
  teamNumber: "",
  projectName: "",
  teamMembers: "",
  projectDescription: "",
  problemStatement: "",
  toolsUsed: "",
  technologiesUsed: "",
  sourcesUsed: "",
  setupInstructions: "",
  runTestSteps: "",
  demoOutput: "",
  presentationDetails: "",
  futureImprovements: "",
  additionalReadmeComments: "",
  projectType: "Software Project",
  googleDriveReportLink: "",
  workingVideoLink: "",
  confirmation: false
};

const projectTypes = [
  "Software Project",
  "Electronics/Electrical Project",
  "Mini Project",
  "Final Year Project"
];

export default function UploadProject() {
  const [form, setForm] = useState(initialForm);
  const [projectFiles, setProjectFiles] = useState([]);
  const [reportPdf, setReportPdf] = useState(null);
  const [status, setStatus] = useState({ type: "idle" });

  const previewPath = useMemo(() => buildPreviewPath(form), [form]);
  const isUploading = status.type === "loading";

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function normalizeSlugField(field) {
    setForm((current) => ({
      ...current,
      [field]: toSlug(current[field])
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "loading" });

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      body.append(key, key === "confirmation" ? String(value) : value);
    });

    projectFiles.forEach((file) => body.append("projectFiles", file));
    if (reportPdf) {
      body.append("reportPdf", reportPdf);
    }

    try {
      const response = await fetch(buildApiUrl("/api/projects/upload"), {
        method: "POST",
        body
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Upload failed. Please check the form and try again.");
      }

      setStatus({ type: "success", data: payload });
      if (payload.pullRequestNumber) {
        void pollPullRequestStatus(payload.pullRequestNumber);
      }
    } catch (error) {
      const message =
        error instanceof TypeError
          ? "Connection error. Please refresh, then contact the admin if uploads still fail."
          : error.message;

      setStatus({ type: "error", message });
    }
  }

  async function pollPullRequestStatus(pullRequestNumber) {
    setStatus((current) =>
      current.type === "success"
        ? {
            ...current,
            pullRequestStatus: {
              status: "checking",
              message: "Checking whether the pull request has been accepted..."
            }
          }
        : current
    );

    for (let attempt = 0; attempt < 8; attempt += 1) {
      if (attempt > 0) {
        await wait(4000);
      }

      try {
        const response = await fetch(buildApiUrl(`/api/projects/pull-requests/${pullRequestNumber}/status`));
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || "Could not check pull request status.");
        }

        setStatus((current) =>
          current.type === "success"
            ? {
                ...current,
                pullRequestStatus: payload
              }
            : current
        );

        if (payload.status === "accepted" || payload.status === "not_accepted") {
          return;
        }
      } catch (error) {
        setStatus((current) =>
          current.type === "success"
            ? {
                ...current,
                pullRequestStatus: {
                  status: "unknown",
                  message: `${error.message} Contact the repository administrator if the project does not appear in the repository.`
                }
              }
            : current
        );
        return;
      }
    }

    setStatus((current) =>
      current.type === "success"
        ? {
            ...current,
            pullRequestStatus: {
              status: "pending",
              message:
                "Pull request was created, but it has not been confirmed as accepted yet. If it is not merged soon, contact the repository administrator."
            }
          }
        : current
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Upload Project" title="Submit a team project">
        The system creates a branch, uploads the files to GitHub, and runs the automated pull request workflow.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Batch year"
              name="batch"
              value={form.batch}
              onChange={handleChange}
              placeholder="batch-2027"
              required
            />
            <TextInput
              label="Semester"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              placeholder="semester-5"
              required
            />
            <TextInput
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              onBlur={() => normalizeSlugField("subject")}
              placeholder="dbms"
              required
            />
            <TextInput
              label="Team number"
              name="teamNumber"
              value={form.teamNumber}
              onChange={handleChange}
              placeholder="team-01 to team-100"
              pattern="team-(0[1-9]|[1-9][0-9]|100)"
              title="Use team-01 through team-100"
              maxLength={8}
              required
            />
            <TextInput
              label="Project name"
              name="projectName"
              value={form.projectName}
              onChange={handleChange}
              onBlur={() => normalizeSlugField("projectName")}
              placeholder="library-management"
              required
            />
            <SelectInput label="Project type" name="projectType" value={form.projectType} onChange={handleChange}>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </SelectInput>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextArea
              label="Team members"
              name="teamMembers"
              value={form.teamMembers}
              onChange={handleChange}
              placeholder="Team name and member names"
              required
            />
            <TextArea
              label="Project description"
              name="projectDescription"
              value={form.projectDescription}
              onChange={handleChange}
              placeholder="Short explanation of what the project does"
              required
            />
            <TextArea
              label="Problem statement"
              name="problemStatement"
              value={form.problemStatement}
              onChange={handleChange}
              placeholder="Optional. If empty, the README will derive this from the project description"
              rows={3}
            />
            <TextArea
              label="Tools used"
              name="toolsUsed"
              value={form.toolsUsed}
              onChange={handleChange}
              placeholder="VS Code, Proteus, Arduino IDE, Figma"
              required
            />
            <TextArea
              label="Technologies used"
              name="technologiesUsed"
              value={form.technologiesUsed}
              onChange={handleChange}
              placeholder="React, Node.js, MySQL, Arduino"
              required
            />
          </div>

          <TextArea
            label="Sources or references used"
            name="sourcesUsed"
            value={form.sourcesUsed}
            onChange={handleChange}
            placeholder="Documentation, tutorials, books, sample circuits, papers, or learning references"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <TextArea
              label="Installation or setup instructions"
              name="setupInstructions"
              value={form.setupInstructions}
              onChange={handleChange}
              placeholder="Optional. Example: import database.sql, update config.php, run on XAMPP"
              rows={3}
            />
            <TextArea
              label="Steps to run or test"
              name="runTestSteps"
              value={form.runTestSteps}
              onChange={handleChange}
              placeholder="Optional. Example: start Apache/MySQL, open localhost path, login, test main flow"
              rows={3}
            />
            <TextArea
              label="Screenshots, photos, or demo output"
              name="demoOutput"
              value={form.demoOutput}
              onChange={handleChange}
              placeholder="Optional. Mention uploaded screenshots, hardware photos, simulation output, or demo evidence"
              rows={3}
            />
            <TextArea
              label="Presentation details"
              name="presentationDetails"
              value={form.presentationDetails}
              onChange={handleChange}
              placeholder="Optional. Mention slides, seminar notes, or presentation status"
              rows={3}
            />
            <TextArea
              label="Future improvements"
              name="futureImprovements"
              value={form.futureImprovements}
              onChange={handleChange}
              placeholder="Optional. Add planned improvements, limitations, or next features"
              rows={3}
            />
          </div>

          <TextArea
            label="Additional README comments"
            name="additionalReadmeComments"
            value={form.additionalReadmeComments}
            onChange={handleChange}
            placeholder="Optional notes to include in the generated README.md, such as known issues, setup warnings, hardware notes, or extra project context"
            rows={3}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Project files upload</span>
              <input
                type="file"
                multiple
                required
                onChange={(event) => setProjectFiles(Array.from(event.target.files || []))}
                className="mt-2 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Project report PDF upload</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => setReportPdf(event.target.files?.[0] || null)}
                className="mt-2 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Google Drive report link"
              name="googleDriveReportLink"
              value={form.googleDriveReportLink}
              onChange={handleChange}
              placeholder="Optional, for large reports"
              type="url"
            />
            <TextInput
              label="Working video link"
              name="workingVideoLink"
              value={form.workingVideoLink}
              onChange={handleChange}
              placeholder="Optional demo video URL"
              type="url"
            />
          </div>

          <label className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <input
              type="checkbox"
              name="confirmation"
              checked={form.confirmation}
              onChange={handleChange}
              required
              className="mt-1 h-4 w-4 shrink-0 rounded border-amber-400 text-teal-600"
            />
            <span>
              I confirm that this project belongs to my team and does not contain passwords, API keys, tokens, or private data.
            </span>
          </label>

          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
          >
            {isUploading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <UploadCloud size={18} aria-hidden="true" />}
            {isUploading ? "Uploading..." : "Create Pull Request"}
          </button>
        </form>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-950">GitHub Path Preview</h2>
            <p className="mt-2 text-sm text-slate-600">Final project folder:</p>
            <code className="mt-3 block break-words rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{previewPath}</code>
          </section>

          <StatusPanel status={status} />
          <GitCommandWindow status={status} previewPath={previewPath} />
        </aside>
      </div>
    </div>
  );
}

function StatusPanel({ status }) {
  if (status.type === "success") {
    return (
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-soft">
        <h2 className="font-semibold">Project uploaded successfully.</h2>
        <p className="mt-2 text-sm">
          A pull request has been created. The system is checking whether GitHub accepted and merged it.
        </p>
        <PullRequestStatus status={status.pullRequestStatus} />
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="font-medium">Branch</dt>
            <dd className="break-words">{status.data.branchName}</dd>
          </div>
          <div>
            <dt className="font-medium">Project path</dt>
            <dd className="break-words">{status.data.projectPath}</dd>
          </div>
        </dl>
        {status.data.pullRequestUrl ? (
          <a
            href={status.data.pullRequestUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Open pull request
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        ) : null}
      </section>
    );
  }

  if (status.type === "error") {
    return (
      <section className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-950 shadow-soft">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
          <div>
            <h2 className="font-semibold">Upload error</h2>
            <p className="mt-2 text-sm">{status.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-soft">
      Successful uploads will show the created branch, pull request link, and GitHub project path here.
    </section>
  );
}

function GitCommandWindow({ status, previewPath }) {
  const [copied, setCopied] = useState(false);
  const commandLines = buildGitCommandLines(status, previewPath);
  const processSteps = buildGitProcessSteps(status);
  const copyText = commandLines
    .map((line) => line.text)
    .filter((text) => text && !text.startsWith("#"))
    .join("\n");

  async function handleCopy() {
    try {
      await window.navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3 text-slate-100">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-800 text-emerald-300">
            <Terminal size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold">Git window</h2>
            <p className="truncate text-xs text-slate-400">{storageRepositoryName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-700 px-2.5 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800"
        >
          <Copy size={14} aria-hidden="true" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          {processSteps.map((step) => (
            <div key={step.label} className="flex items-start gap-2 text-xs leading-5">
              <StepIcon state={step.state} />
              <div className="min-w-0">
                <p className={step.state === "pending" ? "text-slate-500" : "text-slate-200"}>{step.label}</p>
                {step.detail ? <p className="break-words text-slate-500">{step.detail}</p> : null}
              </div>
            </div>
          ))}
        </div>

        <pre className="max-h-80 overflow-auto rounded-lg bg-black/40 p-3 text-xs leading-6 text-slate-100">
          <code>
            {commandLines.map((line, index) => (
              <span key={`${line.text}-${index}`} className={`block ${line.kind === "comment" ? "text-slate-500" : "text-emerald-300"}`}>
                {line.text}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </section>
  );
}

function StepIcon({ state }) {
  if (state === "active") {
    return <Loader2 className="mt-0.5 shrink-0 animate-spin text-sky-300" size={15} aria-hidden="true" />;
  }

  if (state === "success") {
    return <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={15} aria-hidden="true" />;
  }

  if (state === "warning") {
    return <AlertCircle className="mt-0.5 shrink-0 text-amber-300" size={15} aria-hidden="true" />;
  }

  if (state === "error") {
    return <AlertCircle className="mt-0.5 shrink-0 text-rose-300" size={15} aria-hidden="true" />;
  }

  return <Clock3 className="mt-0.5 shrink-0 text-slate-500" size={15} aria-hidden="true" />;
}

function buildGitProcessSteps(status) {
  if (status.type === "loading") {
    return [
      { label: "Upload request sent", state: "success" },
      { label: "Backend creating GitHub branch", state: "active" },
      { label: "Uploading files and README", state: "pending" },
      { label: "Opening pull request", state: "pending" }
    ];
  }

  if (status.type === "success") {
    const prStatus = status.pullRequestStatus?.status;

    return [
      { label: "Branch created", state: "success", detail: status.data.branchName },
      { label: "Pull request opened", state: "success", detail: status.data.pullRequestUrl },
      {
        label: prStatus === "accepted" ? "Pull request merged" : "Checking merge status",
        state: prStatus === "accepted" ? "success" : prStatus === "not_accepted" || prStatus === "unknown" ? "warning" : "active",
        detail: status.pullRequestStatus?.message || "Waiting for GitHub Actions or automated merge checks."
      },
      {
        label: prStatus === "accepted" ? "Pull latest main" : "Pull latest main after merge",
        state: prStatus === "accepted" ? "success" : "pending"
      }
    ];
  }

  if (status.type === "error") {
    return [
      { label: "Upload stopped", state: "error", detail: status.message },
      { label: "GitHub branch not created", state: "pending" },
      { label: "Pull request not opened", state: "pending" }
    ];
  }

  return [
    { label: "Ready", state: "success", detail: "Git pull commands are prepared." },
    { label: "Waiting for upload", state: "pending" },
    { label: "Pull latest accepted projects", state: "pending" }
  ];
}

function buildGitCommandLines(status, previewPath) {
  const baseCommands = [
    comment("# Project storage repository"),
    command(`git clone ${storageRepositoryUrl}`),
    command(`cd ${storageRepositoryName}`),
    command("git checkout main")
  ];

  if (status.type === "loading") {
    return [
      ...baseCommands,
      comment("# Backend upload is running"),
      command("git fetch origin"),
      command("git pull origin main"),
      comment("# Waiting for the new upload branch and pull request...")
    ];
  }

  if (status.type === "success") {
    const prStatus = status.pullRequestStatus?.status;
    const projectPath = status.data.projectPath || previewPath;
    const lines = [
      ...baseCommands,
      comment("# Backend created this upload branch"),
      command(`git fetch origin ${status.data.branchName}`),
      command(`git checkout ${status.data.branchName}`),
      comment(`# Project path: ${projectPath}`)
    ];

    if (status.data.pullRequestUrl) {
      lines.push(comment(`# Pull request: ${status.data.pullRequestUrl}`));
    }

    if (prStatus === "accepted") {
      lines.push(comment("# Pull the accepted project from main"));
      lines.push(command("git checkout main"));
      lines.push(command("git pull origin main"));
    } else if (prStatus === "not_accepted" || prStatus === "unknown") {
      lines.push(comment("# PR needs attention before main can receive this upload"));
      lines.push(command("git checkout main"));
      lines.push(command("git pull origin main"));
    } else {
      lines.push(comment("# After GitHub Actions or auto-merge"));
      lines.push(command("git checkout main"));
      lines.push(command("git pull origin main"));
    }

    return lines;
  }

  if (status.type === "error") {
    return [
      ...baseCommands,
      comment("# Upload failed before a branch or pull request was created"),
      command("git pull origin main"),
      comment(`# Last preview path: ${previewPath}`)
    ];
  }

  return [
    ...baseCommands,
    comment("# Pull accepted project uploads"),
    command("git pull origin main"),
    comment(`# Current form preview: ${previewPath}`)
  ];
}

function command(text) {
  return { kind: "command", text };
}

function comment(text) {
  return { kind: "comment", text };
}

function PullRequestStatus({ status }) {
  if (!status) {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-100 p-3 text-sm text-amber-950">
        <Clock3 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
        <p>Waiting for GitHub to report whether the pull request is accepted. If it is not merged, contact the repository administrator.</p>
      </div>
    );
  }

  if (status.status === "accepted") {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-emerald-300 bg-white p-3 text-sm text-emerald-950">
        <CheckCircle2 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
        <p>{status.message}</p>
      </div>
    );
  }

  const isProblem = status.status === "not_accepted" || status.status === "unknown";

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-lg border p-3 text-sm ${
        isProblem ? "border-rose-300 bg-rose-100 text-rose-950" : "border-amber-200 bg-amber-100 text-amber-950"
      }`}
    >
      {isProblem ? <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" /> : <Clock3 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />}
      <p>{status.message}</p>
    </div>
  );
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function buildPreviewPath(form) {
  const batch = form.batch || "batch-2027";
  const semester = form.semester || "semester-5";
  const subject = form.subject || "dbms";
  const teamNumber = form.teamNumber || "team-01";
  const projectName = form.projectName || "library-management";

  return `batches/${batch}/${semester}/${subject}/${teamNumber}-${projectName}/`;
}

function toSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function repositoryNameFromUrl(url) {
  return url
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/^git@github\.com:/, "")
    .replace(/\.git$/, "")
    .split("/")
    .slice(-2)
    .join("/");
}
