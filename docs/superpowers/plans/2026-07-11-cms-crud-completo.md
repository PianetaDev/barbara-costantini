# CMS CRUD Completo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** completare il CRUD di Progetti e Team nel CMS Barbara Costantini — esporre tutti i campi mancanti (tipo/sezioni/immagini/metodo/immagini_contenuto), aggiungere creazione, e sostituire la cancellazione diretta con archiviazione (più cancellazione definitiva spostata nella sezione Archiviati).

**Architecture:** estende pattern già esistenti nel repo (Astro `.astro` pages con form + `<script>` inline che fa `fetch`, endpoint API con Zod `.partial()`, isole Vue per componenti che devono esporre stato a un form Astro via hidden input). Nessuna nuova libreria.

**Tech Stack:** Astro 7 + Vue 3 (isole), Supabase (Postgres + Storage + Auth), Zod, Vitest.

**Prerequisito manuale (fuori da questo piano):** il bucket Storage `barbara-costantini-progetti` deve esistere prima che l'upload immagini funzioni end-to-end (creato via `supabase.storage.createBucket('barbara-costantini-progetti', { public: true, fileSizeLimit: 10485760, allowedMimeTypes: ['image/jpeg','image/png','image/webp'] })`, stesso procedimento usato per `barbara-costantini-team` — vedi `supabase/README.md`). Questo piano aggiunge solo la policy RLS (Task 1); la creazione del bucket stesso tocca il progetto Supabase condiviso e va fatta a parte, con conferma esplicita, non silenziosamente da un subagent.

---

### Task 1: Migration DB — archiviato + immagini_contenuto + policy storage

**Files:**
- Create: `supabase/migrations/20260711000000_bc_archiviato_immagini_contenuto.sql`

- [ ] **Step 1: Scrivere la migration**

```sql
-- supabase/migrations/20260711000000_bc_archiviato_immagini_contenuto.sql
--
-- Aggiunge l'archiviazione (soft-delete reversibile) a bc_projects e
-- bc_team_members, e il campo immagini_contenuto (2 immagini per le sezioni
-- "immagine grande" e "due immagini affiancate" di /lavori/[slug].astro, oggi
-- referenziate dal template ma mai esistite come colonna reale — vedi nota in
-- src/lib/supabase-public.ts).

alter table bc_projects add column archiviato boolean not null default false;
alter table bc_projects add column immagini_contenuto jsonb not null default '[]';
alter table bc_team_members add column archiviato boolean not null default false;

-- Policy storage per il bucket barbara-costantini-progetti (stesso pattern di
-- 20260709020000_bc_team_storage_policy.sql per barbara-costantini-team): senza
-- questa policy, l'INSERT da src/pages/api/admin/upload-image.ts fallisce con
-- "new row violates row-level security policy" anche per un admin autenticato,
-- perché storage.objects ha RLS abilitata di default sul progetto condiviso.
-- NOTA: il bucket stesso va creato a parte (vedi prerequisito manuale nel piano),
-- questa policy da sola non serve a nulla se il bucket non esiste ancora.
create policy "bc_progetti_storage_admin_write"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'barbara-costantini-progetti'
    and is_bc_admin()
  );
```

- [ ] **Step 2: Verificare che il file sia SQL valido (lint manuale — nessun tool di lint SQL nel repo)**

Rileggere il file e confrontarlo con `supabase/migrations/20260709020000_bc_team_storage_policy.sql` (stesso pattern `is_bc_admin()`, stesso `for insert to authenticated`).

- [ ] **Step 3: Applicare la migration al progetto Supabase condiviso**

Run: `supabase db push --linked` (richiede che il CLI sia collegato al progetto — vedi `supabase/README.md`). Se non è possibile applicarla da questo ambiente, segnalarlo esplicitamente invece di procedere silenziosamente: i task successivi che leggono/scrivono `archiviato`/`immagini_contenuto` falliranno finché la colonna non esiste davvero sul database.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260711000000_bc_archiviato_immagini_contenuto.sql
git commit -m "feat(db): aggiunge archiviato, immagini_contenuto, policy storage progetti"
```

---

### Task 2: Validazione — archiviato e immaginiContenuto negli schema Zod

**Files:**
- Modify: `src/lib/validation/progetto.ts`
- Modify: `src/lib/validation/team.ts`
- Test: `tests/validation-progetto.test.ts`
- Test: `tests/validation-team.test.ts`

- [ ] **Step 1: Scrivere i test che falliscono**

Aggiungere a `tests/validation-progetto.test.ts` (dentro il `describe` esistente, prima della chiusura):

```typescript
  it('accetta archiviato e immaginiContenuto (max 2 elementi)', () => {
    const result = progettoSchema.partial().safeParse({
      archiviato: true,
      immaginiContenuto: ['https://esempio.test/a.jpg', 'https://esempio.test/b.jpg'],
    });
    expect(result.success).toBe(true);
  });

  it('rifiuta immaginiContenuto con più di 2 elementi', () => {
    const result = progettoSchema.partial().safeParse({
      immaginiContenuto: ['a', 'b', 'c'],
    });
    expect(result.success).toBe(false);
  });

  it('un update parziale che omette archiviato non lo inietta con un default', () => {
    const result = progettoSchema.partial().safeParse({ titolo: 'Solo titolo' });
    expect(result.success).toBe(true);
    expect(result.success && 'archiviato' in result.data).toBe(false);
  });
```

Aggiungere a `tests/validation-team.test.ts`:

```typescript
  it('accetta archiviato', () => {
    const result = teamMemberSchema.partial().safeParse({ archiviato: true });
    expect(result.success).toBe(true);
  });

  it('un update parziale che omette archiviato non lo inietta con un default', () => {
    const result = teamMemberSchema.partial().safeParse({ nome: 'Solo nome' });
    expect(result.success).toBe(true);
    expect(result.success && 'archiviato' in result.data).toBe(false);
  });
