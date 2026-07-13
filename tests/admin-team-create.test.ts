// tests/admin-team-create.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockSelect, mockInsert, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockFrom: vi.fn(),
}));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

import { POST } from '../src/pages/api/admin/team/index';

function buildRequest(body: unknown) {
  return new Request('http://localhost/api/admin/team', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/team', () => {
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

  it('crea un membro con solo nome', async () => {
    const request = buildRequest({ nome: 'Nuovo membro' });
    const res = await POST({ request, cookies: {} } as any);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.id).toBe('nuovo-id');
  });

  it('rifiuta senza nome', async () => {
    const request = buildRequest({});
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(400);
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = buildRequest({ nome: 'x' });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(401);
  });
});
