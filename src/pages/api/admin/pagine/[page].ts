// src/pages/api/admin/pagine/[page].ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { pageContentSchema } from '../../../../lib/validation/page-content';
import { parseJsonBody } from '../../../../lib/parse-json-body';

// Client legato ai cookie della richiesta (NON service_role): la RLS
// `page_content_admin_write` su bc_page_content già permette la scrittura a qualunque
// utente presente in bc_admin_users (stesso pattern di src/pages/api/admin/progetti/[id].ts
// e src/pages/api/admin/team/[id].ts, Task 13/14) — il controllo `getUser()` qui sotto
// è solo per rispondere con un 401 pulito prima di toccare il DB, non l'unica difesa.
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

  const parsed = pageContentSchema.safeParse({ page: params.page, content: (body as Record<string, unknown>).content });
  if (!parsed.success) {
    // z.flattenError (funzione top-level) sostituisce il deprecato metodo `.flatten()`
    // sull'istanza dell'errore in Zod v4 — stesso pattern di progetti/team (Task 13/14).
    return new Response(JSON.stringify({ error: z.flattenError(parsed.error) }), { status: 400 });
  }

  const { error } = await supabase
    .from('bc_page_content')
    .upsert({ page: parsed.data.page, content: parsed.data.content });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
