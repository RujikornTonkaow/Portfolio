<script setup lang="ts">
const { experiences } = usePortfolioData()
</script>

<template>
  <section
    id="experience"
    class="section-padding bg-th-bg-alt"
  >
    <div class="section-container">
      <div class="text-center mb-14">
        <p class="text-th-accent font-mono text-sm tracking-wider mb-3">
          Career
        </p>
        <h2 class="text-3xl md:text-4xl font-bold text-th-fg">
          Work
          <span class="gradient-text">Experience</span>
        </h2>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="relative">
          <div class="absolute left-4 md:left-6 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-th-btn/50 via-th-btn/20 to-transparent" />

          <div
            v-for="(exp, index) in experiences"
            :key="exp.company"
            class="relative pl-12 md:pl-16 pb-12 last:pb-0"
          >
            <div
              class="absolute left-4 md:left-6 -translate-x-1/2 top-1 w-3 h-3 rounded-full border-2 border-th-btn bg-th-bg"
              :class="index === 0 ? 'bg-th-btn' : ''"
            />

            <div class="glass-card p-6 hover:border-th-btn/20 transition-colors duration-300">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <h3 class="text-lg font-semibold text-th-fg">
                    {{ exp.role }}
                  </h3>
                  <p class="text-th-accent text-sm font-medium">
                    {{ exp.company }}
                  </p>
                </div>
                <span class="text-xs font-mono text-th-subtle bg-th-overlay/5 px-3 py-1 rounded-full w-fit">
                  {{ exp.period }}
                </span>
              </div>

              <p class="text-th-muted text-sm mb-4">
                {{ exp.description }}
              </p>

              <ul class="space-y-2">
                <li
                  v-for="highlight in exp.highlights"
                  :key="highlight"
                  class="flex items-start gap-2 text-sm text-th-body"
                >
                  <Icon
                    name="mdi:check-circle"
                    size="16"
                    class="text-th-accent mt-0.5 flex-shrink-0"
                  />
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
