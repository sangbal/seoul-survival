# 독백 풀 다양성 부족 문제 분석 및 개선안

## Executive Summary

현재 일기장 독백 풀은 각 이벤트 유형당 3~5개로 제한적이며, 장기 플레이 시 반복이 느껴집니다. 본 문서는 현재 상태를 정량 분석하고, 다양성을 확보하기 위한 구체적인 개선 방안을 제시합니다.

## 핵심 질문

- 현재 독백 풀의 실제 크기는?
- 장기 플레이 시 반복 빈도는?
- 다양성을 확보하는 방법은?

## 현재 상태 분석

### 독백 풀 크기 현황

| 이벤트 유형 | 독백 풀 크기 | 상품별 세분화 | 총 가능 조합 |
|------------|------------|-------------|------------|
| **업적 달성** | 5개 | 없음 | 5개 |
| **승진** | 5개 | 없음 | 5개 |
| **해금** | 2~3개 | 9개 상품 | ~25개 |
| **구매** | 3개 | 10개 상품 | ~30개 |
| **판매** | 2~3개 | 10개 상품 | ~25개 |
| **자금 부족** | 4개 | 없음 | 4개 |
| **시장 이벤트 발생** | 2~4개 | 11개 상품 | ~35개 |
| **시장 이벤트 종료** | 2~3개 | 5개 카테고리 | ~12개 |
| **시장 이벤트 메모** | 1~2개 | 7개 카테고리 | ~12개 |
| **업그레이드 해금** | 2개 | 12개 카테고리 | ~24개 |
| **업그레이드 구매** | 2개 | 12개 카테고리 | ~24개 |
| **경고** | 3개 | 없음 | 3개 |
| **기본** | 4개 | 없음 | 4개 |

**총 독백 풀 크기**: 약 **230개** (상품별 조합 포함)

### 반복 빈도 시뮬레이션

#### 시나리오: 중반 플레이어 (100회 구매 이벤트 발생)

**예금 구매 독백 풀**: 3개
- 100회 구매 시 각 독백이 평균 **33.3회** 반복
- 10회 구매만 해도 이미 반복이 시작됨

**국내주식 구매 독백 풀**: 3개
- 50회 구매 시 각 독백이 평균 **16.7회** 반복

**시장 이벤트 발생 독백 풀**: 3개 (국내주식 기준)
- 30회 이벤트 시 각 독백이 평균 **10회** 반복

#### 문제점

1. **초반부터 반복**: 10~20회 이벤트만 발생해도 동일 독백 반복
2. **기계적 느낌**: 동일 패턴이 반복되어 일기장의 감성적 요소 약화
3. **장기 플레이 저해**: 반복으로 인한 지루함으로 일기장 관심 저하

---

## 근본 원인 분석

### 1. 하드코딩된 독백 풀

#### 현황
```javascript
// seoulsurvival/src/main.js 라인 2311~2315
const buyByProduct = {
  '예금': [
    `일단은 안전한 데에 묶어두자.\n${body}`,
    `불안할 땐 예금이 답이다.\n${body}`,
    `통장에 '쿠션'을 하나 깔았다.\n${body}`,
  ],
  // ... 각 상품당 3개씩
};
```

**문제점**:
- 독백이 코드에 하드코딩되어 있음
- 새로운 독백 추가 시 코드 수정 필요
- 확장성이 낮음

### 2. 정적 배열 구조

#### 현황
- 모든 독백이 정적 배열로 정의됨
- 동적 생성/조합 로직 없음
- 컨텍스트 기반 변형 없음

**문제점**:
- 게임 상태(자산, 직급, 플레이 시간 등)를 반영하지 않음
- 수량, 가격 등 변수를 활용한 동적 독백 생성 없음

### 3. 중복 방지의 한계

#### 현황
```javascript
// seoulsurvival/src/main.js 라인 2194~2204
const pick = (key, arr) => {
  const storeKey = `__diaryLastPick_${key}`;
  const last = window[storeKey];
  let idx = rand(arr.length);
  if (arr.length > 1 && typeof last === 'number' && idx === last) {
    idx = (idx + 1 + rand(arr.length - 1)) % arr.length;
  }
  window[storeKey] = idx;
  return arr[idx];
};
```

