-- Sync leaderboard from game_saves
-- 이 스크립트는 game_saves 테이블의 저장 데이터를 읽어서
-- 리더보드에 누락된 기록을 동기화합니다.
-- 
-- 실행 방법: Supabase SQL Editor에서 실행
-- 주의: 이 스크립트는 SECURITY DEFINER로 실행되므로 관리자 권한이 필요합니다.

-- Step 1: game_saves에서 닉네임이 있는 저장 데이터를 읽어서 리더보드에 동기화
-- (이미 리더보드에 있는 기록은 업데이트, 없는 기록은 추가)

INSERT INTO public.leaderboard (
  user_id,
  game_slug,
  nickname,
  total_assets,
  play_time_ms,
  tower_count,
  updated_at,
  created_at
)
SELECT 
  gs.user_id,
  gs.game_slug,
  COALESCE(gs.save->>'nickname', '익명') as nickname,
  COALESCE(FLOOR((gs.save->>'cash')::numeric)::bigint, 0) + 
    COALESCE(FLOOR((gs.save->>'deposits')::numeric)::bigint * 1000000, 0) +
    COALESCE(FLOOR((gs.save->>'savings')::numeric)::bigint * 2000000, 0) +
    COALESCE(FLOOR((gs.save->>'bonds')::numeric)::bigint * 5000000, 0) +
    COALESCE(FLOOR((gs.save->>'usStocks')::numeric)::bigint * 10000000, 0) +
    COALESCE(FLOOR((gs.save->>'cryptos')::numeric)::bigint * 20000000, 0) +
    COALESCE(FLOOR((gs.save->>'villas')::numeric)::bigint * 50000000, 0) +
    COALESCE(FLOOR((gs.save->>'officetels')::numeric)::bigint * 100000000, 0) +
    COALESCE(FLOOR((gs.save->>'apartments')::numeric)::bigint * 200000000, 0) +
    COALESCE(FLOOR((gs.save->>'shops')::numeric)::bigint * 500000000, 0) +
    COALESCE(FLOOR((gs.save->>'buildings')::numeric)::bigint * 1000000000, 0) +
    COALESCE(FLOOR((gs.save->>'towers')::numeric)::bigint * 10000000000, 0) as total_assets,
  COALESCE(FLOOR((gs.save->>'totalPlayTime')::numeric)::bigint, 0) as play_time_ms,
  COALESCE(FLOOR((gs.save->>'towers')::numeric)::integer, 0) as tower_count,
  now() as updated_at,
  now() as created_at
FROM public.game_saves gs
WHERE 
  gs.game_slug = 'seoulsurvival'
  AND gs.save->>'nickname' IS NOT NULL
  AND gs.save->>'nickname' != ''
  AND NOT EXISTS (
    SELECT 1 
    FROM public.leaderboard lb 
    WHERE lb.user_id = gs.user_id 
    AND lb.game_slug = gs.game_slug
  )
ON CONFLICT (user_id, game_slug) 
DO UPDATE SET
  nickname = EXCLUDED.nickname,
  total_assets = EXCLUDED.total_assets,
  play_time_ms = EXCLUDED.play_time_ms,
  tower_count = EXCLUDED.tower_count,
  updated_at = EXCLUDED.updated_at;

-- Step 2: 이미 리더보드에 있는 기록도 game_saves의 최신 데이터로 업데이트
UPDATE public.leaderboard lb
SET
  nickname = COALESCE(gs.save->>'nickname', lb.nickname),
  total_assets = COALESCE(
    FLOOR((gs.save->>'cash')::numeric)::bigint, 0) + 
    COALESCE(FLOOR((gs.save->>'deposits')::numeric)::bigint * 1000000, 0) +
    COALESCE(FLOOR((gs.save->>'savings')::numeric)::bigint * 2000000, 0) +
    COALESCE(FLOOR((gs.save->>'bonds')::numeric)::bigint * 5000000, 0) +
    COALESCE(FLOOR((gs.save->>'usStocks')::numeric)::bigint * 10000000, 0) +
    COALESCE(FLOOR((gs.save->>'cryptos')::numeric)::bigint * 20000000, 0) +
    COALESCE(FLOOR((gs.save->>'villas')::numeric)::bigint * 50000000, 0) +
    COALESCE(FLOOR((gs.save->>'officetels')::numeric)::bigint * 100000000, 0) +
    COALESCE(FLOOR((gs.save->>'apartments')::numeric)::bigint * 200000000, 0) +
    COALESCE(FLOOR((gs.save->>'shops')::numeric)::bigint * 500000000, 0) +
    COALESCE(FLOOR((gs.save->>'buildings')::numeric)::bigint * 1000000000, 0) +
    COALESCE(FLOOR((gs.save->>'towers')::numeric)::bigint * 10000000000, 0),
  play_time_ms = COALESCE(FLOOR((gs.save->>'totalPlayTime')::numeric)::bigint, lb.play_time_ms),
  tower_count = COALESCE(FLOOR((gs.save->>'towers')::numeric)::integer, lb.tower_count),
  updated_at = now()
FROM public.game_saves gs
WHERE 
  lb.user_id = gs.user_id
  AND lb.game_slug = gs.game_slug
  AND gs.game_slug = 'seoulsurvival'
  AND gs.save->>'nickname' IS NOT NULL
  AND gs.save->>'nickname' != '';

-- 참고: 위 계산식은 간단한 예시입니다.
-- 실제로는 게임 내 calculateTotalAssetValue() 함수와 동일한 로직을 사용해야 합니다.
-- 더 정확한 동기화를 위해서는 게임 내에서 수동 동기화 버튼을 사용하는 것을 권장합니다.

