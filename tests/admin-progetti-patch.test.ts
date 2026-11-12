// tests/admin-progetti-patch.test.ts
//
// Test a livello di endpoint per PATCH /api/admin/progetti/[id]: stesso pattern di
// mock di tests/admin-pagine.test.ts — nessun bisogno di un Supabase reale.
//
// Copertura mirata al fix del mismatch editing/rendering di `intro` (vedi
// src/lib/sanitize-intro.ts): `intro` arriva da RichTextEditor.vue/Tiptap come HTML,
// ma l'endpoint non può fidarsi ciecamente dell'input (bc_admin_users include ruoli
// "editor", non solo superadmin) — va sanificato prima di salvarlo su Supabase.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockSelect, mockEq, mockUpdate, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSelect: vi.fn(),
  mockEq: vi.fn(),
  mockUpdate: vi.fn(),
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

import { PATCH } from '../src/pages/api/admin/progetti/[id]';

function buildRequest(id: string, body: unknown) {
  return new Request(`http://localhost/api/admin/progetti/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('PATCH /api/admin/progetti/[id]', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockSelect.mockReset();
    mockEq.mockReset();
    mockUpdate.mockReset();
    mockFrom.mockReset();
    mockFrom.mockReturnValue({ update: mockUpdate });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSelect.mockResolvedValue({ data: [{ id: '11111111-1111-4111-8111-111111111111' }], error: null });
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('sanifica `intro` (rimuove tag non consentiti da Tiptap) prima di scriverlo su Supabase', async () => {
    const request = buildRequest('11111111-1111-4111-8111-111111111111', {
      intro: '<p>Testo</p><script>alert(1)</script><img src=x onerror="alert(1)">',
    });

    const res = await PATCH({ params: { id: '11111111-1111-4111-8111-111111111111' }, request, cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ intro: '<p>Testo</p>' });
  });

  it('mantiene i tag consentiti (bold/italic) prodotti dalla toolbar Tiptap', async () => {
    const request = buildRequest('11111111-1111-4111-8111-111111111111', { intro: '<p>Testo <strong>forte</strong>.</p>' });

    const res = await PATCH({ params: { id: '11111111-1111-4111-8111-111111111111' }, request, cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ intro: '<p>Testo <strong>forte</strong>.</p>' });
  });

  it('un PATCH che non tocca `intro` non lo aggiunge al payload di update', async () => {
    const request = buildRequest('11111111-1111-4111-8111-111111111111', { titolo: 'Nuovo titolo' });

    const res = await PATCH({ params: { id: '11111111-1111-4111-8111-111111111111' }, request, cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ titolo: 'Nuovo titolo' });
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = buildRequest('11111111-1111-4111-8111-111111111111', { intro: '<p>Testo</p>' });

    const res = await PATCH({ params: { id: '11111111-1111-4111-8111-111111111111' }, request, cookies: {} } as any);

    expect(res.status).toBe(401);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('PATCH /api/admin/progetti/[id] con in_evidenza:true aggiorna il campo', async () => {
    const request = buildRequest('11111111-1111-4111-8111-111111111111', { in_evidenza: true });

    const res = await PATCH({ params: { id: '11111111-1111-4111-8111-111111111111' }, request, cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ in_evidenza: true });
  });

  it('PATCH /api/admin/progetti/[id] con correlati accetta array di slug', async () => {
    const request = buildRequest('11111111-1111-4111-8111-111111111111', { correlati: ['slug-a', 'slug-b'] });

    const res = await PATCH({ params: { id: '11111111-1111-4111-8111-111111111111' }, request, cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ correlati: ['slug-a', 'slug-b'] });
  });

  it('ripulisce i blocchi «Testo»: tiene grassetto, corsivo e a capo, toglie il resto', async () => {
    const request = buildRequest('11111111-1111-4111-8111-111111111111', {
      blocks: [
        { type: 'text', content: '<div>Riga <b>forte</b><br></div><script>alert(1)</script><span style="color:red" onclick="x()">x</span>' },
        { type: 'h2', content: 'Titolo <b>così com\'è</b>' },
      ],
    });
    const res = await PATCH({ params: { id: '11111111-1111-4111-8111-111111111111' }, request, cookies: {} } as any);
    expect(res.status).toBe(200);
    const blocks = mockUpdate.mock.calls[0][0].blocks;
    expect(blocks[0].content).toBe('<div>Riga <b>forte</b><br /></div>x');
    expect(blocks[1].content).toBe('Titolo <b>così com\'è</b>');
  });
});
