/**
 * 통계 탭 렌더러
 * - main.js의 전역 변수들을 직접 참조하지 않도록, 필요한 값은 state로 전달
 */
import { t, getLang } from '../i18n/index.js';

/**
 * @param {{
 *  safeText:(el:Element|null, text:string)=>void,
 *  formatCashDisplay:(n:number)=>string,
 *  formatKoreanNumber:(n:number)=>string,
 *  getRps:()=>number,
 *  getClickIncome:()=>number,
 *  calculateTotalAssetValue:()=>number,
 *  calculateEfficiencies:()=>string[],
 *  updateAchievementGrid:()=>void,
 *  state:{
 *    cash:number,
 *    totalClicks:number,
 *    totalLaborIncome:number,
 *    totalPlayTime:number,
 *    sessionStartTime:number,
 *    // lifetimes
 *    depositsLifetime:number,
 *    savingsLifetime:number,
 *    bondsLifetime:number,
 *    usStocksLifetime:number,
 *    cryptosLifetime:number,
 *    villasLifetime:number,
 *    officetelsLifetime:number,
 *    apartmentsLifetime:number,
 *    shopsLifetime:number,
 *    buildingsLifetime:number,
 *    // owned
 *    deposits:number,
 *    savings:number,
 *    bonds:number,
 *    usStocks:number,
 *    cryptos:number,
 *    villas:number,
 *    officetels:number,
 *    apartments:number,
 *    shops:number,
 *    buildings:number,
 *  },
 *  now?:()=>number,
 * }} deps
 */
