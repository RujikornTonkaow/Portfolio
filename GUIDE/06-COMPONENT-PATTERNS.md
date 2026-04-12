# Component Patterns — แนวทางการเขียนและขยาย Component

เอกสารนี้อธิบาย patterns และ conventions ที่ใช้ในโปรเจกต์ พร้อมแนวทางสำหรับคนที่จะพัฒนาต่อ

---

## สารบัญ

1. [Naming Conventions](#1-naming-conventions)
2. [Component Structure](#2-component-structure)
3. [Data Flow Pattern](#3-data-flow-pattern)
4. [การเพิ่ม Section ใหม่](#4-การเพิ่ม-section-ใหม่)
5. [การเพิ่ม Component ใหม่](#5-การเพิ่ม-component-ใหม่)
6. [การสร้าง Composable ใหม่](#6-การสร้าง-composable-ใหม่)
7. [Responsive Design Pattern](#7-responsive-design-pattern)
8. [Animation Pattern](#8-animation-pattern)
9. [Accessibility Guidelines](#9-accessibility-guidelines)
10. [API Data Convention](#10-api-data-convention)
11. [SSR vs Client-Side Patterns](#11-ssr-vs-client-side-patterns)
12. [Do's and Don'ts](#12-dos-and-donts)

---

## 1. Naming Conventions

### ไฟล์ Component

| Pattern | ตัวอย่าง | ใช้สำหรับ |
| ------- | -------- | --------- |
| `The*.vue` | `TheNavbar.vue`, `TheFooter.vue` | Component ที่ใช้ **ครั้งเดียว** ทั้ง app (singleton) |
| `Section*.vue` | `SectionHero.vue`, `SectionAbout.vue` | **Section** ของหน้า (แต่ละ section ของ portfolio) |
| `PascalCase.vue` | `ProfileAvatar.vue`, `ThemeToggle.vue` | Component ทั่วไปที่ reuse ได้ |

### ไฟล์ Composable

| Pattern | ตัวอย่าง |
| ------- | -------- |
| `use*.ts` | `usePortfolioData.ts`, `useTheme.ts` |

- ชื่อขึ้นต้นด้วย `use` เสมอ (ตาม Vue convention)
- Nuxt auto-import ให้อัตโนมัติ

### ไฟล์ Type

| Pattern | ตัวอย่าง |
| ------- | -------- |
| `*.ts` ใน `types/` | `portfolio.ts` |

- ใช้ PascalCase สำหรับ interface names: `SiteSettings`, `HeroData`
- API fields ใช้ snake_case: `site_title`, `full_name`

### Variables & Functions ใน Component

| ชนิด | Convention | ตัวอย่าง |
| ---- | ---------- | -------- |
| Event handler | `handle*` | `handleSubmit`, `handleScroll` |
| Boolean ref | `is*` / `has*` | `isScrolled`, `isMobileMenuOpen` |
| Loading state | `*ing` | `submitting`, `pending` |
| Error state | `*Error` | `submitError` |
| Success state | `*Success` | `submitSuccess` |

---

## 2. Component Structure

ทุก component ใช้โครงสร้างเดียวกัน:

```vue
<script setup lang="ts">
// 1. imports (ถ้าจำเป็น — ส่วนใหญ่ Nuxt auto-import)
import type { SomeType } from '~/types/portfolio'

// 2. composables
const { data, getImageUrl } = usePortfolioData()

// 3. reactive state
const isOpen = ref(false)

// 4. computed
const filteredData = computed(() => ...)

// 5. functions
const handleClick = () => { ... }

// 6. lifecycle hooks
onMounted(() => { ... })
onUnmounted(() => { ... })
</script>

<template>
  <section id="section-name" class="section-padding">
    <div class="section-container">
      <!-- content -->
    </div>
  </section>
</template>
```

### กฎสำคัญ

- ใช้ `<script setup lang="ts">` เสมอ — ไม่ใช้ Options API
- ไม่ต้อง import Vue APIs (`ref`, `computed`, `onMounted`) — Nuxt auto-import
- ไม่ต้อง import components — Nuxt auto-import จาก `components/`
- Type imports ต้อง import ด้วย `import type` เอง (จาก `~/types/`)

---

## 3. Data Flow Pattern

### ทุก Section ใช้ pattern เดียวกัน

```
usePortfolioData()     ← composable กลาง (แชร์ data ข้าม components)
       │
       ├─ สำเร็จ → แสดงข้อมูลจาก API
       └─ ยังโหลดไม่เสร็จ / error → แสดงค่า fallback ด้วย ?? operator
```

**ตัวอย่าง:**

```vue
<script setup lang="ts">
const { hero } = usePortfolioData()
</script>

<template>
  <!-- ใช้ ?? ให้ค่า fallback เสมอ -->
  <h1>{{ hero?.full_name ?? '' }}</h1>
  <p>{{ hero?.subtitle ?? '' }}</p>
</template>
```

### Optional Chaining + Nullish Coalescing

ทุก computed ref จาก `usePortfolioData()` อาจเป็น `null` (ตอนยังโหลดไม่เสร็จ):

```vue
<!-- Object → ใช้ ?. และ ?? -->
{{ siteSettings?.site_title ?? 'Portfolio' }}

<!-- Array → ใช้ ?? [] กับ v-for -->
<div v-for="skill in skills" :key="skill.id">
  <!-- skills default เป็น [] จาก composable แล้ว ไม่ต้อง ?? -->
</div>
```

---

## 4. การเพิ่ม Section ใหม่

### ตัวอย่าง: เพิ่ม "Testimonials" section

#### ขั้นตอนที่ 1: เพิ่ม Type

ใน `types/portfolio.ts`:

```ts
export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PortfolioData {
  // ... existing fields
  testimonials: Testimonial[]  // เพิ่มบรรทัดนี้
}
```

#### ขั้นตอนที่ 2: เพิ่มใน Composable

ใน `composables/usePortfolioData.ts`:

```ts
const testimonials = computed(() => portfolio.value?.testimonials ?? [])

return {
  // ... existing returns
  testimonials,
}
```

#### ขั้นตอนที่ 3: สร้าง Component

สร้างไฟล์ `components/SectionTestimonials.vue`:

```vue
<script setup lang="ts">
const { testimonials, getImageUrl } = usePortfolioData()
</script>

<template>
  <section id="testimonials" class="section-padding bg-th-bg-alt">
    <div class="section-container">
      <div class="text-center mb-14">
        <p class="text-th-accent font-mono text-sm tracking-wider mb-3">
          Testimonials
        </p>
        <h2 class="text-3xl md:text-4xl font-bold text-th-fg">
          What people
          <span class="gradient-text">say</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="item in testimonials"
          :key="item.id"
          class="glass-card p-6"
        >
          <p class="text-th-muted italic mb-4">
            "{{ item.content }}"
          </p>
          <div class="flex items-center gap-3">
            <img
              v-if="item.avatar"
              :src="getImageUrl(item.avatar)!"
              :alt="item.name"
              class="w-10 h-10 rounded-full object-cover"
            >
            <div>
              <p class="text-th-fg font-medium text-sm">{{ item.name }}</p>
              <p class="text-th-subtle text-xs">{{ item.role }}, {{ item.company }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
```

#### ขั้นตอนที่ 4: เพิ่มใน Page

ใน `pages/index.vue`:

```vue
<template>
  <div>
    <SectionHero />
    <SectionAbout />
    <SectionSkills />
    <SectionProjects />
    <SectionExperience />
    <SectionTestimonials />    <!-- เพิ่มบรรทัดนี้ -->
    <SectionContact />
  </div>
</template>
```

#### ขั้นตอนที่ 5: อัปเดท Backend API

เพิ่ม `testimonials` array ใน `GET /api/v1/portfolio` response

---

## 5. การเพิ่ม Component ใหม่

### Component ที่ reuse ได้ (เช่น Badge, Card)

สร้างใน `components/` ด้วย PascalCase:

```vue
<!-- components/SkillBadge.vue -->
<script setup lang="ts">
interface Props {
  name: string
  icon: string
}

defineProps<Props>()
</script>

<template>
  <div class="glass-card p-4 flex items-center gap-3">
    <Icon :name="icon" size="24" />
    <span class="text-th-body text-sm font-medium">{{ name }}</span>
  </div>
</template>
```

ใช้ได้ทันทีโดยไม่ต้อง import (Nuxt auto-import):

```vue
<SkillBadge name="Vue.js" icon="logos:vue" />
```

---

## 6. การสร้าง Composable ใหม่

### เมื่อไหร่ควรสร้าง Composable

| สถานการณ์ | ทำอะไร |
| --------- | ------ |
| Logic ใช้ใน **component เดียว** + ไม่ซับซ้อน | เขียนใน component นั้น |
| Logic **ใช้ซ้ำ** ข้าม 2+ components | สร้าง composable |
| Logic เกี่ยวกับ **reactive state** ที่ต้อง share | สร้าง composable |
| Logic เป็น **pure function** ไม่มี reactivity | ใส่ใน `utils/` แทน |

### โครงสร้าง Composable

สร้างไฟล์ใน `composables/` ด้วยชื่อ `use*.ts` → Nuxt auto-import ให้อัตโนมัติ

```ts
// composables/useScrollSpy.ts

export const useScrollSpy = (options?: { offset?: number }) => {
  const activeSection = ref('')
  const offset = options?.offset ?? 80

  const handleScroll = () => {
    if (!import.meta.client) return

    const sections = document.querySelectorAll('section[id]')
    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      if (rect.top <= offset && rect.bottom > offset) {
        activeSection.value = section.id
        break
      }
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { activeSection: readonly(activeSection) }
}
```

### Checklist สำหรับ Composable ใหม่

1. **ชื่อ** — ขึ้นต้นด้วย `use` เสมอ: `useScrollSpy`, `useFormValidation`
2. **ไฟล์** — วางใน `composables/` → Nuxt auto-import ให้ ไม่ต้อง import เอง
3. **SSR Guard** — ถ้าเข้าถึง `window`, `document`, `localStorage` → ห่อด้วย `if (import.meta.client)`
4. **Cleanup** — ถ้า register listener/interval/observer → ลบใน `onUnmounted()`
5. **Return** — return ค่าเป็น object `{ data, loading, error, ... }`
6. **Readonly** — ถ้า state ไม่ควรถูกแก้จากภายนอก → ห่อด้วย `readonly()`
7. **Options** — ถ้ามีค่า config → รับเป็น object parameter ตัวเดียว พร้อม default

### ตัวอย่าง: Composable สำหรับ Form Validation

```ts
// composables/useFormValidation.ts

interface ValidationRules {
  required?: boolean
  email?: boolean
  minLength?: number
}

interface FieldConfig {
  [fieldName: string]: ValidationRules
}

export const useFormValidation = (fields: FieldConfig) => {
  const errors = reactive<Record<string, string>>({})

  const validate = (fieldName: string, value: string): boolean => {
    const rules = fields[fieldName]
    if (!rules) return true

    if (rules.required && !value.trim()) {
      errors[fieldName] = `${fieldName} is required`
      return false
    }
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[fieldName] = 'Invalid email format'
      return false
    }
    if (rules.minLength && value.length < rules.minLength) {
      errors[fieldName] = `Minimum ${rules.minLength} characters`
      return false
    }

    delete errors[fieldName]
    return true
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0)

  return { errors: readonly(errors), validate, clearErrors, hasErrors }
}
```

**ใช้ใน component:**

```vue
<script setup lang="ts">
const { errors, validate, hasErrors } = useFormValidation({
  name: { required: true },
  email: { required: true, email: true },
  message: { required: true, minLength: 10 },
})
</script>
```

### Composable ที่มีอยู่ในโปรเจกต์

| Composable | หน้าที่ | รายละเอียด |
| ---------- | ------- | ---------- |
| `usePortfolioData` | ดึงข้อมูล portfolio จาก API + แจก computed refs | ดู [02-FILE-REFERENCE.md](./02-FILE-REFERENCE.md#4-composables) |
| `useTheme` | จัดการ theme midnight/sunshine + localStorage | ดู [05-THEMING-GUIDE.md](./05-THEMING-GUIDE.md#4-theme-composable) |

---

## 7. Responsive Design Pattern

### Breakpoints ที่ใช้

| Breakpoint | ขนาด | ใช้สำหรับ |
| ---------- | ---- | --------- |
| default | `< 640px` | Mobile |
| `sm:` | `≥ 640px` | Mobile landscape |
| `md:` | `≥ 768px` | Tablet |
| `lg:` | `≥ 1024px` | Desktop |
| `xl:` | `≥ 1280px` | Large desktop |

### Pattern ที่ใช้ในโปรเจกต์

#### Grid Layout

```html
<!-- 1 คอลัมน์ mobile → 2 คอลัมน์ tablet+ -->
<div class="grid md:grid-cols-2 gap-6">

<!-- 2 คอลัมน์ mobile → 3 tablet → 4 desktop → 5 large -->
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
```

#### Typography Scaling

```html
<h1 class="text-4xl md:text-5xl lg:text-6xl">
<h2 class="text-3xl md:text-4xl">
<p class="text-lg sm:text-xl md:text-2xl">
```

#### Spacing

```html
<!-- section padding: 80px mobile → 112px desktop -->
<section class="section-padding">  <!-- py-20 md:py-28 -->

<!-- container padding: 16px → 24px → 32px -->
<div class="section-container">    <!-- px-4 sm:px-6 lg:px-8 -->
```

#### Show/Hide

```html
<!-- ซ่อนใน mobile, แสดง desktop -->
<div class="hidden md:flex">

<!-- แสดง mobile, ซ่อน desktop -->
<div class="flex md:hidden">
```

---

## 8. Animation Pattern

### Animations ที่กำหนดใน Tailwind

| Class | Effect | Duration |
| ----- | ------ | -------- |
| `animate-fade-in` | Fade in จาก opacity 0 → 1 | 0.6s |
| `animate-slide-up` | Slide up 30px + fade in | 0.6s |
| `animate-float` | Float ขึ้นลง 20px | 6s loop |
| `animate-bounce` | Bounce (built-in Tailwind) | - |

### Staggered Animation (ด้วย Animation Delay)

```html
<div class="animate-slide-up">                               <!-- ทำงานทันที -->
<div class="animate-slide-up [animation-delay:0.2s] opacity-0"> <!-- delay 0.2s -->
<div class="animate-slide-up [animation-delay:0.4s] opacity-0"> <!-- delay 0.4s -->
```

> `opacity-0` สำคัญ — ป้องกัน flash ก่อน animation เริ่ม

### Vue Transition

ใช้สำหรับ show/hide elements:

```vue
<Transition
  enter-active-class="transition-all duration-300 ease-out"
  enter-from-class="opacity-0 -translate-y-2"
  enter-to-class="opacity-100 translate-y-0"
  leave-active-class="transition-all duration-200 ease-in"
  leave-from-class="opacity-100 translate-y-0"
  leave-to-class="opacity-0 -translate-y-2"
>
  <div v-if="isVisible">...</div>
</Transition>
```

### Hover Effects ที่ใช้บ่อย

```html
<!-- ยกขึ้น -->
hover:-translate-y-0.5
hover:-translate-y-1

<!-- เปลี่ยนสีขอบ -->
hover:border-primary-500/30

<!-- ขยาย -->
group-hover:scale-105
group-hover:scale-110
```

---

## 9. Accessibility Guidelines

### Pattern ที่ใช้ในโปรเจกต์

| สิ่งที่ทำ | ตัวอย่าง |
| --------- | -------- |
| `aria-label` | ปุ่ม icon, social links |
| Semantic HTML | `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>` |
| `alt` text | `<img :alt="project.title">` |
| `<label for>` | ทุก input ใน contact form |
| `required` | Input validation |
| Keyboard focus | `focus:outline-none focus:border-primary-500/50 focus:ring-1` |
| Link targets | `target="_blank" rel="noopener noreferrer"` สำหรับ external links |

### เมื่อเพิ่ม component ใหม่ ควร:

1. ใช้ semantic HTML tags
2. ใส่ `aria-label` ให้ปุ่ม icon
3. ใส่ `alt` ให้ทุกรูป
4. ใช้ `<label>` สำหรับ form inputs
5. ทดสอบ keyboard navigation (Tab, Enter, Escape)

---

## 10. API Data Convention

### Field Names

- API ใช้ **snake_case** ทั้งหมด: `site_title`, `full_name`, `sort_order`
- Frontend ใช้ **camelCase** สำหรับ local variables: `siteSettings`, `socialLinks`

### Composable Mapping

```
API field (snake_case)    → Composable computed (camelCase)
data.site_settings        → siteSettings
data.social_links         → socialLinks
data.nav_items            → navItems
```

### Sort Order

- Skills, Projects, Experiences, Social Links มี `sort_order` field
- Backend ควร sort ก่อนส่ง (เรียงจากน้อยไปมาก)
- Frontend **ไม่ได้** sort เอง — render ตามลำดับที่ API ส่งมา

### Icons

- Icon names มาจาก API (field `icon` ของ skills และ social_links)
- ใช้ Iconify format: `collection:name` เช่น `logos:vue`, `mdi:github`
- ดู icon ทั้งหมดที่ [Iconify Icon Sets](https://icon-sets.iconify.design/)

---

## 11. SSR vs Client-Side Patterns

Nuxt 3 default คือ **SSR** (Server-Side Rendering) — โค้ดใน `<script setup>` รันทั้งบน server และ client ต้องระวังเรื่อง browser APIs

### `import.meta.client` Guard

ใช้ห่อโค้ดที่ต้องรันฝั่ง browser เท่านั้น:

```ts
if (import.meta.client) {
  localStorage.setItem('key', 'value')
  document.documentElement.classList.add('some-class')
  window.addEventListener('scroll', handler)
}
```

**ใช้ที่:** `useTheme.ts` — ห่อ `localStorage`, `document.documentElement`, `watch` ที่ต้องการ DOM

**กฎ:** ถ้า composable หรือ component ใดเข้าถึง `localStorage`, `document`, `window`, `navigator` → ต้องห่อด้วย `import.meta.client` เสมอ

### `useFetch` vs `$fetch` — เมื่อไหร่ใช้อะไร

| | `useFetch` | `$fetch` |
| --- | ---------- | -------- |
| **ใช้เมื่อ** | ดึงข้อมูลแสดงผล (GET) | User action ที่ไม่ต้อง cache (POST, PUT, DELETE) |
| **SSR** | รันบน server แล้ว hydrate | รันฝั่ง client เท่านั้น (ใน event handler) |
| **Deduplication** | มี (ตาม `key`) | ไม่มี |
| **ตัวอย่าง** | `usePortfolioData.ts` → GET portfolio | `SectionContact.vue` → POST contact form |

```ts
// GET data สำหรับแสดงผล → useFetch (SSR-safe, cached)
const { data } = useFetch('/api/v1/portfolio', { key: 'portfolio-data' })

// POST จาก user action → $fetch (client-side, no caching needed)
await $fetch('/api/v1/contact', { method: 'POST', body: form })
```

### `withDefaults` + `defineProps`

ใช้ตั้ง default values ให้ props:

```ts
const props = withDefaults(defineProps<Props>(), {
  src: '/images/profile.jpg',
  alt: 'Profile picture',
  size: 'lg',
})
```

**ใช้ที่:** `ProfileAvatar.vue` — ตั้ง default src, alt, size

### Hardcoded Copy vs API Data

Section headings บางส่วน **hardcode ไว้ใน component** (ไม่ได้มาจาก API):

| ข้อความ | ที่มา | ไฟล์ |
| ------- | ----- | ---- |
| "About Me", "Skills & Tools", "Portfolio", "Career", "Contact" | **Hardcoded** ใน template | Section components |
| ชื่อเว็บ, greeting, bio, skills, projects, experiences | **API data** | ผ่าน `usePortfolioData()` |
| "Portfolio \| Full-Stack Developer" (fallback title) | **Hardcoded** ใน `pages/index.vue` | fallback เมื่อ API ไม่ตอบ |
| "Crafting digital experiences" (fallback tagline) | **Hardcoded** ใน `TheFooter.vue` | fallback เมื่อ API ไม่ตอบ |

ถ้าต้องการให้ข้อความเหล่านี้แก้ไขได้จาก Backend → ต้องเพิ่ม fields ใน API response

---

## 12. Do's and Don'ts

### Do's

| ทำ | เหตุผล |
| -- | ------ |
| ใช้ `usePortfolioData()` แทน fetch ตรง | deduplication, shared cache |
| ใส่ fallback ด้วย `??` เสมอ | ป้องกัน crash ตอน data ยังไม่โหลด |
| ใช้ Tailwind classes แทน inline style | consistency, tree-shaking |
| ใช้ `th-*` colors แทน hardcode สี | เปลี่ยนตาม theme อัตโนมัติ |
| ลบ event listener ใน `onUnmounted` | ป้องกัน memory leak |
| ใช้ `<Icon :name="..." />` สำหรับ icons | dynamic icon names จาก API |
| ใส่ `section-container` + `section-padding` | ให้ทุก section มี spacing เท่ากัน |
| ห่อ browser APIs ด้วย `import.meta.client` | ป้องกัน SSR error |
| ใช้ `useFetch` สำหรับ GET, `$fetch` สำหรับ POST | SSR-safe + ไม่ cache mutation |

### Don'ts

| ห้าม | เหตุผล |
| ---- | ------ |
| ห้ามใช้ `<style>` block (ยกเว้นจำเป็นจริงๆ) | ใช้ Tailwind แทน |
| ห้าม hardcode สี (เช่น `text-white`, `bg-gray-900`) | ไม่เปลี่ยนตาม theme |
| ห้าม fetch API ซ้ำใน component | ใช้ `usePortfolioData()` ที่ cache แล้ว |
| ห้ามใช้ Options API | ใช้ `<script setup>` เท่านั้น |
| ห้ามใช้ `console.log` ใน production code | ใช้ structured logging แทน |
| ห้ามใช้ `page.waitForTimeout` ใน test | ใช้ auto-waiting assertions แทน |

### ข้อยกเว้นที่ยอมรับได้

| Case | ไฟล์ | เหตุผล |
| ---- | ---- | ------ |
| `<style scoped>` ใน `ProfileAvatar.vue` | Keyframe animation `spin-slow` | Tailwind ไม่ support keyframe ที่ซับซ้อน |
| `text-white` ใน CTA buttons | `SectionHero.vue`, `SectionContact.vue` | ปุ่ม CTA ต้องเป็นสีขาวเสมอ (บน background สีเข้ม) |
| `text-green-500`, `text-red-400` | `SectionContact.vue` | สี success/error เป็น semantic ไม่ควรเปลี่ยนตาม theme |
