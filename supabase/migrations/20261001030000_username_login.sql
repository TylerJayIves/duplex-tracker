-- Sign-in is username + password, with no email sent. auth.users still keys
-- accounts by email, so the login form maps a username to that email through
-- email_for_username(). Usernames start as each person's lowercased name.
alter table public.users add column username text;
update public.users set username = lower(name) where username is null;
create unique index users_username_key on public.users (lower(username));

-- Called before sign-in, so it runs as anon and has to bypass RLS. It returns
-- only the one email for an exact username match.
create or replace function public.email_for_username(p_username text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select email from public.users where lower(username) = lower(trim(p_username));
$$;

revoke all on function public.email_for_username(text) from public;
grant execute on function public.email_for_username(text) to anon, authenticated;
