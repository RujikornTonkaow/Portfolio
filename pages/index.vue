<script setup lang="ts">
useHead({
  title: 'Portfolio | Full-Stack Developer',
  meta: [
    { name: 'description', content: 'Full-Stack Developer portfolio showcasing projects, skills, and experience.' },
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
