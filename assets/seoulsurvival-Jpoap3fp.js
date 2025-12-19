import{i as yo,g as ht,a as ct,o as Hs,b as _n,s as fo}from"./authBoot-BnOC8kKe.js";import"https://esm.sh/@supabase/supabase-js@2.49.1";function Gs(I,u){try{return localStorage.setItem(I,JSON.stringify(u)),!0}catch{return!1}}function js(I,u=null){try{const K=localStorage.getItem(I);return K?JSON.parse(K):u}catch{return u}}const ko="game_saves";function ho(I){return I?{message:(I==null?void 0:I.message)||String(I),code:I==null?void 0:I.code,details:I==null?void 0:I.details,hint:I==null?void 0:I.hint}:null}function bo(I){const u=String((I==null?void 0:I.message)||"").toLowerCase();return u.includes("does not exist")||u.includes("relation")||u.includes("42p01")}async function go(I){if(!yo())return{ok:!1,reason:"not_configured"};const u=ht();if(!u)return{ok:!1,reason:"not_configured"};const K=await ct();if(!K)return{ok:!1,reason:"not_signed_in"};const{data:S,error:B}=await u.from(ko).select("save, save_ts, updated_at").eq("user_id",K.id).eq("game_slug",I).maybeSingle();return B?{ok:!1,reason:bo(B)?"missing_table":"query_failed",error:ho(B)}:S?{ok:!0,found:!0,save:S.save,save_ts:S.save_ts,updated_at:S.updated_at}:{ok:!0,found:!1}}async function po(I,u){if(!yo())return{ok:!1,reason:"not_configured"};const K=ht();if(!K)return{ok:!1,reason:"not_configured"};const S=await ct();if(!S)return{ok:!1,reason:"not_signed_in"};const B=Number((u==null?void 0:u.ts)||Date.now())||Date.now(),D={user_id:S.id,game_slug:I,save:u,save_ts:B};(u==null?void 0:u.nickname)!==void 0?console.log("☁️ 클라우드 저장: 닉네임 포함됨:",u.nickname||"(빈 문자열)"):console.warn("⚠️ 클라우드 저장: 닉네임 필드가 없음");const{error:H}=await K.from(ko).upsert(D,{onConflict:"user_id,game_slug"});return H?{ok:!1,reason:bo(H)?"missing_table":"upsert_failed",error:ho(H)}:{ok:!0}}const un="seoulsurvival";function Tn(I){return(I||"").trim()}async function Ws(I){const u=ht();if(!u)return console.warn("Leaderboard: Supabase client not configured for nickname check"),{taken:!1,reason:"not_configured"};const S=Tn(I).toLowerCase();if(!S)return{taken:!1,reason:"empty"};try{const{data:B,error:D}=await u.from("leaderboard").select("nickname").eq("game_slug",un).ilike("nickname",S).limit(1);return D?(console.error("Nickname check error:",D),{taken:!1,reason:"error"}):{taken:!!(B&&B.length>0)}}catch(B){return console.error("Nickname check exception:",B),{taken:!1,reason:"exception"}}}async function $o(I,u,K){try{const S=await ct();if(!S)return console.log("Leaderboard: User not logged in, skipping update"),{success:!1,error:"Not logged in"};const B=ht(),{data:D,error:H}=await B.from("leaderboard").upsert({user_id:S.id,game_slug:un,nickname:I||"익명",total_assets:u,play_time_ms:K,updated_at:new Date().toISOString()},{onConflict:"user_id,game_slug"}).select().single();return H?(console.error("Leaderboard update error:",H),{success:!1,error:H.message}):(console.log("Leaderboard updated:",D),{success:!0,data:D})}catch(S){return console.error("Leaderboard update exception:",S),{success:!1,error:S.message}}}async function zs(I=10,u="assets"){var K,S,B,D,H,pe;try{const G=ht();if(!G)return console.error("Leaderboard: Supabase client not configured"),console.warn("[LB] fetch failed",{reason:"not_configured",phase:"init"}),{success:!1,error:"Supabase가 설정되지 않았습니다. shared/auth/config.js를 확인해주세요.",data:[],errorType:"config"};let Ae=G.from("leaderboard").select("nickname, total_assets, play_time_ms, updated_at").eq("game_slug",un).limit(I);u==="assets"?Ae=Ae.order("total_assets",{ascending:!1}):u==="playtime"&&(Ae=Ae.order("play_time_ms",{ascending:!1}));const{data:Ce,error:fe}=await Ae;if(fe){console.error("Leaderboard fetch error:",fe);const Ie=fe.status??fe.code??null,Y=fe.code==="PGRST116"||((K=fe.message)==null?void 0:K.includes("relation"))||((S=fe.message)==null?void 0:S.includes("does not exist")),De=Ie===401||Ie===403||((D=(B=fe.message)==null?void 0:B.toLowerCase)==null?void 0:D.call(B).includes("permission denied"))||((pe=(H=fe.message)==null?void 0:H.toLowerCase)==null?void 0:pe.call(H).includes("rls"));return console.warn("[LB] fetch failed",{phase:"select",status:Ie,code:fe.code,message:fe.message,details:fe.details,hint:fe.hint}),Y?{success:!1,error:"리더보드 테이블이 없습니다. Supabase SQL Editor에서 supabase/leaderboard.sql을 실행해주세요.",data:[],errorType:"schema",status:Ie}:De?{success:!1,error:"권한이 없어 리더보드를 불러올 수 없습니다.",data:[],errorType:"forbidden",status:Ie}:{success:!1,error:fe.message,data:[],errorType:"generic",status:Ie}}return{success:!0,data:Ce||[]}}catch(G){return console.error("Leaderboard fetch exception:",G),console.warn("[LB] fetch failed",{phase:"exception",message:G==null?void 0:G.message,error:G}),{success:!1,error:G.message||"알 수 없는 오류",data:[],errorType:"network"}}}async function Ys(I,u="assets"){const K=ht();if(!K)return console.warn("[LB] my_rank failed",{reason:"not_configured"}),{success:!1,data:null,errorType:"config"};const B=Tn(I).toLowerCase();if(!B)return{success:!1,data:null,errorType:"no_nickname"};try{const{data:D,error:H,status:pe}=await K.rpc("get_my_rank",{p_game_slug:un,p_nickname:B,p_sort_by:u});if(H){console.error("My rank RPC error:",H),console.warn("[LB] my_rank failed",{phase:"rpc",status:pe??H.status,code:H.code,message:H.message,details:H.details,hint:H.hint});const Ae=pe===401||pe===403?"forbidden":"generic";return{success:!1,data:null,error:H.message,errorType:Ae,status:pe??H.status}}const G=Array.isArray(D)?D[0]:D;return G?{success:!0,data:{rank:G.rank,nickname:G.nickname,total_assets:G.total_assets,play_time_ms:G.play_time_ms}}:{success:!1,data:null,errorType:"not_found"}}catch(D){return console.error("My rank RPC exception:",D),console.warn("[LB] my_rank failed",{phase:"exception",message:D==null?void 0:D.message,error:D}),{success:!1,data:null,error:D.message||"알 수 없는 오류",errorType:"network"}}}const Js=""+new URL("work_bg_01_alba_night-Db0rzBPq.png",import.meta.url).href,Qs=""+new URL("work_bg_02_gyeyakjik_night-DOcTIOmf.png",import.meta.url).href,Xs=""+new URL("work_bg_03_sawon_night-C5FuvRVs.png",import.meta.url).href,Zs=""+new URL("work_bg_04_daeri_night-BsoSfDAg.png",import.meta.url).href,ec=""+new URL("work_bg_05_gwajang_night-CcE0KsfB.png",import.meta.url).href,tc=""+new URL("work_bg_06_chajang_night-CnOFWkRx.png",import.meta.url).href,nc=""+new URL("work_bg_07_bujang_night-0BAHlWBE.png",import.meta.url).href,oc=""+new URL("work_bg_08_sangmu_night-CEIOpmTg.png",import.meta.url).href,sc=""+new URL("work_bg_09_jeonmu_night-BHVf_WEo.png",import.meta.url).href,cc=""+new URL("work_bg_10_ceo_night-BG1qCML1.png",import.meta.url).href,xn=location.hostname==="localhost"||location.hostname==="127.0.0.1";xn||(console.log=()=>{},console.warn=()=>{},console.error=()=>{});function ic(){const I=navigator.userAgent||"",u=I.includes("KAKAOTALK"),K=I.includes("Instagram"),S=I.includes("FBAN")||I.includes("FBAV"),B=I.includes("Line"),D=I.includes("MicroMessenger");return{isInApp:u||K||S||B||D,isKakao:u,isInstagram:K,isFacebook:S,isLine:B,isWeChat:D}}function ac(){const{isInApp:I}=ic();if(!I)return;const u=document.createElement("div");u.className="inapp-warning-banner",u.innerHTML=`
    이 브라우저에서는 Google 로그인이 제한될 수 있습니다.<br />
    <strong>Chrome / Safari 등 기본 브라우저에서 다시 열어 주세요.</strong>
    <div class="inapp-warning-actions">
      <button type="button" class="btn-small" id="copyGameUrlBtn">URL 복사</button>
      <button type="button" class="btn-small" id="closeInappWarningBtn">확인</button>
    </div>
  `,document.body.prepend(u);const K=u.querySelector("#copyGameUrlBtn");K&&K.addEventListener("click",async()=>{const B="https://clicksurvivor.com/seoulsurvival/";try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(B),alert(`주소가 복사되었습니다.
Chrome/Safari 주소창에 붙여넣어 열어 주세요.`);return}const D=document.createElement("textarea");D.value=B,D.style.position="fixed",D.style.left="-999999px",D.style.top="-999999px",document.body.appendChild(D),D.focus(),D.select();try{if(document.execCommand("copy"))alert(`주소가 복사되었습니다.
Chrome/Safari 주소창에 붙여넣어 열어 주세요.`);else throw new Error("execCommand failed")}catch{alert(B+`
위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.`)}finally{document.body.removeChild(D)}}catch{alert(B+`
위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.`)}});const S=u.querySelector("#closeInappWarningBtn");S&&S.addEventListener("click",()=>{u.remove()})}document.addEventListener("DOMContentLoaded",()=>{var mo;function I(){const t=document.querySelector("header");if(!t)return;const n=Math.ceil(t.getBoundingClientRect().height||0);n>0&&document.documentElement.style.setProperty("--header-h",`${n}px`)}I(),ac(),window.addEventListener("resize",I);try{(mo=window.visualViewport)==null||mo.addEventListener("resize",I)}catch{}try{const t=document.querySelector("header");t&&"ResizeObserver"in window&&new ResizeObserver(I).observe(t)}catch{}try{const t=n=>n.preventDefault();document.addEventListener("gesturestart",t,{passive:!1}),document.addEventListener("gesturechange",t,{passive:!1}),document.addEventListener("gestureend",t,{passive:!1})}catch{}function u(t,n){t&&t.textContent!==void 0&&(t.textContent=n)}function K(t,n,c){const s=ee;if(le==="buy"){const i=t==="financial"?Y(n,c)*s:J(n,c,s);if(y<i)return C(`💸 자금이 부족합니다. (필요: ${S(i)}원)`),{success:!1,newCount:c};y-=i;const a=c+s,r=t==="financial"?"개":"채",d={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인",villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"}[n]||n;C(`✅ ${d} ${s}${r}를 구입했습니다. (보유 ${a}${r})`);const p={deposit:"💰",savings:"🏦",bond:"📈",usStock:"🇺🇸",crypto:"₿",villa:"🏠",officetel:"🏢",apartment:"🏘️",shop:"🏪",building:"🏙️"};return $e.particles&&Xn(p[n]||"🏠",s),{success:!0,newCount:a}}else if(le==="sell"){if(c<s)return C(`❌ 판매할 수량이 부족합니다. (보유: ${c})`),{success:!1,newCount:c};const i=t==="financial"?De(n,c)*s:it(n,c,s);y+=i;const a=c-s,r=t==="financial"?"개":"채",d={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인",villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"}[n]||n;return C(`💰 ${d} ${s}${r}를 판매했습니다. (+${S(i)}원, 보유 ${a}${r})`),{success:!0,newCount:a}}return{success:!1,newCount:c}}function S(t){if(t>=1e12){const n=(t/1e12).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"조"}else if(t>=1e8){const n=(t/1e8).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"억"}else if(t>=1e4){const n=(t/1e4).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"만"}else if(t>=1e3){const n=(t/1e3).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"천"}else return Math.floor(t).toString()}function B(t){return $e.shortNumbers?t>=1e12?(t/1e12).toLocaleString("ko-KR",{minimumFractionDigits:2,maximumFractionDigits:2})+"조":t>=1e8?(t/1e8).toLocaleString("ko-KR",{minimumFractionDigits:2,maximumFractionDigits:2})+"억":t>=1e4?(t/1e4).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"만원":t>=1e3?Math.floor(t/1e3).toLocaleString("ko-KR")+"천원":Math.floor(t).toLocaleString("ko-KR")+"원":Math.floor(t).toLocaleString("ko-KR")+"원"}function D(t){return B(t)}function H(t){return t>=1e8?Math.round(t/1e8).toLocaleString("ko-KR")+"억":t>=1e4?Math.round(t/1e4).toLocaleString("ko-KR")+"만":t>=1e3?Math.round(t/1e3).toLocaleString("ko-KR")+"천":Math.floor(t).toLocaleString("ko-KR")}function pe(t){return t>=1e8?(Math.round(t/1e7)/10).toLocaleString("ko-KR")+"억":t>=1e4?Math.round(t/1e4).toLocaleString("ko-KR")+"만":Math.floor(t).toLocaleString("ko-KR")}function G(t){return B(t)}function Ae(t){return t>=1e12?(t/1e12).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"조":t>=1e8?(t/1e8).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"억":t>=1e4?(t/1e4).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"만":t>=1e3?(t/1e3).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"천":Math.floor(t).toString()}function Ce(t){return $e.shortNumbers?Ae(t)+"원":Math.floor(t).toLocaleString("ko-KR")+"원"}const fe={deposit:5e4,savings:5e5,bond:5e6,usStock:25e6,crypto:1e8},Ie={villa:25e7,officetel:35e7,apartment:8e8,shop:12e8,building:3e9,tower:1e12};function Y(t,n,c=1){const s=fe[t];let i=0;for(let a=0;a<c;a++){const r=n+a;let m=s*Math.pow(1.05,r);i+=m}return Math.floor(i)}function De(t,n,c=1){if(n<=0)return 0;let s=0;for(let i=0;i<c&&!(n-i<=0);i++){const a=Y(t,n-i-1,1);s+=Math.floor(a*1)}return s}function J(t,n,c=1){const s=Ie[t];if(!s)return 0;if(t==="tower")return s*c;let i=0;for(let a=0;a<c;a++){const r=n+a;let m=s*Math.pow(1.05,r);i+=m}return Math.floor(i)}function it(t,n,c=1){if(t==="tower"||n<=0)return 0;let s=0;for(let i=0;i<c&&!(n-i<=0);i++){const a=J(t,n-i-1,1);s+=Math.floor(a*1)}return s}let y=0,Be=0,Fe=Date.now(),Xe=Date.now(),T=0,_=0,x=0,V=0,q=0,Oe=0,Ne=0,Ue=0,qe=0,Ke=0,Ve=0,He=0,Ge=0,je=0,We=0,le="buy",ee=1;const _e="seoulTycoonSaveV1",jt="ss_blockCloudRestoreUntilNicknameDone",mn="ss_skipCloudRestoreOnce";let Wt=new Date,ae="",dt=!1;const Q={part_time_job:{name:"🍕 아르바이트 경험",desc:"클릭 수익 1.2배",cost:5e4,icon:"🍕",unlockCondition:()=>j>=1,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},internship:{name:"📝 인턴십",desc:"클릭 수익 1.2배",cost:2e5,icon:"📝",unlockCondition:()=>j>=2,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},efficient_work:{name:"⚡ 효율적인 업무 처리",desc:"클릭 수익 1.2배",cost:5e5,icon:"⚡",unlockCondition:()=>j>=3,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},focus_training:{name:"🎯 집중력 강화",desc:"클릭 수익 1.2배",cost:2e6,icon:"🎯",unlockCondition:()=>j>=4,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},professional_education:{name:"📚 전문 교육",desc:"클릭 수익 1.2배",cost:1e7,icon:"📚",unlockCondition:()=>j>=5,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},performance_bonus:{name:"💰 성과급",desc:"2% 확률로 10배 수익",cost:1e7,icon:"💰",unlockCondition:()=>j>=6,effect:()=>{},category:"labor",unlocked:!1,purchased:!1},career_recognition:{name:"💼 경력 인정",desc:"클릭 수익 1.2배",cost:3e7,icon:"💼",unlockCondition:()=>j>=6,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},overtime_work:{name:"🔥 초과근무",desc:"클릭 수익 1.2배",cost:5e7,icon:"🔥",unlockCondition:()=>j>=7,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},honor_award:{name:"🎖️ 명예상",desc:"클릭 수익 1.2배",cost:1e8,icon:"🎖️",unlockCondition:()=>j>=7,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},expertise_development:{name:"💎 전문성 개발",desc:"클릭 수익 1.2배",cost:2e8,icon:"💎",unlockCondition:()=>j>=8,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},teamwork:{name:"🤝 팀워크 향상",desc:"클릭 수익 1.2배",cost:5e8,icon:"🤝",unlockCondition:()=>j>=8,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},leadership:{name:"👑 리더십",desc:"클릭 수익 1.2배",cost:2e9,icon:"👑",unlockCondition:()=>j>=8,effect:()=>{de*=1.2},category:"labor",unlocked:!1,purchased:!1},ceo_privilege:{name:"👔 CEO 특권",desc:"클릭 수익 2.0배",cost:1e10,icon:"👔",unlockCondition:()=>j>=9,effect:()=>{de*=2},category:"labor",unlocked:!1,purchased:!1},global_experience:{name:"🌍 글로벌 경험",desc:"클릭 수익 2.0배",cost:5e10,icon:"🌍",unlockCondition:()=>j>=9&&te>=15e3,effect:()=>{de*=2},category:"labor",unlocked:!1,purchased:!1},entrepreneurship:{name:"🚀 창업",desc:"클릭 수익 2.0배",cost:1e11,icon:"🚀",unlockCondition:()=>j>=9&&te>=3e4,effect:()=>{de*=2},category:"labor",unlocked:!1,purchased:!1},deposit_boost_1:{name:"💰 예금 이자율 상승",desc:"예금 수익 2배",cost:1e5,icon:"💰",unlockCondition:()=>T>=5,effect:()=>{h.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_2:{name:"💎 프리미엄 예금",desc:"예금 수익 2배",cost:25e4,icon:"💎",unlockCondition:()=>T>=15,effect:()=>{h.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_3:{name:"💠 다이아몬드 예금",desc:"예금 수익 2배",cost:5e5,icon:"💠",unlockCondition:()=>T>=30,effect:()=>{h.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_4:{name:"💍 플래티넘 예금",desc:"예금 수익 2배",cost:1e6,icon:"💍",unlockCondition:()=>T>=40,effect:()=>{h.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_5:{name:"👑 킹 예금",desc:"예금 수익 2배",cost:2e6,icon:"👑",unlockCondition:()=>T>=50,effect:()=>{h.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},savings_boost_1:{name:"🏦 적금 복리 효과",desc:"적금 수익 2배",cost:1e6,icon:"🏦",unlockCondition:()=>_>=5,effect:()=>{h.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_2:{name:"🏅 골드 적금",desc:"적금 수익 2배",cost:25e5,icon:"🏅",unlockCondition:()=>_>=15,effect:()=>{h.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_3:{name:"💍 플래티넘 적금",desc:"적금 수익 2배",cost:5e6,icon:"💍",unlockCondition:()=>_>=30,effect:()=>{h.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_4:{name:"💠 다이아몬드 적금",desc:"적금 수익 2배",cost:1e7,icon:"💠",unlockCondition:()=>_>=40,effect:()=>{h.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_5:{name:"👑 킹 적금",desc:"적금 수익 2배",cost:2e7,icon:"👑",unlockCondition:()=>_>=50,effect:()=>{h.savings*=2},category:"savings",unlocked:!1,purchased:!1},bond_boost_1:{name:"📈 주식 수익률 향상",desc:"주식 수익 2배",cost:1e7,icon:"📈",unlockCondition:()=>x>=5,effect:()=>{h.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_2:{name:"💹 프리미엄 주식",desc:"주식 수익 2배",cost:25e6,icon:"💹",unlockCondition:()=>x>=15,effect:()=>{h.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_3:{name:"📊 블루칩 주식",desc:"주식 수익 2배",cost:5e7,icon:"📊",unlockCondition:()=>x>=30,effect:()=>{h.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_4:{name:"💎 대형주 포트폴리오",desc:"주식 수익 2배",cost:1e8,icon:"💎",unlockCondition:()=>x>=40,effect:()=>{h.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_5:{name:"👑 킹 주식",desc:"주식 수익 2배",cost:2e8,icon:"👑",unlockCondition:()=>x>=50,effect:()=>{h.bond*=2},category:"bond",unlocked:!1,purchased:!1},usstock_boost_1:{name:"🇺🇸 S&P 500 투자",desc:"미국주식 수익 2배",cost:5e7,icon:"🇺🇸",unlockCondition:()=>V>=5,effect:()=>{h.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_2:{name:"📈 나스닥 투자",desc:"미국주식 수익 2배",cost:125e6,icon:"📈",unlockCondition:()=>V>=15,effect:()=>{h.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_3:{name:"💎 글로벌 주식 포트폴리오",desc:"미국주식 수익 2배",cost:25e7,icon:"💎",unlockCondition:()=>V>=30,effect:()=>{h.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_4:{name:"🌍 글로벌 대형주",desc:"미국주식 수익 2배",cost:5e8,icon:"🌍",unlockCondition:()=>V>=40,effect:()=>{h.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_5:{name:"👑 킹 글로벌 주식",desc:"미국주식 수익 2배",cost:1e9,icon:"👑",unlockCondition:()=>V>=50,effect:()=>{h.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},crypto_boost_1:{name:"₿ 비트코인 투자",desc:"코인 수익 2배",cost:2e8,icon:"₿",unlockCondition:()=>q>=5,effect:()=>{h.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_2:{name:"💎 알트코인 포트폴리오",desc:"코인 수익 2배",cost:5e8,icon:"💎",unlockCondition:()=>q>=15,effect:()=>{h.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_3:{name:"🚀 디지털 자산 전문가",desc:"코인 수익 2배",cost:1e9,icon:"🚀",unlockCondition:()=>q>=30,effect:()=>{h.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_4:{name:"🌐 메타버스 자산",desc:"코인 수익 2배",cost:2e9,icon:"🌐",unlockCondition:()=>q>=40,effect:()=>{h.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_5:{name:"👑 킹 암호화폐",desc:"코인 수익 2배",cost:4e9,icon:"👑",unlockCondition:()=>q>=50,effect:()=>{h.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},villa_boost_1:{name:"🏘️ 빌라 리모델링",desc:"빌라 수익 2배",cost:5e8,icon:"🏘️",unlockCondition:()=>F>=5,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_2:{name:"🌟 럭셔리 빌라",desc:"빌라 수익 2배",cost:125e7,icon:"🌟",unlockCondition:()=>F>=15,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_3:{name:"✨ 프리미엄 빌라 단지",desc:"빌라 수익 2배",cost:25e8,icon:"✨",unlockCondition:()=>F>=30,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_4:{name:"💎 다이아몬드 빌라",desc:"빌라 수익 2배",cost:5e9,icon:"💎",unlockCondition:()=>F>=40,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_5:{name:"👑 킹 빌라",desc:"빌라 수익 2배",cost:1e10,icon:"👑",unlockCondition:()=>F>=50,effect:()=>{v.villa*=2},category:"villa",unlocked:!1,purchased:!1},officetel_boost_1:{name:"🏢 오피스텔 스마트화",desc:"오피스텔 수익 2배",cost:7e8,icon:"🏢",unlockCondition:()=>O>=5,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_2:{name:"🏙️ 프리미엄 오피스텔",desc:"오피스텔 수익 2배",cost:175e7,icon:"🏙️",unlockCondition:()=>O>=15,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_3:{name:"🌆 럭셔리 오피스텔 타워",desc:"오피스텔 수익 2배",cost:35e8,icon:"🌆",unlockCondition:()=>O>=30,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_4:{name:"💎 다이아몬드 오피스텔",desc:"오피스텔 수익 2배",cost:7e9,icon:"💎",unlockCondition:()=>O>=40,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_5:{name:"👑 킹 오피스텔",desc:"오피스텔 수익 2배",cost:14e9,icon:"👑",unlockCondition:()=>O>=50,effect:()=>{v.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},apartment_boost_1:{name:"🏡 아파트 프리미엄화",desc:"아파트 수익 2배",cost:16e8,icon:"🏡",unlockCondition:()=>R>=5,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_2:{name:"🏰 타워팰리스급 아파트",desc:"아파트 수익 2배",cost:4e9,icon:"🏰",unlockCondition:()=>R>=15,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_3:{name:"🏛️ 초고급 아파트 단지",desc:"아파트 수익 2배",cost:8e9,icon:"🏛️",unlockCondition:()=>R>=30,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_4:{name:"💎 다이아몬드 아파트",desc:"아파트 수익 2배",cost:16e9,icon:"💎",unlockCondition:()=>R>=40,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_5:{name:"👑 킹 아파트",desc:"아파트 수익 2배",cost:32e9,icon:"👑",unlockCondition:()=>R>=50,effect:()=>{v.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},shop_boost_1:{name:"🏪 상가 입지 개선",desc:"상가 수익 2배",cost:24e8,icon:"🏪",unlockCondition:()=>N>=5,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_2:{name:"🛍️ 프리미엄 상권",desc:"상가 수익 2배",cost:6e9,icon:"🛍️",unlockCondition:()=>N>=15,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_3:{name:"🏬 메가몰 상권",desc:"상가 수익 2배",cost:12e9,icon:"🏬",unlockCondition:()=>N>=30,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_4:{name:"💎 다이아몬드 상권",desc:"상가 수익 2배",cost:24e9,icon:"💎",unlockCondition:()=>N>=40,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_5:{name:"👑 킹 상권",desc:"상가 수익 2배",cost:48e9,icon:"👑",unlockCondition:()=>N>=50,effect:()=>{v.shop*=2},category:"shop",unlocked:!1,purchased:!1},building_boost_1:{name:"🏙️ 빌딩 테넌트 확보",desc:"빌딩 수익 2배",cost:6e9,icon:"🏙️",unlockCondition:()=>U>=5,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_2:{name:"💼 랜드마크 빌딩",desc:"빌딩 수익 2배",cost:15e9,icon:"💼",unlockCondition:()=>U>=15,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_3:{name:"🏢 초고층 마천루",desc:"빌딩 수익 2배",cost:3e10,icon:"🏢",unlockCondition:()=>U>=30,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_4:{name:"💎 다이아몬드 빌딩",desc:"빌딩 수익 2배",cost:6e10,icon:"💎",unlockCondition:()=>U>=40,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_5:{name:"👑 킹 빌딩",desc:"빌딩 수익 2배",cost:12e10,icon:"👑",unlockCondition:()=>U>=50,effect:()=>{v.building*=2},category:"building",unlocked:!1,purchased:!1},rent_multiplier:{name:"📊 부동산 관리 전문화",desc:"모든 부동산 수익 +10%",cost:1e9,icon:"📊",unlockCondition:()=>rt()>=10,effect:()=>{Le*=1.1},category:"global",unlocked:!1,purchased:!1},manager_hire:{name:"👨‍💼 전문 관리인 고용",desc:"전체 임대 수익 +5%",cost:5e9,icon:"👨‍💼",unlockCondition:()=>rt()>=20,effect:()=>{Le*=1.05,gn++},category:"global",unlocked:!1,purchased:!1},financial_expert:{name:"💼 금융 전문가 고용",desc:"모든 금융 수익 +20%",cost:1e10,icon:"💼",unlockCondition:()=>j>=8,effect:()=>{h.deposit*=1.2,h.savings*=1.2,h.bond*=1.2},category:"global",unlocked:!1,purchased:!1},auto_work_system:{name:"📱 자동 업무 처리 시스템",desc:"1초마다 자동으로 1회 클릭 (초당 수익 추가)",cost:5e9,icon:"📱",unlockCondition:()=>j>=7&&rt()>=10,effect:()=>{zt=!0},category:"global",unlocked:!1,purchased:!1}};let F=0,O=0,R=0,N=0,U=0,Ee=0;const fn={deposit:!0,savings:!1,bond:!1,villa:!1,officetel:!1,apartment:!1,shop:!1,building:!1,tower:!1},h={deposit:50,savings:750,bond:11250,usStock:6e4,crypto:25e4},v={villa:84380,officetel:177190,apartment:607500,shop:137e4,building:514e4},Mn={...h},Pn={...v};function vo(){for(const t of Object.keys(Mn))h[t]=Mn[t];for(const t of Object.keys(Pn))v[t]=Pn[t]}function Co(){vo();for(const t of Object.values(Q)){if(!(t!=null&&t.purchased)||typeof t.effect!="function")continue;const n=Function.prototype.toString.call(t.effect);if(n.includes("FINANCIAL_INCOME")||n.includes("BASE_RENT"))try{t.effect()}catch{}}}let de=1,Le=1,zt=!1,gn=0;const Rn="capitalClicker_settings";let $e={particles:!0,fancyGraphics:!0,shortNumbers:!1},j=0,ze=0;const bt=[{name:"알바",multiplier:1,requiredIncome:0,requiredClicks:0,bgImage:Js},{name:"계약직",multiplier:1.5,requiredIncome:5e6,requiredClicks:100,bgImage:Qs},{name:"사원",multiplier:2,requiredIncome:1e7,requiredClicks:300,bgImage:Xs},{name:"대리",multiplier:2.5,requiredIncome:2e7,requiredClicks:800,bgImage:Zs},{name:"과장",multiplier:3,requiredIncome:3e7,requiredClicks:1500,bgImage:ec},{name:"차장",multiplier:3.5,requiredIncome:4e7,requiredClicks:2500,bgImage:tc},{name:"부장",multiplier:4,requiredIncome:5e7,requiredClicks:4e3,bgImage:nc},{name:"상무",multiplier:5,requiredIncome:7e7,requiredClicks:6e3,bgImage:oc},{name:"전무",multiplier:10,requiredIncome:12e7,requiredClicks:9e3,bgImage:sc},{name:"CEO",multiplier:12,requiredIncome:25e7,requiredClicks:15e3,bgImage:cc}];let An=1e9,Dn=5e9,Yt=1,xe=0,oe=null;const Fn=[{name:"강남 아파트 대박",duration:5e4,color:"#4CAF50",effects:{property:{apartment:2.5,villa:1.4,officetel:1.2}},description:"강남 아파트발 상승 랠리로 주거형 부동산 수익이 상승합니다."},{name:"전세 대란",duration:6e4,color:"#2196F3",effects:{property:{villa:2.5,officetel:2.5,apartment:1.8}},description:"전세 수요 급증으로 빌라/오피스텔 중심의 임대 수익이 급등합니다."},{name:"상권 활성화",duration:5e4,color:"#FF9800",effects:{property:{shop:2.5,building:1.6}},description:"상권 회복으로 상가 수익이 크게 증가합니다."},{name:"오피스 수요 급증",duration:55e3,color:"#9C27B0",effects:{property:{building:2.5,shop:1.4,officetel:1.2}},description:"오피스 확장으로 빌딩 중심 수익이 급등합니다."},{name:"한국은행 금리 인하",duration:7e4,color:"#2196F3",effects:{financial:{deposit:.7,savings:.8,bond:2,usStock:1.5}},description:"금리 인하로 예금/적금은 약세, 주식은 강세를 보입니다."},{name:"주식시장 대호황",duration:6e4,color:"#4CAF50",effects:{financial:{bond:2.5,usStock:2,crypto:1.5}},description:"리스크 자산 선호로 주식 중심 수익이 크게 증가합니다."},{name:"미국 연준 양적완화",duration:7e4,color:"#2196F3",effects:{financial:{usStock:2.5,crypto:1.8,bond:1.3}},description:"달러 유동성 확대로 미국주식/코인 수익이 상승합니다."},{name:"비트코인 급등",duration:45e3,color:"#FF9800",effects:{financial:{crypto:2.5,usStock:1.2}},description:"암호화폐 랠리로 코인 수익이 크게 증가합니다."},{name:"금융위기",duration:9e4,color:"#F44336",effects:{financial:{bond:.7,usStock:.7,crypto:.7},property:{shop:.7,building:.7}},description:"리스크 회피로 주식/코인/상업용 부동산이 타격을 받습니다."},{name:"은행 파산 위기",duration:75e3,color:"#9C27B0",effects:{financial:{deposit:.7,savings:.7,bond:.8}},description:"은행 신뢰 하락으로 예금/적금 수익이 둔화합니다."},{name:"주식시장 폭락",duration:75e3,color:"#F44336",effects:{financial:{bond:.7,usStock:.7,crypto:.7}},description:"주식/리스크 자산 급락으로 수익이 크게 감소합니다."},{name:"암호화폐 규제",duration:75e3,color:"#9C27B0",effects:{financial:{crypto:.7}},description:"규제 강화로 코인 수익이 감소합니다."}];let te=0;const Ze=[{id:"first_click",name:"첫 노동",desc:"첫 번째 클릭을 했다",icon:"👆",condition:()=>te>=1,unlocked:!1},{id:"first_deposit",name:"첫 예금",desc:"첫 번째 예금을 구입했다",icon:"💰",condition:()=>T>=1,unlocked:!1},{id:"first_savings",name:"첫 적금",desc:"첫 번째 적금을 구입했다",icon:"🏦",condition:()=>_>=1,unlocked:!1},{id:"first_bond",name:"첫 국내주식",desc:"첫 번째 국내주식을 구입했다",icon:"📈",condition:()=>x>=1,unlocked:!1},{id:"first_us_stock",name:"첫 미국주식",desc:"첫 번째 미국주식을 구입했다",icon:"🇺🇸",condition:()=>V>=1,unlocked:!1},{id:"first_crypto",name:"첫 코인",desc:"첫 번째 코인을 구입했다",icon:"₿",condition:()=>q>=1,unlocked:!1},{id:"first_property",name:"첫 부동산",desc:"첫 번째 부동산을 구입했다",icon:"🏠",condition:()=>F+O+R+N+U>=1,unlocked:!1},{id:"first_upgrade",name:"첫 업그레이드",desc:"첫 번째 업그레이드를 구입했다",icon:"⚡",condition:()=>Object.values(Q).some(t=>t.purchased),unlocked:!1},{id:"financial_expert",name:"금융 전문가",desc:"모든 금융상품을 보유했다",icon:"💼",condition:()=>T>0&&_>0&&x>0&&V>0&&q>0,unlocked:!1},{id:"property_collector",name:"부동산 수집가",desc:"5채의 부동산을 보유했다",icon:"🏘️",condition:()=>rt()>=5,unlocked:!1},{id:"property_tycoon",name:"부동산 타이쿤",desc:"모든 부동산 종류를 보유했다",icon:"🏙️",condition:()=>F>0&&O>0&&R>0&&N>0&&U>0,unlocked:!1},{id:"investment_guru",name:"투자 고수",desc:"모든 업그레이드를 구입했다",icon:"📊",condition:()=>Object.values(Q).every(t=>t.purchased),unlocked:!1},{id:"gangnam_rich",name:"강남 부자",desc:"강남 부동산 3채를 보유했다",icon:"🏙️",condition:()=>R>=3,unlocked:!1},{id:"global_investor",name:"글로벌 투자자",desc:"해외 투자 1억원을 달성했다",icon:"🌍",condition:()=>V*1e6+q*1e6>=1e8,unlocked:!1},{id:"crypto_expert",name:"암호화폐 전문가",desc:"코인 투자 5억원을 달성했다",icon:"₿",condition:()=>q*1e6>=5e8,unlocked:!1},{id:"real_estate_agent",name:"부동산 중개사",desc:"부동산 20채를 보유했다",icon:"🏠",condition:()=>rt()>=20,unlocked:!1},{id:"millionaire",name:"백만장자",desc:"총 자산 1억원을 달성했다",icon:"💎",condition:()=>y>=1e8,unlocked:!1},{id:"ten_millionaire",name:"억만장자",desc:"총 자산 10억원을 달성했다",icon:"💰",condition:()=>y>=1e9,unlocked:!1},{id:"hundred_millionaire",name:"부자",desc:"총 자산 100억원을 달성했다",icon:"🏆",condition:()=>y>=1e10,unlocked:!1},{id:"billionaire",name:"대부호",desc:"총 자산 1,000억원을 달성했다",icon:"👑",condition:()=>y>=1e11,unlocked:!1},{id:"trillionaire",name:"재벌",desc:"총 자산 1조원을 달성했다",icon:"🏰",condition:()=>y>=1e12,unlocked:!1},{id:"global_rich",name:"세계적 부자",desc:"총 자산 10조원을 달성했다",icon:"🌍",condition:()=>y>=1e13,unlocked:!1},{id:"legendary_rich",name:"전설의 부자",desc:"총 자산 100조원을 달성했다",icon:"⭐",condition:()=>y>=1e14,unlocked:!1},{id:"god_rich",name:"신의 부자",desc:"총 자산 1,000조원을 달성했다",icon:"✨",condition:()=>y>=1e15,unlocked:!1},{id:"career_starter",name:"직장인",desc:"계약직으로 승진했다",icon:"👔",condition:()=>j>=1,unlocked:!1},{id:"employee",name:"정규직",desc:"사원으로 승진했다",icon:"👨‍💼",condition:()=>j>=2,unlocked:!1},{id:"deputy_director",name:"팀장",desc:"과장으로 승진했다",icon:"👨‍💻",condition:()=>j>=4,unlocked:!1},{id:"executive",name:"임원",desc:"상무로 승진했다",icon:"👨‍🎓",condition:()=>j>=7,unlocked:!1},{id:"ceo",name:"CEO",desc:"CEO가 되었다",icon:"👑",condition:()=>j>=9,unlocked:!1},{id:"chaebol_chairman",name:"재벌 회장",desc:"자산 1조원을 달성했다",icon:"🏆",condition:()=>y>=1e12,unlocked:!1},{id:"global_ceo",name:"글로벌 CEO",desc:"해외 진출을 달성했다",icon:"🌍",condition:()=>V>=10&&q>=10,unlocked:!1},{id:"legendary_ceo",name:"전설의 CEO",desc:"모든 목표를 달성했다",icon:"⭐",condition:()=>j>=9&&y>=1e14,unlocked:!1}],Io=document.getElementById("cash"),Eo=document.getElementById("financial"),Lo=document.getElementById("properties"),So=document.getElementById("rps"),at=document.getElementById("workBtn"),ye=document.querySelector(".work"),wo=document.getElementById("log"),On=document.getElementById("shareBtn"),Nn=document.getElementById("favoriteBtn"),Bo=document.getElementById("clickIncomeButton");document.getElementById("clickIncomeLabel");const _o=document.getElementById("clickMultiplier"),xo=document.getElementById("rentMultiplier"),et=document.getElementById("gameModalRoot"),Ye=document.getElementById("gameModalTitle"),Je=document.getElementById("gameModalMessage"),Se=document.getElementById("gameModalPrimary"),be=document.getElementById("gameModalSecondary"),Un=document.getElementById("depositCount"),To=document.getElementById("incomePerDeposit"),vt=document.getElementById("buyDeposit"),qn=document.getElementById("savingsCount"),Mo=document.getElementById("incomePerSavings"),Ct=document.getElementById("buySavings"),Kn=document.getElementById("bondCount"),Po=document.getElementById("incomePerBond"),It=document.getElementById("buyBond");document.getElementById("usStockCount"),document.getElementById("incomePerUsStock");const Et=document.getElementById("buyUsStock");document.getElementById("cryptoCount"),document.getElementById("incomePerCrypto");const Lt=document.getElementById("buyCrypto"),pn=document.getElementById("buyMode"),$n=document.getElementById("sellMode"),Jt=document.getElementById("qty1"),Qt=document.getElementById("qty5"),Xt=document.getElementById("qty10"),St=document.getElementById("toggleUpgrades"),wt=document.getElementById("toggleFinancial"),Bt=document.getElementById("toggleProperties"),Vn=document.getElementById("saveStatus"),Hn=document.getElementById("resetBtn"),Ro=document.getElementById("depositCurrentPrice"),Ao=document.getElementById("savingsCurrentPrice"),Do=document.getElementById("bondCurrentPrice"),Fo=document.getElementById("villaCurrentPrice"),Oo=document.getElementById("officetelCurrentPrice"),No=document.getElementById("aptCurrentPrice"),Uo=document.getElementById("shopCurrentPrice"),qo=document.getElementById("buildingCurrentPrice"),Ko=document.getElementById("villaCount"),Vo=document.getElementById("rentPerVilla"),_t=document.getElementById("buyVilla"),Ho=document.getElementById("officetelCount"),Go=document.getElementById("rentPerOfficetel"),xt=document.getElementById("buyOfficetel"),jo=document.getElementById("aptCount"),Wo=document.getElementById("rentPerApt"),Tt=document.getElementById("buyApt"),zo=document.getElementById("shopCount"),Yo=document.getElementById("rentPerShop"),Mt=document.getElementById("buyShop"),Jo=document.getElementById("buildingCount"),Qo=document.getElementById("rentPerBuilding"),Pt=document.getElementById("buyBuilding"),Gn=document.getElementById("towerCountDisplay"),jn=document.getElementById("towerCountBadge"),Wn=document.getElementById("towerCurrentPrice"),ut=document.getElementById("buyTower"),Xo=document.getElementById("currentCareer");document.getElementById("careerCost");const mt=document.getElementById("careerProgress"),zn=document.getElementById("careerProgressText"),Rt=document.getElementById("careerRemaining");function C(t){if(["🧪","v2.","v3.","Cookie Clicker","업그레이드 시스템","DOM 참조","성능 최적화","자동 저장 시스템","업그레이드 클릭","커리어 진행률","구현 완료","수정 완료","정상화","작동 중","활성화","해결","버그 수정","최적화","개편","벤치마킹"].some(g=>t.includes(g)))return;const s=g=>String(g).padStart(2,"0"),i=new Date,a=`${s(i.getHours())}:${s(i.getMinutes())}`;function r(){const g=i.getFullYear(),f=s(i.getMonth()+1),P=s(i.getDate()),L=typeof Xe<"u"&&Xe?Xe:Fe,z=Math.max(1,Math.floor((Date.now()-L)/864e5)+1),ne=document.getElementById("diaryHeaderMeta");ne&&(ne.textContent=`${g}.${f}.${P}(${z}일차)`);const re=document.getElementById("diaryMetaDate"),ke=document.getElementById("diaryMetaDay");re&&(re.textContent=`오늘: ${g}.${f}.${P}`),ke&&(ke.textContent=`일차: ${z}일차`)}function m(g){var ke,nt,W,he,ce,ge,ve,we;const f=String(g||"").trim();if(/다음\s*업그레이드/.test(f)&&/클릭\s*남/.test(f))return"";const P=e=>e.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/g,"").trim(),L=e=>Math.floor(Math.random()*e),z=(e,o)=>{if(!Array.isArray(o)||o.length===0)return"";const k=`__diaryLastPick_${e}`,M=window[k];let me=L(o.length);return o.length>1&&typeof M=="number"&&me===M&&(me=(me+1+L(o.length-1))%o.length),window[k]=me,o[me]},ne=e=>P(e).replace(/\s+/g," ").trim();if(f.startsWith("🏆 업적 달성:")){const e=P(f).replace(/^업적 달성:\s*/,""),[o,k]=e.split(/\s*-\s*/);return z("achievement",[`오늘은 체크 하나를 더했다. (${o||"업적"})`,`작게나마 성취. ${o||"업적"}라니, 나도 꽤 한다.`,`기록해둔다: ${o||"업적"}.
${k||""}`.trim(),`"${o||"업적"}" 달성.
${k?`메모: ${k}`:""}`.trim(),`별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. (${o||"업적"})`,`또 하나의 마일스톤. ${o||"업적"}.
${k||""}`.trim(),`작은 성취도 성취다. ${o||"업적"}.
${k||""}`.trim(),`하루하루가 쌓인다. 오늘은 ${o||"업적"}.
${k||""}`.trim(),`기록에 하나 더. ${o||"업적"}.
${k||""}`.trim(),`뿌듯함이 조금씩. ${o||"업적"} 달성.
${k||""}`.trim(),`이런 게 인생이지. ${o||"업적"}.
${k||""}`.trim(),`작은 발걸음이 모여 길이 된다. ${o||"업적"}.
${k||""}`.trim()])}if(f.startsWith("🎉")&&f.includes("승진했습니다")){const e=f.match(/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/),o=(ke=e==null?void 0:e[1])==null?void 0:ke.trim(),k=(nt=e==null?void 0:e[2])==null?void 0:nt.trim(),M=k?k.replace(/[()]/g,"").trim():"";return z("promotion",[`명함이 바뀌었다. ${o||"다음 단계"}.
${M}`.trim(),`오늘은 좀 뿌듯하다. ${o||"승진"}이라니.
${M}`.trim(),`승진했다. 책임도 같이 딸려온다는데… 일단 축하부터.
${M}`.trim(),`그래, 나도 올라갈 줄 안다. ${o||"승진"}.
${M}`.trim(),`커피가 조금 더 쓰게 느껴진다. ${o||"승진"}의 맛.
${M}`.trim(),`한 단계 올라섰다. ${o||"승진"}.
${M}`.trim(),`노력이 보상받는 순간. ${o||"승진"}.
${M}`.trim(),`새로운 시작. ${o||"승진"}.
${M}`.trim(),`더 높은 곳에서 보는 풍경이 다르다. ${o||"승진"}.
${M}`.trim(),`자리도 바뀌고 마음도 바뀐다. ${o||"승진"}.
${M}`.trim(),`이제야 진짜 시작인가. ${o||"승진"}.
${M}`.trim(),`무게감이 느껴진다. ${o||"승진"}의 무게.
${M}`.trim()])}if(f.startsWith("🔓")){const e=ne(f),o=f.match(/^🔓\s*(.+?)이\s*해금/),k=((o==null?void 0:o[1])||"").trim(),M={적금:[`자동이체 버튼이 눈에 들어왔다.
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
${e}`]};return k&&M[k]?z(`unlock_${k}`,M[k]):z("unlock",[`문이 하나 열렸다.
${e}`,`다음 장으로 넘어갈 수 있게 됐다.
${e}`,`아직 초반인데도, 벌써 선택지가 늘었다.
${e}`,`드디어. ${e}`,`새로운 가능성이 열렸다.
${e}`,`선택지가 하나 더 생겼다.
${e}`,`다음 단계로 나아갈 수 있다.
${e}`,`기회의 문이 열렸다.
${e}`,`새로운 길이 보인다.
${e}`,`진행의 길이 열렸다.
${e}`])}if(f.startsWith("💸 자금이 부족합니다")){const e=ne(f);return z("noMoney",[`지갑이 얇아서 아무것도 못 했다.
${e}`,`현실 체크. 돈이 없다.
${e}`,`오늘은 참는다. 아직은 무리.
${e}`,`계산기만 두드리고 끝.
${e}`,`통장 잔고가 거짓말을 한다.
${e}`,`돈이 부족하다는 건 늘 아프다.
${e}`,`다시 모아야 한다. 조금 더.
${e}`,`욕심을 접어야 할 때.
${e}`,`현실이 무겁다.
${e}`,`내일을 기다려야 한다.
${e}`])}if(f.startsWith("✅")&&f.includes("구입했습니다")){const e=ne(f),o=f.match(/^✅\s*(.+?)\s+\d/),k=((o==null?void 0:o[1])||"").trim(),M={예금:[`일단은 안전한 데에 묶어두자.
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
${e}`]};return k&&M[k]?z(`buy_${k}`,M[k]):z("buy",[`결심하고 질렀다.
${e}`,`통장 잔고가 줄어들었다. 대신 미래를 샀다.
${e}`,`이건 소비가 아니라 투자라고… 스스로에게 말했다.
${e}`,`한 발 더 나아갔다.
${e}`,`손이 먼저 움직였다.
${e}`,`투자의 길을 걷는다.
${e}`,`미래를 위한 선택.
${e}`,`돈이 돈을 버는 구조.
${e}`,`자산을 늘리는 순간.
${e}`,`투자자의 마음가짐.
${e}`])}if(f.startsWith("💰")&&f.includes("판매했습니다")){const e=ne(f),o=f.match(/^💰\s*(.+?)\s+\d/),k=((o==null?void 0:o[1])||"").trim(),M={코인:[`손이 떨리기 전에 내렸다.
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
${e}`]};return k&&M[k]?z(`sell_${k}`,M[k]):z("sell",[`정리할 건 정리했다.
${e}`,`가끔은 줄여야 산다.
${e}`,`현금이 필요했다. 그래서 팔았다.
${e}`,`미련은 접어두고 정리.
${e}`,`투자 포지션을 정리했다.
${e}`,`현금화의 선택.
${e}`,`자산을 정리하는 순간.
${e}`,`투자에서 벗어났다.
${e}`,`정리하고 다음 기회를 본다.
${e}`,`미련 없이 정리했다.
${e}`])}if(f.startsWith("❌")){const e=ne(f);return z("fail",[`오늘은 뜻대로 안 됐다.
${e}`,`계획은 늘 계획대로 안 된다.
${e}`,`한 번 더. 다음엔 될 거다.
${e}`,`벽에 부딪혔다.
${e}`,`실패는 또 다른 시작.
${e}`,`좌절은 잠시뿐.
${e}`,`다시 일어서야 한다.
${e}`,`실패도 경험이다.
${e}`,`다음 기회를 기다린다.
${e}`,`실패에서 배운다.
${e}`])}if(f.startsWith("📈")&&f.includes("발생")){const e=ne(f),o=(he=(W=f.match(/^📈\s*(.+?)\s*발생/))==null?void 0:W[1])==null?void 0:he.trim(),M=(((ge=(ce=f.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))==null?void 0:ce[1])==null?void 0:ge.trim())||o||"").trim(),ie=(ot=>{const st=String(ot||""),Z=[["빌딩","빌딩"],["상가","상가"],["아파트","아파트"],["오피스텔","오피스텔"],["빌라","빌라"],["코인","코인"],["암호","코인"],["크립토","코인"],["₿","코인"],["미국","미국주식"],["🇺🇸","미국주식"],["달러","미국주식"],["주식","국내주식"],["코스피","국내주식"],["코스닥","국내주식"],["적금","적금"],["예금","예금"],["노동","노동"],["클릭","노동"],["업무","노동"]];for(const[Re,Vs]of Z)if(st.includes(Re))return Vs;return""})(`${M} ${e}`)||"시장";window.__diaryLastMarketProduct=ie,window.__diaryLastMarketName=M||e;const l={예금:[`예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.
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
${e}`]};return z(`market_${ie}`,l[ie]||l.시장)}if(f.startsWith("📉")&&f.includes("종료")){const e=window.__diaryLastMarketProduct||"시장",o=window.__diaryLastMarketName||"",k={코인:[`심장이 겨우 진정됐다. (${o||"이벤트 종료"})`,`코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.
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
${o||""}`.trim()],시장:["소란이 잠잠해졌다.","폭풍 지나가고 고요.","이제 평소대로.","시장의 파도가 잠잠해졌다.","뉴스의 소란이 끝났다.","변동성이 안정됐다.","투자의 리스크가 줄어들었다.","시장의 무게에서 벗어났다."]},me=["빌라","오피스텔","아파트","상가","빌딩"].includes(e)?"부동산":e,ie=z(`marketEnd_${me}`,k[me]||k.시장);return window.__diaryLastMarketProduct=null,window.__diaryLastMarketName=null,ie}if(f.startsWith("💡")){const e=ne(f),o=window.__diaryLastMarketProduct||"",k=window.__diaryLastMarketName||"",M={코인:[`메모(코인): 멘탈 관리가 수익률이다.
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
${e}`]},ie=["빌라","오피스텔","아파트","상가","빌딩"].includes(o)?"부동산":o;return ie&&M[ie]?z(`memo_${ie}`,M[ie]):z("memo",[`메모.
${e}`,`적어둔다.
${e}`,`까먹기 전에 기록.
${e}`,`투자 노트에 기록.
${e}`,`기억해둘 것.
${e}`,`나중을 위해 기록.
${e}`])}if(f.startsWith("🎁")&&f.includes("해금")){const e=ne(f),o=((we=(ve=f.match(/해금:\s*(.+)$/))==null?void 0:ve[1])==null?void 0:we.trim())||"",M=(ie=>{const l=String(ie||"");return l.includes("예금")?"예금":l.includes("적금")?"적금":l.includes("미국주식")||l.includes("미장")||l.includes("🇺🇸")?"미국주식":l.includes("코인")||l.includes("₿")||l.includes("암호")?"코인":l.includes("주식")?"국내주식":l.includes("빌딩")?"빌딩":l.includes("상가")?"상가":l.includes("아파트")?"아파트":l.includes("오피스텔")?"오피스텔":l.includes("빌라")?"빌라":l.includes("월세")||l.includes("부동산")?"부동산":l.includes("클릭")||l.includes("노동")||l.includes("업무")||l.includes("CEO")||l.includes("커리어")?"노동":""})(`${o} ${e}`)||"기본",me={노동:[`일을 '덜 힘들게' 만드는 방법이 생겼다.
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
${o||e}`]};return z(`upgradeUnlock_${M}`,me[M]||me.기본)}if(f.startsWith("✅")&&f.includes("구매!")){const e=ne(f),o=f.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/),k=((o==null?void 0:o[1])||"").trim(),M=((o==null?void 0:o[2])||"").trim(),ie=(st=>{const Z=String(st||"");return Z.includes("예금")?"예금":Z.includes("적금")?"적금":Z.includes("미국주식")||Z.includes("미장")||Z.includes("🇺🇸")?"미국주식":Z.includes("코인")||Z.includes("₿")||Z.includes("암호")?"코인":Z.includes("주식")?"국내주식":Z.includes("빌딩")?"빌딩":Z.includes("상가")?"상가":Z.includes("아파트")?"아파트":Z.includes("오피스텔")?"오피스텔":Z.includes("빌라")?"빌라":Z.includes("월세")||Z.includes("부동산")?"부동산":Z.includes("클릭")||Z.includes("노동")||Z.includes("업무")||Z.includes("CEO")||Z.includes("커리어")?"노동":""})(`${k} ${M} ${e}`)||"기본",l=[k,M].filter(Boolean).join(" — ")||e,ot={노동:[`일하는 방식이 바뀌었다.
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
${e}`]};return z(`upgradeBuy_${ie}`,ot[ie]||ot.기본)}if(f.startsWith("⚠️")){const e=ne(f);return z("warn",[`찜찜한 기분이 남았다.
${e}`,`뭔가 삐끗한 느낌.
${e}`,`일단 기록만 남긴다.
${e}`,`뭔가 이상한 느낌.
${e}`,`불안한 기분이 든다.
${e}`,`주의가 필요할 것 같다.
${e}`,`뭔가 잘못된 것 같다.
${e}`,`경고의 신호가 느껴진다.
${e}`])}const re=ne(f);return z("default",[re,`그냥 적어둔다.
${re}`,`오늘의 기록.
${re}`,`아무튼, ${re}`,`일단 기록.
${re}`,`메모해둔다.
${re}`,`기억해둘 것.
${re}`,`나중을 위해 기록.
${re}`,`적어두는 게 좋겠다.
${re}`,`기록에 남긴다.
${re}`])}r();const d=m(t);if(!d)return;const p=document.createElement("p"),$=d.replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`),A=($[0]??"").trim(),w=$.slice(1).map(g=>String(g).trim()).filter(Boolean),b=`<span class="diary-voice">${A}</span>`+(w.length?`
<span class="diary-info">${w.join(`
`)}</span>`:"");p.innerHTML=`<span class="diary-time">${a}</span>${b}`,wo.prepend(p)}function yn(){return T+_+x+V+q}function rt(){return F+O+R+N+U}function X(t){const n={deposit:()=>!0,savings:()=>T>=1,bond:()=>_>=1,usStock:()=>x>=1,crypto:()=>V>=1,villa:()=>q>=1,officetel:()=>F>=1,apartment:()=>O>=1,shop:()=>R>=1,building:()=>N>=1,tower:()=>j>=9&&U>=1};return n[t]?n[t]():!1}function Te(t){const c={deposit:{next:"savings",msg:"🔓 적금이 해금되었습니다!"},savings:{next:"bond",msg:"🔓 국내주식이 해금되었습니다!"},bond:{next:"usStock",msg:"🔓 미국주식이 해금되었습니다!"},usStock:{next:"crypto",msg:"🔓 코인이 해금되었습니다!"},crypto:{next:"villa",msg:"🔓 빌라가 해금되었습니다!"},villa:{next:"officetel",msg:"🔓 오피스텔이 해금되었습니다!"},officetel:{next:"apartment",msg:"🔓 아파트가 해금되었습니다!"},apartment:{next:"shop",msg:"🔓 상가가 해금되었습니다!"},shop:{next:"building",msg:"🔓 빌딩이 해금되었습니다!"},building:{next:"tower",msg:"🔓 서울타워가 해금되었습니다!"}}[t];if(!c||fn[c.next]||!X(c.next))return;const s={savings:_,bond:x,usStock:V,crypto:q,villa:F,officetel:O,apartment:R,shop:N,building:U,tower:Ee};if(s[c.next]!==void 0&&s[c.next]>0){fn[c.next]=!0;return}fn[c.next]=!0,C(c.msg);const i=c.next+"Item",a=document.getElementById(i);a&&(a.classList.add("just-unlocked"),setTimeout(()=>a.classList.remove("just-unlocked"),1e3))}function At(t,n){let s=h[t]*n;const i=kn(t,"financial");return s*=i,s}function Dt(t,n){let s=v[t]*n;const i=kn(t,"property");return s*=i,s}function ft(){const t=At("deposit",T)+At("savings",_)+At("bond",x)+At("usStock",V)+At("crypto",q),n=Dt("villa",F)+Dt("officetel",O)+Dt("apartment",R)+Dt("shop",N)+Dt("building",U);return(t+n*Le)*Yt}function Zo(){const t=Fn[Math.floor(Math.random()*Fn.length)];oe=t,xe=Date.now()+t.duration,C(`📈 ${t.name} 발생! ${Math.floor(t.duration/1e3)}초간 지속`),C(`💡 ${t.description}`),es(t)}function es(t){const n=document.createElement("div");n.style.cssText=`
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
      `;let c="";if(t.effects.financial){const i=Object.entries(t.effects.financial).filter(([a,r])=>r!==1).map(([a,r])=>{const m={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인"},d=Math.round(r*10)/10;return`${m[a]} x${String(d).replace(/\.0$/,"")}`});i.length>0&&(c+=`💰 ${i.join(", ")}
`)}if(t.effects.property){const i=Object.entries(t.effects.property).filter(([a,r])=>r!==1).map(([a,r])=>{const m={villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"},d=Math.round(r*10)/10;return`${m[a]} x${String(d).replace(/\.0$/,"")}`});i.length>0&&(c+=`🏠 ${i.join(", ")}`)}const s=Math.floor((t.duration??0)/1e3);n.innerHTML=`
        <div style="font-size: 16px; margin-bottom: 6px;">📈 ${t.name}</div>
        <div style="font-size: 11px; opacity: 0.95; margin-bottom: 8px;">지속: ${s}초</div>
        <div style="font-size: 12px; opacity: 0.9;">${t.description}</div>
        ${c?`<div style="font-size: 11px; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">${c}</div>`:""}
      `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},5e3)}function ts(){xe>0&&Date.now()>=xe&&(oe=null,xe=0,C("📉 시장 이벤트가 종료되었습니다."))}function kn(t,n){if(!oe||!oe.effects)return 1;const c=oe.effects[n];return!c||!c[t]?1:c[t]}function ns(){Ze.forEach(t=>{!t.unlocked&&t.condition()&&(t.unlocked=!0,os(t),C(`🏆 업적 달성: ${t.name} - ${t.desc}`))})}function os(t){const n=document.createElement("div");n.style.cssText=`
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
      `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},3e3)}function Yn(){let t=0;for(const[n,c]of Object.entries(Q))if(!(c.purchased||c.unlocked))try{c.unlockCondition()&&(c.unlocked=!0,t++,C(`🎁 새 업그레이드 해금: ${c.name}`))}catch(s){console.error(`업그레이드 해금 조건 체크 실패 (${n}):`,s)}t>0&&gt()}function ss(){document.querySelectorAll(".upgrade-item").forEach(n=>{const c=n.dataset.upgradeId,s=Q[c];s&&!s.purchased&&(y>=s.cost?n.classList.add("affordable"):n.classList.remove("affordable"))})}function cs(){document.querySelectorAll(".upgrade-progress").forEach(n=>{const c=n.closest(".upgrade-item");!c||!c.dataset.upgradeId||(Object.entries(Q).filter(([i,a])=>a.category==="labor"&&!a.unlocked&&!a.purchased).map(([i,a])=>{var p;const r=a.unlockCondition.toString(),m=r.match(/totalClicks\s*>=\s*(\d+)/);if(m)return{id:i,requiredClicks:parseInt(m[1]),upgrade:a};const d=r.match(/careerLevel\s*>=\s*(\d+)/);return d?{id:i,requiredClicks:((p=bt[parseInt(d[1])])==null?void 0:p.requiredClicks)||1/0,upgrade:a}:null}).filter(i=>i!==null).sort((i,a)=>i.requiredClicks-a.requiredClicks),n.textContent="")})}function gt(){const t=document.getElementById("upgradeList"),n=document.getElementById("upgradeCount");if(!t||!n)return;const c=Object.entries(Q).filter(([s,i])=>i.unlocked&&!i.purchased);if(n.textContent=`(${c.length})`,c.length===0){t.innerHTML="";return}t.innerHTML="",console.log(`🔄 Regenerating upgrade list with ${c.length} items`),c.forEach(([s,i])=>{const a=document.createElement("div");a.className="upgrade-item",a.dataset.upgradeId=s,y>=i.cost&&a.classList.add("affordable");const r=document.createElement("div");r.className="upgrade-icon",r.textContent=i.icon;const m=document.createElement("div");m.className="upgrade-info";const d=document.createElement("div");d.className="upgrade-name",d.textContent=i.name;const p=document.createElement("div");p.className="upgrade-desc",p.textContent=i.desc;const E=H(i.cost);if(i.category==="labor"&&i.unlockCondition)try{const A=document.createElement("div");A.className="upgrade-progress",A.style.fontSize="11px",A.style.color="var(--muted)",A.style.marginTop="4px";const w=Object.entries(Q).filter(([b,g])=>g.category==="labor"&&!g.unlocked&&!g.purchased).map(([b,g])=>{const P=g.unlockCondition.toString().match(/totalClicks\s*>=\s*(\d+)/);return P?{id:b,requiredClicks:parseInt(P[1]),upgrade:g}:null}).filter(b=>b!==null).sort((b,g)=>b.requiredClicks-g.requiredClicks)}catch{}m.appendChild(d),m.appendChild(p);const $=document.createElement("div");$.className="upgrade-status",$.textContent=E,$.style.animation="none",$.style.background="rgba(94, 234, 212, 0.12)",$.style.color="var(--accent)",$.style.border="1px solid rgba(94, 234, 212, 0.25)",$.style.borderRadius="999px",a.appendChild(r),a.appendChild(m),a.appendChild($),a.addEventListener("click",A=>{A.stopPropagation(),console.log("🖱️ Upgrade item clicked!",s),console.log("Event target:",A.target),console.log("Current item:",a),console.log("Dataset:",a.dataset),is(s)},!1),a.addEventListener("mousedown",A=>{console.log("🖱️ Mousedown detected on upgrade:",s)}),t.appendChild(a),console.log(`✅ Upgrade item created and appended: ${s}`,a)})}function is(t){console.log("=== PURCHASE UPGRADE DEBUG ==="),console.log("Attempting to purchase:",t),console.log("Current cash:",y);const n=Q[t];if(!n){console.error("업그레이드를 찾을 수 없습니다:",t),console.log("Available upgrade IDs:",Object.keys(Q));return}if(console.log("Upgrade found:",{name:n.name,cost:n.cost,unlocked:n.unlocked,purchased:n.purchased}),n.purchased){C("❌ 이미 구매한 업그레이드입니다."),console.log("Already purchased");return}if(y<n.cost){C(`💸 자금이 부족합니다. (필요: ${H(n.cost)})`),console.log("Not enough cash. Need:",n.cost,"Have:",y);return}console.log("Purchase successful! Applying effect..."),y-=n.cost,n.purchased=!0;try{n.effect(),C(`✅ ${n.name} 구매! ${n.desc}`),console.log("Effect applied successfully")}catch(c){console.error(`업그레이드 효과 적용 실패 (${t}):`,c),C(`⚠️ ${n.name} 구매했지만 효과 적용 중 오류 발생`)}console.log("New cash:",y),console.log("=============================="),gt(),se(),Nt()}function Ft(){const t=Ot();return Math.floor(1e4*t.multiplier*de)}function Ot(){return bt[j]}function hn(){return j<bt.length-1?bt[j+1]:null}function Jn(){const t=hn();if(t&&te>=t.requiredClicks){j+=1;const n=Ot(),c=Ft();C(`🎉 ${n.name}으로 승진했습니다! (클릭당 ${S(c)}원)`),ye&&(ye.style.transition="opacity 0.3s ease-out",ye.style.opacity="0.5",setTimeout(()=>{n.bgImage?(ye.style.transition="background-image 0.8s ease-in-out, opacity 0.5s ease-in",ye.style.backgroundImage=`url('${n.bgImage}')`):(ye.style.transition="background-image 0.8s ease-in-out, opacity 0.5s ease-in",ye.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),ye.style.opacity="1"},300));const s=document.querySelector(".career-card");s&&(s.style.animation="none",setTimeout(()=>{s.style.animation="careerPromotion 0.6s ease-out"},10));const i=document.getElementById("currentCareer");return i&&i.setAttribute("aria-label",`${n.name}으로 승진했습니다. 클릭당 ${S(c)}원`),console.log("=== PROMOTION DEBUG ==="),console.log("Promoted to:",n.name),console.log("New career level:",j),console.log("New multiplier:",n.multiplier),console.log("Click income:",S(c)),console.log("======================"),!0}return!1}function as(){const t=ee,n=le==="buy",c=n&&y>=Y("deposit",T,t),s=n&&y>=Y("savings",_,t),i=n&&y>=Y("bond",x,t),a=n&&y>=Y("usStock",V,t),r=n&&y>=Y("crypto",q,t);vt.classList.toggle("affordable",c),vt.classList.toggle("unaffordable",n&&!c),Ct.classList.toggle("affordable",s),Ct.classList.toggle("unaffordable",n&&!s),It.classList.toggle("affordable",i),It.classList.toggle("unaffordable",n&&!i),Et.classList.toggle("affordable",a),Et.classList.toggle("unaffordable",n&&!a),Lt.classList.toggle("affordable",r),Lt.classList.toggle("unaffordable",n&&!r);const m=n&&y>=J("villa",F,t),d=n&&y>=J("officetel",O,t),p=n&&y>=J("apartment",R,t),E=n&&y>=J("shop",N,t),$=n&&y>=J("building",U,t);if(_t.classList.toggle("affordable",m),_t.classList.toggle("unaffordable",n&&!m),xt.classList.toggle("affordable",d),xt.classList.toggle("unaffordable",n&&!d),Tt.classList.toggle("affordable",p),Tt.classList.toggle("unaffordable",n&&!p),Mt.classList.toggle("affordable",E),Mt.classList.toggle("unaffordable",n&&!E),Pt.classList.toggle("affordable",$),Pt.classList.toggle("unaffordable",n&&!$),ut){const A=Ie.tower,w=n&&y>=A&&X("tower");ut.classList.toggle("affordable",w),ut.classList.toggle("unaffordable",n&&(!w||!X("tower"))),ut.disabled=le==="sell"||!X("tower")}}function rs(){const t=ee,n=le==="buy",c=document.getElementById("depositItem"),s=document.getElementById("savingsItem"),i=document.getElementById("bondItem"),a=document.getElementById("usStockItem"),r=document.getElementById("cryptoItem");c.classList.toggle("affordable",n&&y>=Y("deposit",T,t)),s.classList.toggle("affordable",n&&y>=Y("savings",_,t)),i.classList.toggle("affordable",n&&y>=Y("bond",x,t)),a.classList.toggle("affordable",n&&y>=Y("usStock",V,t)),r.classList.toggle("affordable",n&&y>=Y("crypto",q,t));const m=document.getElementById("villaItem"),d=document.getElementById("officetelItem"),p=document.getElementById("aptItem"),E=document.getElementById("shopItem"),$=document.getElementById("buildingItem");m.classList.toggle("affordable",n&&y>=J("villa",F,t)),d.classList.toggle("affordable",n&&y>=J("officetel",O,t)),p.classList.toggle("affordable",n&&y>=J("apartment",R,t)),E.classList.toggle("affordable",n&&y>=J("shop",N,t)),$.classList.toggle("affordable",n&&y>=J("building",U,t));const A=document.getElementById("towerItem");if(A){const w=Ie.tower,b=n&&y>=w&&X("tower");A.classList.toggle("affordable",b),A.classList.toggle("unaffordable",n&&(!b||!X("tower")))}}function Nt(){const t={cash:y,totalClicks:te,totalLaborIncome:ze,careerLevel:j,clickMultiplier:de,rentMultiplier:Le,autoClickEnabled:zt,managerLevel:gn,rentCost:An,mgrCost:Dn,deposits:T,savings:_,bonds:x,usStocks:V,cryptos:q,depositsLifetime:Oe,savingsLifetime:Ne,bondsLifetime:Ue,usStocksLifetime:qe,cryptosLifetime:Ke,villas:F,officetels:O,apartments:R,shops:N,buildings:U,towers:Ee,villasLifetime:Ve,officetelsLifetime:He,apartmentsLifetime:Ge,shopsLifetime:je,buildingsLifetime:We,upgradesV2:Object.fromEntries(Object.entries(Q).map(([n,c])=>[n,{unlocked:c.unlocked,purchased:c.purchased}])),marketMultiplier:Yt,marketEventEndTime:xe,achievements:Ze,saveTime:new Date().toISOString(),ts:Date.now(),gameStartTime:Xe,totalPlayTime:Be,sessionStartTime:Fe,nickname:ae};xn&&(console.log("💾 저장 데이터에 포함된 닉네임:",ae||"(없음)"),console.log("💾 saveData.nickname:",t.nickname));try{if(localStorage.setItem(_e,JSON.stringify(t)),Wt=new Date,console.log("게임 저장 완료:",Wt.toLocaleTimeString()),gs(),sn){const n=Number((t==null?void 0:t.ts)||0)||0;n&&n>En&&(Ut=t,xn&&console.log("☁️ 클라우드 저장 대기 중인 데이터에 닉네임 포함:",Ut.nickname||"(없음)"))}ae&&(!window.__lastLeaderboardUpdate||Date.now()-window.__lastLeaderboardUpdate>3e4)&&(Fs(),window.__lastLeaderboardUpdate=Date.now())}catch(n){console.error("게임 저장 실패:",n)}}function ls(){try{const t=localStorage.getItem(_e);return t&&JSON.parse(t).nickname||""}catch(t){return console.error("닉네임 확인 실패:",t),""}}function pt(){if(dt){console.log("⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨");return}const t=ls();if(t){ae=t,console.log("✅ 닉네임 확인됨:",t);return}console.log("📝 닉네임 없음: 모달 오픈"),dt=!0;try{sessionStorage.setItem(jt,"1")}catch(n){console.warn("sessionStorage set 실패:",n)}setTimeout(()=>{ks("닉네임 설정",`리더보드에 표시될 닉네임을 입력하세요.
(1~5자, 공백/%, _ 불가)`,async c=>{const s=Tn(c);if(s.toLowerCase(),s.length<1||s.length>5){ue("닉네임 길이 오류","닉네임은 1~5자여야 합니다.","⚠️"),dt=!1,pt();return}if(/\s/.test(s)){ue("닉네임 형식 오류","닉네임에는 공백을 포함할 수 없습니다.","⚠️"),dt=!1,pt();return}if(/[%_]/.test(s)){ue("닉네임 형식 오류","닉네임에는 %, _ 문자를 사용할 수 없습니다.","⚠️"),dt=!1,pt();return}const{taken:i}=await Ws(s);if(i){ue("닉네임 중복",`이미 사용 중인 닉네임입니다.
다른 닉네임을 입력해주세요.`,"⚠️"),dt=!1,pt();return}try{sessionStorage.removeItem(jt)}catch(a){console.warn("sessionStorage remove 실패:",a)}ae=s,Nt(),C(`닉네임이 "${ae}"으로 설정되었습니다.`)},{icon:"✏️",primaryLabel:"확인",placeholder:"1~5자 닉네임",maxLength:5,defaultValue:"",required:!0})},500)}function ds(){try{const t=localStorage.getItem(_e);if(!t)return console.log("저장된 게임 데이터가 없습니다."),Be=0,Fe=Date.now(),!1;const n=JSON.parse(t);if(y=n.cash||0,te=n.totalClicks||0,ze=n.totalLaborIncome||0,j=n.careerLevel||0,de=n.clickMultiplier||1,Le=n.rentMultiplier||1,zt=n.autoClickEnabled||!1,gn=n.managerLevel||0,An=n.rentCost||1e9,Dn=n.mgrCost||5e9,T=n.deposits||0,_=n.savings||0,x=n.bonds||0,V=n.usStocks||0,q=n.cryptos||0,Oe=n.depositsLifetime||0,Ne=n.savingsLifetime||0,Ue=n.bondsLifetime||0,qe=n.usStocksLifetime||0,Ke=n.cryptosLifetime||0,F=n.villas||0,O=n.officetels||0,R=n.apartments||0,N=n.shops||0,U=n.buildings||0,Ee=n.towers||0,Ve=n.villasLifetime||0,He=n.officetelsLifetime||0,Ge=n.apartmentsLifetime||0,je=n.shopsLifetime||0,We=n.buildingsLifetime||0,n.upgradesV2)for(const[c,s]of Object.entries(n.upgradesV2))Q[c]&&(Q[c].unlocked=s.unlocked,Q[c].purchased=s.purchased);if(Co(),Yt=n.marketMultiplier||1,xe=n.marketEventEndTime||0,n.achievements&&Ze.forEach((c,s)=>{n.achievements[s]&&(c.unlocked=n.achievements[s].unlocked)}),n.gameStartTime&&(Xe=n.gameStartTime),n.totalPlayTime!==void 0&&(Be=n.totalPlayTime,console.log("🕐 이전 누적 플레이시간 복원:",Be,"ms")),ae=n.nickname||"",n.sessionStartTime){const c=Date.now()-n.sessionStartTime;Be+=c,console.log("🕐 이전 세션 플레이시간 누적:",c,"ms")}return Fe=Date.now(),console.log("🕐 새 세션 시작:",new Date(Fe).toLocaleString()),console.log("🕐 총 누적 플레이시간:",Be,"ms"),console.log("게임 불러오기 완료:",n.saveTime?new Date(n.saveTime).toLocaleString():"시간 정보 없음"),!0}catch(t){return console.error("게임 불러오기 실패:",t),!1}}function Zt(){console.log("🔄 resetGame function called"),en("게임 새로 시작",`게임을 새로 시작하시겠습니까?

⚠️ 모든 진행 상황이 삭제되며 복구할 수 없습니다.`,()=>{try{C("🔄 게임을 초기화합니다..."),console.log("✅ User confirmed reset"),localStorage.removeItem(_e),console.log("✅ LocalStorage cleared");try{sessionStorage.setItem(mn,"1"),sessionStorage.setItem(jt,"1")}catch(n){console.warn("sessionStorage set 실패:",n)}console.log("✅ Reloading page..."),location.reload()}catch(n){console.error("❌ Error in resetGame:",n),ue("오류",`게임 초기화 중 오류가 발생했습니다.
페이지를 새로고침해주세요.`,"⚠️")}},{icon:"🔄",primaryLabel:"새로 시작",secondaryLabel:"취소"})}function Me(t){t.classList.remove("purchase-success"),t.offsetHeight,t.classList.add("purchase-success"),setTimeout(()=>{t.classList.remove("purchase-success")},600)}function bn(){try{Gs(Rn,$e)}catch(t){console.error("설정 저장 실패:",t)}}function us(){try{const t=js(Rn,null);t&&($e={...$e,...t})}catch(t){console.error("설정 불러오기 실패:",t)}}function ms(){try{const t=localStorage.getItem(_e);if(!t){alert("저장된 게임 데이터가 없습니다.");return}const n=new Blob([t],{type:"application/json"}),c=URL.createObjectURL(n),s=document.createElement("a");s.href=c,s.download=`capital-clicker-save-${Date.now()}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(c),C("✅ 저장 파일이 다운로드되었습니다.")}catch(t){console.error("저장 내보내기 실패:",t),alert("저장 내보내기 중 오류가 발생했습니다.")}}function fs(t){try{const n=new FileReader;n.onload=c=>{try{const s=JSON.parse(c.target.result);localStorage.setItem(_e,JSON.stringify(s)),C("✅ 저장 파일을 불러왔습니다. 페이지를 새로고침합니다..."),setTimeout(()=>{location.reload()},1e3)}catch(s){console.error("저장 파일 파싱 실패:",s),alert("저장 파일 형식이 올바르지 않습니다.")}},n.readAsText(t)}catch(n){console.error("저장 가져오기 실패:",n),alert("저장 가져오기 중 오류가 발생했습니다.")}}function gs(){if(Vn){const n=Wt.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});Vn.textContent=`저장됨 · ${n}`}const t=document.getElementById("lastSaveTimeSettings");if(t){const n=Wt.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});t.textContent=n}}function se(){try{const W=document.getElementById("playerNicknameLabel"),he=document.getElementById("nicknameInfoItem");W&&(W.textContent=ae||"-"),he&&(he.style.display=ae?"flex":"none"),(typeof te!="number"||te<0)&&(console.warn("Invalid totalClicks value:",te,"resetting to 0"),te=0);const ce=Ot(),ge=hn();if(!ce){console.error("getCurrentCareer() returned null/undefined");return}if(u(Xo,ce.name),u(Bo,S(Ft())),ye&&ce.bgImage?ye.style.backgroundImage=`url('${ce.bgImage}')`:ye&&!ce.bgImage&&(ye.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),ge){const ve=Math.min(te/ge.requiredClicks*100,100),we=Math.max(0,ge.requiredClicks-te);mt&&(mt.style.width=ve+"%",mt.setAttribute("aria-valuenow",Math.round(ve))),u(zn,`${Math.round(ve)}% (${te}/${ge.requiredClicks})`),Rt&&(we>0?u(Rt,`다음 승진까지 ${we.toLocaleString("ko-KR")}클릭 남음`):u(Rt,"승진 가능!")),console.log("=== CAREER PROGRESS DEBUG ==="),console.log("totalClicks:",te),console.log("nextCareer.requiredClicks:",ge.requiredClicks),console.log("progress:",ve),console.log("currentCareer:",ce.name),console.log("nextCareer:",ge.name),console.log("=============================")}else mt&&(mt.style.width="100%",mt.setAttribute("aria-valuenow",100)),u(zn,"100% (완료)"),Rt&&u(Rt,"최고 직급 달성")}catch(W){console.error("Career UI update failed:",W),console.error("Error details:",{totalClicks:te,careerLevel:j,currentCareer:Ot(),nextCareer:hn()})}{const W=document.getElementById("diaryHeaderMeta");if(W){const he=k=>String(k).padStart(2,"0"),ce=new Date,ge=ce.getFullYear(),ve=he(ce.getMonth()+1),we=he(ce.getDate()),e=typeof Xe<"u"&&Xe?Xe:Fe,o=Math.max(1,Math.floor((Date.now()-e)/864e5)+1);W.textContent=`${ge}.${ve}.${we}(${o}일차)`}}u(Io,D(y));const t=yn();u(Eo,S(t));const n=document.getElementById("financialChip");if(n){const W=`예금: ${T}개
적금: ${_}개
국내주식: ${x}개
미국주식: ${V}개
코인: ${q}개`;n.setAttribute("title",W)}const c=rt();u(Lo,S(c));const s=document.getElementById("propertyChip");if(s){const W=`빌라: ${F}채
오피스텔: ${O}채
아파트: ${R}채
상가: ${N}채
빌딩: ${U}채`;s.setAttribute("title",W)}const i=document.getElementById("towerBadge"),a=document.getElementById("towerCountHeader");i&&a&&(Ee>0?(i.style.display="flex",a.textContent=Ee):i.style.display="none");const r=ft();u(So,D(r));const m=document.getElementById("rpsChip");if(m){const W=T*h.deposit+_*h.savings+x*h.bond,he=(F*v.villa+O*v.officetel+R*v.apartment+N*v.shop+U*v.building)*Le,ce=`금융 수익: ${S(W)}₩/s
부동산 수익: ${S(he)}₩/s
시장배수: x${Yt}`;m.setAttribute("title",ce)}ps(),u(_o,de.toFixed(1)),u(xo,Le.toFixed(1)),console.log("=== GAME STATE DEBUG ==="),console.log("Cash:",y),console.log("Total clicks:",te),console.log("Career level:",j),console.log("Financial products:",{deposits:T,savings:_,bonds:x,total:yn()}),console.log("Properties:",{villas:F,officetels:O,apartments:R,shops:N,buildings:U,total:rt()}),console.log("========================");try{(typeof T!="number"||T<0)&&(console.warn("Invalid deposits value:",T,"resetting to 0"),T=0),(typeof _!="number"||_<0)&&(console.warn("Invalid savings value:",_,"resetting to 0"),_=0),(typeof x!="number"||x<0)&&(console.warn("Invalid bonds value:",x,"resetting to 0"),x=0);const W=ft(),he=le==="buy"?Y("deposit",T,ee):De("deposit",T,ee),ce=T*h.deposit,ge=W>0?(ce/W*100).toFixed(1):0;Un.textContent=T,To.textContent=Math.floor(h.deposit).toLocaleString("ko-KR")+"원",document.getElementById("depositTotalIncome").textContent=Math.floor(ce).toLocaleString("ko-KR")+"원",document.getElementById("depositPercent").textContent=ge+"%",document.getElementById("depositLifetime").textContent=Ce(Oe),Ro.textContent=H(he);const ve=le==="buy"?Y("savings",_,ee):De("savings",_,ee),we=_*h.savings,e=W>0?(we/W*100).toFixed(1):0;qn.textContent=_,Mo.textContent=Math.floor(h.savings).toLocaleString("ko-KR")+"원",document.getElementById("savingsTotalIncome").textContent=Math.floor(we).toLocaleString("ko-KR")+"원",document.getElementById("savingsPercent").textContent=e+"%",document.getElementById("savingsLifetimeDisplay").textContent=Ce(Ne),Ao.textContent=H(ve);const o=le==="buy"?Y("bond",x,ee):De("bond",x,ee),k=x*h.bond,M=W>0?(k/W*100).toFixed(1):0;Kn.textContent=x,Po.textContent=Math.floor(h.bond).toLocaleString("ko-KR")+"원",document.getElementById("bondTotalIncome").textContent=Math.floor(k).toLocaleString("ko-KR")+"원",document.getElementById("bondPercent").textContent=M+"%",document.getElementById("bondLifetimeDisplay").textContent=Ce(Ue),Do.textContent=H(o);const me=le==="buy"?Y("usStock",V,ee):De("usStock",V,ee),ie=V*h.usStock,l=W>0?(ie/W*100).toFixed(1):0;document.getElementById("usStockCount").textContent=V,document.getElementById("incomePerUsStock").textContent=Math.floor(h.usStock).toLocaleString("ko-KR")+"원",document.getElementById("usStockTotalIncome").textContent=Math.floor(ie).toLocaleString("ko-KR")+"원",document.getElementById("usStockPercent").textContent=l+"%",document.getElementById("usStockLifetimeDisplay").textContent=Ce(qe),document.getElementById("usStockCurrentPrice").textContent=H(me);const ot=le==="buy"?Y("crypto",q,ee):De("crypto",q,ee),st=q*h.crypto,Z=W>0?(st/W*100).toFixed(1):0;document.getElementById("cryptoCount").textContent=q,document.getElementById("incomePerCrypto").textContent=Math.floor(h.crypto).toLocaleString("ko-KR")+"원",document.getElementById("cryptoTotalIncome").textContent=Math.floor(st).toLocaleString("ko-KR")+"원",document.getElementById("cryptoPercent").textContent=Z+"%",document.getElementById("cryptoLifetimeDisplay").textContent=Ce(Ke),document.getElementById("cryptoCurrentPrice").textContent=H(ot),console.log("=== FINANCIAL PRODUCTS DEBUG ==="),console.log("Financial counts:",{deposits:T,savings:_,bonds:x,usStocks:V,cryptos:q}),console.log("Total financial products:",yn()),console.log("Financial elements:",{depositCount:Un,savingsCount:qn,bondCount:Kn}),console.log("================================")}catch(W){console.error("Financial products UI update failed:",W),console.error("Error details:",{deposits:T,savings:_,bonds:x})}const d=ft(),p=le==="buy"?J("villa",F,ee):it("villa",F,ee),E=F*v.villa,$=d>0?(E/d*100).toFixed(1):0;Ko.textContent=F,Vo.textContent=Math.floor(v.villa).toLocaleString("ko-KR")+"원",document.getElementById("villaTotalIncome").textContent=Math.floor(E).toLocaleString("ko-KR")+"원",document.getElementById("villaPercent").textContent=$+"%",document.getElementById("villaLifetimeDisplay").textContent=Ce(Ve),Fo.textContent=pe(p);const A=le==="buy"?J("officetel",O,ee):it("officetel",O,ee),w=O*v.officetel,b=d>0?(w/d*100).toFixed(1):0;Ho.textContent=O,Go.textContent=Math.floor(v.officetel).toLocaleString("ko-KR")+"원",document.getElementById("officetelTotalIncome").textContent=Math.floor(w).toLocaleString("ko-KR")+"원",document.getElementById("officetelPercent").textContent=b+"%",document.getElementById("officetelLifetimeDisplay").textContent=Ce(He),Oo.textContent=pe(A);const g=le==="buy"?J("apartment",R,ee):it("apartment",R,ee),f=R*v.apartment,P=d>0?(f/d*100).toFixed(1):0;jo.textContent=R,Wo.textContent=Math.floor(v.apartment).toLocaleString("ko-KR")+"원",document.getElementById("aptTotalIncome").textContent=Math.floor(f).toLocaleString("ko-KR")+"원",document.getElementById("aptPercent").textContent=P+"%",document.getElementById("aptLifetimeDisplay").textContent=Ce(Ge),No.textContent=pe(g);const L=le==="buy"?J("shop",N,ee):it("shop",N,ee),z=N*v.shop,ne=d>0?(z/d*100).toFixed(1):0;zo.textContent=N,Yo.textContent=Math.floor(v.shop).toLocaleString("ko-KR")+"원",document.getElementById("shopTotalIncome").textContent=Math.floor(z).toLocaleString("ko-KR")+"원",document.getElementById("shopPercent").textContent=ne+"%",document.getElementById("shopLifetimeDisplay").textContent=Ce(je),Uo.textContent=pe(L);const re=le==="buy"?J("building",U,ee):it("building",U,ee),ke=U*v.building,nt=d>0?(ke/d*100).toFixed(1):0;if(Jo.textContent=U,Qo.textContent=Math.floor(v.building).toLocaleString("ko-KR")+"원",document.getElementById("buildingTotalIncome").textContent=Math.floor(ke).toLocaleString("ko-KR")+"원",document.getElementById("buildingPercent").textContent=nt+"%",document.getElementById("buildingLifetimeDisplay").textContent=Ce(We),qo.textContent=pe(re),Gn&&(Gn.textContent=Ee),jn&&(jn.textContent=Ee),Wn){const W=Ie.tower;Wn.textContent=pe(W)}console.log("Property counts:",{villas:F,officetels:O,apartments:R,shops:N,buildings:U}),$t(),as(),rs(),ss(),$s(),Ps()}let vn=null;function ps(){var t,n;try{const c=Date.now(),s=!!(oe&&xe>c),i=s?Math.max(0,Math.ceil((xe-c)/1e3)):0,a=document.getElementById("marketEventBar");if(a)if(!s)a.classList.remove("is-visible"),a.textContent="";else{a.classList.add("is-visible");const r=oe!=null&&oe.name?String(oe.name):"시장 이벤트",m=Math.floor((xe-c)/1e3),d=m>=0?`${m}초`:"0초",p=(f,P)=>f?Object.entries(f).filter(([,L])=>L!==1).slice(0,5).map(([L,z])=>`${P[L]??L} x${(Math.round(z*10)/10).toString().replace(/\.0$/,"")}`):[],E={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인"},$={villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"},A=p((t=oe==null?void 0:oe.effects)==null?void 0:t.financial,E),w=p((n=oe==null?void 0:oe.effects)==null?void 0:n.property,$),b=[...A,...w].slice(0,5),g=b.length?` · ${b.join(", ")}`:"";a.innerHTML=`📈 <b>${r}</b> · 남은 <span class="good">${d}</span>${g}`}vn||(vn=[{rowId:"depositItem",category:"financial",type:"deposit"},{rowId:"savingsItem",category:"financial",type:"savings"},{rowId:"bondItem",category:"financial",type:"bond"},{rowId:"usStockItem",category:"financial",type:"usStock"},{rowId:"cryptoItem",category:"financial",type:"crypto"},{rowId:"villaItem",category:"property",type:"villa"},{rowId:"officetelItem",category:"property",type:"officetel"},{rowId:"aptItem",category:"property",type:"apartment"},{rowId:"shopItem",category:"property",type:"shop"},{rowId:"buildingItem",category:"property",type:"building"}].map(m=>{const d=document.getElementById(m.rowId);if(!d)return null;const p=d.querySelector("button.btn");if(!p)return null;let E=d.querySelector(".event-mult-badge");return E||(E=document.createElement("span"),E.className="event-mult-badge",E.setAttribute("aria-hidden","true"),d.insertBefore(E,p)),{...m,row:d,badge:E}}).filter(Boolean));for(const r of vn){const m=s?kn(r.type,r.category):1,d=Math.abs(m-1)<1e-9;if(r.row.classList.remove("event-bull","event-bear"),r.badge.classList.remove("is-visible","is-bull","is-bear"),r.badge.removeAttribute("title"),!s||d){r.badge.textContent="";continue}const E=`x${(Math.round(m*10)/10).toFixed(1).replace(/\.0$/,"")}`;r.badge.textContent=E,r.badge.classList.add("is-visible"),m>1?(r.row.classList.add("event-bull"),r.badge.classList.add("is-bull")):(r.row.classList.add("event-bear"),r.badge.classList.add("is-bear"));const $=oe!=null&&oe.name?String(oe.name):"시장 이벤트";r.badge.title=`${$} · 남은 ${i}초 · ${E}`}}catch{}}setTimeout(()=>{Bs()},100);function $s(){const t={savings:"예금 1개 필요",bond:"적금 1개 필요",usStock:"국내주식 1개 필요",crypto:"미국주식 1개 필요",villa:"코인 1개 필요",officetel:"빌라 1채 필요",apartment:"오피스텔 1채 필요",shop:"아파트 1채 필요",building:"상가 1채 필요",tower:"CEO 달성 및 빌딩 1개 이상 필요"},n=document.getElementById("savingsItem"),c=document.getElementById("bondItem");if(n){const $=!X("savings");n.classList.toggle("locked",$),$?n.setAttribute("data-unlock-hint",t.savings):n.removeAttribute("data-unlock-hint")}if(c){const $=!X("bond");c.classList.toggle("locked",$),$?c.setAttribute("data-unlock-hint",t.bond):c.removeAttribute("data-unlock-hint")}const s=document.getElementById("usStockItem"),i=document.getElementById("cryptoItem");if(s){const $=!X("usStock");s.classList.toggle("locked",$),$?s.setAttribute("data-unlock-hint",t.usStock):s.removeAttribute("data-unlock-hint")}if(i){const $=!X("crypto");i.classList.toggle("locked",$),$?i.setAttribute("data-unlock-hint",t.crypto):i.removeAttribute("data-unlock-hint")}const a=document.getElementById("villaItem"),r=document.getElementById("officetelItem"),m=document.getElementById("aptItem"),d=document.getElementById("shopItem"),p=document.getElementById("buildingItem");if(a){const $=!X("villa");a.classList.toggle("locked",$),$?a.setAttribute("data-unlock-hint",t.villa):a.removeAttribute("data-unlock-hint")}if(r){const $=!X("officetel");r.classList.toggle("locked",$),$?r.setAttribute("data-unlock-hint",t.officetel):r.removeAttribute("data-unlock-hint")}if(m){const $=!X("apartment");m.classList.toggle("locked",$),$?m.setAttribute("data-unlock-hint",t.apartment):m.removeAttribute("data-unlock-hint")}if(d){const $=!X("shop");d.classList.toggle("locked",$),$?d.setAttribute("data-unlock-hint",t.shop):d.removeAttribute("data-unlock-hint")}if(p){const $=!X("building");p.classList.toggle("locked",$),$?p.setAttribute("data-unlock-hint",t.building):p.removeAttribute("data-unlock-hint")}const E=document.getElementById("towerItem");if(E){const $=!X("tower");E.classList.toggle("locked",$),$?E.setAttribute("data-unlock-hint",t.tower):E.removeAttribute("data-unlock-hint")}}pn.addEventListener("click",()=>{le="buy",pn.classList.add("active"),$n.classList.remove("active"),$t()}),$n.addEventListener("click",()=>{le="sell",$n.classList.add("active"),pn.classList.remove("active"),$t()}),Jt.addEventListener("click",()=>{ee=1,Jt.classList.add("active"),Qt.classList.remove("active"),Xt.classList.remove("active"),$t()}),Qt.addEventListener("click",()=>{ee=5,Qt.classList.add("active"),Jt.classList.remove("active"),Xt.classList.remove("active"),$t()}),Xt.addEventListener("click",()=>{ee=10,Xt.classList.add("active"),Jt.classList.remove("active"),Qt.classList.remove("active"),$t()}),St.addEventListener("click",()=>{const t=document.getElementById("upgradeList");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),St.textContent="▼",St.classList.remove("collapsed")):(t.classList.add("collapsed-section"),St.textContent="▶",St.classList.add("collapsed"))}),wt.addEventListener("click",()=>{const t=document.getElementById("financialSection");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),wt.textContent="▼",wt.classList.remove("collapsed")):(t.classList.add("collapsed-section"),wt.textContent="▶",wt.classList.add("collapsed"))}),Bt.addEventListener("click",()=>{const t=document.getElementById("propertySection");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),Bt.textContent="▼",Bt.classList.remove("collapsed")):(t.classList.add("collapsed-section"),Bt.textContent="▶",Bt.classList.add("collapsed"))});function $t(){const t=le==="buy",n=ee;Pe(vt,"financial","deposit",T,t,n),Pe(Ct,"financial","savings",_,t,n),Pe(It,"financial","bond",x,t,n),Pe(Et,"financial","usStock",V,t,n),Pe(Lt,"financial","crypto",q,t,n),Pe(_t,"property","villa",F,t,n),Pe(xt,"property","officetel",O,t,n),Pe(Tt,"property","apartment",R,t,n),Pe(Mt,"property","shop",N,t,n),Pe(Pt,"property","building",U,t,n)}function Pe(t,n,c,s,i,a){if(!t)return;const r=i?n==="financial"?Y(c,s,a):J(c,s,a):n==="financial"?De(c,s,a):it(c,s,a),m=i?"구입":"판매",d=a>1?` x${a}`:"";if(t.textContent=`${m}${d}`,i)t.style.background="",t.disabled=y<r;else{const p=s>=a;t.style.background=p?"var(--bad)":"var(--muted)",t.disabled=!p}}function ys(t,n){let c=Ft();Q.performance_bonus&&Q.performance_bonus.purchased&&Math.random()<.02&&(c*=10,C("💰 성과급 지급! 10배 수익!")),$e.particles&&vs(t??0,n??0),y+=c,te+=1,ze+=c;const s=Object.entries(Q).filter(([a,r])=>r.category==="labor"&&!r.unlocked&&!r.purchased).map(([a,r])=>{var E;const m=r.unlockCondition.toString(),d=m.match(/totalClicks\s*>=\s*(\d+)/);if(d)return{id:a,requiredClicks:parseInt(d[1]),upgrade:r};const p=m.match(/careerLevel\s*>=\s*(\d+)/);return p?{id:a,requiredClicks:((E=bt[parseInt(p[1])])==null?void 0:E.requiredClicks)||1/0,upgrade:r}:null}).filter(a=>a!==null).sort((a,r)=>a.requiredClicks-r.requiredClicks);if(s.length>0){const a=s[0],r=a.requiredClicks-te;(r===50||r===25||r===10||r===5)&&C(`🎯 다음 업그레이드 "${a.upgrade.name}"까지 ${r}클릭 남음!`)}Jn()&&se(),cs(),at.classList.add("click-effect"),setTimeout(()=>at.classList.remove("click-effect"),300),Cs(c),se()}at.addEventListener("click",t=>{ys(t.clientX,t.clientY)});let Cn=null;function lt(){et&&(et.classList.add("game-modal-hidden"),Cn=null)}function ue(t,n,c="ℹ️"){if(!et||!Ye||!Je||!Se||!be){alert(n);return}et.classList.remove("game-modal-hidden");const s=Ye.querySelector(".icon"),i=Ye.querySelector(".text");s&&(s.textContent=c),i&&(i.textContent=t),Je.textContent=n,be.style.display="none",Se.textContent="확인",Se.onclick=()=>{lt()},be.onclick=()=>{lt()}}function en(t,n,c,s={}){if(!et||!Ye||!Je||!Se||!be){confirm(n)&&typeof c=="function"&&c();return}et.classList.remove("game-modal-hidden");const i=Ye.querySelector(".icon"),a=Ye.querySelector(".text");i&&(i.textContent=s.icon||"⚠️"),a&&(a.textContent=t),Je.textContent=n,be.style.display="inline-flex",Se.textContent=s.primaryLabel||"예",be.textContent=s.secondaryLabel||"아니오",Cn=typeof c=="function"?c:null,Se.onclick=()=>{const r=Cn;lt(),r&&r()},be.onclick=()=>{lt(),s.onCancel&&typeof s.onCancel=="function"&&s.onCancel()}}function ks(t,n,c,s={}){if(!et||!Ye||!Je||!Se||!be){const d=prompt(n);d&&typeof c=="function"&&c(d.trim());return}et.classList.remove("game-modal-hidden");const i=Ye.querySelector(".icon"),a=Ye.querySelector(".text");i&&(i.textContent=s.icon||"✏️"),a&&(a.textContent=t);let r=Je.querySelector(".game-modal-input");r?r.value="":(r=document.createElement("input"),r.type="text",r.className="game-modal-input",Je.innerHTML="",Je.appendChild(r)),r.placeholder=s.placeholder||r.placeholder||"닉네임을 입력하세요",typeof s.maxLength=="number"?r.maxLength=s.maxLength:(!r.maxLength||r.maxLength<=0)&&(r.maxLength=20);{const d=document.createElement("div");d.textContent=n,d.style.marginBottom="10px",d.style.color="var(--muted)",Je.insertBefore(d,r)}s.secondaryLabel?(be.style.display="inline-flex",be.textContent=s.secondaryLabel):be.style.display="none",Se.textContent=s.primaryLabel||"확인";const m=d=>{d.key==="Enter"&&(d.preventDefault(),Se.click())};r.addEventListener("keydown",m),r.focus(),Se.onclick=()=>{const d=r.value.trim();if(!d&&s.required!==!1){r.style.borderColor="var(--bad)",setTimeout(()=>{r.style.borderColor=""},1e3);return}r.removeEventListener("keydown",m),lt(),typeof c=="function"&&c(d||s.defaultValue||"익명")},s.secondaryLabel?be.onclick=()=>{r.removeEventListener("keydown",m),lt(),s.onCancel&&typeof s.onCancel=="function"&&s.onCancel()}:be.onclick=null}async function hs(){const t=window.location.href,n="Capital Clicker: Seoul Survival",c=`💰 부동산과 금융 투자로 부자가 되는 게임!
현재 자산: ${G(y)}
초당 수익: ${G(ft())}`;if(!navigator.share){C("❌ 이 기기/브라우저에서는 공유하기를 지원하지 않습니다.");return}try{await navigator.share({title:n,text:c,url:t}),C("✅ 게임이 공유되었습니다!")}catch(s){(s==null?void 0:s.name)!=="AbortError"&&(console.error("공유 실패:",s),C("❌ 공유에 실패했습니다."))}}On?On.addEventListener("click",hs):console.error("공유 버튼을 찾을 수 없습니다.");function bs(){const t=window.location.href,n=document.title||"Capital Clicker: Seoul Survival",c=navigator.userAgent.toLowerCase(),s=/iphone|ipad|ipod|android/.test(c),i=/iphone|ipad|ipod/.test(c),a=/android/.test(c),r=navigator.platform.toUpperCase().includes("MAC");if(window.external&&typeof window.external.AddFavorite=="function")try{window.external.AddFavorite(t,n),C("⭐ 즐겨찾기에 추가되었습니다.");return}catch{}let m="",d="즐겨찾기 / 홈 화면에 추가",p="⭐";s?i?m=`iPhone/iPad에서는 Safari 하단의 공유 버튼(□↑)을 누른 뒤
"홈 화면에 추가"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.`:a?m=`Android에서는 브라우저 오른쪽 위 메뉴(⋮)에서
"홈 화면에 추가" 또는 "앱 설치"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.`:m='이 기기에서는 브라우저의 메뉴에서 "홈 화면에 추가" 기능을 사용해 주세요.':m=`${r?"⌘ + D":"Ctrl + D"} 를 눌러 이 페이지를 브라우저 즐겨찾기에 추가할 수 있습니다.`,ue(d,m,p)}Nn&&Nn.addEventListener("click",bs),Hn&&Hn.addEventListener("click",Zt);const Qn=document.getElementById("resetBtnSettings");Qn&&Qn.addEventListener("click",Zt);function vs(t,n){const c=document.createElement("div");c.className="falling-cookie",c.textContent="💵",c.style.left=t+Math.random()*100-50+"px",c.style.top=n-100+"px",document.body.appendChild(c),setTimeout(()=>{c.parentNode&&c.parentNode.removeChild(c)},2e3)}function Xn(t,n){for(let c=0;c<Math.min(n,5);c++)setTimeout(()=>{const s=document.createElement("div");s.className="falling-cookie",s.textContent=t,s.style.left=Math.random()*window.innerWidth+"px",s.style.top="-100px",document.body.appendChild(s),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},2e3)},c*200)}function Cs(t){const n=document.createElement("div");n.className="income-increase",n.textContent=`+${S(t)}원`;const c=at.getBoundingClientRect(),s=at.parentElement.getBoundingClientRect();n.style.position="absolute",n.style.left=c.left-s.left+Math.random()*100-50+"px",n.style.top=c.top-s.top-50+"px",n.style.zIndex="1000",n.style.pointerEvents="none",at.parentElement.style.position="relative",at.parentElement.appendChild(n),n.style.opacity="1",n.style.transform="translateY(0px) scale(1)",setTimeout(()=>{n.style.transition="all 1.5s ease-out",n.style.opacity="0",n.style.transform="translateY(-80px) scale(1.2)"},100),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},1600)}vt.addEventListener("click",()=>{if(!X("deposit")){C("❌ 예금은 아직 잠겨있습니다.");return}const t=K("financial","deposit",T);t.success&&(T=t.newCount,Me(vt),Te("deposit")),se()}),Ct.addEventListener("click",()=>{if(!X("savings")){C("❌ 적금은 예금을 1개 이상 보유해야 해금됩니다.");return}const t=K("financial","savings",_);t.success&&(_=t.newCount,Me(Ct),Te("savings")),se()}),It.addEventListener("click",()=>{if(!X("bond")){C("❌ 국내주식은 적금을 1개 이상 보유해야 해금됩니다.");return}const t=K("financial","bond",x);t.success&&(x=t.newCount,Me(It),Te("bond")),se()}),Et.addEventListener("click",()=>{if(!X("usStock")){C("❌ 미국주식은 국내주식을 1개 이상 보유해야 해금됩니다.");return}const t=K("financial","usStock",V);t.success&&(V=t.newCount,Me(Et),Te("usStock")),se()}),Lt.addEventListener("click",()=>{if(!X("crypto")){C("❌ 코인은 미국주식을 1개 이상 보유해야 해금됩니다.");return}const t=K("financial","crypto",q);t.success&&(q=t.newCount,Me(Lt),Te("crypto")),se()}),_t.addEventListener("click",()=>{if(!X("villa")){C("❌ 빌라는 코인을 1개 이상 보유해야 해금됩니다.");return}const t=K("property","villa",F);t.success&&(F=t.newCount,Me(_t),Te("villa")),se()}),xt.addEventListener("click",()=>{if(!X("officetel")){C("❌ 오피스텔은 빌라를 1개 이상 보유해야 해금됩니다.");return}const t=K("property","officetel",O);t.success&&(O=t.newCount,Me(xt),Te("officetel")),se()}),Tt.addEventListener("click",()=>{if(!X("apartment")){C("❌ 아파트는 오피스텔을 1개 이상 보유해야 해금됩니다.");return}const t=K("property","apartment",R);t.success&&(R=t.newCount,Me(Tt),Te("apartment")),se()}),Mt.addEventListener("click",()=>{if(!X("shop")){C("❌ 상가는 아파트를 1개 이상 보유해야 해금됩니다.");return}const t=K("property","shop",N);t.success&&(N=t.newCount,Me(Mt),Te("shop")),se()}),Pt.addEventListener("click",()=>{if(!X("building")){C("❌ 빌딩은 상가를 1개 이상 보유해야 해금됩니다.");return}const t=K("property","building",U);t.success&&(U=t.newCount,Me(Pt),Te("building")),se()}),ut&&ut.addEventListener("click",async()=>{if(!X("tower")){C("❌ 서울타워는 CEO 달성 및 빌딩 1개 이상 보유 시 해금됩니다.");return}const t=Ie.tower;if(y<t){C(`💸 자금이 부족합니다. (필요: ${S(t)}원)`);return}y-=t,Ee+=1;const n=y+ln(),c=Date.now()-Fe,s=Be+c;if(ae)try{await $o(ae,n,s,Ee),console.log("리더보드: 서울타워 구매 시점 자산으로 업데이트 완료")}catch(i){console.error("리더보드 업데이트 실패:",i)}C(`🗼 서울타워 완성.
서울의 정상에 도달했다.
이제야 진짜 시작인가?`),Is(Ee),$e.particles&&Xn("🗼",1),se(),Nt()});function Is(t){const n=`🗼 서울타워 완성 🗼

알바에서 시작해 CEO까지.
예금에서 시작해 서울타워까지.

서울 한복판에 당신의 이름이 새겨졌다.

"이제야 진짜 시작인가?"

리더보드에 기록되었습니다: 🗼x${t}`;ue("🎉 엔딩",n,"🗼"),Se.onclick,Se.onclick=()=>{lt(),en("🔄 새 게임 시작",`서울타워를 완성했습니다!

새 게임을 시작하시겠습니까?
(현재 진행은 초기화됩니다)`,()=>{Zt(),C("🗼 새로운 시작. 다시 한 번.")},{icon:"🗼",primaryLabel:"새 게임 시작",secondaryLabel:"나중에"})}}document.addEventListener("keydown",t=>{t.ctrlKey&&t.shiftKey&&t.key==="R"&&(t.preventDefault(),Zt()),t.ctrlKey&&t.key==="s"&&(t.preventDefault(),Nt(),C("💾 수동 저장 완료!")),t.ctrlKey&&t.key==="o"&&(t.preventDefault(),yt&&yt.click())});const Zn=50;setInterval(()=>{ts(),ns(),Yn();const t=Zn/1e3;y+=ft()*t,Oe+=T*h.deposit*t,Ne+=_*h.savings*t,Ue+=x*h.bond*t,qe+=V*h.usStock*t,Ke+=q*h.crypto*t,Ve+=F*v.villa*t,He+=O*v.officetel*t,Ge+=R*v.apartment*t,je+=N*v.shop*t,We+=U*v.building*t,se()},Zn),setInterval(()=>{Nt()},5e3),setInterval(()=>{if(zt){const t=Ft();if(y+=t,te+=1,ze+=t,Jn(),Q.performance_bonus&&Q.performance_bonus.purchased&&Math.random()<.02){const n=t*9;y+=n,ze+=n}}},1e3),setInterval(()=>{xe===0&&Zo()},Math.random()*18e4+12e4),us();const eo=document.getElementById("currentYear");eo&&(eo.textContent=new Date().getFullYear()),(async()=>ds()?(C("저장된 게임을 불러왔습니다."),pt()):(C("환영합니다! 노동으로 종잣돈을 모아 첫 부동산을 구입해보세요."),await ws()||pt()))();const In=Ot();ye&&In&&In.bgImage&&(ye.style.backgroundImage=`url('${In.bgImage}')`);const tn=document.getElementById("toggleParticles"),nn=document.getElementById("toggleFancyGraphics"),on=document.getElementById("toggleShortNumbers");tn&&(tn.checked=$e.particles),nn&&(nn.checked=$e.fancyGraphics),on&&(on.checked=$e.shortNumbers);const to=document.getElementById("exportSaveBtn"),no=document.getElementById("importSaveBtn"),yt=document.getElementById("importFileInput"),oo=document.getElementById("cloudUploadBtn"),so=document.getElementById("cloudDownloadBtn");to&&to.addEventListener("click",ms),no&&no.addEventListener("click",()=>{yt&&yt.click()}),yt&&yt.addEventListener("change",t=>{const n=t.target.files[0];n&&fs(n)});let Ut=null,En=0,sn=null,Ln=null;function Es(){const t=document.getElementById("cloudLastSync");if(t){if(!Ln){t.textContent="--:--";return}t.textContent=Ln.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}}function co(t){const n=document.getElementById("cloudSaveHint");!n||!t||(n.textContent=t)}async function io(t="flush"){if(!sn||!Ut)return;const n=Ut;Ut=null;const c=Number((n==null?void 0:n.ts)||Date.now())||Date.now();if(c&&c<=En)return;const s=await po("seoulsurvival",n);if(!s.ok){co(`자동 동기화 실패(나중에 재시도). 이유: ${s.reason||"unknown"}`);return}En=c,Ln=new Date,Es(),co("자동 동기화 완료 ✅")}async function Ls(){var i;if(!await ct()){ue("로그인 필요","클라우드 세이브는 로그인 사용자만 사용할 수 있습니다.","🔐");return}const n=localStorage.getItem(_e);if(!n){ue("저장 데이터 없음","로컬 저장 데이터가 없습니다. 먼저 게임을 진행한 뒤 저장해 주세요.","💾");return}let c;try{c=JSON.parse(n)}catch{ue("오류","로컬 저장 데이터 형식이 올바르지 않습니다.","⚠️");return}const s=await po("seoulsurvival",c);if(!s.ok){if(s.reason==="missing_table"){ue("클라우드 테이블 없음",`Supabase에 game_saves 테이블이 아직 없습니다.
Supabase SQL Editor에서 supabase/game_saves.sql을 실행해 주세요.`,"🛠️");return}ue("업로드 실패",`클라우드 저장에 실패했습니다.
${((i=s.error)==null?void 0:i.message)||""}`.trim(),"⚠️");return}C("☁️ 클라우드에 저장했습니다."),ue("완료","클라우드 저장 완료!","☁️")}async function Ss(){var i,a;if(!await ct()){ue("로그인 필요","클라우드 세이브는 로그인 사용자만 사용할 수 있습니다.","🔐");return}const n=await go("seoulsurvival");if(!n.ok){if(n.reason==="missing_table"){ue("클라우드 테이블 없음",`Supabase에 game_saves 테이블이 아직 없습니다.
Supabase SQL Editor에서 supabase/game_saves.sql을 실행해 주세요.`,"🛠️");return}ue("불러오기 실패",`클라우드 불러오기에 실패했습니다.
${((i=n.error)==null?void 0:i.message)||""}`.trim(),"⚠️");return}if(!n.found){ue("클라우드 저장 없음","이 계정에 저장된 클라우드 세이브가 없습니다.","☁️");return}const s=`클라우드 세이브를 발견했습니다.

저장 시간: ${(a=n.save)!=null&&a.saveTime?new Date(n.save.saveTime).toLocaleString():n.updated_at?new Date(n.updated_at).toLocaleString():"시간 정보 없음"}

불러오면 로컬 저장이 클라우드 데이터로 덮어써지고 페이지가 새로고침됩니다.
계속할까요?`;en("클라우드 불러오기",s,()=>{try{localStorage.setItem(_e,JSON.stringify(n.save)),C("☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다..."),setTimeout(()=>location.reload(),600)}catch(r){ue("오류",`클라우드 세이브 적용에 실패했습니다.
${String(r)}`,"⚠️")}},{icon:"☁️",primaryLabel:"불러오기",secondaryLabel:"취소"})}async function ws(){var a;try{if(sessionStorage.getItem(jt)==="1")return!1}catch(r){console.warn("sessionStorage get 실패:",r)}try{if(sessionStorage.getItem(mn)==="1")return sessionStorage.removeItem(mn),!1}catch(r){console.warn("sessionStorage get/remove 실패:",r)}if(!!localStorage.getItem(_e)||!await ct())return!1;const c=await go("seoulsurvival");if(!c.ok||!c.found)return!1;const i=`클라우드 세이브가 있습니다.

저장 시간: ${(a=c.save)!=null&&a.saveTime?new Date(c.save.saveTime).toLocaleString():c.updated_at?new Date(c.updated_at).toLocaleString():"시간 정보 없음"}

불러오시겠습니까?`;return new Promise(r=>{let m=!1;const d=p=>{m||(m=!0,r(p))};en("클라우드 세이브 발견",i,()=>{try{localStorage.setItem(_e,JSON.stringify(c.save)),C("☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다..."),setTimeout(()=>location.reload(),600),d(!0)}catch(p){console.error("클라우드 세이브 적용 실패:",p),d(!1)}},{icon:"☁️",primaryLabel:"불러오기",secondaryLabel:"나중에",onCancel:()=>{d(!1)}})})}oo&&oo.addEventListener("click",Ls),so&&so.addEventListener("click",Ss),(async()=>{try{sn=await ct(),Hs(t=>{sn=t})}catch{}})(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&io("visibility:hidden")}),window.addEventListener("pagehide",()=>{io("pagehide")}),tn&&tn.addEventListener("change",t=>{$e.particles=t.target.checked,bn()}),nn&&nn.addEventListener("change",t=>{$e.fancyGraphics=t.target.checked,bn()}),on&&on.addEventListener("change",t=>{$e.shortNumbers=t.target.checked,bn(),se()}),console.log("=== 판매 시스템 초기화 완료 ==="),console.log("✅ 구매/판매 모드 토글 시스템 활성화"),console.log("✅ 금융상품 통합 거래 시스템 (예금/적금/주식)"),console.log("✅ 부동산 통합 거래 시스템 (빌라/오피스텔/아파트/상가/빌딩)"),console.log("✅ 판매 가격: 현재가의 80%"),console.log("✅ 수량 선택: 1개/10개/100개"),console.log('💡 사용법: 상단 "구매/판매" 버튼으로 모드 전환 후 거래하세요!');let ao=!1;function Bs(){if(ao)return;ao=!0;const t=document.getElementById("statsTab");t&&t.addEventListener("click",n=>{const c=n.target.closest(".stats-toggle"),s=n.target.closest(".toggle-icon");if(c||s){const i=(c||s).closest(".stats-section");i&&i.classList.contains("collapsible")&&(i.classList.toggle("collapsed"),n.preventDefault(),n.stopPropagation())}})}let qt=[],Kt=[],cn=0,an=Date.now();function _s(){const t=Date.now(),n=Oe+Ne+Ue+qe+Ke+Ve+He+Ge+je+We+ze;qt=qt.filter(d=>t-d.time<36e5),Kt=Kt.filter(d=>t-d.time<864e5),t-an>=6e4&&(qt.push({time:t,earnings:n}),Kt.push({time:t,earnings:n}),an=t);const c=qt.length>0?n-qt[0].earnings:0,s=Kt.length>0?n-Kt[0].earnings:0,i=cn>0&&t-an>0?(n-cn)/cn*(36e5/(t-an))*100:0;let r=[1e6,1e7,1e8,1e9,1e10,1e11].find(d=>d>n)||"최고 달성";if(r!=="최고 달성"){const d=r-n;r=`${B(d)} 남음`}u(document.getElementById("hourlyEarnings"),G(Math.max(0,c))),u(document.getElementById("dailyEarnings"),G(Math.max(0,s)));const m=Math.abs(i)<.05?0:i;u(document.getElementById("growthRate"),`${m>=0?"+":""}${m.toFixed(1)}%/시간`),u(document.getElementById("nextMilestone"),r),cn=n}function xs(){const t=document.getElementById("assetDonutChart");if(!t)return;const n=t.getContext("2d");if(!n)return;const c=200,s=Math.max(1,Math.floor((window.devicePixelRatio||1)*100)/100),i=Math.round(c*s);(t.width!==i||t.height!==i)&&(t.width=i,t.height=i,t.style.width=`${c}px`,t.style.height=`${c}px`),n.setTransform(s,0,0,s,0,0);const a=c/2,r=c/2,m=80,d=50,p=y+ln(),E=Ts(),$=Ms(),A=p>0?y/p*100:0,w=p>0?E/p*100:0,b=p>0?$/p*100:0;n.clearRect(0,0,c,c),n.beginPath(),n.arc(a,r,m,0,Math.PI*2),n.fillStyle="rgba(255, 255, 255, 0.05)",n.fill();let g=-Math.PI/2;if(A>0){const P=A/100*Math.PI*2;n.beginPath(),n.moveTo(a,r),n.arc(a,r,m,g,g+P),n.closePath();const L=n.createLinearGradient(a-m,r-m,a+m,r+m);L.addColorStop(0,"#f59e0b"),L.addColorStop(1,"#d97706"),n.fillStyle=L,n.fill(),n.lineWidth=2,n.strokeStyle="rgba(0, 0, 0, 0.25)",n.stroke(),g+=P}if(w>0){const P=w/100*Math.PI*2;n.beginPath(),n.moveTo(a,r),n.arc(a,r,m,g,g+P),n.closePath(),n.fillStyle="rgba(59, 130, 246, 0.5)",n.fill(),g+=P}if(b>0){const P=b/100*Math.PI*2;n.beginPath(),n.moveTo(a,r),n.arc(a,r,m,g,g+P),n.closePath(),n.fillStyle="rgba(16, 185, 129, 0.5)",n.fill()}n.beginPath(),n.arc(a,r,d,0,Math.PI*2);const f=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()||"#0b1220";n.fillStyle=f,n.fill()}function Ts(){let t=0;if(T>0)for(let n=0;n<T;n++)t+=Y("deposit",n);if(_>0)for(let n=0;n<_;n++)t+=Y("savings",n);if(x>0)for(let n=0;n<x;n++)t+=Y("bond",n);if(V>0)for(let n=0;n<V;n++)t+=Y("usStock",n);if(q>0)for(let n=0;n<q;n++)t+=Y("crypto",n);return t}function Ms(){let t=0;if(F>0)for(let n=0;n<F;n++)t+=J("villa",n);if(O>0)for(let n=0;n<O;n++)t+=J("officetel",n);if(R>0)for(let n=0;n<R;n++)t+=J("apartment",n);if(N>0)for(let n=0;n<N;n++)t+=J("shop",n);if(U>0)for(let n=0;n<U;n++)t+=J("building",n);return t}function Ps(){try{const t=y+ln(),n=Oe+Ne+Ue+qe+Ke+Ve+He+Ge+je+We+ze;u(document.getElementById("totalAssets"),B(t)),u(document.getElementById("totalEarnings"),B(n)),u(document.getElementById("rpsStats"),G(ft())+"/초"),u(document.getElementById("clickIncomeStats"),G(Ft())),u(document.getElementById("totalClicksStats"),te.toLocaleString("ko-KR")+"회"),u(document.getElementById("laborIncomeStats"),B(ze));const c=Date.now()-Fe,s=Be+c,i=Math.floor(s/6e4),a=Math.floor(i/60),r=i%60,m=a>0?`${a}시간 ${r}분`:`${i}분`;console.log("🕐 플레이시간 계산:",{totalPlayTime:Be,currentSessionTime:c,totalPlayTimeMs:s,playTimeMinutes:i,playTimeText:m}),u(document.getElementById("playTimeStats"),m);const d=i>0?n/i*60:0;u(document.getElementById("hourlyRate"),G(d)+"/시간");const p=n>0?ze/n*100:0,E=Oe+Ne+Ue+qe+Ke,$=n>0?E/n*100:0,A=Ve+He+Ge+je+We,w=n>0?A/n*100:0,b=document.querySelector(".income-bar"),g=document.getElementById("laborSegment"),f=document.getElementById("financialSegment"),P=document.getElementById("propertySegment");if(b&&!b.classList.contains("animated")&&b.classList.add("animated"),g){g.style.width=p.toFixed(1)+"%";const Re=g.querySelector("span");Re&&(Re.textContent=p>=5?`🛠️ ${p.toFixed(1)}%`:"")}if(f){f.style.width=$.toFixed(1)+"%";const Re=f.querySelector("span");Re&&(Re.textContent=$>=5?`💰 ${$.toFixed(1)}%`:"")}if(P){P.style.width=w.toFixed(1)+"%";const Re=P.querySelector("span");Re&&(Re.textContent=w>=5?`🏢 ${w.toFixed(1)}%`:"")}u(document.getElementById("laborLegend"),`노동: ${p.toFixed(1)}%`),u(document.getElementById("financialLegend"),`금융: ${$.toFixed(1)}%`),u(document.getElementById("propertyLegend"),`부동산: ${w.toFixed(1)}%`),_s(),xs();const L=n||1;Os(),u(document.getElementById("depositsOwnedStats"),T+"개"),u(document.getElementById("depositsLifetimeStats"),B(Oe));const z=L>0?(Oe/L*100).toFixed(1):"0.0";u(document.getElementById("depositsContribution"),`(${z}%)`);const ne=T>0?Ht("deposit",T):0;u(document.getElementById("depositsValue"),S(ne)),u(document.getElementById("savingsOwnedStats"),_+"개"),u(document.getElementById("savingsLifetimeStats"),B(Ne));const re=L>0?(Ne/L*100).toFixed(1):"0.0";u(document.getElementById("savingsContribution"),`(${re}%)`);const ke=_>0?Ht("savings",_):0;u(document.getElementById("savingsValue"),S(ke)),u(document.getElementById("bondsOwnedStats"),x+"개"),u(document.getElementById("bondsLifetimeStats"),B(Ue));const nt=L>0?(Ue/L*100).toFixed(1):"0.0";u(document.getElementById("bondsContribution"),`(${nt}%)`);const W=x>0?Ht("bond",x):0;u(document.getElementById("bondsValue"),S(W)),u(document.getElementById("usStocksOwnedStats"),V+"개"),u(document.getElementById("usStocksLifetimeStats"),B(qe));const he=L>0?(qe/L*100).toFixed(1):"0.0";u(document.getElementById("usStocksContribution"),`(${he}%)`);const ce=V>0?Ht("usStock",V):0;u(document.getElementById("usStocksValue"),S(ce)),u(document.getElementById("cryptosOwnedStats"),q+"개"),u(document.getElementById("cryptosLifetimeStats"),B(Ke));const ge=L>0?(Ke/L*100).toFixed(1):"0.0";u(document.getElementById("cryptosContribution"),`(${ge}%)`);const ve=q>0?Ht("crypto",q):0;u(document.getElementById("cryptosValue"),S(ve)),u(document.getElementById("villasOwnedStats"),F+"채"),u(document.getElementById("villasLifetimeStats"),G(Ve));const we=L>0?(Ve/L*100).toFixed(1):"0.0";u(document.getElementById("villasContribution"),`(${we}%)`);const e=F>0?Gt("villa",F):0;u(document.getElementById("villasValue"),G(e)),u(document.getElementById("officetelsOwnedStats"),O+"채"),u(document.getElementById("officetelsLifetimeStats"),G(He));const o=L>0?(He/L*100).toFixed(1):"0.0";u(document.getElementById("officetelsContribution"),`(${o}%)`);const k=O>0?Gt("officetel",O):0;u(document.getElementById("officetelsValue"),G(k)),u(document.getElementById("apartmentsOwnedStats"),R+"채"),u(document.getElementById("apartmentsLifetimeStats"),G(Ge));const M=L>0?(Ge/L*100).toFixed(1):"0.0";u(document.getElementById("apartmentsContribution"),`(${M}%)`);const me=R>0?Gt("apartment",R):0;u(document.getElementById("apartmentsValue"),G(me)),u(document.getElementById("shopsOwnedStats"),N+"채"),u(document.getElementById("shopsLifetimeStats"),G(je));const ie=L>0?(je/L*100).toFixed(1):"0.0";u(document.getElementById("shopsContribution"),`(${ie}%)`);const l=N>0?Gt("shop",N):0;u(document.getElementById("shopsValue"),G(l)),u(document.getElementById("buildingsOwnedStats"),U+"채"),u(document.getElementById("buildingsLifetimeStats"),G(We));const ot=L>0?(We/L*100).toFixed(1):"0.0";u(document.getElementById("buildingsContribution"),`(${ot}%)`);const st=U>0?Gt("building",U):0;u(document.getElementById("buildingsValue"),G(st));const Z=Ns();u(document.getElementById("bestEfficiency"),Z[0]||"-"),u(document.getElementById("secondEfficiency"),Z[1]||"-"),u(document.getElementById("thirdEfficiency"),Z[2]||"-"),Us()}catch(t){console.error("Stats tab update failed:",t)}}let tt=!1,Qe=0,Vt=null;const Rs=1e4,As=7e3;function ro(t){if(!t||t<=0)return"—";const n=Math.floor(t/1e3/60);if(n<=0)return"1분 미만";const c=Math.floor(n/60),s=n%60;return c>0?s?`${c}시간 ${s}분`:`${c}시간`:`${s}분`}function Ds(t){if(!t||t<=0)return"—";const n=Math.floor(t/1e3/60);if(n<=0)return"<1m";const c=Math.floor(n/60),s=n%60;return c>=100?`${c}h`:c>0?`${c}h ${String(s).padStart(2,"0")}m`:`${s}m`}async function rn(t=!1){const n=document.getElementById("leaderboardContainer");if(!n)return;if(!_n()){n.innerHTML=`
          <div class="leaderboard-error">
            <div>리더보드 설정이 아직 완료되지 않았어요. 나중에 다시 확인해 주세요.</div>
          </div>
        `,tt=!1,Qe=Date.now();return}if(tt&&!t){console.log("리더보드: 이미 로딩 중, 스킵");return}const c=Date.now();if(!t&&Qe>0&&c-Qe<Rs){console.log("리더보드: 최근 업데이트로부터 시간이 짧음, 스킵");return}Vt&&(clearTimeout(Vt),Vt=null),Vt=setTimeout(async()=>{tt=!0,Vt=null;const s=setTimeout(()=>{if(tt){console.error("리더보드: 타임아웃 발생"),n.innerHTML=`
              <div class="leaderboard-error">
                <div>리더보드 불러오기 실패 (타임아웃)</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;const i=n.querySelector(".leaderboard-retry-btn");i&&i.addEventListener("click",()=>{rn(!0)}),tt=!1,Qe=Date.now()}},As);try{n.innerHTML='<div class="leaderboard-loading">리더보드를 불러오는 중...</div>',console.log("리더보드: API 호출 시작");const i=await zs(10,"assets");if(clearTimeout(s),console.log("리더보드: API 응답 받음",i),!i.success){const w=i.error||"알 수 없는 오류",b=i.status,g=i.errorType;console.error("리더보드: API 오류",{errorMsg:w,status:b,errorType:g});let f="";g==="forbidden"||b===401||b===403?f="권한이 없어 리더보드를 불러올 수 없습니다.":g==="config"?f="리더보드 설정 오류: Supabase 설정을 확인해주세요.":g==="schema"?f="리더보드 테이블이 설정되지 않았습니다. 관리자에게 문의해주세요.":g==="network"?f="네트워크 오류로 리더보드를 불러올 수 없습니다.":f=`리더보드를 불러올 수 없습니다: ${w}`,n.innerHTML=`
              <div class="leaderboard-error">
                <div>${f}</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;const P=n.querySelector(".leaderboard-retry-btn");P&&P.addEventListener("click",()=>{rn(!0)}),tt=!1,Qe=Date.now();return}const a=i.data||[];if(a.length===0){console.log("리더보드: 기록 없음"),n.innerHTML='<div class="leaderboard-empty">리더보드에 아직 기록이 없습니다.</div>',tt=!1,Qe=Date.now();const w=document.getElementById("myRankContent");w&&(w.innerHTML=`
                <div class="leaderboard-my-rank-empty">
                  리더보드 기록이 아직 없습니다.
                </div>
              `);return}console.log("리더보드: 항목 수",a.length);const r=document.createElement("table");r.className="leaderboard-table";const m=document.createElement("thead");m.innerHTML=`
            <tr>
              <th class="col-rank">#</th>
              <th class="col-nickname">닉네임</th>
              <th class="col-assets">자산</th>
              <th class="col-playtime">시간</th>
            </tr>
          `,r.appendChild(m);const d=document.createElement("tbody");let p=null;const E=(ae||"").trim().toLowerCase();a.forEach((w,b)=>{const g=document.createElement("tr"),f=document.createElement("td");f.className="col-rank",f.textContent=String(b+1);const P=document.createElement("td");P.className="col-nickname";const L=w.tower_count||0,z=L>0?`${w.nickname||"익명"} 🗼${L>1?`x${L}`:""}`:w.nickname||"익명";P.textContent=z;const ne=document.createElement("td");ne.className="col-assets";const re=Math.floor(w.total_assets||0);ne.textContent=`${re.toLocaleString("ko-KR")}원`;const ke=document.createElement("td");ke.className="col-playtime",ke.textContent=Ds(w.play_time_ms||0);const nt=(w.nickname||"").trim().toLowerCase();E&&E===nt&&(g.classList.add("is-me"),p={rank:b+1,...w}),g.appendChild(f),g.appendChild(P),g.appendChild(ne),g.appendChild(ke),d.appendChild(g)}),r.appendChild(d),n.innerHTML="",n.appendChild(r),Qe=Date.now(),console.log("리더보드: 업데이트 완료");const $=document.getElementById("leaderboardLastUpdated");if($){const w=new Date(Qe),b=String(w.getHours()).padStart(2,"0"),g=String(w.getMinutes()).padStart(2,"0"),f=String(w.getSeconds()).padStart(2,"0");$.textContent=`마지막 갱신: ${b}:${g}:${f}`}const A=document.getElementById("myRankContent");if(A)if(!E)A.innerHTML=`
                <div class="leaderboard-my-rank-empty">
                  닉네임을 설정하면 내 순위와 기록이 여기 표시됩니다.
                </div>
              `;else if(p){const w=ro(p.play_time_ms||0),b=p.tower_count||0,g=b>0?`${p.nickname||ae||"익명"} 🗼${b>1?`x${b}`:""}`:p.nickname||ae||"익명";A.innerHTML=`
                <div class="my-rank-card">
                  <div class="my-rank-header">
                    <span class="my-rank-label">내 기록</span>
                    <span class="my-rank-rank-badge">${p.rank}위</span>
                  </div>
                  <div class="my-rank-main">
                    <div class="my-rank-name">${g}</div>
                    <div class="my-rank-assets">💰 ${B(p.total_assets||0)}</div>
                  </div>
                  <div class="my-rank-meta">
                    <span class="my-rank-playtime">⏱️ ${w}</span>
                    <span class="my-rank-note">TOP 10 내 순위</span>
                  </div>
                </div>
              `}else{if(!await ct()){A.innerHTML=`
                  <div class="leaderboard-my-rank-empty">
                    로그인 후에 내 순위를 볼 수 있습니다.
                    <div class="leaderboard-my-rank-actions">
                      <button type="button" class="btn" id="openLoginFromRanking">
                        🔐 Google로 로그인
                      </button>
                    </div>
                  </div>
                `;const b=document.getElementById("openLoginFromRanking");b&&b.addEventListener("click",async g=>{if(g.preventDefault(),!_n()){alert("현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.");return}(await fo("google")).ok||alert("로그인에 실패했습니다. 다시 시도해 주세요.")});return}A.innerHTML=`
                <div class="leaderboard-my-rank-loading">
                  내 순위를 불러오는 중...
                </div>
              `;try{const b=await Ys(ae,"assets");if(!b.success||!b.data){let g="";b.errorType==="forbidden"?g=`
                      <div class="leaderboard-my-rank-empty">
                        로그인 후에 내 순위를 볼 수 있습니다.
                        <div class="leaderboard-my-rank-actions">
                          <button type="button" class="btn" id="openLoginFromRanking">
                            🔐 Google로 로그인
                          </button>
                        </div>
                      </div>
                    `:b.errorType==="network"?g=`
                      <div class="leaderboard-my-rank-error">
                        네트워크 오류로 내 순위를 불러올 수 없습니다.
                      </div>
                    `:b.errorType==="not_found"?g=`
                      <div class="leaderboard-my-rank-empty">
                        아직 리더보드에 기록이 없습니다.<br />
                        게임을 플레이하고 저장하면 순위가 표시됩니다.
                      </div>
                    `:g=`
                      <div class="leaderboard-my-rank-error">
                        내 순위를 불러올 수 없습니다.
                      </div>
                    `,A.innerHTML=g;const f=document.getElementById("openLoginFromRanking");f&&f.addEventListener("click",async P=>{if(P.preventDefault(),!_n()){alert("현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.");return}(await fo("google")).ok||alert("로그인에 실패했습니다. 다시 시도해 주세요.")})}else{const g=b.data,f=ro(g.play_time_ms||0),P=g.tower_count||0,L=P>0?`${g.nickname||ae||"익명"} 🗼${P>1?`x${P}`:""}`:g.nickname||ae||"익명";A.innerHTML=`
                    <div class="my-rank-card">
                      <div class="my-rank-header">
                        <span class="my-rank-label">내 기록</span>
                        <span class="my-rank-rank-badge">${g.rank}위</span>
                      </div>
                      <div class="my-rank-main">
                        <div class="my-rank-name">${L}</div>
                        <div class="my-rank-assets">💰 ${B(g.total_assets||0)}</div>
                      </div>
                      <div class="my-rank-meta">
                        <span class="my-rank-playtime">⏱️ ${f}</span>
                        <span class="my-rank-note">내 실제 순위</span>
                      </div>
                    </div>
                  `}}catch(b){console.error("내 순위 RPC 호출 실패:",b),A.innerHTML=`
                  <div class="leaderboard-my-rank-error">
                    내 순위를 불러오는 중 오류가 발생했습니다.
                  </div>
                `}}}catch(i){clearTimeout(s),console.error("리더보드 UI 업데이트 실패:",i),n.innerHTML=`<div class="leaderboard-error">리더보드를 불러오는 중 오류가 발생했습니다: ${i.message||"알 수 없는 오류"}</div>`,Qe=Date.now()}finally{tt=!1}},t?0:300)}async function Fs(){if(ae){if(Ee>0){console.log("리더보드: 타워 달성 후 자동 업데이트 중단");return}try{const t=y+ln(),n=Date.now()-Fe,c=Be+n;await $o(ae,t,c,Ee)}catch(t){console.error("리더보드 업데이트 실패:",t)}}}function Ht(t,n){let c=0;for(let s=0;s<n;s++)c+=Y(t,s);return c}function Gt(t,n){let c=0;for(let s=0;s<n;s++)c+=J(t,s);return c}function Os(){const t={savings:{id:"savingsOwnedStats",name:"적금"},bond:{id:"bondsOwnedStats",name:"주식"},usStock:{id:"usStocksOwnedStats",name:"미국주식"},crypto:{id:"cryptosOwnedStats",name:"코인"}},n={villa:{id:"villasOwnedStats",name:"빌라"},officetel:{id:"officetelsOwnedStats",name:"오피스텔"},apartment:{id:"apartmentsOwnedStats",name:"아파트"},shop:{id:"shopsOwnedStats",name:"상가"},building:{id:"buildingsOwnedStats",name:"빌딩"}};Object.keys(t).forEach(c=>{const s=t[c],i=document.getElementById(s.id);if(i){const a=i.closest(".asset-row");if(a){const r=!X(c);a.classList.toggle("locked",r)}}}),Object.keys(n).forEach(c=>{const s=n[c],i=document.getElementById(s.id);if(i){const a=i.closest(".asset-row");if(a){const r=!X(c);a.classList.toggle("locked",r)}}})}function ln(){let t=0;return T>0&&(t+=Y("deposit",T-1)),_>0&&(t+=Y("savings",_-1)),x>0&&(t+=Y("bond",x-1)),F>0&&(t+=J("villa",F-1)),O>0&&(t+=J("officetel",O-1)),R>0&&(t+=J("apartment",R-1)),N>0&&(t+=J("shop",N-1)),U>0&&(t+=J("building",U-1)),t}function Ns(){const t=[];return T>0&&t.push({name:"예금",efficiency:h.deposit,count:T}),_>0&&t.push({name:"적금",efficiency:h.savings,count:_}),x>0&&t.push({name:"국내주식",efficiency:h.bond,count:x}),V>0&&t.push({name:"미국주식",efficiency:h.usStock,count:V}),q>0&&t.push({name:"코인",efficiency:h.crypto,count:q}),F>0&&t.push({name:"빌라",efficiency:v.villa*Le,count:F}),O>0&&t.push({name:"오피스텔",efficiency:v.officetel*Le,count:O}),R>0&&t.push({name:"아파트",efficiency:v.apartment*Le,count:R}),N>0&&t.push({name:"상가",efficiency:v.shop*Le,count:N}),U>0&&t.push({name:"빌딩",efficiency:v.building*Le,count:U}),t.sort((n,c)=>c.efficiency-n.efficiency),t.slice(0,3).map(n=>`${n.name} (${S(Math.floor(n.efficiency))}원/초, ${n.count}개 보유)`)}function Us(){const t=document.getElementById("achievementGrid");if(!t)return;if(!window.__achievementTooltipPortalInitialized){window.__achievementTooltipPortalInitialized=!0;const s=()=>{let m=document.getElementById("achievementTooltip");return m||(m=document.createElement("div"),m.id="achievementTooltip",m.className="achievement-tooltip",m.setAttribute("role","tooltip"),m.setAttribute("aria-hidden","true"),document.body.appendChild(m)),m},i=m=>{const d=Ze.find(p=>p.id===m);return d?d.unlocked?`${d.name}
${d.desc}
✅ 달성!`:`${d.name}
${d.desc}
🔒 미달성`:""},a=()=>{const m=document.getElementById("achievementTooltip");m&&(m.classList.remove("active","bottom"),m.style.left="",m.style.top="",m.style.bottom="",m.style.opacity="",m.style.visibility="",m.style.pointerEvents="",m.setAttribute("aria-hidden","true"),window.__achievementTooltipAnchorId=null)},r=m=>{var P,L;const d=s(),p=((P=m==null?void 0:m.dataset)==null?void 0:P.achievementId)||((L=m==null?void 0:m.id)==null?void 0:L.replace(/^ach_/,""));if(!p)return;if(window.__achievementTooltipAnchorId===p&&d.classList.contains("active")){a();return}a(),d.textContent=i(p),d.setAttribute("aria-hidden","false"),d.classList.add("active"),d.style.opacity="0",d.style.visibility="hidden",d.style.pointerEvents="none",d.style.left="0px",d.style.top="0px",d.style.bottom="auto",d.offsetHeight;const E=d.getBoundingClientRect(),$=m.getBoundingClientRect(),A=window.innerWidth,w=window.innerHeight;let b=$.left+$.width/2,g=$.top-E.height-8,f=!1;g<10&&(g=$.bottom+8,f=!0),g+E.height>w-10&&(g=w-E.height-10),b+E.width/2>A-10&&(b=A-E.width/2-10),b-E.width/2<10&&(b=E.width/2+10),d.style.left=`${b}px`,d.style.top=`${g}px`,d.style.bottom="auto",d.classList.toggle("bottom",f),d.style.visibility="visible",d.style.opacity="1",d.style.pointerEvents="none",window.__achievementTooltipAnchorId=p};t.addEventListener("click",m=>{const d=m.target.closest(".achievement-icon");d&&(m.stopPropagation(),r(d))}),t.addEventListener("pointerout",m=>{var p,E;(E=(p=m.target).closest)!=null&&E.call(p,".achievement-icon")&&a()}),document.addEventListener("click",()=>a(),!0),window.addEventListener("scroll",()=>a(),!0),window.addEventListener("resize",()=>a(),!0)}if(t.children.length>0){let s=0;Object.values(Ze).forEach(a=>{const r=document.getElementById("ach_"+a.id);r&&(a.unlocked?(r.classList.add("unlocked"),r.classList.remove("locked"),s++):(r.classList.add("locked"),r.classList.remove("unlocked")),r.title=a.unlocked?`${a.name}
${a.desc}
✅ 달성!`:`${a.name}
${a.desc}
🔒 미달성`)});const i=Object.keys(Ze).length;u(document.getElementById("achievementProgress"),`${s}/${i}`);return}t.innerHTML="";let n=0;const c=Object.keys(Ze).length;Object.values(Ze).forEach(s=>{const i=document.createElement("div");i.className="achievement-icon",i.id="ach_"+s.id,i.dataset.achievementId=s.id,i.textContent=s.icon,i.title=s.unlocked?`${s.name}
${s.desc}
✅ 달성!`:`${s.name}
${s.desc}
🔒 미달성`,s.unlocked?(i.classList.add("unlocked"),n++):i.classList.add("locked"),t.appendChild(i)}),u(document.getElementById("achievementProgress"),`${n}/${c}`)}let kt=null,dn=null;function Sn(){return window.matchMedia&&window.matchMedia("(min-width: 769px)").matches}function wn(){const t=document.getElementById("rankingTab");if(!t||!Sn()&&!t.classList.contains("active")||kt)return;rn(!0);const c=6e4-Date.now()%6e4;kt=setTimeout(function s(){const i=t.classList.contains("active");if(!Sn()&&!i){Bn();return}rn(!1),kt=setTimeout(s,6e4)},c)}function Bn(){kt&&(clearTimeout(kt),kt=null)}function qs(){const t=document.getElementById("rankingTab"),n=document.getElementById("leaderboardContainer");if(!(!t||!n)){if(!("IntersectionObserver"in window)){console.log("IntersectionObserver 미지원: active 탭 기준으로만 리더보드 폴링 제어");return}dn&&dn.disconnect(),dn=new IntersectionObserver(c=>{c.forEach(s=>{const i=s.isIntersecting,a=t.classList.contains("active");(Sn()?i:i&&a)?wn():Bn()})},{root:null,threshold:.1}),dn.observe(n)}}const lo=document.querySelectorAll(".nav-btn"),Ks=document.querySelectorAll(".tab-content");lo.forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-tab");Ks.forEach(s=>s.classList.remove("active")),lo.forEach(s=>s.classList.remove("active"));const c=document.getElementById(n);c&&c.classList.add("active"),t.classList.add("active"),n==="rankingTab"?wn():Bn()})}),se(),setTimeout(()=>{const t=document.getElementById("rankingTab");t&&t.classList.contains("active")&&wn(),qs()},1e3);const uo=document.getElementById("upgradeList");uo&&(uo.classList.remove("collapsed-section"),console.log("✅ Upgrade list initialized and opened")),gt(),console.log("=== UPGRADE SYSTEM DEBUG ==="),console.log("Total upgrades defined:",Object.keys(Q).length),console.log("Unlocked upgrades:",Object.values(Q).filter(t=>t.unlocked).length),console.log("Purchased upgrades:",Object.values(Q).filter(t=>t.purchased).length),console.log("First 3 upgrades:",Object.entries(Q).slice(0,3).map(([t,n])=>({id:t,unlocked:n.unlocked,purchased:n.purchased,cost:n.cost}))),console.log("==========================="),window.cheat={addCash:t=>{y+=t,se(),console.log(`💰 Added ${t} cash. New total: ${y}`)},unlockAllUpgrades:()=>{var t;Object.values(Q).forEach(n=>n.unlocked=!0),gt(),console.log("🔓 All upgrades unlocked!"),console.log("Upgrade list element:",document.getElementById("upgradeList")),console.log("Upgrade list children:",(t=document.getElementById("upgradeList"))==null?void 0:t.children.length)},unlockFirstUpgrade:()=>{const t=Object.keys(Q)[0];Q[t].unlocked=!0,gt(),console.log("🔓 First upgrade unlocked:",Q[t].name)},setClicks:t=>{te=t,se(),Yn(),console.log(`👆 Set clicks to ${t}`)},testUpgrade:()=>{var n;const t=Object.keys(Q)[0];Q[t].unlocked=!0,y+=1e7,gt(),se(),console.log("🧪 Test setup complete:"),console.log("  - First upgrade unlocked"),console.log("  - Cash: 1000만원"),console.log("  - Upgrade list visible:",!((n=document.getElementById("upgradeList"))!=null&&n.classList.contains("collapsed-section"))),console.log("  - Upgrade items count:",document.querySelectorAll(".upgrade-item").length)}},console.log("💡 치트 코드 사용 가능:"),console.log("  - cheat.testUpgrade() : 빠른 테스트 (첫 업그레이드 해금 + 1000만원)"),console.log("  - cheat.addCash(1000000000) : 10억원 추가"),console.log("  - cheat.unlockAllUpgrades() : 모든 업그레이드 해금"),console.log("  - cheat.setClicks(100) : 클릭 수 설정"),C("🧪 v2.6 Cookie Clicker 스타일 업그레이드 시스템 구현 완료"),C("✅ DOM 참조 오류 수정 완료"),C("✅ 커리어 진행률 시스템 정상화"),C("✅ 업그레이드 클릭 기능 활성화"),C("✅ 자동 저장 시스템 작동 중"),C("⚡ 성능 최적화: 업그레이드 리스트 깜빡임 해결"),console.log("Initial state:",{cash:y,totalClicks:te,deposits:T,savings:_,bonds:x,villas:F,officetels:O,apartments:R,shops:N,buildings:U})});
