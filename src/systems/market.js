// 시장 이벤트 시스템(스케줄/시작/종료/배수)

/**
 * @param {Array<any>} marketEvents
 * @param {{
 *   getCurrentEvent:()=>any,
 *   setCurrentEvent:(ev:any)=>void,
 *   getEventEndTime:()=>number,
 *   setEventEndTime:(t:number)=>void,
 *   setMarketMultiplier:(m:number)=>void,
 *   addLog:(msg:string)=>void,
 *   notify:(ev:any)=>void,
 *   markDirty?:()=>void,
 *   now?:()=>number,
 * }} deps
 */
export function createMarketSystem(marketEvents, deps) {
  const {
    getCurrentEvent,
    setCurrentEvent,
    getEventEndTime,
    setEventEndTime,
    setMarketMultiplier,
    addLog,
    notify,
    markDirty,
    now = () => Date.now(),
  } = deps;

  function getMarketEventMultiplier(type, category) {
    const ev = getCurrentEvent();
    if (!ev || !ev.effects) return 1.0;
    const effects = ev.effects[category];
    if (!effects || !effects[type]) return 1.0;
    return effects[type];
  }

  function checkMarketEvent() {
    const end = getEventEndTime();
    if (end > 0 && now() >= end) {
      setCurrentEvent(null);
      setEventEndTime(0);
      setMarketMultiplier(1);
      addLog('📉 시장 이벤트가 종료되었습니다.');
      if (markDirty) markDirty();
    }
  }

  function startMarketEvent() {
    if (!marketEvents || marketEvents.length === 0) return;

    const ev = marketEvents[Math.floor(Math.random() * marketEvents.length)];
    setCurrentEvent(ev);

    // 이벤트 기본 지속시간(현재 코드 관례 유지): 30초
    const durationMs = (ev.durationMs ?? ev.duration ?? 30_000);
    setEventEndTime(now() + durationMs);

    // 전역 배수는 1로 두고(개별 배수는 getMarketEventMultiplier로 적용)
    setMarketMultiplier(1);

    notify(ev);
    addLog(`📈 시장 이벤트 발생: ${ev.name} (${Math.floor(durationMs / 1000)}초)`);
    if (markDirty) markDirty();
  }

  function scheduleNextMarketEvent() {
    const delay = Math.random() * 180_000 + 120_000; // 2~5분
    setTimeout(() => {
      if (getEventEndTime() === 0) {
        startMarketEvent();
      }
      scheduleNextMarketEvent();
    }, delay);
  }

  return {
    getMarketEventMultiplier,
    checkMarketEvent,
    startMarketEvent,
    scheduleNextMarketEvent,
  };
}






