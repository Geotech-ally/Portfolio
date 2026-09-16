-- =============================================================================
-- 0002_rls.sql — Row Level Security
--
-- This file is the actual authorization boundary of the application. The
-- React route guards in src/pages/admin are UX only; a hostile client
-- talking straight to the REST API with the public anon key is constrained
-- by exactly what is written here.
--
-- Principles applied:
--   * RLS is enabled on EVERY table, including ones with no public policy.
--     A table with RLS enabled and no matching policy denies by default,
--     which is the behavior we want for audit_logs et al.
--   * Anonymous users get the narrowest possible grants: read published
--     content, insert a contact message, insert a newsletter row, insert an
--     analytics event. Nothing else.
--   * Admin writes are gated on a SECURITY DEFINER helper rather than an
--     inline subquery on profiles, so the role lookup cannot itself recurse
--     through profiles' own RLS policy.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Role helper.
--
-- SECURITY DEFINER + a fixed search_path: this runs as the function owner so
-- it can read profiles.role without being filtered by profiles' own RLS,
-- which would otherwise cause infinite policy recursion. The fixed
-- search_path prevents a caller from shadowing `profiles` with their own
-- table to spoof a role.
-- ---------------------------------------------------------------------------
create or replace function auth_role()
returns user_role
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce((select role from profiles where id = auth.uid()) = 'admin', false);
$$;

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce((select role from profiles where id = auth.uid()) in ('admin', 'editor'), false);
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere. Order matters only in that nothing is left out.
-- ---------------------------------------------------------------------------
alter table profiles               enable row level security;
alter table skill_categories       enable row level security;
alter table skills                 enable row level security;
alter table experience             enable row level security;
alter table certifications         enable row level security;
alter table projects               enable row level security;
alter table project_images         enable row level security;
alter table project_technologies   enable row level security;
alter table blog_categories        enable row level security;
alter table blog_tags              enable row level security;
alter table blog_posts             enable row level security;
alter table blog_post_tags         enable row level security;
alter table security_writeups      enable row level security;
alter table contact_messages       enable row level security;
alter table newsletter_subscribers enable row level security;
alter table site_settings          enable row level security;
alter table analytics_events       enable row level security;
alter table audit_logs             enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
--
-- Readable by anyone (the public site renders the owner's name/bio/links).
-- If you later store anything non-public on this table, split it into a
-- separate private table rather than loosening this policy.
--
-- Critically: the self-update policy does NOT permit changing `role`. That
-- is enforced by the trigger below rather than in the policy, because a
-- WITH CHECK clause cannot compare against the pre-update row.
-- ---------------------------------------------------------------------------
create policy "profiles are publicly readable"
  on profiles for select
  using (true);

create policy "users update own profile"
  on profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "admins update any profile"
  on profiles for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Privilege-escalation guard: block any non-admin from changing a role,
-- including their own. Admin provisioning happens out of band (see
-- docs/SECURITY.md and seed.sql), never through the app.
create or replace function prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role and not is_admin() then
    raise exception 'insufficient privilege to change role';
  end if;
  return new;
end;
$$;

create trigger profiles_block_role_escalation
  before update on profiles
  for each row execute function prevent_role_escalation();

-- ---------------------------------------------------------------------------
-- Public reference content: skills, experience, certifications.
-- Read by anyone; written only by staff.
-- ---------------------------------------------------------------------------
create policy "skill categories are public" on skill_categories for select using (true);
create policy "staff manage skill categories" on skill_categories for all
  to authenticated using (is_staff()) with check (is_staff());

create policy "skills are public" on skills for select using (true);
create policy "staff manage skills" on skills for all
  to authenticated using (is_staff()) with check (is_staff());

create policy "experience is public" on experience for select using (true);
create policy "staff manage experience" on experience for all
  to authenticated using (is_staff()) with check (is_staff());

create policy "certifications are public" on certifications for select using (true);
create policy "staff manage certifications" on certifications for all
  to authenticated using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------------------
-- Projects — only PUBLISHED rows are visible anonymously. Drafts stay
-- invisible even though the listing endpoint is the same one the admin UI
-- uses; staff see everything via the second policy.
-- ---------------------------------------------------------------------------
create policy "published projects are public"
  on projects for select
  using (content_status = 'published');

create policy "staff read all projects"
  on projects for select
  to authenticated
  using (is_staff());

create policy "staff manage projects"
  on projects for all
  to authenticated
  using (is_staff()) with check (is_staff());

-- Child rows follow the parent's visibility rather than being independently
-- public — otherwise an unpublished project's gallery would leak.
create policy "images of published projects are public"
  on project_images for select
  using (exists (
    select 1 from projects p
    where p.id = project_images.project_id and p.content_status = 'published'
  ));

create policy "staff manage project images"
  on project_images for all
  to authenticated
  using (is_staff()) with check (is_staff());

create policy "technologies of published projects are public"
  on project_technologies for select
  using (exists (
    select 1 from projects p
    where p.id = project_technologies.project_id and p.content_status = 'published'
  ));

create policy "staff manage project technologies"
  on project_technologies for all
  to authenticated
  using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------
create policy "blog categories are public" on blog_categories for select using (true);
create policy "staff manage blog categories" on blog_categories for all
  to authenticated using (is_staff()) with check (is_staff());

create policy "blog tags are public" on blog_tags for select using (true);
create policy "staff manage blog tags" on blog_tags for all
  to authenticated using (is_staff()) with check (is_staff());

create policy "published posts are public"
  on blog_posts for select
  using (content_status = 'published');

create policy "staff read all posts"
  on blog_posts for select
  to authenticated using (is_staff());

create policy "staff manage posts"
  on blog_posts for all
  to authenticated using (is_staff()) with check (is_staff());

create policy "tags of published posts are public"
  on blog_post_tags for select
  using (exists (
    select 1 from blog_posts b
    where b.id = blog_post_tags.post_id and b.content_status = 'published'
  ));

create policy "staff manage post tags" on blog_post_tags for all
  to authenticated using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------------------
-- Security writeups
-- ---------------------------------------------------------------------------
create policy "published writeups are public"
  on security_writeups for select
  using (content_status = 'published');

create policy "staff read all writeups"
  on security_writeups for select
  to authenticated using (is_staff());

create policy "staff manage writeups"
  on security_writeups for all
  to authenticated using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------------------
-- contact_messages — INSERT-only for the public.
--
-- There is deliberately NO public SELECT policy: a visitor can send a
-- message but can never read one back, including their own. Without this
-- asymmetry the contact form would double as a public inbox dump.
-- ---------------------------------------------------------------------------
create policy "anyone may send a message"
  on contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "staff read messages"
  on contact_messages for select
  to authenticated using (is_staff());

create policy "staff update messages"
  on contact_messages for update
  to authenticated using (is_staff()) with check (is_staff());

create policy "admins delete messages"
  on contact_messages for delete
  to authenticated using (is_admin());

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
--
-- Public may insert (subscribe). Public may NOT select — the subscriber
-- list is not enumerable. Unsubscribe is handled by an Edge Function using
-- the token, not by a public UPDATE policy, because a public UPDATE policy
-- broad enough to allow unsubscribing would also allow reactivating or
-- tampering with arbitrary rows.
-- ---------------------------------------------------------------------------
create policy "anyone may subscribe"
  on newsletter_subscribers for insert
  to anon, authenticated
  with check (is_active = true);

create policy "staff read subscribers"
  on newsletter_subscribers for select
  to authenticated using (is_staff());

create policy "admins manage subscribers"
  on newsletter_subscribers for all
  to authenticated using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- site_settings
-- ---------------------------------------------------------------------------
create policy "settings are public" on site_settings for select using (true);
create policy "admins manage settings" on site_settings for all
  to authenticated using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- analytics_events — write-only for the public, readable by staff.
-- ---------------------------------------------------------------------------
create policy "anyone may record an event"
  on analytics_events for insert
  to anon, authenticated
  with check (true);

create policy "staff read analytics"
  on analytics_events for select
  to authenticated using (is_staff());

-- ---------------------------------------------------------------------------
-- audit_logs — no INSERT policy for clients at all. Rows are written by
-- SECURITY DEFINER triggers/functions only, so the log cannot be forged
-- from the frontend. Admins may read.
-- ---------------------------------------------------------------------------
create policy "admins read audit logs"
  on audit_logs for select
  to authenticated using (is_admin());
