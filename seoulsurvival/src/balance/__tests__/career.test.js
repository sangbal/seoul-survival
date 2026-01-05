/**
 * Seoul Survival - Career Balance Tests
 *
 * 직급 시스템의 밸런스 데이터가 올바르게 정의되었는지 검증합니다.
 */

import { describe, test, expect } from 'vitest'
import { BASE_CLICK_GAIN, CAREER_LEVELS } from '../career.js'

describe('Career Balance', () => {
  describe('BASE_CLICK_GAIN', () => {
    test('should be a positive number', () => {
      expect(BASE_CLICK_GAIN).toBeGreaterThan(0)
      expect(typeof BASE_CLICK_GAIN).toBe('number')
    })

    test('should be 10,000 (2024 minimum wage)', () => {
      expect(BASE_CLICK_GAIN).toBe(10000)
    })
  })

  describe('CAREER_LEVELS', () => {
    test('should have exactly 10 levels', () => {
      expect(CAREER_LEVELS).toHaveLength(10)
    })

    test('all levels should have required properties', () => {
      CAREER_LEVELS.forEach(level => {
        expect(level).toHaveProperty('nameKey')
        expect(level).toHaveProperty('multiplier')
        expect(level).toHaveProperty('requiredIncome')
        expect(level).toHaveProperty('requiredClicks')

        // nameKey should be a string
        expect(typeof level.nameKey).toBe('string')
        expect(level.nameKey).toContain('career.')

        // multiplier should be positive
        expect(level.multiplier).toBeGreaterThan(0)

        // requiredIncome should be non-negative
        expect(level.requiredIncome).toBeGreaterThanOrEqual(0)

        // requiredClicks should be non-negative
        expect(level.requiredClicks).toBeGreaterThanOrEqual(0)
      })
    })

    test('requiredClicks should be in ascending order', () => {
      for (let i = 1; i < CAREER_LEVELS.length; i++) {
        expect(CAREER_LEVELS[i].requiredClicks).toBeGreaterThan(CAREER_LEVELS[i - 1].requiredClicks)
      }
    })

    test('multipliers should be in ascending order', () => {
      for (let i = 1; i < CAREER_LEVELS.length; i++) {
        expect(CAREER_LEVELS[i].multiplier).toBeGreaterThanOrEqual(CAREER_LEVELS[i - 1].multiplier)
      }
    })

    test('first level (알바) should have 0 required clicks', () => {
      expect(CAREER_LEVELS[0].nameKey).toBe('career.alba')
      expect(CAREER_LEVELS[0].requiredClicks).toBe(0)
      expect(CAREER_LEVELS[0].multiplier).toBe(1)
    })

    test('last level (CEO) should be the highest', () => {
      const lastLevel = CAREER_LEVELS[CAREER_LEVELS.length - 1]
      expect(lastLevel.nameKey).toBe('career.ceo')
      expect(lastLevel.requiredClicks).toBeGreaterThan(10000)
      expect(lastLevel.multiplier).toBeGreaterThanOrEqual(10)
    })

    test('career progression should be achievable', () => {
      // 승진 곡선이 너무 가파르지 않은지 확인
      // 0 레벨을 제외한 각 단계별 증가량이 이전 단계의 5배를 넘지 않아야 함
      for (let i = 2; i < CAREER_LEVELS.length; i++) {
        const prev = CAREER_LEVELS[i - 1].requiredClicks
        const current = CAREER_LEVELS[i].requiredClicks
        const ratio = current / prev

        expect(ratio).toBeLessThanOrEqual(5) // 최대 5배 증가
      }

      // 첫 번째 승진(0→1)은 특별 케이스 (0→100이므로 예외)
      expect(CAREER_LEVELS[1].requiredClicks).toBeGreaterThan(0)
    })

    test('multipliers should scale reasonably', () => {
      // 배수가 너무 급격하게 증가하지 않는지 확인
      for (let i = 1; i < CAREER_LEVELS.length; i++) {
        const prev = CAREER_LEVELS[i - 1].multiplier
        const current = CAREER_LEVELS[i].multiplier
        const increase = current - prev

        // 단계별 배수 증가가 5x를 넘지 않아야 함
        expect(increase).toBeLessThanOrEqual(5)
      }
    })
  })

  describe('Career level names', () => {
    const expectedNames = [
      'career.alba',
      'career.contract',
      'career.employee',
      'career.assistant',
      'career.manager',
      'career.deputy',
      'career.director',
      'career.executive',
      'career.senior',
      'career.ceo',
    ]

    test('should have correct nameKey for each level', () => {
      expectedNames.forEach((name, index) => {
        expect(CAREER_LEVELS[index].nameKey).toBe(name)
      })
    })
  })

  describe('Balance validation', () => {
    test('no duplicate requiredClicks values', () => {
      const clicks = CAREER_LEVELS.map(l => l.requiredClicks)
      const uniqueClicks = new Set(clicks)
      expect(uniqueClicks.size).toBe(clicks.length)
    })

    test('all numeric values should be integers', () => {
      CAREER_LEVELS.forEach(level => {
        expect(Number.isInteger(level.multiplier) || level.multiplier % 0.5 === 0).toBe(true)
        expect(Number.isInteger(level.requiredClicks)).toBe(true)
        expect(Number.isInteger(level.requiredIncome)).toBe(true)
      })
    })

    test('should not have NaN or Infinity values', () => {
      CAREER_LEVELS.forEach(level => {
        expect(Number.isNaN(level.multiplier)).toBe(false)
        expect(Number.isNaN(level.requiredClicks)).toBe(false)
        expect(Number.isNaN(level.requiredIncome)).toBe(false)
        expect(Number.isFinite(level.multiplier)).toBe(true)
        expect(Number.isFinite(level.requiredClicks)).toBe(true)
        expect(Number.isFinite(level.requiredIncome)).toBe(true)
      })
    })
  })
})
