-- 22.1 Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "profiles read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles upsert own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);

-- 22.2 MMA Saves
create table if not exists public.mma_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  slot int not null,                           -- 1..N
  title text not null default 'Save',

  game_version int not null default 1,         -- App Version
  save_version int not null default 1,         -- GameState schema version
  state jsonb not null,                        -- GameState full dump

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id, slot)
);

create index if not exists idx_mma_saves_user on public.mma_saves(user_id);

alter table public.mma_saves enable row level security;

create policy "mma_saves read own" on public.mma_saves
  for select using (auth.uid() = user_id);

create policy "mma_saves insert own" on public.mma_saves
  for insert with check (auth.uid() = user_id);

create policy "mma_saves update own" on public.mma_saves
  for update using (auth.uid() = user_id);

create policy "mma_saves delete own" on public.mma_saves
  for delete using (auth.uid() = user_id);

-- 22.3 Leaderboard (Optional)
create table if not exists public.mma_leaderboard (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  best_tier int not null default 6,
  best_cash bigint not null default 0,
  best_year int,
  updated_at timestamptz default now()
);

alter table public.mma_leaderboard enable row level security;

create policy "mma_leaderboard read all" on public.mma_leaderboard
  for select using (true);

create policy "mma_leaderboard insert own" on public.mma_leaderboard
  for insert with check (auth.uid() = user_id);

create policy "mma_leaderboard update own" on public.mma_leaderboard
  for update using (auth.uid() = user_id);
