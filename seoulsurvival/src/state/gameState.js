/**
 * Seoul Survival - Game State
 *
 * 게임의 모든 상태 변수를 중앙 관리
 * - 통화 및 자산
 * - 보유 상품 (금융/부동산)
 * - 경제 배수
 * - 커리어 시스템
 * - 시장 이벤트
 * - 업적 및 설정
 */

import { CAREER_LEVELS as CAREER_BALANCE, BASE_CLICK_GAIN } from '../balance/index.js'
import { DEFAULT_FINANCIAL_INCOME, DEFAULT_BASE_RENT } from '../balance/index.js'

// Vite asset imports for career backgrounds
import workBg01 from '../../assets/images/work_bg_01_alba_night.png'
import workBg02 from '../../assets/images/work_bg_02_gyeyakjik_night.png'
import workBg03 from '../../assets/images/work_bg_03_sawon_night.png'
import workBg04 from '../../assets/images/work_bg_04_daeri_night.png'
import workBg05 from '../../assets/images/work_bg_05_gwajang_night.png'
import workBg06 from '../../assets/images/work_bg_06_chajang_night.png'
import workBg07 from '../../assets/images/work_bg_07_bujang_night.png'
import workBg08 from '../../assets/images/work_bg_08_sangmu_night.png'
import workBg09 from '../../assets/images/work_bg_09_jeonmu_night.png'
import workBg10 from '../../assets/images/work_bg_10_ceo_night.png'

// 직급별 배경 이미지 배열
const careerBgImages = [
  workBg01,
  workBg02,
  workBg03,
  workBg04,
  workBg05,
  workBg06,
  workBg07,
  workBg08,
  workBg09,
  workBg10,
]

// CAREER_LEVELS: balance/career.js에서 import된 CAREER_BALANCE에 bgImage 병합
export const CAREER_LEVELS = CAREER_BALANCE.map((level, idx) => ({
  ...level,
  bgImage: careerBgImages[idx],
}))

// 저장 키 상수
export const SAVE_KEY = 'seoulTycoonSaveV1'
export const CLOUD_RESTORE_BLOCK_KEY = 'ss_blockCloudRestoreUntilNicknameDone'
export const CLOUD_RESTORE_SKIP_KEY = 'ss_skipCloudRestoreOnce'
export const SETTINGS_KEY = 'capitalClicker_settings'

// ======= 게임 상태 객체 =======
// 모든 게임 상태를 하나의 객체로 관리
// main.js에서 import하여 직접 접근/수정 가능
export const gameState = {
  // 통화 및 시간
  cash: 0,
  totalPlayTime: 0, // 누적 플레이시간 (밀리초)
  sessionStartTime: Date.now(), // 현재 세션 시작 시간
  gameStartTime: Date.now(), // 게임 시작 시간 (호환성 유지)
  lastSaveTime: new Date(),

  // 금융상품 보유 수량
  deposits: 0, // 예금
  savings: 0, // 적금
  bonds: 0, // 국내주식
  usStocks: 0, // 미국주식
  cryptos: 0, // 코인

  // 금융상품 누적 생산량 (Cookie Clicker 스타일)
  depositsLifetime: 0,
  savingsLifetime: 0,
  bondsLifetime: 0,
  usStocksLifetime: 0,
  cryptosLifetime: 0,

  // 부동산 보유 수량
  villas: 0, // 빌라
  officetels: 0, // 오피스텔
  apartments: 0, // 아파트
  shops: 0, // 상가
  buildings: 0, // 빌딩
  towers_run: 0, // 서울타워 (현재 런에서 획득)
  towers_lifetime: 0, // 서울타워 (계정 누적, 프레스티지 유지)

  // 부동산 누적 생산량
  villasLifetime: 0,
  officetelsLifetime: 0,
  apartmentsLifetime: 0,
  shopsLifetime: 0,
  buildingsLifetime: 0,

  // 구매 수량 선택 시스템
  purchaseMode: 'buy', // 'buy' or 'sell'
  purchaseQuantity: 1, // 1, 10, 100

  // 닉네임 (리더보드용)
  playerNickname: '',
  __nicknameModalShown: false, // 닉네임 모달 세션 플래그

  // 해금 상태 추적 (순차 해금 시스템)
  unlockedProducts: {
    deposit: true,
    savings: false,
    bond: false,
    usStock: false,
    crypto: false,
    villa: false,
    officetel: false,
    apartment: false,
    shop: false,
    building: false,
    tower: false,
  },

  // 경제 배수
  clickMultiplier: 1, // 노동 효율 배수
  rentMultiplier: 1, // 월세 수익 배수
  autoClickEnabled: false, // 자동 클릭 활성화 여부
  managerLevel: 0, // 관리인 레벨

  // 업그레이드 비용
  rentCost: 1000000000, // 월세 수익률 업: 10억원
  mgrCost: 5000000000, // 관리인 고용: 50억원

  // 노동 커리어 시스템
  careerLevel: 0, // 현재 커리어 레벨
  totalLaborIncome: 0, // 총 노동 수익

  // 부동산 시장 이벤트 시스템
  marketMultiplier: 1.0, // 시장 수익 배수
  marketEventEndTime: 0, // 이벤트 종료 시간
  currentMarketEvent: null, // 현재 시장 이벤트

  // 업적 시스템
  totalClicks: 0, // 총 클릭 수 추적

  // 설정 옵션
  settings: {
    particles: true, // 파티클 애니메이션
    fancyGraphics: true, // 화려한 그래픽
    shortNumbers: false, // 짧은 숫자 표시 (기본값: 끔)
  },
}

