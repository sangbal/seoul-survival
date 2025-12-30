import React from 'react';
import { Fighter } from '../../domain/types';
import { FighterChip } from './FighterChip';

interface BoutCardProps {
  slotName: string;
  fighterA: Fighter | null;
  fighterB: Fighter | null;
  onSelectFighter: (side: 'A' | 'B') => void;
  prediction?: { probA: number, probB: number }; // Expert pick
  matchHype?: number;
  highlight?: boolean;
}

export const BoutCard: React.FC<BoutCardProps> = ({ 
  slotName, 
  fighterA, 
  fighterB, 
  onSelectFighter,
  prediction,
  matchHype,
  highlight
}) => {
  return (
    <div className={`bout-card ${highlight ? 'highlight' : ''}`} style={{ 
      background: 'rgba(255,255,255,0.05)', 
      borderRadius: '8px', 
      marginBottom: '12px',
      border: highlight ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '6px 12px', 
        background: 'rgba(0,0,0,0.2)', 
        fontSize: '0.8rem', 
        color: 'var(--text-muted)',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>{slotName}</span>
        {matchHype && <span>Hype: <span style={{color:'white'}}>{matchHype.toFixed(0)}</span></span>}
      </div>

      {/* Fighters Row */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
         {/* Fighter A */}
         <div style={{ flex: 1, padding: '12px', cursor: 'pointer', background: 'rgba(0,0,0,0.1)' }} onClick={() => onSelectFighter('A')}>
            {fighterA ? (
              <FighterChip fighter={fighterA} />
            ) : (
               <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>+ Select Fighter A</div>
            )}
         </div>

         {/* VS Center */}
         <div style={{ 
            width: '80px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(0,0,0,0.3)',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.2)'
         }}>
            VS
         </div>
         
         {/* Fighter B */}
         <div style={{ flex: 1, padding: '12px', cursor: 'pointer', background: 'rgba(0,0,0,0.1)' }} onClick={() => onSelectFighter('B')}>
            {fighterB ? (
              <FighterChip fighter={fighterB} />
            ) : (
               <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>+ Select Fighter B</div>
            )}
         </div>
      </div>

      {/* Expert Prediction Bar */}
      {prediction && fighterA && fighterB && (
         <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--text-muted)' }}>
               <span>Expert Pick</span>
               <span>{(prediction.probA * 100).toFixed(0)}% vs {(prediction.probB * 100).toFixed(0)}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
               <div style={{ width: `${prediction.probA * 100}%`, background: 'var(--color-primary)' }} />
               <div style={{ width: `${prediction.probB * 100}%`, background: 'var(--color-danger)' }} />
            </div>
         </div>
      )}
    </div>
  );
};
