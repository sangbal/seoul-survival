import { getFeaturedGame, getPlayableGames, getRecentlyUpdatedGames } from './games.registry.js';
import { getInitialLang } from './i18n.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const currentLang = getInitialLang();

// Featured 게임 히어로 렌더링
function renderFeaturedHero() {
  const hero = $('#featuredHero');
  if (!hero) return;

  const featured = getFeaturedGame();
  if (!featured) {
    // Featured 게임이 없으면 기본 히어로 표시
    hero.innerHTML = `
      <div class="hero-inner">
        <div class="badge"><span class="dot"></span><span data-i18n="hub.hero.badge">FEATURED</span></div>
        <div>
          <h1 class="hero-title">ClickSurvivor</h1>
          <p class="hero-sub">
            ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다.
          </p>
        </div>
      </div>
    `;
    return;
  }

  const title = featured.title[currentLang] || featured.title.ko;
  const tagline = featured.tagline[currentLang] || featured.tagline.ko;

  hero.innerHTML = `
    <div class="hero-inner">
      <div class="badge"><span class="dot"></span><span data-i18n="hub.hero.badge">FEATURED</span></div>
      <div>
        <h1 class="hero-title">${title}</h1>
        <p class="hero-sub">${tagline}</p>
        <div class="ctaRow">
          <a class="btn primary" href="${featured.playPath}" data-i18n="hub.hero.cta.play">플레이</a>
          <a class="btn" href="${featured.storePath}" data-i18n="hub.hero.cta.details">자세히</a>
        </div>
      </div>
    </div>
  `;
  // 히어로 배경 이미지는 CSS의 ::before에서 처리되므로 여기서는 설정하지 않음
}

// 게임 카드(작은 버전) 렌더링
function renderGameCardSmall(game) {
  const title = game.title[currentLang] || game.title.ko;
  const tagline = game.tagline[currentLang] || game.tagline.ko;
  const isPlayable = game.status === 'playable';
  const isComingSoon = game.status === 'comingSoon';

  return `
    <a href="${game.storePath}" class="game-card-small">
      <img
        src="${game.coverImage}"
        alt="${title}"
        class="game-card-small-cover"
        loading="lazy"
      />
      <div class="game-card-small-body">
        <h3 class="game-card-small-title">${title}</h3>
        <p class="game-card-small-tagline">${tagline}</p>
        <div class="game-card-small-footer">
          <span class="game-card-small-status ${isPlayable ? 'playable' : ''}">
            ${isPlayable ? '플레이 가능' : isComingSoon ? '준비 중' : ''}
          </span>
          ${isPlayable ? `<span class="game-card-small-cta">플레이</span>` : ''}
        </div>
      </div>
    </a>
  `;
}

// All Games 섹션 렌더링
function renderAllGames() {
  const row = $('#allGamesRow');
  if (!row) return;

  const games = getPlayableGames().slice(0, 6); // 최대 6개
  if (games.length === 0) {
    row.style.display = 'none';
    const section = $('#allGames');
    if (section) section.style.display = 'none';
    return;
  }

  row.innerHTML = games.map(renderGameCardSmall).join('');
}

// Recently Updated 섹션 렌더링
function renderRecentlyUpdated() {
  const row = $('#recentlyUpdatedRow');
  if (!row) return;

  const games = getRecentlyUpdatedGames(3); // 최대 3개
  if (games.length === 0) {
    row.style.display = 'none';
    const section = $('#recentlyUpdated');
    if (section) section.style.display = 'none';
    return;
  }

  row.innerHTML = games.map(renderGameCardSmall).join('');
}

// 초기 렌더링
renderFeaturedHero();
renderAllGames();
renderRecentlyUpdated();

