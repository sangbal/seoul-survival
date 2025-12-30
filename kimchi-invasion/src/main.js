
import { Game } from './game.js';
import { UI } from './ui.js';

// Init
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    const ui = new UI(game);

    // Debug
    window.game = game;
    window.ui = ui;

    // Initial render
    game.init();
    ui.init();

    // Start tick loop
    let lastTime = performance.now();
    function loop(currentTime) {
        const dt = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        game.tick(dt);
        ui.update();
        
        // Periodic Save (e.g., every 1s) if changes occurred
        if (game.hasAutomatedChanges) {
             const now = Date.now();
             if (!game.lastSaveTime || now - game.lastSaveTime > 1000) {
                 game.save();
                 game.lastSaveTime = now;
                 game.hasAutomatedChanges = false;
             }
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
});
