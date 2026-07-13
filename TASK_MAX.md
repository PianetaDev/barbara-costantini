# Task — Barbara Costantini

Esegui tutti i passi in ordine. Per ogni passo, prova prima in autonomia.
Se non hai accesso o un comando fallisce, chiedi a Max solo quel passaggio specifico.

---

## Passo 1 — Supabase: aggiungi colonna `blocks`

Progetto Supabase: `fmplfkzqexaposaamgwi`

Esegui questa query sul database `bc_projects`:

```sql
alter table bc_projects
  add column if not exists blocks jsonb not null default '[]'::jsonb;
```

Se hai accesso Supabase (CLI, MCP, o service role key), eseguila in autonomia.
Altrimenti chiedi a Max di incollarla nel SQL Editor su supabase.com.

---

## Passo 2 — Supabase Storage: crea bucket

Crea un bucket pubblico chiamato `barbara-costantini-progetti` nel progetto `fmplfkzqexaposaamgwi`.

Se hai accesso Supabase in autonomia, crealo via API o CLI.
Altrimenti chiedi a Max di crearlo da Storage → New Bucket → Public.

---

## Passo 3 — Deploy

Esegui dal terminale nella cartella del repo:

```bash
git checkout main
git merge develop
git push origin main
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_GVdCmZxWV5v2fhlDSXgF25z9hWQx/dpr1SMM5BR"
git checkout develop
```

---

## Fine

Quando tutti i passi sono completati, conferma a Max cosa hai fatto e cosa (se qualcosa) ha richiesto il suo intervento.
