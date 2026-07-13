# Barbara Costantini — CMS Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the admin CMS for barbara-costantini: connect frontend pages to page content CMS, add `in_evidenza` featured projects, add `correlati` related projects, add sidebar navigation, extend page coverage to legal pages and footer.

**Architecture:** All 5 tasks (PIA-75..PIA-79) share the same Astro 7 + Supabase + Zod + Vitest stack. Each task is a self-contained migration + validation update + admin UI + frontend wiring + test. Tasks are ordered by dependency: PIA-75 (shared infrastructure) → PIA-76/77 (page content extension) → PIA-78/79 (project model extension).

**Tech Stack:** Astro 7 (`output: 'server'`), Supabase (anon key for public, service_role for admin mutations), Zod v4, Vitest, pnpm. Tests run with `pnpm test`. Deploy via Vercel (apply migrations via Supabase dashboard or Management API — no Supabase CLI in this repo).

---

## Overview of Files Changed

| Task | Files |
|------|-------|
| PIA-75 | `AdminLayout.astro`, `admin/pagine/[page].astro`, `validation/page-content.ts`, `supabase-public.ts`, migration, `index.astro`, `studio.astro`, `contatti.astro`, tests |
| PIA-76 | migration, `validation/page-content.ts`, `admin/pagine/[page].astro`, `privacy-policy.astro`, `cookie-policy.astro` |
| PIA-77 | migration, `validation/page-content.ts`, `Footer.astro` |
| PIA-78 | migration, `validation/progetto.ts`, `admin/progetti/[id].astro`, `supabase-public.ts`, `index.astro`, tests |
| PIA-79 | migration, `validation/progetto.ts`, `admin/progetti/[id].astro`, `api/admin/progetti/[id].ts`, `supabase-public.ts`, `lavori/[slug].astro`, tests |

---

## Task 1 — PIA-75: Sidebar + seed contenuto pagine + frontend home/studio/contatti

**Files:**
- Modify: `src/layouts/AdminLayout.astro` (add Pagine nav)
- Modify: `src/lib/validation/page-content.ts` (no change needed — already has the 4 pages)
- Create: `supabase/migrations/20260713000000_bc_page_content_seed.sql`
- Modify: `src/lib/supabase-public.ts` (add `getPageContent()`)
- Modify: `src/pages/admin/pagine/[page].astro` (add human-readable label map)
- Modify: `src/pages/index.astro` (read hero_titolo from CMS, keep image static)
- Modify: `src/pages/studio.astro` (read hero_titolo + bio_ruolo + bio_testo from CMS)
- Modify: `src/pages/contatti.astro` (read email/instagram/telefono/indirizzo from CMS)
- Modify: `tests/home-studio.test.ts` (mock getPageContent)

- [ ] **Step 1: Scrivi la migration SQL di seed**

Crea `supabase/migrations/20260713000000_bc_page_content_seed.sql`:

```sql
-- supabase/migrations/20260713000000_bc_page_content_seed.sql
-- Seed iniziale di bc_page_content con i testi correnti hardcoded nelle pagine .astro.
-- Idempotente: ON CONFLICT DO NOTHING — rieseguire non sovrascrive modifiche fatte dal CMS.

insert into bc_page_content (page, content) values
(
  'home',
  '{
    "hero_titolo": "Barbara Costantini Restauro",
    "hero_testo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia."
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;

insert into bc_page_content (page, content) values
(
  'studio',
  '{
    "hero_titolo": "Lo studio",
    "hero_testo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
    "bio_ruolo": "Restauratrice",
    "bio_testo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula."
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;

insert into bc_page_content (page, content) values
(
  'contatti',
  '{
    "email": "bb.costantini@gmail.com",
    "instagram": "@barbara_costantini",
    "telefono": "+39 349 6718022",
    "indirizzo": "Largo dell'\''Olgiata 15 - 00123 Roma"
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;

insert into bc_page_content (page, content) values
(
  'servizi',
  '{
    "intro": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;
```

- [ ] **Step 2: Applica la migration a Supabase**

Via Management API (sostituisci `YOUR_PAT` con il PAT in keychain):

```bash
PAT=$(security find-generic-password -s "supabase-pat" -w 2>/dev/null | base64 --decode 2>/dev/null || echo "")
# Se PAT vuoto, esegui la migration direttamente via Supabase dashboard SQL editor
# oppure con psql se hai accesso diretto.
# URI: Settings > Database > Connection string (Transaction mode)
```

In alternativa, esegui il contenuto SQL direttamente nella Supabase dashboard (SQL editor del progetto `fmplfkzqexaposaamgwi`).

- [ ] **Step 3: Scrivi il test che verifica il tipo di ritorno di getPageContent (pre-implementazione)**

Aggiungi in `tests/home-studio.test.ts`, dopo i mock esistenti di `getTeamMembers`:

```typescript
// Mock per getPageContent (aggiunto da Task 1 / PIA-75)
const PAGE_CONTENT_MOCK = vi.hoisted(() => ({
  home: { hero_titolo: 'Barbara Costantini Restauro', hero_testo: 'Testo hero home mock.' },
  studio: { hero_titolo: 'Lo studio', hero_testo: 'Testo hero studio mock.', bio_ruolo: 'Restauratrice', bio_testo: 'Bio mock.' },
  contatti: { email: 'test@example.com', instagram: '@test', telefono: '+39 000', indirizzo: 'Via Test 1' },
}));
const { mockGetPageContent } = vi.hoisted(() => ({ mockGetPageContent: vi.fn() }));

// Aggiorna il vi.mock esistente di supabase-public per includere getPageContent:
// NOTA: SOSTITUISCI il vi.mock esistente con questo (aggiunge getPageContent al mock)
vi.mock('../src/lib/supabase-public', () => ({
  getTeamMembers: mockGetTeamMembers,
  getPageContent: mockGetPageContent,
}));
```

