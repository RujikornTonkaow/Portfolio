# File Reference — รายละเอียดไฟล์แต่ละไฟล์

เอกสารนี้อธิบายว่าไฟล์แต่ละไฟล์ในโปรเจกต์ทำหน้าที่อะไร เรียงตามโครงสร้างโฟลเดอร์

---

## สารบัญ

1. [Project Structure](#1-project-structure)
2. [Root Config Files](#2-root-config-files)
3. [Types](#3-types)
4. [Composables](#4-composables)
5. [Layouts](#5-layouts)
6. [Pages](#6-pages)
7. [Components](#7-components)
8. [Assets](#8-assets)
9. [Public](#9-public)

---

## 1. Project Structure

```
Portfolio/
├── .env.example                 # ตัวอย่างค่า environment variable
├── .gitignore                   # ไฟล์ที่ git จะไม่ track
├── PORTFOLIO_FRONTEND_SPEC.md   # API contract สำหรับ Backend
├── app.vue                      # Root component ของ Nuxt app
├── nuxt.config.ts               # Nuxt configuration หลัก
├── package.json                 # Dependencies และ scripts
├── package-lock.json            # Lock file สำหรับ reproducible installs
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
│
├── GUIDE/                       # 📖 เอกสารสำหรับ developer (ไฟล์นี้อยู่ที่นี่)
│   ├── 01-SYSTEM-FLOW.md        # Flow การทำงานของระบบ
│   ├── 02-FILE-REFERENCE.md     # รายละเอียดไฟล์แต่ละไฟล์ (ไฟล์นี้)
│   ├── 03-TECH-STACK.md         # Tech stack ที่ใช้
│   ├── 04-GETTING-STARTED.md    # การติดตั้งและรันโปรเจกต์
│   ├── 05-THEMING-GUIDE.md      # ระบบ Theme และ Styling
│   └── 06-COMPONENT-PATTERNS.md # แนวทางการเขียน Component
│
├── assets/
│   └── css/
│       └── tailwind.css         # Global CSS + Theme variables
│
├── composables/
│   ├── usePortfolioData.ts      # Composable ดึงข้อมูล portfolio จาก API
│   └── useTheme.ts              # Composable จัดการ theme (dark/light)
│
├── components/
│   ├── ProfileAvatar.vue        # รูป profile แบบวงกลม + gradient ring
│   ├── SectionAbout.vue         # Section "About Me"
│   ├── SectionContact.vue       # Section "Contact" + form
│   ├── SectionExperience.vue    # Section "Experience" timeline
│   ├── SectionHero.vue          # Section แรก (hero banner)
│   ├── SectionProjects.vue      # Section "Projects" grid
│   ├── SectionSkills.vue        # Section "Skills" + category filter
│   ├── ThemeToggle.vue          # ปุ่มสลับ theme (sun/moon icon)
│   ├── TheFooter.vue            # Footer ด้านล่างสุด
│   └── TheNavbar.vue            # Navbar ด้านบน
│
├── layouts/
│   └── default.vue              # Layout หลัก (navbar + content + footer)
│
├── pages/
│   └── index.vue                # หน้าแรก (และหน้าเดียว)
│
├── public/
│   └── images/
│       └── profile.jpg          # Fallback profile image
│
└── types/
    └── portfolio.ts             # TypeScript interfaces ทั้งหมด
```

---

## 2. Root Config Files

### `app.vue`

**หน้าที่:** Root component ที่ Nuxt เรียกเป็นตัวแรก

```vue
<NuxtLayout>      ← เลือก layout (default.vue)
  <NuxtPage />    ← แสดง page ตาม route (index.vue)
</NuxtLayout>
```

ไม่มี logic ใดๆ — ทำหน้าที่เป็น shell ให้ layout และ page ทำงาน

---

### `nuxt.config.ts`

**หน้าที่:** Configuration หลักของ Nuxt app

| ส่วน | ทำอะไร |
| ---- | ------ |
| `compatibilityDate` | กำหนด Nuxt compatibility date (`'2025-05-04'`) สำหรับ breaking change behavior |
| `runtimeConfig.public.apiBaseUrl` | URL ของ Backend API (อ่านจาก env `NUXT_PUBLIC_API_BASE_URL`) |
| `modules` | โหลด `@nuxtjs/tailwindcss` และ `@nuxt/icon` |
| `app.head.title` | ตั้ง default title = "Portfolio" |
| `app.head.charset` | ตั้ง `utf-8` |
| `app.head.viewport` | ตั้ง `width=device-width, initial-scale=1` |
| `app.head.meta` | ตั้ง default meta description |
| `app.head.script` | **Inline script** สำหรับอ่าน theme จาก localStorage ก่อน paint (ลด FOUC) |
| `app.head.link` | โหลด Google Fonts (Inter, JetBrains Mono) + preconnect |
| `tailwindcss.cssPath` | ชี้ไปที่ `~/assets/css/tailwind.css` |
| `devtools` | เปิด Nuxt DevTools สำหรับ development |

> **หมายเหตุ:** ไม่มีการตั้ง `ssr: false` — Nuxt 3 default คือ **SSR เปิด**

---

### `tailwind.config.ts`

**หน้าที่:** กำหนด Tailwind CSS theme extension

| ส่วน | ทำอะไร |
| ---- | ------ |
| `content` | กำหนดไฟล์ที่ Tailwind จะ scan (components, layouts, pages, composables) |
| `theme.extend.fontFamily` | เพิ่ม font Inter (sans) และ JetBrains Mono (mono) |
| `theme.extend.colors.primary` | Indigo color palette (50-950) |
| `theme.extend.colors.surface` | Slate color palette (50-950) |
| `theme.extend.colors.th` | **Theme-aware colors** ที่อ่าน CSS variables — เปลี่ยนตาม theme |
| `theme.extend.animation` | Animation presets: `fade-in`, `slide-up`, `float` |
| `theme.extend.keyframes` | Keyframe definitions สำหรับ animation ข้างต้น |

---

### `package.json`

**หน้าที่:** กำหนด dependencies, scripts, และ project metadata

**Scripts:**

| Script | คำสั่ง | ทำอะไร |
| ------ | ------ | ------ |
| `dev` | `nuxt dev` | รัน dev server พร้อม HMR |
| `build` | `nuxt build` | Build สำหรับ production (SSR) |
| `generate` | `nuxt generate` | Generate static site (SSG) |
| `preview` | `nuxt preview` | Preview production build locally |
| `postinstall` | `nuxt prepare` | สร้าง `.nuxt/` types หลัง npm install |

---

### `tsconfig.json`

**หน้าที่:** TypeScript configuration ที่ extends จาก Nuxt auto-generated config (`.nuxt/tsconfig.json`)

ไม่มี custom settings เพิ่ม — ใช้ค่าจาก Nuxt ทั้งหมด

---

### `.env.example`

**หน้าที่:** เอกสารตัวอย่างของ environment variables ที่ต้องตั้ง

```
NUXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

ต้อง copy เป็น `.env` แล้วแก้ค่าตามจริง

---

### `.gitignore`

**หน้าที่:** กำหนดไฟล์/โฟลเดอร์ที่ git ไม่ track

สิ่งที่ถูก ignore:

| Pattern | อธิบาย |
| ------- | ------ |
| `.output` | Nuxt production build output |
| `.data` | Nuxt data cache |
| `.nuxt` | Nuxt dev build output + generated types |
| `.nitro` | Nitro server engine cache |
| `.cache` | General cache |
| `dist` | Static site generation output |
| `node_modules` | npm dependencies |
| `logs` / `*.log` | Log files |
| `.DS_Store` | macOS folder metadata |
| `.fleet` / `.idea` | JetBrains IDE configs |
| `.env` / `.env.*` | Environment variables |
| `!.env.example` | **ยกเว้น** — ไฟล์ตัวอย่างนี้ยัง track อยู่ |

---

### `PORTFOLIO_FRONTEND_SPEC.md`

**หน้าที่:** เอกสาร API contract สำหรับคนที่จะสร้าง Backend

อธิบาย:
- API endpoints ที่ Frontend ต้องการ รวมถึง public multi-site site resolution
- JSON response format
- Data model ของแต่ละ section
- รูปแบบการจัดการรูปภาพ
- Contact form request/response
- Naming convention (snake_case)

---

## 3. Types

### `types/portfolio.ts`

**หน้าที่:** กำหนด TypeScript interfaces สำหรับข้อมูลทั้งหมดที่ได้จาก API

| Interface | ใช้กับ | อธิบาย |
| --------- | ------ | ------ |
| `ApiEnvelope<T>` | usePortfolioData, SectionContact | JSON envelope ของ backend (`data` หรือ `error`) |
| `ManagedSite` | usePortfolioData | ข้อมูล site ที่ resolve จาก current host |
| `SiteSettings` | Navbar, Footer, Hero, Theme | ค่าตั้งค่าเว็บ (title, theme, profile image) |
| `HeroData` | SectionHero | ข้อมูล hero section (ชื่อ, greeting, CTA buttons) |
| `Stat` | SectionAbout | ตัวเลขสถิติ (value + label) |
| `AboutData` | SectionAbout | bio, personality tags, stats |
| `SkillCategory` | SectionSkills | Union type: `'frontend' \| 'backend' \| 'devops' \| 'tools'` |
| `Skill` | SectionSkills | ข้อมูล skill (name, icon, category) |
| `Project` | SectionProjects | ข้อมูล project (title, tags, image, links) |
| `Experience` | SectionExperience | ประสบการณ์ทำงาน (role, company, highlights) |
| `SocialLink` | Hero, Contact, Footer | link social media (name, url, icon) |
| `NavItem` | TheNavbar | nav menu item (label, href) |
| `PortfolioData` | usePortfolioData | Object รวมทุก interface ด้านบน |
| `ContactForm` | SectionContact | ข้อมูลที่ส่งจาก contact form |

---

## 4. Composables

### `composables/usePortfolioData.ts`

**หน้าที่:** ดึงข้อมูล portfolio ทั้งหมดจาก API แล้วแจก computed refs ให้แต่ละ component

**วิธีทำงาน:**
1. อ่าน `apiBaseUrl` จาก `runtimeConfig`
2. อ่าน host ปัจจุบันจาก `useRequestURL().host`
3. ใช้ `useAsyncData()` เรียก `GET /api/v1/public/sites/by-domain?host={host}` เพื่อ resolve site
4. ใช้ `site.id` เรียก `GET /api/v1/public/sites/{siteId}/portfolio`
5. แปลง response เป็น computed refs แยกตามหมวด
6. มีฟังก์ชัน `getImageUrl(path)` สำหรับสร้าง full URL ของรูปภาพ

**สิ่งที่ควรรู้:**
- `pending` และ `error` ถูก return ออกมาเพื่อให้ component แสดง loading/error state ได้
- `SectionContact` ใช้ `error` เพื่อ disable form เมื่อ resolve site ไม่สำเร็จ
- cache key ผูกกับ host เช่น `portfolio-data:localhost:3000` เพื่อไม่ให้ข้อมูลคนละ domain ปะปนกัน

**Return values:**

| ค่า | Type | อธิบาย |
| --- | ---- | ------ |
| `site` | `ComputedRef<ManagedSite \| null>` | site ที่ resolve จาก host ปัจจุบัน |
| `siteId` | `ComputedRef<string \| null>` | id ของ site สำหรับ public API ที่ต้องมี siteId |
| `portfolio` | `ComputedRef<PortfolioData \| null>` | ข้อมูลดิบทั้งหมด |
| `siteSettings` | `ComputedRef<SiteSettings \| null>` | ค่าตั้งค่าเว็บ |
| `hero` | `ComputedRef<HeroData \| null>` | ข้อมูล hero section |
| `about` | `ComputedRef<AboutData \| null>` | ข้อมูล about section |
| `skills` | `ComputedRef<Skill[]>` | รายการ skills |
| `projects` | `ComputedRef<Project[]>` | รายการ projects |
| `experiences` | `ComputedRef<Experience[]>` | รายการ experiences |
| `socialLinks` | `ComputedRef<SocialLink[]>` | รายการ social links |
| `navItems` | `ComputedRef<NavItem[]>` | รายการ nav items |
| `pending` | `Ref<boolean>` | สถานะกำลังโหลด |
| `error` | `Ref` | error ถ้ามี |
| `refresh` | `() => Promise<void>` | reload site/portfolio data |
| `getImageUrl` | `(path?: string) => string \| null` | สร้าง full URL สำหรับรูปภาพ |

---

### `composables/useTheme.ts`

**หน้าที่:** จัดการ theme (midnight/sunshine) ทั้งระบบ

**วิธีทำงาน:**
1. ดึง `default_theme` และ `updated_at` จาก `siteSettings`
2. ใช้ `useState('app-theme')` เก็บ theme ปัจจุบัน
3. เปรียบเทียบ `updated_at` กับค่าใน localStorage
   - ถ้า API version เปลี่ยน → reset เป็น API default
   - ถ้า version เดิม → ใช้ user preference จาก localStorage
4. `toggleTheme()` สลับ theme พร้อม smooth transition animation
5. `useHead()` ใส่ class ลงใน `<html>` element

**SSR Guard:**
- โค้ดที่เกี่ยวกับ `localStorage` และ `document` ถูกห่อด้วย `if (import.meta.client)` เพื่อไม่ให้รันบน server (SSR)
- `resolveTheme()` และ `watch(apiVersion)` ทำงานฝั่ง client เท่านั้น
- `toggleTheme()` ใช้ `import.meta.client` guard สำหรับ DOM manipulation

> นี่คือ pattern สำคัญ — ถ้าเขียน composable ใหม่ที่เข้าถึง browser APIs (`localStorage`, `document`, `window`) ต้องห่อด้วย `import.meta.client` เสมอ

**Return values:**

| ค่า | Type | อธิบาย |
| --- | ---- | ------ |
| `theme` | `Readonly<Ref<Theme>>` | theme ปัจจุบัน (`'midnight'` หรือ `'sunshine'`) |
| `toggleTheme` | `() => void` | ฟังก์ชันสลับ theme |

---

## 5. Layouts

### `layouts/default.vue`

**หน้าที่:** Layout หลัก (และเดียว) ที่ wrap ทุกหน้า

**โครงสร้าง:**
```
<div class="min-h-screen">
  <TheNavbar />     ← nav ด้านบน (fixed position)
  <main>
    <slot />         ← เนื้อหาหน้า (page content)
  </main>
  <TheFooter />     ← footer ด้านล่าง
</div>
```

---

## 6. Pages

### `pages/index.vue`

**หน้าที่:** หน้าแรก (และหน้าเดียว) ของเว็บ — route `/`

**สิ่งที่ทำ:**
1. เรียก `usePortfolioData()` ดึง `siteSettings`
2. ใช้ `useHead()` ตั้ง dynamic title และ meta description จาก API data
3. Render section components เรียงตามลำดับ:
   - `SectionHero`
   - `SectionAbout`
   - `SectionSkills`
   - `SectionProjects`
   - `SectionExperience`
   - `SectionContact`

---

## 7. Components

### `TheNavbar.vue`

**หน้าที่:** Navigation bar ด้านบน (fixed position)

| Feature | รายละเอียด |
| ------- | ---------- |
| Brand | แสดง `site_title` จาก API พร้อม gradient text |
| Nav Links | render จาก `nav_items` (API data) |
| Scroll Style | เปลี่ยน background เป็น blur เมื่อ scroll > 50px |
| Mobile Menu | Hamburger menu สำหรับหน้าจอเล็ก พร้อม transition |
| Theme Toggle | วาง `ThemeToggle` ปุ่มสลับ theme |
| Cleanup | `onUnmounted` ลบ scroll event listener |

---

### `TheFooter.vue`

**หน้าที่:** Footer ด้านล่างสุดของเว็บ

แสดง:
- `site_title` (พร้อม gradient text)
- `footer_tagline`
- Social link icons จาก `socialLinks`
- Copyright year (คำนวณอัตโนมัติ)

---

### `SectionHero.vue`

**หน้าที่:** Hero banner — section แรกที่ผู้ใช้เห็น

| ส่วน | แสดงอะไร |
| ---- | -------- |
| Background | Gradient blobs + blur effect (animated float) |
| Profile Avatar | `ProfileAvatar` component แสดงรูป profile |
| Greeting | เช่น "Hello, I'm" |
| Name | ชื่อเต็มพร้อม gradient text |
| Subtitle | คำอธิบายสั้นๆ |
| CTA Buttons | ปุ่มหลัก (View My Work) + ปุ่มรอง (Get in Touch) |
| Social Links | ไอคอน social media |
| Scroll Chevron | ลูกศร bounce ชี้ลง (link ไป #about) |

---

### `SectionAbout.vue`

**หน้าที่:** Section แนะนำตัว

| ส่วน | แสดงอะไร |
| ---- | -------- |
| Title | หัวข้อ section |
| Bio | Paragraphs อธิบายตัวเอง |
| Personality Tags | Badge pills เช่น "Problem Solver", "Team Player" |
| Stats | การ์ดตัวเลข (glass-card) เช่น "5+ Years", "99% Uptime" |

---

### `SectionSkills.vue`

**หน้าที่:** แสดง skills/technologies พร้อม filter

| Feature | รายละเอียด |
| ------- | ---------- |
| Category Filter | ปุ่ม All / Frontend / Backend / DevOps / Tools |
| Skill Grid | การ์ดแสดง icon + ชื่อ skill (responsive grid) |
| Filtering | ใช้ `computed` กรอง skills ตาม `activeCategory` |
| Icons | ใช้ Iconify (ชื่อ icon มาจาก API เช่น `logos:vue`) |

---

### `SectionProjects.vue`

**หน้าที่:** แสดง projects ในรูปแบบ grid

| ส่วน | แสดงอะไร |
| ---- | -------- |
| Project Image | รูป project (ถ้ามี) หรือ icon placeholder |
| Title & Description | ชื่อและคำอธิบาย project |
| Tags | Technology tags เช่น "Nuxt 3", "Go" |
| Links | Live Demo (mdi:open-in-new) + Source Code (mdi:github) |

**Image fallback:** ถ้า `project.image` ว่าง → แสดง gradient background + `mdi:code-braces` icon

---

### `SectionExperience.vue`

**หน้าที่:** แสดงประสบการณ์ทำงานเป็น timeline

| ส่วน | แสดงอะไร |
| ---- | -------- |
| Timeline Line | เส้น gradient ด้านซ้าย |
| Timeline Dot | จุดกลมบนเส้น timeline (ตำแหน่งแรกเติมสี) |
| Experience Card | glass-card แสดง role, company, period, description |
| Highlights | รายการผลงานเด่นพร้อม check icon |

---

### `SectionContact.vue`

**หน้าที่:** ฟอร์มติดต่อ + ส่งข้อความไป API

| Feature | รายละเอียด |
| ------- | ---------- |
| Form Fields | name, email, subject, message |
| Validation | HTML5 required attribute |
| Submit | `$fetch POST /api/v1/public/sites/{siteId}/portfolio/contacts` |
| Success UI | check icon + success message + "Send another" button |
| Error UI | error banner สีแดงแสดง message จาก API |
| Loading State | ปุ่มเปลี่ยนเป็น "Sending..." + disabled |
| Social Links | แถว icon + ชื่อ platform ด้านล่าง form |

---

### `ProfileAvatar.vue`

**หน้าที่:** แสดงรูป profile แบบวงกลมพร้อม animated gradient ring

| Props | Type | Default | อธิบาย |
| ----- | ---- | ------- | ------ |
| `src` | `string` | `'/images/profile.jpg'` | URL รูป |
| `alt` | `string` | `'Profile picture'` | Alt text |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'` | ขนาด avatar |

**Sizes:**
- `sm` = 64px, `md` = 96px, `lg` = 160px, `xl` = 224px

มี scoped CSS สำหรับ `animate-spin-slow` (หมุน ring ช้าๆ 8 วินาที)

---

### `ThemeToggle.vue`

**หน้าที่:** ปุ่มสลับ theme (midnight ↔ sunshine)

- **Midnight mode** → แสดง sun icon (`mdi:white-balance-sunny`)
- **Sunshine mode** → แสดง moon icon (`mdi:weather-night`)
- มี transition animation (rotate + scale) เมื่อสลับ icon
- ใช้ `aria-label` สำหรับ accessibility

---

## 8. Assets

### `assets/css/tailwind.css`

**หน้าที่:** Global CSS + Theme system

| Layer | ทำอะไร |
| ----- | ------ |
| `@layer base` | กำหนด CSS variables สำหรับ theme (midnight + sunshine) |
| `@layer base` | ตั้ง scroll-smooth, body styles, selection styles |
| `@layer components` | `.section-container` — max-width + padding |
| `@layer components` | `.section-padding` — vertical padding สำหรับ sections |
| `@layer components` | `.gradient-text` — gradient text effect |
| `@layer components` | `.glass-card` — glassmorphism card style |
| `@layer utilities` | `.theme-transition` — smooth transition เมื่อสลับ theme |

**CSS Variables (30+ ตัว):** ดูรายละเอียดใน [05-THEMING-GUIDE.md](./05-THEMING-GUIDE.md)

---

## 9. Public

### `public/images/profile.jpg`

**หน้าที่:** Fallback profile image

ใช้เมื่อ API ไม่ส่ง `profile_image` หรือ Backend ยังไม่พร้อม

ไฟล์ใน `public/` จะถูก serve ที่ root path — เช่น `http://localhost:3000/images/profile.jpg`
