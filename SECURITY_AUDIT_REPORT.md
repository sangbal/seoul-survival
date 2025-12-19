# ClickSurvivor 보안 취약점 분석 보고서

## Executive Summary

본 보고서는 ClickSurvivor 허브 홈페이지 및 게임 전반에 대한 보안 취약점을 분석하고, 무료 범위 내에서 적용 가능한 대안을 제시합니다.

**분석 범위**: 프론트엔드 코드, 인증/인가 시스템, 데이터 저장/전송, Supabase 설정, Edge Functions

**위험도 기준**:
- 🔴 **CRITICAL**: 즉시 수정 필요
- 🟠 **HIGH**: 우선순위 높음
- 🟡 **MEDIUM**: 개선 권장
- 🟢 **LOW**: 모니터링 필요

---

## 1. XSS (Cross-Site Scripting) 취약점

### 1.1 innerHTML 사용으로 인한 XSS 위험

**위험도**: 🟠 HIGH

**위치**:
- `seoulsurvival/src/main.js`: 29개 위치에서 `innerHTML` 사용
- `seoulsurvival/src/ui/domUtils.js`: `innerHTML` 사용

**문제점**:
```javascript
// 예시: seoulsurvival/src/main.js
banner.innerHTML = `...`;
notification.innerHTML = `...`;
container.innerHTML = `...`;
```

사용자 입력이나 외부 데이터가 `innerHTML`에 직접 삽입될 경우 XSS 공격 가능.

**현재 상태**:
- 대부분의 경우 `textContent` 사용 (안전)
- 하지만 `innerHTML` 사용 위치가 다수 존재

**대안 (무료)**:
1. **DOMPurify 라이브러리 사용** (무료, 오픈소스)
   ```bash
   npm install dompurify
   ```
   ```javascript
   import DOMPurify from 'dompurify';
   element.innerHTML = DOMPurify.sanitize(userInput);
   ```

2. **textContent 우선 사용**
   - HTML이 필요 없는 경우 `textContent`로 교체
   - 템플릿 리터럴 내 변수는 이스케이프 처리

3. **템플릿 리터럴 이스케이프 함수 추가**
   ```javascript
   function escapeHtml(text) {
     const div = document.createElement('div');
     div.textContent = text;
     return div.innerHTML;
   }
   ```

**우선순위**: `innerHTML` 사용 위치를 `textContent` 또는 DOMPurify로 교체

**장점**:
- ✅ **XSS 공격 완전 차단**: DOMPurify는 업계 표준 라이브러리로 검증됨
- ✅ **HTML 기능 유지**: `textContent`와 달리 HTML 태그가 필요한 경우에도 안전하게 사용 가능
- ✅ **유지보수 용이**: 한 곳에서 sanitization 로직 관리
- ✅ **성능 영향 최소**: DOMPurify는 경량화되어 있고, 브라우저 네이티브 API 활용
- ✅ **오픈소스/무료**: MIT 라이선스, 활발한 커뮤니티 지원

**단점**:
- ⚠️ **번들 크기 증가**: DOMPurify 추가 시 약 20KB (gzip 기준) 증가
- ⚠️ **코드 수정 범위**: 29개 위치 수정 필요 (시간 소요)
- ⚠️ **HTML 제한**: DOMPurify가 일부 HTML 태그/속성을 제거할 수 있음 (의도된 동작이지만 테스트 필요)
- ⚠️ **의존성 추가**: npm 패키지 관리 필요

**대안 비교**:
- **textContent 사용**: HTML 불필요 시 가장 안전하고 빠름 (번들 크기 증가 없음)
- **DOMPurify 사용**: HTML 필요 시 필수, 번들 크기 증가는 있으나 보안상 필수

---

## 2. 환경 변수 노출

### 2.1 Console.log로 인한 민감 정보 노출

**위험도**: 🟡 MEDIUM

**위치**:
- `shared/auth/config.js`: 환경 변수 길이를 console.log로 출력
- `shared/cloudSave.js`: 닉네임 정보 console.log 출력
- `shared/leaderboard.js`: 다수의 console.log/warn/error

**문제점**:
```javascript
// shared/auth/config.js
console.log('[env] VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL);
console.log('[env] VITE_SUPABASE_ANON_KEY length:', (env.VITE_SUPABASE_ANON_KEY || '').length);
```

