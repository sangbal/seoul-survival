# 리더보드 오류 해결 가이드

## 🔴 현재 오류

```
column leaderboard.tower_count does not exist
```

## ✅ 해결 방법

### 1단계: Supabase 대시보드 접속
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택 (nvxdwacqmiofpennukeo)
3. 왼쪽 메뉴에서 **SQL Editor** 클릭

### 2단계: SQL 스크립트 실행
1. **New Query** 버튼 클릭
2. `supabase/leaderboard.sql` 파일의 **전체 내용**을 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭 (또는 Ctrl+Enter)

### 3단계: 실행 확인
SQL 실행 후 다음을 확인하세요:

1. **오류 없이 완료**되었는지 확인
2. **Table Editor**에서 `leaderboard` 테이블 확인:
   - 왼쪽 메뉴 → **Table Editor** → `leaderboard` 테이블 선택
   - `tower_count` 컬럼이 있는지 확인

### 4단계: 게임 새로고침
브라우저에서 게임을 새로고침하면 리더보드가 정상 작동합니다.

## ⚠️ 중요 사항

### 기존 테이블이 있는 경우
`leaderboard` 테이블이 이미 존재하는 경우, SQL 스크립트는:
- `tower_count` 컬럼을 안전하게 추가합니다 (이미 있으면 스킵)
- 기존 데이터는 보존됩니다 (`tower_count`는 기본값 0으로 설정)

### 프로덕션/개발 환경
- **개발 환경**과 **프로덕션 환경**이 다르면 각각 실행해야 합니다
- 현재 사용 중인 Supabase 프로젝트에만 실행하면 됩니다

## 🔍 문제 해결

### SQL 실행 시 오류 발생
- 오류 메시지를 확인하세요
- 대부분의 경우 권한 문제이거나 테이블이 이미 존재하는 경우입니다
- `IF NOT EXISTS` 구문이 있어서 안전하게 재실행 가능합니다

### 여전히 오류가 발생하는 경우
1. Supabase 대시보드 → **Table Editor** → `leaderboard` 테이블 확인
2. `tower_count` 컬럼이 있는지 확인
3. 없으면 수동으로 추가:
   ```sql
   ALTER TABLE public.leaderboard 
   ADD COLUMN IF NOT EXISTS tower_count integer NOT NULL DEFAULT 0;
   ```

## 📝 확인 체크리스트

- [ ] Supabase SQL Editor에서 `supabase/leaderboard.sql` 실행 완료
- [ ] 오류 없이 실행 완료 확인
- [ ] `leaderboard` 테이블에 `tower_count` 컬럼 존재 확인
- [ ] 게임 새로고침 후 리더보드 정상 작동 확인














