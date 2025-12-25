# DEVLOG

이 파일은 "매 세션 작업 내역/의도/주의사항"을 짧게 남기는 로그입니다.  
새 프롬프트/새 창에서 시작할 때, AI는 이 파일의 **최근 항목**을 먼저 읽고 맥락을 복원합니다.

## [2025-12-25] [hub] 허브 헤더 UI/UX 개선 및 통일

### 작업 목표
- 허브 홈 헤더를 SeoulSurvival 게임 헤더와 동일한 형식으로 통일
- 로고 이미지, 즐겨찾기, 공유하기 버튼 추가
- 로그인 상태 UI 개선 및 모든 페이지에서 일관성 유지

### 주요 변경사항

#### 헤더 컴포넌트 확장
- **로고 이미지 추가**: `shared/shell/header.js`에 로고 이미지 추가 (SeoulSurvival과 동일한 형식)
  - 경로: `./seoulsurvival/assets/images/logo.png` (동적 경로 설정)
  - 현재 페이지 경로에 따라 상대 경로 자동 조정 (`account/`, `auth/callback/` 등)
- **즐겨찾기 버튼 추가**: SeoulSurvival과 동일한 형식의 즐겨찾기 버튼 추가
  - 기능: 모바일/데스크톱 환경에 맞는 안내 메시지 표시
  - CSS 스타일: `shared/styles/header.css`에 추가
- **공유하기 버튼 추가**: SeoulSurvival과 동일한 형식의 공유하기 버튼 추가
  - 기능: Web Share API 사용 (지원하지 않는 경우 안내)
  - SVG 아이콘 포함

#### 로그인 UI 개선
- **Login 버튼 스타일 통일**: Login 버튼을 즐겨찾기/공유 버튼과 동일한 스타일로 변경
  - `login-btn` 클래스 추가, 호버/액티브 효과 적용
- **닉네임 표시**: 로그인 시 `getUserProfile()` 함수를 사용하여 닉네임 조회 및 표시
  - 닉네임이 없으면 이메일 또는 표시명을 폴백으로 사용
  - `hub/main.js`와 `account/main.js` 모두 수정
- **마우스오버 메뉴**: 닉네임 클릭 대신 마우스오버로 드롭다운 메뉴 표시
  - `mouseenter`/`mouseleave` 이벤트로 구현
  - 버튼과 드롭다운 사이 간격 문제 해결 (`margin-top: 2px`, CSS hover 규칙 추가)
- **메뉴 서식 통일**: 계정 관리 링크와 로그아웃 버튼의 스타일 통일
  - `account-menu-item` 클래스로 일관된 스타일 적용

#### 페이지 간 일관성 개선
- **홈 링크 경로 수정**: 현재 페이지 경로에 따라 동적으로 홈 링크 경로 결정
  - `account/` 폴더: `../` (홈), `./` (계정 관리)
  - `auth/callback/` 폴더: `../../` (홈), `../../account/` (계정 관리)
  - 루트/기타 페이지: `./` (홈), `./account/` (계정 관리)
- **헤더 CSS 링크 추가**: `terms.html`, `privacy.html`, `account/index.html`에 `header.css` 링크 추가
- **인증 상태 동기화**: `terms.html`, `privacy.html` 등에서도 인증 UI 초기화 추가
  - `shared/shell/header.js`의 자동 렌더링 블록에 인증 초기화 로직 추가
  - 모든 페이지에서 로그인 상태가 일관되게 표시됨

#### 초기 상태 및 UX 개선
- **초기 상태 수정**: 드롭다운 메뉴가 초기 상태에서 닫혀있도록 수정
  - `renderHeader()` 함수에서 초기화 시 `display: none` 설정
- **마우스오버 간격 문제 해결**: 버튼과 드롭다운 사이 공간 때문에 메뉴가 사라지는 문제 수정
  - 드롭다운 `margin-top`을 `8px` → `2px`로 축소
  - `#headerAccountMenu` 전체에 마우스오버 이벤트 적용
  - CSS에 `#headerAccountMenu:hover .account-dropdown` 규칙 추가

### 변경된 파일
- `shared/shell/header.js`: 로고 이미지, 즐겨찾기/공유 버튼 추가, 홈 링크 경로 동적 설정, 인증 초기화 추가
- `shared/styles/header.css`: Login 버튼 스타일, 드롭다운 간격 조정, 마우스오버 CSS 추가
- `hub/main.js`: 닉네임 조회 로직 추가, async/await 수정
- `account/main.js`: 닉네임 조회 로직 추가, async/await 수정
- `terms.html`: header.css 링크 추가
- `privacy.html`: header.css 링크 추가
- `account/index.html`: header.css 링크 추가
- `RELEASE_NOTES.md`: v1.2.0 날짜를 2025-12-25로 업데이트

### 검증 결과
- ✅ 모든 허브 페이지에서 헤더 정상 표시
- ✅ 로고 이미지, 즐겨찾기, 공유하기 버튼 정상 작동
- ✅ 로그인 시 닉네임 정상 표시
- ✅ 마우스오버 메뉴 정상 작동
- ✅ 모든 페이지에서 홈 링크 정상 작동
- ✅ 모든 페이지에서 로그인 상태 일관되게 유지

### 주의사항
- 헤더는 모든 허브 페이지(`index.html`, `account/index.html`, `terms.html`, `privacy.html` 등)에서 동일하게 적용됨
- 홈 링크 경로는 현재 페이지 경로에 따라 자동으로 조정되므로, 새 페이지 추가 시 경로 로직 확인 필요
- 로그인 상태는 `shared/auth/core.js`의 `getUser()` 및 `onAuthStateChange()`를 통해 모든 페이지에서 동기화됨

---

## [2025-01-XX] [hub] v0.35 배포/운영 설정 완성 + OAuth E2E 자동화

### 작업 목표
- 프로덕션 배포 설정 문서화
- Edge Function 배포 준비 완료
- OAuth E2E 자동화 (반자동 절차)
- Supabase 활성화 및 Login 버튼 실제 작동 확인

### 주요 변경사항

#### Commit 1: docs/PROD_SETUP.md 추가
- **프로덕션 설정 체크리스트**:
  - Supabase Auth Redirect URLs (로컬/프로덕션)
  - Google Cloud OAuth 설정 (Authorized JavaScript origins, Authorized redirect URIs)
  - Edge Function 배포/시크릿 설정
  - 운영 점검 항목 (로그인/닉네임/탈퇴)
- **배포 명령 및 확인 방법**: curl 예시 포함

#### Commit 2: delete-account 함수 배포 준비
- **Edge Function 코드 개선**:
  - `nickname_registry` 테이블 삭제 추가
  - `reviews` 테이블 삭제 추가 (있는 경우)
  - CORS 설정 개선 (환경 변수 `ALLOWED_ORIGIN` 지원)
  - 에러 응답 일관성 개선
- **로컬 검증 스크립트**: curl 기반 최소 검증 방법 제공

#### Commit 3: OAuth E2E 자동화 + Supabase 활성화
- **Supabase 활성화**:
  - `shared/auth/config.js`의 `isSupabaseConfigured()` 함수 활성화
  - 하드코딩된 `return false` 제거, 실제 환경 변수 체크 로직 활성화
  - `.env.local.example` 템플릿 파일 생성
  - `docs/SETUP_SUPABASE.md` 상세 설정 가이드 작성
- **OAuth E2E 테스트**:
  - Login 버튼 클릭 → Google OAuth 리다이렉트 확인 (자동화)
  - 프로덕션 환경에서 로그인 성공 확인
  - 반자동 절차: Google 계정 선택/승인만 수동 (1회), 이후 자동 진행
- **E2E 테스트 리포트**: `docs/v0.35-e2e-test-report.md` 작성

#### Commit 4: DEVLOG 업데이트 + 수동 테스트 문구 제거
- DEVLOG.md에 v0.35 작업 내용 기록
- "수동 테스트 필요" 문구를 반자동/자동 절차로 변경
- OAuth E2E 절차 문서화

### 검증 결과
- ✅ 빌드 성공 (모든 커밋)
- ✅ Supabase 환경 변수 로드 확인
- ✅ Login 버튼 클릭 → Google OAuth 리다이렉트 확인
- ✅ 프로덕션 환경 로그인 성공 확인 (Logout 버튼 표시)

