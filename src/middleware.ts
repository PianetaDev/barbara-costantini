// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';

// Rotte sotto /admin/* raggiungibili senza una sessione valida: la pagina di login
// stessa, e la pagina di impostazione password dopo un reset. Quest'ultima arriva
// con `?code=...` in query string (PKCE flow, non un fragment come si potrebbe
// pensare — il codice viaggia fino al server) ma al momento della richiesta non
// esiste ancora nessuna sessione: è il frontmatter della pagina stessa (non questo
// middleware) a scambiare il code per una sessione via `exchangeCodeForSession`,
// che scrive i cookie di sessione solo DOPO essere stata raggiunta. Se questa rotta
// fosse protetta qui, il redirect scatterebbe prima che lo scambio possa avvenire.
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/imposta-password'];

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith('/admin')) {
    return next();
  }
  // Le pagine admin contengono i contenuti in bozza: non devono mai finire nella cache
  // pubblica del CDN (in produzione una pagina admin era servita a chi non era loggato).
  const response = await onAdmin(context, next);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
});

async function onAdmin(context: Parameters<Parameters<typeof defineMiddleware>[0]>[0], next: () => Promise<Response>) {
  if (PUBLIC_ADMIN_PATHS.includes(context.url.pathname)) {
    return next();
  }
  const supabase = createSupabaseServerClient(context.cookies, context.request);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  // Diagnostica sessione (solo log, nessun token né dato personale).
  if (!user) {
    const hasCookie = (context.request.headers.get('Cookie') ?? '').includes('auth-token');
    console.warn('[admin-session] no user', { path: context.url.pathname, hasAuthCookie: hasCookie, error: error?.message ?? null });
    return context.redirect('/admin/login');
  }
  context.locals.user = user;
  return next();
}
