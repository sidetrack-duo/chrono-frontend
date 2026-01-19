## auth<br/>

### 이메일 인증코드 발송<br/>
POST /api/auth/email/send<br/>
요청<br/>
{<br/>
    "email": "user@example.com"<br/>
}<br/>

### 이메일 인증코드 확인<br/>
요청<br/>
POST /api/auth/email/verify<br/>

{<br/>
    "email": "user@example.com",<br/>
    "code": "A1B2C3D4"<br/>
}<br/>

(이메일 템플릿 미적용)<br/>

### 회원가입<br/>
POST /api/auth/signup<br/>
요청<br/>
{<br/>
    "email": "user@example.com",<br/>
    "password" : "abcd1234!",<br/>
    "nickname" :"다람띠"<br/>
}<br/>
조건 : 비밀번호는 영문, 숫자, 특수문자 포함 8자 이상<br/>


### 로그인<br/>
POST /api/auth/login<br/>
요청<br/>
{<br/>
    "email": "user@example.com",<br/>
    "password" : "abcd1234!",<br/>
}<br/>
Refresh Token → HttpOnly Cookie방식<br/>

### refreshtoken으로 accesstoken재발급<br/>
POST api/auth/refresh<br/>
응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJ3b3Jrc2ltdUBuYXZlci5jb20iLCJpYXQiOjE3NjYwNjE3MTUsImV4cCI6MTc2NjA3MjUxNX0.mTJ7ZvZOZ9a8lgqE-uPtpXseWqPdpsB3FCb6MFWEU-Y"<br/>
}<br/>

### 로그아웃<br/>
POST api/auth/logout<br/>

### 회원 탈퇴
DELETE api/auth<br/>
성공<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": null<br/>
}<br/>

### 비번 재설정 - 코드요청<br/>
POST/api/auth/password/reset-request<br/>
{<br/>
"email":"worksimu@naver.com"<br/>
}<br/>
### 비번 재설정 <br/>
POST/api/auth/password/reset<br/>
{<br/>
"email":"worksimu@naver.com",<br/>
"code":"CPL3DFWL",<br/>
"newPassword": "abcd123!"<br/>
}<br/>

## github<br/>
### 유효한 깃허브 유저네임인지 조회<br/>
GET api/github/validate<br/>
http://localhost:8080/api/github/validate?username=simuneu<br/>
성공시<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": {<br/>
"valid": true,<br/>
"username": "simuneu",<br/>
"avatarUrl": "https://github.com/simuneu.png",<br/>
"message": "존재하는 GitHub 사용자입니다."<br/>
}<br/>
}<br/>


### 기본 연동<br/>
POST api/github/connect-basic<br/>
요청<br/>
{<br/>
"username": "simuneu"<br/>
}<br/>
성공 응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": {<br/>
"connected": true,<br/>
"type": "BASIC",<br/>
"username": "simuneu",<br/>
"avatarUrl": "https://avatars.githubusercontent.com/u/191446770?v=4",<br/>
"message": "기본 연동이 완료되었습니다."<br/>
}<br/>
}<br/>

### pat 연동<br/>
POST api/github/connect-pat<br/>
요청<br/>
{<br/>
"username": "simuneu",<br/>
"pat":"pat입력"<br/>
}<br/>
성공 응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": {<br/>
"connected": true,<br/>
"type": "FULL",<br/>
"message": "github full연동 완료"<br/>
}<br/>
}<br/>
pat - 암호화되어 저장<br/>


#### pat생성 안내 가이드<br/>
https://github.com/settings/tokens?type=beta 이동<br/>
[Generate new token] 버튼을 클릭<br/>
토큰 이름(Name)을 입력<br/>
만료 기간(Expiration)을 선택<br/>
Repository access 선택 , All repositories 또는 필요한 레포만 선택<br/>
#### Repository permissions<br/>
Contents: Read-only<br/>
Metadata: Read-only<br/>
#### User permissions<br/>
Email addresses: Read-only<br/>
Profile: Read-only<br/>
페이지 하단에서 **[Generate token]**을 클릭합니다.<br/>
생성된 토큰 값을 입력 안내<br/>

### pat 연동 해제<br/>
DELETE api/github/pat<br/>
성공응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": {<br/>
"connected": true,<br/>
"type": "BASIC",<br/>
"message": "PAT연동 해제"<br/>
}<br/>
}<br/>

### 레포 가져오기<br/>
GET api/github/repos<br/>
요청 body없음(토큰만 필요)<br/>
응답 예시<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": [<br/>
{<br/>
"repoId": 1059981952,<br/>
"repoName": "bid-N-buy-backend",<br/>
"fullName": "bid-N-buy/bid-N-buy-backend",<br/>
"description": "[Bid&Buy] 중고거래에 실시간 경매를 더한 새로운 거래 서비스",<br/>
"htmlUrl": "https://github.com/bid-N-buy/bid-N-buy-backend",<br/>
"language": "Java",<br/>
"stargazersCount": 0,<br/>
"forksCount": 2,<br/>
"updatedAt": "2025-12-09T08:40:29Z",<br/>
"private": false<br/>
}]}<br/>

