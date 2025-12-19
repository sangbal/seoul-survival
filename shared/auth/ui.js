import { getUser, initAuthFromUrl, isAuthEnabled, onAuthStateChange, signInWithOAuth, signOut } from './core.js';
import { deleteUserData } from './deleteUserData.js';
import { deleteAccount } from './deleteAccount.js';

function pickDisplayName(user) {
  if (!user) return null;
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.preferred_username ||
    user.email ||
    user.id?.slice(0, 8)
  );
}

function pickEmail(user) {
  if (!user) return null;
  return user.email || null;
}

export async function initAuthUI(opts) {
  const {
    scope = 'hub',
    providerButtons = [],
    defaultProvider = 'google',
    loginBtn,
    logoutBtn,
    userLabel,
    statusLabel,
    toast,
  } = opts || {};

  const t = typeof toast === 'function' ? toast : () => {};

  // Exchange OAuth code if we were redirected back.
  await initAuthFromUrl();

  function setUI(user) {
    const name = pickDisplayName(user);
    if (userLabel) {
      userLabel.textContent = name ? name : (scope === 'hub' ? 'Guest' : '게스트');
      userLabel.hidden = false;
      userLabel.setAttribute('aria-hidden', 'false');
    }
    if (statusLabel) {
      if (!isAuthEnabled()) {
        // 키가 설정되지 않은 경우: 개발자용 경고 대신 유저에게는 "게스트 모드"만 안내
        statusLabel.textContent =
          scope === 'hub'
            ? 'Guest mode (로그인 준비 중)'
            : '게스트 모드 (로그인 준비 중)';
        statusLabel.style.color = 'rgba(148, 163, 184, .95)';
      } else if (name) {
        statusLabel.textContent = scope === 'hub' ? 'Signed in' : '로그인됨';
        statusLabel.style.color = 'rgba(52, 211, 153, .95)';
      } else {
        statusLabel.textContent = scope === 'hub' ? 'Not signed in' : '로그인 안 됨';
        statusLabel.style.color = 'rgba(148, 163, 184, .95)';
      }
    }

    // 로그인 상태에 따라 버튼 표시/숨김 및 접근성 제어
    if (loginBtn) {
      const isLoggedIn = !!name;
      loginBtn.hidden = isLoggedIn;
      loginBtn.setAttribute('aria-hidden', isLoggedIn ? 'true' : 'false');
      loginBtn.setAttribute('tabindex', isLoggedIn ? '-1' : '0');
    }
    if (logoutBtn) {
      const isLoggedIn = !!name;
      logoutBtn.hidden = !isLoggedIn;
      logoutBtn.setAttribute('aria-hidden', !isLoggedIn ? 'true' : 'false');
      logoutBtn.setAttribute('tabindex', !isLoggedIn ? '-1' : '0');
    }
    
    // providerButtons 컨테이너 표시/숨김 (로그인 시 숨김)
    // 인라인 스타일이 있으므로 style.display를 직접 설정
    const authProviderButtons = document.getElementById('authProviderButtons');
    if (authProviderButtons) {
      authProviderButtons.style.display = name ? 'none' : 'flex';
    }
    
    // 계정 섹션 표시/숨김 (메인 페이지와 account 페이지 모두 지원)
    const accountGuestInfo = document.getElementById('accountGuestInfo');
    if (accountGuestInfo) {
      accountGuestInfo.style.display = name ? 'none' : 'block';
    }
    
    const accountLoggedInInfo = document.getElementById('accountLoggedInInfo');
    if (accountLoggedInInfo) {
      accountLoggedInInfo.style.display = name ? 'block' : 'none';
    }
    
    const accountOverviewSection = document.getElementById('accountOverviewSection');
    if (accountOverviewSection) {
      accountOverviewSection.style.display = name ? 'block' : 'none';
    }
    
    const preferencesSection = document.getElementById('preferencesSection');
    if (preferencesSection) {
      preferencesSection.style.display = name ? 'block' : 'block'; // 로그인 여부와 관계없이 표시
    }
    
    const privacyDataSection = document.getElementById('privacyDataSection');
    if (privacyDataSection) {
      privacyDataSection.style.display = name ? 'block' : 'none';
    }
    
    const dangerZoneSection = document.getElementById('dangerZoneSection');
    if (dangerZoneSection) {
      dangerZoneSection.style.display = name ? 'block' : 'none';
    }
    
    // 허브 계정 섹션의 사용자 정보 표시/숨김 및 업데이트
    const authUserInfo = document.getElementById('authUserInfo');
    if (authUserInfo) {
      authUserInfo.style.display = name ? 'block' : 'none';
      // 이메일 표시 업데이트
      const emailLabel = document.getElementById('authUserEmail');
      if (emailLabel) {
        const email = pickEmail(user);
        emailLabel.textContent = email || '(이메일 없음)';
      }
      // 표시명 업데이트
      const nameLabel = document.getElementById('authUserName');
      if (nameLabel) {
        nameLabel.textContent = name || 'Guest';
      }
    }
    
    // 클라우드 저장 섹션 표시/숨김 (로그인 시에만 표시)
    const cloudSaveSection = document.getElementById('cloudSaveSection');
    if (cloudSaveSection) {
      cloudSaveSection.style.display = name ? 'block' : 'none';
    }
    
    const guestSaveInfo = document.getElementById('guestSaveInfo');
    if (guestSaveInfo) {
      guestSaveInfo.style.display = name ? 'none' : 'block';
    }
  }

  const initial = await getUser();
  setUI(initial);

  const off = onAuthStateChange((user) => setUI(user));

  async function doLogin(provider) {
    if (!isAuthEnabled()) {
      t(scope === 'hub' ? '현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.' : '현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.');
      return;
    }
    t(scope === 'hub' ? 'Redirecting…' : '이동 중…');
    const r = await signInWithOAuth(provider);
    if (!r.ok) t(scope === 'hub' ? 'Login failed' : '로그인 실패');
  }

  async function doLogout() {
    if (!isAuthEnabled()) return;
    const r = await signOut();
    if (!r.ok) t(scope === 'hub' ? 'Logout failed' : '로그아웃 실패');
    else t(scope === 'hub' ? 'Signed out' : '로그아웃');
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      doLogin(defaultProvider);
    });
  }

  providerButtons.forEach((btn) => {
    const provider = btn?.dataset?.authProvider;
    if (!provider) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      doLogin(provider);
    });
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      doLogout();
    });
  }

  // 내 데이터 삭제 버튼 처리 (Privacy & Data 섹션)
  const deleteDataBtn = document.getElementById('deleteDataBtn');
  if (deleteDataBtn) {
    deleteDataBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleDeleteData(scope, t, doLogout);
    });
  }

  // 계정 삭제 버튼 처리 (Danger Zone 섹션에만 존재)
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleDeleteAccount(scope, t, doLogout);
    });
  }

  // 드로어 메뉴에는 내 데이터 삭제 버튼을 제거하고 "계정 관리" 링크만 제공 (실수 방지)
  // 실제 삭제 버튼은 계정 섹션(#account)에만 존재

  return { off };
}

