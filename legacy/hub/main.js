import { applyLang, getInitialLang } from './i18n.js';
import { renderHeader } from '../shared/shell/header.js';
import { renderFooter } from '../shared/shell/footer.js';

const $ = (sel) => document.querySelector(sel);

/**
 * 공통 헤더/푸터 렌더링
 * - 기존 Shell 구조를 그대로 사용하며, hero 렌더와 분리
 */
async function initCommonShell() {
  const currentPath = window.location.pathname;
  const initialLang = getInitialLang();

  const headerMount = $('#commonHeaderMount');
  if (headerMount) {
    renderHeader(headerMount, {
      currentPath,
      lang: initialLang,
      onLangChange: (newLang) => {
        // 언어 적용만 수행 (별도 토스트는 생략, 허브는 심플하게 유지)
        applyLang(newLang);
      },
    });
  }

  const footerMount = $('#commonFooterMount');
  if (footerMount) {
    renderFooter(footerMount, {
      currentPath,
      hubVersion: '1.2.0',
    });
  }

  // 최초 진입 시 언어 적용
  applyLang(initialLang);
}

/**
 * 허브 히어로: SeoulSurvival 단일 카드 + Play Now CTA
 * - 다게임 레지스트리/스토어 로직은 사용하지 않고, v0.1 전용 간소 버전
 */
function initHero() {
  const hero = $('#featuredHero');
  if (!hero) return;

  hero.innerHTML = `
    <div class="panel" style="background: var(--heroTint); border-color: rgba(148,163,184,.30); box-shadow: 0 18px 60px rgba(0,0,0,.45);">
      <div class="panel-inner" style="padding: 20px 18px 18px; display: flex; flex-direction: column; gap: 12px;">
        <div>
          <span class="pill" style="background: rgba(96,165,250,.20); color: #e5e7eb; border-radius: 999px; border: 1px solid rgba(148,163,184,.35); font-weight: 800; font-size: 11px;">
            Capital Clicker · Seoul
          </span>
        </div>
        <div>
          <h1 style="margin: 6px 0 4px; font-size: 26px; font-weight: 900; letter-spacing: -.2px;">
            SeoulSurvival
          </h1>
          <p class="muted" style="margin: 0; font-size: 14px;">
            서울에서 살아남는 자본 클리커. 노동으로 시드를 만들고 투자로 가속하세요.
          </p>
        </div>
        <div class="ctaRow" style="margin-top: 8px;">
          <a class="btn btn-lg" href="seoulsurvival/">
            ▶ Play Now
          </a>
        </div>
        <p class="muted" style="margin: 0; font-size: 12px;">
          브라우저에서 즉시 플레이 · 설치/가입 없음 · 로그인 시 클라우드 저장 & 리더보드 지원
        </p>
      </div>
    </div>
  `;
}

// 초기화: DOMContentLoaded 이후 공통 Shell + Hero 렌더
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCommonShell();
    initHero();
  });
} else {
  initCommonShell();
  initHero();
}

