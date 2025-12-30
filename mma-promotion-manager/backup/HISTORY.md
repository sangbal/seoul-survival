# HISTORY — MMA 프로모션 매니저 (ClickSurvivor Subgame)

정본: SPEC 최종보스 v2.0 (단일 파일)

## Log Format

- 날짜: YYYY-MM-DD
- 버전: v0.x.x
- 범위: (bootstrap, matchmaking, economy, ui, supabase, balance, hub-integration)
- 변경유형: [ADD] [FIX] [REFINE] [BREAKING]
- 요약: 한 줄
- 상세:
  - 무엇을 했는지
  - 왜 했는지
  - 영향 범위
- SPEC 영향:
  - (변경 없음) 또는
  - (SPEC 변경) Before/After + 이유
- TODO(spec-confirm):
  - 결정 필요 항목
- 변경 파일 목록:
  - path: 핵심 변경 요약

## Logs

## [v0.1.1] - 2025-12-31 (Improvised Guardrails)

- **TBD Safe Defaults**: To prevent guesswork on missing specs, formatting, or behavior, the following strict rules were applied:
  - **Event Weights**: Fixed to `WW, LW, FW, LW, WW, MW` permanently for v0.1.x. No random generation.
  - **Matchmaking Constraints**: Strict block on Cooldown > 0 and Duplicate checks.
  - **Mercenaries**: Feature stubbed (UI hidden, logic dormant).
  - **Bankruptcy**: Negative cash permitted, but blocks creation of specific _future_ events until resolved.
  - **Fanbase**: Growth frozen (static) for MVP stability.
  - **Time**: Fixed 3-week (`+21 days`) interval between events.

## [v0.1.0] - 2025-12-31

- **UI Architecture**: Implemented React `Layout`, `Card`, `BoutCard` components for "Data Dashboard" vibe.
- **Screens**:
  - `Home`: Dashboard with 3-card summary and League Rankings.
  - `Matchmaking`: 2-column layout with 6-bout slots, Fighter Select, and Financial Forecast.
  - `Roster`: Filterable list (Weight Class, Sort) with public stats only.
  - `League`: Global Promotion Rankings and Top 10 Fighter lists.
  - `Settings`: Basic Save/Reset functionality.
- **Policy Enforcement**: Strictly validated that no CA/PA/Hidden stats are rendered in the UI.

## [v0.0.1] - 2024-12-2831) - Project Initialization & Core Framework

### 🚀 New Features

- **Project Structure**: Created `mma-manager/` with defined folder structure (`src/balance`, `domain`, `systems`, `ui`).
- **Hub Integration**: Added "MMA Promotion Manager" card to the main landing page.
- **Core Logic**:
  - `bootstrapEngine`: Generates 12 promotions, 10 gyms, 500 fighters (with hidden CA/PA/Abilities), and initial contracts.
  - `balance`: Implemented full schema for Generation, Economy, Matchmaking, Simulation, Ranking, Story, Gyms, Promotions, and UiText.
  - `matchmakingEngine`: Expert pick prediction (sigmoid + parity), Match Hype calculation, and Event Hype.
  - `economyEngine`: Ticket sales, sponsors, fixed costs, and fight money estimation.
- **UI (MVP)**:
  - `Home`: Dashboard with Year, Tier, Cash, Fanbase, and Tier Rankings.
  - `Matchmaking`: 6-slot bout planner with fighter selection, expert picks display, and financial forecast.
  - `Settings`: Placeholder for Save/Load.
- **Persistence**: Supabase client setup, Saves API (list/load/upsert/delete), and RLS SQL schema.

### 🐛 Bug Fixes

- None (Initial Release)

### ⚠️ Known Issues

- **Dependency Managed**: `react` and `react-dom` have been successfully installed.
- Simulation Engine is stubbed (no fight results yet).
- UI is basic styling, inheriting `uniform-core.css`.

### 📝 Notes

- Followed Spec v2.0 strictly.
- Used local UUID generator to avoid extra dependency issues.
