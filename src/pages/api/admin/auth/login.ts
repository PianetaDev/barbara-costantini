import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { parseJsonBody } from '../../../../lib/parse-json-body';
import { checkIsAdmin } from '../../../../lib/admin-roles';

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await parseJsonBody<{ email?: string; password?: string }>(request);
  if (typeof body?.email !== 'string' || typeof body?.password !== 'string' || !body.email || !body.password) {
    return new Response(JSON.stringify({ error: 'Email e password sono obbligatorie.' }), { status: 400 });
  }
  const { email, password } = body;
  // Il client server-side scrive i cookie di sessione sulla risposta via `cookies.set()`
  // (vedi src/lib/supabase.ts): non c'è nulla da fare a mano qui per persistere la sessione.
  const supabase = createSupabaseServerClient(cookies, request);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data?.user) {
    // Messaggio unico: non si rivela se l'email esiste o se è sbagliata la password.
    return new Response(JSON.stringify({ error: 'Email o password non corrette.' }), { status: 401 });
  }
  // Il progetto Supabase è condiviso con altri siti: un account valido altrove non deve
  // ottenere una sessione sull'admin di questo sito.
  if (!(await checkIsAdmin(supabase as any, data.user.id))) {
    await supabase.auth.signOut();
    return new Response(JSON.stringify({ error: 'Email o password non corrette.' }), { status: 401 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
