# VSM Fullstack

Short overview of the VSM fullstack project — includes a NestJS backend and a Next.js frontend.

## Main structure
- VSM_BE/ — Backend (NestJS + Prisma)
  - Entry: VSM_BE/src/main.ts
  - Main module: VSM_BE/src/app.module.ts
  - Prisma schema: VSM_BE/prisma/schema.prisma
  - Package: VSM_BE/package.json
  - Backend README: VSM_BE/README.md

- VSM_FE/ — Frontend (Next.js + Tailwind)
  - Entry page: VSM_FE/app/page.tsx
  - Next config: VSM_FE/next.config.mjs
  - Frontend package: VSM_FE/package.json

## Requirements
- Node.js (LTS)
- npm or pnpm
- PostgreSQL (local or Docker)
- (Backend) Prisma CLI for migrations and client generation

## Install & run (reference)

1. Backend
```bash
cd VSM_BE
npm install
# create or copy .env (see VSM_BE/.env.example if present)
npx prisma migrate deploy
npx prisma generate
npm run start:dev
```

2. Frontend
```bash
cd VSM_FE
pnpm install
# create or copy .env if required
pnpm run dev
```

Scripts are defined in:
- VSM_BE/package.json
- VSM_FE/package.json

## Database & Prisma
Prisma schema: VSM_BE/prisma/schema.prisma

Common Prisma commands:
```bash
npx prisma migrate dev
npx prisma db seed
npx prisma generate
```

## Tests & lint
- Backend e2e test: VSM_BE/test/app.e2e-spec.ts  
- ESLint/Prettier configs are included in the repo.

## Quick references
- Backend entry: VSM_BE/src/main.ts  
- Backend AppModule: VSM_BE/src/app.module.ts  
- Frontend main page: VSM_FE/app/page.tsx  
- Prisma schema: VSM_BE/prisma/schema.prisma

## Deployment tips
- Keep secrets in environment variables (.env) for DB, SMTP, etc.
- Build frontend with `pnpm build` and follow Next.js deployment docs.
- Build backend TypeScript before running production (see VSM_BE/tsconfig.build.json).

If you want, I can expand this README with module-level documentation, environment variable examples, or run scripts.