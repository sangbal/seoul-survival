import { defineConfig } from 'vite';
import { resolve } from 'path';

// 허브(index.html) + 게임(seoulsurvival/index.html)을 모두 빌드
export default defineConfig({
  // GitHub Pages + 커스텀 도메인 환경에서는 사이트 루트가 '/' 이므로 base는 '/'로 둔다.
  // 게임 엔트리는 /seoulsurvival/ 경로로 별도 엔트리로 노출된다.
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        seoulsurvival: resolve(__dirname, 'seoulsurvival/index.html'),
      },
    },
  },
});
