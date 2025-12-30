import React from 'react';

export type PillColor = 'primary' | 'success' | 'danger' | 'warning' | 'neutral' | 'info';

interface PillTagProps {
  label: string;
  color?: PillColor;
  size?: 'sm' | 'md';
}

export const PillTag: React.FC<PillTagProps> = ({ label, color = 'neutral', size = 'md' }) => {
  const colorMap: Record<PillColor, string> = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    danger: 'var(--color-danger)',
    warning: '#f59e0b',
    neutral: '#6b7280',
    info: '#3b82f6'
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      borderRadius: '9999px',
      fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
      fontWeight: 500,
      backgroundColor: `${colorMap[color]}20`, // 20% opacity
      color: colorMap[color],
      border: `1px solid ${colorMap[color]}40`,
      lineHeight: 1,
      whiteSpace: 'nowrap'
    }}>
      {label}
    </span>
  );
};
