import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import type { Feature } from '../../types'

interface FeatureCardProps {
  feature: Feature
  Icon: ComponentType<LucideProps>
}

export default function FeatureCard({ feature, Icon }: FeatureCardProps) {
  const { title, description } = feature
  return (
    <article
      className="group border-landing-line relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background:
          'linear-gradient(180deg, oklch(1 0 0 / 0.028), oklch(1 0 0 / 0.012))',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(120% 100% at 100% 0%, var(--landing-accent-tint), transparent 55%)',
        }}
      />
      <div className="relative">
        <div
          className="border-landing-line-2 text-landing-accent-2 mb-5 grid h-12 w-12 place-items-center rounded-2xl border"
          style={{
            background:
              'linear-gradient(160deg, var(--landing-accent-tint), oklch(1 0 0 / 0.02))',
            boxShadow: '0 10px 24px -16px var(--landing-accent-glow)',
          }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.7} />
        </div>
        <h3 className="landing-display text-landing-text mb-2 text-xl">
          {title}
        </h3>
        <p className="text-landing-muted max-w-prose text-sm">{description}</p>
      </div>
    </article>
  )
}
