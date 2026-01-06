# ClickSurvivor 프로젝트 개선 방안

> 생성일: 2026-01-05
> 현재 버전: v1.2.2
> 분석 기준: MCP 설정 완료 후

---

## 📊 현재 상태 요약

### ✅ 잘 되어 있는 것
- Vite 6 최신 빌드 시스템
- Playwright E2E 테스트 프레임워크
- GitHub Actions 자동 배포 파이프라인
- Supabase 백엔드 통합 (Auth, DB, Edge Functions)
- 다국어 지원 (i18n)
- 상세한 문서화 (ARCHITECTURE.md, DEVLOG.md)

### ⚠️ 개선이 필요한 것
- 코드 품질 도구 부재 (Linter, Formatter)
- 단위 테스트 없음 (E2E만 존재)
- TypeScript 설정 부분적 (MMA Manager만)
- Seoul Survival main.js 9,789줄 (모듈화 필요)
- 레거시 코드 정리 필요
- 성능 모니터링 도구 부재
- CI/CD 파이프라인 개선 여지

---

## 🎯 개선 방안 (우선순위별)

## 우선순위 1: 코드 품질 도구 설정 (즉시 실행 가능)

### 1.1 ESLint + Prettier 설정

**목적**: 코드 스타일 통일, 잠재적 버그 방지
**난이도**: ⭐ (쉬움)
**소요 시간**: 30분
**효과**: ⭐⭐⭐⭐⭐

#### 설치 패키지
```bash
npm install -D eslint prettier
npm install -D eslint-plugin-react eslint-plugin-react-hooks
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint-config-prettier eslint-plugin-prettier
```

#### 설정 파일
- `.eslintrc.json` - ESLint 규칙
- `.prettierrc.json` - 코드 포맷팅 규칙
- `.prettierignore` - 포맷팅 제외 파일

#### package.json 스크립트 추가
```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\""
  }
}
```

#### 예상 효과
- 9,789줄 Seoul Survival main.js에서 잠재적 버그 발견 가능
- 코드 스타일 자동 통일
- VSCode/Cursor 자동 포맷팅 지원

---

### 1.2 TypeScript 마이그레이션 (단계적)

**목적**: 타입 안전성, 리팩토링 신뢰도 향상
**난이도**: ⭐⭐⭐ (중간)
**소요 시간**: 1-2주 (단계적)
**효과**: ⭐⭐⭐⭐

#### Phase 1: TypeScript 설정 추가
```bash
npm install -D typescript
npx tsc --init
```

#### Phase 2: 우선 순위별 마이그레이션
1. **공통 모듈** (`shared/`) - 가장 많이 재사용됨
   - `shared/auth/config.js` → `config.ts`
   - `shared/cloudSave.js` → `cloudSave.ts`
   - `shared/leaderboard.js` → `leaderboard.ts`

2. **새 게임** (MMA Manager는 이미 TS)
   - Kimchi Invasion (작은 규모)

3. **Seoul Survival** (나중에, 리팩토링 후)

#### package.json 스크립트 추가
```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch"
  }
}
```

---

## 우선순위 2: 테스트 커버리지 확대

### 2.1 Vitest 단위 테스트 추가

**목적**: 빠른 피드백 루프, 리팩토링 안정성
**난이도**: ⭐⭐ (보통)
**소요 시간**: 1주
**효과**: ⭐⭐⭐⭐⭐

#### 설치
```bash
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
```

#### package.json 스크립트
```json
{
  "scripts": {
    "test:unit": "vitest",
    "test:unit:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:all": "npm run test:unit && npm run test"
  }
}
```

#### 우선 테스트 작성 대상
1. **경제 시스템** (`seoulsurvival/src/economy/`)
   - 가격 계산 로직
   - 수익 계산 로직

2. **공통 유틸리티** (`shared/`)
   - `cloudSave.js` 저장/로드 로직
   - `i18n/` 번역 함수

3. **MMA Manager 시스템** (`mma-manager/src/systems/`)
   - `fightSim.ts` 전투 시뮬레이션
   - `economyEngine.ts` 경제 엔진

#### 예상 커버리지 목표
- Phase 1: 30% (핵심 로직)
- Phase 2: 50% (대부분 로직)
- Phase 3: 70%+ (UI 제외)

---

