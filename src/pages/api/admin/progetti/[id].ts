// src/pages/api/admin/progetti/[id].ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { progettoSchema } from '../../../../lib/validation/progetto';
import { parseJsonBody } from '../../../../lib/parse-json-body';
import { sanitizeIntroHtml } from '../../../../lib/sanitize-intro';

// Client server-side legato ai cookie della richiesta (NON service_role): la RLS
// `projects_admin_write` su bc_projects già permette la scrittura a qualunque utente
// presente in bc_admin_users (editor incluso, non solo superadmin) — non serve
// bypassare la RLS qui, a differenza dell'invito utenti (Task 12) che richiede le API
// auth.admin.* riservate al service_role.
export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return new Response(JSON.stringify({ error: 'Body JSON mancante o non valido' }), { status: 400 });
  }

  // .partial(): un PATCH aggiorna solo i campi presenti nel body, non l'intero progetto
  // (es. la pagina di editing invia solo titolo/committente/intro, non sezioni/immagini).
  const parsed = progettoSchema.partial().safeParse(body);
  if (!parsed.success) {
    // z.flattenError (funzione top-level) sostituisce il deprecato metodo
    // `.flatten()` sull'istanza dell'errore in Zod v4.
    return new Response(JSON.stringify({ error: z.flattenError(parsed.error) }), { status: 400 });
  }

  // `intro` è HTML prodotto da RichTextEditor.vue (Tiptap), non testo semplice — va
  // sanificato prima di finire su Supabase e da lì sulla pagina pubblica (vedi
  // src/lib/sanitize-intro.ts). `.partial()` significa che questo PATCH potrebbe non
  // toccare affatto `intro`, quindi si sanifica solo se presente nel body.
  const updateData = parsed.data;
  if (updateData.intro !== undefined) {
    updateData.intro = sanitizeIntroHtml(updateData.intro);
  }

  // .select('id'): senza, `update().eq('id', ...)` non imposta `error` quando la eq
  // non matcha nessuna riga (0 righe modificate non è un errore per Postgres/PostgREST)
  // — un PATCH verso un id inesistente/già cancellato tornerebbe comunque 200 senza
  // aver scritto nulla. Con .select('id') possiamo distinguere i due casi guardando
  // se l'array di righe aggiornate è vuoto.
  const { data, error } = await supabase.from('bc_projects').update(updateData).eq('id', params.id).select('id');
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: 'Progetto non trovato' }), { status: 404 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
