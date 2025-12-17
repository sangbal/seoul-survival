=== DIFF PREVIEW ===

**resetGame 변경부 (`seoulsurvival/src/main.js`):**

```javascript
    // 자동 저장 시스템
    const SAVE_KEY = 'seoulTycoonSaveV1';
    // resetGame 이후 1회성 클라우드 복구 스킵 플래그 (sessionStorage)
    const CLOUD_RESTORE_SKIP_KEY = 'ss_skipCloudRestoreOnce';
...
    function resetGame() {
      console.log('🔄 resetGame function called'); // 디버깅용

      const message =
        '게임을 새로 시작하시겠습니까?\n\n' +
        '⚠️ 모든 진행 상황이 삭제되며 복구할 수 없습니다.';

      openConfirmModal('게임 새로 시작', message, () => {
        try {
          // 초기화 진행 메시지
          addLog('🔄 게임을 초기화합니다...');
          console.log('✅ User confirmed reset'); // 디버깅용
          
          // 저장 데이터 삭제
          localStorage.removeItem(SAVE_KEY);
          console.log('✅ LocalStorage cleared'); // 디버깅용
          
          // reset 직후 첫 부팅에서는 클라우드 복구 제안을 1회 스킵
          try {
            sessionStorage.setItem(CLOUD_RESTORE_SKIP_KEY, '1');
          } catch (e) {
            console.warn('sessionStorage set 실패:', e);
          }
          
          // 즉시 페이지 새로고침
          // reload 후 ensureNicknameModal()이 닉네임 입력을 처리함
          console.log('✅ Reloading page...'); // 디버깅용
          location.reload();
        } catch (error) {
          console.error('❌ Error in resetGame:', error);
          openInfoModal('오류', '게임 초기화 중 오류가 발생했습니다.\n페이지를 새로고침해주세요.', '⚠️');
        }
      }, {
        icon: '🔄',
        primaryLabel: '새로 시작',
        secondaryLabel: '취소',
      });
    }
```

**maybeOfferCloudRestore 변경부 (`seoulsurvival/src/main.js`):**

```javascript
    /**
     * 클라우드 세이브 복구를 제안하고, 사용자 선택에 따라 처리
     * @returns {Promise<boolean>} true: reload가 예약됨, false: reload 예약 안 됨
     */
    async function maybeOfferCloudRestore() {
      // resetGame 직후 첫 부팅에서는 클라우드 복구 제안을 1회 스킵
      try {
        if (sessionStorage.getItem(CLOUD_RESTORE_SKIP_KEY) === '1') {
          sessionStorage.removeItem(CLOUD_RESTORE_SKIP_KEY);
          return false;
        }
      } catch (e) {
        console.warn('sessionStorage get/remove 실패:', e);
      }

      // 로컬 저장이 없을 때만 자동 제안(안전)
      const hasLocal = !!localStorage.getItem(SAVE_KEY);
      if (hasLocal) return false;

      const user = await getUser();
      if (!user) return false;

      const r = await fetchCloudSave('seoulsurvival');
      if (!r.ok || !r.found) return false;

      const cloudTime = r.save?.saveTime ? new Date(r.save.saveTime).toLocaleString() : (r.updated_at ? new Date(r.updated_at).toLocaleString() : '시간 정보 없음');
      const message =
        '클라우드 세이브가 있습니다.\n\n' +
        `저장 시간: ${cloudTime}\n\n` +
        '불러오시겠습니까?';

      // Promise를 반환하여 사용자 선택을 기다림
      return new Promise((resolve) => {
        let settled = false; // resolve 중복 호출 방지 가드
        
        const done = (value) => {
          if (!settled) {
            settled = true;
            resolve(value);
          }
        };

        openConfirmModal(
          '클라우드 세이브 발견',
          message,
          () => {
            // "불러오기" 클릭 시
            try {
              localStorage.setItem(SAVE_KEY, JSON.stringify(r.save));
              addLog('☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다...');
              setTimeout(() => location.reload(), 600);
              done(true); // reload가 예약되었음을 반환
            } catch (error) {
              console.error('클라우드 세이브 적용 실패:', error);
              done(false); // 에러 발생 시 false 반환
            }
          },
          {
            icon: '☁️',
            primaryLabel: '불러오기',
            secondaryLabel: '나중에',
            onCancel: () => {
              // "나중에" 클릭 시
              done(false); // reload 예약 안 됨
            }
          }
        );
      });
    }
```

=== QA RESULT ===

(코드는 위 요구사항에 맞게 수정 완료되었고, 아래는 기대 동작입니다. 실제 브라우저에서 한 번씩 확인해 주시면 됩니다.)

1) **resetGame 실행 → reload → 클라우드 세이브 팝업이 뜨지 않아야 함**
- resetGame에서 `sessionStorage.setItem(CLOUD_RESTORE_SKIP_KEY, '1')` 설정
- reload 후 `maybeOfferCloudRestore()` 첫 줄에서 해당 키를 감지하고 삭제 + `false` 반환
- 결과: **클라우드 복구 팝업 스킵 (정상 동작 예상)**

2) **같은 상황에서 닉네임 모달은 1회 떠야 함**
- reload 후 `loadGame()`는 저장 없음 → `false` 반환
- `willReload = await maybeOfferCloudRestore()`가 `false`이므로 `ensureNicknameModal()` 호출
- `resolveFinalNickname()`이 빈 문자열 반환 → 닉네임 모달 1회 표시
- 결과: **닉네임 모달 1회 노출 (정상 동작 예상)**

3) **그 다음 새로고침(F5)에서는(로그인+클라우드 세이브가 있으면) 클라우드 제안이 다시 정상 동작해야 함**
- 이전 부팅에서 `CLOUD_RESTORE_SKIP_KEY`는 이미 제거됨
- 다음 F5 시 `maybeOfferCloudRestore()`에서 skip 플래그가 없으므로 일반 흐름으로 클라우드 세이브 확인
- 결과: **클라우드 복구 제안 다시 정상 동작 (정상 동작 예상)**