프로덕션 환경에서 브라우저 콘솔에 민감 정보가 노출될 수 있음.

**대안 (무료)**:
1. **환경 변수 체크를 프로덕션에서 비활성화**
   ```javascript
   // shared/auth/config.js
   if (import.meta.env.DEV) {
     console.log('[env] VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL);
     console.log('[env] VITE_SUPABASE_ANON_KEY length:', (env.VITE_SUPABASE_ANON_KEY || '').length);
   }
   ```

2. **Vite 빌드 시 console 제거**
   ```javascript
   // vite.config.js
   export default defineConfig({
     build: {
       minify: 'terser',
       terserOptions: {
         compress: {
           drop_console: true, // 프로덕션에서 console 제거
         },
       },
     },
   });
   ```

3. **에러 로깅만 유지, 디버그 로그 제거**
   - `console.log` → 제거 또는 조건부 실행
   - `console.error` → 유지 (에러 추적 필요)

**우선순위**: 프로덕션 빌드에서 console.log 제거

**장점**:
- ✅ **정보 노출 방지**: 민감 정보가 브라우저 콘솔에 노출되지 않음
- ✅ **번들 크기 감소**: console.log 제거로 약 1-2KB 감소 (미미하지만 누적 효과)
- ✅ **성능 향상**: console.log 호출 오버헤드 제거
- ✅ **자동화**: Vite 빌드 설정으로 한 번 설정하면 자동 적용
- ✅ **개발 환경 유지**: `import.meta.env.DEV` 체크로 개발 시에는 로그 유지 가능

**단점**:
- ⚠️ **프로덕션 디버깅 어려움**: 프로덕션에서 문제 발생 시 로그 확인 불가
- ⚠️ **에러 추적 제한**: `console.error`도 제거되면 에러 정보 손실 (조건부 제거 필요)
- ⚠️ **설정 복잡도**: 개발/프로덕션 환경별 분기 처리 필요
- ⚠️ **사용자 지원 어려움**: 사용자가 콘솔 로그를 제공할 수 없음

**권장 접근**:
- `console.log`/`console.warn` → 프로덕션에서 제거
- `console.error` → 유지 (에러 추적 필요)
- 또는 에러 로깅 서비스(Sentry 등) 연동 고려

---

## 3. CORS 설정 과도하게 개방

### 3.1 Edge Function CORS 정책

**위험도**: 🟡 MEDIUM

**위치**:
- `supabase/functions/delete-account/index.ts`

**문제점**:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

`Access-Control-Allow-Origin: *`는 모든 도메인에서 접근을 허용함.

**대안 (무료)**:
1. **특정 도메인만 허용**
   ```typescript
   const allowedOrigins = [
     'https://clicksurvivor.com',
     'https://sangbal.github.io',
     'http://localhost:5173', // 개발 환경
   ];
   
   const origin = req.headers.get('Origin');
   const corsHeaders = {
     'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
     'Access-Control-Allow-Methods': 'POST, OPTIONS',
     'Access-Control-Allow-Credentials': 'true',
   };
   ```

2. **환경 변수로 허용 도메인 관리**
   ```typescript
   const allowedOrigins = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || [];
   ```

**우선순위**: 프로덕션 환경에서 특정 도메인만 허용하도록 수정

**장점**:
- ✅ **공격 표면 축소**: 허용된 도메인에서만 API 호출 가능
- ✅ **무료 구현**: 코드 수정만으로 가능, 추가 비용 없음
- ✅ **유연한 관리**: 환경 변수로 허용 도메인 관리 가능
- ✅ **개발 환경 지원**: localhost 포함하여 개발 편의성 유지
- ✅ **보안 강화**: 악의적 사이트에서의 API 호출 차단

**단점**:
- ⚠️ **도메인 관리 필요**: 새 도메인 추가 시 코드 수정 필요
- ⚠️ **서브도메인 처리**: `*.clicksurvivor.com` 같은 와일드카드 지원 제한적
- ⚠️ **Origin 헤더 의존**: 클라이언트가 Origin 헤더를 조작할 수 있음 (추가 검증 필요)
- ⚠️ **CORS 프리플라이트**: OPTIONS 요청 처리 필요 (성능 영향 미미)
- ⚠️ **테스트 복잡도**: 여러 도메인에서 테스트 시 설정 필요

