# <span style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 800; font-size: 1.2em; letter-spacing: -0.015em; color: #1F2937;">chrono<span style="color: #35c1b7; font-size: 1.5em; line-height: 1;">.</span></span>

GitHub 커밋 기반 사이드 프로젝트 관리 웹 서비스

> **개발 진행 중**

## 설치 및 실행

```bash
git clone <repository-url>
cd chrono-frontend
npm install
npm run dev
```

## 환경 변수

프로젝트 루트에 `.env` 파일 생성 후 다음 내용 추가

```env
# API Base URL (백엔드 서버 URL)
VITE_API_BASE_URL=http://localhost:8080/api

# 개발 환경 전용 옵션
# VITE_USE_MOCK=true # 모킹 데이터 사용 (백엔드 개발 전)
# VITE_BYPASS_AUTH=true # 인증 우회 (개발 편의용)
```

**참고:**
- `VITE_API_BASE_URL`: 백엔드 개발 전 기본값(`http://localhost:8080/api`) 사용
- `VITE_USE_MOCK`: 개발 환경에서만 동작, 백 개발 전 모킹 데이터로 프론트 개발 진행
- `VITE_BYPASS_AUTH`: 개발 환경에서만 동작, 인증 없이 보호된 라우트 접근