import"./modulepreload-polyfill-B5Qt9EMX.js";import"./main-Cgk76AEx.js";import{g as o,a as c,b as d}from"./games.registry-bQ2oXXn0.js";import{g as p}from"./i18n-4kQg4La1.js";import"./authBoot-DsIaacwO.js";import"https://esm.sh/@supabase/supabase-js@2.49.1";{const a=document.querySelector(".footer-dev-info");a&&a.remove()}const n=a=>document.querySelector(a),l=p();function m(){const a=n("#featuredHero");if(!a)return;const e=o();if(!e){a.innerHTML=`
      <div class="hero-inner">
        <div class="badge"><span class="dot"></span><span data-i18n="hub.hero.badge">FEATURED</span></div>
        <div>
          <h1 class="hero-title">ClickSurvivor</h1>
          <p class="hero-sub">
            ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다.
          </p>
        </div>
      </div>
    `;return}const t=e.title[l]||e.title.ko,s=e.tagline[l]||e.tagline.ko;a.innerHTML=`
    <div class="hero-inner">
      <div class="badge"><span class="dot"></span><span data-i18n="hub.hero.badge">FEATURED</span></div>
      <div>
        <h1 class="hero-title">${t}</h1>
        <p class="hero-sub">${s}</p>
        <div class="ctaRow">
          <a class="btn primary" href="${e.playPath}" data-i18n="hub.hero.cta.play">플레이</a>
          <a class="btn" href="${e.storePath}" data-i18n="hub.hero.cta.details">자세히</a>
        </div>
      </div>
    </div>
  `}function r(a){const e=a.title[l]||a.title.ko,t=a.tagline[l]||a.tagline.ko,s=a.status==="playable",i=a.status==="comingSoon";return`
    <a href="${a.storePath}" class="game-card-small">
      <img
        src="${a.coverImage}"
        alt="${e}"
        class="game-card-small-cover"
        loading="lazy"
      />
      <div class="game-card-small-body">
        <h3 class="game-card-small-title">${e}</h3>
        <p class="game-card-small-tagline">${t}</p>
        <div class="game-card-small-footer">
          <span class="game-card-small-status ${s?"playable":""}">
            ${s?"플레이 가능":i?"준비 중":""}
          </span>
          ${s?'<span class="game-card-small-cta">플레이</span>':""}
        </div>
      </div>
    </a>
  `}function u(){const a=n("#allGamesRow");if(!a)return;const e=c().slice(0,6);if(e.length===0){a.style.display="none";const t=n("#allGames");t&&(t.style.display="none");return}a.innerHTML=e.map(r).join("")}function g(){const a=n("#recentlyUpdatedRow");if(!a)return;const e=d(3);if(e.length===0){a.style.display="none";const t=n("#recentlyUpdated");t&&(t.style.display="none");return}a.innerHTML=e.map(r).join("")}m();u();g();
