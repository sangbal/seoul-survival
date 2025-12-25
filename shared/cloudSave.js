import { getSupabaseClient } from './auth/supabaseClient.js';
import { getUser } from './auth/core.js';
// isAuthEnabled는 동적 import로 변경 (config.js 로드 지연)

const TABLE = 'game_saves';

function normalizeError(err) {
  if (!err) return null;
  const msg = err?.message || String(err);
  return { message: msg, code: err?.code, details: err?.details, hint: err?.hint };
}

function isMissingTable(err) {
  const msg = String(err?.message || '').toLowerCase();
  return msg.includes('does not exist') || msg.includes('relation') || msg.includes('42p01');
}

export async function fetchCloudSave(gameSlug) {
  const { isAuthEnabled } = await import('./auth/core.js');
  if (!(await isAuthEnabled())) return { ok: false, reason: 'not_configured' };
  const sb = await getSupabaseClient();
  if (!sb) return { ok: false, reason: 'not_configured' };

  const user = await getUser();
  if (!user) return { ok: false, reason: 'not_signed_in' };

  const { data, error } = await sb
    .from(TABLE)
    .select('save, save_ts, updated_at')
    .eq('user_id', user.id)
    .eq('game_slug', gameSlug)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      reason: isMissingTable(error) ? 'missing_table' : 'query_failed',
      error: normalizeError(error),
    };
  }

  if (!data) return { ok: true, found: false };
  return { ok: true, found: true, save: data.save, save_ts: data.save_ts, updated_at: data.updated_at };
}

export async function upsertCloudSave(gameSlug, saveObj) {
  const { isAuthEnabled } = await import('./auth/core.js');
  if (!(await isAuthEnabled())) return { ok: false, reason: 'not_configured' };
  const sb = await getSupabaseClient();
  if (!sb) return { ok: false, reason: 'not_configured' };

  const user = await getUser();
  if (!user) return { ok: false, reason: 'not_signed_in' };

  const saveTs = Number(saveObj?.ts || Date.now()) || Date.now();
  const payload = {
    user_id: user.id,
    game_slug: gameSlug,
    save: saveObj,
    save_ts: saveTs,
  };

  // 디버깅: 저장되는 데이터에 닉네임 포함 여부 확인
  if (saveObj?.nickname !== undefined) {
    console.log('☁️ 클라우드 저장: 닉네임 포함됨:', saveObj.nickname || '(빈 문자열)');
  } else {
    console.warn('⚠️ 클라우드 저장: 닉네임 필드가 없음');
  }

  const { error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id,game_slug' });

  if (error) {
    return {
      ok: false,
      reason: isMissingTable(error) ? 'missing_table' : 'upsert_failed',
      error: normalizeError(error),
    };
  }

  return { ok: true };
}


