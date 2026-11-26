// src/lib/seo.ts
// Dati per i motori di ricerca e per gli assistenti AI: titoli, descrizioni, indirizzo
// canonico, anteprime social, dati strutturati, sitemap, robots e llms.txt.
//
// I testi si modificano dal pannello (Admin → Strumenti → SEO e ricerca) e stanno in
// bc_page_content alla riga `seo`. Ogni campo ha un valore predefinito qui sotto: se nel
// pannello resta vuoto, il sito usa quello.

/** Indirizzo ufficiale del sito: quello che Google deve considerare «l'originale». */
export const SITE_URL = 'https://www.barbaracostantini.it';
export const NOME_SITO = 'Barbara Costantini Restauro';

export type ChiaveSeo = 'home' | 'studio' | 'lavori' | 'servizi' | 'contatti';

const PREDEFINITI: Record<string, string> = {
  sito_descrizione:
    'Laboratorio di restauro a Roma: conservazione e restauro di libri, documenti d’archivio, opere d’arte su carta e fotografie per musei, archivi, biblioteche e collezioni private.',
  zona: 'Roma',
  home_titolo: 'Barbara Costantini Restauro — Restauro di carta, libri, archivi e fotografie a Roma',
  home_descrizione:
    'Laboratorio di restauro a Roma: conservazione e restauro di libri, documenti d’archivio, opere d’arte su carta e fotografie per musei, archivi, biblioteche e collezioni private.',
  studio_titolo: 'Lo studio — Barbara Costantini Restauro, Roma',
  studio_descrizione:
    'Lo studio di restauro fondato da Barbara Costantini a Roma: un gruppo di restauratrici specializzate in beni librari, archivistici, fotografici e opere d’arte su carta.',
  lavori_titolo: 'Lavori di restauro — Barbara Costantini Restauro',
  lavori_descrizione:
    'Una selezione di interventi di conservazione e restauro su libri, archivi, fotografie e opere su carta, realizzati per musei, fondazioni e istituzioni culturali.',
  servizi_titolo: 'Servizi di conservazione e restauro — Barbara Costantini Restauro',
  servizi_descrizione:
    'Restauro di beni archivistici e librari, opere d’arte su carta, grandi formati e fotografie; progettazione degli interventi, condition report e montaggi conservativi.',
  contatti_titolo: 'Contatti — Barbara Costantini Restauro, Roma',
  contatti_descrizione:
    'Contatta il laboratorio di restauro di Barbara Costantini a Roma per un preventivo, una valutazione dello stato di conservazione o un condition report.',
};

/** Etichette del pannello: l'ordine qui è l'ordine dei campi nel modulo. */
export const ETICHETTE_SEO: Record<string, string> = {
  sito_descrizione: 'Chi siete in una frase (usata dove una pagina non ha una descrizione sua, e da assistenti AI come ChatGPT)',
  zona: 'Città o zona in cui lavorate (es. Roma)',
  social_immagine: 'Immagine mostrata quando si condivide il sito su WhatsApp e social (usa il pulsante Carica)',
  home_titolo: 'Home — titolo su Google (max 60 caratteri circa)',
  home_descrizione: 'Home — descrizione su Google (max 160 caratteri circa)',
  studio_titolo: 'Studio — titolo su Google',
  studio_descrizione: 'Studio — descrizione su Google',
  lavori_titolo: 'Lavori — titolo su Google',
  lavori_descrizione: 'Lavori — descrizione su Google',
  servizi_titolo: 'Servizi — titolo su Google',
  servizi_descrizione: 'Servizi — descrizione su Google',
  contatti_titolo: 'Contatti — titolo su Google',
  contatti_descrizione: 'Contatti — descrizione su Google',
};

/** Valore di un campo SEO: quello del pannello se scritto, altrimenti il predefinito. */
export function valoreSeo(seo: Record<string, unknown>, chiave: string): string {
  const v = seo[chiave];
  if (typeof v === 'string' && v.trim()) return v.trim();
  return PREDEFINITI[chiave] ?? '';
}

/** Valori predefiniti, per mostrarli nel pannello come suggerimento. */
export function predefinitoSeo(chiave: string): string {
  return PREDEFINITI[chiave] ?? '';
}

/** Toglie i tag HTML e gli spazi doppi da un testo scritto con l'editor. */
export function testoSemplice(html: unknown): string {
  if (typeof html !== 'string') return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Accorcia a una lunghezza adatta alle descrizioni, senza spezzare le parole. */
export function tronca(testo: string, max = 160): string {
  if (testo.length <= max) return testo;
  const taglio = testo.slice(0, max - 1);
  const spazio = taglio.lastIndexOf(' ');
  return `${(spazio > 60 ? taglio.slice(0, spazio) : taglio).replace(/[\s,;:.–—-]+$/, '')}…`;
}

/** Indirizzo completo di una pagina o di un'immagine del sito. */
export function urlAssoluto(percorso: string): string {
  if (/^https?:\/\//i.test(percorso)) return percorso;
  return `${SITE_URL}${percorso.startsWith('/') ? '' : '/'}${percorso}`;
}

/** Indirizzo canonico: sempre con www, senza parametri e senza barra finale (tranne la home). */
export function canonico(pathname: string): string {
  const pulito = pathname.replace(/\/+$/, '');
  return `${SITE_URL}${pulito === '' ? '/' : pulito}`;
}

/** Un'immagine va bene per le anteprime social solo se ha un indirizzo https completo. */
export function immagineSocial(src: unknown): string | null {
  return typeof src === 'string' && /^https:\/\//i.test(src.trim()) ? src.trim() : null;
}

/** JSON sicuro dentro un tag <script>: «<» non può chiudere lo script. */
export function jsonPerScript(dati: unknown): string {
  return JSON.stringify(dati).replace(/</g, '\\u003c');
}

type Contatti = Record<string, unknown>;

/** Dati strutturati dello studio (schema.org), letti da Google per le ricerche locali. */
export function datiStrutturatiStudio(seo: Record<string, unknown>, contatti: Contatti): Record<string, unknown> {
  const testo = (k: string) => (typeof contatti[k] === 'string' ? (contatti[k] as string).trim() : '');
  const instagram = testo('instagram').replace(/^@/, '');
  const zona = valoreSeo(seo, 'zona');
  const immagine = immagineSocial(seo.social_immagine);
  const dati: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#studio`,
    name: NOME_SITO,
    url: `${SITE_URL}/`,
    description: valoreSeo(seo, 'sito_descrizione'),
    founder: { '@type': 'Person', name: 'Barbara Costantini' },
    knowsAbout: [
      'Restauro della carta',
      'Restauro di libri e manoscritti',
      'Conservazione di beni archivistici',
      'Restauro di fotografie',
      'Restauro di opere d’arte su carta',
      'Condition report',
    ],
  };
  if (zona) dati.areaServed = zona;
  if (testo('email')) dati.email = testo('email');
  if (testo('telefono')) dati.telephone = testo('telefono');
  if (instagram) dati.sameAs = [`https://www.instagram.com/${instagram}`];
  if (immagine) dati.image = immagine;
  return dati;
}
