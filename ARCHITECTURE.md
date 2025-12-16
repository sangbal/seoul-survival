# ARCHITECTURE (Capital Clicker: Seoul Survival)

이 문서는 **새 세션/새 프롬프트에서도 AI가 프로젝트 구조를 빠르게 복원**할 수 있도록, 코드 구조와 데이터 흐름을 압축해 둔 문서입니다.

## 실행/배포
- **Dev**: `npm install` → `npm run dev` (Vite)
- **정적 배포**: GitHub Pages용 `base: './'` (`vite.config.js`)
- **엔트리(게임)**: `seoulsurvival/src/main.js` (ESM)

## 서비스 URL(중요)
- **허브(홈페이지)**: `http://clicksurvivor.com/`
- **게임(현재 서비스 경로)**: `https://clicksurvivor.com/seoulsurvival/`
- **현재 상태**: 루트(`/`)는 **허브(준비 중) 페이지**, 게임은 `/seoulsurvival/` 서브패스에 독립 앱으로 존재.

## 상위 구조 개요
- **허브/루트**: `index.html`
  - 게임 목록/안내를 보여주는 **허브 페이지(준비 중)**.
- **게임 UI/마크업(Seoul Survival)**: `seoulsurvival/index.html`
  - 실제 게임 화면(HTML/CSS) 본체.
  - `<script type="module" src="./src/main.js">`로 **`seoulsurvival/src/main.js`**를 로드해 게임 로직을 실행.
- **게임 코어(대부분)**: `seoulsurvival/src/main.js`
  - 상태 변수(현금/보유/업그레이드/직급/이벤트/로그 등)와 메인 루프를 포함.
  - UI 업데이트, 저장/로드, 이벤트, 순차 해금, 업그레이드 해금/구매 처리 등 핵심 로직이 여기 집중.
- **유틸/모듈 분리**
  - `seoulsurvival/src/economy/pricing.js`: 금융/부동산 **구매/판매 비용** 계산(등비 합)
  - `seoulsurvival/src/systems/market.js`: 시장 이벤트 스케줄/배수 계산(모듈형)
  - `seoulsurvival/src/systems/achievements.js`: 업적 체크/알림(모듈형)
  - `seoulsurvival/src/systems/upgrades.js`: 업그레이드 해금 체크(모듈형)
  - `seoulsurvival/src/ui/statsTab.js`: 통계 탭 렌더러(모듈형)
  - `seoulsurvival/src/ui/domRefs.js`: 자주 쓰는 DOM 참조 모음
  - `seoulsurvival/src/ui/domUtils.js`: `safeText` 등 안전 DOM 조작 유틸
  - `seoulsurvival/src/persist/storage.js`: LocalStorage JSON 안전 저장/로드 유틸
  - **정적 리소스(이미지)**: `seoulsurvival/assets/images/*`

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
   - 통계 탭은 일부 `seoulsurvival/src/ui/statsTab.js`(모듈) + 일부 `seoulsurvival/src/main.js`(레거시)가 섞여 있음
5. **저장/로드**: LocalStorage에 상태 저장(자동/수동/리셋)

## 핵심 데이터/테이블 위치
- **직급(승진)**: `seoulsurvival/src/main.js`의 `CAREER_LEVELS`
- **업그레이드**: `seoulsurvival/src/main.js`의 `UPGRADES`
- **기본 수익 테이블**
  - 금융: `FINANCIAL_INCOME`
  - 부동산: `BASE_RENT`
- **가격(기본가/지수 성장)**:
  - 모듈: `seoulsurvival/src/economy/pricing.js`
  - 레거시(중복): `seoulsurvival/src/main.js` 내부에도 구매/판매 계산 함수가 존재
- **순차 해금**:
  - `isProductUnlocked(...)`, `checkNewUnlocks(...)` in `seoulsurvival/src/main.js`

## UI 구조 메모(자주 수정되는 곳)
- 노동 탭(`workTab`)
  - 직급 표기(`currentCareer`)는 승진 카드 영역으로 이동되어 모바일 가려짐 문제를 완화
  - 승진 진행: `careerProgress`, `careerProgressText`, `careerRemaining`
- 통계 탭(`statsTab`)
  - 길이가 긴 값: `growthRate`, `nextMilestone`, `hourlyRate`는 CSS로 1줄 유지(폰트/nowrap)
- 설정 탭(`settingsTab`)
  - “🌐 홈페이지 이동” 링크 문구

## “레거시/주의” 포인트
- `seoulsurvival/src/main.js`에 **통계 탭 업데이트 함수가 레거시로 남아 있고**, 동시에 `seoulsurvival/src/ui/statsTab.js` 모듈도 존재.
  - UI/포맷 관련 수정 시 “어느 쪽이 실제로 호출되는지” 확인 필요.
- 과거에는 루트 `index.html`이 게임/리다이렉트 역할을 했으나, 현재는 **허브 페이지**로 변경됨.
  - UI 수정은 기본적으로 `seoulsurvival/index.html`을 기준으로 한다(루트는 허브).


