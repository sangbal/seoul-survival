/**
 * 플레이 기록 조회 유틸
 * localStorage와 클라우드 저장소에서 최근 플레이 기록을 읽어옵니다.
 */

import { getUser } from '../shared/auth/core.js';
import { fetchCloudSave } from '../shared/cloudSave.js';

/**
 * 게임별 localStorage 키 매핑
 */
const GAME_SAVE_KEYS = {
  seoulsurvival: 'seoulTycoonSaveV1',
  // 향후 다른 게임 추가 가능
};

/**
 * localStorage에서 게임 저장 데이터 확인
 * @param {string} gameSlug
 * @returns {Promise<{ hasSave: boolean, lastPlayed?: number, playTime?: number }>}
 */
async function checkLocalSave(gameSlug) {
  const saveKey = GAME_SAVE_KEYS[gameSlug];
  if (!saveKey) return { hasSave: false };

  try {
    const raw = localStorage.getItem(saveKey);
    if (!raw) return { hasSave: false };

    const data = JSON.parse(raw);
    const hasPlayHistory = 
      (data.totalPlayTime && data.totalPlayTime > 0) ||
      (data.cash && data.cash > 0) ||
      (data.totalClicks && data.totalClicks > 0);

    if (!hasPlayHistory) return { hasSave: false };

    return {
      hasSave: true,
      lastPlayed: data.ts || data.saveTime ? new Date(data.saveTime || data.ts).getTime() : Date.now(),
      playTime: data.totalPlayTime || 0,
    };
  } catch (e) {
    console.warn(`[PlayHistory] Failed to check local save for ${gameSlug}:`, e);
    return { hasSave: false };
  }
}

/**
 * 클라우드 저장소에서 게임 저장 데이터 확인
 * @param {string} gameSlug
 * @returns {Promise<{ hasSave: boolean, lastPlayed?: number, playTime?: number }>}
 */
async function checkCloudSave(gameSlug) {
  try {
    // getUser()는 Supabase 클라이언트를 초기화할 수 있으므로, 
    // 타임아웃을 두고 안전하게 처리
    const user = await Promise.race([
      getUser(),
      new Promise((resolve) => setTimeout(() => resolve(null), 2000)), // 2초 타임아웃
    ]);
    
    if (!user) return { hasSave: false };

    const result = await Promise.race([
      fetchCloudSave(gameSlug),
      new Promise((resolve) => setTimeout(() => resolve({ ok: false, reason: 'timeout' }), 3000)), // 3초 타임아웃
    ]);
    
    if (!result.ok || !result.found) return { hasSave: false };

    const save = result.save;
    const hasPlayHistory =
      (save.totalPlayTime && save.totalPlayTime > 0) ||
      (save.cash && save.cash > 0) ||
      (save.totalClicks && save.totalClicks > 0);

    if (!hasPlayHistory) return { hasSave: false };

    return {
      hasSave: true,
      lastPlayed: result.updated_at ? new Date(result.updated_at).getTime() : (save.ts || Date.now()),
      playTime: save.totalPlayTime || 0,
    };
  } catch (e) {
    console.warn(`[PlayHistory] Failed to check cloud save for ${gameSlug}:`, e);
    return { hasSave: false };
  }
}

/**
 * 게임의 최근 플레이 기록 조회 (로컬 + 클라우드 중 최신)
 * @param {string} gameSlug
 * @returns {Promise<{ hasPlayHistory: boolean, lastPlayed?: number, playTime?: number }>}
 */
export async function getPlayHistory(gameSlug) {
  const [local, cloud] = await Promise.all([
    checkLocalSave(gameSlug),
    checkCloudSave(gameSlug),
  ]);

  // 둘 다 없으면 플레이 기록 없음
  if (!local.hasSave && !cloud.hasSave) {
    return { hasPlayHistory: false };
  }

  // 둘 중 더 최근 것을 선택
  const lastPlayed = Math.max(
    local.lastPlayed || 0,
    cloud.lastPlayed || 0
  );

  const playTime = Math.max(
    local.playTime || 0,
    cloud.playTime || 0
  );

  return {
    hasPlayHistory: true,
    lastPlayed,
    playTime,
  };
}

/**
 * 모든 게임의 플레이 기록 조회 (최근 플레이 순 정렬)
 * @returns {Promise<Array<{ gameSlug: string, lastPlayed: number, playTime: number }>>}
 */
export async function getAllPlayHistory() {
  const gameSlugs = Object.keys(GAME_SAVE_KEYS);
  const histories = await Promise.all(
    gameSlugs.map(async (slug) => {
      const history = await getPlayHistory(slug);
      if (!history.hasPlayHistory) return null;
      return {
        gameSlug: slug,
        lastPlayed: history.lastPlayed || 0,
        playTime: history.playTime || 0,
      };
    })
  );

  // null 제거 후 최근 플레이 순 정렬
  return histories
    .filter((h) => h !== null)
    .sort((a, b) => b.lastPlayed - a.lastPlayed);
}

