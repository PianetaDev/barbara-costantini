// src/lib/client/upload-immagine.ts
// Caricamento immagini dal pannello admin (solo browser).
// Le foto di una fotocamera pesano 5-15MB: troppo per l'invio (limite ~4,5MB di Vercel)
// e inutile per il web. Prima dell'invio l'immagine viene ridotta a un lato massimo di
// 2400px e ricompressa: resta nitida a schermo intero e pesa qualche centinaio di KB.

const LATO_MAX = 2400;
const QUALITA = 0.86;
const PESO_SENZA_RITOCCO = 900 * 1024;

export const TIPI_AMMESSI = ['image/jpeg', 'image/png', 'image/webp'];

async function ridimensiona(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file; // il browser non sa leggerla: decide il server
  }
  const scala = Math.min(1, LATO_MAX / Math.max(bitmap.width, bitmap.height));
  if (scala === 1 && file.size <= PESO_SENZA_RITOCCO) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scala);
  canvas.height = Math.round(bitmap.height * scala);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  // PNG resta PNG solo se piccolo (loghi con trasparenza); le foto diventano JPEG.
  const tipo = file.type === 'image/png' && file.size <= PESO_SENZA_RITOCCO ? 'image/png' : 'image/jpeg';
  const blob: Blob | null = await new Promise((ok) => canvas.toBlob(ok, tipo, QUALITA));
  if (!blob || blob.size >= file.size) return file;
  const estensione = tipo === 'image/png' ? 'png' : 'jpg';
  const nome = file.name.replace(/\.[^.]+$/, '') + '.' + estensione;
  return new File([blob], nome, { type: tipo });
}

/**
 * Ridimensiona e carica un'immagine. Ritorna l'URL pubblico.
 * Lancia un Error con un messaggio leggibile se qualcosa non va.
 */
export async function caricaImmagine(file: File, bucket: 'barbara-costantini-team' | 'barbara-costantini-progetti'): Promise<string> {
  if (!TIPI_AMMESSI.includes(file.type)) {
    throw new Error('Formato non supportato: usa una foto JPG, PNG o WebP.');
  }
  const pronto = await ridimensiona(file);
  const fd = new FormData();
  fd.append('file', pronto);
  fd.append('bucket', bucket);
  let res: Response;
  try {
    res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
  } catch {
    throw new Error('Caricamento non riuscito: controlla la connessione e riprova.');
  }
  if (res.status === 413) throw new Error('Immagine troppo pesante anche dopo la riduzione: prova con un file più piccolo.');
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.url) throw new Error(leggiErrore(json.error) || `Caricamento non riuscito (${res.status}).`);
  return json.url as string;
}

/** Trasforma l'errore di un endpoint (stringa o oggetto di validazione) in una frase leggibile. */
export function leggiErrore(error: unknown): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  const e = error as { formErrors?: string[]; fieldErrors?: Record<string, string[]> };
  const parti: string[] = [...(e.formErrors ?? [])];
  for (const [campo, msgs] of Object.entries(e.fieldErrors ?? {})) {
    parti.push(`${campo}: ${(msgs ?? []).join(', ')}`);
  }
  return parti.length ? parti.join(' · ') : JSON.stringify(error);
}

/** Legge la risposta di un endpoint admin e ritorna un messaggio d'errore leggibile ('' se ok). */
export async function erroreRisposta(res: Response): Promise<string> {
  if (res.ok) return '';
  if (res.status === 401) return 'Sessione scaduta: ricarica la pagina ed entra di nuovo.';
  const json = await res.json().catch(() => ({}));
  return leggiErrore(json.error) || `Operazione non riuscita (${res.status}).`;
}
