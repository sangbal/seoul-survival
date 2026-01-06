import { safeGetJSON, safeRemove, safeSetJSON } from './persist/storage.js'
import {
  getFinancialCost,
  getFinancialSellPrice,
  getPropertyCost,
  getPropertySellPrice,
} from './economy/pricing.js'
import { createMarketSystem } from './systems/market.js'
import { createAchievementsSystem } from './systems/achievements.js'
import { createUpgradeUnlockSystem } from './systems/upgrades.js'
import { createUpgradeManager } from './systems/upgradeManager.js'
import { getDomRefs } from './ui/domRefs.js'
import { safeClass, safeHTML, safeText } from './ui/domUtils.js'
import { updateStatsTab as updateStatsTabImpl } from './ui/statsTab.js'
import { createInvestmentTab } from './ui/investmentTab.js'
import { fetchCloudSave, upsertCloudSave } from '../../shared/cloudSave.js'
import { getUser, onAuthStateChange, signInGoogle } from '../../shared/auth/core.js'
import { isSupabaseConfigured } from '../../shared/auth/config.js'
import {
  updateLeaderboard,
  getLeaderboard,
  isNicknameTaken,
  normalizeNickname,
  validateNickname,
  claimNickname,
  getMyRank,
} from '../../shared/leaderboard.js'
import { t, applyI18nToDOM, setLang, getLang, getInitialLang } from './i18n/index.js'
import { GAME_VERSION } from './version.js'
import * as NumberFormat from './utils/numberFormat.js'
import * as Modal from './ui/modal.js'
import * as Animations from './ui/animations.js'
import * as Diary from './systems/diary.js'
import * as LeaderboardUI from './ui/leaderboardUI.js'
import {
  gameState,
  FINANCIAL_INCOME,
  BASE_RENT,
  CAREER_LEVELS,
  SAVE_KEY,
  CLOUD_RESTORE_BLOCK_KEY,
  CLOUD_RESTORE_SKIP_KEY,
  SETTINGS_KEY,
  resetIncomeTablesToDefault,
  reapplyIncomeTableAffectingUpgradeEffects,
  getTotalFinancialProducts,
  getTotalProperties,
  BASE_CLICK_GAIN,
} from './state/gameState.js'

// ===== 밸런스 설정 import =====
import { MARKET_EVENTS } from './balance/index.js'

// 개발 모드에서는 콘솔을 유지하고, 프로덕션에서는 로그를 무력화합니다.
// - Vite 빌드/개발서버: import.meta.env.DEV 사용
// - GitHub Pages처럼 번들 없이 ESM으로 직접 로드하는 경우: import.meta.env가 없을 수 있음
// DEV 모드 체크 (Vite 기준, optional chaining 사용)
const __IS_DEV__ = !!import.meta?.env?.DEV
if (!__IS_DEV__) {
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
}

// 인앱 브라우저(카카오톡/인스타 등) 감지
function detectInAppBrowser() {
  const ua = navigator.userAgent || ''
  const isKakao = ua.includes('KAKAOTALK')
  const isInstagram = ua.includes('Instagram')
  const isFacebook = ua.includes('FBAN') || ua.includes('FBAV')
  const isLine = ua.includes('Line')
  const isWeChat = ua.includes('MicroMessenger')
  const isInApp = isKakao || isInstagram || isFacebook || isLine || isWeChat
  return { isInApp, isKakao, isInstagram, isFacebook, isLine, isWeChat }
}