```

- [ ] **Step 2: Eseguire i test e verificare che falliscano**

Run: `pnpm test -- validation-progetto validation-team`
Expected: FAIL — `archiviato`/`immaginiContenuto` non riconosciuti dallo schema (Zod scarta chiavi non definite, ma qui il test si aspetta valori specifici che matchano solo se lo schema li valida davvero — il test su `'archiviato' in result.data` fallirebbe se lo schema li scartasse silenziosamente invece che validarli).

- [ ] **Step 3: Aggiungere i campi allo schema**

In `src/lib/validation/progetto.ts`, aggiungere dopo `ordine: z.number().optional(),`:

```typescript
  immaginiContenuto: z.array(z.string()).max(2).optional(),
  archiviato: z.boolean().optional(),
```

In `src/lib/validation/team.ts`, aggiungere dopo `ordine: z.number().optional(),`:

```typescript
  archiviato: z.boolean().optional(),
```

- [ ] **Step 4: Eseguire i test e verificare che passino**

Run: `pnpm test -- validation-progetto validation-team`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/validation/progetto.ts src/lib/validation/team.ts tests/validation-progetto.test.ts tests/validation-team.test.ts
git commit -m "feat(validation): aggiunge archiviato e immaginiContenuto agli schema Zod"
```

---

### Task 3: `supabase-public.ts` — filtro archiviato e mapping immagini_contenuto

**Files:**
- Modify: `src/lib/supabase-public.ts`
- Test: `tests/lavori.test.ts` (leggere prima di modificare — verificare il pattern di mock esistente)

- [ ] **Step 1: Leggere il test esistente per capire il pattern di mock**

Run: `cat tests/lavori.test.ts` — verificare come sono mockate `getProgetti`/`getProgetto` prima di aggiungere nuovi casi, per non duplicare un pattern diverso.

- [ ] **Step 2: Scrivere il test che fallisce**