**문제점**:
- 연속 동일 선택만 방지
- 전체 사용 이력 추적 없음
- 장기적으로는 반복 불가피

---

## 개선안 제시

### 방안 1: 독백 풀 확장 (단기)

#### 목표
각 이벤트 유형당 독백 풀을 3~5개에서 **10~15개**로 확장

#### 구현 방안
```javascript
const buyByProduct = {
  '예금': [
    `일단은 안전한 데에 묶어두자.\n${body}`,
    `불안할 땐 예금이 답이다.\n${body}`,
    `통장에 '쿠션'을 하나 깔았다.\n${body}`,
    // 추가 독백 7~12개
    `안전함이 최고의 수익률.\n${body}`,
    `무엇보다도 평온함.\n${body}`,
    `돈이 잠들어 있는 게 나쁘지 않다.\n${body}`,
    `은행이 내 편이 되는 순간.\n${body}`,
    `위험은 내일로 미뤄두자.\n${body}`,
    `조용히 쌓이는 게 좋다.\n${body}`,
    `불안할 때는 이게 최선.\n${body}`,
    `돈이 안전하게 지켜지는 느낌.\n${body}`,
    `위험 없는 선택.\n${body}`,
    `은행 통장이 따뜻해 보인다.\n${body}`,
  ],
  // ... 다른 상품도 동일하게 확장
};
```

#### 예상 효과
- 반복 빈도 감소: 3개 → 12개로 4배 감소
- 100회 구매 시 각 독백이 평균 **8.3회** 반복 (기존 33.3회 대비 75% 감소)

#### 작업량
- **높음**: 각 이벤트 유형당 7~10개 독백 추가 필요
- 총 약 **150~200개** 독백 작성 필요
- 예상 시간: 10~15시간

#### 우선순위
- **중간**: 효과는 크나 작업량이 많음

---

### 방안 2: 동적 독백 생성 (중기)

#### 목표
게임 상태를 반영하여 독백을 동적으로 생성

#### 구현 방안

##### 2.1 변수 기반 템플릿
```javascript
function generateBuyDiary(product, body, context) {
  const templates = {
    '예금': [
      `일단은 안전한 데에 묶어두자.\n${body}`,
      `불안할 땐 예금이 답이다.\n${body}`,
      // ... 기본 풀
    ],
    // 동적 생성
    '예금_dynamic': [
      () => `예금 ${context.count}개째. 안전함의 무게가 느껴진다.\n${body}`,
      () => `통장 잔고가 ${formatKoreanNumber(context.cash)}원. 여유가 생겼다.\n${body}`,
      () => `직급이 ${context.career}인데도 예금은 여전히 편하다.\n${body}`,
    ],
  };
  
  // 기본 풀과 동적 풀을 섞어서 사용
  const pool = [
    ...templates[product],
    ...templates[`${product}_dynamic`].map(t => typeof t === 'function' ? t() : t)
  ];
  
  return pick(`buy_${product}`, pool);
}
```

##### 2.2 컨텍스트 기반 변형
```javascript
function getDiaryContext() {
  return {
    cash: cash,
    totalAssets: getTotalAssets(),
    career: CAREER_LEVELS[careerLevel]?.name || '알바',
    playTime: Math.floor(totalPlayTime / 3600000), // 시간
    deposits: deposits,
    // ... 기타 게임 상태
  };
}

// 사용 예시
const context = getDiaryContext();
const diary = generateBuyDiary('예금', body, context);
```

#### 예상 효과
- 독백 풀 크기가 **2~3배 증가** (기본 + 동적)
- 게임 상태를 반영하여 더 개인화된 독백
- 반복 빈도 추가 감소

#### 작업량
- **중간**: 템플릿 시스템 구축 + 동적 생성 로직
- 예상 시간: 5~8시간

#### 우선순위
- **높음**: 효과 대비 작업량이 적절함

---

### 방안 3: 조합형 독백 시스템 (장기)

#### 목표
독백을 "주제 + 감정 + 액션"으로 분해하여 조합

#### 구현 방안

