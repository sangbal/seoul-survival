import React from 'react';
import { Card } from './Card';
import { StatRow } from './StatRow';

interface FinancePreview {
  hype: number;
  attendance: number;
  ticketSales: number;
  sponsorIncome: number;
  fixedCost: number;
  payoutTotal: number;
  mercLoanFee: number;
  netProfit: number;
}

interface EventFinancePanelProps {
  finance: FinancePreview | null;
  onConfirm: () => void;
  canConfirm: boolean;
  confirmLabel?: string;
}

export const EventFinancePanel: React.FC<EventFinancePanelProps> = ({ 
  finance, 
  onConfirm, 
  canConfirm,
  confirmLabel = 'CONFIRM EVENT'
}) => {
  if (!finance) {
    return (
       <Card title="Event Forecast" className="finance-panel">
         <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Set up the Main Event to see financial forecast.
         </div>
       </Card>
    );
  }

  return (
    <Card title="Event Forecast" className="finance-panel">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <StatRow label="Projected Hype" value={finance.hype.toFixed(0)} />
        <StatRow label="Attendance" value={finance.attendance.toLocaleString()} />
        
        <div style={{ height: '16px' }} />
        
        <StatRow label="Ticket Sales" value={`+₩${(finance.ticketSales / 1000000).toFixed(0)}M`} valueColor="var(--color-success)" />
        <StatRow label="Sponsors" value={`+₩${(finance.sponsorIncome / 1000000).toFixed(0)}M`} valueColor="var(--color-success)" />
        <StatRow label="Fixed Cost" value={`-₩${(finance.fixedCost / 1000000).toFixed(0)}M`} />
        <StatRow label="Fighter Payouts" value={`-₩${(finance.payoutTotal / 1000000).toFixed(0)}M`} />
        
        <div style={{ height: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }} />
        
        <StatRow 
          label="Net Profit" 
          value={`₩${(finance.netProfit / 1000000).toFixed(0)}M`} 
          highlight 
          valueColor={finance.netProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)'} 
        />
        
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '24px', padding: '12px' }}
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Card>
  );
};
