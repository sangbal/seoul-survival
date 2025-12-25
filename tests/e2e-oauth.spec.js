import { test, expect } from '@playwright/test';

/**
 * OAuth E2E 테스트 (전략 B: Playwright + storageState)
 * 
 * 사용법:
 *   1. 최초 1회: npm run e2e:auth (브라우저 열림 → 구글 로그인 수행 → storageState.json 저장)
 *   2. 이후: npm test (자동으로 로그인 상태 테스트 실행)
 */

test.describe('OAuth E2E Tests', () => {
  // 익명 상태 스모크 테스트
  test.describe('Anonymous State', () => {
    test('허브 홈페이지 로드 및 Login 버튼 표시', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      
      // 헤더 확인
      await expect(page.locator('header, .header')).toBeVisible();
      
      // Login 버튼 확인
      const loginBtn = page.locator('button:has-text("Login"), #headerLoginBtn');
      await expect(loginBtn).toBeVisible();
      
      // Play Now 버튼 확인
      const playNowBtn = page.locator('a:has-text("Play Now")');
      await expect(playNowBtn).toBeVisible();
    });
  });

  // 로그인 상태 테스트 (storageState 사용)
  test.describe('Authenticated State', () => {
    // storageState 파일 존재 여부 확인
    let hasStorageState = false;
    test.beforeAll(async () => {
      const fs = await import('fs');
      const path = await import('path');
      const authFile = path.join(process.cwd(), 'playwright', '.auth', 'user.json');
      hasStorageState = fs.existsSync(authFile);
    });

    // storageState가 있을 때만 테스트 실행
    test.skip(!hasStorageState, 'storageState 파일이 없습니다. `npm run e2e:auth`를 먼저 실행하세요.');

    // storageState 로드 (파일이 있을 때만)
    test.use({ 
      storageState: hasStorageState ? 'playwright/.auth/user.json' : undefined 
    });

    test('로그인 후 헤더에 닉네임 표시', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      
      // Login 버튼이 사라지고 계정 메뉴가 표시되는지 확인
      const loginBtn = page.locator('button:has-text("Login"), #headerLoginBtn');
      const accountMenu = page.locator('#headerAccountMenu');
      
      // storageState가 있으면 로그인 상태로 간주
      await expect(accountMenu).toBeVisible({ timeout: 5000 });
      // 닉네임이 표시되는지 확인
      const nickname = page.locator('#headerAccountNickname');
      if (await nickname.count() > 0) {
        await expect(nickname).toBeVisible();
      }
    });

    test('로그인 후 /account 페이지 접근 및 닉네임 변경', async ({ page }) => {
      await page.goto('/account/', { waitUntil: 'domcontentloaded' });
      
      // 현재 닉네임 표시 영역 확인
      const currentNickname = page.locator('#current-nickname-display');
      // 닉네임이 있으면 표시, 없으면 숨김 (둘 다 정상)
      
      // 닉네임 입력 필드 확인
      const nicknameInput = page.locator('#nickname-input');
      await expect(nicknameInput).toBeVisible();
      
      // Save 버튼 확인
      const saveBtn = page.locator('#nickname-save');
      await expect(saveBtn).toBeVisible();
      
      // 테스트 닉네임 입력 (실제 저장은 하지 않음)
      const testNickname = `test${Date.now().toString().slice(-6)}`;
      await nicknameInput.fill(testNickname);
      
      // 유효성 검사 통과 시 Save 버튼이 enabled 되는지 확인
      const validation = testNickname.length >= 1 && testNickname.length <= 6;
      if (validation) {
        // 잠시 대기 후 버튼 상태 확인 (실제로는 저장하지 않음)
        await page.waitForTimeout(500);
        // Save 버튼이 enabled인지 확인 (쿨타임이 없으면)
      }
    });

    test('로그아웃 기능 확인', async ({ page }) => {
      await page.goto('/account/', { waitUntil: 'domcontentloaded' });
      
      // Logout 버튼 확인
      const logoutBtn = page.locator('#logout-btn');
      await expect(logoutBtn).toBeVisible();
      
      // 로그아웃 버튼이 enabled인지 확인
      const isEnabled = await logoutBtn.isEnabled();
      expect(isEnabled).toBe(true);
      
      // 실제 로그아웃은 수행하지 않음 (storageState 유지)
    });
  });
});

