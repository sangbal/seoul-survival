import"./modulepreload-polyfill-B5Qt9EMX.js";import{d as M}from"./games.registry-uDtpbbZ4.js";import{g as $,a as f}from"./i18n-Bg2tVCd8.js";import{r as T,a as w}from"./footer-DQtZeuej.js";import"./authBoot-BV3fiOB2.js";import"https://esm.sh/@supabase/supabase-js@2.49.1";const p=o=>document.querySelector(o);let s=$();const t=M("seoulsurvival");function y(o){console.log("[Toast]",o)}async function L(){const o=window.location.pathname,c=$(),n=p("#commonHeaderMount");n&&T(n,{currentPath:o,lang:c,onLangChange:r=>{s=r,f(r),k(),y(r==="ko"?"언어: 한국어":"Language: English")}});const i=p("#commonFooterMount");i&&w(i,{currentPath:o,hubVersion:"1.2.0"}),f(c)}async function S(){const o=window.location.href,c=t?t.title[s]||t.title.ko:"Capital Clicker: SeoulSurvivor",n=t?t.tagline[s]||t.tagline.ko:"";if(navigator.share)try{await navigator.share({title:c,text:n,url:o})}catch(i){i.name!=="AbortError"&&console.error("Share failed:",i)}else try{await navigator.clipboard.writeText(o),y("URL이 클립보드에 복사되었습니다")}catch(i){console.error("Copy failed:",i),prompt("URL을 복사하세요:",o)}}function k(){if(!t){console.error("Game not found: seoulsurvival");return}const o=p("#storeMain");if(o){const n=t.title[s]||t.title.ko;t.tagline[s]||t.tagline.ko;const i=t.about[s]||t.about.ko,r=t.keyFeatures[s]||t.keyFeatures.ko,d=t.support[s]||t.support.ko,h=t.screenshots||[];let a="";t.heroMedia&&t.heroMedia.src&&(a=`
        <div class="hero-media">
          <img
            src="../../${t.heroMedia.src}"
            alt="${n}"
            loading="eager"
          />
        </div>
      `);let l="";h.length>0&&(l=`
        <div class="content-section">
          <h2 class="section-title">스크린샷</h2>
          <div class="screenshots-gallery">
            ${h.map(e=>{const b=typeof e.alt=="object"?e.alt[s]||e.alt.ko:e.alt;return`
                <div class="screenshot-item">
                  <img
                    src="../../${e.src}"
                    alt="${b}"
                    loading="lazy"
                  />
                </div>
              `}).join("")}
          </div>
        </div>
      `);const g=`
      <div class="content-section">
        <h2 class="section-title">게임 소개</h2>
        <div class="section-content">
          ${i.map(e=>`<p>${e}</p>`).join("")}
        </div>
      </div>
    `,v=`
      <div class="content-section">
        <h2 class="section-title">주요 기능</h2>
        <div class="section-content">
          <ul>
            ${r.map(e=>`<li><strong>${e}</strong></li>`).join("")}
          </ul>
        </div>
      </div>
    `,u=`
      <div class="content-section">
        <h2 class="section-title">지원 환경</h2>
        <div class="section-content">
          <ul class="support-list">
            ${d.map(e=>`<li>${e}</li>`).join("")}
          </ul>
          <p style="margin-top: var(--space-4);">
            <a href="../../support/" style="color: var(--accent); text-decoration: underline; font-weight: 900;">더 많은 도움이 필요하신가요? 지원 센터로 이동 →</a>
          </p>
        </div>
      </div>
    `;let m="";if(t.patchNotePreview){const e=t.patchNotePreview[s]||t.patchNotePreview.ko;e&&(m=`
          <div class="content-section">
            <h2 class="section-title">최신 업데이트</h2>
            <div class="patch-preview">
              <div class="patch-preview-header">
                <span class="patch-preview-version">v1.2.0</span>
                <span class="patch-preview-date">${t.lastUpdated}</span>
              </div>
              <h3 class="patch-preview-title">${e.title}</h3>
              <p class="patch-preview-body">${e.body}</p>
              <a href="../../${e.link||"/patch-notes/"}" class="patch-preview-link">전체 패치노트 보기 →</a>
            </div>
          </div>
        `)}o.innerHTML=`
      ${a}
      ${l}
      ${g}
      ${v}
      ${m}
      ${u}
    `}const c=p("#storeSidebar");if(c){let h=function(a){const l=p("#ctaSection");if(!l)return;const v=a.status==="authed"&&a.user?'<p style="font-size: 12px; color: var(--muted); margin-top: 8px; line-height: 1.4;">✅ 클라우드 저장 활성화됨</p>':'<p style="font-size: 12px; color: var(--muted); margin-top: 8px; line-height: 1.4;">💡 <a href="../../account/" style="color: var(--accent); text-decoration: underline;">로그인</a>하면 클라우드 저장 가능</p>';l.innerHTML=`
        <a href="../../${t.playPath}" class="cta-primary">지금 플레이하기</a>
        ${v}
        <a href="../../account/" class="cta-secondary" style="margin-top: 8px;">⚙️ 계정 관리</a>
        <button class="cta-secondary" id="shareBtn" style="margin-top: 8px;">🔗 공유하기</button>
      `;const u=p("#shareBtn");u&&u.addEventListener("click",S)};const n=t.title[s]||t.title.ko,i=t.tagline[s]||t.tagline.ko,r=t.tags||[];let d={status:"loading",user:null};subscribeAuth(a=>{d=a,h(d)}),c.innerHTML=`
      <div class="sidebar-card">
        <h1 class="game-title-main">${n}</h1>
        <p class="game-tagline">${i}</p>
        <div class="game-tags">
          ${r.map(a=>`<span class="game-tag">${typeof a=="object"?a[s]||a.ko:a}</span>`).join("")}
        </div>
        <div id="ctaSection">
          <!-- CTA는 Auth 상태에 따라 동적 업데이트 -->
        </div>
      </div>
      <div class="sidebar-card">
        <h3 class="section-title" style="font-size: var(--font-md); margin-bottom: var(--space-3);">지원 환경 요약</h3>
        <ul class="support-list">
          ${(t.support[s]||t.support.ko).slice(0,3).map(a=>`<li>${a}</li>`).join("")}
        </ul>
      </div>
    `,setTimeout(()=>{h(d)},100)}}L().then(()=>{setTimeout(()=>{k()},100)});
