# Task — Barbara Costantini

## Cosa fa Claude in autonomia

Esegui questi comandi nel terminale:

```bash
# Merge e deploy
git checkout main
git merge develop
git push origin main
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_GVdCmZxWV5v2fhlDSXgF25z9hWQx/dpr1SMM5BR"
git checkout develop
```

---

## Cosa deve fare Max (solo dashboard, niente terminale)

### Supabase — SQL Editor
Vai su supabase.com → progetto `fmplfkzqexaposaamgwi` → SQL Editor → incolla ed esegui:

```sql
alter table bc_projects
  add column if not exists blocks jsonb not null default '[]'::jsonb;
```

### Supabase — Storage
Vai su Storage → New Bucket:
- Nome: `barbara-costantini-progetti`
- Visibilità: Public

---

## Feature ancora da sviluppare (prossime sessioni)

- Creazione nuovo progetto dall'admin
- Editor pagine statiche: Home, Studio, Servizi, Contatti
- Editor testi Cookie e Privacy
- Modifica dati Footer
- Progetti "in evidenza" per la home
- Progetti correlati nella pagina dettaglio
