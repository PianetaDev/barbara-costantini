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
