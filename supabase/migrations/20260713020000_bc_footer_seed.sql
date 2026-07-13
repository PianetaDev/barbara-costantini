-- supabase/migrations/20260713020000_bc_footer_seed.sql
-- Seed footer con i valori correnti hardcoded in Footer.astro.
-- Idempotente: ON CONFLICT (page) DO NOTHING — non sovrascrive modifiche dal CMS.
-- NOTA: la migration precedente (20260713010000) ha già aggiunto la row footer
-- con campi vuoti. Questa aggiorna solo se i campi sono ancora vuoti,
-- ma poiché ON CONFLICT DO NOTHING non aggiorna, usa UPDATE WHERE EXISTS invece.

-- Aggiorna la riga footer con i valori reali solo se i campi sono ancora vuoti
UPDATE bc_page_content
SET content = '{
  "ragione_sociale": "Barbara Costantini Restauro Srl",
  "piva": "14529501000",
  "cf": "CSTBBR83M45H501C",
  "anno_copyright": "2026"
}'::jsonb
WHERE page = 'footer'
  AND (content->>'ragione_sociale' = '' OR content->>'ragione_sociale' IS NULL);

-- Fallback insert se la riga non esiste ancora
INSERT INTO bc_page_content (page, content)
VALUES ('footer', '{
  "ragione_sociale": "Barbara Costantini Restauro Srl",
  "piva": "14529501000",
  "cf": "CSTBBR83M45H501C",
  "anno_copyright": "2026"
}'::jsonb)
ON CONFLICT (page) DO NOTHING;
