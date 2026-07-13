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
    mockSelect.mockResolvedValue({ data: [{ id: 'progetto-1' }], error: null });
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('sanifica `intro` (rimuove tag non consentiti da Tiptap) prima di scriverlo su Supabase', async () => {
    const request = buildRequest('progetto-1', {
      intro: '<p>Testo</p><script>alert(1)</script><img src=x onerror="alert(1)">',
    });

    const res = await PATCH({ params: { id: 'progetto-1' }, request, cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ intro: '<p>Testo</p>' });
  });

  it('mantiene i tag consentiti (bold/italic) prodotti dalla toolbar Tiptap', async () => {
    const request = buildRequest('progetto-1', { intro: '<p>Testo <strong>forte</strong>.</p>' });

    const res = await PATCH({ params: { id: 'progetto-1' }, request, cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ intro: '<p>Testo <strong>forte</strong>.</p>' });
  });

  it('un PATCH che non tocca `intro` non lo aggiunge al payload di update', async () => {
    const request = buildRequest('progetto-1', { titolo: 'Nuovo titolo' });

    const res = await PATCH({ params: { id: 'progetto-1' }, request, cookies: {} } as any);

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ titolo: 'Nuovo titolo' });
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = buildRequest('progetto-1', { intro: '<p>Testo</p>' });

    const res = await PATCH({ params: { id: 'progetto-1' }, request, cookies: {} } as any);

    expect(res.status).toBe(401);
    expect(mockFrom).not.toHaveBeenCalled();
  });
});