Poi aggiungi in `beforeEach`:
```typescript
mockGetPageContent.mockReset();
mockGetPageContent.mockImplementation(async (page: string) =>
  PAGE_CONTENT_MOCK[page as keyof typeof PAGE_CONTENT_MOCK] ?? {}
);
```

Aggiungi test:
```typescript
it('index.astro legge hero_titolo da page content CMS', async () => {
  const renderers = await loadRenderers([getContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const html = await container.renderToString(Home);
  expect(html).toContain('Barbara Costantini Restauro');
});

it('contatti.astro legge email e telefono da CMS', async () => {
  const renderers = await loadRenderers([getContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const html = await container.renderToString(Contatti);
  expect(html).toContain('test@example.com');
  expect(html).toContain('+39 000');
});
```

Aggiungi import `Contatti` in cima al file (dopo `Studio`):
```typescript
import Contatti from '../src/pages/contatti.astro';
```

- [ ] **Step 4: Esegui i test per verificare che falliscano**

```bash
cd ~/dev/barbara-costantini && pnpm test -- home-studio
```

Atteso: FAIL — `getPageContent is not a function` o simile.

- [ ] **Step 5: Aggiungi `getPageContent` a `supabase-public.ts`**

Aggiungi in fondo a `src/lib/supabase-public.ts`:

```typescript
export async function getPageContent(page: string): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('bc_page_content')
    .select('content')
    .eq('page', page)
    .single();
  return (data?.content ?? {}) as Record<string, string>;
}
```

- [ ] **Step 6: Aggiorna `src/pages/index.astro` per leggere dal CMS**

Sostituisci il frontmatter:

```typescript
---
// src/pages/index.astro
import { Image } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionLavori from '../components/SectionLavori.astro';
import SectionServizi from '../components/SectionServizi.astro';
import { getPageContent } from '../lib/supabase-public';
import { risolviImmagine } from '../utils/imagenes';
import { PROGETTI } from '../data/progetti';

let pageContent: Record<string, string> = {};
try {
  pageContent = await getPageContent('home');
} catch {
  // fallback: testo vuoto — l'h1 renderizza comunque (campo vuoto nel markup)
}

const heroTitolo = pageContent.hero_titolo || 'Barbara Costantini Restauro';
const heroTesto = pageContent.hero_testo || '';

// PROGETTI ancora usato per la home — verrà sostituito da PIA-78 (in_evidenza)
const progettiHome = PROGETTI.slice(0, 3).map((p) => ({
  slug: p.slug,
  titolo: p.titolo,
  codice: p.id,
  committente: p.committente,
  tipo: p.tipo,
  immagini: p.immagini,
}));
---
```

Nel markup HTML sostituisci il contenuto dell'`<h1>` nell'hero:

```astro
<h1 class="font-sans text-[28px] lg:text-bc-h1 font-normal text-bc-black tracking-[0.02em] leading-[1.5]">
  {heroTitolo}{heroTesto ? `  ${heroTesto}` : ''}
</h1>
```

- [ ] **Step 7: Aggiorna `src/pages/studio.astro` per leggere dal CMS**

Aggiungi import in cima al frontmatter (dopo gli import esistenti):
```typescript
import { getPageContent } from '../lib/supabase-public';
```

Aggiungi dopo il blocco try/catch di `getTeamMembers`:
```typescript
let studioContent: Record<string, string> = {};
try {
  studioContent = await getPageContent('studio');
} catch {
  // fallback: defaults hardcoded in SectionBio
}
const studioHeroTitolo = studioContent.hero_titolo || 'Lo studio';
const studioHeroTesto = studioContent.hero_testo || '';
const bioBio = studioContent.bio_testo || undefined;
const bioRuolo = studioContent.bio_ruolo || undefined;
```

Nel markup, sostituisci l'h1 dell'hero:
```astro
<h1 class="font-sans text-[28px] lg:text-bc-h1 font-normal text-bc-black tracking-[0.02em] leading-[1.5]">
  {studioHeroTitolo}{studioHeroTesto ? `  ${studioHeroTesto}` : ''}
</h1>
```

E aggiungi props a `<SectionBio>`:
```astro
<SectionBio imageSrc="/images/bc-030.jpg" imageAlt="Barbara Costantini"
  ruolo={bioRuolo} bio={bioBio} />
```

- [ ] **Step 8: Aggiorna `src/pages/contatti.astro` per leggere dal CMS**

Trasforma da pagina statica a SSR. Aggiungi in cima al frontmatter esistente:

```typescript
---
// src/pages/contatti.astro
import { Image } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';
import { getPageContent } from '../lib/supabase-public';
import { risolviImmagine } from '../utils/imagenes';

export const prerender = false;

let contattiContent: Record<string, string> = {};
try {
  contattiContent = await getPageContent('contatti');
} catch {
  // fallback ai valori hardcoded sotto
}
const email = contattiContent.email || 'bb.costantini@gmail.com';
const instagram = contattiContent.instagram || '@barbara_costantini';
const telefono = contattiContent.telefono || '+39 349 6718022';
const indirizzo = contattiContent.indirizzo || "Largo dell'Olgiata 15 - 00123 Roma";
---
```

