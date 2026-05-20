import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/insights/use-period-kpis', () => ({
  usePeriodKpis: vi.fn(),
}))

const { usePeriodKpis } = await import('@/hooks/insights/use-period-kpis')
const { PeriodKpiGrid } = await import('../PeriodKpiGrid')

const baseKpis = {
  cycle: {
    start: new Date('2026-05-01'),
    end: new Date('2026-05-31'),
    daysInCycle: 31,
    daysElapsed: 5,
    daysLeft: 26,
  },
  spent: { actual: 1000, budget: 4500, deltaPct: -78, daily: [] },
  pacing: { utilizationPct: 22, diff: 3500, isOver: false },
  avgDay: { actual: 200, target: 145, diff: 55, daily: [] },
  isLoading: false,
}

describe('PeriodKpiGrid', () => {
  it('renders all four KPI cards', () => {
    vi.mocked(usePeriodKpis).mockReturnValue(baseKpis)
    render(<PeriodKpiGrid budgetId="b1" />)
    expect(screen.getByText('SPENT THIS PERIOD')).toBeInTheDocument()
    expect(screen.getByText('PACING')).toBeInTheDocument()
    expect(screen.getByText('AVG / DAY')).toBeInTheDocument()
    expect(screen.getByText('DAYS LEFT')).toBeInTheDocument()
  })

  it('passes isLoading down so each card shows skeletons', () => {
    vi.mocked(usePeriodKpis).mockReturnValue({ ...baseKpis, isLoading: true })
    render(<PeriodKpiGrid budgetId="b1" />)
    expect(screen.queryByText('$1,000.00')).not.toBeInTheDocument()
    expect(screen.queryByText('22%')).not.toBeInTheDocument()
  })
})
