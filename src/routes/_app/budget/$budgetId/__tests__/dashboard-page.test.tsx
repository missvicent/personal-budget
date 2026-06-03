import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DashboardPage } from '../index'

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (config: unknown) => config,
  useParams: () => ({ budgetId: 'b1' }),
  Link: ({
    children,
    to,
    params,
  }: {
    children: React.ReactNode
    to: string
    params: Record<string, string>
  }) => <a href={to.replace('$budgetId', params.budgetId)}>{children}</a>,
}))
vi.mock('@/routes/_app/budget/-hooks/dashboard/use-dashboard-data', () => ({
  useDashboardData: vi.fn(),
}))
vi.mock('@/routes/_app/budget/-components/dashboard/burn-chart', () => ({
  BurnChart: () => <div data-testid="burn-chart" />,
}))

const { useDashboardData } =
  await import('@/routes/_app/budget/-hooks/dashboard/use-dashboard-data')

describe('DashboardPage', () => {
  it('renders a skeleton while loading', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      summary: {
        paceVariance: null,
        remaining: 0,
        overBudgetAmount: null,
        dailyAverage: null,
        periodLabel: '',
        periodState: 'not-started',
        paceState: 'no-data',
      },
      spotlight: null,
      categories: [],
      recentActivity: [],
      burnSeries: [],
      budgetAmount: 0,
      hasAllocations: true,
      isLoading: true,
    })

    render(<DashboardPage />)

    expect(screen.queryByTestId('burn-chart')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('spotlight-category-card'),
    ).not.toBeInTheDocument()
  })

  it('renders the three stat cards, spotlight, burn chart, and recent activity when loaded under budget', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      summary: {
        paceVariance: 0,
        remaining: 1500,
        overBudgetAmount: null,
        dailyAverage: 100,
        periodLabel: 'April 2026',
        periodState: 'active',
        paceState: 'on',
      },
      spotlight: {
        mode: 'top-spender',
        id: 'a1',
        name: 'Groceries',
        icon: '🛒',
        color: '#064E3B',
        amountSpent: 300,
        amountBudget: 500,
        overshoot: -200,
      },
      categories: [],
      recentActivity: [],
      burnSeries: [],
      budgetAmount: 3000,
      hasAllocations: true,
      isLoading: false,
    })

    render(<DashboardPage />)

    expect(screen.getByText(/pace variance/i)).toBeInTheDocument()
    expect(screen.getByText(/^on pace$/i)).toBeInTheDocument()
    expect(screen.getByText(/^remaining$/i)).toBeInTheDocument()
    expect(screen.getByText(/daily average/i)).toBeInTheDocument()
    expect(screen.getByTestId('spotlight-category-card')).toBeInTheDocument()
    expect(screen.getByTestId('burn-chart')).toBeInTheDocument()
    expect(screen.getByText(/^recent activity$/i)).toBeInTheDocument()
    // Over Budget title should NOT appear when overBudgetAmount is null
    expect(screen.queryByText(/over budget/i)).not.toBeInTheDocument()
  })

  it('renders the Over Budget card with warning tone when overBudgetAmount is set', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      summary: {
        paceVariance: 500,
        remaining: 0,
        overBudgetAmount: 500,
        dailyAverage: 200,
        periodLabel: 'April 2026',
        periodState: 'active',
        paceState: 'over',
      },
      spotlight: null,
      categories: [],
      recentActivity: [],
      burnSeries: [],
      budgetAmount: 3000,
      hasAllocations: true,
      isLoading: false,
    })

    render(<DashboardPage />)

    expect(screen.getByText(/^over budget$/i)).toBeInTheDocument()
    expect(screen.queryByText(/^remaining$/i)).not.toBeInTheDocument()
    expect(screen.getByText(/budget was \$3,000\.00/i)).toBeInTheDocument()
    expect(screen.getByText(/over pace/i)).toBeInTheDocument()
  })

  it('renders the onboarding empty state when the budget has no allocations', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      summary: {
        paceVariance: null,
        remaining: 0,
        overBudgetAmount: null,
        dailyAverage: null,
        periodLabel: '',
        periodState: 'not-started',
        paceState: 'no-data',
      },
      spotlight: null,
      categories: [],
      recentActivity: [],
      burnSeries: [],
      budgetAmount: 0,
      hasAllocations: false,
      isLoading: false,
    })

    render(<DashboardPage />)

    expect(screen.getByText(/your budget is ready/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /add your first allocation/i }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/pace variance/i)).not.toBeInTheDocument()
    expect(screen.queryByTestId('burn-chart')).not.toBeInTheDocument()
  })
})
