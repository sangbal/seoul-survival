/**
 * 공통 푸터 컴포넌트
 * 
 * 모든 페이지에서 동일한 푸터를 제공합니다.
 */

/**
 * 푸터 렌더링
 */
export function renderFooter(mountEl, options = {}) {
  const {
    currentPath = '/',
    hubVersion = '1.2.0',
  } = options;

  if (!mountEl) {
    console.warn('Footer mount element not found');
    return null;
  }

  const homePath = getHomePath(currentPath);

  const footerHTML = `
    <footer id="footer" aria-label="Footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="${getLogoPath(currentPath)}" alt="ClickSurvivor" />
          </div>
          <div class="footer-brand-text">
            <div class="footer-brand-name">ClickSurvivor</div>
            <div class="footer-brand-tag" data-i18n="hub.brand.tag">오늘도 서울에서 살아남기</div>
          </div>
        </div>

        <div class="footer-grid">
          <div class="footer-section">
            <div class="footer-section-title" data-i18n="hub.footer.game.title">게임</div>
            <div class="footer-links">
              <a href="${homePath}games/">게임 목록</a>
              <a href="${homePath}seoulsurvival/" data-i18n="hub.footer.game.play">Seoul Survival 플레이</a>
              <a href="${homePath}#about" data-i18n="hub.footer.game.about">게임 소개</a>
            </div>
          </div>

          <div class="footer-section">
            <div class="footer-section-title" data-i18n="hub.footer.support.title">지원</div>
            <div class="footer-links">
              <a href="${homePath}patch-notes/">패치노트</a>
              <a href="${homePath}account/" data-i18n="hub.footer.support.account">계정 관리</a>
              <a href="${homePath}support/" data-i18n="hub.footer.contact">문의하기 / FAQ</a>
            </div>
          </div>

          <div class="footer-section">
            <div class="footer-section-title" data-i18n="hub.footer.legal.title">법적 고지</div>
            <div class="footer-links">
              <a href="${homePath}terms.html" data-i18n="hub.footer.terms">이용약관</a>
              <a href="${homePath}privacy.html" data-i18n="hub.footer.privacy">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-meta">
          <span class="version">v<span id="version">${hubVersion}</span></span>
        </div>
      </div>
    </footer>
  `;

  mountEl.innerHTML = footerHTML;

  return {
    unmount: () => {},
  };
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

