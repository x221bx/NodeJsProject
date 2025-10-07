# Node.js + React Blog App

Production-ready full‑stack blog built with an Express API (Node.js) and a React (Vite) frontend. It supports JWT auth with roles, posts with image uploads, and comments. The API is documented with Swagger.

## Table of Contents
- Features
- Architecture
- Repository Layout
- Quick Start
- Environment
- API
- Data Model
- Auth & Security
- CORS
- Frontend
- Scripts
- Build & Deploy
- Security
- Troubleshooting
- Backend Testing

## Features
- JWT authentication (register/login)
- Role‑based access control (`admin`, `user`)
- Posts CRUD with image upload
- Comments CRUD per post
- Centralized config via `.env`
- Swagger API docs at `/api-docs`

## Architecture
- Backend: Express 5, Firebase Admin (Firestore), Supabase Storage, Multer, JWT, Swagger (swagger‑ui‑express, swagger‑jsdoc)
- Frontend: React (Vite), React Router, Axios, Tailwind, Lucide Icons

## Repository Layout
```
backEnd/   # Express API
frontEnd/  # React (Vite) app
```

## Quick Start

Prerequisites
- Node.js 18+ and npm
- Firebase service account JSON (for Firestore)
- Supabase project with a bucket named `images`

Backend
- `cd backEnd`
- Copy `.env.example` to `.env` and fill the values
- Place Firebase key at `backEnd/serviceAccountKey.json`
- `npm install`
- `npm run dev`
- API: `http://localhost:<PORT>` (default 2000), docs: `http://localhost:<PORT>/api-docs`

Frontend
- `cd frontEnd`
- Copy `.env.example` to `.env`
- Set `VITE_API_BASE_URL=http://localhost:2000`
- `npm install`
- `npm run dev` (app on `http://localhost:5173`)

## Environment

Backend (`backEnd/.env`)
- `PORT=2000`
- `CORS_ORIGIN=http://localhost:5173`
- `SWAGGER_SERVER_URL=http://localhost:2000/api`
- `JWT_SECRET=defaultSecret`
- `SUPABASE_URL=<your-supabase-url>`
- `SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`

Notes
- JWT signing and verification both use `JWT_SECRET`.
- Firebase credentials are loaded from `backEnd/serviceAccountKey.json` (not committed).
- Supabase URL/key are read from env in `backEnd/config/supabase.js`. If not set, registration/post creation will return a clear error because image upload is required.

Frontend (`frontEnd/.env`)
- `VITE_API_BASE_URL=http://localhost:2000`

All API calls are built via `frontEnd/src/config/api.js`, so changing the base URL is a single‑line env edit.

## API
Base path: `/api`

Auth
- POST `/api/auth/register` (multipart/form‑data: `name`, `email`, `password`, `image`) → 201
- POST `/api/auth/login` (json: `email`, `password`) → 200 `{ token }`

Users
- GET `/api/users` → 200 list
- GET `/api/users/me` (Bearer) → 200 current user
- GET `/api/users/:id` → 200 user by id
- PUT `/api/users/:id` (json) → 200 update
- DELETE `/api/users/:id` → 200 delete

Posts (Bearer required; owner or admin for mutations)
- GET `/api/posts` → 200 list
- POST `/api/posts` (multipart/form‑data: `title`, `content`, `image`) → 201
- PUT `/api/posts/:id` (json: `title`, `content`) → 200
- DELETE `/api/posts/:id` → 200

Comments (Bearer required)
- POST `/api/comments/:postId` (json: `content`) → 201
- GET `/api/comments/:postId` → 200 list
- GET `/api/comments/:postId/:commentId` → 200 one
- PATCH `/api/comments/:postId/:commentId` (json: `content`) → 200 (owner only)
- DELETE `/api/comments/:postId/:commentId` → 200 (owner only)

Swagger
- UI: `GET /api-docs`
- The `servers` entry is controlled via `SWAGGER_SERVER_URL`.

Auth
- Send `Authorization: Bearer <JWT>` for protected endpoints.
- Token is returned by login and stored on the frontend (localStorage).

## Frontend
- API requests use `apiUrl(path)` from `frontEnd/src/config/api.js`.
- During dev, Vite proxies `/api` to `VITE_API_BASE_URL` (default falls back to `http://localhost:2000`).

Note: Use `apiUrl()` as a function when composing URLs (e.g., ```${apiUrl()}/api/auth/login```), not a variable.

## Data Model
- Users (collection: `users`)
  - Fields: `name`, `email`, `password` (bcrypt hash), `role` (`user`|`admin`), `imageUrl`, `age` (optional)
- Posts (collection: `posts`)
  - Fields: `title`, `content`, `authorId`, `authorName`, `imageUrl`, `userImageUrl` (avatar at creation), `createdAt`
- Comments (subcollection: `posts/{postId}/comments`)
  - Fields: `postId`, `userId`, `authorName`, `content`, `createdAt` (Firestore Timestamp), `updatedAt`

