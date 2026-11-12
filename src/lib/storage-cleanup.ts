// src/lib/storage-cleanup.ts
// Quando un lavoro o un membro del team viene eliminato definitivamente, anche le sue
// immagini caricate dall'admin vanno tolte dallo Storage: altrimenti restano pubbliche
// e raggiungibili per sempre via URL.
import { createSupabaseAdminClient } from './supabase';

export const BUCKET_GESTITI = ['barbara-costantini-team', 'barbara-costantini-progetti'] as const;

/** Estrae { bucket, path } da un URL pubblico di Supabase Storage, solo per i bucket di questo sito. */
export function percorsoStorage(url: unknown): { bucket: string; path: string } | null {
  if (typeof url !== 'string') return null;
  const m = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/([^?#]+)/);
  if (!m) return null;
  const [, bucket, path] = m;
  if (!(BUCKET_GESTITI as readonly string[]).includes(bucket)) return null;
  const decoded = decodeURIComponent(path);
  if (decoded.includes('..')) return null;
  return { bucket, path: decoded };
}

/** Raccoglie ricorsivamente tutte le stringhe dentro un valore JSON (blocchi, slideshow...). */
export function raccogliStringhe(valore: unknown, out: string[] = []): string[] {
  if (typeof valore === 'string') out.push(valore);
  else if (Array.isArray(valore)) valore.forEach((v) => raccogliStringhe(v, out));
  else if (valore && typeof valore === 'object') Object.values(valore).forEach((v) => raccogliStringhe(v, out));
  return out;
}

/**
 * Rimuove dallo Storage i file referenziati dai valori passati. Non blocca mai
 * l'eliminazione del record: un errore qui viene solo registrato nei log.
 */
export async function rimuoviFileStorage(...valori: unknown[]): Promise<number> {
  const perBucket = new Map<string, Set<string>>();
  for (const s of raccogliStringhe(valori)) {
    const p = percorsoStorage(s);
    if (!p) continue;
    if (!perBucket.has(p.bucket)) perBucket.set(p.bucket, new Set());
    perBucket.get(p.bucket)!.add(p.path);
  }
  if (perBucket.size === 0) return 0;
  let rimossi = 0;
  try {
    const storage = createSupabaseAdminClient().storage;
    for (const [bucket, paths] of perBucket) {
      const { error } = await storage.from(bucket).remove([...paths]);
      if (error) console.error('[storage-cleanup]', bucket, error.message);
      else rimossi += paths.size;
    }
  } catch (err) {
    console.error('[storage-cleanup] fallita', err);
  }
  return rimossi;
}