/**
 * Handle delete user data with 2-step confirmation
 */
async function handleDeleteData(scope, toast, doLogout) {
  const t = typeof toast === 'function' ? toast : () => {};

  // 1단계 확인
  const confirm1 = scope === 'hub'
    ? '모든 클라우드 데이터(저장, 리더보드)와 로컬 게임 저장을 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없으며, 삭제 후에는 로그아웃됩니다.\n\n언어 설정은 유지됩니다.'
    : '모든 클라우드 데이터(저장, 리더보드)와 로컬 게임 저장을 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없으며, 삭제 후에는 로그아웃됩니다.\n\n언어 설정은 유지됩니다.';
  
  if (!confirm(confirm1)) {
    return;
  }

  // 2단계 확인
  const confirm2 = scope === 'hub'
    ? '정말로 삭제하시겠습니까?\n\n삭제될 데이터:\n• 클라우드 저장\n• 리더보드 기록\n• 로컬 게임 저장\n\n삭제 후에는 로그아웃되고 페이지가 새로고침됩니다.'
    : '정말로 삭제하시겠습니까?\n\n삭제될 데이터:\n• 클라우드 저장\n• 리더보드 기록\n• 로컬 게임 저장\n\n삭제 후에는 로그아웃되고 페이지가 새로고침됩니다.';
  
  if (!confirm(confirm2)) {
    return;
  }

  t(scope === 'hub' ? 'Deleting data…' : '데이터 삭제 중…');

  let result;
  try {
    result = await deleteUserData();
  } catch (error) {
    console.error('Delete user data exception:', error);
    const errorMsg = scope === 'hub'
      ? '데이터 삭제 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.'
      : '데이터 삭제 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.';
    t(errorMsg);
    return;
  }
  
  if (!result.ok) {
    let errorMsg;
    if (result.reason === 'not_configured') {
      errorMsg = scope === 'hub'
        ? '데이터 삭제 기능이 설정되지 않았습니다.'
        : '데이터 삭제 기능이 설정되지 않았습니다.';
    } else if (result.reason === 'not_signed_in') {
      errorMsg = scope === 'hub'
        ? '로그인 상태가 아닙니다. 다시 로그인해주세요.'
        : '로그인 상태가 아닙니다. 다시 로그인해주세요.';
    } else if (result.reason === 'delete_saves_failed' || result.reason === 'delete_leaderboard_failed') {
      const errorCode = result.error?.code || result.error?.status || '';
      if (errorCode === 401 || errorCode === 403) {
        errorMsg = scope === 'hub'
          ? '권한이 없습니다. 다시 로그인해주세요.'
          : '권한이 없습니다. 다시 로그인해주세요.';
      } else {
        errorMsg = scope === 'hub'
          ? `데이터 삭제 실패: ${result.reason}. 네트워크 연결을 확인하고 다시 시도해주세요.`
          : `데이터 삭제 실패: ${result.reason}. 네트워크 연결을 확인하고 다시 시도해주세요.`;
      }
    } else {
      errorMsg = scope === 'hub'
        ? `데이터 삭제 실패: ${result.reason || '알 수 없는 오류'}. 다시 시도해주세요.`
        : `데이터 삭제 실패: ${result.reason || '알 수 없는 오류'}. 다시 시도해주세요.`;
    }
    
    t(errorMsg);
    console.error('Delete user data failed:', result);
    
    // 권한 오류나 로그인 상태 오류인 경우 로그아웃 유도
    if (result.reason === 'not_signed_in' || result.error?.code === 401 || result.error?.code === 403) {
      setTimeout(() => {
        if (confirm(scope === 'hub' ? '로그아웃하시겠습니까?' : '로그아웃하시겠습니까?')) {
          doLogout();
        }
      }, 1000);
    }
    return;
  }

  // 로컬 저장소 초기화 (계정/세이브 관련 키만 삭제, 언어 설정 등 환경설정은 유지)
  try {
    // 삭제 대상: 계정/세이브 관련 키
    const keysToDelete = [
      'clicksurvivor-auth',  // 인증 상태
      'seoulTycoonSaveV1',  // 게임 저장 데이터
    ];
    
    // 추가로 clicksurvivor-로 시작하는 다른 키도 삭제 (향후 확장 대비)
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('clicksurvivor-') && key !== 'clicksurvivor_lang') {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`Failed to remove localStorage key "${key}":`, e);
      }
    });
    
    // 유지 대상: clicksurvivor_lang (언어 설정)
    // 유지 대상: 기타 환경설정 키들
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
  }

  t(scope === 'hub' ? 'Data deleted. Signing out…' : '데이터가 삭제되었습니다. 로그아웃 중…');

  // 로그아웃
  await doLogout();
  
  // 페이지 새로고침 (로그아웃 후 상태 정리)
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

