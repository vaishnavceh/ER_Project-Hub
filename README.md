# Electrical & Computer Project Repository Hub

Version: `2.5.0 nightly build`

A full-stack project submission hub for Electrical & Electronics Engineering (EEE) course work. Students upload project files through the website, the backend creates a GitHub branch and pull request, and the automated workflow can merge and pull accepted submissions after checks pass.

Creator GitHub profile: [vaishnavceh](https://github.com/vaishnavceh)

## Current Workflow

1. Select Batch.
2. Select Semester.
3. Enter Project Details.
4. Add Guide Information.
5. Add Faculty Information when available.
6. Submit Project.

The platform converts student-facing selections into repository values automatically:

| User selection | Repository value |
| --- | --- |
| 2027 | `batch-2027` |
| Semester 6 | `semester-6` |

Students do not manually create batch, semester, or repository path folder names. The default department stored for v2.5.0 submissions is `Electrical & Electronics Engineering (EEE)`.

## v2.5.0 Nightly

### Added

- Batch selection dropdown.
- Semester selection dropdown.
- Project guide information.
- Faculty information fields.
- Improved validation system.
- Default EEE department metadata stored internally for guide and faculty records.

### Improved

- Submission workflow.
- User experience.
- Repository standardization.
- Mobile responsiveness.
- Automatic repository path formatting for batch, semester, subject, and project title values.

### Documentation

- README updated.
- Wiki documentation added.
- User guide added.
- Repository structure documentation updated.

## 2.0.0 Stable Update

### Issues Solved

- Team number validation now supports `team-01` through `team-100`.
- Optional README comments can be entered during upload and are added to generated `README.md` files.
- Generated README files no longer contain unfinished placeholder instructions.
- Existing project folders can now be replaced through a new upload pull request.
- Storage repository configuration has been updated for the official Electrical and Computer project repository.
- Auto-merge workflow setup is documented for upload pull requests.
- Templates are now live in the official repository `TEMPLATES` folder.

### New Updates

- Version bumped to `2.0.0 stable build`.
- Documentation now has its own tab with a click-to-load PDF.js preview inside the website.
- Templates page now lists the actual files and folders inside the official `TEMPLATES` directory.
- Creator GitHub profile is linked in public project information.
- Existing project uploads now replace previous folder contents through a new pull request.
- Generated README files use form input, readable report PDF sections, and clean fallback text.
- README, Hardware, and Rules were combined into one minimal Submission Guide page.
- Documentation, repository, and guidelines pages were refreshed for the stable build.

## Repositories

- `ER_Project-Hub`: website source code.
- `ELECTRICAL-AND-COMPUTER-TKMCE/ELECTRICAL-AND-COMPUTER-PROJECT-REPOSITORY-OFFICIAL`: accepted student project files.
- `ELECTRICAL-AND-COMPUTER-PROJECT-REPOSITORY-OFFICIAL/TEMPLATES`: official course, seminar, lab, and review templates.

The website source repo and project-storage repo are intentionally separate. Do not upload student project folders into the website source repo.

Official templates folder:
[TEMPLATES](https://github.com/ELECTRICAL-AND-COMPUTER-TKMCE/ELECTRICAL-AND-COMPUTER-PROJECT-REPOSITORY-OFFICIAL/tree/main/TEMPLATES)

Official templates repository:
[ELECTRICAL-AND-COMPUTER-TKMCE/ELECTRICAL-AND-COMPUTER-PROJECT-REPOSITORY-OFFICIAL](https://github.com/ELECTRICAL-AND-COMPUTER-TKMCE/ELECTRICAL-AND-COMPUTER-PROJECT-REPOSITORY-OFFICIAL)

## Documentation PDF

The Overleaf-style LaTeX documentation is stored in:
`docs/ER_Project_Hub_Overleaf_Documentation.tex`

GitHub Actions builds the latest PDF whenever the LaTeX file changes. After the workflow finishes, the latest PDF is available at:
[ER_Project_Hub_Overleaf_Documentation.pdf](https://github.com/vaishnavceh/ER_Project-Hub/raw/main/docs/ER_Project_Hub_Overleaf_Documentation.pdf)

The Documentation tab previews the latest compiled PDF with an in-app PDF.js viewer, so it does not depend on Google Docs embedding or force a download first.

The build workflow is:
[Build Documentation PDF](https://github.com/vaishnavceh/ER_Project-Hub/actions/workflows/documentation-pdf.yml)

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Upload handling: Multer
- GitHub integration: Octokit and GitHub Actions
- Deployment: frontend on Vercel, backend as a Node web service
- Local testing: Docker Compose

## Project Structure

```text
department-project-hub-website/
  frontend/
    src/
      components/
      config/
      pages/
      App.jsx
      main.jsx
  backend/
    src/
      routes/
      controllers/
      services/
      middleware/
      server.js
  docker-compose.yml
  README.md
```

## Frontend Environment

The frontend must receive its API target through environment variables. Do not hardcode deployed service endpoints in committed source files.

```env
VITE_API_BASE_URL=<configured-project-service-url>
VITE_ADMIN_PASSKEY=<admin-passkey>
VITE_STORAGE_REPOSITORY_URL=<project-storage-repository-url>
```

The admin passkey protects the Admin Pane, where frontend and backend status checks are shown.

## Backend Environment

Keep backend credentials only in the backend deployment environment.

```env
GITHUB_OWNER=<owner-or-org>
GITHUB_REPO=<project-storage-repository>
GITHUB_BASE_BRANCH=main
GITHUB_TOKEN=<server-side-token>
FRONTEND_URL=<frontend-origin>
CORS_ORIGIN=<frontend-origin>
NODE_ENV=production
PORT=10000
```

The GitHub token must never be placed in the frontend or committed to Git.

## Pages

- Home: current workflow, auto-merge/auto-pull status, and admin contact guidance.
- Upload Project: searchable batch and semester dropdowns, project metadata, guide and faculty metadata, success panel, and Git command window.
- Files: browse accepted project files inside the website.
- Guidelines: upload rules and acceptance workflow.
- Repository: standardized batch and semester folder structure.
- Submission Guide: submission workflow, README content, hardware evidence, metadata fields, and safety rules in one minimal page.
- Templates: browse actual files and folders from the official repository `TEMPLATES` directory.
- Documentation: read the latest compiled project documentation PDF inside the website with a click-to-load PDF.js viewer.
- Know More: version, operational notes, and upcoming work.

## Upload Rules

- Do not upload passwords, API keys, tokens, private keys, or private data.
- Select batch and semester from the dropdowns. The backend stores values such as `batch-2027` and `semester-6`.
- Enter a clear project title and subject. Repository-safe folder names are generated automatically.
- Add required guide information. Guide and faculty department metadata defaults to `Electrical & Electronics Engineering (EEE)`.
- Add a valid GitHub repository link for the project source.
- Keep reports as PDFs when possible.
- Use Google Drive links only for large reports or demo videos.
- Contact the admin when an upload succeeds but the project does not appear after the automated workflow finishes.
- Team numbers must use `team-01` through `team-100`.
- Use optional README detail fields for problem statement, setup steps, run/test steps, demo evidence, presentation notes, future improvements, and extra comments.
- Missing optional README details are read from matching report PDF sections when possible, then written as `Not available.` instead of unfinished placeholder text.
- Reuploading the same batch/semester/subject/team/project path replaces the existing project folder through a pull request.
- Use official templates from the `TEMPLATES` folder for reports, seminars, presentations, lab records, and review material.

## Standard Repository Structure

```text
batch-2027/
|-- semester-1/
|-- semester-2/
|-- semester-3/
|-- semester-4/
|-- semester-5/
|-- semester-6/
|-- semester-7/
`-- semester-8/
```

Example submission values:

```text
Batch: 2027
Automatically stored as: batch-2027

Semester: Semester 6
Automatically stored as: semester-6

Guide Name: Dr. John Mathew
Department: Electrical & Electronics Engineering (EEE)

Faculty Name: Jane Thomas
Department: Electrical & Electronics Engineering (EEE)
```

## Local Testing

For local testing, create frontend/backend environment files from the examples, set the required values, then run Docker Compose.

```powershell
docker compose down
docker compose build --no-cache frontend
docker compose up frontend
```

The local frontend can be pointed at the configured deployed project service using `VITE_API_BASE_URL`.

## Deployment Notes

- Frontend deployment should define `VITE_API_BASE_URL` in Vercel.
- Backend deployment should define `FRONTEND_URL` and `CORS_ORIGIN` using the final frontend origin.
- Health checks should use `/api/health`.
- Public website pages should not display deployment endpoints.

## Security Notes

- Rotate any GitHub token that has ever been shown in a screenshot, chat, terminal, or browser page.
- Keep `.env` files out of Git.
- Use the lowest GitHub token permissions needed for repository contents and pull requests.
- Prefer a department bot or GitHub App for long-term use instead of a personal token.
