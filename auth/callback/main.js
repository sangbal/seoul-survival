// OAuth 콜백 처리 페이지
import { getSupabaseClient } from '../../shared/auth/supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const errorMessage = document.getElementById('error-message');
  const retryBtn = document.getElementById('retry-btn');

  // URL 파라미터 또는 해시에서 code 추출
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1)); // # 제거
  
  const code = searchParams.get('code') || hashParams.get('code');
  const accessToken = hashParams.get('access_token');
  const error = searchParams.get('error') || hashParams.get('error');
  const errorDesc = searchParams.get('error_description') || hashParams.get('error_description') || error;
  
  const nextUrl = searchParams.get('next') || '/';
  
  // 에러 파라미터가 있으면 표시
  if (error) {
    showError(`로그인 실패: ${errorDesc}`);
    console.error('Login error params:', error, errorDesc);
    return;
  }

  // code나 access_token 둘 다 없으면 에러
  if (!code && !accessToken) {
    // URL 디버깅 정보를 포함하여 에러 표시
    console.warn('No login code or access token found. URL:', window.location.href);
    showError('로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
    return;
  }

  try {
    // Supabase 클라이언트 가져오기
    const supabase = await getSupabaseClient();
    if (!supabase) {
      showError('인증 서비스가 설정되지 않았습니다.');
      return;
    }

    let sessionData = null;
    let sessionError = null;

    // A) PKCE Flow: code가 있는 경우 교환 수행
    if (code) {
      console.log('Processing PKCE flow with code...');
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      sessionData = data;
      sessionError = error;
    } 
    // B) Implicit Flow: access_token이 있는 경우 (Supabase 클라이언트가 자동 처리했는지 확인)
    else if (accessToken) {
      console.log('Processing Implicit flow with access_token...');
      // createClient 시 detectSessionInUrl: true 옵션으로 인해 이미 세션이 수립되었을 수 있음
      // getSession()으로 확인
      const { data, error } = await supabase.auth.getSession();
      sessionData = data;
      sessionError = error;
      
      // 만약 세션이 아직 없다면, 해시에서 직접 세션 복구 시도 (드문 경우)
      if (!sessionData?.session && !sessionError) {
         console.log('Session not detected automatically, verifying token...');
         // 사실 access_token이 유효하다면 getSession이나 onAuthStateChange에서 잡혀야 함.
         // 여기서는 잠시 대기 후 재확인하거나, 다음 단계로 진행 시도
      }
    }

    if (sessionError) {
      console.error('Session error:', sessionError);
      showError(`로그인 처리 중 오류가 발생했습니다: ${sessionError.message}`);
      return;
    }

    // 세션 확인 성공 (sessionData 사용)
    if (sessionData?.session) {
      // URL에서 code, state, access_token 파라미터 제거
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('code');
      cleanUrl.searchParams.delete('state');
      cleanUrl.searchParams.delete('access_token');
      // 해시 제거를 위해 history.replaceState 사용
      history.replaceState(null, '', cleanUrl.pathname + cleanUrl.search); // 해시 제거

      // 원래 목적지로 리다이렉트
      // nextUrl이 상대 경로인지 절대 경로인지 확인
      const redirectUrl = nextUrl.startsWith('http') ? nextUrl : new URL(nextUrl, window.location.origin).pathname;
      
      // 잠시 대기 후 리다이렉트 (사용자에게 성공 메시지 표시)
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 500);
    } else {
      showError('세션을 가져오지 못했습니다. 다시 로그인해주세요.');
    }
  } catch (error) {
    console.error('Callback error:', error);
    showError(`예기치 않은 오류가 발생했습니다: ${error.message}`);
  }

  function showError(message) {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    errorMessage.textContent = message;
  }

  // 다시 시도 버튼
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      // 홈으로 이동하여 다시 로그인 시도
      window.location.href = '/';
    });
  }
});







