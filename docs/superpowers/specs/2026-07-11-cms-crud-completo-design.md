# CMS: completare il CRUD di Progetti e Team — design spec

**Data:** 2026-07-11 (revisionato dopo rebase su `origin/main` — vedi nota in fondo)
**Contesto:** il CMS (Supabase, integrato nel commit `1918d18`) espone Read+Update per Progetti e Team, ma il form admin di un progetto (`/admin/progetti/[id].astro`) mostra solo 4 dei 9 campi dello schema (titolo, committente, anno, intro) — mancano tipo, sezioni (corpo del case study), metodo, immagini (galleria). Team non ha modo di creare un nuovo membro né Progetti/Team di crearne uno nuovo dall'interfaccia. Per consegnare un sito "completo" al cliente, questo è il gap principale.

## Cosa già esiste ed è riusabile

Verificato leggendo il codice reale (`origin/main` aggiornato, non una copia locale stale):

- **`progettoSchema`/`teamMemberSchema`** (`src/lib/validation/{progetto,team}.ts`) coprono già tutti i campi. Gli endpoint PATCH (`src/pages/api/admin/{progetti,team}/[id].ts`) li usano con `.partial()` — accettano già qualunque sottoinsieme di campi. Il gap è **solo nel form**.
- **RLS**: le policy `projects_admin_write`/`team_admin_write` sono `for all` — nessuna nuova policy necessaria.
- **Upload immagini**: `src/pages/api/admin/upload-image.ts` è generico, `barbara-costantini-progetti` già whitelistato (mai usato finora).
- **`AdminLayout.astro`**: layout admin dedicato (sidebar, topbar con `backHref`/`backLabel`) — sostituisce `BaseLayout` nelle pagine admin più recenti (`progetti/[id]`, `progetti/index`, `team/[id]`, `team/index`). Le nuove pagine di questo spec (`nuovo.astro` per entrambe le entità) devono usarlo, non `BaseLayout`.
- **Reorder progetti**: `/admin/progetti/index.astro` ha già drag-and-drop (handle ⠿, HTML5 DnD) + numerazione `PRJ##` + `POST /api/admin/progetti/reorder` che aggiorna `ordine` in bulk. Non serve (e non va duplicato) un campo `ordine` manuale nel form di modifica del progetto — resta gestito solo dalla lista. Team non ha reorder: fuori scope aggiungerlo qui.
- **Hard delete progetti**: `/admin/progetti/[id].astro` ha già un pulsante "Elimina questo lavoro" → `DELETE /api/admin/progetti/[id]` (cancellazione reale, già implementato). Team non ha né create né delete.

## Decisione su archiviazione vs cancellazione (rivista dopo la scoperta del delete esistente)

Prima iterazione: **archiviazione** (reversibile) come azione primaria sul form di modifica, al posto del pulsante "Elimina" attuale. La cancellazione definitiva resta disponibile ma **si sposta**: non più un pulsante nel form di modifica di un elemento attivo, ma un'azione separata disponibile solo dalla sezione "Archiviati" della lista (un elemento va prima archiviato, poi eventualmente cancellato per sempre da lì). Questo riusa l'endpoint `DELETE` già esistente per progetti (nessuna riscrittura) e ne aggiunge uno analogo per team (che oggi non ne ha nessuno).

## Modifiche

### 1. Schema database (nuova migration)

```sql
alter table bc_projects add column archiviato boolean not null default false;
alter table bc_projects add column immagini_contenuto jsonb not null default '[]';
alter table bc_team_members add column archiviato boolean not null default false;
```

`immagini_contenuto` (snake_case, coerente con `foto_url`/`committente` ecc.) sostituisce il campo `immaginiContenuto` che oggi esiste solo lato TypeScript (mai una colonna reale, vedi nota in `src/lib/supabase-public.ts`). Contiene un array di massimo 2 URL stringa: `/lavori/[slug].astro` usa `immagini_contenuto[0]` per "immagine grande contenuto" e di nuovo `[0]`+`[1]` per "due immagini affiancate" (comportamento del template esistente, non modificato qui).

### 2. `src/lib/validation/progetto.ts` e `team.ts`

