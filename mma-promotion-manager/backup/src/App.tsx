import React, { useState, useEffect } from 'react';
import { Home } from './ui/screens/Home';
import { Matchmaking } from './ui/screens/Matchmaking';
import { Roster } from './ui/screens/Roster'; // New
import { League } from './ui/screens/League'; // New
import { Settings } from './ui/screens/Settings';
import { bootstrapGame } from './systems/bootstrapEngine';
import { GameState } from './domain/state';
import { Layout } from './ui/components/Layout';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [view, setView] = useState<string>('home');

    useEffect(() => {
        // In a real app, we'd try to load from localStorage first.
        // For now, always bootstrap if no state exists.
        const saved = localStorage.getItem('mma_manager_save');
        if (saved) {
            try {
                setGameState(JSON.parse(saved));
            } catch (e) {
                const newState = bootstrapGame(Date.now());
                setGameState(newState);
            }
        } else {
            const newState = bootstrapGame(Date.now());
            setGameState(newState);
        }
    }, []);

    const handleNavigate = (page: string) => {
        setView(page);
    };

    if (!gameState) {
        return <div style={{ color: 'white', padding: '20px' }}>Loading Game Engine...</div>;
    }

    return (
        <Layout state={gameState} onNavigate={handleNavigate} activePage={view}>
            {view === 'home' && (
                <Home state={gameState} onNavigate={handleNavigate} />
            )}
            {view === 'matchmaking' && (
                <Matchmaking 
                    state={gameState} 
                    onNavigate={handleNavigate} 
                    onConfirmEvent={(event) => {
                        console.log('Event Confirmed:', event);
                        // P2: Persist event
                        const newEvent = { ...event }; 
                        // Update state
                        setGameState(prev => {
                            if (!prev) return null;
                            const events = prev.season.events || []; // Guard if missing
                            // Use dummy minimal update for MVP v0.1.1
                            return {
                                ...prev,
                                meta: { ...prev.meta, nowDay: prev.meta.nowDay + 21 },
                                season: { 
                                    ...prev.season, 
                                    eventsCompleted: prev.season.eventsCompleted + 1,
                                    events: [...(prev.season.events || []), newEvent] 
                                }
                            };
                        });
                        // Save to local storage
                        // localStorage.setItem('mma_manager_save', JSON.stringify(updatedState)); // Hard to access new state here without refactor
                        // For MVP P2, just memory state update is enough as per "persist in state" requirement
                        
                        setView('home'); 
                    }}
                />
            )}
            {view === 'roster' && (
                <Roster state={gameState} onNavigate={handleNavigate} />
            )}
            {view === 'league' && (
                <League state={gameState} onNavigate={handleNavigate} />
            )}
            {view === 'settings' && (
                <Settings onNavigate={handleNavigate} />
            )}
            
            {/* Fallback for views not yet implemented */}
            {!['home', 'matchmaking', 'roster', 'league', 'settings'].includes(view) && (
                <div style={{ color: 'white' }}>
                    <h2>{view.charAt(0).toUpperCase() + view.slice(1)} Screen</h2>
                    <p>This screen is currently under development.</p>
                </div>
            )}
        </Layout>
    );
};

export default App;
