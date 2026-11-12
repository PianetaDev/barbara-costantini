// tests/admin-pagine.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('validazione page_content', () => {
  it('accetta una pagina valida tra quelle consentite', () => {
    const result = pageContentSchema.safeParse({ page: 'home', content: { titolo: 'Test' } });
    expect(result.success).toBe(true);
  });

  it('rifiuta una pagina non nella whitelist', () => {
    const result = pageContentSchema.safeParse({ page: 'blog', content: {} });
    expect(result.success).toBe(false);
  });
});

import { pageContentSchema } from '../src/lib/validation/page-content';

// Test a livello di endpoint per PATCH /api/admin/pagine/[page]: stesso pattern di
// mock di tests/admin-utenti.test.ts / tests/admin-upload-image.test.ts — nessun
// bisogno di un Supabase reale. vi.hoisted perché vi.mock è issato in cima al file.
const { mockGetUser, mockUpsert, mockFrom, mockMaybeSingle, mockUpdateEq } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockMaybeSingle: vi.fn(),
  mockUpdateEq: vi.fn(),
  mockUpsert: vi.fn(),
  mockFrom: vi.fn(),
}));
vi.mock('../src/lib/admin-roles', () => ({
  checkIsAdmin: vi.fn(async () => true),
  checkIsSuperadmin: vi.fn(async () => true),
}));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

import { PATCH, DELETE } from '../src/pages/api/admin/pagine/[page]';

function buildRequest(page: string, body: unknown) {
  return new Request(`http://localhost/api/admin/pagine/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('PATCH /api/admin/pagine/[page]', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockUpsert.mockReset();
    mockFrom.mockReset();
    mockMaybeSingle.mockReset();
    mockUpdateEq.mockReset();
    // Riga esistente letta prima di scrivere (i campi nuovi si uniscono a quelli esistenti).
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    mockUpdateEq.mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({
      upsert: mockUpsert,
      select: () => ({ eq: () => ({ maybeSingle: mockMaybeSingle }) }),
      update: () => ({ eq: mockUpdateEq }),
    });
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = buildRequest('home', { content: { titolo: 'Test' } });

    const res = await PATCH({ params: { page: 'home' }, request, cookies: {} } as any);

    expect(res.status).toBe(401);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('con pagina valida + content valido, aggiorna la riga e ritorna 200', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockUpsert.mockResolvedValue({ error: null });
    const request = buildRequest('home', { content: { titolo: 'Nuovo titolo' } });

    const res = await PATCH({ params: { page: 'home' }, request, cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockFrom).toHaveBeenCalledWith('bc_page_content');
    expect(mockUpsert).toHaveBeenCalledWith({ page: 'home', bozza: { titolo: 'Nuovo titolo' } });
  });

  it('ritorna 400 se la pagina non è nella whitelist', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const request = buildRequest('blog', { content: {} });

    const res = await PATCH({ params: { page: 'blog' }, request, cookies: {} } as any);

    expect(res.status).toBe(400);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it('ritorna 400 se il body JSON è mancante o malformato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const request = new Request('http://localhost/api/admin/pagine/home', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: '',
    });

    const res = await PATCH({ params: { page: 'home' }, request, cookies: {} } as any);

    expect(res.status).toBe(400);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it('unisce i campi inviati a quelli già in bozza: un salvataggio parziale non cancella gli altri campi', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockUpsert.mockResolvedValue({ error: null });
    mockMaybeSingle.mockResolvedValue({
      data: { content: { hero_titolo: 'Pubblicato', hero_testo: 'Testo' }, bozza: { hero_titolo: 'In bozza', hero_testo: 'Testo' } },
      error: null,
    });
    const res = await PATCH({ params: { page: 'home' }, request: buildRequest('home', { content: { lavori_intro: 'Nuova intro' } }), cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalledWith({
      page: 'home',
      bozza: { hero_titolo: 'In bozza', hero_testo: 'Testo', lavori_intro: 'Nuova intro' },
    });
  });

  it('con pubblica:true scrive sul sito (content) unendo ai campi pubblicati e svuota la bozza', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockUpsert.mockResolvedValue({ error: null });
    mockMaybeSingle.mockResolvedValue({ data: { content: { hero_titolo: 'Vecchio', servizi_intro: 'Resta' }, bozza: { hero_titolo: 'Bozza' } }, error: null });
    const res = await PATCH({ params: { page: 'home' }, request: buildRequest('home', { content: { hero_titolo: 'Nuovo' }, pubblica: true }), cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalledWith({ page: 'home', content: { hero_titolo: 'Nuovo', servizi_intro: 'Resta' }, bozza: null });
  });

  it('ripulisce html_body (privacy/cookie policy) da script e attributi pericolosi prima di salvarlo', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockUpsert.mockResolvedValue({ error: null });
    const html = '<h2>Titolo</h2><script>alert(1)</script><a href="javascript:alert(1)" onclick="x()">link</a><a href="https://example.com">ok</a>';
    await PATCH({ params: { page: 'privacy-policy' }, request: buildRequest('privacy-policy', { content: { html_body: html }, pubblica: true }), cookies: {} } as any);

    const salvato = mockUpsert.mock.calls[0][0].content.html_body as string;
    expect(salvato).toContain('<h2>Titolo</h2>');
    expect(salvato).toContain('href="https://example.com"');
    expect(salvato).not.toContain('<script');
    expect(salvato).not.toContain('javascript:');
    expect(salvato).not.toContain('onclick');
  });

  it('rifiuta un contenuto oltre il limite di peso', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const res = await PATCH({ params: { page: 'home' }, request: buildRequest('home', { content: { hero_testo: 'x'.repeat(250_000) } }), cookies: {} } as any);
    expect(res.status).toBe(400);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it('pubblicazione parziale (modifica sul posto): pubblica il campo e conserva la bozza aperta nel pannello', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockUpsert.mockResolvedValue({ error: null });
    mockMaybeSingle.mockResolvedValue({ data: { content: { hero_titolo: 'Online', lavori_intro: 'Vecchia' }, bozza: { hero_titolo: 'In lavorazione', lavori_intro: 'Vecchia' } }, error: null });
    const res = await PATCH({ params: { page: 'home' }, request: buildRequest('home', { content: { lavori_intro: 'Nuova' }, pubblica: true, parziale: true }), cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalledWith({
      page: 'home',
      content: { hero_titolo: 'Online', lavori_intro: 'Nuova' },
      bozza: { hero_titolo: 'In lavorazione', lavori_intro: 'Nuova' },
    });
  });

  it('DELETE scarta la bozza senza toccare il contenuto pubblicato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const res = await DELETE({ params: { page: 'home' }, request: new Request('http://localhost/api/admin/pagine/home', { method: 'DELETE' }), cookies: {} } as any);
    expect(res.status).toBe(200);
    expect(mockUpdateEq).toHaveBeenCalledWith('page', 'home');
  });
});
