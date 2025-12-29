export const PRODUCTS = {
    'kimchi_1': {
        id: 'kimchi_1',
        name: '배추김치',
        emoji: '🥬',
        price: 5000,
        desc: '엄마의 손맛이 담긴 기본 김치'
    },
    'kimchi_2': {
        id: 'kimchi_2',
        name: '깍두기',
        emoji: '🧊',
        price: 8000,
        recipe: { 'kimchi_1': 2 },
        desc: '아삭아삭한 식감의 무김치'
    },
    'kimchi_3': {
        id: 'kimchi_3',
        name: '총각김치',
        emoji: '🥕',
        price: 15000,
        recipe: { 'kimchi_1': 5 },
        desc: '알싸한 맛의 무청 김치'
    },
    'kimchi_4': {
        id: 'kimchi_4',
        name: '묵은지',
        emoji: '🏺',
        price: 25000,
        recipe: { 'kimchi_1': 3, 'kimchi_2': 3 },
        desc: '깊은 맛이 우러나는 숙성 김치'
    },
    'kimchi_5': {
        id: 'kimchi_5',
        name: '100년 숙성',
        emoji: '💎',
        price: 50000,
        recipe: { 'kimchi_1': 5, 'kimchi_2': 5, 'kimchi_3': 2, 'kimchi_4': 1 },
        desc: '박물관에 가야 할 것 같은 전설의 김치'
    },
    'enzyme_vial': {
        id: 'enzyme_vial',
        name: '효소 앰플',
        emoji: '🧪',
        price: 0,
        recipe: { 'kimchi_1': 50 },
        desc: '연구에 쓰이는 고농축 유산균 효소'
    },
    'kimchi_sauce': {
        id: 'kimchi_sauce',
        name: '만능 김치소스',
        emoji: '🥣',
        price: 25000,
        recipe: { 'kimchi_1': 3, 'enzyme_vial': 1 },
        desc: '어떤 음식도 서울의 맛으로 바꾸는 마법의 소스'
    },
    'kimchi_fried_rice': {
        id: 'kimchi_fried_rice',
        name: '김치볶음밥',
        emoji: '🍳',
        price: 45000,
        recipe: { 'kimchi_sauce': 1, 'kimchi_2': 1 },
        desc: '가장 대중적이지만 가장 안정적인 수익원'
    },
    'kimchi_tangsuyuk': {
        id: 'kimchi_tangsuyuk',
        name: '김치 탕수육',
        emoji: '🍖',
        price: 120000,
        recipe: { 'kimchi_sauce': 2, 'kimchi_3': 1 },
        desc: '고기와 한 몸이 된 김치. 퓨전 문명의 정점.'
    },
    'kimchi_pasta': {
        id: 'kimchi_pasta',
        name: '김치 파스타',
        emoji: '🍝',
        price: 250000,
        recipe: { 'kimchi_sauce': 2, 'kimchi_tangsuyuk': 1 },
        desc: '동서양의 대화합. 이탈리아도 인정했다.'
    },
    'kimchi_dining': {
        id: 'kimchi_dining',
        name: '김치 파인다이닝',
        emoji: '🍽️',
        price: 1000000,
        recipe: { 'kimchi_sauce': 5, 'kimchi_fried_rice': 2, 'kimchi_tangsuyuk': 1, 'kimchi_pasta': 1, 'kimchi_1': 10 },
        desc: '코스 요리의 시작부터 끝까지 김치다.'
    }
};

export const GLOBAL_CONFIG = {
    line_base_cost: 100000,
    line_cost_growth: 2,
    refund_rate: 0.8
};

