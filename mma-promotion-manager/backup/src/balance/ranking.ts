export type RankingBalance = {
  fighter: {
    elo: {
      kBase: number;
      kHypeWeight: number;
      upsetBonus: number;
      finishBonus: { ko: number; sub: number; dec: number };
    };
    inactivity: {
      divisorDays: number;
      minFactor: number;
      maxFactor: number;
    };
  };
  promotionPPI: {
    topN: number;
    missingPenaltyRating: number;
    smoothing: { currentWeight: number; lastWeight: number };
  };
  tierMove: {
    maxMovePerSeason: 1;
  };
};

export const ranking: RankingBalance = {
  fighter: {
    elo: {
      kBase: 32,
      kHypeWeight: 0.1, // Impact of hype on K-factor
      upsetBonus: 10,
      finishBonus: { ko: 15, sub: 15, dec: 0 },
    },
    inactivity: {
      divisorDays: 120,
      minFactor: 0.75,
      maxFactor: 1.0,
    },
  },
  promotionPPI: {
    topN: 25,
    missingPenaltyRating: 800, // Very low rating for missing slots
    smoothing: { currentWeight: 0.7, lastWeight: 0.3 },
  },
  tierMove: {
    maxMovePerSeason: 1,
  },
};
