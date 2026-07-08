// src/pages/api/admin/auth/login.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { parseJsonBody } from '../../../../lib/parse-json-body';

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await parseJsonBody<{ email?: string; password?: string }>(request);
  if (!body?.email || !body?.password) {
    return new Response(JSON.stringify({ error: 'Email e password sono obbligatorie.' }), { status: 400 });
  }
  const { email, password } = body;
  const supabase = createSupabaseServerClient(cookies, request);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
