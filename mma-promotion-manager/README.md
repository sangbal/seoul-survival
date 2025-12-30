# MMA 프로모션 매니저 (가칭) — SPEC 최종보스 v2.0 (Cursor 단일 컨텍스트)

> 목적: 이 문서만 컨텍스트로 넣어도 Cursor가 **임의 추측/자의적 설계** 없이 즉시 개발을 시작할 수 있게 한다.
> 범위: MVP를 “완전 플레이 가능” 수준까지.
> 절대 원칙: **규칙 변경 금지 / 숫자 하드코딩 금지 / 밸런스는 src/balance에만 존재**

---

## 0. 문서 사용 규칙 (Cursor 필독)

### 0.1 Cursor가 반드시 지켜야 하는 규약

- 이 문서가 “정본(Single Source of Truth)”이다.
- 문서에 명시된 사항을 **추측으로 바꾸지 않는다.**
- 불명확/미정 항목은 임의로 채우지 말고, 아래 규칙대로 처리한다.
  - (1) MVP에 필수면: `TODO(spec-confirm)` 코멘트를 남기고, **기존 구조를 깨지 않는 최소 구현**을 한다.
  - (2) MVP에 비필수면: 구현하지 않고 문서에 “Out of scope”로 둔다.

### 0.2 하드 금지(절대 하지 말 것)

- 엔진/로직 코드에 경제/확률/배수/임계치 등의 수치를 “직접 숫자로” 박아넣는 행위 금지  
  → 모든 수치는 `src/balance/*`에서 로드해야 한다.
- 전속계약 중 중도 이적 구현 금지
- 타 단체 경기 관전 UI 구현 금지(통계만)
- 훈련/캠프/코치/부상 시스템 MVP 포함 금지
- “확신 라벨(예: 강추/확실/안전픽)” 같은 표현/배지 UI 금지  
  → 승률 표기는 무조건 “전문가 예상”만

---

## 1. 게임 한 줄 정의 + 핵심 루프

### 1.1 한 줄 정의

플레이어는 MMA **단체 회장(프로모터)** 이며, **Tier 6(동네)** 단체로 시작해  
**매치메이킹 → 관전(통계+자막) → 재무 반영 → 연말 재계약/시장 이동/승강** 루프를 통해 **Tier 1(글로벌 탑)** 으로 성장시키는 현실감 경영 시뮬레이션.

### 1.2 시즌 루프(연도 기준)

- 시즌: 1/1 ~ 12/31
- 시즌 진행:
  1. (시즌 중) 이벤트 개최(연 4~6회)
  2. (시즌 말) 재계약 UI → 은퇴/신인 → 시장 이적(2~5%) → PPI 승강 → 다음 시즌

---

## 2. “절대 고정” 규칙(게임 세계관 불변 조건)

### 2.1 Tier 규칙

- Tier 숫자 낮을수록 상위: Tier 1 최상위, Tier 6 동네

### 2.2 단체(프로모션)

- 단체 총 12개
- 티어별 2개씩(1~6)
- 플레이어 단체는 Tier 6 중 하나로 시작
- 타 단체 경기는 **관전 불가**, 통계/랭킹 데이터만 제공

### 2.3 선수 풀/체육관

- 선수 풀 500명 고정
- 체육관 10개 고정, 각 체육관 50명 고정
- 은퇴 시 같은 체육관에서 신인 생성(FA) → 항상 500 유지

### 2.4 계약(MVP)

- 전속 1년(1/1~12/31) 고정
- 조건은 파이트머니(₩)만
- 전속 중 중도이적 없음
- 포칭/이적 게임성은 “재계약 UI”에서만 발생

### 2.5 연말 시장 이적(폭주 방지)

- 시즌 종료 시 전체 선수의 2~5%만 이동
- 최대 1티어만 이동
- 이동은 반드시 “존재하는 다른 단체”로만(증발/가상 단체 금지)
- UP 이동이 생기면 자리 때문에 DOWN이 생길 수 있으나 **도미노는 1단까지만**

### 2.6 이벤트 수(연도 내 개최 횟수, 고정)

- Tier 5~6: 4회
- Tier 3~4: 5회
- Tier 1~2: 6회

### 2.7 경기 관전 UI(고정)

- 좌/우 선수 사진 + 닉네임
- 중앙: 탭폴로지 감성 누적 통계(부위타격/TD/컨트롤/서브/다운)
- 하단: FM 스타일 **문장형 자막 중계**
- 승률 표기는 “전문가 예상”으로만

---

## 3. 용어집(Glossary) — Cursor의 해석 고정

- Promotion(단체): 플레이어가 운영하는 리그 주최 단체
- Tier: 단체의 급(1~6, 숫자 낮을수록 상위)
- Gym(체육관): 선수 생성의 출신 풀(10개 고정)
- Fighter(선수): 500명 고정 풀의 구성원
- CA/PA: FM 레퍼런스의 현재능력/잠재력(비노출)
- hidden.rating / RD: 내부 전투력 레이팅 및 불확실성(비노출)
- Ticket Power: 흥행력(0~100, 공개)
- Expert Pick: 전문가 예상 승률(표기용, 확신라벨 없음)
- Event: 연간 개최하는 대회(플레이어 단체만 실제 진행)
- Bout: 이벤트 내 개별 경기
- PPI: 단체 파워 지표(단체 랭킹/승강용)
- Save Snapshot: GameState를 JSONB로 통째 저장하는 방식(MVP 채택)

---

## 4. 범위(MVP) / 비범위(Out of scope)

### 4.1 MVP에 포함(반드시 구현)

- 새 게임 생성: 500명/10체육관/12단체/초기 계약/초기 랭킹
- 매치메이킹: 전문가 예상 + 예상 손익(₩) + 카드 확정
- 관전: 통계 누적 + 자막 중계 + 결과 반영(전적/쿨다운/재무)
- 시즌 종료:
  - 재계약 UI(단순 심리전)
  - 은퇴(35~45 확률) + 동일 체육관 신인 FA 생성
  - 시장 이적 2~5%(1티어, 도미노 1단)
  - PPI 산출/승강(1티어 제한)
- Supabase 세이브 슬롯 저장/불러오기 + RLS(본인만 접근)
- DEV 밸런스 override 패널(로컬 저장 + 적용/리셋/복사)

### 4.2 MVP에서 제외(절대 구현 금지)

- 훈련/캠프/코치/부상 시스템
- 복잡 계약(복수년/보너스/옵션/방출조항)
- 타 단체 관전 UI
- 확신 라벨/추천 등급 UI
- 멀티플레이/실시간 PVP

---

## 5. 체육관(10개) 최종 고정 데이터

> 랭크 1이 최강~랭크 10 최약. 단, 분산이 크므로 하위에서도 스타가 나올 수 있음.
> 스타일 태그는 선수 생성/시뮬레이션에 영향을 준다(“경향”을 만들되 절대 1:1 고정 승패가 되면 안 됨).

### 5.1 Gym 국가/티어 구성(메이저/마이너)

- USA Major: American Peak Team (ALL_ROUND, COUNTER_RANGE)
- BRA Major: Chute Boxe Atelier (PRESSURE_BRAWL, ALL_ROUND)
- RUS Major: Akhmat Fight Camp (WRESTLE_CTRL, ALL_ROUND)
- JPN Major: Krazy Bii Tokyo (COUNTER_RANGE, KICK_LEG)
- KOR Major: GoldenCombat (KICK_LEG, PRESSURE_BRAWL)
- USA Minor: Jaxson Wink Lab (COUNTER_RANGE, ALL_ROUND)
- BRA Minor: Brazilian RKO (BJJ_SUB, WRESTLE_CTRL)
- RUS Minor: Red Devil Combat Club (WRESTLE_CTRL, PRESSURE_BRAWL)
- JPN Minor: Palaestra Tokyo (BJJ_SUB, COUNTER_RANGE)
- KOR Minor: WatchaClub (PRESSURE_BRAWL, KICK_LEG) ← 전체 10위(최약)

---

## 6. 게임 데이터의 “정답 구조” (폴더/모듈화)

