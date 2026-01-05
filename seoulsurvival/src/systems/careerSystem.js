/**
 * Seoul Survival - Career/Promotion System
 *
 * 직급 승진 및 수익 계산 시스템
 */

import { t } from '../i18n/index.js'
import * as NumberFormat from '../utils/numberFormat.js'
import * as Diary from './diary.js'

/**
 * 커리어 시스템 생성
 * @param {Object} deps - 의존성
 * @param {Object} deps.CAREER_LEVELS - 직급 레벨 정보 배열
 * @param {Function} deps.getCareerLevel - 현재 직급 레벨 반환 함수
 * @param {Function} deps.setCareerLevel - 직급 레벨 설정 함수
 * @param {Function} deps.getTotalClicks - 총 클릭 수 반환 함수
 * @param {Function} deps.getClickMultiplier - 클릭 배수 반환 함수
 * @param {Function} deps.getElWorkArea - 작업 영역 DOM 요소 반환 함수
 * @returns {Object} 커리어 관리 함수들
 */
export function createCareerSystem(deps) {
  const {
    CAREER_LEVELS,
    getCareerLevel,
    setCareerLevel,
    getTotalClicks,
    getClickMultiplier,
    getElWorkArea,
  } = deps

  /**
   * 직급 이름 가져오기
   */
  function getCareerName(level) {
    if (level < 0 || level >= CAREER_LEVELS.length) return ''
    return t(CAREER_LEVELS[level].nameKey)
  }

  /**
   * 클릭 수익 계산
   */
  function getClickIncome() {
    const currentCareer = getCurrentCareer()
    const clickMultiplier = getClickMultiplier()
    return Math.floor(10000 * currentCareer.multiplier * clickMultiplier)
  }

  /**
   * 현재 직급 정보 반환
   */
  function getCurrentCareer() {
    const careerLevel = getCareerLevel()
    return CAREER_LEVELS[careerLevel]
  }

  /**
   * 다음 직급 정보 반환
   */
  function getNextCareer() {
    const careerLevel = getCareerLevel()
    return careerLevel < CAREER_LEVELS.length - 1 ? CAREER_LEVELS[careerLevel + 1] : null
  }

  /**
   * 승진 체크 및 처리
   * @returns {boolean} 승진 여부
   */
  function checkCareerPromotion() {
    const careerLevel = getCareerLevel()
    const totalClicks = getTotalClicks()
    const nextCareer = getNextCareer()

    if (nextCareer && totalClicks >= nextCareer.requiredClicks) {
      const oldCareerLevel = careerLevel
      setCareerLevel(careerLevel + 1)
      const newCareer = getCurrentCareer()
      const clickIncome = getClickIncome()

      Diary.addLog(
        t('msg.promoted', {
          career: getCareerName(getCareerLevel()),
          income: NumberFormat.formatKoreanNumber(clickIncome),
        })
      )

      // 승진 시 전환 애니메이션
      const elWorkArea = getElWorkArea()
      if (elWorkArea) {
        elWorkArea.style.transition = 'opacity 0.3s ease-out'
        elWorkArea.style.opacity = '0.5'

        setTimeout(() => {
          if (newCareer.bgImage) {
            elWorkArea.style.transition = 'background-image 0.8s ease-in-out, opacity 0.5s ease-in'
            elWorkArea.style.backgroundImage = `url('${newCareer.bgImage}')`
          } else {
            elWorkArea.style.transition = 'background-image 0.8s ease-in-out, opacity 0.5s ease-in'
            elWorkArea.style.backgroundImage =
              'radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)'
          }

          elWorkArea.style.opacity = '1'
        }, 300)
      }

      // 직급 카드 애니메이션 효과
      const careerCard = document.querySelector('.career-card')
      if (careerCard) {
        careerCard.style.animation = 'none'
        setTimeout(() => {
          careerCard.style.animation = 'careerPromotion 0.6s ease-out'
        }, 10)
      }

      // 스크린 리더 알림
      const currentCareerEl = document.getElementById('currentCareer')
      if (currentCareerEl) {
        currentCareerEl.setAttribute(
          'aria-label',
          t('msg.promoted', {
            career: getCareerName(getCareerLevel()),
            income: NumberFormat.formatKoreanNumber(clickIncome),
          })
        )
      }

      console.log('=== PROMOTION DEBUG ===')
      console.log('Promoted to:', getCareerName(getCareerLevel()))
      console.log('New career level:', getCareerLevel())
      console.log('New multiplier:', newCareer.multiplier)
      console.log('Click income:', NumberFormat.formatKoreanNumber(clickIncome))
      console.log('======================')

      return true
    }
    return false
  }

  return {
    getCareerName,
    getClickIncome,
    getCurrentCareer,
    getNextCareer,
    checkCareerPromotion,
  }
}
