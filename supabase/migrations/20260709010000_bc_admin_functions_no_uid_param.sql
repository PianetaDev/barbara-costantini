-- supabase/migrations/20260709010000_bc_admin_functions_no_uid_param.sql
--
-- Fix (code review): is_bc_admin(uid uuid) / is_bc_superadmin(uid uuid), introdotte in
-- 20260709000000_bc_admin_users_rls_fix.sql, sono automaticamente esposte da PostgREST
-- come endpoint RPC (POST /rest/v1/rpc/is_bc_superadmin) perché vivono nello schema
-- public. Accettando un parametro uid arbitrario, chiunque (anche anon) puo' chiamarle
-- con un uuid a piacere e scoprire se quel uuid e' admin/superadmin: non e' escalation
-- di privilegi (sono read-only), ma e' un disclosure reale che non deve esistere.
--
-- Fix: rimuovi il parametro uid, le funzioni leggono auth.uid() internamente. La
-- domanda diventa sempre "sono io admin?", mai "e' l'utente X admin?" — elimina il
-- disclosure senza toccare GRANT/REVOKE.
--
-- Nota d'ordine: le policy che dipendono dalle vecchie funzioni vanno droppate PRIMA
-- di poter droppare le funzioni stesse (altrimenti Postgres rifiuta con "cannot drop
-- function ... because other objects depend on it").

-- 1. drop delle policy dipendenti dalle vecchie funzioni is_bc_*(uuid)
drop policy if exists "admin_users_select_own_or_superadmin" on bc_admin_users;
drop policy if exists "admin_users_manage_superadmin_only" on bc_admin_users;
drop policy if exists "projects_admin_write" on bc_projects;
drop policy if exists "team_admin_write" on bc_team_members;
drop policy if exists "page_content_admin_write" on bc_page_content;

-- 2. drop delle vecchie funzioni parametriche (ora libere da dipendenze)
drop function if exists is_bc_admin(uuid);
drop function if exists is_bc_superadmin(uuid);

-- 3. nuove funzioni, senza parametro: leggono auth.uid() internamente
create or replace function is_bc_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from bc_admin_users where id = auth.uid());
$$;

create or replace function is_bc_superadmin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from bc_admin_users where id = auth.uid() and role = 'superadmin');
$$;

-- 4. ricrea le policy usando le nuove funzioni senza argomento
create policy "admin_users_select_own_or_superadmin"
  on bc_admin_users for select
  using (
    auth.uid() = id
    or is_bc_superadmin()
  );

create policy "admin_users_manage_superadmin_only"
  on bc_admin_users for all
  using (is_bc_superadmin())
  with check (is_bc_superadmin());

create policy "projects_admin_write"
  on bc_projects for all
  using (is_bc_admin())
  with check (is_bc_admin());

create policy "team_admin_write"
  on bc_team_members for all
  using (is_bc_admin())
  with check (is_bc_admin());

create policy "page_content_admin_write"
  on bc_page_content for all
  using (is_bc_admin())
  with check (is_bc_admin());
