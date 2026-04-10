export type Theme = 'midnight' | 'sunshine'

let initialized = false

export const useTheme = () => {
  const theme = useState<Theme>('app-theme', () => 'midnight')

  const applyTheme = (t: Theme, animate = false) => {
    if (animate) {
      document.documentElement.classList.add('theme-transition')
    }
    document.documentElement.classList.remove('midnight', 'sunshine')
    document.documentElement.classList.add(t)
    if (animate) {
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition')
      }, 500)
    }
  }

  const setTheme = (newTheme: Theme, animate = false) => {
    theme.value = newTheme
    if (import.meta.client) {
      applyTheme(newTheme, animate)
      localStorage.setItem('portfolio-theme', newTheme)
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'midnight' ? 'sunshine' : 'midnight', true)
  }

  if (import.meta.client && !initialized) {
    initialized = true
    const saved = localStorage.getItem('portfolio-theme') as Theme | null
    if (saved) {
      theme.value = saved
    }
    applyTheme(theme.value)
  }

  return { theme: readonly(theme), toggleTheme, setTheme }
}
