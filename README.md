# Capital Clicker: Seoul Survival (v1.0)

브라우저 기반 자본 축적 클리커 게임 (Cookie Clicker 감성 + 서울 생존 테마)

## 🎮 게임 소개

클릭(노동)으로 돈을 벌고, 금융상품과 부동산에 투자해 자본을 증식시키는 클리커 게임입니다.  
알바에서 시작해 CEO까지 승진하고, 시장 이벤트에 맞춰 포지션을 조정해보세요.

## ▶️ 플레이

- **Online**: `https://sangbal.github.io/seoul-survival/`
- **Hub(홈페이지)**: `http://clicksurvivor.com/`
- **Game(현재 서비스 경로)**: `https://clicksurvivor.com/seoulsurvival/`
- **Repo**: `https://github.com/sangbal/seoul-survival`

> 참고: 루트(`/`)는 허브(준비 중) 페이지이며, 게임은 `/seoulsurvival/`에서 플레이합니다.

## ✨ 주요 특징(v1.0)

- **다국어 지원(i18n)**: 한국어/영어 지원, URL 파라미터(`?lang=ko|en`) 및 Settings 탭에서 언어 변경 가능, 허브와 언어 설정 동기화 (`localStorage` 키 공유)
- **허브 홈페이지**: 넷플릭스 스타일 게임 허브, 로고 이미지, 구조화된 푸터, 이용약관/개인정보처리방침
- **소셜 로그인(SSO)**: Google 로그인으로 허브와 게임 간 동일 로그인 상태 공유
- **클라우드 저장**: 로그인 사용자는 탭 숨김/닫기 시 자동 클라우드 저장, 수동 저장/불러오기 지원
- **리더보드**: 닉네임 기반 TOP 10 리더보드 (총 자산, 플레이타임, 서울타워 개수), **랭킹 탭**에서 확인 가능 (내 순위 + 글로벌 TOP 10)
- **프레스티지 시스템**: 서울타워(🗼) 구매 시 엔딩 모달 표시, 리더보드에 타워 이모지 표시, 순위는 타워 개수 우선 → 자산 순
- **노동/커리어**: 알바 → CEO (직급별 야간 도트 배경)
- **투자(순차 해금)**: 예금 → 적금 → 국내주식 → 미국주식 → 코인 → 빌라 → … → 빌딩 → 서울타워
- **업그레이드**: 해금/구매 기반 업그레이드 시스템(노동/금융/부동산/전역)
- **시장 이벤트(TO-BE)**:
  - 총 12개 이벤트
  - 이벤트당 **최대 5개 상품만 영향** (나머지 1.0)
  - [투자]에서 **x배수 배지 + 이벤트 바(이벤트명/남은시간)**로 즉시 확인
- **일기장(로그)**: 독백(감성)과 시스템 메시지(정보)를 **폰트/색으로 분리**
- **반응형 UI**: PC(5패널 멀티 컬럼) / 태블릿(2열) / 모바일(탭 네비)
- **저장**: LocalStorage 자동 저장 (5초마다)
- **모바일 iOS UX**: 연속 탭 시 화면 확대(더블탭/핀치 줌) 방지
- **공유**: Web Share API 기반(지원 기기에서 공유 UI 호출)
- **인앱 브라우저 안내**: 카카오톡/인스타그램 등 인앱 브라우저에서 접속 시 Google 로그인 제한 안내 및 기본 브라우저 사용 권장 배너 표시

## 🧑‍💻 로컬 개발(Vite)

```bash
npm install
npm run dev
```

기본 주소는 `http://localhost:5173/` 입니다.
- 허브: `http://localhost:5173/`
- 게임: `http://localhost:5173/seoulsurvival/`

## 🔐 소셜 로그인(SSO) 도입(초기 스캐폴딩)

허브(`/`)와 하위 게임(`/seoulsurvival/` 등)에서 **동일한 로그인 상태**를 공유하기 위해, 공통 Auth 모듈을 추가했습니다.

