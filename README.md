# Chirpy

A Twitter-like REST API built with Express 5, TypeScript, Drizzle ORM, and PostgreSQL.

## Features

- User registration and authentication (JWT access tokens + refresh tokens)
- Password hashing with Argon2
- Create, read, and delete chirps (140-character limit with profanity filter)
- Chirpy Red premium upgrades via webhook
- Admin metrics and database reset (dev-only)

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express 5
- **Language**: TypeScript
- **Database**: PostgreSQL via [postgres.js](https://github.com/porsager/postgres)
- **ORM**: Drizzle ORM
- **Auth**: JWT (jsonwebtoken) + Argon2 password hashing
- **Testing**: Vitest
- **Linting/Formatting**: ESLint + Prettier

## Prerequisites

- Node.js
- PostgreSQL

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root:

   ```
   DB_URL=postgres://user:password@localhost:5432/chirpy
   PLATFORM=dev
   SECRET=your-jwt-secret
   POLKA_KEY=your-polka-api-key
   ```

3. Generate and run database migrations:

   ```sh
   npm run generate
   npm run migrate
   ```

## Scripts

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start dev server with hot reload (tsx)   |
| `npm run build` | Compile TypeScript to `dist/`            |
| `npm start`     | Run compiled server from `dist/`         |
| `npm test`      | Run tests with Vitest                    |
| `npm run generate` | Generate Drizzle migration files      |
| `npm run migrate`  | Apply database migrations             |

## API Endpoints

### Public

| Method | Path                     | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/api/healthz`           | Health check               |
| POST   | `/api/users`             | Register a new user        |
| POST   | `/api/login`             | Login, returns JWT + refresh token |
| GET    | `/api/chirps`            | List chirps (optional `?authorId=` and `?sort=asc\|desc`) |
| GET    | `/api/chirps/:id`        | Get a single chirp         |

### Authenticated (Bearer token)

| Method | Path                     | Description                |
| ------ | ------------------------ | -------------------------- |
| PUT    | `/api/users`             | Update email/password      |
| POST   | `/api/chirps`            | Create a chirp             |
| DELETE | `/api/chirps/:id`        | Delete own chirp           |
| POST   | `/api/refresh`           | Refresh access token       |
| POST   | `/api/revoke`            | Revoke refresh token       |

### Webhooks

| Method | Path                     | Description                |
| ------ | ------------------------ | -------------------------- |
| POST   | `/api/polka/webhooks`    | Chirpy Red upgrade webhook (ApiKey auth) |

### Admin

| Method | Path                     | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/admin/metrics`         | View server hit count      |
| POST   | `/admin/reset`           | Reset hits + delete all users (dev only) |

## Project Structure

```
src/
├── index.ts            # App entry point, route registration
├── config.ts           # Environment config
├── auth.ts             # JWT, password hashing, token helpers
├── middlewares.ts       # Logging, metrics, error handler
├── errors/             # Custom error classes
├── db/
│   ├── index.ts        # Database connection
│   ├── schema.ts       # Drizzle table definitions
│   └── queries/        # Database query functions
├── routes/             # Route handlers
└── types/              # Shared TypeScript types
```
