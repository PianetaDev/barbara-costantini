# Task pendenti — Barbara Costantini

Esegui questi task nell'ordine indicato.

---

## 1. Supabase — aggiungi colonna `blocks`

Vai su [supabase.com](https://supabase.com) → progetto `fmplfkzqexaposaamgwi` → SQL Editor → esegui:

```sql
alter table bc_projects
  add column if not exists blocks jsonb not null default '[]'::jsonb;
```

---

## 2. Supabase — crea bucket Storage

Vai su Supabase → Storage → New Bucket:
- Nome: `barbara-costantini-progetti`
- Visibilità: **Public**

---

## 3. Deploy su Vercel

Dal terminale nella cartella del repo:

```bash
git checkout main
git merge develop
git push origin main
```

Se il deploy non parte in automatico, triggeralo manualmente:

```bash
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_GVdCmZxWV5v2fhlDSXgF25z9hWQx/dpr1SMM5BR"
```

---

## Fine

Quando tutti e 3 i task sono completati, il sito di staging sarà aggiornato con il nuovo CMS admin.
