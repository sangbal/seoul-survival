export type PromotionDef = {
  id: string;
  name: string;
  initialTier: 1 | 2 | 3 | 4 | 5 | 6;
  isPlayer?: boolean;
};

export const promotions: PromotionDef[] = [
  { id: 'prom_ai_01', name: 'Ultimate Combat (UC)', initialTier: 1 },
  { id: 'prom_ai_02', name: 'Global Fight League (GFL)', initialTier: 1 },
  
  { id: 'prom_ai_03', name: 'Bellatorion', initialTier: 2 },
  { id: 'prom_ai_04', name: 'One Warrior', initialTier: 2 },
  
  { id: 'prom_ai_05', name: 'Rizin Rising', initialTier: 3 },
  { id: 'prom_ai_06', name: 'PFL (Pro Fight)', initialTier: 3 },
  
  { id: 'prom_ai_07', name: 'Cage Warriors', initialTier: 4 },
  { id: 'prom_ai_08', name: 'KSW Poland', initialTier: 4 },
  
  { id: 'prom_ai_09', name: 'Road FC', initialTier: 5 },
  { id: 'prom_ai_10', name: 'Deep Impact', initialTier: 5 },
  
  { id: 'prom_player', name: 'My New Promotion', initialTier: 6, isPlayer: true },
  { id: 'prom_ai_11', name: 'Local FC', initialTier: 6 },
];
