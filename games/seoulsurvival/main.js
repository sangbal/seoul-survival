import { getGame } from '../../hub/games.registry.js';
import { getInitialLang, applyLang } from '../../hub/i18n.js';
import { renderHeader } from '../../shared/shell/header.js';
import { renderFooter } from '../../shared/shell/footer.js';
// Auth 초기화는 shared/authBoot.js에서 처리

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let currentLang = getInitialLang();
const game = getGame('seoulsurvival');

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
        currentLang = newLang;
        applyLang(newLang);
        renderStorePage();
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

// Share 기능
async function handleShare() {
  const url = window.location.href;
  const title = game ? (game.title[currentLang] || game.title.ko) : 'Capital Clicker: SeoulSurvivor';
  const text = game ? (game.tagline[currentLang] || game.tagline.ko) : '';

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  } else {
    // Fallback: URL 복사
    try {
      await navigator.clipboard.writeText(url);
      showToast('URL이 클립보드에 복사되었습니다');
    } catch (err) {
      console.error('Copy failed:', err);
      // 최후의 수단: prompt
      prompt('URL을 복사하세요:', url);
    }
  }
}

// Store Page 렌더링
function renderStorePage() {

  if (!game) {
    console.error('Game not found: seoulsurvival');
    return;
  }

  // Left Column: Main Content
  const storeMain = $('#storeMain');
  if (storeMain) {
    const title = game.title[currentLang] || game.title.ko;
    const tagline = game.tagline[currentLang] || game.tagline.ko;
    const about = game.about[currentLang] || game.about.ko;
    const keyFeatures = game.keyFeatures[currentLang] || game.keyFeatures.ko;
    const support = game.support[currentLang] || game.support.ko;
    const screenshots = game.screenshots || [];

    // Hero Media
    let heroMediaHTML = '';
    if (game.heroMedia && game.heroMedia.src) {
      heroMediaHTML = `
        <div class="hero-media">
          <img
            src="../../${game.heroMedia.src}"
            alt="${title}"
            loading="eager"
          />
        </div>
      `;
    }

    // Screenshots
    let screenshotsHTML = '';
    if (screenshots.length > 0) {
      screenshotsHTML = `
        <div class="content-section">
          <h2 class="section-title">스크린샷</h2>
          <div class="screenshots-gallery">
            ${screenshots.map(shot => {
              const alt = typeof shot.alt === 'object' ? (shot.alt[currentLang] || shot.alt.ko) : shot.alt;
              return `
                <div class="screenshot-item">
                  <img
                    src="../../${shot.src}"
                    alt="${alt}"
                    loading="lazy"
                  />
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // About
    const aboutHTML = `
      <div class="content-section">
        <h2 class="section-title">게임 소개</h2>
        <div class="section-content">
          ${about.map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
    `;

    // Key Features
    const keyFeaturesHTML = `
      <div class="content-section">
        <h2 class="section-title">주요 기능</h2>
        <div class="section-content">
          <ul>
            ${keyFeatures.map(f => `<li><strong>${f}</strong></li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // Support
    const supportHTML = `
      <div class="content-section">
        <h2 class="section-title">지원 환경</h2>
        <div class="section-content">
          <ul class="support-list">
            ${support.map(s => `<li>${s}</li>`).join('')}
          </ul>
          <p style="margin-top: var(--space-4);">
            <a href="../../support/" style="color: var(--accent); text-decoration: underline; font-weight: 900;">더 많은 도움이 필요하신가요? 지원 센터로 이동 →</a>
          </p>
        </div>
      </div>
    `;

    // Patch Note Preview
    let patchNoteHTML = '';
    if (game.patchNotePreview) {
      const patch = game.patchNotePreview[currentLang] || game.patchNotePreview.ko;
      if (patch) {
        patchNoteHTML = `
          <div class="content-section">
            <h2 class="section-title">최신 업데이트</h2>
            <div class="patch-preview">
              <div class="patch-preview-header">
                <span class="patch-preview-version">v1.2.0</span>
                <span class="patch-preview-date">${game.lastUpdated}</span>
              </div>
              <h3 class="patch-preview-title">${patch.title}</h3>
              <p class="patch-preview-body">${patch.body}</p>
              <a href="../../${patch.link || '/patch-notes/'}" class="patch-preview-link">전체 패치노트 보기 →</a>
            </div>
          </div>
        `;
      }
    }

    storeMain.innerHTML = `
      ${heroMediaHTML}
      ${screenshotsHTML}
      ${aboutHTML}
      ${keyFeaturesHTML}
      ${patchNoteHTML}
      ${supportHTML}
    `;
  }

  // Right Column: Sidebar
  const storeSidebar = $('#storeSidebar');
  if (storeSidebar) {
    const title = game.title[currentLang] || game.title.ko;
    const tagline = game.tagline[currentLang] || game.tagline.ko;
    const tags = game.tags || [];

    // Auth 상태 확인 (비동기이므로 초기에는 guest로 가정)
    let authState = { status: 'loading', user: null };
    const unsubscribe = subscribeAuth((state) => {
      authState = state;
      updateSidebarCTA(authState);
    });

    function updateSidebarCTA(authState) {
      const ctaSection = $('#ctaSection');
      if (!ctaSection) return;

      const isAuthed = authState.status === 'authed' && authState.user;
      const saveTip = isAuthed 
        ? '<p style="font-size: 12px; color: var(--muted); margin-top: 8px; line-height: 1.4;">✅ 클라우드 저장 활성화됨</p>'
        : '<p style="font-size: 12px; color: var(--muted); margin-top: 8px; line-height: 1.4;">💡 <a href="../../account/" style="color: var(--accent); text-decoration: underline;">로그인</a>하면 클라우드 저장 가능</p>';

      ctaSection.innerHTML = `
        <a href="../../${game.playPath}" class="cta-primary">지금 플레이하기</a>
        ${saveTip}
        <a href="../../account/" class="cta-secondary" style="margin-top: 8px;">⚙️ 계정 관리</a>
        <button class="cta-secondary" id="shareBtn" style="margin-top: 8px;">🔗 공유하기</button>
      `;

      const shareBtn = $('#shareBtn');
      if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
      }
    }

    storeSidebar.innerHTML = `
      <div class="sidebar-card">
        <h1 class="game-title-main">${title}</h1>
        <p class="game-tagline">${tagline}</p>
        <div class="game-tags">
          ${tags.map(tag => {
            const tagText = typeof tag === 'object' ? (tag[currentLang] || tag.ko) : tag;
            return `<span class="game-tag">${tagText}</span>`;
          }).join('')}
        </div>
        <div id="ctaSection">
          <!-- CTA는 Auth 상태에 따라 동적 업데이트 -->
        </div>
      </div>
      <div class="sidebar-card">
        <h3 class="section-title" style="font-size: var(--font-md); margin-bottom: var(--space-3);">지원 환경 요약</h3>
        <ul class="support-list">
          ${(game.support[currentLang] || game.support.ko).slice(0, 3).map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    `;

    // CTA 초기 렌더링
    setTimeout(() => {
      updateSidebarCTA(authState);
    }, 100);
  }
}

// 초기화
initCommonShell().then(() => {
  setTimeout(() => {
    renderStorePage();
  }, 100);
});
