# CMS: completare il CRUD di Progetti e Team — design spec

**Data:** 2026-07-11
**Contesto:** il CMS (Supabase, integrato nel commit `1918d18`) espone Read+Update per Progetti e Team, ma il form admin di un progetto (`/admin/progetti/[id].astro`) mostra solo 3 dei 9 campi dello schema (titolo, committente, intro) — mancano anno, tipo, sezioni (corpo del case study), metodo, immagini (galleria), ordine. Né Progetti né Team hanno un modo per creare una nuova riga o rimuoverne una esistente dall'interfaccia. Per consegnare un sito "completo" al cliente, questo è il gap principale: senza queste funzioni, aggiungere un nuovo progetto al portfolio o un nuovo membro del team richiede un intervento diretto sul database.

## Cosa già esiste ed è riusabile

Verificato leggendo il codice reale, non assunto:

- **`progettoSchema`/`teamMemberSchema`** (`src/lib/validation/{progetto,team}.ts`) coprono già tutti i campi. Gli endpoint PATCH (`src/pages/api/admin/{progetti,team}/[id].ts`) li usano con `.partial()` — accettano già qualunque sottoinsieme di campi. Il gap è **solo nel form**, che oggi invia solo 3 chiavi.
- **RLS**: le policy `projects_admin_write`/`team_admin_write` sono `for all` (coprono select/insert/update/delete per chi è in `bc_admin_users`) — nessuna nuova policy necessaria per create o per l'update che fa da soft-delete.
- **Upload immagini**: `src/pages/api/admin/upload-image.ts` è già generico (bucket passato come parametro), con `barbara-costantini-progetti` già nella whitelist dei bucket ammessi (mai usato finora da nessun form).
- **Pattern `.optional()` non `.default()`**: entrambi gli schema Zod hanno già la nota/fix per evitare che un PATCH parziale azzeri `ordine` — lo stesso pattern va rispettato per ogni nuovo campo opzionale aggiunto.

## Modifiche

### 1. Schema database (nuova migration)

```sql
alter table bc_projects add column archiviato boolean not null default false;
alter table bc_projects add column immagini_contenuto jsonb not null default '[]';
alter table bc_team_members add column archiviato boolean not null default false;
```

