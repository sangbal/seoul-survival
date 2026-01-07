# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

ClickSurvivor Hub는 증분/클리커 게임을 호스팅하는 멀티 게임 웹 플랫폼입니다. 메인 게임은 "서울 생존기"로, 직급 승진, 투자, 프레스티지 시스템을 갖춘 증분 게임입니다.

**서비스 URL:**

- 허브: `https://clicksurvivor.com/`
- 서울 생존기: `https://clicksurvivor.com/seoulsurvival/`

## 주의사항

**언어 설정:**

- Claude Code는 **한글**로 소통하세요.
- 코드 주석, 커밋 메시지, 문서 등은 문맥에 따라 한글 또는 영문을 사용합니다.

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # 프로덕션 빌드 (dist/)
npm run preview      # 빌드 프리뷰 (http://localhost:4173)

# 테스트
npm run test         # Playwright E2E 테스트 (빌드 필요)
npm run test:unit    # Vitest 단위 테스트
npm run test:unit:ui # Vitest UI 모드
npm run test:all     # 단위 + E2E 테스트

# 코드 품질
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷팅
npm run type-check   # TypeScript 타입 검사
```

**단일 테스트 실행:**

```bash
npx vitest run path/to/test.js              # 단일 단위 테스트
npx playwright test tests/smoke.spec.js     # 단일 E2E 테스트
```

## 아키텍처

### 멀티페이지 Vite 빌드

`vite.config.js` → `rollupOptions.input`에 정의된 엔트리 포인트:

- `index.html` - 허브 홈페이지
- `seoulsurvival/index.html` - 서울 생존기 게임
- `kimchi-invasion/index.html` - 김치 인베이전 게임
- `account/` - 계정 관리 페이지
- `auth/callback/` - OAuth 콜백 핸들러
- `terms.html`, `privacy.html` - 법적 문서

### 주요 디렉토리

```
shared/              # 게임 간 공유 코드
├── auth/           # Supabase 인증 (Google OAuth)
├── shell/          # 공통 헤더/푸터 컴포넌트
├── i18n/           # 허브 다국어 번역
├── cloudSave.js    # Supabase 클라우드 저장
└── leaderboard.js  # 리더보드 + 닉네임 시스템

seoulsurvival/
├── src/
│   ├── main.js     # 게임 루프, 상태, 업그레이드 (대용량 파일)
│   ├── state/gameState.js  # 중앙 집중식 게임 상태
│   ├── balance/    # 게임 밸런스 상수
│   ├── systems/    # 시장, 업적, 업그레이드 모듈
│   ├── ui/         # UI 모듈 (statsTab, modal, animations)
│   ├── i18n/       # 게임 전용 번역 (ko/en)
│   └── economy/pricing.js  # 가격 계산
└── assets/images/  # 게임 이미지 (허브에서도 사용)

