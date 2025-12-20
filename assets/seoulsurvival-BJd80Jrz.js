import{i as Sa,g as Wt,a as je,o as sr,b as os,s as $a}from"./authBoot-BnOC8kKe.js";import"https://esm.sh/@supabase/supabase-js@2.49.1";function ar(k,v){try{return localStorage.setItem(k,JSON.stringify(v)),!0}catch{return!1}}function ir(k,v=null){try{const m=localStorage.getItem(k);return m?JSON.parse(m):v}catch{return v}}const rr={"tab.labor":"노동","tab.investment":"투자","tab.stats":"통계","tab.ranking":"랭킹","tab.settings":"설정","career.alba":"알바","career.contract":"계약직","career.employee":"사원","career.assistant":"대리","career.manager":"과장","career.deputy":"차장","career.director":"부장","career.executive":"상무","career.senior":"전무","career.ceo":"CEO","product.deposit":"예금","product.savings":"적금","product.bond":"국내주식","product.usStock":"미국주식","product.crypto":"코인","property.villa":"빌라","property.officetel":"오피스텔","property.apartment":"아파트","property.shop":"상가","property.building":"빌딩","property.tower":"서울타워","button.buy":"구입","button.sell":"판매","button.confirm":"확인","button.cancel":"취소","button.yes":"예","button.no":"아니오","button.load":"불러오기","msg.insufficientFunds":"💸 자금이 부족합니다. (필요: {amount}원)","msg.purchased":"✅ {product} {qty}{unit}를 구입했습니다. (보유 {count}{unit})","msg.sold":"💰 {product} {qty}{unit}를 판매했습니다. (+{amount}원, 보유 {count}{unit})","msg.insufficientQuantity":"❌ 판매할 수량이 부족합니다. (보유: {count})","msg.promoted":"🎉 {career}으로 승진했습니다! (클릭당 {income}원)","msg.achievementUnlocked":"🏆 업적 달성: {name} - {desc}","msg.upgradeUnlocked":"🎁 새 업그레이드 해금: {name}","msg.upgradeAlreadyPurchased":"❌ 이미 구매한 업그레이드입니다.","msg.upgradeInsufficientFunds":"💸 자금이 부족합니다. (필요: {cost})","msg.upgradePurchased":"✅ {name} 구매! {desc}","msg.upgradeError":"⚠️ {name} 구매했지만 효과 적용 중 오류 발생","msg.eventStarted":"📈 {name} 발생! {duration}초간 지속","msg.eventDescription":"💡 {description}","msg.eventEnded":"📉 시장 이벤트가 종료되었습니다.","msg.nicknameSet":'닉네임이 "{nickname}"으로 설정되었습니다.',"msg.gameReset":"🔄 게임을 초기화합니다...","msg.saveExported":"✅ 저장 파일이 다운로드되었습니다.","msg.saveImported":"✅ 저장 파일을 불러왔습니다. 페이지를 새로고침합니다...","msg.bonusPaid":"💰 성과급 지급! 10배 수익!","msg.nextUpgradeHint":'🎯 다음 업그레이드 "{name}"까지 {remaining}클릭 남음!',"msg.gameLoaded":"저장된 게임을 불러왔습니다.","msg.welcome":"환영합니다! 노동으로 종잣돈을 모아 첫 부동산을 구입해보세요.","msg.manualSave":"💾 수동 저장 완료!","msg.cloudSaved":"☁️ 클라우드에 저장했습니다.","msg.cloudApplied":"☁️ 클라우드 세이브를 적용했습니다. 페이지를 새로고침합니다...","modal.error.nicknameLength.title":"닉네임 길이 오류","modal.error.nicknameLength.message":"닉네임은 1~5자여야 합니다.","modal.error.nicknameFormat.title":"닉네임 형식 오류","modal.error.nicknameFormat.message":"닉네임에는 공백을 포함할 수 없습니다.","modal.error.nicknameFormatInvalid.title":"닉네임 형식 오류","modal.error.nicknameFormatInvalid.message":"닉네임에는 %, _ 문자를 사용할 수 없습니다.","modal.error.nicknameTaken.title":"닉네임 중복","modal.error.nicknameTaken.message":`이미 사용 중인 닉네임입니다.
다른 닉네임을 입력해주세요.`,"modal.error.resetError.title":"오류","modal.error.resetError.message":`게임 초기화 중 오류가 발생했습니다.
페이지를 새로고침해주세요.`,"modal.confirm.reset.title":"게임 새로 시작","modal.confirm.reset.message":`게임을 새로 시작하면 모든 진행 상황이 삭제되며 복구할 수 없습니다.
정말로 새로 시작하시겠습니까?`,"modal.confirm.reset.primaryLabel":"새로 시작","modal.nickname.title":"닉네임 설정","modal.nickname.message":`리더보드에 표시될 닉네임을 입력하세요.
(1~5자, 공백/%, _ 불가)`,"modal.nickname.placeholder":"1~5자 닉네임","modal.info.cloudSaveComplete.title":"완료","modal.info.cloudSaveComplete.message":"클라우드 저장 완료!","modal.error.loginRequired.title":"로그인 필요","modal.error.loginRequired.message":"클라우드 세이브는 로그인 사용자만 사용할 수 있습니다.","modal.error.noSaveData.title":"저장 데이터 없음","modal.error.noSaveData.message":"로컬 저장 데이터가 없습니다. 먼저 게임을 진행한 뒤 저장해 주세요.","modal.error.invalidSaveData.title":"오류","modal.error.invalidSaveData.message":"로컬 저장 데이터 형식이 올바르지 않습니다.","modal.error.uploadFailed.title":"업로드 실패","modal.error.uploadFailed.message":`클라우드 저장에 실패했습니다.
{error}`,"modal.error.downloadFailed.title":"불러오기 실패","modal.error.downloadFailed.message":`클라우드 불러오기에 실패했습니다.
{error}`,"modal.error.noCloudSave.title":"클라우드 저장 없음","modal.error.noCloudSave.message":"이 계정에 저장된 클라우드 세이브가 없습니다.","modal.error.cloudApplyFailed.title":"오류","modal.error.cloudApplyFailed.message":`클라우드 세이브 적용에 실패했습니다.
{error}`,"modal.confirm.cloudRestore.title":"클라우드 세이브 복구","modal.confirm.cloudRestore.message":`클라우드 세이브가 있습니다.

저장 시간: {time}

불러오시겠습니까?`,"modal.confirm.cloudSaveFound.title":"클라우드 세이브 발견","modal.confirm.cloudSaveFound.message":"{message}","modal.error.progressSwitchFailed.title":"오류","modal.error.progressSwitchFailed.message":`진행 상황 전환에 실패했습니다.
{error}`,"achievement.status.unlocked":"✅ 달성!","achievement.status.locked":"🔒 미달성","settings.language.title":"🌐 언어","settings.gameInfo.title":"📋 게임 정보","settings.visualEffects.title":"🎨 시각 효과","settings.numberDisplay.title":"🔢 숫자 표시","settings.account.title":"👤 계정 (소셜 로그인)","settings.saveManagement.title":"💾 저장 관리","settings.reset.title":"🔄 게임 새로 시작","header.cash":"💵 현금","header.financial":"💰 금융","header.properties":"🏢 부동산","header.rps":"📈 초당","header.favorite_btn":"즐겨찾기","header.share_btn":"공유","work.title":"🛠️ 노동","work.button":"🛠️ 노동","ui.work":"🛠️ 노동","ui.diary":"📓 일기장","ui.upgrades":"업그레이드","ui.financial":"금융상품","ui.properties":"부동산","ui.buy":"구매","ui.sell":"판매","ui.quantity":"수량","ui.currentPrice":"현재가","ui.owned":"보유","ui.production":"생산","ui.totalIncome":"총 수익","ui.percent":"비율","ui.lifetime":"누적","ui.prestige":"프레스티지 상품 (수익 없음)","ui.leaderboard":"리더보드에 기록됨","ui.nextPromotion":"다음 승진까지 {remaining}클릭 남음","ui.progress":"진행률","ui.stats":"📊 통계","ui.ranking":"🏅 랭킹","ui.settings":"⚙️ 설정","ui.marketEvent":"시장 이벤트","ui.second":"초","ui.currency":"원","ui.currencyShort":"원","ui.noTimeInfo":"시간 정보 없음","header.tooltip.financialIncome":"금융 수익: {amount}","header.tooltip.propertyIncome":"부동산 수익: {amount}","header.tooltip.marketMultiplier":"시장배수: x{multiplier}","ui.unit.count":"개","ui.unit.property":"채","product.desc.perUnit":"각 {product}이 초당 {amount} 생산","product.desc.total":"{count}{unit} {product}이 초당 {amount} 생산 (총 수익의 {percent}%)","product.desc.lifetime":"지금까지 {amount} 생산","product.desc.currentPrice":"현재가: {price}","ui.noUpgrades":"해금된 업그레이드가 없습니다","ui.day":"일차","ui.owned":"보유","tower.desc.prestige":"프레스티지 상품 (수익 없음)","tower.desc.owned":"{count}개 보유","tower.desc.leaderboard":"리더보드에 기록됨: 🗼x{count}","stats.totalAssets":"총 자산","stats.totalEarnings":"총 누적 수익","stats.rps":"초당 수익","stats.clickIncome":"클릭당 수익","stats.hourlyEarnings":"최근 1시간 수익","stats.dailyEarnings":"최근 24시간 수익","stats.growthRate":"성장 속도","stats.nextMilestone":"다음 마일스톤","stats.maxAchieved":"최고 달성","stats.remaining":"{amount} 남음","stats.laborIncome":"노동 수익","stats.playTime":"플레이 시간","stats.hourlyRate":"시간당 수익","stats.efficiencyRanking":"효율 순위 (개당 초당 수익)","stats.incomeStructure":"수익 구조","stats.assetRatio":"자산 비율","stats.financialProducts":"금융상품","stats.properties":"부동산","stats.owned":"보유","stats.lifetimeEarnings":"누적 수익","stats.totalValue":"총 가치","stats.labor":"노동","stats.financial":"금융","stats.property":"부동산","stats.cash":"현금","stats.growthTracking":"성장 추적","ranking.myRecord":"내 기록","ranking.globalLeaderboard":"글로벌 리더보드 (TOP 10)","ranking.loading":"리더보드를 불러오는 중...","ranking.lastUpdated":"마지막 갱신: {time}","ranking.refreshNote":"기록은 주기적으로 갱신됩니다.","ranking.nicknameRequired":"닉네임을 설정하면 내 순위와 기록이 여기 표시됩니다.","ranking.loginRequired":"로그인 후에 내 순위를 볼 수 있습니다.","ranking.achievements":"업적","ranking.table.rank":"#","ranking.table.nickname":"닉네임","ranking.table.assets":"자산","ranking.table.playtime":"시간","settings.gameTitle":"게임 제목","settings.version":"버전","settings.author":"제작자","settings.homepage":"홈페이지 이동","settings.particles":"파티클 켬","settings.particlesDesc":"떨어지는 지폐/상품 애니메이션","settings.fancyGraphics":"화려한 그래픽 켬","settings.fancyGraphicsDesc":"시각 효과 향상 (비활성화 시 성능 향상)","settings.shortNumbers":"짧은 숫자 켬","settings.shortNumbersDesc":"큰 숫자를 간단하게 표시 (예: 1,000만 → 1천만)","settings.status":"상태","settings.user":"사용자","settings.nickname":"닉네임","settings.guestMode":"게스트 모드 (로그인 준비 중)","settings.guest":"게스트","settings.loginGoogle":"Google로 로그인","settings.logout":"로그아웃","settings.resetWarning":"게임을 새로 시작하면 모든 진행 상황이 삭제되며 복구할 수 없습니다.","settings.saveManagement.cloudSaveDesc":"☁️ 클라우드 세이브: 로그인한 사용자는 클라우드에 저장하여 여러 기기에서 진행 상황을 동기화할 수 있습니다.","settings.saveManagement.cloudSaveBtn":"☁️ 클라우드 저장","settings.saveManagement.cloudLoadBtn":"☁️ 클라우드 불러오기","settings.saveManagement.cloudSaveHint":"로컬 저장은 5초마다 자동으로 이루어집니다. 클라우드 저장은 탭을 닫을 때 자동으로 업로드되며, 수동으로도 저장/불러오기가 가능합니다.","settings.saveManagement.lastCloudSync":"마지막 클라우드 동기화","settings.saveManagement.guestSaveInfo":"게스트 모드에서는 브라우저 LocalStorage에만 저장됩니다. 여러 기기에서 진행 상황을 동기화하려면 로그인이 필요합니다.","settings.saveManagement.autoSaveInterval":"자동 저장 주기","settings.saveManagement.saveLocation":"저장 위치","settings.saveManagement.lastSave":"마지막 저장","settings.saveManagement.autoSaveIntervalValue":"5초마다","settings.saveManagement.saveLocationValue":"브라우저 LocalStorage","settings.authStatus.loggedIn":"로그인됨","stats.totalEarningsTitle":"전체 수익","stats.totalAssets":"총 자산","stats.totalEarnings":"총 누적 수익","stats.rps":"초당 수익","stats.clickIncome":"클릭당 수익","stats.playInfo":"플레이 정보","stats.totalClicks":"총 클릭 횟수","stats.unit.sec":"초","stats.unit.times":"회","stats.unit.hour":"시간","stats.unit.minute":"분","stats.unit.perSec":"/초","stats.unit.perHour":"/시간","ui.dayCount":"{days}일차","ui.today":"오늘: {date}","ui.saved":"저장됨 · {time}","ui.confirm":"확인","ui.incomeFormat":"+{amount}원","ui.careerProgress":"승진 진행률","ranking.loadingText":"리더보드를 불러오는 중...","ranking.empty":"리더보드에 아직 기록이 없습니다.","ranking.error":"리더보드를 불러오는 중 오류가 발생했습니다: {error}","ranking.emptyMessage":"아직 리더보드에 기록이 없습니다.","ranking.emptyHint":"게임을 플레이하고 저장하면 순위가 표시됩니다.","diary.justWrite":"그냥 적어둔다.","diary.todayRecord":"오늘의 기록.","diary.anyway":"아무튼,","diary.justRecord":"일단 기록.","diary.memo":"메모해둔다.","diary.remember":"기억해둘 것.","diary.recordForLater":"나중을 위해 기록.","diary.goodToWrite":"적어두는 게 좋겠다.","diary.leaveRecord":"기록에 남긴다.","msg.unlock.savings":"❌ 적금은 예금을 1개 이상 보유해야 해금됩니다.","msg.unlock.bond":"❌ 국내주식은 적금을 1개 이상 보유해야 해금됩니다.","achievement.first_click.name":"첫 노동","achievement.first_click.desc":"첫 번째 클릭을 했다","achievement.first_deposit.name":"첫 예금","achievement.first_deposit.desc":"첫 번째 예금을 구입했다","achievement.first_savings.name":"첫 적금","achievement.first_savings.desc":"첫 번째 적금을 구입했다","achievement.first_bond.name":"첫 국내주식","achievement.first_bond.desc":"첫 번째 국내주식을 구입했다","achievement.first_us_stock.name":"첫 미국주식","achievement.first_us_stock.desc":"첫 번째 미국주식을 구입했다","achievement.first_crypto.name":"첫 코인","achievement.first_crypto.desc":"첫 번째 코인을 구입했다","achievement.first_property.name":"첫 부동산","achievement.first_property.desc":"첫 번째 부동산을 구입했다","achievement.first_upgrade.name":"첫 업그레이드","achievement.first_upgrade.desc":"첫 번째 업그레이드를 구입했다","achievement.financial_expert.name":"금융 전문가","achievement.financial_expert.desc":"모든 금융상품을 보유했다","achievement.property_collector.name":"부동산 수집가","achievement.property_collector.desc":"5채의 부동산을 보유했다","achievement.property_tycoon.name":"부동산 타이쿤","achievement.property_tycoon.desc":"모든 부동산 종류를 보유했다","achievement.investment_guru.name":"투자 고수","achievement.investment_guru.desc":"모든 업그레이드를 구입했다","achievement.gangnam_rich.name":"강남 부자","achievement.gangnam_rich.desc":"강남 부동산 3채를 보유했다","achievement.global_investor.name":"글로벌 투자자","achievement.global_investor.desc":"해외 투자 1억원을 달성했다","achievement.crypto_expert.name":"암호화폐 전문가","achievement.crypto_expert.desc":"코인 투자 5억원을 달성했다","achievement.real_estate_agent.name":"부동산 중개사","achievement.real_estate_agent.desc":"부동산 20채를 보유했다","achievement.millionaire.name":"백만장자","achievement.millionaire.desc":"총 자산 1억원을 달성했다","achievement.ten_millionaire.name":"억만장자","achievement.ten_millionaire.desc":"총 자산 10억원을 달성했다","achievement.hundred_millionaire.name":"부자","achievement.hundred_millionaire.desc":"총 자산 100억원을 달성했다","achievement.billionaire.name":"대부호","achievement.billionaire.desc":"총 자산 1,000억원을 달성했다","achievement.trillionaire.name":"재벌","achievement.trillionaire.desc":"총 자산 1조원을 달성했다","achievement.global_rich.name":"세계적 부자","achievement.global_rich.desc":"총 자산 10조원을 달성했다","achievement.legendary_rich.name":"전설의 부자","achievement.legendary_rich.desc":"총 자산 100조원을 달성했다","achievement.god_rich.name":"신의 부자","achievement.god_rich.desc":"총 자산 1,000조원을 달성했다","achievement.career_starter.name":"직장인","achievement.career_starter.desc":"계약직으로 승진했다","achievement.employee.name":"정규직","achievement.employee.desc":"사원으로 승진했다","achievement.deputy_director.name":"팀장","achievement.deputy_director.desc":"과장으로 승진했다","achievement.executive.name":"임원","achievement.executive.desc":"상무로 승진했다","achievement.ceo.name":"CEO","achievement.ceo.desc":"CEO가 되었다","achievement.chaebol_chairman.name":"재벌 회장","achievement.chaebol_chairman.desc":"자산 1조원을 달성했다","achievement.global_ceo.name":"글로벌 CEO","achievement.global_ceo.desc":"해외 진출을 달성했다","achievement.legendary_ceo.name":"전설의 CEO","achievement.legendary_ceo.desc":"모든 목표를 달성했다"},cr={"tab.labor":"Labor","tab.investment":"Investment","tab.stats":"Stats","tab.ranking":"Ranking","tab.settings":"Settings","career.alba":"Part-time","career.contract":"Contract","career.employee":"Employee","career.assistant":"Assistant","career.manager":"Manager","career.deputy":"Deputy","career.director":"Director","career.executive":"Executive","career.senior":"Senior Executive","career.ceo":"CEO","product.deposit":"Deposit","product.savings":"Savings","product.bond":"Domestic Stock","product.usStock":"US Stock","product.crypto":"Crypto","property.villa":"Villa","property.officetel":"Officetel","property.apartment":"Apartment","property.shop":"Shop","property.building":"Building","property.tower":"Seoul Tower","button.buy":"Buy","button.sell":"Sell","button.confirm":"Confirm","button.cancel":"Cancel","button.yes":"Yes","button.no":"No","button.load":"Load","button.later":"Later","msg.insufficientFunds":"💸 Insufficient funds. (Required: {amount})","msg.purchased":"✅ Purchased {qty}{unit} of {product}. (Owned: {count}{unit})","msg.sold":"💰 Sold {qty}{unit} of {product}. (+{amount}, Owned: {count}{unit})","msg.insufficientQuantity":"❌ Insufficient quantity to sell. (Owned: {count})","msg.promoted":"🎉 Promoted to {career}! ({income} per click)","msg.achievementUnlocked":"🏆 Achievement unlocked: {name} - {desc}","msg.upgradeUnlocked":"🎁 New upgrade unlocked: {name}","msg.upgradeAlreadyPurchased":"❌ Upgrade already purchased.","msg.upgradeInsufficientFunds":"💸 Insufficient funds. (Required: {cost})","msg.upgradePurchased":"✅ Purchased {name}! {desc}","msg.upgradeError":"⚠️ Error applying effect for {name}","msg.eventStarted":"📈 {name} event started! Lasts {duration} seconds","msg.eventDescription":"💡 {description}","msg.eventEnded":"📉 Market event ended.","msg.nicknameSet":'Nickname set to "{nickname}".',"msg.gameReset":"🔄 Resetting game...","msg.saveExported":"✅ Save file downloaded.","msg.saveImported":"✅ Save file loaded. Refreshing page...","msg.bonusPaid":"💰 Bonus paid! 10x income!","msg.nextUpgradeHint":'🎯 {remaining} clicks until next upgrade "{name}"!',"msg.gameLoaded":"Loaded saved game.","msg.welcome":"Welcome! Work to save up and buy your first property.","msg.manualSave":"💾 Manual save completed!","msg.cloudSaved":"☁️ Saved to cloud.","msg.cloudApplied":"☁️ Cloud save applied. Refreshing page...","modal.error.nicknameLength.title":"Nickname Length Error","modal.error.nicknameLength.message":"Nickname must be 1-5 characters.","modal.error.nicknameFormat.title":"Nickname Format Error","modal.error.nicknameFormat.message":"Nickname cannot contain spaces.","modal.error.nicknameFormatInvalid.title":"Nickname Format Error","modal.error.nicknameFormatInvalid.message":"Nickname cannot contain %, _ characters.","modal.error.nicknameTaken.title":"Nickname Taken","modal.error.nicknameTaken.message":`This nickname is already in use.
Please enter a different nickname.`,"modal.error.resetError.title":"Error","modal.error.resetError.message":`An error occurred while resetting the game.
Please refresh the page.`,"modal.confirm.reset.title":"Reset Game","modal.confirm.reset.message":`Resetting the game will delete all progress and cannot be recovered.
Are you sure you want to reset?`,"modal.confirm.reset.primaryLabel":"Reset","modal.nickname.title":"Nickname Setting","modal.nickname.message":`Please enter the nickname to be displayed on the leaderboard.
(1-5 characters, spaces/%, _ not allowed)`,"modal.nickname.placeholder":"1-5 character nickname","modal.info.cloudSaveComplete.title":"Complete","modal.info.cloudSaveComplete.message":"Cloud save completed!","modal.error.loginRequired.title":"Login Required","modal.error.loginRequired.message":"Cloud save is only available for logged-in users.","modal.error.noSaveData.title":"No Save Data","modal.error.noSaveData.message":"No local save data found. Please play the game first and then save.","modal.error.invalidSaveData.title":"Error","modal.error.invalidSaveData.message":"Local save data format is invalid.","modal.error.uploadFailed.title":"Upload Failed","modal.error.uploadFailed.message":`Cloud save failed.
{error}`,"modal.error.downloadFailed.title":"Download Failed","modal.error.downloadFailed.message":`Cloud load failed.
{error}`,"modal.error.noCloudSave.title":"No Cloud Save","modal.error.noCloudSave.message":"No cloud save found for this account.","modal.error.cloudApplyFailed.title":"Error","modal.error.cloudApplyFailed.message":`Failed to apply cloud save.
{error}`,"modal.confirm.cloudRestore.title":"Cloud Save Restore","modal.confirm.cloudRestore.message":`Cloud save available.

Save time: {time}

Load it?`,"modal.error.progressSwitchFailed.title":"Error","modal.error.progressSwitchFailed.message":`Failed to switch progress.
{error}`,"modal.error.cloudTableMissing.title":"Cloud Table Missing","modal.error.cloudTableMissing.message":`The game_saves table does not exist in Supabase yet.
Please run supabase/game_saves.sql in Supabase SQL Editor.`,"achievement.status.unlocked":"✅ Unlocked!","achievement.status.locked":"🔒 Locked","modal.confirm.cloudLoad.title":"Cloud Load","modal.confirm.cloudLoad.message":`Save time: {time}

Loading will overwrite local save with cloud data and refresh the page.
Continue?`,"modal.confirm.cloudSaveFound.title":"Cloud Save Found","modal.confirm.cloudSaveFound.message":"{message}","modal.confirm.progressSwitch.title":"Progress Selection","modal.confirm.progressSwitch.message":"{message}","msg.cloudProgressLoaded":"☁️ Loaded progress from another device. Refreshing page...","modal.info.cloudSaveComplete.title":"Complete","modal.info.cloudSaveComplete.message":"Cloud save completed!","settings.language.title":"🌐 Language","settings.gameInfo.title":"📋 Game Info","settings.visualEffects.title":"🎨 Visual Effects","settings.numberDisplay.title":"🔢 Number Display","settings.account.title":"👤 Account (Social Login)","settings.saveManagement.title":"💾 Save Management","settings.reset.title":"🔄 Reset Game","header.cash":"💵 Cash","header.financial":"💰 Financial","header.properties":"🏢 Properties","header.rps":"📈 Per Sec","header.favorite_btn":"Favorite","header.share_btn":"Share","work.title":"🛠️ Work","work.button":"🛠️ Work","ui.work":"🛠️ Labor","ui.diary":"📓 Diary","ui.upgrades":"Upgrades","ui.financial":"Financial Products","ui.properties":"Properties","ui.buy":"Buy","ui.sell":"Sell","ui.quantity":"Quantity","ui.currentPrice":"Current Price","ui.owned":"Owned","ui.production":"Production","ui.totalIncome":"Total Income","ui.percent":"Ratio","ui.lifetime":"Lifetime","ui.prestige":"Prestige item (no income)","ui.leaderboard":"Recorded on leaderboard","ui.nextPromotion":"{remaining} clicks until next promotion","ui.promotionAvailable":"Promotion available!","ui.remaining":"remaining","ui.progress":"Progress","ui.stats":"📊 Stats","ui.ranking":"🏅 Ranking","ui.settings":"⚙️ Settings","ui.marketEvent":"Market Event","ui.second":"sec","ui.currency":" KRW","ui.currencyShort":" KRW","ui.noTimeInfo":"No time info","header.tooltip.financialIncome":"Financial Income: {amount}","header.tooltip.propertyIncome":"Property Income: {amount}","header.tooltip.marketMultiplier":"Market Multiplier: x{multiplier}","ui.unit.count":"pcs","ui.unit.property":"units","product.desc.perUnit":"Each {product} produces {amount} per second","product.desc.total":"{count} {unit} {product} producing {amount} per second ({percent}% of total)","product.desc.lifetime":"Lifetime production: {amount}","product.desc.currentPrice":"Current price: {price}","ui.noUpgrades":"No upgrades unlocked","ui.day":"day","ui.owned":"owned","tower.desc.prestige":"Prestige item (no income)","tower.desc.owned":"{count} owned","tower.desc.leaderboard":"Recorded on leaderboard: 🗼x{count}","stats.totalAssets":"Total Assets","stats.totalEarnings":"Total Lifetime Earnings","stats.rps":"Per Second","stats.clickIncome":"Per Click","stats.hourlyEarnings":"Last Hour Earnings","stats.dailyEarnings":"Last 24 Hours Earnings","stats.growthRate":"Growth Rate","stats.nextMilestone":"Next Milestone","stats.maxAchieved":"Max Achieved","stats.remaining":"{amount} remaining","stats.laborIncome":"Labor Income","stats.playTime":"Play Time","stats.hourlyRate":"Hourly Rate","stats.efficiencyRanking":"Efficiency Ranking (Per Unit Per Second)","stats.incomeStructure":"Income Structure","stats.assetRatio":"Asset Ratio","stats.financialProducts":"Financial Products","stats.properties":"Properties","stats.owned":"Owned","stats.lifetimeEarnings":"Lifetime Earnings","stats.totalValue":"Total Value","stats.labor":"Labor","stats.financial":"Financial","stats.property":"Property","stats.cash":"Cash","stats.growthTracking":"Growth Tracking","ranking.myRecord":"My Record","ranking.globalLeaderboard":"Global Leaderboard (TOP 10)","ranking.loading":"Loading leaderboard...","ranking.lastUpdated":"Last updated: {time}","ranking.refreshNote":"Records are updated periodically.","ranking.nicknameRequired":"Set a nickname to see your rank and record here.","ranking.loginRequired":"Please log in to see your rank.","ranking.achievements":"Achievements","ranking.table.rank":"#","ranking.table.nickname":"Nickname","ranking.table.assets":"Assets","ranking.table.playtime":"Time","settings.gameTitle":"Game Title","settings.version":"Version","settings.author":"Author","settings.homepage":"Go to Homepage","settings.particles":"Particles On","settings.particlesDesc":"Falling money/product animations","settings.fancyGraphics":"Fancy Graphics On","settings.fancyGraphicsDesc":"Enhanced visual effects (disable for better performance)","settings.shortNumbers":"Short Numbers On","settings.shortNumbersDesc":"Display large numbers simply (e.g., 10M → 10 million)","settings.status":"Status","settings.user":"User","settings.nickname":"Nickname","settings.guestMode":"Guest Mode (Login Ready)","settings.guest":"Guest","settings.notLoggedIn":"Not Logged In","settings.loginGoogle":"Login with Google","settings.language.korean":"Korean","settings.logout":"Logout","settings.resetWarning":"Resetting the game will delete all progress and cannot be recovered.","settings.saveManagement.cloudSaveDesc":"☁️ Cloud Save: Logged-in users can save to the cloud to sync progress across devices.","settings.saveManagement.cloudSaveBtn":"☁️ Cloud Save","settings.saveManagement.cloudLoadBtn":"☁️ Cloud Load","settings.saveManagement.cloudSaveHint":"Local saves are automatic every 5 seconds. Cloud saves are uploaded automatically when closing the tab, and can also be manually saved/loaded.","settings.saveManagement.lastCloudSync":"Last Cloud Sync","settings.saveManagement.guestSaveInfo":"In Guest Mode, saves are stored only in browser LocalStorage. Login is required to sync progress across multiple devices.","settings.saveManagement.autoSaveInterval":"Auto Save Interval","settings.saveManagement.saveLocation":"Save Location","settings.saveManagement.lastSave":"Last Save","settings.saveManagement.autoSaveIntervalValue":"Every 5 seconds","settings.saveManagement.saveLocationValue":"Browser LocalStorage","settings.authStatus.loggedIn":"Logged In","stats.totalEarningsTitle":"Total Earnings","stats.totalAssets":"Total Assets","stats.totalEarnings":"Total Cumulative Earnings","stats.rps":"Earnings Per Second","stats.clickIncome":"Earnings Per Click","stats.playInfo":"Play Info","stats.totalClicks":"Total Clicks","stats.unit.sec":"sec","stats.unit.times":"times","stats.unit.hour":"hour","stats.unit.minute":"min","stats.unit.perSec":"/sec","stats.unit.perHour":"/hour","ui.dayCount":"Day {days}","ui.today":"Today: {date}","ui.saved":"Saved · {time}","ui.confirm":"Confirm","ui.incomeFormat":"+{amount}","ui.careerProgress":"Career Progress","ranking.loadingText":"Loading leaderboard...","ranking.empty":"No records in leaderboard yet.","ranking.error":"Error loading leaderboard: {error}","ranking.emptyMessage":"You are not yet on the leaderboard.","ranking.emptyHint":"Play the game and save to see your rank here.","diary.justWrite":"Just writing it down.","diary.todayRecord":"Today's record.","diary.anyway":"Anyway,","diary.justRecord":"Just recording.","diary.memo":"Making a memo.","diary.remember":"Remember this.","diary.recordForLater":"Recording for later.","diary.goodToWrite":"It would be good to write it down.","diary.leaveRecord":"Leaving a record.","msg.unlock.savings":"❌ Savings requires at least 1 Deposit to unlock.","msg.unlock.bond":"❌ Domestic Stock requires at least 1 Savings to unlock.","achievement.first_click.name":"First Labor","achievement.first_click.desc":"Made your first click","achievement.first_deposit.name":"First Deposit","achievement.first_deposit.desc":"Purchased your first deposit","achievement.first_savings.name":"First Savings","achievement.first_savings.desc":"Purchased your first savings","achievement.first_bond.name":"First Domestic Stock","achievement.first_bond.desc":"Purchased your first domestic stock","achievement.first_us_stock.name":"First US Stock","achievement.first_us_stock.desc":"Purchased your first US stock","achievement.first_crypto.name":"First Crypto","achievement.first_crypto.desc":"Purchased your first crypto","achievement.first_property.name":"First Property","achievement.first_property.desc":"Purchased your first property","achievement.first_upgrade.name":"First Upgrade","achievement.first_upgrade.desc":"Purchased your first upgrade","achievement.financial_expert.name":"Financial Expert","achievement.financial_expert.desc":"Own all financial products","achievement.property_collector.name":"Property Collector","achievement.property_collector.desc":"Own 5 properties","achievement.property_tycoon.name":"Property Tycoon","achievement.property_tycoon.desc":"Own all property types","achievement.investment_guru.name":"Investment Guru","achievement.investment_guru.desc":"Purchased all upgrades","achievement.gangnam_rich.name":"Gangnam Rich","achievement.gangnam_rich.desc":"Own 3 apartments","achievement.global_investor.name":"Global Investor","achievement.global_investor.desc":"Achieved 100M KRW in overseas investments","achievement.crypto_expert.name":"Crypto Expert","achievement.crypto_expert.desc":"Achieved 500M KRW in crypto investments","achievement.real_estate_agent.name":"Real Estate Agent","achievement.real_estate_agent.desc":"Own 20 properties","achievement.millionaire.name":"Millionaire","achievement.millionaire.desc":"Achieved 100M KRW in total assets","achievement.ten_millionaire.name":"Ten Millionaire","achievement.ten_millionaire.desc":"Achieved 1B KRW in total assets","achievement.hundred_millionaire.name":"Rich","achievement.hundred_millionaire.desc":"Achieved 10B KRW in total assets","achievement.billionaire.name":"Billionaire","achievement.billionaire.desc":"Achieved 100B KRW in total assets","achievement.trillionaire.name":"Chaebol","achievement.trillionaire.desc":"Achieved 1T KRW in total assets","achievement.global_rich.name":"Global Rich","achievement.global_rich.desc":"Achieved 10T KRW in total assets","achievement.legendary_rich.name":"Legendary Rich","achievement.legendary_rich.desc":"Achieved 100T KRW in total assets","achievement.god_rich.name":"God Rich","achievement.god_rich.desc":"Achieved 1,000T KRW in total assets","achievement.career_starter.name":"Employee","achievement.career_starter.desc":"Promoted to contract worker","achievement.employee.name":"Regular Employee","achievement.employee.desc":"Promoted to employee","achievement.deputy_director.name":"Team Leader","achievement.deputy_director.desc":"Promoted to manager","achievement.executive.name":"Executive","achievement.executive.desc":"Promoted to senior manager","achievement.ceo.name":"CEO","achievement.ceo.desc":"Became CEO","achievement.chaebol_chairman.name":"Chaebol Chairman","achievement.chaebol_chairman.desc":"Achieved 1T KRW in assets","achievement.global_ceo.name":"Global CEO","achievement.global_ceo.desc":"Achieved overseas expansion","achievement.legendary_ceo.name":"Legendary CEO","achievement.legendary_ceo.desc":"Achieved all goals"},La="clicksurvivor_lang",lr=location.hostname==="localhost"||location.hostname==="127.0.0.1",Mn={ko:rr,en:cr},dr=Object.keys(Mn);function cs(k){const v=String(k||"").toLowerCase();return dr.includes(v)?v:null}function ur(){const k=new URL(window.location.href);return cs(k.searchParams.get("lang"))}function ls(){const k=ur();if(k)return k;const v=cs(localStorage.getItem(La));return v||(String(navigator.language||"").toLowerCase().startsWith("ko")?"ko":"en")}let Pn=ls();function a(k,v={},m=null){let w=(Mn[Pn]||Mn.ko)[k];return w===void 0?(lr&&console.warn(`[i18n] Missing translation key: ${k}`),m!==null?m:k):(v&&typeof v=="object"&&Object.keys(v).forEach(T=>{const X=new RegExp(`\\{${T}\\}`,"g");w=w.replace(X,String(v[T]))}),w)}function is(k){const v=cs(k)||"ko";Pn=v,document.documentElement.lang=v,localStorage.setItem(La,v);const m=new URL(window.location.href);m.searchParams.set("lang",v),history.replaceState(null,"",m.toString());const x=document.querySelector("#languageSelect");return x&&(x.value=v),v}function Q(){return Pn}function va(){const k=Mn[Pn]||Mn.ko;document.querySelectorAll("[data-i18n]").forEach(m=>{const x=m.getAttribute("data-i18n");if(!x)return;const w=k[x];typeof w=="string"&&(m.textContent=w)}),document.querySelectorAll("[data-i18n-alt]").forEach(m=>{const x=m.getAttribute("data-i18n-alt");if(!x)return;const w=k[x];typeof w=="string"&&m.setAttribute("alt",w)}),document.querySelectorAll("[data-i18n-aria-label]").forEach(m=>{const x=m.getAttribute("data-i18n-aria-label");if(!x)return;const w=k[x];typeof w=="string"&&m.setAttribute("aria-label",w)}),document.querySelectorAll("#languageSelect option[data-i18n-option]").forEach(m=>{const x=m.getAttribute("data-i18n-option");if(!x)return;const w=k[x];typeof w=="string"&&(m.textContent=w)});const v=document.querySelector("#languageSelect");v&&(v.value=Pn)}is(ls());const Ca="game_saves";function Ia(k){return k?{message:(k==null?void 0:k.message)||String(k),code:k==null?void 0:k.code,details:k==null?void 0:k.details,hint:k==null?void 0:k.hint}:null}function Ea(k){const v=String((k==null?void 0:k.message)||"").toLowerCase();return v.includes("does not exist")||v.includes("relation")||v.includes("42p01")}async function ss(k){if(!Sa())return{ok:!1,reason:"not_configured"};const v=Wt();if(!v)return{ok:!1,reason:"not_configured"};const m=await je();if(!m)return{ok:!1,reason:"not_signed_in"};const{data:x,error:w}=await v.from(Ca).select("save, save_ts, updated_at").eq("user_id",m.id).eq("game_slug",k).maybeSingle();return w?{ok:!1,reason:Ea(w)?"missing_table":"query_failed",error:Ia(w)}:x?{ok:!0,found:!0,save:x.save,save_ts:x.save_ts,updated_at:x.updated_at}:{ok:!0,found:!1}}async function ba(k,v){if(!Sa())return{ok:!1,reason:"not_configured"};const m=Wt();if(!m)return{ok:!1,reason:"not_configured"};const x=await je();if(!x)return{ok:!1,reason:"not_signed_in"};const w=Number((v==null?void 0:v.ts)||Date.now())||Date.now(),T={user_id:x.id,game_slug:k,save:v,save_ts:w};(v==null?void 0:v.nickname)!==void 0?console.log("☁️ 클라우드 저장: 닉네임 포함됨:",v.nickname||"(빈 문자열)"):console.warn("⚠️ 클라우드 저장: 닉네임 필드가 없음");const{error:X}=await m.from(Ca).upsert(T,{onConflict:"user_id,game_slug"});return X?{ok:!1,reason:Ea(X)?"missing_table":"upsert_failed",error:Ia(X)}:{ok:!0}}const _o="seoulsurvival";function ds(k){return(k||"").trim()}async function mr(k){const v=Wt();if(!v)return console.warn("Leaderboard: Supabase client not configured for nickname check"),{taken:!1,reason:"not_configured"};const x=ds(k).toLowerCase();if(!x)return{taken:!1,reason:"empty"};try{const{data:w,error:T}=await v.from("leaderboard").select("nickname").eq("game_slug",_o).ilike("nickname",x).limit(1);return T?(console.error("Nickname check error:",T),{taken:!1,reason:"error"}):{taken:!!(w&&w.length>0)}}catch(w){return console.error("Nickname check exception:",w),{taken:!1,reason:"exception"}}}async function as(k,v,m,x=0){try{const w=await je();if(!w)return console.log("Leaderboard: User not logged in, skipping update"),{success:!1,error:"Not logged in"};const T=Wt(),{data:X,error:Ie}=await T.from("leaderboard").upsert({user_id:w.id,game_slug:_o,nickname:k||"익명",total_assets:v,play_time_ms:m,tower_count:x,updated_at:new Date().toISOString()},{onConflict:"user_id,game_slug"}).select().single();return Ie?(console.error("Leaderboard update error:",Ie),{success:!1,error:Ie.message}):(console.log("Leaderboard updated:",X),{success:!0,data:X})}catch(w){return console.error("Leaderboard update exception:",w),{success:!1,error:w.message}}}async function gr(k=10,v="assets"){var m,x,w,T,X,Ie;try{const se=Wt();if(!se)return console.error("Leaderboard: Supabase client not configured"),console.warn("[LB] fetch failed",{reason:"not_configured",phase:"init"}),{success:!1,error:"Supabase가 설정되지 않았습니다. shared/auth/config.js를 확인해주세요.",data:[],errorType:"config"};let De=se.from("leaderboard").select("nickname, total_assets, play_time_ms, tower_count, updated_at").eq("game_slug",_o).limit(k);v==="assets"?De=De.order("tower_count",{ascending:!1}).order("total_assets",{ascending:!1}):v==="playtime"&&(De=De.order("play_time_ms",{ascending:!1}));const{data:yt,error:me}=await De;if(me){console.error("Leaderboard fetch error:",me);const Ee=me.status??me.code??null,he=me.code==="PGRST116"||((m=me.message)==null?void 0:m.includes("relation"))||((x=me.message)==null?void 0:x.includes("does not exist")),To=Ee===401||Ee===403||((T=(w=me.message)==null?void 0:w.toLowerCase)==null?void 0:T.call(w).includes("permission denied"))||((Ie=(X=me.message)==null?void 0:X.toLowerCase)==null?void 0:Ie.call(X).includes("rls"));return console.warn("[LB] fetch failed",{phase:"select",status:Ee,code:me.code,message:me.message,details:me.details,hint:me.hint}),he?{success:!1,error:"리더보드 테이블이 없습니다. Supabase SQL Editor에서 supabase/leaderboard.sql을 실행해주세요.",data:[],errorType:"schema",status:Ee}:To?{success:!1,error:"권한이 없어 리더보드를 불러올 수 없습니다.",data:[],errorType:"forbidden",status:Ee}:{success:!1,error:me.message,data:[],errorType:"generic",status:Ee}}return{success:!0,data:yt||[]}}catch(se){return console.error("Leaderboard fetch exception:",se),console.warn("[LB] fetch failed",{phase:"exception",message:se==null?void 0:se.message,error:se}),{success:!1,error:se.message||"알 수 없는 오류",data:[],errorType:"network"}}}async function ka(k,v="assets"){const m=Wt();if(!m)return console.warn("[LB] my_rank failed",{reason:"not_configured"}),{success:!1,data:null,errorType:"config"};const w=ds(k).toLowerCase();if(!w)return{success:!1,data:null,errorType:"no_nickname"};try{const{data:T,error:X,status:Ie}=await m.rpc("get_my_rank",{p_game_slug:_o,p_nickname:w,p_sort_by:v});if(X){console.error("My rank RPC error:",X),console.warn("[LB] my_rank failed",{phase:"rpc",status:Ie??X.status,code:X.code,message:X.message,details:X.details,hint:X.hint});const De=Ie===401||Ie===403?"forbidden":"generic";return{success:!1,data:null,error:X.message,errorType:De,status:Ie??X.status}}const se=Array.isArray(T)?T[0]:T;return se?{success:!0,data:{rank:se.rank,nickname:se.nickname,total_assets:se.total_assets,play_time_ms:se.play_time_ms,tower_count:se.tower_count||0}}:{success:!1,data:null,errorType:"not_found"}}catch(T){return console.error("My rank RPC exception:",T),console.warn("[LB] my_rank failed",{phase:"exception",message:T==null?void 0:T.message,error:T}),{success:!1,data:null,error:T.message||"알 수 없는 오류",errorType:"network"}}}const fr=""+new URL("work_bg_01_alba_night-Db0rzBPq.png",import.meta.url).href,pr=""+new URL("work_bg_02_gyeyakjik_night-DOcTIOmf.png",import.meta.url).href,yr=""+new URL("work_bg_03_sawon_night-C5FuvRVs.png",import.meta.url).href,hr=""+new URL("work_bg_04_daeri_night-BsoSfDAg.png",import.meta.url).href,$r=""+new URL("work_bg_05_gwajang_night-CcE0KsfB.png",import.meta.url).href,vr=""+new URL("work_bg_06_chajang_night-CnOFWkRx.png",import.meta.url).href,br=""+new URL("work_bg_07_bujang_night-0BAHlWBE.png",import.meta.url).href,kr=""+new URL("work_bg_08_sangmu_night-CEIOpmTg.png",import.meta.url).href,Sr=""+new URL("work_bg_09_jeonmu_night-BHVf_WEo.png",import.meta.url).href,Lr=""+new URL("work_bg_10_ceo_night-BG1qCML1.png",import.meta.url).href,rs=location.hostname==="localhost"||location.hostname==="127.0.0.1";rs||(console.log=()=>{},console.warn=()=>{},console.error=()=>{});function Cr(){const k=navigator.userAgent||"",v=k.includes("KAKAOTALK"),m=k.includes("Instagram"),x=k.includes("FBAN")||k.includes("FBAV"),w=k.includes("Line"),T=k.includes("MicroMessenger");return{isInApp:v||m||x||w||T,isKakao:v,isInstagram:m,isFacebook:x,isLine:w,isWeChat:T}}function Ir(){const{isInApp:k}=Cr();if(!k)return;const v=document.createElement("div");v.className="inapp-warning-banner",v.innerHTML=`
    이 브라우저에서는 Google 로그인이 제한될 수 있습니다.<br />
    <strong>Chrome / Safari 등 기본 브라우저에서 다시 열어 주세요.</strong>
    <div class="inapp-warning-actions">
      <button type="button" class="btn-small" id="copyGameUrlBtn">URL 복사</button>
      <button type="button" class="btn-small" id="closeInappWarningBtn">확인</button>
    </div>
  `,document.body.prepend(v);const m=v.querySelector("#copyGameUrlBtn");m&&m.addEventListener("click",async()=>{const w="https://clicksurvivor.com/seoulsurvival/";try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(w),alert(`주소가 복사되었습니다.
Chrome/Safari 주소창에 붙여넣어 열어 주세요.`);return}const T=document.createElement("textarea");T.value=w,T.style.position="fixed",T.style.left="-999999px",T.style.top="-999999px",document.body.appendChild(T),T.focus(),T.select();try{if(document.execCommand("copy"))alert(`주소가 복사되었습니다.
Chrome/Safari 주소창에 붙여넣어 열어 주세요.`);else throw new Error("execCommand failed")}catch{alert(w+`
위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.`)}finally{document.body.removeChild(T)}}catch{alert(w+`
위 주소를 복사해서 Chrome/Safari에서 직접 열어 주세요.`)}});const x=v.querySelector("#closeInappWarningBtn");x&&x.addEventListener("click",()=>{v.remove()})}document.addEventListener("DOMContentLoaded",()=>{var Ys;const k=ls();is(k),va(),setTimeout(()=>{fe(),Oo()},100);function v(){const t=document.querySelector("header");if(!t)return;const n=Math.ceil(t.getBoundingClientRect().height||0);n>0&&document.documentElement.style.setProperty("--header-h",`${n}px`)}v(),Ir(),window.addEventListener("resize",v);try{(Ys=window.visualViewport)==null||Ys.addEventListener("resize",v)}catch{}try{const t=document.querySelector("header");t&&"ResizeObserver"in window&&new ResizeObserver(v).observe(t)}catch{}try{const t=n=>n.preventDefault();document.addEventListener("gesturestart",t,{passive:!1}),document.addEventListener("gesturechange",t,{passive:!1}),document.addEventListener("gestureend",t,{passive:!1})}catch{}function m(t,n){t&&t.textContent!==void 0&&(t.textContent=n)}function x(t,n,s){const i=ae;if(ve==="buy"){const r=t==="financial"?Z(n,s)*i:Y(n,s,i);if(S<r)return _(a("msg.insufficientFunds",{amount:T(r)})),{success:!1,newCount:s};S-=r;const c=s+i,l=a(t==="financial"?"ui.unit.count":"ui.unit.property"),d=B(n);_(a("msg.purchased",{product:d,qty:i,unit:l,count:c}));const g={deposit:"💰",savings:"🏦",bond:"📈",usStock:"🇺🇸",crypto:"₿",villa:"🏠",officetel:"🏢",apartment:"🏘️",shop:"🏪",building:"🏙️"};return Le.particles&&Ps(g[n]||"🏠",i),{success:!0,newCount:c}}else if(ve==="sell"){if(s<i)return _(a("msg.insufficientQuantity",{count:s})),{success:!1,newCount:s};const r=t==="financial"?Ct(n,s)*i:It(n,s,i);S+=r;const c=s-i,l=a(t==="financial"?"ui.unit.count":"ui.unit.property"),d=B(n);return _(a("msg.sold",{product:d,qty:i,unit:l,amount:T(r),count:c})),{success:!0,newCount:c}}return{success:!1,newCount:s}}function w(t){if(t>=1e12){const n=(t/1e12).toFixed(1);return parseFloat(n).toLocaleString("en-US")+"T"}else if(t>=1e9){const n=(t/1e9).toFixed(1);return parseFloat(n).toLocaleString("en-US")+"B"}else if(t>=1e6){const n=(t/1e6).toFixed(1);return parseFloat(n).toLocaleString("en-US")+"M"}else if(t>=1e3){const n=(t/1e3).toFixed(1);return parseFloat(n).toLocaleString("en-US")+"K"}else return Math.floor(t).toString()}function T(t){if(Q()==="en")return w(t);if(t>=1e12){const s=(t/1e12).toFixed(1);return parseFloat(s).toLocaleString("ko-KR")+"조"}else if(t>=1e8){const s=(t/1e8).toFixed(1);return parseFloat(s).toLocaleString("ko-KR")+"억"}else if(t>=1e4){const s=(t/1e4).toFixed(1);return parseFloat(s).toLocaleString("ko-KR")+"만"}else if(t>=1e3){const s=(t/1e3).toFixed(1);return parseFloat(s).toLocaleString("ko-KR")+"천"}else return Math.floor(t).toString()}function X(t,n=null){return n&&n==="en"?w(t):T(t)}function Ie(t){return Le.shortNumbers?t>=1e12?(t/1e12).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})+"T":t>=1e9?(t/1e9).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})+"B":t>=1e6?(t/1e6).toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1})+"M":t>=1e3?Math.floor(t/1e3).toLocaleString("en-US")+"K":Math.floor(t).toLocaleString("en-US")+" KRW":Math.floor(t).toLocaleString("en-US")+" KRW"}function se(t){return Q()==="en"?Ie(t):Le.shortNumbers?t>=1e12?(t/1e12).toLocaleString("ko-KR",{minimumFractionDigits:2,maximumFractionDigits:2})+"조":t>=1e8?(t/1e8).toLocaleString("ko-KR",{minimumFractionDigits:2,maximumFractionDigits:2})+"억":t>=1e4?(t/1e4).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"만원":t>=1e3?Math.floor(t/1e3).toLocaleString("ko-KR")+"천원":Math.floor(t).toLocaleString("ko-KR")+"원":Math.floor(t).toLocaleString("ko-KR")+"원"}function De(t){return se(t)}function yt(t){const n=Q(),s=Math.floor(t||0);return n==="en"?s>=1e12?Math.floor(s/1e12).toLocaleString("en-US")+"T":s>=1e9?Math.floor(s/1e9).toLocaleString("en-US")+"B":s>=1e6?Math.floor(s/1e6).toLocaleString("en-US")+"M":s>=1e3?Math.floor(s/1e3).toLocaleString("en-US")+"K":"0":s>=1e12?Math.floor(s/1e12).toLocaleString("ko-KR")+"조":s>=1e8?Math.floor(s/1e8).toLocaleString("ko-KR")+"억":s>=1e4?Math.floor(s/1e4).toLocaleString("ko-KR")+"만원":"0만원"}function me(t){return Q()==="en"?t>=1e9?Math.round(t/1e9).toLocaleString("en-US")+"B":t>=1e6?Math.round(t/1e6).toLocaleString("en-US")+"M":t>=1e3?Math.round(t/1e3).toLocaleString("en-US")+"K":Math.floor(t).toLocaleString("en-US"):t>=1e8?Math.round(t/1e8).toLocaleString("ko-KR")+"억":t>=1e4?Math.round(t/1e4).toLocaleString("ko-KR")+"만":t>=1e3?Math.round(t/1e3).toLocaleString("ko-KR")+"천":Math.floor(t).toLocaleString("ko-KR")}function Ee(t){return Q()==="en"?t>=1e9?(Math.round(t/1e8)/10).toLocaleString("en-US")+"B":t>=1e6?Math.round(t/1e6).toLocaleString("en-US")+"M":t>=1e3?Math.round(t/1e3).toLocaleString("en-US")+"K":Math.floor(t).toLocaleString("en-US"):t>=1e8?(Math.round(t/1e7)/10).toLocaleString("ko-KR")+"억":t>=1e4?Math.round(t/1e4).toLocaleString("ko-KR")+"만":Math.floor(t).toLocaleString("ko-KR")}function he(t){return se(t)}function To(t){return t>=1e12?(t/1e12).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"조":t>=1e8?(t/1e8).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"억":t>=1e4?(t/1e4).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"만":t>=1e3?(t/1e3).toLocaleString("ko-KR",{minimumFractionDigits:1,maximumFractionDigits:1})+"천":Math.floor(t).toString()}function wa(t){return t>=1e12?(t/1e12).toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1})+"T":t>=1e9?(t/1e9).toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1})+"B":t>=1e6?(t/1e6).toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1})+"M":t>=1e3?(t/1e3).toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1})+"K":Math.floor(t).toString()}function Ne(t){const n=Q();return Le.shortNumbers?n==="en"?wa(t)+" KRW":To(t)+"원":n==="en"?Math.floor(t).toLocaleString("en-US")+" KRW":Math.floor(t).toLocaleString("ko-KR")+"원"}const _a={deposit:5e4,savings:5e5,bond:5e6,usStock:25e6,crypto:1e8},jt={villa:25e7,officetel:35e7,apartment:8e8,shop:12e8,building:3e9,tower:1e12};function Z(t,n,s=1){const i=_a[t];let r=0;for(let c=0;c<s;c++){const l=n+c;let d=i*Math.pow(1.05,l);r+=d}return Math.floor(r)}function Ct(t,n,s=1){if(n<=0)return 0;let i=0;for(let r=0;r<s&&!(n-r<=0);r++){const c=Z(t,n-r-1,1);i+=Math.floor(c*1)}return i}function Y(t,n,s=1){const i=jt[t];if(!i)return 0;if(t==="tower")return i*s;let r=0;for(let c=0;c<s;c++){const l=n+c;let d=i*Math.pow(1.05,l);r+=d}return Math.floor(r)}function It(t,n,s=1){if(t==="tower"||n<=0)return 0;let i=0;for(let r=0;r<s&&!(n-r<=0);r++){const c=Y(t,n-r-1,1);i+=Math.floor(c*1)}return i}let S=0,Re=0,Fe=Date.now(),ht=Date.now(),D=0,F=0,U=0,J=0,z=0,ze=0,Ye=0,Je=0,Qe=0,Xe=0,Ze=0,et=0,tt=0,nt=0,ot=0,ve="buy",ae=1;const Te="seoulTycoonSaveV1",An="ss_blockCloudRestoreUntilNicknameDone",xo="ss_skipCloudRestoreOnce";let Rn=new Date,ie="",Bt=!1;const ne={part_time_job:{name:"🍕 아르바이트 경험",desc:"클릭 수익 1.2배",cost:5e4,icon:"🍕",unlockCondition:()=>G>=1,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},internship:{name:"📝 인턴십",desc:"클릭 수익 1.2배",cost:2e5,icon:"📝",unlockCondition:()=>G>=2,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},efficient_work:{name:"⚡ 효율적인 업무 처리",desc:"클릭 수익 1.2배",cost:5e5,icon:"⚡",unlockCondition:()=>G>=3,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},focus_training:{name:"🎯 집중력 강화",desc:"클릭 수익 1.2배",cost:2e6,icon:"🎯",unlockCondition:()=>G>=4,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},professional_education:{name:"📚 전문 교육",desc:"클릭 수익 1.2배",cost:1e7,icon:"📚",unlockCondition:()=>G>=5,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},performance_bonus:{name:"💰 성과급",desc:"2% 확률로 10배 수익",cost:1e7,icon:"💰",unlockCondition:()=>G>=6,effect:()=>{},category:"labor",unlocked:!1,purchased:!1},career_recognition:{name:"💼 경력 인정",desc:"클릭 수익 1.2배",cost:3e7,icon:"💼",unlockCondition:()=>G>=6,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},overtime_work:{name:"🔥 초과근무",desc:"클릭 수익 1.2배",cost:5e7,icon:"🔥",unlockCondition:()=>G>=7,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},honor_award:{name:"🎖️ 명예상",desc:"클릭 수익 1.2배",cost:1e8,icon:"🎖️",unlockCondition:()=>G>=7,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},expertise_development:{name:"💎 전문성 개발",desc:"클릭 수익 1.2배",cost:2e8,icon:"💎",unlockCondition:()=>G>=8,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},teamwork:{name:"🤝 팀워크 향상",desc:"클릭 수익 1.2배",cost:5e8,icon:"🤝",unlockCondition:()=>G>=8,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},leadership:{name:"👑 리더십",desc:"클릭 수익 1.2배",cost:2e9,icon:"👑",unlockCondition:()=>G>=8,effect:()=>{be*=1.2},category:"labor",unlocked:!1,purchased:!1},ceo_privilege:{name:"👔 CEO 특권",desc:"클릭 수익 2.0배",cost:1e10,icon:"👔",unlockCondition:()=>G>=9,effect:()=>{be*=2},category:"labor",unlocked:!1,purchased:!1},global_experience:{name:"🌍 글로벌 경험",desc:"클릭 수익 2.0배",cost:5e10,icon:"🌍",unlockCondition:()=>G>=9&&ge>=15e3,effect:()=>{be*=2},category:"labor",unlocked:!1,purchased:!1},entrepreneurship:{name:"🚀 창업",desc:"클릭 수익 2.0배",cost:1e11,icon:"🚀",unlockCondition:()=>G>=9&&ge>=3e4,effect:()=>{be*=2},category:"labor",unlocked:!1,purchased:!1},deposit_boost_1:{name:"💰 예금 이자율 상승",desc:"예금 수익 2배",cost:1e5,icon:"💰",unlockCondition:()=>D>=5,effect:()=>{I.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_2:{name:"💎 프리미엄 예금",desc:"예금 수익 2배",cost:25e4,icon:"💎",unlockCondition:()=>D>=15,effect:()=>{I.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_3:{name:"💠 다이아몬드 예금",desc:"예금 수익 2배",cost:5e5,icon:"💠",unlockCondition:()=>D>=30,effect:()=>{I.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_4:{name:"💍 플래티넘 예금",desc:"예금 수익 2배",cost:1e6,icon:"💍",unlockCondition:()=>D>=40,effect:()=>{I.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},deposit_boost_5:{name:"👑 킹 예금",desc:"예금 수익 2배",cost:2e6,icon:"👑",unlockCondition:()=>D>=50,effect:()=>{I.deposit*=2},category:"deposit",unlocked:!1,purchased:!1},savings_boost_1:{name:"🏦 적금 복리 효과",desc:"적금 수익 2배",cost:1e6,icon:"🏦",unlockCondition:()=>F>=5,effect:()=>{I.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_2:{name:"🏅 골드 적금",desc:"적금 수익 2배",cost:25e5,icon:"🏅",unlockCondition:()=>F>=15,effect:()=>{I.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_3:{name:"💍 플래티넘 적금",desc:"적금 수익 2배",cost:5e6,icon:"💍",unlockCondition:()=>F>=30,effect:()=>{I.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_4:{name:"💠 다이아몬드 적금",desc:"적금 수익 2배",cost:1e7,icon:"💠",unlockCondition:()=>F>=40,effect:()=>{I.savings*=2},category:"savings",unlocked:!1,purchased:!1},savings_boost_5:{name:"👑 킹 적금",desc:"적금 수익 2배",cost:2e7,icon:"👑",unlockCondition:()=>F>=50,effect:()=>{I.savings*=2},category:"savings",unlocked:!1,purchased:!1},bond_boost_1:{name:"📈 주식 수익률 향상",desc:"주식 수익 2배",cost:1e7,icon:"📈",unlockCondition:()=>U>=5,effect:()=>{I.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_2:{name:"💹 프리미엄 주식",desc:"주식 수익 2배",cost:25e6,icon:"💹",unlockCondition:()=>U>=15,effect:()=>{I.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_3:{name:"📊 블루칩 주식",desc:"주식 수익 2배",cost:5e7,icon:"📊",unlockCondition:()=>U>=30,effect:()=>{I.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_4:{name:"💎 대형주 포트폴리오",desc:"주식 수익 2배",cost:1e8,icon:"💎",unlockCondition:()=>U>=40,effect:()=>{I.bond*=2},category:"bond",unlocked:!1,purchased:!1},bond_boost_5:{name:"👑 킹 주식",desc:"주식 수익 2배",cost:2e8,icon:"👑",unlockCondition:()=>U>=50,effect:()=>{I.bond*=2},category:"bond",unlocked:!1,purchased:!1},usstock_boost_1:{name:"🇺🇸 S&P 500 투자",desc:"미국주식 수익 2배",cost:5e7,icon:"🇺🇸",unlockCondition:()=>J>=5,effect:()=>{I.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_2:{name:"📈 나스닥 투자",desc:"미국주식 수익 2배",cost:125e6,icon:"📈",unlockCondition:()=>J>=15,effect:()=>{I.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_3:{name:"💎 글로벌 주식 포트폴리오",desc:"미국주식 수익 2배",cost:25e7,icon:"💎",unlockCondition:()=>J>=30,effect:()=>{I.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_4:{name:"🌍 글로벌 대형주",desc:"미국주식 수익 2배",cost:5e8,icon:"🌍",unlockCondition:()=>J>=40,effect:()=>{I.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},usstock_boost_5:{name:"👑 킹 글로벌 주식",desc:"미국주식 수익 2배",cost:1e9,icon:"👑",unlockCondition:()=>J>=50,effect:()=>{I.usStock*=2},category:"usStock",unlocked:!1,purchased:!1},crypto_boost_1:{name:"₿ 비트코인 투자",desc:"코인 수익 2배",cost:2e8,icon:"₿",unlockCondition:()=>z>=5,effect:()=>{I.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_2:{name:"💎 알트코인 포트폴리오",desc:"코인 수익 2배",cost:5e8,icon:"💎",unlockCondition:()=>z>=15,effect:()=>{I.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_3:{name:"🚀 디지털 자산 전문가",desc:"코인 수익 2배",cost:1e9,icon:"🚀",unlockCondition:()=>z>=30,effect:()=>{I.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_4:{name:"🌐 메타버스 자산",desc:"코인 수익 2배",cost:2e9,icon:"🌐",unlockCondition:()=>z>=40,effect:()=>{I.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},crypto_boost_5:{name:"👑 킹 암호화폐",desc:"코인 수익 2배",cost:4e9,icon:"👑",unlockCondition:()=>z>=50,effect:()=>{I.crypto*=2},category:"crypto",unlocked:!1,purchased:!1},villa_boost_1:{name:"🏘️ 빌라 리모델링",desc:"빌라 수익 2배",cost:5e8,icon:"🏘️",unlockCondition:()=>q>=5,effect:()=>{E.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_2:{name:"🌟 럭셔리 빌라",desc:"빌라 수익 2배",cost:125e7,icon:"🌟",unlockCondition:()=>q>=15,effect:()=>{E.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_3:{name:"✨ 프리미엄 빌라 단지",desc:"빌라 수익 2배",cost:25e8,icon:"✨",unlockCondition:()=>q>=30,effect:()=>{E.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_4:{name:"💎 다이아몬드 빌라",desc:"빌라 수익 2배",cost:5e9,icon:"💎",unlockCondition:()=>q>=40,effect:()=>{E.villa*=2},category:"villa",unlocked:!1,purchased:!1},villa_boost_5:{name:"👑 킹 빌라",desc:"빌라 수익 2배",cost:1e10,icon:"👑",unlockCondition:()=>q>=50,effect:()=>{E.villa*=2},category:"villa",unlocked:!1,purchased:!1},officetel_boost_1:{name:"🏢 오피스텔 스마트화",desc:"오피스텔 수익 2배",cost:7e8,icon:"🏢",unlockCondition:()=>H>=5,effect:()=>{E.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_2:{name:"🏙️ 프리미엄 오피스텔",desc:"오피스텔 수익 2배",cost:175e7,icon:"🏙️",unlockCondition:()=>H>=15,effect:()=>{E.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_3:{name:"🌆 럭셔리 오피스텔 타워",desc:"오피스텔 수익 2배",cost:35e8,icon:"🌆",unlockCondition:()=>H>=30,effect:()=>{E.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_4:{name:"💎 다이아몬드 오피스텔",desc:"오피스텔 수익 2배",cost:7e9,icon:"💎",unlockCondition:()=>H>=40,effect:()=>{E.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},officetel_boost_5:{name:"👑 킹 오피스텔",desc:"오피스텔 수익 2배",cost:14e9,icon:"👑",unlockCondition:()=>H>=50,effect:()=>{E.officetel*=2},category:"officetel",unlocked:!1,purchased:!1},apartment_boost_1:{name:"🏡 아파트 프리미엄화",desc:"아파트 수익 2배",cost:16e8,icon:"🏡",unlockCondition:()=>O>=5,effect:()=>{E.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_2:{name:"🏰 타워팰리스급 아파트",desc:"아파트 수익 2배",cost:4e9,icon:"🏰",unlockCondition:()=>O>=15,effect:()=>{E.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_3:{name:"🏛️ 초고급 아파트 단지",desc:"아파트 수익 2배",cost:8e9,icon:"🏛️",unlockCondition:()=>O>=30,effect:()=>{E.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_4:{name:"💎 다이아몬드 아파트",desc:"아파트 수익 2배",cost:16e9,icon:"💎",unlockCondition:()=>O>=40,effect:()=>{E.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},apartment_boost_5:{name:"👑 킹 아파트",desc:"아파트 수익 2배",cost:32e9,icon:"👑",unlockCondition:()=>O>=50,effect:()=>{E.apartment*=2},category:"apartment",unlocked:!1,purchased:!1},shop_boost_1:{name:"🏪 상가 입지 개선",desc:"상가 수익 2배",cost:24e8,icon:"🏪",unlockCondition:()=>K>=5,effect:()=>{E.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_2:{name:"🛍️ 프리미엄 상권",desc:"상가 수익 2배",cost:6e9,icon:"🛍️",unlockCondition:()=>K>=15,effect:()=>{E.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_3:{name:"🏬 메가몰 상권",desc:"상가 수익 2배",cost:12e9,icon:"🏬",unlockCondition:()=>K>=30,effect:()=>{E.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_4:{name:"💎 다이아몬드 상권",desc:"상가 수익 2배",cost:24e9,icon:"💎",unlockCondition:()=>K>=40,effect:()=>{E.shop*=2},category:"shop",unlocked:!1,purchased:!1},shop_boost_5:{name:"👑 킹 상권",desc:"상가 수익 2배",cost:48e9,icon:"👑",unlockCondition:()=>K>=50,effect:()=>{E.shop*=2},category:"shop",unlocked:!1,purchased:!1},building_boost_1:{name:"🏙️ 빌딩 테넌트 확보",desc:"빌딩 수익 2배",cost:6e9,icon:"🏙️",unlockCondition:()=>V>=5,effect:()=>{E.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_2:{name:"💼 랜드마크 빌딩",desc:"빌딩 수익 2배",cost:15e9,icon:"💼",unlockCondition:()=>V>=15,effect:()=>{E.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_3:{name:"🏢 초고층 마천루",desc:"빌딩 수익 2배",cost:3e10,icon:"🏢",unlockCondition:()=>V>=30,effect:()=>{E.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_4:{name:"💎 다이아몬드 빌딩",desc:"빌딩 수익 2배",cost:6e10,icon:"💎",unlockCondition:()=>V>=40,effect:()=>{E.building*=2},category:"building",unlocked:!1,purchased:!1},building_boost_5:{name:"👑 킹 빌딩",desc:"빌딩 수익 2배",cost:12e10,icon:"👑",unlockCondition:()=>V>=50,effect:()=>{E.building*=2},category:"building",unlocked:!1,purchased:!1},rent_multiplier:{name:"📊 부동산 관리 전문화",desc:"모든 부동산 수익 +10%",cost:1e9,icon:"📊",unlockCondition:()=>_t()>=10,effect:()=>{xe*=1.1},category:"global",unlocked:!1,purchased:!1},manager_hire:{name:"👨‍💼 전문 관리인 고용",desc:"전체 임대 수익 +5%",cost:5e9,icon:"👨‍💼",unlockCondition:()=>_t()>=20,effect:()=>{xe*=1.05,Mo++},category:"global",unlocked:!1,purchased:!1},financial_expert:{name:"💼 금융 전문가 고용",desc:"모든 금융 수익 +20%",cost:1e10,icon:"💼",unlockCondition:()=>G>=8,effect:()=>{I.deposit*=1.2,I.savings*=1.2,I.bond*=1.2},category:"global",unlocked:!1,purchased:!1},auto_work_system:{name:"📱 자동 업무 처리 시스템",desc:"1초마다 자동으로 1회 클릭 (초당 수익 추가)",cost:5e9,icon:"📱",unlockCondition:()=>G>=7&&_t()>=10,effect:()=>{Fn=!0},category:"global",unlocked:!1,purchased:!1}};let q=0,H=0,O=0,K=0,V=0,Se=0;const Bo={deposit:!0,savings:!1,bond:!1,villa:!1,officetel:!1,apartment:!1,shop:!1,building:!1,tower:!1},I={deposit:50,savings:750,bond:11250,usStock:6e4,crypto:25e4},E={villa:84380,officetel:177190,apartment:607500,shop:137e4,building:514e4},us={...I},ms={...E};function Ta(){for(const t of Object.keys(us))I[t]=us[t];for(const t of Object.keys(ms))E[t]=ms[t]}function xa(){Ta();for(const t of Object.values(ne)){if(!(t!=null&&t.purchased)||typeof t.effect!="function")continue;const n=Function.prototype.toString.call(t.effect);if(n.includes("FINANCIAL_INCOME")||n.includes("BASE_RENT"))try{t.effect()}catch{}}}let be=1,xe=1,Fn=!1,Mo=0;const gs="capitalClicker_settings";let Le={particles:!0,fancyGraphics:!0,shortNumbers:!1},G=0,st=0;const Et=[{nameKey:"career.alba",multiplier:1,requiredIncome:0,requiredClicks:0,bgImage:fr},{nameKey:"career.contract",multiplier:1.5,requiredIncome:5e6,requiredClicks:100,bgImage:pr},{nameKey:"career.employee",multiplier:2,requiredIncome:1e7,requiredClicks:300,bgImage:yr},{nameKey:"career.assistant",multiplier:2.5,requiredIncome:2e7,requiredClicks:800,bgImage:hr},{nameKey:"career.manager",multiplier:3,requiredIncome:3e7,requiredClicks:1500,bgImage:$r},{nameKey:"career.deputy",multiplier:3.5,requiredIncome:4e7,requiredClicks:2500,bgImage:vr},{nameKey:"career.director",multiplier:4,requiredIncome:5e7,requiredClicks:4e3,bgImage:br},{nameKey:"career.executive",multiplier:5,requiredIncome:7e7,requiredClicks:6e3,bgImage:kr},{nameKey:"career.senior",multiplier:10,requiredIncome:12e7,requiredClicks:9e3,bgImage:Sr},{nameKey:"career.ceo",multiplier:12,requiredIncome:25e7,requiredClicks:15e3,bgImage:Lr}];function zt(t){return t<0||t>=Et.length?"":a(Et[t].nameKey)}function B(t){const s={deposit:"product.deposit",savings:"product.savings",bond:"product.bond",usStock:"product.usStock",crypto:"product.crypto",villa:"property.villa",officetel:"property.officetel",apartment:"property.apartment",shop:"property.shop",building:"property.building",tower:"property.tower"}[t];return s?a(s):t}let fs=1e9,ps=5e9,Un=1,Oe=0,ye=null;const ys=[{name:"강남 아파트 대박",duration:5e4,color:"#4CAF50",effects:{property:{apartment:2.5,villa:1.4,officetel:1.2}},description:"강남 아파트발 상승 랠리로 주거형 부동산 수익이 상승합니다."},{name:"전세 대란",duration:6e4,color:"#2196F3",effects:{property:{villa:2.5,officetel:2.5,apartment:1.8}},description:"전세 수요 급증으로 빌라/오피스텔 중심의 임대 수익이 급등합니다."},{name:"상권 활성화",duration:5e4,color:"#FF9800",effects:{property:{shop:2.5,building:1.6}},description:"상권 회복으로 상가 수익이 크게 증가합니다."},{name:"오피스 수요 급증",duration:55e3,color:"#9C27B0",effects:{property:{building:2.5,shop:1.4,officetel:1.2}},description:"오피스 확장으로 빌딩 중심 수익이 급등합니다."},{name:"한국은행 금리 인하",duration:7e4,color:"#2196F3",effects:{financial:{deposit:.7,savings:.8,bond:2,usStock:1.5}},description:"금리 인하로 예금/적금은 약세, 주식은 강세를 보입니다."},{name:"주식시장 대호황",duration:6e4,color:"#4CAF50",effects:{financial:{bond:2.5,usStock:2,crypto:1.5}},description:"리스크 자산 선호로 주식 중심 수익이 크게 증가합니다."},{name:"미국 연준 양적완화",duration:7e4,color:"#2196F3",effects:{financial:{usStock:2.5,crypto:1.8,bond:1.3}},description:"달러 유동성 확대로 미국주식/코인 수익이 상승합니다."},{name:"비트코인 급등",duration:45e3,color:"#FF9800",effects:{financial:{crypto:2.5,usStock:1.2}},description:"암호화폐 랠리로 코인 수익이 크게 증가합니다."},{name:"금융위기",duration:9e4,color:"#F44336",effects:{financial:{bond:.7,usStock:.7,crypto:.7},property:{shop:.7,building:.7}},description:"리스크 회피로 주식/코인/상업용 부동산이 타격을 받습니다."},{name:"은행 파산 위기",duration:75e3,color:"#9C27B0",effects:{financial:{deposit:.7,savings:.7,bond:.8}},description:"은행 신뢰 하락으로 예금/적금 수익이 둔화합니다."},{name:"주식시장 폭락",duration:75e3,color:"#F44336",effects:{financial:{bond:.7,usStock:.7,crypto:.7}},description:"주식/리스크 자산 급락으로 수익이 크게 감소합니다."},{name:"암호화폐 규제",duration:75e3,color:"#9C27B0",effects:{financial:{crypto:.7}},description:"규제 강화로 코인 수익이 감소합니다."}];let ge=0;const $t=[{id:"first_click",name:"첫 노동",desc:"첫 번째 클릭을 했다",icon:"👆",condition:()=>ge>=1,unlocked:!1},{id:"first_deposit",name:"첫 예금",desc:"첫 번째 예금을 구입했다",icon:"💰",condition:()=>D>=1,unlocked:!1},{id:"first_savings",name:"첫 적금",desc:"첫 번째 적금을 구입했다",icon:"🏦",condition:()=>F>=1,unlocked:!1},{id:"first_bond",name:"첫 국내주식",desc:"첫 번째 국내주식을 구입했다",icon:"📈",condition:()=>U>=1,unlocked:!1},{id:"first_us_stock",name:"첫 미국주식",desc:"첫 번째 미국주식을 구입했다",icon:"🇺🇸",condition:()=>J>=1,unlocked:!1},{id:"first_crypto",name:"첫 코인",desc:"첫 번째 코인을 구입했다",icon:"₿",condition:()=>z>=1,unlocked:!1},{id:"first_property",name:"첫 부동산",desc:"첫 번째 부동산을 구입했다",icon:"🏠",condition:()=>q+H+O+K+V>=1,unlocked:!1},{id:"first_upgrade",name:"첫 업그레이드",desc:"첫 번째 업그레이드를 구입했다",icon:"⚡",condition:()=>Object.values(ne).some(t=>t.purchased),unlocked:!1},{id:"financial_expert",name:"금융 전문가",desc:"모든 금융상품을 보유했다",icon:"💼",condition:()=>D>0&&F>0&&U>0&&J>0&&z>0,unlocked:!1},{id:"property_collector",name:"부동산 수집가",desc:"5채의 부동산을 보유했다",icon:"🏘️",condition:()=>_t()>=5,unlocked:!1},{id:"property_tycoon",name:"부동산 타이쿤",desc:"모든 부동산 종류를 보유했다",icon:"🏙️",condition:()=>q>0&&H>0&&O>0&&K>0&&V>0,unlocked:!1},{id:"investment_guru",name:"투자 고수",desc:"모든 업그레이드를 구입했다",icon:"📊",condition:()=>Object.values(ne).every(t=>t.purchased),unlocked:!1},{id:"gangnam_rich",name:"강남 부자",desc:"강남 부동산 3채를 보유했다",icon:"🏙️",condition:()=>O>=3,unlocked:!1},{id:"global_investor",name:"글로벌 투자자",desc:"해외 투자 1억원을 달성했다",icon:"🌍",condition:()=>J*1e6+z*1e6>=1e8,unlocked:!1},{id:"crypto_expert",name:"암호화폐 전문가",desc:"코인 투자 5억원을 달성했다",icon:"₿",condition:()=>z*1e6>=5e8,unlocked:!1},{id:"real_estate_agent",name:"부동산 중개사",desc:"부동산 20채를 보유했다",icon:"🏠",condition:()=>_t()>=20,unlocked:!1},{id:"millionaire",name:"백만장자",desc:"총 자산 1억원을 달성했다",icon:"💎",condition:()=>S>=1e8,unlocked:!1},{id:"ten_millionaire",name:"억만장자",desc:"총 자산 10억원을 달성했다",icon:"💰",condition:()=>S>=1e9,unlocked:!1},{id:"hundred_millionaire",name:"부자",desc:"총 자산 100억원을 달성했다",icon:"🏆",condition:()=>S>=1e10,unlocked:!1},{id:"billionaire",name:"대부호",desc:"총 자산 1,000억원을 달성했다",icon:"👑",condition:()=>S>=1e11,unlocked:!1},{id:"trillionaire",name:"재벌",desc:"총 자산 1조원을 달성했다",icon:"🏰",condition:()=>S>=1e12,unlocked:!1},{id:"global_rich",name:"세계적 부자",desc:"총 자산 10조원을 달성했다",icon:"🌍",condition:()=>S>=1e13,unlocked:!1},{id:"legendary_rich",name:"전설의 부자",desc:"총 자산 100조원을 달성했다",icon:"⭐",condition:()=>S>=1e14,unlocked:!1},{id:"god_rich",name:"신의 부자",desc:"총 자산 1,000조원을 달성했다",icon:"✨",condition:()=>S>=1e15,unlocked:!1},{id:"career_starter",name:"직장인",desc:"계약직으로 승진했다",icon:"👔",condition:()=>G>=1,unlocked:!1},{id:"employee",name:"정규직",desc:"사원으로 승진했다",icon:"👨‍💼",condition:()=>G>=2,unlocked:!1},{id:"deputy_director",name:"팀장",desc:"과장으로 승진했다",icon:"👨‍💻",condition:()=>G>=4,unlocked:!1},{id:"executive",name:"임원",desc:"상무로 승진했다",icon:"👨‍🎓",condition:()=>G>=7,unlocked:!1},{id:"ceo",name:"CEO",desc:"CEO가 되었다",icon:"👑",condition:()=>G>=9,unlocked:!1},{id:"chaebol_chairman",name:"재벌 회장",desc:"자산 1조원을 달성했다",icon:"🏆",condition:()=>S>=1e12,unlocked:!1},{id:"global_ceo",name:"글로벌 CEO",desc:"해외 진출을 달성했다",icon:"🌍",condition:()=>J>=10&&z>=10,unlocked:!1},{id:"legendary_ceo",name:"전설의 CEO",desc:"모든 목표를 달성했다",icon:"⭐",condition:()=>G>=9&&S>=1e14,unlocked:!1}],Ba=document.getElementById("cash"),Ma=document.getElementById("financial"),Pa=document.getElementById("properties"),Aa=document.getElementById("rps"),wt=document.getElementById("workBtn"),Ce=document.querySelector(".work"),Ra=document.getElementById("log"),hs=document.getElementById("shareBtn"),$s=document.getElementById("favoriteBtn"),Fa=document.getElementById("clickIncomeButton");document.getElementById("clickIncomeLabel");const Ua=document.getElementById("clickMultiplier"),Da=document.getElementById("rentMultiplier"),vt=document.getElementById("gameModalRoot"),at=document.getElementById("gameModalTitle"),it=document.getElementById("gameModalMessage"),Be=document.getElementById("gameModalPrimary"),we=document.getElementById("gameModalSecondary"),vs=document.getElementById("depositCount");document.getElementById("incomePerDeposit");const Yt=document.getElementById("buyDeposit"),bs=document.getElementById("savingsCount"),Na=document.getElementById("incomePerSavings"),Jt=document.getElementById("buySavings"),ks=document.getElementById("bondCount"),Oa=document.getElementById("incomePerBond"),Qt=document.getElementById("buyBond");document.getElementById("usStockCount"),document.getElementById("incomePerUsStock");const Xt=document.getElementById("buyUsStock");document.getElementById("cryptoCount"),document.getElementById("incomePerCrypto");const Zt=document.getElementById("buyCrypto"),Po=document.getElementById("buyMode"),Ao=document.getElementById("sellMode"),Dn=document.getElementById("qty1"),Nn=document.getElementById("qty5"),On=document.getElementById("qty10"),en=document.getElementById("toggleUpgrades"),tn=document.getElementById("toggleFinancial"),nn=document.getElementById("toggleProperties"),Ss=document.getElementById("saveStatus"),Ls=document.getElementById("resetBtn"),Cs=document.getElementById("depositCurrentPrice"),qa=document.getElementById("savingsCurrentPrice"),Ha=document.getElementById("bondCurrentPrice"),Ka=document.getElementById("villaCurrentPrice"),Va=document.getElementById("officetelCurrentPrice"),Ga=document.getElementById("aptCurrentPrice"),Wa=document.getElementById("shopCurrentPrice"),ja=document.getElementById("buildingCurrentPrice"),za=document.getElementById("villaCount"),Ya=document.getElementById("rentPerVilla"),on=document.getElementById("buyVilla"),Ja=document.getElementById("officetelCount"),Qa=document.getElementById("rentPerOfficetel"),sn=document.getElementById("buyOfficetel"),Xa=document.getElementById("aptCount"),Za=document.getElementById("rentPerApt"),an=document.getElementById("buyApt"),ei=document.getElementById("shopCount"),ti=document.getElementById("rentPerShop"),rn=document.getElementById("buyShop"),ni=document.getElementById("buildingCount"),oi=document.getElementById("rentPerBuilding"),cn=document.getElementById("buyBuilding"),Is=document.getElementById("towerCountDisplay"),Es=document.getElementById("towerCountBadge"),ws=document.getElementById("towerCurrentPrice"),Mt=document.getElementById("buyTower"),si=document.getElementById("currentCareer");document.getElementById("careerCost");const Pt=document.getElementById("careerProgress"),_s=document.getElementById("careerProgressText"),ln=document.getElementById("careerRemaining");function _(t){if(["🧪","v2.","v3.","Cookie Clicker","업그레이드 시스템","DOM 참조","성능 최적화","자동 저장 시스템","업그레이드 클릭","커리어 진행률","구현 완료","수정 완료","정상화","작동 중","활성화","해결","버그 수정","최적화","개편","벤치마킹"].some(y=>t.includes(y)))return;const i=y=>String(y).padStart(2,"0"),r=new Date,c=`${i(r.getHours())}:${i(r.getMinutes())}`;function l(){const y=r.getFullYear(),p=i(r.getMonth()+1),M=i(r.getDate()),j=typeof ht<"u"&&ht?ht:Fe,de=Math.max(1,Math.floor((Date.now()-j)/864e5)+1),N=document.getElementById("diaryHeaderMeta");N&&(N.textContent=`${y}.${p}.${M}(${a("ui.dayCount",{days:de})})`);const ee=document.getElementById("diaryMetaDate"),ce=document.getElementById("diaryMetaDay");ee&&(ee.textContent=a("ui.today",{date:`${y}.${p}.${M}`})),ce&&(ce.textContent=a("ui.dayCount",{days:de}))}function d(y){var Pe,kt,ct,lt,dt,ut,xt,Ve;const p=String(y||"").trim();if(new RegExp(a("msg.nextUpgradeHint",{remaining:"\\d+",name:".*"}).replace(/\{remaining\}/g,"\\d+").replace(/\{name\}/g,".*"),"i").test(p)||/다음\s*업그레이드/.test(p)&&/클릭\s*남/.test(p))return"";const j=e=>e.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/g,"").trim(),de=e=>Math.floor(Math.random()*e),N=(e,o)=>{if(!Array.isArray(o)||o.length===0)return"";const L=`__diaryLastPick_${e}`,A=window[L];let ke=de(o.length);return o.length>1&&typeof A=="number"&&ke===A&&(ke=(ke+1+de(o.length-1))%o.length),window[L]=ke,o[ke]},ee=e=>j(e).replace(/\s+/g," ").trim();if(a("msg.achievementUnlocked",{name:"",desc:""}).split(":")[0]+"",p.startsWith("🏆")&&(p.includes("업적 달성:")||p.includes("Achievement Unlocked:"))){const e=j(p).replace(/^(업적 달성|Achievement Unlocked):\s*/i,""),[o,L]=e.split(/\s*-\s*/);return N("achievement",[`오늘은 체크 하나를 더했다. (${o||"업적"})`,`작게나마 성취. ${o||"업적"}라니, 나도 꽤 한다.`,`기록해둔다: ${o||"업적"}.
${L||""}`.trim(),`"${o||"업적"}" 달성.
${L?`메모: ${L}`:""}`.trim(),`별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. (${o||"업적"})`,`또 하나의 마일스톤. ${o||"업적"}.
${L||""}`.trim(),`작은 성취도 성취다. ${o||"업적"}.
${L||""}`.trim(),`하루하루가 쌓인다. 오늘은 ${o||"업적"}.
${L||""}`.trim(),`기록에 하나 더. ${o||"업적"}.
${L||""}`.trim(),`뿌듯함이 조금씩. ${o||"업적"} 달성.
${L||""}`.trim(),`이런 게 인생이지. ${o||"업적"}.
${L||""}`.trim(),`작은 발걸음이 모여 길이 된다. ${o||"업적"}.
${L||""}`.trim()])}const ce=Q()==="en"?/🎉\s*(.+?)\s+promoted!?(\s*\(.*\))?/i:/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/;if(p.startsWith("🎉")&&(p.includes("승진했습니다")||/promoted/i.test(p))){const e=p.match(ce),o=(Pe=e==null?void 0:e[1])==null?void 0:Pe.trim(),L=(kt=e==null?void 0:e[2])==null?void 0:kt.trim(),A=L?L.replace(/[()]/g,"").trim():"";return N("promotion",[`명함이 바뀌었다. ${o||"다음 단계"}.
${A}`.trim(),`오늘은 좀 뿌듯하다. ${o||"승진"}이라니.
${A}`.trim(),`승진했다. 책임도 같이 딸려온다는데… 일단 축하부터.
${A}`.trim(),`그래, 나도 올라갈 줄 안다. ${o||"승진"}.
${A}`.trim(),`커피가 조금 더 쓰게 느껴진다. ${o||"승진"}의 맛.
${A}`.trim(),`한 단계 올라섰다. ${o||"승진"}.
${A}`.trim(),`노력이 보상받는 순간. ${o||"승진"}.
${A}`.trim(),`새로운 시작. ${o||"승진"}.
${A}`.trim(),`더 높은 곳에서 보는 풍경이 다르다. ${o||"승진"}.
${A}`.trim(),`자리도 바뀌고 마음도 바뀐다. ${o||"승진"}.
${A}`.trim(),`이제야 진짜 시작인가. ${o||"승진"}.
${A}`.trim(),`무게감이 느껴진다. ${o||"승진"}의 무게.
${A}`.trim()])}const Me=Q()==="en"?/^🔓\s*(.+?)\s+unlocked/i:/^🔓\s*(.+?)이\s*해금/;if(p.startsWith("🔓")){const e=ee(p),o=p.match(Me),L=((o==null?void 0:o[1])||"").trim(),A={적금:[`자동이체 버튼이 눈에 들어왔다.
${e}`,`천천히 쌓는 쪽으로 방향을 틀었다.
${e}`,`오늘은 '루틴'이 열렸다.
${e}`,`꾸준함의 길이 열렸다.
${e}`,`작은 투자의 문이 열렸다.
${e}`,`시간이 내 편이 되는 선택지.
${e}`,`루틴 투자의 시작.
${e}`,`매일의 습관이 가능해졌다.
${e}`,`인내심의 투자가 열렸다.
${e}`,`작은 것들이 모이는 길.
${e}`],국내주식:[`이제 차트랑 뉴스랑 싸울 차례다.
${e}`,`심장이 약하면 못 할 선택지… 열렸다.
${e}`,`변동성의 문이 열렸다.
${e}`,`국장의 세계로 입문.
${e}`,`차트의 파도를 탈 수 있다.
${e}`,`투자자의 길이 열렸다.
${e}`,`변동성에 도전할 수 있다.
${e}`,`국장의 심장박동을 느낄 수 있다.
${e}`,`위험과 기회의 문.
${e}`,`국장 투자의 시작.
${e}`],미국주식:[`시차를 버티는 돈이 열렸다.
${e}`,`달러 냄새가 난다.
${e}`,`밤샘의 선택지… 드디어.
${e}`,`글로벌 투자의 문이 열렸다.
${e}`,`세계 시장에 발을 담글 수 있다.
${e}`,`미장의 파도를 탈 수 있다.
${e}`,`달러의 무게를 느낄 수 있다.
${e}`,`시차의 스트레스를 견딜 수 있다.
${e}`,`환율의 변동을 경험할 수 있다.
${e}`,`미장 투자의 시작.
${e}`],코인:[`롤러코스터 입장권이 생겼다.
${e}`,`FOMO가 문을 두드린다.
${e}`,`폭등/폭락의 세계가 열렸다.
${e}`,`변동성의 극치를 경험할 수 있다.
${e}`,`멘탈이 시험받는 투자.
${e}`,`코인판의 무게를 견딜 수 있다.
${e}`,`FOMO와 공포 사이의 선택.
${e}`,`디지털 자산의 세계.
${e}`,`심장이 먼저 반응하는 투자.
${e}`,`롤러코스터의 정점에 설 수 있다.
${e}`],빌라:[`첫 '집'이라는 단어가 현실이 됐다.
${e}`,`작아도 내 편이 하나 생긴 기분.
${e}`,`부동산 투자의 첫걸음.
${e}`,`집이라는 단어가 현실이 됐다.
${e}`,`내 공간을 가질 수 있다.
${e}`,`작은 집도 집이다.
${e}`,`부동산의 세계로 입문.
${e}`,`첫 집의 무게감을 느낄 수 있다.
${e}`,`내 이름으로 등기할 수 있다.
${e}`,`부동산 투자의 시작.
${e}`],오피스텔:[`출근 동선이 머리에 그려졌다.
${e}`,`현실적인 선택지가 열렸다.
${e}`,`실용적인 투자가 가능해졌다.
${e}`,`생활의 편의를 살 수 있다.
${e}`,`도시 생활의 현실을 경험할 수 있다.
${e}`,`작은 공간, 큰 만족의 선택.
${e}`,`실용주의의 투자.
${e}`,`생활의 질을 올릴 수 있다.
${e}`,`현실적인 부동산 투자.
${e}`,`도시 생활의 편의를 살 수 있다.
${e}`],아파트:[`꿈이 조금 현실 쪽으로 다가왔다.
${e}`,`안정의 상징이 열렸다.
${e}`,`한국인의 꿈을 살 수 있다.
${e}`,`부동산 투자의 정점.
${e}`,`아파트의 무게감을 느낄 수 있다.
${e}`,`꿈이 현실이 되는 순간.
${e}`,`안정적인 투자가 가능해졌다.
${e}`,`부동산의 대표주자를 살 수 있다.
${e}`,`가치가 보장되는 선택.
${e}`,`한국 사회의 상징을 살 수 있다.
${e}`],상가:[`유동인구라는 단어가 갑자기 무겁다.
${e}`,`장사 잘되길… 진심으로.
${e}`,`상권의 힘을 믿을 수 있다.
${e}`,`유동인구가 내 수익이 될 수 있다.
${e}`,`상권 투자의 묘미를 느낄 수 있다.
${e}`,`임대 수익의 달콤함을 경험할 수 있다.
${e}`,`상가의 가치를 알아볼 수 있다.
${e}`,`상권의 파도를 탈 수 있다.
${e}`,`임차인의 성공이 내 성공이 될 수 있다.
${e}`,`상가 투자의 리스크를 감수할 수 있다.
${e}`],빌딩:[`스카이라인에 욕심이 생겼다.
${e}`,`이제 진짜 '엔드게임' 냄새.
${e}`,`부동산 투자의 정점.
${e}`,`스카이라인의 주인이 될 수 있다.
${e}`,`도시의 한 조각을 소유할 수 있다.
${e}`,`빌딩의 무게감을 느낄 수 있다.
${e}`,`부동산 투자의 완성.
${e}`,`도시의 심장부를 살 수 있다.
${e}`,`스카이라인에 내 이름을 올릴 수 있다.
${e}`,`부동산 투자의 궁극.
${e}`]};return L&&A[L]?N(`unlock_${L}`,A[L]):N("unlock",[`문이 하나 열렸다.
${e}`,`다음 장으로 넘어갈 수 있게 됐다.
${e}`,`아직 초반인데도, 벌써 선택지가 늘었다.
${e}`,`드디어. ${e}`,`새로운 가능성이 열렸다.
${e}`,`선택지가 하나 더 생겼다.
${e}`,`다음 단계로 나아갈 수 있다.
${e}`,`기회의 문이 열렸다.
${e}`,`새로운 길이 보인다.
${e}`,`진행의 길이 열렸다.
${e}`])}if(p.startsWith("💸 자금이 부족합니다")){const e=ee(p);return N("noMoney",[`지갑이 얇아서 아무것도 못 했다.
${e}`,`현실 체크. 돈이 없다.
${e}`,`오늘은 참는다. 아직은 무리.
${e}`,`계산기만 두드리고 끝.
${e}`,`통장 잔고가 거짓말을 한다.
${e}`,`돈이 부족하다는 건 늘 아프다.
${e}`,`다시 모아야 한다. 조금 더.
${e}`,`욕심을 접어야 할 때.
${e}`,`현실이 무겁다.
${e}`,`내일을 기다려야 한다.
${e}`])}if(p.startsWith("✅")&&(p.includes("구입했습니다")||/purchased/i.test(p))){const e=ee(p),o=p.match(/^✅\s*(.+?)\s+\d/),L=((o==null?void 0:o[1])||"").trim(),A={예금:[`일단은 안전한 데에 묶어두자.
${e}`,`불안할 땐 예금이 답이다.
${e}`,`통장에 '쿠션'을 하나 깔았다.
${e}`,`안전함이 최고의 수익률.
${e}`,`무엇보다도 평온함.
${e}`,`돈이 잠들어 있는 게 나쁘지 않다.
${e}`,`은행이 내 편이 되는 순간.
${e}`,`위험은 내일로 미뤄두자.
${e}`,`조용히 쌓이는 게 좋다.
${e}`,`불안할 때는 이게 최선.
${e}`,`돈이 안전하게 지켜지는 느낌.
${e}`,`위험 없는 선택.
${e}`],적금:[`루틴을 샀다. 매일이 쌓이면 언젠가.
${e}`,`천천히, 꾸준히. 적금은 배신을 덜 한다.
${e}`,`버티기 모드 ON.
${e}`,`작은 것들이 모여 큰 것이 된다.
${e}`,`매일의 습관이 미래를 만든다.
${e}`,`꾸준함이 무기다.
${e}`,`서두르지 않고 천천히.
${e}`,`시간이 내 편이 되는 느낌.
${e}`,`작은 투자가 큰 결과를 만든다.
${e}`,`루틴의 힘을 믿는다.
${e}`,`매일 조금씩, 그게 전부다.
${e}`,`인내심이 필요한 투자.
${e}`],국내주식:[`차트가 나를 보더니 웃는 것 같았다.
${e}`,`기대 반, 긴장 반.
${e}`,`뉴스 알람을 켜야 할 것 같다.
${e}`,`변동성의 바다에 뛰어든다.
${e}`,`심장이 뛰는 투자.
${e}`,`국장의 파도를 타본다.
${e}`,`위험과 기회가 공존한다.
${e}`,`차트 한 줄에 모든 게 달렸다.
${e}`,`투자자의 길을 걷는다.
${e}`,`시장의 심장박동을 느낀다.
${e}`,`변동성에 내 심장도 같이 흔들린다.
${e}`,`국장의 무게를 견뎌본다.
${e}`],미국주식:[`달러 환율부터 떠올랐다.
${e}`,`밤에 울리는 알림을 각오했다.
${e}`,`세계로 한 걸음.
${e}`,`시차를 극복하는 투자.
${e}`,`미장의 파도를 타본다.
${e}`,`달러의 무게를 느낀다.
${e}`,`세계 시장에 발을 담근다.
${e}`,`밤샘의 대가를 치른다.
${e}`,`환율이 내 수익을 좌우한다.
${e}`,`글로벌 투자자의 길.
${e}`,`시차 때문에 잠을 설친다.
${e}`,`미장의 리듬에 맞춘다.
${e}`],코인:[`심장 단단히 붙잡고 탔다.
${e}`,`오늘은 FOMO가 이겼다.
${e}`,`롤러코스터에 표를 끊었다.
${e}`,`폭등과 폭락 사이에서 줄타기.
${e}`,`멘탈이 시험받는 투자.
${e}`,`변동성의 극치를 경험한다.
${e}`,`코인판의 무게를 견뎌본다.
${e}`,`FOMO와 공포 사이에서.
${e}`,`디지털 자산의 세계.
${e}`,`심장이 먼저 반응한다.
${e}`,`롤러코스터의 정점에 서 있다.
${e}`,`위험을 감수하는 선택.
${e}`],빌라:[`작아도 시작은 시작이다.
${e}`,`첫 집 느낌… 마음이 조금 놓였다.
${e}`,`벽지 냄새를 상상했다.
${e}`,`첫 부동산. 작지만 소중하다.
${e}`,`집이라는 단어가 현실이 됐다.
${e}`,`내 공간이 생겼다.
${e}`,`작은 집도 집이다.
${e}`,`부동산 투자의 첫걸음.
${e}`,`작은 시작이 큰 결과를 만든다.
${e}`,`첫 집의 무게감.
${e}`,`내 이름으로 등기되는 순간.
${e}`,`부동산의 세계에 입문했다.
${e}`],오피스텔:[`현실적인 선택을 했다.
${e}`,`출근길이 짧아지는 상상을 했다.
${e}`,`관리비 생각은 내일 하자.
${e}`,`실용적인 투자.
${e}`,`출근 동선이 머리에 그려진다.
${e}`,`현실과 이상의 절충.
${e}`,`생활의 편의를 샀다.
${e}`,`도시 생활의 현실.
${e}`,`작은 공간, 큰 만족.
${e}`,`실용주의의 승리.
${e}`,`생활의 질이 올라간다.
${e}`,`현실적인 부동산 투자.
${e}`],아파트:[`꿈이 조금 더 선명해졌다.
${e}`,`안정의 상징을 손에 쥐었다.
${e}`,`괜히 뿌듯하다.
${e}`,`한국인의 꿈을 샀다.
${e}`,`안정의 상징을 손에 쥐었다.
${e}`,`부동산 투자의 정점.
${e}`,`아파트의 무게감.
${e}`,`꿈이 현실이 되는 순간.
${e}`,`안정적인 투자.
${e}`,`부동산의 대표주자.
${e}`,`가치가 보장되는 선택.
${e}`,`한국 사회의 상징.
${e}`],상가:[`유동인구가 돈이 되는 세계.
${e}`,`임차인 운이 따라주길.
${e}`,`간판 불빛을 상상했다.
${e}`,`상권의 힘을 믿는다.
${e}`,`유동인구가 내 수익이다.
${e}`,`상권 투자의 묘미.
${e}`,`임대 수익의 달콤함.
${e}`,`상가의 가치를 알아본다.
${e}`,`유동인구가 곧 돈이다.
${e}`,`상권의 파도를 타본다.
${e}`,`임차인의 성공이 내 성공.
${e}`,`상가 투자의 리스크.
${e}`],빌딩:[`스카이라인을 한 조각 샀다.
${e}`,`이건… 진짜 끝판왕 느낌이다.
${e}`,`도시가 내 편인 것 같았다.
${e}`,`부동산 투자의 정점.
${e}`,`스카이라인의 주인.
${e}`,`도시의 한 조각을 소유한다.
${e}`,`빌딩의 무게감.
${e}`,`부동산 투자의 완성.
${e}`,`도시의 심장부를 샀다.
${e}`,`스카이라인에 내 이름이.
${e}`,`부동산 투자의 궁극.
${e}`,`도시의 한 부분이 내 것이다.
${e}`]};return L&&A[L]?N(`buy_${L}`,A[L]):N("buy",[`결심하고 질렀다.
${e}`,`통장 잔고가 줄어들었다. 대신 미래를 샀다.
${e}`,`이건 소비가 아니라 투자라고… 스스로에게 말했다.
${e}`,`한 발 더 나아갔다.
${e}`,`손이 먼저 움직였다.
${e}`,`투자의 길을 걷는다.
${e}`,`미래를 위한 선택.
${e}`,`돈이 돈을 버는 구조.
${e}`,`자산을 늘리는 순간.
${e}`,`투자자의 마음가짐.
${e}`])}if(p.startsWith("💰")&&p.includes("판매했습니다")){const e=ee(p),o=p.match(/^💰\s*(.+?)\s+\d/),L=((o==null?void 0:o[1])||"").trim(),A={코인:[`손이 떨리기 전에 내렸다.
${e}`,`욕심을 접었다. 오늘은 이쯤.
${e}`,`살아남는 게 먼저다.
${e}`,`FOMO를 이겨냈다.
${e}`,`멘탈을 지키기 위해 내렸다.
${e}`,`롤러코스터에서 내렸다.
${e}`,`변동성에서 벗어났다.
${e}`,`손절의 아픔을 견뎌낸다.
${e}`,`코인판에서 살아남았다.
${e}`,`위험에서 벗어났다.
${e}`],국내주식:[`수익이든 손절이든, 결론은 냈다.
${e}`,`차트와 잠깐 이별.
${e}`,`정리하고 숨 돌린다.
${e}`,`국장의 파도에서 벗어났다.
${e}`,`차트의 무게에서 해방.
${e}`,`투자 포지션을 정리했다.
${e}`,`변동성에서 벗어났다.
${e}`,`국장의 스트레스에서 해방.
${e}`,`정리하고 다음 기회를 본다.
${e}`,`차트와의 관계를 정리했다.
${e}`],미국주식:[`시차도 같이 정리했다.
${e}`,`달러 생각은 잠시 접는다.
${e}`,`잠깐 쉬어가기로 했다.
${e}`,`미장의 밤샘에서 벗어났다.
${e}`,`시차의 스트레스에서 해방.
${e}`,`달러의 무게에서 벗어났다.
${e}`,`미장 투자를 정리했다.
${e}`,`글로벌 투자에서 잠시 휴식.
${e}`,`환율 걱정을 접었다.
${e}`,`미장의 리듬에서 벗어났다.
${e}`],예금:[`안전벨트를 풀었다.
${e}`,`현금이 필요했다.
${e}`,`안전함에서 벗어났다.
${e}`,`예금의 안정성을 포기했다.
${e}`,`현금화의 선택.
${e}`,`안전한 곳에서 돈을 꺼냈다.
${e}`,`예금의 편안함을 잃었다.
${e}`,`현금이 필요해 정리했다.
${e}`,`안전한 투자에서 벗어났다.
${e}`,`예금의 쿠션을 제거했다.
${e}`],적금:[`꾸준함을 잠깐 멈췄다.
${e}`,`루틴을 깼다. 사정이 있었다.
${e}`,`적금의 루틴을 중단했다.
${e}`,`꾸준함을 포기했다.
${e}`,`루틴의 힘을 잃었다.
${e}`,`적금의 안정성을 포기.
${e}`,`매일의 습관을 깼다.
${e}`,`적금의 꾸준함을 중단.
${e}`,`루틴 투자에서 벗어났다.
${e}`,`적금의 시간을 포기했다.
${e}`],빌라:[`정든 것과 이별.
${e}`,`현실적으로 정리했다.
${e}`,`첫 집과 작별.
${e}`,`부동산 투자를 정리했다.
${e}`,`작은 집을 내려놨다.
${e}`,`첫 부동산과 이별.
${e}`,`집의 무게에서 벗어났다.
${e}`,`부동산의 첫걸음을 정리.
${e}`,`작은 집을 포기했다.
${e}`,`첫 집의 추억을 정리.
${e}`],오피스텔:[`동선은 이제 안녕.
${e}`,`정리하고 다음으로.
${e}`,`실용적인 투자를 정리.
${e}`,`출근 동선의 편의를 포기.
${e}`,`현실적인 선택을 정리.
${e}`,`오피스텔의 실용성을 포기.
${e}`,`생활의 편의를 잃었다.
${e}`,`도시 생활의 현실을 정리.
${e}`,`작은 공간을 내려놨다.
${e}`,`현실적인 투자를 정리.
${e}`],아파트:[`꿈을 잠시 내려놓았다.
${e}`,`정리했다. 마음이 좀 쓰다.
${e}`,`한국인의 꿈을 포기.
${e}`,`안정의 상징을 내려놨다.
${e}`,`부동산 투자를 정리.
${e}`,`아파트의 무게에서 벗어났다.
${e}`,`꿈이 현실에서 멀어졌다.
${e}`,`안정적인 투자를 포기.
${e}`,`부동산의 대표주자를 정리.
${e}`,`가치 보장을 포기했다.
${e}`],상가:[`임차인 걱정이 덜었다.
${e}`,`상권이란 게 참…
${e}`,`유동인구의 기회를 포기.
${e}`,`상권 투자를 정리했다.
${e}`,`임대 수익의 달콤함을 포기.
${e}`,`상가의 가치를 내려놨다.
${e}`,`유동인구의 수익을 포기.
${e}`,`상권의 파도에서 벗어났다.
${e}`,`임차인의 성공을 포기.
${e}`,`상가 투자의 리스크를 정리.
${e}`],빌딩:[`도시 한 조각을 내려놨다.
${e}`,`정리했다. 다시 올라가면 된다.
${e}`,`부동산 투자의 정점을 포기.
${e}`,`스카이라인의 주인을 내려놨다.
${e}`,`도시의 한 조각을 포기.
${e}`,`빌딩의 무게에서 벗어났다.
${e}`,`부동산 투자의 완성을 정리.
${e}`,`도시의 심장부를 포기.
${e}`,`스카이라인에서 내 이름을 지웠다.
${e}`,`부동산 투자의 궁극을 정리.
${e}`]};return L&&A[L]?N(`sell_${L}`,A[L]):N("sell",[`정리할 건 정리했다.
${e}`,`가끔은 줄여야 산다.
${e}`,`현금이 필요했다. 그래서 팔았다.
${e}`,`미련은 접어두고 정리.
${e}`,`투자 포지션을 정리했다.
${e}`,`현금화의 선택.
${e}`,`자산을 정리하는 순간.
${e}`,`투자에서 벗어났다.
${e}`,`정리하고 다음 기회를 본다.
${e}`,`미련 없이 정리했다.
${e}`])}if(p.startsWith("❌")){const e=ee(p);return N("fail",[`오늘은 뜻대로 안 됐다.
${e}`,`계획은 늘 계획대로 안 된다.
${e}`,`한 번 더. 다음엔 될 거다.
${e}`,`벽에 부딪혔다.
${e}`,`실패는 또 다른 시작.
${e}`,`좌절은 잠시뿐.
${e}`,`다시 일어서야 한다.
${e}`,`실패도 경험이다.
${e}`,`다음 기회를 기다린다.
${e}`,`실패에서 배운다.
${e}`])}if(p.startsWith("📈")&&p.includes("발생")){const e=ee(p),o=(lt=(ct=p.match(/^📈\s*(.+?)\s*발생/))==null?void 0:ct[1])==null?void 0:lt.trim(),A=(((ut=(dt=p.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))==null?void 0:dt[1])==null?void 0:ut.trim())||o||"").trim(),pe=(Ue=>{const Ge=String(Ue||""),te=[["빌딩","빌딩"],["상가","상가"],["아파트","아파트"],["오피스텔","오피스텔"],["빌라","빌라"],["코인","코인"],["암호","코인"],["크립토","코인"],["₿","코인"],["미국","미국주식"],["🇺🇸","미국주식"],["달러","미국주식"],["주식","국내주식"],["코스피","국내주식"],["코스닥","국내주식"],["적금","적금"],["예금","예금"],["노동","노동"],["클릭","노동"],["업무","노동"]];for(const[qt,mt]of te)if(Ge.includes(qt))return mt;return""})(`${A} ${e}`)||"시장";window.__diaryLastMarketProduct=pe,window.__diaryLastMarketName=A||e;const u={예금:[`예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.
${e}`,`안정은 조용히 돈을 번다. 오늘도 예금은 예금했다.
${e}`,`예금은 변하지 않는다. 그게 장점.
${e}`,`안정적인 투자는 조용하다.
${e}`,`예금의 평온함이 느껴진다.
${e}`,`변동성 없는 투자의 편안함.
${e}`,`예금은 늘 그 자리다.
${e}`,`안전함의 가치를 느낀다.
${e}`,`예금의 조용한 수익.
${e}`,`변동 없는 투자의 평온.
${e}`],적금:[`루틴이 흔들리는 날이 있다. 그래도 적금은 적금.
${e}`,`꾸준함의 세계에도 이벤트는 온다.
${e}`,`적금의 루틴이 흔들린다.
${e}`,`꾸준함에도 변화가 있다.
${e}`,`적금의 안정성이 시험받는다.
${e}`,`루틴 투자의 변동.
${e}`,`매일의 습관이 흔들린다.
${e}`,`적금의 꾸준함이 시험받는다.
${e}`,`시간이 만드는 투자의 변화.
${e}`,`적금의 루틴이 바뀐다.
${e}`],국내주식:[`차트가 또 날 시험한다.
${e}`,`뉴스 한 줄에 심장이 먼저 반응했다.
${e}`,`국장답게… 오늘도 변동성.
${e}`,`국장의 파도가 높아진다.
${e}`,`차트의 심장박동이 빨라진다.
${e}`,`국장의 변동성이 극대화된다.
${e}`,`뉴스 한 줄이 모든 걸 바꾼다.
${e}`,`국장의 무게가 느껴진다.
${e}`,`차트의 파도를 타야 한다.
${e}`,`국장 투자의 리스크가 커진다.
${e}`],미국주식:[`시차가 오늘따라 더 길게 느껴진다.
${e}`,`달러랑 감정은 분리… 하자.
${e}`,`미장 이벤트는 밤에 더 크게 들린다.
${e}`,`미장의 파도가 높아진다.
${e}`,`시차의 스트레스가 커진다.
${e}`,`달러의 무게가 느껴진다.
${e}`,`미장의 리듬이 바뀐다.
${e}`,`환율의 변동이 심해진다.
${e}`,`밤샘의 대가가 커진다.
${e}`,`글로벌 투자의 무게.
${e}`],코인:[`멘탈이 먼저 흔들린다. 코인은 늘 그렇다.
${e}`,`롤러코스터가 출발했다.
${e}`,`FOMO랑 손절 사이에서 줄타기.
${e}`,`코인판의 파도가 거세진다.
${e}`,`변동성의 극치를 경험한다.
${e}`,`멘탈이 시험받는 순간.
${e}`,`FOMO와 공포 사이에서.
${e}`,`롤러코스터의 정점에 서 있다.
${e}`,`코인판의 무게가 느껴진다.
${e}`,`위험을 감수하는 투자의 극치.
${e}`],빌라:[`동네 분위기가 바뀌면 빌라도 숨을 쉰다.
${e}`,`작은 집도 결국은 시장을 탄다.
${e}`,`부동산 시장의 파도가 느껴진다.
${e}`,`작은 집도 시장의 영향을 받는다.
${e}`,`부동산 투자의 변동성.
${e}`,`동네 분위기의 변화.
${e}`,`작은 집의 가치가 흔들린다.
${e}`,`부동산 시장의 리듬.
${e}`,`첫 집의 무게감이 느껴진다.
${e}`,`부동산 투자의 리스크.
${e}`],오피스텔:[`현실의 수요가 움직이는 소리가 난다.
${e}`,`출근 동선이 바뀌면 월세도 같이 흔들린다.
${e}`,`실용적인 투자도 시장의 영향을 받는다.
${e}`,`생활의 편의가 시장에 좌우된다.
${e}`,`도시 생활의 현실이 바뀐다.
${e}`,`오피스텔의 가치가 흔들린다.
${e}`,`현실적인 투자의 변동성.
${e}`,`생활의 질이 시장에 좌우된다.
${e}`,`실용주의 투자의 리스크.
${e}`,`도시 생활의 현실이 느껴진다.
${e}`],아파트:[`아파트는 '상징'이라더니, 이벤트도 상징처럼 크게 온다.
${e}`,`꿈이 흔들릴 때가 있다.
${e}`,`한국인의 꿈이 시장에 좌우된다.
${e}`,`안정의 상징이 흔들린다.
${e}`,`부동산 투자의 정점이 시험받는다.
${e}`,`아파트의 무게감이 느껴진다.
${e}`,`꿈이 현실에서 멀어질 수 있다.
${e}`,`안정적인 투자도 변동한다.
${e}`,`부동산의 대표주자가 흔들린다.
${e}`,`가치 보장이 시장에 좌우된다.
${e}`],상가:[`유동인구라는 말이 오늘은 무겁다.
${e}`,`장사라는 건 결국 파도 타기.
${e}`,`상권의 힘이 시장에 좌우된다.
${e}`,`유동인구의 수익이 변동한다.
${e}`,`상권 투자의 묘미와 리스크.
${e}`,`임대 수익의 달콤함과 쓴맛.
${e}`,`상가의 가치가 흔들린다.
${e}`,`상권의 파도가 거세진다.
${e}`,`임차인의 성공이 시장에 좌우된다.
${e}`,`상가 투자의 리스크가 커진다.
${e}`],빌딩:[`도시가 요동치면 빌딩도 요동친다.
${e}`,`스카이라인의 공기가 달라졌다.
${e}`,`부동산 투자의 정점이 시험받는다.
${e}`,`스카이라인의 주인이 시장에 좌우된다.
${e}`,`도시의 한 조각이 흔들린다.
${e}`,`빌딩의 무게감이 느껴진다.
${e}`,`부동산 투자의 완성이 시장에 좌우된다.
${e}`,`도시의 심장부가 요동친다.
${e}`,`스카이라인의 이름이 흔들린다.
${e}`,`부동산 투자의 궁극이 시험받는다.
${e}`],노동:[`업무 흐름이 바뀌면 내 하루도 바뀐다.
${e}`,`오늘은 손이 더 바빠질 것 같다.
${e}`,`일의 리듬이 바뀐다.
${e}`,`업무의 흐름이 시장에 좌우된다.
${e}`,`노동의 가치가 변동한다.
${e}`,`일의 무게감이 느껴진다.
${e}`,`업무의 스트레스가 커진다.
${e}`,`노동의 리듬이 시장에 좌우된다.
${e}`,`일의 가치가 흔들린다.
${e}`,`업무의 변동성이 느껴진다.
${e}`],시장:[`시장이 시끄럽다.
${e}`,`뉴스가 난리다.
${e}`,`분위기가 확 바뀌었다.
${e}`,`감정은 접고, 상황만 기록.
${e}`,`시장의 파도가 거세진다.
${e}`,`뉴스 한 줄이 모든 걸 바꾼다.
${e}`,`시장의 무게감이 느껴진다.
${e}`,`변동성의 극치를 경험한다.
${e}`,`시장의 리듬이 바뀐다.
${e}`,`투자의 리스크가 커진다.
${e}`]};return N(`market_${pe}`,u[pe]||u.시장)}if(p.startsWith("📉")&&p.includes("종료")){const e=window.__diaryLastMarketProduct||"시장",o=window.__diaryLastMarketName||"",L={코인:[`심장이 겨우 진정됐다. (${o||"이벤트 종료"})`,`코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.
${o||""}`.trim(),`롤러코스터가 멈췄다. 잠시만.
${o||""}`.trim(),`FOMO의 파도가 잠잠해졌다.
${o||""}`.trim(),`변동성의 폭풍이 지나갔다.
${o||""}`.trim(),`멘탈이 겨우 회복됐다.
${o||""}`.trim(),`코인판의 소란이 잠잠해졌다.
${o||""}`.trim(),`위험의 파도가 잠잠해졌다.
${o||""}`.trim()],국내주식:[`차트가 잠깐 조용해졌다.
${o||""}`.trim(),`국장 소란 종료. 숨 한 번.
${o||""}`.trim(),`뉴스의 파도가 잠잠해졌다.
${o||""}`.trim(),`차트의 심장박동이 안정됐다.
${o||""}`.trim(),`국장의 변동성이 잠잠해졌다.
${o||""}`.trim(),`투자자의 심장이 진정됐다.
${o||""}`.trim(),`국장의 무게에서 벗어났다.
${o||""}`.trim(),`차트의 파도가 잠잠해졌다.
${o||""}`.trim()],미국주식:[`밤이 지나갔다.
${o||""}`.trim(),`미장 이벤트 종료. 알림도 잠잠.
${o||""}`.trim(),`시차의 스트레스가 사라졌다.
${o||""}`.trim(),`달러의 무게에서 벗어났다.
${o||""}`.trim(),`미장의 파도가 잠잠해졌다.
${o||""}`.trim(),`밤샘의 대가가 끝났다.
${o||""}`.trim(),`환율의 변동이 잠잠해졌다.
${o||""}`.trim(),`글로벌 투자의 무게에서 벗어났다.
${o||""}`.trim()],부동산:[`동네가 다시 평소 얼굴을 찾았다.
${o||""}`.trim(),`부동산 시장이 안정됐다.
${o||""}`.trim(),`동네 분위기가 평소로 돌아왔다.
${o||""}`.trim(),`부동산 투자의 변동성이 잠잠해졌다.
${o||""}`.trim(),`집의 무게에서 벗어났다.
${o||""}`.trim(),`부동산 시장의 파도가 잠잠해졌다.
${o||""}`.trim(),`부동산 투자의 리스크가 줄어들었다.
${o||""}`.trim(),`동네가 평소의 모습을 찾았다.
${o||""}`.trim()],시장:["소란이 잠잠해졌다.","폭풍 지나가고 고요.","이제 평소대로.","시장의 파도가 잠잠해졌다.","뉴스의 소란이 끝났다.","변동성이 안정됐다.","투자의 리스크가 줄어들었다.","시장의 무게에서 벗어났다."]},ke=["빌라","오피스텔","아파트","상가","빌딩"].includes(e)?"부동산":e,pe=N(`marketEnd_${ke}`,L[ke]||L.시장);return window.__diaryLastMarketProduct=null,window.__diaryLastMarketName=null,pe}if(p.startsWith("💡")){const e=ee(p),o=window.__diaryLastMarketProduct||"",L=window.__diaryLastMarketName||"",A={코인:[`메모(코인): 멘탈 관리가 수익률이다.
${e}`,`코인 메모.
${L?`(${L})
`:""}${e}`.trim(),`코인 투자 노트: 변동성을 견뎌야 한다.
${e}`,`코인 기록: FOMO를 이겨내야 한다.
${e}`,`코인 메모: 롤러코스터의 정점에서 내려야 한다.
${e}`,`코인 투자 기록: 위험을 감수하는 선택.
${e}`],국내주식:[`메모(국장): 뉴스 한 줄에 흔들리지 말 것.
${e}`,`국장 메모.
${L?`(${L})
`:""}${e}`.trim(),`국장 투자 노트: 차트의 파도를 타야 한다.
${e}`,`국장 기록: 변동성을 견뎌야 한다.
${e}`,`국장 메모: 투자자의 심장이 시험받는다.
${e}`,`국장 투자 기록: 국장의 무게를 견뎌야 한다.
${e}`],미국주식:[`메모(미장): 시차 + 환율 = 체력.
${e}`,`미장 메모.
${L?`(${L})
`:""}${e}`.trim(),`미장 투자 노트: 밤샘의 대가를 치러야 한다.
${e}`,`미장 기록: 달러의 무게를 견뎌야 한다.
${e}`,`미장 메모: 시차의 스트레스를 견뎌야 한다.
${e}`,`미장 투자 기록: 글로벌 투자의 무게.
${e}`],예금:[`메모(예금): 조용히 이기는 쪽.
${e}`,`예금 투자 노트: 안정이 최고의 수익률.
${e}`,`예금 기록: 변동성 없는 투자의 편안함.
${e}`,`예금 메모: 안전함의 가치.
${e}`,`예금 투자 기록: 조용한 수익.
${e}`],적금:[`메모(적금): 루틴이 무기.
${e}`,`적금 투자 노트: 꾸준함이 무기다.
${e}`,`적금 기록: 매일의 습관이 미래를 만든다.
${e}`,`적금 메모: 시간이 내 편이 되는 투자.
${e}`,`적금 투자 기록: 인내심이 필요한 투자.
${e}`],부동산:[`메모(부동산): 공실은 악몽, 임차인은 복.
${e}`,`동네 메모.
${L?`(${L})
`:""}${e}`.trim(),`부동산 투자 노트: 집의 무게감을 견뎌야 한다.
${e}`,`부동산 기록: 시장의 파도를 타야 한다.
${e}`,`부동산 메모: 부동산 투자의 리스크.
${e}`,`부동산 투자 기록: 동네 분위기의 변화.
${e}`],노동:[`메모(노동): 버티는 사람이 이긴다.
${e}`,`노동 노트: 일의 무게감을 견뎌야 한다.
${e}`,`노동 기록: 업무의 리듬이 시장에 좌우된다.
${e}`,`노동 메모: 일의 가치가 변동한다.
${e}`,`노동 투자 기록: 업무의 스트레스를 견뎌야 한다.
${e}`]},pe=["빌라","오피스텔","아파트","상가","빌딩"].includes(o)?"부동산":o;return pe&&A[pe]?N(`memo_${pe}`,A[pe]):N("memo",[`메모.
${e}`,`적어둔다.
${e}`,`까먹기 전에 기록.
${e}`,`투자 노트에 기록.
${e}`,`기억해둘 것.
${e}`,`나중을 위해 기록.
${e}`])}if(p.startsWith("🎁")&&p.includes("해금")){const e=ee(p),o=((Ve=(xt=p.match(/해금:\s*(.+)$/))==null?void 0:xt[1])==null?void 0:Ve.trim())||"",A=(pe=>{const u=String(pe||"");return u.includes("예금")?"예금":u.includes("적금")?"적금":u.includes("미국주식")||u.includes("미장")||u.includes("🇺🇸")?"미국주식":u.includes("코인")||u.includes("₿")||u.includes("암호")?"코인":u.includes("주식")?"국내주식":u.includes("빌딩")?"빌딩":u.includes("상가")?"상가":u.includes("아파트")?"아파트":u.includes("오피스텔")?"오피스텔":u.includes("빌라")?"빌라":u.includes("월세")||u.includes("부동산")?"부동산":u.includes("클릭")||u.includes("노동")||u.includes("업무")||u.includes("CEO")||u.includes("커리어")?"노동":""})(`${o} ${e}`)||"기본",ke={노동:[`일을 '덜 힘들게' 만드는 방법이 생겼다.
${o||e}`,`업무 스킬이 하나 늘었다.
${o||e}`,`손끝이 더 빨라질 준비.
${o||e}`,`일하는 방식이 개선될 것 같다.
${o||e}`,`업무 효율이 올라갈 것 같다.
${o||e}`,`노동의 질이 향상될 것 같다.
${o||e}`,`일하는 능력이 강화됐다.
${o||e}`,`업무 스킬의 진화.
${o||e}`],예금:[`예금이 더 조용히 벌어다 주겠지.
${o||e}`,`안정 쪽에 옵션이 하나 추가됐다.
${o||e}`,`예금의 수익률이 올라갈 것 같다.
${o||e}`,`안정적인 투자가 더 강해진다.
${o||e}`,`예금의 가치가 상승할 것 같다.
${o||e}`,`안전한 투자의 힘이 커진다.
${o||e}`,`예금의 편안함이 더해진다.
${o||e}`,`안정적인 투자의 진화.
${o||e}`],적금:[`루틴 강화 카드가 열렸다.
${o||e}`,`꾸준함을 돕는 장치가 생겼다.
${o||e}`,`적금의 루틴이 강화됐다.
${o||e}`,`꾸준함의 힘이 커진다.
${o||e}`,`매일의 습관이 더 강해진다.
${o||e}`,`적금의 시간 가치가 올라간다.
${o||e}`,`루틴 투자의 힘이 커진다.
${o||e}`,`꾸준함의 진화.
${o||e}`],국내주식:[`차트 싸움에 새 무기가 생겼다.
${o||e}`,`국장 대응력이 올라갈 것 같다.
${o||e}`,`국장 투자의 힘이 커진다.
${o||e}`,`차트의 파도를 더 잘 탈 수 있다.
${o||e}`,`국장의 변동성에 대응할 수 있다.
${o||e}`,`투자자의 능력이 강화됐다.
${o||e}`,`국장 투자의 진화.
${o||e}`,`차트 싸움의 무기가 강화됐다.
${o||e}`],미국주식:[`시차를 버틸 장비가 하나 생겼다.
${o||e}`,`달러 쪽 옵션이 열린다.
${o||e}`,`미장 투자의 힘이 커진다.
${o||e}`,`시차의 스트레스를 견딜 수 있다.
${o||e}`,`달러의 무게를 더 잘 견딜 수 있다.
${o||e}`,`글로벌 투자의 능력이 강화됐다.
${o||e}`,`미장 투자의 진화.
${o||e}`,`밤샘의 대가를 더 잘 견딜 수 있다.
${o||e}`],코인:[`코인판에서 버틸 도구가 생겼다.
${o||e}`,`멘탈을 지키는 업그레이드…였으면.
${o||e}`,`코인 투자의 힘이 커진다.
${o||e}`,`변동성을 더 잘 견딜 수 있다.
${o||e}`,`FOMO를 더 잘 이겨낼 수 있다.
${o||e}`,`롤러코스터를 더 잘 탈 수 있다.
${o||e}`,`코인 투자의 진화.
${o||e}`,`멘탈 관리의 도구가 생겼다.
${o||e}`],빌라:[`빌라 운영이 조금은 편해질지도.
${o||e}`,`첫 집의 가치가 올라간다.
${o||e}`,`부동산 투자의 첫걸음이 강화됐다.
${o||e}`,`작은 집의 수익이 올라간다.
${o||e}`,`부동산 투자의 기초가 강화됐다.
${o||e}`,`첫 집의 무게감이 줄어든다.
${o||e}`,`부동산 투자의 진화.
${o||e}`,`작은 집의 가치가 상승한다.
${o||e}`],오피스텔:[`오피스텔 쪽이 한 단계 나아간다.
${o||e}`,`실용적인 투자가 강화됐다.
${o||e}`,`생활의 편의가 더해진다.
${o||e}`,`도시 생활의 질이 올라간다.
${o||e}`,`현실적인 투자의 힘이 커진다.
${o||e}`,`오피스텔의 가치가 상승한다.
${o||e}`,`실용주의 투자의 진화.
${o||e}`,`생활의 편의가 강화됐다.
${o||e}`],아파트:[`아파트는 디테일에서 돈이 난다.
${o||e}`,`한국인의 꿈이 더 가까워진다.
${o||e}`,`안정의 상징이 강화됐다.
${o||e}`,`부동산 투자의 정점이 올라간다.
${o||e}`,`아파트의 가치가 상승한다.
${o||e}`,`안정적인 투자의 힘이 커진다.
${o||e}`,`부동산 투자의 진화.
${o||e}`,`꿈이 현실에 더 가까워진다.
${o||e}`],상가:[`상가는 세팅이 반이다.
${o||e}`,`상권 투자의 힘이 커진다.
${o||e}`,`유동인구의 수익이 올라간다.
${o||e}`,`임대 수익의 달콤함이 커진다.
${o||e}`,`상가의 가치가 상승한다.
${o||e}`,`상권 투자의 진화.
${o||e}`,`임차인의 성공이 내 성공이 된다.
${o||e}`,`상권의 힘이 강화됐다.
${o||e}`],빌딩:[`빌딩은 관리가 곧 수익이다.
${o||e}`,`부동산 투자의 궁극이 강화됐다.
${o||e}`,`스카이라인의 주인이 강해진다.
${o||e}`,`도시의 한 조각이 더 가치있어진다.
${o||e}`,`빌딩의 무게감이 줄어든다.
${o||e}`,`부동산 투자의 완성이 올라간다.
${o||e}`,`스카이라인의 가치가 상승한다.
${o||e}`,`부동산 투자의 진화.
${o||e}`],부동산:[`부동산 운영에 옵션이 하나 추가됐다.
${o||e}`,`월세를 '조금 더' 만들 방법.
${o||e}`,`부동산 투자의 힘이 커진다.
${o||e}`,`집의 가치가 올라간다.
${o||e}`,`부동산 시장의 파도를 더 잘 탈 수 있다.
${o||e}`,`부동산 투자의 리스크가 줄어든다.
${o||e}`,`부동산 투자의 진화.
${o||e}`,`집의 무게감이 줄어든다.
${o||e}`],기본:[`새로운 방법이 보였다.
${o||e}`,`선택지가 늘었다.
${o||e}`,`이제부터가 시작일지도.
${o||e}`,`기회의 문이 열렸다.
${o||e}`,`새로운 가능성이 생겼다.
${o||e}`,`진화의 순간.
${o||e}`,`능력이 강화됐다.
${o||e}`,`다음 단계로 나아갈 수 있다.
${o||e}`]};return N(`upgradeUnlock_${A}`,ke[A]||ke.기본)}if(p.startsWith("✅")&&p.includes("구매!")){const e=ee(p),o=p.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/),L=((o==null?void 0:o[1])||"").trim(),A=((o==null?void 0:o[2])||"").trim(),pe=(Ge=>{const te=String(Ge||"");return te.includes("예금")?"예금":te.includes("적금")?"적금":te.includes("미국주식")||te.includes("미장")||te.includes("🇺🇸")?"미국주식":te.includes("코인")||te.includes("₿")||te.includes("암호")?"코인":te.includes("주식")?"국내주식":te.includes("빌딩")?"빌딩":te.includes("상가")?"상가":te.includes("아파트")?"아파트":te.includes("오피스텔")?"오피스텔":te.includes("빌라")?"빌라":te.includes("월세")||te.includes("부동산")?"부동산":te.includes("클릭")||te.includes("노동")||te.includes("업무")||te.includes("CEO")||te.includes("커리어")?"노동":""})(`${L} ${A} ${e}`)||"기본",u=[L,A].filter(Boolean).join(" — ")||e,Ue={노동:[`일하는 방식이 바뀌었다.
${u}`,`업무 스킬을 장착했다.
${u}`,`손이 더 빨라질 거다. 아마도.
${u}`,`일하는 능력이 강화됐다.
${u}`,`업무 효율이 올라갔다.
${u}`,`노동의 질이 향상됐다.
${u}`,`일하는 방식의 진화.
${u}`,`업무 스킬의 강화.
${u}`],예금:[`예금은 조용히 강해진다.
${u}`,`안정 쪽을 더 단단히 했다.
${u}`,`예금의 수익률이 올라갔다.
${u}`,`안정적인 투자가 강화됐다.
${u}`,`예금의 가치가 상승했다.
${u}`,`안전한 투자의 힘이 커졌다.
${u}`,`예금의 편안함이 더해졌다.
${u}`,`안정적인 투자의 진화.
${u}`],적금:[`루틴을 업그레이드했다.
${u}`,`꾸준함에 부스터 하나.
${u}`,`적금의 루틴이 강화됐다.
${u}`,`꾸준함의 힘이 커졌다.
${u}`,`매일의 습관이 더 강해졌다.
${u}`,`적금의 시간 가치가 올라갔다.
${u}`,`루틴 투자의 힘이 커졌다.
${u}`,`꾸준함의 진화.
${u}`],국내주식:[`차트 싸움에 장비를 추가했다.
${u}`,`국장 대응력 상승.
${u}`,`국장 투자의 힘이 커졌다.
${u}`,`차트의 파도를 더 잘 탈 수 있다.
${u}`,`국장의 변동성에 대응할 수 있다.
${u}`,`투자자의 능력이 강화됐다.
${u}`,`국장 투자의 진화.
${u}`,`차트 싸움의 무기가 강화됐다.
${u}`],미국주식:[`시차를 버틸 장비 장착.
${u}`,`달러 쪽을 조금 더 믿어보기로.
${u}`,`미장 투자의 힘이 커졌다.
${u}`,`시차의 스트레스를 견딜 수 있다.
${u}`,`달러의 무게를 더 잘 견딜 수 있다.
${u}`,`글로벌 투자의 능력이 강화됐다.
${u}`,`미장 투자의 진화.
${u}`,`밤샘의 대가를 더 잘 견딜 수 있다.
${u}`],코인:[`코인판에서 살아남을 장비.
${u}`,`멘탈 보호 장치…였으면.
${u}`,`코인 투자의 힘이 커졌다.
${u}`,`변동성을 더 잘 견딜 수 있다.
${u}`,`FOMO를 더 잘 이겨낼 수 있다.
${u}`,`롤러코스터를 더 잘 탈 수 있다.
${u}`,`코인 투자의 진화.
${u}`,`멘탈 관리의 도구가 생겼다.
${u}`],빌라:[`빌라 운영을 손봤다.
${u}`,`첫 집의 가치가 올라갔다.
${u}`,`부동산 투자의 첫걸음이 강화됐다.
${u}`,`작은 집의 수익이 올라갔다.
${u}`,`부동산 투자의 기초가 강화됐다.
${u}`,`첫 집의 무게감이 줄어들었다.
${u}`,`부동산 투자의 진화.
${u}`,`작은 집의 가치가 상승했다.
${u}`],오피스텔:[`오피스텔 쪽을 업그레이드했다.
${u}`,`실용적인 투자가 강화됐다.
${u}`,`생활의 편의가 더해졌다.
${u}`,`도시 생활의 질이 올라갔다.
${u}`,`현실적인 투자의 힘이 커졌다.
${u}`,`오피스텔의 가치가 상승했다.
${u}`,`실용주의 투자의 진화.
${u}`,`생활의 편의가 강화됐다.
${u}`],아파트:[`아파트는 디테일.
${u}`,`한국인의 꿈이 더 가까워졌다.
${u}`,`안정의 상징이 강화됐다.
${u}`,`부동산 투자의 정점이 올라갔다.
${u}`,`아파트의 가치가 상승했다.
${u}`,`안정적인 투자의 힘이 커졌다.
${u}`,`부동산 투자의 진화.
${u}`,`꿈이 현실에 더 가까워졌다.
${u}`],상가:[`상가는 세팅이 반이다.
${u}`,`상권 투자의 힘이 커졌다.
${u}`,`유동인구의 수익이 올라갔다.
${u}`,`임대 수익의 달콤함이 커졌다.
${u}`,`상가의 가치가 상승했다.
${u}`,`상권 투자의 진화.
${u}`,`임차인의 성공이 내 성공이 된다.
${u}`,`상권의 힘이 강화됐다.
${u}`],빌딩:[`빌딩은 관리가 수익이다.
${u}`,`부동산 투자의 궁극이 강화됐다.
${u}`,`스카이라인의 주인이 강해졌다.
${u}`,`도시의 한 조각이 더 가치있어졌다.
${u}`,`빌딩의 무게감이 줄어들었다.
${u}`,`부동산 투자의 완성이 올라갔다.
${u}`,`스카이라인의 가치가 상승했다.
${u}`,`부동산 투자의 진화.
${u}`],부동산:[`월세 쪽을 손봤다.
${u}`,`부동산 운영이 한 단계 올라갔다.
${u}`,`부동산 투자의 힘이 커졌다.
${u}`,`집의 가치가 올라갔다.
${u}`,`부동산 시장의 파도를 더 잘 탈 수 있다.
${u}`,`부동산 투자의 리스크가 줄어들었다.
${u}`,`부동산 투자의 진화.
${u}`,`집의 무게감이 줄어들었다.
${u}`],기본:[`필요한 걸 갖췄다.
${e}`,`업그레이드 완료. 조금은 편해지겠지.
${e}`,`나 자신에게 투자.
${e}`,`능력이 강화됐다.
${e}`,`진화의 순간.
${e}`,`기회를 잡았다.
${e}`,`다음 단계로 나아갔다.
${e}`,`투자의 힘이 커졌다.
${e}`]};return N(`upgradeBuy_${pe}`,Ue[pe]||Ue.기본)}if(p.startsWith("⚠️")){const e=ee(p);return N("warn",[`찜찜한 기분이 남았다.
${e}`,`뭔가 삐끗한 느낌.
${e}`,`일단 기록만 남긴다.
${e}`,`뭔가 이상한 느낌.
${e}`,`불안한 기분이 든다.
${e}`,`주의가 필요할 것 같다.
${e}`,`뭔가 잘못된 것 같다.
${e}`,`경고의 신호가 느껴진다.
${e}`])}const W=ee(p);return N("default",[W,`${a("diary.justWrite")}
${W}`,`${a("diary.todayRecord")}
${W}`,`${a("diary.anyway")} ${W}`,`${a("diary.justRecord")}
${W}`,`${a("diary.memo")}
${W}`,`${a("diary.remember")}
${W}`,`${a("diary.recordForLater")}
${W}`,`${a("diary.goodToWrite")}
${W}`,`${a("diary.leaveRecord")}
${W}`])}l();const g=d(t);if(!g)return;const h=document.createElement("p"),b=g.replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`),P=(b[0]??"").trim(),C=b.slice(1).map(y=>String(y).trim()).filter(Boolean),f=`<span class="diary-voice">${P}</span>`+(C.length?`
<span class="diary-info">${C.join(`
`)}</span>`:"");h.innerHTML=`<span class="diary-time">${c}</span>${f}`,Ra.prepend(h)}function Ro(){return D+F+U+J+z}function _t(){return q+H+O+K+V}function oe(t){const n={deposit:()=>!0,savings:()=>D>=1,bond:()=>F>=1,usStock:()=>U>=1,crypto:()=>J>=1,villa:()=>z>=1,officetel:()=>q>=1,apartment:()=>H>=1,shop:()=>O>=1,building:()=>K>=1,tower:()=>G>=9&&V>=1};return n[t]?n[t]():!1}function qe(t){const s={deposit:{next:"savings",msg:"🔓 적금이 해금되었습니다!"},savings:{next:"bond",msg:"🔓 국내주식이 해금되었습니다!"},bond:{next:"usStock",msg:"🔓 미국주식이 해금되었습니다!"},usStock:{next:"crypto",msg:"🔓 코인이 해금되었습니다!"},crypto:{next:"villa",msg:"🔓 빌라가 해금되었습니다!"},villa:{next:"officetel",msg:"🔓 오피스텔이 해금되었습니다!"},officetel:{next:"apartment",msg:"🔓 아파트가 해금되었습니다!"},apartment:{next:"shop",msg:"🔓 상가가 해금되었습니다!"},shop:{next:"building",msg:"🔓 빌딩이 해금되었습니다!"},building:{next:"tower",msg:"🔓 서울타워가 해금되었습니다!"}}[t];if(!s||Bo[s.next]||!oe(s.next))return;const i={savings:F,bond:U,usStock:J,crypto:z,villa:q,officetel:H,apartment:O,shop:K,building:V,tower:Se};if(i[s.next]!==void 0&&i[s.next]>0){Bo[s.next]=!0;return}Bo[s.next]=!0,_(s.msg);const r=s.next+"Item",c=document.getElementById(r);c&&(c.classList.add("just-unlocked"),setTimeout(()=>c.classList.remove("just-unlocked"),1e3))}function dn(t,n){let i=I[t]*n;const r=Fo(t,"financial");return i*=r,i}function un(t,n){let i=E[t]*n;const r=Fo(t,"property");return i*=r,i}function At(){const t=dn("deposit",D)+dn("savings",F)+dn("bond",U)+dn("usStock",J)+dn("crypto",z),n=un("villa",q)+un("officetel",H)+un("apartment",O)+un("shop",K)+un("building",V);return(t+n*xe)*Un}function ai(){const t=ys[Math.floor(Math.random()*ys.length)];ye=t,Oe=Date.now()+t.duration,_(a("msg.eventStarted",{name:t.name,duration:Math.floor(t.duration/1e3)})),_(a("msg.eventDescription",{description:t.description})),ii(t)}function ii(t){const n=document.createElement("div");n.style.cssText=`
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${t.color};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;let s="";if(t.effects.financial){const r=Object.entries(t.effects.financial).filter(([c,l])=>l!==1).map(([c,l])=>{const d=Math.round(l*10)/10;return`${B(c)} x${String(d).replace(/\.0$/,"")}`});r.length>0&&(s+=`💰 ${r.join(", ")}
`)}if(t.effects.property){const r=Object.entries(t.effects.property).filter(([c,l])=>l!==1).map(([c,l])=>{const d={villa:B("villa"),officetel:B("officetel"),apartment:B("apartment"),shop:B("shop"),building:B("building")},g=Math.round(l*10)/10;return`${d[c]} x${String(g).replace(/\.0$/,"")}`});r.length>0&&(s+=`🏠 ${r.join(", ")}`)}const i=Math.floor((t.duration??0)/1e3);n.innerHTML=`
        <div style="font-size: 16px; margin-bottom: 6px;">📈 ${t.name}</div>
        <div style="font-size: 11px; opacity: 0.95; margin-bottom: 8px;">지속: ${i}초</div>
        <div style="font-size: 12px; opacity: 0.9;">${t.description}</div>
        ${s?`<div style="font-size: 11px; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">${s}</div>`:""}
      `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},5e3)}function ri(){Oe>0&&Date.now()>=Oe&&(ye=null,Oe=0,_(a("msg.eventEnded")))}function Fo(t,n){if(!ye||!ye.effects)return 1;const s=ye.effects[n];return!s||!s[t]?1:s[t]}function ci(){$t.forEach(t=>{if(!t.unlocked&&t.condition()){t.unlocked=!0,li(t);const n=a(`achievement.${t.id}.name`,{},t.name),s=a(`achievement.${t.id}.desc`,{},t.desc);_(a("msg.achievementUnlocked",{name:n,desc:s}))}})}function li(t){const n=document.createElement("div");n.style.cssText=`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #000;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: bold;
        z-index: 2000;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: achievementPop 1s ease-out;
      `;const s=a(`achievement.${t.id}.name`),i=a(`achievement.${t.id}.desc`);n.innerHTML=`
        <div style="font-size: 24px; margin-bottom: 10px;">🏆</div>
        <div style="font-size: 18px; margin-bottom: 5px;">${s}</div>
        <div style="font-size: 14px; opacity: 0.8;">${i}</div>
      `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},3e3)}function Ts(){let t=0;for(const[n,s]of Object.entries(ne))if(!(s.purchased||s.unlocked))try{s.unlockCondition()&&(s.unlocked=!0,t++,_(a("msg.upgradeUnlocked",{name:a(`upgrade.${n}.name`)})))}catch(i){console.error(`업그레이드 해금 조건 체크 실패 (${n}):`,i)}t>0&&Rt()}function di(){document.querySelectorAll(".upgrade-item").forEach(n=>{const s=n.dataset.upgradeId,i=ne[s];i&&!i.purchased&&(S>=i.cost?n.classList.add("affordable"):n.classList.remove("affordable"))})}function ui(){document.querySelectorAll(".upgrade-progress").forEach(n=>{const s=n.closest(".upgrade-item");!s||!s.dataset.upgradeId||(Object.entries(ne).filter(([r,c])=>c.category==="labor"&&!c.unlocked&&!c.purchased).map(([r,c])=>{var h;const l=c.unlockCondition.toString(),d=l.match(/totalClicks\s*>=\s*(\d+)/);if(d)return{id:r,requiredClicks:parseInt(d[1]),upgrade:c};const g=l.match(/careerLevel\s*>=\s*(\d+)/);return g?{id:r,requiredClicks:((h=Et[parseInt(g[1])])==null?void 0:h.requiredClicks)||1/0,upgrade:c}:null}).filter(r=>r!==null).sort((r,c)=>r.requiredClicks-c.requiredClicks),n.textContent="")})}function Rt(){const t=document.getElementById("upgradeList"),n=document.getElementById("upgradeCount");if(!t||!n)return;const s=Object.entries(ne).filter(([r,c])=>c.unlocked&&!c.purchased);n.textContent=`(${s.length})`;const i=document.getElementById("noUpgradesMessage");if(s.length===0){t.innerHTML="",i&&(i.textContent=a("ui.noUpgrades"),i.style.display="block");return}i&&(i.style.display="none"),t.innerHTML="",console.log(`🔄 Regenerating upgrade list with ${s.length} items`),s.forEach(([r,c])=>{const l=document.createElement("div");l.className="upgrade-item",l.dataset.upgradeId=r,S>=c.cost&&l.classList.add("affordable");const d=document.createElement("div");d.className="upgrade-icon",d.textContent=c.icon;const g=document.createElement("div");g.className="upgrade-info";const h=document.createElement("div");h.className="upgrade-name",h.textContent=a(`upgrade.${r}.name`,{},c.name);const $=document.createElement("div");$.className="upgrade-desc",$.textContent=a(`upgrade.${r}.desc`,{},c.desc);const b=me(c.cost);if(c.category==="labor"&&c.unlockCondition)try{const C=document.createElement("div");C.className="upgrade-progress",C.style.fontSize="11px",C.style.color="var(--muted)",C.style.marginTop="4px";const f=Object.entries(ne).filter(([y,p])=>p.category==="labor"&&!p.unlocked&&!p.purchased).map(([y,p])=>{const j=p.unlockCondition.toString().match(/totalClicks\s*>=\s*(\d+)/);return j?{id:y,requiredClicks:parseInt(j[1]),upgrade:p}:null}).filter(y=>y!==null).sort((y,p)=>y.requiredClicks-p.requiredClicks)}catch{}g.appendChild(h),g.appendChild($);const P=document.createElement("div");P.className="upgrade-status",P.textContent=b,P.style.animation="none",P.style.background="rgba(94, 234, 212, 0.12)",P.style.color="var(--accent)",P.style.border="1px solid rgba(94, 234, 212, 0.25)",P.style.borderRadius="999px",l.appendChild(d),l.appendChild(g),l.appendChild(P),l.addEventListener("click",C=>{C.stopPropagation(),console.log("🖱️ Upgrade item clicked!",r),console.log("Event target:",C.target),console.log("Current item:",l),console.log("Dataset:",l.dataset),mi(r)},!1),l.addEventListener("mousedown",C=>{console.log("🖱️ Mousedown detected on upgrade:",r)}),t.appendChild(l),console.log(`✅ Upgrade item created and appended: ${r}`,l)})}function mi(t){console.log("=== PURCHASE UPGRADE DEBUG ==="),console.log("Attempting to purchase:",t),console.log("Current cash:",S);const n=ne[t];if(!n){console.error("업그레이드를 찾을 수 없습니다:",t),console.log("Available upgrade IDs:",Object.keys(ne));return}if(console.log("Upgrade found:",{name:n.name,cost:n.cost,unlocked:n.unlocked,purchased:n.purchased}),n.purchased){_(a("msg.upgradeAlreadyPurchased")),console.log("Already purchased");return}if(S<n.cost){_(a("msg.upgradeInsufficientFunds",{cost:me(n.cost)})),console.log("Not enough cash. Need:",n.cost,"Have:",S);return}console.log("Purchase successful! Applying effect..."),S-=n.cost,n.purchased=!0;try{n.effect(),_(a("msg.upgradePurchased",{name:a(`upgrade.${t}.name`),desc:a(`upgrade.${t}.desc`)})),console.log("Effect applied successfully")}catch(s){console.error(`업그레이드 효과 적용 실패 (${t}):`,s),_(a("msg.upgradeError",{name:a(`upgrade.${t}.name`)}))}console.log("New cash:",S),console.log("=============================="),Rt(),fe(),fn()}function mn(){const t=gn();return Math.floor(1e4*t.multiplier*be)}function gn(){return Et[G]}function Uo(){return G<Et.length-1?Et[G+1]:null}function xs(){const t=Uo();if(t&&ge>=t.requiredClicks){G+=1;const n=gn(),s=mn();_(a("msg.promoted",{career:zt(G),income:T(s)})),Ce&&(Ce.style.transition="opacity 0.3s ease-out",Ce.style.opacity="0.5",setTimeout(()=>{n.bgImage?(Ce.style.transition="background-image 0.8s ease-in-out, opacity 0.5s ease-in",Ce.style.backgroundImage=`url('${n.bgImage}')`):(Ce.style.transition="background-image 0.8s ease-in-out, opacity 0.5s ease-in",Ce.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),Ce.style.opacity="1"},300));const i=document.querySelector(".career-card");i&&(i.style.animation="none",setTimeout(()=>{i.style.animation="careerPromotion 0.6s ease-out"},10));const r=document.getElementById("currentCareer");return r&&r.setAttribute("aria-label",a("msg.promoted",{career:zt(G),income:T(s)})),console.log("=== PROMOTION DEBUG ==="),console.log("Promoted to:",zt(G)),console.log("New career level:",G),console.log("New multiplier:",n.multiplier),console.log("Click income:",T(s)),console.log("======================"),!0}return!1}function gi(){const t=ae,n=ve==="buy",s=n&&S>=Z("deposit",D,t),i=n&&S>=Z("savings",F,t),r=n&&S>=Z("bond",U,t),c=n&&S>=Z("usStock",J,t),l=n&&S>=Z("crypto",z,t);Yt.classList.toggle("affordable",s),Yt.classList.toggle("unaffordable",n&&!s),Jt.classList.toggle("affordable",i),Jt.classList.toggle("unaffordable",n&&!i),Qt.classList.toggle("affordable",r),Qt.classList.toggle("unaffordable",n&&!r),Xt.classList.toggle("affordable",c),Xt.classList.toggle("unaffordable",n&&!c),Zt.classList.toggle("affordable",l),Zt.classList.toggle("unaffordable",n&&!l);const d=n&&S>=Y("villa",q,t),g=n&&S>=Y("officetel",H,t),h=n&&S>=Y("apartment",O,t),$=n&&S>=Y("shop",K,t),b=n&&S>=Y("building",V,t);if(on.classList.toggle("affordable",d),on.classList.toggle("unaffordable",n&&!d),sn.classList.toggle("affordable",g),sn.classList.toggle("unaffordable",n&&!g),an.classList.toggle("affordable",h),an.classList.toggle("unaffordable",n&&!h),rn.classList.toggle("affordable",$),rn.classList.toggle("unaffordable",n&&!$),cn.classList.toggle("affordable",b),cn.classList.toggle("unaffordable",n&&!b),Mt){const P=jt.tower,C=n&&S>=P&&oe("tower");Mt.classList.toggle("affordable",C),Mt.classList.toggle("unaffordable",n&&(!C||!oe("tower"))),Mt.disabled=ve==="sell"||!oe("tower")}}function fi(){const t=ae,n=ve==="buy",s=document.getElementById("depositItem"),i=document.getElementById("savingsItem"),r=document.getElementById("bondItem"),c=document.getElementById("usStockItem"),l=document.getElementById("cryptoItem");s.classList.toggle("affordable",n&&S>=Z("deposit",D,t)),i.classList.toggle("affordable",n&&S>=Z("savings",F,t)),r.classList.toggle("affordable",n&&S>=Z("bond",U,t)),c.classList.toggle("affordable",n&&S>=Z("usStock",J,t)),l.classList.toggle("affordable",n&&S>=Z("crypto",z,t));const d=document.getElementById("villaItem"),g=document.getElementById("officetelItem"),h=document.getElementById("aptItem"),$=document.getElementById("shopItem"),b=document.getElementById("buildingItem");d.classList.toggle("affordable",n&&S>=Y("villa",q,t)),g.classList.toggle("affordable",n&&S>=Y("officetel",H,t)),h.classList.toggle("affordable",n&&S>=Y("apartment",O,t)),$.classList.toggle("affordable",n&&S>=Y("shop",K,t)),b.classList.toggle("affordable",n&&S>=Y("building",V,t));const P=document.getElementById("towerItem");if(P){const C=jt.tower,f=n&&S>=C&&oe("tower");P.classList.toggle("affordable",f),P.classList.toggle("unaffordable",n&&(!f||!oe("tower")))}}function fn(){const t={cash:S,totalClicks:ge,totalLaborIncome:st,careerLevel:G,clickMultiplier:be,rentMultiplier:xe,autoClickEnabled:Fn,managerLevel:Mo,rentCost:fs,mgrCost:ps,deposits:D,savings:F,bonds:U,usStocks:J,cryptos:z,depositsLifetime:ze,savingsLifetime:Ye,bondsLifetime:Je,usStocksLifetime:Qe,cryptosLifetime:Xe,villas:q,officetels:H,apartments:O,shops:K,buildings:V,towers:Se,villasLifetime:Ze,officetelsLifetime:et,apartmentsLifetime:tt,shopsLifetime:nt,buildingsLifetime:ot,upgradesV2:Object.fromEntries(Object.entries(ne).map(([n,s])=>[n,{unlocked:s.unlocked,purchased:s.purchased}])),marketMultiplier:Un,marketEventEndTime:Oe,achievements:$t,saveTime:new Date().toISOString(),ts:Date.now(),gameStartTime:ht,totalPlayTime:Re,sessionStartTime:Fe,nickname:ie};rs&&(console.log("💾 저장 데이터에 포함된 닉네임:",ie||"(없음)"),console.log("💾 saveData.nickname:",t.nickname));try{if(localStorage.setItem(Te,JSON.stringify(t)),Rn=new Date,console.log("게임 저장 완료:",Rn.toLocaleTimeString()),Bs(),Gn){const n=Number((t==null?void 0:t.ts)||0)||0;n&&n>Vo&&(yn=t,rs&&console.log("☁️ 클라우드 저장 대기 중인 데이터에 닉네임 포함:",yn.nickname||"(없음)"))}ie&&(!window.__lastLeaderboardUpdate||Date.now()-window.__lastLeaderboardUpdate>3e4)&&(Hi(),window.__lastLeaderboardUpdate=Date.now())}catch(n){console.error("게임 저장 실패:",n)}}function pi(){try{const t=localStorage.getItem(Te);return t&&JSON.parse(t).nickname||""}catch(t){return console.error("닉네임 확인 실패:",t),""}}function Ft(){if(Bt){console.log("⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨");return}const t=pi();if(t){ie=t,console.log("✅ 닉네임 확인됨:",t);return}console.log("📝 닉네임 없음: 모달 오픈"),Bt=!0;try{sessionStorage.setItem(An,"1")}catch(n){console.warn("sessionStorage set 실패:",n)}setTimeout(()=>{const n=async s=>{const i=ds(s);if(i.toLowerCase(),i.length<1||i.length>5){$e(a("modal.error.nicknameLength.title"),a("modal.error.nicknameLength.message"),"⚠️"),Bt=!1,Ft();return}if(/\s/.test(i)){$e(a("modal.error.nicknameFormat.title"),a("modal.error.nicknameFormat.message"),"⚠️"),Bt=!1,Ft();return}if(/[%_]/.test(i)){$e(a("modal.error.nicknameFormatInvalid.title"),a("modal.error.nicknameFormatInvalid.message"),"⚠️"),Bt=!1,Ft();return}const{taken:r}=await mr(i);if(r){$e(a("modal.error.nicknameTaken.title"),a("modal.error.nicknameTaken.message"),"⚠️"),Bt=!1,Ft();return}try{sessionStorage.removeItem(An)}catch(c){console.warn("sessionStorage remove 실패:",c)}ie=i,fn(),_(a("msg.nicknameSet",{nickname:ie}))};Si(a("modal.nickname.title"),a("modal.nickname.message"),n,{icon:"✏️",primaryLabel:a("button.confirm"),placeholder:a("modal.nickname.placeholder"),maxLength:5,defaultValue:"",required:!0})},500)}function yi(){try{const t=localStorage.getItem(Te);if(!t)return console.log("저장된 게임 데이터가 없습니다."),Re=0,Fe=Date.now(),!1;const n=JSON.parse(t);if(S=n.cash||0,ge=n.totalClicks||0,st=n.totalLaborIncome||0,G=n.careerLevel||0,be=n.clickMultiplier||1,xe=n.rentMultiplier||1,Fn=n.autoClickEnabled||!1,Mo=n.managerLevel||0,fs=n.rentCost||1e9,ps=n.mgrCost||5e9,D=n.deposits||0,F=n.savings||0,U=n.bonds||0,J=n.usStocks||0,z=n.cryptos||0,ze=n.depositsLifetime||0,Ye=n.savingsLifetime||0,Je=n.bondsLifetime||0,Qe=n.usStocksLifetime||0,Xe=n.cryptosLifetime||0,q=n.villas||0,H=n.officetels||0,O=n.apartments||0,K=n.shops||0,V=n.buildings||0,Se=n.towers||0,Ze=n.villasLifetime||0,et=n.officetelsLifetime||0,tt=n.apartmentsLifetime||0,nt=n.shopsLifetime||0,ot=n.buildingsLifetime||0,n.upgradesV2)for(const[s,i]of Object.entries(n.upgradesV2))ne[s]&&(ne[s].unlocked=i.unlocked,ne[s].purchased=i.purchased);if(xa(),Un=n.marketMultiplier||1,Oe=n.marketEventEndTime||0,n.achievements&&$t.forEach((s,i)=>{n.achievements[i]&&(s.unlocked=n.achievements[i].unlocked)}),n.gameStartTime&&(ht=n.gameStartTime),n.totalPlayTime!==void 0&&(Re=n.totalPlayTime,console.log("🕐 이전 누적 플레이시간 복원:",Re,"ms")),ie=n.nickname||"",n.sessionStartTime){const s=Date.now()-n.sessionStartTime;Re+=s,console.log("🕐 이전 세션 플레이시간 누적:",s,"ms")}return Fe=Date.now(),console.log("🕐 새 세션 시작:",new Date(Fe).toLocaleString()),console.log("🕐 총 누적 플레이시간:",Re,"ms"),console.log("게임 불러오기 완료:",n.saveTime?new Date(n.saveTime).toLocaleString():"시간 정보 없음"),!0}catch(t){return console.error("게임 불러오기 실패:",t),!1}}function qn(){console.log("🔄 resetGame function called"),pn(a("modal.confirm.reset.title"),a("modal.confirm.reset.message"),()=>{try{_(a("msg.gameReset")),console.log("✅ User confirmed reset"),localStorage.removeItem(Te),console.log("✅ LocalStorage cleared");try{sessionStorage.setItem(xo,"1"),sessionStorage.setItem(An,"1")}catch(t){console.warn("sessionStorage set 실패:",t)}console.log("✅ Reloading page..."),location.reload()}catch(t){console.error("❌ Error in resetGame:",t),$e(a("modal.error.resetError.title"),a("modal.error.resetError.message"),"⚠️")}},{icon:"🔄",primaryLabel:a("modal.confirm.reset.primaryLabel"),secondaryLabel:a("button.cancel")})}function He(t){t.classList.remove("purchase-success"),t.offsetHeight,t.classList.add("purchase-success"),setTimeout(()=>{t.classList.remove("purchase-success")},600)}function Do(){try{ar(gs,Le)}catch(t){console.error("설정 저장 실패:",t)}}function hi(){try{const t=ir(gs,null);t&&(Le={...Le,...t})}catch(t){console.error("설정 불러오기 실패:",t)}}function $i(){try{const t=localStorage.getItem(Te);if(!t){alert(a("modal.error.noSaveData.message"));return}const n=new Blob([t],{type:"application/json"}),s=URL.createObjectURL(n),i=document.createElement("a");i.href=s,i.download=`capital-clicker-save-${Date.now()}.json`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(s),_(a("msg.saveExported"))}catch(t){console.error("저장 내보내기 실패:",t),alert("저장 내보내기 중 오류가 발생했습니다.")}}function vi(t){try{const n=new FileReader;n.onload=s=>{try{const i=JSON.parse(s.target.result);localStorage.setItem(Te,JSON.stringify(i)),_(a("msg.saveImported")),setTimeout(()=>{location.reload()},1e3)}catch(i){console.error("저장 파일 파싱 실패:",i),alert("저장 파일 형식이 올바르지 않습니다.")}},n.readAsText(t)}catch(n){console.error("저장 가져오기 실패:",n),alert("저장 가져오기 중 오류가 발생했습니다.")}}function Bs(){if(Ss){const n=Q()==="en"?"en-US":"ko-KR",s=Rn.toLocaleTimeString(n,{hour:"2-digit",minute:"2-digit"});Ss.textContent=a("ui.saved",{time:s})}const t=document.getElementById("lastSaveTimeSettings");if(t){const n=Q()==="en"?"en-US":"ko-KR",s=Rn.toLocaleTimeString(n,{hour:"2-digit",minute:"2-digit",second:"2-digit"});t.textContent=s}}function fe(){try{const R=document.getElementById("playerNicknameLabel"),ue=document.getElementById("nicknameInfoItem");R&&(R.textContent=ie||"-"),ue&&(ue.style.display=ie?"flex":"none"),(typeof ge!="number"||ge<0)&&(console.warn("Invalid totalClicks value:",ge,"resetting to 0"),ge=0);const le=gn(),re=Uo();if(!le){console.error("getCurrentCareer() returned null/undefined");return}if(m(si,zt(G)),m(Fa,X(mn())),Ce&&le.bgImage?Ce.style.backgroundImage=`url('${le.bgImage}')`:Ce&&!le.bgImage&&(Ce.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),re){const _e=Math.min(ge/re.requiredClicks*100,100),St=Math.max(0,re.requiredClicks-ge);Pt&&(Pt.style.width=_e+"%",Pt.setAttribute("aria-valuenow",Math.round(_e))),m(_s,`${Math.round(_e)}% (${ge}/${re.requiredClicks})`),ln&&(St>0?m(ln,a("ui.nextPromotion",{remaining:St.toLocaleString("ko-KR")})):m(ln,a("ui.promotionAvailable"))),console.log("=== CAREER PROGRESS DEBUG ==="),console.log("totalClicks:",ge),console.log("nextCareer.requiredClicks:",re.requiredClicks),console.log("progress:",_e),console.log("currentCareer:",le.name),console.log("nextCareer:",re.name),console.log("=============================")}else Pt&&(Pt.style.width="100%",Pt.setAttribute("aria-valuenow",100)),m(_s,"100% (완료)"),ln&&m(ln,"최고 직급 달성")}catch(R){console.error("Career UI update failed:",R),console.error("Error details:",{totalClicks:ge,careerLevel:G,currentCareer:gn(),nextCareer:Uo()})}{const R=document.getElementById("diaryHeaderMeta");if(R){const ue=Gt=>String(Gt).padStart(2,"0"),le=new Date,re=le.getFullYear(),_e=ue(le.getMonth()+1),St=ue(le.getDate()),Lt=typeof ht<"u"&&ht?ht:Fe,Vt=Math.max(1,Math.floor((Date.now()-Lt)/864e5)+1);R.textContent=`${re}.${_e}.${St}(${a("ui.dayCount",{days:Vt})})`}}m(Ba,De(S));const t=Ro();m(Ma,X(t));const n=document.getElementById("financialChip");if(n){const R=a("ui.unit.count"),ue=`${B("deposit")}: ${D}${R}
${B("savings")}: ${F}${R}
${B("bond")}: ${U}${R}
${B("usStock")}: ${J}${R}
${B("crypto")}: ${z}${R}`;n.setAttribute("title",ue)}const s=_t();m(Pa,X(s));const i=document.getElementById("propertyChip");if(i){const R=a("ui.unit.property"),ue=B("villa"),le=B("officetel"),re=B("apartment"),_e=B("shop"),St=B("building"),Lt=`${ue}: ${q}${R}
${le}: ${H}${R}
${re}: ${O}${R}
${_e}: ${K}${R}
${St}: ${V}${R}`;i.setAttribute("title",Lt)}const r=document.getElementById("towerBadge"),c=document.getElementById("towerCountHeader");r&&c&&(Se>0?(r.style.display="flex",c.textContent=Se):r.style.display="none");const l=At();m(Aa,De(l));const d=document.getElementById("rpsChip");if(d){const R=D*I.deposit+F*I.savings+U*I.bond,ue=(q*E.villa+H*E.officetel+O*E.apartment+K*E.shop+V*E.building)*xe,le=X(R)+a("ui.currency")+"/s",re=X(ue)+a("ui.currency")+"/s",_e=`${a("header.tooltip.financialIncome",{amount:le})}
${a("header.tooltip.propertyIncome",{amount:re})}
${a("header.tooltip.marketMultiplier",{multiplier:Un})}`;d.setAttribute("title",_e)}bi(),m(Ua,be.toFixed(1)),m(Da,xe.toFixed(1)),console.log("=== GAME STATE DEBUG ==="),console.log("Cash:",S),console.log("Total clicks:",ge),console.log("Career level:",G),console.log("Financial products:",{deposits:D,savings:F,bonds:U,total:Ro()}),console.log("Properties:",{villas:q,officetels:H,apartments:O,shops:K,buildings:V,total:_t()}),console.log("========================");try{(typeof D!="number"||D<0)&&(console.warn("Invalid deposits value:",D,"resetting to 0"),D=0),(typeof F!="number"||F<0)&&(console.warn("Invalid savings value:",F,"resetting to 0"),F=0),(typeof U!="number"||U<0)&&(console.warn("Invalid bonds value:",U,"resetting to 0"),U=0);const R=At(),ue=ve==="buy"?Z("deposit",D,ae):Ct("deposit",D,ae),le=D*I.deposit,re=R>0?(le/R*100).toFixed(1):0;vs.textContent=D;const _e=a("ui.currency"),St=a("ui.unit.count"),Lt=B("deposit"),Vt=Math.floor(I.deposit).toLocaleString(Q()==="en"?"en-US":"ko-KR")+_e,Gt=Math.floor(le).toLocaleString(Q()==="en"?"en-US":"ko-KR")+_e,ao=Ne(ze),io=me(ue),Xo=document.querySelector("#depositItem .title");if(Xo){const Ae=Xo.querySelector('span[data-i18n="product.deposit"]');Ae?Ae.textContent=Lt:Xo.textContent=`💰 ${Lt}`}const wn=document.querySelectorAll("#depositItem .desc");if(wn.length>=4){const Ae=a("product.desc.perUnit",{product:Lt,amount:Vt});wn[0].innerHTML=`• ${Ae.replace(Vt,`<b>${Vt}</b>`)}`;const gt=a("product.desc.total",{count:D,unit:St,product:Lt,amount:Gt,percent:re});wn[1].innerHTML=`• ${gt.replace(Gt,`<b>${Gt}</b>`).replace(re+"%",`<b>${re}%</b>`)}`;const ft=a("product.desc.lifetime",{amount:ao});wn[2].innerHTML=`• ${ft.replace(ao,`<b>${ao}</b>`)}`;const pt=a("product.desc.currentPrice",{price:io});wn[3].innerHTML=pt.replace(io,`<b>${io}</b>`)}const na=document.getElementById("incomePerDeposit");na&&(na.textContent=Vt);const oa=document.getElementById("depositTotalIncome");oa&&(oa.textContent=Gt);const sa=document.getElementById("depositPercent");sa&&(sa.textContent=re+"%");const aa=document.getElementById("depositLifetime");aa&&(aa.textContent=ao),Cs&&(Cs.textContent=io);const Ji=ve==="buy"?Z("savings",F,ae):Ct("savings",F,ae),ia=F*I.savings,ro=R>0?(ia/R*100).toFixed(1):0;bs.textContent=F;const ra=a("ui.currency"),Qi=a("ui.unit.count"),Zo=B("savings"),co=Math.floor(I.savings).toLocaleString(Q()==="en"?"en-US":"ko-KR")+ra,lo=Math.floor(ia).toLocaleString(Q()==="en"?"en-US":"ko-KR")+ra,uo=Ne(Ye),mo=me(Ji),ca=document.querySelector("#savingsItem .title");ca&&(ca.textContent=`🏦 ${Zo}`);const _n=document.querySelectorAll("#savingsItem .desc");if(_n.length>=4){const Ae=a("product.desc.perUnit",{product:Zo,amount:co});_n[0].innerHTML=`• ${Ae.replace(co,`<b>${co}</b>`)}`;const gt=a("product.desc.total",{count:F,unit:Qi,product:Zo,amount:lo,percent:ro});_n[1].innerHTML=`• ${gt.replace(lo,`<b>${lo}</b>`).replace(ro+"%",`<b>${ro}%</b>`)}`;const ft=a("product.desc.lifetime",{amount:uo});_n[2].innerHTML=`• ${ft.replace(uo,`<b>${uo}</b>`)}`;const pt=a("product.desc.currentPrice",{price:mo});_n[3].innerHTML=pt.replace(mo,`<b>${mo}</b>`)}Na.textContent=co,document.getElementById("savingsTotalIncome").textContent=lo,document.getElementById("savingsPercent").textContent=ro+"%",document.getElementById("savingsLifetimeDisplay").textContent=uo,qa.textContent=mo;const Xi=ve==="buy"?Z("bond",U,ae):Ct("bond",U,ae),la=U*I.bond,go=R>0?(la/R*100).toFixed(1):0;ks.textContent=U;const da=a("ui.currency"),Zi=a("ui.unit.count"),es=B("bond"),fo=Math.floor(I.bond).toLocaleString(Q()==="en"?"en-US":"ko-KR")+da,po=Math.floor(la).toLocaleString(Q()==="en"?"en-US":"ko-KR")+da,yo=Ne(Je),ho=me(Xi),ua=document.querySelector("#bondItem .title");ua&&(ua.textContent=`📈 ${es}`);const Tn=document.querySelectorAll("#bondItem .desc");if(Tn.length>=4){const Ae=a("product.desc.perUnit",{product:es,amount:fo});Tn[0].innerHTML=`• ${Ae.replace(fo,`<b>${fo}</b>`)}`;const gt=a("product.desc.total",{count:U,unit:Zi,product:es,amount:po,percent:go});Tn[1].innerHTML=`• ${gt.replace(po,`<b>${po}</b>`).replace(go+"%",`<b>${go}%</b>`)}`;const ft=a("product.desc.lifetime",{amount:yo});Tn[2].innerHTML=`• ${ft.replace(yo,`<b>${yo}</b>`)}`;const pt=a("product.desc.currentPrice",{price:ho});Tn[3].innerHTML=pt.replace(ho,`<b>${ho}</b>`)}Oa.textContent=fo,document.getElementById("bondTotalIncome").textContent=po,document.getElementById("bondPercent").textContent=go+"%",document.getElementById("bondLifetimeDisplay").textContent=yo,Ha.textContent=ho;const er=ve==="buy"?Z("usStock",J,ae):Ct("usStock",J,ae),ma=J*I.usStock,$o=R>0?(ma/R*100).toFixed(1):0;document.getElementById("usStockCount").textContent=J;const ga=a("ui.currency"),tr=a("ui.unit.count"),ts=B("usStock"),vo=Math.floor(I.usStock).toLocaleString(Q()==="en"?"en-US":"ko-KR")+ga,bo=Math.floor(ma).toLocaleString(Q()==="en"?"en-US":"ko-KR")+ga,ko=Ne(Qe),So=me(er),fa=document.querySelector("#usStockItem .title");fa&&(fa.textContent=`🇺🇸 ${ts}`);const xn=document.querySelectorAll("#usStockItem .desc");if(xn.length>=4){const Ae=a("product.desc.perUnit",{product:ts,amount:vo});xn[0].innerHTML=`• ${Ae.replace(vo,`<b>${vo}</b>`)}`;const gt=a("product.desc.total",{count:J,unit:tr,product:ts,amount:bo,percent:$o});xn[1].innerHTML=`• ${gt.replace(bo,`<b>${bo}</b>`).replace($o+"%",`<b>${$o}%</b>`)}`;const ft=a("product.desc.lifetime",{amount:ko});xn[2].innerHTML=`• ${ft.replace(ko,`<b>${ko}</b>`)}`;const pt=a("product.desc.currentPrice",{price:So});xn[3].innerHTML=pt.replace(So,`<b>${So}</b>`)}document.getElementById("incomePerUsStock").textContent=vo,document.getElementById("usStockTotalIncome").textContent=bo,document.getElementById("usStockPercent").textContent=$o+"%",document.getElementById("usStockLifetimeDisplay").textContent=ko,document.getElementById("usStockCurrentPrice").textContent=So;const nr=ve==="buy"?Z("crypto",z,ae):Ct("crypto",z,ae),pa=z*I.crypto,Lo=R>0?(pa/R*100).toFixed(1):0;document.getElementById("cryptoCount").textContent=z;const ya=a("ui.currency"),or=a("ui.unit.count"),ns=B("crypto"),Co=Math.floor(I.crypto).toLocaleString(Q()==="en"?"en-US":"ko-KR")+ya,Io=Math.floor(pa).toLocaleString(Q()==="en"?"en-US":"ko-KR")+ya,Eo=Ne(Xe),wo=me(nr),ha=document.querySelector("#cryptoItem .title");ha&&(ha.textContent=`₿ ${ns}`);const Bn=document.querySelectorAll("#cryptoItem .desc");if(Bn.length>=4){const Ae=a("product.desc.perUnit",{product:ns,amount:Co});Bn[0].innerHTML=`• ${Ae.replace(Co,`<b>${Co}</b>`)}`;const gt=a("product.desc.total",{count:z,unit:or,product:ns,amount:Io,percent:Lo});Bn[1].innerHTML=`• ${gt.replace(Io,`<b>${Io}</b>`).replace(Lo+"%",`<b>${Lo}%</b>`)}`;const ft=a("product.desc.lifetime",{amount:Eo});Bn[2].innerHTML=`• ${ft.replace(Eo,`<b>${Eo}</b>`)}`;const pt=a("product.desc.currentPrice",{price:wo});Bn[3].innerHTML=pt.replace(wo,`<b>${wo}</b>`)}document.getElementById("incomePerCrypto").textContent=Co,document.getElementById("cryptoTotalIncome").textContent=Io,document.getElementById("cryptoPercent").textContent=Lo+"%",document.getElementById("cryptoLifetimeDisplay").textContent=Eo,document.getElementById("cryptoCurrentPrice").textContent=wo,console.log("=== FINANCIAL PRODUCTS DEBUG ==="),console.log("Financial counts:",{deposits:D,savings:F,bonds:U,usStocks:J,cryptos:z}),console.log("Total financial products:",Ro()),console.log("Financial elements:",{depositCount:vs,savingsCount:bs,bondCount:ks}),console.log("================================")}catch(R){console.error("Financial products UI update failed:",R),console.error("Error details:",{deposits:D,savings:F,bonds:U})}const g=At(),h=ve==="buy"?Y("villa",q,ae):It("villa",q,ae),$=q*E.villa,b=g>0?($/g*100).toFixed(1):0;za.textContent=q;const P=a("ui.currency"),C=a("ui.unit.property"),f=B("villa"),y=Math.floor(E.villa).toLocaleString(Q()==="en"?"en-US":"ko-KR")+P,p=Math.floor($).toLocaleString(Q()==="en"?"en-US":"ko-KR")+P,M=Ne(Ze),j=Ee(h),de=document.querySelector("#villaItem .title");de&&(de.textContent=`🏘️ ${f}`);const N=document.querySelectorAll("#villaItem .desc");if(N.length>=4){const R=a("product.desc.perUnit",{product:f,amount:y});N[0].innerHTML=`• ${R.replace(y,`<b>${y}</b>`)}`;const ue=a("product.desc.total",{count:q,unit:C,product:f,amount:p,percent:b});N[1].innerHTML=`• ${ue.replace(p,`<b>${p}</b>`).replace(b+"%",`<b>${b}%</b>`)}`;const le=a("product.desc.lifetime",{amount:M});N[2].innerHTML=`• ${le.replace(M,`<b>${M}</b>`)}`;const re=a("product.desc.currentPrice",{price:j});N[3].innerHTML=re.replace(j,`<b>${j}</b>`)}Ya.textContent=y,document.getElementById("villaTotalIncome").textContent=p,document.getElementById("villaPercent").textContent=b+"%",document.getElementById("villaLifetimeDisplay").textContent=M,Ka.textContent=j;const ee=ve==="buy"?Y("officetel",H,ae):It("officetel",H,ae),ce=H*E.officetel,Me=g>0?(ce/g*100).toFixed(1):0;Ja.textContent=H;const W=a("ui.currency"),Pe=a("ui.unit.property"),kt=B("officetel"),ct=Math.floor(E.officetel).toLocaleString(Q()==="en"?"en-US":"ko-KR")+W,lt=Math.floor(ce).toLocaleString(Q()==="en"?"en-US":"ko-KR")+W,dt=Ne(et),ut=Ee(ee),xt=document.querySelector("#officetelItem .title");xt&&(xt.textContent=`🏢 ${kt}`);const Ve=document.querySelectorAll("#officetelItem .desc");if(Ve.length>=4){const R=a("product.desc.perUnit",{product:kt,amount:ct});Ve[0].innerHTML=`• ${R.replace(ct,`<b>${ct}</b>`)}`;const ue=a("product.desc.total",{count:H,unit:Pe,product:kt,amount:lt,percent:Me});Ve[1].innerHTML=`• ${ue.replace(lt,`<b>${lt}</b>`).replace(Me+"%",`<b>${Me}%</b>`)}`;const le=a("product.desc.lifetime",{amount:dt});Ve[2].innerHTML=`• ${le.replace(dt,`<b>${dt}</b>`)}`;const re=a("product.desc.currentPrice",{price:ut});Ve[3].innerHTML=re.replace(ut,`<b>${ut}</b>`)}Qa.textContent=ct,document.getElementById("officetelTotalIncome").textContent=lt,document.getElementById("officetelPercent").textContent=Me+"%",document.getElementById("officetelLifetimeDisplay").textContent=dt,Va.textContent=ut;const e=ve==="buy"?Y("apartment",O,ae):It("apartment",O,ae),o=O*E.apartment,L=g>0?(o/g*100).toFixed(1):0;Xa.textContent=O;const A=a("ui.currency"),ke=a("ui.unit.property"),pe=B("apartment"),u=Math.floor(E.apartment).toLocaleString(Q()==="en"?"en-US":"ko-KR")+A,Ue=Math.floor(o).toLocaleString(Q()==="en"?"en-US":"ko-KR")+A,Ge=Ne(tt),te=Ee(e),qt=document.querySelector("#aptItem .title");qt&&(qt.textContent=`🏬 ${pe}`);const mt=document.querySelectorAll("#aptItem .desc");if(mt.length>=4){const R=a("product.desc.perUnit",{product:pe,amount:u});mt[0].innerHTML=`• ${R.replace(u,`<b>${u}</b>`)}`;const ue=a("product.desc.total",{count:O,unit:ke,product:pe,amount:Ue,percent:L});mt[1].innerHTML=`• ${ue.replace(Ue,`<b>${Ue}</b>`).replace(L+"%",`<b>${L}%</b>`)}`;const le=a("product.desc.lifetime",{amount:Ge});mt[2].innerHTML=`• ${le.replace(Ge,`<b>${Ge}</b>`)}`;const re=a("product.desc.currentPrice",{price:te});mt[3].innerHTML=re.replace(te,`<b>${te}</b>`)}Za.textContent=u,document.getElementById("aptTotalIncome").textContent=Ue,document.getElementById("aptPercent").textContent=L+"%",document.getElementById("aptLifetimeDisplay").textContent=Ge,Ga.textContent=te;const Yo=ve==="buy"?Y("shop",K,ae):It("shop",K,ae),Yn=K*E.shop,Ht=g>0?(Yn/g*100).toFixed(1):0;ei.textContent=K;const Kt=a("ui.currency"),We=a("ui.unit.property"),Jo=B("shop"),Jn=Math.floor(E.shop).toLocaleString(Q()==="en"?"en-US":"ko-KR")+Kt,Qn=Math.floor(Yn).toLocaleString(Q()==="en"?"en-US":"ko-KR")+Kt,Xn=Ne(nt),Zn=Ee(Yo),Js=document.querySelector("#shopItem .title");Js&&(Js.textContent=`🏪 ${Jo}`);const Cn=document.querySelectorAll("#shopItem .desc");if(Cn.length>=4){const R=a("product.desc.perUnit",{product:Jo,amount:Jn});Cn[0].innerHTML=`• ${R.replace(Jn,`<b>${Jn}</b>`)}`;const ue=a("product.desc.total",{count:K,unit:We,product:Jo,amount:Qn,percent:Ht});Cn[1].innerHTML=`• ${ue.replace(Qn,`<b>${Qn}</b>`).replace(Ht+"%",`<b>${Ht}%</b>`)}`;const le=a("product.desc.lifetime",{amount:Xn});Cn[2].innerHTML=`• ${le.replace(Xn,`<b>${Xn}</b>`)}`;const re=a("product.desc.currentPrice",{price:Zn});Cn[3].innerHTML=re.replace(Zn,`<b>${Zn}</b>`)}ti.textContent=Jn,document.getElementById("shopTotalIncome").textContent=Qn,document.getElementById("shopPercent").textContent=Ht+"%",document.getElementById("shopLifetimeDisplay").textContent=Xn,Wa.textContent=Zn;const ji=ve==="buy"?Y("building",V,ae):It("building",V,ae),Qs=V*E.building,eo=g>0?(Qs/g*100).toFixed(1):0;ni.textContent=V;const Xs=a("ui.currency"),zi=a("ui.unit.property"),Qo=B("building"),to=Math.floor(E.building).toLocaleString(Q()==="en"?"en-US":"ko-KR")+Xs,no=Math.floor(Qs).toLocaleString(Q()==="en"?"en-US":"ko-KR")+Xs,oo=Ne(ot),so=Ee(ji),Zs=document.querySelector("#buildingItem .title");Zs&&(Zs.textContent=`🏙️ ${Qo}`);const In=document.querySelectorAll("#buildingItem .desc");if(In.length>=4){const R=a("product.desc.perUnit",{product:Qo,amount:to});In[0].innerHTML=`• ${R.replace(to,`<b>${to}</b>`)}`;const ue=a("product.desc.total",{count:V,unit:zi,product:Qo,amount:no,percent:eo});In[1].innerHTML=`• ${ue.replace(no,`<b>${no}</b>`).replace(eo+"%",`<b>${eo}%</b>`)}`;const le=a("product.desc.lifetime",{amount:oo});In[2].innerHTML=`• ${le.replace(oo,`<b>${oo}</b>`)}`;const re=a("product.desc.currentPrice",{price:so});In[3].innerHTML=re.replace(so,`<b>${so}</b>`)}oi.textContent=to,document.getElementById("buildingTotalIncome").textContent=no,document.getElementById("buildingPercent").textContent=eo+"%",document.getElementById("buildingLifetimeDisplay").textContent=oo,ja.textContent=so;const Yi=B("tower");a("ui.unit.count");const ea=Ee(jt.tower),ta=document.querySelector("#towerItem .title");ta&&(ta.textContent=`🗼 ${Yi}`);const En=document.querySelectorAll("#towerItem .desc");En.length>=4&&(En[0].innerHTML=`• ${a("tower.desc.prestige")}`,En[1].innerHTML=`• ${a("tower.desc.owned",{count:Se})}`,En[2].innerHTML=`• ${a("tower.desc.leaderboard",{count:Se})}`,En[3].innerHTML=`${a("product.desc.currentPrice",{price:ea})}`),Is&&(Is.textContent=Se),Es&&(Es.textContent=Se),ws&&(ws.textContent=ea),console.log("Property counts:",{villas:q,officetels:H,apartments:O,shops:K,buildings:V}),Ut(),gi(),fi(),di(),Oo(),Di()}let No=null;function bi(){var t,n;try{const s=Date.now(),i=!!(ye&&Oe>s),r=i?Math.max(0,Math.ceil((Oe-s)/1e3)):0,c=document.getElementById("marketEventBar");if(c)if(!i)c.classList.remove("is-visible"),c.textContent="";else{c.classList.add("is-visible");const l=ye!=null&&ye.name?String(ye.name):a("ui.marketEvent"),d=Math.floor((Oe-s)/1e3),g=d>=0?`${d}${a("ui.second",{},"초")}`:`0${a("ui.second",{},"초")}`,h=(p,M)=>p?Object.entries(p).filter(([,j])=>j!==1).slice(0,5).map(([j,de])=>`${M[j]??j} x${(Math.round(de*10)/10).toString().replace(/\.0$/,"")}`):[],$={deposit:B("deposit"),savings:B("savings"),bond:B("bond"),usStock:B("usStock"),crypto:B("crypto")},b={villa:B("villa"),officetel:B("officetel"),apartment:B("apartment"),shop:B("shop"),building:B("building")},P=h((t=ye==null?void 0:ye.effects)==null?void 0:t.financial,$),C=h((n=ye==null?void 0:ye.effects)==null?void 0:n.property,b),f=[...P,...C].slice(0,5),y=f.length?` · ${f.join(", ")}`:"";c.innerHTML=`📈 <b>${l}</b> · ${a("ui.remaining")} <span class="good">${g}</span>${y}`}No||(No=[{rowId:"depositItem",category:"financial",type:"deposit"},{rowId:"savingsItem",category:"financial",type:"savings"},{rowId:"bondItem",category:"financial",type:"bond"},{rowId:"usStockItem",category:"financial",type:"usStock"},{rowId:"cryptoItem",category:"financial",type:"crypto"},{rowId:"villaItem",category:"property",type:"villa"},{rowId:"officetelItem",category:"property",type:"officetel"},{rowId:"aptItem",category:"property",type:"apartment"},{rowId:"shopItem",category:"property",type:"shop"},{rowId:"buildingItem",category:"property",type:"building"}].map(d=>{const g=document.getElementById(d.rowId);if(!g)return null;const h=g.querySelector("button.btn");if(!h)return null;let $=g.querySelector(".event-mult-badge");return $||($=document.createElement("span"),$.className="event-mult-badge",$.setAttribute("aria-hidden","true"),g.insertBefore($,h)),{...d,row:g,badge:$}}).filter(Boolean));for(const l of No){const d=i?Fo(l.type,l.category):1,g=Math.abs(d-1)<1e-9;if(l.row.classList.remove("event-bull","event-bear"),l.badge.classList.remove("is-visible","is-bull","is-bear"),l.badge.removeAttribute("title"),!i||g){l.badge.textContent="";continue}const $=`x${(Math.round(d*10)/10).toFixed(1).replace(/\.0$/,"")}`;l.badge.textContent=$,l.badge.classList.add("is-visible"),d>1?(l.row.classList.add("event-bull"),l.badge.classList.add("is-bull")):(l.row.classList.add("event-bear"),l.badge.classList.add("is-bear"));const b=ye!=null&&ye.name?String(ye.name):"시장 이벤트";l.badge.title=`${b} · 남은 ${r}초 · ${$}`}}catch{}}setTimeout(()=>{Pi()},100);function Oo(){const t={savings:"예금 1개 필요",bond:"적금 1개 필요",usStock:"국내주식 1개 필요",crypto:"미국주식 1개 필요",villa:"코인 1개 필요",officetel:"빌라 1채 필요",apartment:"오피스텔 1채 필요",shop:"아파트 1채 필요",building:"상가 1채 필요",tower:"CEO 달성 및 빌딩 1개 이상 필요"},n=document.getElementById("savingsItem"),s=document.getElementById("bondItem");if(n){const b=!oe("savings");n.classList.toggle("locked",b),b?n.setAttribute("data-unlock-hint",t.savings):n.removeAttribute("data-unlock-hint")}if(s){const b=!oe("bond");s.classList.toggle("locked",b),b?s.setAttribute("data-unlock-hint",t.bond):s.removeAttribute("data-unlock-hint")}const i=document.getElementById("usStockItem"),r=document.getElementById("cryptoItem");if(i){const b=!oe("usStock");i.classList.toggle("locked",b),b?i.setAttribute("data-unlock-hint",t.usStock):i.removeAttribute("data-unlock-hint")}if(r){const b=!oe("crypto");r.classList.toggle("locked",b),b?r.setAttribute("data-unlock-hint",t.crypto):r.removeAttribute("data-unlock-hint")}const c=document.getElementById("villaItem"),l=document.getElementById("officetelItem"),d=document.getElementById("aptItem"),g=document.getElementById("shopItem"),h=document.getElementById("buildingItem");if(c){const b=!oe("villa");c.classList.toggle("locked",b),b?c.setAttribute("data-unlock-hint",t.villa):c.removeAttribute("data-unlock-hint")}if(l){const b=!oe("officetel");l.classList.toggle("locked",b),b?l.setAttribute("data-unlock-hint",t.officetel):l.removeAttribute("data-unlock-hint")}if(d){const b=!oe("apartment");d.classList.toggle("locked",b),b?d.setAttribute("data-unlock-hint",t.apartment):d.removeAttribute("data-unlock-hint")}if(g){const b=!oe("shop");g.classList.toggle("locked",b),b?g.setAttribute("data-unlock-hint",t.shop):g.removeAttribute("data-unlock-hint")}if(h){const b=!oe("building");h.classList.toggle("locked",b),b?h.setAttribute("data-unlock-hint",t.building):h.removeAttribute("data-unlock-hint")}const $=document.getElementById("towerItem");if($){const b=!oe("tower");$.classList.toggle("locked",b),b?$.setAttribute("data-unlock-hint",t.tower):$.removeAttribute("data-unlock-hint")}}Po.addEventListener("click",()=>{ve="buy",Po.classList.add("active"),Ao.classList.remove("active"),Ut()}),Ao.addEventListener("click",()=>{ve="sell",Ao.classList.add("active"),Po.classList.remove("active"),Ut()}),Dn.addEventListener("click",()=>{ae=1,Dn.classList.add("active"),Nn.classList.remove("active"),On.classList.remove("active"),Ut()}),Nn.addEventListener("click",()=>{ae=5,Nn.classList.add("active"),Dn.classList.remove("active"),On.classList.remove("active"),Ut()}),On.addEventListener("click",()=>{ae=10,On.classList.add("active"),Dn.classList.remove("active"),Nn.classList.remove("active"),Ut()}),en.addEventListener("click",()=>{const t=document.getElementById("upgradeList");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),en.textContent="▼",en.classList.remove("collapsed")):(t.classList.add("collapsed-section"),en.textContent="▶",en.classList.add("collapsed"))}),tn.addEventListener("click",()=>{const t=document.getElementById("financialSection");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),tn.textContent="▼",tn.classList.remove("collapsed")):(t.classList.add("collapsed-section"),tn.textContent="▶",tn.classList.add("collapsed"))}),nn.addEventListener("click",()=>{const t=document.getElementById("propertySection");t.classList.contains("collapsed-section")?(t.classList.remove("collapsed-section"),nn.textContent="▼",nn.classList.remove("collapsed")):(t.classList.add("collapsed-section"),nn.textContent="▶",nn.classList.add("collapsed"))});function Ut(){const t=ve==="buy",n=ae;Ke(Yt,"financial","deposit",D,t,n),Ke(Jt,"financial","savings",F,t,n),Ke(Qt,"financial","bond",U,t,n),Ke(Xt,"financial","usStock",J,t,n),Ke(Zt,"financial","crypto",z,t,n),Ke(on,"property","villa",q,t,n),Ke(sn,"property","officetel",H,t,n),Ke(an,"property","apartment",O,t,n),Ke(rn,"property","shop",K,t,n),Ke(cn,"property","building",V,t,n)}function Ke(t,n,s,i,r,c){if(!t)return;const l=r?n==="financial"?Z(s,i,c):Y(s,i,c):n==="financial"?Ct(s,i,c):It(s,i,c),d=a(r?"button.buy":"button.sell"),g=c>1?` x${c}`:"";if(t.textContent=`${d}${g}`,r)t.style.background="",t.disabled=S<l;else{const h=i>=c;t.style.background=h?"var(--bad)":"var(--muted)",t.disabled=!h}}function ki(t,n){let s=mn();ne.performance_bonus&&ne.performance_bonus.purchased&&Math.random()<.02&&(s*=10,_(a("msg.bonusPaid"))),Le.particles&&Ii(t??0,n??0),S+=s,ge+=1,st+=s;const i=Object.entries(ne).filter(([c,l])=>l.category==="labor"&&!l.unlocked&&!l.purchased).map(([c,l])=>{var $;const d=l.unlockCondition.toString(),g=d.match(/totalClicks\s*>=\s*(\d+)/);if(g)return{id:c,requiredClicks:parseInt(g[1]),upgrade:l};const h=d.match(/careerLevel\s*>=\s*(\d+)/);return h?{id:c,requiredClicks:(($=Et[parseInt(h[1])])==null?void 0:$.requiredClicks)||1/0,upgrade:l}:null}).filter(c=>c!==null).sort((c,l)=>c.requiredClicks-l.requiredClicks);if(i.length>0){const c=i[0],l=c.requiredClicks-ge;(l===50||l===25||l===10||l===5)&&_(a("msg.nextUpgradeHint",{name:a(`upgrade.${c.id}.name`),remaining:l}))}xs()&&fe(),ui(),wt.classList.add("click-effect"),setTimeout(()=>wt.classList.remove("click-effect"),300),Ei(s),fe()}wt.addEventListener("click",t=>{ki(t.clientX,t.clientY)});let qo=null;function Tt(){vt&&(vt.classList.add("game-modal-hidden"),qo=null)}function $e(t,n,s="ℹ️"){if(!vt||!at||!it||!Be||!we){alert(n);return}vt.classList.remove("game-modal-hidden");const i=at.querySelector(".icon"),r=at.querySelector(".text");i&&(i.textContent=s),r&&(r.textContent=t),it.textContent=n,we.style.display="none",Be.textContent=a("button.confirm"),Be.onclick=()=>{Tt()},we.onclick=()=>{Tt()}}function pn(t,n,s,i={}){if(!vt||!at||!it||!Be||!we){confirm(n)&&typeof s=="function"&&s();return}vt.classList.remove("game-modal-hidden");const r=at.querySelector(".icon"),c=at.querySelector(".text");r&&(r.textContent=i.icon||"⚠️"),c&&(c.textContent=t),it.textContent=n,we.style.display="inline-flex",Be.textContent=i.primaryLabel||a("button.yes"),we.textContent=i.secondaryLabel||a("button.no"),qo=typeof s=="function"?s:null,Be.onclick=()=>{const l=qo;Tt(),l&&l()},we.onclick=()=>{Tt(),i.onCancel&&typeof i.onCancel=="function"&&i.onCancel()}}function Si(t,n,s,i={}){if(!vt||!at||!it||!Be||!we){const g=prompt(n);g&&typeof s=="function"&&s(g.trim());return}vt.classList.remove("game-modal-hidden");const r=at.querySelector(".icon"),c=at.querySelector(".text");r&&(r.textContent=i.icon||"✏️"),c&&(c.textContent=t);let l=it.querySelector(".game-modal-input");if(l?l.value="":(l=document.createElement("input"),l.type="text",l.className="game-modal-input",it.innerHTML="",it.appendChild(l)),l.placeholder=i.placeholder||l.placeholder||a("modal.nickname.placeholder"),typeof i.maxLength=="number"?l.maxLength=i.maxLength:(!l.maxLength||l.maxLength<=0)&&(l.maxLength=20),n){const g=document.createElement("div");g.textContent=n,g.style.marginBottom="10px",g.style.color="var(--muted)",it.insertBefore(g,l)}i.secondaryLabel?(we.style.display="inline-flex",we.textContent=i.secondaryLabel):we.style.display="none",Be.textContent=i.primaryLabel||a("ui.confirm");const d=g=>{g.key==="Enter"&&(g.preventDefault(),Be.click())};l.addEventListener("keydown",d),l.focus(),Be.onclick=()=>{const g=l.value.trim();if(!g&&i.required!==!1){l.style.borderColor="var(--bad)",setTimeout(()=>{l.style.borderColor=""},1e3);return}l.removeEventListener("keydown",d),Tt(),typeof s=="function"&&s(g||i.defaultValue||"익명")},i.secondaryLabel?we.onclick=()=>{l.removeEventListener("keydown",d),Tt(),i.onCancel&&typeof i.onCancel=="function"&&i.onCancel()}:we.onclick=null}async function Li(){const t=window.location.href,n="Capital Clicker: Seoul Survival",s=`💰 부동산과 금융 투자로 부자가 되는 게임!
현재 자산: ${he(S)}
초당 수익: ${he(At())}`;if(!navigator.share){_("❌ 이 기기/브라우저에서는 공유하기를 지원하지 않습니다.");return}try{await navigator.share({title:n,text:s,url:t}),_("✅ 게임이 공유되었습니다!")}catch(i){(i==null?void 0:i.name)!=="AbortError"&&(console.error("공유 실패:",i),_("❌ 공유에 실패했습니다."))}}hs?hs.addEventListener("click",Li):console.error("공유 버튼을 찾을 수 없습니다.");function Ci(){const t=window.location.href,n=document.title||"Capital Clicker: Seoul Survival",s=navigator.userAgent.toLowerCase(),i=/iphone|ipad|ipod|android/.test(s),r=/iphone|ipad|ipod/.test(s),c=/android/.test(s),l=navigator.platform.toUpperCase().includes("MAC");if(window.external&&typeof window.external.AddFavorite=="function")try{window.external.AddFavorite(t,n),_("⭐ 즐겨찾기에 추가되었습니다.");return}catch{}let d="",g="즐겨찾기 / 홈 화면에 추가",h="⭐";i?r?d=`iPhone/iPad에서는 Safari 하단의 공유 버튼(□↑)을 누른 뒤
"홈 화면에 추가"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.`:c?d=`Android에서는 브라우저 오른쪽 위 메뉴(⋮)에서
"홈 화면에 추가" 또는 "앱 설치"를 선택하면 바탕화면에 게임 아이콘이 만들어집니다.`:d='이 기기에서는 브라우저의 메뉴에서 "홈 화면에 추가" 기능을 사용해 주세요.':d=`${l?"⌘ + D":"Ctrl + D"} 를 눌러 이 페이지를 브라우저 즐겨찾기에 추가할 수 있습니다.`,$e(g,d,h)}$s&&$s.addEventListener("click",Ci),Ls&&Ls.addEventListener("click",qn);const Ms=document.getElementById("resetBtnSettings");Ms&&Ms.addEventListener("click",qn);function Ii(t,n){const s=document.createElement("div");s.className="falling-cookie",s.textContent="💵",s.style.left=t+Math.random()*100-50+"px",s.style.top=n-100+"px",document.body.appendChild(s),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},2e3)}function Ps(t,n){for(let s=0;s<Math.min(n,5);s++)setTimeout(()=>{const i=document.createElement("div");i.className="falling-cookie",i.textContent=t,i.style.left=Math.random()*window.innerWidth+"px",i.style.top="-100px",document.body.appendChild(i),setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},2e3)},s*200)}function Ei(t){const n=document.createElement("div");n.className="income-increase";const s=T(t);n.textContent=a("ui.incomeFormat",{amount:s});const i=wt.getBoundingClientRect(),r=wt.parentElement.getBoundingClientRect();n.style.position="absolute",n.style.left=i.left-r.left+Math.random()*100-50+"px",n.style.top=i.top-r.top-50+"px",n.style.zIndex="1000",n.style.pointerEvents="none",wt.parentElement.style.position="relative",wt.parentElement.appendChild(n),n.style.opacity="1",n.style.transform="translateY(0px) scale(1)",setTimeout(()=>{n.style.transition="all 1.5s ease-out",n.style.opacity="0",n.style.transform="translateY(-80px) scale(1.2)"},100),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},1600)}Yt.addEventListener("click",()=>{if(!oe("deposit")){_("❌ 예금은 아직 잠겨있습니다.");return}const t=x("financial","deposit",D);t.success&&(D=t.newCount,He(Yt),qe("deposit")),fe()}),Jt.addEventListener("click",()=>{if(!oe("savings")){_(a("msg.unlock.savings"));return}const t=x("financial","savings",F);t.success&&(F=t.newCount,He(Jt),qe("savings")),fe()}),Qt.addEventListener("click",()=>{if(!oe("bond")){_(a("msg.unlock.bond"));return}const t=x("financial","bond",U);t.success&&(U=t.newCount,He(Qt),qe("bond")),fe()}),Xt.addEventListener("click",()=>{if(!oe("usStock")){_("❌ 미국주식은 국내주식을 1개 이상 보유해야 해금됩니다.");return}const t=x("financial","usStock",J);t.success&&(J=t.newCount,He(Xt),qe("usStock")),fe()}),Zt.addEventListener("click",()=>{if(!oe("crypto")){_("❌ 코인은 미국주식을 1개 이상 보유해야 해금됩니다.");return}const t=x("financial","crypto",z);t.success&&(z=t.newCount,He(Zt),qe("crypto")),fe()}),on.addEventListener("click",()=>{if(!oe("villa")){_("❌ 빌라는 코인을 1개 이상 보유해야 해금됩니다.");return}const t=x("property","villa",q);t.success&&(q=t.newCount,He(on),qe("villa")),fe()}),sn.addEventListener("click",()=>{if(!oe("officetel")){_("❌ 오피스텔은 빌라를 1개 이상 보유해야 해금됩니다.");return}const t=x("property","officetel",H);t.success&&(H=t.newCount,He(sn),qe("officetel")),fe()}),an.addEventListener("click",()=>{if(!oe("apartment")){_("❌ 아파트는 오피스텔을 1개 이상 보유해야 해금됩니다.");return}const t=x("property","apartment",O);t.success&&(O=t.newCount,He(an),qe("apartment")),fe()}),rn.addEventListener("click",()=>{if(!oe("shop")){_("❌ 상가는 아파트를 1개 이상 보유해야 해금됩니다.");return}const t=x("property","shop",K);t.success&&(K=t.newCount,He(rn),qe("shop")),fe()}),cn.addEventListener("click",()=>{if(!oe("building")){_("❌ 빌딩은 상가를 1개 이상 보유해야 해금됩니다.");return}const t=x("property","building",V);t.success&&(V=t.newCount,He(cn),qe("building")),fe()}),Mt&&Mt.addEventListener("click",async()=>{if(!oe("tower")){_("❌ 서울타워는 CEO 달성 및 빌딩 1개 이상 보유 시 해금됩니다.");return}const t=jt.tower;if(S<t){_(`💸 자금이 부족합니다. (필요: ${T(t)}원)`);return}S-=t,Se+=1;const n=S+Ln(),s=Date.now()-Fe,i=Re+s;if(ie)try{await as(ie,n,i,Se),console.log("리더보드: 서울타워 구매 시점 자산으로 업데이트 완료")}catch(r){console.error("리더보드 업데이트 실패:",r)}_(`🗼 서울타워 완성.
서울의 정상에 도달했다.
이제야 진짜 시작인가?`),wi(Se),Le.particles&&Ps("🗼",1),fe(),fn()});function wi(t){const n=`🗼 서울타워 완성 🗼

알바에서 시작해 CEO까지.
예금에서 시작해 서울타워까지.

서울 한복판에 당신의 이름이 새겨졌다.

"이제야 진짜 시작인가?"

리더보드에 기록되었습니다: 🗼x${t}`;$e("🎉 엔딩",n,"🗼"),Be.onclick,Be.onclick=()=>{Tt(),pn("🔄 새 게임 시작",`서울타워를 완성했습니다!

새 게임을 시작하시겠습니까?
(현재 진행은 초기화됩니다)`,()=>{qn(),_("🗼 새로운 시작. 다시 한 번.")},{icon:"🗼",primaryLabel:"새 게임 시작",secondaryLabel:a("button.later")})}}document.addEventListener("keydown",t=>{t.ctrlKey&&t.shiftKey&&t.key==="R"&&(t.preventDefault(),qn()),t.ctrlKey&&t.key==="s"&&(t.preventDefault(),fn(),_(a("msg.manualSave"))),t.ctrlKey&&t.key==="o"&&(t.preventDefault(),Dt&&Dt.click())});const As=50;setInterval(()=>{ri(),ci(),Ts();const t=As/1e3;S+=At()*t,ze+=D*I.deposit*t,Ye+=F*I.savings*t,Je+=U*I.bond*t,Qe+=J*I.usStock*t,Xe+=z*I.crypto*t,Ze+=q*E.villa*t,et+=H*E.officetel*t,tt+=O*E.apartment*t,nt+=K*E.shop*t,ot+=V*E.building*t,fe()},As),setInterval(()=>{fn()},5e3),setInterval(()=>{if(Fn){const t=mn();if(S+=t,ge+=1,st+=t,xs(),ne.performance_bonus&&ne.performance_bonus.purchased&&Math.random()<.02){const n=t*9;S+=n,st+=n}}},1e3),setInterval(()=>{Oe===0&&ai()},Math.random()*18e4+12e4),hi();const Rs=document.getElementById("currentYear");Rs&&(Rs.textContent=new Date().getFullYear()),(async()=>yi()?(_(a("msg.gameLoaded")),Ft()):(_(a("msg.welcome")),await Hs()||Ft()))();const Ho=gn();Ce&&Ho&&Ho.bgImage&&(Ce.style.backgroundImage=`url('${Ho.bgImage}')`);const Hn=document.getElementById("toggleParticles"),Kn=document.getElementById("toggleFancyGraphics"),Vn=document.getElementById("toggleShortNumbers");Hn&&(Hn.checked=Le.particles),Kn&&(Kn.checked=Le.fancyGraphics),Vn&&(Vn.checked=Le.shortNumbers);function _i(){const t=document.getElementById("currentCareer");t&&m(t,zt(G)),fe(),Ws(),Bs()}const Ko=document.getElementById("languageSelect");Ko&&(Ko.value=Q(),Ko.addEventListener("change",t=>{const n=t.target.value;is(n),va(),_i()}));const Fs=document.getElementById("exportSaveBtn"),Us=document.getElementById("importSaveBtn"),Dt=document.getElementById("importFileInput"),Ds=document.getElementById("cloudUploadBtn"),Ns=document.getElementById("cloudDownloadBtn");Fs&&Fs.addEventListener("click",$i),Us&&Us.addEventListener("click",()=>{Dt&&Dt.click()}),Dt&&Dt.addEventListener("change",t=>{const n=t.target.files[0];n&&vi(n)});let yn=null,Vo=0,Gn=null,Go=null;function Ti(){const t=document.getElementById("cloudLastSync");if(!t)return;if(!Go){t.textContent="--:--";return}const n=Q()==="en"?"en-US":"ko-KR";t.textContent=Go.toLocaleTimeString(n,{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function Os(t){const n=document.getElementById("cloudSaveHint");!n||!t||(n.textContent=t)}async function qs(t="flush"){if(!Gn||!yn)return;const n=yn;yn=null;const s=Number((n==null?void 0:n.ts)||Date.now())||Date.now();if(s&&s<=Vo)return;const i=await ba("seoulsurvival",n);if(!i.ok){Os(`자동 동기화 실패(나중에 재시도). 이유: ${i.reason||"unknown"}`);return}Vo=s,Go=new Date,Ti(),Os("자동 동기화 완료 ✅")}async function xi(){var r;if(!await je()){$e(a("modal.error.loginRequired.title"),a("modal.error.loginRequired.message"),"🔐");return}const n=localStorage.getItem(Te);if(!n){$e(a("modal.error.noSaveData.title"),a("modal.error.noSaveData.message"),"💾");return}let s;try{s=JSON.parse(n)}catch{$e(a("modal.error.invalidSaveData.title"),a("modal.error.invalidSaveData.message"),"⚠️");return}const i=await ba("seoulsurvival",s);if(!i.ok){if(i.reason==="missing_table"){$e(a("modal.error.cloudTableMissing.title"),a("modal.error.cloudTableMissing.message"),"🛠️");return}$e(a("modal.error.uploadFailed.title"),a("modal.error.uploadFailed.message",{error:((r=i.error)==null?void 0:r.message)||""}),"⚠️");return}_(a("msg.cloudSaved")),$e(a("modal.info.cloudSaveComplete.title"),a("modal.info.cloudSaveComplete.message"),"☁️")}async function Bi(){var r,c;if(!await je()){$e(a("modal.error.loginRequired.title"),a("modal.error.loginRequired.message"),"🔐");return}const n=await ss("seoulsurvival");if(!n.ok){if(n.reason==="missing_table"){$e(a("modal.error.cloudTableMissing.title"),a("modal.error.cloudTableMissing.message"),"🛠️");return}$e(a("modal.error.downloadFailed.title"),a("modal.error.downloadFailed.message",{error:((r=n.error)==null?void 0:r.message)||""}),"⚠️");return}if(!n.found){$e(a("modal.error.noCloudSave.title"),a("modal.error.noCloudSave.message"),"☁️");return}const s=Q()==="en"?"en-US":"ko-KR",i=(c=n.save)!=null&&c.saveTime?new Date(n.save.saveTime).toLocaleString(s):n.updated_at?new Date(n.updated_at).toLocaleString(s):a("ui.noTimeInfo");pn(a("modal.confirm.cloudLoad.title"),a("modal.confirm.cloudLoad.message",{time:i}),()=>{try{localStorage.setItem(Te,JSON.stringify(n.save)),_(a("msg.cloudApplied")),setTimeout(()=>location.reload(),600)}catch(l){$e(a("modal.error.cloudApplyFailed.title"),a("modal.error.cloudApplyFailed.message",{error:String(l)}),"⚠️")}},{icon:"☁️",primaryLabel:a("button.load"),secondaryLabel:a("button.cancel")})}async function Hs(){var l;try{if(sessionStorage.getItem(An)==="1")return!1}catch(d){console.warn("sessionStorage get 실패:",d)}try{if(sessionStorage.getItem(xo)==="1")return sessionStorage.removeItem(xo),!1}catch(d){console.warn("sessionStorage get/remove 실패:",d)}if(!!localStorage.getItem(Te)||!await je())return!1;const s=await ss("seoulsurvival");if(!s.ok||!s.found)return!1;const i=Q()==="en"?"en-US":"ko-KR",r=(l=s.save)!=null&&l.saveTime?new Date(s.save.saveTime).toLocaleString(i):s.updated_at?new Date(s.updated_at).toLocaleString(i):a("ui.noTimeInfo"),c=a("modal.confirm.cloudRestore.message",{time:r});return new Promise(d=>{let g=!1;const h=$=>{g||(g=!0,d($))};pn(a("modal.confirm.cloudRestore.title"),c,()=>{try{localStorage.setItem(Te,JSON.stringify(s.save)),_(a("msg.cloudApplied")),setTimeout(()=>location.reload(),600),h(!0)}catch($){console.error("클라우드 세이브 적용 실패:",$),h(!1)}},{icon:"☁️",primaryLabel:a("button.load"),secondaryLabel:a("button.later"),onCancel:()=>{h(!1)}})})}async function Mi(){if(!await je())return!1;const n=localStorage.getItem(Te);if(!n)return await Hs();let s;try{s=JSON.parse(n)}catch(de){return console.error("로컬 저장 파싱 실패:",de),!1}const i=await ss("seoulsurvival");if(!i.ok||!i.found)return!1;const r=i.save,c=Vs(s),l=Vs(r),d=Gs(s,Fe),g=Gs(r,Date.now()),h=Number(s.ts||0),$=Number(i.save_ts||0);if(!(l>c||l===c&&$>h))return!1;const P=r.saveTime?new Date(r.saveTime).toLocaleString("ko-KR"):i.updated_at?new Date(i.updated_at).toLocaleString(locale):a("ui.noTimeInfo"),C=s.saveTime?new Date(s.saveTime).toLocaleString(locale):a("ui.noTimeInfo"),f=bn(d),y=bn(g),p=yt(c),M=yt(l),j=`다른 기기에서 더 높은 점수로 저장된 진행이 있습니다.

📊 지금 이 기기
   자산: ${p}
   플레이타임: ${f}
   저장 시간: ${C}

☁️ 다른 기기
   자산: ${M}
   플레이타임: ${y}
   저장 시간: ${P}

어떤 진행을 사용하시겠습니까?`;return new Promise(de=>{let N=!1;const ee=ce=>{N||(N=!0,de(ce))};pn(a("modal.confirm.progressSwitch.title"),a("modal.confirm.progressSwitch.message",{message:j}),()=>{try{localStorage.setItem(Te,JSON.stringify(r)),_(a("msg.cloudProgressLoaded")),setTimeout(()=>location.reload(),600),ee(!0)}catch(ce){console.error("클라우드 세이브 적용 실패:",ce),$e(a("modal.error.progressSwitchFailed.title"),a("modal.error.progressSwitchFailed.message",{error:ce.message||String(ce)}),"⚠️"),ee(!1)}},{icon:"☁️",primaryLabel:"다른 기기로 바꾸기",secondaryLabel:"지금 기기 그대로",onCancel:()=>{ee(!1)}})})}Ds&&Ds.addEventListener("click",xi),Ns&&Ns.addEventListener("click",Bi),(async()=>{try{Gn=await je(),sr(async t=>{Gn=t,t&&!window.__saveSyncChecked?(window.__saveSyncChecked=!0,setTimeout(async()=>{try{await Mi()}catch(n){console.error("저장 동기화 확인 중 오류:",n)}},1500)):t||(window.__saveSyncChecked=!1)})}catch{}})(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&qs("visibility:hidden")}),window.addEventListener("pagehide",()=>{qs("pagehide")}),Hn&&Hn.addEventListener("change",t=>{Le.particles=t.target.checked,Do()}),Kn&&Kn.addEventListener("change",t=>{Le.fancyGraphics=t.target.checked,Do()}),Vn&&Vn.addEventListener("change",t=>{Le.shortNumbers=t.target.checked,Do(),fe()}),console.log("=== 판매 시스템 초기화 완료 ==="),console.log("✅ 구매/판매 모드 토글 시스템 활성화"),console.log("✅ 금융상품 통합 거래 시스템 (예금/적금/주식)"),console.log("✅ 부동산 통합 거래 시스템 (빌라/오피스텔/아파트/상가/빌딩)"),console.log("✅ 판매 가격: 현재가의 80%"),console.log("✅ 수량 선택: 1개/10개/100개"),console.log('💡 사용법: 상단 "구매/판매" 버튼으로 모드 전환 후 거래하세요!');let Ks=!1;function Pi(){if(Ks)return;Ks=!0;const t=document.getElementById("statsTab");t&&t.addEventListener("click",n=>{const s=n.target.closest(".stats-toggle"),i=n.target.closest(".toggle-icon");if(s||i){const r=(s||i).closest(".stats-section");r&&r.classList.contains("collapsible")&&(r.classList.toggle("collapsed"),n.preventDefault(),n.stopPropagation())}})}let hn=[],$n=[],Wn=0,jn=Date.now();function Ai(){const t=Date.now(),n=ze+Ye+Je+Qe+Xe+Ze+et+tt+nt+ot+st;hn=hn.filter($=>t-$.time<36e5),$n=$n.filter($=>t-$.time<864e5),t-jn>=6e4&&(hn.push({time:t,earnings:n}),$n.push({time:t,earnings:n}),jn=t);const s=hn.length>0?n-hn[0].earnings:0,i=$n.length>0?n-$n[0].earnings:0,r=Wn>0&&t-jn>0?(n-Wn)/Wn*(36e5/(t-jn))*100:0,c=[1e6,1e7,1e8,1e9,1e10,1e11],l=a("stats.maxAchieved");let d=c.find($=>$>n)||l;if(d!==l){const $=d-n;d=a("stats.remaining",{amount:se($)})}m(document.getElementById("hourlyEarnings"),he(Math.max(0,s))),m(document.getElementById("dailyEarnings"),he(Math.max(0,i)));const g=Math.abs(r)<.05?0:r,h=a("stats.unit.perHour");m(document.getElementById("growthRate"),`${g>=0?"+":""}${g.toFixed(1)}%${h}`),m(document.getElementById("nextMilestone"),d),Wn=n}function Ri(){const t=document.getElementById("assetDonutChart");if(!t)return;const n=t.getContext("2d");if(!n)return;const s=200,i=Math.max(1,Math.floor((window.devicePixelRatio||1)*100)/100),r=Math.round(s*i);(t.width!==r||t.height!==r)&&(t.width=r,t.height=r,t.style.width=`${s}px`,t.style.height=`${s}px`),n.setTransform(i,0,0,i,0,0);const c=s/2,l=s/2,d=80,g=50,h=S+Ln(),$=Fi(),b=Ui(),P=h>0?S/h*100:0,C=h>0?$/h*100:0,f=h>0?b/h*100:0;n.clearRect(0,0,s,s),n.beginPath(),n.arc(c,l,d,0,Math.PI*2),n.fillStyle="rgba(255, 255, 255, 0.05)",n.fill();let y=-Math.PI/2;if(P>0){const M=P/100*Math.PI*2;n.beginPath(),n.moveTo(c,l),n.arc(c,l,d,y,y+M),n.closePath();const j=n.createLinearGradient(c-d,l-d,c+d,l+d);j.addColorStop(0,"#f59e0b"),j.addColorStop(1,"#d97706"),n.fillStyle=j,n.fill(),n.lineWidth=2,n.strokeStyle="rgba(0, 0, 0, 0.25)",n.stroke(),y+=M}if(C>0){const M=C/100*Math.PI*2;n.beginPath(),n.moveTo(c,l),n.arc(c,l,d,y,y+M),n.closePath(),n.fillStyle="rgba(59, 130, 246, 0.5)",n.fill(),y+=M}if(f>0){const M=f/100*Math.PI*2;n.beginPath(),n.moveTo(c,l),n.arc(c,l,d,y,y+M),n.closePath(),n.fillStyle="rgba(16, 185, 129, 0.5)",n.fill()}n.beginPath(),n.arc(c,l,g,0,Math.PI*2);const p=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()||"#0b1220";n.fillStyle=p,n.fill()}function Fi(){let t=0;if(D>0)for(let n=0;n<D;n++)t+=Z("deposit",n);if(F>0)for(let n=0;n<F;n++)t+=Z("savings",n);if(U>0)for(let n=0;n<U;n++)t+=Z("bond",n);if(J>0)for(let n=0;n<J;n++)t+=Z("usStock",n);if(z>0)for(let n=0;n<z;n++)t+=Z("crypto",n);return t}function Ui(){let t=0;if(q>0)for(let n=0;n<q;n++)t+=Y("villa",n);if(H>0)for(let n=0;n<H;n++)t+=Y("officetel",n);if(O>0)for(let n=0;n<O;n++)t+=Y("apartment",n);if(K>0)for(let n=0;n<K;n++)t+=Y("shop",n);if(V>0)for(let n=0;n<V;n++)t+=Y("building",n);return t}function Di(){try{const t=S+Ln(),n=ze+Ye+Je+Qe+Xe+Ze+et+tt+nt+ot+st;m(document.getElementById("totalAssets"),se(t)),m(document.getElementById("totalEarnings"),se(n));const s=a("stats.unit.perSec");m(document.getElementById("rpsStats"),he(At())+s),m(document.getElementById("clickIncomeStats"),he(mn()));const i=a("stats.unit.times"),r=Q()==="en"?"en-US":"ko-KR";m(document.getElementById("totalClicksStats"),ge.toLocaleString(r)+i),m(document.getElementById("laborIncomeStats"),se(st));const c=Date.now()-Fe,l=Re+c,d=Math.floor(l/6e4),g=Math.floor(d/60),h=d%60,$=a("stats.unit.hour"),b=a("stats.unit.minute"),P=g>0?`${g}${$} ${h}${b}`:`${d}${b}`;console.log("🕐 플레이시간 계산:",{totalPlayTime:Re,currentSessionTime:c,totalPlayTimeMs:l,playTimeMinutes:d,playTimeText:P}),m(document.getElementById("playTimeStats"),P);const C=d>0?n/d*60:0,f=a("stats.unit.perHour");m(document.getElementById("hourlyRate"),he(C)+f);const y=n>0?st/n*100:0,p=ze+Ye+Je+Qe+Xe,M=n>0?p/n*100:0,j=Ze+et+tt+nt+ot,de=n>0?j/n*100:0,N=document.querySelector(".income-bar"),ee=document.getElementById("laborSegment"),ce=document.getElementById("financialSegment"),Me=document.getElementById("propertySegment");if(N&&!N.classList.contains("animated")&&N.classList.add("animated"),ee){ee.style.width=y.toFixed(1)+"%";const We=ee.querySelector("span");We&&(We.textContent=y>=5?`🛠️ ${y.toFixed(1)}%`:"")}if(ce){ce.style.width=M.toFixed(1)+"%";const We=ce.querySelector("span");We&&(We.textContent=M>=5?`💰 ${M.toFixed(1)}%`:"")}if(Me){Me.style.width=de.toFixed(1)+"%";const We=Me.querySelector("span");We&&(We.textContent=de>=5?`🏢 ${de.toFixed(1)}%`:"")}m(document.getElementById("laborLegend"),`${a("stats.labor")}: ${y.toFixed(1)}%`),m(document.getElementById("financialLegend"),`${a("stats.financial")}: ${M.toFixed(1)}%`),m(document.getElementById("propertyLegend"),`${a("stats.property")}: ${de.toFixed(1)}%`),Ai(),Ri();const W=n||1;Ki();const Pe=a("ui.unit.count");m(document.getElementById("depositsOwnedStats"),D+Pe),m(document.getElementById("depositsLifetimeStats"),se(ze));const kt=W>0?(ze/W*100).toFixed(1):"0.0";m(document.getElementById("depositsContribution"),`(${kt}%)`);const ct=D>0?kn("deposit",D):0;m(document.getElementById("depositsValue"),T(ct)),m(document.getElementById("savingsOwnedStats"),F+Pe),m(document.getElementById("savingsLifetimeStats"),se(Ye));const lt=W>0?(Ye/W*100).toFixed(1):"0.0";m(document.getElementById("savingsContribution"),`(${lt}%)`);const dt=F>0?kn("savings",F):0;m(document.getElementById("savingsValue"),T(dt)),m(document.getElementById("bondsOwnedStats"),U+Pe),m(document.getElementById("bondsLifetimeStats"),se(Je));const ut=W>0?(Je/W*100).toFixed(1):"0.0";m(document.getElementById("bondsContribution"),`(${ut}%)`);const xt=U>0?kn("bond",U):0;m(document.getElementById("bondsValue"),T(xt)),m(document.getElementById("usStocksOwnedStats"),J+Pe),m(document.getElementById("usStocksLifetimeStats"),se(Qe));const Ve=W>0?(Qe/W*100).toFixed(1):"0.0";m(document.getElementById("usStocksContribution"),`(${Ve}%)`);const e=J>0?kn("usStock",J):0;m(document.getElementById("usStocksValue"),T(e)),m(document.getElementById("cryptosOwnedStats"),z+Pe),m(document.getElementById("cryptosLifetimeStats"),se(Xe));const o=W>0?(Xe/W*100).toFixed(1):"0.0";m(document.getElementById("cryptosContribution"),`(${o}%)`);const L=z>0?kn("crypto",z):0;m(document.getElementById("cryptosValue"),T(L));const A=a("ui.unit.property");m(document.getElementById("villasOwnedStats"),q+A),m(document.getElementById("villasLifetimeStats"),he(Ze));const ke=W>0?(Ze/W*100).toFixed(1):"0.0";m(document.getElementById("villasContribution"),`(${ke}%)`);const pe=q>0?Sn("villa",q):0;m(document.getElementById("villasValue"),he(pe)),m(document.getElementById("officetelsOwnedStats"),H+A),m(document.getElementById("officetelsLifetimeStats"),he(et));const u=W>0?(et/W*100).toFixed(1):"0.0";m(document.getElementById("officetelsContribution"),`(${u}%)`);const Ue=H>0?Sn("officetel",H):0;m(document.getElementById("officetelsValue"),he(Ue)),m(document.getElementById("apartmentsOwnedStats"),O+A),m(document.getElementById("apartmentsLifetimeStats"),he(tt));const Ge=W>0?(tt/W*100).toFixed(1):"0.0";m(document.getElementById("apartmentsContribution"),`(${Ge}%)`);const te=O>0?Sn("apartment",O):0;m(document.getElementById("apartmentsValue"),he(te)),m(document.getElementById("shopsOwnedStats"),K+A),m(document.getElementById("shopsLifetimeStats"),he(nt));const qt=W>0?(nt/W*100).toFixed(1):"0.0";m(document.getElementById("shopsContribution"),`(${qt}%)`);const mt=K>0?Sn("shop",K):0;m(document.getElementById("shopsValue"),he(mt));const Yo=a("ui.unit.property");m(document.getElementById("buildingsOwnedStats"),V+Yo),m(document.getElementById("buildingsLifetimeStats"),he(ot));const Yn=W>0?(ot/W*100).toFixed(1):"0.0";m(document.getElementById("buildingsContribution"),`(${Yn}%)`);const Ht=V>0?Sn("building",V):0;m(document.getElementById("buildingsValue"),he(Ht));const Kt=Vi();m(document.getElementById("bestEfficiency"),Kt[0]||"-"),m(document.getElementById("secondEfficiency"),Kt[1]||"-"),m(document.getElementById("thirdEfficiency"),Kt[2]||"-"),Ws()}catch(t){console.error("Stats tab update failed:",t)}}let bt=!1,rt=0,vn=null;const Ni=1e4,Oi=7e3;function bn(t){if(!t||t<=0)return"—";const n=Math.floor(t/1e3/60);if(n<=0)return"1분 미만";const s=Math.floor(n/60),i=n%60;return s>0?i?`${s}시간 ${i}분`:`${s}시간`:`${i}분`}function qi(t){if(!t||t<=0)return"—";const n=Math.floor(t/1e3/60);if(n<=0)return"<1m";const s=Math.floor(n/60),i=n%60;return s>=100?`${s}h`:s>0?`${s}h ${String(i).padStart(2,"0")}m`:`${i}m`}async function Nt(t=!1){const n=document.getElementById("leaderboardContainer");if(!n)return;if(!os()){n.innerHTML=`
          <div class="leaderboard-error">
            <div>리더보드 설정이 아직 완료되지 않았어요. 나중에 다시 확인해 주세요.</div>
          </div>
        `,bt=!1,rt=Date.now();return}if(bt&&!t){console.log("리더보드: 이미 로딩 중, 스킵");return}const s=Date.now();if(!t&&rt>0&&s-rt<Ni){console.log("리더보드: 최근 업데이트로부터 시간이 짧음, 스킵");return}vn&&(clearTimeout(vn),vn=null),vn=setTimeout(async()=>{bt=!0,vn=null;const i=setTimeout(()=>{if(bt){console.error("리더보드: 타임아웃 발생"),n.innerHTML=`
              <div class="leaderboard-error">
                <div>리더보드 불러오기 실패 (타임아웃)</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;const r=n.querySelector(".leaderboard-retry-btn");r&&r.addEventListener("click",()=>{Nt(!0)}),bt=!1,rt=Date.now()}},Oi);try{n.innerHTML=`<div class="leaderboard-loading">${a("ranking.loadingText")}</div>`,console.log("리더보드: API 호출 시작");const r=await gr(10,"assets");if(clearTimeout(i),console.log("리더보드: API 응답 받음",r),!r.success){const C=r.error||"알 수 없는 오류",f=r.status,y=r.errorType;console.error("리더보드: API 오류",{errorMsg:C,status:f,errorType:y});let p="";y==="forbidden"||f===401||f===403?p="권한이 없어 리더보드를 불러올 수 없습니다.":y==="config"?p="리더보드 설정 오류: Supabase 설정을 확인해주세요.":y==="schema"?p="리더보드 테이블이 설정되지 않았습니다. 관리자에게 문의해주세요.":y==="network"?p="네트워크 오류로 리더보드를 불러올 수 없습니다.":p=`리더보드를 불러올 수 없습니다: ${C}`,n.innerHTML=`
              <div class="leaderboard-error">
                <div>${p}</div>
                <button class="leaderboard-retry-btn">다시 시도</button>
              </div>
            `;const M=n.querySelector(".leaderboard-retry-btn");M&&M.addEventListener("click",()=>{Nt(!0)}),bt=!1,rt=Date.now();return}const c=r.data||[];if(c.length===0){console.log("리더보드: 기록 없음"),n.innerHTML=`<div class="leaderboard-empty">${a("ranking.empty")}</div>`,bt=!1,rt=Date.now();const C=document.getElementById("myRankContent");C&&(C.innerHTML=`
                <div class="leaderboard-my-rank-empty">
                  리더보드 기록이 아직 없습니다.
                </div>
              `);return}console.log("리더보드: 항목 수",c.length);const l=document.createElement("table");l.className="leaderboard-table";const d=document.createElement("thead");d.innerHTML=`
            <tr>
              <th class="col-rank">${a("ranking.table.rank")}</th>
              <th class="col-nickname">${a("ranking.table.nickname")}</th>
              <th class="col-assets">${a("ranking.table.assets")}</th>
              <th class="col-playtime">${a("ranking.table.playtime")}</th>
            </tr>
          `,l.appendChild(d);const g=document.createElement("tbody");let h=null;const $=(ie||"").trim().toLowerCase();c.forEach((C,f)=>{const y=document.createElement("tr"),p=document.createElement("td");p.className="col-rank",p.textContent=String(f+1);const M=document.createElement("td");M.className="col-nickname";const j=C.tower_count||0,de=j>0?`${C.nickname||"익명"} 🗼${j>1?`x${j}`:""}`:C.nickname||"익명";M.textContent=de;const N=document.createElement("td");N.className="col-assets",N.textContent=yt(C.total_assets||0);const ee=document.createElement("td");ee.className="col-playtime",ee.textContent=qi(C.play_time_ms||0);const ce=(C.nickname||"").trim().toLowerCase();$&&$===ce&&(y.classList.add("is-me"),h={rank:f+1,...C}),y.appendChild(p),y.appendChild(M),y.appendChild(N),y.appendChild(ee),g.appendChild(y)}),l.appendChild(g),n.innerHTML="",n.appendChild(l),rt=Date.now(),console.log("리더보드: 업데이트 완료");const b=document.getElementById("leaderboardLastUpdated");if(b){const C=new Date(rt),f=String(C.getHours()).padStart(2,"0"),y=String(C.getMinutes()).padStart(2,"0"),p=String(C.getSeconds()).padStart(2,"0"),M=`${f}:${y}:${p}`;b.textContent=a("ranking.lastUpdated",{time:M})}const P=document.getElementById("myRankContent");if(P)if(!$)P.innerHTML=`
                <div class="leaderboard-my-rank-empty">
                  닉네임을 설정하면 내 순위와 기록이 여기 표시됩니다.
                </div>
              `;else if(h){const C=bn(h.play_time_ms||0),f=h.tower_count||0,y=f>0?`${h.nickname||ie||"익명"} 🗼${f>1?`x${f}`:""}`:h.nickname||ie||"익명";P.innerHTML=`
                <div class="my-rank-card">
                  <div class="my-rank-header">
                    <span class="my-rank-label">내 기록</span>
                    <span class="my-rank-rank-badge">${h.rank}위</span>
                  </div>
                  <div class="my-rank-main">
                    <div class="my-rank-name">${y}</div>
                    <div class="my-rank-assets">💰 ${yt(h.total_assets||0)}</div>
                  </div>
                  <div class="my-rank-meta">
                    <span class="my-rank-playtime">⏱️ ${C}</span>
                    <span class="my-rank-note">TOP 10 내 순위</span>
                  </div>
                </div>
              `}else{console.log("[LB] 내 기록 조회 시작",{playerNickname:ie,currentNickLower:$});const C=await je();if(console.log("[LB] 로그인 상태 확인",{hasUser:!!C,userId:C==null?void 0:C.id}),!C){console.log("[LB] 로그인되지 않음, 로그인 버튼 표시"),P.innerHTML=`
                  <div class="leaderboard-my-rank-empty">
                    ${a("ranking.loginRequired")}
                    <div class="leaderboard-my-rank-actions">
                      <button type="button" class="btn" id="openLoginFromRanking">
                        🔐 ${a("settings.loginGoogle")}
                      </button>
                    </div>
                  </div>
                `;const f=document.getElementById("openLoginFromRanking");f&&f.addEventListener("click",async y=>{if(y.preventDefault(),!os()){alert("현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.");return}(await $a("google")).ok?setTimeout(()=>Nt(!0),1e3):alert("로그인에 실패했습니다. 다시 시도해 주세요.")});return}console.log("[LB] 로그인 확인됨, 내 순위 조회 시작"),P.innerHTML=`
                <div class="leaderboard-my-rank-loading">
                  내 순위를 불러오는 중...
                </div>
              `;try{const f=await ka(ie,"assets");if(console.log("[LB] 내 순위 조회 결과",{success:f.success,errorType:f.errorType,hasData:!!f.data}),!f.success||!f.data){let y="";if(f.errorType==="forbidden")console.warn("[LB] 권한 부족으로 내 순위 조회 실패"),y=`
                      <div class="leaderboard-my-rank-empty">
                        ${a("ranking.loginRequired")}
                        <div class="leaderboard-my-rank-actions">
                          <button type="button" class="btn" id="openLoginFromRanking">
                            🔐 ${a("settings.loginGoogle")}
                          </button>
                        </div>
                      </div>
                    `;else if(f.errorType==="network")console.error("[LB] 네트워크 오류로 내 순위 조회 실패"),y=`
                      <div class="leaderboard-my-rank-error">
                        네트워크 오류로 내 순위를 불러올 수 없습니다.
                      </div>
                    `;else if(f.errorType==="not_found"){if(console.log("[LB] 리더보드에 기록 없음, 리더보드 업데이트 시도"),C&&ie)try{const M=S+Ln(),j=Date.now()-Fe,de=Re+j;console.log("[LB] 리더보드 업데이트 시도",{nickname:ie,totalAssets:M,totalPlayTimeMs:de,towerCount:Se});const N=await as(ie,M,de,Se);if(N.success){console.log("[LB] 리더보드 업데이트 성공, 다시 조회");const ee=await ka(ie,"assets");if(ee.success&&ee.data){const ce=ee.data,Me=bn(ce.play_time_ms||0),W=ce.tower_count||0,Pe=W>0?`${ce.nickname||ie||"익명"} 🗼${W>1?`x${W}`:""}`:ce.nickname||ie||"익명";P.innerHTML=`
                              <div class="my-rank-card">
                                <div class="my-rank-header">
                                  <span class="my-rank-label">내 기록</span>
                                  <span class="my-rank-rank-badge">${ce.rank}위</span>
                                </div>
                                <div class="my-rank-main">
                                  <div class="my-rank-name">${Pe}</div>
                                  <div class="my-rank-assets">💰 ${yt(ce.total_assets||0)}</div>
                                </div>
                                <div class="my-rank-meta">
                                  <span class="my-rank-playtime">⏱️ ${Me}</span>
                                  <span class="my-rank-note">내 실제 순위</span>
                                </div>
                              </div>
                            `;return}}else console.error("[LB] 리더보드 업데이트 실패",N.error)}catch(M){console.error("[LB] 리더보드 업데이트 중 오류",M)}y=`
                      <div class="leaderboard-my-rank-empty">
                        ${a("ranking.emptyMessage")}<br />
                        ${a("ranking.emptyHint")}
                      </div>
                    `}else console.error("[LB] 내 순위 조회 실패",f.errorType),y=`
                      <div class="leaderboard-my-rank-error">
                        내 순위를 불러올 수 없습니다.
                      </div>
                    `;P.innerHTML=y;const p=document.getElementById("openLoginFromRanking");p&&p.addEventListener("click",async M=>{if(M.preventDefault(),!os()){alert("현재는 게스트 모드입니다. 로그인 기능은 준비 중입니다.");return}(await $a("google")).ok?setTimeout(()=>Nt(!0),1e3):alert("로그인에 실패했습니다. 다시 시도해 주세요.")})}else{const y=f.data;console.log("[LB] 내 순위 조회 성공",{rank:y.rank,nickname:y.nickname});const p=bn(y.play_time_ms||0),M=y.tower_count||0,j=M>0?`${y.nickname||ie||"익명"} 🗼${M>1?`x${M}`:""}`:y.nickname||ie||"익명";P.innerHTML=`
                    <div class="my-rank-card">
                      <div class="my-rank-header">
                        <span class="my-rank-label">내 기록</span>
                        <span class="my-rank-rank-badge">${y.rank}위</span>
                      </div>
                      <div class="my-rank-main">
                        <div class="my-rank-name">${j}</div>
                        <div class="my-rank-assets">💰 ${yt(y.total_assets||0)}</div>
                      </div>
                      <div class="my-rank-meta">
                        <span class="my-rank-playtime">⏱️ ${p}</span>
                        <span class="my-rank-note">내 실제 순위</span>
                      </div>
                    </div>
                  `}}catch(f){console.error("[LB] 내 순위 RPC 호출 실패:",f),P.innerHTML=`
                  <div class="leaderboard-my-rank-error">
                    내 순위를 불러오는 중 오류가 발생했습니다.
                  </div>
                `}}}catch(r){clearTimeout(i),console.error("리더보드 UI 업데이트 실패:",r);const c=r.message||a("ranking.error",{error:"Unknown error"});n.innerHTML=`<div class="leaderboard-error">${a("ranking.error",{error:c})}</div>`,rt=Date.now()}finally{bt=!1}},t?0:300)}async function Hi(){if(!ie){console.log("[LB] 리더보드 업데이트 스킵: 닉네임 없음");return}if(Se>0){console.log("[LB] 리더보드 업데이트 스킵: 타워 달성 후 자동 업데이트 중단");return}try{const t=await je();if(!t){console.log("[LB] 리더보드 업데이트 스킵: 로그인되지 않음");return}const n=S+Ln(),s=Date.now()-Fe,i=Re+s;console.log("[LB] 리더보드 업데이트 시도",{nickname:ie,totalAssets:n,totalPlayTimeMs:i,towerCount:Se,userId:t.id});const r=await as(ie,n,i,Se);r.success?console.log("[LB] 리더보드 업데이트 성공"):console.error("[LB] 리더보드 업데이트 실패",r.error)}catch(t){console.error("[LB] 리더보드 업데이트 예외 발생:",t)}}function kn(t,n){let s=0;for(let i=0;i<n;i++)s+=Z(t,i);return s}function Sn(t,n){let s=0;for(let i=0;i<n;i++)s+=Y(t,i);return s}function Ki(){const t={savings:{id:"savingsOwnedStats",name:"적금"},bond:{id:"bondsOwnedStats",name:"주식"},usStock:{id:"usStocksOwnedStats",name:"미국주식"},crypto:{id:"cryptosOwnedStats",name:"코인"}},n={villa:{id:"villasOwnedStats",name:"빌라"},officetel:{id:"officetelsOwnedStats",name:"오피스텔"},apartment:{id:"apartmentsOwnedStats",name:"아파트"},shop:{id:"shopsOwnedStats",name:"상가"},building:{id:"buildingsOwnedStats",name:"빌딩"}};Object.keys(t).forEach(s=>{const i=t[s],r=document.getElementById(i.id);if(r){const c=r.closest(".asset-row");if(c){const l=!oe(s);c.classList.toggle("locked",l)}}}),Object.keys(n).forEach(s=>{const i=n[s],r=document.getElementById(i.id);if(r){const c=r.closest(".asset-row");if(c){const l=!oe(s);c.classList.toggle("locked",l)}}})}function Ln(){let t=0;return D>0&&(t+=Z("deposit",D-1)),F>0&&(t+=Z("savings",F-1)),U>0&&(t+=Z("bond",U-1)),q>0&&(t+=Y("villa",q-1)),H>0&&(t+=Y("officetel",H-1)),O>0&&(t+=Y("apartment",O-1)),K>0&&(t+=Y("shop",K-1)),V>0&&(t+=Y("building",V-1)),t}function Vs(t){if(!t)return 0;let n=0;const s=Number(t.cash||0),i=Number(t.deposits||0),r=Number(t.savings||0),c=Number(t.bonds||0),l=Number(t.usStocks||0),d=Number(t.cryptos||0);for(let f=0;f<i;f++)n+=Z("deposit",f);for(let f=0;f<r;f++)n+=Z("savings",f);for(let f=0;f<c;f++)n+=Z("bond",f);for(let f=0;f<l;f++)n+=Z("usStock",f);for(let f=0;f<d;f++)n+=Z("crypto",f);const g=Number(t.villas||0),h=Number(t.officetels||0),$=Number(t.apartments||0),b=Number(t.shops||0),P=Number(t.buildings||0),C=Number(t.towers||0);for(let f=0;f<g;f++)n+=Y("villa",f);for(let f=0;f<h;f++)n+=Y("officetel",f);for(let f=0;f<$;f++)n+=Y("apartment",f);for(let f=0;f<b;f++)n+=Y("shop",f);for(let f=0;f<P;f++)n+=Y("building",f);for(let f=0;f<C;f++)n+=Y("tower",f);return s+n}function Gs(t,n){if(!t)return 0;const s=Number(t.totalPlayTime||0),i=Number(t.sessionStartTime||Date.now()),r=Date.now()-(n||i);return s+Math.max(0,r)}function Vi(){const t=[];D>0&&t.push({name:B("deposit"),efficiency:I.deposit,count:D}),F>0&&t.push({name:B("savings"),efficiency:I.savings,count:F}),U>0&&t.push({name:B("bond"),efficiency:I.bond,count:U}),J>0&&t.push({name:B("usStock"),efficiency:I.usStock,count:J}),z>0&&t.push({name:B("crypto"),efficiency:I.crypto,count:z}),q>0&&t.push({name:B("villa"),efficiency:E.villa*xe,count:q}),H>0&&t.push({name:B("officetel"),efficiency:E.officetel*xe,count:H}),O>0&&t.push({name:B("apartment"),efficiency:E.apartment*xe,count:O}),K>0&&t.push({name:B("shop"),efficiency:E.shop*xe,count:K}),V>0&&t.push({name:B("building"),efficiency:E.building*xe,count:V}),t.sort((s,i)=>i.efficiency-s.efficiency);const n=a("stats.unit.perSec");return t.slice(0,3).map(s=>`${s.name} (${X(Math.floor(s.efficiency))}${a("ui.currency")}${n}, ${s.count}${a("ui.unit.count")} ${a("ui.owned")})`)}function Ws(){const t=document.getElementById("achievementGrid");if(!t)return;if(!window.__achievementTooltipPortalInitialized){window.__achievementTooltipPortalInitialized=!0;const i=()=>{let d=document.getElementById("achievementTooltip");return d||(d=document.createElement("div"),d.id="achievementTooltip",d.className="achievement-tooltip",d.setAttribute("role","tooltip"),d.setAttribute("aria-hidden","true"),document.body.appendChild(d)),d},r=d=>{const g=$t.find(P=>P.id===d);if(!g)return"";const h=a(`achievement.${g.id}.name`,{},g.name),$=a(`achievement.${g.id}.desc`,{},g.desc),b=g.unlocked?a("achievement.status.unlocked"):a("achievement.status.locked");return`${h}
${$}
${b}`},c=()=>{const d=document.getElementById("achievementTooltip");d&&(d.classList.remove("active","bottom"),d.style.left="",d.style.top="",d.style.bottom="",d.style.opacity="",d.style.visibility="",d.style.pointerEvents="",d.setAttribute("aria-hidden","true"),window.__achievementTooltipAnchorId=null)},l=d=>{var M,j;const g=i(),h=((M=d==null?void 0:d.dataset)==null?void 0:M.achievementId)||((j=d==null?void 0:d.id)==null?void 0:j.replace(/^ach_/,""));if(!h)return;if(window.__achievementTooltipAnchorId===h&&g.classList.contains("active")){c();return}c(),g.textContent=r(h),g.setAttribute("aria-hidden","false"),g.classList.add("active"),g.style.opacity="0",g.style.visibility="hidden",g.style.pointerEvents="none",g.style.left="0px",g.style.top="0px",g.style.bottom="auto",g.offsetHeight;const $=g.getBoundingClientRect(),b=d.getBoundingClientRect(),P=window.innerWidth,C=window.innerHeight;let f=b.left+b.width/2,y=b.top-$.height-8,p=!1;y<10&&(y=b.bottom+8,p=!0),y+$.height>C-10&&(y=C-$.height-10),f+$.width/2>P-10&&(f=P-$.width/2-10),f-$.width/2<10&&(f=$.width/2+10),g.style.left=`${f}px`,g.style.top=`${y}px`,g.style.bottom="auto",g.classList.toggle("bottom",p),g.style.visibility="visible",g.style.opacity="1",g.style.pointerEvents="none",window.__achievementTooltipAnchorId=h};t.addEventListener("click",d=>{const g=d.target.closest(".achievement-icon");g&&(d.stopPropagation(),l(g))}),t.addEventListener("pointerout",d=>{var h,$;($=(h=d.target).closest)!=null&&$.call(h,".achievement-icon")&&c()}),document.addEventListener("click",()=>c(),!0),window.addEventListener("scroll",()=>c(),!0),window.addEventListener("resize",()=>c(),!0)}if(t.children.length>0){let i=0;Object.values($t).forEach(c=>{const l=document.getElementById("ach_"+c.id);if(!l)return;c.unlocked?(l.classList.add("unlocked"),l.classList.remove("locked"),i++):(l.classList.add("locked"),l.classList.remove("unlocked"));const d=a(`achievement.${c.id}.name`,{},c.name),g=a(`achievement.${c.id}.desc`,{},c.desc),h=c.unlocked?a("achievement.status.unlocked"):a("achievement.status.locked");l.title=`${d}
${g}
${h}`});const r=Object.keys($t).length;m(document.getElementById("achievementProgress"),`${i}/${r}`);return}t.innerHTML="";let n=0;const s=Object.keys($t).length;Object.values($t).forEach(i=>{const r=document.createElement("div");r.className="achievement-icon",r.id="ach_"+i.id,r.dataset.achievementId=i.id,r.textContent=i.icon;const c=a(`achievement.${i.id}.name`,{},i.name),l=a(`achievement.${i.id}.desc`,{},i.desc),d=i.unlocked?a("achievement.status.unlocked"):a("achievement.status.locked");r.title=`${c}
${l}
${d}`,i.unlocked?(r.classList.add("unlocked"),n++):r.classList.add("locked"),t.appendChild(r)}),m(document.getElementById("achievementProgress"),`${n}/${s}`)}let Ot=null,zn=null;function Wo(){return window.matchMedia&&window.matchMedia("(min-width: 769px)").matches}function jo(){const t=document.getElementById("rankingTab");if(!t||!Wo()&&!t.classList.contains("active")||Ot)return;Nt(!0);const s=6e4-Date.now()%6e4;Ot=setTimeout(function i(){const r=t.classList.contains("active");if(!Wo()&&!r){zo();return}Nt(!1),Ot=setTimeout(i,6e4)},s)}function zo(){Ot&&(clearTimeout(Ot),Ot=null)}function Gi(){const t=document.getElementById("rankingTab"),n=document.getElementById("leaderboardContainer");if(!(!t||!n)){if(!("IntersectionObserver"in window)){console.log("IntersectionObserver 미지원: active 탭 기준으로만 리더보드 폴링 제어");return}zn&&zn.disconnect(),zn=new IntersectionObserver(s=>{s.forEach(i=>{const r=i.isIntersecting,c=t.classList.contains("active");(Wo()?r:r&&c)?jo():zo()})},{root:null,threshold:.1}),zn.observe(n)}}const js=document.querySelectorAll(".nav-btn"),Wi=document.querySelectorAll(".tab-content");js.forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-tab");Wi.forEach(i=>i.classList.remove("active")),js.forEach(i=>i.classList.remove("active"));const s=document.getElementById(n);s&&s.classList.add("active"),t.classList.add("active"),n==="rankingTab"?jo():zo()})}),fe(),Oo(),setTimeout(()=>{const t=document.getElementById("rankingTab");t&&t.classList.contains("active")&&jo(),Gi()},1e3);const zs=document.getElementById("upgradeList");zs&&(zs.classList.remove("collapsed-section"),console.log("✅ Upgrade list initialized and opened")),Rt(),console.log("=== UPGRADE SYSTEM DEBUG ==="),console.log("Total upgrades defined:",Object.keys(ne).length),console.log("Unlocked upgrades:",Object.values(ne).filter(t=>t.unlocked).length),console.log("Purchased upgrades:",Object.values(ne).filter(t=>t.purchased).length),console.log("First 3 upgrades:",Object.entries(ne).slice(0,3).map(([t,n])=>({id:t,unlocked:n.unlocked,purchased:n.purchased,cost:n.cost}))),console.log("==========================="),window.cheat={addCash:t=>{S+=t,fe(),console.log(`💰 Added ${t} cash. New total: ${S}`)},unlockAllUpgrades:()=>{var t;Object.values(ne).forEach(n=>n.unlocked=!0),Rt(),console.log("🔓 All upgrades unlocked!"),console.log("Upgrade list element:",document.getElementById("upgradeList")),console.log("Upgrade list children:",(t=document.getElementById("upgradeList"))==null?void 0:t.children.length)},unlockFirstUpgrade:()=>{const t=Object.keys(ne)[0];ne[t].unlocked=!0,Rt(),console.log("🔓 First upgrade unlocked:",ne[t].name)},setClicks:t=>{ge=t,fe(),Ts(),console.log(`👆 Set clicks to ${t}`)},testUpgrade:()=>{var n;const t=Object.keys(ne)[0];ne[t].unlocked=!0,S+=1e7,Rt(),fe(),console.log("🧪 Test setup complete:"),console.log("  - First upgrade unlocked"),console.log("  - Cash: 1000만원"),console.log("  - Upgrade list visible:",!((n=document.getElementById("upgradeList"))!=null&&n.classList.contains("collapsed-section"))),console.log("  - Upgrade items count:",document.querySelectorAll(".upgrade-item").length)}},console.log("💡 치트 코드 사용 가능:"),console.log("  - cheat.testUpgrade() : 빠른 테스트 (첫 업그레이드 해금 + 1000만원)"),console.log("  - cheat.addCash(1000000000) : 10억원 추가"),console.log("  - cheat.unlockAllUpgrades() : 모든 업그레이드 해금"),console.log("  - cheat.setClicks(100) : 클릭 수 설정"),_("🧪 v2.6 Cookie Clicker 스타일 업그레이드 시스템 구현 완료"),_("✅ DOM 참조 오류 수정 완료"),_("✅ 커리어 진행률 시스템 정상화"),_("✅ 업그레이드 클릭 기능 활성화"),_("✅ 자동 저장 시스템 작동 중"),_("⚡ 성능 최적화: 업그레이드 리스트 깜빡임 해결"),console.log("Initial state:",{cash:S,totalClicks:ge,deposits:D,savings:F,bonds:U,villas:q,officetels:H,apartments:O,shops:K,buildings:V})});
