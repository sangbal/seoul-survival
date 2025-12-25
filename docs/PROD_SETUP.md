# 프로덕션 설정 체크리스트

이 문서는 ClickSurvivor Hub v0.3+ 프로덕션 배포를 위한 필수 설정 항목을 정리한 것입니다.

## A) Supabase Auth Redirect URLs (Allowlist)

Supabase 대시보드 → **Authentication** → **URL Configuration** → **Redirect URLs**에 다음을 추가:

| 환경 | URL | 비고 |
|------|-----|------|
| **프로덕션** | `https://clicksurvivor.com/auth/callback` | 메인 도메인 |
| **로컬 개발 (Vite)** | `http://localhost:5173/auth/callback` | `npm run dev` 기본 포트 |
| **로컬 프리뷰 (빌드)** | `http://localhost:4173/auth/callback` | `npm run preview` 기본 포트 |

### Site URL 설정

**⚠️ 중요**: Supabase Site URL은 하나만 설정할 수 있습니다.

- **프로덕션**: `https://clicksurvivor.com`
- **개발**: `http://localhost:4173` (또는 사용 중인 포트)

**주의사항**:
- Site URL이 프로덕션으로 설정되어 있으면, Redirect URLs에 로컬 URL을 추가해야 로컬에서 로그인 가능합니다.
- Redirect URLs에 등록되지 않은 URL은 Supabase가 Site URL로 리다이렉트합니다.
- 개발 환경에서 로그인하려면 반드시 Redirect URLs에 로컬 URL을 추가해야 합니다.

### 설정 방법
1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택
3. 좌측 메뉴: **Authentication** → **URL Configuration**
4. **Redirect URLs** 섹션에서 위 URL들을 하나씩 추가
5. 각 URL 입력 후 **Add** 클릭

---

## B) Google Cloud OAuth 설정

Google Cloud Console → **APIs & Services** → **Credentials** → **OAuth 2.0 Client ID**에서 설정:

### Authorized JavaScript origins

| 환경 | Origin | 비고 |
|------|--------|------|
| **프로덕션** | `https://clicksurvivor.com` | 메인 도메인 |
| **로컬 개발** | `http://localhost:5173` | Vite dev 서버 |
| **로컬 프리뷰** | `http://localhost:4173` | Vite preview 서버 |

### Authorized redirect URIs

**중요**: Supabase가 OAuth 리다이렉트를 처리하므로, Google OAuth 설정에는 **Supabase 콜백 URL**을 추가해야 합니다.

| 환경 | Redirect URI | 비고 |
|------|--------------|------|
| **프로덕션** | `https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback` | Supabase 프로젝트 ID 필요 |
| **개발** | `http://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback` | 개발 환경 (http) |

**참고**: `<YOUR_SUPABASE_PROJECT_ID>`는 Supabase 대시보드 → **Settings** → **General** → **Reference ID**에서 확인 가능합니다.

### 설정 방법
1. Google Cloud Console 접속: https://console.cloud.google.com
2. 프로젝트 선택
3. **APIs & Services** → **Credentials** 클릭
4. OAuth 2.0 Client ID 선택 (또는 새로 생성)
5. **Authorized JavaScript origins** 섹션에서 위 Origin들을 추가
6. **Authorized redirect URIs** 섹션에서 위 Redirect URI들을 추가
7. **Save** 클릭

---

## C) Edge Function (delete-account) 배포/시크릿

### 배포 명령

```bash
# Supabase CLI 사용 (권장)
supabase functions deploy delete-account

# 또는 npx 사용
npx supabase functions deploy delete-account
```

### Secrets (환경 변수)

Edge Function이 필요로 하는 환경 변수:

| 변수명 | 설명 | 위치 |
|--------|------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL | Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase Anon Key | Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key ⚠️ | Settings → API → service_role secret |

**⚠️ 주의**: `SUPABASE_SERVICE_ROLE_KEY`는 절대 프론트엔드 코드에 포함하지 마세요.

### Secrets 설정 방법

#### 방법 A: CLI로 설정 (권장)

```bash
supabase secrets set \
  SUPABASE_URL="https://xxxx.supabase.co" \
  SUPABASE_ANON_KEY="eyJ..." \
  SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

#### 방법 B: 대시보드에서 설정

1. Supabase 대시보드 → **Edge Functions** 클릭
2. `delete-account` 함수 선택
3. **Settings** 탭 클릭
4. **Secrets** 섹션에서 위 변수들을 추가
5. 각 변수 입력 후 **Save** 클릭

### CORS 허용

Edge Function의 CORS 설정은 코드에서 처리됩니다 (`supabase/functions/delete-account/index.ts`):

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

**현재 설정**: 모든 Origin 허용 (`*`). 프로덕션에서는 특정 도메인만 허용하도록 제한하는 것을 권장합니다.

### 배포 후 엔드포인트 URL

배포 후 함수 URL 형식:
```
https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/functions/v1/delete-account
```

### 확인 방법 (curl 예시)

#### 1. OPTIONS 프리플라이트 확인

```bash
curl -X OPTIONS https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/functions/v1/delete-account \
  -H "Origin: https://clicksurvivor.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**예상 응답**: `200 OK` with CORS headers

