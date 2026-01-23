import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useTheme } from '@/hooks/use-theme'

export default function ThemeToggle() {
  const { toggleTheme, isDarkMode } = useTheme()
  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      className="border-2s m-2 rounded-md border-purple-300 p-2 hover:bg-purple-200 dark:hover:bg-purple-800"
    >
      {!isDarkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </Button>
  )
}
