import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// package.json에서 버전 읽기
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

// ClickSurvivor Hub 멀티페이지 구성
export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        account: resolve(__dirname, 'account/index.html'),
        'account-profile': resolve(__dirname, 'account/profile/index.html'),
        'account-connected': resolve(__dirname, 'account/connected/index.html'),
        'account-security': resolve(__dirname, 'account/security/index.html'),
        'account-delete': resolve(__dirname, 'account/delete/index.html'),
        'auth-callback': resolve(__dirname, 'auth/callback/index.html'),
        terms: resolve(__dirname, 'terms.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        seoulsurvival: resolve(__dirname, 'seoulsurvival/index.html'),
      },
    },
  },
});
