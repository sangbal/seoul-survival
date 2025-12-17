import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

// 허브(index.html) + 게임(seoulsurvival/index.html)을 모두 빌드
export default defineConfig(({ mode }) => {
  // VITE_ 프리픽스 env를 config가 있는 디렉터리(__dirname) 기준으로 강제 로드
  const env = loadEnv(mode, __dirname, 'VITE_');

  // 진단용 로그: 로컬/배포 환경에서 실제 env 주입 여부 확인
  console.log('[vite] envDir =', __dirname);
  console.log('[vite] VITE_SUPABASE_URL =', env.VITE_SUPABASE_URL || '(empty)');
  console.log(
    '[vite] VITE_SUPABASE_ANON_KEY length =',
    (env.VITE_SUPABASE_ANON_KEY || '').length
  );

  return {
    // GitHub Pages + 커스텀 도메인 환경에서는 사이트 루트가 '/' 이므로 base는 '/'로 둔다.
    // 게임 엔트리는 /seoulsurvival/ 경로로 별도 엔트리로 노출된다.
    base: '/',
    envDir: __dirname,
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          seoulsurvival: resolve(__dirname, 'seoulsurvival/index.html'),
        },
      },
    },
  };
});
