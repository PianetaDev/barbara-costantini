// tests/admin-auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Il middleware chiama createSupabaseServerClient(...).auth.getUser() per verificare
// la sessione. Mockiamo il modulo così i 3 casi sono deterministici e non dipendono
// dal comportamento (non documentato) del client reale quando non ci sono cookie —
// ogni test controlla esplicitamente cosa "risponde" Supabase.
const mockGetUser = vi.fn();
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

import { onRequest } from '../src/middleware';

describe('middleware admin', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
  });

  it('reindirizza a /admin/login se non autenticato su rotta /admin/*', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const context = {
      url: new URL('http://localhost/admin/progetti'),
      cookies: { get: () => undefined },
      request: new Request('http://localhost/admin/progetti'),
      redirect: vi.fn((path) => new Response(null, { status: 302, headers: { Location: path } })),
      locals: {},
    };
    const next = vi.fn();
    await onRequest(context as any, next);
    expect(context.redirect).toHaveBeenCalledWith('/admin/login');
    expect(next).not.toHaveBeenCalled();
  });

  it('lascia passare le rotte pubbliche senza verificare la sessione', async () => {
    const context = {
      url: new URL('http://localhost/lavori'),
      cookies: { get: () => undefined },
      request: new Request('http://localhost/lavori'),
      redirect: vi.fn(),
      locals: {},
    };
    const next = vi.fn(async () => new Response('ok'));
    await onRequest(context as any, next);
    expect(next).toHaveBeenCalled();
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('con una sessione valida imposta locals.user e chiama next() senza redirect', async () => {
    const fakeUser = { id: 'user-123', email: 'admin@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: fakeUser } });
    const context = {
      url: new URL('http://localhost/admin/progetti'),
      cookies: { get: () => undefined },
      request: new Request('http://localhost/admin/progetti'),
      redirect: vi.fn(),
      locals: {} as any,
    };
    const next = vi.fn(async () => new Response('ok'));
    await onRequest(context as any, next);
    expect(context.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(context.locals.user).toEqual(fakeUser);
  });
});