Aggiungere un test in `tests/lavori.test.ts` (nello stesso file, seguendo il pattern di mock già presente) che verifica: la riga mappata da `getProgetto`/`getProgetti` include `immaginiContenuto` popolato dal valore di `immagini_contenuto` restituito dal mock Supabase (es. mock restituisce `{ ..., immagini_contenuto: ['x.jpg'] }`, l'assert verifica `progetto.immaginiContenuto).toEqual(['x.jpg'])`).

- [ ] **Step 3: Eseguire il test e verificare che fallisca**

Run: `pnpm test -- lavori`
Expected: FAIL — `immaginiContenuto` è `undefined` finché non viene mappato esplicitamente.

- [ ] **Step 4: Aggiornare `src/lib/supabase-public.ts`**

Sostituire le tre funzioni e le due interfacce coinvolte:

```typescript
export interface Progetto {
  id: string;
  slug: string;
  titolo: string;
  committente: string | null;
  anno: string | null;
  tipo: 'horizontal' | 'vertical' | null;
  intro: string | null;
  sezioni: Sezione[];
  metodo: Metodo | null;
  immagini: Immagine[];
  ordine: number;
  immaginiContenuto: string[];
  archiviato: boolean;
}

export interface TeamMember {
  id: string;
  nome: string;
  ruolo: string | null;
  bio: string | null;
  foto_url: string | null;
  ordine: number;
  archiviato: boolean;
}

// Riga grezza da Supabase (snake_case per immagini_contenuto, non ancora mappata).
type ProgettoRow = Omit<Progetto, 'immaginiContenuto'> & { immagini_contenuto: string[] };

function mapProgettoRow(row: ProgettoRow): Progetto {
  const { immagini_contenuto, ...resto } = row;
  return { ...resto, immaginiContenuto: immagini_contenuto };
}

export async function getProgetti(): Promise<Progetto[]> {
  const { data, error } = await supabase.from('bc_projects').select('*').eq('archiviato', false).order('ordine');
  if (error) throw error;
  return (data ?? []).map(mapProgettoRow);
}

export async function getProgetto(slug: string): Promise<Progetto> {
  const { data, error } = await supabase.from('bc_projects').select('*').eq('slug', slug).eq('archiviato', false).single();
  if (error) throw error;
  return mapProgettoRow(data);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from('bc_team_members').select('*').eq('archiviato', false).order('ordine');
  if (error) throw error;
  return data ?? [];
}
```

Non toccare il resto del file (i commenti/note esistenti su `Sezione`/`Immagine`/`Metodo`/`ERRORE_RIGA_NON_TROVATA` restano invariati — solo la nota sopra `immaginiContenuto` nell'interfaccia `Progetto`, che diceva "non esiste come colonna", va rimossa dato che ora esiste davvero).

- [ ] **Step 5: Eseguire il test e verificare che passi**

Run: `pnpm test -- lavori`
Expected: PASS

- [ ] **Step 6: Eseguire l'intera suite per verificare nessuna regressione**

Run: `pnpm test`
Expected: tutti i test passano (incluso `tests/lavori.test.ts`, `tests/home-studio.test.ts` se usano `getProgetti`).

- [ ] **Step 7: Commit**

```bash
git add src/lib/supabase-public.ts tests/lavori.test.ts
git commit -m "feat(public): filtra archiviato e mappa immagini_contenuto -> immaginiContenuto"
```

---

### Task 4: Team — pulsante Archivia + endpoint DELETE

**Files:**
- Modify: `src/pages/admin/team/[id].astro`
- Create: aggiungere `DELETE` a `src/pages/api/admin/team/[id].ts`
- Test: `tests/admin-team-archivia.test.ts` (nuovo)

- [ ] **Step 1: Scrivere il test che fallisce (endpoint DELETE team)**

```typescript
// tests/admin-team-archivia.test.ts
//
// Stesso pattern di mock di tests/admin-progetti-patch.test.ts: nessun bisogno di
// un Supabase reale.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockEq, mockDelete, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockEq: vi.fn(),
  mockDelete: vi.fn(),
  mockFrom: vi.fn(),
}));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

import { DELETE } from '../src/pages/api/admin/team/[id]';

describe('DELETE /api/admin/team/[id]', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockEq.mockReset();
    mockDelete.mockReset();
    mockFrom.mockReset();
    mockFrom.mockReturnValue({ delete: mockDelete });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('cancella definitivamente un membro del team', async () => {
    const res = await DELETE({ params: { id: 'membro-1' }, request: new Request('http://localhost'), cookies: {} } as any);
    expect(res.status).toBe(200);
    expect(mockFrom).toHaveBeenCalledWith('bc_team_members');
    expect(mockEq).toHaveBeenCalledWith('id', 'membro-1');
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const res = await DELETE({ params: { id: 'membro-1' }, request: new Request('http://localhost'), cookies: {} } as any);
    expect(res.status).toBe(401);
    expect(mockFrom).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `pnpm test -- admin-team-archivia`
Expected: FAIL — `DELETE` non è esportato da `src/pages/api/admin/team/[id].ts`.

- [ ] **Step 3: Aggiungere `DELETE` all'endpoint**

In `src/pages/api/admin/team/[id].ts`, aggiungere in fondo al file (stesso pattern di `src/pages/api/admin/progetti/[id].ts`):

```typescript
export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
  }

  const { error } = await supabase.from('bc_team_members').delete().eq('id', params.id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
```

- [ ] **Step 4: Eseguire il test e verificare che passi**

Run: `pnpm test -- admin-team-archivia`
Expected: PASS

- [ ] **Step 5: Aggiungere il pulsante "Archivia" al form di modifica**

In `src/pages/admin/team/[id].astro`, sostituire il blocco:
```astro
      <button type="submit" class="bc-btn">Salva</button>
    </form>
    <p id="team-success" class="text-bc-black mt-bc-sm hidden">Salvato.</p>
    <p id="team-error" class="text-red-600 mt-bc-sm hidden"></p>
  </section>
```
con:
```astro
      <button type="submit" class="bc-btn">Salva</button>
    </form>
    <p id="team-success" class="text-bc-black mt-bc-sm hidden">Salvato.</p>
    <p id="team-error" class="text-red-600 mt-bc-sm hidden"></p>

    <div class="mt-[64px] pt-[32px] border-t border-bc-black">
      <button id="archivia-membro" data-id={membro.id} class="font-sans text-[14px] font-light text-red-600 underline underline-offset-2 hover:no-underline">
        Archivia questo membro
      </button>
    </div>
  </section>
```

Poi aggiungere, subito prima della chiusura `</script>` (dopo il blocco `form.addEventListener('submit', ...)` esistente):

```typescript
    document.getElementById('archivia-membro')?.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      if (!confirm('Archiviare questo membro? Sparirà dal sito pubblico mà potrà essere ripristinato dalla lista Team.')) return;
      const res = await fetch(`/api/admin/team/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archiviato: true }),
      });
      if (res.ok) {
        window.location.href = '/admin/team';
      } else {
        const { error } = await res.json();
        errorEl.textContent = typeof error === 'string' ? error : JSON.stringify(error);
        errorEl.classList.remove('hidden');
      }
    });
```

- [ ] **Step 6: Verificare manualmente con build**

Run: `pnpm run build`
Expected: `Complete!`, nessun errore.

- [ ] **Step 7: Commit**

```bash
git add src/pages/admin/team/[id].astro src/pages/api/admin/team/[id].ts tests/admin-team-archivia.test.ts
git commit -m "feat(team): pulsante Archivia + endpoint DELETE per cancellazione definitiva"
```

---

### Task 5: Progetti — campo tipo + sostituire Elimina con Archivia

**Files:**
- Modify: `src/pages/admin/progetti/[id].astro`

- [ ] **Step 1: Aggiungere il campo `tipo`**

In `src/pages/admin/progetti/[id].astro`, dopo la riga:
```astro
      <label>Anno <input name="anno" value={progetto.anno ?? ''} placeholder="es. 2014-2016" class="border border-bc-black px-bc-md py-bc-xs w-full" /></label>
```
aggiungere:
```astro
      <label>Tipo
        <select name="tipo" class="border border-bc-black px-bc-md py-bc-xs w-full">
          <option value="horizontal" selected={progetto.tipo === 'horizontal'}>Horizontal</option>
          <option value="vertical" selected={progetto.tipo === 'vertical'}>Vertical</option>
        </select>
      </label>
```

- [ ] **Step 2: Includere `tipo` nel payload del submit**

Nel blocco `<script>`, nella funzione `payload` dentro `form.addEventListener('submit', ...)`, cambiare:
```typescript
      const payload = {
        titolo: formData.get('titolo'),
        committente: formData.get('committente'),
        anno: formData.get('anno') || undefined,
        intro: formData.get('intro'),
      };
```
in:
```typescript
      const payload = {
        titolo: formData.get('titolo'),
        committente: formData.get('committente'),
        anno: formData.get('anno') || undefined,
        tipo: formData.get('tipo'),
        intro: formData.get('intro'),
      };
```

- [ ] **Step 3: Sostituire il pulsante "Elimina" con "Archivia"**

Sostituire:
```astro
    <div class="mt-[64px] pt-[32px] border-t border-bc-black">
      <button id="elimina-progetto" data-id={progetto.id} class="font-sans text-[14px] font-light text-red-600 underline underline-offset-2 hover:no-underline">
        Elimina questo lavoro
      </button>
    </div>
```
con:
```astro
    <div class="mt-[64px] pt-[32px] border-t border-bc-black">
      <button id="archivia-progetto" data-id={progetto.id} class="font-sans text-[14px] font-light text-red-600 underline underline-offset-2 hover:no-underline">
        Archivia questo lavoro
      </button>
    </div>
```

E sostituire il listener:
```typescript
    document.getElementById('elimina-progetto')?.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      if (!confirm('Eliminare questo lavoro? L\'operazione non è reversibile.')) return;
      const res = await fetch(`/api/admin/progetti/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/admin/progetti';
      } else {
        const { error } = await res.json();
        errorEl.textContent = typeof error === 'string' ? error : JSON.stringify(error);
        errorEl.classList.remove('hidden');
      }
    });
