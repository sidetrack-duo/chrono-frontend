# 📘 API_SPEC.md

**Chrono – API 명세서**

버전: v1.2

작성일: 2025-12-02  
수정일: 2025-12-29

기반 문서: PRD.md, FRS.md

---

# 1. 개요

본 문서는 **Chrono**의 서버 API 명세서이다.

기능 요구사항(FRS)을 기반으로 각 엔드포인트의 요청/응답/에러코드를 상세하게 기술한다.

모든 API는 기본적으로 **`/api` prefix**를 사용한다.

---

# 2. 인증(Authentication)

## ✔ 인증 방식

- Authorization: `Bearer <access_token>`
- 대부분의 API는 인증 필요
- 인증 불필요 API:
  - 회원가입, 로그인

## ✔ 인증 실패 응답

```json
{
  "message": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

---

# 3. 공통 응답 구조

## ✔ 성공 응답 구조

모든 API 성공 응답은 `SuccessResponseDto`로 감싸져 있습니다:

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": { ... }
}
```

**프론트엔드 처리:**
- `response.data.data`로 실제 데이터 접근 필요
- 또는 axios interceptor에서 자동 처리 가능

## ✔ 에러 응답 공통 구조

```json
{
  "message": "에러 메시지",
  "code": "ERROR_CODE"
}
```

공통 에러 코드:

| code             | 의미           |
| ---------------- | -------------- |
| UNAUTHORIZED     | 토큰 없음/만료 |
| FORBIDDEN        | 권한 없음      |
| VALIDATION_ERROR | 필드 검증 실패 |
| NOT_FOUND        | 리소스 없음    |
| SERVER_ERROR     | 서버 오류      |

GitHub 관련 에러 코드:

| code                    | 의미                   |
| ----------------------- | ---------------------- |
| GITHUB_USERNAME_NOT_SET | GitHub username 미설정 |
| GITHUB_USER_NOT_FOUND   | GitHub 사용자 없음     |
| GITHUB_RATE_LIMIT       | GitHub Rate Limit 초과 |
| GITHUB_REPO_NOT_FOUND   | Repo 존재하지 않음     |

---

# 4. Auth API

## 🔹 4.1 회원가입

### `POST /api/auth/signup`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com",
  "password": "12345678",
  "nickname": "jimin"
}
```

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

---

## 🔹 4.2 로그인

### `POST /api/auth/login`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI...",
    "refreshTokenCookie": "...",
    "nickname": "jimin"
  }
}
```

**비고:** Refresh Token은 HttpOnly Cookie로 전송됨

---

## 🔹 4.3 Refresh Token으로 Access Token 재발급

### `POST /api/auth/refresh`

**인증:** 불필요 (Refresh Token 쿠키 필요)

### Request

쿠키에 `refreshToken` 포함 (HttpOnly Cookie)

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": "eyJhbGciOiJIUzIOTgsImV4cCI6MTc2NDkyNjY~~~~~~~"
}
```

Access Token 문자열 반환

### Error

- Refresh Token 없음 → 401 UNAUTHORIZED
- Refresh Token 유효하지 않음 → 401 UNAUTHORIZED
- Refresh Token 불일치 → 401 UNAUTHORIZED

---

## 🔹 4.4 로그아웃

### `POST /api/auth/logout`

**인증:** 필요

### Request

본문 없음 (인증 토큰만 필요)

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

**비고:** 서버 측 Refresh Token 삭제 및 쿠키 제거

---

## 🔹 4.5 이메일 인증코드 발송

### `POST /api/auth/email/send`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com"
}
```

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

---

## 🔹 4.6 이메일 인증코드 확인

### `POST /api/auth/email/verify`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com",
  "code": "A1B2C3D4"
}
```

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": true
}
```

**비고:** 회원가입 전 이메일 인증이 완료되어야 함

---

## 🔹 4.7 비밀번호 재설정 요청 (코드 발송)

