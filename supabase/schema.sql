-- VibePM Schema
-- Run this in Supabase SQL Editor

-- ── Projects table ──────────────────────────────────
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text default '',
  stage text not null default 'idea' check (stage in ('idea', 'planned', 'in-progress', 'complete')),
  "order" integer not null default 0,
  summary text default '',
  tech_stack text[] default '{}',
  files_built jsonb default '[]',
  key_decisions text[] default '{}',
  lessons_learned text[] default '{}',
  source_log_path text,
  url text,
  github_repo_url text,
  content_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Todos table ─────────────────────────────────────
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Notes table ─────────────────────────────────────
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text default '',
  updated_at timestamptz not null default now()
);

-- ── Indexes ─────────────────────────────────────────
create index idx_projects_user_stage on public.projects (user_id, stage);
create index idx_projects_user_order on public.projects (user_id, "order");
create unique index idx_projects_user_github_url
  on public.projects (user_id, github_repo_url)
  where github_repo_url is not null;
create index idx_todos_user on public.todos (user_id);
create index idx_notes_user on public.notes (user_id);

-- ── Updated_at trigger ──────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_projects
  before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_notes
  before update on public.notes
  for each row execute function public.handle_updated_at();

-- ── RLS Policies ────────────────────────────────────
alter table public.projects enable row level security;
alter table public.todos enable row level security;
alter table public.notes enable row level security;

-- Projects: users can only CRUD their own rows
create policy "Users can view own projects"
  on public.projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects"
  on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects"
  on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects"
  on public.projects for delete using (auth.uid() = user_id);

-- Todos: users can only CRUD their own rows
create policy "Users can view own todos"
  on public.todos for select using (auth.uid() = user_id);
create policy "Users can insert own todos"
  on public.todos for insert with check (auth.uid() = user_id);
create policy "Users can update own todos"
  on public.todos for update using (auth.uid() = user_id);
create policy "Users can delete own todos"
  on public.todos for delete using (auth.uid() = user_id);

-- Notes: users can only CRUD their own rows
create policy "Users can view own notes"
  on public.notes for select using (auth.uid() = user_id);
create policy "Users can insert own notes"
  on public.notes for insert with check (auth.uid() = user_id);
create policy "Users can update own notes"
  on public.notes for update using (auth.uid() = user_id);
create policy "Users can delete own notes"
  on public.notes for delete using (auth.uid() = user_id);
