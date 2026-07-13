-- supabase/migrations/20260713000000_bc_page_content_seed.sql
insert into bc_page_content (page, content) values
(
  'home',
  '{
    "hero_titolo": "Barbara Costantini Restauro",
    "hero_testo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia."
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;

insert into bc_page_content (page, content) values
(
  'studio',
  '{
    "hero_titolo": "Lo studio",
    "hero_testo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
    "bio_ruolo": "Restauratrice",
    "bio_testo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula."
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;

insert into bc_page_content (page, content) values
(
  'contatti',
  '{
    "email": "bb.costantini@gmail.com",
    "instagram": "@barbara_costantini",
    "telefono": "+39 349 6718022",
    "indirizzo": "Largo dell'\''Olgiata 15 - 00123 Roma"
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;

insert into bc_page_content (page, content) values
(
  'servizi',
  '{
    "intro": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;