### `POST /api/auth/password/reset-request`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com"
}
```

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

**비고:** 이메일로 비밀번호 재설정 인증 코드가 발송됨

### Error

- 존재하지 않는 이메일 → 400 `"존재하지 않는 이메일"`

---

## 🔹 4.8 비밀번호 재설정 (코드 확인 및 비밀번호 변경)

### `POST /api/auth/password/reset`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com",
  "code": "CPL3DFWL",
  "newPassword": "abcd123!"
}
```

**조건:** 새 비밀번호는 영문, 숫자, 특수문자 포함 8자 이상

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

### Error

- 존재하지 않는 이메일 → 400 `"존재하지 않는 이메일"`
- 인증 코드 오류 → 400 `"인증 코드가 올바르지 않습니다."`
- 새 비밀번호 조건 불만족 → 400 VALIDATION_ERROR

---

# 5. User API

## 🔹 5.1 내 정보 조회

### `GET /api/users/me`

**인증:** 필요

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "userId": 1,
    "email": "user@example.com",
    "nickname": "jimin",
    "githubUsername": "jimin-dev"
  }
}
```

---

## 🔹 5.2 GitHub Username 설정

### `PUT /api/users/me/github`

**인증:** 필요

### Request

```json
{
  "githubUsername": "jimin-dev"
}
```

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "githubUsername": "jimin-dev"
  }
}
```

**비고:** ⚠️ 현재는 `POST /api/github/connect-basic` 사용 가능

### Error

- 사용자 없음 → NOT_FOUND
- GitHub 유저 없음 → GITHUB_USER_NOT_FOUND

---

## 🔹 5.3 프로필 수정

### `PUT /api/users/me`

**인증:** 필요

### Request

```json
{
  "nickname": "새 닉네임"
}
```

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "userId": 1,
    "email": "user@example.com",
    "nickname": "새 닉네임",
    "githubUsername": "jimin-dev"
  }
}
```

**비고:** 응답 필드명은 `id`가 아닌 `userId` 사용

---

## 🔹 5.4 비밀번호 변경

### `PATCH /api/users/me/password`

**인증:** 필요

### Request

```json
{
  "currentPassword": "현재비밀번호",
  "newPassword": "새비밀번호123!",
  "newPasswordConfirm": "새비밀번호123!"
}
```

**조건:** 새 비밀번호는 영문, 숫자, 특수문자 포함 8자 이상

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

### Error

- 현재 비밀번호 불일치 → VALIDATION_ERROR
- 새 비밀번호 조건 불만족 → VALIDATION_ERROR

---

## 🔹 5.5 회원탈퇴

### `DELETE /api/auth`

**인증:** 필요

### Request

본문 없음 (인증 토큰만 필요)

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

**비고:** 회원 탈퇴 시 관련 프로젝트 및 커밋 데이터 처리 필요

---

# 6. GitHub API (Server-to-GitHub)

## 🔹 6.1 Repo 리스트 조회

### `GET /api/github/repos`

**인증:** 필요

**전제:** githubUsername 존재해야 함

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "repoId": 1059981952,
      "repoName": "bid-N-buy-backend",
      "fullName": "bid-N-buy/bid-N-buy-backend",
      "description": "[Bid&Buy] 중고거래에 실시간 경매를 더한 새로운 거래 서비스",
      "htmlUrl": "https://github.com/bid-N-buy/bid-N-buy-backend",
      "language": "Java",
      "stargazersCount": 0,
      "forksCount": 2,
      "updatedAt": "2025-12-09T08:40:29Z",
      "private": false
    }
  ]
}
```

### Error

- GitHub username 미설정 → GITHUB_USERNAME_NOT_SET
- GitHub 유저 없음 → GITHUB_USER_NOT_FOUND
- Rate Limit → GITHUB_RATE_LIMIT

---

## 🔹 6.2 GitHub Username 유효성 검증

### `GET /api/github/validate?username=simuneu`

**인증:** 불필요

### Request

