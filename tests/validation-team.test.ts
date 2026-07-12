// tests/validation-team.test.ts
import { describe, it, expect } from 'vitest';
import { teamMemberSchema } from '../src/lib/validation/team';

describe('validazione team member', () => {
  it('accetta un membro valido', () => {
    const result = teamMemberSchema.safeParse({
      nome: 'Barbara Costantini',
      ruolo: 'Restauratrice',
      bio: 'Bio reale',
      ordine: 0,
    });
    expect(result.success).toBe(true);
  });

  it('rifiuta nome vuoto', () => {
    const result = teamMemberSchema.safeParse({ nome: '', ruolo: 'Restauratrice', ordine: 0 });
    expect(result.success).toBe(false);
  });

  // Regressione (stesso bug del Task 13, vedi tests/validation-progetto.test.ts): un
  // update parziale che omette `ordine` non deve iniettarlo con un default, altrimenti
  // un PATCH che non tocca `ordine` sovrascriverebbe silenziosamente il valore esistente
  // in bc_team_members. `ordine` è `.optional()`, non `.default()`.
  it('un update parziale che omette ordine non lo inietta con un default', () => {
    const result = teamMemberSchema.partial().safeParse({ bio: 'solo bio' });
    expect(result.success).toBe(true);
    expect(result.success && result.data).toEqual({ bio: 'solo bio' });
    expect(result.success && 'ordine' in result.data).toBe(false);
  });

  it('accetta archiviato', () => {
    const result = teamMemberSchema.partial().safeParse({ archiviato: true });
    expect(result.success).toBe(true);
  });

  it('un update parziale che omette archiviato non lo inietta con un default', () => {
    const result = teamMemberSchema.partial().safeParse({ nome: 'Solo nome' });
    expect(result.success).toBe(true);
    expect(result.success && 'archiviato' in result.data).toBe(false);
  });
});
