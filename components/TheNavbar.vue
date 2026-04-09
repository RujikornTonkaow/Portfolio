<script setup lang="ts">
const { navItems } = usePortfolioData()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled
      ? 'bg-surface-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10'
      : 'bg-transparent'"
  >
    <div class="section-container">
      <div class="flex items-center justify-between h-16 md:h-20">
        <a
          href="#hero"
          class="text-xl font-bold gradient-text tracking-tight"
        >
          Portfolio
        </a>

        <div class="hidden md:flex items-center gap-1">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            class="px-4 py-2 text-sm text-surface-400 hover:text-white rounded-lg transition-colors duration-200 hover:bg-white/5"
          >
            {{ item.label }}
          </a>
        </div>

        <button
          class="md:hidden p-2 text-surface-400 hover:text-white transition-colors"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon
            :name="isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'"
            size="24"
          />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-surface-900/95 backdrop-blur-xl border-b border-white/5"
      >
        <div class="section-container py-4 flex flex-col gap-1">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            class="px-4 py-3 text-surface-300 hover:text-white rounded-lg transition-colors hover:bg-white/5"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>
