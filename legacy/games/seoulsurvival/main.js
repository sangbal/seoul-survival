import { getGame } from '../../hub/games.registry.js';
import { getInitialLang, applyLang } from '../../hub/i18n.js';
// header.js는 동적 import로 변경 (auth 모듈 로드 지연)
// import { renderHeader } from '../../shared/shell/header.js';
import { renderFooter } from '../../shared/shell/footer.js';
// auth/core.js는 동적 import로 변경 (config.js 로드 지연)
// import { getUser, onAuthStateChange } from '../../shared/auth/core.js';
// Auth 초기화는 shared/authBoot.js에서 처리

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// 모듈 레벨에서 getInitialLang() 호출 제거 (DOMContentLoaded 이후로 지연)
let currentLang = 'ko'; // 기본값, 나중에 업데이트
const game = getGame('seoulsurvival');

function showToast(msg) {
  console.log('[Toast]', msg);
}

// 공통 헤더/푸터 초기화
async function initCommonShell() {
  const currentPath = window.location.pathname;
  const initialLang = getInitialLang();

  // Auth 초기화는 shared/authBoot.js에서 처리 (블로킹하지 않음)

  // 헤더 렌더링 (Auth 실패와 무관하게 진행) - 동적 import
  const headerMount = $('#commonHeaderMount');
  if (headerMount) {
    const { renderHeader } = await import('../../shared/shell/header.js');
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

    // Patch Notes Section
    let patchNotesHTML = '';
    patchNotesHTML = `
      <div class="content-section" id="patchNotesSection">
        <h2 class="section-title">패치노트</h2>
        <div id="patchNotesContainer">
          <p style="color: var(--muted);">로딩 중...</p>
        </div>
      </div>
    `;

    storeMain.innerHTML = `
      ${heroMediaHTML}
      ${screenshotsHTML}
      ${aboutHTML}
      ${keyFeaturesHTML}
      ${patchNotesHTML}
      ${supportHTML}
      <!-- 리뷰 섹션 -->
      <div class="content-section" id="reviewsSection">
        <h2 class="section-title">리뷰</h2>
        <div id="reviewsContainer">
          <p style="color: var(--muted);">로딩 중...</p>
        </div>
      </div>
    `;

    // 패치노트 로드
    loadPatchNotes();
    
    // 리뷰 로드
    loadReviews();
  }

  // Right Column: Sidebar
  const storeSidebar = $('#storeSidebar');
  if (storeSidebar) {
    const title = game.title[currentLang] || game.title.ko;
    const tagline = game.tagline[currentLang] || game.tagline.ko;
    const tags = game.tags || [];

    // Auth 상태 확인 (비동기이므로 초기에는 guest로 가정) - 동적 import
    const { getUser, onAuthStateChange } = await import('../../shared/auth/core.js');
    
    let authState = { status: 'loading', user: null };
    const unsubscribe = onAuthStateChange((user) => {
      authState = { status: user ? 'authed' : 'guest', user };
      updateSidebarCTA(authState);
    });
    
    // 초기 상태 확인
    getUser().then(user => {
      authState = { status: user ? 'authed' : 'guest', user };
      updateSidebarCTA(authState);
    }).catch(() => {
      authState = { status: 'guest', user: null };
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

    // 출시 상태 배지
    const statusBadge = game.status === 'playable' 
      ? '<span class="status-badge released">Released</span>'
      : game.status === 'comingSoon'
      ? '<span class="status-badge coming-soon">Coming Soon</span>'
      : '<span class="status-badge early-access">Early Access</span>';

    storeSidebar.innerHTML = `
      <div class="sidebar-card">
        <h1 class="game-title-main">${title}</h1>
        <p class="game-tagline">${tagline}</p>
        ${statusBadge}
        <div class="game-tags" style="margin-top: var(--space-3);">
          ${tags.map(tag => {
            const tagText = typeof tag === 'object' ? (tag[currentLang] || tag.ko) : tag;
            return `<span class="game-tag">${tagText}</span>`;
          }).join('')}
        </div>
        <div id="ctaSection" style="margin-top: var(--space-4);">
          <!-- CTA는 Auth 상태에 따라 동적 업데이트 -->
        </div>
      </div>
      <div class="sidebar-card">
        <h3 class="section-title" style="font-size: var(--font-md); margin-bottom: var(--space-3);">게임 정보</h3>
        <ul class="support-list">
          <li>최근 업데이트: ${game.lastUpdated || 'N/A'}</li>
          <li>개발자: ClickSurvivor</li>
          <li>장르: ${tags.slice(0, 2).map(t => typeof t === 'object' ? (t[currentLang] || t.ko) : t).join(', ')}</li>
        </ul>
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

// 패치노트 로드
async function loadPatchNotes() {
  const container = $('#patchNotesContainer');
  if (!container) return;

  try {
    // index.json 로드
    const indexResponse = await fetch('../../games/seoulsurvival/patch-notes/index.json');
    if (!indexResponse.ok) {
      throw new Error('Failed to load patch notes index');
    }
    const patchNotesIndex = await indexResponse.json();

    // 최신 2개는 하이라이트, 나머지는 아코디언
    const latest = patchNotesIndex.slice(0, 2);
    const older = patchNotesIndex.slice(2);

    let html = '';

    // 최신 2개 하이라이트
    for (const patch of latest) {
      const title = patch.title[currentLang] || patch.title.ko;
      const summary = patch.summary[currentLang] || patch.summary.ko;
      html += `
        <div class="patch-preview" style="margin-bottom: var(--space-4);">
          <div class="patch-preview-header">
            <span class="patch-preview-version">${patch.version}</span>
            <span class="patch-preview-date">${patch.date}</span>
          </div>
          <h3 class="patch-preview-title">${title}</h3>
          <p class="patch-preview-body">${summary}</p>
          <details class="patch-details">
            <summary style="cursor: pointer; color: var(--accent); font-weight: 900; margin-top: var(--space-2);">자세히 보기</summary>
            <div class="patch-content" style="margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--border);">
              <p style="color: var(--muted);">로딩 중...</p>
            </div>
          </details>
        </div>
      `;
    }

    // 나머지는 아코디언
    if (older.length > 0) {
      html += '<div style="margin-top: var(--space-6);"><h3 style="font-size: var(--font-md); font-weight: 900; margin-bottom: var(--space-3);">이전 업데이트</h3>';
      for (const patch of older) {
        const title = patch.title[currentLang] || patch.title.ko;
        const summary = patch.summary[currentLang] || patch.summary.ko;
        html += `
          <details class="patch-details" style="margin-bottom: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-3);">
            <summary style="cursor: pointer; font-weight: 900; color: var(--text);">
              <span style="color: var(--accent); margin-right: var(--space-2);">${patch.version}</span>
              ${title}
              <span style="color: var(--muted); font-size: var(--font-xs); margin-left: var(--space-2);">${patch.date}</span>
            </summary>
            <div class="patch-content" style="margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--border);">
              <p style="color: var(--muted); margin-bottom: var(--space-2);">${summary}</p>
              <p style="color: var(--muted);">로딩 중...</p>
            </div>
          </details>
        `;
      }
      html += '</div>';
    }

    container.innerHTML = html;

    // 각 패치노트의 마크다운 파일 로드 (비동기)
    const allPatches = [...latest, ...older];
    for (const patch of allPatches) {
      // details 요소 찾기 (버전으로 매칭)
      const patchEl = Array.from(container.querySelectorAll('.patch-preview, details.patch-details')).find(el => {
        const versionEl = el.querySelector('.patch-preview-version');
        if (versionEl && versionEl.textContent === patch.version) return true;
        const summaryEl = el.querySelector('summary');
        if (summaryEl && summaryEl.textContent.includes(patch.version)) return true;
        return false;
      });

      if (!patchEl) continue;

      const contentEl = patchEl.querySelector('.patch-content');
      if (!contentEl) continue;

      // 비동기로 마크다운 로드
      (async () => {
        try {
          const mdResponse = await fetch(`../../games/seoulsurvival/patch-notes/${patch.file}`);
          if (!mdResponse.ok) {
            throw new Error(`Failed to load ${patch.file}`);
          }
          const mdText = await mdResponse.text();
          // 간단한 마크다운 파싱
          const htmlContent = parseMarkdown(mdText);
          contentEl.innerHTML = htmlContent;
        } catch (err) {
          console.error(`Failed to load patch note ${patch.file}:`, err);
          contentEl.innerHTML = '<p style="color: var(--danger);">패치노트를 불러올 수 없습니다.</p>';
        }
      })();
    }
  } catch (err) {
    console.error('Failed to load patch notes:', err);
    container.innerHTML = '<p style="color: var(--muted);">패치노트를 불러올 수 없습니다.</p>';
  }
}

// 리뷰 로드
async function loadReviews() {
  const container = $('#reviewsContainer');
  if (!container) return;

  try {
    // 로그인 상태 확인 - 동적 import
    const { getUser } = await import('../../shared/auth/core.js');
    const user = await getUser();
    const isAuthed = !!user;

    if (!isAuthed) {
      container.innerHTML = `
        <div style="padding: var(--space-5); text-align: center; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface-2);">
          <p style="color: var(--muted); margin-bottom: var(--space-3);">로그인 후 리뷰를 확인하고 작성할 수 있습니다.</p>
          <a href="../../account/" class="cta-primary" style="display: inline-block; text-decoration: none;">로그인하기</a>
        </div>
      `;
      return;
    }

    // 리뷰 API 호출
    const { getReviews, getMyReview, getReviewStats, getUserNickname } = await import('../../shared/reviews.js');
    const gameSlug = 'seoulsurvival';

    const [reviewsResult, myReviewResult, statsResult, nicknameResult] = await Promise.all([
      getReviews(gameSlug, 20, 'recent'),
      getMyReview(gameSlug),
      getReviewStats(gameSlug),
      getUserNickname(gameSlug),
    ]);

    const reviews = reviewsResult.success ? reviewsResult.data : [];
    const myReview = myReviewResult.success ? myReviewResult.data : null;
    const stats = statsResult.success ? statsResult.data : { recommended: 0, notRecommended: 0, total: 0 };
    const nickname = nicknameResult.success ? nicknameResult.nickname : null;

    // 리뷰 섹션 렌더링
    let html = '';

    // 통계
    if (stats.total > 0) {
      const recommendedPercent = Math.round((stats.recommended / stats.total) * 100);
      html += `
        <div style="margin-bottom: var(--space-6); padding: var(--space-4); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface-2);">
          <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-2);">
            <div style="font-size: var(--font-2xl); font-weight: 900;">${recommendedPercent}%</div>
            <div>
              <div style="font-weight: 900; margin-bottom: 2px;">추천</div>
              <div style="font-size: var(--font-xs); color: var(--muted);">${stats.recommended}명 추천 · ${stats.notRecommended}명 비추천</div>
            </div>
          </div>
        </div>
      `;
    }

    // 내 리뷰 작성/수정 폼
    html += `
      <div style="margin-bottom: var(--space-6); padding: var(--space-5); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface);">
        <h3 style="font-size: var(--font-lg); font-weight: 900; margin-bottom: var(--space-4);">
          ${myReview ? '리뷰 수정' : '리뷰 작성'}
        </h3>
        ${!nickname ? `
          <p style="color: var(--muted); margin-bottom: var(--space-3);">리뷰를 작성하려면 먼저 게임에서 닉네임을 설정해주세요.</p>
          <a href="../../seoulsurvival/" class="cta-secondary" style="display: inline-block; text-decoration: none;">게임으로 이동</a>
        ` : `
          <form id="reviewForm" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div>
              <label style="display: block; font-weight: 900; margin-bottom: var(--space-2);">추천 여부</label>
              <div style="display: flex; gap: var(--space-3);">
                <button type="button" class="review-thumb-btn ${!myReview || myReview.recommended ? 'active' : ''}" data-recommended="true" style="flex: 1; padding: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-sm); background: ${!myReview || myReview.recommended ? 'rgba(94,234,212,.15)' : 'transparent'}; cursor: pointer;">
                  👍 추천
                </button>
                <button type="button" class="review-thumb-btn ${myReview && !myReview.recommended ? 'active' : ''}" data-recommended="false" style="flex: 1; padding: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-sm); background: ${myReview && !myReview.recommended ? 'rgba(251,113,133,.15)' : 'transparent'}; cursor: pointer;">
                  👎 비추천
                </button>
              </div>
            </div>
            <div>
              <label style="display: block; font-weight: 900; margin-bottom: var(--space-2);">한 줄 요약 <span style="color: var(--muted); font-weight: 400;">(필수)</span></label>
              <input type="text" id="reviewSummary" required maxlength="100" placeholder="게임에 대한 간단한 평가를 입력하세요" value="${myReview ? (myReview.summary || '') : ''}" style="width: 100%; padding: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); color: var(--text); font-size: var(--font-md);" />
            </div>
            <div>
              <label style="display: block; font-weight: 900; margin-bottom: var(--space-2);">상세 리뷰 <span style="color: var(--muted); font-weight: 400;">(선택)</span></label>
              <textarea id="reviewBody" rows="4" maxlength="1000" placeholder="더 자세한 의견을 남기고 싶다면 입력하세요" style="width: 100%; padding: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); color: var(--text); font-size: var(--font-md); resize: vertical;">${myReview ? (myReview.body || '') : ''}</textarea>
            </div>
            <div style="display: flex; gap: var(--space-3);">
              <button type="submit" class="cta-primary" style="flex: 1;">${myReview ? '수정하기' : '작성하기'}</button>
              ${myReview ? `<button type="button" id="deleteReviewBtn" class="cta-secondary" style="flex: 0 0 auto;">삭제</button>` : ''}
            </div>
          </form>
        `}
      </div>
    `;

    // 다른 사용자 리뷰 목록
    if (reviews.length > 0) {
      html += `
        <div style="margin-top: var(--space-6);">
          <h3 style="font-size: var(--font-lg); font-weight: 900; margin-bottom: var(--space-4);">다른 사용자 리뷰</h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            ${reviews.map(review => `
              <div style="padding: var(--space-4); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface-2);">
                <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2);">
                  <span style="font-size: var(--font-xl);">${review.recommended ? '👍' : '👎'}</span>
                  <div style="flex: 1;">
                    <div style="font-weight: 900; margin-bottom: 2px;">${review.nickname}</div>
                    <div style="font-size: var(--font-xs); color: var(--muted);">${new Date(review.created_at).toLocaleDateString(currentLang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
                <div style="font-weight: 900; margin-bottom: var(--space-2);">${review.summary}</div>
                ${review.body ? `<div style="color: var(--muted); line-height: 1.6; white-space: pre-wrap;">${review.body}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      html += `
        <div style="padding: var(--space-5); text-align: center; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface-2);">
          <p style="color: var(--muted);">아직 작성된 리뷰가 없습니다.</p>
        </div>
      `;
    }

    container.innerHTML = html;

    // 폼 이벤트 리스너
    if (nickname) {
      const form = $('#reviewForm');
      if (form) {
        let selectedRecommended = myReview ? myReview.recommended : true;
        
        // 추천/비추천 버튼 클릭
        $$('.review-thumb-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            selectedRecommended = btn.dataset.recommended === 'true';
            $$('.review-thumb-btn').forEach(b => {
              b.style.background = b === btn 
                ? (selectedRecommended ? 'rgba(94,234,212,.15)' : 'rgba(251,113,133,.15)')
                : 'transparent';
            });
          });
        });

        // 폼 제출
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const summary = $('#reviewSummary').value.trim();
          const body = $('#reviewBody').value.trim();

          if (!summary) {
            alert('한 줄 요약을 입력해주세요.');
            return;
          }

          const { upsertReview } = await import('../../shared/reviews.js');
          const result = await upsertReview(gameSlug, selectedRecommended, summary, body, nickname);

          if (result.success) {
            alert('리뷰가 저장되었습니다.');
            loadReviews(); // 리뷰 목록 새로고침
          } else {
            alert(`리뷰 저장 실패: ${result.error}`);
          }
        });

        // 삭제 버튼
        const deleteBtn = $('#deleteReviewBtn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', async () => {
            if (!confirm('리뷰를 삭제하시겠습니까?')) return;

            const { deleteReview } = await import('../../shared/reviews.js');
            const result = await deleteReview(gameSlug);

            if (result.success) {
              alert('리뷰가 삭제되었습니다.');
              loadReviews(); // 리뷰 목록 새로고침
            } else {
              alert(`리뷰 삭제 실패: ${result.error}`);
            }
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to load reviews:', err);
    container.innerHTML = '<p style="color: var(--danger);">리뷰를 불러올 수 없습니다.</p>';
  }
}

// 간단한 마크다운 파싱
function parseMarkdown(text) {
  return text
    .split('\n')
    .map(line => {
      // 제목 (# ## ###)
      if (line.startsWith('### ')) {
        return `<h3 style="font-size: var(--font-lg); font-weight: 900; margin: var(--space-4) 0 var(--space-2);">${line.substring(4)}</h3>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 style="font-size: var(--font-xl); font-weight: 900; margin: var(--space-5) 0 var(--space-3);">${line.substring(3)}</h2>`;
      }
      if (line.startsWith('# ')) {
        return `<h1 style="font-size: var(--font-2xl); font-weight: 900; margin: var(--space-6) 0 var(--space-4);">${line.substring(2)}</h1>`;
      }
      // 리스트 (- *)
      if (line.match(/^[\-\*]\s/)) {
        return `<li style="margin: var(--space-1) 0; padding-left: var(--space-2);">${line.substring(2)}</li>`;
      }
      // 강조 (**)
      if (line.includes('**')) {
        return `<p style="margin: var(--space-2) 0; line-height: 1.6;">${line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`;
      }
      // 빈 줄
      if (line.trim() === '') {
        return '<br>';
      }
      // 일반 텍스트
      return `<p style="margin: var(--space-2) 0; line-height: 1.6; color: var(--text);">${line}</p>`;
    })
    .join('')
    .replace(/<li/g, '<ul style="list-style: disc; padding-left: var(--space-5); margin: var(--space-2) 0;"><li')
    .replace(/<\/li>/g, '</li></ul>')
    .replace(/<\/ul>\s*<ul/g, '</ul><ul');
}

// 초기화 - DOMContentLoaded 이후에만 실행
function initGameDetail() {
  // currentLang 초기화 (DOMContentLoaded 이후)
  currentLang = getInitialLang();
  
  initCommonShell().then(() => {
    setTimeout(() => {
      renderStorePage();
    }, 100);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGameDetail);
} else {
  setTimeout(initGameDetail, 0);
}
