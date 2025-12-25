-- Reviews (ClickSurvivor)
-- Run this once in Supabase SQL Editor (dev/prod separately).

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_slug text not null,
  nickname text not null,
  recommended boolean not null default true, -- thumb up/down
  summary text not null, -- 1-2 line summary
  body text, -- full review body (optional)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One review per user per game
  unique (user_id, game_slug)
);

-- Indexes for efficient queries
create index if not exists idx_reviews_game_slug_created_at 
  on public.reviews(game_slug, created_at desc);

create index if not exists idx_reviews_game_slug_recommended 
  on public.reviews(game_slug, recommended, created_at desc);

create index if not exists idx_reviews_user_id 
  on public.reviews(user_id);

-- Auto-update updated_at
create or replace function public.set_reviews_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_reviews_updated_at on public.reviews;
create trigger trg_reviews_updated_at
before update on public.reviews
for each row
execute function public.set_reviews_updated_at();

alter table public.reviews enable row level security;

-- Policies: users can read all reviews (for public display)
-- but can only create/update/delete their own reviews
drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all"
on public.reviews
for select
to authenticated, anon
using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
on public.reviews
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own"
on public.reviews
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own"
on public.reviews
for delete
to authenticated
using (auth.uid() = user_id);










