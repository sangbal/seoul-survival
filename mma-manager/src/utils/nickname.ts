import { hashStringToInt } from '../utils';

export const EN_NICKS = [
  // Animals
  "Viper", "Wolf", "Tiger", "Shark", "Bear", "Lion", "Eagle", "Hawk", "Falcon", "Raven", "Cobra", "Python", 
  "Jaguar", "Panther", "Leopard", "Rhino", "Bull", "Bison", "Gorilla", "Ape", "Monkey", "Spider", "Scorpion", 
  "Wasp", "Hornet", "Mantis", "Beetle", "Ant", "Locust", "Cricket", "Dragon", "Wyvern", "Hydra", "Griffin", 
  "Phoenix", "Unicorn", "Pegasus", "Kraken", "Leviathan", "Behemoth", "Mammoth", "Titan", "Giant", "Cyclops",
  "Ogre", "Troll", "Goblin", "Orc", "Elf", "Dwarf", "Gnome", "Fairy", "Pixie", "Sprite", "Imp", "Demon", "Devil",
  "Angel", "God", "Titan", "Zeus", "Thor", "Odin", "Hades", "Ares", "Mars", "Apollo", "Hermes", "Loki", "Anubis",
  "Ra", "Horus", "Osiris", "Seth", "Thoth", "Isis", "Bastet", "Sekhmet", "Hathor", "Maat", "Amun", "Ptah", "Khonsu",
  "Sobek", "Serqet", "Neith", "Geb", "Nut", "Shu", "Tefnut",
  // Weapons / War
  "Blade", "Sword", "Axe", "Hammer", "Mace", "Spear", "Lance", "Bow", "Arrow", "Dagger", "Knife", "Shield", "Armor",
  "Tank", "Cannon", "Gun", "Rifle", "Pistol", "Bullet", "Bomb", "Nuke", "Missile", "Rocket", "Laser", "Phaser", "Plasma",
  "Sniper", "Slayer", "Killer", "Hunter", "Warrior", "Soldier", "Knight", "Paladin", "Samurai", "Ninja", "Viking",
  "Spartan", "Gladiator", "Centurion", "Legion", "Squad", "Platoon", "Company", "Battalion", "Regiment", "Division",
  "Corps", "Army", "Navy", "AirForce", "Marine", "Ranger", "Seal", "Delta", "Recon", "Scout", "Spy", "Agent",
  // Nature / Elements
  "Fire", "Ice", "Wind", "Earth", "Thunder", "Lightning", "Storm", "Rain", "Snow", "Hail", "Mist", "Fog", "Smoke",
  "Ash", "Dust", "Sand", "Mud", "Rock", "Stone", "Iron", "Steel", "Metal", "Gold", "Silver", "Bronze", "Copper",
  "Diamond", "Ruby", "Emerald", "Sapphire", "Topaz", "Opal", "Jade", "Pearl", "Coral", "Amber", "Onyx", "Obsidian",
  "Quartz", "Crystal", "Glass", "Mirror", "Shadow", "Dark", "Light", "Sun", "Moon", "Star", "Comet", "Meteor",
  "Asteroid", "Planet", "Galaxy", "Universe", "Cosmos", "Void", "Abyss", "BlackHole", "Nebula", "Supernova", "Quasar",
  // Abstract / Concepts
  "Death", "Life", "Fate", "Destiny", "Doom", "Hope", "Fear", "Pain", "Hate", "Love", "Rage", "Fury", "Wrath", "Greed",
  "Envy", "Lust", "Pride", "Sloth", "Gluttony", "Sin", "Virtue", "Honor", "Glory", "Victory", "Defeat", "War", "Peace",
  "Chaos", "Order", "Law", "Justice", "Truth", "Lie", "Secret", "Mystery", "Magic", "Power", "Energy", "Force", "Spirit",
  "Soul", "Ghost", "Phantom", "Specter", "Wraith", "Reaper", "Banshee", "Lich", "Zombie", "Vampire", "Werewolf", "Mutant",
  "Cyborg", "Robot", "Android", "Drone", "Clone", "Alien", "Martian", "Venom", "Toxin", "Poison", "Acid", "Virus",
  // Action
  "Smash", "Crash", "Bhang", "Boom", "Zap", "Pow", "Hit", "Strike", "Punch", "Kick", "Chop", "Cut", "Slice", "Dice",
  "Crush", "Break", "Snap", "Crack", "Pop", "Bang", "Slam", "Dunk", "Throw", "Toss", "Hurl", "Fling", "Cast", "Shoot",
  "Blast", "Blow", "Explode", "Erupt", "Burst", "Shatter", "Splinter", "Fragment", "Shred", "Rip", "Tear", "Rend", "Split",
  // Misc
  "Ace", "King", "Queen", "Jack", "Joker", "Spade", "Heart", "Diamond", "Club", "Dice", "Chip", "Card", "Token", "Coin",
  "Cash", "Money", "Gold", "Rich", "Poor", "Broke", "Debt", "Loan", "Credit", "Debit", "Bank", "Vault", "Safe", "Lock",
  "Key", "Door", "Gate", "Wall", "Fence", "Roof", "Floor", "Room", "Hall", "House", "Home", "Castle", "Fort", "Base",
  "Camp", "Tent", "Hut", "Shack", "Shed", "Barn", "Farm", "Field", "Park", "City", "Town", "Village", "Road", "Street"
];

