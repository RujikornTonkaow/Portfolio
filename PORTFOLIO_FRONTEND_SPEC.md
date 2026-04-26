# Portfolio Frontend — API Specification for Backend

เอกสารนี้ระบุ **API contract** ที่ Portfolio Frontend ต้องการจาก Backend
Frontend resolve site จาก hostname ก่อน แล้วดึงข้อมูล/ส่ง contact form ผ่าน public multi-site endpoints

---

## สารบัญ

1. [API Endpoints](#1-api-endpoints)
2. [API Response Format](#2-api-response-format)
3. [Data Model แต่ละส่วน](#3-data-model-แต่ละส่วน)
4. [รูปภาพ](#4-รูปภาพ)
5. [Contact Form](#5-contact-form)
6. [Naming Convention](#6-naming-convention)

---

## 1. API Endpoints

### Public Endpoints (ไม่ต้อง auth)

| Method | URL                                             | คำอธิบาย                                      |
| ------ | ----------------------------------------------- | --------------------------------------------- |
| `GET`  | `/api/v1/public/sites/by-domain?host=:hostname` | แปลง hostname เป็น site                       |
| `GET`  | `/api/v1/public/sites/{siteId}/portfolio`       | ดึงข้อมูล portfolio ทั้งหมดของ site ใน response เดียว |
| `POST` | `/api/v1/public/sites/{siteId}/portfolio/contacts` | รับข้อความจาก contact form ของ site นั้น       |

Frontend อ่าน `host` จาก URL ปัจจุบันด้วย Nuxt SSR/client runtime และส่งค่าแบบ exact match เช่น `localhost:3000` ถ้า backend เก็บ domain พร้อม port ใน `sites.domains`

### CORS

Backend ต้องอนุญาต origin ของ Portfolio Frontend (เช่น `http://localhost:3000` สำหรับ dev)

---

## 2. API Response Format

Frontend คาดหวัง JSON envelope format:

```json
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
```

Domain resolve response:

```json
{
  "data": {
    "id": "6789abcdef0123456789abcd",
    "name": "My Portfolio",
    "slug": "default",
    "type": "portfolio",
    "domains": ["localhost:3000"],
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
}
```

Error response:

```json
{
  "error": "error message string"
}
```

---

## 3. Data Model แต่ละส่วน

### 3.1 site_settings (object)

| field            | type   | required | คำอธิบาย                                      |
| ---------------- | ------ | -------- | --------------------------------------------- |
| id               | string | ✅       | unique identifier                              |
| site_title       | string | ✅       | ชื่อเว็บ แสดงบน Navbar และ Footer               |
| page_title       | string | ✅       | title ใน browser tab                           |
| meta_description | string | ✅       | SEO meta description                           |
| footer_tagline   | string | ✅       | ข้อความใต้ชื่อเว็บใน Footer                     |
| default_theme    | string | ✅       | ค่าที่เป็นไปได้: `"midnight"` หรือ `"sunshine"` |
| profile_image    | string | ✅       | path ของรูป profile เช่น `/uploads/abc123.jpg` |

### 3.2 hero (object)

| field              | type   | required | คำอธิบาย                              |
| ------------------ | ------ | -------- | ------------------------------------- |
| greeting           | string | ✅       | เช่น `"Hello, I'm"`                   |
| full_name          | string | ✅       | ชื่อเต็ม                               |
| subtitle           | string | ✅       | คำอธิบายสั้นๆ ใต้ชื่อ                   |
| cta_primary_text   | string | ✅       | ข้อความปุ่มหลัก เช่น `"View My Work"` |
| cta_primary_link   | string | ✅       | link ปุ่มหลัก เช่น `"#projects"`       |
| cta_secondary_text | string | ✅       | ข้อความปุ่มรอง เช่น `"Get in Touch"`  |
| cta_secondary_link | string | ✅       | link ปุ่มรอง เช่น `"#contact"`         |

### 3.3 about (object)

| field            | type     | required | คำอธิบาย                                  |
| ---------------- | -------- | -------- | ----------------------------------------- |
| title            | string   | ✅       | หัวข้อ section                             |
| bio_paragraphs   | string[] | ✅       | เนื้อหาแนะนำตัว (array ของ paragraphs)     |
| personality_tags | string[] | ✅       | tags คุณสมบัติ เช่น `["Problem Solver", "Team Player"]` |
| stats            | Stat[]   | ✅       | ดู Stat object ด้านล่าง                    |

**Stat object:**

| field | type   | required | คำอธิบาย                             |
| ----- | ------ | -------- | ------------------------------------ |
| value | string | ✅       | ค่าตัวเลข เช่น `"5+"`, `"99%"`       |
| label | string | ✅       | คำอธิบาย เช่น `"Years Experience"`   |

### 3.4 skills (array)

| field      | type   | required | คำอธิบาย                                                  |
| ---------- | ------ | -------- | --------------------------------------------------------- |
| id         | string | ✅       | unique identifier                                          |
| name       | string | ✅       | ชื่อ skill เช่น `"Vue.js"`, `"Go"`                         |
| icon       | string | ✅       | Iconify icon name เช่น `"logos:vue"`, `"logos:go"` (ดูหมายเหตุ) |
| category   | string | ✅       | ค่าที่เป็นไปได้: `"frontend"`, `"backend"`, `"devops"`, `"tools"` |
| sort_order | number | ✅       | ลำดับการแสดงผล (เรียงจากน้อยไปมาก)                         |
| created_at | string | ✅       | ISO 8601 timestamp                                         |
| updated_at | string | ✅       | ISO 8601 timestamp                                         |

**หมายเหตุเรื่อง icon:**
- Frontend ใช้ [Iconify](https://icon-sets.iconify.design/) สำหรับแสดง icon
- Collection ที่ใช้: `logos:` (tech logos), `mdi:` (Material Design Icons)
- ตัวอย่าง: `"logos:vue"`, `"logos:go"`, `"logos:docker-icon"`, `"mdi:github"`
- Admin Panel ควรมี text input ให้กรอก icon name (หรือ icon picker ถ้ามี)

### 3.5 projects (array)

| field       | type     | required | คำอธิบาย                                |
| ----------- | -------- | -------- | --------------------------------------- |
| id          | string   | ✅       | unique identifier                        |
| title       | string   | ✅       | ชื่อ project                              |
| description | string   | ✅       | คำอธิบาย (1-2 ประโยค)                     |
| tags        | string[] | ✅       | เทคโนโลยีที่ใช้ เช่น `["Nuxt 3", "Go"]`  |
| image       | string   | ❌       | path รูป project เช่น `/uploads/xyz.jpg` ถ้าไม่มีจะแสดง icon placeholder |
| live_url    | string   | ❌       | URL ของ live demo                        |
| source_url  | string   | ❌       | URL ของ source code                      |
| sort_order  | number   | ✅       | ลำดับการแสดงผล                            |
| created_at  | string   | ✅       | ISO 8601 timestamp                       |
| updated_at  | string   | ✅       | ISO 8601 timestamp                       |

### 3.6 experiences (array)

| field       | type     | required | คำอธิบาย                                     |
| ----------- | -------- | -------- | -------------------------------------------- |
| id          | string   | ✅       | unique identifier                             |
| role        | string   | ✅       | ตำแหน่งงาน เช่น `"Senior Full-Stack Developer"` |
| company     | string   | ✅       | ชื่อบริษัท                                    |
| period      | string   | ✅       | ช่วงเวลา เช่น `"2024 - Present"`              |
| description | string   | ✅       | คำอธิบายงาน (1 ประโยค)                         |
| highlights  | string[] | ✅       | ผลงานเด่น (array ของ bullet points)           |
| sort_order  | number   | ✅       | ลำดับการแสดงผล — item แรก (sort_order ต่ำสุด) จะถูก highlight เป็นตำแหน่งปัจจุบัน |
| created_at  | string   | ✅       | ISO 8601 timestamp                            |
| updated_at  | string   | ✅       | ISO 8601 timestamp                            |

### 3.7 social_links (array)

| field      | type   | required | คำอธิบาย                                        |
| ---------- | ------ | -------- | ----------------------------------------------- |
| id         | string | ✅       | unique identifier                                |
| name       | string | ✅       | ชื่อ platform เช่น `"GitHub"`, `"LinkedIn"`       |
| url        | string | ✅       | URL เช่น `"https://github.com/username"`         |
| icon       | string | ✅       | Iconify icon name เช่น `"mdi:github"`, `"mdi:linkedin"` |
| sort_order | number | ✅       | ลำดับการแสดงผล                                    |
| created_at | string | ✅       | ISO 8601 timestamp                               |
| updated_at | string | ✅       | ISO 8601 timestamp                               |

**ถูกใช้ใน 3 จุด:** Hero section, Contact section, Footer
ดังนั้น API ต้อง return ชุดเดียวกัน

### 3.8 nav_items (array)

| field | type   | required | คำอธิบาย                                  |
| ----- | ------ | -------- | ----------------------------------------- |
| label | string | ✅       | ข้อความบน Navbar เช่น `"Home"`, `"About"` |
| href  | string | ✅       | anchor link เช่น `"#hero"`, `"#about"`    |

---

## 4. รูปภาพ

Frontend ดึงรูปภาพจาก API base URL + path ที่ได้จาก response:

```
{API_BASE_URL}{image_path}
```

ตัวอย่าง: ถ้า `API_BASE_URL = http://localhost:8080` และ `profile_image = /uploads/abc123.jpg`
จะได้ URL: `http://localhost:8080/uploads/abc123.jpg`

**Backend ต้องรองรับ:**

| ประเภท         | field ที่ใช้               | ขนาดแนะนำ   |
| -------------- | ------------------------- | ------------ |
| Profile image  | `site_settings.profile_image` | 400×400px    |
| Project image  | `projects[].image`            | 800×400px    |

- Backend ต้อง serve static files จาก path `/uploads/`
- ถ้า `projects[].image` เป็น empty string หรือ null จะแสดง icon placeholder แทน

---

## 5. Contact Form

### Request

```
POST /api/v1/public/sites/{siteId}/portfolio/contacts
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Discussion",
  "message": "I'd like to discuss a project..."
}
```

| field   | type   | required | validation                  |
| ------- | ------ | -------- | --------------------------- |
| name    | string | ✅       | ไม่ว่าง                      |
| email   | string | ✅       | valid email format          |
| subject | string | ✅       | ไม่ว่าง                      |
| message | string | ✅       | ไม่ว่าง                      |

### Success Response

```json
{
  "data": {
    "message": "Contact message sent successfully"
  }
}
```

### Error Response

```json
{
  "error": "validation error message"
}
```

Frontend แสดง `error` string โดยตรงให้ผู้ใช้เห็น ดังนั้นควรเป็นข้อความที่อ่านได้

---

## 6. Naming Convention

**ทุก field ใช้ snake_case** ตลอดทั้ง API response

| ถูก (snake_case)  | ผิด (camelCase) |
| ----------------- | --------------- |
| `live_url`        | `liveUrl`       |
| `source_url`      | `sourceUrl`     |
| `sort_order`      | `sortOrder`     |
| `full_name`       | `fullName`      |
| `site_title`      | `siteTitle`     |
| `bio_paragraphs`  | `bioParagraphs` |
| `created_at`      | `createdAt`     |
| `updated_at`      | `updatedAt`     |
