import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { StatRow } from '../components/StatRow';
import { GameState } from '../../domain/state';
import { t } from '../../i18n';

interface SettingsProps {
  state: GameState;
  onNavigate: (page: string) => void;
  onRenamePromotion: (newName: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ state, onNavigate, onRenamePromotion }) => {
  const playerProm = state.promotions[state.meta.playerPromotionId];
  const [promName, setPromName] = useState(playerProm?.name || '');

  useEffect(() => {
    if (playerProm) {
      setPromName(playerProm.name);
    }
  }, [playerProm?.name]);

  const handleSaveName = () => {
    const trimmed = promName.trim();
    if (trimmed.length < 2) {
      alert("Name must be at least 2 characters");
      return;
    }
    onRenamePromotion(trimmed);
    alert(t("Saved"));
  };

  const handleSaveGame = () => {
      if (state) {
        localStorage.setItem('mma_manager_save', JSON.stringify(state));
        alert(t("Saved"));
      }
  };

  const handleReset = () => {
    if (confirm(t("Confirm Reset"))) {
        localStorage.removeItem('mma_manager_save');
        window.location.reload();
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
       <h2 style={{ marginBottom: '24px' }}>{t("Game Settings")}</h2>
       
       <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
         
         {/* P3: Promotion Renaming */}
         <Card title={t("My Promotion Name")}>
            <div style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
               <div style={{ flex: 1 }}>
                   <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>
                       {t("New Name")}
                   </label>
                   <input 
                      type="text" 
                      className="text-input"
                      value={promName}
                      onChange={(e) => setPromName(e.target.value)}
                      style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                   />
               </div>
               <button className="btn btn-primary" onClick={handleSaveName} style={{ height: '44px' }}>
                  {t("Save")}
               </button>
            </div>
         </Card>

         <Card title={t("Data Management") || "Data Management"}>
            <div style={{ padding: '20px', display: 'flex', gap: '16px' }}>
               <button className="btn btn-primary" onClick={handleSaveGame} style={{ flex: 1 }}>
                  {t("Save Game (Local)")}
               </button>
               <button className="btn" style={{ flex: 1 }} disabled title="Coming in Phase 6">
                  {t("Cloud Load")}
               </button>
            </div>
            <div style={{ padding: '0 20px 20px 20px' }}>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t("Local Storage Only")}
               </p>
            </div>
         </Card>

         <Card title={t("Developer Area") || "Developer Area"} badge="DANGER" badgeColor="danger">
            <div style={{ padding: '20px' }}>
               <StatRow label={t("Version")} value="v0.1.1" />
               <StatRow label={t("Engine Seed")} value={`${state.seed}`} />
               
               <div style={{ marginTop: '24px' }}>
                  <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleReset}>
                     {t("Reset Run (Hard Delete)")}
                  </button>
               </div>
            </div>
         </Card>
       </div>
    </div>
  );
};
