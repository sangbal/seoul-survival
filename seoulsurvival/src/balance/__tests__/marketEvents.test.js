/**
 * Seoul Survival - Market Events Balance Tests
 *
 * 시장 이벤트의 데이터와 효과가 올바르게 정의되었는지 검증합니다.
 */

import { describe, test, expect } from 'vitest'
import { MARKET_EVENTS } from '../marketEvents.js'

describe('Market Events Balance', () => {
  describe('MARKET_EVENTS', () => {
    test('should have exactly 12 events', () => {
      expect(MARKET_EVENTS).toHaveLength(12)
    })

    test('all events should have required properties', () => {
      MARKET_EVENTS.forEach((event, index) => {
        expect(event, `Event ${index}`).toHaveProperty('name')
        expect(event, `Event ${index}`).toHaveProperty('duration')
        expect(event, `Event ${index}`).toHaveProperty('color')
        expect(event, `Event ${index}`).toHaveProperty('effects')
        expect(event, `Event ${index}`).toHaveProperty('description')
      })
    })

    test('all event names should be unique', () => {
      const names = MARKET_EVENTS.map(e => e.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(names.length)
    })

    test('all event names should be non-empty strings', () => {
      MARKET_EVENTS.forEach(event => {
        expect(typeof event.name).toBe('string')
        expect(event.name.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Event durations', () => {
    test('all durations should be positive numbers', () => {
      MARKET_EVENTS.forEach(event => {
        expect(event.duration).toBeGreaterThan(0)
        expect(typeof event.duration).toBe('number')
        expect(Number.isFinite(event.duration)).toBe(true)
      })
    })

    test('durations should be in milliseconds (between 30s and 2min)', () => {
      MARKET_EVENTS.forEach(event => {
        const seconds = event.duration / 1000
        expect(seconds).toBeGreaterThanOrEqual(30)
        expect(seconds).toBeLessThanOrEqual(120)
      })
    })

    test('all durations should be multiples of 1000 (whole seconds)', () => {
      MARKET_EVENTS.forEach(event => {
        expect(event.duration % 1000).toBe(0)
      })
    })
  })

  describe('Event colors', () => {
    test('all colors should be valid hex codes', () => {
      MARKET_EVENTS.forEach(event => {
        expect(event.color).toMatch(/^#[0-9A-F]{6}$/i)
      })
    })

    test('should use appropriate colors for event types', () => {
      // 호재: 녹색계열 (#4CAF50), 파란색계열 (#2196F3), 주황색계열 (#FF9800)
      // 악재: 빨간색계열 (#F44336), 보라색계열 (#9C27B0)
      const validColors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336']

      MARKET_EVENTS.forEach(event => {
        expect(validColors).toContain(event.color)
      })
    })
  })

  describe('Event effects', () => {
    test('effects should be an object', () => {
      MARKET_EVENTS.forEach(event => {
        expect(typeof event.effects).toBe('object')
        expect(event.effects).not.toBeNull()
      })
    })

    test('effects should have financial or property category (or both)', () => {
      MARKET_EVENTS.forEach(event => {
        const hasFinancial = Object.prototype.hasOwnProperty.call(event.effects, 'financial')
        const hasProperty = Object.prototype.hasOwnProperty.call(event.effects, 'property')

        expect(hasFinancial || hasProperty).toBe(true)
      })
    })

    test('financial effects should have valid product keys', () => {
      const validFinancialProducts = ['deposit', 'savings', 'bond', 'usStock', 'crypto']

      MARKET_EVENTS.forEach(event => {
        if (event.effects.financial) {
          Object.keys(event.effects.financial).forEach(product => {
            expect(validFinancialProducts).toContain(product)
          })
        }
      })
    })

    test('property effects should have valid property keys', () => {
      const validProperties = ['villa', 'officetel', 'apartment', 'shop', 'building']

      MARKET_EVENTS.forEach(event => {
        if (event.effects.property) {
          Object.keys(event.effects.property).forEach(property => {
            expect(validProperties).toContain(property)
          })
        }
      })
    })

    test('all effect multipliers should be positive numbers', () => {
      MARKET_EVENTS.forEach(event => {
        if (event.effects.financial) {
          Object.values(event.effects.financial).forEach(multiplier => {
            expect(multiplier).toBeGreaterThan(0)
            expect(typeof multiplier).toBe('number')
            expect(Number.isFinite(multiplier)).toBe(true)
          })
        }
        if (event.effects.property) {
          Object.values(event.effects.property).forEach(multiplier => {
            expect(multiplier).toBeGreaterThan(0)
            expect(typeof multiplier).toBe('number')
            expect(Number.isFinite(multiplier)).toBe(true)
          })
        }
      })
    })

    test('effect multipliers should be reasonable (between 0.5 and 3.0)', () => {
      MARKET_EVENTS.forEach(event => {
        if (event.effects.financial) {
          Object.values(event.effects.financial).forEach(multiplier => {
            expect(multiplier).toBeGreaterThanOrEqual(0.5)
            expect(multiplier).toBeLessThanOrEqual(3.0)
          })
        }
        if (event.effects.property) {
          Object.values(event.effects.property).forEach(multiplier => {
            expect(multiplier).toBeGreaterThanOrEqual(0.5)
            expect(multiplier).toBeLessThanOrEqual(3.0)
          })
        }
      })
    })

    test('negative events should not go below 0.7 (minimum cap)', () => {
      const negativeEvents = MARKET_EVENTS.filter(
        e => e.name.includes('위기') || e.name.includes('폭락') || e.name.includes('규제')
      )

      negativeEvents.forEach(event => {
        if (event.effects.financial) {
          Object.values(event.effects.financial).forEach(multiplier => {
            expect(multiplier).toBeGreaterThanOrEqual(0.7)
          })
        }
        if (event.effects.property) {
          Object.values(event.effects.property).forEach(multiplier => {
            expect(multiplier).toBeGreaterThanOrEqual(0.7)
          })
        }
      })
    })
  })

  describe('Event descriptions', () => {
    test('all descriptions should be non-empty strings', () => {
      MARKET_EVENTS.forEach(event => {
        expect(typeof event.description).toBe('string')
        expect(event.description.length).toBeGreaterThan(0)
      })
    })

    test('descriptions should end with period', () => {
      MARKET_EVENTS.forEach(event => {
        expect(event.description).toMatch(/\.$/)
      })
    })
  })

  describe('Event categories', () => {
    const positiveEventNames = [
      '강남 아파트 대박',
      '전세 대란',
      '상권 활성화',
      '오피스 수요 급증',
      '한국은행 금리 인하',
      '주식시장 대호황',
      '미국 연준 양적완화',
      '비트코인 급등',
    ]

    const negativeEventNames = ['금융위기', '은행 파산 위기', '주식시장 폭락', '암호화폐 규제']

    test('should have 8 positive events', () => {
      const positiveEvents = MARKET_EVENTS.filter(e => positiveEventNames.includes(e.name))
      expect(positiveEvents).toHaveLength(8)
    })

    test('should have 4 negative events', () => {
      const negativeEvents = MARKET_EVENTS.filter(e => negativeEventNames.includes(e.name))
      expect(negativeEvents).toHaveLength(4)
    })

    test('positive events should have multipliers >= 1.0', () => {
      const positiveEvents = MARKET_EVENTS.filter(e => positiveEventNames.includes(e.name))

      positiveEvents.forEach(event => {
        if (event.effects.financial) {
          Object.values(event.effects.financial).forEach(multiplier => {
            expect(multiplier).toBeGreaterThanOrEqual(0.7) // 금리 인하 같은 경우 예금/적금은 감소
          })
        }
        if (event.effects.property) {
          Object.values(event.effects.property).forEach(multiplier => {
            expect(multiplier).toBeGreaterThanOrEqual(1.0)
          })
        }
      })
    })

    test('negative events should have multipliers < 1.0', () => {
      const negativeEvents = MARKET_EVENTS.filter(e => negativeEventNames.includes(e.name))

      negativeEvents.forEach(event => {
        const hasNegativeEffect =
          (event.effects.financial && Object.values(event.effects.financial).some(m => m < 1.0)) ||
          (event.effects.property && Object.values(event.effects.property).some(m => m < 1.0))

        expect(hasNegativeEffect).toBe(true)
      })
    })
  })

  describe('Specific event validations', () => {
    test('강남 아파트 대박 - should boost apartment most', () => {
      const event = MARKET_EVENTS.find(e => e.name === '강남 아파트 대박')
      expect(event).toBeDefined()
      expect(event.effects.property.apartment).toBe(2.5)
      expect(event.duration).toBe(50_000)
    })

    test('전세 대란 - should boost villa and officetel', () => {
      const event = MARKET_EVENTS.find(e => e.name === '전세 대란')
      expect(event).toBeDefined()
      expect(event.effects.property.villa).toBe(2.5)
      expect(event.effects.property.officetel).toBe(2.5)
    })

    test('금융위기 - should be longest duration (negative event)', () => {
      const event = MARKET_EVENTS.find(e => e.name === '금융위기')
      expect(event).toBeDefined()
      expect(event.duration).toBe(90_000) // 90초
      expect(event.color).toBe('#F44336') // 빨강
    })

    test('비트코인 급등 - should boost crypto most', () => {
      const event = MARKET_EVENTS.find(e => e.name === '비트코인 급등')
      expect(event).toBeDefined()
      expect(event.effects.financial.crypto).toBe(2.5)
      expect(event.duration).toBe(45_000)
    })

    test('암호화폐 규제 - should only affect crypto', () => {
      const event = MARKET_EVENTS.find(e => e.name === '암호화폐 규제')
      expect(event).toBeDefined()
      expect(Object.keys(event.effects.financial)).toHaveLength(1)
      expect(event.effects.financial.crypto).toBe(0.7)
    })
  })

  describe('Data integrity', () => {
    test('should not have NaN values', () => {
      MARKET_EVENTS.forEach(event => {
        expect(Number.isNaN(event.duration)).toBe(false)

        if (event.effects.financial) {
          Object.values(event.effects.financial).forEach(multiplier => {
            expect(Number.isNaN(multiplier)).toBe(false)
          })
        }
        if (event.effects.property) {
          Object.values(event.effects.property).forEach(multiplier => {
            expect(Number.isNaN(multiplier)).toBe(false)
          })
        }
      })
    })

    test('should not have Infinity values', () => {
      MARKET_EVENTS.forEach(event => {
        expect(Number.isFinite(event.duration)).toBe(true)

        if (event.effects.financial) {
          Object.values(event.effects.financial).forEach(multiplier => {
            expect(Number.isFinite(multiplier)).toBe(true)
          })
        }
        if (event.effects.property) {
          Object.values(event.effects.property).forEach(multiplier => {
            expect(Number.isFinite(multiplier)).toBe(true)
          })
        }
      })
    })
  })
})
