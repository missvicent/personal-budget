import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
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
      },
      {
        label: 'Bonus',
        value: 'bonus',
        description: 'Annual bonus',
        color: '#00ff00',
        icon: 'B',
      },
      {
        label: 'Freelance',
        value: 'freelance',
        description: 'Freelance income',
        color: '#0000ff',
        icon: 'F',
      },
    ],
  },
  {
    groupLabel: 'Expenses',
    items: [{ label: 'Food', value: 'food' }],
  },
]

function RouteComponent() {
  const [selectedBudget, setSelectedBudget] = useState<string>('')

  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        <BudgetSelector
          items={items}
          onChange={setSelectedBudget}
          value={selectedBudget}
        />
      </div>
    </div>
  )
}
