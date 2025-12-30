import React from 'react';
import { Card } from './Card';
import { StatRow } from './StatRow';
import { t } from '../../i18n';

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

// Helper for KRW formatting
const formatKRW = (val: number) => {
  const abs = Math.abs(val);
  const sign = val >= 0 ? '+' : '-';
  
  if (abs >= 100000000) {
    // 억원
    return `${sign}${(abs / 100000000).toFixed(1)}억원`;
  } else {
    // 만원
    return `${sign}${(abs / 10000).toFixed(0)}만원`;
  }
};

export const EventFinancePanel: React.FC<EventFinancePanelProps> = ({ 
  finance, 
  onConfirm, 
  canConfirm,
  confirmLabel = 'CONFIRM EVENT'
}) => {
  const confirmText = confirmLabel === 'CONFIRM EVENT' ? t("CONFIRM EVENT") : t(confirmLabel); // Try to translate default

  if (!finance) {
    return (
       <Card title={t("Event Forecast")} className="finance-panel">
         <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {t("Set up Main Event to see forecast")}
         </div>
       </Card>
    );
  }

  return (
    <Card title={t("Event Forecast")} className="finance-panel">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <StatRow label={t("Projected Hype")} value={finance.hype.toFixed(0)} />
        <StatRow label={t("Attendance")} value={finance.attendance.toLocaleString()} />
        
        <div style={{ height: '16px' }} />
        
        <StatRow label={t("Ticket Sales")} value={formatKRW(finance.ticketSales)} valueColor="var(--color-success)" />
        <StatRow label={t("Sponsors")} value={formatKRW(finance.sponsorIncome)} valueColor="var(--color-success)" />
        <StatRow label={t("Fixed Cost")} value={formatKRW(-finance.fixedCost)} />
        <StatRow label={t("Fighter Payouts")} value={formatKRW(-finance.payoutTotal)} />
        
        <div style={{ height: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }} />
        
        <StatRow 
          label={t("Net Profit")} 
          value={formatKRW(finance.netProfit)} 
          highlight 
          valueColor={finance.netProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)'} 
        />
        
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '24px', padding: '12px' }}
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </Card>
  );
};