```
con:
```typescript
    document.getElementById('archivia-progetto')?.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      if (!confirm('Archiviare questo lavoro? Sparirà dal sito pubblico ma potrà essere ripristinato dalla lista Lavori.')) return;
      const res = await fetch(`/api/admin/progetti/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archiviato: true }),
      });
      if (res.ok) {
        window.location.href = '/admin/progetti';
      } else {
        const { error } = await res.json();
        errorEl.textContent = typeof error === 'string' ? error : JSON.stringify(error);
        errorEl.classList.remove('hidden');
      }
    });
```

(L'endpoint `DELETE` esistente in `src/pages/api/admin/progetti/[id].ts` NON va toccato — resta per l'uso dalla sezione Archiviati, Task 11.)

- [ ] **Step 4: Verificare con build**

Run: `pnpm run build`
Expected: `Complete!`

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/progetti/[id].astro
git commit -m "feat(progetti): campo tipo + sostituisce Elimina con Archivia nel form"
```

---

### Task 6: Progetti — editor sezioni

**Files:**
- Modify: `src/pages/admin/progetti/[id].astro`

- [ ] **Step 1: Aggiungere il markup del blocco sezioni**

Dopo il blocco `<RichTextEditor client:load name="intro" modelValue={progetto.intro ?? ''} />`, aggiungere:

```astro
      <div>
        <p class="font-sans text-[14px] mb-bc-xs">Sezioni</p>
        <div id="sezioni-list" class="flex flex-col gap-bc-md" data-sezioni={JSON.stringify(progetto.sezioni ?? [])}></div>
        <button type="button" id="aggiungi-sezione" class="bc-ghost mt-bc-xs">+ Aggiungi sezione</button>
      </div>
```

- [ ] **Step 2: Aggiungere la logica JS di rendering/gestione**

Nel blocco `<script>`, prima di `form.addEventListener('submit', ...)`, aggiungere:

```typescript
    interface Sezione { titolo: string; sottotitolo: string; testi: string[] }

    const sezioniList = document.getElementById('sezioni-list')!;
    let sezioni: Sezione[] = JSON.parse(sezioniList.dataset.sezioni || '[]');

    function renderSezioni() {
      sezioniList.replaceChildren();
      sezioni.forEach((sezione, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'border border-bc-black p-bc-sm flex flex-col gap-bc-xs';

        const titoloInput = document.createElement('input');
        titoloInput.placeholder = 'Titolo sezione';
        titoloInput.value = sezione.titolo;
        titoloInput.className = 'border border-bc-black px-bc-md py-bc-xs w-full';
        titoloInput.addEventListener('input', () => { sezioni[i].titolo = titoloInput.value; });

        const sottotitoloInput = document.createElement('input');
        sottotitoloInput.placeholder = 'Sottotitolo';
        sottotitoloInput.value = sezione.sottotitolo;
        sottotitoloInput.className = 'border border-bc-black px-bc-md py-bc-xs w-full';
        sottotitoloInput.addEventListener('input', () => { sezioni[i].sottotitolo = sottotitoloInput.value; });

        const testiWrap = document.createElement('div');
        testiWrap.className = 'flex flex-col gap-bc-2xs';
        function renderTesti() {
          testiWrap.replaceChildren();
          sezione.testi.forEach((testo, j) => {
            const textarea = document.createElement('textarea');
            textarea.placeholder = `Paragrafo ${j + 1}`;
            textarea.value = testo;
            textarea.className = 'border border-bc-black px-bc-md py-bc-xs w-full';
            textarea.addEventListener('input', () => { sezioni[i].testi[j] = textarea.value; });
            const rimuoviTesto = document.createElement('button');
            rimuoviTesto.type = 'button';
            rimuoviTesto.textContent = 'Rimuovi paragrafo';
            rimuoviTesto.className = 'bc-ghost self-start text-[12px]';
            rimuoviTesto.addEventListener('click', () => { sezione.testi.splice(j, 1); renderTesti(); });
            testiWrap.append(textarea, rimuoviTesto);
          });
        }
        renderTesti();

        const aggiungiTesto = document.createElement('button');
        aggiungiTesto.type = 'button';
        aggiungiTesto.textContent = '+ Paragrafo';
        aggiungiTesto.className = 'bc-ghost self-start text-[12px]';
        aggiungiTesto.addEventListener('click', () => { sezione.testi.push(''); renderTesti(); });

        const rimuoviSezione = document.createElement('button');
        rimuoviSezione.type = 'button';
        rimuoviSezione.textContent = 'Rimuovi sezione';
        rimuoviSezione.className = 'bc-ghost self-start text-red-600';
        rimuoviSezione.addEventListener('click', () => { sezioni.splice(i, 1); renderSezioni(); });

        wrap.append(titoloInput, sottotitoloInput, testiWrap, aggiungiTesto, rimuoviSezione);
        sezioniList.appendChild(wrap);
      });
    }
    renderSezioni();

    document.getElementById('aggiungi-sezione')?.addEventListener('click', () => {
      sezioni.push({ titolo: '', sottotitolo: '', testi: [''] });
      renderSezioni();
    });
```

- [ ] **Step 3: Includere `sezioni` nel payload del submit**

Nella funzione `payload`, aggiungere `sezioni,` (la variabile è già in scope nello stesso `<script>`):

```typescript
      const payload = {
        titolo: formData.get('titolo'),
        committente: formData.get('committente'),
        anno: formData.get('anno') || undefined,
        tipo: formData.get('tipo'),
        intro: formData.get('intro'),
        sezioni,
      };
```

- [ ] **Step 4: Verificare con build**

Run: `pnpm run build`
Expected: `Complete!`

- [ ] **Step 5: Verifica manuale**

Avviare `pnpm run dev`, aprire `/admin/progetti/{un-id-esistente}`, aggiungere una sezione con 2 paragrafi, salvare, ricaricare la pagina e verificare che la sezione sia persistita.

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/progetti/[id].astro
git commit -m "feat(progetti): editor sezioni (aggiungi/rimuovi blocco e paragrafo)"
```

---

### Task 7: Progetti — editor galleria immagini

**Files:**
- Modify: `src/pages/admin/progetti/[id].astro`

- [ ] **Step 1: Aggiungere il markup**

Dopo il blocco `sezioni` aggiunto nel Task 6, aggiungere:

```astro
      <div>
        <p class="font-sans text-[14px] mb-bc-xs">Galleria (carosello)</p>
        <div id="immagini-list" class="flex flex-col gap-bc-md" data-immagini={JSON.stringify(progetto.immagini ?? [])}></div>
        <button type="button" id="aggiungi-immagine" class="bc-ghost mt-bc-xs">+ Aggiungi immagine</button>
      </div>
```

- [ ] **Step 2: Aggiungere la logica JS**

Nel `<script>`, dopo il blocco sezioni del Task 6:

```typescript
    interface ImmagineGalleria { src: string; label: string; aspetto?: 'h' | 'v' }

    const immaginiList = document.getElementById('immagini-list')!;
    let immagini: ImmagineGalleria[] = JSON.parse(immaginiList.dataset.immagini || '[]');

    async function uploadFile(file: File): Promise<string> {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('bucket', 'barbara-costantini-progetti');
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: uploadData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.url;
    }

    function renderImmagini() {
      immaginiList.replaceChildren();
      immagini.forEach((img, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'border border-bc-black p-bc-sm flex flex-col gap-bc-xs';

        if (img.src) {
          const preview = document.createElement('img');
          preview.src = img.src;
          preview.alt = '';
          preview.className = 'w-32 h-32 object-cover';
          wrap.appendChild(preview);
        }

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg,image/png,image/webp';
        fileInput.addEventListener('change', async () => {
          const file = fileInput.files?.[0];
          if (!file) return;
          img.src = await uploadFile(file);
          renderImmagini();
        });

        const labelInput = document.createElement('input');
        labelInput.placeholder = 'Etichetta';
        labelInput.value = img.label;
        labelInput.className = 'border border-bc-black px-bc-md py-bc-xs w-full';
        labelInput.addEventListener('input', () => { img.label = labelInput.value; });

        const aspettoSelect = document.createElement('select');
        aspettoSelect.className = 'border border-bc-black px-bc-md py-bc-xs w-full';
        ['', 'h', 'v'].forEach((v) => {
          const opt = document.createElement('option');
          opt.value = v;
          opt.textContent = v === '' ? '(nessuno)' : v;
          opt.selected = (img.aspetto ?? '') === v;
          aspettoSelect.appendChild(opt);
        });
        aspettoSelect.addEventListener('change', () => {
          img.aspetto = aspettoSelect.value === '' ? undefined : (aspettoSelect.value as 'h' | 'v');
        });

        const rimuovi = document.createElement('button');
        rimuovi.type = 'button';
        rimuovi.textContent = 'Rimuovi immagine';
        rimuovi.className = 'bc-ghost self-start text-red-600';
        rimuovi.addEventListener('click', () => { immagini.splice(i, 1); renderImmagini(); });

        wrap.append(fileInput, labelInput, aspettoSelect, rimuovi);
        immaginiList.appendChild(wrap);
      });
    }
    renderImmagini();

    document.getElementById('aggiungi-immagine')?.addEventListener('click', () => {
      immagini.push({ src: '', label: '' });
      renderImmagini();
    });
```

- [ ] **Step 3: Includere `immagini` nel payload**

```typescript
      const payload = {
        titolo: formData.get('titolo'),
        committente: formData.get('committente'),
        anno: formData.get('anno') || undefined,
        tipo: formData.get('tipo'),
        intro: formData.get('intro'),
        sezioni,
        immagini,
      };
```

- [ ] **Step 4: Verificare con build**

Run: `pnpm run build`
Expected: `Complete!`

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/progetti/[id].astro
git commit -m "feat(progetti): editor galleria immagini con upload"
```

---

### Task 8: Progetti — immagini_contenuto (2 slot) + metodo (blocco fisso)

**Files:**
- Modify: `src/pages/admin/progetti/[id].astro`

- [ ] **Step 1: Aggiungere il markup**

Dopo il blocco galleria immagini del Task 7, aggiungere (nota il `data-immagini-contenuto` sul contenitore esterno — è quello che il JS dello Step 2 legge, per non dover rincorrere in modo fragile lo stato tra i due file input):

```astro
      <div id="immagini-contenuto-wrap" data-immagini-contenuto={JSON.stringify(progetto.immaginiContenuto ?? [])}>
        <p class="font-sans text-[14px] mb-bc-xs">Immagini contenuto (usate nel dettaglio pubblico)</p>
        <div class="flex gap-bc-md">
          <div>
            <p class="text-[12px] mb-bc-2xs">Immagine 1</p>
            {progetto.immaginiContenuto?.[0] && <img src={progetto.immaginiContenuto[0]} alt="" class="w-32 h-32 object-cover mb-bc-2xs" />}
            <input type="file" id="immagine-contenuto-0" accept="image/jpeg,image/png,image/webp" />
          </div>
          <div>
            <p class="text-[12px] mb-bc-2xs">Immagine 2</p>
            {progetto.immaginiContenuto?.[1] && <img src={progetto.immaginiContenuto[1]} alt="" class="w-32 h-32 object-cover mb-bc-2xs" />}
            <input type="file" id="immagine-contenuto-1" accept="image/jpeg,image/png,image/webp" />
          </div>
        </div>
      </div>

      <div>
        <p class="font-sans text-[14px] mb-bc-xs">Metodo</p>
        <textarea id="metodo-testo-0" placeholder="Primo paragrafo" class="border border-bc-black px-bc-md py-bc-xs w-full">{progetto.metodo?.testi?.[0] ?? ''}</textarea>
        <input id="metodo-citazione" placeholder="Citazione" value={progetto.metodo?.citazione ?? ''} class="border border-bc-black px-bc-md py-bc-xs w-full mt-bc-xs" />
        <textarea id="metodo-testo-1" placeholder="Secondo paragrafo (opzionale)" class="border border-bc-black px-bc-md py-bc-xs w-full mt-bc-xs">{progetto.metodo?.testi?.[1] ?? ''}</textarea>
      </div>
```

- [ ] **Step 2: Aggiungere la logica JS**

Nel `<script>`, dopo il blocco immagini del Task 7 (usa `uploadFile`, già definita in quel blocco):

```typescript
    const immaginiContenutoWrap = document.getElementById('immagini-contenuto-wrap') as HTMLElement;
    let immaginiContenuto: string[] = JSON.parse(immaginiContenutoWrap.dataset.immaginiContenuto || '[]');

    document.getElementById('immagine-contenuto-0')?.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      immaginiContenuto[0] = await uploadFile(file);
    });
    document.getElementById('immagine-contenuto-1')?.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      immaginiContenuto[1] = await uploadFile(file);
    });

    function leggiMetodo() {
      const testo0 = (document.getElementById('metodo-testo-0') as HTMLTextAreaElement).value;
      const citazione = (document.getElementById('metodo-citazione') as HTMLInputElement).value;
      const testo1 = (document.getElementById('metodo-testo-1') as HTMLTextAreaElement).value;
      if (!testo0 && !citazione) return undefined;
      return { testi: testo1 ? [testo0, testo1] : [testo0], citazione };
    }
