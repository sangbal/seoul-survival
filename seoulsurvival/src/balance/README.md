# Seoul Survival 밸런스 설정

이 폴더에서 게임의 모든 수치 밸런스를 조정할 수 있습니다.

## 파일 구조

```
balance/
├── index.js          # 통합 export (import 시 사용)
├── career.js         # 직급 시스템
├── financial.js      # 금융상품 가격/수익
├── property.js       # 부동산 가격/수익
├── upgrades.js       # 업그레이드 비용/효과
└── marketEvents.js   # 시장 이벤트
```

## 주요 밸런스 값

### 1. 직급 시스템 (`career.js`)

```js
BASE_CLICK_GAIN = 10000 // 기본 클릭 수익 (1만원)

CAREER_LEVELS = [
  { nameKey: 'career.alba', multiplier: 1, requiredClicks: 0 }, // 알바
  { nameKey: 'career.contract', multiplier: 1.5, requiredClicks: 100 }, // 계약직
  // ... CEO까지 10단계
]
```

**조정 가능 값:**

- `multiplier`: 해당 직급의 클릭 수익 배수
- `requiredClicks`: 승진에 필요한 누적 클릭 수

### 2. 금융상품 (`financial.js`)

```js
FINANCIAL_COSTS = {
  deposit: 50_000, // 예금 가격
  savings: 500_000, // 적금 가격
  bond: 5_000_000, // 국내주식 가격
  usStock: 25_000_000, // 미국주식 가격
  crypto: 100_000_000, // 코인 가격
}

FINANCIAL_INCOME = {
  deposit: 50, // 예금 초당 수익
  savings: 750, // 적금 초당 수익
  bond: 11_250, // 국내주식 초당 수익
  usStock: 60_000, // 미국주식 초당 수익
  crypto: 250_000, // 코인 초당 수익
}
```

### 3. 부동산 (`property.js`)

```js
PROPERTY_COSTS = {
  villa: 250_000_000, // 빌라 2.5억
  officetel: 350_000_000, // 오피스텔 3.5억
  apartment: 800_000_000, // 아파트 8억
  shop: 1_200_000_000, // 상가 12억
  building: 3_000_000_000, // 빌딩 30억
  tower: 1_000_000_000_000, // 서울타워 1조
}

PROPERTY_RENT = {
  villa: 84_380, // 빌라 월세/초
  officetel: 177_190, // 오피스텔 월세/초
  apartment: 607_500, // 아파트 월세/초
  shop: 1_370_000, // 상가 월세/초
  building: 5_140_000, // 빌딩 월세/초
}
```

### 4. 업그레이드 (`upgrades.js`)

노동/금융/부동산/전역 업그레이드의 비용과 효과를 조정합니다.

```js
LABOR_UPGRADES = {
  part_time_job: { cost: 50_000, multiplier: 1.2, unlockLevel: 1 },
  // ...
}

FINANCIAL_UPGRADES = {
  deposit: [
    { name: '💰 예금 이자율 상승', cost: 100_000, unlockCount: 5, multiplier: 2 },
    // 5단계 업그레이드
  ],
  // ...
}
```

### 5. 시장 이벤트 (`marketEvents.js`)

랜덤 이벤트의 효과와 지속시간을 조정합니다.

```js
MARKET_EVENTS = [
  {
    name: '강남 아파트 대박',
    duration: 50_000, // 50초
    effects: {
      property: { apartment: 2.5, villa: 1.4 }, // 수익 배수
    },
  },
  // ...
]
```

## 밸런스 조정 가이드

### 게임 난이도 조정

**쉽게 만들기:**

- `BASE_CLICK_GAIN` 증가
- 승진 `requiredClicks` 감소
- 상품 가격 감소, 수익 증가

**어렵게 만들기:**

- `BASE_CLICK_GAIN` 감소
- 승진 `requiredClicks` 증가
- 상품 가격 증가, 수익 감소

### ROI(투자 수익률) 계산

```
ROI(초) = 가격 / 초당 수익
ROI(분) = ROI(초) / 60
```

예: 예금 ROI = 50,000 / 50 = 1,000초 (약 16.7분)

### 권장 ROI 범위

- 금융상품: 5~15분 (빠른 회수)
- 부동산: 10~50분 (느린 회수, 높은 절대 수익)

## 적용 상태

✅ **main.js가 balance 폴더에서 값을 import하도록 리팩토링 완료!**

```js
// main.js 상단에 추가됨
import {
  BASE_CLICK_GAIN,
  CAREER_LEVELS as CAREER_BALANCE,
  FINANCIAL_COSTS,
  DEFAULT_FINANCIAL_INCOME,
  BASE_COSTS,
  DEFAULT_BASE_RENT,
  MARKET_EVENTS,
} from './balance/index.js'
```

**이제 balance 폴더의 값을 수정하면 자동으로 게임에 적용됩니다!**

### 수정 가능 항목

| 파일              | 수정 → 효과                                           |
| ----------------- | ----------------------------------------------------- |
| `career.js`       | `CAREER_LEVELS` 배열 수정 → 승진 조건/클릭 배수 변경  |
| `financial.js`    | `FINANCIAL_COSTS` 수정 → 금융상품 가격 변경           |
| `financial.js`    | `DEFAULT_FINANCIAL_INCOME` 수정 → 금융상품 수익 변경  |
| `property.js`     | `BASE_COSTS` 수정 → 부동산 가격 변경                  |
| `property.js`     | `DEFAULT_BASE_RENT` 수정 → 부동산 월세 변경           |
| `marketEvents.js` | `MARKET_EVENTS` 수정 → 시장 이벤트 효과/지속시간 변경 |

### 주의사항

- UPGRADES는 아직 main.js에 정의되어 있음 (effect 함수가 로컬 변수 참조)
- balance 폴더의 `upgrades.js`는 참고용 문서 역할

## 테스트 체크리스트

밸런스 수정 후 다음을 확인하세요:

- [ ] 게임 시작 가능
- [ ] 클릭 수익 정상 표시
- [ ] 승진 정상 작동
- [ ] 금융상품 구매/판매 정상
- [ ] 부동산 구매/판매 정상
- [ ] 업그레이드 구매 정상
- [ ] 시장 이벤트 발생/효과 정상
- [ ] 저장/불러오기 정상