## project<br/>

### 프로젝트 등록<br/>
POST api/projects<br/>
요청<br/>
{<br/>
"owner": "simuneu",<br/>
"repoName": "front-practice",<br/>
"repoUrl": "https://github.com/simuneu/front-practice"<br/>
}<br/>
--현재 pat설정 경우 퍼블릭, 프라이빗 둘 다 등록 가능,오가닉에 관한 부분은 다시 확인 필요<br/>

### 프로젝트 필드 직접 등록<br/>
PUT api/projects/{projectId}/meta<br/>
요청값<br/>
{<br/>
"title": "프로젝트",<br/>
"description": "프로젝트트 설명",<br/>
"techStack": ["Spring Boot", "MySQL", "Redis", "FCM"],<br/>
"startDate": "2025-12-01",<br/>
"targetDate": "2025-12-31"<br/>
}<br/>

### 프로젝트 리스트 조회 -- 진행률 포함<br/>
GET api/projects<br/>
성공 응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": [<br/>
{<br/>
"projectId": 5,<br/>
"owner": "simuneu",<br/>
"repoName": "budgie_backend",<br/>
"repoUrl": "https://github.com/simuneu/budgie_backend",<br/>
"active": true,<br/>
"createdAt": "2025-12-18T22:05:55.046094",<br/>
"title": null,<br/>
"status": "IN_PROGRESS",<br/>
"techStack": [],<br/>
"totalCommits": 0,<br/>
"lastCommitAt": null,<br/>
"startDate": null,<br/>
"targetDate": null,<br/>
"progressRate": 0<br/>
},<br/>
{<br/>
"projectId": 6,<br/>
"owner": "simuneu",<br/>
"repoName": "java-pr",<br/>
"repoUrl": "https://github.com/simuneu/java-pr",<br/>
"active": true,<br/>
"createdAt": "2025-12-18T22:06:35.643923",<br/>
"title": "프로젝트",<br/>
"status": "IN_PROGRESS",<br/>
"techStack": [<br/>
"Spring Boot",<br/>
"Java"<br/>
],<br/>
"totalCommits": 0,<br/>
"lastCommitAt": null,<br/>
"startDate": "2025-12-01",<br/>
"targetDate": "2025-12-31",<br/>
"progressRate": 56<br/>
}<br/>
]<br/>
}<br/>

### 프로젝트 상태 변경<br/>
PATCH /api/projects/{projectId}/status<br/>
요청<br/>
{<br/>
"status": "COMPLETED"<br/>
}<br/>

### 프로젝트 상세조회<br/>
GET /api/projects/{projectId}<br/>
성공응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": {<br/>
"projectId": 6,<br/>
"owner": "simuneu",<br/>
"repoName": "java-pr",<br/>
"repoUrl": "https://github.com/simuneu/java-pr",<br/>
"title": "프로젝트",<br/>
"description": "프로젝트트 설명",<br/>
"techStack": [<br/>
"Spring Boot",<br/>
"Java"<br/>
],<br/>
"startDate": "2025-12-01",<br/>
"targetDate": "2025-12-31",<br/>
"status": "IN_PROGRESS",<br/>
"active": true,<br/>
"createdAt": "2025-12-18T22:06:35.643923",<br/>
"totalCommit": 0,<br/>
"lastCommitAt": null<br/>
}<br/>
}<br/>

### 프로젝트 활성, 비활성<br/>
PATCH /api/projects/{projectId}/active<br/>
요청<br/>
{<br/>
"active": false<br/>
}<br/>
true면 활성화, false면 비활성화(소프트 딜리트)<br/>



## Commit<br/>

### 커밋 동기화<br/>
POST api/projects/{projectId}/commits/sync<br/>
성공 응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": 28<br/>
}<br/>

### 커밋 수 전체 조회<br/>
GET api/projects/{projectId}/commits/count<br/>
성공 응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": 28<br/>
}<br/>

### 최근 커밋 날짜 조회<br/>
GET api/projects/{projectId}/commits/latest<br/>
성공 응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": "2025-10-19T09:51:17"<br/>
}<br/>

### 커밋 (프로젝트)전체 통계 -- 파이썬 서버 실행 필요<br/>
GET api/projects/{projectId}/commits/summary<br/>
성공 응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": {<br/>
"projectId": 6,<br/>
"totalCommits": 28,<br/>
"latestCommitDate": "2025-10-19T09:51:17",<br/>
"commitsThisWeek": 0,<br/>
"mostActiveDay": "Wednesday"<br/>
}<br/>
}<br/>

