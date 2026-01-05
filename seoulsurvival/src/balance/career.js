/**
 * Seoul Survival - 직급(커리어) 밸런스 설정
 *
 * 이 파일에서 직급별 승진 조건과 수익 배수를 조정할 수 있습니다.
 *
 * - nameKey: i18n 키 (번역 파일에서 실제 이름 정의)
 * - multiplier: 기본 클릭 수익(BASE_CLICK_GAIN)에 곱해지는 배수
 * - requiredIncome: 승진에 필요한 누적 수익 (현재 미사용, 참고용)
 * - requiredClicks: 승진에 필요한 누적 클릭 수
 */

// 기본 클릭 수익 (2024년 최저시급 기준: 10,000원)
export const BASE_CLICK_GAIN = 10000

// 직급 레벨 정의
// 실제 클릭당 수익 = BASE_CLICK_GAIN * multiplier * clickMultiplier(업그레이드)
export const CAREER_LEVELS = [
  // 레벨 0: 알바
  {
    nameKey: 'career.alba',
    multiplier: 1, // 1만원/클릭
    requiredIncome: 0,
    requiredClicks: 0,
  },
  // 레벨 1: 계약직
  {
    nameKey: 'career.contract',
    multiplier: 1.5, // 1.5만원/클릭
    requiredIncome: 5_000_000,
    requiredClicks: 100,
  },
  // 레벨 2: 사원
  {
    nameKey: 'career.employee',
    multiplier: 2, // 2만원/클릭
    requiredIncome: 10_000_000,
    requiredClicks: 300,
  },
  // 레벨 3: 대리
  {
    nameKey: 'career.assistant',
    multiplier: 2.5, // 2.5만원/클릭
    requiredIncome: 20_000_000,
    requiredClicks: 700,
  },
  // 레벨 4: 과장
  {
    nameKey: 'career.manager',
    multiplier: 3, // 3만원/클릭
    requiredIncome: 30_000_000,
    requiredClicks: 1200,
  },
  // 레벨 5: 차장
  {
    nameKey: 'career.deputy',
    multiplier: 3.5, // 3.5만원/클릭
    requiredIncome: 40_000_000,
    requiredClicks: 2000,
  },
  // 레벨 6: 부장
  {
    nameKey: 'career.director',
    multiplier: 4, // 4만원/클릭
    requiredIncome: 50_000_000,
    requiredClicks: 3500,
  },
  // 레벨 7: 상무
  {
    nameKey: 'career.executive',
    multiplier: 5, // 5만원/클릭
    requiredIncome: 70_000_000,
    requiredClicks: 5000,
  },
  // 레벨 8: 전무
  {
    nameKey: 'career.senior',
    multiplier: 10, // 10만원/클릭
    requiredIncome: 120_000_000,
    requiredClicks: 8000,
  },
  // 레벨 9: CEO (최종)
  {
    nameKey: 'career.ceo',
    multiplier: 12, // 12만원/클릭
    requiredIncome: 250_000_000,
    requiredClicks: 12000,
  },
]

// 승진 곡선 시각화 (참고용 주석)
// 클릭 수:   0 → 100 → 300 → 800 → 1500 → 2500 → 4000 → 6000 → 9000 → 15000
// 직급:    알바 → 계약직 → 사원 → 대리 → 과장 → 차장 → 부장 → 상무 → 전무 → CEO
// 배수:     1x → 1.5x → 2x → 2.5x → 3x → 3.5x → 4x → 5x → 10x → 12x
