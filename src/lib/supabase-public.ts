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
//
// NOTA rischio (code review Task 17, punto 4 — non risolto qui, solo documentato):
// queste funzioni interrogano Supabase in modo sincrono ad ogni richiesta, senza
// alcun caching/ISR/timeout esplicito. Un blip di rete o un rallentamento di
// Supabase si traduce 1:1 in una risposta lenta (o, se fallisce, in un errore che i
// chiamanti devono gestire — vedi src/pages/lavori/index.astro, src/pages/studio.astro,
// src/pages/lavori/[slug].astro) per ogni visitatore di /lavori, /lavori/[slug] e
// /studio. Nessun retry né circuit breaker. Da tenere in considerazione nella PR del
// prossimo task (caching/ISR), fuori scope qui.
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

// Riga reale di bc_projects (vedi la migration citata sopra). `intro` è una stringa
// unica (i paragrafi originali sono stati uniti con "\n\n" dal seed), non più un
// array come nel vecchio array statico src/data/progetti.ts.
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
  immaginiContenuto: string[];
  archiviato: boolean;
}

export interface TeamMember {
  id: string;
  nome: string;
  ruolo: string | null;
  bio: string | null;
  foto_url: string | null;
  ordine: number;
  archiviato: boolean;
}

// Riga grezza da Supabase (snake_case per immagini_contenuto, non ancora mappata).
type ProgettoRow = Omit<Progetto, 'immaginiContenuto'> & { immagini_contenuto: string[] };

function mapProgettoRow(row: ProgettoRow): Progetto {
  const { immagini_contenuto, ...resto } = row;
  return { ...resto, immaginiContenuto: immagini_contenuto };
}

export async function getProgetti(): Promise<Progetto[]> {
  const { data, error } = await supabase.from('bc_projects').select('*').eq('archiviato', false).order('ordine');
  if (error) throw error;
  return (data ?? []).map(mapProgettoRow);
}

// Codice errore PostgREST per ".single() con 0 (o >1) righe" — è così che si
// distingue "slug inesistente" da un errore Supabase generico (rete, downtime,
// rate limit). Esportato così il chiamante (src/pages/lavori/[slug].astro) non
// deve reinventare/duplicare questa stringa magica.
export const ERRORE_RIGA_NON_TROVATA = 'PGRST116';

export async function getProgetto(slug: string): Promise<Progetto> {
  const { data, error } = await supabase.from('bc_projects').select('*').eq('slug', slug).eq('archiviato', false).single();
  if (error) throw error;
  return mapProgettoRow(data);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from('bc_team_members').select('*').eq('archiviato', false).order('ordine');
  if (error) throw error;
  return data ?? [];
}

export async function getPageContent(page: string): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('bc_page_content')
    .select('content')
    .eq('page', page)
    .single();
  return (data?.content ?? {}) as Record<string, string>;
}
