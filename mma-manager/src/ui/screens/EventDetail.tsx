import React, { useEffect, useState } from 'react';
import { Event } from '../../domain/types';
import { GameState } from '../../domain/state';
import { simulateBout } from '../../systems/fightSim';
import { Card } from '../components/Card';
import { t } from '../../i18n';
import { formatFighterName } from '../utils/fighterName';
import { RNG } from '../../systems/rng';

interface EventDetailProps {
    event: Event;
    state: GameState;
    onHome: () => void;
    onSimulateComplete: (event: Event) => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, state, onHome, onSimulateComplete }) => {
    const [simulatedEvent, setSimulatedEvent] = useState<Event | null>(null);
    const [isSimulating, setIsSimulating] = useState(true);

    useEffect(() => {
        if (event.status === 'COMPLETED') {
            setSimulatedEvent(event);
            setIsSimulating(false);
            return;
        }

        // Run Simulation
        const runSim = () => {
            const rng = new RNG(event.day); // Seed with day
            const newEvent = JSON.parse(JSON.stringify(event)) as Event;
            
            newEvent.bouts.forEach(b => {
                const fA = state.fighters[b.fighterAId];
                const fB = state.fighters[b.fighterBId];
                if (fA && fB) {
                    const res = simulateBout(fA, fB, b.rounds, rng);
                    b.result = res;
                    b.isCompleted = true;
                }
            });

            newEvent.status = 'COMPLETED';
            
            setSimulatedEvent(newEvent);
            setIsSimulating(false);
            onSimulateComplete(newEvent);
        };

        // Small delay for UX
        const timer = setTimeout(runSim, 600);
        return () => clearTimeout(timer);
    }, [event]); // eslint-disable-line react-hooks/exhaustive-deps



    if (isSimulating || !simulatedEvent) {
        return (
            <div className="fade-in" style={{ padding: '60px', textAlign: 'center' }}>
                <h2>{t("Simulating Event...")}</h2>
                <div style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
                    {event.name} @ {t("Day")} {event.day}
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>{simulatedEvent.name}</h2>
                    <div style={{ color: 'var(--text-muted)' }}>{t("Results")}</div>
                </div>
                <button className="btn btn-primary" onClick={onHome}>
                    {t("Continue Season")}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {simulatedEvent.bouts.map((bout, idx) => {
                    const fA = state.fighters[bout.fighterAId];
                    const fB = state.fighters[bout.fighterBId];
                    
                    const res = bout.result;
                    if (!res || !fA || !fB) return null;

                    const winnerId = res.winnerId;
                    const methodText = res.method === 'KO_TKO' ? 'KO/TKO' : res.method;
                    
                    return (
                        <Card key={idx} style={{ padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', alignItems: 'center', textAlign: 'center' }}>
                                {/* Fighter A */}
                                <div style={{ 
                                    textAlign: 'right', 
                                    fontWeight: winnerId === fA.id ? 'bold' : 'normal',
                                    color: winnerId === fA.id ? 'var(--color-success)' : 'inherit',
                                    opacity: winnerId !== null && winnerId !== fA.id ? 0.6 : 1
                                }}>
                                    <div style={{ fontSize: '1.4rem' }}>{formatFighterName(fA)}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {fA.record.w}-{fA.record.l} ({fA.record.koW} KO)
                                    </div>
                                </div>
                                
                                {/* Result */}
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>VS</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-accent)' }}>
                                        {methodText}
                                    </span>
                                    <span style={{ fontSize: '0.9rem' }}>R{res.rounds} {res.time}</span>
                                </div>
                                
                                {/* Fighter B */}
                                <div style={{ 
                                    textAlign: 'left', 
                                    fontWeight: winnerId === fB.id ? 'bold' : 'normal',
                                    color: winnerId === fB.id ? 'var(--color-success)' : 'inherit',
                                    opacity: winnerId !== null && winnerId !== fB.id ? 0.6 : 1
                                }}>
                                    <div style={{ fontSize: '1.4rem' }}>{formatFighterName(fB)}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {fB.record.w}-{fB.record.l} ({fB.record.koW} KO)
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
            
            <div style={{ marginTop: '40px', textAlign: 'center', padding: '20px', background: 'rgba(0,255,100,0.05)', borderRadius: '8px' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {t("Event Net Profit")}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: simulatedEvent.finance.netProfit > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {simulatedEvent.finance.netProfit > 0 ? '+' : ''}
                    {(simulatedEvent.finance.netProfit / 100000000).toFixed(1)}억원
                    {/* Using simple formatting here, will refine with helper if possible */}
                </div>
            </div>
        </div>
    );
};
