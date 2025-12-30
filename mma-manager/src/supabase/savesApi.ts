import { supabase } from './client';
import { GameState } from '../domain/state';

export type SaveSummary = {
  slot: number;
  title: string;
  updated_at: string;
};

export async function listSaves(): Promise<Array<SaveSummary>> {
  const { data, error } = await supabase
    .from('mma_saves')
    .select('slot, title, updated_at')
    .order('slot', { ascending: true });

  if (error) {
    console.error('Error listing saves:', error);
    return [];
  }
  return data || [];
}

export async function loadSave(slot: number): Promise<GameState | null> {
  const { data, error } = await supabase
    .from('mma_saves')
    .select('state')
    .eq('slot', slot)
    .single();

  if (error) {
    console.error(`Error loading save slot ${slot}:`, error);
    return null;
  }
  
  if (!data) return null;
  
  // TODO: Migration logic if save_version < current
  return data.state as GameState;
}

export async function upsertSave(slot: number, title: string, state: GameState): Promise<void> {
  const { error } = await supabase
    .from('mma_saves')
    .upsert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      slot,
      title,
      state,
      game_version: 1,
      save_version: state.version,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, slot' });

  if (error) {
    console.error(`Error saving slot ${slot}:`, error);
    throw error;
  }
}

export async function deleteSave(slot: number): Promise<void> {
  const { error } = await supabase
    .from('mma_saves')
    .delete()
    .eq('slot', slot);

  if (error) {
    console.error(`Error deleting save slot ${slot}:`, error);
    throw error;
  }
}
