import { getUser, initAuthFromUrl, isAuthEnabled, onAuthStateChange, signInWithOAuth, signOut } from './core.js';

function pickDisplayName(user) {
  if (!user) return null;
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.preferred_username ||
    user.email ||
    user.id?.slice(0, 8)
  );
}

export async function initAuthUI(opts) {
  const {
    scope = 'hub',
    providerButtons = [],
    defaultProvider = 'google',
    loginBtn,
    logoutBtn,
    userLabel,
    statusLabel,
    toast,
  } = opts || {};

  const t = typeof toast === 'function' ? toast : () => {};

  // Exchange OAuth code if we were redirected back.
  await initAuthFromUrl();

  function setUI(user) {
    const name = pickDisplayName(user);
    if (userLabel) {
      userLabel.textContent = name ? name : (scope === 'hub' ? 'Guest' : '게스트');
      userLabel.hidden = false;
    }
    if (statusLabel) {
      if (!isAuthEnabled()) {
        statusLabel.textContent =
          scope === 'hub'
            ? 'SSO 설정 필요 (shared/auth/config.js)'
            : 'SSO 설정 필요: shared/auth/config.js';
        statusLabel.style.color = 'rgba(251, 191, 36, .95)';
      } else if (name) {
        statusLabel.textContent = scope === 'hub' ? 'Signed in' : '로그인됨';
        statusLabel.style.color = 'rgba(52, 211, 153, .95)';
      } else {
        statusLabel.textContent = scope === 'hub' ? 'Not signed in' : '로그인 안 됨';
        statusLabel.style.color = 'rgba(148, 163, 184, .95)';
      }
    }

    // 로그인 상태에 따라 버튼 표시/숨김
    if (loginBtn) loginBtn.hidden = !!name;
    if (logoutBtn) logoutBtn.hidden = !name;
    
    // providerButtons 컨테이너 표시/숨김 (로그인 시 숨김)
    // 인라인 스타일이 있으므로 style.display를 직접 설정
    const authProviderButtons = document.getElementById('authProviderButtons');
    if (authProviderButtons) {
      authProviderButtons.style.display = name ? 'none' : 'flex';
    }
    
    const logoutButtonContainer = document.getElementById('logoutButtonContainer');
    if (logoutButtonContainer) {
      logoutButtonContainer.style.display = name ? 'flex' : 'none';
    }
  }

  const initial = await getUser();
  setUI(initial);

  const off = onAuthStateChange((user) => setUI(user));

  async function doLogin(provider) {
    if (!isAuthEnabled()) {
      t(scope === 'hub' ? 'SSO 설정이 필요합니다' : 'SSO 설정 필요');
      return;
    }
    t(scope === 'hub' ? 'Redirecting…' : '이동 중…');
    const r = await signInWithOAuth(provider);
    if (!r.ok) t(scope === 'hub' ? 'Login failed' : '로그인 실패');
  }

  async function doLogout() {
    if (!isAuthEnabled()) return;
    const r = await signOut();
    if (!r.ok) t(scope === 'hub' ? 'Logout failed' : '로그아웃 실패');
    else t(scope === 'hub' ? 'Signed out' : '로그아웃');
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      doLogin(defaultProvider);
    });
  }

  providerButtons.forEach((btn) => {
    const provider = btn?.dataset?.authProvider;
    if (!provider) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      doLogin(provider);
    });
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      doLogout();
    });
  }

  return { off };
}


