// Account Delete 페이지 메인 진입점
import { renderHeader } from '../../shared/shell/header.js';
import { renderFooter } from '../../shared/shell/footer.js';

document.addEventListener('DOMContentLoaded', async () => {
  const headerMount = document.getElementById('header-mount');
  const footerMount = document.getElementById('footer-mount');
  
  if (headerMount) {
    renderHeader(headerMount);
    // 헤더 계정 버튼 인증 UI 초기화
    await initHeaderAuth();
  }
  
  if (footerMount) {
    renderFooter(footerMount);
  }
  
  // 계정 삭제 기능은 account/main.js의 로직을 재사용하거나 여기에 구현
  // (현재는 account/main.js에서 처리)
});

// 헤더 계정 버튼 인증 UI 초기화 (account/main.js와 동일한 로직)
async function initHeaderAuth() {
  try {
    const { initAuthUI } = await import('../../shared/auth/ui.js');
    const { getUser, onAuthStateChange } = await import('../../shared/auth/core.js');
    
    const loginBtn = document.getElementById('headerLoginBtn');
    const logoutBtn = document.getElementById('headerLogoutBtn');
    const accountMenu = document.getElementById('headerAccountMenu');
    const nicknameMobile = document.getElementById('headerAccountNicknameMobile');
    
    if (!loginBtn && !logoutBtn) return;
    
    // 초기 상태 설정 (게스트 모드)
    if (loginBtn) loginBtn.style.display = 'block';
    if (accountMenu) accountMenu.style.setProperty('display', 'none', 'important');
    
    // 닉네임 업데이트 함수 (getUserProfile 사용)
    async function updateNickname(user) {
      if (!nicknameMobile) return;
      
      if (!user) {
        nicknameMobile.textContent = 'Guest';
        return;
      }
      
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
        console.warn('[Account Delete] Failed to get nickname:', error);
        const fallback = user?.user_metadata?.full_name || 
                       user?.user_metadata?.name || 
                       user?.user_metadata?.preferred_username || 
                       user?.email?.split('@')[0] || 
                       'Guest';
        nicknameMobile.textContent = fallback;
      }
    }
    
    // 로그인 상태 변경 시 헤더 UI 업데이트
    async function updateHeaderUI(user) {
      const isLoggedIn = !!user;
      
      if (loginBtn) {
        loginBtn.style.display = isLoggedIn ? 'none' : 'block';
      }
      
      if (accountMenu) {
        // !important를 우회하기 위해 setProperty 사용
        if (isLoggedIn) {
          accountMenu.style.setProperty('display', 'block', 'important');
        } else {
          accountMenu.style.setProperty('display', 'none', 'important');
        }
      }
      
      // 닉네임 업데이트 (드롭다운 메뉴 헤더에만 표시)
      await updateNickname(user);
    }
    
    // 초기 상태 설정 (initAuthUI 호출 전에 먼저 설정)
    const initial = await getUser();
    await updateHeaderUI(initial);
    
    // 인증 UI 초기화
    await initAuthUI({
      scope: 'hub',
      providerButtons: [],
      defaultProvider: 'google',
      loginBtn,
      logoutBtn,
      userLabel: null,
      statusLabel: null,
      toast: (msg) => console.log('[Account Delete]', msg),
    });
    
    // 약간의 지연을 두고 다시 업데이트
    setTimeout(async () => {
      const currentUser = await getUser();
      await updateHeaderUI(currentUser);
    }, 100);
    
    // 로그인 상태 변경 감지
    onAuthStateChange(async (user) => {
      await updateHeaderUI(user);
    });
    
  } catch (error) {
    console.warn('[Account Delete] Header auth init failed, using guest mode:', error);
    const loginBtn = document.getElementById('headerLoginBtn');
    const accountMenu = document.getElementById('headerAccountMenu');
    if (loginBtn) loginBtn.style.display = 'block';
    if (accountMenu) accountMenu.style.setProperty('display', 'none', 'important');
  }
}

