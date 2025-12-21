import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as b,a as v,d as $,g as p}from"./games.registry-bQ2oXXn0.js";import{g as L,a as S}from"./i18n-4kQg4La1.js";const o=e=>document.querySelector(e),g=e=>document.querySelectorAll(e);let l=L(),c="all",d="";S(l);function k(){const e=o("#featuredHero");if(!e)return;const t=p();if(!t){e.style.display="none";return}const a=t.title[l]||t.title.ko,r=t.tagline[l]||t.tagline.ko;if(t.heroMedia&&t.heroMedia.src){e.style.setProperty("--hero-bg",`url('../${t.heroMedia.src}')`);const s=e.querySelector("style")||document.createElement("style");e.querySelector("style")||e.appendChild(s),s.textContent=`
      .featured-hero::before {
        background-image: linear-gradient(180deg, rgba(7,11,20,.05), rgba(7,11,20,.85) 80%), url('../${t.heroMedia.src}');
      }
    `}e.innerHTML=`
    <div class="featured-hero-inner">
      <div class="featured-badge"><span class="dot"></span><span>FEATURED</span></div>
      <h1 class="featured-title">${a}</h1>
      <p class="featured-tagline">${r}</p>
      <div class="featured-cta">
        <a href="${t.storePath}" class="btn">자세히 보기</a>
        <a href="${t.playPath}" class="btn primary">지금 플레이</a>
      </div>
    </div>
  `}function C(e){const t=e.title[l]||e.title.ko,a=e.tagline[l]||e.tagline.ko,r=e.status==="playable",s=e.status==="comingSoon";return`
    <a href="${e.storePath}" class="game-card">
      <img
        src="../${e.coverImage}"
        alt="${t}"
        class="game-card-cover"
        loading="lazy"
      />
      <div class="game-card-body">
        <h3 class="game-card-title">${t}</h3>
        <p class="game-card-tagline">${a}</p>
        <div class="game-card-footer">
          <span class="game-card-status ${r?"playable":""}">
            ${r?"플레이 가능":s?"준비 중":""}
          </span>
          ${r?'<span class="game-card-cta">자세히</span>':""}
        </div>
      </div>
    </a>
  `}function u(){const e=o("#gamesGrid"),t=o("#emptyState");if(!e)return;let a=b();if(c==="playable"?a=v():c==="comingSoon"&&(a=$()),d.trim()){const s=d.toLowerCase();a=a.filter(n=>{const y=(n.title[l]||n.title.ko).toLowerCase(),m=(n.tagline[l]||n.tagline.ko).toLowerCase(),h=(n.tags||[]).map(i=>typeof i=="string"?i.toLowerCase():(i[l]||i.ko||"").toLowerCase()).join(" ");return y.includes(s)||m.includes(s)||h.includes(s)})}const r=p();r&&(a=a.filter(s=>s.slug!==r.slug)),a.length===0?(e.style.display="none",t.style.display="block"):(e.style.display="grid",t.style.display="none",e.innerHTML=a.map(C).join(""))}const f=o("#searchInput");f&&f.addEventListener("input",e=>{d=e.target.value,u()});g(".browse-tab").forEach(e=>{e.addEventListener("click",()=>{g(".browse-tab").forEach(t=>t.classList.remove("active")),e.classList.add("active"),c=e.dataset.filter||"all",u()})});k();u();
