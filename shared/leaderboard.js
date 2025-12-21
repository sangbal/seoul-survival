// Leaderboard functions for ClickSurvivor games
import { getSupabaseClient } from './auth/supabaseClient.js';
import { getUser } from './auth/core.js';

const GAME_SLUG = 'seoulsurvival';

// DEV 모드 체크 (Vite 기준, optional chaining 사용)
const __IS_DEV__ = !!(import.meta?.env?.DEV);

/**
 * 닉네임 정규화 (NFC + key 생성)
 * @param {string} raw - 원본 닉네임
 * @returns {{ raw: string, key: string }} - 정규화된 raw와 비교용 key
 */
export function normalizeNickname(raw) {
  if (!raw || typeof raw !== 'string') {
    return { raw: '', key: '' };
  }
  
  // 1. 앞뒤 공백 제거
  const trimmed = raw.trim();
  
  // 2. NFC 정규화 (유니코드 정규화)
  // 예: 'café'와 'cafe\u0301'를 동일하게 처리
  const nfcNormalized = trimmed.normalize('NFC');
  
  // 3. key 생성: 영문은 소문자로 변환 (대소문자 구분 없이 비교)
  const key = nfcNormalized.toLowerCase();
  
  return {
    raw: nfcNormalized,
    key: key
  };
}

/**
 * 닉네임 유효성 검사
 * @param {string} raw - 원본 닉네임
 * @returns {{ ok: boolean, reasonKey?: string }} - 유효성 결과 및 실패 이유 키
 */
export function validateNickname(raw) {
  const { raw: normalized, key } = normalizeNickname(raw);
  
  // 빈 문자열 체크
  if (!normalized || normalized.length === 0) {
    return { ok: false, reasonKey: 'empty' };
  }
  
  // 길이 체크 (1~6자)
  if (normalized.length < 1) {
    return { ok: false, reasonKey: 'tooShort' };
  }
  if (normalized.length > 6) {
    return { ok: false, reasonKey: 'tooLong' };
  }
  
  // 허용 문자 체크: 한글/영문/숫자/밑줄만 허용 (공백 불허)
  const allowedPattern = /^[가-힣a-zA-Z0-9_]+$/;
  if (!allowedPattern.test(normalized)) {
    return { ok: false, reasonKey: 'invalid' };
  }
  
  // 금칙어 체크
  if (containsBannedWord(normalized, key)) {
    return { ok: false, reasonKey: 'banned' };
  }
  
  return { ok: true };
}

/**
 * 금칙어 필터 (최소 버전)
 * @param {string} raw - 정규화된 raw 닉네임
 * @param {string} key - 정규화된 key 닉네임 (소문자)
 * @returns {boolean} - 금칙어 포함 여부
 */
