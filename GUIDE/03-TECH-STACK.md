# Tech Stack — เทคโนโลยีที่ใช้ในโปรเจกต์

เอกสารนี้อธิบาย technology ทุกตัวที่โปรเจกต์ใช้ พร้อมเหตุผลและ version ที่ระบุ

---

## สารบัญ

1. [Stack Overview](#1-stack-overview)
2. [Core Framework](#2-core-framework)
3. [Styling](#3-styling)
4. [Icons](#4-icons)
5. [Language & Tooling](#5-language--tooling)
6. [External Services](#6-external-services)
7. [Version Summary](#7-version-summary)

---

## 1. Stack Overview

```
┌──────────────────────────────────────────────────────┐
│                     Frontend Stack                    │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │                  Nuxt 3                         │  │
│  │            (Meta-framework for Vue)             │  │
│  │                                                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │  Vue 3   │  │Vue Router│  │  TypeScript   │  │  │
│  │  │  3.5.13  │  │  4.5.0   │  │    5.8.3     │  │  │
│  │  └──────────┘  └──────────┘  └──────────────┘  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
│  ┌───────────────┐  ┌──────────────────────────────┐  │
│  │  TailwindCSS  │  │  Nuxt Icon + Iconify         │  │
│  │   (Styling)   │  │  (mdi + logos collections)    │  │
│  └───────────────┘  └──────────────────────────────┘  │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │  External: Google Fonts (Inter, JetBrains Mono)  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
│         ▼ HTTP (fetch / $fetch) ▼                     │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Backend API  (ไม่รวมในโปรเจกต์นี้)               │ │
│  │  GET /api/v1/public/sites/by-domain              │ │
│  │  GET /api/v1/public/sites/{siteId}/portfolio     │ │
│  │  POST /api/v1/public/sites/{siteId}/portfolio/contacts │ │
│  │  Static files: /uploads/*                        │ │
│  └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 2. Core Framework

### Nuxt 3 (`^3.17.0`)

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **คืออะไร** | Meta-framework สร้างบน Vue 3 ที่เพิ่ม SSR, file-based routing, auto-imports และอื่นๆ |
| **ทำไมใช้** | จัดการ routing, head management, data fetching, และ build optimization ให้อัตโนมัติ |
| **ใช้ทำอะไร** | เป็น foundation ของ app ทั้งหมด |

**Nuxt Features ที่ใช้ในโปรเจกต์:**

| Feature | อธิบาย | ใช้ที่ |
| ------- | ------ | ------ |
| File-based routing | `pages/index.vue` → route `/` | `pages/` |
| Auto-imports | Vue APIs, composables, components ไม่ต้อง import | ทุกไฟล์ |
| `useFetch` | SSR-safe data fetching พร้อม deduplication | `usePortfolioData.ts` |
| `useState` | Shared state ข้าม components (SSR-compatible) | `useTheme.ts` |
| `useHead` | จัดการ `<head>` tags (title, meta) แบบ reactive | `index.vue`, `useTheme.ts` |
| `useRuntimeConfig` | อ่าน environment variables | `usePortfolioData.ts`, `SectionContact.vue` |
| `<NuxtLayout>` | Layout system | `app.vue` |
| `<NuxtPage>` | Page rendering | `app.vue` |
| Nuxt Modules | ระบบ plugin ของ Nuxt | `nuxt.config.ts` |
| Nuxt DevTools | เครื่องมือ debug สำหรับ development | `nuxt.config.ts` |

---

### Vue 3 (`^3.5.13`)

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **คืออะไร** | Progressive JavaScript framework สำหรับสร้าง UI |
| **ทำไมใช้** | Reactivity system, component architecture, Composition API |
| **ใช้ทำอะไร** | สร้าง UI components ทั้งหมด |

**Vue 3 Features ที่ใช้:**

| Feature | อธิบาย | ใช้ที่ |
| ------- | ------ | ------ |
| `<script setup>` | Composition API shorthand | ทุก `.vue` file |
| `ref()` | Reactive primitive value | Navbar scroll, mobile menu, skill filter |
| `reactive()` | Reactive object | Contact form data |
| `computed()` | Derived reactive value | ทุก composable, skill filtering |
| `watch()` | Watch reactive source | `useTheme.ts` (watch apiVersion) |
| `readonly()` | ป้องกัน mutation จากภายนอก | `useTheme.ts` (return theme) |
| `onMounted()` | Lifecycle hook: component mounted | Navbar (scroll listener) |
| `onUnmounted()` | Lifecycle hook: component destroyed | Navbar (cleanup listener) |
| `<Transition>` | Animation wrapper | Navbar mobile menu, ThemeToggle |
| `v-for` / `v-if` | Template directives | ทุก section component |
| `v-model` | Two-way binding | Contact form inputs |
| `defineProps<T>()` | Type-safe props | `ProfileAvatar.vue` |

---

### Vue Router (`^4.5.0`)

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **คืออะไร** | Official router สำหรับ Vue.js |
| **ทำไมใช้** | Nuxt ต้องการเป็น dependency — แม้โปรเจกต์มีหน้าเดียว |
| **ใช้ทำอะไร** | จัดการ routing (มีแค่ route `/` เดียว) |

> โปรเจกต์นี้ใช้ in-page anchor links (`#about`, `#skills`) แทน Vue Router navigation

---

## 3. Styling

### TailwindCSS (ผ่าน `@nuxtjs/tailwindcss` `^6.13.2`)

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **คืออะไร** | Utility-first CSS framework |
| **ทำไมใช้** | เขียน style ได้เร็ว, consistent design system, tree-shakeable |
| **ใช้ทำอะไร** | Styling ทั้งหมดของ app |

**การใช้งานในโปรเจกต์:**

| ส่วน | อธิบาย |
| ---- | ------ |
| Utility classes | Layout, spacing, colors, typography ใน template |
| Custom theme | Extended colors (`primary`, `surface`, `th.*`), fonts, animations ใน `tailwind.config.ts` |
| CSS variables | Theme system ใช้ CSS vars ที่ Tailwind อ่านผ่าน `rgb(var(--t-*) / <alpha-value>)` |
| Component classes | `.section-container`, `.section-padding`, `.gradient-text`, `.glass-card` |
| Responsive | Mobile-first ด้วย `sm:`, `md:`, `lg:` breakpoints |

### Google Fonts (External CDN)

| Font | ใช้ที่ | ทำไม |
| ---- | ------ | ---- |
| **Inter** (300–800) | `font-sans` — body text ทั้งหมด | Modern, readable sans-serif |
| **JetBrains Mono** (400–500) | `font-mono` — code-style labels | Monospace สำหรับ accent text |

โหลดผ่าน `<link>` ใน `nuxt.config.ts` พร้อม `preconnect` สำหรับ performance

---

## 4. Icons

### Nuxt Icon (`@nuxt/icon` `^1.12.0`)

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **คืออะไร** | Nuxt module สำหรับ render Iconify icons |
| **ทำไมใช้** | ใช้ icon ได้ง่ายผ่าน `<Icon name="..." />` |
| **ใช้ทำอะไร** | แสดง icon ทั้งหมดในเว็บ |

### Iconify Collections

| Collection | Package | ตัวอย่าง | ใช้ที่ |
| ---------- | ------- | -------- | ------ |
| **Material Design Icons** | `@iconify-json/mdi` `^1.2.3` | `mdi:github`, `mdi:menu`, `mdi:check-circle` | Navbar, Footer, Contact, Experience |
| **Tech Logos** | `@iconify-json/logos` `^1.2.11` | `logos:vue`, `logos:go`, `logos:docker-icon` | Skills section |

**วิธีใช้:**
```vue
<Icon name="mdi:github" size="24" />
<Icon :name="skill.icon" size="36" />
```

Icon names ส่วนใหญ่มาจาก **API data** (field `icon` ของ skills และ social_links)

---

## 5. Language & Tooling

### TypeScript (`^5.8.3`)

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **คืออะไร** | Typed superset ของ JavaScript |
| **ทำไมใช้** | Type safety, better IDE support, catch bugs at compile time |
| **ใช้ทำอะไร** | ทุกไฟล์ `.ts` และ `<script setup lang="ts">` ใน `.vue` |

**Type definitions ในโปรเจกต์:**
- `types/portfolio.ts` — interfaces สำหรับ API data
- `@types/node` (`^25.6.0`) — Node.js type definitions

### Node.js

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **ต้องการ** | Node.js 18+ (แนะนำ 20 LTS หรือสูงกว่า) |
| **ใช้ทำอะไร** | รัน Nuxt dev server, build, และ generate |

### npm

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **คืออะไร** | Package manager ของ Node.js |
| **ใช้ทำอะไร** | จัดการ dependencies (มี `package-lock.json` อยู่แล้ว) |

---

## 6. External Services

### Backend API

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **ไม่รวม** ในโปรเจกต์นี้ | ต้องสร้างหรือ deploy แยก |
| **Default URL** | `http://localhost:8080` (ตั้งผ่าน env `NUXT_PUBLIC_API_BASE_URL`) |
| **Endpoints** | `GET /api/v1/public/sites/by-domain`, `GET /api/v1/public/sites/{siteId}/portfolio`, `POST /api/v1/public/sites/{siteId}/portfolio/contacts` |
| **Static Files** | `/uploads/*` สำหรับรูปภาพ |
| **API Spec** | ดูรายละเอียดใน `PORTFOLIO_FRONTEND_SPEC.md` |

### Google Fonts CDN

| หัวข้อ | รายละเอียด |
| ------ | ---------- |
| **URL** | `fonts.googleapis.com` + `fonts.gstatic.com` |
| **โหลดเมื่อ** | Page load (ผ่าน `<link>` tag) |
| **Fonts** | Inter, JetBrains Mono |

---

## 7. Version Summary

### Dependencies (Production)

| Package | Version | หน้าที่ |
| ------- | ------- | ------- |
| `nuxt` | `^3.17.0` | Meta-framework |
| `vue` | `^3.5.13` | UI framework |
| `vue-router` | `^4.5.0` | Routing |

### DevDependencies (Development Only)

| Package | Version | หน้าที่ |
| ------- | ------- | ------- |
| `@nuxtjs/tailwindcss` | `^6.13.2` | TailwindCSS integration สำหรับ Nuxt |
| `@nuxt/icon` | `^1.12.0` | Icon component สำหรับ Nuxt |
| `@iconify-json/mdi` | `^1.2.3` | Material Design Icons collection |
| `@iconify-json/logos` | `^1.2.11` | Tech logos icon collection |
| `typescript` | `^5.8.3` | TypeScript compiler |
| `@types/node` | `^25.6.0` | Node.js type definitions |

### Runtime Requirements

| สิ่งที่ต้องมี | Version | หมายเหตุ |
| ------------ | ------- | -------- |
| Node.js | 18+ (แนะนำ 20 LTS) | รัน Nuxt |
| npm | 9+ | จัดการ packages |
| Backend API | ไม่ระบุ | ดู `PORTFOLIO_FRONTEND_SPEC.md` |
| Browser | Modern browsers | Chrome, Firefox, Safari, Edge (ล่าสุด) |

---

## Technology Decision Matrix

| ความต้องการ | เลือกใช้ | เหตุผล |
| ---------- | -------- | ------ |
| UI Framework | Vue 3 + Nuxt 3 | SSR support, auto-imports, DX ดี |
| Styling | TailwindCSS | Utility-first, rapid development |
| Theme System | CSS Variables + Tailwind | เปลี่ยน theme ได้ real-time ไม่ต้อง re-render |
| Icons | Iconify (via @nuxt/icon) | ใช้ icon name จาก API ได้ dynamic |
| Typography | Google Fonts CDN | โหลดเร็ว, มี font ครบ |
| Type Safety | TypeScript | จับ bug ตอน compile, IDE support |
| Data Fetching | useFetch (Nuxt) | SSR-safe, auto-deduplicate |
| State Management | useState + ref/reactive | เพียงพอสำหรับ scope นี้ (ไม่ต้อง Pinia) |
