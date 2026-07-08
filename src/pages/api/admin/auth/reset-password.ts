// src/pages/api/admin/auth/reset-password.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email } = await request.json();
  const supabase = createSupabaseServerClient(cookies, request);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${new URL(request.url).origin}/admin/imposta-password`,
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
