import { z } from 'zod'

export const deleteAccountSchema = (expectedEmail: string) =>
  z.object({
    confirmEmail: z
      .string()
      .min(1, 'Type your email to confirm deletion')
      .refine(
        (value) => value.trim().toLowerCase() === expectedEmail.toLowerCase(),
        {
          message: 'Email does not match the account email',
        },
      ),
  })
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>
