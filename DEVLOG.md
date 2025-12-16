# DEVLOG

이 파일은 “매 세션 작업 내역/의도/주의사항”을 짧게 남기는 로그입니다.  
새 프롬프트/새 창에서 시작할 때, AI는 이 파일의 **최근 항목**을 먼저 읽고 맥락을 복원합니다.

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


