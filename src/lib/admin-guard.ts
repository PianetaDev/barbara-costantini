// src/lib/admin-guard.ts
// Guardia unica per tutti gli endpoint /api/admin/*: una sessione Supabase valida non
// basta, perché il progetto Supabase è condiviso con altri siti (un cliente di un altro
// shop ha un account valido). Serve anche la riga in bc_admin_users.
// La RLS resta la difesa sul database; questa guardia serve a rispondere con un 401/403
// chiaro prima di toccare i dati, e copre gli endpoint che usano la service role.
import type { AstroCookies } from 'astro';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createSupabaseServerClient } from './supabase';
import { checkIsAdmin } from './admin-roles';

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export type AdminContext = { supabase: SupabaseClient; user: User };

/**
 * Ritorna il client legato alla sessione e l'utente, oppure una Response 401/403 pronta
 * da restituire. Uso: `const ctx = await requireAdmin(cookies, request); if (ctx instanceof Response) return ctx;`
 */
export async function requireAdmin(cookies: AstroCookies, request: Request): Promise<AdminContext | Response> {
  const supabase = createSupabaseServerClient(cookies, request) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonResponse({ error: 'Non autenticato' }, 401);
  if (!(await checkIsAdmin(supabase, user.id))) return jsonResponse({ error: 'Non autorizzato' }, 403);
  return { supabase, user };
}
