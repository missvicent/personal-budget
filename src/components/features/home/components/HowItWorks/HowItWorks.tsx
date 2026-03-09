import { motion } from 'framer-motion'
import { STEPS } from './constants'
import HowItWorksCard from './HowItWorksCard'
import SectionHeader from '@/components/common/SectionHeader'

const slideVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 60,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

export default function HowItWorks() {
  const steps = STEPS

  return (
    <section
      id="how-it-works"
      className="flex flex-col items-center justify-center py-24 transition-all duration-300"
    >
      <SectionHeader
        badge="How It Works"
        title="Three simple steps to"
        highlight="financial clarity"
      />

      <div className="flex w-full flex-col gap-6 p-5">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            variants={slideVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            custom={index % 2 === 0 ? -1 : 1}
          >
            <HowItWorksCard
              number={step.id.toString()}
              title={step.title}
              description={step.description}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