#### 2. 토큰 없는 요청 → 401 확인

```bash
curl -X POST https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/functions/v1/delete-account \
  -H "Content-Type: application/json" \
  -v
```

**예상 응답**: `401 Unauthorized` with JSON:
```json
{
  "status": "AUTH_FAILED",
  "message": "Authorization header missing or invalid"
}
```

#### 3. 유효한 토큰으로 요청 (테스트 계정만)

```bash
curl -X POST https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/functions/v1/delete-account \
  -H "Authorization: Bearer <USER_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -v
```

**⚠️ 주의**: 실제 계정 삭제가 수행되므로, 반드시 **테스트 계정**으로만 테스트하세요.

**예상 응답 (성공)**:
```json
{
  "status": "ALL_SUCCESS"
}
```

---

## D) 운영 점검

프로덕션 배포 후 다음 항목을 점검하세요:

### 1. 로그인 성공 후 /auth/callback → (nextUrl) 리다이렉트

**검증 방법**:
1. 프로덕션 사이트 접속: `https://clicksurvivor.com`
2. "Login" 버튼 클릭
3. Google OAuth 인증 완료
4. `/auth/callback?code=...&state=...` 도착 확인
5. 콜백 페이지에서 "로그인 처리 중..." 표시 확인
6. 원래 페이지(홈)로 리다이렉트 확인
7. 헤더에 닉네임 또는 "Login" 버튼 사라짐 확인

**자동화**: E2E 테스트로 검증 (Commit 3에서 구현)

### 2. /account에서 닉네임 저장

**검증 방법**:
1. 로그인 상태에서 `/account/` 접속
2. "현재 닉네임: [닉네임]" 표시 확인 (있는 경우)
3. 새 닉네임 입력 (1~6자, 한글/영문/숫자/밑줄)
4. "Save" 버튼 클릭
5. 성공 토스트 메시지 확인
6. 현재 닉네임 업데이트 확인
7. 헤더 닉네임 업데이트 확인

**자동화**: E2E 테스트로 검증 (Commit 3에서 구현)

### 3. /account에서 탈퇴 (테스트 계정에서만)

**⚠️ 주의**: 반드시 **테스트 계정**으로만 수행하세요.

**검증 방법**:
1. 로그인 상태에서 `/account/` 접속
2. "Danger Zone" 섹션으로 스크롤
3. "복구 불가 동의" 체크박스 체크
4. "DELETE" 입력
5. "Delete account" 버튼 enabled 확인
6. 버튼 클릭 → 1단계 확인 다이얼로그 확인
7. 확인 → 2단계 확인 다이얼로그 확인
8. 확인 → 계정 삭제 진행
9. 성공 시 홈페이지로 리다이렉트 확인
10. 로그인 상태 해제 확인

**자동화**: E2E 테스트로 검증 (Commit 3에서 구현, 테스트 계정만 사용)

---

## 환경 변수 요약

### 프론트엔드 (Vite)

`.env` 또는 `.env.local` 파일에 설정:

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**위치**: 프로젝트 루트 디렉토리

### Edge Function (Supabase Secrets)

Supabase 대시보드 또는 CLI로 설정:

```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # ⚠️ 절대 공유하지 마세요
```

**위치**: Supabase 대시보드 → Edge Functions → delete-account → Settings → Secrets

---

## 배포 순서

1. **Supabase Redirect URLs 설정** (A)
2. **Google OAuth 설정** (B)
3. **Edge Function 배포** (C)
4. **Edge Function Secrets 설정** (C)
5. **프로덕션 빌드 및 배포**
6. **운영 점검** (D)

---

## 문제 해결

### OAuth 리다이렉트 실패
- Supabase Redirect URLs에 정확한 URL이 등록되었는지 확인
- Google OAuth 설정에 Supabase 콜백 URL이 등록되었는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### Edge Function 호출 실패
- Secrets가 올바르게 설정되었는지 확인
- 함수 URL이 올바른지 확인
- CORS 헤더가 올바른지 확인 (OPTIONS 요청 테스트)

### 계정 삭제 실패
- JWT 토큰이 유효한지 확인
- Edge Function 로그 확인 (Supabase 대시보드 → Edge Functions → delete-account → Logs)
- 테스트 계정으로만 시도

---

## 참고 문서

- `docs/v0.3-redirect-urls.md`: Redirect URLs 상세 가이드
- `docs/deployment-guide.md`: Edge Function 배포 가이드
- `docs/cli-deployment-steps.md`: CLI 배포 단계별 가이드
- `supabase/functions/README.md`: Edge Function API 문서

