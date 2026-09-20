<script setup lang="ts">
import type { SkillCategory } from '~/types/portfolio'
const { skills } = usePortfolioData()
const activeCategory = ref<SkillCategory | 'all'>('all')
const categories: { key: SkillCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All tools' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'devops', label: 'DevOps' },
  { key: 'tools', label: 'Tools' },
]
const filteredSkills = computed(() =>
  activeCategory.value === 'all'
    ? skills.value
    : skills.value.filter((skill) => skill.category === activeCategory.value),
)
</script>
<template>
  <section id="skills" class="section-padding skills-section">
    <div class="section-container">
      <div class="section-heading">
        <div>
          <p class="eyebrow section-index">03 / THE TOOLKIT</p>
          <h2>Good ideas.<br /><em>The right tools.</em></h2>
        </div>
        <p>The technologies behind the experience.</p>
      </div>
      <div class="filter-list" aria-label="Filter skills">
        <button
          v-for="cat in categories"
          :key="cat.key"
          :class="{ active: activeCategory === cat.key }"
          :aria-pressed="activeCategory === cat.key"
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
        </button>
      </div>
      <div class="skills-grid">
        <div v-for="skill in filteredSkills" :key="skill.id" class="skill-tile">
          <Icon :name="skill.icon" size="30" />
          <div>
            <strong>{{ skill.name }}</strong
            ><span>{{ skill.category }}</span>
          </div>
          <span class="skill-plus" aria-hidden="true">↗</span>
        </div>
      </div>
      <p v-if="!filteredSkills.length" class="empty-state">
        No tools in this category yet.
      </p>
    </div>
  </section>
</template>
