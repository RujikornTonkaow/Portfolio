<script setup lang="ts">
const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '30+', label: 'Projects Completed' },
  { value: '15+', label: 'Happy Clients' },
  { value: '99%', label: 'Client Satisfaction' },
]
</script>

<template>
  <section
    id="about"
    class="section-padding"
  >
    <div class="section-container">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p class="text-th-accent font-mono text-sm tracking-wider mb-3">
            About Me
          </p>
          <h2 class="text-3xl md:text-4xl font-bold text-th-fg mb-6">
            Passionate about building
            <span class="gradient-text">great software</span>
          </h2>
          <div class="space-y-4 text-th-muted leading-relaxed">
            <p>
              I'm a full-stack developer with a passion for creating elegant, performant,
              and user-friendly web applications. With expertise spanning from modern frontend
              frameworks to scalable backend systems, I bring ideas to life through clean code
              and thoughtful architecture.
            </p>
            <p>
              My approach combines technical excellence with a keen eye for design,
              ensuring every project not only functions flawlessly but also delivers
              an exceptional user experience. I believe in writing code that is maintainable,
              tested, and built to scale.
            </p>
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <span class="px-4 py-2 text-sm font-medium text-th-accent-soft bg-primary-500/10 border border-primary-500/20 rounded-full">
              Problem Solver
            </span>
            <span class="px-4 py-2 text-sm font-medium text-th-accent-cyan bg-cyan-500/10 border border-cyan-500/20 rounded-full">
              Team Player
            </span>
            <span class="px-4 py-2 text-sm font-medium text-th-accent-violet bg-violet-500/10 border border-violet-500/20 rounded-full">
              Continuous Learner
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="glass-card p-6 text-center hover:border-primary-500/30 transition-colors duration-300"
          >
            <p class="text-3xl md:text-4xl font-bold gradient-text">
              {{ stat.value }}
            </p>
            <p class="text-sm text-th-muted mt-2">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
