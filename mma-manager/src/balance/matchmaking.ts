// TBD-LOGIC: Safe Default Event Weight Plan
// Fixed 6-slot distribution to prevent guesswork and ensure balance.
// Order: Main, Co-Main, Undercard 1-4
export const EVENT_WEIGHT_PLAN = [
    'WW', // MAIN_5R
    'LW', // CO_3R
    'FW', // UNDER_3R_1
    'LW', // UNDER_3R_2
    'WW', // UNDER_3R_3
    'MW' // UNDER_3R_4
] as const;

// Matchmaking Balance Constants
export const MATCHMAKING_CONSTANTS = {
    // TBD-LOGIC: No consecutive fight limits for MVP
    CONSECUTIVE_FIGHT_LIMIT: 99, 
    
    // TBD-DATA: Base Hype for empty slots (if needed)
    BASE_SLOT_HYPE: 10
};



// Expert Pick balance (used by systems/matchmakingEngine.ts)
export const EXPERT_PICK_BALANCE = {
  // Higher means win probability changes more slowly with rating diff
  ratingDiffScale: 120,
  parityBonus: { max: 0.12 },
  clamp: { minA: 0.05, maxA: 0.95 },
};

// Match hype balance (used by systems/matchmakingEngine.ts)
export const HYPE_BALANCE = {
  ticketPowerWeight: 1.0,
  parityWeight: 0.65,
  clamp: { min: 5, max: 100 },
};

// Event hype balance (used by systems/matchmakingEngine.ts)
export const EVENT_HYPE_BALANCE = {
  slotWeight: {
    MAIN_5R: 0.32,
    CO_3R: 0.22,
    UNDER_3R_1: 0.14,
    UNDER_3R_2: 0.12,
    UNDER_3R_3: 0.10,
    UNDER_3R_4: 0.10,
  } as Record<string, number>,
  clamp: { min: 5, max: 100 },
};
export type MatchmakingBalance = {
    eventWeightPlan: typeof EVENT_WEIGHT_PLAN;
    constants: typeof MATCHMAKING_CONSTANTS;
    expertPick: typeof EXPERT_PICK_BALANCE;
    hype: typeof HYPE_BALANCE;
    eventHype: typeof EVENT_HYPE_BALANCE;
  };

export const matchmaking: MatchmakingBalance = {
    eventWeightPlan: EVENT_WEIGHT_PLAN,
    constants: MATCHMAKING_CONSTANTS,
    expertPick: EXPERT_PICK_BALANCE,
    hype: HYPE_BALANCE,
    eventHype: EVENT_HYPE_BALANCE,
};
