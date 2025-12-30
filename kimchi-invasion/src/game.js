import { PRODUCTS, ITEMS, RESEARCH, GLOBAL_CONFIG, AM_UPGRADES, ACHIEVEMENTS } from './data.js';

export class Game {
    constructor() {
        this.cash = 0;
        this.enzyme = 0;
        this.am = 0; // Alien Matter
        this.lines = []; // Array of Line objects
        this.productInventory = {}; // { productId: { keep: 0, sell: 0, cap: 100 } }
        this.itemInventory = {}; // { itemId: count }
        this.completedResearch = []; // Array of research IDs
        this.amUpgrades = []; // Array of AM upgrade IDs
        this.completedAchievements = []; // Array of achievement IDs
        this.startBuffEndTime = 0;
        
        this.isResetting = false;

        // Auto-save loop handled by main.js, but we ensure data integrity here
    }

    init() {
        this.load();
        if (this.lines.length === 0) {
            this.initNewGame();
        } else {
             // Resume logic
        }
        this.ensureStarterLine();
    }

    ensureStarterLine() {
        // Softlock Protection: If 0 lines and 0 cash, user cannot play.
        // This handles edge cases where save data is valid but empty/broken.
        if (this.lines.length === 0 && this.cash < this.getLineCost()) {
            console.warn("Softlock detected: No lines and insufficient cash. Forcing starter line.");
            this.lines.push({
                id: Date.now(),
                productId: 'kimchi_1',
                slots: {
                    equipment: 'eq_mom_fridge', 
                    worker: 'wk_me',            
                    storage: 'lg_box',
                    transporter: 'tr_hand',
                    market: 'mk_neighborhood',
                    salesOrg: 'so_solo'
                },
                logisticsDir: 'keep',
                prodAccumulator: 0,
                sellAccumulator: 0
            });
            
            if (!this.productInventory['kimchi_1']) {
                 this.productInventory['kimchi_1'] = { keep: 0, sell: 0, cap: 100 };
            }
            this.save();
            alert("긴급 구조: 생산 라인이 유실되어 복구되었습니다.");
        }
    }

    initNewGame() {
        this.cash = 0;
        this.enzyme = 0;
        this.completedResearch = [];
        this.productInventory = {};
        this.itemInventory = {};
        
        // Default Items
        this.itemInventory['eq_mom_fridge'] = 1;
        this.itemInventory['wk_me'] = 1;
        this.itemInventory['lg_box'] = 1;
        this.itemInventory['tr_hand'] = 1;
        this.itemInventory['mk_neighborhood'] = 1;
        this.itemInventory['so_solo'] = 1;

        this.lines = [
            {
                id: Date.now(),
                productId: 'kimchi_1', // Baechu Kimchi
                slots: {
                    equipment: 'eq_mom_fridge', 
                    worker: 'wk_me',            
                    storage: 'lg_box',
                    transporter: 'tr_hand',
                    market: 'mk_neighborhood',
                    salesOrg: 'so_solo'
                },
                logisticsDir: 'keep', // 'keep' or 'sell' priority
                // Accumulators for smooth tick logic
                prodAccumulator: 0,
                sellAccumulator: 0
            }
        ];
        
        this.productInventory['kimchi_1'] = {
            keep: 0,
            sell: 0,
            cap: 100 // Basic cap
        };
        this.save();
    }

    // --- Persistence ---

    save() {
        if (this.isResetting) return;
        const data = {
            cash: this.cash,
            enzyme: this.enzyme,
            am: this.am,
            lines: this.lines,
            productInventory: this.productInventory,
            itemInventory: this.itemInventory,
            completedResearch: this.completedResearch,
            amUpgrades: this.amUpgrades,
            completedAchievements: this.completedAchievements,
            startBuffEndTime: this.startBuffEndTime
        };
        localStorage.setItem('kimchi_invasion_save_v1', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('kimchi-saved'));
    }

