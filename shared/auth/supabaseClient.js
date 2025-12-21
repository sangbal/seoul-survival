import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL, AUTH_STORAGE_KEY } from './config.js';

// Remote ESM import so it works even when deploying as plain static files (no bundling).
// Vite build keeps this as an external import as well.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// 싱글톤 패턴: globalThis를 사용하여 HMR(개발환경)에서도 중복 생성 방지
const GLOBAL_CACHE_KEY = '__clicksurvivor_supabase_client';

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  
  // globalThis 캐시 확인 (HMR에서도 유지)
  if (typeof globalThis !== 'undefined' && globalThis[GLOBAL_CACHE_KEY]) {
    return globalThis[GLOBAL_CACHE_KEY];
  }
  
  // 새 클라이언트 생성 및 캐시
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
  }
  
  return client;
}



