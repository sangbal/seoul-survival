import React from 'react';
import { TopBar } from './TopBar';
import { GameState } from '../../domain/state';

interface LayoutProps {
  children: React.ReactNode;
  state: GameState;
  onNavigate: (page: string) => void;
  activePage: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, state, onNavigate, activePage }) => {
  const MENU_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'matchmaking', label: 'Matchmaking' },
    { id: 'roster', label: 'Roster' },
    { id: 'league', label: 'League' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="layout" style={{ minHeight: '100vh', background: '#0b1220', color: '#e2e8f0' }}>
      <TopBar state={state} onHomeClick={() => onNavigate('home')} />
      
      <div className="layout-body" style={{ display: 'flex', maxWidth: '1440px', margin: '0 auto', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar Navigation */}
        <nav className="sidebar" style={{ 
          width: '240px', 
          padding: '24px 0',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                background: activePage === item.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                color: activePage === item.id ? '#38bdf8' : '#94a3b8',
                border: 'none',
                borderLeft: activePage === item.id ? '3px solid #38bdf8' : '3px solid transparent',
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '0.95rem',
                fontWeight: activePage === item.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <main className="main-content" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
