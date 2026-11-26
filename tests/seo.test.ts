import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  SITE_URL, canonico, datiStrutturatiStudio, immagineSocial, jsonPerScript, testoSemplice, tronca, valoreSeo, ETICHETTE_SEO, predefinitoSeo,
} from '../src/lib/seo';
import { pageContentSchema } from '../src/lib/validation/page-content';

describe('seo', () => {
  it('un campo vuoto o di soli spazi usa il valore predefinito, uno scritto vince', () => {
    expect(valoreSeo({}, 'home_titolo')).toContain('Roma');
    expect(valoreSeo({ home_titolo: '   ' }, 'home_titolo')).toBe(predefinitoSeo('home_titolo'));
    expect(valoreSeo({ home_titolo: ' Mio titolo ' }, 'home_titolo')).toBe('Mio titolo');
    expect(valoreSeo({ home_titolo: 42 }, 'home_titolo')).toBe(predefinitoSeo('home_titolo'));
  });

  it('ogni pagina principale ha titolo e descrizione predefiniti e modificabili dal pannello', () => {
    for (const pagina of ['home', 'studio', 'lavori', 'servizi', 'contatti']) {
      for (const campo of ['titolo', 'descrizione']) {
        expect(predefinitoSeo(`${pagina}_${campo}`), `${pagina}_${campo}`).not.toBe('');
        expect(ETICHETTE_SEO[`${pagina}_${campo}`], `${pagina}_${campo}`).toBeTruthy();
      }
    }
  });

  it('il canonico usa sempre il dominio ufficiale, senza barra finale né parametri', () => {
    expect(canonico('/')).toBe(`${SITE_URL}/`);
    expect(canonico('/studio/')).toBe(`${SITE_URL}/studio`);
    expect(canonico('/lavori/archivio-storico-eur')).toBe(`${SITE_URL}/lavori/archivio-storico-eur`);
  });

  it('testoSemplice toglie i tag, tronca non spezza le parole', () => {
    expect(testoSemplice('<p>Ciao&nbsp;<strong>mondo</strong></p>')).toBe('Ciao mondo');
    expect(testoSemplice(null)).toBe('');
    const lungo = 'parola '.repeat(60).trim();
    const corto = tronca(lungo, 160);
    expect(corto.length).toBeLessThanOrEqual(160);
    expect(corto.endsWith('…')).toBe(true);
    expect(corto).not.toMatch(/paro…$/);
    expect(tronca('breve')).toBe('breve');
  });

  it('per le anteprime social vale solo un indirizzo https completo', () => {
    expect(immagineSocial('https://x.supabase.co/a.jpg')).toBe('https://x.supabase.co/a.jpg');
    expect(immagineSocial('/images/bc-001.jpg')).toBeNull();
    expect(immagineSocial('javascript:alert(1)')).toBeNull();
    expect(immagineSocial(undefined)).toBeNull();
  });

  it('i dati strutturati non possono chiudere il tag script', () => {
    const dati = datiStrutturatiStudio({ sito_descrizione: '</script><script>alert(1)</script>' }, {});
    const json = jsonPerScript(dati);
    expect(json).not.toContain('</script>');
    expect(JSON.parse(json).description).toContain('</script>');
  });

  it('i dati strutturati riportano i contatti presenti e omettono quelli vuoti', () => {
    const dati = datiStrutturatiStudio({}, { email: 'a@b.it', telefono: '', instagram: '@studio', indirizzo: '' });
    expect(dati.email).toBe('a@b.it');
    expect(dati.telephone).toBeUndefined();
    expect(dati.sameAs).toEqual(['https://www.instagram.com/studio']);
    expect(dati.areaServed).toBe('Roma');
    expect(dati.address).toBeUndefined();
  });

  it('la pagina seo è salvabile dal pannello', () => {
    expect(pageContentSchema.safeParse({ page: 'seo', content: { home_titolo: 'x' } }).success).toBe(true);
  });

  it('robots non espone il pannello e punta alla sitemap del dominio ufficiale', () => {
    const src = readFileSync('src/pages/robots.txt.ts', 'utf-8');
    expect(src).toContain("'Disallow: /admin'");
    expect(src).toContain('/sitemap.xml');
    expect(readFileSync('astro.config.mjs', 'utf-8')).toContain("site: 'https://www.barbaracostantini.it'");
  });
});