Nel markup, sostituisci i valori hardcoded con le variabili:
```astro
<a href={`mailto:${email}`} class="font-sans text-bc-body1 ...">
  {email}
</a>
<a href={`https://instagram.com/${instagram.replace('@','')}`} ...>
  {instagram}
</a>
<p class="font-sans text-bc-body1 ...">{telefono}</p>
<p class="font-sans text-bc-body1 ...">{indirizzo}</p>
```

- [ ] **Step 9: Aggiungi "Pagine" alla sidebar di AdminLayout**

In `src/layouts/AdminLayout.astro`, sostituisci:
```typescript
const navItems = [
  { label: 'Lavori', href: '/admin/progetti' },
];
```
Con:
```typescript
const navItems = [
  { label: 'Lavori', href: '/admin/progetti' },
  { label: 'Home', href: '/admin/pagine/home' },
  { label: 'Studio', href: '/admin/pagine/studio' },
  { label: 'Contatti', href: '/admin/pagine/contatti' },
  { label: 'Servizi', href: '/admin/pagine/servizi' },
];
```

E aggiorna la logica `active` nel markup (attualmente usa `path.startsWith(item.href)` — ok).

- [ ] **Step 10: Aggiorna `admin/pagine/[page].astro` con etichette leggibili**

Aggiungi dopo l'import di `pageContentSchema`:

```typescript
const FIELD_LABELS: Record<string, Record<string, string>> = {
  home: {
    hero_titolo: 'Titolo pagina',
    hero_testo: 'Testo sotto il titolo',
  },
  studio: {
    hero_titolo: 'Titolo pagina Studio',
    hero_testo: 'Testo sotto il titolo',
    bio_ruolo: 'Ruolo di Barbara',
    bio_testo: 'Bio di Barbara',
  },
  contatti: {
    email: 'Email di contatto',
    instagram: 'Handle Instagram (es. @barbara_costantini)',
    telefono: 'Numero di telefono',
    indirizzo: 'Indirizzo',
  },
  servizi: {
    intro: 'Testo introduttivo',
  },
};
const labelsForPage = FIELD_LABELS[pageParam ?? ''] ?? {};
```

Nel form, sostituisci `{chiave}` con `{labelsForPage[chiave] ?? chiave}`:
```astro
{Object.entries(content).map(([chiave, valore]) => (
  <label class="flex flex-col gap-[6px] font-sans text-[14px] font-light">
    {labelsForPage[chiave] ?? chiave}
    {chiave.includes('testo') || chiave.includes('bio') ? (
      <textarea name={chiave} rows={4}
        class="border border-bc-black px-bc-md py-bc-xs w-full font-light"
      >{String(valore)}</textarea>
    ) : (
      <input name={chiave} value={String(valore)}
        class="border border-bc-black px-bc-md py-bc-xs w-full" />
    )}
  </label>
))}
```

- [ ] **Step 11: Esegui i test**

```bash
cd ~/dev/barbara-costantini && pnpm test
```

Atteso: tutti i test passano (84+/84).

- [ ] **Step 12: Commit**

```bash
cd ~/dev/barbara-costantini
git add supabase/migrations/20260713000000_bc_page_content_seed.sql \
        src/layouts/AdminLayout.astro \
        src/lib/supabase-public.ts \
        src/pages/admin/pagine/[page].astro \
        src/pages/index.astro \
        src/pages/studio.astro \
        src/pages/contatti.astro \
        tests/home-studio.test.ts
git commit -m "feat(cms/PIA-75): sidebar pagine + frontend legge da bc_page_content"
```

---

## Task 2 — PIA-76: Editor pagine legali (Privacy Policy, Cookie Policy)

**Files:**
- Create: `supabase/migrations/20260713010000_bc_page_content_legal.sql`
- Modify: `src/lib/validation/page-content.ts`
- Modify: `src/pages/admin/pagine/[page].astro` (textarea per html_body)
- Modify: `src/pages/privacy-policy.astro`
- Modify: `src/pages/cookie-policy.astro`
- Modify: `tests/pages-statiche.test.ts`

- [ ] **Step 1: Scrivi la migration**

Crea `supabase/migrations/20260713010000_bc_page_content_legal.sql`:

```sql
-- supabase/migrations/20260713010000_bc_page_content_legal.sql
-- Estende bc_page_content per le pagine legali (privacy, cookie).
-- La constraint CHECK è definita come INLINE nella colonna (non come constraint separata
-- con nome), quindi non si può modificare con ALTER CONSTRAINT: va fatto con DROP + ADD.

alter table bc_page_content
  drop constraint bc_page_content_page_check;

alter table bc_page_content
  add constraint bc_page_content_page_check
  check (page in ('home', 'studio', 'servizi', 'contatti', 'privacy-policy', 'cookie-policy', 'footer'));

-- Seed: html_body vuoto di default — le pagine usano fallback al markup statico
-- finché non si salva qualcosa dall'admin.
insert into bc_page_content (page, content) values
  ('privacy-policy', '{"html_body": ""}'::jsonb)
ON CONFLICT (page) DO NOTHING;

insert into bc_page_content (page, content) values
  ('cookie-policy', '{"html_body": ""}'::jsonb)
ON CONFLICT (page) DO NOTHING;
```

- [ ] **Step 2: Applica la migration a Supabase**

Copia il contenuto SQL nell'editor SQL della Supabase dashboard (progetto `fmplfkzqexaposaamgwi`).

- [ ] **Step 3: Aggiorna la validation**

In `src/lib/validation/page-content.ts`:

```typescript
import { z } from 'zod';

