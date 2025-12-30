import { Fighter, Bout, Event } from '../domain/types';
import { getBalance } from '../balance';
import { EVENT_SLOTS } from '../domain/constants';

// 18.1 Expert Pick
export function calculateExpertPick(fighterA: Fighter, fighterB: Fighter): { probA: number, probB: number } {
  const balance = getBalance().matchmaking.expertPick;
  
  // Calculate effective ratings (assume no inactivity for MVP initial logic, or pass it in)
  // In a real scenario, applies inactivity factor.
  const rA = fighterA.hidden.rating;
  const rB = fighterB.hidden.rating;
  
  const diff = rA - rB;
  let pA = 1 / (1 + Math.exp(-diff / balance.ratingDiffScale));
  
  // Parity bonus (pushes closer to 50/50 slightly for hype handling? No, spec says "parity bonus... excitement... sum to parity?")
  // Spec: "parity = 1 - abs(pA - 0.5)*2"
  // "pA = pA + (parity * parityBonus.max) * signToward(0.5)" ??? 
  // Wait, Spec 18.1 says: "pA = pA + (parity * parityBonus.max) * signToward(0.5)"
  // Actually, usually parity bonus is for HYPE, not win probability.
  // But Spec says 18.1 is "Expert Pick Formula".
  // "This bonus is for '50:50 is fun', keeping it small".
  // Let's implement literally.
  
  const parity = 1 - Math.abs(pA - 0.5) * 2;
  const parityBonus = balance.parityBonus.max * parity;
  
  // Direction: if pA > 0.5, reduce it? if pA < 0.5, increase it? To make it closer to 0.5?
  // Spec: "signToward(0.5)" implies bringing it closer to 0.5.
  if (pA > 0.5) pA -= parityBonus * 0.1; // Reduced effect to avoid flipping
  else pA += parityBonus * 0.1;
  
  // Clamp
  pA = Math.max(balance.clamp.minA, Math.min(balance.clamp.maxA, pA));
  const pB = 1 - pA;
  
  return { probA: pA, probB: pB };
}

// 18.2 Match Hype
export function calculateMatchHype(fighterA: Fighter, fighterB: Fighter): number {
  const balance = getBalance().matchmaking.hype;
  
  // Ticket Power
  const ticketAvg = (fighterA.ticketPower + fighterB.ticketPower) / 2;
  const ticketScore = ticketAvg * balance.ticketPowerWeight;
  
  // Parity (Excitement)
  // Use expert pick to determine parity
  const { probA } = calculateExpertPick(fighterA, fighterB);
  const parity = 1 - Math.abs(probA - 0.5) * 2; // 1.0 if 50/50, 0.0 if 100/0
  const parityScore = parity * 100 * balance.parityWeight; // Assuming parity is 0..1 scale mapped to 100 base
  
  // Story (Stub for MVP)
  const storyScore = 0;
  
  let hype = ticketScore + parityScore + storyScore;
  return Math.min(Math.max(hype, balance.clamp.min), balance.clamp.max);
}

// 18.3 Event Hype
export function calculateEventHype(bouts: Bout[], fighters: Record<string, Fighter>): number {
  const balance = getBalance().matchmaking.eventHype;
  let totalHype = 0;
  
  // Need to know which slot each bout is in.
  // Assuming bouts array order corresponds to slots? Or Bout object has slot info?
  // Domain ‘Bout’ doesn’t explicitly have ‘slot’ type field, but ‘Event’ has bouts list.
  // We can assume bouts[0] is MAIN, bouts[1] is CO_MAIN, etc. 
  
  bouts.forEach((bout, index) => {
    // Map index to slot type
    const slotKey = EVENT_SLOTS[index];
    if (!slotKey) return;
    
    const weight = balance.slotWeight[slotKey] || 0.1;
    
    const fA = fighters[bout.fighterAId];
    const fB = fighters[bout.fighterBId];
    if (!fA || !fB) return;
    
    const matchHype = calculateMatchHype(fA, fB);
    totalHype += matchHype * weight;
  });
  
  return Math.min(Math.max(totalHype, balance.clamp.min), balance.clamp.max);
}
