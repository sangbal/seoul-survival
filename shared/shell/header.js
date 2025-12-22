/**
 * 공통 헤더 컴포넌트
 * 
 * 모든 페이지에서 동일한 헤더/드로어를 제공합니다.
 * Auth 상태머신을 사용하여 로그인 상태를 일관되게 표시합니다.
 */

import { getActiveLang, t, applyLang } from '../i18n/lang.js';
import { signInWithOAuth, signOut, isAuthEnabled, onAuthStateChange, getUser } from '../auth/core.js';

// 사용자 표시명 추출
function pickDisplayName(user) {
  if (!user) return null;
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.preferred_username ||
    user.email ||
    user.id?.slice(0, 8)
  );
}

/**
 * 헤더 렌더링
 */
export function renderHeader(mountEl, options = {}) {
  const {
    currentPath = '/',
    lang = getActiveLang(),
    onLangChange,
    onLogin,
    onLogout,
  } = options;

  if (!mountEl) {
    console.warn('Header mount element not found');
    return null;
  }

  // 헤더 HTML 생성
  const headerHTML = `
    <header class="topbar" id="commonHeader">
      <div class="topbar-inner">
        <a class="brand" href="${getHomePath(currentPath)}" aria-label="ClickSurvivor 홈으로">
          <div class="logo">
            <img src="${getLogoPath(currentPath)}" alt="ClickSurvivor" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;" />
          </div>
          <div class="brandtxt">
            <div class="brandname">ClickSurvivor</div>
            <div class="brandtag" data-i18n="hub.brand.tag">오늘도 서울에서 살아남기</div>
          </div>
        </a>
        <button class="hamburger-btn" id="hamburgerBtn" aria-label="메뉴 열기" aria-expanded="false" aria-controls="drawer">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <!-- 드로어 오버레이 -->
    <div class="drawer-overlay" id="drawerOverlay" aria-hidden="true"></div>

    <!-- 드로어 메뉴 -->
    <aside class="drawer" id="drawer" aria-label="메뉴" aria-hidden="true">
      <div class="drawer-header">
        <div class="drawer-title" data-i18n="hub.drawer.title">메뉴</div>
        <button class="drawer-close" id="drawerClose" aria-label="메뉴 닫기">×</button>
      </div>
      <div class="drawer-content">
        <nav class="drawer-nav" aria-label="허브 내비게이션">
          <a class="drawer-nav-link" href="${getHomePath(currentPath)}#about" data-i18n="hub.header.about">소개</a>
          <a class="drawer-nav-link" href="${getHomePath(currentPath)}games/">게임 목록</a>
          <a class="drawer-nav-link" href="${getHomePath(currentPath)}patch-notes/">패치노트</a>
          <a class="drawer-nav-link" href="${getHomePath(currentPath)}account/" data-i18n="hub.header.account">계정</a>
        </nav>

        <div class="drawer-actions">
          <div class="drawer-actions-group">
            <div class="drawer-actions-label" data-i18n="hub.drawer.language">언어</div>
            <select class="drawer-select" id="drawerLangSelect" aria-label="Language">
              <option value="ko">한국어 (KO)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>

          <div class="drawer-actions-group">
            <div class="drawer-actions-label" data-i18n="hub.drawer.account">계정</div>
            <!-- Auth 상태에 따라 동적 렌더링 -->
            <div id="drawerAuthSection">
              <!-- loading/guest/authed 상태에 따라 동적 업데이트 -->
            </div>
            <a href="${getHomePath(currentPath)}account/" class="drawer-btn" style="margin-top: 8px; text-align: center; text-decoration: none;" onclick="document.getElementById('drawer').classList.remove('open'); document.getElementById('drawerOverlay').classList.remove('show'); document.body.classList.remove('drawer-open');">⚙️ 계정 관리</a>
          </div>
        </div>
      </div>
    </aside>
  `;

  mountEl.innerHTML = headerHTML;

  // 언어 적용
  applyLang(lang);

  // 언어 선택 초기값 설정
  const langSelect = document.getElementById('drawerLangSelect');
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      applyLang(newLang);
      if (onLangChange) onLangChange(newLang);
    });
  }

  // 드로어 초기화
  initDrawer();

  // Auth 상태 구독 및 UI 업데이트 (초기 렌더링 후)
  setTimeout(async () => {
    // 초기 상태 확인
    const initialUser = await getUser();
    updateAuthUIFromUser(initialUser, currentPath, onLogin, onLogout);

    // Auth 상태 변경 감지
    const unsubscribe = onAuthStateChange((user) => {
      updateAuthUIFromUser(user, currentPath, onLogin, onLogout);
    });

    // 컴포넌트 반환 객체에 구독 해제 함수 저장
    if (mountEl._headerUnsubscribe) {
      mountEl._headerUnsubscribe();
    }
    mountEl._headerUnsubscribe = unsubscribe;
  }, 100);

  return {
    unmount: () => {
      if (mountEl._headerUnsubscribe) {
        mountEl._headerUnsubscribe();
      }
    },
  };
}

