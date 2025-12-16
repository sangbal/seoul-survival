-- Cloud saves (ClickSurvivor)
-- Run this once in Supabase SQL Editor (dev/prod separately).

create extension if not exists pgcrypto;

create table if not exists public.game_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_slug text not null,
  save jsonb not null,
  save_ts bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, game_slug)
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_game_saves_updated_at on public.game_saves;
create trigger trg_game_saves_updated_at
before update on public.game_saves
for each row
execute function public.set_updated_at();

alter table public.game_saves enable row level security;

-- Policies: each user can access only their own rows
drop policy if exists "game_saves_select_own" on public.game_saves;
create policy "game_saves_select_own"
on public.game_saves
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "game_saves_insert_own" on public.game_saves;
create policy "game_saves_insert_own"
on public.game_saves
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "game_saves_update_own" on public.game_saves;
create policy "game_saves_update_own"
on public.game_saves
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "game_saves_delete_own" on public.game_saves;
create policy "game_saves_delete_own"
on public.game_saves
for delete
to authenticated
using (auth.uid() = user_id);


