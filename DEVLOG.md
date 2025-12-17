# DEVLOG

이 파일은 "매 세션 작업 내역/의도/주의사항"을 짧게 남기는 로그입니다.  
새 프롬프트/새 창에서 시작할 때, AI는 이 파일의 **최근 항목**을 먼저 읽고 맥락을 복원합니다.

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
- **즉시 최신화가 아닌 이유**: 리더보드 쓰기는 게임 저장 이벤트에 묶여 있고, 읽기는 랭킹 탭이 화면에 보일 때 10초 간격 폴링 + 네트워크/타임아웃/권한 에러 처리 후 UI를 갱신하기 때문에, 저장 직후 한두 번의 폴링 주기 지연이 있을 수 있다.
- **PC 레이아웃**: 데스크톱에서는 탭 active 여부 대신 IntersectionObserver로 랭킹 영역이 실제로 화면에 보이는 동안에만 폴링을 수행하므로, 숨겨진 상태에서 불필요한 호출은 하지 않는다.
- **요약**: 리더보드는 “최근 저장된 서버 상태”를 보여주며, 저장 빈도/탭 노출/네트워크 상태에 따라 체감상 약간의 지연이 발생할 수 있지만, 무한 로딩 대신 명시적인 에러/갱신 시각 UI로 상태를 노출한다.

