import { useContext } from 'react'
import { UserButton } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { TrashIcon } from 'lucide-react'
import { DangerZone } from '@/components/features/account/DangerZone'
import { ThemeContext } from '@/contexts/ThemeContext'

export const AccountUserButton = () => {
  const theme = useContext(ThemeContext)
  const appearance = theme?.isDarkMode ? { baseTheme: dark } : undefined

  return (
    <UserButton appearance={appearance} userProfileProps={{ appearance }}>
      <UserButton.UserProfilePage
        label="Danger Zone"
        labelIcon={<TrashIcon className="h-4 w-4" />}
        url="danger-zone"
      >
        <DangerZone />
      </UserButton.UserProfilePage>
    </UserButton>
  )
}
