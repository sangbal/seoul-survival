// 모든 import 임시 비활성화
// import { getFeaturedGame, getPlayableGames, getRecentlyUpdatedGames, getGame } from './games.registry.js';
// import { getInitialLang } from './i18n.js';

// 모든 코드 임시 비활성화
console.log('[hub/home.js] Module loaded (disabled)');
/*
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

// Left Rail 렌더링
function renderLeftRail() {
  const list = document.getElementById('leftRailGameList');
  if (!list) return;

  const games = getPlayableGames();
  if (games.length === 0) {
    list.innerHTML = '<li class="left-rail-item" style="color: var(--muted);">게임이 없습니다</li>';
    return;
  }

  // 현재 경로 확인 (홈이면 첫 번째 게임 active)
  const currentPath = window.location.pathname;
  const isHome = currentPath === '/' || currentPath === '/index.html';

  list.innerHTML = games.map((game, index) => {
    const title = game.title[currentLang] || game.title.ko;
    const isActive = isHome && index === 0; // 홈에서 첫 번째 게임 active
    return `
      <li>
        <a href="${game.storePath}" class="left-rail-item ${isActive ? 'active' : ''}">
          ${title}
        </a>
      </li>
    `;
  }).join('');
}

// Continue Playing Row 렌더링 (조건부)
async function renderContinuePlaying() {
  const row = document.getElementById('continuePlayingRow');
  const container = document.getElementById('continuePlayingContainer');
  if (!row || !container) return;

  try {
    // 동적 import로 지연 로드 (Supabase 클라이언트 초기화를 지연)
    const { getAllPlayHistory } = await import('./playHistory.js');
    
    // 플레이 기록 조회
    const histories = await getAllPlayHistory();
    
    if (histories.length === 0) {
      row.style.display = 'none';
      return;
    }

    // 최근 플레이한 게임들 렌더링 (최대 6개)
    const recentGames = histories.slice(0, 6);
    const cardsHTML = recentGames.map((history) => {
      const game = getGame(history.gameSlug);
      if (!game) return '';

      const title = game.title[currentLang] || game.title.ko;
      const tagline = game.tagline[currentLang] || game.tagline.ko;
      
      // 플레이 시간 포맷팅 (분 단위)
      const playTimeMinutes = Math.floor(history.playTime / 60000);
      const playTimeText = playTimeMinutes > 0 
        ? `${playTimeMinutes}분 플레이`
        : '플레이 중';

      // 마지막 플레이 시간 포맷팅
      const lastPlayedDate = new Date(history.lastPlayed);
      const now = Date.now();
      const diffMs = now - history.lastPlayed;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      let lastPlayedText = '';
      if (diffDays === 0) {
        lastPlayedText = '오늘';
      } else if (diffDays === 1) {
        lastPlayedText = '어제';
      } else if (diffDays < 7) {
        lastPlayedText = `${diffDays}일 전`;
      } else {
        lastPlayedText = lastPlayedDate.toLocaleDateString(currentLang === 'ko' ? 'ko-KR' : 'en-US', {
          month: 'short',
          day: 'numeric',
        });
      }

      return `
        <a href="${game.playPath}" class="game-card-small">
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
              <span class="game-card-small-status playable">${playTimeText}</span>
              <span class="game-card-small-cta">이어하기</span>
            </div>
            <div style="font-size: 11px; color: var(--muted); margin-top: 4px;">
              마지막 플레이: ${lastPlayedText}
            </div>
          </div>
        </a>
      `;
    }).join('');

    container.innerHTML = cardsHTML;
    row.style.display = 'block';
  } catch (error) {
    console.error('[ContinuePlaying] Failed to render:', error);
    row.style.display = 'none';
  }
}

// 초기 렌더링 함수 (안전하게 래핑)
function initHome() {
  try {
    renderLeftRail();
    renderFeaturedHero();
    renderAllGames();
    renderRecentlyUpdated();
    
    // 비동기 렌더링 (플레이 기록 조회 후) - 안전하게 실행
    renderContinuePlaying().catch((error) => {
      console.error('[home.js] renderContinuePlaying failed:', error);
    });
  } catch (error) {
    console.error('[home.js] initHome failed:', error);
  }
}

// DOMContentLoaded 이후에만 실행 (모듈 로드 시 블로킹 방지)
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(initHome, 0);
//   });
// } else {
//   // 이미 로드된 경우 약간의 지연을 두고 실행 (다른 초기화가 완료되도록)
//   setTimeout(initHome, 0);
// }
*/