### 6.1 리포지토리 폴더 구조(고정)

- 목적: Cursor가 파일을 제멋대로 흩뿌리지 않게 하기 위함

/src
/balance
index.ts # base + local override merge + validate
generation.ts # 선수 생성 분포(CA/PA/나이/체급/티켓파워/성향)
economy.ts # 원화 경제(좌석/단가/고정비/파이트머니 range/임대료 계수)
matchmaking.ts # 전문가 예상/흥행 점수/스토리 보너스 계산 계수
simulation.ts # 경기 시뮬(판정 가중/피니시 임계/틱 주기)
ranking.ts # fighter rating 업데이트 + PPI + 승강 제약
story.ts # 은퇴 확률/이적 비율(2~5%)/문장 중계 템플릿 파라미터
gyms.ts # 체육관 고정 데이터(10개)
promotions.ts # 단체 12개 고정 데이터(초기 티어 포함)
uiText.ts # 용어/라벨(한글 지표명 포함)

/domain
types.ts # 모든 타입(선수/단체/계약/이벤트/경기/스탯/로그)
state.ts # GameState(save snapshot) 스키마
constants.ts # enum/const(체급, 슬롯 등)
validators.ts # 런타임 검증(필수 최소)

/systems
rng.ts
bootstrapEngine.ts # 새 게임 생성
matchmakingEngine.ts # matchHype, expertPick, eventHype
economyEngine.ts # 예상 손익 계산(카드 확정 전)
fightSimEngine.ts # 경기 시뮬 + 통계 스냅샷 + 문장 로그
ratingEngine.ts # rating/RD 업데이트
promotionRankEngine.ts# PPI 계산/승강(1티어 제한)
seasonEngine.ts # 연말(은퇴/신인/시장 이적 2~5%)
saveEngine.ts # save serialize/migrate helper(프론트단)

/supabase
client.ts # supabase init
savesApi.ts # CRUD(load/save/list)
leaderboardApi.ts # optional
rls.sql # 문서 내 SQL과 동일하게 유지(참고/백업)

/ui
/screens # 라우팅 단위 화면
/components # 재사용 컴포넌트
/styles # 공통 스타일

css
코드 복사

### 6.2 코드 규칙(강제)

- 엔진은 반드시 `balance`를 인자로 받아야 한다. (전역 import만으로도 되지만 “의존성 명시”가 원칙)
- UI는 GameState를 단일 소스로 사용한다.
- 저장은 “state JSONB 통째”를 기본으로 한다.
- 마이그레이션은 save_version 기반으로 한다.

---

## 7. 도메인 타입(Types) — Cursor의 데이터 해석을 고정

> 이 섹션은 “오판 방지용”이라 가능한 한 엄격하게 정의한다.
> 아래 스키마는 Typescript 기준이며, 저장 시 JSON으로 직렬화 가능해야 한다.

### 7.1 상수(Enum)

- WeightClass: "FW"|"LW"|"WW"|"MW"
- BoutSlot: "MAIN_5R"|"CO_3R"|"UNDER_3R_1"|"UNDER_3R_2"|"UNDER_3R_3"|"UNDER_3R_4"
- ResultType: "KO_TKO"|"SUB"|"DEC"
- PromotionTier: 1|2|3|4|5|6

### 7.2 Fighter 타입(핵심)

- 공개 영역(public): UI 표시 가능
- 숨김 영역(hidden): CA/PA/내부 레이팅/에이징 커브 등 **절대 UI에 노출하지 않음**

````ts
type Fighter = {
  id: string;

  // 공개
  nickname: string;
  age: number;
  country: "USA"|"BRA"|"RUS"|"JPN"|"KOR";
  gymId: string;

  weightClass: "FW"|"LW"|"WW"|"MW";
  ticketPower: number;         // 1..100
  form: number;                // 20..90 (대략 컨디션/기복)
  traits: { loyalty: number; ambition: number; }; // 0..100

  record: {
    w: number; l: number;
    koW: number; subW: number; decW: number;
    koL: number; subL: number; decL: number;
  };

  publicCareerStats: {
    // 한국어 라벨은 uiText.ts에서 제공, 값만 저장
    slpm: number; sapm: number;
    sigAcc: number; sigDef: number;
    tdPer15: number; tdAcc: number; tdDef: number;
    avgCtrlSec: number;
    subAttPer15: number;
    kdPerFight: number;
    headRate: number; bodyRate: number; legRate: number;
  };

  status: {
    promotionId: string;       // "FA" 또는 prom_*
    isFA: boolean;
    cooldown: number;          // 0..2 (규칙은 4.4)
    lastFightDay: number;      // epoch day(내부 inactivity에도 사용)
  };

  // 비노출(숨김)
  hidden: {
    ca: number;
    pa: number;
    peakAge: number;

    rating: number;            // 내부 전투력(승강/PPI/승률에 영향)
    rd: number;                // 불확실성

    abilities: {
      // 1..20, 스타일 태그가 분포에 영향
      strOff: number; strDef: number;
      grpOff: number; grpDef: number;
      cardio: number; chin: number;
      // 필요 시 확장 가능(단 MVP에서는 최소 6개만 사용)
    };
  };
};
7.3 Promotion(단체)
```ts
type Promotion = {
  id: string;
  name: string;
  tier: 1|2|3|4|5|6;

  // 성장 상태
  audience: number;  // 노출/인지도
  fanbase: number;   // 팬층
  cash: number;      // 원화(정수)
  lastYearPPI?: number;
  lastYearTier?: 1|2|3|4|5|6;
};
````

7.4 Contract(계약)

```ts
type Contract = {
  id: string;
  fighterId: string;
  promotionId: string;
  year: number;
  fightMoney: number; // ₩ (정수)
  start: string; // "YYYY-01-01"
  end: string; // "YYYY-12-31"
  isExpired: boolean;
};
```

7.5 Event/Bout(시즌 이벤트/경기)

```ts
type Bout = {
  id: string;
  slot: BoutSlot;
  weightClass: WeightClass;
  fighterAId: string;
  fighterBId: string;

  expertPick: { a: number; b: number }; // 합 100 (전문가 예상)
  matchHype: number; // 0..100
  profitContribution: number; // 참고값(예상 손익 구성 요소)

  isMercenary?: { a?: boolean; b?: boolean }; // 용병 여부(선택)
  result?: {
    type: ResultType;
    winnerId: string;
    loserId: string;

    stats: {
      // UI 누적 통계의 저장본(스냅샷 최종값)
      a: any;
      b: any;
    };

    log: {
      // EventWatch 하단 자막(문장 배열)
      lines: string[];
      // 선택: 일정 간격 스냅샷(차트/누적표)
      snapshots: any[];
    };
  };
};

