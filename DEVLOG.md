# DEVLOG

이 파일은 "매 세션 작업 내역/의도/주의사항"을 짧게 남기는 로그입니다.  
새 프롬프트/새 창에서 시작할 때, AI는 이 파일의 **최근 항목**을 먼저 읽고 맥락을 복원합니다.

## 2025-12-19 (최종)
- **[hub] 계정관리 페이지 분리 (/account/)**
  - Cloudflare Pages 폴더형 URL 구조로 계정관리 페이지 분리
  - `account/index.html` 생성: 헤더/드로어 구조 재사용, 계정관리 전용 UI (Account Overview/Preferences/Privacy & Data/Danger Zone)
  - 메인 페이지(/) 정리: 계정관리 전체 UI 제거, 로그인 CTA + "계정 관리로 이동" 링크만 유지
  - 위험 버튼(내 데이터 삭제, 계정 삭제)은 `/account/` 페이지에만 존재
  - 네비 링크 변경: 모든 `#account` 앵커를 `account/` 경로로 변경 (상대 경로, 헤더/드로어/푸터)
  - Vite 빌드 설정: `vite.config.js`에 `account/index.html` 추가하여 멀티 페이지 지원
  - 공통 auth UI 로직 호환: `shared/auth/ui.js`의 `setUI()`가 메인/account 페이지 모두에서 동작하도록 null-safe 처리
  - base 설정: 멀티 페이지(/, /seoulsurvival/, /account/) 자산 경로 안정화를 위해 `base: './'`로 전환

## 2025-12-19 (허브 UI/UX 정돈)
- **[hub] 전체 UI 리스킨: 토큰 기반으로 일관성/가독성 개선**
  - `index.html`에 디자인 토큰 도입: 색상/간격/타이포 스케일을 CSS 변수로 정리
  - 포인트 컬러를 1개(blue) 중심으로 통일, 과한 그라데이션/보조 포인트 노출을 축소
  - 버튼/링크/셀렉트/햄버거/드로어 버튼의 터치 타겟을 44px 기준으로 정렬
  - 접근성: `:focus-visible` 포커스 링 추가(키보드 탐색 시 시각적 피드백)
  - 섹션 리듬 정리: section title 간격 스케일화, 카드/스크린샷 캡션 가독성 개선
  - base('./') 전제에 맞게 허브 링크를 상대 경로로 정리 (`account/` 등)

## 2025-12-19 (후반)
- **[hub] 네비게이션 및 계정관리 UI 개선**
  - PC에서도 햄버거 메뉴를 기본 네비게이션으로 사용 (모든 뷰포트에서 드로어 단일 진입점)
  - 헤더의 nav와 actions를 기본 숨김 처리, 햄버거 버튼만 표시
  - 드로어 포커스 관리 추가: 열릴 때 첫 포커스 요소로 이동, 닫힐 때 햄버거 버튼으로 복귀
  - 계정관리 UI를 업계 우수 사례에 맞게 섹션별 카드 구조로 재구성:
    - Account Overview: 표시명/이메일/로그인 제공자/로그아웃
    - Preferences: 언어 설정 (로그인 여부와 관계없이 표시)
    - Privacy & Data: 내 데이터 삭제 버튼 (클라우드 세이브/랭킹 삭제, 계정 유지)
    - Danger Zone: 계정 삭제 버튼 (회원 탈퇴, 모든 데이터 삭제)
  - "내 데이터 삭제"와 "계정 삭제" 기능의 문구를 명확히 분리하여 혼동 방지
  - 계정 삭제 confirm 1단계에 삭제되는 항목 목록 명시
  - 드로어에는 "계정 관리" 링크만 제공, 위험 버튼은 계정 섹션 내부에만 존재
  - 언어 선택 동기화: 헤더/드로어/계정 섹션의 언어 선택이 모두 동기화됨

