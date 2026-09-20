<script setup lang="ts">
const { socialLinks, siteSettings } = usePortfolioData()
const currentYear = new Date().getFullYear()
</script>
<template>
  <footer class="site-footer">
    <div class="section-container">
      <div class="footer-top">
        <a class="brand" href="#hero"
          ><span class="brand-symbol" aria-hidden="true">✳</span
          >{{ siteSettings?.site_title || 'Portfolio' }}.</a
        >
        <p>
          {{ siteSettings?.footer_tagline || 'Crafting digital experiences' }}
        </p>
        <a class="back-top" href="#hero">Back to top ↑</a>
      </div>
      <div class="footer-bottom">
        <span>© {{ currentYear }} · All rights reserved.</span>
        <div>
          <a
            v-for="link in socialLinks"
            :key="link.id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            >{{ link.name }} ↗</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
