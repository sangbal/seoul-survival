/**
 * 리뷰 시스템 (Supabase 연동)
 * 게임별 리뷰 작성/조회/수정/삭제
 */

import { getSupabaseClient } from './auth/supabaseClient.js';
import { getUser } from './auth/core.js';

/**
 * 사용자의 닉네임 조회 (leaderboard 또는 nickname_registry에서)
 * @param {string} gameSlug
 * @returns {Promise<{ success: boolean, nickname?: string, error?: string }>}
 */
export async function getUserNickname(gameSlug) {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Not signed in' };
  }

  try {
    // 먼저 nickname_registry에서 조회
    const { data: registryData, error: registryError } = await supabase
      .from('nickname_registry')
      .select('nickname_raw')
      .eq('game_slug', gameSlug)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!registryError && registryData) {
      return { success: true, nickname: registryData.nickname_raw };
    }

    // Fallback: leaderboard에서 조회
    const { data: lbData, error: lbError } = await supabase
      .from('leaderboard')
      .select('nickname')
      .eq('game_slug', gameSlug)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!lbError && lbData) {
      return { success: true, nickname: lbData.nickname };
    }

    return { success: false, error: 'Nickname not found' };
  } catch (e) {
    console.error('Get nickname exception:', e);
    return { success: false, error: e.message || 'Unknown error' };
  }
}

const TABLE = 'reviews';

/**
 * 리뷰 작성/수정
 * @param {string} gameSlug
 * @param {boolean} recommended - thumb up/down
 * @param {string} summary - 1-2 line summary
 * @param {string} body - full review body (optional)
 * @param {string} nickname - user nickname
 * @returns {Promise<{ success: boolean, error?: string, data?: any }>}
 */
export async function upsertReview(gameSlug, recommended, summary, body = '', nickname) {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Not signed in' };
  }

  if (!summary || summary.trim().length === 0) {
    return { success: false, error: 'Summary is required' };
  }

  if (!nickname || nickname.trim().length === 0) {
    return { success: false, error: 'Nickname is required' };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .upsert({
        user_id: user.id,
        game_slug: gameSlug,
        nickname: nickname.trim(),
        recommended,
        summary: summary.trim(),
        body: body ? body.trim() : null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,game_slug',
      })
      .select()
      .single();

    if (error) {
      console.error('Review upsert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (e) {
    console.error('Review upsert exception:', e);
    return { success: false, error: e.message || 'Unknown error' };
  }
}

/**
 * 리뷰 삭제
 * @param {string} gameSlug
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function deleteReview(gameSlug) {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Not signed in' };
  }

  try {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('user_id', user.id)
      .eq('game_slug', gameSlug);

    if (error) {
      console.error('Review delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error('Review delete exception:', e);
    return { success: false, error: e.message || 'Unknown error' };
  }
}

/**
 * 게임의 리뷰 목록 조회
 * @param {string} gameSlug
 * @param {number} limit - 최대 개수 (default: 10)
 * @param {string} sortBy - 'recent' | 'recommended' | 'not_recommended' (default: 'recent')
 * @returns {Promise<{ success: boolean, data?: Array, error?: string }>}
 */
export async function getReviews(gameSlug, limit = 10, sortBy = 'recent') {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: [] };
  }

  try {
    let query = supabase
      .from(TABLE)
      .select('id, nickname, recommended, summary, body, created_at, updated_at')
      .eq('game_slug', gameSlug)
      .limit(limit);

    // 정렬
    if (sortBy === 'recommended') {
      query = query
        .eq('recommended', true)
        .order('created_at', { ascending: false });
    } else if (sortBy === 'not_recommended') {
      query = query
        .eq('recommended', false)
        .order('created_at', { ascending: false });
    } else {
      // recent (default)
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Review fetch error:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (e) {
    console.error('Review fetch exception:', e);
    return { success: false, error: e.message || 'Unknown error', data: [] };
  }
}

/**
 * 내 리뷰 조회
 * @param {string} gameSlug
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function getMyReview(gameSlug) {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Not signed in' };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, nickname, recommended, summary, body, created_at, updated_at')
      .eq('user_id', user.id)
      .eq('game_slug', gameSlug)
      .maybeSingle();

    if (error) {
      console.error('My review fetch error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || null };
  } catch (e) {
    console.error('My review fetch exception:', e);
    return { success: false, error: e.message || 'Unknown error' };
  }
}

/**
 * 리뷰 통계 조회 (추천/비추천 개수)
 * @param {string} gameSlug
 * @returns {Promise<{ success: boolean, data?: { recommended: number, notRecommended: number, total: number }, error?: string }>}
 */
export async function getReviewStats(gameSlug) {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('recommended')
      .eq('game_slug', gameSlug);

    if (error) {
      console.error('Review stats fetch error:', error);
      return { success: false, error: error.message };
    }

    const recommended = (data || []).filter(r => r.recommended).length;
    const notRecommended = (data || []).filter(r => !r.recommended).length;
    const total = (data || []).length;

    return {
      success: true,
      data: {
        recommended,
        notRecommended,
        total,
      },
    };
  } catch (e) {
    console.error('Review stats fetch exception:', e);
    return { success: false, error: e.message || 'Unknown error' };
  }
}

