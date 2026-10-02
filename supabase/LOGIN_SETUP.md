# Login setup (hosted Supabase)

Sign-in is a username and password. No email is ever sent. The usernames
start as each person's name in lowercase (`tyler`, `elle`).

`supabase/config.toml` only configures the local stack, so the hosted
project needs these steps once.

## 1. Add usernames and set passwords

In the Supabase dashboard, open **SQL Editor**, paste this, replace the two
passwords, and run it. Skip the first block if `supabase db push` has
already applied `migrations/20261001030000_username_login.sql`.

```sql
-- Same as migrations/20261001030000_username_login.sql
alter table public.users add column if not exists username text;
update public.users set username = lower(name) where username is null;
create unique index if not exists users_username_key on public.users (lower(username));

create or replace function public.email_for_username(p_username text)
returns text language sql stable security definer set search_path = ''
as $$
  select email from public.users where lower(username) = lower(trim(p_username));
$$;
revoke all on function public.email_for_username(text) from public;
grant execute on function public.email_for_username(text) to anon, authenticated;

-- Passwords (change these)
update auth.users
set encrypted_password = extensions.crypt('CHANGE-ME-TYLER', extensions.gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now())
where id = (select id from public.users where username = 'tyler');

update auth.users
set encrypted_password = extensions.crypt('CHANGE-ME-ELLE', extensions.gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now())
where id = (select id from public.users where username = 'elle');

-- Check: both rows should say has_password = true
select u.username, a.email, a.encrypted_password <> '' as has_password
from public.users u join auth.users a on a.id = u.id;
```

After signing in, either of you can change your password from the account
page (click your name in the header).

## 2. Turn off new signups

**Authentication > Sign In / Providers**: turn off **Allow new users to sign
up**. Keep the **Email** provider enabled, since password sign-in runs
through it. Existing accounts are not affected.

## Changing a username

```sql
update public.users set username = 'newname' where username = 'oldname';
```

## 3. Members-only data access

Run `migrations/20261002000000_members_only.sql` in the SQL Editor (or
`supabase db push`). Afterwards only accounts with a row in `public.users`
can read or change anything, so an extra account that slips in sees nothing.

Check it worked. This should return no rows (no policy left that lets any
signed-in account in):

```sql
select schemaname, tablename, policyname
from pg_policies
where schemaname in ('public', 'storage')
  and roles @> array['authenticated']::name[]
  and (qual is null or qual not like '%is_member%')
  and cmd <> 'SELECT';
```

And this lists every account that exists. It should be just the two of you:

```sql
select email, created_at, last_sign_in_at from auth.users order by created_at;
```
