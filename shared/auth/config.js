// Social login (SSO) config
// - This repo is currently deployed as static files, so client-side auth needs a public config.
// - For Supabase: URL + anon key are safe to expose (they are public keys), but protect data via RLS on the server.
//
// TODO: Replace placeholders with your Supabase project values.
// Example:
// export const SUPABASE_URL = 'https://xxxx.supabase.co';
// export const SUPABASE_ANON_KEY = 'eyJ...';

export const SUPABASE_URL = 'https://YOUR_SUPABASE_PROJECT.supabase.co';
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Share auth state across hub + all subpath games on the same origin.
export const AUTH_STORAGE_KEY = 'clicksurvivor-auth';

export function isSupabaseConfigured() {
  return (
    typeof SUPABASE_URL === 'string' &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_URL.startsWith('https://') &&
    !SUPABASE_URL.includes('YOUR_SUPABASE_PROJECT') &&
    !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
  );
}


