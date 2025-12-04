import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.DEV) {
  window.__CHRONO_DEV__ = {
    setMockAuth: async () => {
      const { useAuthStore } = await import('./stores/authStore');
      useAuthStore.getState().setMockAuth({
        id: 1,
        email: 'test@example.com',
        nickname: '테스트 사용자',
        githubUsername: 'testuser'
      });
      console.log('Mock 인증 상태가 설정되었습니다.');
    },
    clearAuth: async () => {
      const { useAuthStore } = await import('./stores/authStore');
      useAuthStore.getState().logout();
      console.log('인증 상태가 초기화되었습니다.');
    }
  };
  console.log('개발 모드: __CHRONO_DEV__.setMockAuth() 또는 __CHRONO_DEV__.clearAuth() 사용 가능');
}
