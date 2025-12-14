// 업적 시스템

/**
 * @param {Array<{unlocked:boolean, condition:Function, name:string, desc:string}>} achievements
 * @param {{notify:(achievement:any)=>void, addLog:(msg:string)=>void}} deps
 */
export function createAchievementsSystem(achievements, deps) {
  const { notify, addLog } = deps;

  function checkAchievements() {
    achievements.forEach((achievement) => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true;
        notify(achievement);
        addLog(`🏆 업적 달성: ${achievement.name} - ${achievement.desc}`);
      }
    });
  }

  return { checkAchievements };
}

