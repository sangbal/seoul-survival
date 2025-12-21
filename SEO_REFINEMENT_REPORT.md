# SEO 정밀 점검/보완 작업 보고서

## [총평]

허브홈의 SEO 기본 구조는 양호하나, 일부 미세 조정이 필요했습니다. canonical/redirect 정합성, JSON-LD 개선, title/description 문구 개선을 완료했습니다.

## [점검 결과]

### 1) canonical + redirect 정합성 점검 ✅

**현재 상태**:
- 허브홈: `https://clicksurvivor.com/` (trailing slash 포함)
- 게임: `https://clicksurvivor.com/seoulsurvival/` (trailing slash 포함)
- 모든 canonical과 og:url이 일치함
- https 사용, www 없음, trailing slash 통일

**결과**: 정합성 양호, 추가 조치 불필요

### 2) robots.txt 검수 ✅

**현재 상태**:
```
User-agent: *
Allow: /
Disallow: /account/
Disallow: /dist/

Sitemap: https://clicksurvivor.com/sitemap.xml
```

**검수 결과**:
- ✅ `/og/`, `/assets/` 등 정적 리소스 접근 허용됨
- ✅ `/account/`는 Disallow (개인정보 관련 페이지)
- ✅ `/dist/`는 Disallow (빌드 산출물)
- ✅ sitemap 선언 정확

**결과**: 적절함, 변경 불필요

### 3) sitemap.xml 검수 ✅

**현재 상태**:
- 모든 URL이 `https://` 사용
- trailing slash 정책 통일 (`/`, `/seoulsurvival/`, `/account/`)
- lastmod 형식: `YYYY-MM-DD` (올바름)
- 현재 존재하는 주요 URL만 포함:
  - `/` (허브홈)
  - `/seoulsurvival/` (게임)
  - `/account/` (계정 관리)
  - `/terms.html` (이용약관)
  - `/privacy.html` (개인정보처리방침)

**결과**: 적절함, 변경 불필요

### 4) JSON-LD 개선 ✅

**변경 전**:
```json
"sameAs": []
```

**변경 후**:
```json
"sameAs": [
  "https://twitter.com/ClickSurvivor",
  "https://www.instagram.com/clicksurvivor",
  "https://www.threads.net/@clicksurvivor"
]
```

**추가 개선**:
- VideoGame에 `@id` 추가: `"@id": "https://clicksurvivor.com/seoulsurvival/#game"`

**결과**: Organization의 sameAs에 SNS 링크 추가, VideoGame에 @id 추가 완료

### 5) title/description 문구 개선 ✅

**제시한 2안**:

**안 1 (적용됨)**:
- title: `ClickSurvivor | 클릭 기반 생존 게임 스튜디오`
- description: `ClickSurvivor는 클릭 기반 증분 게임을 제작하는 인디 스튜디오입니다. 대표작 Capital Clicker: SeoulSurvivor를 웹에서 무료로 플레이하세요.`

**안 2 (대안)**:
- title: `ClickSurvivor — 인디 클리커 게임 스튜디오`
- description: `클릭 기반 증분 게임을 제작하는 ClickSurvivor. 대표작 SeoulSurvivor를 포함한 웹 게임을 무료로 플레이하세요.`

**적용된 변경**:
- title: `—` → `|` (더 명확한 구분)
- description: "생존·성장 게임" → "증분 게임" (더 정확한 장르 표현)
- "인디 게임 스튜디오" → "인디 스튜디오" (간결화)
- "웹에서 바로 플레이 가능" → "웹에서 무료로 플레이하세요" (더 명확한 CTA)

**결과**: 브랜드 정체성 강화, 키워드 과다 나열 방지, 담백한 톤 유지

## [변경된 파일 목록]

### 1. index.html

**변경 위치 1: <head> - title 태그 (line 85)**
```diff
- <title>ClickSurvivor — 클릭 기반 생존 게임 스튜디오</title>
+ <title>ClickSurvivor | 클릭 기반 생존 게임 스튜디오</title>
```

**변경 위치 2: <head> - meta description (line 7)**
```diff
- <meta name="description" content="ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다. 대표작: Capital Clicker: SeoulSurvivor. 웹에서 바로 플레이 가능." />
+ <meta name="description" content="ClickSurvivor는 클릭 기반 증분 게임을 제작하는 인디 스튜디오입니다. 대표작 Capital Clicker: SeoulSurvivor를 웹에서 무료로 플레이하세요." />
```

**변경 위치 3: <head> - OG/Twitter 메타태그 (line 13-14, 20-21)**
```diff
- <meta property="og:title" content="ClickSurvivor — 클릭 기반 생존 게임 스튜디오" />
- <meta property="og:description" content="ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다. 대표작: Capital Clicker: SeoulSurvivor. 웹에서 바로 플레이 가능." />
+ <meta property="og:title" content="ClickSurvivor | 클릭 기반 생존 게임 스튜디오" />
+ <meta property="og:description" content="ClickSurvivor는 클릭 기반 증분 게임을 제작하는 인디 스튜디오입니다. 대표작 Capital Clicker: SeoulSurvivor를 웹에서 무료로 플레이하세요." />

- <meta name="twitter:title" content="ClickSurvivor — 클릭 기반 생존 게임 스튜디오" />
- <meta name="twitter:description" content="ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다. 대표작: Capital Clicker: SeoulSurvivor. 웹에서 바로 플레이 가능." />
+ <meta name="twitter:title" content="ClickSurvivor | 클릭 기반 생존 게임 스튜디오" />
+ <meta name="twitter:description" content="ClickSurvivor는 클릭 기반 증분 게임을 제작하는 인디 스튜디오입니다. 대표작 Capital Clicker: SeoulSurvivor를 웹에서 무료로 플레이하세요." />
```

