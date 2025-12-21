# ClickSurvivor 허브홈 SEO 감사 보고서

## [총평]

현재 허브홈은 **정적 HTML에 모든 콘텐츠가 포함**되어 있어 크롤링 가능하지만, **브랜드 허브 정체성이 약하고** 시맨틱 HTML/구조화된 데이터가 부족합니다. H1이 대표작 제목으로 되어 있어 "단일 게임"으로 오인될 위험이 있습니다.

## [치명적 이슈]

**없음** - 초기 HTML에 콘텐츠가 포함되어 있어 크롤링 가능

## [개선안 Top 5]

### 1. H1 및 시맨틱 HTML 구조 개선 (우선순위: 높음, 효과: 높음, 난이도: 낮음)
- **현재**: H1이 "Capital Clicker: Seoul Survival" (대표작 제목)
- **문제**: 브랜드 허브가 아닌 단일 게임으로 인식될 위험
- **개선**: H1을 "ClickSurvivor" 또는 "ClickSurvivor — 클릭 기반 생존 게임 스튜디오"로 변경
- **추가**: 섹션 제목을 `<div class="sectionTitle">`에서 `<h2>`로 변경

### 2. Structured Data (Schema.org) 추가 (우선순위: 높음, 효과: 중간, 난이도: 낮음)
- **현재**: 없음
- **개선**: Organization, WebSite, ItemList 스키마 추가
- **효과**: 검색 결과에 리치 스니펫 표시 가능

### 3. robots.txt / sitemap.xml 생성 (우선순위: 중간, 효과: 중간, 난이도: 낮음)
- **현재**: 없음
- **개선**: `public/robots.txt`, `public/sitemap.xml` 생성
- **효과**: 크롤러 가이드 및 인덱싱 효율 향상

### 4. 메타태그 미세 조정 (우선순위: 중간, 효과: 낮음, 난이도: 낮음)
- **현재**: title/description이 적절하지만 브랜드 정체성 강화 여지 있음
- **개선**: "게임 브랜드/스튜디오" 명시 강화

### 5. 이미지 최적화 (우선순위: 낮음, 효과: 중간, 난이도: 중간)
- **현재**: 이미지에 width/height 지정, lazy loading 적용됨
- **개선**: WebP/AVIF 포맷 전환 (선택사항)

## [복붙 문구]

### Home <title> 2안

**안 1 (권장)**:
```
ClickSurvivor — 클릭 기반 생존 게임 스튜디오
```

**안 2**:
```
ClickSurvivor | 클릭으로 살아남는 게임들
```

### meta description 2안

**안 1 (권장)**:
```
ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다. 대표작: Capital Clicker: SeoulSurvivor. 웹에서 바로 플레이 가능.
```

**안 2**:
```
클릭 기반 생존 게임 브랜드 ClickSurvivor. 대표작 Capital Clicker: SeoulSurvivor를 포함한 클리커/증분 게임을 웹에서 무료로 플레이하세요.
```

### H1 문구 1안

```
ClickSurvivor
```

또는

```
ClickSurvivor — 클릭 기반 생존 게임 스튜디오
```

### 히어로/소개 문단 1~2개

**히어로 섹션 (H1 아래)**:
```
ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다. 
대표작 Capital Clicker: SeoulSurvivor를 시작으로, 증분 게임의 재미를 웹에서 바로 경험할 수 있습니다.
```

**소개 섹션 (About)**:
```
ClickSurvivor는 클릭(노동)으로 시작해 투자와 승진을 통해 성장하는 증분 게임을 제작합니다. 
웹 기반으로 개발되어 설치 없이 바로 플레이할 수 있으며, 클라우드 저장과 리더보드를 통해 여러 기기에서 이어하기가 가능합니다.
```

### Featured 섹션 문구 (대표작 소개)

**현재 H1 위치에 배치할 문구**:
```
<h2>대표작: Capital Clicker: SeoulSurvivor</h2>
<p>서울 생존 클리커 — 노동·투자·승진, 그리고 시장 이벤트</p>
```

## [코드 블록]

### head meta 태그 세트 (index.html <head>에 추가)

```html
<!-- 기존 메타태그 유지, 아래만 추가/수정 -->

<!-- 수정: title -->
<title>ClickSurvivor — 클릭 기반 생존 게임 스튜디오</title>

<!-- 수정: description -->
<meta name="description" content="ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다. 대표작: Capital Clicker: SeoulSurvivor. 웹에서 바로 플레이 가능." />

<!-- 추가: og:locale -->
<meta property="og:locale" content="ko_KR" />

<!-- 수정: og:title (title과 일치) -->
<meta property="og:title" content="ClickSurvivor — 클릭 기반 생존 게임 스튜디오" />

<!-- 수정: og:description (description과 일치) -->
<meta property="og:description" content="ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다. 대표작: Capital Clicker: SeoulSurvivor. 웹에서 바로 플레이 가능." />

<!-- 수정: twitter:title (og:title과 일치) -->
<meta name="twitter:title" content="ClickSurvivor — 클릭 기반 생존 게임 스튜디오" />

<!-- 수정: twitter:description (og:description과 일치) -->
<meta name="twitter:description" content="ClickSurvivor는 클릭 기반 생존·성장 게임을 제작하는 인디 게임 스튜디오입니다. 대표작: Capital Clicker: SeoulSurvivor. 웹에서 바로 플레이 가능." />
```

