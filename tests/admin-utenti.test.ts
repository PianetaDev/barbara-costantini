// tests/admin-utenti.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

  it('ritorna false se la riga bc_admin_users non esiste (utente non ancora un admin)', async () => {
    const mockSupabase = {
      auth: { getUser: async () => ({ data: { user: { id: 'sconosciuto-id' } } }) },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null }) }) }),
      }),
    };
    const { checkIsSuperadmin } = await import('../src/lib/admin-roles');
    const result = await checkIsSuperadmin(mockSupabase as any, 'sconosciuto-id');
    expect(result).toBe(false);
  });
});

// Test a livello di endpoint per POST /api/admin/utenti/invite: finora questi due casi
// (chiamante non-superadmin, ruolo non valido) erano stati verificati solo manualmente
// contro Supabase reale (vedi report Task 12) — qui diventano regressione automatica in CI.
// createSupabaseAdminClient non viene mai invocato in nessuno di questi due casi (l'endpoint
// ritorna prima di arrivare a inviteUserByEmail), quindi il mock resta un vi.fn() vuoto:
// se venisse chiamato per errore in uno di questi path, il test lo noterebbe (nessun metodo
// mockato su cui appoggiarsi farebbe fallire la richiesta con un TypeError).
// vi.mock è issato in cima al file: le variabili usate dentro la factory devono
// essere dichiarate tramite vi.hoisted per essere già inizializzate quando la
// factory viene eseguita (altrimenti "Cannot access ... before initialization").
const { mockGetUser, mockFrom, mockCreateSupabaseAdminClient } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockCreateSupabaseAdminClient: vi.fn(),
}));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
  createSupabaseAdminClient: mockCreateSupabaseAdminClient,
}));

import { POST } from '../src/pages/api/admin/utenti/invite';

describe('POST /api/admin/utenti/invite', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockFrom.mockReset();
    mockCreateSupabaseAdminClient.mockReset();
  });

  it('ritorna 403 se chi chiama è autenticato ma non superadmin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'editor-id' } } });
    mockFrom.mockReturnValue({
      select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'editor' } }) }) }),
    });
    const request = new Request('http://localhost/api/admin/utenti/invite', {
      method: 'POST',
      body: JSON.stringify({ email: 'nuovo@example.com', role: 'editor' }),
    });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(403);
    expect(mockCreateSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it('ritorna 403 se non c\'è nessuna sessione (utente non autenticato)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = new Request('http://localhost/api/admin/utenti/invite', {
      method: 'POST',
      body: JSON.stringify({ email: 'nuovo@example.com', role: 'editor' }),
    });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(403);
    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockCreateSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it('ritorna 400 se il ruolo richiesto non è valido', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'super-id' } } });
    mockFrom.mockReturnValue({
      select: () => ({ eq: () => ({ single: async () => ({ data: { role: 'superadmin' } }) }) }),
    });
    const request = new Request('http://localhost/api/admin/utenti/invite', {
      method: 'POST',
      body: JSON.stringify({ email: 'nuovo@example.com', role: 'ceo' }),
    });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Ruolo non valido');
    expect(mockCreateSupabaseAdminClient).not.toHaveBeenCalled();
  });
});
