-- Aggiunge colonna blocks (jsonb) a bc_projects per il corpo pagina a blocchi.
-- Default array vuoto — compatibile con i 12 progetti esistenti che usano `sezioni`.
alter table bc_projects add column if not exists blocks jsonb not null default '[]'::jsonb;
