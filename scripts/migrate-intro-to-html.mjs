// scripts/migrate-intro-to-html.mjs
//
// Migrazione una tantum di bc_projects.intro dal formato testo-semplice scritto da
// scripts/seed-bc-cms.mjs (paragrafi uniti con "\n\n") al formato HTML reale che
// RichTextEditor.vue (Tiptap) produce e che src/pages/lavori/[slug].astro ora si
// aspetta (vedi commento in quel file e in src/lib/sanitize-intro.ts).
//
// Senza questa migrazione, la prima modifica di un `intro` esistente dal form admin
// sovrascriverebbe il testo semplice con HTML — ma finché non viene toccato, le 12
// righe reali resterebbero testo semplice e sparirebbero i paragrafi (nessun altro
// separatore che l'HTML riconosca), dato che la pagina pubblica ora fa `set:html`
// diretto invece di splittare su "\n\n".
//
// Idempotente: una riga il cui `intro` contiene già un tag HTML (`<`) viene saltata,
// quindi rieseguire lo script non fa danni.
//
// Esecuzione: `node scripts/migrate-intro-to-html.mjs`
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function testoSempliceAHtml(intro) {
  return intro
    .split('\n\n')
    .map((paragrafo) => paragrafo.trim())
    .filter(Boolean)
    .map((paragrafo) => `<p>${escapeHtml(paragrafo)}</p>`)
    .join('');
}

async function migra() {
  const { data: righe, error } = await supabase.from('bc_projects').select('id, slug, intro');
  if (error) {
    console.error('Errore lettura bc_projects:', error.message);
    process.exit(1);
  }

  for (const riga of righe) {
    if (!riga.intro || riga.intro.includes('<')) {
      console.log(`= ${riga.slug} (già HTML o vuoto, salto)`);
      continue;
    }
    const introHtml = testoSempliceAHtml(riga.intro);
    const { error: updateError } = await supabase
      .from('bc_projects')
      .update({ intro: introHtml })
      .eq('id', riga.id);
    if (updateError) {
      console.error(`Errore su ${riga.slug}:`, updateError.message);
    } else {
      console.log(`✓ ${riga.slug}`);
    }
  }
}

migra();
