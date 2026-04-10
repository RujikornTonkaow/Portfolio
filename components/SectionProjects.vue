<script setup lang="ts">
const { projects } = usePortfolioData()
</script>

<template>
  <section
    id="projects"
    class="section-padding"
  >
    <div class="section-container">
      <div class="text-center mb-14">
        <p class="text-th-accent font-mono text-sm tracking-wider mb-3">
          Portfolio
        </p>
        <h2 class="text-3xl md:text-4xl font-bold text-th-fg">
          Featured
          <span class="gradient-text">Projects</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <article
          v-for="project in projects"
          :key="project.title"
          class="glass-card overflow-hidden group hover:border-primary-500/20 transition-all duration-300"
        >
          <div class="h-48 bg-gradient-to-br from-primary-500/20 via-th-bg-el to-cyan-500/20 flex items-center justify-center">
            <Icon
              name="mdi:code-braces"
              size="48"
              class="text-th-faint group-hover:text-th-accent group-hover:scale-110 transition-all duration-300"
            />
          </div>

          <div class="p-6">
            <h3 class="text-xl font-semibold text-th-fg mb-2 group-hover:text-th-accent-soft transition-colors">
              {{ project.title }}
            </h3>
            <p class="text-th-muted text-sm leading-relaxed mb-4">
              {{ project.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-5">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="px-2.5 py-1 text-xs font-medium text-th-accent-soft bg-primary-500/10 rounded-md"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex items-center gap-4">
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 text-sm text-th-muted hover:text-th-accent transition-colors"
              >
                <Icon
                  name="mdi:open-in-new"
                  size="16"
                />
                Live Demo
              </a>
              <a
                v-if="project.sourceUrl"
                :href="project.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 text-sm text-th-muted hover:text-th-accent transition-colors"
              >
                <Icon
                  name="mdi:github"
                  size="16"
                />
                Source Code
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
