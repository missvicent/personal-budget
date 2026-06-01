import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const DeleteAccount = () => {
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? ''

  return (
    <section className="border-t pt-6">
      <h2 className="text-sm font-medium">Delete account</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        {open ? (
          <>
            This will delete your account, budgets, transactions, debts, and
            goals permanently. Type <span className="font-bold">{email}</span>{' '}
            to confirm.
          </>
        ) : (
          'Permanently delete your account and all data. This cannot be undone.'
        )}
      </p>

      {open ? (
        <div className="mt-4 flex flex-col gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            autoComplete="off"
            className="rounded-md"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Permanently delete
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="destructive"
          className="mt-4"
          onClick={() => setOpen(true)}
        >
          Delete account
        </Button>
      )}
    </section>
  )
}