**개선 방안**:
- Origin 헤더 검증 + Referer 헤더 이중 검증 (더 안전하지만 완벽하지 않음)
- Supabase RLS 정책과 결합하여 다층 방어

---

## 4. 입력 검증 부족

### 4.1 닉네임 검증 제한적

**위험도**: 🟡 MEDIUM

**위치**:
- `seoulsurvival/src/main.js`: 닉네임 검증 로직
- `shared/leaderboard.js`: `normalizeNickname` 함수

**현재 검증**:
- 길이: 1~5자
- 공백 불가
- `%`, `_` 불가

**문제점**:
- HTML 특수문자(`<`, `>`, `&`, `"`, `'`) 검증 없음
- SQL Injection은 Supabase가 방어하지만, XSS 위험은 여전히 존재
- 이모지/유니코드 제어 문자 검증 없음

**대안 (무료)**:
1. **정규식으로 허용 문자만 허용**
   ```javascript
   // 한글, 영문, 숫자만 허용
   const nicknameRegex = /^[가-힣a-zA-Z0-9]{1,5}$/;
   if (!nicknameRegex.test(raw)) {
     openInfoModal('닉네임 형식 오류', '닉네임은 한글, 영문, 숫자만 사용 가능합니다 (1~5자).', '⚠️');
     return;
   }
   ```

2. **서버 사이드 검증 추가** (Supabase RLS 또는 Edge Function)
   - 클라이언트 검증은 우회 가능하므로 서버 검증 필수

3. **HTML 이스케이프 처리**
   ```javascript
   // 리더보드 표시 시
   nickTd.textContent = entry.nickname || '익명'; // 이미 textContent 사용 중 (안전)
   ```

**우선순위**: 닉네임 검증 정규식 강화

**장점**:
- ✅ **XSS 방어**: HTML 특수문자 차단으로 XSS 공격 예방
- ✅ **데이터 무결성**: 허용된 문자만 저장되어 일관성 유지
- ✅ **무료 구현**: 정규식만으로 가능, 추가 비용 없음
- ✅ **성능 영향 없음**: 클라이언트 사이드 검증은 즉시 피드백 제공
- ✅ **사용자 경험**: 잘못된 입력을 즉시 알림

**단점**:
- ⚠️ **이모지 제한**: 한글/영문/숫자만 허용 시 이모지 사용 불가 (의도된 제한일 수 있음)
- ⚠️ **유니코드 복잡도**: 한글 범위(`가-힣`)가 모든 한글을 포함하지 않을 수 있음 (예: 자모 분리된 한글)
- ⚠️ **클라이언트 우회 가능**: 브라우저 개발자 도구로 검증 우회 가능 (서버 검증 필수)
- ⚠️ **정규식 유지보수**: 복잡한 정규식은 가독성 저하
- ⚠️ **국제화 제한**: 향후 다국어 지원 시 정규식 수정 필요

**권장 접근**:
- 클라이언트 검증: 빠른 피드백 제공
- 서버 검증: 필수 (Database Function 또는 Edge Function)

---

## 5. Rate Limiting 부재

### 5.1 API 호출 제한 없음

**위험도**: 🟠 HIGH

**문제점**:
- 리더보드 업데이트, 클라우드 저장, 계정 삭제 등에 Rate Limiting 없음
- DDoS 공격 또는 악의적 사용자에 취약

**대안 (무료)**:
1. **Supabase Edge Function에 Rate Limiting 추가**
   ```typescript
   // supabase/functions/delete-account/index.ts
   const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
   
   function checkRateLimit(userId: string): boolean {
     const now = Date.now();
     const limit = rateLimitMap.get(userId);
     
     if (!limit || now > limit.resetAt) {
       rateLimitMap.set(userId, { count: 1, resetAt: now + 60000 }); // 1분
       return true;
     }
     
     if (limit.count >= 5) { // 1분에 5회 제한
       return false;
     }
     
     limit.count++;
     return true;
   }
   ```

2. **클라이언트 사이드 디바운싱**
   ```javascript
   // shared/leaderboard.js
   let lastUpdate = 0;
   const UPDATE_INTERVAL = 10000; // 10초
   
   export async function updateLeaderboard(...) {
     const now = Date.now();
     if (now - lastUpdate < UPDATE_INTERVAL) {
       return { success: false, error: 'Too frequent updates' };
     }
     lastUpdate = now;
     // ... 기존 로직
   }
   ```

