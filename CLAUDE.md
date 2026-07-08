# CLAUDE.md — Barbara Costantini Restauro (26P16)

Guida per Francesca (e chiunque apra questa cartella). Leggi prima di fare qualsiasi cosa.

> **Migrazione Nuxt → Astro (Parte 1) completata.** Questo file era fermo allo stack Nuxt
> iniziale; aggiornato per riflettere lo stack reale attuale. I contenuti sono ancora
> placeholder Lorem ipsum — il CMS (Sanity) arriva in una Parte 2 separata, non è ancora
> integrato.

---

## Stack

| Cosa | Valore |
|------|--------|
| Framework | Astro 7 (`output: 'server'`) + isole Vue 3 dove serve interattività |
| CSS | Tailwind v4 CSS-first (`@tailwindcss/vite`) — token `bc-*` in `src/styles/global.css` |
| Font | Public Sans (self-hosted, `public/fonts/`) — EB Garamond rimosso, non più usato |
| CMS | Non ancora integrato. Contenuti hardcoded in `src/data/progetti.ts` (Parte 2: Sanity) |
| Deploy | Vercel — push su `main` fa deploy automatico |
| Package manager | pnpm |

---

## Setup locale

```bash
git clone https://github.com/PianetaDev/barbara-costantini
cd barbara-costantini
pnpm install
pnpm dev            # → http://localhost:4321
```

---

## Struttura directory

```
src/
├── pages/            ← pagine — ogni file = una route (index, studio, servizi, lavori/, contatti, cookie/privacy-policy)
├── components/        ← componenti reali: Nav.vue, Footer.astro, SectionBio.astro,
│                         SectionServizi.astro, SectionLavori.astro, SectionTeam.astro,
│                         CookieBanner.vue, CaroselloImmagini.vue (nomi propri, import
│                         espliciti — niente più auto-import né prefisso Bc*)
├── layouts/           ← BaseLayout.astro
├── data/               ← progetti.ts (dati reali dei 12 progetti, testi ancora Lorem ipsum)
├── utils/              ← imagenes.ts
├── styles/             ← global.css (Tailwind v4 @theme — token bc-*, @font-face)
└── assets/images/      ← immagini sorgente ottimizzate da Astro Image/Sharp in build
public/                 ← file statici (logo.svg, favicon, fonts/*.woff2)
tests/                  ← vitest (pnpm test)
astro.config.mjs        ← config principale (adapter Vercel, integrazioni vue/sitemap)
.env.example            ← variabili d'ambiente necessarie
```

Non esistono più `app/`, `nuxt.config.ts` o `tailwind.config.ts` — rimossi nel cutover a Astro.

---

## Pagine

| Pagina | File | Stato |
|--------|------|-------|
| Homepage | `src/pages/index.astro` | ✅ |
| Lo Studio | `src/pages/studio.astro` | ✅ |
| Lavori | `src/pages/lavori/index.astro` | ✅ |
| Dettaglio lavoro | `src/pages/lavori/[slug].astro` | ✅ (SSG via `getStaticPaths`, 12 progetti reali) |
| Servizi | `src/pages/servizi.astro` | ✅ |
| Contatti | `src/pages/contatti.astro` | ✅ |
| Cookie/Privacy policy | `src/pages/cookie-policy.astro`, `src/pages/privacy-policy.astro` | ✅ |

`Gallery` (frame Figma 590:1571) non è mai stata portata: componente orfano dell'originale Nuxt (`SectionGallery`), mai collegato a una route.

---

## Componenti esistenti (`src/components/`)

Import espliciti per ogni pagina/layout, nessun auto-import (a differenza del vecchio Nuxt).

| Componente | Tipo | Descrizione |
|-----------|------|-------------|
| `Nav.vue` | isola Vue | Header con logo + nav desktop + hamburger mobile (stato interattivo) |
| `Footer.astro` | statico | Footer con info legali + link |
| `SectionBio.astro` | statico | Bio singola persona: foto + nome/ruolo/testo |
| `SectionServizi.astro` | statico | Immagine sx + divider + testo dx |
| `SectionLavori.astro` | statico | Testo + carousel card progetti |
| `SectionTeam.astro` | statico | Team con carousel mobile |
| `CookieBanner.vue` | isola Vue | Banner cookie (stato localStorage) |
| `CaroselloImmagini.vue` | isola Vue | Hero + thumbnails galleria dettaglio lavoro |

