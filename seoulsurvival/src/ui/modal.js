/**
 * Seoul Survival - Modal System
 *
 * 게임의 공통 모달 시스템
 * - 정보 모달 (Info Modal)
 * - 확인 모달 (Confirm Modal)
 * - 입력 모달 (Input Modal)
 * - 엔딩 모달 (Ending Modal)
 */

import { t } from '../i18n/index.js'

// ======= DOM 참조 =======
let elModalRoot = null
let elModalTitle = null
let elModalMessage = null
let elModalPrimary = null
let elModalSecondary = null

// ======= 모달 상태 =======
let modalOnConfirm = null

/**
 * 모달 시스템 초기화
 * DOM 요소 참조를 설정합니다.
 */
export function initModal() {
  elModalRoot = document.getElementById('gameModalRoot')
  elModalTitle = document.getElementById('gameModalTitle')
  elModalMessage = document.getElementById('gameModalMessage')
  elModalPrimary = document.getElementById('gameModalPrimary')
  elModalSecondary = document.getElementById('gameModalSecondary')
}

/**
 * 모달 닫기
 */
export function closeModal() {
  if (!elModalRoot) return
  elModalRoot.classList.add('game-modal-hidden')
  modalOnConfirm = null
}

/**
 * 정보 모달 열기
 * @param {string} title - 모달 제목
 * @param {string} message - 모달 메시지
 * @param {string} icon - 모달 아이콘 (기본값: 'ℹ️')
 */
export function openInfoModal(title, message, icon = 'ℹ️') {
  if (!elModalRoot || !elModalTitle || !elModalMessage || !elModalPrimary || !elModalSecondary) {
    alert(message)
    return
  }
  elModalRoot.classList.remove('game-modal-hidden')
  const titleIcon = elModalTitle.querySelector('.icon')
  const titleText = elModalTitle.querySelector('.text')
  if (titleIcon) titleIcon.textContent = icon
  if (titleText) titleText.textContent = title
  elModalMessage.textContent = message

  elModalSecondary.style.display = 'none'
  elModalPrimary.textContent = t('button.confirm')

  elModalPrimary.onclick = () => {
    closeModal()
  }
  elModalSecondary.onclick = () => {
    closeModal()
  }
}

/**
 * 확인 모달 열기
 * @param {string} title - 모달 제목
 * @param {string} message - 모달 메시지
 * @param {Function} onConfirm - 확인 버튼 클릭 시 실행할 콜백
 * @param {Object} options - 옵션 객체
 * @param {string} options.icon - 모달 아이콘 (기본값: '⚠️')
 * @param {string} options.primaryLabel - 확인 버튼 레이블
 * @param {string} options.secondaryLabel - 취소 버튼 레이블
 * @param {Function} options.onCancel - 취소 버튼 클릭 시 실행할 콜백
 */
export function openConfirmModal(title, message, onConfirm, options = {}) {
  if (!elModalRoot || !elModalTitle || !elModalMessage || !elModalPrimary || !elModalSecondary) {
    const userConfirmed = confirm(message)
    if (userConfirmed && typeof onConfirm === 'function') onConfirm()
    return
  }

  elModalRoot.classList.remove('game-modal-hidden')
  const titleIcon = elModalTitle.querySelector('.icon')
  const titleText = elModalTitle.querySelector('.text')
  if (titleIcon) titleIcon.textContent = options.icon || '⚠️'
  if (titleText) titleText.textContent = title
  elModalMessage.textContent = message

  elModalSecondary.style.display = 'inline-flex'
  elModalPrimary.textContent = options.primaryLabel || t('button.yes')
  elModalSecondary.textContent = options.secondaryLabel || t('button.no')

  modalOnConfirm = typeof onConfirm === 'function' ? onConfirm : null

  elModalPrimary.onclick = () => {
    const cb = modalOnConfirm
    closeModal()
    if (cb) cb()
  }
  elModalSecondary.onclick = () => {
    closeModal()
    // onCancel 콜백이 있으면 호출
    if (options.onCancel && typeof options.onCancel === 'function') {
      options.onCancel()
    }
  }
}

/**
 * 입력 모달 열기
 * @param {string} title - 모달 제목
 * @param {string} message - 모달 메시지
 * @param {Function} onConfirm - 확인 버튼 클릭 시 실행할 콜백 (입력값 전달)
 * @param {Object} options - 옵션 객체
 * @param {string} options.icon - 모달 아이콘 (기본값: '✏️')
 * @param {string} options.primaryLabel - 확인 버튼 레이블
 * @param {string} options.secondaryLabel - 취소 버튼 레이블
 * @param {string} options.placeholder - 입력 필드 placeholder
 * @param {number} options.maxLength - 입력 필드 최대 길이
 * @param {string} options.defaultValue - 입력 필드 기본값
 * @param {boolean} options.required - 필수 입력 여부 (기본값: true)
 * @param {Function} options.onCancel - 취소 버튼 클릭 시 실행할 콜백
 */
