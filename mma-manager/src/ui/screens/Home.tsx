import React from 'react';
import { GameState } from '../../domain/state';
import { Card } from '../components/Card';
import { StatRow, StatGrid } from '../components/StatRow';
import { ProgressBar } from '../components/ProgressBar';
import { PillTag } from '../components/PillTag';
import { t } from '../../i18n';

import { getSeasonTotalEvents, getSeasonProgress, isSeasonFinished } from '../../utils/season';

interface HomeProps {
  state: GameState;
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ state, onNavigate }) => {
  const playerProm = state.promotions[state.meta.playerPromotionId];
  if (!playerProm) return <div>Loading...</div>;

  const nextEventNum = state.season.eventsCompleted + 1;
  const seasonFinished = isSeasonFinished(state.season);
  const progressPct = getSeasonProgress(state.season);
  const totalEvents = getSeasonTotalEvents(state.season);
  
  // Sort promotions by Tier (asc) then Fanbase (desc)
  const sortedPromotions = Object.values(state.promotions).sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return b.budget.fanbase - a.budget.fanbase;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 최근 확정 이벤트 */}
      <Card title="최근 확정 이벤트">
        {state.season.events && state.season.events.length > 0 ? (() => {
          const last = state.season.events[state.season.events.length - 1];
          const boutCount = last.bouts?.length ?? 0;
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>{last.name || `이벤트 #${state.season.eventsCompleted}`}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>매치 {boutCount}개 확정</div>
            </div>
          );
        })() : (
          <div style={{ fontSize: 12, opacity: 0.7 }}>아직 확정된 이벤트가 없습니다. 매치메이킹에서 이벤트를 확정해보세요.</div>
        )}
      </Card>
      
      {/* Summary Row */}
      <StatGrid cols={3}>
        {/* A. My Status */}
        <Card title={t("Promotion Status")}>
            <StatRow label="Tier" value={`Tier ${playerProm.tier}`} highlight valueColor="var(--color-primary)" />
            <StatRow label="Cash" value={`₩${(playerProm.budget.cash / 100000000).toFixed(1)}억`} />
            <StatRow label={t("Fanbase")} value={playerProm.budget.fanbase.toLocaleString()} />
            <StatRow label={t("Roster Size")} value={Object.values(state.fighters).filter(f => f.status.promotionId === playerProm.id).length} />
        </Card>

        {/* B. Season Progress */}
        <Card title={t("Season Progress")} subTitle={`${state.meta.year} Season`}>
             <div style={{ padding: '16px 0'}}>
                <div style={{ marginBottom: '16px', fontSize: '2rem', fontWeight: 700, textAlign: 'center' }}>
                    {progressPct}%
                </div>
                <ProgressBar 
                    value={state.season.eventsCompleted} 
                    max={totalEvents} 
                    label={t("Events Completed")} 
                    height={12}
                />
             </div>
             <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                {seasonFinished ? (
                   <span style={{color: 'var(--color-warning)'}}>{t("Season Finished. Go to Season End.")}</span>
                ) : (
                   <span style={{color: 'var(--text-muted)'}}>{totalEvents - state.season.eventsCompleted} {t("events remaining")}</span>
                )}
             </div>
        </Card>

        {/* C. Next Event Action */}
        <Card title={t("Next Event")} badge={seasonFinished ? 'FINISHED' : 'PLANNING'} badgeColor={seasonFinished ? 'neutral' : 'success'}>
            {!seasonFinished ? (
                <>
                  {state.season.eventsCompleted > 0 && (
                      <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LAST COMPLETED: </span>
                          <span style={{ fontWeight: 600 }}>Event #{state.season.eventsCompleted}</span>
                      </div>
                  )}
                  <div style={{ marginBottom: '16px' }}>
                     <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t("Event #")}{nextEventNum}</div>
                     <div style={{ color: 'var(--text-muted)' }}>{t("Status: Planning")}</div>
                  </div>
                  
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                    onClick={() => onNavigate('matchmaking')}
                  >
                    {t("Go to Matchmaking")}
                  </button>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p>All events completed for this season.</p>
                    <button className="btn" onClick={() => onNavigate('season_end')}>{t("Proceed to Season End")}</button>
                </div>
            )}
        </Card>
      </StatGrid>

      {/* League Rankings */}
      <Card title={t("Global Promotion Rankings")}>
         <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '12px' }}>{t("Rank")}</th>
                  <th style={{ padding: '12px' }}>{t("Promotion")}</th>
                  <th style={{ padding: '12px' }}>{t("Tier")}</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>{t("Fanbase")}</th>
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