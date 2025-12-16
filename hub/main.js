import { applyLang, getInitialLang } from './i18n.js';

const $ = (sel) => document.querySelector(sel);

function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove('show'), 1400);
}

function initVersion() {
  // package.json is the source of truth, but hub is a static HTML page.
  // Keep this in sync when releasing.
  const v = $('#version');
  if (v) v.textContent = '1.0.0';
}

// 로그인 버튼은 shared/authBoot.js에서 처리

function initLangSelect() {
  const select = $('#langSelect');
  if (!select) return;
  select.addEventListener('change', (e) => {
    const lang = String(e.target.value || '').toLowerCase();
    const applied = applyLang(lang);
    showToast(applied === 'ko' ? '언어: 한국어' : 'Language: English');
  });
}

applyLang(getInitialLang());
initVersion();
initLoginBtn();
initLangSelect();