### 2.2 테스트 자동화 (GitHub Actions)

**목적**: PR 병합 전 자동 검증
**난이도**: ⭐ (쉬움)
**소요 시간**: 30분
**효과**: ⭐⭐⭐⭐

#### `.github/workflows/test.yml` 생성
```yaml
name: Test

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:unit
      - run: npm run build
      - run: npm run test  # E2E
```

---

## 우선순위 3: 코드 리팩토링

### 3.1 Seoul Survival main.js 모듈 분리 (9,789줄 → 분산)

**목적**: 유지보수성, 가독성, 테스트 용이성 향상
**난이도**: ⭐⭐⭐⭐ (어려움)
**소요 시간**: 2-3주
**효과**: ⭐⭐⭐⭐⭐

#### 현재 구조 분석
```
seoulsurvival/src/main.js (9,789줄)
  ├─ 전역 상태 변수들 (~200줄)
  ├─ 초기화 함수들 (~500줄)
  ├─ 게임 루프 (~300줄)
  ├─ UI 업데이트 (~1,000줄)
  ├─ 이벤트 핸들러 (~2,000줄)
  ├─ 비즈니스 로직 (~3,000줄)
  └─ 기타 (~2,789줄)
```

#### 목표 구조
```
seoulsurvival/src/
  ├─ main.js (엔트리 포인트, ~200줄)
  ├─ state/
  │   ├─ gameState.js (전역 상태)
  │   └─ saveLoad.js (저장/로드)
  ├─ systems/
  │   ├─ gameLoop.js (게임 루프)
  │   ├─ economy.js (경제 시스템)
  │   ├─ achievements.js (업적 시스템)
  │   ├─ market.js (시장 시스템)
  │   └─ upgrades.js (업그레이드 시스템)
  ├─ ui/
  │   ├─ domRefs.js (DOM 참조)
  │   ├─ domUtils.js (DOM 유틸)
  │   ├─ tabs/ (탭별 UI)
  │   └─ modals/ (모달 UI)
  └─ utils/
      ├─ formatters.js (숫자 포맷팅)
      └─ validators.js (유효성 검사)
```

#### 마이그레이션 전략
1. **Phase 1**: 유틸리티 함수 분리 (1주)
2. **Phase 2**: 시스템 모듈 분리 (1주)
3. **Phase 3**: UI 모듈 분리 (1주)
4. **Phase 4**: 통합 테스트 + 버그 수정

#### 사용할 도구
- Sequential Thinking MCP로 의존성 분석
- AST 파서로 함수 추출 자동화 가능

---

### 3.2 레거시 코드 정리

**목적**: 저장소 크기 감소, 혼란 방지
**난이도**: ⭐ (쉬움)
**소요 시간**: 1시간
**효과**: ⭐⭐

#### 정리 대상
```bash
./legacy/                          # 레거시 게임 코드
./mma-promotion-manager/backup/   # 백업 폴더
./mma-manager.zip                  # 압축 파일
./*.backup                         # 백업 파일들
```

#### 정리 방법
1. **아카이브 브랜치 생성** (삭제 전 백업)
   ```bash
   git checkout -b archive/legacy-code-2026-01
   git add legacy/ mma-promotion-manager/backup/
   git commit -m "Archive: Legacy code before cleanup"
   git push origin archive/legacy-code-2026-01
   ```

2. **main 브랜치에서 삭제**
   ```bash
   git checkout main
   git rm -r legacy/ mma-promotion-manager/backup/
   git rm mma-manager.zip
   git commit -m "Clean: Remove legacy and backup folders"
   ```

3. **예상 효과**
   - 저장소 크기 ~20% 감소
   - 코드 탐색 속도 향상

---

## 우선순위 4: 성능 최적화

### 4.1 번들 크기 분석 및 최적화

**목적**: 로딩 속도 개선
**난이도**: ⭐⭐ (보통)
**소요 시간**: 3일
**효과**: ⭐⭐⭐⭐

#### 도구 설치
```bash
npm install -D rollup-plugin-visualizer
```

#### vite.config.js 수정
```js
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [
    visualizer({ open: true, filename: 'dist/stats.html' })
  ]
}
```

