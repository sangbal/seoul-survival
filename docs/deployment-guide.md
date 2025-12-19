# 계정 삭제 Edge Function 배포 가이드

## 보안 점검 결과 ✅

- ✅ `SERVICE_ROLE_KEY`는 프론트엔드 코드에 포함되지 않음
- ✅ Edge Function 코드에서만 `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')`로 환경 변수에서 읽음
- ✅ 프론트엔드는 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`만 사용

## 배포 방법

### 방법 1: Supabase CLI 사용 (권장)

#### 1. Supabase CLI 설치

**Windows (PowerShell):**
```powershell
# Scoop 사용 (권장)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 또는 npm 사용
npm install -g supabase
```

**macOS/Linux:**
```bash
brew install supabase/tap/supabase
# 또는
npm install -g supabase
```

#### 2. 로그인 및 프로젝트 연결

```bash
# 로그인
supabase login

# 프로젝트 연결 (PROJECT_REF는 Supabase 대시보드에서 확인)
supabase link --project-ref <YOUR_PROJECT_REF>
```

#### 3. Edge Function 배포

```bash
# 함수 배포
supabase functions deploy delete-account
```

#### 4. 환경 변수 설정

```bash
# 환경 변수 설정 (Supabase 대시보드에서 값 확인)
supabase secrets set \
  SUPABASE_URL=https://xxxx.supabase.co \
  SUPABASE_ANON_KEY=eyJ... \
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 방법 2: Supabase 대시보드 사용

#### 1. Edge Function 생성

1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택
3. 좌측 메뉴에서 **"Edge Functions"** 클릭
4. **"Create a new function"** 버튼 클릭
5. 함수 이름: `delete-account` 입력
6. **"Create function"** 클릭

#### 2. 코드 복사 및 붙여넣기

1. 생성된 함수 편집기에서 `supabase/functions/delete-account/index.ts` 파일 내용을 복사
2. 편집기에 붙여넣기
3. **"Deploy"** 버튼 클릭

#### 3. 환경 변수 설정

1. Edge Functions 페이지에서 `delete-account` 함수 선택
2. **"Settings"** 탭 클릭
3. **"Secrets"** 섹션에서 다음 환경 변수 추가:
   - `SUPABASE_URL`: Supabase 프로젝트 URL (Settings → API에서 확인)
   - `SUPABASE_ANON_KEY`: Supabase Anon Key (Settings → API에서 확인)
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key (Settings → API에서 확인, **절대 공유하지 마세요**)
4. 각 변수 입력 후 **"Save"** 클릭

#### 4. 함수 URL 확인

1. Edge Functions 페이지에서 `delete-account` 함수 선택
2. **"Details"** 탭에서 함수 URL 확인
3. URL 형식: `https://<PROJECT_REF>.supabase.co/functions/v1/delete-account`

## 배포 확인

### 테스트 요청 (curl)

```bash
# 테스트용 (실제로는 프론트엔드에서 호출)
curl -X POST https://<PROJECT_REF>.supabase.co/functions/v1/delete-account \
  -H "Authorization: Bearer <USER_JWT_TOKEN>" \
  -H "Content-Type: application/json"
```

### 예상 응답

**성공:**
```json
{
  "status": "ALL_SUCCESS"
}
```

**실패 (인증 오류):**
```json
{
  "status": "AUTH_FAILED",
  "message": "Invalid or expired token"
}
```

## 주의사항

- ⚠️ `SUPABASE_SERVICE_ROLE_KEY`는 절대 프론트엔드 코드에 포함하지 마세요
- ⚠️ 환경 변수는 Supabase 대시보드에서만 설정하세요
- ⚠️ 함수 배포 후 반드시 테스트 계정으로 검증하세요


