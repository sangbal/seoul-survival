# Supabase Edge Functions

## delete-account

계정 삭제(회원 탈퇴)를 위한 Edge Function입니다.

### 배포 방법

1. Supabase CLI 설치 및 로그인:
```bash
npm install -g supabase
supabase login
```

2. 프로젝트 연결:
```bash
supabase link --project-ref <your-project-ref>
```

3. Edge Function 배포:
```bash
supabase functions deploy delete-account
```

4. 환경 변수 설정 (Supabase Dashboard):
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_ANON_KEY`: Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key (절대 프론트엔드에 포함하지 않음)

### 보안 주의사항

- Service Role Key는 Edge Function 환경 변수에만 저장
- 프론트엔드 코드에 Service Role Key 포함 금지
- Edge Function에서만 `admin.deleteUser()` 호출
- JWT 검증은 Edge Function에서 수행
- 민감 정보는 로그에 남기지 않음

### API

**엔드포인트**: `POST /functions/v1/delete-account`

**헤더**:
- `Authorization: Bearer <user_jwt_token>`

**응답**:
```json
{
  "status": "ALL_SUCCESS" | "DATA_DELETED_BUT_AUTH_DELETE_FAILED" | "AUTH_FAILED" | "NOT_CONFIGURED" | "UNKNOWN_ERROR",
  "message": "optional message"
}
```

### 동작

1. JWT 토큰 검증
2. 관련 데이터 삭제 (순서대로):
   - `game_saves` 테이블에서 `user_id` 행 삭제
   - `leaderboard` 테이블에서 `user_id` 행 삭제
   - `nickname_registry` 테이블에서 `user_id` 행 삭제 (닉네임 회수)
   - `reviews` 테이블에서 `user_id` 행 삭제 (있는 경우)
3. `auth.users`에서 사용자 삭제 (`admin.deleteUser()`)

### 주의사항

- `nickname_registry` 삭제 실패 시에도 계정 삭제는 계속 진행 (닉네임은 나중에 자동 회수됨)
- `reviews` 테이블이 없을 수 있으므로 삭제 실패는 무시
- 데이터 삭제 실패 시에도 `auth.users` 삭제는 시도 (부분 삭제 방지)

### CORS 설정

기본적으로 모든 Origin을 허용합니다 (`*`). 프로덕션에서는 환경 변수 `ALLOWED_ORIGIN`을 설정하여 특정 도메인만 허용할 수 있습니다:

```bash
supabase secrets set ALLOWED_ORIGIN="https://clicksurvivor.com"
```

### 로컬 검증

배포 전 로컬에서 함수를 검증하려면 `tools/test-delete-account.js` 또는 `tools/test-delete-account.sh`를 사용하세요:

```bash
# Node.js 버전
node tools/test-delete-account.js <FUNCTION_URL> [JWT_TOKEN]

# Bash 버전
./tools/test-delete-account.sh <FUNCTION_URL> [JWT_TOKEN]

# OPTIONS 프리플라이트 확인
node tools/test-delete-account.js <FUNCTION_URL> --options
```

**⚠️ 주의**: 유효한 JWT 토큰으로 테스트하면 실제 계정이 삭제됩니다. 반드시 **테스트 계정**으로만 테스트하세요.











