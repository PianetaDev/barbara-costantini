// tests/admin-update-password.test.ts
//
// Copre l'altra metà del bug PKCE risolto in "fix: risolve reset-password rotto":
// update-password.ts deve leggere la sessione dai cookie via createSupabaseServerClient
// (mai istanziare un client browser separato). Il sintomo in produzione era Supabase
// che rispondeva "Auth session missing!" perché la sessione non era mai stata
// stabilita lato server — il terzo test qui sotto riproduce esattamente quel caso.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUpdateUser = vi.fn();
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { updateUser: mockUpdateUser },
  })),
}));

import { POST } from '../src/pages/api/admin/auth/update-password';

describe('POST /api/admin/auth/update-password', () => {
  beforeEach(() => {
    mockUpdateUser.mockReset();
  });

  it('aggiorna la password quando la sessione (stabilita via exchangeCodeForSession) è valida', async () => {
    mockUpdateUser.mockResolvedValue({ data: {}, error: null });
    const request = new Request('http://localhost/api/admin/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ password: 'Nuova-Password-123!' }),
    });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(200);
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'Nuova-Password-123!' });
  });

  it('ritorna 400 (non 500) se il body non è JSON valido', async () => {
    const request = new Request('http://localhost/api/admin/auth/update-password', {
      method: 'POST',
      body: 'questo non è json',
    });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(400);
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('ritorna 400 se manca il campo password', async () => {
    const request = new Request('http://localhost/api/admin/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(400);
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("propaga come 400 l'errore Supabase quando la sessione manca/è scaduta (il sintomo del bug in produzione)", async () => {
    mockUpdateUser.mockResolvedValue({ data: {}, error: { message: 'Auth session missing!' } });
    const request = new Request('http://localhost/api/admin/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ password: 'Nuova-Password-123!' }),
    });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Auth session missing!');
  });
});
