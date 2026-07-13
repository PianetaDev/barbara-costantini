-- supabase/migrations/20260711000000_bc_archiviato_immagini_contenuto.sql
--
-- Aggiunge l'archiviazione (soft-delete reversibile) a bc_projects e
-- bc_team_members, e il campo immagini_contenuto (2 immagini per le sezioni
-- "immagine grande" e "due immagini affiancate" di /lavori/[slug].astro, oggi
-- referenziate dal template ma mai esistite come colonna reale — vedi nota in
-- src/lib/supabase-public.ts).

alter table bc_projects add column archiviato boolean not null default false;
alter table bc_projects add column immagini_contenuto jsonb not null default '[]';
alter table bc_team_members add column archiviato boolean not null default false;

-- Policy storage per il bucket barbara-costantini-progetti (stesso pattern di
-- 20260709020000_bc_team_storage_policy.sql per barbara-costantini-team): senza
-- questa policy, l'INSERT da src/pages/api/admin/upload-image.ts fallisce con
-- "new row violates row-level security policy" anche per un admin autenticato,
-- perché storage.objects ha RLS abilitata di default sul progetto condiviso.
-- NOTA: il bucket stesso va creato a parte (vedi prerequisito manuale nel piano),
-- questa policy da sola non serve a nulla se il bucket non esiste ancora.
create policy "bc_progetti_storage_admin_write"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'barbara-costantini-progetti'
    and is_bc_admin()
  );
