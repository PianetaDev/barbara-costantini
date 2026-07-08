// tests/immagini-ottimizzate.test.ts
// Task 8: verifica che le immagini reali di progetto non siano più servite come
// <img> grezzo da public/images/, ma tramite il componente <Image> di astro:assets
// (ottimizzazione build-time via sharp: resize + webp).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function elencaFileRicorsivo(dir: string, estensioni: string[]): string[] {
  const risultati: string[] = [];
  for (const nome of readdirSync(dir)) {
    const percorso = join(dir, nome);
    const info = statSync(percorso);
    if (info.isDirectory()) {
      risultati.push(...elencaFileRicorsivo(percorso, estensioni));
    } else if (estensioni.some((ext) => nome.endsWith(ext))) {
      risultati.push(percorso);
    }
  }
  return risultati;
}

describe('ottimizzazione immagini', () => {
  it('lavori/[slug].astro usa il componente Image invece di <img> per le immagini progetto', () => {
    const src = readFileSync('src/pages/lavori/[slug].astro', 'utf-8');
    expect(src).toMatch(/import\s*\{[^}]*\bImage\b[^}]*\}\s*from\s*'astro:assets'/);
    // immaginiContenuto (grande + due affiancate) passano da risolviImmagine() a <Image src=...>
    expect(src).toMatch(/<Image[^>]+src=\{risolviImmagine\(/);
  });

  it('lavori/[slug].astro pre-ottimizza le immagini del carosello Vue con getImage prima di passarle come prop', () => {
    const src = readFileSync('src/pages/lavori/[slug].astro', 'utf-8');
    // CaroselloImmagini.vue non può usare <Image> (componente compilato solo per .astro),
    // quindi le immagini gli arrivano già ottimizzate (webp) via getImage() lato server.
    expect(src).toMatch(/import\s*\{[^}]*\bgetImage\b[^}]*\}\s*from\s*'astro:assets'/);
    expect(src).toContain('<CaroselloImmagini');
  });

  it('nessun file .astro sotto src/ usa più <img> grezzo per immagini reali del sito', () => {
    const fileAstro = elencaFileRicorsivo('src', ['.astro']);
    const offenders: string[] = [];
    for (const file of fileAstro) {
      const contenuto = readFileSync(file, 'utf-8');
      if (/<img[\s>]/.test(contenuto)) {
        offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('le pagine principali (home, studio, contatti, servizi, lavori) importano risolviImmagine + Image', () => {
    const pagine = [
      'src/pages/index.astro',
      'src/pages/studio.astro',
      'src/pages/contatti.astro',
      'src/pages/servizi.astro',
      'src/pages/lavori/index.astro',
    ];
    for (const pagina of pagine) {
      const src = readFileSync(pagina, 'utf-8');
      expect(src, `${pagina} dovrebbe importare Image da astro:assets`).toContain(
        "import { Image } from 'astro:assets'",
      );
    }
  });

  it('le sezioni riusabili (SectionBio, SectionTeam, SectionServizi, SectionLavori) usano Image', () => {
    const componenti = [
      'src/components/SectionBio.astro',
      'src/components/SectionTeam.astro',
      'src/components/SectionServizi.astro',
      'src/components/SectionLavori.astro',
    ];
    for (const componente of componenti) {
      const src = readFileSync(componente, 'utf-8');
      expect(src, `${componente} dovrebbe importare Image da astro:assets`).toContain(
        "import { Image } from 'astro:assets'",
      );
    }
  });

  it('i componenti Vue orfani dell\'originale Nuxt (SectionGallery, SectionStudio, Hero) non sono mai stati creati', () => {
    const tuttiIFile = [
      ...elencaFileRicorsivo('src', ['.vue']),
      ...elencaFileRicorsivo('src', ['.astro']),
    ];
    const nomiOrfani = ['SectionGallery', 'SectionStudio', 'Hero.vue', 'Hero.astro'];
    for (const nomeOrfano of nomiOrfani) {
      const trovato = tuttiIFile.some((f) => f.includes(nomeOrfano));
      expect(trovato, `${nomeOrfano} non dovrebbe esistere nella codebase Astro`).toBe(false);
    }
  });
});
