// tests/lavori.test.ts
// Task 17: sostituisce la versione del Task 6 (che leggeva src/data/progetti.ts).
// Le pagine ora leggono da src/lib/supabase-public.ts: qui mockiamo quel modulo così
// il test non dipende da un Supabase reale, e verifica esplicitamente che i dati
// arrivino da lì (non più dall'array statico PROGETTI).
import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';

// Righe come le restituirebbe bc_projects via Supabase (vedi
// supabase/migrations/20260708100000_bc_cms_schema.sql + scripts/seed-bc-cms.mjs):
// committente/anno/intro a livello di riga (non annidati in `meta` come nel vecchio
// array statico), `intro` come stringa unica (i paragrafi originali sono uniti con
// "\n\n" dal seed), e senza il campo `immaginiContenuto` (mai esistito nello
// schema/seed — vedi il commento in src/pages/lavori/[slug].astro).
const RIGHE_MOCK = vi.hoisted(() => [
  {
    id: 'uuid-1',
    slug: 'progetto-uno',
    titolo: 'Progetto Uno',
    committente: 'Cliente Uno',
    anno: '2022–2023',
    tipo: 'horizontal',
    intro: 'Prima riga di intro.\n\nSeconda riga di intro.',
    sezioni: [{ titolo: 'Titolo sezione', sottotitolo: 'Sottotitolo sezione', testi: ['Testo sezione'] }],
    metodo: { testi: ['Testo metodo'], citazione: 'Citazione metodo' },
    immagini: [
      { src: '/images/bc-001.jpg', label: '01-01', aspetto: 'h' },
      { src: '/images/bc-002.jpg', label: '01-02', aspetto: 'h' },
    ],
    ordine: 0,
  },
  {
    id: 'uuid-2',
    slug: 'progetto-due',
    titolo: 'Progetto Due',
    committente: 'Cliente Due',
    anno: '2021',
    tipo: 'vertical',
    intro: 'Intro progetto due.',
    sezioni: [],
    metodo: null,
    immagini: [{ src: '/images/bc-003.jpg', label: '02-01', aspetto: 'v' }],
    ordine: 1,
  },
]);

vi.mock('../src/lib/supabase-public', () => ({
  getProgetti: async () => RIGHE_MOCK,
  getProgetto: async (slug: string) => {
    const riga = RIGHE_MOCK.find((r) => r.slug === slug);
    if (!riga) throw new Error(`progetto non trovato: ${slug}`);
    return riga;
  },
}));

import LavoriIndex from '../src/pages/lavori/index.astro';
import LavoriSlug from '../src/pages/lavori/[slug].astro';

describe('lavori (da Supabase)', () => {
  it('index legge i progetti da Supabase (getProgetti), non dall\'array statico', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(LavoriIndex);
    for (const r of RIGHE_MOCK) {
      expect(html).toContain(r.slug);
      expect(html).toContain(r.titolo);
      expect(html).toContain(r.committente);
    }
  });

  it('[slug] legge il singolo progetto da Supabase (getProgetto)', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(LavoriSlug, { params: { slug: 'progetto-uno' } });
    expect(html).toContain('Progetto Uno');
    expect(html).toContain('Cliente Uno');
    expect(html).not.toContain('Progetto non trovato');
  });

  it('uno slug inesistente non fa crashare la pagina SSR: redirect a /lavori invece di un errore non gestito', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const response = await container.renderToResponse(LavoriSlug, {
      params: { slug: 'slug-inesistente-xyz' },
    });
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('/lavori');
  });
});