export const KO_NICKS = [
  "독사", "늑대", "호랑이", "사자", "독수리", "매", "까마귀", "곰", "황소", "코뿔소",
  "거미", "전갈", "말벌", "사마귀", "용", "해태", "이무기", "불사조", "도깨비", "귀신",
  "저승사자", "망치", "도끼", "칼날", "창", "방패", "갑옷", "철권", "주먹", "발차기",
  "번개", "천둥", "태풍", "폭풍", "해일", "지진", "화산", "불꽃", "얼음", "눈보라",
  "암석", "바위", "강철", "무쇠", "황금", "다이아", "그림자", "어둠", "빛", "태양",
  "달", "별", "유성", "혜성", "우주", "비수", "단검", "송곳", "가시", "독침",
  "살수", "검객", "무사", "장군", "제왕", "폭군", "영웅", "전설", "신화", "괴물",
  "야수", "악마", "천사", "신", "왕", "황제", "대마왕", "마왕", "용사", "광전사",
  "투사", "싸움꾼", "해적", "도적", "닌자", "사무라이", "기사", "마법사", "현자", "도사",
  "신선", "산신령", "산적", "건달", "깡패", "두목", "대장", "보스", "리더", "캡틴",
  "일진", "짱", "최고", "일등", "챔피언", "승리", "영광", "운명", "파멸", "공포",
  "고통", "분노", "증오", "사랑", "희망", "용기", "정의", "진실", "비밀", "마법",
  "기적", "축복", "저주", "재앙", "파괴", "혼돈", "질서", "법", "심판", "집행",
  "살인", "죽음", "삶", "인생", "운", "도박", "승부", "결투", "전쟁", "평화",
  "자유", "속박", "구원", "타락", "배신", "복수", "용서", "화해", "우정", "의리"
];

/**
 * Deterministically picks a unique nickname pair (KO/EN).
 * Ensures no duplicates within the provided 'used' set for EITHER language.
 */
export function pickUniqueNickname(fighterId: string, country: string, used: Set<string>): { ko: string; en: string } {
  // Deterministic starting index
  let idx = hashStringToInt(fighterId);
  
  // Linear probing to find an unused PAIR
  // We try up to regular pool size. If failed, we suffix.
  const limit = Math.max(EN_NICKS.length, KO_NICKS.length) * 2;
  
  for (let i = 0; i < limit; i++) {
    const en = EN_NICKS[(idx + i) % EN_NICKS.length];
    const ko = KO_NICKS[(idx + i) % KO_NICKS.length];
    
    // Check if EITHER is used
    if (!used.has(en) && !used.has(ko)) {
      used.add(en);
      used.add(ko);
      return { ko, en };
    }
  }
  
  // Fallback: Suffixing
  // We use the base index (i=0) and append numbers
  const baseEn = EN_NICKS[idx % EN_NICKS.length];
  const baseKo = KO_NICKS[idx % KO_NICKS.length];
  
  let k = 2;
  while (true) {
    const en = `${baseEn}-${k}`;
    const ko = `${baseKo}-${k}`;
    
    if (!used.has(en) && !used.has(ko)) {
      used.add(en);
      used.add(ko);
      return { ko, en };
    }
    k++;
  }
}
