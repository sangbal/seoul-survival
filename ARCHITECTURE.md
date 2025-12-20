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
  - 히어로(도트 배경) + 앵커 섹션: `#about`, `#screenshots`, `#account` (로그인 CTA만, 상세는 `/account/`로 이동)
- **계정관리 페이지**: `account/index.html`
  - 폴더형 URL: `/account/` (Cloudflare Pages 호환)
  - 계정관리 전용 UI: Account Overview/Preferences/Privacy & Data/Danger Zone
  - 위험 버튼(내 데이터 삭제, 계정 삭제)은 이 페이지에만 존재
  - 허브 JS 엔트리: `hub/main.js`
  - 허브 i18n: `hub/i18n.js`, `hub/translations/{ko,en}.js`
  - 허브 언어 규칙: `?lang=ko|en` → LocalStorage(`clicksurvivor_lang`) → `navigator.language` fallback
  - 로고: `seoulsurvival/assets/images/logo.png` 이미지 사용
  - 네비게이션: 모든 뷰포트에서 햄버거 메뉴를 기본 네비게이션으로 사용 (PC/모바일 통일)
    - 헤더: 브랜드 + 햄버거 버튼만 표시 (nav와 actions는 기본 숨김)
    - 드로어 메뉴: 링크(소개/계정), 언어 선택, 로그인/로그아웃 버튼, "계정 관리" 링크
    - 포커스 관리: 드로어 열릴 때 첫 포커스 요소로 이동, 닫힐 때 햄버거 버튼으로 복귀
  - 계정 관리: 메인 페이지(/)에는 로그인 CTA만, 상세는 `/account/` 페이지로 분리
  - `/account/` 페이지: 섹션별 카드 구조
    - Account Overview: 표시명/이메일/로그인 제공자/로그아웃
    - Preferences: 언어 설정 (로그인 여부와 관계없이 표시)
    - Privacy & Data: 내 데이터 삭제 (클라우드 세이브/랭킹 삭제, 계정 유지)
    - Danger Zone: 계정 삭제(회원 탈퇴, 모든 데이터 삭제)
    - 위험 버튼(내 데이터 삭제, 계정 삭제)은 `/account/` 페이지에만 존재, 드로어에는 "계정 관리" 링크만 제공
  - 푸터: 브랜딩, 구조화된 그리드 레이아웃(게임/지원/법적 고지), 반응형 디자인
  - 법적 문서: `terms.html` (이용약관), `privacy.html` (개인정보처리방침)
  - 참고: 허브에서 쓰는 도트/스크린샷 이미지는 현재 `seoulsurvival/assets/images/*`를 재사용(추후 허브 전용 assets로 분리 가능)
- **공통(SSO/Auth)**: `shared/auth/*`
  - 허브/게임 공통 로그인 상태 공유(LocalStorage 키: `clicksurvivor-auth`)
  - Supabase Auth(OAuth) 기반, Google 로그인 지원 (GitHub 제거)
  - 공통 부트스트랩: `shared/authBoot.js` (허브/게임 페이지에서 모두 로드)
  - UI 관리: `shared/auth/ui.js`의 `setUI()` 함수에서 로그인 상태에 따라 버튼 표시/숨김 처리 (단일 소스)
  - 허브 UI: 계정 섹션(Account Overview/Preferences/Privacy & Data/Danger Zone), 헤더 버튼 (`authLoginBtn`, `authLogoutBtn`), 드로어 메뉴
  - 게임 UI: 설정 탭 계정 섹션 (`authProviderButtons`, `logoutButtonContainer`)
  - 데이터 삭제: `shared/auth/deleteUserData.js`에서 Supabase `game_saves`, `leaderboard` 테이블 데이터 삭제, 로컬 저장소 초기화 후 로그아웃
  - 계정 삭제(회원 탈퇴): `shared/auth/deleteAccount.js`에서 Supabase Edge Function(`delete-account`) 호출, Edge Function에서 Service Role Key로 `admin.deleteUser()` 수행 (보안: Service Role Key는 절대 프론트엔드에 포함하지 않음)
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
  - 리더보드 데이터: 닉네임, 총 자산, 플레이타임, 타워 개수(프레스티지)
  - 업데이트: 게임 저장 시 30초마다 자동 업데이트 (닉네임이 있을 때만, 첫 타워 구매 후 중단)
  - 조회: **랭킹 탭**에서만 업데이트 (로딩 상태 관리, 1분 간격 폴링, 타임아웃 처리, IntersectionObserver 기반 가시성 체크)
  - 순위 정렬: 타워 개수 우선 → 자산 순 (타워 개수가 같으면 자산 많은 순)
  - 스키마: `supabase/leaderboard.sql`에 `tower_count` 컬럼 및 복합 인덱스 포함, `get_my_rank` RPC 함수로 순위 조회
