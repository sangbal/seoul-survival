import { uuidv4, generateNickname } from '../utils';
import { GameState } from '../domain/state';
import { Fighter, Promotion, Contract, PromotionId, GymId, WeightClass, Country } from '../domain/types';
import { getBalance } from '../balance';
import { RNG } from './rng';
import { GAME_START_YEAR, GAME_START_DAY, WEIGHT_CLASSES } from '../domain/constants';

// Helper to generate a random ID
const genId = () => uuidv4();

export function bootstrapGame(seed: number = 12345): GameState {
  const balance = getBalance();
  const rng = new RNG(seed);

  // 1. Create Promotions
  // Player is 'prom_player', others are AI
  const promotions: Record<string, Promotion> = {};
  
  balance.promotions.forEach(def => {
    promotions[def.id] = {
      id: def.id,
      name: def.name,
      tier: def.initialTier,
      isPlayer: !!def.isPlayer,
      budget: {
        cash: def.isPlayer ? 500000000 : 10000000000, // Player starts with 500M KRW, AI rich
        fanbase: def.initialTier === 6 ? 1000 : 10000 * (7 - def.initialTier),
      },
    };
  });

  // 2. Fighters & Contracts
  const fighters: Record<string, Fighter> = {};
  const contracts: Record<string, Contract> = {};
  
  // Total 500 fighters
  // Distribute by Weight Class
  const totalFighters = 500;
  // Simple distribution: FW(25%), LW(30%), WW(25%), MW(20%)
  const wcDist = balance.generation.weightClassDist;
  const countByWC = {
    FW: Math.floor(totalFighters * wcDist.FW),
    LW: Math.floor(totalFighters * wcDist.LW),
    WW: Math.floor(totalFighters * wcDist.WW),
    MW: Math.floor(totalFighters * wcDist.MW),
  };
  
  // Adjust rounding errors
  let currentCount = Object.values(countByWC).reduce((a, b) => a + b, 0);
  while (currentCount < totalFighters) { countByWC.LW++; currentCount++; }

  // Gyms
  const gymList = balance.gyms;

  (Object.keys(countByWC) as WeightClass[]).forEach(wc => {
    const count = countByWC[wc];
    for (let i = 0; i < count; i++) {
      // Assign random Gym
      const gym = rng.pick(gymList);
      
      // Attributes based on balance
      const caMean = balance.generation.ca.meanByGymRank[gym.tier === 'MAJOR' ? 1 : 6] || 60; // Simplified tier mapping
      const ca = rng.clamp(rng.gaussian(caMean, balance.generation.ca.sd), balance.generation.ca.clamp.min, balance.generation.ca.clamp.max);
      const pa = rng.clamp(ca + rng.gaussian(balance.generation.pa.addMean, balance.generation.pa.addSd), ca, balance.generation.pa.clamp.max);
      
      // Age
      const age = Math.floor(rng.triangular(balance.generation.rookieAge.min, 40, balance.generation.rookieAge.mode)); // Allow some older veterans initally
      
      const fighterId = genId();
      
      // Create Fighter
      const fighter: Fighter = {
        id: fighterId,
        nickname: generateNickname(fighterId),
        age: age,
        country: gym.country as Country,
        gymId: gym.id,
        weightClass: wc,
        ticketPower: rng.clamp(rng.gaussian(ca * 0.5, 15), 1, 100),
        form: rng.int(40, 80),
        traits: {
          loyalty: rng.int(20, 90),
          ambition: rng.int(20, 90),
        },
        record: { w: 0, l: 0, koW: 0, subW: 0, decW: 0, koL: 0, subL: 0, decL: 0 }, // Should generate fake record based on age? detailed later
        publicCareerStats: {
          slpm: 0, sapm: 0, sigAcc: 0, sigDef: 0,
          tdPer15: 0, tdAcc: 0, tdDef: 0,
          avgCtrlSec: 0, subAttPer15: 0, kdPerFight: 0,
          headRate: 0, bodyRate: 0, legRate: 0,
        },
        status: {
          promotionId: 'FA', // Assigned below
          isFA: false,
          cooldown: 0,
          lastFightDay: 0,
        },
        hidden: {
          ca, pa,
          peakAge: rng.int(28, 32),
          rating: 1000 + (ca * 10), // Simple rating init
          rd: 350,
          abilities: {
             strOff: rng.int(1,20), strDef: rng.int(1,20),
             grpOff: rng.int(1,20), grpDef: rng.int(1,20),
             cardio: rng.int(1,20), chin: rng.int(1,20),
          }
        },
      };
      fighters[fighterId] = fighter;
    }
  });

  // Assign Fighters to Promotions
  // Strategy: Fill top tiers first with best fighters
  const sortedFighters = Object.values(fighters).sort((a, b) => b.hidden.ca - a.hidden.ca);
  const sortedPromotions = Object.values(promotions).sort((a, b) => a.tier - b.tier);

  // Simple assignment: Round robin based on tier capacity?
  // Or just assign top 20 to Tier 1, next to Tier 2...
  // Each promotion needs roughly 40 fighters (500 / 12 ~= 41)
  
  let pIdx = 0;
  sortedFighters.forEach(f => {
    const promotion = sortedPromotions[pIdx];
    
    // Create Contract
    const contractId = genId();
    contracts[contractId] = {
      id: contractId,
      fighterId: f.id,
      promotionId: promotion.id,
      startDay: GAME_START_DAY,
      endDay: GAME_START_DAY + 365,
      fightMoney: Math.floor(balance.economy.payout.baseByTier[promotion.tier] * (f.hidden.ca/100)), // Simple logic
      isExpired: false,
    };
    
    f.status.promotionId = promotion.id;
    f.status.isFA = false;

    pIdx = (pIdx + 1) % sortedPromotions.length;
  });

  return {
    version: 1,
    seed,
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      year: GAME_START_YEAR,
      nowDay: GAME_START_DAY,
      playerPromotionId: 'prom_player',
    },
    promotions,
    fighters,
    contracts,
    rankings: [], // Should be initialized
    season: {
      eventsPlanned: 0,
      eventsCompleted: 0,
      events: [],
    },
    market: {
      lastSeasonTransfers: [],
      lastSeasonRetiredIds: [],
      lastSeasonRookieIds: [],
    },
  };
}
