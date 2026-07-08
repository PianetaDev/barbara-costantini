// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';

// Rotte sotto /admin/* raggiungibili senza una sessione valida: la pagina di login
// stessa, e la pagina di impostazione password dopo un reset (il token di recovery
// vive nel fragment dell'URL, che il browser non invia mai al server — quindi al
// momento della richiesta server-side non esiste ancora nessuna sessione da
// verificare; è il client-side script della pagina a stabilirla).
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/imposta-password'];

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith('/admin') || PUBLIC_ADMIN_PATHS.includes(context.url.pathname)) {
    return next();
  }
  const supabase = createSupabaseServerClient(context.cookies, context.request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return context.redirect('/admin/login');
  }
  context.locals.user = user;
  return next();
});
