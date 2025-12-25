// 보안 페이지
import { renderHeader } from '../../shared/shell/header.js';
import { renderFooter } from '../../shared/shell/footer.js';

// Toast 메시지 표시 함수
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-panel);
    color: var(--text);
    padding: 12px 24px;
    border-radius: 8px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-size: 14px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

document.addEventListener('DOMContentLoaded', async () => {
  const headerMount = document.getElementById('header-mount');
  const footerMount = document.getElementById('footer-mount');
  
  if (headerMount) {
    renderHeader(headerMount);
    try {
      const { initAuthUI } = await import('../../shared/auth/ui.js');
      const { getUser, onAuthStateChange } = await import('../../shared/auth/core.js');
      
      const loginBtn = document.getElementById('headerLoginBtn');
      const logoutBtn = document.getElementById('headerLogoutBtn');
      const accountMenu = document.getElementById('headerAccountMenu');
      const nicknameMobile = document.getElementById('headerAccountNicknameMobile');
      
      if (!loginBtn && !logoutBtn) return;
      
      if (loginBtn) loginBtn.style.display = 'block';
      if (accountMenu) accountMenu.style.setProperty('display', 'none', 'important');
      
      async function updateHeaderUI(user) {
        const isLoggedIn = !!user;
        if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
        if (accountMenu) {
          // !important를 우회하기 위해 setProperty 사용
          if (isLoggedIn) {
            accountMenu.style.setProperty('display', 'block', 'important');
          } else {
            accountMenu.style.setProperty('display', 'none', 'important');
          }
        }
        if (nicknameMobile && isLoggedIn) {
          try {
            const { getUserProfile } = await import('../../shared/auth/core.js');
            const profile = await getUserProfile('seoulsurvival');
            if (profile.success && profile.user?.nickname) {
              nicknameMobile.textContent = profile.user.nickname;
            } else {
              const fallback = user?.user_metadata?.full_name || 
                             user?.user_metadata?.name || 
                             user?.user_metadata?.preferred_username || 
                             user?.email?.split('@')[0] || 
                             'Guest';
              nicknameMobile.textContent = fallback;
            }
          } catch (error) {
            console.warn('[Header] Failed to get nickname:', error);
            const fallback = user?.user_metadata?.full_name || 
                           user?.user_metadata?.name || 
                           user?.user_metadata?.preferred_username || 
                           user?.email?.split('@')[0] || 
                           'Guest';
            nicknameMobile.textContent = fallback;
          }
        }
      }
      
      const initial = await getUser();
      await updateHeaderUI(initial);
      
      await initAuthUI({
        scope: 'hub',
        providerButtons: [],
        defaultProvider: 'google',
        loginBtn,
        logoutBtn,
        userLabel: nicknameMobile,
        statusLabel: null,
        toast: (msg) => console.log('[Header]', msg),
      });
      
      onAuthStateChange(async (user) => {
        await updateHeaderUI(user);
      });
    } catch (error) {
      console.warn('[Header] Auth init failed:', error);
    }
  }
  
  if (footerMount) {
    renderFooter(footerMount);
  }
  
  // 인증 모듈 동적 로드
  const { getUser, signOut } = await import('../../shared/auth/core.js');
  
  // 현재 로그인 상태 확인
  const user = await getUser();
  const isLoggedIn = !!user;
  
  // ===== 현재 세션 정보 표시 =====
  function updateCurrentSession() {
    const currentDevice = document.getElementById('current-device');
    const currentLocation = document.getElementById('current-location');
    const currentLastActivity = document.getElementById('current-last-activity');
    
    if (!isLoggedIn) {
      if (currentDevice) currentDevice.textContent = '-';
      if (currentLocation) currentLocation.textContent = '-';
      if (currentLastActivity) currentLastActivity.textContent = '-';
      return;
    }
    
    // 기기 정보
    const ua = navigator.userAgent;
    let deviceName = '알 수 없음';
    if (/Mobile|Android|iPhone|iPad/.test(ua)) {
      if (/iPhone/.test(ua)) deviceName = 'iPhone';
      else if (/iPad/.test(ua)) deviceName = 'iPad';
      else if (/Android/.test(ua)) deviceName = 'Android 기기';
      else deviceName = '모바일 기기';
    } else {
      deviceName = '데스크톱';
    }
    
    if (currentDevice) currentDevice.textContent = deviceName;
    
    // 위치 정보
    if (currentLocation) currentLocation.textContent = '현재 위치';
    
    // 마지막 활동 시간
    if (user?.last_sign_in_at) {
      try {
        const lastSignIn = new Date(user.last_sign_in_at);
        const now = new Date();
        const diffMs = now - lastSignIn;
        const diffMins = Math.floor(diffMs / 60000);
        
        let timeText = '방금 전';
        if (diffMins < 1) {
          timeText = '방금 전';
        } else if (diffMins < 60) {
          timeText = `${diffMins}분 전`;
        } else if (diffMins < 1440) {
          const hours = Math.floor(diffMins / 60);
          timeText = `${hours}시간 전`;
        } else {
          const days = Math.floor(diffMins / 1440);
          timeText = `${days}일 전`;
        }
        
        if (currentLastActivity) currentLastActivity.textContent = timeText;
      } catch (e) {
        if (currentLastActivity) currentLastActivity.textContent = '알 수 없음';
      }
    } else {
      if (currentLastActivity) currentLastActivity.textContent = '방금 전';
    }
  }
  
  updateCurrentSession();
  
  // ===== 로그아웃 기능 =====
  const logoutBtn = document.getElementById('logout-btn');
  
  if (logoutBtn) {
    if (!isLoggedIn) {
      logoutBtn.disabled = true;
      logoutBtn.textContent = '로그인 필요';
    } else {
      logoutBtn.disabled = false;
      logoutBtn.textContent = '모든 기기에서 로그아웃';
      logoutBtn.addEventListener('click', async () => {
        if (!confirm('로그아웃하시겠습니까?')) {
          return;
        }
        
        logoutBtn.disabled = true;
        logoutBtn.textContent = '로그아웃 중...';
        
        try {
          const result = await signOut();
          if (result.ok) {
            showToast('로그아웃되었습니다', 'success');
            setTimeout(() => {
              window.location.href = '../../';
            }, 500);
          } else {
            showToast('로그아웃에 실패했습니다', 'error');
            logoutBtn.disabled = false;
            logoutBtn.textContent = '모든 기기에서 로그아웃';
          }
        } catch (error) {
          console.error('Logout error:', error);
          showToast('로그아웃 중 오류가 발생했습니다', 'error');
          logoutBtn.disabled = false;
          logoutBtn.textContent = '모든 기기에서 로그아웃';
        }
      });
    }
  }
});

