import { AlertCircle, CheckCircle2, Clock3, ExternalLink, Loader2, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";

import { SelectInput, TextArea, TextInput } from "../components/FormControls.jsx";
import PageHeader from "../components/PageHeader.jsx";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialForm = {
  batch: "",
  semester: "",
  subject: "",
  teamNumber: "",
  projectName: "",
  teamMembers: "",
  projectDescription: "",
  toolsUsed: "",
  technologiesUsed: "",
  sourcesUsed: "",
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
      const response = await fetch(`${apiBaseUrl}/api/projects/upload`, {
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
          ? "Docker/backend connection error. Make sure the backend is running at http://localhost:5000."
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
        const response = await fetch(`${apiBaseUrl}/api/projects/pull-requests/${pullRequestNumber}/status`);
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
      <PageHeader eyebrow="Upload Project" title="Submit a team project for review">
        The backend creates a branch, uploads the files to GitHub, and opens a pull request for the maintainer.
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
              placeholder="team-01"
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