export const pageContentSchema = z.object({
  page: z.enum(['home', 'studio', 'servizi', 'contatti', 'privacy-policy', 'cookie-policy', 'footer']),
  content: z.record(z.string(), z.unknown()),
});

export type PageContent = z.infer<typeof pageContentSchema>;
```

- [ ] **Step 4: Aggiorna `admin/pagine/[page].astro` per le pagine legali**

Aggiungi `'privacy-policy'` e `'cookie-policy'` all'array `PAGINE_VALIDE` (ora derivato automaticamente da `pageContentSchema.shape.page.options`).

Aggiorna `FIELD_LABELS` aggiungendo:
```typescript
'privacy-policy': {
  html_body: 'Contenuto Privacy Policy (HTML)',
},
'cookie-policy': {
  html_body: 'Contenuto Cookie Policy (HTML)',
},
```

Nel form, aggiungi un caso speciale per `html_body` che usa una `<textarea>` grande:
```astro
{chiave === 'html_body' ? (
  <textarea name={chiave} rows={20}
    class="border border-bc-black px-bc-md py-bc-xs w-full font-light font-mono text-[12px]"
  >{String(valore)}</textarea>
) : chiave.includes('testo') || chiave.includes('bio') ? (
  <textarea name={chiave} rows={4}
    class="border border-bc-black px-bc-md py-bc-xs w-full font-light"
  >{String(valore)}</textarea>
) : (
  <input name={chiave} value={String(valore)}
    class="border border-bc-black px-bc-md py-bc-xs w-full" />
)}
```

Aggiungi link rapidi nella sidebar per privacy e cookie (in `AdminLayout.astro`):
```typescript
{ label: 'Privacy Policy', href: '/admin/pagine/privacy-policy' },
{ label: 'Cookie Policy', href: '/admin/pagine/cookie-policy' },
```

- [ ] **Step 5: Aggiorna `privacy-policy.astro` per leggere dal CMS**

```typescript
---
// src/pages/privacy-policy.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import { getPageContent } from '../lib/supabase-public';

export const prerender = false;

let htmlBody = '';
try {
  const content = await getPageContent('privacy-policy');
  htmlBody = (content.html_body as string) ?? '';
} catch {
  // fallback al markup statico sotto
}
---
<BaseLayout title="Privacy Policy">
  <div class="w-full px-[24px] tablet:px-bc-page py-[64px]">
    <div class="max-w-[720px] mx-auto flex flex-col gap-[48px]">
      {htmlBody ? (
        <div class="prose prose-bc" set:html={htmlBody} />
      ) : (
        <!-- INCOLLA QUI IL MARKUP STATICO ESISTENTE DELLA PAGINA -->
        <!-- il markup tra i tag <div class="flex flex-col gap-[32px]..."> ... </div> -->
      )}
    </div>
  </div>
</BaseLayout>
```

**NOTA IMPORTANTE**: Copia l'intero contenuto statico esistente di `privacy-policy.astro` come fallback dentro il ramo `: (`. Il file risultante ha il markup statico come fallback e il CMS come override.

- [ ] **Step 6: Aggiorna `cookie-policy.astro` — stesso pattern di Step 5**

Stesso approccio: `getPageContent('cookie-policy')` → `html_body` → fallback markup statico.

- [ ] **Step 7: Aggiorna il test `pages-statiche.test.ts`**

Il test esistente renderizza le pagine statiche. Con `prerender = false`, l'AstroContainer ha bisogno che il mock di `getPageContent` restituisca stringa vuota (fallback a markup statico):

Aggiungi in cima al file (prima degli import delle pagine):

```typescript
import { vi } from 'vitest';

vi.mock('../src/lib/supabase-public', () => ({
  getPageContent: vi.fn().mockResolvedValue({ html_body: '' }),
  getTeamMembers: vi.fn().mockResolvedValue([]),
  getProgetti: vi.fn().mockResolvedValue([]),
  getProgetto: vi.fn().mockResolvedValue(null),
}));
```

- [ ] **Step 8: Esegui i test**

```bash
cd ~/dev/barbara-costantini && pnpm test
```

Atteso: tutti i test passano.

- [ ] **Step 9: Commit**

```bash
cd ~/dev/barbara-costantini
git add supabase/migrations/20260713010000_bc_page_content_legal.sql \
        src/lib/validation/page-content.ts \
        src/layouts/AdminLayout.astro \
        src/pages/admin/pagine/[page].astro \
        src/pages/privacy-policy.astro \
        src/pages/cookie-policy.astro \
        tests/pages-statiche.test.ts
git commit -m "feat(cms/PIA-76): editor privacy policy e cookie policy via bc_page_content"
```

---

## Task 3 — PIA-77: Footer editabile dal CMS

**Files:**
- Create: `supabase/migrations/20260713020000_bc_page_content_footer.sql`
- Modify: `src/lib/validation/page-content.ts` (già aggiornata in Task 2, solo se Task 2 non è fatto)
- Modify: `src/components/Footer.astro`

**Nota architetturale**: `Footer.astro` è usato dentro `BaseLayout.astro` che è un layout non-SSR di default. Per leggere da Supabase in Footer.astro, dobbiamo passare i dati come prop da chi include BaseLayout, oppure rendere Footer server-only. L'approccio più semplice: passare `footerContent` come prop da BaseLayout, che lo riceve da chi lo usa; oppure usare `Astro.locals` pre-caricato. Scegliamo il path minimo: BaseLayout carica i dati footer nel suo frontmatter.

- [ ] **Step 1: Scrivi la migration**

Crea `supabase/migrations/20260713020000_bc_page_content_footer.sql`:

```sql
-- supabase/migrations/20260713020000_bc_page_content_footer.sql
-- Aggiunge 'footer' alla whitelist di bc_page_content.
-- ATTENZIONE: se Task 2 (PIA-76) è già applicato, la constraint include già 'footer'.
-- In quel caso, esegui SOLO l'insert.

-- Se Task 2 NON è stato applicato:
-- alter table bc_page_content drop constraint bc_page_content_page_check;
-- alter table bc_page_content add constraint bc_page_content_page_check
--   check (page in ('home', 'studio', 'servizi', 'contatti', 'privacy-policy', 'cookie-policy', 'footer'));

-- Seed footer con i valori correnti hardcoded in Footer.astro
insert into bc_page_content (page, content) values
(
  'footer',
  '{
    "ragione_sociale": "Barbara Costantini Restauro Srl",
    "piva": "14529501000",
    "cf": "CSTBBR83M45H501C",
    "anno_copyright": "2026"
  }'::jsonb
)
ON CONFLICT (page) DO NOTHING;
```

- [ ] **Step 2: Aggiorna la validation** (se non già fatto in Task 2)

Se Task 2 è stato applicato, `page-content.ts` già include `'footer'`. Altrimenti:

```typescript
export const pageContentSchema = z.object({
  page: z.enum(['home', 'studio', 'servizi', 'contatti', 'privacy-policy', 'cookie-policy', 'footer']),
  content: z.record(z.string(), z.unknown()),
});
```

- [ ] **Step 3: Aggiorna `BaseLayout.astro` per caricare footer content**

`BaseLayout.astro` importa `Footer.astro`. Aggiungi il caricamento footer in `BaseLayout.astro`:

```typescript
---
// Aggiungi dopo gli import esistenti
import { getPageContent } from '../lib/supabase-public';

