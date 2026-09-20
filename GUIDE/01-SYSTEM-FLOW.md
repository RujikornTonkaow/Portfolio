# System Flow — ภาพรวมการทำงานของระบบ

เอกสารนี้อธิบาย flow การทำงานตั้งแต่ผู้ใช้เปิดเว็บจนถึงการแสดงผลทุก section

---

## สารบัญ

1. [Architecture Overview](#1-architecture-overview)
2. [Application Lifecycle](#2-application-lifecycle)
3. [Data Flow](#3-data-flow)
4. [Theme Flow](#4-theme-flow)
5. [Contact Form Flow](#5-contact-form-flow)
6. [Navigation Flow](#6-navigation-flow)
7. [Image Loading Flow](#7-image-loading-flow)

---

## 1. Architecture Overview

โปรเจกต์นี้เป็น **เว็บ single-route** สร้างด้วย **Nuxt 3** (SSR เปิดอยู่ตาม default) ที่ดึงข้อมูลจาก Backend API แล้วแสดงผลเป็น Portfolio website — มีเพียงหน้าเดียว (`/`) โดยใช้ anchor links (`#about`, `#skills`, ...) นำทางภายในหน้า

> **หมายเหตุ:** Nuxt 3 default คือ SSR (Server-Side Rendering) ไม่ใช่ SPA — HTML ถูก render ที่ server ก่อนส่งให้ browser จากนั้น Vue hydrate เป็น interactive app

เว็บนี้เป็น **multi-site public frontend**: instance เดียวกันสามารถ deploy ได้หลาย domain โดยแต่ละ domain ต้องมี record ใน backend `sites.domains` แล้ว frontend จะ resolve `siteId` จาก host ปัจจุบันก่อนดึงข้อมูล portfolio

```
┌──────────────────────────────────────────────────┐
│                    Browser                        │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │              Nuxt 3 App                     │  │
│  │                                             │  │
│  │  app.vue                                    │  │
│  │    └─ layouts/default.vue                   │  │
│  │         ├─ TheNavbar                        │  │
│  │         ├─ pages/index.vue                  │  │
│  │         │    ├─ SectionHero                 │  │
│  │         │    ├─ SectionAbout                │  │
│  │         │    ├─ SectionSkills               │  │
│  │         │    ├─ SectionProjects             │  │
│  │         │    ├─ SectionExperience           │  │
│  │         │    └─ SectionContact              │  │
│  │         └─ TheFooter                        │  │
│  │                                             │  │
│  │  Composables:                               │  │
│  │    ├─ usePortfolioData  (fetch + cache)     │  │
│  │    └─ useTheme          (theme state)       │  │
│  └─────────────────────────────────────────────┘  │
│                       │                           │
│                       │ HTTP                      │
│                       ▼                           │
│           ┌─────────────────────┐                 │
│           │   Backend API       │                 │
│           │   (port 8080)       │                 │
│           │                     │                 │
│           │  GET  /api/v1/public/sites/by-domain     │
│           │  GET  /api/v1/public/sites/{siteId}/portfolio │
│           │  POST /api/v1/public/sites/{siteId}/portfolio/contacts │
│           │  GET  /uploads/*         ← รูปภาพ        │
│           └─────────────────────┘                 │
└──────────────────────────────────────────────────┘
```

---

## 2. Application Lifecycle

### 2.1 ลำดับการโหลดเมื่อเปิดเว็บ

```
1. Browser โหลด HTML จาก Nuxt
       │
2. Inline script ทำงาน (ใน <head>)
   └── อ่าน localStorage('portfolio-theme')
   └── ใส่ class "midnight" หรือ "sunshine" ใน <html> ทันที
   └── ป้องกัน Flash of Unstyled Content (FOUC)
       │
3. Nuxt App mount
   └── app.vue → <NuxtLayout> → <NuxtPage />
       │
4. layouts/default.vue render
   ├── TheNavbar mount
   │   └── เรียก usePortfolioData() → ดึง navItems, siteSettings
   │   └── register scroll listener
   │
   ├── pages/index.vue mount
   │   ├── usePortfolioData() → trigger useAsyncData
   │   │   ├── อ่าน host ปัจจุบัน เช่น localhost:3000
   │   │   ├── GET /api/v1/public/sites/by-domain?host=localhost:3000
   │   │   ├── GET /api/v1/public/sites/{siteId}/portfolio
   │   │   └── cache ด้วย key: 'portfolio-data:{host}'
   │   │
   │   ├── useHead() → set page_title, meta_description
   │   │
   │   ├── SectionHero mount → ดึง hero, socialLinks, siteSettings
   │   ├── SectionAbout mount → ดึง about
   │   ├── SectionSkills mount → ดึง skills
   │   ├── SectionProjects mount → ดึง projects
   │   ├── SectionExperience mount → ดึง experiences
   │   └── SectionContact mount → ดึง socialLinks
   │
   └── TheFooter mount
       └── เรียก usePortfolioData() → ดึง socialLinks, siteSettings
```

### 2.2 Data Sharing ระหว่าง Components

`usePortfolioData()` ใช้ `useAsyncData` กับ key ตาม host เช่น `'portfolio-data:localhost:3000'` ซึ่ง Nuxt จะ deduplicate request:

- ทุก component ที่เรียก `usePortfolioData()` จะ **ใช้ข้อมูลชุดเดียวกัน**
- **ไม่** เกิด HTTP request ซ้ำ — Nuxt cache ไว้ตาม key
- ข้อมูลของแต่ละ domain ไม่ปะปนกัน เพราะ cache key ผูกกับ host ปัจจุบัน
- แต่ละ component เลือก slice ที่ต้องการผ่าน `computed()` เช่น `skills`, `hero`, `projects`

---

## 3. Data Flow

### 3.1 การดึงข้อมูลจาก API

```
usePortfolioData()
       │
       ▼
อ่าน host ปัจจุบันจาก useRequestURL()
       │
       ▼
$fetch('http://localhost:8080/api/v1/public/sites/by-domain?host=localhost:3000')
       │
       ▼
$fetch('http://localhost:8080/api/v1/public/sites/{siteId}/portfolio')
       │
       ▼
API Response:
{
  "data": {
    "site_settings": { ... },
    "hero": { ... },
    "about": { ... },
    "skills": [ ... ],
    "projects": [ ... ],
    "experiences": [ ... ],
    "social_links": [ ... ],
    "nav_items": [ ... ]
  }
}
       │
       ▼
computed() แยก slice ข้อมูล:
  ├── siteSettings  → TheNavbar, TheFooter, SectionHero, useTheme
  ├── hero          → SectionHero
  ├── about         → SectionAbout
  ├── skills        → SectionSkills
  ├── projects      → SectionProjects
  ├── experiences   → SectionExperience
  ├── socialLinks   → SectionHero, SectionContact, TheFooter
  └── navItems      → TheNavbar
```

### 3.2 การจัดการ State

| State              | เก็บที่ไหน      | ใช้ที่                    |
| ------------------ | --------------- | ------------------------- |
| Portfolio data     | `useFetch` cache | ทุก section component     |
| Theme              | `useState` + localStorage | `useTheme`, `ThemeToggle` |
| Scroll position    | `ref` ใน Navbar | `TheNavbar`               |
| Mobile menu        | `ref` ใน Navbar | `TheNavbar`               |
| Skill category     | `ref` ใน Skills | `SectionSkills`           |
| Contact form       | `reactive` ใน Contact | `SectionContact`    |
| Submit state       | `ref` ใน Contact | `SectionContact`         |

---

## 4. Theme Flow

ระบบ theme มี 2 โหมด: **midnight** (dark) และ **sunshine** (light)

### 4.1 ลำดับการตัดสินใจ Theme

```
เปิดเว็บ
   │
   ▼
[Inline Script ใน <head>]
   ├── อ่าน localStorage('portfolio-theme')
   ├── ถ้ามี → ใส่ class ทันที (ลด FOUC)
   └── ถ้าไม่มี → ใช้ default (midnight)
   │
   ▼
[useTheme() composable ทำงาน]
   ├── ดึง siteSettings.default_theme จาก API
   ├── ดึง siteSettings.updated_at จาก API
   │
   ├── เปรียบเทียบ updated_at กับ localStorage('portfolio-theme-api-version')
   │   ├── ถ้าต่างกัน (API อัปเดทแล้ว)
   │   │   └── ใช้ theme จาก API → ลบ user preference เก่า
   │   └── ถ้าเหมือนกัน
   │       └── ใช้ theme จาก localStorage (user เลือกเอง)
   │
   └── ใส่ class ใน <html> ผ่าน useHead()
```

### 4.2 การสลับ Theme

```
กดปุ่ม ThemeToggle
       │
       ▼
toggleTheme()
   ├── เพิ่ม class 'theme-transition' ใน <html> (ให้สี transition smooth)
   ├── เปลี่ยน theme.value (midnight ↔ sunshine)
   ├── บันทึกลง localStorage('portfolio-theme')
   └── ลบ class 'theme-transition' หลัง 500ms
       │
       ▼
CSS Variables เปลี่ยนทั้งหมด
   └── ทุก component ที่ใช้สี th-* จะอัปเดตทันที
```

---

## 5. Contact Form Flow

```
ผู้ใช้กรอกฟอร์ม (name, email, subject, message)
       │
       ▼
กด "Send Message"
       │
       ▼
handleSubmit()
   ├── submitting = true (ปุ่มเปลี่ยนเป็น "Sending...")
   ├── ล้าง error ก่อนหน้า
   │
   ├── $fetch POST /api/v1/public/sites/{siteId}/portfolio/contacts
   │   └── body: { name, email, subject, message }
   │
   ├── สำเร็จ ✓
   │   ├── submitSuccess = true
   │   ├── แสดง success message + check icon
   │   └── ล้างฟอร์ม
   │
   └── ล้มเหลว ✗
       ├── submitError = error message จาก API
       └── แสดง error banner สีแดง
```

---

## 6. Navigation Flow

เว็บนี้ใช้ **in-page navigation** (anchor links) ไม่มีการเปลี่ยนหน้า

```
ผู้ใช้คลิก nav item (เช่น "About")
       │
       ▼
href="#about" → browser scroll ไปยัง <section id="about">
       │
       ▼
scroll-smooth (CSS) ทำให้ smooth scroll
```

### Navbar Behavior

```
scroll position
   │
   ├── scrollY <= 50  → Navbar โปร่งใส (bg-transparent)
   └── scrollY > 50   → Navbar มี backdrop-blur + shadow
```

### Mobile Menu

```
คลิกปุ่ม hamburger (mdi:menu)
       │
       ▼
isMobileMenuOpen = true
   └── แสดง dropdown menu พร้อม transition animation
       │
       ▼
คลิก nav item ใน mobile menu
   ├── closeMobileMenu() → ปิด menu
   └── scroll ไปยัง section
```

---

## 7. Image Loading Flow

รูปภาพทั้งหมดดึงจาก Backend API server:

```
API Response:
  site_settings.profile_image = "/uploads/abc123.jpg"
  projects[0].image = "/uploads/project1.jpg"
       │
       ▼
getImageUrl(path)
   └── return `${apiBaseUrl}${path}`
   └── เช่น "http://localhost:8080/uploads/abc123.jpg"
       │
       ▼
<img :src="..." /> แสดงรูป

Fallback:
  ├── Profile Image → ใช้ /images/profile.jpg (static file ใน public/)
  └── Project Image → แสดง icon placeholder (mdi:code-braces)
```

---

## Summary Diagram

```
┌─────────────┐      GET /api/v1/public/sites/by-domain      ┌──────────────┐
│   Browser   │  ──────────────────────────────► │  Backend API │
│             │  ◄──────────────────────────────  │  :8080       │
│  Nuxt 3 App │      JSON (site data)            │              │
│             │      GET /api/v1/public/sites/{siteId}/portfolio │
│             │  ──────────────────────────────► │              │
│             │  ◄──────────────────────────────  │              │
│             │      JSON (portfolio data)       │              │
│             │                                   │  /uploads/*  │
│             │      POST /api/v1/public/sites/{siteId}/portfolio/contacts │
│  Contact    │  ──────────────────────────────► │              │
│  Form       │  ◄──────────────────────────────  │              │
│             │      { data: { message } }       │              │
│             │                                   │              │
│  <img src>  │  ──────────────────────────────► │  Static Files│
│             │  ◄──────────────────────────────  │              │
└─────────────┘      Image binary                └──────────────┘

┌───────────────────────────────────────────┐
│              localStorage                  │
│                                            │
│  portfolio-theme         = midnight/sunshine │
│  portfolio-theme-api-version = updated_at  │
└───────────────────────────────────────────┘
```
