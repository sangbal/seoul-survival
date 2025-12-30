export type UiTextDef = {
  weightClasses: Record<string, string>;
  tiers: Record<number, string>;
  styles: Record<string, string>;
  stats: Record<string, string>;
};

export const uiText: UiTextDef = {
  weightClasses: {
    FW: '페더급 (66kg)',
    LW: '라이트급 (70kg)',
    WW: '웰터급 (77kg)',
    MW: '미들급 (84kg)',
  },
  tiers: {
    1: 'Major Global (Tier 1)',
    2: 'Major Continental (Tier 2)',
    3: 'Pro League (Tier 3)',
    4: 'Regional Top (Tier 4)',
    5: 'Regional Mid (Tier 5)',
    6: 'Rookie League (Tier 6)',
  },
  styles: {
    ALL_ROUND: '올라운더',
    COUNTER_RANGE: '카운터/거리',
    PRESSURE_BRAWL: '압박/난타',
    WRESTLE_CTRL: '레슬링/컨트롤',
    KICK_LEG: '킥복싱',
    BJJ_SUB: '주짓수/서브미션',
  },
  stats: {
    slpm: '분당 타격',
    sapm: '분당 피타격',
    sigAcc: '타격 적중률',
    sigDef: '타격 방어율',
    tdPer15: '15분당 TD',
    tdAcc: 'TD 성공률',
    tdDef: 'TD 방어율',
    subAttPer15: '15분당 서브미션',
    kdPerFight: '경기당 다운',
  },
};