Query Parameter: `username` (String)

### Response 200

**성공 시:**
```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "valid": true,
    "username": "simuneu",
    "avatarUrl": "https://github.com/simuneu.png",
    "message": "존재하는 GitHub 사용자입니다."
  }
}
```

**실패 시:**
```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "valid": false,
    "username": "simuneuffff",
    "avatarUrl": null,
    "message": "존재하지 않는 GitHub 사용자입니다."
  }
}
```

**비고:** GitHub username 입력 시 실시간 유효성 검증에 활용 가능

---

## 🔹 6.3 GitHub 기본 연동

### `POST /api/github/connect-basic`

**인증:** 필요

### Request

```json
{
  "username": "simuneu"
}
```

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "connected": true,
    "type": "BASIC",
    "username": "simuneu",
    "avatarUrl": "https://avatars.githubusercontent.com/u/191446770?v=4",
    "message": "기본 연동이 완료되었습니다."
  }
}
```

**비고:** 
- Public repository만 접근 가능
- MVP에서는 기본 방식으로 사용

---

## 🔹 6.4 GitHub PAT 연동

### `POST /api/github/connect-pat`

**인증:** 필요

### Request

```json
{
  "username": "simuneu",
  "pat": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "connected": true,
    "type": "FULL",
    "message": "github full연동 완료"
  }
}
```

**비고:**
- PAT는 암호화되어 저장됨
- Private repository 접근 가능
- 향후 버전에서 기본 연동 후 PAT 입력 옵션 제공 예정
- PAT 생성 가이드:
  - https://github.com/settings/tokens?type=beta 이동
  - [Generate new token] 클릭
  - Repository access: All repositories 또는 필요한 레포만 선택
  - Repository permissions: Contents (Read-only), Metadata (Read-only)
  - User permissions: Email addresses (Read-only), Profile (Read-only)

---

## 🔹 6.6 PAT 연동 해제

### `DELETE /api/github/pat`

**인증:** 필요

### Request

본문 없음 (인증 토큰만 필요)

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "connected": true,
    "type": "BASIC",
    "message": "PAT연동 해제"
  }
}
```

**비고:** PAT 해제 후 기본 연동(BASIC) 상태로 변경됨

---

## 🔹 6.5 Repo 커밋 데이터 조회 (내부 호출)

### 사용처: 프로젝트 생성 시 자동 호출

### Response 예시

```json
{
  "totalCommits": 87,
  "lastCommitAt": "2025-11-20T10:22:31Z"
}
```

---

# 7. Project API

## 🔹 7.1 프로젝트 생성

### `POST /api/projects`

**인증:** 필요

### Request

```json
{
  "owner": "jimin-dev",
  "repoName": "project-tracker",
  "repoUrl": "https://github.com/jimin-dev/project-tracker",
  "title": "Project Tracker",
  "description": "사이드 프로젝트 관리 도구",
  "techStack": ["React", "Spring", "MySQL"],
  "startDate": "2025-12-01",
  "targetDate": "2025-12-31"
}
```

**필수 필드:**
- `owner`: GitHub username
- `repoName`: Repository 이름
- `repoUrl`: Repository URL

**선택 필드:**
- `title`, `description`, `techStack`, `startDate`, `targetDate`

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": 5
}
```

### Error

- 중복 등록 → 400 Bad Request (이미 등록된 프로젝트)
- GitHub Repo 조회 실패 → 400 Bad Request
- Private repo인데 PAT 미설정 → 400 Bad Request (PAT 등록 필요)

---

## 🔹 7.2 프로젝트 메타데이터 수정

### `PUT /api/projects/{projectId}/meta`

**인증:** 필요

### Request

```json
{
  "title": "수정된 제목",
  "description": "업데이트 설명",
  "techStack": ["React", "Spring"],
  "startDate": "2025-12-01",
  "targetDate": "2026-01-01"
}
```

**비고:** 모든 필드는 선택사항. 수정할 필드만 포함하면 됨.

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

---

## 🔹 7.3 프로젝트 상태 변경

### `PATCH /api/projects/{projectId}/status`

**인증:** 필요

### Request

```json
{
  "status": "COMPLETED"
}
```

**상태값:** `IN_PROGRESS` 또는 `COMPLETED`

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

---

## 🔹 7.4 프로젝트 삭제 (소프트 삭제)

### `PATCH /api/projects/{projectId}/active`

**인증:** 필요

### Request

```json
{
  "active": false
}
```

**비고:** 
- `active: false` → 프로젝트 비활성화 (소프트 삭제)
- `active: true` → 프로젝트 활성화 (복구)
- 비활성화된 프로젝트는 목록 조회에서 제외됨

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": null
}
```

