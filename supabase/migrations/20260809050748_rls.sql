-- Exactly two users, both of whom should see and edit everything -- this
-- isn't multi-tenant, so there's no per-row ownership to enforce. RLS's job
-- here is just "reject anonymous requests, allow anything from a signed-in
-- session" -- one identical policy per table says that and nothing more.
-- Nothing is granted to `anon`, so an unauthenticated request gets zero rows.
--
-- RLS policies only filter rows for operations already permitted at the
-- GRANT level -- this CLI's default no longer auto-exposes new public
-- tables to the Data API roles, so the explicit GRANTs below are required
-- alongside the policies, not optional belt-and-suspenders.

grant usage on schema public to authenticated;

grant select, insert, update, delete on
  public.users,
  public.properties,
  public.areas,
  public.projects,
  public.tasks,
  public.cost_items,
  public.contractors,
  public.quotes,
  public.quote_reminders,
  public.budgets,
  public.comments,
  public.attachments
to authenticated;

alter table public.users enable row level security;
alter table public.properties enable row level security;
alter table public.areas enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.cost_items enable row level security;
alter table public.contractors enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_reminders enable row level security;
alter table public.budgets enable row level security;
alter table public.comments enable row level security;
alter table public.attachments enable row level security;

create policy "authenticated full access" on public.users
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.properties
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.areas
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.projects
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.tasks
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.cost_items
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.contractors
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.quotes
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.quote_reminders
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.budgets
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.comments
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on public.attachments
  for all to authenticated using (true) with check (true);
