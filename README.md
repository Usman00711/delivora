# Delivora

Delivora is a portfolio-grade full-stack SaaS project for software agencies and freelancers. It is a client-facing delivery, approvals, and handover portal, not a task-management or Jira clone.

The product focuses on the moments that matter between an agency and a client: approvals, milestones, deliverables, scope changes, weekly reports, invoices, handover assets, project health, and a clear client action center.

## Purpose

Agencies often manage delivery details internally, but clients still need a simple place to understand what is happening, what needs approval, what is overdue, and what is ready for handover. Delivora solves that by giving agencies a professional delivery workspace and giving clients a focused portal with only the actions that matter to them.

The main goal of this project is to demonstrate production-style SaaS architecture with a polished UI, role-based access, real database modeling, authentication, validation, server-side data loading, and practical client-delivery workflows.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Prisma ORM
- PostgreSQL
- NextAuth.js credentials auth
- Zod
- React Hook Form dependencies installed for form phases
- Recharts dependency installed for future reporting/analytics charts
- Docker-based local PostgreSQL setup

## Roles

Delivora is built around three user roles:

- `AGENCY_OWNER`: full agency access, dashboard access, project delivery access, settings/team/billing ownership.
- `AGENCY_MEMBER`: agency delivery access for projects and client work.
- `CLIENT`: client portal access for their company projects only.

Protected route behavior:

- `/` is public.
- `/login` and `/register` are public.
- `/dashboard/*` is for agency users.
- `/client/*` is for client users.

## Current Build Status

The current implementation includes the full foundation for the SaaS MVP:

- Public marketing homepage.
- Login and registration pages.
- NextAuth credentials authentication.
- JWT session data containing user id, role, agency id, and client company id.
- Middleware-based route protection.
- Prisma schema for the core Delivora domain.
- PostgreSQL-ready local setup.
- Seed script with realistic demo data.
- Agency dashboard backed by database queries.
- Client dashboard backed by database queries.
- Project detail routes for agency and client users.
- Client action center counts and priority action list.
- Project health score logic.
- Activity logging helper.
- Client approval decisions.
- Client scope change decisions.
- Shared loading, empty, error, and confirmation UI components.

The app currently uses demo seed data for most records. Client decisions are already real mutations. The next major phase is adding agency CRUD forms for creating and managing records from the UI.

## Main Features

### Agency Dashboard

The agency dashboard gives agency users a delivery overview:

- Active projects.
- Pending approvals.
- Open scope changes.
- Overdue milestones.
- Pending invoices.
- Average project health.
- Recent projects.
- Pending client approvals.
- Recent activity feed.

### Client Portal

The client portal gives clients a focused action workspace:

- Action center cards.
- Priority action list.
- Client projects.
- Approval decisions.
- Scope change quote decisions.
- Published reports.
- Handover items.
- Invoice visibility.

### Projects

Each project supports:

- Overview.
- Milestones.
- Deliverables.
- Approvals.
- Scope changes.
- Weekly reports.
- Handover vault.
- Invoices.
- Activity timeline.
- Health score.

### Project Health Score

Project health starts at `100` and is adjusted using delivery risk signals:

- Overdue milestones.
- Pending or overdue approvals.
- Overdue invoices.
- Blockers in the latest weekly report.
- Cleared client actions.

Health labels:

- `85-100`: Healthy
- `70-84`: Stable
- `50-69`: At Risk
- `0-49`: Critical

### Client Action Center

The client action center summarizes items that need client attention:

- Pending approvals.
- Scope changes awaiting decision.
- Pending invoices.
- Recent reports.
- Handover items ready.
- Milestones needing attention.

Actions are sorted by urgency so the client sees the most important work first.

## Database Models

The Prisma schema currently includes:

- `User`
- `Agency`
- `ClientCompany`
- `Project`
- `Milestone`
- `Deliverable`
- `ApprovalRequest`
- `ScopeChangeRequest`
- `WeeklyReport`
- `HandoverItem`
- `Invoice`
- `ActivityLog`

Important enums include:

- `Role`
- `ProjectStatus`
- `MilestoneStatus`
- `DeliverableStatus`
- `ApprovalStatus`
- `ScopeChangeStatus`
- `InvoiceStatus`
- `HandoverItemType`
- `ActivityType`

## Important Folders

```txt
app/
  api/auth/[...nextauth]/route.ts
  dashboard/
  client/
  login/
  register/

components/
  activity/
  approvals/
  client/
  dashboard/
  handover/
  invoices/
  layout/
  projects/
  reports/
  scope-changes/
  shared/
  ui/

lib/
  actions/
  validations/
  activity.ts
  auth.ts
  data.ts
  health-score.ts
  permissions.ts
  prisma.ts

prisma/
  schema.prisma
  seed.ts
```

## Current API and Server Actions

Current API route:

```txt
/api/auth/[...nextauth]
```

This route is managed by NextAuth and handles credentials login, sessions, JWT callbacks, and auth-related endpoints.

Current server actions:

- `registerAction`: creates an agency owner account.
- `decideApproval`: lets a client approve, request changes, or reject an approval.
- `decideScopeChange`: lets a client approve or reject a quoted scope change.

Most read operations are server-side Prisma queries in `lib/data.ts`, not REST API routes.

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`, then fill in your local database, auth secret, and optional Cloudinary values:

```txt
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clouddesk"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-unsigned-upload-preset"
```

Profile image uploads use Cloudinary unsigned uploads. Create a free Cloudinary account, create an unsigned upload preset, and add those two `NEXT_PUBLIC_CLOUDINARY_*` values before testing avatar uploads.

Start PostgreSQL with Docker:

```bash
docker run --name clouddesk-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=clouddesk \
  -p 5432:5432 \
  -d postgres:16
```

If the container already exists:

```bash
docker start clouddesk-postgres
```

Push the schema and seed demo data:

```bash
npm run db:push
npm run db:seed
```

Start the app:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Demo Credentials

After seeding, use:

```txt
Agency owner:
owner@clouddesk.dev / password123

Agency member:
member@clouddesk.dev / password123

Client:
client@clouddesk.dev / password123
```

## Viewing the Database

Recommended option:

```bash
npm run db:studio
```

This opens Prisma Studio, usually at:

```txt
http://localhost:5555
```

Terminal option:

```bash
docker exec -it clouddesk-postgres psql -U postgres -d clouddesk
```

Useful Postgres commands:

```sql
\dt
SELECT * FROM "User";
SELECT * FROM "Project";
SELECT * FROM "ActivityLog";
\q
```

## Available Scripts

```bash
npm run dev        # Start local dev server
npm run build      # Build production app
npm run start      # Start production server after build
npm run lint       # Run Next.js lint checks
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio
```