3. **Supabase Database Functions로 Rate Limiting**
   - PostgreSQL의 `pg_stat_statements` 활용 (Supabase 무료 플랜 지원)

**우선순위**: Edge Function에 Rate Limiting 추가

**장점**:
- ✅ **DDoS 방어**: 과도한 요청으로 인한 서버 부하 방지
- ✅ **비용 절감**: Supabase 무료 플랜의 API 호출 제한 보호
- ✅ **공정한 사용**: 악의적 사용자의 남용 차단
- ✅ **무료 구현**: 메모리 기반 Rate Limiting은 추가 비용 없음
- ✅ **즉시 적용**: Edge Function 수정만으로 가능

**단점**:
- ⚠️ **메모리 기반 제한**: Edge Function 재시작 시 카운터 초기화 (분산 환경에서 불완전)
- ⚠️ **정확도 제한**: 여러 Edge Function 인스턴스 간 동기화 없음
- ⚠️ **메모리 누수 위험**: Map 객체가 계속 증가할 수 있음 (정기적 정리 필요)
- ⚠️ **정상 사용자 영향**: 짧은 시간에 여러 요청하는 정상 사용자도 차단될 수 있음
- ⚠️ **IP 기반 우회**: VPN/프록시로 IP 변경하여 우회 가능

**개선 방안**:
- **Supabase Database 기반 Rate Limiting**: PostgreSQL 테이블 사용 (영구 저장, 정확도 높음)
- **Redis 사용**: 분산 환경에서 정확한 Rate Limiting (Supabase 무료 플랜에는 없음, 외부 서비스 필요)
- **클라이언트 디바운싱**: 추가 방어층 (우회 가능하지만 정상 사용자 경험 개선)

**권장 구현**:
1. Edge Function 메모리 기반 (즉시 적용 가능)
2. Database 기반 (더 정확하지만 쿼리 오버헤드)
3. 클라이언트 디바운싱 (사용자 경험 개선)

---

## 6. 인증 토큰 관리

### 6.1 토큰 저장 방식

**위험도**: 🟢 LOW

**현재 상태**:
- Supabase가 자동으로 토큰 관리 (localStorage 사용)
- `AUTH_STORAGE_KEY = 'clicksurvivor-auth'`로 고정

**개선 사항**:
1. **토큰 만료 시간 확인**
   - Supabase가 자동 갱신하지만, 명시적 체크 추가 권장

2. **로그아웃 시 토큰 완전 삭제 확인**
   ```javascript
   // shared/auth/core.js
   export async function signOut() {
     const sb = client();
     if (!sb) return { ok: false, reason: 'not_configured' };
     const { error } = await sb.auth.signOut();
     // localStorage에서도 명시적 삭제
     try {
       localStorage.removeItem(AUTH_STORAGE_KEY);
     } catch (e) {
       console.warn('Failed to remove auth token:', e);
     }
     return { ok: !error, error };
   }
   ```

**우선순위**: 낮음 (Supabase가 이미 잘 관리함)

---

## 7. SQL Injection 방어

### 7.1 Supabase 사용으로 대부분 방어됨

**위험도**: 🟢 LOW

**현재 상태**:
- Supabase Client가 파라미터화된 쿼리 사용
- 직접 SQL 문자열 조합 없음

**확인 사항**:
- 모든 쿼리가 Supabase Client 메서드 사용 (`from()`, `select()`, `eq()` 등)
- RLS (Row Level Security) 정책으로 추가 보호

**우선순위**: 낮음 (이미 안전)

---

## 8. CSRF (Cross-Site Request Forgery) 방어

### 8.1 토큰 기반 인증 사용

**위험도**: 🟢 LOW

**현재 상태**:
- Supabase가 JWT 토큰 기반 인증 사용
- `Authorization: Bearer <token>` 헤더 사용

**개선 사항**:
1. **SameSite 쿠키 설정** (Supabase가 관리하지만 확인)
2. **Origin 검증** (Edge Function에서 이미 구현 가능)

**우선순위**: 낮음 (현재 구조로 충분)

---

## 9. 에러 메시지 정보 노출

### 9.1 과도한 에러 정보

