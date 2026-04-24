## PromptStack 

PromptStack is a Next.js + Prisma platform for managing, versioning, testing, and collaborating on LLM prompts and evaluation workflows (think “GitHub for prompts”).

## Features

- **Prompt versioning**: prompt history with tracked changes
- **A/B testing**: compare prompt variants and capture results
- **Workspaces & roles**: organize teams and projects with access control
- **Datasets & test runs**: batch evaluation on curated inputs
- **Analytics**: performance, latency, and cost visibility
- **Multi-model**: bring your own provider keys (OpenAI, Anthropic, and more)

## Tech stack

- **App**: Next.js 14 (App Router), React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI, Framer Motion
- **Auth**: NextAuth.js + Prisma adapter
- **DB**: PostgreSQL (primary), Prisma ORM

## Requirements

- **Node.js**: 18+ (recommended: latest 20 LTS)
- **Package manager**: npm
- **Database**: PostgreSQL (local or hosted)

## Quick start (local development)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy the example file and edit values:

```bash
cp env.example .env.local
```

At minimum you should set:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/promptrix"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"

# LLM providers (set what you use)
OPENAI_API_KEY="..."
ANTHROPIC_API_KEY="..."
```

### 3) Initialize database + Prisma client

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful scripts

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint`
- **Typecheck**: `npm run type-check`
- **Prisma generate**: `npm run db:generate`
- **Push schema**: `npm run db:push`
- **Run migrations (prod)**: `npm run db:migrate`
- **Seed database**: `npm run db:seed`
- **Prisma Studio**: `npm run db:studio`

## Health check

The application exposes a health endpoint at `GET /api/health`.

- **200**: database reachable (`database: "connected"`)
- **503**: database not reachable / misconfigured

This is intended for deployment health checks (e.g. Railway).

## Deployment

This repo includes Railway-oriented docs and examples:

- **Guide**: `DEPLOYMENT.md`
- **Railway env example**: `env.railway`

Typical production requirements:

- **Set** `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET`
- **Run** `prisma generate` during build and `prisma migrate deploy` (or `db push`) at release time
- **Ensure** the health check can reach the database from the runtime environment

## Troubleshooting

### Prisma build error: “Invalid value undefined for datasource `db`”

If `next build` fails with a Prisma error about datasource URL, it usually means **`DATABASE_URL` is missing at build time**.

- **Fix**: provide `DATABASE_URL` in your build environment (CI/Railway build variables), or ensure Prisma is not instantiated during build-time code paths.

### Runtime panic: “missing field `enableTracing`”

This typically indicates a **Prisma engine/client version mismatch** (e.g. generating with Prisma v6 but running `@prisma/client` v5, or mixed cached engines).

- **Fix**: ensure `prisma` and `@prisma/client` versions match, reinstall dependencies, and regenerate the client:

```bash
rm -rf node_modules package-lock.json
npm install
npm run db:generate
```

### `npm ci` fails: “package-lock.json not in sync”

`npm ci` requires `package.json` and `package-lock.json` to match exactly.

- **Fix**: run `npm install` locally to update the lock file, commit the updated `package-lock.json`, then redeploy.

### `EACCES` when npm tries to write under `/home/nextjs`

In some container environments, npm cache/log paths may not be writable by the running user.

- **Fix**: set `npm_config_cache` to a writable directory (for example `/tmp/.npm`) or adjust the container user/permissions.

## Project structure

```text
src/
  app/                 Next.js App Router (pages + API routes)
  components/          Reusable UI components
  lib/                 Server/client utilities (db, auth, helpers)
  store/               Zustand stores
  types/               Shared TypeScript types
prisma/
  schema.prisma        Prisma data model
  seed.ts              Seed script
```

## Contributing

- Create a feature branch from `main`
- Keep PRs focused and include a short test plan
- Run `npm run lint` and `npm run type-check` before opening a PR

## License

MIT. See `LICENSE`.
