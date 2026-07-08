// tests/admin-reset-password.test.ts
//
// Rete di sicurezza automatica per il bug risolto in "fix: risolve reset-password
// rotto — mismatch PKCE server/client e redirect URL non whitelisted": lo scambio
// codice→sessione (exchangeCodeForSession) deve avvenire con lo stesso client
// server-side usato da resetPasswordForEmail. In produzione questo si era rotto
// silenziosamente con "PKCE code verifier not found in storage" — questi test lo
// esercitano senza bisogno di un progetto Supabase reale (nessun mock di modulo:
// exchangeRecoveryCode riceve il client come parametro proprio per essere testabile
// così, vedi src/lib/supabase.ts).
import { describe, it, expect, vi } from 'vitest';
import { exchangeRecoveryCode } from '../src/lib/supabase';

describe('exchangeRecoveryCode', () => {
  it('ritorna null quando exchangeCodeForSession riesce', async () => {
    const fakeSupabase = {
      auth: { exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }) },
    };
    const result = await exchangeRecoveryCode(fakeSupabase, 'some-code');
    expect(result).toBeNull();
    expect(fakeSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('some-code');
  });

  it('ritorna il messaggio di errore quando lo scambio fallisce (es. code verifier mancante — il bug appena risolto)', async () => {
    const fakeSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          error: { message: 'PKCE code verifier not found in storage' },
        }),
      },
    };
    const result = await exchangeRecoveryCode(fakeSupabase, 'some-code');
    expect(result).toBe('PKCE code verifier not found in storage');
  });

  it('cattura eccezioni impreviste (es. errore di rete) invece di farle propagare', async () => {
    const fakeSupabase = {
      auth: {
        exchangeCodeForSession: vi.fn().mockRejectedValue(new Error('network down')),
      },
    };
    const result = await exchangeRecoveryCode(fakeSupabase, 'some-code');
    expect(result).toContain('errore imprevisto');
  });
});
