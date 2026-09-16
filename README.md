# Portfolio & CMS — Geoffrey Akoo

A portfolio and personal content management system for a Full-Stack Developer
and Cybersecurity Analyst. React + TypeScript front end, Supabase
(PostgreSQL, Auth, Storage) as the backend, with authorization enforced by
Row Level Security rather than by client-side route guards.

## Stack

React 19 · TypeScript (strict) · Vite · React Router · Tailwind CSS v4 ·
TanStack Query · React Hook Form · Zod · Supabase · Lucide

## Quick start

```bash
npm install
cp .env.example .env    # add your Supabase URL and anon key
npm run dev
```

Full setup — creating the Supabase project, applying migrations, provisioning
your admin account — is in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck (`tsc -b`) then production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

## Structure

```
src/
├── app/           router, providers, query client
├── components/
│   ├── layout/    RootLayout, Navbar, Footer, Container, Section
│   ├── shared/    async states, markdown renderer, brand icons
│   └── ui/        Button, LinkButton
├── hooks/         useAuth, useProfile, useTheme
├── lib/           supabase client, auth, storage, utils
├── pages/
│   ├── public/    Home, About, Skills, Projects, Blog, Security Lab, …
│   └── admin/     login, layout, dashboard
├── services/      one module per domain — all DB access lives here
├── styles/        global design tokens and base styles
└── types/         database types

supabase/
├── migrations/    0001 schema · 0002 RLS · 0003 storage
└── seed.sql
```

Components never call Supabase directly; they go through `services/`.

## Routes

**Public** — `/` `/about` `/skills` `/projects` `/projects/:slug`
`/experience` `/certifications` `/security-lab` `/security-lab/:slug`
`/blog` `/blog/:slug` `/resume` `/contact` `/privacy` · 404 fallback

**Admin** — `/admin/login` `/admin` (+ projects, blog, security-lab, messages)

## Security

Authorization is enforced in PostgreSQL. The React route guards are for user
experience only — the real boundary is the policy set in
`supabase/migrations/0002_rls.sql`, which was verified against a live
PostgreSQL instance (results in [`docs/SECURITY.md`](docs/SECURITY.md)).

Summary of what the public anon key can do: read published content, submit a
contact message, subscribe to the newsletter, record an analytics event.
Nothing else. It cannot read messages, subscribers, audit logs, or drafts,
and cannot modify anything.

## Design

A dark-first "instrument panel" visual language — hairline rules with tick
marks instead of heavy cards, IBM Plex Sans with monospace reserved for
technical metadata, one amber signal accent plus a cold teal for security
context. All tokens live in `src/styles/globals.css`; both themes are
tuned for contrast and the app respects `prefers-color-scheme` and
`prefers-reduced-motion`.

## Status

Working: design system, routing with code splitting, all public pages wired
to live queries with loading/empty/error states, contact form with
validation, admin login and dashboard, the full database schema, RLS
policies, and storage buckets.

Not yet built: admin CRUD forms (the tables, policies, and service functions
are ready to wire up), rate limiting on the contact form, the newsletter
unsubscribe Edge Function, audit-log triggers, and automated tests. See the
Remaining Work section of [`docs/SECURITY.md`](docs/SECURITY.md).

Seeded projects are drafts containing `TODO:` markers and will not appear
publicly until you replace them with verified content and publish.

## Docs

- [`docs/SECURITY.md`](docs/SECURITY.md) — authorization model, verified test results, open items
- [`docs/MIGRATION.md`](docs/MIGRATION.md) — mapping from the old Flask app
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — setup, hosting, verification
