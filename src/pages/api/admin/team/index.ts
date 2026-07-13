// src/pages/api/admin/team/index.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { teamMemberSchema } from '../../../../lib/validation/team';
import { parseJsonBody } from '../../../../lib/parse-json-body';

const teamMemberCreateSchema = teamMemberSchema.partial({
  ruolo: true,
  bio: true,
  foto_url: true,
  ordine: true,
  archiviato: true,
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return new Response(JSON.stringify({ error: 'Body JSON mancante o non valido' }), { status: 400 });
  }

  const parsed = teamMemberCreateSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: z.flattenError(parsed.error) }), { status: 400 });
  }

  const { data, error } = await supabase.from('bc_team_members').insert(parsed.data).select('id').single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ id: data.id }), { status: 200 });
};
