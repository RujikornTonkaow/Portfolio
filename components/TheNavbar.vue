<script setup lang="ts">
const { navItems, siteSettings } = usePortfolioData()
const isMobileMenuOpen = ref(false)
const activeSection = ref('hero')
let observer: IntersectionObserver | undefined
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) activeSection.value = entry.target.id
    },
    { rootMargin: '-15% 0px -60% 0px' },
  )
  document
    .querySelectorAll('main section[id]')
    .forEach((section) => observer?.observe(section))
})
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <header class="site-header" @keydown.esc="isMobileMenuOpen = false">
    <nav class="section-container nav-inner" aria-label="Main navigation">
      <a href="#hero" class="brand" @click="isMobileMenuOpen = false"
        ><span class="brand-symbol" aria-hidden="true">✳</span
        >{{ siteSettings?.site_title || 'Portfolio'
        }}<span class="brand-dot">.</span></a
      >
      <div class="desktop-nav">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          :class="{ 'nav-active': item.href === `#${activeSection}` }"
          :aria-current="
            item.href === `#${activeSection}` ? 'location' : undefined
          "
          >{{ item.label }}</a
        >
      </div>
      <div class="nav-controls">
        <ThemeToggle /><a class="nav-contact" href="#contact"
          >Let’s talk <span aria-hidden="true">↗</span></a
        ><button
          class="menu-toggle"
          aria-controls="mobile-navigation"
          :aria-expanded="isMobileMenuOpen"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon :name="isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'" size="24" />
        </button>
      </div>
    </nav>
    <div
      v-if="isMobileMenuOpen"
      id="mobile-navigation"
      class="mobile-navigation"
    >
      <a
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
        @click="isMobileMenuOpen = false"
        >{{ item.label }} <span aria-hidden="true">↗</span></a
      >
    </div>
  </header>
</template>
