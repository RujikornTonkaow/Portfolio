import type { PortfolioData } from '~/types/portfolio'

export const usePortfolioData = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBaseUrl

  const { data, pending, error } = useFetch<{ data: PortfolioData }>(
    `${apiBase}/api/v1/portfolio`,
    {
      key: 'portfolio-data',
      default: () => ({ data: null as unknown as PortfolioData }),
    },
  )

  const portfolio = computed(() => data.value?.data ?? null)

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
    getImageUrl,
  }
}
