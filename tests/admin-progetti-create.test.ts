// tests/admin-progetti-create.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockSelect, mockInsert, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
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

import { POST } from '../src/pages/api/admin/progetti/index';

function buildRequest(body: unknown) {
  return new Request('http://localhost/api/admin/progetti', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/progetti', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockSelect.mockReset();
    mockInsert.mockReset();
    mockFrom.mockReset();
    mockFrom.mockReturnValue({ insert: mockInsert });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 'nuovo-id' }, error: null }) });
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('crea un progetto con slug/titolo/tipo e defaulta sezioni/immagini a []', async () => {
    const request = buildRequest({ slug: 'nuovo', titolo: 'Nuovo progetto', tipo: 'horizontal' });
    const res = await POST({ request, cookies: {} } as any);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.id).toBe('nuovo-id');
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ sezioni: [], immagini: [] }));
  });

  it('senza slug lo ricava dal titolo, ripulito (minuscole, trattini, niente accenti)', async () => {
    const request = buildRequest({ titolo: 'Lavoro di Prova è 2', tipo: 'horizontal' });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ slug: 'lavoro-di-prova-e-2' }));
  });

  it('ripulisce uno slug scritto a mano con spazi e maiuscole', async () => {
    const request = buildRequest({ slug: 'Lavoro test2', titolo: 'Lavoro test2', tipo: 'horizontal' });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ slug: 'lavoro-test2' }));
  });

  it('rifiuta senza titolo né slug', async () => {
    const request = buildRequest({ tipo: 'horizontal' });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(400);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = buildRequest({ slug: 'x', titolo: 'x', tipo: 'horizontal' });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(401);
  });
});
