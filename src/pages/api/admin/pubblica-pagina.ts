// src/pages/api/admin/pubblica-pagina.ts
// Copia la bozza di una pagina nel contenuto pubblico (solo admin, con RLS).
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';
import { checkIsAdmin } from '../../../lib/admin-roles';

const PAGINE = ['home', 'studio', 'servizi', 'contatti', 'lavori', 'privacy-policy', 'cookie-policy', 'footer'];

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
  if (!(await checkIsAdmin(supabase, user.id))) return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 403 });

  const body = (await request.json().catch(() => null)) as { page?: string } | null;
  if (!body?.page || !PAGINE.includes(body.page)) return new Response(JSON.stringify({ error: 'Pagina non valida' }), { status: 400 });

  const { data: riga, error: errLettura } = await supabase.from('bc_page_content').select('bozza').eq('page', body.page).single();
  if (errLettura) return new Response(JSON.stringify({ error: errLettura.message }), { status: 400 });
  if (!riga?.bozza) return new Response(JSON.stringify({ error: 'Nessuna bozza da pubblicare' }), { status: 400 });

  const { error } = await supabase.from('bc_page_content').update({ content: riga.bozza, bozza: null }).eq('page', body.page);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
