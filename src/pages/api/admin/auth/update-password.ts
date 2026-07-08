// src/pages/api/admin/auth/update-password.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { parseJsonBody } from '../../../../lib/parse-json-body';

// Chiamato da src/pages/admin/imposta-password.astro dopo che il frontmatter della
// pagina ha già scambiato il `code` di reset per una sessione (via
// exchangeCodeForSession, sullo stesso client server-side/cookie-based). Qui usiamo
// di nuovo createSupabaseServerClient — mai un client browser — proprio per leggere
// quella sessione dai cookie della richiesta corrente.
export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await parseJsonBody<{ password?: string }>(request);
  if (!body?.password) {
    return new Response(JSON.stringify({ error: 'Password obbligatoria.' }), { status: 400 });
  }
  const { password } = body;
  const supabase = createSupabaseServerClient(cookies, request);
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
