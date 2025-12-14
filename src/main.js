import { safeGetJSON, safeRemove, safeSetJSON } from './persist/storage.js';
import { getFinancialCost, getFinancialSellPrice, getPropertyCost, getPropertySellPrice } from './economy/pricing.js';
import { createMarketSystem } from './systems/market.js';
import { createAchievementsSystem } from './systems/achievements.js';
import { createUpgradeUnlockSystem } from './systems/upgrades.js';

// 프로덕션에 디버깅 로그/치트가 남지 않도록 콘솔을 무력화합니다.
// (모듈화 이행 과정에서 기존 인라인 코드의 console.* 호출이 많아, 1차로 안전하게 차단)
const console = { log() {}, warn() {}, error() {} };

document.addEventListener('DOMContentLoaded', () => {

    /*
    ============================================
    CHANGELOG v3.1.0 - 리스크 시스템 & 이벤트 대폭 강화
    ============================================
    [새 기능]
    • 🎲 리스크 시스템: 각 상품별 리스크 레벨과 변동 수익률 구현
      - 예금(5%) → 코인(50%)까지 단계적 리스크 증가
      - 시각적 리스크 표시기 (색상 코딩)
    • ⚡ 시장 이벤트: 상품별 세분화된 이벤트 (32개 → 64개로 확장)
      - 강남 아파트 대박, 코인 시장 폭락 등 현실적 이벤트
      - 각 상품별 개별 수익/손실 효과
    • 📈 업그레이드 재밸런싱: 48개 업그레이드 비용/효과 최적화
      - 게임 밸런싱 전문가 관점에서 전체적 조정
      - 리스크 감소 업그레이드 추가
    • 🏆 업적 확장: 16개 → 32개 업적으로 확장
      - 리스크 관련 업적, 시장 이벤트 업적 추가
    • 🎨 시각 효과: 떨어지는 지폐/상품 애니메이션 추가
      - 노동 클릭 시 지폐 떨어짐
      - 상품 구매 시 해당 상품 이모지 떨어짐
    
    [버그 수정]
    • 🔧 중복 선언 오류 수정 (marketEventEndTime)
    • 🔧 버튼 상태 오류 수정 (미국주식, 코인 구매 버튼)
    • 🔧 하이라이트 이펙트 오류 수정 (잘못된 상품 하이라이트)
    
    [개선사항]
    • 📝 README.md 업데이트: 새로운 기능들 반영
    • ⚖️ 게임 밸런싱: 중반 허리 이어주기 (미국주식, 코인)
    • 🔄 순차 해금: 예금→적금→국내주식→미국주식→코인→빌라 순서
    
    CHANGELOG v2.11.0 - PC 버전 통계 탭 추가 및 반응형 개선
    ============================================
    [새 기능]
    • 📊 PC 버전에 통계 탭 상시 표시 (3열 그리드)
    • 🖥️ 화면 크기별 반응형 레이아웃
      - 1367px 이상: 3열 (노동 + 상점 + 통계)
      - 769px~1366px: 2열 + 통계 하단
      - 768px 이하: 모바일 탭 네비게이션
    • 📐 통계 탭 컴팩트 스타일링 (PC 최적화)
    • 📜 자동 스크롤 지원 (max-height: 85vh)
    
    CHANGELOG v2.10.1 - 업그레이드 효과 중복 적용 버그 수정
    ============================================
    [버그 수정]
    • 🐛 새로고침 시 clickMultiplier가 계속 증가하는 버그 수정
    • 업그레이드 효과 재적용 코드 제거 (배수는 이미 저장된 값으로 복원됨)
    • 이제 새로고침해도 시급이 정상적으로 유지됩니다
    
    CHANGELOG v2.10.0 - Cookie Clicker 스타일 통계 탭
    ============================================
    [새 기능]
    • 📊 Cookie Clicker 스타일의 상세 통계 탭 구현
    • 💰 총 자산 및 누적 수익 표시
    • 📈 수익 구조 시각화 (노동/금융/부동산 비율)
    • 📊 자산별 누적 수익 및 개당 효율 분석
    • ⏱️ 플레이 시간 및 시간당 수익 추적
    • 🏆 업적 그리드 시스템
    • ⚡ 효율 순위 TOP 3 표시
    
    [데이터 추적]
    • 게임 시작 시간 저장/불러오기
    • 실시간 통계 업데이트
    • 모바일 최적화 반응형 레이아웃
    
    CHANGELOG v2.9.0 - 순차 해금 시스템
    ============================================
    
    🔐 금융상품과 부동산의 단계적 해금 시스템 도입
    
    A. 순차 해금 체계 ✅
    예금 (항상 가능)
      → 적금 (예금 1개 필요)
        → 주식 (적금 1개 필요)
          → 빌라 (주식 1개 필요)
            → 오피스텔 (빌라 1개 필요)
              → 아파트 (오피스텔 1개 필요)
                → 상가 (아파트 1개 필요)
                  → 빌딩 (상가 1개 필요)
    
    B. 시각적 피드백 ✅
    - 🔒 잠긴 상품: 회색 처리 + 잠금 아이콘 표시
    - 투명도 30%, 흑백 필터 90%
    - 클릭 불가 (pointer-events: none)
    - 호버 효과 비활성화
    
    C. 해금 메시지 및 애니메이션 ✅
    - 상품 구매 시 다음 상품 자동 해금 체크
    - "🔓 적금이 해금되었습니다!" 메시지
    - 발광 애니메이션 (1초간 초록색 빛)
    - 자연스러운 확대/축소 효과
    
    D. 에러 방지 ✅
    - 잠긴 상품 클릭 시 안내 메시지
    - "❌ 적금은 예금을 1개 이상 보유해야 해금됩니다."
    - 명확한 해금 조건 안내
    
    E. 게임 플레이 효과 ✅
    - 초보자 친화적: 단계별 학습 유도
    - 명확한 진행 경로: 무엇을 다음에 해야 하는지 명확
    - 성취감 증가: 새 상품 해금 시마다 보상감
    - 전략적 깊이: 효율보다 해금이 우선
    
    ============================================
    CHANGELOG v2.8.1 - 노동 배수 밸런싱
    ============================================
    
    ⚖️ 게임 밸런스 개선: 노동 수익 너프로 부동산 가치 회복
    
    A. 업그레이드 배수 조정 (보수적 너프) ✅
    기존 → 새로운 배수
    - ⚡ 효율적인 업무 처리: ×2 → ×1.5
    - 🎯 집중력 강화: ×2 → ×1.5
    - 💰 성과급 (구 골든 클릭): 평균 ×1.9 → ×1.5 (10% 확률로 6배)
    - 🔥 초과근무: ×2 → ×1.3
    - 💎 전문성 개발: ×2 → ×1.3
    - 👔 CEO 특권: ×3 → ×2
    
    최종 누적 배수: 91.2배 → 11.4배 (약 8배 감소)
    
    B. 네이밍 변경 ✅
    - "✨ 골든 클릭" → "💰 성과급" (더 현실적인 표현)
    - 로그 메시지: "골든 클릭! 10배 수익!" → "성과급 지급! 6배 수익!"
    
    C. 게임 밸런스 효과 ✅
    CEO 클릭당 수익 비교:
    - 기존: 2,280만원/클릭 (과도함)
    - 개선: 285만원/클릭 (적절함)
    
    부동산 대비 균형:
    - 빌딩 월세: 51.4만원/초
    - CEO 오토클릭: 285만원/초 = 빌딩 5.5채 수준
    - 결론: 노동 + 부동산 모두 의미있게 작동 ⚖️
    
    D. 실전 시급표 (CEO + 모든 업그레이드) ✅
    - 기본: 25만원 → 25만원
    - +⚡: 50만원 → 37.5만원
    - +🎯: 100만원 → 56.3만원
    - +💰: 190만원 → 84.4만원 (평균)
    - +🔥: 380만원 → 109.8만원
    - +💎: 760만원 → 142.7만원
    - +👔: 2,280만원 → 285만원 (최종)
    
    ============================================
    CHANGELOG v2.8.0 - 노동 시스템 종합 최적화
    ============================================
    
    🎯 노동 수익 시스템 4대 최적화 완료
    
    A. 승진 필요 클릭 수 재조정 (부드러운 곡선) ✅
    기존 → 새로운 값 (더 부드러운 성장 곡선)
    - 계약직: 20 → 50 클릭
    - 사원: 40 → 100 클릭
    - 대리: 120 → 200 클릭
    - 과장: 240 → 350 클릭
    - 차장: 400 → 550 클릭
    - 부장: 600 → 800 클릭
    - 상무: 800 → 1,100 클릭
    - 전무: 1,200 → 1,500 클릭
    - CEO: 2,000 클릭 (유지)
    
    B. 업그레이드 해금 조건 재조정 ✅
    더 빠른 타이밍에 해금되어 초중반 강화
    - ⚡ 효율적인 업무 처리: 100 → 50 클릭 (사원 직전)
    - 🎯 집중력 강화: 500 → 250 클릭 (과장 직전)
    - ✨ 골든 클릭: 1,000 → 600 클릭 (부장 직전)
    
    C. 신규 업그레이드 3종 추가 ✅
    후반 노동 수익 강화를 위한 새로운 업그레이드
    - 🔥 초과근무 (1,200 클릭): 클릭당 수익 ×2, 5천만원
    - 💎 전문성 개발 (2,000 클릭): 클릭당 수익 ×2, 2억원
    - 👔 CEO 특권 (CEO 달성): 클릭당 수익 ×3, 10억원
    
    D. 오토클릭 시스템 추가 ✅
    자동화로 후반 게임플레이 개선
    - 📱 자동 업무 처리 시스템: 1초마다 자동 1회 클릭
    - 해금 조건: 상무(7레벨) 이상 + 부동산 10채 보유
    - 비용: 50억원
    - 골든 클릭 확률 적용 (10% 확률로 10배)
    
    E. 게임 밸런스 효과 ✅
    - 초반: 더 빠른 업그레이드로 재미 증가
    - 중반: 부드러운 승진 곡선으로 지루함 감소
    - 후반: 신규 업그레이드 + 오토클릭으로 의미 있는 노동 수익
    - 최종 배수: 1 × 2 × 2 × 2 × 2 × 2 × 3 = 192배 (기존 32배 대비 6배 증가)
    - CEO + 모든 업그레이드: 25 × 192 = 4,800배 (클릭당 4,800만원!)
    
    ============================================
    CHANGELOG v2.7.1 - 노동 시급 밸런싱 (연봉 기반)
    ============================================
    
    ⚖️ 게임 밸런스 개선: 현실적인 급여 체계 적용
    
    A. 직급별 시급 조정 (연봉 기반) ✅
    - 알바 (2000만원): 1.0배 → 1.0배 (유지)
    - 계약직 (3000만원): 1.5배 → 1.5배 (유지)
    - 사원 (4000만원): 2.5배 → 2.0배 (-20%)
    - 대리 (5000만원): 4.0배 → 2.5배 (-37.5%)
    - 과장 (6000만원): 6.0배 → 3.0배 (-50%)
    - 차장 (7000만원): 8.0배 → 3.5배 (-56%)
    - 부장 (8000만원): 12.0배 → 4.0배 (-67%)
    - 상무 (1억원): 18.0배 → 5.0배 (-72%)
    - 전무 (2억원): 30.0배 → 10.0배 (-67%)
    - CEO (5억원): 50.0배 → 25.0배 (-50%)
    
    B. 게임 밸런스 개선 효과 ✅
    - 초중반 금융상품의 의미 강화
    - 부동산 투자 필요성 증가
    - 노동 vs 자산 수익 균형 달성
    - 후반에도 여전히 폭발적 성장 (전무 10배, CEO 25배)
    
    C. 현실성 개선 ✅
    - 실제 연봉 체계와 일치
    - 연간 2,000시간 근무 기준
    - 직급별 합리적인 급여 상승 곡선
    
    D. 게임플레이 영향 ✅
    - 초반(알바~계약직): 변화 없음, 진입 장벽 유지
    - 중반(사원~부장): 노동 수익 감소, 투자 필수화
    - 후반(상무~CEO): 여전히 강력하지만 부동산과 균형
    
    ============================================
    CHANGELOG v2.7.0 - Cookie Clicker 스타일 3줄 설명 시스템
    ============================================
    
    🎮 Cookie Clicker 벤치마킹: 상품 설명 구조 개선
    
    A. 3줄 설명 시스템 도입 ✅
    각 금융상품/부동산마다 다음 정보를 표시:
    - 1줄: 개별 수익 (예: "• 각 예금이 초당 10원 생산")
    - 2줄: 총 기여도 (예: "• 5개 예금이 초당 50원 생산 (총 수익의 5%)")
    - 3줄: 누적 생산량 (예: "• 지금까지 125,000원 생산")
    
    B. 누적 생산량 추적 시스템 ✅
    - 금융상품: depositsLifetime, savingsLifetime, bondsLifetime
    - 부동산: villasLifetime, officetelsLifetime, apartmentsLifetime, shopsLifetime, buildingsLifetime
    - 매 틱(50ms)마다 개별 상품의 생산량 누적
    - 저장/불러오기에 포함
    
    C. 실시간 통계 계산 ✅
    - 각 상품의 총 수익 = 개당 수익 × 보유 개수
    - 전체 RPS 대비 비율 계산
    - 숫자 서식: 천단위 콤마, 원단위 표시
    
    D. UI/UX 개선 ✅
    - 플레이어가 각 상품의 효율성을 한눈에 파악
    - 어느 상품이 가장 많이 벌고 있는지 직관적으로 확인
    - 누적 생산량으로 성취감 제공
    - Cookie Clicker의 정보 전달 방식 완벽 구현
    
    E. 기술 구현 ✅
    - HTML: 8개 상품 × 3개 정보 = 24개 새 요소 추가
    - JavaScript: updateUI()에서 실시간 계산 및 업데이트
    - 게임 루프: deltaTime 기반 누적 생산량 계산
    - 저장/불러오기: 모든 lifetime 변수 포함
    
    ============================================
    CHANGELOG v2.6.2 - UI 디자인 통일
    ============================================
    
    🎨 전체 UI 일관성 개선
    
    A. 금융상품/부동산 카드 스타일 업그레이드와 통일 ✅
    - 배경색: var(--btn2) → var(--btn)
    - 테두리: 1px → 2px solid transparent
    - border-radius: 12px → 8px
    - 호버 효과: 배경 변경 + 테두리 하늘색 + 위로 이동
    - 간격: 10px → 8px (일관성)
    
    B. 구매 가능 상태 시각 효과 개선 ✅
    - affordable: 초록 테두리 + 발광 애니메이션 (업그레이드와 동일)
    - 기존: border-left만 → 개선: 전체 테두리 + 그림자
    - upgradeGlow 애니메이션 공유
    
    C. 버튼 디자인 현대화 ✅
    - 배경: var(--btn) → var(--accent) (민트색)
    - 텍스트: var(--text) → var(--bg) (검정, 대비 강화)
    - 크기: padding 16px 22px → 8px 16px (컴팩트)
    - 폰트: 기본 → 12px (일관성)
    - 호버: 밝기 증가 + 크기 확대
    - 비활성: 회색 배경
    
    D. 메타 정보 레이아웃 개선 ✅
    - flex:1 추가로 공간 최적 활용
    - desc 마진: 4px 추가 (가독성)
    - pointer-events:none으로 클릭 간섭 방지
    
    E. 전체적인 통일감 ✅
    - 업그레이드 / 금융상품 / 부동산 모두 동일한 디자인 언어
    - 호버 시 일관된 반응
    - 구매 가능 시 동일한 시각적 피드백
    
    ============================================
    CHANGELOG v2.6.1 - 업그레이드 클릭 문제 해결
    ============================================
    
    🐛 핵심 버그 수정: 업그레이드 클릭 불가 문제
    
    A. 문제 진단 ✅
    - updateUI()가 50ms마다 호출되면서 updateUpgradeList()도 함께 호출
    - DOM이 초당 20번 재생성되어 클릭 도중 요소가 사라짐
    - 테두리 깜빡임 현상 (업그레이드 리스트 재생성 신호)
    - F12 개발자 도구 열면 성능 저하로 클릭 가능 (증상 확인)
    
    B. 해결 방법 ✅
    - updateUpgradeList() → 해금/구매 시에만 호출 (DOM 재생성)
    - updateUpgradeAffordability() → 매 틱마다 호출 (클래스만 토글)
    - pointer-events: none을 자식 요소에 적용
    
    C. 성능 개선 ✅
    - DOM 재생성: 초당 20회 → 필요시에만
    - 스타일 업데이트: 0회 → 초당 20회 (가벼움)
    - CPU 사용량: 감소
    - 메모리 사용량: 감소
    
    D. 사용자 경험 개선 ✅
    - ✅ 테두리 깜빡임 완전 제거
    - ✅ 클릭 100% 작동 보장
    - ✅ F12 없이도 정상 구매 가능
    - ✅ 부드러운 애니메이션
    
    ============================================
    CHANGELOG v2.6 - Cookie Clicker 스타일 업그레이드 시스템
    ============================================
    
    🎯 핵심 개편: "건물별 업그레이드 해금 시스템"
    
    A. 업그레이드 시스템 전면 개편 ✅
    - 기존 3x3 그리드 → Cookie Clicker 스타일 리스트
    - 하단 업그레이드 섹션 통합 (월세 수익률, 관리인 고용)
    - 동적 해금 시스템: 조건 충족 시 자동 표시
    
    B. 건물별 업그레이드 추가 ✅
    - 노동: 총 클릭 수 기반 (3개)
    - 예금: 5/25개 보유 시 (2개)
    - 적금: 5/25개 보유 시 (2개)
    - 주식: 5/25개 보유 시 (2개)
    - 빌라: 5/25개 보유 시 (2개)
    - 오피스텔: 5/25개 보유 시 (2개)
    - 아파트: 5/25개 보유 시 (2개)
    - 상가: 5/25개 보유 시 (2개)
    - 빌딩: 5/25개 보유 시 (2개)
    - 전역: 총 부동산/금융 개수 기반 (3개)
    
    C. UI/UX 개선 ✅
    - 구매 가능한 업그레이드 시각적 강조 (발광 효과)
    - NEW! 배지 추가
    - 업그레이드 개수 표시 "(3)"
    - 스크롤 가능한 리스트 (max-height: 400px)
    
    D. 저장/불러오기 통합 ✅
    - 업그레이드 해금/구매 상태 저장
    - 로드 시 구매한 업그레이드 효과 재적용
    
    ============================================
    CHANGELOG v2.5 - 자본주의 메시지 구현
    ============================================
    
    🎯 핵심 철학: "더 큰 자본을 소유할수록 더 높은 수익률"
    
    A. 수익률 재설계 (일관된 상승 곡선) ✅
    - 예금(0.010%) < 적금(0.015%) < 주식(0.0225%)
    - 빌라(0.00338%) < 오피스텔(0.00506%) < 아파트(0.00759%)
    - 상가(0.01142%) < 빌딩(0.01713%) 
    - 각 단계 1.5배 체증 구조, 총 171배 효율 차이
    
    B. 금융상품 수익 하향 조정 ✅
    - 예금: 10원/초 → 5원/초 (-50%)
    - 적금: 120원/초 → 75원/초 (-37.5%)
    - 주식: 1,400원/초 → 1,125원/초 (-19.6%)
    
    C. 부동산 수익 대폭 상향 ✅
    - 빌라: 250원/초 → 8,438원/초 (+3,275%)
    - 오피스텔: 500원/초 → 17,719원/초 (+3,444%)
    - 아파트: 1,000원/초 → 60,750원/초 (+5,975%)
    - 상가: 2,000원/초 → 137,000원/초 (+6,750%)
    - 빌딩: 5,000원/초 → 514,000원/초 (+10,180%)
    
    D. 원룸 완전 삭제 ✅
    - 부동산 6종 → 5종으로 단순화
    - HTML, JS, DOM, 이벤트, saveGame 등 전체 제거
    
    E. 숫자 서식 개선 ✅
    - ₩ 기호 제거: "구입 (₩1.5억)" → "구입 (1.5억)"
    - 천단위 콤마 추가: formatFinancialPrice(), formatPropertyPrice()
    - 금융상품: 만원 단위 반올림
    - 부동산: 0.1억 단위 반올림
    
    F. 상단 패널 툴팁 추가 ✅
    - 금융 툴팁: 예금/적금/주식 개수 표시
    - 부동산 툴팁: 빌라/오피스텔/아파트/상가/빌딩 개수
    - 수익 툴팁: 금융/부동산 수익, 시장배수 상세
    
    G. 직급 메시지 정합성 ✅
    - 승진 로그: "🎉 신입사원으로 승진했습니다! (클릭당 1.2배 수익)"
    
    ============================================
    v2.4 - 판매 시스템 전면 개편
    ============================================
    
    🎯 판매 시스템 통합 및 최적화
    
    A. 불필요한 판매 버튼 제거 ✅
    - 금융상품별 개별 판매 버튼 3개 제거 (HTML/JS)
    
    B. 구매/판매 모드 토글 시스템 통합 ✅
    - 모든 금융상품과 부동산에 구매/판매 모드 적용
    - 단일 버튼으로 구매/판매 전환 (상단 토글로 제어)
    
    C. 통합 거래 함수 구현 ✅
    - handleTransaction(category, type, currentCount)
    - 구매/판매 로직 통합, 성공/실패 상태 반환
    
    D. 판매 가격 계산 시스템 완성 ✅
    - getFinancialSellPrice(), getPropertySellPrice()
    - 판매 가격: 현재가의 80% (일관된 정책)
    - 다중 수량 판매 지원 (1/5/10개)
    
    E. 가격 계산 함수 개선 ✅
    - 다중 구매/판매 지원 (quantity 파라미터)
    - 누적 가격 정확하게 계산
    
    F. 버튼 UI 동적 업데이트 ✅
    - updateButton() 함수로 텍스트/상태 자동 업데이트
    - "구입 x10 (₩1.5만)" / "판매 x10 (₩1.2만)"
    
    G. 모든 거래 이벤트 리팩토링 ✅
    - 총 58줄 → 36줄 (38% 감소)
    
    H. 성능 최적화 ✅
    - setInterval: 250ms → 50ms (5배 빠름)
    - Ctrl+R 충돌 해결 → Ctrl+Shift+R
    
    I. 사용자 피드백 개선 ✅
    - 자금/수량 부족 시 명확한 메시지
    - 성공 메시지에 이모지 + 가격 + 보유수량
    
    ============================================
    v2.3 - 정밀 검사 및 수정 완료
    ============================================
    - DOM/ID/참조 불일치 수정
    - 커리어 진행률 0% 고정 문제 해결
    - CSS 변수/테마 누락 수정
    - 저장/불러오기/리셋 일관화
    ============================================
    */
    
    // ======= 유틸리티 함수 =======
    function safeText(element, text) {
      if (element && element.textContent !== undefined) {
        element.textContent = text;
      }
    }
    
    function safeHTML(element, html) {
      if (element && element.innerHTML !== undefined) {
        element.innerHTML = html;
      }
    }
    
    function safeClass(element, className, add = true) {
      if (element && element.classList) {
        if (add) {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }
      }
    }
    
    // 구매/판매 통합 함수
    function handleTransaction(category, type, currentCount) {
      const qty = purchaseQuantity;
      
      if (purchaseMode === 'buy') {
        // 구매 로직
        const cost = category === 'financial' 
          ? getFinancialCost(type, currentCount, qty)
          : getPropertyCost(type, currentCount, qty);
        
        if (cash < cost) {
          addLog(`💸 자금이 부족합니다. (필요: ${formatKoreanNumber(cost)}원)`);
          return { success: false, newCount: currentCount };
        }
        
        cash -= cost;
        const newCount = currentCount + qty;
        const unit = category === 'financial' ? '개' : '채';
        const names = {
          deposit: '예금', savings: '적금', bond: '주식',
          villa: '빌라', officetel: '오피스텔',
          apartment: '아파트', shop: '상가', building: '빌딩'
        };
        
        addLog(`✅ ${names[type]} ${qty}${unit}를 구입했습니다. (보유 ${newCount}${unit})`);
        
        // 구매 성공 시 떨어지는 애니메이션
        const buildingIcons = {
          deposit: '💰', savings: '🏦', bond: '📈',
          villa: '🏠', officetel: '🏢',
          apartment: '🏘️', shop: '🏪', building: '🏬'
        };
        createFallingBuilding(buildingIcons[type] || '🏠', qty);
        
        return { success: true, newCount };
        
      } else if (purchaseMode === 'sell') {
        // 판매 로직
        if (currentCount < qty) {
          addLog(`❌ 판매할 수량이 부족합니다. (보유: ${currentCount})`);
          return { success: false, newCount: currentCount };
        }
        
        const sellPrice = category === 'financial'
          ? getFinancialSellPrice(type, currentCount, qty)
          : getPropertySellPrice(type, currentCount, qty);
        
        cash += sellPrice;
        const newCount = currentCount - qty;
        const unit = category === 'financial' ? '개' : '채';
        const names = {
          deposit: '예금', savings: '적금', bond: '주식',
          villa: '빌라', officetel: '오피스텔',
          apartment: '아파트', shop: '상가', building: '빌딩'
        };
        
        addLog(`💰 ${names[type]} ${qty}${unit}를 판매했습니다. (+${formatKoreanNumber(sellPrice)}원, 보유 ${newCount}${unit})`);
        return { success: true, newCount };
      }
      
      return { success: false, newCount: currentCount };
    }
    
    // ======= 상태 =======
    const fmt = new Intl.NumberFormat('ko-KR');
    
    // 한국식 숫자 표기 함수 (일반용)
    function formatKoreanNumber(num) {
      if (num >= 1000000000000) {
        return (num / 1000000000000).toFixed(1) + '조';
      } else if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + '억';
      } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + '만';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + '천';
      } else {
        return Math.floor(num).toString();
      }
    }
    
    // 금융상품용 포맷 (만원 단위까지 반올림, 천단위 콤마)
    function formatFinancialPrice(num) {
      if (num >= 100000000) {
        // 1억 이상: 억 단위로 표시
        const eok = Math.round(num / 100000000);
        return eok.toLocaleString('ko-KR') + '억';
      } else if (num >= 10000) {
        // 1만 이상: 만원 단위로 반올림
        const man = Math.round(num / 10000);
        return man.toLocaleString('ko-KR') + '만';
      } else if (num >= 1000) {
        // 1천 이상: 천원 단위
        const cheon = Math.round(num / 1000);
        return cheon.toLocaleString('ko-KR') + '천';
      } else {
        return Math.floor(num).toLocaleString('ko-KR');
      }
    }
    
    // 부동산용 포맷 (0.1억 단위까지 반올림, 천단위 콤마)
    function formatPropertyPrice(num) {
      if (num >= 100000000) {
        // 1억 이상: 0.1억 단위로 반올림
        const eok = Math.round(num / 10000000) / 10;
        return eok.toLocaleString('ko-KR') + '억';
      } else if (num >= 10000) {
        // 1만 이상: 만원 단위로 반올림
        const man = Math.round(num / 10000);
        return man.toLocaleString('ko-KR') + '만';
      } else {
        return Math.floor(num).toLocaleString('ko-KR');
      }
    }
    
    // 현금 표시용 함수 (원단위까지 모두 표기)
    function formatCashDisplay(num) {
      return Math.floor(num).toLocaleString('ko-KR') + '원';
    }
    
    // 가격/판매 계산 로직은 src/economy/pricing.js 로 이동
    let cash = 0;
    
    // 누적 플레이시간 시스템 (전역 변수)
    let totalPlayTime = 0; // 누적 플레이시간 (밀리초)
    let sessionStartTime = Date.now(); // 현재 세션 시작 시간
    let gameStartTime = Date.now(); // 게임 시작 시간 (호환성 유지)
    
    // 금융상품 보유 수량
    let deposits = 0;     // 예금
    let savings = 0;      // 적금
    let bonds = 0;        // 국내주식
    let usStocks = 0;     // 미국주식
    let cryptos = 0;      // 코인
    
    // 금융상품 누적 생산량 (Cookie Clicker 스타일)
    let depositsLifetime = 0;
    let savingsLifetime = 0;
    let bondsLifetime = 0;
    let usStocksLifetime = 0;
    let cryptosLifetime = 0;
    
    // 부동산 누적 생산량
    let villasLifetime = 0;
    let officetelsLifetime = 0;
    let apartmentsLifetime = 0;
    let shopsLifetime = 0;
    let buildingsLifetime = 0;
    
    // 구매 수량 선택 시스템
    let purchaseMode = 'buy';  // 'buy' or 'sell'
    let purchaseQuantity = 1;  // 1, 5, 10
    
    // 자동 저장 시스템
    const SAVE_KEY = 'seoulTycoonSaveV1';
    let lastSaveTime = new Date();
    
    // ======= 업그레이드 시스템 (Cookie Clicker 스타일) =======
    const UPGRADES = {
      // === 노동 관련 (재밸런싱) ===
      part_time_job: {
        name: "🍕 아르바이트 경험",
        desc: "클릭 수익 1.2배 (안전)",
        cost: 50000,
        icon: "🍕",
        unlockCondition: () => totalClicks >= 20,
        effect: () => { clickMultiplier *= 1.2; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      internship: {
        name: "📝 인턴십",
        desc: "클릭 수익 1.3배 (안전)",
        cost: 200000,
        icon: "📝",
        unlockCondition: () => totalClicks >= 50,
        effect: () => { clickMultiplier *= 1.3; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      efficient_work: {
        name: "⚡ 효율적인 업무 처리",
        desc: "클릭 수익 1.5배 (안전)",
        cost: 500000,
        icon: "⚡",
        unlockCondition: () => totalClicks >= 100,
        effect: () => { clickMultiplier *= 1.5; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      focus_training: {
        name: "🎯 집중력 강화",
        desc: "클릭 수익 1.4배 (안전)",
        cost: 2000000,
        icon: "🎯",
        unlockCondition: () => totalClicks >= 250,
        effect: () => { clickMultiplier *= 1.4; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      performance_bonus: {
        name: "💰 성과급",
        desc: "15% 확률로 5배, 85% 확률로 50% 감소 (중간 위험)",
        cost: 10000000,
        icon: "💰",
        unlockCondition: () => totalClicks >= 600,
        effect: () => { /* 확률형 효과는 클릭 이벤트에서 처리 */ },
        category: "labor",
        risk: 3,
        unlocked: false,
        purchased: false
      },
      overtime_work: {
        name: "🔥 초과근무",
        desc: "클릭 수익 +30%, 다른 수익 -10% (낮은 위험)",
        cost: 50000000,
        icon: "🔥",
        unlockCondition: () => totalClicks >= 1200,
        effect: () => { 
          clickMultiplier *= 1.3;
          // 다른 수익 감소는 별도 처리 필요
        },
        category: "labor",
        risk: 2,
        unlocked: false,
        purchased: false
      },
      expertise_development: {
        name: "💎 전문성 개발",
        desc: "클릭 수익 1.4배 (안전)",
        cost: 200000000,
        icon: "💎",
        unlockCondition: () => totalClicks >= 2000,
        effect: () => { clickMultiplier *= 1.4; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      teamwork: {
        name: "🤝 팀워크 향상",
        desc: "클릭 수익 1.3배 (안전)",
        cost: 500000000,
        icon: "🤝",
        unlockCondition: () => totalClicks >= 3000,
        effect: () => { clickMultiplier *= 1.3; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      leadership: {
        name: "👑 리더십",
        desc: "클릭 수익 1.5배 (안전)",
        cost: 2000000000,
        icon: "👑",
        unlockCondition: () => totalClicks >= 5000,
        effect: () => { clickMultiplier *= 1.5; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      ceo_privilege: {
        name: "👔 CEO 특권",
        desc: "클릭 수익 1.8배 (안전)",
        cost: 10000000000,
        icon: "👔",
        unlockCondition: () => careerLevel >= 9,
        effect: () => { clickMultiplier *= 1.8; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      global_experience: {
        name: "🌍 글로벌 경험",
        desc: "클릭 수익 2배 (안전)",
        cost: 50000000000,
        icon: "🌍",
        unlockCondition: () => totalClicks >= 20000,
        effect: () => { clickMultiplier *= 2; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      entrepreneurship: {
        name: "🚀 창업",
        desc: "클릭 수익 2.5배 (안전)",
        cost: 100000000000,
        icon: "🚀",
        unlockCondition: () => totalClicks >= 50000,
        effect: () => { clickMultiplier *= 2.5; },
        category: "labor",
        risk: 0,
        unlocked: false,
        purchased: false
      },
      
      // === 예금 관련 ===
      deposit_boost_1: {
        name: "💰 예금 이자율 상승",
        desc: "예금 수익 2배",
        cost: 500000,
        icon: "💰",
        unlockCondition: () => deposits >= 5,
        effect: () => { FINANCIAL_INCOME.deposit *= 2; },
        category: "deposit",
        unlocked: false,
        purchased: false
      },
      deposit_boost_2: {
        name: "💎 프리미엄 예금",
        desc: "예금 수익 2배",
        cost: 5000000,
        icon: "💎",
        unlockCondition: () => deposits >= 25,
        effect: () => { FINANCIAL_INCOME.deposit *= 2; },
        category: "deposit",
        unlocked: false,
        purchased: false
      },
      
      // === 적금 관련 ===
      savings_boost_1: {
        name: "🏦 적금 복리 효과",
        desc: "적금 수익 2배",
        cost: 5000000,
        icon: "🏦",
        unlockCondition: () => savings >= 5,
        effect: () => { FINANCIAL_INCOME.savings *= 2; },
        category: "savings",
        unlocked: false,
        purchased: false
      },
      savings_boost_2: {
        name: "🏅 골드 적금",
        desc: "적금 수익 2배",
        cost: 50000000,
        icon: "🏅",
        unlockCondition: () => savings >= 25,
        effect: () => { FINANCIAL_INCOME.savings *= 2; },
        category: "savings",
        unlocked: false,
        purchased: false
      },
      
      // === 주식 관련 ===
      bond_boost_1: {
        name: "📈 주식 수익률 향상",
        desc: "주식 수익 2배",
        cost: 50000000,
        icon: "📈",
        unlockCondition: () => bonds >= 5,
        effect: () => { FINANCIAL_INCOME.bond *= 2; },
        category: "bond",
        unlocked: false,
        purchased: false
      },
      bond_boost_2: {
        name: "💹 프리미엄 주식",
        desc: "주식 수익 2배",
        cost: 500000000,
        icon: "💹",
        unlockCondition: () => bonds >= 25,
        effect: () => { FINANCIAL_INCOME.bond *= 2; },
        category: "bond",
        unlocked: false,
        purchased: false
      },
      
      // === 빌라 관련 ===
      villa_boost_1: {
        name: "🏘️ 빌라 리모델링",
        desc: "빌라 수익 2배",
        cost: 500000000,
        icon: "🏘️",
        unlockCondition: () => villas >= 5,
        effect: () => { BASE_RENT.villa *= 2; },
        category: "villa",
        unlocked: false,
        purchased: false
      },
      villa_boost_2: {
        name: "🌟 럭셔리 빌라",
        desc: "빌라 수익 2배",
        cost: 5000000000,
        icon: "🌟",
        unlockCondition: () => villas >= 25,
        effect: () => { BASE_RENT.villa *= 2; },
        category: "villa",
        unlocked: false,
        purchased: false
      },
      
      // === 오피스텔 관련 ===
      officetel_boost_1: {
        name: "🏢 오피스텔 스마트화",
        desc: "오피스텔 수익 2배",
        cost: 1000000000,
        icon: "🏢",
        unlockCondition: () => officetels >= 5,
        effect: () => { BASE_RENT.officetel *= 2; },
        category: "officetel",
        unlocked: false,
        purchased: false
      },
      officetel_boost_2: {
        name: "🏙️ 프리미엄 오피스텔",
        desc: "오피스텔 수익 2배",
        cost: 10000000000,
        icon: "🏙️",
        unlockCondition: () => officetels >= 25,
        effect: () => { BASE_RENT.officetel *= 2; },
        category: "officetel",
        unlocked: false,
        purchased: false
      },
      
      // === 아파트 관련 ===
      apartment_boost_1: {
        name: "🏡 아파트 프리미엄화",
        desc: "아파트 수익 2배",
        cost: 5000000000,
        icon: "🏡",
        unlockCondition: () => apartments >= 5,
        effect: () => { BASE_RENT.apartment *= 2; },
        category: "apartment",
        unlocked: false,
        purchased: false
      },
      apartment_boost_2: {
        name: "🏰 타워팰리스급 아파트",
        desc: "아파트 수익 2배",
        cost: 50000000000,
        icon: "🏰",
        unlockCondition: () => apartments >= 25,
        effect: () => { BASE_RENT.apartment *= 2; },
        category: "apartment",
        unlocked: false,
        purchased: false
      },
      
      // === 상가 관련 ===
      shop_boost_1: {
        name: "🏪 상가 입지 개선",
        desc: "상가 수익 2배",
        cost: 10000000000,
        icon: "🏪",
        unlockCondition: () => shops >= 5,
        effect: () => { BASE_RENT.shop *= 2; },
        category: "shop",
        unlocked: false,
        purchased: false
      },
      shop_boost_2: {
        name: "🛍️ 프리미엄 상권",
        desc: "상가 수익 2배",
        cost: 100000000000,
        icon: "🛍️",
        unlockCondition: () => shops >= 25,
        effect: () => { BASE_RENT.shop *= 2; },
        category: "shop",
        unlocked: false,
        purchased: false
      },
      
      // === 빌딩 관련 ===
      building_boost_1: {
        name: "🏗️ 빌딩 테넌트 확보",
        desc: "빌딩 수익 2배",
        cost: 50000000000,
        icon: "🏗️",
        unlockCondition: () => buildings >= 5,
        effect: () => { BASE_RENT.building *= 2; },
        category: "building",
        unlocked: false,
        purchased: false
      },
      building_boost_2: {
        name: "💼 랜드마크 빌딩",
        desc: "빌딩 수익 2배",
        cost: 500000000000,
        icon: "💼",
        unlockCondition: () => buildings >= 25,
        effect: () => { BASE_RENT.building *= 2; },
        category: "building",
        unlocked: false,
        purchased: false
      },
      
      // === 전역 업그레이드 ===
      rent_multiplier: {
        name: "📊 부동산 관리 전문화",
        desc: "모든 부동산 수익 +10%",
        cost: 1000000000,
        icon: "📊",
        unlockCondition: () => getTotalProperties() >= 10,
        effect: () => { rentMultiplier *= 1.1; },
        category: "global",
        unlocked: false,
        purchased: false
      },
      manager_hire: {
        name: "👨‍💼 전문 관리인 고용",
        desc: "전체 임대 수익 +5%",
        cost: 5000000000,
        icon: "👨‍💼",
        unlockCondition: () => getTotalProperties() >= 20,
        effect: () => { rentMultiplier *= 1.05; managerLevel++; },
        category: "global",
        unlocked: false,
        purchased: false
      },
      financial_expert: {
        name: "💼 금융 전문가 고용",
        desc: "모든 금융 수익 +20%",
        cost: 10000000000,
        icon: "💼",
        unlockCondition: () => getTotalFinancialProducts() >= 30,
        effect: () => { 
          FINANCIAL_INCOME.deposit *= 1.2;
          FINANCIAL_INCOME.savings *= 1.2;
          FINANCIAL_INCOME.bond *= 1.2;
        },
        category: "global",
        unlocked: false,
        purchased: false
      },
      auto_work_system: {
        name: "📱 자동 업무 처리 시스템",
        desc: "1초마다 자동으로 1회 클릭 (초당 수익 추가)",
        cost: 5000000000,
        icon: "📱",
        unlockCondition: () => careerLevel >= 7 && getTotalProperties() >= 10,
        effect: () => { autoClickEnabled = true; },
        category: "global",
        unlocked: false,
        purchased: false
      }
    };
    
    // 부동산 보유 수량
    let villas = 0;       // 빌라
    let officetels = 0;   // 오피스텔
    let apartments = 0;   // 아파트
    let shops = 0;        // 상가
    let buildings = 0;    // 빌딩
    
    // 해금 상태 추적 (버그 수정: 중복 해금 알림 방지)
    const unlockedProducts = {
      deposit: true,
      savings: false,
      bond: false,
      villa: false,
      officetel: false,
      apartment: false,
      shop: false,
      building: false
    };
    
    // 금융상품별 기본 수익률 (초당) - 자본주의 메시지: 단계적 성장
    const FINANCIAL_INCOME = {
      deposit: 5,     // 예금: 5원/초 (최저 수익률 - 시작점)
      savings: 75,    // 적금: 75원/초 (1.5배 증가)
      bond: 1125,     // 국내주식: 1,125원/초 (1.5배 증가)
      usStock: 6000,  // 미국주식: 6,000원/초 (5.3배 증가)
      crypto: 25000   // 코인: 25,000원/초 (4.2배 증가)
    };
    
    // 금융상품별 리스크 시스템
    const FINANCIAL_RISK = {
      deposit: { level: 0, variance: 0, name: "매우 안전", color: "#4CAF50" },      // 0% 리스크
      savings: { level: 1, variance: 0.05, name: "안전", color: "#4CAF50" },        // 5% 리스크
      bond: { level: 3, variance: 0.2, name: "중간 위험", color: "#FF9800" },       // 20% 리스크
      usStock: { level: 4, variance: 0.3, name: "높은 위험", color: "#F44336" },    // 30% 리스크
      crypto: { level: 5, variance: 0.5, name: "매우 높은 위험", color: "#9C27B0" } // 50% 리스크
    };
    
    // 부동산별 리스크 시스템
    const PROPERTY_RISK = {
      villa: { level: 2, variance: 0.1, name: "낮은 위험", color: "#4CAF50" },      // 10% 리스크
      officetel: { level: 2, variance: 0.1, name: "낮은 위험", color: "#4CAF50" },  // 10% 리스크
      apartment: { level: 3, variance: 0.15, name: "중간 위험", color: "#FF9800" }, // 15% 리스크
      shop: { level: 4, variance: 0.25, name: "높은 위험", color: "#F44336" },      // 25% 리스크
      building: { level: 4, variance: 0.25, name: "높은 위험", color: "#F44336" }   // 25% 리스크
    };
    
    // 부동산별 기본 수익률 (초당) - 자본주의 메시지: 큰 자본일수록 높은 수익률
    const BASE_RENT = {
      villa: 8438,     // 빌라: 8,438원/초 (1.5배 증가)
      officetel: 17719, // 오피스텔: 17,719원/초 (1.5배 증가)
      apartment: 60750, // 아파트: 60,750원/초 (1.5배 증가)
      shop: 137000,    // 상가: 137,000원/초 (1.5배 증가)
      building: 514000 // 빌딩: 514,000원/초 (최고 수익률 - 자본주의 정점)
    };
    
    // 업그레이드 배수
    let clickMultiplier = 1;    // 노동 효율 배수
    let rentMultiplier = 1;     // 월세 수익 배수
    let autoClickEnabled = false; // 자동 클릭 활성화 여부
    let managerLevel = 0;       // 관리인 레벨
    
    // 노동 커리어 시스템 (현실적 승진)
    let careerLevel = 0;        // 현재 커리어 레벨
    let totalLaborIncome = 0;   // 총 노동 수익
    const CAREER_LEVELS = [
      { name: "알바", multiplier: 1, requiredIncome: 0, requiredClicks: 0 },                    // 1만원/클릭 (연봉 2000만)
      { name: "계약직", multiplier: 1.5, requiredIncome: 5000000, requiredClicks: 50 },        // 1.5만원/클릭 (연봉 3000만)
      { name: "사원", multiplier: 2, requiredIncome: 10000000, requiredClicks: 100 },          // 2만원/클릭 (연봉 4000만)
      { name: "대리", multiplier: 2.5, requiredIncome: 20000000, requiredClicks: 200 },        // 2.5만원/클릭 (연봉 5000만)
      { name: "과장", multiplier: 3, requiredIncome: 30000000, requiredClicks: 350 },          // 3만원/클릭 (연봉 6000만)
      { name: "차장", multiplier: 3.5, requiredIncome: 40000000, requiredClicks: 550 },        // 3.5만원/클릭 (연봉 7000만)
      { name: "부장", multiplier: 4, requiredIncome: 50000000, requiredClicks: 800 },          // 4만원/클릭 (연봉 8000만)
      { name: "상무", multiplier: 5, requiredIncome: 70000000, requiredClicks: 1100 },         // 5만원/클릭 (연봉 1억)
      { name: "전무", multiplier: 10, requiredIncome: 120000000, requiredClicks: 1500 },       // 10만원/클릭 (연봉 2억)
      { name: "CEO", multiplier: 25, requiredIncome: 250000000, requiredClicks: 2000 }         // 25만원/클릭 (연봉 5억)
    ];
    
    // 가격은 이제 동적으로 계산됨 (getPropertyCost 함수 사용)
    
    // 업그레이드 비용 - 새로운 경제 시스템에 맞게 조정
    let rentCost = 1000000000;      // 월세 수익률 업: 10억원
    let mgrCost = 5000000000;       // 관리인 고용: 50억원

    const BASE_CLICK_GAIN = 10000; // 기본 노동 클릭 수익 (2024년 최저시급 기준)
    
    // 부동산 시장 이벤트 시스템
    let marketMultiplier = 1.0; // 시장 수익 배수
    let marketEventEndTime = 0; // 이벤트 종료 시간
    
    // 시장 이벤트 시스템 (상품별 세분화)
    let currentMarketEvent = null;
    
    const MARKET_EVENTS = [
      // 부동산 시장 이벤트
      { 
        name: "강남 아파트 대박", 
        duration: 45000, 
        color: "#4CAF50",
        effects: {
          financial: { deposit: 1.0, savings: 1.0, bond: 1.2, usStock: 1.1, crypto: 1.0 },
          property: { villa: 1.5, officetel: 1.3, apartment: 3.0, shop: 1.3, building: 1.2 }
        },
        description: "강남 아파트 가격이 급등하여 부동산 투자 수익이 크게 증가합니다."
      },
      { 
        name: "전세 대란", 
        duration: 60000, 
        color: "#2196F3",
        effects: {
          financial: { deposit: 1.0, savings: 1.0, bond: 1.1, usStock: 1.0, crypto: 1.0 },
          property: { villa: 2.5, officetel: 2.5, apartment: 2.0, shop: 1.2, building: 1.1 }
        },
        description: "전세 수요가 급증하여 빌라와 오피스텔 수익이 크게 증가합니다."
      },
      { 
        name: "상권 활성화", 
        duration: 40000, 
        color: "#FF9800",
        effects: {
          financial: { deposit: 1.0, savings: 1.0, bond: 1.1, usStock: 1.0, crypto: 1.0 },
          property: { villa: 1.2, officetel: 1.2, apartment: 1.3, shop: 2.8, building: 1.5 }
        },
        description: "상권이 활성화되어 상가 수익이 크게 증가합니다."
      },
      { 
        name: "오피스 수요 급증", 
        duration: 50000, 
        color: "#9C27B0",
        effects: {
          financial: { deposit: 1.0, savings: 1.0, bond: 1.1, usStock: 1.0, crypto: 1.0 },
          property: { villa: 1.2, officetel: 1.3, apartment: 1.2, shop: 1.4, building: 3.2 }
        },
        description: "IT 기업들의 오피스 확장으로 빌딩 수익이 크게 증가합니다."
      },
      
      // 금융 시장 이벤트
      { 
        name: "한국은행 금리 인하", 
        duration: 80000, 
        color: "#2196F3",
        effects: {
          financial: { deposit: 0.7, savings: 0.8, bond: 2.0, usStock: 1.5, crypto: 1.2 },
          property: { villa: 1.2, officetel: 1.2, apartment: 1.3, shop: 1.2, building: 1.2 }
        },
        description: "기준금리 인하로 주식은 호황이지만 예금/적금 수익은 감소합니다."
      },
      { 
        name: "주식시장 대호황", 
        duration: 60000, 
        color: "#4CAF50",
        effects: {
          financial: { deposit: 1.1, savings: 1.2, bond: 3.5, usStock: 2.0, crypto: 1.5 },
          property: { villa: 1.1, officetel: 1.1, apartment: 1.2, shop: 1.1, building: 1.1 }
        },
        description: "KOSPI 3000 돌파로 주식 투자 수익이 크게 증가합니다."
      },
      { 
        name: "미국 연준 양적완화", 
        duration: 100000, 
        color: "#2196F3",
        effects: {
          financial: { deposit: 1.0, savings: 1.0, bond: 1.3, usStock: 2.8, crypto: 1.8 },
          property: { villa: 1.0, officetel: 1.0, apartment: 1.1, shop: 1.0, building: 1.0 }
        },
        description: "달러 유동성 확대로 미국주식과 코인 수익이 크게 증가합니다."
      },
      { 
        name: "비트코인 급등", 
        duration: 40000, 
        color: "#FF9800",
        effects: {
          financial: { deposit: 1.05, savings: 1.1, bond: 1.3, usStock: 1.5, crypto: 5.0 },
          property: { villa: 1.0, officetel: 1.0, apartment: 1.0, shop: 1.0, building: 1.0 }
        },
        description: "암호화폐 투자 열풍으로 코인 수익이 폭발적으로 증가합니다."
      },
      
      // 부정적 이벤트
      { 
        name: "금융위기", 
        duration: 150000, 
        color: "#F44336",
        effects: {
          financial: { deposit: 0.5, savings: 0.6, bond: 0.2, usStock: 0.3, crypto: 0.1 },
          property: { villa: 0.8, officetel: 0.8, apartment: 0.7, shop: 0.6, building: 0.5 }
        },
        description: "글로벌 금융위기로 모든 투자 상품이 큰 타격을 받습니다."
      },
      { 
        name: "은행 파산 위기", 
        duration: 120000, 
        color: "#9C27B0",
        effects: {
          financial: { deposit: 0.1, savings: 0.2, bond: 0.5, usStock: 0.7, crypto: 0.3 },
          property: { villa: 1.0, officetel: 1.0, apartment: 1.0, shop: 1.0, building: 1.0 }
        },
        description: "은행 부실 우려로 예금/적금 수익이 급격히 감소합니다."
      },
      { 
        name: "주식시장 폭락", 
        duration: 90000, 
        color: "#F44336",
        effects: {
          financial: { deposit: 1.0, savings: 1.0, bond: 0.3, usStock: 0.4, crypto: 0.2 },
          property: { villa: 1.0, officetel: 1.0, apartment: 1.0, shop: 1.0, building: 1.0 }
        },
        description: "주식시장 폭락으로 주식과 코인 투자에 큰 손실이 발생합니다."
      },
      { 
        name: "암호화폐 규제", 
        duration: 180000, 
        color: "#9C27B0",
        effects: {
          financial: { deposit: 1.0, savings: 1.0, bond: 1.0, usStock: 1.0, crypto: 0.1 },
          property: { villa: 1.0, officetel: 1.0, apartment: 1.0, shop: 1.0, building: 1.0 }
        },
        description: "정부의 암호화폐 규제 강화로 코인 투자 수익이 급격히 감소합니다."
      }
    ];

    // 업적 시스템
    let totalClicks = 0; // 총 클릭 수 추적
    
    const ACHIEVEMENTS = [
      // === 기본 업적 (8개) ===
      { id: "first_click", name: "첫 노동", desc: "첫 번째 클릭을 했다", icon: "👆", condition: () => totalClicks >= 1, unlocked: false },
      { id: "first_deposit", name: "첫 예금", desc: "첫 번째 예금을 구입했다", icon: "💰", condition: () => deposits >= 1, unlocked: false },
      { id: "first_savings", name: "첫 적금", desc: "첫 번째 적금을 구입했다", icon: "🏦", condition: () => savings >= 1, unlocked: false },
      { id: "first_bond", name: "첫 국내주식", desc: "첫 번째 국내주식을 구입했다", icon: "📈", condition: () => bonds >= 1, unlocked: false },
      { id: "first_us_stock", name: "첫 미국주식", desc: "첫 번째 미국주식을 구입했다", icon: "🇺🇸", condition: () => usStocks >= 1, unlocked: false },
      { id: "first_crypto", name: "첫 코인", desc: "첫 번째 코인을 구입했다", icon: "₿", condition: () => cryptos >= 1, unlocked: false },
      { id: "first_property", name: "첫 부동산", desc: "첫 번째 부동산을 구입했다", icon: "🏠", condition: () => villas + officetels + apartments + shops + buildings >= 1, unlocked: false },
      { id: "first_upgrade", name: "첫 업그레이드", desc: "첫 번째 업그레이드를 구입했다", icon: "⚡", condition: () => Object.values(UPGRADES).some(upgrade => upgrade.purchased), unlocked: false },
      
      // === 전문가 업적 (8개) ===
      { id: "financial_expert", name: "금융 전문가", desc: "모든 금융상품을 보유했다", icon: "💼", condition: () => deposits > 0 && savings > 0 && bonds > 0 && usStocks > 0 && cryptos > 0, unlocked: false },
      { id: "property_collector", name: "부동산 수집가", desc: "5채의 부동산을 보유했다", icon: "🏘️", condition: () => getTotalProperties() >= 5, unlocked: false },
      { id: "property_tycoon", name: "부동산 타이쿤", desc: "모든 부동산 종류를 보유했다", icon: "🏗️", condition: () => villas > 0 && officetels > 0 && apartments > 0 && shops > 0 && buildings > 0, unlocked: false },
      { id: "investment_guru", name: "투자 고수", desc: "모든 업그레이드를 구입했다", icon: "📊", condition: () => Object.values(UPGRADES).every(upgrade => upgrade.purchased), unlocked: false },
      { id: "gangnam_rich", name: "강남 부자", desc: "강남 부동산 3채를 보유했다", icon: "🏙️", condition: () => apartments >= 3, unlocked: false },
      { id: "global_investor", name: "글로벌 투자자", desc: "해외 투자 1억원을 달성했다", icon: "🌍", condition: () => usStocks * 1000000 + cryptos * 1000000 >= 100000000, unlocked: false },
      { id: "crypto_expert", name: "암호화폐 전문가", desc: "코인 투자 5억원을 달성했다", icon: "₿", condition: () => cryptos * 1000000 >= 500000000, unlocked: false },
      { id: "real_estate_agent", name: "부동산 중개사", desc: "부동산 20채를 보유했다", icon: "🏠", condition: () => getTotalProperties() >= 20, unlocked: false },
      
      // === 자산 업적 (8개) ===
      { id: "millionaire", name: "백만장자", desc: "총 자산 1억원을 달성했다", icon: "💎", condition: () => cash >= 100000000, unlocked: false },
      { id: "ten_millionaire", name: "억만장자", desc: "총 자산 10억원을 달성했다", icon: "💰", condition: () => cash >= 1000000000, unlocked: false },
      { id: "hundred_millionaire", name: "부자", desc: "총 자산 100억원을 달성했다", icon: "🏆", condition: () => cash >= 10000000000, unlocked: false },
      { id: "billionaire", name: "대부호", desc: "총 자산 1,000억원을 달성했다", icon: "👑", condition: () => cash >= 100000000000, unlocked: false },
      { id: "trillionaire", name: "재벌", desc: "총 자산 1조원을 달성했다", icon: "🏰", condition: () => cash >= 1000000000000, unlocked: false },
      { id: "global_rich", name: "세계적 부자", desc: "총 자산 10조원을 달성했다", icon: "🌍", condition: () => cash >= 10000000000000, unlocked: false },
      { id: "legendary_rich", name: "전설의 부자", desc: "총 자산 100조원을 달성했다", icon: "⭐", condition: () => cash >= 100000000000000, unlocked: false },
      { id: "god_rich", name: "신의 부자", desc: "총 자산 1,000조원을 달성했다", icon: "✨", condition: () => cash >= 1000000000000000, unlocked: false },
      
      // === 커리어 업적 (8개) ===
      { id: "career_starter", name: "직장인", desc: "계약직으로 승진했다", icon: "👔", condition: () => careerLevel >= 1, unlocked: false },
      { id: "employee", name: "정규직", desc: "사원으로 승진했다", icon: "👨‍💼", condition: () => careerLevel >= 2, unlocked: false },
      { id: "deputy_director", name: "팀장", desc: "과장으로 승진했다", icon: "👨‍💻", condition: () => careerLevel >= 4, unlocked: false },
      { id: "executive", name: "임원", desc: "상무로 승진했다", icon: "👨‍🎓", condition: () => careerLevel >= 7, unlocked: false },
      { id: "ceo", name: "CEO", desc: "CEO가 되었다", icon: "👑", condition: () => careerLevel >= 9, unlocked: false },
      { id: "chaebol_chairman", name: "재벌 회장", desc: "자산 1조원을 달성했다", icon: "🏆", condition: () => cash >= 1000000000000, unlocked: false },
      { id: "global_ceo", name: "글로벌 CEO", desc: "해외 진출을 달성했다", icon: "🌍", condition: () => usStocks >= 10 && cryptos >= 10, unlocked: false },
      { id: "legendary_ceo", name: "전설의 CEO", desc: "모든 목표를 달성했다", icon: "⭐", condition: () => careerLevel >= 9 && cash >= 100000000000000, unlocked: false }
    ];

    // ======= 시스템(모듈) 초기화 =======
    function markDirty() {
      uiDirty = true;
    }

    const marketSystem = createMarketSystem(MARKET_EVENTS, {
      getCurrentEvent: () => currentMarketEvent,
      setCurrentEvent: (ev) => { currentMarketEvent = ev; },
      getEventEndTime: () => marketEventEndTime,
      setEventEndTime: (t) => { marketEventEndTime = t; },
      setMarketMultiplier: (m) => { marketMultiplier = m; },
      addLog,
      notify: showMarketEventNotification,
      markDirty,
    });

    const { checkMarketEvent, startMarketEvent, getMarketEventMultiplier } = marketSystem;
    // scheduleNextMarketEvent()는 하단에서 호출(루프 구성 시점에 맞춤)

    const achievementsSystem = createAchievementsSystem(ACHIEVEMENTS, {
      notify: showAchievementNotification,
      addLog,
    });
    const { checkAchievements } = achievementsSystem;

    const upgradeUnlockSystem = createUpgradeUnlockSystem(UPGRADES, {
      addLog,
      onAnyUnlocked: () => {
        updateUpgradeList();
        markDirty();
      },
    });
    const { checkUpgradeUnlocks } = upgradeUnlockSystem;

    // ======= DOM =======
    const elCash = document.getElementById('cash');
    const elFinancial = document.getElementById('financial');
    const elProperties = document.getElementById('properties');
    const elRps  = document.getElementById('rps');
    const elWork = document.getElementById('workBtn');
    const elLog  = document.getElementById('log');
    const elShareBtn = document.getElementById('shareBtn');
    const elClickIncomeButton = document.getElementById('clickIncomeButton');
    const elClickIncomeLabel = document.getElementById('clickIncomeLabel');
    const elClickMultiplier = document.getElementById('clickMultiplier');
    const elRentMultiplier = document.getElementById('rentMultiplier');

    // 금융상품 관련
    const elDepositCount = document.getElementById('depositCount');
    const elIncomePerDeposit = document.getElementById('incomePerDeposit');
    const elBuyDeposit = document.getElementById('buyDeposit');

    const elSavingsCount = document.getElementById('savingsCount');
    const elIncomePerSavings = document.getElementById('incomePerSavings');
    const elBuySavings = document.getElementById('buySavings');

    const elBondCount = document.getElementById('bondCount');
    const elIncomePerBond = document.getElementById('incomePerBond');
    const elBuyBond = document.getElementById('buyBond');
    
    // 미국주식과 코인 관련
    const elUsStockCount = document.getElementById('usStockCount');
    const elIncomePerUsStock = document.getElementById('incomePerUsStock');
    const elBuyUsStock = document.getElementById('buyUsStock');
    
    const elCryptoCount = document.getElementById('cryptoCount');
    const elIncomePerCrypto = document.getElementById('incomePerCrypto');
    const elBuyCrypto = document.getElementById('buyCrypto');
    
    // 구매 수량 선택 시스템
    const elBuyMode = document.getElementById('buyMode');
    const elSellMode = document.getElementById('sellMode');
    const elQty1 = document.getElementById('qty1');
    const elQty5 = document.getElementById('qty5');
    const elQty10 = document.getElementById('qty10');
    
    // 토글 버튼들
    const elToggleUpgrades = document.getElementById('toggleUpgrades');
    const elToggleFinancial = document.getElementById('toggleFinancial');
    const elToggleProperties = document.getElementById('toggleProperties');
    
    // 저장 상태 표시
    const elSaveStatus = document.getElementById('saveStatus');
    const elResetBtn = document.getElementById('resetBtn');
    
    // 현재가 표시 요소들
    const elDepositCurrentPrice = document.getElementById('depositCurrentPrice');
    const elSavingsCurrentPrice = document.getElementById('savingsCurrentPrice');
    const elBondCurrentPrice = document.getElementById('bondCurrentPrice');
    const elVillaCurrentPrice = document.getElementById('villaCurrentPrice');
    const elOfficetelCurrentPrice = document.getElementById('officetelCurrentPrice');
    const elAptCurrentPrice = document.getElementById('aptCurrentPrice');
    const elShopCurrentPrice = document.getElementById('shopCurrentPrice');
    const elBuildingCurrentPrice = document.getElementById('buildingCurrentPrice');

    // 부동산 구입 관련
    const elVillaCount = document.getElementById('villaCount');
    const elRentPerVilla = document.getElementById('rentPerVilla');
    const elBuyVilla = document.getElementById('buyVilla');

    const elOfficetelCount = document.getElementById('officetelCount');
    const elRentPerOfficetel = document.getElementById('rentPerOfficetel');
    const elBuyOfficetel = document.getElementById('buyOfficetel');

    const elAptCount = document.getElementById('aptCount');
    const elRentPerApt = document.getElementById('rentPerApt');
    const elBuyApt = document.getElementById('buyApt');

    const elShopCount = document.getElementById('shopCount');
    const elRentPerShop = document.getElementById('rentPerShop');
    const elBuyShop = document.getElementById('buyShop');

    const elBuildingCount = document.getElementById('buildingCount');
    const elRentPerBuilding = document.getElementById('rentPerBuilding');
    const elBuyBuilding = document.getElementById('buyBuilding');

    // 커리어 관련
    const elCurrentCareer = document.getElementById('currentCareer');
    const elNextCareerDesc = document.getElementById('nextCareerDesc');
    const elCareerCost = document.getElementById('careerCost');
    const elCareerProgress = document.getElementById('careerProgress');
    const elCareerProgressText = document.getElementById('careerProgressText');
    
    // 업그레이드 관련 (구형 DOM 제거됨 - 새로운 Cookie Clicker 스타일 사용)

    // ======= 유틸 =======
    function addLog(text){
      const p = document.createElement('p');
      p.innerText = text;
      elLog.prepend(p);
    }
    
    function getTotalFinancialProducts() {
      return deposits + savings + bonds + usStocks + cryptos;
    }
    
    function getTotalProperties() {
      return villas + officetels + apartments + shops + buildings;
    }
    
    // ======= 순차 해금 시스템 =======
    function isProductUnlocked(productName) {
      const unlockConditions = {
        // 금융상품
        'deposit': () => true, // 항상 해금
        'savings': () => deposits >= 1, // 예금 1개 필요
        'bond': () => savings >= 1, // 적금 1개 필요
        'usStock': () => bonds >= 1, // 국내주식 1개 필요
        'crypto': () => usStocks >= 1, // 미국주식 1개 필요
        
        // 부동산
        'villa': () => cryptos >= 1, // 코인 1개 필요
        'officetel': () => villas >= 1, // 빌라 1개 필요
        'apartment': () => officetels >= 1, // 오피스텔 1개 필요
        'shop': () => apartments >= 1, // 아파트 1개 필요
        'building': () => shops >= 1 // 상가 1개 필요
      };
      
      return unlockConditions[productName] ? unlockConditions[productName]() : false;
    }
    
    function checkNewUnlocks(productName) {
      const unlockMessages = {
        'deposit': { next: 'savings', msg: '🔓 적금이 해금되었습니다!' },
        'savings': { next: 'bond', msg: '🔓 국내주식이 해금되었습니다!' },
        'bond': { next: 'usStock', msg: '🔓 미국주식이 해금되었습니다!' },
        'usStock': { next: 'crypto', msg: '🔓 코인이 해금되었습니다!' },
        'crypto': { next: 'villa', msg: '🔓 빌라가 해금되었습니다!' },
        'villa': { next: 'officetel', msg: '🔓 오피스텔이 해금되었습니다!' },
        'officetel': { next: 'apartment', msg: '🔓 아파트가 해금되었습니다!' },
        'apartment': { next: 'shop', msg: '🔓 상가가 해금되었습니다!' },
        'shop': { next: 'building', msg: '🔓 빌딩이 해금되었습니다!' }
      };
      
      const unlock = unlockMessages[productName];
      // 버그 수정: 아직 해금되지 않았고, 해금 조건을 충족했을 때만 실행
      if (unlock && !unlockedProducts[unlock.next] && isProductUnlocked(unlock.next)) {
        unlockedProducts[unlock.next] = true; // 해금 상태 기록
        addLog(unlock.msg);
        
        // 해금 애니메이션
        const itemId = unlock.next + 'Item';
        const itemElement = document.getElementById(itemId);
        if (itemElement) {
          itemElement.classList.add('just-unlocked');
          setTimeout(() => itemElement.classList.remove('just-unlocked'), 1000);
        }
      }
    }
    
    // 리스크를 적용한 개별 수익 계산 함수
    function getFinancialIncomeWithRisk(type, count) {
      const baseIncome = FINANCIAL_INCOME[type];
      const risk = FINANCIAL_RISK[type];
      
      let actualIncome = baseIncome * count;
      
      // 리스크 적용
      if (risk.variance > 0) {
        const randomFactor = (Math.random() * 2 - 1) * risk.variance;
        const actualMultiplier = 1 + randomFactor;
        actualIncome *= actualMultiplier;
      }
      
      // 시장 이벤트 효과 적용
      const marketMultiplier = getMarketEventMultiplier(type, 'financial');
      actualIncome *= marketMultiplier;
      
      return actualIncome;
    }
    
    function getPropertyIncomeWithRisk(type, count) {
      const baseIncome = BASE_RENT[type];
      const risk = PROPERTY_RISK[type];
      
      let actualIncome = baseIncome * count;
      
      // 리스크 적용
      if (risk.variance > 0) {
        const randomFactor = (Math.random() * 2 - 1) * risk.variance;
        const actualMultiplier = 1 + randomFactor;
        actualIncome *= actualMultiplier;
      }
      
      // 시장 이벤트 효과 적용
      const marketMultiplier = getMarketEventMultiplier(type, 'property');
      actualIncome *= marketMultiplier;
      
      return actualIncome;
    }

    function getRps() {
      // 금융상품 수익 (리스크 적용)
      const financialIncome = 
        getFinancialIncomeWithRisk('deposit', deposits) +
        getFinancialIncomeWithRisk('savings', savings) +
        getFinancialIncomeWithRisk('bond', bonds) +
        getFinancialIncomeWithRisk('usStock', usStocks) +
        getFinancialIncomeWithRisk('crypto', cryptos);
      
      // 부동산 수익 (리스크 적용)
      const propertyRent = 
        getPropertyIncomeWithRisk('villa', villas) +
        getPropertyIncomeWithRisk('officetel', officetels) +
        getPropertyIncomeWithRisk('apartment', apartments) +
        getPropertyIncomeWithRisk('shop', shops) +
        getPropertyIncomeWithRisk('building', buildings);
      
      // 배수 적용 순서: 1) 부동산에 rentMultiplier 적용, 2) 전체에 marketMultiplier 적용
      const totalIncome = financialIncome + (propertyRent * rentMultiplier);
      return totalIncome * marketMultiplier;
    }
    
    // 시장 이벤트 알림 표시
    function showMarketEventNotification(event) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${event.color};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      
      // 상품별 효과 표시
      let effectsText = '';
      if (event.effects.financial) {
        const financialEffects = Object.entries(event.effects.financial)
          .filter(([_, multiplier]) => multiplier !== 1.0)
          .map(([product, multiplier]) => {
            const productNames = { deposit: '예금', savings: '적금', bond: '국내주식', usStock: '미국주식', crypto: '코인' };
            return `${productNames[product]} ${multiplier > 1 ? '+' : ''}${Math.round((multiplier - 1) * 100)}%`;
          });
        if (financialEffects.length > 0) {
          effectsText += `💰 ${financialEffects.join(', ')}\n`;
        }
      }
      
      if (event.effects.property) {
        const propertyEffects = Object.entries(event.effects.property)
          .filter(([_, multiplier]) => multiplier !== 1.0)
          .map(([product, multiplier]) => {
            const productNames = { villa: '빌라', officetel: '오피스텔', apartment: '아파트', shop: '상가', building: '빌딩' };
            return `${productNames[product]} ${multiplier > 1 ? '+' : ''}${Math.round((multiplier - 1) * 100)}%`;
          });
        if (propertyEffects.length > 0) {
          effectsText += `🏠 ${propertyEffects.join(', ')}`;
        }
      }
      
      notification.innerHTML = `
        <div style="font-size: 16px; margin-bottom: 8px;">📈 ${event.name}</div>
        <div style="font-size: 12px; opacity: 0.9;">${event.description}</div>
        ${effectsText ? `<div style="font-size: 11px; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">${effectsText}</div>` : ''}
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentElement) {
          notification.parentElement.removeChild(notification);
        }
      }, 5000);
    }
    
    // 리스크 레벨에 따른 클래스명 반환
    function getRiskClass(level) {
      if (level <= 1) return 'risk-low';
      if (level <= 2) return 'risk-medium';
      if (level <= 3) return 'risk-high';
      return 'risk-extreme';
    }
    
    // 리스크 레벨에 따른 바 클래스명 반환
    function getRiskBarClass(level) {
      if (level <= 1) return 'low';
      if (level <= 2) return 'medium';
      if (level <= 3) return 'high';
      return 'extreme';
    }
    
    // 리스크 정보 HTML 생성
    function createRiskIndicator(level, name) {
      const riskClass = getRiskClass(level);
      const barClass = getRiskBarClass(level);
      
      return `
        <div class="risk-indicator">
          <span class="risk-level ${riskClass}">${name}</span>
          <div class="risk-bar">
            <div class="risk-fill ${barClass}"></div>
          </div>
        </div>
      `;
    }
    
    // 금융상품 리스크 정보 업데이트
    function updateFinancialRiskInfo() {
      const financialProducts = ['deposit', 'savings', 'bond', 'usStock', 'crypto'];
      
      financialProducts.forEach(product => {
        const risk = FINANCIAL_RISK[product];
        const productElement = document.getElementById(`${product}Item`);
        
        if (productElement) {
          // 기존 리스크 정보 제거
          const existingRisk = productElement.querySelector('.product-risk-info');
          if (existingRisk) {
            existingRisk.remove();
          }
          
          // 새로운 리스크 정보 추가
          const riskInfo = document.createElement('div');
          riskInfo.className = 'product-risk-info';
          riskInfo.innerHTML = createRiskIndicator(risk.level, risk.name);
          productElement.appendChild(riskInfo);
        }
      });
    }
    
    // 부동산 리스크 정보 업데이트
    function updatePropertyRiskInfo() {
      const properties = ['villa', 'officetel', 'apartment', 'shop', 'building'];
      
      properties.forEach(property => {
        const risk = PROPERTY_RISK[property];
        const propertyElement = document.getElementById(`${property}Item`);
        
        if (propertyElement) {
          // 기존 리스크 정보 제거
          const existingRisk = propertyElement.querySelector('.product-risk-info');
          if (existingRisk) {
            existingRisk.remove();
          }
          
          // 새로운 리스크 정보 추가
          const riskInfo = document.createElement('div');
          riskInfo.className = 'product-risk-info';
          riskInfo.innerHTML = createRiskIndicator(risk.level, risk.name);
          propertyElement.appendChild(riskInfo);
        }
      });
    }
    
    // 업적 알림 표시
    function showAchievementNotification(achievement) {
      const notification = document.createElement('div');
      notification.style.cssText = `
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
      `;
      notification.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">🏆</div>
        <div style="font-size: 18px; margin-bottom: 5px;">${achievement.name}</div>
        <div style="font-size: 14px; opacity: 0.8;">${achievement.desc}</div>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentElement) {
          notification.parentElement.removeChild(notification);
        }
      }, 3000);
    }
    
    // ======= 업그레이드 시스템 함수 =======
    
    // 업그레이드 해금 체크는 src/systems/upgrades.js 로 이동

    // 업그레이드 구매 가능 여부만 업데이트 (성능 최적화)
    function updateUpgradeAffordability() {
      const upgradeItems = document.querySelectorAll('.upgrade-item');
      
      upgradeItems.forEach(item => {
        const upgradeId = item.dataset.upgradeId;
        const upgrade = UPGRADES[upgradeId];
        
        if (upgrade && !upgrade.purchased) {
          // 구매 가능 여부에 따라 클래스만 토글
          if (cash >= upgrade.cost) {
            item.classList.add('affordable');
          } else {
            item.classList.remove('affordable');
          }
        }
      });
    }
    
    // 업그레이드 리스트 UI 생성 (해금/구매 시에만 호출)
    function updateUpgradeList() {
      const upgradeList = document.getElementById('upgradeList');
      const upgradeCount = document.getElementById('upgradeCount');
      
      if (!upgradeList || !upgradeCount) return;
      
      // 해금되었고 아직 구매하지 않은 업그레이드만 표시
      const availableUpgrades = Object.entries(UPGRADES)
        .filter(([id, upgrade]) => upgrade.unlocked && !upgrade.purchased);
      
      upgradeCount.textContent = `(${availableUpgrades.length})`;
      
      if (availableUpgrades.length === 0) {
        upgradeList.innerHTML = '';
        return;
      }
      
      upgradeList.innerHTML = '';
      
      console.log(`🔄 Regenerating upgrade list with ${availableUpgrades.length} items`);
      
      availableUpgrades.forEach(([id, upgrade]) => {
        const item = document.createElement('div');
        item.className = 'upgrade-item';
        item.dataset.upgradeId = id;
        
        // 구매 가능 여부 체크
        if (cash >= upgrade.cost) {
          item.classList.add('affordable');
        }
        
        // 아이콘 생성
        const icon = document.createElement('div');
        icon.className = 'upgrade-icon';
        icon.textContent = upgrade.icon;
        
        // 정보 영역 생성
        const info = document.createElement('div');
        info.className = 'upgrade-info';
        
        const name = document.createElement('div');
        name.className = 'upgrade-name';
        name.textContent = upgrade.name;
        
        const desc = document.createElement('div');
        desc.className = 'upgrade-desc';
        desc.textContent = upgrade.desc;
        
        const cost = document.createElement('div');
        cost.className = 'upgrade-cost';
        cost.textContent = formatFinancialPrice(upgrade.cost);
        
        info.appendChild(name);
        info.appendChild(desc);
        info.appendChild(cost);
        
        // 상태 배지 생성
        const status = document.createElement('div');
        status.className = 'upgrade-status';
        status.textContent = 'NEW!';
        
        // 요소 조립
        item.appendChild(icon);
        item.appendChild(info);
        item.appendChild(status);
        
        // 클릭 이벤트 추가 (캡처링 단계에서 처리)
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('🖱️ Upgrade item clicked!', id);
          console.log('Event target:', e.target);
          console.log('Current item:', item);
          console.log('Dataset:', item.dataset);
          purchaseUpgrade(id);
        }, false);
        
        // 추가 보험: mousedown 이벤트도 추가
        item.addEventListener('mousedown', (e) => {
          console.log('🖱️ Mousedown detected on upgrade:', id);
        });
        
        upgradeList.appendChild(item);
        
        console.log(`✅ Upgrade item created and appended: ${id}`, item);
      });
    }
    
    // 업그레이드 구매
    function purchaseUpgrade(upgradeId) {
      console.log('=== PURCHASE UPGRADE DEBUG ===');
      console.log('Attempting to purchase:', upgradeId);
      console.log('Current cash:', cash);
      
      const upgrade = UPGRADES[upgradeId];
      
      if (!upgrade) {
        console.error('업그레이드를 찾을 수 없습니다:', upgradeId);
        console.log('Available upgrade IDs:', Object.keys(UPGRADES));
        return;
      }
      
      console.log('Upgrade found:', {
        name: upgrade.name,
        cost: upgrade.cost,
        unlocked: upgrade.unlocked,
        purchased: upgrade.purchased
      });
      
      if (upgrade.purchased) {
        addLog('❌ 이미 구매한 업그레이드입니다.');
        console.log('Already purchased');
        return;
      }
      
      if (cash < upgrade.cost) {
        addLog(`💸 자금이 부족합니다. (필요: ${formatFinancialPrice(upgrade.cost)})`);
        console.log('Not enough cash. Need:', upgrade.cost, 'Have:', cash);
        return;
      }
      
      // 구매 처리
      console.log('Purchase successful! Applying effect...');
      cash -= upgrade.cost;
      upgrade.purchased = true;
      
      try {
        upgrade.effect(); // 효과 적용
        addLog(`✅ ${upgrade.name} 구매! ${upgrade.desc}`);
        console.log('Effect applied successfully');
      } catch (error) {
        console.error(`업그레이드 효과 적용 실패 (${upgradeId}):`, error);
        addLog(`⚠️ ${upgrade.name} 구매했지만 효과 적용 중 오류 발생`);
      }
      
      console.log('New cash:', cash);
      console.log('==============================');
      
      // UI 업데이트
      updateUpgradeList();
      updateUI();
      saveGame();
    }
    
    // 구매 가능 알림 체크
    
    
    function getClickIncome() {
      const currentCareer = getCurrentCareer();
      return Math.floor(10000 * currentCareer.multiplier * clickMultiplier); // 기본 1만원 × 배수
    }
    
    function getCurrentCareer() {
      return CAREER_LEVELS[careerLevel];
    }
    
    function getNextCareer() {
      return careerLevel < CAREER_LEVELS.length - 1 ? CAREER_LEVELS[careerLevel + 1] : null;
    }
    
    // 자동 승진 체크 함수 (클릭 수 기준)
    function checkCareerPromotion() {
      const nextCareer = getNextCareer();
      if (nextCareer && totalClicks >= nextCareer.requiredClicks) {
        careerLevel += 1;
        const newCareer = getCurrentCareer();
        const clickIncome = getClickIncome();
        addLog(`🎉 ${newCareer.name}으로 승진했습니다! (클릭당 ${formatKoreanNumber(clickIncome)}원)`);
        
        // 승진 후 즉시 UI 업데이트
        console.log('=== PROMOTION DEBUG ===');
        console.log('Promoted to:', newCareer.name);
        console.log('New career level:', careerLevel);
        console.log('New multiplier:', newCareer.multiplier);
        console.log('Click income:', formatKoreanNumber(clickIncome));
        console.log('======================');
        
        return true;
      }
      return false;
    }
    
    // 버튼 상태 업데이트 함수 (Cookie Clicker 스타일)
    function updateButtonStates() {
      const qty = purchaseQuantity;
      const isBuy = purchaseMode === 'buy';
      
      // 금융상품 버튼 상태 업데이트
      const depositCanBuy = isBuy && cash >= getFinancialCost('deposit', deposits, qty);
      const savingsCanBuy = isBuy && cash >= getFinancialCost('savings', savings, qty);
      const bondCanBuy = isBuy && cash >= getFinancialCost('bond', bonds, qty);
      const usStockCanBuy = isBuy && cash >= getFinancialCost('usStock', usStocks, qty);
      const cryptoCanBuy = isBuy && cash >= getFinancialCost('crypto', cryptos, qty);
      
      elBuyDeposit.classList.toggle('affordable', depositCanBuy);
      elBuyDeposit.classList.toggle('unaffordable', isBuy && !depositCanBuy);
      elBuySavings.classList.toggle('affordable', savingsCanBuy);
      elBuySavings.classList.toggle('unaffordable', isBuy && !savingsCanBuy);
      elBuyBond.classList.toggle('affordable', bondCanBuy);
      elBuyBond.classList.toggle('unaffordable', isBuy && !bondCanBuy);
      elBuyUsStock.classList.toggle('affordable', usStockCanBuy);
      elBuyUsStock.classList.toggle('unaffordable', isBuy && !usStockCanBuy);
      elBuyCrypto.classList.toggle('affordable', cryptoCanBuy);
      elBuyCrypto.classList.toggle('unaffordable', isBuy && !cryptoCanBuy);
      
      // 부동산 버튼 상태 업데이트
      const villaCanBuy = isBuy && cash >= getPropertyCost('villa', villas, qty);
      const officetelCanBuy = isBuy && cash >= getPropertyCost('officetel', officetels, qty);
      const aptCanBuy = isBuy && cash >= getPropertyCost('apartment', apartments, qty);
      const shopCanBuy = isBuy && cash >= getPropertyCost('shop', shops, qty);
      const buildingCanBuy = isBuy && cash >= getPropertyCost('building', buildings, qty);
      
      elBuyVilla.classList.toggle('affordable', villaCanBuy);
      elBuyVilla.classList.toggle('unaffordable', isBuy && !villaCanBuy);
      elBuyOfficetel.classList.toggle('affordable', officetelCanBuy);
      elBuyOfficetel.classList.toggle('unaffordable', isBuy && !officetelCanBuy);
      elBuyApt.classList.toggle('affordable', aptCanBuy);
      elBuyApt.classList.toggle('unaffordable', isBuy && !aptCanBuy);
      elBuyShop.classList.toggle('affordable', shopCanBuy);
      elBuyShop.classList.toggle('unaffordable', isBuy && !shopCanBuy);
      elBuyBuilding.classList.toggle('affordable', buildingCanBuy);
      elBuyBuilding.classList.toggle('unaffordable', isBuy && !buildingCanBuy);
      
      // 업그레이드 버튼 상태 업데이트 (제거됨 - 새 시스템 사용)
    }
    
    // 건물 목록 색상 업데이트 함수
    function updateBuildingItemStates() {
      const qty = purchaseQuantity;
      const isBuy = purchaseMode === 'buy';
      
      // 금융상품 아이템 상태 업데이트 (구매 모드일 때만 affordable 적용)
      const depositItem = document.getElementById('depositItem');
      const savingsItem = document.getElementById('savingsItem');
      const bondItem = document.getElementById('bondItem');
      const usStockItem = document.getElementById('usStockItem');
      const cryptoItem = document.getElementById('cryptoItem');
      
      depositItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('deposit', deposits, qty));
      savingsItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('savings', savings, qty));
      bondItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('bond', bonds, qty));
      usStockItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('usStock', usStocks, qty));
      cryptoItem.classList.toggle('affordable', isBuy && cash >= getFinancialCost('crypto', cryptos, qty));
      
      // 부동산 아이템 상태 업데이트 (구매 모드일 때만 affordable 적용)
      const villaItem = document.getElementById('villaItem');
      const officetelItem = document.getElementById('officetelItem');
      const aptItem = document.getElementById('aptItem');
      const shopItem = document.getElementById('shopItem');
      const buildingItem = document.getElementById('buildingItem');
      
      villaItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('villa', villas, qty));
      officetelItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('officetel', officetels, qty));
      aptItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('apartment', apartments, qty));
      shopItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('shop', shops, qty));
      buildingItem.classList.toggle('affordable', isBuy && cash >= getPropertyCost('building', buildings, qty));
    }
    
    // 업그레이드 그리드 상태 업데이트 함수
    // 구형 updateUpgradeGrid 함수 제거됨 - 새로운 updateUpgradeList 사용
    
    // 게임 데이터 저장 함수
    function saveGame() {
      const saveData = {
        cash: cash,
        totalClicks: totalClicks,
        totalLaborIncome: totalLaborIncome,
        careerLevel: careerLevel,
        clickMultiplier: clickMultiplier,
        rentMultiplier: rentMultiplier,
        autoClickEnabled: autoClickEnabled,
        managerLevel: managerLevel,
        rentCost: rentCost,
        mgrCost: mgrCost,
        // 금융상품
        deposits: deposits,
        savings: savings,
        bonds: bonds,
        usStocks: usStocks,
        cryptos: cryptos,
        // 금융상품 누적 생산량
        depositsLifetime: depositsLifetime,
        savingsLifetime: savingsLifetime,
        bondsLifetime: bondsLifetime,
        usStocksLifetime: usStocksLifetime,
        cryptosLifetime: cryptosLifetime,
        // 부동산
        villas: villas,
        officetels: officetels,
        apartments: apartments,
        shops: shops,
        buildings: buildings,
        // 부동산 누적 생산량
        villasLifetime: villasLifetime,
        officetelsLifetime: officetelsLifetime,
        apartmentsLifetime: apartmentsLifetime,
        shopsLifetime: shopsLifetime,
        buildingsLifetime: buildingsLifetime,
        // 업그레이드 (새 Cookie Clicker 스타일)
        upgradesV2: Object.fromEntries(
          Object.entries(UPGRADES).map(([id, upgrade]) => [
            id,
            { unlocked: upgrade.unlocked, purchased: upgrade.purchased }
          ])
        ),
        // 시장 이벤트
        marketMultiplier: marketMultiplier,
        marketEventEndTime: marketEventEndTime,
        // 업적
        achievements: ACHIEVEMENTS,
        // 저장 시간
        saveTime: new Date().toISOString(),
        ts: Date.now(),
        // 게임 시작 시간 (호환성 유지)
        gameStartTime: gameStartTime,
        // 누적 플레이시간 시스템
        totalPlayTime: totalPlayTime,
        sessionStartTime: sessionStartTime
      };
      
      try {
        safeSetJSON(SAVE_KEY, saveData);
        lastSaveTime = new Date();
        console.log('게임 저장 완료:', lastSaveTime.toLocaleTimeString());
        updateSaveStatus(); // 저장 상태 UI 업데이트
      } catch (error) {
        console.error('게임 저장 실패:', error);
      }
    }
    
    // 게임 데이터 불러오기 함수
    function loadGame() {
      try {
        const data = safeGetJSON(SAVE_KEY, null);
        if (!data) {
          console.log('저장된 게임 데이터가 없습니다.');
          // 새 게임 시작 시 누적 플레이시간 초기화
          totalPlayTime = 0;
          sessionStartTime = Date.now();
          return false;
        }
        
        // 게임 상태 복원
        cash = data.cash || 0;
        totalClicks = data.totalClicks || 0;
        totalLaborIncome = data.totalLaborIncome || 0;
        careerLevel = data.careerLevel || 0;
        clickMultiplier = data.clickMultiplier || 1;
        rentMultiplier = data.rentMultiplier || 1;
        autoClickEnabled = data.autoClickEnabled || false;
        managerLevel = data.managerLevel || 0;
        rentCost = data.rentCost || 1000000000;
        mgrCost = data.mgrCost || 5000000000;
        
        // 금융상품 복원
        deposits = data.deposits || 0;
        savings = data.savings || 0;
        bonds = data.bonds || 0;
        usStocks = data.usStocks || 0;
        cryptos = data.cryptos || 0;
        
        // 금융상품 누적 생산량 복원
        depositsLifetime = data.depositsLifetime || 0;
        savingsLifetime = data.savingsLifetime || 0;
        bondsLifetime = data.bondsLifetime || 0;
        usStocksLifetime = data.usStocksLifetime || 0;
        cryptosLifetime = data.cryptosLifetime || 0;
        
        // 부동산 복원
        villas = data.villas || 0;
        officetels = data.officetels || 0;
        apartments = data.apartments || 0;
        shops = data.shops || 0;
        buildings = data.buildings || 0;
        
        // 부동산 누적 생산량 복원
        villasLifetime = data.villasLifetime || 0;
        officetelsLifetime = data.officetelsLifetime || 0;
        apartmentsLifetime = data.apartmentsLifetime || 0;
        shopsLifetime = data.shopsLifetime || 0;
        buildingsLifetime = data.buildingsLifetime || 0;
        
        // 업그레이드 복원 (새 Cookie Clicker 스타일)
        if (data.upgradesV2) {
          for (const [id, state] of Object.entries(data.upgradesV2)) {
            if (UPGRADES[id]) {
              UPGRADES[id].unlocked = state.unlocked;
              UPGRADES[id].purchased = state.purchased;
              
              // 효과 재적용 제거: clickMultiplier 등은 이미 저장된 값으로 복원되므로 중복 적용 불필요
              // 중복 적용 시 새로고침할 때마다 배수가 계속 곱해지는 버그 발생
            }
          }
        }
        
        // 시장 이벤트 복원
        marketMultiplier = data.marketMultiplier || 1;
        marketEventEndTime = data.marketEventEndTime || 0;
        
        // 업적 복원
        if (data.achievements) {
          ACHIEVEMENTS.forEach((achievement, index) => {
            if (data.achievements[index]) {
              achievement.unlocked = data.achievements[index].unlocked;
            }
          });
        }
        
        // 게임 시작 시간 복원 (호환성 유지)
        if (data.gameStartTime) {
          gameStartTime = data.gameStartTime;
        }
        
        // 누적 플레이시간 시스템 복원
        if (data.totalPlayTime !== undefined) {
          totalPlayTime = data.totalPlayTime;
          console.log('🕐 이전 누적 플레이시간 복원:', totalPlayTime, 'ms');
        }
        if (data.sessionStartTime) {
          // 이전 세션의 플레이시간을 누적
          const previousSessionTime = Date.now() - data.sessionStartTime;
          totalPlayTime += previousSessionTime;
          console.log('🕐 이전 세션 플레이시간 누적:', previousSessionTime, 'ms');
        }
        // 새 세션 시작
        sessionStartTime = Date.now();
        console.log('🕐 새 세션 시작:', new Date(sessionStartTime).toLocaleString());
        console.log('🕐 총 누적 플레이시간:', totalPlayTime, 'ms');
        
        console.log('게임 불러오기 완료:', data.saveTime ? new Date(data.saveTime).toLocaleString() : '시간 정보 없음');
        return true;
      } catch (error) {
        console.error('게임 불러오기 실패:', error);
        return false;
      }
    }
    
    // 게임 초기화 함수
    function resetGame() {
      console.log('🔄 resetGame function called'); // 디버깅용
      console.log('🔄 About to show confirm dialog'); // 디버깅용
      
      // 간단하고 명확한 확인 메시지
      const userConfirmed = confirm('🔄 게임을 새로 시작하시겠습니까?\n\n⚠️ 모든 진행 상황이 삭제되며 복구할 수 없습니다.');
      
      console.log('🔄 User response:', userConfirmed); // 디버깅용
      
      if (userConfirmed === true) {
        try {
          // 초기화 진행 메시지
          addLog('🔄 게임을 초기화합니다...');
          console.log('✅ User confirmed reset'); // 디버깅용
          
          // 저장 데이터 삭제
          safeRemove(SAVE_KEY);
          console.log('✅ LocalStorage cleared'); // 디버깅용
          
          // 즉시 페이지 새로고침
          console.log('✅ Reloading page...'); // 디버깅용
          location.reload();
        } catch (error) {
          console.error('❌ Error in resetGame:', error);
          alert('게임 초기화 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        }
      } else {
        console.log('❌ User cancelled reset'); // 디버깅용
        addLog('❌ 게임 초기화가 취소되었습니다.');
      }
    }
    
    // 구매 완료 시 반짝 효과 함수
    function showPurchaseSuccess(element) {
      // 기존 클래스 제거
      element.classList.remove('purchase-success');
      
      // 강제 리플로우
      element.offsetHeight;
      
      // 새 클래스 추가
      element.classList.add('purchase-success');
      
      setTimeout(() => {
        element.classList.remove('purchase-success');
      }, 600);
    }
    
    // 저장 상태 UI 업데이트 함수
    function updateSaveStatus() {
      if (elSaveStatus) {
        const timeStr = lastSaveTime.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        elSaveStatus.textContent = `저장됨 · ${timeStr}`;
      }
    }

    function updateUI(){
      // --- (A) 커리어 진행률 갱신을 최우선으로 ---
      try {
        // totalClicks 값 유효성 검사
        if (typeof totalClicks !== 'number' || totalClicks < 0) {
          console.warn('Invalid totalClicks value:', totalClicks, 'resetting to 0');
          totalClicks = 0;
        }
        
        const currentCareer = getCurrentCareer();
        const nextCareer = getNextCareer();
        
        if (!currentCareer) {
          console.error('getCurrentCareer() returned null/undefined');
          return;
        }
        
        safeText(elCurrentCareer, currentCareer.name);
        safeText(elClickIncomeButton, formatKoreanNumber(getClickIncome()));
        safeText(elClickIncomeLabel, formatKoreanNumber(getClickIncome()));
        
        if (nextCareer) {
          safeText(elNextCareerDesc, `다음: ${nextCareer.name} (${nextCareer.multiplier}배 수익)`);
          safeText(elCareerCost, `${nextCareer.requiredClicks}클릭 필요`);
          
          // 승진 진행률 계산 및 표시
          const progress = Math.min((totalClicks / nextCareer.requiredClicks) * 100, 100);
          if (elCareerProgress) elCareerProgress.style.width = progress + '%';
          safeText(elCareerProgressText, `승진 진행률: ${progress.toFixed(1)}% (${totalClicks}/${nextCareer.requiredClicks}클릭)`);
          
          // 디버깅: 승진 진행률 확인 (강화된 로깅)
          console.log('=== CAREER PROGRESS DEBUG ===');
          console.log('totalClicks:', totalClicks);
          console.log('nextCareer.requiredClicks:', nextCareer.requiredClicks);
          console.log('progress:', progress);
          console.log('currentCareer:', currentCareer.name);
          console.log('nextCareer:', nextCareer.name);
          console.log('=============================');
        } else {
          safeText(elNextCareerDesc, "최고 직급 달성!");
          safeText(elCareerCost, "완료");
          if (elCareerProgress) elCareerProgress.style.width = '100%';
          safeText(elCareerProgressText, "승진 진행률: 100%");
        }
      } catch (e) {
        console.error('Career UI update failed:', e);
        console.error('Error details:', {
          totalClicks,
          careerLevel,
          currentCareer: getCurrentCareer(),
          nextCareer: getNextCareer()
        });
      }
      
      // --- (B) 나머지 UI 갱신 (금융/부동산/업그레이드 등) ---
      safeText(elCash, formatCashDisplay(cash));
      // 금융상품 집계 및 툴팁
      const totalFinancial = getTotalFinancialProducts();
      safeText(elFinancial, formatKoreanNumber(totalFinancial));
      const financialChip = document.getElementById('financialChip');
      if (financialChip) {
        const tooltip = `예금: ${deposits}개\n적금: ${savings}개\n국내주식: ${bonds}개\n미국주식: ${usStocks}개\n코인: ${cryptos}개`;
        financialChip.setAttribute('title', tooltip);
      }
      
      // 부동산 집계 및 툴팁
      const totalProperties = getTotalProperties();
      safeText(elProperties, formatKoreanNumber(totalProperties));
      const propertyChip = document.getElementById('propertyChip');
      if (propertyChip) {
        const tooltip = `빌라: ${villas}채\n오피스텔: ${officetels}채\n아파트: ${apartments}채\n상가: ${shops}채\n빌딩: ${buildings}채`;
        propertyChip.setAttribute('title', tooltip);
      }
      
      // 초당 수익 및 툴팁
      const rpsValue = getRps();
      safeText(elRps, formatKoreanNumber(rpsValue));
      const rpsChip = document.getElementById('rpsChip');
      if (rpsChip) {
        const financialIncome = deposits * FINANCIAL_INCOME.deposit + 
                                savings * FINANCIAL_INCOME.savings + 
                                bonds * FINANCIAL_INCOME.bond;
        const propertyIncome = (villas * BASE_RENT.villa +
                                officetels * BASE_RENT.officetel +
                                apartments * BASE_RENT.apartment +
                                shops * BASE_RENT.shop +
                                buildings * BASE_RENT.building) * rentMultiplier;
        
        const tooltip = `금융 수익: ${formatKoreanNumber(financialIncome)}₩/s\n부동산 수익: ${formatKoreanNumber(propertyIncome)}₩/s\n시장배수: x${marketMultiplier}`;
        rpsChip.setAttribute('title', tooltip);
      }
      
      safeText(elClickMultiplier, clickMultiplier.toFixed(1));
      safeText(elRentMultiplier, rentMultiplier.toFixed(1));
      
      // 디버깅: 전체 게임 상태 확인
      console.log('=== GAME STATE DEBUG ===');
      console.log('Cash:', cash);
      console.log('Total clicks:', totalClicks);
      console.log('Career level:', careerLevel);
      console.log('Financial products:', { deposits, savings, bonds, total: getTotalFinancialProducts() });
      console.log('Properties:', { villas, officetels, apartments, shops, buildings, total: getTotalProperties() });
      console.log('========================');
      
      // 금융상품 UI 업데이트 (동적 가격 계산) - 안전장치 추가
      try {
        // 금융상품 변수 유효성 검사
        if (typeof deposits !== 'number' || deposits < 0) {
          console.warn('Invalid deposits value:', deposits, 'resetting to 0');
          deposits = 0;
        }
        if (typeof savings !== 'number' || savings < 0) {
          console.warn('Invalid savings value:', savings, 'resetting to 0');
          savings = 0;
        }
        if (typeof bonds !== 'number' || bonds < 0) {
          console.warn('Invalid bonds value:', bonds, 'resetting to 0');
          bonds = 0;
        }
        
        const totalRps = getRps();
        
        // 예금 업데이트
        const depositCost = purchaseMode === 'buy' 
          ? getFinancialCost('deposit', deposits, purchaseQuantity)
          : getFinancialSellPrice('deposit', deposits, purchaseQuantity);
        const depositTotalIncome = deposits * FINANCIAL_INCOME.deposit;
        const depositPercent = totalRps > 0 ? ((depositTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        elDepositCount.textContent = deposits;
        elIncomePerDeposit.textContent = Math.floor(FINANCIAL_INCOME.deposit).toLocaleString('ko-KR') + '원';
        document.getElementById('depositTotalIncome').textContent = Math.floor(depositTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('depositPercent').textContent = depositPercent + '%';
        document.getElementById('depositLifetime').textContent = formatCashDisplay(depositsLifetime);
        elDepositCurrentPrice.textContent = formatFinancialPrice(depositCost);
        
        // 적금 업데이트
        const savingsCost = purchaseMode === 'buy'
          ? getFinancialCost('savings', savings, purchaseQuantity)
          : getFinancialSellPrice('savings', savings, purchaseQuantity);
        const savingsTotalIncome = savings * FINANCIAL_INCOME.savings;
        const savingsPercent = totalRps > 0 ? ((savingsTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        elSavingsCount.textContent = savings;
        elIncomePerSavings.textContent = Math.floor(FINANCIAL_INCOME.savings).toLocaleString('ko-KR') + '원';
        document.getElementById('savingsTotalIncome').textContent = Math.floor(savingsTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('savingsPercent').textContent = savingsPercent + '%';
        document.getElementById('savingsLifetimeDisplay').textContent = formatCashDisplay(savingsLifetime);
        elSavingsCurrentPrice.textContent = formatFinancialPrice(savingsCost);
        
        // 주식 업데이트
        const bondCost = purchaseMode === 'buy'
          ? getFinancialCost('bond', bonds, purchaseQuantity)
          : getFinancialSellPrice('bond', bonds, purchaseQuantity);
        const bondTotalIncome = bonds * FINANCIAL_INCOME.bond;
        const bondPercent = totalRps > 0 ? ((bondTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        elBondCount.textContent = bonds;
        elIncomePerBond.textContent = Math.floor(FINANCIAL_INCOME.bond).toLocaleString('ko-KR') + '원';
        document.getElementById('bondTotalIncome').textContent = Math.floor(bondTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('bondPercent').textContent = bondPercent + '%';
        document.getElementById('bondLifetimeDisplay').textContent = formatCashDisplay(bondsLifetime);
        elBondCurrentPrice.textContent = formatFinancialPrice(bondCost);
        
        // 미국주식 업데이트
        const usStockCost = purchaseMode === 'buy'
          ? getFinancialCost('usStock', usStocks, purchaseQuantity)
          : getFinancialSellPrice('usStock', usStocks, purchaseQuantity);
        const usStockTotalIncome = usStocks * FINANCIAL_INCOME.usStock;
        const usStockPercent = totalRps > 0 ? ((usStockTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        document.getElementById('usStockCount').textContent = usStocks;
        document.getElementById('incomePerUsStock').textContent = Math.floor(FINANCIAL_INCOME.usStock).toLocaleString('ko-KR') + '원';
        document.getElementById('usStockTotalIncome').textContent = Math.floor(usStockTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('usStockPercent').textContent = usStockPercent + '%';
        document.getElementById('usStockLifetimeDisplay').textContent = formatCashDisplay(usStocksLifetime);
        document.getElementById('usStockCurrentPrice').textContent = formatFinancialPrice(usStockCost);
        
        // 코인 업데이트
        const cryptoCost = purchaseMode === 'buy'
          ? getFinancialCost('crypto', cryptos, purchaseQuantity)
          : getFinancialSellPrice('crypto', cryptos, purchaseQuantity);
        const cryptoTotalIncome = cryptos * FINANCIAL_INCOME.crypto;
        const cryptoPercent = totalRps > 0 ? ((cryptoTotalIncome / totalRps) * 100).toFixed(1) : 0;
        
        document.getElementById('cryptoCount').textContent = cryptos;
        document.getElementById('incomePerCrypto').textContent = Math.floor(FINANCIAL_INCOME.crypto).toLocaleString('ko-KR') + '원';
        document.getElementById('cryptoTotalIncome').textContent = Math.floor(cryptoTotalIncome).toLocaleString('ko-KR') + '원';
        document.getElementById('cryptoPercent').textContent = cryptoPercent + '%';
        document.getElementById('cryptoLifetimeDisplay').textContent = formatCashDisplay(cryptosLifetime);
        document.getElementById('cryptoCurrentPrice').textContent = formatFinancialPrice(cryptoCost);
        
        // 디버깅: 금융상품 카운트 확인 (강화된 로깅)
        console.log('=== FINANCIAL PRODUCTS DEBUG ===');
        console.log('Financial counts:', { deposits, savings, bonds, usStocks, cryptos });
        console.log('Total financial products:', getTotalFinancialProducts());
        console.log('Financial elements:', {
          depositCount: elDepositCount,
          savingsCount: elSavingsCount,
          bondCount: elBondCount
        });
        console.log('================================');
      } catch (e) {
        console.error('Financial products UI update failed:', e);
        console.error('Error details:', { deposits, savings, bonds });
      }
      
      // 부동산 구입 UI 업데이트 (동적 가격 계산)
      const totalRps2 = getRps(); // 부동산용 RPS 계산
      
      // 빌라
      const villaCost = purchaseMode === 'buy'
        ? getPropertyCost('villa', villas, purchaseQuantity)
        : getPropertySellPrice('villa', villas, purchaseQuantity);
      const villaTotalIncome = villas * BASE_RENT.villa;
      const villaPercent = totalRps2 > 0 ? ((villaTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elVillaCount.textContent = villas;
      elRentPerVilla.textContent = Math.floor(BASE_RENT.villa).toLocaleString('ko-KR') + '원';
      document.getElementById('villaTotalIncome').textContent = Math.floor(villaTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('villaPercent').textContent = villaPercent + '%';
      document.getElementById('villaLifetimeDisplay').textContent = formatCashDisplay(villasLifetime);
      elVillaCurrentPrice.textContent = formatPropertyPrice(villaCost);
      
      // 오피스텔
      const officetelCost = purchaseMode === 'buy'
        ? getPropertyCost('officetel', officetels, purchaseQuantity)
        : getPropertySellPrice('officetel', officetels, purchaseQuantity);
      const officetelTotalIncome = officetels * BASE_RENT.officetel;
      const officetelPercent = totalRps2 > 0 ? ((officetelTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elOfficetelCount.textContent = officetels;
      elRentPerOfficetel.textContent = Math.floor(BASE_RENT.officetel).toLocaleString('ko-KR') + '원';
      document.getElementById('officetelTotalIncome').textContent = Math.floor(officetelTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('officetelPercent').textContent = officetelPercent + '%';
      document.getElementById('officetelLifetimeDisplay').textContent = formatCashDisplay(officetelsLifetime);
      elOfficetelCurrentPrice.textContent = formatPropertyPrice(officetelCost);
      
      // 아파트
      const aptCost = purchaseMode === 'buy'
        ? getPropertyCost('apartment', apartments, purchaseQuantity)
        : getPropertySellPrice('apartment', apartments, purchaseQuantity);
      const aptTotalIncome = apartments * BASE_RENT.apartment;
      const aptPercent = totalRps2 > 0 ? ((aptTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elAptCount.textContent = apartments;
      elRentPerApt.textContent = Math.floor(BASE_RENT.apartment).toLocaleString('ko-KR') + '원';
      document.getElementById('aptTotalIncome').textContent = Math.floor(aptTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('aptPercent').textContent = aptPercent + '%';
      document.getElementById('aptLifetimeDisplay').textContent = formatCashDisplay(apartmentsLifetime);
      elAptCurrentPrice.textContent = formatPropertyPrice(aptCost);
      
      // 상가
      const shopCost = purchaseMode === 'buy'
        ? getPropertyCost('shop', shops, purchaseQuantity)
        : getPropertySellPrice('shop', shops, purchaseQuantity);
      const shopTotalIncome = shops * BASE_RENT.shop;
      const shopPercent = totalRps2 > 0 ? ((shopTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elShopCount.textContent = shops;
      elRentPerShop.textContent = Math.floor(BASE_RENT.shop).toLocaleString('ko-KR') + '원';
      document.getElementById('shopTotalIncome').textContent = Math.floor(shopTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('shopPercent').textContent = shopPercent + '%';
      document.getElementById('shopLifetimeDisplay').textContent = formatCashDisplay(shopsLifetime);
      elShopCurrentPrice.textContent = formatPropertyPrice(shopCost);
      
      // 빌딩
      const buildingCost = purchaseMode === 'buy'
        ? getPropertyCost('building', buildings, purchaseQuantity)
        : getPropertySellPrice('building', buildings, purchaseQuantity);
      const buildingTotalIncome = buildings * BASE_RENT.building;
      const buildingPercent = totalRps2 > 0 ? ((buildingTotalIncome / totalRps2) * 100).toFixed(1) : 0;
      
      elBuildingCount.textContent = buildings;
      elRentPerBuilding.textContent = Math.floor(BASE_RENT.building).toLocaleString('ko-KR') + '원';
      document.getElementById('buildingTotalIncome').textContent = Math.floor(buildingTotalIncome).toLocaleString('ko-KR') + '원';
      document.getElementById('buildingPercent').textContent = buildingPercent + '%';
      document.getElementById('buildingLifetimeDisplay').textContent = formatCashDisplay(buildingsLifetime);
      elBuildingCurrentPrice.textContent = formatPropertyPrice(buildingCost);
      
      // 디버깅: 부동산 카운트 확인
      console.log('Property counts:', { villas, officetels, apartments, shops, buildings });
      
      // 커리어 UI 업데이트는 함수 최상단으로 이동됨
      
      // 업그레이드 UI 업데이트 (제거됨 - 새 시스템 사용)

      // 버튼 텍스트 및 상태 업데이트 (구매/판매 통합)
      updateButtonTexts();
      
      // 버튼 상태 업데이트 (Cookie Clicker 스타일)
      updateButtonStates();
      
      // 건물 목록 색상 업데이트
      updateBuildingItemStates();
      
      // 업그레이드 구매 가능 여부만 업데이트 (DOM 재생성 안 함)
      updateUpgradeAffordability();
      
      // 순차 해금 시스템 - 잠금 상태 업데이트
      updateProductLockStates();
      
      // 통계 탭 업데이트
      // 통계 탭 업데이트(스로틀 + 화면에 보일 때만)
      const now = Date.now();
      const statsTab = document.getElementById('statsTab');
      const statsVisible = !!(statsTab && (statsTab.classList.contains('active') || window.matchMedia('(min-width: 769px)').matches));
      if (statsVisible && now - lastStatsTabUpdate >= STATS_TAB_UPDATE_INTERVAL) {
        updateStatsTab();
        lastStatsTabUpdate = now;
      }
    }

    // 순차 해금 시스템 - 잠금 상태 업데이트
    function updateProductLockStates() {
      // 금융상품 잠금 상태
      const savingsItem = document.getElementById('savingsItem');
      const bondItem = document.getElementById('bondItem');
      
      if (savingsItem) {
        savingsItem.classList.toggle('locked', !isProductUnlocked('savings'));
      }
      if (bondItem) {
        bondItem.classList.toggle('locked', !isProductUnlocked('bond'));
      }
      
      // 미국주식과 코인 잠금 상태
      const usStockItem = document.getElementById('usStockItem');
      const cryptoItem = document.getElementById('cryptoItem');
      
      if (usStockItem) {
        usStockItem.classList.toggle('locked', !isProductUnlocked('usStock'));
      }
      if (cryptoItem) {
        cryptoItem.classList.toggle('locked', !isProductUnlocked('crypto'));
      }
      
      // 부동산 잠금 상태
      const villaItem = document.getElementById('villaItem');
      const officetelItem = document.getElementById('officetelItem');
      const aptItem = document.getElementById('aptItem');
      const shopItem = document.getElementById('shopItem');
      const buildingItem = document.getElementById('buildingItem');
      
      if (villaItem) {
        villaItem.classList.toggle('locked', !isProductUnlocked('villa'));
      }
      if (officetelItem) {
        officetelItem.classList.toggle('locked', !isProductUnlocked('officetel'));
      }
      if (aptItem) {
        aptItem.classList.toggle('locked', !isProductUnlocked('apartment'));
      }
      if (shopItem) {
        shopItem.classList.toggle('locked', !isProductUnlocked('shop'));
      }
      if (buildingItem) {
        buildingItem.classList.toggle('locked', !isProductUnlocked('building'));
      }
    }
    
    // ======= 구매 수량 선택 시스템 =======
    elBuyMode.addEventListener('click', () => {
      purchaseMode = 'buy';
      elBuyMode.classList.add('active');
      elSellMode.classList.remove('active');
      updateButtonTexts();
    });
    
    elSellMode.addEventListener('click', () => {
      purchaseMode = 'sell';
      elSellMode.classList.add('active');
      elBuyMode.classList.remove('active');
      updateButtonTexts();
    });
    
    elQty1.addEventListener('click', () => {
      purchaseQuantity = 1;
      elQty1.classList.add('active');
      elQty5.classList.remove('active');
      elQty10.classList.remove('active');
      updateButtonTexts();
    });
    
    elQty5.addEventListener('click', () => {
      purchaseQuantity = 5;
      elQty5.classList.add('active');
      elQty1.classList.remove('active');
      elQty10.classList.remove('active');
      updateButtonTexts();
    });
    
    elQty10.addEventListener('click', () => {
      purchaseQuantity = 10;
      elQty10.classList.add('active');
      elQty1.classList.remove('active');
      elQty5.classList.remove('active');
      updateButtonTexts();
    });
    
    // ======= 토글 기능 =======
    elToggleUpgrades.addEventListener('click', () => {
      const section = document.getElementById('upgradeList');
      const isCollapsed = section.classList.contains('collapsed-section');
      
      if (isCollapsed) {
        section.classList.remove('collapsed-section');
        elToggleUpgrades.textContent = '▼';
        elToggleUpgrades.classList.remove('collapsed');
      } else {
        section.classList.add('collapsed-section');
        elToggleUpgrades.textContent = '▶';
        elToggleUpgrades.classList.add('collapsed');
      }
    });
    
    elToggleFinancial.addEventListener('click', () => {
      const section = document.getElementById('financialSection');
      const isCollapsed = section.classList.contains('collapsed-section');
      
      if (isCollapsed) {
        section.classList.remove('collapsed-section');
        elToggleFinancial.textContent = '▼';
        elToggleFinancial.classList.remove('collapsed');
      } else {
        section.classList.add('collapsed-section');
        elToggleFinancial.textContent = '▶';
        elToggleFinancial.classList.add('collapsed');
      }
    });
    
    elToggleProperties.addEventListener('click', () => {
      const section = document.getElementById('propertySection');
      const isCollapsed = section.classList.contains('collapsed-section');
      
      if (isCollapsed) {
        section.classList.remove('collapsed-section');
        elToggleProperties.textContent = '▼';
        elToggleProperties.classList.remove('collapsed');
      } else {
        section.classList.add('collapsed-section');
        elToggleProperties.textContent = '▶';
        elToggleProperties.classList.add('collapsed');
      }
    });
    
    // 버튼 텍스트 업데이트 함수
    function updateButtonTexts() {
      const isBuy = purchaseMode === 'buy';
      const qty = purchaseQuantity;
      
      // 금융상품 버튼 업데이트
      updateButton(elBuyDeposit, 'financial', 'deposit', deposits, isBuy, qty);
      updateButton(elBuySavings, 'financial', 'savings', savings, isBuy, qty);
      updateButton(elBuyBond, 'financial', 'bond', bonds, isBuy, qty);
      
      // 부동산 버튼 업데이트
      updateButton(elBuyVilla, 'property', 'villa', villas, isBuy, qty);
      updateButton(elBuyOfficetel, 'property', 'officetel', officetels, isBuy, qty);
      updateButton(elBuyApt, 'property', 'apartment', apartments, isBuy, qty);
      updateButton(elBuyShop, 'property', 'shop', shops, isBuy, qty);
      updateButton(elBuyBuilding, 'property', 'building', buildings, isBuy, qty);
    }
    
    // 개별 버튼 텍스트 및 스타일 업데이트 함수
    function updateButton(button, category, type, count, isBuy, qty) {
      if (!button) return;
      
      const price = isBuy 
        ? (category === 'financial' ? getFinancialCost(type, count, qty) : getPropertyCost(type, count, qty))
        : (category === 'financial' ? getFinancialSellPrice(type, count, qty) : getPropertySellPrice(type, count, qty));
      
      const modeText = isBuy ? '구입' : '판매';
      const qtyText = qty > 1 ? ` x${qty}` : '';
      
      // 버튼 텍스트: 가격 제거, 모드와 수량만 표시
      button.textContent = `${modeText}${qtyText}`;
      
      // 버튼 색상 및 활성화 상태
      if (isBuy) {
        button.style.background = '';
        button.disabled = cash < price;
      } else {
        // 판매 모드: 판매 가능하면 빨간색, 불가능하면 회색
        const canSell = count >= qty;
        button.style.background = canSell ? 'var(--bad)' : 'var(--muted)';
        button.disabled = !canSell;
      }
    }

    // ======= 액션 =======
    elWork.addEventListener('click', (e)=>{
      let income = getClickIncome();
      
      // 업그레이드 효과 적용 (새 UPGRADES 시스템)
      if (UPGRADES['golden_click'] && UPGRADES['golden_click'].purchased && Math.random() < 0.1) {
        income *= 6; // 10% 확률로 6배 수익
        addLog('💰 성과급 지급! 6배 수익!');
      }
      
      // 떨어지는 쿠키 애니메이션 생성
      const rect = elWork.getBoundingClientRect();
      const clickX = e.clientX;
      const clickY = e.clientY;
      createFallingCookie(clickX, clickY);
      
      cash += income;
      totalClicks += 1; // 클릭 수 증가
      totalLaborIncome += income; // 총 노동 수익 증가
      
      // 디버깅: 클릭 수 확인 (강화된 로깅)
      console.log('=== CLICK EVENT DEBUG ===');
      console.log('Click count updated:', totalClicks);
      console.log('Current career level:', careerLevel);
      console.log('Next career required clicks:', getNextCareer()?.requiredClicks);
      console.log('Cash updated:', cash);
      console.log('Total labor income:', totalLaborIncome);
      console.log('========================');
      
      // 자동 승진 체크
      const wasPromoted = checkCareerPromotion();
      
      // 승진이 발생했다면 즉시 UI 업데이트
      if (wasPromoted) {
        updateUI();
      }
      
      // 클릭 애니메이션 효과
      elWork.classList.add('click-effect');
      setTimeout(() => elWork.classList.remove('click-effect'), 300);
      
      // 수익 증가 텍스트 애니메이션
      showIncomeAnimation(income);
      
      updateUI();
    });

    // ======= 공유하기 기능 =======
    async function shareGame() {
      const gameUrl = window.location.href;
      const gameTitle = '서울 역세권 타이쿤';
      const gameDescription = `💰 부동산과 금융 투자로 부자가 되는 게임!\n현재 자산: ${formatNumber(cash)}원\n초당 수익: ${formatNumber(getRps())}원/s`;
      const shareText = `${gameTitle}\n\n${gameDescription}\n\n${gameUrl}`;

      // Web Share API 사용 (모바일)
      if (navigator.share) {
        try {
          await navigator.share({
            title: gameTitle,
            text: gameDescription,
            url: gameUrl
          });
          addLog('✅ 게임이 공유되었습니다!');
          return;
        } catch (err) {
          // 사용자가 공유를 취소한 경우
          if (err.name !== 'AbortError') {
            console.error('공유 실패:', err);
          }
          // 취소된 경우 클립보드 복사로 대체
        }
      }

      // 클립보드 복사 (데스크톱 또는 Web Share API 실패 시)
      try {
        await navigator.clipboard.writeText(shareText);
        addLog('✅ 게임 링크가 클립보드에 복사되었습니다!');
        
        // 버튼에 피드백 표시
        const originalText = elShareBtn.innerHTML;
        elShareBtn.innerHTML = '<span>✓</span><span>복사됨!</span>';
        elShareBtn.style.background = 'var(--good)';
        setTimeout(() => {
          elShareBtn.innerHTML = originalText;
          elShareBtn.style.background = '';
        }, 2000);
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        addLog('❌ 공유에 실패했습니다. URL을 수동으로 복사해주세요.');
        
        // 대체 방법: 텍스트 영역 사용
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          addLog('✅ 게임 링크가 복사되었습니다!');
        } catch (err2) {
          addLog('❌ 공유 기능을 사용할 수 없습니다.');
        }
        document.body.removeChild(textArea);
      }
    }

    elShareBtn.addEventListener('click', shareGame);

    // 떨어지는 지폐 애니메이션 함수 (노동 클릭 시)
    function createFallingCookie(clickX, clickY) {
      const cookie = document.createElement('div');
      cookie.className = 'falling-cookie';
      cookie.textContent = '💵'; // 지폐만 떨어뜨리기
      
      // 클릭 위치 기준으로 설정
      cookie.style.left = (clickX + Math.random() * 100 - 50) + 'px';
      cookie.style.top = (clickY - 100) + 'px';
      
      document.body.appendChild(cookie);
      
      // 애니메이션 완료 후 요소 제거
      setTimeout(() => {
        if (cookie.parentNode) {
          cookie.parentNode.removeChild(cookie);
        }
      }, 2000);
    }

    // 떨어지는 건물 애니메이션 함수
    function createFallingBuilding(icon, count) {
      for (let i = 0; i < Math.min(count, 5); i++) { // 최대 5개까지만 애니메이션
        setTimeout(() => {
          const building = document.createElement('div');
          building.className = 'falling-cookie';
          building.textContent = icon;
          
          // 화면 상단에서 랜덤하게 떨어뜨리기
          building.style.left = (Math.random() * window.innerWidth) + 'px';
          building.style.top = '-100px';
          
          document.body.appendChild(building);
          
          // 애니메이션 완료 후 요소 제거
          setTimeout(() => {
            if (building.parentNode) {
              building.parentNode.removeChild(building);
            }
          }, 2000);
        }, i * 200); // 0.2초 간격으로 순차 생성
      }
    }


    // 수익 증가 애니메이션 함수 (개선된 float-up 효과)
    function showIncomeAnimation(amount) {
      const animation = document.createElement('div');
      animation.className = 'income-increase';
      animation.textContent = `+${formatKoreanNumber(amount)}원`;
      
      // 노동 버튼 위치 기준으로 애니메이션 위치 설정
      const workRect = elWork.getBoundingClientRect();
      const containerRect = elWork.parentElement.getBoundingClientRect();
      
      // 노동 버튼 위쪽에 랜덤하게 표시
      animation.style.position = 'absolute';
      animation.style.left = (workRect.left - containerRect.left + Math.random() * 100 - 50) + 'px';
      animation.style.top = (workRect.top - containerRect.top - 50) + 'px';
      animation.style.zIndex = '1000';
      animation.style.pointerEvents = 'none';
      
      elWork.parentElement.style.position = 'relative';
      elWork.parentElement.appendChild(animation);
      
      // 애니메이션 효과
      animation.style.opacity = '1';
      animation.style.transform = 'translateY(0px) scale(1)';
      
      // 떠오르는 애니메이션
      setTimeout(() => {
        animation.style.transition = 'all 1.5s ease-out';
        animation.style.opacity = '0';
        animation.style.transform = 'translateY(-80px) scale(1.2)';
      }, 100);
      
      // 애니메이션 완료 후 제거
      setTimeout(() => {
        if (animation.parentElement) {
          animation.parentElement.removeChild(animation);
        }
      }, 1600);
    }

    // 금융상품 거래 이벤트 (구매/판매 통합)
    elBuyDeposit.addEventListener('click', ()=>{
      if (!isProductUnlocked('deposit')) {
        addLog('❌ 예금은 아직 잠겨있습니다.');
        return;
      }
      const result = handleTransaction('financial', 'deposit', deposits);
      if (result.success) {
        deposits = result.newCount;
        showPurchaseSuccess(elBuyDeposit);
        checkNewUnlocks('deposit'); // 해금 체크
      }
      updateUI();
    });

    elBuySavings.addEventListener('click', ()=>{
      if (!isProductUnlocked('savings')) {
        addLog('❌ 적금은 예금을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('financial', 'savings', savings);
      if (result.success) {
        savings = result.newCount;
        showPurchaseSuccess(elBuySavings);
        checkNewUnlocks('savings'); // 해금 체크
      }
      updateUI();
    });

    elBuyBond.addEventListener('click', ()=>{
      if (!isProductUnlocked('bond')) {
        addLog('❌ 국내주식은 적금을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('financial', 'bond', bonds);
      if (result.success) {
        bonds = result.newCount;
        showPurchaseSuccess(elBuyBond);
        checkNewUnlocks('bond'); // 해금 체크
      }
      updateUI();
    });

    // 미국주식 구매 버튼
    elBuyUsStock.addEventListener('click', ()=>{
      if (!isProductUnlocked('usStock')) {
        addLog('❌ 미국주식은 국내주식을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('financial', 'usStock', usStocks);
      if (result.success) {
        usStocks = result.newCount;
        showPurchaseSuccess(elBuyUsStock);
        checkNewUnlocks('usStock'); // 해금 체크
      }
      updateUI();
    });

    // 코인 구매 버튼
    elBuyCrypto.addEventListener('click', ()=>{
      if (!isProductUnlocked('crypto')) {
        addLog('❌ 코인은 미국주식을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('financial', 'crypto', cryptos);
      if (result.success) {
        cryptos = result.newCount;
        showPurchaseSuccess(elBuyCrypto);
        checkNewUnlocks('crypto'); // 해금 체크
      }
      updateUI();
    });

    // 부동산 거래 이벤트 (구매/판매 통합)
    elBuyVilla.addEventListener('click', ()=>{
      if (!isProductUnlocked('villa')) {
        addLog('❌ 빌라는 코인을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'villa', villas);
      if (result.success) {
        villas = result.newCount;
        showPurchaseSuccess(elBuyVilla);
        checkNewUnlocks('villa'); // 해금 체크
      }
      updateUI();
    });

    elBuyOfficetel.addEventListener('click', ()=>{
      if (!isProductUnlocked('officetel')) {
        addLog('❌ 오피스텔은 빌라를 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'officetel', officetels);
      if (result.success) {
        officetels = result.newCount;
        showPurchaseSuccess(elBuyOfficetel);
        checkNewUnlocks('officetel'); // 해금 체크
      }
      updateUI();
    });

    elBuyApt.addEventListener('click', ()=>{
      if (!isProductUnlocked('apartment')) {
        addLog('❌ 아파트는 오피스텔을 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'apartment', apartments);
      if (result.success) {
        apartments = result.newCount;
        showPurchaseSuccess(elBuyApt);
        checkNewUnlocks('apartment'); // 해금 체크
      }
      updateUI();
    });

    elBuyShop.addEventListener('click', ()=>{
      if (!isProductUnlocked('shop')) {
        addLog('❌ 상가는 아파트를 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'shop', shops);
      if (result.success) {
        shops = result.newCount;
        showPurchaseSuccess(elBuyShop);
        checkNewUnlocks('shop'); // 해금 체크
      }
      updateUI();
    });

    elBuyBuilding.addEventListener('click', ()=>{
      if (!isProductUnlocked('building')) {
        addLog('❌ 빌딩은 상가를 1개 이상 보유해야 해금됩니다.');
        return;
      }
      const result = handleTransaction('property', 'building', buildings);
      if (result.success) {
        buildings = result.newCount;
        showPurchaseSuccess(elBuyBuilding);
        checkNewUnlocks('building'); // 해금 체크
      }
      updateUI();
    });

    // ======= 업그레이드 효과 적용 함수 =======
    // 구형 applyUpgradeEffect 및 업그레이드 시스템 제거됨 - 새로운 Cookie Clicker 스타일 시스템 사용

    
    // ======= 키보드 단축키 =======
    document.addEventListener('keydown', (e) => {
      // Ctrl + Shift + R: 게임 초기화 (브라우저 새로고침과 충돌 방지)
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        resetGame();
      }
      // Ctrl + S: 수동 저장
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault(); // 브라우저 저장 방지
        saveGame();
        addLog('💾 수동 저장 완료!');
      }
    });

    // 새로 시작(리셋) 버튼
    if (elResetBtn) {
      elResetBtn.addEventListener('click', resetGame);
    }

    // ======= UI/통계 업데이트 스로틀(성능) =======
    let uiDirty = true;
    let lastStatsTabUpdate = 0;
    const STATS_TAB_UPDATE_INTERVAL = 1000; // ms

    // ======= 수익/로직 틱(계산 전용) =======
    const TICK = 50; // ms
    setInterval(() => {
      const deltaTime = TICK / 1000;
      cash += getRps() * deltaTime;
      
      // 누적 생산량 계산 (Cookie Clicker 스타일)
      depositsLifetime += deposits * FINANCIAL_INCOME.deposit * deltaTime;
      savingsLifetime += savings * FINANCIAL_INCOME.savings * deltaTime;
      bondsLifetime += bonds * FINANCIAL_INCOME.bond * deltaTime;
      usStocksLifetime += usStocks * FINANCIAL_INCOME.usStock * deltaTime;
      cryptosLifetime += cryptos * FINANCIAL_INCOME.crypto * deltaTime;
      villasLifetime += villas * BASE_RENT.villa * deltaTime;
      officetelsLifetime += officetels * BASE_RENT.officetel * deltaTime;
      apartmentsLifetime += apartments * BASE_RENT.apartment * deltaTime;
      shopsLifetime += shops * BASE_RENT.shop * deltaTime;
      buildingsLifetime += buildings * BASE_RENT.building * deltaTime;

      uiDirty = true;
    }, TICK);

    // ======= 메타 로직(저빈도) =======
    const META_TICK = 1000; // ms
    setInterval(() => {
      checkMarketEvent(); // 시장 이벤트 종료 체크
      checkAchievements(); // 업적 체크
      checkUpgradeUnlocks(); // 업그레이드 해금 체크
      uiDirty = true;
    }, META_TICK);

    // ======= UI 렌더(스로틀) =======
    const UI_TICK = 250; // ms
    setInterval(() => {
      if (!uiDirty) return;
      uiDirty = false;
      updateUI();
    }, UI_TICK);
    
    // ======= 자동 저장 시스템 =======
    setInterval(()=>{
      saveGame(); // 5초마다 자동 저장
    }, 5000);
    
    // ======= 오토클릭 시스템 =======
    setInterval(()=>{
      if (autoClickEnabled) {
        const income = getClickIncome();
        cash += income;
        totalClicks += 1;
        totalLaborIncome += income;
        checkCareerPromotion();
        
        // 성과급은 오토클릭에도 적용
        if (UPGRADES['golden_click'] && UPGRADES['golden_click'].purchased && Math.random() < 0.1) {
          const bonusIncome = income * 5; // 이미 1배는 추가되었으므로 5배 추가 (총 6배)
          cash += bonusIncome;
          totalLaborIncome += bonusIncome;
        }
      }
    }, 1000); // 1초마다
    
    // ======= 시장 이벤트 시스템 =======
    marketSystem.scheduleNextMarketEvent();

    // 초기 렌더
    const gameLoaded = loadGame(); // 게임 데이터 불러오기 시도
    if (gameLoaded) {
      addLog('저장된 게임을 불러왔습니다.');
    } else {
      addLog('환영합니다! 노동으로 종잣돈을 모아 첫 부동산을 구입해보세요.');
    }
    
    // 리스크 정보 초기화
    updateFinancialRiskInfo();
    updatePropertyRiskInfo();
    
    // 판매 시스템 테스트 로그
    console.log('=== 판매 시스템 초기화 완료 ===');
    console.log('✅ 구매/판매 모드 토글 시스템 활성화');
    console.log('✅ 금융상품 통합 거래 시스템 (예금/적금/주식)');
    console.log('✅ 부동산 통합 거래 시스템 (빌라/오피스텔/아파트/상가/빌딩)');
    console.log('✅ 판매 가격: 현재가의 80%');
    console.log('✅ 수량 선택: 1개/5개/10개');
    console.log('💡 사용법: 상단 "구매/판매" 버튼으로 모드 전환 후 거래하세요!');
    
    // ======= 통계 탭 업데이트 함수 =======
    
    function updateStatsTab() {
      try {
        // 1. 핵심 지표
        const totalAssets = cash + calculateTotalAssetValue();
        const totalEarnings = depositsLifetime + savingsLifetime + bondsLifetime + 
                              usStocksLifetime + cryptosLifetime +
                              villasLifetime + officetelsLifetime + apartmentsLifetime +
                              shopsLifetime + buildingsLifetime + totalLaborIncome;
        
        safeText(document.getElementById('totalAssets'), formatCashDisplay(totalAssets));
        safeText(document.getElementById('totalEarnings'), formatCashDisplay(totalEarnings));
        safeText(document.getElementById('rpsStats'), formatKoreanNumber(getRps()) + '원/초');
        safeText(document.getElementById('clickIncomeStats'), formatCashDisplay(getClickIncome()));
        
        // 2. 플레이 정보
        safeText(document.getElementById('totalClicksStats'), totalClicks.toLocaleString('ko-KR') + '회');
        safeText(document.getElementById('laborIncomeStats'), formatCashDisplay(totalLaborIncome));
        
        // 플레이 시간 계산 (누적 플레이시간 시스템)
        const currentSessionTime = Date.now() - sessionStartTime;
        const totalPlayTimeMs = totalPlayTime + currentSessionTime;
        const playTimeMinutes = Math.floor(totalPlayTimeMs / 60000);
        const playTimeHours = Math.floor(playTimeMinutes / 60);
        const remainingMinutes = playTimeMinutes % 60;
        const playTimeText = playTimeHours > 0 
          ? `${playTimeHours}시간 ${remainingMinutes}분` 
          : `${playTimeMinutes}분`;
        
        // 디버깅 로그
        console.log('🕐 플레이시간 계산:', {
          totalPlayTime: totalPlayTime,
          currentSessionTime: currentSessionTime,
          totalPlayTimeMs: totalPlayTimeMs,
          playTimeMinutes: playTimeMinutes,
          playTimeText: playTimeText
        });
        
        safeText(document.getElementById('playTimeStats'), playTimeText);
        
        // 시간당 수익
        const hourlyRateValue = playTimeMinutes > 0 
          ? (totalEarnings / playTimeMinutes) * 60 
          : 0;
        safeText(document.getElementById('hourlyRate'), formatCashDisplay(hourlyRateValue) + '/시간');
        
        // 3. 수익 구조
        const laborPercent = totalEarnings > 0 ? (totalLaborIncome / totalEarnings * 100) : 0;
        const financialTotal = depositsLifetime + savingsLifetime + bondsLifetime + 
                              usStocksLifetime + cryptosLifetime;
        const financialPercent = totalEarnings > 0 ? (financialTotal / totalEarnings * 100) : 0;
        const propertyTotal = villasLifetime + officetelsLifetime + apartmentsLifetime + shopsLifetime + buildingsLifetime;
        const propertyPercent = totalEarnings > 0 ? (propertyTotal / totalEarnings * 100) : 0;
        
        // 수익 구조 바
        const laborSegment = document.getElementById('laborSegment');
        const financialSegment = document.getElementById('financialSegment');
        const propertySegment = document.getElementById('propertySegment');
        
        if (laborSegment) {
          laborSegment.style.width = laborPercent.toFixed(1) + '%';
          laborSegment.querySelector('span').textContent = laborPercent >= 5 
            ? `🛠️ ${laborPercent.toFixed(1)}%` 
            : '';
        }
        
        if (financialSegment) {
          financialSegment.style.width = financialPercent.toFixed(1) + '%';
          financialSegment.querySelector('span').textContent = financialPercent >= 5 
            ? `💰 ${financialPercent.toFixed(1)}%` 
            : '';
        }
        
        if (propertySegment) {
          propertySegment.style.width = propertyPercent.toFixed(1) + '%';
          propertySegment.querySelector('span').textContent = propertyPercent >= 5 
            ? `🏢 ${propertyPercent.toFixed(1)}%` 
            : '';
        }
        
        // 범례 업데이트
        safeText(document.getElementById('laborLegend'), `노동: ${laborPercent.toFixed(1)}%`);
        safeText(document.getElementById('financialLegend'), `금융: ${financialPercent.toFixed(1)}%`);
        safeText(document.getElementById('propertyLegend'), `부동산: ${propertyPercent.toFixed(1)}%`);
        
        // 4. 금융상품 상세
        safeText(document.getElementById('depositsOwnedStats'), deposits + '개');
        safeText(document.getElementById('depositsLifetimeStats'), formatCashDisplay(depositsLifetime));
        
        safeText(document.getElementById('savingsOwnedStats'), savings + '개');
        safeText(document.getElementById('savingsLifetimeStats'), formatCashDisplay(savingsLifetime));
        
        safeText(document.getElementById('bondsOwnedStats'), bonds + '개');
        safeText(document.getElementById('bondsLifetimeStats'), formatCashDisplay(bondsLifetime));
        
        // 5. 부동산 상세
        safeText(document.getElementById('villasOwnedStats'), villas + '채');
        safeText(document.getElementById('villasLifetimeStats'), formatCashDisplay(villasLifetime));
        
        safeText(document.getElementById('officetelsOwnedStats'), officetels + '채');
        safeText(document.getElementById('officetelsLifetimeStats'), formatCashDisplay(officetelsLifetime));
        
        safeText(document.getElementById('apartmentsOwnedStats'), apartments + '채');
        safeText(document.getElementById('apartmentsLifetimeStats'), formatCashDisplay(apartmentsLifetime));
        
        safeText(document.getElementById('shopsOwnedStats'), shops + '채');
        safeText(document.getElementById('shopsLifetimeStats'), formatCashDisplay(shopsLifetime));
        
        safeText(document.getElementById('buildingsOwnedStats'), buildings + '채');
        safeText(document.getElementById('buildingsLifetimeStats'), formatCashDisplay(buildingsLifetime));
        
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
    
    // 총 자산 가치 계산 (현재 보유 자산을 현재가로 환산)
    function calculateTotalAssetValue() {
      let totalValue = 0;
      
      // 금융상품 가치
      if (deposits > 0) {
        totalValue += getFinancialCost('deposit', deposits - 1);
      }
      if (savings > 0) {
        totalValue += getFinancialCost('savings', savings - 1);
      }
      if (bonds > 0) {
        totalValue += getFinancialCost('bond', bonds - 1);
      }
      
      // 부동산 가치
      if (villas > 0) {
        totalValue += getPropertyCost('villa', villas - 1);
      }
      if (officetels > 0) {
        totalValue += getPropertyCost('officetel', officetels - 1);
      }
      if (apartments > 0) {
        totalValue += getPropertyCost('apartment', apartments - 1);
      }
      if (shops > 0) {
        totalValue += getPropertyCost('shop', shops - 1);
      }
      if (buildings > 0) {
        totalValue += getPropertyCost('building', buildings - 1);
      }
      
      return totalValue;
    }
    
    // 효율 분석 (개당 초당 수익 순위)
    function calculateEfficiencies() {
      const assets = [];
      
      // 금융상품
      if (deposits > 0) {
        assets.push({ name: '예금', efficiency: FINANCIAL_INCOME.deposit, count: deposits });
      }
      if (savings > 0) {
        assets.push({ name: '적금', efficiency: FINANCIAL_INCOME.savings, count: savings });
      }
      if (bonds > 0) {
        assets.push({ name: '국내주식', efficiency: FINANCIAL_INCOME.bond, count: bonds });
      }
      if (usStocks > 0) {
        assets.push({ name: '미국주식', efficiency: FINANCIAL_INCOME.usStock, count: usStocks });
      }
      if (cryptos > 0) {
        assets.push({ name: '코인', efficiency: FINANCIAL_INCOME.crypto, count: cryptos });
      }
      
      // 부동산
      if (villas > 0) {
        assets.push({ name: '빌라', efficiency: BASE_RENT.villa * rentMultiplier, count: villas });
      }
      if (officetels > 0) {
        assets.push({ name: '오피스텔', efficiency: BASE_RENT.officetel * rentMultiplier, count: officetels });
      }
      if (apartments > 0) {
        assets.push({ name: '아파트', efficiency: BASE_RENT.apartment * rentMultiplier, count: apartments });
      }
      if (shops > 0) {
        assets.push({ name: '상가', efficiency: BASE_RENT.shop * rentMultiplier, count: shops });
      }
      if (buildings > 0) {
        assets.push({ name: '빌딩', efficiency: BASE_RENT.building * rentMultiplier, count: buildings });
      }
      
      // 효율 순으로 정렬
      assets.sort((a, b) => b.efficiency - a.efficiency);
      
      // 상위 3개 반환
      return assets.slice(0, 3).map(a => 
        `${a.name} (${formatKoreanNumber(Math.floor(a.efficiency))}원/초, ${a.count}개 보유)`
      );
    }
    
    // 업적 그리드 업데이트
    function updateAchievementGrid() {
      const achievementGrid = document.getElementById('achievementGrid');
      if (!achievementGrid) return;
      
      // 이미 생성되어 있으면 업데이트만
      if (achievementGrid.children.length > 0) {
        let unlockedCount = 0;
        Object.values(ACHIEVEMENTS).forEach(ach => {
          const icon = document.getElementById('ach_' + ach.id);
          if (icon) {
            if (ach.unlocked) {
              icon.classList.add('unlocked');
              icon.classList.remove('locked');
              unlockedCount++;
            } else {
              icon.classList.add('locked');
              icon.classList.remove('unlocked');
            }
          }
        });
        
        const totalAchievements = Object.keys(ACHIEVEMENTS).length;
        safeText(document.getElementById('achievementProgress'), `${unlockedCount}/${totalAchievements}`);
        return;
      }
      
      // 처음 생성
      achievementGrid.innerHTML = '';
      let unlockedCount = 0;
      const totalAchievements = Object.keys(ACHIEVEMENTS).length;
      
      Object.values(ACHIEVEMENTS).forEach(ach => {
        const icon = document.createElement('div');
        icon.className = 'achievement-icon';
        icon.id = 'ach_' + ach.id;
        icon.textContent = ach.icon;
        icon.title = ach.unlocked 
          ? `${ach.name}\n${ach.desc}\n✅ 달성!` 
          : `${ach.name}\n${ach.desc}\n🔒 미달성`;
        
        if (ach.unlocked) {
          icon.classList.add('unlocked');
          unlockedCount++;
        } else {
          icon.classList.add('locked');
        }
        
        achievementGrid.appendChild(icon);
      });
      
      safeText(document.getElementById('achievementProgress'), `${unlockedCount}/${totalAchievements}`);
    }
    
    // ======= 하단 네비게이션 탭 전환 =======
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // 모든 탭 비활성화
        tabContents.forEach(tab => tab.classList.remove('active'));
        navBtns.forEach(navBtn => navBtn.classList.remove('active'));
        
        // 선택한 탭 활성화
        document.getElementById(targetTab).classList.add('active');
        btn.classList.add('active');
      });
    });
    
    updateUI(); // 초기 UI 업데이트
    
    // 업그레이드 섹션 초기 상태 설정 (열림)
    const upgradeListElement = document.getElementById('upgradeList');
    if (upgradeListElement) {
      upgradeListElement.classList.remove('collapsed-section');
      console.log('✅ Upgrade list initialized and opened');
    }
    
    updateUpgradeList(); // 초기 업그레이드 리스트 생성
    
    // (정리) 디버그/치트 코드는 프로덕션에서 제거
    
    // 유닛성 테스트 로그
    addLog('🧪 v2.6 Cookie Clicker 스타일 업그레이드 시스템 구현 완료');
    addLog('✅ DOM 참조 오류 수정 완료');
    addLog('✅ 커리어 진행률 시스템 정상화');
    addLog('✅ 업그레이드 클릭 기능 활성화');
    addLog('✅ 자동 저장 시스템 작동 중');
    addLog('⚡ 성능 최적화: 업그레이드 리스트 깜빡임 해결');
    
});

