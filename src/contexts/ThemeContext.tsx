import { createContext, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import {
  useUpdateUserSetting,
  useUserSetting,
} from '@/hooks/user/use-user-setting'

interface ThemeContextValue {
  isDarkMode: boolean
  isLoading: boolean
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const { data: UserSettings } = useUserSetting(!!auth.isSignedIn)
  const { mutate: updateUserSetting } = useUpdateUserSetting()

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      UserSettings?.dark_mode || false,
    )
  }, [UserSettings?.dark_mode])

  const toggleTheme = () => {
    updateUserSetting({ dark_mode: !UserSettings?.dark_mode || false })
  }

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode: UserSettings?.dark_mode || false,
        isLoading: false,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
