export type GenerationBalance = {
  seed: { defaultSeed: number };
  weightClassDist: { FW: number; LW: number; WW: number; MW: number };
  rookieAge: { min: number; max: number; mode: number };
  ticketPower: { baseFromCA: number; noiseSd: number; clamp: { min: number; max: number } };
  form: { mean: number; sd: number; clamp: { min: number; max: number } };
  traits: { 
    loyalty: { mean: number; sd: number }; 
    ambition: { mean: number; sd: number }; 
    clamp: { min: number; max: number } 
  };
  ca: {
    meanByGymRank: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, number>;
    sd: number;
    clamp: { min: number; max: number };
  };
  pa: {
    addMean: number;
    addSd: number;
    clamp: { min: number; max: number };
  };
  peakAge: { mean: number; sd: number; clamp: { min: number; max: number } };
  rating: { base: number; perCA: number; rdInit: number };
  abilities: {
    clamp: { min: number; max: number };
    weights: { strOff: number; strDef: number; grpOff: number; grpDef: number; cardio: number; chin: number };
    styleTagBoost: Record<
      string,
      Partial<Record<keyof GenerationBalance['abilities']['weights'], number>>
    >;
  };
  publicStats: {
    slpm: { base: number; perStrOff: number; noiseSd: number; clamp: { min: number; max: number } };
    sapm: { base: number; perStrDef: number; noiseSd: number; clamp: { min: number; max: number } };
    sigAcc: { base: number; perStrOff: number; noiseSd: number; clamp: { min: number; max: number } };
    sigDef: { base: number; perStrDef: number; noiseSd: number; clamp: { min: number; max: number } };
    tdPer15: { base: number; perGrpOff: number; noiseSd: number; clamp: { min: number; max: number } };
    tdAcc: { base: number; perGrpOff: number; noiseSd: number; clamp: { min: number; max: number } };
    tdDef: { base: number; perGrpDef: number; noiseSd: number; clamp: { min: number; max: number } };
    avgCtrlSec: { base: number; perGrpOff: number; noiseSd: number; clamp: { min: number; max: number } };
    subAttPer15: { base: number; perGrpOff: number; noiseSd: number; clamp: { min: number; max: number } };
    kdPerFight: { base: number; perStrOff: number; noiseSd: number; clamp: { min: number; max: number } };
    bodyRates: {
      base: { head: number; body: number; leg: number };
      styleShift: Record<string, { head?: number; body?: number; leg?: number }>;
      noiseSd: number;
    };
  };
};

export const generation: GenerationBalance = {
  seed: { defaultSeed: 12345 },
  weightClassDist: { FW: 0.25, LW: 0.3, WW: 0.25, MW: 0.2 },
  rookieAge: { min: 20, max: 28, mode: 24 },
  ticketPower: { baseFromCA: 0.5, noiseSd: 15, clamp: { min: 1, max: 100 } },
  form: { mean: 60, sd: 10, clamp: { min: 20, max: 90 } },
  traits: {
    loyalty: { mean: 50, sd: 20 },
    ambition: { mean: 50, sd: 20 },
    clamp: { min: 0, max: 100 },
  },
  ca: {
    meanByGymRank: {
      1: 78, 2: 76, 3: 74, 4: 72, 5: 70, 6: 68, 7: 66, 8: 64, 9: 62, 10: 60,
    },
    sd: 10, // Increased SD for wider variety
    clamp: { min: 30, max: 99 },
  },
  pa: {
    addMean: 6,
    addSd: 6,
    clamp: { min: 40, max: 100 },
  },
  peakAge: { mean: 29, sd: 2, clamp: { min: 25, max: 35 } },
  rating: { base: 1000, perCA: 10, rdInit: 350 },
  abilities: {
    clamp: { min: 1, max: 20 },
    weights: { strOff: 1, strDef: 1, grpOff: 1, grpDef: 1, cardio: 1, chin: 1 },
    styleTagBoost: {
      ALL_ROUND: { strOff: 0.5, grpOff: 0.5 },
      COUNTER_RANGE: { strOff: 1, strDef: 1 },
      PRESSURE_BRAWL: { strOff: 2, chin: 1, strDef: -1 },
      WRESTLE_CTRL: { grpOff: 2, cardio: 1 },
      KICK_LEG: { strOff: 1.5, strDef: 0.5 },
      BJJ_SUB: { grpOff: 1, grpDef: 1 },
    },
  },
  publicStats: {
    slpm: { base: 1.5, perStrOff: 0.2, noiseSd: 0.5, clamp: { min: 0, max: 10 } },
    sapm: { base: 6.0, perStrDef: -0.2, noiseSd: 0.5, clamp: { min: 0.5, max: 15 } },
    sigAcc: { base: 0.3, perStrOff: 0.015, noiseSd: 0.05, clamp: { min: 0.1, max: 0.8 } },
    sigDef: { base: 0.4, perStrDef: 0.015, noiseSd: 0.05, clamp: { min: 0.2, max: 0.8 } },
    tdPer15: { base: 0, perGrpOff: 0.15, noiseSd: 0.5, clamp: { min: 0, max: 8 } },
    tdAcc: { base: 0.2, perGrpOff: 0.03, noiseSd: 0.1, clamp: { min: 0, max: 1 } },
    tdDef: { base: 0.3, perGrpDef: 0.03, noiseSd: 0.1, clamp: { min: 0, max: 1 } },
    avgCtrlSec: { base: 0, perGrpOff: 10, noiseSd: 30, clamp: { min: 0, max: 300 } },
    subAttPer15: { base: 0, perGrpOff: 0.05, noiseSd: 0.2, clamp: { min: 0, max: 5 } },
    kdPerFight: { base: 0, perStrOff: 0.02, noiseSd: 0.1, clamp: { min: 0, max: 3 } },
    bodyRates: {
      base: { head: 0.7, body: 0.2, leg: 0.1 },
      styleShift: {
        KICK_LEG: { leg: 0.15, head: -0.15 },
        PRESSURE_BRAWL: { head: 0.1, leg: -0.1 },
      },
      noiseSd: 0.05,
    },
  },
};