## 2025-12-19
- **[hub] 계정 삭제(회원 탈퇴) 기능 구현**
  - 보안 원칙 준수:
    - Service Role Key는 절대 프론트엔드에 포함하지 않음
    - 계정 삭제는 Supabase Edge Function에서만 수행 (`supabase/functions/delete-account/index.ts`)
    - Edge Function은 JWT 검증 후 Service Role Key로 `admin.deleteUser()` 호출
  - Edge Function 구현:
    - 입력: Authorization Bearer 토큰으로 사용자 인증
    - 로직: game_saves/leaderboard 삭제 → auth.users 삭제 (트랜잭션 처리)
    - 응답: ALL_SUCCESS, DATA_DELETED_BUT_AUTH_DELETE_FAILED, AUTH_FAILED, NOT_CONFIGURED, UNKNOWN_ERROR
    - 로깅: 민감 정보/키/토큰은 로그에 남기지 않음
  - 프론트엔드 구현:
    - `shared/auth/deleteAccount.js`: Edge Function 호출 함수 (30초 타임아웃)
    - 계정 섹션(#account)에만 "계정 삭제(회원 탈퇴)" 버튼 추가 (드로어에는 없음)
    - 2단계 confirm: 계정+데이터 삭제 경고, 삭제될 내용 명시
    - 에러 처리: 각 상황별 명확한 메시지 (401/403/404/타임아웃/네트워크 오류)
    - 삭제 성공 시: LocalStorage 정리 → 로그아웃 → 페이지 새로고침
  - 리스크 설계 문서: `docs/account-deletion-risks.md`에 10개 리스크 항목 정리 (현상/원인/대응/사용자 안내/테스트 방법)

- **[hub] 리스크 점검 및 보완 (계정 관리/회원 탈퇴 기능)**
  - LocalStorage 삭제 범위 정확화:
    - 실제 사용 키 확인: `clicksurvivor-auth` (인증), `clicksurvivor_lang` (언어), `seoulTycoonSaveV1` (게임 저장)
    - 삭제 정책 변경: 계정/세이브 관련 키만 삭제, 언어 설정(`clicksurvivor_lang`)은 유지
    - 명시적 키 목록 방식으로 변경하여 향후 확장 시 안전성 확보
  - 에러 처리 및 사용자 안내 강화:
    - 네트워크 오류/권한 오류(401/403)/토큰 만료 등 각 상황별 명확한 메시지 제공
    - 삭제 실패 시 재시도 유도 및 권한 오류 시 로그아웃 제안
    - 2단계 confirm 모달에 삭제될 데이터 목록 명시
  - 위험 작업 버튼 위치 개선:
    - 드로어 메뉴에서 "내 데이터 삭제" 버튼 제거, "계정 관리" 링크로 대체 (실수 방지)
    - 실제 삭제 버튼은 계정 섹션(#account)에만 존재하도록 변경
  - MutationObserver 동기화 최적화:
    - 무한 루프 방지: `isSyncing` 플래그로 중복 호출 차단
    - observer 옵션 최적화: `childList: false`, `subtree: false`로 불필요한 감지 방지
  - 접근성 개선:
    - 햄버거 버튼에 `aria-controls="drawer"` 추가
    - iOS 스크롤 잠금 개선: `body.drawer-open`에 `position: fixed`, `width: 100%`, `height: 100%` 추가
  - 프로덕션 문구 확인: footer의 개발자용 문구는 이미 `display: none` 처리되어 안전

- **[hub] 계정 관리 보강 및 회원 탈퇴 기능 구현**
  - 계정 관리 UI 보강:
    - 로그인 상태일 때 이메일/표시명 노출 (`authUserEmail`, `authUserName`)
    - 프로덕션 문구 정리: "SSO 설정 필요" → "게스트 모드입니다. 로그인하면 기기 간 이어하기/랭킹 참여가 가능합니다."
    - 내 데이터 삭제 버튼 추가 (허브 계정 섹션 및 드로어 메뉴)
  - 내 데이터 삭제 기능:
    - `shared/auth/deleteUserData.js`: Supabase `game_saves`, `leaderboard` 테이블에서 사용자 데이터 삭제
    - 2단계 confirm 모달로 실수 방지
    - 삭제 성공 시 로컬 저장소 초기화 (`clicksurvivor-*`, `seoulsurvival-*` 키 삭제) 후 로그아웃 및 페이지 새로고침
    - `shared/auth/ui.js`의 `handleDeleteData()` 함수로 통합 처리
  - 단일 소스 원칙: `shared/auth/ui.js`의 `setUI()` 함수가 허브의 헤더/드로어/계정 섹션 UI를 모두 관리

- **[hub] 모바일 가로 스크롤 제거 및 햄버거 메뉴 구현**
  - 가로 overflow 원인 제거:
    - `.topbar`에 `width: 100%`, `max-width: 100%`, `box-sizing: border-box` 추가하여 viewport를 넘지 않도록 수정
    - `.brand`의 `min-width: 200px`를 제거하고 `min-width: 0`, `flex: 0 1 auto`로 변경하여 좁은 화면에서 축소 가능하도록 수정
    - `.brandname`, `.brandtag`에 `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis` 추가하여 텍스트 오버플로우 방지
    - `.hero::before`의 `transform: scale(1.02)`를 `scale(1.01)`로 줄여 약간의 overflow 방지
    - `html`, `body`에 `overflow-x: hidden` 안전장치 추가
  - 모바일 햄버거 메뉴 구현:
    - `max-width: 768px` 브레이크포인트에서 헤더의 `nav`와 `.actions` 숨김, 햄버거 버튼 표시
    - 드로어 메뉴: 우측에서 slide-in/out 애니메이션, overlay 클릭/ESC 키로 닫기, body 스크롤 잠금 처리
    - 드로어 내부: 네비게이션 링크, 언어 선택, 계정 관련 버튼을 세로로 정리
    - 드로어와 헤더의 언어 선택/로그인 버튼 동기화: `hub/main.js`에서 MutationObserver로 상태 동기화, `shared/authBoot.js`에서 드로어 버튼도 처리
    - 접근성: `aria-label`, `aria-expanded`, `aria-hidden` 속성 추가

## 2025-12-18
- **[seoulsurvival] 인앱 브라우저 안내 및 랭킹 로그인 UX 개선**
  - 인앱 브라우저 감지 및 안내 배너 추가:
    - `detectInAppBrowser()`: 카카오톡/인스타그램/페이스북/라인/위챗 등 인앱 브라우저 감지 (`navigator.userAgent` 기반)
    - `showInAppBrowserWarningIfNeeded()`: 인앱 브라우저에서 접속 시 상단에 안내 배너 표시
    - Google 로그인 제한 안내 문구 및 Chrome/Safari 등 기본 브라우저 사용 권장
    - URL 복사 버튼: `navigator.clipboard.writeText()` + `document.execCommand('copy')` fallback으로 주소 복사 기능 제공
    - 확인 버튼: 배너를 닫을 수 있는 기능 추가
  - 랭킹 탭 "내 기록" 비로그인 UX 개선:
    - 비로그인 상태를 `getMyRank()` 호출 전에 `getUser()`로 먼저 확인하여 즉시 로그인 버튼 표시
    - 카드형 레이아웃 제거, 간단한 안내 문구("로그인 후에 내 순위를 볼 수 있습니다.") + Google 로그인 버튼만 표시
    - "내 기록" 문구 중복 제거 (외곽 h3 제목만 유지)
    - 로그인 버튼 클릭 시 설정 탭으로 이동하지 않고 `signInWithOAuth('google')` 직접 호출하여 바로 로그인 실행
    - `forbidden` 에러 타입뿐만 아니라 모든 비로그인 상황에서 일관된 UX 제공

## 2025-12-17
- **[seoulsurvival] 닉네임 입력 모달 안정화**
  - 닉네임 모달 중복 노출 문제 해결:
    - `resolveFinalNickname()`: 로컬 저장에서 닉네임을 동기적으로 확인하는 단일 함수
    - `ensureNicknameModal()`: 닉네임 모달 오픈의 단일 진입점, 세션 플래그(`__nicknameModalShown`)로 중복 방지
    - 초기 부팅 시퀀스를 async IIFE로 감싸서 클라우드 세이브 병합과 닉네임 체크 타이밍 조정
  - 클라우드 세이브 병합 타이밍 개선:
    - `maybeOfferCloudRestore()`를 Promise 반환으로 변경, "불러오기"/"나중에" 선택에 따라 resolve 분기
    - "나중에" 선택 시 즉시 `ensureNicknameModal()` 호출하여 닉네임 모달 표시
    - Promise resolve 가드(`settled` 플래그)로 중복 호출 방지
  - `resetGame()`에서 닉네임 입력 로직 제거, reload 후 `ensureNicknameModal()`이 처리하도록 변경
  - `openConfirmModal()`에 `onCancel` 옵션 추가하여 기존 호출부 호환성 유지
- **[seoulsurvival] 리더보드 시스템 구현**
  - 닉네임 입력 시스템:
    - 게임 새로 시작 시 닉네임 입력 모달 팝업
    - 닉네임은 게임 세이브 데이터에 포함 (`saveData.nickname`)
    - 닉네임은 `game_saves` 테이블의 JSONB 필드에 저장됨 (별도 컬럼 아님)
    - 설정 섹션 계정 영역에 닉네임 표시 추가 (`playerNicknameLabel`)
  - 리더보드 UI:
    - 통계 탭에 "리더보드 (TOP 10)" 섹션 추가
    - 닉네임, 총 자산, 플레이타임 표시
    - 상위 3명은 메달 이모지 (🥇🥈🥉) 표시
  - 리더보드 데이터 관리:
    - `shared/leaderboard.js`: 리더보드 업데이트/조회 함수
    - `supabase/leaderboard.sql`: 리더보드 테이블 및 RLS 정책
    - 리더보드 업데이트: 게임 저장 시 30초마다 자동 업데이트 (닉네임이 있을 때만)
  - 리더보드 조회: (초기) 통계 탭 활성화 시에만 업데이트 → (현재) 전용 랭킹 탭 활성 + 화면 가시성 조건에서만 업데이트
  - 리더보드 로딩 문제 수정:
    - `updateStatsTab()`에서 `updateLeaderboardUI(false)` 호출 제거
    - 통계 탭이 활성화될 때만 리더보드 업데이트 (navBtns 이벤트 리스너에서 처리)
    - 로딩 상태 관리, 타임아웃 처리, 디버깅 로그 추가
  - 디버깅 로그 추가:
    - `saveGame()`: 닉네임 저장 확인 로그
    - `upsertCloudSave()`: 닉네임 포함 여부 확인 로그
    - `updateLeaderboardUI()`: API 호출/응답 로그

- **[seoulsurvival] PC 레이아웃/랭킹 탭 UX 개편**
  - PC에서 노동/투자/통계/랭킹/설정을 5패널 한 줄 멀티 컬럼 레이아웃으로 정렬하고, 각 패널 내부만 세로 스크롤되도록 조정.
  - 리더보드/업적/내 순위 UI를 통계 탭에서 분리해 전용 랭킹 탭(`rankingTab`)으로 이동, 내 닉네임 하이라이트 및 RPC 기반 내 순위 조회 추가.
  - IntersectionObserver 기반으로 랭킹 패널이 실제 화면에 보이는 동안에만 리더보드 폴링 수행(PC), 모바일은 하단 네비 + active 탭 기준 유지.
  - 상단 헤더와 5개 패널의 좌우 폭을 `.app` 컨테이너 기준으로 통일하고, 랭킹 카드의 타이포/섹션 스타일을 다른 탭과 일치시키는 방향으로 정리.

- **[공통/배포] Supabase 키 주입 방식 정리 + 리더보드 키 미설정 UX 개선**
  - `shared/auth/config.js`를 Vite env 기반(`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`)으로 변경하고, 키가 없을 경우 SSO/리더보드가 비활성(게스트 모드)로 동작하도록 정리.
  - Auth UI(`shared/auth/ui.js`)에서 키 미설정 시 "SSO 설정 필요" 대신 "게스트 모드(로그인 준비 중)" 문구를 노출하고, 로그인 시도 토스트도 유저 친화적으로 변경.
  - 리더보드 UI(`seoulsurvival/src/main.js`)는 Supabase 미설정이면 네트워크 호출을 스킵하고 "리더보드 설정이 아직 완료되지 않았어요" 안내만 표시해 무한 로딩을 방지.
  - README의 Supabase 설정 섹션을 `.env.local` 예시(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) 기반으로 업데이트.
  - GitHub Actions 워크플로우(`.github/workflows/deploy.yml`)를 추가/보강해, CI에서 env를 Secrets로 주입하고 `npm run build` 결과(`dist`)를 `gh-pages` 브랜치로 배포하도록 구성 (`permissions.contents: write`, `publish_branch: gh-pages`, `cname: clicksurvivor.com` 설정).
  - GitHub Pages에서 `/seoulsurvival/` 404 문제를 해결하기 위해 Vite 다중 엔트리 구성(`vite.config.js`)을 추가하고, `dist/index.html`(허브) + `dist/seoulsurvival/index.html`(게임) 둘 다 빌드되도록 수정.
  - 랭킹 탭 UI를 "내 기록 카드 + TOP10 순위표(table)" 구조로 개편: `seoulsurvival/src/main.js`의 `updateLeaderboardUI()`에서 div 리스트 렌더링을 `<table class="leaderboard-table">` 기반으로 변경하고, `myRankContent`는 `.my-rank-card` 카드형 레이아웃으로 재구성하여 프리미어리그 스타일의 가독성 높은 순위/내 기록 표시를 제공.
  - 로컬/배포 환경에서 Supabase env 주입 여부를 진단하기 위해 `shared/auth/config.js`에 env/키 길이 로그와 `isSupabaseConfigured()` 상세 로그를 추가했으며, 최종 프로덕션 UI에서는 설정 탭 Supabase 디버그 배지를 제거해 사용자-facing 화면을 정리.
  - 리더보드 TOP10 순위표의 레이아웃을 안정화하기 위해 `.leaderboard-table`에 table-layout: fixed, 컬럼 폭 재조정(.col-rank/.col-assets/.col-playtime) 및 row 구분선을 적용하고, 플레이타임은 `formatPlaytimeMs`/`formatPlaytimeMsShort` 헬퍼로 `43분`, `2h 03m` 같은 축약 포맷으로 표시하도록 개선했으며, 닉네임은 최대 5글자가 항상 잘리지 않도록 5ch 폭을 보장.

## 2025-01-17
- **[hub] 허브 홈페이지 UI/UX 개선**
  - 로고 이미지 적용: `logo.png`를 메인 로고로 사용 (기존 텍스트 "C" 제거)
  - 로그인 UI 개선:
    - 계정 섹션: "준비 중" 문구 제거, 로그인 상태에 따라 동적 UI 표시
    - 헤더 버튼: `authLoginBtn`, `authLogoutBtn` ID로 통일, `shared/authBoot.js`에서 자동 처리
    - Google 로그인 버튼만 유지 (GitHub 제거), 중복 로그인 버튼 제거
  - UI/UX 개선:
    - 버튼 인터랙션: 호버 시 상승 효과, 그림자 효과, 전환 애니메이션 개선
    - 색상/대비: 사용자 칩에 accent 색상 적용, 버튼 호버 상태 개선
    - 간격/여백: CTA 버튼 간격 증가, 섹션 간 여백 증가, 패널 내부 패딩 증가
    - 접근성: 버튼에 명확한 커서 스타일, 전환 애니메이션으로 피드백 제공
  - 푸터 개선:
    - 브랜딩 강화: 로고 이미지와 브랜드 정보 추가
    - 구조화된 레이아웃: 3개 섹션 그리드 (게임, 지원, 법적 고지)
    - 반응형 디자인: 모바일(1열) → 태블릿(2열) → 데스크톱(3열)
    - 시각적 계층 개선: 섹션 제목, 링크 스타일, 구분선 추가
    - 하단 영역 정리: 불필요한 노트 제거, 버전 정보만 중앙 정렬
  - 법적 문서 추가:
    - `terms.html`: 이용약관 페이지 (8개 조항, 간결하고 핵심 내용 중심)
    - `privacy.html`: 개인정보처리방침 페이지 (10개 조항, 개인정보보호법 요구사항 반영)
    - 푸터 링크를 실제 페이지로 연결
- **[seoulsurvival] 게임 설정 UI 개선**
  - 로그인 상태에 따른 버튼 표시/숨김 개선:
    - `shared/auth/ui.js`의 `setUI()` 함수에 컨테이너 표시/숨김 로직 추가
    - 인라인 스타일 `display:flex` 우선순위 문제 해결 (`style.display` 직접 설정)
    - 로그인 시: Google 버튼 숨김, 로그아웃 버튼 표시
    - 로그아웃 시: Google 버튼 표시, 로그아웃 버튼 숨김
  - GitHub 로그인 제거: GitHub 버튼 및 관련 코드 제거
  - 설정 섹션 재구성:
    - 시각 효과/숫자 표시를 최상단으로 이동
    - 저장 관리 영역 통합: 클라우드 저장/불러오기 + 저장 정보 + 저장 내보내기/가져오기
    - 게임 새로 시작 분리: 위험 작업으로 별도 섹션 분리
    - 키보드 단축키 영역 제거
    - 게임 정보를 최하단으로 이동
  - 저장 관리 UI 개선:
    - 설명 개선: 클라우드 저장 기능 명확화, 자동 플러시 동작 설명
    - 비로그인 상태 UI 숨김: 클라우드 관련 UI는 로그인 시에만 표시, 게스트 안내 문구 추가
    - 로컬 저장 내보내기/가져오기 숨김 처리 (`display: none`)
  - 중복 로그인 버튼 제거: "로그인(기본: Google)" 버튼 제거, Google 버튼만 유지
  - 불필요한 설명 문구 제거: "로그인은 허브/모든 게임에서 공통으로 동작하도록 개발 중입니다." 제거
- **[shared/auth] 인증 시스템 개선**
  - `shared/auth/ui.js`: 로그인 상태에 따라 버튼 표시/숨김 로직 통합
  - `seoulsurvival/src/main.js`: 중복 로직 제거, 단순화
  - `await getUser()` 오류 수정: IIFE로 감싸서 async 컨텍스트 문제 해결

## 2025-12-16
- **UI**
  - 노동 탭: 직급(`currentCareer`) 표기를 승진 프로그레스 카드 영역으로 이동(모바일 가려짐 개선)
  - 승진 남은 클릭 수에 천단위 콤마 적용
  - 모바일: 일기장(로그) 높이 약간 축소
  - 설정: “온라인 플레이” → “홈페이지 이동” 문구 변경
  - 통계 탭: 성장 속도/마일스톤/시간당 수익이 2줄로 떨어지는 현상 완화(폰트/nowrap)
  - 허브(루트 `/`)를 “게임 1개 집중” 넷플릭스 톤으로 재구성:
    - 히어로(도트 야경) + 앵커 섹션(`#about`, `#screenshots`, `#account`)
    - CTA는 `플레이`/`자세히` 2개로 단순화
    - KO/EN i18n 추가(`?lang=` + LocalStorage + navigator fallback), 추후 JP/CN 확장 전제
    - 링크/에셋 경로는 Vite `base: './'`에 맞춰 상대 경로 유지
  - 소셜 로그인(SSO) 초기 스캐폴딩 추가(허브/게임 공통):
    - `shared/auth/*` + `shared/authBoot.js`로 허브(`/`)와 게임(`/seoulsurvival/`)에서 동일 로그인 상태 공유 기반 마련
    - Supabase Auth(OAuth) 연결을 전제로 하며, `shared/auth/config.js`에 프로젝트 키 설정 필요
    - MVP: Kakao는 보류, Google(GitHub 옵션)만 우선 연결
  - 클라우드 세이브(MVP) 추가:
    - 게스트는 기존처럼 로컬 저장만 유지
    - 로그인 사용자는 설정 탭에서 “클라우드 저장/불러오기”로 Supabase `game_saves`에 저장
    - 테이블/RLS는 `supabase/game_saves.sql`로 관리
    - 클라우드 자동 플러시: 로그인 상태에서 탭 숨김/닫기 시에만 자동 업로드 (토글 제거, 항상 ON, 120초 디바운스 제거)
- **밸런스**
  - CEO 달성 기준을 누적 10,000 클릭으로 조정(직급 간격 확대)
  - 노동 업그레이드 해금 조건을 직급(careerLevel) 기반으로 재정렬
  - 통계 숫자 포맷: 짧은 숫자 ON에서 소수점 자릿수 고정(깜빡임 감소)
- **도구**
  - `tools/extractUpgrades.mjs`: 업그레이드 표를 자동 추출/정리하는 스크립트 추가
  - `upgrade_report.md`는 생성물이므로 `.gitignore`로 제외
- **문서/운영**
  - `ARCHITECTURE.md`/`BALANCE_NOTES.md`/`DEVLOG.md` 도입으로 세션 컨텍스트 복원 강화
  - `README.md`의 부팅 프롬프트를 “능동형(문서→구현→검증→문서/깃 정리)”으로 확장
  - 서비스 URL 맥락 명시:
    - 허브: `http://clicksurvivor.com/`
    - 게임: `https://clicksurvivor.com/seoulsurvival/`
  - 폴더 구조 정리(옵션 A): `src/`, `assets/` → `seoulsurvival/src/`, `seoulsurvival/assets/` 로 이동(게임 완전 독립)
  - 루트 `index.html`은 더 이상 리다이렉트가 아니라 **허브(준비 중) 페이지**로 변경
  - `tools/extractUpgrades.mjs`는 `seoulsurvival/src/main.js`를 읽도록 경로 수정

## “다음에 재개할 때” 체크리스트
- 새 세션에서는 `ARCHITECTURE.md` → `BALANCE_NOTES.md` → `DEVLOG.md` 순으로 읽고 시작
- 레거시 주의: `seoulsurvival/src/main.js`에 통계 탭 업데이트 로직이 남아 있고 `seoulsurvival/src/ui/statsTab.js`도 존재(호출 경로 확인 필요)

## 버전 기록 룰(간단)
- 배포/공개 전에 버전을 올렸다면, `vX.Y.Z`와 변경 요약(3~8줄)을 DEVLOG에 남긴다.

### 리더보드 쓰기/읽기 정합성 메모
- **쓰기(Write)**: 게임 진행 중 `saveGame()` 호출 시 `updateLeaderboardEntry()`가 불려, Supabase `leaderboard` 테이블에 `nickname / total_assets / play_time_ms`를 업서트한다.
- **읽기(Read)**: 랭킹 탭의 `updateLeaderboardUI()`는 항상 Supabase 서버에 저장된 값을 기준으로 `getLeaderboard()`/`getMyRank()`를 호출해 Top 10과 내 순위를 표시한다.
- **즉시 최신화가 아닌 이유**: 리더보드 쓰기는 게임 저장 이벤트에 묶여 있고, 읽기는 랭킹 탭이 화면에 보일 때 **매 분(정각 기준) 1회** 폴링 + 네트워크/타임아웃/권한 에러 처리 후 UI를 갱신하기 때문에, 저장 직후 한두 번의 폴링 주기 지연이 있을 수 있다.
- **PC 레이아웃**: 데스크톱에서는 탭 active 여부 대신 IntersectionObserver로 랭킹 영역이 실제로 화면에 보이는 동안에만 폴링을 수행하므로, 숨겨진 상태에서 불필요한 호출은 하지 않는다.
- **요약**: 리더보드는 “최근 저장된 서버 상태”를 보여주며, 저장 빈도/탭 노출/네트워크 상태에 따라 체감상 약간의 지연이 발생할 수 있지만, 무한 로딩 대신 명시적인 에러/갱신 시각 UI로 상태를 노출한다.

