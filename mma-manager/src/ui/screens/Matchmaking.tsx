import React, { useState, useEffect } from 'react';
import { uuidv4 } from '../../utils';
import { GameState } from '../../domain/state';
import { Fighter, Bout, Event } from '../../domain/types';
import { EVENT_SLOTS } from '../../domain/constants';
import { EVENT_WEIGHT_PLAN, MATCHMAKING_CONSTANTS } from '../../balance/matchmaking'; // New safe defaults
import { calculateExpertPick, calculateMatchHype } from '../../systems/matchmakingEngine';
import { calculateEventFinance } from '../../systems/economyEngine';
import { BoutCard } from '../components/BoutCard';
import { EventFinancePanel } from '../components/EventFinancePanel';
import { Card } from '../components/Card';
import { PillTag } from '../components/PillTag';
import { t } from '../../i18n';
import { getNicknameParts } from '../utils/fighterName';

interface MatchmakingProps {
  state: GameState;
  onNavigate: (page: string) => void;
  onConfirmEvent: (event: Event) => void;
}

export const Matchmaking: React.FC<MatchmakingProps> = ({ state, onNavigate, onConfirmEvent }) => {
  const playerPromId = state.meta.playerPromotionId;
  const playerProm = state.promotions[playerPromId];
  
  // Local state
  const [bouts, setBouts] = useState<Partial<Bout>[]>(
    EVENT_SLOTS.map((_, idx) => ({ 
        fighterAId: '', 
        fighterBId: '',
        // Guardrail: Bind weight class from safe defaults
        weightClass: EVENT_WEIGHT_PLAN[idx] 
    }))
  );
  const [financePreview, setFinancePreview] = useState<any>(null);
  
  // Fighter Selection Modal State
  const [selectingSlot, setSelectingSlot] = useState<{idx: number, side: 'A' | 'B'} | null>(null);
  const [expandedFighterId, setExpandedFighterId] = useState<string | null>(null);

  // Auto Match Handler
  const handleAutoMatch = () => {
      const newBouts: Partial<Bout>[] = JSON.parse(JSON.stringify(bouts));
      const takenIds = new Set<string>();

      // Mark currently selected fighters as taken to avoid replacing them if partial fill?
      // Prompt says "Fill 6 matches automatically". I'll reset and fill all for optimal results.
      // But preserving manual picks is nice. I'll respect existing picks and `takenIds`.
      newBouts.forEach(b => {
          if (b.fighterAId) takenIds.add(b.fighterAId);
          if (b.fighterBId) takenIds.add(b.fighterBId);
      });

      EVENT_SLOTS.forEach((_, idx) => {
          const b = newBouts[idx];
          if (b.fighterAId && b.fighterBId) return; // Already filled

          const wc = EVENT_WEIGHT_PLAN[idx];
          const candidates = Object.values(state.fighters)
            .filter(f => f.status.promotionId === playerPromId 
                    && f.weightClass === wc 
                    && f.status.cooldown === 0
                    && !takenIds.has(f.id));
          
          // Sort by Ticket Power (Desc)
          candidates.sort((x, y) => y.ticketPower - x.ticketPower);
          
          // Take top candidates and find best hype pair
          const pool = candidates.slice(0, 12); // Top 12 enough for 1 pair
          
          let bestPair = null;
          let maxHype = -1;

          // If one side is already picked, find best partner
          if (b.fighterAId && !b.fighterBId) {
             // ... simplify: Just fill empty slots
          }

          // Full empty slot logic
          if (!b.fighterAId && !b.fighterBId) {
              for (let i=0; i<pool.length; i++) {
                  for (let j=i+1; j<pool.length; j++) {
                      const h = calculateMatchHype(pool[i], pool[j]);
                      if (h > maxHype) {
                          maxHype = h;
                          bestPair = [pool[i], pool[j]];
                      }
                  }
              }
              
              if (bestPair) {
                  b.fighterAId = bestPair[0].id;
                  b.fighterBId = bestPair[1].id;
                  takenIds.add(bestPair[0].id);
                  takenIds.add(bestPair[1].id);
              }
          }
           // Partial fill logic (if A is set)
          else if (b.fighterAId && !b.fighterBId) {
              const fA = state.fighters[b.fighterAId];
              for (const cand of pool) {
                  const h = calculateMatchHype(fA, cand);
                  if (h > maxHype) {
                      maxHype = h;
                      b.fighterBId = cand.id;
                  }
              }
              if (b.fighterBId) takenIds.add(b.fighterBId);
          }
          else if (!b.fighterAId && b.fighterBId) {
             const fB = state.fighters[b.fighterBId];
             for (const cand of pool) {
                 const h = calculateMatchHype(cand, fB);
                 if (h > maxHype) {
                     maxHype = h;
                     b.fighterAId = cand.id;
                 }
             }
             if (b.fighterAId) takenIds.add(b.fighterAId);
          }
      });
      
      setBouts(newBouts);
  };

  const handleConfirmEventAction = () => {
    if (!financePreview || !can확정) return;

    const finalBouts: Bout[] = bouts.map((b, i) => {
        const fA = state.fighters[b.fighterAId!];
        const fB = state.fighters[b.fighterBId!];
        return {
            id: uuidv4(),
            fighterAId: b.fighterAId!,
            fighterBId: b.fighterBId!,
            weightClass: EVENT_WEIGHT_PLAN[i],
            rounds: i === 0 ? 5 : 3,
            isTitle: false,
            isMainEvent: i === 0,
            isCompleted: false,
            expertPick: calculateExpertPick(fA, fB),
            hype: calculateMatchHype(fA, fB)
        };
    });

    const finalEvent: Event = {
       id: `evt_${state.season.eventsCompleted + 1}_${Date.now()}`,
       promotionId: playerPromId,
       name: `Event ${state.season.eventsCompleted + 1}`,
       day: state.meta.nowDay + 21,
       venueId: 'default',
       status: 'BOOKED', // Ready to be simulated
       bouts: finalBouts,
       finance: financePreview
    };
    
    onConfirmEvent(finalEvent);
  };

  // Recalculate Logic
  useEffect(() => {
    const validBouts: Bout[] = [];
    bouts.forEach((b, idx) => {
      if (b.fighterAId && b.fighterBId && b.fighterAId !== b.fighterBId) {
        const fA = state.fighters[b.fighterAId];
        const fB = state.fighters[b.fighterBId];
        if (fA && fB) {
           validBouts.push({
             id: `temp_bout_${idx}`,
             fighterAId: fA.id, 
             fighterBId: fB.id,
             // Guardrail: Force fixed weight class
             weightClass: EVENT_WEIGHT_PLAN[idx],
             rounds: idx === 0 ? 5 : 3,
             isTitle: false,
             isMainEvent: idx === 0,
             isCompleted: false,
           });
        }
      }
    });

    // Guardrail: Recalculate finance only if valid
    if (validBouts.length > 0) {
      const tempEvent: Event = {
        id: 'temp_event',
        promotionId: playerPromId,
        name: `Event ${state.season.eventsCompleted + 1}`,
        day: state.meta.nowDay + 30, // Guardrail: +30 (Or +21 as per updated rule, but UI is just preview)
        venueId: 'default',
        status: 'PLANNING',
        bouts: validBouts,
        // Guardrail: Safe defaults for finance object
        finance: { ticketSales: 0, sponsorIncome: 0, fixedCost: 0, payoutTotal: 0, mercLoanFee: 0, netProfit: 0, attendance: 0, hype: 0 }
      };
      
      const fin = calculateEventFinance(tempEvent, playerProm, state.fighters);
      // Guardrail: Force mercLoanFee to 0 for MVP
      fin.mercLoanFee = 0; 
      setFinancePreview(fin);
    } else {
      setFinancePreview(null);
    }
  }, [bouts, state.fighters, playerPromId, playerProm, state.season.eventsCompleted, state.meta.nowDay]);

  // Handlers
  const handleSelectFighter = (fId: string) => {
    if (!selectingSlot) return;
    const newBouts = [...bouts];
    // @ts-ignore
    newBouts[selectingSlot.idx][selectingSlot.side === 'A' ? 'fighterAId' : 'fighterBId'] = fId;
    setBouts(newBouts);
    setSelectingSlot(null);
  };

  const isComplete = bouts.every(b => b.fighterAId && b.fighterBId);
  // Guardrail: Check negative cash
  const isCashNegative = playerProm.budget.cash < 0; // Strict bankruptcy check? No, prompt says allow negative, but block NEXT event?
  // User Prompt: "음수인 상태에서는 다음 이벤트 확정 불가"
  // So if current cash is negative, disable confirm.
  const can확정 = isComplete && !isCashNegative;

  const eventHype = financePreview?.hype || 0;

  // Filtered 선수단 for Selection
  const getEligibleFighters = () => {
      if (!selectingSlot) return [];
      const requiredWC = EVENT_WEIGHT_PLAN[selectingSlot.idx];
      
      return Object.values(state.fighters)
        .filter(f => f.status.promotionId === playerPromId)
        .filter(f => f.weightClass === requiredWC) // Strict WC match
        .filter(f => f.status.cooldown === 0) // Strict Cooldown check
        .sort((a, b) => b.ticketPower - a.ticketPower);
  };

  return (
    <div className="fade-in">
        {/* Header */}
        <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' 
        }}>
            <div>
                <h2 style={{ margin: 0 }}>{t("Event #")}{state.season.eventsCompleted + 1} {t("Matchmaking")}</h2>
                <div style={{ color: 'var(--text-muted)' }}>
                    {state.meta.year} {t("Season")} • {t("Planning Phase")}
                    <span style={{ marginLeft: '12px' }} className="tag tag-neutral">
                        {t("Target Date: Day")} {state.meta.nowDay + 21}
                    </span>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={handleAutoMatch}>
                    {t("Auto Match")}
                </button>
                <div className="stat-badge">
                   <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginRight: '8px' }}>{t("Total Hype")}</span>
                   <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{eventHype.toFixed(0)}</span>
                </div>
            </div>
        </div>

        {isCashNegative && (
            <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                <strong>{t("Insufficient Funds Warning")}</strong>
            </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '24px' }}>
            
            {/* Left: Bouts List */}
            <div className="bouts-list">
                {EVENT_SLOTS.map((slot, idx) => {
                    const b = bouts[idx];
                    const fA = b.fighterAId ? state.fighters[b.fighterAId] : null;
                    const fB = b.fighterBId ? state.fighters[b.fighterBId] : null;
                    const requiredWC = EVENT_WEIGHT_PLAN[idx];
                    
                    let prediction = undefined;
                    let matchHype = undefined;
                    if (fA && fB) {
                        prediction = calculateExpertPick(fA, fB);
                        matchHype = calculateMatchHype(fA, fB);
                    }

                    return (
                        <div key={idx} style={{ position: 'relative' }}>
                            <div style={{ 
                                position: 'absolute', top: '8px', left: '-80px', 
                                width: '70px', textAlign: 'right', fontSize: '0.75rem', 
                                color: 'var(--text-muted)', fontWeight: 600 
                            }}>
                                {requiredWC}
                            </div>
                            <BoutCard 
                                slotName={slot}
                                fighterA={fA}
                                fighterB={fB}
                                onSelectFighter={(side) => setSelectingSlot({ idx, side })}
                                prediction={prediction}
                                matchHype={matchHype}
                                highlight={idx === 0}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Right: Validation & Finance */}
            <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <EventFinancePanel 
                    finance={financePreview} 
                    canConfirm={can확정} 
                    onConfirm={handleConfirmEventAction}
                    confirmLabel={isCashNegative ? t("FUNDS LOCKED") : t("CONFIRM EVENT")}
                />

                {/* Validation Panel */}
                {(!isComplete || isCashNegative) && (
                    <Card title={t("Requirements")} badge="INCOMPLETE" badgeColor="warning">
                        <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <li style={{ color: bouts.every(b => b.fighterAId && b.fighterBId) ? 'var(--color-success)' : 'inherit' }}>
                                {t("All 6 bouts filled")}
                            </li>
                            <li style={{ color: !isCashNegative ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                {t("Positive Cash Balance")}
                            </li>
                            <li>No duplicate fighters allowed.</li>
                        </ul>
                    </Card>
                )}
            </div>
        </div>

        {/* Fighter Selection Modal */}
        {selectingSlot && (
            <div className="modal-overlay" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)', zIndex: 1000,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                <Card title={`${t("Select Fighter")} (${EVENT_WEIGHT_PLAN[selectingSlot.idx]})`} className="modal-content" style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                        <h3>{selectingSlot.side === 'A' ? t("Red Corner") : t("Blue Corner")} ({EVENT_WEIGHT_PLAN[selectingSlot.idx]})</h3>
                        <button className="btn" onClick={() => setSelectingSlot(null)}>{t("Close")}</button>
                    </div>
                    
                    <div className="fighter-list" style={{ overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {getEligibleFighters().length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                {t("No eligible fighters found")} ({EVENT_WEIGHT_PLAN[selectingSlot.idx]})
                            </div>
                        )}
                        {getEligibleFighters().map(f => {
                            const isSelected = bouts.some(b => b.fighterAId === f.id || b.fighterBId === f.id);
                            const isExpanded = expandedFighterId === f.id;
                            return (
                                <div key={f.id} style={{ display: 'flex', flexDirection: 'column', background: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                    
                                    <div 
                                        style={{
                                            padding: '12px',
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 80px 60px 60px 40px',
                                            alignItems: 'center',
                                            cursor: isSelected ? 'not-allowed' : 'pointer',
                                            opacity: isSelected ? 0.5 : 1
                                        }}
                                        onClick={() => !isSelected && handleSelectFighter(f.id)}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600 }}>
                                                {(() => {
                                                    const { ko, en } = getNicknameParts(f);
                                                    return (
                                                        <>
                                                            {ko} 
                                                            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 400}}>
                                                                {en ? `(${en})` : ''}
                                                            </span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {f.country} • {f.age}세 • {f.weightClass} • {f.record.w}승 {f.record.l}패
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem' }}>TP {f.ticketPower}</div>
                                        <div style={{ fontSize: '0.85rem' }}>Form {f.form}</div>
                                        <div style={{ fontSize: '0.85rem' }}>
                                             {/* Hype/Form visual? just text for now */}
                                        </div>
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); setExpandedFighterId(isExpanded ? null : f.id); }}
                                            style={{ cursor: 'pointer', textAlign: 'center', color: 'var(--color-accent)' }}
                                        >
                                            {isExpanded ? '▲' : '▼'}
                                        </div>
                                    </div>

                                    {/* Expanded Detail */}
                                    {isExpanded && (
                                        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <div>
                                                    <h5 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)' }}>Abilities</h5>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.85rem' }}>
                                                        <div>StrOff: {f.hidden.abilities.strOff}</div>
                                                        <div>StrDef: {f.hidden.abilities.strDef}</div>
                                                        <div>GrpOff: {f.hidden.abilities.grpOff}</div>
                                                        <div>GrpDef: {f.hidden.abilities.grpDef}</div>
                                                        <div>Cardio: {f.hidden.abilities.cardio}</div>
                                                        <div>Chin: {f.hidden.abilities.chin}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)' }}>Career Stats</h5>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.85rem' }}>
                                                        <div>SLPM: {f.publicCareerStats.slpm.toFixed(2)}</div>
                                                        <div>SApM: {f.publicCareerStats.sapm.toFixed(2)}</div>
                                                        <div>Acc: {f.publicCareerStats.sigAcc.toFixed(0)}%</div>
                                                        <div>Def: {f.publicCareerStats.sigDef.toFixed(0)}%</div>
                                                        <div>TD/15: {f.publicCareerStats.tdPer15.toFixed(1)}</div>
                                                        <div>Sub/15: {f.publicCareerStats.subAttPer15.toFixed(1)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        )}
    </div>
  );
};
