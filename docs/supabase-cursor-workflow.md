# Cursor에서 Supabase 작업 가이드

## Executive Summary

Cursor IDE만을 사용하여 Supabase 관련 작업(스키마 변경, 마이그레이션, Edge Functions 배포 등)을 수행하는 완전한 워크플로우입니다. Supabase 대시보드 접속 없이 Cursor 터미널에서 모든 작업을 완료할 수 있습니다.

## 핵심 질문

- **Q1**: SQL 스키마 변경을 어떻게 관리하나요?
- **Q2**: Edge Functions를 어떻게 배포하나요?
- **Q3**: 로컬 개발 환경을 어떻게 설정하나요?
- **Q4**: 원격 프로젝트와 어떻게 동기화하나요?

## 전략 방향

1. **Supabase CLI 기반 워크플로우**: 모든 작업을 CLI로 수행
2. **마이그레이션 파일 관리**: SQL 파일을 버전 관리하여 추적 가능하게 유지
3. **로컬 개발 환경**: 로컬 Supabase 인스턴스로 개발 후 원격 배포
4. **자동화 스크립트**: 반복 작업을 스크립트로 자동화

## 주요 과제

### 1. 환경 설정

#### 1.1 Supabase CLI 설치 확인

```powershell
# Node.js 버전 확인 (20 이상 필요)
node --version

# Supabase CLI 실행 가능 여부 확인 (npx 사용, 전역 설치 불필요)
npx supabase --version
```

**설치가 필요한 경우**:
```powershell
# 방법 1: npm 전역 설치 (권장)
npm install -g supabase

# 방법 2: npx 사용 (전역 설치 없이 실행)
# 이미 사용 가능하므로 추가 설치 불필요
```

#### 1.2 Supabase 로그인

**Access Token 방식 (권장)**:

1. Supabase 대시보드에서 Access Token 생성:
   - https://supabase.com/dashboard 접속
   - 우측 상단 프로필 아이콘 → **Account Settings**
   - 좌측 메뉴 → **Access Tokens**
   - **Generate new token** 클릭
   - 토큰 이름 입력 (예: "Cursor CLI")
   - 생성된 토큰 복사 (한 번만 표시됨)

2. Cursor 터미널에서 로그인:
```powershell
npx supabase login --token "여기에_복사한_토큰_붙여넣기"
```

**성공 기준**: `Logged in as: your-email@example.com` 메시지 출력

#### 1.3 프로젝트 연결

1. **PROJECT_REF 찾기**:
   - Supabase 대시보드 → 프로젝트 선택
   - **Settings** → **General**
   - **Reference ID** 확인 (예: `abcdefghijklmnop`)

2. **프로젝트 연결**:
```powershell
npx supabase link --project-ref <PROJECT_REF>
```

**성공 기준**: `Linked to project abcdefghijklmnop` 메시지 출력

**연결 정보 저장 위치**: `.supabase/config.toml` (자동 생성)

### 2. SQL 마이그레이션 관리

#### 2.1 현재 구조

프로젝트의 SQL 파일 위치:
```
supabase/
├── game_saves.sql
├── leaderboard.sql
├── leaderboard-migration-tower-count.sql
├── nickname_registry.sql
└── sync-leaderboard-from-saves.sql
```

#### 2.2 마이그레이션 파일로 변환 (권장)

Supabase CLI는 `supabase/migrations/` 디렉토리의 마이그레이션 파일을 자동으로 관리합니다.

**초기 마이그레이션 생성**:
```powershell
# 마이그레이션 디렉토리 생성
New-Item -ItemType Directory -Force -Path "supabase\migrations"

# 기존 SQL 파일을 마이그레이션으로 복사 (타임스탬프 형식)
# 형식: YYYYMMDDHHMMSS_migration_name.sql
```

