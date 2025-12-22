/**
 * Account 페이지 메인 스크립트
 * 
 * 공통 헤더/푸터를 사용하고, 계정 관리 기능을 초기화합니다.
 */

import { applyLang, getInitialLang } from '../hub/i18n.js';
import { renderHeader } from '../shared/shell/header.js';
import { renderFooter } from '../shared/shell/footer.js';
// Auth 초기화는 shared/authBoot.js에서 처리
import { initAuthUI } from '../shared/auth/ui.js';

const $ = (sel) => document.querySelector(sel);

function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove('show'), 1400);
}

// 공통 헤더/푸터 렌더링
async function initCommonShell() {
  const currentPath = window.location.pathname;
  const initialLang = getInitialLang();

  // Auth 초기화는 shared/authBoot.js에서 처리 (블로킹하지 않음)

  // 헤더 렌더링 (Auth 실패와 무관하게 진행)
  const headerMount = $('#commonHeaderMount');
  if (headerMount) {
    renderHeader(headerMount, {
      currentPath,
      lang: initialLang,
      onLangChange: (newLang) => {
        showToast(newLang === 'ko' ? '언어: 한국어' : 'Language: English');
      },
    });
  }

  // 푸터 렌더링
  const footerMount = $('#commonFooterMount');
  if (footerMount) {
    renderFooter(footerMount, {
      currentPath,
      hubVersion: '1.2.0',
    });
  }

  // 언어 적용 (URL에서 lang 파라미터 제거, 리로드 없이)
  applyLang(initialLang);
}

// 계정 관리 UI 초기화 (기존 initAuthUI 사용)
async function initAccountUI() {
  const providerButtons = Array.from(document.querySelectorAll('[data-auth-provider]'));
  const deleteDataBtn = $('#deleteDataBtn');
  const deleteAccountBtn = $('#deleteAccountBtn');

  await initAuthUI({
    scope: 'hub',
    providerButtons,
    defaultProvider: 'google',
    loginBtn: null, // 공통 헤더에서 처리
    logoutBtn: null, // 공통 헤더에서 처리
    userLabel: null, // 공통 헤더에서 처리
    statusLabel: $('#authStatusLabel'),
    toast: showToast,
  });
}

// 초기화
initCommonShell();
initAccountUI();