##### 3.1 독백 컴포넌트 분리
```javascript
const diaryComponents = {
  'buy_ex금_theme': [
    '안전한 데에 묶어두자',
    '불안할 땐 예금이 답',
    '통장에 쿠션을 깔다',
    '평온함이 최고의 수익률',
    // ... 10~15개 주제
  ],
  'buy_ex금_emotion': [
    '마음이 놓인다',
    '안심이 된다',
    '편안해진다',
    '여유가 생긴다',
    // ... 10개 감정
  ],
  'buy_ex금_action': [
    '묶어두자',
    '넣어두자',
    '저장하자',
    '보관하자',
    // ... 10개 액션
  ],
};

function generateCombinedDiary(product, type, body) {
  const theme = pickRandom(diaryComponents[`${type}_${product}_theme`]);
  const emotion = pickRandom(diaryComponents[`${type}_${product}_emotion`]);
  const action = pickRandom(diaryComponents[`${type}_${product}_action`]);
  
  // 조합 패턴
  const patterns = [
    `${theme}. ${emotion}.\n${body}`,
    `${theme}. ${action}.\n${body}`,
    `${emotion}. ${theme}.\n${body}`,
    // ... 다양한 조합 패턴
  ];
  
  return pickRandom(patterns);
}
```

#### 예상 효과
- 독백 풀 크기가 **기하급수적으로 증가**
- 예: 주제 15개 × 감정 10개 × 액션 10개 = **1,500개 조합**
- 반복 빈도 극도로 감소

#### 작업량
- **높음**: 컴포넌트 분리 + 조합 로직 + 품질 관리
- 예상 시간: 15~20시간

#### 우선순위
- **낮음**: 효과는 크나 작업량이 매우 많음

---

### 방안 4: 사용 이력 기반 스마트 선택 (중기)

#### 목표
이미 사용한 독백을 추적하여 최대한 새로운 독백 선택

#### 구현 방안
```javascript
// 사용 이력 추적
const diaryUsageHistory = {
  'buy_예금': [], // 사용한 인덱스 배열
  // ...
};

function pickWithHistory(key, arr) {
  const history = diaryUsageHistory[key] || [];
  const unused = arr.map((_, idx) => idx).filter(idx => !history.includes(idx));
  
  // 사용하지 않은 독백이 있으면 그 중에서 선택
  if (unused.length > 0) {
    const idx = unused[Math.floor(Math.random() * unused.length)];
    history.push(idx);
    // 히스토리가 너무 길어지면 오래된 것 제거 (FIFO)
    if (history.length > arr.length * 2) {
      history.shift();
    }
    return arr[idx];
  }
  
  // 모두 사용했으면 히스토리 초기화하고 다시 시작
  diaryUsageHistory[key] = [];
  return pickWithHistory(key, arr);
}
```

#### 예상 효과
- 동일 독백 반복 최소화
- 독백 풀을 최대한 활용
- 반복 빈도 감소

#### 작업량
- **낮음**: 히스토리 추적 로직만 추가
- 예상 시간: 2~3시간

#### 우선순위
- **높음**: 작업량 대비 효과가 큼

---

### 방안 5: 하이브리드 접근 (권장)

#### 목표
여러 방안을 조합하여 최적의 효과 달성

#### 구현 전략

1. **Phase 1 (단기)**: 독백 풀 확장 + 사용 이력 기반 선택
   - 각 이벤트 유형당 독백 풀을 5개 → 10개로 확장
   - 사용 이력 추적 시스템 도입
   - 예상 효과: 반복 빈도 50% 감소

2. **Phase 2 (중기)**: 동적 독백 생성 추가
   - 게임 상태 기반 동적 독백 생성
   - 기본 풀 + 동적 풀 조합
   - 예상 효과: 반복 빈도 추가 30% 감소

3. **Phase 3 (장기, 선택)**: 조합형 시스템 도입
   - 컴포넌트 기반 조합 시스템
   - 최고 수준의 다양성 확보

#### 예상 효과
- Phase 1+2만으로도 반복 빈도 **65% 감소**
- 장기 플레이 시에도 신선함 유지