- **게임 UI/마크업(Seoul Survival)**: `seoulsurvival/index.html`
  - 실제 게임 화면(HTML/CSS) 본체.
  - `<script type="module" src="./src/main.js">`로 **`seoulsurvival/src/main.js`**를 로드해 게임 로직을 실행.
  - 다국어 지원: `data-i18n` 속성으로 정적 텍스트 자동 번역, `data-i18n-alt`, `data-i18n-aria-label` 지원
- **게임 코어(대부분)**: `seoulsurvival/src/main.js`
  - 상태 변수(현금/보유/업그레이드/직급/이벤트/로그/서울타워 개수 등)와 메인 루프를 포함.
  - UI 업데이트, 저장/로드, 이벤트, 순차 해금, 업그레이드 해금/구매 처리 등 핵심 로직이 여기 집중.
  - 프레스티지 시스템: 서울타워(`towers`) 상태 변수, 구매 시 엔딩 모달, 리더보드 업데이트 중단 플래그(`shouldUpdateLeaderboard`)
  - 다국어 지원: 모든 동적 텍스트(로그, 모달, 업적 툴팁, 일기장)에 `t()` 함수 사용, 언어 변경 시 `updateAllUIForLanguage()` 호출
- **다국어 시스템(i18n)**: `seoulsurvival/src/i18n/`
  - 핵심 모듈: `index.js` (언어 해석, 번역 함수, DOM 적용)
  - 번역 파일: `translations/ko.js` (한국어, 기본), `translations/en.js` (영어)
  - 언어 동기화: 허브와 동일한 `localStorage` 키(`clicksurvivor_lang`) 사용, URL 파라미터(`?lang=ko|en`) 지원
  - 번역 범위: 약 400개 텍스트 (탭, 버튼, 상품명, 업적, 업그레이드, 시장 이벤트, 모달, 일기장, 통계 등)
  - 숫자 포맷: `formatNumberForLang()` 함수로 한국어(만/억/조)와 영어(K/M/B/T) 단위 지원
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
- **서울타워**: `seoulsurvival/src/main.js`의 `towers` 변수
- **기본 수익 테이블**
  - 금융: `FINANCIAL_INCOME`
  - 부동산: `BASE_RENT`
- **가격(기본가/지수 성장)**:
  - 모듈: `seoulsurvival/src/economy/pricing.js`
  - 레거시(중복): `seoulsurvival/src/main.js` 내부에도 구매/판매 계산 함수가 존재
  - 가격 성장률: `DEFAULT_GROWTH = 1.05` (등비 수열)
  - 판매 환급률: `SELL_RATE = 1.0` (100% 환급)
  - 프레스티지: `BASE_COSTS.tower` (1조원, 고정, 판매 불가)
- **순차 해금**:
  - `isProductUnlocked(...)`, `checkNewUnlocks(...)` in `seoulsurvival/src/main.js`
  - 서울타워 해금 조건: CEO(`careerLevel >= 9`) + 빌딩 1개 이상
- **프레스티지 시스템**:
  - 서울타워: 최종 엔드게임 콘텐츠, 구매 시 엔딩 모달 표시
  - 리더보드 통합: 타워 개수는 리더보드에 이모지(🗼)로 표시, 순위 정렬에 우선 반영
  - 게임 상태: 타워 구매 후 `shouldUpdateLeaderboard = false`로 설정하여 자산 변화가 리더보드에 반영되지 않음

## UI 구조 메모(자주 수정되는 곳)
- 노동 탭(`workTab`)
  - 직급 표기(`currentCareer`)는 승진 카드 영역으로 이동되어 모바일 가려짐 문제를 완화
  - 승진 진행: `careerProgress`, `careerProgressText`, `careerRemaining`
- 통계 탭(`statsTab`)
  - 길이가 긴 값: `growthRate`, `nextMilestone`, `hourlyRate`는 CSS로 1줄 유지(폰트/nowrap)
  - (v1.1 이후) 리더보드는 통계 탭이 아닌 별도 랭킹 탭으로 분리
- 랭킹 탭(`rankingTab`)
  - 상단: 내 순위(닉네임/자산/플레이타임/순위 표시, Top10 밖인 경우 RPC 기반 순위 조회)
    - 비로그인 상태: 간단한 안내 문구 + Google 로그인 버튼만 표시 (카드/헤더 제거)
    - 로그인 버튼 클릭 시 설정 탭으로 이동하지 않고 바로 `signInWithOAuth('google')` 실행
  - 중단: 글로벌 리더보드 TOP 10 (닉네임/자산/플레이타임, 내 닉네임은 행 하이라이트)
  - 하단: 통계 탭에서 옮겨온 업적 그리드(`achievementGrid`)
- 인앱 브라우저 안내:
  - `detectInAppBrowser()`: 카카오톡/인스타그램/페이스북/라인/위챗 등 인앱 브라우저 감지
  - `showInAppBrowserWarningIfNeeded()`: 인앱 브라우저 접속 시 상단 배너 표시 (Google 로그인 제한 안내, URL 복사, 확인 버튼)
- 설정 탭(`settingsTab`)
  - 섹션 순서: 게임 정보 → 시각 효과 → 숫자 표시 → 계정 → 저장 관리 → 게임 새로 시작
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


