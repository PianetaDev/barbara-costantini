-- supabase/migrations/20260708100000_bc_cms_schema.sql

-- Ruoli admin: collega auth.users (Supabase Auth) a un ruolo applicativo
create table if not exists bc_admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('superadmin', 'editor')),
  invited_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table bc_admin_users enable row level security;

create policy "admin_users_select_own_or_superadmin"
  on bc_admin_users for select
  using (
    auth.uid() = id
    or exists (select 1 from bc_admin_users u where u.id = auth.uid() and u.role = 'superadmin')
  );

create policy "admin_users_manage_superadmin_only"
  on bc_admin_users for all
  using (exists (select 1 from bc_admin_users u where u.id = auth.uid() and u.role = 'superadmin'))
  with check (exists (select 1 from bc_admin_users u where u.id = auth.uid() and u.role = 'superadmin'));

-- Collection: progetti
create table if not exists bc_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titolo text not null,
  committente text,
  anno text,
  tipo text check (tipo in ('horizontal', 'vertical')),
  intro text,
  sezioni jsonb not null default '[]',
  metodo jsonb,
  immagini jsonb not null default '[]',
  ordine integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table bc_projects enable row level security;

create policy "projects_public_read" on bc_projects for select using (true);
create policy "projects_admin_write"
  on bc_projects for all
  using (exists (select 1 from bc_admin_users u where u.id = auth.uid()))
  with check (exists (select 1 from bc_admin_users u where u.id = auth.uid()));

-- Collection: team
create table if not exists bc_team_members (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ruolo text,
  bio text,
  foto_url text,
  ordine integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table bc_team_members enable row level security;

create policy "team_public_read" on bc_team_members for select using (true);
create policy "team_admin_write"
  on bc_team_members for all
  using (exists (select 1 from bc_admin_users u where u.id = auth.uid()))
  with check (exists (select 1 from bc_admin_users u where u.id = auth.uid()));

-- Singleton: contenuto di pagina (home, studio, servizi, contatti)
create table if not exists bc_page_content (
  page text primary key check (page in ('home', 'studio', 'servizi', 'contatti')),
  content jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
alter table bc_page_content enable row level security;

create policy "page_content_public_read" on bc_page_content for select using (true);
create policy "page_content_admin_write"
  on bc_page_content for all
  using (exists (select 1 from bc_admin_users u where u.id = auth.uid()))
  with check (exists (select 1 from bc_admin_users u where u.id = auth.uid()));
