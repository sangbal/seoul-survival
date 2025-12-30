import { WeightClass } from './types';

export const WEIGHT_CLASSES: WeightClass[] = ['FW', 'LW', 'WW', 'MW'];

export const TIER_MAX = 6;
export const TIER_MIN = 1;

export type SlotType = 'MAIN_5R' | 'CO_3R' | 'UNDER_3R_1' | 'UNDER_3R_2' | 'UNDER_3R_3' | 'UNDER_3R_4';

export const EVENT_SLOTS: SlotType[] = [
  'MAIN_5R',
  'CO_3R',
  'UNDER_3R_1',
  'UNDER_3R_2',
  'UNDER_3R_3',
  'UNDER_3R_4',
];

export const GAME_START_YEAR = 2025;
export const GAME_START_DAY = 1; // Jan 1st