**예시: 기존 SQL을 마이그레이션으로 변환**:
```powershell
# 타임스탬프 생성 (예: 20250119120000)
$timestamp = Get-Date -Format "yyyyMMddHHmmss"

# 마이그레이션 파일 생성
Copy-Item "supabase\game_saves.sql" "supabase\migrations\${timestamp}_create_game_saves.sql"
Copy-Item "supabase\leaderboard.sql" "supabase\migrations\${timestamp}_create_leaderboard.sql"
Copy-Item "supabase\nickname_registry.sql" "supabase\migrations\${timestamp}_create_nickname_registry.sql"
```

#### 2.3 새 마이그레이션 생성

**새 스키마 변경 시**:
```powershell
# 새 마이그레이션 파일 생성 (타임스탬프 자동 생성)
npx supabase migration new <migration_name>
```

예시:
```powershell
npx supabase migration new add_user_preferences
```

**생성된 파일**: `supabase/migrations/YYYYMMDDHHMMSS_add_user_preferences.sql`

#### 2.4 마이그레이션 적용

**원격 프로젝트에 적용**:
```powershell
# 모든 미적용 마이그레이션을 원격에 적용
npx supabase db push
```

**특정 마이그레이션만 적용**:
```powershell
# 마이그레이션 파일 직접 실행
npx supabase db execute --file supabase/migrations/YYYYMMDDHHMMSS_migration_name.sql
```

#### 2.5 마이그레이션 상태 확인

```powershell
# 원격 프로젝트의 마이그레이션 상태 확인
npx supabase migration list
```

### 3. Edge Functions 배포

#### 3.1 현재 Edge Functions

```
supabase/functions/
├── delete-account/
│   └── index.ts
└── README.md
```

#### 3.2 Edge Function 배포

**단일 함수 배포**:
```powershell
npx supabase functions deploy delete-account
```

**모든 함수 배포**:
```powershell
npx supabase functions deploy
```

#### 3.3 환경 변수(Secrets) 설정

**CLI로 설정 (권장)**:
```powershell
# Secrets 값 찾기: Supabase 대시보드 → Settings → API
npx supabase secrets set `
  SUPABASE_URL="https://xxxx.supabase.co" `
  SUPABASE_ANON_KEY="eyJ..." `
  SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

**개별 설정**:
```powershell
npx supabase secrets set SUPABASE_URL="https://xxxx.supabase.co"
npx supabase secrets set SUPABASE_ANON_KEY="eyJ..."
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

**Secrets 확인**:
```powershell
npx supabase secrets list
```

#### 3.4 Edge Function 로컬 테스트

```powershell
# 로컬 Supabase 시작 (Docker 필요)
npx supabase start

# 함수 로컬 실행
npx supabase functions serve delete-account
```

### 4. 로컬 개발 환경 설정

#### 4.1 로컬 Supabase 시작 (선택사항)

**Docker 필요**: 로컬 개발을 위해 Docker Desktop 설치 필요

```powershell
# 로컬 Supabase 시작
npx supabase start

# 로컬 Supabase 중지
npx supabase stop

# 로컬 Supabase 상태 확인
npx supabase status
```

**로컬 환경 정보**:
- API URL: `http://localhost:54321`
- Studio URL: `http://localhost:54323`
- Anon Key: `status` 명령어로 확인

#### 4.2 마이그레이션 로컬 적용

```powershell
# 로컬에 마이그레이션 적용
npx supabase migration up
```

### 5. 자동화 스크립트

#### 5.1 SQL 파일 직접 실행 (대시보드 대체)

기존 SQL 파일을 Supabase CLI로 직접 실행:

```powershell
# SQL 파일 실행
npx supabase db execute --file supabase/game_saves.sql
npx supabase db execute --file supabase/leaderboard.sql
npx supabase db execute --file supabase/nickname_registry.sql
```

#### 5.2 배포 스크립트 생성

`scripts/supabase-deploy.ps1` 생성 예시:

```powershell
# Supabase 배포 스크립트
Write-Host "Deploying Supabase changes..." -ForegroundColor Green

# 1. 마이그레이션 적용
Write-Host "Applying migrations..." -ForegroundColor Yellow
npx supabase db push

# 2. Edge Functions 배포
Write-Host "Deploying Edge Functions..." -ForegroundColor Yellow
npx supabase functions deploy

Write-Host "Deployment complete!" -ForegroundColor Green
```