**위험도**: 🟡 MEDIUM

**위치**:
- `shared/leaderboard.js`: 상세한 에러 메시지
- `shared/cloudSave.js`: 에러 상세 정보

**문제점**:
```javascript
// shared/leaderboard.js
return {
  success: false,
  error: '리더보드 테이블이 없습니다. Supabase SQL Editor에서 supabase/leaderboard.sql을 실행해주세요.',
  // ...
};
```

에러 메시지가 내부 구조를 노출할 수 있음.

**대안 (무료)**:
1. **프로덕션에서 일반화된 메시지 사용**
   ```javascript
   const isDev = import.meta.env.DEV;
   return {
     success: false,
     error: isDev 
       ? '리더보드 테이블이 없습니다. Supabase SQL Editor에서 supabase/leaderboard.sql을 실행해주세요.'
       : '리더보드를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.',
   };
   ```

2. **에러 코드 사용**
   ```javascript
   return {
     success: false,
     errorCode: 'LEADERBOARD_TABLE_MISSING',
     error: isDev ? detailedMessage : '일시적인 오류가 발생했습니다.',
   };
   ```

**우선순위**: 프로덕션 에러 메시지 일반화

**장점**:
- ✅ **정보 노출 방지**: 내부 구조, 파일 경로, 기술 스택 정보 숨김
- ✅ **공격자 혼란**: 상세한 에러 정보로 인한 공격 시도 방지
- ✅ **사용자 경험**: 기술적 용어 대신 사용자 친화적 메시지
- ✅ **무료 구현**: 코드 수정만으로 가능
- ✅ **조건부 처리**: 개발 환경에서는 상세 정보 유지 가능

**단점**:
- ⚠️ **디버깅 어려움**: 프로덕션에서 문제 발생 시 원인 파악 어려움
- ⚠️ **사용자 지원 제한**: 사용자가 제공하는 에러 정보가 부족
- ⚠️ **에러 코드 관리**: 에러 코드 체계 구축 필요
- ⚠️ **로깅 시스템 필요**: 서버 사이드 로깅으로 상세 정보 보관 필요 (추가 비용 가능)
- ⚠️ **일반화 기준**: 어느 정도까지 일반화할지 판단 필요

**권장 접근**:
- **프로덕션**: 일반화된 메시지 + 에러 코드
- **개발 환경**: 상세 메시지 유지
- **서버 로깅**: 상세 에러 정보는 서버 로그에만 기록 (Supabase Logs 활용)

---

## 10. 클라이언트 사이드 검증만 존재

### 10.1 서버 사이드 검증 부족

**위험도**: 🟠 HIGH

**문제점**:
- 닉네임 검증이 클라이언트에서만 수행
- 게임 저장 데이터 검증 없음
- 악의적 사용자가 클라이언트 코드를 우회 가능

**대안 (무료)**:
1. **Supabase Database Functions로 검증**
   ```sql
   -- supabase/leaderboard.sql에 추가
   CREATE OR REPLACE FUNCTION validate_nickname(nick text)
   RETURNS boolean
   LANGUAGE plpgsql
   AS $$
   BEGIN
     -- 길이 검증
     IF length(trim(nick)) < 1 OR length(trim(nick)) > 5 THEN
       RETURN false;
     END IF;
     
     -- 허용 문자만 (한글, 영문, 숫자)
     IF NOT (nick ~ '^[가-힣a-zA-Z0-9]+$') THEN
       RETURN false;
     END IF;
     
     RETURN true;
   END;
   $$;
   
   -- Trigger로 자동 검증
   CREATE OR REPLACE FUNCTION check_nickname_before_insert()
   RETURNS trigger
   LANGUAGE plpgsql
   AS $$
   BEGIN
     IF NOT validate_nickname(NEW.nickname) THEN
       RAISE EXCEPTION 'Invalid nickname format';
     END IF;
     RETURN NEW;
   END;
   $$;
   
   CREATE TRIGGER trg_validate_nickname
   BEFORE INSERT OR UPDATE ON public.leaderboard
   FOR EACH ROW
   EXECUTE FUNCTION check_nickname_before_insert();
   ```

2. **Edge Function에서 검증**
   - 계정 삭제, 데이터 삭제 등 중요 작업에 검증 추가

**우선순위**: 서버 사이드 검증 추가

