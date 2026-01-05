/**
 * Seoul Survival - 업그레이드 밸런스 설정
 *
 * 이 파일에서 업그레이드의 비용과 효과 배수를 조정할 수 있습니다.
 *
 * 구조:
 * - LABOR_UPGRADES: 노동(클릭) 관련 업그레이드
 * - FINANCIAL_UPGRADES: 금융상품별 수익 업그레이드
 * - PROPERTY_UPGRADES: 부동산별 수익 업그레이드
 * - GLOBAL_UPGRADES: 전역 효과 업그레이드
 */

// ===== 노동 업그레이드 (클릭 수익 배수) =====
// unlockLevel: 해금에 필요한 직급 레벨 (0=알바, 1=계약직, ..., 9=CEO)
// multiplier: 클릭 수익에 곱해지는 배수
export const LABOR_UPGRADES = {
  part_time_job: {
    name: '🍕 아르바이트 경험',
    desc: '클릭 수익 1.2배',
    cost: 50_000,
    multiplier: 1.2,
    unlockLevel: 1, // 계약직
  },
  internship: {
    name: '📝 인턴십',
    desc: '클릭 수익 1.2배',
    cost: 200_000,
    multiplier: 1.2,
    unlockLevel: 2, // 사원
  },
  efficient_work: {
    name: '⚡ 효율적인 업무 처리',
    desc: '클릭 수익 1.2배',
    cost: 500_000,
    multiplier: 1.2,
    unlockLevel: 3, // 대리
  },
  focus_training: {
    name: '🎯 집중력 강화',
    desc: '클릭 수익 1.2배',
    cost: 2_000_000,
    multiplier: 1.2,
    unlockLevel: 4, // 과장
  },
  professional_education: {
    name: '📚 전문 교육',
    desc: '클릭 수익 1.2배',
    cost: 10_000_000,
    multiplier: 1.2,
    unlockLevel: 5, // 차장
  },
  performance_bonus: {
    name: '💰 성과급',
    desc: '2% 확률로 10배 수익',
    cost: 10_000_000,
    // 특수: 확률형 효과 (bonusChance, bonusMultiplier)
    bonusChance: 0.02, // 2%
    bonusMultiplier: 10, // 10배
    unlockLevel: 6, // 부장
  },
  career_recognition: {
    name: '💼 경력 인정',
    desc: '클릭 수익 1.2배',
    cost: 30_000_000,
    multiplier: 1.2,
    unlockLevel: 6, // 부장
  },
  overtime_work: {
    name: '🔥 초과근무',
    desc: '클릭 수익 1.2배',
    cost: 50_000_000,
    multiplier: 1.2,
    unlockLevel: 7, // 상무
  },
  honor_award: {
    name: '🎖️ 명예상',
    desc: '클릭 수익 1.2배',
    cost: 100_000_000,
    multiplier: 1.2,
    unlockLevel: 7, // 상무
  },
  expertise_development: {
    name: '💎 전문성 개발',
    desc: '클릭 수익 1.2배',
    cost: 200_000_000,
    multiplier: 1.2,
    unlockLevel: 8, // 전무
  },
  teamwork: {
    name: '🤝 팀워크 향상',
    desc: '클릭 수익 1.2배',
    cost: 500_000_000,
    multiplier: 1.2,
    unlockLevel: 8, // 전무
  },
  leadership: {
    name: '👑 리더십',
    desc: '클릭 수익 1.2배',
    cost: 2_000_000_000,
    multiplier: 1.2,
    unlockLevel: 8, // 전무
  },
  ceo_privilege: {
    name: '👔 CEO 특권',
    desc: '클릭 수익 2.0배',
    cost: 10_000_000_000,
    multiplier: 2.0,
    unlockLevel: 9, // CEO
  },
  global_experience: {
    name: '🌍 글로벌 경험',
    desc: '클릭 수익 2.0배',
    cost: 50_000_000_000,
    multiplier: 2.0,
    unlockLevel: 9,
    unlockClicks: 15000, // CEO + 15,000클릭
  },
  entrepreneurship: {
    name: '🚀 창업',
    desc: '클릭 수익 2.0배',
    cost: 100_000_000_000,
    multiplier: 2.0,
    unlockLevel: 9,
    unlockClicks: 30000, // CEO + 30,000클릭
  },
}

