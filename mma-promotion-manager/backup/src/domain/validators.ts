import { GameState } from './state';

export function validateGameState(state: GameState): boolean {
  if (!state.meta || !state.promotions || !state.fighters) {
    console.error('Invalid GameState: Missing core objects');
    return false;
  }
  
  if (Object.keys(state.promotions).length !== 12) {
    console.warn('GameState warning: Promotion count is not 12');
  }

  // Add more specific checks as needed (e.g. version compatibility)
  
  return true;
}