### 주의사항
- **환경 변수 설정 필요**: `.env.local` 파일에 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY` 설정 필요
- **Supabase Redirect URLs**: Supabase Dashboard에 `/auth/callback` URL 추가 필요
- **Google OAuth 설정**: Google Cloud Console에 Authorized redirect URIs 설정 필요
- **Edge Function 배포**: `supabase functions deploy delete-account` 실행 필요
- **세션 공유**: 프로덕션과 로컬 환경은 별도 세션이므로 각각 로그인 필요 (정상 동작)

### 다음 단계
- 로컬 환경에서도 OAuth E2E 테스트 완료
- Edge Function 배포 및 계정 삭제 플로우 전체 테스트
- 닉네임 변경/로그아웃 기능 E2E 테스트

---

## [2025-01-XX] [hub] v0.3 Supabase OAuth 공통화 + /account 완성

### 작업 목표
- Supabase OAuth 표준화 (공통 콜백 엔드포인트)
- `/account` 페이지 완성 (닉네임 변경, 쿨타임, 계정 삭제)
- 계정 삭제 서버측 엔드포인트 개선

### 주요 변경사항

#### Commit 1: Auth 현황 리포트
- `docs/v0.3-auth-status-report.md`: 현재 인증 구조 파악
- `signInWithOAuth` 호출 위치, `redirectTo` 값, 콜백 처리 현황 정리
- 개선 계획 수립

#### Commit 2: shared/auth 모듈 생성 + 공통 사용
- `shared/auth/core.js`:
  - `signInGoogle(nextUrl)` 함수 추가 (Google 로그인 전용)
  - `getUserProfile(gameSlug)` 함수 추가 (닉네임/유저ID 조회)
  - `signInWithOAuth(provider, redirectTo)` 개선 (redirectTo 파라미터 추가)
- `seoulsurvival/src/main.js`: 직접 호출 제거, `signInGoogle()` 사용
- `shared/auth/ui.js`: Google 로그인 시 `signInGoogle` 사용

#### Commit 3: /auth/callback 구현 + Redirect URL 정리
- `auth/callback/index.html`: OAuth 콜백 페이지 생성
- `auth/callback/main.js`: 세션 교환 + 원래 목적지로 리다이렉트
- `shared/auth/core.js`: `signInGoogle()`의 redirectTo를 `/auth/callback`으로 통일
- `docs/v0.3-redirect-urls.md`: Supabase/Google OAuth 설정 가이드

#### Commit 4: /account 페이지 구현 개선
- `account/index.html`:
  - 현재 닉네임 표시 영역 추가
  - 쿨타임 표시 영역 추가
  - 에러 메시지 표시 영역 추가
- `account/main.js`:
  - `getUserProfile()` 사용하여 현재 닉네임 표시
  - 30초 쿨타임 체크/표시 로직 추가
  - 에러 메시지 개선 (유효성 검사, 쿨타임, 닉네임 변경 실패)

#### Commit 5: 계정 삭제 서버측 엔드포인트 개선
- `supabase/functions/delete-account/index.ts`:
  - `nickname_registry` 테이블 삭제 추가
  - `reviews` 테이블 삭제 추가 (있는 경우)
  - 에러 처리 개선
- `shared/auth/deleteAccount.js`: 주석 개선 (Edge Function에서도 처리)
- `supabase/functions/README.md`: 삭제 순서 및 주의사항 문서화

#### Commit 6: DEVLOG 업데이트 + 스모크 테스트
- DEVLOG.md 업데이트 (이 항목)
- 스모크 테스트 체크리스트 문서화

### 검증 결과
- ✅ 빌드 성공 (모든 커밋)
- ✅ 콜백 페이지 정상 로드
- ✅ `/account` 페이지 기능 정상 동작
- ✅ Edge Function 코드 개선 완료

### 주의사항
- **Supabase 설정 필요**: Redirect URLs에 `/auth/callback` 추가 필요
- **Edge Function 배포 필요**: `supabase functions deploy delete-account`
- **환경 변수 설정**: Supabase Dashboard에서 Service Role Key 설정 필요

### 다음 단계
- 실제 OAuth 로그인 플로우 테스트
- Edge Function 배포 및 테스트
- 계정 삭제 플로우 전체 테스트

---

## [2025-12-23] [hub] 무한 로딩/먹통 버그 근본 해결: MutationObserver 무한 루프 제거

### 문제 증상
- 페이지는 로드되지만 클릭/우클릭/F12 개발자 도구가 전혀 동작하지 않는 "먹통" 상태
- 스크롤만 가능하고 모든 상호작용이 차단됨
- 브라우저가 JavaScript 실행에 블로킹되어 반응하지 않음

### 원인 분석

1. **MutationObserver 무한 루프 (주요 원인)**
   - `shared/shell/header.js`의 `setupDrawerNavLinks()` 함수가 `replaceChild()`로 DOM을 변경
   - `MutationObserver`가 이 변경을 감지하여 다시 `setupDrawerNavLinks()` 호출
   - 무한 루프로 브라우저 메인 스레드 블로킹
   - 코드 위치: `shared/shell/header.js:397-419` (이전 버전)

2. **applyLang()의 history.replaceState 무한 루프 가능성**
   - `shared/i18n/lang.js`의 `applyLang()` 함수가 `history.replaceState()` 호출
   - URL 변경이 다시 `applyLang()`를 트리거할 수 있는 구조
   - 여러 곳에서 `applyLang()`가 반복 호출되면서 무한 루프 가능성

3. **localStorage 접근 실패 시 예외 처리 부재**
   - `getInitialLang()`에서 `localStorage.getItem()` 호출 시 예외 처리 없음
   - 일부 환경(시크릿 모드, 쿠키 차단 등)에서 접근 실패 시 스크립트 중단 가능

4. **DOM 준비 전 스크립트 실행**
   - `index.html`에서 DOM 요소를 찾기 전에 스크립트가 실행될 수 있음

### 해결 방법

1. **MutationObserver 완전 제거 → 이벤트 위임으로 변경**
   - `setupDrawerNavLinks()` 함수와 `MutationObserver` 완전 제거
   - 이벤트 위임 패턴 사용: `.drawer-nav`에 한 번만 리스너 등록
   - 코드 변경:
     ```javascript
     // 이전: MutationObserver + replaceChild (무한 루프)
     // 이후: 이벤트 위임 (무한 루프 방지)
     const drawerNav = document.querySelector('.drawer-nav');
     if (drawerNav) {
       drawerNav.addEventListener('click', (e) => {
         if (e.target.closest('.drawer-nav-link')) {
           closeDrawer();
         }
       });
     }
     ```

2. **applyLang()의 history.replaceState 호출 비활성화**
   - URL 업데이트 로직을 주석 처리하여 무한 루프 가능성 제거
   - 필요 시 나중에 다시 활성화 가능하도록 주석으로 보존
   - 코드 위치: `shared/i18n/lang.js:89-118`

3. **localStorage 접근 에러 처리 추가**
   - `getInitialLang()`에 try-catch 추가, 실패 시 기본값 'ko' 반환
   - `localStorage.setItem()`에도 try-catch 추가
   - 코드 위치: `shared/i18n/lang.js:28-43, 81-87`

4. **header.js의 getActiveLang() 호출 보호**
   - `renderHeader()` 함수에서 `getActiveLang()` 호출을 try-catch로 보호
   - `applyLang()` 호출도 try-catch로 보호
   - 코드 위치: `shared/shell/header.js:27-35, 115, 123, 217`

5. **DOM 준비 후 스크립트 실행 보장**
   - `index.html`에서 `DOMContentLoaded` 이벤트 또는 즉시 실행 패턴 사용
   - 마운트 요소 존재 여부 확인 추가
   - 코드 위치: `index.html:52-64`

### 변경된 파일
- `shared/shell/header.js`: MutationObserver 제거, 이벤트 위임으로 변경, try-catch 추가
- `shared/i18n/lang.js`: history.replaceState 비활성화, localStorage 에러 처리 추가
- `index.html`: DOM 준비 후 스크립트 실행 보장

### 검증 방법
- 브라우저에서 `http://localhost:5173/` 접속 후 클릭/우클릭/F12 정상 동작 확인
- Play Now 버튼 클릭 → `/seoulsurvival/` 이동 확인
- 계정 관리 링크 클릭 → `/account/` 이동 확인
- 콘솔 에러 없음 확인

### 주의사항 (재발 방지)
- **MutationObserver 사용 시 주의**: DOM 변경을 감지하는 Observer가 자신의 콜백에서 DOM을 변경하면 무한 루프 발생
  - 해결책: 이벤트 위임 패턴 사용 또는 `disconnect()` 후 변경, 또는 `isProcessing` 플래그로 중복 호출 방지
- **history.replaceState 호출 시 주의**: URL 변경이 다시 같은 함수를 트리거하지 않도록 플래그나 조건 체크 필요
- **localStorage 접근**: 항상 try-catch로 감싸서 실패 시 기본값 반환
- **DOM 조작**: `replaceChild()`, `innerHTML` 등 DOM 변경 시 MutationObserver가 다시 트리거되지 않도록 주의
- **이벤트 리스너**: 중복 등록 방지를 위해 `dataset` 플래그나 이벤트 위임 패턴 사용

### 교훈
- MutationObserver는 강력하지만, 콜백 내에서 DOM을 변경하면 무한 루프가 발생하기 쉬움
- 이벤트 위임 패턴이 더 안전하고 성능도 좋음 (리스너 1개 vs N개)
- 모든 외부 API 접근(localStorage, history 등)은 try-catch로 보호해야 함
- 브라우저 자동화 테스트를 통해 실제 동작을 확인하는 것이 중요함

---

## [2025-12-22] [hub] 게임 목록 페이지 무한 로딩 버그 수정

### 작업 내용
1. **초기화 순서 문제 해결**
   - `games/main.js`에서 `initCommonShell()`이 `async`인데 `await` 없이 호출되어 헤더/푸터 렌더링 완료 전에 초기 렌더링이 실행되는 문제 수정
   - IIFE(async)로 변경하여 `await initCommonShell()` 후 초기 렌더링 실행
   - 필터 탭 이벤트 리스너를 초기화 블록 안으로 이동하여 DOM 준비 후 실행

2. **Auth 초기화 타임아웃 보호**
   - `shared/shell/header.js`의 `getUser()` 호출에 3초 타임아웃 추가 (`Promise.race`)
   - Auth 초기화 실패 시에도 guest 상태로 표시하여 페이지 로딩 차단 방지
   - try-catch로 오류 처리 강화

3. **오류 처리 강화**
   - `games/main.js` 초기화 블록에 try-catch 추가
   - 오류 발생 시에도 최소한의 렌더링(Featured Hero, Games Grid) 시도

### 변경된 파일
- `games/main.js`: 초기화 순서 수정 (await initCommonShell, 필터 탭 이벤트 이동, try-catch 추가)
- `shared/shell/header.js`: Auth 초기화 타임아웃 보호 추가

### 주의사항
- Auth 초기화가 실패하거나 타임아웃되어도 페이지는 정상 로드되어야 함 (guest 모드)
- 필터 탭 이벤트는 DOM이 준비된 후에만 등록되므로, 초기 렌더링 전에는 클릭해도 동작하지 않을 수 있음 (정상 동작)

---

## [2025-12-22] [hub] SEO 개선 P1: 서브 페이지 정렬 + sitemap 확장 + 구조화데이터

