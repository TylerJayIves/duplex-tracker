-- Translated 1:1 from src/lib/data/mock/seed.ts. Fixed literal UUIDs (not
-- gen_random_uuid()) so FK references between insert blocks stay legible.
-- Runs automatically on `supabase start` / `supabase db reset`, as postgres
-- (superuser), so it bypasses the RLS policies from the rls migration.
--
-- ID scheme: {group}0000000-0000-0000-0000-00000000000{n}, where {group} is
-- a single hex digit per entity type (UUIDs are hex-only -- 0-9, a-f):
-- 1=users 2=identities 3=property 4=areas 5=contractors 6=projects
-- 7=tasks 8=cost_items 9=quotes a=quote_reminders b=budgets c=comments
-- d=attachments

-- ============================================================================
-- Two real logins (magic-link, no password) -- inserting straight into
-- auth.users/auth.identities is an unofficial-but-common local-dev-only
-- pattern (verified against this CLI's actual schema via `\d auth.users` /
-- `\d auth.identities` before writing this). Never do this against a hosted
-- project -- there, accounts get created by someone actually signing in.
-- ============================================================================

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
) values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001',
   'authenticated', 'authenticated', 'tylerjayives@proton.me', '',
   now(), '{"provider":"email","providers":["email"]}', '{"name":"Tyler"}',
   now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002',
   'authenticated', 'authenticated', 'lynnaisthebest@gmail.com', '',
   now(), '{"provider":"email","providers":["email"]}', '{"name":"Elle"}',
   now(), now(), '', '', '', '')
on conflict (id) do nothing;

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   jsonb_build_object('sub', '10000000-0000-0000-0000-000000000001', 'email', 'tylerjayives@proton.me'),
   'email', now(), now(), now()),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000002',
   jsonb_build_object('sub', '10000000-0000-0000-0000-000000000002', 'email', 'lynnaisthebest@gmail.com'),
   'email', now(), now(), now())
on conflict (id) do nothing;

-- Belt-and-suspenders alongside the on_auth_user_created trigger.
insert into public.users (id, email, name) values
  ('10000000-0000-0000-0000-000000000001', 'tylerjayives@proton.me', 'Tyler'),
  ('10000000-0000-0000-0000-000000000002', 'lynnaisthebest@gmail.com', 'Elle')
on conflict (id) do nothing;

-- ============================================================================
-- Domain data
-- ============================================================================

insert into public.properties (id, address, notes) values
  ('30000000-0000-0000-0000-000000000001', '3250',
   'Duplex with two rental units (3250 / 3250A) plus shared and external work -- roof, siding, garden, garage.');

insert into public.areas (id, property_id, name, type, target_rent_cents, target_ready_date, shared_allocation_pct) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '3250', 'rental_unit', 185000, '2026-11-01', 50),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '3250A', 'rental_unit', 160000, '2026-12-15', 50),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'Roof', 'external', null, null, null),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 'Siding', 'external', null, null, null),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 'Garden', 'external', null, null, null),
  ('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', 'Garage', 'external', null, null, null),
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000001', 'Shared / Whole Property', 'shared', null, null, null);

insert into public.contractors (id, name, company, phone, email, trade, notes, rating) values
  ('50000000-0000-0000-0000-000000000001', 'Dave Konecny', 'Konecny Roofing & Exteriors', '(555) 201-4471', 'dave@konecnyroofing.com', 'Roofing & Siding', 'Did the neighbor''s roof last year -- solid work, punctual.', 4.5),
  ('50000000-0000-0000-0000-000000000002', 'Priya Anand', 'Northside Kitchen & Bath', '(555) 337-9021', 'priya@northsidekb.com', 'Kitchen & Bath Remodel', 'Great with cabinet sourcing, slightly pricier than average.', 5.0),
  ('50000000-0000-0000-0000-000000000003', 'Marcus Webb', 'Webb General Contracting', '(555) 884-2260', 'marcus@webbgc.com', 'General Contractor', 'Can take on almost anything, quotes tend to run a bit high.', 4.0),
  ('50000000-0000-0000-0000-000000000004', 'Sofia Ruiz', 'Greenline Landscaping', '(555) 662-0138', 'sofia@greenlinelandscaping.com', 'Landscaping', 'New to us -- referred by a coworker, no history yet.', null);

