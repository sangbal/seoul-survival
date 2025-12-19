# Supabase CLI 배포 단계별 가이드

## ✅ 1단계: 환경 점검 완료

- Node.js: v24.12.0 ✅
- npm: 11.6.2 ✅
- npx: 11.6.2 ✅
- Supabase CLI: npx로 실행 가능 ✅

## 📋 2단계: Supabase 로그인 (수동 필요)

비대화형 환경이므로 수동 로그인이 필요합니다.

### 방법 A: Access Token 사용 (권장)

1. **Supabase 대시보드에서 Access Token 생성**:
   - https://supabase.com/dashboard 접속
   - 우측 상단 프로필 아이콘 클릭
   - **"Account Settings"** 클릭
   - 좌측 메뉴에서 **"Access Tokens"** 클릭
   - **"Generate new token"** 클릭
   - 토큰 이름 입력 (예: "CLI Deployment")
   - **"Generate token"** 클릭
   - 생성된 토큰을 복사 (한 번만 표시되므로 안전하게 보관)

2. **PowerShell에서 로그인**:
   ```powershell
   $env:SUPABASE_ACCESS_TOKEN="여기에_복사한_토큰_붙여넣기"
   npx supabase login
   ```

   또는 토큰을 직접 전달:
   ```powershell
   npx supabase login --token "여기에_복사한_토큰_붙여넣기"
   ```

**성공 기준**: "Logged in as: your-email@example.com" 메시지 출력

### 방법 B: 브라우저 로그인 (대안)

터미널이 브라우저를 열 수 있다면:
```powershell
npx supabase login
```
브라우저가 열리면 로그인 진행

---

## 📋 3단계: 프로젝트 연결

### PROJECT_REF 찾기

1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택
3. **Settings** → **General** 클릭
4. **"Reference ID"** 항목에서 프로젝트 참조 ID 확인
   - 형식: `abcdefghijklmnop` (영문자/숫자 조합)

### 프로젝트 연결 실행

```powershell
npx supabase link --project-ref <PROJECT_REF>
```

예시:
```powershell
npx supabase link --project-ref abcdefghijklmnop
```

**성공 기준**: "Linked to project abcdefghijklmnop" 메시지 출력

---

## 📋 4단계: Edge Function 배포

```powershell
npx supabase functions deploy delete-account
```

**성공 기준**: "Deployed Function delete-account" 또는 "Function deployed successfully" 메시지 출력

---

## 📋 5단계: 환경 변수(Secrets) 설정

Edge Function이 필요로 하는 환경 변수:
- `SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_ANON_KEY`: Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key ⚠️ **절대 공유하지 마세요**

### 방법 A: CLI로 설정 (권장)

```powershell
npx supabase secrets set SUPABASE_URL="https://xxxx.supabase.co" SUPABASE_ANON_KEY="eyJ..." SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

**값 찾기**:
1. Supabase 대시보드 → **Settings** → **API**
2. **Project URL**: `SUPABASE_URL`에 사용
3. **anon public**: `SUPABASE_ANON_KEY`에 사용
4. **service_role secret**: `SUPABASE_SERVICE_ROLE_KEY`에 사용 ⚠️

**성공 기준**: "Secrets updated" 메시지 출력

### 방법 B: 대시보드에서 설정

1. Supabase 대시보드 → **Edge Functions** 클릭
2. `delete-account` 함수 선택
3. **Settings** 탭 클릭
4. **Secrets** 섹션에서 다음 추가:
   - `SUPABASE_URL` = 프로젝트 URL
   - `SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role secret key ⚠️
5. 각 변수 입력 후 **Save** 클릭

---

## 📋 6단계: 배포 확인

### 방법 A: CLI로 확인

```powershell
npx supabase functions list
```

**성공 기준**: `delete-account` 함수가 목록에 표시됨

### 방법 B: 대시보드에서 확인

1. Supabase 대시보드 → **Edge Functions** 클릭
2. `delete-account` 함수가 목록에 있는지 확인
3. 함수 클릭 → **Details** 탭에서 함수 URL 확인
   - 형식: `https://<PROJECT_REF>.supabase.co/functions/v1/delete-account`

---

## 🔍 문제 해결

### 로그인 실패
- Access Token이 올바른지 확인
- 토큰이 만료되지 않았는지 확인 (대시보드에서 재생성 가능)

### 프로젝트 연결 실패
- PROJECT_REF가 올바른지 확인
- 프로젝트에 대한 권한이 있는지 확인

### 함수 배포 실패
- `supabase/functions/delete-account/index.ts` 파일이 존재하는지 확인
- 함수 이름이 정확한지 확인 (`delete-account`)

### Secrets 설정 실패
- 키 값이 올바른지 확인 (따옴표 포함)
- 대시보드에서 직접 설정하는 방법 시도

---

## ✅ 최종 체크리스트

- [ ] Supabase 로그인 완료
- [ ] 프로젝트 연결 완료
- [ ] Edge Function 배포 완료
- [ ] 환경 변수(Secrets) 설정 완료
- [ ] 배포 확인 완료

모든 단계 완료 후 E2E 테스트를 진행하세요!


