import { DeleteAccount } from './DeleteAccount'

export const DangerZone = () => (
  <div className="flex flex-col gap-6">
    <header>
      <h1 className="text-base font-bold tracking-tight">Danger Zone</h1>
      <p className="text-muted-foreground text-sm">
        Irreversible actions on your account.
      </p>
    </header>
    <DeleteAccount />
  </div>
)
