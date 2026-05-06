import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DaysLeftCard } from '../DaysLeftCard'

const daily = [
  { date: '2026-05-01', amount: 100 },
  { date: '2026-05-02', amount: 200 },
]

describe('DaysLeftCard', () => {
  it('renders days left as integer', () => {
    render(<DaysLeftCard daysLeft={28} daily={daily} />)
    expect(screen.getByText('DAYS LEFT')).toBeInTheDocument()
    expect(screen.getByText('28')).toBeInTheDocument()
    expect(screen.getByText('to period end')).toBeInTheDocument()
  })

  it('renders 0 on the last day of cycle', () => {
    render(<DaysLeftCard daysLeft={0} daily={daily} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
