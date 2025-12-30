import { Promotion, Fighter, Contract, Event, PromotionWeightRanking } from './types';

export type GameState = {
  version: number;
  seed: number;

  meta: {
    createdAt: string;
    updatedAt: string;
    year: number;
    nowDay: number; // epoch day
    playerPromotionId: string;
  };

  promotions: Record<string, Promotion>;
  fighters: Record<string, Fighter>;
  contracts: Record<string, Contract>;

  rankings: PromotionWeightRanking[];

  season: {
    eventsPlanned: number;
    eventsCompleted: number;
    events: Event[];
  };

  market: {
    lastSeasonTransfers: Array<{
      fighterId: string;
      from: string;
      to: string;
      reason: 'UP' | 'DOWN' | 'FILL';
    }>;
    lastSeasonRetiredIds: string[];
    lastSeasonRookieIds: string[];
  };

  dev?: {
    balanceOverride?: any;
  };
};
