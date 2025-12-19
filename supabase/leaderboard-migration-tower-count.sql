-- Quick fix: Add tower_count column to existing leaderboard table
-- Run this if you get "column tower_count does not exist" error

-- Step 1: Add tower_count column (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leaderboard' 
    AND column_name = 'tower_count'
  ) THEN
    ALTER TABLE public.leaderboard 
    ADD COLUMN tower_count integer NOT NULL DEFAULT 0;
    
    RAISE NOTICE 'tower_count column added successfully';
  ELSE
    RAISE NOTICE 'tower_count column already exists';
  END IF;
END $$;

-- Step 2: Create composite index for prestige ranking (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_leaderboard_ranking 
ON public.leaderboard(game_slug, tower_count DESC, total_assets DESC);

-- Step 3: Drop existing get_my_rank function if it exists (to avoid return type conflict)
DROP FUNCTION IF EXISTS public.get_my_rank(text, text, text);

-- Step 4: Create/update get_my_rank RPC function
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

