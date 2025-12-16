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

  if (!loginBtn && providerButtons.length === 0) return;

  await initAuthUI({
    scope: detectScope(),
    providerButtons,
    defaultProvider: 'google',
    loginBtn,
    logoutBtn,
    userLabel,
    statusLabel,
    toast,
  });
});


