<script setup lang="ts">
const { experiences } = usePortfolioData()
</script>
<template>
  <section id="experience" class="section-padding experience-section">
    <div class="section-container experience-grid">
      <div>
        <p class="eyebrow section-index">04 / THE JOURNEY</p>
        <h2>Learning.<br />Building.<br /><em>Evolving.</em></h2>
      </div>
      <div class="experience-list">
        <article
          v-for="(exp, index) in experiences"
          :key="exp.id"
          class="experience-row"
        >
          <div class="experience-top">
            <span class="mono-label">{{ exp.period }}</span
            ><span class="experience-number">{{
              (index + 1).toString().padStart(2, '0')
            }}</span>
          </div>
          <h3>{{ exp.role }}</h3>
          <p class="experience-company">{{ exp.company }}</p>
          <p class="experience-description">{{ exp.description }}</p>
          <ul>
            <li v-for="highlight in exp.highlights" :key="highlight">
              {{ highlight }}
            </li>
          </ul>
        </article>
        <p v-if="!experiences.length" class="empty-state">
          The next chapter is taking shape.
        </p>
      </div>
    </div>
  </section>
</template>
