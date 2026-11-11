-- supabase/migrations/20261111000000_bc_page_content_add_lavori.sql
-- La migration 20260713010000_bc_page_content_legal.sql ha ricreato il check
-- di bc_page_content includendo 'privacy-policy', 'cookie-policy' e 'footer'
-- ma ha dimenticato di aggiungere 'lavori'. La successiva seed
-- 20260713130000_seed_lavori_page.sql tentava l'INSERT ma falliva per
-- constraint violation → nessuna riga 'lavori' in DB → il form admin
-- /admin/pagine/lavori è vuoto e non salva → heroTesto sulla home/lavori è
-- sempre vuoto.

ALTER TABLE bc_page_content
  DROP CONSTRAINT IF EXISTS bc_page_content_page_check;

ALTER TABLE bc_page_content
  ADD CONSTRAINT bc_page_content_page_check
  CHECK (page IN ('home', 'studio', 'servizi', 'contatti', 'lavori', 'privacy-policy', 'cookie-policy', 'footer'));

-- Inserisce la riga 'lavori' se ancora assente (seed originale fallito).
INSERT INTO bc_page_content (page, content)
VALUES ('lavori', '{"hero_titolo": "I lavori", "hero_testo": ""}'::jsonb)
ON CONFLICT (page) DO NOTHING;
