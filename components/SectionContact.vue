<script setup lang="ts">
const { socialLinks } = usePortfolioData()
</script>

<template>
  <section
    id="contact"
    class="section-padding relative overflow-hidden"
  >
    <div class="absolute inset-0">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
    </div>

    <div class="section-container relative z-10">
      <div class="text-center mb-14">
        <p class="text-th-accent font-mono text-sm tracking-wider mb-3">
          Contact
        </p>
        <h2 class="text-3xl md:text-4xl font-bold text-th-fg">
          Let's work
          <span class="gradient-text">together</span>
        </h2>
        <p class="mt-4 text-th-muted max-w-lg mx-auto">
          Have a project in mind or want to discuss opportunities?
          I'd love to hear from you.
        </p>
      </div>

      <div class="max-w-xl mx-auto">
        <div class="glass-card p-8">
          <form
            class="space-y-5"
            @submit.prevent
          >
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-th-body mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  class="w-full px-4 py-3 bg-th-overlay/5 border border-th-edge/10 rounded-xl text-th-fg placeholder:text-th-faint focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-colors"
                >
              </div>
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-th-body mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  class="w-full px-4 py-3 bg-th-overlay/5 border border-th-edge/10 rounded-xl text-th-fg placeholder:text-th-faint focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-colors"
                >
              </div>
            </div>

            <div>
              <label
                for="subject"
                class="block text-sm font-medium text-th-body mb-2"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Project Discussion"
                class="w-full px-4 py-3 bg-th-overlay/5 border border-th-edge/10 rounded-xl text-th-fg placeholder:text-th-faint focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-colors"
              >
            </div>

            <div>
              <label
                for="message"
                class="block text-sm font-medium text-th-body mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                placeholder="Tell me about your project..."
                class="w-full px-4 py-3 bg-th-overlay/5 border border-th-edge/10 rounded-xl text-th-fg placeholder:text-th-faint focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              class="w-full px-8 py-3.5 bg-th-btn hover:bg-th-btn-hover text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-th-btn/25 hover:-translate-y-0.5"
            >
              Send Message
            </button>
          </form>
        </div>

        <div class="mt-10 flex items-center justify-center gap-6">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-th-muted hover:text-th-accent transition-colors duration-200"
            :aria-label="link.name"
          >
            <Icon
              :name="link.icon"
              size="20"
            />
            <span class="text-sm">{{ link.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