### JSON-LD 스키마 블록 (index.html <head> 또는 </body> 직전에 추가)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://clicksurvivor.com/#organization",
      "name": "ClickSurvivor",
      "url": "https://clicksurvivor.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://clicksurvivor.com/seoulsurvival/assets/images/logo.png"
      },
      "sameAs": []
    },
    {
      "@type": "WebSite",
      "@id": "https://clicksurvivor.com/#website",
      "url": "https://clicksurvivor.com/",
      "name": "ClickSurvivor",
      "description": "클릭 기반 생존·성장 게임 스튜디오",
      "publisher": {
        "@id": "https://clicksurvivor.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://clicksurvivor.com/?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "ItemList",
      "@id": "https://clicksurvivor.com/#games",
      "name": "ClickSurvivor Games",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "VideoGame",
            "name": "Capital Clicker: SeoulSurvivor",
            "url": "https://clicksurvivor.com/seoulsurvival/",
            "description": "서울 생존 클리커 — 노동·투자·승진, 그리고 시장 이벤트",
            "applicationCategory": "Game",
            "gamePlatform": "Web Browser",
            "operatingSystem": "Any"
          }
        }
      ]
    }
  ]
}
</script>
```

### robots.txt (public/robots.txt 생성)

```
User-agent: *
Allow: /
Disallow: /account/
Disallow: /dist/

Sitemap: https://clicksurvivor.com/sitemap.xml
```

### sitemap.xml (public/sitemap.xml 생성)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://clicksurvivor.com/</loc>
    <lastmod>2025-12-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://clicksurvivor.com/seoulsurvival/</loc>
    <lastmod>2025-12-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://clicksurvivor.com/account/</loc>
    <lastmod>2025-12-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://clicksurvivor.com/terms.html</loc>
    <lastmod>2025-12-21</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://clicksurvivor.com/privacy.html</loc>
    <lastmod>2025-12-21</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

## [적용 파일]

### 1. index.html

**변경 위치 1: <head> 섹션**
- title 태그 수정
- meta description 수정
- og:locale 추가
- og:title, og:description 수정
- twitter:title, twitter:description 수정
- JSON-LD 스키마 블록 추가 (</head> 직전 또는 </body> 직전)

**변경 위치 2: <body> 섹션 (히어로 섹션)**
- H1 변경: `Capital Clicker: Seoul Survival` → `ClickSurvivor` (또는 "ClickSurvivor — 클릭 기반 생존 게임 스튜디오")
- H1 아래에 대표작 소개 추가 (H2로 "대표작: Capital Clicker: SeoulSurvivor")
- 히어로 문단 수정

**변경 위치 3: 섹션 제목들**
- `<div class="sectionTitle">한 판 요약</div>` → `<h2>한 판 요약</h2>` (class 유지 가능)
- `<div class="sectionTitle">스크린샷</div>` → `<h2>스크린샷</h2>`
- `<div class="sectionTitle">계정 하나로 이어하기</div>` → `<h2>계정 하나로 이어하기</h2>`

### 2. public/robots.txt (신규 생성)

### 3. public/sitemap.xml (신규 생성)

### 4. 빌드 검증

```bash
npm run build
# dist/index.html 확인
# dist/robots.txt, dist/sitemap.xml 확인
```

## [검증]

### 로컬 확인

1. **빌드 실행**
   ```bash
   npm run build
   ```

2. **View Source 확인**
   - `dist/index.html` 열기
   - H1이 "ClickSurvivor"인지 확인
   - H2가 섹션 제목으로 사용되는지 확인
   - JSON-LD 스키마가 포함되어 있는지 확인

3. **로컬 서버 실행**
   ```bash
   npm run preview
   ```
   - `http://localhost:4173/robots.txt` (200 OK)
   - `http://localhost:4173/sitemap.xml` (200 OK)

### 배포 후 확인

1. **View Source (프로덕션)**
   - `https://clicksurvivor.com/` → 우클릭 → "페이지 소스 보기"
   - H1, H2, JSON-LD 확인

2. **robots.txt / sitemap.xml 접근**
   - `https://clicksurvivor.com/robots.txt` (200 OK)
   - `https://clicksurvivor.com/sitemap.xml` (200 OK, XML 파싱 가능)

3. **Lighthouse (모바일)**
   - Chrome DevTools → Lighthouse → Mobile
   - SEO 점수 확인 (목표: 90+)
   - LCP, CLS 확인

4. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - URL 입력 → Structured Data 확인

5. **SNS 프리뷰 (별도)**
   - Facebook Sharing Debugger
   - Twitter Card Validator
   - OG 메타태그 충돌 없음 확인

