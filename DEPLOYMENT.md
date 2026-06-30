# Delivora Deployment Prep (Production + Portfolio)

## 1) Hosted PostgreSQL (Recommended)

Pick one managed Postgres provider and keep one project per deployment:

- Neon (serverless PostgreSQL)
- Supabase (Postgres + managed dashboard)
- Render PostgreSQL
- Railway PostgreSQL

### Connection URL format

Use SSL-enabled URLs for production databases:

- `postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require`
- For providers with connection pooling: use the pooler endpoint for runtime (`DATABASE_URL`) and (optionally) a direct connection for migrations in Prisma (`DIRECT_URL`).

### Provisioning checklist

- Create one DB per env (staging + production if needed).
- Enable automated backups.
- Turn on "IP allowlist" if the provider enforces it (if supported) and add your deploy host/Vercel IP range rules.
- Ensure TLS/SSL required.
- Set long retention for logs for troubleshooting login/auth and action flows.

## 2) Vercel Environment Variables

Add these in Vercel → Settings → Environment Variables:

| Key | Example | Environment | Required | Notes |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | `postgresql://...` | Production / Preview / Development | Yes | Main runtime DB URL (pooled endpoint recommended). |
| `DIRECT_URL` | `postgresql://...` | Production | Optional | Prisma direct DB URL for migrations. |
| `NEXTAUTH_SECRET` | random 32+ chars | All | Yes | Keep strong and unique per environment. |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | All | Yes | Must exactly match deployed origin. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `your-cloud` | All | Optional | Required only if profile/avatar upload is used. |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `unsigned_preset` | All | Optional | Required only if upload is used. |
| `NODE_ENV` | `production` | Production | Auto | Usually set by Vercel; rarely needed manually. |

### Vercel settings

- Framework preset: **Next.js**
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: default for Next.js
- If you store env-sensitive defaults in `.env.example`, keep values non-secret there (example-only placeholders).

## 3) Production-safe seed / demo strategy

### Why current seeding is dev-friendly, not prod-safe

The seed script now supports both:
- `demo` mode (non-destructive, production-safe).
- `reset` mode (destructive, local utility).

That behavior is okay for local development but should **never run automatically in production**.

### Recommended strategy

1. **Local/dev seeding**
   - Use full reset seed to keep demos deterministic.
2. **Staging smoke seed**
   - Seed a small deterministic demo set only if a flag is explicitly set.
3. **Production**
   - Never run destructive seed commands.
   - Seed only immutable reference/admin users through controlled migrations or a guarded one-time initializer.

### Suggested script flow

Use these commands manually when needed:

```bash
# 1) generate prisma client
npm run db:generate

# 2) apply schema changes (or use prisma migrate)
npm run db:push

# 3) run normal seed locally
npm run preflight
npm run db:seed
```

For production, gate seeding with explicit allowlist:

```bash
# demo-safe mode (default)
npm run db:seed:demo
# equivalent:
SEED_MODE=demo npm run db:seed

# explicit destructive seed (use only when intended)
npm run db:seed:reset
# equivalent:
SEED_MODE=reset SEED_ALLOW_RESET=true npm run db:seed
```

Then in seed script:
- `SEED_MODE=demo` → create/update demo dataset without table wipe.
- `SEED_MODE=reset` → full destructive seed; requires `SEED_ALLOW_RESET=true`.
- `npm run db:seed` defaults to `SEED_MODE=demo` and is safe for shared/staging/production environments.
- `npm run db:seed:reset` maps to `SEED_MODE=reset` with `SEED_ALLOW_RESET=true`.

### Minimum accounts to keep for demo portfolio

- One `AGENCY_OWNER`
- One `AGENCY_MEMBER`
- One `CLIENT`
- Three seeded projects with mixed statuses (active/review/handover) and matching actions

## 4) Deployment notes

### Pre-deploy

- Confirm all env vars are set in Vercel for each environment.
- Verify database is reachable and user has permission to migrate.
- Run a production-like local build:
  - `npm run build`
- Confirm `DATABASE_URL` uses SSL (`sslmode=require`).

### Deployment sequence

1. Push schema changes (if using migrations).
2. Push code to connected Git branch.
3. Let Vercel build.
4. Run a one-off command in Vercel shell / CI for post-deploy checks:
  - `npm run build`
  - `npm run preflight`
  - optional: `npm run lint`
5. Run a short smoke test:
   - `/`
   - `/login`
   - create agency login
   - `/dashboard`
   - `/client`

### Post-deploy checks

- Auth works with real credentials.
- Agency/dashboard routes and client routes are role-restricted correctly.
- Data appears in:
  - agency dashboard action lists
  - client action center
  - milestone/approval/invoice pages
- Recharts charts render with seeded data and no runtime errors.
- Ensure upload fields either hide gracefully or show clear "configure Cloudinary" messaging.

## 5) Portfolio README screenshots

Use [`PORTFOLIO_SCREENSHOTS.md`](./PORTFOLIO_SCREENSHOTS.md) as the canonical checklist.

Keep a consistent naming scheme and file size (desktop 1280 × ~720, mobile 390 × 844).

## 6) Useful one-liner checklist before publishing

```text
- [ ] Production DB created and reachable
- [ ] ENV vars set in Vercel
- [ ] NEXTAUTH_SECRET rotated
- [ ] Cloudinary optional vars set only if feature used
- [ ] Build passes locally and on Vercel
- [ ] Manual smoke tests pass (dashboard + client portal)
- [ ] No production destructive seed run
- [ ] Screenshots prepared and README updated
```
