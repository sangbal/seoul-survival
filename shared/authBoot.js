import { initAuthUI } from './auth/ui.js';

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

  await initAuthUI({
    scope: detectScope(),
    providerButtons,
    defaultProvider: 'google',
    loginBtn: loginBtn || drawerLoginBtn,
    logoutBtn: logoutBtn || drawerLogoutBtn,
    userLabel: userLabel || drawerUserLabel,
    statusLabel,
    toast,
  });
});



