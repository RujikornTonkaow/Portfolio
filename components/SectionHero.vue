<script setup lang="ts">
const { hero, socialLinks, siteSettings, getImageUrl } = usePortfolioData()
</script>
<template>
  <section id="hero" class="hero-section">
    <div class="section-container">
      <div class="hero-topline">
        <span class="eyebrow"
          ><i class="status-dot" />
          {{ hero?.greeting || 'Hello, welcome to my space' }}</span
        ><span class="mono-label">DESIGN. DEVELOP. EXPLORE.</span>
      </div>
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow muted">A LITTLE CODE. A LOT OF POSSIBILITY.</p>
          <h1>
            {{ hero?.full_name || 'Creative developer.'
            }}<span class="accent">*</span>
          </h1>
          <p class="hero-description">{{ hero?.subtitle }}</p>
          <div class="hero-actions">
            <a
              :href="hero?.cta_primary_link || '#projects'"
              class="button-primary"
              >{{ hero?.cta_primary_text || 'Explore my work' }}
              <span aria-hidden="true">↗</span></a
            >
            <a
              :href="hero?.cta_secondary_link || '#contact'"
              class="button-text"
              >{{ hero?.cta_secondary_text || 'Let’s talk' }}
              <span aria-hidden="true">↗</span></a
            >
          </div>
          <div class="hero-person">
            <img
              :src="
                getImageUrl(siteSettings?.profile_image) ||
                '/images/profile.jpg'
              "
              :alt="hero?.full_name || 'Profile'"
              width="112"
              height="112"
            />
            <div class="hero-person-details">
              <a href="#about" class="hero-person-intro">A little about me <span aria-hidden="true">↗</span></a>
            <div class="hero-socials">
              <a
                v-for="link in socialLinks"
                :key="link.id"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="link.name"
                ><Icon :name="link.icon" size="19" /><span>{{
                  link.name
                }}</span></a
              >
            </div>
            </div>
          </div>
        </div>
        <div class="hero-art">
          <span class="art-coordinate">FIG. 01 / CREATIVE ENERGY</span>
          <ClientOnly
            ><LazyHeroSculpture /><template #fallback
              ><div class="sculpture-fallback" /></template
          ></ClientOnly>
          <div class="art-caption">
            <span class="crosshair">+</span
            ><span
              >Ideas in motion.<br /><span class="muted"
                >Built for the web.</span
              ></span
            ><span class="art-orbit" aria-hidden="true">↗</span>
          </div>
        </div>
      </div>
      <div class="hero-bottom">
        <a href="#projects"
          >SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a
        ><span>THOUGHTFULLY CRAFTED · ALWAYS EVOLVING</span>
      </div>
    </div>
  </section>
</template>
