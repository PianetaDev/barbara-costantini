# CLAUDE.md — Barbara Costantini Restauro (26P16)

Guida per Francesca (e chiunque apra questa cartella). Leggi prima di fare qualsiasi cosa.

---

## Stack

| Cosa | Valore |
|------|--------|
| Framework | Nuxt 4 compat (`future.compatibilityVersion: 4`) |
| CSS | Tailwind v3 via `@nuxtjs/tailwindcss` + token `bc-*` |
| Font | EB Garamond (display) + Public Sans (UI) — Google Fonts |
| CMS | Sanity (`@nuxtjs/sanity`) — Foss configura il progetto |
| Deploy | Vercel — ogni push su `main` fa deploy automatico |
| Package manager | npm |

---

## Setup locale

```bash
git clone https://github.com/PianetaDev/barbara-costantini
cd barbara-costantini
npm install
cp .env.example .env   # chiedi a Max le credenziali Sanity
npm run dev            # → http://localhost:3000
```

---

## Struttura directory

```
app/
├── components/bc/    ← componenti del sito (prefisso Bc, auto-importati)
├── pages/            ← pagine — ogni file = una route
├── layouts/          ← default.vue (Nav + slot + Footer)
├── assets/css/       ← main.css (Tailwind base + .bc-btn)
public/               ← file statici (logo.svg, favicon, immagini)
tailwind.config.ts    ← token bc-* (colori, font, spacing)
nuxt.config.ts        ← config principale
.env.example          ← variabili d'ambiente necessarie
```

---

## Pagine da completare

| Pagina | File | Frame Figma | Stato |
|--------|------|-------------|-------|
| Homepage | `pages/index.vue` | 590:1395 | ✅ scaffold |
| Lo Studio | `pages/studio.vue` | 590:1429 | ✅ scaffold |
| Lavori | `pages/lavori/index.vue` | 590:1457 | da fare |
| Dettaglio lavoro | `pages/lavori/[slug].vue` | 590:1494 | da fare |
| Gallery | `pages/gallery.vue` | 590:1571 | ✅ scaffold |
| Contatti | `pages/contatti.vue` | 590:1479 | da fare |
| Servizi | `pages/servizi.vue` | — | da fare |

---

## Componenti esistenti (`app/components/bc/`)

Tutti auto-importati come `<BcNome />`, nessun import manuale necessario.

| Componente | Frame Figma | Descrizione |
|-----------|-------------|-------------|
| `BcNav` | 590:1428 | Header con logo + nav desktop + hamburger mobile |
| `BcHero` | 590:1413 | Hero con slot: title, image, subtext |
| `BcSectionStudio` | 590:1405 | Testo sx + divider + immagine dx |
| `BcSectionServizi` | 590:1417 | Immagine sx + divider + testo dx |
| `BcSectionLavori` | 590:1396 | Testo + carousel card progetti |
| `BcSectionGallery` | 590:1571 | Griglia 4 colonne con card mix V/H |
| `BcSectionBio` | 590:1429 | Bio singola persona: foto + nome/ruolo/testo |
| `BcSectionTeam` | — | Team 3 persone con carousel mobile |
| `BcFooter` | 590:1427 | Footer con info legali + link |

---

## Design tokens

Definiti in `tailwind.config.ts`. Usa sempre le classi `bc-*`.

**Colori:**
- `bg-bc-canvas` / `text-bc-canvas` → `#F7F6EF` (sfondo)
- `bg-bc-black` / `text-bc-black` / `border-bc-black` → `#000000`

**Font:**
- `font-garamond` → EB Garamond (titoli, body, bottoni)
- `font-sans` → Public Sans (nav, label, meta)

**Scala tipografica:**
- `text-bc-h1` → 56px semibold (hero)
- `text-bc-h2` → 38px semibold (titoli sezione)
- `text-bc-h4` → 24px semibold (card title)
- `text-bc-body1` → 22px regular (corpo testo)
- `text-bc-nav` → 16px regular (navigazione)
- `text-bc-label2` → 14px light (meta, codici)

**Spacing:** `bc-xs` (8px) · `bc-md` (16px) · `bc-xl` (32px) · `bc-2xl` (48px) · `bc-4xl` (80px)

**Bottone:** `class="bc-btn"` — border nero, hover fill nero/testo bianco

---

## Workflow Figma → Claude → codice

### Setup una tantum
1. Apri **Figma Desktop** (non browser) con il file Barbara Costantini aperto
2. Attiva Dev Mode: tasto `</>` in alto a destra
3. Apri Claude Code in questa cartella

### Per ogni componente o pagina
1. In Figma, seleziona il frame del componente che vuoi implementare
2. In Claude Code, scrivi:  
   *"Implementa [nome componente] basandoti sul frame Figma selezionato. Usa Vue 3 SFC, classi bc-*, nessun import manuale."*
3. Claude legge le specifiche direttamente da Figma tramite MCP
4. Verifica con `npm run dev`
5. `git push` → Vercel deploya in automatico

### Riferimento frame Figma
Il file è su Figma: cerca `26P16 Barbara Costantini` nel tuo team Pianeta.

---

## CMS Sanity

Foss configura il progetto Sanity per Barbara. Passi:

1. Vai su [sanity.io](https://sanity.io) → crea progetto `barbara-costantini`
2. Copia il `projectId` nel `.env`:
   ```
   SANITY_PROJECT_ID=tuoid
   SANITY_DATASET=production
   ```
3. Aggiungi le stesse variabili su Vercel (Settings → Environment Variables)
4. Lo schema Sanity va in `sanity/` nella root (da creare)

**Tipi di contenuto previsti:**
- `progetto` — titolo, committente, anno, immagini, descrizione, slug
- `pagina` — (opzionale) testi editabili per Studio/Bio

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
| `npm: command not found` | Installa Node da nodejs.org |
| Figma MCP non risponde | Riavvia Claude Code con Figma Desktop aperto in Dev Mode |
| Sanity warning nel build | Normale se `.env` non ha `SANITY_PROJECT_ID` — non blocca il build |
| Componente non trovato | Prefisso `Bc` — es. `<BcNav />` non `<Nav />` |
| Errore classi Tailwind | Controlla che la classe esista in `tailwind.config.ts` |

---

*Aggiornato: 16 giugno 2026 · Owner: Max (info@pianeta.studio)*
