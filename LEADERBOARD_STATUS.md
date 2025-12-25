# 리더보드 시스템 현황 브리핑

## 1. 데이터베이스 스키마

### 테이블 구조 (`supabase/leaderboard.sql`)
- **컬럼**: `id`, `user_id`, `game_slug`, `nickname`, `total_assets`, `play_time_ms`, `tower_count`, `updated_at`, `created_at`
- **제약조건**: `(user_id, game_slug)` UNIQUE
- **인덱스**: 
  - `idx_leaderboard_game_slug_total_assets`: 자산 기준 정렬
  - `idx_leaderboard_game_slug_play_time`: 플레이타임 기준 정렬
  - `idx_leaderboard_ranking`: 프레스티지 순위 (tower_count DESC, total_assets DESC)

### RLS 정책
- `leaderboard_select_all`: 모든 사용자 읽기 가능
- `leaderboard_insert_own`: 본인 레코드만 INSERT
- `leaderboard_update_own`: 본인 레코드만 UPDATE
- `leaderboard_delete_own`: 본인 레코드만 DELETE

### RPC 함수
- `get_my_rank(p_game_slug, p_nickname, p_sort_by)`: 내 순위 조회
  - `assets` 정렬: `tower_count DESC, total_assets DESC`
  - `playtime` 정렬: `play_time_ms DESC`
  - 반환값: `rank`, `nickname`, `total_assets`, `play_time_ms`, `tower_count`

---

## 2. 클라이언트 코드 구조

### 2.1 공유 모듈 (`shared/leaderboard.js`)

#### `updateLeaderboard(nickname, totalAssets, playTimeMs)`
- **현재 상태**: 타워 개수 파라미터 없음
- **구현 방식**: `upsert` 사용 (RLS 충돌 가능성)
- **문제점**: 
  - 타워 개수를 저장하지 않음
  - `upsert`가 RLS 정책과 충돌할 수 있음

#### `getLeaderboard(limit, sortBy)`
- **기능**: Top N 리더보드 조회
- **정렬 옵션**: `assets`, `playtime`
- **반환값**: `nickname`, `total_assets`, `play_time_ms`, `updated_at`
- **문제점**: `tower_count`를 조회하지 않음

#### `getMyRank(nickname, sortBy)`
- **기능**: 내 순위 조회 (RPC 호출)
- **반환값**: `rank`, `nickname`, `total_assets`, `play_time_ms`, `tower_count`
- **상태**: 정상 작동

#### `isNicknameTaken(nickname)`
- **기능**: 닉네임 중복 확인 (대소문자 무시)
- **상태**: 정상 작동

---

### 2.2 게임 로직 (`seoulsurvival/src/main.js`)

#### `saveGame()` (3468줄)
- **리더보드 업데이트 조건**:
  - 닉네임이 있을 때만
  - 30초마다 (`window.__lastLeaderboardUpdate` 체크)
- **호출 방식**: `updateLeaderboardEntry()` (비동기, await 없음)
- **문제점**: 
  - 타임스탬프를 즉시 업데이트하여 실제 업데이트 완료 전에 다음 호출이 차단될 수 있음

#### `updateLeaderboardEntry()` (6339줄)
- **현재 구현**: 간단한 버전
- **전달 파라미터**: `nickname`, `totalAssets`, `totalPlayTimeMs`
- **문제점**: 
  - 타워 개수(`towers`)를 전달하지 않음
  - 에러 핸들링이 부족함
  - 로깅이 부족함

#### 타워 구매 시 리더보드 업데이트 (6442줄)
- **위치**: `elBuyTower` 이벤트 리스너
- **구현**: 
  ```javascript
  await updateLeaderboard(
    playerNickname,
    totalAssets,
    totalPlayTimeMs,
    towers  // 타워 개수 전달
  );
  ```
- **문제점**: 
  - `shared/leaderboard.js`의 `updateLeaderboard`가 타워 개수 파라미터를 받지 않음
  - 타워 구매 후에도 계속 업데이트되어야 하는데, 현재는 타워 구매 시점에만 업데이트

#### 리더보드 UI (`updateLeaderboardUI()`, 6038줄)
- **기능**: 통계 탭에서 리더보드 표시
- **표시 항목**: 순위, 닉네임, 자산, 플레이타임
- **문제점**: 
  - 타워 개수(`tower_count`)를 표시하지 않음
  - 내 순위 카드에도 타워 개수 표시 없음

---

## 3. 동기화 스크립트 (`supabase/sync-leaderboard-from-saves.sql`)

