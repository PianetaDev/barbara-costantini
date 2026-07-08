-- Alba v0 — Phase B: events telemetry + rate limit support

create table if not exists alba_events (
  id           bigserial primary key,
  uid          uuid,
  session_id   uuid,
  ts           timestamptz not null default now(),
  event        text not null,
  variant      text,
  payload      jsonb
);

create index if not exists alba_events_event_ts_idx on alba_events (event, ts desc);
create index if not exists alba_events_session_idx on alba_events (session_id, ts);
create index if not exists alba_events_uid_idx on alba_events (uid, ts desc);

alter table alba_events enable row level security;

-- Rate limit counters (per uid + day, per IP + day, global day)
create table if not exists alba_rate_limits (
  scope        text not null,           -- 'uid:<uid>', 'ip:<ip>', 'global'
  date         date not null,
  count        integer not null default 0,
  primary key (scope, date)
);

create index if not exists alba_rate_limits_date_idx on alba_rate_limits (date);
alter table alba_rate_limits enable row level security;
