import { BarChart3, Receipt, Sparkles, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'

import { FEATURES } from './constants'
import FeatureCard from './FeatureCard'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import SectionHeader from '@/components/common/SectionHeader'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  }),
}

const iconMap: Record<string, ComponentType<LucideProps>> = {
  receipt: Receipt,
  wallet: Wallet,
  chart: BarChart3,
  sparkles: Sparkles,
}

export default function FeaturesSection() {
  const features = FEATURES
  return (
    <section className="flex flex-col items-center justify-center py-24">
      <SectionHeader
        badge="Features"
        title="Everything you need to"
        highlight="manage your finances"
        description="Simple tools designed to give you clarity and control over your spending."
      />
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
        {features.map((feature, index) => {
          const Icon: ComponentType<LucideProps> = iconMap[feature.icon]
          return (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={index * 0.1}
            >
              <FeatureCard feature={feature} Icon={Icon} />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
