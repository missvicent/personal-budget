import { createFileRoute } from '@tanstack/react-router'
import { staticToolbarMeta } from '@/lib/toolbar'

export const Route = createFileRoute('/_app/ia-insights/')({
  beforeLoad: staticToolbarMeta({
    title: 'AI Insights',
    description: 'Insights and spending patterns',
    balance: { label: 'Balance', value: '$0.00' },
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello AI Insights!</div>
}
