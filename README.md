# <img src="src/assets/chrono.svg" alt="chrono." width="180" height="50" />

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
```

**참고:**
- `VITE_API_BASE_URL`: 백엔드 서버 URL (기본값: `http://localhost:8080/api`)