// Social login (SSO) config
// - Supabase URL / anon key는 Vite 환경 변수(VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)를 통해 주입한다.
// - 개발/배포 환경 모두에서 .env(.local) 또는 CI secrets를 통해 값을 설정해야 한다.
// - 빌드 되지 않은 정적 ESM 배포에서는 import.meta.env가 비어 있을 수 있으므로,
//   이 파일은 기본적으로 "빈 설정"을 표현하고, isSupabaseConfigured()로 사용 가능 여부를 판별한다.
//
// Vite dev / build 환경에서는 import.meta.env에 값이 주입된다.
// 정적 ESM 환경(직접 호스팅)에서는 env가 비어 있어 SSO/리더보드가 비활성(게스트 모드)로 동작한다.

// 모듈 로드 시 블로킹 방지: 모든 코드를 함수 내부로 이동
let _env = null;
let _configLogged = false;

function getEnv() {
  if (_env === null) {
    _env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  }
  return _env;
}

function logConfigOnce() {
  if (_configLogged) return;
  _configLogged = true;
  try {
    const env = getEnv();
    console.log('[env] VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL);
    console.log(
      '[env] VITE_SUPABASE_ANON_KEY length:',
      (env.VITE_SUPABASE_ANON_KEY || '').length
    );
  } catch {}
}

// Share auth state across hub + all subpath games on the same origin.
export const AUTH_STORAGE_KEY = 'clicksurvivor-auth';

// 상수들을 함수로 변경하여 지연 실행
export function getSupabaseUrl() {
  const env = getEnv();
  return env.VITE_SUPABASE_URL ?? '';
}

export function getSupabaseAnonKey() {
  const env = getEnv();
  return env.VITE_SUPABASE_ANON_KEY ?? '';
}

export function isSupabaseConfigured() {
  // 첫 호출 시에만 로그 출력 (지연 실행)
  logConfigOnce();
  
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  
  const ok =
    typeof url === 'string' &&
    typeof key === 'string' &&
    url.startsWith('https://') &&
    url.length > 'https://'.length &&
    key.length > 0;

  if (!ok) {
    try {
      console.warn('[auth] Supabase not configured', {
        urlEmpty: !url,
        anonEmpty: !key,
        urlValue: url || '(empty)',
        anonLen: (key || '').length,
      });
    } catch {}
  }

  return ok;
}


