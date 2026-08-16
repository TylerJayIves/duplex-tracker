-- Private bucket for quote PDFs, receipts, and before/after photos. Table
-- grants for storage.objects/storage.buckets are already in place for
-- `authenticated` (verified via information_schema.role_table_grants against
-- the running instance) -- unlike public-schema tables, Storage ships its own
-- grants at bootstrap, so RLS policies alone are sufficient here.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'attachments',
  'attachments',
  false,
  10485760, -- 10MB in bytes -- the "10MB" string format is only valid in config.toml's global default
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do nothing;

create policy "authenticated full access" on storage.objects
  for all to authenticated
  using (bucket_id = 'attachments')
  with check (bucket_id = 'attachments');

create policy "authenticated full access" on storage.buckets
  for all to authenticated
  using (id = 'attachments')
  with check (id = 'attachments');
