// src/pages/api/admin/auth/reset-password.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { parseJsonBody } from '../../../../lib/parse-json-body';

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await parseJsonBody<{ email?: string }>(request);
  if (typeof body?.email !== 'string' || !body.email) {
    return new Response(JSON.stringify({ error: 'Email obbligatoria.' }), { status: 400 });
  }
  const { email } = body;
  const supabase = createSupabaseServerClient(cookies, request);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${new URL(request.url).origin}/admin/imposta-password`,
  });
  // Risposta identica che l'email esista o no: non si rivela chi ha un account.
  if (error) console.error('[reset-password]', error.message);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
