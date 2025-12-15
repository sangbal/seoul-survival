// 가격/판매 계산 로직
// - 수량 구매/판매 시 누적합을 정확히 계산
// - 판매 가격은 "현재가의 80%" 정책 적용

export const FINANCIAL_COSTS = {
  deposit: 50_000,
  savings: 500_000,
  bond: 5_000_000,
  usStock: 25_000_000,
  crypto: 100_000_000,
};

export const PROPERTY_COSTS = {
  villa: 250_000_000,
  officetel: 350_000_000,
  apartment: 800_000_000,
  shop: 1_200_000_000,
  building: 3_000_000_000,
};

const DEFAULT_GROWTH = 1.10; // 밸런싱: 1.15 → 1.10으로 완화
const SELL_RATE = 0.8;

function sumGeometricCost(baseCost, startIndex, quantity, growth = DEFAULT_GROWTH) {
  let total = 0;
  for (let i = 0; i < quantity; i++) {
    const idx = startIndex + i;
    total += baseCost * Math.pow(growth, idx);
  }
  return Math.floor(total);
}

export function getFinancialCost(type, count, quantity = 1) {
  const baseCost = FINANCIAL_COSTS[type];
  if (!baseCost || quantity <= 0) return 0;
  return sumGeometricCost(baseCost, count, quantity);
}

export function getPropertyCost(type, count, quantity = 1) {
  const baseCost = PROPERTY_COSTS[type];
  if (!baseCost || quantity <= 0) return 0;
  return sumGeometricCost(baseCost, count, quantity);
}

export function getFinancialSellPrice(type, count, quantity = 1) {
  if (count <= 0 || quantity <= 0) return 0;

  let total = 0;
  for (let i = 0; i < quantity; i++) {
    if (count - i <= 0) break;
    const buyPrice = getFinancialCost(type, count - i - 1, 1);
    total += Math.floor(buyPrice * SELL_RATE);
  }
  return total;
}

export function getPropertySellPrice(type, count, quantity = 1) {
  if (count <= 0 || quantity <= 0) return 0;

  let total = 0;
  for (let i = 0; i < quantity; i++) {
    if (count - i <= 0) break;
    const buyPrice = getPropertyCost(type, count - i - 1, 1);
    total += Math.floor(buyPrice * SELL_RATE);
  }
  return total;
}

// (레거시) 단계별 가격 증가율 시스템: 현재 main.js에서는 사용하지 않지만
// 추후 난이도 곡선 변경 시 활용할 수 있도록 남겨둠.
export function getPriceMultiplierByTier(count) {
  if (count < 5) return 1.10;
  if (count < 15) return 1.15;
  if (count < 30) return 1.20;
  return 1.25;
}