#### 작업량
- Phase 1: 12~15시간
- Phase 2: 5~8시간
- Phase 3: 15~20시간 (선택)

#### 우선순위
- **최우선**: 단계적 접근으로 리스크 최소화

---

## 구체적 구현 예시

### 예금 구매 독백 풀 확장 (방안 1)

```javascript
const buyByProduct = {
  '예금': [
    // 기존 3개
    `일단은 안전한 데에 묶어두자.\n${body}`,
    `불안할 땐 예금이 답이다.\n${body}`,
    `통장에 '쿠션'을 하나 깔았다.\n${body}`,
    
    // 추가 7개
    `안전함이 최고의 수익률.\n${body}`,
    `무엇보다도 평온함.\n${body}`,
    `돈이 잠들어 있는 게 나쁘지 않다.\n${body}`,
    `은행이 내 편이 되는 순간.\n${body}`,
    `위험은 내일로 미뤄두자.\n${body}`,
    `조용히 쌓이는 게 좋다.\n${body}`,
    `불안할 때는 이게 최선.\n${body}`,
    `돈이 안전하게 지켜지는 느낌.\n${body}`,
    `위험 없는 선택.\n${body}`,
    `은행 통장이 따뜻해 보인다.\n${body}`,
  ],
  // ... 다른 상품도 동일하게 확장
};
```

### 사용 이력 기반 선택 (방안 4)

```javascript
// 전역 히스토리 객체
const diaryUsageHistory = {};

function pickWithHistory(key, arr) {
  if (!diaryUsageHistory[key]) {
    diaryUsageHistory[key] = [];
  }
  
  const history = diaryUsageHistory[key];
  const unused = arr.map((_, idx) => idx).filter(idx => !history.includes(idx));
  
  let idx;
  if (unused.length > 0) {
    // 사용하지 않은 독백이 있으면 그 중에서 선택
    idx = unused[Math.floor(Math.random() * unused.length)];
  } else {
    // 모두 사용했으면 랜덤 선택하고 히스토리 초기화
    idx = Math.floor(Math.random() * arr.length);
    diaryUsageHistory[key] = [];
  }
  
  history.push(idx);
  // 히스토리가 너무 길어지면 오래된 것 제거 (순환)
  if (history.length > arr.length * 2) {
    history.shift();
  }
  
  return arr[idx];
}

// 기존 pick() 함수를 pickWithHistory()로 교체
// return pick('buy_예금', buyByProduct['예금']);
// → return pickWithHistory('buy_예금', buyByProduct['예금']);
```

---

## 우선순위 및 작업 계획

| 방안 | 우선순위 | 작업량 | 예상 효과 | 구현 순서 |
|------|----------|--------|----------|----------|
| **방안 4: 사용 이력 기반** | 최우선 | 낮음 (2~3시간) | 반복 빈도 감소 | 1순위 |
| **방안 1: 독백 풀 확장** | 높음 | 높음 (10~15시간) | 반복 빈도 75% 감소 | 2순위 |
| **방안 2: 동적 생성** | 중간 | 중간 (5~8시간) | 개인화 + 추가 감소 | 3순위 |
| **방안 3: 조합형 시스템** | 낮음 | 매우 높음 (15~20시간) | 최고 다양성 | 선택 |

## 결론

독백 풀 다양성 부족 문제는 **"사용 이력 기반 선택"**과 **"독백 풀 확장"**을 조합하여 해결하는 것이 가장 효율적입니다.

1. **즉시 구현**: 사용 이력 기반 선택 (방안 4)
   - 작업량 적음 (2~3시간)
   - 즉시 효과 발휘

2. **단계적 확장**: 독백 풀 확장 (방안 1)
   - 각 이벤트 유형당 5개 → 10개로 확장
   - 우선순위 높은 이벤트부터 진행

3. **장기 개선**: 동적 생성 (방안 2)
   - 게임 상태 반영
   - 더 개인화된 독백

이 접근으로 장기 플레이 시에도 일기장의 신선함과 감성적 요소를 유지할 수 있습니다.

## 참고 파일

- 구현: `seoulsurvival/src/main.js` (라인 2182~2786)
- 독백 풀 정의: 라인 2212~2785





