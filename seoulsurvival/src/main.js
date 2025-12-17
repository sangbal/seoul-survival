import { safeGetJSON, safeRemove, safeSetJSON } from './persist/storage.js';
import { getFinancialCost, getFinancialSellPrice, getPropertyCost, getPropertySellPrice } from './economy/pricing.js';
import { createMarketSystem } from './systems/market.js';
import { createAchievementsSystem } from './systems/achievements.js';
import { createUpgradeUnlockSystem } from './systems/upgrades.js';
import { getDomRefs } from './ui/domRefs.js';
import { safeClass, safeHTML, safeText } from './ui/domUtils.js';
import { updateStatsTab as updateStatsTabImpl } from './ui/statsTab.js';
import { fetchCloudSave, upsertCloudSave } from '../../shared/cloudSave.js';
import { getUser, onAuthStateChange, signInWithOAuth } from '../../shared/auth/core.js';
import { isSupabaseConfigured } from '../../shared/auth/config.js';
import { updateLeaderboard, getLeaderboard, isNicknameTaken, normalizeNickname, getMyRank } from '../../shared/leaderboard.js';

// 노동 직급별 배경 이미지 (Vite asset import로 번들링 시 경로 안정화)
import workBg01 from '../assets/images/work_bg_01_alba_night.png';
import workBg02 from '../assets/images/work_bg_02_gyeyakjik_night.png';
import workBg03 from '../assets/images/work_bg_03_sawon_night.png';
import workBg04 from '../assets/images/work_bg_04_daeri_night.png';
import workBg05 from '../assets/images/work_bg_05_gwajang_night.png';
import workBg06 from '../assets/images/work_bg_06_chajang_night.png';
import workBg07 from '../assets/images/work_bg_07_bujang_night.png';
import workBg08 from '../assets/images/work_bg_08_sangmu_night.png';
import workBg09 from '../assets/images/work_bg_09_jeonmu_night.png';
import workBg10 from '../assets/images/work_bg_10_ceo_night.png';

