<script setup lang="ts">
import type { SkillCategory } from '~/types/portfolio'

const { skills } = usePortfolioData()

const activeCategory = ref<SkillCategory | 'all'>('all')

const categories: { key: SkillCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'devops', label: 'DevOps' },
  { key: 'tools', label: 'Tools' },
]

const filteredSkills = computed(() => {
  if (activeCategory.value === 'all') return skills
  return skills.filter(skill => skill.category === activeCategory.value)
})
</script>

<template>
  <section
    id="skills"
    class="section-padding bg-surface-900/30"
  >
    <div class="section-container">
      <div class="text-center mb-14">
        <p class="text-primary-400 font-mono text-sm tracking-wider mb-3">
          Skills & Tools
        </p>
        <h2 class="text-3xl md:text-4xl font-bold text-white">
          Technologies I
          <span class="gradient-text">work with</span>
        </h2>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="px-5 py-2 text-sm font-medium rounded-full transition-all duration-200"
          :class="activeCategory === cat.key
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
            : 'bg-white/5 text-surface-400 hover:text-white hover:bg-white/10 border border-white/5'"
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="skill in filteredSkills"
          :key="skill.name"
          class="glass-card p-5 flex flex-col items-center gap-3 hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300 group"
        >
          <Icon
            :name="skill.icon"
            size="36"
            class="group-hover:scale-110 transition-transform duration-300"
          />
          <span class="text-sm text-surface-300 font-medium">
            {{ skill.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
