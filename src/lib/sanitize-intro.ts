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
