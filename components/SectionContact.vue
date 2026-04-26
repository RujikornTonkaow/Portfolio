<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = String(config.public.apiBaseUrl).replace(/\/$/, '')
const { socialLinks, siteId, error: portfolioError } = usePortfolioData()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const submitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const canSubmit = computed(() => Boolean(siteId.value) && !portfolioError.value)

const handleSubmit = async () => {
  if (!siteId.value) {
    submitError.value = 'Portfolio site is not ready yet. Please refresh and try again.'
    return
  }

  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    await $fetch(`${apiBase}/api/v1/public/sites/${siteId.value}/portfolio/contacts`, {
      method: 'POST',
      body: { ...form },
    })
    submitSuccess.value = true
    Object.assign(form, { name: '', email: '', subject: '', message: '' })
  }
  catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } }
    submitError.value = fetchErr?.data?.error || 'Failed to send message. Please try again.'
  }
  finally {
    submitting.value = false
  }
}
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
          <div
            v-if="submitSuccess"
            class="text-center py-8"
          >
            <Icon
              name="mdi:check-circle"
              size="48"
              class="text-green-500 mx-auto mb-4"
            />
            <p class="text-th-fg font-medium text-lg">
              Message sent successfully!
            </p>
            <p class="text-th-muted text-sm mt-2">
              Thank you for reaching out. I'll get back to you soon.
            </p>
            <button
              class="mt-6 px-6 py-2 text-sm text-th-accent hover:text-th-fg transition-colors"
              @click="submitSuccess = false"
            >
              Send another message
            </button>
          </div>

          <form
            v-else
            class="space-y-5"
            @submit.prevent="handleSubmit"
          >
            <div
              v-if="submitError"
              class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              {{ submitError }}
            </div>

            <div
              v-else-if="portfolioError"
              class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              Unable to resolve this portfolio site. Please check the domain configuration.
            </div>

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
                  v-model="form.name"
                  type="text"
                  required
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
                  v-model="form.email"
                  type="email"
                  required
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
                v-model="form.subject"
                type="text"
                required
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
                v-model="form.message"
                rows="5"
                required
                placeholder="Tell me about your project..."
                class="w-full px-4 py-3 bg-th-overlay/5 border border-th-edge/10 rounded-xl text-th-fg placeholder:text-th-faint focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              :disabled="submitting || !canSubmit"
              class="w-full px-8 py-3.5 bg-th-btn hover:bg-th-btn-hover text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-th-btn/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span v-if="submitting">Sending...</span>
              <span v-else>Send Message</span>
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
