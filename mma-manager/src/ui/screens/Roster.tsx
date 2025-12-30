import React, { useState } from 'react';
import { GameState } from '../../domain/state';
import { Fighter, WeightClass } from '../../domain/types'; // Assumed types
import { Card } from '../components/Card';
import { PillTag } from '../components/PillTag';
import { FighterChip } from '../components/FighterChip';
import { WEIGHT_CLASSES } from '../../domain/constants';

interface RosterProps {
  state: GameState;
  onNavigate: (page: string) => void;
}

export const Roster: React.FC<RosterProps> = ({ state, onNavigate }) => {
  const playerPromId = state.meta.playerPromotionId;
  const myFighters = Object.values(state.fighters).filter(f => f.status.promotionId === playerPromId);

  // Filters
  const [filterWC, setFilterWC] = useState<WeightClass | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState<'tp' | 'form' | 'record'>('tp');

  // Filter & Sort
  const filteredFighters = myFighters
    .filter(f => filterWC === 'ALL' || f.weightClass === filterWC)
    .sort((a, b) => {
       if (sortKey === 'tp') return b.ticketPower - a.ticketPower;
       if (sortKey === 'form') return b.form - a.form;
       // Simple win count sort
       if (sortKey === 'record') return (b.record.w - b.record.l) - (a.record.w - a.record.l);
       return 0;
    });

  return (
    <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0 }}>선수단 Management</h2>
            <div style={{ color: 'var(--text-muted)' }}>{myFighters.length} Fighters</div>
        </div>

        {/* Filter Bar */}
        <Card className="filter-bar" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Weight Class:</span>
                    <button 
                         className={`btn-sm ${filterWC === 'ALL' ? 'active' : ''}`} 
                         onClick={() => setFilterWC('ALL')}
                    >ALL</button>
                    {WEIGHT_CLASSES.map(wc => (
                        <button 
                            key={wc} 
                            className={`btn-sm ${filterWC === wc ? 'active' : ''}`}
                            onClick={() => setFilterWC(wc)}
                        >
                            {wc}
                        </button>
                    ))}
                </div>
                
                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sort By:</span>
                    <select 
                        className="select-input" 
                        value={sortKey} 
                        onChange={(e) => setSortKey(e.target.value as any)}
                        style={{ background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px' }}
                    >
                        <option value="tp">Ticket Power</option>
                        <option value="form">Current Form</option>
                        <option value="record">Win Record</option>
                    </select>
                </div>
            </div>
        </Card>

        {/* Fighters Grid */}
        <div className="fighters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredFighters.map(f => (
                <Card key={f.id} className="fighter-card-item">
                    <div style={{ padding: '16px' }}>
                        <FighterChip fighter={f} showDetail />
                        
                        <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '12px 0' }} />
                        
                        {/* Stats Detail Grid (Public only) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                            <div className="stat-mini">
                                <span style={{color:'var(--text-muted)'}}>SLpM: </span>
                                {f.publicCareerStats.slpm.toFixed(1)}
                            </div>
                            <div className="stat-mini">
                                <span style={{color:'var(--text-muted)'}}>TD Avg: </span>
                                {f.publicCareerStats.tdPer15.toFixed(1)}
                            </div>
                            <div className="stat-mini">
                                <span style={{color:'var(--text-muted)'}}>Str.Def: </span>
                                {f.publicCareerStats.sigDef.toFixed(0)}%
                            </div>
                            <div className="stat-mini">
                                <span style={{color:'var(--text-muted)'}}>Sub.Avg: </span>
                                {f.publicCareerStats.subAttPer15.toFixed(1)}
                            </div>
                        </div>

                        {/* Action buttons? e.g. "Release" */}
                        {/* 
                         <div style={{ marginTop: '12px', textAlign: 'right' }}>
                            <button className="btn-xs btn-danger">Release</button>
                         </div>
                        */}
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};
