# Google Analytics 권한 이전 가이드

**작성일**: 2025-01-XX  
**프로젝트**: ClickSurvivor  
**GA 측정 ID**: `G-LFDPPHDBJ3`

---

## Executive Summary

Google Analytics 계정 소유권을 개인 계정에서 `clicksurvivor@gmail.com`으로 이전하기 위한 단계별 절차.

**핵심 질문**: 기존 개인 계정의 Google Analytics 권한을 `clicksurvivor@gmail.com`으로 완전히 이전하는 방법

**전략 방향**: 
1. `clicksurvivor@gmail.com`을 관리자 권한으로 추가
2. 권한 확인 후 기존 개인 계정 권한 제거(선택)

**주요 과제**: 
- Google Analytics 웹 인터페이스에서 사용자 권한 관리
- 계정/속성/뷰 레벨 권한 설정

---

## 현재 상태

### Google Analytics 설정 위치
- **게임 페이지**: `seoulsurvival/index.html` (라인 8-15)
- **측정 ID**: `G-LFDPPHDBJ3`
- **허브 페이지**: Google Analytics 미설정

```8:15:seoulsurvival/index.html
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-LFDPPHDBJ3"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-LFDPPHDBJ3');
  </script>
```

---

## 권한 이전 절차

### 1단계: Google Analytics 접속 및 계정 확인

1. **현재 개인 계정으로 Google Analytics 접속**
   - https://analytics.google.com/ 접속
   - 로그인 상태 확인

2. **계정 구조 확인**
   - 좌측 하단 **관리(Admin)** 아이콘 클릭
   - 계정/속성/뷰 구조 확인
   - 측정 ID `G-LFDPPHDBJ3`이 속한 속성 확인

### 2단계: clicksurvivor@gmail.com 사용자 추가

#### 방법 A: 계정 레벨 권한 부여 (권장)

1. **관리(Admin)** → **계정 액세스 관리** 클릭
2. **+ 버튼** 또는 **사용자 추가** 클릭
3. **이메일 주소 입력**: `clicksurvivor@gmail.com`
4. **권한 선택**: **관리자** 권한 선택
   - 관리자 권한: 모든 설정 변경, 사용자 추가/제거, 데이터 삭제 가능
5. **알림 전송** 체크박스 선택 (선택사항)
6. **추가** 버튼 클릭

#### 방법 B: 속성 레벨 권한 부여

1. **관리(Admin)** → **속성 액세스 관리** 클릭
2. **+ 버튼** 또는 **사용자 추가** 클릭
3. **이메일 주소 입력**: `clicksurvivor@gmail.com`
4. **권한 선택**: **관리자** 권한 선택
5. **추가** 버튼 클릭

> **참고**: 계정 레벨 권한 부여 시 하위 속성/뷰에도 자동으로 권한이 부여됩니다.

### 3단계: clicksurvivor@gmail.com에서 권한 확인

1. **clicksurvivor@gmail.com 계정으로 로그인**
2. **Google Analytics 접속**: https://analytics.google.com/
3. **계정/속성 접근 가능 여부 확인**
   - 좌측 하단 **관리(Admin)** 아이콘 클릭
   - 계정 목록에 해당 계정 표시 여부 확인
   - 측정 ID `G-LFDPPHDBJ3` 확인

### 4단계: 기존 개인 계정 권한 제거 (선택사항)

> **주의**: 이 단계는 완전한 소유권 이전을 원하는 경우에만 수행하세요.  
> 두 계정 모두 관리자 권한을 유지하는 것도 가능합니다.

1. **clicksurvivor@gmail.com 계정으로 로그인**
2. **관리(Admin)** → **계정 액세스 관리** 클릭
3. **기존 개인 계정 이메일 찾기**
4. **권한 제거** 또는 **삭제** 클릭
5. **확인 대화상자에서 확인**

---

## 권한 레벨 설명

| 권한 레벨 | 설명 | 권장 여부 |
|---------|------|----------|
| **관리자** | 모든 설정 변경, 사용자 추가/제거, 데이터 삭제 가능 | ✅ 권장 |
| **편집자** | 보고서 생성, 목표 설정 가능, 사용자 관리 불가 | ⚠️ 제한적 |
| **뷰어** | 보고서 조회만 가능, 설정 변경 불가 | ❌ 비권장 |
| **분석가** | 보고서 조회 및 공유 가능, 설정 변경 불가 | ❌ 비권장 |

---

## 확인 체크리스트

이전 완료 후 다음 항목을 확인하세요:

- [ ] `clicksurvivor@gmail.com`이 Google Analytics에 로그인 가능
- [ ] 계정 목록에 해당 계정 표시됨
- [ ] 측정 ID `G-LFDPPHDBJ3` 확인 가능
- [ ] 관리(Admin) 메뉴 접근 가능
- [ ] 사용자 추가/제거 권한 확인
- [ ] 보고서 데이터 조회 가능

---

## 문제 해결

### clicksurvivor@gmail.com이 초대 이메일을 받지 못한 경우

1. **스팸 폴더 확인**
2. **Google Analytics에서 수동으로 다시 추가 시도**
3. **이메일 주소 오타 확인** (`clicksurvivor@gmail.com` 정확히 입력)

### 권한이 부여되었지만 계정이 보이지 않는 경우

1. **Google Analytics 홈페이지에서 계정 전환 확인**
   - 우측 상단 계정 선택 드롭다운 확인
2. **다른 Google 계정으로 로그인되어 있는지 확인**
   - 브라우저에서 로그아웃 후 `clicksurvivor@gmail.com`으로 재로그인

### 기존 개인 계정 권한 제거 후 문제 발생 시

1. **clicksurvivor@gmail.com에서 기존 개인 계정을 다시 추가**
2. **또는 Google Analytics 지원팀에 문의**

---

## 참고 자료

- [Google Analytics 사용자 관리 가이드](https://support.google.com/analytics/answer/1009702)
- [Google Analytics 계정 구조 이해](https://support.google.com/analytics/answer/9304153)

---

## 다음 단계 (선택사항)

권한 이전 완료 후 고려할 사항:

1. **허브 페이지에 Google Analytics 추가**
   - `index.html`에 동일한 추적 코드 추가 검토
2. **Google Analytics 4 이벤트 추적 강화**
   - 게임 이벤트(로그인, 저장, 업적 등) 추적 추가
3. **대시보드 및 목표 설정**
   - 주요 지표 모니터링 대시보드 구성














