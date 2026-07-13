// src/lib/validation/progetto.ts
import { z } from 'zod';

export const sezioneSchema = z.object({
  titolo: z.string(),
  sottotitolo: z.string(),
  testi: z.array(z.string()),
});

// Blocchi corpo pagina — formato flessibile, validazione loose (jsonb libero)
export const blockSchema = z.record(z.any());

export const immagineSchema = z.object({
  src: z.string(),
  label: z.string(),
  aspetto: z.enum(['h', 'v']).optional(),
});

export const progettoSchema = z.object({
  slug: z.string().min(1, 'Slug obbligatorio'),
  titolo: z.string().min(1, 'Titolo obbligatorio'),
  committente: z.string().optional(),
  anno: z.string().optional(),
  tipo: z.enum(['horizontal', 'vertical']),
  intro: z.string().optional(),
  sezioni: z.array(sezioneSchema),
  blocks: z.array(blockSchema).optional(),
  metodo: z.object({ testi: z.array(z.string()), citazione: z.string() }).optional(),
  immagini: z.array(immagineSchema),
  // NOTA: `.optional()`, non `.default(0)`. Questo schema viene usato sia per un
  // eventuale futuro insert (dove un default avrebbe senso) sia per l'update parziale
  // dell'endpoint PATCH (`progettoSchema.partial().safeParse(body)`). `.default()` in
  // Zod si applica anche quando il campo è assente dall'input, PRIMA che `.partial()`
  // lo renda "opzionale e ignorabile" — un PATCH che non tocca `ordine` finirebbe
  // comunque con `ordine: 0` in `parsed.data`, sovrascrivendo silenziosamente il
  // valore esistente in bc_projects (bug verificato dal vivo: una riga con
  // ordine=999 è stata azzerata da un PATCH che non menzionava affatto `ordine`).
  // La tabella ha già `default 0` a livello di colonna, che copre il caso insert.
  ordine: z.number().optional(),
  immaginiContenuto: z.array(z.string()).max(2).optional(),
  archiviato: z.boolean().optional(),
  in_evidenza: z.boolean().optional(),
  correlati: z.array(z.string()).max(3).optional(),
});

export type Progetto = z.infer<typeof progettoSchema>;
