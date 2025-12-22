/**
 * 게임 레지스트리 (단일 소스)
 * 
 * 허브의 모든 게임 정보를 중앙에서 관리합니다.
 * status: "playable" | "comingSoon" | "hidden"
 * - playable: 플레이 가능, Play 버튼 표시
 * - comingSoon: 준비 중, "Coming Soon" 배지 표시
 * - hidden: 허브/카탈로그 어디에도 노출되지 않음
 */
export const GAMES_REGISTRY = [
  {
    slug: 'seoulsurvival',
    title: {
      ko: 'Capital Clicker: SeoulSurvivor',
      en: 'Capital Clicker: SeoulSurvivor',
    },
    shortTitle: {
      ko: 'SeoulSurvivor',
      en: 'SeoulSurvivor',
    },
    tagline: {
      ko: '서울에서 "노동→투자→자본" 루프로 성장하는 브라우저 증분 클릭 게임',
      en: 'A browser-based incremental clicker about growing in Seoul through work → investment → capital.',
    },
    status: 'playable',
    featured: true,
    playPath: '/seoulsurvival/',
    storePath: '/games/seoulsurvival/',
    coverImage: '/og/og-seoulsurvivor.png?v=2025-12-21',
    heroMedia: {
      type: 'image',
      src: 'seoulsurvival/assets/images/work_bg_01_alba_night.png',
    },
    tags: [
      { ko: '증분(Incremental)', en: 'Incremental' },
      { ko: '클리커', en: 'Clicker' },
      { ko: '싱글플레이', en: 'Single-player' },
      { ko: '브라우저 게임', en: 'Browser game' },
      { ko: '업적', en: 'Achievements' },
      { ko: '리더보드', en: 'Leaderboard' },
    ],
    keyFeatures: {
      ko: [
        '노동→투자→자본 전환의 가속 체감: 클릭으로 시작해 수동 수익으로 전환하는 성장 곡선',
        '업적/랭킹으로 목표와 기록: 30개 이상의 업적과 글로벌 리더보드로 동기 부여',
        '로그인 시 클라우드 저장으로 기기 이동: 여러 기기에서 진행 상황 동기화',
        '단순 조작 + 꾸준한 성장: 출퇴근/짬플레이에 최적화된 가벼운 플레이',
        '밸런스 조정/패치노트 지속 운영: 정기적인 업데이트와 밸런스 개선',
      ],
      en: [
        'Accelerating transition from work → investment → capital: Growth curve from clicks to passive income',
        'Achievements & leaderboards for goals and records: 30+ achievements and global leaderboard for motivation',
        'Cloud save when logged in for device switching: Sync progress across multiple devices',
        'Simple controls with steady growth: Light gameplay optimized for commute/casual play',
        'Ongoing balance adjustments and patch notes: Regular updates and balance improvements',
      ],
    },
    about: {
      ko: [
        'Capital Clicker: SeoulSurvivor는 서울의 생활감과 돈의 흐름을 증분(Incremental) 장르로 재해석한 브라우저 기반 클릭 게임이다. 알바에서 시작해 CEO까지, 노동으로 시드를 만들고 투자로 가속하며 자산화와 지표 최적화의 루프를 경험한다.',
        '코어 루프는 단순하다. 노동 클릭으로 초기 자본을 모으고, 금융상품과 부동산에 투자해 수동 수익을 늘린다. 승진과 업그레이드로 효율을 높이고, 시장 이벤트의 타이밍을 잡아 자산을 폭증시킨다. 최종 목표는 서울타워 구매로, 프레스티지 시스템을 통해 반복 플레이의 재미를 제공한다.',
        '플레이 템포는 자유롭다. 짧게 5분 플레이해도 성장을 체감할 수 있고, 장기적으로 업적과 랭킹을 목표로 삼아도 좋다. 로그인 시 클라우드 저장으로 여러 기기에서 이어하기가 가능하며, 업적과 리더보드로 목표와 기록을 남긴다.',
      ],
      en: [
        'Capital Clicker: SeoulSurvivor is a browser-based incremental clicker that reinterprets the life and flow of money in Seoul through the incremental genre. Starting from part-time work to CEO, you build your seed through labor, accelerate through investment, and experience the loop of asset accumulation and metric optimization.',
        'The core loop is simple. Gather initial capital through labor clicks, invest in financial products and real estate to increase passive income. Improve efficiency through promotions and upgrades, and catch market event timing to explode your assets. The final goal is purchasing Seoul Tower, providing replay value through the prestige system.',
        'Play at your own pace. You can feel growth even in a short 5-minute session, or set long-term goals with achievements and leaderboards. Cloud save when logged in allows you to continue across devices, and achievements and leaderboards provide goals and records.',
      ],
    },
    support: {
      ko: [
        '권장 브라우저: 최신 Chrome/Edge/Safari',
        '저장: 비로그인 시 로컬 저장(5초마다 자동), 로그인 시 클라우드 저장(탭 닫기 시 자동 플러시)',
        '모바일: 기기별 성능 편차 가능, 터치 최적화 적용',
        '인앱 브라우저: 카카오톡/인스타그램 등 인앱 브라우저에서는 Google 로그인 제한 가능',
      ],
      en: [
        'Recommended browsers: Latest Chrome/Edge/Safari',
        'Saving: Local save (auto every 5s) when logged out, cloud save (auto flush on tab close) when logged in',
        'Mobile: Performance may vary by device, touch-optimized',
        'In-app browsers: Google login may be restricted in KakaoTalk/Instagram in-app browsers',
      ],
    },
    screenshots: [
      {
        src: 'seoulsurvival/assets/images/work_bg_01_alba_night.png',
        alt: { ko: 'SeoulSurvivor 플레이 화면', en: 'SeoulSurvivor gameplay screen' },
      },
      {
        src: 'seoulsurvival/assets/images/work_bg_05_gwajang_night.png',
        alt: { ko: '승진 시스템', en: 'Promotion system' },
      },
      {
        src: 'seoulsurvival/assets/images/settings_gameinfo_bg.webp',
        alt: { ko: '업적/랭킹 UI', en: 'Achievements/leaderboard UI' },
      },
    ],
    lastUpdated: '2025-12-21',
    patchNotePreview: {
      ko: {
        title: '업적 UI 정리 + 표기 안정화',
        body: '업적 섹션 UI를 단순화하고 토글/표기 혼선을 줄였다. 플레이타임 표기는 ms 기준 포맷으로 안정화했다.',
      },
      en: {
        title: 'Achievements UI cleanup & display stabilization',
        body: 'Simplified achievements section UI and reduced toggle/display confusion. Playtime display is stabilized using ms-based formatting.',
      },
      link: '/patch-notes/',
    },
  },
  {
    slug: 'kimchiinvasion',
    title: {
      ko: 'Kimchi Invasion',
      en: 'Kimchi Invasion',
    },
    shortTitle: {
      ko: 'Kimchi Invasion',
      en: 'Kimchi Invasion',
    },
    tagline: {
      ko: '김치가 세계를 점령하는 뇌절 증분 게임 (개발 중)',
      en: 'A chaotic incremental game where kimchi conquers the world (in development).',
    },
    status: 'comingSoon',
    featured: false,
    playPath: '/kimchiinvasion/',
    storePath: '/games/kimchiinvasion/',
    coverImage: 'seoulsurvival/assets/images/work_bg_01_alba_night.png', // 임시
    heroMedia: {
      type: 'image',
      src: 'seoulsurvival/assets/images/work_bg_01_alba_night.png', // 임시
    },
    tags: [
      { ko: '증분(Incremental)', en: 'Incremental' },
      { ko: '코미디', en: 'Comedy' },
      { ko: '개발 중', en: 'In development' },
    ],
    keyFeatures: {
      ko: ['준비 중'],
      en: ['Coming soon'],
    },
    about: {
      ko: ['준비 중'],
      en: ['Coming soon'],
    },
    support: {
      ko: ['준비 중'],
      en: ['Coming soon'],
    },
    screenshots: [],
    lastUpdated: '2025-12-21',
    patchNotePreview: null,
  },
];

/**
 * 레지스트리에서 게임 조회
 */
export function getGame(slug) {
  return GAMES_REGISTRY.find((g) => g.slug === slug);
}

/**
 * 플레이 가능한 게임 목록
 */
export function getPlayableGames() {
  return GAMES_REGISTRY.filter((g) => g.status === 'playable');
}

/**
 * Coming Soon 게임 목록
 */
export function getComingSoonGames() {
  return GAMES_REGISTRY.filter((g) => g.status === 'comingSoon');
}

/**
 * 노출 가능한 게임 목록 (hidden 제외)
 */
export function getVisibleGames() {
  return GAMES_REGISTRY.filter((g) => g.status !== 'hidden');
}

/**
 * Featured 게임 (홈 히어로용)
 */
export function getFeaturedGame() {
  return GAMES_REGISTRY.find((g) => g.featured === true && g.status === 'playable');
}

/**
 * 최근 업데이트된 게임 (updatedAt 기준, 최신순)
 */
export function getRecentlyUpdatedGames(limit = 3) {
  return getVisibleGames()
    .sort((a, b) => new Date(b.lastUpdated || b.updatedAt || '1970-01-01') - new Date(a.lastUpdated || a.updatedAt || '1970-01-01'))
    .slice(0, limit);
}
