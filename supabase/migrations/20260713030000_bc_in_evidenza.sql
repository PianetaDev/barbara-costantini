-- supabase/migrations/20260713030000_bc_in_evidenza.sql
-- Aggiunge in_evidenza a bc_projects: i progetti con questo flag attivo
-- vengono mostrati nella home page.

ALTER TABLE bc_projects
  ADD COLUMN IF NOT EXISTS in_evidenza boolean NOT NULL DEFAULT false;

-- Marca i primi 3 progetti (per ordine) come in evidenza di default
-- per mantenere il comportamento precedente (PROGETTI.slice(0,3)).
UPDATE bc_projects
  SET in_evidenza = true
  WHERE ordine IN (
    SELECT ordine FROM bc_projects ORDER BY ordine LIMIT 3
  );
