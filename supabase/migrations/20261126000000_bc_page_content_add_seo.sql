-- supabase/migrations/20261126000000_bc_page_content_add_seo.sql
-- Pannello «SEO e ricerca» (/admin/pagine/seo): i testi per i motori di ricerca stanno
-- nella riga `seo` di bc_page_content. Il vincolo sui nomi di pagina ammessi va allargato,
-- altrimenti il primo salvataggio fallisce. Idempotente: si può rieseguire.

ALTER TABLE bc_page_content
  DROP CONSTRAINT IF EXISTS bc_page_content_page_check;

ALTER TABLE bc_page_content
  ADD CONSTRAINT bc_page_content_page_check
  CHECK (page IN ('home', 'studio', 'servizi', 'contatti', 'lavori', 'privacy-policy', 'cookie-policy', 'footer', 'seo'));

-- Riga vuota: i campi non compilati usano i predefiniti di src/lib/seo.ts.
INSERT INTO bc_page_content (page, content)
VALUES ('seo', '{}'::jsonb)
ON CONFLICT (page) DO NOTHING;
