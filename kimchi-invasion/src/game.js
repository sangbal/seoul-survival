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
        this.isResetting = false;
        
        // Start Buff Timer (for Prestige QoL)
        this.startBuffEndTime = 0;

        this.init();
        this.isResetting = false; // Flag to prevent auto-save during reset
    }

    init() {
        this.load();
        if (this.lines.length === 0) {
            this.initNewGame();
        }
    }

    initNewGame() {
        this.cash = 0;
        this.enzyme = 0;
        this.completedResearch = [];
        this.productInventory = {};
        this.itemInventory = {};
        
        // GDD: T1 Defaults for all 6 slots
        this.itemInventory['eq_mom_fridge'] = 1;
        this.itemInventory['wk_me'] = 1;
        this.itemInventory['lg_box'] = 1;
        this.itemInventory['tr_hand'] = 1;
        this.itemInventory['mk_neighborhood'] = 1;
        this.itemInventory['so_solo'] = 1;

        // Init Line 1 (Kimchi)
        this.lines = [
            {
                id: 1,
                productId: 'kimchi_1', // Baechu Kimchi
                slots: {
                    equipment: 'eq_mom_fridge', 
                    worker: 'wk_me',            
                    storage: 'lg_box',
                    transporter: 'tr_hand',
                    market: 'mk_neighborhood',
                    salesOrg: 'so_solo'
                },
                logisticsDir: 'keep' // 'keep' or 'sell' priority
            }
        ];
        
        // Init Inventory for Kimchi 1
        this.productInventory['kimchi_1'] = {
            keep: 0,
            sell: 0,
            cap: 100 // Basic cap
        };
    }

    // ... (getAMBuffs remains same)

    tick(dt) {
        const amBuffs = this.getAMBuffs();
        const globalProdMult = amBuffs.prodSpeedMult * amBuffs.startBuffVal;

        // Automation Logic
        this.lines.forEach(line => {
            const pId = line.productId;
            if (!pId) return;

            // Update Cap based on AM Buffs
            const product = PRODUCTS[pId];
            let baseCap = 100;
            this.productInventory[pId].cap = Math.floor(baseCap * amBuffs.capMult);

            // 1. Auto Produce (Worker -> Speed)
            const wkId = line.slots.worker;
            if (wkId && ITEMS[wkId]) {
                let prodSpeed = (ITEMS[wkId].effects.prodSpeed || 0) * globalProdMult;
                
                if (prodSpeed > 0) {
                    if (!line.prodAccumulator) line.prodAccumulator = 0;
                    line.prodAccumulator += prodSpeed * dt;
                    
                    if (line.prodAccumulator >= 1) {
                        const count = Math.floor(line.prodAccumulator);
                        this.produceAuto(line.id, count, amBuffs);
                        line.prodAccumulator -= count;
                    }
                }
            }

            // 2. Auto Sell (SalesOrg -> Speed)
            const soId = line.slots.salesOrg; // Changed from market to salesOrg based on user req (Worker=Speed)
            if (soId && ITEMS[soId]) {
                 let sellSpeed = (ITEMS[soId].effects.sellSpeed || 0) * amBuffs.sellSpeedMult;
                 
                 if (sellSpeed > 0) {
                    if (!line.sellAccumulator) line.sellAccumulator = 0;
                    line.sellAccumulator += sellSpeed * dt;

                    if (line.sellAccumulator >= 1) {
                        const count = Math.floor(line.sellAccumulator);
                        this.sellAuto(line.id, count, amBuffs);
                        line.sellAccumulator -= count;
                    }
                 }
            }

            // 3. Auto Logistics (Transporter -> Speed)
            const trId = line.slots.transporter; // Changed from logistics to transporter
            if (trId && ITEMS[trId]) {
                let moveSpeed = (ITEMS[trId].effects.moveSpeed || 0) * amBuffs.moveSpeedMult;
                
                if (moveSpeed > 0) {
                    if (!line.logiAccumulator) line.logiAccumulator = 0;
                    line.logiAccumulator += moveSpeed * dt;
                    if (line.logiAccumulator >= 1) {
                        const count = Math.floor(line.logiAccumulator);
                        this.moveAuto(line.id, count); // count is multiplier (ticks)
                        line.logiAccumulator -= count;
                    }
                }
            }
        });

        this.checkAchievements();
    }
    
    // ... (checkAchievements, hasAchievement, isItemEquipped, checkRecipe, consumeRecipe match logic)

    moveAuto(lineId, multiplier) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        const inv = this.productInventory[line.productId];
        
        let batch = 1;
        const stId = line.slots.storage;
        if (stId && ITEMS[stId]) {
            batch += (ITEMS[stId].effects.moveBatch || 0);
        }
        
        const amount = batch * multiplier;

        if (line.logisticsDir === 'sell') {
            const actual = Math.min(amount, inv.keep);
            if (actual > 0) {
                inv.keep -= actual;
                inv.sell += actual;
                this.hasAutomatedChanges = true;
            }
        } else {
            const actual = Math.min(amount, inv.sell);
            if (actual > 0) {
                inv.sell -= actual;
                inv.keep += actual;
                this.hasAutomatedChanges = true;
            }
        }
    }

    produceAuto(lineId, multiplier, amBuffs) {
        // ... (This function looks OK in original, uses 'equipment' for batch)
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        const pId = line.productId;
        const inv = this.productInventory[pId];

        if (!this.checkRecipe(pId, multiplier, amBuffs)) return; // Pass multiplier to check recipe for full batch
        
        let batch = 1; 
        const eqId = line.slots.equipment;
        if (eqId && ITEMS[eqId]) {
            batch += (ITEMS[eqId].effects.batch || 0);
        }
        
        const amountToProduce = batch * multiplier;
        // ... (rest logic is fine: cap check, consume, add)
        // Re-implementing briefly to ensure context consistency
        const total = inv.keep + inv.sell;
        let added = amountToProduce;
        if (total + added > inv.cap) {
            added = inv.cap - total;
        }

        if (added > 0) {
            this.consumeRecipe(pId, multiplier, amBuffs);
            if (pId === 'enzyme_vial') {
                this.enzyme += added;
            } else {
                inv.keep += added;
            }
            this.hasAutomatedChanges = true; 
        }
    }

    sellAuto(lineId, multiplier, amBuffs) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        const pId = line.productId;
        const inv = this.productInventory[pId];
        
        let sellAmountBase = 1;
        const mkId = line.slots.market; // Changed from salesOrg to market (Facility -> Batch)
        if (mkId && ITEMS[mkId]) {
             sellAmountBase += (ITEMS[mkId].effects.sellAmount || 0);
        }
        
        const totalSell = sellAmountBase * multiplier;
        const price = this.getProductPrice(pId);

        if (inv.sell >= totalSell) {
            inv.sell -= totalSell;
            this.cash += price * totalSell;
            this.hasAutomatedChanges = true;
        } else if (inv.sell > 0) {
            const actual = inv.sell;
            inv.sell = 0;
            this.cash += price * actual;
            this.hasAutomatedChanges = true;
        }
    }

    // ... (getProductPrice)

    produce(lineId) {
        // Manual Produce: uses Equipment Batch
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return 0;
        
        const pId = line.productId;
        const inv = this.productInventory[pId];
        const amBuffs = this.getAMBuffs();

        if (!this.checkRecipe(pId, 1, amBuffs)) return -1;
        
        let batch = 1;
        const eqId = line.slots.equipment;
        if (eqId && ITEMS[eqId]) {
            batch += (ITEMS[eqId].effects.batch || 0);
        }
        // ... (rest logic same as previous)
        const total = inv.keep + inv.sell;
        
        if (total >= inv.cap) {
            return 0; // Cap Full
        }

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

    moveLogistics(lineId, toTarget) { 
        // Manual Move: uses Storage Batch
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        
        const pId = line.productId;
        const inv = this.productInventory[pId];
        const amBuffs = this.getAMBuffs();

        let amount = 1; 
        const stId = line.slots.storage; // Changed to storage (Facility -> Batch)
        if (stId && ITEMS[stId]) {
            let base = (ITEMS[stId].effects.moveBatch || 0);
            if (base === 0) base = 1;
            amount += Math.floor(base * amBuffs.moveSpeedMult); // Apply speed mult to manual batch for QoL? Or maybe separate "Hand Limit"? Let's stick to batch logic.
            // Actually moveBatch is raw capacity.
        }

        if (toTarget === 'sell') {
            if (inv.keep >= amount) {
                inv.keep -= amount;
                inv.sell += amount;
                this.save();
                return true;
            }
        } else if (toTarget === 'keep') {
            if (inv.sell >= amount) {
                inv.sell -= amount;
                inv.keep += amount;
                this.save();
                return true;
            }
        }
        return false;
    }

    sell(lineId) {
        // Manual Sell: uses Market Batch (Amount)
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        
        const pId = line.productId;
        const inv = this.productInventory[pId];
        
        let amount = 1; 
        const mkId = line.slots.market; // Changed to market
        if (mkId && ITEMS[mkId]) {
            amount += (ITEMS[mkId].effects.sellAmount || 0);
        }
        
        if (inv.sell >= amount) {
            inv.sell -= amount;
            const price = this.getProductPrice(pId); 
            this.cash += price * amount;
            this.save();
            return price * amount;
        }
        return 0;
    }

    // ...

    prestige() {
        this.am += 1;
        const amBuffs = this.getAMBuffs();
        
        if (amBuffs.startCashMult > 1) {
            this.cash = 1000000 * amBuffs.startCashMult; 
        } else {
            this.cash = 1000000;
        }
        
        this.enzyme = 0;
        this.completedResearch = [];
        this.productInventory = {};
        this.itemInventory = {};
        
        if (amBuffs.startBuffDuration && amBuffs.startBuffDuration > 0) {
            this.startBuffEndTime = Date.now() + amBuffs.startBuffDuration;
        }

        this.lines = [
            {
                id: 1,
                productId: 'kimchi_1',
                slots: {
                    equipment: 'eq_mom_fridge',
                    worker: 'wk_me',
                    storage: 'lg_box',
                    transporter: 'tr_hand',
                    market: 'mk_neighborhood',
                    salesOrg: 'so_solo'
                },
                logisticsDir: 'keep'
            }
        ];
        this.itemInventory['eq_mom_fridge'] = 1;
        this.itemInventory['wk_me'] = 1;
        this.itemInventory['lg_box'] = 1;
        this.itemInventory['tr_hand'] = 1;
        this.itemInventory['mk_neighborhood'] = 1;
        this.itemInventory['so_solo'] = 1;

        this.productInventory['kimchi_1'] = { keep: 0, sell: 0, cap: 100 };

        alert("스타김치십이 발사되었습니다! 외계물질(AM) 1을 획득했습니다. 새로운 규칙에서 다시 시작합니다.");
        this.save();
        location.reload(); 
    }

    // ...

    buyLine() {
        const cost = this.getLineCost();
        if (this.cash >= cost) {
            this.cash -= cost;
            const newId = this.lines.reduce((max, l) => Math.max(max, l.id), 0) + 1;
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
                logisticsDir: 'sell'
            });
            this.save();
            return true;
        }
        return false;
    }

    getAMBuffs() {
        const buffs = {
            prodSpeedMult: 1,
            costReduce: 0, // 0.1 = 10% reduction
            capMult: 1,
            moveSpeedMult: 1,
            sellSpeedMult: 1,
            priceMult: 1,
            researchEnzymeReduce: 0,
            researchCashReduce: 0,
            startCashMult: 1,
            startBuffVal: 1 // For temp start buff
        };

        this.amUpgrades.forEach(uid => {
            const upg = AM_UPGRADES[uid];
            if (!upg) return;
            if (upg.effects.prodSpeedMult) buffs.prodSpeedMult *= upg.effects.prodSpeedMult;
            if (upg.effects.costReduce) buffs.costReduce += upg.effects.costReduce;
            if (upg.effects.capMult) buffs.capMult *= upg.effects.capMult;
            if (upg.effects.moveSpeedMult) buffs.moveSpeedMult *= upg.effects.moveSpeedMult;
            if (upg.effects.sellSpeedMult) buffs.sellSpeedMult *= upg.effects.sellSpeedMult;
            if (upg.effects.priceMult) buffs.priceMult *= upg.effects.priceMult;
            if (upg.effects.researchEnzymeReduce) buffs.researchEnzymeReduce += upg.effects.researchEnzymeReduce;
            if (upg.effects.researchCashReduce) buffs.researchCashReduce += upg.effects.researchCashReduce;
            if (upg.effects.startCashMult) buffs.startCashMult *= upg.effects.startCashMult;
        });

        // Apply Temp Start Buff
        if (Date.now() < this.startBuffEndTime) {
            // Check if we have the buff purchased (E2)
             const upg = AM_UPGRADES['am_start_buff'];
             if(this.amUpgrades.includes('am_start_buff')) {
                 buffs.startBuffVal = upg.effects.startBuffVal || 1.25;
             }
        }

        return buffs;
    }

    tick(dt) {
        const amBuffs = this.getAMBuffs();
        const globalProdMult = amBuffs.prodSpeedMult * amBuffs.startBuffVal;

        // Automation Logic
        this.lines.forEach(line => {
            const pId = line.productId;
            if (!pId) return;

            // Update Cap based on AM Buffs
            // (Efficiently we might want to do this only on change, but tick is fine for now)
            // Base cap is 100 + research + items. 
            // For MVP: Product cap is stored in inventory. Reset it to base then apply mults.
            const product = PRODUCTS[pId];
            let baseCap = 100;
            // Apply AM Cap Mult
            this.productInventory[pId].cap = Math.floor(baseCap * amBuffs.capMult);

            // 1. Auto Produce (Worker)
            const wkId = line.slots.worker;
            if (wkId && ITEMS[wkId]) {
                let prodSpeed = (ITEMS[wkId].effects.prodSpeed || 0) * globalProdMult;
                
                if (prodSpeed > 0) {
                    if (!line.prodAccumulator) line.prodAccumulator = 0;
                    line.prodAccumulator += prodSpeed * dt;
                    
                    if (line.prodAccumulator >= 1) {
                        const count = Math.floor(line.prodAccumulator);
                        this.produceAuto(line.id, count, amBuffs);
                        line.prodAccumulator -= count;
                    }
                }
            }

            // 2. Auto Sell (Market)
            const mkId = line.slots.market;
            if (mkId && ITEMS[mkId]) {
                 let sellSpeed = (ITEMS[mkId].effects.sellSpeed || 0) * amBuffs.sellSpeedMult;
                 
                 if (sellSpeed > 0) {
                    if (!line.sellAccumulator) line.sellAccumulator = 0;
                    line.sellAccumulator += sellSpeed * dt;

                    if (line.sellAccumulator >= 1) {
                        const count = Math.floor(line.sellAccumulator);
                        this.sellAuto(line.id, count, amBuffs);
                        line.sellAccumulator -= count;
                    }
                 }
            }

            // 3. Auto Logistics (Move Speed)
            const logiId = line.slots.logistics;
            if (logiId && ITEMS[logiId]) {
                let moveSpeed = (ITEMS[logiId].effects.moveSpeed || 0) * amBuffs.moveSpeedMult;
                
                if (moveSpeed > 0) {
                    if (!line.logiAccumulator) line.logiAccumulator = 0;
                    line.logiAccumulator += moveSpeed * dt;
                    if (line.logiAccumulator >= 1) {
                        const count = Math.floor(line.logiAccumulator);
                        this.moveAuto(line.id, count);
                        line.logiAccumulator -= count;
                    }
                }
            }
        });

        this.checkAchievements();
    }

    checkAchievements() {
        Object.values(ACHIEVEMENTS).forEach(ach => {
            if (this.completedAchievements.includes(ach.id)) return;
            
            let unlocked = false;
            
            // Logic for specific conditions mapping
            // This is a simple mapped checker based on the GDD IDs
            if (ach.id === 'a01') { // First Produce
                // We check if prodAccumulator ever went up or just check Keep/Sell > 0
                if (this.productInventory['kimchi_1'].keep > 0 || this.productInventory['kimchi_1'].sell > 0) unlocked = true;
            }
            else if (ach.id === 'a02') { // First Sell
                // Need to track lifetime sales or just check cash > some amount if pure sell
                if (this.cash >= 50000) unlocked = true; // Approx 10 sales
            }
            else if (ach.id === 'a03') { // Equipment T2
                if (this.itemInventory['eq_dimchae'] > 0 || this.isItemEquipped('eq_dimchae')) unlocked = true;
            }
            else if (ach.id === 'a04') { // Market T2
                if (this.itemInventory['mk_supermarket'] > 0 || this.isItemEquipped('mk_supermarket')) unlocked = true;
            }
            else if (ach.id === 'a05') { // any Logistics
                // Check if any logi item is owned
                if (Object.keys(this.itemInventory).some(k => ITEMS[k] && ITEMS[k].type === 'logistics')) unlocked = true;
            }
            else if (ach.id === 'a07') { if (this.completedResearch.includes('fermentation_lab')) unlocked = true; }
            else if (ach.id === 'a08') { if (this.completedResearch.includes('unlock_sauce')) unlocked = true; }
            else if (ach.id === 'a09') { if (this.completedResearch.includes('unlock_fusion')) unlocked = true; }
            else if (ach.id === 'a10') { if (this.completedResearch.includes('unlock_dining')) unlocked = true; }
            else if (ach.id === 'a14') { if (this.completedResearch.includes('star_kimchi_ship')) unlocked = true; } 
            else if (ach.id === 'a16') { if (this.am >= 1) unlocked = true; }

            if (unlocked) {
                this.completedAchievements.push(ach.id);
                // Trigger generic toast via UI if possible, but Game shouldn't touch DOM roughly.
                // We'll let UI poll or Dispatch Event. 
                // For now just save.
                this.save();
                window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: ach }));
            }
        });
    }
    
    hasAchievement(achId) {
        return this.completedAchievements.includes(achId);
    }

    isItemEquipped(itemId) {
        return this.lines.some(l => Object.values(l.slots).includes(itemId));
    }

    checkRecipe(productId, multiplier = 1, amBuffs = null) {
        const product = PRODUCTS[productId];
        if (!product.recipe) return true; 

        // Apply Cost Reduction from AM
        const costMod = amBuffs ? (1 - amBuffs.costReduce) : 1;

        for (const [ingredientId, amount] of Object.entries(product.recipe)) {
            const required = Math.ceil(amount * multiplier * costMod); // Round properly
            const inv = this.productInventory[ingredientId];
            if (!inv || inv.keep < required) return false;
        }
        return true;
    }

    consumeRecipe(productId, multiplier = 1, amBuffs = null) {
        const product = PRODUCTS[productId];
        if (!product.recipe) return;

        const costMod = amBuffs ? (1 - amBuffs.costReduce) : 1;

        for (const [ingredientId, amount] of Object.entries(product.recipe)) {
            const required = Math.ceil(amount * multiplier * costMod);
            this.productInventory[ingredientId].keep -= required;
        }
    }

    moveAuto(lineId, amount) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        const inv = this.productInventory[line.productId];
        
        if (line.logisticsDir === 'sell') {
            const actual = Math.min(amount, inv.keep);
            if (actual > 0) {
                inv.keep -= actual;
                inv.sell += actual;
                this.hasAutomatedChanges = true;
            }
        } else {
            const actual = Math.min(amount, inv.sell);
            if (actual > 0) {
                inv.sell -= actual;
                inv.keep += actual;
                this.hasAutomatedChanges = true;
            }
        }
    }

    produceAuto(lineId, multiplier, amBuffs) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        const pId = line.productId;
        const inv = this.productInventory[pId];

        if (!this.checkRecipe(pId, multiplier, amBuffs)) return;
        
        let batch = 1; 
        const eqId = line.slots.equipment;
        if (eqId && ITEMS[eqId]) {
            batch += (ITEMS[eqId].effects.batch || 0);
        }
        
        const amountToProduce = batch * multiplier;
        const total = inv.keep + inv.sell;
        
        let added = amountToProduce;
        if (total + added > inv.cap) {
            added = inv.cap - total;
        }

        if (added > 0) {
            this.consumeRecipe(pId, multiplier, amBuffs);
            if (pId === 'enzyme_vial') {
                this.enzyme += added;
            } else {
                inv.keep += added;
            }
            this.hasAutomatedChanges = true; 
        }
    }

    sellAuto(lineId, multiplier, amBuffs) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        const pId = line.productId;
        const inv = this.productInventory[pId];
        
        let sellAmountBase = 1;
        const soId = line.slots.salesOrg;
        if (soId && ITEMS[soId]) {
             sellAmountBase += (ITEMS[soId].effects.sellAmount || 0);
        }
        
        const totalSell = sellAmountBase * multiplier;
        const price = this.getProductPrice(pId); // Price includes AM buffs inside function

        if (inv.sell >= totalSell) {
            inv.sell -= totalSell;
            this.cash += price * totalSell;
            this.hasAutomatedChanges = true;
        } else if (inv.sell > 0) {
            const actual = inv.sell;
            inv.sell = 0;
            this.cash += price * actual;
            this.hasAutomatedChanges = true;
        }
    }

    getProductPrice(productId) {
        const product = PRODUCTS[productId];
        let price = product.price;

        // Apply Price Buffs from Research
        this.completedResearch.forEach(resId => {
            const res = RESEARCH[resId];
            if (res && res.type === 'buff' && res.effects.priceMult) {
                price *= res.effects.priceMult;
            }
        });

        // Apply AM Buffs (already calculated in getAMBuffs if optimize, but direct access safest here)
        this.amUpgrades.forEach(uid => {
            const upg = AM_UPGRADES[uid];
            if (upg.effects.priceMult) price *= upg.effects.priceMult;
        });

        return price;
    }

    // --- Actions ---
    
    produce(lineId) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return 0;
        
        const pId = line.productId;
        const inv = this.productInventory[pId];
        
        const amBuffs = this.getAMBuffs(); // Modifiers apply to manual too? GDD imply buffs are global.

        if (!this.checkRecipe(pId, 1, amBuffs)) return -1;
        
        let batch = 1;
        const eqId = line.slots.equipment;
        if (eqId && ITEMS[eqId]) {
            batch += (ITEMS[eqId].effects.batch || 0);
        }

        const total = inv.keep + inv.sell;
        
        if (total >= inv.cap) {
            return 0; // Cap Full
        }

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

    moveLogistics(lineId, toTarget) { 
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        
        const pId = line.productId;
        const inv = this.productInventory[pId];
        
        const amBuffs = this.getAMBuffs();

        let amount = 1; 
        const lgId = line.slots.logistics;
        if (lgId && ITEMS[lgId]) {
            // scale manual move by moveSpeedMult? 
            // GDD doesn't explicitly say manual move gets buffed, but nice to have.
            // Let's apply it.
            let base = (ITEMS[lgId].effects.moveSpeed || 0);
            if (base === 0) base = 1; // Hand base
            amount += Math.floor(base * amBuffs.moveSpeedMult);
        }

        if (toTarget === 'sell') {
            if (inv.keep >= amount) {
                inv.keep -= amount;
                inv.sell += amount;
                this.save();
                return true;
            }
        } else if (toTarget === 'keep') {
            if (inv.sell >= amount) {
                inv.sell -= amount;
                inv.keep += amount;
                this.save();
                return true;
            }
        }
        return false;
    }

    sell(lineId) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        
        const pId = line.productId;
        const inv = this.productInventory[pId];
        
        const amBuffs = this.getAMBuffs();

        let amount = 1; 
        const soId = line.slots.salesOrg;
        if (soId && ITEMS[soId]) {
            amount += (ITEMS[soId].effects.sellAmount || 0);
        }
        
        if (inv.sell >= amount) {
            inv.sell -= amount;
            const price = this.getProductPrice(pId); 
            this.cash += price * amount;
            this.save();
            return price * amount;
        }
        return 0;
    }

    // --- Item System ---
    
    initItems() {
        this.itemInventory = {}; 
    }

    buyItem(itemId) {
        const item = ITEMS[itemId];
        if (!item) return false;
        
        if (this.cash >= item.cost) {
            this.cash -= item.cost;
            this.itemInventory[itemId] = (this.itemInventory[itemId] || 0) + 1;
            this.save();
            return true;
        }
        return false;
    }

    equipItem(lineId, slotType, itemId) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return false;
        
        if (!this.itemInventory[itemId] || this.itemInventory[itemId] <= 0) return false;

        const currentItem = line.slots[slotType];
        if (currentItem) {
            this.unequipItem(lineId, slotType);
        }

        this.itemInventory[itemId]--;
        line.slots[slotType] = itemId;
        
        this.save();
        return true;
    }

    unequipItem(lineId, slotType) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return false;
        
        const itemId = line.slots[slotType];
        if (itemId) {
            this.itemInventory[itemId] = (this.itemInventory[itemId] || 0) + 1;
            line.slots[slotType] = null;
            this.save();
            return true;
        }
        return false;
    }

    // --- Research & Expansion ---

    buyResearch(researchId) {
        const res = RESEARCH[researchId];
        if (!res) return false;
        if (this.completedResearch.includes(researchId)) return false;

        const amBuffs = this.getAMBuffs();

        // 1. Check Cash and Enzyme Cost
        let cashCost = res.cost || 0;
        if (amBuffs.researchCashReduce > 0) cashCost = Math.floor(cashCost * (1 - amBuffs.researchCashReduce));

        let enzymeCost = res.costEnzyme || 0;
        if (amBuffs.researchEnzymeReduce > 0) enzymeCost = Math.floor(enzymeCost * (1 - amBuffs.researchEnzymeReduce));

        if (this.cash < cashCost || this.enzyme < enzymeCost) return false;

        // 2. Check Item Cost (Product Keep Consumption)
        if (res.costItems) {
            for (const [pId, qty] of Object.entries(res.costItems)) {
                if (!this.productInventory[pId] || this.productInventory[pId].keep < qty) {
                    return false; // Not enough items
                }
            }
        }

        // 3. Purchase / Consume
        this.cash -= cashCost;
        this.enzyme -= enzymeCost;
        
        if (res.costItems) {
            for (const [pId, qty] of Object.entries(res.costItems)) {
                this.productInventory[pId].keep -= qty;
            }
        }

        this.completedResearch.push(researchId);

        // Check achievements BEFORE prestige wipes the researched status
        this.checkAchievements();

        if (res.type === 'prestige') {
            this.prestige();
            // Re-check achievements after prestige to catch "First Launch" (AM > 0)
            this.checkAchievements();
        }

        this.save();
        return true;
    }

    buyAMUpgrade(upgradeId) {
        const upg = AM_UPGRADES[upgradeId];
        if (!upg) return false;
        if (this.amUpgrades.includes(upgradeId)) return false;

        if (this.am >= upg.cost) {
            this.am -= upg.cost;
            this.amUpgrades.push(upgradeId);
            this.save();
            return true;
        }
        return false;
    }

    prestige() {
        // Gain 1 AM per launch
        this.am += 1;
        
        // AM buffs that affect reset
        const amBuffs = this.getAMBuffs();

        // Reset Progress
        this.cash = 1000000 * (amBuffs.startCashMult - 1); // Start bonus? Base is 0. 
        // Logic check: if startCashMult is 1.5, we want base start cash? 
        // Usually idle games give a flat start amount or 0.
        // GDD says "Start Cash +50%". +50% of what? 0 is 0.
        // Let's assume a base starting grant if prestige happens, or maybe we leave it 0 and strict.
        // Reset Progress
        // GDD says "Start Cash +50%".
        // Base starting cash on prestige is 1,000,000 to make it impactful.
        if (amBuffs.startCashMult > 1) {
            this.cash = 1000000 * amBuffs.startCashMult; 
        } else {
            this.cash = 1000000;
        }

        this.enzyme = 0;
        this.completedResearch = [];
        this.productInventory = {};
        this.itemInventory = {};
        
        // Handle Start Buff Timer
        if (amBuffs.startBuffDuration && amBuffs.startBuffDuration > 0) {
            this.startBuffEndTime = Date.now() + amBuffs.startBuffDuration;
        }

        // Reset Lines to initial
        this.lines = [
            {
                id: 1,
                productId: 'kimchi_1',
                slots: {
                    equipment: 'eq_mom_fridge',
                    worker: 'wk_me',
                    logistics: null,
                    market: null,
                    salesOrg: null
                },
                logisticsDir: 'keep'
            }
        ];
        // Give start items again
        this.itemInventory['eq_mom_fridge'] = 1;
        this.itemInventory['wk_me'] = 1;

        this.productInventory['kimchi_1'] = { keep: 0, sell: 0, cap: 100 };

        alert("스타김치십이 발사되었습니다! 외계물질(AM) 1을 획득했습니다. 새로운 규칙에서 다시 시작합니다.");
        this.save();
        location.reload(); 
    }

    // --- Statistics & Enterprise Value (EV) ---
    
    getInventoryValue() {
        let value = 0;
        for (const pId in this.productInventory) {
            const inv = this.productInventory[pId];
            const product = PRODUCTS[pId];
            if (product && product.price) {
                value += (inv.keep + inv.sell) * product.price;
            } else if (pId === 'enzyme_vial') {
                value += (inv.keep + inv.sell) * 50000; 
            }
        }
        value += this.enzyme * 50000;
        return value;
    }

    getAssetValue() {
        let value = 0;
        const lineCount = this.lines.length;
        for (let i = 0; i < lineCount; i++) {
            const cost = GLOBAL_CONFIG.line_base_cost * Math.pow(GLOBAL_CONFIG.line_cost_growth, i);
            value += cost * GLOBAL_CONFIG.refund_rate;
        }

        this.lines.forEach(line => {
            Object.values(line.slots).forEach(itemId => {
                if (itemId && ITEMS[itemId]) {
                    value += ITEMS[itemId].cost;
                }
            });
        });

        for (const itemId in this.itemInventory) {
            if (ITEMS[itemId]) {
                value += ITEMS[itemId].cost * this.itemInventory[itemId];
            }
        }

        return value;
    }

    getEnterpriseValue() {
        return this.cash + this.getInventoryValue() + this.getAssetValue();
    }

    getLineCost() {
        const count = this.lines ? this.lines.length : 0;
        return GLOBAL_CONFIG.line_base_cost * Math.pow(GLOBAL_CONFIG.line_cost_growth, count - 1);
    }

    buyLine() {
        const cost = this.getLineCost();
        if (this.cash >= cost) {
            this.cash -= cost;
            const newId = this.lines.reduce((max, l) => Math.max(max, l.id), 0) + 1;
            this.lines.push({
                id: newId,
                productId: null, 
                slots: {
                    equipment: 'eq_mom_fridge',
                    worker: 'wk_me',
                    logistics: 'lg_hand',
                    market: 'mk_neighborhood',
                    salesOrg: 'so_solo'
                },
                logisticsDir: 'sell'
            });
            this.save();
            return true;
        }
        return false;
    }

    removeLine(lineId) {
        if (this.lines.length <= 1) {
            alert("최소 하나의 생산 라인은 유지해야 합니다.");
            return false;
        }

        const idx = this.lines.findIndex(l => l.id === lineId);
        if (idx === -1) return false;
        
        const line = this.lines[idx];
        
        Object.values(line.slots).forEach(itemId => {
            if (itemId) {
                this.itemInventory[itemId] = (this.itemInventory[itemId] || 0) + 1;
            }
        });

        const cost = GLOBAL_CONFIG.line_base_cost * Math.pow(GLOBAL_CONFIG.line_cost_growth, this.lines.length - 2);
        this.cash += cost * GLOBAL_CONFIG.refund_rate;

        this.lines.splice(idx, 1);
        this.save();
        return true;
    }

    assignProduct(lineId, productId) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        
        line.productId = productId;
        if (!this.productInventory[productId]) {
            this.productInventory[productId] = {
                keep: 0,
                sell: 0,
                cap: 100
            };
        }
        this.save();
    }

    toggleLogisticsDir(lineId) {
        const line = this.lines.find(l => l.id === lineId);
        if (!line) return;
        line.logisticsDir = line.logisticsDir === 'keep' ? 'sell' : 'keep';
        this.save();
    }

    unlockLine(productId) {
        if (!this.productInventory[productId]) {
            this.productInventory[productId] = {
                keep: 0,
                sell: 0,
                cap: 100
            };
        }
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
        const raw = localStorage.getItem('kimchi_invasion_save_v1');
        if (raw) {
            const data = JSON.parse(raw);
            this.cash = data.cash || 0;
            this.enzyme = data.enzyme || 0;
            this.am = data.am || 0;
            this.lines = data.lines || [];
            
            // Patch existing data
            this.lines.forEach(line => {
                if (!line.slots) line.slots = {};
                // Default Tier 1 items if missing
                if (!line.slots.equipment) line.slots.equipment = 'eq_mom_fridge';
                if (!line.slots.worker) line.slots.worker = 'wk_me';
                // FIX: Migrate legacy 'logistics' or set defaults for storage/transporter
                if (!line.slots.storage) line.slots.storage = 'lg_box';
                if (!line.slots.transporter) line.slots.transporter = 'tr_hand';
                if (!line.slots.market) line.slots.market = 'mk_neighborhood';
                if (!line.slots.salesOrg) line.slots.salesOrg = 'so_solo';
                
                // Ensure ID
                if (!line.id) line.id = Date.now() + Math.random().toString(36).substr(2, 5);
            });

            this.productInventory = data.productInventory || {};
            this.itemInventory = data.itemInventory || {};
            this.completedResearch = data.completedResearch || [];
            this.amUpgrades = data.amUpgrades || [];
            this.completedAchievements = data.completedAchievements || [];
            this.startBuffEndTime = data.startBuffEndTime || 0;
        }
    }
}
