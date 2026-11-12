// src/lib/page-content.ts
// Lettura dei contenuti di pagina per il sito pubblico, con modalità anteprima.
//
// Sito pubblico: legge `content` (quello pubblicato) con la chiave anonima.
// Anteprima (pannello admin, iframe a destra del form): l'indirizzo ha `?anteprima=1`
// e chi guarda è un admin loggato → si legge `bozza` (quello che sta scrivendo) se c'è.
// Per chiunque altro `?anteprima=1` non ha effetto: vede il sito pubblicato.
import type { AstroCookies } from 'astro';
import { getPageContent } from './supabase-public';
import { createSupabaseServerClient } from './supabase';
import { checkIsAdmin } from './admin-roles';

type Richiesta = { url: URL; cookies: AstroCookies; request: Request };

// Una sola verifica di sessione per richiesta, anche se la pagina legge più contenuti.
const verifiche = new WeakMap<Request, Promise<ReturnType<typeof createSupabaseServerClient> | null>>();

function clientAnteprima(astro: Richiesta) {
  if (astro.url.searchParams.get('anteprima') !== '1') return Promise.resolve(null);
  let p = verifiche.get(astro.request);
  if (!p) {
    p = (async () => {
      try {
        const supabase = createSupabaseServerClient(astro.cookies, astro.request);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || !(await checkIsAdmin(supabase as any, user.id))) return null;
        return supabase;
      } catch {
        return null;
      }
    })();
    verifiche.set(astro.request, p);
  }
  return p;
}

/** true se la pagina è mostrata nell'anteprima del pannello a un admin loggato. */
export async function inAnteprima(astro: Richiesta): Promise<boolean> {
  return (await clientAnteprima(astro)) !== null;
}

export async function leggiContenuto(astro: Richiesta, page: string): Promise<Record<string, any>> {
  const supabase = await clientAnteprima(astro);
  if (supabase) {
    const { data, error } = await supabase.from('bc_page_content').select('content, bozza').eq('page', page).maybeSingle();
    if (!error && data) return (data.bozza ?? data.content ?? {}) as Record<string, any>;
  }
  return getPageContent(page);
}