### 작업 내용
1. **sitemap.xml 확장**
   - `/games/`, `/games/seoulsurvival/`, `/patch-notes/`, `/support/` 추가
   - 각 페이지별 priority/changefreq 설정 (게임 스토어/상세: 0.8~0.9, 패치노트: 0.7, 지원: 0.5)

2. **허브 홈 내부 링크 강화**
   - 헤더 nav에 "게임 목록", "패치노트" 링크 추가
   - 푸터 게임 섹션에 "게임 목록" 링크 추가, 지원 섹션에 "패치노트" 링크 추가
   - 사이트 구조를 크롤러/사용자에게 더 명확하게 노출

3. **서브 페이지 SEO 메타 정리**
   - `games/index.html`: robots meta 추가 (`index,follow`)
   - `games/seoulsurvival/index.html`: robots meta 추가, OG 이미지 경로 정규화 (`og-seoulsurvivor.png` → `seoulsurvivor-1200x630.png`)
   - `patch-notes/index.html`: robots meta 추가, OG 이미지 버전 쿼리 업데이트 (`2025-01-XX` → `2025-12-22`)
   - `account/index.html`: `noindex,follow` 설정 (계정 관리 페이지는 검색 노출 불필요), canonical 추가, theme-color 추가

4. **구조화 데이터 확장 (VideoGame 스키마)**
   - `games/seoulsurvival/index.html`에 `VideoGame` JSON-LD 추가
   - 필드: name, alternateName, url, image, description, applicationCategory, gamePlatform, operatingSystem, genre, inLanguage, publisher, offers, aggregateRating
   - 검색엔진이 게임 정보를 구조화하여 인식하고, 리치 스니펫/게임 카드 표시 가능성 향상

### 변경된 파일
- `public/sitemap.xml`: 4개 URL 추가 (games/, games/seoulsurvival/, patch-notes/, support/)
- `index.html`: 헤더 nav + 푸터 링크 추가
- `games/index.html`: robots meta 추가
- `games/seoulsurvival/index.html`: robots meta 추가, OG 이미지 경로 정규화, VideoGame JSON-LD 추가
- `patch-notes/index.html`: robots meta 추가, OG 이미지 버전 쿼리 업데이트
- `account/index.html`: robots meta (`noindex`), canonical, theme-color 추가

### 주의사항
- 계정 관리 페이지는 `noindex`로 설정하여 검색 노출 방지 (개인정보/로그인 페이지는 일반적으로 인덱싱 불필요)
- OG 이미지 경로는 README 가이드(`public/og/*.png`)와 일치하도록 정규화
- VideoGame 스키마는 향후 게임 추가 시 템플릿으로 활용 가능

---

## [2025-12-22] [hub] SEO 개선 P0: 허브 홈 메타/구조화데이터/시맨틱 정리

### 작업 내용
1. **허브 홈 메타/OG/Twitter/Canonical/Robots 정렬**
   - `<title>`: "ClickSurvivor 허브 | Capital Clicker: Seoul Survival" (브랜드+핵심키워드+가치제안)
   - `<meta name="description">`: 허브 역할 + 다중 게임 + 계정/랭킹 가치제안 카피
   - `<link rel="canonical" href="https://clicksurvivor.com/" />` 추가
   - `<meta name="robots" content="index,follow">` 명시
   - OG 메타: `og:site_name`, `og:locale=ko_KR`, `og:image`를 `public/og/clicksurvivor-home-1200x630.png?v=2025-12-21`로 정규화, `og:image:width/height` 추가
   - Twitter Card: OG와 동일한 값으로 통일
   - `<meta name="theme-color" content="#0b0f19" />` 추가

2. **구조화 데이터(JSON-LD) 추가**
   - `Organization` (ClickSurvivor 브랜드)
   - `WebSite` (SearchAction 포함: `/games/?q={search_term_string}`)
   - `ItemList` (대표 게임: Capital Clicker: Seoul Survival을 VideoGame으로 표현)

