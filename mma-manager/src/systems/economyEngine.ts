import { Event, Fighter, Promotion } from '../domain/types';
import { getBalance } from '../balance';
import { calculateEventHype } from './matchmakingEngine';

// 18.4 Occupancy
export function calculateOccupancy(eventHype: number, tier: 1|2|3|4|5|6): number {
  const balance = getBalance().economy.tier[tier];
  if (!balance) return 0.5;
  
  let occ = balance.occupancy.min + (eventHype / balance.occupancy.hypeDivisor);
  return Math.min(occ, balance.occupancy.clampMax);
}

// 18.6 Fight Money
export function calculateFightMoney(fighter: Fighter, tier: 1|2|3|4|5|6, slotIndex: number): number {
  const balance = getBalance().economy.payout;
  const tierBase = balance.baseByTier[tier];
  
  const slotKey = ['MAIN_5R', 'CO_3R', 'UNDER_3R_1', 'UNDER_3R_2', 'UNDER_3R_3', 'UNDER_3R_4'][slotIndex];
  // @ts-ignore
  const slotMult = balance.slotMultiplier[slotKey] || 0.5;
  
  const base = tierBase * slotMult;
  
  // Value Factor
  const winRate = (fighter.record.w / (fighter.record.w + fighter.record.l)) || 0.5;
  const valFactors = balance.fighterValue;
  
  const valueFactor = 1 + 
    valFactors.ticketWeight * (fighter.ticketPower - 50)/50 +
    valFactors.recordWeight * (winRate - 0.5) +
    valFactors.formWeight * (fighter.form - 50)/50;
    
  const clampedValueFactor = Math.min(Math.max(valueFactor, valFactors.clamp.min), valFactors.clamp.max);
  
  return Math.floor(base * clampedValueFactor);
}

// 18.5 Event Finance
export function calculateEventFinance(event: Event, promotion: Promotion, fighters: Record<string, Fighter>) {
  const balance = getBalance().economy.tier[promotion.tier];
  const eventHype = calculateEventHype(event.bouts, fighters);
  const occ = calculateOccupancy(eventHype, promotion.tier);
  
  const ticketSales = Math.floor(balance.venue.seats * balance.venue.ticketPrice * occ);
  
  const sponsorIncome = Math.floor(
    balance.sponsor.base + balance.sponsor.maxAdd * Math.min(eventHype / 200, 1)
  );
  
  const fixedCost = balance.fixedCost;
  
  // Payout Total
  let payoutTotal = 0;
  // Use Contract fight money if valid, or calculate estimate if not?
  // For MVP, assume we use the contract amount assigned.
  // But wait, the engine might need to calculate it for NEW contracts.
  // Here we sum likely payouts.
  // For now, simple sum of pre-calculated contract moneys would need accessing Contracts.
  // Since we don't have Contracts passed in here easily, let's assume `calculateFightMoney` 
  // was used to set the bout payouts or we estimate.
  // Better: Pass in the relevant Contracts or just re-calculate estimate.
  // Let's re-calculate estimate for now as a projection.
  
  event.bouts.forEach((b, idx) => {
    const fA = fighters[b.fighterAId];
    const fB = fighters[b.fighterBId];
    if (fA) payoutTotal += calculateFightMoney(fA, promotion.tier, idx);
    if (fB) payoutTotal += calculateFightMoney(fB, promotion.tier, idx);
  });
  
  const netProfit = ticketSales + sponsorIncome - fixedCost - payoutTotal;
  
  return {
    ticketSales,
    sponsorIncome,
    fixedCost,
    payoutTotal,
    mercLoanFee: 0, // MVP Stub
    netProfit,
    attendance: Math.floor(balance.venue.seats * occ),
    hype: eventHype
  };
}
