import { BarChart3, Receipt, Sparkles, Wallet } from 'lucide-react'

import { FEATURES } from './constants'
import FeatureCard from './FeatureCard'
import FeatureTitle from './FeatureTitle'
import type { LucideProps } from 'lucide-react'
import type { Feature } from '../../types'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<LucideProps>> = {
  receipt: Receipt,
  wallet: Wallet,
  chart: BarChart3,
  sparkles: Sparkles,
}

export default function FeaturesSection() {
  const features = FEATURES
  return (
    <section className="min-h-content flex flex-col items-center justify-center">
      <FeatureTitle />
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
        {features.map((feature) => {
          const Icon: ComponentType<LucideProps> = iconMap[feature.icon]
          return <FeatureCard key={feature.id} feature={feature} Icon={Icon} />
        })}
      </div>
    </section>
  )
}
