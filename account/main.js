// Account 페이지 메인 진입점
import { renderHeader } from '../shared/shell/header.js';
import { renderFooter } from '../shared/shell/footer.js';
import { signOut } from '../shared/auth/core.js';
import { deleteAccount } from '../shared/auth/deleteAccount.js';
import { claimNickname, validateNickname } from '../shared/leaderboard.js';

// Toast 메시지 표시 함수
function showToast(message, type = 'info') {
  // 간단한 토스트 구현 (향후 공통 컴포넌트로 분리 가능)
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
    await initHeaderAuth();
  }
  
  if (footerMount) {
    renderFooter(footerMount);
  }
  
  // 인증 모듈 동적 로드
  const { getUser, getUserProfile } = await import('../shared/auth/core.js');
  
  // 현재 로그인 상태 확인
  const user = await getUser();
  const isLoggedIn = !!user;
  
  // ===== 프로필 헤더 정보 표시 =====
  async function updateProfileHeader() {
    const avatarText = document.getElementById('account-avatar-text');
    const accountName = document.getElementById('account-name');
    const accountEmail = document.getElementById('account-email');
    
    if (!isLoggedIn) {
      if (accountName) accountName.textContent = '게스트';
      if (accountEmail) accountEmail.textContent = '로그인이 필요합니다';
      if (avatarText) avatarText.textContent = '?';
      return;
    }
    
    try {
      const profile = await getUserProfile('seoulsurvival');
      if (profile.success && profile.user) {
        const displayName = profile.user.nickname || 
                           profile.user.displayName || 
                           profile.user.email?.split('@')[0] || 
                           '사용자';
        
        if (accountName) {
          accountName.textContent = displayName;
        }
        
        if (accountEmail && profile.user.email) {
          accountEmail.textContent = profile.user.email;
        }
        
        // 아바타 초기 표시
        if (avatarText) {
          avatarText.textContent = displayName.charAt(0).toUpperCase();
        }
      }
    } catch (error) {
      console.warn('[Account] Failed to load profile:', error);
      if (accountName) accountName.textContent = user?.email?.split('@')[0] || '사용자';
      if (accountEmail && user?.email) accountEmail.textContent = user.email;
      if (avatarText) avatarText.textContent = (user?.email?.charAt(0) || '?').toUpperCase();
    }
  }
  
  // 프로필 정보 초기화
  await updateProfileHeader();
  
  // 로그인하지 않은 경우 메뉴 항목 비활성화
  if (!isLoggedIn) {
    const menuItems = document.querySelectorAll('.account-menu-item');
    menuItems.forEach(item => {
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
    });
  }
  
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
  
  /**
   * 쿨타임 체크
   * @returns {{ allowed: boolean, remainingSeconds?: number }}
   */
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
      // localStorage 오류 시 허용 (쿨타임 실패해도 진행)
      return { allowed: true };
    }
  }
  
  /**
   * 쿨타임 저장
   */
  function saveNicknameCooldown() {
    try {
      localStorage.setItem(NICKNAME_CHANGE_COOLDOWN_KEY, String(Date.now()));
    } catch (e) {
      console.warn('쿨타임 저장 실패:', e);
    }
  }
  
  /**
   * 쿨타임 UI 업데이트
   */
  function updateCooldownUI() {
    if (!cooldownDisplay || !nicknameInput || !nicknameSave) return;
    
    const cooldown = checkNicknameCooldown();
    if (cooldown.allowed) {
      cooldownDisplay.style.display = 'none';
      nicknameSave.disabled = nicknameInput.value.trim().length === 0;
    } else {
      cooldownDisplay.style.display = 'block';
      if (cooldownTimer) {
        cooldownTimer.textContent = `${cooldown.remainingSeconds}초`;
      }
      nicknameSave.disabled = true;
    }
  }
  
  // 쿨타임 UI 주기적 업데이트 (1초마다) - 요소가 있을 때만 실행
  let cooldownInterval = null;
  if (isLoggedIn && cooldownDisplay && nicknameInput && nicknameSave) {
    updateCooldownUI();
    cooldownInterval = setInterval(updateCooldownUI, 1000);
  }
  
  if (nicknameInput && nicknameSave) {
    // 초기 상태: 로그인 안 됨 시 비활성화
    if (!isLoggedIn) {
      nicknameInput.disabled = true;
      nicknameSave.disabled = true;
      nicknameInput.placeholder = '로그인이 필요합니다';
      if (currentNicknameDisplay) currentNicknameDisplay.style.display = 'none';
      if (cooldownDisplay) cooldownDisplay.style.display = 'none';
    } else {
      // 로그인 상태: 현재 닉네임 표시
      const { getUserProfile } = await import('../shared/auth/core.js');
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
    
    // 입력 검증
    nicknameInput.addEventListener('input', () => {
      const value = nicknameInput.value.trim();
      const validation = validateNickname(value);
      const cooldown = checkNicknameCooldown();
      
      // 쿨타임이 있으면 저장 버튼 비활성화
      nicknameSave.disabled = !validation.ok || value.length === 0 || !cooldown.allowed;
      
      // 에러 메시지 표시
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
    
    // 닉네임 저장 버튼 클릭
    nicknameSave.addEventListener('click', async () => {
      if (!isLoggedIn) {
        showToast('로그인이 필요합니다', 'error');
        return;
      }
      
      // 쿨타임 체크
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
          
          // 쿨타임 저장
          saveNicknameCooldown();
          updateCooldownUI();
          
          // 현재 닉네임 업데이트
          if (currentNicknameDisplay) {
            currentNicknameDisplay.style.display = 'block';
            if (currentNicknameText) {
              currentNicknameText.textContent = raw;
            }
          }
          
          // 프로필 헤더 업데이트
          await updateProfileHeader();
          
          // 헤더 닉네임 업데이트 (페이지 새로고침 또는 이벤트 발생)
          window.dispatchEvent(new Event('authstatechange'));
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
        updateCooldownUI(); // 쿨타임 UI 업데이트
        nicknameSave.textContent = '저장';
      }
    });
  }
  
  // 페이지 언로드 시 인터벌 정리
  window.addEventListener('beforeunload', () => {
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
    }
  });
  
  // ===== 로그아웃 기능 =====
  const logoutBtn = document.getElementById('logout-btn');
  
  if (logoutBtn) {
    if (!isLoggedIn) {
      logoutBtn.disabled = true;
      logoutBtn.textContent = '로그인 필요';
    } else {
      logoutBtn.disabled = false;
      logoutBtn.addEventListener('click', async () => {
        if (!confirm('로그아웃하시겠습니까?')) {
          return;
        }
        
        logoutBtn.disabled = true;
        logoutBtn.textContent = '로그아웃 중...';
        
        try {
          const result = await signOut();
          if (result.ok) {
            showToast('로그아웃되었습니다', 'success');
            setTimeout(() => {
              window.location.href = '../';
            }, 500);
          } else {
            showToast('로그아웃에 실패했습니다', 'error');
            logoutBtn.disabled = false;
            logoutBtn.textContent = '모든 기기에서 로그아웃';
          }
        } catch (error) {
          console.error('Logout error:', error);
          showToast('로그아웃 중 오류가 발생했습니다', 'error');
          logoutBtn.disabled = false;
          logoutBtn.textContent = 'Logout';
        }
      });
    }
  }
  
  // ===== 계정 삭제 기능 =====
  const deleteCheckbox = document.getElementById('delete-confirm-checkbox');
  const deleteInput = document.getElementById('delete-confirm-input');
  const deleteBtn = document.getElementById('delete-account-btn');
  
  if (deleteCheckbox && deleteInput && deleteBtn) {
    if (!isLoggedIn) {
      deleteCheckbox.disabled = true;
      deleteInput.disabled = true;
      deleteBtn.disabled = true;
      deleteInput.placeholder = '로그인이 필요합니다';
    }
    
    const checkDeleteEnabled = () => {
      if (!isLoggedIn) return;
      const isChecked = deleteCheckbox.checked;
      const isInputMatch = deleteInput.value.trim() === 'DELETE';
      deleteBtn.disabled = !(isChecked && isInputMatch);
    };
    
    deleteCheckbox.addEventListener('change', checkDeleteEnabled);
    deleteInput.addEventListener('input', checkDeleteEnabled);
    
    deleteBtn.addEventListener('click', async () => {
      if (!isLoggedIn) {
        showToast('로그인이 필요합니다', 'error');
        return;
      }
      
      // 1단계 확인
      if (!confirm('계정과 모든 데이터를 영구적으로 삭제하시겠습니까?\n\n⚠️ 삭제될 내용:\n• 계정 정보 (이메일, 로그인 정보)\n• 클라우드 저장\n• 리더보드 기록\n• 로컬 게임 저장\n\n이 작업은 되돌릴 수 없습니다.')) {
        return;
      }
      
      // 2단계 확인
      if (!confirm('정말로 계정을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.')) {
        return;
      }
      
      deleteBtn.disabled = true;
      deleteBtn.textContent = '삭제 중...';
      
      try {
        const result = await deleteAccount();
        
        if (result.ok) {
          showToast('계정이 삭제되었습니다', 'success');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          let errorMsg = '계정 삭제에 실패했습니다';
          if (result.status === 'NOT_CONFIGURED') {
            errorMsg = '계정 삭제 기능이 설정되지 않았습니다';
          } else if (result.status === 'AUTH_FAILED') {
            errorMsg = '로그인 상태가 만료되었습니다';
          }
          showToast(errorMsg, 'error');
          deleteBtn.disabled = false;
          deleteBtn.textContent = 'Delete account';
        }
      } catch (error) {
        console.error('Delete account error:', error);
        showToast('계정 삭제 중 오류가 발생했습니다', 'error');
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete account';
      }
    });
  }
  
  console.log('[Account] 초기화 완료');
});

