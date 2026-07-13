// tests/lavori.test.ts
// Task 17: sostituisce la versione del Task 6 (che leggeva src/data/progetti.ts).
// Le pagine ora leggono da src/lib/supabase-public.ts: qui mockiamo quel modulo così
// il test non dipende da un Supabase reale, e verifica esplicitamente che i dati
// arrivino da lì (non più dall'array statico PROGETTI).
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';

// Righe come le restituirebbe bc_projects via Supabase (vedi
// supabase/migrations/20260708100000_bc_cms_schema.sql + scripts/seed-bc-cms.mjs):
// committente/anno/intro a livello di riga (non annidati in `meta` come nel vecchio
// array statico), e senza il campo `immaginiContenuto` (mai esistito nello
// schema/seed — vedi il commento in src/pages/lavori/[slug].astro).
//
// `intro` è HTML reale (prodotto da RichTextEditor.vue/Tiptap, vedi
// src/lib/sanitize-intro.ts), non più testo semplice unito con "\n\n": la pagina
// pubblica ora fa `set:html` diretto sul contenuto sanificato invece di splittare
// su "\n\n" (Task: fix mismatch editing/rendering di `intro`).
const RIGHE_MOCK = vi.hoisted(() => [
  {
    id: 'uuid-1',
    slug: 'progetto-uno',
    titolo: 'Progetto Uno',
    committente: 'Cliente Uno',
    anno: '2022–2023',
    tipo: 'horizontal',
    intro: '<p>Prima riga di <strong>intro</strong>.</p><p>Seconda riga di intro.</p>',
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

// Errore Supabase "0 righe" (.single() senza match) — stesso oggetto che
// restituirebbe davvero @supabase/postgrest-js: { message, code: 'PGRST116', ... }.
// Un errore Supabase generico (rete/downtime) invece NON ha questo code, e va
// distinto (vedi test più sotto e src/pages/lavori/[slug].astro).
const erroreRigaNonTrovata = vi.hoisted(() => () =>
  Object.assign(new Error('JSON object requested, multiple (or no) rows returned'), {
    code: 'PGRST116',
  }));

// vi.fn() (non semplici funzioni async) così i singoli test possono sovrascrivere
// il comportamento di default con mockRejectedValueOnce/mockImplementationOnce per
// simulare un errore Supabase — stesso pattern di tests/admin-pagine.test.ts.
const { mockGetProgetti, mockGetProgetto } = vi.hoisted(() => ({
  mockGetProgetti: vi.fn(),
  mockGetProgetto: vi.fn(),
}));

vi.mock('../src/lib/supabase-public', () => ({
  ERRORE_RIGA_NON_TROVATA: 'PGRST116',
  getProgetti: mockGetProgetti,
  getProgetto: mockGetProgetto,
}));

// Query builder finto per '@supabase/supabase-js', usato SOLO dal describe block più
// sotto che testa src/lib/supabase-public.ts vero (via vi.importActual, che ignora il
// mock di '../src/lib/supabase-public' appena sopra ed esegue il codice reale del
// modulo). eq() ritorna sempre il builder stesso per tollerare qualunque numero di
// filtri incatenati (es. .eq('slug', slug).eq('archiviato', false)); single()/order()
// sono i due punti terminali usati da getProgetto/getProgetti.
const { mockSingle, mockOrder, mockFromReale } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockOrder = vi.fn();
  const builder: any = {};
  builder.eq = vi.fn(() => builder);
  builder.single = mockSingle;
  builder.order = mockOrder;
  const mockSelect = vi.fn(() => builder);
  const mockFromReale = vi.fn(() => ({ select: mockSelect }));
  return { mockSingle, mockOrder, mockFromReale };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: mockFromReale })),
}));

import LavoriIndex from '../src/pages/lavori/index.astro';
import LavoriSlug from '../src/pages/lavori/[slug].astro';
import Pagina404 from '../src/pages/404.astro';

