import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useTheme } from '@/hooks/ui/use-theme'

export default function ThemeToggle() {
  const { toggleTheme, isDarkMode } = useTheme()
  return (
    <div className="flex items-center justify-center border-t">
      <Button
        onClick={toggleTheme}
        variant="ghost"
        className="hover:bg-sidebar-item-active-bg m-2 rounded-md border-purple-300 p-2"
      >
        {!isDarkMode ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </Button>
    </div>
  )
}