### 기능
- `game_saves` 테이블의 저장 데이터를 읽어서 리더보드에 동기화
- 누락된 기록은 INSERT, 기존 기록은 UPDATE

### 문제점
- **자산 계산 로직이 잘못됨**: 고정 배수 사용
  ```sql
  deposits * 1000000
  savings * 2000000
  bonds * 5000000
  -- ... 등등
  ```
- **실제 게임 로직**: `calculateTotalAssetValue()` 함수는 지수적 증가 비용을 사용
  - 예: `getFinancialCost(type, index)` = `BASE_COSTS[type] * Math.pow(COST_MULTIPLIER, index)`
- **결과**: SQL 스크립트로 동기화한 자산 값이 게임 내 실제 자산 값과 불일치

---

## 4. 현재 문제점 요약

### 4.1 타워 개수 누락
1. `shared/leaderboard.js`의 `updateLeaderboard`가 타워 개수를 받지 않음
2. `updateLeaderboardEntry`가 타워 개수를 전달하지 않음
3. 리더보드 UI에 타워 개수 표시 없음
4. `getLeaderboard`가 타워 개수를 조회하지 않음

### 4.2 업데이트 로직 불일치
1. 타워 구매 후에도 계속 업데이트되어야 하는데, 현재는 타워 구매 시점에만 업데이트
2. `saveGame()`에서 `updateLeaderboardEntry()`를 await 없이 호출하여 실패 시 알 수 없음
3. `shared/leaderboard.js`의 `updateLeaderboard`가 `upsert`를 사용하여 RLS 충돌 가능성

### 4.3 동기화 스크립트 오류
1. 자산 계산 로직이 게임 내 로직과 불일치 (고정 배수 vs 지수적 증가)

---

## 5. 수정 필요 사항

### 우선순위 1: 타워 개수 지원
1. `shared/leaderboard.js`의 `updateLeaderboard`에 `towerCount` 파라미터 추가
2. `upsert` 대신 `SELECT` → `UPDATE`/`INSERT` 방식으로 변경 (RLS 호환)
3. `updateLeaderboardEntry`에서 타워 개수 전달
4. `getLeaderboard`에서 `tower_count` 조회 및 반환
5. 리더보드 UI에 타워 개수 표시 (예: 🗼x3)

### 우선순위 2: 업데이트 로직 개선
1. `saveGame()`에서 `updateLeaderboardEntry()` 비동기 처리 개선
2. 에러 핸들링 및 로깅 강화
3. 타워 구매 후에도 계속 업데이트되도록 보장

### 우선순위 3: 동기화 스크립트 수정
1. `calculateTotalAssetValue()` 로직을 SQL로 구현하거나
2. 게임 내에서 수동 동기화 기능 제공

---

## 6. 최근 변경 사항

### 완료된 작업
- ✅ 타워 구매 후 리더보드 업데이트 중단 로직 제거 (`towers > 0` 조건 제거)
- ✅ 타워 구매 시 리더보드 업데이트 로직 개선 (타워 개수 누적 표시)

### 미완료 작업
- ❌ `shared/leaderboard.js`의 `updateLeaderboard` 함수에 타워 개수 파라미터 추가
- ❌ `updateLeaderboardEntry`에서 타워 개수 전달
- ❌ 리더보드 UI에 타워 개수 표시
- ❌ `getLeaderboard`에서 타워 개수 조회

---

## 7. 데이터 흐름

### 정상 흐름
1. 게임 플레이 → `saveGame()` 호출 (5초마다 자동, 수동 저장 시)
2. `saveGame()` → `updateLeaderboardEntry()` 호출 (30초마다, 닉네임 있을 때만)
3. `updateLeaderboardEntry()` → `updateLeaderboard()` 호출
4. `updateLeaderboard()` → Supabase `leaderboard` 테이블 업데이트

### 타워 구매 시
1. 타워 구매 → `towers += 1`
2. `updateLeaderboard()` 직접 호출 (타워 개수 포함)
3. 엔딩 모달 표시
4. 게임 리셋 옵션 제공

### 리더보드 조회
1. 통계 탭 활성화 → `updateLeaderboardUI()` 호출
2. `getLeaderboard(10, 'assets')` 호출
3. Top 10 표시
4. 내 순위가 Top 10 밖이면 `getMyRank()` 호출

---

## 8. 참고 사항

- 리더보드 순위는 `tower_count DESC, total_assets DESC` 기준
- 타워 개수가 많을수록 상위 순위
- 동일 타워 개수 내에서는 자산이 많은 순서
- 타워 구매 후 게임을 리셋해도 타워 개수는 누적되어 표시되어야 함 (해당 구글 계정 기준)














