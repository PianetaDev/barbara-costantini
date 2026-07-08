// src/pages/api/admin/auth/login.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();
  const supabase = createSupabaseServerClient(cookies, request);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
