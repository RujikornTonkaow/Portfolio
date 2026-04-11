export type Theme = 'midnight' | 'sunshine'

const STORAGE_KEY = 'portfolio-theme'
const STORAGE_VERSION_KEY = 'portfolio-theme-api-version'

export const useTheme = () => {
  const { siteSettings } = usePortfolioData()

  const apiDefault = computed<Theme>(() => siteSettings.value?.default_theme ?? 'midnight')
  const apiVersion = computed(() => siteSettings.value?.updated_at ?? '')

  const theme = useState<Theme>('app-theme', () => apiDefault.value)

  useHead({
    htmlAttrs: {
      class: computed(() => theme.value),
    },
  })

  const toggleTheme = () => {
    const newTheme: Theme = theme.value === 'midnight' ? 'sunshine' : 'midnight'

    if (import.meta.client) {
      document.documentElement.classList.add('theme-transition')
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition')
      }, 500)
      localStorage.setItem(STORAGE_KEY, newTheme)
    }

    theme.value = newTheme
  }

  if (import.meta.client) {
    const resolveTheme = () => {
      const version = apiVersion.value
      if (!version) return

      const savedVersion = localStorage.getItem(STORAGE_VERSION_KEY)
      const userPref = localStorage.getItem(STORAGE_KEY) as Theme | null

      if (savedVersion !== version) {
        localStorage.setItem(STORAGE_VERSION_KEY, version)
        localStorage.removeItem(STORAGE_KEY)
        theme.value = apiDefault.value
      } else if (userPref) {
        theme.value = userPref
      }
    }

    resolveTheme()

    watch(apiVersion, (newVersion) => {
      if (newVersion) resolveTheme()
    })
  }

  return { theme: readonly(theme), toggleTheme }
}
