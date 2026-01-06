# 리더보드 설정 가이드

## 문제 해결: "리더보드 테이블이 설정되지 않았습니다"

이 오류는 Supabase 데이터베이스에 리더보드 테이블과 관련 함수가 설정되지 않았을 때 발생합니다.

## 해결 방법

### 1. Supabase SQL Editor 접속

1. Supabase 대시보드에 로그인
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. **New Query** 버튼 클릭

### 2. SQL 스크립트 실행

`supabase/leaderboard.sql` 파일의 전체 내용을 복사하여 SQL Editor에 붙여넣고 **Run** 버튼을 클릭합니다.

이 스크립트는 다음을 생성/업데이트합니다:
- `leaderboard` 테이블 (또는 기존 테이블에 `tower_count` 컬럼 추가)
- 인덱스 (성능 최적화)
- RLS (Row Level Security) 정책
- `get_my_rank` RPC 함수 (내 순위 조회용)

### 3. 실행 확인

SQL 실행 후 오류가 없으면 성공입니다. 게임을 새로고침하여 리더보드가 정상 작동하는지 확인하세요.

## 스키마 구조

### leaderboard 테이블

```sql
- id: uuid (PK)
- user_id: uuid (FK to auth.users)
- game_slug: text (게임 식별자, 'seoulsurvival')
- nickname: text (플레이어 닉네임)
- total_assets: bigint (총 자산)
- play_time_ms: bigint (플레이 시간)
- tower_count: integer (서울타워 개수, 프레스티지)
- updated_at: timestamptz
- created_at: timestamptz
```

### RPC 함수

- `get_my_rank(p_game_slug, p_nickname, p_sort_by)`: 내 순위 조회

## 주의사항

1. **프로덕션과 개발 환경 분리**: 개발/프로덕션 Supabase 프로젝트가 다르면 각각 실행해야 합니다.
2. **기존 데이터 보존**: `tower_count` 컬럼 추가는 기존 데이터에 영향을 주지 않습니다 (기본값 0).
3. **RLS 정책**: 모든 사용자가 리더보드를 읽을 수 있지만, 자신의 기록만 수정/삭제할 수 있습니다.

## 문제 해결

### 오류: "relation does not exist"
- 테이블이 생성되지 않았습니다. SQL 스크립트를 다시 실행하세요.

### 오류: "permission denied"
- RLS 정책이 제대로 설정되지 않았습니다. SQL 스크립트의 RLS 정책 부분을 확인하세요.

### 오류: "function get_my_rank does not exist"
- RPC 함수가 생성되지 않았습니다. SQL 스크립트의 함수 정의 부분을 확인하세요.

### 리더보드는 보이지만 내 순위가 안 보임
- `get_my_rank` RPC 함수가 없거나 권한 문제일 수 있습니다. SQL 스크립트를 다시 실행하세요.
















