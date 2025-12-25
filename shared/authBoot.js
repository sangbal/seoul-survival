// ui.js는 동적 import로 변경 (auth 모듈 로드 지연)
// import { initAuthUI } from './auth/ui.js';

function $(sel) {
  return document.querySelector(sel);
}

function toast(msg) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => el.classList.remove('show'), 1400);
}

function detectScope() {
  return location.pathname.includes('/seoulsurvival/') ? 'game' : 'hub';
}

window.addEventListener('DOMContentLoaded', async () => {
  const loginBtn = $('#loginBtn') || $('#authLoginBtn');
  const logoutBtn = $('#logoutBtn') || $('#authLogoutBtn');
  const userLabel = $('#authUserLabel');
  const statusLabel = $('#authStatusLabel');
  const providerButtons = Array.from(document.querySelectorAll('[data-auth-provider]'));

  // 드로어 메뉴의 버튼도 찾기 (허브 페이지용)
  const drawerLoginBtn = $('#drawerAuthLoginBtn');
  const drawerLogoutBtn = $('#drawerAuthLogoutBtn');
  const drawerUserLabel = $('#drawerAuthUserLabel');

  if (!loginBtn && !drawerLoginBtn && providerButtons.length === 0) return;

  // Auth 초기화에 timeout 적용 (2초, 무한 대기 방지)
  try {
    // 동적 import로 ui 모듈 로드 (auth 모듈 로드 지연)
    const { initAuthUI } = await import('./auth/ui.js');
    
    await Promise.race([
      initAuthUI({
        scope: detectScope(),
        providerButtons,
        defaultProvider: 'google',
        loginBtn: loginBtn || drawerLoginBtn,
        logoutBtn: logoutBtn || drawerLogoutBtn,
        userLabel: userLabel || drawerUserLabel,
        statusLabel,
        toast,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth init timeout')), 2000)
      )
    ]);
  } catch (error) {
    // timeout 또는 다른 에러 발생 시 guest 모드로 계속 진행
    console.warn('[authBoot] Auth initialization failed or timed out, using guest mode:', error);
    // UI는 이미 기본 상태(guest)로 렌더링되어 있으므로 추가 처리 불필요
  }
});



