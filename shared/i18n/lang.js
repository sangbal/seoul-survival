/**
 * 공용 i18n 유틸 (hub/i18n.js 재사용)
 */

import ko from '../../hub/translations/ko.js';
import en from '../../hub/translations/en.js';

export const STORAGE_KEY = 'clicksurvivor_lang';

export const translations = {
  ko,
  en,
};

export const SUPPORTED_LANGS = Object.keys(translations);

export function resolveLang(input) {
  const v = String(input || '').toLowerCase();
  return SUPPORTED_LANGS.includes(v) ? v : null;
}

export function getLangFromUrl() {
  if (typeof window === 'undefined') return null;
  const u = new URL(window.location.href);
  return resolveLang(u.searchParams.get('lang'));
}

export function getInitialLang() {
  if (typeof window === 'undefined') return 'ko';
  const fromUrl = getLangFromUrl();
  if (fromUrl) return fromUrl;
  const saved = resolveLang(localStorage.getItem(STORAGE_KEY));
  if (saved) return saved;
  const nav = String(navigator.language || '').toLowerCase();
  if (nav.startsWith('ko')) return 'ko';
  return 'en';
}

export function getActiveLang() {
  return getInitialLang();
}

/**
 * 번역 함수
 */
export function t(dict) {
  const lang = getActiveLang();
  return dict[lang] || dict.ko || '';
}

/**
 * DOM에 i18n 적용
 */
export function applyLang(lang) {
  if (typeof document === 'undefined') return lang;
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

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, resolved);
  }

  // URL에서 lang 파라미터 처리 (리로드 없이)
  if (typeof window !== 'undefined' && typeof URL !== 'undefined') {
    const u = new URL(window.location.href);
    const currentLang = u.searchParams.get('lang');
    
    // URL에 lang이 있고 동일하면 변경하지 않음 (리로드 루프 방지)
    if (currentLang === resolved) {
      // 이미 올바른 lang이 URL에 있으면 아무것도 하지 않음
    } else {
      // URL에 lang이 없거나 다르면 제거 (리로드 없이)
      u.searchParams.delete('lang');
      history.replaceState(null, '', u.toString());
    }
  }

  return resolved;
}


