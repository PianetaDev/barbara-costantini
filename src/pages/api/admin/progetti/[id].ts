// src/pages/api/admin/progetti/[id].ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { progettoSchema, slugify } from '../../../../lib/validation/progetto';
import { parseJsonBody } from '../../../../lib/parse-json-body';
import { sanitizeIntroHtml } from '../../../../lib/sanitize-intro';
import { requireAdmin, jsonResponse } from '../../../../lib/admin-guard';
import { rimuoviFileStorage } from '../../../../lib/storage-cleanup';

// guid: qualunque uuid ben formato, non solo quelli con versione RFC (z.uuid li rifiuterebbe).
const idSchema = z.guid();

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const ctx = await requireAdmin(cookies, request);
  if (ctx instanceof Response) return ctx;
  const { supabase } = ctx;

  if (!idSchema.safeParse(params.id).success) return jsonResponse({ error: 'Progetto non trovato' }, 404);

  const body = await parseJsonBody(request);
  if (!body) return jsonResponse({ error: 'Body JSON mancante o non valido' }, 400);

  // Lo slug scritto a mano viene ripulito ("Lavoro test 2" → "lavoro-test-2").
  const b = body as Record<string, unknown>;
  if (typeof b.slug === 'string') b.slug = slugify(b.slug);

  // `.partial()`: aggiornamento parziale, ogni campo è opzionale (es. solo `archiviato`).
  const parsed = progettoSchema.partial().safeParse(body);
  if (!parsed.success) return jsonResponse({ error: z.flattenError(parsed.error) }, 400);

  // immaginiContenuto (camelCase, API) → immagini_contenuto (snake_case, colonna DB).
  const { immaginiContenuto, ...restoDati } = parsed.data;

  // Sanitizza `intro` (HTML del RichTextEditor) prima di scriverlo: difesa in profondità,
  // il rendering pubblico lo ripulisce di nuovo.
  if (restoDati.intro !== undefined) {
    restoDati.intro = sanitizeIntroHtml(restoDati.intro);
  }

  const datiDaScrivere = immaginiContenuto !== undefined
    ? { ...restoDati, immagini_contenuto: immaginiContenuto }
    : restoDati;

  // `.select('id')`: un `.update().eq()` che non trova righe (id inesistente o RLS) non dà
  // errore; senza questo controllo risponderemmo 200 senza aver scritto nulla.
  const { data, error } = await supabase.from('bc_projects').update(datiDaScrivere).eq('id', params.id).select('id');
  if (error) {
    // 23505 = slug già usato da un altro lavoro.
    const messaggio = (error as { code?: string }).code === '23505' ? 'Esiste già un lavoro con questo indirizzo (slug)' : error.message;
    return jsonResponse({ error: messaggio }, 400);
  }
  if (!data || data.length === 0) return jsonResponse({ error: 'Progetto non trovato' }, 404);
  return jsonResponse({ ok: true });
};

// Eliminazione definitiva: NON recuperabile. Due passi obbligati per evitare errori:
// prima si archivia (recuperabile), poi dall'elenco Archiviati si elimina per sempre.
export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const ctx = await requireAdmin(cookies, request);
  if (ctx instanceof Response) return ctx;
  const { supabase } = ctx;

  if (!idSchema.safeParse(params.id).success) return jsonResponse({ error: 'Progetto non trovato' }, 404);

  const { data: progetto, error: errLettura } = await supabase
    .from('bc_projects')
    .select('id, archiviato, immagini, blocks, immagini_contenuto')
    .eq('id', params.id)
    .maybeSingle();
  if (errLettura) return jsonResponse({ error: errLettura.message }, 400);
  if (!progetto) return jsonResponse({ error: 'Progetto non trovato' }, 404);
  if (!progetto.archiviato) {
    return jsonResponse({ error: 'Si possono eliminare solo i lavori archiviati: archivia prima il lavoro.' }, 409);
  }

  const { data: eliminati, error } = await supabase.from('bc_projects').delete().eq('id', params.id).select('id');
  if (error) return jsonResponse({ error: error.message }, 400);
  // Zero righe = la RLS ha bloccato la cancellazione: senza questo controllo il pannello
  // direbbe "fatto" con il lavoro ancora lì.
  if (!eliminati || eliminati.length === 0) return jsonResponse({ error: 'Eliminazione non riuscita' }, 403);

  const fileRimossi = await rimuoviFileStorage(progetto.immagini, progetto.blocks, progetto.immagini_contenuto);
  return jsonResponse({ ok: true, fileRimossi });
};