#### 최적화 전략
1. **코드 스플리팅** - 게임별 청크 분리
2. **트리 셰이킹** - 미사용 코드 제거
3. **이미지 최적화** - WebP 변환, lazy loading
4. **동적 임포트** - 필요 시점에만 로드

---

### 4.2 성능 모니터링 (Lighthouse CI)

**목적**: 성능 회귀 방지
**난이도**: ⭐⭐ (보통)
**소요 시간**: 1일
**효과**: ⭐⭐⭐

#### GitHub Actions 통합
```yaml
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

#### 목표 점수
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100

---

## 우선순위 5: 개발 경험 개선

### 5.1 Pre-commit Hook (Husky)

**목적**: 커밋 전 자동 검증
**난이도**: ⭐ (쉬움)
**소요 시간**: 30분
**효과**: ⭐⭐⭐⭐

#### 설치
```bash
npm install -D husky lint-staged
npx husky init
```

#### `.husky/pre-commit`
```bash
#!/bin/sh
npx lint-staged
```

#### `package.json`
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

---

### 5.2 VSCode 프로젝트 설정

**목적**: 팀원 간 개발 환경 통일
**난이도**: ⭐ (쉬움)
**소요 시간**: 15분
**효과**: ⭐⭐⭐

#### `.vscode/settings.json` 생성
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.associations": {
    "*.css": "css"
  }
}
```

#### `.vscode/extensions.json`
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-playwright.playwright"
  ]
}
```

---

## 우선순위 6: 모니터링 & 분석

### 6.1 에러 트래킹 (Sentry)

**목적**: 프로덕션 에러 실시간 감지
**난이도**: ⭐⭐ (보통)
**소요 시간**: 1일
**효과**: ⭐⭐⭐⭐

#### 무료 플랜
- 월 5,000 이벤트
- 1개 프로젝트

#### 통합 방법
```bash
npm install @sentry/browser
```

```js
// shared/errorTracking.js
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1
})
```

---

### 6.2 사용자 분석 개선 (Google Analytics 4)

**목적**: 플레이어 행동 분석
**난이도**: ⭐ (쉬움)
**소요 시간**: 2시간
**효과**: ⭐⭐⭐

#### 커스텀 이벤트 추적
- 게임별 플레이 시간
- 타워 구매 횟수
- 업그레이드 선택 패턴
- 리더보드 등록률

---

## 🚀 실행 로드맵

### Week 1-2: 기초 인프라
- [ ] ESLint + Prettier 설정
- [ ] Husky pre-commit hook
- [ ] TypeScript 설정 (공통 모듈)
- [ ] Vitest 설치 + 첫 테스트 작성

### Week 3-4: 테스트 & CI
- [ ] 단위 테스트 확대 (30% 커버리지)
- [ ] GitHub Actions 테스트 워크플로우
- [ ] 레거시 코드 정리

### Month 2: 리팩토링
- [ ] Seoul Survival main.js 모듈 분리
- [ ] 공통 모듈 TypeScript 마이그레이션
- [ ] 번들 크기 최적화

### Month 3: 고급 기능
- [ ] Sentry 에러 트래킹
- [ ] Lighthouse CI
- [ ] 테스트 커버리지 70%+

---

## 📊 예상 효과

| 개선 항목 | 현재 | 목표 | 기대 효과 |
|----------|------|------|----------|
| 코드 품질 | 수동 관리 | ESLint + Prettier | 버그 30% 감소 |
| 테스트 커버리지 | E2E만 | 70%+ | 리팩토링 신뢰도 ↑ |
| 번들 크기 | 측정 안 됨 | 20% 감소 | 로딩 속도 ↑ |
| 타입 안전성 | 부분적 | 전체 TS | 런타임 에러 50% 감소 |
| 배포 안정성 | 수동 검증 | 자동 CI/CD | 배포 실패 80% 감소 |

---

## 💡 즉시 시작 가능한 항목

1. **ESLint + Prettier 설정** (30분)
2. **레거시 코드 정리** (1시간)
3. **VSCode 프로젝트 설정** (15분)
4. **GitHub Actions 테스트 워크플로우** (30분)

---

## ❓ 다음 단계

이 중 어떤 개선 사항부터 진행하시겠습니까?

1. 즉시 실행 (ESLint + Prettier)
2. 단계별 계획 수립
3. 특정 항목 상세 설명
4. 전체 자동화 스크립트 작성