---

## 🔹 7.5 프로젝트 목록 조회

### `GET /api/projects`

**인증:** 필요

**정렬:** 최근 커밋 날짜 기준 내림차순

**비고:** 활성화된 프로젝트(`active: true`)만 조회됨

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "projectId": 5,
      "owner": "simuneu",
      "repoName": "budgie_backend",
      "repoUrl": "https://github.com/simuneu/budgie_backend",
      "active": true,
      "createdAt": "2025-12-18T22:05:55.046094",
      "title": null,
      "status": "IN_PROGRESS",
      "techStack": [],
      "totalCommits": 0,
      "lastCommitAt": null,
      "startDate": null,
      "targetDate": null,
      "progressRate": 0
    },
    {
      "projectId": 6,
      "owner": "simuneu",
      "repoName": "java-pr",
      "repoUrl": "https://github.com/simuneu/java-pr",
      "active": true,
      "createdAt": "2025-12-18T22:06:35.643923",
      "title": "프로젝트",
      "status": "IN_PROGRESS",
      "techStack": ["Spring Boot", "Java"],
      "totalCommits": 0,
      "lastCommitAt": null,
      "startDate": "2025-12-01",
      "targetDate": "2025-12-31",
      "progressRate": 56
    }
  ]
}
```

**비고:**
- `active: false`인 프로젝트는 목록에 포함되지 않음
- `techStack`은 문자열 배열
- `title`, `startDate`, `targetDate`는 null 가능 (메타데이터 미입력 시)
- `progressRate`: 진행률 (0-100)

---

## 🔹 7.6 프로젝트 상세 조회

### `GET /api/projects/{projectId}`

**인증:** 필요

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "projectId": 6,
    "owner": "simuneu",
    "repoName": "java-pr",
    "repoUrl": "https://github.com/simuneu/java-pr",
    "title": "프로젝트",
    "description": "프로젝트트 설명",
    "techStack": ["Spring Boot", "Java"],
    "startDate": "2025-12-01",
    "targetDate": "2025-12-31",
    "status": "IN_PROGRESS",
    "active": true,
    "createdAt": "2025-12-18T22:06:35.643923",
    "totalCommit": 0,
    "lastCommitAt": null
  }
}
```

**비고:**
- `active: false`인 프로젝트는 조회 불가 (404 에러)
- `techStack`은 문자열 배열
- `totalCommit` (단수형) 주의

---

# 8. Commit API

## 🔹 8.1 커밋 동기화

### `POST /api/projects/{projectId}/commits/sync`

**인증:** 필요

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": 28
}
```

**비고:** 저장된 커밋 수 반환. 프로젝트 상세 페이지에서 수동 커밋 동기화 버튼으로 활용 가능

---

## 🔹 8.2 커밋 통계 조회

### `GET /api/projects/{projectId}/commits/summary`

**인증:** 필요

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "projectId": 6,
    "totalCommits": 28,
    "latestCommitDate": "2025-10-19T09:51:17",
    "commitsThisWeek": 0,
    "mostActiveDay": "Wednesday"
  }
}
```

**비고:** 프로젝트 상세 페이지에서 커밋 통계 표시에 활용 가능

---

