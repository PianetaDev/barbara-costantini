// tests/admin-login-form.test.ts
// Login con invio di modulo: il server risponde sempre con un redirect (303),
// con successo verso /admin/progetti, con errore verso /admin/login?error=...
// Supabase è mockato: nessuna chiamata reale.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSignIn } = vi.hoisted(() => ({ mockSignIn: vi.fn() }));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { signInWithPassword: mockSignIn },
  })),
}));

import { POST } from '../src/pages/api/admin/auth/login';

function formRequest(fields: Record<string, string>) {
  const body = new URLSearchParams(fields);
  return new Request('http://localhost/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}

// redirect() come in Astro: restituisce una Response con Location.
const redirect = (path: string, status: number) =>
  new Response(null, { status, headers: { Location: path } });

describe('POST /api/admin/auth/login (form)', () => {
  beforeEach(() => mockSignIn.mockReset());

  it('login riuscito: redirect 303 a /admin/progetti', async () => {
    mockSignIn.mockResolvedValue({ error: null });
    const res = await POST({ request: formRequest({ email: 'a@b.it', password: 'x' }), cookies: {}, redirect } as any);
    expect(res.status).toBe(303);
    expect(res.headers.get('Location')).toBe('/admin/progetti');
  });

  it('credenziali errate: redirect 303 a /admin/login?error=invalid', async () => {
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    const res = await POST({ request: formRequest({ email: 'a@b.it', password: 'x' }), cookies: {}, redirect } as any);
    expect(res.status).toBe(303);
    expect(res.headers.get('Location')).toBe('/admin/login?error=invalid');
  });

  it('campi mancanti: redirect a /admin/login?error=missing senza chiamare Supabase', async () => {
    const res = await POST({ request: formRequest({ email: '' }), cookies: {}, redirect } as any);
    expect(res.headers.get('Location')).toBe('/admin/login?error=missing');
    expect(mockSignIn).not.toHaveBeenCalled();
  });
});