`immagini_contenuto` (snake_case) sostituisce il campo `immaginiContenuto` che oggi esiste solo lato TypeScript (mai stato una colonna reale, vedi nota in `src/lib/supabase-public.ts`) — rinominato per coerenza con la convenzione del resto dello schema (`foto_url`, `committente`, ecc. sono tutti snake_case; `immaginiContenuto` era l'unica eccezione camelCase, e riferiva un campo che non esisteva ancora).

Contiene un array di massimo 2 URL stringa: la pagina `/lavori/[slug].astro` usa `immagini_contenuto[0]` per la sezione "immagine grande contenuto" e di nuovo `immagini_contenuto[0]`+`immagini_contenuto[1]` per "due immagini affiancate" (comportamento del template esistente, non modificato da questo spec).

### 2. `src/lib/validation/progetto.ts` e `team.ts`

Aggiungere `archiviato: z.boolean().optional()` a entrambi gli schema (senza, un PATCH `{archiviato: true}` verrebbe silenziosamente scartato da Zod). Aggiungere `immaginiContenuto: z.array(z.string()).max(2).optional()` a `progettoSchema` — nome del campo Zod/TS resta `immaginiContenuto` in camelCase lato validazione/API payload (coerente con `sezioni`/`immagini` che sono già camelCase come chiavi JS), mentre la colonna DB è `immagini_contenuto`; la conversione avviene nell'endpoint (vedi punto 4).

### 3. `src/lib/supabase-public.ts`

- `getProgetti()`, `getProgetto()`, `getTeamMembers()`: aggiungere `.eq('archiviato', false)` alla query — i visitatori pubblici non vedono mai righe archiviate.
- Interfaccia `Progetto`: `immaginiContenuto` non più opzionale/sempre-assente, ma popolata da `immagini_contenuto` (mappata esplicitamente, dato che Supabase non camelCasa automaticamente); aggiungere `archiviato: boolean`.
- Interfaccia `TeamMember`: aggiungere `archiviato: boolean`.

### 4. Form admin Progetti (`/admin/progetti/[id].astro`)

Estendere il form esistente con:
- **anno** (input testo), **tipo** (select horizontal/vertical), **ordine** (input numero)
- **sezioni**: lista di blocchi ripetibili, ciascuno con titolo (input), sottotitolo (input), testi — un `<textarea>` per paragrafo (non un editor rich-text: `testi` è un vero array di stringhe separate, un textarea per elemento evita ambiguità su come si "spezzano" i paragrafi). Pulsante "+ Paragrafo" per aggiungerne uno dentro la sezione, "Aggiungi sezione" per un nuovo blocco, "Rimuovi" su ogni blocco/paragrafo. Nessun riordino trascinabile (riordinare = rimuovere e riaggiungere nell'ordine voluto).

  **Nota (bug preesistente, fuori scope):** il campo `intro` usa `RichTextEditor.vue` (Tiptap, produce HTML), ma la pagina pubblica lo tratta come testo semplice (`progetto.intro.split('\n\n')`, poi renderizzato senza `set:html` — quindi eventuali tag HTML apparirebbero come testo letterale). Oggi non si nota perché `intro` è stato scritto solo dal seed script (testo semplice diretto a DB); la prima modifica reale di un `intro` esistente dal form salverebbe HTML di Tiptap che poi non si vedrebbe correttamente in pubblico. Non è toccato da questo spec (riguarda un campo già esistente, non uno dei campi che sto aggiungendo) — segnalato come task separato.
- **immagini** (galleria carosello): lista di blocchi ripetibili, ciascuno con upload file (POST a `upload-image.ts`, bucket `barbara-costantini-progetti`, la risposta `url` popola `src`), label (input), aspetto (select h/v). Stesso pattern aggiungi/rimuovi di sezioni.
- **immagini_contenuto**: 2 slot fissi di upload file (non una lista ripetibile — il template ne usa esattamente 2).
- **metodo**: blocco fisso non ripetibile — testi[0] (textarea), citazione (input), testi[1] (textarea, opzionale).
- **Pulsante "Archivia"** in fondo al form, con `confirm()` prima di inviare `PATCH {archiviato: true}`; dopo successo, redirect a `/admin/progetti`.

Il payload JS che oggi costruisce `{titolo, committente, intro}` va esteso per includere tutti questi campi, mantenendo lo stesso pattern fetch+PATCH già presente.

### 5. Form admin Team (`/admin/team/[id].astro`)

Già copre nome/ruolo/bio/foto. Aggiungere solo: **ordine** (input numero, oggi assente) e **pulsante "Archivia"** (stesso pattern del punto 4).

### 6. Creazione — nuove pagine e endpoint

- `/admin/progetti/nuovo.astro`: form minimo con slug (input manuale), titolo, tipo (i 3 campi obbligatori dello schema). Submit → `POST /api/admin/progetti` → redirect a `/admin/progetti/{nuovo-id}` per completare gli altri campi.
- `/admin/team/nuovo.astro`: form minimo con nome (unico campo obbligatorio). Submit → `POST /api/admin/team` → redirect a `/admin/team/{nuovo-id}`.
- `src/pages/api/admin/progetti/index.ts` (nuovo file, no `[id]`): `POST` — stesso pattern auth di `[id].ts`. **Nota**: `progettoSchema` intero non va bene qui così com'è — `sezioni`/`immagini` sono array obbligatori (non `.optional()`, anche se possono essere vuoti) mentre il form minimo di creazione invia solo slug/titolo/tipo. Usare `progettoSchema.partial({ ...tutti i campi tranne slug/titolo/tipo... })` (o costruire uno schema di create dedicato che richiede solo slug/titolo/tipo) e passare a `.insert(...)` i valori validati con `sezioni`/`immagini` defaultati a `[]` se assenti dal body.
- `src/pages/api/admin/team/index.ts` (nuovo file): `POST` — stesso pattern con `teamMemberSchema`.

### 7. Liste admin (`/admin/progetti/index.astro`, `/admin/team/index.astro`)

Oggi sono un elenco piatto di link. Aggiungere:
- Link "+ Nuovo progetto" / "+ Nuovo membro" in cima, verso le pagine `nuovo.astro` del punto 6.
- La query esistente (`select(...).order('ordine')`) va filtrata `archiviato = false` per la lista principale.
- Una seconda sezione "Archiviati" in fondo alla pagina, con una query separata (`archiviato = true`), ciascun elemento con un pulsante "Ripristina" che fa `PATCH {archiviato: false}` e ricarica la pagina (stesso pattern fetch inline già usato per l'invito utenti in `utenti.astro`).

## Fuori scope

- Riordino drag&drop (deciso: ordine fisso di inserimento, riordinare = rimuovere/riaggiungere).
- Rimozione definitiva (hard delete) — solo archiviazione/ripristino.
- Gestione ruoli/rimozione utenti in `/admin/utenti` — non toccato da questo spec.
- Qualunque modifica al layout/design della pagina pubblica `/lavori/[slug].astro` — si aggiungono solo i dati mancanti (`immagini_contenuto`) allo schema esistente, senza cambiare come il template li consuma.

## Testing

- Estendere `tests/` esistenti (vitest) per: validazione Zod dei nuovi campi (`archiviato`, `immaginiContenuto` con max 2 elementi), i nuovi endpoint POST (create) — casi: successo, campi obbligatori mancanti, utente non autenticato.
- Verifica manuale: creare un progetto di prova end-to-end (create → compila tutti i campi → verifica resa su `/lavori/[slug]` → archivia → verifica sparisce da `/lavori` → ripristina → verifica riappare), stesso ciclo per un membro team.
- Build (`pnpm run build`) e suite esistente (`pnpm test`) verdi prima di considerare il lavoro concluso.
