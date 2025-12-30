export type Country = 'USA' | 'BRA' | 'RUS' | 'JPN' | 'KOR';
export type WeightClass = 'FW' | 'LW' | 'WW' | 'MW';

export type FighterId = string;
export type PromotionId = string;
export type GymId = string;

export type Fighter = {
  id: FighterId;
  nickname: { ko: string; en: string };
  age: number;
  country: Country;
  gymId: GymId;

  weightClass: WeightClass;
  ticketPower: number; // 1..100
  form: number; // 20..90
  traits: { loyalty: number; ambition: number };

  record: {
    w: number;
    l: number;
    koW: number;
    subW: number;
    decW: number;
    koL: number;
    subL: number;
    decL: number;
  };

  publicCareerStats: {
    slpm: number;
    sapm: number;
    sigAcc: number;
    sigDef: number;
    tdPer15: number;
    tdAcc: number;
    tdDef: number;
    avgCtrlSec: number;
    subAttPer15: number;
    kdPerFight: number;
    headRate: number;
    bodyRate: number;
    legRate: number;
  };

  status: {
    promotionId: PromotionId | 'FA';
    isFA: boolean;
    cooldown: number; // 0..2
    lastFightDay: number; // epoch day
  };

  hidden: {
    ca: number;
    pa: number;
    peakAge: number;
    rating: number; // Internal rating (ELO-like)
    rd: number; // Uncertainty
    abilities: {
      strOff: number;
      strDef: number;
      grpOff: number;
      grpDef: number;
      cardio: number;
      chin: number;
    };
  };
};

export type Promotion = {
  id: PromotionId;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  isPlayer: boolean;
  budget: {
    cash: number;
    fanbase: number;
  };
};

export type Contract = {
  id: string;
  fighterId: FighterId;
  promotionId: PromotionId;
  startDay: number; // epoch
  endDay: number; // epoch
  fightMoney: number;
  isExpired: boolean;
};

export type BoutResult = {
  winnerId: FighterId | null; // null if draw
  method: 'KO_TKO' | 'SUB' | 'DEC' | 'DRAW';
  rounds: number;
  time: string; // e.g. "3:45"
  stats?: any; // Detailed stats
};

export type Bout = {
  id: string;
  fighterAId: FighterId;
  fighterBId: FighterId;
  weightClass: WeightClass;
  rounds: 3 | 5;
  isTitle: boolean;
  isMainEvent: boolean;
  
  // Status
  isCompleted: boolean;
  result?: BoutResult;

  // Matchmaking Info
  expertPick?: {
    probA: number; // 0..1
    probB: number;
  };
  hype?: number; // 0..100
};

export type EventStatus = 'PLANNING' | 'BOOKED' | 'COMPLETED';

export type Event = {
  id: string;
  promotionId: PromotionId;
  name: string;
  day: number; // Scheduled day
  venueId: string; // 'tier_venue'
  status: EventStatus;
  
  bouts: Bout[];
  
  // Financials (Predictions or Actuals)
  finance: {
    ticketSales: number;
    sponsorIncome: number;
    fixedCost: number;
    payoutTotal: number;
    mercLoanFee: number;
    netProfit: number;
    attendance: number;
    hype: number; // 0..200
  };
};

export type PromotionWeightRanking = {
  promotionId: PromotionId;
  weightClass: WeightClass;
  fighterIds: FighterId[]; // Ordered by rank
  ppi?: number;
};
