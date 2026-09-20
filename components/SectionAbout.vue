<script setup lang="ts">
const { about } = usePortfolioData()
</script>
<template>
  <section id="about" class="section-padding about-section">
    <div class="section-container about-grid">
      <div>
        <p class="eyebrow section-index">01 / THE PERSON BEHIND THE PIXELS</p>
        <h2>{{ about?.title || 'Curiosity meets craft.' }}</h2>
        <div class="tag-list">
          <span v-for="tag in about?.personality_tags || []" :key="tag">{{
            tag
          }}</span>
        </div>
      </div>
      <div>
        <div class="about-bio">
          <p
            v-for="(paragraph, index) in about?.bio_paragraphs || []"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
        <div class="stats-grid">
          <div v-for="(stat, index) in about?.stats || []" :key="index">
            <strong>{{ stat.value }}</strong
            ><span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
