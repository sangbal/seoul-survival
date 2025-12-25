# 일기장 영역 개선 분석 및 제안

## Executive Summary

일기장 기능은 감성적 독백 변환과 시각적 분리로 가독성을 확보했으나, **데이터 영구 보존 부재**, **제한된 접근성**, **사용자 제어 부재** 등 근본적 한계가 존재합니다. 본 문서는 문제의 근본 원인을 분석하고 단계별 개선안을 제시합니다.

## 핵심 질문

- 일기장의 현재 한계는 무엇인가?
- 왜 이러한 문제가 발생했는가?
- 어떤 개선이 필요한가?

## 전략 방향

1. **데이터 영구성 확보**: 일기장 메시지를 게임 저장 데이터에 포함
2. **접근성 개선**: 제한된 높이를 넘어 전체 기록 탐색 가능
3. **사용자 제어 강화**: 검색/필터링/내보내기 기능 제공
4. **성능 최적화**: 무한 증가 방지 및 효율적 렌더링

## 문제 분석

### 1. 데이터 영구 보존 부재

#### 현황
- 일기장 메시지는 **DOM에만 존재**하며 게임 저장/불러오기에 포함되지 않음
- 새로고침/재접속 시 모든 일기장 기록이 사라짐
- 클라우드 저장에도 일기장 데이터가 포함되지 않음

#### 근본 원인
```javascript
// seoulsurvival/src/main.js의 saveGame() 함수 (라인 3500~3603)
// 일기장 관련 필드가 저장 데이터에 없음
const saveData = {
  cash, totalClicks, careerLevel, // ... 게임 상태만 저장
  // diaryEntries: 없음 ❌
};
```

**설계 철학의 한계**:
- 일기장을 "로그"로만 인식하여 일시적 UI 요소로 처리
- 게임 진행 상태와 별개로 취급
- 사용자 경험 관점에서의 가치 인식 부족

#### 영향도
- **높음**: 사용자가 오랜 시간 플레이하며 쌓은 감성적 기록이 영구 손실
- 게임의 스토리텔링 요소가 사라져 재방문 동기 약화

### 2. 제한된 가시성 및 접근성

#### 현황
- 최대 높이 240px (PC) / 120px (모바일)로 제한
- 오래된 메시지는 스크롤로만 접근 가능
- 메시지가 많아질수록 초기 로딩 시점의 기록은 사실상 접근 불가

#### 근본 원인
```css
/* seoulsurvival/index.html 라인 323~324 */
.diary-log {
  max-height: 240px; /* 고정 높이 제한 */
  overflow: auto;
}
```

**UI/UX 설계 한계**:
- 공간 효율성만 고려하여 높이 제한
- 장기 플레이 시나리오 미고려
- 사용자가 기록을 "탐색"해야 한다는 관점 부재

#### 영향도
- **중간**: 초기 기록 접근 어려움, 하지만 스크롤로 해결 가능
- 장기 플레이 시 사용자 경험 저하

### 3. 검색/필터링 기능 부재

#### 현황
- 특정 이벤트 유형(예: 승진, 구매)만 보고 싶어도 불가능
- 키워드 검색 불가
- 날짜/시간 기준 필터링 불가

#### 근본 원인
- 일기장을 "읽기 전용 로그"로만 설계
- 사용자 상호작용 기능 미구현
- 검색/필터링 UI 컴포넌트 부재

#### 영향도
- **중간**: 특정 기록을 찾기 어려움, 하지만 전체 스크롤로 해결 가능

### 4. 메시지 무한 증가 위험

#### 현황
- 메시지 제한 없이 계속 추가됨
- DOM 요소가 무한 증가할 경우 메모리/렌더링 성능 저하 가능성

#### 근본 원인
- 메시지 수 제한 로직 부재
- 가상 스크롤링(virtual scrolling) 미적용
- 오래된 메시지 자동 정리 기능 없음

#### 영향도
- **낮음**: 현재는 문제 없으나, 장기 플레이 시 잠재적 이슈

### 5. 사용자 제어 부재

#### 현황
- 일기장 내용을 사용자가 직접 관리할 수 없음
- 내보내기(텍스트 파일 다운로드) 기능 없음
- 개별 메시지 삭제/수정 불가

#### 근본 원인
- 일기장을 "시스템 로그"로만 인식
- 사용자 소유감(user ownership) 고려 부족

#### 영향도
- **낮음**: 핵심 기능은 아니나, 사용자 만족도 향상 기회

## 개선안 제시

### Phase 1: 데이터 영구 보존 (필수)

#### 1.1 저장 데이터 구조 확장

**목표**: 일기장 메시지를 게임 저장 데이터에 포함

**구현 방안**:
```javascript
// seoulsurvival/src/main.js의 saveGame() 함수 수정
const saveData = {
  // ... 기존 필드들 ...
  diaryEntries: diaryEntries, // 일기장 메시지 배열 추가
  diaryLastPick: window.__diaryLastPick || {}, // 중복 방지 상태 저장
};

// diaryEntries 구조
// [
//   { timestamp: "14:23", voice: "명함이 바뀌었다. CEO.", info: "클릭당 1,000,000원", date: "2025.12.20", day: 3 },
//   ...
// ]
```

**불러오기 로직**:
```javascript
// loadGame() 함수에 추가
if (data.diaryEntries && Array.isArray(data.diaryEntries)) {
  restoreDiaryEntries(data.diaryEntries);
  // window.__diaryLastPick 복원
  if (data.diaryLastPick) {
    Object.assign(window, { __diaryLastPick: data.diaryLastPick });
  }
}
```

