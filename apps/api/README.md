# MacroMint API (NestJS)

## Local dev

```bash
cd apps/api
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate:dev
npm run start:dev
```

### Worker

```bash
npm run start:worker
```

## Environment variables
See `.env.example` for required values.

Notes:
- Queue/worker features require `REDIS_URL`.
- In production, localhost Redis URLs are disabled unless `ALLOW_LOCAL_REDIS=true`.
