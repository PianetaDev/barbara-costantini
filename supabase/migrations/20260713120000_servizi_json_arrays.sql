-- Migra bc_page_content per 'servizi' da 45 flat keys a struttura JSON annidata.
-- Eseguire manualmente nel Supabase Dashboard > SQL Editor.
--
-- Schema nuovo:
--   hero_titolo  text
--   hero_testo   text
--   cta_testo    text
--   gruppi       jsonb array di { titolo, immagine, servizi: [{titolo, corpo}] }
--   partner      jsonb array di { titolo, immagine, testo }

UPDATE bc_page_content
SET content = jsonb_build_object(
  'hero_titolo', COALESCE(content->>'hero_titolo', 'I servizi'),
  'hero_testo',  COALESCE(content->>'hero_testo', ''),
  'cta_testo',   COALESCE(content->>'cta_testo', ''),
  'gruppi', jsonb_build_array(
    jsonb_build_object(
      'titolo',   COALESCE(content->>'g1_titolo', 'Beni Archivistici e Librari'),
      'immagine', '/images/bc-059.jpg',
      'servizi',  jsonb_build_array(
        jsonb_build_object('titolo', COALESCE(content->>'g1_s1_titolo', 'Servizio 1'), 'corpo', COALESCE(content->>'g1_s1_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g1_s2_titolo', 'Servizio 2'), 'corpo', COALESCE(content->>'g1_s2_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g1_s3_titolo', 'Servizio 3'), 'corpo', COALESCE(content->>'g1_s3_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g1_s4_titolo', 'Servizio 4'), 'corpo', COALESCE(content->>'g1_s4_corpo', ''))
      )
    ),
    jsonb_build_object(
      'titolo',   COALESCE(content->>'g2_titolo', 'Opere d''arte su carta'),
      'immagine', '/images/bc-060.jpg',
      'servizi',  jsonb_build_array(
        jsonb_build_object('titolo', COALESCE(content->>'g2_s1_titolo', 'Servizio 1'), 'corpo', COALESCE(content->>'g2_s1_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g2_s2_titolo', 'Servizio 2'), 'corpo', COALESCE(content->>'g2_s2_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g2_s3_titolo', 'Servizio 3'), 'corpo', COALESCE(content->>'g2_s3_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g2_s4_titolo', 'Servizio 4'), 'corpo', COALESCE(content->>'g2_s4_corpo', ''))
      )
    ),
    jsonb_build_object(
      'titolo',   COALESCE(content->>'g3_titolo', 'Materiali fotografici'),
      'immagine', '/images/bc-025.jpg',
      'servizi',  jsonb_build_array(
        jsonb_build_object('titolo', COALESCE(content->>'g3_s1_titolo', 'Servizio 1'), 'corpo', COALESCE(content->>'g3_s1_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g3_s2_titolo', 'Servizio 2'), 'corpo', COALESCE(content->>'g3_s2_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g3_s3_titolo', 'Servizio 3'), 'corpo', COALESCE(content->>'g3_s3_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g3_s4_titolo', 'Servizio 4'), 'corpo', COALESCE(content->>'g3_s4_corpo', ''))
      )
    ),
    jsonb_build_object(
      'titolo',   COALESCE(content->>'g4_titolo', 'Servizi trasversali'),
      'immagine', '/images/bc-027.jpg',
      'servizi',  jsonb_build_array(
        jsonb_build_object('titolo', COALESCE(content->>'g4_s1_titolo', 'Progettazione'), 'corpo', COALESCE(content->>'g4_s1_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g4_s2_titolo', 'Redazione di condition report'), 'corpo', COALESCE(content->>'g4_s2_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g4_s3_titolo', 'Spolveratura ordinaria e straordinaria'), 'corpo', COALESCE(content->>'g4_s3_corpo', '')),
        jsonb_build_object('titolo', COALESCE(content->>'g4_s4_titolo', 'Ricognizione conservativa di fondi e collezioni'), 'corpo', COALESCE(content->>'g4_s4_corpo', ''))
      )
    )
  ),
  'partner', jsonb_build_array(
    jsonb_build_object(
      'titolo',   COALESCE(content->>'p1_titolo', 'Cornici'),
      'immagine', '/images/bc-003.jpg',
      'testo',    COALESCE(content->>'p1_testo', '')
    ),
    jsonb_build_object(
      'titolo',   COALESCE(content->>'p2_titolo', 'Fotografia'),
      'immagine', '/images/bc-026.jpg',
      'testo',    COALESCE(content->>'p2_testo', '')
    ),
    jsonb_build_object(
      'titolo',   COALESCE(content->>'p3_titolo', 'Diagnostica'),
      'immagine', '/images/bc-038.jpg',
      'testo',    COALESCE(content->>'p3_testo', '')
    )
  )
)
WHERE page = 'servizi';