export const ITEMS = {
    // --- Production: Equipment (Facility -> Batch) ---
    'eq_mom_fridge': { id: 'eq_mom_fridge', type: 'equipment', name: '엄마 냉장고', tier: 1, cost: 0, effects: { batch: 1 }, desc: '집에 있는 냉장고. 김치를 겨우 보관한다.' },
    'eq_dimchae': { id: 'eq_dimchae', type: 'equipment', name: '김치 냉장고', tier: 2, cost: 50000, effects: { batch: 5 }, desc: '김치 전용 냉장고. 숙성이 잘된다.' },
    'eq_community_work': { id: 'eq_community_work', type: 'equipment', name: '동네 공동 작업장', tier: 3, cost: 200000, effects: { batch: 15 }, desc: '부녀회가 함께 작업한다.' },
    'eq_small_workshop': { id: 'eq_small_workshop', type: 'equipment', name: '소규모 공방', tier: 4, cost: 800000, effects: { batch: 40 }, desc: '전문적인 장비를 갖췄다.' },
    'eq_haccp_factory': { id: 'eq_haccp_factory', type: 'equipment', name: 'HACCP 공장', tier: 5, cost: 2500000, effects: { batch: 100 }, desc: '위생과 효율을 모두 잡았다.' },

    // --- Production: Workers (Worker -> Speed) ---
    'wk_me': { id: 'wk_me', type: 'worker', name: '나 (CEO)', tier: 1, cost: 0, effects: { prodSpeed: 0 }, desc: '나 혼자 한다.' },
    'wk_mom': { id: 'wk_mom', type: 'worker', name: '가족 도움', tier: 2, cost: 30000, effects: { prodSpeed: 1 }, desc: '가족이 가끔 도와주신다.' },
    'wk_alba': { id: 'wk_alba', type: 'worker', name: '동네 알바', tier: 3, cost: 150000, effects: { prodSpeed: 3 }, desc: '성실한 알바생을 고용했다.' },
    'wk_team': { id: 'wk_team', type: 'worker', name: '작업반', tier: 4, cost: 500000, effects: { prodSpeed: 8 }, desc: '손발이 맞는 팀을 꾸렸다.' },
    'wk_shift': { id: 'wk_shift', type: 'worker', name: '교대조 운영', tier: 5, cost: 2000000, effects: { prodSpeed: 20 }, desc: '24시간 공장이 돌아간다.' },

    // --- Logistics: Storage (Facility -> Batch/Move Amount) ---
    'lg_box': { id: 'lg_box', type: 'storage', name: '종이 박스', tier: 1, cost: 0, effects: { moveBatch: 1 }, desc: '가장 기본적인 보관함.' },
    'lg_pallet': { id: 'lg_pallet', type: 'storage', name: '나무 팔레트', tier: 2, cost: 20000, effects: { moveBatch: 5 }, desc: '대량 이동의 기초.' },
    'lg_cont_small': { id: 'lg_cont_small', type: 'storage', name: '소형 컨테이너', tier: 3, cost: 100000, effects: { moveBatch: 15 }, desc: '규격화된 운송 용기.' },
    'lg_warehouse': { id: 'lg_warehouse', type: 'storage', name: '창고 구역', tier: 4, cost: 500000, effects: { moveBatch: 40 }, desc: '체계적인 적재 공간.' },
    'lg_center_hub': { id: 'lg_center_hub', type: 'storage', name: '허브 센터', tier: 5, cost: 2000000, effects: { moveBatch: 100 }, desc: '초대형 물류 허브.' },

    // --- Logistics: Transporter (Worker -> Speed) ---
    'tr_hand': { id: 'tr_hand', type: 'transporter', name: '손으로 옮기기', tier: 1, cost: 0, effects: { moveSpeed: 0 }, desc: '직접 나른다.' },
    'tr_cart': { id: 'tr_cart', type: 'transporter', name: '손수레', tier: 2, cost: 30000, effects: { moveSpeed: 1 }, desc: '바퀴가 달려서 편하다.' },
    'tr_truck': { id: 'tr_truck', type: 'transporter', name: '용달 트럭', tier: 3, cost: 150000, effects: { moveSpeed: 3 }, desc: '도로를 달린다.' },
    'tr_fleet': { id: 'tr_fleet', type: 'transporter', name: '물류팀', tier: 4, cost: 500000, effects: { moveSpeed: 8 }, desc: '전문 배송팀.' },
    'tr_auto_sys': { id: 'tr_auto_sys', type: 'transporter', name: '자동 분류기', tier: 5, cost: 2000000, effects: { moveSpeed: 20 }, desc: '무인 자동화 시스템.' },

    // --- Sales: Market (Facility -> Batch/Sell Amount) ---
    'mk_neighborhood': { id: 'mk_neighborhood', type: 'market', name: '동네 장터', tier: 1, cost: 0, effects: { sellAmount: 1 }, desc: '알음알음 판다.' },
    'mk_supermarket': { id: 'mk_supermarket', type: 'market', name: '슈퍼 납품', tier: 2, cost: 50000, effects: { sellAmount: 5 }, desc: '동네 슈퍼에 진열된다.' },
    'mk_online': { id: 'mk_online', type: 'market', name: '온라인몰', tier: 3, cost: 200000, effects: { sellAmount: 15 }, desc: '전국에서 주문이 들어온다.' },
    'mk_franchise': { id: 'mk_franchise', type: 'market', name: '프랜차이즈', tier: 4, cost: 800000, effects: { sellAmount: 40 }, desc: '브랜드 파워가 생겼다.' },
    'mk_enterprise': { id: 'mk_enterprise', type: 'market', name: '기업 급식', tier: 5, cost: 2500000, effects: { sellAmount: 100 }, desc: '대규모 납품 계약.' },

    // --- Sales: Org (Worker -> Speed) ---
    'so_solo': { id: 'so_solo', type: 'salesOrg', name: '직접 판매', tier: 1, cost: 0, effects: { sellSpeed: 0 }, desc: '발로 뛴다.' },
    'so_alba': { id: 'so_alba', type: 'salesOrg', name: '판매 알바', tier: 2, cost: 30000, effects: { sellSpeed: 1 }, desc: '보조 인력이 생겼다.' },
    'so_contract': { id: 'so_contract', type: 'salesOrg', name: '계약직 사원', tier: 3, cost: 150000, effects: { sellSpeed: 3 }, desc: '더 많이 팔아온다.' },
    'so_team': { id: 'so_team', type: 'salesOrg', name: '영업팀', tier: 4, cost: 500000, effects: { sellSpeed: 8 }, desc: '조직적인 영업 활동.' },
    'so_hq': { id: 'so_hq', type: 'salesOrg', name: '영업 본부', tier: 5, cost: 2000000, effects: { sellSpeed: 20 }, desc: '전략적인 시장 공략.' }
};

