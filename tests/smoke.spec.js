import { test, expect } from '@playwright/test';

test.describe('ClickSurvivor Hub - Smoke Tests', () => {
  test('Hub 로드 + Play Now 가시성 (모바일 viewport)', async ({ page }) => {
    // 모바일 viewport 설정
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // 헤더/푸터 확인
    await expect(page.locator('header, .header')).toBeVisible();
    await expect(page.locator('footer, .footer')).toBeVisible();
    
    // Play Now 버튼 확인
    const playNowBtn = page.locator('a:has-text("Play Now"), a:has-text("▶ Play Now")');
    await expect(playNowBtn).toBeVisible();
    
    // 모바일에서 fold 안에 있는지 확인 (스크롤 없이 보이는지)
    const boundingBox = await playNowBtn.boundingBox();
    expect(boundingBox).not.toBeNull();
    // viewport 높이(667) 내에 있는지 확인
    if (boundingBox) {
      expect(boundingBox.y + boundingBox.height).toBeLessThan(667);
    }
  });

  test('Play Now 링크 href 확인 + navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const playNowBtn = page.locator('a:has-text("Play Now"), a:has-text("▶ Play Now")');
    await expect(playNowBtn).toBeVisible();
    
    // href 속성 확인
    const href = await playNowBtn.getAttribute('href');
    expect(href).toContain('seoulsurvival');
    
    // 클릭 후 이동 확인
    await playNowBtn.click();
    await page.waitForTimeout(1000); // 네비게이션 대기
    
    // 404가 아닌지 확인 (URL이 변경되었는지)
    const url = new URL(page.url());
    expect(url.pathname).toContain('seoulsurvival');
  });

  test('Account 삭제 확인 UI enable 로직', async ({ page }) => {
    await page.goto('/account/', { waitUntil: 'domcontentloaded' });
    
    const deleteCheckbox = page.locator('#delete-confirm-checkbox');
    const deleteInput = page.locator('#delete-confirm-input');
    const deleteBtn = page.locator('#delete-account-btn');
    
    // 초기 상태: disabled (로그인하지 않은 경우)
    await expect(deleteBtn).toBeDisabled();
    
    // 로그인하지 않은 상태에서는 체크박스와 입력 필드도 disabled
    const isCheckboxDisabled = await deleteCheckbox.isDisabled();
    const isInputDisabled = await deleteInput.isDisabled();
    
    if (isCheckboxDisabled || isInputDisabled) {
      // 로그인하지 않은 상태: 모든 요소가 disabled인지 확인
      await expect(deleteCheckbox).toBeDisabled();
      await expect(deleteInput).toBeDisabled();
      await expect(deleteBtn).toBeDisabled();
    } else {
      // 로그인한 상태: 정상적인 enable/disable 로직 테스트
      // 체크박스만 체크: 여전히 disabled
      await deleteCheckbox.check();
      await expect(deleteBtn).toBeDisabled();
      
      // DELETE 입력: enabled
      await deleteInput.fill('DELETE');
      await expect(deleteBtn).toBeEnabled();
      
      // DELETE가 아닌 다른 값: disabled
      await deleteInput.fill('DELETE2');
      await expect(deleteBtn).toBeDisabled();
      
      // 다시 DELETE로 변경: enabled
      await deleteInput.fill('DELETE');
      await expect(deleteBtn).toBeEnabled();
      
      // 체크박스 해제: disabled
      await deleteCheckbox.uncheck();
      await expect(deleteBtn).toBeDisabled();
    }
  });

  test('푸터 SNS 링크 속성 확인', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // SNS 링크 찾기
    const xLink = page.locator('footer a[href*="x.com"], footer a[href*="twitter"]').first();
    const instagramLink = page.locator('footer a[href*="instagram"]').first();
    const threadsLink = page.locator('footer a[href*="threads"]').first();
    
    // X 링크 확인
    if (await xLink.count() > 0) {
      const href = await xLink.getAttribute('href');
      const target = await xLink.getAttribute('target');
      const rel = await xLink.getAttribute('rel');
      const ariaLabel = await xLink.getAttribute('aria-label');
      
      expect(href).toContain('x.com');
      expect(target).toBe('_blank');
      expect(rel).toContain('noopener');
      expect(ariaLabel).toBeTruthy();
    }
    
    // Instagram 링크 확인
    if (await instagramLink.count() > 0) {
      const href = await instagramLink.getAttribute('href');
      const target = await instagramLink.getAttribute('target');
      const rel = await instagramLink.getAttribute('rel');
      
      expect(href).toContain('instagram');
      expect(target).toBe('_blank');
      expect(rel).toContain('noopener');
    }
    
    // Threads 링크 확인
    if (await threadsLink.count() > 0) {
      const href = await threadsLink.getAttribute('href');
      const target = await threadsLink.getAttribute('target');
      const rel = await threadsLink.getAttribute('rel');
      
      expect(href).toContain('threads');
      expect(target).toBe('_blank');
      expect(rel).toContain('noopener');
    }
  });
});
