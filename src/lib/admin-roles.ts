// src/lib/admin-roles.ts
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Verifica se l'utente `userId` ha ruolo 'superadmin' in bc_admin_users.
 * Usata per proteggere le operazioni riservate al superadmin (gestione utenti):
 * l'editor può accedere all'area admin ma non invitare/gestire altri utenti.
 */
export async function checkIsSuperadmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data } = await supabase.from('bc_admin_users').select('role').eq('id', userId).single();
  return data?.role === 'superadmin';
}

/**
 * Verifica che l'utente `userId` sia in bc_admin_users (admin o superadmin).
 * Usata per proteggere endpoint e pagine admin: un account Supabase qualsiasi
 * (anche condiviso con altre app del progetto) non basta.
 */
export async function checkIsAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  let { data, error } = await supabase.from('bc_admin_users').select('id').eq('id', userId).maybeSingle();
  if (error) {
    // Un errore passeggero del database non deve far sembrare «non abilitato» un admin vero:
    // si riprova una volta e si lascia traccia nei log.
    console.error('[checkIsAdmin] errore, riprovo:', error.message);
    ({ data, error } = await supabase.from('bc_admin_users').select('id').eq('id', userId).maybeSingle());
    if (error) console.error('[checkIsAdmin] errore anche al secondo tentativo:', error.message);
  }
  return !!data;
}
