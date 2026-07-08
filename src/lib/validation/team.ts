// src/lib/validation/team.ts
import { z } from 'zod';

export const teamMemberSchema = z.object({
  nome: z.string().min(1, 'Nome obbligatorio'),
  ruolo: z.string().optional(),
  bio: z.string().optional(),
  // z.url() (top-level), non z.string().url(): quest'ultimo è deprecato in Zod v4
  // (segnalato da `astro check`) a favore della funzione top-level equivalente.
  foto_url: z.union([z.url(), z.literal('')]).optional(),
  // NOTA: `.optional()`, non `.default(0)` — stesso fix del Task 13
  // (src/lib/validation/progetto.ts). Questo schema viene usato anche con
  // `.partial()` nell'endpoint PATCH (src/pages/api/admin/team/[id].ts): un
  // `.default()` si applicherebbe comunque quando `ordine` è assente dal body,
  // PRIMA che `.partial()` lo renda "omissibile senza conseguenze", azzerando
  // silenziosamente l'ordine esistente in bc_team_members. La colonna DB ha già
  // `default 0` per il caso insert.
  ordine: z.number().optional(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;