// 유효성 검사 에러 메시지 변환
function getValidationErrorMessage(reasonKey) {
  const messages = {
    'empty': '닉네임을 입력해주세요',
    'tooShort': '닉네임은 1자 이상이어야 합니다',
    'tooLong': '닉네임은 6자 이하여야 합니다',
    'invalid': '한글, 영문, 숫자, 밑줄만 사용 가능합니다 (공백 불가)',
    'banned': '사용할 수 없는 닉네임입니다',
  };
  return messages[reasonKey] || '닉네임이 유효하지 않습니다';
}

// 헤더 계정 버튼 인증 UI 초기화 (hub/main.js와 동일한 로직)
async function initHeaderAuth() {
  try {
    const { initAuthUI } = await import('../shared/auth/ui.js');
    const { getUser, onAuthStateChange } = await import('../shared/auth/core.js');
    
    const loginBtn = document.getElementById('headerLoginBtn');
    const logoutBtn = document.getElementById('headerLogoutBtn');
    const accountMenu = document.getElementById('headerAccountMenu');
    const nicknameMobile = document.getElementById('headerAccountNicknameMobile');
    
    if (!loginBtn && !logoutBtn) return;
    
    // 초기 상태 설정 (게스트 모드)
    if (loginBtn) loginBtn.style.display = 'block';
    if (accountMenu) accountMenu.style.setProperty('display', 'none', 'important');
    
    // 닉네임 업데이트 함수 (getUserProfile 사용)
    async function updateNickname(user) {
      if (!nicknameMobile) return;
      
      if (!user) {
        nicknameMobile.textContent = 'Guest';
        return;
      }
      
      try {
        const { getUserProfile } = await import('../shared/auth/core.js');
        const profile = await getUserProfile('seoulsurvival');
        if (profile.success && profile.user?.nickname) {
          nicknameMobile.textContent = profile.user.nickname;
          console.log('[Account] Nickname updated:', profile.user.nickname);
        } else {
          const fallback = user?.user_metadata?.full_name || 
                         user?.user_metadata?.name || 
                         user?.user_metadata?.preferred_username || 
                         user?.email?.split('@')[0] || 
                         'Guest';
          nicknameMobile.textContent = fallback;
          console.log('[Account] Using fallback nickname:', fallback);
        }
      } catch (error) {
        console.warn('[Account] Failed to get nickname:', error);
        const fallback = user?.user_metadata?.full_name || 
                       user?.user_metadata?.name || 
                       user?.user_metadata?.preferred_username || 
                       user?.email?.split('@')[0] || 
                       'Guest';
        nicknameMobile.textContent = fallback;
        console.log('[Account] Using fallback nickname (error):', fallback);
      }
    }
    
    // 로그인 상태 변경 시 헤더 UI 업데이트
    async function updateHeaderUI(user) {
      const isLoggedIn = !!user;
      
      if (loginBtn) {
        loginBtn.style.display = isLoggedIn ? 'none' : 'block';
      }
      
      if (accountMenu) {
        // !important를 우회하기 위해 setProperty 사용
        if (isLoggedIn) {
          accountMenu.style.setProperty('display', 'block', 'important');
        } else {
          accountMenu.style.setProperty('display', 'none', 'important');
        }
      }
      
      // 닉네임 업데이트 (드롭다운 메뉴 헤더에만 표시)
      await updateNickname(user);
    }
    
    // 초기 상태 설정 (initAuthUI 호출 전에 먼저 설정)
    const initial = await getUser();
    await updateHeaderUI(initial);
    
    // 인증 UI 초기화 (userLabel을 null로 설정하여 setUI가 닉네임을 덮어쓰지 않도록 함)
    await initAuthUI({
      scope: 'hub',
      providerButtons: [],
      defaultProvider: 'google',
      loginBtn,
      logoutBtn,
      userLabel: null, // 닉네임은 updateNickname에서 직접 관리
      statusLabel: null,
      toast: (msg) => console.log('[Account]', msg),
    });
    
    // initAuthUI 내부의 onAuthStateChange가 setUI를 호출하지만 userLabel이 null이므로 닉네임은 업데이트하지 않음
    // 우리의 onAuthStateChange가 나중에 실행되어 닉네임을 업데이트하도록 함
    // 하지만 initAuthUI 내부의 콜백이 먼저 실행될 수 있으므로, 약간의 지연을 두고 다시 업데이트
    setTimeout(async () => {
      const currentUser = await getUser();
      await updateHeaderUI(currentUser);
    }, 100);
    
    // 로그인 상태 변경 감지 (닉네임도 함께 업데이트)
    onAuthStateChange(async (user) => {
      await updateHeaderUI(user);
    });
    
  } catch (error) {
    console.warn('[Account] Header auth init failed, using guest mode:', error);
    const loginBtn = document.getElementById('headerLoginBtn');
    const accountMenu = document.getElementById('headerAccountMenu');
    if (loginBtn) loginBtn.style.display = 'block';
    if (accountMenu) accountMenu.style.setProperty('display', 'none', 'important');
  }
}
