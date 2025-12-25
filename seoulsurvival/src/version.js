/**
 * 게임 버전 상수
 * 
 * 이 파일은 Vite 빌드 시 package.json의 version을 자동으로 주입받습니다.
 * package.json이 source of truth이며, 게임 내 모든 버전 표시는 이 상수를 사용합니다.
 * 
 * @see vite.config.js - define.__APP_VERSION__
 */

// Vite 빌드 시 주입되는 버전 (package.json의 version 필드)
// @ts-ignore - Vite define은 빌드 타임에 주입되므로 타입 체크에서 제외
export const GAME_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';














