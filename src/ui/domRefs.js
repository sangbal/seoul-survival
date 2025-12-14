export function getDomRefs() {
  return {
    // 상단 패널
    elCash: document.getElementById('cash'),
    elFinancial: document.getElementById('financial'),
    elProperties: document.getElementById('properties'),
    elRps: document.getElementById('rps'),

    // 노동
    elWork: document.getElementById('workBtn'),
    elLog: document.getElementById('log'),
    elShareBtn: document.getElementById('shareBtn'),

    // 노동/커리어 표시
    elClickIncomeButton: document.getElementById('clickIncomeButton'),
    elClickIncomeLabel: document.getElementById('clickIncomeLabel'),
    elClickMultiplier: document.getElementById('clickMultiplier'),
    elRentMultiplier: document.getElementById('rentMultiplier'),

    // 금융상품
    elDepositCount: document.getElementById('depositCount'),
    elIncomePerDeposit: document.getElementById('incomePerDeposit'),
    elBuyDeposit: document.getElementById('buyDeposit'),

    elSavingsCount: document.getElementById('savingsCount'),
    elIncomePerSavings: document.getElementById('incomePerSavings'),
    elBuySavings: document.getElementById('buySavings'),

    elBondCount: document.getElementById('bondCount'),
    elIncomePerBond: document.getElementById('incomePerBond'),
    elBuyBond: document.getElementById('buyBond'),

    elUsStockCount: document.getElementById('usStockCount'),
    elIncomePerUsStock: document.getElementById('incomePerUsStock'),
    elBuyUsStock: document.getElementById('buyUsStock'),

    elCryptoCount: document.getElementById('cryptoCount'),
    elIncomePerCrypto: document.getElementById('incomePerCrypto'),
    elBuyCrypto: document.getElementById('buyCrypto'),

    // 모드/수량
    elBuyMode: document.getElementById('buyMode'),
    elSellMode: document.getElementById('sellMode'),
    elQty1: document.getElementById('qty1'),
    elQty5: document.getElementById('qty5'),
    elQty10: document.getElementById('qty10'),

    // 토글
    elToggleUpgrades: document.getElementById('toggleUpgrades'),
    elToggleFinancial: document.getElementById('toggleFinancial'),
    elToggleProperties: document.getElementById('toggleProperties'),

    // 저장/리셋
    elSaveStatus: document.getElementById('saveStatus'),
    elResetBtn: document.getElementById('resetBtn'),

    // 현재가
    elDepositCurrentPrice: document.getElementById('depositCurrentPrice'),
    elSavingsCurrentPrice: document.getElementById('savingsCurrentPrice'),
    elBondCurrentPrice: document.getElementById('bondCurrentPrice'),
    elVillaCurrentPrice: document.getElementById('villaCurrentPrice'),
    elOfficetelCurrentPrice: document.getElementById('officetelCurrentPrice'),
    elAptCurrentPrice: document.getElementById('aptCurrentPrice'),
    elShopCurrentPrice: document.getElementById('shopCurrentPrice'),
    elBuildingCurrentPrice: document.getElementById('buildingCurrentPrice'),

    // 부동산
    elVillaCount: document.getElementById('villaCount'),
    elRentPerVilla: document.getElementById('rentPerVilla'),
    elBuyVilla: document.getElementById('buyVilla'),

    elOfficetelCount: document.getElementById('officetelCount'),
    elRentPerOfficetel: document.getElementById('rentPerOfficetel'),
    elBuyOfficetel: document.getElementById('buyOfficetel'),

    elAptCount: document.getElementById('aptCount'),
    elRentPerApt: document.getElementById('rentPerApt'),
    elBuyApt: document.getElementById('buyApt'),

    elShopCount: document.getElementById('shopCount'),
    elRentPerShop: document.getElementById('rentPerShop'),
    elBuyShop: document.getElementById('buyShop'),

    elBuildingCount: document.getElementById('buildingCount'),
    elRentPerBuilding: document.getElementById('rentPerBuilding'),
    elBuyBuilding: document.getElementById('buyBuilding'),

    // 커리어
    elCurrentCareer: document.getElementById('currentCareer'),
    elNextCareerDesc: document.getElementById('nextCareerDesc'),
    elCareerCost: document.getElementById('careerCost'),
    elCareerProgress: document.getElementById('careerProgress'),
    elCareerProgressText: document.getElementById('careerProgressText'),
  };
}