**장점**:
- ✅ **우회 불가능**: 클라이언트 코드 수정으로 우회 불가
- ✅ **데이터 무결성 보장**: 데이터베이스 레벨에서 검증하여 잘못된 데이터 저장 방지
- ✅ **중앙 집중 관리**: 검증 로직이 한 곳에 있어 유지보수 용이
- ✅ **무료 구현**: Supabase Database Functions는 무료 플랜에서 사용 가능
- ✅ **자동 적용**: Trigger로 모든 INSERT/UPDATE에 자동 적용

**단점**:
- ⚠️ **개발 복잡도 증가**: SQL 함수 작성 및 테스트 필요
- ⚠️ **에러 메시지 제한**: Database Function에서 반환하는 에러 메시지가 클라이언트에 전달됨
- ⚠️ **성능 영향**: 각 INSERT/UPDATE마다 함수 실행 (미미하지만 누적)
- ⚠️ **디버깅 어려움**: Database Function 디버깅은 SQL 에디터에서만 가능
- ⚠️ **버전 관리**: SQL 파일로 관리하지만 마이그레이션 필요

**대안 비교**:
- **Database Function + Trigger**: 가장 안전하지만 복잡도 높음
- **Edge Function 검증**: 더 유연하지만 모든 요청 경로에 적용 필요
- **RLS Policy**: Supabase RLS로 일부 검증 가능 (제한적)

**권장 접근**:
- 중요 데이터(닉네임 등): Database Function + Trigger
- 일반 데이터: Edge Function 검증
- 다층 방어: 클라이언트 + 서버 검증 모두 적용

---

## 11. Content Security Policy (CSP) 부재

### 11.1 XSS 방어 헤더 없음

**위험도**: 🟡 MEDIUM

**문제점**:
- HTML에 CSP 헤더 설정 없음
- 인라인 스크립트 사용 (Google Analytics)

**대안 (무료)**:
1. **HTML에 CSP 메타 태그 추가**
   ```html
   <!-- index.html, seoulsurvival/index.html -->
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; 
                  style-src 'self' 'unsafe-inline'; 
                  img-src 'self' data: https:; 
                  connect-src 'self' https://*.supabase.co https://www.google-analytics.com;">
   ```

2. **서버에서 CSP 헤더 설정** (GitHub Pages는 제한적)
   - Cloudflare Pages 사용 시 헤더 설정 가능 (무료)

**우선순위**: CSP 메타 태그 추가

**장점**:
- ✅ **XSS 방어 강화**: 브라우저 레벨에서 스크립트 실행 차단
- ✅ **인라인 스크립트 제어**: `unsafe-inline` 제한으로 XSS 공격 방지
- ✅ **외부 리소스 제어**: 허용된 도메인에서만 리소스 로드
- ✅ **무료 구현**: HTML 메타 태그만 추가하면 됨
- ✅ **즉시 적용**: 코드 배포만으로 적용

**단점**:
- ⚠️ **설정 복잡도**: Google Analytics 등 외부 스크립트 허용 설정 필요
- ⚠️ **호환성 문제**: 엄격한 CSP는 일부 라이브러리와 충돌 가능
- ⚠️ **디버깅 어려움**: CSP 위반 시 콘솔에만 로그, 원인 파악 어려움
- ⚠️ **점진적 적용 필요**: 한 번에 엄격한 정책 적용 시 기능 깨짐 가능
- ⚠️ **메타 태그 제한**: HTTP 헤더보다 덜 강력함 (GitHub Pages 제한)

**개선 방안**:
- **Report-Only 모드**: 먼저 Report-Only로 적용하여 위반 사항 확인
- **점진적 강화**: 느슨한 정책부터 시작하여 점진적으로 강화
- **서버 헤더**: 가능하면 HTTP 헤더로 설정 (Cloudflare Pages 등)

**권장 접근**:
1. Report-Only 모드로 시작
2. 위반 사항 수정
3. Enforce 모드로 전환

---

## 12. 의존성 취약점

### 12.1 npm 패키지 보안

**위험도**: 🟡 MEDIUM

**대안 (무료)**:
1. **npm audit 실행**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Dependabot 활성화** (GitHub 무료)
   - `.github/dependabot.yml` 생성

3. **정기적 업데이트**
   - Supabase Client: 최신 버전 확인
   - Vite: 최신 버전 확인

