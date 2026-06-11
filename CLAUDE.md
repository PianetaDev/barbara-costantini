# CLAUDE.md — Barbara Costantini Restauro

Leggere prima di iniziare qualsiasi task su questo progetto.

---

## Progetto

Sito web per **Barbara Costantini Restauro Srl** — studio di restauro artistico.
Codice interno: **26P16**
Repo: https://github.com/PianetaDev/barbara-costantini

**Stack**: Nuxt 4 · Tailwind CSS · pnpm · Vercel

---

## Team

| Chi | Ruolo | Cosa fa su questo progetto |
|-----|-------|---------------------------|
| **Francesca (Foss)** | PM/Design | Componenti UI, design system |
| **Ludovica** | UX/Illustrazione | Componenti visivi, sezioni immagini |
| **Max** | Owner | Decisioni architetturali, deploy |

---

## Design System Figma

**File**: https://www.figma.com/design/4ELDYGUtuujrcrVDnJ31b5/Website
**Pagina di lavoro**: `Def Test AI` (id: `590:1381`)
**Token Figma**: nel file `PRIVATE.md` (gitignored — solo locale)

### Frame principali
| Pagina | ID Figma | Stato |
|--------|----------|-------|
| Homepage | `590:1395` | ⬜ da fare |
| Lo studio | `590:1429` | ⬜ da fare |
| Lavori | `590:1457` | ⬜ da fare |
| Contatti | `590:1479` | ⬜ da fare |
| Dettaglio progetto | `590:1494` | ⬜ da fare |
| Gallery aperta | `590:1571` | ⬜ da fare |
| Style Guide | `590:1595` | ✅ estratto |

### Come leggere un frame Figma da Claude
```bash
# Sostituire {NODE_ID} con l'id del frame
curl -s -H "X-Figma-Token: $(cat PRIVATE.md | grep 'FIGMA_TOKEN' | cut -d= -f2)" \
  "https://api.figma.com/v1/files/4ELDYGUtuujrcrVDnJ31b5/nodes?ids={NODE_ID}"

# Oppure per avere uno screenshot PNG del frame:
curl -s -H "X-Figma-Token: $(cat PRIVATE.md | grep 'FIGMA_TOKEN' | cut -d= -f2)" \
  "https://api.figma.com/v1/images/4ELDYGUtuujrcrVDnJ31b5?ids={NODE_ID}&format=png&scale=1"
```

---

## Design Tokens (estratti da Style Guide)

| Token | Valore | Uso |
|-------|--------|-----|
| `bc-cream` | `#F5F0E8` | Sfondo principale |
| `bc-black` | `#0A0A0A` | Testo, bordi |
| Font display | EB Garamond | Titoli, headings |
| Font body | Public Sans | Nav, body, caption |

Configurati in `tailwind.config.ts`.

---

## Struttura componenti

```
app/components/bc/
├── Nav.vue           ← navigazione principale
├── Hero.vue          ← hero con titolo + foto full-width
├── SectionStudio.vue ← sezione "Lo studio"
├── SectionLavori.vue ← griglia progetti
├── SectionServizi.vue← sezione servizi
└── Footer.vue        ← footer con link legali
```

Ogni componente ha un commento in cima con il riferimento al frame Figma.
**Prefisso componenti**: `Bc` (es. `BcNav`, `BcHero`).

---

## Convenzioni

- **Classi Tailwind** con prefisso `bc-` per i token custom
- **Classi componente** `.bc-container`, `.bc-btn`, `.bc-section` definite in `main.css`
- **Font display**: usare `font-garamond` (classe Tailwind)
- **Font body**: usare `font-sans` (già default)
- **Niente commenti** nel codice salvo riferimenti Figma in cima al file
- **Auto-import componenti** attivo — non serve importare manualmente

## Come lavorare su un componente

1. Leggi il frame Figma corrispondente (vedi tabella sopra)
2. Usa `curl` con il token Figma per scaricare struttura o screenshot
3. Implementa il componente Vue seguendo i token Tailwind del progetto
4. Aggiorna la tabella qui sopra quando il componente è fatto (⬜ → ✅)

---

## Dev

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # verifica errori prima del push
```

**Deployment**: Vercel, auto-deploy da `main`. Credenziali in `PRIVATE.md`.

---

*Aggiornato: 11 giugno 2026*
