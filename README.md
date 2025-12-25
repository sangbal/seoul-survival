# ClickSurvivor Hub

게임 허브 웹사이트 (Fresh Start v0.1)

## 페이지 목록

- `/` - Hub 홈페이지
- `/account/` - 계정 관리 페이지
- `/terms.html` - 이용약관
- `/privacy.html` - 개인정보처리방침

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 프리뷰 (http://localhost:4173)
```

## QA

MCP 브라우저 기반 자동 QA로 스모크 테스트 수행.

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

## 🔍 SEO & 공유 프리뷰 운영 가이드

이 섹션은 레포 구조에 맞춘 SEO 및 SNS 공유 프리뷰 관리 방법을 정리합니다.

### 레포 구조 기반 파일 위치

**멀티페이지 엔트리 (Vite 빌드 입력)**:
- 허브 홈: `index.html` (루트)
- 게임: `seoulsurvival/index.html`
- 계정 관리: `account/index.html`
- 약관/개인정보: `terms.html`, `privacy.html`

**Vite 설정**: `vite.config.js`의 `rollupOptions.input`에 정의된 페이지만 빌드됩니다.

**정적 리소스**:
- OG 이미지: `public/og/*.png` → 빌드 시 `dist/og/*.png`로 복사
- 파비콘: `seoulsurvival/assets/images/logo.png` (게임), 허브는 동일 경로 참조
- `public/` 폴더의 모든 파일은 빌드 시 `dist/` 루트로 그대로 복사됨

### 현재 페이지별 메타태그 위치

#### 허브 홈 (`index.html`)

**파일 경로**: 루트 `index.html`의 `<head>` 섹션

**필수 메타태그**:
```html
<link rel="canonical" href="https://clicksurvivor.com/" />
<meta name="description" content="..." />

<meta property="og:site_name" content="ClickSurvivor" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://clicksurvivor.com/" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://clicksurvivor.com/og/clicksurvivor-home-1200x630.png?v=2025-12-21" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://clicksurvivor.com/og/clicksurvivor-home-1200x630.png?v=2025-12-21" />

<meta name="theme-color" content="#0b0f19" />
```

#### 게임 페이지 (`seoulsurvival/index.html`)

**파일 경로**: `seoulsurvival/index.html`의 `<head>` 섹션

**필수 메타태그**: 허브와 동일한 구조, URL과 이미지 경로만 변경
- `og:url`: `https://clicksurvivor.com/seoulsurvival/`
- `og:image`: `https://clicksurvivor.com/og/seoulsurvivor-1200x630.png?v=2025-12-21`
- `canonical`: `https://clicksurvivor.com/seoulsurvival/`

### OG 이미지 관리

**파일 위치**:
- 소스: `public/og/*.png`
- 빌드 후: `dist/og/*.png`
- 배포 URL: `https://clicksurvivor.com/og/*.png`

**규격**:
- 크기: 1200x630px (OG 표준)
- 형식: PNG (또는 JPG)
- 파일명: `{페이지명}-1200x630.png`

**현재 파일**:
- `public/og/clicksurvivor-home-1200x630.png` (허브 홈)
- `public/og/seoulsurvivor-1200x630.png` (게임)

**캐시 무효화**: 이미지 URL에 버전 쿼리(`?v=YYYY-MM-DD`)를 추가하여 SNS 캐시를 우회합니다.

### URL 정책

**Canonical URL**:
- 모든 페이지의 `<head>`에 `<link rel="canonical">` 필수
- 절대 URL 사용: `https://clicksurvivor.com/` 또는 `https://clicksurvivor.com/seoulsurvival/`
- trailing slash 유지: 현재 정책은 슬래시 포함 (`/`, `/seoulsurvival/`)

**OG URL**:
- `og:url`은 `canonical`과 정확히 일치해야 함

### 빌드 후 검증

**로컬 확인**:
```bash
npm run build
# dist/index.html, dist/seoulsurvival/index.html의 <head> 확인
```

**배포 후 확인**:
1. 브라우저에서 "페이지 소스 보기" (View Source)
2. `<head>` 섹션에 메타태그가 포함되어 있는지 확인
3. OG 이미지 URL 직접 접속: `https://clicksurvivor.com/og/*.png` (200 OK 확인)

**SNS 프리뷰 검증 도구**:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

각 도구에 URL을 입력하고 "Scrape Again" 또는 "Refresh"를 실행하여 프리뷰를 확인합니다.

### 새 페이지 추가 시 체크리스트

새 서브홈/페이지를 추가할 때 다음을 수행하세요:

1. **HTML 파일 생성**
   - 예: `games/newgame/index.html` 또는 `games/newgame.html`
   - `<head>` 섹션에 기본 메타태그 추가

2. **Vite 설정 업데이트**
   - `vite.config.js`의 `rollupOptions.input`에 새 페이지 추가:
   ```js
   input: {
     main: resolve(__dirname, 'index.html'),
     seoulsurvival: resolve(__dirname, 'seoulsurvival/index.html'),
     newgame: resolve(__dirname, 'games/newgame/index.html'), // 추가
   }
   ```

3. **SEO 최소 요건**
   - `<title>` 태그 (브라우저 탭 제목)
   - `<meta name="description">` (검색 결과 요약)
   - `<link rel="canonical">` (절대 URL)
   - OG 메타태그 세트 (og:title, og:description, og:url, og:image, og:image:width, og:image:height)
   - Twitter Card 메타태그 (twitter:card, twitter:title, twitter:description, twitter:image)
   - `<meta name="theme-color">` (모바일 브라우저 테마 색상)

4. **OG 이미지 준비**
   - `public/og/{페이지명}-1200x630.png` 생성
   - 메타태그의 `og:image` URL에 절대 경로 지정

5. **빌드 및 검증**
   ```bash
   npm run build
   # dist/ 폴더에 새 HTML이 생성되었는지 확인
   # 메타태그가 포함되었는지 View Source로 확인
   ```

### robots.txt / sitemap.xml (선택사항)

현재 레포에는 `robots.txt`와 `sitemap.xml`이 없습니다. 필요 시:

**추가 방법**:
- `public/robots.txt` 생성 → 빌드 시 `dist/robots.txt`로 복사
- `public/sitemap.xml` 생성 → 빌드 시 `dist/sitemap.xml`로 복사

**예시 `public/robots.txt`**:
```
User-agent: *
Allow: /
Sitemap: https://clicksurvivor.com/sitemap.xml
```

**예시 `public/sitemap.xml`**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://clicksurvivor.com/</loc>
    <lastmod>2025-12-21</lastmod>
  </url>
  <url>
    <loc>https://clicksurvivor.com/seoulsurvival/</loc>
    <lastmod>2025-12-21</lastmod>
  </url>
</urlset>
```

### 주의사항

- **SPA 라우팅과 OG**: 현재는 정적 HTML 엔트리만 사용하므로 문제 없음. 향후 SPA 라우팅을 도입할 경우 서버 사이드 렌더링(SSR) 또는 정적 HTML 프리렌더링 필요
- **이미지 캐시**: OG 이미지를 업데이트한 후 버전 쿼리(`?v=YYYY-MM-DD`)를 변경하거나 파일명을 변경해야 SNS 캐시가 갱신됨
- **절대 URL 필수**: `og:image`, `og:url`, `canonical`은 반드시 절대 URL(`https://...`) 사용

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
