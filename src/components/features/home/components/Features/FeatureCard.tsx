import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import type { Feature } from '../../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureCardProps {
  feature: Feature
  Icon: ComponentType<LucideProps>
}

export default function FeatureCard({ feature, Icon }: FeatureCardProps) {
  const { id, title, description } = feature
  return (
    <Card
      key={id}
      className="min-h-48 w-full rounded-2xl border border-slate-700/40 bg-slate-900/80"
    >
      <CardHeader>
        <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-2xl border-b border-violet-700/50 bg-violet-600">
          <Icon className="h-12 w-12 text-white" strokeWidth={1.5} />
        </div>
        <CardTitle>
          <span className="text-2xl font-bold text-white">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-white">{description}</p>
      </CardContent>
    </Card>
  )
}
