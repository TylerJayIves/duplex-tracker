-- Money is stored as integer cents and can never be negative. The app's
-- input parser already rejects negatives; these constraints enforce the
-- same rule at the database, whatever the source of the write.

alter table public.areas
  add constraint areas_target_rent_cents_non_negative
  check (target_rent_cents >= 0);

alter table public.cost_items
  add constraint cost_items_estimated_cost_cents_non_negative
  check (estimated_cost_cents >= 0);

alter table public.cost_items
  add constraint cost_items_actual_cost_cents_non_negative
  check (actual_cost_cents >= 0);

alter table public.quotes
  add constraint quotes_amount_cents_non_negative
  check (amount_cents >= 0);

alter table public.budgets
  add constraint budgets_limit_cents_non_negative
  check (limit_cents >= 0);