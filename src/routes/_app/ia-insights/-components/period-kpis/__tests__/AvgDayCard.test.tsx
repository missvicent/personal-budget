import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AvgDayCard } from '../AvgDayCard'

const daily = [
  { date: '2026-05-01', amount: 100 },
  { date: '2026-05-02', amount: 200 },
]

describe('AvgDayCard', () => {
  it('renders the average daily spend', () => {
    render(<AvgDayCard actual={329} target={145} diff={184} daily={daily} />)
    expect(screen.getByText('AVG / DAY')).toBeInTheDocument()
    expect(screen.getByText('$329.00')).toBeInTheDocument()
  })

  it('shows above target when diff > 0', () => {
    render(<AvgDayCard actual={329} target={145} diff={184} daily={daily} />)
    expect(screen.getByText(/above target/)).toBeInTheDocument()
  })

  it('shows below target when diff < 0', () => {
    render(<AvgDayCard actual={50} target={145} diff={-95} daily={daily} />)
    expect(screen.getByText(/below target/)).toBeInTheDocument()
  })

  it('hides delta line when target is 0', () => {
    render(<AvgDayCard actual={329} target={0} diff={329} daily={daily} />)
    expect(screen.queryByText(/target/)).not.toBeInTheDocument()
  })
})
