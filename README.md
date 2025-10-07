# Full‑Stack Blog App (Node.js + React)

A simple full‑stack blog application built with an Express API (Node.js) and a React (Vite) frontend. It supports authentication, role‑based access, creating posts with optional images, and comments. Swagger docs are included for the API.

## Features
- User authentication (register/login) with JWT
- Upload avatar on register (multipart/form‑data)
- Role‑based access control (`admin`, `user`)
- Posts CRUD with optional image upload
- Comments CRUD per post
- Firebase Admin (Firestore) persistence
- Supabase Storage for images
- Swagger API docs at `/api-docs`
- Centralized environment config for backend and frontend

## Tech Stack
- Backend: Node.js, Express 5, Firebase Admin (Firestore), Supabase Storage, Multer, JWT, Swagger (swagger‑ui‑express, swagger‑jsdoc)
- Frontend: React (Vite), React Router, Axios, Tailwind, Lucide Icons

## Repository Layout
```
backEnd/   # Express API
frontEnd/  # React (Vite) app
```

## Prerequisites
- Node.js 18+ and npm
- A Firebase service account JSON (for Firestore)
- A Supabase project with a public bucket named `images` (recommended)

## Quick Start

1) Clone and open the repo
- git clone <your-repo-url>
- cd NodeJsProject

2) Backend setup
- cd backEnd
- Copy `.env.example` to `.env` and adjust values
- Place your Firebase service account file at `backEnd/serviceAccountKey.json`
- npm install
- npm run dev
- API runs on `http://localhost:<PORT>` (default 2000)
- Swagger docs: `http://localhost:<PORT>/api-docs`

3) Frontend setup
- In another terminal: cd frontEnd
- Copy `.env.example` to `.env`
- Set `VITE_API_BASE_URL` to your backend base URL (e.g. `http://localhost:2000`)
- npm install
- npm run dev
- App runs on `http://localhost:5173` by default

## Environment Variables

Backend (`backEnd/.env`)
- PORT=2000
- CORS_ORIGIN=http://localhost:5173
- SWAGGER_SERVER_URL=http://localhost:2000/api
- JWT_SECRET=defaultSecret

Notes:
- JWT signing uses `process.env.JWT_SECRET || "defaultSecret"` in `authControllers`. The verify step in `authMiddleware` currently uses `"defaultSecret"`. Keep them in sync (set `JWT_SECRET=defaultSecret`) or update the middleware to use the env value as well.
- Firebase credentials are loaded from `backEnd/serviceAccountKey.json` (not committed).
- Supabase URL/key are currently defined in code (`backEnd/config/supabase.js`). For production, move them to env variables and rotate any leaked keys.

Frontend (`frontEnd/.env`)
- VITE_API_BASE_URL=http://localhost:2000

Uses a single helper `frontEnd/src/config/api.js` to build all API URLs, so you only change it in one place via env.

## API Overview
Base path: `/api`

Auth
- POST `/api/auth/register` (multipart/form‑data: name, email, password, image?) → 201
- POST `/api/auth/login` (json: email, password) → 200 { token }

Users
- GET `/api/users` → 200 list
- GET `/api/users/me` (Bearer) → 200 current user
- GET `/api/users/:id` → 200 user by id
- PUT `/api/users/:id` (json) → 200 update
- DELETE `/api/users/:id` → 200 delete

Posts (Bearer required; owner or admin for mutations)
- GET `/api/posts` → 200 list
- POST `/api/posts` (multipart/form‑data: title, content, image?) → 201
- PUT `/api/posts/:id` (json: title, content) → 200
- DELETE `/api/posts/:id` → 200

Comments (Bearer required)
- POST `/api/comments/:postId` (json: content) → 201
- GET `/api/comments/:postId` → 200 list
- GET `/api/comments/:postId/:commentId` → 200 one
- PATCH `/api/comments/:postId/:commentId` (json: content) → 200 (owner only)
- DELETE `/api/comments/:postId/:commentId` → 200 (owner only)

Swagger Docs
- UI: `GET /api-docs`
- The documented servers URL is controlled via `SWAGGER_SERVER_URL`.

Auth Details
- Send `Authorization: Bearer <JWT>` for protected endpoints.
- Token is issued by `POST /api/auth/login` and stored in the frontend `localStorage`.

## Frontend Notes
- All API calls use `apiUrl(path)` from `frontEnd/src/config/api.js`.
- During dev, Vite proxies `/api` to `VITE_API_BASE_URL` if set in `vite.config.js`.

## Scripts
Backend (from `backEnd/`)
- npm run dev  # Start API with nodemon
- npm start    # Start API with node

Frontend (from `frontEnd/`)
- npm run dev      # Start Vite dev server
- npm run build    # Build to `dist/`
- npm run preview  # Preview a production build
- npm run lint     # Lint frontend code

## Build & Deploy
- Build frontend: `cd frontEnd && npm run build` and serve `dist/` with any static host.
- Run backend: `cd backEnd && npm start` on your server (set `.env`).
- Update `CORS_ORIGIN` (backend) and `VITE_API_BASE_URL` (frontend) for your deployed domains.
- Put a reverse proxy (e.g., Nginx) in front if needed.

## Security
- Do NOT commit secrets. Move Supabase URL/key to env vars and rotate keys if this repo is public.
- Keep `JWT_SECRET` consistent between signing and verification (or refactor middleware to read from env).
- Keep `serviceAccountKey.json` private.

## Troubleshooting
- CORS errors: Ensure `CORS_ORIGIN` matches the frontend origin exactly.
- 401/403 responses: Ensure you send `Authorization: Bearer <token>` and the token is valid.
- Swagger server URL mismatch: Set `SWAGGER_SERVER_URL` to `<backend-base>/api`.
- Image upload fails: Ensure Supabase bucket `images` exists and credentials are valid.
- Firestore not working: Check `serviceAccountKey.json` path and permissions.

## Contributing
- Fork the repo and create a feature branch.
- Keep changes focused and documented.
- Open a PR with a clear description.



