<script setup lang="ts">
const { siteSettings } = usePortfolioData()

useHead({
  title: computed(() => siteSettings.value?.page_title ?? 'Portfolio | Full-Stack Developer'),
  meta: [
    {
      name: 'description',
      content: computed(() => siteSettings.value?.meta_description ?? 'Full-Stack Developer portfolio showcasing projects, skills, and experience.'),
    },
  ],
})
</script>

<template>
  <div>
    <SectionHero />
    <SectionAbout />
    <SectionSkills />
    <SectionProjects />
    <SectionExperience />
    <SectionContact />
  </div>
</template>