### 6. 일반적인 작업 시나리오

#### 시나리오 1: 새 테이블 추가

1. **마이그레이션 생성**:
```powershell
npx supabase migration new add_user_settings
```

2. **SQL 작성**: `supabase/migrations/YYYYMMDDHHMMSS_add_user_settings.sql`
```sql
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  setting_key text not null,
  setting_value jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, setting_key)
);
```

3. **원격에 적용**:
```powershell
npx supabase db push
```

#### 시나리오 2: 기존 SQL 파일 수정 후 적용

1. **SQL 파일 수정**: `supabase/nickname_registry.sql` 수정

2. **직접 실행**:
```powershell
npx supabase db execute --file supabase/nickname_registry.sql
```

또는 **마이그레이션으로 변환 후 적용**:
```powershell
# 새 마이그레이션 생성
npx supabase migration new update_nickname_registry

# 생성된 파일에 수정된 SQL 복사 후
npx supabase db push
```

#### 시나리오 3: Edge Function 수정 후 배포

1. **함수 코드 수정**: `supabase/functions/delete-account/index.ts` 수정

2. **배포**:
```powershell
npx supabase functions deploy delete-account
```

#### 시나리오 4: 데이터베이스 상태 확인

```powershell
# 마이그레이션 목록
npx supabase migration list

# 테이블 목록 (SQL 쿼리 실행)
npx supabase db execute --query "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

# Edge Functions 목록
npx supabase functions list
```

### 7. 문제 해결

#### 로그인 실패
- Access Token이 올바른지 확인
- 토큰이 만료되지 않았는지 확인 (대시보드에서 재생성)

#### 프로젝트 연결 실패
- PROJECT_REF가 올바른지 확인
- 프로젝트에 대한 권한이 있는지 확인
- `.supabase/config.toml` 파일 확인

#### 마이그레이션 적용 실패
- SQL 문법 오류 확인
- 기존 스키마와 충돌 여부 확인
- `npx supabase migration list`로 상태 확인

#### Edge Function 배포 실패
- 함수 파일 경로 확인 (`supabase/functions/<function-name>/index.ts`)
- 함수 이름이 정확한지 확인
- Secrets 설정 여부 확인

### 8. 워크플로우 요약

| 작업 | 명령어 |
|------|--------|
| 로그인 | `npx supabase login --token <TOKEN>` |
| 프로젝트 연결 | `npx supabase link --project-ref <REF>` |
| 새 마이그레이션 생성 | `npx supabase migration new <name>` |
| 마이그레이션 적용 | `npx supabase db push` |
| SQL 파일 직접 실행 | `npx supabase db execute --file <file>` |
| Edge Function 배포 | `npx supabase functions deploy <name>` |
| Secrets 설정 | `npx supabase secrets set KEY="value"` |
| 마이그레이션 목록 | `npx supabase migration list` |
| 함수 목록 | `npx supabase functions list` |

### 9. 보안 주의사항

- ⚠️ **SERVICE_ROLE_KEY는 절대 공유하지 마세요**
- ⚠️ **Access Token은 안전하게 보관하세요**
- ⚠️ **`.supabase/config.toml`은 `.gitignore`에 추가하세요** (프로젝트별 설정 포함)
- ⚠️ **Secrets는 환경 변수나 안전한 저장소에 보관하세요**

### 10. 다음 단계

1. **초기 설정 완료**: 로그인 및 프로젝트 연결
2. **기존 SQL 마이그레이션화**: 기존 SQL 파일을 마이그레이션으로 변환
3. **자동화 스크립트 생성**: 반복 작업을 스크립트로 자동화
4. **로컬 개발 환경 구축** (선택): Docker 기반 로컬 Supabase 설정

---

**참고 문서**:
- [Supabase CLI 공식 문서](https://supabase.com/docs/reference/cli)
- `docs/cli-deployment-steps.md`: 단계별 배포 가이드
- `docs/final-cli-deployment-report.md`: 설치 및 배포 보고서