export const RESEARCH = {
    'unlock_kkakdugi': {
        id: 'unlock_kkakdugi',
        name: '깍두기 레시피 연구',
        cost: 100000,
        costItems: { 'kimchi_1': 50 },
        type: 'unlock',
        productId: 'kimchi_2',
        desc: '무를 썰어 맵게 버무리는 법을 배운다.'
    },
    'unlock_chonggak': {
        id: 'unlock_chonggak',
        name: '총각김치 레시피 연구',
        cost: 500000,
        costItems: { 'kimchi_2': 100 },
        prereq: 'unlock_kkakdugi',
        type: 'unlock',
        productId: 'kimchi_3',
        desc: '작은 무의 아삭함을 살리는 비법.'
    },
    'unlock_muegenji': {
        id: 'unlock_muegenji',
        name: '묵은지 숙성법',
        cost: 1000000,
        costItems: { 'kimchi_3': 100 },
        prereq: 'unlock_chonggak',
        type: 'unlock',
        productId: 'kimchi_4',
        desc: '깊은 맛을 내는 장기 숙성 기술.'
    },
    'unlock_100y': {
        id: 'unlock_100y',
        name: '100년 숙성 비기',
        cost: 5000000,
        costItems: { 'kimchi_4': 200 },
        prereq: 'unlock_muegenji',
        type: 'unlock',
        productId: 'kimchi_5',
        desc: '가문의 비법을 복원한다.'
    },
    'fermentation_lab': {
        id: 'fermentation_lab',
        name: '발효 실험실 구축',
        cost: 1000000,
        costItems: { 'kimchi_1': 500 },
        prereq: 'unlock_kkakdugi',
        type: 'unlock',
        productId: 'enzyme_vial',
        desc: '김치에서 효소를 추출할 수 있게 된다.'
    },
    'global_efficiency': {
        id: 'global_efficiency',
        name: '유산균 강화 연구',
        cost: 2000000,
        costEnzyme: 50,
        prereq: 'fermentation_lab',
        type: 'buff',
        effects: { priceMult: 1.2 },
        desc: '모든 김치의 판매 가격이 20% 상승한다.'
    },
    'unlock_sauce': {
        id: 'unlock_sauce',
        name: '만능 소스 개발',
        cost: 1500000,
        costEnzyme: 30,
        prereq: 'fermentation_lab',
        type: 'unlock',
        productId: 'kimchi_sauce',
        desc: '모든 요리의 베이스가 될 소스를 개발한다.'
    },
    'unlock_rice': {
        id: 'unlock_rice',
        name: 'K-볶음밥 레시피',
        cost: 2500000,
        costEnzyme: 60,
        prereq: 'unlock_sauce',
        type: 'unlock',
        productId: 'kimchi_fried_rice',
        desc: '김치소스와 밥의 완벽한 조화.'
    },
    'unlock_fusion': {
        id: 'unlock_fusion',
        name: '퓨전 중식 연구',
        cost: 5000000,
        costEnzyme: 100,
        prereq: 'unlock_rice',        type: 'unlock',
        productId: 'kimchi_tangsuyuk',
        desc: '김치와 튀긴 고기의 무시무시한 결합.'
    },
    'unlock_pasta': {
        id: 'unlock_pasta',
        name: '김치 파스타 연구',
        cost: 10000000,
        costEnzyme: 200,
        type: 'unlock',
        productId: 'kimchi_pasta',
        desc: '이탈리아의 면과 서울의 소스가 만났다.'
    },
    'unlock_dining': {
        id: 'unlock_dining',
        name: '파인다이닝 런칭',
        cost: 50000000,
        costEnzyme: 500,
        type: 'unlock',
        productId: 'kimchi_dining',
        desc: '김치를 예술의 경지로 끌어올린다.'
    },
    'star_kimchi_ship': {
        id: 'star_kimchi_ship',
        name: '스타김치십 프로젝트',
        cost: 100000000,
        costEnzyme: 1000,
        costItems: { 'kimchi_dining': 10 },
        type: 'prestige',
        desc: '서울타워를 발사대로 개조하여 우주로 김치를 실어 나른다. (발사 시 게임 초기화 및 AM 획득)'
    }
};

