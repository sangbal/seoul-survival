#!/usr/bin/env node
/**
 * OAuth E2E 테스트용 storageState 생성 스크립트
 * 
 * 사용법:
 *   npm run e2e:auth
 * 
 * 동작:
 *   1. 브라우저를 열고 허브 홈페이지로 이동
 *   2. Login 버튼 클릭
 *   3. 사용자가 구글 로그인 수행 (수동)
 *   4. 로그인 성공 후 storageState.json 저장
 *   5. 이후 테스트는 자동으로 로그인 상태 사용
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const AUTH_FILE = join(process.cwd(), 'playwright', '.auth', 'user.json');

async function setupAuth() {
  console.log('🔐 OAuth E2E 테스트용 storageState 생성');
  console.log('');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('1️⃣  허브 홈페이지로 이동...');
    await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    
    console.log('2️⃣  Login 버튼 클릭...');
    const loginBtn = page.locator('button:has-text("Login"), #headerLoginBtn');
    await loginBtn.click();
    
    console.log('');
    console.log('⏸️  구글 로그인 창이 열렸습니다.');
    console.log('   👤 지금 뜬 구글 로그인 창에서 계정을 선택/승인 버튼을 눌러주세요.');
    console.log('   ⏳ 로그인 완료를 기다리는 중...');
    console.log('');
    
    // OAuth 리다이렉트 대기 (최대 60초)
    try {
      // /auth/callback 또는 원래 페이지로 리다이렉트 대기
      await page.waitForURL(
        (url) => url.pathname === '/auth/callback' || url.pathname === '/',
        { timeout: 60000 }
      );
      
      // /auth/callback이면 원래 페이지로 리다이렉트 대기
      if (page.url().includes('/auth/callback')) {
        console.log('   ✅ /auth/callback 도착, 세션 교환 대기...');
        await page.waitForURL((url) => url.pathname === '/', { timeout: 10000 });
      }
      
      // 로그인 상태 확인 (헤더에 계정 메뉴가 표시되는지)
      await page.waitForTimeout(2000);
      const accountMenu = page.locator('#headerAccountMenu');
      const isLoggedIn = await accountMenu.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isLoggedIn) {
        console.log('   ✅ 로그인 성공 확인');
      } else {
        console.log('   ⚠️  로그인 상태 확인 실패 (계속 진행)');
      }
      
      // storageState 저장
      console.log('');
      console.log('3️⃣  storageState 저장 중...');
      mkdirSync(join(process.cwd(), 'playwright', '.auth'), { recursive: true });
      
      const storageState = await context.storageState();
      writeFileSync(AUTH_FILE, JSON.stringify(storageState, null, 2));
      
      console.log(`   ✅ 저장 완료: ${AUTH_FILE}`);
      console.log('');
      console.log('🎉 설정 완료! 이제 `npm test`로 로그인 상태 테스트를 실행할 수 있습니다.');
      
    } catch (error) {
      console.error('❌ 로그인 타임아웃 또는 실패:', error.message);
      console.log('');
      console.log('💡 해결 방법:');
      console.log('   1. 구글 로그인 창에서 계정을 선택했는지 확인');
      console.log('   2. 권한 승인 버튼을 눌렀는지 확인');
      console.log('   3. 네트워크 연결 상태 확인');
      process.exit(1);
    }
  } finally {
    await browser.close();
  }
}

setupAuth().catch((error) => {
  console.error('❌ 오류 발생:', error);
  process.exit(1);
});







