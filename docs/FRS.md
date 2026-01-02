# 📘 FRS – Chrono (MVP)

**버전:** v1.0

**작성일:** 2025-12-02
**수정일:** 2025-12-25

---

# 1. 개요 (Overview)

본 문서는 **Chrono MVP**의 **기능 요구사항 명세서(Function Requirement Specification)**이다.

PRD.md에 정의된 목적·플로우·컨셉을 기반으로 실제 **기능 단위 요구사항을 세부적으로 정의**한다.

---

# 2. 용어 정의 (Definitions)

| 용어            | 의미                                                  |
| --------------- | ----------------------------------------------------- |
| Project         | 하나의 개발 프로젝트 단위                             |
| Repo            | GitHub Repository                                     |
| GitHub Username | 사용자가 설정한 GitHub 계정 아이디                    |
| Commit Stats    | repo 기준 커밋 수, 최근 커밋 등 지표                  |
| Weekly Commits  | 이번 주(월~일) 기준 커밋 데이터                       |
| Status          | 프로젝트 진행 상태 값 (`IN_PROGRESS`, `COMPLETED` 등) |

---

# 3. 기능 요구사항 목록 (FRS Summary)

아래는 **MUST / SHOULD**로 구분한 전체 기능 리스트이다.

## 3.1 MUST (필수 기능)

### Auth / User

- [A-01] 회원가입
- [A-02] 로그인 / 로그아웃
- [A-03] 사용자 정보 조회
- [A-04] GitHub username 설정
- [A-05] 비밀번호 찾기 (재설정)

### GitHub 연동

- [GH-01] GitHub username 기반 repo 리스트 조회
- [GH-02] repo 선택 후 커밋 수·최근 커밋 조회
- [GH-03] 프로젝트 생성 시 커밋 데이터 동기 수집

### Projects

- [P-01] 프로젝트 생성
- [P-02] 프로젝트 수정
- [P-03] 프로젝트 삭제
- [P-04] 프로젝트 목록 조회
- [P-05] 프로젝트 상세 조회

### Dashboard

- [D-01] 요약 카드 표시
- [D-02] 이번 주 커밋 그래프
- [D-03] 이번 달 커밋 수 통계
- [D-04] 최근 프로젝트 리스트

### 공통

- [C-01] API 에러 처리
- [C-02] 인증 보호(Protected Routes)
- [C-03] 기본 레이아웃

---

## 3.2 SHOULD (여유 있을 경우)

- [U-05] 프로필 수정(닉네임/소개)
- [P-06] 프로젝트 상세 UI 고도화
- [D-05] 대시보드 캐싱
- [GH-04] GitHub API Rate Limit UI 대응

---

# 4. 상세 기능 정의 (Detail Requirements)

아래는 각 기능에 대해 **ID / 기능 설명 / 시나리오 / 비고**를 포함한 상세 정의이다.

---

## 4.1 Auth / User

### [A-01] 회원가입

- **설명:** 이메일+비밀번호+닉네임으로 계정 생성
- **시나리오:**
  - 사용자 입력값 검증
  - 이메일 중복 체크
  - 성공 시 로그인 페이지로 이동 또는 자동 로그인

### [A-02] 로그인 / 로그아웃

- **설명:** JWT 기반 로그인/로그아웃 처리
- **비고:** Access Token은 Authorization 헤더로 전달

### [A-03] 사용자 정보 조회

- **설명:** `/api/users/me` 요청 시 사용자 정보 반환
- **반환 값:** id, email, nickname, bio, githubUsername

### [A-04] GitHub Username 설정

- **설명:** GitHub public repo 조회를 위한 username 설정
- **예외:**
  - username 미설정 시 repo 선택 기능 비활성화
  - 잘못된 username일 경우 에러 표시
  - Rate Limit 시 재시도 안내

### [A-05] 비밀번호 찾기 (재설정)

- **설명:** 이메일 인증 코드를 통한 비밀번호 재설정
- **시나리오:**
  1. 사용자가 이메일 입력
  2. 서버에서 이메일로 인증 코드 발송
  3. 사용자가 인증 코드와 새 비밀번호 입력
  4. 코드 검증 후 비밀번호 변경
- **API:**
  - `POST /api/auth/password/reset-request`: 코드 요청
  - `POST /api/auth/password/reset`: 코드 확인 및 비밀번호 변경
- **예외:**
  - 존재하지 않는 이메일 → 에러 메시지 표시
  - 인증 코드 오류 → 에러 메시지 표시
  - 새 비밀번호 조건 불만족 → 검증 메시지 표시

---

## 4.2 GitHub 연동

### [GH-01] repo 리스트 조회

- **설명:** `GET /api/github/repos`
- **전제:** `githubUsername`이 존재해야 함
- **반환:** name, fullName, description, htmlUrl, isPrivate

### [GH-02] repo 기반 커밋 정보 조회

- **설명:** 선택한 repo의
  - 총 커밋 수
  - 최근 커밋 시각
    을 조회한다.
- **트리거:** 프로젝트 생성 시 자동 실행

### [GH-03] 프로젝트 생성 시 커밋 동기 수집

- **설명:** 프로젝트 생성 요청 시 GitHub API를 동기 호출하여 커밋 데이터를 DB에 저장
- **비고:**
  - 동기 처리(MVP)
  - UI에서는 로딩 표시

