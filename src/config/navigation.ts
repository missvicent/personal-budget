import {
  Brain,
  Calculator,
  ChartNoAxesCombined,
  ClipboardList,
  House,
} from 'lucide-react'

export const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    description: 'Overview of your financial health',
    icon: House,
  },
  {
    title: 'Expenses',
    url: '/expenses',
    description: 'Track and manage your spending',
    icon: ClipboardList,
  },
  {
    title: 'Budgets',
    url: '/budget',
    description: 'Set and monitor budget limits',
    icon: ChartNoAxesCombined,
  },
  {
    title: 'Debt Calculator',
    url: '/debt-calculator',
    description: 'Track debts and plan payoff strategies',
    icon: Calculator,
  },
  {
    title: 'AI Insights',
    url: '/ia-insights',
    icon: Brain,
    description: 'Insights and spending patterns',
  },
]
