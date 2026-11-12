// src/pages/api/admin/upload-image.ts
import type { APIRoute } from 'astro';
import { createSupabaseAdminClient } from '../../../lib/supabase';
import { requireAdmin } from '../../../lib/admin-guard';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Vercel rifiuta le richieste oltre ~4,5MB prima ancora che arrivino qui: il pannello
// ridimensiona le foto nel browser prima dell'invio (src/lib/client/upload-immagine.ts),
// questo limite è la rete di sicurezza lato server.
const MAX_SIZE_BYTES = 4 * 1024 * 1024;

// Whitelist esplicita dei bucket Storage che questo endpoint può scrivere. Il progetto
// Supabase (`lqnwtmmhgmnxxtduvugh`, vedi supabase/README.md) è condiviso con altre app
// (bucket verificati dal vivo: `media`, `atlas-documents`, `apotheke-products`,
// `apotheke-media`, `segnale-screenshots`) — senza questa whitelist, un chiamante
// autenticato su QUESTO sito potrebbe passare `bucket: 'apotheke-products'` (o
// qualunque altro bucket esistente/futuro) nel FormData e scrivere file arbitrari
// nello storage di un altro cliente. `barbara-costantini-progetti` non è ancora usato
// da nessun endpoint (arriverà col Task 16) ma è già incluso qui: la whitelist va
// aggiornata una sola volta, non ad ogni nuovo bucket di questo stesso sito.
const ALLOWED_BUCKETS = ['barbara-costantini-team', 'barbara-costantini-progetti'];

export const POST: APIRoute = async ({ request, cookies }) => {
  // Solo admin di questo sito: l'upload usa la service role (bypassa la RLS dello Storage).
  const ctx = await requireAdmin(cookies, request);
  if (ctx instanceof Response) return ctx;

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const bucket = formData.get('bucket') as string | null;

  if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
    return new Response(JSON.stringify({ error: 'Bucket non valido' }), { status: 400 });
  }
  if (!file || !ALLOWED_TYPES.includes(file.type)) {
    return new Response(JSON.stringify({ error: 'Tipo file non valido' }), { status: 400 });
  }
  // Il MIME arriva dal client: controllo anche la firma binaria del file.
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
  const isWebp = head[0] === 0x52 && head[1] === 0x49 && head[8] === 0x57 && head[9] === 0x45;
  if (!(isJpeg || isPng || isWebp)) {
    return new Response(JSON.stringify({ error: 'File non è un\'immagine valida' }), { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return new Response(JSON.stringify({ error: 'File troppo grande (max 4MB)' }), { status: 400 });
  }

  // Lo storage ha RLS attiva senza policy: il client dell'utente non può scrivere.
  // Dopo il controllo di ruolo sopra (solo admin) si scrive con il client di servizio.
  // Il nome file è sanificato: niente slash o caratteri speciali nel path.
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
  const fileName = `${crypto.randomUUID()}-${safeName}`;
  const storage = createSupabaseAdminClient().storage;
  const { data, error } = await storage.from(bucket).upload(fileName, file);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  const {
    data: { publicUrl },
  } = storage.from(bucket).getPublicUrl(data.path);
  return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
};
