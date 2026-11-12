// src/pages/api/admin/team/[id].ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { requireAdmin, jsonResponse } from '../../../../lib/admin-guard';
import { rimuoviFileStorage } from '../../../../lib/storage-cleanup';
import { teamMemberSchema } from '../../../../lib/validation/team';
import { parseJsonBody } from '../../../../lib/parse-json-body';

// Client legato ai cookie della richiesta (NON service_role): la RLS
// `team_admin_write` su bc_team_members già permette la scrittura a qualunque utente
// presente in bc_admin_users (stesso pattern di src/pages/api/admin/progetti/[id].ts,
// Task 13).
export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const ctx = await requireAdmin(cookies, request);
  if (ctx instanceof Response) return ctx;
  const { supabase } = ctx;

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

// Eliminazione definitiva: NON recuperabile. Come per i lavori: prima si archivia
// (recuperabile), poi dall'elenco Archiviati si elimina per sempre.
export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const ctx = await requireAdmin(cookies, request);
  if (ctx instanceof Response) return ctx;
  const { supabase } = ctx;

  if (!z.guid().safeParse(params.id).success) return jsonResponse({ error: 'Membro non trovato' }, 404);

  const { data: membro, error: errLettura } = await supabase
    .from('bc_team_members')
    .select('id, archiviato, foto_url')
    .eq('id', params.id)
    .maybeSingle();
  if (errLettura) return jsonResponse({ error: errLettura.message }, 400);
  if (!membro) return jsonResponse({ error: 'Membro non trovato' }, 404);
  if (!membro.archiviato) {
    return jsonResponse({ error: 'Si possono eliminare solo i membri archiviati: archivia prima il membro.' }, 409);
  }

  const { data: eliminati, error } = await supabase.from('bc_team_members').delete().eq('id', params.id).select('id');
  if (error) return jsonResponse({ error: error.message }, 400);
  if (!eliminati || eliminati.length === 0) return jsonResponse({ error: 'Eliminazione non riuscita' }, 403);

  const fileRimossi = await rimuoviFileStorage(membro.foto_url);
  return jsonResponse({ ok: true, fileRimossi });
};
