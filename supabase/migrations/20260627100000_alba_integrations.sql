-- Alba v0 — integrations (OAuth tokens per Google Calendar etc.)

create table if not exists alba_integrations (
  provider          text not null,           -- 'google_calendar', 'cal_com', ...
  owner_email       text not null,           -- 'info@pianeta.studio' (chi possiede l'agenda)
  refresh_token     text not null,
  access_token      text,
  access_token_exp  timestamptz,
  scopes            text[],
  meta              jsonb,                   -- es. { calendar_id: 'primary', event_type: '...' }
  updated_at        timestamptz not null default now(),
  primary key (provider, owner_email)
);

alter table alba_integrations enable row level security;
-- Solo service_role accede; nessuna policy pubblica.
