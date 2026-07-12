// tests/admin-team-archivia.test.ts
//
// Test a livello di endpoint per DELETE /api/admin/team/[id]: stesso pattern di
// mock di tests/admin-progetti-patch.test.ts — nessun bisogno di un Supabase reale.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockEq, mockDelete, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockEq: vi.fn(),
  mockDelete: vi.fn(),
  mockFrom: vi.fn(),
}));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

import { DELETE } from '../src/pages/api/admin/team/[id]';

describe('DELETE /api/admin/team/[id]', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockEq.mockReset();
    mockDelete.mockReset();
    mockFrom.mockReset();
    mockFrom.mockReturnValue({ delete: mockDelete });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('cancella definitivamente un membro del team', async () => {
    const res = await DELETE({ params: { id: 'membro-1' }, request: new Request('http://localhost'), cookies: {} } as any);
    expect(res.status).toBe(200);
    expect(mockFrom).toHaveBeenCalledWith('bc_team_members');
    expect(mockEq).toHaveBeenCalledWith('id', 'membro-1');
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const res = await DELETE({ params: { id: 'membro-1' }, request: new Request('http://localhost'), cookies: {} } as any);
    expect(res.status).toBe(401);
    expect(mockFrom).not.toHaveBeenCalled();
  });
});