// Carica il footer — errore silenzioso con fallback ai valori hardcoded
let footerContent: Record<string, string> = {};
try {
  footerContent = await getPageContent('footer');
} catch {
  // fallback: valori hardcoded in Footer.astro
}
---
```

E passa la prop a `<Footer>`:
```astro
<Footer content={footerContent} />
```

- [ ] **Step 4: Aggiorna `src/components/Footer.astro`**

```astro
---
// src/components/Footer.astro
interface Props {
  content?: Record<string, string>;
}
const { content = {} } = Astro.props;
const ragioneSociale = content.ragione_sociale || 'Barbara Costantini Restauro Srl';
const piva = content.piva || '14529501000';
const cf = content.cf || 'CSTBBR83M45H501C';
const annoCorrente = content.anno_copyright || String(new Date().getFullYear());
---
<footer class="w-full border-t border-bc-black mt-auto px-bc-page">
  <!-- ... resto del markup, usando le variabili sopra invece dei valori hardcoded ... -->
  <p ...>{ragioneSociale}</p>
  <p ...>P.IVA {piva}</p>
  <p ...>C.F. {cf}</p>
  <p ...>© {annoCorrente}, {ragioneSociale} · All Rights Reserved</p>
```

**NOTA**: Copia l'intero markup di `Footer.astro` e sostituisci solo i 4 valori hardcoded con le variabili sopra.

- [ ] **Step 5: Aggiungi Footer alla sidebar admin**

In `src/layouts/AdminLayout.astro`, aggiungi:
```typescript
{ label: 'Footer', href: '/admin/pagine/footer' },
```

Aggiungi a `FIELD_LABELS` in `admin/pagine/[page].astro`:
```typescript
footer: {
  ragione_sociale: 'Ragione sociale',
  piva: 'Partita IVA',
  cf: 'Codice Fiscale',
  anno_copyright: 'Anno copyright',
},
```

- [ ] **Step 6: Esegui i test**

```bash
cd ~/dev/barbara-costantini && pnpm test
```

Atteso: tutti i test passano. I test del layout potrebbero richiedere un mock di `getPageContent` se `BaseLayout.astro` ora chiama Supabase. Controlla `tests/layout.test.ts` e aggiungi mock se necessario:

```typescript
vi.mock('../src/lib/supabase-public', () => ({
  getPageContent: vi.fn().mockResolvedValue({}),
  getTeamMembers: vi.fn().mockResolvedValue([]),
  // ... altri mock già presenti
}));
```

- [ ] **Step 7: Commit**

```bash
cd ~/dev/barbara-costantini
git add supabase/migrations/20260713020000_bc_page_content_footer.sql \
        src/layouts/BaseLayout.astro \
        src/components/Footer.astro \
        src/layouts/AdminLayout.astro \
        src/pages/admin/pagine/[page].astro
git commit -m "feat(cms/PIA-77): footer editabile via bc_page_content"
```

---

## Task 4 — PIA-78: Progetti in evidenza (`in_evidenza`)

**Files:**
- Create: `supabase/migrations/20260713030000_bc_in_evidenza.sql`
- Modify: `src/lib/validation/progetto.ts`
- Modify: `src/lib/supabase-public.ts`
- Modify: `src/pages/admin/progetti/[id].astro`
- Modify: `src/pages/index.astro`
- Modify: `tests/home-studio.test.ts`
- Modify: `tests/admin-progetti-patch.test.ts`

- [ ] **Step 1: Scrivi la migration**

Crea `supabase/migrations/20260713030000_bc_in_evidenza.sql`:

```sql
-- supabase/migrations/20260713030000_bc_in_evidenza.sql
-- Aggiunge in_evidenza a bc_projects per segnare quali progetti mostrare in home.
-- Le policy RLS esistenti (projects_admin_write) già coprono tutti i campi di
-- bc_projects — nessuna nuova policy necessaria.

