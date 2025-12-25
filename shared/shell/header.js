// 공통 헤더 컴포넌트 (SeoulSurvival 패턴 기반)
export function renderHeader(container) {
  if (!container) return;
  
  // 현재 경로에 따라 홈 링크 경로 결정
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  // 홈 링크는 항상 절대 경로로 설정 (뒤로가기 방지)
  let homeHref = '/';
  let logoHref = './seoulsurvival/assets/images/logo.png';
  let accountHref = './account/';
  
  // seoulsurvival/ 폴더에 있는 경우
  if (currentPath.includes('/seoulsurvival/')) {
    homeHref = '/';
    logoHref = './assets/images/logo.png';
    accountHref = '/account/';
  }
  // account/ 폴더에 있는 경우
  else if (currentPath.includes('/account/')) {
    homeHref = '/';
    logoHref = '../seoulsurvival/assets/images/logo.png';
    accountHref = './';
  }
  // auth/callback/ 폴더에 있는 경우
  else if (currentPath.includes('/auth/callback/')) {
    homeHref = '/';
    logoHref = '../../seoulsurvival/assets/images/logo.png';
    accountHref = '/account/';
  }
  
  container.innerHTML = `
    <header>
      <div class="header-brand" aria-label="ClickSurvivor Hub">
        <a href="${homeHref}" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px;">
          <img class="brand-icon" src="${logoHref}" alt="" aria-hidden="true" />
          <span class="brand-text"><b>ClickSurvivor</b></span>
        </a>
      </div>
      
      <!-- 즐겨찾기 / 홈 화면 안내 버튼 -->
      <button
        class="chip favorite-btn"
        id="headerFavoriteBtn"
        type="button"
        title="즐겨찾기 / 홈 화면에 추가 안내"
        aria-label="즐겨찾기 / 홈 화면에 추가 안내"
      >
        <span class="favorite-icon">⭐</span>
        <span class="favorite-label">즐겨찾기</span>
      </button>

      <!-- 공유하기 버튼 -->
      <button class="chip share-btn" id="headerShareBtn" type="button" title="페이지 공유하기" aria-label="페이지 공유하기">
        <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.6 2.6 0 0 0 0-1.39l7.02-4.11A2.99 2.99 0 1 0 14 5a3 3 0 0 0 .06.59L7.03 9.7A3 3 0 1 0 7 14.3l7.02 4.11A3 3 0 1 0 18 16.08z"></path>
        </svg>
        <span class="share-label">공유</span>
      </button>
      
      <nav class="header-nav" style="display: flex; gap: 10px; align-items: center;">
        <!-- 계정 버튼 (로그인 상태에 따라 동적 업데이트) -->
        <div class="header-account" id="headerAccount">
          <!-- 로그인 안 됨: Login 버튼 -->
          <button id="headerLoginBtn" class="chip login-btn" type="button" title="로그인" aria-label="로그인">
            <span class="login-label">로그인</span>
          </button>
          <!-- 로그인 됨: 햄버거 메뉴 아이콘 -->
          <div id="headerAccountMenu" style="display: none; position: relative;">
            <!-- 모든 버전: 햄버거 메뉴 아이콘 -->
            <button id="headerAccountBtn" class="chip account-btn" type="button" title="계정 메뉴" aria-label="계정 메뉴">
              <svg class="hamburger-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div id="headerAccountDropdown" class="account-dropdown">
              <div class="account-menu-header">
                <span id="headerAccountNicknameMobile" class="account-menu-nickname">Guest</span>
              </div>
              <a href="${accountHref}" class="account-menu-item">
                계정 관리
              </a>
              <button id="headerLogoutBtn" class="account-menu-item" type="button">
                로그아웃
              </button>
            </div>
          </div>
          <!-- 모바일 바텀시트 오버레이 (body에 직접 렌더링) -->
          <div id="headerAccountOverlay" class="account-overlay"></div>
        </div>
      </nav>
    </header>
  `;
  
  // 계정 메뉴 이벤트 처리
  const accountMenu = container.querySelector('#headerAccountMenu');
  let dropdown = container.querySelector('#headerAccountDropdown');
  let overlay = container.querySelector('#headerAccountOverlay');
  const accountBtn = container.querySelector('#headerAccountBtn');
  const nicknameMobile = container.querySelector('#headerAccountNicknameMobile');
  
  // 모바일에서 바텀시트와 오버레이를 body에 직접 렌더링
  function ensureMobileMenuInBody() {
    if (window.innerWidth <= 768) {
      // 바텀시트가 이미 body에 있으면 스킵
      if (dropdown && dropdown.parentElement === document.body) {
        return;
      }
      
      // 기존 바텀시트와 오버레이를 body로 이동
      if (dropdown && dropdown.parentElement !== document.body) {
        document.body.appendChild(dropdown);
      }
      if (overlay && overlay.parentElement !== document.body) {
        document.body.appendChild(overlay);
      }
    } else {
      // PC에서는 원래 위치로 복원
      if (dropdown && dropdown.parentElement === document.body && accountMenu) {
        accountMenu.appendChild(dropdown);
      }
      if (overlay && overlay.parentElement === document.body && accountMenu) {
        accountMenu.appendChild(overlay);
      }
    }
  }
  
  // 초기 설정
  ensureMobileMenuInBody();
  
  // 창 크기 변경 시 재설정
  window.addEventListener('resize', () => {
    ensureMobileMenuInBody();
  });
  
  // 초기 상태: 드롭다운 숨김
  if (dropdown) {
    dropdown.style.display = 'none';
  }
  if (overlay) {
    overlay.style.display = 'none';
  }
  
  // 모바일/데스크톱 감지 함수
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // 모바일 메뉴 열기
  function openMobileMenu() {
    // 모바일 메뉴가 body에 있는지 확인
    ensureMobileMenuInBody();
    
    if (dropdown) {
      dropdown.style.display = 'block';
      dropdown.style.position = 'fixed';
      dropdown.style.bottom = '0';
      dropdown.style.left = '0';
      dropdown.style.right = '0';
      dropdown.style.top = 'auto';
      dropdown.style.zIndex = '10000';
      dropdown.style.margin = '0';
      // 초기 위치 설정 (화면 밖)
      dropdown.style.transform = 'translateY(100%)';
      // 클래스 추가로 애니메이션 트리거
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (dropdown) {
            dropdown.classList.add('show');
          }
        });
      });
    }
    if (overlay) {
      overlay.style.display = 'block';
      overlay.style.zIndex = '9999';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.right = '0';
      overlay.style.bottom = '0';
    }
    document.body.style.overflow = 'hidden'; // 스크롤 방지
  }
  
  // 모바일 메뉴 닫기
  function closeMobileMenu() {
    if (dropdown) {
      dropdown.classList.remove('show');
      dropdown.style.transform = 'translateY(100%)';
      // 애니메이션 완료 후 숨김
      setTimeout(() => {
        if (dropdown) {
          dropdown.style.display = 'none';
        }
      }, 300); // 애니메이션 시간과 동일
    }
    if (overlay) {
      overlay.style.display = 'none';
    }
    document.body.style.overflow = ''; // 스크롤 복원
  }
  
  if (accountMenu && dropdown) {
    // 모든 버전: 클릭 이벤트
    if (accountBtn) {
      accountBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMobile()) {
          // 모바일: 바텀시트 열기/닫기
          if (dropdown.style.display === 'block') {
            closeMobileMenu();
          } else {
            openMobileMenu();
          }
        } else {
          // PC: 드롭다운 토글
          if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
          } else {
            dropdown.style.display = 'block';
          }
        }
      });
    }
    
    // 모바일: 오버레이 클릭 시 메뉴 닫기
    if (overlay) {
      overlay.addEventListener('click', () => {
        if (isMobile()) {
          closeMobileMenu();
        }
      });
    }
    
    // 모바일: 메뉴 항목 클릭 시 메뉴 닫기
    const menuItems = dropdown.querySelectorAll('.account-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        if (isMobile()) {
          setTimeout(() => closeMobileMenu(), 100); // 약간의 지연으로 전환 애니메이션 보장
        }
      });
    });
    
    // 닉네임 동기화 (모바일 메뉴 헤더에 표시)
    // 닉네임은 드롭다운 메뉴 헤더에만 표시됨
    
    // 창 크기 변경 시 모바일 메뉴 닫기
    window.addEventListener('resize', () => {
      if (!isMobile() && dropdown.style.display === 'block') {
        closeMobileMenu();
      }
    });
  }
  
  // ======= 공유하기 기능 =======
  const shareBtn = container.querySelector('#headerShareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const pageUrl = window.location.href;
      const pageTitle = document.title || 'ClickSurvivor Hub';
      const pageDescription = '게임 허브 - 여러 게임을 한 곳에서 플레이하세요';
      
      if (!navigator.share) {
        // Web Share API가 없는 경우 간단한 알림
        alert('이 기기/브라우저에서는 공유하기를 지원하지 않습니다.');
        return;
      }

      try {
        await navigator.share({
          title: pageTitle,
          text: pageDescription,
          url: pageUrl,
        });
      } catch (err) {
        // 사용자가 공유 UI를 닫은 경우는 조용히 무시
        if (err?.name !== 'AbortError') {
          console.error('공유 실패:', err);
        }
      }
    });
  }
  
  // ======= 즐겨찾기 / 홈 화면 안내 =======
  const favoriteBtn = container.querySelector('#headerFavoriteBtn');
  if (favoriteBtn) {
    favoriteBtn.addEventListener('click', () => {
      const url = window.location.href;
      const title = document.title || 'ClickSurvivor Hub';
      const ua = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|ipod|android/.test(ua);
      const isIOS = /iphone|ipad|ipod/.test(ua);
      const isAndroid = /android/.test(ua);
      const isMac = navigator.platform.toUpperCase().includes('MAC');

      // (아주 옛날 IE 전용) 가능한 경우 직접 즐겨찾기 추가 시도
      if (window.external && typeof window.external.AddFavorite === 'function') {
        try {
          window.external.AddFavorite(url, title);
          return;
        } catch {
          // 실패하면 아래 안내로 fallback
        }
      }

      let message = '';
      let modalTitle = '즐겨찾기 / 홈 화면에 추가';
      let icon = '⭐';

      if (isMobile) {
        if (isIOS) {
          message =
            'iPhone/iPad에서는 Safari 하단의 공유 버튼(□↑)을 누른 뒤\n' +
            '"홈 화면에 추가"를 선택하면 바탕화면에 아이콘이 만들어집니다.';
        } else if (isAndroid) {
          message =
            'Android에서는 브라우저 오른쪽 위 메뉴(⋮)에서\n' +
            '"홈 화면에 추가" 또는 "앱 설치"를 선택하면 바탕화면에 아이콘이 만들어집니다.';
        } else {
          message = '이 기기에서는 브라우저의 메뉴에서 "홈 화면에 추가" 기능을 사용해 주세요.';
        }
      } else {
        const shortcut = isMac ? '⌘ + D' : 'Ctrl + D';
        message = `${shortcut} 를 눌러 이 페이지를 브라우저 즐겨찾기에 추가할 수 있습니다.`;
      }

      alert(`${icon} ${modalTitle}\n\n${message}`);
    });
  }
}

