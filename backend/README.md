# Backend

Express backend for Electrical & Computer Project Repository Hub.

## Endpoints

- `GET /api/health` returns `{ "status": "ok" }`.
- `POST /api/projects/upload` accepts multipart form data, uploads files to GitHub on a new branch, and opens a pull request.
- `GET /api/projects/pull-requests/:number/status` checks whether an upload pull request is accepted, pending, or closed without merge.
- `GET /api/repository/files?path=` lists repository files for the frontend file browser.

## Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required values:

```env
GITHUB_TOKEN=
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_APP_INSTALLATION_ID=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BASE_BRANCH=main
PORT=5000
CORS_ORIGIN=http://localhost:5173
MAX_UPLOAD_FILE_SIZE_MB=25
```

Keep `GITHUB_TOKEN` private and use the minimum permissions needed for repository contents, branches, and pull requests.

For testing, `GITHUB_TOKEN` can be your own fine-grained personal access token. For department or organization use, prefer a dedicated bot account token or a GitHub App installation so uploads are not tied to one person's personal account. If `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, and `GITHUB_APP_INSTALLATION_ID` are all set, the backend uses the GitHub App instead of `GITHUB_TOKEN`. An organization owner may need to approve the bot/app access once.

## Validation Rules

- Batch must match `batch-YYYY`.
- Semester must match `semester-N`.
- Subject and project name must be lowercase URL-safe slugs.
- Team number must match `team-01`, `team-02`, etc.
- Dangerous executable and private-key extensions are blocked.
- Filenames that look like `.env`, secrets, tokens, passwords, credentials, or private keys are blocked.
- A PDF report is optional.
- At least one project file is required.
- Intermediate folders get small `README.md` files so GitHub shows `batches`, then `batch`, then `semester`, instead of compacting the whole path into one row.
