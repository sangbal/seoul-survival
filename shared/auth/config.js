// Social login (SSO) config
// - This repo is currently deployed as static files, so client-side auth needs a public config.
// - For Supabase: URL + anon key are safe to expose (they are public keys), but protect data via RLS on the server.
//
// TODO: Replace placeholders with your Supabase project values.
// Example:
// export const SUPABASE_URL = 'https://xxxx.supabase.co';
// export const SUPABASE_ANON_KEY = 'eyJ...';

export const SUPABASE_URL = 'https://nvxdwacqmiofpennukeo.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52eGR3YWNxbWlvZnBlbm51a2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTMwNDYsImV4cCI6MjA4MTQ2OTA0Nn0.v2UoOk7xdmascY10Oy8fT3kYTWm9gWKSC9C4wH4nwP4';

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


