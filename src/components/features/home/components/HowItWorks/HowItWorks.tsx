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
  return (
    <section
      id="how-it-works"
      className="relative mx-auto w-full max-w-7xl px-7 py-28"
    >
      <SectionHeader
        badge="How It Works"
        title="Three simple steps to"
        highlight="financial clarity"
      />
      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-7">
        <div
          className="absolute top-8 right-[14%] left-[14%] hidden h-px md:block"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--landing-line-2), transparent)',
          }}
        />
        {STEPS.map((step, index) => (
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
              accent={step.id === 1}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