- **공통 엔트리**: `shared/authBoot.js`
- **설정 파일(필수)**: `shared/auth/config.js`
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`를 실제 값으로 교체해야 로그인 동작
  - 상태 저장 키는 `AUTH_STORAGE_KEY = 'clicksurvivor-auth'`로 고정(허브/게임 간 공유)

현재 UI는 허브와 게임 설정 탭에서 아래를 제공합니다:
- 로그인: Google 로그인 버튼 (허브 계정 섹션, 게임 설정 탭)
- 로그인 상태에 따라 동적 UI 표시 (로그인 시: 로그아웃 버튼, 로그아웃 시: 로그인 버튼)
- 로그인 상태/사용자 표시, 로그아웃

> 주의: 키를 설정하기 전에는 “SSO 설정 필요” 상태로 표시되며 로그인은 동작하지 않습니다.

## ☁️ 클라우드 세이브 (로그인 사용자만)

정책(MVP):
- **게스트**: 기존처럼 브라우저 LocalStorage에만 저장 (5초마다 자동 저장)
- **로그인 사용자**: 
  - 로컬 저장: 5초마다 자동 저장 (게스트와 동일)
  - 클라우드 저장: 탭 숨김/닫기 시 자동 플러시 (토글 없음, 항상 ON)
  - 수동 저장: 설정 탭에서 "☁️ 클라우드 저장" 버튼으로 즉시 업로드

### Supabase 테이블 생성(필수)
Supabase SQL Editor에서 아래 SQL을 1회 실행하세요:
- `supabase/game_saves.sql` (클라우드 세이브용)
- `supabase/leaderboard.sql` (리더보드용, 프레스티지 시스템 포함)
  - 참고: 기존 리더보드 테이블이 있다면 `supabase/leaderboard-migration-tower-count.sql`을 실행하여 `tower_count` 컬럼 추가
- `supabase/nickname_registry.sql` (닉네임 유니크 시스템용, **필수**)
  - 리더보드에서 닉네임 중복을 방지하기 위한 글로벌 유니크 시스템
  - 이 테이블이 없으면 닉네임 변경 기능이 정상 작동하지 않습니다

이후 게임 설정 탭(👤 계정)에서:
- **☁️ 클라우드 저장**: 현재 로컬 저장을 클라우드로 즉시 업로드
- **☁️ 클라우드 불러오기**: 클라우드 저장을 로컬에 덮어쓰기 후 새로고침
- **자동 플러시**: 탭을 숨기거나 닫을 때 자동으로 클라우드에 업로드 (로그인 사용자만, 토글 없음)

> 주의: 브라우저 크래시/강제 종료 시에는 자동 플러시가 실행되지 않을 수 있습니다 (best-effort). 중요한 진행 상황은 수동 저장 버튼을 사용하세요.

## 🏷️ 닉네임 정책

리더보드에서 닉네임은 **고유 식별자**로 사용되며, 게임 전체에서 **유니크(중복 불가)**합니다.

### 닉네임 규칙

- **길이**: 1~6자
- **허용 문자**: 한글/영문/숫자/밑줄(`_`)만 허용
- **공백**: 불허
- **정규화**: NFC 정규화 + 대소문자 구분 없음 (예: "Steve"와 "steve"는 동일)
- **유니크 보장**: DB 레벨 UNIQUE 제약으로 전역 유니크 보장
- **금칙어 필터**: 욕설/비하/시스템 키워드 포함 닉네임은 사용 불가
- **변경 쿨타임**: 30초 (스팸 방지)

### 닉네임 변경

- **설정 탭** → **계정 (소셜 로그인)** 섹션에서 닉네임 변경 가능
- 로그인 사용자: 닉네임 변경 시 즉시 리더보드에 반영
- 비로그인 사용자: 로컬 저장만 가능, 리더보드 반영은 로그인 필요

### 닉네임 회수 정책

- **계정 탈퇴** 시 닉네임이 자동으로 해제되어 다른 사용자가 사용할 수 있게 됩니다
- 단순 로그아웃 또는 게임 데이터 초기화는 닉네임 회수 대상이 아닙니다

### Supabase 키 준비(필수)
1) Supabase 대시보드에서 프로젝트 생성
2) **Settings → API**에서 아래 2개를 복사해 로컬 `.env.local` (또는 `.env`) 에 입력
   - `VITE_SUPABASE_URL=https://xxxx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=eyJ...`

> `shared/auth/config.js`는 이제 Vite 환경 변수(`import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`)를 통해 값을 읽어옵니다.
> 로컬에서는 `.env.local`(git 미추적)로, CI/배포에서는 GitHub Secrets/환경 변수로 값을 주입하는 방식을 권장합니다.

### Google 로그인 활성화(권장)
1) Supabase: **Authentication → Providers → Google** 활성화
2) Google Cloud Console에서 OAuth Client 생성 후 Client ID/Secret을 Supabase에 입력
3) Supabase: **Authentication → URL Configuration**
   - Site URL: `https://clicksurvivor.com`
   - Additional Redirect URLs에 아래를 추가(최소)
     - `http://localhost:5173/`
     - `http://localhost:5173/seoulsurvival/`
     - `https://clicksurvivor.com/`
     - `https://clicksurvivor.com/seoulsurvival/`

