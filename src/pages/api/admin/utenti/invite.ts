// src/pages/api/admin/utenti/invite.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient, createSupabaseAdminClient } from '../../../../lib/supabase';
import { checkIsSuperadmin } from '../../../../lib/admin-roles';
import { parseJsonBody } from '../../../../lib/parse-json-body';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !(await checkIsSuperadmin(supabase, user.id))) {
    return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 403 });
  }

  const body = await parseJsonBody<{ email?: string; role?: string }>(request);
  if (!body?.email || !body?.role) {
    return new Response(JSON.stringify({ error: 'Email e ruolo sono obbligatori.' }), { status: 400 });
  }
  const { email, role } = body;
  if (!['superadmin', 'editor'].includes(role)) {
    return new Response(JSON.stringify({ error: 'Ruolo non valido' }), { status: 400 });
  }

  // Client separato con service_role: inviteUserByEmail (auth.admin.*) richiede privilegi
  // admin, non disponibili con l'anon key del client sopra (usato solo per verificare
  // chi chiama). Non va mai esposto al browser: usato solo qui, lato server.
  const adminClient = createSupabaseAdminClient();
  // redirectTo esplicito: senza, Supabase manda l'invitato al site_url di default del
  // progetto condiviso invece che a /admin/imposta-password, dove completa l'onboarding
  // impostando la password — stesso bug (e stesso fix) di reset-password.ts.
  const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${new URL(request.url).origin}/admin/imposta-password`,
  });
  if (inviteError) {
    return new Response(JSON.stringify({ error: inviteError.message }), { status: 400 });
  }

  const { error: insertError } = await adminClient.from('bc_admin_users').insert({
    id: invited.user.id,
    email,
    role,
  });
  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
