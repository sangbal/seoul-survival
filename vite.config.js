import { defineConfig } from 'vite';

// GitHub Pages 등 정적 호스팅에서도 동작하도록 상대 base 사용
export default defineConfig({
  base: './',
});
