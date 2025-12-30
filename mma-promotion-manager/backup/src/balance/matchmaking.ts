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

export type MatchmakingBalance = {
    eventWeightPlan: typeof EVENT_WEIGHT_PLAN;
    constants: typeof MATCHMAKING_CONSTANTS;
  };

export const matchmaking: MatchmakingBalance = {
    eventWeightPlan: EVENT_WEIGHT_PLAN,
    constants: MATCHMAKING_CONSTANTS,
};
