<script setup lang="ts">
const { socialLinks } = usePortfolioData()
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float [animation-delay:3s]" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-950/20 via-surface-950 to-surface-950" />
    </div>

    <div class="section-container relative z-10 text-center">
      <div class="animate-fade-in">
        <p class="text-primary-400 font-mono text-sm md:text-base mb-4 tracking-wider">
          Hello, I'm
        </p>
      </div>

      <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight animate-slide-up">
        <span class="gradient-text">Your Name</span>
      </h1>

      <p class="mt-6 text-lg sm:text-xl md:text-2xl text-surface-400 max-w-2xl mx-auto animate-slide-up [animation-delay:0.2s] opacity-0">
        Full-Stack Developer crafting performant and elegant web experiences
      </p>

      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:0.4s] opacity-0">
        <a
          href="#projects"
          class="px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5"
        >
          View My Work
        </a>
        <a
          href="#contact"
          class="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5"
        >
          Get in Touch
        </a>
      </div>

      <div class="mt-12 flex items-center justify-center gap-5 animate-slide-up [animation-delay:0.6s] opacity-0">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2.5 text-surface-500 hover:text-primary-400 transition-all duration-200 hover:-translate-y-1"
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
          class="text-surface-500"
        />
      </a>
    </div>
  </section>
</template>
