// src/pages/api/admin/progetti/reorder.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { parseJsonBody } from '../../../../lib/parse-json-body';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
  }

  const body = await parseJsonBody(request);
  // body: Array<{ id: string; ordine: number }>
  if (!Array.isArray(body) || body.some((r) => !r.id || typeof r.ordine !== 'number')) {
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
