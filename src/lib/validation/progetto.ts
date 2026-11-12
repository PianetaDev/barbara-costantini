import { z } from 'zod';

const testo = (max: number) => z.string().max(max);

export const sezioneSchema = z.object({
  titolo: testo(300),
  sottotitolo: testo(300),
  testi: z.array(testo(20_000)).max(50),
});

// I blocchi del corpo pagina sono oggetti liberi (testo, immagine, citazione...): si
// limita solo il peso complessivo, il rendering pubblico li tratta come testo (mai HTML).
export const blockSchema = z.record(z.string(), z.any());

// Un'immagine è un percorso del sito (/images/...) oppure un URL https (Storage).
// Niente javascript:, data: o http in chiaro.
export const srcImmagineSchema = z
  .string()
  .max(2000)
  .refine((s) => s === '' || s.startsWith('/') || s.startsWith('https://'), {
    message: 'Immagine non valida: usa il pulsante Carica',
  });

export const immagineSchema = z.object({
  src: srcImmagineSchema,
  label: testo(300),
  aspetto: z.enum(['h', 'v']).optional(),
});

// Lo slug finisce nell'indirizzo della pagina (/lavori/<slug>): solo minuscole, numeri e trattini.
export const slugSchema = z
  .string()
  .min(1, 'Slug obbligatorio')
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Indirizzo non valido: solo lettere minuscole, numeri e trattini (es. restauro-codice)');

/** Trasforma un titolo in uno slug valido ("Lavoro test 2" → "lavoro-test-2"). */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export const progettoSchema = z.object({
  slug: slugSchema,
  titolo: z.string().min(1, 'Titolo obbligatorio').max(300),
  committente: testo(300).optional(),
  anno: testo(40).optional(),
  tipo: z.enum(['horizontal', 'vertical']),
  intro: testo(50_000).optional(),
  sezioni: z.array(sezioneSchema).max(50),
  blocks: z
    .array(blockSchema)
    .max(200)
    .refine((b) => JSON.stringify(b).length <= 500_000, { message: 'Corpo pagina troppo grande' })
    .optional(),
  metodo: z.object({ testi: z.array(testo(20_000)).max(50), citazione: testo(2000) }).optional(),
  immagini: z.array(immagineSchema).max(100),
  ordine: z.number().int().min(0).max(10_000).optional(),
  immaginiContenuto: z.array(srcImmagineSchema).max(2).optional(),
  archiviato: z.boolean().optional(),
  in_evidenza: z.boolean().optional(),
  correlati: z.array(z.string().max(120)).max(3).optional(),
});

export type Progetto = z.infer<typeof progettoSchema>;
