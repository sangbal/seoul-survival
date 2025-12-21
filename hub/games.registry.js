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
      ko: '서울에서 "노동→투자→자본" 루프로 생존하는 증분 클릭 게임',
      en: 'An incremental clicker about surviving Seoul through work → investment → capital.',
    },
    status: 'playable',
    featured: true,
    playPath: '/seoulsurvival/',
    storePath: '/games/seoulsurvival/',
    coverImage: 'seoulsurvival/assets/images/work_bg_01_alba_night.png',
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
        '짧게 시작해서 오래 붙잡는 "노동→투자→자본" 루프',
        '업적/랭킹으로 목표와 기록이 남는 플레이',
        '로그인 시 클라우드 저장으로 어디서든 이어하기',
        '가벼운 조작 + 꾸준한 성장 체감(출퇴근용 플레이에 최적)',
      ],
      en: [
        'A satisfying work → investment → capital loop',
        'Achievements & leaderboards for goals and bragging rights',
        'Cloud save when logged in—continue anywhere',
        'Light controls with steady sense of progress',
      ],
    },
    about: {
      ko: [
        'Capital Clicker: SeoulSurvivor는 서울에서 "돈의 흐름"을 체감하는 브라우저 기반 증분 클릭 게임이다.',
        '초반에는 노동으로 시드를 만들고, 점차 투자/자산으로 전환하며 성장 속도를 키운다.',
        '짧게 시작해도 좋고, 장기적으로 목표를 쌓아도 좋다. 플레이는 단순하지만 누적되는 선택이 판을 만든다.',
      ],
      en: [
        'Capital Clicker: SeoulSurvivor is a browser-based incremental clicker about feeling the flow of money in Seoul.',
        'Start with work to build your seed, then transition into investments and assets to accelerate growth.',
        'Play in short bursts or grind long-term goals—simple inputs, meaningful compounding choices.',
      ],
    },
    support: {
      ko: [
        '권장 환경: 최신 Chrome/Edge/Safari',
        '모바일: 터치 최적화(일부 기기에서 성능 차이 가능)',
        '저장: 비로그인 시 로컬 저장, 로그인 시 클라우드 저장(권장)',
      ],
      en: [
        'Recommended: latest Chrome/Edge/Safari',
        'Mobile: touch-friendly (performance may vary by device)',
        'Saving: local save when logged out, cloud save when logged in (recommended)',
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
        title: '업적 UI 개선 및 토글 로직 정리',
        body: '업적 섹션 토글 로직을 비활성화하고 UI를 단순화해 일관성을 강화했다. 플레이타임 표기는 ms 기반 포맷으로 안정화했다.',
      },
      en: {
        title: 'Achievements UI cleanup & toggle logic simplification',
        body: 'Simplified achievements section by removing toggle behavior and improving consistency. Playtime formatting is stabilized using ms-based formatting.',
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
