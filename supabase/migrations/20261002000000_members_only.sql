-- Members only. Until now any signed-in account had full access to every
-- table, and handle_new_user() gave every new account a public.users row.
-- So anyone who managed to create an account (signups left on in the
-- dashboard, or the Auth API called directly with the public anon key) could
-- read and edit everything.
--
-- Now access requires a row in public.users, and those rows can only be added
-- from the SQL editor (as postgres), never through the API. A stray account
-- can sign in but sees nothing and can change nothing.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- security definer so the check itself isn't filtered by the users policy.
create or replace function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.users where id = auth.uid());
$$;

revoke all on function public.is_member() from public;
grant execute on function public.is_member() to authenticated;

-- users: members can read the list; nobody can add, change or remove rows
-- through the API.
drop policy if exists "authenticated full access" on public.users;
create policy "members read" on public.users
  for select to authenticated using (public.is_member());
revoke insert, update, delete on public.users from authenticated;

do $$
declare
  t text;
begin
  foreach t in array array[
    'properties', 'areas', 'projects', 'tasks', 'cost_items', 'contractors',
    'quotes', 'quote_reminders', 'budgets', 'comments', 'attachments',
    'attention_dismissals'
  ] loop
    execute format('drop policy if exists "authenticated full access" on public.%I', t);
    execute format(
      'create policy "members full access" on public.%I for all to authenticated '
      'using (public.is_member()) with check (public.is_member())',
      t
    );
  end loop;
end;
$$;

drop policy if exists "authenticated full access" on storage.objects;
create policy "members full access" on storage.objects
  for all to authenticated
  using (bucket_id = 'attachments' and public.is_member())
  with check (bucket_id = 'attachments' and public.is_member());

drop policy if exists "authenticated full access" on storage.buckets;
create policy "members full access" on storage.buckets
  for all to authenticated
  using (id = 'attachments' and public.is_member())
  with check (id = 'attachments' and public.is_member());
