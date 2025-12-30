import React from 'react';
import { GameState } from '../../domain/state';
import { formatMoney, formatNumber } from '../../utils'; // Need to ensure utils has these 

interface TopBarProps {
  state: GameState;
  on홈Click: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ state, on홈Click }) => {
  const playerProm = state.promotions[state.meta.playerPromotionId];

  return (
    <div className="top-bar" style={{
      height: '60px',
      background: 'rgba(11, 18, 32, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(8px)'
    }}>
      {/* Left: Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div 
          onClick={on홈Click} 
          style={{ 
            fontWeight: 800, 
            fontSize: '1.2rem', 
            cursor: 'pointer',
            background: 'linear-gradient(45deg, #fff, #aaa)',
            Webkit뒤로groundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          MMA MANAGER
        </div>
        <div style={{ 
          height: '24px', 
          width: '1px', 
          background: 'rgba(255,255,255,0.2)' 
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{playerProm?.name || 'Unknown'}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tier {playerProm?.tier}</span>
        </div>
      </div>

      {/* Center: 시즌 Progress */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
          SEASON {state.meta.year}
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          이벤트 {state.season.eventsCompleted} / {state.season.eventsPlanned}
        </div>
      </div>

      {/* Right: Resources */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
             ₩{(playerProm?.budget.cash / 100000000).toFixed(1)}억
           </div>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cash</div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
             {playerProm?.budget.fanbase.toLocaleString()}
           </div>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fanbase</div>
        </div>
        
        {/* 설정 Icon Placeholder */}
        <div style={{ cursor: 'pointer', opacity: 0.7 }}>
           ⚙️
        </div>
      </div>
    </div>
  );
};
