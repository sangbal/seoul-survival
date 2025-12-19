import { applyLang, getInitialLang } from './i18n.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove('show'), 1400);
}

function initVersion() {
  // package.json is the source of truth, but hub is a static HTML page.
  // Keep this in sync when releasing.
  const v = $('#version');
  if (v) v.textContent = '1.0.0';
}

// 로그인 버튼은 shared/authBoot.js에서 처리

function initLangSelect() {
  const select = $('#langSelect');
  if (!select) return;
  select.addEventListener('change', (e) => {
    const lang = String(e.target.value || '').toLowerCase();
    const applied = applyLang(lang);
    showToast(applied === 'ko' ? '언어: 한국어' : 'Language: English');
    // 드로어의 언어 선택도 동기화
    const drawerSelect = $('#drawerLangSelect');
    if (drawerSelect) drawerSelect.value = lang;
  });
}

function initDrawerLangSelect() {
  const drawerSelect = $('#drawerLangSelect');
  if (!drawerSelect) return;
  drawerSelect.addEventListener('change', (e) => {
    const lang = String(e.target.value || '').toLowerCase();
    const applied = applyLang(lang);
    showToast(applied === 'ko' ? '언어: 한국어' : 'Language: English');
    // 헤더의 언어 선택도 동기화
    const headerSelect = $('#langSelect');
    if (headerSelect) headerSelect.value = lang;
    // 계정 섹션의 언어 선택도 동기화
    const accountLangSelect = $('#accountLangSelect');
    if (accountLangSelect) accountLangSelect.value = lang;
  });
}

function initAccountLangSelect() {
  const accountLangSelect = $('#accountLangSelect');
  if (!accountLangSelect) return;
  accountLangSelect.addEventListener('change', (e) => {
    const lang = String(e.target.value || '').toLowerCase();
    const applied = applyLang(lang);
    showToast(applied === 'ko' ? '언어: 한국어' : 'Language: English');
    // 헤더의 언어 선택도 동기화
    const headerSelect = $('#langSelect');
    if (headerSelect) headerSelect.value = lang;
    // 드로어의 언어 선택도 동기화
    const drawerSelect = $('#drawerLangSelect');
    if (drawerSelect) drawerSelect.value = lang;
  });
}

function initDrawer() {
  const hamburgerBtn = $('#hamburgerBtn');
  const drawer = $('#drawer');
  const drawerOverlay = $('#drawerOverlay');
  const drawerClose = $('#drawerClose');
  const drawerNavLinks = $$('.drawer-nav-link');

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

  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // 드로어 내부 링크 클릭 시 드로어 닫기
  drawerNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // ESC 키로 드로어 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

// 드로어의 로그인 버튼 동기화 (shared/authBoot.js에서 처리된 후)
function syncDrawerAuthUI() {
  const headerUserLabel = $('#authUserLabel');
  const headerLoginBtn = $('#authLoginBtn');
  const headerLogoutBtn = $('#authLogoutBtn');
  const drawerUserLabel = $('#drawerAuthUserLabel');
  const drawerLoginBtn = $('#drawerAuthLoginBtn');
  const drawerLogoutBtn = $('#drawerAuthLogoutBtn');

  // 드로어 버튼에 헤더 버튼과 동일한 이벤트 리스너 연결
  if (drawerLoginBtn && headerLoginBtn) {
    drawerLoginBtn.addEventListener('click', () => {
      headerLoginBtn.click();
    });
  }

  if (drawerLogoutBtn && headerLogoutBtn) {
    drawerLogoutBtn.addEventListener('click', () => {
      headerLogoutBtn.click();
    });
  }

  // 로그인 상태 변경 시 드로어 UI도 동기화 (MutationObserver로 무한 루프 방지)
  let isSyncing = false;
  const syncDrawerUI = () => {
    if (isSyncing) return; // 무한 루프 방지
    isSyncing = true;
    
    try {
      if (headerUserLabel) {
        const isVisible = !headerUserLabel.hasAttribute('hidden');
        if (drawerUserLabel) {
          if (isVisible) {
            drawerUserLabel.textContent = headerUserLabel.textContent;
            drawerUserLabel.removeAttribute('hidden');
          } else {
            drawerUserLabel.setAttribute('hidden', '');
          }
        }
      }
      if (headerLoginBtn) {
        const isVisible = !headerLoginBtn.hasAttribute('hidden');
        if (drawerLoginBtn) {
          if (isVisible) {
            drawerLoginBtn.removeAttribute('hidden');
            drawerLoginBtn.setAttribute('aria-hidden', 'false');
            drawerLoginBtn.setAttribute('tabindex', '0');
          } else {
            drawerLoginBtn.setAttribute('hidden', '');
            drawerLoginBtn.setAttribute('aria-hidden', 'true');
            drawerLoginBtn.setAttribute('tabindex', '-1');
          }
        }
      }
      if (headerLogoutBtn) {
        const isVisible = !headerLogoutBtn.hasAttribute('hidden');
        if (drawerLogoutBtn) {
          if (isVisible) {
            drawerLogoutBtn.removeAttribute('hidden');
            drawerLogoutBtn.setAttribute('aria-hidden', 'false');
            drawerLogoutBtn.setAttribute('tabindex', '0');
          } else {
            drawerLogoutBtn.setAttribute('hidden', '');
            drawerLogoutBtn.setAttribute('aria-hidden', 'true');
            drawerLogoutBtn.setAttribute('tabindex', '-1');
          }
        }
      }
    } finally {
      isSyncing = false;
    }
  };

  const observer = new MutationObserver(syncDrawerUI);

  if (headerUserLabel) observer.observe(headerUserLabel, { attributes: true, attributeFilter: ['hidden'], childList: false, subtree: false });
  if (headerLoginBtn) observer.observe(headerLoginBtn, { attributes: true, attributeFilter: ['hidden'], childList: false, subtree: false });
  if (headerLogoutBtn) observer.observe(headerLogoutBtn, { attributes: true, attributeFilter: ['hidden'], childList: false, subtree: false });
  
  // 초기 동기화
  syncDrawerUI();
}

const initialLang = getInitialLang();
applyLang(initialLang);
initVersion();
initLangSelect();
initDrawerLangSelect();
initAccountLangSelect();
initDrawer();

// 언어 선택 초기값 동기화
const headerSelect = $('#langSelect');
const drawerSelect = $('#drawerLangSelect');
const accountLangSelect = $('#accountLangSelect');
if (headerSelect) headerSelect.value = initialLang;
if (drawerSelect) drawerSelect.value = initialLang;
if (accountLangSelect) accountLangSelect.value = initialLang;

// authBoot.js 로드 후 드로어 UI 동기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(syncDrawerAuthUI, 100);
  });
} else {
  setTimeout(syncDrawerAuthUI, 100);
}