// GDD v0.68 16.3 AM Upgrades (A1-E2)
export const AM_UPGRADES = {
    // --- Production ---
    'am_prod_speed': { id: 'am_prod_speed', name: 'A1. 더 빠른 손', cost: 1, desc: '모든 생산 라인 생산속도 +25%', effects: { prodSpeedMult: 1.25 } },
    'am_cost_reduce': { id: 'am_cost_reduce', name: 'A2. 원가 절감', cost: 1, desc: '레시피 입력 소모량 -10%', effects: { costReduce: 0.1 } },
    
    // --- Logistics ---
    'am_warehouse': { id: 'am_warehouse', name: 'B1. 더 큰 창고', cost: 1, desc: 'Keep 수용량(Cap) +50%', effects: { capMult: 1.5 } },
    'am_auto_logi': { id: 'am_auto_logi', name: 'B2. 분류 자동화', cost: 1, desc: '물류 속도 +40% (분류 최적화)', effects: { moveSpeedMult: 1.4 } },

    // --- Sales ---
    'am_sales_org': { id: 'am_sales_org', name: 'C1. 판매 조직', cost: 1, desc: '판매 처리 속도 +40%', effects: { sellSpeedMult: 1.4 } },
    'am_premium': { id: 'am_premium', name: 'C2. 브랜드 프리미엄', cost: 1, desc: '판매 단가 +10%', effects: { priceMult: 1.1 } },

    // --- Research ---
    'am_res_eff': { id: 'am_res_eff', name: 'D1. 연구 효율', cost: 1, desc: '연구 효소 요구량 -20%', effects: { researchEnzymeReduce: 0.2 } },
    'am_res_cost': { id: 'am_res_cost', name: 'D2. 연구비 절감', cost: 1, desc: '연구 현금 비용 -15%', effects: { researchCashReduce: 0.15 } },

    // --- Prestige (Meta) ---
    'am_start_cash': { id: 'am_start_cash', name: 'E1. 시작 자본', cost: 1, desc: '프레스티지 후 시작 현금 +50%', effects: { startCashMult: 1.5 } },
    'am_start_buff': { id: 'am_start_buff', name: 'E2. 초반 가속', cost: 1, desc: '시작 후 5분간 생산속도 +25%', effects: { startBuffDuration: 300000, startBuffVal: 1.25 } }
};