// ===== 금융상품 업그레이드 (각 상품 수익 2배) =====
// unlockCount: 해금에 필요한 해당 상품 보유 개수
// multiplier: 해당 상품 수익에 곱해지는 배수 (기본 2배)
export const FINANCIAL_UPGRADES = {
  // 예금 (기본가 5만원)
  deposit: [
    { name: '💰 예금 이자율 상승', cost: 100_000, unlockCount: 5, multiplier: 2 },
    { name: '💎 프리미엄 예금', cost: 250_000, unlockCount: 15, multiplier: 2 },
    { name: '💠 다이아몬드 예금', cost: 500_000, unlockCount: 30, multiplier: 2 },
    { name: '💍 플래티넘 예금', cost: 1_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 예금', cost: 2_000_000, unlockCount: 50, multiplier: 2 },
  ],
  // 적금 (기본가 50만원)
  savings: [
    { name: '🏦 적금 복리 효과', cost: 1_000_000, unlockCount: 5, multiplier: 2 },
    { name: '🏅 골드 적금', cost: 2_500_000, unlockCount: 15, multiplier: 2 },
    { name: '💍 플래티넘 적금', cost: 5_000_000, unlockCount: 30, multiplier: 2 },
    { name: '💠 다이아몬드 적금', cost: 10_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 적금', cost: 20_000_000, unlockCount: 50, multiplier: 2 },
  ],
  // 국내주식 (기본가 500만원)
  bond: [
    { name: '📈 주식 수익률 향상', cost: 10_000_000, unlockCount: 5, multiplier: 2 },
    { name: '💹 프리미엄 주식', cost: 25_000_000, unlockCount: 15, multiplier: 2 },
    { name: '📊 블루칩 주식', cost: 50_000_000, unlockCount: 30, multiplier: 2 },
    { name: '💎 대형주 포트폴리오', cost: 100_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 주식', cost: 200_000_000, unlockCount: 50, multiplier: 2 },
  ],
  // 미국주식 (기본가 2,500만원)
  usStock: [
    { name: '🇺🇸 S&P 500 투자', cost: 50_000_000, unlockCount: 5, multiplier: 2 },
    { name: '📈 나스닥 투자', cost: 125_000_000, unlockCount: 15, multiplier: 2 },
    { name: '💎 글로벌 주식 포트폴리오', cost: 250_000_000, unlockCount: 30, multiplier: 2 },
    { name: '🌍 글로벌 대형주', cost: 500_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 글로벌 주식', cost: 1_000_000_000, unlockCount: 50, multiplier: 2 },
  ],
  // 코인 (기본가 1억원)
  crypto: [
    { name: '₿ 비트코인 투자', cost: 200_000_000, unlockCount: 5, multiplier: 2 },
    { name: '💎 알트코인 포트폴리오', cost: 500_000_000, unlockCount: 15, multiplier: 2 },
    { name: '🚀 디지털 자산 전문가', cost: 1_000_000_000, unlockCount: 30, multiplier: 2 },
    { name: '🌐 메타버스 자산', cost: 2_000_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 암호화폐', cost: 4_000_000_000, unlockCount: 50, multiplier: 2 },
  ],
}

// ===== 부동산 업그레이드 (각 상품 수익 2배) =====
export const PROPERTY_UPGRADES = {
  // 빌라 (기본가 2.5억원)
  villa: [
    { name: '🏘️ 빌라 리모델링', cost: 500_000_000, unlockCount: 5, multiplier: 2 },
    { name: '🌟 럭셔리 빌라', cost: 1_250_000_000, unlockCount: 15, multiplier: 2 },
    { name: '✨ 프리미엄 빌라 단지', cost: 2_500_000_000, unlockCount: 30, multiplier: 2 },
    { name: '💎 다이아몬드 빌라', cost: 5_000_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 빌라', cost: 10_000_000_000, unlockCount: 50, multiplier: 2 },
  ],
  // 오피스텔 (기본가 3.5억원)
  officetel: [
    { name: '🏢 오피스텔 스마트화', cost: 700_000_000, unlockCount: 5, multiplier: 2 },
    { name: '🏙️ 프리미엄 오피스텔', cost: 1_750_000_000, unlockCount: 15, multiplier: 2 },
    { name: '🌆 럭셔리 오피스텔 타워', cost: 3_500_000_000, unlockCount: 30, multiplier: 2 },
    { name: '💎 다이아몬드 오피스텔', cost: 7_000_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 오피스텔', cost: 14_000_000_000, unlockCount: 50, multiplier: 2 },
  ],
  // 아파트 (기본가 8억원)
  apartment: [
    { name: '🏡 아파트 프리미엄화', cost: 1_600_000_000, unlockCount: 5, multiplier: 2 },
    { name: '🏰 타워팰리스급 아파트', cost: 4_000_000_000, unlockCount: 15, multiplier: 2 },
    { name: '🏛️ 초고급 아파트 단지', cost: 8_000_000_000, unlockCount: 30, multiplier: 2 },
    { name: '💎 다이아몬드 아파트', cost: 16_000_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 아파트', cost: 32_000_000_000, unlockCount: 50, multiplier: 2 },
  ],
  // 상가 (기본가 12억원)
  shop: [
    { name: '🏪 상가 입지 개선', cost: 2_400_000_000, unlockCount: 5, multiplier: 2 },
    { name: '🛍️ 프리미엄 상권', cost: 6_000_000_000, unlockCount: 15, multiplier: 2 },
    { name: '🏬 메가몰 상권', cost: 12_000_000_000, unlockCount: 30, multiplier: 2 },
    { name: '💎 다이아몬드 상권', cost: 24_000_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 상권', cost: 48_000_000_000, unlockCount: 50, multiplier: 2 },
  ],
  // 빌딩 (기본가 30억원)
  building: [
    { name: '🏙️ 빌딩 테넌트 확보', cost: 6_000_000_000, unlockCount: 5, multiplier: 2 },
    { name: '💼 랜드마크 빌딩', cost: 15_000_000_000, unlockCount: 15, multiplier: 2 },
    { name: '🏢 초고층 마천루', cost: 30_000_000_000, unlockCount: 30, multiplier: 2 },
    { name: '💎 다이아몬드 빌딩', cost: 60_000_000_000, unlockCount: 40, multiplier: 2 },
    { name: '👑 킹 빌딩', cost: 120_000_000_000, unlockCount: 50, multiplier: 2 },
  ],
}

// ===== 전역 업그레이드 =====
export const GLOBAL_UPGRADES = {
  rent_multiplier: {
    name: '📊 부동산 관리 전문화',
    desc: '모든 부동산 수익 +10%',
    cost: 1_000_000_000,
    rentMultiplier: 1.1,
    unlockProperties: 10, // 총 부동산 10개 이상
  },
  manager_hire: {
    name: '👨‍💼 전문 관리인 고용',
    desc: '전체 임대 수익 +5%',
    cost: 5_000_000_000,
    rentMultiplier: 1.05,
    unlockProperties: 20, // 총 부동산 20개 이상
  },
  financial_expert: {
    name: '💼 금융 전문가 고용',
    desc: '모든 금융 수익 +20%',
    cost: 10_000_000_000,
    financialMultiplier: 1.2, // 모든 금융상품 수익 × 1.2
    unlockLevel: 8, // 전무
  },
  auto_work_system: {
    name: '🤖 AI 업무 처리 시스템',
    desc: '1초마다 자동으로 1회 클릭',
    cost: 5_000_000_000,
    autoClicksPerSecond: 1,
    unlockLevel: 7, // 상무
    unlockProperties: 10, // + 부동산 10개 이상
  },
}

// ===== 상품 해금 체인 =====
// 각 상품을 구매하기 위해 필요한 선행 상품과 개수
export const UNLOCK_CHAIN = {
  // 금융상품 해금 순서
  deposit: { required: null, count: 0 }, // 항상 해금
  savings: { required: 'deposit', count: 1 }, // 예금 1개
  bond: { required: 'savings', count: 1 }, // 적금 1개
  usStock: { required: 'bond', count: 1 }, // 국내주식 1개
  crypto: { required: 'usStock', count: 1 }, // 미국주식 1개

  // 부동산 해금 순서
  villa: { required: 'crypto', count: 1 }, // 코인 1개
  officetel: { required: 'villa', count: 1 }, // 빌라 1개
  apartment: { required: 'officetel', count: 1 }, // 오피스텔 1개
  shop: { required: 'apartment', count: 1 }, // 아파트 1개
  building: { required: 'shop', count: 1 }, // 상가 1개
  tower: { required: 'building', count: 1 }, // 빌딩 1개
}

// ===== 참고: 최대 클릭 배수 계산 =====
// 노동 업그레이드 전체 구매 시 총 배수:
// 1.2^12 × 2.0^3 = 8.916 × 8 = 71.33배
//
// CEO 최종 클릭 수익:
// BASE_CLICK_GAIN × careerMultiplier × clickMultiplier
// = 10,000 × 12 × 71.33 = 8,559,600원/클릭
