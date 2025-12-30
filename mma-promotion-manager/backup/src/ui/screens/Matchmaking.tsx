import React, { useState, useEffect } from 'react';
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
  const canConfirm = isComplete && !isCashNegative;

  const eventHype = financePreview?.hype || 0;

  // Filtered Roster for Selection
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
                <h2 style={{ margin: 0 }}>Event #{state.season.eventsCompleted + 1} Matchmaking</h2>
                <div style={{ color: 'var(--text-muted)' }}>
                    {state.meta.year} Season • Planning Phase
                    <span style={{ marginLeft: '12px' }} className="tag tag-neutral">
                        Target Date: Day {state.meta.nowDay + 21}
                    </span>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <div className="stat-badge">
                   <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginRight: '8px' }}>Total Hype</span>
                   <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{eventHype.toFixed(0)}</span>
                </div>
            </div>
        </div>

        {isCashNegative && (
            <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                <strong>Insufficient Funds:</strong> You cannot book new events while in debt. Please resolve finances (Reset Run available in Settings).
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
                    canConfirm={canConfirm} 
                    onConfirm={() => onConfirmEvent({} as Event)}
                    confirmLabel={isCashNegative ? "FUNDS LOCKED" : "CONFIRM EVENT"}
                />

                {/* Validation Panel */}
                {(!isComplete || isCashNegative) && (
                    <Card title="Requirements" badge="INCOMPLETE" badgeColor="warning">
                        <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <li style={{ color: bouts.every(b => b.fighterAId && b.fighterBId) ? 'var(--color-success)' : 'inherit' }}>
                                All 6 bouts filled
                            </li>
                            <li style={{ color: !isCashNegative ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                Positive Cash Balance
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
                <Card title={`Select ${EVENT_WEIGHT_PLAN[selectingSlot.idx]} Fighter`} className="modal-content" style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                        <h3>{selectingSlot.side === 'A' ? 'Red Corner' : 'Blue Corner'} ({EVENT_WEIGHT_PLAN[selectingSlot.idx]})</h3>
                        <button className="btn" onClick={() => setSelectingSlot(null)}>Close</button>
                    </div>
                    
                    <div className="fighter-list" style={{ overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {getEligibleFighters().length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No eligible fighters found in this weight class ({EVENT_WEIGHT_PLAN[selectingSlot.idx]}) with 0 cooldown.
                            </div>
                        )}
                        {getEligibleFighters().map(f => {
                            const isSelected = bouts.some(b => b.fighterAId === f.id || b.fighterBId === f.id);
                            
                            return (
                                <div 
                                    key={f.id} 
                                    onClick={() => !isSelected && handleSelectFighter(f.id)}
                                    style={{
                                        padding: '12px',
                                        background: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                                        opacity: isSelected ? 0.5 : 1,
                                        cursor: isSelected ? 'not-allowed' : 'pointer',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{f.nickname}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {f.weightClass} • {f.record.w}-{f.record.l}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem' }}>Form: {f.form}</div>
                                        <div style={{ fontSize: '0.8rem' }}>TP: {f.ticketPower}</div>
                                    </div>
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
