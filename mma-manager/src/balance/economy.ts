export type EconomyBalance = {
  tier: Record<
    1 | 2 | 3 | 4 | 5 | 6,
    {
      venue: { seats: number; ticketPrice: number };
      fixedCost: number;
      sponsor: { base: number; maxAdd: number };
      occupancy: { min: number; hypeDivisor: number; clampMax: number };
    }
  >;
  payout: {
    slotMultiplier: Record<
      | 'MAIN_5R'
      | 'CO_3R'
      | 'UNDER_3R_1'
      | 'UNDER_3R_2'
      | 'UNDER_3R_3'
      | 'UNDER_3R_4',
      number
    >;
    baseByTier: Record<1 | 2 | 3 | 4 | 5 | 6, number>;
    fighterValue: {
      ticketWeight: number;
      recordWeight: number;
      formWeight: number;
      clamp: { min: number; max: number };
    };
    noiseSdRatio: number;
    clamp: { min: number; max: number };
  };
  mercenary: {
    fightMoneyMultiplier: number;
    loanFeeRatio: number;
  };
};

export const economy: EconomyBalance = {
  tier: {
    6: { venue: { seats: 500, ticketPrice: 30000 }, fixedCost: 5000000, sponsor: { base: 1000000, maxAdd: 2000000 }, occupancy: { min: 0.3, hypeDivisor: 200, clampMax: 1.0 } },
    5: { venue: { seats: 1500, ticketPrice: 50000 }, fixedCost: 20000000, sponsor: { base: 5000000, maxAdd: 10000000 }, occupancy: { min: 0.4, hypeDivisor: 220, clampMax: 1.0 } },
    4: { venue: { seats: 3000, ticketPrice: 80000 }, fixedCost: 50000000, sponsor: { base: 15000000, maxAdd: 30000000 }, occupancy: { min: 0.5, hypeDivisor: 240, clampMax: 1.0 } },
    3: { venue: { seats: 8000, ticketPrice: 120000 }, fixedCost: 150000000, sponsor: { base: 50000000, maxAdd: 100000000 }, occupancy: { min: 0.6, hypeDivisor: 260, clampMax: 1.0 } },
    2: { venue: { seats: 15000, ticketPrice: 200000 }, fixedCost: 400000000, sponsor: { base: 200000000, maxAdd: 400000000 }, occupancy: { min: 0.7, hypeDivisor: 280, clampMax: 1.0 } },
    1: { venue: { seats: 30000, ticketPrice: 350000 }, fixedCost: 1000000000, sponsor: { base: 1000000000, maxAdd: 2000000000 }, occupancy: { min: 0.8, hypeDivisor: 300, clampMax: 1.0 } },
  },
  payout: {
    slotMultiplier: {
      MAIN_5R: 3.0,
      CO_3R: 1.8,
      UNDER_3R_1: 1.2,
      UNDER_3R_2: 1.0,
      UNDER_3R_3: 0.8,
      UNDER_3R_4: 0.6,
    },
    baseByTier: {
      6: 2000000,
      5: 4000000,
      4: 8000000,
      3: 15000000,
      2: 30000000,
      1: 60000000,
    },
    fighterValue: {
      ticketWeight: 1.0,
      recordWeight: 0.5,
      formWeight: 0.2,
      clamp: { min: 0.5, max: 2.5 },
    },
    noiseSdRatio: 0.1,
    clamp: { min: 500000, max: 10000000000 },
  },
  mercenary: {
    fightMoneyMultiplier: 1.6,
    loanFeeRatio: 0.2,
  },
};
