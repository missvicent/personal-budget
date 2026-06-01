import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NoAllocationsHint } from '../no-allocations-hint'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    params,
  }: {
    children: React.ReactNode
    to: string
    params: Record<string, string>
  }) => <a href={`${to.replace('$budgetId', params.budgetId)}`}>{children}</a>,
}))

describe('NoAllocationsHint', () => {
  it('shows the explanation copy', () => {
    render(<NoAllocationsHint budgetId="b-1" />)
    expect(
      screen.getByText(/need an allocation before you can log expenses/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/which category to count toward/i),
    ).toBeInTheDocument()
  })

  it('CTA links to allocations route with the correct budgetId', () => {
    render(<NoAllocationsHint budgetId="b-77" />)
    const cta = screen.getByRole('link', { name: /set up allocations/i })
    expect(cta).toHaveAttribute('href', '/budget/b-77/allocations')
  })
})
