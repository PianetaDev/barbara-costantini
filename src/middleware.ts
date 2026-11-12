// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';
import { checkIsAdmin } from './lib/admin-roles';

// Rotte sotto /admin/* raggiungibili senza una sessione valida: la pagina di login
// stessa, e la pagina di impostazione password dopo un reset. Quest'ultima arriva
// con `?code=...` in query string (PKCE flow) ma al momento della richiesta non
// esiste ancora nessuna sessione: è il frontmatter della pagina stessa a scambiare il
// code per una sessione. Se questa rotta fosse protetta qui, il redirect scatterebbe
// prima che lo scambio possa avvenire.
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/imposta-password'];

// Endpoint che devono funzionare senza sessione (login, richiesta reset password).
// Il logout deve funzionare anche a sessione scaduta (altrimenti «Esci» mostra un errore).
const PUBLIC_API_PATHS = ['/api/admin/auth/login', '/api/admin/auth/reset-password', '/api/admin/auth/logout'];

const METODI_SICURI = ['GET', 'HEAD', 'OPTIONS'];

type Ctx = Parameters<Parameters<typeof defineMiddleware>[0]>[0];

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

/** Header di sicurezza validi per ogni risposta. */
function intestazioniSicurezza(res: Response): Response {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Il sito si incornicia solo da solo (anteprima dell'admin): niente clickjacking da altri domini.
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Content-Security-Policy', "frame-ancestors 'self'");
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return res;
}

/**
 * Le richieste che modificano dati devono partire dal sito stesso. I cookie di sessione
 * sono SameSite=Lax, ma il controllo esplicito dell'origine chiude anche i casi che Lax
 * lascia aperti (sottodomini, browser vecchi).
 */
export function origineValida(request: Request, url: URL): boolean {
  const origin = request.headers.get('Origin');
  if (origin) return origin === url.origin;
  // Senza Origin (alcuni client non browser) si accetta solo se il browser dichiara same-origin
  // o se l'header manca del tutto (script server-side, test): un attacco CSRF passa sempre da un browser.
  const site = request.headers.get('Sec-Fetch-Site');
  return !site || site === 'same-origin' || site === 'none';
}

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;

  if (path.startsWith('/api/admin')) {
    return intestazioniSicurezza(await onAdminApi(context, next));
  }
  if (path.startsWith('/admin')) {
    // Le pagine admin contengono contenuti in bozza: mai nella cache pubblica del CDN.
    const response = await onAdminPage(context, next);
    response.headers.set('Cache-Control', 'private, no-store');
    return intestazioniSicurezza(response);
  }
  // Tutte le pagine leggono i testi dal database: nessuna cache CDN, altrimenti
  // i visitatori vedono testi vecchi dopo ogni salvataggio.
  const res = await next();
  if ((res.headers.get('content-type') || '').includes('text/html')) {
    res.headers.set('Cache-Control', 'no-store');
  }
  return intestazioniSicurezza(res);
});

async function onAdminApi(context: Ctx, next: () => Promise<Response>): Promise<Response> {
  const { request, url } = context;
  if (!METODI_SICURI.includes(request.method) && !origineValida(request, url)) {
    return json({ error: 'Origine della richiesta non valida' }, 403);
  }
  if (!PUBLIC_API_PATHS.includes(url.pathname)) {
    const supabase = createSupabaseServerClient(context.cookies, request);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return json({ error: 'Non autenticato' }, 401);
    // /auth/update-password e /auth/logout servono anche a chi sta impostando la password
    // dopo un invito: basta la sessione. Tutto il resto richiede la riga in bc_admin_users.
    const soloSessione = url.pathname.startsWith('/api/admin/auth/');
    if (!soloSessione && !(await checkIsAdmin(supabase as any, user.id))) {
      return json({ error: 'Non autorizzato' }, 403);
    }
    context.locals.user = user;
  }
  const res = await next();
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}

async function onAdminPage(context: Ctx, next: () => Promise<Response>): Promise<Response> {
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
  // Un account Supabase valido non basta (progetto condiviso con altri siti): serve la riga
  // in bc_admin_users. Niente redirect al login (creerebbe un giro infinito per chi è
  // loggato ma non abilitato): una pagina 403 chiara con l'uscita.
  if (!(await checkIsAdmin(supabase as any, user.id))) {
    console.warn('[admin-session] utente non abilitato', { path: context.url.pathname });
    return new Response(
      '<!doctype html><html lang="it"><meta charset="utf-8"><title>Accesso non abilitato</title>' +
        '<body style="font-family:sans-serif;max-width:480px;margin:80px auto;padding:0 24px">' +
        '<h1 style="font-size:20px;font-weight:400">Accesso non abilitato</h1>' +
        '<p>Questo account non è abilitato a modificare il sito. Chiedi a Pianeta.Studio di abilitarlo.</p>' +
        '<form method="post" action="/api/admin/auth/logout"><button type="submit">Esci</button></form>' +
        '</body></html>',
      { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }
  context.locals.user = user;
  return next();
}