### 커밋 위클리 집계 -- 파이썬 서버 실행 필요<br/>
GET /api/projects/{projectId}/commits/weekly<br/>
성공 응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": [<br/>
{<br/>
"dayOfWeek": 4,<br/>
"count": 1<br/>
},<br/>
{<br/>
"dayOfWeek": 3,<br/>
"count": 2<br/>
},<br/>
{<br/>
"dayOfWeek": 2,<br/>
"count": 2<br/>
}<br/>
]<br/>
}<br/>

### 커밋 히스토리<br/>
GET /api/projects/{projectId}/commits/history<br/>
성공응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": [<br/>
{<br/>
"date": "2025-11-24",<br/>
"count": 8<br/>
},<br/>
{<br/>
"date": "2025-11-25",<br/>
"count": 2<br/>
},<br/>
{<br/>
"date": "2025-11-27",<br/>
"count": 3<br/>
}<br/>
]<br/>
}<br/>

### 커밋 전체 보기(전체지만 최근 30개만 가져와지고 필요 시 전체로 수정)<br/>
GET /api/projects/{projectId}/commits<br/>
성공응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": [<br/>
{<br/>
"sha": "f40e9c6f84e3191ab6e902a14b6fd7705ed3bc8a",<br/>
"message": "fix:refresh설정 수정",<br/>
"authorName": "simuneu",<br/>
"authorEmail": "worksimu@gmail.com",<br/>
"commitDate": "2025-12-17T13:27:11"<br/>
},<br/>
{<br/>
"sha": "a1740bd609d32af1868e3264d5b2470681ce08fd",<br/>
"message": "fix:요일별 소비 패턴 계산 기준 통일 및 undefined 오류 수정",<br/>
"authorName": "simuneu",<br/>
"authorEmail": "worksimu@gmail.com",<br/>
"commitDate": "2025-12-16T15:50:07"<br/>
}]}<br/>

## user<br/>

### 비번 변경<br/><br/>
PATCH api/users/me/password<br/>
요청<br/>
{<br/>
"currentPassword": "abcd1234!",<br/>
"newPassword": "abcd1234!!",<br/>
"newPasswordConfirm": "abcd1234!!"<br/>
}<br/>

### 내 정보 조회<br/>
GET api/users/me<br/>
응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": {<br/>
"userId": 3,<br/>
"email": "worksimu@naver.com",<br/>
"nickname": "다람띠",<br/>
"githubUsername": "simuneu"<br/>
}<br/>
}<br/>

### 닉네임 수정<br/>
PUT api/users/me<br/>
요청 <br/>
{<br/>
"nickname":"고래"<br/>
}<br/>
응답<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": {<br/>
"userId": 3,<br/>
"email": "worksimu@naver.com",<br/>
"nickname": "고래",<br/>
"githubUsername": "simuneu"<br/>
}<br/>
}<br/>


## Dashboard
### Dashboard 조회 <br/>
GET api/dashboard<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": {<br/>
"summary": {<br/>
"inProgressCount": 2,<br/>
"completedCount": 0,<br/>
"totalCommitsThisMonth": 8<br/>
},<br/>
"weeklyCommits": [<br/>
{<br/>
"dayOfWeek": 2,<br/>
"count": 2<br/>
},<br/>
{<br/>
"dayOfWeek": 3,<br/>
"count": 2<br/>
},<br/>
{<br/>
"dayOfWeek": 4,<br/>
"count": 1<br/>
}<br/>
],<br/>
"weekInfo": {<br/>
"startDate": "2025-12-15",<br/>
"endDate": "2025-12-21"<br/>
},<br/>
"recentProjects": [<br/>
{<br/>
"projectId": 5,<br/>
"totalCommits": 30,<br/>
"latestCommitDate": "2025-12-17T13:27:11",<br/>
"commitsThisWeek": 5,<br/>
"mostActiveDay": "Wednesday"<br/>
},<br/>
{<br/>
"projectId": 6,<br/>
"totalCommits": 28,<br/>
"latestCommitDate": "2025-10-19T09:51:17",<br/>
"commitsThisWeek": 0,<br/>
"mostActiveDay": "Sunday"<br/>
}<br/>
]<br/>
}<br/>
}<br/>

### 최근7일 조회 <br/>
GET /api/dashboard/recent-7-days<br/>
{<br/>
"success": true,<br/>
"message": "SUCCESS",<br/>
"data": [<br/>
{<br/>
"date": "2026-01-09",<br/>
"commitCount": 0<br/>
},<br/>
{<br/>
"date": "2026-01-10",<br/>
"commitCount": 0<br/>
},<br/>
{<br/>
"date": "2026-01-11",<br/>
"commitCount": 0<br/>
},<br/>
{<br/>
"date": "2026-01-12",<br/>
"commitCount": 0<br/>
},<br/>
{<br/>
"date": "2026-01-13",<br/>
"commitCount": 0<br/>
},<br/>
{<br/>
"date": "2026-01-14",<br/>
"commitCount": 1<br/>
},<br/>
{<br/>
"date": "2026-01-15",<br/>
"commitCount": 1<br/>
}<br/>
]<br/>
}<br/>