// GDD v0.68 15.8 Achievements (A01-A20)
export const ACHIEVEMENTS = {
    'a01': { id: 'a01', title: '엄마의 냉장고', desc: '게임 시작 (첫 생산 1회)', rewardLog: 'l01' },
    'a02': { id: 'a02', title: '첫 판매', desc: '배추김치 10개 판매', rewardBanner: '장사 시작' },
    'a03': { id: 'a03', title: '부녀회 가입', desc: '김치 냉장고(설비 T2) 구매', rewardLog: 'l02' },
    'a04': { id: 'a04', title: '좌판 개시', desc: '동네 시장(시장 T2) 해금', rewardLog: 'l03' },
    'a05': { id: 'a05', title: '물류의 시작', desc: '물류 인력 1명 고용', rewardLog: 'l04' },
    'a06': { id: 'a06', title: '자동판매의 시작', desc: '판매 알바(조직 T2) 고용', rewardCheck: '판매 자동화' },
    'a07': { id: 'a07', title: '발효실험실 1호', desc: '발효실험실 해금 (효소 오픈)', rewardLog: 'l05' },
    'a08': { id: 'a08', title: '소스는 베이스다', desc: '김치소스 해금', rewardLog: 'l06' },
    'a09': { id: 'a09', title: '첫 퓨전', desc: '김치 탕수육 해금', rewardCheck: '퓨전 카운트' },
    'a10': { id: 'a10', title: '파인다이닝 오픈', desc: '김치 파인다이닝 해금', rewardCheck: '발사 준비' },
    'a11': { id: 'a11', title: '미래 재료 1호', desc: '신소재 해금 (Act3 프리뷰)', rewardLog: 'l07' },
    'a12': { id: 'a12', title: '클린룸 입성', desc: '반도체 SoC 해금 (Act3)', rewardCheck: '미래산업 생산' },
    'a13': { id: 'a13', title: '연산의 시대', desc: 'GPU 해금 (Act3)', rewardBanner: '발사 레시피' },
    'a14': { id: 'a14', title: '타워의 문서', desc: '발사대 연구(사실상 스타김치십)', rewardLog: 'l08' },
    'a15': { id: 'a15', title: '최종 조립 매뉴얼', desc: '스타김치십 제작 가능', rewardLog: 'l09' },
    'a16': { id: 'a16', title: '첫 발사', desc: '스타김치십 발사 1회', rewardLog: 'l10', rewardAM: 1 },
    'a17': { id: 'a17', title: '두 번째 발사', desc: '발사 2회 달성', rewardLog: 'l11' },
    'a18': { id: 'a18', title: '다섯 번째 발사', desc: '발사 5회 달성', rewardLog: 'l12' },
    'a19': { id: 'a19', title: '공정 최적화', desc: '조건부 분류 활성화 + 모듈 제작', rewardMedal: '물류 장인' },
    'a20': { id: 'a20', title: '근본은 배추김치', desc: '발사 직전 배추김치 생산 유지', rewardMedal: '근본' }
};

