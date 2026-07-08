// src/lib/supabase-public.ts
// Client Supabase pubblico (anon key, sola lettura) per le pagine pubbliche del sito
// (lavori, studio). NON usare mai qui createSupabaseServerClient (legato ai cookie di
// sessione admin) o createSupabaseAdminClient (service_role, bypassa la RLS): queste
// pagine sono pubbliche, senza utente autenticato, e devono passare solo dalla stessa
// via di lettura che userebbe un visitatore anonimo del sito.
//
// Le tabelle bc_projects/bc_team_members hanno policy RLS "*_public_read" con
// `using (true)` (vedi supabase/migrations/20260708100000_bc_cms_schema.sql, righe
// 43 e 62), quindi la anon key può leggerle senza autenticazione: non serve nessuna
// modifica alle policy per questo modulo.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_ANON_KEY);

export interface Sezione {
  titolo: string;
  sottotitolo: string;
  testi: string[];
}

export interface Immagine {
  src: string;
  label: string;
  aspetto?: 'h' | 'v';
}

export interface Metodo {
  testi: string[];
  citazione: string;
}

// Riga reale di bc_projects (vedi la migration citata sopra). NOTA: a differenza del
// vecchio array statico src/data/progetti.ts, qui NON esiste un campo
// `immaginiContenuto` (mai aggiunto allo schema né allo script di seed, vedi
// scripts/seed-bc-cms.mjs e src/lib/validation/progetto.ts usato dal CRUD admin) —
// i chiamanti vanno scritti per tollerarne l'assenza. `intro` è una stringa unica
// (i paragrafi originali sono stati uniti con "\n\n" dal seed), non più un array.
export interface Progetto {
  id: string;
  slug: string;
  titolo: string;
  committente: string | null;
  anno: string | null;
  tipo: 'horizontal' | 'vertical' | null;
  intro: string | null;
  sezioni: Sezione[];
  metodo: Metodo | null;
  immagini: Immagine[];
  ordine: number;
  // Non esiste come colonna in bc_projects (vedi la migration citata sopra): sarà
  // sempre `undefined` finché non verrà aggiunta allo schema in un task futuro. Il
  // campo resta tipato qui (opzionale) solo perché src/pages/lavori/[slug].astro lo
  // legge in modo difensivo (optional chaining) per le due sezioni "immagine
  // contenuto" del dettaglio progetto, che nel frattempo restano senza foto.
  immaginiContenuto?: string[];
}

export interface TeamMember {
  id: string;
  nome: string;
  ruolo: string | null;
  bio: string | null;
  foto_url: string | null;
  ordine: number;
}

export async function getProgetti(): Promise<Progetto[]> {
  const { data, error } = await supabase.from('bc_projects').select('*').order('ordine');
  if (error) throw error;
  return data ?? [];
}

export async function getProgetto(slug: string): Promise<Progetto> {
  const { data, error } = await supabase.from('bc_projects').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from('bc_team_members').select('*').order('ordine');
  if (error) throw error;
  return data ?? [];
}
