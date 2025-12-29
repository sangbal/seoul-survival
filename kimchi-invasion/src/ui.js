import { PRODUCTS, ITEMS, RESEARCH, GLOBAL_CONFIG, LOGBOOK, AM_UPGRADES, ACHIEVEMENTS } from './data.js';

export class UI {
    constructor(game) {
        this.game = game;
        this.els = {
            cash: document.getElementById('res-cash'),
            enzyme: document.getElementById('res-enzyme'),
            enzymeContainer: document.getElementById('res-enzyme')?.parentElement,
            am: document.getElementById('res-am'),
            amContainer: document.getElementById('res-am')?.parentElement,
            
            // New 5-column lists
            prodList: document.getElementById('prod-list'),
            logiList: document.getElementById('logi-list'),
            salesList: document.getElementById('sales-list'),
            researchList: document.getElementById('research-list'),
            statsList: document.getElementById('stats-list'),
            
            tabs: document.querySelectorAll('.tab-btn'),
            cols: document.querySelectorAll('.col')
        };
        
        this.setupTabs();
        this.setupGlobalButtons();
        this.setupAchievementListener();
        
        // Visual State
        this.displayCash = 0;
    }

    getImageUrl(area, line) {
        // Simplified Asset Strategy: Use high-quality base images for each area
        // Future: Can overlay Tier icons or modify hue via CSS filter if needed
        if (area === 'prod') return 'src/assets/images/prod_base.png';
        if (area === 'logi') return 'src/assets/images/logi_base.png';
        if (area === 'sales') return 'src/assets/images/sales_base.png';
        return null;
    }

    init() {
        this.renderLines();
        this.renderResearch();
        this.renderStats();
        this.update();
        
        // Auto-save listener
        window.addEventListener('kimchi-saved', () => this.showAutoSaveIndicator());

        // Check Prologue
        if (this.game.lines.length === 1 && !this.game.completedAchievements.length && this.game.lines[0].slots.worker === null) {
            // Very heuristics check for "Fresh Game"
            // Better to check specific 'intro_shown' flag or just l01
             if (!this.game.completedResearch.includes('unlock_kkakdugi')) {
                 this.showModal('START_GAME');
             }
        }
    }

