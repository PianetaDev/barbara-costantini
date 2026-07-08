// src/lib/supabase.ts
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
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

/**
 * Crea un client Supabase con `service_role`, che bypassa la RLS e sblocca le API
 * `auth.admin.*` (es. `inviteUserByEmail`, `deleteUser`) — operazioni non disponibili
 * con l'anon key usata da createSupabaseServerClient. Non va mai esposto al browser:
 * usare solo in endpoint server-side (`src/pages/api/**`), mai in codice che finisce
 * nel bundle client. A differenza del client sopra, non è legato ai cookie della
 * richiesta: non rappresenta l'utente che chiama, ma un accesso amministrativo.
 */
export function createSupabaseAdminClient() {
  return createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Scambia un `code` di recovery (query string PKCE, es.
 * `/admin/imposta-password?code=...`) per una sessione, usando il client passato da
 * chi chiama (deve essere lo stesso creato con createSupabaseServerClient sui cookie
 * della richiesta corrente — vedi src/pages/admin/imposta-password.astro). Riceve il
 * client già costruito, invece di crearlo internamente, così è testabile passando un
 * fake senza dover mockare l'intero modulo.
 *
 * Ritorna `null` in caso di successo, o un messaggio d'errore leggibile altrimenti.
 * Non lascia propagare eccezioni impreviste (es. errori di rete): senza questo
 * try/catch la pagina risponderebbe con un 500 generico invece di un messaggio
 * comprensibile per chi sta resettando la password.
 */
export async function exchangeRecoveryCode(
  supabase: { auth: { exchangeCodeForSession: (code: string) => Promise<{ error: { message: string } | null }> } },
  code: string
): Promise<string | null> {
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return error?.message ?? null;
  } catch {
    return 'Impossibile completare il reset: si è verificato un errore imprevisto. Riprova o richiedi un nuovo link.';
  }
}
