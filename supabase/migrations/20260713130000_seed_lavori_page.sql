-- Seed bc_page_content per la pagina 'lavori' (hero CMS-driven, PIA-87/93).
-- Eseguire nel Supabase Dashboard > SQL Editor.

INSERT INTO bc_page_content (page, content)
VALUES (
  'lavori',
  '{"hero_titolo": "I lavori", "hero_testo": ""}'
)
ON CONFLICT (page) DO NOTHING;