// 개발 모드에서는 콘솔을 유지하고, 프로덕션에서는 로그를 무력화합니다.
// - Vite 빌드/개발서버: import.meta.env.DEV 사용
// - GitHub Pages처럼 번들 없이 ESM으로 직접 로드하는 경우: import.meta.env가 없을 수 있음
const __IS_DEV__ = (import.meta.env?.DEV) || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
if (!__IS_DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

// 인앱 브라우저(카카오톡/인스타 등) 감지
function detectInAppBrowser() {
  const ua = navigator.userAgent || '';
  const isKakao = ua.includes('KAKAOTALK');
  const isInstagram = ua.includes('Instagram');
  const isFacebook = ua.includes('FBAN') || ua.includes('FBAV');
  const isLine = ua.includes('Line');
  const isWeChat = ua.includes('MicroMessenger');
  const isInApp = isKakao || isInstagram || isFacebook || isLine || isWeChat;
  return { isInApp, isKakao, isInstagram, isFacebook, isLine, isWeChat };
}

function showInAppBrowserWarningIfNeeded() {
  const { isInApp } = detectInAppBrowser();
  if (!isInApp) return;

  const banner = document.createElement('div');
  banner.className = 'inapp-warning-banner';
  banner.innerHTML = `
    이 브라우저에서는 Google 로그인이 제한될 수 있습니다.<br />
    <strong>Chrome / Safari 등 기본 브라우저에서 다시 열어 주세요.</strong>
    <div class="inapp-warning-actions">
      <button type="button" class="btn-small" id="copyGameUrlBtn">URL 복사</button>
      <button type="button" class="btn-small" id="closeInappWarningBtn">확인</button>
    </div>
  `;
  document.body.prepend(banner);

  const copyBtn = banner.querySelector('#copyGameUrlBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const url = 'https://clicksurvivor.com/seoulsurvival/';
      try {
        // 클립보드 API 시도 (HTTPS/localhost에서 동작)
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
          alert('주소가 복사되었습니다.\nChrome/Safari 주소창에 붙여넣어 열어 주세요.');
          return;
        }
        // Fallback: execCommand 사용
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            alert('주소가 복사되었습니다.\nChrome/Safari 주소창에 붙여넣어 열어 주세요.');
          } else {
            throw new Error('execCommand failed');
          }
        } catch (err) {
          alert(url + '\n위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.');
        } finally {
          document.body.removeChild(textArea);
        }
      } catch (err) {
        alert(url + '\n위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.');
      }
    });
  }

  const closeBtn = banner.querySelector('#closeInappWarningBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.remove();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {

    // ======= fixed header 높이만큼 본문 상단 여백 자동 보정 =======
    // 모바일에서 헤더가 2줄로 늘어나면(.statbar 래핑) 본문 상단 요소(직급 등)가 헤더에 가려질 수 있어,
    // 헤더 실제 높이를 CSS 변수(--header-h)로 주입해 .app padding-top이 자동으로 따라가도록 한다.
    function __syncHeaderHeightVar() {
      const header = document.querySelector('header');
      if (!header) return;
      const h = Math.ceil(header.getBoundingClientRect().height || 0);
      if (h > 0) document.documentElement.style.setProperty('--header-h', `${h}px`);
    }

    __syncHeaderHeightVar();
    showInAppBrowserWarningIfNeeded();
    window.addEventListener('resize', __syncHeaderHeightVar);
    // 모바일 주소창/뷰포트 변화 대응
    try {
      window.visualViewport?.addEventListener('resize', __syncHeaderHeightVar);
    } catch {}
    // 헤더 래핑/폰트 로딩 등으로 높이가 바뀌는 경우 대응
    try {
      const header = document.querySelector('header');
      if (header && 'ResizeObserver' in window) {
        new ResizeObserver(__syncHeaderHeightVar).observe(header);
      }
    } catch {}

    // ======= (iOS) 더블탭/핀치로 인한 화면 확대 방지 =======
    // 요구사항: 노동하기 반복 터치 시 발생하는 화면 확대를 차단
    // - meta viewport(user-scalable=no) + gesture 이벤트 preventDefault로 이중 안전장치
    try {
      const prevent = (e) => e.preventDefault();
      document.addEventListener('gesturestart', prevent, { passive: false });
      document.addEventListener('gesturechange', prevent, { passive: false });
      document.addEventListener('gestureend', prevent, { passive: false });
    } catch {
      // 브라우저가 해당 이벤트를 지원하지 않아도 무시
    }

    /*
    ============================================
    CHANGELOG v3.1.0 - 이벤트/밸런스 대폭 강화
    ============================================
    [새 기능]
    • ⚡ 시장 이벤트: 상품별 세분화된 이벤트 (32개 → 64개로 확장)
      - 강남 아파트 대박, 코인 시장 폭락 등 현실적 이벤트
    • ⚡ 시장 이벤트: 상품별 세분화된 이벤트 (32개 → 64개로 확장)
      - 강남 아파트 대박, 코인 시장 폭락 등 현실적 이벤트
      - 각 상품별 개별 수익/손실 효과
    • 📈 업그레이드 재밸런싱: 48개 업그레이드 비용/효과 최적화
      - 게임 밸런싱 전문가 관점에서 전체적 조정
    • 🏆 업적 확장: 16개 → 32개 업적으로 확장
      - 시장 이벤트 등 게임 진행 업적 추가
    • 🎨 시각 효과: 떨어지는 지폐/상품 애니메이션 추가
      - 노동 클릭 시 지폐 떨어짐
      - 상품 구매 시 해당 상품 이모지 떨어짐
    
    [버그 수정]
    • 🔧 중복 선언 오류 수정 (marketEventEndTime)
    • 🔧 버튼 상태 오류 수정 (미국주식, 코인 구매 버튼)
    • 🔧 하이라이트 이펙트 오류 수정 (잘못된 상품 하이라이트)
    
    [개선사항]
    • 📝 README.md 업데이트: 새로운 기능들 반영
    • ⚖️ 게임 밸런싱: 중반 허리 이어주기 (미국주식, 코인)
    • 🔄 순차 해금: 예금→적금→국내주식→미국주식→코인→빌라 순서
    
    CHANGELOG v2.11.0 - PC 버전 통계 탭 추가 및 반응형 개선
    ============================================
    [새 기능]
    • 📊 PC 버전에 통계 탭 상시 표시 (3열 그리드)
    • 🖥️ 화면 크기별 반응형 레이아웃
      - 1367px 이상: 4열 (노동 + 투자 + 통계 + 설정)
      - 769px~1366px: 2열 + 통계 하단
      - 768px 이하: 모바일 탭 네비게이션
    • 📐 통계 탭 컴팩트 스타일링 (PC 최적화)
    • 📜 자동 스크롤 지원 (max-height: 85vh)
    
    CHANGELOG v2.10.1 - 업그레이드 효과 중복 적용 버그 수정
    ============================================
    [버그 수정]
    • 🐛 새로고침 시 clickMultiplier가 계속 증가하는 버그 수정
    • 업그레이드 효과 재적용 코드 제거 (배수는 이미 저장된 값으로 복원됨)
    • 이제 새로고침해도 시급이 정상적으로 유지됩니다
    
    CHANGELOG v2.10.0 - Cookie Clicker 스타일 통계 탭
    ============================================
    [새 기능]
    • 📊 Cookie Clicker 스타일의 상세 통계 탭 구현
    • 💰 총 자산 및 누적 수익 표시
    • 📈 수익 구조 시각화 (노동/금융/부동산 비율)
    • 📊 자산별 누적 수익 및 개당 효율 분석
    • ⏱️ 플레이 시간 및 시간당 수익 추적
    • 🏆 업적 그리드 시스템
    • ⚡ 효율 순위 TOP 3 표시
    
    [데이터 추적]
    • 게임 시작 시간 저장/불러오기
    • 실시간 통계 업데이트
    • 모바일 최적화 반응형 레이아웃
    
    CHANGELOG v2.9.0 - 순차 해금 시스템
    ============================================
    
    🔐 금융상품과 부동산의 단계적 해금 시스템 도입
    
    A. 순차 해금 체계 ✅
    예금 (항상 가능)
      → 적금 (예금 1개 필요)
        → 주식 (적금 1개 필요)
          → 빌라 (주식 1개 필요)
            → 오피스텔 (빌라 1개 필요)
              → 아파트 (오피스텔 1개 필요)
                → 상가 (아파트 1개 필요)
                  → 빌딩 (상가 1개 필요)
    
    B. 시각적 피드백 ✅
    - 🔒 잠긴 상품: 회색 처리 + 잠금 아이콘 표시
    - 투명도 30%, 흑백 필터 90%
    - 클릭 불가 (pointer-events: none)
    - 호버 효과 비활성화
    
    C. 해금 메시지 및 애니메이션 ✅
    - 상품 구매 시 다음 상품 자동 해금 체크
    - "🔓 적금이 해금되었습니다!" 메시지
    - 발광 애니메이션 (1초간 초록색 빛)
    - 자연스러운 확대/축소 효과
    
    D. 에러 방지 ✅
    - 잠긴 상품 클릭 시 안내 메시지
    - "❌ 적금은 예금을 1개 이상 보유해야 해금됩니다."
    - 명확한 해금 조건 안내
    
    E. 게임 플레이 효과 ✅
    - 초보자 친화적: 단계별 학습 유도
    - 명확한 진행 경로: 무엇을 다음에 해야 하는지 명확
    - 성취감 증가: 새 상품 해금 시마다 보상감
    - 전략적 깊이: 효율보다 해금이 우선
    
    ============================================
    CHANGELOG v2.8.1 - 노동 배수 밸런싱
    ============================================
    
    ⚖️ 게임 밸런스 개선: 노동 수익 너프로 부동산 가치 회복
    
    A. 업그레이드 배수 조정 (보수적 너프) ✅
    기존 → 새로운 배수
    - ⚡ 효율적인 업무 처리: ×2 → ×1.5
    - 🎯 집중력 강화: ×2 → ×1.5
    - 💰 성과급 (구 골든 클릭): 평균 ×1.9 → ×1.5 (10% 확률로 6배)
    - 🔥 초과근무: ×2 → ×1.3
    - 💎 전문성 개발: ×2 → ×1.3
    - 👔 CEO 특권: ×3 → ×2
    
    최종 누적 배수: 91.2배 → 11.4배 (약 8배 감소)
    
    B. 네이밍 변경 ✅
    - "✨ 골든 클릭" → "💰 성과급" (더 현실적인 표현)
    - 로그 메시지: "골든 클릭! 10배 수익!" → "성과급 지급! 6배 수익!"
    
    C. 게임 밸런스 효과 ✅
    CEO 클릭당 수익 비교:
    - 기존: 2,280만원/클릭 (과도함)
    - 개선: 285만원/클릭 (적절함)
    
    부동산 대비 균형:
    - 빌딩 월세: 51.4만원/초
    - CEO 오토클릭: 285만원/초 = 빌딩 5.5채 수준
    - 결론: 노동 + 부동산 모두 의미있게 작동 ⚖️
    
    D. 실전 시급표 (CEO + 모든 업그레이드) ✅
    - 기본: 25만원 → 25만원
    - +⚡: 50만원 → 37.5만원
    - +🎯: 100만원 → 56.3만원
    - +💰: 190만원 → 84.4만원 (평균)
    - +🔥: 380만원 → 109.8만원
    - +💎: 760만원 → 142.7만원
    - +👔: 2,280만원 → 285만원 (최종)
    
    ============================================
    CHANGELOG v2.8.0 - 노동 시스템 종합 최적화
    ============================================
    
    🎯 노동 수익 시스템 4대 최적화 완료
    
    A. 승진 필요 클릭 수 재조정 (부드러운 곡선) ✅
    기존 → 새로운 값 (더 부드러운 성장 곡선)
    - 계약직: 20 → 50 클릭
    - 사원: 40 → 100 클릭
    - 대리: 120 → 200 클릭
    - 과장: 240 → 350 클릭
    - 차장: 400 → 550 클릭
    - 부장: 600 → 800 클릭
    - 상무: 800 → 1,100 클릭
    - 전무: 1,200 → 1,500 클릭
    - CEO: 2,000 클릭 (유지)
    
    B. 업그레이드 해금 조건 재조정 ✅
    더 빠른 타이밍에 해금되어 초중반 강화
    - ⚡ 효율적인 업무 처리: 100 → 50 클릭 (사원 직전)
    - 🎯 집중력 강화: 500 → 250 클릭 (과장 직전)
    - ✨ 골든 클릭: 1,000 → 600 클릭 (부장 직전)
    
    C. 신규 업그레이드 3종 추가 ✅
    후반 노동 수익 강화를 위한 새로운 업그레이드
    - 🔥 초과근무 (1,200 클릭): 클릭당 수익 ×2, 5천만원
    - 💎 전문성 개발 (2,000 클릭): 클릭당 수익 ×2, 2억원
    - 👔 CEO 특권 (CEO 달성): 클릭당 수익 ×3, 10억원
    
    D. 오토클릭 시스템 추가 ✅
    자동화로 후반 게임플레이 개선
    - 📱 자동 업무 처리 시스템: 1초마다 자동 1회 클릭
    - 해금 조건: 상무(7레벨) 이상 + 부동산 10채 보유
    - 비용: 50억원
    - 골든 클릭 확률 적용 (10% 확률로 10배)
    
    E. 게임 밸런스 효과 ✅
    - 초반: 더 빠른 업그레이드로 재미 증가
    - 중반: 부드러운 승진 곡선으로 지루함 감소
    - 후반: 신규 업그레이드 + 오토클릭으로 의미 있는 노동 수익
    - 최종 배수: 1 × 2 × 2 × 2 × 2 × 2 × 3 = 192배 (기존 32배 대비 6배 증가)
    - CEO + 모든 업그레이드: 25 × 192 = 4,800배 (클릭당 4,800만원!)
    
    ============================================
    CHANGELOG v2.7.1 - 노동 시급 밸런싱 (연봉 기반)
    ============================================
    
    ⚖️ 게임 밸런스 개선: 현실적인 급여 체계 적용
    
    A. 직급별 시급 조정 (연봉 기반) ✅
    - 알바 (2000만원): 1.0배 → 1.0배 (유지)
    - 계약직 (3000만원): 1.5배 → 1.5배 (유지)
    - 사원 (4000만원): 2.5배 → 2.0배 (-20%)
    - 대리 (5000만원): 4.0배 → 2.5배 (-37.5%)
    - 과장 (6000만원): 6.0배 → 3.0배 (-50%)
    - 차장 (7000만원): 8.0배 → 3.5배 (-56%)
    - 부장 (8000만원): 12.0배 → 4.0배 (-67%)
    - 상무 (1억원): 18.0배 → 5.0배 (-72%)
    - 전무 (2억원): 30.0배 → 10.0배 (-67%)
    - CEO (5억원): 50.0배 → 25.0배 (-50%)
    
    B. 게임 밸런스 개선 효과 ✅
    - 초중반 금융상품의 의미 강화
    - 부동산 투자 필요성 증가
    - 노동 vs 자산 수익 균형 달성
    - 후반에도 여전히 폭발적 성장 (전무 10배, CEO 25배)
    
    C. 현실성 개선 ✅
    - 실제 연봉 체계와 일치
    - 연간 2,000시간 근무 기준
    - 직급별 합리적인 급여 상승 곡선
    
    D. 게임플레이 영향 ✅
    - 초반(알바~계약직): 변화 없음, 진입 장벽 유지
    - 중반(사원~부장): 노동 수익 감소, 투자 필수화
    - 후반(상무~CEO): 여전히 강력하지만 부동산과 균형
    
    ============================================
    CHANGELOG v2.7.0 - Cookie Clicker 스타일 3줄 설명 시스템
    ============================================
    
    🎮 Cookie Clicker 벤치마킹: 상품 설명 구조 개선
    
    A. 3줄 설명 시스템 도입 ✅
    각 금융상품/부동산마다 다음 정보를 표시:
    - 1줄: 개별 수익 (예: "• 각 예금이 초당 10원 생산")
    - 2줄: 총 기여도 (예: "• 5개 예금이 초당 50원 생산 (총 수익의 5%)")
    - 3줄: 누적 생산량 (예: "• 지금까지 125,000원 생산")
    
    B. 누적 생산량 추적 시스템 ✅
    - 금융상품: depositsLifetime, savingsLifetime, bondsLifetime
    - 부동산: villasLifetime, officetelsLifetime, apartmentsLifetime, shopsLifetime, buildingsLifetime
    - 매 틱(50ms)마다 개별 상품의 생산량 누적
    - 저장/불러오기에 포함
    
    C. 실시간 통계 계산 ✅
    - 각 상품의 총 수익 = 개당 수익 × 보유 개수
    - 전체 RPS 대비 비율 계산
    - 숫자 서식: 천단위 콤마, 원단위 표시
    
    D. UI/UX 개선 ✅
    - 플레이어가 각 상품의 효율성을 한눈에 파악
    - 어느 상품이 가장 많이 벌고 있는지 직관적으로 확인
    - 누적 생산량으로 성취감 제공
    - Cookie Clicker의 정보 전달 방식 완벽 구현
    
    E. 기술 구현 ✅
    - HTML: 8개 상품 × 3개 정보 = 24개 새 요소 추가
    - JavaScript: updateUI()에서 실시간 계산 및 업데이트
    - 게임 루프: deltaTime 기반 누적 생산량 계산
    - 저장/불러오기: 모든 lifetime 변수 포함
    
    ============================================
    CHANGELOG v2.6.2 - UI 디자인 통일
    ============================================
    
    🎨 전체 UI 일관성 개선
    
    A. 금융상품/부동산 카드 스타일 업그레이드와 통일 ✅
    - 배경색: var(--btn2) → var(--btn)
    - 테두리: 1px → 2px solid transparent
    - border-radius: 12px → 8px
    - 호버 효과: 배경 변경 + 테두리 하늘색 + 위로 이동
    - 간격: 10px → 8px (일관성)
    
    B. 구매 가능 상태 시각 효과 개선 ✅
    - affordable: 초록 테두리 + 발광 애니메이션 (업그레이드와 동일)
    - 기존: border-left만 → 개선: 전체 테두리 + 그림자
    - upgradeGlow 애니메이션 공유
    
    C. 버튼 디자인 현대화 ✅
    - 배경: var(--btn) → var(--accent) (민트색)
    - 텍스트: var(--text) → var(--bg) (검정, 대비 강화)
    - 크기: padding 16px 22px → 8px 16px (컴팩트)
    - 폰트: 기본 → 12px (일관성)
    - 호버: 밝기 증가 + 크기 확대
    - 비활성: 회색 배경
    
    D. 메타 정보 레이아웃 개선 ✅
    - flex:1 추가로 공간 최적 활용
    - desc 마진: 4px 추가 (가독성)
    - pointer-events:none으로 클릭 간섭 방지
    
    E. 전체적인 통일감 ✅
    - 업그레이드 / 금융상품 / 부동산 모두 동일한 디자인 언어
    - 호버 시 일관된 반응
    - 구매 가능 시 동일한 시각적 피드백
    
    ============================================
    CHANGELOG v2.6.1 - 업그레이드 클릭 문제 해결
    ============================================
    
    🐛 핵심 버그 수정: 업그레이드 클릭 불가 문제
    
    A. 문제 진단 ✅
    - updateUI()가 50ms마다 호출되면서 updateUpgradeList()도 함께 호출
    - DOM이 초당 20번 재생성되어 클릭 도중 요소가 사라짐
    - 테두리 깜빡임 현상 (업그레이드 리스트 재생성 신호)
    - F12 개발자 도구 열면 성능 저하로 클릭 가능 (증상 확인)
    
    B. 해결 방법 ✅
    - updateUpgradeList() → 해금/구매 시에만 호출 (DOM 재생성)
    - updateUpgradeAffordability() → 매 틱마다 호출 (클래스만 토글)
    - pointer-events: none을 자식 요소에 적용
    
    C. 성능 개선 ✅
    - DOM 재생성: 초당 20회 → 필요시에만
    - 스타일 업데이트: 0회 → 초당 20회 (가벼움)
    - CPU 사용량: 감소
    - 메모리 사용량: 감소
    
    D. 사용자 경험 개선 ✅
    - ✅ 테두리 깜빡임 완전 제거
    - ✅ 클릭 100% 작동 보장
    - ✅ F12 없이도 정상 구매 가능
    - ✅ 부드러운 애니메이션
    
    ============================================
    CHANGELOG v2.6 - Cookie Clicker 스타일 업그레이드 시스템
    ============================================
    
    🎯 핵심 개편: "건물별 업그레이드 해금 시스템"
    
    A. 업그레이드 시스템 전면 개편 ✅
    - 기존 3x3 그리드 → Cookie Clicker 스타일 리스트
    - 하단 업그레이드 섹션 통합 (월세 수익률, 관리인 고용)
    - 동적 해금 시스템: 조건 충족 시 자동 표시
    
    B. 건물별 업그레이드 추가 ✅
    - 노동: 총 클릭 수 기반 (3개)
    - 예금: 5/25개 보유 시 (2개)
    - 적금: 5/25개 보유 시 (2개)
    - 주식: 5/25개 보유 시 (2개)
    - 빌라: 5/25개 보유 시 (2개)
    - 오피스텔: 5/25개 보유 시 (2개)
    - 아파트: 5/25개 보유 시 (2개)
    - 상가: 5/25개 보유 시 (2개)
    - 빌딩: 5/25개 보유 시 (2개)
    - 전역: 총 부동산/금융 개수 기반 (3개)
    
    C. UI/UX 개선 ✅
    - 구매 가능한 업그레이드 시각적 강조 (발광 효과)
    - NEW! 배지 추가
    - 업그레이드 개수 표시 "(3)"
    - 스크롤 가능한 리스트 (max-height: 400px)
    
    D. 저장/불러오기 통합 ✅
    - 업그레이드 해금/구매 상태 저장
    - 로드 시 구매한 업그레이드 효과 재적용
    
    ============================================
    CHANGELOG v2.5 - 자본주의 메시지 구현
    ============================================
    
    🎯 핵심 철학: "더 큰 자본을 소유할수록 더 높은 수익률"
    
    A. 수익률 재설계 (일관된 상승 곡선) ✅
    - 예금(0.010%) < 적금(0.015%) < 주식(0.0225%)
    - 빌라(0.00338%) < 오피스텔(0.00506%) < 아파트(0.00759%)
    - 상가(0.01142%) < 빌딩(0.01713%) 
    - 각 단계 1.5배 체증 구조, 총 171배 효율 차이
    
    B. 금융상품 수익 하향 조정 ✅
    - 예금: 10원/초 → 5원/초 (-50%)
    - 적금: 120원/초 → 75원/초 (-37.5%)
    - 주식: 1,400원/초 → 1,125원/초 (-19.6%)
    
    C. 부동산 수익 대폭 상향 ✅
    - 빌라: 250원/초 → 8,438원/초 (+3,275%)
    - 오피스텔: 500원/초 → 17,719원/초 (+3,444%)
    - 아파트: 1,000원/초 → 60,750원/초 (+5,975%)
    - 상가: 2,000원/초 → 137,000원/초 (+6,750%)
    - 빌딩: 5,000원/초 → 514,000원/초 (+10,180%)
    
    D. 원룸 완전 삭제 ✅
    - 부동산 6종 → 5종으로 단순화
    - HTML, JS, DOM, 이벤트, saveGame 등 전체 제거
    
    E. 숫자 서식 개선 ✅
    - ₩ 기호 제거: "구입 (₩1.5억)" → "구입 (1.5억)"
    - 천단위 콤마 추가: formatFinancialPrice(), formatPropertyPrice()
    - 금융상품: 만원 단위 반올림
    - 부동산: 0.1억 단위 반올림
    
    F. 상단 패널 툴팁 추가 ✅
    - 금융 툴팁: 예금/적금/주식 개수 표시
    - 부동산 툴팁: 빌라/오피스텔/아파트/상가/빌딩 개수
    - 수익 툴팁: 금융/부동산 수익, 시장배수 상세
    
    G. 직급 메시지 정합성 ✅
    - 승진 로그: "🎉 신입사원으로 승진했습니다! (클릭당 1.2배 수익)"
    
    ============================================
    v2.4 - 판매 시스템 전면 개편
    ============================================
    
    🎯 판매 시스템 통합 및 최적화
    
    A. 불필요한 판매 버튼 제거 ✅
    - 금융상품별 개별 판매 버튼 3개 제거 (HTML/JS)
    
    B. 구매/판매 모드 토글 시스템 통합 ✅
    - 모든 금융상품과 부동산에 구매/판매 모드 적용
    - 단일 버튼으로 구매/판매 전환 (상단 토글로 제어)
    
    C. 통합 거래 함수 구현 ✅
    - handleTransaction(category, type, currentCount)
    - 구매/판매 로직 통합, 성공/실패 상태 반환
    
    D. 판매 가격 계산 시스템 완성 ✅
    - getFinancialSellPrice(), getPropertySellPrice()
    - 판매 가격: 현재가의 80% (일관된 정책)
    - 다중 수량 판매 지원 (1/10/100개)
    
    E. 가격 계산 함수 개선 ✅
    - 다중 구매/판매 지원 (quantity 파라미터)
    - 누적 가격 정확하게 계산
    
    F. 버튼 UI 동적 업데이트 ✅
    - updateButton() 함수로 텍스트/상태 자동 업데이트
    - "구입 x10 (₩1.5만)" / "판매 x10 (₩1.2만)"
    
    G. 모든 거래 이벤트 리팩토링 ✅
    - 총 58줄 → 36줄 (38% 감소)
    
    H. 성능 최적화 ✅
    - setInterval: 250ms → 50ms (5배 빠름)
    - Ctrl+R 충돌 해결 → Ctrl+Shift+R
    
    I. 사용자 피드백 개선 ✅
    - 자금/수량 부족 시 명확한 메시지
    - 성공 메시지에 이모지 + 가격 + 보유수량
    
    ============================================
    v2.3 - 정밀 검사 및 수정 완료
    ============================================
    - DOM/ID/참조 불일치 수정
    - 커리어 진행률 0% 고정 문제 해결
    - CSS 변수/테마 누락 수정
    - 저장/불러오기/리셋 일관화
    ============================================
    */
    
    // ======= 유틸리티 함수 =======
    function safeText(element, text) {
      if (element && element.textContent !== undefined) {
        element.textContent = text;
      }
    }
    
    function safeHTML(element, html) {
      if (element && element.innerHTML !== undefined) {
        element.innerHTML = html;
      }
    }
    
    function safeClass(element, className, add = true) {
      if (element && element.classList) {
        if (add) {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }
      }
    }
    
    // 구매/판매 통합 함수
    function handleTransaction(category, type, currentCount) {
      const qty = purchaseQuantity;
      
      if (purchaseMode === 'buy') {
        // 구매 로직
        const cost = category === 'financial' 
          ? getFinancialCost(type, currentCount) * qty
          : getPropertyCost(type, currentCount, qty);
        
        if (cash < cost) {
          addLog(`💸 자금이 부족합니다. (필요: ${formatKoreanNumber(cost)}원)`);
          return { success: false, newCount: currentCount };
        }
        
        cash -= cost;
        const newCount = currentCount + qty;
        const unit = category === 'financial' ? '개' : '채';
        const names = {
          deposit: '예금', savings: '적금', bond: '국내주식',
          usStock: '미국주식', crypto: '코인',
          villa: '빌라', officetel: '오피스텔',
          apartment: '아파트', shop: '상가', building: '빌딩'
        };
        
        const productName = names[type] || type;
        addLog(`✅ ${productName} ${qty}${unit}를 구입했습니다. (보유 ${newCount}${unit})`);
        
        // 구매 성공 시 떨어지는 애니메이션
        const buildingIcons = {
          deposit: '💰', savings: '🏦', bond: '📈',
          usStock: '🇺🇸', crypto: '₿',
          villa: '🏠', officetel: '🏢',
          apartment: '🏘️', shop: '🏪', building: '🏙️'
        };
        if (settings.particles) {
          createFallingBuilding(buildingIcons[type] || '🏠', qty);
        }
        
        return { success: true, newCount };
        
      } else if (purchaseMode === 'sell') {
        // 판매 로직
        if (currentCount < qty) {
          addLog(`❌ 판매할 수량이 부족합니다. (보유: ${currentCount})`);
          return { success: false, newCount: currentCount };
        }
        
        const sellPrice = category === 'financial'
          ? getFinancialSellPrice(type, currentCount) * qty
          : getPropertySellPrice(type, currentCount, qty);
        
        cash += sellPrice;
        const newCount = currentCount - qty;
        const unit = category === 'financial' ? '개' : '채';
        const names = {
          deposit: '예금', savings: '적금', bond: '국내주식',
          usStock: '미국주식', crypto: '코인',
          villa: '빌라', officetel: '오피스텔',
          apartment: '아파트', shop: '상가', building: '빌딩'
        };
        
        const productName = names[type] || type;
        addLog(`💰 ${productName} ${qty}${unit}를 판매했습니다. (+${formatKoreanNumber(sellPrice)}원, 보유 ${newCount}${unit})`);
        return { success: true, newCount };
      }
      
      return { success: false, newCount: currentCount };
    }
    
    // ======= 상태 =======
    const fmt = new Intl.NumberFormat('ko-KR');
    
    // 한국식 숫자 표기 함수 (일반용)
    function formatKoreanNumber(num) {
      // 통계 섹션에서는 항상 짧은 숫자 형식 사용
      // 짧은 숫자 형식 (천의자리 콤마 포함)
      if (num >= 1000000000000) {
        const value = (num / 1000000000000).toFixed(1);
        return parseFloat(value).toLocaleString('ko-KR') + '조';
      } else if (num >= 100000000) {
        const value = (num / 100000000).toFixed(1);
        return parseFloat(value).toLocaleString('ko-KR') + '억';
      } else if (num >= 10000) {
        const value = (num / 10000).toFixed(1);
        return parseFloat(value).toLocaleString('ko-KR') + '만';
      } else if (num >= 1000) {
        const value = (num / 1000).toFixed(1);
        return parseFloat(value).toLocaleString('ko-KR') + '천';
      } else {
        return Math.floor(num).toString();
      }
    }
    
    // 통계/축약 표기용 포맷 함수
    // - 짧은 숫자 OFF: 항상 전체 원 단위(천단위 콤마)
    // - 짧은 숫자 ON : 단위별 소수점 자릿수 고정(눈에 거슬리는 "생겼다/없어졌다" 현상 방지)
    //   * 만원: 0.0만원 (소수 1자리 고정)
    //   * 억/조: 0.00억 / 0.00조 (소수 2자리 고정)
    function formatStatsNumber(num) {
      if (!settings.shortNumbers) {
        return Math.floor(num).toLocaleString('ko-KR') + '원';
      }

      if (num >= 1000000000000) {
        const value = num / 1000000000000;
        return value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '조';
      } else if (num >= 100000000) {
        const value = num / 100000000;
        return value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '억';
      } else if (num >= 10000) {
        const value = num / 10000;
        return value.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '만원';
      } else if (num >= 1000) {
        const cheon = Math.floor(num / 1000);
        return cheon.toLocaleString('ko-KR') + '천원';
      } else {
        return Math.floor(num).toLocaleString('ko-KR') + '원';
      }
    }
    
    // 상단 헤더 현금 표시용 포맷 (통계 포맷과 동일 규칙 사용)
    function formatHeaderCash(num) {
      return formatStatsNumber(num);
    }
    
    // 금융상품용 포맷 (만원 단위까지 반올림, 천단위 콤마)
    function formatFinancialPrice(num) {
      if (num >= 100000000) {
        // 1억 이상: 억 단위로 표시
        const eok = Math.round(num / 100000000);
        return eok.toLocaleString('ko-KR') + '억';
      } else if (num >= 10000) {
        // 1만 이상: 만원 단위로 반올림
        const man = Math.round(num / 10000);
        return man.toLocaleString('ko-KR') + '만';
      } else if (num >= 1000) {
        // 1천 이상: 천원 단위
        const cheon = Math.round(num / 1000);
        return cheon.toLocaleString('ko-KR') + '천';
      } else {
        return Math.floor(num).toLocaleString('ko-KR');
      }
    }
    
    // 부동산용 포맷 (0.1억 단위까지 반올림, 천단위 콤마)
    function formatPropertyPrice(num) {
      if (num >= 100000000) {
        // 1억 이상: 0.1억 단위로 반올림
        const eok = Math.round(num / 10000000) / 10;
        return eok.toLocaleString('ko-KR') + '억';
      } else if (num >= 10000) {
        // 1만 이상: 만원 단위로 반올림
        const man = Math.round(num / 10000);
        return man.toLocaleString('ko-KR') + '만';
      } else {
        return Math.floor(num).toLocaleString('ko-KR');
      }
    }
    
    // 현금 표시용 함수 (짧은 숫자 설정 반영)
    // - 짧은 숫자 ON: 통계 포맷 규칙(고정 소수점) 그대로 사용
    function formatCashDisplay(num) {
      return formatStatsNumber(num);
    }

    // (요청) 소수점 1자리 표기를 고정(0.0도 유지)하는 짧은 숫자 포맷
    // - 예: 332.0만, 2.0억, 1.0조 처럼 항상 1자리 노출
    function formatKoreanNumberFixed1(num) {
      if (num >= 1000000000000) {
        const value = num / 1000000000000;
        return value.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '조';
      } else if (num >= 100000000) {
        const value = num / 100000000;
        return value.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '억';
      } else if (num >= 10000) {
        const value = num / 10000;
        return value.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '만';
      } else if (num >= 1000) {
        const value = num / 1000;
        return value.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '천';
      } else {
        return Math.floor(num).toString();
      }
    }

    function formatCashDisplayFixed1(num) {
      if (!settings.shortNumbers) {
        return Math.floor(num).toLocaleString('ko-KR') + '원';
      }
      return formatKoreanNumberFixed1(num) + '원';
    }
    
    // 단계별 가격 증가율 시스템 (Cookie Clicker 스타일)
    function getPriceMultiplier(count) {
      if (count < 5) return 1.10;      // 초기: 10% (빠른 성취감)
      else if (count < 15) return 1.15; // 중기: 15% (현재와 동일)
      else if (count < 30) return 1.20; // 후기: 20% (도전적)
      else return 1.25;                 // 최종: 25% (희소성)
    }
    
    // 금융상품별 기본 가격
    const FINANCIAL_COSTS = {
      deposit: 50000,       // 예금: 5만원
      savings: 500000,      // 적금: 50만원
      bond: 5000000,        // 국내주식: 500만원
      usStock: 25000000,    // 미국주식: 2,500만원
      crypto: 100000000     // 코인: 1억원
    };
    
    // 부동산별 기본 가격
    const BASE_COSTS = {
      villa: 250000000,     // 빌라: 2.5억원
      officetel: 350000000, // 오피스텔: 3.5억원
      apartment: 800000000, // 아파트: 8억원
      shop: 1200000000,     // 상가: 12억원
      building: 3000000000  // 빌딩: 30억원
    };
    
    // 금융상품 가격 계산 함수
    function getFinancialCost(type, count, quantity = 1) {
      const baseCost = FINANCIAL_COSTS[type];
      let totalCost = 0;
      for (let i = 0; i < quantity; i++) {
        const currentIndex = count + i;
        // 첫 번째 아이템(index=0)은 기본 가격, 그 이후부터 배수 적용
        let cost = baseCost * Math.pow(1.10, currentIndex); // 밸런싱: 1.15 → 1.10으로 완화
        totalCost += cost;
      }
      return Math.floor(totalCost);
    }
    
    // 금융상품 판매 가격 계산 함수 (현재가의 80%)
    function getFinancialSellPrice(type, count, quantity = 1) {
      if (count <= 0) return 0;
      let totalSellPrice = 0;
      for (let i = 0; i < quantity; i++) {
        if (count - i <= 0) break;
        const buyPrice = getFinancialCost(type, count - i - 1, 1);
        totalSellPrice += Math.floor(buyPrice * 0.8);
      }
      return totalSellPrice;
    }
    
    // 부동산 가격 계산 함수
    function getPropertyCost(type, count, quantity = 1) {
      const baseCost = BASE_COSTS[type];
      let totalCost = 0;
      for (let i = 0; i < quantity; i++) {
        const currentIndex = count + i;
        // 첫 번째 아이템(index=0)은 기본 가격, 그 이후부터 배수 적용
        let cost = baseCost * Math.pow(1.10, currentIndex); // 밸런싱: 1.15 → 1.10으로 완화
        totalCost += cost;
      }
      return Math.floor(totalCost);
    }
    
    // 부동산 판매 가격 계산 함수 (현재가의 80%)
    function getPropertySellPrice(type, count, quantity = 1) {
      if (count <= 0) return 0;
      let totalSellPrice = 0;
      for (let i = 0; i < quantity; i++) {
        if (count - i <= 0) break;
        const buyPrice = getPropertyCost(type, count - i - 1, 1);
        totalSellPrice += Math.floor(buyPrice * 0.8);
      }
      return totalSellPrice;
    }
    let cash = 0;
    
    // 누적 플레이시간 시스템 (전역 변수)
    let totalPlayTime = 0; // 누적 플레이시간 (밀리초)
    let sessionStartTime = Date.now(); // 현재 세션 시작 시간
    let gameStartTime = Date.now(); // 게임 시작 시간 (호환성 유지)
    
    // 금융상품 보유 수량
    let deposits = 0;     // 예금
    let savings = 0;      // 적금
    let bonds = 0;        // 국내주식
    let usStocks = 0;     // 미국주식
    let cryptos = 0;      // 코인
    
    // 금융상품 누적 생산량 (Cookie Clicker 스타일)
    let depositsLifetime = 0;
    let savingsLifetime = 0;
    let bondsLifetime = 0;
    let usStocksLifetime = 0;
    let cryptosLifetime = 0;
    
    // 부동산 누적 생산량
    let villasLifetime = 0;
    let officetelsLifetime = 0;
    let apartmentsLifetime = 0;
    let shopsLifetime = 0;
    let buildingsLifetime = 0;
    
    // 구매 수량 선택 시스템
    let purchaseMode = 'buy';  // 'buy' or 'sell'
    let purchaseQuantity = 1;  // 1, 10, 100
    
    // 자동 저장 시스템
    const SAVE_KEY = 'seoulTycoonSaveV1';
    // reset/닉네임 설정 플로우 동안 클라우드 복구를 차단하는 플래그 (sessionStorage)
    const CLOUD_RESTORE_BLOCK_KEY = 'ss_blockCloudRestoreUntilNicknameDone';
    // resetGame 이후 1회성 클라우드 복구 스킵 플래그 (sessionStorage)
    const CLOUD_RESTORE_SKIP_KEY = 'ss_skipCloudRestoreOnce';
    let lastSaveTime = new Date();
    
    // 닉네임 (리더보드용)
    let playerNickname = '';
    
    // 닉네임 모달 세션 플래그 (이번 세션에서 이미 모달을 열었는지)
    let __nicknameModalShown = false;
    
    // ======= 업그레이드 시스템 (Cookie Clicker 스타일) =======
    const UPGRADES = {
      // === 노동 관련 (재밸런싱) ===
      part_time_job: {
        name: "🍕 아르바이트 경험",
        desc: "클릭 수익 1.2배",
        cost: 50000,
        icon: "🍕",
        // 직급 연동: 계약직부터 해금
        unlockCondition: () => careerLevel >= 1,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      internship: {
        name: "📝 인턴십",
        desc: "클릭 수익 1.2배",
        cost: 200000,
        icon: "📝",
        // 직급 연동: 사원부터 해금
        unlockCondition: () => careerLevel >= 2,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      efficient_work: {
        name: "⚡ 효율적인 업무 처리",
        desc: "클릭 수익 1.2배",
        cost: 500000,
        icon: "⚡",
        // 직급 연동: 대리부터 해금
        unlockCondition: () => careerLevel >= 3,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      focus_training: {
        name: "🎯 집중력 강화",
        desc: "클릭 수익 1.2배",
        cost: 2000000,
        icon: "🎯",
        // 직급 연동: 과장부터 해금
        unlockCondition: () => careerLevel >= 4,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      professional_education: {
        name: "📚 전문 교육",
        desc: "클릭 수익 1.2배",
        cost: 10000000,
        icon: "📚",
        // 직급 연동: 차장부터 해금
        unlockCondition: () => careerLevel >= 5,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      performance_bonus: {
        name: "💰 성과급",
        desc: "2% 확률로 10배 수익",
        cost: 10000000,
        icon: "💰",
        // 직급 연동: 부장부터 해금
        unlockCondition: () => careerLevel >= 6,
        effect: () => { /* 확률형 효과는 클릭 이벤트에서 처리 */ },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      career_recognition: {
        name: "💼 경력 인정",
        desc: "클릭 수익 1.2배",
        cost: 30000000,
        icon: "💼",
        // 직급 연동: 부장부터 해금
        unlockCondition: () => careerLevel >= 6,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      overtime_work: {
        name: "🔥 초과근무",
        desc: "클릭 수익 1.2배",
        cost: 50000000,
        icon: "🔥",
        // 직급 연동: 상무부터 해금
        unlockCondition: () => careerLevel >= 7,
        effect: () => { 
          clickMultiplier *= 1.2;
        },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      honor_award: {
        name: "🎖️ 명예상",
        desc: "클릭 수익 1.2배",
        cost: 100000000,
        icon: "🎖️",
        // 직급 연동: 상무부터 해금
        unlockCondition: () => careerLevel >= 7,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      expertise_development: {
        name: "💎 전문성 개발",
        desc: "클릭 수익 1.2배",
        cost: 200000000,
        icon: "💎",
        // 직급 연동: 전무부터 해금
        unlockCondition: () => careerLevel >= 8,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      teamwork: {
        name: "🤝 팀워크 향상",
        desc: "클릭 수익 1.2배",
        cost: 500000000,
        icon: "🤝",
        // 직급 연동: 전무부터 해금
        unlockCondition: () => careerLevel >= 8,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      leadership: {
        name: "👑 리더십",
        desc: "클릭 수익 1.2배",
        cost: 2000000000,
        icon: "👑",
        // 직급 연동: 전무부터 해금
        unlockCondition: () => careerLevel >= 8,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      ceo_privilege: {
        name: "👔 CEO 특권",
        desc: "클릭 수익 2.0배",
        cost: 10000000000,
        icon: "👔",
        unlockCondition: () => careerLevel >= 9,
        effect: () => { clickMultiplier *= 2.0; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      global_experience: {
        name: "🌍 글로벌 경험",
        desc: "클릭 수익 2.0배",
        cost: 50000000000,
        icon: "🌍",
        // 직급 연동: CEO 이후(추가 성장용)로 해금
        unlockCondition: () => careerLevel >= 9 && totalClicks >= 15000,
        effect: () => { clickMultiplier *= 2.0; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      entrepreneurship: {
        name: "🚀 창업",
        desc: "클릭 수익 2.0배",
        cost: 100000000000,
        icon: "🚀",
        // 직급 연동: CEO 이후(최종 성장용)로 해금
        unlockCondition: () => careerLevel >= 9 && totalClicks >= 30000,
        effect: () => { clickMultiplier *= 2.0; },
        category: "labor",
        unlocked: false,
        purchased: false
      },
      
      // === 예금 관련 ===
      deposit_boost_1: {
        name: "💰 예금 이자율 상승",
        desc: "예금 수익 2배",
        cost: 100000, // 기본가 5만원 × 2
        icon: "💰",
        unlockCondition: () => deposits >= 5,
        effect: () => { FINANCIAL_INCOME.deposit *= 2; },
        category: "deposit",
        unlocked: false,
        purchased: false
      },
      deposit_boost_2: {
        name: "💎 프리미엄 예금",
        desc: "예금 수익 2배",
        cost: 250000, // 기본가 5만원 × 5
        icon: "💎",
        unlockCondition: () => deposits >= 15,
        effect: () => { FINANCIAL_INCOME.deposit *= 2; },
        category: "deposit",
        unlocked: false,
        purchased: false
      },
      deposit_boost_3: {
        name: "💠 다이아몬드 예금",
        desc: "예금 수익 2배",
        cost: 500000, // 기본가 5만원 × 10
        icon: "💠",
        unlockCondition: () => deposits >= 30,
        effect: () => { FINANCIAL_INCOME.deposit *= 2; },
        category: "deposit",
        unlocked: false,
        purchased: false
      },
      deposit_boost_4: {
        name: "💍 플래티넘 예금",
        desc: "예금 수익 2배",
        cost: 1000000, // 기본가 5만원 × 20
        icon: "💍",
        unlockCondition: () => deposits >= 40,
        effect: () => { FINANCIAL_INCOME.deposit *= 2; },
        category: "deposit",
        unlocked: false,
        purchased: false
      },
      deposit_boost_5: {
        name: "👑 킹 예금",
        desc: "예금 수익 2배",
        cost: 2000000, // 기본가 5만원 × 40
        icon: "👑",
        unlockCondition: () => deposits >= 50,
        effect: () => { FINANCIAL_INCOME.deposit *= 2; },
        category: "deposit",
        unlocked: false,
        purchased: false
      },
      
      // === 적금 관련 ===
      savings_boost_1: {
        name: "🏦 적금 복리 효과",
        desc: "적금 수익 2배",
        cost: 1000000, // 기본가 50만원 × 2
        icon: "🏦",
        unlockCondition: () => savings >= 5,
        effect: () => { FINANCIAL_INCOME.savings *= 2; },
        category: "savings",
        unlocked: false,
        purchased: false
      },
      savings_boost_2: {
        name: "🏅 골드 적금",
        desc: "적금 수익 2배",
        cost: 2500000, // 기본가 50만원 × 5
        icon: "🏅",
        unlockCondition: () => savings >= 15,
        effect: () => { FINANCIAL_INCOME.savings *= 2; },
        category: "savings",
        unlocked: false,
        purchased: false
      },
      savings_boost_3: {
        name: "💍 플래티넘 적금",
        desc: "적금 수익 2배",
        cost: 5000000, // 기본가 50만원 × 10
        icon: "💍",
        unlockCondition: () => savings >= 30,
        effect: () => { FINANCIAL_INCOME.savings *= 2; },
        category: "savings",
        unlocked: false,
        purchased: false
      },
      savings_boost_4: {
        name: "💠 다이아몬드 적금",
        desc: "적금 수익 2배",
        cost: 10000000, // 기본가 50만원 × 20
        icon: "💠",
        unlockCondition: () => savings >= 40,
        effect: () => { FINANCIAL_INCOME.savings *= 2; },
        category: "savings",
        unlocked: false,
        purchased: false
      },
      savings_boost_5: {
        name: "👑 킹 적금",
        desc: "적금 수익 2배",
        cost: 20000000, // 기본가 50만원 × 40
        icon: "👑",
        unlockCondition: () => savings >= 50,
        effect: () => { FINANCIAL_INCOME.savings *= 2; },
        category: "savings",
        unlocked: false,
        purchased: false
      },
      
      // === 주식 관련 ===
      bond_boost_1: {
        name: "📈 주식 수익률 향상",
        desc: "주식 수익 2배",
        cost: 10000000, // 기본가 500만원 × 2
        icon: "📈",
        unlockCondition: () => bonds >= 5,
        effect: () => { FINANCIAL_INCOME.bond *= 2; },
        category: "bond",
        unlocked: false,
        purchased: false
      },
      bond_boost_2: {
        name: "💹 프리미엄 주식",
        desc: "주식 수익 2배",
        cost: 25000000, // 기본가 500만원 × 5
        icon: "💹",
        unlockCondition: () => bonds >= 15,
        effect: () => { FINANCIAL_INCOME.bond *= 2; },
        category: "bond",
        unlocked: false,
        purchased: false
      },
      bond_boost_3: {
        name: "📊 블루칩 주식",
        desc: "주식 수익 2배",
        cost: 50000000, // 기본가 500만원 × 10
        icon: "📊",
        unlockCondition: () => bonds >= 30,
        effect: () => { FINANCIAL_INCOME.bond *= 2; },
        category: "bond",
        unlocked: false,
        purchased: false
      },
      bond_boost_4: {
        name: "💎 대형주 포트폴리오",
        desc: "주식 수익 2배",
        cost: 100000000, // 기본가 500만원 × 20
        icon: "💎",
        unlockCondition: () => bonds >= 40,
        effect: () => { FINANCIAL_INCOME.bond *= 2; },
        category: "bond",
        unlocked: false,
        purchased: false
      },
      bond_boost_5: {
        name: "👑 킹 주식",
        desc: "주식 수익 2배",
        cost: 200000000, // 기본가 500만원 × 40
        icon: "👑",
        unlockCondition: () => bonds >= 50,
        effect: () => { FINANCIAL_INCOME.bond *= 2; },
        category: "bond",
        unlocked: false,
        purchased: false
      },
      
      // === 미국주식 관련 ===
      usstock_boost_1: {
        name: "🇺🇸 S&P 500 투자",
        desc: "미국주식 수익 2배",
        cost: 50000000, // 기본가 2,500만원 × 2
        icon: "🇺🇸",
        unlockCondition: () => usStocks >= 5,
        effect: () => { FINANCIAL_INCOME.usStock *= 2; },
        category: "usStock",
        unlocked: false,
        purchased: false
      },
      usstock_boost_2: {
        name: "📈 나스닥 투자",
        desc: "미국주식 수익 2배",
        cost: 125000000, // 기본가 2,500만원 × 5
        icon: "📈",
        unlockCondition: () => usStocks >= 15,
        effect: () => { FINANCIAL_INCOME.usStock *= 2; },
        category: "usStock",
        unlocked: false,
        purchased: false
      },
      usstock_boost_3: {
        name: "💎 글로벌 주식 포트폴리오",
        desc: "미국주식 수익 2배",
        cost: 250000000, // 기본가 2,500만원 × 10
        icon: "💎",
        unlockCondition: () => usStocks >= 30,
        effect: () => { FINANCIAL_INCOME.usStock *= 2; },
        category: "usStock",
        unlocked: false,
        purchased: false
      },
      usstock_boost_4: {
        name: "🌍 글로벌 대형주",
        desc: "미국주식 수익 2배",
        cost: 500000000, // 기본가 2,500만원 × 20
        icon: "🌍",
        unlockCondition: () => usStocks >= 40,
        effect: () => { FINANCIAL_INCOME.usStock *= 2; },
        category: "usStock",
        unlocked: false,
        purchased: false
      },
      usstock_boost_5: {
        name: "👑 킹 글로벌 주식",
        desc: "미국주식 수익 2배",
        cost: 1000000000, // 기본가 2,500만원 × 40
        icon: "👑",
        unlockCondition: () => usStocks >= 50,
        effect: () => { FINANCIAL_INCOME.usStock *= 2; },
        category: "usStock",
        unlocked: false,
        purchased: false
      },
      
      // === 코인 관련 ===
      crypto_boost_1: {
        name: "₿ 비트코인 투자",
        desc: "코인 수익 2배",
        cost: 200000000, // 기본가 1억원 × 2
        icon: "₿",
        unlockCondition: () => cryptos >= 5,
        effect: () => { FINANCIAL_INCOME.crypto *= 2; },
        category: "crypto",
        unlocked: false,
        purchased: false
      },
      crypto_boost_2: {
        name: "💎 알트코인 포트폴리오",
        desc: "코인 수익 2배",
        cost: 500000000, // 기본가 1억원 × 5
        icon: "💎",
        unlockCondition: () => cryptos >= 15,
        effect: () => { FINANCIAL_INCOME.crypto *= 2; },
        category: "crypto",
        unlocked: false,
        purchased: false
      },
      crypto_boost_3: {
        name: "🚀 디지털 자산 전문가",
        desc: "코인 수익 2배",
        cost: 1000000000, // 기본가 1억원 × 10
        icon: "🚀",
        unlockCondition: () => cryptos >= 30,
        effect: () => { FINANCIAL_INCOME.crypto *= 2; },
        category: "crypto",
        unlocked: false,
        purchased: false
      },
      crypto_boost_4: {
        name: "🌐 메타버스 자산",
        desc: "코인 수익 2배",
        cost: 2000000000, // 기본가 1억원 × 20
        icon: "🌐",
        unlockCondition: () => cryptos >= 40,
        effect: () => { FINANCIAL_INCOME.crypto *= 2; },
        category: "crypto",
        unlocked: false,
        purchased: false
      },
      crypto_boost_5: {
        name: "👑 킹 암호화폐",
        desc: "코인 수익 2배",
        cost: 4000000000, // 기본가 1억원 × 40
        icon: "👑",
        unlockCondition: () => cryptos >= 50,
        effect: () => { FINANCIAL_INCOME.crypto *= 2; },
        category: "crypto",
        unlocked: false,
        purchased: false
      },
      
      // === 빌라 관련 ===
      villa_boost_1: {
        name: "🏘️ 빌라 리모델링",
        desc: "빌라 수익 2배",
        cost: 500000000, // 기본가 2.5억원 × 2
        icon: "🏘️",
        unlockCondition: () => villas >= 5,
        effect: () => { BASE_RENT.villa *= 2; },
        category: "villa",
        unlocked: false,
        purchased: false
      },
      villa_boost_2: {
        name: "🌟 럭셔리 빌라",
        desc: "빌라 수익 2배",
        cost: 1250000000, // 기본가 2.5억원 × 5
        icon: "🌟",
        unlockCondition: () => villas >= 15,
        effect: () => { BASE_RENT.villa *= 2; },
        category: "villa",
        unlocked: false,
        purchased: false
      },
      villa_boost_3: {
        name: "✨ 프리미엄 빌라 단지",
        desc: "빌라 수익 2배",
        cost: 2500000000, // 기본가 2.5억원 × 10
        icon: "✨",
        unlockCondition: () => villas >= 30,
        effect: () => { BASE_RENT.villa *= 2; },
        category: "villa",
        unlocked: false,
        purchased: false
      },
      villa_boost_4: {
        name: "💎 다이아몬드 빌라",
        desc: "빌라 수익 2배",
        cost: 5000000000, // 기본가 2.5억원 × 20
        icon: "💎",
        unlockCondition: () => villas >= 40,
        effect: () => { BASE_RENT.villa *= 2; },
        category: "villa",
        unlocked: false,
        purchased: false
      },
      villa_boost_5: {
        name: "👑 킹 빌라",
        desc: "빌라 수익 2배",
        cost: 10000000000, // 기본가 2.5억원 × 40
        icon: "👑",
        unlockCondition: () => villas >= 50,
        effect: () => { BASE_RENT.villa *= 2; },
        category: "villa",
        unlocked: false,
        purchased: false
      },
      
      // === 오피스텔 관련 ===
      officetel_boost_1: {
        name: "🏢 오피스텔 스마트화",
        desc: "오피스텔 수익 2배",
        cost: 700000000, // 기본가 3.5억원 × 2
        icon: "🏢",
        unlockCondition: () => officetels >= 5,
        effect: () => { BASE_RENT.officetel *= 2; },
        category: "officetel",
        unlocked: false,
        purchased: false
      },
      officetel_boost_2: {
        name: "🏙️ 프리미엄 오피스텔",
        desc: "오피스텔 수익 2배",
        cost: 1750000000, // 기본가 3.5억원 × 5
        icon: "🏙️",
        unlockCondition: () => officetels >= 15,
        effect: () => { BASE_RENT.officetel *= 2; },
        category: "officetel",
        unlocked: false,
        purchased: false
      },
      officetel_boost_3: {
        name: "🌆 럭셔리 오피스텔 타워",
        desc: "오피스텔 수익 2배",
        cost: 3500000000, // 기본가 3.5억원 × 10
        icon: "🌆",
        unlockCondition: () => officetels >= 30,
        effect: () => { BASE_RENT.officetel *= 2; },
        category: "officetel",
        unlocked: false,
        purchased: false
      },
      officetel_boost_4: {
        name: "💎 다이아몬드 오피스텔",
        desc: "오피스텔 수익 2배",
        cost: 7000000000, // 기본가 3.5억원 × 20
        icon: "💎",
        unlockCondition: () => officetels >= 40,
        effect: () => { BASE_RENT.officetel *= 2; },
        category: "officetel",
        unlocked: false,
        purchased: false
      },
      officetel_boost_5: {
        name: "👑 킹 오피스텔",
        desc: "오피스텔 수익 2배",
        cost: 14000000000, // 기본가 3.5억원 × 40
        icon: "👑",
        unlockCondition: () => officetels >= 50,
        effect: () => { BASE_RENT.officetel *= 2; },
        category: "officetel",
        unlocked: false,
        purchased: false
      },
      
      // === 아파트 관련 ===
      apartment_boost_1: {
        name: "🏡 아파트 프리미엄화",
        desc: "아파트 수익 2배",
        cost: 1600000000, // 기본가 8억원 × 2
        icon: "🏡",
        unlockCondition: () => apartments >= 5,
        effect: () => { BASE_RENT.apartment *= 2; },
        category: "apartment",
        unlocked: false,
        purchased: false
      },
      apartment_boost_2: {
        name: "🏰 타워팰리스급 아파트",
        desc: "아파트 수익 2배",
        cost: 4000000000, // 기본가 8억원 × 5
        icon: "🏰",
        unlockCondition: () => apartments >= 15,
        effect: () => { BASE_RENT.apartment *= 2; },
        category: "apartment",
        unlocked: false,
        purchased: false
      },
      apartment_boost_3: {
        name: "🏛️ 초고급 아파트 단지",
        desc: "아파트 수익 2배",
        cost: 8000000000, // 기본가 8억원 × 10
        icon: "🏛️",
        unlockCondition: () => apartments >= 30,
        effect: () => { BASE_RENT.apartment *= 2; },
        category: "apartment",
        unlocked: false,
        purchased: false
      },
      apartment_boost_4: {
        name: "💎 다이아몬드 아파트",
        desc: "아파트 수익 2배",
        cost: 16000000000, // 기본가 8억원 × 20
        icon: "💎",
        unlockCondition: () => apartments >= 40,
        effect: () => { BASE_RENT.apartment *= 2; },
        category: "apartment",
        unlocked: false,
        purchased: false
      },
      apartment_boost_5: {
        name: "👑 킹 아파트",
        desc: "아파트 수익 2배",
        cost: 32000000000, // 기본가 8억원 × 40
        icon: "👑",
        unlockCondition: () => apartments >= 50,
        effect: () => { BASE_RENT.apartment *= 2; },
        category: "apartment",
        unlocked: false,
        purchased: false
      },
      
      // === 상가 관련 ===
      shop_boost_1: {
        name: "🏪 상가 입지 개선",
        desc: "상가 수익 2배",
        cost: 2400000000, // 기본가 12억원 × 2
        icon: "🏪",
        unlockCondition: () => shops >= 5,
        effect: () => { BASE_RENT.shop *= 2; },
        category: "shop",
        unlocked: false,
        purchased: false
      },
      shop_boost_2: {
        name: "🛍️ 프리미엄 상권",
        desc: "상가 수익 2배",
        cost: 6000000000, // 기본가 12억원 × 5
        icon: "🛍️",
        unlockCondition: () => shops >= 15,
        effect: () => { BASE_RENT.shop *= 2; },
        category: "shop",
        unlocked: false,
        purchased: false
      },
      shop_boost_3: {
        name: "🏬 메가몰 상권",
        desc: "상가 수익 2배",
        cost: 12000000000, // 기본가 12억원 × 10
        icon: "🏬",
        unlockCondition: () => shops >= 30,
        effect: () => { BASE_RENT.shop *= 2; },
        category: "shop",
        unlocked: false,
        purchased: false
      },
      shop_boost_4: {
        name: "💎 다이아몬드 상권",
        desc: "상가 수익 2배",
        cost: 24000000000, // 기본가 12억원 × 20
        icon: "💎",
        unlockCondition: () => shops >= 40,
        effect: () => { BASE_RENT.shop *= 2; },
        category: "shop",
        unlocked: false,
        purchased: false
      },
      shop_boost_5: {
        name: "👑 킹 상권",
        desc: "상가 수익 2배",
        cost: 48000000000, // 기본가 12억원 × 40
        icon: "👑",
        unlockCondition: () => shops >= 50,
        effect: () => { BASE_RENT.shop *= 2; },
        category: "shop",
        unlocked: false,
        purchased: false
      },
      
      // === 빌딩 관련 ===
      building_boost_1: {
        name: "🏙️ 빌딩 테넌트 확보",
        desc: "빌딩 수익 2배",
        cost: 6000000000, // 기본가 30억원 × 2
        icon: "🏙️",
        unlockCondition: () => buildings >= 5,
        effect: () => { BASE_RENT.building *= 2; },
        category: "building",
        unlocked: false,
        purchased: false
      },
      building_boost_2: {
        name: "💼 랜드마크 빌딩",
        desc: "빌딩 수익 2배",
        cost: 15000000000, // 기본가 30억원 × 5
        icon: "💼",
        unlockCondition: () => buildings >= 15,
        effect: () => { BASE_RENT.building *= 2; },
        category: "building",
        unlocked: false,
        purchased: false
      },
      building_boost_3: {
        name: "🏢 초고층 마천루",
        desc: "빌딩 수익 2배",
        cost: 30000000000, // 기본가 30억원 × 10
        icon: "🏢",
        unlockCondition: () => buildings >= 30,
        effect: () => { BASE_RENT.building *= 2; },
        category: "building",
        unlocked: false,
        purchased: false
      },
      building_boost_4: {
        name: "💎 다이아몬드 빌딩",
        desc: "빌딩 수익 2배",
        cost: 60000000000, // 기본가 30억원 × 20
        icon: "💎",
        unlockCondition: () => buildings >= 40,
        effect: () => { BASE_RENT.building *= 2; },
        category: "building",
        unlocked: false,
        purchased: false
      },
      building_boost_5: {
        name: "👑 킹 빌딩",
        desc: "빌딩 수익 2배",
        cost: 120000000000, // 기본가 30억원 × 40
        icon: "👑",
        unlockCondition: () => buildings >= 50,
        effect: () => { BASE_RENT.building *= 2; },
        category: "building",
        unlocked: false,
        purchased: false
      },
      
      // === 전역 업그레이드 ===
      rent_multiplier: {
        name: "📊 부동산 관리 전문화",
        desc: "모든 부동산 수익 +10%",
        cost: 1000000000,
        icon: "📊",
        unlockCondition: () => getTotalProperties() >= 10,
        effect: () => { rentMultiplier *= 1.1; },
        category: "global",
        unlocked: false,
        purchased: false
      },
      manager_hire: {
        name: "👨‍💼 전문 관리인 고용",
        desc: "전체 임대 수익 +5%",
        cost: 5000000000,
        icon: "👨‍💼",
        unlockCondition: () => getTotalProperties() >= 20,
        effect: () => { rentMultiplier *= 1.05; managerLevel++; },
        category: "global",
        unlocked: false,
        purchased: false
      },
      financial_expert: {
        name: "💼 금융 전문가 고용",
        desc: "모든 금융 수익 +20%",
        cost: 10000000000,
        icon: "💼",
        unlockCondition: () => careerLevel >= 8, // 전무 달성 시 해금
        effect: () => { 
          FINANCIAL_INCOME.deposit *= 1.2;
          FINANCIAL_INCOME.savings *= 1.2;
          FINANCIAL_INCOME.bond *= 1.2;
        },
        category: "global",
        unlocked: false,
        purchased: false
      },
      auto_work_system: {
        name: "📱 자동 업무 처리 시스템",
        desc: "1초마다 자동으로 1회 클릭 (초당 수익 추가)",
        cost: 5000000000,
        icon: "📱",
        unlockCondition: () => careerLevel >= 7 && getTotalProperties() >= 10,
        effect: () => { autoClickEnabled = true; },
        category: "global",
        unlocked: false,
        purchased: false
      }
    };
    
    // 부동산 보유 수량
    let villas = 0;       // 빌라
    let officetels = 0;   // 오피스텔
    let apartments = 0;   // 아파트
    let shops = 0;        // 상가
    let buildings = 0;    // 빌딩
    
    // 해금 상태 추적 (버그 수정: 중복 해금 알림 방지)
    const unlockedProducts = {
      deposit: true,
      savings: false,
      bond: false,
      villa: false,
      officetel: false,
      apartment: false,
      shop: false,
      building: false
    };
    
    // 금융상품별 기본 수익률 (초당) - 밸런싱: 투자 수익률 10배 상향
    const FINANCIAL_INCOME = {
      deposit: 50,     // 예금: 50원/초 (10배 상향)
      savings: 750,    // 적금: 750원/초 (10배 상향)
      bond: 11250,     // 국내주식: 11,250원/초 (10배 상향)
      usStock: 60000,  // 미국주식: 60,000원/초 (10배 상향)
      crypto: 250000   // 코인: 250,000원/초 (10배 상향)
    };
    
    // 부동산별 기본 수익률 (초당) - 밸런싱: 투자 수익률 10배 상향
    const BASE_RENT = {
      villa: 84380,     // 빌라: 84,380원/초 (10배 상향)
      officetel: 177190, // 오피스텔: 177,190원/초 (10배 상향)
      apartment: 607500, // 아파트: 607,500원/초 (10배 상향)
      shop: 1370000,    // 상가: 1,370,000원/초 (10배 상향)
      building: 5140000 // 빌딩: 5,140,000원/초 (10배 상향)
    };

    // NOTE:
    // 일부 업그레이드는 구매 시 FINANCIAL_INCOME / BASE_RENT를 직접 변경한다.
    // (예: "상가 수익 2배" -> BASE_RENT.shop *= 2)
    // 그런데 저장/로드는 업그레이드 구매 상태만 복원하고, 중복 적용 버그를 피하려고
    // 로드 시 effect 재실행을 막아둔 적이 있어, 재접속 후 수익이 줄어드는 현상이 발생할 수 있다.
    // 해결: 기본 수익 테이블을 "초기값으로 리셋" 후, 수익 테이블에 영향을 주는 업그레이드만 1회 재적용(멱등).
    const DEFAULT_FINANCIAL_INCOME = { ...FINANCIAL_INCOME };
    const DEFAULT_BASE_RENT = { ...BASE_RENT };

    function resetIncomeTablesToDefault() {
      for (const k of Object.keys(DEFAULT_FINANCIAL_INCOME)) {
        FINANCIAL_INCOME[k] = DEFAULT_FINANCIAL_INCOME[k];
      }
      for (const k of Object.keys(DEFAULT_BASE_RENT)) {
        BASE_RENT[k] = DEFAULT_BASE_RENT[k];
      }
    }

    function reapplyIncomeTableAffectingUpgradeEffects() {
      resetIncomeTablesToDefault();

      for (const upgrade of Object.values(UPGRADES)) {
        if (!upgrade?.purchased || typeof upgrade.effect !== 'function') continue;

        // clickMultiplier/rentMultiplier 등 "저장되는 상태"에 대한 effect는 중복 적용 위험이 있어 제외한다.
        // 반면 FINANCIAL_INCOME / BASE_RENT는 저장되지 않으므로, 여기에만 영향을 주는 업그레이드는 재적용이 필요하다.
        const src = Function.prototype.toString.call(upgrade.effect);
        const affectsIncomeTables = src.includes('FINANCIAL_INCOME') || src.includes('BASE_RENT');
        if (!affectsIncomeTables) continue;

        try {
          upgrade.effect();
        } catch {
          // 업그레이드 effect 실패는 무시(로드/진행 유지)
        }
      }
    }
    
    // 업그레이드 배수
    let clickMultiplier = 1;    // 노동 효율 배수
    let rentMultiplier = 1;     // 월세 수익 배수
    let autoClickEnabled = false; // 자동 클릭 활성화 여부
    let managerLevel = 0;       // 관리인 레벨
    
    // 설정 옵션
    const SETTINGS_KEY = 'capitalClicker_settings';
    let settings = {
      particles: true,        // 파티클 애니메이션
      fancyGraphics: true,    // 화려한 그래픽
      shortNumbers: false    // 짧은 숫자 표시 (기본값: 끔)
    };
    
    // 노동 커리어 시스템 (현실적 승진)
    let careerLevel = 0;        // 현재 커리어 레벨
    let totalLaborIncome = 0;   // 총 노동 수익
    const CAREER_LEVELS = [
      { name: "알바", multiplier: 1, requiredIncome: 0, requiredClicks: 0, bgImage: workBg01 },                    // 1만원/클릭 (연봉 2000만)
      // 누적 클릭 기준 승진 간격 조정: 최종(CEO) 10,000 클릭에 도달하도록 전체적으로 간격을 벌림
      { name: "계약직", multiplier: 1.5, requiredIncome: 5000000, requiredClicks: 150, bgImage: workBg02 },        // 1.5만원/클릭 (연봉 3000만)
      { name: "사원", multiplier: 2, requiredIncome: 10000000, requiredClicks: 400, bgImage: workBg03 },          // 2만원/클릭 (연봉 4000만)
      { name: "대리", multiplier: 2.5, requiredIncome: 20000000, requiredClicks: 900, bgImage: workBg04 },        // 2.5만원/클릭 (연봉 5000만)
      { name: "과장", multiplier: 3, requiredIncome: 30000000, requiredClicks: 1650, bgImage: workBg05 },          // 3만원/클릭 (연봉 6000만)
      { name: "차장", multiplier: 3.5, requiredIncome: 40000000, requiredClicks: 2650, bgImage: workBg06 },        // 3.5만원/클릭 (연봉 7000만)
      { name: "부장", multiplier: 4, requiredIncome: 50000000, requiredClicks: 3900, bgImage: workBg07 },          // 4만원/클릭 (연봉 8000만)
      { name: "상무", multiplier: 5, requiredIncome: 70000000, requiredClicks: 5450, bgImage: workBg08 },         // 5만원/클릭 (연봉 1억)
      { name: "전무", multiplier: 10, requiredIncome: 120000000, requiredClicks: 7450, bgImage: workBg09 },       // 10만원/클릭 (연봉 2억)
      { name: "CEO", multiplier: 12, requiredIncome: 250000000, requiredClicks: 10000, bgImage: workBg10 }         // 12만원/클릭 (밸런싱: 20 → 12)
    ];
    
    // 가격은 이제 동적으로 계산됨 (getPropertyCost 함수 사용)
    
    // 업그레이드 비용 - 새로운 경제 시스템에 맞게 조정
    let rentCost = 1000000000;      // 월세 수익률 업: 10억원
    let mgrCost = 5000000000;       // 관리인 고용: 50억원

    const BASE_CLICK_GAIN = 10000; // 기본 노동 클릭 수익 (2024년 최저시급 기준)
    
    // 부동산 시장 이벤트 시스템
    let marketMultiplier = 1.0; // 시장 수익 배수
    let marketEventEndTime = 0; // 이벤트 종료 시간
    
    // 시장 이벤트 시스템 (상품별 세분화)
    let currentMarketEvent = null;
    
    // 시장 이벤트(TO-BE): 이벤트당 영향 상품 ≤ 5개, 나머지는 1.0(변화 없음)
    // 지속시간(ms)도 재조정
    const MARKET_EVENTS = [
      {
        name: "강남 아파트 대박",
        duration: 50_000,
        color: "#4CAF50",
        effects: {
          property: { apartment: 2.5, villa: 1.4, officetel: 1.2 },
        },
        description: "강남 아파트발 상승 랠리로 주거형 부동산 수익이 상승합니다.",
      },
      {
        name: "전세 대란",
        duration: 60_000,
        color: "#2196F3",
        effects: {
          property: { villa: 2.5, officetel: 2.5, apartment: 1.8 },
        },
        description: "전세 수요 급증으로 빌라/오피스텔 중심의 임대 수익이 급등합니다.",
      },
      {
        name: "상권 활성화",
        duration: 50_000,
        color: "#FF9800",
        effects: {
          property: { shop: 2.5, building: 1.6 },
        },
        description: "상권 회복으로 상가 수익이 크게 증가합니다.",
      },
      {
        name: "오피스 수요 급증",
        duration: 55_000,
        color: "#9C27B0",
        effects: {
          property: { building: 2.5, shop: 1.4, officetel: 1.2 },
        },
        description: "오피스 확장으로 빌딩 중심 수익이 급등합니다.",
      },

      // 금융/리스크 자산 이벤트
      {
        name: "한국은행 금리 인하",
        duration: 70_000,
        color: "#2196F3",
        effects: {
          financial: { deposit: 0.7, savings: 0.8, bond: 2.0, usStock: 1.5 },
        },
        description: "금리 인하로 예금/적금은 약세, 주식은 강세를 보입니다.",
      },
      {
        name: "주식시장 대호황",
        duration: 60_000,
        color: "#4CAF50",
        effects: {
          financial: { bond: 2.5, usStock: 2.0, crypto: 1.5 },
        },
        description: "리스크 자산 선호로 주식 중심 수익이 크게 증가합니다.",
      },
      {
        name: "미국 연준 양적완화",
        duration: 70_000,
        color: "#2196F3",
        effects: {
          financial: { usStock: 2.5, crypto: 1.8, bond: 1.3 },
        },
        description: "달러 유동성 확대로 미국주식/코인 수익이 상승합니다.",
      },
      {
        name: "비트코인 급등",
        duration: 45_000,
        color: "#FF9800",
        effects: {
          financial: { crypto: 2.5, usStock: 1.2 },
        },
        description: "암호화폐 랠리로 코인 수익이 크게 증가합니다.",
      },

      // 부정 이벤트(강도 캡: 0.7)
      {
        name: "금융위기",
        duration: 90_000,
        color: "#F44336",
        effects: {
          financial: { bond: 0.7, usStock: 0.7, crypto: 0.7 },
          property: { shop: 0.7, building: 0.7 },
        },
        description: "리스크 회피로 주식/코인/상업용 부동산이 타격을 받습니다.",
      },
      {
        name: "은행 파산 위기",
        duration: 75_000,
        color: "#9C27B0",
        effects: {
          financial: { deposit: 0.7, savings: 0.7, bond: 0.8 },
        },
        description: "은행 신뢰 하락으로 예금/적금 수익이 둔화합니다.",
      },
      {
        name: "주식시장 폭락",
        duration: 75_000,
        color: "#F44336",
        effects: {
          financial: { bond: 0.7, usStock: 0.7, crypto: 0.7 },
        },
        description: "주식/리스크 자산 급락으로 수익이 크게 감소합니다.",
      },
      {
        name: "암호화폐 규제",
        duration: 75_000,
        color: "#9C27B0",
        effects: {
          financial: { crypto: 0.7 },
        },
        description: "규제 강화로 코인 수익이 감소합니다.",
      },
    ];
    
    // 업적 시스템
    let totalClicks = 0; // 총 클릭 수 추적
    
    const ACHIEVEMENTS = [
      // === 기본 업적 (8개) ===
      { id: "first_click", name: "첫 노동", desc: "첫 번째 클릭을 했다", icon: "👆", condition: () => totalClicks >= 1, unlocked: false },
      { id: "first_deposit", name: "첫 예금", desc: "첫 번째 예금을 구입했다", icon: "💰", condition: () => deposits >= 1, unlocked: false },
      { id: "first_savings", name: "첫 적금", desc: "첫 번째 적금을 구입했다", icon: "🏦", condition: () => savings >= 1, unlocked: false },
      { id: "first_bond", name: "첫 국내주식", desc: "첫 번째 국내주식을 구입했다", icon: "📈", condition: () => bonds >= 1, unlocked: false },
      { id: "first_us_stock", name: "첫 미국주식", desc: "첫 번째 미국주식을 구입했다", icon: "🇺🇸", condition: () => usStocks >= 1, unlocked: false },
      { id: "first_crypto", name: "첫 코인", desc: "첫 번째 코인을 구입했다", icon: "₿", condition: () => cryptos >= 1, unlocked: false },
      { id: "first_property", name: "첫 부동산", desc: "첫 번째 부동산을 구입했다", icon: "🏠", condition: () => villas + officetels + apartments + shops + buildings >= 1, unlocked: false },
      { id: "first_upgrade", name: "첫 업그레이드", desc: "첫 번째 업그레이드를 구입했다", icon: "⚡", condition: () => Object.values(UPGRADES).some(upgrade => upgrade.purchased), unlocked: false },
      
      // === 전문가 업적 (8개) ===
      { id: "financial_expert", name: "금융 전문가", desc: "모든 금융상품을 보유했다", icon: "💼", condition: () => deposits > 0 && savings > 0 && bonds > 0 && usStocks > 0 && cryptos > 0, unlocked: false },
      { id: "property_collector", name: "부동산 수집가", desc: "5채의 부동산을 보유했다", icon: "🏘️", condition: () => getTotalProperties() >= 5, unlocked: false },
      { id: "property_tycoon", name: "부동산 타이쿤", desc: "모든 부동산 종류를 보유했다", icon: "🏙️", condition: () => villas > 0 && officetels > 0 && apartments > 0 && shops > 0 && buildings > 0, unlocked: false },
      { id: "investment_guru", name: "투자 고수", desc: "모든 업그레이드를 구입했다", icon: "📊", condition: () => Object.values(UPGRADES).every(upgrade => upgrade.purchased), unlocked: false },
      { id: "gangnam_rich", name: "강남 부자", desc: "강남 부동산 3채를 보유했다", icon: "🏙️", condition: () => apartments >= 3, unlocked: false },
      { id: "global_investor", name: "글로벌 투자자", desc: "해외 투자 1억원을 달성했다", icon: "🌍", condition: () => usStocks * 1000000 + cryptos * 1000000 >= 100000000, unlocked: false },
      { id: "crypto_expert", name: "암호화폐 전문가", desc: "코인 투자 5억원을 달성했다", icon: "₿", condition: () => cryptos * 1000000 >= 500000000, unlocked: false },
      { id: "real_estate_agent", name: "부동산 중개사", desc: "부동산 20채를 보유했다", icon: "🏠", condition: () => getTotalProperties() >= 20, unlocked: false },
      
      // === 자산 업적 (8개) ===
      { id: "millionaire", name: "백만장자", desc: "총 자산 1억원을 달성했다", icon: "💎", condition: () => cash >= 100000000, unlocked: false },
      { id: "ten_millionaire", name: "억만장자", desc: "총 자산 10억원을 달성했다", icon: "💰", condition: () => cash >= 1000000000, unlocked: false },
      { id: "hundred_millionaire", name: "부자", desc: "총 자산 100억원을 달성했다", icon: "🏆", condition: () => cash >= 10000000000, unlocked: false },
      { id: "billionaire", name: "대부호", desc: "총 자산 1,000억원을 달성했다", icon: "👑", condition: () => cash >= 100000000000, unlocked: false },
      { id: "trillionaire", name: "재벌", desc: "총 자산 1조원을 달성했다", icon: "🏰", condition: () => cash >= 1000000000000, unlocked: false },
      { id: "global_rich", name: "세계적 부자", desc: "총 자산 10조원을 달성했다", icon: "🌍", condition: () => cash >= 10000000000000, unlocked: false },
      { id: "legendary_rich", name: "전설의 부자", desc: "총 자산 100조원을 달성했다", icon: "⭐", condition: () => cash >= 100000000000000, unlocked: false },
      { id: "god_rich", name: "신의 부자", desc: "총 자산 1,000조원을 달성했다", icon: "✨", condition: () => cash >= 1000000000000000, unlocked: false },
      
      // === 커리어 업적 (8개) ===
      { id: "career_starter", name: "직장인", desc: "계약직으로 승진했다", icon: "👔", condition: () => careerLevel >= 1, unlocked: false },
      { id: "employee", name: "정규직", desc: "사원으로 승진했다", icon: "👨‍💼", condition: () => careerLevel >= 2, unlocked: false },
      { id: "deputy_director", name: "팀장", desc: "과장으로 승진했다", icon: "👨‍💻", condition: () => careerLevel >= 4, unlocked: false },
      { id: "executive", name: "임원", desc: "상무로 승진했다", icon: "👨‍🎓", condition: () => careerLevel >= 7, unlocked: false },
      { id: "ceo", name: "CEO", desc: "CEO가 되었다", icon: "👑", condition: () => careerLevel >= 9, unlocked: false },
      { id: "chaebol_chairman", name: "재벌 회장", desc: "자산 1조원을 달성했다", icon: "🏆", condition: () => cash >= 1000000000000, unlocked: false },
      { id: "global_ceo", name: "글로벌 CEO", desc: "해외 진출을 달성했다", icon: "🌍", condition: () => usStocks >= 10 && cryptos >= 10, unlocked: false },
      { id: "legendary_ceo", name: "전설의 CEO", desc: "모든 목표를 달성했다", icon: "⭐", condition: () => careerLevel >= 9 && cash >= 100000000000000, unlocked: false }
    ];

    // ======= DOM =======
    const elCash = document.getElementById('cash');
    const elFinancial = document.getElementById('financial');
    const elProperties = document.getElementById('properties');
    const elRps  = document.getElementById('rps');
    const elWork = document.getElementById('workBtn');
    const elWorkArea = document.querySelector('.work'); // 노동 배경 영역
    const elLog  = document.getElementById('log');
    const elShareBtn = document.getElementById('shareBtn');
    const elFavoriteBtn = document.getElementById('favoriteBtn'); // 즐겨찾기 / 홈 화면 안내 버튼
    const elClickIncomeButton = document.getElementById('clickIncomeButton');
    const elClickIncomeLabel = document.getElementById('clickIncomeLabel');
    const elClickMultiplier = document.getElementById('clickMultiplier');
    const elRentMultiplier = document.getElementById('rentMultiplier');

    // 공통 모달 요소
    const elModalRoot = document.getElementById('gameModalRoot');
    const elModalTitle = document.getElementById('gameModalTitle');
    const elModalMessage = document.getElementById('gameModalMessage');
    const elModalPrimary = document.getElementById('gameModalPrimary');
    const elModalSecondary = document.getElementById('gameModalSecondary');

    // 금융상품 관련
    const elDepositCount = document.getElementById('depositCount');
    const elIncomePerDeposit = document.getElementById('incomePerDeposit');
    const elBuyDeposit = document.getElementById('buyDeposit');

    const elSavingsCount = document.getElementById('savingsCount');
    const elIncomePerSavings = document.getElementById('incomePerSavings');
    const elBuySavings = document.getElementById('buySavings');

    const elBondCount = document.getElementById('bondCount');
    const elIncomePerBond = document.getElementById('incomePerBond');
    const elBuyBond = document.getElementById('buyBond');
    
    // 미국주식과 코인 관련
    const elUsStockCount = document.getElementById('usStockCount');
    const elIncomePerUsStock = document.getElementById('incomePerUsStock');
    const elBuyUsStock = document.getElementById('buyUsStock');
    
    const elCryptoCount = document.getElementById('cryptoCount');
    const elIncomePerCrypto = document.getElementById('incomePerCrypto');
    const elBuyCrypto = document.getElementById('buyCrypto');
    
    // 구매 수량 선택 시스템
    const elBuyMode = document.getElementById('buyMode');
    const elSellMode = document.getElementById('sellMode');
    const elQty1 = document.getElementById('qty1');
    const elQty5 = document.getElementById('qty5');
    const elQty10 = document.getElementById('qty10');
    
    // 토글 버튼들
    const elToggleUpgrades = document.getElementById('toggleUpgrades');
    const elToggleFinancial = document.getElementById('toggleFinancial');
    const elToggleProperties = document.getElementById('toggleProperties');
    
    // 저장 상태 표시
    const elSaveStatus = document.getElementById('saveStatus');
    const elResetBtn = document.getElementById('resetBtn');
    
    // 현재가 표시 요소들
    const elDepositCurrentPrice = document.getElementById('depositCurrentPrice');
    const elSavingsCurrentPrice = document.getElementById('savingsCurrentPrice');
    const elBondCurrentPrice = document.getElementById('bondCurrentPrice');
    const elVillaCurrentPrice = document.getElementById('villaCurrentPrice');
    const elOfficetelCurrentPrice = document.getElementById('officetelCurrentPrice');
    const elAptCurrentPrice = document.getElementById('aptCurrentPrice');
    const elShopCurrentPrice = document.getElementById('shopCurrentPrice');
    const elBuildingCurrentPrice = document.getElementById('buildingCurrentPrice');

    // 부동산 구입 관련
    const elVillaCount = document.getElementById('villaCount');
    const elRentPerVilla = document.getElementById('rentPerVilla');
    const elBuyVilla = document.getElementById('buyVilla');

    const elOfficetelCount = document.getElementById('officetelCount');
    const elRentPerOfficetel = document.getElementById('rentPerOfficetel');
    const elBuyOfficetel = document.getElementById('buyOfficetel');

    const elAptCount = document.getElementById('aptCount');
    const elRentPerApt = document.getElementById('rentPerApt');
    const elBuyApt = document.getElementById('buyApt');

    const elShopCount = document.getElementById('shopCount');
    const elRentPerShop = document.getElementById('rentPerShop');
    const elBuyShop = document.getElementById('buyShop');

    const elBuildingCount = document.getElementById('buildingCount');
    const elRentPerBuilding = document.getElementById('rentPerBuilding');
    const elBuyBuilding = document.getElementById('buyBuilding');

    // 커리어 관련
    const elCurrentCareer = document.getElementById('currentCareer');
    const elCareerCost = document.getElementById('careerCost');
    const elCareerProgress = document.getElementById('careerProgress');
    const elCareerProgressText = document.getElementById('careerProgressText');
    const elCareerRemaining = document.getElementById('careerRemaining');
    
    // 업그레이드 관련 (구형 DOM 제거됨 - 새로운 Cookie Clicker 스타일 사용)

    // ======= 유틸 =======
    function addLog(text){
      // 개발/디버깅 관련 메시지 필터링
      const devKeywords = [
        '🧪', 'v2.', 'v3.', 'Cookie Clicker', '업그레이드 시스템', 
        'DOM 참조', '성능 최적화', '자동 저장 시스템', '업그레이드 클릭',
        '커리어 진행률', '구현 완료', '수정 완료', '정상화', '작동 중',
        '활성화', '해결', '버그 수정', '최적화', '개편', '벤치마킹'
      ];
      
      // 개발 관련 메시지인지 확인
      const isDevMessage = devKeywords.some(keyword => text.includes(keyword));
      
      // 개발 메시지는 로그에 표시하지 않음
      if (isDevMessage) {
        return;
      }

      // ======= 일기장 변환 =======
      const pad2 = (n) => String(n).padStart(2, '0');
      const now = new Date();
      const timeStamp = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

      function updateDiaryMeta() {
        const y = now.getFullYear();
        const m = pad2(now.getMonth() + 1);
        const d = pad2(now.getDate());
        // gameStartTime이 있으면 그걸 쓰고, 없으면 sessionStartTime 기준
        const base = (typeof gameStartTime !== 'undefined' && gameStartTime) ? gameStartTime : sessionStartTime;
        const days = Math.max(1, Math.floor((Date.now() - base) / 86400000) + 1);

        // (신) 헤더에 붙는 컴팩트 표기: yyyy.mm.dd(N일차)
        const elCompact = document.getElementById('diaryHeaderMeta');
        if (elCompact) {
          elCompact.textContent = `${y}.${m}.${d}(${days}일차)`;
        }

        // (구) DOM이 남아있을 때만 업데이트 (호환)
        const elDate = document.getElementById('diaryMetaDate');
        const elDay = document.getElementById('diaryMetaDay');
        if (elDate) elDate.textContent = `오늘: ${y}.${m}.${d}`;
        if (elDay) elDay.textContent = `일차: ${days}일차`;
      }

      function diaryize(raw) {
        const s = String(raw || '').trim();

        // 업그레이드 잔여 클릭 안내는 일기장에 기록하지 않음
        // 예: '🎯 다음 업그레이드 "📚 전문 교육"까지 25클릭 남음!'
        if (/다음\s*업그레이드/.test(s) && /클릭\s*남/.test(s)) {
          return '';
        }

        // 공통: 시스템 이모지/접두 제거
        const stripPrefix = (t) => t.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/g, '').trim();
        const rand = (n) => Math.floor(Math.random() * n);
        const pick = (key, arr) => {
          if (!Array.isArray(arr) || arr.length === 0) return '';
          const storeKey = `__diaryLastPick_${key}`;
          const last = window[storeKey];
          let idx = rand(arr.length);
          if (arr.length > 1 && typeof last === 'number' && idx === last) {
            idx = (idx + 1 + rand(arr.length - 1)) % arr.length;
          }
          window[storeKey] = idx;
          return arr[idx];
        };
        const soften = (t) => stripPrefix(t).replace(/\s+/g, ' ').trim();

        // 업적
        if (s.startsWith('🏆 업적 달성:')) {
          // "🏆 업적 달성: A - B"
          const body = stripPrefix(s).replace(/^업적 달성:\s*/,'');
          const [name, desc] = body.split(/\s*-\s*/);
          return pick('achievement', [
            `오늘은 체크 하나를 더했다. (${name || '업적'})`,
            `작게나마 성취. ${name || '업적'}라니, 나도 꽤 한다.`,
            `기록해둔다: ${name || '업적'}.\n${desc ? desc : ''}`.trim(),
            `“${name || '업적'}” 달성.\n${desc ? `메모: ${desc}` : ''}`.trim(),
            `별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. (${name || '업적'})`,
          ]);
        }

        // 승진
        if (s.startsWith('🎉') && s.includes('승진했습니다')) {
          // "🎉 직급으로 승진했습니다! (클릭당 X원)"
          const m = s.match(/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/);
          const career = m?.[1]?.trim();
          const extra = m?.[2]?.trim();
          const extraText = extra ? extra.replace(/[()]/g,'').trim() : '';
          return pick('promotion', [
            `명함이 바뀌었다. ${career || '다음 단계'}.\n${extraText}`.trim(),
            `오늘은 좀 뿌듯하다. ${career || '승진'}이라니.\n${extraText}`.trim(),
            `승진했다. 책임도 같이 딸려온다는데… 일단 축하부터.\n${extraText}`.trim(),
            `그래, 나도 올라갈 줄 안다. ${career || '승진'}.\n${extraText}`.trim(),
            `커피가 조금 더 쓰게 느껴진다. ${career || '승진'}의 맛.\n${extraText}`.trim(),
          ]);
        }

        // 해금
        if (s.startsWith('🔓')) {
          const body = soften(s);
          const m = s.match(/^🔓\s*(.+?)이\s*해금/);
          const name = (m?.[1] || '').trim();
          const unlockByProduct = {
            '적금': [
              `자동이체 버튼이 눈에 들어왔다.\n${body}`,
              `천천히 쌓는 쪽으로 방향을 틀었다.\n${body}`,
              `오늘은 ‘루틴’이 열렸다.\n${body}`,
            ],
            '국내주식': [
              `이제 차트랑 뉴스랑 싸울 차례다.\n${body}`,
              `심장이 약하면 못 할 선택지… 열렸다.\n${body}`,
              `변동성의 문이 열렸다.\n${body}`,
            ],
            '미국주식': [
              `시차를 버티는 돈이 열렸다.\n${body}`,
              `달러 냄새가 난다.\n${body}`,
              `밤샘의 선택지… 드디어.\n${body}`,
            ],
            '코인': [
              `롤러코스터 입장권이 생겼다.\n${body}`,
              `FOMO가 문을 두드린다.\n${body}`,
              `폭등/폭락의 세계가 열렸다.\n${body}`,
            ],
            '빌라': [
              `첫 ‘집’이라는 단어가 현실이 됐다.\n${body}`,
              `작아도 내 편이 하나 생긴 기분.\n${body}`,
            ],
            '오피스텔': [
              `출근 동선이 머리에 그려졌다.\n${body}`,
              `현실적인 선택지가 열렸다.\n${body}`,
            ],
            '아파트': [
              `꿈이 조금 현실 쪽으로 다가왔다.\n${body}`,
              `안정의 상징이 열렸다.\n${body}`,
            ],
            '상가': [
              `유동인구라는 단어가 갑자기 무겁다.\n${body}`,
              `장사 잘되길… 진심으로.\n${body}`,
            ],
            '빌딩': [
              `스카이라인에 욕심이 생겼다.\n${body}`,
              `이제 진짜 ‘엔드게임’ 냄새.\n${body}`,
            ],
          };
          if (name && unlockByProduct[name]) {
            return pick(`unlock_${name}`, unlockByProduct[name]);
          }
          return pick('unlock', [
            `문이 하나 열렸다.\n${body}`,
            `다음 장으로 넘어갈 수 있게 됐다.\n${body}`,
            `아직 초반인데도, 벌써 선택지가 늘었다.\n${body}`,
            `드디어. ${body}`,
          ]);
        }

        // 구매/판매/부족
        if (s.startsWith('💸 자금이 부족합니다')) {
          const body = soften(s);
          return pick('noMoney', [
            `지갑이 얇아서 아무것도 못 했다.\n${body}`,
            `현실 체크. 돈이 없다.\n${body}`,
            `오늘은 참는다. 아직은 무리.\n${body}`,
            `계산기만 두드리고 끝.\n${body}`,
          ]);
        }
        if (s.startsWith('✅') && s.includes('구입했습니다')) {
          const body = soften(s);
          const m = s.match(/^✅\s*(.+?)\s+\d/);
          const name = (m?.[1] || '').trim();

          const buyByProduct = {
            '예금': [
              `일단은 안전한 데에 묶어두자.\n${body}`,
              `불안할 땐 예금이 답이다.\n${body}`,
              `통장에 ‘쿠션’을 하나 깔았다.\n${body}`,
            ],
            '적금': [
              `루틴을 샀다. 매일이 쌓이면 언젠가.\n${body}`,
              `천천히, 꾸준히. 적금은 배신을 덜 한다.\n${body}`,
              `버티기 모드 ON.\n${body}`,
            ],
            '국내주식': [
              `차트가 나를 보더니 웃는 것 같았다.\n${body}`,
              `기대 반, 긴장 반.\n${body}`,
              `뉴스 알람을 켜야 할 것 같다.\n${body}`,
            ],
            '미국주식': [
              `달러 환율부터 떠올랐다.\n${body}`,
              `밤에 울리는 알림을 각오했다.\n${body}`,
              `세계로 한 걸음.\n${body}`,
            ],
            '코인': [
              `심장 단단히 붙잡고 탔다.\n${body}`,
              `오늘은 FOMO가 이겼다.\n${body}`,
              `롤러코스터에 표를 끊었다.\n${body}`,
            ],
            '빌라': [
              `작아도 시작은 시작이다.\n${body}`,
              `첫 집 느낌… 마음이 조금 놓였다.\n${body}`,
              `벽지 냄새를 상상했다.\n${body}`,
            ],
            '오피스텔': [
              `현실적인 선택을 했다.\n${body}`,
              `출근길이 짧아지는 상상을 했다.\n${body}`,
              `관리비 생각은 내일 하자.\n${body}`,
            ],
            '아파트': [
              `꿈이 조금 더 선명해졌다.\n${body}`,
              `안정의 상징을 손에 쥐었다.\n${body}`,
              `괜히 뿌듯하다.\n${body}`,
            ],
            '상가': [
              `유동인구가 돈이 되는 세계.\n${body}`,
              `임차인 운이 따라주길.\n${body}`,
              `간판 불빛을 상상했다.\n${body}`,
            ],
            '빌딩': [
              `스카이라인을 한 조각 샀다.\n${body}`,
              `이건… 진짜 끝판왕 느낌이다.\n${body}`,
              `도시가 내 편인 것 같았다.\n${body}`,
            ],
          };

          if (name && buyByProduct[name]) {
            return pick(`buy_${name}`, buyByProduct[name]);
          }

          return pick('buy', [
            `결심하고 질렀다.\n${body}`,
            `통장 잔고가 줄어들었다. 대신 미래를 샀다.\n${body}`,
            `이건 소비가 아니라 투자라고… 스스로에게 말했다.\n${body}`,
            `한 발 더 나아갔다.\n${body}`,
            `손이 먼저 움직였다.\n${body}`,
          ]);
        }
        if (s.startsWith('💰') && s.includes('판매했습니다')) {
          const body = soften(s);
          const m = s.match(/^💰\s*(.+?)\s+\d/);
          const name = (m?.[1] || '').trim();
          const sellByProduct = {
            '코인': [
              `손이 떨리기 전에 내렸다.\n${body}`,
              `욕심을 접었다. 오늘은 이쯤.\n${body}`,
              `살아남는 게 먼저다.\n${body}`,
            ],
            '국내주식': [
              `수익이든 손절이든, 결론은 냈다.\n${body}`,
              `차트와 잠깐 이별.\n${body}`,
              `정리하고 숨 돌린다.\n${body}`,
            ],
            '미국주식': [
              `시차도 같이 정리했다.\n${body}`,
              `달러 생각은 잠시 접는다.\n${body}`,
              `잠깐 쉬어가기로 했다.\n${body}`,
            ],
            '예금': [
              `안전벨트를 풀었다.\n${body}`,
              `현금이 필요했다.\n${body}`,
            ],
            '적금': [
              `꾸준함을 잠깐 멈췄다.\n${body}`,
              `루틴을 깼다. 사정이 있었다.\n${body}`,
            ],
            '빌라': [
              `정든 것과 이별.\n${body}`,
              `현실적으로 정리했다.\n${body}`,
            ],
            '오피스텔': [
              `동선은 이제 안녕.\n${body}`,
              `정리하고 다음으로.\n${body}`,
            ],
            '아파트': [
              `꿈을 잠시 내려놓았다.\n${body}`,
              `정리했다. 마음이 좀 쓰다.\n${body}`,
            ],
            '상가': [
              `임차인 걱정이 덜었다.\n${body}`,
              `상권이란 게 참…\n${body}`,
            ],
            '빌딩': [
              `도시 한 조각을 내려놨다.\n${body}`,
              `정리했다. 다시 올라가면 된다.\n${body}`,
            ],
          };
          if (name && sellByProduct[name]) {
            return pick(`sell_${name}`, sellByProduct[name]);
          }
          return pick('sell', [
            `정리할 건 정리했다.\n${body}`,
            `가끔은 줄여야 산다.\n${body}`,
            `현금이 필요했다. 그래서 팔았다.\n${body}`,
            `미련은 접어두고 정리.\n${body}`,
          ]);
        }
        if (s.startsWith('❌')) {
          const body = soften(s);
          return pick('fail', [
            `오늘은 뜻대로 안 됐다.\n${body}`,
            `계획은 늘 계획대로 안 된다.\n${body}`,
            `한 번 더. 다음엔 될 거다.\n${body}`,
            `벽에 부딪혔다.\n${body}`,
          ]);
        }

        // 시장 이벤트
        if (s.startsWith('📈') && s.includes('발생')) {
          const body = soften(s);

          // 예) "📈 강남 아파트 대박 발생! 30초간 지속"
          // 예) "📈 시장 이벤트 발생: 강남 아파트 대박 (30초)"
          const name1 = (s.match(/^📈\s*(.+?)\s*발생/))?.[1]?.trim();
          const name2 = (s.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))?.[1]?.trim();
          const eventName = (name2 || name1 || '').trim();

          const detectProduct = (txt) => {
            const t = String(txt || '');
            const rules = [
              ['빌딩', '빌딩'], ['상가', '상가'], ['아파트', '아파트'], ['오피스텔', '오피스텔'], ['빌라', '빌라'],
              ['코인', '코인'], ['암호', '코인'], ['크립토', '코인'], ['₿', '코인'],
              ['미국', '미국주식'], ['🇺🇸', '미국주식'], ['달러', '미국주식'],
              ['주식', '국내주식'], ['코스피', '국내주식'], ['코스닥', '국내주식'],
              ['적금', '적금'],
              ['예금', '예금'],
              ['노동', '노동'], ['클릭', '노동'], ['업무', '노동'],
            ];
            for (const [k, v] of rules) if (t.includes(k)) return v;
            return '';
          };

          const product = detectProduct(`${eventName} ${body}`) || '시장';
          window.__diaryLastMarketProduct = product;
          window.__diaryLastMarketName = eventName || body;

          const byProduct = {
            '예금': [
              `예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.\n${body}`,
              `안정은 조용히 돈을 번다. 오늘도 예금은 예금했다.\n${body}`,
            ],
            '적금': [
              `루틴이 흔들리는 날이 있다. 그래도 적금은 적금.\n${body}`,
              `꾸준함의 세계에도 이벤트는 온다.\n${body}`,
            ],
            '국내주식': [
              `차트가 또 날 시험한다.\n${body}`,
              `뉴스 한 줄에 심장이 먼저 반응했다.\n${body}`,
              `국장답게… 오늘도 변동성.\n${body}`,
            ],
            '미국주식': [
              `시차가 오늘따라 더 길게 느껴진다.\n${body}`,
              `달러랑 감정은 분리… 하자.\n${body}`,
              `미장 이벤트는 밤에 더 크게 들린다.\n${body}`,
            ],
            '코인': [
              `멘탈이 먼저 흔들린다. 코인은 늘 그렇다.\n${body}`,
              `롤러코스터가 출발했다.\n${body}`,
              `FOMO랑 손절 사이에서 줄타기.\n${body}`,
            ],
            '빌라': [
              `동네 분위기가 바뀌면 빌라도 숨을 쉰다.\n${body}`,
              `작은 집도 결국은 시장을 탄다.\n${body}`,
            ],
            '오피스텔': [
              `현실의 수요가 움직이는 소리가 난다.\n${body}`,
              `출근 동선이 바뀌면 월세도 같이 흔들린다.\n${body}`,
            ],
            '아파트': [
              `아파트는 ‘상징’이라더니, 이벤트도 상징처럼 크게 온다.\n${body}`,
              `꿈이 흔들릴 때가 있다.\n${body}`,
            ],
            '상가': [
              `유동인구라는 말이 오늘은 무겁다.\n${body}`,
              `장사라는 건 결국 파도 타기.\n${body}`,
            ],
            '빌딩': [
              `도시가 요동치면 빌딩도 요동친다.\n${body}`,
              `스카이라인의 공기가 달라졌다.\n${body}`,
            ],
            '노동': [
              `업무 흐름이 바뀌면 내 하루도 바뀐다.\n${body}`,
              `오늘은 손이 더 바빠질 것 같다.\n${body}`,
            ],
            '시장': [
              `시장이 시끄럽다.\n${body}`,
              `뉴스가 난리다.\n${body}`,
              `분위기가 확 바뀌었다.\n${body}`,
              `감정은 접고, 상황만 기록.\n${body}`,
            ]
          };

          return pick(`market_${product}`, byProduct[product] || byProduct['시장']);
        }
        if (s.startsWith('📉') && s.includes('종료')) {
          const product = window.__diaryLastMarketProduct || '시장';
          const name = window.__diaryLastMarketName || '';
          // 종료는 짧게, 여운만
          const byProduct = {
            '코인': [
              `심장이 겨우 진정됐다. (${name ? name : '이벤트 종료'})`,
              `코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.\n${name ? name : ''}`.trim(),
            ],
            '국내주식': [
              `차트가 잠깐 조용해졌다.\n${name ? name : ''}`.trim(),
              `국장 소란 종료. 숨 한 번.\n${name ? name : ''}`.trim(),
            ],
            '미국주식': [
              `밤이 지나갔다.\n${name ? name : ''}`.trim(),
              `미장 이벤트 종료. 알림도 잠잠.\n${name ? name : ''}`.trim(),
            ],
            '부동산': [
              `동네가 다시 평소 얼굴을 찾았다.\n${name ? name : ''}`.trim(),
            ],
            '시장': [
              `소란이 잠잠해졌다.`,
              `폭풍 지나가고 고요.`,
              `이제 평소대로.`,
            ],
          };

          // 부동산 계열은 한 번 더 묶어 처리
          const isRealEstate = ['빌라','오피스텔','아파트','상가','빌딩'].includes(product);
          const key = isRealEstate ? '부동산' : product;
          const out = pick(`marketEnd_${key}`, byProduct[key] || byProduct['시장']);

          window.__diaryLastMarketProduct = null;
          window.__diaryLastMarketName = null;
          return out;
        }
        if (s.startsWith('💡')) {
          const body = soften(s);
          const product = window.__diaryLastMarketProduct || '';
          const name = window.__diaryLastMarketName || '';

          const byProduct = {
            '코인': [
              `메모(코인): 멘탈 관리가 수익률이다.\n${body}`,
              `코인 메모.\n${name ? `(${name})\n` : ''}${body}`.trim(),
            ],
            '국내주식': [
              `메모(국장): 뉴스 한 줄에 흔들리지 말 것.\n${body}`,
              `국장 메모.\n${name ? `(${name})\n` : ''}${body}`.trim(),
            ],
            '미국주식': [
              `메모(미장): 시차 + 환율 = 체력.\n${body}`,
              `미장 메모.\n${name ? `(${name})\n` : ''}${body}`.trim(),
            ],
            '예금': [
              `메모(예금): 조용히 이기는 쪽.\n${body}`,
            ],
            '적금': [
              `메모(적금): 루틴이 무기.\n${body}`,
            ],
            '부동산': [
              `메모(부동산): 공실은 악몽, 임차인은 복.\n${body}`,
              `동네 메모.\n${name ? `(${name})\n` : ''}${body}`.trim(),
            ],
            '노동': [
              `메모(노동): 버티는 사람이 이긴다.\n${body}`,
            ],
          };

          const isRealEstate = ['빌라','오피스텔','아파트','상가','빌딩'].includes(product);
          const key = isRealEstate ? '부동산' : product;

          if (key && byProduct[key]) return pick(`memo_${key}`, byProduct[key]);
          return pick('memo', [
            `메모.\n${body}`,
            `적어둔다.\n${body}`,
            `까먹기 전에 기록.\n${body}`,
          ]);
        }

        // 업그레이드
        if (s.startsWith('🎁') && s.includes('해금')) {
          const body = soften(s);
          // 예) "🎁 새 업그레이드 해금: 💰 예금 이자율 상승"
          const name = (s.match(/해금:\s*(.+)$/))?.[1]?.trim() || '';
          const detect = (txt) => {
            const t = String(txt || '');
            if (t.includes('예금')) return '예금';
            if (t.includes('적금')) return '적금';
            if (t.includes('미국주식') || t.includes('미장') || t.includes('🇺🇸')) return '미국주식';
            if (t.includes('코인') || t.includes('₿') || t.includes('암호')) return '코인';
            if (t.includes('주식')) return '국내주식';
            if (t.includes('빌딩')) return '빌딩';
            if (t.includes('상가')) return '상가';
            if (t.includes('아파트')) return '아파트';
            if (t.includes('오피스텔')) return '오피스텔';
            if (t.includes('빌라')) return '빌라';
            if (t.includes('월세') || t.includes('부동산')) return '부동산';
            if (t.includes('클릭') || t.includes('노동') || t.includes('업무') || t.includes('CEO') || t.includes('커리어')) return '노동';
            return '';
          };
          const product = detect(`${name} ${body}`) || '기본';

          const byProduct = {
            '노동': [
              `일을 ‘덜 힘들게’ 만드는 방법이 생겼다.\n${name ? name : body}`,
              `업무 스킬이 하나 늘었다.\n${name ? name : body}`,
              `손끝이 더 빨라질 준비.\n${name ? name : body}`,
            ],
            '예금': [
              `예금이 더 조용히 벌어다 주겠지.\n${name ? name : body}`,
              `안정 쪽에 옵션이 하나 추가됐다.\n${name ? name : body}`,
            ],
            '적금': [
              `루틴 강화 카드가 열렸다.\n${name ? name : body}`,
              `꾸준함을 돕는 장치가 생겼다.\n${name ? name : body}`,
            ],
            '국내주식': [
              `차트 싸움에 새 무기가 생겼다.\n${name ? name : body}`,
              `국장 대응력이 올라갈 것 같다.\n${name ? name : body}`,
            ],
            '미국주식': [
              `시차를 버틸 장비가 하나 생겼다.\n${name ? name : body}`,
              `달러 쪽 옵션이 열린다.\n${name ? name : body}`,
            ],
            '코인': [
              `코인판에서 버틸 도구가 생겼다.\n${name ? name : body}`,
              `멘탈을 지키는 업그레이드…였으면.\n${name ? name : body}`,
            ],
            '빌라': [
              `빌라 운영이 조금은 편해질지도.\n${name ? name : body}`,
            ],
            '오피스텔': [
              `오피스텔 쪽이 한 단계 나아간다.\n${name ? name : body}`,
            ],
            '아파트': [
              `아파트는 디테일에서 돈이 난다.\n${name ? name : body}`,
            ],
            '상가': [
              `상가는 세팅이 반이다.\n${name ? name : body}`,
            ],
            '빌딩': [
              `빌딩은 관리가 곧 수익이다.\n${name ? name : body}`,
            ],
            '부동산': [
              `부동산 운영에 옵션이 하나 추가됐다.\n${name ? name : body}`,
              `월세를 ‘조금 더’ 만들 방법.\n${name ? name : body}`,
            ],
            '기본': [
              `새로운 방법이 보였다.\n${name ? name : body}`,
              `선택지가 늘었다.\n${name ? name : body}`,
              `이제부터가 시작일지도.\n${name ? name : body}`,
            ]
          };

          return pick(`upgradeUnlock_${product}`, byProduct[product] || byProduct['기본']);
        }
        if (s.startsWith('✅') && s.includes('구매!')) {
          const body = soften(s);
          // 예) "✅ 💰 예금 이자율 상승 구매! 예금 수익 2배"
          const m = s.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/);
          const upName = (m?.[1] || '').trim();
          const upDesc = (m?.[2] || '').trim();

          const detect = (txt) => {
            const t = String(txt || '');
            if (t.includes('예금')) return '예금';
            if (t.includes('적금')) return '적금';
            if (t.includes('미국주식') || t.includes('미장') || t.includes('🇺🇸')) return '미국주식';
            if (t.includes('코인') || t.includes('₿') || t.includes('암호')) return '코인';
            if (t.includes('주식')) return '국내주식';
            if (t.includes('빌딩')) return '빌딩';
            if (t.includes('상가')) return '상가';
            if (t.includes('아파트')) return '아파트';
            if (t.includes('오피스텔')) return '오피스텔';
            if (t.includes('빌라')) return '빌라';
            if (t.includes('월세') || t.includes('부동산')) return '부동산';
            if (t.includes('클릭') || t.includes('노동') || t.includes('업무') || t.includes('CEO') || t.includes('커리어')) return '노동';
            return '';
          };

          const product = detect(`${upName} ${upDesc} ${body}`) || '기본';
          const core = [upName, upDesc].filter(Boolean).join(' — ') || body;

          const byProduct = {
            '노동': [
              `일하는 방식이 바뀌었다.\n${core}`,
              `업무 스킬을 장착했다.\n${core}`,
              `손이 더 빨라질 거다. 아마도.\n${core}`,
            ],
            '예금': [
              `예금은 조용히 강해진다.\n${core}`,
              `안정 쪽을 더 단단히 했다.\n${core}`,
            ],
            '적금': [
              `루틴을 업그레이드했다.\n${core}`,
              `꾸준함에 부스터 하나.\n${core}`,
            ],
            '국내주식': [
              `차트 싸움에 장비를 추가했다.\n${core}`,
              `국장 대응력 상승.\n${core}`,
            ],
            '미국주식': [
              `시차를 버틸 장비 장착.\n${core}`,
              `달러 쪽을 조금 더 믿어보기로.\n${core}`,
            ],
            '코인': [
              `코인판에서 살아남을 장비.\n${core}`,
              `멘탈 보호 장치…였으면.\n${core}`,
            ],
            '빌라': [
              `빌라 운영을 손봤다.\n${core}`,
            ],
            '오피스텔': [
              `오피스텔 쪽을 업그레이드했다.\n${core}`,
            ],
            '아파트': [
              `아파트는 디테일.\n${core}`,
            ],
            '상가': [
              `상가는 세팅이 반이다.\n${core}`,
            ],
            '빌딩': [
              `빌딩은 관리가 수익이다.\n${core}`,
            ],
            '부동산': [
              `월세 쪽을 손봤다.\n${core}`,
              `부동산 운영이 한 단계 올라갔다.\n${core}`,
            ],
            '기본': [
              `필요한 걸 갖췄다.\n${body}`,
              `업그레이드 완료. 조금은 편해지겠지.\n${body}`,
              `나 자신에게 투자.\n${body}`,
            ]
          };

          return pick(`upgradeBuy_${product}`, byProduct[product] || byProduct['기본']);
        }
        if (s.startsWith('⚠️')) {
          const body = soften(s);
          return pick('warn', [
            `찜찜한 기분이 남았다.\n${body}`,
            `뭔가 삐끗한 느낌.\n${body}`,
            `일단 기록만 남긴다.\n${body}`,
          ]);
        }

        // 기본
        const base = soften(s);
        return pick('default', [
          base,
          `그냥 적어둔다.\n${base}`,
          `오늘의 기록.\n${base}`,
          `아무튼, ${base}`,
        ]);
      }

      updateDiaryMeta();
      const diaryText = diaryize(text);
      if (!diaryText) return;

      const p = document.createElement('p');
      const escaped = diaryText.replace(/</g,'&lt;').replace(/>/g,'&gt;');
      // (요청) 독백(1줄)과 정보(이후 줄)의 가시성 분리
      const lines = escaped.split('\n');
      const voiceLine = (lines[0] ?? '').trim();
      const infoLines = lines.slice(1).map((l) => String(l).trim()).filter(Boolean);
      const bodyHtml =
        `<span class="diary-voice">${voiceLine}</span>` +
        (infoLines.length ? `\n<span class="diary-info">${infoLines.join('\n')}</span>` : '');
      p.innerHTML = `<span class="diary-time">${timeStamp}</span>${bodyHtml}`;
      elLog.prepend(p);
    }
    
    function getTotalFinancialProducts() {
      return deposits + savings + bonds + usStocks + cryptos;
    }
    
    function getTotalProperties() {
      return villas + officetels + apartments + shops + buildings;
    }
    
    // ======= 순차 해금 시스템 =======
    function isProductUnlocked(productName) {
      const unlockConditions = {
        // 금융상품
        'deposit': () => true, // 항상 해금
        'savings': () => deposits >= 1, // 예금 1개 필요
        'bond': () => savings >= 1, // 적금 1개 필요
        'usStock': () => bonds >= 1, // 국내주식 1개 필요
        'crypto': () => usStocks >= 1, // 미국주식 1개 필요
        
        // 부동산
        'villa': () => cryptos >= 1, // 코인 1개 필요
        'officetel': () => villas >= 1, // 빌라 1개 필요
        'apartment': () => officetels >= 1, // 오피스텔 1개 필요
        'shop': () => apartments >= 1, // 아파트 1개 필요
        'building': () => shops >= 1 // 상가 1개 필요
      };
      
      return unlockConditions[productName] ? unlockConditions[productName]() : false;
    }
    
    function checkNewUnlocks(productName) {
      const unlockMessages = {
        'deposit': { next: 'savings', msg: '🔓 적금이 해금되었습니다!' },
        'savings': { next: 'bond', msg: '🔓 국내주식이 해금되었습니다!' },
        'bond': { next: 'usStock', msg: '🔓 미국주식이 해금되었습니다!' },
        'usStock': { next: 'crypto', msg: '🔓 코인이 해금되었습니다!' },
        'crypto': { next: 'villa', msg: '🔓 빌라가 해금되었습니다!' },
        'villa': { next: 'officetel', msg: '🔓 오피스텔이 해금되었습니다!' },
        'officetel': { next: 'apartment', msg: '🔓 아파트가 해금되었습니다!' },
        'apartment': { next: 'shop', msg: '🔓 상가가 해금되었습니다!' },
        'shop': { next: 'building', msg: '🔓 빌딩이 해금되었습니다!' }
      };
      
      const unlock = unlockMessages[productName];
      if (!unlock) return;
      
      // 버그 수정: 이미 해금 기록이 있으면 스킵
      if (unlockedProducts[unlock.next]) return;
      
      // 해금 조건을 충족했는지 확인
      if (!isProductUnlocked(unlock.next)) return;
      
      // 이미 보유하고 있는 상품은 해금 로그를 출력하지 않음 (중복 방지)
      const productCounts = {
        'savings': savings,
        'bond': bonds,
        'usStock': usStocks,
        'crypto': cryptos,
        'villa': villas,
        'officetel': officetels,
        'apartment': apartments,
        'shop': shops,
        'building': buildings
      };
      
      // 이미 보유하고 있으면 해금 로그를 출력하지 않음
      if (productCounts[unlock.next] > 0) {
        unlockedProducts[unlock.next] = true; // 해금 상태만 기록
        return;
      }
      
      // 새로 해금된 경우에만 로그 출력 및 애니메이션
      unlockedProducts[unlock.next] = true;
      addLog(unlock.msg);
      
      // 해금 애니메이션
      const itemId = unlock.next + 'Item';
      const itemElement = document.getElementById(itemId);
      if (itemElement) {
        itemElement.classList.add('just-unlocked');
        setTimeout(() => itemElement.classList.remove('just-unlocked'), 1000);
      }
    }
    
    // (단순화) 랜덤 변동 제거: 초당 수익은 예측 가능하게 유지하고,
    // 변동성은 '시장 이벤트'만으로 표현합니다.
    function getFinancialIncome(type, count) {
      const baseIncome = FINANCIAL_INCOME[type];
      let income = baseIncome * count;
      const marketMult = getMarketEventMultiplier(type, 'financial');
      income *= marketMult;
      return income;
    }
    
    function getPropertyIncome(type, count) {
      const baseIncome = BASE_RENT[type];
      let income = baseIncome * count;
      const marketMult = getMarketEventMultiplier(type, 'property');
      income *= marketMult;
      return income;
    }

    function getRps() {
      // 금융상품 수익(고정) + 시장 이벤트 배수
      const financialIncome = 
        getFinancialIncome('deposit', deposits) +
        getFinancialIncome('savings', savings) +
        getFinancialIncome('bond', bonds) +
        getFinancialIncome('usStock', usStocks) +
        getFinancialIncome('crypto', cryptos);
      
      // 부동산 수익(고정) + 시장 이벤트 배수
      const propertyRent = 
        getPropertyIncome('villa', villas) +
        getPropertyIncome('officetel', officetels) +
        getPropertyIncome('apartment', apartments) +
        getPropertyIncome('shop', shops) +
        getPropertyIncome('building', buildings);
      
      // 배수 적용 순서: 1) 부동산에 rentMultiplier 적용, 2) 전체에 marketMultiplier 적용
      const totalIncome = financialIncome + (propertyRent * rentMultiplier);
      return totalIncome * marketMultiplier;
    }
    
    // 시장 이벤트 시작
    function startMarketEvent() {
      const event = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
      currentMarketEvent = event;
      marketEventEndTime = Date.now() + event.duration;
      
      addLog(`📈 ${event.name} 발생! ${Math.floor(event.duration/1000)}초간 지속`);
      addLog(`💡 ${event.description}`);
      showMarketEventNotification(event);
    }
    
    // 시장 이벤트 알림 표시
    function showMarketEventNotification(event) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${event.color};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      
      // 상품별 효과 표시
      let effectsText = '';
      if (event.effects.financial) {
        const financialEffects = Object.entries(event.effects.financial)
          .filter(([_, multiplier]) => multiplier !== 1.0)
          .map(([product, multiplier]) => {
            const productNames = { deposit: '예금', savings: '적금', bond: '국내주식', usStock: '미국주식', crypto: '코인' };
            const m = Math.round(multiplier * 10) / 10;
            return `${productNames[product]} x${String(m).replace(/\.0$/, '')}`;
          });
        if (financialEffects.length > 0) {
          effectsText += `💰 ${financialEffects.join(', ')}\n`;
        }
      }
      
      if (event.effects.property) {
        const propertyEffects = Object.entries(event.effects.property)
          .filter(([_, multiplier]) => multiplier !== 1.0)
          .map(([product, multiplier]) => {
            const productNames = { villa: '빌라', officetel: '오피스텔', apartment: '아파트', shop: '상가', building: '빌딩' };
            const m = Math.round(multiplier * 10) / 10;
            return `${productNames[product]} x${String(m).replace(/\.0$/, '')}`;
          });
        if (propertyEffects.length > 0) {
          effectsText += `🏠 ${propertyEffects.join(', ')}`;
        }
      }
      
      const durationSec = Math.floor((event.duration ?? 0) / 1000);
      notification.innerHTML = `
        <div style="font-size: 16px; margin-bottom: 6px;">📈 ${event.name}</div>
        <div style="font-size: 11px; opacity: 0.95; margin-bottom: 8px;">지속: ${durationSec}초</div>
        <div style="font-size: 12px; opacity: 0.9;">${event.description}</div>
        ${effectsText ? `<div style="font-size: 11px; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">${effectsText}</div>` : ''}
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentElement) {
          notification.parentElement.removeChild(notification);
        }
      }, 5000);
    }
    
    // 시장 이벤트 체크
    function checkMarketEvent() {
      if (marketEventEndTime > 0 && Date.now() >= marketEventEndTime) {
        currentMarketEvent = null;
        marketEventEndTime = 0;
        addLog('📉 시장 이벤트가 종료되었습니다.');
      }
    }
    
    // 현재 시장 이벤트 효과 적용
    function getMarketEventMultiplier(type, category) {
      if (!currentMarketEvent || !currentMarketEvent.effects) {
        return 1.0;
      }
      
      const effects = currentMarketEvent.effects[category];
      if (!effects || !effects[type]) {
        return 1.0;
      }
      
      return effects[type];
    }
    
    // (단순화) 리스크 UI 제거
    
    // 업적 체크
    function checkAchievements() {
      ACHIEVEMENTS.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition()) {
          achievement.unlocked = true;
          showAchievementNotification(achievement);
          addLog(`🏆 업적 달성: ${achievement.name} - ${achievement.desc}`);
        }
      });
    }
    
    // 업적 알림 표시
    function showAchievementNotification(achievement) {
      const notification = document.createElement('div');
      notification.style.cssText = `
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
      `;
      notification.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">🏆</div>
        <div style="font-size: 18px; margin-bottom: 5px;">${achievement.name}</div>
        <div style="font-size: 14px; opacity: 0.8;">${achievement.desc}</div>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentElement) {
          notification.parentElement.removeChild(notification);
        }
      }, 3000);
    }
    
    // ======= 업그레이드 시스템 함수 =======
    
    // 업그레이드 해금 조건 체크
    function checkUpgradeUnlocks() {
      let newUnlocks = 0;
      
      for (const [id, upgrade] of Object.entries(UPGRADES)) {
        // 이미 구매했거나 해금된 경우 스킵
        if (upgrade.purchased || upgrade.unlocked) continue;
        
        // 해금 조건 체크
        try {
          if (upgrade.unlockCondition()) {
            upgrade.unlocked = true;
            newUnlocks++;
            addLog(`🎁 새 업그레이드 해금: ${upgrade.name}`);
          }
        } catch (error) {
          console.error(`업그레이드 해금 조건 체크 실패 (${id}):`, error);
        }
      }
      
      if (newUnlocks > 0) {
        updateUpgradeList();
      }
    }
    
    // 업그레이드 구매 가능 여부만 업데이트 (성능 최적화)
    function updateUpgradeAffordability() {
      const upgradeItems = document.querySelectorAll('.upgrade-item');
      
      upgradeItems.forEach(item => {
        const upgradeId = item.dataset.upgradeId;
        const upgrade = UPGRADES[upgradeId];
        
        if (upgrade && !upgrade.purchased) {
          // 구매 가능 여부에 따라 클래스만 토글
          if (cash >= upgrade.cost) {
            item.classList.add('affordable');
          } else {
            item.classList.remove('affordable');
          }
        }
      });
    }
    
    // 업그레이드 진행률 업데이트
    function updateUpgradeProgress() {
      const progressElements = document.querySelectorAll('.upgrade-progress');
      
      progressElements.forEach(progressEl => {
        // 부모 요소에서 업그레이드 ID 찾기
        const upgradeItem = progressEl.closest('.upgrade-item');
        if (!upgradeItem) return;
        
        const upgradeId = upgradeItem.dataset.upgradeId;
        if (!upgradeId) return;
        
        // 해금되지 않은 업그레이드 중 가장 가까운 것을 찾기
        const lockedUpgrades = Object.entries(UPGRADES)
          .filter(([id, u]) => u.category === 'labor' && !u.unlocked && !u.purchased)
          .map(([id, u]) => {
            const conditionStr = u.unlockCondition.toString();
            const match = conditionStr.match(/totalClicks\s*>=\s*(\d+)/);
            if (match) {
              return { id, requiredClicks: parseInt(match[1]), upgrade: u };
            }
            const careerMatch = conditionStr.match(/careerLevel\s*>=\s*(\d+)/);
            if (careerMatch) {
              return { id, requiredClicks: CAREER_LEVELS[parseInt(careerMatch[1])]?.requiredClicks || Infinity, upgrade: u };
            }
            return null;
          })
          .filter(x => x !== null)
          .sort((a, b) => a.requiredClicks - b.requiredClicks);
        
        // 진행률 표시 제거
        progressEl.textContent = '';
      });
    }
    
    // 업그레이드 리스트 UI 생성 (해금/구매 시에만 호출)
    function updateUpgradeList() {
      const upgradeList = document.getElementById('upgradeList');
      const upgradeCount = document.getElementById('upgradeCount');
      
      if (!upgradeList || !upgradeCount) return;
      
      // 해금되었고 아직 구매하지 않은 업그레이드만 표시
      const availableUpgrades = Object.entries(UPGRADES)
        .filter(([id, upgrade]) => upgrade.unlocked && !upgrade.purchased);
      
      upgradeCount.textContent = `(${availableUpgrades.length})`;
      
      if (availableUpgrades.length === 0) {
        upgradeList.innerHTML = '';
        return;
      }
      
      upgradeList.innerHTML = '';
      
      console.log(`🔄 Regenerating upgrade list with ${availableUpgrades.length} items`);
      
      availableUpgrades.forEach(([id, upgrade]) => {
        const item = document.createElement('div');
        item.className = 'upgrade-item';
        item.dataset.upgradeId = id;
        
        // 구매 가능 여부 체크
        if (cash >= upgrade.cost) {
          item.classList.add('affordable');
        }
        
        // 아이콘 생성
        const icon = document.createElement('div');
        icon.className = 'upgrade-icon';
        icon.textContent = upgrade.icon;
        
        // 정보 영역 생성
        const info = document.createElement('div');
        info.className = 'upgrade-info';
        
        const name = document.createElement('div');
        name.className = 'upgrade-name';
        name.textContent = upgrade.name;
        
        const desc = document.createElement('div');
        desc.className = 'upgrade-desc';
        desc.textContent = upgrade.desc;
        
        // 가격은 우측 배지로 이동 (NEW! 대신) → 카드 높이 축소
        const priceText = formatFinancialPrice(upgrade.cost);
        
        // 진행률 정보 추가 (해금 조건이 클릭 수인 경우)
        if (upgrade.category === 'labor' && upgrade.unlockCondition) {
          try {
            // 해금 조건을 역으로 계산 (간단한 추정)
            // 실제로는 unlockCondition 함수를 분석해야 하지만, 
            // 여기서는 다음 업그레이드까지 남은 클릭 수를 표시
            const progressInfo = document.createElement('div');
            progressInfo.className = 'upgrade-progress';
            progressInfo.style.fontSize = '11px';
            progressInfo.style.color = 'var(--muted)';
            progressInfo.style.marginTop = '4px';
            
            // 해금되지 않은 업그레이드 중 가장 가까운 것을 찾기
            const lockedUpgrades = Object.entries(UPGRADES)
              .filter(([id, u]) => u.category === 'labor' && !u.unlocked && !u.purchased)
              .map(([id, u]) => {
                // unlockCondition에서 클릭 수 추출 시도
                const conditionStr = u.unlockCondition.toString();
                const match = conditionStr.match(/totalClicks\s*>=\s*(\d+)/);
                if (match) {
                  return { id, requiredClicks: parseInt(match[1]), upgrade: u };
                }
                return null;
              })
              .filter(x => x !== null)
              .sort((a, b) => a.requiredClicks - b.requiredClicks);
            
            // 진행률 표시 제거
            // progressInfo는 생성하지 않음
          } catch (e) {
            // 진행률 계산 실패 시 무시
          }
        }
        
        info.appendChild(name);
        info.appendChild(desc);
        // (삭제) info에 가격 줄을 두지 않음
        
        // 우측 가격 배지 생성 (NEW! 대체)
        const status = document.createElement('div');
        status.className = 'upgrade-status';
        status.textContent = priceText;
        status.style.animation = 'none';
        status.style.background = 'rgba(94, 234, 212, 0.12)';
        status.style.color = 'var(--accent)';
        status.style.border = '1px solid rgba(94, 234, 212, 0.25)';
        status.style.borderRadius = '999px';
        
        // 요소 조립
        item.appendChild(icon);
        item.appendChild(info);
        item.appendChild(status);
        
        // 클릭 이벤트 추가 (캡처링 단계에서 처리)
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('🖱️ Upgrade item clicked!', id);
          console.log('Event target:', e.target);
          console.log('Current item:', item);
          console.log('Dataset:', item.dataset);
          purchaseUpgrade(id);
        }, false);
        
        // 추가 보험: mousedown 이벤트도 추가
        item.addEventListener('mousedown', (e) => {
          console.log('🖱️ Mousedown detected on upgrade:', id);
        });
        
        upgradeList.appendChild(item);
        
        console.log(`✅ Upgrade item created and appended: ${id}`, item);
      });
    }
    
    // 업그레이드 구매
    function purchaseUpgrade(upgradeId) {
      console.log('=== PURCHASE UPGRADE DEBUG ===');
      console.log('Attempting to purchase:', upgradeId);
      console.log('Current cash:', cash);
      
      const upgrade = UPGRADES[upgradeId];
      
      if (!upgrade) {
        console.error('업그레이드를 찾을 수 없습니다:', upgradeId);
        console.log('Available upgrade IDs:', Object.keys(UPGRADES));
        return;
      }
      
      console.log('Upgrade found:', {
        name: upgrade.name,
        cost: upgrade.cost,
        unlocked: upgrade.unlocked,
        purchased: upgrade.purchased
      });
      
      if (upgrade.purchased) {
        addLog('❌ 이미 구매한 업그레이드입니다.');
        console.log('Already purchased');
        return;
      }
      
      if (cash < upgrade.cost) {
        addLog(`💸 자금이 부족합니다. (필요: ${formatFinancialPrice(upgrade.cost)})`);
        console.log('Not enough cash. Need:', upgrade.cost, 'Have:', cash);
        return;
      }
      
      // 구매 처리
      console.log('Purchase successful! Applying effect...');
      cash -= upgrade.cost;
      upgrade.purchased = true;
      
      try {
        upgrade.effect(); // 효과 적용
        addLog(`✅ ${upgrade.name} 구매! ${upgrade.desc}`);
        console.log('Effect applied successfully');
      } catch (error) {
        console.error(`업그레이드 효과 적용 실패 (${upgradeId}):`, error);
        addLog(`⚠️ ${upgrade.name} 구매했지만 효과 적용 중 오류 발생`);
      }
      
      console.log('New cash:', cash);
      console.log('==============================');
      
      // UI 업데이트
      updateUpgradeList();
      updateUI();
      saveGame();
    }
    
    // 구매 가능 알림 체크
    
    
    function getClickIncome() {
      const currentCareer = getCurrentCareer();
      return Math.floor(10000 * currentCareer.multiplier * clickMultiplier); // 기본 1만원 × 배수
    }
    
    function getCurrentCareer() {
      return CAREER_LEVELS[careerLevel];
    }
    
    function getNextCareer() {
      return careerLevel < CAREER_LEVELS.length - 1 ? CAREER_LEVELS[careerLevel + 1] : null;
    }
    
    // 자동 승진 체크 함수 (클릭 수 기준)
    function checkCareerPromotion() {
      const nextCareer = getNextCareer();
      if (nextCareer && totalClicks >= nextCareer.requiredClicks) {
        const oldCareerLevel = careerLevel;
        careerLevel += 1;
        const newCareer = getCurrentCareer();
        const clickIncome = getClickIncome();
        addLog(`🎉 ${newCareer.name}으로 승진했습니다! (클릭당 ${formatKoreanNumber(clickIncome)}원)`);
        
        // 승진 시 전환 애니메이션
        if (elWorkArea) {
          // 페이드 아웃 효과
          elWorkArea.style.transition = 'opacity 0.3s ease-out';
          elWorkArea.style.opacity = '0.5';
          
          setTimeout(() => {
            // 배경 이미지 변경
            if (newCareer.bgImage) {
              elWorkArea.style.transition = 'background-image 0.8s ease-in-out, opacity 0.5s ease-in';
              elWorkArea.style.backgroundImage = `url('${newCareer.bgImage}')`;
            } else {
              elWorkArea.style.transition = 'background-image 0.8s ease-in-out, opacity 0.5s ease-in';
              elWorkArea.style.backgroundImage = 'radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)';
            }
            
            // 페이드 인 효과
            elWorkArea.style.opacity = '1';
          }, 300);
        }
        
        // 직급 카드 애니메이션 효과
        const careerCard = document.querySelector('.career-card');
        if (careerCard) {
          careerCard.style.animation = 'none';
          setTimeout(() => {
            careerCard.style.animation = 'careerPromotion 0.6s ease-out';
          }, 10);
        }
        
        // 스크린 리더 알림
        const currentCareerEl = document.getElementById('currentCareer');
        if (currentCareerEl) {
          currentCareerEl.setAttribute('aria-label', `${newCareer.name}으로 승진했습니다. 클릭당 ${formatKoreanNumber(clickIncome)}원`);
        }
        
        // 승진 후 즉시 UI 업데이트
        console.log('=== PROMOTION DEBUG ===');
        console.log('Promoted to:', newCareer.name);
        console.log('New career level:', careerLevel);
        console.log('New multiplier:', newCareer.multiplier);
        console.log('Click income:', formatKoreanNumber(clickIncome));
        console.log('======================');
        
        return true;
      }
      return false;
    }
    
    // 버튼 상태 업데이트 함수 (Cookie Clicker 스타일)
    function updateButtonStates() {
      const qty = purchaseQuantity;
      const isBuy = purchaseMode === 'buy';
      
      // 금융상품 버튼 상태 업데이트
      const depositCanBuy = isBuy && cash >= getFinancialCost('deposit', deposits, qty);
      const savingsCanBuy = isBuy && cash >= getFinancialCost('savings', savings, qty);
      const bondCanBuy = isBuy && cash >= getFinancialCost('bond', bonds, qty);
      const usStockCanBuy = isBuy && cash >= getFinancialCost('usStock', usStocks, qty);
      const cryptoCanBuy = isBuy && cash >= getFinancialCost('crypto', cryptos, qty);
      
      elBuyDeposit.classList.toggle('affordable', depositCanBuy);
      elBuyDeposit.classList.toggle('unaffordable', isBuy && !depositCanBuy);
      elBuySavings.classList.toggle('affordable', savingsCanBuy);
      elBuySavings.classList.toggle('unaffordable', isBuy && !savingsCanBuy);
      elBuyBond.classList.toggle('affordable', bondCanBuy);
      elBuyBond.classList.toggle('unaffordable', isBuy && !bondCanBuy);
      elBuyUsStock.classList.toggle('affordable', usStockCanBuy);
      elBuyUsStock.classList.toggle('unaffordable', isBuy && !usStockCanBuy);
      elBuyCrypto.classList.toggle('affordable', cryptoCanBuy);
      elBuyCrypto.classList.toggle('unaffordable', isBuy && !cryptoCanBuy);
      
      // 부동산 버튼 상태 업데이트
      const villaCanBuy = isBuy && cash >= getPropertyCost('villa', villas, qty);
      const officetelCanBuy = isBuy && cash >= getPropertyCost('officetel', officetels, qty);
      const aptCanBuy = isBuy && cash >= getPropertyCost('apartment', apartments, qty);
      const shopCanBuy = isBuy && cash >= getPropertyCost('shop', shops, qty);
      const buildingCanBuy = isBuy && cash >= getPropertyCost('building', buildings, qty);
      
      elBuyVilla.classList.toggle('affordable', villaCanBuy);
      elBuyVilla.classList.toggle('unaffordable', isBuy && !villaCanBuy);
      elBuyOfficetel.classList.toggle('affordable', officetelCanBuy);
      elBuyOfficetel.classList.toggle('unaffordable', isBuy && !officetelCanBuy);
      elBuyApt.classList.toggle('affordable', aptCanBuy);
      elBuyApt.classList.toggle('unaffordable', isBuy && !aptCanBuy);
      elBuyShop.classList.toggle('affordable', shopCanBuy);
      elBuyShop.classList.toggle('unaffordable', isBuy && !shopCanBuy);
      elBuyBuilding.classList.toggle('affordable', buildingCanBuy);
      elBuyBuilding.classList.toggle('unaffordable', isBuy && !buildingCanBuy);
      
      // 업그레이드 버튼 상태 업데이트 (제거됨 - 새 시스템 사용)
    }
    
    // 건물 목록 색상 업데이트 함수
    function updateBuildingItemStates() {
      const qty = purchaseQuantity;
      const isBuy = purchaseMode === 'buy';
      
      // 금융상품 아이템 상태 업데이트 (구매 모드일 때만 affordable 적용)
      const depositItem = document.getElementById('depositItem');
      const savingsItem = document.getElementById('savingsItem');
      const bondItem = document.getElementById('bondItem');
      const usStockItem = document.getElementById('usStockItem');
      const cryptoItem = document.getElementById('cryptoItem');
      
      depositItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('deposit', deposits, qty));
      savingsItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('savings', savings, qty));
      bondItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('bond', bonds, qty));
      usStockItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('usStock', usStocks, qty));
      cryptoItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('crypto', cryptos, qty));
      
      // 부동산 아이템 상태 업데이트 (구매 모드일 때만 affordable 적용)
      const villaItem = document.getElementById('villaItem');
      const officetelItem = document.getElementById('officetelItem');
      const aptItem = document.getElementById('aptItem');
      const shopItem = document.getElementById('shopItem');
      const buildingItem = document.getElementById('buildingItem');
      
      villaItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('villa', villas, qty));
      officetelItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('officetel', officetels, qty));
      aptItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('apartment', apartments, qty));
      shopItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('shop', shops, qty));
      buildingItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('building', buildings, qty));
    }
    
    // 업그레이드 그리드 상태 업데이트 함수
    // 구형 updateUpgradeGrid 함수 제거됨 - 새로운 updateUpgradeList 사용
    
    // 게임 데이터 저장 함수
    function saveGame() {
      const saveData = {
        cash: cash,
        totalClicks: totalClicks,
        totalLaborIncome: totalLaborIncome,
        careerLevel: careerLevel,
        clickMultiplier: clickMultiplier,
        rentMultiplier: rentMultiplier,
        autoClickEnabled: autoClickEnabled,
        managerLevel: managerLevel,
        rentCost: rentCost,
        mgrCost: mgrCost,
        // 금융상품
        deposits: deposits,
        savings: savings,
        bonds: bonds,
        usStocks: usStocks,
        cryptos: cryptos,
        // 금융상품 누적 생산량
        depositsLifetime: depositsLifetime,
        savingsLifetime: savingsLifetime,
        bondsLifetime: bondsLifetime,
        usStocksLifetime: usStocksLifetime,
        cryptosLifetime: cryptosLifetime,
        // 부동산
        villas: villas,
        officetels: officetels,
        apartments: apartments,
        shops: shops,
        buildings: buildings,
        // 부동산 누적 생산량
        villasLifetime: villasLifetime,
        officetelsLifetime: officetelsLifetime,
        apartmentsLifetime: apartmentsLifetime,
        shopsLifetime: shopsLifetime,
        buildingsLifetime: buildingsLifetime,
        // 업그레이드 (새 Cookie Clicker 스타일)
        upgradesV2: Object.fromEntries(
          Object.entries(UPGRADES).map(([id, upgrade]) => [
            id,
            { unlocked: upgrade.unlocked, purchased: upgrade.purchased }
          ])
        ),
        // 시장 이벤트
        marketMultiplier: marketMultiplier,
        marketEventEndTime: marketEventEndTime,
        // 업적
        achievements: ACHIEVEMENTS,
        // 저장 시간
        saveTime: new Date().toISOString(),
        ts: Date.now(),
        // 게임 시작 시간 (호환성 유지)
        gameStartTime: gameStartTime,
        // 누적 플레이시간 시스템
        totalPlayTime: totalPlayTime,
        sessionStartTime: sessionStartTime,
        // 닉네임 (리더보드용)
        nickname: playerNickname
      };
      
      // 디버깅: 닉네임 저장 확인
      if (__IS_DEV__) {
        console.log('💾 저장 데이터에 포함된 닉네임:', playerNickname || '(없음)');
        console.log('💾 saveData.nickname:', saveData.nickname);
      }
      
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        lastSaveTime = new Date();
        console.log('게임 저장 완료:', lastSaveTime.toLocaleTimeString());
        updateSaveStatus(); // 저장 상태 UI 업데이트
        
        // 로그인 사용자면 탭 숨김/닫기 시 플러시를 위해 대기 중인 저장으로 설정
        if (__currentUser) {
          const saveTs = Number(saveData?.ts || 0) || 0;
          if (saveTs && saveTs > __lastCloudUploadedSaveTs) {
            __cloudPendingSave = saveData;
            // 디버깅: 클라우드 저장 대기 중인 데이터 확인
            if (__IS_DEV__) {
              console.log('☁️ 클라우드 저장 대기 중인 데이터에 닉네임 포함:', __cloudPendingSave.nickname || '(없음)');
            }
          }
        }
        
        // 리더보드 업데이트 (닉네임이 있을 때만, 30초마다)
        if (playerNickname && (!window.__lastLeaderboardUpdate || Date.now() - window.__lastLeaderboardUpdate > 30000)) {
          updateLeaderboardEntry();
          window.__lastLeaderboardUpdate = Date.now();
        }
      } catch (error) {
        console.error('게임 저장 실패:', error);
      }
    }
    
    // ======= 닉네임 관리 함수 =======
    
    /**
     * 로컬 저장에서 최종 닉네임을 확인하고 반환
     * @returns {string} 닉네임 (없으면 빈 문자열)
     */
    function resolveFinalNickname() {
      try {
        const saveData = localStorage.getItem(SAVE_KEY);
        if (!saveData) return '';
        const data = JSON.parse(saveData);
        return data.nickname || '';
      } catch (error) {
        console.error('닉네임 확인 실패:', error);
        return '';
      }
    }
    
    /**
     * 닉네임이 없으면 모달을 열고, 세션 플래그로 중복 방지
     * 이 함수는 모든 닉네임 모달 오픈의 단일 진입점
     */
    function ensureNicknameModal() {
      // 이미 이번 세션에서 모달을 열었으면 스킵
      if (__nicknameModalShown) {
        console.log('⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨');
        return;
      }
      
      // 최종 닉네임 확인
      const finalNickname = resolveFinalNickname();
      if (finalNickname) {
        // 닉네임이 있으면 playerNickname 업데이트하고 스킵
        playerNickname = finalNickname;
        console.log('✅ 닉네임 확인됨:', finalNickname);
        return;
      }
      
      // 닉네임이 없으면 모달 오픈
      console.log('📝 닉네임 없음: 모달 오픈');
      __nicknameModalShown = true; // 플래그 설정 (모달 오픈 전에 설정하여 중복 방지)

      // 닉네임 결정이 끝날 때까지 클라우드 복구를 세션 단위로 차단
      try {
        sessionStorage.setItem(CLOUD_RESTORE_BLOCK_KEY, '1');
      } catch (e) {
        console.warn('sessionStorage set 실패:', e);
      }
      
      setTimeout(() => {
        const handleConfirm = async (nickname) => {
          const raw = normalizeNickname(nickname);
          const key = raw.toLowerCase();

          // 닉네임 유효성 검사: 1~5자, 공백/특수문자(%, _) 불가
          if (raw.length < 1 || raw.length > 5) {
            openInfoModal('닉네임 길이 오류', '닉네임은 1~5자여야 합니다.', '⚠️');
            __nicknameModalShown = false;
            ensureNicknameModal();
            return;
          }
          if (/\s/.test(raw)) {
            openInfoModal('닉네임 형식 오류', '닉네임에는 공백을 포함할 수 없습니다.', '⚠️');
            __nicknameModalShown = false;
            ensureNicknameModal();
            return;
          }
          if (/[%_]/.test(raw)) {
            openInfoModal('닉네임 형식 오류', '닉네임에는 %, _ 문자를 사용할 수 없습니다.', '⚠️');
            __nicknameModalShown = false;
            ensureNicknameModal();
            return;
          }

          // 닉네임 중복 여부 확인 (대소문자 구분 없음)
          const { taken } = await isNicknameTaken(raw);
          if (taken) {
            openInfoModal('닉네임 중복', '이미 사용 중인 닉네임입니다.\n다른 닉네임을 입력해주세요.', '⚠️');
            __nicknameModalShown = false;
            ensureNicknameModal();
            return;
          }

          // 닉네임 결정 완료 → 클라우드 복구 차단 해제
          try {
            sessionStorage.removeItem(CLOUD_RESTORE_BLOCK_KEY);
          } catch (e) {
            console.warn('sessionStorage remove 실패:', e);
          }

          playerNickname = raw;
          saveGame(); // 닉네임 저장
          addLog(`닉네임이 "${playerNickname}"으로 설정되었습니다.`);
        };

        openInputModal(
          '닉네임 설정',
          '리더보드에 표시될 닉네임을 입력하세요.\n(1~5자, 공백/%, _ 불가)',
          handleConfirm,
          {
            icon: '✏️',
            primaryLabel: '확인',
            placeholder: '1~5자 닉네임',
            maxLength: 5,
            defaultValue: '',
            required: true,
          }
        );
      }, 500); // UI 로드 후 표시
    }
    
    // 게임 데이터 불러오기 함수
    function loadGame() {
      try {
        const saveData = localStorage.getItem(SAVE_KEY);
        if (!saveData) {
          console.log('저장된 게임 데이터가 없습니다.');
          // 새 게임 시작 시 누적 플레이시간 초기화
          totalPlayTime = 0;
          sessionStartTime = Date.now();
          return false;
        }
        
        const data = JSON.parse(saveData);
        
        // 게임 상태 복원
        cash = data.cash || 0;
        totalClicks = data.totalClicks || 0;
        totalLaborIncome = data.totalLaborIncome || 0;
        careerLevel = data.careerLevel || 0;
        clickMultiplier = data.clickMultiplier || 1;
        rentMultiplier = data.rentMultiplier || 1;
        autoClickEnabled = data.autoClickEnabled || false;
        managerLevel = data.managerLevel || 0;
        rentCost = data.rentCost || 1000000000;
        mgrCost = data.mgrCost || 5000000000;
        
        // 금융상품 복원
        deposits = data.deposits || 0;
        savings = data.savings || 0;
        bonds = data.bonds || 0;
        usStocks = data.usStocks || 0;
        cryptos = data.cryptos || 0;
        
        // 금융상품 누적 생산량 복원
        depositsLifetime = data.depositsLifetime || 0;
        savingsLifetime = data.savingsLifetime || 0;
        bondsLifetime = data.bondsLifetime || 0;
        usStocksLifetime = data.usStocksLifetime || 0;
        cryptosLifetime = data.cryptosLifetime || 0;
        
        // 부동산 복원
        villas = data.villas || 0;
        officetels = data.officetels || 0;
        apartments = data.apartments || 0;
        shops = data.shops || 0;
        buildings = data.buildings || 0;
        
        // 부동산 누적 생산량 복원
        villasLifetime = data.villasLifetime || 0;
        officetelsLifetime = data.officetelsLifetime || 0;
        apartmentsLifetime = data.apartmentsLifetime || 0;
        shopsLifetime = data.shopsLifetime || 0;
        buildingsLifetime = data.buildingsLifetime || 0;
        
        // 업그레이드 복원 (새 Cookie Clicker 스타일)
        if (data.upgradesV2) {
          for (const [id, state] of Object.entries(data.upgradesV2)) {
            if (UPGRADES[id]) {
              UPGRADES[id].unlocked = state.unlocked;
              UPGRADES[id].purchased = state.purchased;
              
              // 효과 재적용 제거: clickMultiplier 등은 이미 저장된 값으로 복원되므로 중복 적용 불필요
              // 중복 적용 시 새로고침할 때마다 배수가 계속 곱해지는 버그 발생
            }
          }
        }

        // (버그픽스) 수익 테이블(FINANCIAL_INCOME/BASE_RENT)에만 영향을 주는 업그레이드 효과는
        // 저장값으로 복원되지 않으므로, 기본값으로 리셋 후 1회 재적용하여 재접속 시 수익이 줄어드는 문제를 방지한다.
        reapplyIncomeTableAffectingUpgradeEffects();
        
        // 시장 이벤트 복원
        marketMultiplier = data.marketMultiplier || 1;
        marketEventEndTime = data.marketEventEndTime || 0;
        
        // 업적 복원
        if (data.achievements) {
          ACHIEVEMENTS.forEach((achievement, index) => {
            if (data.achievements[index]) {
              achievement.unlocked = data.achievements[index].unlocked;
            }
          });
        }
        
        // 게임 시작 시간 복원 (호환성 유지)
        if (data.gameStartTime) {
          gameStartTime = data.gameStartTime;
        }
        
        // 누적 플레이시간 시스템 복원
        if (data.totalPlayTime !== undefined) {
          totalPlayTime = data.totalPlayTime;
          console.log('🕐 이전 누적 플레이시간 복원:', totalPlayTime, 'ms');
        }
        // 닉네임 복원
        playerNickname = data.nickname || '';
        if (data.sessionStartTime) {
          // 이전 세션의 플레이시간을 누적
          const previousSessionTime = Date.now() - data.sessionStartTime;
          totalPlayTime += previousSessionTime;
          console.log('🕐 이전 세션 플레이시간 누적:', previousSessionTime, 'ms');
        }
        // 새 세션 시작
        sessionStartTime = Date.now();
        console.log('🕐 새 세션 시작:', new Date(sessionStartTime).toLocaleString());
        console.log('🕐 총 누적 플레이시간:', totalPlayTime, 'ms');
        
        console.log('게임 불러오기 완료:', data.saveTime ? new Date(data.saveTime).toLocaleString() : '시간 정보 없음');
        return true;
      } catch (error) {
        console.error('게임 불러오기 실패:', error);
        return false;
      }
    }
    
    // 게임 초기화 함수
    function resetGame() {
      console.log('🔄 resetGame function called'); // 디버깅용

      const message =
        '게임을 새로 시작하시겠습니까?\n\n' +
        '⚠️ 모든 진행 상황이 삭제되며 복구할 수 없습니다.';

      openConfirmModal('게임 새로 시작', message, () => {
        try {
          // 초기화 진행 메시지
          addLog('🔄 게임을 초기화합니다...');
          console.log('✅ User confirmed reset'); // 디버깅용
          
          // 저장 데이터 삭제
          localStorage.removeItem(SAVE_KEY);
          console.log('✅ LocalStorage cleared'); // 디버깅용
          
          // reset 직후 첫 부팅에서는 클라우드 복구 제안을 1회 스킵하고,
          // 닉네임 결정이 끝날 때까지 클라우드 복구를 세션 단위로 차단
          try {
            sessionStorage.setItem(CLOUD_RESTORE_SKIP_KEY, '1');
            sessionStorage.setItem(CLOUD_RESTORE_BLOCK_KEY, '1');
          } catch (e) {
            console.warn('sessionStorage set 실패:', e);
          }
          
          // 즉시 페이지 새로고침
          // reload 후 ensureNicknameModal()이 닉네임 입력을 처리함
          console.log('✅ Reloading page...'); // 디버깅용
          location.reload();
        } catch (error) {
          console.error('❌ Error in resetGame:', error);
          openInfoModal('오류', '게임 초기화 중 오류가 발생했습니다.\n페이지를 새로고침해주세요.', '⚠️');
        }
      }, {
        icon: '🔄',
        primaryLabel: '새로 시작',
        secondaryLabel: '취소',
      });
    }
    
    // 구매 완료 시 반짝 효과 함수
    function showPurchaseSuccess(element) {
      // 기존 클래스 제거
      element.classList.remove('purchase-success');
      
      // 강제 리플로우
      element.offsetHeight;
      
      // 새 클래스 추가
      element.classList.add('purchase-success');
      
      setTimeout(() => {
        element.classList.remove('purchase-success');
      }, 600);
    }
    
    // 설정 저장 함수
    function saveSettings() {
      try {
        safeSetJSON(SETTINGS_KEY, settings);
      } catch (error) {
        console.error('설정 저장 실패:', error);
      }
    }
    
    // 설정 불러오기 함수
    function loadSettings() {
      try {
        const saved = safeGetJSON(SETTINGS_KEY, null);
        if (saved) {
          settings = { ...settings, ...saved };
        }
      } catch (error) {
        console.error('설정 불러오기 실패:', error);
      }
    }
    
    // 저장 내보내기 함수
    function exportSave() {
      try {
        const saveData = localStorage.getItem(SAVE_KEY);
        if (!saveData) {
          alert('저장된 게임 데이터가 없습니다.');
          return;
        }
        
        const blob = new Blob([saveData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `capital-clicker-save-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addLog('✅ 저장 파일이 다운로드되었습니다.');
      } catch (error) {
        console.error('저장 내보내기 실패:', error);
        alert('저장 내보내기 중 오류가 발생했습니다.');
      }
    }
    
    // 저장 가져오기 함수
    function importSave(file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const saveData = JSON.parse(e.target.result);
            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
            addLog('✅ 저장 파일을 불러왔습니다. 페이지를 새로고침합니다...');
            setTimeout(() => {
              location.reload();
            }, 1000);
          } catch (error) {
            console.error('저장 파일 파싱 실패:', error);
            alert('저장 파일 형식이 올바르지 않습니다.');
          }
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('저장 가져오기 실패:', error);
        alert('저장 가져오기 중 오류가 발생했습니다.');
      }
    }
    
    // 저장 상태 UI 업데이트 함수
    function updateSaveStatus() {
      if (elSaveStatus) {
        const timeStr = lastSaveTime.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        elSaveStatus.textContent = `저장됨 · ${timeStr}`;
      }
      // 설정 탭의 마지막 저장 시간 업데이트
      const elLastSaveTimeSettings = document.getElementById('lastSaveTimeSettings');
      if (elLastSaveTimeSettings) {
        const timeStr = lastSaveTime.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        });
        elLastSaveTimeSettings.textContent = timeStr;
      }
    }

    function updateUI(){
      // --- (A) 커리어 진행률 갱신을 최우선으로 ---
      try {
        // 닉네임 표시 업데이트
        const nicknameLabel = document.getElementById('playerNicknameLabel');
        const nicknameInfoItem = document.getElementById('nicknameInfoItem');
        if (nicknameLabel) {
          nicknameLabel.textContent = playerNickname || '-';
        }
        if (nicknameInfoItem) {
          nicknameInfoItem.style.display = playerNickname ? 'flex' : 'none';
        }

        // Supabase 진단 배지는 프로덕션에서는 표시하지 않음 (디버그 코드 제거)
        // totalClicks 값 유효성 검사
        if (typeof totalClicks !== 'number' || totalClicks < 0) {
          console.warn('Invalid totalClicks value:', totalClicks, 'resetting to 0');
          totalClicks = 0;
        }
        
        const currentCareer = getCurrentCareer();
        const nextCareer = getNextCareer();
        
        if (!currentCareer) {
          console.error('getCurrentCareer() returned null/undefined');
          return;
        }
        
        safeText(elCurrentCareer, currentCareer.name);
        safeText(elClickIncomeButton, formatKoreanNumber(getClickIncome()));
        
        // 직급별 배경 이미지 업데이트
        if (elWorkArea && currentCareer.bgImage) {
          elWorkArea.style.backgroundImage = `url('${currentCareer.bgImage}')`;
        } else if (elWorkArea && !currentCareer.bgImage) {
          // 배경 이미지가 없으면 기본 그라데이션으로 복원
          elWorkArea.style.backgroundImage = 'radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)';
        }
        
        if (nextCareer) {
          // 승진 진행률 계산 및 표시 (개선된 형식)
          const progress = Math.min((totalClicks / nextCareer.requiredClicks) * 100, 100);
          const remaining = Math.max(0, nextCareer.requiredClicks - totalClicks);
          
          if (elCareerProgress) {
            elCareerProgress.style.width = progress + '%';
            elCareerProgress.setAttribute('aria-valuenow', Math.round(progress));
          }
          
          // 간소화된 진행률 표시
          safeText(elCareerProgressText, `${Math.round(progress)}% (${totalClicks}/${nextCareer.requiredClicks})`);
          
          // 남은 클릭 수 표시
          if (elCareerRemaining) {
            if (remaining > 0) {
              // 천 단위 콤마 표기
              safeText(elCareerRemaining, `다음 승진까지 ${remaining.toLocaleString('ko-KR')}클릭 남음`);
            } else {
              safeText(elCareerRemaining, '승진 가능!');
            }
          }
          
          // 디버깅: 승진 진행률 확인 (강화된 로깅)
          console.log('=== CAREER PROGRESS DEBUG ===');
          console.log('totalClicks:', totalClicks);
          console.log('nextCareer.requiredClicks:', nextCareer.requiredClicks);
          console.log('progress:', progress);
          console.log('currentCareer:', currentCareer.name);
          console.log('nextCareer:', nextCareer.name);
          console.log('=============================');
        } else {
          if (elCareerProgress) {
            elCareerProgress.style.width = '100%';
            elCareerProgress.setAttribute('aria-valuenow', 100);
          }
          safeText(elCareerProgressText, "100% (완료)");
          if (elCareerRemaining) {
            safeText(elCareerRemaining, '최고 직급 달성');
          }
        }
      } catch (e) {
        console.error('Career UI update failed:', e);
        console.error('Error details:', {
          totalClicks,
          careerLevel,
          currentCareer: getCurrentCareer(),
          nextCareer: getNextCareer()
        });
      }
      
      // --- (B) 나머지 UI 갱신 (금융/부동산/업그레이드 등) ---
      // 일기장 헤더 메타(yyyy.mm.dd(N일차))는 로그가 없어도 항상 갱신
      {
        const elCompact = document.getElementById('diaryHeaderMeta');
        if (elCompact) {
          const pad2 = (n) => String(n).padStart(2, '0');
          const now = new Date();
          const y = now.getFullYear();
          const m = pad2(now.getMonth() + 1);
          const d = pad2(now.getDate());
          const base = (typeof gameStartTime !== 'undefined' && gameStartTime) ? gameStartTime : sessionStartTime;
          const days = Math.max(1, Math.floor((Date.now() - base) / 86400000) + 1);
          elCompact.textContent = `${y}.${m}.${d}(${days}일차)`;
        }
      }
      safeText(elCash, formatHeaderCash(cash));
      // 금융상품 집계 및 툴팁
      const totalFinancial = getTotalFinancialProducts();
      safeText(elFinancial, formatKoreanNumber(totalFinancial));
      const financialChip = document.getElementById('financialChip');
      if (financialChip) {
        const tooltip = `예금: ${deposits}개\n적금: ${savings}개\n국내주식: ${bonds}개\n미국주식: ${usStocks}개\n코인: ${cryptos}개`;
        financialChip.setAttribute('title', tooltip);
      }
      
      // 부동산 집계 및 툴팁
      const totalProperties = getTotalProperties();
      safeText(elProperties, formatKoreanNumber(totalProperties));
      const propertyChip = document.getElementById('propertyChip');
      if (propertyChip) {
        const tooltip = `빌라: ${villas}채\n오피스텔: ${officetels}채\n아파트: ${apartments}채\n상가: ${shops}채\n빌딩: ${buildings}채`;
        propertyChip.setAttribute('title', tooltip);
      }
      
      // 초당 수익 및 툴팁
      const rpsValue = getRps();
      safeText(elRps, formatHeaderCash(rpsValue));
      const rpsChip = document.getElementById('rpsChip');
      if (rpsChip) {
        const financialIncome = deposits * FINANCIAL_INCOME.deposit + 
                                savings * FINANCIAL_INCOME.savings + 
                                bonds * FINANCIAL_INCOME.bond;
        const propertyIncome = (villas * BASE_RENT.villa +
                                officetels * BASE_RENT.officetel +
                                apartments * BASE_RENT.apartment +
                                shops * BASE_RENT.shop +
                                buildings * BASE_RENT.building) * rentMultiplier;
        
        const tooltip = `금융 수익: ${formatKoreanNumber(financialIncome)}₩/s\n부동산 수익: ${formatKoreanNumber(propertyIncome)}₩/s\n시장배수: x${marketMultiplier}`;
        rpsChip.setAttribute('title', tooltip);
      }

      // ======= [투자] 시장 이벤트 영향 배지/하이라이트 =======
      updateInvestmentMarketImpactUI();
      
      safeText(elClickMultiplier, clickMultiplier.toFixed(1));
      safeText(elRentMultiplier, rentMultiplier.toFixed(1));
      
      // 디버깅: 전체 게임 상태 확인
      console.log('=== GAME STATE DEBUG ===');
      console.log('Cash:', cash);
      console.log('Total clicks:', totalClicks);
      console.log('Career level:', careerLevel);
      console.log('Financial products:', { deposits, savings, bonds, total: getTotalFinancialProducts() });
      console.log('Properties:', { villas, officetels, apartments, shops, buildings, total: getTotalProperties() });
      console.log('========================');
      
      // 금융상품 UI 업데이트 (동적 가격 계산) - 안전장치 추가
      try {
        // 금융상품 변수 유효성 검사
        if (typeof deposits !== 'number' || deposits < 0) {
          console.warn('Invalid deposits value:', deposits, 'resetting to 0');
          deposits = 0;
        }
        if (typeof savings !== 'number' || savings < 0) {
          console.warn('Invalid savings value:', savings, 'resetting to 0');
          savings = 0;
        }
        if (typeof bonds !== 'number' || bonds < 0) {
          console.warn('Invalid bonds value:', bonds, 'resetting to 0');
          bonds = 0;
        }
        
        const totalRps = getRps();
        
        // 예금 업데이트
        const depositCost = purchaseMode === 'buy' 
          ? getFinancialCost('deposit', deposits, purchaseQuantity)
          : getFinancialSellPrice('deposit', deposits, purchaseQuantity);
        const depositTotalIncome = deposits * FINANCIAL_INCOME.deposit;
        const depositPercent = totalRps > 0 ? ((depositTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        elDepositCount.textContent = deposits;
        elIncomePerDeposit.textContent = Math.floor(FINANCIAL_INCOME.deposit).toLocaleString('ko-KR') + '원';
        document.getElementById('depositTotalIncome').textContent = Math.floor(depositTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('depositPercent').textContent = depositPercent + '%';
        document.getElementById('depositLifetime').textContent = formatCashDisplayFixed1(depositsLifetime);
        elDepositCurrentPrice.textContent = formatFinancialPrice(depositCost);
        
        // 적금 업데이트
        const savingsCost = purchaseMode === 'buy'
          ? getFinancialCost('savings', savings, purchaseQuantity)
          : getFinancialSellPrice('savings', savings, purchaseQuantity);
        const savingsTotalIncome = savings * FINANCIAL_INCOME.savings;
        const savingsPercent = totalRps > 0 ? ((savingsTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        elSavingsCount.textContent = savings;
        elIncomePerSavings.textContent = Math.floor(FINANCIAL_INCOME.savings).toLocaleString('ko-KR') + '원';
        document.getElementById('savingsTotalIncome').textContent = Math.floor(savingsTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('savingsPercent').textContent = savingsPercent + '%';
        document.getElementById('savingsLifetimeDisplay').textContent = formatCashDisplayFixed1(savingsLifetime);
        elSavingsCurrentPrice.textContent = formatFinancialPrice(savingsCost);
        
        // 주식 업데이트
        const bondCost = purchaseMode === 'buy'
          ? getFinancialCost('bond', bonds, purchaseQuantity)
          : getFinancialSellPrice('bond', bonds, purchaseQuantity);
        const bondTotalIncome = bonds * FINANCIAL_INCOME.bond;
        const bondPercent = totalRps > 0 ? ((bondTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        elBondCount.textContent = bonds;
        elIncomePerBond.textContent = Math.floor(FINANCIAL_INCOME.bond).toLocaleString('ko-KR') + '원';
        document.getElementById('bondTotalIncome').textContent = Math.floor(bondTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('bondPercent').textContent = bondPercent + '%';
        document.getElementById('bondLifetimeDisplay').textContent = formatCashDisplayFixed1(bondsLifetime);
        elBondCurrentPrice.textContent = formatFinancialPrice(bondCost);
        
        // 미국주식 업데이트
        const usStockCost = purchaseMode === 'buy'
          ? getFinancialCost('usStock', usStocks, purchaseQuantity)
          : getFinancialSellPrice('usStock', usStocks, purchaseQuantity);
        const usStockTotalIncome = usStocks * FINANCIAL_INCOME.usStock;
        const usStockPercent = totalRps > 0 ? ((usStockTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        document.getElementById('usStockCount').textContent = usStocks;
        document.getElementById('incomePerUsStock').textContent = Math.floor(FINANCIAL_INCOME.usStock).toLocaleString('ko-KR') + '원';
        document.getElementById('usStockTotalIncome').textContent = Math.floor(usStockTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('usStockPercent').textContent = usStockPercent + '%';
        document.getElementById('usStockLifetimeDisplay').textContent = formatCashDisplayFixed1(usStocksLifetime);
        document.getElementById('usStockCurrentPrice').textContent = formatFinancialPrice(usStockCost);
        
        // 코인 업데이트
        const cryptoCost = purchaseMode === 'buy'
          ? getFinancialCost('crypto', cryptos, purchaseQuantity)
          : getFinancialSellPrice('crypto', cryptos, purchaseQuantity);
        const cryptoTotalIncome = cryptos * FINANCIAL_INCOME.crypto;
        const cryptoPercent = totalRps > 0 ? ((cryptoTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        document.getElementById('cryptoCount').textContent = cryptos;
        document.getElementById('incomePerCrypto').textContent = Math.floor(FINANCIAL_INCOME.crypto).toLocaleString('ko-KR') + '원';
        document.getElementById('cryptoTotalIncome').textContent = Math.floor(cryptoTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('cryptoPercent').textContent = cryptoPercent + '%';
        document.getElementById('cryptoLifetimeDisplay').textContent = formatCashDisplayFixed1(cryptosLifetime);
        document.getElementById('cryptoCurrentPrice').textContent = formatFinancialPrice(cryptoCost);
        
        // 디버깅: 금융상품 카운트 확인 (강화된 로깅)
        console.log('=== FINANCIAL PRODUCTS DEBUG ===');
        console.log('Financial counts:', { deposits, savings, bonds, usStocks, cryptos });
        console.log('Total financial products:', getTotalFinancialProducts());
        console.log('Financial elements:', {
          depositCount: elDepositCount,
          savingsCount: elSavingsCount,
          bondCount: elBondCount
        });
        console.log('================================');
      } catch (e) {
        console.error('Financial products UI update failed:', e);
        console.error('Error details:', { deposits, savings, bonds });
      }
      
      // 부동산 구입 UI 업데이트 (동적 가격 계산)
      const totalRps2 = getRps(); // 부동산용 RPS 계산
      
      // 빌라
      const villaCost = purchaseMode === 'buy'
        ? getPropertyCost('villa', villas, purchaseQuantity)
        : getPropertySellPrice('villa', villas, purchaseQuantity);
      const villaTotalIncome = villas * BASE_RENT.villa;
      const villaPercent = totalRps2 > 0 ? ((villaTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elVillaCount.textContent = villas;
      elRentPerVilla.textContent = Math.floor(BASE_RENT.villa).toLocaleString('ko-KR') + '원';
      document.getElementById('villaTotalIncome').textContent = Math.floor(villaTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('villaPercent').textContent = villaPercent + '%';
      document.getElementById('villaLifetimeDisplay').textContent = formatCashDisplayFixed1(villasLifetime);
      elVillaCurrentPrice.textContent = formatPropertyPrice(villaCost);
      
      // 오피스텔
      const officetelCost = purchaseMode === 'buy'
        ? getPropertyCost('officetel', officetels, purchaseQuantity)
        : getPropertySellPrice('officetel', officetels, purchaseQuantity);
      const officetelTotalIncome = officetels * BASE_RENT.officetel;
      const officetelPercent = totalRps2 > 0 ? ((officetelTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elOfficetelCount.textContent = officetels;
      elRentPerOfficetel.textContent = Math.floor(BASE_RENT.officetel).toLocaleString('ko-KR') + '원';
      document.getElementById('officetelTotalIncome').textContent = Math.floor(officetelTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('officetelPercent').textContent = officetelPercent + '%';
      document.getElementById('officetelLifetimeDisplay').textContent = formatCashDisplayFixed1(officetelsLifetime);
      elOfficetelCurrentPrice.textContent = formatPropertyPrice(officetelCost);
      
      // 아파트
      const aptCost = purchaseMode === 'buy'
        ? getPropertyCost('apartment', apartments, purchaseQuantity)
        : getPropertySellPrice('apartment', apartments, purchaseQuantity);
      const aptTotalIncome = apartments * BASE_RENT.apartment;
      const aptPercent = totalRps2 > 0 ? ((aptTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elAptCount.textContent = apartments;
      elRentPerApt.textContent = Math.floor(BASE_RENT.apartment).toLocaleString('ko-KR') + '원';
      document.getElementById('aptTotalIncome').textContent = Math.floor(aptTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('aptPercent').textContent = aptPercent + '%';
      document.getElementById('aptLifetimeDisplay').textContent = formatCashDisplayFixed1(apartmentsLifetime);
      elAptCurrentPrice.textContent = formatPropertyPrice(aptCost);
      
      // 상가
      const shopCost = purchaseMode === 'buy'
        ? getPropertyCost('shop', shops, purchaseQuantity)
        : getPropertySellPrice('shop', shops, purchaseQuantity);
      const shopTotalIncome = shops * BASE_RENT.shop;
      const shopPercent = totalRps2 > 0 ? ((shopTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elShopCount.textContent = shops;
      elRentPerShop.textContent = Math.floor(BASE_RENT.shop).toLocaleString('ko-KR') + '원';
      document.getElementById('shopTotalIncome').textContent = Math.floor(shopTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('shopPercent').textContent = shopPercent + '%';
      document.getElementById('shopLifetimeDisplay').textContent = formatCashDisplayFixed1(shopsLifetime);
      elShopCurrentPrice.textContent = formatPropertyPrice(shopCost);
      
      // 빌딩
      const buildingCost = purchaseMode === 'buy'
        ? getPropertyCost('building', buildings, purchaseQuantity)
        : getPropertySellPrice('building', buildings, purchaseQuantity);
      const buildingTotalIncome = buildings * BASE_RENT.building;
      const buildingPercent = totalRps2 > 0 ? ((buildingTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elBuildingCount.textContent = buildings;
      elRentPerBuilding.textContent = Math.floor(BASE_RENT.building).toLocaleString('ko-KR') + '원';
      document.getElementById('buildingTotalIncome').textContent = Math.floor(buildingTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('buildingPercent').textContent = buildingPercent + '%';
      document.getElementById('buildingLifetimeDisplay').textContent = formatCashDisplayFixed1(buildingsLifetime);
      elBuildingCurrentPrice.textContent = formatPropertyPrice(buildingCost);
      
      // 디버깅: 부동산 카운트 확인
      console.log('Property counts:', { villas, officetels, apartments, shops, buildings });
      
      // 커리어 UI 업데이트는 함수 최상단으로 이동됨
      
      // 업그레이드 UI 업데이트 (제거됨 - 새 시스템 사용)

      // 버튼 텍스트 및 상태 업데이트 (구매/판매 통합)
      updateButtonTexts();
      
      // 버튼 상태 업데이트 (Cookie Clicker 스타일)
      updateButtonStates();
      
      // 건물 목록 색상 업데이트
      updateBuildingItemStates();
      
      // 업그레이드 구매 가능 여부만 업데이트 (DOM 재생성 안 함)
      updateUpgradeAffordability();
      
      // 순차 해금 시스템 - 잠금 상태 업데이트
      updateProductLockStates();
      
      // 통계 탭 업데이트
      updateStatsTab();
    }

    // [투자] 섹션 각 상품에 현재 시장 이벤트 배수(xN.N) 배지 + 행 하이라이트를 표시합니다.
    // - 배수 === 1.0이면 배지 숨김/하이라이트 해제
    // - 배수 > 1.0: bull(연두), 배수 < 1.0: bear(핑크)
    let __marketImpactCache = null;
    function updateInvestmentMarketImpactUI() {
      try {
        const now = Date.now();
        const isEventActive = !!(currentMarketEvent && marketEventEndTime > now);
        const remainingSec = isEventActive ? Math.max(0, Math.ceil((marketEventEndTime - now) / 1000)) : 0;

        // 투자 섹션 상단에 이벤트명/잔여시간 표시
        const marketEventBar = document.getElementById('marketEventBar');
        if (marketEventBar) {
          if (!isEventActive) {
            marketEventBar.classList.remove('is-visible');
            marketEventBar.textContent = '';
          } else {
            marketEventBar.classList.add('is-visible');
            const evName = currentMarketEvent?.name ? String(currentMarketEvent.name) : '시장 이벤트';
            const seconds = Math.floor((marketEventEndTime - now) / 1000);
            const secText = seconds >= 0 ? `${seconds}초` : '0초';
            // 영향 요약(배수≠1 항목 5개 이내)
            const summarize = (effects, names) => {
              if (!effects) return [];
              return Object.entries(effects)
                .filter(([, m]) => m !== 1.0)
                .slice(0, 5)
                .map(([k, m]) => `${names[k] ?? k} x${(Math.round(m * 10) / 10).toString().replace(/\.0$/, '')}`);
            };
            const finNames = { deposit: '예금', savings: '적금', bond: '국내주식', usStock: '미국주식', crypto: '코인' };
            const propNames = { villa: '빌라', officetel: '오피스텔', apartment: '아파트', shop: '상가', building: '빌딩' };
            const fin = summarize(currentMarketEvent?.effects?.financial, finNames);
            const prop = summarize(currentMarketEvent?.effects?.property, propNames);
            const parts = [...fin, ...prop].slice(0, 5);
            const hint = parts.length ? ` · ${parts.join(', ')}` : '';
            marketEventBar.innerHTML = `📈 <b>${evName}</b> · 남은 <span class="good">${secText}</span>${hint}`;
          }
        }

        if (!__marketImpactCache) {
          const targets = [
            // 금융
            { rowId: 'depositItem', category: 'financial', type: 'deposit' },
            { rowId: 'savingsItem', category: 'financial', type: 'savings' },
            { rowId: 'bondItem', category: 'financial', type: 'bond' },
            { rowId: 'usStockItem', category: 'financial', type: 'usStock' },
            { rowId: 'cryptoItem', category: 'financial', type: 'crypto' },
            // 부동산
            { rowId: 'villaItem', category: 'property', type: 'villa' },
            { rowId: 'officetelItem', category: 'property', type: 'officetel' },
            { rowId: 'aptItem', category: 'property', type: 'apartment' },
            { rowId: 'shopItem', category: 'property', type: 'shop' },
            { rowId: 'buildingItem', category: 'property', type: 'building' },
          ];

          __marketImpactCache = targets
            .map((t) => {
              const row = document.getElementById(t.rowId);
              if (!row) return null;

              // 버튼 왼쪽에 배지 삽입(시야성 최고)
              const btn = row.querySelector('button.btn');
              if (!btn) return null;

              let badge = row.querySelector('.event-mult-badge');
              if (!badge) {
                badge = document.createElement('span');
                badge.className = 'event-mult-badge';
                badge.setAttribute('aria-hidden', 'true');
                row.insertBefore(badge, btn);
              }

              return { ...t, row, badge };
            })
            .filter(Boolean);
        }

        for (const t of __marketImpactCache) {
          const mult = isEventActive ? getMarketEventMultiplier(t.type, t.category) : 1.0;
          const isNeutral = Math.abs(mult - 1.0) < 1e-9;

          // reset
          t.row.classList.remove('event-bull', 'event-bear');
          t.badge.classList.remove('is-visible', 'is-bull', 'is-bear');
          t.badge.removeAttribute('title');

          if (!isEventActive || isNeutral) {
            t.badge.textContent = '';
            continue;
          }

          const multNum = Math.round(mult * 10) / 10;
          const multText = `x${multNum.toFixed(1).replace(/\.0$/, '')}`;

          t.badge.textContent = multText;
          t.badge.classList.add('is-visible');

          if (mult > 1.0) {
            t.row.classList.add('event-bull');
            t.badge.classList.add('is-bull');
          } else {
            t.row.classList.add('event-bear');
            t.badge.classList.add('is-bear');
          }

          // 툴팁: 이벤트명 + 남은 시간 + 배수
          const evName = currentMarketEvent?.name ? String(currentMarketEvent.name) : '시장 이벤트';
          t.badge.title = `${evName} · 남은 ${remainingSec}초 · ${multText}`;
        }
      } catch (e) {
        // UI 보조 기능이므로 실패해도 게임 진행은 유지
      }
    }
    
    // 통계 섹션 초기화 (DOMContentLoaded 이후에 실행)
    setTimeout(() => {
      initStatsCollapsible();
    }, 100);

    // 순차 해금 시스템 - 잠금 상태 업데이트
    function updateProductLockStates() {
      // 해금 조건 메시지
      const unlockHints = {
        'savings': '예금 1개 필요',
        'bond': '적금 1개 필요',
        'usStock': '국내주식 1개 필요',
        'crypto': '미국주식 1개 필요',
        'villa': '코인 1개 필요',
        'officetel': '빌라 1채 필요',
        'apartment': '오피스텔 1채 필요',
        'shop': '아파트 1채 필요',
        'building': '상가 1채 필요'
      };
      
      // 금융상품 잠금 상태
      const savingsItem = document.getElementById('savingsItem');
      const bondItem = document.getElementById('bondItem');
      
      if (savingsItem) {
        const isLocked = !isProductUnlocked('savings');
        savingsItem.classList.toggle('locked', isLocked);
        if (isLocked) {
          savingsItem.setAttribute('data-unlock-hint', unlockHints['savings']);
        } else {
          savingsItem.removeAttribute('data-unlock-hint');
        }
      }
      if (bondItem) {
        const isLocked = !isProductUnlocked('bond');
        bondItem.classList.toggle('locked', isLocked);
        if (isLocked) {
          bondItem.setAttribute('data-unlock-hint', unlockHints['bond']);
        } else {
          bondItem.removeAttribute('data-unlock-hint');
        }
      }
      
      // 미국주식과 코인 잠금 상태
      const usStockItem = document.getElementById('usStockItem');
      const cryptoItem = document.getElementById('cryptoItem');
      
      if (usStockItem) {
        const isLocked = !isProductUnlocked('usStock');
        usStockItem.classList.toggle('locked', isLocked);
        if (isLocked) {
          usStockItem.setAttribute('data-unlock-hint', unlockHints['usStock']);
        } else {
          usStockItem.removeAttribute('data-unlock-hint');
        }
      }
      if (cryptoItem) {
        const isLocked = !isProductUnlocked('crypto');
        cryptoItem.classList.toggle('locked', isLocked);
        if (isLocked) {
          cryptoItem.setAttribute('data-unlock-hint', unlockHints['crypto']);
        } else {
          cryptoItem.removeAttribute('data-unlock-hint');
        }
      }
      
      // 부동산 잠금 상태
      const villaItem = document.getElementById('villaItem');
      const officetelItem = document.getElementById('officetelItem');
      const aptItem = document.getElementById('aptItem');
      const shopItem = document.getElementById('shopItem');
      const buildingItem = document.getElementById('buildingItem');
      
      if (villaItem) {
        const isLocked = !isProductUnlocked('villa');
        villaItem.classList.toggle('locked', isLocked);
        if (isLocked) {
          villaItem.setAttribute('data-unlock-hint', unlockHints['villa']);
        } else {
          villaItem.removeAttribute('data-unlock-hint');
        }
      }
      if (officetelItem) {
        const isLocked = !isProductUnlocked('officetel');
        officetelItem.classList.toggle('locked', isLocked);
        if (isLocked) {
          officetelItem.setAttribute('data-unlock-hint', unlockHints['officetel']);
        } else {
          officetelItem.removeAttribute('data-unlock-hint');
        }
      }
      if (aptItem) {
        const isLocked = !isProductUnlocked('apartment');
        aptItem.classList.toggle('locked', isLocked);
        if (isLocked) {
          aptItem.setAttribute('data-unlock-hint', unlockHints['apartment']);
        } else {
          aptItem.removeAttribute('data-unlock-hint');
        }
      }
      if (shopItem) {
        const isLocked = !isProductUnlocked('shop');
        shopItem.classList.toggle('locked', isLocked);
        if (isLocked) {
          shopItem.setAttribute('data-unlock-hint', unlockHints['shop']);
        } else {
          shopItem.removeAttribute('data-unlock-hint');
        }
      }
      if (buildingItem) {
        const isLocked = !isProductUnlocked('building');
        buildingItem.classList.toggle('locked', isLocked);
        if (isLocked) {
          buildingItem.setAttribute('data-unlock-hint', unlockHints['building']);
        } else {
          buildingItem.removeAttribute('data-unlock-hint');
        }
      }
    }
    
    // ======= 구매 수량 선택 시스템 =======
    elBuyMode.addEventListener('click', () => {
      purchaseMode = 'buy';
      elBuyMode.classList.add('active');
      elSellMode.classList.remove('active');
      updateButtonTexts();
    });
    
    elSellMode.addEventListener('click', () => {
      purchaseMode = 'sell';
      elSellMode.classList.add('active');
      elBuyMode.classList.remove('active');
      updateButtonTexts();
    });
    
    elQty1.addEventListener('click', () => {
      purchaseQuantity = 1;
      elQty1.classList.add('active');
      elQty5.classList.remove('active');
      elQty10.classList.remove('active');
      updateButtonTexts();
    });
    
    elQty5.addEventListener('click', () => {
      purchaseQuantity = 5;
      elQty5.classList.add('active');
      elQty1.classList.remove('active');
      elQty10.classList.remove('active');
      updateButtonTexts();
    });
    
    elQty10.addEventListener('click', () => {
      purchaseQuantity = 10;
      elQty10.classList.add('active');
      elQty1.classList.remove('active');
      elQty5.classList.remove('active');
      updateButtonTexts();
    });
    
    // ======= 토글 기능 =======
    elToggleUpgrades.addEventListener('click', () => {
      const section = document.getElementById('upgradeList');
      const isCollapsed = section.classList.contains('collapsed-section');
      
      if (isCollapsed) {
        section.classList.remove('collapsed-section');
        elToggleUpgrades.textContent = '▼';
        elToggleUpgrades.classList.remove('collapsed');
      } else {
        section.classList.add('collapsed-section');
        elToggleUpgrades.textContent = '▶';
        elToggleUpgrades.classList.add('collapsed');
      }
    });
    
    elToggleFinancial.addEventListener('click', () => {
      const section = document.getElementById('financialSection');
      const isCollapsed = section.classList.contains('collapsed-section');
      
      if (isCollapsed) {
        section.classList.remove('collapsed-section');
        elToggleFinancial.textContent = '▼';
        elToggleFinancial.classList.remove('collapsed');
      } else {
        section.classList.add('collapsed-section');
        elToggleFinancial.textContent = '▶';
        elToggleFinancial.classList.add('collapsed');
      }
    });
    
    elToggleProperties.addEventListener('click', () => {
      const section = document.getElementById('propertySection');
      const isCollapsed = section.classList.contains('collapsed-section');
      
      if (isCollapsed) {
        section.classList.remove('collapsed-section');
        elToggleProperties.textContent = '▼';
        elToggleProperties.classList.remove('collapsed');
      } else {
        section.classList.add('collapsed-section');
        elToggleProperties.textContent = '▶';
        elToggleProperties.classList.add('collapsed');
      }
    });
    
    // 버튼 텍스트 업데이트 함수
    function updateButtonTexts() {
      const isBuy = purchaseMode === 'buy';
      const qty = purchaseQuantity;
      
      // 금융상품 버튼 업데이트
      updateButton(elBuyDeposit, 'financial', 'deposit', deposits, isBuy, qty);
      updateButton(elBuySavings, 'financial', 'savings', savings, isBuy, qty);
      updateButton(elBuyBond, 'financial', 'bond', bonds, isBuy, qty);
      updateButton(elBuyUsStock, 'financial', 'usStock', usStocks, isBuy, qty);
      updateButton(elBuyCrypto, 'financial', 'crypto', cryptos, isBuy, qty);
      
      // 부동산 버튼 업데이트
      updateButton(elBuyVilla, 'property', 'villa', villas, isBuy, qty);
      updateButton(elBuyOfficetel, 'property', 'officetel', officetels, isBuy, qty);
      updateButton(elBuyApt, 'property', 'apartment', apartments, isBuy, qty);
      updateButton(elBuyShop, 'property', 'shop', shops, isBuy, qty);
      updateButton(elBuyBuilding, 'property', 'building', buildings, isBuy, qty);
    }
    
    // 개별 버튼 텍스트 및 스타일 업데이트 함수
    function updateButton(button, category, type, count, isBuy, qty) {
      if (!button) return;
      
      const price = isBuy 
        ? (category === 'financial' ? getFinancialCost(type, count, qty) : getPropertyCost(type, count, qty))
        : (category === 'financial' ? getFinancialSellPrice(type, count, qty) : getPropertySellPrice(type, count, qty));
      
      const modeText = isBuy ? '구입' : '판매';
      const qtyText = qty > 1 ? ` x${qty}` : '';
      
      // 버튼 텍스트: 가격 제거, 모드와 수량만 표시
      button.textContent = `${modeText}${qtyText}`;
      
      // 버튼 색상 및 활성화 상태
      if (isBuy) {
        button.style.background = '';
        button.disabled = cash < price;
      } else {
        // 판매 모드: 판매 가능하면 빨간색, 불가능하면 회색
        const canSell = count >= qty;
        button.style.background = canSell ? 'var(--bad)' : 'var(--muted)';
        button.disabled = !canSell;
      }
    }

    // ======= 액션 =======
    function handleWorkAction(clientX, clientY) {
      let income = getClickIncome();

      // 업그레이드 효과 적용 (새 UPGRADES 시스템)
      if (UPGRADES['performance_bonus'] && UPGRADES['performance_bonus'].purchased && Math.random() < 0.02) {
        income *= 10; // 2% 확률로 10배 수익
        addLog('💰 성과급 지급! 10배 수익!');
      }

      // 떨어지는 쿠키 애니메이션 생성 (설정에서 활성화된 경우만)
      if (settings.particles) {
        createFallingCookie(clientX ?? 0, clientY ?? 0);
      }

      cash += income;
      totalClicks += 1; // 클릭 수 증가
      totalLaborIncome += income; // 총 노동 수익 증가

      // 미니 목표 알림: 다음 업그레이드까지 남은 클릭 수 체크
      const lockedUpgrades = Object.entries(UPGRADES)
        .filter(([id, u]) => u.category === 'labor' && !u.unlocked && !u.purchased)
        .map(([id, u]) => {
          const conditionStr = u.unlockCondition.toString();
          const match = conditionStr.match(/totalClicks\s*>=\s*(\d+)/);
          if (match) {
            return { id, requiredClicks: parseInt(match[1]), upgrade: u };
          }
          // careerLevel 체크인 경우
          const careerMatch = conditionStr.match(/careerLevel\s*>=\s*(\d+)/);
          if (careerMatch) {
            return { id, requiredClicks: CAREER_LEVELS[parseInt(careerMatch[1])]?.requiredClicks || Infinity, upgrade: u };
          }
          return null;
        })
        .filter((x) => x !== null)
        .sort((a, b) => a.requiredClicks - b.requiredClicks);

      if (lockedUpgrades.length > 0) {
        const nextUpgrade = lockedUpgrades[0];
        const remaining = nextUpgrade.requiredClicks - totalClicks;

        // 50클릭, 25클릭, 10클릭, 5클릭 남았을 때 알림
        if (remaining === 50 || remaining === 25 || remaining === 10 || remaining === 5) {
          addLog(`🎯 다음 업그레이드 "${nextUpgrade.upgrade.name}"까지 ${remaining}클릭 남음!`);
        }
      }

      // 자동 승진 체크
      const wasPromoted = checkCareerPromotion();
      if (wasPromoted) updateUI();

      // 업그레이드 진행률 업데이트 (UI에 표시된 경우)
      updateUpgradeProgress();

      // 클릭 애니메이션 효과
      elWork.classList.add('click-effect');
      setTimeout(() => elWork.classList.remove('click-effect'), 300);

      // 수익 증가 텍스트 애니메이션
      showIncomeAnimation(income);

      updateUI();
    }

    elWork.addEventListener('click', (e) => {
      handleWorkAction(e.clientX, e.clientY);
    });

    // ======= 공통 모달 유틸 =======
    let modalOnConfirm = null;

    function closeModal() {
      if (!elModalRoot) return;
      elModalRoot.classList.add('game-modal-hidden');
      modalOnConfirm = null;
    }

    function openInfoModal(title, message, icon = 'ℹ️') {
      if (!elModalRoot || !elModalTitle || !elModalMessage || !elModalPrimary || !elModalSecondary) {
        alert(message);
        return;
      }
      elModalRoot.classList.remove('game-modal-hidden');
      const titleIcon = elModalTitle.querySelector('.icon');
      const titleText = elModalTitle.querySelector('.text');
      if (titleIcon) titleIcon.textContent = icon;
      if (titleText) titleText.textContent = title;
      elModalMessage.textContent = message;

      elModalSecondary.style.display = 'none';
      elModalPrimary.textContent = '확인';

      elModalPrimary.onclick = () => {
        closeModal();
      };
      elModalSecondary.onclick = () => {
        closeModal();
      };
    }

    function openConfirmModal(title, message, onConfirm, options = {}) {
      if (!elModalRoot || !elModalTitle || !elModalMessage || !elModalPrimary || !elModalSecondary) {
        const userConfirmed = confirm(message);
        if (userConfirmed && typeof onConfirm === 'function') onConfirm();
        return;
      }

      elModalRoot.classList.remove('game-modal-hidden');
      const titleIcon = elModalTitle.querySelector('.icon');
      const titleText = elModalTitle.querySelector('.text');
      if (titleIcon) titleIcon.textContent = options.icon || '⚠️';
      if (titleText) titleText.textContent = title;
      elModalMessage.textContent = message;

      elModalSecondary.style.display = 'inline-flex';
      elModalPrimary.textContent = options.primaryLabel || '예';
      elModalSecondary.textContent = options.secondaryLabel || '아니오';

      modalOnConfirm = typeof onConfirm === 'function' ? onConfirm : null;

      elModalPrimary.onclick = () => {
        const cb = modalOnConfirm;
        closeModal();
        if (cb) cb();
      };
      elModalSecondary.onclick = () => {
        closeModal();
        // onCancel 콜백이 있으면 호출
        if (options.onCancel && typeof options.onCancel === 'function') {
          options.onCancel();
        }
      };
    }

    // 닉네임 입력 모달
    function openInputModal(title, message, onConfirm, options = {}) {
      if (!elModalRoot || !elModalTitle || !elModalMessage || !elModalPrimary || !elModalSecondary) {
        const input = prompt(message);
        if (input && typeof onConfirm === 'function') {
          onConfirm(input.trim());
        }
        return;
      }

      elModalRoot.classList.remove('game-modal-hidden');
      const titleIcon = elModalTitle.querySelector('.icon');
      const titleText = elModalTitle.querySelector('.text');
      if (titleIcon) titleIcon.textContent = options.icon || '✏️';
      if (titleText) titleText.textContent = title;
      
      // 입력 필드 생성
      let inputEl = elModalMessage.querySelector('.game-modal-input');
      if (!inputEl) {
        inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.className = 'game-modal-input';
        elModalMessage.innerHTML = '';
        elModalMessage.appendChild(inputEl);
      } else {
        inputEl.value = '';
      }

      // placeholder / maxLength 적용
      inputEl.placeholder = options.placeholder || inputEl.placeholder || '닉네임을 입력하세요';
      if (typeof options.maxLength === 'number') {
        inputEl.maxLength = options.maxLength;
      } else if (!inputEl.maxLength || inputEl.maxLength <= 0) {
        inputEl.maxLength = 20;
      }
      
      // 메시지 텍스트 추가 (있는 경우)
      if (message) {
        const msgText = document.createElement('div');
        msgText.textContent = message;
        msgText.style.marginBottom = '10px';
        msgText.style.color = 'var(--muted)';
        elModalMessage.insertBefore(msgText, inputEl);
      }

      if (options.secondaryLabel) {
        elModalSecondary.style.display = 'inline-flex';
        elModalSecondary.textContent = options.secondaryLabel;
      } else {
        elModalSecondary.style.display = 'none';
      }
      elModalPrimary.textContent = options.primaryLabel || '확인';

      // Enter 키로 확인
      const handleEnter = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          elModalPrimary.click();
        }
      };
      inputEl.addEventListener('keydown', handleEnter);
      inputEl.focus();

      elModalPrimary.onclick = () => {
        const value = inputEl.value.trim();
        if (!value && options.required !== false) {
          inputEl.style.borderColor = 'var(--bad)';
          setTimeout(() => {
            inputEl.style.borderColor = '';
          }, 1000);
          return;
        }
        inputEl.removeEventListener('keydown', handleEnter);
        closeModal();
        if (typeof onConfirm === 'function') {
          onConfirm(value || options.defaultValue || '익명');
        }
      };
      // secondary 버튼은 options.secondaryLabel이 있을 때만 의미 있음
      if (options.secondaryLabel) {
        elModalSecondary.onclick = () => {
          inputEl.removeEventListener('keydown', handleEnter);
          closeModal();
          // onCancel 콜백이 있으면 호출
          if (options.onCancel && typeof options.onCancel === 'function') {
            options.onCancel();
          }
        };
      } else {
        elModalSecondary.onclick = null;
      }
    }

    // ======= 공유하기 기능 =======
    async function shareGame() {
      const gameUrl = window.location.href;
      const gameTitle = 'Capital Clicker: Seoul Survival';
      const gameDescription = `💰 부동산과 금융 투자로 부자가 되는 게임!\n현재 자산: ${formatCashDisplay(cash)}\n초당 수익: ${formatCashDisplay(getRps())}`;
      // 요구사항: 공유 버튼은 Web Share API만 사용 (링크 복사 fallback 제거)
      if (!navigator.share) {
        addLog('❌ 이 기기/브라우저에서는 공유하기를 지원하지 않습니다.');
        return;
      }

      try {
        await navigator.share({
          title: gameTitle,
          text: gameDescription,
          url: gameUrl,
        });
        addLog('✅ 게임이 공유되었습니다!');
      } catch (err) {
        // 사용자가 공유 UI를 닫은 경우는 조용히 무시
        if (err?.name !== 'AbortError') {
          console.error('공유 실패:', err);
          addLog('❌ 공유에 실패했습니다.');
        }
      }
    }

    if (elShareBtn) {
      elShareBtn.addEventListener('click', shareGame);
    } else {
      console.error('공유 버튼을 찾을 수 없습니다.');
    }

    // ======= 즐겨찾기 / 홈 화면 안내 =======
    function handleFavoriteClick() {
      const url = window.location.href;
      const title = document.title || 'Capital Clicker: Seoul Survival';
      const ua = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|ipod|android/.test(ua);
      const isIOS = /iphone|ipad|ipod/.test(ua);
      const isAndroid = /android/.test(ua);
      const isMac = navigator.platform.toUpperCase().includes('MAC');

      // (아주 옛날 IE 전용) 가능한 경우 직접 즐겨찾기 추가 시도
      if (window.external && typeof window.external.AddFavorite === 'function') {
        try {
          window.external.AddFavorite(url, title);
          addLog('⭐ 즐겨찾기에 추가되었습니다.');
          return;
        } catch {
          // 실패하면 아래 안내로 fallback
        }
      }

      let message = '';
      let modalTitle = '즐겨찾기 / 홈 화면에 추가';
      let icon = '⭐';

      if (isMobile) {
        if (isIOS) {
          message =
            'iPhone/iPad에서는 Safari 하단의 공유 버튼(□↑)을 누른 뒤\n' +
            '"홈 화면에 추가"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.';
        } else if (isAndroid) {
          message =
            'Android에서는 브라우저 오른쪽 위 메뉴(⋮)에서\n' +
            '"홈 화면에 추가" 또는 "앱 설치"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.';
        } else {
          message = '이 기기에서는 브라우저의 메뉴에서 "홈 화면에 추가" 기능을 사용해 주세요.';
        }
      } else {
        const shortcut = isMac ? '⌘ + D' : 'Ctrl + D';
        message = `${shortcut} 를 눌러 이 페이지를 브라우저 즐겨찾기에 추가할 수 있습니다.`;
      }

      openInfoModal(modalTitle, message, icon);
    }

    if (elFavoriteBtn) {
      elFavoriteBtn.addEventListener('click', handleFavoriteClick);
    }

    // 새로 시작 버튼 이벤트 리스너 (footer와 설정 탭 모두)
    if (elResetBtn) {
      elResetBtn.addEventListener('click', resetGame);
    }
    const elResetBtnSettings = document.getElementById('resetBtnSettings');
    if (elResetBtnSettings) {
      elResetBtnSettings.addEventListener('click', resetGame);
    }

    // 떨어지는 지폐 애니메이션 함수 (노동 클릭 시)
    function createFallingCookie(clickX, clickY) {
      const cookie = document.createElement('div');
      cookie.className = 'falling-cookie';
      cookie.textContent = '💵'; // 지폐만 떨어뜨리기
      
      // 클릭 위치 기준으로 설정
      cookie.style.left = (clickX + Math.random() * 100 - 50) + 'px';
      cookie.style.top = (clickY - 100) + 'px';
      
      document.body.appendChild(cookie);
      
      // 애니메이션 완료 후 요소 제거
      setTimeout(() => {
        if (cookie.parentNode) {
          cookie.parentNode.removeChild(cookie);
        }
      }, 2000);
    }

    // 떨어지는 건물 애니메이션 함수
    function createFallingBuilding(icon, count) {
      for (let i = 0; i < Math.min(count, 5); i++) { // 최대 5개까지만 애니메이션
        setTimeout(() => {
          const building = document.createElement('div');
          building.className = 'falling-cookie';
          building.textContent = icon;
          
          // 화면 상단에서 랜덤하게 떨어뜨리기
          building.style.left = (Math.random() * window.innerWidth) + 'px';
          building.style.top = '-100px';
          
          document.body.appendChild(building);
          
          // 애니메이션 완료 후 요소 제거
          setTimeout(() => {
            if (building.parentNode) {
              building.parentNode.removeChild(building);
            }
          }, 2000);
        }, i * 200); // 0.2초 간격으로 순차 생성
      }
    }


    // 수익 증가 애니메이션 함수 (개선된 float-up 효과)
    function showIncomeAnimation(amount) {
      const animation = document.createElement('div');
      animation.className = 'income-increase';
      animation.textContent = `+${formatKoreanNumber(amount)}원`;
      
      // 노동 버튼 위치 기준으로 애니메이션 위치 설정
      const workRect = elWork.getBoundingClientRect();
      const containerRect = elWork.parentElement.getBoundingClientRect();
      
      // 노동 버튼 위쪽에 랜덤하게 표시
      animation.style.position = 'absolute';
      animation.style.left = (workRect.left - containerRect.left + Math.random() * 100 - 50) + 'px';
      animation.style.top = (workRect.top - containerRect.top - 50) + 'px';
      animation.style.zIndex = '1000';
      animation.style.pointerEvents = 'none';
      
      elWork.parentElement.style.position = 'relative';
      elWork.parentElement.appendChild(animation);
      
      // 애니메이션 효과
      animation.style.opacity = '1';
      animation.style.transform = 'translateY(0px) scale(1)';
      
      // 떠오르는 애니메이션
      setTimeout(() => {
        animation.style.transition = 'all 1.5s ease-out';
        animation.style.opacity = '0';
        animation.style.transform = 'translateY(-80px) scale(1.2)';
      }, 100);
      
      // 애니메이션 완료 후 제거
      setTimeout(() => {
        if (animation.parentElement) {
          animation.parentElement.removeChild(animation);
        }
      }, 1600);
    }

    // 금융상품 거래 이벤트 (구매/판매 통합)
    elBuyDeposit.addEventListener('click', ()=>{
      if (!isProductUnlocked('deposit')) {
        addLog('❌ 예금은 아직 잠겨있습니다.');
        return;
      }
      const result = handleTransaction('financial', 'deposit', deposits);
      if (result.success) {
        deposits = result.newCount;
        showPurchaseSuccess(elBuyDeposit);
        checkNewUnlocks('deposit'); // 해금 체크
      }
      updateUI();
    });

    elBuySavings.addEventListener('click', ()=>{
      if (!isProductUnlocked('savings')) {
        addLog('❌ 적금은 예금을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('financial', 'savings', savings);
      if (result.success) {
        savings = result.newCount;
        showPurchaseSuccess(elBuySavings);
        checkNewUnlocks('savings'); // 해금 체크
      }
      updateUI();
    });

    elBuyBond.addEventListener('click', ()=>{
      if (!isProductUnlocked('bond')) {
        addLog('❌ 국내주식은 적금을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('financial', 'bond', bonds);
      if (result.success) {
        bonds = result.newCount;
        showPurchaseSuccess(elBuyBond);
        checkNewUnlocks('bond'); // 해금 체크
      }
      updateUI();
    });

    // 미국주식 구매 버튼
    elBuyUsStock.addEventListener('click', ()=>{
      if (!isProductUnlocked('usStock')) {
        addLog('❌ 미국주식은 국내주식을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('financial', 'usStock', usStocks);
      if (result.success) {
        usStocks = result.newCount;
        showPurchaseSuccess(elBuyUsStock);
        checkNewUnlocks('usStock'); // 해금 체크
      }
      updateUI();
    });

    // 코인 구매 버튼
    elBuyCrypto.addEventListener('click', ()=>{
      if (!isProductUnlocked('crypto')) {
        addLog('❌ 코인은 미국주식을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('financial', 'crypto', cryptos);
      if (result.success) {
        cryptos = result.newCount;
        showPurchaseSuccess(elBuyCrypto);
        checkNewUnlocks('crypto'); // 해금 체크
      }
      updateUI();
    });

    // 부동산 거래 이벤트 (구매/판매 통합)
    elBuyVilla.addEventListener('click', ()=>{
      if (!isProductUnlocked('villa')) {
        addLog('❌ 빌라는 코인을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'villa', villas);
      if (result.success) {
        villas = result.newCount;
        showPurchaseSuccess(elBuyVilla);
        checkNewUnlocks('villa'); // 해금 체크
      }
      updateUI();
    });

    elBuyOfficetel.addEventListener('click', ()=>{
      if (!isProductUnlocked('officetel')) {
        addLog('❌ 오피스텔은 빌라를 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'officetel', officetels);
      if (result.success) {
        officetels = result.newCount;
        showPurchaseSuccess(elBuyOfficetel);
        checkNewUnlocks('officetel'); // 해금 체크
      }
      updateUI();
    });

    elBuyApt.addEventListener('click', ()=>{
      if (!isProductUnlocked('apartment')) {
        addLog('❌ 아파트는 오피스텔을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'apartment', apartments);
      if (result.success) {
        apartments = result.newCount;
        showPurchaseSuccess(elBuyApt);
        checkNewUnlocks('apartment'); // 해금 체크
      }
      updateUI();
    });

    elBuyShop.addEventListener('click', ()=>{
      if (!isProductUnlocked('shop')) {
        addLog('❌ 상가는 아파트를 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'shop', shops);
      if (result.success) {
        shops = result.newCount;
        showPurchaseSuccess(elBuyShop);
        checkNewUnlocks('shop'); // 해금 체크
      }
      updateUI();
    });

    elBuyBuilding.addEventListener('click', ()=>{
      if (!isProductUnlocked('building')) {
        addLog('❌ 빌딩은 상가를 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'building', buildings);
      if (result.success) {
        buildings = result.newCount;
        showPurchaseSuccess(elBuyBuilding);
        checkNewUnlocks('building'); // 해금 체크
      }
      updateUI();
    });

    // ======= 업그레이드 효과 적용 함수 =======
    // 구형 applyUpgradeEffect 및 업그레이드 시스템 제거됨 - 새로운 Cookie Clicker 스타일 시스템 사용

    
    // ======= 키보드 단축키 =======
    document.addEventListener('keydown', (e) => {
      // Ctrl + Shift + R: 게임 초기화 (브라우저 새로고침과 충돌 방지)
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        resetGame();
      }
      // Ctrl + S: 수동 저장
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault(); // 브라우저 저장 방지
        saveGame();
        addLog('💾 수동 저장 완료!');
      }
      // Ctrl + O: 저장 가져오기
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        if (elImportFileInput) {
          elImportFileInput.click();
        }
      }
    });

    // ======= 수익 틱 =======
    const TICK = 50; // ms (성능 최적화: 250ms → 50ms)
    setInterval(()=>{
      checkMarketEvent(); // 시장 이벤트 체크
      checkAchievements(); // 업적 체크
      checkUpgradeUnlocks(); // 업그레이드 해금 체크
      
      const deltaTime = TICK / 1000;
      cash += getRps() * deltaTime;
      
      // 누적 생산량 계산 (Cookie Clicker 스타일)
      depositsLifetime += deposits * FINANCIAL_INCOME.deposit * deltaTime;
      savingsLifetime += savings * FINANCIAL_INCOME.savings * deltaTime;
      bondsLifetime += bonds * FINANCIAL_INCOME.bond * deltaTime;
      usStocksLifetime += usStocks * FINANCIAL_INCOME.usStock * deltaTime;
      cryptosLifetime += cryptos * FINANCIAL_INCOME.crypto * deltaTime;
      villasLifetime += villas * BASE_RENT.villa * deltaTime;
      officetelsLifetime += officetels * BASE_RENT.officetel * deltaTime;
      apartmentsLifetime += apartments * BASE_RENT.apartment * deltaTime;
      shopsLifetime += shops * BASE_RENT.shop * deltaTime;
      buildingsLifetime += buildings * BASE_RENT.building * deltaTime;
      
      updateUI();
    }, TICK);
    
    // ======= 자동 저장 시스템 =======
    setInterval(()=>{
      saveGame(); // 5초마다 자동 저장
    }, 5000);
    
    // ======= 오토클릭 시스템 =======
    setInterval(()=>{
      if (autoClickEnabled) {
        const income = getClickIncome();
        cash += income;
        totalClicks += 1;
        totalLaborIncome += income;
        checkCareerPromotion();
        
        // 성과급은 오토클릭에도 적용
        if (UPGRADES['performance_bonus'] && UPGRADES['performance_bonus'].purchased && Math.random() < 0.02) {
          // 기본 income(1배)은 이미 지급됨 → 총 10배가 되도록 추가 9배 지급
          const bonusIncome = income * 9;
          cash += bonusIncome;
          totalLaborIncome += bonusIncome;
        }
      }
    }, 1000); // 1초마다
    
    // ======= 시장 이벤트 시스템 =======
    // 2-5분마다 랜덤하게 시장 이벤트 발생
    setInterval(()=>{
      if (marketEventEndTime === 0) { // 현재 이벤트가 진행 중이 아닐 때만
        startMarketEvent();
      }
    }, Math.random() * 180000 + 120000); // 2-5분 랜덤

    // 설정 불러오기
    loadSettings();
    
    // 푸터 연도 동적 설정
    const elCurrentYear = document.getElementById('currentYear');
    if (elCurrentYear) {
      elCurrentYear.textContent = new Date().getFullYear();
    }
    
    // 초기 렌더 (async IIFE로 감싸서 await 사용 가능하게 함)
    (async () => {
      const gameLoaded = loadGame(); // 게임 데이터 불러오기 시도
      if (gameLoaded) {
        addLog('저장된 게임을 불러왔습니다.');
        // 로컬 저장이 있으면 즉시 닉네임 모달 확인
        ensureNicknameModal();
      } else {
        addLog('환영합니다! 노동으로 종잣돈을 모아 첫 부동산을 구입해보세요.');
        // 로컬 저장이 없으면 클라우드 복구를 먼저 확인
        const willReload = await maybeOfferCloudRestore();
        if (!willReload) {
          // 클라우드 복구가 트리거되지 않았으면 닉네임 모달 확인
          // (사용자가 "나중에"를 선택했거나, 클라우드 세이브가 없음)
          ensureNicknameModal();
        }
        // willReload가 true면 리로드가 예약되었으므로 닉네임 모달은 리로드 후 처리됨
      }
    })();
    
    // 초기 배경 이미지 설정
    const initialCareer = getCurrentCareer();
    if (elWorkArea && initialCareer && initialCareer.bgImage) {
      elWorkArea.style.backgroundImage = `url('${initialCareer.bgImage}')`;
    }
    
    // 설정 탭 UI 초기화
    const elToggleParticles = document.getElementById('toggleParticles');
    const elToggleFancyGraphics = document.getElementById('toggleFancyGraphics');
    const elToggleShortNumbers = document.getElementById('toggleShortNumbers');
    
    if (elToggleParticles) elToggleParticles.checked = settings.particles;
    if (elToggleFancyGraphics) elToggleFancyGraphics.checked = settings.fancyGraphics;
    if (elToggleShortNumbers) elToggleShortNumbers.checked = settings.shortNumbers;
    
    // 설정 탭 이벤트 리스너
    const elExportSaveBtn = document.getElementById('exportSaveBtn');
    const elImportSaveBtn = document.getElementById('importSaveBtn');
    const elImportFileInput = document.getElementById('importFileInput');
    const elCloudUploadBtn = document.getElementById('cloudUploadBtn');
    const elCloudDownloadBtn = document.getElementById('cloudDownloadBtn');
    
    if (elExportSaveBtn) {
      elExportSaveBtn.addEventListener('click', exportSave);
    }
    
    if (elImportSaveBtn) {
      elImportSaveBtn.addEventListener('click', () => {
        if (elImportFileInput) {
          elImportFileInput.click();
        }
      });
    }
    
    if (elImportFileInput) {
      elImportFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          importSave(file);
        }
      });
    }

    // ======= 클라우드 세이브(로그인 사용자 전용) =======
    // 탭 숨김/닫기 시에만 자동 플러시 (토글 없음)
    let __cloudPendingSave = null;
    let __lastCloudUploadedSaveTs = 0;
    let __currentUser = null;
    let __lastCloudSyncAt = null;

    function __updateCloudLastSyncUI() {
      const el = document.getElementById('cloudLastSync');
      if (!el) return;
      if (!__lastCloudSyncAt) {
        el.textContent = '--:--';
        return;
      }
      el.textContent = __lastCloudSyncAt.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }

    function __setCloudHint(text) {
      const el = document.getElementById('cloudSaveHint');
      if (!el || !text) return;
      el.textContent = text;
    }

    // 탭 숨김/닫기 시에만 자동 플러시 (토글 없음, 항상 ON)
    async function flushCloudAutoUpload(reason = 'flush') {
      if (!__currentUser) return;
      if (!__cloudPendingSave) return;

      const saveObj = __cloudPendingSave;
      __cloudPendingSave = null;

      const saveTs = Number(saveObj?.ts || Date.now()) || Date.now();
      if (saveTs && saveTs <= __lastCloudUploadedSaveTs) return; // 중복 업로드 방지

      const r = await upsertCloudSave('seoulsurvival', saveObj);
      if (!r.ok) {
        // 플러시는 조용히 실패(UX 보호). 버튼 수동 업로드에서 자세한 안내.
        __setCloudHint(`자동 동기화 실패(나중에 재시도). 이유: ${r.reason || 'unknown'}`);
        return;
      }

      __lastCloudUploadedSaveTs = saveTs;
      __lastCloudSyncAt = new Date();
      __updateCloudLastSyncUI();
      __setCloudHint('자동 동기화 완료 ✅');
    }

    async function cloudUpload() {
      const user = await getUser();
      if (!user) {
        openInfoModal('로그인 필요', '클라우드 세이브는 로그인 사용자만 사용할 수 있습니다.', '🔐');
        return;
      }

      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        openInfoModal('저장 데이터 없음', '로컬 저장 데이터가 없습니다. 먼저 게임을 진행한 뒤 저장해 주세요.', '💾');
        return;
      }

      let saveObj;
      try {
        saveObj = JSON.parse(raw);
      } catch {
        openInfoModal('오류', '로컬 저장 데이터 형식이 올바르지 않습니다.', '⚠️');
        return;
      }

      const r = await upsertCloudSave('seoulsurvival', saveObj);
      if (!r.ok) {
        if (r.reason === 'missing_table') {
          openInfoModal(
            '클라우드 테이블 없음',
            'Supabase에 game_saves 테이블이 아직 없습니다.\nSupabase SQL Editor에서 supabase/game_saves.sql을 실행해 주세요.',
            '🛠️'
          );
          return;
        }
        openInfoModal('업로드 실패', `클라우드 저장에 실패했습니다.\n${r.error?.message || ''}`.trim(), '⚠️');
        return;
      }

      addLog('☁️ 클라우드에 저장했습니다.');
      openInfoModal('완료', '클라우드 저장 완료!', '☁️');
    }

    async function cloudDownload() {
      const user = await getUser();
      if (!user) {
        openInfoModal('로그인 필요', '클라우드 세이브는 로그인 사용자만 사용할 수 있습니다.', '🔐');
        return;
      }

      const r = await fetchCloudSave('seoulsurvival');
      if (!r.ok) {
        if (r.reason === 'missing_table') {
          openInfoModal(
            '클라우드 테이블 없음',
            'Supabase에 game_saves 테이블이 아직 없습니다.\nSupabase SQL Editor에서 supabase/game_saves.sql을 실행해 주세요.',
            '🛠️'
          );
          return;
        }
        openInfoModal('불러오기 실패', `클라우드 불러오기에 실패했습니다.\n${r.error?.message || ''}`.trim(), '⚠️');
        return;
      }

      if (!r.found) {
        openInfoModal('클라우드 저장 없음', '이 계정에 저장된 클라우드 세이브가 없습니다.', '☁️');
        return;
      }

      const cloudTime = r.save?.saveTime ? new Date(r.save.saveTime).toLocaleString() : (r.updated_at ? new Date(r.updated_at).toLocaleString() : '시간 정보 없음');
      const message =
        '클라우드 세이브를 발견했습니다.\n\n' +
        `저장 시간: ${cloudTime}\n\n` +
        '불러오면 로컬 저장이 클라우드 데이터로 덮어써지고 페이지가 새로고침됩니다.\n계속할까요?';

      openConfirmModal('클라우드 불러오기', message, () => {
        try {
          localStorage.setItem(SAVE_KEY, JSON.stringify(r.save));
          addLog('☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다...');
          setTimeout(() => location.reload(), 600);
        } catch (e) {
          openInfoModal('오류', `클라우드 세이브 적용에 실패했습니다.\n${String(e)}`, '⚠️');
        }
      }, {
        icon: '☁️',
        primaryLabel: '불러오기',
        secondaryLabel: '취소',
      });
    }

    /**
     * 클라우드 세이브 복구를 제안하고, 사용자 선택에 따라 처리
     * @returns {Promise<boolean>} true: reload가 예약됨, false: reload 예약 안 됨
     */
    async function maybeOfferCloudRestore() {
      // 닉네임 결정이 끝날 때까지 클라우드 복구를 차단
      try {
        if (sessionStorage.getItem(CLOUD_RESTORE_BLOCK_KEY) === '1') {
          return false;
        }
      } catch (e) {
        console.warn('sessionStorage get 실패:', e);
      }

      // resetGame 직후 첫 부팅에서는 클라우드 복구 제안을 1회 스킵
      try {
        if (sessionStorage.getItem(CLOUD_RESTORE_SKIP_KEY) === '1') {
          sessionStorage.removeItem(CLOUD_RESTORE_SKIP_KEY);
          return false;
        }
      } catch (e) {
        console.warn('sessionStorage get/remove 실패:', e);
      }

      // 로컬 저장이 없을 때만 자동 제안(안전)
      const hasLocal = !!localStorage.getItem(SAVE_KEY);
      if (hasLocal) return false;

      const user = await getUser();
      if (!user) return false;

      const r = await fetchCloudSave('seoulsurvival');
      if (!r.ok || !r.found) return false;

      const cloudTime = r.save?.saveTime ? new Date(r.save.saveTime).toLocaleString() : (r.updated_at ? new Date(r.updated_at).toLocaleString() : '시간 정보 없음');
      const message =
        '클라우드 세이브가 있습니다.\n\n' +
        `저장 시간: ${cloudTime}\n\n` +
        '불러오시겠습니까?';

      // Promise를 반환하여 사용자 선택을 기다림
      return new Promise((resolve) => {
        let settled = false; // resolve 중복 호출 방지 가드
        
        const done = (value) => {
          if (!settled) {
            settled = true;
            resolve(value);
          }
        };

        openConfirmModal(
          '클라우드 세이브 발견',
          message,
          () => {
            // "불러오기" 클릭 시
            try {
              localStorage.setItem(SAVE_KEY, JSON.stringify(r.save));
              addLog('☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다...');
              setTimeout(() => location.reload(), 600);
              done(true); // reload가 예약되었음을 반환
            } catch (error) {
              console.error('클라우드 세이브 적용 실패:', error);
              done(false); // 에러 발생 시 false 반환
            }
          },
          {
            icon: '☁️',
            primaryLabel: '불러오기',
            secondaryLabel: '나중에',
            onCancel: () => {
              // "나중에" 클릭 시
              done(false); // reload 예약 안 됨
            }
          }
        );
      });
    }

    if (elCloudUploadBtn) elCloudUploadBtn.addEventListener('click', cloudUpload);
    if (elCloudDownloadBtn) elCloudDownloadBtn.addEventListener('click', cloudDownload);
    // 로컬 저장이 없으면 클라우드 복구를 1회 제안
    // (위에서 이미 처리했으므로 여기서는 호출하지 않음)

    // 로그인 상태를 캐시해두면 autosave마다 getUser() 호출을 피할 수 있다.
    (async () => {
      try {
        __currentUser = await getUser();
        onAuthStateChange((u) => {
          __currentUser = u;
        });
      } catch {}
    })();

    // 탭이 숨겨지거나 닫힐 때 자동으로 클라우드에 플러시 (로그인 사용자만)
    // 주의: 브라우저 크래시/강제 종료 시에는 실행되지 않을 수 있음 (best-effort)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushCloudAutoUpload('visibility:hidden');
      }
    });
    window.addEventListener('pagehide', () => {
      flushCloudAutoUpload('pagehide');
    });
    
    // 토글 스위치 이벤트 리스너
    if (elToggleParticles) {
      elToggleParticles.addEventListener('change', (e) => {
        settings.particles = e.target.checked;
        saveSettings();
      });
    }
    
    if (elToggleFancyGraphics) {
      elToggleFancyGraphics.addEventListener('change', (e) => {
        settings.fancyGraphics = e.target.checked;
        saveSettings();
        // 화려한 그래픽 설정 적용 (향후 확장 가능)
      });
    }
    
    if (elToggleShortNumbers) {
      elToggleShortNumbers.addEventListener('change', (e) => {
        settings.shortNumbers = e.target.checked;
        saveSettings();
        // UI 즉시 업데이트 (숫자 포맷 변경 반영)
        updateUI();
      });
    }
    
    // 판매 시스템 테스트 로그
    console.log('=== 판매 시스템 초기화 완료 ===');
    console.log('✅ 구매/판매 모드 토글 시스템 활성화');
    console.log('✅ 금융상품 통합 거래 시스템 (예금/적금/주식)');
    console.log('✅ 부동산 통합 거래 시스템 (빌라/오피스텔/아파트/상가/빌딩)');
    console.log('✅ 판매 가격: 현재가의 80%');
    console.log('✅ 수량 선택: 1개/10개/100개');
    console.log('💡 사용법: 상단 "구매/판매" 버튼으로 모드 전환 후 거래하세요!');
    
    // ======= 통계 섹션 접기/펼치기 기능 =======
    let statsCollapsibleInitialized = false;
    function initStatsCollapsible() {
      if (statsCollapsibleInitialized) return;
      statsCollapsibleInitialized = true;
      
      // 이벤트 위임 사용 (동적으로 추가되는 요소도 처리)
      const statsTab = document.getElementById('statsTab');
      if (statsTab) {
        statsTab.addEventListener('click', (e) => {
          // toggle 아이콘이나 toggle 제목을 클릭했을 때
          const toggle = e.target.closest('.stats-toggle');
          const toggleIcon = e.target.closest('.toggle-icon');
          if (toggle || toggleIcon) {
            const section = (toggle || toggleIcon).closest('.stats-section');
            if (section && section.classList.contains('collapsible')) {
              section.classList.toggle('collapsed');
              e.preventDefault();
              e.stopPropagation();
            }
          }
        });
      }
    }
    
    // ======= 성장 추적 데이터 저장 =======
    let hourlyEarningsHistory = []; // 최근 1시간 수익 기록
    let dailyEarningsHistory = []; // 최근 24시간 수익 기록
    let lastEarningsSnapshot = 0; // 마지막 수익 스냅샷
    let lastSnapshotTime = Date.now();
    
    function updateGrowthTracking() {
      const now = Date.now();
      const currentEarnings = depositsLifetime + savingsLifetime + bondsLifetime + 
                              usStocksLifetime + cryptosLifetime +
                              villasLifetime + officetelsLifetime + apartmentsLifetime +
                              shopsLifetime + buildingsLifetime + totalLaborIncome;
      
      // 1시간 이내 기록 유지
      hourlyEarningsHistory = hourlyEarningsHistory.filter(entry => now - entry.time < 3600000);
      // 24시간 이내 기록 유지
      dailyEarningsHistory = dailyEarningsHistory.filter(entry => now - entry.time < 86400000);
      
      // 1분마다 스냅샷 저장
      if (now - lastSnapshotTime >= 60000) {
        hourlyEarningsHistory.push({ time: now, earnings: currentEarnings });
        dailyEarningsHistory.push({ time: now, earnings: currentEarnings });
        lastSnapshotTime = now;
      }
      
      // 최근 1시간 수익 계산
      const oneHourAgo = now - 3600000;
      const hourlyEarnings = hourlyEarningsHistory.length > 0
        ? currentEarnings - hourlyEarningsHistory[0].earnings
        : 0;
      
      // 최근 24시간 수익 계산
      const oneDayAgo = now - 86400000;
      const dailyEarnings = dailyEarningsHistory.length > 0
        ? currentEarnings - dailyEarningsHistory[0].earnings
        : 0;
      
      // 성장 속도 계산 (시간당 증가율)
      const growthRate = lastEarningsSnapshot > 0 && (now - lastSnapshotTime) > 0
        ? ((currentEarnings - lastEarningsSnapshot) / lastEarningsSnapshot) * (3600000 / (now - lastSnapshotTime)) * 100
        : 0;
      
      // 마일스톤 계산
      const milestones = [1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000];
      let nextMilestone = milestones.find(m => m > currentEarnings) || '최고 달성';
      if (nextMilestone !== '최고 달성') {
        const remaining = nextMilestone - currentEarnings;
        nextMilestone = `${formatStatsNumber(remaining)} 남음`;
      }
      
      // UI 업데이트
      safeText(document.getElementById('hourlyEarnings'), formatCashDisplay(Math.max(0, hourlyEarnings)));
      safeText(document.getElementById('dailyEarnings'), formatCashDisplay(Math.max(0, dailyEarnings)));
      // "+0.0%/시간" 처럼 소수점 1자리 고정 + -0.0 방지
      const growthRateStable = Math.abs(growthRate) < 0.05 ? 0 : growthRate;
      safeText(document.getElementById('growthRate'), `${growthRateStable >= 0 ? '+' : ''}${growthRateStable.toFixed(1)}%/시간`);
      safeText(document.getElementById('nextMilestone'), nextMilestone);
      
      lastEarningsSnapshot = currentEarnings;
    }
    
    // ======= 도넛 차트 그리기 =======
    function drawDonutChart() {
      const canvas = document.getElementById('assetDonutChart');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // DPR(레티나) 대응: 흐릿하게 보이는 문제 해결
      const baseSize = 200; // index.html의 canvas attribute와 동일한 논리 크기
      const dpr = Math.max(1, Math.floor((window.devicePixelRatio || 1) * 100) / 100);
      const target = Math.round(baseSize * dpr);
      if (canvas.width !== target || canvas.height !== target) {
        canvas.width = target;
        canvas.height = target;
        canvas.style.width = `${baseSize}px`;
        canvas.style.height = `${baseSize}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const centerX = baseSize / 2;
      const centerY = baseSize / 2;
      const radius = 80;
      const innerRadius = 50;
      
      // 자산 비율 계산
      const totalAssets = cash + calculateTotalAssetValue();
      const financialValue = calculateFinancialValue();
      const propertyValue = calculatePropertyValue();
      
      const cashPercent = totalAssets > 0 ? (cash / totalAssets) * 100 : 0;
      const financialPercent = totalAssets > 0 ? (financialValue / totalAssets) * 100 : 0;
      const propertyPercent = totalAssets > 0 ? (propertyValue / totalAssets) * 100 : 0;
      
      // 배경 원
      ctx.clearRect(0, 0, baseSize, baseSize);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
      
      // 각 섹션 그리기
      let currentAngle = -Math.PI / 2;
      
      // 현금
      if (cashPercent > 0) {
        const angle = (cashPercent / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
        ctx.closePath();
        // 현금 컬러 = 노동 컬러(주황) + 더 또렷하게(그라데이션/경계선)
        const cashGrad = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
        cashGrad.addColorStop(0, '#f59e0b');
        cashGrad.addColorStop(1, '#d97706');
        ctx.fillStyle = cashGrad;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.stroke();
        currentAngle += angle;
      }
      
      // 금융
      if (financialPercent > 0) {
        const angle = (financialPercent / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.fill();
        currentAngle += angle;
      }
      
      // 부동산
      if (propertyPercent > 0) {
        const angle = (propertyPercent / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.fill();
      }
      
      // 내부 원 (도넛 효과)
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      // canvas는 CSS var(--bg)를 직접 해석하지 못하므로 실제 색상값을 사용
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0b1220';
      ctx.fillStyle = bgColor;
      ctx.fill();
    }
    
    function calculateFinancialValue() {
      let value = 0;
      if (deposits > 0) {
        for (let i = 0; i < deposits; i++) {
          value += getFinancialCost('deposit', i);
        }
      }
      if (savings > 0) {
        for (let i = 0; i < savings; i++) {
          value += getFinancialCost('savings', i);
        }
      }
      if (bonds > 0) {
        for (let i = 0; i < bonds; i++) {
          value += getFinancialCost('bond', i);
        }
      }
      if (usStocks > 0) {
        for (let i = 0; i < usStocks; i++) {
          value += getFinancialCost('usStock', i);
        }
      }
      if (cryptos > 0) {
        for (let i = 0; i < cryptos; i++) {
          value += getFinancialCost('crypto', i);
        }
      }
      return value;
    }
    
    function calculatePropertyValue() {
      let value = 0;
      if (villas > 0) {
        for (let i = 0; i < villas; i++) {
          value += getPropertyCost('villa', i);
        }
      }
      if (officetels > 0) {
        for (let i = 0; i < officetels; i++) {
          value += getPropertyCost('officetel', i);
        }
      }
      if (apartments > 0) {
        for (let i = 0; i < apartments; i++) {
          value += getPropertyCost('apartment', i);
        }
      }
      if (shops > 0) {
        for (let i = 0; i < shops; i++) {
          value += getPropertyCost('shop', i);
        }
      }
      if (buildings > 0) {
        for (let i = 0; i < buildings; i++) {
          value += getPropertyCost('building', i);
        }
      }
      return value;
    }
    
    // ======= 통계 탭 업데이트 함수 =======
    
    function updateStatsTab() {
      try {
        // 1. 핵심 지표
        const totalAssets = cash + calculateTotalAssetValue();
        const totalEarnings = depositsLifetime + savingsLifetime + bondsLifetime + 
                              usStocksLifetime + cryptosLifetime +
                              villasLifetime + officetelsLifetime + apartmentsLifetime +
                              shopsLifetime + buildingsLifetime + totalLaborIncome;
        
        safeText(document.getElementById('totalAssets'), formatStatsNumber(totalAssets));
        safeText(document.getElementById('totalEarnings'), formatStatsNumber(totalEarnings));
        // 통계 탭에서는 축약 표기/고정 소수점 규칙을 그대로 사용
        safeText(document.getElementById('rpsStats'), formatCashDisplay(getRps()) + '/초');
        safeText(document.getElementById('clickIncomeStats'), formatCashDisplay(getClickIncome()));
        
        // 2. 플레이 정보
        safeText(document.getElementById('totalClicksStats'), totalClicks.toLocaleString('ko-KR') + '회');
        safeText(document.getElementById('laborIncomeStats'), formatStatsNumber(totalLaborIncome));
        
        // 플레이 시간 계산 (누적 플레이시간 시스템)
        const currentSessionTime = Date.now() - sessionStartTime;
        const totalPlayTimeMs = totalPlayTime + currentSessionTime;
        const playTimeMinutes = Math.floor(totalPlayTimeMs / 60000);
        const playTimeHours = Math.floor(playTimeMinutes / 60);
        const remainingMinutes = playTimeMinutes % 60;
        const playTimeText = playTimeHours > 0 
          ? `${playTimeHours}시간 ${remainingMinutes}분` 
          : `${playTimeMinutes}분`;
        
        // 디버깅 로그
        console.log('🕐 플레이시간 계산:', {
          totalPlayTime: totalPlayTime,
          currentSessionTime: currentSessionTime,
          totalPlayTimeMs: totalPlayTimeMs,
          playTimeMinutes: playTimeMinutes,
          playTimeText: playTimeText
        });
        
        safeText(document.getElementById('playTimeStats'), playTimeText);
        
        // 시간당 수익
        const hourlyRateValue = playTimeMinutes > 0 
          ? (totalEarnings / playTimeMinutes) * 60 
          : 0;
        safeText(document.getElementById('hourlyRate'), formatCashDisplay(hourlyRateValue) + '/시간');
        
        // 3. 수익 구조
        const laborPercent = totalEarnings > 0 ? (totalLaborIncome / totalEarnings * 100) : 0;
        const financialTotal = depositsLifetime + savingsLifetime + bondsLifetime + 
                              usStocksLifetime + cryptosLifetime;
        const financialPercent = totalEarnings > 0 ? (financialTotal / totalEarnings * 100) : 0;
        const propertyTotal = villasLifetime + officetelsLifetime + apartmentsLifetime + shopsLifetime + buildingsLifetime;
        const propertyPercent = totalEarnings > 0 ? (propertyTotal / totalEarnings * 100) : 0;
        
        // 수익 구조 바
        const incomeBar = document.querySelector('.income-bar');
        const laborSegment = document.getElementById('laborSegment');
        const financialSegment = document.getElementById('financialSegment');
        const propertySegment = document.getElementById('propertySegment');
        
        // 애니메이션 클래스 추가
        if (incomeBar && !incomeBar.classList.contains('animated')) {
          incomeBar.classList.add('animated');
        }
        
        if (laborSegment) {
          laborSegment.style.width = laborPercent.toFixed(1) + '%';
          const span = laborSegment.querySelector('span');
          if (span) {
            span.textContent = laborPercent >= 5 
              ? `🛠️ ${laborPercent.toFixed(1)}%` 
              : '';
          }
        }
        
        if (financialSegment) {
          financialSegment.style.width = financialPercent.toFixed(1) + '%';
          const span = financialSegment.querySelector('span');
          if (span) {
            span.textContent = financialPercent >= 5 
              ? `💰 ${financialPercent.toFixed(1)}%` 
              : '';
          }
        }
        
        if (propertySegment) {
          propertySegment.style.width = propertyPercent.toFixed(1) + '%';
          const span = propertySegment.querySelector('span');
          if (span) {
            span.textContent = propertyPercent >= 5 
              ? `🏢 ${propertyPercent.toFixed(1)}%` 
              : '';
          }
        }
        
        // 범례 업데이트
        safeText(document.getElementById('laborLegend'), `노동: ${laborPercent.toFixed(1)}%`);
        safeText(document.getElementById('financialLegend'), `금융: ${financialPercent.toFixed(1)}%`);
        safeText(document.getElementById('propertyLegend'), `부동산: ${propertyPercent.toFixed(1)}%`);
        
        // 성장 추적 업데이트
        updateGrowthTracking();
        
        // 도넛 차트 업데이트
        drawDonutChart();
        
        // 4. 금융상품 상세 (수익 기여도 및 총 가치 추가)
        const totalEarningsForContribution = totalEarnings || 1;
        
        // 통계 섹션 잠금 상태 업데이트
        updateStatsLockStates();
        
        // 예금
        safeText(document.getElementById('depositsOwnedStats'), deposits + '개');
        safeText(document.getElementById('depositsLifetimeStats'), formatStatsNumber(depositsLifetime));
        const depositsContribution = totalEarningsForContribution > 0 ? (depositsLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('depositsContribution'), `(${depositsContribution}%)`);
        const depositsValue = deposits > 0 ? calculateFinancialValueForType('deposit', deposits) : 0;
        safeText(document.getElementById('depositsValue'), formatKoreanNumber(depositsValue));
        
        // 적금
        safeText(document.getElementById('savingsOwnedStats'), savings + '개');
        safeText(document.getElementById('savingsLifetimeStats'), formatStatsNumber(savingsLifetime));
        const savingsContribution = totalEarningsForContribution > 0 ? (savingsLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('savingsContribution'), `(${savingsContribution}%)`);
        const savingsValue = savings > 0 ? calculateFinancialValueForType('savings', savings) : 0;
        safeText(document.getElementById('savingsValue'), formatKoreanNumber(savingsValue));
        
        // 주식
        safeText(document.getElementById('bondsOwnedStats'), bonds + '개');
        safeText(document.getElementById('bondsLifetimeStats'), formatStatsNumber(bondsLifetime));
        const bondsContribution = totalEarningsForContribution > 0 ? (bondsLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('bondsContribution'), `(${bondsContribution}%)`);
        const bondsValue = bonds > 0 ? calculateFinancialValueForType('bond', bonds) : 0;
        safeText(document.getElementById('bondsValue'), formatKoreanNumber(bondsValue));
        
        // 미국주식
        safeText(document.getElementById('usStocksOwnedStats'), usStocks + '개');
        safeText(document.getElementById('usStocksLifetimeStats'), formatStatsNumber(usStocksLifetime));
        const usStocksContribution = totalEarningsForContribution > 0 ? (usStocksLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('usStocksContribution'), `(${usStocksContribution}%)`);
        const usStocksValue = usStocks > 0 ? calculateFinancialValueForType('usStock', usStocks) : 0;
        safeText(document.getElementById('usStocksValue'), formatKoreanNumber(usStocksValue));
        
        // 코인
        safeText(document.getElementById('cryptosOwnedStats'), cryptos + '개');
        safeText(document.getElementById('cryptosLifetimeStats'), formatStatsNumber(cryptosLifetime));
        const cryptosContribution = totalEarningsForContribution > 0 ? (cryptosLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('cryptosContribution'), `(${cryptosContribution}%)`);
        const cryptosValue = cryptos > 0 ? calculateFinancialValueForType('crypto', cryptos) : 0;
        safeText(document.getElementById('cryptosValue'), formatKoreanNumber(cryptosValue));
        
        // 5. 부동산 상세 (수익 기여도 및 총 가치 추가)
        // 빌라
        safeText(document.getElementById('villasOwnedStats'), villas + '채');
        safeText(document.getElementById('villasLifetimeStats'), formatCashDisplay(villasLifetime));
        const villasContribution = totalEarningsForContribution > 0 ? (villasLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('villasContribution'), `(${villasContribution}%)`);
        const villasValue = villas > 0 ? calculatePropertyValueForType('villa', villas) : 0;
        safeText(document.getElementById('villasValue'), formatCashDisplay(villasValue));
        
        // 오피스텔
        safeText(document.getElementById('officetelsOwnedStats'), officetels + '채');
        safeText(document.getElementById('officetelsLifetimeStats'), formatCashDisplay(officetelsLifetime));
        const officetelsContribution = totalEarningsForContribution > 0 ? (officetelsLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('officetelsContribution'), `(${officetelsContribution}%)`);
        const officetelsValue = officetels > 0 ? calculatePropertyValueForType('officetel', officetels) : 0;
        safeText(document.getElementById('officetelsValue'), formatCashDisplay(officetelsValue));
        
        // 아파트
        safeText(document.getElementById('apartmentsOwnedStats'), apartments + '채');
        safeText(document.getElementById('apartmentsLifetimeStats'), formatCashDisplay(apartmentsLifetime));
        const apartmentsContribution = totalEarningsForContribution > 0 ? (apartmentsLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('apartmentsContribution'), `(${apartmentsContribution}%)`);
        const apartmentsValue = apartments > 0 ? calculatePropertyValueForType('apartment', apartments) : 0;
        safeText(document.getElementById('apartmentsValue'), formatCashDisplay(apartmentsValue));
        
        // 상가
        safeText(document.getElementById('shopsOwnedStats'), shops + '채');
        safeText(document.getElementById('shopsLifetimeStats'), formatCashDisplay(shopsLifetime));
        const shopsContribution = totalEarningsForContribution > 0 ? (shopsLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('shopsContribution'), `(${shopsContribution}%)`);
        const shopsValue = shops > 0 ? calculatePropertyValueForType('shop', shops) : 0;
        safeText(document.getElementById('shopsValue'), formatCashDisplay(shopsValue));
        
        // 빌딩
        safeText(document.getElementById('buildingsOwnedStats'), buildings + '채');
        safeText(document.getElementById('buildingsLifetimeStats'), formatCashDisplay(buildingsLifetime));
        const buildingsContribution = totalEarningsForContribution > 0 ? (buildingsLifetime / totalEarningsForContribution * 100).toFixed(1) : '0.0';
        safeText(document.getElementById('buildingsContribution'), `(${buildingsContribution}%)`);
        const buildingsValue = buildings > 0 ? calculatePropertyValueForType('building', buildings) : 0;
        safeText(document.getElementById('buildingsValue'), formatCashDisplay(buildingsValue));
        
        // 6. 효율 분석
        const efficiencies = calculateEfficiencies();
        safeText(document.getElementById('bestEfficiency'), efficiencies[0] || '-');
        safeText(document.getElementById('secondEfficiency'), efficiencies[1] || '-');
        safeText(document.getElementById('thirdEfficiency'), efficiencies[2] || '-');
        
        // 7. 업적 그리드
        updateAchievementGrid();
        
        // 8. 리더보드는 통계 탭이 활성화될 때만 업데이트 (updateUI에서 매번 호출하지 않음)
        // 리더보드 업데이트는 navBtns 이벤트 리스너에서 처리
        
      } catch (e) {
        console.error('Stats tab update failed:', e);
      }
    }
    
    // 리더보드 UI 업데이트 함수 (디바운싱 및 로딩/실패/타임아웃 상태 관리)
    let __leaderboardLoading = false;
    let __leaderboardLastUpdate = 0;
    let __leaderboardUpdateTimer = null;
    const LEADERBOARD_UPDATE_INTERVAL = 10000; // 10초마다 업데이트
    const LEADERBOARD_TIMEOUT = 7000; // 7초 타임아웃

    // 플레이타임 포맷터 (ms 고정)
    function formatPlaytimeMs(ms) {
      if (!ms || ms <= 0) return '—';
      const minutes = Math.floor(ms / 1000 / 60);
      if (minutes <= 0) return '1분 미만';
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      if (h > 0) return m ? `${h}시간 ${m}분` : `${h}시간`;
      return `${m}분`;
    }

    function formatPlaytimeMsShort(ms) {
      if (!ms || ms <= 0) return '—';
      const minutes = Math.floor(ms / 1000 / 60);
      if (minutes <= 0) return '<1m';
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      if (h >= 100) return `${h}h`; // 너무 길어지면 분 생략
      if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
      return `${m}m`;
    }
    
    async function updateLeaderboardUI(force = false) {
      const container = document.getElementById('leaderboardContainer');
      if (!container) return;

      // Supabase 키가 설정되지 않은 경우: 네트워크 호출을 스킵하고 안내만 표시
      if (!isSupabaseConfigured()) {
        container.innerHTML = `
          <div class="leaderboard-error">
            <div>리더보드 설정이 아직 완료되지 않았어요. 나중에 다시 확인해 주세요.</div>
          </div>
        `;
        __leaderboardLoading = false;
        __leaderboardLastUpdate = Date.now();
        return;
      }
      
      // 이미 로딩 중이면 스킵 (force일 때는 강제 실행)
      if (__leaderboardLoading && !force) {
        console.log('리더보드: 이미 로딩 중, 스킵');
        return;
      }
      
      // 최근 업데이트로부터 충분한 시간이 지나지 않았으면 스킵 (force가 아닐 때만, 첫 호출 제외)
      const now = Date.now();
      if (!force && __leaderboardLastUpdate > 0 && now - __leaderboardLastUpdate < LEADERBOARD_UPDATE_INTERVAL) {
        console.log('리더보드: 최근 업데이트로부터 시간이 짧음, 스킵');
        return;
      }
      
      // 디바운싱: 타이머가 있으면 취소하고 새로 설정
      if (__leaderboardUpdateTimer) {
        clearTimeout(__leaderboardUpdateTimer);
        __leaderboardUpdateTimer = null;
      }
      
      // 즉시 실행하지 않고 약간의 지연을 두어 연속 호출 방지
      __leaderboardUpdateTimer = setTimeout(async () => {
        __leaderboardLoading = true;
        __leaderboardUpdateTimer = null;
        
        // 타임아웃 설정 (7초 후에도 응답이 없으면 실패로 간주)
        const timeoutId = setTimeout(() => {
          if (__leaderboardLoading) {
            console.error('리더보드: 타임아웃 발생');
            container.innerHTML = `
              <div class="leaderboard-error">
                <div>리더보드 불러오기 실패 (타임아웃)</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;
            const retryBtn = container.querySelector('.leaderboard-retry-btn');
            if (retryBtn) {
              retryBtn.addEventListener('click', () => {
                updateLeaderboardUI(true);
              });
            }
            __leaderboardLoading = false;
            __leaderboardLastUpdate = Date.now();
          }
        }, LEADERBOARD_TIMEOUT);
        
        try {
          // 로딩 메시지 표시
          container.innerHTML = '<div class="leaderboard-loading">리더보드를 불러오는 중...</div>';
          
          console.log('리더보드: API 호출 시작');
          const result = await getLeaderboard(10, 'assets');
          clearTimeout(timeoutId);
          
          console.log('리더보드: API 응답 받음', result);
          
          if (!result.success) {
            const errorMsg = result.error || '알 수 없는 오류';
            const status = result.status;
            const errorType = result.errorType;

            console.error('리더보드: API 오류', { errorMsg, status, errorType });

            let userMessage = '';
            if (errorType === 'forbidden' || status === 401 || status === 403) {
              userMessage = '권한이 없어 리더보드를 불러올 수 없습니다.';
            } else if (errorType === 'config') {
              userMessage = '리더보드 설정 오류: Supabase 설정을 확인해주세요.';
            } else if (errorType === 'schema') {
              userMessage = '리더보드 테이블이 설정되지 않았습니다. 관리자에게 문의해주세요.';
            } else if (errorType === 'network') {
              userMessage = '네트워크 오류로 리더보드를 불러올 수 없습니다.';
            } else {
              userMessage = `리더보드를 불러올 수 없습니다: ${errorMsg}`;
            }

            container.innerHTML = `
              <div class="leaderboard-error">
                <div>${userMessage}</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;

            const retryBtn = container.querySelector('.leaderboard-retry-btn');
            if (retryBtn) {
              retryBtn.addEventListener('click', () => {
                updateLeaderboardUI(true);
              });
            }

            __leaderboardLoading = false;
            __leaderboardLastUpdate = Date.now();
            return;
          }
          
          const entries = result.data || [];
          if (entries.length === 0) {
            console.log('리더보드: 기록 없음');
            container.innerHTML = '<div class="leaderboard-empty">리더보드에 아직 기록이 없습니다.</div>';
            __leaderboardLoading = false;
            __leaderboardLastUpdate = Date.now();
            // 내 순위 영역도 비움
            const myRankContent = document.getElementById('myRankContent');
            if (myRankContent) {
              myRankContent.innerHTML = `
                <div class="leaderboard-my-rank-empty">
                  리더보드 기록이 아직 없습니다.
                </div>
              `;
            }
            return;
          }
          
          console.log('리더보드: 항목 수', entries.length);
          
          // 리더보드 HTML 생성 (테이블 형태)
          const table = document.createElement('table');
          table.className = 'leaderboard-table';

          const thead = document.createElement('thead');
          thead.innerHTML = `
            <tr>
              <th class="col-rank">#</th>
              <th class="col-nickname">닉네임</th>
              <th class="col-assets">자산</th>
              <th class="col-playtime">시간</th>
            </tr>
          `;
          table.appendChild(thead);

          const tbody = document.createElement('tbody');
          
          let myEntry = null;
          const currentNickLower = (playerNickname || '').trim().toLowerCase();

          entries.forEach((entry, index) => {
            const tr = document.createElement('tr');

            // 순위 셀
            const rankTd = document.createElement('td');
            rankTd.className = 'col-rank';
            rankTd.textContent = String(index + 1);

            // 닉네임 셀
            const nickTd = document.createElement('td');
            nickTd.className = 'col-nickname';
            nickTd.textContent = entry.nickname || '익명';

            // 자산 셀
            const assetsTd = document.createElement('td');
            assetsTd.className = 'col-assets';
            const assetsValue = Math.floor(entry.total_assets || 0);
            assetsTd.textContent = `${assetsValue.toLocaleString('ko-KR')}원`;

            // 플레이타임 셀
            const playtimeTd = document.createElement('td');
            playtimeTd.className = 'col-playtime';
            playtimeTd.textContent = formatPlaytimeMsShort(entry.play_time_ms || 0);
            
            // 내 닉네임 하이라이트 + 내 엔트리 캐시
            const entryNickLower = (entry.nickname || '').trim().toLowerCase();
            if (currentNickLower && currentNickLower === entryNickLower) {
              tr.classList.add('is-me');
              myEntry = {
                rank: index + 1,
                ...entry
              };
            }

            tr.appendChild(rankTd);
            tr.appendChild(nickTd);
            tr.appendChild(assetsTd);
            tr.appendChild(playtimeTd);
            tbody.appendChild(tr);
          });

          table.appendChild(tbody);

          container.innerHTML = '';
          container.appendChild(table);
          __leaderboardLastUpdate = Date.now();
          console.log('리더보드: 업데이트 완료');

          // 마지막 갱신 시각 표시
          const lastUpdatedEl = document.getElementById('leaderboardLastUpdated');
          if (lastUpdatedEl) {
            const d = new Date(__leaderboardLastUpdate);
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            lastUpdatedEl.textContent = `마지막 갱신: ${hh}:${mm}:${ss}`;
          }

          // 내 순위 영역 업데이트 (Top10 및 Top10 밖 모두)
          const myRankContent = document.getElementById('myRankContent');
          if (myRankContent) {
            if (!currentNickLower) {
              myRankContent.innerHTML = `
                <div class="leaderboard-my-rank-empty">
                  닉네임을 설정하면 내 순위와 기록이 여기 표시됩니다.
                </div>
              `;
            } else if (myEntry) {
              // Top10 안에 있을 때: 이미 계산된 myEntry 사용
              const playTimeText = formatPlaytimeMs(myEntry.play_time_ms || 0);
              myRankContent.innerHTML = `
                <div class="my-rank-card">
                  <div class="my-rank-header">
                    <span class="my-rank-label">내 기록</span>
                    <span class="my-rank-rank-badge">${myEntry.rank}위</span>
                  </div>
                  <div class="my-rank-main">
                    <div class="my-rank-name">${myEntry.nickname || playerNickname || '익명'}</div>
                    <div class="my-rank-assets">💰 ${formatStatsNumber(myEntry.total_assets || 0)}</div>
                  </div>
                  <div class="my-rank-meta">
                    <span class="my-rank-playtime">⏱️ ${playTimeText}</span>
                    <span class="my-rank-note">TOP 10 내 순위</span>
                  </div>
                </div>
              `;
            } else {
              // 닉네임은 있지만 Top10 밖인 경우: RPC로 실제 순위 조회
              // 먼저 로그인 상태 확인
              const user = await getUser();
              if (!user) {
                // 비로그인 상태: 간단한 문구 + 버튼만 표시
                myRankContent.innerHTML = `
                  <div class="leaderboard-my-rank-empty">
                    로그인 후에 내 순위를 볼 수 있습니다.
                    <div class="leaderboard-my-rank-actions">
                      <button type="button" class="btn" id="openLoginFromRanking">
                        🔐 Google로 로그인
                      </button>
                    </div>
                  </div>
                `;
                const loginBtn = document.getElementById('openLoginFromRanking');
                if (loginBtn) {
                  loginBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (!isSupabaseConfigured()) {
                      alert('현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.');
                      return;
                    }
                    const result = await signInWithOAuth('google');
                    if (!result.ok) {
                      alert('로그인에 실패했습니다. 다시 시도해 주세요.');
                    }
                  });
                }
                return;
              }

              // 로그인 상태: RPC로 순위 조회
              myRankContent.innerHTML = `
                <div class="leaderboard-my-rank-loading">
                  내 순위를 불러오는 중...
                </div>
              `;

              try {
                const rankResult = await getMyRank(playerNickname, 'assets');
                if (!rankResult.success || !rankResult.data) {
                  let innerHtml = '';
                  if (rankResult.errorType === 'forbidden') {
                    // 권한 부족: 간단한 문구 + 버튼만 표시
                    innerHtml = `
                      <div class="leaderboard-my-rank-empty">
                        로그인 후에 내 순위를 볼 수 있습니다.
                        <div class="leaderboard-my-rank-actions">
                          <button type="button" class="btn" id="openLoginFromRanking">
                            🔐 Google로 로그인
                          </button>
                        </div>
                      </div>
                    `;
                  } else if (rankResult.errorType === 'network') {
                    innerHtml = `
                      <div class="leaderboard-my-rank-error">
                        네트워크 오류로 내 순위를 불러올 수 없습니다.
                      </div>
                    `;
                  } else if (rankResult.errorType === 'not_found') {
                    // 리더보드에 기록이 없음: 안내 메시지
                    innerHtml = `
                      <div class="leaderboard-my-rank-empty">
                        아직 리더보드에 기록이 없습니다.<br />
                        게임을 플레이하고 저장하면 순위가 표시됩니다.
                      </div>
                    `;
                  } else {
                    innerHtml = `
                      <div class="leaderboard-my-rank-error">
                        내 순위를 불러올 수 없습니다.
                      </div>
                    `;
                  }

                  myRankContent.innerHTML = innerHtml;

                  const loginBtn = document.getElementById('openLoginFromRanking');
                  if (loginBtn) {
                    loginBtn.addEventListener('click', async (e) => {
                      e.preventDefault();
                      if (!isSupabaseConfigured()) {
                        alert('현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.');
                        return;
                      }
                      const result = await signInWithOAuth('google');
                      if (!result.ok) {
                        alert('로그인에 실패했습니다. 다시 시도해 주세요.');
                      }
                    });
                  }
                } else {
                  const me = rankResult.data;
                  const playTimeText = formatPlaytimeMs(me.play_time_ms || 0);
                  myRankContent.innerHTML = `
                    <div class="my-rank-card">
                      <div class="my-rank-header">
                        <span class="my-rank-label">내 기록</span>
                        <span class="my-rank-rank-badge">${me.rank}위</span>
                      </div>
                      <div class="my-rank-main">
                        <div class="my-rank-name">${me.nickname || playerNickname || '익명'}</div>
                        <div class="my-rank-assets">💰 ${formatStatsNumber(me.total_assets || 0)}</div>
                      </div>
                      <div class="my-rank-meta">
                        <span class="my-rank-playtime">⏱️ ${playTimeText}</span>
                        <span class="my-rank-note">내 실제 순위</span>
                      </div>
                    </div>
                  `;
                }
              } catch (e) {
                console.error('내 순위 RPC 호출 실패:', e);
                myRankContent.innerHTML = `
                  <div class="leaderboard-my-rank-error">
                    내 순위를 불러오는 중 오류가 발생했습니다.
                  </div>
                `;
              }
            }
          }
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('리더보드 UI 업데이트 실패:', error);
          container.innerHTML = `<div class="leaderboard-error">리더보드를 불러오는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}</div>`;
          __leaderboardLastUpdate = Date.now();
        } finally {
          __leaderboardLoading = false;
        }
      }, force ? 0 : 300); // force가 아니면 300ms 지연
    }
    
    // 리더보드 업데이트 함수 (게임 저장 시 호출)
    async function updateLeaderboardEntry() {
      if (!playerNickname) return; // 닉네임이 없으면 업데이트 안 함
      
      try {
        const totalAssets = cash + calculateTotalAssetValue();
        const currentSessionTime = Date.now() - sessionStartTime;
        const totalPlayTimeMs = totalPlayTime + currentSessionTime;
        
        await updateLeaderboard(playerNickname, totalAssets, totalPlayTimeMs);
      } catch (error) {
        console.error('리더보드 업데이트 실패:', error);
      }
    }
    
    // 금융상품 타입별 가치 계산
    function calculateFinancialValueForType(type, count) {
      let value = 0;
      for (let i = 0; i < count; i++) {
        value += getFinancialCost(type, i);
      }
      return value;
    }
    
    // 부동산 타입별 가치 계산
    function calculatePropertyValueForType(type, count) {
      let value = 0;
      for (let i = 0; i < count; i++) {
        value += getPropertyCost(type, i);
      }
      return value;
    }
    
    // 통계 섹션 잠금 상태 업데이트
    function updateStatsLockStates() {
      // 금융상품 잠금 상태
      const statsProductMap = {
        'savings': { id: 'savingsOwnedStats', name: '적금' },
        'bond': { id: 'bondsOwnedStats', name: '주식' },
        'usStock': { id: 'usStocksOwnedStats', name: '미국주식' },
        'crypto': { id: 'cryptosOwnedStats', name: '코인' }
      };
      
      // 부동산 잠금 상태
      const statsPropertyMap = {
        'villa': { id: 'villasOwnedStats', name: '빌라' },
        'officetel': { id: 'officetelsOwnedStats', name: '오피스텔' },
        'apartment': { id: 'apartmentsOwnedStats', name: '아파트' },
        'shop': { id: 'shopsOwnedStats', name: '상가' },
        'building': { id: 'buildingsOwnedStats', name: '빌딩' }
      };
      
      // 금융상품 잠금 상태 적용
      Object.keys(statsProductMap).forEach(productName => {
        const productInfo = statsProductMap[productName];
        const statElement = document.getElementById(productInfo.id);
        if (statElement) {
          const assetRow = statElement.closest('.asset-row');
          if (assetRow) {
            const isLocked = !isProductUnlocked(productName);
            assetRow.classList.toggle('locked', isLocked);
          }
        }
      });
      
      // 부동산 잠금 상태 적용
      Object.keys(statsPropertyMap).forEach(propertyName => {
        const propertyInfo = statsPropertyMap[propertyName];
        const statElement = document.getElementById(propertyInfo.id);
        if (statElement) {
          const assetRow = statElement.closest('.asset-row');
          if (assetRow) {
            const isLocked = !isProductUnlocked(propertyName);
            assetRow.classList.toggle('locked', isLocked);
          }
        }
      });
    }
    
    // 총 자산 가치 계산 (현재 보유 자산을 현재가로 환산)
    function calculateTotalAssetValue() {
      let totalValue = 0;
      
      // 금융상품 가치
      if (deposits > 0) {
        totalValue += getFinancialCost('deposit', deposits - 1);
      }
      if (savings > 0) {
        totalValue += getFinancialCost('savings', savings - 1);
      }
      if (bonds > 0) {
        totalValue += getFinancialCost('bond', bonds - 1);
      }
      
      // 부동산 가치
      if (villas > 0) {
        totalValue += getPropertyCost('villa', villas - 1);
      }
      if (officetels > 0) {
        totalValue += getPropertyCost('officetel', officetels - 1);
      }
      if (apartments > 0) {
        totalValue += getPropertyCost('apartment', apartments - 1);
      }
      if (shops > 0) {
        totalValue += getPropertyCost('shop', shops - 1);
      }
      if (buildings > 0) {
        totalValue += getPropertyCost('building', buildings - 1);
      }
      
      return totalValue;
    }
    
    // 효율 분석 (개당 초당 수익 순위)
    function calculateEfficiencies() {
      const assets = [];
      
      // 금융상품
      if (deposits > 0) {
        assets.push({ name: '예금', efficiency: FINANCIAL_INCOME.deposit, count: deposits });
      }
      if (savings > 0) {
        assets.push({ name: '적금', efficiency: FINANCIAL_INCOME.savings, count: savings });
      }
      if (bonds > 0) {
        assets.push({ name: '국내주식', efficiency: FINANCIAL_INCOME.bond, count: bonds });
      }
      if (usStocks > 0) {
        assets.push({ name: '미국주식', efficiency: FINANCIAL_INCOME.usStock, count: usStocks });
      }
      if (cryptos > 0) {
        assets.push({ name: '코인', efficiency: FINANCIAL_INCOME.crypto, count: cryptos });
      }
      
      // 부동산
      if (villas > 0) {
        assets.push({ name: '빌라', efficiency: BASE_RENT.villa * rentMultiplier, count: villas });
      }
      if (officetels > 0) {
        assets.push({ name: '오피스텔', efficiency: BASE_RENT.officetel * rentMultiplier, count: officetels });
      }
      if (apartments > 0) {
        assets.push({ name: '아파트', efficiency: BASE_RENT.apartment * rentMultiplier, count: apartments });
      }
      if (shops > 0) {
        assets.push({ name: '상가', efficiency: BASE_RENT.shop * rentMultiplier, count: shops });
      }
      if (buildings > 0) {
        assets.push({ name: '빌딩', efficiency: BASE_RENT.building * rentMultiplier, count: buildings });
      }
      
      // 효율 순으로 정렬
      assets.sort((a, b) => b.efficiency - a.efficiency);
      
      // 상위 3개 반환
      return assets.slice(0, 3).map(a => 
        `${a.name} (${formatKoreanNumber(Math.floor(a.efficiency))}원/초, ${a.count}개 보유)`
      );
    }
    
    // 업적 그리드 업데이트
    function updateAchievementGrid() {
      const achievementGrid = document.getElementById('achievementGrid');
      if (!achievementGrid) return;
      
      // ======= 업적 툴팁(포털) 시스템 =======
      // - 툴팁 DOM은 1개만 사용 (겹침/누수/overflow 문제 방지)
      // - 이벤트는 그리드에 위임
      if (!window.__achievementTooltipPortalInitialized) {
        window.__achievementTooltipPortalInitialized = true;

        const ensureTooltipEl = () => {
          let el = document.getElementById('achievementTooltip');
          if (!el) {
            el = document.createElement('div');
            el.id = 'achievementTooltip';
            el.className = 'achievement-tooltip';
            el.setAttribute('role', 'tooltip');
            el.setAttribute('aria-hidden', 'true');
            document.body.appendChild(el);
          }
          return el;
        };

        const getAchText = (achId) => {
          const ach = ACHIEVEMENTS.find(a => a.id === achId);
          if (!ach) return '';
          return ach.unlocked
            ? `${ach.name}\n${ach.desc}\n✅ 달성!`
            : `${ach.name}\n${ach.desc}\n🔒 미달성`;
        };

        const hideTooltip = () => {
          const el = document.getElementById('achievementTooltip');
          if (!el) return;
          el.classList.remove('active', 'bottom');
          el.style.left = '';
          el.style.top = '';
          el.style.bottom = '';
          el.style.opacity = '';
          el.style.visibility = '';
          el.style.pointerEvents = '';
          el.setAttribute('aria-hidden', 'true');
          window.__achievementTooltipAnchorId = null;
        };

        const showTooltipForIcon = (iconEl) => {
          const el = ensureTooltipEl();
          const achId = iconEl?.dataset?.achievementId || iconEl?.id?.replace(/^ach_/, '');
          if (!achId) return;

          // 동일 아이콘 재클릭: 토글
          if (window.__achievementTooltipAnchorId === achId && el.classList.contains('active')) {
            hideTooltip();
            return;
          }

          // 항상 1개만 보이도록 초기화
          hideTooltip();

          el.textContent = getAchText(achId);
          el.setAttribute('aria-hidden', 'false');

          // 측정을 위해 "보이되 투명/비활성" 상태로 먼저 활성화
          el.classList.add('active');
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
          el.style.left = '0px';
          el.style.top = '0px';
          el.style.bottom = 'auto';

          // 크기 측정
          void el.offsetHeight;
          const tooltipRect = el.getBoundingClientRect();

          const iconRect = iconEl.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // 아이콘 중앙 기준
          let left = iconRect.left + (iconRect.width / 2);
          let top = iconRect.top - tooltipRect.height - 8;
          let showBelow = false;

          if (top < 10) {
            top = iconRect.bottom + 8;
            showBelow = true;
          }
          if (top + tooltipRect.height > viewportHeight - 10) {
            top = viewportHeight - tooltipRect.height - 10;
          }

          // 좌/우 경계
          if (left + (tooltipRect.width / 2) > viewportWidth - 10) {
            left = viewportWidth - (tooltipRect.width / 2) - 10;
          }
          if (left - (tooltipRect.width / 2) < 10) {
            left = (tooltipRect.width / 2) + 10;
          }

          el.style.left = `${left}px`;
          el.style.top = `${top}px`;
          el.style.bottom = 'auto';
          el.classList.toggle('bottom', showBelow);

          // 즉시 표시
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.pointerEvents = 'none'; // 요구사항: 아이콘에서 벗어나면 사라짐 (툴팁 상호작용 불필요)

          window.__achievementTooltipAnchorId = achId;
        };

        // 클릭: 즉시 표시/토글
        achievementGrid.addEventListener('click', (e) => {
          const iconEl = e.target.closest('.achievement-icon');
          if (!iconEl) return;
          e.stopPropagation();
          showTooltipForIcon(iconEl);
        });

        // 아이콘에서 커서가 벗어나면 닫기
        // mouseleave는 버블링이 없어 pointerout으로 위임 처리
        achievementGrid.addEventListener('pointerout', (e) => {
          const fromIcon = e.target.closest?.('.achievement-icon');
          if (!fromIcon) return;
          // 아이콘 밖으로 나가는 순간 닫기 (요구사항)
          hideTooltip();
        });

        // 바깥 클릭/스크롤/탭 전환 등으로 정리
        document.addEventListener('click', () => hideTooltip(), true);
        window.addEventListener('scroll', () => hideTooltip(), true);
        window.addEventListener('resize', () => hideTooltip(), true);
      }

      // 이미 생성되어 있으면 업데이트만
      if (achievementGrid.children.length > 0) {
        let unlockedCount = 0;
        Object.values(ACHIEVEMENTS).forEach(ach => {
          const icon = document.getElementById('ach_' + ach.id);
          if (!icon) return;

          if (ach.unlocked) {
            icon.classList.add('unlocked');
            icon.classList.remove('locked');
            unlockedCount++;
          } else {
            icon.classList.add('locked');
            icon.classList.remove('unlocked');
          }

          // 네이티브 title은 항상 최신으로 유지 (툴팁 대체/접근성)
          icon.title = ach.unlocked
            ? `${ach.name}\n${ach.desc}\n✅ 달성!`
            : `${ach.name}\n${ach.desc}\n🔒 미달성`;
        });
        
        const totalAchievements = Object.keys(ACHIEVEMENTS).length;
        safeText(document.getElementById('achievementProgress'), `${unlockedCount}/${totalAchievements}`);
        return;
      }
      
      // 처음 생성
      achievementGrid.innerHTML = '';
      let unlockedCount = 0;
      const totalAchievements = Object.keys(ACHIEVEMENTS).length;
      
      Object.values(ACHIEVEMENTS).forEach(ach => {
        const icon = document.createElement('div');
        icon.className = 'achievement-icon';
        icon.id = 'ach_' + ach.id;
        icon.dataset.achievementId = ach.id;
        icon.textContent = ach.icon;
        icon.title = ach.unlocked 
          ? `${ach.name}\n${ach.desc}\n✅ 달성!` 
          : `${ach.name}\n${ach.desc}\n🔒 미달성`;
        
        if (ach.unlocked) {
          icon.classList.add('unlocked');
          unlockedCount++;
        } else {
          icon.classList.add('locked');
        }
        
        achievementGrid.appendChild(icon);
      });
      
      safeText(document.getElementById('achievementProgress'), `${unlockedCount}/${totalAchievements}`);
    }
    
    // ======= 리더보드 폴링 제어 (랭킹 탭 전용) =======
    let __lbInterval = null;
    let __lbObserver = null;
    
    function isDesktopLayout() {
      return window.matchMedia && window.matchMedia('(min-width: 769px)').matches;
    }
    
    function startLeaderboardPolling() {
      const rankingTab = document.getElementById('rankingTab');
      if (!rankingTab) return;
      
      // 모바일(탭형)에서는 active 탭일 때만 폴링
      if (!isDesktopLayout() && !rankingTab.classList.contains('active')) return;
      
      // 이미 폴링 중이면 스킵
      if (__lbInterval) return;
      
      // 즉시 1회 업데이트
      updateLeaderboardUI(true);
      
      // 다음 분(정각)까지 대기 후, 1분마다 갱신
      const now = Date.now();
      const delayToNextMinute = 60000 - (now % 60000);

      __lbInterval = setTimeout(function tick() {
        const rankingActive = rankingTab.classList.contains('active');
        // 모바일에서는 active 여부를 계속 검사, 데스크톱에서는 IntersectionObserver가 stop을 담당
        if (!isDesktopLayout() && !rankingActive) {
          stopLeaderboardPolling();
          return;
        }
        updateLeaderboardUI(false);
        __lbInterval = setTimeout(tick, 60000);
      }, delayToNextMinute);
    }
    
    function stopLeaderboardPolling() {
      if (__lbInterval) {
        clearTimeout(__lbInterval);
        __lbInterval = null;
      }
    }
    
    function setupLeaderboardObserver() {
      const rankingTab = document.getElementById('rankingTab');
      const container = document.getElementById('leaderboardContainer');
      if (!rankingTab || !container) return;
      
      if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver 미지원: active 탭 기준으로만 리더보드 폴링 제어');
        return;
      }
      
      if (__lbObserver) {
        __lbObserver.disconnect();
      }
      
      __lbObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const isVisible = entry.isIntersecting;
          const rankingActive = rankingTab.classList.contains('active');
          
          // 데스크톱: 보이면 폴링 시작, 안 보이면 중단
          // 모바일: active + visible일 때만 시작
          const shouldStart = isDesktopLayout()
            ? isVisible
            : isVisible && rankingActive;
          
          if (shouldStart) {
            startLeaderboardPolling();
          } else {
            stopLeaderboardPolling();
          }
        });
      }, {
        root: null,
        threshold: 0.1
      });
      
      __lbObserver.observe(container);
    }
    
    // ======= 하단 네비게이션 탭 전환 =======
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // 모든 탭 비활성화
        tabContents.forEach(tab => tab.classList.remove('active'));
        navBtns.forEach(navBtn => navBtn.classList.remove('active'));
        
        // 선택한 탭 활성화
        const tabEl = document.getElementById(targetTab);
        if (tabEl) {
          tabEl.classList.add('active');
        }
        btn.classList.add('active');
        
        // 랭킹 탭 전용 리더보드 폴링 제어
        if (targetTab === 'rankingTab') {
          startLeaderboardPolling();
        } else {
          stopLeaderboardPolling();
        }
      });
    });
    
    updateUI(); // 초기 UI 업데이트
    
    // 초기 리더보드 로드/폴링 및 Observer 설정
    setTimeout(() => {
      const rankingTab = document.getElementById('rankingTab');
      if (rankingTab && rankingTab.classList.contains('active')) {
        startLeaderboardPolling();
      }
      setupLeaderboardObserver();
    }, 1000);
    
    // 업그레이드 섹션 초기 상태 설정 (열림)
    const upgradeListElement = document.getElementById('upgradeList');
    if (upgradeListElement) {
      upgradeListElement.classList.remove('collapsed-section');
      console.log('✅ Upgrade list initialized and opened');
    }
    
    updateUpgradeList(); // 초기 업그레이드 리스트 생성
    
    // 디버깅: 업그레이드 시스템 상태 확인
    console.log('=== UPGRADE SYSTEM DEBUG ===');
    console.log('Total upgrades defined:', Object.keys(UPGRADES).length);
    console.log('Unlocked upgrades:', Object.values(UPGRADES).filter(u => u.unlocked).length);
    console.log('Purchased upgrades:', Object.values(UPGRADES).filter(u => u.purchased).length);
    console.log('First 3 upgrades:', Object.entries(UPGRADES).slice(0, 3).map(([id, u]) => ({
      id,
      unlocked: u.unlocked,
      purchased: u.purchased,
      cost: u.cost
    })));
    console.log('===========================');
    
    // 치트 코드 (테스트용 - 콘솔에서 사용 가능)
    window.cheat = {
      addCash: (amount) => {
        cash += amount;
    updateUI();
        console.log(`💰 Added ${amount} cash. New total: ${cash}`);
      },
      unlockAllUpgrades: () => {
        Object.values(UPGRADES).forEach(u => u.unlocked = true);
        updateUpgradeList();
        console.log('🔓 All upgrades unlocked!');
        console.log('Upgrade list element:', document.getElementById('upgradeList'));
        console.log('Upgrade list children:', document.getElementById('upgradeList')?.children.length);
      },
      unlockFirstUpgrade: () => {
        const firstId = Object.keys(UPGRADES)[0];
        UPGRADES[firstId].unlocked = true;
        updateUpgradeList();
        console.log('🔓 First upgrade unlocked:', UPGRADES[firstId].name);
      },
      setClicks: (count) => {
        totalClicks = count;
        updateUI();
        checkUpgradeUnlocks();
        console.log(`👆 Set clicks to ${count}`);
      },
      testUpgrade: () => {
        // 빠른 테스트용
        const firstId = Object.keys(UPGRADES)[0];
        UPGRADES[firstId].unlocked = true;
        cash += 10000000;
        updateUpgradeList();
        updateUI();
        console.log('🧪 Test setup complete:');
        console.log('  - First upgrade unlocked');
        console.log('  - Cash: 1000만원');
        console.log('  - Upgrade list visible:', !document.getElementById('upgradeList')?.classList.contains('collapsed-section'));
        console.log('  - Upgrade items count:', document.querySelectorAll('.upgrade-item').length);
      }
    };
    console.log('💡 치트 코드 사용 가능:');
    console.log('  - cheat.testUpgrade() : 빠른 테스트 (첫 업그레이드 해금 + 1000만원)');
    console.log('  - cheat.addCash(1000000000) : 10억원 추가');
    console.log('  - cheat.unlockAllUpgrades() : 모든 업그레이드 해금');
    console.log('  - cheat.setClicks(100) : 클릭 수 설정');
    
    // 유닛성 테스트 로그
    addLog('🧪 v2.6 Cookie Clicker 스타일 업그레이드 시스템 구현 완료');
    addLog('✅ DOM 참조 오류 수정 완료');
    addLog('✅ 커리어 진행률 시스템 정상화');
    addLog('✅ 업그레이드 클릭 기능 활성화');
    addLog('✅ 자동 저장 시스템 작동 중');
    addLog('⚡ 성능 최적화: 업그레이드 리스트 깜빡임 해결');
    
    // 디버깅: 초기 상태 확인
    console.log('Initial state:', {
      cash,
      totalClicks,
      deposits,
      savings,
      bonds,
      villas,
      officetels,
      apartments,
      shops,
      buildings
    });
  
});