/**
 * Handle delete account (회원 탈퇴) with 2-step confirmation
 */
async function handleDeleteAccount(scope, toast, doLogout) {
  const t = typeof toast === 'function' ? toast : () => {};

  // 1단계 확인
  const confirm1 = scope === 'hub'
    ? '계정과 모든 데이터를 영구적으로 삭제하시겠습니까?\n\n⚠️ 삭제될 내용:\n• 계정 정보 (이메일, 로그인 정보)\n• 클라우드 저장\n• 리더보드 기록\n• 로컬 게임 저장\n\n이 작업은 되돌릴 수 없으며, 삭제 후에는 로그아웃됩니다.\n\n언어 설정은 유지됩니다.'
    : '계정과 모든 데이터를 영구적으로 삭제하시겠습니까?\n\n⚠️ 삭제될 내용:\n• 계정 정보 (이메일, 로그인 정보)\n• 클라우드 저장\n• 리더보드 기록\n• 로컬 게임 저장\n\n이 작업은 되돌릴 수 없으며, 삭제 후에는 로그아웃됩니다.\n\n언어 설정은 유지됩니다.';
  
  if (!confirm(confirm1)) {
    return;
  }

  // 2단계 확인
  const confirm2 = scope === 'hub'
    ? '정말로 계정을 삭제하시겠습니까?\n\n이 작업은 다음을 포함합니다:\n• 계정 정보 완전 삭제\n• 모든 클라우드 데이터 삭제\n• 모든 로컬 게임 저장 삭제\n\n삭제 후에는 로그아웃되고 페이지가 새로고침됩니다.\n\n이 작업은 되돌릴 수 없습니다.'
    : '정말로 계정을 삭제하시겠습니까?\n\n이 작업은 다음을 포함합니다:\n• 계정 정보 완전 삭제\n• 모든 클라우드 데이터 삭제\n• 모든 로컬 게임 저장 삭제\n\n삭제 후에는 로그아웃되고 페이지가 새로고침됩니다.\n\n이 작업은 되돌릴 수 없습니다.';
  
  if (!confirm(confirm2)) {
    return;
  }

  t(scope === 'hub' ? 'Deleting account…' : '계정 삭제 중…');

  let result;
  try {
    result = await deleteAccount();
  } catch (error) {
    console.error('Delete account exception:', error);
    const errorMsg = scope === 'hub'
      ? '계정 삭제 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.'
      : '계정 삭제 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.';
    t(errorMsg);
    return;
  }
  
  if (!result.ok) {
    let errorMsg;
    if (result.status === 'NOT_CONFIGURED') {
      errorMsg = scope === 'hub'
        ? '계정 삭제 기능이 설정되지 않았습니다. 고객지원에 문의해주세요.'
        : '계정 삭제 기능이 설정되지 않았습니다. 고객지원에 문의해주세요.';
    } else if (result.status === 'AUTH_FAILED') {
      errorMsg = scope === 'hub'
        ? '로그인 상태가 만료되었습니다. 다시 로그인해주세요.'
        : '로그인 상태가 만료되었습니다. 다시 로그인해주세요.';
    } else if (result.status === 'DATA_DELETED_BUT_AUTH_DELETE_FAILED') {
      errorMsg = scope === 'hub'
        ? '데이터는 삭제되었지만 계정 삭제에 실패했습니다. 고객지원에 문의해주세요.'
        : '데이터는 삭제되었지만 계정 삭제에 실패했습니다. 고객지원에 문의해주세요.';
    } else if (result.reason === 'timeout') {
      errorMsg = scope === 'hub'
        ? '요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요.'
        : '요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요.';
    } else if (result.reason === 'network_error') {
      errorMsg = scope === 'hub'
        ? '네트워크 오류가 발생했습니다. 연결을 확인하고 다시 시도해주세요.'
        : '네트워크 오류가 발생했습니다. 연결을 확인하고 다시 시도해주세요.';
    } else if (result.httpStatus === 404) {
      errorMsg = scope === 'hub'
        ? '계정 삭제 기능이 아직 준비되지 않았습니다. 고객지원에 문의해주세요.'
        : '계정 삭제 기능이 아직 준비되지 않았습니다. 고객지원에 문의해주세요.';
    } else {
      errorMsg = scope === 'hub'
        ? `계정 삭제 실패: ${result.reason || '알 수 없는 오류'}. 다시 시도해주세요.`
        : `계정 삭제 실패: ${result.reason || '알 수 없는 오류'}. 다시 시도해주세요.`;
    }
    
    t(errorMsg);
    console.error('Delete account failed:', result);
    return;
  }

  // 계정 삭제 성공: 로컬 저장소 초기화 (계정/세이브 관련 키만 삭제, 언어 설정 등 환경설정은 유지)
  try {
    const keysToDelete = [
      'clicksurvivor-auth',
      'seoulTycoonSaveV1',
    ];
    
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('clicksurvivor-') && key !== 'clicksurvivor_lang') {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`Failed to remove localStorage key "${key}":`, e);
      }
    });
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
  }

  t(scope === 'hub' ? 'Account deleted. Signing out…' : '계정이 삭제되었습니다. 로그아웃 중…');

  // 로그아웃 (이미 계정이 삭제되었으므로 실패할 수 있지만 시도)
  try {
    await doLogout();
  } catch (e) {
    console.warn('Logout after account deletion failed (expected):', e);
  }
  
  // 페이지 새로고침 (계정 삭제 후 상태 정리)
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}


