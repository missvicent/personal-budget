import { UserButton, useUser } from '@clerk/clerk-react'

export const UserButtonWithName = () => {
  const { user } = useUser()
  return (
    <div className="flex items-center justify-center gap-2 p-2">
      <UserButton />
      <div className="flex flex-col md:hidden">
        <span className="text-sidebar-item-text text-sm font-medium">
          {user?.fullName}
        </span>
        <span className="text-sidebar-item-text-muted text-xs">
          {user?.primaryEmailAddress?.emailAddress}
        </span>
      </div>
    </div>
  )
}
