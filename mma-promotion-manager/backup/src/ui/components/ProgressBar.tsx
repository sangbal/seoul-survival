import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  label, 
  showValue = true, 
  color = 'var(--color-primary)',
  height = 8 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div style={{ width: '100%' }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
          {label && <span>{label}</span>}
          {showValue && <span>{value} / {max}</span>}
        </div>
      )}
      <div style={{ 
        width: '100%', 
        height: `${height}px`, 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: `${height}px`,
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${percentage}%`, 
          height: '100%', 
          background: color, 
          transition: 'width 0.5s ease-out' 
        }} />
      </div>
    </div>
  );
};
