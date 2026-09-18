-- =============================================================================
-- seed.sql
--
-- Seeds ONLY content that was verifiably present in the existing repository
-- (github.com/Geotech-ally/frontend-phase-of-my-portfolio). Anything not
-- found there is left out rather than invented — fabricated certifications,
-- employers or project metrics on a portfolio are a liability, not a
-- convenience.
--
-- Run AFTER creating your admin auth user (see docs/DEPLOYMENT.md), then
-- substitute its uuid below.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Profile
-- Replace '00000000-0000-0000-0000-000000000000' with the uuid of the user
-- you created in Supabase Dashboard → Authentication → Users.
-- ---------------------------------------------------------------------------
insert into profiles (
  id, role, full_name, professional_title, short_bio, long_bio,
  location, email, github_url, linkedin_url, is_available
) values (
  '00000000-0000-0000-0000-000000000000',
  'admin',
  'Geoffrey Akoo',
  'Full-Stack Developer & Cybersecurity Analyst',
  'I build web applications and network infrastructure, and I approach both with a security-first mindset.',
  'With over three years of experience in the technology industry, I specialize in creating comprehensive digital solutions that bridge the gap between business needs and technical implementation. My expertise spans web development, network engineering and IT consulting.',
  'Nakuru, Kenya',
  'hello@example.com',
  'https://github.com/Geotech-ally',
  'https://www.linkedin.com/in/geoffrey-akoo',
  true
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Skill categories + skills
-- Drawn from the technologies actually referenced in the existing repo.
-- ---------------------------------------------------------------------------
insert into skill_categories (name, slug, sort_order) values
  ('Frontend Development', 'frontend', 1),
  ('Backend Development',  'backend',  2),
  ('Databases',            'databases', 3),
  ('Cybersecurity',        'cybersecurity', 4),
  ('Networking',           'networking', 5),
  ('Tools & Platforms',    'tools', 6)
on conflict (name) do nothing;

insert into skills (category_id, name, sort_order)
select c.id, s.name, s.ord
from (values
  ('frontend', 'HTML', 1),
  ('frontend', 'CSS', 2),
  ('frontend', 'JavaScript', 3),
  ('frontend', 'TypeScript', 4),
  ('frontend', 'React', 5),
  ('backend',  'Python', 1),
  ('backend',  'Flask', 2),
  ('backend',  'Node.js', 3),
  ('databases','PostgreSQL', 1),
  ('databases','SQLite', 2),
  ('cybersecurity', 'Network security fundamentals', 1),
  ('cybersecurity', 'OWASP Top 10', 2),
  ('networking', 'Cisco networking', 1),
  ('networking', 'Network architecture', 2),
  ('tools', 'Git', 1),
  ('tools', 'Linux', 2)
) as s(cat_slug, name, ord)
join skill_categories c on c.slug = s.cat_slug
on conflict (category_id, name) do nothing;

-- ---------------------------------------------------------------------------
-- Projects
--
-- Only projects confirmed in the existing repository are seeded, as drafts.
-- Each item needs its description, stack and links verified before publishing
-- and should remain draft until reviewed.
--
-- NOTE: the original brief also listed "Afyamedlink" and "Nexacare HMS".
-- Those were NOT found anywhere in the repository, so they are intentionally
-- omitted rather than seeded with invented details. Add them through the
-- admin UI with real information.
-- ---------------------------------------------------------------------------
insert into projects (title, slug, short_description, status, content_status, sort_order) values
  ('Personal Portfolio', 'personal-portfolio',
   'Portfolio and CMS built with React, TypeScript and Supabase. Description should be verified before publishing.',
   'maintained', 'draft', 1),
  ('Siaya Community Digital Hub Learning Platform', 'siaya-community-digital-hub',
   'Community platform case study pending verification of the full project scope and outcomes before publishing.',
   'completed', 'draft', 2),
  ('SaaS Analytics Dashboard', 'saas-analytics-dashboard',
   'Analytics product case study pending verification of stack, responsibilities and results before publishing.',
   'completed', 'draft', 3),
  ('Networking Architecture', 'networking-architecture',
   'Architecture project summary pending verification of topology, tooling and project objectives before publishing.',
   'completed', 'draft', 4),
  ('Business Website', 'business-website',
   'Business website project data pending verification of clients, scope and implementation details before publishing.',
   'completed', 'draft', 5)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------
insert into site_settings (key, value) values
  ('site_title', 'Geoffrey Akoo — Full-Stack Developer & Cybersecurity Analyst'),
  ('site_description', 'Full-stack web development, network engineering and cybersecurity projects, writeups and case studies.'),
  ('contact_response_time', 'Usually within two days')
on conflict (key) do nothing;
