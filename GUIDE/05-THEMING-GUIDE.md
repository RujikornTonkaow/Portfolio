# Theming Guide — ระบบ Theme และ Styling

เอกสารนี้อธิบายระบบ theme ทั้งหมดที่ใช้ในโปรเจกต์ ตั้งแต่ CSS variables ไปจนถึงการเพิ่ม theme ใหม่

---

## สารบัญ

1. [Theme Overview](#1-theme-overview)
2. [CSS Variables](#2-css-variables)
3. [Tailwind Integration](#3-tailwind-integration)
4. [Theme Composable](#4-theme-composable)
5. [FOUC Prevention](#5-fouc-prevention)
6. [Component Classes](#6-component-classes)
7. [การแก้ไขสี Theme](#7-การแก้ไขสี-theme)
8. [การเพิ่ม Theme ใหม่](#8-การเพิ่ม-theme-ใหม่)

---

## 1. Theme Overview

ระบบ theme ทำงานผ่าน 3 ชั้น:

```
┌─────────────────────────────────────────────┐
│  Layer 1: CSS Variables                      │
│  (assets/css/tailwind.css)                   │
│  กำหนดค่าสีสำหรับแต่ละ theme                  │
│  html.midnight { --t-bg: 2 6 23; }          │
│  html.sunshine { --t-bg: 255 252 245; }     │
└──────────────────┬──────────────────────────┘
                   │ อ่านค่า
┌──────────────────▼──────────────────────────┐
│  Layer 2: Tailwind Config                    │
│  (tailwind.config.ts)                        │
│  map CSS vars → Tailwind color classes       │
│  th-bg → rgb(var(--t-bg) / <alpha-value>)   │
└──────────────────┬──────────────────────────┘
                   │ ใช้ใน template
┌──────────────────▼──────────────────────────┐
│  Layer 3: Components                         │
│  ใช้ class bg-th-bg, text-th-fg, etc.       │
│  สีเปลี่ยนอัตโนมัติตาม theme                  │
└─────────────────────────────────────────────┘
```

**สลับ theme:** เพียงเปลี่ยน class บน `<html>` จาก `midnight` เป็น `sunshine` (หรือกลับกัน) → CSS variables ทั้งหมดเปลี่ยนทันที → UI อัปเดตโดยไม่ต้อง re-render

---

## 2. CSS Variables

กำหนดใน `assets/css/tailwind.css` ภายใน `@layer base`

### ค่าของ CSS Variables

ค่าเป็น **RGB channels แยก** (เช่น `2 6 23` ไม่ใช่ `rgb(2, 6, 23)`) เพื่อให้ Tailwind ใส่ alpha ได้

### ตาราง Variables ทั้งหมด

| Variable | หน้าที่ | Midnight (Dark) | Sunshine (Light) |
| -------- | ------- | --------------- | ---------------- |
| `--t-bg` | Background หลัก | `2 6 23` (กรมท่าเข้ม) | `255 252 245` (ครีม) |
| `--t-bg-alt` | Background สลับ (sections) | `10 15 35` | `248 243 235` |
| `--t-bg-el` | Background elements | `30 41 59` | `240 234 226` |
| `--t-fg` | Foreground (text หลัก) | `255 255 255` (ขาว) | `45 30 20` (น้ำตาลเข้ม) |
| `--t-body` | Body text | `226 232 240` | `72 55 44` |
| `--t-muted` | Text จาง | `148 163 184` | `120 102 90` |
| `--t-subtle` | Text จางมาก | `100 116 139` | `158 142 130` |
| `--t-faint` | Text จางที่สุด | `71 85 105` | `192 180 170` |
| `--t-overlay` | สี overlay | `255 255 255` | `45 30 20` |
| `--t-edge` | สีขอบ | `255 255 255` | `60 45 35` |
| `--t-accent` | สี accent หลัก | `129 140 248` (indigo) | `180 83 9` (amber) |
| `--t-accent-soft` | สี accent soft | `165 180 252` | `55 48 163` |
| `--t-accent-cyan` | สี accent cyan | `103 232 249` | `14 116 144` |
| `--t-accent-violet` | สี accent violet | `196 181 253` | `109 40 217` |
| `--t-grad-from` | Gradient start | `129 140 248` | `147 51 234` |
| `--t-grad-via` | Gradient middle | `165 180 252` | `219 39 119` |
| `--t-grad-to` | Gradient end | `34 211 238` | `234 88 12` |
| `--t-ring-from` | Profile ring start | `99 102 241` | `139 92 246` |
| `--t-ring-via` | Profile ring middle | `34 211 238` | `236 72 153` |
| `--t-ring-to` | Profile ring end | `139 92 246` | `249 115 22` |
| `--t-btn` | ปุ่มหลัก | `79 70 229` (indigo) | `217 119 6` (amber) |
| `--t-btn-hover` | ปุ่ม hover | `99 102 241` | `245 158 11` |
| `--t-card-bg` | พื้นหลังการ์ด | `255 255 255` | `255 253 250` |
| `--t-card-alpha` | Alpha ของการ์ด | `0.05` | `0.85` |
| `--t-card-border-alpha` | Alpha ของขอบการ์ด | `0.1` | `0.08` |
| `--t-card-shadow` | เงาการ์ด | `none` | `0 1px 3px ...` |

---

## 3. Tailwind Integration

### การ Map CSS Variables → Tailwind Classes

ใน `tailwind.config.ts` ส่วน `theme.extend.colors.th`:

```
CSS Variable          → Tailwind Class
--t-bg                → bg-th-bg, text-th-bg
--t-fg                → text-th-fg
--t-accent            → text-th-accent
--t-btn               → bg-th-btn
...
```

**Format:**
```ts
'bg': 'rgb(var(--t-bg) / <alpha-value>)'
```

`<alpha-value>` ช่วยให้ใช้ opacity modifier ได้:
```html
<!-- ใช้ bg-th-bg ปกติ -->
<div class="bg-th-bg">

<!-- ใช้ bg-th-bg พร้อม opacity -->
<div class="bg-th-overlay/5">    <!-- opacity 5% -->
<div class="bg-th-overlay/10">   <!-- opacity 10% -->
```

### สี Static (ไม่เปลี่ยนตาม theme)

| Palette | ตัวอย่าง Class | ใช้ที่ |
| ------- | ------------- | ------ |
| `primary` (50–950) | `bg-primary-500`, `text-primary-300` | Accent, selection |
| `surface` (50–950) | `bg-surface-800` | ไม่ได้ใช้ตรงๆ ในตอนนี้ |

---

## 4. Theme Composable

### `useTheme()` — composables/useTheme.ts

**State Management:**
```
useState('app-theme') → เก็บ theme ปัจจุบัน ('midnight' | 'sunshine')
```

**Logic การเลือก Theme ตอนโหลดหน้า:**

```
1. ดึง siteSettings.default_theme จาก API     → เช่น 'midnight'
2. ดึง siteSettings.updated_at จาก API        → เช่น '2025-01-15T...'
3. เปรียบเทียบ updated_at กับ localStorage('portfolio-theme-api-version')
   │
   ├── ต่างกัน (API ถูกอัปเดท)
   │   ├── บันทึก updated_at ใหม่ลง localStorage
   │   ├── ลบ user preference เก่า
   │   └── ใช้ default_theme จาก API
   │
   └── เหมือนกัน
       ├── อ่าน localStorage('portfolio-theme')
       │   ├── มีค่า → ใช้ค่านั้น
       │   └── ไม่มี → ใช้ default จาก API
```

**เหตุผล:** ถ้า admin เปลี่ยน default theme ใน Backend → user ที่เคยตั้ง theme เองจะถูก reset ให้เป็นค่าใหม่ (ผ่านการตรวจ `updated_at`)

**toggleTheme():**

1. คำนวณ theme ใหม่ (สลับ midnight ↔ sunshine)
2. เพิ่ม class `theme-transition` ใน `<html>` → ทำให้สีเปลี่ยน smooth
3. อัปเดต `theme.value`
4. บันทึกลง `localStorage('portfolio-theme')`
5. ลบ class `theme-transition` หลัง 500ms

### localStorage Keys

| Key | ค่า | อธิบาย |
| --- | --- | ------ |
| `portfolio-theme` | `'midnight'` หรือ `'sunshine'` | Theme ที่ user เลือก |
| `portfolio-theme-api-version` | ISO 8601 string | `updated_at` ของ `site_settings` ที่ใช้ตัดสินใจ |

---

## 5. FOUC Prevention

**FOUC = Flash of Unstyled Content** — ปัญหาที่เว็บแสดง theme ผิดชั่วครู่ก่อนสลับเป็น theme ที่ถูกต้อง

### วิธีแก้

ใน `nuxt.config.ts` มี **inline script** ที่รันก่อน Vue mount:

```js
(function(){
  try {
    var t = localStorage.getItem('portfolio-theme');
    if (t === 'midnight' || t === 'sunshine') {
      document.documentElement.classList.remove('midnight','sunshine');
      document.documentElement.classList.add(t);
    }
  } catch(e) {}
})()
```

**ทำงานอย่างไร:**
1. Script นี้อยู่ใน `<head>` → รันก่อน body render
2. อ่าน theme จาก `localStorage` ทันที
3. ใส่ class ลงใน `<html>` ก่อนที่ CSS จะ paint
4. ผลลัพธ์: ผู้ใช้เห็น theme ที่ถูกต้องตั้งแต่แรก

---

## 6. Component Classes

### Reusable CSS Classes (กำหนดใน tailwind.css)

#### `.section-container`

```css
max-w-6xl mx-auto px-4 sm:px-6 lg:px-8
```

ใช้ครอบ content ของทุก section — จำกัดความกว้าง + padding ข้าง

#### `.section-padding`

```css
py-20 md:py-28
```

Vertical padding สำหรับ sections — mobile 80px, desktop 112px

#### `.gradient-text`

```css
background: linear-gradient(to right, 
  rgb(var(--t-grad-from)), 
  rgb(var(--t-grad-via)), 
  rgb(var(--t-grad-to))
);
background-clip: text;
-webkit-text-fill-color: transparent;
```

ทำให้ text มี gradient color — ใช้กับชื่อ, หัวข้อ sections

#### `.glass-card`

```css
backdrop-blur-xl rounded-2xl
background: rgb(var(--t-card-bg) / var(--t-card-alpha));
border: 1px solid rgb(var(--t-edge) / var(--t-card-border-alpha));
box-shadow: var(--t-card-shadow);
```

Glassmorphism card style — ใช้กับ skill cards, stat cards, experience cards, contact form

#### `.theme-transition`

```css
.theme-transition *,
.theme-transition *::before,
.theme-transition *::after {
  transition: background-color 0.3s ease, 
              color 0.3s ease, 
              border-color 0.3s ease, 
              box-shadow 0.3s ease, 
              fill 0.3s ease !important;
}
```

ใส่ชั่วคราว (500ms) ตอนสลับ theme → ทำให้สีเปลี่ยน smooth

---

## 7. การแก้ไขสี Theme

### เปลี่ยนสีของ theme ที่มีอยู่

1. เปิด `assets/css/tailwind.css`
2. หา block `html.midnight { ... }` หรือ `html.sunshine { ... }`
3. แก้ค่า RGB channels

**ตัวอย่าง: เปลี่ยนสี accent ของ Midnight**

```css
html.midnight {
  /* เปลี่ยนจาก indigo เป็น green */
  --t-accent: 74 222 128;        /* ก่อน: 129 140 248 */
  --t-accent-soft: 134 239 172;  /* ก่อน: 165 180 252 */
}
```

### เปลี่ยนสีปุ่ม

```css
html.midnight {
  --t-btn: 74 222 128;       /* ปุ่มปกติ */
  --t-btn-hover: 34 197 94;  /* ปุ่ม hover */
}
```

### เปลี่ยนสี gradient text

```css
html.midnight {
  --t-grad-from: 74 222 128;   /* เริ่ม */
  --t-grad-via: 52 211 153;    /* กลาง */
  --t-grad-to: 34 211 238;     /* จบ */
}
```

---

## 8. การเพิ่ม Theme ใหม่

### ขั้นตอน

#### 1. เพิ่ม CSS Variables

ใน `assets/css/tailwind.css` เพิ่ม block ใหม่:

```css
html.ocean {
  --t-bg: 15 23 42;
  --t-bg-alt: 30 41 59;
  --t-bg-el: 51 65 85;
  --t-fg: 248 250 252;
  --t-body: 226 232 240;
  --t-muted: 148 163 184;
  --t-subtle: 100 116 139;
  --t-faint: 71 85 105;
  --t-overlay: 255 255 255;
  --t-edge: 255 255 255;
  --t-accent: 56 189 248;
  --t-accent-soft: 125 211 252;
  --t-accent-cyan: 34 211 238;
  --t-accent-violet: 196 181 253;
  --t-grad-from: 56 189 248;
  --t-grad-via: 34 211 238;
  --t-grad-to: 45 212 191;
  --t-ring-from: 14 165 233;
  --t-ring-via: 34 211 238;
  --t-ring-to: 20 184 166;
  --t-btn: 14 165 233;
  --t-btn-hover: 56 189 248;
  --t-card-bg: 255 255 255;
  --t-card-alpha: 0.05;
  --t-card-border-alpha: 0.1;
  --t-card-shadow: none;
}
```

#### 2. อัปเดท Type

ใน `composables/useTheme.ts` เปลี่ยน:

```ts
// ก่อน
export type Theme = 'midnight' | 'sunshine'

// หลัง
export type Theme = 'midnight' | 'sunshine' | 'ocean'
```

#### 3. อัปเดท FOUC Script

ใน `nuxt.config.ts` อัปเดท inline script:

```js
if (t === 'midnight' || t === 'sunshine' || t === 'ocean') {
```

#### 4. อัปเดท Toggle Logic

ใน `useTheme.ts` แก้ `toggleTheme()` ให้รองรับ theme มากกว่า 2:

```ts
const themes: Theme[] = ['midnight', 'sunshine', 'ocean']

const toggleTheme = () => {
  const currentIndex = themes.indexOf(theme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  const newTheme = themes[nextIndex]
  // ... เหมือนเดิม
}
```

#### 5. อัปเดท ThemeToggle.vue

แก้ icon ให้รองรับ theme ใหม่ (เพิ่ม icon ที่ 3)

#### 6. อัปเดท Backend API

เพิ่ม `'ocean'` ให้ `site_settings.default_theme` รองรับ
