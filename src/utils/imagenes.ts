// src/utils/imagenes.ts
// Task 8: le immagini reali (ex public/images/*.jpg) vivono ora in src/assets/images/
// perche' Astro <Image>/getImage() ottimizzano a build-time (via sharp) solo asset
// importati da src/, non file serviti staticamente da public/.
//
// I dati in src/data/progetti.ts (e le prop imageSrc/image delle sezioni) contengono
// pero' solo stringhe tipo "/images/bc-059.jpg" (il vecchio path public/), non import
// statici. Qui costruiamo una mappa nomefile -> modulo immagine tramite IMPORT STATICI
// ESPLICITI (uno per ogni file REALMENTE referenziato dal sito, verificato con:
//   grep -oh 'bc-[0-9]\{3\}\.jpg' src/data/progetti.ts src/pages/**/*.astro src/components/*.astro | sort -u
// che ne trova 26 su 97 disponibili in src/assets/images/), cosi' risolviImmagine()
// puo' restare sincrona (nessun await nei call site) e Vite/Rollup NON bundla nel
// build finale i restanti ~71 file mai usati.
//
// ATTENZIONE per chi aggiunge nuove immagini/progetti in futuro: se src/data/progetti.ts
// (o una pagina) referenzia un nuovo bc-NNN.jpg non presente qui sotto, risolviImmagine()
// lancia un errore esplicito a build-time (vedi sotto) — aggiungere il relativo import.

import img_bc_001 from '../assets/images/bc-001.jpg';
import img_bc_002 from '../assets/images/bc-002.jpg';
import img_bc_003 from '../assets/images/bc-003.jpg';
import img_bc_004 from '../assets/images/bc-004.jpg';
import img_bc_007 from '../assets/images/bc-007.jpg';
import img_bc_010 from '../assets/images/bc-010.jpg';
import img_bc_013 from '../assets/images/bc-013.jpg';
import img_bc_016 from '../assets/images/bc-016.jpg';
import img_bc_019 from '../assets/images/bc-019.jpg';
import img_bc_022 from '../assets/images/bc-022.jpg';
import img_bc_025 from '../assets/images/bc-025.jpg';
import img_bc_026 from '../assets/images/bc-026.jpg';
import img_bc_027 from '../assets/images/bc-027.jpg';
import img_bc_030 from '../assets/images/bc-030.jpg';
import img_bc_031 from '../assets/images/bc-031.jpg';
import img_bc_034 from '../assets/images/bc-034.jpg';
import img_bc_037 from '../assets/images/bc-037.jpg';
import img_bc_038 from '../assets/images/bc-038.jpg';
import img_bc_040 from '../assets/images/bc-040.jpg';
import img_bc_055 from '../assets/images/bc-055.jpg';
import img_bc_059 from '../assets/images/bc-059.jpg';
import img_bc_060 from '../assets/images/bc-060.jpg';
import img_bc_066 from '../assets/images/bc-066.jpg';
import img_bc_070 from '../assets/images/bc-070.jpg';
import img_bc_095 from '../assets/images/bc-095.jpg';
import img_bc_097 from '../assets/images/bc-097.jpg';

const moduli: Record<string, ImageMetadata> = {
  'bc-001.jpg': img_bc_001,
  'bc-002.jpg': img_bc_002,
  'bc-003.jpg': img_bc_003,
  'bc-004.jpg': img_bc_004,
  'bc-007.jpg': img_bc_007,
  'bc-010.jpg': img_bc_010,
  'bc-013.jpg': img_bc_013,
  'bc-016.jpg': img_bc_016,
  'bc-019.jpg': img_bc_019,
  'bc-022.jpg': img_bc_022,
  'bc-025.jpg': img_bc_025,
  'bc-026.jpg': img_bc_026,
  'bc-027.jpg': img_bc_027,
  'bc-030.jpg': img_bc_030,
  'bc-031.jpg': img_bc_031,
  'bc-034.jpg': img_bc_034,
  'bc-037.jpg': img_bc_037,
  'bc-038.jpg': img_bc_038,
  'bc-040.jpg': img_bc_040,
  'bc-055.jpg': img_bc_055,
  'bc-059.jpg': img_bc_059,
  'bc-060.jpg': img_bc_060,
  'bc-066.jpg': img_bc_066,
  'bc-070.jpg': img_bc_070,
  'bc-095.jpg': img_bc_095,
  'bc-097.jpg': img_bc_097,
};

/** Da "/images/bc-059.jpg" (path storico public/) a ImageMetadata per <Image src={...}>. */
export function risolviImmagine(percorsoPublic: string): ImageMetadata {
  const nomeFile = percorsoPublic.replace(/^\/images\//, '');
  const modulo = moduli[nomeFile];
  if (!modulo) {
    throw new Error(
      `[imagenes] Immagine non registrata in src/utils/imagenes.ts: "${percorsoPublic}" (nomeFile: "${nomeFile}"). Aggiungi un import esplicito per il nuovo file.`,
    );
  }
  return modulo;
}