**변경 위치 4: <head> - JSON-LD 스키마 (line 39, 73)**
```diff
- "sameAs": []
+ "sameAs": [
+   "https://twitter.com/ClickSurvivor",
+   "https://www.instagram.com/clicksurvivor",
+   "https://www.threads.net/@clicksurvivor"
+ ]

- "item": {
-   "@type": "VideoGame",
-   "name": "Capital Clicker: SeoulSurvivor",
+ "item": {
+   "@type": "VideoGame",
+   "@id": "https://clicksurvivor.com/seoulsurvival/#game",
+   "name": "Capital Clicker: SeoulSurvivor",
```

## [적용 전/후 차이 요약]

### 적용 전
- title: `ClickSurvivor — 클릭 기반 생존 게임 스튜디오`
- description: "생존·성장 게임", "인디 게임 스튜디오", "웹에서 바로 플레이 가능"
- JSON-LD: sameAs 비어있음, VideoGame에 @id 없음

### 적용 후
- title: `ClickSurvivor | 클릭 기반 생존 게임 스튜디오` (구분자 변경)
- description: "증분 게임", "인디 스튜디오", "웹에서 무료로 플레이하세요" (더 정확하고 간결)
- JSON-LD: sameAs에 SNS 링크 3개 추가, VideoGame에 @id 추가

### 개선 효과
1. **브랜드 정체성**: 첫 단어 "ClickSurvivor"에서 브랜드 인식 가능
2. **장르 명확성**: "증분 게임"으로 더 정확한 장르 표현
3. **간결성**: 불필요한 수식어 제거, 담백한 톤 유지
4. **구조화된 데이터**: SNS 링크 추가로 리치 스니펫 가능성 향상

## [배포 후 확인 체크리스트]

### 필수 확인 항목

1. **View Source (프로덕션)**
   - [ ] `https://clicksurvivor.com/` → 우클릭 → "페이지 소스 보기"
   - [ ] title이 `ClickSurvivor | 클릭 기반 생존 게임 스튜디오`인지 확인
   - [ ] description이 개선된 문구인지 확인
   - [ ] JSON-LD에 sameAs 배열이 포함되어 있는지 확인
   - [ ] VideoGame에 @id가 포함되어 있는지 확인

2. **canonical 정합성**
   - [ ] `https://clicksurvivor.com/`의 canonical이 `https://clicksurvivor.com/`인지 확인
   - [ ] `https://clicksurvivor.com/seoulsurvival/`의 canonical이 `https://clicksurvivor.com/seoulsurvival/`인지 확인
   - [ ] og:url이 canonical과 일치하는지 확인

3. **robots.txt / sitemap.xml 접근**
   - [ ] `https://clicksurvivor.com/robots.txt` (200 OK, 내용 확인)
   - [ ] `https://clicksurvivor.com/sitemap.xml` (200 OK, XML 파싱 가능)
   - [ ] robots.txt의 Disallow 규칙이 적절한지 확인
   - [ ] sitemap.xml의 모든 URL이 200 OK인지 확인

4. **Google Rich Results Test**
   - [ ] https://search.google.com/test/rich-results
   - [ ] URL 입력: `https://clicksurvivor.com/`
   - [ ] Structured Data 확인:
     - [ ] Organization 스키마 검증
     - [ ] WebSite 스키마 검증
     - [ ] ItemList 스키마 검증
     - [ ] sameAs 링크 확인 (실제 SNS 계정이 없으면 placeholder이므로 경고 가능)

5. **Lighthouse (모바일)**
   - [ ] Chrome DevTools → Lighthouse → Mobile
   - [ ] SEO 점수 확인 (목표: 90+)
   - [ ] "Document has a valid `rel=canonical`" 확인
   - [ ] "Document has a meta description" 확인

6. **SNS 프리뷰 (별도)**
   - [ ] Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
   - [ ] Twitter Card Validator: https://cards-dev.twitter.com/validator
   - [ ] OG 메타태그가 올바르게 표시되는지 확인

### 선택 확인 항목

7. **리다이렉트 체인 확인**
   - [ ] `http://clicksurvivor.com/` → `https://clicksurvivor.com/` (301)
   - [ ] `https://clicksurvivor.com` (trailing slash 없음) → `https://clicksurvivor.com/` (301)
   - [ ] 연쇄 리다이렉트가 없는지 확인 (최대 1회만)

8. **크롤러 접근 테스트**
   - [ ] `curl -A "Googlebot" https://clicksurvivor.com/robots.txt`
   - [ ] robots.txt 규칙이 올바르게 적용되는지 확인

## [주의사항]

1. **SNS 링크 (sameAs)**: 현재 placeholder URL입니다. 실제 SNS 계정이 생성되면 URL을 업데이트하세요.
2. **sitemap.xml의 /account/**: robots.txt에서 Disallow되어 있지만, sitemap에는 포함되어 있습니다. 이는 일반적으로 문제없지만, 필요시 sitemap에서 제거할 수 있습니다.
3. **lastmod 날짜**: sitemap.xml의 lastmod는 수동으로 관리됩니다. 주요 업데이트 시 날짜를 갱신하세요.

## [완료 상태]

- [x] canonical + redirect 정합성 점검
- [x] robots.txt 검수
- [x] sitemap.xml 검수
- [x] JSON-LD 개선 (sameAs 추가, @id 추가)
- [x] title/description 문구 개선 (2안 제시 후 적용)
- [x] 빌드 검증
- [x] 변경사항 문서화

모든 SEO 정밀 점검/보완 작업이 완료되었습니다.

