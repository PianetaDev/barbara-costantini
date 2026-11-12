// src/lib/validation/page-content.ts
import { z } from 'zod';

export const PAGINE_GESTITE = ['home', 'studio', 'servizi', 'contatti', 'lavori', 'privacy-policy', 'cookie-policy', 'footer'] as const;

// Limite al peso del contenuto di una pagina: i testi del sito stanno in pochi KB; oltre
// questa soglia è un errore o un abuso (il JSON finisce in ogni render della pagina).
export const MAX_CONTENT_BYTES = 200_000;

export const pageContentSchema = z.object({
  page: z.enum(PAGINE_GESTITE),
  content: z
    .record(z.string().max(64), z.unknown())
    .refine((c) => JSON.stringify(c).length <= MAX_CONTENT_BYTES, { message: 'Contenuto troppo grande' }),
});

export type PageContent = z.infer<typeof pageContentSchema>;
