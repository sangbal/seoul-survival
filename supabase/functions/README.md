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
2. game_saves 테이블에서 user_id 행 삭제
3. leaderboard 테이블에서 user_id 행 삭제
4. auth.users에서 사용자 삭제 (`admin.deleteUser()`)






