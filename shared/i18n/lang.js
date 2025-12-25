/**
 * 공용 i18n 유틸 (hub/i18n.js 재사용)
 */

import ko from './translations/ko.js';
import en from './translations/en.js';

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
  try {
    const fromUrl = getLangFromUrl();
    if (fromUrl) return fromUrl;
    const saved = resolveLang(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
    const nav = String(navigator.language || '').toLowerCase();
    if (nav.startsWith('ko')) return 'ko';
    return 'en';
  } catch (error) {
    // localStorage 접근 실패 시 기본값 반환
    console.warn('[lang] Failed to access localStorage, using default:', error);
    return 'ko';
  }
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
    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch (error) {
      console.warn('[lang] Failed to save to localStorage:', error);
    }
  }

  // URL에서 lang 파라미터 처리 비활성화 (무한 루프 방지)
  // 필요시 나중에 다시 활성화할 수 있지만, 현재는 블로킹 문제를 방지하기 위해 비활성화
  // if (typeof window !== 'undefined' && typeof URL !== 'undefined' && typeof history !== 'undefined') {
  //   try {
  //     const u = new URL(window.location.href);
  //     const currentLang = u.searchParams.get('lang');
  //     
  //     if (currentLang === resolved) {
  //       return resolved;
  //     }
  //     
  //     if (!window._langUpdating) {
  //       window._langUpdating = true;
  //       u.searchParams.delete('lang');
  //       const newUrl = u.toString();
  //       if (newUrl !== window.location.href) {
  //         history.replaceState(null, '', newUrl);
  //       }
  //       setTimeout(() => {
  //         window._langUpdating = false;
  //       }, 100);
  //     }
  //   } catch (error) {
  //     console.warn('[lang] Failed to update URL:', error);
  //   }
  // }

  return resolved;
}


