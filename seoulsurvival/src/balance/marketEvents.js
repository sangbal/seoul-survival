/**
 * Seoul Survival - 시장 이벤트 밸런스 설정
 *
 * 이 파일에서 랜덤 시장 이벤트의 효과와 지속시간을 조정할 수 있습니다.
 *
 * 구조:
 * - name: 이벤트 이름
 * - duration: 지속 시간 (밀리초)
 * - color: UI 표시 색상
 * - effects: 카테고리별 수익 배수 (1.0 = 변화 없음)
 *   - financial: { deposit, savings, bond, usStock, crypto }
 *   - property: { villa, officetel, apartment, shop, building }
 * - description: 이벤트 설명
 */

export const MARKET_EVENTS = [
  // ===== 부동산 호재 이벤트 =====
  {
    name: '강남 아파트 대박',
    duration: 50_000,
    color: '#4CAF50',
    effects: {
      property: { apartment: 2.5, villa: 1.4, officetel: 1.2 },
    },
    description: '강남 아파트발 상승 랠리로 주거형 부동산 수익이 상승합니다.',
  },
  {
    name: '전세 대란',
    duration: 60_000,
    color: '#2196F3',
    effects: {
      property: { villa: 2.5, officetel: 2.5, apartment: 1.8 },
    },
    description: '전세 수요 급증으로 빌라/오피스텔 중심의 임대 수익이 급등합니다.',
  },
  {
    name: '상권 활성화',
    duration: 50_000,
    color: '#FF9800',
    effects: {
      property: { shop: 2.5, building: 1.6 },
    },
    description: '상권 회복으로 상가 수익이 크게 증가합니다.',
  },
  {
    name: '오피스 수요 급증',
    duration: 55_000,
    color: '#9C27B0',
    effects: {
      property: { building: 2.5, shop: 1.4, officetel: 1.2 },
    },
    description: '오피스 확장으로 빌딩 중심 수익이 급등합니다.',
  },

  // ===== 금융/리스크 자산 호재 이벤트 =====
  {
    name: '한국은행 금리 인하',
    duration: 70_000,
    color: '#2196F3',
    effects: {
      financial: { deposit: 0.7, savings: 0.8, bond: 2.0, usStock: 1.5 },
    },
    description: '금리 인하로 예금/적금은 약세, 주식은 강세를 보입니다.',
  },
  {
    name: '주식시장 대호황',
    duration: 60_000,
    color: '#4CAF50',
    effects: {
      financial: { bond: 2.5, usStock: 2.0, crypto: 1.5 },
    },
    description: '리스크 자산 선호로 주식 중심 수익이 크게 증가합니다.',
  },
  {
    name: '미국 연준 양적완화',
    duration: 70_000,
    color: '#2196F3',
    effects: {
      financial: { usStock: 2.5, crypto: 1.8, bond: 1.3 },
    },
    description: '달러 유동성 확대로 미국주식/코인 수익이 상승합니다.',
  },
  {
    name: '비트코인 급등',
    duration: 45_000,
    color: '#FF9800',
    effects: {
      financial: { crypto: 2.5, usStock: 1.2 },
    },
    description: '암호화폐 랠리로 코인 수익이 크게 증가합니다.',
  },

  // ===== 부정 이벤트 (강도 캡: 0.7) =====
  {
    name: '금융위기',
    duration: 90_000,
    color: '#F44336',
    effects: {
      financial: { bond: 0.7, usStock: 0.7, crypto: 0.7 },
      property: { shop: 0.7, building: 0.7 },
    },
    description: '리스크 회피로 주식/코인/상업용 부동산이 타격을 받습니다.',
  },
  {
    name: '은행 파산 위기',
    duration: 75_000,
    color: '#9C27B0',
    effects: {
      financial: { deposit: 0.7, savings: 0.7, bond: 0.8 },
    },
    description: '은행 신뢰 하락으로 예금/적금 수익이 둔화합니다.',
  },
  {
    name: '주식시장 폭락',
    duration: 75_000,
    color: '#F44336',
    effects: {
      financial: { bond: 0.7, usStock: 0.7, crypto: 0.7 },
    },
    description: '주식/리스크 자산 급락으로 수익이 크게 감소합니다.',
  },
  {
    name: '암호화폐 규제',
    duration: 75_000,
    color: '#9C27B0',
    effects: {
      financial: { crypto: 0.7 },
    },
    description: '규제 강화로 코인 수익이 감소합니다.',
  },
]

// ===== 이벤트 설정 (참고용) =====
// 이벤트 발생 로직은 main.js에서 관리
// 여기서는 이벤트 데이터만 정의
