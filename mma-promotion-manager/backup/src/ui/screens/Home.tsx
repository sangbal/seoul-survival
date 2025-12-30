import React from 'react';
import { GameState } from '../../domain/state';
import { Card } from '../components/Card';
import { StatRow, StatGrid } from '../components/StatRow';
import { ProgressBar } from '../components/ProgressBar';
import { PillTag } from '../components/PillTag';

interface HomeProps {
  state: GameState;
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ state, onNavigate }) => {
  const playerProm = state.promotions[state.meta.playerPromotionId];
  if (!playerProm) return <div>Loading...</div>;

  const nextEventNum = state.season.eventsCompleted + 1;
  const isSeasonFinished = state.season.eventsCompleted >= state.season.eventsPlanned;
  
  // Sort promotions by Tier (asc) then Fanbase (desc)
  const sortedPromotions = Object.values(state.promotions).sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return b.budget.fanbase - a.budget.fanbase;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Summary Row */}
      <StatGrid cols={3}>
        {/* A. My Status */}
        <Card title="Promotion Status">
            <StatRow label="Tier" value={`Tier ${playerProm.tier}`} highlight valueColor="var(--color-primary)" />
            <StatRow label="Cash" value={`₩${(playerProm.budget.cash / 100000000).toFixed(1)}억`} />
            <StatRow label="Fanbase" value={playerProm.budget.fanbase.toLocaleString()} />
            <StatRow label="Roster Size" value={Object.values(state.fighters).filter(f => f.status.promotionId === playerProm.id).length} />
        </Card>

        {/* B. Season Progress */}
        <Card title="Season Progress" subTitle={`${state.meta.year} Season`}>
             <div style={{ padding: '16px 0'}}>
                <div style={{ marginBottom: '16px', fontSize: '2rem', fontWeight: 700, textAlign: 'center' }}>
                    {(state.season.eventsCompleted / state.season.eventsPlanned * 100).toFixed(0)}%
                </div>
                <ProgressBar 
                    value={state.season.eventsCompleted} 
                    max={state.season.eventsPlanned} 
                    label="Events Completed" 
                    height={12}
                />
             </div>
             <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                {isSeasonFinished ? (
                   <span style={{color: 'var(--color-warning)'}}>Season Finished. Go to Season End.</span>
                ) : (
                   <span style={{color: 'var(--text-muted)'}}>{state.season.eventsPlanned - state.season.eventsCompleted} events remaining</span>
                )}
             </div>
        </Card>

        {/* C. Next Event Action */}
        <Card title="Next Event" badge={isSeasonFinished ? 'FINISHED' : 'PLANNING'} badgeColor={isSeasonFinished ? 'neutral' : 'success'}>
            {!isSeasonFinished ? (
                <>
                  {state.season.eventsCompleted > 0 && (
                      <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LAST COMPLETED: </span>
                          <span style={{ fontWeight: 600 }}>Event #{state.season.eventsCompleted}</span>
                      </div>
                  )}
                  <div style={{ marginBottom: '16px' }}>
                     <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Event #{nextEventNum}</div>
                     <div style={{ color: 'var(--text-muted)' }}>Status: Planning</div>
                  </div>
                  
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                    onClick={() => onNavigate('matchmaking')}
                  >
                    Go to Matchmaking
                  </button>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p>All events completed for this season.</p>
                    <button className="btn" onClick={() => onNavigate('season_end')}>Proceed to Season End</button>
                </div>
            )}
        </Card>
      </StatGrid>

      {/* League Rankings */}
      <Card title="Global Promotion Rankings">
         <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '12px' }}>Rank</th>
                  <th style={{ padding: '12px' }}>Promotion</th>
                  <th style={{ padding: '12px' }}>Tier</th>
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
                      <td style={{ padding: '12px', textAlign: 'right' }}>{p.budget.fanbase.toLocaleString()}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </Card>
    </div>
  );
};