export function containsBannedWord(raw, key) {
  // 최소 금칙어 리스트 (명백한 욕설/비하 중심)
  const bannedWords = [
    // 욕설 (한글)
    '시발', '좆', '개새끼', '병신', '미친', '지랄', '닥쳐', '엿', '좆까',
    // 욕설 (영문, 소문자)
    'fuck', 'shit', 'bitch', 'asshole', 'damn', 'crap', 'piss',
    // 비하 표현
    '멍청이', '바보', '등신', '호구',
    // 기타
    'admin', 'administrator', 'root', 'system', 'null', 'undefined'
  ];
  
  const lowerRaw = raw.toLowerCase();
  const lowerKey = key.toLowerCase();
  
  // key 기준으로 포함 검사 (대소문자 무시)
  for (const banned of bannedWords) {
    if (lowerKey.includes(banned.toLowerCase()) || lowerRaw.includes(banned.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

/**
 * 닉네임 중복 여부 확인 (레거시 호환용, registry 기반으로 변경 권장)
 * @deprecated Use claimNickname for new code (provides atomic uniqueness guarantee)
 * @param {string} nickname
 * @returns {Promise<{ taken: boolean, reason?: string }>}
 */
export async function isNicknameTaken(nickname) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('Leaderboard: Supabase client not configured for nickname check');
    return { taken: false, reason: 'not_configured' };
  }

  const { raw, key } = normalizeNickname(nickname);
  if (!key) {
    return { taken: false, reason: 'empty' };
  }

  try {
    // nickname_registry 테이블에서 확인 (더 정확한 유니크 체크)
    const { data, error } = await supabase
      .from('nickname_registry')
      .select('nickname_key')
      .eq('game_slug', GAME_SLUG)
      .eq('nickname_key', key)
      .limit(1);

    if (error) {
      // Fallback to leaderboard if registry doesn't exist yet
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        if (__IS_DEV__) {
          console.warn('[LB] nickname_registry not found, falling back to leaderboard');
        }
        const { data: lbData } = await supabase
          .from('leaderboard')
          .select('nickname')
          .eq('game_slug', GAME_SLUG)
          .ilike('nickname', key)
          .limit(1);
        return { taken: !!(lbData && lbData.length > 0) };
      }
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
 * 닉네임 클레임 (서버 유니크 보장, 원자적 연산)
 * @param {string} raw - 원본 닉네임
 * @param {string} userId - 사용자 ID
 * @returns {Promise<{ success: boolean, error?: 'taken' | 'network' | 'unknown', message?: string }>}
 */
export async function claimNickname(raw, userId) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'network', message: 'Supabase not configured' };
  }

  const { raw: normalized, key } = normalizeNickname(raw);
  
  if (!key) {
    return { success: false, error: 'unknown', message: 'Invalid nickname' };
  }

  try {
    // RPC 함수 호출 (원자적 연산)
    const { data, error } = await supabase.rpc('claim_nickname', {
      p_game_slug: GAME_SLUG,
      p_nickname_key: key,
      p_nickname_raw: normalized,
      p_user_id: userId
    });

    if (error) {
      // 테이블이 없으면 에러 반환
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        if (__IS_DEV__) {
          console.warn('[LB] nickname_registry table not found, run supabase/nickname_registry.sql');
        }
        return { success: false, error: 'network', message: 'Nickname registry not configured' };
      }
      
      console.error('Claim nickname error:', error);
      return { success: false, error: 'network', message: error.message };
    }

    // RPC 함수는 jsonb 반환
    if (data && typeof data === 'object') {
      if (data.success) {
        return { success: true, message: data.message || 'Nickname claimed' };
      } else {
        return { 
          success: false, 
          error: data.error || 'unknown',
          message: data.message || 'Failed to claim nickname'
        };
      }
    }

    return { success: false, error: 'unknown', message: 'Unexpected response format' };
  } catch (e) {
    console.error('Claim nickname exception:', e);
    return { success: false, error: 'network', message: e.message || 'Network error' };
  }
}

/**
 * 닉네임 회수 (Release) - 계정 탈퇴 시 사용
 * @param {string} userId - 사용자 ID
 * @param {string} gameSlug - 게임 슬러그 (기본값: GAME_SLUG)
 * @returns {Promise<{ success: boolean, error?: string, message?: string }>}
 */
export async function releaseNickname(userId, gameSlug = GAME_SLUG) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'network', message: 'Supabase not configured' };
  }

  if (!userId) {
    return { success: false, error: 'unknown', message: 'User ID required' };
  }

  try {
    // RPC 함수 호출
    const { data, error } = await supabase.rpc('release_nickname', {
      p_game_slug: gameSlug,
      p_user_id: userId
    });

    if (error) {
      // 테이블이 없으면 에러 반환
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        if (__IS_DEV__) {
          console.warn('[LB] release_nickname RPC not found, nickname_registry may not be set up');
        }
        return { success: false, error: 'network', message: 'Nickname registry not configured' };
      }
      
      console.error('Release nickname error:', error);
      return { success: false, error: 'network', message: error.message };
    }

    // RPC 함수는 jsonb 반환
    if (data && typeof data === 'object') {
      if (data.success) {
        if (__IS_DEV__) {
          console.log('[LB] Nickname released:', data.released_key || 'none');
        }
        return { success: true, message: data.message || 'Nickname released' };
      } else {
        return { 
          success: false, 
          error: data.error || 'unknown',
          message: data.message || 'Failed to release nickname'
        };
      }
    }

    return { success: false, error: 'unknown', message: 'Unexpected response format' };
  } catch (e) {
    console.error('Release nickname exception:', e);
    return { success: false, error: 'network', message: e.message || 'Network error' };
  }
}

