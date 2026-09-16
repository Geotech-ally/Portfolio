# Deployment & Setup

## 1. Local development

```bash
npm install
cp .env.example .env    # then fill in the two values below
npm run dev
```

The app will start but show empty states until Supabase is configured — that
is expected.

## 2. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / publishable key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Paste both into `.env`.

Do **not** copy the `service_role` key into `.env`. It bypasses every
security policy in this project. See `SECURITY.md`.

## 3. Apply the database migrations

In the Supabase dashboard, open **SQL Editor** and run these in order:

1. `supabase/migrations/0001_init.sql` — tables, constraints, indexes, triggers
2. `supabase/migrations/0002_rls.sql` — Row Level Security policies
3. `supabase/migrations/0003_storage.sql` — storage buckets and their policies

Or with the Supabase CLI:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## 4. Create your admin account

Admin accounts are provisioned deliberately — there is no public signup page,
by design.

1. **Authentication → Users → Add user.** Use a real email and a strong,
   unique password.
2. Copy the new user's UUID.
3. Open `supabase/seed.sql`, replace
   `00000000-0000-0000-0000-000000000000` with that UUID, and fill in the two
   `TODO` fields (your public contact email and LinkedIn URL).
4. Run the seed file in the SQL Editor.

Verify it worked:

```sql
select id, full_name, role from profiles;
```

You should see one row with `role = 'admin'`. Sign in at `/admin/login`.

## 5. Verify RLS before going live

Worth doing once, and again after any schema change. In the SQL Editor:

```sql
-- Every table should show rowsecurity = true and at least one policy.
select tablename,
       rowsecurity as rls_enabled,
       (select count(*) from pg_policies p where p.tablename = t.tablename) as policies
from pg_tables t
where schemaname = 'public'
order by rls_enabled, tablename;
```

Then confirm the public can't read what it shouldn't:

```sql
set role anon;
select count(*) from contact_messages;        -- expect 0
select count(*) from newsletter_subscribers;  -- expect 0
select count(*) from audit_logs;              -- expect 0
select count(*) from projects;                -- expect only published rows
reset role;
```

If any of those return unexpected rows, stop and fix the policy before
deploying.

## 6. Generate types after schema changes

`src/types/database.ts` is hand-written to match the migrations. Once your
project is live, regenerate it instead of editing by hand:

```bash
npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts
```

One caveat: every row type must be declared with `type`, not `interface`.
TypeScript gives type aliases an implicit index signature but not interfaces,
so an `interface` row silently fails `postgrest-js`'s
`Record<string, unknown>` constraint and every insert/update resolves to
`never`. The generator gets this right; just don't "tidy" them into
interfaces afterward.

## 7. Production build

```bash
npm run build      # runs tsc -b, then vite build
npm run preview    # serve the production build locally
```

Both currently pass with no TypeScript or build errors.

## 8. Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages). Two things to get
right:

**SPA rewrites.** This app uses `createBrowserRouter`, so all paths must
serve `index.html` or deep links like `/projects/my-slug` will 404 on
refresh.

- Vercel — `vercel.json`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- Netlify — `public/_redirects`:
  ```
  /*  /index.html  200
  ```

**Environment variables.** Set `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` in the host's dashboard. Vite inlines them at
build time, so you must rebuild after changing them.

## 9. Security headers

Not configured in this repo, because they belong to the host. Add at minimum
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
and a `Content-Security-Policy` that allows your Supabase project origin for
`connect-src` and `img-src`. Test in report-only mode first — a CSP that
blocks Supabase will break every page silently.

## Before you publish content

- Replace every `TODO:` in the seeded projects with verified information.
- Confirm the certifications on the About page (issuer, date, credential URL)
  or remove them.
- Upload your resume PDF to the `resume` bucket and set `profiles.resume_url`
  to its storage path.
- Flip `content_status` to `published` only for entries you've checked.
