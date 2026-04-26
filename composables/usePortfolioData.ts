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

  const { data, pending, error, refresh } = useAsyncData<PortfolioState>(
    `portfolio-data:${host}`,
    async () => {
      const siteResponse = await $fetch<ApiEnvelope<ManagedSite>>(
        `${apiBase}/api/v1/public/sites/by-domain`,
        {
          query: { host },
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
    },
    {
      default: () => ({ site: null, portfolio: null }),
    },
  )

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
    getImageUrl,
  }
}
