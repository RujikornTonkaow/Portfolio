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
  if (submitting.value) return
  if (!siteId.value) {
    submitError.value =
      'Portfolio site is not ready yet. Please refresh and try again.'
    return
  }

  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    await $fetch(
      `${apiBase}/api/v1/public/sites/${siteId.value}/portfolio/contacts`,
      {
        method: 'POST',
        body: { ...form },
      },
    )
    submitSuccess.value = true
    Object.assign(form, { name: '', email: '', subject: '', message: '' })
  } catch (err: unknown) {
    const fetchErr = err as { data?: { error?: string } }
    submitError.value =
      fetchErr?.data?.error || 'Failed to send message. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section id="contact" class="section-padding contact-section">
    <div class="section-container contact-grid">
      <div class="contact-copy">
        <p class="eyebrow section-index">05 / WHAT’S NEXT?</p>
        <h2>
          Let’s make<br /><em>something great.</em><span class="accent">↗</span>
        </h2>
        <p>
          Have an idea, a challenge, or just want to say hello? I’d love to hear
          from you.
        </p>
        <div class="contact-socials">
          <a
            v-for="link in socialLinks"
            :key="link.id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            ><Icon :name="link.icon" size="18" />{{ link.name }} ↗</a
          >
        </div>
      </div>
      <div aria-live="polite">
        <div v-if="submitSuccess" class="form-success" role="status">
          <Icon name="mdi:check-circle-outline" size="36" class="accent" />
          <h3>Message received.</h3>
          <p>Thank you for reaching out. I’ll get back to you soon.</p>
          <button class="button-text" @click="submitSuccess = false">
            Send another message ↗
          </button>
        </div>
        <form v-else class="contact-form" @submit.prevent="handleSubmit">
          <p v-if="submitError" class="form-notice" role="alert">
            {{ submitError }}
          </p>
          <p v-else-if="portfolioError" class="form-notice">
            Contact is temporarily unavailable. Please try again later.
          </p>
          <div class="form-pair">
            <div>
              <label for="name">Your name</label
              ><input
                id="name"
                v-model="form.name"
                name="name"
                autocomplete="name"
                required
                placeholder="What should I call you?"
              />
            </div>
            <div>
              <label for="email">Email address</label
              ><input
                id="email"
                v-model="form.email"
                name="email"
                autocomplete="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label for="subject">What’s on your mind?</label
            ><input
              id="subject"
              v-model="form.subject"
              name="subject"
              required
              placeholder="A project, an opportunity, a hello..."
            />
          </div>
          <div>
            <label for="message">Your message</label
            ><textarea
              id="message"
              v-model="form.message"
              name="message"
              rows="4"
              required
              placeholder="Tell me a little about it..."
            />
          </div>
          <button
            type="submit"
            class="button-primary"
            :disabled="submitting || !canSubmit"
          >
            <span style="font-size: 13px">{{
              submitting ? 'Sending your message…' : 'Send message'
            }}</span
            ><span aria-hidden="true">↗</span>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
