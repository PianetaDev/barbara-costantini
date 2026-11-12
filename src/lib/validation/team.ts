import { z } from 'zod';

export const teamMemberSchema = z.object({
  nome: z.string().min(1, 'Nome obbligatorio').max(200),
  ruolo: z.string().max(300).optional(),
  bio: z.string().max(20_000).optional(),
  // Solo https (Storage) o vuoto: niente http in chiaro né schemi strani.
  foto_url: z.union([z.url({ protocol: /^https$/ }), z.literal('')]).optional(),
  ordine: z.number().int().min(0).max(10_000).optional(),
  archiviato: z.boolean().optional(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;