    load() {
        let raw = null;
        try {
            raw = localStorage.getItem('kimchi_invasion_save_v1');
        } catch (e) {
            console.error("Storage Access Error:", e);
        }

        if (raw) {
            try {
                const data = JSON.parse(raw);
                this.cash = data.cash || 0;
                this.enzyme = data.enzyme || 0;
                this.am = data.am || 0;
                this.lines = data.lines || [];
                
                // MIGRATION & SCHEMA ENFORCEMENT
                this.lines.forEach(line => {
                    if (!line.slots) line.slots = {};
                    
                    // Migration: logistics -> transporter
                    if (line.slots.logistics && !line.slots.transporter) {
                        line.slots.transporter = line.slots.logistics;
                        delete line.slots.logistics;
                    }
                    
                    // Fill default slots
                    if (!line.slots.equipment) line.slots.equipment = 'eq_mom_fridge';
                    if (!line.slots.worker) line.slots.worker = 'wk_me';
                    if (!line.slots.storage) line.slots.storage = 'lg_box';
                    if (!line.slots.transporter) line.slots.transporter = 'tr_hand';
                    if (!line.slots.market) line.slots.market = 'mk_neighborhood';
                    if (!line.slots.salesOrg) line.slots.salesOrg = 'so_solo';
                    
                    if ('logistics' in line.slots) delete line.slots.logistics;

                    if (!line.id) line.id = Date.now() + Math.random().toString(36).substr(2, 5);
                    
                    // Init Accumulators if missing
                    if (line.prodAccumulator === undefined) line.prodAccumulator = 0;
                    if (line.sellAccumulator === undefined) line.sellAccumulator = 0;
                });

                this.productInventory = data.productInventory || {};
                this.itemInventory = data.itemInventory || {};
                this.completedResearch = data.completedResearch || [];
                this.amUpgrades = data.amUpgrades || [];
                this.completedAchievements = data.completedAchievements || [];
                this.startBuffEndTime = data.startBuffEndTime || 0;
            } catch (e) {
                console.error("Save File Corrupted:", e);
                localStorage.setItem(`kimchi_invasion_save_broken_${Date.now()}`, raw);
                alert("저장된 데이터가 손상되어 초기화되었습니다. (백업 완료)");
                this.initNewGame();
            }
        }
    }

    // --- Core Loop ---

    tick(dt) {
        const amBuffs = this.getAMBuffs();
        const globalProdMult = amBuffs.prodSpeedMult * amBuffs.startBuffVal;

        this.lines.forEach(line => {
            const pId = line.productId;
            if (!pId) return;

            // Init entry if missing
            if (!this.productInventory[pId]) {
                this.productInventory[pId] = { keep: 0, sell: 0, cap: 100 };
            }
            
            // Update Cap based on AM Buffs & Storage
            let baseCap = 100;
            if (line.slots.storage && ITEMS[line.slots.storage]) {
                 // Base cap logic? Simply assume 100 for now or derive from storage?
                 // GDD says Storage gives 'moveBatch', but usually also Cap.
                 // Let's assume Storage tier * 100 for cap? Or just usage AM buffs.
                 // For now stick to safe default + AM
            }
            this.productInventory[pId].cap = Math.floor(baseCap * amBuffs.capMult);

            // 1. Auto Produce
            this.produceAuto(line, dt * globalProdMult, amBuffs);

            // 2. Auto Sell
            this.sellAuto(line, dt * amBuffs.sellSpeedMult, amBuffs);

            // 3. Auto Logistics
            this.moveAuto(line, dt * amBuffs.moveSpeedMult);
        });

        this.checkAchievements();
    }

    produceAuto(line, multiplier, amBuffs) {
        const pId = line.productId;
        const inv = this.productInventory[pId];

        // Production Speed from Worker
        let speedBase = 0;
        if (line.slots.worker && ITEMS[line.slots.worker]) {
            speedBase = ITEMS[line.slots.worker].effects.prodSpeed || 0;
        }

        if (speedBase <= 0) return;

        // Accumulate progress
        const productionRate = speedBase * multiplier; 
        // multiplier contains dt (sec)
        // productionRate is items per tick (if dt ~ 1/60)
        
        // Actually, let's treat it as progress towards 1 batch
        // Or items per second? 
        // 'prodSpeed': 1 means 1 batch per second? Let's assume so.
        
        line.prodAccumulator += productionRate;

        if (line.prodAccumulator >= 1) {
            if (!this.checkRecipe(pId, 1, amBuffs)) {
                line.prodAccumulator = 1; // Cap at ready state?
                return;
            }

            // Calculate Batch Size from Equipment
            let batch = 1;
            if (line.slots.equipment && ITEMS[line.slots.equipment]) {
                batch += (ITEMS[line.slots.equipment].effects.batch || 0);
            }

            // Produce
            const total = inv.keep + inv.sell;
            let added = batch;
            if (total + added > inv.cap) {
                added = inv.cap - total;
            }

            if (added > 0) {
                this.consumeRecipe(pId, 1, amBuffs);
                if (pId === 'enzyme_vial') {
                    this.enzyme += added;
                } else {
                    inv.keep += added;
                }
                // Reset accumulator (keep remainder)
                line.prodAccumulator -= 1; 
            } else {
                // Buffer full
                line.prodAccumulator = 1; 
            }
        }
    }

