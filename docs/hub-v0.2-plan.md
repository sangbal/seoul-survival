# ClickSurvivor Hub v0.2 구현 계획

## Step 1: 리포지토리 탐색 & 현황 리포트

### 현재 구조

#### 엔트리 페이지
- **허브 홈**: `index.html` (루트)
- **게임**: `seoulsurvival/index.html`
- **계정 관리**: `account/index.html`
- **약관/개인정보**: `terms.html`, `privacy.html`

#### 라우팅 방식
- **Vite 멀티페이지**: `vite.config.js`의 `rollupOptions.input`에 정의
- 현재 허브는 `index.html`만 빌드됨 (게임은 별도 엔트리)

#### 공통 모듈 위치
- **인증**: `shared/auth/` (core.js, ui.js, config.js, deleteAccount.js 등)
- **스타일**: 
  - `shared/styles/uniform-core.css` (토큰 + primitive)
  - `shared/styles/hub.css` (허브 전용)
- **Shell**: `shared/shell/header.js`, `shared/shell/footer.js`
- **부팅**: `shared/authBoot.js` (인증 UI 초기화)

### SeoulSurvival 헤더/버튼/카드 스타일 위치

#### 헤더 스타일
- **위치**: `seoulsurvival/index.html` 인라인 `<style>` (라인 95-112)
- **구조**:
  ```css
  header {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    background: linear-gradient(180deg, #0b1220, #0b1324);
    box-shadow: 0 4px 20px rgba(0,0,0,.5);
    padding: 8px 24px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    max-width: 2000px;
    width: 100%;
  }
  ```
- **헤더 브랜드**: `.header-brand` (라인 113-146)
  - 배경: `rgba(18, 26, 43, 0.55)`
  - 테두리: `1px solid rgba(255,255,255,.06)`
  - backdrop-filter: `blur(6px)`
  - border-radius: `999px`

#### 버튼 스타일
- **위치**: `seoulsurvival/index.html` 인라인 `<style>` (라인 219-250)
- **`.btn`**: 
  - 배경: `var(--accent)`
  - 색상: `var(--bg)`
  - padding: `8px 16px`
  - border-radius: `6px`
  - font-size: `12px`
  - font-weight: `700`
- **`.btn-lg`**: 
  - font-size: `20px`
  - padding: `18px 28px`
  - 배경: `linear-gradient(180deg, #1f2a44, #1a2340)`
  - 테두리: `1px solid rgba(255,255,255,.1)`

#### 카드 스타일
- **위치**: `seoulsurvival/index.html` 인라인 `<style>` (라인 153-154)
- **`.card`**:
  - 배경: `var(--panel)`
  - 테두리: `1px solid rgba(255,255,255,.06)`
  - border-radius: `16px`
  - padding: `16px`
  - box-shadow: `0 8px 30px rgba(0,0,0,.3)`

#### Chip 스타일
- **위치**: `seoulsurvival/index.html` 인라인 `<style>` (라인 149-150)
- **`.chip`**:
  - 배경: `var(--panel)`
  - padding: `6px 10px`
  - border-radius: `12px`
  - box-shadow: `0 6px 20px rgba(0,0,0,.25)`

### SeoulSurvival 인증/계정 관련 코드

#### 인증 UI 위치
- **HTML**: `seoulsurvival/index.html` (라인 3068-3117)
  - 계정 섹션: `settings.account.title`
  - Google 로그인 버튼: `data-auth-provider="google"`
  - 로그아웃 버튼: `id="logoutBtn"`
  - 사용자 표시: `id="authUserLabel"`, `id="authStatusLabel"`
  - 닉네임 표시: `id="playerNicknameLabel"`
  - 닉네임 변경 버튼: `id="nicknameChangeBtn"`

#### 인증 초기화
- **부팅 스크립트**: `shared/authBoot.js`
  - `detectScope()`: 경로로 'game' 또는 'hub' 판단
  - `initAuthUI()`: 동적 import로 `shared/auth/ui.js` 로드
- **UI 모듈**: `shared/auth/ui.js`
  - `initAuthUI()`: 버튼/라벨 바인딩 및 상태 관리
  - Google 로그인: `signInWithOAuth('google')`
  - 로그아웃: `signOut()`
  - 계정 삭제: `deleteAccount()` (동적 import)

#### 닉네임 관리
- **표시**: `shared/auth/ui.js`의 `setUI()`에서 `playerNicknameLabel` 업데이트
- **변경**: 게임 내 설정 탭에서 처리 (별도 모듈 필요 확인)

### 공통화 후보 목록

#### 1. 헤더 스타일 공통화
- **현재**: SeoulSurvival은 인라인 스타일, 허브는 `hub.css`에 간단한 버전
- **목표**: SeoulSurvival 헤더 스타일을 `shared/styles/header.css`로 추출
- **변경 파일**:
  - `shared/styles/header.css` (신규)
  - `seoulsurvival/index.html` (인라인 스타일 → 외부 CSS 참조)
  - `shared/shell/header.js` (헤더 HTML 구조를 SeoulSurvival 패턴으로 변경)

#### 2. 버튼/카드/Chip 스타일 공통화
- **현재**: `uniform-core.css`에 기본 버튼만 있음, SeoulSurvival은 인라인 스타일
- **목표**: SeoulSurvival의 `.btn`, `.btn-lg`, `.card`, `.chip` 스타일을 `uniform-core.css`에 추가
- **변경 파일**:
  - `shared/styles/uniform-core.css` (SeoulSurvival 스타일 추가)
  - `seoulsurvival/index.html` (인라인 스타일 제거, 외부 CSS 참조)

