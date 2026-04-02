import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CardActions } from '../CardActions'
import { TooltipProvider } from '@/components/ui/tooltip'

const renderCardActions = (
  props: Partial<Parameters<typeof CardActions>[0]> = {},
) => {
  const defaultProps = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    showOnHover: false,
  } as const

  const merged = { ...defaultProps, ...props }

  return {
    ...render(
      <TooltipProvider>
        <CardActions {...merged} />
      </TooltipProvider>,
    ),
    onEdit: merged.onEdit,
    onDelete: merged.onDelete,
  }
}

describe('CardActions', () => {
  describe('edit button', () => {
    it('calls onEdit when clicked', async () => {
      const user = userEvent.setup()
      const { onEdit } = renderCardActions()

      await user.click(screen.getByRole('button', { name: /edit/i }))

      expect(onEdit).toHaveBeenCalledOnce()
    })

    it('shows Edit tooltip on hover', async () => {
      const user = userEvent.setup()
      renderCardActions()

      await user.hover(screen.getByRole('button', { name: /edit/i }))

      expect(
        await screen.findByRole('tooltip', { name: /edit/i }),
      ).toBeInTheDocument()
    })
  })

  describe('delete button', () => {
    it('calls onDelete when clicked', async () => {
      const user = userEvent.setup()
      const { onDelete } = renderCardActions()

      await user.click(screen.getByRole('button', { name: /delete/i }))

      expect(onDelete).toHaveBeenCalledOnce()
    })

    it('shows Delete tooltip on hover', async () => {
      const user = userEvent.setup()
      renderCardActions()

      await user.hover(screen.getByRole('button', { name: /delete/i }))

      expect(
        await screen.findByRole('tooltip', { name: /delete/i }),
      ).toBeInTheDocument()
    })
  })

  describe('delete disabled', () => {
    it('does not call onDelete when disabled', async () => {
      const user = userEvent.setup()
      const { onDelete } = renderCardActions({
        deleteDisabled: true,
        deleteDisabledReason: 'Has expenses',
      })

      await user.click(screen.getByRole('button', { name: /delete/i }))

      expect(onDelete).not.toHaveBeenCalled()
    })

    it('shows disabled reason in tooltip', async () => {
      const user = userEvent.setup()
      renderCardActions({
        deleteDisabled: true,
        deleteDisabledReason: 'Has expenses',
      })

      await user.hover(screen.getByRole('button', { name: /delete/i }))

      expect(
        await screen.findByRole('tooltip', { name: /has expenses/i }),
      ).toBeInTheDocument()
    })

    it('marks the button as aria-disabled', () => {
      renderCardActions({
        deleteDisabled: true,
        deleteDisabledReason: 'Has expenses',
      })

      expect(screen.getByRole('button', { name: /delete/i })).toHaveAttribute(
        'aria-disabled',
        'true',
      )
    })
  })

  describe('event propagation', () => {
    it('stops propagation when stopPropagation is true', async () => {
      const user = userEvent.setup()
      const parentClick = vi.fn()

      render(
        <TooltipProvider>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div onClick={parentClick}>
            <CardActions
              onEdit={vi.fn()}
              onDelete={vi.fn()}
              stopPropagation
              showOnHover={false}
            />
          </div>
        </TooltipProvider>,
      )

      await user.click(screen.getByRole('button', { name: /edit/i }))

      expect(parentClick).not.toHaveBeenCalled()
    })

    it('does not stop propagation by default', async () => {
      const user = userEvent.setup()
      const parentClick = vi.fn()

      render(
        <TooltipProvider>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div onClick={parentClick}>
            <CardActions
              onEdit={vi.fn()}
              onDelete={vi.fn()}
              showOnHover={false}
            />
          </div>
        </TooltipProvider>,
      )

      await user.click(screen.getByRole('button', { name: /edit/i }))

      expect(parentClick).toHaveBeenCalledOnce()
    })
  })

  describe('accessibility', () => {
    it('does not nest interactive elements (no button-in-button)', () => {
      renderCardActions()

      const buttons = screen.getAllByRole('button')

      buttons.forEach((button) => {
        const nestedButtons = button.querySelectorAll('button')
        expect(nestedButtons).toHaveLength(0)
      })
    })
  })
})
