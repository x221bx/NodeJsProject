#!/usr/bin/env
# Node.js + React Blog (Dev Guide)

Express API + React (Vite) app with JWT auth, roles, posts (image upload), and comments. API docs at `/api-docs`.

## Stack
- Backend: Express 5, Firebase Admin (Firestore), Supabase Storage, Multer, JWT, Swagger
- Frontend: React (Vite), React Router, Axios, Tailwind

## Run Locally
- Backend
  - `cd backEnd && cp .env.example .env`
  - Put `serviceAccountKey.json` in `backEnd/`
  - Set env (below), then `npm i && npm run dev`
  - Open `http://localhost:2000/api-docs`
- Frontend
  - `cd frontEnd && cp .env.example .env`
  - Set `VITE_API_BASE_URL=http://localhost:2000`
  - `npm i && npm run dev` (app: `http://localhost:5173`)

## Env
- Backend (`backEnd/.env`)
  - `PORT=2000`
  - `CORS_ORIGIN=http://localhost:5173` (comma‑separated allowed origins)
  - `SWAGGER_SERVER_URL=http://localhost:2000/api`
  - `JWT_SECRET=defaultSecret` (keep sign/verify consistent)
  - `SUPABASE_URL=https://<project>.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
- Frontend (`frontEnd/.env`)
  - `VITE_API_BASE_URL=http://localhost:2000`

## API (base `/api`)
- Auth: `POST /auth/register` (multipart: name, email, password, image) · `POST /auth/login`
- Users: `GET /users`, `GET /users/me`, `GET/PUT/DELETE /users/:id`
- Posts: `GET /posts`, `POST /posts` (multipart: title, content, image), `PUT/DELETE /posts/:id`
- Comments: `POST/GET /comments/:postId`, `GET/PATCH/DELETE /comments/:postId/:commentId`
- Swagger: `GET /api-docs` (server from `SWAGGER_SERVER_URL`)

## Data Model (Firestore)
- `users`: name, email, password(hash), role(user|admin), imageUrl, age
- `posts`: title, content, authorId, authorName, imageUrl, userImageUrl, createdAt
- `posts/{postId}/comments`: postId, userId, authorName, content, createdAt, updatedAt

## Auth & CORS
- Send `Authorization: Bearer <JWT>` to protected routes.
- CORS origins from `CORS_ORIGIN` (comma‑separated). With credentials, don’t use `*`.

## Uploads
- Multer (memory) → Supabase bucket `images` → store public URL.
- If the bucket is Private, switch code to Signed URLs or make it Public.

## Test Backend (quick)
- Swagger: run backend, open `/api-docs`, Authorize → `Bearer <token>`
- cURL (PowerShell)
  - Register: `curl -i -X POST :2000/api/auth/register -F name=N -F email=e@x -F password=123 -F image=@C:\\img.jpg;type=image/jpeg`
  - Login: `curl -s -X POST :2000/api/auth/login -H "Content-Type: application/json" -d '{"email":"e@x","password":"123"}'`
  - Create post: `curl -i -X POST :2000/api/posts -H "Authorization: Bearer <TOKEN>" -F title=T -F content=C -F image=@C:\\p.jpg;type=image/jpeg`

## Notes
- Frontend helper: use `apiUrl()` (function) when composing URLs.
- In this branch, `backEnd/config/supabase.js` has a hardcoded key; replace with your own and prefer env in production.
