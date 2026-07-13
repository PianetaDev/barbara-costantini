-- supabase/migrations/20260713010000_bc_page_content_legal.sql
-- Estende bc_page_content per le pagine legali (privacy, cookie) e footer.
-- Idempotente: DROP IF EXISTS + ON CONFLICT DO NOTHING.

-- Ricrea la constraint includendo le nuove pagine
ALTER TABLE bc_page_content
  DROP CONSTRAINT IF EXISTS bc_page_content_page_check;

ALTER TABLE bc_page_content
  ADD CONSTRAINT bc_page_content_page_check
  CHECK (page IN ('home', 'studio', 'servizi', 'contatti', 'privacy-policy', 'cookie-policy', 'footer'));

-- Seed: html_body vuoto → le pagine usano fallback markup statico finché non si salva dall'admin
INSERT INTO bc_page_content (page, content) VALUES
  ('privacy-policy', '{"html_body": ""}'::jsonb)
ON CONFLICT (page) DO NOTHING;

INSERT INTO bc_page_content (page, content) VALUES
  ('cookie-policy', '{"html_body": ""}'::jsonb)
ON CONFLICT (page) DO NOTHING;

INSERT INTO bc_page_content (page, content) VALUES
  ('footer', '{"ragione_sociale": "", "piva": "", "cf": "", "anno_copyright": ""}'::jsonb)
ON CONFLICT (page) DO NOTHING;
