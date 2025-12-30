import { Fighter, Bout, BoutResult, Event } from '../domain/types';
import { GameState } from '../domain/state';
import { RNG } from './rng';

/**
 * Simulates a single bout between two fighters.
 * Returns the result (Winner, Method, Time).
 */
export function simulateBout(
    fA: Fighter, 
    fB: Fighter, 
    rounds: number, 
    rng: RNG
): BoutResult {
    // 1. Determine Winner
    // Uses Hidden Rating + Form + Noise + Random Luck
    // Rating is roughly 1000~2000. 
    const ratingA = fA.hidden.rating + (fA.form - 50) * 2 + rng.gaussian(0, 100);
    const ratingB = fB.hidden.rating + (fB.form - 50) * 2 + rng.gaussian(0, 100);
    
    let winnerId: string | null = null;
    
    // Draw chance: if ratings are very close (rare)
    if (Math.abs(ratingA - ratingB) < 5 && rng.next() < 0.02) {
        winnerId = null;
    } else {
        winnerId = ratingA > ratingB ? fA.id : fB.id;
    }

    const winner = winnerId === fA.id ? fA : fB;
    const loser = winnerId === fA.id ? fB : fA;

    // 2. Determine Method
    let method: 'KO_TKO' | 'SUB' | 'DEC' | 'DRAW' = 'DEC';
    let endRound = rounds;
    let timeStr = "5:00";

    if (!winnerId) {
        method = 'DRAW';
    } else {
        // Calculate style matchups for finish chance
        // KO: Atk Str vs Def Chin
        const koFactor = (winner.hidden.abilities.strOff * 1.5 + winner.hidden.abilities.chin * 0.5) 
                       - (loser.hidden.abilities.chin * 1.5 + loser.hidden.abilities.strDef * 0.5);
        
        // SUB: Atk Grp vs Def Grp
        const subFactor = (winner.hidden.abilities.grpOff * 2.0) - (loser.hidden.abilities.grpDef * 2.0);
        
        const roll = rng.next(); 
        // Base finish rates (approx)
        const baseProb = 0.3; // 30% finish total
        const koProb = 0.2 + (koFactor > 0 ? koFactor * 0.03 : -0.05); // +/- depending on diff
        const subProb = 0.1 + (subFactor > 0 ? subFactor * 0.03 : -0.05);
        
        // Normalize probabilities
        if (roll < Math.max(0.05, koProb)) {
            method = 'KO_TKO';
        } else if (roll < Math.max(0.05, koProb) + Math.max(0.05, subProb)) {
            method = 'SUB';
        } else {
            method = 'DEC';
        }
    }

    // 3. Round & Time
    if (method !== 'DEC' && method !== 'DRAW') {
        // Weighted towards later rounds? Or evenly?
        // Let's bias towards early finish for KO, late for SUB?
        // Simple random for MVP
        endRound = rng.int(1, rounds);
        
        const seconds = rng.int(10, 299);
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        timeStr = `${min}:${sec.toString().padStart(2, '0')}`;
    }

    return {
        winnerId,
        method,
        rounds: endRound,
        time: timeStr
    };
}

/**
 * Updates fighter records and status based on bout result.
 */
export function applyBoutResultToFighters(
    fighters: Record<string, Fighter>, 
    bout: Bout, 
    result: BoutResult,
    eventDay: number
) {
    const fA = fighters[bout.fighterAId];
    const fB = fighters[bout.fighterBId];
    if (!fA || !fB) return; // Should not happen

    // Update Last Fight & Cooldown
    fA.status.lastFightDay = eventDay;
    fB.status.lastFightDay = eventDay;
    fA.status.cooldown = 2; // Per requirement
    fB.status.cooldown = 2; // Per requirement

    // Update Records
    if (result.winnerId) {
        const winner = result.winnerId === fA.id ? fA : fB;
        const loser = result.winnerId === fA.id ? fB : fA;

        winner.record.w++;
        loser.record.l++;

        if (result.method === 'KO_TKO') {
            winner.record.koW++;
            loser.record.koL++;
        } else if (result.method === 'SUB') {
            winner.record.subW++;
            loser.record.subL++;
        } else if (result.method === 'DEC') {
            winner.record.decW++;
            loser.record.decL++;
        }
        
        // Rating Updates (Simplified ELO)
        const K = 32;
        // Expected score for Winner
        const qa = Math.pow(10, winner.hidden.rating / 400);
        const qb = Math.pow(10, loser.hidden.rating / 400);
        const ea = qa / (qa + qb);
        
        winner.hidden.rating += K * (1 - ea);
        loser.hidden.rating += K * (0 - (1 - ea));
        
        // Form Updates
        winner.form = Math.min(90, winner.form + 5);
        loser.form = Math.max(20, loser.form - 5);
    } else {
        // Draw - No W/L update as per current Type structure (no draw field)
        // Rating small adjust towards equal?
    }
}

/**
 * Applies the entire event result to the global game state.
 * - Promotion Finance
 * - Season Progress
 * - Time
 */
export function applyEventResultToState(state: GameState, event: Event) {
    const promId = event.promotionId;
    const prom = state.promotions[promId];
    
    if (prom) {
        // Apply Profit
        prom.budget.cash += event.finance.netProfit;
        // Apply Hype to Fanbase (Abstracted logic: 1 Hype ~ 10 Fans for now)
        prom.budget.fanbase += Math.floor(event.finance.hype * 5);
    }

    // Time Progression
    state.meta.nowDay += 21;

    // Season Progression
    state.season.eventsCompleted += 1;
    if (!state.season.events) {
        state.season.events = []; // Init if missing
    }
    state.season.events.push(event);
}
