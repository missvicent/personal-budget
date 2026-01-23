import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'

export default function ThemeToggle() {
  const { toggleTheme, isDarkMode } = useTheme()
  return (
    <button onClick={toggleTheme} className="rounded-md p-2 hover:bg-gray-100">
      {isDarkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  )
}
