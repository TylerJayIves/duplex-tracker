-- Optional decorative color tag per project, purely for visual scanning --
-- distinct from the app's semantic accent colors (moss/amber/brick already
-- mean done/warning/danger), so this palette avoids those hues entirely.
create type project_color as enum ('indigo', 'plum', 'rose', 'slate', 'mustard', 'denim');

alter table public.projects
  add column color project_color;
