export type StoryBalance = {
  yearEnd: {
    retirement: {
      minAge: number;
      maxAge: number;
      baseProbAt35: number;
      baseProbAt45: number;
      starReductionMax: number;
    };
    transfer: {
      minRatio: number;
      maxRatio: number;
      upRatio: number;
      upCandidateTopPct: number;
      downVictimBottomPct: number;
      maxTierStep: 1;
    };
    contractRenewal: {
      demand: {
        baseRaise: number;
        ambitionWeight: number;
        loyaltyWeight: number;
        tierGapWeight: number;
        clamp: { min: number; max: number };
      };
      negotiation: { maxCounterOffers: number };
      failOutcome: {
        retireBase: number;
        retireAgeWeight: number;
        transferBase: number;
      };
    };
  };
  cooldown: {
    win: number;
    lossDecision: [number, number];
    lossKO_TKO: [number, number];
    lossSUB: [number, number];
  };
  commentaryLines: {
    categories: Array<
      | 'OPENING'
      | 'STRIKE_EXCHANGE'
      | 'BIG_HIT'
      | 'KNOCKDOWN'
      | 'TAKEDOWN'
      | 'CONTROL'
      | 'SUB_ATTEMPT'
      | 'ROUND_END'
      | 'DECISION'
      | 'FINISH_KO'
      | 'FINISH_SUB'
    >;
  };
};

export const story: StoryBalance = {
  yearEnd: {
    retirement: {
      minAge: 35,
      maxAge: 45,
      baseProbAt35: 0.03,
      baseProbAt45: 0.25,
      starReductionMax: 0.25,
    },
    transfer: {
      minRatio: 0.02,
      maxRatio: 0.05,
      upRatio: 0.7,
      upCandidateTopPct: 0.15,
      downVictimBottomPct: 0.15,
      maxTierStep: 1,
    },
    contractRenewal: {
      demand: {
        baseRaise: 0.1,
        ambitionWeight: 0.05,
        loyaltyWeight: 0.05,
        tierGapWeight: 0.1,
        clamp: { min: 0.0, max: 0.6 },
      },
      negotiation: { maxCounterOffers: 1 },
      failOutcome: {
        retireBase: 0.05,
        retireAgeWeight: 0.1,
        transferBase: 0.8,
      },
    },
  },
  cooldown: {
    win: 0,
    lossDecision: [0, 1],
    lossKO_TKO: [1, 2],
    lossSUB: [0, 1],
  },
  commentaryLines: {
    categories: [
      'OPENING',
      'STRIKE_EXCHANGE',
      'BIG_HIT',
      'KNOCKDOWN',
      'TAKEDOWN',
      'CONTROL',
      'SUB_ATTEMPT',
      'ROUND_END',
      'DECISION',
      'FINISH_KO',
      'FINISH_SUB',
    ],
  },
};
