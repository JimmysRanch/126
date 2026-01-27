import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type AppearanceTheme = 'classic' | 'rose' | 'midnight'
export type AppearanceUi = 'classic' | 'compact' | 'focus' | 'showroom'

type AppearanceContextValue = {
  selectedTheme: AppearanceTheme
  selectedUi: AppearanceUi
  setSelectedTheme: (theme: AppearanceTheme) => void
  setSelectedUi: (ui: AppearanceUi) => void
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined)

export const appearanceThemes: AppearanceTheme[] = ['classic', 'rose', 'midnight']
export const appearanceUis: AppearanceUi[] = ['classic', 'compact', 'focus', 'showroom']

const THEME_STORAGE_KEY = 'spark.appearance.theme'
const UI_STORAGE_KEY = 'spark.appearance.ui'

const readStoredValue = <T extends string>(key: string, allowedValues: T[], fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const storedValue = window.localStorage.getItem(key) as T | null
    if (storedValue && allowedValues.includes(storedValue)) {
      return storedValue
    }
  } catch {
    return fallback
  }

  return fallback
}

const persistStoredValue = (key: string, value: string) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (value === 'classic') {
      window.localStorage.removeItem(key)
    } else {
      window.localStorage.setItem(key, value)
    }
  } catch {
    return
  }
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [selectedTheme, setSelectedThemeState] = useState<AppearanceTheme>(() =>
    readStoredValue(THEME_STORAGE_KEY, appearanceThemes, 'classic')
  )
  const [selectedUi, setSelectedUiState] = useState<AppearanceUi>(() =>
    readStoredValue(UI_STORAGE_KEY, appearanceUis, 'classic')
  )

  const setSelectedTheme = useCallback((theme: AppearanceTheme) => {
    setSelectedThemeState(theme)
    persistStoredValue(THEME_STORAGE_KEY, theme)
  }, [])

  const setSelectedUi = useCallback((ui: AppearanceUi) => {
    setSelectedUiState(ui)
    persistStoredValue(UI_STORAGE_KEY, ui)
  }, [])

  const value = useMemo(
    () => ({
      selectedTheme,
      selectedUi,
      setSelectedTheme,
      setSelectedUi
    }),
    [selectedTheme, selectedUi, setSelectedTheme, setSelectedUi]
  )

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}

export function useAppearance() {
  const context = useContext(AppearanceContext)

  if (!context) {
    throw new Error('useAppearance must be used within an AppearanceProvider')
  }

  return context
}