/**
 * bigint 컬럼에 안전하게 저장할 수 있도록 정수로 변환
 * - 음수는 0으로 바운딩 (데이터 왜곡 방지)
 * - NaN/Infinity는 0으로 처리
 * @param {any} value - 변환할 값
 * @param {string} fieldName - 필드명 (디버깅용)
 * @returns {number} 정수값 (0 이상)
 */
function toBigIntSafe(value, fieldName = 'unknown') {
  // null/undefined 처리
  if (value == null) {
    if (__IS_DEV__) {
      console.warn(`[LB] ${fieldName} is null/undefined, using 0`);
    }
    return 0;
  }
  
  // 숫자로 변환
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  // 유효하지 않은 값 처리
  if (!Number.isFinite(num)) {
    if (__IS_DEV__) {
      console.warn(`[LB] ${fieldName} is not finite (${value}), using 0`);
    }
    return 0;
  }
  
  // 정수로 변환 (소수점 제거, 음수는 0으로 바운딩)
  const intValue = Math.floor(num);
  const safeValue = Math.max(0, intValue);
  
  // 디버그: 소수였던 경우 또는 음수였던 경우 경고
  if (__IS_DEV__) {
    const wasDecimal = num !== intValue && Number.isFinite(num);
    const wasNegative = num < 0;
    
    if (wasDecimal || wasNegative) {
      const reasons = [];
      if (wasDecimal) reasons.push('was decimal');
      if (wasNegative) reasons.push('was negative');
      console.debug(`[LB] ${fieldName} converted from ${num} to ${safeValue} (${reasons.join(', ')})`);
    }
  }
  
  return safeValue;
}

// 에러 처리: 중복 로그 방지 및 백오프
let __lastErrorTime = 0;
let __lastErrorMessage = '';
let __errorCount = 0;
const ERROR_LOG_INTERVAL = 5000; // 5초마다 한 번만 로그

// 리더보드 업데이트 최적화: 캐시 및 스로틀
let __lastUpdatePayload = null;
let __lastUpdateTime = 0;
let __lastUpdateSuccess = false;
const UPDATE_THROTTLE_MS = 15000; // 15초 스로틀 (일반 업데이트)
const UPDATE_THROTTLE_IMMEDIATE_MS = 0; // 즉시 허용 (중요 이벤트)

function logLeaderboardError(error, context = '') {
  const now = Date.now();
  const errorKey = error?.message || String(error);
  
  // 동일 에러가 연속 발생하면 카운트만 증가
  if (errorKey === __lastErrorMessage && now - __lastErrorTime < ERROR_LOG_INTERVAL) {
    __errorCount++;
    return; // 로그 스킵
  }
  
  // 새로운 에러이거나 시간이 지났으면 로그 출력
  if (__errorCount > 0) {
    console.error(`[LB] Leaderboard error (repeated ${__errorCount} times):`, error, context);
    __errorCount = 0;
  } else {
    console.error(`[LB] Leaderboard error:`, error, context);
  }
  
  __lastErrorTime = now;
  __lastErrorMessage = errorKey;
}

/**
 * Update leaderboard entry for current user
 * @param {string} nickname - Player nickname
 * @param {number} totalAssets - Total assets value
 * @param {number} playTimeMs - Total play time in milliseconds
 * @param {number} towerCount - Number of towers (prestige count, default: 0)
 * @param {boolean} forceImmediate - Force immediate update (bypass throttle, for tower purchase/prestige)
 */