    setupTabs() {
        document.body.setAttribute('data-active-tab', 'prod');

        this.els.tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                this.els.tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.body.setAttribute('data-active-tab', tab);

                // Column Mapping
                const colMap = {
                    prod: 'col-prod',
                    logi: 'col-logi',
                    sales: 'col-sales',
                    research: 'col-research',
                    stats: 'col-stats'
                };

                this.els.cols.forEach(col => {
                    col.classList.remove('active');
                    if (col.id === colMap[tab]) {
                        col.classList.add('active');
                    }
                });
            });
        });
    }

    setupGlobalButtons() {
        const addBtn = document.getElementById('btn-add-line-global');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const cost = this.game.getLineCost();
                if (confirm(`생산 라인을 추가하시겠습니까?\n비용: ${cost.toLocaleString()}원`)) {
                    if (this.game.buyLine()) {
                        this.renderLines();
                        this.update();
                    } else {
                        alert('현금이 부족합니다.');
                    }
                }
            });
        }
        
        const settingsBtn = document.getElementById('btn-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showModal('SETTINGS');
            });
        }

        const helpBtn = document.getElementById('btn-help');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showModal('HELP'));
        }

        /* Shared Header Logic - Added by AutoUpdate */
        const favBtn = document.querySelector('.favorite-btn');
        if (favBtn) favBtn.addEventListener('click', () => alert('Ctrl+D를 눌러 즐겨찾기에 추가하세요!'));

        const shareBtn = document.querySelector('.share-btn');
        if (shareBtn) shareBtn.addEventListener('click', async () => {
             if (navigator.share) {
                 try {
                     await navigator.share({
                         title: 'Kimchi Invasion',
                         text: '김치로 우주를 정복하라! Kimchi Invasion',
                         url: location.href
                     });
                     this.showToast('공유 창이 열렸습니다.');
                 } catch (err) {
                     // Check if it's an abort error (user closed modal) - don't show "copied" if failed unless fallback
                     console.log('Share canceled or failed', err);
                 }
             } else {
                 navigator.clipboard.writeText(location.href);
                 this.showToast('링크 복사 완료!');
             }
        });
        
        const accBtn = document.querySelector('.account-btn');
        const accMenu = document.querySelector('.account-dropdown');
        if (accBtn && accMenu) {
            accBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accMenu.style.display = accMenu.style.display === 'block' ? 'none' : 'block';
            });
            document.addEventListener('click', () => accMenu.style.display = 'none');
            // Prevent close when clicking inside menu
            accMenu.addEventListener('click', (e) => e.stopPropagation());
        }
    }

    setupAchievementListener() {
        window.addEventListener('achievement-unlocked', (e) => {
            const ach = e.detail;
            this.showToast(`🏆 업적 달성: ${ach.title}`);
            this.renderStats(); // Refresh achievements list
            
            // Check if this achievement triggers a logbook entry
            const logEntry = Object.values(LOGBOOK).find(l => l.condition(this.game) && l.id === ach.rewardLog);
            if (logEntry) {
                // If it's a major narrative moment, show modal
                if (['l01', 'l10', 'l08'].includes(logEntry.id)) {
                    this.showModal('LOGBOOK_ENTRY', logEntry);
                } else {
                     this.showToast(`📖 로그북 기록됨: ${logEntry.title}`);
                }
                this.renderStats();
            }
        });
    }

    renderLines() {
        try {
            // 1. Clear Lists
            this.els.prodList.innerHTML = '';
            this.els.logiList.innerHTML = '';
            this.els.salesList.innerHTML = '';
            
            const lines = this.game.lines || [];

            lines.forEach((line, index) => {
                // Production Card
                const prodCard = this.renderProdCard(line, index);
                this.els.prodList.appendChild(prodCard);

                // Logistics Card
                const logiCard = this.renderLogiCard(line, index);
                this.els.logiList.appendChild(logiCard);

                // Sales Card
                const salesCard = this.renderSalesCard(line, index);
                this.els.salesList.appendChild(salesCard);
            });

            // Add Line Button in production column
            const addBtnProd = this.createAddLineBtn();
            this.els.prodList.appendChild(addBtnProd);

            this.update();
        } catch(e) {
            console.error("RenderLines Error:", e);
            this.showToast('Render Error: ' + e.message, 'error');
        }
    }

    createAddLineBtn() {
        const btn = document.createElement('button');
        btn.className = 'btn btn-add-line-main';
        btn.style.width = '100%';
        btn.style.marginTop = '10px';
        const nextCost = this.game.getLineCost();
        btn.innerHTML = `+ 새 라인 확보 (₩${nextCost.toLocaleString()})`;
        btn.onclick = () => {
            if (this.game.buyLine()) {
                this.renderLines();
                this.update();
            } else {
                this.showToast('자금이 부족합니다.', 'error');
            }
        };
        return btn;
    }

    renderProdCard(line, index) {
        const card = document.createElement('div');
        card.className = 'card prod-card animate-fade-in';
        card.id = `card-prod-${line.id}`;
        card.dataset.lineId = line.id;

        const product = PRODUCTS[line.productId];
        
        if (!product) {
            card.innerHTML = `
                <div class="card-comp-header">
                    <span class="card-comp-title">LINE #${index + 1}</span>
                </div>
                <div class="card-body" style="align-items:center; justify-content:center; min-height:100px; display:flex; flex-direction:column;">
                    <button class="btn btn-sm btn-assign">생산 품목 할당</button>
                    <div style="font-size:10px; color:var(--text-muted); margin-top:8px;">Ready to Start</div>
                </div>
            `;
            card.querySelector('.btn-assign').onclick = (e) => this.showProductPicker(e, line.id);
            return card;
        }

        const amBuffs = this.game.getAMBuffs();
        const getEff = (slot, attr) => {
            if(!line.slots[slot]) return 0;
            const it = ITEMS[line.slots[slot]];
            return it ? (it.effects[attr] || 0) : 0;
        };

        let prodRate = getEff('worker', 'prodSpeed') * amBuffs.prodSpeedMult * amBuffs.startBuffVal;
        let batch = 1 + getEff('equipment', 'batch');
        if (prodRate > 0) card.classList.add('producing');

        card.innerHTML = `
            <div class="card-comp-header">
                <span class="card-comp-title">${product.name} 생산</span>
                <span class="card-comp-badge">T1</span>
            </div>
            <div class="image-area">
                <img src="${this.getImageUrl('prod', line)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'" style="width:100%; height:100%; object-fit:contain;">
                <span class="image-placeholder-text" style="display:none;">${product.emoji} ${product.name} Factory<br>T${ITEMS[line.slots.equipment]?.tier}-W${ITEMS[line.slots.worker]?.tier}</span>
            </div>
            <div class="card-body">
                <div class="slots-grid">
                    ${this.renderSlotHTML(line.id, 'equipment', line.slots.equipment)}
                    ${this.renderSlotHTML(line.id, 'worker', line.slots.worker)}
                </div>
                
                <button class="btn btn-produce" id="btn-prod-${line.id}" style="margin-bottom: 0;">
                    <span style="font-size:18px;">${product.emoji}</span> 생산 개시 (+${batch})
                </button>
                <div class="progress-bar-container" style="margin-top: -6px; margin-bottom: 8px;">
                    <div class="progress-bar-fill" id="prog-fill-prod-${line.id}"></div>
                </div>
                
                <div style="display:flex; flex-direction:column; gap:4px; font-size:11px; color:var(--text-muted);">
                    <div style="display:flex; justify-content:space-between;">
                        <span>Batch Size</span>
                        <span style="color:var(--text-main); font-weight:700;">${batch.toLocaleString()}개</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Auto Rate</span>
                        <span style="color:var(--accent-primary); font-weight:700;">${prodRate.toFixed(1)}/s</span>
                    </div>
                </div>
            </div>
            <button class="btn-remove-line-top">&times;</button>
        `;
        
        this.bindSlotEvent(card, line.id, 'equipment');
        this.bindSlotEvent(card, line.id, 'worker');

        card.querySelector('.btn-remove-line-top').onclick = (e) => {
            e.stopPropagation();
            if(confirm('이 생산라인을 철거하시겠습니까?')) {
                this.game.removeLine(line.id);
                this.renderLines();
            }
        };
        
        card.querySelector(`#btn-prod-${line.id}`).onclick = (e) => {
            const res = this.game.produce(line.id);
            if(res > 0) {
                this.spawnParticles(e.clientX, e.clientY, '#ef4444');
                this.createFloatingText(e.clientX, e.clientY, `+${res}`, 'item');
            } else if (res === -1) {
                this.createFloatingText(e.clientX, e.clientY, `재료 부족`, 'err');
            }
        };

        return card;
    }

    renderLogiCard(line, index) {
        const card = document.createElement('div');
        card.className = 'card logi-card animate-fade-in';
        card.id = `card-logi-${line.id}`;
        
        const product = PRODUCTS[line.productId];
        if (!product) {
            card.innerHTML = `<div class="card-body muted" style="text-align:center; padding:40px;">Waiting for Production...</div>`;
            return card;
        }

        const amBuffs = this.game.getAMBuffs();
        
        card.innerHTML = `
            <div class="card-comp-header">
                <span class="card-comp-title">물류 스테이션</span>
                <span class="card-comp-badge">L${index+1}</span>
            </div>
            <div class="image-area">
                <img src="${this.getImageUrl('logi', line)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'" style="width:100%; height:100%; object-fit:contain;">
                <span class="image-placeholder-text" style="display:none;">📦 Logistics Hub<br>T${ITEMS[line.slots.storage]?.tier || '?'}-W${ITEMS[line.slots.transporter]?.tier || '?'}</span>
            </div>
            <div class="card-body">
                <div class="slots-grid">
                    ${this.renderSlotHTML(line.id, 'storage', line.slots.storage)}
                    ${this.renderSlotHTML(line.id, 'transporter', line.slots.transporter)}
                </div>

                <div class="tank-container">
                    <div class="tank tank-keep">
                        <div class="tank-label">보관 (Storage)</div>
                        <div class="tank-bar-bg"><div class="tank-bar-fill" id="fill-keep-${line.id}"></div></div>
                        <div class="tank-value" id="val-keep-${line.id}">0</div>
                        <button class="btn btn-pump btn-pump-keep" id="btn-pump-keep-${line.id}">PUMP</button>
                    </div>
                    <div class="tank tank-sell">
                        <div class="tank-label">출하 (Shipping)</div>
                        <div class="tank-bar-bg"><div class="tank-bar-fill" id="fill-sell-logi-${line.id}"></div></div>
                        <div class="tank-value" id="val-sell-logi-${line.id}">0</div>
                        <button class="btn btn-pump btn-pump-sell" id="btn-pump-sell-${line.id}">PUMP</button>
                    </div>
                </div>

                <div class="priority-toggle">
                     <button class="priority-btn ${line.logisticsDir === 'keep' ? 'active' : ''}" data-mode="keep" id="toggle-keep-${line.id}">STORAGE</button>
                     <button class="priority-btn ${line.logisticsDir !== 'keep' ? 'active' : ''}" data-mode="sell" id="toggle-sell-${line.id}">SHIPPING</button>
                </div>
            </div>
        `;

        this.bindSlotEvent(card, line.id, 'storage');
        this.bindSlotEvent(card, line.id, 'transporter');
        
        card.querySelector(`#toggle-keep-${line.id}`).onclick = () => { if(line.logisticsDir !== 'keep') { this.game.toggleLogisticsDir(line.id); this.renderLines(); } };
        card.querySelector(`#toggle-sell-${line.id}`).onclick = () => { if(line.logisticsDir !== 'sell') { this.game.toggleLogisticsDir(line.id); this.renderLines(); } };
        
        card.querySelector(`#btn-pump-sell-${line.id}`).onclick = (e) => {
            const oldSell = this.game.productInventory[line.productId]?.sell || 0;
            this.game.moveLogistics(line.id, 'sell');
            if((this.game.productInventory[line.productId]?.sell || 0) > oldSell) {
                this.spawnParticles(e.clientX, e.clientY, '#0ea5e9');
                this.update();
            }
        };
        card.querySelector(`#btn-pump-keep-${line.id}`).onclick = (e) => {
             this.game.moveLogistics(line.id, 'keep');
             this.update();
        };

        return card;
    }

    renderSalesCard(line, index) {
        const card = document.createElement('div');
        card.className = 'card sales-card animate-fade-in';
        card.id = `card-sales-${line.id}`;

        const product = PRODUCTS[line.productId];
        if (!product) {
            card.innerHTML = `<div class="card-body muted" style="text-align:center; padding:40px;">Market Closed</div>`;
            return card;
        }

        const amBuffs = this.game.getAMBuffs();
        const getMk = ITEMS[line.slots.market];
        const getSo = ITEMS[line.slots.salesOrg];
        
        let sellAmount = 1 + (getMk ? (getMk.effects.sellAmount || 0) : 0);
        let sellSpeed = (getSo ? (getSo.effects.sellSpeed || 0) : 0) * amBuffs.sellSpeedMult;
        const price = this.game.getProductPrice(line.productId);
        const buffedPrice = price * amBuffs.sellPriceMult;
        const sellRate = sellSpeed;

        card.innerHTML = `
            <div class="card-comp-header">
                <span class="card-comp-title">글로벌 마켓</span>
                <span class="card-comp-badge">S${index+1}</span>
            </div>
            <div class="image-area">
                <img src="${this.getImageUrl('sales', line)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'" style="width:100%; height:100%; object-fit:contain;">
                <span class="image-placeholder-text" style="display:none;">🏪 Street Store<br>T${ITEMS[line.slots.market]?.tier || '?'}-W${ITEMS[line.slots.salesOrg]?.tier || '?'}</span>
            </div>
            <div class="card-body">
                <div class="slots-grid">
                    ${this.renderSlotHTML(line.id, 'market', line.slots.market)}
                    ${this.renderSlotHTML(line.id, 'salesOrg', line.slots.salesOrg)}
                </div>

                <div class="tank-container" style="flex:initial; margin-bottom:12px;">
                    <div class="tank tank-sell">
                        <div class="tank-label">출하 (Shipping)</div>
                        <div class="tank-bar-bg"><div class="tank-bar-fill" id="fill-sell-${line.id}"></div></div>
                        <div class="tank-value" id="val-sell-${line.id}">0</div>
                    </div>
                </div>

                <div class="price-tag-lg">
                    <div style="font-size:10px; color:var(--text-muted); margin-bottom:4px;">UNIT PRICE</div>
                    <span class="price-val">${Math.floor(buffedPrice).toLocaleString()}</span>
                    <span class="currency">원</span>
                </div>

                <div class="progress-bar-container" style="margin-bottom:8px;">
                    <div class="progress-bar-fill" id="prog-fill-sell-${line.id}"></div>
                </div>

                <div class="rate-info">${sellRate > 0 ? '자동: ' + sellRate.toFixed(1) + '/s' : ''}</div>
                <button class="btn btn-sell-action" id="btn-sell-${line.id}" style="margin-bottom: 0;">
                    <span style="font-size:18px;">💰</span> 즉시 판매 (+${sellAmount})
                </button>
            </div>
        `;

        this.bindSlotEvent(card, line.id, 'market');
        this.bindSlotEvent(card, line.id, 'salesOrg');

        card.querySelector(`#btn-sell-${line.id}`).onclick = (e) => {
            const gained = this.game.sell(line.id);
            if(gained > 0) {
                this.spawnParticles(e.clientX, e.clientY, '#fbbf24');
                this.createFloatingText(e.clientX, e.clientY, `+${Math.floor(gained).toLocaleString()}원`, 'cash');
                this.update();
            } else {
                this.showToast('판매할 재고가 부족합니다.', 'error');
            }
        };

        return card;
    }

    renderAchievements() {
        const grid = document.getElementById('achievement-grid');
        const detail = document.getElementById('achievement-detail');
        if (!grid) return;

        Object.values(ACHIEVEMENTS).forEach(ach => {
            const isDone = this.game.completedAchievements.includes(ach.id);
            const el = document.createElement('div');
            el.className = `ach-icon ${isDone ? 'unlocked' : 'locked'}`;
            el.textContent = isDone ? '🏆' : '🔒';
            el.style.width = '30px';
            el.style.height = '30px';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.background = isDone ? 'var(--accent)' : '#333';
            el.style.color = isDone ? '#000' : '#555';
            el.style.borderRadius = '4px';
            el.style.cursor = 'pointer';

            el.addEventListener('mouseenter', () => {
                detail.innerHTML = `<span style="color:#fff">${ach.title}</span><br>${ach.desc}`;
            });
            el.addEventListener('mouseleave', () => {
                detail.innerHTML = '';
            });

            grid.appendChild(el);
        });
    }

    renderLogbook() {
        const list = document.getElementById('logbook-list');
        if (!list) return;
        list.innerHTML = '';
        
        Object.values(LOGBOOK).forEach(entry => {
            const isUnlocked = entry.condition(this.game);
            
            const item = document.createElement('div');
            item.className = 'log-item animate-fade-in';
            item.style.borderLeftColor = isUnlocked ? 'var(--accent)' : '#333';
            item.style.opacity = isUnlocked ? '1' : '0.5';
            item.style.cursor = isUnlocked ? 'pointer' : 'default';

            if (isUnlocked) {
                item.innerHTML = `
                    <div class="log-title" style="color:var(--accent)">[해금] ${entry.title}</div>
                    <div class="log-content">${entry.content}</div>
                `;
            } else {
                item.classList.add('locked');
                item.innerHTML = `
                    <div class="log-title" style="color:#555">🔒 잠김: ${entry.title}</div>
                `;
            }
            list.appendChild(item);
        });
    }

    renderAMUpgrades() {
        const list = document.getElementById('am-upgrade-list');
        if (!list) return;
        list.innerHTML = '';

        Object.values(AM_UPGRADES).forEach(upg => {
            const isDone = this.game.amUpgrades.includes(upg.id);
            const item = document.createElement('div');
            item.className = `card res-card am-upg-card ${isDone ? 'completed' : ''}`;
            item.style.minHeight = 'auto';
            item.style.marginBottom = '8px';
            item.style.borderColor = isDone ? 'var(--accent)' : 'var(--card-border)';

            item.innerHTML = `
                <div class="card-title" style="color:var(--accent); font-size:14px;">${upg.name}</div>
                <div class="card-desc" style="font-size:11px;">${upg.desc}</div>
                <div class="card-footer" style="margin-top:8px;">
                    <span class="res-cost" style="font-size:12px;">${isDone ? '획득 완료' : '⚛️ ' + upg.cost}</span>
                    ${!isDone ? `<button class="btn btn-xs btn-buy-am" data-id="${upg.id}">획득</button>` : ''}
                </div>
            `;

            if (!isDone) {
                item.querySelector('.btn-buy-am').addEventListener('click', () => {
                    if (this.game.buyAMUpgrade(upg.id)) {
                        this.renderAMUpgrades();
                        this.update();
                    } else {
                        alert('외계 물질(AM)이 부족합니다.');
                    }
                });
            }
            list.appendChild(item);
        });
    }



    renderFlash(el) {
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 150);
    }

    createFloatingText(x, y, text, colorOrType = '#fff') {
        const el = document.createElement('div');
        el.textContent = text;
        el.className = 'floating-text';
        
        // Check if it's a known type class
        if (['cash', 'item', 'err'].includes(colorOrType)) {
            el.classList.add(colorOrType);
        } else {
            el.style.color = colorOrType;
        }

        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);

        requestAnimationFrame(() => {
            el.style.transform = 'translateY(-50px)';
            el.style.opacity = '0';
            el.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        });
        setTimeout(() => el.remove(), 800);
    }

    showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const el = document.createElement('div');
        el.className = 'toast';
        el.dataset.type = type; // success, error, info
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '⚠️';
        
        el.innerHTML = `<span style="font-size:16px;">${icon}</span> <span>${message}</span>`;
        
        container.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(-20px)';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }

    showModal(type, data) {
         // Simple Modal Overlay
         const modal = document.createElement('div');
         modal.className = 'modal-overlay animate-fade-in';
         modal.style.position = 'fixed';
         modal.style.top = '0'; modal.style.left = '0'; modal.style.width = '100%'; modal.style.height = '100vh';
         modal.style.background = 'rgba(0,0,0,0.9)';
         modal.style.zIndex = '10000';
         modal.style.display = 'flex';
         modal.style.alignItems = 'center';
         modal.style.justifyContent = 'center';

         let contentHTML = '';
         if (type === 'START_GAME') {
             contentHTML = `
                <div class="modal-content" style="max-width:300px; text-align:center;">
                    <h2 style="color:var(--accent); margin-bottom:15px;">SEOUL 2033:<br>Kimchi Invasion</h2>
                    <p style="font-size:14px; line-height:1.6; color:#ccc; margin-bottom:20px;">
                        "엄마, 냉장고에 김치가 너무 많아..."<br><br>
                        서울의 생존은 늘 하나였습니다.<br>
                        남기는 게 아니라, 쌓는 것.<br>
                        이제 당신의 김치 제국이 시작됩니다.
                    </p>
                    <button class="btn btn-action" id="modal-close">판매 시작</button>
                </div>
             `;
         } else if (type === 'LOGBOOK_ENTRY') {
             contentHTML = `
                <div class="modal-content" style="max-width:400px; text-align:left; border: 1px solid var(--accent); padding:20px; background:#111;">
                    <h3 style="color:var(--accent); font-size:16px; margin-bottom:10px;">${data.title}</h3>
                    <p style="font-size:14px; line-height:1.6; color:#ddd; white-space:pre-wrap;">${data.content}</p>
                    <div style="text-align:right; margin-top:20px;">
                        <button class="btn btn-sm" id="modal-close">확인</button>
                    </div>
                </div>
             `;
         } else if (type === 'HELP') {
             contentHTML = `
                <div class="modal-content" style="max-width:500px; text-align:left; max-height:80vh; overflow-y:auto;">
                    <h2 style="color:var(--accent); border-bottom:1px solid #333; padding-bottom:10px;">게임 가이드</h2>
                    <div style="font-size:14px; line-height:1.6; color:#ddd; margin-top:10px;">
                        <p style="margin-bottom:10px;"><strong>1. 생산 (Production)</strong><br>
                        김치를 생산합니다. '장비'와 '작업자'를 업그레이드하여 속도와 배치 크기를 늘리세요.</p>
                        
                        <p style="margin-bottom:10px;"><strong>2. 물류 (Logistics)</strong><br>
                        생산된 김치는 일단 '보관'됩니다. 물류 카드의 밸브를 <span style="color:#f59e0b">📤 출하</span>로 돌려야 판매 단계로 넘어갑니다.<br>
                        <em>팁: 물류 효율이 낮으면 생산이 멈춥니다!</em></p>
                        
                        <p style="margin-bottom:10px;"><strong>3. 판매 (Sales)</strong><br>
                        출하된 김치를 시장에 팝니다. '마케팅'과 '영업조직'이 판매 속도를 결정합니다.</p>
                        
                        <p style="margin-bottom:10px;"><strong>4. 연구 & AM</strong><br>
                        '효소'를 모아 연구를 진행하고, 재설정(Prestige)을 통해 '외계 물질(AM)'을 획득하여 영구적인 강함을 얻으세요.</p>
                    </div>
                    <div style="text-align:right; margin-top:20px;">
                        <button class="btn btn-action" id="modal-close">닫기</button>
                    </div>
                </div>
             `;
         } else if (type === 'SETTINGS') {
             contentHTML = `
                <div class="modal-content" style="max-width:320px; text-align:center;">
                    <h3 style="color:var(--text-main); font-size:18px; margin-bottom:20px; border-bottom:1px solid var(--glass-border); padding-bottom:10px;">SETTINGS</h3>
                    
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button class="btn" id="btn-save-manual" style="width:100%; padding:12px;">💾 게임 저장 (Save)</button>
                        <!-- <button class="btn" id="btn-lang" style="width:100%; padding:12px;">🌐 Language: KO</button> -->
                        <div style="border-top:1px solid var(--glass-border); margin:10px 0;"></div>
                        <button class="btn" id="btn-hard-reset" style="width:100%; padding:12px; border-color:var(--accent); color:var(--accent);">⚠️ 데이터 초기화 (Hard Reset)</button>
                    </div>

                    <div style="margin-top:20px;">
                        <button class="btn btn-sm" id="modal-close">닫기</button>
                    </div>
                    
                    <div style="margin-top:20px; font-size:10px; color:var(--text-muted);">
                        Kimchi Invasion v0.68<br>
                        Powered by ClickSurvivor Universe
                    </div>
                </div>
             `;
         }

         modal.innerHTML = contentHTML;
         document.body.appendChild(modal);

         if (type === 'SETTINGS') {
             modal.querySelector('#btn-save-manual').addEventListener('click', () => {
                 this.game.save();
                 this.showToast('✅ 게임이 저장되었습니다.');
             });
             
             modal.querySelector('#btn-hard-reset').addEventListener('click', () => {
                 if (confirm('정말로 모든 데이터를 삭제하고 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
                     if (confirm('진짜로 삭제합니까? 클라우드 저장이 없다면 복구가 불가능합니다.')) {
                         // Hard Reset: Clear specific key or all
                         this.game.isResetting = true; // Stop auto-save immediately
                         localStorage.removeItem('kimchi_invasion_save_v1');
                         localStorage.clear(); // Nuclear option for "Hard Reset"
                         window.location.reload();
                     }
                 }
             });
         }

         modal.querySelector('#modal-close').addEventListener('click', () => {
             modal.remove();
         });
    }


    update() {
        // Rolling Cash Logic
        const diff = this.game.cash - this.displayCash;
        if (Math.abs(diff) < 1) {
            this.displayCash = this.game.cash;
        } else {
            this.displayCash += diff * 0.15; // Speed of roll
        }
        this.els.cash.textContent = Math.floor(this.displayCash).toLocaleString() + '원';
        
        if (diff > 0.1) this.els.cash.classList.add('gaining');
        else this.els.cash.classList.remove('gaining');
        
        if (this.els.enzymeContainer && (this.game.completedResearch.includes('fermentation_lab') || this.game.enzyme > 0)) {
            this.els.enzymeContainer.style.display = 'flex';
            if(this.els.enzyme) this.els.enzyme.textContent = Math.floor(this.game.enzyme).toLocaleString();
        } else if (this.els.enzymeContainer) {
            this.els.enzymeContainer.style.display = 'none';
        }

        if (this.els.amContainer && (this.game.am > 0 || this.game.amUpgrades.length > 0)) {
            this.els.amContainer.style.display = 'flex';
            if(this.els.am) this.els.am.textContent = Math.floor(this.game.am).toLocaleString();
            
            const amSect = document.getElementById('am-upgrades-container');
            if (amSect) amSect.style.display = 'block';
        } else if (this.els.amContainer) {
            this.els.amContainer.style.display = 'none';
        }
        
        if (this.els.nextLineCost) {
            this.els.nextLineCost.textContent = `(비용: ${this.game.getLineCost().toLocaleString()}원)`;
        }

        const evEl = document.getElementById('stat-ev');
        if (evEl) {
            evEl.textContent = Math.floor(this.game.getEnterpriseValue()).toLocaleString() + '원';
            document.getElementById('stat-cash-val').textContent = Math.floor(this.game.cash).toLocaleString() + '원';
            document.getElementById('stat-inv-val').textContent = Math.floor(this.game.getInventoryValue()).toLocaleString() + '원';
            document.getElementById('stat-asset-val').textContent = Math.floor(this.game.getAssetValue()).toLocaleString() + '원';
        }

        const now = Date.now();
        if (!this.lastLogUpdate || now - this.lastLogUpdate > 5000) {
            this.renderLogbook();
            this.lastLogUpdate = now;
        }

        this.game.lines.forEach(line => {
            if (!line.productId) return;
            const inv = this.game.productInventory[line.productId];
            const invEl = document.getElementById(`card-logi-${line.id}`); // Check if logi card exists
            
            const prodFill = document.getElementById(`prog-fill-prod-${line.id}`);
            if (prodFill && line.prodAccumulator !== undefined) {
                prodFill.style.width = Math.min((line.prodAccumulator * 100), 100) + '%';
            }
            const sellFill = document.getElementById(`prog-fill-sell-${line.id}`);
            if (sellFill && line.sellAccumulator !== undefined) {
                sellFill.style.width = Math.min((line.sellAccumulator * 100), 100) + '%';
            }
            if (invEl) {
                const keep = inv.keep || 0;
                const sell = inv.sell || 0;
                const cap = inv.cap || 100;
                
                // Update Texts
                const kVal = document.getElementById(`val-keep-${line.id}`);
                const sVal = document.getElementById(`val-sell-${line.id}`);
                const sValLogi = document.getElementById(`val-sell-logi-${line.id}`);
                if(kVal) kVal.textContent = keep.toLocaleString();
                if(sVal) sVal.textContent = sell.toLocaleString(); 
                if(sValLogi) sValLogi.textContent = sell.toLocaleString();

                // Update Fill Bars
                const kFill = document.getElementById(`fill-keep-${line.id}`);
                const sFill = document.getElementById(`fill-sell-${line.id}`);
                const sFillLogi = document.getElementById(`fill-sell-logi-${line.id}`);
                
                if(kFill) kFill.style.height = Math.min((keep / cap) * 100, 100) + '%';
                if(sFill) sFill.style.height = Math.min((sell / cap) * 100, 100) + '%';
                if(sFillLogi) sFillLogi.style.height = Math.min((sell / cap) * 100, 100) + '%';
                
                // Signals
                if (keep + sell >= cap) {
                    const pc = document.getElementById(`card-prod-${line.id}`);
                    if(pc && !pc.classList.contains('status-halted')) pc.classList.add('status-halted');
                } else {
                    const pc = document.getElementById(`card-prod-${line.id}`);
                    if(pc) pc.classList.remove('status-halted');
                }

                if (sell > 0) {
                     const sc = document.getElementById(`card-sales-${line.id}`);
                     if(sc && !sc.classList.contains('status-rich')) sc.classList.add('status-rich');
                } else {
                     const sc = document.getElementById(`card-sales-${line.id}`);
                     if(sc) sc.classList.remove('status-rich');
                }
            }
        });
    }

    renderSlotHTML(lineId, type, itemId) {
        if (itemId && ITEMS[itemId]) {
            const item = ITEMS[itemId];
            const tierClass = `tier-${item.tier || 1}`;
            return `<button class="btn btn-slot equipped ${tierClass}" data-line="${lineId}" data-type="${type}">${item.name}</button>`;
        } else {
            return `<button class="btn btn-slot empty" data-line="${lineId}" data-type="${type}">✚</button>`;
        }
    }

    bindSlotEvent(parent, lineId, type) {
        // Use a more generic selector to be safe, then check attributes
        const btns = parent.querySelectorAll('.btn-slot');
        btns.forEach(btn => {
            if (btn.dataset.line == lineId && btn.dataset.type === type) {
                btn.onclick = (e) => { // Use onclick to overwrite any existing
                    e.stopPropagation(); // Prevent bubbling
                    this.showPopover(e, lineId, type);
                };
            }
        });
    }

    showPopover(e, lineId, type) {
        this.hidePopover();
        const pop = document.createElement('div');
        pop.className = 'popover animate-fade-in';
        pop.id = 'active-popover';

        const line = this.game.lines.find(l => l.id === lineId);
        const currentId = line.slots[type];

        let html = `<div class="popover-title">${type} 아이템 관리 <button id="close-pop" style="float:right; background:none; border:none; color:#fff;">&times;</button></div>`;
        Object.values(ITEMS).filter(it => it.type === type).forEach(item => {
            const isOwned = (this.game.itemInventory[item.id] || 0) > 0;
            const isEquipped = currentId === item.id;
            const canAfford = this.game.cash >= item.cost;
            const effectStr = this.getEffectString(item);
            
            html += `
                <div class="item-row ${isEquipped ? 'active' : ''}">
                    <div class="item-info">
                        <strong>${item.name}</strong> 
                        <span>Tier ${item.tier} - ${item.desc}</span>
                        <div style="font-size:11px; color:#10b981;">[효과] ${effectStr}</div>
                        <div style="font-size:10px; color:#aaa; margin-top:2px;">
                            ${item.cost > 0 ? item.cost.toLocaleString() + '원' : '무료'} 
                            ${!isOwned && !canAfford ? '(자금 부족)' : ''}
                        </div>
                    </div>
                    <div class="item-actions">
                        ${isEquipped ? 
                            `<button class="btn btn-xs btn-unequip" data-id="${item.id}" disabled>장착중</button>` :
                            (isOwned ? 
                                `<button class="btn btn-xs btn-equip" data-id="${item.id}">장착</button>` :
                                `<button class="btn btn-xs btn-buy" data-id="${item.id}" ${!canAfford ? 'disabled' : ''}>구매</button>`
                            )
                        }
                    </div>
                </div>
            `;
        });
        pop.innerHTML = html;
        document.body.appendChild(pop);
        
        let left = e.clientX + 10;
        let top = e.clientY + 10;
        if (left + 300 > window.innerWidth) left = window.innerWidth - 300;
        if (top + 400 > window.innerHeight) top = window.innerHeight - 400;
        
        pop.style.left = left + 'px';
        pop.style.top = top + 'px';

        pop.querySelectorAll('.btn-buy').forEach(btn => btn.addEventListener('click', (ev) => {
            ev.stopPropagation(); 
            // Double check afford
            const id = btn.dataset.id;
            if (this.game.buyItem(id)) { 
                this.showPopover(e, lineId, type); 
                this.update(); 
            }
        }));
        
        // Close checks...
        pop.querySelectorAll('.btn-equip').forEach(btn => btn.addEventListener('click', () => {
            this.game.equipItem(lineId, type, btn.dataset.id); this.hidePopover(); this.renderLines(); this.update();
        }));
        // (Unequip disabled for current logic, or can re-enable if user wants empty slots but user said "Empty is uncomfortable")
        
        pop.querySelector('#close-pop').addEventListener('click', () => this.hidePopover());

        // Close on Outside Click
        setTimeout(() => {
            const closeHandler = (ev) => {
                if (!pop.contains(ev.target)) {
                    this.hidePopover();
                    window.removeEventListener('click', closeHandler);
                }
            };
            window.addEventListener('click', closeHandler);
        }, 100);
    }

    showProductPicker(e, lineId) {
        this.hidePopover();
        const pop = document.createElement('div');
        pop.className = 'popover animate-fade-in';
        pop.id = 'active-popover';
        let html = `<div class="popover-title">생산 품목 선택</div>`;
        Object.values(PRODUCTS).forEach(p => {
            html += `
                <div class="item-row">
                    <div class="item-info">
                        <strong>${p.name}</strong>
                        <span>${p.desc}</span>
                    </div>
                    <button class="btn btn-xs btn-buy" data-id="${p.id}">할당</button>
                </div>
            `;
        });
        html += `<button class="btn btn-sm btn-close-pop">닫기</button>`;
        pop.innerHTML = html;
        document.body.appendChild(pop);
        pop.style.left = Math.min(e.clientX, window.innerWidth - 320) + 'px';
        pop.style.top = Math.min(e.clientY, window.innerHeight - 350) + 'px';
        pop.querySelectorAll('.btn-buy').forEach(btn => btn.addEventListener('click', () => {
            this.game.assignProduct(lineId, btn.dataset.id); this.hidePopover(); this.renderLines(); this.update();
        }));
        pop.querySelector('.btn-close-pop').addEventListener('click', () => this.hidePopover());
    }

    hidePopover() {
        const existing = document.getElementById('active-popover');
        if (existing) existing.remove();
    }

    showAutoSaveIndicator() {
        if (!this.els.autoSave) {
            this.els.autoSave = document.createElement('div');
            this.els.autoSave.id = 'auto-save-indicator';
            document.body.appendChild(this.els.autoSave);
        }
        this.els.autoSave.classList.add('saving');
        setTimeout(() => this.els.autoSave.classList.remove('saving'), 1000);
    }

    renderResearch() {
        const list = this.els.researchList;
        if (!list) return;
        list.innerHTML = '';
        
        Object.values(RESEARCH).forEach(res => {
            const isDone = this.game.completedResearch.includes(res.id);
            const isAvailable = !res.prereq || this.game.completedResearch.includes(res.prereq);
            
            if (!isAvailable && !isDone) return;
            
            const card = document.createElement('div');
            card.className = `card res-card ${isDone ? 'completed' : ''}`;
            
            let costStr = '';
            if (!isDone) {
                if (res.cost) costStr += `₩${res.cost.toLocaleString()} `;
                if (res.costItems) {
                    costStr += Object.entries(res.costItems).map(([id, qty]) => `${PRODUCTS[id].emoji}${qty}`).join(', ');
                }
                if (res.costEnzyme) costStr += `🧪${res.costEnzyme}`;
            }

            card.innerHTML = `
                <div class="card-comp-header">
                    <span class="card-comp-title">${res.name}</span>
                    <span class="card-comp-badge">${isDone ? 'COMPLETED' : 'RESEARCH'}</span>
                </div>
                <div class="card-body">
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">${res.desc}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:11px; color:var(--accent-primary);">${isDone ? '기술 확보 완료' : costStr}</span>
                        ${!isDone ? `<button class="btn btn-sm btn-research-buy" data-id="${res.id}">연구개시</button>` : ''}
                    </div>
                </div>
            `;
            
            if (!isDone) {
                card.querySelector('.btn-research-buy').onclick = () => {
                    if (this.game.buyResearch(res.id)) {
                        this.renderResearch();
                        this.renderLines();
                        this.update();
                    } else {
                        this.showToast('자원이나 선행 연구가 부족합니다.', 'error');
                    }
                };
            }
            list.appendChild(card);
        });
        
        const amTitle = document.createElement('h3');
        amTitle.className = 'section-title';
        amTitle.textContent = 'Extra-Terrestrial Lab';
        amTitle.id = 'am-upgrades-container';
        amTitle.style.display = (this.game.am > 0 || this.game.amUpgrades.length > 0) ? 'block' : 'none';
        list.appendChild(amTitle);
        
        const amList = document.createElement('div');
        amList.id = 'am-upgrade-list';
        list.appendChild(amList);
        
        this.renderAMUpgrades();
    }

    renderStats() {
        const list = this.els.statsList;
        if (!list) return;
        list.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-label">기업가치</span>
                    <span class="stat-val" id="stat-ev">0원</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">보유현금</span>
                    <span class="stat-val" id="stat-cash-val">0원</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">재고가치</span>
                    <span class="stat-val" id="stat-inv-val">0원</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">설비자산</span>
                    <span class="stat-val" id="stat-asset-val">0원</span>
                </div>
            </div>
            
            <h3 class="section-title">Achievements</h3>
            <div class="achievement-grid" id="achievement-grid" style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;"></div>
            <div id="achievement-detail" style="font-size:11px; color:var(--text-muted); margin-bottom:20px; min-height:30px;"></div>
            
            <h3 class="section-title">Logbook</h3>
            <div id="logbook-list" class="logbook-list"></div>
        `;
        this.renderAchievements();
        this.renderLogbook();
    }

    getEffectString(item) {
        if (!item || !item.effects) return "No Effect";
        const parts = [];
        if (item.effects.prodSpeed) parts.push(`생산속도 +${item.effects.prodSpeed}`);
        if (item.effects.batch) parts.push(`배치량 +${item.effects.batch}`);
        if (item.effects.moveSpeed) parts.push(`물류속도 +${item.effects.moveSpeed}`);
        if (item.effects.moveBatch) parts.push(`이송량 +${item.effects.moveBatch}`);
        if (item.effects.sellSpeed) parts.push(`판매속도 +${item.effects.sellSpeed}`);
        if (item.effects.sellAmount) parts.push(`판매량 +${item.effects.sellAmount}`);
        return parts.length > 0 ? parts.join(', ') : "특수 효과";
    }

    spawnParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.backgroundColor = color;
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            
            const tx = (Math.random() - 0.5) * 100;
            const ty = (Math.random() - 0.5) * 100;
            p.style.setProperty('--tx', `${tx}px`);
            p.style.setProperty('--ty', `${ty}px`);
            
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }
    }

    animateConveyor(lineId, emoji, target) {
        const container = document.getElementById(`conveyor-${target}-${lineId}`);
        if (!container) return;
        
        const track = container.querySelector('.conveyor-track');
        if (!track) return;

        const item = document.createElement('div');
        item.className = 'conveyor-item';
        item.textContent = emoji;
        track.appendChild(item);
        
        setTimeout(() => item.remove(), 2000);
    }
}
