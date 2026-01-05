/**
 * Seoul Survival - 밸런스 설정 통합 모듈
 *
 * 이 폴더에서 게임의 모든 수치 밸런스를 조정할 수 있습니다.
 *
 * 파일 구조:
 * - career.js     : 직급(승진) 시스템 - 클릭 배수, 승진 조건
 * - financial.js  : 금융상품 - 가격, 초당 수익
 * - property.js   : 부동산 - 가격, 월세 수익
 * - upgrades.js   : 업그레이드 - 비용, 효과, 해금 조건
 * - marketEvents.js : 시장 이벤트 - 효과, 지속시간
 *
 * 사용법:
 * ```js
 * import { BASE_CLICK_GAIN, FINANCIAL_COSTS, BASE_COSTS } from './balance/index.js';
 * ```
 */

// 직급 시스템
export { BASE_CLICK_GAIN, CAREER_LEVELS } from './career.js'

// 금융상품
export {
  FINANCIAL_COSTS,
  DEFAULT_FINANCIAL_INCOME,
  FINANCIAL_COST_GROWTH,
  FINANCIAL_SELL_RATE,
} from './financial.js'

// 부동산
export {
  BASE_COSTS,
  DEFAULT_BASE_RENT,
  PROPERTY_COST_GROWTH,
  PROPERTY_SELL_RATE,
  TOWER_CONFIG,
} from './property.js'

// 업그레이드 (참고용 - main.js에서 직접 사용하려면 리팩토링 필요)
export {
  LABOR_UPGRADES,
  FINANCIAL_UPGRADES,
  PROPERTY_UPGRADES,
  GLOBAL_UPGRADES,
  UNLOCK_CHAIN,
} from './upgrades.js'

// 시장 이벤트
export { MARKET_EVENTS } from './marketEvents.js'