export function updateStatsTab(deps) {
  const {
    safeText,
    formatCashDisplay,
    formatKoreanNumber,
    getRps,
    getClickIncome,
    calculateTotalAssetValue,
    calculateEfficiencies,
    updateAchievementGrid,
    state,
    now = () => Date.now(),
  } = deps;

  try {
    // 1. 핵심 지표
    const totalAssets = state.cash + calculateTotalAssetValue();
    const totalEarnings =
      state.depositsLifetime +
      state.savingsLifetime +
      state.bondsLifetime +
      state.usStocksLifetime +
      state.cryptosLifetime +
      state.villasLifetime +
      state.officetelsLifetime +
      state.apartmentsLifetime +
      state.shopsLifetime +
      state.buildingsLifetime +
      state.totalLaborIncome;

    safeText(document.getElementById('totalAssets'), formatCashDisplay(totalAssets));
    safeText(document.getElementById('totalEarnings'), formatCashDisplay(totalEarnings));
    // 통계 탭: 축약 표기(짧은 숫자)에서 소수점 자릿수 고정된 formatCashDisplay 사용
    const perSecUnit = t('stats.unit.perSec');
    safeText(document.getElementById('rpsStats'), formatCashDisplay(getRps()) + perSecUnit);
    safeText(document.getElementById('clickIncomeStats'), formatCashDisplay(getClickIncome()));

    // 2. 플레이 정보
    const timesUnit = t('stats.unit.times');
    const locale = getLang() === 'en' ? 'en-US' : 'ko-KR';
    safeText(document.getElementById('totalClicksStats'), state.totalClicks.toLocaleString(locale) + timesUnit);
    safeText(document.getElementById('laborIncomeStats'), formatCashDisplay(state.totalLaborIncome));

    // 플레이 시간(누적)
    const currentSessionTime = now() - state.sessionStartTime;
    const totalPlayTimeMs = state.totalPlayTime + currentSessionTime;
    const playTimeMinutes = Math.floor(totalPlayTimeMs / 60000);
    const playTimeHours = Math.floor(playTimeMinutes / 60);
    const remainingMinutes = playTimeMinutes % 60;
    const hourUnit = t('stats.unit.hour');
    const minuteUnit = t('stats.unit.minute');
    const playTimeText = playTimeHours > 0 
      ? `${playTimeHours} ${hourUnit} ${remainingMinutes} ${minuteUnit}` 
      : `${playTimeMinutes} ${minuteUnit}`;

    safeText(document.getElementById('playTimeStats'), playTimeText);

    // 시간당 수익
    const hourlyRateValue = playTimeMinutes > 0 ? (totalEarnings / playTimeMinutes) * 60 : 0;
    const perHourUnit = t('stats.unit.perHour');
    safeText(document.getElementById('hourlyRate'), formatCashDisplay(hourlyRateValue) + perHourUnit);

    // 3. 수익 구조
    const laborPercent = totalEarnings > 0 ? (state.totalLaborIncome / totalEarnings) * 100 : 0;
    const financialTotal =
      state.depositsLifetime +
      state.savingsLifetime +
      state.bondsLifetime +
      state.usStocksLifetime +
      state.cryptosLifetime;
    const financialPercent = totalEarnings > 0 ? (financialTotal / totalEarnings) * 100 : 0;
    const propertyTotal =
      state.villasLifetime +
      state.officetelsLifetime +
      state.apartmentsLifetime +
      state.shopsLifetime +
      state.buildingsLifetime;
    const propertyPercent = totalEarnings > 0 ? (propertyTotal / totalEarnings) * 100 : 0;

    // 수익 구조 바
    const laborSegment = document.getElementById('laborSegment');
    const financialSegment = document.getElementById('financialSegment');
    const propertySegment = document.getElementById('propertySegment');

    if (laborSegment) {
      laborSegment.style.width = laborPercent.toFixed(1) + '%';
      const span = laborSegment.querySelector('span');
      if (span) span.textContent = laborPercent >= 5 ? `🛠️ ${laborPercent.toFixed(1)}%` : '';
    }

    if (financialSegment) {
      financialSegment.style.width = financialPercent.toFixed(1) + '%';
      const span = financialSegment.querySelector('span');
      if (span) span.textContent = financialPercent >= 5 ? `💰 ${financialPercent.toFixed(1)}%` : '';
    }

    if (propertySegment) {
      propertySegment.style.width = propertyPercent.toFixed(1) + '%';
      const span = propertySegment.querySelector('span');
      if (span) span.textContent = propertyPercent >= 5 ? `🏢 ${propertyPercent.toFixed(1)}%` : '';
    }

    // 범례
    safeText(document.getElementById('laborLegend'), `${t('stats.labor')}: ${laborPercent.toFixed(1)}%`);
    safeText(document.getElementById('financialLegend'), `${t('stats.financial')}: ${financialPercent.toFixed(1)}%`);
    safeText(document.getElementById('propertyLegend'), `${t('stats.property')}: ${propertyPercent.toFixed(1)}%`);

    // 4. 금융상품 상세
    const countUnit = t('ui.unit.count');
    const lifetimeEarningsLabel = t('stats.lifetimeEarnings');
    const totalValueLabel = t('stats.totalValue');
    
    safeText(document.getElementById('depositsOwnedStats'), state.deposits + countUnit);
    safeText(document.getElementById('depositsLifetimeStats'), formatCashDisplay(state.depositsLifetime));

    safeText(document.getElementById('savingsOwnedStats'), state.savings + countUnit);
    safeText(document.getElementById('savingsLifetimeStats'), formatCashDisplay(state.savingsLifetime));

    safeText(document.getElementById('bondsOwnedStats'), state.bonds + countUnit);
    safeText(document.getElementById('bondsLifetimeStats'), formatCashDisplay(state.bondsLifetime));

    safeText(document.getElementById('usStocksOwnedStats'), state.usStocks + countUnit);
    safeText(document.getElementById('usStocksLifetimeStats'), formatCashDisplay(state.usStocksLifetime));

    safeText(document.getElementById('cryptosOwnedStats'), state.cryptos + countUnit);
    safeText(document.getElementById('cryptosLifetimeStats'), formatCashDisplay(state.cryptosLifetime));

    // 5. 부동산 상세
    const propertyUnit = t('ui.unit.property');
    
    safeText(document.getElementById('villasOwnedStats'), state.villas + propertyUnit);
    safeText(document.getElementById('villasLifetimeStats'), formatCashDisplay(state.villasLifetime));

    safeText(document.getElementById('officetelsOwnedStats'), state.officetels + propertyUnit);
    safeText(document.getElementById('officetelsLifetimeStats'), formatCashDisplay(state.officetelsLifetime));

    safeText(document.getElementById('apartmentsOwnedStats'), state.apartments + propertyUnit);
    safeText(document.getElementById('apartmentsLifetimeStats'), formatCashDisplay(state.apartmentsLifetime));

    safeText(document.getElementById('shopsOwnedStats'), state.shops + propertyUnit);
    safeText(document.getElementById('shopsLifetimeStats'), formatCashDisplay(state.shopsLifetime));

    safeText(document.getElementById('buildingsOwnedStats'), state.buildings + propertyUnit);
    safeText(document.getElementById('buildingsLifetimeStats'), formatCashDisplay(state.buildingsLifetime));

    // 6. 효율 분석
    const efficiencies = calculateEfficiencies();
    safeText(document.getElementById('bestEfficiency'), efficiencies[0] || '-');
    safeText(document.getElementById('secondEfficiency'), efficiencies[1] || '-');
    safeText(document.getElementById('thirdEfficiency'), efficiencies[2] || '-');

    // 7. 업적 그리드
    updateAchievementGrid();
  } catch (e) {
    console.error('Stats tab update failed:', e);
  }
}