---

## Design tokens

Definiti **CSS-first** in `src/styles/global.css` dentro un blocco `@theme` (Tailwind v4) — **non** in un file `tailwind.config.ts` (rimosso, non più letto dal progetto). Usa sempre le classi `bc-*`.

**Colori:**
- `bg-bc-canvas` / `text-bc-canvas` → `#F7F6EF` (sfondo)
- `bg-bc-black` / `text-bc-black` / `border-bc-black` → `#000000`

**Font:**
- `font-sans` / `font-garamond` (alias storico, stesso font) → Public Sans

**Scala tipografica:** `text-bc-h1` · `text-bc-h2` · `text-bc-h3` · `text-bc-h4` · `text-bc-sub` · `text-bc-body1` · `text-bc-body2` · `text-bc-nav` · `text-bc-btn` · `text-bc-label1` · `text-bc-label2` — valori esatti in `src/styles/global.css`.

**Spacing:** `bc-2xs` (4px) · `bc-xs` (8px) · `bc-sm` (12px) · `bc-md` (16px) · `bc-xl` (32px) · `bc-2xl` (48px) · `bc-4xl` (80px)

**Bottone:** `class="bc-btn"` — border nero, hover fill nero/testo bianco (definito in `@layer components` in `global.css`)

---

## Workflow Figma → Claude → codice

### Setup una tantum
1. Apri **Figma Desktop** (non browser) con il file Barbara Costantini aperto
2. Attiva Dev Mode: tasto `</>` in alto a destra
3. Apri Claude Code in questa cartella

### Per ogni componente o pagina
1. In Figma, seleziona il frame del componente che vuoi implementare
2. In Claude Code, scrivi:
   *"Implementa [nome componente] basandoti sul frame Figma selezionato. Componente Astro se statico, isola Vue solo se serve interattività client. Classi bc-*, import espliciti."*
3. Claude legge le specifiche direttamente da Figma tramite MCP
4. Verifica con `pnpm dev`
5. `git push` → Vercel deploya in automatico

### Riferimento frame Figma
Il file è su Figma: cerca `26P16 Barbara Costantini` nel tuo team Pianeta.

---

## CMS (Parte 2 — non ancora attivo)

I contenuti sono attualmente hardcoded in `src/data/progetti.ts` (testi placeholder Lorem ipsum, dati reali per struttura/immagini/meta dei 12 progetti). L'integrazione Sanity è pianificata come Parte 2, PR separata. Quando verrà attivata:

1. Crea progetto `barbara-costantini` su [sanity.io](https://sanity.io)
2. Copia il `projectId` nel `.env`:
   ```
   SANITY_PROJECT_ID=tuoid
   SANITY_DATASET=production
   ```
3. Aggiungi le stesse variabili su Vercel (Settings → Environment Variables)

---

## Git & deploy

```bash
git add -A
git commit -m "feat: descrizione"
git push           # Vercel deploya automaticamente
```

Branch: lavora su `main` direttamente (progetto piccolo) o crea `feat/nome-pagina` se vuoi.

---

## Troubleshooting

| Problema | Soluzione |
|----------|-----------|
| `pnpm: command not found` | Installa Node da nodejs.org, poi `corepack enable` (o `npm i -g pnpm`) |
| Figma MCP non risponde | Riavvia Claude Code con Figma Desktop aperto in Dev Mode |
| Componente non trovato | Serve import esplicito — controlla `src/components/`, niente più prefisso `Bc` |
| Errore classi Tailwind | Controlla che il token esista nel blocco `@theme` in `src/styles/global.css` |
| `pnpm run build` fallisce | È il comando reale usato da Vercel (`vercel.json` → `buildCommand`) — riproducilo in locale con `rm -rf node_modules dist .vercel/output && pnpm install && pnpm run build` |

---

*Aggiornato: 8 luglio 2026 · Owner: Max (info@pianeta.studio)*
