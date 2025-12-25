# 다음 단계 진행 가이드

## 현재 상태
- ✅ Supabase CLI 설치 완료 (npx 사용)
- ✅ 환경 점검 완료
- ⏳ 다음 단계 진행 대기 중

## 필요한 정보

### 1. Supabase Access Token
**위치**: Supabase 대시보드 → 프로필 아이콘 → Account Settings → Access Tokens

**생성 방법**:
1. https://supabase.com/dashboard 접속
2. 우측 상단 **프로필 아이콘** 클릭
3. **"Account Settings"** 클릭
4. 좌측 메뉴에서 **"Access Tokens"** 클릭
5. **"Generate new token"** 버튼 클릭
6. 토큰 이름 입력 (예: "CLI Deployment")
7. **"Generate token"** 클릭
8. 생성된 토큰 복사

**형식**: `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (긴 문자열)

### 2. PROJECT_REF (프로젝트 참조 ID)
**위치**: Supabase 대시보드 → 프로젝트 선택 → Settings → General → Reference ID

**확인 방법**:
1. Supabase 대시보드 접속
2. 프로젝트 선택
3. **Settings** → **General** 클릭
4. **"Reference ID"** 항목 확인
   - 형식: `abcdefghijklmnop` (영문자/숫자 조합, 보통 20자 정도)

### 3. Supabase API 키들 (Secrets 설정용)
**위치**: Supabase 대시보드 → Settings → API

**확인 방법**:
1. Supabase 대시보드 → 프로젝트 선택
2. **Settings** → **API** 클릭
3. 다음 값들을 복사:
   - **Project URL**: `https://xxxx.supabase.co` 형식
   - **anon public**: `eyJ...` 형식 (긴 문자열)
   - **service_role secret**: `eyJ...` 형식 (긴 문자열) ⚠️ **절대 공유하지 마세요**

---

## 진행 옵션

### 옵션 A: 정보 제공 후 자동 진행
위의 정보를 제공해주시면, 제가 PowerShell 명령을 실행하여 자동으로 진행하겠습니다.

**필요한 정보**:
- Access Token
- PROJECT_REF
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (⚠️ 민감 정보)

### 옵션 B: 단계별 수동 진행
각 단계를 하나씩 진행하면서 결과를 확인하고 싶으시다면, 아래 순서로 진행하세요:

1. **로그인**:
   ```powershell
   npx supabase login --token "YOUR_ACCESS_TOKEN"
   ```

2. **프로젝트 연결**:
   ```powershell
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **함수 배포**:
   ```powershell
   npx supabase functions deploy delete-account
   ```

4. **Secrets 설정**:
   ```powershell
   npx supabase secrets set SUPABASE_URL="YOUR_URL" SUPABASE_ANON_KEY="YOUR_ANON_KEY" SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_KEY"
   ```

---

## 다음 단계 선택

어떤 방식으로 진행하시겠습니까?

1. **정보 제공 후 자동 진행**: 필요한 정보를 제공해주시면 제가 명령을 실행합니다.
2. **단계별 안내**: 각 단계를 하나씩 안내해드립니다.
3. **대시보드 수동 배포**: CLI 대신 대시보드에서 직접 배포하는 방법 안내

원하시는 방식을 알려주세요!















