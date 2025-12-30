export type GymDef = {
  id: string;
  name: string;
  country: 'USA' | 'BRA' | 'RUS' | 'JPN' | 'KOR';
  tier: 'MAJOR' | 'MINOR';
  traits: string[];
};

export const gyms: GymDef[] = [
  { id: 'gym_usa_major', name: 'American Peak Team', country: 'USA', tier: 'MAJOR', traits: ['ALL_ROUND', 'COUNTER_RANGE'] },
  { id: 'gym_bra_major', name: 'Chute Boxe Atelier', country: 'BRA', tier: 'MAJOR', traits: ['PRESSURE_BRAWL', 'ALL_ROUND'] },
  { id: 'gym_rus_major', name: 'Akhmat Fight Camp', country: 'RUS', tier: 'MAJOR', traits: ['WRESTLE_CTRL', 'ALL_ROUND'] },
  { id: 'gym_jpn_major', name: 'Krazy Bii Tokyo', country: 'JPN', tier: 'MAJOR', traits: ['COUNTER_RANGE', 'KICK_LEG'] },
  { id: 'gym_kor_major', name: 'GoldenCombat', country: 'KOR', tier: 'MAJOR', traits: ['KICK_LEG', 'PRESSURE_BRAWL'] },
  
  { id: 'gym_usa_minor', name: 'Jaxson Wink Lab', country: 'USA', tier: 'MINOR', traits: ['COUNTER_RANGE', 'ALL_ROUND'] },
  { id: 'gym_bra_minor', name: 'Brazilian RKO', country: 'BRA', tier: 'MINOR', traits: ['BJJ_SUB', 'WRESTLE_CTRL'] },
  { id: 'gym_rus_minor', name: 'Red Devil Combat Club', country: 'RUS', tier: 'MINOR', traits: ['WRESTLE_CTRL', 'PRESSURE_BRAWL'] },
  { id: 'gym_jpn_minor', name: 'Palaestra Tokyo', country: 'JPN', tier: 'MINOR', traits: ['BJJ_SUB', 'COUNTER_RANGE'] },
  { id: 'gym_kor_minor', name: 'WatchaClub', country: 'KOR', tier: 'MINOR', traits: ['PRESSURE_BRAWL', 'KICK_LEG'] },
];
