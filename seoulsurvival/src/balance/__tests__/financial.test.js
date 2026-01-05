/**
 * Seoul Survival - Financial Balance Tests
 *
 * 금융상품의 가격, 수익, 성장률이 올바르게 정의되었는지 검증합니다.
 */

import { describe, test, expect } from 'vitest'
import {
  FINANCIAL_COSTS,
  DEFAULT_FINANCIAL_INCOME,
  FINANCIAL_COST_GROWTH,
  FINANCIAL_SELL_RATE,
} from '../financial.js'

describe('Financial Balance', () => {
  const PRODUCTS = ['deposit', 'savings', 'bond', 'usStock', 'crypto']

  describe('FINANCIAL_COSTS', () => {
    test('should have all 5 financial products', () => {
      expect(Object.keys(FINANCIAL_COSTS)).toHaveLength(5)
      PRODUCTS.forEach(product => {
        expect(FINANCIAL_COSTS).toHaveProperty(product)
      })
    })

    test('all costs should be positive numbers', () => {
      PRODUCTS.forEach(product => {
        const cost = FINANCIAL_COSTS[product]
        expect(cost).toBeGreaterThan(0)
        expect(typeof cost).toBe('number')
        expect(Number.isFinite(cost)).toBe(true)
      })
    })

    test('costs should be in ascending order (progression)', () => {
      expect(FINANCIAL_COSTS.deposit).toBeLessThan(FINANCIAL_COSTS.savings)
      expect(FINANCIAL_COSTS.savings).toBeLessThan(FINANCIAL_COSTS.bond)
      expect(FINANCIAL_COSTS.bond).toBeLessThan(FINANCIAL_COSTS.usStock)
      expect(FINANCIAL_COSTS.usStock).toBeLessThan(FINANCIAL_COSTS.crypto)
    })

    test('no two products should have the same cost', () => {
      const costs = Object.values(FINANCIAL_COSTS)
      const uniqueCosts = new Set(costs)
      expect(uniqueCosts.size).toBe(costs.length)
    })

    test('costs should be reasonable values', () => {
      // 예금: 5만원
      expect(FINANCIAL_COSTS.deposit).toBe(50_000)
      // 적금: 50만원
      expect(FINANCIAL_COSTS.savings).toBe(500_000)
      // 국내주식: 500만원
      expect(FINANCIAL_COSTS.bond).toBe(5_000_000)
      // 미국주식: 2,500만원
      expect(FINANCIAL_COSTS.usStock).toBe(25_000_000)
      // 코인: 1억원
      expect(FINANCIAL_COSTS.crypto).toBe(100_000_000)
    })
  })

  describe('DEFAULT_FINANCIAL_INCOME', () => {
    test('should have income for all 5 products', () => {
      expect(Object.keys(DEFAULT_FINANCIAL_INCOME)).toHaveLength(5)
      PRODUCTS.forEach(product => {
        expect(DEFAULT_FINANCIAL_INCOME).toHaveProperty(product)
      })
    })

    test('all income values should be positive numbers', () => {
      PRODUCTS.forEach(product => {
        const income = DEFAULT_FINANCIAL_INCOME[product]
        expect(income).toBeGreaterThan(0)
        expect(typeof income).toBe('number')
        expect(Number.isFinite(income)).toBe(true)
      })
    })

    test('income should be in ascending order', () => {
      expect(DEFAULT_FINANCIAL_INCOME.deposit).toBeLessThan(DEFAULT_FINANCIAL_INCOME.savings)
      expect(DEFAULT_FINANCIAL_INCOME.savings).toBeLessThan(DEFAULT_FINANCIAL_INCOME.bond)
      expect(DEFAULT_FINANCIAL_INCOME.bond).toBeLessThan(DEFAULT_FINANCIAL_INCOME.usStock)
      expect(DEFAULT_FINANCIAL_INCOME.usStock).toBeLessThan(DEFAULT_FINANCIAL_INCOME.crypto)
    })

    test('income values should match documentation', () => {
      expect(DEFAULT_FINANCIAL_INCOME.deposit).toBe(50)
      expect(DEFAULT_FINANCIAL_INCOME.savings).toBe(750)
      expect(DEFAULT_FINANCIAL_INCOME.bond).toBe(11_250)
      expect(DEFAULT_FINANCIAL_INCOME.usStock).toBe(60_000)
      expect(DEFAULT_FINANCIAL_INCOME.crypto).toBe(250_000)
    })
  })

  describe('ROI (Return on Investment)', () => {
    test('ROI should be reasonable for all products', () => {
      PRODUCTS.forEach(product => {
        const cost = FINANCIAL_COSTS[product]
        const income = DEFAULT_FINANCIAL_INCOME[product]
        const roiSeconds = cost / income
        const roiMinutes = roiSeconds / 60

        // ROI should be positive
        expect(roiSeconds).toBeGreaterThan(0)

        // ROI should be reasonable (between 5-20 minutes)
        expect(roiMinutes).toBeGreaterThan(5)
        expect(roiMinutes).toBeLessThan(20)
      })
    })

    test('deposit ROI should be approximately 16.7 minutes', () => {
      const roi = FINANCIAL_COSTS.deposit / DEFAULT_FINANCIAL_INCOME.deposit / 60
      expect(roi).toBeCloseTo(16.7, 1)
    })

    test('savings ROI should be approximately 11.1 minutes', () => {
      const roi = FINANCIAL_COSTS.savings / DEFAULT_FINANCIAL_INCOME.savings / 60
      expect(roi).toBeCloseTo(11.1, 1)
    })

    test('bond ROI should be approximately 7.4 minutes', () => {
      const roi = FINANCIAL_COSTS.bond / DEFAULT_FINANCIAL_INCOME.bond / 60
      expect(roi).toBeCloseTo(7.4, 1)
    })

    test('usStock ROI should be approximately 6.9 minutes', () => {
      const roi = FINANCIAL_COSTS.usStock / DEFAULT_FINANCIAL_INCOME.usStock / 60
      expect(roi).toBeCloseTo(6.9, 1)
    })

    test('crypto ROI should be approximately 6.7 minutes', () => {
      const roi = FINANCIAL_COSTS.crypto / DEFAULT_FINANCIAL_INCOME.crypto / 60
      expect(roi).toBeCloseTo(6.7, 1)
    })

    test('higher tier products should have lower ROI (faster payback)', () => {
      const depositROI = FINANCIAL_COSTS.deposit / DEFAULT_FINANCIAL_INCOME.deposit
      const savingsROI = FINANCIAL_COSTS.savings / DEFAULT_FINANCIAL_INCOME.savings
      const bondROI = FINANCIAL_COSTS.bond / DEFAULT_FINANCIAL_INCOME.bond
      const usStockROI = FINANCIAL_COSTS.usStock / DEFAULT_FINANCIAL_INCOME.usStock
      const cryptoROI = FINANCIAL_COSTS.crypto / DEFAULT_FINANCIAL_INCOME.crypto

      expect(savingsROI).toBeLessThan(depositROI)
      expect(bondROI).toBeLessThan(savingsROI)
      expect(usStockROI).toBeLessThan(bondROI)
      expect(cryptoROI).toBeLessThan(usStockROI)
    })
  })

  describe('FINANCIAL_COST_GROWTH', () => {
    test('should be 1.05 (5% growth)', () => {
      expect(FINANCIAL_COST_GROWTH).toBe(1.05)
    })

    test('should be greater than 1', () => {
      expect(FINANCIAL_COST_GROWTH).toBeGreaterThan(1)
    })

    test('should be reasonable (not too high)', () => {
      expect(FINANCIAL_COST_GROWTH).toBeLessThan(1.2)
    })
  })

  describe('FINANCIAL_SELL_RATE', () => {
    test('should be 1.0 (100% refund)', () => {
      expect(FINANCIAL_SELL_RATE).toBe(1.0)
    })

    test('should be between 0 and 1 (inclusive)', () => {
      expect(FINANCIAL_SELL_RATE).toBeGreaterThanOrEqual(0)
      expect(FINANCIAL_SELL_RATE).toBeLessThanOrEqual(1)
    })
  })

  describe('Price growth calculation', () => {
    test('should calculate correct prices for multiple purchases', () => {
      PRODUCTS.forEach(product => {
        const baseCost = FINANCIAL_COSTS[product]

        // 첫 구매
        const price1 = baseCost * Math.pow(FINANCIAL_COST_GROWTH, 0)
        expect(price1).toBe(baseCost)

        // 두 번째 구매
        const price2 = baseCost * Math.pow(FINANCIAL_COST_GROWTH, 1)
        expect(price2).toBe(baseCost * 1.05)

        // 세 번째 구매
        const price3 = baseCost * Math.pow(FINANCIAL_COST_GROWTH, 2)
        expect(price3).toBeCloseTo(baseCost * 1.1025, 0)
      })
    })

    test('price should grow reasonably over 10 purchases', () => {
      PRODUCTS.forEach(product => {
        const baseCost = FINANCIAL_COSTS[product]
        const price10 = baseCost * Math.pow(FINANCIAL_COST_GROWTH, 9)

        // 10번째 구매 시 가격이 기본가의 2배를 넘지 않아야 함
        expect(price10).toBeLessThan(baseCost * 2)
      })
    })
  })

  describe('Data integrity', () => {
    test('should not have NaN values', () => {
      PRODUCTS.forEach(product => {
        expect(Number.isNaN(FINANCIAL_COSTS[product])).toBe(false)
        expect(Number.isNaN(DEFAULT_FINANCIAL_INCOME[product])).toBe(false)
      })
      expect(Number.isNaN(FINANCIAL_COST_GROWTH)).toBe(false)
      expect(Number.isNaN(FINANCIAL_SELL_RATE)).toBe(false)
    })

    test('should not have Infinity values', () => {
      PRODUCTS.forEach(product => {
        expect(Number.isFinite(FINANCIAL_COSTS[product])).toBe(true)
        expect(Number.isFinite(DEFAULT_FINANCIAL_INCOME[product])).toBe(true)
      })
      expect(Number.isFinite(FINANCIAL_COST_GROWTH)).toBe(true)
      expect(Number.isFinite(FINANCIAL_SELL_RATE)).toBe(true)
    })

    test('all values should be integers (except growth rate)', () => {
      PRODUCTS.forEach(product => {
        expect(Number.isInteger(FINANCIAL_COSTS[product])).toBe(true)
        expect(Number.isInteger(DEFAULT_FINANCIAL_INCOME[product])).toBe(true)
      })
      expect(Number.isInteger(FINANCIAL_SELL_RATE)).toBe(true)
      // FINANCIAL_COST_GROWTH는 1.05이므로 정수가 아님
    })
  })
})