type Event = {
  id: string;
  seq: number; // 시즌 내 1..N
  tier: PromotionTier;
  year: number;

  status: "PLANNING" | "CONFIRMED" | "FINISHED";

  bouts: Bout[];

  finance?: {
    occExpected: number; // 0..1
    ticketRevenue: number; // ₩
    sponsorRevenue: number; // ₩
    fixedCost: number; // ₩
    payout: number; // ₩ (파이트머니 총합)
    mercLoanFee: number; // ₩
    profit: number; // ₩
  };
};
```

7.6 Ranking(단체×체급 TOP10)

```ts
type PromotionWeightRanking = {
  promotionId: string;
  year: number;
  weightClass: WeightClass;
  top10: Array<{ rank: number; fighterId: string; delta: number }>;
};
```

8. GameState(세이브 스냅샷) — 저장의 “유일한 진실”
   MVP는 GameState 전체를 JSONB로 저장한다.
   장점: 스키마 변경/밸런싱이 빠르고, Cursor가 DB 정규화하다가 틀릴 위험이 줄어든다.

```ts
type GameState = {
  version: number; // save schema version
  seed: number;

  meta: {
    createdAt: string;
    updatedAt: string;
    year: number;
    nowDay: number; // epoch day (예: year*365 + dayIndex)
    playerPromotionId: string;
  };

  promotions: Record<string, Promotion>;
  fighters: Record<string, Fighter>;
  contracts: Record<string, Contract>;

  rankings: PromotionWeightRanking[];

  season: {
    eventsPlanned: number;
    eventsCompleted: number;
    events: Event[];
  };

  market: {
    lastSeasonTransfers: Array<{
      fighterId: string;
      from: string;
      to: string;
      reason: "UP" | "DOWN" | "FILL";
    }>;
    lastSeasonRetiredIds: string[];
    lastSeasonRookieIds: string[];
  };

  dev?: {
    balanceOverride?: any; // 저장해도 되고 로컬에만 둬도 됨(기본은 로컬)
  };
};
```

9. Supabase DB 구조(핵심) — MVP는 “세이브 슬롯”만으로 충분
   주의: 이미 기존 프로젝트에 profiles/users 테이블이 있을 수 있다.
   이 문서의 SQL은 “최소 운영” 기준이며, 기존 구조가 있으면 충돌 없이 연결한다.

9.1 MVP에 필요한 테이블(필수 1개 + 옵션 1개)
(필수) mma_saves: 세이브 스냅샷 저장

(옵션) mma_leaderboard: 공개 리더보드

9.2 mma_saves (필수)
요구사항:

유저별 슬롯 저장(예: slot 1~3)

state: GameState 통째 JSONB

RLS: 본인만 CRUD 가능

(※ SQL은 Part 2에서 “최종 확정본”으로 다시 제공하며, Cursor는 그 SQL을 migrations로 그대로 반영한다.)

10. 다음 Part에서 다룰 내용(예고 — Cursor 오판 방지 핵심)
    Part 2에서 아래를 “수식/규칙/구현 체크리스트까지” 확정한다.

'src/balance/\*' 각 파일의 필드 스키마(무조건 이 키로 읽게)

전문가 예상 승률 산식(확신라벨 없이 확률만)

매치 흥행/이벤트 흥행/예상 손익 계산식(₩)

경기 시뮬레이션(판정 가중/피니시 임계/자막 템플릿 규칙)

연말 엔진(은퇴 확률, 신인 생성, 시장 이적 2~5%, 도미노 1단)

PPI/승강(1티어 제한) 계산식

Supabase SQL + RLS 정책 최종본 + 프론트 CRUD API 함수 명세

UI 화면별 “필수 컴포넌트/필수 표시 항목/금지 항목” 체크리스트

(Part 1 끝)

---

<!-- Chat log removed -->

# MMA 프로모션 매니저 (가칭) — SPEC 최종보스 v2.0 (Cursor 단일 컨텍스트)

## Part 2/3 — 밸런스 스키마/수식/엔진 규칙/DB SQL/RLS/API/UI 체크리스트

> Part 1을 전제로 한다. Part 2는 “Cursor가 가장 많이 오판하는 영역(수치/수식/연말/승강/DB)”을 **키-스키마까지 고정**한다.
> 모든 수치/임계치/배수/확률은 반드시 `src/balance/*`에 존재한다. 엔진은 balance에서만 읽는다.

---

## 11. Balance 스키마(키 고정) — 'src/balance/\*'

> 아래 “키 이름”은 코드에서 그대로 사용한다. 임의로 키를 바꾸지 말 것.
> 모든 수치는 TS 객체로 관리 + DEV override(JSON deep-merge)로 덮어쓴다.

### 11.1 `src/balance/index.ts`

- 역할: baseBalance 생성 → localStorage override merge → validate
- override key: `balance_override_mma_v1`

필수 함수:

- `getBalance(): Balance`
- `setBalanceOverride(override: any): void`
- `resetBalanceOverride(): void`
- `validateBalance(b: Balance): void` (최소한의 key existence/범위 체크)

### 11.2 Balance 타입(개념)

````ts
export type Balance = {
  app: { version: number };

  generation: GenerationBalance;
  economy: EconomyBalance;
  matchmaking: MatchmakingBalance;
  simulation: SimulationBalance;
  ranking: RankingBalance;
  story: StoryBalance;

  gyms: GymDef[];
  promotions: PromotionDef[];
  uiText: UiTextDef;
};
12. 선수 생성 밸런스 — src/balance/generation.ts
목표: “체육관 랭크가 좋을수록 평균이 높지만, 분산이 커서 하위에서도 스타가 나올 수 있음”
CA/PA는 비노출, 공개 스탯은 CA/스타일로 파생 생성.

```ts
export type GenerationBalance = {
  seed: { defaultSeed: number };

  // 체급 분포(합 1.0)
  weightClassDist: { FW:number; LW:number; WW:number; MW:number };

  // 나이(신인)
  rookieAge: { min: number; max: number; mode: number }; // triangular

  // 티켓파워/폼(공개)
  ticketPower: { baseFromCA: number; noiseSd: number; clamp: { min:number; max:number } };
  form: { mean: number; sd: number; clamp: { min:number; max:number } };

  // 성향(공개)
  traits: { loyalty: { mean:number; sd:number }; ambition: { mean:number; sd:number }; clamp:{min:number; max:number} };

  // CA/PA 분포(비노출)
  ca: {
    meanByGymRank: Record<1|2|3|4|5|6|7|8|9|10, number>;
    sd: number;
    clamp: { min:number; max:number };
  };
  pa: {
    addMean: number;     // PA = CA + addMean + noise
    addSd: number;
    clamp: { min:number; max:number };
  };

  // 에이징 피크(비노출)
  peakAge: { mean:number; sd:number; clamp:{min:number; max:number} };

  // hidden rating 초기화
  rating: { base:number; perCA:number; rdInit:number };

  // abilities(비노출, 1..20)
  abilities: {
    clamp: { min:number; max:number };
    // CA를 6개 능력치로 분배하는 계수
    weights: { strOff:number; strDef:number; grpOff:number; grpDef:number; cardio:number; chin:number };
    // 스타일 태그가 특정 능력치를 살짝 올리고 내리는 보정
    styleTagBoost: Record<string, Partial<Record<keyof GenerationBalance["abilities"]["weights"], number>>>;
  };

  // 공개 커리어 스탯(탭폴로지 느낌) 파생 계수
  publicStats: {
    // CA와 abilities를 기반으로 파생
    slpm: { base:number; perStrOff:number; noiseSd:number; clamp:{min:number; max:number} };
    sapm: { base:number; perStrDef:number; noiseSd:number; clamp:{min:number; max:number} };
    sigAcc: { base:number; perStrOff:number; noiseSd:number; clamp:{min:number; max:number} }; // 0..1
    sigDef: { base:number; perStrDef:number; noiseSd:number; clamp:{min:number; max:number} }; // 0..1

    tdPer15: { base:number; perGrpOff:number; noiseSd:number; clamp:{min:number; max:number} };
    tdAcc:  { base:number; perGrpOff:number; noiseSd:number; clamp:{min:number; max:number} }; // 0..1
    tdDef:  { base:number; perGrpDef:number; noiseSd:number; clamp:{min:number; max:number} }; // 0..1
    avgCtrlSec: { base:number; perGrpOff:number; noiseSd:number; clamp:{min:number; max:number} };

    subAttPer15: { base:number; perGrpOff:number; noiseSd:number; clamp:{min:number; max:number} };
    kdPerFight:  { base:number; perStrOff:number; noiseSd:number; clamp:{min:number; max:number} };

    // 부위 타격 비율(합 1)
    bodyRates: {
      base: { head:number; body:number; leg:number };
      // 스타일 태그가 head/body/leg 비율을 조금씩 이동
      styleShift: Record<string, { head?:number; body?:number; leg?:number }>;
      noiseSd: number;
    };
  };
};
````

권장 기본값(초기 제안, dev override로 튜닝 가능)

CA meanByGymRank: 1위 78, 2위 76, 3위 74, 4위 72, 5위 70, 6위 68, 7위 66, 8위 64, 9위 62, 10위 60

CA sd: 8~10 (스타 발생 여지)

PA addMean: 6, addSd: 6 (하위에서도 대박 포텐 가능)

숫자는 “초기값”이므로 바꿀 수 있지만, 키/구조는 바꾸지 않는다.

13. 경제 밸런스(원화) — src/balance/economy.ts
    목표: 티어별 “현실적인 파이트머니/흥행 규모”를 느낌 있게 구성하되, 실제 단체 고증에 가깝게 계단형 분포를 준다.

```ts
export type EconomyBalance = {
  // 이벤트 기본 규모(좌석/티켓단가/고정비/스폰서)
  tier: Record<
    1 | 2 | 3 | 4 | 5 | 6,
    {
      venue: { seats: number; ticketPrice: number }; // ₩
      fixedCost: number; // ₩
      sponsor: { base: number; maxAdd: number }; // ₩
      // 점유율 산정
      occupancy: { min: number; hypeDivisor: number; clampMax: number }; // 0..1
    }
  >;

  // 파이트머니 range(슬롯별 기본값은 tier×slot 계수)
  payout: {
    slotMultiplier: Record<
      | "MAIN_5R"
      | "CO_3R"
      | "UNDER_3R_1"
      | "UNDER_3R_2"
      | "UNDER_3R_3"
      | "UNDER_3R_4",
      number
    >;
    // 티어별 기본 파이트머니 “중앙값” (선수 가치에 따라 가감)
    baseByTier: Record<1 | 2 | 3 | 4 | 5 | 6, number>; // ₩
    // 선수 가치 반영(티켓파워/레코드/최근 성과 등 간단화)
    fighterValue: {
      ticketWeight: number;
      recordWeight: number;
      formWeight: number;
      clamp: { min: number; max: number };
    };
    // 지급액 노이즈
    noiseSdRatio: number;
    // 최소/최대 파이트머니(티어 공통 clamp)
    clamp: { min: number; max: number };
  };

  // 용병(임대) 비용
  mercenary: {
    fightMoneyMultiplier: number; // 예: 1.6
    loanFeeRatio: number; // 예: 0.2 (파이트머니의 20%)
  };
};
```

13.1 “현실적 티어별 파이트머니” 초기값(제안)
MVP 감성: Tier6 동네는 “수십~수백만”, Tier1은 “수천~수억(메인)” 느낌까지.

Tier6 baseByTier: ₩2,000,000

Tier5: ₩4,000,000

Tier4: ₩8,000,000

Tier3: ₩15,000,000

Tier2: ₩30,000,000

Tier1: ₩60,000,000
슬롯 multiplier 예:

MAIN_5R: 3.0

CO_3R: 1.8

UNDER*3R*\*: 1.0

“실제 고증”은 dev override로 점진 조정한다. 다만 구조/산식은 유지.

14. 매치메이킹 밸런스 — src/balance/matchmaking.ts
    목표: (1) 전문가 예상 승률 (2) 매치 흥행 점수 (3) 이벤트 전체 흥행 점수 산출

```ts
export type MatchmakingBalance = {
  expertPick: {
    // rating/ability 기반 승률 변환
    ratingDiffScale: number; // rating 차이를 승률로 변환하는 스케일
    parityBonus: { max: number }; // 너무 비등하면(50:50 근처) 약간 가산
    clamp: { minA: number; maxA: number }; // 예: 0.15..0.85
  };

  hype: {
    // 매치 흥행: 티켓파워 + 파리티(접전) + 스토리
    ticketPowerWeight: number;
    parityWeight: number;
    storyWeight: number;
    // 스토리 보너스(간단)
    story: {
      rematchBonus: number; // 리매치
      rankingAdjacentBonus: number; // 랭킹 근접(단체 내 TOP10 근처)
      rivalryBonus: number; // 라이벌(과거 자막/기록에서 플래그)
    };
    clamp: { min: number; max: number }; // 0..100
  };

  eventHype: {
    // 이벤트 흥행: 매치 흥행의 가중합
    slotWeight: Record<
      | "MAIN_5R"
      | "CO_3R"
      | "UNDER_3R_1"
      | "UNDER_3R_2"
      | "UNDER_3R_3"
      | "UNDER_3R_4",
      number
    >;
    clamp: { min: number; max: number }; // 0..200
  };
};
```

15. 경기 시뮬레이션 밸런스 — src/balance/simulation.ts
    목표: KO/TKO/SUB/DEC 결과 + 탭폴로지 통계 누적 + 문장형 자막 생성
    MVP에서는 “틱 기반(예: 6~10초 단위)”로 스냅샷을 쌓고, UI는 그걸 재생해도 된다.

```ts
export type SimulationBalance = {
  // 경기 진행
  tickSeconds: number; // 예: 8
  rounds: {
    main5R: { rounds: 5; secondsPerRound: number }; // 300
    threeR: { rounds: 3; secondsPerRound: number }; // 300
  };

  // 판정 점수 가중치(누적 스탯 기반)
  judging: {
    strikeWeight: number;
    takedownWeight: number;
    controlWeight: number;
    knockdownWeight: number;
  };

  // 피니시(확률/임계)
  finish: {
    // 공격/방어 능력치로 KO, SUB 발생 확률을 만든다
    ko: {
      base: number;
      strOffWeight: number;
      chinInvWeight: number;
      momentumWeight: number;
    };
    sub: {
      base: number;
      grpOffWeight: number;
      grpDefInvWeight: number;
      fatigueWeight: number;
    };
    // “압도”일 때 더 잘 끝나는 보정
    dominanceBoost: number;
    // clamp
    clampProb: { min: number; max: number };
  };

  // 통계 생성(틱마다 증가량 분포)
  stats: {
    strike: {
      baseAttemptsPerTick: number;
      accBase: number;
      accPerStrOff: number;
      defPerStrDef: number;
      headBodyLegFromRates: boolean; // true
    };
    takedown: {
      baseAttemptsPerTick: number;
      accBase: number;
      accPerGrpOff: number;
      defPerGrpDef: number;
      controlSecPerSuccessMean: number;
    };
    submission: { baseAttemptsPerTick: number; perGrpOff: number };
    knockdown: { basePerTick: number; perStrOff: number };
  };

  // 자막(문장형 중계) 템플릿 파라미터
  commentary: {
    // 사건 유형별 문장 템플릿 pool 크기(실제 문장 리스트는 story.ts에 둔다)
    cadence: { everyTicksMin: number; everyTicksMax: number };
    excitement: { hypeWeight: number; finishWeight: number };
  };

  // 경기 후 쿨다운 룰은 story.ts(연말/이적/은퇴와 같이 관리)
};
```

16. 랭킹/승강 밸런스 — src/balance/ranking.ts
    목표: fighter rating 업데이트(Elo-like) + inactivity(활동도) + PPI + 승강 제약

```ts
export type RankingBalance = {
  fighter: {
    elo: {
      kBase: number;
      kHypeWeight: number; // 큰 경기일수록 변동
      upsetBonus: number; // 언더독 승리 시 가산
      finishBonus: { ko: number; sub: number; dec: number }; // 피니시 보정
    };
    inactivity: {
      // 오래 쉬면 effectiveRating이 감소(승률/랭킹 계산용)
      divisorDays: number; // 예: 120
      minFactor: number; // 예: 0.75
      maxFactor: number; // 1.0
    };
  };

  promotionPPI: {
    topN: number; // 예: 25
    missingPenaltyRating: number; // topN 부족분 채움
    smoothing: { currentWeight: number; lastWeight: number }; // 예: 0.7/0.3
  };

  tierMove: {
    maxMovePerSeason: 1; // 절대 1
  };
};
```

17. 스토리/연말 밸런스 — src/balance/story.ts
    목표: 은퇴(35~45) 확률, 시장 이적(2~5%) 제약, 쿨다운 룰, 재계약 UI 규칙

```ts
export type StoryBalance = {
  yearEnd: {
    retirement: {
      minAge: 35;
      maxAge: 45;
      baseProbAt35: number; // 예: 0.03
      baseProbAt45: number; // 예: 0.25
      // 스타 보정: 티켓파워 높을수록 은퇴확률 감소(최대 감소율)
      starReductionMax: number; // 예: 0.25
    };

    transfer: {
      minRatio: number; // 0.02
      maxRatio: number; // 0.05
      upRatio: number; // 예: 0.70 (나머지 DOWN은 도미노로)
      // 상향 후보: 현재 단체 상위 15%만
      upCandidateTopPct: number; // 0.15
      // 하향 후보: 상위 단체 하위 15% 중 선택
      downVictimBottomPct: number; // 0.15
      // 이동은 최대 1티어(고정)
      maxTierStep: 1;
    };

    contractRenewal: {
      // 재계약 UI(심리전) — MVP 단순화 규칙
      // 선수 요구액은 "기존 fightMoney × (1 + 요구율)" 형태로
      demand: {
        baseRaise: number; // 예: 0.10 (기본 10% 인상 요구)
        ambitionWeight: number; // 야망이 높을수록 더 요구
        loyaltyWeight: number; // 충성심 높을수록 덜 요구(감산)
        tierGapWeight: number; // 상위티어 제안 받을수록 요구 증가
        clamp: { min: number; max: number }; // 예: 0.00..0.60
      };
      // 협상 턴(예: 1회 counter-offer)
      negotiation: { maxCounterOffers: number }; // 예: 1
      // 실패 시 이적/은퇴 확률(야망/나이로 가중)
      failOutcome: {
        retireBase: number; // 예: 0.05
        retireAgeWeight: number;
        transferBase: number; // 예: 0.80 (대부분 이적)
      };
    };
  };

  cooldown: {
    win: 0;
    lossDecision: [0, 1];
    lossKO_TKO: [1, 2];
    lossSUB: [0, 1];
  };

  commentaryLines: {
    // 실제 문장 템플릿 리스트는 uiText.ts 또는 story.ts 내부로 둔다(한국어)
    // 여기선 “카테고리 키”만 고정
    categories: Array<
      | "OPENING"
      | "STRIKE_EXCHANGE"
      | "BIG_HIT"
      | "KNOCKDOWN"
      | "TAKEDOWN"
      | "CONTROL"
      | "SUB_ATTEMPT"
      | "ROUND_END"
      | "DECISION"
      | "FINISH_KO"
      | "FINISH_SUB"
    >;
  };
};
```

18. 엔진 “구현 규칙(오판 방지용)” — systems/\*
    아래는 Cursor가 임의로 바꾸면 망하는 부분이다. 구현 시 그대로 따른다.

18.1 전문가 예상 승률(Expert Pick) 산식(고정)
입력:

effectiveRatingA, effectiveRatingB

effectiveRating = hidden.rating × inactivityFactor

변환:

pA = 1 / (1 + exp(-(ratingA - ratingB) / ratingDiffScale))

파리티 보너스:

parity = 1 - abs(pA - 0.5)\*2 (0..1)

pA = pA + (parity _ parityBonus.max) _ signToward(0.5)

단, 이 보너스는 “50:50 근처일수록 매치가 재밌다”는 흥행용 가산이며, 승패를 뒤집지 않는 작은 값으로 유지

clamp:

pA는 [minA, maxA]로 clamp

pB = 1 - pA

표기:

“전문가 예상 A 57% / B 43%”

확신 라벨 없음

18.2 매치 흥행 점수(matchHype, 0..100)
입력: 두 선수 ticketPower, parity, storyBonus(리매치/랭킹 인접/라이벌)

h = ticketAvg*ticketWeight + parity*parityWeight + story\*storyWeight

clamp 0..100

18.3 이벤트 흥행(eventHype, 0..200)
슬롯 가중합:

eventHype = Σ( slotWeight[slot] \* matchHype[bout] )

clamp 0..200

18.4 예상 점유율(occExpected, 0..1)
티어별:

occ = minOcc + (eventHype / hypeDivisor)

occ = clamp(occ, minOcc, clampMax)

18.5 예상 손익(₩)
수익:

티켓 = seats × ticketPrice × occ

스폰서 = sponsor.base + sponsor.maxAdd × clamp01(eventHype/200)

비용:

fixedCost

payout(총 파이트머니)

mercLoanFee(용병 임대료 합)

profit = ticket + sponsor - fixedCost - payout - mercLoanFee

18.6 파이트머니 산정(슬롯/티어/선수 가치)
base = economy.payout.baseByTier[tier] × slotMultiplier[slot]

valueFactor = clamp(
1 + ticketWeight*(ticketAvg-50)/50 + recordWeight*(winRate-0.5) + formWeight\*(form-50)/50,
clamp.min, clamp.max
)

fightMoney = clamp( round(basevalueFactor(1+noise)), clamp.min, clamp.max )

noise = gaussian(0, noiseSdRatio)

19. 경기 시뮬(관전/통계/자막) 구현 규칙
    19.1 입력
    Fighter A/B (abilities, publicStats, form, ticketPower)

Bout context (slot, rounds, eventHype)

19.2 진행(틱 기반)
totalTicks = rounds\*secondsPerRound / tickSeconds

매 틱마다:

타격 시도/성공: strOff vs strDef, form/피로 반영

테이크다운 시도/성공: grpOff vs grpDef

성공 시 컨트롤 타임 누적

서브 시도 누적

다운 이벤트 확률 누적

피로(fatigue):

cardio 낮을수록 후반 틱에서 정확도/방어력 저하

19.3 피니시(KO/SUB) 체크
매 틱 또는 라운드 중간에 피니시 확률 계산:

KO: strOff, 상대 chin(역가중), 최근 momentum, dominance

SUB: grpOff, 상대 grpDef(역가중), fatigue, dominance

확률 clamp 후 rng로 발생 결정

발생 시 즉시 종료, resultType KO_TKO 또는 SUB

19.4 판정(DEC)
3R/5R 종료 후 judging 가중치로 점수 산정:

strikeScore + takedownScore + controlScore + knockdownScore

승부가 너무 자주 뒤집히지 않도록 작은 노이즈만 허용

19.5 자막(문장형)
사건 기반 템플릿을 story.commentaryLines 카테고리로 관리

매 cadence.everyTicksMin~Max 틱마다 1줄 생성 + 큰 이벤트(다운/피니시/서브시도 성공) 때 즉시 생성

출력은 한국어 문장, 선수 표기는 닉네임

20. 시즌 종료(연말) 엔진 규칙 — runSeasonEnd (고정 파이프라인)
    이 순서와 제약을 절대 바꾸지 않는다.

20.1 연말 파이프라인(순서 고정)
계약 만료 표시(모든 계약 isExpired=true)

은퇴 처리(35~45 확률)

은퇴자 수만큼 “같은 체육관”에서 루키 생성 → FA로 편입

재계약 UI 결과 반영(플레이어 단체만 UI로 처리)

시장 이적 2~5%(도미노 1단, 1티어 제한)

PPI 계산 → 단체 랭킹 → 승강(1티어 제한)

다음 시즌 이벤트 수 재설정

20.2 은퇴 확률(고정 형태)
age<35: 0

35~45: 선형 증가

p = lerp(baseProbAt35, baseProbAt45, t)

t=(age-35)/10

스타 보정:

p _= (1 - starReductionMax _ clamp01(ticketPower/100))

20.3 루키 생성(고정)
은퇴한 파이터의 gymId를 그대로 사용

나이: triangular(rookieAge)

CA/PA: generation 분포로 생성

promotionId="FA", isFA=true

500명 유지

20.4 시장 이적(2~5%) — “아사리판 방지” 구현 요건
targetMoves = round(500 \* U(minRatio..maxRatio))

UP 후보:

Tier 2~6 단체에서만 (Tier1은 UP 불가)

단체 내 effectiveRating 상위 upCandidateTopPct(=15%)만 후보

score = effectiveRating - tierMedianEffectiveRating

score 높은 순으로 선발, 총 UP quota = floor(targetMoves\*upRatio)

UP 목적지:

정확히 1티어 상위로만(toTier = fromTier-1)

목적지 단체는 같은 체급이 부족한 단체 우선

DOWN(도미노 1단):

UP이 발생한 목적지 단체에서 하위 downVictimBottomPct(=15%) 중 1명 선택

그 선수는 정확히 1티어 하위로만 이동

제약:

같은 선수는 연말에 1번만 이동

“반드시 존재하는 다른 단체”로만 이동

이동 후 선수는 isFA=false

기록:

state.market.lastSeasonTransfers에 모두 기록

21. PPI/승강 엔진 규칙 — promotionRankEngine (고정)
    21.1 effectiveRating
    inactivityFactor:

factor = clamp(1 - daysSinceLastFight/divisorDays, minFactor, maxFactor)

effectiveRating = hidden.rating \* factor

21.2 PPI 산출
각 단체에서 fighters를 effectiveRating 내림차순 정렬

topN만 평균

부족분은 missingPenaltyRating으로 채워 평균

스무딩:

ppi = currentWeightcur + lastWeightlastYearPPI

21.3 승강(티어 재배정)
12개 단체를 PPI 내림차순 정렬 → rank1..12

티어 배정:

rank 1~2: Tier1

3~4: Tier2

5~6: Tier3

7~8: Tier4

9~10: Tier5

11~12: Tier6

단, “한 시즌 최대 1티어 이동 제한”:

lastYearTier가 있을 경우, nextTier는 lastYearTier에서 ±1까지만 허용

제한에 걸리면 nextTier를 보정(가장 가까운 허용 티어로)

22. Supabase DB 구조(최종 확정 SQL + RLS)
    MVP는 Save Snapshot이 핵심이므로 mma_saves가 필수.
    아래 SQL을 supabase/migrations/\*.sql로 그대로 적용한다.

22.1 (선택) profiles (이미 있으면 생략)

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "profiles read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles upsert own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);
```

22.2 mma_saves (필수)

```sql
create table if not exists public.mma_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  slot int not null,                           -- 1..N
  title text not null default 'Save',

  game_version int not null default 1,         -- 앱 버전
  save_version int not null default 1,         -- GameState schema version
  state jsonb not null,                        -- GameState 전체 저장

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id, slot)
);

create index if not exists idx_mma_saves_user on public.mma_saves(user_id);

alter table public.mma_saves enable row level security;

create policy "mma_saves read own" on public.mma_saves
  for select using (auth.uid() = user_id);

create policy "mma_saves insert own" on public.mma_saves
  for insert with check (auth.uid() = user_id);

create policy "mma_saves update own" on public.mma_saves
  for update using (auth.uid() = user_id);

create policy "mma_saves delete own" on public.mma_saves
  for delete using (auth.uid() = user_id);
```

22.3 mma_leaderboard (옵션)

```sql
create table if not exists public.mma_leaderboard (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  best_tier int not null default 6,
  best_cash bigint not null default 0,
  best_year int,
  updated_at timestamptz default now()
);

alter table public.mma_leaderboard enable row level security;

create policy "mma_leaderboard read all" on public.mma_leaderboard
  for select using (true);

create policy "mma_leaderboard insert own" on public.mma_leaderboard
  for insert with check (auth.uid() = user_id);

create policy "mma_leaderboard update own" on public.mma_leaderboard
  for update using (auth.uid() = user_id);
```

23. Supabase 프론트 API 함수 명세 — src/supabase/savesApi.ts
    Cursor가 임의로 API를 바꾸지 않도록 함수명/동작을 고정한다.

필수 함수:

listSaves(): Promise<Array<{slot:number; title:string; updated_at:string}>>

loadSave(slot:number): Promise<GameState | null>

upsertSave(slot:number, title:string, state:GameState): Promise<void>

deleteSave(slot:number): Promise<void>

규칙:

upsert 시 updated_at이 갱신되도록 업데이트(서버 timestamp)

저장 전 state.meta.updatedAt 갱신(클라이언트)

save_version이 낮으면 save/migrations.ts로 마이그레이션 후 로드

24. UI 화면별 “필수/금지” 체크리스트(오판 방지)
    24.1 Home(대시보드) — 필수
    현재 연도(year), 티어(tier), 현금(cash), 팬베이스(fanbase)

시즌 진행도(eventsCompleted/eventsPlanned)

다음 이벤트 버튼(매치메이킹 진입)

12개 단체 랭킹 요약(티어/순위/PPI)

금지:

타 단체 경기 관전 버튼/링크

24.2 Roster — 필수
체급 필터(FW/LW/WW/MW)

정렬: ticketPower / record / form / cooldown

선수 상세: 한국어 지표명 탭폴로지 커리어 스탯 표시

금지:

CA/PA/rating/RD/peakAge/abilities 노출

24.3 Matchmaking — 필수(가장 중요)
6개 슬롯 고정(UI에서 슬롯이 보이게)

각 매치업:

전문가 예상 승률(%) 2개

매치 흥행 점수(matchHype)

파이트머니(양 선수 합/또는 개별)

용병이면 “용병” 표시(단, 과도한 라벨/확신표현 금지)

이벤트 전체:

예상 점유율

티켓/스폰서/고정비/총 파이트머니/임대료/예상 손익(₩)

“확정” 버튼 → status CONFIRMED

금지:

확신 라벨(“확실/강추/안전픽” 등)

경기 결과 예측 문장(승률 외 과한 단정)

24.4 EventWatch(관전) — 필수(형태 고정)
좌/우 선수 사진 + 닉네임

중앙 누적 통계(부위 타격/TD/컨트롤/서브/다운)

하단 문장형 자막 feed

결과 후:

결과 타입(KO/TKO, SUB, DEC)

재무 반영(현금 변화)

쿨다운 반영

기록 저장(로그/스냅샷)

24.5 League — 필수
12개 단체 랭킹 테이블(PPI/티어/순위)

단체별 체급 랭킹 TOP10(통계 기반)

타 단체 경기 “관전”은 없음(통계만)

24.6 SeasonEnd — 필수
재계약 UI:

선수별 요구액(₩)

제안액 입력/선택

1회 counter-offer(설정값)

실패 시 결과(이적/은퇴) 표시

은퇴/루키 목록

시장 이적 리포트(2~5% 요약, from/to/reason)

승강 결과(티어 변화)

24.7 Settings — 필수
Save 슬롯 리스트/저장/불러오기/삭제

DEV 모드(환경변수로 제어):

balance override JSON 입력/적용/리셋/복사

25. 완료 기준(DoD) — MVP 최종
    새 게임 시작 → 매치메이킹 → 관전 → 재무/전적/쿨다운 반영

시즌 이벤트 수(티어별 4/5/6)만큼 진행 가능

연말:

은퇴(35~45) + 동일 체육관 루키 생성(FA)

시장 이적 2~5%(1티어, 도미노 1단)

PPI 승강(1티어 제한)

Supabase:

본인 RLS로 세이브 CRUD 정상

DEV:

밸런스 override 적용/리셋/복사 가능

(Part 2 끝)

<!-- Chat log removed -->

# MMA 프로모션 매니저 (가칭) — SPEC 최종보스 v2.0 (Cursor 단일 컨텍스트)

## Part 3/3 — 구현 착수 프롬프트/초기 데이터/자막 템플릿/테스트·가드레일/작업 순서

> Part 1~2를 전제로 한다. Part 3는 “개발을 바로 시작”하기 위한 실행 지침과 오판 방지 장치를 제공한다.
> 이 문서(Part1~3)는 하나로 합쳐서 사용해도 된다.

---

## 26. “Cursor 1번 프롬프트” (첫 커밋 작업 지시문)

> 아래 문장을 Cursor(또는 antigravity)에게 그대로 붙여넣어 1st commit을 만든다.
> Cursor는 임의 설계 금지, 이 SPEC을 정본으로만 구현한다.

### 26.1 1번 프롬프트(그대로 복붙)

- 목표: **프로젝트 뼈대 + 새 게임 생성 + 저장/불러오기 + 매치메이킹 화면에서 전문가 예상/손익 계산 표시**까지 “빌드 가능한 상태”로.
- 아직 관전 시뮬은 stub 가능(단, 인터페이스는 확정)

[작업 지시]
이 레포는 "MMA 프로모션 매니저 SPEC v2.0 (Part1~3)"을 정본으로 한다.
임의 추측/자의적 설계를 금지한다. 숫자 하드코딩 금지. 밸런스는 src/balance/\*에만 존재한다.

Vite + TS + React(권장)로 프로젝트 초기화.

폴더 구조를 SPEC 6.1 그대로 생성한다.

src/balance/\* 파일들을 "키 스키마 그대로" 만들고, 각 파일에 합리적인 초기값을 넣는다(Part2 참고).

src/domain/types.ts/state.ts/constants.ts를 SPEC의 타입 구조로 만든다.

src/systems/bootstrapEngine.ts 구현:

12 프로모션 생성(초기 tier 지정), 10 gym 정의 로드

500명 fighter 생성 (각 gym 50명, CA/PA 비노출, 공개스탯 파생)

모든 fighter에 1년 계약(기본 파이트머니 산식으로 초기화)

playerPromotionId는 Tier6의 2개 중 1개를 "prom*player"로 설정하고 나머지는 prom_ai*\*

시즌 이벤트 수는 tier별 규칙(4/5/6)로 생성하되, 우선 PLANNING 상태로 events 배열만 채운다(경기 구성은 Matchmaking에서 생성)

src/systems/matchmakingEngine.ts 구현:

expertPick 산식(Part2 18.1)

matchHype/eventHype 산식(Part2 18.2~18.3)

src/systems/economyEngine.ts 구현:

예상 점유율/손익 산식(Part2 18.4~18.5)

파이트머니 산식(Part2 18.6)

UI 최소 3개 화면 구현:

Home: 연도/티어/현금/진행도 + "매치메이킹" 버튼

Matchmaking: 6 슬롯 고정 + 선수 선택 드롭다운(로스터에서 선택) + 각 슬롯에 전문가 예상/흥행/파이트머니 표시
그리고 이벤트 전체 예상손익 패널 표시(티켓/스폰서/고정비/총파이트머니/임대료/손익)

Settings: Supabase 연결 상태 확인 + Save 슬롯 저장/불러오기 UI(스텁 가능)

Supabase:

src/supabase/client.ts 생성, env(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) 기반 init

src/supabase/savesApi.ts에 list/load/upsert/delete 함수 "명세대로" 생성(실제 호출까지 연결)

RLS/SQL은 supabase/rls.sql 파일로 넣고, 문서 Part2의 SQL을 그대로 저장한다.

Build가 깨지지 않도록 타입에러/런타임 최소화.

아직 fightSimEngine/EventWatch는 stub로 두되, 인터페이스(입력/출력 타입)는 Part2 규격에 맞춰 미리 정의한다.

작업 후:

변경된 파일 목록

실행 방법(npm install, npm run dev)

남은 TODO(spec-confirm) 목록
을 간단히 보고한다.

---

## 27. 초기 데이터(Seed/고정 리스트) — promotions.ts / gyms.ts

> Cursor가 이름/ID를 제멋대로 만들지 않게 ID 체계를 고정한다.

### 27.1 Promotion ID 규칙(고정)

- 플레이어 단체: `prom_player`
- AI 단체: `prom_ai_01` ~ `prom_ai_11`

### 27.2 Promotion 초기 목록(예시 명칭, 변경 가능하나 ID/티어 구조는 유지)

- Tier1: prom_ai_01, prom_ai_02
- Tier2: prom_ai_03, prom_ai_04
- Tier3: prom_ai_05, prom_ai_06
- Tier4: prom_ai_07, prom_ai_08
- Tier5: prom_ai_09, prom_ai_10
- Tier6: prom_player, prom_ai_11

> 단체명은 가칭이며 자유롭게 바꿔도 되지만, 티어 배치/ID는 고정.

### 27.3 Gym ID 규칙(고정)

- `gym_usa_major`, `gym_bra_major`, `gym_rus_major`, `gym_jpn_major`, `gym_kor_major`
- `gym_usa_minor`, `gym_bra_minor`, `gym_rus_minor`, `gym_jpn_minor`, `gym_kor_minor`

Gym 명칭/태그는 Part1 5.1 고정:

- USA Major: American Peak Team (ALL_ROUND, COUNTER_RANGE)
- BRA Major: Chute Boxe Atelier (PRESSURE_BRAWL, ALL_ROUND)
- RUS Major: Akhmat Fight Camp (WRESTLE_CTRL, ALL_ROUND)
- JPN Major: Krazy Bii Tokyo (COUNTER_RANGE, KICK_LEG)
- KOR Major: GoldenCombat (KICK_LEG, PRESSURE_BRAWL)
- USA Minor: Jaxson Wink Lab (COUNTER_RANGE, ALL_ROUND)
- BRA Minor: Brazilian RKO (BJJ_SUB, WRESTLE_CTRL)
- RUS Minor: Red Devil Combat Club (WRESTLE_CTRL, PRESSURE_BRAWL)
- JPN Minor: Palaestra Tokyo (BJJ_SUB, COUNTER_RANGE)
- KOR Minor: WatchaClub (PRESSURE_BRAWL, KICK_LEG)

---

## 28. Matchmaking UI “선수 선택” 구현 규칙(오판 방지)

> MVP에서 선수 선택은 “로스터에서 뽑는 방식”으로 단순화한다.

### 28.1 드롭다운 규칙

- 슬롯마다 A/B를 고른다.
- 선택 가능 선수 제한:
  - 플레이어 단체 소속 + cooldown=0 우선
  - 부족하면 FA를 영입하는 UX(즉시 계약) 또는 용병(임대) 선택을 제공할 수 있음
  - 단, MVP 1차는 “player 소속 + cooldown=0”만으로도 OK (부족 시 TODO)

### 28.2 용병 선택(선택 구현)

- 용병을 선택하면 isMercenary 플래그 표시
- 파이트머니/임대료를 finance에 포함
- 용병은 경기 후 원소속으로 복귀(시뮬 완료 후 처리)

---

## 29. 재계약 UI(연말) MVP 상세 규격

> “훈련” 대신 재계약에 집중한다. 단, 복잡 계약은 금지.

### 29.1 화면 구성

- 선수 리스트(만료 대상)
- 각 선수:
  - 현재 파이트머니(₩)
  - 요구액(₩) = 현재 × (1 + demandRatio)
  - 제안액 입력(₩) 또는 버튼(요구 수락/10% 낮게/20% 낮게)
  - counter-offer(최대 1회)
- 결과:
  - 성공: 새 계약 생성
  - 실패: 다른 단체 이적 또는 은퇴(확률)

### 29.2 요구율(demandRatio) 산식(고정 형태)

- baseRaise
- - ambitionWeight \* (ambition-50)/50
- - loyaltyWeight \* (loyalty-50)/50
- - tierGapWeight \* (상위티어 제안 가능성 proxy)
- clamp(min..max)

> “상위티어 제안 가능성”은 MVP에서 간단히:

- fighter effectiveRating이 현 티어 평균 대비 높으면 +, 낮으면 - (전부 balance로 계수화)

---

## 30. 문장형 자막(한국어) — 템플릿 샘플(최소 80줄 풀)

> 목적: 관전 화면에서 “진짜 중계처럼” 보이게 한다.
> 구현: 카테고리별 문자열 배열을 두고, 상황에 맞게 랜덤 선택.
> 규칙: 닉네임만 사용. 확신/강추 같은 메타 라벨 금지.

### 30.1 OPENING(10)

- "{A}와 {B}, 오늘 분위기 심상치 않습니다."
- "초반 탐색전, {A}가 먼저 거리 재봅니다."
- "{B}가 천천히 앞으로 걸어 나옵니다."
- "서로 가드 올리고, 일단은 타이밍 싸움이네요."
- "{A}의 눈빛이 꽤 날카로운데요."
- "관중 반응 뜨겁습니다. 이제 시작입니다."
- "{B}, 발이 가볍습니다."
- "{A} 쪽에서 먼저 페인트를 섞어주네요."
- "케이지 중앙에서 맞붙습니다."
- "첫 교전, 누가 먼저 흐름 잡을까요?"

### 30.2 STRIKE_EXCHANGE(12)

- "{A} 잽이 들어갑니다!"
- "{B}가 카운터를 노리는데요."
- "{A}가 연타로 압박합니다."
- "{B}가 각도 바꾸면서 빠져나가요."
- "서로 한 방씩 교환합니다."
- "{A}의 바디 샷, 묵직합니다."
- "{B} 로킥을 누적시키는 선택입니다."
- "{A}가 거리 좁히고, 손이 먼저 나갑니다."
- "{B}가 고개 흔들면서 피하네요."
- "{A}가 페인트 뒤에 오른손!"
- "{B}가 체크 훅으로 받아쳤습니다."
- "타격전, 템포가 빨라지고 있습니다."

### 30.3 BIG_HIT(10)

- "오, {A}의 큰 한 방이 스쳐갑니다!"
- "{B}가 순간적으로 흔들렸어요!"
- "{A}가 정확히 맞췄습니다!"
- "{B} 얼굴에 충격이 실렸습니다."
- "이거 위험합니다, {B}가 뒤로 물러납니다."
- "{A}가 기회를 봅니다."
- "{B}도 바로 맞받아치네요!"
- "한 방 한 방에 경기 흐름이 달라질 수 있어요."
- "관중이 탄성을 질렀습니다!"
- "방금 건 분명히 임팩트가 있었어요."

### 30.4 KNOCKDOWN(8)

- "{B} 다운! {A}가 따라 들어갑니다!"
- "다운 나왔습니다! 케이지가 흔들리네요!"
- "{A}가 무너뜨렸어요!"
- "{B}가 급하게 가드 올립니다!"
- "여기서 끝낼 수 있나요?"
- "{A}가 파운딩으로 몰아붙입니다!"
- "{B}가 버팁니다, 버텨야 합니다!"
- "위기입니다, 지금이 고비예요!"

### 30.5 TAKEDOWN(8)

- "{A} 테이크다운 시도… 성공!"
- "{B}가 균형 잃고 넘어갑니다."
- "{A}가 타이밍 좋게 들어갔어요."
- "{B}가 스프롤로 막으려 했는데요."
- "그라운드로 갑니다!"
- "{A}가 상위 포지션 잡았습니다."
- "{B}가 일어나려 하지만 쉽지 않아요."
- "{A}가 컨트롤 시간을 늘려갑니다."

### 30.6 CONTROL(8)

- "{A}가 포지션 안정적으로 가져갑니다."
- "컨트롤 타임이 쌓이고 있어요."
- "{B}가 힙 이스케이프를 시도합니다."
- "{A}가 압박을 유지합니다."
- "{B}가 벽을 짚고 일어서려 하는데요."
- "{A}가 다시 눌러놓습니다."
- "지금은 {A} 페이스입니다."
- "{B}가 답답해 보이네요."

### 30.7 SUB_ATTEMPT(8)

- "{A} 서브미션 시도 들어갑니다!"
- "{B}가 팔을 빼야 해요!"
- "목을 노리는 움직임, 위험합니다!"
- "{A}가 각도를 만들었습니다."
- "{B}가 침착하게 방어합니다."
- "이거 잠길 수도 있어요!"
- "{B}가 간신히 빠져나옵니다!"
- "{A}가 포기하지 않고 계속 압박합니다."

### 30.8 ROUND_END(8)

- "라운드 종료! 숨 고를 시간입니다."
- "1라운드 마무리, {A}가 조금 앞서 보이네요."
- "팽팽합니다. 코너의 지시가 중요하겠어요."
- "{B}가 마지막에 좋은 장면을 만들었습니다."
- "라운드 끝, 체력 관리가 변수입니다."
- "관중도 판단이 갈릴 것 같아요."
- "다음 라운드에서 승부가 날 수도 있습니다."
- "코너로 돌아갑니다!"

### 30.9 DECISION(8)

- "판정으로 갑니다. 채점이 중요하겠네요."
- "타격과 컨트롤, 어느 쪽이 더 크게 평가될까요?"
- "접전입니다. 결과가 궁금합니다."
- "한두 장면 차이였을 수도 있어요."
- "심판 채점표를 기다립니다."
- "오늘 경기, 확실히 볼거리가 있었습니다."
- "판정 발표 들어갑니다."
- "자, 승자는…"

### 30.10 FINISH_KO / FINISH_SUB(8)

- "끝났습니다! {A}가 마무리합니다!"
- "KO/TKO! {A}가 끝냈어요!"
- "{B} 움직임이 멈췄습니다. 종료!"
- "{A}가 결정적인 한 방을 꽂았습니다!"
- "탭! {B}가 탭을 칩니다!"
- "서브미션 성공! {A}가 잠갔습니다!"
- "{B}가 버티지 못합니다. 끝!"
- "완벽한 마무리, {A}의 승리입니다!"

> 위 템플릿은 최소치 예시다. 카테고리별 20줄 이상으로 늘리는 건 추후 가능.
> MVP는 위 정도로도 “중계 느낌”이 난다.

---

## 31. 오판 방지 가드레일(런타임 체크/검증)

> Cursor가 논리 실수로 규칙을 깨지 않게 “검증 함수”를 둔다.

### 31.1 `src/domain/validators.ts` 필수 체크(런타임)

- fighters count == 500
- gyms count == 10, each gym fighter count == 50
- promotions count == 12, tiers distribution == 2 per tier
- season.eventsPlanned matches tier rule(4/5/6)
- contract year boundaries are 1/1~12/31
- transfers ratio within 2~5% on year-end
- tier move per promotion <= 1

> validate 실패 시 DEV 모드에선 console.error + 화면에 경고(크래시 방지),
> PROD에선 최소한 로드/세이브 중단.

---

## 32. QA/테스트 체크리스트(최소)

### 32.1 스모크 테스트(수동)

1. 새 게임 시작 → Home 표시 정상(연도/티어/현금/진행도)
2. Matchmaking 진입 → 6 슬롯 보임
3. 선수 선택 → 전문가 예상/파이트머니/이벤트 손익 갱신
4. Save 슬롯 저장 → 새로고침 → load 성공
5. 시즌 이벤트 수만큼(4/5/6) 진행 상태가 증가하는지(스텁이어도)
6. DEV 밸런스 override 적용 시 UI 숫자 변동 반영

### 32.2 규칙 테스트(자동/간단)

- bootstrap 후 validateGameState 통과
- yearEnd 실행 후:
  - 500 유지
  - 2~5% 이동
  - 1티어 제한 통과

---

## 33. 실제 구현 “2번 프롬프트”(관전/시뮬/연말 완성용)

> 1번 프롬프트 완료 후, 다음 작업을 위한 지시문.

[작업 지시 - 2단계]

fightSimEngine.ts 구현:

Part2의 tick 기반 시뮬로 KO/SUB/DEC 생성

stats/log/snapshots 생성

EventWatch 화면 구현(Part2 UI 규격 고정):

좌/우 사진+닉네임

중앙 통계(부위/TD/컨트롤/서브/다운)

하단 문장형 자막 재생

시즌 진행:

이벤트 확정 → simulateBout → FINISHED 처리

경기 후: 전적/쿨다운/현금 반영

seasonEngine.ts 구현(runSeasonEnd):

은퇴(35~45)+루키(동일 gym)

시장 이적 2~5%(도미노 1단, 1티어 제한)

PPI/승강(1티어 제한)

다음 시즌 이벤트 수 재생성

SeasonEnd 화면 구현:

재계약 UI(최대 counter 1회)

은퇴/루키/이적/승강 리포트

validators 강화 + 간단 테스트 추가
작업 후 변경 파일/핵심 로직 위치/테스트 방법 보고

---

## 34. 마지막 정리(이 문서 세트의 적용 방식)

- Cursor 컨텍스트에는 Part1~3을 합친 단일 md로 넣는다.
- 개발 중 숫자 조정은 `src/balance/*`만 수정한다.
- 규칙 변경이 필요하면 먼저 SPEC을 업데이트하고 그 뒤 코드 변경.

---

(Part 3 끝 / SPEC v2.0 완료)

```

```
