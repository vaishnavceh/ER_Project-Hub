# Electrical & Computer Project Repository Hub

Version: `1.2.0 nightly build`

A full-stack project submission hub for Electrical and Computer course work. Students upload project files through the website, the backend creates a GitHub branch and pull request, and the automated workflow can merge and pull accepted submissions after checks pass.

## Current Workflow

- Normal student uploads are handled by the automated workflow after checks pass.
- Auto-merge and auto-pull are enabled after the configured checks pass.
- Students should use the website for uploads and the repository browser for accepted files.
- Git users can use the upload page Git window to clone, fetch, and pull accepted projects.
- Contact the admin for failed uploads, duplicate submissions, incorrect folders, or access concerns.

## Repositories

- `ER_Project-Hub`: website source code.
- `Test_Department-Projecthub`: accepted student project files.

The website source repo and project-storage repo are intentionally separate. Do not upload student project folders into the website source repo.

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

- Home: current workflow, auto-merge/auto-pull status, admin contact guidance.
- Upload Project: student form, success panel, and Git command window.
- Files: browse accepted project files inside the website.
- Guidelines: upload rules and acceptance workflow.
- Repository: expected folder structure.
- README: required project documentation fields.
- Hardware: electronics and electrical project guidance.
- Rules: security, folder, file, and submission rules.
- Templates: course material, seminar, and report resources under construction and testing.
- Know More: version, operational notes, and upcoming work.

## Upload Rules

- Do not upload passwords, API keys, tokens, private keys, or private data.
- Use clear batch, semester, subject, team, and project names.
- Keep reports as PDFs when possible.
- Use Google Drive links only for large reports or demo videos.
- Contact the admin when an upload succeeds but the project does not appear after the automated workflow finishes.

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
