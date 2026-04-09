<script setup lang="ts">
const { socialLinks } = usePortfolioData()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-white/5 bg-surface-950">
    <div class="section-container py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-center md:text-left">
          <a
            href="#hero"
            class="text-lg font-bold gradient-text"
          >
            Portfolio
          </a>
          <p class="text-sm text-surface-500 mt-1">
            Crafting digital experiences
          </p>
        </div>

        <div class="flex items-center gap-4">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-surface-500 hover:text-primary-400 transition-colors duration-200"
            :aria-label="link.name"
          >
            <Icon
              :name="link.icon"
              size="20"
            />
          </a>
        </div>

        <p class="text-sm text-surface-600">
          &copy; {{ currentYear }} All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
