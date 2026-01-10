// 가격/판매 계산 로직
// - 수량 구매/판매 시 누적합을 정확히 계산
// - 판매 가격은 balance 설정 파일의 환급률을 사용

import {
  FINANCIAL_COSTS as BALANCE_FINANCIAL_COSTS,
  FINANCIAL_COST_GROWTH,
  FINANCIAL_SELL_RATE,
} from '../balance/financial.js'
import { BASE_COSTS as BALANCE_PROPERTY_COSTS, PROPERTY_SELL_RATE } from '../balance/property.js'

// 레거시 호환성을 위해 export (실제로는 balance 파일 값 사용)
export const FINANCIAL_COSTS = BALANCE_FINANCIAL_COSTS
export const PROPERTY_COSTS = BALANCE_PROPERTY_COSTS

const DEFAULT_GROWTH = FINANCIAL_COST_GROWTH // balance 파일에서 가져옴

function sumGeometricCost(baseCost, startIndex, quantity, growth = DEFAULT_GROWTH) {
  let total = 0
  for (let i = 0; i < quantity; i++) {
    const idx = startIndex + i
    total += baseCost * Math.pow(growth, idx)
  }
  return Math.floor(total)
}

export function getFinancialCost(type, count, quantity = 1) {
  const baseCost = FINANCIAL_COSTS[type]
  if (!baseCost || quantity <= 0) return 0
  return sumGeometricCost(baseCost, count, quantity)
}

export function getPropertyCost(type, count, quantity = 1) {
  const baseCost = PROPERTY_COSTS[type]
  if (!baseCost || quantity <= 0) return 0
  return sumGeometricCost(baseCost, count, quantity)
}

export function getFinancialSellPrice(type, count, quantity = 1) {
  if (count <= 0 || quantity <= 0) return 0

  let total = 0
  for (let i = 0; i < quantity; i++) {
    if (count - i <= 0) break
    const buyPrice = getFinancialCost(type, count - i - 1, 1)
    total += Math.floor(buyPrice * FINANCIAL_SELL_RATE)
  }
  return total
}

export function getPropertySellPrice(type, count, quantity = 1) {
  if (count <= 0 || quantity <= 0) return 0

  let total = 0
  for (let i = 0; i < quantity; i++) {
    if (count - i <= 0) break
    const buyPrice = getPropertyCost(type, count - i - 1, 1)
    total += Math.floor(buyPrice * PROPERTY_SELL_RATE)
  }
  return total
}

// (레거시) 단계별 가격 증가율 시스템: 현재 main.js에서는 사용하지 않지만
// 추후 난이도 곡선 변경 시 활용할 수 있도록 남겨둠.
export function getPriceMultiplierByTier(count) {
  if (count < 5) return 1.05
  if (count < 15) return 1.1
  if (count < 30) return 1.15
  return 1.2
}
