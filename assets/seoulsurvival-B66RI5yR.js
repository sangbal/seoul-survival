import{i as ho,g as bt,a as Ye,o as js,b as Tn,s as po}from"./authBoot-BnOC8kKe.js";import"https://esm.sh/@supabase/supabase-js@2.49.1";function Ws(L,u){try{return localStorage.setItem(L,JSON.stringify(u)),!0}catch{return!1}}function zs(L,u=null){try{const V=localStorage.getItem(L);return V?JSON.parse(V):u}catch{return u}}const bo="game_saves";function vo(L){return L?{message:(L==null?void 0:L.message)||String(L),code:L==null?void 0:L.code,details:L==null?void 0:L.details,hint:L==null?void 0:L.hint}:null}function Co(L){const u=String((L==null?void 0:L.message)||"").toLowerCase();return u.includes("does not exist")||u.includes("relation")||u.includes("42p01")}async function yo(L){if(!ho())return{ok:!1,reason:"not_configured"};const u=bt();if(!u)return{ok:!1,reason:"not_configured"};const V=await Ye();if(!V)return{ok:!1,reason:"not_signed_in"};const{data:T,error:B}=await u.from(bo).select("save, save_ts, updated_at").eq("user_id",V.id).eq("game_slug",L).maybeSingle();return B?{ok:!1,reason:Co(B)?"missing_table":"query_failed",error:vo(B)}:T?{ok:!0,found:!0,save:T.save,save_ts:T.save_ts,updated_at:T.updated_at}:{ok:!0,found:!1}}async function $o(L,u){if(!ho())return{ok:!1,reason:"not_configured"};const V=bt();if(!V)return{ok:!1,reason:"not_configured"};const T=await Ye();if(!T)return{ok:!1,reason:"not_signed_in"};const B=Number((u==null?void 0:u.ts)||Date.now())||Date.now(),q={user_id:T.id,game_slug:L,save:u,save_ts:B};(u==null?void 0:u.nickname)!==void 0?console.log("☁️ 클라우드 저장: 닉네임 포함됨:",u.nickname||"(빈 문자열)"):console.warn("⚠️ 클라우드 저장: 닉네임 필드가 없음");const{error:W}=await V.from(bo).upsert(q,{onConflict:"user_id,game_slug"});return W?{ok:!1,reason:Co(W)?"missing_table":"upsert_failed",error:vo(W)}:{ok:!0}}const un="seoulsurvival";function Rn(L){return(L||"").trim()}async function Ys(L){const u=bt();if(!u)return console.warn("Leaderboard: Supabase client not configured for nickname check"),{taken:!1,reason:"not_configured"};const T=Rn(L).toLowerCase();if(!T)return{taken:!1,reason:"empty"};try{const{data:B,error:q}=await u.from("leaderboard").select("nickname").eq("game_slug",un).ilike("nickname",T).limit(1);return q?(console.error("Nickname check error:",q),{taken:!1,reason:"error"}):{taken:!!(B&&B.length>0)}}catch(B){return console.error("Nickname check exception:",B),{taken:!1,reason:"exception"}}}async function Mn(L,u,V,T=0){try{const B=await Ye();if(!B)return console.log("Leaderboard: User not logged in, skipping update"),{success:!1,error:"Not logged in"};const q=bt(),{data:W,error:ue}=await q.from("leaderboard").upsert({user_id:B.id,game_slug:un,nickname:L||"익명",total_assets:u,play_time_ms:V,tower_count:T,updated_at:new Date().toISOString()},{onConflict:"user_id,game_slug"}).select().single();return ue?(console.error("Leaderboard update error:",ue),{success:!1,error:ue.message}):(console.log("Leaderboard updated:",W),{success:!0,data:W})}catch(B){return console.error("Leaderboard update exception:",B),{success:!1,error:B.message}}}async function Js(L=10,u="assets"){var V,T,B,q,W,ue;try{const ce=bt();if(!ce)return console.error("Leaderboard: Supabase client not configured"),console.warn("[LB] fetch failed",{reason:"not_configured",phase:"init"}),{success:!1,error:"Supabase가 설정되지 않았습니다. shared/auth/config.js를 확인해주세요.",data:[],errorType:"config"};let te=ce.from("leaderboard").select("nickname, total_assets, play_time_ms, tower_count, updated_at").eq("game_slug",un).limit(L);u==="assets"?te=te.order("tower_count",{ascending:!1}).order("total_assets",{ascending:!1}):u==="playtime"&&(te=te.order("play_time_ms",{ascending:!1}));const{data:mn,error:ne}=await te;if(ne){console.error("Leaderboard fetch error:",ne);const Je=ne.status??ne.code??null,st=ne.code==="PGRST116"||((V=ne.message)==null?void 0:V.includes("relation"))||((T=ne.message)==null?void 0:T.includes("does not exist")),z=Je===401||Je===403||((q=(B=ne.message)==null?void 0:B.toLowerCase)==null?void 0:q.call(B).includes("permission denied"))||((ue=(W=ne.message)==null?void 0:W.toLowerCase)==null?void 0:ue.call(W).includes("rls"));return console.warn("[LB] fetch failed",{phase:"select",status:Je,code:ne.code,message:ne.message,details:ne.details,hint:ne.hint}),st?{success:!1,error:"리더보드 테이블이 없습니다. Supabase SQL Editor에서 supabase/leaderboard.sql을 실행해주세요.",data:[],errorType:"schema",status:Je}:z?{success:!1,error:"권한이 없어 리더보드를 불러올 수 없습니다.",data:[],errorType:"forbidden",status:Je}:{success:!1,error:ne.message,data:[],errorType:"generic",status:Je}}return{success:!0,data:mn||[]}}catch(ce){return console.error("Leaderboard fetch exception:",ce),console.warn("[LB] fetch failed",{phase:"exception",message:ce==null?void 0:ce.message,error:ce}),{success:!1,error:ce.message||"알 수 없는 오류",data:[],errorType:"network"}}}async function ko(L,u="assets"){const V=bt();if(!V)return console.warn("[LB] my_rank failed",{reason:"not_configured"}),{success:!1,data:null,errorType:"config"};const B=Rn(L).toLowerCase();if(!B)return{success:!1,data:null,errorType:"no_nickname"};try{const{data:q,error:W,status:ue}=await V.rpc("get_my_rank",{p_game_slug:un,p_nickname:B,p_sort_by:u});if(W){console.error("My rank RPC error:",W),console.warn("[LB] my_rank failed",{phase:"rpc",status:ue??W.status,code:W.code,message:W.message,details:W.details,hint:W.hint});const te=ue===401||ue===403?"forbidden":"generic";return{success:!1,data:null,error:W.message,errorType:te,status:ue??W.status}}const ce=Array.isArray(q)?q[0]:q;return ce?{success:!0,data:{rank:ce.rank,nickname:ce.nickname,total_assets:ce.total_assets,play_time_ms:ce.play_time_ms,tower_count:ce.tower_count||0}}:{success:!1,data:null,errorType:"not_found"}}catch(q){return console.error("My rank RPC exception:",q),console.warn("[LB] my_rank failed",{phase:"exception",message:q==null?void 0:q.message,error:q}),{success:!1,data:null,error:q.message||"알 수 없는 오류",errorType:"network"}}}const Qs=""+new URL("work_bg_01_alba_night-Db0rzBPq.png",import.meta.url).href,Xs=""+new URL("work_bg_02_gyeyakjik_night-DOcTIOmf.png",import.meta.url).href,Zs=""+new URL("work_bg_03_sawon_night-C5FuvRVs.png",import.meta.url).href,ec=""+new URL("work_bg_04_daeri_night-BsoSfDAg.png",import.meta.url).href,tc=""+new URL("work_bg_05_gwajang_night-CcE0KsfB.png",import.meta.url).href,nc=""+new URL("work_bg_06_chajang_night-CnOFWkRx.png",import.meta.url).href,oc=""+new URL("work_bg_07_bujang_night-0BAHlWBE.png",import.meta.url).href,sc=""+new URL("work_bg_08_sangmu_night-CEIOpmTg.png",import.meta.url).href,cc=""+new URL("work_bg_09_jeonmu_night-BHVf_WEo.png",import.meta.url).href,ac=""+new URL("work_bg_10_ceo_night-BG1qCML1.png",import.meta.url).href,Pn=location.hostname==="localhost"||location.hostname==="127.0.0.1";Pn||(console.log=()=>{},console.warn=()=>{},console.error=()=>{});function ic(){const L=navigator.userAgent||"",u=L.includes("KAKAOTALK"),V=L.includes("Instagram"),T=L.includes("FBAN")||L.includes("FBAV"),B=L.includes("Line"),q=L.includes("MicroMessenger");return{isInApp:u||V||T||B||q,isKakao:u,isInstagram:V,isFacebook:T,isLine:B,isWeChat:q}}function rc(){const{isInApp:L}=ic();if(!L)return;const u=document.createElement("div");u.className="inapp-warning-banner",u.innerHTML=`
    이 브라우저에서는 Google 로그인이 제한될 수 있습니다.<br />
    <strong>Chrome / Safari 등 기본 브라우저에서 다시 열어 주세요.</strong>
    <div class="inapp-warning-actions">
      <button type="button" class="btn-small" id="copyGameUrlBtn">URL 복사</button>
      <button type="button" class="btn-small" id="closeInappWarningBtn">확인</button>
    </div>
  `,document.body.prepend(u);const V=u.querySelector("#copyGameUrlBtn");V&&V.addEventListener("click",async()=>{const B="https://clicksurvivor.com/seoulsurvival/";try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(B),alert(`주소가 복사되었습니다.
Chrome/Safari 주소창에 붙여넣어 열어 주세요.`);return}const q=document.createElement("textarea");q.value=B,q.style.position="fixed",q.style.left="-999999px",q.style.top="-999999px",document.body.appendChild(q),q.focus(),q.select();try{if(document.execCommand("copy"))alert(`주소가 복사되었습니다.
Chrome/Safari 주소창에 붙여넣어 열어 주세요.`);else throw new Error("execCommand failed")}catch{alert(B+`
위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.`)}finally{document.body.removeChild(q)}}catch{alert(B+`
위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.`)}});const T=u.querySelector("#closeInappWarningBtn");T&&T.addEventListener("click",()=>{u.remove()})}document.addEventListener("DOMContentLoaded",()=>{var go;function L(){const t=document.querySelector("header");if(!t)return;const n=Math.ceil(t.getBoundingClientRect().height||0);n>0&&document.documentElement.style.setProperty("--header-h",`${n}px`)}L(),rc(),window.addEventListener("resize",L);try{(go=window.visualViewport)==null||go.addEventListener("resize",L)}catch{}try{const t=document.querySelector("header");t&&"ResizeObserver"in window&&new ResizeObserver(L).observe(t)}catch{}try{const t=n=>n.preventDefault();document.addEventListener("gesturestart",t,{passive:!1}),document.addEventListener("gesturechange",t,{passive:!1}),document.addEventListener("gestureend",t,{passive:!1})}catch{}function u(t,n){t&&t.textContent!==void 0&&(t.textContent=n)}function V(t,n,c){const s=Z;if(fe==="buy"){const a=t==="financial"?z(n,c)*s:Y(n,c,s);if($<a)return C(`💸 자금이 부족합니다. (필요: ${T(a)}원)`),{success:!1,newCount:c};$-=a;const i=c+s,r=t==="financial"?"개":"채",d={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인",villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"}[n]||n;C(`✅ ${d} ${s}${r}를 구입했습니다. (보유 ${i}${r})`);const p={deposit:"💰",savings:"🏦",bond:"📈",usStock:"🇺🇸",crypto:"₿",villa:"🏠",officetel:"🏢",apartment:"🏘️",shop:"🏪",building:"🏙️"};return be.particles&&to(p[n]||"🏠",s),{success:!0,newCount:i}}else if(fe==="sell"){if(c<s)return C(`❌ 판매할 수량이 부족합니다. (보유: ${c})`),{success:!1,newCount:c};const a=t==="financial"?ct(n,c)*s:at(n,c,s);$+=a;const i=c-s,r=t==="financial"?"개":"채",d={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인",villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"}[n]||n;return C(`💰 ${d} ${s}${r}를 판매했습니다. (+${T(a)}원, 보유 ${i}${r})`),{success:!0,newCount:i}}return{success:!1,newCount:c}}function T(t){if(t>=1e12){const n=(t/1e12).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"조"}else if(t>=1e8){const n=(t/1e8).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"억"}else if(t>=1e4){const n=(t/1e4).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"만"}else if(t>=1e3){const n=(t/1e3).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"천"}else return Math.floor(t).toString()}function B(t){return be.shortNumbers?t>=1e12?(t/1e12).toLocaleString("ko-KR",{minimumFractionDigits:2,maximumFractionDigits:2})+"조":t>=1e8?(t/1e8).toLocaleString("ko-KR",{minimumFractionDigits:2,maximumFractionDigits:2})+"억":t>=1e4?(t/1e4).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"만원":t>=1e3?Math.floor(t/1e3).toLocaleString("ko-KR")+"천원":Math.floor(t).toLocaleString("ko-KR")+"원":Math.floor(t).toLocaleString("ko-KR")+"원"}function q(t){return B(t)}function W(t){const n=Math.floor(t||0);return n>=1e12?Math.floor(n/1e12).toLocaleString("ko-KR")+"조":n>=1e8?Math.floor(n/1e8).toLocaleString("ko-KR")+"억":n>=1e4?Math.floor(n/1e4).toLocaleString("ko-KR")+"만원":"0만원"}function ue(t){return t>=1e8?Math.round(t/1e8).toLocaleString("ko-KR")+"억":t>=1e4?Math.round(t/1e4).toLocaleString("ko-KR")+"만":t>=1e3?Math.round(t/1e3).toLocaleString("ko-KR")+"천":Math.floor(t).toLocaleString("ko-KR")}function ce(t){return t>=1e8?(Math.round(t/1e7)/10).toLocaleString("ko-KR")+"억":t>=1e4?Math.round(t/1e4).toLocaleString("ko-KR")+"만":Math.floor(t).toLocaleString("ko-KR")}function te(t){return B(t)}function mn(t){return t>=1e12?(t/1e12).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"조":t>=1e8?(t/1e8).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"억":t>=1e4?(t/1e4).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"만":t>=1e3?(t/1e3).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"천":Math.floor(t).toString()}function ne(t){return be.shortNumbers?mn(t)+"원":Math.floor(t).toLocaleString("ko-KR")+"원"}const Je={deposit:5e4,savings:5e5,bond:5e6,usStock:25e6,crypto:1e8},st={villa:25e7,officetel:35e7,apartment:8e8,shop:12e8,building:3e9,tower:1e12};function z(t,n,c=1){const s=Je[t];let a=0;for(let i=0;i<c;i++){const r=n+i;let m=s*Math.pow(1.05,r);a+=m}return Math.floor(a)}function ct(t,n,c=1){if(n<=0)return 0;let s=0;for(let a=0;a<c&&!(n-a<=0);a++){const i=z(t,n-a-1,1);s+=Math.floor(i*1)}return s}function Y(t,n,c=1){const s=st[t];if(!s)return 0;if(t==="tower")return s*c;let a=0;for(let i=0;i<c;i++){const r=n+i;let m=s*Math.pow(1.05,r);a+=m}return Math.floor(a)}function at(t,n,c=1){if(t==="tower"||n<=0)return 0;let s=0;for(let a=0;a<c&&!(n-a<=0);a++){const i=Y(t,n-a-1,1);s+=Math.floor(i*1)}return s}let $=0,we=0,Be=Date.now(),Qe=Date.now(),M=0,_=0,x=0,H=0,K=0,Ae=0,De=0,Fe=0,Oe=0,Ne=0,Ue=0,qe=0,Ke=0,Ve=0,He=0,fe="buy",Z=1;const _e="seoulTycoonSaveV1",zt="ss_blockCloudRestoreUntilNicknameDone",fn="ss_skipCloudRestoreOnce";let Yt=new Date,ee="",dt=!1;const J={part_time_job:{name:"🍕 아르바이트 경험",desc:"클릭 수익 1.2배",cost:5e4,icon:"🍕",unlockCondition:()=>G>=1,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},internship:{name:"📝 인턴십",desc:"클릭 수익 1.2배",cost:2e5,icon:"📝",unlockCondition:()=>G>=2,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},efficient_work:{name:"⚡ 효율적인 업무 처리",desc:"클릭 수익 1.2배",cost:5e5,icon:"⚡",unlockCondition:()=>G>=3,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},focus_training:{name:"🎯 집중력 강화",desc:"클릭 수익 1.2배",cost:2e6,icon:"🎯",unlockCondition:()=>G>=4,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},professional_education:{name:"📚 전문 교육",desc:"클릭 수익 1.2배",cost:1e7,icon:"📚",unlockCondition:()=>G>=5,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},performance_bonus:{name:"💰 성과급",desc:"2% 확률로 10배 수익",cost:1e7,icon:"💰",unlockCondition:()=>G>=6,effect:()=>{},category:"labor",unlocked:!1,purchased:!1},career_recognition:{name:"💼 경력 인정",desc:"클릭 수익 1.2배",cost:3e7,icon:"💼",unlockCondition:()=>G>=6,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},overtime_work:{name:"🔥 초과근무",desc:"클릭 수익 1.2배",cost:5e7,icon:"🔥",unlockCondition:()=>G>=7,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},honor_award:{name:"🎖️ 명예상",desc:"클릭 수익 1.2배",cost:1e8,icon:"🎖️",unlockCondition:()=>G>=7,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},expertise_development:{name:"💎 전문성 개발",desc:"클릭 수익 1.2배",cost:2e8,icon:"💎",unlockCondition:()=>G>=8,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},teamwork:{name:"🤝 팀워크 향상",desc:"클릭 수익 1.2배",cost:5e8,icon:"🤝",unlockCondition:()=>G>=8,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},leadership:{name:"👑 리더십",desc:"클릭 수익 1.2배",cost:2e9,icon:"👑",unlockCondition:()=>G>=8,effect:()=>{ge*=1.2},category:"labor",unlocked:!1,purchased:!1},ceo_privilege:{name:"👔 CEO 특권",desc:"클릭 수익 2.0배",cost:1e10,icon:"👔",unlockCondition:()=>G>=9,effect:()=>{ge*=2},category:"labor",unlocked:!1,purchased:!1},global_experience:{name:"🌍 글로벌 경험",desc:"클릭 수익 2.0배",cost:5e10,icon:"🌍",unlockCondition:()=>G>=9&&ae>=15e3,effect:()=>{ge*=2},category:"labor",unlocked:!1,purchased:!1},entrepreneurship:{name:"🚀 창업",desc:"클릭 수익 2.0배",cost:1e11,icon:"🚀",unlockCondition:()=>G>=9&&ae>=3e4,effect:()=>{ge*=2},category:"labor",unlocked:!1,purchased:!1},deposit_boost_1:{name:"💰 예금 이자율 상승",desc:"예금 수익 2배",cost:1e5,icon:"💰",unlockCondition:()=>M>=5,effect:()=>{b.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_2:{name:"💎 프리미엄 예금",desc:"예금 수익 2배",cost:25e4,icon:"💎",unlockCondition:()=>M>=15,effect:()=>{b.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_3:{name:"💠 다이아몬드 예금",desc:"예금 수익 2배",cost:5e5,icon:"💠",unlockCondition:()=>M>=30,effect:()=>{b.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_4:{name:"💍 플래티넘 예금",desc:"예금 수익 2배",cost:1e6,icon:"💍",unlockCondition:()=>M>=40,effect:()=>{b.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_5:{name:"👑 킹 예금",desc:"예금 수익 2배",cost:2e6,icon:"👑",unlockCondition:()=>M>=50,effect:()=>{b.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},savings_boost_1:{name:"🏦 적금 복리 효과",desc:"적금 수익 2배",cost:1e6,icon:"🏦",unlockCondition:()=>_>=5,effect:()=>{b.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_2:{name:"🏅 골드 적금",desc:"적금 수익 2배",cost:25e5,icon:"🏅",unlockCondition:()=>_>=15,effect:()=>{b.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_3:{name:"💍 플래티넘 적금",desc:"적금 수익 2배",cost:5e6,icon:"💍",unlockCondition:()=>_>=30,effect:()=>{b.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_4:{name:"💠 다이아몬드 적금",desc:"적금 수익 2배",cost:1e7,icon:"💠",unlockCondition:()=>_>=40,effect:()=>{b.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_5:{name:"👑 킹 적금",desc:"적금 수익 2배",cost:2e7,icon:"👑",unlockCondition:()=>_>=50,effect:()=>{b.savings*=2},category:"savings",unlocked:!1,purchased:!1},bond_boost_1:{name:"📈 주식 수익률 향상",desc:"주식 수익 2배",cost:1e7,icon:"📈",unlockCondition:()=>x>=5,effect:()=>{b.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_2:{name:"💹 프리미엄 주식",desc:"주식 수익 2배",cost:25e6,icon:"💹",unlockCondition:()=>x>=15,effect:()=>{b.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_3:{name:"📊 블루칩 주식",desc:"주식 수익 2배",cost:5e7,icon:"📊",unlockCondition:()=>x>=30,effect:()=>{b.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_4:{name:"💎 대형주 포트폴리오",desc:"주식 수익 2배",cost:1e8,icon:"💎",unlockCondition:()=>x>=40,effect:()=>{b.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_5:{name:"👑 킹 주식",desc:"주식 수익 2배",cost:2e8,icon:"👑",unlockCondition:()=>x>=50,effect:()=>{b.bond*=2},category:"bond",unlocked:!1,purchased:!1},usstock_boost_1:{name:"🇺🇸 S&P 500 투자",desc:"미국주식 수익 2배",cost:5e7,icon:"🇺🇸",unlockCondition:()=>H>=5,effect:()=>{b.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_2:{name:"📈 나스닥 투자",desc:"미국주식 수익 2배",cost:125e6,icon:"📈",unlockCondition:()=>H>=15,effect:()=>{b.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_3:{name:"💎 글로벌 주식 포트폴리오",desc:"미국주식 수익 2배",cost:25e7,icon:"💎",unlockCondition:()=>H>=30,effect:()=>{b.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_4:{name:"🌍 글로벌 대형주",desc:"미국주식 수익 2배",cost:5e8,icon:"🌍",unlockCondition:()=>H>=40,effect:()=>{b.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_5:{name:"👑 킹 글로벌 주식",desc:"미국주식 수익 2배",cost:1e9,icon:"👑",unlockCondition:()=>H>=50,effect:()=>{b.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},crypto_boost_1:{name:"₿ 비트코인 투자",desc:"코인 수익 2배",cost:2e8,icon:"₿",unlockCondition:()=>K>=5,effect:()=>{b.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_2:{name:"💎 알트코인 포트폴리오",desc:"코인 수익 2배",cost:5e8,icon:"💎",unlockCondition:()=>K>=15,effect:()=>{b.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_3:{name:"🚀 디지털 자산 전문가",desc:"코인 수익 2배",cost:1e9,icon:"🚀",unlockCondition:()=>K>=30,effect:()=>{b.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_4:{name:"🌐 메타버스 자산",desc:"코인 수익 2배",cost:2e9,icon:"🌐",unlockCondition:()=>K>=40,effect:()=>{b.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_5:{name:"👑 킹 암호화폐",desc:"코인 수익 2배",cost:4e9,icon:"👑",unlockCondition:()=>K>=50,effect:()=>{b.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},villa_boost_1:{name:"🏘️ 빌라 리모델링",desc:"빌라 수익 2배",cost:5e8,icon:"🏘️",unlockCondition:()=>D>=5,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_2:{name:"🌟 럭셔리 빌라",desc:"빌라 수익 2배",cost:125e7,icon:"🌟",unlockCondition:()=>D>=15,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_3:{name:"✨ 프리미엄 빌라 단지",desc:"빌라 수익 2배",cost:25e8,icon:"✨",unlockCondition:()=>D>=30,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_4:{name:"💎 다이아몬드 빌라",desc:"빌라 수익 2배",cost:5e9,icon:"💎",unlockCondition:()=>D>=40,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_5:{name:"👑 킹 빌라",desc:"빌라 수익 2배",cost:1e10,icon:"👑",unlockCondition:()=>D>=50,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},officetel_boost_1:{name:"🏢 오피스텔 스마트화",desc:"오피스텔 수익 2배",cost:7e8,icon:"🏢",unlockCondition:()=>F>=5,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_2:{name:"🏙️ 프리미엄 오피스텔",desc:"오피스텔 수익 2배",cost:175e7,icon:"🏙️",unlockCondition:()=>F>=15,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_3:{name:"🌆 럭셔리 오피스텔 타워",desc:"오피스텔 수익 2배",cost:35e8,icon:"🌆",unlockCondition:()=>F>=30,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_4:{name:"💎 다이아몬드 오피스텔",desc:"오피스텔 수익 2배",cost:7e9,icon:"💎",unlockCondition:()=>F>=40,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_5:{name:"👑 킹 오피스텔",desc:"오피스텔 수익 2배",cost:14e9,icon:"👑",unlockCondition:()=>F>=50,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},apartment_boost_1:{name:"🏡 아파트 프리미엄화",desc:"아파트 수익 2배",cost:16e8,icon:"🏡",unlockCondition:()=>A>=5,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_2:{name:"🏰 타워팰리스급 아파트",desc:"아파트 수익 2배",cost:4e9,icon:"🏰",unlockCondition:()=>A>=15,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_3:{name:"🏛️ 초고급 아파트 단지",desc:"아파트 수익 2배",cost:8e9,icon:"🏛️",unlockCondition:()=>A>=30,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_4:{name:"💎 다이아몬드 아파트",desc:"아파트 수익 2배",cost:16e9,icon:"💎",unlockCondition:()=>A>=40,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_5:{name:"👑 킹 아파트",desc:"아파트 수익 2배",cost:32e9,icon:"👑",unlockCondition:()=>A>=50,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},shop_boost_1:{name:"🏪 상가 입지 개선",desc:"상가 수익 2배",cost:24e8,icon:"🏪",unlockCondition:()=>O>=5,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_2:{name:"🛍️ 프리미엄 상권",desc:"상가 수익 2배",cost:6e9,icon:"🛍️",unlockCondition:()=>O>=15,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_3:{name:"🏬 메가몰 상권",desc:"상가 수익 2배",cost:12e9,icon:"🏬",unlockCondition:()=>O>=30,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_4:{name:"💎 다이아몬드 상권",desc:"상가 수익 2배",cost:24e9,icon:"💎",unlockCondition:()=>O>=40,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_5:{name:"👑 킹 상권",desc:"상가 수익 2배",cost:48e9,icon:"👑",unlockCondition:()=>O>=50,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},building_boost_1:{name:"🏙️ 빌딩 테넌트 확보",desc:"빌딩 수익 2배",cost:6e9,icon:"🏙️",unlockCondition:()=>N>=5,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_2:{name:"💼 랜드마크 빌딩",desc:"빌딩 수익 2배",cost:15e9,icon:"💼",unlockCondition:()=>N>=15,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_3:{name:"🏢 초고층 마천루",desc:"빌딩 수익 2배",cost:3e10,icon:"🏢",unlockCondition:()=>N>=30,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_4:{name:"💎 다이아몬드 빌딩",desc:"빌딩 수익 2배",cost:6e10,icon:"💎",unlockCondition:()=>N>=40,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_5:{name:"👑 킹 빌딩",desc:"빌딩 수익 2배",cost:12e10,icon:"👑",unlockCondition:()=>N>=50,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},rent_multiplier:{name:"📊 부동산 관리 전문화",desc:"모든 부동산 수익 +10%",cost:1e9,icon:"📊",unlockCondition:()=>rt()>=10,effect:()=>{Ee*=1.1},category:"global",unlocked:!1,purchased:!1},manager_hire:{name:"👨‍💼 전문 관리인 고용",desc:"전체 임대 수익 +5%",cost:5e9,icon:"👨‍💼",unlockCondition:()=>rt()>=20,effect:()=>{Ee*=1.05,pn++},category:"global",unlocked:!1,purchased:!1},financial_expert:{name:"💼 금융 전문가 고용",desc:"모든 금융 수익 +20%",cost:1e10,icon:"💼",unlockCondition:()=>G>=8,effect:()=>{b.deposit*=1.2,b.savings*=1.2,b.bond*=1.2},category:"global",unlocked:!1,purchased:!1},auto_work_system:{name:"📱 자동 업무 처리 시스템",desc:"1초마다 자동으로 1회 클릭 (초당 수익 추가)",cost:5e9,icon:"📱",unlockCondition:()=>G>=7&&rt()>=10,effect:()=>{Jt=!0},category:"global",unlocked:!1,purchased:!1}};let D=0,F=0,A=0,O=0,N=0,ke=0;const gn={deposit:!0,savings:!1,bond:!1,villa:!1,officetel:!1,apartment:!1,shop:!1,building:!1,tower:!1},b={deposit:50,savings:750,bond:11250,usStock:6e4,crypto:25e4},v={villa:84380,officetel:177190,apartment:607500,shop:137e4,building:514e4},An={...b},Dn={...v};function Io(){for(const t of Object.keys(An))b[t]=An[t];for(const t of Object.keys(Dn))v[t]=Dn[t]}function Eo(){Io();for(const t of Object.values(J)){if(!(t!=null&&t.purchased)||typeof t.effect!="function")continue;const n=Function.prototype.toString.call(t.effect);if(n.includes("FINANCIAL_INCOME")||n.includes("BASE_RENT"))try{t.effect()}catch{}}}let ge=1,Ee=1,Jt=!1,pn=0;const Fn="capitalClicker_settings";let be={particles:!0,fancyGraphics:!0,shortNumbers:!1},G=0,Ge=0;const vt=[{name:"알바",multiplier:1,requiredIncome:0,requiredClicks:0,bgImage:Qs},{name:"계약직",multiplier:1.5,requiredIncome:5e6,requiredClicks:100,bgImage:Xs},{name:"사원",multiplier:2,requiredIncome:1e7,requiredClicks:300,bgImage:Zs},{name:"대리",multiplier:2.5,requiredIncome:2e7,requiredClicks:800,bgImage:ec},{name:"과장",multiplier:3,requiredIncome:3e7,requiredClicks:1500,bgImage:tc},{name:"차장",multiplier:3.5,requiredIncome:4e7,requiredClicks:2500,bgImage:nc},{name:"부장",multiplier:4,requiredIncome:5e7,requiredClicks:4e3,bgImage:oc},{name:"상무",multiplier:5,requiredIncome:7e7,requiredClicks:6e3,bgImage:sc},{name:"전무",multiplier:10,requiredIncome:12e7,requiredClicks:9e3,bgImage:cc},{name:"CEO",multiplier:12,requiredIncome:25e7,requiredClicks:15e3,bgImage:ac}];let On=1e9,Nn=5e9,Qt=1,xe=0,ie=null;const Un=[{name:"강남 아파트 대박",duration:5e4,color:"#4CAF50",effects:{property:{apartment:2.5,villa:1.4,officetel:1.2}},description:"강남 아파트발 상승 랠리로 주거형 부동산 수익이 상승합니다."},{name:"전세 대란",duration:6e4,color:"#2196F3",effects:{property:{villa:2.5,officetel:2.5,apartment:1.8}},description:"전세 수요 급증으로 빌라/오피스텔 중심의 임대 수익이 급등합니다."},{name:"상권 활성화",duration:5e4,color:"#FF9800",effects:{property:{shop:2.5,building:1.6}},description:"상권 회복으로 상가 수익이 크게 증가합니다."},{name:"오피스 수요 급증",duration:55e3,color:"#9C27B0",effects:{property:{building:2.5,shop:1.4,officetel:1.2}},description:"오피스 확장으로 빌딩 중심 수익이 급등합니다."},{name:"한국은행 금리 인하",duration:7e4,color:"#2196F3",effects:{financial:{deposit:.7,savings:.8,bond:2,usStock:1.5}},description:"금리 인하로 예금/적금은 약세, 주식은 강세를 보입니다."},{name:"주식시장 대호황",duration:6e4,color:"#4CAF50",effects:{financial:{bond:2.5,usStock:2,crypto:1.5}},description:"리스크 자산 선호로 주식 중심 수익이 크게 증가합니다."},{name:"미국 연준 양적완화",duration:7e4,color:"#2196F3",effects:{financial:{usStock:2.5,crypto:1.8,bond:1.3}},description:"달러 유동성 확대로 미국주식/코인 수익이 상승합니다."},{name:"비트코인 급등",duration:45e3,color:"#FF9800",effects:{financial:{crypto:2.5,usStock:1.2}},description:"암호화폐 랠리로 코인 수익이 크게 증가합니다."},{name:"금융위기",duration:9e4,color:"#F44336",effects:{financial:{bond:.7,usStock:.7,crypto:.7},property:{shop:.7,building:.7}},description:"리스크 회피로 주식/코인/상업용 부동산이 타격을 받습니다."},{name:"은행 파산 위기",duration:75e3,color:"#9C27B0",effects:{financial:{deposit:.7,savings:.7,bond:.8}},description:"은행 신뢰 하락으로 예금/적금 수익이 둔화합니다."},{name:"주식시장 폭락",duration:75e3,color:"#F44336",effects:{financial:{bond:.7,usStock:.7,crypto:.7}},description:"주식/리스크 자산 급락으로 수익이 크게 감소합니다."},{name:"암호화폐 규제",duration:75e3,color:"#9C27B0",effects:{financial:{crypto:.7}},description:"규제 강화로 코인 수익이 감소합니다."}];let ae=0;const Xe=[{id:"first_click",name:"첫 노동",desc:"첫 번째 클릭을 했다",icon:"👆",condition:()=>ae>=1,unlocked:!1},{id:"first_deposit",name:"첫 예금",desc:"첫 번째 예금을 구입했다",icon:"💰",condition:()=>M>=1,unlocked:!1},{id:"first_savings",name:"첫 적금",desc:"첫 번째 적금을 구입했다",icon:"🏦",condition:()=>_>=1,unlocked:!1},{id:"first_bond",name:"첫 국내주식",desc:"첫 번째 국내주식을 구입했다",icon:"📈",condition:()=>x>=1,unlocked:!1},{id:"first_us_stock",name:"첫 미국주식",desc:"첫 번째 미국주식을 구입했다",icon:"🇺🇸",condition:()=>H>=1,unlocked:!1},{id:"first_crypto",name:"첫 코인",desc:"첫 번째 코인을 구입했다",icon:"₿",condition:()=>K>=1,unlocked:!1},{id:"first_property",name:"첫 부동산",desc:"첫 번째 부동산을 구입했다",icon:"🏠",condition:()=>D+F+A+O+N>=1,unlocked:!1},{id:"first_upgrade",name:"첫 업그레이드",desc:"첫 번째 업그레이드를 구입했다",icon:"⚡",condition:()=>Object.values(J).some(t=>t.purchased),unlocked:!1},{id:"financial_expert",name:"금융 전문가",desc:"모든 금융상품을 보유했다",icon:"💼",condition:()=>M>0&&_>0&&x>0&&H>0&&K>0,unlocked:!1},{id:"property_collector",name:"부동산 수집가",desc:"5채의 부동산을 보유했다",icon:"🏘️",condition:()=>rt()>=5,unlocked:!1},{id:"property_tycoon",name:"부동산 타이쿤",desc:"모든 부동산 종류를 보유했다",icon:"🏙️",condition:()=>D>0&&F>0&&A>0&&O>0&&N>0,unlocked:!1},{id:"investment_guru",name:"투자 고수",desc:"모든 업그레이드를 구입했다",icon:"📊",condition:()=>Object.values(J).every(t=>t.purchased),unlocked:!1},{id:"gangnam_rich",name:"강남 부자",desc:"강남 부동산 3채를 보유했다",icon:"🏙️",condition:()=>A>=3,unlocked:!1},{id:"global_investor",name:"글로벌 투자자",desc:"해외 투자 1억원을 달성했다",icon:"🌍",condition:()=>H*1e6+K*1e6>=1e8,unlocked:!1},{id:"crypto_expert",name:"암호화폐 전문가",desc:"코인 투자 5억원을 달성했다",icon:"₿",condition:()=>K*1e6>=5e8,unlocked:!1},{id:"real_estate_agent",name:"부동산 중개사",desc:"부동산 20채를 보유했다",icon:"🏠",condition:()=>rt()>=20,unlocked:!1},{id:"millionaire",name:"백만장자",desc:"총 자산 1억원을 달성했다",icon:"💎",condition:()=>$>=1e8,unlocked:!1},{id:"ten_millionaire",name:"억만장자",desc:"총 자산 10억원을 달성했다",icon:"💰",condition:()=>$>=1e9,unlocked:!1},{id:"hundred_millionaire",name:"부자",desc:"총 자산 100억원을 달성했다",icon:"🏆",condition:()=>$>=1e10,unlocked:!1},{id:"billionaire",name:"대부호",desc:"총 자산 1,000억원을 달성했다",icon:"👑",condition:()=>$>=1e11,unlocked:!1},{id:"trillionaire",name:"재벌",desc:"총 자산 1조원을 달성했다",icon:"🏰",condition:()=>$>=1e12,unlocked:!1},{id:"global_rich",name:"세계적 부자",desc:"총 자산 10조원을 달성했다",icon:"🌍",condition:()=>$>=1e13,unlocked:!1},{id:"legendary_rich",name:"전설의 부자",desc:"총 자산 100조원을 달성했다",icon:"⭐",condition:()=>$>=1e14,unlocked:!1},{id:"god_rich",name:"신의 부자",desc:"총 자산 1,000조원을 달성했다",icon:"✨",condition:()=>$>=1e15,unlocked:!1},{id:"career_starter",name:"직장인",desc:"계약직으로 승진했다",icon:"👔",condition:()=>G>=1,unlocked:!1},{id:"employee",name:"정규직",desc:"사원으로 승진했다",icon:"👨‍💼",condition:()=>G>=2,unlocked:!1},{id:"deputy_director",name:"팀장",desc:"과장으로 승진했다",icon:"👨‍💻",condition:()=>G>=4,unlocked:!1},{id:"executive",name:"임원",desc:"상무로 승진했다",icon:"👨‍🎓",condition:()=>G>=7,unlocked:!1},{id:"ceo",name:"CEO",desc:"CEO가 되었다",icon:"👑",condition:()=>G>=9,unlocked:!1},{id:"chaebol_chairman",name:"재벌 회장",desc:"자산 1조원을 달성했다",icon:"🏆",condition:()=>$>=1e12,unlocked:!1},{id:"global_ceo",name:"글로벌 CEO",desc:"해외 진출을 달성했다",icon:"🌍",condition:()=>H>=10&&K>=10,unlocked:!1},{id:"legendary_ceo",name:"전설의 CEO",desc:"모든 목표를 달성했다",icon:"⭐",condition:()=>G>=9&&$>=1e14,unlocked:!1}],Lo=document.getElementById("cash"),So=document.getElementById("financial"),wo=document.getElementById("properties"),Bo=document.getElementById("rps"),it=document.getElementById("workBtn"),ve=document.querySelector(".work"),_o=document.getElementById("log"),qn=document.getElementById("shareBtn"),Kn=document.getElementById("favoriteBtn"),xo=document.getElementById("clickIncomeButton");document.getElementById("clickIncomeLabel");const To=document.getElementById("clickMultiplier"),Mo=document.getElementById("rentMultiplier"),Ze=document.getElementById("gameModalRoot"),je=document.getElementById("gameModalTitle"),We=document.getElementById("gameModalMessage"),Le=document.getElementById("gameModalPrimary"),Ce=document.getElementById("gameModalSecondary"),Vn=document.getElementById("depositCount"),Po=document.getElementById("incomePerDeposit"),Ct=document.getElementById("buyDeposit"),Hn=document.getElementById("savingsCount"),Ro=document.getElementById("incomePerSavings"),It=document.getElementById("buySavings"),Gn=document.getElementById("bondCount"),Ao=document.getElementById("incomePerBond"),Et=document.getElementById("buyBond");document.getElementById("usStockCount"),document.getElementById("incomePerUsStock");const Lt=document.getElementById("buyUsStock");document.getElementById("cryptoCount"),document.getElementById("incomePerCrypto");const St=document.getElementById("buyCrypto"),yn=document.getElementById("buyMode"),$n=document.getElementById("sellMode"),Xt=document.getElementById("qty1"),Zt=document.getElementById("qty5"),en=document.getElementById("qty10"),wt=document.getElementById("toggleUpgrades"),Bt=document.getElementById("toggleFinancial"),_t=document.getElementById("toggleProperties"),jn=document.getElementById("saveStatus"),Wn=document.getElementById("resetBtn"),Do=document.getElementById("depositCurrentPrice"),Fo=document.getElementById("savingsCurrentPrice"),Oo=document.getElementById("bondCurrentPrice"),No=document.getElementById("villaCurrentPrice"),Uo=document.getElementById("officetelCurrentPrice"),qo=document.getElementById("aptCurrentPrice"),Ko=document.getElementById("shopCurrentPrice"),Vo=document.getElementById("buildingCurrentPrice"),Ho=document.getElementById("villaCount"),Go=document.getElementById("rentPerVilla"),xt=document.getElementById("buyVilla"),jo=document.getElementById("officetelCount"),Wo=document.getElementById("rentPerOfficetel"),Tt=document.getElementById("buyOfficetel"),zo=document.getElementById("aptCount"),Yo=document.getElementById("rentPerApt"),Mt=document.getElementById("buyApt"),Jo=document.getElementById("shopCount"),Qo=document.getElementById("rentPerShop"),Pt=document.getElementById("buyShop"),Xo=document.getElementById("buildingCount"),Zo=document.getElementById("rentPerBuilding"),Rt=document.getElementById("buyBuilding"),zn=document.getElementById("towerCountDisplay"),Yn=document.getElementById("towerCountBadge"),Jn=document.getElementById("towerCurrentPrice"),ut=document.getElementById("buyTower"),es=document.getElementById("currentCareer");document.getElementById("careerCost");const mt=document.getElementById("careerProgress"),Qn=document.getElementById("careerProgressText"),At=document.getElementById("careerRemaining");function C(t){if(["🧪","v2.","v3.","Cookie Clicker","업그레이드 시스템","DOM 참조","성능 최적화","자동 저장 시스템","업그레이드 클릭","커리어 진행률","구현 완료","수정 완료","정상화","작동 중","활성화","해결","버그 수정","최적화","개편","벤치마킹"].some(g=>t.includes(g)))return;const s=g=>String(g).padStart(2,"0"),a=new Date,i=`${s(a.getHours())}:${s(a.getMinutes())}`;function r(){const g=a.getFullYear(),f=s(a.getMonth()+1),w=s(a.getDate()),S=typeof Qe<"u"&&Qe?Qe:Be,j=Math.max(1,Math.floor((Date.now()-S)/864e5)+1),oe=document.getElementById("diaryHeaderMeta");oe&&(oe.textContent=`${g}.${f}.${w}(${j}일차)`);const se=document.getElementById("diaryMetaDate"),me=document.getElementById("diaryMetaDay");se&&(se.textContent=`오늘: ${g}.${f}.${w}`),me&&(me.textContent=`일차: ${j}일차`)}function m(g){var me,tt,U,$e,le,he,Ie,Se;const f=String(g||"").trim();if(/다음\s*업그레이드/.test(f)&&/클릭\s*남/.test(f))return"";const w=e=>e.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/g,"").trim(),S=e=>Math.floor(Math.random()*e),j=(e,o)=>{if(!Array.isArray(o)||o.length===0)return"";const k=`__diaryLastPick_${e}`,P=window[k];let ye=S(o.length);return o.length>1&&typeof P=="number"&&ye===P&&(ye=(ye+1+S(o.length-1))%o.length),window[k]=ye,o[ye]},oe=e=>w(e).replace(/\s+/g," ").trim();if(f.startsWith("🏆 업적 달성:")){const e=w(f).replace(/^업적 달성:\s*/,""),[o,k]=e.split(/\s*-\s*/);return j("achievement",[`오늘은 체크 하나를 더했다. (${o||"업적"})`,`작게나마 성취. ${o||"업적"}라니, 나도 꽤 한다.`,`기록해둔다: ${o||"업적"}.
${k||""}`.trim(),`"${o||"업적"}" 달성.
${k?`메모: ${k}`:""}`.trim(),`별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. (${o||"업적"})`,`또 하나의 마일스톤. ${o||"업적"}.
${k||""}`.trim(),`작은 성취도 성취다. ${o||"업적"}.
${k||""}`.trim(),`하루하루가 쌓인다. 오늘은 ${o||"업적"}.
${k||""}`.trim(),`기록에 하나 더. ${o||"업적"}.
${k||""}`.trim(),`뿌듯함이 조금씩. ${o||"업적"} 달성.
${k||""}`.trim(),`이런 게 인생이지. ${o||"업적"}.
${k||""}`.trim(),`작은 발걸음이 모여 길이 된다. ${o||"업적"}.
${k||""}`.trim()])}if(f.startsWith("🎉")&&f.includes("승진했습니다")){const e=f.match(/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/),o=(me=e==null?void 0:e[1])==null?void 0:me.trim(),k=(tt=e==null?void 0:e[2])==null?void 0:tt.trim(),P=k?k.replace(/[()]/g,"").trim():"";return j("promotion",[`명함이 바뀌었다. ${o||"다음 단계"}.
${P}`.trim(),`오늘은 좀 뿌듯하다. ${o||"승진"}이라니.
${P}`.trim(),`승진했다. 책임도 같이 딸려온다는데… 일단 축하부터.
${P}`.trim(),`그래, 나도 올라갈 줄 안다. ${o||"승진"}.
${P}`.trim(),`커피가 조금 더 쓰게 느껴진다. ${o||"승진"}의 맛.
${P}`.trim(),`한 단계 올라섰다. ${o||"승진"}.
${P}`.trim(),`노력이 보상받는 순간. ${o||"승진"}.
${P}`.trim(),`새로운 시작. ${o||"승진"}.
${P}`.trim(),`더 높은 곳에서 보는 풍경이 다르다. ${o||"승진"}.
${P}`.trim(),`자리도 바뀌고 마음도 바뀐다. ${o||"승진"}.
${P}`.trim(),`이제야 진짜 시작인가. ${o||"승진"}.
${P}`.trim(),`무게감이 느껴진다. ${o||"승진"}의 무게.
${P}`.trim()])}if(f.startsWith("🔓")){const e=oe(f),o=f.match(/^🔓\s*(.+?)이\s*해금/),k=((o==null?void 0:o[1])||"").trim(),P={적금:[`자동이체 버튼이 눈에 들어왔다.
${e}`,`천천히 쌓는 쪽으로 방향을 틀었다.
${e}`,`오늘은 '루틴'이 열렸다.
${e}`,`꾸준함의 길이 열렸다.
${e}`,`작은 투자의 문이 열렸다.
${e}`,`시간이 내 편이 되는 선택지.
${e}`,`루틴 투자의 시작.
${e}`,`매일의 습관이 가능해졌다.
${e}`,`인내심의 투자가 열렸다.
${e}`,`작은 것들이 모이는 길.
${e}`],국내주식:[`이제 차트랑 뉴스랑 싸울 차례다.
${e}`,`심장이 약하면 못 할 선택지… 열렸다.
${e}`,`변동성의 문이 열렸다.
${e}`,`국장의 세계로 입문.
${e}`,`차트의 파도를 탈 수 있다.
${e}`,`투자자의 길이 열렸다.
${e}`,`변동성에 도전할 수 있다.
${e}`,`국장의 심장박동을 느낄 수 있다.
${e}`,`위험과 기회의 문.
${e}`,`국장 투자의 시작.
${e}`],미국주식:[`시차를 버티는 돈이 열렸다.
${e}`,`달러 냄새가 난다.
${e}`,`밤샘의 선택지… 드디어.
${e}`,`글로벌 투자의 문이 열렸다.
${e}`,`세계 시장에 발을 담글 수 있다.
${e}`,`미장의 파도를 탈 수 있다.
${e}`,`달러의 무게를 느낄 수 있다.
${e}`,`시차의 스트레스를 견딜 수 있다.
${e}`,`환율의 변동을 경험할 수 있다.
${e}`,`미장 투자의 시작.
${e}`],코인:[`롤러코스터 입장권이 생겼다.
${e}`,`FOMO가 문을 두드린다.
${e}`,`폭등/폭락의 세계가 열렸다.
${e}`,`변동성의 극치를 경험할 수 있다.
${e}`,`멘탈이 시험받는 투자.
${e}`,`코인판의 무게를 견딜 수 있다.
${e}`,`FOMO와 공포 사이의 선택.
${e}`,`디지털 자산의 세계.
${e}`,`심장이 먼저 반응하는 투자.
${e}`,`롤러코스터의 정점에 설 수 있다.
${e}`],빌라:[`첫 '집'이라는 단어가 현실이 됐다.
${e}`,`작아도 내 편이 하나 생긴 기분.
${e}`,`부동산 투자의 첫걸음.
${e}`,`집이라는 단어가 현실이 됐다.
${e}`,`내 공간을 가질 수 있다.
${e}`,`작은 집도 집이다.
${e}`,`부동산의 세계로 입문.
${e}`,`첫 집의 무게감을 느낄 수 있다.
${e}`,`내 이름으로 등기할 수 있다.
${e}`,`부동산 투자의 시작.
${e}`],오피스텔:[`출근 동선이 머리에 그려졌다.
${e}`,`현실적인 선택지가 열렸다.
${e}`,`실용적인 투자가 가능해졌다.
${e}`,`생활의 편의를 살 수 있다.
${e}`,`도시 생활의 현실을 경험할 수 있다.
${e}`,`작은 공간, 큰 만족의 선택.
${e}`,`실용주의의 투자.
${e}`,`생활의 질을 올릴 수 있다.
${e}`,`현실적인 부동산 투자.
${e}`,`도시 생활의 편의를 살 수 있다.
${e}`],아파트:[`꿈이 조금 현실 쪽으로 다가왔다.
${e}`,`안정의 상징이 열렸다.
${e}`,`한국인의 꿈을 살 수 있다.
${e}`,`부동산 투자의 정점.
${e}`,`아파트의 무게감을 느낄 수 있다.
${e}`,`꿈이 현실이 되는 순간.
${e}`,`안정적인 투자가 가능해졌다.
${e}`,`부동산의 대표주자를 살 수 있다.
${e}`,`가치가 보장되는 선택.
${e}`,`한국 사회의 상징을 살 수 있다.
${e}`],상가:[`유동인구라는 단어가 갑자기 무겁다.
${e}`,`장사 잘되길… 진심으로.
${e}`,`상권의 힘을 믿을 수 있다.
${e}`,`유동인구가 내 수익이 될 수 있다.
${e}`,`상권 투자의 묘미를 느낄 수 있다.
${e}`,`임대 수익의 달콤함을 경험할 수 있다.
${e}`,`상가의 가치를 알아볼 수 있다.
${e}`,`상권의 파도를 탈 수 있다.
${e}`,`임차인의 성공이 내 성공이 될 수 있다.
${e}`,`상가 투자의 리스크를 감수할 수 있다.
${e}`],빌딩:[`스카이라인에 욕심이 생겼다.
${e}`,`이제 진짜 '엔드게임' 냄새.
${e}`,`부동산 투자의 정점.
${e}`,`스카이라인의 주인이 될 수 있다.
${e}`,`도시의 한 조각을 소유할 수 있다.
${e}`,`빌딩의 무게감을 느낄 수 있다.
${e}`,`부동산 투자의 완성.
${e}`,`도시의 심장부를 살 수 있다.
${e}`,`스카이라인에 내 이름을 올릴 수 있다.
${e}`,`부동산 투자의 궁극.
${e}`]};return k&&P[k]?j(`unlock_${k}`,P[k]):j("unlock",[`문이 하나 열렸다.
${e}`,`다음 장으로 넘어갈 수 있게 됐다.
${e}`,`아직 초반인데도, 벌써 선택지가 늘었다.
${e}`,`드디어. ${e}`,`새로운 가능성이 열렸다.
${e}`,`선택지가 하나 더 생겼다.
${e}`,`다음 단계로 나아갈 수 있다.
${e}`,`기회의 문이 열렸다.
${e}`,`새로운 길이 보인다.
${e}`,`진행의 길이 열렸다.
${e}`])}if(f.startsWith("💸 자금이 부족합니다")){const e=oe(f);return j("noMoney",[`지갑이 얇아서 아무것도 못 했다.
${e}`,`현실 체크. 돈이 없다.
${e}`,`오늘은 참는다. 아직은 무리.
${e}`,`계산기만 두드리고 끝.
${e}`,`통장 잔고가 거짓말을 한다.
${e}`,`돈이 부족하다는 건 늘 아프다.
${e}`,`다시 모아야 한다. 조금 더.
${e}`,`욕심을 접어야 할 때.
${e}`,`현실이 무겁다.
${e}`,`내일을 기다려야 한다.
${e}`])}if(f.startsWith("✅")&&f.includes("구입했습니다")){const e=oe(f),o=f.match(/^✅\s*(.+?)\s+\d/),k=((o==null?void 0:o[1])||"").trim(),P={예금:[`일단은 안전한 데에 묶어두자.
${e}`,`불안할 땐 예금이 답이다.
${e}`,`통장에 '쿠션'을 하나 깔았다.
${e}`,`안전함이 최고의 수익률.
${e}`,`무엇보다도 평온함.
${e}`,`돈이 잠들어 있는 게 나쁘지 않다.
${e}`,`은행이 내 편이 되는 순간.
${e}`,`위험은 내일로 미뤄두자.
${e}`,`조용히 쌓이는 게 좋다.
${e}`,`불안할 때는 이게 최선.
${e}`,`돈이 안전하게 지켜지는 느낌.
${e}`,`위험 없는 선택.
${e}`],적금:[`루틴을 샀다. 매일이 쌓이면 언젠가.
${e}`,`천천히, 꾸준히. 적금은 배신을 덜 한다.
${e}`,`버티기 모드 ON.
${e}`,`작은 것들이 모여 큰 것이 된다.
${e}`,`매일의 습관이 미래를 만든다.
${e}`,`꾸준함이 무기다.
${e}`,`서두르지 않고 천천히.
${e}`,`시간이 내 편이 되는 느낌.
${e}`,`작은 투자가 큰 결과를 만든다.
${e}`,`루틴의 힘을 믿는다.
${e}`,`매일 조금씩, 그게 전부다.
${e}`,`인내심이 필요한 투자.
${e}`],국내주식:[`차트가 나를 보더니 웃는 것 같았다.
${e}`,`기대 반, 긴장 반.
${e}`,`뉴스 알람을 켜야 할 것 같다.
${e}`,`변동성의 바다에 뛰어든다.
${e}`,`심장이 뛰는 투자.
${e}`,`국장의 파도를 타본다.
${e}`,`위험과 기회가 공존한다.
${e}`,`차트 한 줄에 모든 게 달렸다.
${e}`,`투자자의 길을 걷는다.
${e}`,`시장의 심장박동을 느낀다.
${e}`,`변동성에 내 심장도 같이 흔들린다.
${e}`,`국장의 무게를 견뎌본다.
${e}`],미국주식:[`달러 환율부터 떠올랐다.
${e}`,`밤에 울리는 알림을 각오했다.
${e}`,`세계로 한 걸음.
${e}`,`시차를 극복하는 투자.
${e}`,`미장의 파도를 타본다.
${e}`,`달러의 무게를 느낀다.
${e}`,`세계 시장에 발을 담근다.
${e}`,`밤샘의 대가를 치른다.
${e}`,`환율이 내 수익을 좌우한다.
${e}`,`글로벌 투자자의 길.
${e}`,`시차 때문에 잠을 설친다.
${e}`,`미장의 리듬에 맞춘다.
${e}`],코인:[`심장 단단히 붙잡고 탔다.
${e}`,`오늘은 FOMO가 이겼다.
${e}`,`롤러코스터에 표를 끊었다.
${e}`,`폭등과 폭락 사이에서 줄타기.
${e}`,`멘탈이 시험받는 투자.
${e}`,`변동성의 극치를 경험한다.
${e}`,`코인판의 무게를 견뎌본다.
${e}`,`FOMO와 공포 사이에서.
${e}`,`디지털 자산의 세계.
${e}`,`심장이 먼저 반응한다.
${e}`,`롤러코스터의 정점에 서 있다.
${e}`,`위험을 감수하는 선택.
${e}`],빌라:[`작아도 시작은 시작이다.
${e}`,`첫 집 느낌… 마음이 조금 놓였다.
${e}`,`벽지 냄새를 상상했다.
${e}`,`첫 부동산. 작지만 소중하다.
${e}`,`집이라는 단어가 현실이 됐다.
${e}`,`내 공간이 생겼다.
${e}`,`작은 집도 집이다.
${e}`,`부동산 투자의 첫걸음.
${e}`,`작은 시작이 큰 결과를 만든다.
${e}`,`첫 집의 무게감.
${e}`,`내 이름으로 등기되는 순간.
${e}`,`부동산의 세계에 입문했다.
${e}`],오피스텔:[`현실적인 선택을 했다.
${e}`,`출근길이 짧아지는 상상을 했다.
${e}`,`관리비 생각은 내일 하자.
${e}`,`실용적인 투자.
${e}`,`출근 동선이 머리에 그려진다.
${e}`,`현실과 이상의 절충.
${e}`,`생활의 편의를 샀다.
${e}`,`도시 생활의 현실.
${e}`,`작은 공간, 큰 만족.
${e}`,`실용주의의 승리.
${e}`,`생활의 질이 올라간다.
${e}`,`현실적인 부동산 투자.
${e}`],아파트:[`꿈이 조금 더 선명해졌다.
${e}`,`안정의 상징을 손에 쥐었다.
${e}`,`괜히 뿌듯하다.
${e}`,`한국인의 꿈을 샀다.
${e}`,`안정의 상징을 손에 쥐었다.
${e}`,`부동산 투자의 정점.
${e}`,`아파트의 무게감.
${e}`,`꿈이 현실이 되는 순간.
${e}`,`안정적인 투자.
${e}`,`부동산의 대표주자.
${e}`,`가치가 보장되는 선택.
${e}`,`한국 사회의 상징.
${e}`],상가:[`유동인구가 돈이 되는 세계.
${e}`,`임차인 운이 따라주길.
${e}`,`간판 불빛을 상상했다.
${e}`,`상권의 힘을 믿는다.
${e}`,`유동인구가 내 수익이다.
${e}`,`상권 투자의 묘미.
${e}`,`임대 수익의 달콤함.
${e}`,`상가의 가치를 알아본다.
${e}`,`유동인구가 곧 돈이다.
${e}`,`상권의 파도를 타본다.
${e}`,`임차인의 성공이 내 성공.
${e}`,`상가 투자의 리스크.
${e}`],빌딩:[`스카이라인을 한 조각 샀다.
${e}`,`이건… 진짜 끝판왕 느낌이다.
${e}`,`도시가 내 편인 것 같았다.
${e}`,`부동산 투자의 정점.
${e}`,`스카이라인의 주인.
${e}`,`도시의 한 조각을 소유한다.
${e}`,`빌딩의 무게감.
${e}`,`부동산 투자의 완성.
${e}`,`도시의 심장부를 샀다.
${e}`,`스카이라인에 내 이름이.
${e}`,`부동산 투자의 궁극.
${e}`,`도시의 한 부분이 내 것이다.
${e}`]};return k&&P[k]?j(`buy_${k}`,P[k]):j("buy",[`결심하고 질렀다.
${e}`,`통장 잔고가 줄어들었다. 대신 미래를 샀다.
${e}`,`이건 소비가 아니라 투자라고… 스스로에게 말했다.
${e}`,`한 발 더 나아갔다.
${e}`,`손이 먼저 움직였다.
${e}`,`투자의 길을 걷는다.
${e}`,`미래를 위한 선택.
${e}`,`돈이 돈을 버는 구조.
${e}`,`자산을 늘리는 순간.
${e}`,`투자자의 마음가짐.
${e}`])}if(f.startsWith("💰")&&f.includes("판매했습니다")){const e=oe(f),o=f.match(/^💰\s*(.+?)\s+\d/),k=((o==null?void 0:o[1])||"").trim(),P={코인:[`손이 떨리기 전에 내렸다.
${e}`,`욕심을 접었다. 오늘은 이쯤.
${e}`,`살아남는 게 먼저다.
${e}`,`FOMO를 이겨냈다.
${e}`,`멘탈을 지키기 위해 내렸다.
${e}`,`롤러코스터에서 내렸다.
${e}`,`변동성에서 벗어났다.
${e}`,`손절의 아픔을 견뎌낸다.
${e}`,`코인판에서 살아남았다.
${e}`,`위험에서 벗어났다.
${e}`],국내주식:[`수익이든 손절이든, 결론은 냈다.
${e}`,`차트와 잠깐 이별.
${e}`,`정리하고 숨 돌린다.
${e}`,`국장의 파도에서 벗어났다.
${e}`,`차트의 무게에서 해방.
${e}`,`투자 포지션을 정리했다.
${e}`,`변동성에서 벗어났다.
${e}`,`국장의 스트레스에서 해방.
${e}`,`정리하고 다음 기회를 본다.
${e}`,`차트와의 관계를 정리했다.
${e}`],미국주식:[`시차도 같이 정리했다.
${e}`,`달러 생각은 잠시 접는다.
${e}`,`잠깐 쉬어가기로 했다.
${e}`,`미장의 밤샘에서 벗어났다.
${e}`,`시차의 스트레스에서 해방.
${e}`,`달러의 무게에서 벗어났다.
${e}`,`미장 투자를 정리했다.
${e}`,`글로벌 투자에서 잠시 휴식.
${e}`,`환율 걱정을 접었다.
${e}`,`미장의 리듬에서 벗어났다.
${e}`],예금:[`안전벨트를 풀었다.
${e}`,`현금이 필요했다.
${e}`,`안전함에서 벗어났다.
${e}`,`예금의 안정성을 포기했다.
${e}`,`현금화의 선택.
${e}`,`안전한 곳에서 돈을 꺼냈다.
${e}`,`예금의 편안함을 잃었다.
${e}`,`현금이 필요해 정리했다.
${e}`,`안전한 투자에서 벗어났다.
${e}`,`예금의 쿠션을 제거했다.
${e}`],적금:[`꾸준함을 잠깐 멈췄다.
${e}`,`루틴을 깼다. 사정이 있었다.
${e}`,`적금의 루틴을 중단했다.
${e}`,`꾸준함을 포기했다.
${e}`,`루틴의 힘을 잃었다.
${e}`,`적금의 안정성을 포기.
${e}`,`매일의 습관을 깼다.
${e}`,`적금의 꾸준함을 중단.
${e}`,`루틴 투자에서 벗어났다.
${e}`,`적금의 시간을 포기했다.
${e}`],빌라:[`정든 것과 이별.
${e}`,`현실적으로 정리했다.
${e}`,`첫 집과 작별.
${e}`,`부동산 투자를 정리했다.
${e}`,`작은 집을 내려놨다.
${e}`,`첫 부동산과 이별.
${e}`,`집의 무게에서 벗어났다.
${e}`,`부동산의 첫걸음을 정리.
${e}`,`작은 집을 포기했다.
${e}`,`첫 집의 추억을 정리.
${e}`],오피스텔:[`동선은 이제 안녕.
${e}`,`정리하고 다음으로.
${e}`,`실용적인 투자를 정리.
${e}`,`출근 동선의 편의를 포기.
${e}`,`현실적인 선택을 정리.
${e}`,`오피스텔의 실용성을 포기.
${e}`,`생활의 편의를 잃었다.
${e}`,`도시 생활의 현실을 정리.
${e}`,`작은 공간을 내려놨다.
${e}`,`현실적인 투자를 정리.
${e}`],아파트:[`꿈을 잠시 내려놓았다.
${e}`,`정리했다. 마음이 좀 쓰다.
${e}`,`한국인의 꿈을 포기.
${e}`,`안정의 상징을 내려놨다.
${e}`,`부동산 투자를 정리.
${e}`,`아파트의 무게에서 벗어났다.
${e}`,`꿈이 현실에서 멀어졌다.
${e}`,`안정적인 투자를 포기.
${e}`,`부동산의 대표주자를 정리.
${e}`,`가치 보장을 포기했다.
${e}`],상가:[`임차인 걱정이 덜었다.
${e}`,`상권이란 게 참…
${e}`,`유동인구의 기회를 포기.
${e}`,`상권 투자를 정리했다.
${e}`,`임대 수익의 달콤함을 포기.
${e}`,`상가의 가치를 내려놨다.
${e}`,`유동인구의 수익을 포기.
${e}`,`상권의 파도에서 벗어났다.
${e}`,`임차인의 성공을 포기.
${e}`,`상가 투자의 리스크를 정리.
${e}`],빌딩:[`도시 한 조각을 내려놨다.
${e}`,`정리했다. 다시 올라가면 된다.
${e}`,`부동산 투자의 정점을 포기.
${e}`,`스카이라인의 주인을 내려놨다.
${e}`,`도시의 한 조각을 포기.
${e}`,`빌딩의 무게에서 벗어났다.
${e}`,`부동산 투자의 완성을 정리.
${e}`,`도시의 심장부를 포기.
${e}`,`스카이라인에서 내 이름을 지웠다.
${e}`,`부동산 투자의 궁극을 정리.
${e}`]};return k&&P[k]?j(`sell_${k}`,P[k]):j("sell",[`정리할 건 정리했다.
${e}`,`가끔은 줄여야 산다.
${e}`,`현금이 필요했다. 그래서 팔았다.
${e}`,`미련은 접어두고 정리.
${e}`,`투자 포지션을 정리했다.
${e}`,`현금화의 선택.
${e}`,`자산을 정리하는 순간.
${e}`,`투자에서 벗어났다.
${e}`,`정리하고 다음 기회를 본다.
${e}`,`미련 없이 정리했다.
${e}`])}if(f.startsWith("❌")){const e=oe(f);return j("fail",[`오늘은 뜻대로 안 됐다.
${e}`,`계획은 늘 계획대로 안 된다.
${e}`,`한 번 더. 다음엔 될 거다.
${e}`,`벽에 부딪혔다.
${e}`,`실패는 또 다른 시작.
${e}`,`좌절은 잠시뿐.
${e}`,`다시 일어서야 한다.
${e}`,`실패도 경험이다.
${e}`,`다음 기회를 기다린다.
${e}`,`실패에서 배운다.
${e}`])}if(f.startsWith("📈")&&f.includes("발생")){const e=oe(f),o=($e=(U=f.match(/^📈\s*(.+?)\s*발생/))==null?void 0:U[1])==null?void 0:$e.trim(),P=(((he=(le=f.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))==null?void 0:le[1])==null?void 0:he.trim())||o||"").trim(),de=(nt=>{const ot=String(nt||""),X=[["빌딩","빌딩"],["상가","상가"],["아파트","아파트"],["오피스텔","오피스텔"],["빌라","빌라"],["코인","코인"],["암호","코인"],["크립토","코인"],["₿","코인"],["미국","미국주식"],["🇺🇸","미국주식"],["달러","미국주식"],["주식","국내주식"],["코스피","국내주식"],["코스닥","국내주식"],["적금","적금"],["예금","예금"],["노동","노동"],["클릭","노동"],["업무","노동"]];for(const[Re,Gs]of X)if(ot.includes(Re))return Gs;return""})(`${P} ${e}`)||"시장";window.__diaryLastMarketProduct=de,window.__diaryLastMarketName=P||e;const l={예금:[`예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.
${e}`,`안정은 조용히 돈을 번다. 오늘도 예금은 예금했다.
${e}`,`예금은 변하지 않는다. 그게 장점.
${e}`,`안정적인 투자는 조용하다.
${e}`,`예금의 평온함이 느껴진다.
${e}`,`변동성 없는 투자의 편안함.
${e}`,`예금은 늘 그 자리다.
${e}`,`안전함의 가치를 느낀다.
${e}`,`예금의 조용한 수익.
${e}`,`변동 없는 투자의 평온.
${e}`],적금:[`루틴이 흔들리는 날이 있다. 그래도 적금은 적금.
${e}`,`꾸준함의 세계에도 이벤트는 온다.
${e}`,`적금의 루틴이 흔들린다.
${e}`,`꾸준함에도 변화가 있다.
${e}`,`적금의 안정성이 시험받는다.
${e}`,`루틴 투자의 변동.
${e}`,`매일의 습관이 흔들린다.
${e}`,`적금의 꾸준함이 시험받는다.
${e}`,`시간이 만드는 투자의 변화.
${e}`,`적금의 루틴이 바뀐다.
${e}`],국내주식:[`차트가 또 날 시험한다.
${e}`,`뉴스 한 줄에 심장이 먼저 반응했다.
${e}`,`국장답게… 오늘도 변동성.
${e}`,`국장의 파도가 높아진다.
${e}`,`차트의 심장박동이 빨라진다.
${e}`,`국장의 변동성이 극대화된다.
${e}`,`뉴스 한 줄이 모든 걸 바꾼다.
${e}`,`국장의 무게가 느껴진다.
${e}`,`차트의 파도를 타야 한다.
${e}`,`국장 투자의 리스크가 커진다.
${e}`],미국주식:[`시차가 오늘따라 더 길게 느껴진다.
${e}`,`달러랑 감정은 분리… 하자.
${e}`,`미장 이벤트는 밤에 더 크게 들린다.
${e}`,`미장의 파도가 높아진다.
${e}`,`시차의 스트레스가 커진다.
${e}`,`달러의 무게가 느껴진다.
${e}`,`미장의 리듬이 바뀐다.
${e}`,`환율의 변동이 심해진다.
${e}`,`밤샘의 대가가 커진다.
${e}`,`글로벌 투자의 무게.
${e}`],코인:[`멘탈이 먼저 흔들린다. 코인은 늘 그렇다.
${e}`,`롤러코스터가 출발했다.
${e}`,`FOMO랑 손절 사이에서 줄타기.
${e}`,`코인판의 파도가 거세진다.
${e}`,`변동성의 극치를 경험한다.
${e}`,`멘탈이 시험받는 순간.
${e}`,`FOMO와 공포 사이에서.
${e}`,`롤러코스터의 정점에 서 있다.
${e}`,`코인판의 무게가 느껴진다.
${e}`,`위험을 감수하는 투자의 극치.
${e}`],빌라:[`동네 분위기가 바뀌면 빌라도 숨을 쉰다.
${e}`,`작은 집도 결국은 시장을 탄다.
${e}`,`부동산 시장의 파도가 느껴진다.
${e}`,`작은 집도 시장의 영향을 받는다.
${e}`,`부동산 투자의 변동성.
${e}`,`동네 분위기의 변화.
${e}`,`작은 집의 가치가 흔들린다.
${e}`,`부동산 시장의 리듬.
${e}`,`첫 집의 무게감이 느껴진다.
${e}`,`부동산 투자의 리스크.
${e}`],오피스텔:[`현실의 수요가 움직이는 소리가 난다.
${e}`,`출근 동선이 바뀌면 월세도 같이 흔들린다.
${e}`,`실용적인 투자도 시장의 영향을 받는다.
${e}`,`생활의 편의가 시장에 좌우된다.
${e}`,`도시 생활의 현실이 바뀐다.
${e}`,`오피스텔의 가치가 흔들린다.
${e}`,`현실적인 투자의 변동성.
${e}`,`생활의 질이 시장에 좌우된다.
${e}`,`실용주의 투자의 리스크.
${e}`,`도시 생활의 현실이 느껴진다.
${e}`],아파트:[`아파트는 '상징'이라더니, 이벤트도 상징처럼 크게 온다.
${e}`,`꿈이 흔들릴 때가 있다.
${e}`,`한국인의 꿈이 시장에 좌우된다.
${e}`,`안정의 상징이 흔들린다.
${e}`,`부동산 투자의 정점이 시험받는다.
${e}`,`아파트의 무게감이 느껴진다.
${e}`,`꿈이 현실에서 멀어질 수 있다.
${e}`,`안정적인 투자도 변동한다.
${e}`,`부동산의 대표주자가 흔들린다.
${e}`,`가치 보장이 시장에 좌우된다.
${e}`],상가:[`유동인구라는 말이 오늘은 무겁다.
${e}`,`장사라는 건 결국 파도 타기.
${e}`,`상권의 힘이 시장에 좌우된다.
${e}`,`유동인구의 수익이 변동한다.
${e}`,`상권 투자의 묘미와 리스크.
${e}`,`임대 수익의 달콤함과 쓴맛.
${e}`,`상가의 가치가 흔들린다.
${e}`,`상권의 파도가 거세진다.
${e}`,`임차인의 성공이 시장에 좌우된다.
${e}`,`상가 투자의 리스크가 커진다.
${e}`],빌딩:[`도시가 요동치면 빌딩도 요동친다.
${e}`,`스카이라인의 공기가 달라졌다.
${e}`,`부동산 투자의 정점이 시험받는다.
${e}`,`스카이라인의 주인이 시장에 좌우된다.
${e}`,`도시의 한 조각이 흔들린다.
${e}`,`빌딩의 무게감이 느껴진다.
${e}`,`부동산 투자의 완성이 시장에 좌우된다.
${e}`,`도시의 심장부가 요동친다.
${e}`,`스카이라인의 이름이 흔들린다.
${e}`,`부동산 투자의 궁극이 시험받는다.
${e}`],노동:[`업무 흐름이 바뀌면 내 하루도 바뀐다.
${e}`,`오늘은 손이 더 바빠질 것 같다.
${e}`,`일의 리듬이 바뀐다.
${e}`,`업무의 흐름이 시장에 좌우된다.
${e}`,`노동의 가치가 변동한다.
${e}`,`일의 무게감이 느껴진다.
${e}`,`업무의 스트레스가 커진다.
${e}`,`노동의 리듬이 시장에 좌우된다.
${e}`,`일의 가치가 흔들린다.
${e}`,`업무의 변동성이 느껴진다.
${e}`],시장:[`시장이 시끄럽다.
${e}`,`뉴스가 난리다.
${e}`,`분위기가 확 바뀌었다.
${e}`,`감정은 접고, 상황만 기록.
${e}`,`시장의 파도가 거세진다.
${e}`,`뉴스 한 줄이 모든 걸 바꾼다.
${e}`,`시장의 무게감이 느껴진다.
${e}`,`변동성의 극치를 경험한다.
${e}`,`시장의 리듬이 바뀐다.
${e}`,`투자의 리스크가 커진다.
${e}`]};return j(`market_${de}`,l[de]||l.시장)}if(f.startsWith("📉")&&f.includes("종료")){const e=window.__diaryLastMarketProduct||"시장",o=window.__diaryLastMarketName||"",k={코인:[`심장이 겨우 진정됐다. (${o||"이벤트 종료"})`,`코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.
${o||""}`.trim(),`롤러코스터가 멈췄다. 잠시만.
${o||""}`.trim(),`FOMO의 파도가 잠잠해졌다.
${o||""}`.trim(),`변동성의 폭풍이 지나갔다.
${o||""}`.trim(),`멘탈이 겨우 회복됐다.
${o||""}`.trim(),`코인판의 소란이 잠잠해졌다.
${o||""}`.trim(),`위험의 파도가 잠잠해졌다.
${o||""}`.trim()],국내주식:[`차트가 잠깐 조용해졌다.
${o||""}`.trim(),`국장 소란 종료. 숨 한 번.
${o||""}`.trim(),`뉴스의 파도가 잠잠해졌다.
${o||""}`.trim(),`차트의 심장박동이 안정됐다.
${o||""}`.trim(),`국장의 변동성이 잠잠해졌다.
${o||""}`.trim(),`투자자의 심장이 진정됐다.
${o||""}`.trim(),`국장의 무게에서 벗어났다.
${o||""}`.trim(),`차트의 파도가 잠잠해졌다.
${o||""}`.trim()],미국주식:[`밤이 지나갔다.
${o||""}`.trim(),`미장 이벤트 종료. 알림도 잠잠.
${o||""}`.trim(),`시차의 스트레스가 사라졌다.
${o||""}`.trim(),`달러의 무게에서 벗어났다.
${o||""}`.trim(),`미장의 파도가 잠잠해졌다.
${o||""}`.trim(),`밤샘의 대가가 끝났다.
${o||""}`.trim(),`환율의 변동이 잠잠해졌다.
${o||""}`.trim(),`글로벌 투자의 무게에서 벗어났다.
${o||""}`.trim()],부동산:[`동네가 다시 평소 얼굴을 찾았다.
${o||""}`.trim(),`부동산 시장이 안정됐다.
${o||""}`.trim(),`동네 분위기가 평소로 돌아왔다.
${o||""}`.trim(),`부동산 투자의 변동성이 잠잠해졌다.
${o||""}`.trim(),`집의 무게에서 벗어났다.
${o||""}`.trim(),`부동산 시장의 파도가 잠잠해졌다.
${o||""}`.trim(),`부동산 투자의 리스크가 줄어들었다.
${o||""}`.trim(),`동네가 평소의 모습을 찾았다.
${o||""}`.trim()],시장:["소란이 잠잠해졌다.","폭풍 지나가고 고요.","이제 평소대로.","시장의 파도가 잠잠해졌다.","뉴스의 소란이 끝났다.","변동성이 안정됐다.","투자의 리스크가 줄어들었다.","시장의 무게에서 벗어났다."]},ye=["빌라","오피스텔","아파트","상가","빌딩"].includes(e)?"부동산":e,de=j(`marketEnd_${ye}`,k[ye]||k.시장);return window.__diaryLastMarketProduct=null,window.__diaryLastMarketName=null,de}if(f.startsWith("💡")){const e=oe(f),o=window.__diaryLastMarketProduct||"",k=window.__diaryLastMarketName||"",P={코인:[`메모(코인): 멘탈 관리가 수익률이다.
${e}`,`코인 메모.
${k?`(${k})
`:""}${e}`.trim(),`코인 투자 노트: 변동성을 견뎌야 한다.
${e}`,`코인 기록: FOMO를 이겨내야 한다.
${e}`,`코인 메모: 롤러코스터의 정점에서 내려야 한다.
${e}`,`코인 투자 기록: 위험을 감수하는 선택.
${e}`],국내주식:[`메모(국장): 뉴스 한 줄에 흔들리지 말 것.
${e}`,`국장 메모.
${k?`(${k})
`:""}${e}`.trim(),`국장 투자 노트: 차트의 파도를 타야 한다.
${e}`,`국장 기록: 변동성을 견뎌야 한다.
${e}`,`국장 메모: 투자자의 심장이 시험받는다.
${e}`,`국장 투자 기록: 국장의 무게를 견뎌야 한다.
${e}`],미국주식:[`메모(미장): 시차 + 환율 = 체력.
${e}`,`미장 메모.
${k?`(${k})
`:""}${e}`.trim(),`미장 투자 노트: 밤샘의 대가를 치러야 한다.
${e}`,`미장 기록: 달러의 무게를 견뎌야 한다.
${e}`,`미장 메모: 시차의 스트레스를 견뎌야 한다.
${e}`,`미장 투자 기록: 글로벌 투자의 무게.
${e}`],예금:[`메모(예금): 조용히 이기는 쪽.
${e}`,`예금 투자 노트: 안정이 최고의 수익률.
${e}`,`예금 기록: 변동성 없는 투자의 편안함.
${e}`,`예금 메모: 안전함의 가치.
${e}`,`예금 투자 기록: 조용한 수익.
${e}`],적금:[`메모(적금): 루틴이 무기.
${e}`,`적금 투자 노트: 꾸준함이 무기다.
${e}`,`적금 기록: 매일의 습관이 미래를 만든다.
${e}`,`적금 메모: 시간이 내 편이 되는 투자.
${e}`,`적금 투자 기록: 인내심이 필요한 투자.
${e}`],부동산:[`메모(부동산): 공실은 악몽, 임차인은 복.
${e}`,`동네 메모.
${k?`(${k})
`:""}${e}`.trim(),`부동산 투자 노트: 집의 무게감을 견뎌야 한다.
${e}`,`부동산 기록: 시장의 파도를 타야 한다.
${e}`,`부동산 메모: 부동산 투자의 리스크.
${e}`,`부동산 투자 기록: 동네 분위기의 변화.
${e}`],노동:[`메모(노동): 버티는 사람이 이긴다.
${e}`,`노동 노트: 일의 무게감을 견뎌야 한다.
${e}`,`노동 기록: 업무의 리듬이 시장에 좌우된다.
${e}`,`노동 메모: 일의 가치가 변동한다.
${e}`,`노동 투자 기록: 업무의 스트레스를 견뎌야 한다.
${e}`]},de=["빌라","오피스텔","아파트","상가","빌딩"].includes(o)?"부동산":o;return de&&P[de]?j(`memo_${de}`,P[de]):j("memo",[`메모.
${e}`,`적어둔다.
${e}`,`까먹기 전에 기록.
${e}`,`투자 노트에 기록.
${e}`,`기억해둘 것.
${e}`,`나중을 위해 기록.
${e}`])}if(f.startsWith("🎁")&&f.includes("해금")){const e=oe(f),o=((Se=(Ie=f.match(/해금:\s*(.+)$/))==null?void 0:Ie[1])==null?void 0:Se.trim())||"",P=(de=>{const l=String(de||"");return l.includes("예금")?"예금":l.includes("적금")?"적금":l.includes("미국주식")||l.includes("미장")||l.includes("🇺🇸")?"미국주식":l.includes("코인")||l.includes("₿")||l.includes("암호")?"코인":l.includes("주식")?"국내주식":l.includes("빌딩")?"빌딩":l.includes("상가")?"상가":l.includes("아파트")?"아파트":l.includes("오피스텔")?"오피스텔":l.includes("빌라")?"빌라":l.includes("월세")||l.includes("부동산")?"부동산":l.includes("클릭")||l.includes("노동")||l.includes("업무")||l.includes("CEO")||l.includes("커리어")?"노동":""})(`${o} ${e}`)||"기본",ye={노동:[`일을 '덜 힘들게' 만드는 방법이 생겼다.
${o||e}`,`업무 스킬이 하나 늘었다.
${o||e}`,`손끝이 더 빨라질 준비.
${o||e}`,`일하는 방식이 개선될 것 같다.
${o||e}`,`업무 효율이 올라갈 것 같다.
${o||e}`,`노동의 질이 향상될 것 같다.
${o||e}`,`일하는 능력이 강화됐다.
${o||e}`,`업무 스킬의 진화.
${o||e}`],예금:[`예금이 더 조용히 벌어다 주겠지.
${o||e}`,`안정 쪽에 옵션이 하나 추가됐다.
${o||e}`,`예금의 수익률이 올라갈 것 같다.
${o||e}`,`안정적인 투자가 더 강해진다.
${o||e}`,`예금의 가치가 상승할 것 같다.
${o||e}`,`안전한 투자의 힘이 커진다.
${o||e}`,`예금의 편안함이 더해진다.
${o||e}`,`안정적인 투자의 진화.
${o||e}`],적금:[`루틴 강화 카드가 열렸다.
${o||e}`,`꾸준함을 돕는 장치가 생겼다.
${o||e}`,`적금의 루틴이 강화됐다.
${o||e}`,`꾸준함의 힘이 커진다.
${o||e}`,`매일의 습관이 더 강해진다.
${o||e}`,`적금의 시간 가치가 올라간다.
${o||e}`,`루틴 투자의 힘이 커진다.
${o||e}`,`꾸준함의 진화.
${o||e}`],국내주식:[`차트 싸움에 새 무기가 생겼다.
${o||e}`,`국장 대응력이 올라갈 것 같다.
${o||e}`,`국장 투자의 힘이 커진다.
${o||e}`,`차트의 파도를 더 잘 탈 수 있다.
${o||e}`,`국장의 변동성에 대응할 수 있다.
${o||e}`,`투자자의 능력이 강화됐다.
${o||e}`,`국장 투자의 진화.
${o||e}`,`차트 싸움의 무기가 강화됐다.
${o||e}`],미국주식:[`시차를 버틸 장비가 하나 생겼다.
${o||e}`,`달러 쪽 옵션이 열린다.
${o||e}`,`미장 투자의 힘이 커진다.
${o||e}`,`시차의 스트레스를 견딜 수 있다.
${o||e}`,`달러의 무게를 더 잘 견딜 수 있다.
${o||e}`,`글로벌 투자의 능력이 강화됐다.
${o||e}`,`미장 투자의 진화.
${o||e}`,`밤샘의 대가를 더 잘 견딜 수 있다.
${o||e}`],코인:[`코인판에서 버틸 도구가 생겼다.
${o||e}`,`멘탈을 지키는 업그레이드…였으면.
${o||e}`,`코인 투자의 힘이 커진다.
${o||e}`,`변동성을 더 잘 견딜 수 있다.
${o||e}`,`FOMO를 더 잘 이겨낼 수 있다.
${o||e}`,`롤러코스터를 더 잘 탈 수 있다.
${o||e}`,`코인 투자의 진화.
${o||e}`,`멘탈 관리의 도구가 생겼다.
${o||e}`],빌라:[`빌라 운영이 조금은 편해질지도.
${o||e}`,`첫 집의 가치가 올라간다.
${o||e}`,`부동산 투자의 첫걸음이 강화됐다.
${o||e}`,`작은 집의 수익이 올라간다.
${o||e}`,`부동산 투자의 기초가 강화됐다.
${o||e}`,`첫 집의 무게감이 줄어든다.
${o||e}`,`부동산 투자의 진화.
${o||e}`,`작은 집의 가치가 상승한다.
${o||e}`],오피스텔:[`오피스텔 쪽이 한 단계 나아간다.
${o||e}`,`실용적인 투자가 강화됐다.
${o||e}`,`생활의 편의가 더해진다.
${o||e}`,`도시 생활의 질이 올라간다.
${o||e}`,`현실적인 투자의 힘이 커진다.
${o||e}`,`오피스텔의 가치가 상승한다.
${o||e}`,`실용주의 투자의 진화.
${o||e}`,`생활의 편의가 강화됐다.
${o||e}`],아파트:[`아파트는 디테일에서 돈이 난다.
${o||e}`,`한국인의 꿈이 더 가까워진다.
${o||e}`,`안정의 상징이 강화됐다.
${o||e}`,`부동산 투자의 정점이 올라간다.
${o||e}`,`아파트의 가치가 상승한다.
${o||e}`,`안정적인 투자의 힘이 커진다.
${o||e}`,`부동산 투자의 진화.
${o||e}`,`꿈이 현실에 더 가까워진다.
${o||e}`],상가:[`상가는 세팅이 반이다.
${o||e}`,`상권 투자의 힘이 커진다.
${o||e}`,`유동인구의 수익이 올라간다.
${o||e}`,`임대 수익의 달콤함이 커진다.
${o||e}`,`상가의 가치가 상승한다.
${o||e}`,`상권 투자의 진화.
${o||e}`,`임차인의 성공이 내 성공이 된다.
${o||e}`,`상권의 힘이 강화됐다.
${o||e}`],빌딩:[`빌딩은 관리가 곧 수익이다.
${o||e}`,`부동산 투자의 궁극이 강화됐다.
${o||e}`,`스카이라인의 주인이 강해진다.
${o||e}`,`도시의 한 조각이 더 가치있어진다.
${o||e}`,`빌딩의 무게감이 줄어든다.
${o||e}`,`부동산 투자의 완성이 올라간다.
${o||e}`,`스카이라인의 가치가 상승한다.
${o||e}`,`부동산 투자의 진화.
${o||e}`],부동산:[`부동산 운영에 옵션이 하나 추가됐다.
${o||e}`,`월세를 '조금 더' 만들 방법.
${o||e}`,`부동산 투자의 힘이 커진다.
${o||e}`,`집의 가치가 올라간다.
${o||e}`,`부동산 시장의 파도를 더 잘 탈 수 있다.
${o||e}`,`부동산 투자의 리스크가 줄어든다.
${o||e}`,`부동산 투자의 진화.
${o||e}`,`집의 무게감이 줄어든다.
${o||e}`],기본:[`새로운 방법이 보였다.
${o||e}`,`선택지가 늘었다.
${o||e}`,`이제부터가 시작일지도.
${o||e}`,`기회의 문이 열렸다.
${o||e}`,`새로운 가능성이 생겼다.
${o||e}`,`진화의 순간.
${o||e}`,`능력이 강화됐다.
${o||e}`,`다음 단계로 나아갈 수 있다.
${o||e}`]};return j(`upgradeUnlock_${P}`,ye[P]||ye.기본)}if(f.startsWith("✅")&&f.includes("구매!")){const e=oe(f),o=f.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/),k=((o==null?void 0:o[1])||"").trim(),P=((o==null?void 0:o[2])||"").trim(),de=(ot=>{const X=String(ot||"");return X.includes("예금")?"예금":X.includes("적금")?"적금":X.includes("미국주식")||X.includes("미장")||X.includes("🇺🇸")?"미국주식":X.includes("코인")||X.includes("₿")||X.includes("암호")?"코인":X.includes("주식")?"국내주식":X.includes("빌딩")?"빌딩":X.includes("상가")?"상가":X.includes("아파트")?"아파트":X.includes("오피스텔")?"오피스텔":X.includes("빌라")?"빌라":X.includes("월세")||X.includes("부동산")?"부동산":X.includes("클릭")||X.includes("노동")||X.includes("업무")||X.includes("CEO")||X.includes("커리어")?"노동":""})(`${k} ${P} ${e}`)||"기본",l=[k,P].filter(Boolean).join(" — ")||e,nt={노동:[`일하는 방식이 바뀌었다.
${l}`,`업무 스킬을 장착했다.
${l}`,`손이 더 빨라질 거다. 아마도.
${l}`,`일하는 능력이 강화됐다.
${l}`,`업무 효율이 올라갔다.
${l}`,`노동의 질이 향상됐다.
${l}`,`일하는 방식의 진화.
${l}`,`업무 스킬의 강화.
${l}`],예금:[`예금은 조용히 강해진다.
${l}`,`안정 쪽을 더 단단히 했다.
${l}`,`예금의 수익률이 올라갔다.
${l}`,`안정적인 투자가 강화됐다.
${l}`,`예금의 가치가 상승했다.
${l}`,`안전한 투자의 힘이 커졌다.
${l}`,`예금의 편안함이 더해졌다.
${l}`,`안정적인 투자의 진화.
${l}`],적금:[`루틴을 업그레이드했다.
${l}`,`꾸준함에 부스터 하나.
${l}`,`적금의 루틴이 강화됐다.
${l}`,`꾸준함의 힘이 커졌다.
${l}`,`매일의 습관이 더 강해졌다.
${l}`,`적금의 시간 가치가 올라갔다.
${l}`,`루틴 투자의 힘이 커졌다.
${l}`,`꾸준함의 진화.
${l}`],국내주식:[`차트 싸움에 장비를 추가했다.
${l}`,`국장 대응력 상승.
${l}`,`국장 투자의 힘이 커졌다.
${l}`,`차트의 파도를 더 잘 탈 수 있다.
${l}`,`국장의 변동성에 대응할 수 있다.
${l}`,`투자자의 능력이 강화됐다.
${l}`,`국장 투자의 진화.
${l}`,`차트 싸움의 무기가 강화됐다.
${l}`],미국주식:[`시차를 버틸 장비 장착.
${l}`,`달러 쪽을 조금 더 믿어보기로.
${l}`,`미장 투자의 힘이 커졌다.
${l}`,`시차의 스트레스를 견딜 수 있다.
${l}`,`달러의 무게를 더 잘 견딜 수 있다.
${l}`,`글로벌 투자의 능력이 강화됐다.
${l}`,`미장 투자의 진화.
${l}`,`밤샘의 대가를 더 잘 견딜 수 있다.
${l}`],코인:[`코인판에서 살아남을 장비.
${l}`,`멘탈 보호 장치…였으면.
${l}`,`코인 투자의 힘이 커졌다.
${l}`,`변동성을 더 잘 견딜 수 있다.
${l}`,`FOMO를 더 잘 이겨낼 수 있다.
${l}`,`롤러코스터를 더 잘 탈 수 있다.
${l}`,`코인 투자의 진화.
${l}`,`멘탈 관리의 도구가 생겼다.
${l}`],빌라:[`빌라 운영을 손봤다.
${l}`,`첫 집의 가치가 올라갔다.
${l}`,`부동산 투자의 첫걸음이 강화됐다.
${l}`,`작은 집의 수익이 올라갔다.
${l}`,`부동산 투자의 기초가 강화됐다.
${l}`,`첫 집의 무게감이 줄어들었다.
${l}`,`부동산 투자의 진화.
${l}`,`작은 집의 가치가 상승했다.
${l}`],오피스텔:[`오피스텔 쪽을 업그레이드했다.
${l}`,`실용적인 투자가 강화됐다.
${l}`,`생활의 편의가 더해졌다.
${l}`,`도시 생활의 질이 올라갔다.
${l}`,`현실적인 투자의 힘이 커졌다.
${l}`,`오피스텔의 가치가 상승했다.
${l}`,`실용주의 투자의 진화.
${l}`,`생활의 편의가 강화됐다.
${l}`],아파트:[`아파트는 디테일.
${l}`,`한국인의 꿈이 더 가까워졌다.
${l}`,`안정의 상징이 강화됐다.
${l}`,`부동산 투자의 정점이 올라갔다.
${l}`,`아파트의 가치가 상승했다.
${l}`,`안정적인 투자의 힘이 커졌다.
${l}`,`부동산 투자의 진화.
${l}`,`꿈이 현실에 더 가까워졌다.
${l}`],상가:[`상가는 세팅이 반이다.
${l}`,`상권 투자의 힘이 커졌다.
${l}`,`유동인구의 수익이 올라갔다.
${l}`,`임대 수익의 달콤함이 커졌다.
${l}`,`상가의 가치가 상승했다.
${l}`,`상권 투자의 진화.
${l}`,`임차인의 성공이 내 성공이 된다.
${l}`,`상권의 힘이 강화됐다.
${l}`],빌딩:[`빌딩은 관리가 수익이다.
${l}`,`부동산 투자의 궁극이 강화됐다.
${l}`,`스카이라인의 주인이 강해졌다.
${l}`,`도시의 한 조각이 더 가치있어졌다.
${l}`,`빌딩의 무게감이 줄어들었다.
${l}`,`부동산 투자의 완성이 올라갔다.
${l}`,`스카이라인의 가치가 상승했다.
${l}`,`부동산 투자의 진화.
${l}`],부동산:[`월세 쪽을 손봤다.
${l}`,`부동산 운영이 한 단계 올라갔다.
${l}`,`부동산 투자의 힘이 커졌다.
${l}`,`집의 가치가 올라갔다.
${l}`,`부동산 시장의 파도를 더 잘 탈 수 있다.
${l}`,`부동산 투자의 리스크가 줄어들었다.
${l}`,`부동산 투자의 진화.
${l}`,`집의 무게감이 줄어들었다.
${l}`],기본:[`필요한 걸 갖췄다.
${e}`,`업그레이드 완료. 조금은 편해지겠지.
${e}`,`나 자신에게 투자.
${e}`,`능력이 강화됐다.
${e}`,`진화의 순간.
${e}`,`기회를 잡았다.
${e}`,`다음 단계로 나아갔다.
${e}`,`투자의 힘이 커졌다.
${e}`]};return j(`upgradeBuy_${de}`,nt[de]||nt.기본)}if(f.startsWith("⚠️")){const e=oe(f);return j("warn",[`찜찜한 기분이 남았다.
${e}`,`뭔가 삐끗한 느낌.
${e}`,`일단 기록만 남긴다.
${e}`,`뭔가 이상한 느낌.
${e}`,`불안한 기분이 든다.
${e}`,`주의가 필요할 것 같다.
${e}`,`뭔가 잘못된 것 같다.
${e}`,`경고의 신호가 느껴진다.
${e}`])}const se=oe(f);return j("default",[se,`그냥 적어둔다.
${se}`,`오늘의 기록.
${se}`,`아무튼, ${se}`,`일단 기록.
${se}`,`메모해둔다.
${se}`,`기억해둘 것.
${se}`,`나중을 위해 기록.
${se}`,`적어두는 게 좋겠다.
${se}`,`기록에 남긴다.
${se}`])}r();const d=m(t);if(!d)return;const p=document.createElement("p"),y=d.replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`),R=(y[0]??"").trim(),E=y.slice(1).map(g=>String(g).trim()).filter(Boolean),h=`<span class="diary-voice">${R}</span>`+(E.length?`
<span class="diary-info">${E.join(`
`)}</span>`:"");p.innerHTML=`<span class="diary-time">${i}</span>${h}`,_o.prepend(p)}function kn(){return M+_+x+H+K}function rt(){return D+F+A+O+N}function Q(t){const n={deposit:()=>!0,savings:()=>M>=1,bond:()=>_>=1,usStock:()=>x>=1,crypto:()=>H>=1,villa:()=>K>=1,officetel:()=>D>=1,apartment:()=>F>=1,shop:()=>A>=1,building:()=>O>=1,tower:()=>G>=9&&N>=1};return n[t]?n[t]():!1}function Te(t){const c={deposit:{next:"savings",msg:"🔓 적금이 해금되었습니다!"},savings:{next:"bond",msg:"🔓 국내주식이 해금되었습니다!"},bond:{next:"usStock",msg:"🔓 미국주식이 해금되었습니다!"},usStock:{next:"crypto",msg:"🔓 코인이 해금되었습니다!"},crypto:{next:"villa",msg:"🔓 빌라가 해금되었습니다!"},villa:{next:"officetel",msg:"🔓 오피스텔이 해금되었습니다!"},officetel:{next:"apartment",msg:"🔓 아파트가 해금되었습니다!"},apartment:{next:"shop",msg:"🔓 상가가 해금되었습니다!"},shop:{next:"building",msg:"🔓 빌딩이 해금되었습니다!"},building:{next:"tower",msg:"🔓 서울타워가 해금되었습니다!"}}[t];if(!c||gn[c.next]||!Q(c.next))return;const s={savings:_,bond:x,usStock:H,crypto:K,villa:D,officetel:F,apartment:A,shop:O,building:N,tower:ke};if(s[c.next]!==void 0&&s[c.next]>0){gn[c.next]=!0;return}gn[c.next]=!0,C(c.msg);const a=c.next+"Item",i=document.getElementById(a);i&&(i.classList.add("just-unlocked"),setTimeout(()=>i.classList.remove("just-unlocked"),1e3))}function Dt(t,n){let s=b[t]*n;const a=hn(t,"financial");return s*=a,s}function Ft(t,n){let s=v[t]*n;const a=hn(t,"property");return s*=a,s}function ft(){const t=Dt("deposit",M)+Dt("savings",_)+Dt("bond",x)+Dt("usStock",H)+Dt("crypto",K),n=Ft("villa",D)+Ft("officetel",F)+Ft("apartment",A)+Ft("shop",O)+Ft("building",N);return(t+n*Ee)*Qt}function ts(){const t=Un[Math.floor(Math.random()*Un.length)];ie=t,xe=Date.now()+t.duration,C(`📈 ${t.name} 발생! ${Math.floor(t.duration/1e3)}초간 지속`),C(`💡 ${t.description}`),ns(t)}function ns(t){const n=document.createElement("div");n.style.cssText=`
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${t.color};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;let c="";if(t.effects.financial){const a=Object.entries(t.effects.financial).filter(([i,r])=>r!==1).map(([i,r])=>{const m={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인"},d=Math.round(r*10)/10;return`${m[i]} x${String(d).replace(/\.0$/,"")}`});a.length>0&&(c+=`💰 ${a.join(", ")}
`)}if(t.effects.property){const a=Object.entries(t.effects.property).filter(([i,r])=>r!==1).map(([i,r])=>{const m={villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"},d=Math.round(r*10)/10;return`${m[i]} x${String(d).replace(/\.0$/,"")}`});a.length>0&&(c+=`🏠 ${a.join(", ")}`)}const s=Math.floor((t.duration??0)/1e3);n.innerHTML=`
        <div style="font-size: 16px; margin-bottom: 6px;">📈 ${t.name}</div>
        <div style="font-size: 11px; opacity: 0.95; margin-bottom: 8px;">지속: ${s}초</div>
        <div style="font-size: 12px; opacity: 0.9;">${t.description}</div>
        ${c?`<div style="font-size: 11px; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">${c}</div>`:""}
      `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},5e3)}function os(){xe>0&&Date.now()>=xe&&(ie=null,xe=0,C("📉 시장 이벤트가 종료되었습니다."))}function hn(t,n){if(!ie||!ie.effects)return 1;const c=ie.effects[n];return!c||!c[t]?1:c[t]}function ss(){Xe.forEach(t=>{!t.unlocked&&t.condition()&&(t.unlocked=!0,cs(t),C(`🏆 업적 달성: ${t.name} - ${t.desc}`))})}function cs(t){const n=document.createElement("div");n.style.cssText=`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #000;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: bold;
        z-index: 2000;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: achievementPop 1s ease-out;
      `,n.innerHTML=`
        <div style="font-size: 24px; margin-bottom: 10px;">🏆</div>
        <div style="font-size: 18px; margin-bottom: 5px;">${t.name}</div>
        <div style="font-size: 14px; opacity: 0.8;">${t.desc}</div>
      `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},3e3)}function Xn(){let t=0;for(const[n,c]of Object.entries(J))if(!(c.purchased||c.unlocked))try{c.unlockCondition()&&(c.unlocked=!0,t++,C(`🎁 새 업그레이드 해금: ${c.name}`))}catch(s){console.error(`업그레이드 해금 조건 체크 실패 (${n}):`,s)}t>0&&gt()}function as(){document.querySelectorAll(".upgrade-item").forEach(n=>{const c=n.dataset.upgradeId,s=J[c];s&&!s.purchased&&($>=s.cost?n.classList.add("affordable"):n.classList.remove("affordable"))})}function is(){document.querySelectorAll(".upgrade-progress").forEach(n=>{const c=n.closest(".upgrade-item");!c||!c.dataset.upgradeId||(Object.entries(J).filter(([a,i])=>i.category==="labor"&&!i.unlocked&&!i.purchased).map(([a,i])=>{var p;const r=i.unlockCondition.toString(),m=r.match(/totalClicks\s*>=\s*(\d+)/);if(m)return{id:a,requiredClicks:parseInt(m[1]),upgrade:i};const d=r.match(/careerLevel\s*>=\s*(\d+)/);return d?{id:a,requiredClicks:((p=vt[parseInt(d[1])])==null?void 0:p.requiredClicks)||1/0,upgrade:i}:null}).filter(a=>a!==null).sort((a,i)=>a.requiredClicks-i.requiredClicks),n.textContent="")})}function gt(){const t=document.getElementById("upgradeList"),n=document.getElementById("upgradeCount");if(!t||!n)return;const c=Object.entries(J).filter(([s,a])=>a.unlocked&&!a.purchased);if(n.textContent=`(${c.length})`,c.length===0){t.innerHTML="";return}t.innerHTML="",console.log(`🔄 Regenerating upgrade list with ${c.length} items`),c.forEach(([s,a])=>{const i=document.createElement("div");i.className="upgrade-item",i.dataset.upgradeId=s,$>=a.cost&&i.classList.add("affordable");const r=document.createElement("div");r.className="upgrade-icon",r.textContent=a.icon;const m=document.createElement("div");m.className="upgrade-info";const d=document.createElement("div");d.className="upgrade-name",d.textContent=a.name;const p=document.createElement("div");p.className="upgrade-desc",p.textContent=a.desc;const I=ue(a.cost);if(a.category==="labor"&&a.unlockCondition)try{const R=document.createElement("div");R.className="upgrade-progress",R.style.fontSize="11px",R.style.color="var(--muted)",R.style.marginTop="4px";const E=Object.entries(J).filter(([h,g])=>g.category==="labor"&&!g.unlocked&&!g.purchased).map(([h,g])=>{const w=g.unlockCondition.toString().match(/totalClicks\s*>=\s*(\d+)/);return w?{id:h,requiredClicks:parseInt(w[1]),upgrade:g}:null}).filter(h=>h!==null).sort((h,g)=>h.requiredClicks-g.requiredClicks)}catch{}m.appendChild(d),m.appendChild(p);const y=document.createElement("div");y.className="upgrade-status",y.textContent=I,y.style.animation="none",y.style.background="rgba(94, 234, 212, 0.12)",y.style.color="var(--accent)",y.style.border="1px solid rgba(94, 234, 212, 0.25)",y.style.borderRadius="999px",i.appendChild(r),i.appendChild(m),i.appendChild(y),i.addEventListener("click",R=>{R.stopPropagation(),console.log("🖱️ Upgrade item clicked!",s),console.log("Event target:",R.target),console.log("Current item:",i),console.log("Dataset:",i.dataset),rs(s)},!1),i.addEventListener("mousedown",R=>{console.log("🖱️ Mousedown detected on upgrade:",s)}),t.appendChild(i),console.log(`✅ Upgrade item created and appended: ${s}`,i)})}function rs(t){console.log("=== PURCHASE UPGRADE DEBUG ==="),console.log("Attempting to purchase:",t),console.log("Current cash:",$);const n=J[t];if(!n){console.error("업그레이드를 찾을 수 없습니다:",t),console.log("Available upgrade IDs:",Object.keys(J));return}if(console.log("Upgrade found:",{name:n.name,cost:n.cost,unlocked:n.unlocked,purchased:n.purchased}),n.purchased){C("❌ 이미 구매한 업그레이드입니다."),console.log("Already purchased");return}if($<n.cost){C(`💸 자금이 부족합니다. (필요: ${ue(n.cost)})`),console.log("Not enough cash. Need:",n.cost,"Have:",$);return}console.log("Purchase successful! Applying effect..."),$-=n.cost,n.purchased=!0;try{n.effect(),C(`✅ ${n.name} 구매! ${n.desc}`),console.log("Effect applied successfully")}catch(c){console.error(`업그레이드 효과 적용 실패 (${t}):`,c),C(`⚠️ ${n.name} 구매했지만 효과 적용 중 오류 발생`)}console.log("New cash:",$),console.log("=============================="),gt(),re(),Ut()}function Ot(){const t=Nt();return Math.floor(1e4*t.multiplier*ge)}function Nt(){return vt[G]}function bn(){return G<vt.length-1?vt[G+1]:null}function Zn(){const t=bn();if(t&&ae>=t.requiredClicks){G+=1;const n=Nt(),c=Ot();C(`🎉 ${n.name}으로 승진했습니다! (클릭당 ${T(c)}원)`),ve&&(ve.style.transition="opacity 0.3s ease-out",ve.style.opacity="0.5",setTimeout(()=>{n.bgImage?(ve.style.transition="background-image 0.8s ease-in-out, opacity 0.5s ease-in",ve.style.backgroundImage=`url('${n.bgImage}')`):(ve.style.transition="background-image 0.8s ease-in-out, opacity 0.5s ease-in",ve.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),ve.style.opacity="1"},300));const s=document.querySelector(".career-card");s&&(s.style.animation="none",setTimeout(()=>{s.style.animation="careerPromotion 0.6s ease-out"},10));const a=document.getElementById("currentCareer");return a&&a.setAttribute("aria-label",`${n.name}으로 승진했습니다. 클릭당 ${T(c)}원`),console.log("=== PROMOTION DEBUG ==="),console.log("Promoted to:",n.name),console.log("New career level:",G),console.log("New multiplier:",n.multiplier),console.log("Click income:",T(c)),console.log("======================"),!0}return!1}function ls(){const t=Z,n=fe==="buy",c=n&&$>=z("deposit",M,t),s=n&&$>=z("savings",_,t),a=n&&$>=z("bond",x,t),i=n&&$>=z("usStock",H,t),r=n&&$>=z("crypto",K,t);Ct.classList.toggle("affordable",c),Ct.classList.toggle("unaffordable",n&&!c),It.classList.toggle("affordable",s),It.classList.toggle("unaffordable",n&&!s),Et.classList.toggle("affordable",a),Et.classList.toggle("unaffordable",n&&!a),Lt.classList.toggle("affordable",i),Lt.classList.toggle("unaffordable",n&&!i),St.classList.toggle("affordable",r),St.classList.toggle("unaffordable",n&&!r);const m=n&&$>=Y("villa",D,t),d=n&&$>=Y("officetel",F,t),p=n&&$>=Y("apartment",A,t),I=n&&$>=Y("shop",O,t),y=n&&$>=Y("building",N,t);if(xt.classList.toggle("affordable",m),xt.classList.toggle("unaffordable",n&&!m),Tt.classList.toggle("affordable",d),Tt.classList.toggle("unaffordable",n&&!d),Mt.classList.toggle("affordable",p),Mt.classList.toggle("unaffordable",n&&!p),Pt.classList.toggle("affordable",I),Pt.classList.toggle("unaffordable",n&&!I),Rt.classList.toggle("affordable",y),Rt.classList.toggle("unaffordable",n&&!y),ut){const R=st.tower,E=n&&$>=R&&Q("tower");ut.classList.toggle("affordable",E),ut.classList.toggle("unaffordable",n&&(!E||!Q("tower"))),ut.disabled=fe==="sell"||!Q("tower")}}function ds(){const t=Z,n=fe==="buy",c=document.getElementById("depositItem"),s=document.getElementById("savingsItem"),a=document.getElementById("bondItem"),i=document.getElementById("usStockItem"),r=document.getElementById("cryptoItem");c.classList.toggle("affordable",n&&$>=z("deposit",M,t)),s.classList.toggle("affordable",n&&$>=z("savings",_,t)),a.classList.toggle("affordable",n&&$>=z("bond",x,t)),i.classList.toggle("affordable",n&&$>=z("usStock",H,t)),r.classList.toggle("affordable",n&&$>=z("crypto",K,t));const m=document.getElementById("villaItem"),d=document.getElementById("officetelItem"),p=document.getElementById("aptItem"),I=document.getElementById("shopItem"),y=document.getElementById("buildingItem");m.classList.toggle("affordable",n&&$>=Y("villa",D,t)),d.classList.toggle("affordable",n&&$>=Y("officetel",F,t)),p.classList.toggle("affordable",n&&$>=Y("apartment",A,t)),I.classList.toggle("affordable",n&&$>=Y("shop",O,t)),y.classList.toggle("affordable",n&&$>=Y("building",N,t));const R=document.getElementById("towerItem");if(R){const E=st.tower,h=n&&$>=E&&Q("tower");R.classList.toggle("affordable",h),R.classList.toggle("unaffordable",n&&(!h||!Q("tower")))}}function Ut(){const t={cash:$,totalClicks:ae,totalLaborIncome:Ge,careerLevel:G,clickMultiplier:ge,rentMultiplier:Ee,autoClickEnabled:Jt,managerLevel:pn,rentCost:On,mgrCost:Nn,deposits:M,savings:_,bonds:x,usStocks:H,cryptos:K,depositsLifetime:Ae,savingsLifetime:De,bondsLifetime:Fe,usStocksLifetime:Oe,cryptosLifetime:Ne,villas:D,officetels:F,apartments:A,shops:O,buildings:N,towers:ke,villasLifetime:Ue,officetelsLifetime:qe,apartmentsLifetime:Ke,shopsLifetime:Ve,buildingsLifetime:He,upgradesV2:Object.fromEntries(Object.entries(J).map(([n,c])=>[n,{unlocked:c.unlocked,purchased:c.purchased}])),marketMultiplier:Qt,marketEventEndTime:xe,achievements:Xe,saveTime:new Date().toISOString(),ts:Date.now(),gameStartTime:Qe,totalPlayTime:we,sessionStartTime:Be,nickname:ee};Pn&&(console.log("💾 저장 데이터에 포함된 닉네임:",ee||"(없음)"),console.log("💾 saveData.nickname:",t.nickname));try{if(localStorage.setItem(_e,JSON.stringify(t)),Yt=new Date,console.log("게임 저장 완료:",Yt.toLocaleTimeString()),ys(),an){const n=Number((t==null?void 0:t.ts)||0)||0;n&&n>Ln&&(qt=t,Pn&&console.log("☁️ 클라우드 저장 대기 중인 데이터에 닉네임 포함:",qt.nickname||"(없음)"))}ee&&(!window.__lastLeaderboardUpdate||Date.now()-window.__lastLeaderboardUpdate>3e4)&&(Ns(),window.__lastLeaderboardUpdate=Date.now())}catch(n){console.error("게임 저장 실패:",n)}}function us(){try{const t=localStorage.getItem(_e);return t&&JSON.parse(t).nickname||""}catch(t){return console.error("닉네임 확인 실패:",t),""}}function pt(){if(dt){console.log("⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨");return}const t=us();if(t){ee=t,console.log("✅ 닉네임 확인됨:",t);return}console.log("📝 닉네임 없음: 모달 오픈"),dt=!0;try{sessionStorage.setItem(zt,"1")}catch(n){console.warn("sessionStorage set 실패:",n)}setTimeout(()=>{bs("닉네임 설정",`리더보드에 표시될 닉네임을 입력하세요.
(1~5자, 공백/%, _ 불가)`,async c=>{const s=Rn(c);if(s.toLowerCase(),s.length<1||s.length>5){pe("닉네임 길이 오류","닉네임은 1~5자여야 합니다.","⚠️"),dt=!1,pt();return}if(/\s/.test(s)){pe("닉네임 형식 오류","닉네임에는 공백을 포함할 수 없습니다.","⚠️"),dt=!1,pt();return}if(/[%_]/.test(s)){pe("닉네임 형식 오류","닉네임에는 %, _ 문자를 사용할 수 없습니다.","⚠️"),dt=!1,pt();return}const{taken:a}=await Ys(s);if(a){pe("닉네임 중복",`이미 사용 중인 닉네임입니다.
다른 닉네임을 입력해주세요.`,"⚠️"),dt=!1,pt();return}try{sessionStorage.removeItem(zt)}catch(i){console.warn("sessionStorage remove 실패:",i)}ee=s,Ut(),C(`닉네임이 "${ee}"으로 설정되었습니다.`)},{icon:"✏️",primaryLabel:"확인",placeholder:"1~5자 닉네임",maxLength:5,defaultValue:"",required:!0})},500)}function ms(){try{const t=localStorage.getItem(_e);if(!t)return console.log("저장된 게임 데이터가 없습니다."),we=0,Be=Date.now(),!1;const n=JSON.parse(t);if($=n.cash||0,ae=n.totalClicks||0,Ge=n.totalLaborIncome||0,G=n.careerLevel||0,ge=n.clickMultiplier||1,Ee=n.rentMultiplier||1,Jt=n.autoClickEnabled||!1,pn=n.managerLevel||0,On=n.rentCost||1e9,Nn=n.mgrCost||5e9,M=n.deposits||0,_=n.savings||0,x=n.bonds||0,H=n.usStocks||0,K=n.cryptos||0,Ae=n.depositsLifetime||0,De=n.savingsLifetime||0,Fe=n.bondsLifetime||0,Oe=n.usStocksLifetime||0,Ne=n.cryptosLifetime||0,D=n.villas||0,F=n.officetels||0,A=n.apartments||0,O=n.shops||0,N=n.buildings||0,ke=n.towers||0,Ue=n.villasLifetime||0,qe=n.officetelsLifetime||0,Ke=n.apartmentsLifetime||0,Ve=n.shopsLifetime||0,He=n.buildingsLifetime||0,n.upgradesV2)for(const[c,s]of Object.entries(n.upgradesV2))J[c]&&(J[c].unlocked=s.unlocked,J[c].purchased=s.purchased);if(Eo(),Qt=n.marketMultiplier||1,xe=n.marketEventEndTime||0,n.achievements&&Xe.forEach((c,s)=>{n.achievements[s]&&(c.unlocked=n.achievements[s].unlocked)}),n.gameStartTime&&(Qe=n.gameStartTime),n.totalPlayTime!==void 0&&(we=n.totalPlayTime,console.log("🕐 이전 누적 플레이시간 복원:",we,"ms")),ee=n.nickname||"",n.sessionStartTime){const c=Date.now()-n.sessionStartTime;we+=c,console.log("🕐 이전 세션 플레이시간 누적:",c,"ms")}return Be=Date.now(),console.log("🕐 새 세션 시작:",new Date(Be).toLocaleString()),console.log("🕐 총 누적 플레이시간:",we,"ms"),console.log("게임 불러오기 완료:",n.saveTime?new Date(n.saveTime).toLocaleString():"시간 정보 없음"),!0}catch(t){return console.error("게임 불러오기 실패:",t),!1}}function tn(){console.log("🔄 resetGame function called"),nn("게임 새로 시작",`게임을 새로 시작하시겠습니까?

⚠️ 모든 진행 상황이 삭제되며 복구할 수 없습니다.`,()=>{try{C("🔄 게임을 초기화합니다..."),console.log("✅ User confirmed reset"),localStorage.removeItem(_e),console.log("✅ LocalStorage cleared");try{sessionStorage.setItem(fn,"1"),sessionStorage.setItem(zt,"1")}catch(n){console.warn("sessionStorage set 실패:",n)}console.log("✅ Reloading page..."),location.reload()}catch(n){console.error("❌ Error in resetGame:",n),pe("오류",`게임 초기화 중 오류가 발생했습니다.
페이지를 새로고침해주세요.`,"⚠️")}},{icon:"🔄",primaryLabel:"새로 시작",secondaryLabel:"취소"})}function Me(t){t.classList.remove("purchase-success"),t.offsetHeight,t.classList.add("purchase-success"),setTimeout(()=>{t.classList.remove("purchase-success")},600)}function vn(){try{Ws(Fn,be)}catch(t){console.error("설정 저장 실패:",t)}}function fs(){try{const t=zs(Fn,null);t&&(be={...be,...t})}catch(t){console.error("설정 불러오기 실패:",t)}}function gs(){try{const t=localStorage.getItem(_e);if(!t){alert("저장된 게임 데이터가 없습니다.");return}const n=new Blob([t],{type:"application/json"}),c=URL.createObjectURL(n),s=document.createElement("a");s.href=c,s.download=`capital-clicker-save-${Date.now()}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(c),C("✅ 저장 파일이 다운로드되었습니다.")}catch(t){console.error("저장 내보내기 실패:",t),alert("저장 내보내기 중 오류가 발생했습니다.")}}function ps(t){try{const n=new FileReader;n.onload=c=>{try{const s=JSON.parse(c.target.result);localStorage.setItem(_e,JSON.stringify(s)),C("✅ 저장 파일을 불러왔습니다. 페이지를 새로고침합니다..."),setTimeout(()=>{location.reload()},1e3)}catch(s){console.error("저장 파일 파싱 실패:",s),alert("저장 파일 형식이 올바르지 않습니다.")}},n.readAsText(t)}catch(n){console.error("저장 가져오기 실패:",n),alert("저장 가져오기 중 오류가 발생했습니다.")}}function ys(){if(jn){const n=Yt.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});jn.textContent=`저장됨 · ${n}`}const t=document.getElementById("lastSaveTimeSettings");if(t){const n=Yt.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});t.textContent=n}}function re(){try{const U=document.getElementById("playerNicknameLabel"),$e=document.getElementById("nicknameInfoItem");U&&(U.textContent=ee||"-"),$e&&($e.style.display=ee?"flex":"none"),(typeof ae!="number"||ae<0)&&(console.warn("Invalid totalClicks value:",ae,"resetting to 0"),ae=0);const le=Nt(),he=bn();if(!le){console.error("getCurrentCareer() returned null/undefined");return}if(u(es,le.name),u(xo,T(Ot())),ve&&le.bgImage?ve.style.backgroundImage=`url('${le.bgImage}')`:ve&&!le.bgImage&&(ve.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),he){const Ie=Math.min(ae/he.requiredClicks*100,100),Se=Math.max(0,he.requiredClicks-ae);mt&&(mt.style.width=Ie+"%",mt.setAttribute("aria-valuenow",Math.round(Ie))),u(Qn,`${Math.round(Ie)}% (${ae}/${he.requiredClicks})`),At&&(Se>0?u(At,`다음 승진까지 ${Se.toLocaleString("ko-KR")}클릭 남음`):u(At,"승진 가능!")),console.log("=== CAREER PROGRESS DEBUG ==="),console.log("totalClicks:",ae),console.log("nextCareer.requiredClicks:",he.requiredClicks),console.log("progress:",Ie),console.log("currentCareer:",le.name),console.log("nextCareer:",he.name),console.log("=============================")}else mt&&(mt.style.width="100%",mt.setAttribute("aria-valuenow",100)),u(Qn,"100% (완료)"),At&&u(At,"최고 직급 달성")}catch(U){console.error("Career UI update failed:",U),console.error("Error details:",{totalClicks:ae,careerLevel:G,currentCareer:Nt(),nextCareer:bn()})}{const U=document.getElementById("diaryHeaderMeta");if(U){const $e=k=>String(k).padStart(2,"0"),le=new Date,he=le.getFullYear(),Ie=$e(le.getMonth()+1),Se=$e(le.getDate()),e=typeof Qe<"u"&&Qe?Qe:Be,o=Math.max(1,Math.floor((Date.now()-e)/864e5)+1);U.textContent=`${he}.${Ie}.${Se}(${o}일차)`}}u(Lo,q($));const t=kn();u(So,T(t));const n=document.getElementById("financialChip");if(n){const U=`예금: ${M}개
적금: ${_}개
국내주식: ${x}개
미국주식: ${H}개
코인: ${K}개`;n.setAttribute("title",U)}const c=rt();u(wo,T(c));const s=document.getElementById("propertyChip");if(s){const U=`빌라: ${D}채
오피스텔: ${F}채
아파트: ${A}채
상가: ${O}채
빌딩: ${N}채`;s.setAttribute("title",U)}const a=document.getElementById("towerBadge"),i=document.getElementById("towerCountHeader");a&&i&&(ke>0?(a.style.display="flex",i.textContent=ke):a.style.display="none");const r=ft();u(Bo,q(r));const m=document.getElementById("rpsChip");if(m){const U=M*b.deposit+_*b.savings+x*b.bond,$e=(D*v.villa+F*v.officetel+A*v.apartment+O*v.shop+N*v.building)*Ee,le=`금융 수익: ${T(U)}₩/s
부동산 수익: ${T($e)}₩/s
시장배수: x${Qt}`;m.setAttribute("title",le)}$s(),u(To,ge.toFixed(1)),u(Mo,Ee.toFixed(1)),console.log("=== GAME STATE DEBUG ==="),console.log("Cash:",$),console.log("Total clicks:",ae),console.log("Career level:",G),console.log("Financial products:",{deposits:M,savings:_,bonds:x,total:kn()}),console.log("Properties:",{villas:D,officetels:F,apartments:A,shops:O,buildings:N,total:rt()}),console.log("========================");try{(typeof M!="number"||M<0)&&(console.warn("Invalid deposits value:",M,"resetting to 0"),M=0),(typeof _!="number"||_<0)&&(console.warn("Invalid savings value:",_,"resetting to 0"),_=0),(typeof x!="number"||x<0)&&(console.warn("Invalid bonds value:",x,"resetting to 0"),x=0);const U=ft(),$e=fe==="buy"?z("deposit",M,Z):ct("deposit",M,Z),le=M*b.deposit,he=U>0?(le/U*100).toFixed(1):0;Vn.textContent=M,Po.textContent=Math.floor(b.deposit).toLocaleString("ko-KR")+"원",document.getElementById("depositTotalIncome").textContent=Math.floor(le).toLocaleString("ko-KR")+"원",document.getElementById("depositPercent").textContent=he+"%",document.getElementById("depositLifetime").textContent=ne(Ae),Do.textContent=ue($e);const Ie=fe==="buy"?z("savings",_,Z):ct("savings",_,Z),Se=_*b.savings,e=U>0?(Se/U*100).toFixed(1):0;Hn.textContent=_,Ro.textContent=Math.floor(b.savings).toLocaleString("ko-KR")+"원",document.getElementById("savingsTotalIncome").textContent=Math.floor(Se).toLocaleString("ko-KR")+"원",document.getElementById("savingsPercent").textContent=e+"%",document.getElementById("savingsLifetimeDisplay").textContent=ne(De),Fo.textContent=ue(Ie);const o=fe==="buy"?z("bond",x,Z):ct("bond",x,Z),k=x*b.bond,P=U>0?(k/U*100).toFixed(1):0;Gn.textContent=x,Ao.textContent=Math.floor(b.bond).toLocaleString("ko-KR")+"원",document.getElementById("bondTotalIncome").textContent=Math.floor(k).toLocaleString("ko-KR")+"원",document.getElementById("bondPercent").textContent=P+"%",document.getElementById("bondLifetimeDisplay").textContent=ne(Fe),Oo.textContent=ue(o);const ye=fe==="buy"?z("usStock",H,Z):ct("usStock",H,Z),de=H*b.usStock,l=U>0?(de/U*100).toFixed(1):0;document.getElementById("usStockCount").textContent=H,document.getElementById("incomePerUsStock").textContent=Math.floor(b.usStock).toLocaleString("ko-KR")+"원",document.getElementById("usStockTotalIncome").textContent=Math.floor(de).toLocaleString("ko-KR")+"원",document.getElementById("usStockPercent").textContent=l+"%",document.getElementById("usStockLifetimeDisplay").textContent=ne(Oe),document.getElementById("usStockCurrentPrice").textContent=ue(ye);const nt=fe==="buy"?z("crypto",K,Z):ct("crypto",K,Z),ot=K*b.crypto,X=U>0?(ot/U*100).toFixed(1):0;document.getElementById("cryptoCount").textContent=K,document.getElementById("incomePerCrypto").textContent=Math.floor(b.crypto).toLocaleString("ko-KR")+"원",document.getElementById("cryptoTotalIncome").textContent=Math.floor(ot).toLocaleString("ko-KR")+"원",document.getElementById("cryptoPercent").textContent=X+"%",document.getElementById("cryptoLifetimeDisplay").textContent=ne(Ne),document.getElementById("cryptoCurrentPrice").textContent=ue(nt),console.log("=== FINANCIAL PRODUCTS DEBUG ==="),console.log("Financial counts:",{deposits:M,savings:_,bonds:x,usStocks:H,cryptos:K}),console.log("Total financial products:",kn()),console.log("Financial elements:",{depositCount:Vn,savingsCount:Hn,bondCount:Gn}),console.log("================================")}catch(U){console.error("Financial products UI update failed:",U),console.error("Error details:",{deposits:M,savings:_,bonds:x})}const d=ft(),p=fe==="buy"?Y("villa",D,Z):at("villa",D,Z),I=D*v.villa,y=d>0?(I/d*100).toFixed(1):0;Ho.textContent=D,Go.textContent=Math.floor(v.villa).toLocaleString("ko-KR")+"원",document.getElementById("villaTotalIncome").textContent=Math.floor(I).toLocaleString("ko-KR")+"원",document.getElementById("villaPercent").textContent=y+"%",document.getElementById("villaLifetimeDisplay").textContent=ne(Ue),No.textContent=ce(p);const R=fe==="buy"?Y("officetel",F,Z):at("officetel",F,Z),E=F*v.officetel,h=d>0?(E/d*100).toFixed(1):0;jo.textContent=F,Wo.textContent=Math.floor(v.officetel).toLocaleString("ko-KR")+"원",document.getElementById("officetelTotalIncome").textContent=Math.floor(E).toLocaleString("ko-KR")+"원",document.getElementById("officetelPercent").textContent=h+"%",document.getElementById("officetelLifetimeDisplay").textContent=ne(qe),Uo.textContent=ce(R);const g=fe==="buy"?Y("apartment",A,Z):at("apartment",A,Z),f=A*v.apartment,w=d>0?(f/d*100).toFixed(1):0;zo.textContent=A,Yo.textContent=Math.floor(v.apartment).toLocaleString("ko-KR")+"원",document.getElementById("aptTotalIncome").textContent=Math.floor(f).toLocaleString("ko-KR")+"원",document.getElementById("aptPercent").textContent=w+"%",document.getElementById("aptLifetimeDisplay").textContent=ne(Ke),qo.textContent=ce(g);const S=fe==="buy"?Y("shop",O,Z):at("shop",O,Z),j=O*v.shop,oe=d>0?(j/d*100).toFixed(1):0;Jo.textContent=O,Qo.textContent=Math.floor(v.shop).toLocaleString("ko-KR")+"원",document.getElementById("shopTotalIncome").textContent=Math.floor(j).toLocaleString("ko-KR")+"원",document.getElementById("shopPercent").textContent=oe+"%",document.getElementById("shopLifetimeDisplay").textContent=ne(Ve),Ko.textContent=ce(S);const se=fe==="buy"?Y("building",N,Z):at("building",N,Z),me=N*v.building,tt=d>0?(me/d*100).toFixed(1):0;if(Xo.textContent=N,Zo.textContent=Math.floor(v.building).toLocaleString("ko-KR")+"원",document.getElementById("buildingTotalIncome").textContent=Math.floor(me).toLocaleString("ko-KR")+"원",document.getElementById("buildingPercent").textContent=tt+"%",document.getElementById("buildingLifetimeDisplay").textContent=ne(He),Vo.textContent=ce(se),zn&&(zn.textContent=ke),Yn&&(Yn.textContent=ke),Jn){const U=st.tower;Jn.textContent=ce(U)}console.log("Property counts:",{villas:D,officetels:F,apartments:A,shops:O,buildings:N}),yt(),ls(),ds(),as(),ks(),As()}let Cn=null;function $s(){var t,n;try{const c=Date.now(),s=!!(ie&&xe>c),a=s?Math.max(0,Math.ceil((xe-c)/1e3)):0,i=document.getElementById("marketEventBar");if(i)if(!s)i.classList.remove("is-visible"),i.textContent="";else{i.classList.add("is-visible");const r=ie!=null&&ie.name?String(ie.name):"시장 이벤트",m=Math.floor((xe-c)/1e3),d=m>=0?`${m}초`:"0초",p=(f,w)=>f?Object.entries(f).filter(([,S])=>S!==1).slice(0,5).map(([S,j])=>`${w[S]??S} x${(Math.round(j*10)/10).toString().replace(/\.0$/,"")}`):[],I={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인"},y={villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"},R=p((t=ie==null?void 0:ie.effects)==null?void 0:t.financial,I),E=p((n=ie==null?void 0:ie.effects)==null?void 0:n.property,y),h=[...R,...E].slice(0,5),g=h.length?` · ${h.join(", ")}`:"";i.innerHTML=`📈 <b>${r}</b> · 남은 <span class="good">${d}</span>${g}`}Cn||(Cn=[{rowId:"depositItem",category:"financial",type:"deposit"},{rowId:"savingsItem",category:"financial",type:"savings"},{rowId:"bondItem",category:"financial",type:"bond"},{rowId:"usStockItem",category:"financial",type:"usStock"},{rowId:"cryptoItem",category:"financial",type:"crypto"},{rowId:"villaItem",category:"property",type:"villa"},{rowId:"officetelItem",category:"property",type:"officetel"},{rowId:"aptItem",category:"property",type:"apartment"},{rowId:"shopItem",category:"property",type:"shop"},{rowId:"buildingItem",category:"property",type:"building"}].map(m=>{const d=document.getElementById(m.rowId);if(!d)return null;const p=d.querySelector("button.btn");if(!p)return null;let I=d.querySelector(".event-mult-badge");return I||(I=document.createElement("span"),I.className="event-mult-badge",I.setAttribute("aria-hidden","true"),d.insertBefore(I,p)),{...m,row:d,badge:I}}).filter(Boolean));for(const r of Cn){const m=s?hn(r.type,r.category):1,d=Math.abs(m-1)<1e-9;if(r.row.classList.remove("event-bull","event-bear"),r.badge.classList.remove("is-visible","is-bull","is-bear"),r.badge.removeAttribute("title"),!s||d){r.badge.textContent="";continue}const I=`x${(Math.round(m*10)/10).toFixed(1).replace(/\.0$/,"")}`;r.badge.textContent=I,r.badge.classList.add("is-visible"),m>1?(r.row.classList.add("event-bull"),r.badge.classList.add("is-bull")):(r.row.classList.add("event-bear"),r.badge.classList.add("is-bear"));const y=ie!=null&&ie.name?String(ie.name):"시장 이벤트";r.badge.title=`${y} · 남은 ${a}초 · ${I}`}}catch{}}setTimeout(()=>{xs()},100);function ks(){const t={savings:"예금 1개 필요",bond:"적금 1개 필요",usStock:"국내주식 1개 필요",crypto:"미국주식 1개 필요",villa:"코인 1개 필요",officetel:"빌라 1채 필요",apartment:"오피스텔 1채 필요",shop:"아파트 1채 필요",building:"상가 1채 필요",tower:"CEO 달성 및 빌딩 1개 이상 필요"},n=document.getElementById("savingsItem"),c=document.getElementById("bondItem");if(n){const y=!Q("savings");n.classList.toggle("locked",y),y?n.setAttribute("data-unlock-hint",t.savings):n.removeAttribute("data-unlock-hint")}if(c){const y=!Q("bond");c.classList.toggle("locked",y),y?c.setAttribute("data-unlock-hint",t.bond):c.removeAttribute("data-unlock-hint")}const s=document.getElementById("usStockItem"),a=document.getElementById("cryptoItem");if(s){const y=!Q("usStock");s.classList.toggle("locked",y),y?s.setAttribute("data-unlock-hint",t.usStock):s.removeAttribute("data-unlock-hint")}if(a){const y=!Q("crypto");a.classList.toggle("locked",y),y?a.setAttribute("data-unlock-hint",t.crypto):a.removeAttribute("data-unlock-hint")}const i=document.getElementById("villaItem"),r=document.getElementById("officetelItem"),m=document.getElementById("aptItem"),d=document.getElementById("shopItem"),p=document.getElementById("buildingItem");if(i){const y=!Q("villa");i.classList.toggle("locked",y),y?i.setAttribute("data-unlock-hint",t.villa):i.removeAttribute("data-unlock-hint")}if(r){const y=!Q("officetel");r.classList.toggle("locked",y),y?r.setAttribute("data-unlock-hint",t.officetel):r.removeAttribute("data-unlock-hint")}if(m){const y=!Q("apartment");m.classList.toggle("locked",y),y?m.setAttribute("data-unlock-hint",t.apartment):m.removeAttribute("data-unlock-hint")}if(d){const y=!Q("shop");d.classList.toggle("locked",y),y?d.setAttribute("data-unlock-hint",t.shop):d.removeAttribute("data-unlock-hint")}if(p){const y=!Q("building");p.classList.toggle("locked",y),y?p.setAttribute("data-unlock-hint",t.building):p.removeAttribute("data-unlock-hint")}const I=document.getElementById("towerItem");if(I){const y=!Q("tower");I.classList.toggle("locked",y),y?I.setAttribute("data-unlock-hint",t.tower):I.removeAttribute("data-unlock-hint")}}yn.addEventListener("click",()=>{fe="buy",yn.classList.add("active"),$n.classList.remove("active"),yt()}),$n.addEventListener("click",()=>{fe="sell",$n.classList.add("active"),yn.classList.remove("active"),yt()}),Xt.addEventListener("click",()=>{Z=1,Xt.classList.add("active"),Zt.classList.remove("active"),en.classList.remove("active"),yt()}),Zt.addEventListener("click",()=>{Z=5,Zt.classList.add("active"),Xt.classList.remove("active"),en.classList.remove("active"),yt()}),en.addEventListener("click",()=>{Z=10,en.classList.add("active"),Xt.classList.remove("active"),Zt.classList.remove("active"),yt()}),wt.addEventListener("click",()=>{const t=document.getElementById("upgradeList");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),wt.textContent="▼",wt.classList.remove("collapsed")):(t.classList.add("collapsed-section"),wt.textContent="▶",wt.classList.add("collapsed"))}),Bt.addEventListener("click",()=>{const t=document.getElementById("financialSection");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),Bt.textContent="▼",Bt.classList.remove("collapsed")):(t.classList.add("collapsed-section"),Bt.textContent="▶",Bt.classList.add("collapsed"))}),_t.addEventListener("click",()=>{const t=document.getElementById("propertySection");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),_t.textContent="▼",_t.classList.remove("collapsed")):(t.classList.add("collapsed-section"),_t.textContent="▶",_t.classList.add("collapsed"))});function yt(){const t=fe==="buy",n=Z;Pe(Ct,"financial","deposit",M,t,n),Pe(It,"financial","savings",_,t,n),Pe(Et,"financial","bond",x,t,n),Pe(Lt,"financial","usStock",H,t,n),Pe(St,"financial","crypto",K,t,n),Pe(xt,"property","villa",D,t,n),Pe(Tt,"property","officetel",F,t,n),Pe(Mt,"property","apartment",A,t,n),Pe(Pt,"property","shop",O,t,n),Pe(Rt,"property","building",N,t,n)}function Pe(t,n,c,s,a,i){if(!t)return;const r=a?n==="financial"?z(c,s,i):Y(c,s,i):n==="financial"?ct(c,s,i):at(c,s,i),m=a?"구입":"판매",d=i>1?` x${i}`:"";if(t.textContent=`${m}${d}`,a)t.style.background="",t.disabled=$<r;else{const p=s>=i;t.style.background=p?"var(--bad)":"var(--muted)",t.disabled=!p}}function hs(t,n){let c=Ot();J.performance_bonus&&J.performance_bonus.purchased&&Math.random()<.02&&(c*=10,C("💰 성과급 지급! 10배 수익!")),be.particles&&Is(t??0,n??0),$+=c,ae+=1,Ge+=c;const s=Object.entries(J).filter(([i,r])=>r.category==="labor"&&!r.unlocked&&!r.purchased).map(([i,r])=>{var I;const m=r.unlockCondition.toString(),d=m.match(/totalClicks\s*>=\s*(\d+)/);if(d)return{id:i,requiredClicks:parseInt(d[1]),upgrade:r};const p=m.match(/careerLevel\s*>=\s*(\d+)/);return p?{id:i,requiredClicks:((I=vt[parseInt(p[1])])==null?void 0:I.requiredClicks)||1/0,upgrade:r}:null}).filter(i=>i!==null).sort((i,r)=>i.requiredClicks-r.requiredClicks);if(s.length>0){const i=s[0],r=i.requiredClicks-ae;(r===50||r===25||r===10||r===5)&&C(`🎯 다음 업그레이드 "${i.upgrade.name}"까지 ${r}클릭 남음!`)}Zn()&&re(),is(),it.classList.add("click-effect"),setTimeout(()=>it.classList.remove("click-effect"),300),Es(c),re()}it.addEventListener("click",t=>{hs(t.clientX,t.clientY)});let In=null;function lt(){Ze&&(Ze.classList.add("game-modal-hidden"),In=null)}function pe(t,n,c="ℹ️"){if(!Ze||!je||!We||!Le||!Ce){alert(n);return}Ze.classList.remove("game-modal-hidden");const s=je.querySelector(".icon"),a=je.querySelector(".text");s&&(s.textContent=c),a&&(a.textContent=t),We.textContent=n,Ce.style.display="none",Le.textContent="확인",Le.onclick=()=>{lt()},Ce.onclick=()=>{lt()}}function nn(t,n,c,s={}){if(!Ze||!je||!We||!Le||!Ce){confirm(n)&&typeof c=="function"&&c();return}Ze.classList.remove("game-modal-hidden");const a=je.querySelector(".icon"),i=je.querySelector(".text");a&&(a.textContent=s.icon||"⚠️"),i&&(i.textContent=t),We.textContent=n,Ce.style.display="inline-flex",Le.textContent=s.primaryLabel||"예",Ce.textContent=s.secondaryLabel||"아니오",In=typeof c=="function"?c:null,Le.onclick=()=>{const r=In;lt(),r&&r()},Ce.onclick=()=>{lt(),s.onCancel&&typeof s.onCancel=="function"&&s.onCancel()}}function bs(t,n,c,s={}){if(!Ze||!je||!We||!Le||!Ce){const d=prompt(n);d&&typeof c=="function"&&c(d.trim());return}Ze.classList.remove("game-modal-hidden");const a=je.querySelector(".icon"),i=je.querySelector(".text");a&&(a.textContent=s.icon||"✏️"),i&&(i.textContent=t);let r=We.querySelector(".game-modal-input");r?r.value="":(r=document.createElement("input"),r.type="text",r.className="game-modal-input",We.innerHTML="",We.appendChild(r)),r.placeholder=s.placeholder||r.placeholder||"닉네임을 입력하세요",typeof s.maxLength=="number"?r.maxLength=s.maxLength:(!r.maxLength||r.maxLength<=0)&&(r.maxLength=20);{const d=document.createElement("div");d.textContent=n,d.style.marginBottom="10px",d.style.color="var(--muted)",We.insertBefore(d,r)}s.secondaryLabel?(Ce.style.display="inline-flex",Ce.textContent=s.secondaryLabel):Ce.style.display="none",Le.textContent=s.primaryLabel||"확인";const m=d=>{d.key==="Enter"&&(d.preventDefault(),Le.click())};r.addEventListener("keydown",m),r.focus(),Le.onclick=()=>{const d=r.value.trim();if(!d&&s.required!==!1){r.style.borderColor="var(--bad)",setTimeout(()=>{r.style.borderColor=""},1e3);return}r.removeEventListener("keydown",m),lt(),typeof c=="function"&&c(d||s.defaultValue||"익명")},s.secondaryLabel?Ce.onclick=()=>{r.removeEventListener("keydown",m),lt(),s.onCancel&&typeof s.onCancel=="function"&&s.onCancel()}:Ce.onclick=null}async function vs(){const t=window.location.href,n="Capital Clicker: Seoul Survival",c=`💰 부동산과 금융 투자로 부자가 되는 게임!
현재 자산: ${te($)}
초당 수익: ${te(ft())}`;if(!navigator.share){C("❌ 이 기기/브라우저에서는 공유하기를 지원하지 않습니다.");return}try{await navigator.share({title:n,text:c,url:t}),C("✅ 게임이 공유되었습니다!")}catch(s){(s==null?void 0:s.name)!=="AbortError"&&(console.error("공유 실패:",s),C("❌ 공유에 실패했습니다."))}}qn?qn.addEventListener("click",vs):console.error("공유 버튼을 찾을 수 없습니다.");function Cs(){const t=window.location.href,n=document.title||"Capital Clicker: Seoul Survival",c=navigator.userAgent.toLowerCase(),s=/iphone|ipad|ipod|android/.test(c),a=/iphone|ipad|ipod/.test(c),i=/android/.test(c),r=navigator.platform.toUpperCase().includes("MAC");if(window.external&&typeof window.external.AddFavorite=="function")try{window.external.AddFavorite(t,n),C("⭐ 즐겨찾기에 추가되었습니다.");return}catch{}let m="",d="즐겨찾기 / 홈 화면에 추가",p="⭐";s?a?m=`iPhone/iPad에서는 Safari 하단의 공유 버튼(□↑)을 누른 뒤
"홈 화면에 추가"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.`:i?m=`Android에서는 브라우저 오른쪽 위 메뉴(⋮)에서
"홈 화면에 추가" 또는 "앱 설치"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.`:m='이 기기에서는 브라우저의 메뉴에서 "홈 화면에 추가" 기능을 사용해 주세요.':m=`${r?"⌘ + D":"Ctrl + D"} 를 눌러 이 페이지를 브라우저 즐겨찾기에 추가할 수 있습니다.`,pe(d,m,p)}Kn&&Kn.addEventListener("click",Cs),Wn&&Wn.addEventListener("click",tn);const eo=document.getElementById("resetBtnSettings");eo&&eo.addEventListener("click",tn);function Is(t,n){const c=document.createElement("div");c.className="falling-cookie",c.textContent="💵",c.style.left=t+Math.random()*100-50+"px",c.style.top=n-100+"px",document.body.appendChild(c),setTimeout(()=>{c.parentNode&&c.parentNode.removeChild(c)},2e3)}function to(t,n){for(let c=0;c<Math.min(n,5);c++)setTimeout(()=>{const s=document.createElement("div");s.className="falling-cookie",s.textContent=t,s.style.left=Math.random()*window.innerWidth+"px",s.style.top="-100px",document.body.appendChild(s),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},2e3)},c*200)}function Es(t){const n=document.createElement("div");n.className="income-increase",n.textContent=`+${T(t)}원`;const c=it.getBoundingClientRect(),s=it.parentElement.getBoundingClientRect();n.style.position="absolute",n.style.left=c.left-s.left+Math.random()*100-50+"px",n.style.top=c.top-s.top-50+"px",n.style.zIndex="1000",n.style.pointerEvents="none",it.parentElement.style.position="relative",it.parentElement.appendChild(n),n.style.opacity="1",n.style.transform="translateY(0px) scale(1)",setTimeout(()=>{n.style.transition="all 1.5s ease-out",n.style.opacity="0",n.style.transform="translateY(-80px) scale(1.2)"},100),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},1600)}Ct.addEventListener("click",()=>{if(!Q("deposit")){C("❌ 예금은 아직 잠겨있습니다.");return}const t=V("financial","deposit",M);t.success&&(M=t.newCount,Me(Ct),Te("deposit")),re()}),It.addEventListener("click",()=>{if(!Q("savings")){C("❌ 적금은 예금을 1개 이상 보유해야 해금됩니다.");return}const t=V("financial","savings",_);t.success&&(_=t.newCount,Me(It),Te("savings")),re()}),Et.addEventListener("click",()=>{if(!Q("bond")){C("❌ 국내주식은 적금을 1개 이상 보유해야 해금됩니다.");return}const t=V("financial","bond",x);t.success&&(x=t.newCount,Me(Et),Te("bond")),re()}),Lt.addEventListener("click",()=>{if(!Q("usStock")){C("❌ 미국주식은 국내주식을 1개 이상 보유해야 해금됩니다.");return}const t=V("financial","usStock",H);t.success&&(H=t.newCount,Me(Lt),Te("usStock")),re()}),St.addEventListener("click",()=>{if(!Q("crypto")){C("❌ 코인은 미국주식을 1개 이상 보유해야 해금됩니다.");return}const t=V("financial","crypto",K);t.success&&(K=t.newCount,Me(St),Te("crypto")),re()}),xt.addEventListener("click",()=>{if(!Q("villa")){C("❌ 빌라는 코인을 1개 이상 보유해야 해금됩니다.");return}const t=V("property","villa",D);t.success&&(D=t.newCount,Me(xt),Te("villa")),re()}),Tt.addEventListener("click",()=>{if(!Q("officetel")){C("❌ 오피스텔은 빌라를 1개 이상 보유해야 해금됩니다.");return}const t=V("property","officetel",F);t.success&&(F=t.newCount,Me(Tt),Te("officetel")),re()}),Mt.addEventListener("click",()=>{if(!Q("apartment")){C("❌ 아파트는 오피스텔을 1개 이상 보유해야 해금됩니다.");return}const t=V("property","apartment",A);t.success&&(A=t.newCount,Me(Mt),Te("apartment")),re()}),Pt.addEventListener("click",()=>{if(!Q("shop")){C("❌ 상가는 아파트를 1개 이상 보유해야 해금됩니다.");return}const t=V("property","shop",O);t.success&&(O=t.newCount,Me(Pt),Te("shop")),re()}),Rt.addEventListener("click",()=>{if(!Q("building")){C("❌ 빌딩은 상가를 1개 이상 보유해야 해금됩니다.");return}const t=V("property","building",N);t.success&&(N=t.newCount,Me(Rt),Te("building")),re()}),ut&&ut.addEventListener("click",async()=>{if(!Q("tower")){C("❌ 서울타워는 CEO 달성 및 빌딩 1개 이상 보유 시 해금됩니다.");return}const t=st.tower;if($<t){C(`💸 자금이 부족합니다. (필요: ${T(t)}원)`);return}$-=t,ke+=1;const n=$+Wt(),c=Date.now()-Be,s=we+c;if(ee)try{await Mn(ee,n,s,ke),console.log("리더보드: 서울타워 구매 시점 자산으로 업데이트 완료")}catch(a){console.error("리더보드 업데이트 실패:",a)}C(`🗼 서울타워 완성.
서울의 정상에 도달했다.
이제야 진짜 시작인가?`),Ls(ke),be.particles&&to("🗼",1),re(),Ut()});function Ls(t){const n=`🗼 서울타워 완성 🗼

알바에서 시작해 CEO까지.
예금에서 시작해 서울타워까지.

서울 한복판에 당신의 이름이 새겨졌다.

"이제야 진짜 시작인가?"

리더보드에 기록되었습니다: 🗼x${t}`;pe("🎉 엔딩",n,"🗼"),Le.onclick,Le.onclick=()=>{lt(),nn("🔄 새 게임 시작",`서울타워를 완성했습니다!

새 게임을 시작하시겠습니까?
(현재 진행은 초기화됩니다)`,()=>{tn(),C("🗼 새로운 시작. 다시 한 번.")},{icon:"🗼",primaryLabel:"새 게임 시작",secondaryLabel:"나중에"})}}document.addEventListener("keydown",t=>{t.ctrlKey&&t.shiftKey&&t.key==="R"&&(t.preventDefault(),tn()),t.ctrlKey&&t.key==="s"&&(t.preventDefault(),Ut(),C("💾 수동 저장 완료!")),t.ctrlKey&&t.key==="o"&&(t.preventDefault(),$t&&$t.click())});const no=50;setInterval(()=>{os(),ss(),Xn();const t=no/1e3;$+=ft()*t,Ae+=M*b.deposit*t,De+=_*b.savings*t,Fe+=x*b.bond*t,Oe+=H*b.usStock*t,Ne+=K*b.crypto*t,Ue+=D*v.villa*t,qe+=F*v.officetel*t,Ke+=A*v.apartment*t,Ve+=O*v.shop*t,He+=N*v.building*t,re()},no),setInterval(()=>{Ut()},5e3),setInterval(()=>{if(Jt){const t=Ot();if($+=t,ae+=1,Ge+=t,Zn(),J.performance_bonus&&J.performance_bonus.purchased&&Math.random()<.02){const n=t*9;$+=n,Ge+=n}}},1e3),setInterval(()=>{xe===0&&ts()},Math.random()*18e4+12e4),fs();const oo=document.getElementById("currentYear");oo&&(oo.textContent=new Date().getFullYear()),(async()=>ms()?(C("저장된 게임을 불러왔습니다."),pt()):(C("환영합니다! 노동으로 종잣돈을 모아 첫 부동산을 구입해보세요."),await _s()||pt()))();const En=Nt();ve&&En&&En.bgImage&&(ve.style.backgroundImage=`url('${En.bgImage}')`);const on=document.getElementById("toggleParticles"),sn=document.getElementById("toggleFancyGraphics"),cn=document.getElementById("toggleShortNumbers");on&&(on.checked=be.particles),sn&&(sn.checked=be.fancyGraphics),cn&&(cn.checked=be.shortNumbers);const so=document.getElementById("exportSaveBtn"),co=document.getElementById("importSaveBtn"),$t=document.getElementById("importFileInput"),ao=document.getElementById("cloudUploadBtn"),io=document.getElementById("cloudDownloadBtn");so&&so.addEventListener("click",gs),co&&co.addEventListener("click",()=>{$t&&$t.click()}),$t&&$t.addEventListener("change",t=>{const n=t.target.files[0];n&&ps(n)});let qt=null,Ln=0,an=null,Sn=null;function Ss(){const t=document.getElementById("cloudLastSync");if(t){if(!Sn){t.textContent="--:--";return}t.textContent=Sn.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}}function ro(t){const n=document.getElementById("cloudSaveHint");!n||!t||(n.textContent=t)}async function lo(t="flush"){if(!an||!qt)return;const n=qt;qt=null;const c=Number((n==null?void 0:n.ts)||Date.now())||Date.now();if(c&&c<=Ln)return;const s=await $o("seoulsurvival",n);if(!s.ok){ro(`자동 동기화 실패(나중에 재시도). 이유: ${s.reason||"unknown"}`);return}Ln=c,Sn=new Date,Ss(),ro("자동 동기화 완료 ✅")}async function ws(){var a;if(!await Ye()){pe("로그인 필요","클라우드 세이브는 로그인 사용자만 사용할 수 있습니다.","🔐");return}const n=localStorage.getItem(_e);if(!n){pe("저장 데이터 없음","로컬 저장 데이터가 없습니다. 먼저 게임을 진행한 뒤 저장해 주세요.","💾");return}let c;try{c=JSON.parse(n)}catch{pe("오류","로컬 저장 데이터 형식이 올바르지 않습니다.","⚠️");return}const s=await $o("seoulsurvival",c);if(!s.ok){if(s.reason==="missing_table"){pe("클라우드 테이블 없음",`Supabase에 game_saves 테이블이 아직 없습니다.
Supabase SQL Editor에서 supabase/game_saves.sql을 실행해 주세요.`,"🛠️");return}pe("업로드 실패",`클라우드 저장에 실패했습니다.
${((a=s.error)==null?void 0:a.message)||""}`.trim(),"⚠️");return}C("☁️ 클라우드에 저장했습니다."),pe("완료","클라우드 저장 완료!","☁️")}async function Bs(){var a,i;if(!await Ye()){pe("로그인 필요","클라우드 세이브는 로그인 사용자만 사용할 수 있습니다.","🔐");return}const n=await yo("seoulsurvival");if(!n.ok){if(n.reason==="missing_table"){pe("클라우드 테이블 없음",`Supabase에 game_saves 테이블이 아직 없습니다.
Supabase SQL Editor에서 supabase/game_saves.sql을 실행해 주세요.`,"🛠️");return}pe("불러오기 실패",`클라우드 불러오기에 실패했습니다.
${((a=n.error)==null?void 0:a.message)||""}`.trim(),"⚠️");return}if(!n.found){pe("클라우드 저장 없음","이 계정에 저장된 클라우드 세이브가 없습니다.","☁️");return}const s=`클라우드 세이브를 발견했습니다.

저장 시간: ${(i=n.save)!=null&&i.saveTime?new Date(n.save.saveTime).toLocaleString():n.updated_at?new Date(n.updated_at).toLocaleString():"시간 정보 없음"}

불러오면 로컬 저장이 클라우드 데이터로 덮어써지고 페이지가 새로고침됩니다.
계속할까요?`;nn("클라우드 불러오기",s,()=>{try{localStorage.setItem(_e,JSON.stringify(n.save)),C("☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다..."),setTimeout(()=>location.reload(),600)}catch(r){pe("오류",`클라우드 세이브 적용에 실패했습니다.
${String(r)}`,"⚠️")}},{icon:"☁️",primaryLabel:"불러오기",secondaryLabel:"취소"})}async function _s(){var i;try{if(sessionStorage.getItem(zt)==="1")return!1}catch(r){console.warn("sessionStorage get 실패:",r)}try{if(sessionStorage.getItem(fn)==="1")return sessionStorage.removeItem(fn),!1}catch(r){console.warn("sessionStorage get/remove 실패:",r)}if(!!localStorage.getItem(_e)||!await Ye())return!1;const c=await yo("seoulsurvival");if(!c.ok||!c.found)return!1;const a=`클라우드 세이브가 있습니다.

저장 시간: ${(i=c.save)!=null&&i.saveTime?new Date(c.save.saveTime).toLocaleString():c.updated_at?new Date(c.updated_at).toLocaleString():"시간 정보 없음"}

불러오시겠습니까?`;return new Promise(r=>{let m=!1;const d=p=>{m||(m=!0,r(p))};nn("클라우드 세이브 발견",a,()=>{try{localStorage.setItem(_e,JSON.stringify(c.save)),C("☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다..."),setTimeout(()=>location.reload(),600),d(!0)}catch(p){console.error("클라우드 세이브 적용 실패:",p),d(!1)}},{icon:"☁️",primaryLabel:"불러오기",secondaryLabel:"나중에",onCancel:()=>{d(!1)}})})}ao&&ao.addEventListener("click",ws),io&&io.addEventListener("click",Bs),(async()=>{try{an=await Ye(),js(t=>{an=t})}catch{}})(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&lo("visibility:hidden")}),window.addEventListener("pagehide",()=>{lo("pagehide")}),on&&on.addEventListener("change",t=>{be.particles=t.target.checked,vn()}),sn&&sn.addEventListener("change",t=>{be.fancyGraphics=t.target.checked,vn()}),cn&&cn.addEventListener("change",t=>{be.shortNumbers=t.target.checked,vn(),re()}),console.log("=== 판매 시스템 초기화 완료 ==="),console.log("✅ 구매/판매 모드 토글 시스템 활성화"),console.log("✅ 금융상품 통합 거래 시스템 (예금/적금/주식)"),console.log("✅ 부동산 통합 거래 시스템 (빌라/오피스텔/아파트/상가/빌딩)"),console.log("✅ 판매 가격: 현재가의 80%"),console.log("✅ 수량 선택: 1개/10개/100개"),console.log('💡 사용법: 상단 "구매/판매" 버튼으로 모드 전환 후 거래하세요!');let uo=!1;function xs(){if(uo)return;uo=!0;const t=document.getElementById("statsTab");t&&t.addEventListener("click",n=>{const c=n.target.closest(".stats-toggle"),s=n.target.closest(".toggle-icon");if(c||s){const a=(c||s).closest(".stats-section");a&&a.classList.contains("collapsible")&&(a.classList.toggle("collapsed"),n.preventDefault(),n.stopPropagation())}})}let Kt=[],Vt=[],rn=0,ln=Date.now();function Ts(){const t=Date.now(),n=Ae+De+Fe+Oe+Ne+Ue+qe+Ke+Ve+He+Ge;Kt=Kt.filter(d=>t-d.time<36e5),Vt=Vt.filter(d=>t-d.time<864e5),t-ln>=6e4&&(Kt.push({time:t,earnings:n}),Vt.push({time:t,earnings:n}),ln=t);const c=Kt.length>0?n-Kt[0].earnings:0,s=Vt.length>0?n-Vt[0].earnings:0,a=rn>0&&t-ln>0?(n-rn)/rn*(36e5/(t-ln))*100:0;let r=[1e6,1e7,1e8,1e9,1e10,1e11].find(d=>d>n)||"최고 달성";if(r!=="최고 달성"){const d=r-n;r=`${B(d)} 남음`}u(document.getElementById("hourlyEarnings"),te(Math.max(0,c))),u(document.getElementById("dailyEarnings"),te(Math.max(0,s)));const m=Math.abs(a)<.05?0:a;u(document.getElementById("growthRate"),`${m>=0?"+":""}${m.toFixed(1)}%/시간`),u(document.getElementById("nextMilestone"),r),rn=n}function Ms(){const t=document.getElementById("assetDonutChart");if(!t)return;const n=t.getContext("2d");if(!n)return;const c=200,s=Math.max(1,Math.floor((window.devicePixelRatio||1)*100)/100),a=Math.round(c*s);(t.width!==a||t.height!==a)&&(t.width=a,t.height=a,t.style.width=`${c}px`,t.style.height=`${c}px`),n.setTransform(s,0,0,s,0,0);const i=c/2,r=c/2,m=80,d=50,p=$+Wt(),I=Ps(),y=Rs(),R=p>0?$/p*100:0,E=p>0?I/p*100:0,h=p>0?y/p*100:0;n.clearRect(0,0,c,c),n.beginPath(),n.arc(i,r,m,0,Math.PI*2),n.fillStyle="rgba(255, 255, 255, 0.05)",n.fill();let g=-Math.PI/2;if(R>0){const w=R/100*Math.PI*2;n.beginPath(),n.moveTo(i,r),n.arc(i,r,m,g,g+w),n.closePath();const S=n.createLinearGradient(i-m,r-m,i+m,r+m);S.addColorStop(0,"#f59e0b"),S.addColorStop(1,"#d97706"),n.fillStyle=S,n.fill(),n.lineWidth=2,n.strokeStyle="rgba(0, 0, 0, 0.25)",n.stroke(),g+=w}if(E>0){const w=E/100*Math.PI*2;n.beginPath(),n.moveTo(i,r),n.arc(i,r,m,g,g+w),n.closePath(),n.fillStyle="rgba(59, 130, 246, 0.5)",n.fill(),g+=w}if(h>0){const w=h/100*Math.PI*2;n.beginPath(),n.moveTo(i,r),n.arc(i,r,m,g,g+w),n.closePath(),n.fillStyle="rgba(16, 185, 129, 0.5)",n.fill()}n.beginPath(),n.arc(i,r,d,0,Math.PI*2);const f=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()||"#0b1220";n.fillStyle=f,n.fill()}function Ps(){let t=0;if(M>0)for(let n=0;n<M;n++)t+=z("deposit",n);if(_>0)for(let n=0;n<_;n++)t+=z("savings",n);if(x>0)for(let n=0;n<x;n++)t+=z("bond",n);if(H>0)for(let n=0;n<H;n++)t+=z("usStock",n);if(K>0)for(let n=0;n<K;n++)t+=z("crypto",n);return t}function Rs(){let t=0;if(D>0)for(let n=0;n<D;n++)t+=Y("villa",n);if(F>0)for(let n=0;n<F;n++)t+=Y("officetel",n);if(A>0)for(let n=0;n<A;n++)t+=Y("apartment",n);if(O>0)for(let n=0;n<O;n++)t+=Y("shop",n);if(N>0)for(let n=0;n<N;n++)t+=Y("building",n);return t}function As(){try{const t=$+Wt(),n=Ae+De+Fe+Oe+Ne+Ue+qe+Ke+Ve+He+Ge;u(document.getElementById("totalAssets"),B(t)),u(document.getElementById("totalEarnings"),B(n)),u(document.getElementById("rpsStats"),te(ft())+"/초"),u(document.getElementById("clickIncomeStats"),te(Ot())),u(document.getElementById("totalClicksStats"),ae.toLocaleString("ko-KR")+"회"),u(document.getElementById("laborIncomeStats"),B(Ge));const c=Date.now()-Be,s=we+c,a=Math.floor(s/6e4),i=Math.floor(a/60),r=a%60,m=i>0?`${i}시간 ${r}분`:`${a}분`;console.log("🕐 플레이시간 계산:",{totalPlayTime:we,currentSessionTime:c,totalPlayTimeMs:s,playTimeMinutes:a,playTimeText:m}),u(document.getElementById("playTimeStats"),m);const d=a>0?n/a*60:0;u(document.getElementById("hourlyRate"),te(d)+"/시간");const p=n>0?Ge/n*100:0,I=Ae+De+Fe+Oe+Ne,y=n>0?I/n*100:0,R=Ue+qe+Ke+Ve+He,E=n>0?R/n*100:0,h=document.querySelector(".income-bar"),g=document.getElementById("laborSegment"),f=document.getElementById("financialSegment"),w=document.getElementById("propertySegment");if(h&&!h.classList.contains("animated")&&h.classList.add("animated"),g){g.style.width=p.toFixed(1)+"%";const Re=g.querySelector("span");Re&&(Re.textContent=p>=5?`🛠️ ${p.toFixed(1)}%`:"")}if(f){f.style.width=y.toFixed(1)+"%";const Re=f.querySelector("span");Re&&(Re.textContent=y>=5?`💰 ${y.toFixed(1)}%`:"")}if(w){w.style.width=E.toFixed(1)+"%";const Re=w.querySelector("span");Re&&(Re.textContent=E>=5?`🏢 ${E.toFixed(1)}%`:"")}u(document.getElementById("laborLegend"),`노동: ${p.toFixed(1)}%`),u(document.getElementById("financialLegend"),`금융: ${y.toFixed(1)}%`),u(document.getElementById("propertyLegend"),`부동산: ${E.toFixed(1)}%`),Ts(),Ms();const S=n||1;Us(),u(document.getElementById("depositsOwnedStats"),M+"개"),u(document.getElementById("depositsLifetimeStats"),B(Ae));const j=S>0?(Ae/S*100).toFixed(1):"0.0";u(document.getElementById("depositsContribution"),`(${j}%)`);const oe=M>0?Gt("deposit",M):0;u(document.getElementById("depositsValue"),T(oe)),u(document.getElementById("savingsOwnedStats"),_+"개"),u(document.getElementById("savingsLifetimeStats"),B(De));const se=S>0?(De/S*100).toFixed(1):"0.0";u(document.getElementById("savingsContribution"),`(${se}%)`);const me=_>0?Gt("savings",_):0;u(document.getElementById("savingsValue"),T(me)),u(document.getElementById("bondsOwnedStats"),x+"개"),u(document.getElementById("bondsLifetimeStats"),B(Fe));const tt=S>0?(Fe/S*100).toFixed(1):"0.0";u(document.getElementById("bondsContribution"),`(${tt}%)`);const U=x>0?Gt("bond",x):0;u(document.getElementById("bondsValue"),T(U)),u(document.getElementById("usStocksOwnedStats"),H+"개"),u(document.getElementById("usStocksLifetimeStats"),B(Oe));const $e=S>0?(Oe/S*100).toFixed(1):"0.0";u(document.getElementById("usStocksContribution"),`(${$e}%)`);const le=H>0?Gt("usStock",H):0;u(document.getElementById("usStocksValue"),T(le)),u(document.getElementById("cryptosOwnedStats"),K+"개"),u(document.getElementById("cryptosLifetimeStats"),B(Ne));const he=S>0?(Ne/S*100).toFixed(1):"0.0";u(document.getElementById("cryptosContribution"),`(${he}%)`);const Ie=K>0?Gt("crypto",K):0;u(document.getElementById("cryptosValue"),T(Ie)),u(document.getElementById("villasOwnedStats"),D+"채"),u(document.getElementById("villasLifetimeStats"),te(Ue));const Se=S>0?(Ue/S*100).toFixed(1):"0.0";u(document.getElementById("villasContribution"),`(${Se}%)`);const e=D>0?jt("villa",D):0;u(document.getElementById("villasValue"),te(e)),u(document.getElementById("officetelsOwnedStats"),F+"채"),u(document.getElementById("officetelsLifetimeStats"),te(qe));const o=S>0?(qe/S*100).toFixed(1):"0.0";u(document.getElementById("officetelsContribution"),`(${o}%)`);const k=F>0?jt("officetel",F):0;u(document.getElementById("officetelsValue"),te(k)),u(document.getElementById("apartmentsOwnedStats"),A+"채"),u(document.getElementById("apartmentsLifetimeStats"),te(Ke));const P=S>0?(Ke/S*100).toFixed(1):"0.0";u(document.getElementById("apartmentsContribution"),`(${P}%)`);const ye=A>0?jt("apartment",A):0;u(document.getElementById("apartmentsValue"),te(ye)),u(document.getElementById("shopsOwnedStats"),O+"채"),u(document.getElementById("shopsLifetimeStats"),te(Ve));const de=S>0?(Ve/S*100).toFixed(1):"0.0";u(document.getElementById("shopsContribution"),`(${de}%)`);const l=O>0?jt("shop",O):0;u(document.getElementById("shopsValue"),te(l)),u(document.getElementById("buildingsOwnedStats"),N+"채"),u(document.getElementById("buildingsLifetimeStats"),te(He));const nt=S>0?(He/S*100).toFixed(1):"0.0";u(document.getElementById("buildingsContribution"),`(${nt}%)`);const ot=N>0?jt("building",N):0;u(document.getElementById("buildingsValue"),te(ot));const X=qs();u(document.getElementById("bestEfficiency"),X[0]||"-"),u(document.getElementById("secondEfficiency"),X[1]||"-"),u(document.getElementById("thirdEfficiency"),X[2]||"-"),Ks()}catch(t){console.error("Stats tab update failed:",t)}}let et=!1,ze=0,Ht=null;const Ds=1e4,Fs=7e3;function wn(t){if(!t||t<=0)return"—";const n=Math.floor(t/1e3/60);if(n<=0)return"1분 미만";const c=Math.floor(n/60),s=n%60;return c>0?s?`${c}시간 ${s}분`:`${c}시간`:`${s}분`}function Os(t){if(!t||t<=0)return"—";const n=Math.floor(t/1e3/60);if(n<=0)return"<1m";const c=Math.floor(n/60),s=n%60;return c>=100?`${c}h`:c>0?`${c}h ${String(s).padStart(2,"0")}m`:`${s}m`}async function kt(t=!1){const n=document.getElementById("leaderboardContainer");if(!n)return;if(!Tn()){n.innerHTML=`
          <div class="leaderboard-error">
            <div>리더보드 설정이 아직 완료되지 않았어요. 나중에 다시 확인해 주세요.</div>
          </div>
        `,et=!1,ze=Date.now();return}if(et&&!t){console.log("리더보드: 이미 로딩 중, 스킵");return}const c=Date.now();if(!t&&ze>0&&c-ze<Ds){console.log("리더보드: 최근 업데이트로부터 시간이 짧음, 스킵");return}Ht&&(clearTimeout(Ht),Ht=null),Ht=setTimeout(async()=>{et=!0,Ht=null;const s=setTimeout(()=>{if(et){console.error("리더보드: 타임아웃 발생"),n.innerHTML=`
              <div class="leaderboard-error">
                <div>리더보드 불러오기 실패 (타임아웃)</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;const a=n.querySelector(".leaderboard-retry-btn");a&&a.addEventListener("click",()=>{kt(!0)}),et=!1,ze=Date.now()}},Fs);try{n.innerHTML='<div class="leaderboard-loading">리더보드를 불러오는 중...</div>',console.log("리더보드: API 호출 시작");const a=await Js(10,"assets");if(clearTimeout(s),console.log("리더보드: API 응답 받음",a),!a.success){const E=a.error||"알 수 없는 오류",h=a.status,g=a.errorType;console.error("리더보드: API 오류",{errorMsg:E,status:h,errorType:g});let f="";g==="forbidden"||h===401||h===403?f="권한이 없어 리더보드를 불러올 수 없습니다.":g==="config"?f="리더보드 설정 오류: Supabase 설정을 확인해주세요.":g==="schema"?f="리더보드 테이블이 설정되지 않았습니다. 관리자에게 문의해주세요.":g==="network"?f="네트워크 오류로 리더보드를 불러올 수 없습니다.":f=`리더보드를 불러올 수 없습니다: ${E}`,n.innerHTML=`
              <div class="leaderboard-error">
                <div>${f}</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;const w=n.querySelector(".leaderboard-retry-btn");w&&w.addEventListener("click",()=>{kt(!0)}),et=!1,ze=Date.now();return}const i=a.data||[];if(i.length===0){console.log("리더보드: 기록 없음"),n.innerHTML='<div class="leaderboard-empty">리더보드에 아직 기록이 없습니다.</div>',et=!1,ze=Date.now();const E=document.getElementById("myRankContent");E&&(E.innerHTML=`
                <div class="leaderboard-my-rank-empty">
                  리더보드 기록이 아직 없습니다.
                </div>
              `);return}console.log("리더보드: 항목 수",i.length);const r=document.createElement("table");r.className="leaderboard-table";const m=document.createElement("thead");m.innerHTML=`
            <tr>
              <th class="col-rank">#</th>
              <th class="col-nickname">닉네임</th>
              <th class="col-assets">자산</th>
              <th class="col-playtime">시간</th>
            </tr>
          `,r.appendChild(m);const d=document.createElement("tbody");let p=null;const I=(ee||"").trim().toLowerCase();i.forEach((E,h)=>{const g=document.createElement("tr"),f=document.createElement("td");f.className="col-rank",f.textContent=String(h+1);const w=document.createElement("td");w.className="col-nickname";const S=E.tower_count||0,j=S>0?`${E.nickname||"익명"} 🗼${S>1?`x${S}`:""}`:E.nickname||"익명";w.textContent=j;const oe=document.createElement("td");oe.className="col-assets",oe.textContent=W(E.total_assets||0);const se=document.createElement("td");se.className="col-playtime",se.textContent=Os(E.play_time_ms||0);const me=(E.nickname||"").trim().toLowerCase();I&&I===me&&(g.classList.add("is-me"),p={rank:h+1,...E}),g.appendChild(f),g.appendChild(w),g.appendChild(oe),g.appendChild(se),d.appendChild(g)}),r.appendChild(d),n.innerHTML="",n.appendChild(r),ze=Date.now(),console.log("리더보드: 업데이트 완료");const y=document.getElementById("leaderboardLastUpdated");if(y){const E=new Date(ze),h=String(E.getHours()).padStart(2,"0"),g=String(E.getMinutes()).padStart(2,"0"),f=String(E.getSeconds()).padStart(2,"0");y.textContent=`마지막 갱신: ${h}:${g}:${f}`}const R=document.getElementById("myRankContent");if(R)if(!I)R.innerHTML=`
                <div class="leaderboard-my-rank-empty">
                  닉네임을 설정하면 내 순위와 기록이 여기 표시됩니다.
                </div>
              `;else if(p){const E=wn(p.play_time_ms||0),h=p.tower_count||0,g=h>0?`${p.nickname||ee||"익명"} 🗼${h>1?`x${h}`:""}`:p.nickname||ee||"익명";R.innerHTML=`
                <div class="my-rank-card">
                  <div class="my-rank-header">
                    <span class="my-rank-label">내 기록</span>
                    <span class="my-rank-rank-badge">${p.rank}위</span>
                  </div>
                  <div class="my-rank-main">
                    <div class="my-rank-name">${g}</div>
                    <div class="my-rank-assets">💰 ${W(p.total_assets||0)}</div>
                  </div>
                  <div class="my-rank-meta">
                    <span class="my-rank-playtime">⏱️ ${E}</span>
                    <span class="my-rank-note">TOP 10 내 순위</span>
                  </div>
                </div>
              `}else{console.log("[LB] 내 기록 조회 시작",{playerNickname:ee,currentNickLower:I});const E=await Ye();if(console.log("[LB] 로그인 상태 확인",{hasUser:!!E,userId:E==null?void 0:E.id}),!E){console.log("[LB] 로그인되지 않음, 로그인 버튼 표시"),R.innerHTML=`
                  <div class="leaderboard-my-rank-empty">
                    로그인 후에 내 순위를 볼 수 있습니다.
                    <div class="leaderboard-my-rank-actions">
                      <button type="button" class="btn" id="openLoginFromRanking">
                        🔐 Google로 로그인
                      </button>
                    </div>
                  </div>
                `;const h=document.getElementById("openLoginFromRanking");h&&h.addEventListener("click",async g=>{if(g.preventDefault(),!Tn()){alert("현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.");return}(await po("google")).ok?setTimeout(()=>kt(!0),1e3):alert("로그인에 실패했습니다. 다시 시도해 주세요.")});return}console.log("[LB] 로그인 확인됨, 내 순위 조회 시작"),R.innerHTML=`
                <div class="leaderboard-my-rank-loading">
                  내 순위를 불러오는 중...
                </div>
              `;try{const h=await ko(ee,"assets");if(console.log("[LB] 내 순위 조회 결과",{success:h.success,errorType:h.errorType,hasData:!!h.data}),!h.success||!h.data){let g="";if(h.errorType==="forbidden")console.warn("[LB] 권한 부족으로 내 순위 조회 실패"),g=`
                      <div class="leaderboard-my-rank-empty">
                        로그인 후에 내 순위를 볼 수 있습니다.
                        <div class="leaderboard-my-rank-actions">
                          <button type="button" class="btn" id="openLoginFromRanking">
                            🔐 Google로 로그인
                          </button>
                        </div>
                      </div>
                    `;else if(h.errorType==="network")console.error("[LB] 네트워크 오류로 내 순위 조회 실패"),g=`
                      <div class="leaderboard-my-rank-error">
                        네트워크 오류로 내 순위를 불러올 수 없습니다.
                      </div>
                    `;else if(h.errorType==="not_found"){if(console.log("[LB] 리더보드에 기록 없음, 리더보드 업데이트 시도"),E&&ee)try{const w=$+Wt(),S=Date.now()-Be,j=we+S;console.log("[LB] 리더보드 업데이트 시도",{nickname:ee,totalAssets:w,totalPlayTimeMs:j,towerCount:ke});const oe=await Mn(ee,w,j,ke);if(oe.success){console.log("[LB] 리더보드 업데이트 성공, 다시 조회");const se=await ko(ee,"assets");if(se.success&&se.data){const me=se.data,tt=wn(me.play_time_ms||0),U=me.tower_count||0,$e=U>0?`${me.nickname||ee||"익명"} 🗼${U>1?`x${U}`:""}`:me.nickname||ee||"익명";R.innerHTML=`
                              <div class="my-rank-card">
                                <div class="my-rank-header">
                                  <span class="my-rank-label">내 기록</span>
                                  <span class="my-rank-rank-badge">${me.rank}위</span>
                                </div>
                                <div class="my-rank-main">
                                  <div class="my-rank-name">${$e}</div>
                                  <div class="my-rank-assets">💰 ${W(me.total_assets||0)}</div>
                                </div>
                                <div class="my-rank-meta">
                                  <span class="my-rank-playtime">⏱️ ${tt}</span>
                                  <span class="my-rank-note">내 실제 순위</span>
                                </div>
                              </div>
                            `;return}}else console.error("[LB] 리더보드 업데이트 실패",oe.error)}catch(w){console.error("[LB] 리더보드 업데이트 중 오류",w)}g=`
                      <div class="leaderboard-my-rank-empty">
                        아직 리더보드에 기록이 없습니다.<br />
                        게임을 플레이하고 저장하면 순위가 표시됩니다.
                      </div>
                    `}else console.error("[LB] 내 순위 조회 실패",h.errorType),g=`
                      <div class="leaderboard-my-rank-error">
                        내 순위를 불러올 수 없습니다.
                      </div>
                    `;R.innerHTML=g;const f=document.getElementById("openLoginFromRanking");f&&f.addEventListener("click",async w=>{if(w.preventDefault(),!Tn()){alert("현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.");return}(await po("google")).ok?setTimeout(()=>kt(!0),1e3):alert("로그인에 실패했습니다. 다시 시도해 주세요.")})}else{const g=h.data;console.log("[LB] 내 순위 조회 성공",{rank:g.rank,nickname:g.nickname});const f=wn(g.play_time_ms||0),w=g.tower_count||0,S=w>0?`${g.nickname||ee||"익명"} 🗼${w>1?`x${w}`:""}`:g.nickname||ee||"익명";R.innerHTML=`
                    <div class="my-rank-card">
                      <div class="my-rank-header">
                        <span class="my-rank-label">내 기록</span>
                        <span class="my-rank-rank-badge">${g.rank}위</span>
                      </div>
                      <div class="my-rank-main">
                        <div class="my-rank-name">${S}</div>
                        <div class="my-rank-assets">💰 ${W(g.total_assets||0)}</div>
                      </div>
                      <div class="my-rank-meta">
                        <span class="my-rank-playtime">⏱️ ${f}</span>
                        <span class="my-rank-note">내 실제 순위</span>
                      </div>
                    </div>
                  `}}catch(h){console.error("[LB] 내 순위 RPC 호출 실패:",h),R.innerHTML=`
                  <div class="leaderboard-my-rank-error">
                    내 순위를 불러오는 중 오류가 발생했습니다.
                  </div>
                `}}}catch(a){clearTimeout(s),console.error("리더보드 UI 업데이트 실패:",a),n.innerHTML=`<div class="leaderboard-error">리더보드를 불러오는 중 오류가 발생했습니다: ${a.message||"알 수 없는 오류"}</div>`,ze=Date.now()}finally{et=!1}},t?0:300)}async function Ns(){if(!ee){console.log("[LB] 리더보드 업데이트 스킵: 닉네임 없음");return}if(ke>0){console.log("[LB] 리더보드 업데이트 스킵: 타워 달성 후 자동 업데이트 중단");return}try{const t=await Ye();if(!t){console.log("[LB] 리더보드 업데이트 스킵: 로그인되지 않음");return}const n=$+Wt(),c=Date.now()-Be,s=we+c;console.log("[LB] 리더보드 업데이트 시도",{nickname:ee,totalAssets:n,totalPlayTimeMs:s,towerCount:ke,userId:t.id});const a=await Mn(ee,n,s,ke);a.success?console.log("[LB] 리더보드 업데이트 성공"):console.error("[LB] 리더보드 업데이트 실패",a.error)}catch(t){console.error("[LB] 리더보드 업데이트 예외 발생:",t)}}function Gt(t,n){let c=0;for(let s=0;s<n;s++)c+=z(t,s);return c}function jt(t,n){let c=0;for(let s=0;s<n;s++)c+=Y(t,s);return c}function Us(){const t={savings:{id:"savingsOwnedStats",name:"적금"},bond:{id:"bondsOwnedStats",name:"주식"},usStock:{id:"usStocksOwnedStats",name:"미국주식"},crypto:{id:"cryptosOwnedStats",name:"코인"}},n={villa:{id:"villasOwnedStats",name:"빌라"},officetel:{id:"officetelsOwnedStats",name:"오피스텔"},apartment:{id:"apartmentsOwnedStats",name:"아파트"},shop:{id:"shopsOwnedStats",name:"상가"},building:{id:"buildingsOwnedStats",name:"빌딩"}};Object.keys(t).forEach(c=>{const s=t[c],a=document.getElementById(s.id);if(a){const i=a.closest(".asset-row");if(i){const r=!Q(c);i.classList.toggle("locked",r)}}}),Object.keys(n).forEach(c=>{const s=n[c],a=document.getElementById(s.id);if(a){const i=a.closest(".asset-row");if(i){const r=!Q(c);i.classList.toggle("locked",r)}}})}function Wt(){let t=0;return M>0&&(t+=z("deposit",M-1)),_>0&&(t+=z("savings",_-1)),x>0&&(t+=z("bond",x-1)),D>0&&(t+=Y("villa",D-1)),F>0&&(t+=Y("officetel",F-1)),A>0&&(t+=Y("apartment",A-1)),O>0&&(t+=Y("shop",O-1)),N>0&&(t+=Y("building",N-1)),t}function qs(){const t=[];return M>0&&t.push({name:"예금",efficiency:b.deposit,count:M}),_>0&&t.push({name:"적금",efficiency:b.savings,count:_}),x>0&&t.push({name:"국내주식",efficiency:b.bond,count:x}),H>0&&t.push({name:"미국주식",efficiency:b.usStock,count:H}),K>0&&t.push({name:"코인",efficiency:b.crypto,count:K}),D>0&&t.push({name:"빌라",efficiency:v.villa*Ee,count:D}),F>0&&t.push({name:"오피스텔",efficiency:v.officetel*Ee,count:F}),A>0&&t.push({name:"아파트",efficiency:v.apartment*Ee,count:A}),O>0&&t.push({name:"상가",efficiency:v.shop*Ee,count:O}),N>0&&t.push({name:"빌딩",efficiency:v.building*Ee,count:N}),t.sort((n,c)=>c.efficiency-n.efficiency),t.slice(0,3).map(n=>`${n.name} (${T(Math.floor(n.efficiency))}원/초, ${n.count}개 보유)`)}function Ks(){const t=document.getElementById("achievementGrid");if(!t)return;if(!window.__achievementTooltipPortalInitialized){window.__achievementTooltipPortalInitialized=!0;const s=()=>{let m=document.getElementById("achievementTooltip");return m||(m=document.createElement("div"),m.id="achievementTooltip",m.className="achievement-tooltip",m.setAttribute("role","tooltip"),m.setAttribute("aria-hidden","true"),document.body.appendChild(m)),m},a=m=>{const d=Xe.find(p=>p.id===m);return d?d.unlocked?`${d.name}
${d.desc}
✅ 달성!`:`${d.name}
${d.desc}
🔒 미달성`:""},i=()=>{const m=document.getElementById("achievementTooltip");m&&(m.classList.remove("active","bottom"),m.style.left="",m.style.top="",m.style.bottom="",m.style.opacity="",m.style.visibility="",m.style.pointerEvents="",m.setAttribute("aria-hidden","true"),window.__achievementTooltipAnchorId=null)},r=m=>{var w,S;const d=s(),p=((w=m==null?void 0:m.dataset)==null?void 0:w.achievementId)||((S=m==null?void 0:m.id)==null?void 0:S.replace(/^ach_/,""));if(!p)return;if(window.__achievementTooltipAnchorId===p&&d.classList.contains("active")){i();return}i(),d.textContent=a(p),d.setAttribute("aria-hidden","false"),d.classList.add("active"),d.style.opacity="0",d.style.visibility="hidden",d.style.pointerEvents="none",d.style.left="0px",d.style.top="0px",d.style.bottom="auto",d.offsetHeight;const I=d.getBoundingClientRect(),y=m.getBoundingClientRect(),R=window.innerWidth,E=window.innerHeight;let h=y.left+y.width/2,g=y.top-I.height-8,f=!1;g<10&&(g=y.bottom+8,f=!0),g+I.height>E-10&&(g=E-I.height-10),h+I.width/2>R-10&&(h=R-I.width/2-10),h-I.width/2<10&&(h=I.width/2+10),d.style.left=`${h}px`,d.style.top=`${g}px`,d.style.bottom="auto",d.classList.toggle("bottom",f),d.style.visibility="visible",d.style.opacity="1",d.style.pointerEvents="none",window.__achievementTooltipAnchorId=p};t.addEventListener("click",m=>{const d=m.target.closest(".achievement-icon");d&&(m.stopPropagation(),r(d))}),t.addEventListener("pointerout",m=>{var p,I;(I=(p=m.target).closest)!=null&&I.call(p,".achievement-icon")&&i()}),document.addEventListener("click",()=>i(),!0),window.addEventListener("scroll",()=>i(),!0),window.addEventListener("resize",()=>i(),!0)}if(t.children.length>0){let s=0;Object.values(Xe).forEach(i=>{const r=document.getElementById("ach_"+i.id);r&&(i.unlocked?(r.classList.add("unlocked"),r.classList.remove("locked"),s++):(r.classList.add("locked"),r.classList.remove("unlocked")),r.title=i.unlocked?`${i.name}
${i.desc}
✅ 달성!`:`${i.name}
${i.desc}
🔒 미달성`)});const a=Object.keys(Xe).length;u(document.getElementById("achievementProgress"),`${s}/${a}`);return}t.innerHTML="";let n=0;const c=Object.keys(Xe).length;Object.values(Xe).forEach(s=>{const a=document.createElement("div");a.className="achievement-icon",a.id="ach_"+s.id,a.dataset.achievementId=s.id,a.textContent=s.icon,a.title=s.unlocked?`${s.name}
${s.desc}
✅ 달성!`:`${s.name}
${s.desc}
🔒 미달성`,s.unlocked?(a.classList.add("unlocked"),n++):a.classList.add("locked"),t.appendChild(a)}),u(document.getElementById("achievementProgress"),`${n}/${c}`)}let ht=null,dn=null;function Bn(){return window.matchMedia&&window.matchMedia("(min-width: 769px)").matches}function _n(){const t=document.getElementById("rankingTab");if(!t||!Bn()&&!t.classList.contains("active")||ht)return;kt(!0);const c=6e4-Date.now()%6e4;ht=setTimeout(function s(){const a=t.classList.contains("active");if(!Bn()&&!a){xn();return}kt(!1),ht=setTimeout(s,6e4)},c)}function xn(){ht&&(clearTimeout(ht),ht=null)}function Vs(){const t=document.getElementById("rankingTab"),n=document.getElementById("leaderboardContainer");if(!(!t||!n)){if(!("IntersectionObserver"in window)){console.log("IntersectionObserver 미지원: active 탭 기준으로만 리더보드 폴링 제어");return}dn&&dn.disconnect(),dn=new IntersectionObserver(c=>{c.forEach(s=>{const a=s.isIntersecting,i=t.classList.contains("active");(Bn()?a:a&&i)?_n():xn()})},{root:null,threshold:.1}),dn.observe(n)}}const mo=document.querySelectorAll(".nav-btn"),Hs=document.querySelectorAll(".tab-content");mo.forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-tab");Hs.forEach(s=>s.classList.remove("active")),mo.forEach(s=>s.classList.remove("active"));const c=document.getElementById(n);c&&c.classList.add("active"),t.classList.add("active"),n==="rankingTab"?_n():xn()})}),re(),setTimeout(()=>{const t=document.getElementById("rankingTab");t&&t.classList.contains("active")&&_n(),Vs()},1e3);const fo=document.getElementById("upgradeList");fo&&(fo.classList.remove("collapsed-section"),console.log("✅ Upgrade list initialized and opened")),gt(),console.log("=== UPGRADE SYSTEM DEBUG ==="),console.log("Total upgrades defined:",Object.keys(J).length),console.log("Unlocked upgrades:",Object.values(J).filter(t=>t.unlocked).length),console.log("Purchased upgrades:",Object.values(J).filter(t=>t.purchased).length),console.log("First 3 upgrades:",Object.entries(J).slice(0,3).map(([t,n])=>({id:t,unlocked:n.unlocked,purchased:n.purchased,cost:n.cost}))),console.log("==========================="),window.cheat={addCash:t=>{$+=t,re(),console.log(`💰 Added ${t} cash. New total: ${$}`)},unlockAllUpgrades:()=>{var t;Object.values(J).forEach(n=>n.unlocked=!0),gt(),console.log("🔓 All upgrades unlocked!"),console.log("Upgrade list element:",document.getElementById("upgradeList")),console.log("Upgrade list children:",(t=document.getElementById("upgradeList"))==null?void 0:t.children.length)},unlockFirstUpgrade:()=>{const t=Object.keys(J)[0];J[t].unlocked=!0,gt(),console.log("🔓 First upgrade unlocked:",J[t].name)},setClicks:t=>{ae=t,re(),Xn(),console.log(`👆 Set clicks to ${t}`)},testUpgrade:()=>{var n;const t=Object.keys(J)[0];J[t].unlocked=!0,$+=1e7,gt(),re(),console.log("🧪 Test setup complete:"),console.log("  - First upgrade unlocked"),console.log("  - Cash: 1000만원"),console.log("  - Upgrade list visible:",!((n=document.getElementById("upgradeList"))!=null&&n.classList.contains("collapsed-section"))),console.log("  - Upgrade items count:",document.querySelectorAll(".upgrade-item").length)}},console.log("💡 치트 코드 사용 가능:"),console.log("  - cheat.testUpgrade() : 빠른 테스트 (첫 업그레이드 해금 + 1000만원)"),console.log("  - cheat.addCash(1000000000) : 10억원 추가"),console.log("  - cheat.unlockAllUpgrades() : 모든 업그레이드 해금"),console.log("  - cheat.setClicks(100) : 클릭 수 설정"),C("🧪 v2.6 Cookie Clicker 스타일 업그레이드 시스템 구현 완료"),C("✅ DOM 참조 오류 수정 완료"),C("✅ 커리어 진행률 시스템 정상화"),C("✅ 업그레이드 클릭 기능 활성화"),C("✅ 자동 저장 시스템 작동 중"),C("⚡ 성능 최적화: 업그레이드 리스트 깜빡임 해결"),console.log("Initial state:",{cash:$,totalClicks:ae,deposits:M,savings:_,bonds:x,villas:D,officetels:F,apartments:A,shops:O,buildings:N})});
