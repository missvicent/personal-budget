import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@clerk/clerk-react'
import type { DeleteAccountSchema } from '@/lib/schemas/account/delete-account.schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { deleteAccountSchema } from '@/lib/schemas/account/delete-account.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDeleteAccount } from '@/hooks/user/use-delete-account'

export const DeleteAccount = () => {
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? ''
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount()

  const form = useForm<DeleteAccountSchema>({
    resolver: zodResolver(deleteAccountSchema(email)),
    defaultValues: {
      confirmEmail: '',
    },
    mode: 'onChange',
  })

  const handleCancel = () => {
    if (isPending) return
    form.reset()
    setOpen(false)
  }

  const handleSubmit = async () => {
    try {
      await deleteAccount()
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="confirmEmail"
              render={({ field }) => (
                <FormItem className="py-3">
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      className="rounded-md"
                      placeholder={email}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!form.formState.isValid}
              >
                {isPending ? 'Deleting...' : 'Permanently delete account'}
              </Button>
            </div>
          </form>
        </Form>
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
