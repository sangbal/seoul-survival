import ko from './translations/ko.js';
import en from './translations/en.js';

export const STORAGE_KEY = 'clicksurvivor_lang';

// DEV 모드 체크 (Vite 기준, optional chaining 사용)
const __IS_DEV__ = !!(import.meta?.env?.DEV);

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

let currentLang = getInitialLang();

// 중복 경고 방지: 이미 경고한 키 추적
const __warnedKeys = new Set();

export function t(key, params = {}, fallback = null) {
  const table = translations[currentLang] || translations.ko;
  let text = table[key];
  
  if (text === undefined) {
    // DEV에서만 경고, 중복 경고는 1회만
    if (__IS_DEV__ && !__warnedKeys.has(key)) {
      console.warn(`[i18n] Missing translation key: ${key}`);
      __warnedKeys.add(key);
    }
    // fallback이 제공되면 사용, 없으면 fallback 문자열 반환 (PROD에서 key 노출 방지)
    if (fallback !== null) {
      return fallback;
    }
    // PROD에서는 fallback 문자열, DEV에서는 key도 표시 (디버깅용)
    return __IS_DEV__ ? key : (key.startsWith('upgrade.') ? '알 수 없는 업그레이드' : '알 수 없음');
  }
  
  // 파라미터 치환: {key} 형식
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(paramKey => {
      const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
      text = text.replace(regex, String(params[paramKey]));
    });
  }
  
  return text;
}

export function setLang(lang) {
  const resolved = resolveLang(lang) || 'ko';
  currentLang = resolved;
  document.documentElement.lang = resolved;
  localStorage.setItem(STORAGE_KEY, resolved);
  
  // URL 업데이트
  const u = new URL(window.location.href);
  u.searchParams.set('lang', resolved);
  history.replaceState(null, '', u.toString());
  
  // 언어 선택 드롭다운 업데이트
  const langSelect = document.querySelector('#languageSelect');
  if (langSelect) {
    langSelect.value = resolved;
  }
  
  return resolved;
}

export function getLang() {
  return currentLang;
}

export function applyI18nToDOM() {
  const table = translations[currentLang] || translations.ko;
  
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const v = table[key];
    if (typeof v === 'string') {
      el.textContent = v;
    }
  });
  
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt');
    if (!key) return;
    const v = table[key];
    if (typeof v === 'string') {
      el.setAttribute('alt', v);
    }
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (!key) return;
    const v = table[key];
    if (typeof v === 'string') {
      el.setAttribute('aria-label', v);
    }
  });

  // 언어 선택 드롭다운 옵션 텍스트 업데이트
  document.querySelectorAll('#languageSelect option[data-i18n-option]').forEach((option) => {
    const key = option.getAttribute('data-i18n-option');
    if (!key) return;
    const v = table[key];
    if (typeof v === 'string') {
      option.textContent = v;
    }
  });
  
  // 언어 선택 드롭다운 업데이트
  const langSelect = document.querySelector('#languageSelect');
  if (langSelect) {
    langSelect.value = currentLang;
  }
}

// 초기화: 현재 언어로 설정
setLang(getInitialLang());

