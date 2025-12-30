export type SimulationBalance = {
  tickSeconds: number;
  rounds: {
    main5R: { rounds: 5; secondsPerRound: number };
    threeR: { rounds: 3; secondsPerRound: number };
  };
  judging: {
    strikeWeight: number;
    takedownWeight: number;
    controlWeight: number;
    knockdownWeight: number;
  };
  finish: {
    ko: {
      base: number;
      strOffWeight: number;
      chinInvWeight: number;
      momentumWeight: number;
    };
    sub: {
      base: number;
      grpOffWeight: number;
      grpDefInvWeight: number;
      fatigueWeight: number;
    };
    dominanceBoost: number;
    clampProb: { min: number; max: number };
  };
  stats: {
    strike: {
      baseAttemptsPerTick: number;
      accBase: number;
      accPerStrOff: number;
      defPerStrDef: number;
      headBodyLegFromRates: boolean;
    };
    takedown: {
      baseAttemptsPerTick: number;
      accBase: number;
      accPerGrpOff: number;
      defPerGrpDef: number;
      controlSecPerSuccessMean: number;
    };
    submission: { baseAttemptsPerTick: number; perGrpOff: number };
    knockdown: { basePerTick: number; perStrOff: number };
  };
  commentary: {
    cadence: { everyTicksMin: number; everyTicksMax: number };
    excitement: { hypeWeight: number; finishWeight: number };
  };
};

export const simulation: SimulationBalance = {
  tickSeconds: 8,
  rounds: {
    main5R: { rounds: 5, secondsPerRound: 300 },
    threeR: { rounds: 3, secondsPerRound: 300 },
  },
  judging: {
    strikeWeight: 1.0,
    takedownWeight: 0.8,
    controlWeight: 0.5,
    knockdownWeight: 2.0,
  },
  finish: {
    ko: { base: 0.001, strOffWeight: 0.0005, chinInvWeight: 0.0005, momentumWeight: 0.001 },
    sub: { base: 0.0005, grpOffWeight: 0.0005, grpDefInvWeight: 0.0005, fatigueWeight: 0.001 },
    dominanceBoost: 1.5,
    clampProb: { min: 0, max: 0.1 },
  },
  stats: {
    strike: {
      baseAttemptsPerTick: 4,
      accBase: 0.3,
      accPerStrOff: 0.02,
      defPerStrDef: 0.02,
      headBodyLegFromRates: true,
    },
    takedown: {
      baseAttemptsPerTick: 0.2,
      accBase: 0.2,
      accPerGrpOff: 0.03,
      defPerGrpDef: 0.03,
      controlSecPerSuccessMean: 40,
    },
    submission: { baseAttemptsPerTick: 0.1, perGrpOff: 0.02 },
    knockdown: { basePerTick: 0.001, perStrOff: 0.001 },
  },
  commentary: {
    cadence: { everyTicksMin: 2, everyTicksMax: 5 },
    excitement: { hypeWeight: 1.0, finishWeight: 2.0 },
  },
};
