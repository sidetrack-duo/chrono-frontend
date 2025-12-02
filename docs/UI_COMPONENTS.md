# 🧩 UI_COMPONENTS.md

**프로젝트:** Chrono
**버전:** v1.0
**참고:** `DESIGN_TOKENS.md`

---

## 1. Buttons

### Primary Button
```tsx
<button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#14B8A6] px-4 text-sm font-medium text-white transition-all hover:bg-[#0D9488] focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 active:scale-95 disabled:opacity-50">
  <span>생성하기</span>
</button>
```

### Secondary Button
```tsx
<button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95">
  <span>취소</span>
</button>
```

### Loading State
```tsx
/* disabled + spinner svg 추가 */
<button disabled className="...">
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">...</svg>
  <span>로딩 중...</span>
</button>
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
  <div className="text-4xl font-bold text-[#14B8A6]">108</div>
</div>
```

---

## 3. Forms

### Text Input
```tsx
<div className="space-y-1.5">
  <label className="block text-sm font-medium text-gray-700">Label</label>
  <input
    type="text"
    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm transition-all focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] focus:outline-none"
    placeholder="Placeholder"
  />
</div>
```

### Select
```tsx
<select className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] focus:outline-none">
  <option>Option 1</option>
</select>
```

---

## 4. Badges

### Status Badges
```tsx
/* 진행중 */
<span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-[#14B8A6]">
  <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]"></span>
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

### Navbar Layout
```tsx
<nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
  <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
    {/* Logo */}
    <div className="font-bold text-gray-900">Chrono</div>
    
    {/* Links */}
    <div className="flex gap-4">
      <a className="text-sm font-medium text-gray-600 hover:text-[#14B8A6]">Dashboard</a>
    </div>
  </div>
</nav>
```