```

- [ ] **Step 3: Includere `immaginiContenuto` e `metodo` nel payload**

```typescript
      const payload = {
        titolo: formData.get('titolo'),
        committente: formData.get('committente'),
        anno: formData.get('anno') || undefined,
        tipo: formData.get('tipo'),
        intro: formData.get('intro'),
        sezioni,
        immagini,
        immaginiContenuto,
        metodo: leggiMetodo(),
      };
```

- [ ] **Step 4: Verificare con build**

Run: `pnpm run build`
Expected: `Complete!`

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/progetti/[id].astro
git commit -m "feat(progetti): immagini_contenuto (2 slot) e blocco metodo"
```

---

### Task 9: Endpoint creazione — POST progetti e team

**Files:**
- Create: `src/pages/api/admin/progetti/index.ts`
- Create: `src/pages/api/admin/team/index.ts`
- Test: `tests/admin-progetti-create.test.ts` (nuovo)
- Test: `tests/admin-team-create.test.ts` (nuovo)

- [ ] **Step 1: Scrivere il test che fallisce (progetti)**

```typescript
// tests/admin-progetti-create.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockSelect, mockInsert, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockFrom: vi.fn(),
}));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

import { POST } from '../src/pages/api/admin/progetti/index';

function buildRequest(body: unknown) {
  return new Request('http://localhost/api/admin/progetti', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/progetti', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockSelect.mockReset();
    mockInsert.mockReset();
    mockFrom.mockReset();
    mockFrom.mockReturnValue({ insert: mockInsert });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 'nuovo-id' }, error: null }) });
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('crea un progetto con slug/titolo/tipo e defaulta sezioni/immagini a []', async () => {
    const request = buildRequest({ slug: 'nuovo', titolo: 'Nuovo progetto', tipo: 'horizontal' });
    const res = await POST({ request, cookies: {} } as any);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.id).toBe('nuovo-id');
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ sezioni: [], immagini: [] }));
  });

  it('rifiuta senza slug', async () => {
    const request = buildRequest({ titolo: 'Senza slug', tipo: 'horizontal' });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(400);
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = buildRequest({ slug: 'x', titolo: 'x', tipo: 'horizontal' });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `pnpm test -- admin-progetti-create`
Expected: FAIL — il file `src/pages/api/admin/progetti/index.ts` non esiste.

- [ ] **Step 3: Creare l'endpoint**

```typescript
// src/pages/api/admin/progetti/index.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { progettoSchema } from '../../../../lib/validation/progetto';
import { parseJsonBody } from '../../../../lib/parse-json-body';

