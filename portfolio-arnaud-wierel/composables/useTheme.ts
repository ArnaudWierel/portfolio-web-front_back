import { useState } from '#app'

const STORAGE_KEY = 'aw-theme-preference'

const isClient = () => typeof window !== 'undefined'

export const useTheme = () => {
  const isDark = useState('theme:isDark', () => true)

  const applyTheme = () => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
  }

  const hydrateTheme = () => {
    if (!isClient()) return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      isDark.value = stored !== 'light'
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      isDark.value = false
    }
    applyTheme()
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isClient()) {
      window.localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    }
    applyTheme()
  }

  return {
    isDark,
    toggleTheme,
    hydrateTheme
  }
}

