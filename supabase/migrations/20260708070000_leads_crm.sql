-- Leads CRM — prospect commerciali multi-canale (GreenMachine, Alba, manuale)
-- Non tocca alba_* — tabella nuova, indipendente.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('green_machine','alba','manual')),
  company text,
  contact_name text,
  contact_role text,
  email text,
  url text,
  sector text,
  rating text,
  co2_per_visit text,
  status text not null default 'draft' check (status in ('draft','sent','replied','call','won','discarded')),
  notes text,
  week_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_source_status_idx on leads (source, status);

alter table leads enable row level security;
-- Solo service_role accede, nessuna policy pubblica (stesso pattern di alba_integrations).
