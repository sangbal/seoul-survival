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
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function generateNickname(fighterId: string): string {
  const adj = ["Iron","Silent","Crimson","Savage","Cold","Rapid","Midnight","Thunder","Ruthless","Phantom","Granite","Wild"];
  const noun = ["Viper","Wolf","Hammer","Cyclone","Reaper","Titan","Jaguar","Anvil","Raven","Cobra","Blizzard","Warden"];
  const h = hashStringToInt(fighterId);
  const a = adj[h % adj.length];
  const n = noun[(Math.floor(h / 97)) % noun.length];
  // MMA-ish format:
  return `The ${a} ${n}`;
}
