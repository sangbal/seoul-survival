# Capital Clicker: Seoul Survival (v1.0)

브라우저 기반 자본 축적 클리커 게임 (Cookie Clicker 감성 + 서울 생존 테마)

## 🎮 게임 소개

클릭(노동)으로 돈을 벌고, 금융상품과 부동산에 투자해 자본을 증식시키는 클리커 게임입니다.  
알바에서 시작해 CEO까지 승진하고, 시장 이벤트에 맞춰 포지션을 조정해보세요.

## ▶️ 플레이

- **Online**: `https://sangbal.github.io/seoul-survival/`
- **Repo**: `https://github.com/sangbal/seoul-survival`

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
