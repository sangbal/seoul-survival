// Delete user account via Supabase Edge Function
import { getSupabaseClient } from './supabaseClient.js';
import { getUser } from './core.js';
// config.js는 동적 import로 변경 (모듈 로드 시 블로킹 방지)
// import { SUPABASE_URL } from './config.js';
import { releaseNickname } from '../leaderboard.js';

/**
 * Delete user account via Edge Function
 * @returns {Promise<{ ok: boolean, status: string, reason?: string, error?: any }>}
 */
export async function deleteAccount() {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { ok: false, status: 'NOT_CONFIGURED', reason: 'not_configured' };
  }

  const user = await getUser();
  if (!user) {
    return { ok: false, status: 'AUTH_FAILED', reason: 'not_signed_in' };
  }

  // Note: nickname_registry 삭제는 Edge Function에서 처리됨
  // 클라이언트에서 releaseNickname을 호출하지 않아도 됨 (중복 처리 방지)
  // 하지만 클라이언트에서도 호출해도 무방 (Edge Function에서도 삭제하므로)
  // 
  // Release nickname before account deletion (선택사항, Edge Function에서도 처리)
  // This allows the nickname to be claimed by other users after account deletion
  try {
    const releaseResult = await releaseNickname(user.id, 'seoulsurvival');
    if (releaseResult.success) {
      console.log('[DeleteAccount] Nickname released successfully (client-side)');
    } else {
      // Log but don't fail account deletion if nickname release fails
      // Edge Function에서도 nickname_registry를 삭제하므로 문제없음
      console.warn('[DeleteAccount] Nickname release failed (will be handled by Edge Function):', releaseResult.message);
    }
  } catch (error) {
    // Log but don't fail account deletion if nickname release fails
    // Edge Function에서도 nickname_registry를 삭제하므로 문제없음
    console.warn('[DeleteAccount] Nickname release exception (will be handled by Edge Function):', error);
  }

  // Get current session token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session?.access_token) {
    return { ok: false, status: 'AUTH_FAILED', reason: 'no_session', error: sessionError };
  }

  const token = session.access_token;
  // 동적 import로 config 모듈 로드
  const { getSupabaseUrl } = await import('./config.js');
  const edgeFunctionUrl = `${getSupabaseUrl()}/functions/v1/delete-account`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { status: 'UNKNOWN_ERROR', message: `HTTP ${response.status}` };
      }

      return {
        ok: false,
        status: errorData.status || 'UNKNOWN_ERROR',
        reason: errorData.message || `HTTP ${response.status}`,
        error: errorData,
        httpStatus: response.status,
      };
    }

    const data = await response.json();
    
    if (data.status === 'ALL_SUCCESS') {
      return { ok: true, status: 'ALL_SUCCESS' };
    } else if (data.status === 'DATA_DELETED_BUT_AUTH_DELETE_FAILED') {
      return {
        ok: false,
        status: 'DATA_DELETED_BUT_AUTH_DELETE_FAILED',
        reason: 'Data deleted but account deletion failed',
      };
    } else {
      return {
        ok: false,
        status: data.status || 'UNKNOWN_ERROR',
        reason: data.message || 'Unknown error',
      };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { ok: false, status: 'UNKNOWN_ERROR', reason: 'timeout', error };
    }
    
    console.error('Delete account exception:', error);
    return { ok: false, status: 'UNKNOWN_ERROR', reason: 'network_error', error };
  }
}


