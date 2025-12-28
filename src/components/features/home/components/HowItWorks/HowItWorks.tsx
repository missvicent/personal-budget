import { STEPS } from './constants'
import HowItWorksCard from './HowItWorksCard'
import SectionHeader from '@/components/common/SectionHeader'

export default function HowItWorks() {
  const steps = STEPS

  return (
    <section className="min-h-content flex flex-col items-center justify-center">
      <SectionHeader
        badge="How It Works"
        title="Three simple steps to"
        highlight="financial clarity"
      />

      <div className="flex w-full flex-col gap-6 p-5">
        {steps.map((step) => (
          <HowItWorksCard
            key={step.id}
            number={step.id.toString()}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </section>
  )
}
