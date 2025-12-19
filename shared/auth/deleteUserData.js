// Delete user data from Supabase (game_saves, leaderboard)
import { getSupabaseClient } from './supabaseClient.js';
import { getUser } from './core.js';

/**
 * Delete all user data from Supabase
 * - Deletes game_saves records for the current user
 * - Deletes leaderboard records for the current user
 * @returns {Promise<{ ok: boolean, reason?: string, error?: any }>}
 */
export async function deleteUserData() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, reason: 'not_configured' };
  }

  const user = await getUser();
  if (!user) {
    return { ok: false, reason: 'not_signed_in' };
  }

  try {
    // Delete game_saves
    const { error: savesError } = await supabase
      .from('game_saves')
      .delete()
      .eq('user_id', user.id);

    if (savesError) {
      console.error('Failed to delete game_saves:', savesError);
      return { ok: false, reason: 'delete_saves_failed', error: savesError };
    }

    // Delete leaderboard entries
    const { error: leaderboardError } = await supabase
      .from('leaderboard')
      .delete()
      .eq('user_id', user.id);

    if (leaderboardError) {
      console.error('Failed to delete leaderboard:', leaderboardError);
      return { ok: false, reason: 'delete_leaderboard_failed', error: leaderboardError };
    }

    return { ok: true };
  } catch (error) {
    console.error('Exception while deleting user data:', error);
    return { ok: false, reason: 'exception', error };
  }
}


