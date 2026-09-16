-- =============================================================================
-- 0001_init.sql — core schema
-- Portfolio + CMS for a Full-Stack Developer / Cybersecurity Analyst.
--
-- Conventions used throughout:
--   * UUID primary keys, generated server-side (gen_random_uuid()).
--   * created_at / updated_at on every mutable table, updated_at maintained
--     by trigger rather than by the client (a client-supplied timestamp is
--     not trustworthy).
--   * Publication state is modeled explicitly as content_status rather than
--     a boolean, so "draft" and "archived" are distinguishable.
--   * Slugs are unique and indexed — they are the public URL key.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role       as enum ('admin', 'editor');
create type content_status  as enum ('draft', 'published', 'archived');
create type project_status  as enum ('in_progress', 'completed', 'maintained', 'archived');
create type message_status  as enum ('new', 'read', 'replied', 'archived');
create type severity_level  as enum ('info', 'low', 'medium', 'high', 'critical');

-- ---------------------------------------------------------------------------
-- updated_at trigger function
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — extends auth.users. One row per authenticated admin/editor.
-- The public site reads exactly one row (the owner's) for name/bio/links.
--
-- NOTE: `role` lives here, and the RLS policies in 0002 read it to decide
-- who may write. It must therefore never be updatable by the row's own
-- owner — see the profiles UPDATE policy, which excludes it.
-- ---------------------------------------------------------------------------
create table profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  role                user_role not null default 'editor',
  full_name           text not null check (length(full_name) between 1 and 120),
  professional_title  text not null default '',
  short_bio           text not null default '',
  long_bio            text,
  location            text,
  email               text not null check (position('@' in email) > 1),
  phone               text,
  github_url          text,
  linkedin_url        text,
  other_links         jsonb default '[]'::jsonb,
  avatar_url          text,
  resume_url          text,          -- storage path within the `resume` bucket
  is_available        boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Skills
-- ---------------------------------------------------------------------------
create table skill_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table skills (
  id               uuid primary key default gen_random_uuid(),
  category_id      uuid not null references skill_categories(id) on delete cascade,
  name             text not null,
  -- Free-text self-assessment ("daily driver", "used in production",
  -- "learning"). Deliberately NOT a percentage: a fabricated number implies
  -- a precision that doesn't exist.
  proficiency_note text,
  sort_order       int  not null default 0,
  created_at       timestamptz not null default now(),
  unique (category_id, name)
);
create index skills_category_idx on skills(category_id);

-- ---------------------------------------------------------------------------
-- Experience
-- ---------------------------------------------------------------------------
create table experience (
  id               uuid primary key default gen_random_uuid(),
  organization     text not null,
  position         text not null,
  location         text,
  start_date       date not null,
  end_date         date,          -- null == current role
  description      text not null default '',
  responsibilities text[] not null default '{}',
  technologies     text[] not null default '{}',
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint experience_dates_ordered check (end_date is null or end_date >= start_date)
);
create trigger experience_updated_at before update on experience
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Certifications
-- ---------------------------------------------------------------------------
create table certifications (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  issuer                 text not null,
  issue_date             date not null,
  credential_id          text,
  credential_url         text,
  certificate_asset_path text,  -- private `certificates` bucket
  description            text,
  sort_order             int not null default 0,
  created_at             timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table projects (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  short_description text not null check (length(short_description) <= 300),
  full_description  text,
  problem           text,
  solution          text,
  features          text[] not null default '{}',
  role              text,
  status            project_status not null default 'completed',
  content_status    content_status not null default 'draft',
  github_url        text,
  live_url          text,
  cover_image_path  text,
  featured          boolean not null default false,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create trigger projects_updated_at before update on projects
  for each row execute function set_updated_at();

-- Partial index: the public listing only ever filters on published rows.
create index projects_published_idx on projects(content_status, sort_order)
  where content_status = 'published';
create index projects_featured_idx on projects(featured)
  where featured = true and content_status = 'published';

create table project_images (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_path text not null,
  caption    text,
  sort_order int not null default 0
);
create index project_images_project_idx on project_images(project_id);

create table project_technologies (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  technology text not null,
  unique (project_id, technology)
);
create index project_technologies_project_idx on project_technologies(project_id);

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------
create table blog_categories (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table blog_tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table blog_posts (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  slug                 text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt              text not null default '' check (length(excerpt) <= 400),
  content_markdown     text not null default '',
  category_id          uuid references blog_categories(id) on delete set null,
  cover_image_path     text,
  author_id            uuid not null references profiles(id) on delete restrict,
  content_status       content_status not null default 'draft',
  featured             boolean not null default false,
  reading_time_minutes int check (reading_time_minutes is null or reading_time_minutes > 0),
  published_at         timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  -- A published post must have a publication date; a draft must not pretend to.
  constraint blog_published_has_date
    check (content_status <> 'published' or published_at is not null)
);
create trigger blog_posts_updated_at before update on blog_posts
  for each row execute function set_updated_at();

create index blog_posts_published_idx on blog_posts(content_status, published_at desc)
  where content_status = 'published';
create index blog_posts_category_idx on blog_posts(category_id);

create table blog_post_tags (
  post_id uuid not null references blog_posts(id) on delete cascade,
  tag_id  uuid not null references blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ---------------------------------------------------------------------------
-- Security Lab
-- ---------------------------------------------------------------------------
create table security_writeups (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary          text not null default '' check (length(summary) <= 400),
  content_markdown text not null default '',
  category         text not null default 'other',
  tags             text[] not null default '{}',
  severity         severity_level,
  tools            text[] not null default '{}',
  cover_image_path text,
  content_status   content_status not null default 'draft',
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint security_published_has_date
    check (content_status <> 'published' or published_at is not null)
);
create trigger security_writeups_updated_at before update on security_writeups
  for each row execute function set_updated_at();

create index security_writeups_published_idx on security_writeups(content_status, published_at desc)
  where content_status = 'published';
create index security_writeups_tags_idx on security_writeups using gin(tags);

-- ---------------------------------------------------------------------------
-- Contact messages — anonymous INSERT, admin-only SELECT (see 0002).
-- ---------------------------------------------------------------------------
create table contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (length(name) between 2 and 100),
  email      text not null check (position('@' in email) > 1 and length(email) <= 200),
  subject    text check (subject is null or length(subject) <= 150),
  message    text not null check (length(message) between 10 and 4000),
  status     message_status not null default 'new',
  created_at timestamptz not null default now()
);
create index contact_messages_status_idx on contact_messages(status, created_at desc);

-- ---------------------------------------------------------------------------
-- Newsletter
-- ---------------------------------------------------------------------------
create table newsletter_subscribers (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null unique check (position('@' in email) > 1),
  is_active          boolean not null default true,
  -- Random per-subscriber token so unsubscribe links carry no guessable id.
  unsubscribe_token  uuid not null unique default gen_random_uuid(),
  subscribed_at      timestamptz not null default now(),
  unsubscribed_at    timestamptz
);

-- ---------------------------------------------------------------------------
-- Site settings — simple key/value, admin-managed.
-- ---------------------------------------------------------------------------
create table site_settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Analytics — anonymous INSERT, admin-only SELECT.
-- Intentionally stores no IP address, user agent, or session identifier.
-- ---------------------------------------------------------------------------
create table analytics_events (
  id         uuid primary key default gen_random_uuid(),
  event_name text not null check (length(event_name) <= 60),
  path       text check (path is null or length(path) <= 300),
  metadata   jsonb,
  created_at timestamptz not null default now()
);
create index analytics_events_name_idx on analytics_events(event_name, created_at desc);

-- ---------------------------------------------------------------------------
-- Audit logs — written by triggers/admin actions, never by anonymous users.
-- Never store credentials, tokens or message bodies here.
-- ---------------------------------------------------------------------------
create table audit_logs (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references profiles(id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  metadata   jsonb,
  created_at timestamptz not null default now()
);
create index audit_logs_created_idx on audit_logs(created_at desc);
