# Supabase CLI 설치 및 배포 최종 보고서

**작성일**: 2025-12-19  
**환경**: Windows PowerShell

---

## ✅ 설치 방식: 1차 시도 성공 (npx 사용)

**방법**: npx supabase (전역 설치 없이 실행)  
**버전**: Supabase CLI 2.67.2

---

## 📊 기본 환경 점검 결과

| 항목 | 버전 | 상태 |
|------|------|------|
| Node.js | v24.12.0 | ✅ (20 이상 요구사항 충족) |
| npm | 11.6.2 | ✅ |
| npx | 11.6.2 | ✅ |
| Supabase CLI | 2.67.2 (npx) | ✅ |

---

## 🔐 보안 점검

- ✅ `SERVICE_ROLE_KEY`는 프론트엔드 코드에 포함되지 않음
- ✅ Edge Function에서만 `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')`로 환경 변수에서 읽음
- ✅ 프론트엔드는 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`만 사용

---

## 📋 배포 상태

### 현재 상태: ⚠️ **수동 진행 필요**

**완료된 단계**:
- ✅ 환경 점검 완료
- ✅ Supabase CLI 실행 가능 (npx)

**수동 진행 필요**:
- ⏳ Supabase 로그인 (Access Token 필요)
- ⏳ 프로젝트 연결 (PROJECT_REF 필요)
- ⏳ Edge Function 배포
- ⏳ 환경 변수(Secrets) 설정

---

## 🎯 다음 액션 (사용자 수행 필요)

### 1단계: Supabase Access Token 생성

1. https://supabase.com/dashboard 접속
2. 우측 상단 **프로필 아이콘** 클릭
3. **"Account Settings"** 클릭
4. 좌측 메뉴에서 **"Access Tokens"** 클릭
5. **"Generate new token"** 버튼 클릭
6. 토큰 이름 입력 (예: "CLI Deployment")
7. **"Generate token"** 클릭
8. 생성된 토큰 복사 (한 번만 표시됨)

### 2단계: PowerShell에서 로그인

```powershell
npx supabase login --token "여기에_복사한_토큰_붙여넣기"
```

**성공 기준**: "Logged in as: your-email@example.com" 메시지 출력

### 3단계: PROJECT_REF 찾기

1. Supabase 대시보드 → 프로젝트 선택
2. **Settings** → **General** 클릭
3. **"Reference ID"** 항목에서 프로젝트 참조 ID 확인
   - 형식: `abcdefghijklmnop` (영문자/숫자 조합)

### 4단계: 프로젝트 연결

```powershell
npx supabase link --project-ref <PROJECT_REF>
```

**성공 기준**: "Linked to project abcdefghijklmnop" 메시지 출력

### 5단계: Edge Function 배포

```powershell
npx supabase functions deploy delete-account
```

**성공 기준**: "Deployed Function delete-account" 메시지 출력

### 6단계: 환경 변수(Secrets) 설정

**값 찾기**:
1. Supabase 대시보드 → **Settings** → **API**
2. **Project URL**: `SUPABASE_URL`에 사용
3. **anon public**: `SUPABASE_ANON_KEY`에 사용
4. **service_role secret**: `SUPABASE_SERVICE_ROLE_KEY`에 사용 ⚠️

**CLI로 설정**:
```powershell
npx supabase secrets set SUPABASE_URL="https://xxxx.supabase.co" SUPABASE_ANON_KEY="eyJ..." SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

**또는 대시보드에서 설정**:
1. Supabase 대시보드 → **Edge Functions** 클릭
2. `delete-account` 함수 선택
3. **Settings** 탭 클릭
4. **Secrets** 섹션에서 다음 추가:
   - `SUPABASE_URL` = 프로젝트 URL
   - `SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role secret key ⚠️
5. 각 변수 입력 후 **Save** 클릭

**성공 기준**: "Secrets updated" 메시지 또는 대시보드에서 저장 완료

---

## 📝 상세 가이드

자세한 단계별 가이드는 `docs/cli-deployment-steps.md`를 참조하세요.

---

## ⚠️ 주의사항

- ⚠️ **절대 본계정으로 테스트하지 마세요**
- ⚠️ **테스트용 계정으로만 E2E 테스트 수행**
- ⚠️ **SERVICE_ROLE_KEY는 절대 공유하지 마세요**
- ⚠️ **Access Token도 안전하게 보관하세요**

---

## ✅ 최종 체크리스트

- [x] 환경 점검 완료
- [x] Supabase CLI 실행 가능
- [ ] Supabase 로그인 완료
- [ ] 프로젝트 연결 완료
- [ ] Edge Function 배포 완료
- [ ] 환경 변수(Secrets) 설정 완료
- [ ] 배포 확인 완료

모든 단계 완료 후 E2E 테스트를 진행하세요!


