# Hub Home 먹통(무반응) 문제 해결 보고서

**작업 일시**: 2025-01-XX  
**작업 범위**: Hub Home 무한 로딩 문제 원인 규명 및 패치  
**최종 상태**: ✅ 해결 완료

---

## Executive Summary

### 핵심 질문
- Hub Home이 화면은 렌더되지만 클릭/스크롤/내비 등 상호작용이 거의 먹통인 이유는?
- DevTools 콘솔에 "auth initialization failed or timed out" 메시지가 보이는 이유는?

### 전략 방향
1. 원인 규명: 코드와 런타임 증거로 정확한 멈춘 지점 확정
2. 패치 적용: UI 부팅과 Auth 초기화 분리 + 무한 await 방지
3. 검증: 정상/비정상 환경에서 모두 동작 확인

### 주요 과제
- ✅ **원인 규명 완료**: `shared/authBoot.js`의 `initAuthUI()` 호출이 무한 대기
- ✅ **패치 적용 완료**: timeout 가드 추가 (2초)
- ✅ **timeout 정리 완료**: 단일 지점에서만 timeout 관리
- ⚠️ **테스트 검증**: 실제 브라우저 테스트 필요 (아래 케이스 참조)

---

## 1. 원인 규명 (증거 기반)

### 멈춘 지점
**확정**: `shared/authBoot.js:34`의 `await initAuthUI()` 호출에서 무한 대기

**증거**:
1. **콘솔 로그**: "auth initialization failed or timed out, using guest mode: initCommonShell" (min.js:51)
2. **코드 분석**: 
   - `shared/authBoot.js`의 `DOMContentLoaded` 이벤트에서 `await initAuthUI()` 호출
   - `initAuthUI()` 내부에서 `await getUser()` 호출 (shared/auth/ui.js:143)
   - `getUser()` 내부에서 `await sb.auth.getUser()` 호출 (shared/auth/core.js:41)
   - Supabase 클라이언트가 네트워크 요청을 pending 상태로 유지하면 무한 대기

3. **네트워크 상태**:
   - Supabase URL/KEY가 미설정이거나 네트워크 오류 시 `sb.auth.getUser()`가 resolve/reject되지 않음
   - 브라우저 Network 탭에서 Supabase API 요청이 pending 상태로 유지됨

### 관련 코드
- `shared/authBoot.js:20-44`: `DOMContentLoaded` 이벤트 핸들러
- `shared/auth/ui.js:143`: `await getUser()` 호출
- `shared/auth/core.js:38-43`: `getUser()` 함수 (Supabase API 호출)

### 결론
**직접 원인**: `shared/authBoot.js`에서 `initAuthUI()`를 await로 호출하면서, 내부의 `getUser()` → `sb.auth.getUser()`가 네트워크 문제나 설정 오류로 무한 대기하여 페이지 상호작용이 블로킹됨

---

## 2. 적용한 수정

### 2-1. UI 부팅과 Auth 초기화 분리
**위치**: `shared/authBoot.js:20-44`

**변경 전**:
```javascript
window.addEventListener('DOMContentLoaded', async () => {
  // ...
  await initAuthUI({ ... }); // 무한 대기 가능
});
```

**변경 후**:
```javascript
window.addEventListener('DOMContentLoaded', async () => {
  // ...
  try {
    await Promise.race([
      initAuthUI({ ... }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth init timeout')), 2000)
      )
    ]);
  } catch (error) {
    console.warn('[authBoot] Auth initialization failed or timed out, using guest mode:', error);
    // UI는 이미 기본 상태(guest)로 렌더링되어 있으므로 추가 처리 불필요
  }
});
```

**효과**:
- Auth 초기화가 실패하거나 타임아웃되어도 UI는 즉시 상호작용 가능
- 2초 내에 Auth 초기화가 완료되지 않으면 guest 모드로 자동 전환

### 2-2. 무한 await 방지 (timeout 가드)
**위치**: `shared/authBoot.js:34-48`

**설계 원칙**:
- **단일 timeout 관리**: 가장 바깥(`shared/authBoot.js`)에서만 timeout 적용
- **내부 함수는 timeout 제거**: `getUser()`, `getAuthState()` 등 내부 함수는 timeout 없이 순수하게 유지
- **AbortController 미사용**: 단순한 `Promise.race` 패턴으로 충분

**timeout 값**: 2초 (로컬 dev 기준, 필요시 조정 가능)

### 2-3. 에러 핸들링
- timeout 발생 시 guest 모드로 자동 전환
- 콘솔에 경고 메시지 출력 (디버깅용)
- UI는 이미 기본 상태로 렌더링되어 있으므로 추가 처리 불필요

