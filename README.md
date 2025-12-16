# Capital Clicker: Seoul Survival (v1.0)

브라우저 기반 자본 축적 클리커 게임 (Cookie Clicker 감성 + 서울 생존 테마)

## 🎮 게임 소개

클릭(노동)으로 돈을 벌고, 금융상품과 부동산에 투자해 자본을 증식시키는 클리커 게임입니다.  
알바에서 시작해 CEO까지 승진하고, 시장 이벤트에 맞춰 포지션을 조정해보세요.

## ▶️ 플레이

- **Online**: `https://sangbal.github.io/seoul-survival/`
- **Hub(홈페이지)**: `http://clicksurvivor.com/`
- **Game(현재 서비스 경로)**: `https://clicksurvivor.com/seoulsurvival/`
- **Repo**: `https://github.com/sangbal/seoul-survival`

> 참고: 루트(`/`)는 허브(준비 중) 페이지이며, 게임은 `/seoulsurvival/`에서 플레이합니다.

## ✨ 주요 특징(v1.0)

- **노동/커리어**: 알바 → CEO (직급별 야간 도트 배경)
- **투자(순차 해금)**: 예금 → 적금 → 국내주식 → 미국주식 → 코인 → 빌라 → … → 빌딩
- **업그레이드**: 해금/구매 기반 업그레이드 시스템(노동/금융/부동산/전역)
- **시장 이벤트(TO-BE)**:
  - 총 12개 이벤트
  - 이벤트당 **최대 5개 상품만 영향** (나머지 1.0)
  - [투자]에서 **x배수 배지 + 이벤트 바(이벤트명/남은시간)**로 즉시 확인
- **일기장(로그)**: 독백(감성)과 시스템 메시지(정보)를 **폰트/색으로 분리**
- **반응형 UI**: PC(4열) / 태블릿(2열) / 모바일(탭 네비)
- **저장**: LocalStorage 자동 저장
- **모바일 iOS UX**: 연속 탭 시 화면 확대(더블탭/핀치 줌) 방지
- **공유**: Web Share API 기반(지원 기기에서 공유 UI 호출)

## 🧑‍💻 로컬 개발(Vite)

```bash
npm install
npm run dev
```

기본 주소는 `http://localhost:5173/` 입니다.
- 허브: `http://localhost:5173/`
- 게임: `http://localhost:5173/seoulsurvival/`

## 🤖 Cursor 바이브 코딩(세션 컨텍스트 유지)

새 프롬프트/새 창에서 AI가 프로젝트 맥락을 잃지 않도록, 아래 문서들을 유지합니다:
- `ARCHITECTURE.md`: 파일 구조/데이터 흐름 요약
- `BALANCE_NOTES.md`: 난이도/밸런스 의도 기록
- `DEVLOG.md`: 작업 로그(최근 변경/주의사항)

### “부팅 프롬프트” (새 세션에서 그대로 붙여넣기)

```text
너는 Cursor에서 동작하는 전담 개발 에이전트다. 나는 코드를 직접 수정하지 않는다(바이브 코딩).
목표: 내가 말한 요구사항을 끝까지 구현하고, 검증/정리/기록(문서)까지 완료해라.

[모드 확인]
- 현재가 Ask 모드면, “Agent 모드로 전환해달라”고 먼저 요청하고 진행을 멈춰라.
- Agent 모드면, 아래 순서대로 즉시 실행해라.

[0) 컨텍스트 부팅(필수)]
- 아래 파일을 순서대로 읽고, 핵심을 10~20줄로 요약한 뒤 시작해라:
  1) ARCHITECTURE.md
  2) BALANCE_NOTES.md
  3) DEVLOG.md(최신)
  4) README.md
- 서비스 URL 규칙(중요):
  - 허브(홈): http://clicksurvivor.com/
  - 게임(현재 경로): https://clicksurvivor.com/seoulsurvival/
  - 루트(`/`)는 허브(준비 중) 페이지, 게임은 `/seoulsurvival/` 서브패스

[1) 작업 방식]
- 내가 준 요구사항을 3~7개 체크리스트로 분해해서 제시하고, 바로 구현에 들어가라.
- 근거 없는 추측 금지: grep/검색으로 실제 코드 위치를 찾고 관련 파일만 읽어라.
- UI 수정 시 중복 파일 동기화 여부를 먼저 확인해라:
  - 게임 UI는 `seoulsurvival/index.html` (루트 `index.html`은 허브)
- 레거시 주의:
  - 통계 로직이 seoulsurvival/src/main.js(레거시)와 seoulsurvival/src/ui/statsTab.js(모듈)에 공존한다. 호출 경로 확인 후 수정해라.
- Windows/PowerShell 주의:
  - `&&`, `head` 같은 명령은 그대로 쓰지 말고 PowerShell 호환으로 실행해라.

[2) 품질/검증]
- 변경 후 최소 1개는 반드시 수행:
  - npm run dev 로 실행 확인 (또는 build/preview)
- 중요한 화면 체크:
  - mobile: workTab/statsTab, 헤더 가림, 텍스트 줄바꿈, 버튼 영역
  - 저장/로드(LocalStorage) 정상 동작 여부
- 변경 이유(3~8줄) + 수정한 파일/함수 위치를 함께 남겨라.

[3) 문서 업데이트 룰]
- 매 세션 종료 시 DEVLOG.md에 “오늘 한 일/의도/주의점”을 5~15줄 추가해라.
- 구조/배포/URL/레거시 경로가 바뀌면 ARCHITECTURE.md를 업데이트해라.
- 실행/배포/유저-facing 정보가 바뀌면 README.md를 업데이트해라.

[4) Git 룰]
- 작업 시작: git status 확인
- 작업 종료: git diff --stat 확인
- 생성물(예: upgrade_report.md)은 커밋하지 말고 .gitignore 처리해라.
- 기본은 commit까지만 한다. push는 내가 “푸시해”라고 말할 때만 해라.

이제부터 내가 요구사항을 줄 테니, 위 규칙대로 ‘컨텍스트 부팅’부터 시작해라.
```

## 🚀 GitHub Pages 배포

프로젝트 루트의 `deploy.bat` 또는 `deploy.ps1`를 사용합니다.

```bash
deploy.bat
```

또는

```powershell
.\deploy.ps1
```

## 🧾 버전

- **정식 배포**: **v1.0**

## 🐛 버그/제안

GitHub Issues에 남겨주세요.
