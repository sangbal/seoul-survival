import React from 'react';

interface StatRowProps {
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
  valueColor?: string;
}

export const StatRow: React.FC<StatRowProps> = ({ label, value, subValue, highlight, valueColor }) => {
  return (
    <div className={`stat-row ${highlight ? 'highlight' : ''}`} style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 600, color: valueColor || 'inherit' }}>{value}</div>
        {subValue && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subValue}</div>
        )}
      </div>
    </div>
  );
};

export const StatGrid: React.FC<{ children: React.ReactNode, cols?: number }> = ({ children, cols = 2 }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${cols}, 1fr)`, 
      gap: '16px' 
    }}>
      {children}
    </div>
  );
};
