/**
 * Hand-written types mirroring supabase/migrations/0001_init.sql.
 *
 * When the schema changes, prefer regenerating this file from the live
 * project with the Supabase CLI:
 *
 *   npx supabase gen types typescript --project-id <project-ref> > src/types/database.ts
 *
 * Until the project exists, this file is the single source of truth the
 * rest of the app is typed against.
 */

export type UserRole = "admin" | "editor";
export type ContentStatus = "draft" | "published" | "archived";
export type ProjectStatus = "in_progress" | "completed" | "maintained" | "archived";
export type MessageStatus = "new" | "read" | "replied" | "archived";
export type Severity = "info" | "low" | "medium" | "high" | "critical";

export type Profile = {
  id: string; // uuid, references auth.users
  role: UserRole;
  full_name: string;
  professional_title: string;
  short_bio: string;
  long_bio: string | null;
  location: string | null;
  email: string;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  other_links: { label: string; url: string }[] | null;
  avatar_url: string | null;
  resume_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export type SkillCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export type Skill = {
  id: string;
  category_id: string;
  name: string;
  proficiency_note: string | null; // self-assessment text, never a fabricated %
  sort_order: number;
  created_at: string;
}

export type Experience = {
  id: string;
  organization: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null; // null = current
  description: string;
  responsibilities: string[];
  technologies: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  credential_id: string | null;
  credential_url: string | null;
  certificate_asset_path: string | null; // Supabase Storage path, `certificates` bucket
  description: string | null;
  sort_order: number;
  created_at: string;
}

export type Project = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string | null;
  problem: string | null;
  solution: string | null;
  features: string[];
  role: string | null;
  status: ProjectStatus;
  content_status: ContentStatus;
  github_url: string | null;
  live_url: string | null;
  cover_image_path: string | null; // `project-images` bucket
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectImage = {
  id: string;
  project_id: string;
  image_path: string;
  caption: string | null;
  sort_order: number;
}

export type ProjectTechnology = {
  id: string;
  project_id: string;
  technology: string;
}

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
}

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_markdown: string;
  category_id: string | null;
  cover_image_path: string | null; // `blog-images` bucket
  author_id: string; // references profiles.id
  content_status: ContentStatus;
  featured: boolean;
  reading_time_minutes: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type SecurityWriteup = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content_markdown: string;
  category: string; // web | network | linux | ctf | soc | tooling | owasp | other
  tags: string[];
  severity: Severity | null;
  tools: string[];
  cover_image_path: string | null;
  content_status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export type NewsletterSubscriber = {
  id: string;
  email: string;
  is_active: boolean;
  unsubscribe_token: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export type SiteSetting = {
  key: string;
  value: string;
  updated_at: string;
}

export type AnalyticsEvent = {
  id: string;
  event_name: string;
  path: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type AuditLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

/** Shape expected by @supabase/postgrest-js's GenericTable. */
/**
 * Shape expected by @supabase/postgrest-js's GenericTable.
 *
 * Note: every row type in this file is declared with `type`, not `interface`.
 * That is deliberate and load-bearing — TypeScript gives type aliases an
 * implicit index signature but not interfaces, so an `interface` row does
 * not satisfy postgrest-js's `Record<string, unknown>` constraint and every
 * insert/update silently resolves to `never`.
 */
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

/**
 * The shape Supabase's generated `Database` type would take. Modeled by
 * hand here so `supabase.from("projects")` etc. is fully typed without a
 * live project to generate against yet. Regenerate with the Supabase CLI
 * once a real project exists (see the note at the top of this file).
 */
export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile>;
      skill_categories: Table<SkillCategory>;
      skills: Table<Skill>;
      experience: Table<Experience>;
      certifications: Table<Certification>;
      projects: Table<Project>;
      project_images: Table<ProjectImage>;
      project_technologies: Table<ProjectTechnology>;
      blog_categories: Table<BlogCategory>;
      blog_tags: Table<BlogTag>;
      blog_posts: Table<BlogPost>;
      security_writeups: Table<SecurityWriteup>;
      contact_messages: Table<ContactMessage>;
      newsletter_subscribers: Table<NewsletterSubscriber>;
      site_settings: Table<SiteSetting>;
      analytics_events: Table<AnalyticsEvent>;
      audit_logs: Table<AuditLog>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
