/**
 * Seoul Survival - Number Formatting Utilities
 *
 * 숫자 포맷팅 함수들을 모아놓은 모듈입니다.
 * - 한국어 포맷: 만/억/조 단위
 * - 영어 포맷: K/M/B/T 단위
 * - 다양한 용도별 포맷 함수 제공
 */

import { getLang } from '../i18n/index.js'

/**
 * 영어 숫자 포맷 (K/M/B/T)
 * @param {number} num - 포맷할 숫자
 * @returns {string} 포맷된 문자열
 */
export function formatEnglishNumber(num) {
  if (num >= 1000000000000) {
    const value = (num / 1000000000000).toFixed(1)
    return parseFloat(value).toLocaleString('en-US') + 'T'
  } else if (num >= 1000000000) {
    const value = (num / 1000000000).toFixed(1)
    return parseFloat(value).toLocaleString('en-US') + 'B'
  } else if (num >= 1000000) {
    const value = (num / 1000000).toFixed(1)
    return parseFloat(value).toLocaleString('en-US') + 'M'
  } else if (num >= 1000) {
    const value = (num / 1000).toFixed(1)
    return parseFloat(value).toLocaleString('en-US') + 'K'
  } else {
    return Math.floor(num).toString()
  }
}

/**
 * 한국어 숫자 포맷 (천/만/억/조)
 * 언어 설정에 따라 자동으로 영어 포맷으로 전환
 * @param {number} num - 포맷할 숫자
 * @returns {string} 포맷된 문자열
 */
export function formatKoreanNumber(num) {
  // 언어 자동 감지하여 적절한 포맷 사용
  const currentLang = getLang()
  if (currentLang === 'en') {
    return formatEnglishNumber(num)
  }

  // 통계 섹션에서는 항상 짧은 숫자 형식 사용
  // 짧은 숫자 형식 (천의자리 콤마 포함)
  if (num >= 1000000000000) {
    const value = num / 1000000000000
    const formatted = value % 1 === 0 ? value.toLocaleString('ko-KR') : value.toFixed(1)
    return parseFloat(formatted).toLocaleString('ko-KR') + '조'
  } else if (num >= 100000000) {
    const value = (num / 100000000).toFixed(1)
    return parseFloat(value).toLocaleString('ko-KR') + '억'
  } else if (num >= 10000) {
    const value = (num / 10000).toFixed(1)
    return parseFloat(value).toLocaleString('ko-KR') + '만'
  } else if (num >= 1000) {
    const value = (num / 1000).toFixed(1)
    return parseFloat(value).toLocaleString('ko-KR') + '천'
  } else {
    return Math.floor(num).toString()
  }
}

/**
 * 언어별 숫자 포맷 통합 함수
 * @param {number} num - 포맷할 숫자
 * @param {string|null} lang - 언어 코드 ('ko' 또는 'en', null이면 자동 감지)
 * @returns {string} 포맷된 문자열
 */
export function formatNumberForLang(num, lang = null) {
  if (lang) {
    // 특정 언어 지정 시
    if (lang === 'en') {
      return formatEnglishNumber(num)
    } else {
      return formatKoreanNumber(num)
    }
  }
  // 언어 미지정 시 formatKoreanNumber가 자동으로 언어 감지
  return formatKoreanNumber(num)
}

/**
 * 영어 통계 포맷 (설정에 따라 전체 숫자 또는 짧은 표기)
 * @param {number} num - 포맷할 숫자
 * @param {object} settings - 게임 설정 객체 ({ shortNumbers: boolean })
 * @returns {string} 포맷된 문자열
 */
export function formatStatsNumberEnglish(num, settings) {
  if (!settings.shortNumbers) {
    return Math.floor(num).toLocaleString('en-US') + ' KRW'
  }

  if (num >= 1000000000000) {
    const value = num / 1000000000000
    return (
      value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + 'T'
    )
  } else if (num >= 1000000000) {
    const value = num / 1000000000
    return (
      value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + 'B'
    )
  } else if (num >= 1000000) {
    const value = num / 1000000
    return (
      value.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + 'M'
    )
  } else if (num >= 1000) {
    const k = Math.floor(num / 1000)
    return k.toLocaleString('en-US') + 'K'
  } else {
    return Math.floor(num).toLocaleString('en-US') + ' KRW'
  }
}

/**
 * 통계/축약 표기용 포맷 함수
 * - 짧은 숫자 OFF: 항상 전체 원 단위(천단위 콤마)
 * - 짧은 숫자 ON : 단위별 소수점 자릿수 고정(눈에 거슬리는 "생겼다/없어졌다" 현상 방지)
 *   * 만원: 0.0만원 (소수 1자리 고정)
 *   * 억/조: 0.00억 / 0.00조 (소수 2자리 고정)
 * @param {number} num - 포맷할 숫자
 * @param {object} settings - 게임 설정 객체 ({ shortNumbers: boolean })
 * @returns {string} 포맷된 문자열
 */
