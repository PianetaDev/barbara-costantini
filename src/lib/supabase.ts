// src/lib/supabase.ts
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

/**
 * Crea un client Supabase lato server, legato ai cookie della richiesta/risposta
 * Astro corrente. Va istanziato una volta per richiesta (middleware, endpoint API,
 * pagine .astro) — non va condiviso/cacheato tra richieste diverse.
 *
 * `getAll`/`setAll` sono le uniche cookie methods supportate dalla versione
 * installata di @supabase/ssr (0.12.x); `get`/`set`/`remove` sono deprecate.
 */
export function createSupabaseServerClient(cookies: AstroCookies, request: Request) {
  return createServerClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        // parseCookieHeader tipizza `value` come opzionale (`string | undefined`), ma
        // @supabase/ssr 0.12.x richiede `GetAllCookies` con `value: string` obbligatorio:
        // normalizziamo i cookie senza valore a stringa vuota per soddisfare il tipo.
        return parseCookieHeader(request.headers.get('Cookie') ?? '').map(({ name, value }) => ({
          name,
          value: value ?? '',
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookies.set(name, value, { ...options, path: '/' })
        );
      },
    },
  });
}