export function openInputModal(title, message, onConfirm, options = {}) {
  if (!elModalRoot || !elModalTitle || !elModalMessage || !elModalPrimary || !elModalSecondary) {
    const input = prompt(message)
    if (input && typeof onConfirm === 'function') {
      onConfirm(input.trim())
    }
    return
  }

  elModalRoot.classList.remove('game-modal-hidden')
  const titleIcon = elModalTitle.querySelector('.icon')
  const titleText = elModalTitle.querySelector('.text')
  if (titleIcon) titleIcon.textContent = options.icon || '✏️'
  if (titleText) titleText.textContent = title

  // 모달 메시지 영역 완전 초기화 (중복 렌더링 방지)
  elModalMessage.innerHTML = ''

  // 메시지 텍스트 추가 (있는 경우) - input보다 먼저 추가
  if (message) {
    const msgText = document.createElement('div')
    msgText.className = 'game-modal-message-text'
    msgText.textContent = message
    msgText.style.marginBottom = '10px'
    msgText.style.color = 'var(--muted)'
    msgText.style.fontSize = '13px'
    elModalMessage.appendChild(msgText)
  }

  // 입력 필드 생성
  const inputEl = document.createElement('input')
  inputEl.type = 'text'
  inputEl.className = 'game-modal-input'
  inputEl.value = options.defaultValue || ''

  // placeholder / maxLength 적용
  inputEl.placeholder =
    options.placeholder || inputEl.placeholder || t('modal.nickname.placeholder')
  if (typeof options.maxLength === 'number') {
    inputEl.maxLength = options.maxLength
  } else if (!inputEl.maxLength || inputEl.maxLength <= 0) {
    inputEl.maxLength = 20
  }

  elModalMessage.appendChild(inputEl)

  if (options.secondaryLabel) {
    elModalSecondary.style.display = 'inline-flex'
    elModalSecondary.textContent = options.secondaryLabel
  } else {
    elModalSecondary.style.display = 'none'
  }
  elModalPrimary.textContent = options.primaryLabel || t('ui.confirm')

  // Enter 키로 확인, ESC로 닫기
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      elModalPrimary.click()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      if (options.secondaryLabel && elModalSecondary.onclick) {
        elModalSecondary.click()
      } else {
        closeModal()
      }
    }
  }

  // 이벤트 리스너 중복 등록 방지 (기존 리스너 제거 후 추가)
  const existingHandler = inputEl.dataset.keydownHandler
  if (existingHandler) {
    inputEl.removeEventListener('keydown', window[existingHandler])
  }
  const handlerId = 'modalKeyDown_' + Date.now()
  inputEl.dataset.keydownHandler = handlerId
  window[handlerId] = handleKeyDown
  inputEl.addEventListener('keydown', handleKeyDown)

  // 자동 포커스 및 전체 선택
  inputEl.focus()
  inputEl.select()

  elModalPrimary.onclick = () => {
    const value = inputEl.value.trim()
    if (!value && options.required !== false) {
      inputEl.style.borderColor = 'var(--bad)'
      setTimeout(() => {
        inputEl.style.borderColor = ''
      }, 1000)
      return
    }
    // 이벤트 리스너 정리
    const handlerId = inputEl.dataset.keydownHandler
    if (handlerId && window[handlerId]) {
      inputEl.removeEventListener('keydown', window[handlerId])
      delete window[handlerId]
      delete inputEl.dataset.keydownHandler
    }
    closeModal()
    if (typeof onConfirm === 'function') {
      onConfirm(value || options.defaultValue || '익명')
    }
  }
  // secondary 버튼은 options.secondaryLabel이 있을 때만 의미 있음
  if (options.secondaryLabel) {
    elModalSecondary.onclick = () => {
      // 이벤트 리스너 정리
      const handlerId = inputEl.dataset.keydownHandler
      if (handlerId && window[handlerId]) {
        inputEl.removeEventListener('keydown', window[handlerId])
        delete window[handlerId]
        delete inputEl.dataset.keydownHandler
      }
      closeModal()
      // onCancel 콜백이 있으면 호출
      if (options.onCancel && typeof options.onCancel === 'function') {
        options.onCancel()
      }
    }
  } else {
    elModalSecondary.onclick = null
  }
}

/**
 * 엔딩 모달 표시 (서울타워 구매 시)
 * @param {number} towerCount - 누적 타워 개수
 * @param {Function} onConfirm - 확인 버튼 클릭 시 실행할 콜백 (프레스티지 실행)
 */
export function showEndingModal(towerCount, onConfirm) {
  const message =
    `🗼 서울타워 완성 🗼\n\n` +
    `알바에서 시작해 CEO까지.\n` +
    `예금에서 시작해 서울타워까지.\n\n` +
    `서울 한복판에 당신의 이름이 새겨졌다.\n\n` +
    `서울타워 🗼 획득 (누적 ${towerCount}개)\n\n` +
    `이제 새로운 시작을 합니다.`

  openInfoModal('🎉 엔딩', message, '🗼')

  // 모달 확인 버튼 클릭 시 자동 프레스티지 실행 (타이머 없음, 버튼 클릭만)
  if (elModalPrimary) {
    elModalPrimary.textContent = t('button.newStart') || '새로운 시작'
    elModalPrimary.onclick = () => {
      closeModal()
      // 모달이 완전히 닫힌 후 프레스티지 실행 (DOM 안정화 대기)
      setTimeout(() => {
        if (typeof onConfirm === 'function') {
          onConfirm()
        }
      }, 100)
    }
  }
}
