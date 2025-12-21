import"./modulepreload-polyfill-B5Qt9EMX.js";import{e as f}from"./games.registry-bQ2oXXn0.js";import{g as k}from"./i18n-4kQg4La1.js";const h=i=>document.querySelector(i),e=k(),t=f("seoulsurvival");if(!t)console.error("Game not found: seoulsurvival");else{const i=h("#storeMain");if(i){const o=t.title[e]||t.title.ko;t.tagline[e]||t.tagline.ko;const c=t.about[e]||t.about.ko,n=t.keyFeatures[e]||t.keyFeatures.ko,a=t.support[e]||t.support.ko,l=t.screenshots||[];let p="";t.heroMedia&&t.heroMedia.src&&(p=`
        <div class="hero-media">
          <img
            src="../../${t.heroMedia.src}"
            alt="${o}"
            loading="eager"
          />
        </div>
      `);let d="";l.length>0&&(d=`
        <div class="content-section">
          <h2 class="section-title">스크린샷</h2>
          <div class="screenshots-gallery">
            ${l.map(s=>{const $=typeof s.alt=="object"?s.alt[e]||s.alt.ko:s.alt;return`
                <div class="screenshot-item">
                  <img
                    src="../../${s.src}"
                    alt="${$}"
                    loading="lazy"
                  />
                </div>
              `}).join("")}
          </div>
        </div>
      `);const u=`
      <div class="content-section">
        <h2 class="section-title">게임 소개</h2>
        <div class="section-content">
          ${c.map(s=>`<p>${s}</p>`).join("")}
        </div>
      </div>
    `,g=`
      <div class="content-section">
        <h2 class="section-title">주요 기능</h2>
        <div class="section-content">
          <ul>
            ${n.map(s=>`<li><strong>${s}</strong></li>`).join("")}
          </ul>
        </div>
      </div>
    `,m=`
      <div class="content-section">
        <h2 class="section-title">지원 환경</h2>
        <div class="section-content">
          <ul class="support-list">
            ${a.map(s=>`<li>${s}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;let v="";if(t.patchNotePreview){const s=t.patchNotePreview[e]||t.patchNotePreview.ko;s&&(v=`
          <div class="content-section">
            <h2 class="section-title">최신 업데이트</h2>
            <div class="patch-preview">
              <div class="patch-preview-header">
                <span class="patch-preview-version">v1.2.0</span>
                <span class="patch-preview-date">${t.lastUpdated}</span>
              </div>
              <h3 class="patch-preview-title">${s.title}</h3>
              <p class="patch-preview-body">${s.body}</p>
              <a href="../../${s.link||"/patch-notes/"}" class="patch-preview-link">전체 패치노트 보기 →</a>
            </div>
          </div>
        `)}i.innerHTML=`
      ${p}
      ${d}
      ${u}
      ${g}
      ${v}
      ${m}
    `}const r=h("#storeSidebar");if(r){const o=t.title[e]||t.title.ko,c=t.tagline[e]||t.tagline.ko,n=t.tags||[];r.innerHTML=`
      <div class="sidebar-card">
        <h1 class="game-title-main">${o}</h1>
        <p class="game-tagline">${c}</p>
        <div class="game-tags">
          ${n.map(a=>`<span class="game-tag">${typeof a=="object"?a[e]||a.ko:a}</span>`).join("")}
        </div>
        <a href="../../${t.playPath}" class="cta-primary">지금 플레이하기</a>
        <a href="../../games/" class="cta-secondary">← 게임 목록</a>
      </div>
      <div class="sidebar-card">
        <h3 class="section-title" style="font-size: var(--font-md); margin-bottom: var(--space-3);">지원 환경 요약</h3>
        <ul class="support-list">
          ${(t.support[e]||t.support.ko).slice(0,3).map(a=>`<li>${a}</li>`).join("")}
        </ul>
      </div>
    `}}