export function formatStatsNumber(num, settings) {
  const currentLang = getLang()
  if (currentLang === 'en') {
    return formatStatsNumberEnglish(num, settings)
  }

  if (!settings.shortNumbers) {
    return Math.floor(num).toLocaleString('ko-KR') + '원'
  }

  if (num >= 1000000000000) {
    const value = num / 1000000000000
    return (
      value.toLocaleString('ko-KR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + '조'
    )
  } else if (num >= 100000000) {
    const value = num / 100000000
    return (
      value.toLocaleString('ko-KR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + '억'
    )
  } else if (num >= 10000) {
    const value = num / 10000
    return (
      value.toLocaleString('ko-KR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + '만원'
    )
  } else if (num >= 1000) {
    const cheon = Math.floor(num / 1000)
    return cheon.toLocaleString('ko-KR') + '천원'
  } else {
    return Math.floor(num).toLocaleString('ko-KR') + '원'
  }
}

/**
 * 상단 헤더 현금 표시용 포맷 (통계 포맷과 동일 규칙 사용)
 * @param {number} num - 포맷할 숫자
 * @param {object} settings - 게임 설정 객체
 * @returns {string} 포맷된 문자열
 */
export function formatHeaderCash(num, settings) {
  return formatStatsNumber(num, settings)
}

/**
 * 리더보드 전용 자산 포맷 (조/억/만원 단위로 표시, 소수점 없음, 천단위 콤마 통일)
 * - 조/억: 정수만 표기, 천단위 콤마 (예: 1조, 1,234억)
 * - 만원: 정수만 표기, 천단위 콤마 (예: 1만원, 1,551만원)
 * - 만원 미만: 0만원으로 표기
 * @param {number} num - 포맷할 숫자
 * @returns {string} 포맷된 문자열
 */
export function formatLeaderboardAssets(num) {
  const currentLang = getLang()
  const assetsValue = Math.floor(num || 0)

  if (currentLang === 'en') {
    if (assetsValue >= 1000000000000) {
      const value = Math.floor(assetsValue / 1000000000000)
      return value.toLocaleString('en-US') + 'T'
    } else if (assetsValue >= 1000000000) {
      const value = Math.floor(assetsValue / 1000000000)
      return value.toLocaleString('en-US') + 'B'
    } else if (assetsValue >= 1000000) {
      const value = Math.floor(assetsValue / 1000000)
      return value.toLocaleString('en-US') + 'M'
    } else if (assetsValue >= 1000) {
      const value = Math.floor(assetsValue / 1000)
      return value.toLocaleString('en-US') + 'K'
    } else {
      return '0'
    }
  }

  if (assetsValue >= 1000000000000) {
    // 조 단위: 정수만, 천단위 콤마 (예: 1조, 1,234조)
    const value = Math.floor(assetsValue / 1000000000000)
    return value.toLocaleString('ko-KR') + '조'
  } else if (assetsValue >= 100000000) {
    // 억 단위: 정수만, 천단위 콤마 (예: 1억, 1,234억)
    const value = Math.floor(assetsValue / 100000000)
    return value.toLocaleString('ko-KR') + '억'
  } else if (assetsValue >= 10000) {
    // 만원 단위: 정수만, 천단위 콤마 (예: 1만원, 1,551만원)
    const value = Math.floor(assetsValue / 10000)
    return value.toLocaleString('ko-KR') + '만원'
  } else {
    // 만원 미만: 0만원으로 표기
    return '0만원'
  }
}

/**
 * 금융상품용 포맷 (만원 단위까지 반올림, 천단위 콤마)
 * @param {number} num - 포맷할 숫자
 * @returns {string} 포맷된 문자열
 */
export function formatFinancialPrice(num) {
  const currentLang = getLang()

  if (currentLang === 'en') {
    if (num >= 1000000000) {
      const b = Math.round(num / 1000000000)
      return b.toLocaleString('en-US') + 'B'
    } else if (num >= 1000000) {
      const m = Math.round(num / 1000000)
      return m.toLocaleString('en-US') + 'M'
    } else if (num >= 1000) {
      const k = Math.round(num / 1000)
      return k.toLocaleString('en-US') + 'K'
    } else {
      return Math.floor(num).toLocaleString('en-US')
    }
  }

  if (num >= 100000000) {
    // 1억 이상: 억 단위로 표시
    const eok = Math.round(num / 100000000)
    return eok.toLocaleString('ko-KR') + '억'
  } else if (num >= 10000) {
    // 1만 이상: 만원 단위로 반올림
    const man = Math.round(num / 10000)
    return man.toLocaleString('ko-KR') + '만'
  } else if (num >= 1000) {
    // 1천 이상: 천원 단위
    const cheon = Math.round(num / 1000)
    return cheon.toLocaleString('ko-KR') + '천'
  } else {
    return Math.floor(num).toLocaleString('ko-KR')
  }
}

/**
 * 부동산용 포맷 (0.1억 단위까지 반올림, 천단위 콤마)
 * @param {number} num - 포맷할 숫자
 * @returns {string} 포맷된 문자열
 */
export function formatPropertyPrice(num) {
  const currentLang = getLang()

  if (currentLang === 'en') {
    if (num >= 1000000000) {
      // 1B 이상: 0.1B 단위로 반올림
      const b = Math.round(num / 100000000) / 10
      return b.toLocaleString('en-US') + 'B'
    } else if (num >= 1000000) {
      // 1M 이상: M 단위로 반올림
      const m = Math.round(num / 1000000)
      return m.toLocaleString('en-US') + 'M'
    } else if (num >= 1000) {
      const k = Math.round(num / 1000)
      return k.toLocaleString('en-US') + 'K'
    } else {
      return Math.floor(num).toLocaleString('en-US')
    }
  }

  if (num >= 100000000) {
    // 1억 이상: 0.1억 단위로 반올림
    const eok = Math.round(num / 10000000) / 10
    return eok.toLocaleString('ko-KR') + '억'
  } else if (num >= 10000) {
    // 1만 이상: 만원 단위로 반올림
    const man = Math.round(num / 10000)
    return man.toLocaleString('ko-KR') + '만'
  } else {
    return Math.floor(num).toLocaleString('ko-KR')
  }
}

/**
 * 현금 표시용 함수 (짧은 숫자 설정 반영)
 * @param {number} num - 포맷할 숫자
 * @param {object} settings - 게임 설정 객체
 * @returns {string} 포맷된 문자열
 */
export function formatCashDisplay(num, settings) {
  return formatStatsNumber(num, settings)
}

/**
 * 소수점 1자리 표기를 고정(0.0도 유지)하는 한국어 숫자 포맷
 * - 예: 332.0만, 2.0억, 1.0조 처럼 항상 1자리 노출
 * @param {number} num - 포맷할 숫자
 * @returns {string} 포맷된 문자열
 */
export function formatKoreanNumberFixed1(num) {
  if (num >= 1000000000000) {
    const value = num / 1000000000000
    return (
      value.toLocaleString('ko-KR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + '조'
    )
  } else if (num >= 100000000) {
    const value = num / 100000000
    return (
      value.toLocaleString('ko-KR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + '억'
    )
  } else if (num >= 10000) {
    const value = num / 10000
    return (
      value.toLocaleString('ko-KR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + '만'
    )
  } else if (num >= 1000) {
    const value = num / 1000
    return (
      value.toLocaleString('ko-KR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + '천'
    )
  } else {
    return Math.floor(num).toString()
  }
}

/**
 * 소수점 1자리 표기를 고정하는 영어 숫자 포맷
 * @param {number} num - 포맷할 숫자
 * @returns {string} 포맷된 문자열
 */
export function formatEnglishNumberFixed1(num) {
  if (num >= 1000000000000) {
    const value = num / 1000000000000
    return (
      value.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + 'T'
    )
  } else if (num >= 1000000000) {
    const value = num / 1000000000
    return (
      value.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + 'B'
    )
  } else if (num >= 1000000) {
    const value = num / 1000000
    return (
      value.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + 'M'
    )
  } else if (num >= 1000) {
    const value = num / 1000
    return (
      value.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + 'K'
    )
  } else {
    return Math.floor(num).toString()
  }
}

/**
 * 소수점 1자리 고정 현금 표시 함수
 * @param {number} num - 포맷할 숫자
 * @param {object} settings - 게임 설정 객체
 * @returns {string} 포맷된 문자열
 */
export function formatCashDisplayFixed1(num, settings) {
  const currentLang = getLang()
  if (!settings.shortNumbers) {
    if (currentLang === 'en') {
      return Math.floor(num).toLocaleString('en-US') + ' KRW'
    }
    return Math.floor(num).toLocaleString('ko-KR') + '원'
  }
  if (currentLang === 'en') {
    return formatEnglishNumberFixed1(num) + ' KRW'
  }
  return formatKoreanNumberFixed1(num) + '원'
}

/**
 * 플레이 시간 포맷 (한국어)
 * @param {number} ms - 밀리초 단위 플레이 시간
 * @returns {string} 포맷된 문자열 (예: "1시간 30분", "45분")
 */
export function formatPlaytimeMs(ms) {
  if (!ms || ms <= 0) return '—'
  const minutes = Math.floor(ms / 1000 / 60)
  if (minutes <= 0) return '1분 미만'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return m ? `${h}시간 ${m}분` : `${h}시간`
  return `${m}분`
}

/**
 * 플레이 시간 짧은 포맷 (영어 스타일)
 * @param {number} ms - 밀리초 단위 플레이 시간
 * @returns {string} 포맷된 문자열 (예: "1h 30m", "45m", "<1m")
 */
export function formatPlaytimeMsShort(ms) {
  if (!ms || ms <= 0) return '—'
  const minutes = Math.floor(ms / 1000 / 60)
  if (minutes <= 0) return '<1m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h >= 100) return `${h}h` // 너무 길어지면 분 생략
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`
  return `${m}m`
}
