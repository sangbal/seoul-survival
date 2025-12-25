// Hub 메인 진입점
// 공통 Shell 렌더링 (헤더/푸터)
import { renderHeader } from '../shared/shell/header.js';
import { renderFooter } from '../shared/shell/footer.js';

// DOM 준비 후 실행
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
  
  console.log('[Hub] 초기화 완료');
});

// 헤더 계정 버튼 인증 UI 초기화
async function initHeaderAuth() {
  try {
    const { initAuthUI } = await import('../shared/auth/ui.js');
    const { getUser, onAuthStateChange } = await import('../shared/auth/core.js');
    
    const loginBtn = document.getElementById('headerLoginBtn');
    const logoutBtn = document.getElementById('headerLogoutBtn');
    const accountMenu = document.getElementById('headerAccountMenu');
    const nicknameMobile = document.getElementById('headerAccountNicknameMobile');
    
    if (!loginBtn && !logoutBtn) return;
    
    // 초기 상태 설정 (게스트 모드)
    if (loginBtn) loginBtn.style.display = 'block';
    if (accountMenu) accountMenu.style.display = 'none';
    
    // 닉네임 업데이트 함수 (getUserProfile 사용)
    async function updateNickname(user) {
      if (!nicknameMobile || !user) {
        if (nicknameMobile) nicknameMobile.textContent = 'Guest';
        return;
      }
      
      try {
        const { getUserProfile } = await import('../shared/auth/core.js');
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
        console.warn('[Hub] Failed to get nickname:', error);
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
      
      // 로그인 버튼 표시/숨김
      if (loginBtn) {
        loginBtn.style.display = isLoggedIn ? 'none' : 'block';
      }
      
      // 계정 메뉴 표시/숨김
      if (accountMenu) {
        accountMenu.style.display = isLoggedIn ? 'block' : 'none';
      }
      
      // 닉네임 업데이트 (드롭다운 메뉴 헤더에만 표시)
      await updateNickname(user);
    }
    
    // 초기 상태 설정 (initAuthUI 호출 전에 먼저 설정)
    const initial = await getUser();
    await updateHeaderUI(initial);
    
    // 인증 UI 초기화 (userLabel을 null로 설정하여 setUI가 닉네임을 덮어쓰지 않도록 함)
    const authOff = await initAuthUI({
      scope: 'hub',
      providerButtons: [],
      defaultProvider: 'google',
      loginBtn,
      logoutBtn,
      userLabel: null, // 닉네임은 updateNickname에서 직접 관리
      statusLabel: null,
      toast: (msg) => console.log('[Hub]', msg),
    });
    
    // initAuthUI 내부의 onAuthStateChange가 setUI를 호출하지만 userLabel이 null이므로 닉네임은 업데이트하지 않음
    // 우리의 onAuthStateChange가 나중에 실행되어 닉네임을 업데이트하도록 함
    // 하지만 initAuthUI 내부의 콜백이 먼저 실행될 수 있으므로, 약간의 지연을 두고 다시 업데이트
    setTimeout(async () => {
      const currentUser = await getUser();
      await updateHeaderUI(currentUser);
    }, 100);
    
    // 로그인 상태 변경 감지 (닉네임도 함께 업데이트)
    // initAuthUI 내부의 onAuthStateChange와 별도로 관리
    onAuthStateChange(async (user) => {
      await updateHeaderUI(user);
    });
    
    // 닉네임 변경 이벤트 감지 (다른 페이지에서 닉네임 변경 시)
    window.addEventListener('nicknamechanged', async (event) => {
      const newNickname = event.detail?.nickname;
      if (newNickname && nicknameMobile) {
        nicknameMobile.textContent = newNickname;
        console.log('[Hub] Nickname updated from event:', newNickname);
      }
      // 사용자 정보 다시 가져오기
      const currentUser = await getUser();
      await updateHeaderUI(currentUser);
    });
    
    // authstatechange 이벤트도 감지 (닉네임 변경 후 발생)
    window.addEventListener('authstatechange', async () => {
      const currentUser = await getUser();
      await updateHeaderUI(currentUser);
    });
    
  } catch (error) {
    console.warn('[Hub] Header auth init failed, using guest mode:', error);
    // 에러 발생 시 게스트 모드로 설정
    const loginBtn = document.getElementById('headerLoginBtn');
    const accountMenu = document.getElementById('headerAccountMenu');
    if (loginBtn) loginBtn.style.display = 'block';
    if (accountMenu) accountMenu.style.display = 'none';
  }
}

