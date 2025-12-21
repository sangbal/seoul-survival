-- Nickname Registry (ClickSurvivor)
-- Global unique nickname enforcement
-- Run this once in Supabase SQL Editor (dev/prod separately).

-- Create nickname_registry table
create table if not exists public.nickname_registry (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null,
  nickname_key text not null,  -- NFC normalized + lowercase for comparison
  nickname_raw text not null,  -- Display name (normalized raw)
  user_id uuid not null references auth.users(id) on delete cascade,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  -- Global unique constraint: nickname_key per game_slug
  unique (game_slug, nickname_key),
  -- One nickname per user per game
  unique (game_slug, user_id)
);

-- Indexes for efficient queries
create index if not exists idx_nickname_registry_game_slug_key 
  on public.nickname_registry(game_slug, nickname_key);

create index if not exists idx_nickname_registry_user_id 
  on public.nickname_registry(user_id);

-- Auto-update updated_at
create or replace function public.set_nickname_registry_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_nickname_registry_updated_at on public.nickname_registry;
create trigger trg_nickname_registry_updated_at
before update on public.nickname_registry
for each row
execute function public.set_nickname_registry_updated_at();

alter table public.nickname_registry enable row level security;

-- Policies: users can read all registry entries (for availability check)
-- but can only claim/update their own entries
drop policy if exists "nickname_registry_select_all" on public.nickname_registry;
create policy "nickname_registry_select_all"
on public.nickname_registry
for select
to authenticated, anon
using (true);

drop policy if exists "nickname_registry_insert_own" on public.nickname_registry;
create policy "nickname_registry_insert_own"
on public.nickname_registry
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "nickname_registry_update_own" on public.nickname_registry;
create policy "nickname_registry_update_own"
on public.nickname_registry
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "nickname_registry_delete_own" on public.nickname_registry;
create policy "nickname_registry_delete_own"
on public.nickname_registry
for delete
to authenticated
using (auth.uid() = user_id);

-- RPC Function: Claim nickname (atomic operation)
-- Returns success status and error type if failed
DROP FUNCTION IF EXISTS public.claim_nickname(text, text, text, uuid);

CREATE OR REPLACE FUNCTION public.claim_nickname(
  p_game_slug text,
  p_nickname_key text,
  p_nickname_raw text,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_user_id uuid;
  v_result jsonb;
BEGIN
  -- Check if nickname_key is already taken by another user
  SELECT user_id INTO v_existing_user_id
  FROM public.nickname_registry
  WHERE game_slug = p_game_slug
    AND nickname_key = p_nickname_key
  LIMIT 1;

  IF v_existing_user_id IS NOT NULL AND v_existing_user_id != p_user_id THEN
    -- Nickname already taken by another user
    RETURN jsonb_build_object(
      'success', false,
      'error', 'taken',
      'message', 'Nickname already taken'
    );
  END IF;

  -- Check if user already has a nickname for this game
  -- If exists, update it; otherwise insert
  INSERT INTO public.nickname_registry (
    game_slug,
    nickname_key,
    nickname_raw,
    user_id
  )
  VALUES (
    p_game_slug,
    p_nickname_key,
    p_nickname_raw,
    p_user_id
  )
  ON CONFLICT (game_slug, user_id)
  DO UPDATE SET
    nickname_key = EXCLUDED.nickname_key,
    nickname_raw = EXCLUDED.nickname_raw,
    updated_at = now();

  -- Update leaderboard nickname to match
  UPDATE public.leaderboard
  SET nickname = p_nickname_raw
  WHERE game_slug = p_game_slug
    AND user_id = p_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Nickname claimed successfully'
  );
EXCEPTION
  WHEN unique_violation THEN
    -- Race condition: another transaction claimed it first
    RETURN jsonb_build_object(
      'success', false,
      'error', 'taken',
      'message', 'Nickname already taken (race condition)'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'unknown',
      'message', SQLERRM
    );
END;
$$;

-- RPC Function: Release nickname (for account deletion)
-- Removes nickname claim from registry, allowing the nickname to be claimed by others
DROP FUNCTION IF EXISTS public.release_nickname(text, uuid);

CREATE OR REPLACE FUNCTION public.release_nickname(
  p_game_slug text,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_released_key text;
BEGIN
  -- Get the nickname_key before deletion (for logging/debugging)
  SELECT nickname_key INTO v_released_key
  FROM public.nickname_registry
  WHERE game_slug = p_game_slug
    AND user_id = p_user_id
  LIMIT 1;

  -- Delete the nickname claim
  DELETE FROM public.nickname_registry
  WHERE game_slug = p_game_slug
    AND user_id = p_user_id;

  -- Check if any row was deleted
  IF v_released_key IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Nickname released successfully',
      'released_key', v_released_key
    );
  ELSE
    -- No nickname was claimed for this user/game
    RETURN jsonb_build_object(
      'success', true,
      'message', 'No nickname to release',
      'released_key', NULL
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'unknown',
      'message', SQLERRM
    );
END;
$$;

