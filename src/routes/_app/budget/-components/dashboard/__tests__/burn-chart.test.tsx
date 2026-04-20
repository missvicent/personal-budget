import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BurnChart } from '../burn-chart'
import type * as Recharts from 'recharts'
import type { ReactNode } from 'react'
import type { BurnSeriesPoint } from '@/routes/_app/budget/-hooks/dashboard/types'

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof Recharts>('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <div style={{ width: 800, height: 300 }}>{children}</div>
    ),
  }
})

const mkSeries = (withActual: boolean): Array<BurnSeriesPoint> =>
  Array.from({ length: 10 }, (_, i) => ({
    date: new Date(Date.UTC(2026, 3, i + 1)),
    actual: withActual ? i * 10 : null,
    pace: i * 15,
    projected: null,
  }))

describe('BurnChart', () => {
  it('renders the chart title and description', () => {
    render(<BurnChart series={mkSeries(true)} budgetAmount={150} />)

    expect(screen.getByText(/burn rate/i)).toBeInTheDocument()
  })

  it('shows an empty-state hint when every actual point is null or zero', () => {
    render(<BurnChart series={mkSeries(false)} budgetAmount={150} />)

    expect(screen.getByText(/no spending yet/i)).toBeInTheDocument()
  })

  it('does not render the empty-state hint when actuals are non-zero', () => {
    render(<BurnChart series={mkSeries(true)} budgetAmount={150} />)

    expect(screen.queryByText(/no spending yet/i)).not.toBeInTheDocument()
  })
})
