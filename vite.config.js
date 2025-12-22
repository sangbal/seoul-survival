import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// 허브(index.html) + 게임(seoulsurvival/index.html)을 모두 빌드
export default defineConfig(({ mode }) => {
  // VITE_ 프리픽스 env를 config가 있는 디렉터리(__dirname) 기준으로 강제 로드
  const env = loadEnv(mode, __dirname, 'VITE_');

  // package.json에서 version 읽기 (source of truth)
  const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
  const appVersion = packageJson.version;

  // 진단용 로그: 로컬/배포 환경에서 실제 env 주입 여부 확인
  console.log('[vite] envDir =', __dirname);
  console.log('[vite] VITE_SUPABASE_URL =', env.VITE_SUPABASE_URL || '(empty)');
  console.log(
    '[vite] VITE_SUPABASE_ANON_KEY length =',
    (env.VITE_SUPABASE_ANON_KEY || '').length
  );
  console.log('[vite] __APP_VERSION__ =', appVersion);

  return {
    // 정적 호스팅(GitHub Pages/Cloudflare Pages)에서 멀티 페이지(/, /seoulsurvival/, /account/)가
    // 서브 디렉터리에서도 자산 경로가 깨지지 않도록 상대 base를 사용한다.
    base: './',
    envDir: __dirname,
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          seoulsurvival: resolve(__dirname, 'seoulsurvival/index.html'),
          account: resolve(__dirname, 'account/index.html'),
          games: resolve(__dirname, 'games/index.html'),
          'games-seoulsurvival': resolve(__dirname, 'games/seoulsurvival/index.html'),
          'patch-notes': resolve(__dirname, 'patch-notes/index.html'),
          support: resolve(__dirname, 'support/index.html'),
          terms: resolve(__dirname, 'terms.html'),
          privacy: resolve(__dirname, 'privacy.html'),
        },
      },
    },
  };
});