// Schema di creazione: slug/titolo/tipo obbligatori (come nello schema pieno), tutto
// il resto opzionale — a differenza del PATCH (che usa .partial() su TUTTO), qui
// serve mantenere l'obbligatorietà dei 3 campi minimi mentre sezioni/immagini (array
// non-optional nello schema pieno) diventano opzionali per permettere un form di
// creazione minimo che non li invia affatto.
const progettoCreateSchema = progettoSchema.partial({
  committente: true,
  anno: true,
  intro: true,
  sezioni: true,
  metodo: true,
  immagini: true,
  immaginiContenuto: true,
  ordine: true,
  archiviato: true,
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return new Response(JSON.stringify({ error: 'Body JSON mancante o non valido' }), { status: 400 });
  }

  const parsed = progettoCreateSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: z.flattenError(parsed.error) }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('bc_projects')
    .insert({
      ...parsed.data,
      sezioni: parsed.data.sezioni ?? [],
      immagini: parsed.data.immagini ?? [],
    })
    .select('id')
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ id: data.id }), { status: 200 });
};
```

- [ ] **Step 4: Eseguire il test e verificare che passi**

Run: `pnpm test -- admin-progetti-create`
Expected: PASS

- [ ] **Step 5: Ripetere Step 1-4 per team**

Test (`tests/admin-team-create.test.ts`), stesso pattern con `bc_team_members`/`teamMemberSchema`:

```typescript
// tests/admin-team-create.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockSelect, mockInsert, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockFrom: vi.fn(),
}));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

import { POST } from '../src/pages/api/admin/team/index';

function buildRequest(body: unknown) {
  return new Request('http://localhost/api/admin/team', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/team', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockSelect.mockReset();
    mockInsert.mockReset();
    mockFrom.mockReset();
    mockFrom.mockReturnValue({ insert: mockInsert });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: 'nuovo-id' }, error: null }) });
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('crea un membro con solo nome', async () => {
    const request = buildRequest({ nome: 'Nuovo membro' });
    const res = await POST({ request, cookies: {} } as any);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.id).toBe('nuovo-id');
  });

  it('rifiuta senza nome', async () => {
    const request = buildRequest({});
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(400);
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const request = buildRequest({ nome: 'x' });
    const res = await POST({ request, cookies: {} } as any);
    expect(res.status).toBe(401);
  });
});
```

Endpoint:

```typescript
// src/pages/api/admin/team/index.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSupabaseServerClient } from '../../../../lib/supabase';
import { teamMemberSchema } from '../../../../lib/validation/team';
import { parseJsonBody } from '../../../../lib/parse-json-body';

const teamMemberCreateSchema = teamMemberSchema.partial({
  ruolo: true,
  bio: true,
  foto_url: true,
  ordine: true,
  archiviato: true,
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return new Response(JSON.stringify({ error: 'Body JSON mancante o non valido' }), { status: 400 });
  }

  const parsed = teamMemberCreateSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: z.flattenError(parsed.error) }), { status: 400 });
  }

  const { data, error } = await supabase.from('bc_team_members').insert(parsed.data).select('id').single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ id: data.id }), { status: 200 });
};
```

- [ ] **Step 6: Eseguire entrambi i test**

Run: `pnpm test -- admin-progetti-create admin-team-create`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/pages/api/admin/progetti/index.ts src/pages/api/admin/team/index.ts tests/admin-progetti-create.test.ts tests/admin-team-create.test.ts
git commit -m "feat(api): endpoint POST creazione progetto e membro team"
```

