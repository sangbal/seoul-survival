# ARCHITECTURE (Capital Clicker: Seoul Survival)

이 문서는 **새 세션/새 프롬프트에서도 AI가 프로젝트 구조를 빠르게 복원**할 수 있도록, 코드 구조와 데이터 흐름을 압축해 둔 문서입니다.

## 실행/배포
- **Dev**: `npm install` → `npm run dev` (Vite)
- **정적 배포**: GitHub Pages용 `base: './'` (`vite.config.js`)
- **엔트리**: `src/main.js` (ESM)

## 상위 구조 개요
- **UI/마크업**: `index.html`, `seoulsurvival/index.html`
  - 동일한 화면 구조가 2군데 존재(루트/서브폴더). UI 수정은 보통 **둘 다 동기화**.
- **게임 코어(대부분)**: `src/main.js`
  - 상태 변수(현금/보유/업그레이드/직급/이벤트/로그 등)와 메인 루프를 포함.
  - UI 업데이트, 저장/로드, 이벤트, 순차 해금, 업그레이드 해금/구매 처리 등 핵심 로직이 여기 집중.
- **유틸/모듈 분리**
  - `src/economy/pricing.js`: 금융/부동산 **구매/판매 비용** 계산(등비 합)
  - `src/systems/market.js`: 시장 이벤트 스케줄/배수 계산(모듈형)
  - `src/systems/achievements.js`: 업적 체크/알림(모듈형)
  - `src/systems/upgrades.js`: 업그레이드 해금 체크(모듈형)
  - `src/ui/statsTab.js`: 통계 탭 렌더러(모듈형)
  - `src/ui/domRefs.js`: 자주 쓰는 DOM 참조 모음
  - `src/ui/domUtils.js`: `safeText` 등 안전 DOM 조작 유틸
  - `src/persist/storage.js`: LocalStorage JSON 안전 저장/로드 유틸

## 게임 루프 / 데이터 흐름(요약)
1. **입력**: 노동 클릭(`workBtn`) / 구매-판매 버튼 / 탭 전환 / 설정 토글
2. **상태 변경**:
   - 노동: `totalClicks`, `cash`, `totalLaborIncome`, `careerLevel` 등
   - 투자: 보유 수량 변경(금융/부동산) + 현금 차감/환급
   - 업그레이드: `UPGRADES[id].purchased/unlocked` + 배수/테이블 변경
   - 이벤트: `currentMarketEvent`, `marketEventEndTime` 등
3. **수익**:
   - `getRps()`가 금융 + (부동산 * rentMultiplier) + 이벤트 배수를 합산
4. **UI 업데이트**:
   - `safeText(...)`로 주요 UI 갱신
   - 통계 탭은 일부 `src/ui/statsTab.js`(모듈) + 일부 `src/main.js`(레거시)가 섞여 있음
5. **저장/로드**: LocalStorage에 상태 저장(자동/수동/리셋)

## 핵심 데이터/테이블 위치
- **직급(승진)**: `src/main.js`의 `CAREER_LEVELS`
- **업그레이드**: `src/main.js`의 `UPGRADES`
- **기본 수익 테이블**
  - 금융: `FINANCIAL_INCOME`
  - 부동산: `BASE_RENT`
- **가격(기본가/지수 성장)**:
  - 모듈: `src/economy/pricing.js`
  - 레거시(중복): `src/main.js` 내부에도 구매/판매 계산 함수가 존재
- **순차 해금**:
  - `isProductUnlocked(...)`, `checkNewUnlocks(...)` in `src/main.js`

## UI 구조 메모(자주 수정되는 곳)
- 노동 탭(`workTab`)
  - 직급 표기(`currentCareer`)는 승진 카드 영역으로 이동되어 모바일 가려짐 문제를 완화
  - 승진 진행: `careerProgress`, `careerProgressText`, `careerRemaining`
- 통계 탭(`statsTab`)
  - 길이가 긴 값: `growthRate`, `nextMilestone`, `hourlyRate`는 CSS로 1줄 유지(폰트/nowrap)
- 설정 탭(`settingsTab`)
  - “🌐 홈페이지 이동” 링크 문구

## “레거시/주의” 포인트
- `src/main.js`에 **통계 탭 업데이트 함수가 레거시로 남아 있고**, 동시에 `src/ui/statsTab.js` 모듈도 존재.
  - UI/포맷 관련 수정 시 “어느 쪽이 실제로 호출되는지” 확인 필요.
- `index.html`과 `seoulsurvival/index.html`이 중복되어, UI 수정은 **대개 2군데 동기화**가 필요.


