// OAuth 콜백 처리 페이지
import { getSupabaseClient } from '../../shared/auth/supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const errorMessage = document.getElementById('error-message');
  const retryBtn = document.getElementById('retry-btn');

  // URL에서 nextUrl 파라미터 추출 (원래 목적지)
  const urlParams = new URLSearchParams(window.location.search);
  const nextUrl = urlParams.get('next') || '/';
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  // code 파라미터가 없으면 에러
  if (!code) {
    showError('로그인 코드가 없습니다. 다시 로그인해주세요.');
    return;
  }

  try {
    // Supabase 클라이언트 가져오기
    const supabase = await getSupabaseClient();
    if (!supabase) {
      showError('인증 서비스가 설정되지 않았습니다.');
      return;
    }

    // OAuth 코드를 세션으로 교환
    const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

    if (error) {
      console.error('OAuth exchange error:', error);
      showError(`로그인 처리 중 오류가 발생했습니다: ${error.message}`);
      return;
    }

    // 세션 교환 성공
    if (data?.session) {
      // URL에서 code, state 파라미터 제거
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('code');
      cleanUrl.searchParams.delete('state');
      history.replaceState(null, '', cleanUrl.toString());

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





