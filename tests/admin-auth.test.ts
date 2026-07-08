// tests/admin-auth.test.ts
import { describe, it, expect, vi } from 'vitest';
import { onRequest } from '../src/middleware';

describe('middleware admin', () => {
  it('reindirizza a /admin/login se non autenticato su rotta /admin/*', async () => {
    const context = {
      url: new URL('http://localhost/admin/progetti'),
      cookies: { get: () => undefined },
      request: new Request('http://localhost/admin/progetti'),
      redirect: vi.fn((path) => new Response(null, { status: 302, headers: { Location: path } })),
    };
    const next = vi.fn();
    const result = await onRequest(context as any, next);
    expect(context.redirect).toHaveBeenCalledWith('/admin/login');
    expect(next).not.toHaveBeenCalled();
  });

  it('lascia passare le rotte pubbliche', async () => {
    const context = {
      url: new URL('http://localhost/lavori'),
      cookies: { get: () => undefined },
      request: new Request('http://localhost/lavori'),
      redirect: vi.fn(),
    };
    const next = vi.fn(() => new Response('ok'));
    await onRequest(context as any, next);
    expect(next).toHaveBeenCalled();
  });
});
