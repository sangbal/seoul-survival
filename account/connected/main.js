// 연결된 계정 페이지
import { renderHeader } from '../../shared/shell/header.js';
import { renderFooter } from '../../shared/shell/footer.js';

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
  
  // 연결된 계정 정보 표시
  const { getUser } = await import('../../shared/auth/core.js');
  const user = await getUser();
  const isLoggedIn = !!user;
  
  const connectedAccountName = document.getElementById('connected-account-name');
  const connectedAccountStatus = document.getElementById('connected-account-status');
  
  if (!isLoggedIn) {
    if (connectedAccountStatus) {
      connectedAccountStatus.innerHTML = '<span class="status-badge status-inactive">연결 안 됨</span>';
    }
    return;
  }
  
  const provider = user?.app_metadata?.provider || 'google';
  const providerName = provider === 'google' ? 'Google' : provider;
  
  if (connectedAccountName) {
    connectedAccountName.textContent = providerName;
  }
  
  if (connectedAccountStatus) {
    connectedAccountStatus.innerHTML = '<span class="status-badge status-active">연결됨</span>';
  }
});