Aggiungere `archiviato: z.boolean().optional()` a entrambi. Aggiungere `immaginiContenuto: z.array(z.string()).max(2).optional()` a `progettoSchema` (nome camelCase lato Zod/payload, come `sezioni`/`immagini`; la colonna DB è `immagini_contenuto`, la conversione avviene nell'endpoint).

### 3. `src/lib/supabase-public.ts`

- `getProgetti()`, `getProgetto()`, `getTeamMembers()`: aggiungere `.eq('archiviato', false)`.
- Interfaccia `Progetto`: `immaginiContenuto` popolata da `immagini_contenuto` (mappata esplicitamente), aggiungere `archiviato: boolean`.
- Interfaccia `TeamMember`: aggiungere `archiviato: boolean`.

### 4. Form admin Progetti (`/admin/progetti/[id].astro`)

Estendere il form esistente (titolo/committente/anno/intro già presenti) con:
- **tipo** (select horizontal/vertical)
- **sezioni**: blocchi ripetibili (titolo, sottotitolo, testi — un `<textarea>` per paragrafo, non rich-text: `testi` è un array di stringhe separate). "+ Paragrafo" dentro la sezione, "Aggiungi sezione" per un nuovo blocco, "Rimuovi" su ogni blocco/paragrafo. Nessun riordino trascinabile.

  **Nota (bug preesistente, fuori scope, già gestito da altro task):** il campo `intro` (Tiptap/HTML) vs il suo rendering pubblico — verificato che nella versione corrente esiste già `src/lib/sanitize-intro.ts` con relativa sanificazione lato PATCH e lato render (`sanitizeIntroHtml`) — il gap che avevo segnalato risulta già risolto da un lavoro parallelo, non serve più una segnalazione separata.
- **immagini** (galleria carosello): blocchi ripetibili con upload file (bucket `barbara-costantini-progetti`), label, aspetto (h/v).
- **immagini_contenuto**: 2 slot fissi di upload file.
- **metodo**: blocco fisso — testi[0] (textarea), citazione (input), testi[1] (textarea, opzionale).
- **Sostituire** il pulsante "Elimina questo lavoro" (che oggi chiama `DELETE`) con **"Archivia"**: `confirm()` → `PATCH {archiviato: true}` → redirect a `/admin/progetti`. La chiamata `DELETE` esistente non si tocca lato endpoint, si sposta solo il punto da cui viene invocata (vedi punto 7).

### 5. Form admin Team (`/admin/team/[id].astro`)

Già copre nome/ruolo/bio/foto. Aggiungere solo: pulsante **"Archivia"** (stesso pattern del punto 4 — qui non sostituisce nulla, oggi non c'è alcun pulsante di rimozione).

### 6. Creazione — nuove pagine e endpoint

- `/admin/progetti/nuovo.astro` (usa `AdminLayout`, `backHref="/admin/progetti"`): form minimo slug/titolo/tipo. Submit → `POST /api/admin/progetti` → redirect a `/admin/progetti/{nuovo-id}`.
- `/admin/team/nuovo.astro` (idem, `backHref="/admin/team"`): form minimo nome. Submit → `POST /api/admin/team` → redirect a `/admin/team/{nuovo-id}`.
- `src/pages/api/admin/progetti/index.ts` (nuovo): `POST`. **Nota**: `progettoSchema` intero non va bene as-is per la create minima — `sezioni`/`immagini` sono array obbligatori (non `.optional()`, pur potendo essere vuoti). Usare `progettoSchema.partial({ committente: true, intro: true, sezioni: true, metodo: true, immagini: true, immaginiContenuto: true })` (partial mirato solo sui campi non richiesti alla creazione, slug/titolo/tipo restano obbligatori) e passare a `.insert(...)` con `sezioni: parsed.data.sezioni ?? []`, `immagini: parsed.data.immagini ?? []`.
- `src/pages/api/admin/team/index.ts` (nuovo): `POST`, stesso pattern con `teamMemberSchema.partial({ ruolo: true, bio: true, foto_url: true })`.
- `src/pages/api/admin/team/[id].ts`: aggiungere `export const DELETE` (stesso pattern di `progetti/[id].ts`, non esiste ancora).

### 7. Liste admin (`/admin/progetti/index.astro`, `/admin/team/index.astro`)

- Link "+ Nuovo progetto" / "+ Nuovo membro" in testa, verso le pagine `nuovo.astro`.
- La select esistente in entrambe le liste va filtrata `archiviato = false` (per progetti, senza rompere il drag-and-drop/reorder esistente — la lista trascinabile mostra solo gli attivi).
- Sezione "Archiviati" in fondo a ciascuna lista (query separata `archiviato = true`, nessun drag-and-drop qui): ogni riga ha **"Ripristina"** (`PATCH {archiviato: false}`, ricarica) e **"Elimina definitivamente"** (`confirm()` più esplicito — "Cancellazione irreversibile" — poi `DELETE /api/admin/{progetti,team}/{id}`, ricarica).

## Fuori scope

- Riordino drag&drop per Team (non esiste, non richiesto qui).
- Gestione ruoli/rimozione utenti in `/admin/utenti`.
- Modifiche al layout/design della pagina pubblica `/lavori/[slug].astro` — solo dati mancanti (`immagini_contenuto`), template invariato.

## Testing

- Estendere `tests/` (vitest) per: validazione Zod dei nuovi campi, i nuovi endpoint POST (create) e DELETE team — casi: successo, campi obbligatori mancanti, non autenticato.
- Verifica manuale: creare un progetto di prova end-to-end (create → compila tutti i campi → verifica resa su `/lavori/[slug]` → archivia → verifica sparisce da `/lavori` e appare in "Archiviati" → ripristina → verifica riappare → elimina definitivamente dall'archivio → verifica sparisce anche dall'archivio), stesso ciclo per un membro team.
- Build (`pnpm run build`) e suite esistente (`pnpm test`) verdi.

## Nota di processo

Questo spec è stato scritto una prima volta contro una copia locale di `main` disallineata da `origin/main` (mancavano 56 commit, incluso il lavoro di Francesca su reorder/PRJ##/anno/hard-delete). Corretto dopo `git fetch` + rebase del branch di lavoro su `origin/main` reale, prima di scrivere il piano di implementazione.