3. **시맨틱 H 계층 정리**
   - 섹션 타이틀을 `div.sectionTitle` → `h2.sectionTitle`로 변경 (#about, #screenshots, #account)
   - H1(히어로 게임명) + H2(섹션) 구조로 검색엔진/스크린리더 친화적 계층 확립

### 변경된 파일
- `index.html`: 메타태그 정리, JSON-LD 추가, H2 시맨틱 정리

### 주의사항
- OG 이미지는 README의 SEO 가이드(`public/og/*.png?v=날짜`) 규칙 준수
- 구조화데이터는 향후 게임 추가 시 `ItemList.itemListElement` 확장으로 쉽게 확장 가능

---

## [2025-01-XX] [hub] Auth 상태머신 + 공통 Shell 통합 (모순 제거)

### 작업 내용
1. **Auth 상태머신 구현**
   - `shared/auth/state.js` 생성: 단일 진실 소스 (loading | guest | authed | error)
   - `getAuthState()`, `refreshAuth()`, `subscribeAuth()` 함수 제공
   - publish/subscribe 구조로 상태 변경 시 자동 UI 업데이트

2. **공통 i18n 유틸 공용화**
   - `shared/i18n/lang.js` 생성: hub/i18n.js 재사용
   - `getActiveLang()`, `t()`, `applyLang()` 함수 제공

3. **공통 Shell 컴포넌트화**
   - `shared/shell/header.js`: 공통 헤더/드로어 컴포넌트
   - `shared/shell/footer.js`: 공통 푸터 컴포넌트
   - 모든 페이지에서 동일한 헤더/푸터 사용

4. **페이지별 공통 컴포넌트 적용**
   - `index.html`: 헤더/푸터를 마운트 포인트로 변경
   - `hub/main.js`: 공통 헤더/푸터 렌더링 로직 추가
   - `account/index.html`: 헤더/푸터를 마운트 포인트로 변경
   - `account/main.js` 생성: 공통 헤더/푸터 렌더링

5. **Auth 상태머신 규칙 적용**
   - loading: "Checking session…"만 노출
   - guest: Login 버튼만 노출, Logout/로그인됨/Provider 정보 절대 노출 금지
   - authed: Profile + Logout만 노출, Login 버튼 절대 노출 금지
   - error: 재시도/지원 링크만

6. **shared/authBoot.js 개선**
   - 새로운 상태머신 기반으로 UI 업데이트
   - 상태머신 규칙에 따라 버튼 표시/숨김 처리

### 변경된 파일
- `shared/auth/state.js`: Auth 상태머신 (신규)
- `shared/i18n/lang.js`: 공용 i18n 유틸 (신규)
- `shared/shell/header.js`: 공통 헤더 컴포넌트 (신규)
- `shared/shell/footer.js`: 공통 푸터 컴포넌트 (신규)
- `shared/authBoot.js`: 상태머신 기반으로 재작성
- `hub/main.js`: 공통 컴포넌트 사용하도록 수정
- `account/main.js`: 공통 컴포넌트 사용 (신규)
- `index.html`: 헤더/푸터 마운트 포인트로 변경
- `account/index.html`: 헤더/푸터 마운트 포인트로 변경

### 주의사항
- Auth 상태머신은 단일 진실 소스: 모든 페이지에서 동일한 상태 표기
- 공통 헤더/푸터는 모든 페이지에서 재사용 가능
- 접근성: 숨김 요소는 aria-hidden + tabindex=-1 처리
- 드로어 포커스 복귀 규칙 유지

---

## [2025-01-XX] [hub] Steam 스타일 게임 스토어 페이지 구현

### 작업 내용
1. **레지스트리 확장**
   - `hub/games.registry.js`에 Steam 스토어 페이지에 필요한 필드 추가
   - keyFeatures, about, support, screenshots, patchNotePreview 등 상세 콘텐츠 필드 추가
   - 다국어 지원 구조 개선 (tags를 객체 배열로 변경)

2. **/games/ 페이지 Steam 스타일 재구현**
   - Featured Hero 섹션: 레지스트리 기반 동적 렌더링
   - Browse 섹션: playable/comingSoon 탭 필터 + 검색 기능
   - All Titles 그리드: 반응형 카드 레이아웃 (1~4열)
   - 카드 CTA: playable → "자세히 보기" + "지금 플레이", comingSoon → "자세히 보기"만

3. **/games/seoulsurvival/ Steam 스토어 페이지 스타일 구현**
   - 2컬럼 레이아웃: Left(메인 콘텐츠) + Right(사이드바)
   - Left: Hero media → Screenshots 갤러리 → About → Key Features → Updates preview → Support
   - Right: Title/Tags/Summary/CTA + 지원 환경 요약
   - 레지스트리 기반 동적 렌더링 (하드코딩 금지)
   - 모바일: 1컬럼 스택

4. **SEO/OG 메타태그**
   - 모든 신규 페이지에 canonical/og:url/og:title/og:description/og:image 설정
   - og:image는 coverImage 사용

### 변경된 파일
- `hub/games.registry.js`: 레지스트리 확장 (keyFeatures, about, support, screenshots, patchNotePreview 추가)
- `games/index.html`, `games/main.js`: Steam 스타일 스토어 페이지로 재구현
- `games/seoulsurvival/index.html`, `games/seoulsurvival/main.js`: Steam 스토어 페이지 스타일로 재구현

### 주의사항
- 레지스트리는 단일 소스 원칙: 모든 게임 정보는 `hub/games.registry.js`에서만 관리
- 향후 게임 추가 시 `/games/seoulsurvival/` 페이지를 템플릿으로 복제 가능
- base: './' 전제에서 상대 경로 링크가 깨지지 않도록 테스트 완료
- 이미지 lazy-loading 및 aspect-ratio로 CLS 방지

---

## [2025-01-XX] [hub] 다게임 허브 IA + 기본 UI 구현

### 작업 내용
1. **게임 레지스트리 시스템 구축**
   - `hub/games.registry.js` 생성: 단일 소스로 모든 게임 정보 관리
   - 필드: slug, title(ko/en), tagline, status(playable/comingSoon/hidden), featured, playPath, storePath, coverImage, tags, updatedAt
   - 유틸 함수: getGame, getPlayableGames, getComingSoonGames, getVisibleGames, getFeaturedGame, getRecentlyUpdatedGames

2. **신규 페이지 3개 추가**
   - `/games/`: 게임 카탈로그 (검색/필터, 카드 리스트)
   - `/patch-notes/`: 전역 패치노트 (RELEASE_NOTES.md 기반, 정적 MVP)
   - `/games/seoulsurvival/`: 게임 상세 페이지 (스크린샷, 기능, 패치노트 요약)

3. **허브 홈 리디자인**
   - 히어로: 레지스트리 기반 Featured 게임 동적 렌더링
   - All Games 섹션: 최대 6개 게임 카드 (가로 스크롤)
   - Recently Updated 섹션: 최대 3개 게임 카드 (updatedAt 기준)
   - `hub/home.js` 추가: 게임 렌더링 로직 분리

4. **드로어 네비게이션 정리**
   - 게임 목록, 패치노트 링크 추가
   - 푸터 링크 정리 (게임 목록, 패치노트 추가)

5. **SEO/OG 메타태그**
   - 신규 페이지 모두 canonical/og:url/og:image 설정
   - OG 이미지 캐시 파라미터 규칙 준수 (v=YYYY-MM-DD)

6. **Vite 빌드 설정**
   - `vite.config.js`에 신규 엔트리 추가 (games, games-seoulsurvival, patch-notes)

### 변경된 파일
- `hub/games.registry.js`: 게임 레지스트리 (신규)
- `hub/home.js`: 홈 게임 렌더링 (신규)
- `games/index.html`, `games/main.js`: 게임 카탈로그 (신규)
- `games/seoulsurvival/index.html`, `games/seoulsurvival/main.js`: 게임 상세 (신규)
- `patch-notes/index.html`, `patch-notes/main.js`: 패치노트 (신규)
- `index.html`: 허브 홈 리디자인 (Featured/All Games/Recently Updated 섹션 추가)
- `vite.config.js`: 신규 엔트리 추가

### 주의사항
- 게임 레지스트리는 단일 소스 원칙: 모든 게임 정보는 `hub/games.registry.js`에서만 관리
- status=hidden 게임은 허브/카탈로그 어디에도 노출되지 않음
- base: './' 전제에서 상대 경로 링크가 깨지지 않도록 테스트 필요
- 향후 게임 추가 시 `/games/seoulsurvival/` 페이지를 템플릿으로 복제 가능

---

## [2025-01-XX] 글로벌 유니크 닉네임 시스템 완성 (v1.2.0)

### 작업 내용
1. **닉네임 회수(Release) 정책 적용**
   - `releaseNickname()` 함수 구현 (`shared/leaderboard.js`)
   - `release_nickname` RPC 함수 추가 (`supabase/nickname_registry.sql`)
   - 계정 탈퇴 시 자동 닉네임 회수 (`shared/auth/deleteAccount.js`)

2. **마이그레이션 충돌 UX 강제**
   - `needsNicknameChange` 플래그 시스템 구현 (`localStorage`)
   - 설정 탭 진입 시 충돌 감지 시 닉네임 변경 모달 자동 오픈
   - 충돌 배너 표시 (`seoulsurvival/index.html`, `seoulsurvival/src/main.js`)

3. **문서 정리**
   - README.md: 닉네임 정책 섹션 추가
   - ARCHITECTURE.md: Nickname System 섹션 추가 (테이블/RPC/플로우 설명)

4. **릴리즈 노트 및 버전 업데이트**
   - 버전: 1.0.0 → 1.2.0 (MINOR 상승)
   - RELEASE_NOTES.md: v1.2.0 섹션 추가

### 변경된 파일
- `supabase/nickname_registry.sql`: `release_nickname` RPC 함수 추가
- `shared/leaderboard.js`: `releaseNickname()` 함수 추가
- `shared/auth/deleteAccount.js`: 계정 탈퇴 시 닉네임 회수 호출
- `seoulsurvival/src/main.js`: 마이그레이션 충돌 UX 강제 로직 추가
- `seoulsurvival/src/i18n/translations/ko.js`, `en.js`: 마이그레이션 충돌 메시지 추가
- `README.md`: 닉네임 정책 섹션 추가
- `ARCHITECTURE.md`: Nickname System 섹션 추가
- `RELEASE_NOTES.md`: v1.2.0 섹션 추가
- `package.json`: 버전 1.2.0으로 업데이트

### 주의사항
- **Supabase SQL 실행 필요**: `supabase/nickname_registry.sql`을 실행하여 `release_nickname` RPC 함수를 추가해야 합니다
- **기존 사용자 영향**: 일부 사용자는 닉네임이 중복되어 변경이 필요할 수 있습니다 (마이그레이션 충돌 UX로 안내)

---

## 2025-12-21 (설정 탭 게임 새로 시작 오류 수정: 컨텍스트 독립 프레스티지)
- **[seoulsurvival] 설정 탭 게임 새로 시작 오류 수정**
  - 문제: 설정 > 게임 새로 시작 클릭 시 "게임 초기화 중 오류가 발생했습니다" 팝업 표시
  - 원인: `performAutoPrestige()`가 모달이 닫히는 과정에서 DOM 접근 시 충돌 발생 가능성
  - 해결:
    - `performAutoPrestige(source)` 파라미터 추가로 호출 경로 추적 (엔딩/설정 구분)
    - 모달이 완전히 닫힌 후 프레스티지 실행 (setTimeout 100ms로 DOM 안정화 대기)
    - `performAutoPrestige()` 내부에 try-catch 추가하여 UI 업데이트/저장 실패 시에도 게임 상태는 초기화되도록 보장
    - `updateUI()` 전체를 try-catch로 감싸서 DOM 접근 오류 안전 처리
  - 에러 처리 개선: console.error로 실제 원인과 스택 출력, 치명적 오류만 사용자에게 알림
  - 컨텍스트 독립성: 엔딩 경로와 설정 경로 모두에서 안전하게 동작하도록 보장

## 2025-12-21 (설정 탭 게임 새로 시작 기능을 A안(수동 프레스티지)으로 고정)
- **[seoulsurvival] 설정 탭 게임 새로 시작 기능을 A안(수동 프레스티지)으로 변경**
  - 기존 동작: `resetGame()`이 localStorage를 완전히 삭제하고 페이지 새로고침 → 모든 데이터 삭제
  - 변경 후: `resetGame()`이 `performAutoPrestige()`를 호출하여 런 상태만 초기화, 누적 데이터 유지
  - 초기화 대상: 자산/보유 수량/이번 런 플레이 시간/towers_run
  - 유지 대상: towers_lifetime, 누적 플레이 시간(totalPlayTime), 닉네임, 계정/로그인 상태, 언어/설정값
  - Confirm 모달 문구 수정: "모든 진행 상황 삭제" → "이번 런 초기화, 🗼누적 기록과 ⏱누적 시간 유지" (KO/EN)
  - 설정 탭 경고 문구 수정: "모든 진행 상황 삭제" → "이번 런 초기화, 누적 데이터 유지" (KO/EN)
  - 저장/클라우드 정합성: `performAutoPrestige()` 내부에서 `saveGame()` 호출로 즉시 저장 반영
  - UI 갱신: `updateUI()` 호출로 모든 탭이 초기 상태로 반영됨

## 2025-12-21 (프레스티지 초기화 버그 근본 해결: 상품 정의 기반 일괄 초기화)
- **[seoulsurvival] 프레스티지 보유 수량 초기화 버그 근본 해결**
  - 문제: 프레스티지 후 코인~빌딩 보유 수량이 유지되는 버그 (예금~국내주식은 정상 초기화)
  - 원인: 하드코딩 나열 방식으로 초기화하여 일부 변수 누락 가능성 및 상품 추가 시 수정 필요
  - 해결: `resetRunHoldings()` 함수 생성 - 상품 정의 리스트(FINANCIAL_INCOME, BASE_COSTS)를 순회하여 모든 보유 수량 일괄 초기화
  - 구현 방식:
    - 금융상품: FINANCIAL_INCOME 키(deposit, savings, bond, usStock, crypto) → 변수명(deposits, savings, bonds, usStocks, cryptos) 매핑
    - 부동산: BASE_COSTS 키(villa, officetel, apartment, shop, building) → 변수명(villas, officetels, apartments, shops, buildings) 매핑
    - 상품 추가/삭제 시 초기화 코드 수정 최소화 (상수 정의만 수정하면 자동 반영)
  - `performAutoPrestige()`에서 `resetRunHoldings()` 호출로 모든 보유 수량 초기화 보장
  - 저장/로드 정합성: `saveGame()`에서 모든 보유 수량이 0으로 저장되도록 보장

## 2025-12-21 (QA 이슈 수정: 모달 번역/리더보드 UI/프레스티지 초기화)
- **[seoulsurvival] 클라우드 불러오기 모달 번역 키 추가**
  - `seoulsurvival/src/i18n/translations/ko.js`에 `modal.confirm.cloudLoad.title` 및 `modal.confirm.cloudLoad.message` 추가
  - 원인: 영어 번역 파일에는 존재하나 한국어 번역 파일에 누락되어 키 문자열이 그대로 노출됨
  - 해결: 한국어 번역 추가로 모달 제목/본문이 정상적으로 번역되어 표시됨
- **[seoulsurvival] 리더보드 테이블 컬럼 겹침 수정**
  - CSS 수정: `col-nickname`을 유연하게(width: auto), `col-tower`를 고정 폭(40px)으로 조정
  - 타워 컬럼 헤더 텍스트 제거: `<th class="col-tower" aria-label="서울타워"></th>`로 변경하여 공란 표시
  - 테이블 레이아웃: `table-layout: auto`로 변경하여 닉네임 컬럼이 최대한 잘리지 않도록 개선
- **[seoulsurvival] 서울타워 가격 표시 수정**
  - 가격 포맷 함수 변경: `formatPropertyPrice()` → `formatNumberForLang()` 사용
  - 결과: "10,000억" → "1조"로 정상 표시 (한국어), 영어는 "1T"로 표시
- **[seoulsurvival] 엔딩 이펙트 z-index 및 가시성 개선**
  - z-index 상향: 1000 → 10001 (모달 오버레이 z-index: 9999보다 위)
  - 이모지 개수 증가: 15개 → 30개
  - 생성 간격 단축: 50ms → 40ms로 더 빠르게 생성
- **[seoulsurvival] 엔딩 모달 자동 타이머 제거**
  - 3초 후 자동 프레스티지 실행 로직 제거
  - 버튼 클릭으로만 프레스티지 실행: 버튼 텍스트를 "새로운 시작"으로 변경 (`button.newStart` 번역 키 추가)
  - 모달은 유저가 버튼을 누를 때까지 유지되어 여운 제공
- **[seoulsurvival] 프레스티지 초기화 범위 확장**
  - `performAutoPrestige()` 함수에 `bonds = 0` 추가 (국내주식 초기화 누락 수정)
  - 모든 금융 상품(예금/적금/국내주식/미국주식/코인) 및 부동산(빌라~서울타워) 보유 수량이 0으로 초기화됨을 확인

## 2025-12-20 (프레스티지 시스템 개편: 자동 프레스티지 + 리더보드 지속 업데이트)
- **[seoulsurvival] 프레스티지 시스템 개편: 자동 프레스티지 구현**
  - 데이터 모델 변경: `towers` → `towers_run` (현재 런) + `towers_lifetime` (계정 누적) 분리
  - 엔딩 모달 개편: 선택지([새로 시작]/[나중에]) 제거, 자동 프레스티지 실행으로 변경
  - 엔딩 연출: 서울타워 이모지가 하늘에서 떨어지는 애니메이션 추가 (`createTowerFallEffect()`)
  - 자동 프레스티지 함수: `performAutoPrestige()` 구현, `towers_lifetime` 유지, `towers_run` 및 자산/보유 초기화
  - 타이머 기반 자동 진행: 엔딩 모달 3초 후 자동 프레스티지 실행
- **[seoulsurvival] 리더보드 지속 업데이트 구현**
  - 리더보드 업데이트 중단 로직 제거: `updateLeaderboardEntry()`에서 `towers > 0` 체크 삭제
  - 엔딩 이후에도 계속 업데이트: `towers_lifetime` 기준으로 자산/플레이타임 갱신 지속
  - 리더보드 테이블에 타워 컬럼 추가: 닉네임 오른편에 별도 컬럼(`col-tower`) 추가, "🗼x3" 형태로 표시
  - 저장/로드 마이그레이션: 기존 `towers` 데이터를 `towers_lifetime`으로 자동 변환
- **[seoulsurvival] UI/UX 개선**
  - 헤더 배지: `towers_lifetime` 기준으로 표시
  - 투자 섹션: 현재 런(`towers_run`)과 누적(`towers_lifetime`) 구분 표시
  - 리더보드 테이블: 타워 컬럼 CSS 스타일 추가 (중앙 정렬, 48px 폭)
  - 서울타워 이펙트: `prefers-reduced-motion` 지원, 최대 15개 이모지, 2초 애니메이션
- **주의사항**
  - 프레스티지 시 `towers_lifetime`은 절대 초기화되지 않음 (계정 누적 데이터)
  - 닉네임 변경 시에도 `towers_lifetime` 유지 (리더보드 기준)
  - 리더보드는 항상 `towers_lifetime`을 사용하여 업데이트/표시/정렬

## 2025-12-20 (다국어 지원 시스템 구현)
- **[seoulsurvival] 다국어 지원(i18n) 시스템 구축**
  - i18n 인프라: `seoulsurvival/src/i18n/index.js`에 핵심 함수 구현 (`STORAGE_KEY`, `translations`, `resolveLang`, `getLangFromUrl`, `getInitialLang`, `t`, `setLang`, `getLang`, `applyI18nToDOM`)
  - 번역 파일: `seoulsurvival/src/i18n/translations/ko.js` (한국어, 기본), `en.js` (영어)
  - 언어 동기화: 허브와 동일한 `localStorage` 키(`clicksurvivor_lang`) 사용, URL 파라미터(`?lang=ko|en`) 지원
  - 번역 범위: 약 400개 텍스트 번역 (탭 제목, 버튼, 상품명, 업적, 업그레이드, 시장 이벤트, 모달, 일기장 등)
  - DOM 번역: `data-i18n` 속성으로 정적 텍스트 자동 번역, `data-i18n-alt`, `data-i18n-aria-label` 지원
  - 동적 텍스트: `t()` 함수로 모든 로그 메시지, 모달, 업적 툴팁, 일기장 엔트리 번역
  - 언어 변경: Settings 탭에서 언어 선택 시 즉시 UI 업데이트 (`updateAllUIForLanguage()`)
  - 숫자 포맷: `formatNumberForLang()` 함수로 한국어(만/억/조)와 영어(K/M/B/T) 단위 지원
- **[seoulsurvival] 번역 품질 개선 및 QA**
  - 업적 툴팁 번역: `updateAchievementGrid()` 및 `getAchText()` 함수에서 `t()` 사용, 32개 업적 모두 번역
  - Settings 탭: Status/User 필드 `data-i18n` 속성 추가, Last Save 시간 포맷 로케일 적용
  - 모달 번역: 닉네임 설정, Reset Game, 클라우드 세이브 관련 모든 모달 메시지 번역
  - 일기장 번역: `diaryize()` 함수에서 모든 일기 엔트리 템플릿 번역
  - 번역 키 구조: `tab.*`, `button.*`, `product.*`, `achievement.*`, `upgrade.*`, `modal.*`, `diary.*` 등 계층적 구조
  - QA 완료: 브라우저에서 영어 모드로 모든 탭/모달/툴팁 확인, 남은 한글 제거

## 2025-12-20 (프레스티지 시스템 구현)
- **[seoulsurvival] 프레스티지 시스템: 서울타워 구현**
  - 엔드게임 콘텐츠 추가: 서울타워(🗼) 상품 추가, 가격 1조원, CEO 달성 + 빌딩 1개 이상 보유 시 해금
  - 구매 로직: `buySeoulTower()` 함수 구현, 구매 시 현금 차감 및 `towers` 상태 변수 증가
  - 엔딩 시퀀스: 타워 구매 시 엔딩 모달 표시, 일기장에 기록 추가
  - 리더보드 통합: 타워 구매 시 리더보드에 타워 개수 업데이트, 이후 자산 변화는 리더보드에 반영되지 않음 (`shouldUpdateLeaderboard` 플래그)
  - UI 업데이트: 헤더에 타워 배지 추가, 투자 섹션에 서울타워 카드 추가, 해금/구매 가능 상태 표시
  - 게임 상태 저장: `towers` 변수를 저장/로드에 포함, 게임 리셋 시 초기화
- **[seoulsurvival] 밸런싱 조정**
  - 판매 환급률: 80% → 100% (`SELL_RATE = 1.0`) 변경, 현실성/재미 향상
  - 가격 성장률: 1.10 → 1.05 (`DEFAULT_GROWTH = 1.05`) 변경, 구매 난이도 완화
  - 적용 위치: `seoulsurvival/src/main.js`의 `getFinancialSellPrice`, `getPropertySellPrice`, `getFinancialCost`, `getPropertyCost`, `getPriceMultiplier` 함수
- **[공통/리더보드] 프레스티지 순위 시스템 구현**
  - 데이터베이스 스키마 확장: `supabase/leaderboard.sql`에 `tower_count` 컬럼 추가, 복합 인덱스 생성 (`tower_count DESC, total_assets DESC`)
  - RPC 함수 추가: `get_my_rank` 함수에 `tower_count` 반환 및 타워 개수 우선 정렬 로직 포함
  - 리더보드 모듈 업데이트: `shared/leaderboard.js`의 `updateLeaderboard`, `getLeaderboard`, `getMyRank` 함수에 `tower_count` 지원 추가
  - 순위 정렬 로직: 타워 개수 우선 → 자산 순 (타워 개수가 같으면 자산 많은 순)
  - 마이그레이션 스크립트: `supabase/leaderboard-migration-tower-count.sql` 생성, 기존 함수 삭제 후 재생성 로직 포함
- **[seoulsurvival] 버그 수정 및 QA**
  - `elBuyTower` 중복 선언 오류 수정: 중복 선언 제거
  - 타워 가격 계산 버그 수정: 고정 가격(1조원)으로 변경, 등비 수열 계산 제거
  - 타워 판매 방지: `updateButton` 함수에서 타워는 판매 버튼 표시 안 함
  - 리더보드 오류 해결: Supabase 스키마 업데이트 완료, `tower_count` 컬럼 및 RPC 함수 정상 동작 확인

## 2025-12-19 (프로덕션 마무리)
- **[hub] 프로덕션 품질 마무리**
  - 404 해결: `terms.html` / `privacy.html`을 `vite.config.js`의 `rollupOptions.input`에 추가하여 멀티페이지 빌드에 포함
  - 프로덕션 문구 제거: `footer-dev-info`의 "Dev: localhost..." 문구를 `import.meta.env.DEV` 조건부 렌더링으로 처리 (프로덕션에서는 DOM에서 완전 제거)
  - Auth UI 접근성 개선: 로그인/로그아웃 버튼에 `aria-hidden` 및 `tabindex` 속성 추가하여 숨김 상태에서 스크린리더/탭 포커스 완전 제외
  - 적용 위치: `shared/auth/ui.js` (헤더 버튼), `hub/main.js` (드로어 버튼 동기화)
  - 검증: 빌드 산출물에서 terms.html/privacy.html 생성 확인, 프로덕션 문구 0개 확인, 접근성 속성 적용 확인

## 2025-12-19 (최종)
- **[hub] 계정관리 페이지 분리 (/account/)**
  - Cloudflare Pages 폴더형 URL 구조로 계정관리 페이지 분리
  - `account/index.html` 생성: 헤더/드로어 구조 재사용, 계정관리 전용 UI (Account Overview/Preferences/Privacy & Data/Danger Zone)
  - 메인 페이지(/) 정리: 계정관리 전체 UI 제거, 로그인 CTA + "계정 관리로 이동" 링크만 유지
  - 위험 버튼(내 데이터 삭제, 계정 삭제)은 `/account/` 페이지에만 존재
  - 네비 링크 변경: 모든 `#account` 앵커를 `account/` 경로로 변경 (상대 경로, 헤더/드로어/푸터)
  - Vite 빌드 설정: `vite.config.js`에 `account/index.html` 추가하여 멀티 페이지 지원
  - 공통 auth UI 로직 호환: `shared/auth/ui.js`의 `setUI()`가 메인/account 페이지 모두에서 동작하도록 null-safe 처리
  - base 설정: 멀티 페이지(/, /seoulsurvival/, /account/) 자산 경로 안정화를 위해 `base: './'`로 전환

## 2025-12-19 (허브 UI/UX 정돈)
- **[hub] 전체 UI 리스킨: 토큰 기반으로 일관성/가독성 개선**
  - `index.html`에 디자인 토큰 도입: 색상/간격/타이포 스케일을 CSS 변수로 정리
  - 포인트 컬러를 1개(blue) 중심으로 통일, 과한 그라데이션/보조 포인트 노출을 축소
  - 버튼/링크/셀렉트/햄버거/드로어 버튼의 터치 타겟을 44px 기준으로 정렬
  - 접근성: `:focus-visible` 포커스 링 추가(키보드 탐색 시 시각적 피드백)
  - 섹션 리듬 정리: section title 간격 스케일화, 카드/스크린샷 캡션 가독성 개선
  - base('./') 전제에 맞게 허브 링크를 상대 경로로 정리 (`account/` 등)

## 2025-12-19 (후반)
- **[hub] 네비게이션 및 계정관리 UI 개선**
  - PC에서도 햄버거 메뉴를 기본 네비게이션으로 사용 (모든 뷰포트에서 드로어 단일 진입점)
  - 헤더의 nav와 actions를 기본 숨김 처리, 햄버거 버튼만 표시
  - 드로어 포커스 관리 추가: 열릴 때 첫 포커스 요소로 이동, 닫힐 때 햄버거 버튼으로 복귀
  - 계정관리 UI를 업계 우수 사례에 맞게 섹션별 카드 구조로 재구성:
    - Account Overview: 표시명/이메일/로그인 제공자/로그아웃
    - Preferences: 언어 설정 (로그인 여부와 관계없이 표시)
    - Privacy & Data: 내 데이터 삭제 버튼 (클라우드 세이브/랭킹 삭제, 계정 유지)
    - Danger Zone: 계정 삭제 버튼 (회원 탈퇴, 모든 데이터 삭제)
  - "내 데이터 삭제"와 "계정 삭제" 기능의 문구를 명확히 분리하여 혼동 방지
  - 계정 삭제 confirm 1단계에 삭제되는 항목 목록 명시
  - 드로어에는 "계정 관리" 링크만 제공, 위험 버튼은 계정 섹션 내부에만 존재
  - 언어 선택 동기화: 헤더/드로어/계정 섹션의 언어 선택이 모두 동기화됨

## 2025-12-19
- **[hub] 계정 삭제(회원 탈퇴) 기능 구현**
  - 보안 원칙 준수:
    - Service Role Key는 절대 프론트엔드에 포함하지 않음
    - 계정 삭제는 Supabase Edge Function에서만 수행 (`supabase/functions/delete-account/index.ts`)
    - Edge Function은 JWT 검증 후 Service Role Key로 `admin.deleteUser()` 호출
  - Edge Function 구현:
    - 입력: Authorization Bearer 토큰으로 사용자 인증
    - 로직: game_saves/leaderboard 삭제 → auth.users 삭제 (트랜잭션 처리)
    - 응답: ALL_SUCCESS, DATA_DELETED_BUT_AUTH_DELETE_FAILED, AUTH_FAILED, NOT_CONFIGURED, UNKNOWN_ERROR
    - 로깅: 민감 정보/키/토큰은 로그에 남기지 않음
  - 프론트엔드 구현:
    - `shared/auth/deleteAccount.js`: Edge Function 호출 함수 (30초 타임아웃)
    - 계정 섹션(#account)에만 "계정 삭제(회원 탈퇴)" 버튼 추가 (드로어에는 없음)
    - 2단계 confirm: 계정+데이터 삭제 경고, 삭제될 내용 명시
    - 에러 처리: 각 상황별 명확한 메시지 (401/403/404/타임아웃/네트워크 오류)
    - 삭제 성공 시: LocalStorage 정리 → 로그아웃 → 페이지 새로고침
  - 리스크 설계 문서: `docs/account-deletion-risks.md`에 10개 리스크 항목 정리 (현상/원인/대응/사용자 안내/테스트 방법)

- **[hub] 리스크 점검 및 보완 (계정 관리/회원 탈퇴 기능)**
  - LocalStorage 삭제 범위 정확화:
    - 실제 사용 키 확인: `clicksurvivor-auth` (인증), `clicksurvivor_lang` (언어), `seoulTycoonSaveV1` (게임 저장)
    - 삭제 정책 변경: 계정/세이브 관련 키만 삭제, 언어 설정(`clicksurvivor_lang`)은 유지
    - 명시적 키 목록 방식으로 변경하여 향후 확장 시 안전성 확보
  - 에러 처리 및 사용자 안내 강화:
    - 네트워크 오류/권한 오류(401/403)/토큰 만료 등 각 상황별 명확한 메시지 제공
    - 삭제 실패 시 재시도 유도 및 권한 오류 시 로그아웃 제안
    - 2단계 confirm 모달에 삭제될 데이터 목록 명시
  - 위험 작업 버튼 위치 개선:
    - 드로어 메뉴에서 "내 데이터 삭제" 버튼 제거, "계정 관리" 링크로 대체 (실수 방지)
    - 실제 삭제 버튼은 계정 섹션(#account)에만 존재하도록 변경
  - MutationObserver 동기화 최적화:
    - 무한 루프 방지: `isSyncing` 플래그로 중복 호출 차단
    - observer 옵션 최적화: `childList: false`, `subtree: false`로 불필요한 감지 방지
  - 접근성 개선:
    - 햄버거 버튼에 `aria-controls="drawer"` 추가
    - iOS 스크롤 잠금 개선: `body.drawer-open`에 `position: fixed`, `width: 100%`, `height: 100%` 추가
  - 프로덕션 문구 확인: footer의 개발자용 문구는 이미 `display: none` 처리되어 안전

- **[hub] 계정 관리 보강 및 회원 탈퇴 기능 구현**
  - 계정 관리 UI 보강:
    - 로그인 상태일 때 이메일/표시명 노출 (`authUserEmail`, `authUserName`)
    - 프로덕션 문구 정리: "SSO 설정 필요" → "게스트 모드입니다. 로그인하면 기기 간 이어하기/랭킹 참여가 가능합니다."
    - 내 데이터 삭제 버튼 추가 (허브 계정 섹션 및 드로어 메뉴)
  - 내 데이터 삭제 기능:
    - `shared/auth/deleteUserData.js`: Supabase `game_saves`, `leaderboard` 테이블에서 사용자 데이터 삭제
    - 2단계 confirm 모달로 실수 방지
    - 삭제 성공 시 로컬 저장소 초기화 (`clicksurvivor-*`, `seoulsurvival-*` 키 삭제) 후 로그아웃 및 페이지 새로고침
    - `shared/auth/ui.js`의 `handleDeleteData()` 함수로 통합 처리
  - 단일 소스 원칙: `shared/auth/ui.js`의 `setUI()` 함수가 허브의 헤더/드로어/계정 섹션 UI를 모두 관리

- **[hub] 모바일 가로 스크롤 제거 및 햄버거 메뉴 구현**
  - 가로 overflow 원인 제거:
    - `.topbar`에 `width: 100%`, `max-width: 100%`, `box-sizing: border-box` 추가하여 viewport를 넘지 않도록 수정
    - `.brand`의 `min-width: 200px`를 제거하고 `min-width: 0`, `flex: 0 1 auto`로 변경하여 좁은 화면에서 축소 가능하도록 수정
    - `.brandname`, `.brandtag`에 `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis` 추가하여 텍스트 오버플로우 방지
    - `.hero::before`의 `transform: scale(1.02)`를 `scale(1.01)`로 줄여 약간의 overflow 방지
    - `html`, `body`에 `overflow-x: hidden` 안전장치 추가
  - 모바일 햄버거 메뉴 구현:
    - `max-width: 768px` 브레이크포인트에서 헤더의 `nav`와 `.actions` 숨김, 햄버거 버튼 표시
    - 드로어 메뉴: 우측에서 slide-in/out 애니메이션, overlay 클릭/ESC 키로 닫기, body 스크롤 잠금 처리
    - 드로어 내부: 네비게이션 링크, 언어 선택, 계정 관련 버튼을 세로로 정리
    - 드로어와 헤더의 언어 선택/로그인 버튼 동기화: `hub/main.js`에서 MutationObserver로 상태 동기화, `shared/authBoot.js`에서 드로어 버튼도 처리
    - 접근성: `aria-label`, `aria-expanded`, `aria-hidden` 속성 추가

## 2025-12-18
- **[seoulsurvival] 인앱 브라우저 안내 및 랭킹 로그인 UX 개선**
  - 인앱 브라우저 감지 및 안내 배너 추가:
    - `detectInAppBrowser()`: 카카오톡/인스타그램/페이스북/라인/위챗 등 인앱 브라우저 감지 (`navigator.userAgent` 기반)
    - `showInAppBrowserWarningIfNeeded()`: 인앱 브라우저에서 접속 시 상단에 안내 배너 표시
    - Google 로그인 제한 안내 문구 및 Chrome/Safari 등 기본 브라우저 사용 권장
    - URL 복사 버튼: `navigator.clipboard.writeText()` + `document.execCommand('copy')` fallback으로 주소 복사 기능 제공
    - 확인 버튼: 배너를 닫을 수 있는 기능 추가
  - 랭킹 탭 "내 기록" 비로그인 UX 개선:
    - 비로그인 상태를 `getMyRank()` 호출 전에 `getUser()`로 먼저 확인하여 즉시 로그인 버튼 표시
    - 카드형 레이아웃 제거, 간단한 안내 문구("로그인 후에 내 순위를 볼 수 있습니다.") + Google 로그인 버튼만 표시
    - "내 기록" 문구 중복 제거 (외곽 h3 제목만 유지)
    - 로그인 버튼 클릭 시 설정 탭으로 이동하지 않고 `signInWithOAuth('google')` 직접 호출하여 바로 로그인 실행
    - `forbidden` 에러 타입뿐만 아니라 모든 비로그인 상황에서 일관된 UX 제공

## 2025-12-17
- **[seoulsurvival] 닉네임 입력 모달 안정화**
  - 닉네임 모달 중복 노출 문제 해결:
    - `resolveFinalNickname()`: 로컬 저장에서 닉네임을 동기적으로 확인하는 단일 함수
    - `ensureNicknameModal()`: 닉네임 모달 오픈의 단일 진입점, 세션 플래그(`__nicknameModalShown`)로 중복 방지
    - 초기 부팅 시퀀스를 async IIFE로 감싸서 클라우드 세이브 병합과 닉네임 체크 타이밍 조정
  - 클라우드 세이브 병합 타이밍 개선:
    - `maybeOfferCloudRestore()`를 Promise 반환으로 변경, "불러오기"/"나중에" 선택에 따라 resolve 분기
    - "나중에" 선택 시 즉시 `ensureNicknameModal()` 호출하여 닉네임 모달 표시
    - Promise resolve 가드(`settled` 플래그)로 중복 호출 방지
  - `resetGame()`에서 닉네임 입력 로직 제거, reload 후 `ensureNicknameModal()`이 처리하도록 변경
  - `openConfirmModal()`에 `onCancel` 옵션 추가하여 기존 호출부 호환성 유지
- **[seoulsurvival] 리더보드 시스템 구현**
  - 닉네임 입력 시스템:
    - 게임 새로 시작 시 닉네임 입력 모달 팝업
    - 닉네임은 게임 세이브 데이터에 포함 (`saveData.nickname`)
    - 닉네임은 `game_saves` 테이블의 JSONB 필드에 저장됨 (별도 컬럼 아님)
    - 설정 섹션 계정 영역에 닉네임 표시 추가 (`playerNicknameLabel`)
  - 리더보드 UI:
    - 통계 탭에 "리더보드 (TOP 10)" 섹션 추가
    - 닉네임, 총 자산, 플레이타임 표시
    - 상위 3명은 메달 이모지 (🥇🥈🥉) 표시
  - 리더보드 데이터 관리:
    - `shared/leaderboard.js`: 리더보드 업데이트/조회 함수
    - `supabase/leaderboard.sql`: 리더보드 테이블 및 RLS 정책
    - 리더보드 업데이트: 게임 저장 시 30초마다 자동 업데이트 (닉네임이 있을 때만)
  - 리더보드 조회: (초기) 통계 탭 활성화 시에만 업데이트 → (현재) 전용 랭킹 탭 활성 + 화면 가시성 조건에서만 업데이트
  - 리더보드 로딩 문제 수정:
    - `updateStatsTab()`에서 `updateLeaderboardUI(false)` 호출 제거
    - 통계 탭이 활성화될 때만 리더보드 업데이트 (navBtns 이벤트 리스너에서 처리)
    - 로딩 상태 관리, 타임아웃 처리, 디버깅 로그 추가
  - 디버깅 로그 추가:
    - `saveGame()`: 닉네임 저장 확인 로그
    - `upsertCloudSave()`: 닉네임 포함 여부 확인 로그
    - `updateLeaderboardUI()`: API 호출/응답 로그

- **[seoulsurvival] PC 레이아웃/랭킹 탭 UX 개편**
  - PC에서 노동/투자/통계/랭킹/설정을 5패널 한 줄 멀티 컬럼 레이아웃으로 정렬하고, 각 패널 내부만 세로 스크롤되도록 조정.
  - 리더보드/업적/내 순위 UI를 통계 탭에서 분리해 전용 랭킹 탭(`rankingTab`)으로 이동, 내 닉네임 하이라이트 및 RPC 기반 내 순위 조회 추가.
  - IntersectionObserver 기반으로 랭킹 패널이 실제 화면에 보이는 동안에만 리더보드 폴링 수행(PC), 모바일은 하단 네비 + active 탭 기준 유지.
  - 상단 헤더와 5개 패널의 좌우 폭을 `.app` 컨테이너 기준으로 통일하고, 랭킹 카드의 타이포/섹션 스타일을 다른 탭과 일치시키는 방향으로 정리.

- **[공통/배포] Supabase 키 주입 방식 정리 + 리더보드 키 미설정 UX 개선**
  - `shared/auth/config.js`를 Vite env 기반(`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`)으로 변경하고, 키가 없을 경우 SSO/리더보드가 비활성(게스트 모드)로 동작하도록 정리.
  - Auth UI(`shared/auth/ui.js`)에서 키 미설정 시 "SSO 설정 필요" 대신 "게스트 모드(로그인 준비 중)" 문구를 노출하고, 로그인 시도 토스트도 유저 친화적으로 변경.
  - 리더보드 UI(`seoulsurvival/src/main.js`)는 Supabase 미설정이면 네트워크 호출을 스킵하고 "리더보드 설정이 아직 완료되지 않았어요" 안내만 표시해 무한 로딩을 방지.
  - README의 Supabase 설정 섹션을 `.env.local` 예시(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) 기반으로 업데이트.
  - GitHub Actions 워크플로우(`.github/workflows/deploy.yml`)를 추가/보강해, CI에서 env를 Secrets로 주입하고 `npm run build` 결과(`dist`)를 `gh-pages` 브랜치로 배포하도록 구성 (`permissions.contents: write`, `publish_branch: gh-pages`, `cname: clicksurvivor.com` 설정).
  - GitHub Pages에서 `/seoulsurvival/` 404 문제를 해결하기 위해 Vite 다중 엔트리 구성(`vite.config.js`)을 추가하고, `dist/index.html`(허브) + `dist/seoulsurvival/index.html`(게임) 둘 다 빌드되도록 수정.
  - 랭킹 탭 UI를 "내 기록 카드 + TOP10 순위표(table)" 구조로 개편: `seoulsurvival/src/main.js`의 `updateLeaderboardUI()`에서 div 리스트 렌더링을 `<table class="leaderboard-table">` 기반으로 변경하고, `myRankContent`는 `.my-rank-card` 카드형 레이아웃으로 재구성하여 프리미어리그 스타일의 가독성 높은 순위/내 기록 표시를 제공.
  - 로컬/배포 환경에서 Supabase env 주입 여부를 진단하기 위해 `shared/auth/config.js`에 env/키 길이 로그와 `isSupabaseConfigured()` 상세 로그를 추가했으며, 최종 프로덕션 UI에서는 설정 탭 Supabase 디버그 배지를 제거해 사용자-facing 화면을 정리.
  - 리더보드 TOP10 순위표의 레이아웃을 안정화하기 위해 `.leaderboard-table`에 table-layout: fixed, 컬럼 폭 재조정(.col-rank/.col-assets/.col-playtime) 및 row 구분선을 적용하고, 플레이타임은 `formatPlaytimeMs`/`formatPlaytimeMsShort` 헬퍼로 `43분`, `2h 03m` 같은 축약 포맷으로 표시하도록 개선했으며, 닉네임은 최대 5글자가 항상 잘리지 않도록 5ch 폭을 보장.

## 2025-01-17
- **[hub] 허브 홈페이지 UI/UX 개선**
  - 로고 이미지 적용: `logo.png`를 메인 로고로 사용 (기존 텍스트 "C" 제거)
  - 로그인 UI 개선:
    - 계정 섹션: "준비 중" 문구 제거, 로그인 상태에 따라 동적 UI 표시
    - 헤더 버튼: `authLoginBtn`, `authLogoutBtn` ID로 통일, `shared/authBoot.js`에서 자동 처리
    - Google 로그인 버튼만 유지 (GitHub 제거), 중복 로그인 버튼 제거
  - UI/UX 개선:
    - 버튼 인터랙션: 호버 시 상승 효과, 그림자 효과, 전환 애니메이션 개선
    - 색상/대비: 사용자 칩에 accent 색상 적용, 버튼 호버 상태 개선
    - 간격/여백: CTA 버튼 간격 증가, 섹션 간 여백 증가, 패널 내부 패딩 증가
    - 접근성: 버튼에 명확한 커서 스타일, 전환 애니메이션으로 피드백 제공
  - 푸터 개선:
    - 브랜딩 강화: 로고 이미지와 브랜드 정보 추가
    - 구조화된 레이아웃: 3개 섹션 그리드 (게임, 지원, 법적 고지)
    - 반응형 디자인: 모바일(1열) → 태블릿(2열) → 데스크톱(3열)
    - 시각적 계층 개선: 섹션 제목, 링크 스타일, 구분선 추가
    - 하단 영역 정리: 불필요한 노트 제거, 버전 정보만 중앙 정렬
  - 법적 문서 추가:
    - `terms.html`: 이용약관 페이지 (8개 조항, 간결하고 핵심 내용 중심)
    - `privacy.html`: 개인정보처리방침 페이지 (10개 조항, 개인정보보호법 요구사항 반영)
    - 푸터 링크를 실제 페이지로 연결
- **[seoulsurvival] 게임 설정 UI 개선**
  - 로그인 상태에 따른 버튼 표시/숨김 개선:
    - `shared/auth/ui.js`의 `setUI()` 함수에 컨테이너 표시/숨김 로직 추가
    - 인라인 스타일 `display:flex` 우선순위 문제 해결 (`style.display` 직접 설정)
    - 로그인 시: Google 버튼 숨김, 로그아웃 버튼 표시
    - 로그아웃 시: Google 버튼 표시, 로그아웃 버튼 숨김
  - GitHub 로그인 제거: GitHub 버튼 및 관련 코드 제거
  - 설정 섹션 재구성:
    - 시각 효과/숫자 표시를 최상단으로 이동
    - 저장 관리 영역 통합: 클라우드 저장/불러오기 + 저장 정보 + 저장 내보내기/가져오기
    - 게임 새로 시작 분리: 위험 작업으로 별도 섹션 분리
    - 키보드 단축키 영역 제거
    - 게임 정보를 최하단으로 이동
  - 저장 관리 UI 개선:
    - 설명 개선: 클라우드 저장 기능 명확화, 자동 플러시 동작 설명
    - 비로그인 상태 UI 숨김: 클라우드 관련 UI는 로그인 시에만 표시, 게스트 안내 문구 추가
    - 로컬 저장 내보내기/가져오기 숨김 처리 (`display: none`)
  - 중복 로그인 버튼 제거: "로그인(기본: Google)" 버튼 제거, Google 버튼만 유지
  - 불필요한 설명 문구 제거: "로그인은 허브/모든 게임에서 공통으로 동작하도록 개발 중입니다." 제거
- **[shared/auth] 인증 시스템 개선**
  - `shared/auth/ui.js`: 로그인 상태에 따라 버튼 표시/숨김 로직 통합
  - `seoulsurvival/src/main.js`: 중복 로직 제거, 단순화
  - `await getUser()` 오류 수정: IIFE로 감싸서 async 컨텍스트 문제 해결

## 2025-12-16
- **UI**
  - 노동 탭: 직급(`currentCareer`) 표기를 승진 프로그레스 카드 영역으로 이동(모바일 가려짐 개선)
  - 승진 남은 클릭 수에 천단위 콤마 적용
  - 모바일: 일기장(로그) 높이 약간 축소
  - 설정: “온라인 플레이” → “홈페이지 이동” 문구 변경
  - 통계 탭: 성장 속도/마일스톤/시간당 수익이 2줄로 떨어지는 현상 완화(폰트/nowrap)
  - 허브(루트 `/`)를 “게임 1개 집중” 넷플릭스 톤으로 재구성:
    - 히어로(도트 야경) + 앵커 섹션(`#about`, `#screenshots`, `#account`)
    - CTA는 `플레이`/`자세히` 2개로 단순화
    - KO/EN i18n 추가(`?lang=` + LocalStorage + navigator fallback), 추후 JP/CN 확장 전제
    - 링크/에셋 경로는 Vite `base: './'`에 맞춰 상대 경로 유지
  - 소셜 로그인(SSO) 초기 스캐폴딩 추가(허브/게임 공통):
    - `shared/auth/*` + `shared/authBoot.js`로 허브(`/`)와 게임(`/seoulsurvival/`)에서 동일 로그인 상태 공유 기반 마련
    - Supabase Auth(OAuth) 연결을 전제로 하며, `shared/auth/config.js`에 프로젝트 키 설정 필요
    - MVP: Kakao는 보류, Google(GitHub 옵션)만 우선 연결
  - 클라우드 세이브(MVP) 추가:
    - 게스트는 기존처럼 로컬 저장만 유지
    - 로그인 사용자는 설정 탭에서 “클라우드 저장/불러오기”로 Supabase `game_saves`에 저장
    - 테이블/RLS는 `supabase/game_saves.sql`로 관리
    - 클라우드 자동 플러시: 로그인 상태에서 탭 숨김/닫기 시에만 자동 업로드 (토글 제거, 항상 ON, 120초 디바운스 제거)
- **밸런스**
  - CEO 달성 기준을 누적 10,000 클릭으로 조정(직급 간격 확대)
  - 노동 업그레이드 해금 조건을 직급(careerLevel) 기반으로 재정렬
  - 통계 숫자 포맷: 짧은 숫자 ON에서 소수점 자릿수 고정(깜빡임 감소)
- **도구**
  - `tools/extractUpgrades.mjs`: 업그레이드 표를 자동 추출/정리하는 스크립트 추가
  - `upgrade_report.md`는 생성물이므로 `.gitignore`로 제외
- **문서/운영**
  - `ARCHITECTURE.md`/`BALANCE_NOTES.md`/`DEVLOG.md` 도입으로 세션 컨텍스트 복원 강화
  - `README.md`의 부팅 프롬프트를 “능동형(문서→구현→검증→문서/깃 정리)”으로 확장
  - 서비스 URL 맥락 명시:
    - 허브: `http://clicksurvivor.com/`
    - 게임: `https://clicksurvivor.com/seoulsurvival/`
  - 폴더 구조 정리(옵션 A): `src/`, `assets/` → `seoulsurvival/src/`, `seoulsurvival/assets/` 로 이동(게임 완전 독립)
  - 루트 `index.html`은 더 이상 리다이렉트가 아니라 **허브(준비 중) 페이지**로 변경
  - `tools/extractUpgrades.mjs`는 `seoulsurvival/src/main.js`를 읽도록 경로 수정

## “다음에 재개할 때” 체크리스트
- 새 세션에서는 `ARCHITECTURE.md` → `BALANCE_NOTES.md` → `DEVLOG.md` 순으로 읽고 시작
- 레거시 주의: `seoulsurvival/src/main.js`에 통계 탭 업데이트 로직이 남아 있고 `seoulsurvival/src/ui/statsTab.js`도 존재(호출 경로 확인 필요)

## 버전 기록 룰(간단)
- 배포/공개 전에 버전을 올렸다면, `vX.Y.Z`와 변경 요약(3~8줄)을 DEVLOG에 남긴다.

## 2025-12-22 (허브 홈 SEO 구조 개선)
- **[hub] 루트 허브 페이지 메타/OG 정리**
  - `<title>`을 `ClickSurvivor 허브 | Capital Clicker: Seoul Survival` 형태로 정리해 브랜드+핵심 게임 키워드 포함
  - `<meta name="description">`, `og:title`/`og:description`/`twitter:*`를 허브 역할(여러 게임 허브 + 계정/랭킹 연동) 중심 카피로 통일
  - `canonical`을 `https://clicksurvivor.com/`로 명시하고, `og:url`과 일치시키도록 정렬
  - OG 이미지를 `public/og/clicksurvivor-home-1200x630.png?v=2025-12-21`로 교체하고, `og:image:width`/`og:image:height` 추가
  - `meta name="robots" content="index,follow"`와 `theme-color`를 명시해 기본 인덱싱/브라우저 테마 색상 명확화
- **[hub] 허브용 구조화 데이터(JSON-LD) 추가**
  - `Organization`/`WebSite`/`ItemList` 3개를 하나의 `@graph`로 추가, 허브 도메인/로고/검색 액션(`/games/?q=`)과 대표 게임(Seoul Survival)을 묶어 표현
  - `ItemList` 내 첫 항목으로 `VideoGame`(Capital Clicker: Seoul Survival)을 등록해 허브-게임 관계를 검색엔진에 명시
- **[hub] 허브 홈 시맨틱 H 계층 정리**
  - 히어로 타이틀 `h1`은 유지하고, 섹션 타이틀(`소개/스크린샷/계정`)을 `div` → `h2`로 변경해 H1 1개 + H2 다수 구조로 단순화
  - 기존 클래스/스타일을 그대로 유지하여 레이아웃을 깨지 않고 시맨틱 구조만 개선

### 리더보드 쓰기/읽기 정합성 메모
- **쓰기(Write)**: 게임 진행 중 `saveGame()` 호출 시 `updateLeaderboardEntry()`가 불려, Supabase `leaderboard` 테이블에 `nickname / total_assets / play_time_ms`를 업서트한다.
- **읽기(Read)**: 랭킹 탭의 `updateLeaderboardUI()`는 항상 Supabase 서버에 저장된 값을 기준으로 `getLeaderboard()`/`getMyRank()`를 호출해 Top 10과 내 순위를 표시한다.
- **즉시 최신화가 아닌 이유**: 리더보드 쓰기는 게임 저장 이벤트에 묶여 있고, 읽기는 랭킹 탭이 화면에 보일 때 **매 분(정각 기준) 1회** 폴링 + 네트워크/타임아웃/권한 에러 처리 후 UI를 갱신하기 때문에, 저장 직후 한두 번의 폴링 주기 지연이 있을 수 있다.
- **PC 레이아웃**: 데스크톱에서는 탭 active 여부 대신 IntersectionObserver로 랭킹 영역이 실제로 화면에 보이는 동안에만 폴링을 수행하므로, 숨겨진 상태에서 불필요한 호출은 하지 않는다.
- **요약**: 리더보드는 “최근 저장된 서버 상태”를 보여주며, 저장 빈도/탭 노출/네트워크 상태에 따라 체감상 약간의 지연이 발생할 수 있지만, 무한 로딩 대신 명시적인 에러/갱신 시각 UI로 상태를 노출한다.

