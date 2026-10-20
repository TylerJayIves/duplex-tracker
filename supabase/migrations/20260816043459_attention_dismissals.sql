-- Lets a user dismiss a "Needs attention" dashboard item (an overdue
-- task, an over-budget budget, a quote awaiting a decision) without
-- changing the underlying data. item_id matches the deterministic id the
-- dashboard already computes (e.g. "task-<uuid>", "budget-<uuid>",
-- "quote-<uuid>") -- there's no FK to a single source table since the id
-- can point at three different tables depending on prefix, same tradeoff as
-- the existing polymorphic budgets/attachments tables.
create table public.attention_dismissals (
  id uuid primary key default gen_random_uuid(),
  item_id text not null unique,
  dismissed_by_id uuid not null references public.users(id),
  dismissed_at timestamptz not null default now()
);
create index attention_dismissals_item_id_idx on public.attention_dismissals(item_id);

alter table public.attention_dismissals enable row level security;

create policy "authenticated full access" on public.attention_dismissals
  for all to authenticated using (true) with check (true);

-- Newer Supabase CLI doesn't auto-grant new public-schema tables to
-- authenticated/anon -- learned this the hard way earlier in the project.
grant select, insert, update, delete on public.attention_dismissals to authenticated;
