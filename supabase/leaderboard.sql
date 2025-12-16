-- Leaderboard (ClickSurvivor)
-- Run this once in Supabase SQL Editor (dev/prod separately).

create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_slug text not null,
  nickname text not null,
  total_assets bigint not null default 0,
  play_time_ms bigint not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, game_slug)
);

-- Indexes for efficient leaderboard queries
create index if not exists idx_leaderboard_game_slug_total_assets 
  on public.leaderboard(game_slug, total_assets desc);

create index if not exists idx_leaderboard_game_slug_play_time 
  on public.leaderboard(game_slug, play_time_ms desc);

-- Auto-update updated_at
create or replace function public.set_leaderboard_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leaderboard_updated_at on public.leaderboard;
create trigger trg_leaderboard_updated_at
before update on public.leaderboard
for each row
execute function public.set_leaderboard_updated_at();

alter table public.leaderboard enable row level security;

-- Policies: users can read all leaderboard entries (for public leaderboard)
-- but can only update their own entries
drop policy if exists "leaderboard_select_all" on public.leaderboard;
create policy "leaderboard_select_all"
on public.leaderboard
for select
to authenticated, anon
using (true);

drop policy if exists "leaderboard_insert_own" on public.leaderboard;
create policy "leaderboard_insert_own"
on public.leaderboard
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "leaderboard_update_own" on public.leaderboard;
create policy "leaderboard_update_own"
on public.leaderboard
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "leaderboard_delete_own" on public.leaderboard;
create policy "leaderboard_delete_own"
on public.leaderboard
for delete
to authenticated
using (auth.uid() = user_id);