alter table bc_projects
  add column in_evidenza boolean not null default false;

-- Segna i primi 3 progetti (per ordine) come in evidenza di default.
-- Corrisponde all'attuale comportamento di index.astro (PROGETTI.slice(0,3)).
update bc_projects
  set in_evidenza = true
  where ordine < 3;
```

- [ ] **Step 2: Applica la migration a Supabase**

Copia il SQL nell'editor SQL della Supabase dashboard.

- [ ] **Step 3: Scrivi il test fallente per `in_evidenza`**

In `tests/admin-progetti-patch.test.ts`, aggiungi dopo i test esistenti:

```typescript
it('PATCH /api/admin/progetti/[id] con in_evidenza:true aggiorna il campo', async () => {
  mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  mockUpdate.mockReturnValue({ eq: vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: [{ id: 'prj-1' }], error: null }) }) });
  const request = new Request('http://localhost/api/admin/progetti/prj-1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ in_evidenza: true }),
  });

  const res = await PATCH({ params: { id: 'prj-1' }, request, cookies: {} } as any);

  expect(res.status).toBe(200);
  expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ in_evidenza: true }));
});
```

- [ ] **Step 4: Esegui il test per verificare che fallisca**

```bash
cd ~/dev/barbara-costantini && pnpm test -- admin-progetti-patch
```

Atteso: FAIL — `in_evidenza` non passa la validazione Zod (campo non riconosciuto).

- [ ] **Step 5: Aggiorna `src/lib/validation/progetto.ts`**

Aggiungi `in_evidenza` all'oggetto `progettoSchema`:

```typescript
in_evidenza: z.boolean().optional(),
```

Posizionalo subito dopo `archiviato: z.boolean().optional()`.

- [ ] **Step 6: Esegui il test per verificare che passi**

```bash
cd ~/dev/barbara-costantini && pnpm test -- admin-progetti-patch
```

Atteso: PASS (il campo `in_evidenza` viene ora accettato dallo schema).

- [ ] **Step 7: Aggiorna l'interfaccia `Progetto` in `supabase-public.ts`**

Aggiungi alla `interface Progetto`:

```typescript
in_evidenza: boolean;
```

Aggiungi in `mapProgettoRow` (cerca la funzione che mappa le righe DB):

```typescript
in_evidenza: row.in_evidenza ?? false,
```

Aggiungi la funzione `getProgettiInEvidenza`:

```typescript
export async function getProgettiInEvidenza(): Promise<Progetto[]> {
  const { data, error } = await supabase
    .from('bc_projects')
    .select('*')
    .eq('archiviato', false)
    .eq('in_evidenza', true)
    .order('ordine')
    .limit(6);
  if (error) throw error;
  // fallback: se nessuno è marcato in evidenza, prendi i primi 3 per ordine
  if (!data || data.length === 0) {
    const { data: fallback, error: fallbackError } = await supabase
      .from('bc_projects')
      .select('*')
      .eq('archiviato', false)
      .order('ordine')
      .limit(3);
    if (fallbackError) throw fallbackError;
    return (fallback ?? []).map(mapProgettoRow);
  }
  return data.map(mapProgettoRow);
}
```

- [ ] **Step 8: Aggiorna `index.astro` per usare `getProgettiInEvidenza`**

Rimuovi l'import di `PROGETTI` e `getPageContent` per progetti (mantieni solo quello per hero content). Aggiungi:

```typescript
import { getPageContent, getProgettiInEvidenza } from '../lib/supabase-public';

let progettiEvidenza: Awaited<ReturnType<typeof getProgettiInEvidenza>> = [];
try {
  progettiEvidenza = await getProgettiInEvidenza();
} catch {
  progettiEvidenza = [];
}

const progettiHome = progettiEvidenza.map((p) => ({
  slug: p.slug,
  titolo: p.titolo,
  codice: String(p.ordine + 1).padStart(2, '0'),
  committente: p.committente ?? '',
  tipo: p.tipo ?? 'horizontal',
  immagini: p.immagini,
}));
```

Rimuovi anche `import { PROGETTI } from '../data/progetti'` se non usato altrove nella pagina.

- [ ] **Step 9: Aggiungi toggle `in_evidenza` nell'admin progetto**

In `src/pages/admin/progetti/[id].astro`, sezione "Info base", aggiungi prima del bottone submit:

```astro
<label class="flex items-center gap-[12px] font-sans text-[14px] font-light cursor-pointer">
  <input type="checkbox" name="in_evidenza"
    checked={progetto.in_evidenza ?? false}
    class="w-[16px] h-[16px] accent-bc-black" />
  Mostra in home (in evidenza)
