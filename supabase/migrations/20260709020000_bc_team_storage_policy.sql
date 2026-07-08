-- supabase/migrations/20260709020000_bc_team_storage_policy.sql
--
-- Task 14: il bucket Storage `barbara-costantini-team` (creato via API JS
-- `storage.createBucket`, non `supabase storage buckets create` — quella
-- sottocomando non esiste nella CLI installata, v2.90.0, che sotto `storage` offre
-- solo cp/ls/mv/rm per oggetti, non gestione bucket) è `public`, ma il flag `public`
-- riguarda solo la LETTURA via URL pubblico: bypassa la RLS in lettura, non in
-- scrittura. `storage.objects` ha RLS abilitata di default sul progetto condiviso
-- "pianeta-xp" e senza una policy esplicita l'INSERT da
-- src/pages/api/admin/upload-image.ts (che usa il client legato ai cookie, con
-- anon key — NON service_role) fallisce con "new row violates row-level security
-- policy" anche per un utente autenticato in bc_admin_users (verificato dal vivo).
--
-- Riusa is_bc_admin() (funzione security definer già esistente, vedi
-- 20260709010000_bc_admin_functions_no_uid_param.sql) per restare coerente con lo
-- stesso controllo di appartenenza usato dalle policy su bc_projects/bc_team_members.
create policy "bc_team_storage_admin_write"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'barbara-costantini-team'
    and is_bc_admin()
  );