---

### Task 10: Pagine di creazione

**Files:**
- Create: `src/pages/admin/progetti/nuovo.astro`
- Create: `src/pages/admin/team/nuovo.astro`

- [ ] **Step 1: Creare `src/pages/admin/progetti/nuovo.astro`**

```astro
---
import AdminLayout from '../../../layouts/AdminLayout.astro';
---
<AdminLayout title="Nuovo lavoro" backHref="/admin/progetti" backLabel="Torna ai lavori">
  <section class="max-w-[680px]">
    <form id="nuovo-progetto-form" class="flex flex-col gap-bc-md">
      <label>Slug <input name="slug" required class="border border-bc-black px-bc-md py-bc-xs w-full" /></label>
      <label>Titolo <input name="titolo" required class="border border-bc-black px-bc-md py-bc-xs w-full" /></label>
      <label>Tipo
        <select name="tipo" class="border border-bc-black px-bc-md py-bc-xs w-full">
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </label>
      <button type="submit" class="bc-btn">Crea e continua</button>
    </form>
    <p id="nuovo-progetto-error" class="text-red-600 mt-bc-sm hidden"></p>
  </section>
  <script>
    const form = document.getElementById('nuovo-progetto-form') as HTMLFormElement;
    const errorEl = document.getElementById('nuovo-progetto-error')!;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.classList.add('hidden');
      const formData = new FormData(form);
      const res = await fetch('/api/admin/progetti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.get('slug'),
          titolo: formData.get('titolo'),
          tipo: formData.get('tipo'),
        }),
      });
      const json = await res.json();
      if (res.ok) {
        window.location.href = `/admin/progetti/${json.id}`;
      } else {
        errorEl.textContent = typeof json.error === 'string' ? json.error : JSON.stringify(json.error);
        errorEl.classList.remove('hidden');
      }
    });
  </script>
</AdminLayout>
```

- [ ] **Step 2: Creare `src/pages/admin/team/nuovo.astro`**

```astro
---
import AdminLayout from '../../../layouts/AdminLayout.astro';
---
<AdminLayout title="Nuovo membro" backHref="/admin/team" backLabel="Torna al team">
  <section class="max-w-[680px]">
    <form id="nuovo-membro-form" class="flex flex-col gap-bc-md">
      <label>Nome <input name="nome" required class="border border-bc-black px-bc-md py-bc-xs w-full" /></label>
      <button type="submit" class="bc-btn">Crea e continua</button>
    </form>
    <p id="nuovo-membro-error" class="text-red-600 mt-bc-sm hidden"></p>
  </section>
  <script>
    const form = document.getElementById('nuovo-membro-form') as HTMLFormElement;
    const errorEl = document.getElementById('nuovo-membro-error')!;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.classList.add('hidden');
      const formData = new FormData(form);
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: formData.get('nome') }),
      });
      const json = await res.json();
      if (res.ok) {
        window.location.href = `/admin/team/${json.id}`;
      } else {
        errorEl.textContent = typeof json.error === 'string' ? json.error : JSON.stringify(json.error);
        errorEl.classList.remove('hidden');
      }
    });
  </script>
</AdminLayout>
```

- [ ] **Step 3: Verificare con build**

Run: `pnpm run build`
Expected: `Complete!`

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/progetti/nuovo.astro src/pages/admin/team/nuovo.astro
git commit -m "feat(admin): pagine di creazione nuovo progetto e nuovo membro"
```

---

### Task 11: Lista Progetti — filtro attivi + sezione Archiviati

**Files:**
- Modify: `src/pages/admin/progetti/index.astro`

- [ ] **Step 1: Filtrare la query esistente e aggiungerne una per gli archiviati**

Sostituire:
```astro
const supabase = createSupabaseServerClient(Astro.cookies, Astro.request);
const { data: progetti } = await supabase.from('bc_projects').select('id, slug, titolo, committente, ordine').order('ordine');
```
con:
```astro
const supabase = createSupabaseServerClient(Astro.cookies, Astro.request);
const { data: progetti } = await supabase.from('bc_projects').select('id, slug, titolo, committente, ordine').eq('archiviato', false).order('ordine');
const { data: archiviati } = await supabase.from('bc_projects').select('id, titolo, committente').eq('archiviato', true).order('titolo');
```

- [ ] **Step 2: Aggiungere il link "Nuovo" e la sezione Archiviati al markup**

Sostituire l'apertura:
```astro
<AdminLayout title="Lavori">
  <ul id="progetti-list" class="flex flex-col divide-y divide-bc-black border-t border-bc-black">
```
con:
```astro
<AdminLayout title="Lavori">
  <a href="/admin/progetti/nuovo" class="bc-btn inline-block mb-bc-md">+ Nuovo progetto</a>
  <ul id="progetti-list" class="flex flex-col divide-y divide-bc-black border-t border-bc-black">
