// config.js는 동적 import로 변경 (모듈 로드 시 블로킹 방지)
// import { isSupabaseConfigured } from './config.js';
import { getSupabaseClient } from './supabaseClient.js';

let _client = null;
async function client() {
  if (_client) return _client;
  _client = await getSupabaseClient();
  return _client;
}

export async function isAuthEnabled() {
  const { isSupabaseConfigured } = await import('./config.js');
  return isSupabaseConfigured();
}

export async function initAuthFromUrl() {
  const sb = await client();
  if (!sb) return { ok: false, reason: 'not_configured' };

  // /auth/callback 페이지가 아닌 경우에만 처리 (콜백 페이지는 자체 처리)
  if (typeof location !== 'undefined' && location.pathname === '/auth/callback') {
    return { ok: true, exchanged: false };
  }

  // When using OAuth PKCE, Supabase redirects back with ?code=...
  // Exchange it, then clean up the URL.
  // (하위 호환성: /auth/callback이 아닌 페이지에서도 동작)
  const hasCode = typeof location !== 'undefined' && /[?&]code=/.test(location.search);
  if (!hasCode) return { ok: true, exchanged: false };

  try {
    const { error } = await sb.auth.exchangeCodeForSession(location.href);
    if (error) return { ok: false, reason: 'exchange_failed', error };

    const u = new URL(location.href);
    u.searchParams.delete('code');
    u.searchParams.delete('state');
    history.replaceState(null, '', u.toString());
    return { ok: true, exchanged: true };
  } catch (e) {
    return { ok: false, reason: 'exchange_failed', error: e };
  }
}

export async function getUser() {
  const sb = await client();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data?.user || null;
}

export async function signInWithOAuth(provider, redirectTo = null) {
  const sb = await client();
  if (!sb) return { ok: false, reason: 'not_configured' };

  // redirectTo가 제공되지 않으면 현재 페이지로 설정 (하위 호환성)
  // Commit 3에서 /auth/callback으로 통일 예정
  if (!redirectTo) {
    redirectTo = location.origin + location.pathname + location.search.replace(/([?&])code=[^&]+(&|$)/, '$1').replace(/[?&]state=[^&]+(&|$)/, '$1');
  }

  // 계정 선택 옵션 추가 (다른 계정으로 로그인 가능하도록)
  const options = { redirectTo };
  if (provider === 'google') {
    options.queryParams = {
      prompt: 'select_account', // 계정 선택 화면 강제 표시
    };
  }
  
  const { error } = await sb.auth.signInWithOAuth({
    provider,
    options,
  });
  if (error) return { ok: false, reason: 'oauth_failed', error };
  return { ok: true };
}

/**
 * Google 로그인 (공통 함수)
 * @param {string} nextUrl - 로그인 후 리다이렉트할 URL (선택사항, 기본값: 현재 페이지)
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
export async function signInGoogle(nextUrl = null) {
  // 공통 콜백 엔드포인트 사용
  // location.origin을 사용하여 현재 환경(로컬/프로덕션)에 맞는 URL 생성
  const callbackUrl = `${location.origin}/auth/callback`;
  
  // 디버깅: redirectTo 값 확인
  console.log('[signInGoogle] Current origin:', location.origin);
  console.log('[signInGoogle] Callback URL:', callbackUrl);
  
  // nextUrl이 있으면 콜백 URL에 파라미터로 전달
  let redirectTo = callbackUrl;
  if (nextUrl) {
    const url = new URL(callbackUrl);
    url.searchParams.set('next', nextUrl);
    redirectTo = url.toString();
  }
  
  console.log('[signInGoogle] Final redirectTo:', redirectTo);
  
  return signInWithOAuth('google', redirectTo);
}

export async function signOut() {
  const sb = await client();
  if (!sb) return { ok: false, reason: 'not_configured' };
  const { error } = await sb.auth.signOut();
  if (error) return { ok: false, reason: 'signout_failed', error };
  return { ok: true };
}

export function onAuthStateChange(cb) {
  // 비동기로 클라이언트를 가져오되, 구독은 즉시 반환
  client().then(sb => {
    if (!sb) return;
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      cb(session?.user || null);
    });
    // 구독 해제 함수는 전역에 저장 (나중에 필요시 사용)
    if (typeof globalThis !== 'undefined') {
      globalThis['__clicksurvivor_auth_unsubscribe'] = () => data.subscription.unsubscribe();
    }
  }).catch(() => {
    // 클라이언트 로드 실패 시 빈 함수 반환
  });
  
  // 즉시 빈 함수 반환 (구독 해제용)
  return () => {
    if (typeof globalThis !== 'undefined' && globalThis['__clicksurvivor_auth_unsubscribe']) {
      globalThis['__clicksurvivor_auth_unsubscribe']();
      delete globalThis['__clicksurvivor_auth_unsubscribe'];
    }
  };
}

/**
 * 사용자 프로필 조회 (닉네임/유저ID 등, 아바타 제외)
 * @param {string} gameSlug - 게임 슬러그 (선택사항, 기본값: 'seoulsurvival')
 * @returns {Promise<{ success: boolean, user?: { id: string, email?: string, displayName?: string, nickname?: string }, error?: string }>}
 */
export async function getUserProfile(gameSlug = 'seoulsurvival') {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'not_signed_in' };
  }

  const profile = {
    id: user.id,
    email: user.email || null,
    displayName: user.user_metadata?.full_name || 
                 user.user_metadata?.name || 
                 user.user_metadata?.preferred_username || 
                 user.email || 
                 null,
  };

  // 닉네임 조회 (nickname_registry에서)
  try {
    const { getUserNickname } = await import('../reviews.js');
    const nicknameResult = await getUserNickname(gameSlug);
    if (nicknameResult.success) {
      profile.nickname = nicknameResult.nickname;
    }
  } catch (error) {
    // 닉네임 조회 실패는 무시 (선택사항)
    console.warn('[getUserProfile] Failed to get nickname:', error);
  }

  return { success: true, user: profile };
}



