# Universal Header Standard (v1.0)

ClickSurvivor 프로젝트의 모든 게임에서 **SeoulSurvival과 100% 동일한 헤더 디자인**을 즉시 적용하기 위한 표준 가이드입니다.

## 1. 적용 방법 (How to Apply)

새로운 게임을 만들 때 다음 두 가지 단계만 수행하면 됩니다.

### Step 1: CSS 연결

`<head>` 태그 내에 공용 헤더 CSS를 연결합니다.

```html
<link rel="stylesheet" href="../shared/styles/universal_header.css" />
```

### Step 2: HTML 템플릿 복사

`<body>` 바로 아래의 `<header>` 영역을 아래 코드로 **그대로 복사**해서 넣으십시오.
(게임 이름과 아이콘만 변경하면 됩니다.)

```html
<header>
  <!-- 1. Brand Section (Top Left) -->
  <div class="header-brand">
    <!-- 변경 포인트: 아이콘과 게임 제목 -->
    <span
      class="brand-icon"
      style="font-size:16px; margin-right:8px; vertical-align:middle;"
      >🥬</span
    >
    <span class="brand-text"><b>Kimchi Invasion</b></span>
  </div>

  <!-- 2. Action Buttons (Top Right) -->
  <div class="header-actions">
    <!-- 즐겨찾기 버튼 -->
    <button class="chip favorite-btn" title="즐겨찾기">
      <span class="favorite-icon">⭐</span>
      <span class="favorite-label">즐겨찾기</span>
    </button>
    <!-- 공유 버튼 -->
    <button class="chip share-btn" title="공유하기">
      <svg
        class="share-icon"
        fill="currentColor"
        viewBox="0 0 24 24"
        width="16"
        height="16"
      >
        <path
          d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
        />
      </svg>
      <span class="share-label">공유</span>
    </button>
    <!-- 계정/설정 버튼 -->
    <div class="header-account">
      <button class="chip account-btn" id="headerAccountMenu">
        <svg
          class="hamburger-icon"
          fill="currentColor"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>
    </div>
  </div>

  <!-- 3. Resource Bar (Bottom Row - Full Width) -->
  <!-- 중요: id="resource-bar"는 JS에서 참조될 수 있음 -->
  <div class="statbar" id="resource-bar">
    <!-- Resource Items -->
    <!-- 변경 포인트: 자원 이름과 초기값 -->
    <div class="chip res-item">
      <span class="res-label">Cash</span>
      <span class="res-value" id="res-cash">₩0</span>
    </div>

    <div class="chip res-item">
      <span class="res-label">Resource 2</span>
      <span class="res-value" id="res-2">0</span>
    </div>
  </div>
</header>
```

## 2. 디자인 명세 (Design Specs)

이 템플릿은 `universal_header.css`에 의해 아래 규칙을 강제합니다.

- **레이아웃**: 2단 구조 (1열: 브랜드+버튼 / 2열: 자원바)
- **높이/여백**:
  - Header Padding: `8px 24px`
  - Statbar Margin: `0px` (Top Row와 밀착)
- **폰트**: `System UI` (가독성 최적화)
  - Brand Title: `14px Bold`
  - Resource Value: `12px Bold`
  - Resource Label: `11px Medium`
- **테마**: Dark Glass (`rgba(11, 18, 32, 0.95)`)

## 3. 주의사항

- 개별 게임의 `style.css`에서 `header`, `.statbar`, `.chip`에 대한 스타일을 재정의(Override)하지 마십시오.
- 재정의가 필요할 경우 반드시 `universal_header.css`보다 나중에 로드하거나, 특수 클래스를 추가하여 제한적으로 적용하십시오.