// 자동 렌더링 (terms.html, privacy.html 등에서 사용)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('header-mount');
    if (container) {
      renderHeader(container);
      
      // 헤더 계정 버튼 인증 UI 초기화 (terms.html, privacy.html 등에서도)
      try {
        const { initAuthUI } = await import('../auth/ui.js');
        const { getUser, onAuthStateChange } = await import('../auth/core.js');
        
        const loginBtn = document.getElementById('headerLoginBtn');
        const logoutBtn = document.getElementById('headerLogoutBtn');
        const accountMenu = document.getElementById('headerAccountMenu');
        const nicknameMobile = document.getElementById('headerAccountNicknameMobile');
        
        if (!loginBtn && !logoutBtn) return;
        
        // 초기 상태 설정 (게스트 모드)
        if (loginBtn) loginBtn.style.display = 'block';
        if (accountMenu) accountMenu.style.setProperty('display', 'none', 'important');
        
        // 닉네임 업데이트 함수 (getUserProfile 사용)
        async function updateNickname(user) {
          if (!nicknameMobile) return;
          
          if (!user) {
            nicknameMobile.textContent = 'Guest';
            return;
          }
          
          try {
            const { getUserProfile } = await import('../auth/core.js');
            const profile = await getUserProfile('seoulsurvival');
            if (profile.success && profile.user?.nickname) {
              nicknameMobile.textContent = profile.user.nickname;
              console.log('[Header] Nickname updated:', profile.user.nickname);
            } else {
              const fallback = user?.user_metadata?.full_name || 
                             user?.user_metadata?.name || 
                             user?.user_metadata?.preferred_username || 
                             user?.email?.split('@')[0] || 
                             'Guest';
              nicknameMobile.textContent = fallback;
              console.log('[Header] Using fallback nickname:', fallback);
            }
          } catch (error) {
            console.warn('[Header] Failed to get nickname:', error);
            const fallback = user?.user_metadata?.full_name || 
                           user?.user_metadata?.name || 
                           user?.user_metadata?.preferred_username || 
                           user?.email?.split('@')[0] || 
                           'Guest';
            nicknameMobile.textContent = fallback;
            console.log('[Header] Using fallback nickname (error):', fallback);
          }
        }
        
        // 로그인 상태 변경 시 헤더 UI 업데이트
        async function updateHeaderUI(user) {
          const isLoggedIn = !!user;
          
          if (loginBtn) {
            loginBtn.style.display = isLoggedIn ? 'none' : 'block';
          }
          
          if (accountMenu) {
            // !important를 우회하기 위해 setProperty 사용
            if (isLoggedIn) {
              accountMenu.style.setProperty('display', 'block', 'important');
            } else {
              accountMenu.style.setProperty('display', 'none', 'important');
            }
          }
          
          // 닉네임 업데이트 (드롭다운 메뉴 헤더에만 표시)
          await updateNickname(user);
        }
        
        // 초기 상태 설정 (initAuthUI 호출 전에 먼저 설정)
        const initial = await getUser();
        await updateHeaderUI(initial);
        
        // 인증 UI 초기화 (userLabel을 null로 설정하여 setUI가 닉네임을 덮어쓰지 않도록 함)
        const authOff = await initAuthUI({
          scope: 'hub',
          providerButtons: [],
          defaultProvider: 'google',
          loginBtn,
          logoutBtn,
          userLabel: null, // 닉네임은 updateNickname에서 직접 관리
          statusLabel: null,
          toast: (msg) => console.log('[Header]', msg),
        });
        
        // initAuthUI 내부의 onAuthStateChange가 setUI를 호출하지만 userLabel이 null이므로 닉네임은 업데이트하지 않음
        // 우리의 onAuthStateChange가 나중에 실행되어 닉네임을 업데이트하도록 함
        // 하지만 initAuthUI 내부의 콜백이 먼저 실행될 수 있으므로, 약간의 지연을 두고 다시 업데이트
        setTimeout(async () => {
          const currentUser = await getUser();
          await updateHeaderUI(currentUser);
        }, 100);
        
        // 로그인 상태 변경 감지 (닉네임도 함께 업데이트)
        // initAuthUI 내부의 onAuthStateChange와 별도로 관리
        onAuthStateChange(async (user) => {
          await updateHeaderUI(user);
        });
      } catch (error) {
        console.warn('[Header] Auth init failed, using guest mode:', error);
        const loginBtn = document.getElementById('headerLoginBtn');
        const accountMenu = document.getElementById('headerAccountMenu');
        if (loginBtn) loginBtn.style.display = 'block';
        if (accountMenu) accountMenu.style.setProperty('display', 'none', 'important');
      }
    }
  });
}