hub/                # 허브 전용 코드
├── main.js        # 허브 엔트리
├── home.js        # 홈페이지 게임 렌더링
└── games.registry.js  # 게임 카탈로그 (단일 소스)
```

### 데이터 흐름 (서울 생존기)

1. **상태**: `seoulsurvival/src/state/gameState.js`에서 모든 게임 변수 관리
2. **게임 루프**: `main.js`에서 틱 루프 실행, `getRps()` 수익 업데이트
3. **저장**: LocalStorage (5초 자동 저장) + Supabase 클라우드 (탭 숨김/닫기 시)
4. **리더보드**: `shared/leaderboard.js`에서 30초마다 Supabase 동기화

### 인증 & 클라우드 시스템

- **인증**: `shared/auth/`를 통한 Supabase + Google OAuth
- **저장 키**: `clicksurvivor-auth` (허브/게임 간 공유)
- **설정**: 환경 변수 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Supabase 테이블**: 스키마는 `supabase/*.sql` 참조

### 다국어(i18n)

- 허브: `shared/i18n/` + `hub/translations/`
- 게임: `seoulsurvival/src/i18n/`
- 언어 동기화: `localStorage.clicksurvivor_lang` 또는 `?lang=ko|en`
- 번역: `t('key')` 함수, 정적 HTML은 `data-i18n` 속성 사용

## 주요 패턴

### 레거시 코드 주의

`seoulsurvival/src/main.js`에 레거시 통계/UI 함수와 `src/ui/` 모듈 코드가 공존합니다. 수정 전 어느 코드 경로가 활성화되어 있는지 반드시 확인하세요.

### 버전 관리

- 단일 소스: `package.json` → `version`
- Vite를 통해 `__APP_VERSION__`으로 자동 주입
- 게임 설정 탭에서 버전 표시

### UI 수정

- 게임 UI: `seoulsurvival/index.html` 수정 (루트 `index.html` 아님)
- 허브 UI: 루트 `index.html` 수정
- 공통 헤더: `shared/styles/universal_header.css`

### 경로 별칭

```javascript
// tsconfig.json / vitest.config.js
'@shared/*'       → './shared/*'
'@seoulsurvival/*' → './seoulsurvival/src/*'
```

## Git & 배포

- **CI/CD**: GitHub Actions에서 `main` 브랜치를 GitHub Pages로 배포 (`gh-pages` 브랜치)
- **Pre-commit**: Husky + lint-staged로 ESLint/Prettier 실행
- **수동 배포**: `deploy.bat` 또는 `deploy.ps1`

## MCP (Model Context Protocol) 설정

Claude Code가 Supabase, Brave Search, 브라우저 자동화 등을 연동하기 위해 MCP 서버를 사용합니다.

### MCP 파일 구조 (MECE 관리)

```
프로젝트 루트:
├── .mcp.json                # ✅ MCP 서버 정의 (Project scope, 커밋 가능)
├── .env.mcp.example         # MCP 환경변수 템플릿 (커밋 가능)
├── .env.mcp                 # 실제 MCP 토큰 ⚠️ .gitignore 등록
├── .env.local               # 개발 환경 변수 ⚠️ .gitignore 등록
└── .gitignore               # 보안 파일 지정

.claude/
├── settings.json            # 글로벌 도구 권한 (커밋 가능)
├── settings.local.json      # 로컬 도구 권한 ⚠️ 절대 커밋 금지
├── agents/
│   └── code-reviewer.md     # 코드 리뷰어 서브에이전트
└── skills/
    └── subagent-creator/    # 서브에이전트 생성 템플릿
```

⚠️ **중요:** MCP 설정 파일은 반드시 **프로젝트 루트의 `.mcp.json`**에 위치해야 합니다.
`.claude/mcp.json`은 유효하지 않은 위치입니다!

**MCP 설정 Scope 체계:**

```
1. User scope:    ~/.claude.json       → `claude mcp list`에 표시됨
2. Local scope:   ~/.claude.json       → `claude mcp list`에 표시됨
3. Project scope: .mcp.json (루트)     → 표시 안 됨, 하지만 작동함 ✅
   ❌ .claude/mcp.json                 → 유효하지 않음!
```

### 활성화된 MCP 서버

| 서버                    | 용도                         | 상태      |
| ----------------------- | ---------------------------- | --------- |
| **supabase**            | 데이터베이스, 인증, 스토리지 | ✅ OAuth  |
| **brave-search**        | 웹 검색 (최신 문서)          | ✅ API 키 |
| **filesystem**          | 로컬 파일시스템              | ✅ 활성   |
| **context7**            | 라이브러리 문서 검색         | ✅ 활성   |
| **sequential-thinking** | 단계별 추론                  | ✅ 활성   |
| **playwright**          | 브라우저 자동화              | ✅ 활성   |
| **sentry**              | 에러 모니터링                | ✅ OAuth  |
| **github**              | GitHub 연동                  | ❌ 미사용 |

### 환경 변수 설정

**`.env.mcp` 구성:**

```bash
# Supabase MCP
SUPABASE_URL=https://nvxdwacqmiofpennukeo.supabase.co
SUPABASE_SERVICE_KEY=eyJ...  # DB 접근 권한

# Brave Search MCP
BRAVE_API_KEY=BSA...  # https://brave.com/search/api/
```

**`.env.local` 구성 (개발용):**

```bash
# Supabase 공개 키 (클라이언트)
VITE_SUPABASE_URL=https://nvxdwacqmiofpennukeo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# GitHub MCP (현재 미사용)
# GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
```

### 보안 관리 체계

⚠️ **절대 금지:**

| 항목                               | 위험성    | 영향                   |
| ---------------------------------- | --------- | ---------------------- |
| 토큰을 소스 코드에 포함            | 🔴 극높음 | 계정 해킹, 리소스 악용 |
| `.env.local` 커밋                  | 🔴 극높음 | 모든 환경변수 노출     |
| `.claude/settings.local.json` 커밋 | 🔴 높음   | 로컬 설정 유출         |
| 커밋 메시지에 토큰 포함            | 🔴 높음   | 히스토리 영구 노출     |

✅ **올바른 방법:**

```bash
# 1. .env.local, .env.mcp에 토큰 저장 (git 제외)
echo ".env.local" >> .gitignore
echo ".env.mcp" >> .gitignore
echo ".claude/settings.local.json" >> .gitignore

# 2. 파워셸에서 환경변수 설정 (로컬 세션용)
$env:SUPABASE_SERVICE_KEY="eyJ..."
$env:BRAVE_API_KEY="BSA..."

# 3. Claude Code MCP 상태 확인
claude mcp list
```

### 토큰 유출 대응

토큰이 실수로 노출된 경우:

```bash
# 1. 즉시 토큰 무효화
# Supabase: https://app.supabase.com > Settings > API Keys > Rotate
# Brave: https://brave.com/search/api/ > Revoke API Key
# GitHub: https://github.com/settings/personal-access-tokens > Delete

# 2. 새 토큰 발급 및 .env.mcp/.env.local 업데이트

# 3. git 히스토리 확인
git log --all -- .env.local .env.mcp
git log --all -- .claude/settings.local.json

# 4. 커밋 메시지 검색 (토큰 유출)
git log --all --grep="ghp_\|eyJ" || echo "히스토리 안전"
```

### MCP 명령어

```bash
# MCP 서버 목록 및 상태 확인 (User/Local scope만)
claude mcp list

# 세션 내 모든 MCP 확인 (Project scope 포함)
/mcp

# GitHub MCP 추가 (필요 시)
# .mcp.json에 github 설정 추가 후:
# GITHUB_PERSONAL_ACCESS_TOKEN=ghp_... .env.mcp에 추가

# MCP 제거
# .mcp.json에서 해당 서버 설정 삭제
```

### `claude mcp list` 표시 규칙

**`claude mcp list`에 표시되는 조건:**

| Scope       | 설정 파일 위치                  | 표시 여부                         |
| ----------- | ------------------------------- | --------------------------------- |
| User        | `~/.claude.json`                | ✅ 표시됨                         |
| Local       | `~/.claude.json` (프로젝트별)   | ✅ 표시됨                         |
| **Project** | **`.mcp.json` (프로젝트 루트)** | ❌ **표시 안 됨** (하지만 작동함) |

**핵심:**

- `claude mcp list`는 **User/Local scope만 표시**
- Project scope (`.mcp.json`)의 MCP는 **표시되지 않지만 정상 작동**
- 세션 내 `/mcp` 명령으로 전체 MCP 확인 가능

**MCP 작동 확인:**

```bash
# 명령줄에서 (User/Local scope만 표시)
claude mcp list

# Claude Code 세션 내에서 (모든 MCP 표시)
/mcp

# Project scope MCP가 작동하는지 확인:
# - brave-search: 웹 검색 기능 사용
# - context7: 라이브러리 문서 검색
# - sequential-thinking: 단계별 추론
# - playwright: 브라우저 자동화
# → 실제 기능 사용 시 작동하면 정상
```

## 밸런스 & 게임 디자인

주요 밸런스 파일:

- `docs/game-design/BALANCE_NOTES.md` - 디자인 철학
- `seoulsurvival/src/balance/` - 직급, 가격, 업그레이드 상수

프레스티지 시스템:

- 서울타워 (1조원) 구매 시 프레스티지 발동
- `towers_run`은 초기화, `towers_lifetime`은 유지
- 리더보드 순위: 타워 개수 우선 → 자산 순
