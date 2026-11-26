// src/pages/sitemap.xml.ts
// Elenco delle pagine per i motori di ricerca, letto dal database a ogni richiesta:
// un lavoro pubblicato dal pannello compare qui da solo, uno archiviato sparisce.
import type { APIRoute } from 'astro';
import { getProgetti } from '../lib/supabase-public';
import { SITE_URL } from '../lib/seo';

export const prerender = false;

const PAGINE = ['/', '/studio', '/lavori', '/servizi', '/contatti', '/privacy-policy', '/cookie-policy'];

function xml(testo: string): string {
  return testo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const GET: APIRoute = async () => {
  let lavori: string[] = [];
  try {
    lavori = (await getProgetti()).map((p) => `/lavori/${encodeURIComponent(p.slug)}`);
  } catch (err) {
    // Senza database la sitemap resta valida con le sole pagine fisse.
    console.error('[sitemap] getProgetti() ha fallito:', err);
  }
  const voci = [...PAGINE, ...lavori].map((p) => `  <url><loc>${xml(`${SITE_URL}${p === '/' ? '/' : p}`)}</loc></url>`);
  const corpo = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${voci.join('\n')}\n</urlset>\n`;
  return new Response(corpo, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  });
};
