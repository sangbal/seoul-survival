import{e as L,k as y}from"./i18n-Bg2tVCd8.js";import{a as k,o as A,i as b,s as S,h as B}from"./authBoot-BV3fiOB2.js";const p="clicksurvivor_lang",f={ko:y,en:L},E=Object.keys(f);function h(e){const a=String(e||"").toLowerCase();return E.includes(a)?a:null}function W(){if(typeof window>"u")return null;const e=new URL(window.location.href);return h(e.searchParams.get("lang"))}function $(){if(typeof window>"u")return"ko";const e=W();if(e)return e;const a=h(localStorage.getItem(p));return a||(String(navigator.language||"").toLowerCase().startsWith("ko")?"ko":"en")}function w(){return $()}function g(e){if(typeof document>"u")return e;const a=h(e)||"ko";document.documentElement.lang=a;const t=f[a]||f.ko;if(document.querySelectorAll("[data-i18n]").forEach(n=>{const r=n.getAttribute("data-i18n");if(!r)return;const s=t[r];typeof s=="string"&&(n.textContent=s)}),document.querySelectorAll("[data-i18n-alt]").forEach(n=>{const r=n.getAttribute("data-i18n-alt");if(!r)return;const s=t[r];typeof s=="string"&&n.setAttribute("alt",s)}),typeof localStorage<"u"&&localStorage.setItem(p,a),typeof window<"u"&&typeof URL<"u"){const n=new URL(window.location.href);n.searchParams.get("lang")===a||(n.searchParams.delete("lang"),history.replaceState(null,"",n.toString()))}return a}function I(e){var a,t,n,r;return e?((a=e.user_metadata)==null?void 0:a.full_name)||((t=e.user_metadata)==null?void 0:t.name)||((n=e.user_metadata)==null?void 0:n.preferred_username)||e.email||((r=e.id)==null?void 0:r.slice(0,8)):null}function D(e,a={}){const{currentPath:t="/",lang:n=w(),onLangChange:r,onLogin:s,onLogout:l}=a;if(!e)return console.warn("Header mount element not found"),null;const c=`
    <header class="topbar" id="commonHeader">
      <div class="topbar-inner">
        <a class="brand" href="${v(t)}" aria-label="ClickSurvivor 홈으로">
          <div class="logo">
            <img src="${O(t)}" alt="ClickSurvivor" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px;" />
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
          <a class="drawer-nav-link" href="${v(t)}#about" data-i18n="hub.header.about">소개</a>
          <a class="drawer-nav-link" href="${v(t)}games/">게임 목록</a>
          <a class="drawer-nav-link" href="${v(t)}patch-notes/">패치노트</a>
          <a class="drawer-nav-link" href="${v(t)}account/" data-i18n="hub.header.account">계정</a>
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
            <a href="${v(t)}account/" class="drawer-btn" style="margin-top: 8px; text-align: center; text-decoration: none;" onclick="document.getElementById('drawer').classList.remove('open'); document.getElementById('drawerOverlay').classList.remove('show'); document.body.classList.remove('drawer-open');">⚙️ 계정 관리</a>
          </div>
        </div>
      </div>
    </aside>
  `;e.innerHTML=c,g(n);const o=document.getElementById("drawerLangSelect");return o&&(o.value=n,o.addEventListener("change",i=>{const d=i.target.value;g(d),r&&r(d)})),C(),setTimeout(async()=>{const i=await k();m(i,t,s,l);const d=A(u=>{m(u,t,s,l)});e._headerUnsubscribe&&e._headerUnsubscribe(),e._headerUnsubscribe=d},100),{unmount:()=>{e._headerUnsubscribe&&e._headerUnsubscribe()}}}function m(e,a,t,n){const r=document.getElementById("drawerAuthSection");if(!r)return;const s=e?"authed":"guest",l=document.getElementById("drawerAuthLoginBtn"),c=document.getElementById("drawerAuthLogoutBtn");l&&l.replaceWith(l.cloneNode(!0)),c&&c.replaceWith(c.cloneNode(!0));let o="";s==="loading"?o='<div style="color: var(--muted); font-size: 12px;">Checking session…</div>':s==="guest"?o=`
      <button class="drawer-btn" id="drawerAuthLoginBtn" data-i18n="hub.header.login">로그인</button>
    `:s==="authed"&&e?o=`
      <span class="drawer-userchip" id="drawerAuthUserLabel">${I(e)||"User"}</span>
      <button class="drawer-btn" id="drawerAuthLogoutBtn">Logout</button>
    `:s==="error"&&(o='<div style="color: var(--danger); font-size: 12px;">Auth error</div>'),r.innerHTML=o,g(w());const i=document.getElementById("drawerAuthLoginBtn");i&&i.addEventListener("click",async u=>{u.preventDefault(),t?t():await U()});const d=document.getElementById("drawerAuthLogoutBtn");d&&d.addEventListener("click",async u=>{u.preventDefault(),n?n():await x()})}async function U(){if(!b()){console.warn("Auth not enabled");return}const e=await S("google");e.ok||console.error("Login failed:",e.reason)}async function x(){if(!b()){console.warn("Auth not enabled");return}const e=await B();e.ok||console.error("Logout failed:",e.reason)}function C(){const e=document.getElementById("hamburgerBtn"),a=document.getElementById("drawer"),t=document.getElementById("drawerOverlay"),n=document.getElementById("drawerClose");if(document.querySelectorAll(".drawer-nav-link"),!e||!a||!t)return;function r(){a.classList.add("open"),t.classList.add("show"),e.classList.add("active"),e.setAttribute("aria-expanded","true"),a.setAttribute("aria-hidden","false"),t.setAttribute("aria-hidden","false"),document.body.classList.add("drawer-open");const o=a.querySelector('a, button, select, [tabindex]:not([tabindex="-1"])');o&&setTimeout(()=>o.focus(),100)}function s(){a.classList.remove("open"),t.classList.remove("show"),e.classList.remove("active"),e.setAttribute("aria-expanded","false"),a.setAttribute("aria-hidden","true"),t.setAttribute("aria-hidden","true"),document.body.classList.remove("drawer-open"),e.focus()}e.addEventListener("click",()=>{a.classList.contains("open")?s():r()}),n&&n.addEventListener("click",s),t&&t.addEventListener("click",s);function l(){document.querySelectorAll(".drawer-nav-link").forEach(i=>{const d=i.cloneNode(!0);i.parentNode.replaceChild(d,i),d.addEventListener("click",()=>{s()})})}l();const c=document.querySelector(".drawer-nav");c&&new MutationObserver(()=>{l()}).observe(c,{childList:!0,subtree:!0}),document.addEventListener("keydown",o=>{o.key==="Escape"&&a.classList.contains("open")&&s()})}function v(e){return e.startsWith("/account/")?"../":e.startsWith("/games/")?"../../":e.startsWith("/patch-notes/")||e.startsWith("/support/")?"../":"./"}function O(e){return e.startsWith("/account/")?"../seoulsurvival/assets/images/logo.png":e.startsWith("/games/")?"../../seoulsurvival/assets/images/logo.png":e.startsWith("/patch-notes/")||e.startsWith("/support/")?"../seoulsurvival/assets/images/logo.png":"seoulsurvival/assets/images/logo.png"}function F(e,a={}){const{currentPath:t="/",hubVersion:n="1.2.0"}=a;if(!e)return console.warn("Footer mount element not found"),null;const r=_(t),s=`
    <footer id="footer" aria-label="Footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="${H(t)}" alt="ClickSurvivor" />
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
              <a href="${r}games/">게임 목록</a>
              <a href="${r}seoulsurvival/" data-i18n="hub.footer.game.play">Seoul Survival 플레이</a>
              <a href="${r}#about" data-i18n="hub.footer.game.about">게임 소개</a>
            </div>
          </div>

          <div class="footer-section">
            <div class="footer-section-title" data-i18n="hub.footer.support.title">지원</div>
            <div class="footer-links">
              <a href="${r}patch-notes/">패치노트</a>
              <a href="${r}account/" data-i18n="hub.footer.support.account">계정 관리</a>
              <a href="${r}support/" data-i18n="hub.footer.contact">문의하기 / FAQ</a>
            </div>
          </div>

          <div class="footer-section">
            <div class="footer-section-title" data-i18n="hub.footer.legal.title">법적 고지</div>
            <div class="footer-links">
              <a href="${r}terms.html" data-i18n="hub.footer.terms">이용약관</a>
              <a href="${r}privacy.html" data-i18n="hub.footer.privacy">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-meta">
          <span class="version">v<span id="version">${n}</span></span>
        </div>
      </div>
    </footer>
  `;return e.innerHTML=s,{unmount:()=>{}}}function _(e){return e.startsWith("/account/")?"../":e.startsWith("/games/")?"../../":e.startsWith("/patch-notes/")||e.startsWith("/support/")?"../":"./"}function H(e){return e.startsWith("/account/")?"../seoulsurvival/assets/images/logo.png":e.startsWith("/games/")?"../../seoulsurvival/assets/images/logo.png":e.startsWith("/patch-notes/")||e.startsWith("/support/")?"../seoulsurvival/assets/images/logo.png":"seoulsurvival/assets/images/logo.png"}export{F as a,D as r};
