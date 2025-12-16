# DEVLOG

이 파일은 “매 세션 작업 내역/의도/주의사항”을 짧게 남기는 로그입니다.  
새 프롬프트/새 창에서 시작할 때, AI는 이 파일의 **최근 항목**을 먼저 읽고 맥락을 복원합니다.

## 2025-12-16
- **UI**
  - 노동 탭: 직급(`currentCareer`) 표기를 승진 프로그레스 카드 영역으로 이동(모바일 가려짐 개선)
  - 승진 남은 클릭 수에 천단위 콤마 적용
  - 모바일: 일기장(로그) 높이 약간 축소
  - 설정: “온라인 플레이” → “홈페이지 이동” 문구 변경
  - 통계 탭: 성장 속도/마일스톤/시간당 수익이 2줄로 떨어지는 현상 완화(폰트/nowrap)
  - 허브(루트 `/`)를 “게임 1개 집중” 넷플릭스 톤으로 재구성:
    - 히어로(도트 야경) + 앵커 섹션(`#about`, `#screenshots`, `#account`)
    - CTA는 `플레이`/`자세히` 2개로 단순화
    - KO/EN i18n 추가(`?lang=` + LocalStorage + navigator fallback), 추후 JP/CN 확장 전제
    - 링크/에셋 경로는 Vite `base: './'`에 맞춰 상대 경로 유지
  - 소셜 로그인(SSO) 초기 스캐폴딩 추가(허브/게임 공통):
    - `shared/auth/*` + `shared/authBoot.js`로 허브(`/`)와 게임(`/seoulsurvival/`)에서 동일 로그인 상태 공유 기반 마련
    - Supabase Auth(OAuth) 연결을 전제로 하며, `shared/auth/config.js`에 프로젝트 키 설정 필요
- **밸런스**
  - CEO 달성 기준을 누적 10,000 클릭으로 조정(직급 간격 확대)
  - 노동 업그레이드 해금 조건을 직급(careerLevel) 기반으로 재정렬
  - 통계 숫자 포맷: 짧은 숫자 ON에서 소수점 자릿수 고정(깜빡임 감소)
- **도구**
  - `tools/extractUpgrades.mjs`: 업그레이드 표를 자동 추출/정리하는 스크립트 추가
  - `upgrade_report.md`는 생성물이므로 `.gitignore`로 제외
- **문서/운영**
  - `ARCHITECTURE.md`/`BALANCE_NOTES.md`/`DEVLOG.md` 도입으로 세션 컨텍스트 복원 강화
  - `README.md`의 부팅 프롬프트를 “능동형(문서→구현→검증→문서/깃 정리)”으로 확장
  - 서비스 URL 맥락 명시:
    - 허브: `http://clicksurvivor.com/`
    - 게임: `https://clicksurvivor.com/seoulsurvival/`
  - 폴더 구조 정리(옵션 A): `src/`, `assets/` → `seoulsurvival/src/`, `seoulsurvival/assets/` 로 이동(게임 완전 독립)
  - 루트 `index.html`은 더 이상 리다이렉트가 아니라 **허브(준비 중) 페이지**로 변경
  - `tools/extractUpgrades.mjs`는 `seoulsurvival/src/main.js`를 읽도록 경로 수정

## “다음에 재개할 때” 체크리스트
- 새 세션에서는 `ARCHITECTURE.md` → `BALANCE_NOTES.md` → `DEVLOG.md` 순으로 읽고 시작
- 레거시 주의: `seoulsurvival/src/main.js`에 통계 탭 업데이트 로직이 남아 있고 `seoulsurvival/src/ui/statsTab.js`도 존재(호출 경로 확인 필요)

## 버전 기록 룰(간단)
- 배포/공개 전에 버전을 올렸다면, `vX.Y.Z`와 변경 요약(3~8줄)을 DEVLOG에 남긴다.


