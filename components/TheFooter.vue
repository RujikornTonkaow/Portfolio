<script setup lang="ts">
const { socialLinks, siteSettings } = usePortfolioData()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-th-edge/5 bg-th-bg">
    <div class="section-container py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-center md:text-left">
          <a
            href="#hero"
            class="text-lg font-bold gradient-text"
          >
            {{ siteSettings?.site_title ?? 'Portfolio' }}
          </a>
          <p class="text-sm text-th-subtle mt-1">
            {{ siteSettings?.footer_tagline ?? 'Crafting digital experiences' }}
          </p>
        </div>

        <div class="flex items-center gap-4">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-th-subtle hover:text-th-accent transition-colors duration-200"
            :aria-label="link.name"
          >
            <Icon
              :name="link.icon"
              size="20"
            />
          </a>
        </div>

        <p class="text-sm text-th-faint">
          &copy; {{ currentYear }} All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
