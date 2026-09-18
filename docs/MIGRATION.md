# Migration: Flask + static HTML → React + Supabase

## What the old repository was

`github.com/Geotech-ally/frontend-phase-of-my-portfolio` contained:

- Static HTML pages (`home.html`, `about.html`, `projects.html`,
  `blogs.html`, `services.html`, `contact.html`), duplicated between the
  repository root and `src/`.
- A Flask backend (`app.py`, ~40 KB) using Flask-SQLAlchemy against SQLite in
  development and PostgreSQL in production.
- Custom JWT authentication using PyJWT, with bcrypt password hashing.
- Flask-Mail for contact-form and newsletter email.
- File uploads written to `static/uploads/`.

Models: `ContactMessage`, `Project`, `ProjectImage`, `BlogPost`,
`Subscriber`, `User`.

## Data mapping

| Old (SQLAlchemy) | New (Postgres/Supabase) | Notes |
|---|---|---|
| `User` | `auth.users` + `profiles` | Custom JWT and bcrypt are gone. Supabase Auth owns credentials; `profiles.role` carries authorization. |
| `Project` | `projects` | Integer PK → UUID. Added `slug`, `content_status`, `problem`, `solution`, `features`, `featured`. |
| `ProjectImage` | `project_images` | Now cascades on project delete. |
| (none) | `project_technologies` | Was an unstructured field; normalized. |
| `BlogPost` | `blog_posts` | Added `slug`, `excerpt`, `content_status`, `published_at`, `reading_time_minutes`. |
| `ContactMessage` | `contact_messages` | Added `status` for triage. Length/format constraints enforced in SQL. |
| `Subscriber` | `newsletter_subscribers` | Added `unsubscribe_token`, `is_active`, `unsubscribed_at`. |
| `static/uploads/` | Supabase Storage buckets | Split public vs private; per-bucket MIME and size limits. |
| (none) | `skills`, `skill_categories`, `experience`, `certifications`, `security_writeups`, `site_settings`, `analytics_events`, `audit_logs` | New. |

## Content actually carried over

Real content was extracted from the old HTML rather than rewritten:

- **About page** — the "over three years of experience" positioning, the
  three-part philosophy (innovation through simplicity, security-first
  approach, client-centric solutions), the ICT degree, and the professional
  details block all come from the old `about.html`.
- **Skills** — seeded from technologies actually referenced in the old repo.
- **Projects** — `Personal Portfolio`, `Siaya Community Digital Hub Learning
  Platform`, `SaaS Analytics Dashboard`, `Networking Architecture`, and
  `Business Website` are seeded as drafts pending verification before public
  publishing.

### Two projects were deliberately NOT migrated

The original brief listed **Afyamedlink** and **Nexacare HMS** as projects to
preserve. Neither appears anywhere in the repository. Rather than invent
descriptions, stacks, and outcomes for them, they were left out. Add them
through the admin UI with real details.

For the same reason, every seeded project remains `content_status = 'draft'` until
verified information is added and published. This keeps anonymous visitors from seeing
unfinished entries before they are reviewed.

### Certifications

The old About page listed "Intro to Cybersecurity", "Intro to IoT", and
"Python Programming" certificates. These are rendered on the About page as
migrated, but the issuer, dates, and credential URLs should be verified before
publishing because unverifiable credentials are a liability with technical
recruiters.

## What was intentionally dropped

- **Custom JWT auth and bcrypt hashing.** Replaced by Supabase Auth. Hand-rolled
  auth is the single most common source of serious vulnerabilities in small
  projects.
- **Flask-Mail.** Contact submissions now land in `contact_messages` and are
  read from the admin dashboard. If you want email notification, add an Edge
  Function with your provider's key as an Edge Function secret — never a
  `VITE_*` variable.
- **Duplicate root/`src` HTML.** Collapsed into single React routes.
- **`services.html`.** The old site was positioned as a general business/services
  site. The new positioning is Full-Stack Developer + Cybersecurity Analyst,
  so services content was not carried over. Reintroduce it as a page if you
  still want it.

## Migration steps

1. Stand up the new app and Supabase project (see `DEPLOYMENT.md`).
2. If the old production database holds real data worth keeping, export each
   table to CSV, transform integer PKs to UUIDs, and import via the Supabase
   dashboard. Verify row counts before and after.
3. Publish content through the admin dashboard once verified.
4. Only after the new site is live and correct, archive the old repository.
   Don't delete the Flask app until you've confirmed nothing needed was left
   behind.
5. Rotate any credentials that were ever committed to the old repo's history.
