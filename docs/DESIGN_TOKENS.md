# 🎨 DESIGN_TOKENS.md

**프로젝트:** Chrono
**버전:** v1.0

---

## 🎨 1. Color System

### Primary (Teal)
- **Main**: `#35c1b7` (버튼, 링크, 강조 텍스트, 그래프)
- **Light**: `#56d4ca`
- **Dark**: `#2a9d93` (Hover 상태)
- **Bg**: `#F0FDFC` (배경, 뱃지)

### Accent (Coral)
- **Main**: `#FF7D69` (강조, 알림, 중요 요소)
- **Light**: `#FF9D8A`
- **Dark**: `#F5604C` (Hover 상태)
- **Bg**: `#FFF5F5` (배경, 뱃지)

### Gray Scale
- **Text Main**: `#1F2937` (`gray-800`)
- **Text Sub**: `#6B7280` (`gray-500`)
- **Border**: `#E5E7EB` (`gray-200`)
- **Bg Base**: `#F9FAFB` (`gray-50`)
- **Bg White**: `#FFFFFF` (`white`)

### Status
- **Success**: `#10B981` (완료, GitHub 잔디)
- **Error**: `#EF4444` (에러, 삭제)

---

## ✏️ 2. Typography

### Font Family
- **Primary**: `Pretendard` (CDN 사용)
- Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

### Text Sizes
- **H1 (Page Title)**: `text-2xl md:text-3xl font-bold`
- **H1 (Hero Title)**: `text-4xl font-bold md:text-6xl` (랜딩 페이지)
- **H2 (Section Title)**: `text-xl font-semibold` 또는 `text-3xl font-bold md:text-4xl`
- **H3 (Card Title)**: `text-base font-semibold` 또는 `text-xl font-bold`
- **Body**: `text-sm text-gray-700` 또는 `text-lg text-gray-600 md:text-xl`
- **Caption**: `text-xs text-gray-500`
- **Number Emphasis**: `text-3xl md:text-4xl font-bold text-primary`
- **Logo Text**: `text-2xl md:text-3xl font-extrabold tracking-[-0.015em]`

---

## 📏 3. Spacing & Layout

### Container
- **Max Width**: `max-w-6xl`
- **Padding**: `px-4 md:px-6`

### Spacing Scale
- **xs**: `4px` (`gap-1`)
- **sm**: `8px` (`gap-2`)
- **md**: `12px` (`gap-3`)
- **lg**: `16px` (`gap-4`) - **Default Card Gap**
- **xl**: `24px` (`gap-6`)
- **2xl**: `32px` (`gap-8`)

### Radius
- **Card/Modal**: `rounded-xl`
- **Button/Input**: `rounded-lg`
- **Badge**: `rounded-full` (또는 `rounded-md`)

### Shadow
- **Navbar**: `shadow-xs` (0 1px 2px 0 rgb(0 0 0 / 0.05))
- **Card**: `shadow-sm` (기본 카드)
- **Hover Card**: `shadow-md` (호버 시)

---

## 📱 4. Breakpoints (Tailwind Default)
- **sm**: `640px`
- **md**: `768px` (Tablet/Mobile 구분점)
- **lg**: `1024px`
- **xl**: `1280px`

