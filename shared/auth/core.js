import { isSupabaseConfigured } from './config.js';
import { getSupabaseClient } from './supabaseClient.js';

let _client = null;
function client() {
  if (_client) return _client;
  _client = getSupabaseClient();
  return _client;
}

export function isAuthEnabled() {
  return isSupabaseConfigured();
}

export async function initAuthFromUrl() {
  const sb = client();
  if (!sb) return { ok: false, reason: 'not_configured' };

  // When using OAuth PKCE, Supabase redirects back with ?code=...
  // Exchange it, then clean up the URL.
  const hasCode = typeof location !== 'undefined' && /[?&]code=/.test(location.search);
  if (!hasCode) return { ok: true, exchanged: false };

  try {
    const { error } = await sb.auth.exchangeCodeForSession(location.href);
    if (error) return { ok: false, reason: 'exchange_failed', error };

    const u = new URL(location.href);
    u.searchParams.delete('code');
    u.searchParams.delete('state');
    history.replaceState(null, '', u.toString());
    return { ok: true, exchanged: true };
  } catch (e) {
    return { ok: false, reason: 'exchange_failed', error: e };
  }
}

export async function getUser() {
  const sb = client();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data?.user || null;
}

export async function signInWithOAuth(provider) {
  const sb = client();
  if (!sb) return { ok: false, reason: 'not_configured' };

  const redirectTo = location.origin + location.pathname + location.search.replace(/([?&])code=[^&]+(&|$)/, '$1').replace(/[?&]state=[^&]+(&|$)/, '$1');

  const { error } = await sb.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) return { ok: false, reason: 'oauth_failed', error };
  return { ok: true };
}

export async function signOut() {
  const sb = client();
  if (!sb) return { ok: false, reason: 'not_configured' };
  const { error } = await sb.auth.signOut();
  if (error) return { ok: false, reason: 'signout_failed', error };
  return { ok: true };
}

export function onAuthStateChange(cb) {
  const sb = client();
  if (!sb) return () => {};
  const { data } = sb.auth.onAuthStateChange((_event, session) => {
    cb(session?.user || null);
  });
  return () => data.subscription.unsubscribe();
}



