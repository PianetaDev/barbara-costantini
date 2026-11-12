// src/pages/api/admin/auth/login.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../../lib/supabase';

// Login con invio di modulo normale (niente fetch): il server imposta il cookie di
// sessione e risponde con un redirect. Più affidabile dei cookie scritti in una risposta JSON.
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '');
  const password = String(form.get('password') ?? '');
  if (!email || !password) {
    return redirect('/admin/login?error=missing', 303);
  }
  const supabase = createSupabaseServerClient(cookies, request);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return redirect('/admin/login?error=invalid', 303);
  }
  return redirect('/admin/progetti', 303);
};
