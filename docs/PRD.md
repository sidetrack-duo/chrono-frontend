# 📘 PRD – Chrono (MVP)

**버전:** v1.1

**작성일:** 2025-12-02
**수정일:** 2025-12-12

---

## 1. 제품 개요 (Product Overview)

### 1.1 한 줄 정의

> GitHub 커밋 기반으로 개발자의 사이드 프로젝트 진행 상황과 작업량을 시각화하는 웹 서비스

### 1.2 목적

- 문서 중심 툴(Notion/Trello)이 아닌,
  **실제 코드 활동(GitHub 커밋)을 기반으로 프로젝트 상태를 정리**함.
- 개발자가 스스로의 **작업 흐름·패턴·성장**을 확인할 수 있도록 돕는다.

---

## 2. 문제 정의 (Problem Statement)

### 2.1 현재 문제

- Notion: 기획/문서 중심 → **커밋/개발 활동 보이지 않음**
- GitHub Issues: 코드 중심 → **기획/상태 관리 부족**
- Trello/Asana: 프로젝트 관리 툴 → **개발자 특화 지표 없음**

결과적으로 개발자는:

- “이번 주 얼마나 코딩했는지?”
- “이 프로젝트에 얼마나 기여했는지?”
- “최근 어떤 프로젝트를 많이 했는지?”

이런 걸 한눈에 확인하기 어렵다.

### 2.2 해결하고자 하는 것

- GitHub 데이터 기반으로
  **프로젝트별 작업량과 개발 활동 흐름을 자동 집계하고 시각화**한다.
- 무겁지 않게, 개발자가 실제로 매일 쓰기 쉬운 구조를 제공한다.

---

## 3. 목표 (Goals)

### 3.1 제품 목표

1. 프로젝트별 작업량을 커밋 기준으로 빠르게 파악
2. 이번 주/이번 달 개발 활동량을 대시보드에서 확인
3. 개발자 스스로의 성장과 작업 패턴을 기록

### 3.2 성공 기준

- 사용자가 **10초 내에 이번 주 작업량**을 이해할 수 있다.
- “GitHub 잔디만 볼 때보다 더 명확하다”는 피드백을 받는다.
- 프로젝트별 최근 활동을 주기적으로 확인하는 사용자 유지율 확보.

---

## 4. 대상 사용자 (Target User)

- 사이드 프로젝트를 진행하는 **주니어 개발자**
- 개인 토이 프로젝트를 자주 만드는 **개인 개발자**
- GitHub 잔디는 자주 보지만 프로젝트 단위 정리는 부족한 사용자

---

## 5. 핵심 컨셉 & 차별점

### **핵심 컨셉**

- **“문서가 아니라, 코드 활동을 보여주는 프로젝트 트래커”**

### **차별점**

| 항목             | 기존 서비스    | 우리 서비스                        |
| ---------------- | -------------- | ---------------------------------- |
| GitHub 연동      | 간접적 / 일부  | **username + repo 기반 직접 연동** |
| 커밋 기반 시각화 | 제한적         | **주간 커밋 그래프 제공**          |
| 프로젝트 중심    | 문서/카드 중심 | **커밋·repo 중심**                 |
| 사용 난이도      | 무거움         | **경량화 + 빠른 초기 구성**        |

---

## 6. 범위 & 우선순위 (Scope)

### 6.1 MUST (반드시 구현 – MVP 핵심)

### 🔐 Auth / User

- 회원가입 / 로그인 / 로그아웃
- 내 정보 조회
- GitHub username 설정 (필수)

### 📁 Projects

- 프로젝트 생성/수정/삭제
- 프로젝트 목록/상세 조회
- 프로젝트 생성 시 repo 선택(드롭다운)
- status 기본값: `IN_PROGRESS`
- startDate: 서버에서 오늘로 자동 입력

### 🔗 GitHub 연동

- username 기반 public repo 리스트 조회
- 선택한 repo의:
  - 총 커밋 수
  - 최근 커밋 날짜
- 프로젝트 생성 시 GitHub 데이터 **동기 수집**

### 📊 대시보드

- 요약 카드
  - 진행 중 프로젝트 수
  - 완료 프로젝트 수
  - 이번 달 커밋 수
- **주간 커밋 그래프 (월~일)**
- 최근 작업 프로젝트 리스트

---

### 6.2 SHOULD (여유 시 구현)

- 프로필 수정 (닉네임/소개 변경)
- 비밀번호 변경
- 회원탈퇴
- 대시보드 API 캐싱
- GitHub API 실패에 따른 세부 UX 처리
- 프로젝트 상세 페이지의 시각적 구성 강화

---

### 6.3 OUT OF SCOPE (이번 MVP 제외)

- 칸반 보드(Drag & Drop)
- 기술 스택 시간/경험치 통계
- GitHub 잔디 히트맵
- 1일 1커밋 스트릭/뱃지
- README/포트폴리오 자동 생성
- GitHub OAuth (OAuth 방식의 private repo 지원)

