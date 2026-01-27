import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type AppearanceTheme = 'classic' | 'rose' | 'midnight'
export type AppearanceUi = 'classic' | 'compact' | 'focus'

type AppearanceContextValue = {
  selectedTheme: AppearanceTheme
  selectedUi: AppearanceUi
  setSelectedTheme: (theme: AppearanceTheme) => void
  setSelectedUi: (ui: AppearanceUi) => void
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined)

export const appearanceThemes: AppearanceTheme[] = ['classic', 'rose', 'midnight']
export const appearanceUis: AppearanceUi[] = ['classic', 'compact', 'focus']

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [selectedTheme, setSelectedTheme] = useState<AppearanceTheme>('classic')
  const [selectedUi, setSelectedUi] = useState<AppearanceUi>('classic')

  const value = useMemo(
    () => ({
      selectedTheme,
      selectedUi,
      setSelectedTheme,
      setSelectedUi
    }),
    [selectedTheme, selectedUi]
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
