// src/lib/parse-json-body.ts

/**
 * Legge e parsa il body JSON di una Request in modo sicuro. `Request.json()` lancia
 * se il body è vuoto o non è JSON valido — senza un try/catch attorno, un client che
 * manda un body malformato (o nessun body) fa esplodere l'endpoint con un 500
 * generico invece di un 400 pulito. Ritorna `null` in quel caso; il chiamante decide
 * il messaggio/status della risposta di errore.
 */
export async function parseJsonBody<T = Record<string, unknown>>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
