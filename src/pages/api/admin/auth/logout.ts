// src/pages/api/admin/auth/logout.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signOut();
  return new Response(null, { status: 302, headers: { Location: '/admin/login' } });
};