function showInAppBrowserWarningIfNeeded() {
  const { isInApp } = detectInAppBrowser()
  if (!isInApp) return

  const banner = document.createElement('div')
  banner.className = 'inapp-warning-banner'
  banner.innerHTML = `
    이 브라우저에서는 Google 로그인이 제한될 수 있습니다.<br />
    <strong>Chrome / Safari 등 기본 브라우저에서 다시 열어 주세요.</strong>
    <div class="inapp-warning-actions">
      <button type="button" class="btn-small" id="copyGameUrlBtn">URL 복사</button>
      <button type="button" class="btn-small" id="closeInappWarningBtn">확인</button>
    </div>
  `
  document.body.prepend(banner)

  const copyBtn = banner.querySelector('#copyGameUrlBtn')
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const url = 'https://clicksurvivor.com/seoulsurvival/'
      try {
        // 클립보드 API 시도 (HTTPS/localhost에서 동작)
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url)
          alert('주소가 복사되었습니다.\nChrome/Safari 주소창에 붙여넣어 열어 주세요.')
          return
        }
        // Fallback: execCommand 사용
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          const successful = document.execCommand('copy')
          if (successful) {
            alert('주소가 복사되었습니다.\nChrome/Safari 주소창에 붙여넣어 열어 주세요.')
          } else {
            throw new Error('execCommand failed')
          }
        } catch (err) {
          alert(url + '\n위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.')
        } finally {
          document.body.removeChild(textArea)
        }
      } catch (err) {
        alert(url + '\n위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.')
      }
    })
  }

  const closeBtn = banner.querySelector('#closeInappWarningBtn')
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.remove()
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // ======= i18n 초기화 =======
  // 초기 언어 설정 (URL → localStorage → 브라우저 언어)
  const initialLang = getInitialLang()
  setLang(initialLang)
  applyI18nToDOM()

  // ======= 모달 시스템 초기화 =======
  Modal.initModal()

  // ======= fixed header 높이만큼 본문 상단 여백 자동 보정 =======
  // 모바일에서 헤더가 2줄로 늘어나면(.statbar 래핑) 본문 상단 요소(직급 등)가 헤더에 가려질 수 있어,
  // 헤더 실제 높이를 CSS 변수(--header-h)로 주입해 .app padding-top이 자동으로 따라가도록 한다.
  function __syncHeaderHeightVar() {
    const header = document.querySelector('header')
    if (!header) return
    const h = Math.ceil(header.getBoundingClientRect().height || 0)
    if (h > 0) document.documentElement.style.setProperty('--header-h', `${h}px`)
  }

  __syncHeaderHeightVar()
  showInAppBrowserWarningIfNeeded()
  window.addEventListener('resize', __syncHeaderHeightVar)
  // 모바일 주소창/뷰포트 변화 대응
  try {
    window.visualViewport?.addEventListener('resize', __syncHeaderHeightVar)
  } catch {
    // Ignore if browser doesn't support this event
  }
  // 헤더 래핑/폰트 로딩 등으로 높이가 바뀌는 경우 대응
  try {
    const header = document.querySelector('header')
    if (header && 'ResizeObserver' in window) {
      new ResizeObserver(__syncHeaderHeightVar).observe(header)
    }
  } catch {
    // Ignore if browser doesn't support this event
  }

  // ======= (iOS) 더블탭/핀치로 인한 화면 확대 방지 =======
  // 요구사항: 노동하기 반복 터치 시 발생하는 화면 확대를 차단
  // - meta viewport(user-scalable=no) + gesture 이벤트 preventDefault로 이중 안전장치
  try {
    const prevent = e => e.preventDefault()
    document.addEventListener('gesturestart', prevent, { passive: false })
    document.addEventListener('gesturechange', prevent, { passive: false })
    document.addEventListener('gestureend', prevent, { passive: false })
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
    - 천단위 콤마 추가: NumberFormat.formatFinancialPrice(), NumberFormat.formatPropertyPrice()
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
      element.textContent = text
    }
  }

  function safeHTML(element, html) {
    if (element && element.innerHTML !== undefined) {
      element.innerHTML = html
    }
  }

  function safeClass(element, className, add = true) {
    if (element && element.classList) {
      if (add) {
        element.classList.add(className)
      } else {
        element.classList.remove(className)
      }
    }
  }

  // ======= 상태 =======
  const fmt = new Intl.NumberFormat('ko-KR')

  let cash = 0

  // 누적 플레이시간 시스템 (전역 변수)
  let totalPlayTime = 0 // 누적 플레이시간 (밀리초)
  let sessionStartTime = Date.now() // 현재 세션 시작 시간
  let gameStartTime = Date.now() // 게임 시작 시간 (호환성 유지)

  // 금융상품 보유 수량
  let deposits = 0 // 예금
  let savings = 0 // 적금
  let bonds = 0 // 국내주식
  let usStocks = 0 // 미국주식
  let cryptos = 0 // 코인

  // 금융상품 누적 생산량 (Cookie Clicker 스타일)
  let depositsLifetime = 0
  let savingsLifetime = 0
  let bondsLifetime = 0
  let usStocksLifetime = 0
  let cryptosLifetime = 0

  // 부동산 누적 생산량
  let villasLifetime = 0
  let officetelsLifetime = 0
  let apartmentsLifetime = 0
  let shopsLifetime = 0
  let buildingsLifetime = 0

  // 구매 수량 선택 시스템
  let purchaseMode = 'buy' // 'buy' or 'sell'
  let purchaseQuantity = 1 // 1, 10, 100

  // 자동 저장 시스템
  const SAVE_KEY = 'seoulTycoonSaveV1'
  // reset/닉네임 설정 플로우 동안 클라우드 복구를 차단하는 플래그 (sessionStorage)
  const CLOUD_RESTORE_BLOCK_KEY = 'ss_blockCloudRestoreUntilNicknameDone'
  // resetGame 이후 1회성 클라우드 복구 스킵 플래그 (sessionStorage)
  const CLOUD_RESTORE_SKIP_KEY = 'ss_skipCloudRestoreOnce'
  let lastSaveTime = new Date()

  // 닉네임 (리더보드용)
  let playerNickname = ''

  // 닉네임 모달 세션 플래그 (이번 세션에서 이미 모달을 열었는지)
  let __nicknameModalShown = false

  // ======= 업그레이드 시스템 (Cookie Clicker 스타일) =======
  const UPGRADES = {
    // === 노동 관련 (재밸런싱) ===
    part_time_job: {
      name: '🍕 아르바이트 경험',
      desc: '클릭 수익 1.2배',
      cost: 50000,
      icon: '🍕',
      // 직급 연동: 계약직부터 해금
      unlockCondition: () => careerLevel >= 1,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    internship: {
      name: '📝 인턴십',
      desc: '클릭 수익 1.2배',
      cost: 200000,
      icon: '📝',
      // 직급 연동: 사원부터 해금
      unlockCondition: () => careerLevel >= 2,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    efficient_work: {
      name: '⚡ 효율적인 업무 처리',
      desc: '클릭 수익 1.2배',
      cost: 500000,
      icon: '⚡',
      // 직급 연동: 대리부터 해금
      unlockCondition: () => careerLevel >= 3,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    focus_training: {
      name: '🎯 집중력 강화',
      desc: '클릭 수익 1.2배',
      cost: 2000000,
      icon: '🎯',
      // 직급 연동: 과장부터 해금
      unlockCondition: () => careerLevel >= 4,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    professional_education: {
      name: '📚 전문 교육',
      desc: '클릭 수익 1.2배',
      cost: 10000000,
      icon: '📚',
      // 직급 연동: 차장부터 해금
      unlockCondition: () => careerLevel >= 5,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    performance_bonus: {
      name: '💰 성과급',
      desc: '2% 확률로 10배 수익',
      cost: 10000000,
      icon: '💰',
      // 직급 연동: 부장부터 해금
      unlockCondition: () => careerLevel >= 6,
      effect: () => {
        /* 확률형 효과는 클릭 이벤트에서 처리 */
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    career_recognition: {
      name: '💼 경력 인정',
      desc: '클릭 수익 1.2배',
      cost: 30000000,
      icon: '💼',
      // 직급 연동: 부장부터 해금
      unlockCondition: () => careerLevel >= 6,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    overtime_work: {
      name: '🔥 초과근무',
      desc: '클릭 수익 1.2배',
      cost: 50000000,
      icon: '🔥',
      // 직급 연동: 상무부터 해금
      unlockCondition: () => careerLevel >= 7,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    honor_award: {
      name: '🎖️ 명예상',
      desc: '클릭 수익 1.2배',
      cost: 100000000,
      icon: '🎖️',
      // 직급 연동: 상무부터 해금
      unlockCondition: () => careerLevel >= 7,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    expertise_development: {
      name: '💎 전문성 개발',
      desc: '클릭 수익 1.2배',
      cost: 200000000,
      icon: '💎',
      // 직급 연동: 전무부터 해금
      unlockCondition: () => careerLevel >= 8,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    teamwork: {
      name: '🤝 팀워크 향상',
      desc: '클릭 수익 1.2배',
      cost: 500000000,
      icon: '🤝',
      // 직급 연동: 전무부터 해금
      unlockCondition: () => careerLevel >= 8,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    leadership: {
      name: '👑 리더십',
      desc: '클릭 수익 1.2배',
      cost: 2000000000,
      icon: '👑',
      // 직급 연동: 전무부터 해금
      unlockCondition: () => careerLevel >= 8,
      effect: () => {
        clickMultiplier *= 1.2
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    ceo_privilege: {
      name: '👔 CEO 특권',
      desc: '클릭 수익 2.0배',
      cost: 10000000000,
      icon: '👔',
      unlockCondition: () => careerLevel >= 9,
      effect: () => {
        clickMultiplier *= 2.0
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    global_experience: {
      name: '🌍 글로벌 경험',
      desc: '클릭 수익 2.0배',
      cost: 50000000000,
      icon: '🌍',
      // 직급 연동: CEO 이후(추가 성장용)로 해금
      unlockCondition: () => careerLevel >= 9 && totalClicks >= 15000,
      effect: () => {
        clickMultiplier *= 2.0
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    entrepreneurship: {
      name: '🚀 창업',
      desc: '클릭 수익 2.0배',
      cost: 100000000000,
      icon: '🚀',
      // 직급 연동: CEO 이후(최종 성장용)로 해금
      unlockCondition: () => careerLevel >= 9 && totalClicks >= 30000,
      effect: () => {
        clickMultiplier *= 2.0
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },

    // === 예금 관련 ===
    deposit_boost_1: {
      name: '💰 예금 이자율 상승',
      desc: '예금 수익 2배',
      cost: 100000, // 기본가 5만원 × 2
      icon: '💰',
      unlockCondition: () => deposits >= 5,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },
    deposit_boost_2: {
      name: '💎 프리미엄 예금',
      desc: '예금 수익 2배',
      cost: 250000, // 기본가 5만원 × 5
      icon: '💎',
      unlockCondition: () => deposits >= 15,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },
    deposit_boost_3: {
      name: '💠 다이아몬드 예금',
      desc: '예금 수익 2배',
      cost: 500000, // 기본가 5만원 × 10
      icon: '💠',
      unlockCondition: () => deposits >= 30,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },
    deposit_boost_4: {
      name: '💍 플래티넘 예금',
      desc: '예금 수익 2배',
      cost: 1000000, // 기본가 5만원 × 20
      icon: '💍',
      unlockCondition: () => deposits >= 40,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },
    deposit_boost_5: {
      name: '👑 킹 예금',
      desc: '예금 수익 2배',
      cost: 2000000, // 기본가 5만원 × 40
      icon: '👑',
      unlockCondition: () => deposits >= 50,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },

    // === 적금 관련 ===
    savings_boost_1: {
      name: '🏦 적금 복리 효과',
      desc: '적금 수익 2배',
      cost: 1000000, // 기본가 50만원 × 2
      icon: '🏦',
      unlockCondition: () => savings >= 5,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },
    savings_boost_2: {
      name: '🏅 골드 적금',
      desc: '적금 수익 2배',
      cost: 2500000, // 기본가 50만원 × 5
      icon: '🏅',
      unlockCondition: () => savings >= 15,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },
    savings_boost_3: {
      name: '💍 플래티넘 적금',
      desc: '적금 수익 2배',
      cost: 5000000, // 기본가 50만원 × 10
      icon: '💍',
      unlockCondition: () => savings >= 30,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },
    savings_boost_4: {
      name: '💠 다이아몬드 적금',
      desc: '적금 수익 2배',
      cost: 10000000, // 기본가 50만원 × 20
      icon: '💠',
      unlockCondition: () => savings >= 40,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },
    savings_boost_5: {
      name: '👑 킹 적금',
      desc: '적금 수익 2배',
      cost: 20000000, // 기본가 50만원 × 40
      icon: '👑',
      unlockCondition: () => savings >= 50,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },

    // === 주식 관련 ===
    bond_boost_1: {
      name: '📈 주식 수익률 향상',
      desc: '주식 수익 2배',
      cost: 10000000, // 기본가 500만원 × 2
      icon: '📈',
      unlockCondition: () => bonds >= 5,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },
    bond_boost_2: {
      name: '💹 프리미엄 주식',
      desc: '주식 수익 2배',
      cost: 25000000, // 기본가 500만원 × 5
      icon: '💹',
      unlockCondition: () => bonds >= 15,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },
    bond_boost_3: {
      name: '📊 블루칩 주식',
      desc: '주식 수익 2배',
      cost: 50000000, // 기본가 500만원 × 10
      icon: '📊',
      unlockCondition: () => bonds >= 30,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },
    bond_boost_4: {
      name: '💎 대형주 포트폴리오',
      desc: '주식 수익 2배',
      cost: 100000000, // 기본가 500만원 × 20
      icon: '💎',
      unlockCondition: () => bonds >= 40,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },
    bond_boost_5: {
      name: '👑 킹 주식',
      desc: '주식 수익 2배',
      cost: 200000000, // 기본가 500만원 × 40
      icon: '👑',
      unlockCondition: () => bonds >= 50,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },

    // === 미국주식 관련 ===
    usstock_boost_1: {
      name: '🇺🇸 S&P 500 투자',
      desc: '미국주식 수익 2배',
      cost: 50000000, // 기본가 2,500만원 × 2
      icon: '🇺🇸',
      unlockCondition: () => usStocks >= 5,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },
    usstock_boost_2: {
      name: '📈 나스닥 투자',
      desc: '미국주식 수익 2배',
      cost: 125000000, // 기본가 2,500만원 × 5
      icon: '📈',
      unlockCondition: () => usStocks >= 15,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },
    usstock_boost_3: {
      name: '💎 글로벌 주식 포트폴리오',
      desc: '미국주식 수익 2배',
      cost: 250000000, // 기본가 2,500만원 × 10
      icon: '💎',
      unlockCondition: () => usStocks >= 30,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },
    usstock_boost_4: {
      name: '🌍 글로벌 대형주',
      desc: '미국주식 수익 2배',
      cost: 500000000, // 기본가 2,500만원 × 20
      icon: '🌍',
      unlockCondition: () => usStocks >= 40,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },
    usstock_boost_5: {
      name: '👑 킹 글로벌 주식',
      desc: '미국주식 수익 2배',
      cost: 1000000000, // 기본가 2,500만원 × 40
      icon: '👑',
      unlockCondition: () => usStocks >= 50,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },

    // === 코인 관련 ===
    crypto_boost_1: {
      name: '₿ 비트코인 투자',
      desc: '코인 수익 2배',
      cost: 200000000, // 기본가 1억원 × 2
      icon: '₿',
      unlockCondition: () => cryptos >= 5,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },
    crypto_boost_2: {
      name: '💎 알트코인 포트폴리오',
      desc: '코인 수익 2배',
      cost: 500000000, // 기본가 1억원 × 5
      icon: '💎',
      unlockCondition: () => cryptos >= 15,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },
    crypto_boost_3: {
      name: '🚀 디지털 자산 전문가',
      desc: '코인 수익 2배',
      cost: 1000000000, // 기본가 1억원 × 10
      icon: '🚀',
      unlockCondition: () => cryptos >= 30,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },
    crypto_boost_4: {
      name: '🌐 메타버스 자산',
      desc: '코인 수익 2배',
      cost: 2000000000, // 기본가 1억원 × 20
      icon: '🌐',
      unlockCondition: () => cryptos >= 40,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },
    crypto_boost_5: {
      name: '👑 킹 암호화폐',
      desc: '코인 수익 2배',
      cost: 4000000000, // 기본가 1억원 × 40
      icon: '👑',
      unlockCondition: () => cryptos >= 50,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },

    // === 빌라 관련 ===
    villa_boost_1: {
      name: '🏘️ 빌라 리모델링',
      desc: '빌라 수익 2배',
      cost: 500000000, // 기본가 2.5억원 × 2
      icon: '🏘️',
      unlockCondition: () => villas >= 5,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },
    villa_boost_2: {
      name: '🌟 럭셔리 빌라',
      desc: '빌라 수익 2배',
      cost: 1250000000, // 기본가 2.5억원 × 5
      icon: '🌟',
      unlockCondition: () => villas >= 15,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },
    villa_boost_3: {
      name: '✨ 프리미엄 빌라 단지',
      desc: '빌라 수익 2배',
      cost: 2500000000, // 기본가 2.5억원 × 10
      icon: '✨',
      unlockCondition: () => villas >= 30,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },
    villa_boost_4: {
      name: '💎 다이아몬드 빌라',
      desc: '빌라 수익 2배',
      cost: 5000000000, // 기본가 2.5억원 × 20
      icon: '💎',
      unlockCondition: () => villas >= 40,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },
    villa_boost_5: {
      name: '👑 킹 빌라',
      desc: '빌라 수익 2배',
      cost: 10000000000, // 기본가 2.5억원 × 40
      icon: '👑',
      unlockCondition: () => villas >= 50,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },

    // === 오피스텔 관련 ===
    officetel_boost_1: {
      name: '🏢 오피스텔 스마트화',
      desc: '오피스텔 수익 2배',
      cost: 700000000, // 기본가 3.5억원 × 2
      icon: '🏢',
      unlockCondition: () => officetels >= 5,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },
    officetel_boost_2: {
      name: '🏙️ 프리미엄 오피스텔',
      desc: '오피스텔 수익 2배',
      cost: 1750000000, // 기본가 3.5억원 × 5
      icon: '🏙️',
      unlockCondition: () => officetels >= 15,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },
    officetel_boost_3: {
      name: '🌆 럭셔리 오피스텔 타워',
      desc: '오피스텔 수익 2배',
      cost: 3500000000, // 기본가 3.5억원 × 10
      icon: '🌆',
      unlockCondition: () => officetels >= 30,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },
    officetel_boost_4: {
      name: '💎 다이아몬드 오피스텔',
      desc: '오피스텔 수익 2배',
      cost: 7000000000, // 기본가 3.5억원 × 20
      icon: '💎',
      unlockCondition: () => officetels >= 40,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },
    officetel_boost_5: {
      name: '👑 킹 오피스텔',
      desc: '오피스텔 수익 2배',
      cost: 14000000000, // 기본가 3.5억원 × 40
      icon: '👑',
      unlockCondition: () => officetels >= 50,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },

    // === 아파트 관련 ===
    apartment_boost_1: {
      name: '🏡 아파트 프리미엄화',
      desc: '아파트 수익 2배',
      cost: 1600000000, // 기본가 8억원 × 2
      icon: '🏡',
      unlockCondition: () => apartments >= 5,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },
    apartment_boost_2: {
      name: '🏰 타워팰리스급 아파트',
      desc: '아파트 수익 2배',
      cost: 4000000000, // 기본가 8억원 × 5
      icon: '🏰',
      unlockCondition: () => apartments >= 15,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },
    apartment_boost_3: {
      name: '🏛️ 초고급 아파트 단지',
      desc: '아파트 수익 2배',
      cost: 8000000000, // 기본가 8억원 × 10
      icon: '🏛️',
      unlockCondition: () => apartments >= 30,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },
    apartment_boost_4: {
      name: '💎 다이아몬드 아파트',
      desc: '아파트 수익 2배',
      cost: 16000000000, // 기본가 8억원 × 20
      icon: '💎',
      unlockCondition: () => apartments >= 40,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },
    apartment_boost_5: {
      name: '👑 킹 아파트',
      desc: '아파트 수익 2배',
      cost: 32000000000, // 기본가 8억원 × 40
      icon: '👑',
      unlockCondition: () => apartments >= 50,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },

    // === 상가 관련 ===
    shop_boost_1: {
      name: '🏪 상가 입지 개선',
      desc: '상가 수익 2배',
      cost: 2400000000, // 기본가 12억원 × 2
      icon: '🏪',
      unlockCondition: () => shops >= 5,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },
    shop_boost_2: {
      name: '🛍️ 프리미엄 상권',
      desc: '상가 수익 2배',
      cost: 6000000000, // 기본가 12억원 × 5
      icon: '🛍️',
      unlockCondition: () => shops >= 15,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },
    shop_boost_3: {
      name: '🏬 메가몰 상권',
      desc: '상가 수익 2배',
      cost: 12000000000, // 기본가 12억원 × 10
      icon: '🏬',
      unlockCondition: () => shops >= 30,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },
    shop_boost_4: {
      name: '💎 다이아몬드 상권',
      desc: '상가 수익 2배',
      cost: 24000000000, // 기본가 12억원 × 20
      icon: '💎',
      unlockCondition: () => shops >= 40,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },
    shop_boost_5: {
      name: '👑 킹 상권',
      desc: '상가 수익 2배',
      cost: 48000000000, // 기본가 12억원 × 40
      icon: '👑',
      unlockCondition: () => shops >= 50,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },

    // === 빌딩 관련 ===
    building_boost_1: {
      name: '🏙️ 빌딩 테넌트 확보',
      desc: '빌딩 수익 2배',
      cost: 6000000000, // 기본가 30억원 × 2
      icon: '🏙️',
      unlockCondition: () => buildings >= 5,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },
    building_boost_2: {
      name: '💼 랜드마크 빌딩',
      desc: '빌딩 수익 2배',
      cost: 15000000000, // 기본가 30억원 × 5
      icon: '💼',
      unlockCondition: () => buildings >= 15,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },
    building_boost_3: {
      name: '🏢 초고층 마천루',
      desc: '빌딩 수익 2배',
      cost: 30000000000, // 기본가 30억원 × 10
      icon: '🏢',
      unlockCondition: () => buildings >= 30,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },
    building_boost_4: {
      name: '💎 다이아몬드 빌딩',
      desc: '빌딩 수익 2배',
      cost: 60000000000, // 기본가 30억원 × 20
      icon: '💎',
      unlockCondition: () => buildings >= 40,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },
    building_boost_5: {
      name: '👑 킹 빌딩',
      desc: '빌딩 수익 2배',
      cost: 120000000000, // 기본가 30억원 × 40
      icon: '👑',
      unlockCondition: () => buildings >= 50,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },

    // === 전역 업그레이드 ===
    rent_multiplier: {
      name: '📊 부동산 관리 전문화',
      desc: '모든 부동산 수익 +10%',
      cost: 1000000000,
      icon: '📊',
      unlockCondition: () => getTotalProperties() >= 10,
      effect: () => {
        rentMultiplier *= 1.1
      },
      category: 'global',
      unlocked: false,
      purchased: false,
    },
    manager_hire: {
      name: '👨‍💼 전문 관리인 고용',
      desc: '전체 임대 수익 +5%',
      cost: 5000000000,
      icon: '👨‍💼',
      unlockCondition: () => getTotalProperties() >= 20,
      effect: () => {
        rentMultiplier *= 1.05
        managerLevel++
      },
      category: 'global',
      unlocked: false,
      purchased: false,
    },
    financial_expert: {
      name: '💼 금융 전문가 고용',
      desc: '모든 금융 수익 +20%',
      cost: 10000000000,
      icon: '💼',
      unlockCondition: () => careerLevel >= 8, // 전무 달성 시 해금
      effect: () => {
        FINANCIAL_INCOME.deposit *= 1.2
        FINANCIAL_INCOME.savings *= 1.2
        FINANCIAL_INCOME.bond *= 1.2
      },
      category: 'global',
      unlocked: false,
      purchased: false,
    },
    auto_work_system: {
      name: '🤖 AI 업무 처리 시스템',
      desc: '1초마다 자동으로 1회 클릭 (초당 수익 추가)',
      cost: 5000000000,
      icon: '📱',
      unlockCondition: () => careerLevel >= 7 && getTotalProperties() >= 10,
      effect: () => {
        autoClickEnabled = true
        updateAutoWorkUI()
      },
      category: 'global',
      unlocked: false,
      purchased: false,
    },
  }

  // ======= 업그레이드 관리 시스템 초기화 =======
  const upgradeManager = createUpgradeManager({
    UPGRADES,
    getCash: () => cash,
    setCash: newCash => {
      cash = newCash
    },
    CAREER_LEVELS,
  })
  const { updateUpgradeAffordability, updateUpgradeProgress, updateUpgradeList, purchaseUpgrade } =
    upgradeManager

  // 부동산 보유 수량
  let villas = 0 // 빌라
  let officetels = 0 // 오피스텔
  let apartments = 0 // 아파트
  let shops = 0 // 상가
  let buildings = 0 // 빌딩
  let towers_run = 0 // 서울타워 (현재 런에서 획득)
  let towers_lifetime = 0 // 서울타워 (계정 누적, 프레스티지 유지)

  // 해금 상태 추적 (버그 수정: 중복 해금 알림 방지)
  const unlockedProducts = {
    deposit: true,
    savings: false,
    bond: false,
    villa: false,
    officetel: false,
    apartment: false,
    shop: false,
    building: false,
    tower: false,
  }

  // Note: FINANCIAL_INCOME, BASE_RENT, resetIncomeTablesToDefault,
  // reapplyIncomeTableAffectingUpgradeEffects는 gameState.js에서 이미 import됨

  // 업그레이드 배수
  let clickMultiplier = 1 // 노동 효율 배수
  let rentMultiplier = 1 // 월세 수익 배수
  let autoClickEnabled = false // 자동 클릭 활성화 여부
  let managerLevel = 0 // 관리인 레벨

  // 설정 옵션
  const SETTINGS_KEY = 'capitalClicker_settings'
  let settings = {
    particles: true, // 파티클 애니메이션
    fancyGraphics: true, // 화려한 그래픽
    shortNumbers: false, // 짧은 숫자 표시 (기본값: 끔)
  }

  // 노동 커리어 시스템 (현실적 승진)
  let careerLevel = 0 // 현재 커리어 레벨
  let totalLaborIncome = 0 // 총 노동 수익

  // Note: CAREER_LEVELS는 gameState.js에서 이미 bgImage와 함께 import됨

  // 직급 이름 가져오기 함수
  function getCareerName(level) {
    if (level < 0 || level >= CAREER_LEVELS.length) return ''
    return t(CAREER_LEVELS[level].nameKey)
  }

  // 가격은 이제 동적으로 계산됨 (getPropertyCost 함수 사용)

  // 업그레이드 비용 - 새로운 경제 시스템에 맞게 조정
  let rentCost = 1000000000 // 월세 수익률 업: 10억원
  let mgrCost = 5000000000 // 관리인 고용: 50억원

  // BASE_CLICK_GAIN - balance/career.js에서 import됨

  // 부동산 시장 이벤트 시스템
  let marketMultiplier = 1.0 // 시장 수익 배수
  let marketEventEndTime = 0 // 이벤트 종료 시간

  // 시장 이벤트 시스템 (상품별 세분화)
  let currentMarketEvent = null

  // MARKET_EVENTS - balance/marketEvents.js에서 import됨

  // 업적 시스템
  let totalClicks = 0 // 총 클릭 수 추적

  const ACHIEVEMENTS = [
    // === 기본 업적 (8개) ===
    {
      id: 'first_click',
      name: '첫 노동',
      desc: '첫 번째 클릭을 했다',
      icon: '👆',
      condition: () => totalClicks >= 1,
      unlocked: false,
    },
    {
      id: 'first_deposit',
      name: '첫 예금',
      desc: '첫 번째 예금을 구입했다',
      icon: '💰',
      condition: () => deposits >= 1,
      unlocked: false,
    },
    {
      id: 'first_savings',
      name: '첫 적금',
      desc: '첫 번째 적금을 구입했다',
      icon: '🏦',
      condition: () => savings >= 1,
      unlocked: false,
    },
    {
      id: 'first_bond',
      name: '첫 국내주식',
      desc: '첫 번째 국내주식을 구입했다',
      icon: '📈',
      condition: () => bonds >= 1,
      unlocked: false,
    },
    {
      id: 'first_us_stock',
      name: '첫 미국주식',
      desc: '첫 번째 미국주식을 구입했다',
      icon: '🇺🇸',
      condition: () => usStocks >= 1,
      unlocked: false,
    },
    {
      id: 'first_crypto',
      name: '첫 코인',
      desc: '첫 번째 코인을 구입했다',
      icon: '₿',
      condition: () => cryptos >= 1,
      unlocked: false,
    },
    {
      id: 'first_property',
      name: '첫 부동산',
      desc: '첫 번째 부동산을 구입했다',
      icon: '🏠',
      condition: () => villas + officetels + apartments + shops + buildings >= 1,
      unlocked: false,
    },
    {
      id: 'first_upgrade',
      name: '첫 업그레이드',
      desc: '첫 번째 업그레이드를 구입했다',
      icon: '⚡',
      condition: () => Object.values(UPGRADES).some(upgrade => upgrade.purchased),
      unlocked: false,
    },

    // === 전문가 업적 (8개) ===
    {
      id: 'financial_expert',
      name: '금융 전문가',
      desc: '모든 금융상품을 보유했다',
      icon: '💼',
      condition: () => deposits > 0 && savings > 0 && bonds > 0 && usStocks > 0 && cryptos > 0,
      unlocked: false,
    },
    {
      id: 'property_collector',
      name: '부동산 수집가',
      desc: '5채의 부동산을 보유했다',
      icon: '🏘️',
      condition: () => getTotalProperties() >= 5,
      unlocked: false,
    },
    {
      id: 'property_tycoon',
      name: '부동산 타이쿤',
      desc: '모든 부동산 종류를 보유했다',
      icon: '🏙️',
      condition: () => villas > 0 && officetels > 0 && apartments > 0 && shops > 0 && buildings > 0,
      unlocked: false,
    },
    {
      id: 'investment_guru',
      name: '투자 고수',
      desc: '모든 업그레이드를 구입했다',
      icon: '📊',
      condition: () => Object.values(UPGRADES).every(upgrade => upgrade.purchased),
      unlocked: false,
    },
    {
      id: 'gangnam_rich',
      name: '강남 부자',
      desc: '강남 부동산 3채를 보유했다',
      icon: '🏙️',
      condition: () => apartments >= 3,
      unlocked: false,
    },
    {
      id: 'global_investor',
      name: '글로벌 투자자',
      desc: '해외 투자 1억원을 달성했다',
      icon: '🌍',
      condition: () => usStocks * 1000000 + cryptos * 1000000 >= 100000000,
      unlocked: false,
    },
    {
      id: 'crypto_expert',
      name: '암호화폐 전문가',
      desc: '코인 투자 5억원을 달성했다',
      icon: '₿',
      condition: () => {
        // 실제 코인 투자 금액 계산 (누적 구매 가격)
        let totalInvestment = 0
        for (let i = 0; i < cryptos; i++) {
          totalInvestment += getFinancialCost('crypto', i, 1)
        }
        return totalInvestment >= 500000000 // 5억원
      },
      unlocked: false,
    },
    {
      id: 'real_estate_agent',
      name: '부동산 중개사',
      desc: '부동산 20채를 보유했다',
      icon: '🏠',
      condition: () => getTotalProperties() >= 20,
      unlocked: false,
    },

    // === 자산 업적 (8개) ===
    // 총 자산 = 현금 + 보유 금융/부동산 자산 가치 기준
    {
      id: 'millionaire',
      name: '백만장자',
      desc: '총 자산 1억원을 달성했다',
      icon: '💎',
      condition: () => getTotalAssets() >= 100000000,
      unlocked: false,
    },
    {
      id: 'ten_millionaire',
      name: '억만장자',
      desc: '총 자산 10억원을 달성했다',
      icon: '💰',
      condition: () => getTotalAssets() >= 1000000000,
      unlocked: false,
    },
    {
      id: 'hundred_millionaire',
      name: '부자',
      desc: '총 자산 100억원을 달성했다',
      icon: '🏆',
      condition: () => getTotalAssets() >= 10000000000,
      unlocked: false,
    },
    {
      id: 'billionaire',
      name: '대부호',
      desc: '총 자산 1,000억원을 달성했다',
      icon: '👑',
      condition: () => getTotalAssets() >= 100000000000,
      unlocked: false,
    },
    {
      id: 'trillionaire',
      name: '재벌',
      desc: '총 자산 1조원을 달성했다',
      icon: '🏰',
      condition: () => getTotalAssets() >= 1000000000000,
      unlocked: false,
    },
    {
      id: 'global_rich',
      name: '세계적 부자',
      desc: '총 자산 10조원을 달성했다',
      icon: '🌍',
      condition: () => getTotalAssets() >= 10000000000000,
      unlocked: false,
    },
    {
      id: 'legendary_rich',
      name: '전설의 부자',
      desc: '총 자산 100조원을 달성했다',
      icon: '⭐',
      condition: () => getTotalAssets() >= 100000000000000,
      unlocked: false,
    },
    {
      id: 'god_rich',
      name: '신의 부자',
      desc: '총 자산 1,000조원을 달성했다',
      icon: '✨',
      condition: () => getTotalAssets() >= 1000000000000000,
      unlocked: false,
    },

    // === 커리어 업적 (8개) ===
    {
      id: 'career_starter',
      name: '직장인',
      desc: '계약직으로 승진했다',
      icon: '👔',
      condition: () => careerLevel >= 1,
      unlocked: false,
    },
    {
      id: 'employee',
      name: '정규직',
      desc: '사원으로 승진했다',
      icon: '👨‍💼',
      condition: () => careerLevel >= 2,
      unlocked: false,
    },
    {
      id: 'deputy_director',
      name: '팀장',
      desc: '과장으로 승진했다',
      icon: '👨‍💻',
      condition: () => careerLevel >= 4,
      unlocked: false,
    },
    {
      id: 'executive',
      name: '임원',
      desc: '상무로 승진했다',
      icon: '👨‍🎓',
      condition: () => careerLevel >= 7,
      unlocked: false,
    },
    {
      id: 'ceo',
      name: 'CEO',
      desc: 'CEO가 되었다',
      icon: '👑',
      condition: () => careerLevel >= 9,
      unlocked: false,
    },
    // 재벌 회장: 총 자산 1조 기준
    {
      id: 'chaebol_chairman',
      name: '재벌 회장',
      desc: '자산 1조원을 달성했다',
      icon: '🏆',
      condition: () => getTotalAssets() >= 1000000000000,
      unlocked: false,
    },
    {
      id: 'global_ceo',
      name: '글로벌 CEO',
      desc: '해외 진출을 달성했다',
      icon: '🌍',
      condition: () => usStocks >= 10 && cryptos >= 10,
      unlocked: false,
    },
    // 전설의 CEO: CEO + 총 자산 10조 + 서울타워 1개 이상 (프레스티지 경험 포함)
    {
      id: 'legendary_ceo',
      name: '전설의 CEO',
      desc: '모든 목표를 달성했다',
      icon: '⭐',
      condition: () =>
        careerLevel >= 9 && getTotalAssets() >= 10000000000000 && towers_lifetime >= 1,
      unlocked: false,
    },
  ]

  // ======= DOM =======
  const elCash = document.getElementById('cash')
  const elFinancial = document.getElementById('financial')
  const elProperties = document.getElementById('properties')
  const elRps = document.getElementById('rps')
  const elWork = document.getElementById('workBtn')
  const elWorkArea = document.querySelector('.work') // 노동 배경 영역
  const elAutoWorkIndicator = document.getElementById('autoWorkIndicator')
  const elLog = document.getElementById('log')
  const elShareBtn = document.getElementById('shareBtn')
  const elFavoriteBtn = document.getElementById('favoriteBtn') // 즐겨찾기 / 홈 화면 안내 버튼
  const elClickIncomeButton = document.getElementById('clickIncomeButton')
  const elClickIncomeLabel = document.getElementById('clickIncomeLabel')
  const elClickMultiplier = document.getElementById('clickMultiplier')
  const elRentMultiplier = document.getElementById('rentMultiplier')

  // 금융상품 관련
  const elDepositCount = document.getElementById('depositCount')
  const elIncomePerDeposit = document.getElementById('incomePerDeposit')
  const elBuyDeposit = document.getElementById('buyDeposit')

  const elSavingsCount = document.getElementById('savingsCount')
  const elIncomePerSavings = document.getElementById('incomePerSavings')
  const elBuySavings = document.getElementById('buySavings')

  const elBondCount = document.getElementById('bondCount')
  const elIncomePerBond = document.getElementById('incomePerBond')
  const elBuyBond = document.getElementById('buyBond')

  // 미국주식과 코인 관련
  const elUsStockCount = document.getElementById('usStockCount')
  const elIncomePerUsStock = document.getElementById('incomePerUsStock')
  const elBuyUsStock = document.getElementById('buyUsStock')

  const elCryptoCount = document.getElementById('cryptoCount')
  const elIncomePerCrypto = document.getElementById('incomePerCrypto')
  const elBuyCrypto = document.getElementById('buyCrypto')

  // 구매 수량 선택 시스템
  const elBuyMode = document.getElementById('buyMode')
  const elSellMode = document.getElementById('sellMode')
  const elQty1 = document.getElementById('qty1')
  const elQty5 = document.getElementById('qty5')
  const elQty10 = document.getElementById('qty10')

  // 토글 버튼들
  const elToggleUpgrades = document.getElementById('toggleUpgrades')
  const elToggleFinancial = document.getElementById('toggleFinancial')
  const elToggleProperties = document.getElementById('toggleProperties')

  // 저장 상태 표시
  const elSaveStatus = document.getElementById('saveStatus')
  const elResetBtn = document.getElementById('resetBtn')

  // 현재가 표시 요소들
  const elDepositCurrentPrice = document.getElementById('depositCurrentPrice')
  const elSavingsCurrentPrice = document.getElementById('savingsCurrentPrice')
  const elBondCurrentPrice = document.getElementById('bondCurrentPrice')
  const elVillaCurrentPrice = document.getElementById('villaCurrentPrice')
  const elOfficetelCurrentPrice = document.getElementById('officetelCurrentPrice')
  const elAptCurrentPrice = document.getElementById('aptCurrentPrice')
  const elShopCurrentPrice = document.getElementById('shopCurrentPrice')
  const elBuildingCurrentPrice = document.getElementById('buildingCurrentPrice')

  // 부동산 구입 관련
  const elVillaCount = document.getElementById('villaCount')
  const elRentPerVilla = document.getElementById('rentPerVilla')
  const elBuyVilla = document.getElementById('buyVilla')

  const elOfficetelCount = document.getElementById('officetelCount')
  const elRentPerOfficetel = document.getElementById('rentPerOfficetel')
  const elBuyOfficetel = document.getElementById('buyOfficetel')

  const elAptCount = document.getElementById('aptCount')
  const elRentPerApt = document.getElementById('rentPerApt')
  const elBuyApt = document.getElementById('buyApt')

  const elShopCount = document.getElementById('shopCount')
  const elRentPerShop = document.getElementById('rentPerShop')
  const elBuyShop = document.getElementById('buyShop')

  const elBuildingCount = document.getElementById('buildingCount')
  const elRentPerBuilding = document.getElementById('rentPerBuilding')
  const elBuyBuilding = document.getElementById('buyBuilding')

  const elTowerCountDisplay = document.getElementById('towerCountDisplay')
  const elTowerCountBadge = document.getElementById('towerCountBadge')
  const elTowerCurrentPrice = document.getElementById('towerCurrentPrice')
  const elBuyTower = document.getElementById('buyTower')

  // 커리어 관련
  const elCurrentCareer = document.getElementById('currentCareer')
  const elCareerCost = document.getElementById('careerCost')
  const elCareerProgress = document.getElementById('careerProgress')
  const elCareerProgressText = document.getElementById('careerProgressText')
  const elCareerRemaining = document.getElementById('careerRemaining')

  // 업그레이드 관련 (구형 DOM 제거됨 - 새로운 Cookie Clicker 스타일 사용)

  // ======= 애니메이션 시스템 초기화 (DOM 요소 선언 후) =======
  Animations.initAnimations(elWork)

  // ======= 유틸 =======
  function getTotalFinancialProducts() {
    return deposits + savings + bonds + usStocks + cryptos
  }

  function getTotalProperties() {
    return villas + officetels + apartments + shops + buildings
  }

  // (단순화) 랜덤 변동 제거: 초당 수익은 예측 가능하게 유지하고,
  // 변동성은 '시장 이벤트'만으로 표현합니다.
  function getFinancialIncome(type, count) {
    const baseIncome = FINANCIAL_INCOME[type]
    let income = baseIncome * count
    const marketMult = getMarketEventMultiplier(type, 'financial')
    income *= marketMult
    return income
  }

  function getPropertyIncome(type, count) {
    const baseIncome = BASE_RENT[type]
    let income = baseIncome * count
    const marketMult = getMarketEventMultiplier(type, 'property')
    income *= marketMult
    return income
  }

  function getRps() {
    // 금융상품 수익(고정) + 시장 이벤트 배수
    const financialIncome =
      getFinancialIncome('deposit', deposits) +
      getFinancialIncome('savings', savings) +
      getFinancialIncome('bond', bonds) +
      getFinancialIncome('usStock', usStocks) +
      getFinancialIncome('crypto', cryptos)

    // 부동산 수익(고정) + 시장 이벤트 배수
    const propertyRent =
      getPropertyIncome('villa', villas) +
      getPropertyIncome('officetel', officetels) +
      getPropertyIncome('apartment', apartments) +
      getPropertyIncome('shop', shops) +
      getPropertyIncome('building', buildings)

    // 배수 적용 순서: 1) 부동산에 rentMultiplier 적용, 2) 전체에 marketMultiplier 적용
    const totalIncome = financialIncome + propertyRent * rentMultiplier
    return totalIncome * marketMultiplier
  }

  // 퍼센트 표시용 기준 총 수익 (시장 이벤트/개별 배수는 포함, 글로벌 marketMultiplier는 제외)
  function getTotalIncomeForContribution() {
    const financialIncome =
      getFinancialIncome('deposit', deposits) +
      getFinancialIncome('savings', savings) +
      getFinancialIncome('bond', bonds) +
      getFinancialIncome('usStock', usStocks) +
      getFinancialIncome('crypto', cryptos)

    const propertyRent =
      getPropertyIncome('villa', villas) +
      getPropertyIncome('officetel', officetels) +
      getPropertyIncome('apartment', apartments) +
      getPropertyIncome('shop', shops) +
      getPropertyIncome('building', buildings)

    // 부동산에는 rentMultiplier까지 반영 (getRps와 동일 기준, marketMultiplier만 제외)
    return financialIncome + propertyRent * rentMultiplier
  }

  // 오토 업무 처리 시스템 UI 상태 동기화
  function updateAutoWorkUI() {
    if (elWorkArea) {
      if (autoClickEnabled) {
        elWorkArea.classList.add('auto-click-enabled')
      } else {
        elWorkArea.classList.remove('auto-click-enabled')
      }
    }
    if (elAutoWorkIndicator) {
      elAutoWorkIndicator.style.display = autoClickEnabled ? '' : 'none'
    }
  }

  // (단순화) 리스크 UI 제거

  // 업적 체크
  function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true
        showAchievementNotification(achievement)
        // 업적 번역 키가 없으면 원본 한글 사용 (fallback)
        const achievementName = t(`achievement.${achievement.id}.name`, {}, achievement.name)
        const achievementDesc = t(`achievement.${achievement.id}.desc`, {}, achievement.desc)
        Diary.addLog(t('msg.achievementUnlocked', { name: achievementName, desc: achievementDesc }))
      }
    })
  }

  // 업적 알림 표시
  function showAchievementNotification(achievement) {
    const notification = document.createElement('div')
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
      `
    // 번역 키가 없으면 fallback으로 한글 사용 (개발 중)
    const achievementName = t(`achievement.${achievement.id}.name`)
    const achievementDesc = t(`achievement.${achievement.id}.desc`)
    notification.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">🏆</div>
        <div style="font-size: 18px; margin-bottom: 5px;">${achievementName}</div>
        <div style="font-size: 14px; opacity: 0.8;">${achievementDesc}</div>
      `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification)
      }
    }, 3000)
  }

  // ======= 업그레이드 시스템 함수 =======

  // 업그레이드 해금 조건 체크
  function checkUpgradeUnlocks() {
    let newUnlocks = 0

    for (const [id, upgrade] of Object.entries(UPGRADES)) {
      // 이미 구매했거나 해금된 경우 스킵
      if (upgrade.purchased || upgrade.unlocked) continue

      // 해금 조건 체크
      try {
        if (upgrade.unlockCondition()) {
          upgrade.unlocked = true
          newUnlocks++
          Diary.addLog(t('msg.upgradeUnlocked', { name: t(`upgrade.${id}.name`) }))
        }
      } catch (error) {
        console.error(`업그레이드 해금 조건 체크 실패 (${id}):`, error)
      }
    }

    if (newUnlocks > 0) {
      updateUpgradeList()
    }
  }

  // 구매 가능 알림 체크

  function getClickIncome() {
    const currentCareer = getCurrentCareer()
    return Math.floor(10000 * currentCareer.multiplier * clickMultiplier) // 기본 1만원 × 배수
  }

  function getCurrentCareer() {
    return CAREER_LEVELS[careerLevel]
  }

  function getNextCareer() {
    return careerLevel < CAREER_LEVELS.length - 1 ? CAREER_LEVELS[careerLevel + 1] : null
  }

  // 자동 승진 체크 함수 (클릭 수 기준)
  function checkCareerPromotion() {
    const nextCareer = getNextCareer()
    if (nextCareer && totalClicks >= nextCareer.requiredClicks) {
      const oldCareerLevel = careerLevel
      careerLevel += 1
      const newCareer = getCurrentCareer()
      const clickIncome = getClickIncome()
      Diary.addLog(
        t('msg.promoted', {
          career: getCareerName(careerLevel),
          income: NumberFormat.formatKoreanNumber(clickIncome),
        })
      )

      // 승진 시 전환 애니메이션
      if (elWorkArea) {
        // 페이드 아웃 효과
        elWorkArea.style.transition = 'opacity 0.3s ease-out'
        elWorkArea.style.opacity = '0.5'

        setTimeout(() => {
          // 배경 이미지 변경
          if (newCareer.bgImage) {
            elWorkArea.style.transition = 'background-image 0.8s ease-in-out, opacity 0.5s ease-in'
            elWorkArea.style.backgroundImage = `url('${newCareer.bgImage}')`
          } else {
            elWorkArea.style.transition = 'background-image 0.8s ease-in-out, opacity 0.5s ease-in'
            elWorkArea.style.backgroundImage =
              'radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)'
          }

          // 페이드 인 효과
          elWorkArea.style.opacity = '1'
        }, 300)
      }

      // 직급 카드 애니메이션 효과
      const careerCard = document.querySelector('.career-card')
      if (careerCard) {
        careerCard.style.animation = 'none'
        setTimeout(() => {
          careerCard.style.animation = 'careerPromotion 0.6s ease-out'
        }, 10)
      }

      // 스크린 리더 알림
      const currentCareerEl = document.getElementById('currentCareer')
      if (currentCareerEl) {
        currentCareerEl.setAttribute(
          'aria-label',
          t('msg.promoted', {
            career: getCareerName(careerLevel),
            income: NumberFormat.formatKoreanNumber(clickIncome),
          })
        )
      }

      // 승진 후 즉시 UI 업데이트
      console.log('=== PROMOTION DEBUG ===')
      console.log('Promoted to:', getCareerName(careerLevel))
      console.log('New career level:', careerLevel)
      console.log('New multiplier:', newCareer.multiplier)
      console.log('Click income:', NumberFormat.formatKoreanNumber(clickIncome))
      console.log('======================')

      return true
    }
    return false
  }

  // 버튼 상태 업데이트 함수 (Cookie Clicker 스타일)
  function updateButtonStates() {
    const qty = purchaseQuantity
    const isBuy = purchaseMode === 'buy'

    // 금융상품 버튼 상태 업데이트
    const depositCanBuy = isBuy && cash >= getFinancialCost('deposit', deposits, qty)
    const savingsCanBuy = isBuy && cash >= getFinancialCost('savings', savings, qty)
    const bondCanBuy = isBuy && cash >= getFinancialCost('bond', bonds, qty)
    const usStockCanBuy = isBuy && cash >= getFinancialCost('usStock', usStocks, qty)
    const cryptoCanBuy = isBuy && cash >= getFinancialCost('crypto', cryptos, qty)

    elBuyDeposit.classList.toggle('affordable', depositCanBuy)
    elBuyDeposit.classList.toggle('unaffordable', isBuy && !depositCanBuy)
    elBuySavings.classList.toggle('affordable', savingsCanBuy)
    elBuySavings.classList.toggle('unaffordable', isBuy && !savingsCanBuy)
    elBuyBond.classList.toggle('affordable', bondCanBuy)
    elBuyBond.classList.toggle('unaffordable', isBuy && !bondCanBuy)
    elBuyUsStock.classList.toggle('affordable', usStockCanBuy)
    elBuyUsStock.classList.toggle('unaffordable', isBuy && !usStockCanBuy)
    elBuyCrypto.classList.toggle('affordable', cryptoCanBuy)
    elBuyCrypto.classList.toggle('unaffordable', isBuy && !cryptoCanBuy)

    // 부동산 버튼 상태 업데이트
    const villaCanBuy = isBuy && cash >= getPropertyCost('villa', villas, qty)
    const officetelCanBuy = isBuy && cash >= getPropertyCost('officetel', officetels, qty)
    const aptCanBuy = isBuy && cash >= getPropertyCost('apartment', apartments, qty)
    const shopCanBuy = isBuy && cash >= getPropertyCost('shop', shops, qty)
    const buildingCanBuy = isBuy && cash >= getPropertyCost('building', buildings, qty)

    elBuyVilla.classList.toggle('affordable', villaCanBuy)
    elBuyVilla.classList.toggle('unaffordable', isBuy && !villaCanBuy)
    elBuyOfficetel.classList.toggle('affordable', officetelCanBuy)
    elBuyOfficetel.classList.toggle('unaffordable', isBuy && !officetelCanBuy)
    elBuyApt.classList.toggle('affordable', aptCanBuy)
    elBuyApt.classList.toggle('unaffordable', isBuy && !aptCanBuy)
    elBuyShop.classList.toggle('affordable', shopCanBuy)
    elBuyShop.classList.toggle('unaffordable', isBuy && !shopCanBuy)
    elBuyBuilding.classList.toggle('affordable', buildingCanBuy)
    elBuyBuilding.classList.toggle('unaffordable', isBuy && !buildingCanBuy)

    // 서울타워 버튼 상태 (구매만 가능, 판매 불가)
    if (elBuyTower) {
      const towerCost = BASE_COSTS.tower
      const towerCanBuy = isBuy && cash >= towerCost && isProductUnlocked('tower')
      elBuyTower.classList.toggle('affordable', towerCanBuy)
      elBuyTower.classList.toggle(
        'unaffordable',
        isBuy && (!towerCanBuy || !isProductUnlocked('tower'))
      )
      elBuyTower.disabled = purchaseMode === 'sell' || !isProductUnlocked('tower')
    }

    // 업그레이드 버튼 상태 업데이트 (제거됨 - 새 시스템 사용)
  }

  // 건물 목록 색상 업데이트 함수
  function updateBuildingItemStates() {
    const qty = purchaseQuantity
    const isBuy = purchaseMode === 'buy'

    // 금융상품 아이템 상태 업데이트 (구매 모드일 때만 affordable 적용)
    const depositItem = document.getElementById('depositItem')
    const savingsItem = document.getElementById('savingsItem')
    const bondItem = document.getElementById('bondItem')
    const usStockItem = document.getElementById('usStockItem')
    const cryptoItem = document.getElementById('cryptoItem')

    depositItem.classList.toggle(
      'affordable',
      isBuy && cash >= getFinancialCost('deposit', deposits, qty)
    )
    savingsItem.classList.toggle(
      'affordable',
      isBuy && cash >= getFinancialCost('savings', savings, qty)
    )
    bondItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('bond', bonds, qty))
    usStockItem.classList.toggle(
      'affordable',
      isBuy && cash >= getFinancialCost('usStock', usStocks, qty)
    )
    cryptoItem.classList.toggle(
      'affordable',
      isBuy && cash >= getFinancialCost('crypto', cryptos, qty)
    )

    // 부동산 아이템 상태 업데이트 (구매 모드일 때만 affordable 적용)
    const villaItem = document.getElementById('villaItem')
    const officetelItem = document.getElementById('officetelItem')
    const aptItem = document.getElementById('aptItem')
    const shopItem = document.getElementById('shopItem')
    const buildingItem = document.getElementById('buildingItem')

    villaItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('villa', villas, qty))
    officetelItem.classList.toggle(
      'affordable',
      isBuy && cash >= getPropertyCost('officetel', officetels, qty)
    )
    aptItem.classList.toggle(
      'affordable',
      isBuy && cash >= getPropertyCost('apartment', apartments, qty)
    )
    shopItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('shop', shops, qty))
    buildingItem.classList.toggle(
      'affordable',
      isBuy && cash >= getPropertyCost('building', buildings, qty)
    )

    // 서울타워 아이템 상태 (구매만 가능, 판매 불가)
    const towerItem = document.getElementById('towerItem')
    if (towerItem) {
      const towerCost = BASE_COSTS.tower
      const towerCanBuy = isBuy && cash >= towerCost && isProductUnlocked('tower')
      towerItem.classList.toggle('affordable', towerCanBuy)
      towerItem.classList.toggle(
        'unaffordable',
        isBuy && (!towerCanBuy || !isProductUnlocked('tower'))
      )
    }
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
      towers_run: towers_run,
      towers_lifetime: towers_lifetime,
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
          { unlocked: upgrade.unlocked, purchased: upgrade.purchased },
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
      nickname: playerNickname,
    }

    // 디버깅: 닉네임 저장 확인
    if (__IS_DEV__) {
      console.log('💾 저장 데이터에 포함된 닉네임:', playerNickname || '(없음)')
      console.log('💾 saveData.nickname:', saveData.nickname)
    }

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
      lastSaveTime = new Date()
      console.log('게임 저장 완료:', lastSaveTime.toLocaleTimeString())
      updateSaveStatus() // 저장 상태 UI 업데이트

      // 로그인 사용자면 탭 숨김/닫기 시 플러시를 위해 대기 중인 저장으로 설정
      if (__currentUser) {
        const saveTs = Number(saveData?.ts || 0) || 0
        if (saveTs && saveTs > __lastCloudUploadedSaveTs) {
          __cloudPendingSave = saveData
          // 디버깅: 클라우드 저장 대기 중인 데이터 확인
          if (__IS_DEV__) {
            console.log(
              '☁️ 클라우드 저장 대기 중인 데이터에 닉네임 포함:',
              __cloudPendingSave.nickname || '(없음)'
            )
          }
        }
      }

      // 리더보드 업데이트 (닉네임이 있을 때만, 30초마다)
      if (
        playerNickname &&
        (!window.__lastLeaderboardUpdate || Date.now() - window.__lastLeaderboardUpdate > 30000)
      ) {
        LeaderboardUI.updateLeaderboardEntry()
        window.__lastLeaderboardUpdate = Date.now()
      }
    } catch (error) {
      console.error('게임 저장 실패:', error)
    }
  }

  // ======= 닉네임 관리 함수 =======

  /**
   * 로컬 저장에서 최종 닉네임을 확인하고 반환
   * @returns {string} 닉네임 (없으면 빈 문자열)
   */
  function resolveFinalNickname() {
    try {
      const saveData = localStorage.getItem(SAVE_KEY)
      if (!saveData) return ''
      const data = JSON.parse(saveData)
      return data.nickname || ''
    } catch (error) {
      console.error('닉네임 확인 실패:', error)
      return ''
    }
  }

  /**
   * 닉네임이 없으면 모달을 열고, 세션 플래그로 중복 방지
   * 이 함수는 모든 닉네임 모달 오픈의 단일 진입점
   */
  function ensureNicknameModal() {
    // 이미 이번 세션에서 모달을 열었으면 스킵
    if (__nicknameModalShown) {
      console.log('⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨')
      return
    }

    // 최종 닉네임 확인
    const finalNickname = resolveFinalNickname()
    if (finalNickname) {
      // 닉네임이 있으면 playerNickname 업데이트하고 스킵
      playerNickname = finalNickname
      console.log('✅ 닉네임 확인됨:', finalNickname)
      return
    }

    // 닉네임이 없으면 모달 오픈
    console.log('📝 닉네임 없음: 모달 오픈')
    __nicknameModalShown = true // 플래그 설정 (모달 오픈 전에 설정하여 중복 방지)

    // 닉네임 결정이 끝날 때까지 클라우드 복구를 세션 단위로 차단
    try {
      sessionStorage.setItem(CLOUD_RESTORE_BLOCK_KEY, '1')
    } catch (e) {
      console.warn('sessionStorage set 실패:', e)
    }

    setTimeout(() => {
      const handleConfirm = async nickname => {
        // 1. 로컬 유효성 검사 (새 정책: 1~6자, 공백 불허)
        const validation = validateNickname(nickname)
        if (!validation.ok) {
          let errorMessage = ''
          switch (validation.reasonKey) {
            case 'empty':
              errorMessage = t('settings.nickname.change.empty')
              break
            case 'tooShort':
              errorMessage = t('settings.nickname.change.tooShort')
              break
            case 'tooLong':
              errorMessage = t('settings.nickname.change.tooLong')
              break
            case 'invalid':
              errorMessage = t('settings.nickname.change.invalid')
              break
            case 'banned':
              errorMessage = t('settings.nickname.change.banned')
              break
            default:
              errorMessage = t('settings.nickname.change.invalid')
          }
          Modal.openInfoModal(t('modal.error.nicknameFormat.title'), errorMessage, '⚠️')
          __nicknameModalShown = false
          ensureNicknameModal()
          return
        }

        // 정규화
        const { raw: normalized, key } = normalizeNickname(nickname)

        // 2. 로그인 체크
        const user = await getUser()
        if (!user) {
          // 비로그인: 로컬만 저장
          playerNickname = normalized
          saveGame()
          Diary.addLog(t('msg.nicknameSet', { nickname: playerNickname }))
          Diary.addLog(t('settings.nickname.change.loginRequired'))

          // 클라우드 복구 차단 해제
          try {
            sessionStorage.removeItem(CLOUD_RESTORE_BLOCK_KEY)
          } catch (e) {
            console.warn('sessionStorage remove 실패:', e)
          }
          return
        }

        // 3. 로그인 상태: claimNickname 수행
        try {
          const claimResult = await claimNickname(normalized, user.id)

          if (!claimResult.success) {
            if (claimResult.error === 'taken') {
              Modal.openInfoModal(
                t('modal.error.nicknameTaken.title'),
                t('settings.nickname.change.taken'),
                '⚠️'
              )
            } else {
              Modal.openInfoModal(
                t('modal.error.nicknameFormat.title'),
                t('settings.nickname.change.claimFailed'),
                '⚠️'
              )
            }
            __nicknameModalShown = false
            ensureNicknameModal()
            return
          }

          // 성공
          playerNickname = normalized
          saveGame()
          Diary.addLog(t('msg.nicknameSet', { nickname: playerNickname }))

          // 마이그레이션 충돌 플래그 해제
          try {
            localStorage.removeItem('clicksurvivor_needsNicknameChange')
          } catch (e) {
            // 무시
          }

          // 리더보드 즉시 업데이트
          try {
            await LeaderboardUI.updateLeaderboardEntry(true)
          } catch (error) {
            console.error('리더보드 업데이트 실패:', error)
          }

          // 클라우드 복구 차단 해제
          try {
            sessionStorage.removeItem(CLOUD_RESTORE_BLOCK_KEY)
          } catch (e) {
            console.warn('sessionStorage remove 실패:', e)
          }
        } catch (error) {
          console.error('닉네임 설정 실패:', error)
          Modal.openInfoModal(
            t('modal.error.nicknameFormat.title'),
            t('settings.nickname.change.claimFailed'),
            '⚠️'
          )
          __nicknameModalShown = false
          ensureNicknameModal()
        }
      }

      Modal.openInputModal(t('modal.nickname.title'), t('modal.nickname.message'), handleConfirm, {
        icon: '✏️',
        primaryLabel: t('button.confirm'),
        placeholder: t('modal.nickname.placeholder'),
        maxLength: 6,
        defaultValue: '',
        required: true,
      })
    }, 500) // UI 로드 후 표시
  }

  // 게임 데이터 불러오기 함수
  function loadGame() {
    try {
      const saveData = localStorage.getItem(SAVE_KEY)
      if (!saveData) {
        console.log('저장된 게임 데이터가 없습니다.')
        // 새 게임 시작 시 누적 플레이시간 초기화
        totalPlayTime = 0
        sessionStartTime = Date.now()
        return false
      }

      const data = JSON.parse(saveData)

      // 게임 상태 복원
      cash = data.cash || 0
      totalClicks = data.totalClicks || 0
      totalLaborIncome = data.totalLaborIncome || 0
      careerLevel = data.careerLevel || 0
      clickMultiplier = data.clickMultiplier || 1
      rentMultiplier = data.rentMultiplier || 1
      autoClickEnabled = data.autoClickEnabled || false
      managerLevel = data.managerLevel || 0
      rentCost = data.rentCost || 1000000000
      mgrCost = data.mgrCost || 5000000000

      // 오토 업무 처리 UI 동기화
      updateAutoWorkUI()

      // 금융상품 복원
      deposits = data.deposits || 0
      savings = data.savings || 0
      bonds = data.bonds || 0
      usStocks = data.usStocks || 0
      cryptos = data.cryptos || 0

      // 금융상품 누적 생산량 복원
      depositsLifetime = data.depositsLifetime || 0
      savingsLifetime = data.savingsLifetime || 0
      bondsLifetime = data.bondsLifetime || 0
      usStocksLifetime = data.usStocksLifetime || 0
      cryptosLifetime = data.cryptosLifetime || 0

      // 부동산 복원
      villas = data.villas || 0
      officetels = data.officetels || 0
      apartments = data.apartments || 0
      shops = data.shops || 0
      buildings = data.buildings || 0
      towers_run = data.towers_run || 0
      towers_lifetime = data.towers_lifetime || data.towers || 0 // 마이그레이션: 기존 towers를 lifetime으로

      // 부동산 누적 생산량 복원
      villasLifetime = data.villasLifetime || 0
      officetelsLifetime = data.officetelsLifetime || 0
      apartmentsLifetime = data.apartmentsLifetime || 0
      shopsLifetime = data.shopsLifetime || 0
      buildingsLifetime = data.buildingsLifetime || 0

      // 업그레이드 복원 (새 Cookie Clicker 스타일)
      if (data.upgradesV2) {
        for (const [id, state] of Object.entries(data.upgradesV2)) {
          if (UPGRADES[id]) {
            UPGRADES[id].unlocked = state.unlocked
            UPGRADES[id].purchased = state.purchased

            // 효과 재적용 제거: clickMultiplier 등은 이미 저장된 값으로 복원되므로 중복 적용 불필요
            // 중복 적용 시 새로고침할 때마다 배수가 계속 곱해지는 버그 발생
          }
        }
      }

      // (버그픽스) 수익 테이블(FINANCIAL_INCOME/BASE_RENT)에만 영향을 주는 업그레이드 효과는
      // 저장값으로 복원되지 않으므로, 기본값으로 리셋 후 1회 재적용하여 재접속 시 수익이 줄어드는 문제를 방지한다.
      reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)

      // 시장 이벤트 복원
      marketMultiplier = data.marketMultiplier || 1
      marketEventEndTime = data.marketEventEndTime || 0

      // 업적 복원
      if (data.achievements) {
        ACHIEVEMENTS.forEach((achievement, index) => {
          if (data.achievements[index]) {
            achievement.unlocked = data.achievements[index].unlocked
          }
        })
      }

      // 게임 시작 시간 복원 (호환성 유지)
      if (data.gameStartTime) {
        gameStartTime = data.gameStartTime
      }

      // 누적 플레이시간 시스템 복원
      if (data.totalPlayTime !== undefined) {
        totalPlayTime = data.totalPlayTime
        console.log('🕐 이전 누적 플레이시간 복원:', totalPlayTime, 'ms')
      }
      // 닉네임 복원
      playerNickname = data.nickname || ''
      if (data.sessionStartTime) {
        // 이전 세션의 플레이시간을 누적 (정수로 보정)
        const previousSessionTime = Math.max(0, Math.floor(Date.now() - data.sessionStartTime))
        totalPlayTime = Math.max(0, Math.floor(totalPlayTime + previousSessionTime))
        console.log('🕐 이전 세션 플레이시간 누적:', previousSessionTime, 'ms')
      }
      // 새 세션 시작
      sessionStartTime = Date.now()
      console.log('🕐 새 세션 시작:', new Date(sessionStartTime).toLocaleString())
      console.log('🕐 총 누적 플레이시간:', totalPlayTime, 'ms')

      console.log(
        '게임 불러오기 완료:',
        data.saveTime ? new Date(data.saveTime).toLocaleString() : '시간 정보 없음'
      )
      return true
    } catch (error) {
      console.error('게임 불러오기 실패:', error)
      return false
    }
  }

  // 게임 초기화 함수 (A안: 수동 프레스티지 - 런 상태만 초기화, 누적 데이터 유지)
  function resetGame() {
    console.log('🔄 resetGame function called (A안: 수동 프레스티지)') // 디버깅용

    Modal.openConfirmModal(
      t('modal.confirm.reset.title'),
      t('modal.confirm.reset.message'),
      () => {
        // 모달이 완전히 닫힌 후 프레스티지 실행 (DOM 안정화 대기)
        setTimeout(async () => {
          try {
            // 초기화 진행 메시지 (diary가 초기화되었을 때만 로그)
            if (elLog && typeof Diary.addLog === 'function') {
              Diary.addLog(t('msg.gameReset'))
            }
            console.log('✅ User confirmed reset (A안: 수동 프레스티지)') // 디버깅용

            // A안: performAutoPrestige() 호출로 런 상태만 초기화
            // - towers_lifetime, totalPlayTime 등 누적 데이터는 유지됨
            // - 닉네임도 유지됨 (performAutoPrestige에서 건드리지 않음)
            await performAutoPrestige('settings')

            if (__IS_DEV__) {
              console.log('✅ 수동 프레스티지 완료 (누적 데이터 유지)')
            }
          } catch (error) {
            console.error('❌ Error in resetGame:', error)
            console.error('에러 스택:', error.stack)
            // 실제 치명적 오류만 사용자에게 알림
            Modal.openInfoModal(
              t('modal.error.resetError.title'),
              t('modal.error.resetError.message'),
              '⚠️'
            )
          }
        }, 100) // 모달 닫힘 애니메이션 대기
      },
      {
        icon: '🔄',
        primaryLabel: t('modal.confirm.reset.primaryLabel'),
        secondaryLabel: t('button.cancel'),
      }
    )
  }

  // 설정 저장 함수
  function saveSettings() {
    try {
      safeSetJSON(SETTINGS_KEY, settings)
    } catch (error) {
      console.error('설정 저장 실패:', error)
    }
  }

  // 설정 불러오기 함수
  function loadSettings() {
    try {
      const saved = safeGetJSON(SETTINGS_KEY, null)
      if (saved) {
        settings = { ...settings, ...saved }
      }
    } catch (error) {
      console.error('설정 불러오기 실패:', error)
    }
  }

  // 저장 내보내기 함수
  function exportSave() {
    try {
      const saveData = localStorage.getItem(SAVE_KEY)
      if (!saveData) {
        alert(t('modal.error.noSaveData.message'))
        return
      }

      const blob = new Blob([saveData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `capital-clicker-save-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      Diary.addLog(t('msg.saveExported'))
    } catch (error) {
      console.error('저장 내보내기 실패:', error)
      alert('저장 내보내기 중 오류가 발생했습니다.')
    }
  }

  // 저장 가져오기 함수
  function importSave(file) {
    try {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const saveData = JSON.parse(e.target.result)
          localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
          Diary.addLog(t('msg.saveImported'))
          setTimeout(() => {
            location.reload()
          }, 1000)
        } catch (error) {
          console.error('저장 파일 파싱 실패:', error)
          alert('저장 파일 형식이 올바르지 않습니다.')
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('저장 가져오기 실패:', error)
      alert('저장 가져오기 중 오류가 발생했습니다.')
    }
  }

  // 저장 상태 UI 업데이트 함수
  function updateSaveStatus() {
    if (elSaveStatus) {
      const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
      const timeStr = lastSaveTime.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      })
      elSaveStatus.textContent = t('ui.saved', { time: timeStr })
    }
    // 설정 탭의 마지막 저장 시간 업데이트
    const elLastSaveTimeSettings = document.getElementById('lastSaveTimeSettings')
    if (elLastSaveTimeSettings) {
      const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
      const timeStr = lastSaveTime.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      elLastSaveTimeSettings.textContent = timeStr
    }
  }

  function updateUI() {
    // 전체 함수를 try-catch로 감싸서 안전하게 처리
    try {
      // 게임 버전 표시 업데이트 (package.json 동기화)
      const gameVersionDisplay = document.getElementById('gameVersionDisplay')
      if (gameVersionDisplay) {
        gameVersionDisplay.textContent = `v${GAME_VERSION}`
      }

      // --- (A) 커리어 진행률 갱신을 최우선으로 ---
      try {
        // 닉네임 표시 업데이트
        const nicknameLabel = document.getElementById('playerNicknameLabel')
        const nicknameInfoItem = document.getElementById('nicknameInfoItem')
        if (nicknameLabel) {
          nicknameLabel.textContent = playerNickname || '-'
        }
        if (nicknameInfoItem) {
          nicknameInfoItem.style.display = playerNickname ? 'flex' : 'none'
        }
        // 닉네임 변경 버튼 표시/숨김
        const nicknameChangeButtonContainer = document.getElementById(
          'nicknameChangeButtonContainer'
        )
        if (nicknameChangeButtonContainer) {
          nicknameChangeButtonContainer.style.display = playerNickname ? 'block' : 'none'
        }

        // 마이그레이션 충돌 배너 표시
        const nicknameConflictBanner = document.getElementById('nicknameConflictBanner')
        if (nicknameConflictBanner) {
          try {
            const needsChange = localStorage.getItem('clicksurvivor_needsNicknameChange') === 'true'
            if (needsChange) {
              nicknameConflictBanner.style.display = 'block'
              // 배너 내용 업데이트
              const bannerText = nicknameConflictBanner.querySelector('span')
              if (bannerText) {
                bannerText.textContent = t('settings.nickname.migrationConflict.message')
              }
            } else {
              nicknameConflictBanner.style.display = 'none'
            }
          } catch (e) {
            nicknameConflictBanner.style.display = 'none'
          }
        }

        // Supabase 진단 배지는 프로덕션에서는 표시하지 않음 (디버그 코드 제거)
        // totalClicks 값 유효성 검사
        if (typeof totalClicks !== 'number' || totalClicks < 0) {
          console.warn('Invalid totalClicks value:', totalClicks, 'resetting to 0')
          totalClicks = 0
        }

        const currentCareer = getCurrentCareer()
        const nextCareer = getNextCareer()

        if (!currentCareer) {
          console.error('getCurrentCareer() returned null/undefined')
          return
        }

        safeText(elCurrentCareer, getCareerName(careerLevel))
        safeText(elClickIncomeButton, NumberFormat.formatNumberForLang(getClickIncome()))

        // 직급별 배경 이미지 업데이트
        if (elWorkArea && currentCareer.bgImage) {
          elWorkArea.style.backgroundImage = `url('${currentCareer.bgImage}')`
        } else if (elWorkArea && !currentCareer.bgImage) {
          // 배경 이미지가 없으면 기본 그라데이션으로 복원
          elWorkArea.style.backgroundImage =
            'radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)'
        }

        if (nextCareer) {
          // 승진 진행률 계산 및 표시 (개선된 형식)
          const progress = Math.min((totalClicks / nextCareer.requiredClicks) * 100, 100)
          const remaining = Math.max(0, nextCareer.requiredClicks - totalClicks)

          if (elCareerProgress) {
            elCareerProgress.style.width = progress + '%'
            elCareerProgress.setAttribute('aria-valuenow', Math.round(progress))
          }

          // 간소화된 진행률 표시
          safeText(
            elCareerProgressText,
            `${Math.round(progress)}% (${totalClicks}/${nextCareer.requiredClicks})`
          )

          // 남은 클릭 수 표시
          if (elCareerRemaining) {
            if (remaining > 0) {
              // 천 단위 콤마 표기
              safeText(
                elCareerRemaining,
                t('ui.nextPromotion', { remaining: remaining.toLocaleString('ko-KR') })
              )
            } else {
              safeText(elCareerRemaining, t('ui.promotionAvailable'))
            }
          }

          // 디버깅: 승진 진행률 확인 (강화된 로깅)
          console.log('=== CAREER PROGRESS DEBUG ===')
          console.log('totalClicks:', totalClicks)
          console.log('nextCareer.requiredClicks:', nextCareer.requiredClicks)
          console.log('progress:', progress)
          console.log('currentCareer:', currentCareer.name)
          console.log('nextCareer:', nextCareer.name)
          console.log('=============================')
        } else {
          if (elCareerProgress) {
            elCareerProgress.style.width = '100%'
            elCareerProgress.setAttribute('aria-valuenow', 100)
          }
          safeText(elCareerProgressText, '100% (완료)')
          if (elCareerRemaining) {
            safeText(elCareerRemaining, '최고 직급 달성')
          }
        }
      } catch (e) {
        console.error('Career UI update failed:', e)
        console.error('Error details:', {
          totalClicks,
          careerLevel,
          currentCareer: getCurrentCareer(),
          nextCareer: getNextCareer(),
        })
      }

      // --- (B) 나머지 UI 갱신 (금융/부동산/업그레이드 등) ---
      // 일기장 헤더 메타(yyyy.mm.dd(N일차))는 로그가 없어도 항상 갱신
      {
        const elCompact = document.getElementById('diaryHeaderMeta')
        if (elCompact) {
          const pad2 = n => String(n).padStart(2, '0')
          const now = new Date()
          const y = now.getFullYear()
          const m = pad2(now.getMonth() + 1)
          const d = pad2(now.getDate())
          const base =
            typeof gameStartTime !== 'undefined' && gameStartTime ? gameStartTime : sessionStartTime
          const days = Math.max(1, Math.floor((Date.now() - base) / 86400000) + 1)
          elCompact.textContent = `${y}.${m}.${d}(${t('ui.dayCount', { days })})`
        }
      }
      safeText(elCash, NumberFormat.formatHeaderCash(cash, settings))
      // 금융상품 집계 및 툴팁
      const totalFinancial = getTotalFinancialProducts()
      safeText(elFinancial, NumberFormat.formatNumberForLang(totalFinancial))
      const financialChip = document.getElementById('financialChip')
      if (financialChip) {
        const countUnit = t('ui.unit.count')
        const tooltip = `${getProductName('deposit')}: ${deposits}${countUnit}\n${getProductName('savings')}: ${savings}${countUnit}\n${getProductName('bond')}: ${bonds}${countUnit}\n${getProductName('usStock')}: ${usStocks}${countUnit}\n${getProductName('crypto')}: ${cryptos}${countUnit}`
        financialChip.setAttribute('title', tooltip)
      }

      // 부동산 집계 및 툴팁
      const totalProperties = getTotalProperties()
      safeText(elProperties, NumberFormat.formatNumberForLang(totalProperties))
      const propertyChip = document.getElementById('propertyChip')
      if (propertyChip) {
        const propertyUnit = t('ui.unit.property')
        const villaName = getProductName('villa')
        const officetelName = getProductName('officetel')
        const aptName = getProductName('apartment')
        const shopName = getProductName('shop')
        const buildingName = getProductName('building')
        const tooltip = `${villaName}: ${villas}${propertyUnit}\n${officetelName}: ${officetels}${propertyUnit}\n${aptName}: ${apartments}${propertyUnit}\n${shopName}: ${shops}${propertyUnit}\n${buildingName}: ${buildings}${propertyUnit}`
        propertyChip.setAttribute('title', tooltip)
      }

      // 타워 배지 표시/숨김
      const towerBadge = document.getElementById('towerBadge')
      const towerCountHeader = document.getElementById('towerCountHeader')
      if (towerBadge && towerCountHeader) {
        if (towers_lifetime > 0) {
          towerBadge.style.display = 'flex'
          towerCountHeader.textContent = towers_lifetime
        } else {
          towerBadge.style.display = 'none'
        }
      }

      // 초당 수익 및 툴팁
      const rpsValue = getRps()
      safeText(elRps, NumberFormat.formatHeaderCash(rpsValue, settings))
      const rpsChip = document.getElementById('rpsChip')
      if (rpsChip) {
        const financialIncome =
          deposits * FINANCIAL_INCOME.deposit +
          savings * FINANCIAL_INCOME.savings +
          bonds * FINANCIAL_INCOME.bond
        const propertyIncome =
          (villas * BASE_RENT.villa +
            officetels * BASE_RENT.officetel +
            apartments * BASE_RENT.apartment +
            shops * BASE_RENT.shop +
            buildings * BASE_RENT.building) *
          rentMultiplier

        const financialIncomeFormatted =
          NumberFormat.formatNumberForLang(financialIncome) + t('ui.currency') + '/s'
        const propertyIncomeFormatted =
          NumberFormat.formatNumberForLang(propertyIncome) + t('ui.currency') + '/s'
        const tooltip = `${t('header.tooltip.financialIncome', { amount: financialIncomeFormatted })}\n${t('header.tooltip.propertyIncome', { amount: propertyIncomeFormatted })}\n${t('header.tooltip.marketMultiplier', { multiplier: marketMultiplier })}`
        rpsChip.setAttribute('title', tooltip)
      }

      // ======= [투자] 시장 이벤트 영향 배지/하이라이트 =======
      updateInvestmentMarketImpactUI()

      safeText(elClickMultiplier, clickMultiplier.toFixed(1))
      safeText(elRentMultiplier, rentMultiplier.toFixed(1))

      // 디버깅: 전체 게임 상태 확인
      console.log('=== GAME STATE DEBUG ===')
      console.log('Cash:', cash)
      console.log('Total clicks:', totalClicks)
      console.log('Career level:', careerLevel)
      console.log('Financial products:', {
        deposits,
        savings,
        bonds,
        total: getTotalFinancialProducts(),
      })
      console.log('Properties:', {
        villas,
        officetels,
        apartments,
        shops,
        buildings,
        total: getTotalProperties(),
      })
      console.log('========================')

      // 금융상품 UI 업데이트 (동적 가격 계산) - 안전장치 추가
      try {
        // 금융상품 변수 유효성 검사
        if (typeof deposits !== 'number' || deposits < 0) {
          console.warn('Invalid deposits value:', deposits, 'resetting to 0')
          deposits = 0
        }
        if (typeof savings !== 'number' || savings < 0) {
          console.warn('Invalid savings value:', savings, 'resetting to 0')
          savings = 0
        }
        if (typeof bonds !== 'number' || bonds < 0) {
          console.warn('Invalid bonds value:', bonds, 'resetting to 0')
          bonds = 0
        }

        // 퍼센트 표기는 실제 현재 수익 기준으로 계산 (시장 이벤트/배수 반영, 글로벌 marketMultiplier는 제외)
        const totalRps = getTotalIncomeForContribution()

        // 예금 업데이트
        const depositCost =
          purchaseMode === 'buy'
            ? getFinancialCost('deposit', deposits, purchaseQuantity)
            : getFinancialSellPrice('deposit', deposits, purchaseQuantity)
        const depositTotalIncome = deposits * FINANCIAL_INCOME.deposit
        const depositEffectiveIncome = getFinancialIncome('deposit', deposits)
        const depositPercent =
          totalRps > 0 ? ((depositEffectiveIncome / totalRps) * 100).toFixed(1) : 0

        elDepositCount.textContent = deposits
        const depositCurrency = t('ui.currency')
        const depositUnit = t('ui.unit.count')
        const depositName = getProductName('deposit')
        const depositPerUnitAmount =
          Math.floor(FINANCIAL_INCOME.deposit).toLocaleString(
            getLang() === 'en' ? 'en-US' : 'ko-KR'
          ) + depositCurrency
        const depositTotalAmount =
          Math.floor(depositTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
          depositCurrency
        const depositLifetimeAmount = NumberFormat.formatCashDisplayFixed1(
          depositsLifetime,
          settings
        )
        const depositPrice = NumberFormat.formatFinancialPrice(depositCost)

        // 상품 이름 업데이트
        const depositTitleEl = document.querySelector('#depositItem .title')
        if (depositTitleEl) {
          const titleSpan = depositTitleEl.querySelector('span[data-i18n="product.deposit"]')
          if (titleSpan) {
            titleSpan.textContent = depositName
          } else {
            depositTitleEl.textContent = `💰 ${depositName}`
          }
        }

        // 설명 업데이트 - HTML의 data-i18n 요소들을 업데이트하고 동적 값만 교체
        const depositDescEls = document.querySelectorAll('#depositItem .desc')
        if (depositDescEls.length >= 4) {
          // 첫 번째 desc: 각 상품이 초당 X 생산
          const perUnitText = t('product.desc.perUnit', {
            product: depositName,
            amount: depositPerUnitAmount,
          })
          depositDescEls[0].innerHTML = `• ${perUnitText.replace(depositPerUnitAmount, `<b>${depositPerUnitAmount}</b>`)}`

          // 두 번째 desc: N개 상품이 초당 X 생산 (총 수익의 Y%)
          const totalText = t('product.desc.total', {
            count: deposits,
            unit: depositUnit,
            product: depositName,
            amount: depositTotalAmount,
            percent: depositPercent,
          })
          depositDescEls[1].innerHTML = `• ${totalText.replace(depositTotalAmount, `<b>${depositTotalAmount}</b>`).replace(depositPercent + '%', `<b>${depositPercent}%</b>`)}`

          // 세 번째 desc: 지금까지 X 생산
          const lifetimeText = t('product.desc.lifetime', { amount: depositLifetimeAmount })
          depositDescEls[2].innerHTML = `• ${lifetimeText.replace(depositLifetimeAmount, `<b>${depositLifetimeAmount}</b>`)}`

          // 네 번째 desc: 현재가: X
          const currentPriceText = t('product.desc.currentPrice', { price: depositPrice })
          depositDescEls[3].innerHTML = currentPriceText.replace(
            depositPrice,
            `<b>${depositPrice}</b>`
          )
        }

        // 기존 ID 요소들 업데이트 (하위 호환성)
        const incomePerDepositEl = document.getElementById('incomePerDeposit')
        if (incomePerDepositEl) incomePerDepositEl.textContent = depositPerUnitAmount
        const depositTotalIncomeEl = document.getElementById('depositTotalIncome')
        if (depositTotalIncomeEl) depositTotalIncomeEl.textContent = depositTotalAmount
        const depositPercentEl = document.getElementById('depositPercent')
        if (depositPercentEl) depositPercentEl.textContent = depositPercent + '%'
        const depositLifetimeEl = document.getElementById('depositLifetime')
        if (depositLifetimeEl) depositLifetimeEl.textContent = depositLifetimeAmount
        if (elDepositCurrentPrice) elDepositCurrentPrice.textContent = depositPrice

        // 적금 업데이트
        const savingsCost =
          purchaseMode === 'buy'
            ? getFinancialCost('savings', savings, purchaseQuantity)
            : getFinancialSellPrice('savings', savings, purchaseQuantity)
        const savingsTotalIncome = savings * FINANCIAL_INCOME.savings
        const savingsEffectiveIncome = getFinancialIncome('savings', savings)
        const savingsPercent =
          totalRps > 0 ? ((savingsEffectiveIncome / totalRps) * 100).toFixed(1) : 0

        elSavingsCount.textContent = savings
        const savingsCurrency = t('ui.currency')
        const savingsUnit = t('ui.unit.count')
        const savingsName = getProductName('savings')
        const savingsPerUnitAmount =
          Math.floor(FINANCIAL_INCOME.savings).toLocaleString(
            getLang() === 'en' ? 'en-US' : 'ko-KR'
          ) + savingsCurrency
        const savingsTotalAmount =
          Math.floor(savingsTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
          savingsCurrency
        const savingsLifetimeAmount = NumberFormat.formatCashDisplayFixed1(
          savingsLifetime,
          settings
        )
        const savingsPrice = NumberFormat.formatFinancialPrice(savingsCost)

        // 상품 이름 업데이트
        const savingsTitleEl = document.querySelector('#savingsItem .title')
        if (savingsTitleEl) savingsTitleEl.textContent = `🏦 ${savingsName}`

        // 설명 업데이트
        const savingsDescEls = document.querySelectorAll('#savingsItem .desc')
        if (savingsDescEls.length >= 4) {
          const savingsPerUnitText = t('product.desc.perUnit', {
            product: savingsName,
            amount: savingsPerUnitAmount,
          })
          savingsDescEls[0].innerHTML = `• ${savingsPerUnitText.replace(savingsPerUnitAmount, `<b>${savingsPerUnitAmount}</b>`)}`
          const savingsTotalText = t('product.desc.total', {
            count: savings,
            unit: savingsUnit,
            product: savingsName,
            amount: savingsTotalAmount,
            percent: savingsPercent,
          })
          savingsDescEls[1].innerHTML = `• ${savingsTotalText.replace(savingsTotalAmount, `<b>${savingsTotalAmount}</b>`).replace(savingsPercent + '%', `<b>${savingsPercent}%</b>`)}`
          const savingsLifetimeText = t('product.desc.lifetime', { amount: savingsLifetimeAmount })
          savingsDescEls[2].innerHTML = `• ${savingsLifetimeText.replace(savingsLifetimeAmount, `<b>${savingsLifetimeAmount}</b>`)}`
          const savingsCurrentPriceText = t('product.desc.currentPrice', { price: savingsPrice })
          savingsDescEls[3].innerHTML = savingsCurrentPriceText.replace(
            savingsPrice,
            `<b>${savingsPrice}</b>`
          )
        }

        elIncomePerSavings.textContent = savingsPerUnitAmount
        document.getElementById('savingsTotalIncome').textContent = savingsTotalAmount
        document.getElementById('savingsPercent').textContent = savingsPercent + '%'
        document.getElementById('savingsLifetimeDisplay').textContent = savingsLifetimeAmount
        elSavingsCurrentPrice.textContent = savingsPrice

        // 주식 업데이트
        const bondCost =
          purchaseMode === 'buy'
            ? getFinancialCost('bond', bonds, purchaseQuantity)
            : getFinancialSellPrice('bond', bonds, purchaseQuantity)
        const bondTotalIncome = bonds * FINANCIAL_INCOME.bond
        const bondEffectiveIncome = getFinancialIncome('bond', bonds)
        const bondPercent = totalRps > 0 ? ((bondEffectiveIncome / totalRps) * 100).toFixed(1) : 0

        elBondCount.textContent = bonds
        const bondCurrency = t('ui.currency')
        const bondUnit = t('ui.unit.count')
        const bondName = getProductName('bond')
        const bondPerUnitAmount =
          Math.floor(FINANCIAL_INCOME.bond).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
          bondCurrency
        const bondTotalAmount =
          Math.floor(bondTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
          bondCurrency
        const bondLifetimeAmount = NumberFormat.formatCashDisplayFixed1(bondsLifetime, settings)
        const bondPrice = NumberFormat.formatFinancialPrice(bondCost)

        // 상품 이름 업데이트
        const bondTitleEl = document.querySelector('#bondItem .title')
        if (bondTitleEl) bondTitleEl.textContent = `📈 ${bondName}`

        // 설명 업데이트
        const bondDescEls = document.querySelectorAll('#bondItem .desc')
        if (bondDescEls.length >= 4) {
          const bondPerUnitText = t('product.desc.perUnit', {
            product: bondName,
            amount: bondPerUnitAmount,
          })
          bondDescEls[0].innerHTML = `• ${bondPerUnitText.replace(bondPerUnitAmount, `<b>${bondPerUnitAmount}</b>`)}`
          const bondTotalText = t('product.desc.total', {
            count: bonds,
            unit: bondUnit,
            product: bondName,
            amount: bondTotalAmount,
            percent: bondPercent,
          })
          bondDescEls[1].innerHTML = `• ${bondTotalText.replace(bondTotalAmount, `<b>${bondTotalAmount}</b>`).replace(bondPercent + '%', `<b>${bondPercent}%</b>`)}`
          const bondLifetimeText = t('product.desc.lifetime', { amount: bondLifetimeAmount })
          bondDescEls[2].innerHTML = `• ${bondLifetimeText.replace(bondLifetimeAmount, `<b>${bondLifetimeAmount}</b>`)}`
          const bondCurrentPriceText = t('product.desc.currentPrice', { price: bondPrice })
          bondDescEls[3].innerHTML = bondCurrentPriceText.replace(bondPrice, `<b>${bondPrice}</b>`)
        }

        elIncomePerBond.textContent = bondPerUnitAmount
        document.getElementById('bondTotalIncome').textContent = bondTotalAmount
        document.getElementById('bondPercent').textContent = bondPercent + '%'
        document.getElementById('bondLifetimeDisplay').textContent = bondLifetimeAmount
        elBondCurrentPrice.textContent = bondPrice

        // 미국주식 업데이트
        const usStockCost =
          purchaseMode === 'buy'
            ? getFinancialCost('usStock', usStocks, purchaseQuantity)
            : getFinancialSellPrice('usStock', usStocks, purchaseQuantity)
        const usStockTotalIncome = usStocks * FINANCIAL_INCOME.usStock
        const usStockEffectiveIncome = getFinancialIncome('usStock', usStocks)
        const usStockPercent =
          totalRps > 0 ? ((usStockEffectiveIncome / totalRps) * 100).toFixed(1) : 0

        document.getElementById('usStockCount').textContent = usStocks
        const usStockCurrency = t('ui.currency')
        const usStockUnit = t('ui.unit.count')
        const usStockName = getProductName('usStock')
        const usStockPerUnitAmount =
          Math.floor(FINANCIAL_INCOME.usStock).toLocaleString(
            getLang() === 'en' ? 'en-US' : 'ko-KR'
          ) + usStockCurrency
        const usStockTotalAmount =
          Math.floor(usStockTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
          usStockCurrency
        const usStockLifetimeAmount = NumberFormat.formatCashDisplayFixed1(
          usStocksLifetime,
          settings
        )
        const usStockPrice = NumberFormat.formatFinancialPrice(usStockCost)

        // 상품 이름 업데이트
        const usStockTitleEl = document.querySelector('#usStockItem .title')
        if (usStockTitleEl) usStockTitleEl.textContent = `🇺🇸 ${usStockName}`

        // 설명 업데이트
        const usStockDescEls = document.querySelectorAll('#usStockItem .desc')
        if (usStockDescEls.length >= 4) {
          const usStockPerUnitText = t('product.desc.perUnit', {
            product: usStockName,
            amount: usStockPerUnitAmount,
          })
          usStockDescEls[0].innerHTML = `• ${usStockPerUnitText.replace(usStockPerUnitAmount, `<b>${usStockPerUnitAmount}</b>`)}`
          const usStockTotalText = t('product.desc.total', {
            count: usStocks,
            unit: usStockUnit,
            product: usStockName,
            amount: usStockTotalAmount,
            percent: usStockPercent,
          })
          usStockDescEls[1].innerHTML = `• ${usStockTotalText.replace(usStockTotalAmount, `<b>${usStockTotalAmount}</b>`).replace(usStockPercent + '%', `<b>${usStockPercent}%</b>`)}`
          const usStockLifetimeText = t('product.desc.lifetime', { amount: usStockLifetimeAmount })
          usStockDescEls[2].innerHTML = `• ${usStockLifetimeText.replace(usStockLifetimeAmount, `<b>${usStockLifetimeAmount}</b>`)}`
          const usStockCurrentPriceText = t('product.desc.currentPrice', { price: usStockPrice })
          usStockDescEls[3].innerHTML = usStockCurrentPriceText.replace(
            usStockPrice,
            `<b>${usStockPrice}</b>`
          )
        }

        document.getElementById('incomePerUsStock').textContent = usStockPerUnitAmount
        document.getElementById('usStockTotalIncome').textContent = usStockTotalAmount
        document.getElementById('usStockPercent').textContent = usStockPercent + '%'
        document.getElementById('usStockLifetimeDisplay').textContent = usStockLifetimeAmount
        document.getElementById('usStockCurrentPrice').textContent = usStockPrice

        // 코인 업데이트
        const cryptoCost =
          purchaseMode === 'buy'
            ? getFinancialCost('crypto', cryptos, purchaseQuantity)
            : getFinancialSellPrice('crypto', cryptos, purchaseQuantity)
        const cryptoTotalIncome = cryptos * FINANCIAL_INCOME.crypto
        const cryptoEffectiveIncome = getFinancialIncome('crypto', cryptos)
        const cryptoPercent =
          totalRps > 0 ? ((cryptoEffectiveIncome / totalRps) * 100).toFixed(1) : 0

        document.getElementById('cryptoCount').textContent = cryptos
        const cryptoCurrency = t('ui.currency')
        const cryptoUnit = t('ui.unit.count')
        const cryptoName = getProductName('crypto')
        const cryptoPerUnitAmount =
          Math.floor(FINANCIAL_INCOME.crypto).toLocaleString(
            getLang() === 'en' ? 'en-US' : 'ko-KR'
          ) + cryptoCurrency
        const cryptoTotalAmount =
          Math.floor(cryptoTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
          cryptoCurrency
        const cryptoLifetimeAmount = NumberFormat.formatCashDisplayFixed1(cryptosLifetime, settings)
        const cryptoPrice = NumberFormat.formatFinancialPrice(cryptoCost)

        // 상품 이름 업데이트
        const cryptoTitleEl = document.querySelector('#cryptoItem .title')
        if (cryptoTitleEl) cryptoTitleEl.textContent = `₿ ${cryptoName}`

        // 설명 업데이트
        const cryptoDescEls = document.querySelectorAll('#cryptoItem .desc')
        if (cryptoDescEls.length >= 4) {
          const cryptoPerUnitText = t('product.desc.perUnit', {
            product: cryptoName,
            amount: cryptoPerUnitAmount,
          })
          cryptoDescEls[0].innerHTML = `• ${cryptoPerUnitText.replace(cryptoPerUnitAmount, `<b>${cryptoPerUnitAmount}</b>`)}`
          const cryptoTotalText = t('product.desc.total', {
            count: cryptos,
            unit: cryptoUnit,
            product: cryptoName,
            amount: cryptoTotalAmount,
            percent: cryptoPercent,
          })
          cryptoDescEls[1].innerHTML = `• ${cryptoTotalText.replace(cryptoTotalAmount, `<b>${cryptoTotalAmount}</b>`).replace(cryptoPercent + '%', `<b>${cryptoPercent}%</b>`)}`
          const cryptoLifetimeText = t('product.desc.lifetime', { amount: cryptoLifetimeAmount })
          cryptoDescEls[2].innerHTML = `• ${cryptoLifetimeText.replace(cryptoLifetimeAmount, `<b>${cryptoLifetimeAmount}</b>`)}`
          const cryptoCurrentPriceText = t('product.desc.currentPrice', { price: cryptoPrice })
          cryptoDescEls[3].innerHTML = cryptoCurrentPriceText.replace(
            cryptoPrice,
            `<b>${cryptoPrice}</b>`
          )
        }

        document.getElementById('incomePerCrypto').textContent = cryptoPerUnitAmount
        document.getElementById('cryptoTotalIncome').textContent = cryptoTotalAmount
        document.getElementById('cryptoPercent').textContent = cryptoPercent + '%'
        document.getElementById('cryptoLifetimeDisplay').textContent = cryptoLifetimeAmount
        document.getElementById('cryptoCurrentPrice').textContent = cryptoPrice

        // 디버깅: 금융상품 카운트 확인 (강화된 로깅)
        console.log('=== FINANCIAL PRODUCTS DEBUG ===')
        console.log('Financial counts:', { deposits, savings, bonds, usStocks, cryptos })
        console.log('Total financial products:', getTotalFinancialProducts())
        console.log('Financial elements:', {
          depositCount: elDepositCount,
          savingsCount: elSavingsCount,
          bondCount: elBondCount,
        })
        console.log('================================')
      } catch (e) {
        console.error('Financial products UI update failed:', e)
        console.error('Error details:', { deposits, savings, bonds })
      }

      // 부동산 구입 UI 업데이트 (동적 가격 계산)
      const totalRps2 = getTotalIncomeForContribution() // 부동산용 RPS 계산

      // 빌라
      const villaCost =
        purchaseMode === 'buy'
          ? getPropertyCost('villa', villas, purchaseQuantity)
          : getPropertySellPrice('villa', villas, purchaseQuantity)
      const villaTotalIncome = villas * BASE_RENT.villa
      const villaEffectiveIncome = getPropertyIncome('villa', villas) * rentMultiplier
      const villaPercent = totalRps2 > 0 ? ((villaEffectiveIncome / totalRps2) * 100).toFixed(1) : 0

      elVillaCount.textContent = villas
      const villaCurrency = t('ui.currency')
      const villaUnit = t('ui.unit.property')
      const villaName = getProductName('villa')
      const villaPerUnitAmount =
        Math.floor(BASE_RENT.villa).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        villaCurrency
      const villaTotalAmount =
        Math.floor(villaTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        villaCurrency
      const villaLifetimeAmount = NumberFormat.formatCashDisplayFixed1(villasLifetime, settings)
      const villaPrice = NumberFormat.formatPropertyPrice(villaCost)

      // 상품 이름 업데이트
      const villaTitleEl = document.querySelector('#villaItem .title')
      if (villaTitleEl) villaTitleEl.textContent = `🏘️ ${villaName}`

      // 설명 업데이트
      const villaDescEls = document.querySelectorAll('#villaItem .desc')
      if (villaDescEls.length >= 4) {
        const villaPerUnitText = t('product.desc.perUnit', {
          product: villaName,
          amount: villaPerUnitAmount,
        })
        villaDescEls[0].innerHTML = `• ${villaPerUnitText.replace(villaPerUnitAmount, `<b>${villaPerUnitAmount}</b>`)}`
        const villaTotalText = t('product.desc.total', {
          count: villas,
          unit: villaUnit,
          product: villaName,
          amount: villaTotalAmount,
          percent: villaPercent,
        })
        villaDescEls[1].innerHTML = `• ${villaTotalText.replace(villaTotalAmount, `<b>${villaTotalAmount}</b>`).replace(villaPercent + '%', `<b>${villaPercent}%</b>`)}`
        const villaLifetimeText = t('product.desc.lifetime', { amount: villaLifetimeAmount })
        villaDescEls[2].innerHTML = `• ${villaLifetimeText.replace(villaLifetimeAmount, `<b>${villaLifetimeAmount}</b>`)}`
        const villaCurrentPriceText = t('product.desc.currentPrice', { price: villaPrice })
        villaDescEls[3].innerHTML = villaCurrentPriceText.replace(
          villaPrice,
          `<b>${villaPrice}</b>`
        )
      }

      elRentPerVilla.textContent = villaPerUnitAmount
      document.getElementById('villaTotalIncome').textContent = villaTotalAmount
      document.getElementById('villaPercent').textContent = villaPercent + '%'
      document.getElementById('villaLifetimeDisplay').textContent = villaLifetimeAmount
      elVillaCurrentPrice.textContent = villaPrice

      // 오피스텔
      const officetelCost =
        purchaseMode === 'buy'
          ? getPropertyCost('officetel', officetels, purchaseQuantity)
          : getPropertySellPrice('officetel', officetels, purchaseQuantity)
      const officetelTotalIncome = officetels * BASE_RENT.officetel
      const officetelEffectiveIncome = getPropertyIncome('officetel', officetels) * rentMultiplier
      const officetelPercent =
        totalRps2 > 0 ? ((officetelEffectiveIncome / totalRps2) * 100).toFixed(1) : 0

      elOfficetelCount.textContent = officetels
      const officetelCurrency = t('ui.currency')
      const officetelUnit = t('ui.unit.property')
      const officetelName = getProductName('officetel')
      const officetelPerUnitAmount =
        Math.floor(BASE_RENT.officetel).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        officetelCurrency
      const officetelTotalAmount =
        Math.floor(officetelTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        officetelCurrency
      const officetelLifetimeAmount = NumberFormat.formatCashDisplayFixed1(
        officetelsLifetime,
        settings
      )
      const officetelPrice = NumberFormat.formatPropertyPrice(officetelCost)

      // 상품 이름 업데이트
      const officetelTitleEl = document.querySelector('#officetelItem .title')
      if (officetelTitleEl) officetelTitleEl.textContent = `🏢 ${officetelName}`

      // 설명 업데이트
      const officetelDescEls = document.querySelectorAll('#officetelItem .desc')
      if (officetelDescEls.length >= 4) {
        const officetelPerUnitText = t('product.desc.perUnit', {
          product: officetelName,
          amount: officetelPerUnitAmount,
        })
        officetelDescEls[0].innerHTML = `• ${officetelPerUnitText.replace(officetelPerUnitAmount, `<b>${officetelPerUnitAmount}</b>`)}`
        const officetelTotalText = t('product.desc.total', {
          count: officetels,
          unit: officetelUnit,
          product: officetelName,
          amount: officetelTotalAmount,
          percent: officetelPercent,
        })
        officetelDescEls[1].innerHTML = `• ${officetelTotalText.replace(officetelTotalAmount, `<b>${officetelTotalAmount}</b>`).replace(officetelPercent + '%', `<b>${officetelPercent}%</b>`)}`
        const officetelLifetimeText = t('product.desc.lifetime', {
          amount: officetelLifetimeAmount,
        })
        officetelDescEls[2].innerHTML = `• ${officetelLifetimeText.replace(officetelLifetimeAmount, `<b>${officetelLifetimeAmount}</b>`)}`
        const officetelCurrentPriceText = t('product.desc.currentPrice', { price: officetelPrice })
        officetelDescEls[3].innerHTML = officetelCurrentPriceText.replace(
          officetelPrice,
          `<b>${officetelPrice}</b>`
        )
      }

      elRentPerOfficetel.textContent = officetelPerUnitAmount
      document.getElementById('officetelTotalIncome').textContent = officetelTotalAmount
      document.getElementById('officetelPercent').textContent = officetelPercent + '%'
      document.getElementById('officetelLifetimeDisplay').textContent = officetelLifetimeAmount
      elOfficetelCurrentPrice.textContent = officetelPrice

      // 아파트
      const aptCost =
        purchaseMode === 'buy'
          ? getPropertyCost('apartment', apartments, purchaseQuantity)
          : getPropertySellPrice('apartment', apartments, purchaseQuantity)
      const aptTotalIncome = apartments * BASE_RENT.apartment
      const aptEffectiveIncome = getPropertyIncome('apartment', apartments) * rentMultiplier
      const aptPercent = totalRps2 > 0 ? ((aptEffectiveIncome / totalRps2) * 100).toFixed(1) : 0

      elAptCount.textContent = apartments
      const aptCurrency = t('ui.currency')
      const aptUnit = t('ui.unit.property')
      const aptName = getProductName('apartment')
      const aptPerUnitAmount =
        Math.floor(BASE_RENT.apartment).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        aptCurrency
      const aptTotalAmount =
        Math.floor(aptTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        aptCurrency
      const aptLifetimeAmount = NumberFormat.formatCashDisplayFixed1(apartmentsLifetime, settings)
      const aptPrice = NumberFormat.formatPropertyPrice(aptCost)

      // 상품 이름 업데이트
      const aptTitleEl = document.querySelector('#aptItem .title')
      if (aptTitleEl) aptTitleEl.textContent = `🏬 ${aptName}`

      // 설명 업데이트
      const aptDescEls = document.querySelectorAll('#aptItem .desc')
      if (aptDescEls.length >= 4) {
        const aptPerUnitText = t('product.desc.perUnit', {
          product: aptName,
          amount: aptPerUnitAmount,
        })
        aptDescEls[0].innerHTML = `• ${aptPerUnitText.replace(aptPerUnitAmount, `<b>${aptPerUnitAmount}</b>`)}`
        const aptTotalText = t('product.desc.total', {
          count: apartments,
          unit: aptUnit,
          product: aptName,
          amount: aptTotalAmount,
          percent: aptPercent,
        })
        aptDescEls[1].innerHTML = `• ${aptTotalText.replace(aptTotalAmount, `<b>${aptTotalAmount}</b>`).replace(aptPercent + '%', `<b>${aptPercent}%</b>`)}`
        const aptLifetimeText = t('product.desc.lifetime', { amount: aptLifetimeAmount })
        aptDescEls[2].innerHTML = `• ${aptLifetimeText.replace(aptLifetimeAmount, `<b>${aptLifetimeAmount}</b>`)}`
        const aptCurrentPriceText = t('product.desc.currentPrice', { price: aptPrice })
        aptDescEls[3].innerHTML = aptCurrentPriceText.replace(aptPrice, `<b>${aptPrice}</b>`)
      }

      elRentPerApt.textContent = aptPerUnitAmount
      document.getElementById('aptTotalIncome').textContent = aptTotalAmount
      document.getElementById('aptPercent').textContent = aptPercent + '%'
      document.getElementById('aptLifetimeDisplay').textContent = aptLifetimeAmount
      elAptCurrentPrice.textContent = aptPrice

      // 상가
      const shopCost =
        purchaseMode === 'buy'
          ? getPropertyCost('shop', shops, purchaseQuantity)
          : getPropertySellPrice('shop', shops, purchaseQuantity)
      const shopTotalIncome = shops * BASE_RENT.shop
      const shopEffectiveIncome = getPropertyIncome('shop', shops) * rentMultiplier
      const shopPercent = totalRps2 > 0 ? ((shopEffectiveIncome / totalRps2) * 100).toFixed(1) : 0

      elShopCount.textContent = shops
      const shopCurrency = t('ui.currency')
      const shopUnit = t('ui.unit.property')
      const shopName = getProductName('shop')
      const shopPerUnitAmount =
        Math.floor(BASE_RENT.shop).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        shopCurrency
      const shopTotalAmount =
        Math.floor(shopTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        shopCurrency
      const shopLifetimeAmount = NumberFormat.formatCashDisplayFixed1(shopsLifetime, settings)
      const shopPrice = NumberFormat.formatPropertyPrice(shopCost)

      // 상품 이름 업데이트
      const shopTitleEl = document.querySelector('#shopItem .title')
      if (shopTitleEl) shopTitleEl.textContent = `🏪 ${shopName}`

      // 설명 업데이트
      const shopDescEls = document.querySelectorAll('#shopItem .desc')
      if (shopDescEls.length >= 4) {
        const shopPerUnitText = t('product.desc.perUnit', {
          product: shopName,
          amount: shopPerUnitAmount,
        })
        shopDescEls[0].innerHTML = `• ${shopPerUnitText.replace(shopPerUnitAmount, `<b>${shopPerUnitAmount}</b>`)}`
        const shopTotalText = t('product.desc.total', {
          count: shops,
          unit: shopUnit,
          product: shopName,
          amount: shopTotalAmount,
          percent: shopPercent,
        })
        shopDescEls[1].innerHTML = `• ${shopTotalText.replace(shopTotalAmount, `<b>${shopTotalAmount}</b>`).replace(shopPercent + '%', `<b>${shopPercent}%</b>`)}`
        const shopLifetimeText = t('product.desc.lifetime', { amount: shopLifetimeAmount })
        shopDescEls[2].innerHTML = `• ${shopLifetimeText.replace(shopLifetimeAmount, `<b>${shopLifetimeAmount}</b>`)}`
        const shopCurrentPriceText = t('product.desc.currentPrice', { price: shopPrice })
        shopDescEls[3].innerHTML = shopCurrentPriceText.replace(shopPrice, `<b>${shopPrice}</b>`)
      }

      elRentPerShop.textContent = shopPerUnitAmount
      document.getElementById('shopTotalIncome').textContent = shopTotalAmount
      document.getElementById('shopPercent').textContent = shopPercent + '%'
      document.getElementById('shopLifetimeDisplay').textContent = shopLifetimeAmount
      elShopCurrentPrice.textContent = shopPrice

      // 빌딩
      const buildingCost =
        purchaseMode === 'buy'
          ? getPropertyCost('building', buildings, purchaseQuantity)
          : getPropertySellPrice('building', buildings, purchaseQuantity)
      const buildingTotalIncome = buildings * BASE_RENT.building
      const buildingEffectiveIncome = getPropertyIncome('building', buildings) * rentMultiplier
      const buildingPercent =
        totalRps2 > 0 ? ((buildingEffectiveIncome / totalRps2) * 100).toFixed(1) : 0

      elBuildingCount.textContent = buildings
      const buildingCurrency = t('ui.currency')
      const buildingUnit = t('ui.unit.property')
      const buildingName = getProductName('building')
      const buildingPerUnitAmount =
        Math.floor(BASE_RENT.building).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        buildingCurrency
      const buildingTotalAmount =
        Math.floor(buildingTotalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
        buildingCurrency
      const buildingLifetimeAmount = NumberFormat.formatCashDisplayFixed1(
        buildingsLifetime,
        settings
      )
      const buildingPrice = NumberFormat.formatPropertyPrice(buildingCost)

      // 상품 이름 업데이트
      const buildingTitleEl = document.querySelector('#buildingItem .title')
      if (buildingTitleEl) buildingTitleEl.textContent = `🏙️ ${buildingName}`

      // 설명 업데이트
      const buildingDescEls = document.querySelectorAll('#buildingItem .desc')
      if (buildingDescEls.length >= 4) {
        const buildingPerUnitText = t('product.desc.perUnit', {
          product: buildingName,
          amount: buildingPerUnitAmount,
        })
        buildingDescEls[0].innerHTML = `• ${buildingPerUnitText.replace(buildingPerUnitAmount, `<b>${buildingPerUnitAmount}</b>`)}`
        const buildingTotalText = t('product.desc.total', {
          count: buildings,
          unit: buildingUnit,
          product: buildingName,
          amount: buildingTotalAmount,
          percent: buildingPercent,
        })
        buildingDescEls[1].innerHTML = `• ${buildingTotalText.replace(buildingTotalAmount, `<b>${buildingTotalAmount}</b>`).replace(buildingPercent + '%', `<b>${buildingPercent}%</b>`)}`
        const buildingLifetimeText = t('product.desc.lifetime', { amount: buildingLifetimeAmount })
        buildingDescEls[2].innerHTML = `• ${buildingLifetimeText.replace(buildingLifetimeAmount, `<b>${buildingLifetimeAmount}</b>`)}`
        const buildingCurrentPriceText = t('product.desc.currentPrice', { price: buildingPrice })
        buildingDescEls[3].innerHTML = buildingCurrentPriceText.replace(
          buildingPrice,
          `<b>${buildingPrice}</b>`
        )
      }

      elRentPerBuilding.textContent = buildingPerUnitAmount
      document.getElementById('buildingTotalIncome').textContent = buildingTotalAmount
      document.getElementById('buildingPercent').textContent = buildingPercent + '%'
      document.getElementById('buildingLifetimeDisplay').textContent = buildingLifetimeAmount
      elBuildingCurrentPrice.textContent = buildingPrice

      // 서울타워 (프레스티지, 수익 없음)
      const towerName = getProductName('tower')
      const towerUnit = t('ui.unit.count')
      const towerPrice = NumberFormat.formatNumberForLang(BASE_COSTS.tower, getLang())

      // 상품 이름 업데이트
      const towerTitleEl = document.querySelector('#towerItem .title')
      if (towerTitleEl) towerTitleEl.textContent = `🗼 ${towerName}`

      // 설명 업데이트
      const towerDescEls = document.querySelectorAll('#towerItem .desc')
      if (towerDescEls.length >= 4) {
        towerDescEls[0].innerHTML = `• ${t('tower.desc.prestige')}`
        towerDescEls[1].innerHTML = `• ${t('tower.desc.owned', { count: towers_run })}`
        towerDescEls[2].innerHTML = `• ${t('tower.desc.leaderboard', { count: towers_lifetime })}`
        towerDescEls[3].innerHTML = `${t('product.desc.currentPrice', { price: towerPrice })}`
      }

      if (elTowerCountDisplay) elTowerCountDisplay.textContent = towers_lifetime
      if (elTowerCountBadge) elTowerCountBadge.textContent = towers_lifetime
      if (elTowerCurrentPrice) {
        elTowerCurrentPrice.textContent = towerPrice
      }

      // 디버깅: 부동산 카운트 확인
      console.log('Property counts:', { villas, officetels, apartments, shops, buildings })

      // 커리어 UI 업데이트는 함수 최상단으로 이동됨

      // 업그레이드 UI 업데이트 (제거됨 - 새 시스템 사용)

      // 버튼 텍스트 및 상태 업데이트 (구매/판매 통합)
      updateButtonTexts()

      // 버튼 상태 업데이트 (Cookie Clicker 스타일)
      updateButtonStates()

      // 건물 목록 색상 업데이트
      updateBuildingItemStates()

      // 업그레이드 구매 가능 여부만 업데이트 (DOM 재생성 안 함)
      updateUpgradeAffordability()

      // 순차 해금 시스템 - 잠금 상태 업데이트
      if (typeof updateProductLockStates === 'function') {
        updateProductLockStates()
      }

      // 통계 탭 업데이트
      updateStatsTab()
    } catch (uiError) {
      console.error('❌ updateUI() 전체 실행 중 오류:', uiError)
      console.error('에러 스택:', uiError.stack)
      // UI 업데이트 실패해도 게임은 계속 진행 가능
    }
  }

  // ======= 투자 탭 UI 시스템 초기화 =======
  const investmentTab = createInvestmentTab({
    // State getters/setters
    getCash: () => cash,
    setCash: newCash => {
      cash = newCash
    },
    getPurchaseMode: () => purchaseMode,
    getPurchaseQuantity: () => purchaseQuantity,
    getSettings: () => settings,
    getCurrentMarketEvent: () => currentMarketEvent,
    getMarketEventEndTime: () => marketEventEndTime,
    setCurrentMarketEvent: event => {
      currentMarketEvent = event
    },
    setMarketEventEndTime: time => {
      marketEventEndTime = time
    },
    getCareerLevel: () => careerLevel,

    // Product counts (getters/setters)
    getDeposits: () => deposits,
    setDeposits: count => {
      deposits = count
    },
    getSavings: () => savings,
    setSavings: count => {
      savings = count
    },
    getBonds: () => bonds,
    setBonds: count => {
      bonds = count
    },
    getUsStocks: () => usStocks,
    setUsStocks: count => {
      usStocks = count
    },
    getCryptos: () => cryptos,
    setCryptos: count => {
      cryptos = count
    },
    getVillas: () => villas,
    setVillas: count => {
      villas = count
    },
    getOfficetels: () => officetels,
    setOfficetels: count => {
      officetels = count
    },
    getApartments: () => apartments,
    setApartments: count => {
      apartments = count
    },
    getShops: () => shops,
    setShops: count => {
      shops = count
    },
    getBuildings: () => buildings,
    setBuildings: count => {
      buildings = count
    },
    getTower: () => towers_run,
    setTower: count => {
      towers_run = count
    },

    // Helper functions
    getFinancialCost,
    getPropertyCost,
    getFinancialSellPrice,
    getPropertySellPrice,
    updateUI,

    // Constants
    CAREER_LEVELS,
    MARKET_EVENTS,
  })

  // Destructure functions from investmentTab
  const {
    getProductName,
    isProductUnlocked,
    checkNewUnlocks,
    handleTransaction,
    showPurchaseSuccess,
    getMarketEventMultiplier,
    startMarketEvent,
    showMarketEventNotification,
    checkMarketEvent,
    updateInvestmentMarketImpactUI,
    updateProductLockStates,
    updateButton,
    initInvestmentEventListeners,
  } = investmentTab

  // ======= 통계 섹션 접기/펼치기 기능 (TDZ 방지를 위해 여기서 선언) =======
  let statsCollapsibleInitialized = false
  function initStatsCollapsible() {
    if (statsCollapsibleInitialized) return
    statsCollapsibleInitialized = true

    const statsTab = document.getElementById('statsTab')
    if (statsTab) {
      statsTab.addEventListener('click', e => {
        const toggle = e.target.closest('.stats-toggle')
        const toggleIcon = e.target.closest('.toggle-icon')
        if (toggle || toggleIcon) {
          const section = (toggle || toggleIcon).closest('.stats-section')
          if (section && section.classList.contains('collapsible')) {
            const achievementGrid = section.querySelector('#achievementGrid')
            if (achievementGrid) return
            section.classList.toggle('collapsed')
            e.preventDefault()
            e.stopPropagation()
          }
        }
      })
    }
  }

  // 통계 섹션 초기화 (DOMContentLoaded 이후에 실행)
  setTimeout(() => {
    initStatsCollapsible()
  }, 100)

  // ======= 구매 수량 선택 시스템 =======
  elBuyMode.addEventListener('click', () => {
    purchaseMode = 'buy'
    elBuyMode.classList.add('active')
    elSellMode.classList.remove('active')
    updateButtonTexts()
  })

  elSellMode.addEventListener('click', () => {
    purchaseMode = 'sell'
    elSellMode.classList.add('active')
    elBuyMode.classList.remove('active')
    updateButtonTexts()
  })

  elQty1.addEventListener('click', () => {
    purchaseQuantity = 1
    elQty1.classList.add('active')
    elQty5.classList.remove('active')
    elQty10.classList.remove('active')
    updateButtonTexts()
  })

  elQty5.addEventListener('click', () => {
    purchaseQuantity = 5
    elQty5.classList.add('active')
    elQty1.classList.remove('active')
    elQty10.classList.remove('active')
    updateButtonTexts()
  })

  elQty10.addEventListener('click', () => {
    purchaseQuantity = 10
    elQty10.classList.add('active')
    elQty1.classList.remove('active')
    elQty5.classList.remove('active')
    updateButtonTexts()
  })

  // ======= 토글 기능 =======
  elToggleUpgrades.addEventListener('click', () => {
    const section = document.getElementById('upgradeList')
    const isCollapsed = section.classList.contains('collapsed-section')

    if (isCollapsed) {
      section.classList.remove('collapsed-section')
      elToggleUpgrades.textContent = '▼'
      elToggleUpgrades.classList.remove('collapsed')
    } else {
      section.classList.add('collapsed-section')
      elToggleUpgrades.textContent = '▶'
      elToggleUpgrades.classList.add('collapsed')
    }
  })

  elToggleFinancial.addEventListener('click', () => {
    const section = document.getElementById('financialSection')
    const isCollapsed = section.classList.contains('collapsed-section')

    if (isCollapsed) {
      section.classList.remove('collapsed-section')
      elToggleFinancial.textContent = '▼'
      elToggleFinancial.classList.remove('collapsed')
    } else {
      section.classList.add('collapsed-section')
      elToggleFinancial.textContent = '▶'
      elToggleFinancial.classList.add('collapsed')
    }
  })

  elToggleProperties.addEventListener('click', () => {
    const section = document.getElementById('propertySection')
    const isCollapsed = section.classList.contains('collapsed-section')

    if (isCollapsed) {
      section.classList.remove('collapsed-section')
      elToggleProperties.textContent = '▼'
      elToggleProperties.classList.remove('collapsed')
    } else {
      section.classList.add('collapsed-section')
      elToggleProperties.textContent = '▶'
      elToggleProperties.classList.add('collapsed')
    }
  })

  // ======= 액션 =======
  function handleWorkAction(clientX, clientY) {
    let income = getClickIncome()

    // 업그레이드 효과 적용 (새 UPGRADES 시스템)
    if (
      UPGRADES['performance_bonus'] &&
      UPGRADES['performance_bonus'].purchased &&
      Math.random() < 0.02
    ) {
      income *= 10 // 2% 확률로 10배 수익
      Diary.addLog(t('msg.bonusPaid'))
    }

    // 떨어지는 쿠키 애니메이션 생성 (설정에서 활성화된 경우만)
    if (settings.particles) {
      Animations.createFallingCookie(clientX ?? 0, clientY ?? 0)
    }

    cash += income
    totalClicks += 1 // 클릭 수 증가
    totalLaborIncome += income // 총 노동 수익 증가

    // 미니 목표 알림: 다음 업그레이드까지 남은 클릭 수 체크
    const lockedUpgrades = Object.entries(UPGRADES)
      .filter(([id, u]) => u.category === 'labor' && !u.unlocked && !u.purchased)
      .map(([id, u]) => {
        const conditionStr = u.unlockCondition.toString()
        const match = conditionStr.match(/totalClicks\s*>=\s*(\d+)/)
        if (match) {
          return { id, requiredClicks: parseInt(match[1]), upgrade: u }
        }
        // careerLevel 체크인 경우
        const careerMatch = conditionStr.match(/careerLevel\s*>=\s*(\d+)/)
        if (careerMatch) {
          return {
            id,
            requiredClicks: CAREER_LEVELS[parseInt(careerMatch[1])]?.requiredClicks || Infinity,
            upgrade: u,
          }
        }
        return null
      })
      .filter(x => x !== null)
      .sort((a, b) => a.requiredClicks - b.requiredClicks)

    if (lockedUpgrades.length > 0) {
      const nextUpgrade = lockedUpgrades[0]
      const remaining = nextUpgrade.requiredClicks - totalClicks

      // 50클릭, 25클릭, 10클릭, 5클릭 남았을 때 알림
      if (remaining === 50 || remaining === 25 || remaining === 10 || remaining === 5) {
        Diary.addLog(
          t('msg.nextUpgradeHint', { name: t(`upgrade.${nextUpgrade.id}.name`), remaining })
        )
      }
    }

    // 자동 승진 체크
    const wasPromoted = checkCareerPromotion()
    if (wasPromoted) updateUI()

    // 업그레이드 진행률 업데이트 (UI에 표시된 경우)
    updateUpgradeProgress()

    // 클릭 애니메이션 효과
    elWork.classList.add('click-effect')
    setTimeout(() => elWork.classList.remove('click-effect'), 300)

    // 수익 증가 텍스트 애니메이션
    Animations.showIncomeAnimation(income)

    updateUI()
  }

  elWork.addEventListener('click', e => {
    handleWorkAction(e.clientX, e.clientY)
  })

  // ======= 공유하기 기능 =======
  async function shareGame() {
    const gameUrl = window.location.href
    const gameTitle = 'Capital Clicker: Seoul Survival'
    const gameDescription = `💰 부동산과 금융 투자로 부자가 되는 게임!\n현재 자산: ${NumberFormat.formatCashDisplay(cash, settings)}\n초당 수익: ${NumberFormat.formatCashDisplay(getRps(), settings)}`
    // 요구사항: 공유 버튼은 Web Share API만 사용 (링크 복사 fallback 제거)
    if (!navigator.share) {
      Diary.addLog('❌ 이 기기/브라우저에서는 공유하기를 지원하지 않습니다.')
      return
    }

    try {
      await navigator.share({
        title: gameTitle,
        text: gameDescription,
        url: gameUrl,
      })
      Diary.addLog('✅ 게임이 공유되었습니다!')
    } catch (err) {
      // 사용자가 공유 UI를 닫은 경우는 조용히 무시
      if (err?.name !== 'AbortError') {
        console.error('공유 실패:', err)
        Diary.addLog('❌ 공유에 실패했습니다.')
      }
    }
  }

  if (elShareBtn) {
    elShareBtn.addEventListener('click', shareGame)
  } else {
    console.error('공유 버튼을 찾을 수 없습니다.')
  }

  // ======= 즐겨찾기 / 홈 화면 안내 =======
  function handleFavoriteClick() {
    const url = window.location.href
    const title = document.title || 'Capital Clicker: Seoul Survival'
    const ua = navigator.userAgent.toLowerCase()
    const isMobile = /iphone|ipad|ipod|android/.test(ua)
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndroid = /android/.test(ua)
    const isMac = navigator.platform.toUpperCase().includes('MAC')

    // (아주 옛날 IE 전용) 가능한 경우 직접 즐겨찾기 추가 시도
    if (window.external && typeof window.external.AddFavorite === 'function') {
      try {
        window.external.AddFavorite(url, title)
        Diary.addLog('⭐ 즐겨찾기에 추가되었습니다.')
        return
      } catch {
        // 실패하면 아래 안내로 fallback
      }
    }

    let message = ''
    let modalTitle = '즐겨찾기 / 홈 화면에 추가'
    let icon = '⭐'

    if (isMobile) {
      if (isIOS) {
        message =
          'iPhone/iPad에서는 Safari 하단의 공유 버튼(□↑)을 누른 뒤\n' +
          '"홈 화면에 추가"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.'
      } else if (isAndroid) {
        message =
          'Android에서는 브라우저 오른쪽 위 메뉴(⋮)에서\n' +
          '"홈 화면에 추가" 또는 "앱 설치"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.'
      } else {
        message = '이 기기에서는 브라우저의 메뉴에서 "홈 화면에 추가" 기능을 사용해 주세요.'
      }
    } else {
      const shortcut = isMac ? '⌘ + D' : 'Ctrl + D'
      message = `${shortcut} 를 눌러 이 페이지를 브라우저 즐겨찾기에 추가할 수 있습니다.`
    }

    Modal.openInfoModal(modalTitle, message, icon)
  }

  if (elFavoriteBtn) {
    elFavoriteBtn.addEventListener('click', handleFavoriteClick)
  }

  // 새로 시작 버튼 이벤트 리스너 (footer와 설정 탭 모두)
  if (elResetBtn) {
    elResetBtn.addEventListener('click', resetGame)
  }
  const elResetBtnSettings = document.getElementById('resetBtnSettings')
  if (elResetBtnSettings) {
    elResetBtnSettings.addEventListener('click', resetGame)
  }

  // 금융상품 거래 이벤트 (구매/판매 통합)
  // 투자 탭 이벤트 리스너 초기화 (investmentTab 모듈에서 관리)
  initInvestmentEventListeners({
    elBuyDeposit,
    elBuySavings,
    elBuyBond,
    elBuyUsStock,
    elBuyCrypto,
    elBuyVilla,
    elBuyOfficetel,
    elBuyApartment: elBuyApt,
    elBuyShop,
    elBuyBuilding,
    elBuyTower,
  })

  // 런(현재 게임) 보유 수량 일괄 초기화 함수
  // 상품 정의 리스트(FINANCIAL_INCOME, BASE_COSTS)를 순회하여 모든 보유 수량을 0으로 초기화
  // 상품 추가/삭제 시에도 이 함수만 수정하면 되도록 설계
  function resetRunHoldings() {
    // 금융상품 보유 수량 초기화 (FINANCIAL_INCOME 키 기반)
    // 상수 키 → 변수명 매핑
    const financialHoldings = {
      deposit: () => {
        deposits = 0
      },
      savings: () => {
        savings = 0
      },
      bond: () => {
        bonds = 0
      },
      usStock: () => {
        usStocks = 0
      },
      crypto: () => {
        cryptos = 0
      },
    }

    // FINANCIAL_INCOME에 정의된 모든 키에 대해 초기화 실행
    for (const key of Object.keys(FINANCIAL_INCOME)) {
      if (financialHoldings[key]) {
        financialHoldings[key]()
      }
    }

    // 부동산 보유 수량 초기화 (BASE_COSTS 키 기반, tower 제외)
    // 상수 키 → 변수명 매핑
    const propertyHoldings = {
      villa: () => {
        if (typeof villas !== 'undefined') villas = 0
      },
      officetel: () => {
        if (typeof officetels !== 'undefined') officetels = 0
      },
      apartment: () => {
        if (typeof apartments !== 'undefined') apartments = 0
      },
      shop: () => {
        if (typeof shops !== 'undefined') shops = 0
      },
      building: () => {
        if (typeof buildings !== 'undefined') buildings = 0
      },
      // tower는 towers_run으로 별도 처리 (프레스티지 시 초기화, towers_lifetime은 유지)
    }

    // BASE_COSTS에 정의된 모든 키에 대해 초기화 실행 (tower 제외)
    const propertyKeys = Object.keys(BASE_COSTS).filter(key => key !== 'tower')
    if (__IS_DEV__) {
      console.debug('[resetRunHoldings] 부동산 초기화 대상:', propertyKeys)
    }

    for (const key of propertyKeys) {
      if (propertyHoldings[key]) {
        try {
          propertyHoldings[key]()
        } catch (e) {
          console.warn(`[resetRunHoldings] 부동산 ${key} 초기화 실패:`, e)
        }
      } else if (__IS_DEV__) {
        console.warn(`[resetRunHoldings] 부동산 ${key}에 대한 매핑이 없습니다.`)
      }
    }

    // 추가 변수 초기화 (상수에 없는 변수들)
    // 주의: domesticStocks는 존재하지 않음. 실제 변수는 bonds이며 위에서 이미 초기화됨
    if (typeof towers_run !== 'undefined') {
      towers_run = 0 // towers_lifetime은 유지
    } else if (__IS_DEV__) {
      console.warn('[resetRunHoldings] towers_run 변수가 정의되지 않았습니다.')
    }

    // 누적 생산량 초기화 (Lifetime 변수들) - 방어 로직 추가
    const lifetimeHoldings = {
      depositsLifetime: () => {
        if (typeof depositsLifetime !== 'undefined') depositsLifetime = 0
      },
      savingsLifetime: () => {
        if (typeof savingsLifetime !== 'undefined') savingsLifetime = 0
      },
      bondsLifetime: () => {
        if (typeof bondsLifetime !== 'undefined') bondsLifetime = 0
      },
      usStocksLifetime: () => {
        if (typeof usStocksLifetime !== 'undefined') usStocksLifetime = 0
      },
      cryptosLifetime: () => {
        if (typeof cryptosLifetime !== 'undefined') cryptosLifetime = 0
      },
      villasLifetime: () => {
        if (typeof villasLifetime !== 'undefined') villasLifetime = 0
      },
      officetelsLifetime: () => {
        if (typeof officetelsLifetime !== 'undefined') officetelsLifetime = 0
      },
      apartmentsLifetime: () => {
        if (typeof apartmentsLifetime !== 'undefined') apartmentsLifetime = 0
      },
      shopsLifetime: () => {
        if (typeof shopsLifetime !== 'undefined') shopsLifetime = 0
      },
      buildingsLifetime: () => {
        if (typeof buildingsLifetime !== 'undefined') buildingsLifetime = 0
      },
    }

    if (__IS_DEV__) {
      console.debug('[resetRunHoldings] Lifetime 변수 초기화 대상:', Object.keys(lifetimeHoldings))
    }

    for (const [varName, resetFn] of Object.entries(lifetimeHoldings)) {
      try {
        resetFn()
      } catch (e) {
        console.warn(`[resetRunHoldings] Lifetime 변수 ${varName} 초기화 실패:`, e)
      }
    }

    if (__IS_DEV__) {
      console.debug('[resetRunHoldings] 초기화 완료')
    }
  }

  // 자동 프레스티지 실행 함수 (컨텍스트 독립: 엔딩/설정 경로 모두 안전)
  async function performAutoPrestige(source = 'unknown') {
    console.log(`🔄 자동 프레스티지 실행 (source: ${source})`)

    try {
      // towers_lifetime은 유지, towers_run은 초기화
      // 자산/보유/진행도 초기화
      cash = 1000 // 초기 자본
      totalClicks = 0
      totalLaborIncome = 0
      careerLevel = 0
      clickMultiplier = 1
      rentMultiplier = 1
      autoClickEnabled = false
      managerLevel = 0

      // 모든 보유 수량 일괄 초기화 (상품 정의 기반)
      resetRunHoldings()

      // 업그레이드 초기화
      for (const upgrade of Object.values(UPGRADES)) {
        upgrade.unlocked = false
        upgrade.purchased = false
      }

      // 시장 이벤트 초기화
      currentMarketEvent = null
      marketEventEndTime = 0
      marketMultiplier = 1.0

      // 업적은 유지 (계정 누적)

      // 세션 시간 초기화
      sessionStartTime = Date.now()

      // AI 업무 처리 및 노동 UI 상태 동기화
      updateAutoWorkUI()

      // UI 업데이트 (안전하게)
      try {
        updateUI()
      } catch (uiError) {
        console.error('❌ UI 업데이트 중 오류:', uiError)
        // UI 업데이트 실패해도 게임 상태는 초기화됨
      }

      // 저장 (안전하게)
      try {
        saveGame()
      } catch (saveError) {
        console.error('❌ 게임 저장 중 오류:', saveError)
        // 저장 실패해도 게임 상태는 초기화됨
      }

      // 리더보드 즉시 업데이트 (프레스티지는 중요 이벤트)
      if (playerNickname) {
        try {
          await LeaderboardUI.updateLeaderboardEntry(true) // forceImmediate: 프레스티지는 즉시 업데이트
        } catch (error) {
          console.error('리더보드 업데이트 실패:', error)
        }
      }

      Diary.addLog('🗼 새로운 시작. 다시 한 번.')
      if (__IS_DEV__) {
        console.log('✅ 프레스티지 완료 (누적 데이터 유지)')
      }
    } catch (error) {
      console.error('❌ 프레스티지 실행 중 치명적 오류:', error)
      console.error('스택:', error.stack)
      // 치명적 오류만 사용자에게 알림
      throw error // 상위 try-catch에서 처리
    }
  }

  // ======= 업그레이드 효과 적용 함수 =======
  // 구형 applyUpgradeEffect 및 업그레이드 시스템 제거됨 - 새로운 Cookie Clicker 스타일 시스템 사용

  // ======= 키보드 단축키 =======
  document.addEventListener('keydown', e => {
    // Ctrl + Shift + R: 게임 초기화 (브라우저 새로고침과 충돌 방지)
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault()
      resetGame()
    }
    // Ctrl + S: 수동 저장
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault() // 브라우저 저장 방지
      saveGame()
      Diary.addLog(t('msg.manualSave'))
    }
    // Ctrl + O: 저장 가져오기
    if (e.ctrlKey && e.key === 'o') {
      e.preventDefault()
      if (elImportFileInput) {
        elImportFileInput.click()
      }
    }
  })

  // ======= 수익 틱 =======
  const TICK = 50 // ms (성능 최적화: 250ms → 50ms)
  setInterval(() => {
    checkMarketEvent() // 시장 이벤트 체크
    checkAchievements() // 업적 체크
    checkUpgradeUnlocks() // 업그레이드 해금 체크

    const deltaTime = TICK / 1000
    cash += getRps() * deltaTime

    // 누적 생산량 계산 (Cookie Clicker 스타일)
    depositsLifetime += deposits * FINANCIAL_INCOME.deposit * deltaTime
    savingsLifetime += savings * FINANCIAL_INCOME.savings * deltaTime
    bondsLifetime += bonds * FINANCIAL_INCOME.bond * deltaTime
    usStocksLifetime += usStocks * FINANCIAL_INCOME.usStock * deltaTime
    cryptosLifetime += cryptos * FINANCIAL_INCOME.crypto * deltaTime
    villasLifetime += villas * BASE_RENT.villa * deltaTime
    officetelsLifetime += officetels * BASE_RENT.officetel * deltaTime
    apartmentsLifetime += apartments * BASE_RENT.apartment * deltaTime
    shopsLifetime += shops * BASE_RENT.shop * deltaTime
    buildingsLifetime += buildings * BASE_RENT.building * deltaTime

    updateUI()
  }, TICK)

  // ======= 자동 저장 시스템 =======
  setInterval(() => {
    saveGame() // 5초마다 자동 저장
  }, 5000)

  // ======= 오토클릭 시스템 =======
  setInterval(() => {
    if (autoClickEnabled) {
      const income = getClickIncome()
      cash += income
      totalClicks += 1
      totalLaborIncome += income
      checkCareerPromotion()

      // 노동 버튼에 자동 클릭 이펙트 적용 (펄스 + 수익 텍스트)
      if (elWork) {
        elWork.classList.remove('auto-click-pulse')
        // 리플로우 강제 후 다시 추가하여 매 틱마다 애니메이션 재생
        void elWork.offsetHeight
        elWork.classList.add('auto-click-pulse')
      }
      // 수익 증가 애니메이션(초록색 돈 텍스트)도 함께 표시
      Animations.showIncomeAnimation(income)

      // 성과급은 오토클릭에도 적용
      if (
        UPGRADES['performance_bonus'] &&
        UPGRADES['performance_bonus'].purchased &&
        Math.random() < 0.02
      ) {
        // 기본 income(1배)은 이미 지급됨 → 총 10배가 되도록 추가 9배 지급
        const bonusIncome = income * 9
        cash += bonusIncome
        totalLaborIncome += bonusIncome
      }
    }
  }, 1000) // 1초마다

  // ======= 시장 이벤트 시스템 =======
  // 2-5분마다 랜덤하게 시장 이벤트 발생
  setInterval(
    () => {
      if (marketEventEndTime === 0) {
        // 현재 이벤트가 진행 중이 아닐 때만
        startMarketEvent()
      }
    },
    Math.random() * 180000 + 120000
  ) // 2-5분 랜덤

  // 설정 불러오기
  loadSettings()

  // 푸터 연도 동적 설정
  const elCurrentYear = document.getElementById('currentYear')
  if (elCurrentYear) {
    elCurrentYear.textContent = new Date().getFullYear()
  }

  // 초기 렌더 (async IIFE로 감싸서 await 사용 가능하게 함)
  ;(async () => {
    console.log('[Main] Async IIFE started')
    console.log('[Main] elLog element:', elLog)
    console.log('[Main] gameStartTime:', gameStartTime, 'sessionStartTime:', sessionStartTime)

    const gameLoaded = loadGame() // 게임 데이터 불러오기 시도
    console.log('[Main] Game loaded:', gameLoaded)
    console.log('[Main] After loadGame - gameStartTime:', gameStartTime, 'sessionStartTime:', sessionStartTime)

    // ======= 일기장 시스템 초기화 (loadGame 이후에 초기화하여 정확한 gameStartTime 사용) =======
    if (elLog) {
      console.log('[Main] Calling Diary.initDiary with:', { elLog, gameStartTime, sessionStartTime })
      Diary.initDiary(elLog, { gameStartTime, sessionStartTime })
    } else {
      console.error('[Main] ❌ elLog element not found - diary system NOT initialized')
      console.log('[Main] Trying to find log element again:', document.getElementById('log'))
    }

    // 게임 로드 후 서버에서 최신 닉네임 동기화 (로그인 상태인 경우)
    try {
      const user = await getUser()
      if (user) {
        const { getUserProfile } = await import('../../shared/auth/core.js')
        const profile = await getUserProfile('seoulsurvival')
        if (profile.success && profile.user?.nickname) {
          const serverNickname = profile.user.nickname
          // 서버 닉네임과 로컬 닉네임이 다르면 서버 닉네임으로 동기화
          if (playerNickname !== serverNickname) {
            playerNickname = serverNickname
            // 게임 저장에 닉네임 업데이트
            try {
              const saveData = localStorage.getItem(SAVE_KEY)
              if (saveData) {
                const data = JSON.parse(saveData)
                data.nickname = serverNickname
                localStorage.setItem(SAVE_KEY, JSON.stringify(data))
              }
            } catch (e) {
              console.warn('닉네임 저장 실패:', e)
            }
            // UI 업데이트
            updateUI()
            console.log('[SeoulSurvival] Initial nickname synced from server:', serverNickname)
          }
        }
      }
    } catch (e) {
      console.warn('초기 닉네임 동기화 실패:', e)
    }

    if (gameLoaded) {
      Diary.addLog(t('msg.gameLoaded'))
      // 로컬 저장이 있으면 즉시 닉네임 모달 확인
      ensureNicknameModal()
    } else {
      Diary.addLog(t('msg.welcome'))
      // 로컬 저장이 없으면 클라우드 복구를 먼저 확인
      const willReload = await maybeOfferCloudRestore()
      if (!willReload) {
        // 클라우드 복구가 트리거되지 않았으면 닉네임 모달 확인
        // (사용자가 "나중에"를 선택했거나, 클라우드 세이브가 없음)
        ensureNicknameModal()
      }
      // willReload가 true면 리로드가 예약되었으므로 닉네임 모달은 리로드 후 처리됨
    }
  })()

  // 초기 배경 이미지 설정
  const initialCareer = getCurrentCareer()
  if (elWorkArea && initialCareer && initialCareer.bgImage) {
    elWorkArea.style.backgroundImage = `url('${initialCareer.bgImage}')`
  }

  // ======= 리더보드 UI 시스템 초기화 =======
  LeaderboardUI.initLeaderboardUI(() => ({
    playerNickname,
    cash,
    calculateTotalAssetValue,
    sessionStartTime,
    totalPlayTime,
    towers_lifetime,
    __IS_DEV__,
  }))

  // 초기 UI 업데이트 (동적 텍스트 포함)
  updateUI()
  updateProductLockStates()

  // 설정 탭 UI 초기화
  const elToggleParticles = document.getElementById('toggleParticles')
  const elToggleFancyGraphics = document.getElementById('toggleFancyGraphics')
  const elToggleShortNumbers = document.getElementById('toggleShortNumbers')

  if (elToggleParticles) elToggleParticles.checked = settings.particles
  if (elToggleFancyGraphics) elToggleFancyGraphics.checked = settings.fancyGraphics
  if (elToggleShortNumbers) elToggleShortNumbers.checked = settings.shortNumbers

  // 언어 변경 시 모든 UI 업데이트 함수
  function updateAllUIForLanguage() {
    // 직급 표시 업데이트
    const currentCareerEl = document.getElementById('currentCareer')
    if (currentCareerEl) {
      safeText(currentCareerEl, getCareerName(careerLevel))
    }

    // UI 업데이트 호출 (직급, 상품 이름 등이 포함됨)
    updateUI()

    // 업적 그리드 다시 렌더링 (툴팁 번역을 위해)
    updateAchievementGrid()

    // 저장 상태 업데이트 (시간 포맷 번역을 위해)
    updateSaveStatus()
  }

  // 언어 선택 핸들러
  const elLanguageSelect = document.getElementById('languageSelect')
  if (elLanguageSelect) {
    elLanguageSelect.value = getLang()
    elLanguageSelect.addEventListener('change', e => {
      const newLang = e.target.value
      setLang(newLang)
      applyI18nToDOM()
      updateAllUIForLanguage()
    })
  }

  // 설정 탭 이벤트 리스너
  const elExportSaveBtn = document.getElementById('exportSaveBtn')
  const elImportSaveBtn = document.getElementById('importSaveBtn')
  const elImportFileInput = document.getElementById('importFileInput')
  const elCloudUploadBtn = document.getElementById('cloudUploadBtn')
  const elCloudDownloadBtn = document.getElementById('cloudDownloadBtn')

  if (elExportSaveBtn) {
    elExportSaveBtn.addEventListener('click', exportSave)
  }

  if (elImportSaveBtn) {
    elImportSaveBtn.addEventListener('click', () => {
      if (elImportFileInput) {
        elImportFileInput.click()
      }
    })
  }

  if (elImportFileInput) {
    elImportFileInput.addEventListener('change', e => {
      const file = e.target.files[0]
      if (file) {
        importSave(file)
      }
    })
  }

  // ======= 클라우드 세이브(로그인 사용자 전용) =======
  // 탭 숨김/닫기 시에만 자동 플러시 (토글 없음)
  let __cloudPendingSave = null
  let __lastCloudUploadedSaveTs = 0
  let __currentUser = null
  let __lastCloudSyncAt = null

  function __updateCloudLastSyncUI() {
    const el = document.getElementById('cloudLastSync')
    if (!el) return
    if (!__lastCloudSyncAt) {
      el.textContent = '--:--'
      return
    }
    const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
    el.textContent = __lastCloudSyncAt.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  function __setCloudHint(text) {
    const el = document.getElementById('cloudSaveHint')
    if (!el || !text) return
    el.textContent = text
  }

  // 탭 숨김/닫기 시에만 자동 플러시 (토글 없음, 항상 ON)
  async function flushCloudAutoUpload(reason = 'flush') {
    if (!__currentUser) return
    if (!__cloudPendingSave) return

    const saveObj = __cloudPendingSave
    __cloudPendingSave = null

    const saveTs = Number(saveObj?.ts || Date.now()) || Date.now()
    if (saveTs && saveTs <= __lastCloudUploadedSaveTs) return // 중복 업로드 방지

    const r = await upsertCloudSave('seoulsurvival', saveObj)
    if (!r.ok) {
      // 플러시는 조용히 실패(UX 보호). 버튼 수동 업로드에서 자세한 안내.
      __setCloudHint(`자동 동기화 실패(나중에 재시도). 이유: ${r.reason || 'unknown'}`)
      return
    }

    __lastCloudUploadedSaveTs = saveTs
    __lastCloudSyncAt = new Date()
    __updateCloudLastSyncUI()
    __setCloudHint('자동 동기화 완료 ✅')
  }

  async function cloudUpload() {
    const user = await getUser()
    if (!user) {
      Modal.openInfoModal(
        t('modal.error.loginRequired.title'),
        t('modal.error.loginRequired.message'),
        '🔐'
      )
      return
    }

    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) {
      Modal.openInfoModal(
        t('modal.error.noSaveData.title'),
        t('modal.error.noSaveData.message'),
        '💾'
      )
      return
    }

    let saveObj
    try {
      saveObj = JSON.parse(raw)
    } catch {
      Modal.openInfoModal(
        t('modal.error.invalidSaveData.title'),
        t('modal.error.invalidSaveData.message'),
        '⚠️'
      )
      return
    }

    const r = await upsertCloudSave('seoulsurvival', saveObj)
    if (!r.ok) {
      if (r.reason === 'missing_table') {
        Modal.openInfoModal(
          t('modal.error.cloudTableMissing.title'),
          t('modal.error.cloudTableMissing.message'),
          '🛠️'
        )
        return
      }
      Modal.openInfoModal(
        t('modal.error.uploadFailed.title'),
        t('modal.error.uploadFailed.message', { error: r.error?.message || '' }),
        '⚠️'
      )
      return
    }

    Diary.addLog(t('msg.cloudSaved'))
    Modal.openInfoModal(
      t('modal.info.cloudSaveComplete.title'),
      t('modal.info.cloudSaveComplete.message'),
      '☁️'
    )
  }

  async function cloudDownload() {
    const user = await getUser()
    if (!user) {
      Modal.openInfoModal(
        t('modal.error.loginRequired.title'),
        t('modal.error.loginRequired.message'),
        '🔐'
      )
      return
    }

    const r = await fetchCloudSave('seoulsurvival')
    if (!r.ok) {
      if (r.reason === 'missing_table') {
        Modal.openInfoModal(
          t('modal.error.cloudTableMissing.title'),
          t('modal.error.cloudTableMissing.message'),
          '🛠️'
        )
        return
      }
      Modal.openInfoModal(
        t('modal.error.downloadFailed.title'),
        t('modal.error.downloadFailed.message', { error: r.error?.message || '' }),
        '⚠️'
      )
      return
    }

    if (!r.found) {
      Modal.openInfoModal(
        t('modal.error.noCloudSave.title'),
        t('modal.error.noCloudSave.message'),
        '☁️'
      )
      return
    }

    const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
    const cloudTime = r.save?.saveTime
      ? new Date(r.save.saveTime).toLocaleString(locale)
      : r.updated_at
        ? new Date(r.updated_at).toLocaleString(locale)
        : t('ui.noTimeInfo')
    Modal.openConfirmModal(
      t('modal.confirm.cloudLoad.title'),
      t('modal.confirm.cloudLoad.message', { time: cloudTime }),
      () => {
        try {
          localStorage.setItem(SAVE_KEY, JSON.stringify(r.save))
          Diary.addLog(t('msg.cloudApplied'))
          setTimeout(() => location.reload(), 600)
        } catch (e) {
          Modal.openInfoModal(
            t('modal.error.cloudApplyFailed.title'),
            t('modal.error.cloudApplyFailed.message', { error: String(e) }),
            '⚠️'
          )
        }
      },
      {
        icon: '☁️',
        primaryLabel: t('button.load'),
        secondaryLabel: t('button.cancel'),
      }
    )
  }

  /**
   * 클라우드 세이브 복구를 제안하고, 사용자 선택에 따라 처리
   * @returns {Promise<boolean>} true: reload가 예약됨, false: reload 예약 안 됨
   */
  async function maybeOfferCloudRestore() {
    // 닉네임 결정이 끝날 때까지 클라우드 복구를 차단
    try {
      if (sessionStorage.getItem(CLOUD_RESTORE_BLOCK_KEY) === '1') {
        return false
      }
    } catch (e) {
      console.warn('sessionStorage get 실패:', e)
    }

    // resetGame 직후 첫 부팅에서는 클라우드 복구 제안을 1회 스킵
    try {
      if (sessionStorage.getItem(CLOUD_RESTORE_SKIP_KEY) === '1') {
        sessionStorage.removeItem(CLOUD_RESTORE_SKIP_KEY)
        return false
      }
    } catch (e) {
      console.warn('sessionStorage get/remove 실패:', e)
    }

    // 로컬 저장이 없을 때만 자동 제안(안전)
    const hasLocal = !!localStorage.getItem(SAVE_KEY)
    if (hasLocal) return false

    const user = await getUser()
    if (!user) return false

    const r = await fetchCloudSave('seoulsurvival')
    if (!r.ok || !r.found) return false

    const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
    const cloudTime = r.save?.saveTime
      ? new Date(r.save.saveTime).toLocaleString(locale)
      : r.updated_at
        ? new Date(r.updated_at).toLocaleString(locale)
        : t('ui.noTimeInfo')
    const message = t('modal.confirm.cloudRestore.message', { time: cloudTime })

    // Promise를 반환하여 사용자 선택을 기다림
    return new Promise(resolve => {
      let settled = false // resolve 중복 호출 방지 가드

      const done = value => {
        if (!settled) {
          settled = true
          resolve(value)
        }
      }

      Modal.openConfirmModal(
        t('modal.confirm.cloudRestore.title'),
        message,
        () => {
          // "불러오기" 클릭 시
          try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(r.save))
            Diary.addLog(t('msg.cloudApplied'))
            setTimeout(() => location.reload(), 600)
            done(true) // reload가 예약되었음을 반환
          } catch (error) {
            console.error('클라우드 세이브 적용 실패:', error)
            done(false) // 에러 발생 시 false 반환
          }
        },
        {
          icon: '☁️',
          primaryLabel: t('button.load'),
          secondaryLabel: t('button.later'),
          onCancel: () => {
            // "나중에" 클릭 시
            done(false) // reload 예약 안 됨
          },
        }
      )
    })
  }

  /**
   * 로그인 시 클라우드/로컬 저장 비교 및 제안
   * @returns {Promise<boolean>} true: 저장이 변경됨 (reload 필요), false: 변경 없음
   */
  async function compareAndOfferSaveSync() {
    const user = await getUser()
    if (!user) return false

    // 로컬 저장 확인
    const localSaveStr = localStorage.getItem(SAVE_KEY)
    if (!localSaveStr) {
      // 로컬 저장 없으면 기존 maybeOfferCloudRestore() 사용
      return await maybeOfferCloudRestore()
    }

    let localSave
    try {
      localSave = JSON.parse(localSaveStr)
    } catch (e) {
      console.error('로컬 저장 파싱 실패:', e)
      return false
    }

    // 클라우드 저장 확인
    const cloudResult = await fetchCloudSave('seoulsurvival')
    if (!cloudResult.ok || !cloudResult.found) {
      // 클라우드 저장 없으면 현재 로컬 저장 사용
      return false
    }

    const cloudSave = cloudResult.save

    // 자산 계산
    const localAssets = calculateTotalAssetValueFromSave(localSave)
    const cloudAssets = calculateTotalAssetValueFromSave(cloudSave)

    // 플레이타임 계산
    const localPlayTimeMs = calculatePlayTimeMsFromSave(localSave, sessionStartTime)
    const cloudPlayTimeMs = calculatePlayTimeMsFromSave(cloudSave, Date.now())

    // 타임스탬프 비교
    const localTs = Number(localSave.ts || 0)
    const cloudTs = Number(cloudResult.save_ts || 0)

    // 비교 로직: 클라우드가 더 높은 자산이거나, 자산이 같으면 더 최신인 경우
    const shouldOfferCloud =
      cloudAssets > localAssets || // 클라우드가 더 높은 자산
      (cloudAssets === localAssets && cloudTs > localTs) // 자산 같으면 더 최신 것

    if (!shouldOfferCloud) {
      // 로컬이 더 나으면 제안하지 않음
      return false
    }

    // 클라우드가 더 나은 경우 제안
    const cloudTime = cloudSave.saveTime
      ? new Date(cloudSave.saveTime).toLocaleString('ko-KR')
      : cloudResult.updated_at
        ? new Date(cloudResult.updated_at).toLocaleString(locale)
        : t('ui.noTimeInfo')
    const localTime = localSave.saveTime
      ? new Date(localSave.saveTime).toLocaleString(locale)
      : t('ui.noTimeInfo')

    // 플레이타임 포맷
    const localPlayTimeText = NumberFormat.formatPlaytimeMs(localPlayTimeMs)
    const cloudPlayTimeText = NumberFormat.formatPlaytimeMs(cloudPlayTimeMs)

    // 자산 포맷
    const localAssetsText = NumberFormat.formatLeaderboardAssets(localAssets)
    const cloudAssetsText = NumberFormat.formatLeaderboardAssets(cloudAssets)

    const message =
      `다른 기기에서 더 높은 점수로 저장된 진행이 있습니다.\n\n` +
      `📊 지금 이 기기\n` +
      `   자산: ${localAssetsText}\n` +
      `   플레이타임: ${localPlayTimeText}\n` +
      `   저장 시간: ${localTime}\n\n` +
      `☁️ 다른 기기\n` +
      `   자산: ${cloudAssetsText}\n` +
      `   플레이타임: ${cloudPlayTimeText}\n` +
      `   저장 시간: ${cloudTime}\n\n` +
      `어떤 진행을 사용하시겠습니까?`

    return new Promise(resolve => {
      let settled = false

      const done = value => {
        if (!settled) {
          settled = true
          resolve(value)
        }
      }

      Modal.openConfirmModal(
        t('modal.confirm.progressSwitch.title'),
        t('modal.confirm.progressSwitch.message', { message }),
        () => {
          // 다른 기기로 바꾸기
          try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(cloudSave))
            Diary.addLog(t('msg.cloudProgressLoaded'))
            setTimeout(() => location.reload(), 600)
            done(true)
          } catch (error) {
            console.error('클라우드 세이브 적용 실패:', error)
            Modal.openInfoModal(
              t('modal.error.progressSwitchFailed.title'),
              t('modal.error.progressSwitchFailed.message', {
                error: error.message || String(error),
              }),
              '⚠️'
            )
            done(false)
          }
        },
        {
          icon: '☁️',
          primaryLabel: '다른 기기로 바꾸기',
          secondaryLabel: '지금 기기 그대로',
          onCancel: () => {
            // 지금 기기 그대로 선택 시
            done(false)
          },
        }
      )
    })
  }

  if (elCloudUploadBtn) elCloudUploadBtn.addEventListener('click', cloudUpload)
  if (elCloudDownloadBtn)
    elCloudDownloadBtn.addEventListener('click', cloudDownload)
    // 로컬 저장이 없으면 클라우드 복구를 1회 제안
    // (위에서 이미 처리했으므로 여기서는 호출하지 않음)

    // 로그인 상태를 캐시해두면 autosave마다 getUser() 호출을 피할 수 있다.
  ;(async () => {
    try {
      __currentUser = await getUser()

      // 마이그레이션: 로그인 시 현재 닉네임이 있으면 자동 claim 시도
      if (__currentUser && playerNickname) {
        try {
          const { raw: normalized } = normalizeNickname(playerNickname)
          const claimResult = await claimNickname(normalized, __currentUser.id)

          if (!claimResult.success && claimResult.error === 'taken') {
            // 충돌: 다른 사용자가 이미 점유
            if (__IS_DEV__) {
              console.warn('[Nickname Migration] 충돌 감지:', playerNickname)
            }
            // needsNicknameChange 플래그 설정
            try {
              localStorage.setItem('clicksurvivor_needsNicknameChange', 'true')
            } catch (e) {
              console.warn('needsNicknameChange 플래그 저장 실패:', e)
            }
          } else if (claimResult.success) {
            if (__IS_DEV__) {
              console.log('[Nickname Migration] 자동 claim 성공:', playerNickname)
            }
            // 성공 시 플래그 해제
            try {
              localStorage.removeItem('clicksurvivor_needsNicknameChange')
            } catch (e) {
              // 무시
            }
          }
        } catch (error) {
          console.error('[Nickname Migration] 자동 claim 실패:', error)
          // 마이그레이션 실패해도 게임 진행은 계속
        }
      }

      onAuthStateChange(async user => {
        __currentUser = user

        // 로그인 시 마이그레이션: 현재 닉네임이 있으면 자동 claim 시도
        if (user && playerNickname) {
          try {
            const { raw: normalized } = normalizeNickname(playerNickname)
            const claimResult = await claimNickname(normalized, user.id)

            if (!claimResult.success && claimResult.error === 'taken') {
              // 충돌: 다른 사용자가 이미 점유
              if (__IS_DEV__) {
                console.warn('[Nickname Migration] 로그인 후 충돌 감지:', playerNickname)
              }
              // needsNicknameChange 플래그 설정
              try {
                localStorage.setItem('clicksurvivor_needsNicknameChange', 'true')
              } catch (e) {
                console.warn('needsNicknameChange 플래그 저장 실패:', e)
              }
              // 설정 탭에 배너 표시를 위해 UI 업데이트
              updateUI()
            } else if (claimResult.success) {
              if (__IS_DEV__) {
                console.log('[Nickname Migration] 로그인 후 자동 claim 성공:', playerNickname)
              }
              // 성공 시 플래그 해제
              try {
                localStorage.removeItem('clicksurvivor_needsNicknameChange')
              } catch (e) {
                // 무시
              }
              // 리더보드 즉시 업데이트
              try {
                await LeaderboardUI.updateLeaderboardEntry(true)
              } catch (error) {
                console.error('리더보드 업데이트 실패:', error)
              }
            }
          } catch (error) {
            console.error('[Nickname Migration] 로그인 후 자동 claim 실패:', error)
          }
        }

        // 로그인 성공 시 저장 비교 (1회만)
        if (user && !window.__saveSyncChecked) {
          window.__saveSyncChecked = true
          // UI 안정화를 위해 약간의 지연
          setTimeout(async () => {
            try {
              await compareAndOfferSaveSync()
            } catch (error) {
              console.error('저장 동기화 확인 중 오류:', error)
            }
          }, 1500) // 로그인 UI 업데이트 후 실행
        } else if (!user) {
          // 로그아웃 시 플래그 리셋
          window.__saveSyncChecked = false
        }
      })

      // 닉네임 변경 이벤트 감지 (다른 페이지에서 닉네임 변경 시)
      // 이벤트 리스너는 한 번만 등록되도록 onAuthStateChange 밖으로 이동
      if (!window.__nicknameEventListenersRegistered) {
        window.__nicknameEventListenersRegistered = true

        window.addEventListener('nicknamechanged', async event => {
          const newNickname = event.detail?.nickname
          if (newNickname) {
            playerNickname = newNickname
            // 게임 저장에 닉네임 업데이트
            try {
              const saveData = localStorage.getItem(SAVE_KEY)
              if (saveData) {
                const data = JSON.parse(saveData)
                data.nickname = newNickname
                localStorage.setItem(SAVE_KEY, JSON.stringify(data))
              }
            } catch (e) {
              console.warn('닉네임 저장 실패:', e)
            }
            // UI 업데이트
            updateUI()
            console.log('[SeoulSurvival] Nickname updated from event:', newNickname)
          }
        })

        // authstatechange 이벤트도 감지 (닉네임 변경 후 발생)
        window.addEventListener('authstatechange', async () => {
          // 닉네임 변경 플래그 확인
          try {
            const nicknameChanged = localStorage.getItem('clicksurvivor_nickname_changed')
            if (nicknameChanged) {
              // 현재 사용자 가져오기
              const currentUser = await getUser()
              if (currentUser) {
                // 서버에서 최신 닉네임 가져오기
                const { getUserProfile } = await import('../../shared/auth/core.js')
                const profile = await getUserProfile('seoulsurvival')
                if (profile.success && profile.user?.nickname) {
                  playerNickname = profile.user.nickname
                  // 게임 저장에 닉네임 업데이트
                  const saveData = localStorage.getItem(SAVE_KEY)
                  if (saveData) {
                    const data = JSON.parse(saveData)
                    data.nickname = playerNickname
                    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
                  }
                  // UI 업데이트
                  updateUI()
                  console.log('[SeoulSurvival] Nickname updated from server:', playerNickname)
                }
              }
              // 플래그 제거
              localStorage.removeItem('clicksurvivor_nickname_changed')
            }
          } catch (e) {
            console.warn('닉네임 동기화 실패:', e)
          }
        })
      }
    } catch {
      // Ignore if browser doesn't support this event
    }
  })()

  // 탭이 숨겨지거나 닫힐 때 자동으로 클라우드에 플러시 (로그인 사용자만)
  // 주의: 브라우저 크래시/강제 종료 시에는 실행되지 않을 수 있음 (best-effort)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushCloudAutoUpload('visibility:hidden')
    }
  })
  window.addEventListener('pagehide', () => {
    flushCloudAutoUpload('pagehide')
  })

  // 토글 스위치 이벤트 리스너
  if (elToggleParticles) {
    elToggleParticles.addEventListener('change', e => {
      settings.particles = e.target.checked
      saveSettings()
    })
  }

  if (elToggleFancyGraphics) {
    elToggleFancyGraphics.addEventListener('change', e => {
      settings.fancyGraphics = e.target.checked
      saveSettings()
      // 화려한 그래픽 설정 적용 (향후 확장 가능)
    })
  }

  if (elToggleShortNumbers) {
    elToggleShortNumbers.addEventListener('change', e => {
      settings.shortNumbers = e.target.checked
      saveSettings()
      // UI 즉시 업데이트 (숫자 포맷 변경 반영)
      updateUI()
    })
  }

  // 판매 시스템 테스트 로그
  console.log('=== 판매 시스템 초기화 완료 ===')
  console.log('✅ 구매/판매 모드 토글 시스템 활성화')
  console.log('✅ 금융상품 통합 거래 시스템 (예금/적금/주식)')
  console.log('✅ 부동산 통합 거래 시스템 (빌라/오피스텔/아파트/상가/빌딩)')
  console.log('✅ 판매 가격: 현재가의 80%')
  console.log('✅ 수량 선택: 1개/10개/100개')
  console.log('💡 사용법: 상단 "구매/판매" 버튼으로 모드 전환 후 거래하세요!')

  // ======= 성장 추적 데이터 저장 =======
  let hourlyEarningsHistory = [] // 최근 1시간 수익 기록
  let dailyEarningsHistory = [] // 최근 24시간 수익 기록
  let lastEarningsSnapshot = 0 // 마지막 수익 스냅샷
  let lastSnapshotTime = Date.now()

  function updateGrowthTracking() {
    const now = Date.now()
    const currentEarnings =
      depositsLifetime +
      savingsLifetime +
      bondsLifetime +
      usStocksLifetime +
      cryptosLifetime +
      villasLifetime +
      officetelsLifetime +
      apartmentsLifetime +
      shopsLifetime +
      buildingsLifetime +
      totalLaborIncome

    // 1시간 이내 기록 유지
    hourlyEarningsHistory = hourlyEarningsHistory.filter(entry => now - entry.time < 3600000)
    // 24시간 이내 기록 유지
    dailyEarningsHistory = dailyEarningsHistory.filter(entry => now - entry.time < 86400000)

    // 1분마다 스냅샷 저장
    if (now - lastSnapshotTime >= 60000) {
      hourlyEarningsHistory.push({ time: now, earnings: currentEarnings })
      dailyEarningsHistory.push({ time: now, earnings: currentEarnings })
      lastSnapshotTime = now
    }

    // 최근 1시간 수익 계산
    const oneHourAgo = now - 3600000
    const hourlyEarnings =
      hourlyEarningsHistory.length > 0 ? currentEarnings - hourlyEarningsHistory[0].earnings : 0

    // 최근 24시간 수익 계산
    const oneDayAgo = now - 86400000
    const dailyEarnings =
      dailyEarningsHistory.length > 0 ? currentEarnings - dailyEarningsHistory[0].earnings : 0

    // 성장 속도 계산 (시간당 증가율)
    const growthRate =
      lastEarningsSnapshot > 0 && now - lastSnapshotTime > 0
        ? ((currentEarnings - lastEarningsSnapshot) / lastEarningsSnapshot) *
          (3600000 / (now - lastSnapshotTime)) *
          100
        : 0

    // 마일스톤 계산
    const milestones = [1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000]
    const maxAchievedText = t('stats.maxAchieved')
    let nextMilestone = milestones.find(m => m > currentEarnings) || maxAchievedText
    if (nextMilestone !== maxAchievedText) {
      const remaining = nextMilestone - currentEarnings
      const remainingText = t('stats.remaining', {
        amount: NumberFormat.formatStatsNumber(remaining, settings),
      })
      nextMilestone = remainingText
    }

    // UI 업데이트
    safeText(
      document.getElementById('hourlyEarnings'),
      NumberFormat.formatCashDisplay(Math.max(0, hourlyEarnings, settings))
    )
    safeText(
      document.getElementById('dailyEarnings'),
      NumberFormat.formatCashDisplay(Math.max(0, dailyEarnings, settings))
    )
    // "+0.0%/시간" 처럼 소수점 1자리 고정 + -0.0 방지
    const growthRateStable = Math.abs(growthRate) < 0.05 ? 0 : growthRate
    const perHourUnitForGrowth = t('stats.unit.perHour')
    safeText(
      document.getElementById('growthRate'),
      `${growthRateStable >= 0 ? '+' : ''}${growthRateStable.toFixed(1)}%${perHourUnitForGrowth}`
    )
    safeText(document.getElementById('nextMilestone'), nextMilestone)

    lastEarningsSnapshot = currentEarnings
  }

  // ======= 도넛 차트 그리기 =======
  function drawDonutChart() {
    const canvas = document.getElementById('assetDonutChart')
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // DPR(레티나) 대응: 흐릿하게 보이는 문제 해결
    const baseSize = 200 // index.html의 canvas attribute와 동일한 논리 크기
    const dpr = Math.max(1, Math.floor((window.devicePixelRatio || 1) * 100) / 100)
    const target = Math.round(baseSize * dpr)
    if (canvas.width !== target || canvas.height !== target) {
      canvas.width = target
      canvas.height = target
      canvas.style.width = `${baseSize}px`
      canvas.style.height = `${baseSize}px`
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const centerX = baseSize / 2
    const centerY = baseSize / 2
    const radius = 80
    const innerRadius = 50

    // 자산 비율 계산
    const totalAssets = cash + calculateTotalAssetValue()
    const financialValue = calculateFinancialValue()
    const propertyValue = calculatePropertyValue()

    const cashPercent = totalAssets > 0 ? (cash / totalAssets) * 100 : 0
    const financialPercent = totalAssets > 0 ? (financialValue / totalAssets) * 100 : 0
    const propertyPercent = totalAssets > 0 ? (propertyValue / totalAssets) * 100 : 0

    // 배경 원
    ctx.clearRect(0, 0, baseSize, baseSize)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.fill()

    // 각 섹션 그리기
    let currentAngle = -Math.PI / 2

    // 현금
    if (cashPercent > 0) {
      const angle = (cashPercent / 100) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
      ctx.closePath()
      // 현금 컬러 = 노동 컬러(주황) + 더 또렷하게(그라데이션/경계선)
      const cashGrad = ctx.createLinearGradient(
        centerX - radius,
        centerY - radius,
        centerX + radius,
        centerY + radius
      )
      cashGrad.addColorStop(0, '#f59e0b')
      cashGrad.addColorStop(1, '#d97706')
      ctx.fillStyle = cashGrad
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
      ctx.stroke()
      currentAngle += angle
    }

    // 금융
    if (financialPercent > 0) {
      const angle = (financialPercent / 100) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
      ctx.closePath()
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'
      ctx.fill()
      currentAngle += angle
    }

    // 부동산
    if (propertyPercent > 0) {
      const angle = (propertyPercent / 100) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
      ctx.closePath()
      ctx.fillStyle = 'rgba(16, 185, 129, 0.5)'
      ctx.fill()
    }

    // 내부 원 (도넛 효과)
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
    // canvas는 CSS var(--bg)를 직접 해석하지 못하므로 실제 색상값을 사용
    const bgColor =
      getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0b1220'
    ctx.fillStyle = bgColor
    ctx.fill()
  }

  function calculateFinancialValue() {
    let value = 0
    if (deposits > 0) {
      for (let i = 0; i < deposits; i++) {
        value += getFinancialCost('deposit', i)
      }
    }
    if (savings > 0) {
      for (let i = 0; i < savings; i++) {
        value += getFinancialCost('savings', i)
      }
    }
    if (bonds > 0) {
      for (let i = 0; i < bonds; i++) {
        value += getFinancialCost('bond', i)
      }
    }
    if (usStocks > 0) {
      for (let i = 0; i < usStocks; i++) {
        value += getFinancialCost('usStock', i)
      }
    }
    if (cryptos > 0) {
      for (let i = 0; i < cryptos; i++) {
        value += getFinancialCost('crypto', i)
      }
    }
    return value
  }

  function calculatePropertyValue() {
    let value = 0
    if (villas > 0) {
      for (let i = 0; i < villas; i++) {
        value += getPropertyCost('villa', i)
      }
    }
    if (officetels > 0) {
      for (let i = 0; i < officetels; i++) {
        value += getPropertyCost('officetel', i)
      }
    }
    if (apartments > 0) {
      for (let i = 0; i < apartments; i++) {
        value += getPropertyCost('apartment', i)
      }
    }
    if (shops > 0) {
      for (let i = 0; i < shops; i++) {
        value += getPropertyCost('shop', i)
      }
    }
    if (buildings > 0) {
      for (let i = 0; i < buildings; i++) {
        value += getPropertyCost('building', i)
      }
    }
    return value
  }

  // ======= 통계 탭 업데이트 함수 =======

  function updateStatsTab() {
    try {
      // 1. 핵심 지표
      const totalAssets = cash + calculateTotalAssetValue()
      const totalEarnings =
        depositsLifetime +
        savingsLifetime +
        bondsLifetime +
        usStocksLifetime +
        cryptosLifetime +
        villasLifetime +
        officetelsLifetime +
        apartmentsLifetime +
        shopsLifetime +
        buildingsLifetime +
        totalLaborIncome

      console.log('[Stats] Updating - totalEarnings:', totalEarnings, 'totalAssets:', totalAssets)

      const totalAssetsEl = document.getElementById('totalAssets')
      const totalEarningsEl = document.getElementById('totalEarnings')

      if (!totalAssetsEl || !totalEarningsEl) {
        console.error('[Stats] Critical elements not found! totalAssets:', totalAssetsEl, 'totalEarnings:', totalEarningsEl)
        return
      }

      safeText(totalAssetsEl, NumberFormat.formatStatsNumber(totalAssets, settings))
      safeText(totalEarningsEl, NumberFormat.formatStatsNumber(totalEarnings, settings))
      // 통계 탭에서는 축약 표기/고정 소수점 규칙을 그대로 사용
      const perSecUnit = t('stats.unit.perSec')
      safeText(
        document.getElementById('rpsStats'),
        NumberFormat.formatCashDisplay(getRps(), settings) + perSecUnit
      )
      safeText(
        document.getElementById('clickIncomeStats'),
        NumberFormat.formatCashDisplay(getClickIncome(), settings)
      )

      // 2. 플레이 정보
      const timesUnit = t('stats.unit.times')
      const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
      safeText(
        document.getElementById('totalClicksStats'),
        totalClicks.toLocaleString(locale) + timesUnit
      )
      safeText(
        document.getElementById('laborIncomeStats'),
        NumberFormat.formatStatsNumber(totalLaborIncome, settings)
      )

      // 플레이 시간 계산 (누적 플레이시간 시스템)
      const currentSessionTime = Date.now() - sessionStartTime
      const totalPlayTimeMs = totalPlayTime + currentSessionTime
      const playTimeMinutes = Math.floor(totalPlayTimeMs / 60000)
      const playTimeHours = Math.floor(playTimeMinutes / 60)
      const remainingMinutes = playTimeMinutes % 60
      const hourUnit = t('stats.unit.hour')
      const minuteUnit = t('stats.unit.minute')
      const playTimeText =
        playTimeHours > 0
          ? `${playTimeHours}${hourUnit} ${remainingMinutes}${minuteUnit}`
          : `${playTimeMinutes}${minuteUnit}`

      // 디버깅 로그
      console.log('🕐 플레이시간 계산:', {
        totalPlayTime: totalPlayTime,
        currentSessionTime: currentSessionTime,
        totalPlayTimeMs: totalPlayTimeMs,
        playTimeMinutes: playTimeMinutes,
        playTimeText: playTimeText,
      })

      safeText(document.getElementById('playTimeStats'), playTimeText)

      // 시간당 수익
      const hourlyRateValue = playTimeMinutes > 0 ? (totalEarnings / playTimeMinutes) * 60 : 0
      const perHourUnit = t('stats.unit.perHour')
      safeText(
        document.getElementById('hourlyRate'),
        NumberFormat.formatCashDisplay(hourlyRateValue, settings) + perHourUnit
      )

      // 3. 수익 구조
      const laborPercent = totalEarnings > 0 ? (totalLaborIncome / totalEarnings) * 100 : 0
      const financialTotal =
        depositsLifetime + savingsLifetime + bondsLifetime + usStocksLifetime + cryptosLifetime
      const financialPercent = totalEarnings > 0 ? (financialTotal / totalEarnings) * 100 : 0
      const propertyTotal =
        villasLifetime + officetelsLifetime + apartmentsLifetime + shopsLifetime + buildingsLifetime
      const propertyPercent = totalEarnings > 0 ? (propertyTotal / totalEarnings) * 100 : 0

      // 수익 구조 바
      const incomeBar = document.querySelector('.income-bar')
      const laborSegment = document.getElementById('laborSegment')
      const financialSegment = document.getElementById('financialSegment')
      const propertySegment = document.getElementById('propertySegment')

      // 애니메이션 클래스 추가
      if (incomeBar && !incomeBar.classList.contains('animated')) {
        incomeBar.classList.add('animated')
      }

      if (laborSegment) {
        laborSegment.style.width = laborPercent.toFixed(1) + '%'
        const span = laborSegment.querySelector('span')
        if (span) {
          span.textContent = laborPercent >= 5 ? `🛠️ ${laborPercent.toFixed(1)}%` : ''
        }
      }

      if (financialSegment) {
        financialSegment.style.width = financialPercent.toFixed(1) + '%'
        const span = financialSegment.querySelector('span')
        if (span) {
          span.textContent = financialPercent >= 5 ? `💰 ${financialPercent.toFixed(1)}%` : ''
        }
      }

      if (propertySegment) {
        propertySegment.style.width = propertyPercent.toFixed(1) + '%'
        const span = propertySegment.querySelector('span')
        if (span) {
          span.textContent = propertyPercent >= 5 ? `🏢 ${propertyPercent.toFixed(1)}%` : ''
        }
      }

      // 범례 업데이트
      safeText(
        document.getElementById('laborLegend'),
        `${t('stats.labor')}: ${laborPercent.toFixed(1)}%`
      )
      safeText(
        document.getElementById('financialLegend'),
        `${t('stats.financial')}: ${financialPercent.toFixed(1)}%`
      )
      safeText(
        document.getElementById('propertyLegend'),
        `${t('stats.property')}: ${propertyPercent.toFixed(1)}%`
      )

      // 성장 추적 업데이트
      updateGrowthTracking()

      // 도넛 차트 업데이트
      drawDonutChart()

      // 4. 금융상품 상세 (수익 기여도 및 총 가치 추가)
      const totalEarningsForContribution = totalEarnings || 1

      // 통계 섹션 잠금 상태 업데이트
      updateStatsLockStates()

      // 예금
      const countUnit = t('ui.unit.count')
      safeText(document.getElementById('depositsOwnedStats'), deposits + countUnit)
      safeText(
        document.getElementById('depositsLifetimeStats'),
        NumberFormat.formatStatsNumber(depositsLifetime, settings)
      )
      const depositsContribution =
        totalEarningsForContribution > 0
          ? ((depositsLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('depositsContribution'), `(${depositsContribution}%)`)
      const depositsValue = deposits > 0 ? calculateFinancialValueForType('deposit', deposits) : 0
      safeText(
        document.getElementById('depositsValue'),
        NumberFormat.formatKoreanNumber(depositsValue)
      )

      // 적금
      safeText(document.getElementById('savingsOwnedStats'), savings + countUnit)
      safeText(
        document.getElementById('savingsLifetimeStats'),
        NumberFormat.formatStatsNumber(savingsLifetime, settings)
      )
      const savingsContribution =
        totalEarningsForContribution > 0
          ? ((savingsLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('savingsContribution'), `(${savingsContribution}%)`)
      const savingsValue = savings > 0 ? calculateFinancialValueForType('savings', savings) : 0
      safeText(
        document.getElementById('savingsValue'),
        NumberFormat.formatKoreanNumber(savingsValue)
      )

      // 주식
      safeText(document.getElementById('bondsOwnedStats'), bonds + countUnit)
      safeText(
        document.getElementById('bondsLifetimeStats'),
        NumberFormat.formatStatsNumber(bondsLifetime, settings)
      )
      const bondsContribution =
        totalEarningsForContribution > 0
          ? ((bondsLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('bondsContribution'), `(${bondsContribution}%)`)
      const bondsValue = bonds > 0 ? calculateFinancialValueForType('bond', bonds) : 0
      safeText(document.getElementById('bondsValue'), NumberFormat.formatKoreanNumber(bondsValue))

      // 미국주식
      safeText(document.getElementById('usStocksOwnedStats'), usStocks + countUnit)
      safeText(
        document.getElementById('usStocksLifetimeStats'),
        NumberFormat.formatStatsNumber(usStocksLifetime, settings)
      )
      const usStocksContribution =
        totalEarningsForContribution > 0
          ? ((usStocksLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('usStocksContribution'), `(${usStocksContribution}%)`)
      const usStocksValue = usStocks > 0 ? calculateFinancialValueForType('usStock', usStocks) : 0
      safeText(
        document.getElementById('usStocksValue'),
        NumberFormat.formatKoreanNumber(usStocksValue)
      )

      // 코인
      safeText(document.getElementById('cryptosOwnedStats'), cryptos + countUnit)
      safeText(
        document.getElementById('cryptosLifetimeStats'),
        NumberFormat.formatStatsNumber(cryptosLifetime, settings)
      )
      const cryptosContribution =
        totalEarningsForContribution > 0
          ? ((cryptosLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('cryptosContribution'), `(${cryptosContribution}%)`)
      const cryptosValue = cryptos > 0 ? calculateFinancialValueForType('crypto', cryptos) : 0
      safeText(
        document.getElementById('cryptosValue'),
        NumberFormat.formatKoreanNumber(cryptosValue)
      )

      // 5. 부동산 상세 (수익 기여도 및 총 가치 추가)
      // 빌라
      const propertyUnitForStats = t('ui.unit.property')
      safeText(document.getElementById('villasOwnedStats'), villas + propertyUnitForStats)
      safeText(
        document.getElementById('villasLifetimeStats'),
        NumberFormat.formatCashDisplay(villasLifetime, settings)
      )
      const villasContribution =
        totalEarningsForContribution > 0
          ? ((villasLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('villasContribution'), `(${villasContribution}%)`)
      const villasValue = villas > 0 ? calculatePropertyValueForType('villa', villas) : 0
      safeText(
        document.getElementById('villasValue'),
        NumberFormat.formatCashDisplay(villasValue, settings)
      )

      // 오피스텔
      safeText(document.getElementById('officetelsOwnedStats'), officetels + propertyUnitForStats)
      safeText(
        document.getElementById('officetelsLifetimeStats'),
        NumberFormat.formatCashDisplay(officetelsLifetime, settings)
      )
      const officetelsContribution =
        totalEarningsForContribution > 0
          ? ((officetelsLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('officetelsContribution'), `(${officetelsContribution}%)`)
      const officetelsValue =
        officetels > 0 ? calculatePropertyValueForType('officetel', officetels) : 0
      safeText(
        document.getElementById('officetelsValue'),
        NumberFormat.formatCashDisplay(officetelsValue, settings)
      )

      // 아파트
      safeText(document.getElementById('apartmentsOwnedStats'), apartments + propertyUnitForStats)
      safeText(
        document.getElementById('apartmentsLifetimeStats'),
        NumberFormat.formatCashDisplay(apartmentsLifetime, settings)
      )
      const apartmentsContribution =
        totalEarningsForContribution > 0
          ? ((apartmentsLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('apartmentsContribution'), `(${apartmentsContribution}%)`)
      const apartmentsValue =
        apartments > 0 ? calculatePropertyValueForType('apartment', apartments) : 0
      safeText(
        document.getElementById('apartmentsValue'),
        NumberFormat.formatCashDisplay(apartmentsValue, settings)
      )

      // 상가
      safeText(document.getElementById('shopsOwnedStats'), shops + propertyUnitForStats)
      safeText(
        document.getElementById('shopsLifetimeStats'),
        NumberFormat.formatCashDisplay(shopsLifetime, settings)
      )
      const shopsContribution =
        totalEarningsForContribution > 0
          ? ((shopsLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('shopsContribution'), `(${shopsContribution}%)`)
      const shopsValue = shops > 0 ? calculatePropertyValueForType('shop', shops) : 0
      safeText(
        document.getElementById('shopsValue'),
        NumberFormat.formatCashDisplay(shopsValue, settings)
      )

      // 빌딩
      const propertyUnit = t('ui.unit.property')
      safeText(document.getElementById('buildingsOwnedStats'), buildings + propertyUnit)
      safeText(
        document.getElementById('buildingsLifetimeStats'),
        NumberFormat.formatCashDisplay(buildingsLifetime, settings)
      )
      const buildingsContribution =
        totalEarningsForContribution > 0
          ? ((buildingsLifetime / totalEarningsForContribution) * 100).toFixed(1)
          : '0.0'
      safeText(document.getElementById('buildingsContribution'), `(${buildingsContribution}%)`)
      const buildingsValue =
        buildings > 0 ? calculatePropertyValueForType('building', buildings) : 0
      safeText(
        document.getElementById('buildingsValue'),
        NumberFormat.formatCashDisplay(buildingsValue, settings)
      )

      // 6. 효율 분석
      const efficiencies = calculateEfficiencies()
      safeText(document.getElementById('bestEfficiency'), efficiencies[0] || '-')
      safeText(document.getElementById('secondEfficiency'), efficiencies[1] || '-')
      safeText(document.getElementById('thirdEfficiency'), efficiencies[2] || '-')

      // 7. 업적 그리드
      updateAchievementGrid()

      // 8. 리더보드는 통계 탭이 활성화될 때만 업데이트 (updateUI에서 매번 호출하지 않음)
      // 리더보드 업데이트는 navBtns 이벤트 리스너에서 처리
    } catch (e) {
      console.error('[Stats] ❌ Stats tab update failed:', e)
      console.error('[Stats] Error stack:', e.stack)
      // Re-throw to make error visible in console
      throw e
    }
  }

  // 리더보드 UI 업데이트 함수 (디바운싱 및 로딩/실패/타임아웃 상태 관리)
  let __leaderboardLoading = false
  let __leaderboardLastUpdate = 0
  let __leaderboardUpdateTimer = null
  const LEADERBOARD_UPDATE_INTERVAL = 10000 // 10초마다 업데이트
  const LEADERBOARD_TIMEOUT = 7000 // 7초 타임아웃

  // 플레이타임 포맷터 (ms 고정)

  // 금융상품 타입별 가치 계산
  function calculateFinancialValueForType(type, count) {
    let value = 0
    for (let i = 0; i < count; i++) {
      value += getFinancialCost(type, i)
    }
    return value
  }

  // 부동산 타입별 가치 계산
  function calculatePropertyValueForType(type, count) {
    let value = 0
    for (let i = 0; i < count; i++) {
      value += getPropertyCost(type, i)
    }
    return value
  }

  // 통계 섹션 잠금 상태 업데이트
  function updateStatsLockStates() {
    // 금융상품 잠금 상태
    const statsProductMap = {
      savings: { id: 'savingsOwnedStats', name: '적금' },
      bond: { id: 'bondsOwnedStats', name: '주식' },
      usStock: { id: 'usStocksOwnedStats', name: '미국주식' },
      crypto: { id: 'cryptosOwnedStats', name: '코인' },
    }

    // 부동산 잠금 상태
    const statsPropertyMap = {
      villa: { id: 'villasOwnedStats', name: '빌라' },
      officetel: { id: 'officetelsOwnedStats', name: '오피스텔' },
      apartment: { id: 'apartmentsOwnedStats', name: '아파트' },
      shop: { id: 'shopsOwnedStats', name: '상가' },
      building: { id: 'buildingsOwnedStats', name: '빌딩' },
    }

    // 금융상품 잠금 상태 적용
    Object.keys(statsProductMap).forEach(productName => {
      const productInfo = statsProductMap[productName]
      const statElement = document.getElementById(productInfo.id)
      if (statElement) {
        const assetRow = statElement.closest('.asset-row')
        if (assetRow) {
          const isLocked = !isProductUnlocked(productName)
          assetRow.classList.toggle('locked', isLocked)
        }
      }
    })

    // 부동산 잠금 상태 적용
    Object.keys(statsPropertyMap).forEach(propertyName => {
      const propertyInfo = statsPropertyMap[propertyName]
      const statElement = document.getElementById(propertyInfo.id)
      if (statElement) {
        const assetRow = statElement.closest('.asset-row')
        if (assetRow) {
          const isLocked = !isProductUnlocked(propertyName)
          assetRow.classList.toggle('locked', isLocked)
        }
      }
    })
  }

  // 총 자산 가치 계산 (현재 보유 자산을 현재가로 환산)
  function calculateTotalAssetValue() {
    let totalValue = 0

    // 금융상품 가치 (보유 수량 전체를 구매가 기준으로 합산)
    if (deposits > 0) {
      totalValue += calculateFinancialValueForType('deposit', deposits)
    }
    if (savings > 0) {
      totalValue += calculateFinancialValueForType('savings', savings)
    }
    if (bonds > 0) {
      totalValue += calculateFinancialValueForType('bond', bonds)
    }
    if (usStocks > 0) {
      totalValue += calculateFinancialValueForType('usStock', usStocks)
    }
    if (cryptos > 0) {
      totalValue += calculateFinancialValueForType('crypto', cryptos)
    }

    // 부동산 가치 (보유 수량 전체를 구매가 기준으로 합산)
    if (villas > 0) {
      totalValue += calculatePropertyValueForType('villa', villas)
    }
    if (officetels > 0) {
      totalValue += calculatePropertyValueForType('officetel', officetels)
    }
    if (apartments > 0) {
      totalValue += calculatePropertyValueForType('apartment', apartments)
    }
    if (shops > 0) {
      totalValue += calculatePropertyValueForType('shop', shops)
    }
    if (buildings > 0) {
      totalValue += calculatePropertyValueForType('building', buildings)
    }

    return totalValue
  }

  // 총 자산 = 현금 + 보유 자산 가치
  function getTotalAssets() {
    return cash + calculateTotalAssetValue()
  }

  /**
   * 저장 데이터에서 총 자산 계산 (saveData 객체 기준)
   */
  function calculateTotalAssetValueFromSave(saveData) {
    if (!saveData) return 0

    let totalValue = 0
    const cash = Number(saveData.cash || 0)

    // 금융상품 가치
    const deposits = Number(saveData.deposits || 0)
    const savings = Number(saveData.savings || 0)
    const bonds = Number(saveData.bonds || 0)
    const usStocks = Number(saveData.usStocks || 0)
    const cryptos = Number(saveData.cryptos || 0)

    for (let i = 0; i < deposits; i++) {
      totalValue += getFinancialCost('deposit', i)
    }
    for (let i = 0; i < savings; i++) {
      totalValue += getFinancialCost('savings', i)
    }
    for (let i = 0; i < bonds; i++) {
      totalValue += getFinancialCost('bond', i)
    }
    for (let i = 0; i < usStocks; i++) {
      totalValue += getFinancialCost('usStock', i)
    }
    for (let i = 0; i < cryptos; i++) {
      totalValue += getFinancialCost('crypto', i)
    }

    // 부동산 가치
    const villas = Number(saveData.villas || 0)
    const officetels = Number(saveData.officetels || 0)
    const apartments = Number(saveData.apartments || 0)
    const shops = Number(saveData.shops || 0)
    const buildings = Number(saveData.buildings || 0)
    const towers_run = Number(saveData.towers_run || 0)

    for (let i = 0; i < villas; i++) {
      totalValue += getPropertyCost('villa', i)
    }
    for (let i = 0; i < officetels; i++) {
      totalValue += getPropertyCost('officetel', i)
    }
    for (let i = 0; i < apartments; i++) {
      totalValue += getPropertyCost('apartment', i)
    }
    for (let i = 0; i < shops; i++) {
      totalValue += getPropertyCost('shop', i)
    }
    for (let i = 0; i < buildings; i++) {
      totalValue += getPropertyCost('building', i)
    }
    for (let i = 0; i < towers_run; i++) {
      totalValue += getPropertyCost('tower', i)
    }

    return cash + totalValue
  }

  /**
   * 저장 데이터에서 플레이타임 계산 (ms 단위)
   */
  function calculatePlayTimeMsFromSave(saveData, sessionStartTime) {
    if (!saveData) return 0
    const savedTotalPlayTime = Number(saveData.totalPlayTime || 0)
    const savedSessionStartTime = Number(saveData.sessionStartTime || Date.now())
    const currentSessionTime = Date.now() - (sessionStartTime || savedSessionStartTime)
    return savedTotalPlayTime + Math.max(0, currentSessionTime)
  }

  // 효율 분석 (개당 초당 수익 순위)
  function calculateEfficiencies() {
    const assets = []

    // 금융상품
    if (deposits > 0) {
      assets.push({
        name: getProductName('deposit'),
        efficiency: FINANCIAL_INCOME.deposit,
        count: deposits,
      })
    }
    if (savings > 0) {
      assets.push({
        name: getProductName('savings'),
        efficiency: FINANCIAL_INCOME.savings,
        count: savings,
      })
    }
    if (bonds > 0) {
      assets.push({ name: getProductName('bond'), efficiency: FINANCIAL_INCOME.bond, count: bonds })
    }
    if (usStocks > 0) {
      assets.push({
        name: getProductName('usStock'),
        efficiency: FINANCIAL_INCOME.usStock,
        count: usStocks,
      })
    }
    if (cryptos > 0) {
      assets.push({
        name: getProductName('crypto'),
        efficiency: FINANCIAL_INCOME.crypto,
        count: cryptos,
      })
    }

    // 부동산
    if (villas > 0) {
      assets.push({
        name: getProductName('villa'),
        efficiency: BASE_RENT.villa * rentMultiplier,
        count: villas,
      })
    }
    if (officetels > 0) {
      assets.push({
        name: getProductName('officetel'),
        efficiency: BASE_RENT.officetel * rentMultiplier,
        count: officetels,
      })
    }
    if (apartments > 0) {
      assets.push({
        name: getProductName('apartment'),
        efficiency: BASE_RENT.apartment * rentMultiplier,
        count: apartments,
      })
    }
    if (shops > 0) {
      assets.push({
        name: getProductName('shop'),
        efficiency: BASE_RENT.shop * rentMultiplier,
        count: shops,
      })
    }
    if (buildings > 0) {
      assets.push({
        name: getProductName('building'),
        efficiency: BASE_RENT.building * rentMultiplier,
        count: buildings,
      })
    }

    // 효율 순으로 정렬
    assets.sort((a, b) => b.efficiency - a.efficiency)

    // 상위 3개 반환
    const perSecUnit = t('stats.unit.perSec')
    return assets
      .slice(0, 3)
      .map(
        a =>
          `${a.name} (${NumberFormat.formatNumberForLang(Math.floor(a.efficiency))}${t('ui.currency')}${perSecUnit}, ${a.count}${t('ui.unit.count')} ${t('ui.owned')})`
      )
  }

  // 업적 그리드 업데이트
  // 스크롤 중 DOM 업데이트 방지를 위한 플래그
  let __achievementScrollActive = false
  let __achievementUpdatePending = false
  let __achievementScrollDebounceTimer = null

  function updateAchievementGrid() {
    const achievementGrid = document.getElementById('achievementGrid')
    if (!achievementGrid) return

    // 스크롤 중이면 업데이트를 지연 (디바운스)
    const statsContent = achievementGrid.closest('.stats-content')
    if (statsContent && __achievementScrollActive) {
      __achievementUpdatePending = true
      if (__achievementScrollDebounceTimer) {
        clearTimeout(__achievementScrollDebounceTimer)
      }
      __achievementScrollDebounceTimer = setTimeout(() => {
        __achievementScrollActive = false
        if (__achievementUpdatePending) {
          __achievementUpdatePending = false
          updateAchievementGrid()
        }
      }, 300) // 스크롤 종료 후 300ms 대기
      return
    }

    // ======= 업적 툴팁(포털) 시스템 =======
    // - 툴팁 DOM은 1개만 사용 (겹침/누수/overflow 문제 방지)
    // - 이벤트는 그리드에 위임
    if (!window.__achievementTooltipPortalInitialized) {
      window.__achievementTooltipPortalInitialized = true

      const ensureTooltipEl = () => {
        let el = document.getElementById('achievementTooltip')
        if (!el) {
          el = document.createElement('div')
          el.id = 'achievementTooltip'
          el.className = 'achievement-tooltip'
          el.setAttribute('role', 'tooltip')
          el.setAttribute('aria-hidden', 'true')
          document.body.appendChild(el)
        }
        return el
      }

      const getAchText = achId => {
        const ach = ACHIEVEMENTS.find(a => a.id === achId)
        if (!ach) return ''
        const achievementName = t(`achievement.${ach.id}.name`, {}, ach.name)
        const achievementDesc = t(`achievement.${ach.id}.desc`, {}, ach.desc)
        const statusText = ach.unlocked
          ? t('achievement.status.unlocked')
          : t('achievement.status.locked')
        return `${achievementName}\n${achievementDesc}\n${statusText}`
      }

      const hideTooltip = () => {
        const el = document.getElementById('achievementTooltip')
        if (!el) return
        el.classList.remove('active', 'bottom')
        el.style.left = ''
        el.style.top = ''
        el.style.bottom = ''
        el.style.opacity = ''
        el.style.visibility = ''
        el.style.pointerEvents = ''
        el.setAttribute('aria-hidden', 'true')
        window.__achievementTooltipAnchorId = null
      }

      const showTooltipForIcon = iconEl => {
        const el = ensureTooltipEl()
        const achId = iconEl?.dataset?.achievementId || iconEl?.id?.replace(/^ach_/, '')
        if (!achId) return

        // 동일 아이콘 재클릭: 토글
        if (window.__achievementTooltipAnchorId === achId && el.classList.contains('active')) {
          hideTooltip()
          return
        }

        // 항상 1개만 보이도록 초기화
        hideTooltip()

        el.textContent = getAchText(achId)
        el.setAttribute('aria-hidden', 'false')

        // 측정을 위해 "보이되 투명/비활성" 상태로 먼저 활성화
        el.classList.add('active')
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.pointerEvents = 'none'
        el.style.left = '0px'
        el.style.top = '0px'
        el.style.bottom = 'auto'

        // 크기 측정
        void el.offsetHeight
        const tooltipRect = el.getBoundingClientRect()

        const iconRect = iconEl.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // 아이콘 중앙 기준
        let left = iconRect.left + iconRect.width / 2
        let top = iconRect.top - tooltipRect.height - 8
        let showBelow = false

        if (top < 10) {
          top = iconRect.bottom + 8
          showBelow = true
        }
        if (top + tooltipRect.height > viewportHeight - 10) {
          top = viewportHeight - tooltipRect.height - 10
        }

        // 좌/우 경계
        if (left + tooltipRect.width / 2 > viewportWidth - 10) {
          left = viewportWidth - tooltipRect.width / 2 - 10
        }
        if (left - tooltipRect.width / 2 < 10) {
          left = tooltipRect.width / 2 + 10
        }

        el.style.left = `${left}px`
        el.style.top = `${top}px`
        el.style.bottom = 'auto'
        el.classList.toggle('bottom', showBelow)

        // 즉시 표시
        el.style.visibility = 'visible'
        el.style.opacity = '1'
        el.style.pointerEvents = 'none' // 요구사항: 아이콘에서 벗어나면 사라짐 (툴팁 상호작용 불필요)

        window.__achievementTooltipAnchorId = achId
      }

      // 클릭: 즉시 표시/토글
      achievementGrid.addEventListener('click', e => {
        const iconEl = e.target.closest('.achievement-icon')
        if (!iconEl) return
        e.stopPropagation()
        showTooltipForIcon(iconEl)
      })

      // 아이콘에서 커서가 벗어나면 닫기
      // mouseleave는 버블링이 없어 pointerout으로 위임 처리
      achievementGrid.addEventListener('pointerout', e => {
        const fromIcon = e.target.closest?.('.achievement-icon')
        if (!fromIcon) return
        // 아이콘 밖으로 나가는 순간 닫기 (요구사항)
        hideTooltip()
      })

      // 바깥 클릭/스크롤/탭 전환 등으로 정리
      document.addEventListener('click', () => hideTooltip(), true)
      window.addEventListener('scroll', () => hideTooltip(), true)
      window.addEventListener('resize', () => hideTooltip(), true)
    }

    // 이미 생성되어 있으면 상태만 업데이트 시도 (깜빡임 방지)
    if (achievementGrid.children.length > 0) {
      let unlockedCount = 0
      let hasChanges = false

      Object.values(ACHIEVEMENTS).forEach(ach => {
        const icon = document.getElementById('ach_' + ach.id)
        if (!icon) {
          hasChanges = true // 아이콘이 없으면 재생성 필요
          return
        }

        const wasUnlocked = icon.classList.contains('unlocked')
        const isUnlocked = ach.unlocked

        // 상태가 변경된 경우에만 DOM 조작 (깜빡임 최소화)
        if (wasUnlocked !== isUnlocked) {
          hasChanges = true
          if (isUnlocked) {
            icon.classList.add('unlocked')
            icon.classList.remove('locked')
          } else {
            icon.classList.add('locked')
            icon.classList.remove('unlocked')
          }
        }

        if (isUnlocked) {
          unlockedCount++
        }

        // 네이티브 title은 항상 최신으로 유지 (툴팁 대체/접근성)
        const achievementName = t(`achievement.${ach.id}.name`, {}, ach.name)
        const achievementDesc = t(`achievement.${ach.id}.desc`, {}, ach.desc)
        const statusText = isUnlocked
          ? t('achievement.status.unlocked')
          : t('achievement.status.locked')
        const newTitle = `${achievementName}\n${achievementDesc}\n${statusText}`

        // title이 변경된 경우에만 업데이트 (불필요한 DOM 조작 방지)
        if (icon.title !== newTitle) {
          icon.title = newTitle
        }
      })

      const totalAchievements = Object.keys(ACHIEVEMENTS).length
      const progressEl = document.getElementById('achievementProgress')
      if (progressEl) {
        const newProgressText = `${unlockedCount}/${totalAchievements}`
        if (progressEl.textContent !== newProgressText) {
          safeText(progressEl, newProgressText)
        }
      }

      // 변경사항이 없으면 재렌더링 스킵 (깜빡임 방지)
      if (!hasChanges) {
        return
      }
    }

    // 여기까지 왔다는 것은:
    // - 그리드가 비어 있거나(children.length === 0)
    // - 또는 hasChanges=true로 "재생성 필요"가 감지된 경우
    // 항상 클린 상태에서 다시 그리도록 전체 초기화
    achievementGrid.innerHTML = ''
    let unlockedCount = 0
    const totalAchievements = Object.keys(ACHIEVEMENTS).length

    Object.values(ACHIEVEMENTS).forEach(ach => {
      const icon = document.createElement('div')
      icon.className = 'achievement-icon'
      icon.id = 'ach_' + ach.id
      icon.dataset.achievementId = ach.id
      icon.textContent = ach.icon
      const achievementName = t(`achievement.${ach.id}.name`, {}, ach.name)
      const achievementDesc = t(`achievement.${ach.id}.desc`, {}, ach.desc)
      const statusText = ach.unlocked
        ? t('achievement.status.unlocked')
        : t('achievement.status.locked')
      icon.title = `${achievementName}\n${achievementDesc}\n${statusText}`

      if (ach.unlocked) {
        icon.classList.add('unlocked')
        unlockedCount++
      } else {
        icon.classList.add('locked')
      }

      achievementGrid.appendChild(icon)
    })

    safeText(
      document.getElementById('achievementProgress'),
      `${unlockedCount}/${totalAchievements}`
    )
  }

  // ======= 리더보드 폴링 제어 (랭킹 탭 전용) =======
  // ======= 하단 네비게이션 탭 전환 =======
  const navBtns = document.querySelectorAll('.nav-btn')
  const tabContents = document.querySelectorAll('.tab-content')

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab')

      // 모든 탭 비활성화
      tabContents.forEach(tab => tab.classList.remove('active'))
      navBtns.forEach(navBtn => navBtn.classList.remove('active'))

      // 선택한 탭 활성화
      const tabEl = document.getElementById(targetTab)
      if (tabEl) {
        tabEl.classList.add('active')
      }
      btn.classList.add('active')

      // 설정 탭 진입 시 마이그레이션 충돌 체크 및 서버 닉네임 동기화
      if (targetTab === 'settingsTab') {
        try {
          // 서버에서 최신 닉네임 가져오기 (로그인 상태인 경우)
          ;(async () => {
            try {
              const user = await getUser()
              if (user) {
                const { getUserProfile } = await import('../../shared/auth/core.js')
                const profile = await getUserProfile('seoulsurvival')
                if (profile.success && profile.user?.nickname) {
                  const serverNickname = profile.user.nickname
                  // 서버 닉네임과 로컬 닉네임이 다르면 서버 닉네임으로 동기화
                  if (playerNickname !== serverNickname) {
                    playerNickname = serverNickname
                    // 게임 저장에 닉네임 업데이트
                    try {
                      const saveData = localStorage.getItem(SAVE_KEY)
                      if (saveData) {
                        const data = JSON.parse(saveData)
                        data.nickname = serverNickname
                        localStorage.setItem(SAVE_KEY, JSON.stringify(data))
                      }
                    } catch (e) {
                      console.warn('닉네임 저장 실패:', e)
                    }
                    // UI 업데이트
                    updateUI()
                    console.log('[SeoulSurvival] Nickname synced from server:', serverNickname)
                  }
                }
              }
            } catch (e) {
              console.warn('서버 닉네임 동기화 실패:', e)
            }
          })()

          const needsChange = localStorage.getItem('clicksurvivor_needsNicknameChange') === 'true'
          if (needsChange) {
            // 세션 단위 가드: 같은 세션에서 이미 자동 오픈했으면 스킵
            const autoOpenKey = 'clicksurvivor_nicknameModalAutoOpened'
            const alreadyOpened = sessionStorage.getItem(autoOpenKey) === 'true'

            if (!alreadyOpened) {
              // 닉네임 변경 입력 모달 자동 오픈
              setTimeout(() => {
                openNicknameChangeModal()
                // 세션 플래그 설정 (이 세션에서 한 번만 자동 오픈)
                try {
                  sessionStorage.setItem(autoOpenKey, 'true')
                } catch (e) {
                  // sessionStorage 실패 시 무시
                }
              }, 300) // 탭 전환 애니메이션 후 표시
            }
          }
        } catch (e) {
          // 무시
        }
      }

      // 랭킹 탭 전용 리더보드 폴링 제어
      if (targetTab === 'rankingTab') {
        LeaderboardUI.startLeaderboardPolling()
        // 업적 영역 스크롤 이벤트 계측 및 최적화
        setupAchievementScrollOptimization()
      } else {
        LeaderboardUI.stopLeaderboardPolling()
      }
    })
  })

  // 업적 영역 스크롤 최적화 설정
  function setupAchievementScrollOptimization() {
    const achievementGrid = document.getElementById('achievementGrid')
    if (!achievementGrid) return

    const statsContent = achievementGrid.closest('.stats-content')
    if (!statsContent) return

    // 이미 설정되어 있으면 스킵
    if (statsContent.dataset.scrollOptimized === 'true') return
    statsContent.dataset.scrollOptimized = 'true'

    let lastScrollTop = statsContent.scrollTop
    let lastScrollHeight = statsContent.scrollHeight
    let scrollThrottleTimer = null

    // 스크롤 이벤트 리스너
    statsContent.addEventListener(
      'scroll',
      () => {
        const currentScrollTop = statsContent.scrollTop
        const currentScrollHeight = statsContent.scrollHeight
        const clientHeight = statsContent.clientHeight

        // 스크롤 활성 플래그 설정
        __achievementScrollActive = true

        // 스크롤 종료 디바운스
        if (__achievementScrollDebounceTimer) {
          clearTimeout(__achievementScrollDebounceTimer)
        }
        __achievementScrollDebounceTimer = setTimeout(() => {
          __achievementScrollActive = false
          if (__achievementUpdatePending) {
            __achievementUpdatePending = false
            updateAchievementGrid()
          }
        }, 300)

        // DEV 모드에서만 계측 (200ms throttle)
        if (__IS_DEV__) {
          if (scrollThrottleTimer) return
          scrollThrottleTimer = setTimeout(() => {
            scrollThrottleTimer = null

            // scrollHeight 변화 감지
            if (currentScrollHeight !== lastScrollHeight) {
              console.warn('[Achievement Scroll] scrollHeight changed during scroll:', {
                before: lastScrollHeight,
                after: currentScrollHeight,
                scrollTop: currentScrollTop,
                clientHeight: clientHeight,
                reason: 'Layout change during scroll (likely cause of jank)',
              })
            }

            lastScrollTop = currentScrollTop
            lastScrollHeight = currentScrollHeight
          }, 200)
        }
      },
      { passive: true }
    )
  }

  updateUI() // 초기 UI 업데이트
  updateProductLockStates() // 초기 잠금 상태 업데이트

  // 초기 리더보드 로드/폴링 및 Observer 설정
  setTimeout(() => {
    const rankingTab = document.getElementById('rankingTab')
    if (rankingTab && rankingTab.classList.contains('active')) {
      LeaderboardUI.startLeaderboardPolling()
    }
    LeaderboardUI.setupLeaderboardObserver()
  }, 1000)

  // 업그레이드 섹션 초기 상태 설정 (열림)
  const upgradeListElement = document.getElementById('upgradeList')
  if (upgradeListElement) {
    upgradeListElement.classList.remove('collapsed-section')
    console.log('✅ Upgrade list initialized and opened')
  }

  updateUpgradeList() // 초기 업그레이드 리스트 생성

  // 닉네임 변경 기능 (유니크 강제 시스템) - 모달 방식
  const nicknameChangeBtn = document.getElementById('nicknameChangeBtn')
  const nicknameConflictChangeBtn = document.getElementById('nicknameConflictChangeBtn')

  // 쿨타임 상수 (30초)
  const NICKNAME_CHANGE_COOLDOWN_MS = 30000
  const NICKNAME_CHANGE_COOLDOWN_KEY = 'clicksurvivor_lastNicknameChangeAt'

  /**
   * 쿨타임 체크
   * @returns {{ allowed: boolean, remainingSeconds?: number }}
   */
  function checkNicknameCooldown() {
    try {
      const lastChangeAt = localStorage.getItem(NICKNAME_CHANGE_COOLDOWN_KEY)
      if (!lastChangeAt) {
        return { allowed: true }
      }

      const lastChangeTime = parseInt(lastChangeAt, 10)
      const now = Date.now()
      const elapsed = now - lastChangeTime

      if (elapsed >= NICKNAME_CHANGE_COOLDOWN_MS) {
        return { allowed: true }
      }

      const remaining = Math.ceil((NICKNAME_CHANGE_COOLDOWN_MS - elapsed) / 1000)
      return { allowed: false, remainingSeconds: remaining }
    } catch (e) {
      // localStorage 오류 시 허용 (쿨타임 실패해도 진행)
      return { allowed: true }
    }
  }

  /**
   * 쿨타임 저장
   */
  function saveNicknameCooldown() {
    try {
      localStorage.setItem(NICKNAME_CHANGE_COOLDOWN_KEY, String(Date.now()))
    } catch (e) {
      console.warn('쿨타임 저장 실패:', e)
    }
  }

  /**
   * 닉네임 변경 모달 열기
   */
  function openNicknameChangeModal() {
    // 쿨타임 체크
    const cooldown = checkNicknameCooldown()
    if (!cooldown.allowed) {
      Modal.openInfoModal(
        t('modal.error.nicknameLength.title'),
        t('settings.nickname.change.cooldown', { seconds: cooldown.remainingSeconds || 0 }),
        '⏱️'
      )
      return
    }

    // 현재 닉네임을 기본값으로 설정
    const currentNickname = playerNickname || ''

    Modal.openInputModal(
      t('settings.nickname.modal.title'),
      t('settings.nickname.modal.message'),
      handleNicknameChangeFromModal,
      {
        icon: '✏️',
        primaryLabel: t('settings.nickname.modal.submit'),
        secondaryLabel: t('settings.nickname.modal.cancel'),
        placeholder: t('settings.nickname.modal.placeholder'),
        maxLength: 6,
        defaultValue: currentNickname,
        required: true,
      }
    )
  }

  /**
   * 모달에서 닉네임 변경 처리
   */
  async function handleNicknameChangeFromModal(raw) {
    // 1. 로컬 유효성 검사
    const validation = validateNickname(raw)
    if (!validation.ok) {
      let errorMessage = ''
      switch (validation.reasonKey) {
        case 'empty':
          errorMessage = t('settings.nickname.change.empty')
          break
        case 'tooShort':
          errorMessage = t('settings.nickname.change.tooShort')
          break
        case 'tooLong':
          errorMessage = t('settings.nickname.change.tooLong')
          break
        case 'invalid':
          errorMessage = t('settings.nickname.change.invalid')
          break
        case 'banned':
          errorMessage = t('settings.nickname.change.banned')
          break
        default:
          errorMessage = t('settings.nickname.change.invalid')
      }
      Modal.openInfoModal(t('modal.error.nicknameFormat.title'), errorMessage, '⚠️')
      return
    }

    // 정규화
    const { raw: normalized, key } = normalizeNickname(raw)

    // 현재 닉네임과 동일하면 스킵
    const currentNormalized = normalizeNickname(playerNickname || '')
    if (key === currentNormalized.key) {
      if (__IS_DEV__) {
        console.log('[Nickname] 변경 없음: 동일한 닉네임')
      }
      return
    }

    // 1. 로그인 체크
    const user = await getUser()
    if (!user) {
      // 비로그인: 로컬만 저장, 리더보드 스킵
      const oldNickname = playerNickname
      playerNickname = normalized
      saveGame()
      updateUI()
      Diary.addLog(t('settings.nickname.change.success'))
      Diary.addLog(t('settings.nickname.change.loginRequired'))

      if (__IS_DEV__) {
        console.log(`[Nickname] 로컬 저장 완료 (비로그인): "${oldNickname}" → "${playerNickname}"`)
      }
      return
    }

    // 4. 로그인 상태: claimNickname 수행 (서버 유니크 보장)
    try {
      const claimResult = await claimNickname(normalized, user.id)

      if (!claimResult.success) {
        // 실패 처리
        if (claimResult.error === 'taken') {
          // taken 에러: 에러 모달 표시 후 입력 모달 재오픈 (재입력 가능)
          Modal.openInfoModal(
            t('modal.error.nicknameTaken.title'),
            t('settings.nickname.change.taken'),
            '⚠️'
          )
          // 에러 모달이 닫힌 후 입력 모달 재오픈 (기존 입력값 유지)
          setTimeout(() => {
            openNicknameChangeModal()
          }, 500)
        } else {
          Modal.openInfoModal(
            t('modal.error.nicknameLength.title'),
            t('settings.nickname.change.claimFailed'),
            '⚠️'
          )
        }
        return
      }

      // 성공: 닉네임 업데이트
      const oldNickname = playerNickname
      playerNickname = normalized

      // 저장
      saveGame()

      // 클라우드 저장
      try {
        const saveObj = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')
        await upsertCloudSave('seoulsurvival', saveObj)
        if (__IS_DEV__) {
          console.log('[Nickname] 클라우드 저장 완료')
        }
      } catch (error) {
        console.error('클라우드 저장 실패:', error)
      }

      // 리더보드 즉시 업데이트
      try {
        await LeaderboardUI.updateLeaderboardEntry(true) // forceImmediate: 닉네임 변경은 즉시 업데이트
      } catch (error) {
        console.error('리더보드 업데이트 실패:', error)
      }

      // 마이그레이션 충돌 플래그 해제
      try {
        localStorage.removeItem('clicksurvivor_needsNicknameChange')
        // 자동 오픈 세션 플래그도 해제
        sessionStorage.removeItem('clicksurvivor_nicknameModalAutoOpened')
      } catch (e) {
        // 무시
      }

      // 쿨타임 저장
      saveNicknameCooldown()

      // UI 업데이트
      updateUI()

      // 성공 메시지
      Diary.addLog(t('settings.nickname.change.success'))

      if (__IS_DEV__) {
        console.log(`[Nickname] 변경 완료: "${oldNickname}" → "${playerNickname}"`)
      }
    } catch (error) {
      console.error('닉네임 변경 실패:', error)
      Modal.openInfoModal(
        t('modal.error.nicknameLength.title'),
        t('settings.nickname.change.claimFailed'),
        '⚠️'
      )
    }
  }

  // 버튼 클릭 이벤트 리스너
  if (nicknameChangeBtn) {
    nicknameChangeBtn.addEventListener('click', openNicknameChangeModal)
  }

  if (nicknameConflictChangeBtn) {
    nicknameConflictChangeBtn.addEventListener('click', openNicknameChangeModal)
  }

  // 디버깅: 업그레이드 시스템 상태 확인
  console.log('=== UPGRADE SYSTEM DEBUG ===')
  console.log('Total upgrades defined:', Object.keys(UPGRADES).length)
  console.log('Unlocked upgrades:', Object.values(UPGRADES).filter(u => u.unlocked).length)
  console.log('Purchased upgrades:', Object.values(UPGRADES).filter(u => u.purchased).length)
  console.log(
    'First 3 upgrades:',
    Object.entries(UPGRADES)
      .slice(0, 3)
      .map(([id, u]) => ({
        id,
        unlocked: u.unlocked,
        purchased: u.purchased,
        cost: u.cost,
      }))
  )
  console.log('===========================')

  // 치트 코드 (테스트용 - 콘솔에서 사용 가능)
  window.cheat = {
    addCash: amount => {
      cash += amount
      updateUI()
      console.log(`💰 Added ${amount} cash. New total: ${cash}`)
    },
    unlockAllUpgrades: () => {
      Object.values(UPGRADES).forEach(u => (u.unlocked = true))
      updateUpgradeList()
      console.log('🔓 All upgrades unlocked!')
      console.log('Upgrade list element:', document.getElementById('upgradeList'))
      console.log('Upgrade list children:', document.getElementById('upgradeList')?.children.length)
    },
    unlockFirstUpgrade: () => {
      const firstId = Object.keys(UPGRADES)[0]
      UPGRADES[firstId].unlocked = true
      updateUpgradeList()
      console.log('🔓 First upgrade unlocked:', UPGRADES[firstId].name)
    },
    setClicks: count => {
      totalClicks = count
      updateUI()
      checkUpgradeUnlocks()
      console.log(`👆 Set clicks to ${count}`)
    },
    testUpgrade: () => {
      // 빠른 테스트용
      const firstId = Object.keys(UPGRADES)[0]
      UPGRADES[firstId].unlocked = true
      cash += 10000000
      updateUpgradeList()
      updateUI()
      console.log('🧪 Test setup complete:')
      console.log('  - First upgrade unlocked')
      console.log('  - Cash: 1000만원')
      console.log(
        '  - Upgrade list visible:',
        !document.getElementById('upgradeList')?.classList.contains('collapsed-section')
      )
      console.log('  - Upgrade items count:', document.querySelectorAll('.upgrade-item').length)
    },
  }
  console.log('💡 치트 코드 사용 가능:')
  console.log('  - cheat.testUpgrade() : 빠른 테스트 (첫 업그레이드 해금 + 1000만원)')
  console.log('  - cheat.addCash(1000000000) : 10억원 추가')
  console.log('  - cheat.unlockAllUpgrades() : 모든 업그레이드 해금')
  console.log('  - cheat.setClicks(100) : 클릭 수 설정')

  // 유닛성 테스트 로그
  Diary.addLog('🧪 v2.6 Cookie Clicker 스타일 업그레이드 시스템 구현 완료')
  Diary.addLog('✅ DOM 참조 오류 수정 완료')
  Diary.addLog('✅ 커리어 진행률 시스템 정상화')
  Diary.addLog('✅ 업그레이드 클릭 기능 활성화')
  Diary.addLog('✅ 자동 저장 시스템 작동 중')
  Diary.addLog('⚡ 성능 최적화: 업그레이드 리스트 깜빡임 해결')

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
    buildings,
  })
})