beforeEach(() => {
  mockGetProgetti.mockReset();
  mockGetProgetto.mockReset();
  mockGetProgetti.mockImplementation(async () => RIGHE_MOCK);
  mockGetProgetto.mockImplementation(async (slug: string) => {
    const riga = RIGHE_MOCK.find((r) => r.slug === slug);
    if (!riga) throw erroreRigaNonTrovata();
    return riga;
  });
});

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

  it('index non crasha se Supabase fallisce (blip di rete): si renderizza con lista vuota invece di un 500', async () => {
    mockGetProgetti.mockRejectedValueOnce(new Error('fetch failed'));
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(LavoriIndex);
    expect(html).toContain('I lavori');
    for (const r of RIGHE_MOCK) {
      expect(html).not.toContain(r.slug);
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

  it('[slug] renderizza `intro` come HTML reale (bold), non come tag escapati', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(LavoriSlug, { params: { slug: 'progetto-uno' } });
    expect(html).toContain('<strong>intro</strong>');
    expect(html).not.toContain('&lt;strong&gt;');
  });

  it('[slug] sanifica `intro` prima del set:html: uno script iniettato non arriva mai al markup', async () => {
    mockGetProgetto.mockImplementationOnce(async () => ({
      ...RIGHE_MOCK[0],
      intro: '<p>Testo</p><script>alert(1)</script><img src=x onerror="alert(1)">',
    }));
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(LavoriSlug, { params: { slug: 'progetto-uno' } });
    // La pagina contiene legittimamente altri <script> (widget Segnale, hydration
    // Astro): l'asserzione mirata è che il payload iniettato specifico non sopravviva,
    // non l'assenza di qualunque tag <script> nella pagina.
    expect(html).not.toContain('alert(1)');
    expect(html).not.toContain('onerror');
  });

  it('uno slug inesistente (PGRST116) risponde con un vero 404, non un redirect/soft-404', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    // Registra /404 nel container così Astro.rewrite('/404') dentro [slug].astro
    // trova una route da risolvere (vedi commento su insertPageRoute nei sorgenti
    // di astro/container).
    container.insertPageRoute('/404', Pagina404);
    const response = await container.renderToResponse(LavoriSlug, {
      params: { slug: 'slug-inesistente-xyz' },
    });
    expect(response.status).toBe(404);
    const html = await response.text();
    expect(html).toContain('Progetto non trovato');
  });

  it('un errore Supabase generico (non "riga non trovata") su [slug] NON viene trattato come 404', async () => {
    mockGetProgetto.mockRejectedValueOnce(new Error('fetch failed'));
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    container.insertPageRoute('/404', Pagina404);
    await expect(
      container.renderToResponse(LavoriSlug, { params: { slug: 'progetto-uno' } }),
    ).rejects.toThrow('fetch failed');
  });
});

describe('supabase-public.ts (codice reale, non mockato) mappa immagini_contenuto', () => {
  it('getProgetto espone la riga Supabase come immaginiContenuto (non immagini_contenuto)', async () => {
    const rigaSupabase = {
      id: 'uuid-1',
      slug: 'progetto-uno',
      titolo: 'Progetto Uno',
      committente: 'Cliente Uno',
      anno: '2022–2023',
      tipo: 'horizontal',
      intro: 'Intro.',
      sezioni: [],
      metodo: null,
      immagini: [],
      ordine: 0,
      immagini_contenuto: ['x.jpg'],
      archiviato: false,
    };
    mockSingle.mockResolvedValueOnce({ data: rigaSupabase, error: null });

    // vi.importActual ignora il vi.mock('../src/lib/supabase-public', ...) di sopra
    // (che serve solo ai test "lavori (da Supabase)") ed esegue il modulo vero, che a
    // sua volta usa il '@supabase/supabase-js' mockato qui sopra.
    const { getProgetto: getProgettoReale } = await vi.importActual<
      typeof import('../src/lib/supabase-public')
    >('../src/lib/supabase-public');

    const progetto = await getProgettoReale('progetto-uno');

    expect(progetto.immaginiContenuto).toEqual(['x.jpg']);
    expect((progetto as any).immagini_contenuto).toBeUndefined();
  });
});
