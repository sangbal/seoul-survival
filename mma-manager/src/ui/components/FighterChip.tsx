import React from 'react';
import { Fighter } from '../../domain/types';
import { PillTag } from './PillTag';
import { formatFighterName } from '../utils/fighterName';

interface FighterChipProps {
  fighter: Fighter | null;
  showDetail?: boolean;
}

// Strictly hides hidden stats (CA/PA)
export const FighterChip: React.FC<FighterChipProps> = ({ fighter, showDetail = false }) => {
  if (!fighter) {
    return <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No Fighter Selected</div>;
  }

  // Calculate generic form indicator (e.g. A, B, C or 80+) based on form 
  // But spec says "form + cooldown".
  
  return (
    <div className="fighter-chip" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{formatFighterName(fighter)}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{fighter.record.w}-{fighter.record.l}</span>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', alignItems: 'center' }}>
        <PillTag label={fighter.weightClass} size="sm" />
        <span>TP: {fighter.ticketPower}</span>
        
        {/* Form and Condition */}
        <span style={{ 
          color: fighter.form > 70 ? 'var(--color-success)' : fighter.form < 50 ? 'var(--color-danger)' : 'var(--text)' 
        }}>
          Form: {fighter.form}
        </span>
        
        {fighter.status.cooldown > 0 && (
           <PillTag label={`Cooldown: ${fighter.status.cooldown}d`} color="warning" size="sm" />
        )}
      </div>

      {showDetail && (
        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
           <div>Win Rate: {fighter.record.w + fighter.record.l > 0 ? ((fighter.record.w / (fighter.record.w + fighter.record.l)) * 100).toFixed(0) : 0}%</div>
           <div>Age: {fighter.age}</div>
        </div>
      )}
    </div>
  );
};