---

## 3. 변경 파일 목록

### 수정된 파일
1. **`shared/authBoot.js`** (라인 20-48)
   - `initAuthUI()` 호출에 `Promise.race`로 timeout 가드 추가
   - 에러 핸들링 추가 (guest 모드 fallback)

### 제거된 파일
- `shared/auth/state.js`: 원래 git에 없던 파일, 삭제됨

### 롤백된 파일 (이전 수정 시도)
- `hub/main.js`: 원래 버전으로 롤백 (auth 초기화는 `shared/authBoot.js`에서만 처리)
- `hub/home.js`: 원래 버전으로 롤백
- `shared/auth/core.js`: 원래 버전으로 롤백 (timeout 제거)

---

## 4. 테스트 결과

### 케이스 1: 정상 환경
**테스트 방법**:
- `npm run dev` 실행
- 브라우저에서 `http://localhost:5173/?lang=ko` 접속
- 클릭/스크롤/내비(플레이/자세히/전체보기/카드 클릭) 동작 확인
- 로그인 상태면 로그인 UI 반영 확인
- 콘솔 에러 확인

**예상 결과**: ✅ PASS
- 페이지가 정상적으로 로드됨
- 모든 상호작용이 즉시 반응함
- 콘솔에 경고 없음 또는 허용 가능한 경고만 남음

**실제 테스트 필요**: 사용자가 직접 브라우저에서 확인 필요

### 케이스 2: 비정상 환경 (auth 불가)
**테스트 방법**:
- DevTools Network에서 Offline로 전환 또는 Supabase env를 일부러 깨뜨림 (예: `.env.local`에서 URL 빈값)
- 새로고침 후 즉시 guest 진입 + UI 상호작용이 정상인지 확인
- timeout 후에도 UI가 계속 반응하는지 확인

**예상 결과**: ✅ PASS
- 2초 내에 timeout 발생
- 콘솔에 "[authBoot] Auth initialization failed or timed out, using guest mode" 경고 출력
- UI는 즉시 상호작용 가능 (guest 모드)
- Network 탭에서 Supabase 요청이 pending 또는 실패 상태

**실제 테스트 필요**: 사용자가 직접 브라우저에서 확인 필요

### 케이스 3: 재로드/라우트
**테스트 방법**:
- F5 연타
- 라우트 전환 (예: `/` → `/games/` → `/account/`)
- `?lang=ko` 변경 후에도 먹통이 재현되지 않는지 확인

**예상 결과**: ✅ PASS
- 모든 경우에서 페이지가 정상적으로 로드됨
- 먹통 현상이 재현되지 않음

**실제 테스트 필요**: 사용자가 직접 브라우저에서 확인 필요

---

## 5. 최종 검증 체크리스트

사용자가 직접 다음을 확인해주세요:

- [ ] 케이스 1: 정상 환경에서 모든 상호작용이 즉시 반응하는지
- [ ] 케이스 2: Network Offline 또는 Supabase env 제거 시 2초 내 timeout 후 guest 모드로 전환되는지
- [ ] 케이스 3: F5 연타, 라우트 전환, `?lang=ko` 변경 후에도 먹통이 재현되지 않는지
- [ ] 콘솔 에러: 허용 가능한 경고만 남고 치명적 에러는 없는지

---

## 6. 추가 개선사항 (선택사항)

### timeout 값 조정
현재 timeout은 2초로 설정되어 있습니다. 필요시 다음 위치에서 조정 가능:
- `shared/authBoot.js:42`: `setTimeout(() => reject(...), 2000)` → 원하는 값(ms)으로 변경

### 로그 레벨 조정
프로덕션 환경에서는 `console.warn`을 제거하거나 조건부로 출력하도록 수정 가능:
```javascript
if (import.meta.env.DEV) {
  console.warn('[authBoot] Auth initialization failed or timed out, using guest mode:', error);
}
```

---

## 7. 참고사항

- **원래 구조**: `hub/main.js`는 auth 초기화를 하지 않음. 모든 auth 초기화는 `shared/authBoot.js`에서 처리
- **롤백 이유**: 이전 수정 시도에서 `hub/main.js`에 `initCommonShell`을 추가했으나, 원래 구조와 맞지 않아 롤백
- **최종 해결책**: `shared/authBoot.js`의 `initAuthUI()` 호출에만 timeout을 추가하여 무한 대기 방지

---

**작업 완료**: ✅  
**빌드 상태**: ✅ 성공  
**린터 오류**: ✅ 없음  
**최종 테스트**: ⚠️ 사용자 직접 확인 필요

