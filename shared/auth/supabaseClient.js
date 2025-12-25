// config.js는 동적 import로 변경 (모듈 로드 시 블로킹 방지)
// import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL, AUTH_STORAGE_KEY } from './config.js';
// AUTH_STORAGE_KEY도 동적 import로 변경

// 싱글톤 패턴: globalThis를 사용하여 HMR(개발환경)에서도 중복 생성 방지
const GLOBAL_CACHE_KEY = '__clicksurvivor_supabase_client';
const CLIENT_MODULE_KEY = '__clicksurvivor_supabase_client_module';
const CLIENT_PROMISE_KEY = '__clicksurvivor_supabase_client_promise';

// Remote ESM import를 동적 import로 변경하여 모듈 로드 시 블로킹 방지
// Vite build keeps this as an external import as well.
let _createClientPromise = null;

async function loadCreateClient() {
  if (_createClientPromise) return _createClientPromise;
  
  // globalThis 캐시 확인 (이미 로드된 경우)
  if (typeof globalThis !== 'undefined' && globalThis[CLIENT_MODULE_KEY]) {
    return globalThis[CLIENT_MODULE_KEY];
  }
  
  _createClientPromise = import('https://esm.sh/@supabase/supabase-js@2.49.1').then(module => {
    const createClient = module.createClient;
    if (typeof globalThis !== 'undefined') {
      globalThis[CLIENT_MODULE_KEY] = createClient;
    }
    return createClient;
  });
  
  return _createClientPromise;
}

export async function getSupabaseClient() {
  // globalThis 캐시 확인 (HMR에서도 유지) - 즉시 반환
  if (typeof globalThis !== 'undefined' && globalThis[GLOBAL_CACHE_KEY]) {
    return globalThis[GLOBAL_CACHE_KEY];
  }
  
  // Promise 캐싱으로 동시 호출 방지 (race condition 방지)
  if (typeof globalThis !== 'undefined' && globalThis[CLIENT_PROMISE_KEY]) {
    return globalThis[CLIENT_PROMISE_KEY];
  }
  
  // 새 Promise 생성 및 캐싱
  const clientPromise = (async () => {
    try {
      // 동적 import로 config 모듈 로드 (모듈 로드 시 블로킹 방지)
      const { isSupabaseConfigured, getSupabaseUrl, getSupabaseAnonKey, AUTH_STORAGE_KEY } = await import('./config.js');
      
      if (!isSupabaseConfigured()) return null;
      
      // 다시 한 번 캐시 확인 (다른 호출이 먼저 완료했을 수 있음)
      if (typeof globalThis !== 'undefined' && globalThis[GLOBAL_CACHE_KEY]) {
        return globalThis[GLOBAL_CACHE_KEY];
      }
      
      // 동적 import로 클라이언트 모듈 로드
      const createClient = await loadCreateClient();
      
      // 새 클라이언트 생성 및 캐시
      const client = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
        auth: {
          storageKey: AUTH_STORAGE_KEY,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      
      // globalThis에 캐시 저장
      if (typeof globalThis !== 'undefined') {
        globalThis[GLOBAL_CACHE_KEY] = client;
        // Promise 캐시 제거 (이제 클라이언트 캐시 사용)
        delete globalThis[CLIENT_PROMISE_KEY];
      }
      
      return client;
    } catch (error) {
      console.error('[supabaseClient] Failed to load/create client:', error);
      // 에러 발생 시 Promise 캐시 제거
      if (typeof globalThis !== 'undefined') {
        delete globalThis[CLIENT_PROMISE_KEY];
      }
      return null;
    }
  })();
  
  // Promise 캐싱
  if (typeof globalThis !== 'undefined') {
    globalThis[CLIENT_PROMISE_KEY] = clientPromise;
  }
  
  return clientPromise;
}



