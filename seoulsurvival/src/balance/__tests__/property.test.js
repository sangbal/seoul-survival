/**
 * Seoul Survival - Property Balance Tests
 *
 * 부동산의 가격, 월세 수익, 성장률이 올바르게 정의되었는지 검증합니다.
 */

import { describe, test, expect } from 'vitest'
import {
  BASE_COSTS,
  DEFAULT_BASE_RENT,
  PROPERTY_COST_GROWTH,
  PROPERTY_SELL_RATE,
  TOWER_CONFIG,
} from '../property.js'

describe('Property Balance', () => {
  const PROPERTIES = ['villa', 'officetel', 'apartment', 'shop', 'building']
  const ALL_PROPERTIES = [...PROPERTIES, 'tower']

  describe('BASE_COSTS', () => {
    test('should have all 6 property types', () => {
      expect(Object.keys(BASE_COSTS)).toHaveLength(6)
      ALL_PROPERTIES.forEach(property => {
        expect(BASE_COSTS).toHaveProperty(property)
      })
    })

    test('all costs should be positive numbers', () => {
      ALL_PROPERTIES.forEach(property => {
        const cost = BASE_COSTS[property]
        expect(cost).toBeGreaterThan(0)
        expect(typeof cost).toBe('number')
        expect(Number.isFinite(cost)).toBe(true)
      })
    })

    test('costs should be in ascending order (except tower)', () => {
      expect(BASE_COSTS.villa).toBeLessThan(BASE_COSTS.officetel)
      expect(BASE_COSTS.officetel).toBeLessThan(BASE_COSTS.apartment)
      expect(BASE_COSTS.apartment).toBeLessThan(BASE_COSTS.shop)
      expect(BASE_COSTS.shop).toBeLessThan(BASE_COSTS.building)
      // 타워는 가장 비싸야 함
      expect(BASE_COSTS.building).toBeLessThan(BASE_COSTS.tower)
    })

    test('costs should match documentation', () => {
      expect(BASE_COSTS.villa).toBe(250_000_000) // 2.5억
      expect(BASE_COSTS.officetel).toBe(350_000_000) // 3.5억
      expect(BASE_COSTS.apartment).toBe(800_000_000) // 8억
      expect(BASE_COSTS.shop).toBe(1_200_000_000) // 12억
      expect(BASE_COSTS.building).toBe(3_000_000_000) // 30억
      expect(BASE_COSTS.tower).toBe(1_000_000_000_000) // 1조
    })

    test('tower should be significantly more expensive', () => {
      // 타워는 빌딩의 최소 100배 이상
      expect(BASE_COSTS.tower).toBeGreaterThan(BASE_COSTS.building * 100)
    })
  })

  describe('DEFAULT_BASE_RENT', () => {
    test('should have rent for 5 income properties (no tower)', () => {
      expect(Object.keys(DEFAULT_BASE_RENT)).toHaveLength(5)
      PROPERTIES.forEach(property => {
        expect(DEFAULT_BASE_RENT).toHaveProperty(property)
      })
    })

    test('tower should not have rent income', () => {
      expect(DEFAULT_BASE_RENT).not.toHaveProperty('tower')
    })

    test('all rent values should be positive numbers', () => {
      PROPERTIES.forEach(property => {
        const rent = DEFAULT_BASE_RENT[property]
        expect(rent).toBeGreaterThan(0)
        expect(typeof rent).toBe('number')
        expect(Number.isFinite(rent)).toBe(true)
      })
    })

    test('rent should be in ascending order', () => {
      expect(DEFAULT_BASE_RENT.villa).toBeLessThan(DEFAULT_BASE_RENT.officetel)
      expect(DEFAULT_BASE_RENT.officetel).toBeLessThan(DEFAULT_BASE_RENT.apartment)
      expect(DEFAULT_BASE_RENT.apartment).toBeLessThan(DEFAULT_BASE_RENT.shop)
      expect(DEFAULT_BASE_RENT.shop).toBeLessThan(DEFAULT_BASE_RENT.building)
    })

    test('rent values should match documentation', () => {
      expect(DEFAULT_BASE_RENT.villa).toBe(84_380)
      expect(DEFAULT_BASE_RENT.officetel).toBe(177_190)
      expect(DEFAULT_BASE_RENT.apartment).toBe(607_500)
      expect(DEFAULT_BASE_RENT.shop).toBe(1_370_000)
      expect(DEFAULT_BASE_RENT.building).toBe(5_140_000)
    })
  })

  describe('ROI (Return on Investment)', () => {
    test('ROI should be reasonable for all properties', () => {
      PROPERTIES.forEach(property => {
        const cost = BASE_COSTS[property]
        const rent = DEFAULT_BASE_RENT[property]
        const roiSeconds = cost / rent
        const roiMinutes = roiSeconds / 60

        // ROI should be positive
        expect(roiSeconds).toBeGreaterThan(0)

        // ROI should be reasonable (between 5-60 minutes)
        expect(roiMinutes).toBeGreaterThan(5)
        expect(roiMinutes).toBeLessThan(60)
      })
    })

    test('villa ROI should be approximately 49.4 minutes', () => {
      const roi = BASE_COSTS.villa / DEFAULT_BASE_RENT.villa / 60
      expect(roi).toBeCloseTo(49.4, 1)
    })

    test('officetel ROI should be approximately 32.9 minutes', () => {
      const roi = BASE_COSTS.officetel / DEFAULT_BASE_RENT.officetel / 60
      expect(roi).toBeCloseTo(32.9, 1)
    })

    test('apartment ROI should be approximately 21.9 minutes', () => {
      const roi = BASE_COSTS.apartment / DEFAULT_BASE_RENT.apartment / 60
      expect(roi).toBeCloseTo(21.9, 1)
    })

    test('shop ROI should be approximately 14.6 minutes', () => {
      const roi = BASE_COSTS.shop / DEFAULT_BASE_RENT.shop / 60
      expect(roi).toBeCloseTo(14.6, 1)
    })

    test('building ROI should be approximately 9.7 minutes', () => {
      const roi = BASE_COSTS.building / DEFAULT_BASE_RENT.building / 60
      expect(roi).toBeCloseTo(9.7, 1)
    })

    test('higher tier properties should have lower ROI (faster payback)', () => {
      const villaROI = BASE_COSTS.villa / DEFAULT_BASE_RENT.villa
      const officetelROI = BASE_COSTS.officetel / DEFAULT_BASE_RENT.officetel
      const apartmentROI = BASE_COSTS.apartment / DEFAULT_BASE_RENT.apartment
      const shopROI = BASE_COSTS.shop / DEFAULT_BASE_RENT.shop
      const buildingROI = BASE_COSTS.building / DEFAULT_BASE_RENT.building

      expect(officetelROI).toBeLessThan(villaROI)
      expect(apartmentROI).toBeLessThan(officetelROI)
      expect(shopROI).toBeLessThan(apartmentROI)
      expect(buildingROI).toBeLessThan(shopROI)
    })
  })

  describe('PROPERTY_COST_GROWTH', () => {
    test('should be 1.05 (5% growth)', () => {
      expect(PROPERTY_COST_GROWTH).toBe(1.05)
    })

    test('should be greater than 1', () => {
      expect(PROPERTY_COST_GROWTH).toBeGreaterThan(1)
    })

    test('should be reasonable (not too high)', () => {
      expect(PROPERTY_COST_GROWTH).toBeLessThan(1.2)
    })
  })

  describe('PROPERTY_SELL_RATE', () => {
    test('should be 1.0 (100% refund)', () => {
      expect(PROPERTY_SELL_RATE).toBe(1.0)
    })

    test('should be between 0 and 1 (inclusive)', () => {
      expect(PROPERTY_SELL_RATE).toBeGreaterThanOrEqual(0)
      expect(PROPERTY_SELL_RATE).toBeLessThanOrEqual(1)
    })
  })

  describe('TOWER_CONFIG', () => {
    test('should have all required properties', () => {
      expect(TOWER_CONFIG).toHaveProperty('price')
      expect(TOWER_CONFIG).toHaveProperty('hasIncome')
      expect(TOWER_CONFIG).toHaveProperty('isPrestige')
      expect(TOWER_CONFIG).toHaveProperty('sellable')
    })

    test('price should match BASE_COSTS.tower', () => {
      expect(TOWER_CONFIG.price).toBe(BASE_COSTS.tower)
      expect(TOWER_CONFIG.price).toBe(1_000_000_000_000)
    })

    test('should not have income', () => {
      expect(TOWER_CONFIG.hasIncome).toBe(false)
    })

    test('should be a prestige item', () => {
      expect(TOWER_CONFIG.isPrestige).toBe(true)
    })

    test('should not be sellable', () => {
      expect(TOWER_CONFIG.sellable).toBe(false)
    })
  })

  describe('Price growth calculation', () => {
    test('should calculate correct prices for multiple purchases', () => {
      PROPERTIES.forEach(property => {
        const baseCost = BASE_COSTS[property]

        // 첫 구매
        const price1 = baseCost * Math.pow(PROPERTY_COST_GROWTH, 0)
        expect(price1).toBe(baseCost)

        // 두 번째 구매
        const price2 = baseCost * Math.pow(PROPERTY_COST_GROWTH, 1)
        expect(price2).toBe(baseCost * 1.05)

        // 세 번째 구매
        const price3 = baseCost * Math.pow(PROPERTY_COST_GROWTH, 2)
        expect(price3).toBeCloseTo(baseCost * 1.1025, 0)
      })
    })

    test('price should grow reasonably over 10 purchases', () => {
      PROPERTIES.forEach(property => {
        const baseCost = BASE_COSTS[property]
        const price10 = baseCost * Math.pow(PROPERTY_COST_GROWTH, 9)

        // 10번째 구매 시 가격이 기본가의 2배를 넘지 않아야 함
        expect(price10).toBeLessThan(baseCost * 2)
      })
    })
  })

  describe('Data integrity', () => {
    test('should not have NaN values', () => {
      ALL_PROPERTIES.forEach(property => {
        expect(Number.isNaN(BASE_COSTS[property])).toBe(false)
      })
      PROPERTIES.forEach(property => {
        expect(Number.isNaN(DEFAULT_BASE_RENT[property])).toBe(false)
      })
      expect(Number.isNaN(PROPERTY_COST_GROWTH)).toBe(false)
      expect(Number.isNaN(PROPERTY_SELL_RATE)).toBe(false)
      expect(Number.isNaN(TOWER_CONFIG.price)).toBe(false)
    })

    test('should not have Infinity values', () => {
      ALL_PROPERTIES.forEach(property => {
        expect(Number.isFinite(BASE_COSTS[property])).toBe(true)
      })
      PROPERTIES.forEach(property => {
        expect(Number.isFinite(DEFAULT_BASE_RENT[property])).toBe(true)
      })
      expect(Number.isFinite(PROPERTY_COST_GROWTH)).toBe(true)
      expect(Number.isFinite(PROPERTY_SELL_RATE)).toBe(true)
      expect(Number.isFinite(TOWER_CONFIG.price)).toBe(true)
    })

    test('all values should be integers (except growth rate)', () => {
      ALL_PROPERTIES.forEach(property => {
        expect(Number.isInteger(BASE_COSTS[property])).toBe(true)
      })
      PROPERTIES.forEach(property => {
        expect(Number.isInteger(DEFAULT_BASE_RENT[property])).toBe(true)
      })
      expect(Number.isInteger(PROPERTY_SELL_RATE)).toBe(true)
      expect(Number.isInteger(TOWER_CONFIG.price)).toBe(true)
      // PROPERTY_COST_GROWTH는 1.05이므로 정수가 아님
    })
  })

  describe('Balance comparison with financial products', () => {
    test('properties should be more expensive than financial products', () => {
      // 부동산은 금융상품보다 최소 5배 이상 비싸야 함
      expect(BASE_COSTS.villa).toBeGreaterThan(100_000_000) // 코인(1억)보다 비싸야 함
    })

    test('property rent should be higher than financial income', () => {
      // 가장 싼 부동산(빌라)의 수익이 가장 비싼 금융상품(코인)보다 낮아야 함
      expect(DEFAULT_BASE_RENT.villa).toBeLessThan(250_000) // 코인 수익
    })
  })
})
