<script setup lang="ts">
const { hero, socialLinks, siteSettings, getImageUrl } = usePortfolioData()
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float [animation-delay:3s]" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-950/20 via-th-bg to-th-bg" />
    </div>

    <div class="section-container relative z-10 text-center">
      <div class="mb-8 animate-fade-in flex justify-center">
        <ProfileAvatar
          :src="getImageUrl(siteSettings?.profile_image) ?? '/images/profile.jpg'"
          :alt="hero?.full_name ?? 'Profile'"
          size="xl"
        />
      </div>

      <div class="animate-fade-in">
        <p class="text-th-accent font-mono text-sm md:text-base mb-4 tracking-wider">
          {{ hero?.greeting ?? 'Hello' }}
        </p>
      </div>

      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-slide-up">
        <span class="gradient-text">{{ hero?.full_name ?? '' }}</span>
      </h1>

      <p class="mt-6 text-lg sm:text-xl md:text-2xl text-th-muted max-w-2xl mx-auto animate-slide-up [animation-delay:0.2s] opacity-0">
        {{ hero?.subtitle ?? '' }}
      </p>

      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:0.4s] opacity-0">
        <a
          :href="hero?.cta_primary_link ?? '#projects'"
          class="px-8 py-3.5 bg-th-btn hover:bg-th-btn-hover text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-th-btn/25 hover:-translate-y-0.5"
        >
          {{ hero?.cta_primary_text ?? 'View My Work' }}
        </a>
        <a
          :href="hero?.cta_secondary_link ?? '#contact'"
          class="px-8 py-3.5 bg-th-overlay/5 hover:bg-th-overlay/10 text-th-fg font-medium rounded-xl border border-th-edge/10 hover:border-th-edge/20 transition-all duration-200 hover:-translate-y-0.5"
        >
          {{ hero?.cta_secondary_text ?? 'Get in Touch' }}
        </a>
      </div>

      <div class="mt-12 flex items-center justify-center gap-5 animate-slide-up [animation-delay:0.6s] opacity-0">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2.5 text-th-subtle hover:text-th-accent transition-all duration-200 hover:-translate-y-1"
          :aria-label="link.name"
        >
          <Icon
            :name="link.icon"
            size="24"
          />
        </a>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <a
        href="#about"
        aria-label="Scroll to about section"
      >
        <Icon
          name="mdi:chevron-down"
          size="28"
          class="text-th-subtle"
        />
      </a>
    </div>
  </section>
</template>
