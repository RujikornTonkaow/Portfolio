<script setup lang="ts">
const { about } = usePortfolioData()
</script>

<template>
  <section
    id="about"
    class="section-padding"
  >
    <div class="section-container">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p class="text-th-accent font-mono text-sm tracking-wider mb-3">
            About Me
          </p>
          <h2 class="text-3xl md:text-4xl font-bold text-th-fg mb-6">
            {{ about?.title ?? 'About Me' }}
          </h2>
          <div class="space-y-4 text-th-muted leading-relaxed">
            <p
              v-for="(paragraph, i) in about?.bio_paragraphs ?? []"
              :key="i"
            >
              {{ paragraph }}
            </p>
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <span
              v-for="tag in about?.personality_tags ?? []"
              :key="tag"
              class="px-4 py-2 text-sm font-medium text-th-accent-soft bg-primary-500/10 border border-primary-500/20 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="stat in about?.stats ?? []"
            :key="stat.label"
            class="glass-card p-6 text-center hover:border-primary-500/30 transition-colors duration-300"
          >
            <p class="text-3xl md:text-4xl font-bold gradient-text">
              {{ stat.value }}
            </p>
            <p class="text-sm text-th-muted mt-2">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
