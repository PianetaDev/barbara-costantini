// tests/admin-utenti.test.ts
import { describe, it, expect, vi } from 'vitest';

describe('invito utenti', () => {
  it('rifiuta invito se chi chiama non è superadmin', async () => {
    const mockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: 'editor-id' } } }) },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'editor' } }) }) }),
      }),
    };
    const { checkIsSuperadmin } = await import('../src/lib/admin-roles');
    const result = await checkIsSuperadmin(mockSupabase as any, 'editor-id');
    expect(result).toBe(false);
  });

  it('conferma superadmin per ruolo corretto', async () => {
    const mockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: 'super-id' } } }) },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'superadmin' } }) }) }),
      }),
    };
    const { checkIsSuperadmin } = await import('../src/lib/admin-roles');
    const result = await checkIsSuperadmin(mockSupabase as any, 'super-id');
    expect(result).toBe(true);
  });
});
