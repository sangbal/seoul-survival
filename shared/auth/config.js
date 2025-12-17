// Social login (SSO) config
// - Supabase URL / anon key는 Vite 환경 변수(VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)를 통해 주입한다.
// - 개발/배포 환경 모두에서 .env(.local) 또는 CI secrets를 통해 값을 설정해야 한다.
// - 빌드 되지 않은 정적 ESM 배포에서는 import.meta.env가 비어 있을 수 있으므로,
//   이 파일은 기본적으로 "빈 설정"을 표현하고, isSupabaseConfigured()로 사용 가능 여부를 판별한다.
//
// Vite dev / build 환경에서는 import.meta.env에 값이 주입된다.
// 정적 ESM 환경(직접 호스팅)에서는 env가 비어 있어 SSO/리더보드가 비활성(게스트 모드)로 동작한다.
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

// 진단용 로그 (개발 시 env 주입 여부 확인)
try {
  console.log('[env] VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL);
  console.log(
    '[env] VITE_SUPABASE_ANON_KEY length:',
    (env.VITE_SUPABASE_ANON_KEY || '').length
  );
} catch {}

export const SUPABASE_URL = env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY ?? '';

// Share auth state across hub + all subpath games on the same origin.
export const AUTH_STORAGE_KEY = 'clicksurvivor-auth';

export function isSupabaseConfigured() {
  const ok =
    typeof SUPABASE_URL === 'string' &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_URL.length > 'https://'.length &&
    SUPABASE_ANON_KEY.length > 0;

  if (!ok) {
    try {
      console.warn('[auth] Supabase not configured', {
        urlEmpty: !SUPABASE_URL,
        anonEmpty: !SUPABASE_ANON_KEY,
        urlValue: SUPABASE_URL || '(empty)',
        anonLen: (SUPABASE_ANON_KEY || '').length,
      });
    } catch {}
  }

  return ok;
}