## 🤖 Cursor 바이브 코딩(세션 컨텍스트 유지)

새 프롬프트/새 창에서 AI가 프로젝트 맥락을 잃지 않도록, 아래 문서들을 유지합니다:
- `ARCHITECTURE.md`: 파일 구조/데이터 흐름 요약
- `BALANCE_NOTES.md`: 난이도/밸런스 의도 기록
- `DEVLOG.md`: 작업 로그(최근 변경/주의사항)

### “부팅 프롬프트” (새 세션에서 그대로 붙여넣기)

```text
너는 Cursor에서 동작하는 전담 개발 에이전트다. 나는 코드를 직접 수정하지 않는다(바이브 코딩).
목표: 내가 말한 요구사항을 끝까지 구현하고, 검증/정리/기록(문서)까지 완료해라.

[모드 확인]
- 현재가 Ask 모드면, “Agent 모드로 전환해달라”고 먼저 요청하고 진행을 멈춰라.
- Agent 모드면, 아래 순서대로 즉시 실행해라.

[0) 컨텍스트 부팅(필수)]
- 아래 파일을 순서대로 읽고, 핵심을 10~20줄로 요약한 뒤 시작해라:
  1) ARCHITECTURE.md
  2) BALANCE_NOTES.md
  3) DEVLOG.md(최신)
  4) README.md
- 서비스 URL 규칙(중요):
  - 허브(홈): http://clicksurvivor.com/
  - 게임(현재 경로): https://clicksurvivor.com/seoulsurvival/
  - 루트(`/`)는 허브(준비 중) 페이지, 게임은 `/seoulsurvival/` 서브패스

[1) 작업 방식]
- 내가 준 요구사항을 3~7개 체크리스트로 분해해서 제시하고, 바로 구현에 들어가라.
- 근거 없는 추측 금지: grep/검색으로 실제 코드 위치를 찾고 관련 파일만 읽어라.
- UI 수정 시 중복 파일 동기화 여부를 먼저 확인해라:
  - 게임 UI는 `seoulsurvival/index.html` (루트 `index.html`은 허브)
- 레거시 주의:
  - 통계 로직이 seoulsurvival/src/main.js(레거시)와 seoulsurvival/src/ui/statsTab.js(모듈)에 공존한다. 호출 경로 확인 후 수정해라.
- Windows/PowerShell 주의:
  - `&&`, `head` 같은 명령은 그대로 쓰지 말고 PowerShell 호환으로 실행해라.

[2) 품질/검증]
- 변경 후 최소 1개는 반드시 수행:
  - npm run dev 로 실행 확인 (또는 build/preview)
- 중요한 화면 체크:
  - mobile: workTab/statsTab, 헤더 가림, 텍스트 줄바꿈, 버튼 영역
  - 저장/로드(LocalStorage) 정상 동작 여부
- 변경 이유(3~8줄) + 수정한 파일/함수 위치를 함께 남겨라.

[3) 문서 업데이트 룰]
- 매 세션 종료 시 DEVLOG.md에 "오늘 한 일/의도/주의점"을 5~15줄 추가해라.
- 구조/배포/URL/레거시 경로가 바뀌면 ARCHITECTURE.md를 업데이트해라.
- 실행/배포/유저-facing 정보가 바뀌면 README.md를 업데이트해라.
- **버전/패치노트 반영**: 작업 종료 전 반드시 버전/패치노트 반영 여부를 체크하고, 해당 변경이 배포/사용자 영향이 있으면 버전을 올린다.
  - 버전 변경이 없더라도 패치노트는 누적한다(권장). 단, 너무 잦으면 묶어서 기록해도 됨.
  - 자세한 규칙은 README의 "🧾 버전 관리 / 릴리즈 노트" 섹션 참조.

[4) Git 룰]
- 작업 시작: git status 확인
- 작업 종료: git diff --stat 확인
- 생성물(예: upgrade_report.md)은 커밋하지 말고 .gitignore 처리해라.
- 기본은 commit까지만 한다. push는 내가 “푸시해”라고 말할 때만 해라.

이제부터 내가 요구사항을 줄 테니, 위 규칙대로 ‘컨텍스트 부팅’부터 시작해라.
```

## 🚀 GitHub Pages 배포

### 1) GitHub Actions (권장)

이 레포에는 `main` 브랜치 push 시 자동으로 빌드/배포하는 워크플로우가 포함돼 있습니다.

