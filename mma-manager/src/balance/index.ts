import { GenerationBalance, generation } from './generation';
import { EconomyBalance, economy } from './economy';
import { MatchmakingBalance, matchmaking } from './matchmaking';
import { SimulationBalance, simulation } from './simulation';
import { RankingBalance, ranking } from './ranking';
import { StoryBalance, story } from './story';
import { GymDef, gyms } from './gyms';
import { PromotionDef, promotions } from './promotions';
import { UiTextDef, uiText } from './uiText';

export type Balance = {
  app: { version: number };
  generation: GenerationBalance;
  economy: EconomyBalance;
  matchmaking: MatchmakingBalance;
  simulation: SimulationBalance;
  ranking: RankingBalance;
  story: StoryBalance;
  gyms: GymDef[];
  promotions: PromotionDef[];
  uiText: UiTextDef;
};

// Base balance instance
const baseBalance: Balance = {
  app: { version: 1 },
  generation,
  economy,
  matchmaking,
  simulation,
  ranking,
  story,
  gyms,
  promotions,
  uiText,
};

let currentBalance: Balance = { ...baseBalance };

// Override management
const STORAGE_KEY = 'balance_override_mma_v1';

export function getBalance(): Balance {
  return currentBalance;
}

export function setBalanceOverride(override: any): void {
  try {
    // Deep merge logic would go here. For MVP, we might just replace top-level sections or use a simple merge.
    // For safety, we should implement a proper deep merge helper.
    // Stub:
    console.log('[Balance] Override set:', override);
    // currentBalance = deepMerge(baseBalance, override); 
    // Need a deepMerge implementation.
    currentBalance = { ...baseBalance, ...override }; // Shallow merge for now
    localStorage.setItem(STORAGE_KEY, JSON.stringify(override));
  } catch (e) {
    console.error('[Balance] Failed to set override', e);
  }
}

export function resetBalanceOverride(): void {
  currentBalance = { ...baseBalance };
  localStorage.removeItem(STORAGE_KEY);
}

export function validateBalance(b: Balance): void {
  // Minimal validation
  if (!b.gyms || b.gyms.length !== 10) console.warn('[Balance] Gym count mismatch');
  if (!b.promotions || b.promotions.length !== 12) console.warn('[Balance] Promotion count mismatch');
}

// Load on init
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const override = JSON.parse(saved);
    setBalanceOverride(override);
  }
} catch (e) {
  console.warn('[Balance] Failed to load override', e);
}
