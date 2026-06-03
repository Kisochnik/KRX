# KRX / KVARON_X

Black and white futuristic social platform.

## Stack

- Frontend: Next.js 15, React, TypeScript, TailwindCSS, Framer Motion
- Backend: Node.js, NestJS
- Database: PostgreSQL
- Auth foundation: JWT, bcrypt, validation, email verification codes, 2FA-ready user model
- Security foundation: Helmet, rate limit, validation, CORS, hardened env defaults

## Start

```bash
npm install
npm run dev:web
npm run dev:api
```

PostgreSQL can be started with Docker when Docker is installed:

```bash
docker compose up -d postgres
```

Copy `.env.example` to `.env` for the API and expose `NEXT_PUBLIC_API_URL` for the frontend when wiring real requests.

## Day 1 Scope

- UI kit: Button, Input, Modal, Sidebar, Navbar, Card, Avatar, Loader
- Pages: Home Feed, Login, Register, Forgot Password, Verify Code
- API modules: Auth, Users, Posts, Messages, Notifications
- Database tables: users, posts, comments, likes, messages, notifications, friends
