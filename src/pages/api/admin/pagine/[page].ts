// src/pages/api/admin/pagine/[page].ts
// Contenuti delle pagine (bc_page_content). Due colonne:
//   - content: quello che vede il sito pubblico
//   - bozza:   quello che l'admin sta scrivendo, mostrato solo nell'anteprima
// PATCH { content, pubblica?: boolean }
//   - pubblica assente/false → salva in bozza (l'anteprima si aggiorna, il sito no)
//   - pubblica true          → scrive sul sito e cancella la bozza
//   - pubblica + parziale    → scrive sul sito solo i campi inviati e conserva la bozza
// DELETE → scarta la bozza (annulla le modifiche non pubblicate)
// I campi inviati vengono UNITI a quelli esistenti: un salvataggio parziale (un solo
// campo, una scheda rimasta aperta con dati vecchi) non cancella gli altri campi.
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { pageContentSchema } from '../../../../lib/validation/page-content';
import { parseJsonBody } from '../../../../lib/parse-json-body';
import { requireAdmin, jsonResponse } from '../../../../lib/admin-guard';
import { sanitizeLegalHtml } from '../../../../lib/sanitize-intro';

type Contenuto = Record<string, unknown>;

function pulisci(content: Contenuto): Contenuto {
  // html_body (privacy/cookie policy) finisce in un set:html pubblico: si ripulisce in scrittura.
  if (typeof content.html_body === 'string') {
    return { ...content, html_body: sanitizeLegalHtml(content.html_body) };
  }
  return content;
}

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const ctx = await requireAdmin(cookies, request);
  if (ctx instanceof Response) return ctx;
  const { supabase } = ctx;

  const body = await parseJsonBody(request);
  if (!body) return jsonResponse({ error: 'Body JSON mancante o non valido' }, 400);

  const parsed = pageContentSchema.safeParse({ page: params.page, content: (body as Contenuto).content });
  if (!parsed.success) return jsonResponse({ error: z.flattenError(parsed.error) }, 400);
  const pubblica = (body as Contenuto).pubblica === true;
  // parziale: pubblica solo i campi inviati (modifica sul posto in home) senza buttare la
  // bozza aperta nel pannello; i campi pubblicati entrano anche nella bozza.
  const parziale = (body as Contenuto).parziale === true;
  const { page } = parsed.data;
  const nuovo = pulisci(parsed.data.content);

  const { data: riga, error: errLettura } = await supabase
    .from('bc_page_content')
    .select('content, bozza')
    .eq('page', page)
    .maybeSingle();
  if (errLettura) return jsonResponse({ error: errLettura.message }, 400);

  const pubblicato = (riga?.content ?? {}) as Contenuto;
  const bozzaAttuale = (riga?.bozza ?? null) as Contenuto | null;

  const valori: Record<string, unknown> = pubblica
    ? { page, content: { ...pubblicato, ...nuovo }, bozza: parziale && bozzaAttuale ? { ...bozzaAttuale, ...nuovo } : null }
    : { page, bozza: { ...(bozzaAttuale ?? pubblicato), ...nuovo } };

  const { error } = await supabase.from('bc_page_content').upsert(valori);
  if (error) return jsonResponse({ error: error.message }, 400);
  return jsonResponse({ ok: true, pubblicato: pubblica });
};

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const ctx = await requireAdmin(cookies, request);
  if (ctx instanceof Response) return ctx;

  const parsed = pageContentSchema.shape.page.safeParse(params.page);
  if (!parsed.success) return jsonResponse({ error: 'Pagina non valida' }, 400);

  const { error } = await ctx.supabase.from('bc_page_content').update({ bozza: null }).eq('page', parsed.data);
  if (error) return jsonResponse({ error: error.message }, 400);
  return jsonResponse({ ok: true });
};
