-- Duplex Tracker schema: mirrors src/lib/data/types.ts field-for-field.
-- camelCase in TS <-> snake_case here; money stays integer cents throughout.

create extension if not exists pgcrypto;

create type area_type as enum ('rental_unit', 'external', 'shared');
create type project_status as enum ('idea', 'planned', 'in_progress', 'done', 'blocked');
create type project_priority as enum ('low', 'medium', 'high');
create type cost_category as enum ('materials', 'labor', 'permits', 'other');
create type quote_status as enum ('requested', 'received', 'accepted', 'declined');
create type budget_related_type as enum ('property', 'area', 'project');
create type attachment_related_type as enum ('project', 'quote', 'cost_item');

-- Synced from auth.users by the trigger in the next migration. auth.users has
-- no "name" field and isn't exposed to PostgREST, so this is where the
-- leadId/assignedToId/authorId foreign keys and display names actually live.
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  address text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.areas (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  type area_type not null,
  target_rent_cents integer,
  target_ready_date date,
  shared_allocation_pct numeric(5, 2),
  created_at timestamptz not null default now()
);
create index areas_property_id_idx on public.areas(property_id);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas(id) on delete cascade,
  lead_id uuid not null references public.users(id),
  title text not null,
  description text,
  category text,
  status project_status not null default 'idea',
  priority project_priority not null default 'medium',
  start_date date,
  target_end_date date,
  created_at timestamptz not null default now()
);
create index projects_area_id_idx on public.projects(area_id);
create index projects_lead_id_idx on public.projects(lead_id);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  assigned_to_id uuid references public.users(id),
  title text not null,
  is_done boolean not null default false,
  "order" integer not null default 0,
  due_date date,
  created_at timestamptz not null default now()
);
create index tasks_project_id_idx on public.tasks(project_id);

create table public.cost_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  label text not null,
  category cost_category not null default 'other',
  estimated_cost_cents integer not null,
  actual_cost_cents integer,
  paid_date date,
  created_at timestamptz not null default now()
);
create index cost_items_project_id_idx on public.cost_items(project_id);

create table public.contractors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text,
  email text,
  trade text,
  notes text,
  -- numeric, not smallint: existing seed data has half-star ratings (e.g. 4.5)
  rating numeric(2, 1) check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  contractor_id uuid not null references public.contractors(id),
  amount_cents integer not null,
  scope_description text,
  status quote_status not null default 'requested',
  received_date date,
  valid_until date,
  created_at timestamptz not null default now()
);
create index quotes_project_id_idx on public.quotes(project_id);
create index quotes_contractor_id_idx on public.quotes(contractor_id);

create table public.quote_reminders (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  offset_days smallint not null check (offset_days in (14, 7, 3)),
  sent_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);
create index quote_reminders_quote_id_idx on public.quote_reminders(quote_id);

-- related_id is polymorphic (points at properties/areas/projects depending on
-- related_type), so it can't be a real foreign key — same tradeoff as the
-- existing TypeScript design.
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  related_type budget_related_type not null,
  related_id uuid not null,
  limit_cents integer not null,
  notes text,
  created_at timestamptz not null default now()
);
create index budgets_related_idx on public.budgets(related_type, related_id);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.users(id),
  text text not null,
  created_at timestamptz not null default now()
);
create index comments_project_id_idx on public.comments(project_id);

-- related_id is polymorphic here too (project/quote/cost_item).
create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  related_type attachment_related_type not null,
  related_id uuid not null,
  file_url text not null,
  caption text,
  uploaded_by_id uuid not null references public.users(id),
  uploaded_at timestamptz not null default now()
);
create index attachments_related_idx on public.attachments(related_type, related_id);