/**
 * Auth UI 업데이트 (user 객체 기반)
 */
function updateAuthUIFromUser(user, currentPath, onLogin, onLogout) {
  const drawerAuthSection = document.getElementById('drawerAuthSection');
  if (!drawerAuthSection) return;

  const status = user ? 'authed' : 'guest';

  // 기존 이벤트 리스너 제거를 위해 innerHTML 전에 처리
  const oldLoginBtn = document.getElementById('drawerAuthLoginBtn');
  const oldLogoutBtn = document.getElementById('drawerAuthLogoutBtn');
  if (oldLoginBtn) {
      oldLoginBtn.replaceWith(oldLoginBtn.cloneNode(true));
  }
  if (oldLogoutBtn) {
      oldLogoutBtn.replaceWith(oldLogoutBtn.cloneNode(true));
  }

  // 숨김 요소는 DOM에서 완전히 제거 (aria-hidden + tabindex=-1)
  let authHTML = '';

  if (status === 'loading') {
    authHTML = '<div style="color: var(--muted); font-size: 12px;">Checking session…</div>';
  } else if (status === 'guest') {
    // guest: Login 버튼만 표시
    authHTML = `
      <button class="drawer-btn" id="drawerAuthLoginBtn" data-i18n="hub.header.login">로그인</button>
    `;
  } else if (status === 'authed' && user) {
    // authed: Profile + Logout만 표시
    const displayName = pickDisplayName(user);
    authHTML = `
      <span class="drawer-userchip" id="drawerAuthUserLabel">${displayName || 'User'}</span>
      <button class="drawer-btn" id="drawerAuthLogoutBtn">Logout</button>
    `;
  } else if (status === 'error') {
    authHTML = '<div style="color: var(--danger); font-size: 12px;">Auth error</div>';
  }

  drawerAuthSection.innerHTML = authHTML;
  applyLang(getActiveLang());

  // 새로 생성된 버튼에 이벤트 리스너 추가
  const loginBtn = document.getElementById('drawerAuthLoginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (onLogin) {
        onLogin();
      } else {
        await handleLogin();
      }
    });
  }

  const logoutBtn = document.getElementById('drawerAuthLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (onLogout) {
        onLogout();
      } else {
        await handleLogout();
      }
    });
  }
}

/**
 * 로그인 처리
 */
async function handleLogin() {
  if (!isAuthEnabled()) {
    console.warn('Auth not enabled');
    return;
  }
  const result = await signInWithOAuth('google');
  if (!result.ok) {
    console.error('Login failed:', result.reason);
  }
}

/**
 * 로그아웃 처리
 */
async function handleLogout() {
  if (!isAuthEnabled()) {
    console.warn('Auth not enabled');
    return;
  }
  const result = await signOut();
  if (!result.ok) {
    console.error('Logout failed:', result.reason);
  }
}

/**
 * 드로어 초기화
 */
function initDrawer() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerNavLinks = document.querySelectorAll('.drawer-nav-link');

  if (!hamburgerBtn || !drawer || !drawerOverlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('show');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    drawerOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');

    // 포커스 이동: 드로어의 첫 포커스 가능한 요소로
    const firstFocusable = drawer.querySelector('a, button, select, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('show');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    drawerOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');

    // 포커스 복귀: 햄버거 버튼으로
    hamburgerBtn.focus();
  }

  hamburgerBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // 드로어 내부 링크 클릭 시 드로어 닫기 (동적으로 추가되는 링크도 처리)
  function setupDrawerNavLinks() {
    const links = document.querySelectorAll('.drawer-nav-link');
    links.forEach((link) => {
      // 중복 리스너 방지: 기존 리스너 제거 후 추가
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      newLink.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }
  
  // 초기 설정
  setupDrawerNavLinks();
  
  // 동적으로 추가되는 링크를 위해 MutationObserver 사용
  const drawerNav = document.querySelector('.drawer-nav');
  if (drawerNav) {
    const navObserver = new MutationObserver(() => {
      setupDrawerNavLinks();
    });
    navObserver.observe(drawerNav, { childList: true, subtree: true });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * 현재 경로에 맞는 홈 경로 반환
 */
function getHomePath(currentPath) {
  if (currentPath.startsWith('/account/')) return '../';
  if (currentPath.startsWith('/games/')) return '../../';
  if (currentPath.startsWith('/patch-notes/')) return '../';
  if (currentPath.startsWith('/support/')) return '../';
  return './';
}

/**
 * 현재 경로에 맞는 로고 경로 반환
 */
function getLogoPath(currentPath) {
  if (currentPath.startsWith('/account/')) return '../seoulsurvival/assets/images/logo.png';
  if (currentPath.startsWith('/games/')) return '../../seoulsurvival/assets/images/logo.png';
  if (currentPath.startsWith('/patch-notes/')) return '../seoulsurvival/assets/images/logo.png';
  if (currentPath.startsWith('/support/')) return '../seoulsurvival/assets/images/logo.png';
  return 'seoulsurvival/assets/images/logo.png';
}

