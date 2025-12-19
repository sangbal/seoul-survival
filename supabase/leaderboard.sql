-- Leaderboard (ClickSurvivor)
-- Run this once in Supabase SQL Editor (dev/prod separately).

create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_slug text not null,
  nickname text not null,
  total_assets bigint not null default 0,
  play_time_ms bigint not null default 0,
  tower_count integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, game_slug)
);

-- Indexes for efficient leaderboard queries
create index if not exists idx_leaderboard_game_slug_total_assets 
  on public.leaderboard(game_slug, total_assets desc);

create index if not exists idx_leaderboard_game_slug_play_time 
  on public.leaderboard(game_slug, play_time_ms desc);

-- Composite index for prestige ranking (tower_count first, then total_assets)
create index if not exists idx_leaderboard_ranking 
  on public.leaderboard(game_slug, tower_count desc, total_assets desc);

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

-- Migration: Add tower_count column to existing table (safe to run multiple times)
-- This must run BEFORE any queries that reference tower_count
DO $$
BEGIN
  -- Check if table exists first
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'leaderboard'
  ) THEN
    -- Table exists, check if column exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'leaderboard' 
      AND column_name = 'tower_count'
    ) THEN
      ALTER TABLE public.leaderboard ADD COLUMN tower_count integer NOT NULL DEFAULT 0;
      RAISE NOTICE 'tower_count column added to existing leaderboard table';
    ELSE
      RAISE NOTICE 'tower_count column already exists';
    END IF;
  ELSE
    RAISE NOTICE 'leaderboard table does not exist yet (will be created above)';
  END IF;
END $$;

-- RPC Function: Get my rank in leaderboard
-- Returns the rank and data for a specific nickname
-- Drop existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.get_my_rank(text, text, text);

CREATE OR REPLACE FUNCTION public.get_my_rank(
  p_game_slug text,
  p_nickname text,
  p_sort_by text DEFAULT 'assets'
)
RETURNS TABLE (
  rank bigint,
  nickname text,
  total_assets bigint,
  play_time_ms bigint,
  tower_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_sort_by = 'assets' THEN
    RETURN QUERY
    WITH ranked AS (
      SELECT 
        l.nickname,
        l.total_assets,
        l.play_time_ms,
        COALESCE(l.tower_count, 0) as tower_count,
        ROW_NUMBER() OVER (
          ORDER BY 
            COALESCE(l.tower_count, 0) DESC,
            l.total_assets DESC
        ) as rnk
      FROM public.leaderboard l
      WHERE l.game_slug = p_game_slug
    )
    SELECT 
      r.rnk,
      r.nickname,
      r.total_assets,
      r.play_time_ms,
      r.tower_count
    FROM ranked r
    WHERE LOWER(r.nickname) = LOWER(p_nickname)
    LIMIT 1;
  ELSIF p_sort_by = 'playtime' THEN
    RETURN QUERY
    WITH ranked AS (
      SELECT 
        l.nickname,
        l.total_assets,
        l.play_time_ms,
        COALESCE(l.tower_count, 0) as tower_count,
        ROW_NUMBER() OVER (
          ORDER BY l.play_time_ms DESC
        ) as rnk
      FROM public.leaderboard l
      WHERE l.game_slug = p_game_slug
    )
    SELECT 
      r.rnk,
      r.nickname,
      r.total_assets,
      r.play_time_ms,
      r.tower_count
    FROM ranked r
    WHERE LOWER(r.nickname) = LOWER(p_nickname)
    LIMIT 1;
  ELSE
    RETURN;
  END IF;
END;
$$;

