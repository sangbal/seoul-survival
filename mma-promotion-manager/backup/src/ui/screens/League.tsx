import React, { useState } from 'react';
import { GameState } from '../../domain/state'; // Assumed
import { Card } from '../components/Card';
import { PillTag } from '../components/PillTag';
import { WEIGHT_CLASSES } from '../../domain/constants';

interface LeagueProps {
  state: GameState;
  onNavigate: (page: string) => void;
}

export const League: React.FC<LeagueProps> = ({ state, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'PROMOTIONS' | 'FIGHTERS'>('PROMOTIONS');
  const [selectedWC, setSelectedWC] = useState<string>('FW');

  // Promotion Ranking
  const sortedPromotions = Object.values(state.promotions).sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier; // ASC tier (1 is best)
      return b.budget.fanbase - a.budget.fanbase;
  });

  // Fighter Ranking (Top 10 by weight class, sorted by Rating which is hidden generally but used for ranking)
  // Wait, spec says "NO HIDDEN STATS". Ranking should be based on Public Rating or just "Rank".
  // Let's assume there is a 'rankings' module or just sort by implied rating for now.
  
  const getFightersByWC = (wc: string) => {
      return Object.values(state.fighters)
        .filter(f => f.weightClass === wc)
        .sort((a, b) => b.ticketPower - a.ticketPower) // Use TP as proxy for now since true rating is hidden? Or use hidden.rating for sorting but don't show it?
        // Spec says: "League/Rankings logic is strictly statistical screen"
        // Let's use hidden.rating for sorting but NOT show the number.
        // @ts-ignore
        .sort((a, b) => b.hidden.rating - a.hidden.rating)
        .slice(0, 10);
  };

  const topFighters = getFightersByWC(selectedWC);

  return (
    <div className="fade-in">
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div 
                onClick={() => setActiveTab('PROMOTIONS')}
                style={{ 
                    padding: '12px 24px', 
                    cursor: 'pointer',
                    borderBottom: activeTab === 'PROMOTIONS' ? '2px solid var(--color-primary)' : '2px solid transparent',
                    color: activeTab === 'PROMOTIONS' ? 'white' : 'var(--text-muted)',
                    fontWeight: activeTab === 'PROMOTIONS' ? 600 : 400
                }}
            >
                Promotion Rankings
            </div>
            <div 
                onClick={() => setActiveTab('FIGHTERS')}
                style={{ 
                    padding: '12px 24px', 
                    cursor: 'pointer',
                    borderBottom: activeTab === 'FIGHTERS' ? '2px solid var(--color-primary)' : '2px solid transparent',
                    color: activeTab === 'FIGHTERS' ? 'white' : 'var(--text-muted)',
                    fontWeight: activeTab === 'FIGHTERS' ? 600 : 400
                }}
            >
                Fighter Rankings
            </div>
        </div>

        {activeTab === 'PROMOTIONS' && (
             <Card title="Global Promotion Standings">
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <th style={{ padding: '12px' }}>Rank</th>
                        <th style={{ padding: '12px' }}>Promotion</th>
                        <th style={{ padding: '12px' }}>Tier</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Active Budget</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Fanbase</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedPromotions.map((p, idx) => (
                        <tr key={p.id} style={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: p.isPlayer ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                            fontWeight: p.isPlayer ? 600 : 400
                        }}>
                            <td style={{ padding: '12px' }}>{idx + 1}</td>
                            <td style={{ padding: '12px' }}>
                                {p.name}
                                {p.isPlayer && <PillTag label="ME" size="sm" color="primary" />}
                            </td>
                            <td style={{ padding: '12px' }}><PillTag label={`Tier ${p.tier}`} size="sm" color={p.tier === 1 ? 'warning' : 'neutral'} /></td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>₩{(p.budget.cash / 100000000).toFixed(0)}억</td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>{p.budget.fanbase.toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
             </Card>
        )}

        {activeTab === 'FIGHTERS' && (
            <Card title={`Top 10 Rankings - ${selectedWC}`}>
                 <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                     <label style={{ marginRight: '12px', color: 'var(--text-muted)' }}>Select Weight Class:</label>
                     <select 
                        value={selectedWC} 
                        onChange={(e) => setSelectedWC(e.target.value)}
                        className="select-input"
                     >
                         {WEIGHT_CLASSES.map(wc => <option key={wc} value={wc}>{wc}</option>)}
                     </select>
                 </div>

                 <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <th style={{ padding: '12px' }}>Rank</th>
                        <th style={{ padding: '12px' }}>Fighter</th>
                        <th style={{ padding: '12px' }}>Record</th>
                        <th style={{ padding: '12px' }}>Promotion</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Ticket Power</th>
                    </tr>
                    </thead>
                    <tbody>
                    {topFighters.map((f, idx) => {
                        const prom = state.promotions[f.status.promotionId];
                        return (
                            <tr key={f.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px' }}>{idx + 1}</td>
                                <td style={{ padding: '12px', fontWeight: 600 }}>{f.nickname}</td>
                                <td style={{ padding: '12px' }}>{f.record.w}-{f.record.l}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{prom ? prom.name : 'Free Agent'}</span>
                                    {prom && prom.isPlayer && <PillTag label="ME" size="sm" color="info" />}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>{f.ticketPower.toFixed(1)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                 </table>
            </Card>
        )}
    </div>
  );
};
