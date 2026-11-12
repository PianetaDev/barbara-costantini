// tests/anteprima-e-slug.test.ts
// Anteprima del pannello: la bozza si vede SOLO con ?anteprima=1 E una sessione admin.
// Per chiunque altro ?anteprima=1 non ha effetto (vede il contenuto pubblicato).
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockIsAdmin, mockMaybeSingle, mockGetPageContent } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockIsAdmin: vi.fn(),
  mockMaybeSingle: vi.fn(),
  mockGetPageContent: vi.fn(),
}));
vi.mock('../src/lib/admin-roles', () => ({ checkIsAdmin: mockIsAdmin }));
vi.mock('../src/lib/supabase-public', () => ({ getPageContent: mockGetPageContent }));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mockMaybeSingle }) }) }),
  })),
}));

import { leggiContenuto, inAnteprima } from '../src/lib/page-content';
import { slugify, slugSchema, srcImmagineSchema } from '../src/lib/validation/progetto';
import { percorsoStorage } from '../src/lib/storage-cleanup';

const richiesta = (path: string) => ({ url: new URL(`http://localhost${path}`), cookies: {} as any, request: new Request(`http://localhost${path}`) });

describe('leggiContenuto (anteprima)', () => {
  beforeEach(() => {
    [mockGetUser, mockIsAdmin, mockMaybeSingle, mockGetPageContent].forEach((m) => m.mockReset());
    mockGetPageContent.mockResolvedValue({ hero_titolo: 'Pubblicato' });
    mockMaybeSingle.mockResolvedValue({ data: { content: { hero_titolo: 'Pubblicato' }, bozza: { hero_titolo: 'In bozza' } }, error: null });
  });

  it('senza ?anteprima=1 legge il contenuto pubblicato e non controlla nessuna sessione', async () => {
    expect(await leggiContenuto(richiesta('/lavori'), 'lavori')).toEqual({ hero_titolo: 'Pubblicato' });
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('con ?anteprima=1 e admin loggato mostra la bozza', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } });
    mockIsAdmin.mockResolvedValue(true);
    const r = richiesta('/lavori?anteprima=1');
    expect(await leggiContenuto(r, 'lavori')).toEqual({ hero_titolo: 'In bozza' });
    expect(await inAnteprima(r)).toBe(true);
  });

  it('con ?anteprima=1 ma senza sessione mostra il pubblicato (la bozza non è raggiungibile dal pubblico)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = richiesta('/lavori?anteprima=1');
    expect(await leggiContenuto(r, 'lavori')).toEqual({ hero_titolo: 'Pubblicato' });
    expect(await inAnteprima(r)).toBe(false);
  });

  it('con ?anteprima=1 e utente loggato non admin mostra il pubblicato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'cliente-altro-sito' } } });
    mockIsAdmin.mockResolvedValue(false);
    expect(await leggiContenuto(richiesta('/lavori?anteprima=1'), 'lavori')).toEqual({ hero_titolo: 'Pubblicato' });
  });

  it('se non c\'è bozza, in anteprima mostra il pubblicato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } });
    mockIsAdmin.mockResolvedValue(true);
    mockMaybeSingle.mockResolvedValue({ data: { content: { hero_titolo: 'Pubblicato' }, bozza: null }, error: null });
    expect(await leggiContenuto(richiesta('/lavori?anteprima=1'), 'lavori')).toEqual({ hero_titolo: 'Pubblicato' });
  });
});

describe('slug e immagini', () => {
  it('slugify ripulisce spazi, maiuscole e accenti', () => {
    expect(slugify('Lavoro test2')).toBe('lavoro-test2');
    expect(slugify('  Restauro dell\'Antico Archivio Règio  ')).toBe('restauro-dell-antico-archivio-regio');
  });

  it('slugSchema rifiuta spazi, maiuscole e caratteri da URL', () => {
    expect(slugSchema.safeParse('restauro-codice').success).toBe(true);
    for (const cattivo of ['Lavoro test', 'a/b', '../x', 'x?y', '']) {
      expect(slugSchema.safeParse(cattivo).success).toBe(false);
    }
  });

  it('le immagini accettano solo percorsi del sito o https', () => {
    expect(srcImmagineSchema.safeParse('/images/bc-001.jpg').success).toBe(true);
    expect(srcImmagineSchema.safeParse('https://x.supabase.co/storage/v1/object/public/b/f.jpg').success).toBe(true);
    for (const cattivo of ['javascript:alert(1)', 'data:text/html,x', 'http://insicuro.example/a.jpg']) {
      expect(srcImmagineSchema.safeParse(cattivo).success).toBe(false);
    }
  });

  it('percorsoStorage riconosce solo i bucket di questo sito e rifiuta i percorsi con ..', () => {
    const base = 'https://x.supabase.co/storage/v1/object/public';
    expect(percorsoStorage(`${base}/barbara-costantini-progetti/a.jpg`)).toEqual({ bucket: 'barbara-costantini-progetti', path: 'a.jpg' });
    expect(percorsoStorage(`${base}/apotheke-products/a.jpg`)).toBeNull();
    expect(percorsoStorage(`${base}/barbara-costantini-team/..%2F..%2Fsegreto`)).toBeNull();
    expect(percorsoStorage('/images/bc-001.jpg')).toBeNull();
  });
});
