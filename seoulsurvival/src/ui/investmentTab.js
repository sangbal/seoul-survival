/**
 * Seoul Survival - Investment Tab UI Module
 *
 * 금융상품 및 부동산 투자 탭 UI 관리
 */

import { t } from '../i18n/index.js'
import * as NumberFormat from '../utils/numberFormat.js'
import * as Diary from '../systems/diary.js'
import * as Animations from './animations.js'

/**
 * 투자 탭 UI 관리 시스템 생성
 * @param {Object} deps - 의존성
 * @returns {Object} 투자 탭 관리 함수들
 */
export function createInvestmentTab(deps) {
  const {
    // State getters/setters
    getCash,
    setCash,
    getPurchaseMode,
    getPurchaseQuantity,
    getSettings,
    getCurrentMarketEvent,
    getMarketEventEndTime,
    setCurrentMarketEvent,
    setMarketEventEndTime,

    // Product counts (getters/setters)
    getDeposits,
    setDeposits,
    getSavings,
    setSavings,
    getBonds,
    setBonds,
    getUsStocks,
    setUsStocks,
    getCryptos,
    setCryptos,
    getVillas,
    setVillas,
    getOfficetels,
    setOfficetels,
    getApartments,
    setApartments,
    getShops,
    setShops,
    getBuildings,
    setBuildings,

    // Helper functions
    getFinancialCost,
    getPropertyCost,
    getFinancialSellPrice,
    getPropertySellPrice,
    updateUI,

    // Constants
    CAREER_LEVELS,
    MARKET_EVENTS,
  } = deps

  /**
   * 상품 이름 가져오기
   */
  function getProductName(type) {
    const names = {
      deposit: t('product.deposit'),
      savings: t('product.savings'),
      bond: t('product.bond'),
      usStock: t('product.usStock'),
      crypto: t('product.crypto'),
      villa: t('product.villa'),
      officetel: t('product.officetel'),
      apartment: t('product.apartment'),
      shop: t('product.shop'),
      building: t('product.building'),
      tower: t('product.tower'),
    }
    return names[type] || type
  }

  /**
   * 상품 해금 여부 확인
   */
  function isProductUnlocked(productName) {
    const unlockConditions = {
      deposit: () => true, // 항상 해금
      savings: () => {
        const deposits = getDeposits()
        console.log('[Unlock] Checking savings unlock - deposits:', deposits)
        return deposits >= 1
      },
      bond: () => getSavings() >= 1,
      usStock: () => getBonds() >= 1,
      crypto: () => getUsStocks() >= 1,
      villa: () => getCryptos() >= 1,
      officetel: () => getVillas() >= 1,
      apartment: () => getOfficetels() >= 1,
      shop: () => getApartments() >= 1,
      building: () => getShops() >= 1,
      tower: () => {
        const careerLevel = deps.getCareerLevel()
        return careerLevel >= CAREER_LEVELS.length - 1 && getBuildings() >= 1
      },
    }

    const result = unlockConditions[productName] ? unlockConditions[productName]() : false
    console.log('[Unlock] isProductUnlocked:', productName, '→', result)
    return result
  }

  /**
   * 새로운 상품 해금 체크
   */
  function checkNewUnlocks(productName) {
    console.log('[Unlock] Checking unlocks for:', productName)

    const unlockChain = {
      deposit: 'savings',
      savings: 'bond',
      bond: 'usStock',
      usStock: 'crypto',
      crypto: 'villa',
      villa: 'officetel',
      officetel: 'apartment',
      apartment: 'shop',
      shop: 'building',
      building: 'tower',
    }

    const nextProduct = unlockChain[productName]
    console.log('[Unlock] Next product in chain:', nextProduct)

    if (nextProduct) {
      const isUnlocked = isProductUnlocked(nextProduct)
      console.log('[Unlock] Is next product unlocked?', nextProduct, '→', isUnlocked)

      if (isUnlocked) {
        const nextProductName = getProductName(nextProduct)
        console.log('[Unlock] ✅ Unlocking:', nextProductName)
        Diary.addLog(t('msg.unlocked', { product: nextProductName }))
      }
    }
  }

  /**
   * 구매/판매 통합 함수
   */
  function handleTransaction(category, type, currentCount) {
    const qty = getPurchaseQuantity()
    const mode = getPurchaseMode()
    const cash = getCash()
    const settings = getSettings()

    if (mode === 'buy') {
      // 구매 로직
      const cost =
        category === 'financial'
          ? getFinancialCost(type, currentCount, qty)
          : getPropertyCost(type, currentCount, qty)

      if (cash < cost) {
        Diary.addLog(t('msg.insufficientFunds', { amount: NumberFormat.formatKoreanNumber(cost) }))
        return { success: false, newCount: currentCount }
      }

      setCash(cash - cost)
      const newCount = currentCount + qty
      const unit = category === 'financial' ? t('ui.unit.count') : t('ui.unit.property')
      const productName = getProductName(type)
      Diary.addLog(t('msg.purchased', { product: productName, qty, unit, count: newCount }))

      // 구매 성공 시 떨어지는 애니메이션
      const buildingIcons = {
        deposit: '💰',
        savings: '🏦',
        bond: '📈',
        usStock: '🇺🇸',
        crypto: '₿',
        villa: '🏠',
        officetel: '🏢',
        apartment: '🏘️',
        shop: '🏪',
        building: '🏙️',
      }
      if (settings.particles) {
        Animations.createFallingBuilding(buildingIcons[type] || '🏠', qty)
      }

      return { success: true, newCount }
    } else if (mode === 'sell') {
      // 판매 로직
      if (currentCount < qty) {
        Diary.addLog(t('msg.insufficientQuantity', { count: currentCount }))
        return { success: false, newCount: currentCount }
      }

      const sellPrice =
        category === 'financial'
          ? getFinancialSellPrice(type, currentCount, qty)
          : getPropertySellPrice(type, currentCount, qty)

      setCash(cash + sellPrice)
      const newCount = currentCount - qty
      const unit = category === 'financial' ? t('ui.unit.count') : t('ui.unit.property')
      const productName = getProductName(type)
      Diary.addLog(
        t('msg.sold', {
          product: productName,
          qty,
          unit,
          amount: NumberFormat.formatKoreanNumber(sellPrice),
          count: newCount,
        })
      )
      return { success: true, newCount }
    }

    return { success: false, newCount: currentCount }
  }

  /**
   * 구매 성공 애니메이션
   */
  function showPurchaseSuccess(element) {
    if (!element) return
    element.classList.add('purchase-success')
    setTimeout(() => {
      element.classList.remove('purchase-success')
    }, 300)
  }

  /**
   * 시장 이벤트 배수 가져오기
   */
  function getMarketEventMultiplier(type, category) {
    const event = getCurrentMarketEvent()
    if (!event) return 1.0

    const now = Date.now()
    const endTime = getMarketEventEndTime()
    if (endTime <= now) return 1.0

    if (category === 'financial') {
      return event.effects?.financial?.[type] ?? 1.0
    } else if (category === 'property') {
      return event.effects?.property?.[type] ?? 1.0
    }

    return 1.0
  }

  /**
   * 시장 이벤트 시작
   */
  function startMarketEvent() {
    const event = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)]
    setCurrentMarketEvent(event)
    const duration = 30000 + Math.random() * 30000 // 30-60초
    setMarketEventEndTime(Date.now() + duration)
    showMarketEventNotification(event)
  }

  /**
   * 시장 이벤트 알림 표시
   */
  function showMarketEventNotification(event) {
    if (!event) return
    Diary.addLog(`📈 ${event.name}`)
  }

  /**
   * 시장 이벤트 체크 (주기적으로 호출)
   */
  function checkMarketEvent() {
    const event = getCurrentMarketEvent()
    if (event && getMarketEventEndTime() <= Date.now()) {
      setCurrentMarketEvent(null)
    }
  }

  /**
   * 투자 섹션 시장 이벤트 UI 업데이트
   */
  let __marketImpactCache = null
  function updateInvestmentMarketImpactUI() {
    try {
      const now = Date.now()
      const currentMarketEvent = getCurrentMarketEvent()
      const marketEventEndTime = getMarketEventEndTime()
      const isEventActive = !!(currentMarketEvent && marketEventEndTime > now)
      const remainingSec = isEventActive
        ? Math.max(0, Math.ceil((marketEventEndTime - now) / 1000))
        : 0

      // 투자 섹션 상단에 이벤트명/잔여시간 표시
      const marketEventBar = document.getElementById('marketEventBar')
      if (marketEventBar) {
        if (!isEventActive) {
          marketEventBar.classList.remove('is-visible')
          marketEventBar.textContent = ''
        } else {
          marketEventBar.classList.add('is-visible')
          const evName = currentMarketEvent?.name
            ? String(currentMarketEvent.name)
            : t('ui.marketEvent')
          const seconds = Math.floor((marketEventEndTime - now) / 1000)
          const secText =
            seconds >= 0 ? `${seconds}${t('ui.second', {}, '초')}` : `0${t('ui.second', {}, '초')}`
          // 영향 요약(배수≠1 항목 5개 이내)
          const summarize = (effects, names) => {
            if (!effects) return []
            return Object.entries(effects)
              .filter(([, m]) => m !== 1.0)
              .slice(0, 5)
              .map(
                ([k, m]) =>
                  `${names[k] ?? k} x${(Math.round(m * 10) / 10).toString().replace(/\.0$/, '')}`
              )
          }
          const finNames = {
            deposit: getProductName('deposit'),
            savings: getProductName('savings'),
            bond: getProductName('bond'),
            usStock: getProductName('usStock'),
            crypto: getProductName('crypto'),
          }
          const propNames = {
            villa: getProductName('villa'),
            officetel: getProductName('officetel'),
            apartment: getProductName('apartment'),
            shop: getProductName('shop'),
            building: getProductName('building'),
          }
          const fin = summarize(currentMarketEvent?.effects?.financial, finNames)
          const prop = summarize(currentMarketEvent?.effects?.property, propNames)
          const parts = [...fin, ...prop].slice(0, 5)
          const hint = parts.length ? ` · ${parts.join(', ')}` : ''
          marketEventBar.innerHTML = `📈 <b>${evName}</b> · ${t('ui.remaining')} <span class="good">${secText}</span>${hint}`
        }
      }

      if (!__marketImpactCache) {
        const targets = [
          // 금융
          { rowId: 'depositItem', category: 'financial', type: 'deposit' },
          { rowId: 'savingsItem', category: 'financial', type: 'savings' },
          { rowId: 'bondItem', category: 'financial', type: 'bond' },
          { rowId: 'usStockItem', category: 'financial', type: 'usStock' },
          { rowId: 'cryptoItem', category: 'financial', type: 'crypto' },
          // 부동산
          { rowId: 'villaItem', category: 'property', type: 'villa' },
          { rowId: 'officetelItem', category: 'property', type: 'officetel' },
          { rowId: 'aptItem', category: 'property', type: 'apartment' },
          { rowId: 'shopItem', category: 'property', type: 'shop' },
          { rowId: 'buildingItem', category: 'property', type: 'building' },
        ]

        __marketImpactCache = targets
          .map(t => {
            const row = document.getElementById(t.rowId)
            if (!row) return null

            // 버튼 왼쪽에 배지 삽입(시야성 최고)
            const btn = row.querySelector('button.btn')
            if (!btn) return null

            let badge = row.querySelector('.event-mult-badge')
            if (!badge) {
              badge = document.createElement('span')
              badge.className = 'event-mult-badge'
              badge.setAttribute('aria-hidden', 'true')
              row.insertBefore(badge, btn)
            }

            return { ...t, row, badge }
          })
          .filter(Boolean)
      }

      for (const t of __marketImpactCache) {
        const mult = isEventActive ? getMarketEventMultiplier(t.type, t.category) : 1.0
        const isNeutral = Math.abs(mult - 1.0) < 1e-9

        // reset
        t.row.classList.remove('event-bull', 'event-bear')
        t.badge.classList.remove('is-visible', 'is-bull', 'is-bear')
        t.badge.removeAttribute('title')

        if (!isEventActive || isNeutral) {
          t.badge.textContent = ''
          continue
        }

        const multNum = Math.round(mult * 10) / 10
        const multText = `x${multNum.toFixed(1).replace(/\.0$/, '')}`

        t.badge.textContent = multText
        t.badge.classList.add('is-visible')

        if (mult > 1.0) {
          t.row.classList.add('event-bull')
          t.badge.classList.add('is-bull')
        } else {
          t.row.classList.add('event-bear')
          t.badge.classList.add('is-bear')
        }

        // 툴팁: 이벤트명 + 남은 시간 + 배수
        const evName = currentMarketEvent?.name ? String(currentMarketEvent.name) : '시장 이벤트'
        t.badge.title = `${evName} · 남은 ${remainingSec}초 · ${multText}`
      }
    } catch (e) {
      // UI 보조 기능이므로 실패해도 게임 진행은 유지
    }
  }

  /**
   * 상품 잠금 상태 업데이트
   */
  function updateProductLockStates() {
    console.log('[Unlock] updateProductLockStates called')

    // 해금 조건 메시지
    const unlockHints = {
      savings: '예금 1개 필요',
      bond: '적금 1개 필요',
      usStock: '국내주식 1개 필요',
      crypto: '미국주식 1개 필요',
      villa: '코인 1개 필요',
      officetel: '빌라 1채 필요',
      apartment: '오피스텔 1채 필요',
      shop: '아파트 1채 필요',
      building: '상가 1채 필요',
      tower: 'CEO 달성 및 빌딩 1개 이상 필요',
    }

    const products = [
      'savings',
      'bond',
      'usStock',
      'crypto',
      'villa',
      'officetel',
      'apartment',
      'shop',
      'building',
      'tower',
    ]

    const itemIdMap = {
      savings: 'savingsItem',
      bond: 'bondItem',
      usStock: 'usStockItem',
      crypto: 'cryptoItem',
      villa: 'villaItem',
      officetel: 'officetelItem',
      apartment: 'aptItem',
      shop: 'shopItem',
      building: 'buildingItem',
      tower: 'towerItem',
    }

    products.forEach(product => {
      const itemElement = document.getElementById(itemIdMap[product])
      if (itemElement) {
        const isLocked = !isProductUnlocked(product)
        console.log('[Unlock] Product:', product, 'isLocked:', isLocked, 'element found:', !!itemElement)
        itemElement.classList.toggle('locked', isLocked)
        if (isLocked) {
          itemElement.setAttribute('data-unlock-hint', unlockHints[product])
        } else {
          itemElement.removeAttribute('data-unlock-hint')
        }
      } else {
        console.warn('[Unlock] ⚠️ Element not found for product:', product, 'ID:', itemIdMap[product])
      }
    })
  }

  /**
   * 개별 버튼 텍스트 및 스타일 업데이트 함수
   */
  function updateButton(button, category, type, count, isBuy, qty) {
    if (!button) return

    const price = isBuy
      ? category === 'financial'
        ? getFinancialCost(type, count, qty)
        : getPropertyCost(type, count, qty)
      : category === 'financial'
        ? getFinancialSellPrice(type, count, qty)
        : getPropertySellPrice(type, count, qty)

    const modeText = isBuy ? t('button.buy') : t('button.sell')
    const qtyText = qty > 1 ? ` x${qty}` : ''

    // 버튼 텍스트: 가격 제거, 모드와 수량만 표시
    button.textContent = `${modeText}${qtyText}`

    const cash = getCash()

    // 버튼 색상 및 활성화 상태
    if (isBuy) {
      button.style.background = ''
      button.disabled = cash < price
    } else {
      // 판매 모드: 판매 가능하면 빨간색, 불가능하면 회색
      const canSell = count >= qty
      button.style.background = canSell ? 'var(--bad)' : 'var(--muted)'
      button.disabled = !canSell
    }
  }

  /**
   * 이벤트 리스너 초기화
   */
  function initInvestmentEventListeners(elements) {
    const {
      elBuyDeposit,
      elBuySavings,
      elBuyBond,
      elBuyUsStock,
      elBuyCrypto,
      elBuyVilla,
      elBuyOfficetel,
      elBuyApartment,
      elBuyShop,
      elBuyBuilding,
      elBuyTower,
    } = elements

    // 금융상품 거래 이벤트
    if (elBuyDeposit) {
      elBuyDeposit.addEventListener('click', () => {
        if (!isProductUnlocked('deposit')) {
          Diary.addLog('❌ 예금은 아직 잠겨있습니다.')
          return
        }
        const result = handleTransaction('financial', 'deposit', getDeposits())
        if (result.success) {
          setDeposits(result.newCount)
          showPurchaseSuccess(elBuyDeposit)
          checkNewUnlocks('deposit')
        }
        updateUI()
      })
    }

    if (elBuySavings) {
      elBuySavings.addEventListener('click', () => {
        if (!isProductUnlocked('savings')) {
          Diary.addLog(t('msg.unlock.savings'))
          return
        }
        const result = handleTransaction('financial', 'savings', getSavings())
        if (result.success) {
          setSavings(result.newCount)
          showPurchaseSuccess(elBuySavings)
          checkNewUnlocks('savings')
        }
        updateUI()
      })
    }

    if (elBuyBond) {
      elBuyBond.addEventListener('click', () => {
        if (!isProductUnlocked('bond')) {
          Diary.addLog(t('msg.unlock.bond'))
          return
        }
        const result = handleTransaction('financial', 'bond', getBonds())
        if (result.success) {
          setBonds(result.newCount)
          showPurchaseSuccess(elBuyBond)
          checkNewUnlocks('bond')
        }
        updateUI()
      })
    }

    if (elBuyUsStock) {
      elBuyUsStock.addEventListener('click', () => {
        if (!isProductUnlocked('usStock')) {
          Diary.addLog('❌ 미국주식은 국내주식을 1개 이상 보유해야 해금됩니다.')
          return
        }
        const result = handleTransaction('financial', 'usStock', getUsStocks())
        if (result.success) {
          setUsStocks(result.newCount)
          showPurchaseSuccess(elBuyUsStock)
          checkNewUnlocks('usStock')
        }
        updateUI()
      })
    }

    if (elBuyCrypto) {
      elBuyCrypto.addEventListener('click', () => {
        if (!isProductUnlocked('crypto')) {
          Diary.addLog('❌ 코인은 미국주식을 1개 이상 보유해야 해금됩니다.')
          return
        }
        const result = handleTransaction('financial', 'crypto', getCryptos())
        if (result.success) {
          setCryptos(result.newCount)
          showPurchaseSuccess(elBuyCrypto)
          checkNewUnlocks('crypto')
        }
        updateUI()
      })
    }

    // 부동산 거래 이벤트
    if (elBuyVilla) {
      elBuyVilla.addEventListener('click', () => {
        if (!isProductUnlocked('villa')) {
          Diary.addLog('❌ 빌라는 코인을 1개 이상 보유해야 해금됩니다.')
          return
        }
        const result = handleTransaction('property', 'villa', getVillas())
        if (result.success) {
          setVillas(result.newCount)
          showPurchaseSuccess(elBuyVilla)
          checkNewUnlocks('villa')
        }
        updateUI()
      })
    }

    if (elBuyOfficetel) {
      elBuyOfficetel.addEventListener('click', () => {
        if (!isProductUnlocked('officetel')) {
          Diary.addLog('❌ 오피스텔은 빌라를 1개 이상 보유해야 해금됩니다.')
          return
        }
        const result = handleTransaction('property', 'officetel', getOfficetels())
        if (result.success) {
          setOfficetels(result.newCount)
          showPurchaseSuccess(elBuyOfficetel)
          checkNewUnlocks('officetel')
        }
        updateUI()
      })
    }

    if (elBuyApartment) {
      elBuyApartment.addEventListener('click', () => {
        if (!isProductUnlocked('apartment')) {
          Diary.addLog('❌ 아파트는 오피스텔을 1개 이상 보유해야 해금됩니다.')
          return
        }
        const result = handleTransaction('property', 'apartment', getApartments())
        if (result.success) {
          setApartments(result.newCount)
          showPurchaseSuccess(elBuyApartment)
          checkNewUnlocks('apartment')
        }
        updateUI()
      })
    }

    if (elBuyShop) {
      elBuyShop.addEventListener('click', () => {
        if (!isProductUnlocked('shop')) {
          Diary.addLog('❌ 상가는 아파트를 1개 이상 보유해야 해금됩니다.')
          return
        }
        const result = handleTransaction('property', 'shop', getShops())
        if (result.success) {
          setShops(result.newCount)
          showPurchaseSuccess(elBuyShop)
          checkNewUnlocks('shop')
        }
        updateUI()
      })
    }

    if (elBuyBuilding) {
      elBuyBuilding.addEventListener('click', () => {
        if (!isProductUnlocked('building')) {
          Diary.addLog('❌ 빌딩은 상가를 1개 이상 보유해야 해금됩니다.')
          return
        }
        const result = handleTransaction('property', 'building', getBuildings())
        if (result.success) {
          setBuildings(result.newCount)
          showPurchaseSuccess(elBuyBuilding)
          checkNewUnlocks('building')
        }
        updateUI()
      })
    }

    if (elBuyTower) {
      elBuyTower.addEventListener('click', () => {
        if (!isProductUnlocked('tower')) {
          Diary.addLog('❌ 서울타워는 CEO 달성 및 빌딩 1개 이상이 필요합니다.')
          return
        }
        const result = handleTransaction('property', 'tower', deps.getTower())
        if (result.success) {
          deps.setTower(result.newCount)
          showPurchaseSuccess(elBuyTower)
        }
        updateUI()
      })
    }
  }

  return {
    getProductName,
    isProductUnlocked,
    checkNewUnlocks,
    handleTransaction,
    showPurchaseSuccess,
    getMarketEventMultiplier,
    startMarketEvent,
    showMarketEventNotification,
    checkMarketEvent,
    updateInvestmentMarketImpactUI,
    updateProductLockStates,
    updateButton,
    initInvestmentEventListeners,
  }
}
