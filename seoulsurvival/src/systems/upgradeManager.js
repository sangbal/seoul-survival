/**
 * Seoul Survival - Upgrade Management System
 *
 * 업그레이드 구매, 렌더링, affordability 체크 관리
 */

import * as NumberFormat from '../utils/numberFormat.js'
import { t } from '../i18n/index.js'
import * as Diary from './diary.js'

// 개발 모드 체크 (디버깅 로그 제어용)
const __IS_DEV__ = !!import.meta?.env?.DEV

/**
 * 업그레이드 관리 시스템 생성
 * @param {Object} deps - 의존성
 * @param {Object} deps.UPGRADES - 업그레이드 객체
 * @param {Function} deps.getCash - 현재 cash 반환 함수
 * @param {Function} deps.setCash - cash 설정 함수
 * @param {Object} deps.CAREER_LEVELS - 직급 레벨 정보
 * @returns {Object} 업그레이드 관리 함수들
 */
export function createUpgradeManager(deps) {
  const { UPGRADES, getCash, setCash, CAREER_LEVELS } = deps

  /**
   * 업그레이드 affordability 업데이트 (클래스만 토글)
   */
  function updateUpgradeAffordability() {
    const cash = getCash()
    const upgradeItems = document.querySelectorAll('.upgrade-item')

    upgradeItems.forEach(item => {
      const upgradeId = item.dataset.upgradeId
      const upgrade = UPGRADES[upgradeId]

      if (upgrade && !upgrade.purchased) {
        if (cash >= upgrade.cost) {
          item.classList.add('affordable')
        } else {
          item.classList.remove('affordable')
        }
      }
    })
  }

  /**
   * 업그레이드 진행률 업데이트
   */
  function updateUpgradeProgress(totalClicks) {
    const progressElements = document.querySelectorAll('.upgrade-progress')

    progressElements.forEach(progressEl => {
      const upgradeItem = progressEl.closest('.upgrade-item')
      if (!upgradeItem) return

      const upgradeId = upgradeItem.dataset.upgradeId
      if (!upgradeId) return

      const lockedUpgrades = Object.entries(UPGRADES)
        .filter(([id, u]) => u.category === 'labor' && !u.unlocked && !u.purchased)
        .map(([id, u]) => {
          const conditionStr = u.unlockCondition.toString()
          const match = conditionStr.match(/totalClicks\s*>=\s*(\d+)/)
          if (match) {
            return { id, requiredClicks: parseInt(match[1]), upgrade: u }
          }
          const careerMatch = conditionStr.match(/careerLevel\s*>=\s*(\d+)/)
          if (careerMatch) {
            return {
              id,
              requiredClicks: CAREER_LEVELS[parseInt(careerMatch[1])]?.requiredClicks || Infinity,
              upgrade: u,
            }
          }
          return null
        })
        .filter(x => x !== null)
        .sort((a, b) => a.requiredClicks - b.requiredClicks)

      progressEl.textContent = ''
    })
  }

  /**
   * 업그레이드 리스트 UI 생성
   */
  function updateUpgradeList() {
    const cash = getCash()
    const upgradeList = document.getElementById('upgradeList')
    const upgradeCount = document.getElementById('upgradeCount')

    if (!upgradeList || !upgradeCount) return

    const availableUpgrades = Object.entries(UPGRADES).filter(
      ([id, upgrade]) => upgrade.unlocked && !upgrade.purchased
    )

    upgradeCount.textContent = `(${availableUpgrades.length})`

    const noUpgradesMsg = document.getElementById('noUpgradesMessage')
    if (availableUpgrades.length === 0) {
      upgradeList.innerHTML = ''
      if (noUpgradesMsg) {
        noUpgradesMsg.textContent = t('ui.noUpgrades')
        noUpgradesMsg.style.display = 'block'
      }
      return
    }

    if (noUpgradesMsg) {
      noUpgradesMsg.style.display = 'none'
    }

    upgradeList.innerHTML = ''

    if (__IS_DEV__) {
      console.log(`🔄 Regenerating upgrade list with ${availableUpgrades.length} items`)
    }

    availableUpgrades.forEach(([id, upgrade]) => {
      const item = document.createElement('div')
      item.className = 'upgrade-item'
      item.dataset.upgradeId = id

      if (cash >= upgrade.cost) {
        item.classList.add('affordable')
      }

      const icon = document.createElement('div')
      icon.className = 'upgrade-icon'
      icon.textContent = upgrade.icon

      const info = document.createElement('div')
      info.className = 'upgrade-info'

      const name = document.createElement('div')
      name.className = 'upgrade-name'
      name.textContent = t(`upgrade.${id}.name`, {}, upgrade.name)

      const desc = document.createElement('div')
      desc.className = 'upgrade-desc'
      desc.textContent = t(`upgrade.${id}.desc`, {}, upgrade.desc)

      const priceText = NumberFormat.formatFinancialPrice(upgrade.cost)

      if (upgrade.category === 'labor' && upgrade.unlockCondition) {
        try {
          const progressInfo = document.createElement('div')
          progressInfo.className = 'upgrade-progress'
          progressInfo.style.fontSize = '11px'
          progressInfo.style.color = 'var(--muted)'
          progressInfo.style.marginTop = '4px'

          const lockedUpgrades = Object.entries(UPGRADES)
            .filter(([id, u]) => u.category === 'labor' && !u.unlocked && !u.purchased)
            .map(([id, u]) => {
              const conditionStr = u.unlockCondition.toString()
              const match = conditionStr.match(/totalClicks\s*>=\s*(\d+)/)
              if (match) {
                return { id, requiredClicks: parseInt(match[1]), upgrade: u }
              }
              return null
            })
            .filter(x => x !== null)
            .sort((a, b) => a.requiredClicks - b.requiredClicks)
        } catch (e) {
          // 진행률 계산 실패 시 무시
        }
      }

      info.appendChild(name)
      info.appendChild(desc)

      const status = document.createElement('div')
      status.className = 'upgrade-status'
      status.textContent = priceText
      status.style.animation = 'none'
      status.style.background = 'rgba(94, 234, 212, 0.12)'
      status.style.color = 'var(--accent)'
      status.style.border = '1px solid rgba(94, 234, 212, 0.25)'
      status.style.borderRadius = '999px'

      item.appendChild(icon)
      item.appendChild(info)
      item.appendChild(status)

      item.addEventListener(
        'click',
        e => {
          e.stopPropagation()
          if (__IS_DEV__) console.log('🖱️ Upgrade item clicked!', id)
          purchaseUpgrade(id)
        },
        false
      )

      if (__IS_DEV__) {
        item.addEventListener('mousedown', e => {
          console.log('🖱️ Mousedown detected on upgrade:', id)
        })
      }

      upgradeList.appendChild(item)

      if (__IS_DEV__) {
        console.log(`✅ Upgrade item created and appended: ${id}`, item)
      }
    })
  }

  /**
   * 업그레이드 구매
   */
  function purchaseUpgrade(upgradeId) {
    if (__IS_DEV__) {
      console.log('=== PURCHASE UPGRADE DEBUG ===')
      console.log('Attempting to purchase:', upgradeId)
    }

    const cash = getCash()
    if (__IS_DEV__) console.log('Current cash:', cash)

    const upgrade = UPGRADES[upgradeId]

    if (!upgrade) {
      console.error('업그레이드를 찾을 수 없습니다:', upgradeId)
      if (__IS_DEV__) console.log('Available upgrade IDs:', Object.keys(UPGRADES))
      return
    }

    if (__IS_DEV__) {
      console.log('Upgrade found:', {
        name: upgrade.name,
        cost: upgrade.cost,
        unlocked: upgrade.unlocked,
        purchased: upgrade.purchased,
      })
    }

    if (upgrade.purchased) {
      Diary.addLog(t('msg.upgradeAlreadyPurchased'))
      if (__IS_DEV__) console.log('Already purchased')
      return
    }

    if (cash < upgrade.cost) {
      Diary.addLog(
        t('msg.upgradeInsufficientFunds', { cost: NumberFormat.formatFinancialPrice(upgrade.cost) })
      )
      if (__IS_DEV__) console.log('Not enough cash. Need:', upgrade.cost, 'Have:', cash)
      return
    }

    if (__IS_DEV__) console.log('Purchase successful! Applying effect...')
    setCash(cash - upgrade.cost)
    upgrade.purchased = true

    try {
      upgrade.effect()
      Diary.addLog(
        t('msg.upgradePurchased', {
          name: t(`upgrade.${upgradeId}.name`, {}, upgrade.name),
          desc: t(`upgrade.${upgradeId}.desc`, {}, upgrade.desc),
        })
      )
      if (__IS_DEV__) console.log('Effect applied successfully')
    } catch (error) {
      console.error(`업그레이드 효과 적용 실패 (${upgradeId}):`, error)
      Diary.addLog(`⚠️ 업그레이드 효과 적용 중 오류 발생`)
    }

    updateUpgradeList()
    updateUpgradeAffordability()
  }

  return {
    updateUpgradeAffordability,
    updateUpgradeProgress,
    updateUpgradeList,
    purchaseUpgrade,
  }
}
