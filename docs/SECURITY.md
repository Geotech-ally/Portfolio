# Security

## The authorization model in one paragraph

Authentication is Supabase Auth. Authorization is PostgreSQL Row Level
Security. The React app's route guards (`src/pages/admin/AdminLayout.tsx`)
exist so unauthenticated visitors get redirected instead of seeing a broken
shell — they are **not** a security control. Anyone can open devtools, take
the anon key out of the JS bundle, and talk to the PostgREST endpoint
directly. What stops them is the policy set in
`supabase/migrations/0002_rls.sql`, which is enforced by the database on
every request regardless of what client sent it.

Anything you add later should assume the same: if a rule is not expressed in
SQL, it is not enforced.

## What the public (anon key) can actually do

| Action | Allowed |
|---|---|
| Read `published` projects / posts / writeups | Yes |
| Read `draft` or `archived` content | No |
| Read skills, experience, certifications, profile, site settings | Yes |
| Insert a contact message | Yes |
| **Read** contact messages | No |
| Subscribe to the newsletter | Yes |
| **Read** the subscriber list | No |
| Insert an analytics event | Yes |
| **Read** analytics | No |
| Read audit logs | No |
| Modify any content | No |
| Change anyone's role | No |

## Verified, not asserted

These were tested by applying all three migrations to a real PostgreSQL 16
instance with a stand-in for Supabase's `auth` schema, then querying as the
`anon` and `authenticated` roles. Results:

- Anon sees 1 of 2 projects (the published one). Draft invisible. ✅
- Anon sees 0 contact messages, 0 subscribers, 0 audit log rows. ✅
- Anon insert into `contact_messages` succeeds. ✅
- Anon `UPDATE projects` affects 0 rows; anon `INSERT` raises
  `new row violates row-level security policy`. ✅
- Admin sees both projects and all messages. ✅
- An `editor` attempting `update profiles set role = 'admin'` on their own
  row raises `insufficient privilege to change role`; role unchanged after. ✅
- All 18 public tables report `rowsecurity = true` with at least one policy. ✅

Re-run these yourself after any schema change — the test script is in
`docs/DEPLOYMENT.md`.

## Specific decisions worth knowing about

**`is_admin()` / `is_staff()` are `SECURITY DEFINER` with a pinned
`search_path`.** A policy on `profiles` that queries `profiles` recurses
infinitely. Running the lookup as the function owner sidesteps the caller's
RLS. The pinned `search_path = public, pg_temp` matters just as much: without
it a caller could create `pg_temp.profiles` and have the function read their
forged table instead of the real one.

**Role changes are blocked by a trigger, not a policy.** A `WITH CHECK`
clause cannot see the pre-update row, so it cannot express "the role column
did not change." The `prevent_role_escalation()` trigger compares `old.role`
to `new.role` and raises unless the caller is already an admin. This is the
single most important control in the file — without it, the "users update
own profile" policy would let any editor promote themselves.

**Child tables check the parent's publication state.** `project_images` and
`project_technologies` don't get a blanket public read policy; they check
`exists (select 1 from projects p where ... p.content_status = 'published')`.
Otherwise an unpublished project's gallery and stack would leak even though
the project row itself was hidden.

**`contact_messages` has no public SELECT policy at all.** Insert-only. A
visitor cannot read back even the message they just sent. Without that
asymmetry the contact form doubles as a public inbox.

**`audit_logs` has no INSERT policy for any client role.** Rows are only
written by `SECURITY DEFINER` functions, so the log can't be forged from the
frontend.

**Newsletter unsubscribe is not a public UPDATE policy.** A policy broad
enough to let someone unsubscribe themselves would also let them reactivate
or tamper with arbitrary rows. Unsubscribe should go through an Edge Function
that validates `unsubscribe_token` server-side. **This Edge Function is not
yet written** — see Remaining Work.

**Private storage buckets have no anon SELECT policy.** `resume` and
`certificates` are served through short-lived signed URLs, which Storage
validates itself. Adding an "anon can read resume" policy would make the
entire bucket listable.

## Input handling

- Contact and newsletter input is validated with Zod client-side
  (`src/services/contact.service.ts`) **and** constrained by `CHECK`
  constraints in SQL — length bounds, `@` in email. The client check is for
  error messages; the database check is the real one.
- Markdown is rendered by `react-markdown` **without** `rehype-raw` and
  without `dangerouslySetInnerHTML` (`src/components/shared/Markdown.tsx`).
  Embedded HTML in stored content is printed as text, not executed. If you
  ever add `rehype-raw` for richer formatting, add `rehype-sanitize` in the
  same commit.
- Uploads are checked for MIME type and size client-side, and again by each
  bucket's `allowed_mime_types` / `file_size_limit` in
  `0003_storage.sql`. Filenames are regenerated as `crypto.randomUUID()` +
  a sanitized extension, so a user-supplied name can never influence the
  storage path.
- Login failures return a single generic message regardless of cause, to
  avoid account enumeration.

## Secrets

`.env` is gitignored; `.env.example` holds only key names. The frontend uses
the anon/publishable key, which is designed to be public — it is safe in the
bundle precisely *because* RLS constrains it.

`SUPABASE_SERVICE_ROLE_KEY` bypasses RLS entirely. It must never appear in
any `VITE_*` variable, any client file, or any commit. Service-role work
belongs in Edge Functions with the key set as an Edge Function secret.

If the original repository ever committed a real `.env` (the Flask app used
`SECRET_KEY`, mail credentials, and a database URL), treat those credentials
as compromised and rotate them — git history keeps them even after deletion.

## Remaining work

Honest list of what is **not** done:

- **Rate limiting is not implemented.** The contact form has a honeypot and
  the table has length constraints, but nothing stops a script from inserting
  thousands of rows. This needs an Edge Function that checks a time window
  per IP before inserting, or Supabase's built-in protections. Until then the
  contact form is spammable.
- **Newsletter unsubscribe Edge Function is not written.** The token column
  and client function exist; the server-side validator does not.
- **Security headers (CSP, X-Content-Type-Options, Referrer-Policy) are not
  configured.** These belong in your hosting platform's config
  (`vercel.json`, `netlify.toml`, or nginx) and depend on where you deploy.
- **No audit-log triggers are wired up yet.** The table and policies exist;
  nothing writes to it.
- **No automated tests.** The RLS verification above was run manually.
  Consider porting that script into CI.
- `npm audit` should be run after install and reviewed.
