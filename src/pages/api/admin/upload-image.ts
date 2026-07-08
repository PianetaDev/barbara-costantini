// src/pages/api/admin/upload-image.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

// Whitelist esplicita dei bucket Storage che questo endpoint può scrivere. Il progetto
// Supabase (`fmplfkzqexaposaamgwi`, vedi supabase/README.md) è condiviso con altre app
// (bucket verificati dal vivo: `media`, `atlas-documents`, `apotheke-products`,
// `apotheke-media`, `segnale-screenshots`) — senza questa whitelist, un chiamante
// autenticato su QUESTO sito potrebbe passare `bucket: 'apotheke-products'` (o
// qualunque altro bucket esistente/futuro) nel FormData e scrivere file arbitrari
// nello storage di un altro cliente. `barbara-costantini-progetti` non è ancora usato
// da nessun endpoint (arriverà col Task 16) ma è già incluso qui: la whitelist va
// aggiornata una sola volta, non ad ogni nuovo bucket di questo stesso sito.
const ALLOWED_BUCKETS = ['barbara-costantini-team', 'barbara-costantini-progetti'];

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const bucket = formData.get('bucket') as string | null;

  if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
    return new Response(JSON.stringify({ error: 'Bucket non valido' }), { status: 400 });
  }
  if (!file || !ALLOWED_TYPES.includes(file.type)) {
    return new Response(JSON.stringify({ error: 'Tipo file non valido' }), { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return new Response(JSON.stringify({ error: 'File troppo grande (max 10MB)' }), { status: 400 });
  }

  const fileName = `${crypto.randomUUID()}-${file.name}`;
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
};