    sellAuto(line, multiplier, amBuffs) {
        const pId = line.productId;
        const inv = this.productInventory[pId];
        
        // Sell Speed from SalesOrg
        let speedBase = 0;
        if (line.slots.salesOrg && ITEMS[line.slots.salesOrg]) {
            speedBase = ITEMS[line.slots.salesOrg].effects.sellSpeed || 0;
        }

        if (speedBase <= 0) return;

        line.sellAccumulator += speedBase * multiplier;

        if (line.sellAccumulator >= 1) {
             // Calculate Sell Batch from Market
            let sellBatch = 1;
            if (line.slots.market && ITEMS[line.slots.market]) {
                sellBatch += (ITEMS[line.slots.market].effects.sellAmount || 0);
            }

            if (inv.sell >= sellBatch) {
                inv.sell -= sellBatch;
                this.cash += this.getProductPrice(pId) * sellBatch;
                line.sellAccumulator -= 1;
            } else if (inv.sell > 0) {
                // Sell remaining
                const actual = inv.sell;
                inv.sell = 0;
                this.cash += this.getProductPrice(pId) * actual;
                line.sellAccumulator -= 1; 
            } else {
                line.sellAccumulator = 1; // Wait for stock
            }
        }
    }

    moveAuto(line, multiplier) {
        // Logistics Speed from Transporter
        let speedBase = 0;
        if (line.slots.transporter && ITEMS[line.slots.transporter]) {
            speedBase = ITEMS[line.slots.transporter].effects.moveSpeed || 0; // GDD says moveSpeed
        }
        
        // For move, usually it's continuous or batch?
        // Let's make it batch based on 'moveBatch' from Storage, speed determines frequency?
        // Or simplify: moveSpeed * moveBatch per second.
        
        // Let's simply move multiplier * speed * batch
        
        let batch = 1;
        if (line.slots.storage && ITEMS[line.slots.storage]) {
            batch += (ITEMS[line.slots.storage].effects.moveBatch || 0);
        }
        
        const amount = speedBase * multiplier * batch; // items to move
        if (amount <= 0) return;

        const inv = this.productInventory[line.productId];
        if (!inv) return;

        if (line.logisticsDir === 'sell') {
            const actual = Math.min(amount, inv.keep);
            if (actual > 0) {
                inv.keep -= actual;
                inv.sell += actual;
            }
        } else {
            const actual = Math.min(amount, inv.sell);
            if (actual > 0) {
                inv.sell -= actual;
                inv.keep += actual;
            }
        }
    }

    // --- Actions ---

    produce(lineId) {
        // Manual Production
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return 0;
        const pId = line.productId;
        const inv = this.productInventory[pId];
        const amBuffs = this.getAMBuffs();

        if (!this.checkRecipe(pId, 1, amBuffs)) return -1; // -1 for error

        let batch = 1;
        if (line.slots.equipment && ITEMS[line.slots.equipment]) {
            batch += (ITEMS[line.slots.equipment].effects.batch || 0);
        }

        const total = inv.keep + inv.sell;
        let added = batch;
        if (total + added > inv.cap) {
            added = inv.cap - total;
        }

        if (added > 0) {
            this.consumeRecipe(pId, 1, amBuffs);
            if (pId === 'enzyme_vial') {
                this.enzyme += added;
            } else {
                inv.keep += added;
            }
            this.save();
            return added;
        }
        return 0;
    }

