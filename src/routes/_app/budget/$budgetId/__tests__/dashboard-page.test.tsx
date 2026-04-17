import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DashboardPage } from '../index'

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (config: unknown) => config,
  useParams: () => ({ budgetId: 'b1' }),
}))
vi.mock('@/routes/_app/budget/-hooks/dashboard/use-dashboard-data', () => ({
  useDashboardData: vi.fn(),
}))
vi.mock('@/routes/_app/budget/-components/dashboard/burn-chart', () => ({
  BurnChart: () => <div data-testid="burn-chart" />,
}))

const { useDashboardData } = await import(
  '@/routes/_app/budget/-hooks/dashboard/use-dashboard-data'
)

describe('DashboardPage', () => {
  it('renders a skeleton while loading', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      summary: {
        budgetUsedPercent: 0,
        remaining: 0,
        projectedEnd: 0,
        safeDaily: null,
        periodLabel: '',
        periodState: 'not-started',
      },
      categories: [],
      recentActivity: [],
      burnSeries: [],
      budgetAmount: 0,
      isLoading: true,
    })

    render(<DashboardPage />)

    expect(screen.getAllByRole('generic').length).toBeGreaterThan(0)
    expect(screen.queryByTestId('burn-chart')).not.toBeInTheDocument()
  })

  it('renders the four stat cards, burn chart, and recent activity heading when loaded', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      summary: {
        budgetUsedPercent: 50,
        remaining: 1500,
        projectedEnd: 2800,
        safeDaily: 100,
        periodLabel: 'April 2026',
        periodState: 'active',
      },
      categories: [],
      recentActivity: [],
      burnSeries: [],
      budgetAmount: 3000,
      isLoading: false,
    })

    render(<DashboardPage />)

    expect(screen.getByText(/budget used/i)).toBeInTheDocument()
    expect(screen.getByText(/^remaining$/i)).toBeInTheDocument()
    expect(screen.getByText(/projected end/i)).toBeInTheDocument()
    expect(screen.getByText(/safe daily/i)).toBeInTheDocument()
    expect(screen.getByTestId('burn-chart')).toBeInTheDocument()
    expect(screen.getByText(/^recent activity$/i)).toBeInTheDocument()
  })
})
