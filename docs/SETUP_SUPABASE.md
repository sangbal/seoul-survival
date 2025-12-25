# Supabase 설정 가이드

이 가이드는 로컬 개발 환경에서 Supabase를 활성화하여 Login 버튼을 실제로 사용 가능하게 만드는 방법을 설명합니다.

## 1. Supabase 프로젝트 준비

### Supabase 대시보드에서 값 확인

1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택 (또는 새로 생성)
3. **Settings** → **API** 클릭
4. 다음 값들을 복사:
   - **Project URL**: `https://xxxx.supabase.co` 형식
   - **anon public**: `eyJ...` 형식 (긴 문자열)

## 2. 로컬 환경 변수 설정

### 방법 A: .env.local 파일 생성 (권장)

1. 프로젝트 루트 디렉토리에 `.env.local` 파일 생성
2. `.env.local.example` 파일을 참고하여 다음 내용 입력:

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

3. 실제 Supabase 프로젝트 값으로 교체

### 방법 B: 환경 변수 직접 설정 (PowerShell)

```powershell
$env:VITE_SUPABASE_URL="https://xxxx.supabase.co"
$env:VITE_SUPABASE_ANON_KEY="eyJ..."
```

## 3. 설정 확인

### 개발 서버 재시작

환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다:

```bash
# 개발 서버 중지 (Ctrl+C)
npm run dev
```

### 브라우저 콘솔 확인

1. 브라우저에서 `http://localhost:5173` 접속
2. 개발자 도구(F12) → Console 탭 열기
3. 다음 메시지 확인:
   - ✅ `[env] VITE_SUPABASE_URL: https://xxxx.supabase.co`
   - ✅ `[env] VITE_SUPABASE_ANON_KEY length: XXX`
   - ✅ Login 버튼이 활성화되어 클릭 가능

### Login 버튼 테스트

1. 허브 홈페이지에서 "Login" 버튼 클릭
2. Google OAuth 페이지로 리다이렉트되는지 확인
3. (Supabase Redirect URLs 설정이 되어 있어야 함)

## 4. Supabase 설정 (필수)

### Redirect URLs 설정 (중요!)

**⚠️ 필수**: Supabase 대시보드 → **Authentication** → **URL Configuration** → **Redirect URLs**에 다음을 모두 추가해야 합니다:

- `http://localhost:5173/auth/callback` (Vite dev 서버)
- `http://localhost:4173/auth/callback` (Vite preview 서버)
- `https://clicksurvivor.com/auth/callback` (프로덕션)

**주의**: Redirect URLs에 등록되지 않은 URL은 Supabase가 Site URL로 리다이렉트합니다. 로컬 환경에서 로그인하려면 반드시 로컬 URL을 추가해야 합니다.

### Site URL 설정 (중요!)

**⚠️ 주의**: Supabase Site URL은 하나만 설정할 수 있습니다.

- **개발 환경**: `http://localhost:4173` (또는 사용 중인 포트)
- **프로덕션**: `https://clicksurvivor.com`

**개발 환경에서 로그인하려면**:
1. Supabase 대시보드 → **Authentication** → **URL Configuration** → **Site URL**
2. 개발 중에는 로컬 URL(`http://localhost:4173`)로 설정
3. 프로덕션 배포 시 프로덕션 URL(`https://clicksurvivor.com`)로 변경

**또는**: Redirect URLs에 로컬 URL을 추가하면 Site URL이 프로덕션으로 설정되어 있어도 로컬에서 로그인 가능합니다.

### Google OAuth 설정

1. Supabase 대시보드 → **Authentication** → **Providers** → **Google** 활성화
2. Google Cloud Console에서 OAuth Client 생성
3. Client ID/Secret을 Supabase에 입력
4. Google Cloud Console → **Authorized redirect URIs**에 Supabase 콜백 URL 추가:
   - `https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback`
   - (프로덕션과 개발 환경 모두 동일한 Supabase 콜백 URL 사용)

## 5. 문제 해결

### Login 버튼이 여전히 비활성화됨

1. **환경 변수 확인**:
   ```bash
   # PowerShell에서 확인
   echo $env:VITE_SUPABASE_URL
   echo $env:VITE_SUPABASE_ANON_KEY
   ```

2. **.env.local 파일 위치 확인**:
   - 프로젝트 루트 디렉토리에 있어야 함
   - 파일명이 정확히 `.env.local`인지 확인 (숨김 파일)

3. **개발 서버 재시작**:
   - 환경 변수 변경 후 반드시 재시작 필요

4. **브라우저 콘솔 확인**:
   - `[auth] Supabase not configured` 메시지가 있으면 환경 변수가 제대로 로드되지 않은 것

### OAuth 리다이렉트 실패

1. **Supabase Redirect URLs 확인**:
   - 정확한 URL이 등록되었는지 확인
   - 프로토콜(`http://` vs `https://`) 확인
   - 포트 번호 확인

2. **Google OAuth 설정 확인**:
   - Authorized redirect URIs에 Supabase 콜백 URL이 등록되었는지 확인

## 6. 프로덕션 배포

프로덕션 배포 시에는 GitHub Secrets 또는 배포 플랫폼의 환경 변수 설정을 사용합니다:

- GitHub Actions: Settings → Secrets and variables → Actions
- Vercel/Netlify: 프로젝트 설정 → Environment Variables

자세한 내용은 `docs/PROD_SETUP.md`를 참조하세요.