## Auth & Security
- JWT
  - Issued on login with `email`, `id`, `role`, `name`, `userImageUrl` claims.
  - Signed with `process.env.JWT_SECRET || "defaultSecret"` in `backEnd/controllers/authControllers.js`.
  - Verified with `'defaultSecret'` in `backEnd/middleware/authMiddleware.js`. Keep them consistent (default works out‑of‑the‑box; if you change the secret, update both places).
- Roles
  - Posts: create/list require authenticated user; update/delete require owner or admin.
  - Comments: list/create require authenticated user; update/delete require owner (admin edit/delete not enabled by default).
- Uploads
  - Handled by Multer (memory storage). Images uploaded to Supabase Storage bucket `images` and a public URL is stored.
  - If your bucket is Private, switch the code to Signed URLs instead of `getPublicUrl`.
- Secrets
  - Avoid committing keys. In the current branch, `backEnd/config/supabase.js` uses a hardcoded key; replace with your own and prefer loading from env in production.

## CORS
- Configured in `backEnd/app.js`. Allowed origins come from `CORS_ORIGIN` (comma‑separated).
- Example: `CORS_ORIGIN=http://localhost:5173,https://<your-netlify>.netlify.app`
- With `credentials: true`, do not use `*`.

## Scripts
Backend (from `backEnd/`)
- `npm run dev`  — Start API with nodemon
- `npm start`    — Start API with node

Frontend (from `frontEnd/`)
- `npm run dev`      — Start Vite dev server
- `npm run build`    — Build to `dist/`
- `npm run preview`  — Preview a production build
- `npm run lint`     — Lint frontend code

## Build & Deploy
- Build frontend: `cd frontEnd && npm run build` and serve `dist/` on any static host.
- Run backend: `cd backEnd && npm start` on your server (set `.env`).
- Update `CORS_ORIGIN` (backend) and `VITE_API_BASE_URL` (frontend) for your deployed domains.
- Put a reverse proxy (e.g., Nginx) in front if needed.

## Security
- Never commit secrets. Keep Supabase and JWT secrets in env only; rotate any leaked keys.
- Keep `serviceAccountKey.json` private.
- If your Supabase bucket `images` is Private, switch to signed URLs in the code (or make it Public and keep using `getPublicUrl`).

## Troubleshooting
- CORS errors → Ensure `CORS_ORIGIN` matches the frontend origin exactly.
- 401/403 → Ensure you send `Authorization: Bearer <token>` and the token is valid.
- 404 from `http://localhost:5173/api/*` → Backend not running or `VITE_API_BASE_URL` not set; restart Vite after editing `.env`.
- 500 on register/post upload → Storage not configured or missing image file; check `.env` and ensure bucket `images` exists.
- Broken images → Make `images` bucket Public or switch to Signed URLs.

## Backend Testing

Swagger (recommended)
- Start backend: `cd backEnd && npm run dev`
- Open `http://localhost:2000/api-docs`
- Click Authorize and enter `Bearer <JWT>` to test protected routes

cURL snippets
- Register (multipart with image):
  - Windows (PowerShell):
    - `curl -i -X POST http://localhost:2000/api/auth/register \`
      `-F "name=Alice" -F "email=alice@example.com" -F "password=123456" \`
      `-F "image=@C:\\path\\to\\avatar.jpg;type=image/jpeg"`
- Login:
  - `curl -s -X POST http://localhost:2000/api/auth/login \`
    `-H "Content-Type: application/json" \`
    `-d '{"email":"alice@example.com","password":"123456"}'`
- Create post (multipart):
  - `curl -i -X POST http://localhost:2000/api/posts \`
    `-H "Authorization: Bearer <TOKEN>" \`
    `-F "title=Hello" -F "content=World" \`
    `-F "image=@C:\\path\\to\\image.jpg;type=image/jpeg"`
- List posts:
  - `curl http://localhost:2000/api/posts -H "Authorization: Bearer <TOKEN>"`
- Comments:
  - Add: `curl -X POST http://localhost:2000/api/comments/<POST_ID> -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"content":"Nice!"}'`
  - List: `curl http://localhost:2000/api/comments/<POST_ID> -H "Authorization: Bearer <TOKEN>"`
  - Update: `curl -X PATCH http://localhost:2000/api/comments/<POST_ID>/<COMMENT_ID> -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"content":"Edited"}'`
  - Delete: `curl -X DELETE http://localhost:2000/api/comments/<POST_ID>/<COMMENT_ID> -H "Authorization: Bearer <TOKEN>"`

Postman
- Import requests mirroring the above and set `{{baseUrl}}` to `http://localhost:2000`.
- Add a collection variable for `token` and use `Authorization: Bearer {{token}}`.

## Contributing
- Fork the repo and create a feature branch.
- Keep changes focused and documented.
- Open a PR with a clear description.

 