</label>
```

Nel `<script>` del form `info-form`, il `FormData` serialize i checkbox come stringa `'on'` quando checked, assenti quando unchecked. Aggiorna la lettura:

```javascript
// Nella parte del submit di info-form, PRIMA di fetch:
const rawData = Object.fromEntries(formData.entries());
const data = {
  ...rawData,
  in_evidenza: formData.has('in_evidenza'), // true se checked, false se assente
};
// Usa `data` invece di `rawData` nel body della fetch
```

- [ ] **Step 10: Aggiorna i test `home-studio.test.ts`**

Aggiorna il mock di `supabase-public` per includere `getProgettiInEvidenza`:

```typescript
vi.mock('../src/lib/supabase-public', () => ({
  getTeamMembers: mockGetTeamMembers,
  getPageContent: mockGetPageContent,
  getProgettiInEvidenza: vi.fn().mockResolvedValue([]),
}));
```

Aggiorna il test `index.astro renderizza hero`:

```typescript
it('index.astro renderizza hero + sezioni', async () => {
  const renderers = await loadRenderers([getContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const html = await container.renderToString(Home);
  expect(html).toContain('bc-095.jpg');
  expect(html).toContain('Barbara Costantini Restauro');
});
```

- [ ] **Step 11: Esegui tutti i test**

```bash
cd ~/dev/barbara-costantini && pnpm test
```

Atteso: tutti i test passano.

- [ ] **Step 12: Commit**

```bash
cd ~/dev/barbara-costantini
git add supabase/migrations/20260713030000_bc_in_evidenza.sql \
        src/lib/validation/progetto.ts \
        src/lib/supabase-public.ts \
        src/pages/admin/progetti/[id].astro \
        src/pages/index.astro \
        tests/home-studio.test.ts \
        tests/admin-progetti-patch.test.ts
git commit -m "feat(cms/PIA-78): in_evidenza boolean — toggle admin + home legge da Supabase"
```

---

## Task 5 — PIA-79: Progetti correlati (`correlati`)

**Files:**
- Create: `supabase/migrations/20260713040000_bc_correlati.sql`
- Modify: `src/lib/validation/progetto.ts`
- Modify: `src/pages/api/admin/progetti/[id].ts` (gestione `correlati` nel PATCH)
- Modify: `src/pages/admin/progetti/[id].astro` (picker multi-select)
- Modify: `src/lib/supabase-public.ts` (include correlati in getProgetto)
- Modify: `src/pages/lavori/[slug].astro` (sezione correlati)
- Modify: `tests/admin-progetti-patch.test.ts`

- [ ] **Step 1: Scrivi la migration**

Crea `supabase/migrations/20260713040000_bc_correlati.sql`:

```sql
-- supabase/migrations/20260713040000_bc_correlati.sql
-- Aggiunge correlati (array di UUID di progetti correlati) a bc_projects.
-- Massimo 3 correlati per progetto, validato lato applicazione (non DB constraint).

alter table bc_projects
  add column correlati jsonb not null default '[]';
```

- [ ] **Step 2: Scrivi il test fallente**

In `tests/admin-progetti-patch.test.ts`, aggiungi:

```typescript
it('PATCH /api/admin/progetti/[id] con correlati accetta array di slug', async () => {
  mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  mockUpdate.mockReturnValue({ eq: vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: [{ id: 'prj-1' }], error: null }) }) });
  const request = new Request('http://localhost/api/admin/progetti/prj-1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correlati: ['slug-a', 'slug-b'] }),
  });

  const res = await PATCH({ params: { id: 'prj-1' }, request, cookies: {} } as any);

  expect(res.status).toBe(200);
  expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ correlati: ['slug-a', 'slug-b'] }));
});
```

- [ ] **Step 3: Esegui il test per verificare che fallisca**

```bash
cd ~/dev/barbara-costantini && pnpm test -- admin-progetti-patch
```

Atteso: FAIL — `correlati` rifiutato da Zod.

- [ ] **Step 4: Aggiorna `src/lib/validation/progetto.ts`**

Aggiungi a `progettoSchema` (dopo `in_evidenza`):

```typescript
correlati: z.array(z.string()).max(3).optional(),
```

Aggiorna anche `export type Progetto` se presente (aggiunge `correlati?: string[]`).

- [ ] **Step 5: Esegui il test per verificare che passi**

```bash
cd ~/dev/barbara-costantini && pnpm test -- admin-progetti-patch
```

Atteso: PASS.

- [ ] **Step 6: Aggiorna `supabase-public.ts` — interfaccia + getProgetto**

Nella `interface Progetto`:
```typescript
correlati: string[];  // array di slug dei progetti correlati
```

In `mapProgettoRow`:
```typescript
correlati: (row.correlati as string[]) ?? [],
```

In `getProgetto`, aggiorna la select per includere `correlati`:
La query esistente usa `.select('*')` — già include `correlati`. Nessuna modifica alla query.

- [ ] **Step 7: Aggiorna `admin/progetti/[id].astro` — picker correlati**

Carica la lista di tutti i progetti (per il picker) nel frontmatter:

```typescript
const { data: tuttiProgetti } = await supabase
  .from('bc_projects')
  .select('id, slug, titolo')
  .eq('archiviato', false)
  .neq('id', progetto.id)  // escludi il progetto corrente
  .order('ordine');

const correlatiAttuali: string[] = (progetto as any).correlati ?? [];
```

Aggiungi una nuova sezione nell'admin UI (dopo la sezione "Corpo pagina"):

```astro
<!-- CORRELATI -->
<section>
  <h2 class="font-sans text-[13px] uppercase tracking-widest text-bc-black/50 mb-[24px]">Progetti correlati</h2>
  <form id="correlati-form" class="flex flex-col gap-bc-md" data-id={progetto.id}>
    <p class="font-sans text-[13px] font-light text-bc-black/60">
      Seleziona fino a 3 progetti da mostrare come correlati in fondo alla pagina di dettaglio.
    </p>
    <select name="correlati" multiple size={Math.min(tuttiProgetti?.length ?? 0, 8)}
      class="border border-bc-black px-bc-md py-bc-xs w-full font-sans text-[14px] font-light">
      {tuttiProgetti?.map((p) => (
        <option value={p.slug} selected={correlatiAttuali.includes(p.slug)}>
          {p.titolo}
        </option>
      ))}
    </select>
    <div class="flex items-center gap-[16px]">
      <button type="submit" class="bc-btn">Salva correlati</button>
      <p id="correlati-success" class="font-sans text-[13px] text-bc-black hidden">Salvato.</p>
      <p id="correlati-error" class="font-sans text-[13px] text-red-600 hidden"></p>
    </div>
  </form>
