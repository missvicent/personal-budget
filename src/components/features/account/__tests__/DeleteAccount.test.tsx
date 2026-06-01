import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteAccount } from '../DeleteAccount'

const { mutateMock, hookState } = vi.hoisted(() => ({
  mutateMock: vi.fn(),
  hookState: { isPending: false },
}))

vi.mock('@/hooks/user/use-delete-account', () => ({
  useDeleteAccount: () => ({
    mutateAsync: mutateMock,
    isPending: hookState.isPending,
  }),
}))
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    user: {
      primaryEmailAddress: { emailAddress: 'test@test.com' },
    },
  }),
}))

describe('DeleteAccount', () => {
  beforeEach(() => {
    mutateMock.mockReset()
    hookState.isPending = false
  })

  it('renders collapsed by default with a Delete Account button', () => {
    render(<DeleteAccount />)
    expect(
      screen.getByRole('button', { name: /delete account/i }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('expands when the Delete Account button is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteAccount />)
    await user.click(screen.getByRole('button', { name: /delete account/i }))

    const input = screen.getByPlaceholderText('test@test.com')
    expect(input).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Permanently delete account/i }),
    ).toBeDisabled()
  })

  it('enables the Delete Account button when the textbox is filled and the email matches', async () => {
    const user = userEvent.setup()
    render(<DeleteAccount />)
    await user.click(screen.getByRole('button', { name: /delete account/i }))
    const input = screen.getByPlaceholderText('test@test.com')
    await user.type(input, 'wrong@test.com')
    expect(
      screen.getByRole('button', { name: /permanently delete account/i }),
    ).toBeDisabled()

    await user.clear(input)
    await user.type(input, 'test@test.com')
    expect(
      screen.getByRole('button', { name: /permanently delete account/i }),
    ).toBeEnabled()
  })

  it('calls the mutation when the Delete Account button is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteAccount />)
    await user.click(screen.getByRole('button', { name: /delete account/i }))
    await user.type(
      screen.getByPlaceholderText('test@test.com'),
      'test@test.com',
    )
    await user.click(
      screen.getByRole('button', { name: /permanently delete account/i }),
    )
    expect(mutateMock).toHaveBeenCalled
  })

  it('cancel collapses the panel and clears the typed email', async () => {
    const user = userEvent.setup()
    render(<DeleteAccount />)
    await user.click(screen.getByRole('button', { name: /delete account/i }))
    await user.type(
      screen.getByPlaceholderText('test@test.com'),
      'test@test.com',
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /delete account/i }))
    expect(screen.getByPlaceholderText('test@test.com')).toHaveValue('')
  })

  it('does not collapse when Cancel is clicked while the mutation is pending', async () => {
    hookState.isPending = true
    const user = userEvent.setup()
    render(<DeleteAccount />)
    await user.click(screen.getByRole('button', { name: /delete account/i }))

    const cancel = screen.getByRole('button', { name: /cancel/i })
    expect(cancel).toBeDisabled()

    await user.click(cancel)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('keeps the panel open and surfaces an error when the mutation rejects', async () => {
    mutateMock.mockRejectedValueOnce(new Error('boom'))
    const user = userEvent.setup()
    render(<DeleteAccount />)
    await user.click(screen.getByRole('button', { name: /delete account/i }))
    await user.type(
      screen.getByPlaceholderText('test@test.com'),
      'test@test.com',
    )
    await user.click(
      screen.getByRole('button', { name: /permanently delete account/i }),
    )

    expect(mutateMock).toHaveBeenCalled()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
