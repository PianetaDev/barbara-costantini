-- supabase/migrations/20261112000000_bc_page_content_bozza.sql
-- Colonna `bozza`: quello che l'admin sta scrivendo, visibile solo nell'anteprima del
-- pannello. Il sito pubblico legge sempre `content`. «Salva e pubblica» copia i valori
-- in `content` e riporta `bozza` a NULL.
-- La colonna è già presente in produzione (aggiunta a mano il 12/11/2026 insieme alla
-- PR #79): questo file la registra nel repo ed è idempotente.
ALTER TABLE bc_page_content
  ADD COLUMN IF NOT EXISTS bozza jsonb;
