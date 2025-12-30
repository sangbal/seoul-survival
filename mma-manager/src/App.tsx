import React, { useState, useEffect } from 'react';
import { Home } from './ui/screens/Home';
import { Matchmaking } from './ui/screens/Matchmaking';
import { Roster } from './ui/screens/Roster';
import { League } from './ui/screens/League';
import { Settings } from './ui/screens/Settings';
import { EventDetail } from './ui/screens/EventDetail';
import { bootstrapGame } from './systems/bootstrapEngine';
import { GameState } from './domain/state';
import { Event } from './domain/types'; 
import { applyBoutResultToFighters, applyEventResultToState } from './systems/fightSim'; 
import { Layout } from './ui/components/Layout';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [view, setView] = useState<string>('home');
    const [pendingEvent, setPendingEvent] = useState<Event | null>(null);

    useEffect(() => {
        // In a real app, we'd try to load from localStorage first.
        // For now, always bootstrap if no state exists.
        const saved = localStorage.getItem('mma_manager_save');
        if (saved) {
            try {
                let parsed: GameState = JSON.parse(saved);
                // Migration: v0.1.1 Nickname check
                Object.values(parsed.fighters).forEach(f => {
                    if (typeof f.nickname === 'string') {
                         // @ts-ignore
                        f.nickname = { ko: f.nickname, en: f.nickname }; 
                    }
                });
                setGameState(parsed);
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
                        console.log('Event Booked:', event);
                        setPendingEvent(event);
                        setView('event');
                    }}
                />
            )}
            {view === 'event' && pendingEvent && (
                <EventDetail 
                    event={pendingEvent}
                    state={gameState}
                    onHome={() => setView('home')}
                    onSimulateComplete={(completedEvent) => {
                        setGameState(prev => {
                            if (!prev) return null;
                            const newState = { ...prev }; 
                             // Deep clone specific parts
                             newState.fighters = JSON.parse(JSON.stringify(prev.fighters)); 
                             newState.promotions = JSON.parse(JSON.stringify(prev.promotions));
                             newState.season = JSON.parse(JSON.stringify(prev.season));
                             newState.meta = { ...prev.meta };

                            // Apply logic using system helper
                            completedEvent.bouts.forEach(b => {
                                if (b.result) {
                                     applyBoutResultToFighters(newState.fighters, b, b.result, completedEvent.day);
                                }
                            });
                            
                            applyEventResultToState(newState, completedEvent);
                            
                            // Save to local storage for persistence
                            localStorage.setItem('mma_manager_save', JSON.stringify(newState));
                            
                            return newState;
                        });
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
                <Settings 
                    state={gameState}
                    onNavigate={handleNavigate} 
                    onRenamePromotion={(newName) => {
                         setGameState((prev) => {
                            if (!prev) return null;
                            const pid = prev.meta.playerPromotionId;
                            return {
                                ...prev,
                                promotions: {
                                    ...prev.promotions,
                                    [pid]: {
                                        ...prev.promotions[pid],
                                        name: newName
                                    }
                                }
                            };
                         });
                    }}
                />
            )}
            
            {/* Fallback for views not yet implemented */}
            {!['home', 'matchmaking', 'roster', 'league', 'settings', 'event'].includes(view) && (
                <div style={{ color: 'white' }}>
                    <h2>{view.charAt(0).toUpperCase() + view.slice(1)} Screen</h2>
                    <p>This screen is currently under development.</p>
                </div>
            )}
        </Layout>
    );
};

export default App;
