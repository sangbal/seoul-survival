import { getFeaturedGame, getVisibleGames, getPlayableGames, getComingSoonGames } from '../hub/games.registry.js';
import { applyLang, getInitialLang } from '../hub/i18n.js';
import { renderHeader } from '../shared/shell/header.js';
import { renderFooter } from '../shared/shell/footer.js';
// Auth 초기화는 shared/authBoot.js에서 처리

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let currentLang = getInitialLang();
let currentFilter = 'all';
let searchQuery = '';

function showToast(msg) {
  // 간단한 토스트는 나중에 필요하면 추가
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
        renderFeaturedHero();
        renderGames();
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

// 언어 초기화
initCommonShell();

// Featured Hero 렌더링
function renderFeaturedHero() {
  const hero = $('#featuredHero');
  if (!hero) return;

  const featured = getFeaturedGame();
  if (!featured) {
    hero.style.display = 'none';
    return;
  }

  const title = featured.title[currentLang] || featured.title.ko;
  const tagline = featured.tagline[currentLang] || featured.tagline.ko;

  // 히어로 배경 이미지 설정
  if (featured.heroMedia && featured.heroMedia.src) {
    const heroImagePath = featured.heroMedia.src.startsWith('/') 
      ? featured.heroMedia.src 
      : `../${featured.heroMedia.src}`;
    hero.style.setProperty('--hero-bg', `url('${heroImagePath}')`);
    const beforeStyle = hero.querySelector('style') || document.createElement('style');
    if (!hero.querySelector('style')) {
      hero.appendChild(beforeStyle);
    }
    beforeStyle.textContent = `
      .featured-hero::before {
        background-image: linear-gradient(180deg, rgba(7,11,20,.05), rgba(7,11,20,.85) 80%), url('${heroImagePath}');
      }
    `;
  }

  hero.innerHTML = `
    <div class="featured-hero-inner">
      <div class="featured-badge"><span class="dot"></span><span>FEATURED</span></div>
      <h1 class="featured-title">${title}</h1>
      <p class="featured-tagline">${tagline}</p>
      <div class="featured-cta">
        <a href="${featured.storePath}" class="btn">자세히 보기</a>
        <a href="${featured.playPath}" class="btn primary">지금 플레이</a>
      </div>
    </div>
  `;
}

// 게임 카드 렌더링
function renderGameCard(game) {
  const title = game.title[currentLang] || game.title.ko;
  const tagline = game.tagline[currentLang] || game.tagline.ko;
  const isPlayable = game.status === 'playable';
  const isComingSoon = game.status === 'comingSoon';

  const coverImagePath = game.coverImage.startsWith('/') 
    ? game.coverImage 
    : `../${game.coverImage}`;
  
  return `
    <a href="${game.storePath}" class="game-card">
      <img
        src="${coverImagePath}"
        alt="${title}"
        class="game-card-cover"
        loading="lazy"
      />
      <div class="game-card-body">
        <h3 class="game-card-title">${title}</h3>
        <p class="game-card-tagline">${tagline}</p>
        <div class="game-card-footer">
          <span class="game-card-status ${isPlayable ? 'playable' : ''}">
            ${isPlayable ? '플레이 가능' : isComingSoon ? '준비 중' : ''}
          </span>
          ${isPlayable ? `<span class="game-card-cta">자세히</span>` : ''}
        </div>
      </div>
    </a>
  `;
}

// 게임 목록 필터링 및 렌더링
function renderGames() {
  const grid = $('#gamesGrid');
  const emptyState = $('#emptyState');
  if (!grid) return;

  let filtered = getVisibleGames();

  // 필터 적용
  if (currentFilter === 'playable') {
    filtered = getPlayableGames();
  } else if (currentFilter === 'comingSoon') {
    filtered = getComingSoonGames();
  }

  // 검색 적용
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(game => {
      const title = (game.title[currentLang] || game.title.ko).toLowerCase();
      const tagline = (game.tagline[currentLang] || game.tagline.ko).toLowerCase();
      const tags = (game.tags || []).map(t => {
        if (typeof t === 'string') return t.toLowerCase();
        return (t[currentLang] || t.ko || '').toLowerCase();
      }).join(' ');
      return title.includes(query) || tagline.includes(query) || tags.includes(query);
    });
  }

  // Featured 게임 제외 (히어로에 이미 표시)
  const featured = getFeaturedGame();
  if (featured) {
    filtered = filtered.filter(g => g.slug !== featured.slug);
  }

  // 렌더링
  if (filtered.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    grid.innerHTML = filtered.map(renderGameCard).join('');
  }
}

// 검색 입력 이벤트
const searchInput = $('#searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGames();
  });
}

// 필터 탭 이벤트
$$('.browse-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.browse-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter || 'all';
    renderGames();
  });
});

// 초기 렌더링 (공통 Shell 초기화 후)
setTimeout(() => {
  renderFeaturedHero();
  renderGames();
}, 100);
