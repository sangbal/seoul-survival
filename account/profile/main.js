// 프로필 정보 페이지
import { renderHeader } from '../../shared/shell/header.js';
import { renderFooter } from '../../shared/shell/footer.js';

// Toast 메시지 표시 함수
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-panel);
    color: var(--text);
    padding: 12px 24px;
    border-radius: 8px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-size: 14px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

document.addEventListener('DOMContentLoaded', async () => {
  const headerMount = document.getElementById('header-mount');
  const footerMount = document.getElementById('footer-mount');
  
  if (headerMount) {
    renderHeader(headerMount);
    // 헤더 계정 버튼 인증 UI 초기화
    try {
      const { initAuthUI } = await import('../../shared/auth/ui.js');
      const { getUser, onAuthStateChange } = await import('../../shared/auth/core.js');
      
      const loginBtn = document.getElementById('headerLoginBtn');
      const logoutBtn = document.getElementById('headerLogoutBtn');
      const accountMenu = document.getElementById('headerAccountMenu');
      const nicknameMobile = document.getElementById('headerAccountNicknameMobile');
      
      if (!loginBtn && !logoutBtn) return;
      
      if (loginBtn) loginBtn.style.display = 'block';
      if (accountMenu) accountMenu.style.setProperty('display', 'none', 'important');
      
      async function updateHeaderUI(user) {
        const isLoggedIn = !!user;
        if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
        if (accountMenu) {
          // !important를 우회하기 위해 setProperty 사용
          if (isLoggedIn) {
            accountMenu.style.setProperty('display', 'block', 'important');
          } else {
            accountMenu.style.setProperty('display', 'none', 'important');
          }
        }
        if (nicknameMobile && isLoggedIn) {
          try {
            const { getUserProfile } = await import('../../shared/auth/core.js');
            const profile = await getUserProfile('seoulsurvival');
            if (profile.success && profile.user?.nickname) {
              nicknameMobile.textContent = profile.user.nickname;
            } else {
              const fallback = user?.user_metadata?.full_name || 
                             user?.user_metadata?.name || 
                             user?.user_metadata?.preferred_username || 
                             user?.email?.split('@')[0] || 
                             'Guest';
              nicknameMobile.textContent = fallback;
            }
          } catch (error) {
            console.warn('[Header] Failed to get nickname:', error);
            const fallback = user?.user_metadata?.full_name || 
                           user?.user_metadata?.name || 
                           user?.user_metadata?.preferred_username || 
                           user?.email?.split('@')[0] || 
                           'Guest';
            nicknameMobile.textContent = fallback;
          }
        }
      }
      
      const initial = await getUser();
      await updateHeaderUI(initial);
      
      await initAuthUI({
        scope: 'hub',
        providerButtons: [],
        defaultProvider: 'google',
        loginBtn,
        logoutBtn,
        userLabel: nicknameMobile,
        statusLabel: null,
        toast: (msg) => console.log('[Header]', msg),
      });
      
      onAuthStateChange(async (user) => {
        await updateHeaderUI(user);
      });
    } catch (error) {
      console.warn('[Header] Auth init failed:', error);
    }
  }
  
  if (footerMount) {
    renderFooter(footerMount);
  }
  
  // 인증 모듈 동적 로드
  const { getUser } = await import('../../shared/auth/core.js');
  const { validateNickname, claimNickname } = await import('../../shared/leaderboard.js');
  
  // 현재 로그인 상태 확인
  const user = await getUser();
  const isLoggedIn = !!user;
  
  // ===== 닉네임 변경 기능 =====
  const nicknameInput = document.getElementById('nickname-input');
  const nicknameSave = document.getElementById('nickname-save');
  const currentNicknameDisplay = document.getElementById('current-nickname-display');
  const currentNicknameText = document.getElementById('current-nickname-text');
  const cooldownDisplay = document.getElementById('cooldown-display');
  const cooldownTimer = document.getElementById('cooldown-timer');
  const nicknameError = document.getElementById('nickname-error');
  
  // 쿨타임 상수 (30초)
  const NICKNAME_CHANGE_COOLDOWN_MS = 30000;
  const NICKNAME_CHANGE_COOLDOWN_KEY = 'clicksurvivor_lastNicknameChangeAt';
  
  function checkNicknameCooldown() {
    try {
      const lastChangeAt = localStorage.getItem(NICKNAME_CHANGE_COOLDOWN_KEY);
      if (!lastChangeAt) {
        return { allowed: true };
      }
      
      const lastChangeTime = parseInt(lastChangeAt, 10);
      const now = Date.now();
      const elapsed = now - lastChangeTime;
      
      if (elapsed >= NICKNAME_CHANGE_COOLDOWN_MS) {
        return { allowed: true };
      }
      
      const remaining = Math.ceil((NICKNAME_CHANGE_COOLDOWN_MS - elapsed) / 1000);
      return { allowed: false, remainingSeconds: remaining };
    } catch (e) {
      return { allowed: true };
    }
  }
  
  function saveNicknameCooldown() {
    try {
      localStorage.setItem(NICKNAME_CHANGE_COOLDOWN_KEY, String(Date.now()));
    } catch (e) {
      console.warn('쿨타임 저장 실패:', e);
    }
  }
  
  function updateCooldownUI() {
    const cooldown = checkNicknameCooldown();
    if (cooldown.allowed) {
      cooldownDisplay.style.display = 'none';
      if (nicknameSave) {
        nicknameSave.disabled = nicknameInput.value.trim().length === 0;
      }
    } else {
      cooldownDisplay.style.display = 'block';
      if (cooldownTimer) {
        cooldownTimer.textContent = `${cooldown.remainingSeconds}초`;
      }
      if (nicknameSave) {
        nicknameSave.disabled = true;
      }
    }
  }
  
  function getValidationErrorMessage(reasonKey) {
    const messages = {
      'too_short': '닉네임은 최소 1자 이상이어야 합니다',
      'too_long': '닉네임은 최대 6자까지 가능합니다',
      'invalid_chars': '닉네임에는 한글, 영문, 숫자만 사용할 수 있습니다',
      'empty': '닉네임을 입력해주세요',
    };
    return messages[reasonKey] || '닉네임이 유효하지 않습니다';
  }
  
  // 쿨타임 UI 주기적 업데이트
  let cooldownInterval = null;
  if (isLoggedIn) {
    updateCooldownUI();
    cooldownInterval = setInterval(updateCooldownUI, 1000);
  }
  
  if (nicknameInput && nicknameSave) {
    if (!isLoggedIn) {
      nicknameInput.disabled = true;
      nicknameSave.disabled = true;
      nicknameInput.placeholder = '로그인이 필요합니다';
      if (currentNicknameDisplay) currentNicknameDisplay.style.display = 'none';
      if (cooldownDisplay) cooldownDisplay.style.display = 'none';
    } else {
      const { getUserProfile } = await import('../../shared/auth/core.js');
      const profileResult = await getUserProfile('seoulsurvival');
      if (profileResult.success && profileResult.user?.nickname) {
        if (currentNicknameDisplay) {
          currentNicknameDisplay.style.display = 'block';
          if (currentNicknameText) {
            currentNicknameText.textContent = profileResult.user.nickname;
          }
        }
      } else {
        if (currentNicknameDisplay) currentNicknameDisplay.style.display = 'none';
      }
    }
    
    nicknameInput.addEventListener('input', () => {
      const value = nicknameInput.value.trim();
      const validation = validateNickname(value);
      const cooldown = checkNicknameCooldown();
      
      nicknameSave.disabled = !validation.ok || value.length === 0 || !cooldown.allowed;
      
      if (value.length > 0 && !validation.ok) {
        const errorMsg = getValidationErrorMessage(validation.reasonKey);
        if (nicknameError) {
          nicknameError.textContent = errorMsg;
          nicknameError.style.display = 'block';
        }
        nicknameInput.setCustomValidity(errorMsg);
      } else {
        if (nicknameError) {
          nicknameError.style.display = 'none';
        }
        nicknameInput.setCustomValidity('');
      }
    });
    
    nicknameSave.addEventListener('click', async () => {
      if (!isLoggedIn) {
        showToast('로그인이 필요합니다', 'error');
        return;
      }
      
      const cooldown = checkNicknameCooldown();
      if (!cooldown.allowed) {
        showToast(`닉네임 변경 쿨타임이 남아있습니다 (${cooldown.remainingSeconds}초)`, 'error');
        return;
      }
      
      const raw = nicknameInput.value.trim();
      const validation = validateNickname(raw);
      
      if (!validation.ok) {
        const errorMsg = getValidationErrorMessage(validation.reasonKey);
        showToast(errorMsg || '닉네임이 유효하지 않습니다', 'error');
        if (nicknameError) {
          nicknameError.textContent = errorMsg;
          nicknameError.style.display = 'block';
        }
        return;
      }
      
      nicknameSave.disabled = true;
      nicknameSave.textContent = '저장 중...';
      if (nicknameError) nicknameError.style.display = 'none';
      
      try {
        const result = await claimNickname(raw, user.id);
        
        if (result.success) {
          showToast('닉네임이 변경되었습니다', 'success');
          nicknameInput.value = '';
          
          saveNicknameCooldown();
          updateCooldownUI();
          
          if (currentNicknameDisplay) {
            currentNicknameDisplay.style.display = 'block';
            if (currentNicknameText) {
              currentNicknameText.textContent = raw;
            }
          }
          
          // 헤더 닉네임 업데이트
          const nicknameMobile = document.getElementById('headerAccountNicknameMobile');
          if (nicknameMobile) {
            nicknameMobile.textContent = raw;
          }
          
          // 닉네임 변경 이벤트 발생 (다른 페이지에서도 업데이트되도록)
          window.dispatchEvent(new Event('authstatechange'));
          window.dispatchEvent(new CustomEvent('nicknamechanged', { detail: { nickname: raw } }));
          
          // localStorage에 닉네임 변경 플래그 저장 (게임에서 다시 로드하도록)
          try {
            localStorage.setItem('clicksurvivor_nickname_changed', String(Date.now()));
          } catch (e) {
            console.warn('닉네임 변경 플래그 저장 실패:', e);
          }
        } else {
          let errorMsg = '닉네임 변경에 실패했습니다';
          if (result.error === 'taken') {
            errorMsg = '이미 사용 중인 닉네임입니다';
          } else if (result.message) {
            errorMsg = result.message;
          }
          showToast(errorMsg, 'error');
          if (nicknameError) {
            nicknameError.textContent = errorMsg;
            nicknameError.style.display = 'block';
          }
        }
      } catch (error) {
        console.error('Nickname change error:', error);
        const errorMsg = '닉네임 변경 중 오류가 발생했습니다';
        showToast(errorMsg, 'error');
        if (nicknameError) {
          nicknameError.textContent = errorMsg;
          nicknameError.style.display = 'block';
        }
      } finally {
        updateCooldownUI();
        nicknameSave.textContent = '저장';
      }
    });
  }
  
  window.addEventListener('beforeunload', () => {
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
    }
  });
});

