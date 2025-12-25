const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./ui-DNXjQp4A.js","./preload-helper-WPMeT1xN.js","./preload-helper-DFlHEO2w.css","./core-DFjEd1v7.js","./supabaseClient-BZSWgoCJ.js"])))=>i.map(i=>d[i]);
import{_ as A}from"./preload-helper-WPMeT1xN.js";function B(a){if(!a)return;const f=typeof window<"u"?window.location.pathname:"";let i="/",s="./seoulsurvival/assets/images/logo.png",o="./account/";f.includes("/seoulsurvival/")?(i="/",s="./assets/images/logo.png",o="/account/"):f.includes("/account/")?(i="/",s="../seoulsurvival/assets/images/logo.png",o="./"):f.includes("/auth/callback/")&&(i="/",s="../../seoulsurvival/assets/images/logo.png",o="/account/"),a.innerHTML=`
    <header>
      <div class="header-brand" aria-label="ClickSurvivor Hub">
        <a href="${i}" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px;">
          <img class="brand-icon" src="${s}" alt="" aria-hidden="true" />
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
              <a href="${o}" class="account-menu-item">
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
  `;const m=a.querySelector("#headerAccountMenu");let t=a.querySelector("#headerAccountDropdown"),n=a.querySelector("#headerAccountOverlay");const w=a.querySelector("#headerAccountBtn");a.querySelector("#headerAccountNicknameMobile");function h(){if(window.innerWidth<=768){if(t&&t.parentElement===document.body)return;t&&t.parentElement!==document.body&&document.body.appendChild(t),n&&n.parentElement!==document.body&&document.body.appendChild(n)}else t&&t.parentElement===document.body&&m&&m.appendChild(t),n&&n.parentElement===document.body&&m&&m.appendChild(n)}h(),window.addEventListener("resize",()=>{h()}),t&&(t.style.display="none"),n&&(n.style.display="none");function v(){return window.innerWidth<=768}function M(){h(),t&&(t.style.display="block",t.style.position="fixed",t.style.bottom="0",t.style.left="0",t.style.right="0",t.style.top="auto",t.style.zIndex="10000",t.style.margin="0",t.style.transform="translateY(100%)",requestAnimationFrame(()=>{requestAnimationFrame(()=>{t&&t.classList.add("show")})})),n&&(n.style.display="block",n.style.zIndex="9999",n.style.position="fixed",n.style.top="0",n.style.left="0",n.style.right="0",n.style.bottom="0"),document.body.style.overflow="hidden"}function e(){t&&(t.classList.remove("show"),t.style.transform="translateY(100%)",setTimeout(()=>{t&&(t.style.display="none")},300)),n&&(n.style.display="none"),document.body.style.overflow=""}m&&t&&(w&&w.addEventListener("click",r=>{r.stopPropagation(),v()?t.style.display==="block"?e():M():t.style.display==="block"?t.style.display="none":t.style.display="block"}),n&&n.addEventListener("click",()=>{v()&&e()}),t.querySelectorAll(".account-menu-item").forEach(r=>{r.addEventListener("click",()=>{v()&&setTimeout(()=>e(),100)})}),window.addEventListener("resize",()=>{!v()&&t.style.display==="block"&&e()}));const l=a.querySelector("#headerShareBtn");l&&l.addEventListener("click",async()=>{const y=window.location.href,r=document.title||"ClickSurvivor Hub",p="게임 허브 - 여러 게임을 한 곳에서 플레이하세요";if(!navigator.share){alert("이 기기/브라우저에서는 공유하기를 지원하지 않습니다.");return}try{await navigator.share({title:r,text:p,url:y})}catch(c){(c==null?void 0:c.name)!=="AbortError"&&console.error("공유 실패:",c)}});const b=a.querySelector("#headerFavoriteBtn");b&&b.addEventListener("click",()=>{const y=window.location.href,r=document.title||"ClickSurvivor Hub",p=navigator.userAgent.toLowerCase(),c=/iphone|ipad|ipod|android/.test(p),C=/iphone|ipad|ipod/.test(p),k=/android/.test(p),L=navigator.platform.toUpperCase().includes("MAC");if(window.external&&typeof window.external.AddFavorite=="function")try{window.external.AddFavorite(y,r);return}catch{}let d="",u="즐겨찾기 / 홈 화면에 추가",g="⭐";c?C?d=`iPhone/iPad에서는 Safari 하단의 공유 버튼(□↑)을 누른 뒤
"홈 화면에 추가"를 선택하면 바탕화면에 아이콘이 만들어집니다.`:k?d=`Android에서는 브라우저 오른쪽 위 메뉴(⋮)에서
"홈 화면에 추가" 또는 "앱 설치"를 선택하면 바탕화면에 아이콘이 만들어집니다.`:d='이 기기에서는 브라우저의 메뉴에서 "홈 화면에 추가" 기능을 사용해 주세요.':d=`${L?"⌘ + D":"Ctrl + D"} 를 눌러 이 페이지를 브라우저 즐겨찾기에 추가할 수 있습니다.`,alert(`${g} ${u}

${d}`)})}typeof document<"u"&&document.addEventListener("DOMContentLoaded",async()=>{const a=document.getElementById("header-mount");if(a){B(a);try{const{initAuthUI:f}=await A(async()=>{const{initAuthUI:e}=await import("./ui-DNXjQp4A.js");return{initAuthUI:e}},__vite__mapDeps([0,1,2]),import.meta.url),{getUser:i,onAuthStateChange:s}=await A(async()=>{const{getUser:e,onAuthStateChange:l}=await import("./core-DFjEd1v7.js");return{getUser:e,onAuthStateChange:l}},__vite__mapDeps([3,1,2,4]),import.meta.url),o=document.getElementById("headerLoginBtn"),m=document.getElementById("headerLogoutBtn"),t=document.getElementById("headerAccountMenu"),n=document.getElementById("headerAccountNicknameMobile");if(!o&&!m)return;o&&(o.style.display="block"),t&&t.style.setProperty("display","none","important");async function w(e){var l,b,y,r,p,c,C,k,L;if(n){if(!e){n.textContent="Guest";return}try{const{getUserProfile:d}=await A(async()=>{const{getUserProfile:g}=await import("./core-DFjEd1v7.js");return{getUserProfile:g}},__vite__mapDeps([3,1,2,4]),import.meta.url),u=await d("seoulsurvival");if(u.success&&((l=u.user)!=null&&l.nickname))n.textContent=u.user.nickname,console.log("[Header] Nickname updated:",u.user.nickname);else{const g=((b=e==null?void 0:e.user_metadata)==null?void 0:b.full_name)||((y=e==null?void 0:e.user_metadata)==null?void 0:y.name)||((r=e==null?void 0:e.user_metadata)==null?void 0:r.preferred_username)||((p=e==null?void 0:e.email)==null?void 0:p.split("@")[0])||"Guest";n.textContent=g,console.log("[Header] Using fallback nickname:",g)}}catch(d){console.warn("[Header] Failed to get nickname:",d);const u=((c=e==null?void 0:e.user_metadata)==null?void 0:c.full_name)||((C=e==null?void 0:e.user_metadata)==null?void 0:C.name)||((k=e==null?void 0:e.user_metadata)==null?void 0:k.preferred_username)||((L=e==null?void 0:e.email)==null?void 0:L.split("@")[0])||"Guest";n.textContent=u,console.log("[Header] Using fallback nickname (error):",u)}}}async function h(e){const l=!!e;o&&(o.style.display=l?"none":"block"),t&&(l?t.style.setProperty("display","block","important"):t.style.setProperty("display","none","important")),await w(e)}const v=await i();await h(v);const M=await f({scope:"hub",providerButtons:[],defaultProvider:"google",loginBtn:o,logoutBtn:m,userLabel:null,statusLabel:null,toast:e=>console.log("[Header]",e)});setTimeout(async()=>{const e=await i();await h(e)},100),s(async e=>{await h(e)})}catch(f){console.warn("[Header] Auth init failed, using guest mode:",f);const i=document.getElementById("headerLoginBtn"),s=document.getElementById("headerAccountMenu");i&&(i.style.display="block"),s&&s.style.setProperty("display","none","important")}}});function _(a){a&&(a.innerHTML=`
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-links">
          <a href="./terms.html">Terms</a>
          <a href="./privacy.html">Privacy</a>
        </div>
        <div class="footer-social">
          <a href="https://x.com/ClickSurvivor" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/clicksurvivor/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://www.threads.com/@clicksurvivor" target="_blank" rel="noopener noreferrer" aria-label="Threads">
            <svg width="20" height="20" viewBox="0 0 192 192" fill="currentColor" aria-hidden="true">
              <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
            </svg>
          </a>
        </div>
        <div class="footer-copyright">
          © ClickSurvivor
        </div>
      </div>
    </footer>
  `)}typeof document<"u"&&document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("footer-mount");a&&_(a)});export{_ as a,B as r};