**우선순위**: npm audit 실행 및 취약점 수정

**장점**:
- ✅ **알려진 취약점 제거**: npm audit으로 발견된 취약점 수정
- ✅ **자동화**: Dependabot으로 자동 알림 및 PR 생성
- ✅ **무료 도구**: npm audit, Dependabot 모두 무료
- ✅ **지속적 관리**: 정기적 체크로 새로운 취약점 조기 발견
- ✅ **의존성 최신화**: 보안 패치 자동 적용

**단점**:
- ⚠️ **업데이트 리스크**: 패키지 업데이트 시 호환성 문제 가능
- ⚠️ **테스트 필요**: 업데이트 후 전체 기능 테스트 필요
- ⚠️ **Breaking Changes**: Major 버전 업데이트 시 API 변경 가능
- ⚠️ **의존성 충돌**: 여러 패키지 간 버전 충돌 가능
- ⚠️ **시간 소요**: 취약점 수정 및 테스트에 시간 필요

**권장 접근**:
- **정기적 실행**: 월 1회 npm audit 실행
- **Dependabot 활성화**: 자동 알림으로 즉시 대응
- **단계적 업데이트**: 한 번에 하나씩 업데이트하여 문제 격리
- **테스트 자동화**: CI/CD에서 자동 테스트로 회귀 방지

---

**우선순위**: npm audit 실행 및 취약점 수정

**장점**:
- ✅ **알려진 취약점 제거**: npm audit으로 발견된 취약점 수정
- ✅ **자동화**: Dependabot으로 자동 알림 및 PR 생성
- ✅ **무료 도구**: npm audit, Dependabot 모두 무료
- ✅ **지속적 관리**: 정기적 체크로 새로운 취약점 조기 발견
- ✅ **의존성 최신화**: 보안 패치 자동 적용

**단점**:
- ⚠️ **업데이트 리스크**: 패키지 업데이트 시 호환성 문제 가능
- ⚠️ **테스트 필요**: 업데이트 후 전체 기능 테스트 필요
- ⚠️ **Breaking Changes**: Major 버전 업데이트 시 API 변경 가능
- ⚠️ **의존성 충돌**: 여러 패키지 간 버전 충돌 가능
- ⚠️ **시간 소요**: 취약점 수정 및 테스트에 시간 필요

**권장 접근**:
- **정기적 실행**: 월 1회 npm audit 실행
- **Dependabot 활성화**: 자동 알림으로 즉시 대응
- **단계적 업데이트**: 한 번에 하나씩 업데이트하여 문제 격리
- **테스트 자동화**: CI/CD에서 자동 테스트로 회귀 방지

---

### 즉시 수정 (CRITICAL/HIGH)
1. ✅ **XSS 방어**: `innerHTML` → `textContent` 또는 DOMPurify
2. ✅ **Rate Limiting**: Edge Function에 추가
3. ✅ **서버 사이드 검증**: 닉네임 검증을 Database Function으로 추가

### 우선 개선 (MEDIUM)
4. ✅ **CORS 정책**: 특정 도메인만 허용
5. ✅ **에러 메시지**: 프로덕션에서 일반화
6. ✅ **CSP 헤더**: 메타 태그 추가
7. ✅ **Console.log 제거**: 프로덕션 빌드에서 제거

### 모니터링 (LOW)
8. ✅ **의존성 취약점**: npm audit 정기 실행
9. ✅ **토큰 관리**: 현재 상태 유지 (Supabase가 잘 관리)

---

## 구현 우선순위 체크리스트

- [ ] 1. DOMPurify 설치 및 `innerHTML` 사용 위치 교체
- [ ] 2. Edge Function Rate Limiting 추가
- [ ] 3. 닉네임 검증 Database Function 추가
- [ ] 4. CORS 정책 수정 (특정 도메인만 허용)
- [ ] 5. 프로덕션 에러 메시지 일반화
- [ ] 6. CSP 메타 태그 추가
- [ ] 7. Vite 빌드 설정에서 console.log 제거
- [ ] 8. npm audit 실행 및 취약점 수정

---

## 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**보고서 작성일**: 2024년
**분석 대상 버전**: v1.0.0
**다음 재검토 권장일**: 주요 변경 사항 후 또는 6개월 후

