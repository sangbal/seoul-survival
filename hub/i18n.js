import ko from './translations/ko.js';
import en from './translations/en.js';

export const STORAGE_KEY = 'clicksurvivor_lang';

export const translations = {
  ko,
  en,
  // Future:
  // ja: () => import('./translations/ja.js'),
  // zh: () => import('./translations/zh.js'),
};

export const SUPPORTED_LANGS = Object.keys(translations);

export function resolveLang(input) {
  const v = String(input || '').toLowerCase();
  return SUPPORTED_LANGS.includes(v) ? v : null;
}

export function getLangFromUrl() {
  const u = new URL(window.location.href);
  return resolveLang(u.searchParams.get('lang'));
}

export function getInitialLang() {
  const fromUrl = getLangFromUrl();
  if (fromUrl) return fromUrl;
  const saved = resolveLang(localStorage.getItem(STORAGE_KEY));
  if (saved) return saved;
  const nav = String(navigator.language || '').toLowerCase();
  if (nav.startsWith('ko')) return 'ko';
  return 'en';
}

export function applyLang(lang) {
  const resolved = resolveLang(lang) || 'ko';
  document.documentElement.lang = resolved;

  const table = translations[resolved] || translations.ko;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const v = table[key];
    if (typeof v === 'string') el.textContent = v;
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt');
    if (!key) return;
    const v = table[key];
    if (typeof v === 'string') el.setAttribute('alt', v);
  });

  localStorage.setItem(STORAGE_KEY, resolved);

  const u = new URL(window.location.href);
  u.searchParams.set('lang', resolved);
  history.replaceState(null, '', u.toString());

  const langSelect = document.querySelector('#langSelect');
  if (langSelect) langSelect.value = resolved;

  return resolved;
}



