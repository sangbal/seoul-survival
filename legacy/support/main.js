import { applyLang, getInitialLang } from '../hub/i18n.js';
import { renderHeader } from '../shared/shell/header.js';
import { renderFooter } from '../shared/shell/footer.js';
// Auth 초기화는 shared/authBoot.js에서 처리

const $ = (sel) => document.querySelector(sel);

function showToast(msg) {
  console.log('[Toast]', msg);
}

// 공통 헤더/푸터 초기화
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
        applyLang(newLang);
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

// 초기화
initCommonShell();