// ======= 수익 테이블 (업그레이드로 변경 가능) =======
// 업그레이드로 변경 가능하도록 mutable copy 생성
export const FINANCIAL_INCOME = { ...DEFAULT_FINANCIAL_INCOME }
export const BASE_RENT = { ...DEFAULT_BASE_RENT }

/**
 * 수익 테이블을 초기값으로 리셋
 * 로드 시 업그레이드 효과 중복 적용 방지용
 */
export function resetIncomeTablesToDefault() {
  for (const k of Object.keys(DEFAULT_FINANCIAL_INCOME)) {
    FINANCIAL_INCOME[k] = DEFAULT_FINANCIAL_INCOME[k]
  }
  for (const k of Object.keys(DEFAULT_BASE_RENT)) {
    BASE_RENT[k] = DEFAULT_BASE_RENT[k]
  }
}

/**
 * 수익 테이블에 영향을 주는 업그레이드 효과를 재적용
 * @param {Object} UPGRADES - 업그레이드 객체 (main.js에서 전달)
 */
export function reapplyIncomeTableAffectingUpgradeEffects(UPGRADES) {
  resetIncomeTablesToDefault()

  for (const upgrade of Object.values(UPGRADES)) {
    if (!upgrade?.purchased || typeof upgrade.effect !== 'function') continue

    // clickMultiplier/rentMultiplier 등 "저장되는 상태"에 대한 effect는 중복 적용 위험이 있어 제외한다.
    // 반면 FINANCIAL_INCOME / BASE_RENT는 저장되지 않으므로, 여기에만 영향을 주는 업그레이드는 재적용이 필요하다.
    const src = Function.prototype.toString.call(upgrade.effect)
    const affectsIncomeTables = src.includes('FINANCIAL_INCOME') || src.includes('BASE_RENT')
    if (!affectsIncomeTables) continue

    try {
      upgrade.effect()
    } catch {
      // 업그레이드 effect 실패는 무시(로드/진행 유지)
    }
  }
}

// ======= 유틸리티 함수 =======

/**
 * 총 금융상품 개수 계산
 */
export function getTotalFinancialProducts() {
  return (
    gameState.deposits +
    gameState.savings +
    gameState.bonds +
    gameState.usStocks +
    gameState.cryptos
  )
}

/**
 * 총 부동산 개수 계산
 */
export function getTotalProperties() {
  return (
    gameState.villas +
    gameState.officetels +
    gameState.apartments +
    gameState.shops +
    gameState.buildings
  )
}

// Re-export constants for convenience
export { BASE_CLICK_GAIN }
