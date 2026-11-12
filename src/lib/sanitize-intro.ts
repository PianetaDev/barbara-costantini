// src/lib/sanitize-intro.ts
//
// `bc_projects.intro` è HTML prodotto da RichTextEditor.vue (Tiptap + StarterKit),
// non testo semplice — vedi il commento in RichTextEditor.vue riga 18. Va sanificato
// sia in scrittura (src/pages/api/admin/progetti/[id].ts, prima di salvare su
// Supabase: alcuni admin in bc_admin_users hanno ruolo "editor", non solo
// superadmin, quindi l'input non è comunque fidato al 100%) sia in lettura
// (src/pages/lavori/[slug].astro, prima di un `set:html` pubblico: quel punto è il
// vero confine di sicurezza verso i visitatori anonimi, indipendentemente da come il
// contenuto sia finito nel DB — es. una riga toccata a mano su Supabase bypasserebbe
// la sanificazione in scrittura).
//
// L'allowlist riflette esattamente cosa StarterKit può produrre (bold/italic sono gli
// unici pulsanti nella toolbar, ma StarterKit abilita anche input rule per
// heading/blockquote/liste/code block/hr): nessun tag o attributo fuori da questo
// elenco può comparire nell'HTML di Tiptap in condizioni normali, quindi qualunque
// altra cosa nell'input è per definizione non generata dall'editor.
import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'p', 'strong', 'em', 's', 'code', 'pre',
  'blockquote', 'ul', 'ol', 'li', 'br', 'hr',
  'h1', 'h2', 'h3',
];

export function sanitizeIntroHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {},
  });
}

// Privacy e Cookie Policy: l'admin incolla HTML (campo html_body) che finisce in un
// `set:html` pubblico. Più permissivo dell'intro (link, tabelle, titoli) ma senza script,
// stili, iframe, attributi on* né URL javascript:.
const LEGAL_TAGS = [
  ...ALLOWED_TAGS,
  'h4', 'h5', 'h6', 'a', 'b', 'i', 'u', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

export function sanitizeLegalHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: LEGAL_TAGS,
    // id sui titoli: servono ai link interni (#sezione) dentro la policy.
    allowedAttributes: { h1: ['id'], h2: ['id'], h3: ['id'], h4: ['id'], a: ['href', 'title', 'target', 'rel'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    },
  });
}

// Blocchi «Testo» del corpo pagina dei lavori: l'area di scrittura produce un po' di HTML
// (grassetto, corsivo, a capo). Si tiene solo quello; tutto il resto viene tolto.
export function sanitizeBlockText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['b', 'strong', 'i', 'em', 'br', 'p', 'div'],
    allowedAttributes: {},
  });
}
