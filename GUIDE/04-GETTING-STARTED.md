# Getting Started — การติดตั้งและรันโปรเจกต์

เอกสารนี้อธิบายขั้นตอนตั้งแต่ clone repo จนถึงรัน development server สำเร็จ

---

## สารบัญ

1. [Prerequisites](#1-prerequisites)
2. [Installation](#2-installation)
3. [Environment Setup](#3-environment-setup)
4. [Running Development Server](#4-running-development-server)
5. [Building for Production](#5-building-for-production)
6. [Project Scripts](#6-project-scripts)
7. [Backend Requirement](#7-backend-requirement)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

ก่อนเริ่มต้น ต้องติดตั้ง:

| เครื่องมือ | Version ขั้นต่ำ | ตรวจสอบ |
| --------- | -------------- | ------- |
| **Node.js** | 18+ (แนะนำ 20 LTS) | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | ล่าสุด | `git --version` |

### ติดตั้ง Node.js

- **Windows:** ดาวน์โหลดจาก [nodejs.org](https://nodejs.org/) หรือใช้ [nvm-windows](https://github.com/coreybutler/nvm-windows)
- **macOS:** `brew install node` หรือใช้ [nvm](https://github.com/nvm-sh/nvm)
- **Linux:** ใช้ [nvm](https://github.com/nvm-sh/nvm) (แนะนำ)

---

## 2. Installation

### 2.1 Clone Repository

```bash
git clone <repository-url>
cd Portfolio
```

### 2.2 ติดตั้ง Dependencies

```bash
npm install
```

คำสั่งนี้จะ:
1. ดาวน์โหลด packages ตาม `package-lock.json`
2. รัน `postinstall` script → `nuxt prepare` → สร้าง `.nuxt/` directory พร้อม TypeScript types

### 2.3 ตรวจสอบ

หลัง install สำเร็จ จะเห็นโฟลเดอร์เหล่านี้:
```
Portfolio/
├── node_modules/    ← ✅ ถูกสร้างแล้ว
├── .nuxt/           ← ✅ ถูกสร้างแล้ว (จาก nuxt prepare)
└── ...
```

---

## 3. Environment Setup

### 3.1 สร้างไฟล์ `.env`

```bash
cp .env.example .env
```

### 3.2 แก้ไขค่า

เปิด `.env` แล้วตั้งค่า URL ของ Backend API:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

| ค่า | อธิบาย | ตัวอย่าง |
| --- | ------ | -------- |
| `NUXT_PUBLIC_API_BASE_URL` | URL ของ Backend API server | `http://localhost:8080` (dev), `https://api.example.com` (prod) |

> **หมายเหตุ:** ค่านี้ถูกใช้ใน `useRuntimeConfig().public.apiBaseUrl`
> ถ้าไม่ตั้ง จะใช้ค่า default `http://localhost:8080`

---

## 4. Running Development Server

### 4.1 เริ่ม Dev Server

```bash
npm run dev
```

### 4.2 เปิดในเบราว์เซอร์

```
http://localhost:3000
```

### 4.3 สิ่งที่ Dev Server ให้

| Feature | อธิบาย |
| ------- | ------ |
| **Hot Module Replacement (HMR)** | แก้โค้ดแล้วเห็นผลทันทีโดยไม่ต้อง refresh |
| **Nuxt DevTools** | เครื่องมือ debug (เปิดอยู่ใน `nuxt.config.ts`) |
| **TypeScript Checking** | แจ้ง type errors ใน terminal |
| **Auto-imports** | ไม่ต้อง import Vue APIs, composables, components |

### 4.4 ข้อควรรู้

- Frontend จะ **ต้องมี Backend API** รันอยู่เพื่อแสดงข้อมูล
- ถ้า Backend ยังไม่พร้อม เว็บจะแสดงค่า fallback (ข้อความ default)
- Contact form จะ **ส่งข้อมูลไม่ได้** ถ้า Backend ไม่รัน

---

## 5. Building for Production

### 5.1 SSR Build (Server-Side Rendering)

```bash
npm run build
```

สร้าง output ใน `.output/` directory พร้อม Node.js server

**Preview production build:**
```bash
npm run preview
```

### 5.2 Static Site Generation (SSG)

```bash
npm run generate
```

สร้าง static HTML files ใน `dist/` directory — deploy ได้บน static hosting (Netlify, Vercel, GitHub Pages)

### 5.3 เปรียบเทียบ Build Modes

| Mode | คำสั่ง | Output | เหมาะกับ |
| ---- | ------ | ------ | -------- |
| **SSR** | `npm run build` | `.output/` (Node.js server) | เว็บที่ต้อง SEO ดี, data เปลี่ยนบ่อย |
| **SSG** | `npm run generate` | `dist/` (static files) | เว็บ portfolio ที่ data ไม่เปลี่ยนบ่อย |

> สำหรับ Portfolio website ส่วนใหญ่แนะนำ **SSG** เพราะ data ไม่เปลี่ยนบ่อย และ deploy ง่ายกว่า

---

## 6. Project Scripts

| Script | คำสั่ง | ทำอะไร |
| ------ | ------ | ------ |
| `npm run dev` | `nuxt dev` | รัน development server (port 3000) พร้อม HMR |
| `npm run build` | `nuxt build` | Build สำหรับ production (SSR mode) |
| `npm run generate` | `nuxt generate` | Generate static HTML (SSG mode) |
| `npm run preview` | `nuxt preview` | Preview production build ก่อน deploy |
| `npm run postinstall` | `nuxt prepare` | สร้าง `.nuxt/` types (รันอัตโนมัติหลัง npm install) |

---

## 7. Backend Requirement

โปรเจกต์นี้เป็น **Frontend only** — ต้องมี Backend API แยกต่างหาก

### สิ่งที่ Backend ต้องรองรับ

| ส่วน | Endpoint | วิธี |
| ---- | -------- | ---- |
| Site resolve | `GET /api/v1/public/sites/by-domain?host=:hostname` | Return site ที่ผูกกับ host ปัจจุบัน |
| Portfolio data | `GET /api/v1/public/sites/{siteId}/portfolio` | Return JSON ตาม format ใน `PORTFOLIO_FRONTEND_SPEC.md` |
| Contact form | `POST /api/v1/public/sites/{siteId}/portfolio/contacts` | รับ JSON body: `{ name, email, subject, message }` |
| Images | `GET /uploads/*` | Serve static files (profile image, project images) |
| CORS | - | อนุญาต origin ของเว็บนี้; backend สามารถโหลด portfolio domains จาก `sites.domains` |

ค่า `host` ต้องตรงกับรายการใน backend `sites.domains` แบบ exact match เช่น `localhost:3000`

### Multi-site Checklist

ก่อนเว็บนี้จะแสดงข้อมูลได้ ต้องมี site ใน backend ก่อน:

1. สร้าง site ที่ Admin Dashboard หน้า `Site Management`
2. ตั้ง `type` เป็น `portfolio`
3. ใส่ `domains` ให้ตรงกับ host ของเว็บนี้ เช่น `localhost:3000` หรือ `portfolio-nu-gray-57.vercel.app`
4. ห้ามใส่ protocol หรือ slash ใน `domains` เช่นไม่ใช้ `https://portfolio-nu-gray-57.vercel.app/`
5. ตั้ง `NUXT_PUBLIC_API_BASE_URL` ของเว็บนี้ให้ชี้ backend ตัวเดียวกับ Admin Dashboard

### ถ้ายังไม่มี Backend

Frontend จะยังรันได้ แต่:
- ทุก section จะแสดง **ค่า default/fallback** (ข้อความว่างหรือ placeholder)
- Contact form จะแสดง **error** เมื่อกดส่ง
- รูป profile จะใช้ **fallback image** จาก `/images/profile.jpg`

### Mock Data (ทางเลือก)

ถ้าต้องการทดสอบ Frontend โดยไม่มี Backend สามารถ:
1. ใช้เครื่องมืออย่าง [json-server](https://github.com/typicode/json-server) สร้าง mock API
2. สร้างไฟล์ JSON แล้ว serve ด้วย simple HTTP server
3. แก้ `usePortfolioData.ts` ชั่วคราวให้ return mock data

---

## 8. Troubleshooting

### ปัญหาที่พบบ่อย

#### "Cannot find module" หลัง clone

```bash
# ลบ node_modules แล้ว install ใหม่
rm -rf node_modules .nuxt
npm install
```

#### Port 3000 ถูกใช้อยู่แล้ว

```bash
# Nuxt จะเลือก port ถัดไปอัตโนมัติ (3001, 3002, ...)
# หรือกำหนด port เอง:
npx nuxt dev --port 3001
```

#### TypeScript errors ใน IDE

```bash
# Re-generate Nuxt types
npx nuxt prepare
```

#### CORS error เมื่อเรียก API

ตรวจสอบว่า Backend อนุญาต origin ของ Frontend:
- Dev: `http://localhost:3000`
- Production: domain จริงของเว็บ
- ถ้า domain ถูกสร้างผ่าน `Site Management` แล้ว ให้ตรวจว่า host อยู่ใน `sites.domains` และรอ `DomainCache` refresh หรือ restart backend

#### รูปภาพไม่แสดง

ตรวจสอบ:
1. Backend กำลังรันอยู่
2. `NUXT_PUBLIC_API_BASE_URL` ใน `.env` ตรงกับ URL ของ Backend
3. Backend serve static files จาก `/uploads/`

#### เว็บแสดงข้อมูลว่าง

ตรวจสอบ:
1. Backend กำลังรันอยู่ที่ URL ที่กำหนดใน `.env`
2. มี site type `portfolio` ที่ `domains` ตรงกับ host ปัจจุบัน
3. Backend return JSON ตรงตาม format ใน `PORTFOLIO_FRONTEND_SPEC.md`
4. ดู Console / Network tab ใน DevTools เพื่อดู error

---

## Quick Start Summary

```bash
# 1. Clone
git clone <repository-url>
cd Portfolio

# 2. Install
npm install

# 3. Setup environment
cp .env.example .env
# แก้ NUXT_PUBLIC_API_BASE_URL ถ้าจำเป็น

# 4. Start Backend API (แยกต่างหาก)
# ...

# 5. Run Frontend
npm run dev

# 6. เปิด http://localhost:3000
```
