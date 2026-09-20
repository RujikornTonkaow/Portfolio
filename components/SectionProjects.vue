<script setup lang="ts">
const { projects, getImageUrl } = usePortfolioData()
const activeTag = ref('All')
const tags = computed(() => [
  'All',
  ...new Set(projects.value.flatMap((project) => project.tags)),
])
const filteredProjects = computed(() =>
  activeTag.value === 'All'
    ? projects.value
    : projects.value.filter((project) =>
        project.tags.includes(activeTag.value),
      ),
)
watch(tags, (value) => {
  if (!value.includes(activeTag.value)) activeTag.value = 'All'
})
const brokenImages = reactive(new Set<string>())
</script>
<template>
  <section id="projects" class="section-padding projects-section">
    <div class="section-container">
      <div class="section-heading">
        <div>
          <p class="eyebrow section-index">02 / SELECTED WORK</p>
          <h2>Ideas, made <em>real.</em></h2>
        </div>
        <p>
          A selection of things I’ve built.<br />From the first idea to the
          final detail.
        </p>
      </div>
      <div
        v-if="projects.length"
        class="filter-list"
        aria-label="Filter projects"
      >
        <button
          v-for="tag in tags"
          :key="tag"
          :class="{ active: activeTag === tag }"
          :aria-pressed="activeTag === tag"
          @click="activeTag = tag"
        >
          {{ tag
          }}<span v-if="tag === 'All'">{{
            projects.length.toString().padStart(2, '0')
          }}</span>
        </button>
      </div>
      <div class="projects-grid">
        <article
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-visual" :class="`project-color-${index % 3}`">
            <img
              v-if="project.image && !brokenImages.has(project.image)"
              :src="getImageUrl(project.image)!"
              :alt="project.title"
              loading="lazy"
              @error="brokenImages.add(project.image!)"
            />
            <div v-else class="project-placeholder" aria-hidden="true">
              <span>{{ project.title.slice(0, 1) }}</span>
              <div class="placeholder-orbit" />
            </div>
            <span class="project-number"
              >{{ (index + 1).toString().padStart(2, '0') }} / PROJECT</span
            >
          </div>
          <div class="project-meta">
            <div class="tag-list">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-links">
              <a
                v-if="project.live_url"
                :href="project.live_url"
                target="_blank"
                rel="noopener noreferrer"
                >View project <span aria-hidden="true">↗</span></a
              ><a
                v-if="project.source_url"
                :href="project.source_url"
                target="_blank"
                rel="noopener noreferrer"
                ><Icon name="mdi:github" size="17" /> Source code</a
              >
            </div>
          </div>
        </article>
      </div>
      <p v-if="!projects.length" class="empty-state">
        New work is on the way. Check back soon.
      </p>
    </div>
  </section>
</template>
