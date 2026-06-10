# Electrical & Computer Project Repository Hub

A local-first full-stack web application for Electrical and Computer project submissions. Students upload project files through a web form, and the backend creates a new GitHub branch and pull request for review or automatic merge. The app never uploads directly to the main branch.

## Tech Stack

- React, Vite, Tailwind CSS
- Node.js, Express.js
- Multer for uploads
- Octokit for GitHub REST API integration
- Docker and Docker Compose

## Project Structure

```text
department-project-hub-website/
  frontend/
    Dockerfile
    package.json
    vite.config.js
    src/
      components/
      pages/
      App.jsx
      main.jsx
    README.md
  backend/
    Dockerfile
    package.json
    .env.example
    src/
      routes/
      controllers/
      services/
      middleware/
      server.js
    uploads/
    README.md
  docker-compose.yml
  .gitignore
  README.md
```

## Run in Visual Studio Code with Docker

1. Open `department-project-hub-website` in Visual Studio Code.
2. Install Docker Desktop and start it.
3. Install the VS Code Docker extension if needed.
4. Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

5. Edit `backend/.env` and add your GitHub token and repository details:

```env
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username_or_org
GITHUB_REPO=your_repository_name
GITHUB_BASE_BRANCH=main
PORT=5000
CORS_ORIGIN=http://localhost:5173
MAX_UPLOAD_FILE_SIZE_MB=25
```

Use a GitHub token with the minimum permissions needed to create branches, upload repository contents, and open pull requests. Never put the token in the frontend.

6. Build and start the full app:

```bash
docker compose up --build
```

7. Open the frontend:

[http://localhost:5173](http://localhost:5173)

8. Check the backend health endpoint:

[http://localhost:5000/api/health](http://localhost:5000/api/health)

Expected response:

```json
{ "status": "ok" }
```

## Docker Commands

Start and rebuild:

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

Rebuild after dependency changes:

```bash
docker compose up --build
```

## GitHub Upload Workflow

The backend:

1. Validates the form data and uploaded filenames.
2. Reads the latest commit SHA from the configured base branch.
3. Creates a new branch like `upload/batch-2027-sem5-dbms-team-01-library-management`.
4. Uploads project files under:

```text
batches/batch-2027/semester-5/dbms/team-01-library-management/
```

5. Generates `README.md`.
6. Adds small folder README files in intermediate folders so GitHub displays the hierarchy cleanly instead of compacting the full path into one row.
7. Places a PDF report at `reports/project-report.pdf` when uploaded.
8. Creates `report-link.md` when a Google Drive report link is provided.
9. Opens a pull request against `main`.

After upload, the frontend checks the pull request status. It shows whether GitHub accepted and merged the pull request, whether it is still pending, or whether the student should contact the repository administrator.

## Repository File Browser

The frontend includes a **Files** page that calls the backend at:

```text
GET /api/repository/files?path=batches
```

The backend reads the configured GitHub repository and returns folders/files without exposing `GITHUB_TOKEN` or GitHub App credentials to the browser.

## Know More Page

The frontend includes a **Know More** page with:

- Current local-first version
- Project creator information
- Deployment plan
- Upcoming features such as LaTeX seminar templates, project report templates, presentation templates, and admin review tools

## Avoid Using a Personal Token Long Term

For testing, it is fine to use your own fine-grained personal access token in `backend/.env`.

For department or organization use, do not depend on one student's or one maintainer's personal token. Use one of these approaches instead:

### Simple Department Setup

1. Create a dedicated GitHub user such as `department-project-bot`.
2. Add that bot user as a collaborator on the project repository, or add it to the organization team that has access to the repository.
3. Create a fine-grained token from the bot account.
4. Give the token access only to the target repository.
5. Grant only these repository permissions:
   - Contents: read and write
   - Pull requests: read and write
   - Metadata: read-only
6. Put that bot token in `backend/.env` as `GITHUB_TOKEN`.

After this, uploads and pull requests are created by the bot account instead of your personal account.

### Better Organization Setup

For a long-lived organization integration, create a GitHub App and install it on the organization repository. GitHub recommends GitHub Apps for organization resources and long-lived integrations.

The app should have repository permissions for:

- Contents: read and write
- Pull requests: read and write

An organization owner still needs to approve or install the app once. After installation, normal student uploads do not need your personal approval.

Configure the backend with either `GITHUB_TOKEN` or GitHub App credentials. If these three app values are set, the backend uses the GitHub App instead of the personal token:

```env
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_APP_INSTALLATION_ID=
```

For `GITHUB_APP_PRIVATE_KEY`, keep the private key in `backend/.env` only. If you store it on one line, replace new lines with `\n`.

Do not make the website auto-merge student uploads into `main`. Keeping pull requests gives maintainers a review step and prevents accidental overwrites.

## Troubleshooting

- Docker Desktop not running: start Docker Desktop, then rerun `docker compose up --build`.
- Port 5173 already in use: stop the other app or change the frontend port in `docker-compose.yml` and `frontend/vite.config.js`.
- Port 5000 already in use: stop the other backend or change the backend port in `docker-compose.yml` and `backend/.env`.
- `backend/.env` missing: copy `backend/.env.example` to `backend/.env`.
- GitHub token invalid: create a new token with repository contents and pull request permissions.
- Frontend cannot connect to backend: confirm `VITE_API_BASE_URL=http://localhost:5000` and check [http://localhost:5000/api/health](http://localhost:5000/api/health).
- File upload too large: reduce file size or use the Google Drive report link field for large reports.

## Security Notes

- `GITHUB_TOKEN` stays only in `backend/.env`.
- `.env` files are ignored by Git.
- The frontend never receives the GitHub token.
- Filenames that look like `.env`, private keys, tokens, passwords, secrets, or executable files are rejected.
- Student uploads always become pull requests for maintainer review.
