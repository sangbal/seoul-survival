import"./modulepreload-polyfill-B5Qt9EMX.js";import{g as L,a as C,b as S,c as m}from"./games.registry-uDtpbbZ4.js";import{g as h,a as g}from"./i18n-Bg2tVCd8.js";import{r as k,a as M}from"./footer-DQtZeuej.js";import"./authBoot-BV3fiOB2.js";import"https://esm.sh/@supabase/supabase-js@2.49.1";const i=e=>document.querySelector(e),f=e=>document.querySelectorAll(e);let n=h(),d="all",u="";function P(e){console.log("[Toast]",e)}async function w(){const e=window.location.pathname,t=h(),a=i("#commonHeaderMount");a&&k(a,{currentPath:e,lang:t,onLangChange:r=>{n=r,g(r),y(),c(),P(r==="ko"?"언어: 한국어":"Language: English")}});const s=i("#commonFooterMount");s&&M(s,{currentPath:e,hubVersion:"1.2.0"}),g(t)}w();function y(){const e=i("#featuredHero");if(!e)return;const t=m();if(!t){e.style.display="none";return}const a=t.title[n]||t.title.ko,s=t.tagline[n]||t.tagline.ko;if(t.heroMedia&&t.heroMedia.src){const r=t.heroMedia.src.startsWith("/")?t.heroMedia.src:`../${t.heroMedia.src}`;e.style.setProperty("--hero-bg",`url('${r}')`);const o=e.querySelector("style")||document.createElement("style");e.querySelector("style")||e.appendChild(o),o.textContent=`
      .featured-hero::before {
        background-image: linear-gradient(180deg, rgba(7,11,20,.05), rgba(7,11,20,.85) 80%), url('${r}');
      }
    `}e.innerHTML=`
    <div class="featured-hero-inner">
      <div class="featured-badge"><span class="dot"></span><span>FEATURED</span></div>
      <h1 class="featured-title">${a}</h1>
      <p class="featured-tagline">${s}</p>
      <div class="featured-cta">
        <a href="${t.storePath}" class="btn">자세히 보기</a>
        <a href="${t.playPath}" class="btn primary">지금 플레이</a>
      </div>
    </div>
  `}function E(e){const t=e.title[n]||e.title.ko,a=e.tagline[n]||e.tagline.ko,s=e.status==="playable",r=e.status==="comingSoon",o=e.coverImage.startsWith("/")?e.coverImage:`../${e.coverImage}`;return`
    <a href="${e.storePath}" class="game-card">
      <img
        src="${o}"
        alt="${t}"
        class="game-card-cover"
        loading="lazy"
      />
      <div class="game-card-body">
        <h3 class="game-card-title">${t}</h3>
        <p class="game-card-tagline">${a}</p>
        <div class="game-card-footer">
          <span class="game-card-status ${s?"playable":""}">
            ${s?"플레이 가능":r?"준비 중":""}
          </span>
          ${s?'<span class="game-card-cta">자세히</span>':""}
        </div>
      </div>
    </a>
  `}function c(){const e=i("#gamesGrid"),t=i("#emptyState");if(!e)return;let a=L();if(d==="playable"?a=C():d==="comingSoon"&&(a=S()),u.trim()){const r=u.toLowerCase();a=a.filter(o=>{const b=(o.title[n]||o.title.ko).toLowerCase(),v=(o.tagline[n]||o.tagline.ko).toLowerCase(),$=(o.tags||[]).map(l=>typeof l=="string"?l.toLowerCase():(l[n]||l.ko||"").toLowerCase()).join(" ");return b.includes(r)||v.includes(r)||$.includes(r)})}const s=m();s&&(a=a.filter(r=>r.slug!==s.slug)),a.length===0?(e.style.display="none",t.style.display="block"):(e.style.display="grid",t.style.display="none",e.innerHTML=a.map(E).join(""))}const p=i("#searchInput");p&&p.addEventListener("input",e=>{u=e.target.value,c()});f(".browse-tab").forEach(e=>{e.addEventListener("click",()=>{f(".browse-tab").forEach(t=>t.classList.remove("active")),e.classList.add("active"),d=e.dataset.filter||"all",c()})});setTimeout(()=>{y(),c()},100);
