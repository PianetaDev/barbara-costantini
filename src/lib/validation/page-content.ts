// src/lib/validation/page-content.ts
import { z } from 'zod';

export const pageContentSchema = z.object({
  page: z.enum(['home', 'studio', 'servizi', 'contatti', 'lavori', 'privacy-policy', 'cookie-policy', 'footer']),
  content: z.record(z.string(), z.unknown()),
});

export type PageContent = z.infer<typeof pageContentSchema>;
