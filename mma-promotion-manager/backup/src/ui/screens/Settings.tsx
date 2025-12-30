import React from 'react';
import { Card } from '../components/Card';
import { StatRow } from '../components/StatRow';

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const handleSave = () => {
     // Logic to trigger save in App
     alert('Save triggered (Placeholder)');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset current run?')) {
        localStorage.removeItem('mma_manager_save');
        window.location.reload();
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
       <h2 style={{ marginBottom: '24px' }}>Settings</h2>
       
       <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
         <Card title="Data Management">
            <div style={{ padding: '20px', display: 'flex', gap: '16px' }}>
               <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }}>
                  Save Game (Local)
               </button>
               <button className="btn" style={{ flex: 1 }} disabled title="Coming in Phase 6">
                  Cloud Load (Supabase)
               </button>
            </div>
            <div style={{ padding: '0 20px 20px 20px' }}>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  * Current version supports browser local storage only.
               </p>
            </div>
         </Card>

         <Card title="Developer Zone" badge="DANGER" badgeColor="danger">
            <div style={{ padding: '20px' }}>
               <StatRow label="Version" value="v0.1.0-alpha" />
               <StatRow label="Engine Seed" value="12345" />
               
               <div style={{ marginTop: '24px' }}>
                  <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleReset}>
                     Reset Run (Hard Delete)
                  </button>
               </div>
            </div>
         </Card>
       </div>
    </div>
  );
};