insert into public.projects (id, area_id, lead_id, title, description, category, status, priority, start_date, target_end_date) values
  ('60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   '3250 Kitchen Refresh', 'Replace cabinets, countertops, and appliances to bring 3250''s kitchen up to rentable condition.', 'Kitchen', 'in_progress', 'high', '2026-06-01', '2026-09-15'),
  ('60000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002',
   'Full-Property Roof Replacement', 'Existing shingles are past their service life; replace before winter across both units.', 'Roofing', 'planned', 'high', '2026-09-01', '2026-10-15'),
  ('60000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
   '3250A Bathroom Remodel', 'Original bathroom fixtures are dated; scope not finalized yet.', 'Bathroom', 'idea', 'medium', null, null),
  ('60000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002',
   'Garage Door + Apron Repair', 'Replace the failing garage door and patch the concrete apron.', 'Exterior', 'done', 'low', '2026-03-20', '2026-04-10'),
  ('60000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001',
   'Backyard Landscaping Refresh', 'Waiting on a drainage assessment before any landscaping work can start.', 'Landscaping', 'blocked', 'low', null, null),
  ('60000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002',
   'Siding Repair -- North Wall', 'Water damage near the north wall needs new siding panels.', 'Exterior', 'planned', 'medium', '2026-08-25', '2026-09-05');

insert into public.tasks (id, project_id, assigned_to_id, title, is_done, "order", due_date) values
  ('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Remove old cabinets', true, 1, null),
  ('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Install new cabinets', true, 2, null),
  ('70000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Order quartz countertop', false, 3, current_date + 5),
  ('70000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Schedule appliance delivery', false, 4, null),
  ('70000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000001', null, 'Final electrical inspection', false, 5, null),
  ('70000000-0000-0000-0000-000000000006', '60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Get 3 contractor quotes', true, 1, null),
  ('70000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Confirm material -- architectural shingle vs. metal', false, 2, current_date + 3),
  ('70000000-0000-0000-0000-000000000008', '60000000-0000-0000-0000-000000000002', null, 'Schedule tear-off date', false, 3, null),
  ('70000000-0000-0000-0000-000000000009', '60000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Get quotes from 2-3 contractors', false, 1, null),
  ('70000000-0000-0000-0000-000000000010', '60000000-0000-0000-0000-000000000003', null, 'Decide: full remodel vs. refresh', false, 2, null);

insert into public.cost_items (id, project_id, label, category, estimated_cost_cents, actual_cost_cents, paid_date) values
  ('80000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'Cabinets -- Northside Kitchen & Bath', 'materials', 850000, 862000, '2026-06-20'),
  ('80000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', 'Quartz countertop', 'materials', 320000, null, null),
  ('80000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', 'Electrician -- rewire under-cabinet lighting', 'labor', 40000, 45000, '2026-07-10'),
  ('80000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000001', 'Electrical permit', 'permits', 12000, 12000, '2026-06-05'),
  ('80000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000004', 'New garage door + install', 'materials', 180000, 175000, '2026-04-02'),
  ('80000000-0000-0000-0000-000000000006', '60000000-0000-0000-0000-000000000004', 'Apron concrete patch', 'labor', 60000, 68000, '2026-04-10');

insert into public.quotes (id, project_id, contractor_id, amount_cents, scope_description, status, received_date, valid_until) values
  ('90000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001',
   1450000, 'Full tear-off and architectural shingle replacement, includes 25-yr material warranty.', 'received', '2026-08-01', current_date + 6),
  ('90000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000003',
   1610000, 'Full tear-off and replacement, architectural shingle.', 'requested', null, current_date + 12),
  ('90000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002',
   850000, 'Full cabinet replacement, install only (materials separate).', 'accepted', '2026-05-15', '2026-06-01'),
  ('90000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000001',
   320000, 'Replace damaged panels on north wall, matching existing siding.', 'received', '2026-08-05', current_date + 3);

insert into public.quote_reminders (id, quote_id, offset_days, sent_at, dismissed_at) values
  ('a0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', 7, now() - interval '1 day', null),
  ('a0000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000004', 3, now(), null);

insert into public.budgets (id, related_type, related_id, limit_cents, notes) values
  ('b0000000-0000-0000-0000-000000000001', 'area', '40000000-0000-0000-0000-000000000001', 1200000, '3250 unit-wide renovation cap for this year.'),
  ('b0000000-0000-0000-0000-000000000002', 'project', '60000000-0000-0000-0000-000000000001', 900000, ''),
  ('b0000000-0000-0000-0000-000000000003', 'project', '60000000-0000-0000-0000-000000000004', 250000, ''),
  ('b0000000-0000-0000-0000-000000000004', 'area', '40000000-0000-0000-0000-000000000003', 1600000, '');

insert into public.comments (id, project_id, author_id, text, created_at) values
  ('c0000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
   'Countertop samples came in -- I like the honed quartz over the polished one. Thoughts?', '2026-07-25T14:32:00Z'),
  ('c0000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Agreed, honed will hide watermarks better too. Let''s go with that.', '2026-07-26T09:10:00Z'),
  ('c0000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
   'Dave''s quote looks solid and he can start mid-August. Marcus''s is $1,600 more for basically the same scope.', '2026-08-02T18:05:00Z'),
  ('c0000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
   'Let''s just confirm the shingle color before we sign anything.', '2026-08-03T08:47:00Z');

insert into public.attachments (id, related_type, related_id, file_url, caption, uploaded_by_id, uploaded_at) values
  ('d0000000-0000-0000-0000-000000000001', 'project', '60000000-0000-0000-0000-000000000001', '3250-kitchen-before.jpg', 'Before -- original cabinets', '10000000-0000-0000-0000-000000000001', '2026-06-01T10:00:00Z'),
  ('d0000000-0000-0000-0000-000000000002', 'project', '60000000-0000-0000-0000-000000000001', '3250-kitchen-cabinets-installed.jpg', 'New cabinets installed', '10000000-0000-0000-0000-000000000002', '2026-07-15T16:20:00Z'),
  ('d0000000-0000-0000-0000-000000000003', 'quote', '90000000-0000-0000-0000-000000000001', 'konecny-roofing-quote-2026-08-01.pdf', null, '10000000-0000-0000-0000-000000000002', '2026-08-01T12:00:00Z');
