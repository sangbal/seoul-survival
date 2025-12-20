import{i as Co,g as ht,a as Ae,o as Js,b as Tn,s as bo}from"./authBoot-BnOC8kKe.js";import"https://esm.sh/@supabase/supabase-js@2.49.1";function Ys(E,m){try{return localStorage.setItem(E,JSON.stringify(m)),!0}catch{return!1}}function Qs(E,m=null){try{const G=localStorage.getItem(E);return G?JSON.parse(G):m}catch{return m}}const Io="game_saves";function Lo(E){return E?{message:(E==null?void 0:E.message)||String(E),code:E==null?void 0:E.code,details:E==null?void 0:E.details,hint:E==null?void 0:E.hint}:null}function Eo(E){const m=String((E==null?void 0:E.message)||"").toLowerCase();return m.includes("does not exist")||m.includes("relation")||m.includes("42p01")}async function Mn(E){if(!Co())return{ok:!1,reason:"not_configured"};const m=ht();if(!m)return{ok:!1,reason:"not_configured"};const G=await Ae();if(!G)return{ok:!1,reason:"not_signed_in"};const{data:M,error:B}=await m.from(Io).select("save, save_ts, updated_at").eq("user_id",G.id).eq("game_slug",E).maybeSingle();return B?{ok:!1,reason:Eo(B)?"missing_table":"query_failed",error:Lo(B)}:M?{ok:!0,found:!0,save:M.save,save_ts:M.save_ts,updated_at:M.updated_at}:{ok:!0,found:!1}}async function ho(E,m){if(!Co())return{ok:!1,reason:"not_configured"};const G=ht();if(!G)return{ok:!1,reason:"not_configured"};const M=await Ae();if(!M)return{ok:!1,reason:"not_signed_in"};const B=Number((m==null?void 0:m.ts)||Date.now())||Date.now(),K={user_id:M.id,game_slug:E,save:m,save_ts:B};(m==null?void 0:m.nickname)!==void 0?console.log("☁️ 클라우드 저장: 닉네임 포함됨:",m.nickname||"(빈 문자열)"):console.warn("⚠️ 클라우드 저장: 닉네임 필드가 없음");const{error:J}=await G.from(Io).upsert(K,{onConflict:"user_id,game_slug"});return J?{ok:!1,reason:Eo(J)?"missing_table":"upsert_failed",error:Lo(J)}:{ok:!0}}const mn="seoulsurvival";function An(E){return(E||"").trim()}async function Xs(E){const m=ht();if(!m)return console.warn("Leaderboard: Supabase client not configured for nickname check"),{taken:!1,reason:"not_configured"};const M=An(E).toLowerCase();if(!M)return{taken:!1,reason:"empty"};try{const{data:B,error:K}=await m.from("leaderboard").select("nickname").eq("game_slug",mn).ilike("nickname",M).limit(1);return K?(console.error("Nickname check error:",K),{taken:!1,reason:"error"}):{taken:!!(B&&B.length>0)}}catch(B){return console.error("Nickname check exception:",B),{taken:!1,reason:"exception"}}}async function Pn(E,m,G,M=0){try{const B=await Ae();if(!B)return console.log("Leaderboard: User not logged in, skipping update"),{success:!1,error:"Not logged in"};const K=ht(),{data:J,error:me}=await K.from("leaderboard").upsert({user_id:B.id,game_slug:mn,nickname:E||"익명",total_assets:m,play_time_ms:G,tower_count:M,updated_at:new Date().toISOString()},{onConflict:"user_id,game_slug"}).select().single();return me?(console.error("Leaderboard update error:",me),{success:!1,error:me.message}):(console.log("Leaderboard updated:",J),{success:!0,data:J})}catch(B){return console.error("Leaderboard update exception:",B),{success:!1,error:B.message}}}async function Zs(E=10,m="assets"){var G,M,B,K,J,me;try{const ae=ht();if(!ae)return console.error("Leaderboard: Supabase client not configured"),console.warn("[LB] fetch failed",{reason:"not_configured",phase:"init"}),{success:!1,error:"Supabase가 설정되지 않았습니다. shared/auth/config.js를 확인해주세요.",data:[],errorType:"config"};let oe=ae.from("leaderboard").select("nickname, total_assets, play_time_ms, tower_count, updated_at").eq("game_slug",mn).limit(E);m==="assets"?oe=oe.order("tower_count",{ascending:!1}).order("total_assets",{ascending:!1}):m==="playtime"&&(oe=oe.order("play_time_ms",{ascending:!1}));const{data:fn,error:se}=await oe;if(se){console.error("Leaderboard fetch error:",se);const Ye=se.status??se.code??null,st=se.code==="PGRST116"||((G=se.message)==null?void 0:G.includes("relation"))||((M=se.message)==null?void 0:M.includes("does not exist")),j=Ye===401||Ye===403||((K=(B=se.message)==null?void 0:B.toLowerCase)==null?void 0:K.call(B).includes("permission denied"))||((me=(J=se.message)==null?void 0:J.toLowerCase)==null?void 0:me.call(J).includes("rls"));return console.warn("[LB] fetch failed",{phase:"select",status:Ye,code:se.code,message:se.message,details:se.details,hint:se.hint}),st?{success:!1,error:"리더보드 테이블이 없습니다. Supabase SQL Editor에서 supabase/leaderboard.sql을 실행해주세요.",data:[],errorType:"schema",status:Ye}:j?{success:!1,error:"권한이 없어 리더보드를 불러올 수 없습니다.",data:[],errorType:"forbidden",status:Ye}:{success:!1,error:se.message,data:[],errorType:"generic",status:Ye}}return{success:!0,data:fn||[]}}catch(ae){return console.error("Leaderboard fetch exception:",ae),console.warn("[LB] fetch failed",{phase:"exception",message:ae==null?void 0:ae.message,error:ae}),{success:!1,error:ae.message||"알 수 없는 오류",data:[],errorType:"network"}}}async function vo(E,m="assets"){const G=ht();if(!G)return console.warn("[LB] my_rank failed",{reason:"not_configured"}),{success:!1,data:null,errorType:"config"};const B=An(E).toLowerCase();if(!B)return{success:!1,data:null,errorType:"no_nickname"};try{const{data:K,error:J,status:me}=await G.rpc("get_my_rank",{p_game_slug:mn,p_nickname:B,p_sort_by:m});if(J){console.error("My rank RPC error:",J),console.warn("[LB] my_rank failed",{phase:"rpc",status:me??J.status,code:J.code,message:J.message,details:J.details,hint:J.hint});const oe=me===401||me===403?"forbidden":"generic";return{success:!1,data:null,error:J.message,errorType:oe,status:me??J.status}}const ae=Array.isArray(K)?K[0]:K;return ae?{success:!0,data:{rank:ae.rank,nickname:ae.nickname,total_assets:ae.total_assets,play_time_ms:ae.play_time_ms,tower_count:ae.tower_count||0}}:{success:!1,data:null,errorType:"not_found"}}catch(K){return console.error("My rank RPC exception:",K),console.warn("[LB] my_rank failed",{phase:"exception",message:K==null?void 0:K.message,error:K}),{success:!1,data:null,error:K.message||"알 수 없는 오류",errorType:"network"}}}const ec=""+new URL("work_bg_01_alba_night-Db0rzBPq.png",import.meta.url).href,tc=""+new URL("work_bg_02_gyeyakjik_night-DOcTIOmf.png",import.meta.url).href,nc=""+new URL("work_bg_03_sawon_night-C5FuvRVs.png",import.meta.url).href,oc=""+new URL("work_bg_04_daeri_night-BsoSfDAg.png",import.meta.url).href,sc=""+new URL("work_bg_05_gwajang_night-CcE0KsfB.png",import.meta.url).href,cc=""+new URL("work_bg_06_chajang_night-CnOFWkRx.png",import.meta.url).href,ac=""+new URL("work_bg_07_bujang_night-0BAHlWBE.png",import.meta.url).href,ic=""+new URL("work_bg_08_sangmu_night-CEIOpmTg.png",import.meta.url).href,rc=""+new URL("work_bg_09_jeonmu_night-BHVf_WEo.png",import.meta.url).href,lc=""+new URL("work_bg_10_ceo_night-BG1qCML1.png",import.meta.url).href,Rn=location.hostname==="localhost"||location.hostname==="127.0.0.1";Rn||(console.log=()=>{},console.warn=()=>{},console.error=()=>{});function dc(){const E=navigator.userAgent||"",m=E.includes("KAKAOTALK"),G=E.includes("Instagram"),M=E.includes("FBAN")||E.includes("FBAV"),B=E.includes("Line"),K=E.includes("MicroMessenger");return{isInApp:m||G||M||B||K,isKakao:m,isInstagram:G,isFacebook:M,isLine:B,isWeChat:K}}function uc(){const{isInApp:E}=dc();if(!E)return;const m=document.createElement("div");m.className="inapp-warning-banner",m.innerHTML=`
    이 브라우저에서는 Google 로그인이 제한될 수 있습니다.<br />
    <strong>Chrome / Safari 등 기본 브라우저에서 다시 열어 주세요.</strong>
    <div class="inapp-warning-actions">
      <button type="button" class="btn-small" id="copyGameUrlBtn">URL 복사</button>
      <button type="button" class="btn-small" id="closeInappWarningBtn">확인</button>
    </div>
  `,document.body.prepend(m);const G=m.querySelector("#copyGameUrlBtn");G&&G.addEventListener("click",async()=>{const B="https://clicksurvivor.com/seoulsurvival/";try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(B),alert(`주소가 복사되었습니다.
Chrome/Safari 주소창에 붙여넣어 열어 주세요.`);return}const K=document.createElement("textarea");K.value=B,K.style.position="fixed",K.style.left="-999999px",K.style.top="-999999px",document.body.appendChild(K),K.focus(),K.select();try{if(document.execCommand("copy"))alert(`주소가 복사되었습니다.
Chrome/Safari 주소창에 붙여넣어 열어 주세요.`);else throw new Error("execCommand failed")}catch{alert(B+`
위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.`)}finally{document.body.removeChild(K)}}catch{alert(B+`
위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.`)}});const M=m.querySelector("#closeInappWarningBtn");M&&M.addEventListener("click",()=>{m.remove()})}document.addEventListener("DOMContentLoaded",()=>{var ko;function E(){const t=document.querySelector("header");if(!t)return;const n=Math.ceil(t.getBoundingClientRect().height||0);n>0&&document.documentElement.style.setProperty("--header-h",`${n}px`)}E(),uc(),window.addEventListener("resize",E);try{(ko=window.visualViewport)==null||ko.addEventListener("resize",E)}catch{}try{const t=document.querySelector("header");t&&"ResizeObserver"in window&&new ResizeObserver(E).observe(t)}catch{}try{const t=n=>n.preventDefault();document.addEventListener("gesturestart",t,{passive:!1}),document.addEventListener("gesturechange",t,{passive:!1}),document.addEventListener("gestureend",t,{passive:!1})}catch{}function m(t,n){t&&t.textContent!==void 0&&(t.textContent=n)}function G(t,n,c){const s=te;if(ge==="buy"){const a=t==="financial"?j(n,c)*s:V(n,c,s);if(k<a)return L(`💸 자금이 부족합니다. (필요: ${M(a)}원)`),{success:!1,newCount:c};k-=a;const i=c+s,r=t==="financial"?"개":"채",d={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인",villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"}[n]||n;L(`✅ ${d} ${s}${r}를 구입했습니다. (보유 ${i}${r})`);const y={deposit:"💰",savings:"🏦",bond:"📈",usStock:"🇺🇸",crypto:"₿",villa:"🏠",officetel:"🏢",apartment:"🏘️",shop:"🏪",building:"🏙️"};return he.particles&&no(y[n]||"🏠",s),{success:!0,newCount:i}}else if(ge==="sell"){if(c<s)return L(`❌ 판매할 수량이 부족합니다. (보유: ${c})`),{success:!1,newCount:c};const a=t==="financial"?ct(n,c)*s:at(n,c,s);k+=a;const i=c-s,r=t==="financial"?"개":"채",d={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인",villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"}[n]||n;return L(`💰 ${d} ${s}${r}를 판매했습니다. (+${M(a)}원, 보유 ${i}${r})`),{success:!0,newCount:i}}return{success:!1,newCount:c}}function M(t){if(t>=1e12){const n=(t/1e12).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"조"}else if(t>=1e8){const n=(t/1e8).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"억"}else if(t>=1e4){const n=(t/1e4).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"만"}else if(t>=1e3){const n=(t/1e3).toFixed(1);return parseFloat(n).toLocaleString("ko-KR")+"천"}else return Math.floor(t).toString()}function B(t){return he.shortNumbers?t>=1e12?(t/1e12).toLocaleString("ko-KR",{minimumFractionDigits:2,maximumFractionDigits:2})+"조":t>=1e8?(t/1e8).toLocaleString("ko-KR",{minimumFractionDigits:2,maximumFractionDigits:2})+"억":t>=1e4?(t/1e4).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"만원":t>=1e3?Math.floor(t/1e3).toLocaleString("ko-KR")+"천원":Math.floor(t).toLocaleString("ko-KR")+"원":Math.floor(t).toLocaleString("ko-KR")+"원"}function K(t){return B(t)}function J(t){const n=Math.floor(t||0);return n>=1e12?Math.floor(n/1e12).toLocaleString("ko-KR")+"조":n>=1e8?Math.floor(n/1e8).toLocaleString("ko-KR")+"억":n>=1e4?Math.floor(n/1e4).toLocaleString("ko-KR")+"만원":"0만원"}function me(t){return t>=1e8?Math.round(t/1e8).toLocaleString("ko-KR")+"억":t>=1e4?Math.round(t/1e4).toLocaleString("ko-KR")+"만":t>=1e3?Math.round(t/1e3).toLocaleString("ko-KR")+"천":Math.floor(t).toLocaleString("ko-KR")}function ae(t){return t>=1e8?(Math.round(t/1e7)/10).toLocaleString("ko-KR")+"억":t>=1e4?Math.round(t/1e4).toLocaleString("ko-KR")+"만":Math.floor(t).toLocaleString("ko-KR")}function oe(t){return B(t)}function fn(t){return t>=1e12?(t/1e12).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"조":t>=1e8?(t/1e8).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"억":t>=1e4?(t/1e4).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"만":t>=1e3?(t/1e3).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"천":Math.floor(t).toString()}function se(t){return he.shortNumbers?fn(t)+"원":Math.floor(t).toLocaleString("ko-KR")+"원"}const Ye={deposit:5e4,savings:5e5,bond:5e6,usStock:25e6,crypto:1e8},st={villa:25e7,officetel:35e7,apartment:8e8,shop:12e8,building:3e9,tower:1e12};function j(t,n,c=1){const s=Ye[t];let a=0;for(let i=0;i<c;i++){const r=n+i;let u=s*Math.pow(1.05,r);a+=u}return Math.floor(a)}function ct(t,n,c=1){if(n<=0)return 0;let s=0;for(let a=0;a<c&&!(n-a<=0);a++){const i=j(t,n-a-1,1);s+=Math.floor(i*1)}return s}function V(t,n,c=1){const s=st[t];if(!s)return 0;if(t==="tower")return s*c;let a=0;for(let i=0;i<c;i++){const r=n+i;let u=s*Math.pow(1.05,r);a+=u}return Math.floor(a)}function at(t,n,c=1){if(t==="tower"||n<=0)return 0;let s=0;for(let a=0;a<c&&!(n-a<=0);a++){const i=V(t,n-a-1,1);s+=Math.floor(i*1)}return s}let k=0,Be=0,_e=Date.now(),Qe=Date.now(),P=0,x=0,T=0,W=0,H=0,Fe=0,Oe=0,De=0,Ne=0,Ue=0,qe=0,Ke=0,Ve=0,He=0,Ge=0,ge="buy",te=1;const Le="seoulTycoonSaveV1",Yt="ss_blockCloudRestoreUntilNicknameDone",gn="ss_skipCloudRestoreOnce";let Qt=new Date,ne="",dt=!1;const Y={part_time_job:{name:"🍕 아르바이트 경험",desc:"클릭 수익 1.2배",cost:5e4,icon:"🍕",unlockCondition:()=>z>=1,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},internship:{name:"📝 인턴십",desc:"클릭 수익 1.2배",cost:2e5,icon:"📝",unlockCondition:()=>z>=2,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},efficient_work:{name:"⚡ 효율적인 업무 처리",desc:"클릭 수익 1.2배",cost:5e5,icon:"⚡",unlockCondition:()=>z>=3,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},focus_training:{name:"🎯 집중력 강화",desc:"클릭 수익 1.2배",cost:2e6,icon:"🎯",unlockCondition:()=>z>=4,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},professional_education:{name:"📚 전문 교육",desc:"클릭 수익 1.2배",cost:1e7,icon:"📚",unlockCondition:()=>z>=5,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},performance_bonus:{name:"💰 성과급",desc:"2% 확률로 10배 수익",cost:1e7,icon:"💰",unlockCondition:()=>z>=6,effect:()=>{},category:"labor",unlocked:!1,purchased:!1},career_recognition:{name:"💼 경력 인정",desc:"클릭 수익 1.2배",cost:3e7,icon:"💼",unlockCondition:()=>z>=6,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},overtime_work:{name:"🔥 초과근무",desc:"클릭 수익 1.2배",cost:5e7,icon:"🔥",unlockCondition:()=>z>=7,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},honor_award:{name:"🎖️ 명예상",desc:"클릭 수익 1.2배",cost:1e8,icon:"🎖️",unlockCondition:()=>z>=7,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},expertise_development:{name:"💎 전문성 개발",desc:"클릭 수익 1.2배",cost:2e8,icon:"💎",unlockCondition:()=>z>=8,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},teamwork:{name:"🤝 팀워크 향상",desc:"클릭 수익 1.2배",cost:5e8,icon:"🤝",unlockCondition:()=>z>=8,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},leadership:{name:"👑 리더십",desc:"클릭 수익 1.2배",cost:2e9,icon:"👑",unlockCondition:()=>z>=8,effect:()=>{pe*=1.2},category:"labor",unlocked:!1,purchased:!1},ceo_privilege:{name:"👔 CEO 특권",desc:"클릭 수익 2.0배",cost:1e10,icon:"👔",unlockCondition:()=>z>=9,effect:()=>{pe*=2},category:"labor",unlocked:!1,purchased:!1},global_experience:{name:"🌍 글로벌 경험",desc:"클릭 수익 2.0배",cost:5e10,icon:"🌍",unlockCondition:()=>z>=9&&ie>=15e3,effect:()=>{pe*=2},category:"labor",unlocked:!1,purchased:!1},entrepreneurship:{name:"🚀 창업",desc:"클릭 수익 2.0배",cost:1e11,icon:"🚀",unlockCondition:()=>z>=9&&ie>=3e4,effect:()=>{pe*=2},category:"labor",unlocked:!1,purchased:!1},deposit_boost_1:{name:"💰 예금 이자율 상승",desc:"예금 수익 2배",cost:1e5,icon:"💰",unlockCondition:()=>P>=5,effect:()=>{C.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_2:{name:"💎 프리미엄 예금",desc:"예금 수익 2배",cost:25e4,icon:"💎",unlockCondition:()=>P>=15,effect:()=>{C.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_3:{name:"💠 다이아몬드 예금",desc:"예금 수익 2배",cost:5e5,icon:"💠",unlockCondition:()=>P>=30,effect:()=>{C.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_4:{name:"💍 플래티넘 예금",desc:"예금 수익 2배",cost:1e6,icon:"💍",unlockCondition:()=>P>=40,effect:()=>{C.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_5:{name:"👑 킹 예금",desc:"예금 수익 2배",cost:2e6,icon:"👑",unlockCondition:()=>P>=50,effect:()=>{C.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},savings_boost_1:{name:"🏦 적금 복리 효과",desc:"적금 수익 2배",cost:1e6,icon:"🏦",unlockCondition:()=>x>=5,effect:()=>{C.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_2:{name:"🏅 골드 적금",desc:"적금 수익 2배",cost:25e5,icon:"🏅",unlockCondition:()=>x>=15,effect:()=>{C.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_3:{name:"💍 플래티넘 적금",desc:"적금 수익 2배",cost:5e6,icon:"💍",unlockCondition:()=>x>=30,effect:()=>{C.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_4:{name:"💠 다이아몬드 적금",desc:"적금 수익 2배",cost:1e7,icon:"💠",unlockCondition:()=>x>=40,effect:()=>{C.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_5:{name:"👑 킹 적금",desc:"적금 수익 2배",cost:2e7,icon:"👑",unlockCondition:()=>x>=50,effect:()=>{C.savings*=2},category:"savings",unlocked:!1,purchased:!1},bond_boost_1:{name:"📈 주식 수익률 향상",desc:"주식 수익 2배",cost:1e7,icon:"📈",unlockCondition:()=>T>=5,effect:()=>{C.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_2:{name:"💹 프리미엄 주식",desc:"주식 수익 2배",cost:25e6,icon:"💹",unlockCondition:()=>T>=15,effect:()=>{C.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_3:{name:"📊 블루칩 주식",desc:"주식 수익 2배",cost:5e7,icon:"📊",unlockCondition:()=>T>=30,effect:()=>{C.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_4:{name:"💎 대형주 포트폴리오",desc:"주식 수익 2배",cost:1e8,icon:"💎",unlockCondition:()=>T>=40,effect:()=>{C.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_5:{name:"👑 킹 주식",desc:"주식 수익 2배",cost:2e8,icon:"👑",unlockCondition:()=>T>=50,effect:()=>{C.bond*=2},category:"bond",unlocked:!1,purchased:!1},usstock_boost_1:{name:"🇺🇸 S&P 500 투자",desc:"미국주식 수익 2배",cost:5e7,icon:"🇺🇸",unlockCondition:()=>W>=5,effect:()=>{C.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_2:{name:"📈 나스닥 투자",desc:"미국주식 수익 2배",cost:125e6,icon:"📈",unlockCondition:()=>W>=15,effect:()=>{C.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_3:{name:"💎 글로벌 주식 포트폴리오",desc:"미국주식 수익 2배",cost:25e7,icon:"💎",unlockCondition:()=>W>=30,effect:()=>{C.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_4:{name:"🌍 글로벌 대형주",desc:"미국주식 수익 2배",cost:5e8,icon:"🌍",unlockCondition:()=>W>=40,effect:()=>{C.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_5:{name:"👑 킹 글로벌 주식",desc:"미국주식 수익 2배",cost:1e9,icon:"👑",unlockCondition:()=>W>=50,effect:()=>{C.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},crypto_boost_1:{name:"₿ 비트코인 투자",desc:"코인 수익 2배",cost:2e8,icon:"₿",unlockCondition:()=>H>=5,effect:()=>{C.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_2:{name:"💎 알트코인 포트폴리오",desc:"코인 수익 2배",cost:5e8,icon:"💎",unlockCondition:()=>H>=15,effect:()=>{C.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_3:{name:"🚀 디지털 자산 전문가",desc:"코인 수익 2배",cost:1e9,icon:"🚀",unlockCondition:()=>H>=30,effect:()=>{C.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_4:{name:"🌐 메타버스 자산",desc:"코인 수익 2배",cost:2e9,icon:"🌐",unlockCondition:()=>H>=40,effect:()=>{C.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_5:{name:"👑 킹 암호화폐",desc:"코인 수익 2배",cost:4e9,icon:"👑",unlockCondition:()=>H>=50,effect:()=>{C.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},villa_boost_1:{name:"🏘️ 빌라 리모델링",desc:"빌라 수익 2배",cost:5e8,icon:"🏘️",unlockCondition:()=>F>=5,effect:()=>{I.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_2:{name:"🌟 럭셔리 빌라",desc:"빌라 수익 2배",cost:125e7,icon:"🌟",unlockCondition:()=>F>=15,effect:()=>{I.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_3:{name:"✨ 프리미엄 빌라 단지",desc:"빌라 수익 2배",cost:25e8,icon:"✨",unlockCondition:()=>F>=30,effect:()=>{I.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_4:{name:"💎 다이아몬드 빌라",desc:"빌라 수익 2배",cost:5e9,icon:"💎",unlockCondition:()=>F>=40,effect:()=>{I.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_5:{name:"👑 킹 빌라",desc:"빌라 수익 2배",cost:1e10,icon:"👑",unlockCondition:()=>F>=50,effect:()=>{I.villa*=2},category:"villa",unlocked:!1,purchased:!1},officetel_boost_1:{name:"🏢 오피스텔 스마트화",desc:"오피스텔 수익 2배",cost:7e8,icon:"🏢",unlockCondition:()=>O>=5,effect:()=>{I.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_2:{name:"🏙️ 프리미엄 오피스텔",desc:"오피스텔 수익 2배",cost:175e7,icon:"🏙️",unlockCondition:()=>O>=15,effect:()=>{I.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_3:{name:"🌆 럭셔리 오피스텔 타워",desc:"오피스텔 수익 2배",cost:35e8,icon:"🌆",unlockCondition:()=>O>=30,effect:()=>{I.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_4:{name:"💎 다이아몬드 오피스텔",desc:"오피스텔 수익 2배",cost:7e9,icon:"💎",unlockCondition:()=>O>=40,effect:()=>{I.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_5:{name:"👑 킹 오피스텔",desc:"오피스텔 수익 2배",cost:14e9,icon:"👑",unlockCondition:()=>O>=50,effect:()=>{I.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},apartment_boost_1:{name:"🏡 아파트 프리미엄화",desc:"아파트 수익 2배",cost:16e8,icon:"🏡",unlockCondition:()=>A>=5,effect:()=>{I.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_2:{name:"🏰 타워팰리스급 아파트",desc:"아파트 수익 2배",cost:4e9,icon:"🏰",unlockCondition:()=>A>=15,effect:()=>{I.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_3:{name:"🏛️ 초고급 아파트 단지",desc:"아파트 수익 2배",cost:8e9,icon:"🏛️",unlockCondition:()=>A>=30,effect:()=>{I.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_4:{name:"💎 다이아몬드 아파트",desc:"아파트 수익 2배",cost:16e9,icon:"💎",unlockCondition:()=>A>=40,effect:()=>{I.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_5:{name:"👑 킹 아파트",desc:"아파트 수익 2배",cost:32e9,icon:"👑",unlockCondition:()=>A>=50,effect:()=>{I.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},shop_boost_1:{name:"🏪 상가 입지 개선",desc:"상가 수익 2배",cost:24e8,icon:"🏪",unlockCondition:()=>D>=5,effect:()=>{I.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_2:{name:"🛍️ 프리미엄 상권",desc:"상가 수익 2배",cost:6e9,icon:"🛍️",unlockCondition:()=>D>=15,effect:()=>{I.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_3:{name:"🏬 메가몰 상권",desc:"상가 수익 2배",cost:12e9,icon:"🏬",unlockCondition:()=>D>=30,effect:()=>{I.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_4:{name:"💎 다이아몬드 상권",desc:"상가 수익 2배",cost:24e9,icon:"💎",unlockCondition:()=>D>=40,effect:()=>{I.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_5:{name:"👑 킹 상권",desc:"상가 수익 2배",cost:48e9,icon:"👑",unlockCondition:()=>D>=50,effect:()=>{I.shop*=2},category:"shop",unlocked:!1,purchased:!1},building_boost_1:{name:"🏙️ 빌딩 테넌트 확보",desc:"빌딩 수익 2배",cost:6e9,icon:"🏙️",unlockCondition:()=>N>=5,effect:()=>{I.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_2:{name:"💼 랜드마크 빌딩",desc:"빌딩 수익 2배",cost:15e9,icon:"💼",unlockCondition:()=>N>=15,effect:()=>{I.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_3:{name:"🏢 초고층 마천루",desc:"빌딩 수익 2배",cost:3e10,icon:"🏢",unlockCondition:()=>N>=30,effect:()=>{I.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_4:{name:"💎 다이아몬드 빌딩",desc:"빌딩 수익 2배",cost:6e10,icon:"💎",unlockCondition:()=>N>=40,effect:()=>{I.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_5:{name:"👑 킹 빌딩",desc:"빌딩 수익 2배",cost:12e10,icon:"👑",unlockCondition:()=>N>=50,effect:()=>{I.building*=2},category:"building",unlocked:!1,purchased:!1},rent_multiplier:{name:"📊 부동산 관리 전문화",desc:"모든 부동산 수익 +10%",cost:1e9,icon:"📊",unlockCondition:()=>rt()>=10,effect:()=>{Ee*=1.1},category:"global",unlocked:!1,purchased:!1},manager_hire:{name:"👨‍💼 전문 관리인 고용",desc:"전체 임대 수익 +5%",cost:5e9,icon:"👨‍💼",unlockCondition:()=>rt()>=20,effect:()=>{Ee*=1.05,yn++},category:"global",unlocked:!1,purchased:!1},financial_expert:{name:"💼 금융 전문가 고용",desc:"모든 금융 수익 +20%",cost:1e10,icon:"💼",unlockCondition:()=>z>=8,effect:()=>{C.deposit*=1.2,C.savings*=1.2,C.bond*=1.2},category:"global",unlocked:!1,purchased:!1},auto_work_system:{name:"📱 자동 업무 처리 시스템",desc:"1초마다 자동으로 1회 클릭 (초당 수익 추가)",cost:5e9,icon:"📱",unlockCondition:()=>z>=7&&rt()>=10,effect:()=>{Xt=!0},category:"global",unlocked:!1,purchased:!1}};let F=0,O=0,A=0,D=0,N=0,ke=0;const pn={deposit:!0,savings:!1,bond:!1,villa:!1,officetel:!1,apartment:!1,shop:!1,building:!1,tower:!1},C={deposit:50,savings:750,bond:11250,usStock:6e4,crypto:25e4},I={villa:84380,officetel:177190,apartment:607500,shop:137e4,building:514e4},Fn={...C},On={...I};function So(){for(const t of Object.keys(Fn))C[t]=Fn[t];for(const t of Object.keys(On))I[t]=On[t]}function wo(){So();for(const t of Object.values(Y)){if(!(t!=null&&t.purchased)||typeof t.effect!="function")continue;const n=Function.prototype.toString.call(t.effect);if(n.includes("FINANCIAL_INCOME")||n.includes("BASE_RENT"))try{t.effect()}catch{}}}let pe=1,Ee=1,Xt=!1,yn=0;const Dn="capitalClicker_settings";let he={particles:!0,fancyGraphics:!0,shortNumbers:!1},z=0,je=0;const vt=[{name:"알바",multiplier:1,requiredIncome:0,requiredClicks:0,bgImage:ec},{name:"계약직",multiplier:1.5,requiredIncome:5e6,requiredClicks:100,bgImage:tc},{name:"사원",multiplier:2,requiredIncome:1e7,requiredClicks:300,bgImage:nc},{name:"대리",multiplier:2.5,requiredIncome:2e7,requiredClicks:800,bgImage:oc},{name:"과장",multiplier:3,requiredIncome:3e7,requiredClicks:1500,bgImage:sc},{name:"차장",multiplier:3.5,requiredIncome:4e7,requiredClicks:2500,bgImage:cc},{name:"부장",multiplier:4,requiredIncome:5e7,requiredClicks:4e3,bgImage:ac},{name:"상무",multiplier:5,requiredIncome:7e7,requiredClicks:6e3,bgImage:ic},{name:"전무",multiplier:10,requiredIncome:12e7,requiredClicks:9e3,bgImage:rc},{name:"CEO",multiplier:12,requiredIncome:25e7,requiredClicks:15e3,bgImage:lc}];let Nn=1e9,Un=5e9,Zt=1,xe=0,re=null;const qn=[{name:"강남 아파트 대박",duration:5e4,color:"#4CAF50",effects:{property:{apartment:2.5,villa:1.4,officetel:1.2}},description:"강남 아파트발 상승 랠리로 주거형 부동산 수익이 상승합니다."},{name:"전세 대란",duration:6e4,color:"#2196F3",effects:{property:{villa:2.5,officetel:2.5,apartment:1.8}},description:"전세 수요 급증으로 빌라/오피스텔 중심의 임대 수익이 급등합니다."},{name:"상권 활성화",duration:5e4,color:"#FF9800",effects:{property:{shop:2.5,building:1.6}},description:"상권 회복으로 상가 수익이 크게 증가합니다."},{name:"오피스 수요 급증",duration:55e3,color:"#9C27B0",effects:{property:{building:2.5,shop:1.4,officetel:1.2}},description:"오피스 확장으로 빌딩 중심 수익이 급등합니다."},{name:"한국은행 금리 인하",duration:7e4,color:"#2196F3",effects:{financial:{deposit:.7,savings:.8,bond:2,usStock:1.5}},description:"금리 인하로 예금/적금은 약세, 주식은 강세를 보입니다."},{name:"주식시장 대호황",duration:6e4,color:"#4CAF50",effects:{financial:{bond:2.5,usStock:2,crypto:1.5}},description:"리스크 자산 선호로 주식 중심 수익이 크게 증가합니다."},{name:"미국 연준 양적완화",duration:7e4,color:"#2196F3",effects:{financial:{usStock:2.5,crypto:1.8,bond:1.3}},description:"달러 유동성 확대로 미국주식/코인 수익이 상승합니다."},{name:"비트코인 급등",duration:45e3,color:"#FF9800",effects:{financial:{crypto:2.5,usStock:1.2}},description:"암호화폐 랠리로 코인 수익이 크게 증가합니다."},{name:"금융위기",duration:9e4,color:"#F44336",effects:{financial:{bond:.7,usStock:.7,crypto:.7},property:{shop:.7,building:.7}},description:"리스크 회피로 주식/코인/상업용 부동산이 타격을 받습니다."},{name:"은행 파산 위기",duration:75e3,color:"#9C27B0",effects:{financial:{deposit:.7,savings:.7,bond:.8}},description:"은행 신뢰 하락으로 예금/적금 수익이 둔화합니다."},{name:"주식시장 폭락",duration:75e3,color:"#F44336",effects:{financial:{bond:.7,usStock:.7,crypto:.7}},description:"주식/리스크 자산 급락으로 수익이 크게 감소합니다."},{name:"암호화폐 규제",duration:75e3,color:"#9C27B0",effects:{financial:{crypto:.7}},description:"규제 강화로 코인 수익이 감소합니다."}];let ie=0;const Xe=[{id:"first_click",name:"첫 노동",desc:"첫 번째 클릭을 했다",icon:"👆",condition:()=>ie>=1,unlocked:!1},{id:"first_deposit",name:"첫 예금",desc:"첫 번째 예금을 구입했다",icon:"💰",condition:()=>P>=1,unlocked:!1},{id:"first_savings",name:"첫 적금",desc:"첫 번째 적금을 구입했다",icon:"🏦",condition:()=>x>=1,unlocked:!1},{id:"first_bond",name:"첫 국내주식",desc:"첫 번째 국내주식을 구입했다",icon:"📈",condition:()=>T>=1,unlocked:!1},{id:"first_us_stock",name:"첫 미국주식",desc:"첫 번째 미국주식을 구입했다",icon:"🇺🇸",condition:()=>W>=1,unlocked:!1},{id:"first_crypto",name:"첫 코인",desc:"첫 번째 코인을 구입했다",icon:"₿",condition:()=>H>=1,unlocked:!1},{id:"first_property",name:"첫 부동산",desc:"첫 번째 부동산을 구입했다",icon:"🏠",condition:()=>F+O+A+D+N>=1,unlocked:!1},{id:"first_upgrade",name:"첫 업그레이드",desc:"첫 번째 업그레이드를 구입했다",icon:"⚡",condition:()=>Object.values(Y).some(t=>t.purchased),unlocked:!1},{id:"financial_expert",name:"금융 전문가",desc:"모든 금융상품을 보유했다",icon:"💼",condition:()=>P>0&&x>0&&T>0&&W>0&&H>0,unlocked:!1},{id:"property_collector",name:"부동산 수집가",desc:"5채의 부동산을 보유했다",icon:"🏘️",condition:()=>rt()>=5,unlocked:!1},{id:"property_tycoon",name:"부동산 타이쿤",desc:"모든 부동산 종류를 보유했다",icon:"🏙️",condition:()=>F>0&&O>0&&A>0&&D>0&&N>0,unlocked:!1},{id:"investment_guru",name:"투자 고수",desc:"모든 업그레이드를 구입했다",icon:"📊",condition:()=>Object.values(Y).every(t=>t.purchased),unlocked:!1},{id:"gangnam_rich",name:"강남 부자",desc:"강남 부동산 3채를 보유했다",icon:"🏙️",condition:()=>A>=3,unlocked:!1},{id:"global_investor",name:"글로벌 투자자",desc:"해외 투자 1억원을 달성했다",icon:"🌍",condition:()=>W*1e6+H*1e6>=1e8,unlocked:!1},{id:"crypto_expert",name:"암호화폐 전문가",desc:"코인 투자 5억원을 달성했다",icon:"₿",condition:()=>H*1e6>=5e8,unlocked:!1},{id:"real_estate_agent",name:"부동산 중개사",desc:"부동산 20채를 보유했다",icon:"🏠",condition:()=>rt()>=20,unlocked:!1},{id:"millionaire",name:"백만장자",desc:"총 자산 1억원을 달성했다",icon:"💎",condition:()=>k>=1e8,unlocked:!1},{id:"ten_millionaire",name:"억만장자",desc:"총 자산 10억원을 달성했다",icon:"💰",condition:()=>k>=1e9,unlocked:!1},{id:"hundred_millionaire",name:"부자",desc:"총 자산 100억원을 달성했다",icon:"🏆",condition:()=>k>=1e10,unlocked:!1},{id:"billionaire",name:"대부호",desc:"총 자산 1,000억원을 달성했다",icon:"👑",condition:()=>k>=1e11,unlocked:!1},{id:"trillionaire",name:"재벌",desc:"총 자산 1조원을 달성했다",icon:"🏰",condition:()=>k>=1e12,unlocked:!1},{id:"global_rich",name:"세계적 부자",desc:"총 자산 10조원을 달성했다",icon:"🌍",condition:()=>k>=1e13,unlocked:!1},{id:"legendary_rich",name:"전설의 부자",desc:"총 자산 100조원을 달성했다",icon:"⭐",condition:()=>k>=1e14,unlocked:!1},{id:"god_rich",name:"신의 부자",desc:"총 자산 1,000조원을 달성했다",icon:"✨",condition:()=>k>=1e15,unlocked:!1},{id:"career_starter",name:"직장인",desc:"계약직으로 승진했다",icon:"👔",condition:()=>z>=1,unlocked:!1},{id:"employee",name:"정규직",desc:"사원으로 승진했다",icon:"👨‍💼",condition:()=>z>=2,unlocked:!1},{id:"deputy_director",name:"팀장",desc:"과장으로 승진했다",icon:"👨‍💻",condition:()=>z>=4,unlocked:!1},{id:"executive",name:"임원",desc:"상무로 승진했다",icon:"👨‍🎓",condition:()=>z>=7,unlocked:!1},{id:"ceo",name:"CEO",desc:"CEO가 되었다",icon:"👑",condition:()=>z>=9,unlocked:!1},{id:"chaebol_chairman",name:"재벌 회장",desc:"자산 1조원을 달성했다",icon:"🏆",condition:()=>k>=1e12,unlocked:!1},{id:"global_ceo",name:"글로벌 CEO",desc:"해외 진출을 달성했다",icon:"🌍",condition:()=>W>=10&&H>=10,unlocked:!1},{id:"legendary_ceo",name:"전설의 CEO",desc:"모든 목표를 달성했다",icon:"⭐",condition:()=>z>=9&&k>=1e14,unlocked:!1}],Bo=document.getElementById("cash"),_o=document.getElementById("financial"),xo=document.getElementById("properties"),To=document.getElementById("rps"),it=document.getElementById("workBtn"),ve=document.querySelector(".work"),Mo=document.getElementById("log"),Kn=document.getElementById("shareBtn"),Vn=document.getElementById("favoriteBtn"),Po=document.getElementById("clickIncomeButton");document.getElementById("clickIncomeLabel");const Ro=document.getElementById("clickMultiplier"),Ao=document.getElementById("rentMultiplier"),Ze=document.getElementById("gameModalRoot"),We=document.getElementById("gameModalTitle"),ze=document.getElementById("gameModalMessage"),Se=document.getElementById("gameModalPrimary"),Ce=document.getElementById("gameModalSecondary"),Hn=document.getElementById("depositCount"),Fo=document.getElementById("incomePerDeposit"),Ct=document.getElementById("buyDeposit"),Gn=document.getElementById("savingsCount"),Oo=document.getElementById("incomePerSavings"),It=document.getElementById("buySavings"),jn=document.getElementById("bondCount"),Do=document.getElementById("incomePerBond"),Lt=document.getElementById("buyBond");document.getElementById("usStockCount"),document.getElementById("incomePerUsStock");const Et=document.getElementById("buyUsStock");document.getElementById("cryptoCount"),document.getElementById("incomePerCrypto");const St=document.getElementById("buyCrypto"),$n=document.getElementById("buyMode"),kn=document.getElementById("sellMode"),en=document.getElementById("qty1"),tn=document.getElementById("qty5"),nn=document.getElementById("qty10"),wt=document.getElementById("toggleUpgrades"),Bt=document.getElementById("toggleFinancial"),_t=document.getElementById("toggleProperties"),Wn=document.getElementById("saveStatus"),zn=document.getElementById("resetBtn"),No=document.getElementById("depositCurrentPrice"),Uo=document.getElementById("savingsCurrentPrice"),qo=document.getElementById("bondCurrentPrice"),Ko=document.getElementById("villaCurrentPrice"),Vo=document.getElementById("officetelCurrentPrice"),Ho=document.getElementById("aptCurrentPrice"),Go=document.getElementById("shopCurrentPrice"),jo=document.getElementById("buildingCurrentPrice"),Wo=document.getElementById("villaCount"),zo=document.getElementById("rentPerVilla"),xt=document.getElementById("buyVilla"),Jo=document.getElementById("officetelCount"),Yo=document.getElementById("rentPerOfficetel"),Tt=document.getElementById("buyOfficetel"),Qo=document.getElementById("aptCount"),Xo=document.getElementById("rentPerApt"),Mt=document.getElementById("buyApt"),Zo=document.getElementById("shopCount"),es=document.getElementById("rentPerShop"),Pt=document.getElementById("buyShop"),ts=document.getElementById("buildingCount"),ns=document.getElementById("rentPerBuilding"),Rt=document.getElementById("buyBuilding"),Jn=document.getElementById("towerCountDisplay"),Yn=document.getElementById("towerCountBadge"),Qn=document.getElementById("towerCurrentPrice"),ut=document.getElementById("buyTower"),os=document.getElementById("currentCareer");document.getElementById("careerCost");const mt=document.getElementById("careerProgress"),Xn=document.getElementById("careerProgressText"),At=document.getElementById("careerRemaining");function L(t){if(["🧪","v2.","v3.","Cookie Clicker","업그레이드 시스템","DOM 참조","성능 최적화","자동 저장 시스템","업그레이드 클릭","커리어 진행률","구현 완료","수정 완료","정상화","작동 중","활성화","해결","버그 수정","최적화","개편","벤치마킹"].some(p=>t.includes(p)))return;const s=p=>String(p).padStart(2,"0"),a=new Date,i=`${s(a.getHours())}:${s(a.getMinutes())}`;function r(){const p=a.getFullYear(),g=s(a.getMonth()+1),w=s(a.getDate()),S=typeof Qe<"u"&&Qe?Qe:_e,U=Math.max(1,Math.floor((Date.now()-S)/864e5)+1),ee=document.getElementById("diaryHeaderMeta");ee&&(ee.textContent=`${p}.${g}.${w}(${U}일차)`);const X=document.getElementById("diaryMetaDate"),ce=document.getElementById("diaryMetaDay");X&&(X.textContent=`오늘: ${p}.${g}.${w}`),ce&&(ce.textContent=`일차: ${U}일차`)}function u(p){var ce,tt,q,$e,de,be,Ie,we;const g=String(p||"").trim();if(/다음\s*업그레이드/.test(g)&&/클릭\s*남/.test(g))return"";const w=e=>e.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/g,"").trim(),S=e=>Math.floor(Math.random()*e),U=(e,o)=>{if(!Array.isArray(o)||o.length===0)return"";const b=`__diaryLastPick_${e}`,R=window[b];let ye=S(o.length);return o.length>1&&typeof R=="number"&&ye===R&&(ye=(ye+1+S(o.length-1))%o.length),window[b]=ye,o[ye]},ee=e=>w(e).replace(/\s+/g," ").trim();if(g.startsWith("🏆 업적 달성:")){const e=w(g).replace(/^업적 달성:\s*/,""),[o,b]=e.split(/\s*-\s*/);return U("achievement",[`오늘은 체크 하나를 더했다. (${o||"업적"})`,`작게나마 성취. ${o||"업적"}라니, 나도 꽤 한다.`,`기록해둔다: ${o||"업적"}.
${b||""}`.trim(),`"${o||"업적"}" 달성.
${b?`메모: ${b}`:""}`.trim(),`별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. (${o||"업적"})`,`또 하나의 마일스톤. ${o||"업적"}.
${b||""}`.trim(),`작은 성취도 성취다. ${o||"업적"}.
${b||""}`.trim(),`하루하루가 쌓인다. 오늘은 ${o||"업적"}.
${b||""}`.trim(),`기록에 하나 더. ${o||"업적"}.
${b||""}`.trim(),`뿌듯함이 조금씩. ${o||"업적"} 달성.
${b||""}`.trim(),`이런 게 인생이지. ${o||"업적"}.
${b||""}`.trim(),`작은 발걸음이 모여 길이 된다. ${o||"업적"}.
${b||""}`.trim()])}if(g.startsWith("🎉")&&g.includes("승진했습니다")){const e=g.match(/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/),o=(ce=e==null?void 0:e[1])==null?void 0:ce.trim(),b=(tt=e==null?void 0:e[2])==null?void 0:tt.trim(),R=b?b.replace(/[()]/g,"").trim():"";return U("promotion",[`명함이 바뀌었다. ${o||"다음 단계"}.
${R}`.trim(),`오늘은 좀 뿌듯하다. ${o||"승진"}이라니.
${R}`.trim(),`승진했다. 책임도 같이 딸려온다는데… 일단 축하부터.
${R}`.trim(),`그래, 나도 올라갈 줄 안다. ${o||"승진"}.
${R}`.trim(),`커피가 조금 더 쓰게 느껴진다. ${o||"승진"}의 맛.
${R}`.trim(),`한 단계 올라섰다. ${o||"승진"}.
${R}`.trim(),`노력이 보상받는 순간. ${o||"승진"}.
${R}`.trim(),`새로운 시작. ${o||"승진"}.
${R}`.trim(),`더 높은 곳에서 보는 풍경이 다르다. ${o||"승진"}.
${R}`.trim(),`자리도 바뀌고 마음도 바뀐다. ${o||"승진"}.
${R}`.trim(),`이제야 진짜 시작인가. ${o||"승진"}.
${R}`.trim(),`무게감이 느껴진다. ${o||"승진"}의 무게.
${R}`.trim()])}if(g.startsWith("🔓")){const e=ee(g),o=g.match(/^🔓\s*(.+?)이\s*해금/),b=((o==null?void 0:o[1])||"").trim(),R={적금:[`자동이체 버튼이 눈에 들어왔다.
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
${e}`]};return b&&R[b]?U(`unlock_${b}`,R[b]):U("unlock",[`문이 하나 열렸다.
${e}`,`다음 장으로 넘어갈 수 있게 됐다.
${e}`,`아직 초반인데도, 벌써 선택지가 늘었다.
${e}`,`드디어. ${e}`,`새로운 가능성이 열렸다.
${e}`,`선택지가 하나 더 생겼다.
${e}`,`다음 단계로 나아갈 수 있다.
${e}`,`기회의 문이 열렸다.
${e}`,`새로운 길이 보인다.
${e}`,`진행의 길이 열렸다.
${e}`])}if(g.startsWith("💸 자금이 부족합니다")){const e=ee(g);return U("noMoney",[`지갑이 얇아서 아무것도 못 했다.
${e}`,`현실 체크. 돈이 없다.
${e}`,`오늘은 참는다. 아직은 무리.
${e}`,`계산기만 두드리고 끝.
${e}`,`통장 잔고가 거짓말을 한다.
${e}`,`돈이 부족하다는 건 늘 아프다.
${e}`,`다시 모아야 한다. 조금 더.
${e}`,`욕심을 접어야 할 때.
${e}`,`현실이 무겁다.
${e}`,`내일을 기다려야 한다.
${e}`])}if(g.startsWith("✅")&&g.includes("구입했습니다")){const e=ee(g),o=g.match(/^✅\s*(.+?)\s+\d/),b=((o==null?void 0:o[1])||"").trim(),R={예금:[`일단은 안전한 데에 묶어두자.
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
${e}`]};return b&&R[b]?U(`buy_${b}`,R[b]):U("buy",[`결심하고 질렀다.
${e}`,`통장 잔고가 줄어들었다. 대신 미래를 샀다.
${e}`,`이건 소비가 아니라 투자라고… 스스로에게 말했다.
${e}`,`한 발 더 나아갔다.
${e}`,`손이 먼저 움직였다.
${e}`,`투자의 길을 걷는다.
${e}`,`미래를 위한 선택.
${e}`,`돈이 돈을 버는 구조.
${e}`,`자산을 늘리는 순간.
${e}`,`투자자의 마음가짐.
${e}`])}if(g.startsWith("💰")&&g.includes("판매했습니다")){const e=ee(g),o=g.match(/^💰\s*(.+?)\s+\d/),b=((o==null?void 0:o[1])||"").trim(),R={코인:[`손이 떨리기 전에 내렸다.
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
${e}`]};return b&&R[b]?U(`sell_${b}`,R[b]):U("sell",[`정리할 건 정리했다.
${e}`,`가끔은 줄여야 산다.
${e}`,`현금이 필요했다. 그래서 팔았다.
${e}`,`미련은 접어두고 정리.
${e}`,`투자 포지션을 정리했다.
${e}`,`현금화의 선택.
${e}`,`자산을 정리하는 순간.
${e}`,`투자에서 벗어났다.
${e}`,`정리하고 다음 기회를 본다.
${e}`,`미련 없이 정리했다.
${e}`])}if(g.startsWith("❌")){const e=ee(g);return U("fail",[`오늘은 뜻대로 안 됐다.
${e}`,`계획은 늘 계획대로 안 된다.
${e}`,`한 번 더. 다음엔 될 거다.
${e}`,`벽에 부딪혔다.
${e}`,`실패는 또 다른 시작.
${e}`,`좌절은 잠시뿐.
${e}`,`다시 일어서야 한다.
${e}`,`실패도 경험이다.
${e}`,`다음 기회를 기다린다.
${e}`,`실패에서 배운다.
${e}`])}if(g.startsWith("📈")&&g.includes("발생")){const e=ee(g),o=($e=(q=g.match(/^📈\s*(.+?)\s*발생/))==null?void 0:q[1])==null?void 0:$e.trim(),R=(((be=(de=g.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))==null?void 0:de[1])==null?void 0:be.trim())||o||"").trim(),ue=(nt=>{const ot=String(nt||""),Z=[["빌딩","빌딩"],["상가","상가"],["아파트","아파트"],["오피스텔","오피스텔"],["빌라","빌라"],["코인","코인"],["암호","코인"],["크립토","코인"],["₿","코인"],["미국","미국주식"],["🇺🇸","미국주식"],["달러","미국주식"],["주식","국내주식"],["코스피","국내주식"],["코스닥","국내주식"],["적금","적금"],["예금","예금"],["노동","노동"],["클릭","노동"],["업무","노동"]];for(const[Re,zs]of Z)if(ot.includes(Re))return zs;return""})(`${R} ${e}`)||"시장";window.__diaryLastMarketProduct=ue,window.__diaryLastMarketName=R||e;const l={예금:[`예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.
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
${e}`]};return U(`market_${ue}`,l[ue]||l.시장)}if(g.startsWith("📉")&&g.includes("종료")){const e=window.__diaryLastMarketProduct||"시장",o=window.__diaryLastMarketName||"",b={코인:[`심장이 겨우 진정됐다. (${o||"이벤트 종료"})`,`코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.
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
${o||""}`.trim()],시장:["소란이 잠잠해졌다.","폭풍 지나가고 고요.","이제 평소대로.","시장의 파도가 잠잠해졌다.","뉴스의 소란이 끝났다.","변동성이 안정됐다.","투자의 리스크가 줄어들었다.","시장의 무게에서 벗어났다."]},ye=["빌라","오피스텔","아파트","상가","빌딩"].includes(e)?"부동산":e,ue=U(`marketEnd_${ye}`,b[ye]||b.시장);return window.__diaryLastMarketProduct=null,window.__diaryLastMarketName=null,ue}if(g.startsWith("💡")){const e=ee(g),o=window.__diaryLastMarketProduct||"",b=window.__diaryLastMarketName||"",R={코인:[`메모(코인): 멘탈 관리가 수익률이다.
${e}`,`코인 메모.
${b?`(${b})
`:""}${e}`.trim(),`코인 투자 노트: 변동성을 견뎌야 한다.
${e}`,`코인 기록: FOMO를 이겨내야 한다.
${e}`,`코인 메모: 롤러코스터의 정점에서 내려야 한다.
${e}`,`코인 투자 기록: 위험을 감수하는 선택.
${e}`],국내주식:[`메모(국장): 뉴스 한 줄에 흔들리지 말 것.
${e}`,`국장 메모.
${b?`(${b})
`:""}${e}`.trim(),`국장 투자 노트: 차트의 파도를 타야 한다.
${e}`,`국장 기록: 변동성을 견뎌야 한다.
${e}`,`국장 메모: 투자자의 심장이 시험받는다.
${e}`,`국장 투자 기록: 국장의 무게를 견뎌야 한다.
${e}`],미국주식:[`메모(미장): 시차 + 환율 = 체력.
${e}`,`미장 메모.
${b?`(${b})
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
${b?`(${b})
`:""}${e}`.trim(),`부동산 투자 노트: 집의 무게감을 견뎌야 한다.
${e}`,`부동산 기록: 시장의 파도를 타야 한다.
${e}`,`부동산 메모: 부동산 투자의 리스크.
${e}`,`부동산 투자 기록: 동네 분위기의 변화.
${e}`],노동:[`메모(노동): 버티는 사람이 이긴다.
${e}`,`노동 노트: 일의 무게감을 견뎌야 한다.
${e}`,`노동 기록: 업무의 리듬이 시장에 좌우된다.
${e}`,`노동 메모: 일의 가치가 변동한다.
${e}`,`노동 투자 기록: 업무의 스트레스를 견뎌야 한다.
${e}`]},ue=["빌라","오피스텔","아파트","상가","빌딩"].includes(o)?"부동산":o;return ue&&R[ue]?U(`memo_${ue}`,R[ue]):U("memo",[`메모.
${e}`,`적어둔다.
${e}`,`까먹기 전에 기록.
${e}`,`투자 노트에 기록.
${e}`,`기억해둘 것.
${e}`,`나중을 위해 기록.
${e}`])}if(g.startsWith("🎁")&&g.includes("해금")){const e=ee(g),o=((we=(Ie=g.match(/해금:\s*(.+)$/))==null?void 0:Ie[1])==null?void 0:we.trim())||"",R=(ue=>{const l=String(ue||"");return l.includes("예금")?"예금":l.includes("적금")?"적금":l.includes("미국주식")||l.includes("미장")||l.includes("🇺🇸")?"미국주식":l.includes("코인")||l.includes("₿")||l.includes("암호")?"코인":l.includes("주식")?"국내주식":l.includes("빌딩")?"빌딩":l.includes("상가")?"상가":l.includes("아파트")?"아파트":l.includes("오피스텔")?"오피스텔":l.includes("빌라")?"빌라":l.includes("월세")||l.includes("부동산")?"부동산":l.includes("클릭")||l.includes("노동")||l.includes("업무")||l.includes("CEO")||l.includes("커리어")?"노동":""})(`${o} ${e}`)||"기본",ye={노동:[`일을 '덜 힘들게' 만드는 방법이 생겼다.
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
${o||e}`]};return U(`upgradeUnlock_${R}`,ye[R]||ye.기본)}if(g.startsWith("✅")&&g.includes("구매!")){const e=ee(g),o=g.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/),b=((o==null?void 0:o[1])||"").trim(),R=((o==null?void 0:o[2])||"").trim(),ue=(ot=>{const Z=String(ot||"");return Z.includes("예금")?"예금":Z.includes("적금")?"적금":Z.includes("미국주식")||Z.includes("미장")||Z.includes("🇺🇸")?"미국주식":Z.includes("코인")||Z.includes("₿")||Z.includes("암호")?"코인":Z.includes("주식")?"국내주식":Z.includes("빌딩")?"빌딩":Z.includes("상가")?"상가":Z.includes("아파트")?"아파트":Z.includes("오피스텔")?"오피스텔":Z.includes("빌라")?"빌라":Z.includes("월세")||Z.includes("부동산")?"부동산":Z.includes("클릭")||Z.includes("노동")||Z.includes("업무")||Z.includes("CEO")||Z.includes("커리어")?"노동":""})(`${b} ${R} ${e}`)||"기본",l=[b,R].filter(Boolean).join(" — ")||e,nt={노동:[`일하는 방식이 바뀌었다.
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
${e}`]};return U(`upgradeBuy_${ue}`,nt[ue]||nt.기본)}if(g.startsWith("⚠️")){const e=ee(g);return U("warn",[`찜찜한 기분이 남았다.
${e}`,`뭔가 삐끗한 느낌.
${e}`,`일단 기록만 남긴다.
${e}`,`뭔가 이상한 느낌.
${e}`,`불안한 기분이 든다.
${e}`,`주의가 필요할 것 같다.
${e}`,`뭔가 잘못된 것 같다.
${e}`,`경고의 신호가 느껴진다.
${e}`])}const X=ee(g);return U("default",[X,`그냥 적어둔다.
${X}`,`오늘의 기록.
${X}`,`아무튼, ${X}`,`일단 기록.
${X}`,`메모해둔다.
${X}`,`기억해둘 것.
${X}`,`나중을 위해 기록.
${X}`,`적어두는 게 좋겠다.
${X}`,`기록에 남긴다.
${X}`])}r();const d=u(t);if(!d)return;const y=document.createElement("p"),$=d.replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`),_=($[0]??"").trim(),v=$.slice(1).map(p=>String(p).trim()).filter(Boolean),f=`<span class="diary-voice">${_}</span>`+(v.length?`
<span class="diary-info">${v.join(`
`)}</span>`:"");y.innerHTML=`<span class="diary-time">${i}</span>${f}`,Mo.prepend(y)}function bn(){return P+x+T+W+H}function rt(){return F+O+A+D+N}function Q(t){const n={deposit:()=>!0,savings:()=>P>=1,bond:()=>x>=1,usStock:()=>T>=1,crypto:()=>W>=1,villa:()=>H>=1,officetel:()=>F>=1,apartment:()=>O>=1,shop:()=>A>=1,building:()=>D>=1,tower:()=>z>=9&&N>=1};return n[t]?n[t]():!1}function Te(t){const c={deposit:{next:"savings",msg:"🔓 적금이 해금되었습니다!"},savings:{next:"bond",msg:"🔓 국내주식이 해금되었습니다!"},bond:{next:"usStock",msg:"🔓 미국주식이 해금되었습니다!"},usStock:{next:"crypto",msg:"🔓 코인이 해금되었습니다!"},crypto:{next:"villa",msg:"🔓 빌라가 해금되었습니다!"},villa:{next:"officetel",msg:"🔓 오피스텔이 해금되었습니다!"},officetel:{next:"apartment",msg:"🔓 아파트가 해금되었습니다!"},apartment:{next:"shop",msg:"🔓 상가가 해금되었습니다!"},shop:{next:"building",msg:"🔓 빌딩이 해금되었습니다!"},building:{next:"tower",msg:"🔓 서울타워가 해금되었습니다!"}}[t];if(!c||pn[c.next]||!Q(c.next))return;const s={savings:x,bond:T,usStock:W,crypto:H,villa:F,officetel:O,apartment:A,shop:D,building:N,tower:ke};if(s[c.next]!==void 0&&s[c.next]>0){pn[c.next]=!0;return}pn[c.next]=!0,L(c.msg);const a=c.next+"Item",i=document.getElementById(a);i&&(i.classList.add("just-unlocked"),setTimeout(()=>i.classList.remove("just-unlocked"),1e3))}function Ft(t,n){let s=C[t]*n;const a=hn(t,"financial");return s*=a,s}function Ot(t,n){let s=I[t]*n;const a=hn(t,"property");return s*=a,s}function ft(){const t=Ft("deposit",P)+Ft("savings",x)+Ft("bond",T)+Ft("usStock",W)+Ft("crypto",H),n=Ot("villa",F)+Ot("officetel",O)+Ot("apartment",A)+Ot("shop",D)+Ot("building",N);return(t+n*Ee)*Zt}function ss(){const t=qn[Math.floor(Math.random()*qn.length)];re=t,xe=Date.now()+t.duration,L(`📈 ${t.name} 발생! ${Math.floor(t.duration/1e3)}초간 지속`),L(`💡 ${t.description}`),cs(t)}function cs(t){const n=document.createElement("div");n.style.cssText=`
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
      `;let c="";if(t.effects.financial){const a=Object.entries(t.effects.financial).filter(([i,r])=>r!==1).map(([i,r])=>{const u={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인"},d=Math.round(r*10)/10;return`${u[i]} x${String(d).replace(/\.0$/,"")}`});a.length>0&&(c+=`💰 ${a.join(", ")}
`)}if(t.effects.property){const a=Object.entries(t.effects.property).filter(([i,r])=>r!==1).map(([i,r])=>{const u={villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"},d=Math.round(r*10)/10;return`${u[i]} x${String(d).replace(/\.0$/,"")}`});a.length>0&&(c+=`🏠 ${a.join(", ")}`)}const s=Math.floor((t.duration??0)/1e3);n.innerHTML=`
        <div style="font-size: 16px; margin-bottom: 6px;">📈 ${t.name}</div>
        <div style="font-size: 11px; opacity: 0.95; margin-bottom: 8px;">지속: ${s}초</div>
        <div style="font-size: 12px; opacity: 0.9;">${t.description}</div>
        ${c?`<div style="font-size: 11px; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">${c}</div>`:""}
      `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},5e3)}function as(){xe>0&&Date.now()>=xe&&(re=null,xe=0,L("📉 시장 이벤트가 종료되었습니다."))}function hn(t,n){if(!re||!re.effects)return 1;const c=re.effects[n];return!c||!c[t]?1:c[t]}function is(){Xe.forEach(t=>{!t.unlocked&&t.condition()&&(t.unlocked=!0,rs(t),L(`🏆 업적 달성: ${t.name} - ${t.desc}`))})}function rs(t){const n=document.createElement("div");n.style.cssText=`
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
      `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},3e3)}function Zn(){let t=0;for(const[n,c]of Object.entries(Y))if(!(c.purchased||c.unlocked))try{c.unlockCondition()&&(c.unlocked=!0,t++,L(`🎁 새 업그레이드 해금: ${c.name}`))}catch(s){console.error(`업그레이드 해금 조건 체크 실패 (${n}):`,s)}t>0&&gt()}function ls(){document.querySelectorAll(".upgrade-item").forEach(n=>{const c=n.dataset.upgradeId,s=Y[c];s&&!s.purchased&&(k>=s.cost?n.classList.add("affordable"):n.classList.remove("affordable"))})}function ds(){document.querySelectorAll(".upgrade-progress").forEach(n=>{const c=n.closest(".upgrade-item");!c||!c.dataset.upgradeId||(Object.entries(Y).filter(([a,i])=>i.category==="labor"&&!i.unlocked&&!i.purchased).map(([a,i])=>{var y;const r=i.unlockCondition.toString(),u=r.match(/totalClicks\s*>=\s*(\d+)/);if(u)return{id:a,requiredClicks:parseInt(u[1]),upgrade:i};const d=r.match(/careerLevel\s*>=\s*(\d+)/);return d?{id:a,requiredClicks:((y=vt[parseInt(d[1])])==null?void 0:y.requiredClicks)||1/0,upgrade:i}:null}).filter(a=>a!==null).sort((a,i)=>a.requiredClicks-i.requiredClicks),n.textContent="")})}function gt(){const t=document.getElementById("upgradeList"),n=document.getElementById("upgradeCount");if(!t||!n)return;const c=Object.entries(Y).filter(([s,a])=>a.unlocked&&!a.purchased);if(n.textContent=`(${c.length})`,c.length===0){t.innerHTML="";return}t.innerHTML="",console.log(`🔄 Regenerating upgrade list with ${c.length} items`),c.forEach(([s,a])=>{const i=document.createElement("div");i.className="upgrade-item",i.dataset.upgradeId=s,k>=a.cost&&i.classList.add("affordable");const r=document.createElement("div");r.className="upgrade-icon",r.textContent=a.icon;const u=document.createElement("div");u.className="upgrade-info";const d=document.createElement("div");d.className="upgrade-name",d.textContent=a.name;const y=document.createElement("div");y.className="upgrade-desc",y.textContent=a.desc;const h=me(a.cost);if(a.category==="labor"&&a.unlockCondition)try{const _=document.createElement("div");_.className="upgrade-progress",_.style.fontSize="11px",_.style.color="var(--muted)",_.style.marginTop="4px";const v=Object.entries(Y).filter(([f,p])=>p.category==="labor"&&!p.unlocked&&!p.purchased).map(([f,p])=>{const w=p.unlockCondition.toString().match(/totalClicks\s*>=\s*(\d+)/);return w?{id:f,requiredClicks:parseInt(w[1]),upgrade:p}:null}).filter(f=>f!==null).sort((f,p)=>f.requiredClicks-p.requiredClicks)}catch{}u.appendChild(d),u.appendChild(y);const $=document.createElement("div");$.className="upgrade-status",$.textContent=h,$.style.animation="none",$.style.background="rgba(94, 234, 212, 0.12)",$.style.color="var(--accent)",$.style.border="1px solid rgba(94, 234, 212, 0.25)",$.style.borderRadius="999px",i.appendChild(r),i.appendChild(u),i.appendChild($),i.addEventListener("click",_=>{_.stopPropagation(),console.log("🖱️ Upgrade item clicked!",s),console.log("Event target:",_.target),console.log("Current item:",i),console.log("Dataset:",i.dataset),us(s)},!1),i.addEventListener("mousedown",_=>{console.log("🖱️ Mousedown detected on upgrade:",s)}),t.appendChild(i),console.log(`✅ Upgrade item created and appended: ${s}`,i)})}function us(t){console.log("=== PURCHASE UPGRADE DEBUG ==="),console.log("Attempting to purchase:",t),console.log("Current cash:",k);const n=Y[t];if(!n){console.error("업그레이드를 찾을 수 없습니다:",t),console.log("Available upgrade IDs:",Object.keys(Y));return}if(console.log("Upgrade found:",{name:n.name,cost:n.cost,unlocked:n.unlocked,purchased:n.purchased}),n.purchased){L("❌ 이미 구매한 업그레이드입니다."),console.log("Already purchased");return}if(k<n.cost){L(`💸 자금이 부족합니다. (필요: ${me(n.cost)})`),console.log("Not enough cash. Need:",n.cost,"Have:",k);return}console.log("Purchase successful! Applying effect..."),k-=n.cost,n.purchased=!0;try{n.effect(),L(`✅ ${n.name} 구매! ${n.desc}`),console.log("Effect applied successfully")}catch(c){console.error(`업그레이드 효과 적용 실패 (${t}):`,c),L(`⚠️ ${n.name} 구매했지만 효과 적용 중 오류 발생`)}console.log("New cash:",k),console.log("=============================="),gt(),le(),Ut()}function Dt(){const t=Nt();return Math.floor(1e4*t.multiplier*pe)}function Nt(){return vt[z]}function vn(){return z<vt.length-1?vt[z+1]:null}function eo(){const t=vn();if(t&&ie>=t.requiredClicks){z+=1;const n=Nt(),c=Dt();L(`🎉 ${n.name}으로 승진했습니다! (클릭당 ${M(c)}원)`),ve&&(ve.style.transition="opacity 0.3s ease-out",ve.style.opacity="0.5",setTimeout(()=>{n.bgImage?(ve.style.transition="background-image 0.8s ease-in-out, opacity 0.5s ease-in",ve.style.backgroundImage=`url('${n.bgImage}')`):(ve.style.transition="background-image 0.8s ease-in-out, opacity 0.5s ease-in",ve.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),ve.style.opacity="1"},300));const s=document.querySelector(".career-card");s&&(s.style.animation="none",setTimeout(()=>{s.style.animation="careerPromotion 0.6s ease-out"},10));const a=document.getElementById("currentCareer");return a&&a.setAttribute("aria-label",`${n.name}으로 승진했습니다. 클릭당 ${M(c)}원`),console.log("=== PROMOTION DEBUG ==="),console.log("Promoted to:",n.name),console.log("New career level:",z),console.log("New multiplier:",n.multiplier),console.log("Click income:",M(c)),console.log("======================"),!0}return!1}function ms(){const t=te,n=ge==="buy",c=n&&k>=j("deposit",P,t),s=n&&k>=j("savings",x,t),a=n&&k>=j("bond",T,t),i=n&&k>=j("usStock",W,t),r=n&&k>=j("crypto",H,t);Ct.classList.toggle("affordable",c),Ct.classList.toggle("unaffordable",n&&!c),It.classList.toggle("affordable",s),It.classList.toggle("unaffordable",n&&!s),Lt.classList.toggle("affordable",a),Lt.classList.toggle("unaffordable",n&&!a),Et.classList.toggle("affordable",i),Et.classList.toggle("unaffordable",n&&!i),St.classList.toggle("affordable",r),St.classList.toggle("unaffordable",n&&!r);const u=n&&k>=V("villa",F,t),d=n&&k>=V("officetel",O,t),y=n&&k>=V("apartment",A,t),h=n&&k>=V("shop",D,t),$=n&&k>=V("building",N,t);if(xt.classList.toggle("affordable",u),xt.classList.toggle("unaffordable",n&&!u),Tt.classList.toggle("affordable",d),Tt.classList.toggle("unaffordable",n&&!d),Mt.classList.toggle("affordable",y),Mt.classList.toggle("unaffordable",n&&!y),Pt.classList.toggle("affordable",h),Pt.classList.toggle("unaffordable",n&&!h),Rt.classList.toggle("affordable",$),Rt.classList.toggle("unaffordable",n&&!$),ut){const _=st.tower,v=n&&k>=_&&Q("tower");ut.classList.toggle("affordable",v),ut.classList.toggle("unaffordable",n&&(!v||!Q("tower"))),ut.disabled=ge==="sell"||!Q("tower")}}function fs(){const t=te,n=ge==="buy",c=document.getElementById("depositItem"),s=document.getElementById("savingsItem"),a=document.getElementById("bondItem"),i=document.getElementById("usStockItem"),r=document.getElementById("cryptoItem");c.classList.toggle("affordable",n&&k>=j("deposit",P,t)),s.classList.toggle("affordable",n&&k>=j("savings",x,t)),a.classList.toggle("affordable",n&&k>=j("bond",T,t)),i.classList.toggle("affordable",n&&k>=j("usStock",W,t)),r.classList.toggle("affordable",n&&k>=j("crypto",H,t));const u=document.getElementById("villaItem"),d=document.getElementById("officetelItem"),y=document.getElementById("aptItem"),h=document.getElementById("shopItem"),$=document.getElementById("buildingItem");u.classList.toggle("affordable",n&&k>=V("villa",F,t)),d.classList.toggle("affordable",n&&k>=V("officetel",O,t)),y.classList.toggle("affordable",n&&k>=V("apartment",A,t)),h.classList.toggle("affordable",n&&k>=V("shop",D,t)),$.classList.toggle("affordable",n&&k>=V("building",N,t));const _=document.getElementById("towerItem");if(_){const v=st.tower,f=n&&k>=v&&Q("tower");_.classList.toggle("affordable",f),_.classList.toggle("unaffordable",n&&(!f||!Q("tower")))}}function Ut(){const t={cash:k,totalClicks:ie,totalLaborIncome:je,careerLevel:z,clickMultiplier:pe,rentMultiplier:Ee,autoClickEnabled:Xt,managerLevel:yn,rentCost:Nn,mgrCost:Un,deposits:P,savings:x,bonds:T,usStocks:W,cryptos:H,depositsLifetime:Fe,savingsLifetime:Oe,bondsLifetime:De,usStocksLifetime:Ne,cryptosLifetime:Ue,villas:F,officetels:O,apartments:A,shops:D,buildings:N,towers:ke,villasLifetime:qe,officetelsLifetime:Ke,apartmentsLifetime:Ve,shopsLifetime:He,buildingsLifetime:Ge,upgradesV2:Object.fromEntries(Object.entries(Y).map(([n,c])=>[n,{unlocked:c.unlocked,purchased:c.purchased}])),marketMultiplier:Zt,marketEventEndTime:xe,achievements:Xe,saveTime:new Date().toISOString(),ts:Date.now(),gameStartTime:Qe,totalPlayTime:Be,sessionStartTime:_e,nickname:ne};Rn&&(console.log("💾 저장 데이터에 포함된 닉네임:",ne||"(없음)"),console.log("💾 saveData.nickname:",t.nickname));try{if(localStorage.setItem(Le,JSON.stringify(t)),Qt=new Date,console.log("게임 저장 완료:",Qt.toLocaleTimeString()),bs(),rn){const n=Number((t==null?void 0:t.ts)||0)||0;n&&n>Sn&&(Kt=t,Rn&&console.log("☁️ 클라우드 저장 대기 중인 데이터에 닉네임 포함:",Kt.nickname||"(없음)"))}ne&&(!window.__lastLeaderboardUpdate||Date.now()-window.__lastLeaderboardUpdate>3e4)&&(Ks(),window.__lastLeaderboardUpdate=Date.now())}catch(n){console.error("게임 저장 실패:",n)}}function gs(){try{const t=localStorage.getItem(Le);return t&&JSON.parse(t).nickname||""}catch(t){return console.error("닉네임 확인 실패:",t),""}}function pt(){if(dt){console.log("⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨");return}const t=gs();if(t){ne=t,console.log("✅ 닉네임 확인됨:",t);return}console.log("📝 닉네임 없음: 모달 오픈"),dt=!0;try{sessionStorage.setItem(Yt,"1")}catch(n){console.warn("sessionStorage set 실패:",n)}setTimeout(()=>{Is("닉네임 설정",`리더보드에 표시될 닉네임을 입력하세요.
(1~5자, 공백/%, _ 불가)`,async c=>{const s=An(c);if(s.toLowerCase(),s.length<1||s.length>5){fe("닉네임 길이 오류","닉네임은 1~5자여야 합니다.","⚠️"),dt=!1,pt();return}if(/\s/.test(s)){fe("닉네임 형식 오류","닉네임에는 공백을 포함할 수 없습니다.","⚠️"),dt=!1,pt();return}if(/[%_]/.test(s)){fe("닉네임 형식 오류","닉네임에는 %, _ 문자를 사용할 수 없습니다.","⚠️"),dt=!1,pt();return}const{taken:a}=await Xs(s);if(a){fe("닉네임 중복",`이미 사용 중인 닉네임입니다.
다른 닉네임을 입력해주세요.`,"⚠️"),dt=!1,pt();return}try{sessionStorage.removeItem(Yt)}catch(i){console.warn("sessionStorage remove 실패:",i)}ne=s,Ut(),L(`닉네임이 "${ne}"으로 설정되었습니다.`)},{icon:"✏️",primaryLabel:"확인",placeholder:"1~5자 닉네임",maxLength:5,defaultValue:"",required:!0})},500)}function ps(){try{const t=localStorage.getItem(Le);if(!t)return console.log("저장된 게임 데이터가 없습니다."),Be=0,_e=Date.now(),!1;const n=JSON.parse(t);if(k=n.cash||0,ie=n.totalClicks||0,je=n.totalLaborIncome||0,z=n.careerLevel||0,pe=n.clickMultiplier||1,Ee=n.rentMultiplier||1,Xt=n.autoClickEnabled||!1,yn=n.managerLevel||0,Nn=n.rentCost||1e9,Un=n.mgrCost||5e9,P=n.deposits||0,x=n.savings||0,T=n.bonds||0,W=n.usStocks||0,H=n.cryptos||0,Fe=n.depositsLifetime||0,Oe=n.savingsLifetime||0,De=n.bondsLifetime||0,Ne=n.usStocksLifetime||0,Ue=n.cryptosLifetime||0,F=n.villas||0,O=n.officetels||0,A=n.apartments||0,D=n.shops||0,N=n.buildings||0,ke=n.towers||0,qe=n.villasLifetime||0,Ke=n.officetelsLifetime||0,Ve=n.apartmentsLifetime||0,He=n.shopsLifetime||0,Ge=n.buildingsLifetime||0,n.upgradesV2)for(const[c,s]of Object.entries(n.upgradesV2))Y[c]&&(Y[c].unlocked=s.unlocked,Y[c].purchased=s.purchased);if(wo(),Zt=n.marketMultiplier||1,xe=n.marketEventEndTime||0,n.achievements&&Xe.forEach((c,s)=>{n.achievements[s]&&(c.unlocked=n.achievements[s].unlocked)}),n.gameStartTime&&(Qe=n.gameStartTime),n.totalPlayTime!==void 0&&(Be=n.totalPlayTime,console.log("🕐 이전 누적 플레이시간 복원:",Be,"ms")),ne=n.nickname||"",n.sessionStartTime){const c=Date.now()-n.sessionStartTime;Be+=c,console.log("🕐 이전 세션 플레이시간 누적:",c,"ms")}return _e=Date.now(),console.log("🕐 새 세션 시작:",new Date(_e).toLocaleString()),console.log("🕐 총 누적 플레이시간:",Be,"ms"),console.log("게임 불러오기 완료:",n.saveTime?new Date(n.saveTime).toLocaleString():"시간 정보 없음"),!0}catch(t){return console.error("게임 불러오기 실패:",t),!1}}function on(){console.log("🔄 resetGame function called"),qt("게임 새로 시작",`게임을 새로 시작하시겠습니까?

⚠️ 모든 진행 상황이 삭제되며 복구할 수 없습니다.`,()=>{try{L("🔄 게임을 초기화합니다..."),console.log("✅ User confirmed reset"),localStorage.removeItem(Le),console.log("✅ LocalStorage cleared");try{sessionStorage.setItem(gn,"1"),sessionStorage.setItem(Yt,"1")}catch(n){console.warn("sessionStorage set 실패:",n)}console.log("✅ Reloading page..."),location.reload()}catch(n){console.error("❌ Error in resetGame:",n),fe("오류",`게임 초기화 중 오류가 발생했습니다.
페이지를 새로고침해주세요.`,"⚠️")}},{icon:"🔄",primaryLabel:"새로 시작",secondaryLabel:"취소"})}function Me(t){t.classList.remove("purchase-success"),t.offsetHeight,t.classList.add("purchase-success"),setTimeout(()=>{t.classList.remove("purchase-success")},600)}function Cn(){try{Ys(Dn,he)}catch(t){console.error("설정 저장 실패:",t)}}function ys(){try{const t=Qs(Dn,null);t&&(he={...he,...t})}catch(t){console.error("설정 불러오기 실패:",t)}}function $s(){try{const t=localStorage.getItem(Le);if(!t){alert("저장된 게임 데이터가 없습니다.");return}const n=new Blob([t],{type:"application/json"}),c=URL.createObjectURL(n),s=document.createElement("a");s.href=c,s.download=`capital-clicker-save-${Date.now()}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(c),L("✅ 저장 파일이 다운로드되었습니다.")}catch(t){console.error("저장 내보내기 실패:",t),alert("저장 내보내기 중 오류가 발생했습니다.")}}function ks(t){try{const n=new FileReader;n.onload=c=>{try{const s=JSON.parse(c.target.result);localStorage.setItem(Le,JSON.stringify(s)),L("✅ 저장 파일을 불러왔습니다. 페이지를 새로고침합니다..."),setTimeout(()=>{location.reload()},1e3)}catch(s){console.error("저장 파일 파싱 실패:",s),alert("저장 파일 형식이 올바르지 않습니다.")}},n.readAsText(t)}catch(n){console.error("저장 가져오기 실패:",n),alert("저장 가져오기 중 오류가 발생했습니다.")}}function bs(){if(Wn){const n=Qt.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});Wn.textContent=`저장됨 · ${n}`}const t=document.getElementById("lastSaveTimeSettings");if(t){const n=Qt.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});t.textContent=n}}function le(){try{const q=document.getElementById("playerNicknameLabel"),$e=document.getElementById("nicknameInfoItem");q&&(q.textContent=ne||"-"),$e&&($e.style.display=ne?"flex":"none"),(typeof ie!="number"||ie<0)&&(console.warn("Invalid totalClicks value:",ie,"resetting to 0"),ie=0);const de=Nt(),be=vn();if(!de){console.error("getCurrentCareer() returned null/undefined");return}if(m(os,de.name),m(Po,M(Dt())),ve&&de.bgImage?ve.style.backgroundImage=`url('${de.bgImage}')`:ve&&!de.bgImage&&(ve.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),be){const Ie=Math.min(ie/be.requiredClicks*100,100),we=Math.max(0,be.requiredClicks-ie);mt&&(mt.style.width=Ie+"%",mt.setAttribute("aria-valuenow",Math.round(Ie))),m(Xn,`${Math.round(Ie)}% (${ie}/${be.requiredClicks})`),At&&(we>0?m(At,`다음 승진까지 ${we.toLocaleString("ko-KR")}클릭 남음`):m(At,"승진 가능!")),console.log("=== CAREER PROGRESS DEBUG ==="),console.log("totalClicks:",ie),console.log("nextCareer.requiredClicks:",be.requiredClicks),console.log("progress:",Ie),console.log("currentCareer:",de.name),console.log("nextCareer:",be.name),console.log("=============================")}else mt&&(mt.style.width="100%",mt.setAttribute("aria-valuenow",100)),m(Xn,"100% (완료)"),At&&m(At,"최고 직급 달성")}catch(q){console.error("Career UI update failed:",q),console.error("Error details:",{totalClicks:ie,careerLevel:z,currentCareer:Nt(),nextCareer:vn()})}{const q=document.getElementById("diaryHeaderMeta");if(q){const $e=b=>String(b).padStart(2,"0"),de=new Date,be=de.getFullYear(),Ie=$e(de.getMonth()+1),we=$e(de.getDate()),e=typeof Qe<"u"&&Qe?Qe:_e,o=Math.max(1,Math.floor((Date.now()-e)/864e5)+1);q.textContent=`${be}.${Ie}.${we}(${o}일차)`}}m(Bo,K(k));const t=bn();m(_o,M(t));const n=document.getElementById("financialChip");if(n){const q=`예금: ${P}개
적금: ${x}개
국내주식: ${T}개
미국주식: ${W}개
코인: ${H}개`;n.setAttribute("title",q)}const c=rt();m(xo,M(c));const s=document.getElementById("propertyChip");if(s){const q=`빌라: ${F}채
오피스텔: ${O}채
아파트: ${A}채
상가: ${D}채
빌딩: ${N}채`;s.setAttribute("title",q)}const a=document.getElementById("towerBadge"),i=document.getElementById("towerCountHeader");a&&i&&(ke>0?(a.style.display="flex",i.textContent=ke):a.style.display="none");const r=ft();m(To,K(r));const u=document.getElementById("rpsChip");if(u){const q=P*C.deposit+x*C.savings+T*C.bond,$e=(F*I.villa+O*I.officetel+A*I.apartment+D*I.shop+N*I.building)*Ee,de=`금융 수익: ${M(q)}₩/s
부동산 수익: ${M($e)}₩/s
시장배수: x${Zt}`;u.setAttribute("title",de)}hs(),m(Ro,pe.toFixed(1)),m(Ao,Ee.toFixed(1)),console.log("=== GAME STATE DEBUG ==="),console.log("Cash:",k),console.log("Total clicks:",ie),console.log("Career level:",z),console.log("Financial products:",{deposits:P,savings:x,bonds:T,total:bn()}),console.log("Properties:",{villas:F,officetels:O,apartments:A,shops:D,buildings:N,total:rt()}),console.log("========================");try{(typeof P!="number"||P<0)&&(console.warn("Invalid deposits value:",P,"resetting to 0"),P=0),(typeof x!="number"||x<0)&&(console.warn("Invalid savings value:",x,"resetting to 0"),x=0),(typeof T!="number"||T<0)&&(console.warn("Invalid bonds value:",T,"resetting to 0"),T=0);const q=ft(),$e=ge==="buy"?j("deposit",P,te):ct("deposit",P,te),de=P*C.deposit,be=q>0?(de/q*100).toFixed(1):0;Hn.textContent=P,Fo.textContent=Math.floor(C.deposit).toLocaleString("ko-KR")+"원",document.getElementById("depositTotalIncome").textContent=Math.floor(de).toLocaleString("ko-KR")+"원",document.getElementById("depositPercent").textContent=be+"%",document.getElementById("depositLifetime").textContent=se(Fe),No.textContent=me($e);const Ie=ge==="buy"?j("savings",x,te):ct("savings",x,te),we=x*C.savings,e=q>0?(we/q*100).toFixed(1):0;Gn.textContent=x,Oo.textContent=Math.floor(C.savings).toLocaleString("ko-KR")+"원",document.getElementById("savingsTotalIncome").textContent=Math.floor(we).toLocaleString("ko-KR")+"원",document.getElementById("savingsPercent").textContent=e+"%",document.getElementById("savingsLifetimeDisplay").textContent=se(Oe),Uo.textContent=me(Ie);const o=ge==="buy"?j("bond",T,te):ct("bond",T,te),b=T*C.bond,R=q>0?(b/q*100).toFixed(1):0;jn.textContent=T,Do.textContent=Math.floor(C.bond).toLocaleString("ko-KR")+"원",document.getElementById("bondTotalIncome").textContent=Math.floor(b).toLocaleString("ko-KR")+"원",document.getElementById("bondPercent").textContent=R+"%",document.getElementById("bondLifetimeDisplay").textContent=se(De),qo.textContent=me(o);const ye=ge==="buy"?j("usStock",W,te):ct("usStock",W,te),ue=W*C.usStock,l=q>0?(ue/q*100).toFixed(1):0;document.getElementById("usStockCount").textContent=W,document.getElementById("incomePerUsStock").textContent=Math.floor(C.usStock).toLocaleString("ko-KR")+"원",document.getElementById("usStockTotalIncome").textContent=Math.floor(ue).toLocaleString("ko-KR")+"원",document.getElementById("usStockPercent").textContent=l+"%",document.getElementById("usStockLifetimeDisplay").textContent=se(Ne),document.getElementById("usStockCurrentPrice").textContent=me(ye);const nt=ge==="buy"?j("crypto",H,te):ct("crypto",H,te),ot=H*C.crypto,Z=q>0?(ot/q*100).toFixed(1):0;document.getElementById("cryptoCount").textContent=H,document.getElementById("incomePerCrypto").textContent=Math.floor(C.crypto).toLocaleString("ko-KR")+"원",document.getElementById("cryptoTotalIncome").textContent=Math.floor(ot).toLocaleString("ko-KR")+"원",document.getElementById("cryptoPercent").textContent=Z+"%",document.getElementById("cryptoLifetimeDisplay").textContent=se(Ue),document.getElementById("cryptoCurrentPrice").textContent=me(nt),console.log("=== FINANCIAL PRODUCTS DEBUG ==="),console.log("Financial counts:",{deposits:P,savings:x,bonds:T,usStocks:W,cryptos:H}),console.log("Total financial products:",bn()),console.log("Financial elements:",{depositCount:Hn,savingsCount:Gn,bondCount:jn}),console.log("================================")}catch(q){console.error("Financial products UI update failed:",q),console.error("Error details:",{deposits:P,savings:x,bonds:T})}const d=ft(),y=ge==="buy"?V("villa",F,te):at("villa",F,te),h=F*I.villa,$=d>0?(h/d*100).toFixed(1):0;Wo.textContent=F,zo.textContent=Math.floor(I.villa).toLocaleString("ko-KR")+"원",document.getElementById("villaTotalIncome").textContent=Math.floor(h).toLocaleString("ko-KR")+"원",document.getElementById("villaPercent").textContent=$+"%",document.getElementById("villaLifetimeDisplay").textContent=se(qe),Ko.textContent=ae(y);const _=ge==="buy"?V("officetel",O,te):at("officetel",O,te),v=O*I.officetel,f=d>0?(v/d*100).toFixed(1):0;Jo.textContent=O,Yo.textContent=Math.floor(I.officetel).toLocaleString("ko-KR")+"원",document.getElementById("officetelTotalIncome").textContent=Math.floor(v).toLocaleString("ko-KR")+"원",document.getElementById("officetelPercent").textContent=f+"%",document.getElementById("officetelLifetimeDisplay").textContent=se(Ke),Vo.textContent=ae(_);const p=ge==="buy"?V("apartment",A,te):at("apartment",A,te),g=A*I.apartment,w=d>0?(g/d*100).toFixed(1):0;Qo.textContent=A,Xo.textContent=Math.floor(I.apartment).toLocaleString("ko-KR")+"원",document.getElementById("aptTotalIncome").textContent=Math.floor(g).toLocaleString("ko-KR")+"원",document.getElementById("aptPercent").textContent=w+"%",document.getElementById("aptLifetimeDisplay").textContent=se(Ve),Ho.textContent=ae(p);const S=ge==="buy"?V("shop",D,te):at("shop",D,te),U=D*I.shop,ee=d>0?(U/d*100).toFixed(1):0;Zo.textContent=D,es.textContent=Math.floor(I.shop).toLocaleString("ko-KR")+"원",document.getElementById("shopTotalIncome").textContent=Math.floor(U).toLocaleString("ko-KR")+"원",document.getElementById("shopPercent").textContent=ee+"%",document.getElementById("shopLifetimeDisplay").textContent=se(He),Go.textContent=ae(S);const X=ge==="buy"?V("building",N,te):at("building",N,te),ce=N*I.building,tt=d>0?(ce/d*100).toFixed(1):0;if(ts.textContent=N,ns.textContent=Math.floor(I.building).toLocaleString("ko-KR")+"원",document.getElementById("buildingTotalIncome").textContent=Math.floor(ce).toLocaleString("ko-KR")+"원",document.getElementById("buildingPercent").textContent=tt+"%",document.getElementById("buildingLifetimeDisplay").textContent=se(Ge),jo.textContent=ae(X),Jn&&(Jn.textContent=ke),Yn&&(Yn.textContent=ke),Qn){const q=st.tower;Qn.textContent=ae(q)}console.log("Property counts:",{villas:F,officetels:O,apartments:A,shops:D,buildings:N}),yt(),ms(),fs(),ls(),vs(),Ds()}let In=null;function hs(){var t,n;try{const c=Date.now(),s=!!(re&&xe>c),a=s?Math.max(0,Math.ceil((xe-c)/1e3)):0,i=document.getElementById("marketEventBar");if(i)if(!s)i.classList.remove("is-visible"),i.textContent="";else{i.classList.add("is-visible");const r=re!=null&&re.name?String(re.name):"시장 이벤트",u=Math.floor((xe-c)/1e3),d=u>=0?`${u}초`:"0초",y=(g,w)=>g?Object.entries(g).filter(([,S])=>S!==1).slice(0,5).map(([S,U])=>`${w[S]??S} x${(Math.round(U*10)/10).toString().replace(/\.0$/,"")}`):[],h={deposit:"예금",savings:"적금",bond:"국내주식",usStock:"미국주식",crypto:"코인"},$={villa:"빌라",officetel:"오피스텔",apartment:"아파트",shop:"상가",building:"빌딩"},_=y((t=re==null?void 0:re.effects)==null?void 0:t.financial,h),v=y((n=re==null?void 0:re.effects)==null?void 0:n.property,$),f=[..._,...v].slice(0,5),p=f.length?` · ${f.join(", ")}`:"";i.innerHTML=`📈 <b>${r}</b> · 남은 <span class="good">${d}</span>${p}`}In||(In=[{rowId:"depositItem",category:"financial",type:"deposit"},{rowId:"savingsItem",category:"financial",type:"savings"},{rowId:"bondItem",category:"financial",type:"bond"},{rowId:"usStockItem",category:"financial",type:"usStock"},{rowId:"cryptoItem",category:"financial",type:"crypto"},{rowId:"villaItem",category:"property",type:"villa"},{rowId:"officetelItem",category:"property",type:"officetel"},{rowId:"aptItem",category:"property",type:"apartment"},{rowId:"shopItem",category:"property",type:"shop"},{rowId:"buildingItem",category:"property",type:"building"}].map(u=>{const d=document.getElementById(u.rowId);if(!d)return null;const y=d.querySelector("button.btn");if(!y)return null;let h=d.querySelector(".event-mult-badge");return h||(h=document.createElement("span"),h.className="event-mult-badge",h.setAttribute("aria-hidden","true"),d.insertBefore(h,y)),{...u,row:d,badge:h}}).filter(Boolean));for(const r of In){const u=s?hn(r.type,r.category):1,d=Math.abs(u-1)<1e-9;if(r.row.classList.remove("event-bull","event-bear"),r.badge.classList.remove("is-visible","is-bull","is-bear"),r.badge.removeAttribute("title"),!s||d){r.badge.textContent="";continue}const h=`x${(Math.round(u*10)/10).toFixed(1).replace(/\.0$/,"")}`;r.badge.textContent=h,r.badge.classList.add("is-visible"),u>1?(r.row.classList.add("event-bull"),r.badge.classList.add("is-bull")):(r.row.classList.add("event-bear"),r.badge.classList.add("is-bear"));const $=re!=null&&re.name?String(re.name):"시장 이벤트";r.badge.title=`${$} · 남은 ${a}초 · ${h}`}}catch{}}setTimeout(()=>{Ps()},100);function vs(){const t={savings:"예금 1개 필요",bond:"적금 1개 필요",usStock:"국내주식 1개 필요",crypto:"미국주식 1개 필요",villa:"코인 1개 필요",officetel:"빌라 1채 필요",apartment:"오피스텔 1채 필요",shop:"아파트 1채 필요",building:"상가 1채 필요",tower:"CEO 달성 및 빌딩 1개 이상 필요"},n=document.getElementById("savingsItem"),c=document.getElementById("bondItem");if(n){const $=!Q("savings");n.classList.toggle("locked",$),$?n.setAttribute("data-unlock-hint",t.savings):n.removeAttribute("data-unlock-hint")}if(c){const $=!Q("bond");c.classList.toggle("locked",$),$?c.setAttribute("data-unlock-hint",t.bond):c.removeAttribute("data-unlock-hint")}const s=document.getElementById("usStockItem"),a=document.getElementById("cryptoItem");if(s){const $=!Q("usStock");s.classList.toggle("locked",$),$?s.setAttribute("data-unlock-hint",t.usStock):s.removeAttribute("data-unlock-hint")}if(a){const $=!Q("crypto");a.classList.toggle("locked",$),$?a.setAttribute("data-unlock-hint",t.crypto):a.removeAttribute("data-unlock-hint")}const i=document.getElementById("villaItem"),r=document.getElementById("officetelItem"),u=document.getElementById("aptItem"),d=document.getElementById("shopItem"),y=document.getElementById("buildingItem");if(i){const $=!Q("villa");i.classList.toggle("locked",$),$?i.setAttribute("data-unlock-hint",t.villa):i.removeAttribute("data-unlock-hint")}if(r){const $=!Q("officetel");r.classList.toggle("locked",$),$?r.setAttribute("data-unlock-hint",t.officetel):r.removeAttribute("data-unlock-hint")}if(u){const $=!Q("apartment");u.classList.toggle("locked",$),$?u.setAttribute("data-unlock-hint",t.apartment):u.removeAttribute("data-unlock-hint")}if(d){const $=!Q("shop");d.classList.toggle("locked",$),$?d.setAttribute("data-unlock-hint",t.shop):d.removeAttribute("data-unlock-hint")}if(y){const $=!Q("building");y.classList.toggle("locked",$),$?y.setAttribute("data-unlock-hint",t.building):y.removeAttribute("data-unlock-hint")}const h=document.getElementById("towerItem");if(h){const $=!Q("tower");h.classList.toggle("locked",$),$?h.setAttribute("data-unlock-hint",t.tower):h.removeAttribute("data-unlock-hint")}}$n.addEventListener("click",()=>{ge="buy",$n.classList.add("active"),kn.classList.remove("active"),yt()}),kn.addEventListener("click",()=>{ge="sell",kn.classList.add("active"),$n.classList.remove("active"),yt()}),en.addEventListener("click",()=>{te=1,en.classList.add("active"),tn.classList.remove("active"),nn.classList.remove("active"),yt()}),tn.addEventListener("click",()=>{te=5,tn.classList.add("active"),en.classList.remove("active"),nn.classList.remove("active"),yt()}),nn.addEventListener("click",()=>{te=10,nn.classList.add("active"),en.classList.remove("active"),tn.classList.remove("active"),yt()}),wt.addEventListener("click",()=>{const t=document.getElementById("upgradeList");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),wt.textContent="▼",wt.classList.remove("collapsed")):(t.classList.add("collapsed-section"),wt.textContent="▶",wt.classList.add("collapsed"))}),Bt.addEventListener("click",()=>{const t=document.getElementById("financialSection");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),Bt.textContent="▼",Bt.classList.remove("collapsed")):(t.classList.add("collapsed-section"),Bt.textContent="▶",Bt.classList.add("collapsed"))}),_t.addEventListener("click",()=>{const t=document.getElementById("propertySection");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),_t.textContent="▼",_t.classList.remove("collapsed")):(t.classList.add("collapsed-section"),_t.textContent="▶",_t.classList.add("collapsed"))});function yt(){const t=ge==="buy",n=te;Pe(Ct,"financial","deposit",P,t,n),Pe(It,"financial","savings",x,t,n),Pe(Lt,"financial","bond",T,t,n),Pe(Et,"financial","usStock",W,t,n),Pe(St,"financial","crypto",H,t,n),Pe(xt,"property","villa",F,t,n),Pe(Tt,"property","officetel",O,t,n),Pe(Mt,"property","apartment",A,t,n),Pe(Pt,"property","shop",D,t,n),Pe(Rt,"property","building",N,t,n)}function Pe(t,n,c,s,a,i){if(!t)return;const r=a?n==="financial"?j(c,s,i):V(c,s,i):n==="financial"?ct(c,s,i):at(c,s,i),u=a?"구입":"판매",d=i>1?` x${i}`:"";if(t.textContent=`${u}${d}`,a)t.style.background="",t.disabled=k<r;else{const y=s>=i;t.style.background=y?"var(--bad)":"var(--muted)",t.disabled=!y}}function Cs(t,n){let c=Dt();Y.performance_bonus&&Y.performance_bonus.purchased&&Math.random()<.02&&(c*=10,L("💰 성과급 지급! 10배 수익!")),he.particles&&Ss(t??0,n??0),k+=c,ie+=1,je+=c;const s=Object.entries(Y).filter(([i,r])=>r.category==="labor"&&!r.unlocked&&!r.purchased).map(([i,r])=>{var h;const u=r.unlockCondition.toString(),d=u.match(/totalClicks\s*>=\s*(\d+)/);if(d)return{id:i,requiredClicks:parseInt(d[1]),upgrade:r};const y=u.match(/careerLevel\s*>=\s*(\d+)/);return y?{id:i,requiredClicks:((h=vt[parseInt(y[1])])==null?void 0:h.requiredClicks)||1/0,upgrade:r}:null}).filter(i=>i!==null).sort((i,r)=>i.requiredClicks-r.requiredClicks);if(s.length>0){const i=s[0],r=i.requiredClicks-ie;(r===50||r===25||r===10||r===5)&&L(`🎯 다음 업그레이드 "${i.upgrade.name}"까지 ${r}클릭 남음!`)}eo()&&le(),ds(),it.classList.add("click-effect"),setTimeout(()=>it.classList.remove("click-effect"),300),ws(c),le()}it.addEventListener("click",t=>{Cs(t.clientX,t.clientY)});let Ln=null;function lt(){Ze&&(Ze.classList.add("game-modal-hidden"),Ln=null)}function fe(t,n,c="ℹ️"){if(!Ze||!We||!ze||!Se||!Ce){alert(n);return}Ze.classList.remove("game-modal-hidden");const s=We.querySelector(".icon"),a=We.querySelector(".text");s&&(s.textContent=c),a&&(a.textContent=t),ze.textContent=n,Ce.style.display="none",Se.textContent="확인",Se.onclick=()=>{lt()},Ce.onclick=()=>{lt()}}function qt(t,n,c,s={}){if(!Ze||!We||!ze||!Se||!Ce){confirm(n)&&typeof c=="function"&&c();return}Ze.classList.remove("game-modal-hidden");const a=We.querySelector(".icon"),i=We.querySelector(".text");a&&(a.textContent=s.icon||"⚠️"),i&&(i.textContent=t),ze.textContent=n,Ce.style.display="inline-flex",Se.textContent=s.primaryLabel||"예",Ce.textContent=s.secondaryLabel||"아니오",Ln=typeof c=="function"?c:null,Se.onclick=()=>{const r=Ln;lt(),r&&r()},Ce.onclick=()=>{lt(),s.onCancel&&typeof s.onCancel=="function"&&s.onCancel()}}function Is(t,n,c,s={}){if(!Ze||!We||!ze||!Se||!Ce){const d=prompt(n);d&&typeof c=="function"&&c(d.trim());return}Ze.classList.remove("game-modal-hidden");const a=We.querySelector(".icon"),i=We.querySelector(".text");a&&(a.textContent=s.icon||"✏️"),i&&(i.textContent=t);let r=ze.querySelector(".game-modal-input");r?r.value="":(r=document.createElement("input"),r.type="text",r.className="game-modal-input",ze.innerHTML="",ze.appendChild(r)),r.placeholder=s.placeholder||r.placeholder||"닉네임을 입력하세요",typeof s.maxLength=="number"?r.maxLength=s.maxLength:(!r.maxLength||r.maxLength<=0)&&(r.maxLength=20);{const d=document.createElement("div");d.textContent=n,d.style.marginBottom="10px",d.style.color="var(--muted)",ze.insertBefore(d,r)}s.secondaryLabel?(Ce.style.display="inline-flex",Ce.textContent=s.secondaryLabel):Ce.style.display="none",Se.textContent=s.primaryLabel||"확인";const u=d=>{d.key==="Enter"&&(d.preventDefault(),Se.click())};r.addEventListener("keydown",u),r.focus(),Se.onclick=()=>{const d=r.value.trim();if(!d&&s.required!==!1){r.style.borderColor="var(--bad)",setTimeout(()=>{r.style.borderColor=""},1e3);return}r.removeEventListener("keydown",u),lt(),typeof c=="function"&&c(d||s.defaultValue||"익명")},s.secondaryLabel?Ce.onclick=()=>{r.removeEventListener("keydown",u),lt(),s.onCancel&&typeof s.onCancel=="function"&&s.onCancel()}:Ce.onclick=null}async function Ls(){const t=window.location.href,n="Capital Clicker: Seoul Survival",c=`💰 부동산과 금융 투자로 부자가 되는 게임!
현재 자산: ${oe(k)}
초당 수익: ${oe(ft())}`;if(!navigator.share){L("❌ 이 기기/브라우저에서는 공유하기를 지원하지 않습니다.");return}try{await navigator.share({title:n,text:c,url:t}),L("✅ 게임이 공유되었습니다!")}catch(s){(s==null?void 0:s.name)!=="AbortError"&&(console.error("공유 실패:",s),L("❌ 공유에 실패했습니다."))}}Kn?Kn.addEventListener("click",Ls):console.error("공유 버튼을 찾을 수 없습니다.");function Es(){const t=window.location.href,n=document.title||"Capital Clicker: Seoul Survival",c=navigator.userAgent.toLowerCase(),s=/iphone|ipad|ipod|android/.test(c),a=/iphone|ipad|ipod/.test(c),i=/android/.test(c),r=navigator.platform.toUpperCase().includes("MAC");if(window.external&&typeof window.external.AddFavorite=="function")try{window.external.AddFavorite(t,n),L("⭐ 즐겨찾기에 추가되었습니다.");return}catch{}let u="",d="즐겨찾기 / 홈 화면에 추가",y="⭐";s?a?u=`iPhone/iPad에서는 Safari 하단의 공유 버튼(□↑)을 누른 뒤
"홈 화면에 추가"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.`:i?u=`Android에서는 브라우저 오른쪽 위 메뉴(⋮)에서
"홈 화면에 추가" 또는 "앱 설치"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.`:u='이 기기에서는 브라우저의 메뉴에서 "홈 화면에 추가" 기능을 사용해 주세요.':u=`${r?"⌘ + D":"Ctrl + D"} 를 눌러 이 페이지를 브라우저 즐겨찾기에 추가할 수 있습니다.`,fe(d,u,y)}Vn&&Vn.addEventListener("click",Es),zn&&zn.addEventListener("click",on);const to=document.getElementById("resetBtnSettings");to&&to.addEventListener("click",on);function Ss(t,n){const c=document.createElement("div");c.className="falling-cookie",c.textContent="💵",c.style.left=t+Math.random()*100-50+"px",c.style.top=n-100+"px",document.body.appendChild(c),setTimeout(()=>{c.parentNode&&c.parentNode.removeChild(c)},2e3)}function no(t,n){for(let c=0;c<Math.min(n,5);c++)setTimeout(()=>{const s=document.createElement("div");s.className="falling-cookie",s.textContent=t,s.style.left=Math.random()*window.innerWidth+"px",s.style.top="-100px",document.body.appendChild(s),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},2e3)},c*200)}function ws(t){const n=document.createElement("div");n.className="income-increase",n.textContent=`+${M(t)}원`;const c=it.getBoundingClientRect(),s=it.parentElement.getBoundingClientRect();n.style.position="absolute",n.style.left=c.left-s.left+Math.random()*100-50+"px",n.style.top=c.top-s.top-50+"px",n.style.zIndex="1000",n.style.pointerEvents="none",it.parentElement.style.position="relative",it.parentElement.appendChild(n),n.style.opacity="1",n.style.transform="translateY(0px) scale(1)",setTimeout(()=>{n.style.transition="all 1.5s ease-out",n.style.opacity="0",n.style.transform="translateY(-80px) scale(1.2)"},100),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},1600)}Ct.addEventListener("click",()=>{if(!Q("deposit")){L("❌ 예금은 아직 잠겨있습니다.");return}const t=G("financial","deposit",P);t.success&&(P=t.newCount,Me(Ct),Te("deposit")),le()}),It.addEventListener("click",()=>{if(!Q("savings")){L("❌ 적금은 예금을 1개 이상 보유해야 해금됩니다.");return}const t=G("financial","savings",x);t.success&&(x=t.newCount,Me(It),Te("savings")),le()}),Lt.addEventListener("click",()=>{if(!Q("bond")){L("❌ 국내주식은 적금을 1개 이상 보유해야 해금됩니다.");return}const t=G("financial","bond",T);t.success&&(T=t.newCount,Me(Lt),Te("bond")),le()}),Et.addEventListener("click",()=>{if(!Q("usStock")){L("❌ 미국주식은 국내주식을 1개 이상 보유해야 해금됩니다.");return}const t=G("financial","usStock",W);t.success&&(W=t.newCount,Me(Et),Te("usStock")),le()}),St.addEventListener("click",()=>{if(!Q("crypto")){L("❌ 코인은 미국주식을 1개 이상 보유해야 해금됩니다.");return}const t=G("financial","crypto",H);t.success&&(H=t.newCount,Me(St),Te("crypto")),le()}),xt.addEventListener("click",()=>{if(!Q("villa")){L("❌ 빌라는 코인을 1개 이상 보유해야 해금됩니다.");return}const t=G("property","villa",F);t.success&&(F=t.newCount,Me(xt),Te("villa")),le()}),Tt.addEventListener("click",()=>{if(!Q("officetel")){L("❌ 오피스텔은 빌라를 1개 이상 보유해야 해금됩니다.");return}const t=G("property","officetel",O);t.success&&(O=t.newCount,Me(Tt),Te("officetel")),le()}),Mt.addEventListener("click",()=>{if(!Q("apartment")){L("❌ 아파트는 오피스텔을 1개 이상 보유해야 해금됩니다.");return}const t=G("property","apartment",A);t.success&&(A=t.newCount,Me(Mt),Te("apartment")),le()}),Pt.addEventListener("click",()=>{if(!Q("shop")){L("❌ 상가는 아파트를 1개 이상 보유해야 해금됩니다.");return}const t=G("property","shop",D);t.success&&(D=t.newCount,Me(Pt),Te("shop")),le()}),Rt.addEventListener("click",()=>{if(!Q("building")){L("❌ 빌딩은 상가를 1개 이상 보유해야 해금됩니다.");return}const t=G("property","building",N);t.success&&(N=t.newCount,Me(Rt),Te("building")),le()}),ut&&ut.addEventListener("click",async()=>{if(!Q("tower")){L("❌ 서울타워는 CEO 달성 및 빌딩 1개 이상 보유 시 해금됩니다.");return}const t=st.tower;if(k<t){L(`💸 자금이 부족합니다. (필요: ${M(t)}원)`);return}k-=t,ke+=1;const n=k+Jt(),c=Date.now()-_e,s=Be+c;if(ne)try{await Pn(ne,n,s,ke),console.log("리더보드: 서울타워 구매 시점 자산으로 업데이트 완료")}catch(a){console.error("리더보드 업데이트 실패:",a)}L(`🗼 서울타워 완성.
서울의 정상에 도달했다.
이제야 진짜 시작인가?`),Bs(ke),he.particles&&no("🗼",1),le(),Ut()});function Bs(t){const n=`🗼 서울타워 완성 🗼

알바에서 시작해 CEO까지.
예금에서 시작해 서울타워까지.

서울 한복판에 당신의 이름이 새겨졌다.

"이제야 진짜 시작인가?"

리더보드에 기록되었습니다: 🗼x${t}`;fe("🎉 엔딩",n,"🗼"),Se.onclick,Se.onclick=()=>{lt(),qt("🔄 새 게임 시작",`서울타워를 완성했습니다!

새 게임을 시작하시겠습니까?
(현재 진행은 초기화됩니다)`,()=>{on(),L("🗼 새로운 시작. 다시 한 번.")},{icon:"🗼",primaryLabel:"새 게임 시작",secondaryLabel:"나중에"})}}document.addEventListener("keydown",t=>{t.ctrlKey&&t.shiftKey&&t.key==="R"&&(t.preventDefault(),on()),t.ctrlKey&&t.key==="s"&&(t.preventDefault(),Ut(),L("💾 수동 저장 완료!")),t.ctrlKey&&t.key==="o"&&(t.preventDefault(),$t&&$t.click())});const oo=50;setInterval(()=>{as(),is(),Zn();const t=oo/1e3;k+=ft()*t,Fe+=P*C.deposit*t,Oe+=x*C.savings*t,De+=T*C.bond*t,Ne+=W*C.usStock*t,Ue+=H*C.crypto*t,qe+=F*I.villa*t,Ke+=O*I.officetel*t,Ve+=A*I.apartment*t,He+=D*I.shop*t,Ge+=N*I.building*t,le()},oo),setInterval(()=>{Ut()},5e3),setInterval(()=>{if(Xt){const t=Dt();if(k+=t,ie+=1,je+=t,eo(),Y.performance_bonus&&Y.performance_bonus.purchased&&Math.random()<.02){const n=t*9;k+=n,je+=n}}},1e3),setInterval(()=>{xe===0&&ss()},Math.random()*18e4+12e4),ys();const so=document.getElementById("currentYear");so&&(so.textContent=new Date().getFullYear()),(async()=>ps()?(L("저장된 게임을 불러왔습니다."),pt()):(L("환영합니다! 노동으로 종잣돈을 모아 첫 부동산을 구입해보세요."),await mo()||pt()))();const En=Nt();ve&&En&&En.bgImage&&(ve.style.backgroundImage=`url('${En.bgImage}')`);const sn=document.getElementById("toggleParticles"),cn=document.getElementById("toggleFancyGraphics"),an=document.getElementById("toggleShortNumbers");sn&&(sn.checked=he.particles),cn&&(cn.checked=he.fancyGraphics),an&&(an.checked=he.shortNumbers);const co=document.getElementById("exportSaveBtn"),ao=document.getElementById("importSaveBtn"),$t=document.getElementById("importFileInput"),io=document.getElementById("cloudUploadBtn"),ro=document.getElementById("cloudDownloadBtn");co&&co.addEventListener("click",$s),ao&&ao.addEventListener("click",()=>{$t&&$t.click()}),$t&&$t.addEventListener("change",t=>{const n=t.target.files[0];n&&ks(n)});let Kt=null,Sn=0,rn=null,wn=null;function _s(){const t=document.getElementById("cloudLastSync");if(t){if(!wn){t.textContent="--:--";return}t.textContent=wn.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}}function lo(t){const n=document.getElementById("cloudSaveHint");!n||!t||(n.textContent=t)}async function uo(t="flush"){if(!rn||!Kt)return;const n=Kt;Kt=null;const c=Number((n==null?void 0:n.ts)||Date.now())||Date.now();if(c&&c<=Sn)return;const s=await ho("seoulsurvival",n);if(!s.ok){lo(`자동 동기화 실패(나중에 재시도). 이유: ${s.reason||"unknown"}`);return}Sn=c,wn=new Date,_s(),lo("자동 동기화 완료 ✅")}async function xs(){var a;if(!await Ae()){fe("로그인 필요","클라우드 세이브는 로그인 사용자만 사용할 수 있습니다.","🔐");return}const n=localStorage.getItem(Le);if(!n){fe("저장 데이터 없음","로컬 저장 데이터가 없습니다. 먼저 게임을 진행한 뒤 저장해 주세요.","💾");return}let c;try{c=JSON.parse(n)}catch{fe("오류","로컬 저장 데이터 형식이 올바르지 않습니다.","⚠️");return}const s=await ho("seoulsurvival",c);if(!s.ok){if(s.reason==="missing_table"){fe("클라우드 테이블 없음",`Supabase에 game_saves 테이블이 아직 없습니다.
Supabase SQL Editor에서 supabase/game_saves.sql을 실행해 주세요.`,"🛠️");return}fe("업로드 실패",`클라우드 저장에 실패했습니다.
${((a=s.error)==null?void 0:a.message)||""}`.trim(),"⚠️");return}L("☁️ 클라우드에 저장했습니다."),fe("완료","클라우드 저장 완료!","☁️")}async function Ts(){var a,i;if(!await Ae()){fe("로그인 필요","클라우드 세이브는 로그인 사용자만 사용할 수 있습니다.","🔐");return}const n=await Mn("seoulsurvival");if(!n.ok){if(n.reason==="missing_table"){fe("클라우드 테이블 없음",`Supabase에 game_saves 테이블이 아직 없습니다.
Supabase SQL Editor에서 supabase/game_saves.sql을 실행해 주세요.`,"🛠️");return}fe("불러오기 실패",`클라우드 불러오기에 실패했습니다.
${((a=n.error)==null?void 0:a.message)||""}`.trim(),"⚠️");return}if(!n.found){fe("클라우드 저장 없음","이 계정에 저장된 클라우드 세이브가 없습니다.","☁️");return}const s=`클라우드 세이브를 발견했습니다.

저장 시간: ${(i=n.save)!=null&&i.saveTime?new Date(n.save.saveTime).toLocaleString():n.updated_at?new Date(n.updated_at).toLocaleString():"시간 정보 없음"}

불러오면 로컬 저장이 클라우드 데이터로 덮어써지고 페이지가 새로고침됩니다.
계속할까요?`;qt("클라우드 불러오기",s,()=>{try{localStorage.setItem(Le,JSON.stringify(n.save)),L("☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다..."),setTimeout(()=>location.reload(),600)}catch(r){fe("오류",`클라우드 세이브 적용에 실패했습니다.
${String(r)}`,"⚠️")}},{icon:"☁️",primaryLabel:"불러오기",secondaryLabel:"취소"})}async function mo(){var i;try{if(sessionStorage.getItem(Yt)==="1")return!1}catch(r){console.warn("sessionStorage get 실패:",r)}try{if(sessionStorage.getItem(gn)==="1")return sessionStorage.removeItem(gn),!1}catch(r){console.warn("sessionStorage get/remove 실패:",r)}if(!!localStorage.getItem(Le)||!await Ae())return!1;const c=await Mn("seoulsurvival");if(!c.ok||!c.found)return!1;const a=`클라우드 세이브가 있습니다.

저장 시간: ${(i=c.save)!=null&&i.saveTime?new Date(c.save.saveTime).toLocaleString():c.updated_at?new Date(c.updated_at).toLocaleString():"시간 정보 없음"}

불러오시겠습니까?`;return new Promise(r=>{let u=!1;const d=y=>{u||(u=!0,r(y))};qt("클라우드 세이브 발견",a,()=>{try{localStorage.setItem(Le,JSON.stringify(c.save)),L("☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다..."),setTimeout(()=>location.reload(),600),d(!0)}catch(y){console.error("클라우드 세이브 적용 실패:",y),d(!1)}},{icon:"☁️",primaryLabel:"불러오기",secondaryLabel:"나중에",onCancel:()=>{d(!1)}})})}async function Ms(){if(!await Ae())return!1;const n=localStorage.getItem(Le);if(!n)return await mo();let c;try{c=JSON.parse(n)}catch(U){return console.error("로컬 저장 파싱 실패:",U),!1}const s=await Mn("seoulsurvival");if(!s.ok||!s.found)return!1;const a=s.save,i=go(c),r=go(a),u=po(c,_e),d=po(a,Date.now()),y=Number(c.ts||0),h=Number(s.save_ts||0);if(!(r>i||r===i&&h>y))return!1;const _=a.saveTime?new Date(a.saveTime).toLocaleString("ko-KR"):s.updated_at?new Date(s.updated_at).toLocaleString("ko-KR"):"시간 정보 없음",v=c.saveTime?new Date(c.saveTime).toLocaleString("ko-KR"):"시간 정보 없음",f=jt(u),p=jt(d),g=J(i),w=J(r),S=`다른 기기에서 더 높은 점수로 저장된 진행이 있습니다.

📊 지금 이 기기
   자산: ${g}
   플레이타임: ${f}
   저장 시간: ${v}

☁️ 다른 기기
   자산: ${w}
   플레이타임: ${p}
   저장 시간: ${_}

어떤 진행을 사용하시겠습니까?`;return new Promise(U=>{let ee=!1;const X=ce=>{ee||(ee=!0,U(ce))};qt("진행 상황 선택",S,()=>{try{localStorage.setItem(Le,JSON.stringify(a)),L("☁️ 다른 기기의 진행 상황을 불러왔습니다. 페이지를 새로고침합니다..."),setTimeout(()=>location.reload(),600),X(!0)}catch(ce){console.error("클라우드 세이브 적용 실패:",ce),fe("오류",`진행 상황 전환에 실패했습니다.
${ce.message||String(ce)}`,"⚠️"),X(!1)}},{icon:"☁️",primaryLabel:"다른 기기로 바꾸기",secondaryLabel:"지금 기기 그대로",onCancel:()=>{X(!1)}})})}io&&io.addEventListener("click",xs),ro&&ro.addEventListener("click",Ts),(async()=>{try{rn=await Ae(),Js(async t=>{rn=t,t&&!window.__saveSyncChecked?(window.__saveSyncChecked=!0,setTimeout(async()=>{try{await Ms()}catch(n){console.error("저장 동기화 확인 중 오류:",n)}},1500)):t||(window.__saveSyncChecked=!1)})}catch{}})(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&uo("visibility:hidden")}),window.addEventListener("pagehide",()=>{uo("pagehide")}),sn&&sn.addEventListener("change",t=>{he.particles=t.target.checked,Cn()}),cn&&cn.addEventListener("change",t=>{he.fancyGraphics=t.target.checked,Cn()}),an&&an.addEventListener("change",t=>{he.shortNumbers=t.target.checked,Cn(),le()}),console.log("=== 판매 시스템 초기화 완료 ==="),console.log("✅ 구매/판매 모드 토글 시스템 활성화"),console.log("✅ 금융상품 통합 거래 시스템 (예금/적금/주식)"),console.log("✅ 부동산 통합 거래 시스템 (빌라/오피스텔/아파트/상가/빌딩)"),console.log("✅ 판매 가격: 현재가의 80%"),console.log("✅ 수량 선택: 1개/10개/100개"),console.log('💡 사용법: 상단 "구매/판매" 버튼으로 모드 전환 후 거래하세요!');let fo=!1;function Ps(){if(fo)return;fo=!0;const t=document.getElementById("statsTab");t&&t.addEventListener("click",n=>{const c=n.target.closest(".stats-toggle"),s=n.target.closest(".toggle-icon");if(c||s){const a=(c||s).closest(".stats-section");a&&a.classList.contains("collapsible")&&(a.classList.toggle("collapsed"),n.preventDefault(),n.stopPropagation())}})}let Vt=[],Ht=[],ln=0,dn=Date.now();function Rs(){const t=Date.now(),n=Fe+Oe+De+Ne+Ue+qe+Ke+Ve+He+Ge+je;Vt=Vt.filter(d=>t-d.time<36e5),Ht=Ht.filter(d=>t-d.time<864e5),t-dn>=6e4&&(Vt.push({time:t,earnings:n}),Ht.push({time:t,earnings:n}),dn=t);const c=Vt.length>0?n-Vt[0].earnings:0,s=Ht.length>0?n-Ht[0].earnings:0,a=ln>0&&t-dn>0?(n-ln)/ln*(36e5/(t-dn))*100:0;let r=[1e6,1e7,1e8,1e9,1e10,1e11].find(d=>d>n)||"최고 달성";if(r!=="최고 달성"){const d=r-n;r=`${B(d)} 남음`}m(document.getElementById("hourlyEarnings"),oe(Math.max(0,c))),m(document.getElementById("dailyEarnings"),oe(Math.max(0,s)));const u=Math.abs(a)<.05?0:a;m(document.getElementById("growthRate"),`${u>=0?"+":""}${u.toFixed(1)}%/시간`),m(document.getElementById("nextMilestone"),r),ln=n}function As(){const t=document.getElementById("assetDonutChart");if(!t)return;const n=t.getContext("2d");if(!n)return;const c=200,s=Math.max(1,Math.floor((window.devicePixelRatio||1)*100)/100),a=Math.round(c*s);(t.width!==a||t.height!==a)&&(t.width=a,t.height=a,t.style.width=`${c}px`,t.style.height=`${c}px`),n.setTransform(s,0,0,s,0,0);const i=c/2,r=c/2,u=80,d=50,y=k+Jt(),h=Fs(),$=Os(),_=y>0?k/y*100:0,v=y>0?h/y*100:0,f=y>0?$/y*100:0;n.clearRect(0,0,c,c),n.beginPath(),n.arc(i,r,u,0,Math.PI*2),n.fillStyle="rgba(255, 255, 255, 0.05)",n.fill();let p=-Math.PI/2;if(_>0){const w=_/100*Math.PI*2;n.beginPath(),n.moveTo(i,r),n.arc(i,r,u,p,p+w),n.closePath();const S=n.createLinearGradient(i-u,r-u,i+u,r+u);S.addColorStop(0,"#f59e0b"),S.addColorStop(1,"#d97706"),n.fillStyle=S,n.fill(),n.lineWidth=2,n.strokeStyle="rgba(0, 0, 0, 0.25)",n.stroke(),p+=w}if(v>0){const w=v/100*Math.PI*2;n.beginPath(),n.moveTo(i,r),n.arc(i,r,u,p,p+w),n.closePath(),n.fillStyle="rgba(59, 130, 246, 0.5)",n.fill(),p+=w}if(f>0){const w=f/100*Math.PI*2;n.beginPath(),n.moveTo(i,r),n.arc(i,r,u,p,p+w),n.closePath(),n.fillStyle="rgba(16, 185, 129, 0.5)",n.fill()}n.beginPath(),n.arc(i,r,d,0,Math.PI*2);const g=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()||"#0b1220";n.fillStyle=g,n.fill()}function Fs(){let t=0;if(P>0)for(let n=0;n<P;n++)t+=j("deposit",n);if(x>0)for(let n=0;n<x;n++)t+=j("savings",n);if(T>0)for(let n=0;n<T;n++)t+=j("bond",n);if(W>0)for(let n=0;n<W;n++)t+=j("usStock",n);if(H>0)for(let n=0;n<H;n++)t+=j("crypto",n);return t}function Os(){let t=0;if(F>0)for(let n=0;n<F;n++)t+=V("villa",n);if(O>0)for(let n=0;n<O;n++)t+=V("officetel",n);if(A>0)for(let n=0;n<A;n++)t+=V("apartment",n);if(D>0)for(let n=0;n<D;n++)t+=V("shop",n);if(N>0)for(let n=0;n<N;n++)t+=V("building",n);return t}function Ds(){try{const t=k+Jt(),n=Fe+Oe+De+Ne+Ue+qe+Ke+Ve+He+Ge+je;m(document.getElementById("totalAssets"),B(t)),m(document.getElementById("totalEarnings"),B(n)),m(document.getElementById("rpsStats"),oe(ft())+"/초"),m(document.getElementById("clickIncomeStats"),oe(Dt())),m(document.getElementById("totalClicksStats"),ie.toLocaleString("ko-KR")+"회"),m(document.getElementById("laborIncomeStats"),B(je));const c=Date.now()-_e,s=Be+c,a=Math.floor(s/6e4),i=Math.floor(a/60),r=a%60,u=i>0?`${i}시간 ${r}분`:`${a}분`;console.log("🕐 플레이시간 계산:",{totalPlayTime:Be,currentSessionTime:c,totalPlayTimeMs:s,playTimeMinutes:a,playTimeText:u}),m(document.getElementById("playTimeStats"),u);const d=a>0?n/a*60:0;m(document.getElementById("hourlyRate"),oe(d)+"/시간");const y=n>0?je/n*100:0,h=Fe+Oe+De+Ne+Ue,$=n>0?h/n*100:0,_=qe+Ke+Ve+He+Ge,v=n>0?_/n*100:0,f=document.querySelector(".income-bar"),p=document.getElementById("laborSegment"),g=document.getElementById("financialSegment"),w=document.getElementById("propertySegment");if(f&&!f.classList.contains("animated")&&f.classList.add("animated"),p){p.style.width=y.toFixed(1)+"%";const Re=p.querySelector("span");Re&&(Re.textContent=y>=5?`🛠️ ${y.toFixed(1)}%`:"")}if(g){g.style.width=$.toFixed(1)+"%";const Re=g.querySelector("span");Re&&(Re.textContent=$>=5?`💰 ${$.toFixed(1)}%`:"")}if(w){w.style.width=v.toFixed(1)+"%";const Re=w.querySelector("span");Re&&(Re.textContent=v>=5?`🏢 ${v.toFixed(1)}%`:"")}m(document.getElementById("laborLegend"),`노동: ${y.toFixed(1)}%`),m(document.getElementById("financialLegend"),`금융: ${$.toFixed(1)}%`),m(document.getElementById("propertyLegend"),`부동산: ${v.toFixed(1)}%`),Rs(),As();const S=n||1;Vs(),m(document.getElementById("depositsOwnedStats"),P+"개"),m(document.getElementById("depositsLifetimeStats"),B(Fe));const U=S>0?(Fe/S*100).toFixed(1):"0.0";m(document.getElementById("depositsContribution"),`(${U}%)`);const ee=P>0?Wt("deposit",P):0;m(document.getElementById("depositsValue"),M(ee)),m(document.getElementById("savingsOwnedStats"),x+"개"),m(document.getElementById("savingsLifetimeStats"),B(Oe));const X=S>0?(Oe/S*100).toFixed(1):"0.0";m(document.getElementById("savingsContribution"),`(${X}%)`);const ce=x>0?Wt("savings",x):0;m(document.getElementById("savingsValue"),M(ce)),m(document.getElementById("bondsOwnedStats"),T+"개"),m(document.getElementById("bondsLifetimeStats"),B(De));const tt=S>0?(De/S*100).toFixed(1):"0.0";m(document.getElementById("bondsContribution"),`(${tt}%)`);const q=T>0?Wt("bond",T):0;m(document.getElementById("bondsValue"),M(q)),m(document.getElementById("usStocksOwnedStats"),W+"개"),m(document.getElementById("usStocksLifetimeStats"),B(Ne));const $e=S>0?(Ne/S*100).toFixed(1):"0.0";m(document.getElementById("usStocksContribution"),`(${$e}%)`);const de=W>0?Wt("usStock",W):0;m(document.getElementById("usStocksValue"),M(de)),m(document.getElementById("cryptosOwnedStats"),H+"개"),m(document.getElementById("cryptosLifetimeStats"),B(Ue));const be=S>0?(Ue/S*100).toFixed(1):"0.0";m(document.getElementById("cryptosContribution"),`(${be}%)`);const Ie=H>0?Wt("crypto",H):0;m(document.getElementById("cryptosValue"),M(Ie)),m(document.getElementById("villasOwnedStats"),F+"채"),m(document.getElementById("villasLifetimeStats"),oe(qe));const we=S>0?(qe/S*100).toFixed(1):"0.0";m(document.getElementById("villasContribution"),`(${we}%)`);const e=F>0?zt("villa",F):0;m(document.getElementById("villasValue"),oe(e)),m(document.getElementById("officetelsOwnedStats"),O+"채"),m(document.getElementById("officetelsLifetimeStats"),oe(Ke));const o=S>0?(Ke/S*100).toFixed(1):"0.0";m(document.getElementById("officetelsContribution"),`(${o}%)`);const b=O>0?zt("officetel",O):0;m(document.getElementById("officetelsValue"),oe(b)),m(document.getElementById("apartmentsOwnedStats"),A+"채"),m(document.getElementById("apartmentsLifetimeStats"),oe(Ve));const R=S>0?(Ve/S*100).toFixed(1):"0.0";m(document.getElementById("apartmentsContribution"),`(${R}%)`);const ye=A>0?zt("apartment",A):0;m(document.getElementById("apartmentsValue"),oe(ye)),m(document.getElementById("shopsOwnedStats"),D+"채"),m(document.getElementById("shopsLifetimeStats"),oe(He));const ue=S>0?(He/S*100).toFixed(1):"0.0";m(document.getElementById("shopsContribution"),`(${ue}%)`);const l=D>0?zt("shop",D):0;m(document.getElementById("shopsValue"),oe(l)),m(document.getElementById("buildingsOwnedStats"),N+"채"),m(document.getElementById("buildingsLifetimeStats"),oe(Ge));const nt=S>0?(Ge/S*100).toFixed(1):"0.0";m(document.getElementById("buildingsContribution"),`(${nt}%)`);const ot=N>0?zt("building",N):0;m(document.getElementById("buildingsValue"),oe(ot));const Z=Hs();m(document.getElementById("bestEfficiency"),Z[0]||"-"),m(document.getElementById("secondEfficiency"),Z[1]||"-"),m(document.getElementById("thirdEfficiency"),Z[2]||"-"),Gs()}catch(t){console.error("Stats tab update failed:",t)}}let et=!1,Je=0,Gt=null;const Ns=1e4,Us=7e3;function jt(t){if(!t||t<=0)return"—";const n=Math.floor(t/1e3/60);if(n<=0)return"1분 미만";const c=Math.floor(n/60),s=n%60;return c>0?s?`${c}시간 ${s}분`:`${c}시간`:`${s}분`}function qs(t){if(!t||t<=0)return"—";const n=Math.floor(t/1e3/60);if(n<=0)return"<1m";const c=Math.floor(n/60),s=n%60;return c>=100?`${c}h`:c>0?`${c}h ${String(s).padStart(2,"0")}m`:`${s}m`}async function kt(t=!1){const n=document.getElementById("leaderboardContainer");if(!n)return;if(!Tn()){n.innerHTML=`
          <div class="leaderboard-error">
            <div>리더보드 설정이 아직 완료되지 않았어요. 나중에 다시 확인해 주세요.</div>
          </div>
        `,et=!1,Je=Date.now();return}if(et&&!t){console.log("리더보드: 이미 로딩 중, 스킵");return}const c=Date.now();if(!t&&Je>0&&c-Je<Ns){console.log("리더보드: 최근 업데이트로부터 시간이 짧음, 스킵");return}Gt&&(clearTimeout(Gt),Gt=null),Gt=setTimeout(async()=>{et=!0,Gt=null;const s=setTimeout(()=>{if(et){console.error("리더보드: 타임아웃 발생"),n.innerHTML=`
              <div class="leaderboard-error">
                <div>리더보드 불러오기 실패 (타임아웃)</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;const a=n.querySelector(".leaderboard-retry-btn");a&&a.addEventListener("click",()=>{kt(!0)}),et=!1,Je=Date.now()}},Us);try{n.innerHTML='<div class="leaderboard-loading">리더보드를 불러오는 중...</div>',console.log("리더보드: API 호출 시작");const a=await Zs(10,"assets");if(clearTimeout(s),console.log("리더보드: API 응답 받음",a),!a.success){const v=a.error||"알 수 없는 오류",f=a.status,p=a.errorType;console.error("리더보드: API 오류",{errorMsg:v,status:f,errorType:p});let g="";p==="forbidden"||f===401||f===403?g="권한이 없어 리더보드를 불러올 수 없습니다.":p==="config"?g="리더보드 설정 오류: Supabase 설정을 확인해주세요.":p==="schema"?g="리더보드 테이블이 설정되지 않았습니다. 관리자에게 문의해주세요.":p==="network"?g="네트워크 오류로 리더보드를 불러올 수 없습니다.":g=`리더보드를 불러올 수 없습니다: ${v}`,n.innerHTML=`
              <div class="leaderboard-error">
                <div>${g}</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;const w=n.querySelector(".leaderboard-retry-btn");w&&w.addEventListener("click",()=>{kt(!0)}),et=!1,Je=Date.now();return}const i=a.data||[];if(i.length===0){console.log("리더보드: 기록 없음"),n.innerHTML='<div class="leaderboard-empty">리더보드에 아직 기록이 없습니다.</div>',et=!1,Je=Date.now();const v=document.getElementById("myRankContent");v&&(v.innerHTML=`
                <div class="leaderboard-my-rank-empty">
                  리더보드 기록이 아직 없습니다.
                </div>
              `);return}console.log("리더보드: 항목 수",i.length);const r=document.createElement("table");r.className="leaderboard-table";const u=document.createElement("thead");u.innerHTML=`
            <tr>
              <th class="col-rank">#</th>
              <th class="col-nickname">닉네임</th>
              <th class="col-assets">자산</th>
              <th class="col-playtime">시간</th>
            </tr>
          `,r.appendChild(u);const d=document.createElement("tbody");let y=null;const h=(ne||"").trim().toLowerCase();i.forEach((v,f)=>{const p=document.createElement("tr"),g=document.createElement("td");g.className="col-rank",g.textContent=String(f+1);const w=document.createElement("td");w.className="col-nickname";const S=v.tower_count||0,U=S>0?`${v.nickname||"익명"} 🗼${S>1?`x${S}`:""}`:v.nickname||"익명";w.textContent=U;const ee=document.createElement("td");ee.className="col-assets",ee.textContent=J(v.total_assets||0);const X=document.createElement("td");X.className="col-playtime",X.textContent=qs(v.play_time_ms||0);const ce=(v.nickname||"").trim().toLowerCase();h&&h===ce&&(p.classList.add("is-me"),y={rank:f+1,...v}),p.appendChild(g),p.appendChild(w),p.appendChild(ee),p.appendChild(X),d.appendChild(p)}),r.appendChild(d),n.innerHTML="",n.appendChild(r),Je=Date.now(),console.log("리더보드: 업데이트 완료");const $=document.getElementById("leaderboardLastUpdated");if($){const v=new Date(Je),f=String(v.getHours()).padStart(2,"0"),p=String(v.getMinutes()).padStart(2,"0"),g=String(v.getSeconds()).padStart(2,"0");$.textContent=`마지막 갱신: ${f}:${p}:${g}`}const _=document.getElementById("myRankContent");if(_)if(!h)_.innerHTML=`
                <div class="leaderboard-my-rank-empty">
                  닉네임을 설정하면 내 순위와 기록이 여기 표시됩니다.
                </div>
              `;else if(y){const v=jt(y.play_time_ms||0),f=y.tower_count||0,p=f>0?`${y.nickname||ne||"익명"} 🗼${f>1?`x${f}`:""}`:y.nickname||ne||"익명";_.innerHTML=`
                <div class="my-rank-card">
                  <div class="my-rank-header">
                    <span class="my-rank-label">내 기록</span>
                    <span class="my-rank-rank-badge">${y.rank}위</span>
                  </div>
                  <div class="my-rank-main">
                    <div class="my-rank-name">${p}</div>
                    <div class="my-rank-assets">💰 ${J(y.total_assets||0)}</div>
                  </div>
                  <div class="my-rank-meta">
                    <span class="my-rank-playtime">⏱️ ${v}</span>
                    <span class="my-rank-note">TOP 10 내 순위</span>
                  </div>
                </div>
              `}else{console.log("[LB] 내 기록 조회 시작",{playerNickname:ne,currentNickLower:h});const v=await Ae();if(console.log("[LB] 로그인 상태 확인",{hasUser:!!v,userId:v==null?void 0:v.id}),!v){console.log("[LB] 로그인되지 않음, 로그인 버튼 표시"),_.innerHTML=`
                  <div class="leaderboard-my-rank-empty">
                    로그인 후에 내 순위를 볼 수 있습니다.
                    <div class="leaderboard-my-rank-actions">
                      <button type="button" class="btn" id="openLoginFromRanking">
                        🔐 Google로 로그인
                      </button>
                    </div>
                  </div>
                `;const f=document.getElementById("openLoginFromRanking");f&&f.addEventListener("click",async p=>{if(p.preventDefault(),!Tn()){alert("현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.");return}(await bo("google")).ok?setTimeout(()=>kt(!0),1e3):alert("로그인에 실패했습니다. 다시 시도해 주세요.")});return}console.log("[LB] 로그인 확인됨, 내 순위 조회 시작"),_.innerHTML=`
                <div class="leaderboard-my-rank-loading">
                  내 순위를 불러오는 중...
                </div>
              `;try{const f=await vo(ne,"assets");if(console.log("[LB] 내 순위 조회 결과",{success:f.success,errorType:f.errorType,hasData:!!f.data}),!f.success||!f.data){let p="";if(f.errorType==="forbidden")console.warn("[LB] 권한 부족으로 내 순위 조회 실패"),p=`
                      <div class="leaderboard-my-rank-empty">
                        로그인 후에 내 순위를 볼 수 있습니다.
                        <div class="leaderboard-my-rank-actions">
                          <button type="button" class="btn" id="openLoginFromRanking">
                            🔐 Google로 로그인
                          </button>
                        </div>
                      </div>
                    `;else if(f.errorType==="network")console.error("[LB] 네트워크 오류로 내 순위 조회 실패"),p=`
                      <div class="leaderboard-my-rank-error">
                        네트워크 오류로 내 순위를 불러올 수 없습니다.
                      </div>
                    `;else if(f.errorType==="not_found"){if(console.log("[LB] 리더보드에 기록 없음, 리더보드 업데이트 시도"),v&&ne)try{const w=k+Jt(),S=Date.now()-_e,U=Be+S;console.log("[LB] 리더보드 업데이트 시도",{nickname:ne,totalAssets:w,totalPlayTimeMs:U,towerCount:ke});const ee=await Pn(ne,w,U,ke);if(ee.success){console.log("[LB] 리더보드 업데이트 성공, 다시 조회");const X=await vo(ne,"assets");if(X.success&&X.data){const ce=X.data,tt=jt(ce.play_time_ms||0),q=ce.tower_count||0,$e=q>0?`${ce.nickname||ne||"익명"} 🗼${q>1?`x${q}`:""}`:ce.nickname||ne||"익명";_.innerHTML=`
                              <div class="my-rank-card">
                                <div class="my-rank-header">
                                  <span class="my-rank-label">내 기록</span>
                                  <span class="my-rank-rank-badge">${ce.rank}위</span>
                                </div>
                                <div class="my-rank-main">
                                  <div class="my-rank-name">${$e}</div>
                                  <div class="my-rank-assets">💰 ${J(ce.total_assets||0)}</div>
                                </div>
                                <div class="my-rank-meta">
                                  <span class="my-rank-playtime">⏱️ ${tt}</span>
                                  <span class="my-rank-note">내 실제 순위</span>
                                </div>
                              </div>
                            `;return}}else console.error("[LB] 리더보드 업데이트 실패",ee.error)}catch(w){console.error("[LB] 리더보드 업데이트 중 오류",w)}p=`
                      <div class="leaderboard-my-rank-empty">
                        아직 리더보드에 기록이 없습니다.<br />
                        게임을 플레이하고 저장하면 순위가 표시됩니다.
                      </div>
                    `}else console.error("[LB] 내 순위 조회 실패",f.errorType),p=`
                      <div class="leaderboard-my-rank-error">
                        내 순위를 불러올 수 없습니다.
                      </div>
                    `;_.innerHTML=p;const g=document.getElementById("openLoginFromRanking");g&&g.addEventListener("click",async w=>{if(w.preventDefault(),!Tn()){alert("현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.");return}(await bo("google")).ok?setTimeout(()=>kt(!0),1e3):alert("로그인에 실패했습니다. 다시 시도해 주세요.")})}else{const p=f.data;console.log("[LB] 내 순위 조회 성공",{rank:p.rank,nickname:p.nickname});const g=jt(p.play_time_ms||0),w=p.tower_count||0,S=w>0?`${p.nickname||ne||"익명"} 🗼${w>1?`x${w}`:""}`:p.nickname||ne||"익명";_.innerHTML=`
                    <div class="my-rank-card">
                      <div class="my-rank-header">
                        <span class="my-rank-label">내 기록</span>
                        <span class="my-rank-rank-badge">${p.rank}위</span>
                      </div>
                      <div class="my-rank-main">
                        <div class="my-rank-name">${S}</div>
                        <div class="my-rank-assets">💰 ${J(p.total_assets||0)}</div>
                      </div>
                      <div class="my-rank-meta">
                        <span class="my-rank-playtime">⏱️ ${g}</span>
                        <span class="my-rank-note">내 실제 순위</span>
                      </div>
                    </div>
                  `}}catch(f){console.error("[LB] 내 순위 RPC 호출 실패:",f),_.innerHTML=`
                  <div class="leaderboard-my-rank-error">
                    내 순위를 불러오는 중 오류가 발생했습니다.
                  </div>
                `}}}catch(a){clearTimeout(s),console.error("리더보드 UI 업데이트 실패:",a),n.innerHTML=`<div class="leaderboard-error">리더보드를 불러오는 중 오류가 발생했습니다: ${a.message||"알 수 없는 오류"}</div>`,Je=Date.now()}finally{et=!1}},t?0:300)}async function Ks(){if(!ne){console.log("[LB] 리더보드 업데이트 스킵: 닉네임 없음");return}if(ke>0){console.log("[LB] 리더보드 업데이트 스킵: 타워 달성 후 자동 업데이트 중단");return}try{const t=await Ae();if(!t){console.log("[LB] 리더보드 업데이트 스킵: 로그인되지 않음");return}const n=k+Jt(),c=Date.now()-_e,s=Be+c;console.log("[LB] 리더보드 업데이트 시도",{nickname:ne,totalAssets:n,totalPlayTimeMs:s,towerCount:ke,userId:t.id});const a=await Pn(ne,n,s,ke);a.success?console.log("[LB] 리더보드 업데이트 성공"):console.error("[LB] 리더보드 업데이트 실패",a.error)}catch(t){console.error("[LB] 리더보드 업데이트 예외 발생:",t)}}function Wt(t,n){let c=0;for(let s=0;s<n;s++)c+=j(t,s);return c}function zt(t,n){let c=0;for(let s=0;s<n;s++)c+=V(t,s);return c}function Vs(){const t={savings:{id:"savingsOwnedStats",name:"적금"},bond:{id:"bondsOwnedStats",name:"주식"},usStock:{id:"usStocksOwnedStats",name:"미국주식"},crypto:{id:"cryptosOwnedStats",name:"코인"}},n={villa:{id:"villasOwnedStats",name:"빌라"},officetel:{id:"officetelsOwnedStats",name:"오피스텔"},apartment:{id:"apartmentsOwnedStats",name:"아파트"},shop:{id:"shopsOwnedStats",name:"상가"},building:{id:"buildingsOwnedStats",name:"빌딩"}};Object.keys(t).forEach(c=>{const s=t[c],a=document.getElementById(s.id);if(a){const i=a.closest(".asset-row");if(i){const r=!Q(c);i.classList.toggle("locked",r)}}}),Object.keys(n).forEach(c=>{const s=n[c],a=document.getElementById(s.id);if(a){const i=a.closest(".asset-row");if(i){const r=!Q(c);i.classList.toggle("locked",r)}}})}function Jt(){let t=0;return P>0&&(t+=j("deposit",P-1)),x>0&&(t+=j("savings",x-1)),T>0&&(t+=j("bond",T-1)),F>0&&(t+=V("villa",F-1)),O>0&&(t+=V("officetel",O-1)),A>0&&(t+=V("apartment",A-1)),D>0&&(t+=V("shop",D-1)),N>0&&(t+=V("building",N-1)),t}function go(t){if(!t)return 0;let n=0;const c=Number(t.cash||0),s=Number(t.deposits||0),a=Number(t.savings||0),i=Number(t.bonds||0),r=Number(t.usStocks||0),u=Number(t.cryptos||0);for(let f=0;f<s;f++)n+=j("deposit",f);for(let f=0;f<a;f++)n+=j("savings",f);for(let f=0;f<i;f++)n+=j("bond",f);for(let f=0;f<r;f++)n+=j("usStock",f);for(let f=0;f<u;f++)n+=j("crypto",f);const d=Number(t.villas||0),y=Number(t.officetels||0),h=Number(t.apartments||0),$=Number(t.shops||0),_=Number(t.buildings||0),v=Number(t.towers||0);for(let f=0;f<d;f++)n+=V("villa",f);for(let f=0;f<y;f++)n+=V("officetel",f);for(let f=0;f<h;f++)n+=V("apartment",f);for(let f=0;f<$;f++)n+=V("shop",f);for(let f=0;f<_;f++)n+=V("building",f);for(let f=0;f<v;f++)n+=V("tower",f);return c+n}function po(t,n){if(!t)return 0;const c=Number(t.totalPlayTime||0),s=Number(t.sessionStartTime||Date.now()),a=Date.now()-(n||s);return c+Math.max(0,a)}function Hs(){const t=[];return P>0&&t.push({name:"예금",efficiency:C.deposit,count:P}),x>0&&t.push({name:"적금",efficiency:C.savings,count:x}),T>0&&t.push({name:"국내주식",efficiency:C.bond,count:T}),W>0&&t.push({name:"미국주식",efficiency:C.usStock,count:W}),H>0&&t.push({name:"코인",efficiency:C.crypto,count:H}),F>0&&t.push({name:"빌라",efficiency:I.villa*Ee,count:F}),O>0&&t.push({name:"오피스텔",efficiency:I.officetel*Ee,count:O}),A>0&&t.push({name:"아파트",efficiency:I.apartment*Ee,count:A}),D>0&&t.push({name:"상가",efficiency:I.shop*Ee,count:D}),N>0&&t.push({name:"빌딩",efficiency:I.building*Ee,count:N}),t.sort((n,c)=>c.efficiency-n.efficiency),t.slice(0,3).map(n=>`${n.name} (${M(Math.floor(n.efficiency))}원/초, ${n.count}개 보유)`)}function Gs(){const t=document.getElementById("achievementGrid");if(!t)return;if(!window.__achievementTooltipPortalInitialized){window.__achievementTooltipPortalInitialized=!0;const s=()=>{let u=document.getElementById("achievementTooltip");return u||(u=document.createElement("div"),u.id="achievementTooltip",u.className="achievement-tooltip",u.setAttribute("role","tooltip"),u.setAttribute("aria-hidden","true"),document.body.appendChild(u)),u},a=u=>{const d=Xe.find(y=>y.id===u);return d?d.unlocked?`${d.name}
${d.desc}
✅ 달성!`:`${d.name}
${d.desc}
🔒 미달성`:""},i=()=>{const u=document.getElementById("achievementTooltip");u&&(u.classList.remove("active","bottom"),u.style.left="",u.style.top="",u.style.bottom="",u.style.opacity="",u.style.visibility="",u.style.pointerEvents="",u.setAttribute("aria-hidden","true"),window.__achievementTooltipAnchorId=null)},r=u=>{var w,S;const d=s(),y=((w=u==null?void 0:u.dataset)==null?void 0:w.achievementId)||((S=u==null?void 0:u.id)==null?void 0:S.replace(/^ach_/,""));if(!y)return;if(window.__achievementTooltipAnchorId===y&&d.classList.contains("active")){i();return}i(),d.textContent=a(y),d.setAttribute("aria-hidden","false"),d.classList.add("active"),d.style.opacity="0",d.style.visibility="hidden",d.style.pointerEvents="none",d.style.left="0px",d.style.top="0px",d.style.bottom="auto",d.offsetHeight;const h=d.getBoundingClientRect(),$=u.getBoundingClientRect(),_=window.innerWidth,v=window.innerHeight;let f=$.left+$.width/2,p=$.top-h.height-8,g=!1;p<10&&(p=$.bottom+8,g=!0),p+h.height>v-10&&(p=v-h.height-10),f+h.width/2>_-10&&(f=_-h.width/2-10),f-h.width/2<10&&(f=h.width/2+10),d.style.left=`${f}px`,d.style.top=`${p}px`,d.style.bottom="auto",d.classList.toggle("bottom",g),d.style.visibility="visible",d.style.opacity="1",d.style.pointerEvents="none",window.__achievementTooltipAnchorId=y};t.addEventListener("click",u=>{const d=u.target.closest(".achievement-icon");d&&(u.stopPropagation(),r(d))}),t.addEventListener("pointerout",u=>{var y,h;(h=(y=u.target).closest)!=null&&h.call(y,".achievement-icon")&&i()}),document.addEventListener("click",()=>i(),!0),window.addEventListener("scroll",()=>i(),!0),window.addEventListener("resize",()=>i(),!0)}if(t.children.length>0){let s=0;Object.values(Xe).forEach(i=>{const r=document.getElementById("ach_"+i.id);r&&(i.unlocked?(r.classList.add("unlocked"),r.classList.remove("locked"),s++):(r.classList.add("locked"),r.classList.remove("unlocked")),r.title=i.unlocked?`${i.name}
${i.desc}
✅ 달성!`:`${i.name}
${i.desc}
🔒 미달성`)});const a=Object.keys(Xe).length;m(document.getElementById("achievementProgress"),`${s}/${a}`);return}t.innerHTML="";let n=0;const c=Object.keys(Xe).length;Object.values(Xe).forEach(s=>{const a=document.createElement("div");a.className="achievement-icon",a.id="ach_"+s.id,a.dataset.achievementId=s.id,a.textContent=s.icon,a.title=s.unlocked?`${s.name}
${s.desc}
✅ 달성!`:`${s.name}
${s.desc}
🔒 미달성`,s.unlocked?(a.classList.add("unlocked"),n++):a.classList.add("locked"),t.appendChild(a)}),m(document.getElementById("achievementProgress"),`${n}/${c}`)}let bt=null,un=null;function Bn(){return window.matchMedia&&window.matchMedia("(min-width: 769px)").matches}function _n(){const t=document.getElementById("rankingTab");if(!t||!Bn()&&!t.classList.contains("active")||bt)return;kt(!0);const c=6e4-Date.now()%6e4;bt=setTimeout(function s(){const a=t.classList.contains("active");if(!Bn()&&!a){xn();return}kt(!1),bt=setTimeout(s,6e4)},c)}function xn(){bt&&(clearTimeout(bt),bt=null)}function js(){const t=document.getElementById("rankingTab"),n=document.getElementById("leaderboardContainer");if(!(!t||!n)){if(!("IntersectionObserver"in window)){console.log("IntersectionObserver 미지원: active 탭 기준으로만 리더보드 폴링 제어");return}un&&un.disconnect(),un=new IntersectionObserver(c=>{c.forEach(s=>{const a=s.isIntersecting,i=t.classList.contains("active");(Bn()?a:a&&i)?_n():xn()})},{root:null,threshold:.1}),un.observe(n)}}const yo=document.querySelectorAll(".nav-btn"),Ws=document.querySelectorAll(".tab-content");yo.forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-tab");Ws.forEach(s=>s.classList.remove("active")),yo.forEach(s=>s.classList.remove("active"));const c=document.getElementById(n);c&&c.classList.add("active"),t.classList.add("active"),n==="rankingTab"?_n():xn()})}),le(),setTimeout(()=>{const t=document.getElementById("rankingTab");t&&t.classList.contains("active")&&_n(),js()},1e3);const $o=document.getElementById("upgradeList");$o&&($o.classList.remove("collapsed-section"),console.log("✅ Upgrade list initialized and opened")),gt(),console.log("=== UPGRADE SYSTEM DEBUG ==="),console.log("Total upgrades defined:",Object.keys(Y).length),console.log("Unlocked upgrades:",Object.values(Y).filter(t=>t.unlocked).length),console.log("Purchased upgrades:",Object.values(Y).filter(t=>t.purchased).length),console.log("First 3 upgrades:",Object.entries(Y).slice(0,3).map(([t,n])=>({id:t,unlocked:n.unlocked,purchased:n.purchased,cost:n.cost}))),console.log("==========================="),window.cheat={addCash:t=>{k+=t,le(),console.log(`💰 Added ${t} cash. New total: ${k}`)},unlockAllUpgrades:()=>{var t;Object.values(Y).forEach(n=>n.unlocked=!0),gt(),console.log("🔓 All upgrades unlocked!"),console.log("Upgrade list element:",document.getElementById("upgradeList")),console.log("Upgrade list children:",(t=document.getElementById("upgradeList"))==null?void 0:t.children.length)},unlockFirstUpgrade:()=>{const t=Object.keys(Y)[0];Y[t].unlocked=!0,gt(),console.log("🔓 First upgrade unlocked:",Y[t].name)},setClicks:t=>{ie=t,le(),Zn(),console.log(`👆 Set clicks to ${t}`)},testUpgrade:()=>{var n;const t=Object.keys(Y)[0];Y[t].unlocked=!0,k+=1e7,gt(),le(),console.log("🧪 Test setup complete:"),console.log("  - First upgrade unlocked"),console.log("  - Cash: 1000만원"),console.log("  - Upgrade list visible:",!((n=document.getElementById("upgradeList"))!=null&&n.classList.contains("collapsed-section"))),console.log("  - Upgrade items count:",document.querySelectorAll(".upgrade-item").length)}},console.log("💡 치트 코드 사용 가능:"),console.log("  - cheat.testUpgrade() : 빠른 테스트 (첫 업그레이드 해금 + 1000만원)"),console.log("  - cheat.addCash(1000000000) : 10억원 추가"),console.log("  - cheat.unlockAllUpgrades() : 모든 업그레이드 해금"),console.log("  - cheat.setClicks(100) : 클릭 수 설정"),L("🧪 v2.6 Cookie Clicker 스타일 업그레이드 시스템 구현 완료"),L("✅ DOM 참조 오류 수정 완료"),L("✅ 커리어 진행률 시스템 정상화"),L("✅ 업그레이드 클릭 기능 활성화"),L("✅ 자동 저장 시스템 작동 중"),L("⚡ 성능 최적화: 업그레이드 리스트 깜빡임 해결"),console.log("Initial state:",{cash:k,totalClicks:ie,deposits:P,savings:x,bonds:T,villas:F,officetels:O,apartments:A,shops:D,buildings:N})});
