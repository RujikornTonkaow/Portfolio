<script setup lang="ts">
const { siteSettings, pending, error, refresh, ready } = usePortfolioData()
await ready

useHead({
  title: computed(
    () => siteSettings.value?.page_title ?? 'Portfolio | Full-Stack Developer',
  ),
  meta: [
    {
      name: 'description',
      content: computed(
        () =>
          siteSettings.value?.meta_description ??
          'Full-Stack Developer portfolio showcasing projects, skills, and experience.',
      ),
    },
  ],
})
</script>

<template>
  <div>
    <div v-if="error" class="data-notice" role="alert">
      <span
        >Unable to load the portfolio right now. The content server may be
        unavailable.</span
      ><button :disabled="pending" @click="refresh()">
        {{ pending ? 'Retrying…' : 'Try again' }}
      </button>
    </div>
    <div v-else-if="pending" class="data-notice" role="status">
      Loading portfolio…
    </div>
    <SectionHero />
    <SectionAbout />
    <SectionProjects />
    <SectionSkills />
    <SectionExperience />
    <SectionContact />
  </div>
</template>