```

Dopo la chiusura `</ul>` e prima di `<p id="reorder-status" ...>`, aggiungere:
```astro
  {archiviati && archiviati.length > 0 && (
    <div class="mt-bc-2xl">
      <p class="font-sans text-[14px] font-normal mb-bc-sm">Archiviati</p>
      <ul class="flex flex-col divide-y divide-bc-black border-t border-bc-black">
        {archiviati.map((p) => (
          <li class="flex items-center justify-between py-[14px]">
            <span class="font-sans text-[15px] font-light text-bc-black/60">{p.titolo} — {p.committente}</span>
            <span class="flex gap-bc-sm">
              <button data-action="ripristina" data-id={p.id} class="bc-ghost text-[13px]">Ripristina</button>
              <button data-action="elimina" data-id={p.id} class="bc-ghost text-[13px] text-red-600">Elimina definitivamente</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )}
```

- [ ] **Step 3: Aggiungere la logica JS per Ripristina/Elimina**

In fondo al blocco `<script>` esistente (dopo il listener `drop`), aggiungere:

```typescript
  document.querySelectorAll('[data-action="ripristina"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).dataset.id;
      const res = await fetch(`/api/admin/progetti/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archiviato: false }),
      });
      if (res.ok) window.location.reload();
    });
  });

  document.querySelectorAll('[data-action="elimina"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).dataset.id;
      if (!confirm('Cancellazione irreversibile. Continuare?')) return;
      const res = await fetch(`/api/admin/progetti/${id}`, { method: 'DELETE' });
      if (res.ok) window.location.reload();
    });
  });
```

- [ ] **Step 4: Verificare con build**

Run: `pnpm run build`
Expected: `Complete!`

- [ ] **Step 5: Verifica manuale del drag-and-drop**

Avviare `pnpm run dev`, aprire `/admin/progetti`, verificare che il drag-and-drop della lista attivi funzioni ancora (non rotto dall'aggiunta della sezione Archiviati sotto) e che comparire/sparire dalla sezione Archiviati funzioni.

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/progetti/index.astro
git commit -m "feat(progetti): lista filtra archiviati, aggiunge sezione Archiviati e link Nuovo"
```

---

### Task 12: Lista Team — filtro attivi + sezione Archiviati + link Nuovo

**Files:**
- Modify: `src/pages/admin/team/index.astro`

- [ ] **Step 1: Riscrivere il file**

```astro
---
import AdminLayout from '../../../layouts/AdminLayout.astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

const supabase = createSupabaseServerClient(Astro.cookies, Astro.request);
const { data: team } = await supabase.from('bc_team_members').select('id, nome, ruolo').eq('archiviato', false).order('ordine');
const { data: archiviati } = await supabase.from('bc_team_members').select('id, nome, ruolo').eq('archiviato', true).order('nome');
---
<AdminLayout title="Team">
  <a href="/admin/team/nuovo" class="bc-btn inline-block mb-bc-md">+ Nuovo membro</a>
  <ul class="flex flex-col divide-y divide-bc-black border-t border-bc-black">
    {team?.map((m) => (
      <li>
        <a href={`/admin/team/${m.id}`} class="flex items-center justify-between py-[14px] font-sans text-[15px] font-light text-bc-black tracking-[0.02em] hover:underline">
          <span>{m.nome}</span>
          <span class="text-bc-black/50 text-[13px]">{m.ruolo}</span>
        </a>
      </li>
    ))}
  </ul>

  {archiviati && archiviati.length > 0 && (
    <div class="mt-bc-2xl">
      <p class="font-sans text-[14px] font-normal mb-bc-sm">Archiviati</p>
      <ul class="flex flex-col divide-y divide-bc-black border-t border-bc-black">
        {archiviati.map((m) => (
          <li class="flex items-center justify-between py-[14px]">
            <span class="font-sans text-[15px] font-light text-bc-black/60">{m.nome} — {m.ruolo}</span>
            <span class="flex gap-bc-sm">
              <button data-action="ripristina" data-id={m.id} class="bc-ghost text-[13px]">Ripristina</button>
              <button data-action="elimina" data-id={m.id} class="bc-ghost text-[13px] text-red-600">Elimina definitivamente</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )}

  <script>
    document.querySelectorAll('[data-action="ripristina"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = (btn as HTMLElement).dataset.id;
        const res = await fetch(`/api/admin/team/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archiviato: false }),
        });
        if (res.ok) window.location.reload();
      });
    });

    document.querySelectorAll('[data-action="elimina"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = (btn as HTMLElement).dataset.id;
        if (!confirm('Cancellazione irreversibile. Continuare?')) return;
        const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
        if (res.ok) window.location.reload();
      });
    });
  </script>
</AdminLayout>
```

- [ ] **Step 2: Verificare con build**

Run: `pnpm run build`
Expected: `Complete!`

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/team/index.astro
git commit -m "feat(team): lista filtra archiviati, aggiunge sezione Archiviati e link Nuovo"
```

---

### Task 13: Verifica finale

**Files:** nessuna modifica, solo verifica.

- [ ] **Step 1: Suite di test completa**

Run: `pnpm test`
Expected: tutti i test passano, inclusi quelli nuovi di questo piano.

- [ ] **Step 2: Build**

Run: `pnpm run build`
Expected: `Complete!`, nessun errore.

- [ ] **Step 3: Type-check**

Run: `pnpm astro check` (se presente come script — verificare in `package.json`)
Expected: nessun errore di tipo.

- [ ] **Step 4: Verifica manuale end-to-end**

Con `pnpm run dev` attivo:
1. `/admin/progetti/nuovo` → crea un progetto di prova (slug `test-crud`, titolo `Test CRUD`, tipo horizontal).
2. Nella pagina di modifica risultante, compilare tutti i campi: anno, intro, una sezione con 2 paragrafi, un'immagine galleria (upload reale), le 2 immagini contenuto, il blocco metodo. Salvare.
3. Visitare `/lavori/test-crud` e verificare che tutto sia renderizzato (sezione, immagini, metodo, le due sezioni immagine-contenuto ora popolate invece che vuote).
4. Tornare su `/admin/progetti/test-crud`, cliccare "Archivia" → verificare redirect a `/admin/progetti` e che il progetto non sia più nella lista principale ma appaia in "Archiviati".
5. Visitare di nuovo `/lavori/test-crud` → deve dare 404 (progetto archiviato, non più pubblico).
6. Da "Archiviati", cliccare "Ripristina" → verificare che torni nella lista principale e che `/lavori/test-crud` funzioni di nuovo.
7. Ripetere l'archiviazione, poi "Elimina definitivamente" dall'archivio → verificare che sparisca anche da lì.
8. Ripetere un ciclo equivalente più breve per un membro team di prova (`/admin/team/nuovo` → crea → archivia → ripristina → elimina).

- [ ] **Step 5: Riportare risultato**

Se tutto passa, il lavoro è completo. Riportare a Max: cosa è stato aggiunto, che il prerequisito manuale (bucket `barbara-costantini-progetti`) va creato prima che l'upload immagini funzioni in produzione, e che il branch è pronto per PR.
