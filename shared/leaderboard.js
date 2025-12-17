// Leaderboard functions for ClickSurvivor games
import { getSupabaseClient } from './auth/supabaseClient.js';
import { getUser } from './auth/core.js';

const GAME_SLUG = 'seoulsurvival';

/**
 * 닉네임 정규화 (앞뒤 공백 제거)
 * @param {string} raw
 * @returns {string}
 */
export function normalizeNickname(raw) {
  return (raw || '').trim();
}

/**
 * 닉네임 중복 여부 확인 (대소문자 구분 없음)
 * - 비교 기준: normalizeNickname(nick).toLowerCase()를 key로 사용
 * - 데이터 소스: leaderboard 테이블의 nickname 컬럼
 * @param {string} nickname
 * @returns {Promise<{ taken: boolean, reason?: string }>}
 */
export async function isNicknameTaken(nickname) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('Leaderboard: Supabase client not configured for nickname check');
    return { taken: false, reason: 'not_configured' };
  }

  const raw = normalizeNickname(nickname);
  const key = raw.toLowerCase();
  if (!key) {
    // 빈 닉네임은 이 함수에서 막지 않고, 호출 측에서 처리
    return { taken: false, reason: 'empty' };
  }

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('nickname')
      .eq('game_slug', GAME_SLUG)
      // 대소문자 구분 없이 동일 닉네임 여부 확인
      .ilike('nickname', key)
      .limit(1);

    if (error) {
      console.error('Nickname check error:', error);
      return { taken: false, reason: 'error' };
    }

    return { taken: !!(data && data.length > 0) };
  } catch (e) {
    console.error('Nickname check exception:', e);
    return { taken: false, reason: 'exception' };
  }
}

/**
 * Update leaderboard entry for current user
 * @param {string} nickname - Player nickname
 * @param {number} totalAssets - Total assets value
 * @param {number} playTimeMs - Total play time in milliseconds
 */
export async function updateLeaderboard(nickname, totalAssets, playTimeMs) {
  try {
    const user = await getUser();
    if (!user) {
      console.log('Leaderboard: User not logged in, skipping update');
      return { success: false, error: 'Not logged in' };
    }

    const supabase = getSupabaseClient();
    
    // Upsert leaderboard entry
    const { data, error } = await supabase
      .from('leaderboard')
      .upsert({
        user_id: user.id,
        game_slug: GAME_SLUG,
        nickname: nickname || '익명',
        total_assets: totalAssets,
        play_time_ms: playTimeMs,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,game_slug'
      })
      .select()
      .single();

    if (error) {
      console.error('Leaderboard update error:', error);
      return { success: false, error: error.message };
    }

    console.log('Leaderboard updated:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Leaderboard update exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get top N leaderboard entries
 * @param {number} limit - Number of entries to fetch (default: 10)
 * @param {string} sortBy - Sort by 'assets' or 'playtime' (default: 'assets')
 */
export async function getLeaderboard(limit = 10, sortBy = 'assets') {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('Leaderboard: Supabase client not configured');
      console.warn('[LB] fetch failed', {
        reason: 'not_configured',
        phase: 'init'
      });
      return {
        success: false,
        error: 'Supabase가 설정되지 않았습니다. shared/auth/config.js를 확인해주세요.',
        data: [],
        errorType: 'config'
      };
    }
    
    let query = supabase
      .from('leaderboard')
      .select('nickname, total_assets, play_time_ms, updated_at')
      .eq('game_slug', GAME_SLUG)
      .limit(limit);

    if (sortBy === 'assets') {
      query = query.order('total_assets', { ascending: false });
    } else if (sortBy === 'playtime') {
      query = query.order('play_time_ms', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Leaderboard fetch error:', error);
      const status = error.status ?? error.code ?? null;
      const isTableMissing =
        error.code === 'PGRST116' ||
        error.message?.includes('relation') ||
        error.message?.includes('does not exist');
      const isForbidden =
        status === 401 ||
        status === 403 ||
        error.message?.toLowerCase?.().includes('permission denied') ||
        error.message?.toLowerCase?.().includes('rls');

      console.warn('[LB] fetch failed', {
        phase: 'select',
        status,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });

      if (isTableMissing) {
        return {
          success: false,
          error: '리더보드 테이블이 없습니다. Supabase SQL Editor에서 supabase/leaderboard.sql을 실행해주세요.',
          data: [],
          errorType: 'schema',
          status
        };
      }

      if (isForbidden) {
        return {
          success: false,
          error: '권한이 없어 리더보드를 불러올 수 없습니다.',
          data: [],
          errorType: 'forbidden',
          status
        };
      }

      return {
        success: false,
        error: error.message,
        data: [],
        errorType: 'generic',
        status
      };
    }

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Leaderboard fetch exception:', error);
    console.warn('[LB] fetch failed', {
      phase: 'exception',
      message: error?.message,
      error
    });

    return {
      success: false,
      error: error.message || '알 수 없는 오류',
      data: [],
      errorType: 'network'
    };
  }
}

/**
 * 내 리더보드 기록/순위 조회 (1차 버전: 순위는 TBD, 기록만 반환)
 * @param {string} nickname
 * @param {'assets' | 'playtime'} sortBy
 * @returns {Promise<{ success: boolean, data: any | null, rank: number | null }>}
 */
export async function getMyRank(nickname, sortBy = 'assets') {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('[LB] my_rank failed', { reason: 'not_configured' });
    return { success: false, data: null, errorType: 'config' };
  }

  const raw = normalizeNickname(nickname);
  const key = raw.toLowerCase();
  if (!key) {
    return { success: false, data: null, errorType: 'no_nickname' };
  }

  try {
    const { data, error, status } = await supabase.rpc('get_my_rank', {
      p_game_slug: GAME_SLUG,
      p_nickname: key,
      p_sort_by: sortBy
    });

    if (error) {
      console.error('My rank RPC error:', error);
      console.warn('[LB] my_rank failed', {
        phase: 'rpc',
        status: status ?? error.status,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      const errType =
        status === 401 || status === 403
          ? 'forbidden'
          : 'generic';
      return {
        success: false,
        data: null,
        error: error.message,
        errorType: errType,
        status: status ?? error.status
      };
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      return { success: false, data: null, errorType: 'not_found' };
    }

    return {
      success: true,
      data: {
        rank: row.rank,
        nickname: row.nickname,
        total_assets: row.total_assets,
        play_time_ms: row.play_time_ms
      }
    };
  } catch (error) {
    console.error('My rank RPC exception:', error);
    console.warn('[LB] my_rank failed', {
      phase: 'exception',
      message: error?.message,
      error
    });
    return {
      success: false,
      data: null,
      error: error.message || '알 수 없는 오류',
      errorType: 'network'
    };
  }
}