</section>
```

Aggiungi nel `<script>` (stessa pagina, dopo lo script del blockeditor):

```javascript
(function () {
  const form = document.getElementById('correlati-form');
  if (!form) return;
  const progettoId = form.dataset.id;
  const successEl = document.getElementById('correlati-success');
  const errorEl = document.getElementById('correlati-error');
  const select = form.querySelector('select[name="correlati"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    // Leggi tutti i valori selezionati (Array.from necessario per <select multiple>)
    const correlati = Array.from(select.selectedOptions).map((o) => o.value);
    if (correlati.length > 3) {
      errorEl.textContent = 'Puoi selezionare al massimo 3 progetti correlati.';
      errorEl.classList.remove('hidden');
      return;
    }
    const res = await fetch(`/api/admin/progetti/${progettoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correlati }),
    });
    if (res.ok) {
      successEl.classList.remove('hidden');
    } else {
      const { error } = await res.json();
      errorEl.textContent = typeof error === 'string' ? error : JSON.stringify(error);
      errorEl.classList.remove('hidden');
    }
  });
})();
```

- [ ] **Step 8: Aggiorna `lavori/[slug].astro` per mostrare correlati**

Dopo il caricamento di `progetto`, carica i correlati:

```typescript
// Carica progetti correlati se presenti
const slugsCorrelati: string[] = (progetto as any).correlati ?? [];
const progettiCorrelati: Awaited<ReturnType<typeof getProgetti>> = [];
if (slugsCorrelati.length > 0) {
  try {
    const tutti = await getProgetti();
    progettiCorrelati.push(
      ...tutti.filter((p) => slugsCorrelati.includes(p.slug)).slice(0, 3)
    );
  } catch {
    // fallback: nessun correlato
  }
}
```

Prima della sezione `<SectionLavori>` in fondo alla pagina, aggiungi:

```astro
{progettiCorrelati.length > 0 && (
  <SectionLavori
    progetti={progettiCorrelati.map((p) => ({
      slug: p.slug,
      titolo: p.titolo,
      codice: String(p.ordine + 1).padStart(2, '0'),
      committente: p.committente ?? '',
      tipo: p.tipo ?? 'horizontal',
      immagini: p.immagini,
    }))}
    ctaLabel=""
    paragrafoSize="20px"
    cardTitoloSize="20px"
    borderTop
    borderBottom={false}
  />
)}
```

- [ ] **Step 9: Esegui tutti i test**

```bash
cd ~/dev/barbara-costantini && pnpm test
```

Atteso: tutti i test passano.

- [ ] **Step 10: Commit**

```bash
cd ~/dev/barbara-costantini
git add supabase/migrations/20260713040000_bc_correlati.sql \
        src/lib/validation/progetto.ts \
        src/lib/supabase-public.ts \
        src/pages/admin/progetti/[id].astro \
        src/pages/lavori/[slug].astro \
        tests/admin-progetti-patch.test.ts
git commit -m "feat(cms/PIA-79): correlati — picker admin + sezione correlati in dettaglio lavoro"
```

---

## Self-Review

**Spec coverage check:**

| Task Paperclip | Coperto da | Gap |
|----------------|-----------|-----|
| PIA-75: Editor pagine statiche | Task 1 (home, studio, contatti) | servizi non connessa al CMS (solo intro text, accordeon è statico) |
| PIA-76: Editor Cookie/Privacy | Task 2 | Tiptap non usato — textarea HTML raw (admin-only, accettabile) |
| PIA-77: Footer | Task 3 | Anno copyright via CMS ma via `new Date()` come fallback |
| PIA-78: in_evidenza | Task 4 | Home page usa ora Supabase (remove static PROGETTI dependency) |
| PIA-79: correlati | Task 5 | Picker multi-select senza drag-to-reorder (ordine dipende da ordine in DB) |

**Nessun placeholder TBD** — tutti gli step hanno codice completo.

**Consistency check:**
- `getProgettiInEvidenza` ritorna `Progetto[]` da `supabase-public.ts` — usato in `index.astro` con `.ordine` → ok
- `correlati: string[]` (array di slug) nel progettoSchema e in `supabase-public.ts` — coerente
- Il PATCH API in `[id].ts` usa `progettoSchema.partial().safeParse()` — `correlati` e `in_evidenza` sono `.optional()` nello schema → saranno inclusi nel PATCH senza modifiche all'endpoint

**Note per il prossimo esecutore:**
- Le migrations vanno applicate in ordine (000 → 040000)
- Se Task 2 è eseguito PRIMA di Task 3, la migration di Task 3 non deve includere l'ALTER CONSTRAINT (già fatto)
- `servizi.astro` è ancora hardcoded — i gruppi/servizi Lorem ipsum vanno sostituiti da Barbara quando i testi reali sono pronti, tramite la sezione "Servizi" dell'admin (campo `intro` è già gestito dal CMS dopo Task 1)
- Il `<select multiple>` per correlati funziona ma l'UX non è ottimale per un cliente non tecnico; considerare un'isola Vue con checkbox in una PR futura
