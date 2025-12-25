# Step 2 완료 리포트: 공통 UI 유니폼 추출

## 작업 완료 항목

### 1. 헤더 스타일 공통화
- **신규 파일**: `shared/styles/header.css`
  - SeoulSurvival 헤더 스타일 추출
  - `header`, `.header-brand`, `.statbar`, `.share-btn` 스타일 포함
  - 테마 토큰 사용 (`--bg`, `--bg2`, `--headerTint`)

### 2. 버튼/카드/Chip 스타일 공통화
- **수정 파일**: `shared/styles/uniform-core.css`
  - `.btn`, `.btn-lg`, `.btn-small` 스타일 추가 (SeoulSurvival 패턴)
  - `.card` 스타일 추가
  - `.chip`, `.pill` 스타일 추가
  - 테마 토큰 정의: `[data-theme="seoulsurvival"]` 추가

### 3. SeoulSurvival 인라인 스타일 제거
- **수정 파일**: `seoulsurvival/index.html`
  - `:root` 변수 제거 (테마 토큰으로 대체)
  - `header`, `.header-brand` 스타일 제거
  - `.btn`, `.btn-lg` 스타일 제거
  - `.card` 스타일 제거
  - `.chip` 스타일 제거
  - `header.css` 참조 추가
  - 게임 전용 스타일 (`.work`, `.row`, `.tab-wrapper` 등)은 유지

### 4. 허브 헤더 구조 확장
- **수정 파일**: `shared/shell/header.js`
  - SeoulSurvival 패턴으로 변경 (`.header-brand` 사용)
  - Account 링크를 `.chip` 스타일로 변경
- **수정 파일**: `index.html`
  - `header.css` 참조 추가
- **수정 파일**: `shared/styles/hub.css`
  - 중복 헤더 스타일 제거
  - 헤더 높이 고려한 padding-top 추가

## 빌드 결과

```
✓ built in 145ms
- dist/index.html: 1.00 kB
- dist/assets/main-CTK5MD9M.css: 1.33 kB (header.css 포함)
- dist/assets/footer-C8buPdvu.css: 3.88 kB
```

## 검증 필요 사항

1. **SeoulSurvival 게임 페이지 로드 확인**
   - 헤더가 정상 렌더링되는지
   - 버튼/카드/Chip 스타일이 정상 적용되는지
   - 게임 전용 스타일이 깨지지 않았는지

2. **허브 홈페이지 로드 확인**
   - 헤더가 SeoulSurvival 패턴으로 렌더링되는지
   - 버튼/카드 스타일이 정상 적용되는지

3. **테마 토큰 적용 확인**
   - `data-theme="seoulsurvival"` 토큰이 정상 작동하는지

## 다음 단계

Step 3: 테마 토큰 적용 확인 및 검증
- 빌드 후 로컬에서 페이지 로드 확인
- 스타일 깨짐 여부 확인
- 필요 시 수정





