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

  // camelCase → snake_case: immaginiContenuto (Zod/form) → immagini_contenuto (DB).
  // `!== undefined` perché è un PATCH parziale: il campo potrebbe non essere nel body.
  const { immaginiContenuto, ...restoDati } = parsed.data;

  // `intro` è HTML Tiptap — va sanificato prima di scrivere su Supabase.
  if (restoDati.intro !== undefined) {
    restoDati.intro = sanitizeIntroHtml(restoDati.intro);
  }

  const datiDaScrivere = immaginiContenuto !== undefined
    ? { ...restoDati, immagini_contenuto: immaginiContenuto }
    : restoDati;

  const { data, error } = await supabase.from('bc_projects').update(datiDaScrivere).eq('id', params.id).select('id');
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: 'Progetto non trovato' }), { status: 404 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
  }

  const { error } = await supabase.from('bc_projects').delete().eq('id', params.id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
