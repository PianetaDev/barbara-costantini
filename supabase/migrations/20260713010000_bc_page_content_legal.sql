-- supabase/migrations/20260713010000_bc_page_content_legal.sql
-- Estende bc_page_content per le pagine legali (privacy, cookie).
-- La constraint CHECK è inline nella colonna → DROP + ADD per modificarla.
-- ATTENZIONE: se la constraint ha già 'privacy-policy' e 'cookie-policy',
-- questa migration è già stata applicata manualmente — non rieseguire.

-- Step 1: drop la constraint esistente
-- alter table bc_page_content drop constraint bc_page_content_page_check;

-- Step 2: ricrea con i nuovi valori
-- alter table bc_page_content
--   add constraint bc_page_content_page_check
--   check (page in ('home', 'studio', 'servizi', 'contatti', 'privacy-policy', 'cookie-policy', 'footer'));

-- Seed iniziale (vuoto) — html_body vuoto = fallback al markup statico in Astro
-- insert into bc_page_content (page, content) values
--   ('privacy-policy', '{"html_body": ""}'::jsonb)
-- ON CONFLICT (page) DO NOTHING;

-- insert into bc_page_content (page, content) values
--   ('cookie-policy', '{"html_body": ""}'::jsonb)
-- ON CONFLICT (page) DO NOTHING;
