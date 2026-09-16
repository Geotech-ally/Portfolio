-- =============================================================================
-- 0003_storage.sql — Storage buckets and their policies
--
-- Bucket privacy is split deliberately:
--   public  : project-images, blog-images, profile  (rendered on public pages)
--   private : resume, certificates                  (served via signed URLs)
--
-- `resume` is private even though the resume page is public, so that the
-- file is fetched through a short-lived signed URL rather than living at a
-- permanent guessable address that stays live after you replace it.
--
-- allowed_mime_types / file_size_limit here are the real enforcement; the
-- checks in src/lib/storage.ts are only for fast client-side feedback.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-images', 'project-images', true,  5242880,  array['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('blog-images',    'blog-images',    true,  5242880,  array['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('profile',        'profile',        true,  5242880,  array['image/png','image/jpeg','image/webp']),
  ('certificates',   'certificates',   false, 10485760, array['image/png','image/jpeg','application/pdf']),
  ('resume',         'resume',         false, 10485760, array['application/pdf'])
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Public buckets: world-readable, staff-writable.
-- ---------------------------------------------------------------------------
create policy "public buckets are readable"
  on storage.objects for select
  using (bucket_id in ('project-images', 'blog-images', 'profile'));

create policy "staff upload to public buckets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('project-images', 'blog-images', 'profile') and is_staff()
  );

create policy "staff update public buckets"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('project-images', 'blog-images', 'profile') and is_staff())
  with check (bucket_id in ('project-images', 'blog-images', 'profile') and is_staff());

create policy "staff delete from public buckets"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('project-images', 'blog-images', 'profile') and is_staff());

-- ---------------------------------------------------------------------------
-- Private buckets: no anonymous SELECT policy at all.
--
-- Anonymous visitors reach these files only through a signed URL, which the
-- Storage service validates itself without consulting these policies. That
-- is why there is no "anon can read resume" policy here and why one must not
-- be added — it would make the whole bucket publicly listable.
-- ---------------------------------------------------------------------------
create policy "staff read private buckets"
  on storage.objects for select
  to authenticated
  using (bucket_id in ('certificates', 'resume') and is_staff());

create policy "staff write private buckets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('certificates', 'resume') and is_staff());

create policy "staff update private buckets"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('certificates', 'resume') and is_staff())
  with check (bucket_id in ('certificates', 'resume') and is_staff());

create policy "staff delete private buckets"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('certificates', 'resume') and is_staff());
