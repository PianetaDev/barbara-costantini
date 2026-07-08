-- supabase/migrations/20260709000000_bc_admin_users_rls_fix.sql
--
-- Fix: le policy RLS su bc_admin_users introdotte in 20260708100000_bc_cms_schema.sql
-- interrogano bc_admin_users dentro la propria policy, causando "infinite recursion
-- detected in policy for relation bc_admin_users" (Postgres 42P17) per qualunque
-- accesso non-service_role a bc_admin_users, bc_projects, bc_team_members,
-- bc_page_content (tutte controllano l'appartenenza a bc_admin_users).
--
-- Fix standard: funzioni helper `security definer` che verificano il ruolo
-- bypassando la RLS dell'invocante, richiamate dalle policy al posto di subquery
-- dirette su bc_admin_users.

create or replace function is_bc_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from bc_admin_users where id = uid);
$$;

create or replace function is_bc_superadmin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from bc_admin_users where id = uid and role = 'superadmin');
$$;

-- bc_admin_users: riscrivi le due policy per usare le funzioni helper
drop policy if exists "admin_users_select_own_or_superadmin" on bc_admin_users;
create policy "admin_users_select_own_or_superadmin"
  on bc_admin_users for select
  using (
    auth.uid() = id
    or is_bc_superadmin(auth.uid())
  );

drop policy if exists "admin_users_manage_superadmin_only" on bc_admin_users;
create policy "admin_users_manage_superadmin_only"
  on bc_admin_users for all
  using (is_bc_superadmin(auth.uid()))
  with check (is_bc_superadmin(auth.uid()));

-- bc_projects
drop policy if exists "projects_admin_write" on bc_projects;
create policy "projects_admin_write"
  on bc_projects for all
  using (is_bc_admin(auth.uid()))
  with check (is_bc_admin(auth.uid()));

-- bc_team_members
drop policy if exists "team_admin_write" on bc_team_members;
create policy "team_admin_write"
  on bc_team_members for all
  using (is_bc_admin(auth.uid()))
  with check (is_bc_admin(auth.uid()));

-- bc_page_content
drop policy if exists "page_content_admin_write" on bc_page_content;
create policy "page_content_admin_write"
  on bc_page_content for all
  using (is_bc_admin(auth.uid()))
  with check (is_bc_admin(auth.uid()));
