import { ref } from 'vue'

const THEME_STORAGE_KEY = 'bugboard_theme'

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'dark') return true
  if (saved === 'light') return false
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = ref<boolean>(getInitialTheme())

function applyTheme(dark: boolean) {
  if (typeof document === 'undefined') return
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Apply initially
applyTheme(isDark.value)

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem(THEME_STORAGE_KEY, isDark.value ? 'dark' : 'light')
    applyTheme(isDark.value)
  }

  function setTheme(dark: boolean) {
    isDark.value = dark
    localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light')
    applyTheme(dark)
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
  }
}