#### 3. 테마 토큰 시스템
- **현재**: `uniform-core.css`에 기본 토큰 정의, `data-theme` 지원
- **목표**: SeoulSurvival의 CSS 변수를 테마 토큰으로 통합
- **변경 파일**:
  - `shared/styles/uniform-core.css` (테마별 토큰 정의)
  - `seoulsurvival/index.html` (인라인 `:root` 변수 제거, 테마 토큰 사용)

#### 4. 헤더 HTML 구조 통일
- **현재**: 
  - 허브: `shared/shell/header.js` (간단한 구조)
  - 게임: `seoulsurvival/index.html` (복잡한 구조: 브랜드, 즐겨찾기, 공유, 통계, 계정)
- **목표**: 허브 헤더를 SeoulSurvival 패턴으로 확장 (브랜드, 계정 버튼, SNS 링크는 푸터로)
- **변경 파일**:
  - `shared/shell/header.js` (헤더 구조 확장)
  - `index.html` (헤더 마운트 확인)

### 공통 인증 모듈화 가능성

#### 현재 상태
- ✅ **인증 코어**: `shared/auth/core.js` (이미 공통화됨)
- ✅ **인증 UI**: `shared/auth/ui.js` (이미 공통화됨)
- ✅ **계정 삭제**: `shared/auth/deleteAccount.js` (이미 공통화됨)
- ✅ **부팅 스크립트**: `shared/authBoot.js` (이미 공통화됨)

#### 추가 작업 필요
- **허브 헤더에 계정 버튼 추가**: 
  - 로그아웃 상태: "Sign in with Google" 버튼
  - 로그인 상태: 닉네임 표시 + 드롭다운/바텀시트 (계정 관리, 로그아웃)
- **허브 홈에 계정 섹션 추가** (선택사항):
  - 현재 게임은 설정 탭에 계정 섹션이 있음
  - 허브는 별도 `/account` 페이지가 있으므로 헤더 버튼만으로 충분할 수 있음

### 변경 계획 (파일 목록)

#### Step 2: 공통 UI 유니폼 추출
1. `shared/styles/header.css` (신규)
   - SeoulSurvival 헤더 스타일 추출
   - 테마 토큰 사용 (`--headerTint`, `--accent` 등)
2. `shared/styles/uniform-core.css` (수정)
   - SeoulSurvival 버튼/카드/Chip 스타일 추가
   - 테마 토큰 정의 강화
3. `seoulsurvival/index.html` (수정)
   - 인라인 스타일 제거
   - 외부 CSS 참조 추가
   - 테마 토큰으로 변수 교체
4. `shared/shell/header.js` (수정)
   - SeoulSurvival 헤더 구조로 확장
   - 계정 버튼 추가 (로그인/로그아웃 상태별)

#### Step 3: 테마 토큰 적용
1. `shared/styles/uniform-core.css` (수정)
   - `[data-theme="seoulsurvival"]` 토큰 정의
   - 기본 토큰과 테마별 토큰 분리
2. `seoulsurvival/index.html` (수정)
   - 인라인 `:root` 변수 제거
   - `data-theme="seoulsurvival"` 확인
3. `index.html` (수정)
   - `data-theme="seoulsurvival"` 확인

#### Step 4: 허브홈 페이지 생성 (v0.1)
1. `index.html` (수정)
   - 헤더 마운트 확인
   - 히어로 섹션 (게임 카드 1개 + Play Now)
   - 스크롤 콘텐츠 (소개, 업데이트 placeholder, 푸터)
2. `hub/main.js` (수정)
   - 헤더/푸터 렌더링
   - 인증 UI 초기화 (`authBoot.js` 호출)
3. `shared/shell/header.js` (수정)
   - 계정 버튼 추가 (로그인/로그아웃 상태별)
   - 드롭다운/바텀시트 메뉴 (계정 관리, 로그아웃)

#### Step 5: 계정 관리 페이지 (/account)
1. `account/index.html` (수정)
   - 닉네임 변경 UI (기존 로직 호출)
   - 계정 삭제 UI (기존 로직 호출)
2. `account/main.js` (수정)
   - 인증 UI 초기화
   - 닉네임 변경 핸들러
   - 계정 삭제 핸들러

### 리스크 및 롤백 포인트

#### 리스크
1. **SeoulSurvival 스타일 변경 시 기존 게임 UI 깨짐**
   - **완화**: 인라인 스타일을 외부 CSS로 이동 시 기존 스타일을 그대로 복사
   - **검증**: `npm run build` 후 `seoulsurvival/index.html` 로드 확인
2. **헤더 구조 변경 시 게임 헤더 깨짐**
   - **완화**: 게임은 자체 헤더 HTML을 유지, 허브만 공통 헤더 사용
   - **검증**: 게임 페이지 로드 후 헤더 렌더링 확인
3. **인증 상태 불일치 (허브 ↔ 게임)**
   - **완화**: 동일 도메인 세션/스토리지 사용 (`clicksurvivor-auth` 키)
   - **검증**: 허브에서 로그인 → 게임에서 상태 확인, 반대도 확인

#### 롤백 포인트
1. **Step 2 완료 후**: `seoulsurvival/index.html` 인라인 스타일 복원
2. **Step 3 완료 후**: `seoulsurvival/index.html` 인라인 `:root` 변수 복원
3. **Step 4 완료 후**: `shared/shell/header.js` 간단한 버전으로 복원

### 다음 단계
- Step 2: 공통 UI 유니폼 추출 시작





