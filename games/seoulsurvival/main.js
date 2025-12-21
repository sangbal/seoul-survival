import { getGame } from '../../hub/games.registry.js';
import { getInitialLang } from '../../hub/i18n.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const currentLang = getInitialLang();
const game = getGame('seoulsurvival');

if (!game) {
  console.error('Game not found: seoulsurvival');
} else {
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
        <a href="../../${game.playPath}" class="cta-primary">지금 플레이하기</a>
        <a href="../../games/" class="cta-secondary">← 게임 목록</a>
      </div>
      <div class="sidebar-card">
        <h3 class="section-title" style="font-size: var(--font-md); margin-bottom: var(--space-3);">지원 환경 요약</h3>
        <ul class="support-list">
          ${(game.support[currentLang] || game.support.ko).slice(0, 3).map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    `;
  }
}