// GDD v0.68 15.7 Logbook (L01-L12)
export const LOGBOOK = {
    'l01': { id: 'l01', title: '엄마의 냉장고', content: '서울의 생존은 늘 하나였다. 남기는 게 아니라, 쌓는 것. 거창한 계획은 없다. "엄마김치... 팔아볼까?"', condition: () => true },
    'l02': { id: 'l02', title: '부녀회 공동구매 전단지', content: '김치가 진짜로 팔리기 시작했다. 부녀회에서 장비를 같이 사자고 한다. 이건 장사가 될 것 같다.', condition: (g) => g.hasAchievement('a03') },
    'l03': { id: 'l03', title: '시장 좌판의 규칙', content: '집 앞에서 팔던 김치가 시장으로 들어왔다. 이제는 "만드는 속도"보다 "파는 구조"가 중요해진다.', condition: (g) => g.hasAchievement('a04') },
    'l04': { id: 'l04', title: '납품은 김치가 아니라 물류다', content: '식당에서 연락이 온다. 문제는 하나다. 김치가 아니라 "물류"가 너를 죽이기 시작한다.', condition: (g) => g.hasAchievement('a05') },
    'l05': { id: 'l05', title: '발효실험실 기록 1호', content: '김치는 시간이 만든다. 그리고 시간은 연구할 수 있다. 실험실이 열렸고, 효소가 보이기 시작한다.', condition: (g) => g.hasAchievement('a07') },
    'l06': { id: 'l06', title: '김치소스는 베이스다', content: '김치는 팔리는 음식이 아니라, 안정적인 금융상품이다. 김치소스가 그 증거다.', condition: (g) => g.hasAchievement('a08') },
    'l07': { id: 'l07', title: '미래산업의 첫 재료', content: '누군가 김치 유산균으로 신소재를 만들 수 있다고 했다. 말도 안 되지만, 서울이니까 가능할지도 모른다.', condition: (g) => g.hasAchievement('a11') },
    'l08': { id: 'l08', title: '서울타워 기술문서', content: '서울타워는 원래 통신탑이 아니었다. 그 구조는 처음부터 발사대를 염두에 두고 있었다.', condition: (g) => g.hasAchievement('a14') },
    'l09': { id: 'l09', title: '스타김치십: 조립 매뉴얼', content: '이 우주선은 연료가 아니라 발효 가스로 움직인다. 농담 같지만 진짜다.', condition: (g) => g.hasAchievement('a15') },
    'l10': { id: 'l10', title: '외계물질(AM) 회수 보고서', content: '스타김치십이 귀환했다. 외계물질 1을 확보했다. 연구 탭에서 "외계물질 연구소"를 열어보자.', condition: (g) => g.hasAchievement('a16') },
    'l11': { id: 'l11', title: '두 번째 발사: 신호가 되돌아오다', content: '무언가가 답장을 보냈다. 단순한 반사가 아니다. 명백한 의도가 담긴 신호다.', condition: (g) => g.hasAchievement('a17') },
    'l12': { id: 'l12', title: '다섯 번째 발사: 누군가 듣고 있다', content: '규칙을 바꾸는 자를... 누군가가 보고 있다. 이제 되돌릴 수 없다.', condition: (g) => g.hasAchievement('a18') }
};