- 워크플로우 파일: `.github/workflows/deploy.yml`
- 동작 방식:
  1. `main` 브랜치에 push → Actions에서 `Deploy to GitHub Pages` 워크플로우 실행
  2. `npm ci` → `npm run build` → `dist/`를 `gh-pages` 브랜치로 배포
  3. `clicksurvivor.com`에 대한 `CNAME`을 함께 설정 (`cname: clicksurvivor.com`)
- 준비 사항:
  - 레포 Settings → Secrets and variables → Actions 에서 아래 2개를 등록
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
  - Settings → Pages:
    - Source: `Deploy from a branch`
    - Branch: `gh-pages` / `/ (root)`

### 2) 수동 배포 스크립트 (로컬에서 git push까지)

프로젝트 루트의 `deploy.bat` 또는 `deploy.ps1`를 사용하면, 로컬 변경사항을 커밋하고 원격에 푸시할 수 있습니다.

```bash
deploy.bat
```

또는

```powershell
.\deploy.ps1
```

## 🧾 버전 관리 / 릴리즈 노트

### 버전 규칙 (SemVer: MAJOR.MINOR.PATCH)

- **현재 버전**: `package.json`의 `version`을 단일 소스 오브 트루스로 사용
- **게임 내 버전 표시**: `package.json`의 `version`이 Vite 빌드 시 자동으로 주입되어 게임 내 설정 > 게임 정보에서 `v${GAME_VERSION}` 형태로 표시됩니다 (하드코딩 금지)
- **PATCH** (예: `1.0.0 → 1.0.1`): 버그 수정, UI/문구/성능 개선, **밸런스 조정(저장/진행 호환 유지)**  
- **MINOR** (예: `1.0.0 → 1.1.0`): 기능 추가/콘텐츠 추가(새 시스템/탭/업그레이드/상품 등), 기본적으로 저장 호환 유지
- **MAJOR** (예: `1.0.0 → 2.0.0`): 저장 형식 변경/리셋 필요/규칙 대개편/URL·구조 변경 등 호환이 깨질 수 있는 변화
- **0.x 버전 규칙(선택)**: 프로토타입 단계에서는 `0.MINOR.PATCH`를 쓰고, 이때 **MINOR를 사실상 MAJOR처럼**(큰 변경) 운용해도 OK

### 자동화된 판단 규칙 (에이전트용)

- **PATCH로 판단하는 경우**:
  - UI 문구/버그 수정/성능 개선/밸런스 조정(저장 호환 유지)
  - 사용자 영향이 작은 변경
- **MINOR로 판단하는 경우**:
  - 기능 추가/콘텐츠 추가/새 탭/새 시스템(저장 호환 유지)
  - 사용자에게 새로운 기능/콘텐츠를 제공하는 변경
- **MAJOR로 판단하는 경우**:
  - 저장 포맷 변경/리셋 필요/URL 구조 변경/호환 깨짐
  - 기존 사용자 데이터에 영향을 주는 변경
- **애매한 경우**: PATCH로 처리하고, 사용자 영향이 크면 MINOR로 승격

### 릴리즈 체크리스트 (에이전트가 매 작업 후 수행)

작업 종료 전 반드시 버전/패치노트 반영 여부를 체크하고, 해당 변경이 배포/사용자 영향이 있으면 버전을 올립니다.

1. **변경 영향 평가**: PATCH/MINOR/MAJOR 중 무엇인지 판단
2. **버전 업데이트**: `package.json`의 `version`을 직접 수정 (필요한 경우)
3. **패치노트 기록**: `RELEASE_NOTES.md`에 변경사항 기록 (버전 변경이 없더라도 누적 권장, 너무 잦으면 묶어서 기록)
   - 포맷: 최신이 위로 오도록 역순
   - 내용: 버전/날짜/핵심 변경 5~10줄, 사용자 영향 중심
4. **DEVLOG 업데이트**: 세션 단위 작업 로그는 계속 `DEVLOG.md`에 기록 (기존 룰 유지)
5. **커밋 메시지**: 버전 변경 시 `Release: vX.Y.Z` 형식 사용
6. **태그 생성**: 버전 변경 시 `git tag vX.Y.Z` (push는 사용자가 "푸시해"라고 할 때만)

### 패치노트 파일

- **위치**: `RELEASE_NOTES.md`
- **포맷**: 최신 버전이 위로 오도록 역순 작성
- **내용**: 버전/날짜/핵심 변경사항(5~10줄), 사용자 영향 중심(버그 수정/UX 변경/데이터 마이그레이션 여부)

## 🐛 버그/제안

GitHub Issues에 남겨주세요.
