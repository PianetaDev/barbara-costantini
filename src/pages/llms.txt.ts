// src/pages/llms.txt.ts
// Riassunto del sito in testo semplice per gli assistenti AI (proposta llmstxt.org):
// chi è lo studio, cosa fa, i lavori pubblicati e i contatti. Si compone dal database,
// quindi segue da solo le modifiche fatte nel pannello.
import type { APIRoute } from 'astro';
import { getPageContent, getProgetti } from '../lib/supabase-public';
import { NOME_SITO, SITE_URL, testoSemplice, valoreSeo } from '../lib/seo';

export const prerender = false;

/** Una riga sola, senza caratteri che romperebbero un link Markdown. */
function riga(testo: unknown): string {
  return testoSemplice(testo).replace(/[\[\]]/g, '');
}

export const GET: APIRoute = async () => {
  const [seo, servizi, contatti] = await Promise.all([
    getPageContent('seo').catch(() => ({})),
    getPageContent('servizi').catch(() => ({})),
    getPageContent('contatti').catch(() => ({})),
  ]) as Record<string, any>[];
  let lavori: Awaited<ReturnType<typeof getProgetti>> = [];
  try {
    lavori = await getProgetti();
  } catch (err) {
    console.error('[llms.txt] getProgetti() ha fallito:', err);
  }

  const zona = valoreSeo(seo, 'zona');
  const righe: string[] = [`# ${NOME_SITO}`, '', `> ${valoreSeo(seo, 'sito_descrizione')}`, ''];
  if (zona) righe.push(`Sede e zona di lavoro: ${zona}.`, '');

  righe.push('## Pagine', '');
  righe.push(`- [Lo studio](${SITE_URL}/studio): chi siamo, formazione ed esperienza delle restauratrici`);
  righe.push(`- [Lavori](${SITE_URL}/lavori): interventi di conservazione e restauro realizzati`);
  righe.push(`- [Servizi](${SITE_URL}/servizi): cosa offre il laboratorio`);
  righe.push(`- [Contatti](${SITE_URL}/contatti): come richiedere un preventivo o una valutazione`, '');

  const gruppi = Array.isArray(servizi.gruppi) ? servizi.gruppi : [];
  if (gruppi.length) {
    righe.push('## Servizi', '');
    for (const g of gruppi) {
      const titolo = riga(g?.titolo);
      if (!titolo) continue;
      const voci = (Array.isArray(g?.servizi) ? g.servizi : []).map((v: any) => riga(v?.corpo)).filter(Boolean);
      righe.push(`- ${titolo}${voci.length ? `: ${voci.join(' ')}` : ''}`);
    }
    righe.push('');
  }

  if (lavori.length) {
    righe.push('## Lavori', '');
    for (const p of lavori) {
      const dettagli = [riga(p.committente), riga(p.anno)].filter(Boolean).join(', ');
      righe.push(`- [${riga(p.titolo)}](${SITE_URL}/lavori/${encodeURIComponent(p.slug)})${dettagli ? `: ${dettagli}` : ''}`);
    }
    righe.push('');
  }

  const recapiti = [
    riga(contatti.email) && `Email: ${riga(contatti.email)}`,
    riga(contatti.telefono) && `Telefono: ${riga(contatti.telefono)}`,
    riga(contatti.instagram) && `Instagram: ${riga(contatti.instagram)}`,
    riga(contatti.indirizzo) && `Indirizzo: ${riga(contatti.indirizzo)}`,
  ].filter(Boolean) as string[];
  if (recapiti.length) righe.push('## Contatti', '', ...recapiti.map((r) => `- ${r}`), '');

  return new Response(righe.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  });
};