---

## 4.3 프로젝트 (Projects)

### [P-01] 프로젝트 생성

- **필드:**
  - 제목(필수)
  - 설명(선택)
  - 목표일(targetDate, 선택)
  - 기술스택(문자열, 콤마 구분)
  - repoName (사용자 선택)
- **자동 값:**
  - startDate = 오늘
  - status = IN_PROGRESS
  - repoOwner = currentUser.githubUsername
- **예외:**
  - GitHub username 없으면 생성 불가

---

### [P-02] 프로젝트 수정

- **설명:** 제목/설명/목표일/기술스택/상태 등 수정
- **제한:** repoName 변경은 MVP에서 **불가**

---

### [P-03] 프로젝트 삭제

- **설명:** 프로젝트 id로 삭제
- **추가:** 삭제 전 confirm 표시(프론트)

---

### [P-04] 프로젝트 목록 조회

- **표시 정보:**
  - 제목
  - 상태
  - 기술 스택
  - recentCommitAt
  - 총 커밋 수(optional)

---

### [P-05] 프로젝트 상세

- **포함 정보:**
  - 기본 정보 (제목/설명/날짜/스택/상태)
  - GitHub 정보
  - repo 링크
  - 커밋 데이터 (totalCommits, lastCommitAt)

---

## 4.4 대시보드 (Dashboard)

### [D-01] 요약 카드

- 진행중 프로젝트 수
- 완료된 프로젝트 수
- 이번 달 커밋 총합

### [D-02] 이번 주 커밋 그래프

- 월~일 7일
- `{ dayOfWeek, date, count }` 구조

### [D-03] 이번 달 커밋 수

- 월 단위 커밋 총합
- 모든 연결된 repo 기준

### [D-04] 최근 프로젝트 리스트

- 최근 커밋 날짜 기준 정렬
- 제목, 커밋 수, 최근 커밋 시간 표시

---

## 4.5 공통 기능

### [C-01] API 에러 처리

- GitHub API 오류 시 통일된 코드 반환
  - `GITHUB_USERNAME_NOT_SET`
  - `GITHUB_USER_NOT_FOUND`
  - `GITHUB_RATE_LIMIT`
- 프론트에서 해당 코드로 UX 제어

### [C-02] 인증 보호

- `/dashboard`, `/projects/**`, `/settings`는 보호 라우트
- 토큰 만료 시 로그인 페이지로 리다이렉트

### [C-03] 레이아웃

- 상단 네비게이션
- 페이지 공통 padding/width

---

# 5. 데이터 모델 (Entity Requirements)

> ERD는 별도 문서에서 설계할 수 있으나, FRS 기준으로 필요한 필드 정의.

---

## 5.1 User

| 필드           | 타입   | 설명        |
| -------------- | ------ | ----------- |
| id             | Long   | PK          |
| email          | String | 로그인용    |
| password       | String | 암호화 저장 |
| nickname       | String | 사용자명    |
| bio            | String | 한 줄 소개  |
| githubUsername | String | GitHub 계정 |

---

## 5.2 Project

| 필드         | 타입     | 설명                       |
| ------------ | -------- | -------------------------- |
| id           | Long     | PK                         |
| userId       | Long     | 작성자                     |
| title        | String   | 제목                       |
| description  | String   | 설명                       |
| startDate    | Date     | 생성 시 자동               |
| targetDate   | Date     | 선택                       |
| techStack    | String   | “React, Spring” 문자열     |
| status       | Enum     | `IN_PROGRESS`, `COMPLETED` |
| repoName     | String   | GitHub repo 이름           |
| repoOwner    | String   | GitHub username            |
| totalCommits | Integer  | GitHub 기준 총 커밋        |
| lastCommitAt | DateTime | GitHub 기준 최근 커밋      |

---

# 6. API 연동 요구사항

> 자세한 API 스펙은 API_SPEC.md에 별도로 정의.
>
> FRS에는 “무엇을 요청/반환해야 하는가” 기준만 포함.

### API 소비 방향 (FE 기준)

- GET `/api/github/repos`
  → 드롭다운 repo 목록 생성
- POST `/api/projects`
  → 프로젝트 생성 + GitHub 데이터 동기
- GET `/api/dashboard`
  → 요약/주간 커밋/최근 프로젝트 일괄 조회

---

# 7. 제약사항 · 논리 규칙

- GitHub username 미설정 시:
  - 프로젝트 생성 불가
  - 대시보드 커밋 데이터 없음 표시
- repo 변경은 MVP에서 제공하지 않음
- GitHub API Rate Limit 시:
  - GitHub 데이터는 업데이트되지 않음
  - 기존 데이터 반환(캐시)

---

# 8. 테스트 시나리오 (High-level)

✓ 신규 사용자 → GitHub username 설정 안내

✓ username 오류 입력 → “사용자 없음” 에러

✓ repo 선택 후 생성 → 커밋 수 정상 표시

✓ 대시보드 → 주간 커밋 그래프 표시

✓ 프로젝트 삭제 → 목록 갱신

✓ GitHub API 실패 → 기존 데이터 유지 + 에러 메시지

---

# ✔ END OF FRS
