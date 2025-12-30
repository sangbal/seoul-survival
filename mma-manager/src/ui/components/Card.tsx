import React from 'react';

interface CardProps {
  title?: string;
  subTitle?: string;
  badge?: string;
  badgeColor?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  subTitle, 
  badge, 
  badgeColor = 'neutral',
  children, 
  className = '',
  action,
  style
}) => {
  return (
    <div className={`panel ${className}`} style={{ height: '100%', display: 'flex', flexDirection: 'column', ...style }}>
      {(title || action) && (
        <div className="card-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            {subTitle && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{subTitle}</span>
            )}
            {badge && (
              <span className={`tag tag-${badgeColor}`} style={{ fontSize: '0.75rem' }}>
                {badge}
              </span>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="card-body" style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export const Panel: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`panel ${className}`} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
      {children}
    </div>
  );
};
