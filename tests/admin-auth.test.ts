// tests/admin-auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Il middleware chiama createSupabaseServerClient(...).auth.getUser() per verificare
// la sessione. Mockiamo il modulo così i 3 casi sono deterministici e non dipendono
// dal comportamento (non documentato) del client reale quando non ci sono cookie —
// ogni test controlla esplicitamente cosa "risponde" Supabase.
const mockGetUser = vi.fn();
const { mockIsAdmin } = vi.hoisted(() => ({ mockIsAdmin: vi.fn() }));
vi.mock('../src/lib/admin-roles', () => ({ checkIsAdmin: mockIsAdmin, checkIsSuperadmin: vi.fn(async () => true) }));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

import { onRequest, origineValida } from '../src/middleware';

describe('middleware admin', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockIsAdmin.mockReset();
    mockIsAdmin.mockResolvedValue(true);
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

  // Il progetto Supabase è condiviso con altri siti: un account valido altrove non deve
  // vedere l'admin di questo sito. Niente redirect al login (giro infinito): 403 con uscita.
  it('utente loggato ma non in bc_admin_users: 403, niente next()', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'cliente-altro-sito' } } });
    mockIsAdmin.mockResolvedValue(false);
    const context = {
      url: new URL('http://localhost/admin/progetti'),
      cookies: { get: () => undefined },
      request: new Request('http://localhost/admin/progetti'),
      redirect: vi.fn(),
      locals: {} as any,
    };
    const next = vi.fn(async () => new Response('ok'));
    const res = (await onRequest(context as any, next)) as Response;
    expect(res.status).toBe(403);
    expect(next).not.toHaveBeenCalled();
    expect(context.redirect).not.toHaveBeenCalled();
    expect(res.headers.get('Cache-Control')).toBe('private, no-store');
  });

  it('aggiunge gli header di sicurezza a ogni risposta', async () => {
    const context = {
      url: new URL('http://localhost/lavori'),
      cookies: { get: () => undefined },
      request: new Request('http://localhost/lavori'),
      redirect: vi.fn(),
      locals: {},
    };
    const res = (await onRequest(context as any, vi.fn(async () => new Response('ok', { headers: { 'content-type': 'text/html' } })))) as Response;
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(res.headers.get('Content-Security-Policy')).toContain("frame-ancestors 'self'");
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });
});

describe('middleware /api/admin', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockIsAdmin.mockReset();
    mockIsAdmin.mockResolvedValue(true);
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  function ctxApi(path: string, init: RequestInit & { headers?: Record<string, string> } = {}) {
    return {
      url: new URL(`https://barbaracostantini.it${path}`),
      cookies: { get: () => undefined },
      request: new Request(`https://barbaracostantini.it${path}`, init),
      redirect: vi.fn(),
      locals: {} as any,
    };
  }

  it('blocca (403) una richiesta di modifica che arriva da un altro sito (CSRF)', async () => {
    const next = vi.fn(async () => new Response('{}'));
    const res = (await onRequest(
      ctxApi('/api/admin/progetti/abc', { method: 'DELETE', headers: { Origin: 'https://sito-malevolo.example' } }) as any,
      next,
    )) as Response;
    expect(res.status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('lascia passare una modifica che arriva dal sito stesso', async () => {
    const next = vi.fn(async () => new Response('{}'));
    const res = (await onRequest(
      ctxApi('/api/admin/progetti/abc', { method: 'DELETE', headers: { Origin: 'https://barbaracostantini.it' } }) as any,
      next,
    )) as Response;
    expect(next).toHaveBeenCalled();
    expect(res.headers.get('Cache-Control')).toBe('private, no-store');
  });

  it('401 senza sessione, 403 se loggato ma non admin', async () => {
    const next = vi.fn(async () => new Response('{}'));
    mockGetUser.mockResolvedValue({ data: { user: null } });
    expect(((await onRequest(ctxApi('/api/admin/team') as any, next)) as Response).status).toBe(401);
    mockGetUser.mockResolvedValue({ data: { user: { id: 'cliente-altro-sito' } } });
    mockIsAdmin.mockResolvedValue(false);
    expect(((await onRequest(ctxApi('/api/admin/team') as any, next)) as Response).status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('il login resta raggiungibile senza sessione', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const next = vi.fn(async () => new Response('{}'));
    await onRequest(
      ctxApi('/api/admin/auth/login', { method: 'POST', headers: { Origin: 'https://barbaracostantini.it' } }) as any,
      next,
    );
    expect(next).toHaveBeenCalled();
  });

  it('origineValida: stessa origine sì, altra origine no, cross-site senza Origin no', () => {
    const url = new URL('https://barbaracostantini.it/api/admin/x');
    const req = (h: Record<string, string>) => new Request(url, { method: 'POST', headers: h });
    expect(origineValida(req({ Origin: 'https://barbaracostantini.it' }), url)).toBe(true);
    expect(origineValida(req({ Origin: 'https://altro.example' }), url)).toBe(false);
    expect(origineValida(req({ 'Sec-Fetch-Site': 'cross-site' }), url)).toBe(false);
    expect(origineValida(req({ 'Sec-Fetch-Site': 'same-origin' }), url)).toBe(true);
  });
});
