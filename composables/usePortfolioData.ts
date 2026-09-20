import type { ApiEnvelope, ManagedSite, PortfolioData } from '~/types/portfolio'

interface PortfolioState {
  site: ManagedSite | null
  portfolio: PortfolioData | null
}

export const usePortfolioData = () => {
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBaseUrl).replace(/\/$/, '')
  const requestURL = useRequestURL()
  const host = requestURL.host
  const initialized = useState(`portfolio-initialized:${host}`, () => false)

  const ready = useAsyncData<PortfolioState>(
    `portfolio-data:${host}`,
    async () => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      try {
        const siteResponse = await $fetch<ApiEnvelope<ManagedSite>>(
          `${apiBase}/api/v1/public/sites/by-domain`,
          {
            query: { host },
            signal: controller.signal,
            retry: 0,
          },
        )

        if (!siteResponse.data?.id) {
          throw createError({
            statusCode: 404,
            statusMessage: `No portfolio site found for ${host}`,
          })
        }

        const portfolioResponse = await $fetch<ApiEnvelope<PortfolioData>>(
          `${apiBase}/api/v1/public/sites/${siteResponse.data.id}/portfolio`,
          { signal: controller.signal, retry: 0 },
        )

        if (!portfolioResponse.data) {
          throw createError({
            statusCode: 502,
            statusMessage: 'Portfolio API returned an empty response',
          })
        }

        return {
          site: siteResponse.data,
          portfolio: portfolioResponse.data,
        }
      } finally {
        clearTimeout(timeout)
        initialized.value = true
      }
    },
    {
      // Later section mounts must not restart a failed initial request.
      immediate: !initialized.value,
      dedupe: 'defer',
      default: () => ({ site: null, portfolio: null }),
    },
  )

  const { data, pending, error, refresh } = ready
  const site = computed(() => data.value?.site ?? null)
  const siteId = computed(() => site.value?.id ?? null)
  const portfolio = computed(() => data.value?.portfolio ?? null)

  const siteSettings = computed(() => portfolio.value?.site_settings ?? null)
  const hero = computed(() => portfolio.value?.hero ?? null)
  const about = computed(() => portfolio.value?.about ?? null)
  const skills = computed(() => portfolio.value?.skills ?? [])
  const projects = computed(() => portfolio.value?.projects ?? [])
  const experiences = computed(() => portfolio.value?.experiences ?? [])
  const socialLinks = computed(() => portfolio.value?.social_links ?? [])
  const navItems = computed(() => portfolio.value?.nav_items ?? [])

  const getImageUrl = (path?: string) => {
    if (!path) return null
    if (path.startsWith('http') || path.startsWith('blob:')) return path
    return `${apiBase}${path}`
  }

  return {
    site,
    siteId,
    portfolio,
    siteSettings,
    hero,
    about,
    skills,
    projects,
    experiences,
    socialLinks,
    navItems,
    pending,
    error,
    refresh,
    ready,
    getImageUrl,
  }
}
