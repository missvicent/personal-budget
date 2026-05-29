import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const DangerZoneCard = () => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const { user } = useUser()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 pb-2">
        <h1 className="text-base font-bold tracking-tight">Danger Zone</h1>
        <p className="text-muted-foreground text-sm">
          This action is irreversible and will permanently delete your account
          and all your data.
        </p>
      </div>
      <div className="flex flex-col gap-2 border-t pt-4">
        <Card className="border-destructive/70 box-shadow-none w-full lg:w-3/4">
          <CardHeader>
            <CardTitle className="text-destructive text-base font-bold tracking-tight">
              Delete Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground pb-2 text-sm">
                This will delete your account, budgets, transactions, debts, and
                goals permanently. Type{' '}
                <span className="font-bold">
                  {user?.emailAddresses[0].emailAddress}
                </span>{' '}
                to confirm
              </p>
              {open ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex w-full flex-row justify-between gap-2">
                    <Button
                      variant="destructive"
                      size="lg"
                      className="w-full rounded-full"
                      onClick={() => setOpen(false)}
                    >
                      Permanently Delete Account
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full rounded-full"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-2">
                  <Button
                    variant="destructive"
                    size="lg"
                    className="w-full rounded-full"
                    onClick={() => setOpen(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
