# 타워 구매 후 게임 리셋 일원화 변경사항

## 변경 내용

타워 구매 후 확인 다이얼로그에서 "나중에" 옵션을 제거하고, 무조건 "새 게임 시작"으로 일원화했습니다.

## 수정된 코드

### 1. `openConfirmModal` 함수 개선

`seoulsurvival/src/main.js`의 `openConfirmModal` 함수에 `hideSecondary` 옵션을 추가했습니다:

```javascript
// secondaryLabel이 명시적으로 'none'이거나 options.hideSecondary가 true면 취소 버튼 숨김
if (options.hideSecondary === true || options.secondaryLabel === 'none') {
  elModalSecondary.style.display = 'none';
} else {
  elModalSecondary.style.display = 'inline-flex';
  elModalSecondary.textContent = options.secondaryLabel || '아니오';
}
```

### 2. 타워 구매 후 확인 다이얼로그 수정 필요

타워 구매 이벤트 핸들러에서 `showEndingModal` 함수를 호출하는 부분을 찾아서, 다음처럼 수정해야 합니다:

**이전 코드 (예상)**:
```javascript
function showEndingModal(towerCount) {
  const message = `🗼 서울타워 완성 🗼\n\n...`;
  openInfoModal('🎉 엔딩', message, '🗼');
  
  const originalOnClick = elModalPrimary.onclick;
  elModalPrimary.onclick = () => {
    closeModal();
    openConfirmModal(
      '🔄 새 게임 시작',
      '서울타워를 완성했습니다!\n\n새 게임을 시작하시겠습니까?\n(현재 진행은 초기화됩니다)',
      () => {
        resetGame();
        addLog('🗼 새로운 시작. 다시 한 번.');
      },
      {
        icon: '🗼',
        primaryLabel: '새 게임 시작',
        secondaryLabel: t('button.later')  // ❌ 이 부분 제거
      }
    );
  };
}
```

**수정 후 코드**:
```javascript
function showEndingModal(towerCount) {
  const message = `🗼 서울타워 완성 🗼\n\n...`;
  openInfoModal('🎉 엔딩', message, '🗼');
  
  const originalOnClick = elModalPrimary.onclick;
  elModalPrimary.onclick = () => {
    closeModal();
    // 무조건 새 게임 시작 (나중에 옵션 제거)
    openConfirmModal(
      '🔄 새 게임 시작',
      '서울타워를 완성했습니다!\n\n새 게임을 시작하시겠습니까?\n(현재 진행은 초기화됩니다)',
      () => {
        resetGame();
        addLog('🗼 새로운 시작. 다시 한 번.');
      },
      {
        icon: '🗼',
        primaryLabel: '새 게임 시작',
        hideSecondary: true  // ✅ 취소 버튼 숨김
      }
    );
  };
}
```

또는 더 간단하게, 확인 다이얼로그 없이 바로 리셋:

```javascript
function showEndingModal(towerCount) {
  const message = `🗼 서울타워 완성 🗼\n\n...`;
  openInfoModal('🎉 엔딩', message, '🗼');
  
  const originalOnClick = elModalPrimary.onclick;
  elModalPrimary.onclick = () => {
    closeModal();
    // 확인 다이얼로그 없이 바로 리셋
    addLog('🔄 게임을 초기화합니다...');
    localStorage.removeItem(SAVE_KEY);
    try {
      sessionStorage.setItem(CLOUD_RESTORE_SKIP_KEY, '1');
      sessionStorage.setItem(CLOUD_RESTORE_BLOCK_KEY, '1');
    } catch (e) {
      console.warn('sessionStorage set 실패:', e);
    }
    addLog('🗼 새로운 시작. 다시 한 번.');
    location.reload();
  };
}
```

## 적용 방법

1. 타워 구매 이벤트 핸들러를 찾습니다.
2. `showEndingModal` 함수를 찾거나, 타워 구매 후 확인 다이얼로그를 표시하는 코드를 찾습니다.
3. 위의 수정 후 코드를 적용합니다.

## 참고

- `openConfirmModal` 함수는 이미 `hideSecondary` 옵션을 지원하도록 수정되었습니다.
- 타워 구매 기능이 아직 구현되지 않았다면, 구현 시 위의 코드를 참고하세요.














