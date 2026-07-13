-- supabase/migrations/20260713040000_bc_correlati.sql
-- Aggiunge correlati (array di slug) a bc_projects.
-- Massimo 3 correlati validato lato applicazione.

ALTER TABLE bc_projects
  ADD COLUMN IF NOT EXISTS correlati jsonb NOT NULL DEFAULT '[]';
