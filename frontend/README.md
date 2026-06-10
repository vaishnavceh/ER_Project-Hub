# Frontend

React, Vite, and Tailwind CSS frontend for Electrical & Computer Project Repository Hub.

## Local Environment

Copy `.env.example` to `.env` if running the frontend outside Docker:

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Docker

The root Docker Compose file starts the frontend at:

[http://localhost:5173](http://localhost:5173)

The frontend posts uploads to the backend using `VITE_API_BASE_URL`.
