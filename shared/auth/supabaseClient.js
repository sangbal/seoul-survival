import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL, AUTH_STORAGE_KEY } from './config.js';

// Remote ESM import so it works even when deploying as plain static files (no bundling).
// Vite build keeps this as an external import as well.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storageKey: AUTH_STORAGE_KEY,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}