    sell(lineId) {
        // Manual Sell
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return 0;
        const pId = line.productId;
        const inv = this.productInventory[pId];
        
        let batch = 1;
        if (line.slots.market && ITEMS[line.slots.market]) {
            batch += (ITEMS[line.slots.market].effects.sellAmount || 0);
        }

        const price = this.getProductPrice(pId);
        let earned = 0;

        if (inv.sell >= batch) {
            inv.sell -= batch;
            earned = price * batch;
        } else if (inv.sell > 0) {
            earned = price * inv.sell;
            inv.sell = 0;
        }
        
        if (earned > 0) {
            this.cash += earned;
            this.save();
        }
        return earned;
    }

    moveLogistics(lineId, type) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        
        let batch = 1; 
        // Manual pump might move a full batch based on Storage tier
        if (line.slots.storage && ITEMS[line.slots.storage]) {
            batch += (ITEMS[line.slots.storage].effects.moveBatch || 0);
        }
        batch *= 5; // Manual pump is stronger?

        const inv = this.productInventory[line.productId];
        if (type === 'sell') {
            const actual = Math.min(batch, inv.keep);
            inv.keep -= actual;
            inv.sell += actual;
        } else {
            const actual = Math.min(batch, inv.sell);
            inv.sell -= actual;
            inv.keep += actual;
        }
        this.save();
    }

    toggleLogisticsDir(lineId) {
        const line = this.lines.find(l => l.id === lineId);
        if (line) {
            line.logisticsDir = line.logisticsDir === 'keep' ? 'sell' : 'keep';
            this.save();
        }
    }

    buyLine() {
        const cost = this.getLineCost();
        if (this.cash >= cost) {
            this.cash -= cost;
            const newId = Date.now() + Math.floor(Math.random()*1000);
            this.lines.push({
                id: newId,
                productId: null, 
                slots: {
                    equipment: 'eq_mom_fridge',
                    worker: 'wk_me',
                    storage: 'lg_box',
                    transporter: 'tr_hand',
                    market: 'mk_neighborhood',
                    salesOrg: 'so_solo'
                },
                logisticsDir: 'sell',
                prodAccumulator: 0,
                sellAccumulator: 0
            });
            this.save();
            return true;
        }
        return false;
    }

    removeLine(lineId) {
        // Refund logic
        const idx = this.lines.findIndex(l => l.id === lineId);
        if (idx > -1) {
            // Refund latest cost * 0.8
            // Ideally we refund the cost of *that* line, but simplified:
            // Refund = Current Cost for NEXT line * refund rate (Generous?)
            // Or Cost of LAST line bought.
            // Let's use getLineCost(current count - 1)
            const count = this.lines.length;
            const cost = GLOBAL_CONFIG.line_base_cost * Math.pow(GLOBAL_CONFIG.line_cost_growth, count - 1);
            const refund = cost * GLOBAL_CONFIG.refund_rate;
            
            this.cash += refund;
            this.lines.splice(idx, 1);
            this.save();
        }
    }

    buyAMUpgrade(id) {
        const upg = AM_UPGRADES[id];
        if (!upg) return false;
        if (this.amUpgrades.includes(id)) return false;
        if (this.am >= upg.cost) {
            this.am -= upg.cost;
            this.amUpgrades.push(id);
            this.save();
            return true;
        }
        return false;
    }

    // --- Helpers ---

    getLineCost() {
        // base * growth^(n)
        return GLOBAL_CONFIG.line_base_cost * Math.pow(GLOBAL_CONFIG.line_cost_growth, this.lines.length);
    }

    getProductPrice(pId) {
        if (!PRODUCTS[pId]) return 0;
        const amBuffs = this.getAMBuffs();
        return PRODUCTS[pId].price * amBuffs.priceMult;
    }

    checkRecipe(pId, multiplier, amBuffs) {
        const recipe = PRODUCTS[pId].recipe;
        if (!recipe) return true;
        
        for (const [ingId, reqAmount] of Object.entries(recipe)) {
            const cost = reqAmount * multiplier * (1 - amBuffs.costReduce);
            if (!this.productInventory[ingId] || this.productInventory[ingId].keep < cost) {
                return false;
            }
        }
        return true;
    }

    consumeRecipe(pId, multiplier, amBuffs) {
        const recipe = PRODUCTS[pId].recipe;
        if (!recipe) return;

        for (const [ingId, reqAmount] of Object.entries(recipe)) {
            const cost = reqAmount * multiplier * (1 - amBuffs.costReduce);
            if (this.productInventory[ingId]) {
                this.productInventory[ingId].keep -= cost;
            }
        }
    }

    getAMBuffs() {
        const buffs = {
            prodSpeedMult: 1,
            costReduce: 0,
            capMult: 1,
            moveSpeedMult: 1,
            sellSpeedMult: 1,
            priceMult: 1,
            researchEnzymeReduce: 0,
            researchCashReduce: 0,
            startCashMult: 1,
            startBuffVal: 1
        };

        this.amUpgrades.forEach(uid => {
            const upg = AM_UPGRADES[uid];
            if (!upg) return;
            if (upg.effects) {
                if (upg.effects.prodSpeedMult) buffs.prodSpeedMult *= upg.effects.prodSpeedMult;
                if (upg.effects.costReduce) buffs.costReduce += upg.effects.costReduce;
                if (upg.effects.capMult) buffs.capMult *= upg.effects.capMult;
                if (upg.effects.moveSpeedMult) buffs.moveSpeedMult *= upg.effects.moveSpeedMult;
                if (upg.effects.sellSpeedMult) buffs.sellSpeedMult *= upg.effects.sellSpeedMult;
                if (upg.effects.priceMult) buffs.priceMult *= upg.effects.priceMult;
            }
        });

        if (this.startBuffEndTime > Date.now()) {
            buffs.startBuffVal = 1.25; // Default hardcoded or check AM_UPGRADES['am_start_buff'] logic
        }

        return buffs;
    }

    checkAchievements() {
        Object.values(ACHIEVEMENTS).forEach(ach => {
            if (this.completedAchievements.includes(ach.id)) return;
            let unlocked = false;
            
            // Re-implement basic checks
            if (ach.id === 'a01') { // First Produce
                 const p1 = this.productInventory['kimchi_1'];
                 if (p1 && (p1.keep > 0 || p1.sell > 0)) unlocked = true;
            }
            if (ach.id === 'a02') { // Sell 10
                 // Needs statistics tracking 'totalSold'. For now ignore or check cash?
                 // Simple hack: if cash > 50000 (approx 10 sales)
                 if (this.cash > 50000) unlocked = true;
            }
            // ... more checks would go here based on ids ...
            
            if (unlocked) {
                this.completedAchievements.push(ach.id);
                this.save();
                window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: ach }));
            }
        });
    }

    hasAchievement(id) {
        return this.completedAchievements.includes(id);
    }

    prestige() {
        this.am += 1;
        const amBuffs = this.getAMBuffs();

        // Soft Reset
        this.cash = 0; // Or start cash buff
        // Check am_start_cash
        const amStartCash = AM_UPGRADES['am_start_cash'];
        if (this.amUpgrades.includes('am_start_cash')) {
             // Logic says +50% start cash... but start cash is 0?
             // Maybe it means keep 50%? Or gives a flat amount?
             // GDD says "Prestige后 Start Cash +50%".
             // We'll give a bonus 1,000,000 for prestige for now.
             this.cash = 1000000; 
        }

        this.enzyme = 0;
        this.completedResearch = [];
        this.productInventory = {};
        // Keep itemInventory? Usually prestige resets items too
        this.itemInventory = {}; 
        
        // Handle Start Buff
        if (this.amUpgrades.includes('am_start_buff')) {
             this.startBuffEndTime = Date.now() + 300000;
        }

        this.initNewGame(); // resets lines and basic inv
        
        alert("Prestige Successful! Earned 1 AM.");
        location.reload();
    }
    
    // Stats
    getEnterpriseValue() {
        return this.cash + this.getInventoryValue() + this.getAssetValue();
    }
    getInventoryValue() {
         return Object.entries(this.productInventory).reduce((sum, [pId, inv]) => {
             return sum + (inv.keep + inv.sell) * (PRODUCTS[pId]?.price || 0);
         }, 0);
    }
    getAssetValue() {
        // Simplify: just sum of line costs paid
        // Or loop through lines
        return this.lines.length * 100000; // Placeholder
    }
}
