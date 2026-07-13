// src/pages/api/admin/progetti/index.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { progettoSchema } from '../../../../lib/validation/progetto';
import { parseJsonBody } from '../../../../lib/parse-json-body';

// Schema di creazione: slug/titolo/tipo obbligatori (come nello schema pieno), tutto
// il resto opzionale — a differenza del PATCH (che usa .partial() su TUTTO), qui
// serve mantenere l'obbligatorietà dei 3 campi minimi mentre sezioni/immagini (array
// non-optional nello schema pieno) diventano opzionali per permettere un form di
// creazione minimo che non li invia affatto.
const progettoCreateSchema = progettoSchema.partial({
  committente: true,
  anno: true,
  intro: true,
  sezioni: true,
  metodo: true,
  immagini: true,
  immaginiContenuto: true,
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

  const parsed = progettoCreateSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: z.flattenError(parsed.error) }), { status: 400 });
  }

  // Traduzione immaginiContenuto (camelCase, Zod/payload) -> immagini_contenuto
  // (snake_case, colonna reale) — stesso motivo del PATCH in progetti/[id].ts: la
  // colonna DB è l'unica multi-parola tra i campi di bc_projects, PostgREST non
  // troverebbe una colonna chiamata "immaginiContenuto".
  const { immaginiContenuto, sezioni, immagini, ...restoDati } = parsed.data;
  const datiDaScrivere = {
    ...restoDati,
    sezioni: sezioni ?? [],
    immagini: immagini ?? [],
    ...(immaginiContenuto !== undefined && { immagini_contenuto: immaginiContenuto }),
  };

  const { data, error } = await supabase
    .from('bc_projects')
    .insert(datiDaScrivere)
    .select('id')
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ id: data.id }), { status: 200 });
};
