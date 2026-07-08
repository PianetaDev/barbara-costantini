-- Alba v0 — Foundation tables
-- Anonymous users tracked via localStorage UUID generated client-side

create table if not exists alba_users (
  uid             uuid primary key,
  email           text,
  first_name      text,
  ab_variant      text not null check (ab_variant in ('proactive', 'reactive')),
  first_seen_at   timestamptz not null default now(),
  last_seen_at    timestamptz not null default now()
);

create index if not exists alba_users_email_idx on alba_users (email) where email is not null;

create table if not exists alba_sessions (
  id              uuid primary key default gen_random_uuid(),
  uid             uuid not null references alba_users(uid) on delete cascade,
  started_at      timestamptz not null default now(),
  ended_at        timestamptz,
  page_origin     text,
  msg_count       integer not null default 0,
  tokens_in       integer not null default 0,
  tokens_out      integer not null default 0,
  cost_eur        numeric(10,4) not null default 0
);

create index if not exists alba_sessions_uid_idx on alba_sessions (uid, started_at desc);

create table if not exists alba_messages (
  id              bigserial primary key,
  session_id      uuid not null references alba_sessions(id) on delete cascade,
  ts              timestamptz not null default now(),
  role            text not null check (role in ('user', 'assistant', 'tool')),
  content         text,
  tool_name       text,
  tool_args       jsonb,
  model_id        text,
  disclosure_shown boolean not null default false
);

create index if not exists alba_messages_session_idx on alba_messages (session_id, ts);

create table if not exists alba_daily_costs (
  date            date primary key,
  total_eur       numeric(10,4) not null default 0,
  updated_at      timestamptz not null default now()
);

-- RLS: tutto server-only via service role. Niente policies pubbliche.
alter table alba_users enable row level security;
alter table alba_sessions enable row level security;
alter table alba_messages enable row level security;
alter table alba_daily_costs enable row level security;