**예상 효과**:
- 새로고침/재접속 시에도 일기장 기록 유지
- 클라우드 저장 시 일기장도 함께 백업
- 사용자 경험 대폭 개선

**우선순위**: **최우선** (사용자 데이터 손실 방지)

#### 1.2 메시지 수 제한 및 자동 정리

**목표**: 무한 증가 방지 및 성능 최적화

**구현 방안**:
```javascript
const MAX_DIARY_ENTRIES = 500; // 최대 500개 메시지 유지

function addLog(text) {
  // ... 기존 로직 ...
  
  // 메시지 추가 후 제한 체크
  const entries = Array.from(elLog.querySelectorAll('p'));
  if (entries.length > MAX_DIARY_ENTRIES) {
    // 오래된 메시지 제거 (FIFO)
    const toRemove = entries.slice(0, entries.length - MAX_DIARY_ENTRIES);
    toRemove.forEach(el => el.remove());
  }
}
```

**예상 효과**:
- 메모리 사용량 제어
- 렌더링 성능 유지

**우선순위**: **높음** (장기 플레이 대비)

### Phase 2: 접근성 개선 (권장)

#### 2.1 확장 가능한 일기장 UI

**목표**: 전체 기록 탐색 가능

**구현 방안**:
- 헤더에 "전체 보기" 버튼 추가
- 클릭 시 모달/드로어로 전체 일기장 표시
- 모달 내부는 가상 스크롤링 적용

```html
<!-- seoulsurvival/index.html -->
<div class="diary-card">
  <h2>
    <span class="diary-title">📓 일기장</span>
    <span class="diary-header-meta" id="diaryHeaderMeta">----.--.--(--일차)</span>
    <button id="diaryExpandBtn" class="diary-expand-btn" aria-label="전체 보기">📖</button>
  </h2>
  <div id="log" class="log diary-log"></div>
</div>
```

**예상 효과**:
- 제한된 공간에서도 전체 기록 접근 가능
- 사용자 경험 개선

**우선순위**: **중간**

#### 2.2 날짜별 그룹화

**목표**: 날짜별로 일기장 메시지 그룹화하여 탐색 용이

**구현 방안**:
```javascript
function groupDiaryByDate(entries) {
  const grouped = {};
  entries.forEach(entry => {
    const date = entry.date || '기타';
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(entry);
  });
  return grouped;
}
```

**예상 효과**:
- 특정 날짜의 기록 빠르게 찾기
- 시간 흐름에 따른 게임 진행 추적

**우선순위**: **낮음** (Phase 3과 함께 구현)

### Phase 3: 검색/필터링 기능 (선택)

#### 3.1 이벤트 유형 필터

**목표**: 승진/구매/판매 등 특정 이벤트만 보기

**구현 방안**:
- 헤더에 필터 드롭다운 추가
- 이벤트 유형별로 메시지 필터링

**예상 효과**:
- 사용자가 관심 있는 기록만 빠르게 확인

**우선순위**: **낮음**

#### 3.2 키워드 검색

**목표**: 텍스트 검색으로 특정 메시지 찾기

**구현 방안**:
- 검색 입력창 추가
- 실시간 필터링

**예상 효과**:
- 특정 상품/이벤트 관련 기록 빠르게 찾기

**우선순위**: **낮음**

### Phase 4: 사용자 제어 강화 (선택)

#### 4.1 내보내기 기능

**목표**: 일기장 내용을 텍스트 파일로 다운로드

**구현 방안**:
```javascript
function exportDiary() {
  const entries = Array.from(elLog.querySelectorAll('p'));
  const text = entries.map(el => el.textContent).join('\n\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `일기장_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
}
```

**예상 효과**:
- 사용자가 자신의 게임 기록을 영구 보존
- 소셜 미디어 공유 가능

**우선순위**: **낮음**

## 구현 우선순위

| Phase | 항목 | 우선순위 | 예상 작업량 | 예상 효과 |
|-------|------|----------|------------|----------|
| **Phase 1** | 데이터 영구 보존 | **최우선** | 2~3시간 | 사용자 데이터 손실 방지 |
| **Phase 1** | 메시지 수 제한 | **높음** | 1시간 | 성능 최적화 |
| **Phase 2** | 확장 가능한 UI | **중간** | 3~4시간 | 접근성 개선 |
| **Phase 2** | 날짜별 그룹화 | **낮음** | 2~3시간 | 탐색 용이성 |
| **Phase 3** | 검색/필터링 | **낮음** | 4~5시간 | 사용자 편의성 |
| **Phase 4** | 내보내기 | **낮음** | 1~2시간 | 사용자 만족도 |

## 기술적 고려사항

### 저장 데이터 크기

- 일기장 메시지 500개 기준: 약 50~100KB (JSON)
- LocalStorage 제한: 5~10MB (브라우저별 상이)
- **결론**: 문제 없음 (현재 게임 저장 데이터와 합쳐도 충분)

### 호환성

- 기존 저장 데이터에 `diaryEntries` 필드가 없어도 정상 동작 (옵셔널)
- 마이그레이션 불필요 (점진적 개선)

### 성능

- 가상 스크롤링 적용 시 렌더링 성능 개선
- 메시지 수 제한으로 메모리 사용량 제어

## 결론

일기장 영역의 가장 큰 문제는 **데이터 영구 보존 부재**입니다. Phase 1의 데이터 영구 보존 구현이 최우선이며, 이후 단계적으로 접근성과 사용자 제어 기능을 추가하는 것을 권장합니다.

## 참고 파일

- 구현: `seoulsurvival/src/main.js` (라인 2139~2803, 3500~3603, 3717~3830)
- 스타일: `seoulsurvival/index.html` (라인 323~358)
- 저장 로직: `shared/cloudSave.js`














