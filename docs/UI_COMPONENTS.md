# 🧩 UI_COMPONENTS.md

**프로젝트:** Chrono
**버전:** v1.0
**참고:** `DESIGN_TOKENS.md`

---

## 목차

1. [Buttons](#1-buttons)
2. [Cards](#2-cards)
3. [Forms](#3-forms)
4. [Badges](#4-badges)
5. [Navigation](#5-navigation)
6. [랜딩 페이지 컴포넌트](#6-랜딩-페이지-컴포넌트)
7. [기타 스타일 가이드](#7-기타-스타일-가이드)

---

## 1. Buttons

### Button Component 사용법
```tsx
import { Button } from "@/components/common/Button";

// Primary (기본)
<Button variant="primary" size="md">생성하기</Button>

// Secondary
<Button variant="secondary">취소</Button>

// Outline
<Button variant="outline">더 알아보기</Button>

// Ghost
<Button variant="ghost">취소</Button>

// Size 옵션
<Button size="sm">작은 버튼</Button>
<Button size="md">기본 버튼</Button>
<Button size="lg">큰 버튼</Button>

// Loading State
<Button isLoading={true}>로딩 중...</Button>

// 아이콘과 함께
<Button leftIcon={<Icon />}>아이콘 버튼</Button>
```

### 랜딩 페이지 전용 버튼 스타일
```tsx
// Hero CTA 버튼 (큰 버튼)
<Link className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 text-base font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg">
  <Github className="h-5 w-5" />
  GitHub로 시작하기
</Link>

// Secondary CTA 버튼
<Link className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900">
  더 알아보기
</Link>

// CTA 섹션 버튼
<Link className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/20">
  무료로 시작하기
  <ArrowRight className="h-5 w-5" />
</Link>
```

---

## 2. Cards

### Basic Card
```tsx
<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
  {/* Content */}
</div>
```

### Interactive Card (Hover Effect)
```tsx
<div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md">
  {/* Content */}
</div>
```

### Dashboard Summary Card
```tsx
<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
  <div className="mb-2 text-sm text-gray-500">이번 달 커밋</div>
  <div className="text-4xl font-bold text-primary">108</div>
</div>
```

### Feature Card (랜딩 페이지)
```tsx
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
      <p className="leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
```

---

## 3. Forms

### Text Input
```tsx
<div className="space-y-1.5">
  <label className="block text-sm font-medium text-gray-700">Label</label>
  <input
    type="text"
    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
    placeholder="Placeholder"
  />
</div>
```

### Select
```tsx
<select className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none">
  <option>Option 1</option>
</select>
```

---

## 4. Badges

### Status Badges
```tsx
/* 진행중 */
<span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary">
  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
  진행중
</span>

/* 완료 */
<span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
  <span className="h-1.5 w-1.5 rounded-full bg-green-700"></span>
  완료
</span>
```

---

## 5. Navigation

### Navbar - 랜딩 페이지 메뉴
```tsx
{/* 랜딩 페이지일 때 */}
<div className="flex items-center gap-3 md:gap-4">
  <Link
    to="/login"
    className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
  >
    로그인
  </Link>
  <Link to="/signup">
    <Button size="sm" className="text-sm font-medium px-3 md:px-4">
      무료로 시작하기
    </Button>
  </Link>
</div>
```

### Navbar - 앱 페이지 메뉴 (데스크톱)
```tsx
{/* 데스크톱 네비게이션 */}
<div className="hidden items-center gap-1 md:flex">
  <Link
    to="/dashboard"
    className={cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    )}
  >
    대시보드
  </Link>
  <Link
    to="/projects"
    className={cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    )}
  >
    프로젝트
  </Link>
</div>

{/* 데스크톱 우측 메뉴 */}
<div className="hidden items-center gap-2 md:flex">
  <Link
    to="/settings"
    className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
    aria-label="Settings"
  >
    <Settings className="h-5 w-5" />
  </Link>
  <div className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-gray-200 flex">
    <span className="text-sm font-medium text-gray-700">U</span>
  </div>
</div>
```

### Navbar - 모바일 메뉴
```tsx
{/* 모바일 메뉴 버튼 */}
<div className="flex items-center gap-2 md:hidden">
  <Link to="/settings" className="rounded-lg p-2 text-gray-700 hover:bg-gray-100">
    <Settings className="h-5 w-5" />
  </Link>
  <div className="h-8 w-8 items-center justify-center rounded-full bg-gray-200 flex">
    <span className="text-sm font-medium text-gray-700">U</span>
  </div>
  <button
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
  >
    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
  </button>
</div>

{/* 모바일 드롭다운 메뉴 */}
{isMobileMenuOpen && (
  <div className="border-t border-gray-100 bg-white md:hidden">
    <div className="mx-auto max-w-6xl px-4 py-2">
      <Link
        to="/dashboard"
        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        대시보드
      </Link>
      <Link
        to="/projects"
        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        프로젝트
      </Link>
    </div>
  </div>
)}
```

**주요 특징:**
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 랜딩 페이지와 앱 페이지에서 다른 메뉴 표시
- 모바일 햄버거 메뉴 지원
- 활성 상태 표시 (`bg-primary-50 text-primary`)

---

## 6. 랜딩 페이지 컴포넌트

### Hero Section
```tsx
<section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32">
  {/* 배경 블러 효과 */}
  <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"></div>
  
  {/* 태블릿 배경 이미지 (전체 배경) */}
  <div className="absolute inset-0 pointer-events-none hidden md:block lg:hidden">
    {/* 그라데이션 마스크 적용 */}
    <img src="/hero-bg.jpg" className="h-full w-full object-cover opacity-80" />
    <div className="absolute inset-0 bg-white/20"></div>
  </div>
  
  {/* 데스크톱 배경 이미지 (오른쪽 정렬) */}
  <div className="absolute inset-0 pointer-events-none hidden lg:block">
    <div className="absolute inset-0 left-1/2 overflow-hidden">
      <img src="/hero-bg.jpg" className="h-[650px] w-auto max-w-[50vw] object-cover rounded-2xl" />
    </div>
    <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-transparent via-white/10 to-white/25"></div>
  </div>
  
  {/* 콘텐츠 */}
  <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
    <div className="max-w-2xl text-center md:text-left">
      {/* 배지 */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </span>
        사이드 프로젝트 관리를 위한 최고의 도구
      </div>
      
      {/* 제목 */}
      <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl lg:leading-tight">
        문서가 아닌 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">코드 활동</span>으로<br />
        프로젝트를 증명하세요.
      </h1>
      
      {/* 설명 */}
      <p className="mb-10 text-lg text-gray-600 md:text-xl">
        GitHub 커밋 데이터를 기반으로 당신의 개발 활동을 시각화합니다.<br className="hidden md:block" />
        chrono와 함께 사이드 프로젝트의 성장을 기록해보세요.
      </p>
      
      {/* CTA 버튼 */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start md:items-start">
        {/* 버튼들 */}
      </div>
    </div>
  </div>
</section>
```

### CTA Section
```tsx
<section className="py-20 md:py-32">
  <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
      지금 바로 시작해보세요
    </h2>
    <p className="mb-8 text-gray-600">
      개발자의 성장은 기록에서 시작됩니다. chrono가 함께합니다.
    </p>
    <Link
      to="/signup"
      className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/20"
    >
      무료로 시작하기
      <ArrowRight className="h-5 w-5" />
    </Link>
  </div>
</section>
```

---

## 7. 기타 스타일 가이드

### 반응형 디자인
- 모든 컴포넌트는 모바일 우선 (Mobile First)
- Breakpoint: `md:` (768px), `lg:` (1024px)
- 컨테이너 최대 너비: `max-w-6xl`
- 랜딩 페이지 Hero: 모바일(이미지 없음) → 태블릿(전체 배경) → 데스크톱(오른쪽 정렬)

### 접근성
- 포커스 링: `focus:ring-2 focus:ring-primary focus:ring-offset-2`
- 버튼 비활성화: `disabled:opacity-50 disabled:cursor-not-allowed`
- ARIA 레이블 사용 권장 (`aria-label="Settings"`)

### 그라데이션 효과
- 텍스트 그라데이션: `text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark`
- 배경 오버레이: `bg-gradient-to-l from-transparent via-white/10 to-white/25`