export async function updateLeaderboard(nickname, totalAssets, playTimeMs, towerCount = 0, forceImmediate = false) {
  try {
    const user = await getUser();
    if (!user) {
      if (__IS_DEV__) {
        console.log('Leaderboard: User not logged in, skipping update');
      }
      return { success: false, error: 'Not logged in' };
    }

    // bigint 컬럼에 안전하게 저장하기 위해 정수로 변환
    const safeTotalAssets = toBigIntSafe(totalAssets, 'total_assets');
    const safePlayTimeMs = toBigIntSafe(playTimeMs, 'play_time_ms');
    const safeTowerCount = toBigIntSafe(towerCount, 'tower_count');
    
    // 현재 payload 생성
    const currentPayload = {
      nickname: normalizeNickname(nickname || '익명'),
      total_assets: safeTotalAssets,
      play_time_ms: safePlayTimeMs,
      tower_count: safeTowerCount
    };
    
    // 캐시 비교: 동일한 payload면 스킵
    if (__lastUpdatePayload && 
        __lastUpdatePayload.nickname === currentPayload.nickname &&
        __lastUpdatePayload.total_assets === currentPayload.total_assets &&
        __lastUpdatePayload.play_time_ms === currentPayload.play_time_ms &&
        __lastUpdatePayload.tower_count === currentPayload.tower_count) {
      if (__IS_DEV__) {
        console.debug('[LB] Skipping update: payload unchanged');
      }
      return { success: true, data: null, skipped: true };
    }
    
    // 스로틀 체크: 마지막 업데이트 이후 최소 간격 확인
    const now = Date.now();
    const throttleMs = forceImmediate ? UPDATE_THROTTLE_IMMEDIATE_MS : UPDATE_THROTTLE_MS;
    if (!forceImmediate && __lastUpdateSuccess && (now - __lastUpdateTime) < throttleMs) {
      if (__IS_DEV__) {
        console.debug(`[LB] Throttled: ${Math.round((throttleMs - (now - __lastUpdateTime)) / 1000)}s remaining`);
      }
      return { success: true, data: null, skipped: true, throttled: true };
    }
    
    // DEV 모드에서 payload 로깅
    if (__IS_DEV__) {
      console.debug('[LB] updateLeaderboard payload:', {
        nickname,
        totalAssets: { raw: totalAssets, safe: safeTotalAssets, type: typeof totalAssets },
        playTimeMs: { raw: playTimeMs, safe: safePlayTimeMs, type: typeof playTimeMs },
        towerCount: { raw: towerCount, safe: safeTowerCount, type: typeof towerCount },
        forceImmediate
      });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' };
    }
    
    // Upsert leaderboard entry
    const { data, error } = await supabase
      .from('leaderboard')
      .upsert({
        user_id: user.id,
        game_slug: GAME_SLUG,
        nickname: nickname || '익명',
        total_assets: safeTotalAssets,
        play_time_ms: safePlayTimeMs,
        tower_count: safeTowerCount,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,game_slug'
      })
      .select()
      .single();

    if (error) {
      logLeaderboardError(error, { nickname, safeTotalAssets, safePlayTimeMs, safeTowerCount });
      return { success: false, error: error.message };
    }

    // 성공 시 캐시 및 타임스탬프 업데이트
    __lastUpdatePayload = currentPayload;
    __lastUpdateTime = now;
    __lastUpdateSuccess = true;
    
    if (__IS_DEV__) {
      console.debug('[LB] Leaderboard updated successfully:', data);
    }
    return { success: true, data };
  } catch (error) {
    logLeaderboardError(error, 'exception');
    // 실패 시에도 타임스탬프는 업데이트 (무한 재시도 방지)
    __lastUpdateTime = Date.now();
    __lastUpdateSuccess = false;
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
      .select('nickname, total_assets, play_time_ms, tower_count, updated_at')
      .eq('game_slug', GAME_SLUG)
      .limit(limit);

    if (sortBy === 'assets') {
      // Prestige ranking: tower_count first, then total_assets
      query = query
        .order('tower_count', { ascending: false })
        .order('total_assets', { ascending: false });
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
        play_time_ms: row.play_time_ms,
        tower_count: row.tower_count || 0
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