## 🔹 8.3 커밋 수 조회

### `GET /api/projects/{projectId}/commits/count`

**인증:** 필요

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": 28
}
```

**비고:** 프로젝트의 전체 커밋 수 반환

---

## 🔹 8.4 최근 커밋 날짜 조회

### `GET /api/projects/{projectId}/commits/latest`

**인증:** 필요

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": "2025-10-19T09:51:17"
}
```

**비고:** 가장 최근 커밋의 날짜 반환 (ISO 8601 형식)

---

## 🔹 8.5 주간 커밋 통계

### `GET /api/projects/{projectId}/commits/weekly`

**인증:** 필요

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "dayOfWeek": 2,
      "count": 2
    },
    {
      "dayOfWeek": 3,
      "count": 2
    },
    {
      "dayOfWeek": 4,
      "count": 1
    }
  ]
}
```

**비고:** `dayOfWeek`는 요일을 나타냄 (1=월요일, 7=일요일). 주간 커밋 통계 반환

---

## 🔹 8.6 커밋 히스토리

### `GET /api/projects/{projectId}/commits/history`

**인증:** 필요

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "date": "2025-11-24",
      "count": 8
    },
    {
      "date": "2025-11-25",
      "count": 2
    },
    {
      "date": "2025-11-27",
      "count": 3
    }
  ]
}
```

**비고:** 날짜별 커밋 수 집계 반환

---

# 9. Dashboard API

## 🔹 9.1 대시보드 전체 데이터 조회

### `GET /api/dashboard`

**인증:** 필요

### Response 200

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": {
    "summary": {
      "inProgressCount": 3,
      "completedCount": 2,
      "totalCommitsThisMonth": 108
    },
    "weeklyCommits": [
      {
        "dayOfWeek": 2,
        "count": 2
      },
      {
        "dayOfWeek": 3,
        "count": 2
      },
      {
        "dayOfWeek": 4,
        "count": 1
      }
    ],
    "weekInfo": {
      "startDate": "2025-11-17",
      "endDate": "2025-11-23"
    },
    "recentProjects": [
      {
        "projectId": 5,
        "totalCommits": 30,
        "latestCommitDate": "2025-12-17T13:27:11",
        "commitsThisWeek": 5,
        "mostActiveDay": "Wednesday"
      },
      {
        "projectId": 6,
        "totalCommits": 28,
        "latestCommitDate": "2025-10-19T09:51:17",
        "commitsThisWeek": 0,
        "mostActiveDay": "Sunday"
      }
    ]
  }
}
```

---

# 10. 상태값 정의

```tsx
status ∈ {
  "IN_PROGRESS",  // 진행 중
  "COMPLETED"     // 완료
}
```

---

# 11. GitHub API 호출 정책

| 내용               | 방식                                        |
| ------------------ | ------------------------------------------- |
| 커밋 수집          | 프로젝트 생성 시 동기 호출                  |
| Repo 리스트        | GitHub username 기반                        |
| Rate Limit 발생 시 | 캐시된 데이터 유지                          |
| Private Repo       | PAT 기반 접근 지원                          |

---

# 12. 주의사항

1. **응답 구조**: 모든 API는 `SuccessResponseDto`로 감싸져 있으므로 `response.data.data`로 접근 필요
2. **프로젝트 상세**: `totalCommit` (단수형) 사용 주의
3. **프로젝트 삭제**: `DELETE` 대신 `PATCH /api/projects/{projectId}/active` 사용 (`active: false`)
4. **techStack**: 백엔드에서는 `string[]` 배열로 전송
5. **날짜 형식**: `LocalDate`는 `"YYYY-MM-DD"`, `LocalDateTime`은 ISO 8601 형식
6. **비밀번호 변경**: `PUT`이 아닌 `PATCH /api/users/me/password` 사용
7. **회원 탈퇴**: `DELETE /api/users/me`가 아닌 `DELETE /api/auth` 사용

---

# END OF API_SPEC.md
