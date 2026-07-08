// scripts/seed-bc-cms.mjs
//
// Seed una tantum delle tabelle CMS (bc_projects, bc_team_members, bc_page_content)
// con i contenuti reali attualmente hardcoded nel sito pubblico.
//
// Esecuzione: `node scripts/seed-bc-cms.mjs`
//
// Nota su TypeScript (vedi Task 16, punto 1 delle note operative):
// questo file importa `src/data/progetti.ts` con estensione esplicita `.ts`.
// Node non transpila TypeScript di suo in generale, ma dalla v22.6 (stabile senza
// flag dalla v23.6) supporta il "type-stripping" nativo per sintassi TS erasable
// (interface, alias di tipo, annotazioni di tipo) — esattamente quello che c'è in
// progetti.ts (nessun enum/namespace/parameter property che richiederebbe una vera
// trasformazione). Verificato empiricamente con `node scripts/_test-ts-import.mjs`
// su Node v25.6.1 (quella disponibile in questo ambiente): l'import funziona senza
// alcun flag né dipendenza aggiuntiva (niente tsx/ts-node in package.json, e non ce
// n'è bisogno). Se in futuro questo script venisse eseguito con un Node più vecchio
// privo di type-stripping, la soluzione più semplice resta aggiungere `tsx` come
// devDependency e lanciare `npx tsx scripts/seed-bc-cms.mjs` — non necessario oggi.
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PROGETTI } from '../src/data/progetti.ts';

// Carica .env manualmente (nessuna dipendenza dotenv nel repo) così che il comando
// resti esattamente `node scripts/seed-bc-cms.mjs` come da spec, senza richiedere
// `--env-file=.env`. Non stampa né logga i valori.
function loadDotEnv() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const envPath = join(__dirname, '..', '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Il .env di questo repo usa valori tra doppi apici (es. SUPABASE_URL="https://...").
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (key && !(key in process.env)) process.env[key] = value;
  }
}
loadDotEnv();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Mancano SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (vedi .env).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seedProjects() {
  for (const [index, p] of PROGETTI.entries()) {
    const { error } = await supabase.from('bc_projects').upsert(
      {
        slug: p.slug,
        titolo: p.titolo,
        committente: p.committente,
        tipo: p.tipo,
        intro: p.intro.join('\n\n'),
        sezioni: p.sezioni,
        metodo: p.metodo,
        immagini: p.immagini,
        ordine: index,
      },
      { onConflict: 'slug' }
    );
    if (error) {
      console.error(`Errore su ${p.slug}:`, error.message);
    } else {
      console.log(`✓ ${p.slug}`);
    }
  }
}

// Placeholder reali, identici a quelli hardcoded in src/pages/studio.astro (Task 5),
// in attesa che vengano sostituiti con i dati veri via CMS (Task 15 già copre l'editing).
const MEMBRI_PLACEHOLDER = [
  { nome: 'Nome Cognome 1', ruolo: 'Ruolo', bio: 'Lorem ipsum...', ordine: 0 },
  { nome: 'Nome Cognome 2', ruolo: 'Ruolo', bio: 'Lorem ipsum...', ordine: 1 },
  { nome: 'Nome Cognome 3', ruolo: 'Ruolo', bio: 'Lorem ipsum...', ordine: 2 },
];

// Nota su idempotenza (Task 16, punto 3 delle note operative): bc_team_members non ha
// alcun campo univoco naturale (a differenza di bc_projects.slug o bc_page_content.page),
// quindi `upsert(..., { onConflict: ... })` non è applicabile direttamente. Aggiungere un
// vincolo unique su `nome` via una nuova migrazione sarebbe più invasivo di quanto serva
// per un seed di placeholder (e "Nome Cognome 1/2/3" non è comunque un buon candidato a
// unicità nel mondo reale, dove più persone potrebbero chiamarsi allo stesso modo).
// Strategia scelta: "esiste già una riga con questo nome esatto? salta l'insert" — scoped
// esclusivamente ai 3 nomi placeholder esatti sopra. Rieseguire lo script più volte non
// duplica quindi le righe: la prima esecuzione inserisce i 3 membri, le successive li
// trovano già presenti e non inseriscono nulla.
async function seedTeamPlaceholder() {
  for (const m of MEMBRI_PLACEHOLDER) {
    const { data: esistenti, error: selectError } = await supabase
      .from('bc_team_members')
      .select('id')
      .eq('nome', m.nome)
      .limit(1);
    if (selectError) {
      console.error(`Errore lettura team ${m.nome}:`, selectError.message);
      continue;
    }
    if (esistenti && esistenti.length > 0) {
      console.log(`= team (già presente, salto): ${m.nome}`);
      continue;
    }
    const { error } = await supabase.from('bc_team_members').insert(m);
    if (error) {
      console.error(`Errore su team ${m.nome}:`, error.message);
    } else {
      console.log(`✓ team: ${m.nome}`);
    }
  }
  console.log('✓ team (placeholder, da sostituire via CMS)');
}

// Estensione obbligatoria (review Task 15): senza almeno una riga per pagina, il form
// di src/pages/admin/pagine/[page].astro si renderizza vuoto (i campi sono generati
// dalle chiavi già presenti in `content`, zero chiavi = zero campi editabili). Seed
// minimale con SOLO `titolo`, preso letteralmente dai file pubblici (non inventato):
// - home: il testo dell'h1 in src/pages/index.astro prima del filler lorem ipsum
//   ("Barbara Costantini Restauro"), identico al <title> passato a BaseLayout.
// - studio: idem da src/pages/studio.astro ("Lo studio").
// - servizi: idem da src/pages/servizi.astro ("I servizi").
// - contatti: l'h1 in src/pages/contatti.astro è già pulito, senza lorem ("Contatti").
// Il resto del contenuto di ciascuna pagina (sezioni, testi lorem ipsum, membri team,
// gruppi servizi, ecc.) è volutamente fuori scope: verrà ricollegato nel Task 17.
const PAGINE_CONTENT = [
  { page: 'home', content: { titolo: 'Barbara Costantini Restauro' } },
  { page: 'studio', content: { titolo: 'Lo studio' } },
  { page: 'servizi', content: { titolo: 'I servizi' } },
  { page: 'contatti', content: { titolo: 'Contatti' } },
];

async function seedPageContent() {
  for (const p of PAGINE_CONTENT) {
    const { error } = await supabase.from('bc_page_content').upsert(p, { onConflict: 'page' });
    if (error) {
      console.error(`Errore su page_content ${p.page}:`, error.message);
    } else {
      console.log(`✓ page_content: ${p.page}`);
    }
  }
}

async function seed() {
  await seedProjects();
  await seedTeamPlaceholder();
  await seedPageContent();
}

seed();
