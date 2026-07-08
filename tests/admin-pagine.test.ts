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
const { mockGetUser, mockUpsert, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockUpsert: vi.fn(),
  mockFrom: vi.fn(),
}));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

import { PATCH } from '../src/pages/api/admin/pagine/[page]';

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
    mockFrom.mockReturnValue({ upsert: mockUpsert });
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
    expect(mockUpsert).toHaveBeenCalledWith({ page: 'home', content: { titolo: 'Nuovo titolo' } });
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
});
