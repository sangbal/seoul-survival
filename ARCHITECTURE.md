# ARCHITECTURE (ClickSurvivor Hub + Games)

이 문서는 **새 세션/새 프롬프트에서도 AI가 프로젝트 구조를 빠르게 복원**할 수 있도록, 코드 구조와 데이터 흐름을 압축해 둔 문서입니다.

## 실행/배포
- **Dev**: `npm install` → `npm run dev` (Vite)
- **정적 배포**: GitHub Pages용 `base: './'` (`vite.config.js`)
- **엔트리(허브)**: 루트 `index.html` (+ `hub/main.js`)
- **엔트리(게임: seoulsurvival)**: `seoulsurvival/src/main.js` (ESM)

## 서비스 URL(중요)
- **허브(홈페이지)**: `http://clicksurvivor.com/`
- **게임(현재 서비스 경로)**: `https://clicksurvivor.com/seoulsurvival/`
- **현재 상태**: 루트(`/`)는 **허브(준비 중) 페이지**, 게임은 `/seoulsurvival/` 서브패스에 독립 앱으로 존재.

## 상위 구조 개요
- **허브/루트**: `index.html`
  - "게임 1개 집중" 넷플릭스 톤 허브 페이지.
  - 히어로(도트 배경) + 앵커 섹션: `#about`, `#screenshots`, `#account`
  - 허브 JS 엔트리: `hub/main.js`
  - 허브 i18n: `hub/i18n.js`, `hub/translations/{ko,en}.js`
  - 허브 언어 규칙: `?lang=ko|en` → LocalStorage(`clicksurvivor_lang`) → `navigator.language` fallback
  - 로고: `seoulsurvival/assets/images/logo.png` 이미지 사용
  - 푸터: 브랜딩, 구조화된 그리드 레이아웃(게임/지원/법적 고지), 반응형 디자인
  - 법적 문서: `terms.html` (이용약관), `privacy.html` (개인정보처리방침)
  - 참고: 허브에서 쓰는 도트/스크린샷 이미지는 현재 `seoulsurvival/assets/images/*`를 재사용(추후 허브 전용 assets로 분리 가능)
- **공통(SSO/Auth)**: `shared/auth/*`
  - 허브/게임 공통 로그인 상태 공유(LocalStorage 키: `clicksurvivor-auth`)
  - Supabase Auth(OAuth) 기반, Google 로그인 지원 (GitHub 제거)
  - 공통 부트스트랩: `shared/authBoot.js` (허브/게임 페이지에서 모두 로드)
  - UI 관리: `shared/auth/ui.js`의 `setUI()` 함수에서 로그인 상태에 따라 버튼 표시/숨김 처리
  - 허브 UI: 계정 섹션, 헤더 버튼 (`authLoginBtn`, `authLogoutBtn`)
  - 게임 UI: 설정 탭 계정 섹션 (`authProviderButtons`, `logoutButtonContainer`)
- **공통(Cloud Save)**: `shared/cloudSave.js`
  - 로그인 사용자만 Supabase `game_saves` 테이블에 JSON 세이브 업로드/다운로드
  - 테이블/RLS는 `supabase/game_saves.sql`로 관리(프로젝트별 1회 실행)
  - 저장 정책:
    - 게스트: LocalStorage만 (5초마다 자동 저장)
    - 로그인 사용자: LocalStorage (5초마다) + 클라우드 (탭 숨김/닫기 시 자동 플러시)
    - 수동 저장: 설정 탭에서 "☁️ 클라우드 저장" 버튼으로 즉시 업로드
  - 닉네임 저장: 게임 세이브 데이터의 `nickname` 필드가 `game_saves` 테이블의 JSONB에 포함됨
- **공통(Leaderboard)**: `shared/leaderboard.js`
  - 리더보드 업데이트/조회 함수 제공
  - Supabase `leaderboard` 테이블 사용 (테이블/RLS는 `supabase/leaderboard.sql`로 관리)
  - 리더보드 데이터: 닉네임, 총 자산, 플레이타임
  - 업데이트: 게임 저장 시 30초마다 자동 업데이트 (닉네임이 있을 때만)
  - 조회: 통계 탭 활성화 시에만 업데이트 (로딩 상태 관리, 10초 쿨다운, 타임아웃 처리)
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
  - 리더보드 섹션: "리더보드 (TOP 10)" 표시, 통계 탭 활성화 시에만 업데이트
- 설정 탭(`settingsTab`)
  - 섹션 순서: 시각 효과 → 숫자 표시 → 계정 → 저장 관리 → 게임 새로 시작 → 게임 정보
  - 계정 섹션: 로그인 상태에 따라 Google 버튼/로그아웃 버튼 표시/숨김, 닉네임 표시 (`playerNicknameLabel`)
  - 저장 관리 섹션: 클라우드 저장/불러오기 + 저장 정보 통합, 비로그인 시 클라우드 UI 숨김
  - 로컬 저장 내보내기/가져오기: 숨김 처리 (`display: none`)
  - "🌐 홈페이지 이동" 링크: 허브 홈페이지(`/`)로 연결

## “레거시/주의” 포인트
- `seoulsurvival/src/main.js`에 **통계 탭 업데이트 함수가 레거시로 남아 있고**, 동시에 `seoulsurvival/src/ui/statsTab.js` 모듈도 존재.
  - UI/포맷 관련 수정 시 “어느 쪽이 실제로 호출되는지” 확인 필요.
- 과거에는 루트 `index.html`이 게임/리다이렉트 역할을 했으나, 현재는 **허브 페이지**로 변경됨.
  - UI 수정은 기본적으로 `seoulsurvival/index.html`을 기준으로 한다(루트는 허브).

## 문서 분리(DEVLOG/ARCHITECTURE) 운영 가이드
- 결론: **당장은 분리 불필요**(허브+게임이 같은 레포/같은 배포 파이프라인을 공유).
- 권장 운영:
  - `DEVLOG.md`는 하나로 유지하되, 변경 항목에 **[hub] / [seoulsurvival]** 같은 태그를 붙여 구분한다.
  - `ARCHITECTURE.md`도 하나로 유지하되, “공통(SSO/공유 모듈)” + “허브” + “게임별” 섹션으로 확장한다.
- 분리가 필요한 시점(예):
  - 게임이 3~5개 이상으로 늘어 `ARCHITECTURE.md`가 과도하게 길어짐
  - 게임별로 빌드/배포/데이터 스키마가 크게 달라짐
- 그때의 분리안(추천):
  - 루트는 요약만 유지: `ARCHITECTURE.md`(허브 + 공통) + `DEVLOG.md`(전체)
  - 게임별 상세는 폴더로: `docs/games/<slug>/ARCHITECTURE.md` (필요 시 `BALANCE_NOTES.md`도 게임별로)


