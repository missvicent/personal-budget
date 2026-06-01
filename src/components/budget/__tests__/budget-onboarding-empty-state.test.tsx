import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BudgetOnboardingEmptyState } from '../budget-onboarding-empty-state'

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

describe('BudgetOnboardingEmptyState', () => {
  it('shows the welcome headline and framing sentence', () => {
    render(<BudgetOnboardingEmptyState budgetId="b-1" />)
    expect(screen.getByText(/your budget is ready/i)).toBeInTheDocument()
    expect(screen.getByText(/three quick steps/i)).toBeInTheDocument()
  })

  it('renders the stepper at step 2', () => {
    render(<BudgetOnboardingEmptyState budgetId="b-1" />)
    const list = screen.getByRole('list', { name: /onboarding steps/i })
    const items = list.querySelectorAll('li')
    expect(items[0]).toHaveAttribute('data-status', 'complete')
    expect(items[1]).toHaveAttribute('data-status', 'current')
    expect(items[2]).toHaveAttribute('data-status', 'upcoming')
  })

  it('CTA links to the allocations route with the correct budgetId', () => {
    render(<BudgetOnboardingEmptyState budgetId="b-42" />)
    const cta = screen.getByRole('link', { name: /add your first allocation/i })
    expect(cta).toHaveAttribute('href', '/budget/b-42/allocations')
  })
})
