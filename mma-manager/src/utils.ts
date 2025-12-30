export function uuidv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function hashStringToInt(input: string): number {
  // FNV-1a 32-bit
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Nickname: single-word, deterministic by fighterId.
// If country === 'KOR', allow Korean single-word nicknames too.
export function generateNickname(fighterId: string, country?: string): string {
  const en = [
    "Viper","Wolf","Hammer","Cyclone","Reaper","Titan","Jaguar","Anvil","Raven","Cobra",
    "Blizzard","Warden","Phantom","Inferno","Tempest","Mantis","Banshee","Goliath","Vandal","Razor",
    "Vortex","Kraken","Badger","Falcon","Panther","Saber","Raptor","Sentinel","Brawler","Nomad",
  ];

  const ko = [
    "독사","늑대","망치","태풍","사신","거인","재규어","모루","까마귀","코브라",
    "번개","폭풍","유령","칼날","철권","맹수","불꽃","설표","불도저","스파르타",
  ];

  const h = hashStringToInt(fighterId);

  // For Korean fighters, deterministically choose from KR list ~50% of the time.
  if (country === "KOR") {
    const useKo = (h % 2) === 0;
    const list = useKo ? ko : en;
    return list[h % list.length];
  }

  return en[h % en.length];
}
