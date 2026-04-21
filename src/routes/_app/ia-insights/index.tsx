import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PeriodRangeSelector } from './-components/PeriodRangeSelector'
import { TimeRangeSelector } from './-components/TimeRangeSelector'
import { staticToolbarMeta } from '@/lib/toolbar'
import { BudgetSelector } from '@/components/shared/BudgetSelector'

export const Route = createFileRoute('/_app/ia-insights/')({
  beforeLoad: staticToolbarMeta({
    title: 'AI Insights',
    description: 'Insights and spending patterns',
    balance: { label: 'Balance', value: '$0.00' },
  }),
  component: RouteComponent,
})

const items = [
  {
    groupLabel: 'Income',
    items: [
      {
        label: 'Salary',
        value: 'salary',
        description: 'Monthly salary',
        color: '#ff0000',
        icon: 'S',
        selectedOptionLabel: 'monthly',
      },
      {
        label: 'Bonus',
        value: 'bonus',
        description: 'Annual bonus',
        color: '#00ff00',
        icon: 'B',
        selectedOptionLabel: 'yearly',
      },
      {
        label: 'Freelance',
        value: 'freelance',
        description: 'Freelance income',
        color: '#0000ff',
        icon: 'F',
        selectedOptionLabel: 'monthly',
      },
    ],
  },
  {
    groupLabel: 'Expenses',
    items: [{ label: 'Food', value: 'food' }],
  },
]

const options = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

const timeOptions = [
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
]

function RouteComponent() {
  const [selectedBudget, setSelectedBudget] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly')
  const [selectedTime, setSelectedTime] = useState<string>('1m')

  return (
    <div className="flex">
      <div className="w-full p-4 md:w-1/2 xl:w-1/7">
        <BudgetSelector
          items={items}
          onChange={setSelectedBudget}
          value={selectedBudget}
        />
      </div>
      <div className="w-full p-4 md:w-1/2 xl:w-1/7">
        <PeriodRangeSelector
          options={options}
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
        />
      </div>
      <div className="w-full p-4 md:w-1/2 xl:w-1/7">
        <TimeRangeSelector
          options={timeOptions}
          value={selectedTime}
          onValueChange={setSelectedTime}
        />
      </div>
    </div>
  )
}
