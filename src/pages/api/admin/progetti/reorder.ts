// src/pages/api/admin/progetti/reorder.ts
import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/admin-guard';
import { parseJsonBody } from '../../../../lib/parse-json-body';

export const POST: APIRoute = async ({ request, cookies }) => {
  const ctx = await requireAdmin(cookies, request);
  if (ctx instanceof Response) return ctx;
  const { supabase } = ctx;

  const body = await parseJsonBody(request);
  // body: Array<{ id: string; ordine: number }>
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (
    !Array.isArray(body) ||
    body.length > 500 ||
    body.some((r) => typeof r?.id !== 'string' || !UUID.test(r.id) || !Number.isInteger(r.ordine) || r.ordine < 0)
  ) {
    return new Response(JSON.stringify({ error: 'Payload non valido' }), { status: 400 });
  }

  // Aggiorna ogni riga in sequenza — Supabase JS non supporta bulk update con valori
  // diversi per riga in una sola chiamata, quindi usiamo Promise.all su N update singoli.
  const results = await Promise.all(
    body.map((r) =>
      supabase.from('bc_projects').update({ ordine: r.ordine }).eq('id', r.id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return new Response(JSON.stringify({ error: failed.error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
