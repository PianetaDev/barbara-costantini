// src/pages/api/admin/team/[id].ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { teamMemberSchema } from '../../../../lib/validation/team';
import { parseJsonBody } from '../../../../lib/parse-json-body';

// Client legato ai cookie della richiesta (NON service_role): la RLS
// `team_admin_write` su bc_team_members già permette la scrittura a qualunque utente
// presente in bc_admin_users (stesso pattern di src/pages/api/admin/progetti/[id].ts,
// Task 13).
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

  // .partial(): un PATCH aggiorna solo i campi presenti nel body (es. la pagina di
  // editing invia solo nome/ruolo/bio, e foto_url solo se è stata caricata una nuova
  // immagine).
  const parsed = teamMemberSchema.partial().safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: z.flattenError(parsed.error) }), { status: 400 });
  }

  // .select('id'): senza, `update().eq('id', ...)` non imposta `error` quando la eq non
  // matcha nessuna riga — un PATCH verso un id inesistente/già cancellato tornerebbe
  // comunque 200 senza aver scritto nulla (fix stabilito nel Task 13).
  const { data, error } = await supabase
    .from('bc_team_members')
    .update(parsed.data)
    .eq('id', params.id)
    .select('id');
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: 'Membro non trovato' }), { status: 404 });
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

  const { error } = await supabase.from('bc_team_members').delete().eq('id', params.id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
