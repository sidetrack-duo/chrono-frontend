import {
  DashboardResponse,
  GitHubRepo,
  User,
  Project,
  ProjectListItem,
  ProjectStatus,
  CommitHistoryCount,
} from "@/types/api";

// 날짜 문자열 생성 (YYYY-MM-DD)
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// 날짜시간 문자열 생성 (ISO format)
const getDateTimeString = (daysAgo: number, hoursAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

export const mockUser: User = {
  userId: 1,
  email: "developer@example.com",
  nickname: "개발자",
  githubUsername: "testuser",
};

export const mockRepos: GitHubRepo[] = [
  {
    repoId: 1,
    repoName: "chrono",
    fullName: "testuser/chrono",
    description: "GitHub 커밋 기반 프로젝트 관리 서비스",
    htmlUrl: "https://github.com/testuser/chrono",
    isPrivate: false,
    language: "TypeScript",
    stargazersCount: 42,
    forksCount: 8,
    updatedAt: getDateTimeString(0, 2),
  },
  {
    repoId: 2,
    repoName: "portfolio",
    fullName: "testuser/portfolio",
    description: "개인 포트폴리오 웹사이트 - React와 Next.js로 구현",
    htmlUrl: "https://github.com/testuser/portfolio",
    isPrivate: false,
    language: "TypeScript",
    stargazersCount: 28,
    forksCount: 5,
    updatedAt: getDateTimeString(1, 5),
  },
  {
    repoId: 3,
    repoName: "blog",
    fullName: "testuser/blog",
    description: "기술 블로그 - Gatsby와 MDX를 활용한 정적 사이트",
    htmlUrl: "https://github.com/testuser/blog",
    isPrivate: false,
    language: "JavaScript",
    stargazersCount: 15,
    forksCount: 3,
    updatedAt: getDateTimeString(2, 10),
  },
  {
    repoId: 4,
    repoName: "ai-chatbot",
    fullName: "testuser/ai-chatbot",
    description: "OpenAI API를 활용한 챗봇 서비스",
    htmlUrl: "https://github.com/testuser/ai-chatbot",
    isPrivate: false,
    language: "Python",
    stargazersCount: 67,
    forksCount: 12,
    updatedAt: getDateTimeString(0, 8),
  },
  {
    repoId: 5,
    repoName: "mobile-app",
    fullName: "testuser/mobile-app",
    description: "React Native로 개발한 크로스 플랫폼 모바일 앱",
    htmlUrl: "https://github.com/testuser/mobile-app",
    isPrivate: false,
    language: "TypeScript",
    stargazersCount: 34,
    forksCount: 7,
    updatedAt: getDateTimeString(3, 2),
  },
  {
    repoId: 6,
    repoName: "ecommerce-platform",
    fullName: "testuser/ecommerce-platform",
    description: "풀스택 이커머스 플랫폼 - Vue.js와 Node.js",
    htmlUrl: "https://github.com/testuser/ecommerce-platform",
    isPrivate: false,
    language: "JavaScript",
    stargazersCount: 89,
    forksCount: 18,
    updatedAt: getDateTimeString(5, 15),
  },
  {
    repoId: 7,
    repoName: "data-dashboard",
    fullName: "testuser/data-dashboard",
    description: "데이터 시각화 대시보드 - D3.js와 React",
    htmlUrl: "https://github.com/testuser/data-dashboard",
    isPrivate: false,
    language: "TypeScript",
    stargazersCount: 52,
    forksCount: 9,
    updatedAt: getDateTimeString(1, 3),
  },
];

export const mockProjects: ProjectListItem[] = [
  {
    projectId: 1,
    title: "Chrono - 프로젝트 관리 서비스",
    status: ProjectStatus.IN_PROGRESS,
    techStack: "React, TypeScript, Tailwind CSS, Zustand, React Router, Axios, Vite",
    lastCommitAt: getDateTimeString(0, 2),
    totalCommits: 247,
    targetDate: getDateString(-6),
    startDate: getDateString(55),
  },
  {
    projectId: 2,
    title: "포트폴리오 웹사이트",
    status: ProjectStatus.COMPLETED,
    techStack: "Next.js, TypeScript, Tailwind CSS, Vercel",
    lastCommitAt: getDateTimeString(1, 5),
    totalCommits: 89,
    targetDate: getDateString(10),
    startDate: getDateString(40),
  },
  {
    projectId: 3,
    title: "기술 블로그",
    status: ProjectStatus.IN_PROGRESS,
    techStack: "Gatsby, MDX, GraphQL, Netlify",
    lastCommitAt: getDateTimeString(2, 10),
    totalCommits: 156,
    targetDate: getDateString(15),
    startDate: getDateString(24),
  },
  {
    projectId: 4,
    title: "AI 챗봇 프로젝트",
    status: ProjectStatus.IN_PROGRESS,
    techStack: "Python, FastAPI, OpenAI, PostgreSQL, Docker",
    lastCommitAt: getDateTimeString(0, 8),
    totalCommits: 312,
    targetDate: getDateString(21),
    startDate: getDateString(66),
  },
  {
    projectId: 5,
    title: "모바일 앱",
    status: ProjectStatus.IN_PROGRESS,
    techStack: "React Native, Expo, TypeScript, Firebase",
    lastCommitAt: getDateTimeString(3, 2),
    totalCommits: 198,
    targetDate: getDateString(-5),
    startDate: getDateString(45),
  },
  {
    projectId: 6,
    title: "E-commerce 플랫폼",
    status: ProjectStatus.COMPLETED,
    techStack: "Vue.js, Node.js, PostgreSQL, Redis, AWS",
    lastCommitAt: getDateTimeString(5, 15),
    totalCommits: 456,
    targetDate: getDateString(30),
    startDate: getDateString(116),
  },
  {
    projectId: 7,
    title: "데이터 대시보드",
    status: ProjectStatus.IN_PROGRESS,
    techStack: "D3.js, React, GraphQL, TypeScript, Material-UI",
    lastCommitAt: getDateTimeString(1, 3),
    totalCommits: 124,
    targetDate: getDateString(-1),
    startDate: getDateString(20),
  },
  {
    projectId: 8,
    title: "API 게이트웨이",
    status: ProjectStatus.COMPLETED,
    techStack: "Go, Docker, Kubernetes, gRPC",
    lastCommitAt: getDateTimeString(35, 4),
    totalCommits: 178,
    targetDate: getDateString(30),
    startDate: getDateString(86),
  },
  {
    projectId: 9,
    title: "웹 게임 프로젝트",
    status: ProjectStatus.IN_PROGRESS,
    techStack: "Phaser, TypeScript, WebSocket, Node.js",
    lastCommitAt: getDateTimeString(0, 12),
    totalCommits: 203,
    targetDate: getDateString(-1),
    startDate: getDateString(40),
  },
  {
    projectId: 10,
    title: "데이터 분석 도구",
    status: ProjectStatus.IN_PROGRESS,
    techStack: "Python, Pandas, Jupyter, Matplotlib, Streamlit",
    lastCommitAt: getDateTimeString(24, 8),
    totalCommits: 167,
    targetDate: getDateString(4),
    startDate: getDateString(76),
  },
];

export const mockProjectsDetail: Record<number, Project> = {
  1: {
    projectId: 1,
    title: "Chrono - 프로젝트 관리 서비스",
    description: "GitHub 커밋을 기반으로 사이드 프로젝트를 관리하는 서비스입니다. 프로젝트 진행 상황을 시각적으로 확인하고, 커밋 통계를 분석하여 생산성을 향상시킬 수 있습니다.",
    startDate: getDateString(55),
    targetDate: getDateString(-6),
    techStack: "React, TypeScript, Tailwind CSS, Zustand, React Router, Axios, Vite",
    status: ProjectStatus.IN_PROGRESS,
    repoName: "chrono",
    repoOwner: "testuser",
    totalCommits: 247,
    lastCommitAt: getDateTimeString(0, 2),
    github: {
      totalCommits: 247,
      lastCommitAt: getDateTimeString(0, 2),
    },
  },
  2: {
    projectId: 2,
    title: "포트폴리오 웹사이트",
    description: "개인 포트폴리오를 소개하는 웹사이트입니다. Next.js의 SSR과 SSG를 활용하여 빠른 로딩 속도를 구현했으며, 반응형 디자인으로 모든 디바이스에서 최적의 경험을 제공합니다.",
    startDate: getDateString(40),
    targetDate: getDateString(10),
    techStack: "Next.js, TypeScript, Tailwind CSS, Vercel",
    status: ProjectStatus.COMPLETED,
    repoName: "portfolio",
    repoOwner: "testuser",
    totalCommits: 89,
    lastCommitAt: getDateTimeString(1, 5),
    github: {
      totalCommits: 89,
      lastCommitAt: getDateTimeString(1, 5),
    },
  },
  3: {
    projectId: 3,
    title: "기술 블로그",
    description: "개발 경험과 학습 내용을 공유하는 기술 블로그입니다. Gatsby의 플러그인 생태계를 활용하여 MDX로 작성된 마크다운을 효율적으로 렌더링하고, GraphQL을 통해 데이터를 관리합니다.",
    startDate: getDateString(24),
    targetDate: getDateString(15),
    techStack: "Gatsby, MDX, GraphQL, Netlify",
    status: ProjectStatus.IN_PROGRESS,
    repoName: "blog",
    repoOwner: "testuser",
    totalCommits: 156,
    lastCommitAt: getDateTimeString(2, 10),
    github: {
      totalCommits: 156,
      lastCommitAt: getDateTimeString(2, 10),
    },
  },
  4: {
    projectId: 4,
    title: "AI 챗봇 프로젝트",
    description: "OpenAI API를 활용한 지능형 챗봇 서비스입니다. FastAPI로 RESTful API를 구현하고, PostgreSQL로 대화 히스토리를 저장하며, Docker를 통해 컨테이너화하여 배포합니다.",
    startDate: getDateString(66),
    targetDate: getDateString(21),
    techStack: "Python, FastAPI, OpenAI, PostgreSQL, Docker",
    status: ProjectStatus.IN_PROGRESS,
    repoName: "ai-chatbot",
    repoOwner: "testuser",
    totalCommits: 312,
    lastCommitAt: getDateTimeString(0, 8),
    github: {
      totalCommits: 312,
      lastCommitAt: getDateTimeString(0, 8),
    },
  },
  5: {
    projectId: 5,
    title: "모바일 앱",
    description: "React Native로 개발한 크로스 플랫폼 모바일 애플리케이션입니다. Expo를 활용하여 빠른 개발과 배포를 지원하며, Firebase를 통한 실시간 데이터 동기화와 푸시 알림 기능을 제공합니다.",
    startDate: getDateString(45),
    targetDate: getDateString(-5),
    techStack: "React Native, Expo, TypeScript, Firebase",
    status: ProjectStatus.IN_PROGRESS,
    repoName: "mobile-app",
    repoOwner: "testuser",
    totalCommits: 198,
    lastCommitAt: getDateTimeString(3, 2),
    github: {
      totalCommits: 198,
      lastCommitAt: getDateTimeString(3, 2),
    },
  },
  6: {
    projectId: 6,
    title: "E-commerce 플랫폼",
    description: "풀스택 이커머스 플랫폼입니다. Vue.js로 프론트엔드를 구현하고, Node.js로 백엔드를 구축했습니다. PostgreSQL로 데이터를 관리하며, Redis를 캐싱 레이어로 활용하고, AWS를 통해 인프라를 구성했습니다.",
    startDate: getDateString(116),
    targetDate: getDateString(30),
    techStack: "Vue.js, Node.js, PostgreSQL, Redis, AWS",
    status: ProjectStatus.COMPLETED,
    repoName: "ecommerce-platform",
    repoOwner: "testuser",
    totalCommits: 456,
    lastCommitAt: getDateTimeString(5, 15),
    github: {
      totalCommits: 456,
      lastCommitAt: getDateTimeString(5, 15),
    },
  },
  7: {
    projectId: 7,
    title: "데이터 대시보드",
    description: "복잡한 데이터를 시각화하는 대시보드 애플리케이션입니다. D3.js로 커스텀 차트를 구현하고, React와 TypeScript로 컴포넌트를 구성하며, GraphQL을 통해 효율적인 데이터 페칭을 수행합니다. Material-UI로 일관된 디자인을 제공합니다.",
    startDate: getDateString(20),
    targetDate: getDateString(-1),
    techStack: "D3.js, React, GraphQL, TypeScript, Material-UI",
    status: ProjectStatus.IN_PROGRESS,
    repoName: "data-dashboard",
    repoOwner: "testuser",
    totalCommits: 124,
    lastCommitAt: getDateTimeString(1, 3),
    github: {
      totalCommits: 124,
      lastCommitAt: getDateTimeString(1, 3),
    },
  },
  8: {
    projectId: 8,
    title: "API 게이트웨이",
    description: "마이크로서비스 아키텍처를 위한 API 게이트웨이입니다. Go 언어로 고성능 게이트웨이를 구현하고, Docker로 컨테이너화하며, Kubernetes로 오케스트레이션합니다. gRPC를 통한 서비스 간 통신을 지원합니다.",
    startDate: getDateString(86),
    targetDate: getDateString(30),
    techStack: "Go, Docker, Kubernetes, gRPC",
    status: ProjectStatus.COMPLETED,
    repoName: "api-gateway",
    repoOwner: "testuser",
    totalCommits: 178,
    lastCommitAt: getDateTimeString(35, 4),
    github: {
      totalCommits: 178,
      lastCommitAt: getDateTimeString(35, 4),
    },
  },
  9: {
    projectId: 9,
    title: "웹 게임 프로젝트",
    description: "Phaser 게임 엔진을 활용한 멀티플레이어 웹 게임입니다. TypeScript로 타입 안정성을 확보하고, WebSocket을 통한 실시간 통신을 구현하며, Node.js로 게임 서버를 구축했습니다.",
    startDate: getDateString(40),
    targetDate: getDateString(-1),
    techStack: "Phaser, TypeScript, WebSocket, Node.js",
    status: ProjectStatus.IN_PROGRESS,
    repoName: "web-game",
    repoOwner: "testuser",
    totalCommits: 203,
    lastCommitAt: getDateTimeString(0, 12),
    github: {
      totalCommits: 203,
      lastCommitAt: getDateTimeString(0, 12),
    },
  },
  10: {
    projectId: 10,
    title: "데이터 분석 도구",
    description: "데이터 과학자를 위한 분석 도구입니다. Python과 Pandas로 데이터 처리를 수행하고, Jupyter Notebook으로 인터랙티브한 분석 환경을 제공합니다. Matplotlib으로 시각화하고, Streamlit으로 웹 인터페이스를 구현했습니다.",
    startDate: getDateString(76),
    targetDate: getDateString(4),
    techStack: "Python, Pandas, Jupyter, Matplotlib, Streamlit",
    status: ProjectStatus.IN_PROGRESS,
    repoName: "data-analysis-tool",
    repoOwner: "testuser",
    totalCommits: 167,
    lastCommitAt: getDateTimeString(24, 8),
    github: {
      totalCommits: 167,
      lastCommitAt: getDateTimeString(24, 8),
    },
  },
};

export const mockProject: Project = mockProjectsDetail[1];

export const mockWeeklyCommits = [
  { dayOfWeek: 1, count: 5 },
  { dayOfWeek: 2, count: 8 },
  { dayOfWeek: 3, count: 10 },
  { dayOfWeek: 4, count: 12 },
  { dayOfWeek: 5, count: 15 },
  { dayOfWeek: 6, count: 3 },
  { dayOfWeek: 7, count: 2 },
];

export const mockCommitSummary = {
  projectId: 1,
  totalCommits: 247,
  latestCommitDate: getDateTimeString(0, 2),
  commitsThisWeek: 55,
  mostActiveDay: "금요일",
};

export const mockCommitHistory: CommitHistoryCount[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const dayOfWeek = date.getDay();
  
  // 주말은 적게, 주중은 많게
  let count = 0;
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    count = Math.floor(Math.random() * 3) + 1;
  } else {
    count = Math.floor(Math.random() * 8) + 3;
  }
  
  return {
    date: date.toISOString().split("T")[0],
    count,
  };
});

export const mockDashboard: DashboardResponse = {
  summary: {
    inProgressCount: 7,
    completedCount: 3,
    totalCommitsThisMonth: 342,
  },
  weeklyCommits: [
    { dayOfWeek: 1, count: 18 },
    { dayOfWeek: 2, count: 24 },
    { dayOfWeek: 3, count: 28 },
    { dayOfWeek: 4, count: 32 },
    { dayOfWeek: 5, count: 38 },
    { dayOfWeek: 6, count: 12 },
    { dayOfWeek: 7, count: 8 },
  ],
  weekInfo: {
    startDate: getDateString(6),
    endDate: getDateString(0),
  },
  recentProjects: mockProjects.slice(0, 3),
};
