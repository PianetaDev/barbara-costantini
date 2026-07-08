# supabase/ — nota sulle migrazioni in questa cartella

Questo repo (`barbara-costantini-astro-migration` / sito Barbara Costantini) **non ha un
proprio progetto Supabase**. Per decisione approvata (vedi
`2026-07-08-barbara-costantini-astro-cms-design.md`), il CMS di questo sito usa lo
**stesso progetto Supabase condiviso di `xp.pianeta.studio`** (`pianeta-xp`, ref
`fmplfkzqexaposaamgwi`) — un solo progetto Supabase per l'azienda, con tabelle, RLS e
permessi completamente separati e non sovrapposti tra i vari siti/prodotti che lo usano.

## Perché ci sono migrazioni non di Barbara Costantini in questa cartella

I file:

- `20260626100000_alba_v0_foundation.sql`
- `20260626200000_alba_events.sql`
- `20260627100000_alba_integrations.sql`
- `20260628100000_alba_user_followup.sql`
- `20260702100000_newsletter_locale.sql`
- `20260708070000_leads_crm.sql`

sono **copie verbatim** (verificate con `diff`, nessuna modifica) dei file già applicati
sul progetto Supabase condiviso, la cui fonte reale è il repo `pianeta-xp-astro-poc`
(`supabase/migrations/`). Non sono codice morto né un errore di merge.

Servono esclusivamente perché `supabase db push --linked` confronta la cronologia
migrazioni **locale** con quella **remota**: se un repo collegato allo stesso progetto
non ha localmente i file di migrazioni già applicate da un altro repo, la CLI rifiuta
il push (mismatch di cronologia), anche quando la nuova migrazione che si vuole
applicare non ha nulla a che fare con quelle già esistenti. Copiarle qui allinea la
cronologia locale a quella remota senza toccare nulla di remoto.

**Le migrazioni copiate non vanno modificate in questo repo.** Se serve cambiarle, la
modifica va fatta nel repo sorgente (`pianeta-xp-astro-poc`) e poi ricopiata qui allo
stesso modo, per mantenere la coerenza di cronologia CLI tra i repo collegati allo
stesso progetto Supabase condiviso.

## Migrazioni proprie di Barbara Costantini (CMS)

- `20260708100000_bc_cms_schema.sql` — schema iniziale: `bc_admin_users`, `bc_projects`,
  `bc_team_members`, `bc_page_content`.
- `20260709000000_bc_admin_users_rls_fix.sql` — fix ricorsione infinita nelle policy RLS
  di `bc_admin_users` (funzioni helper `security definer`).
- `20260709010000_bc_admin_functions_no_uid_param.sql` — fix disclosure: le funzioni
  helper non accettano più un parametro `uid` esterno (altrimenti esposte via RPC
  PostgREST a chiunque, anche anon, per interrogare il ruolo di un uuid a piacere); ora
  leggono sempre `auth.uid()` del chiamante.

Tutte le tabelle usano il prefisso `bc_` e vivono nello stesso schema `public` del
progetto condiviso — nessuna sovrapposizione di nomi con le tabelle di altri
siti/prodotti (bussola, alba, apotheke, forge, ecc.) verificata al momento della prima
migrazione.