### 6.4 GitHub 연동 전략

#### MVP 버전 (현재)
- **일반 로그인 + GitHub username 방식**
- GitHub public 데이터만으로 대시보드 구성
- UI/문구로 명확하게 안내:
  - "본인의 GitHub username만 입력해 주세요."
  - "현재 버전에서는 public 데이터만 분석합니다."

#### 향후 계획
- **PAT(Personal Access Token) 입력 옵션 추가**
- "원하면 프라이빗 repo까지 포함한 분석 제공"
- PAT 방식으로 private repository 접근 지원
- 기본적으로 PAT 연동을 권장하는 방향으로 진행

---

## 7. 기능 설명 (High-level Features)

### 7.1 Auth

- 이메일/비밀번호 기반 간단 로그인
- 회원가입 전 이메일 인증코드 발송 및 확인
- 로그인 시 JWT 발급 (Access Token + Refresh Token)
- Refresh Token으로 Access Token 재발급
- 로그아웃 (서버 측 Refresh Token 삭제)
- 보호 라우트: `/dashboard`, `/projects/**`, `/settings`

---

### 7.2 GitHub 연동

- GitHub username 유효성 검증 (실시간)
- GitHub username 설정 후 repo 자동 조회
- `/api/github/repos`로 public repo 리스트 가져옴
- 프로젝트 생성 시 repo 선택
- GitHub API 호출 실패 시 명확한 에러 메시지 제공
- (향후) PAT 연동으로 private repo 접근 지원

---

### 7.3 프로젝트 기능

- 프로젝트 생성 폼:
  제목(필수), 설명, 목표일, 기술 스택, repo 선택
- startDate는 서버에서 자동 설정
- repoOwner는 서버에서 자동(`currentUser.githubUsername`)
- 프로젝트 목록: 최근 커밋 기준 정렬
- 프로젝트 상세: GitHub 커밋 및 repo 정보 표시

---

### 7.4 대시보드

- 상단: 요약 카드
- 중앙: **주간 커밋 그래프** (월~일, 7 bars)
- 하단: 최근 작업 프로젝트 리스트
- GitHub username 미설정 시 안내 문구 출력

---

## 8. 사용자 플로우 (User Flows)

### **신규 사용자**

1. 회원가입 → 로그인
2. GitHub username 미설정 시 설정 페이지로 이동
3. GitHub username 저장
4. 대시보드 진입 → “프로젝트 없음” 안내
5. 새 프로젝트 생성
6. repo 선택 → 생성 완료
7. 대시보드에서 커밋 그래프 확인

### **기존 사용자**

1. 로그인
2. 대시보드에서 주간 커밋 확인
3. 프로젝트 목록/상세 확인
4. 새 프로젝트 생성하거나 기존 프로젝트 유지 보수

---

## 9. 화면 구성 (Screens)

### 9.1 Auth

- 로그인 페이지
- 회원가입 페이지

### 9.2 Dashboard (`/dashboard`)

- Summary Cards
- Weekly Commit Chart
- Recent Projects

### 9.3 Project List (`/projects`)

- 프로젝트 카드 목록
- “+ 생성” 버튼

### 9.4 Project Create/Edit (`/projects/new`)

- 제목/설명
- 목표일
- 기술 스택
- GitHub repo 선택(드롭다운)

### 9.5 Project Detail (`/projects/:id`)

- 프로젝트 정보
- GitHub 커밋 정보
- 수정/삭제 버튼

### 9.6 Settings (`/settings`)

- 내 정보 표시
- GitHub username 설정/수정

---

## 10. 비기능 요구사항 (NFR)

### 성능

- 대시보드 데이터를 단일 API 호출로 가져옴

### 보안

- Bearer Token 기반 보호 라우트
- GitHub OAuth는 사용하지 않음(MVP)

### 에러 처리

- GitHub API Rate Limit 처리
- username 오류 시 명확한 UX 제공

---

## 11. 기술 스택 (Frontend 기준)

- **React**: 18.3.1
- **TypeScript**: ~5.6.2
- **React Router**: 6.28.0
- **Vite**: 6.0.1 (빌드 도구)
- **Tailwind CSS**: 4.0.0-beta.1
- **상태 관리**: Zustand (예정) / React Query (선택적, 예정)
- **HTTP 클라이언트**: Axios (예정)
- **차트 라이브러리**: Chart.js or Recharts (예정)
- **아이콘**: lucide-react
- **폰트**: Pretendard (CDN)

---

## 12. 향후 확장 (v2+)

- 1일 1커밋 스트릭/달성 뱃지
- GitHub 잔디 히트맵
- 포트폴리오/README 자동 생성
- 기술 스택별 시간/경험치 통계
- Private repo를 위한 PAT 연동 (기본 연동 후 PAT 입력 옵션 제공)

---

# ✔ End of PRD
