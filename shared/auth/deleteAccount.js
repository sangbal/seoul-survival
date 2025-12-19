// Delete user account via Supabase Edge Function
import { getSupabaseClient } from './supabaseClient.js';
import { getUser } from './core.js';
import { SUPABASE_URL } from './config.js';

/**
 * Delete user account via Edge Function
 * @returns {Promise<{ ok: boolean, status: string, reason?: string, error?: any }>}
 */
export async function deleteAccount() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, status: 'NOT_CONFIGURED', reason: 'not_configured' };
  }

  const user = await getUser();
  if (!user) {
    return { ok: false, status: 'AUTH_FAILED', reason: 'not_signed_in' };
  }

  // Get current session token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session?.access_token) {
    return { ok: false, status: 'AUTH_FAILED', reason: 'no_session', error: sessionError };
  }

  const token = session.access_token;
  const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/delete-account`;

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


