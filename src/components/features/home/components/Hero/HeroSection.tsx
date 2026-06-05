import { motion } from 'framer-motion'
import { SignUpButton } from '@clerk/clerk-react'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
  }),
}

const heroContent = {
  badge: 'Smart Budgeting Platform',
  titleLine1: 'Master Your Money',
  titleLine2: 'Transform Your Life',
  description:
    'Powerful financial insights that help you save more, spend wisely, and achieve your goals faster.',
}

export default function HeroSection() {
  return (
    <section className="min-h-content flex flex-col items-center justify-center px-6 pt-20 pb-10 text-center md:px-8">
      <motion.span
        className="text-landing-accent-2 mb-6 inline-block text-sm font-semibold tracking-[0.22em] uppercase"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        {heroContent.badge}
      </motion.span>

      <motion.h1
        className="landing-display text-5xl md:text-7xl lg:text-8xl"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        {heroContent.titleLine1}
        <span className="landing-grad mt-0.5 block">
          {heroContent.titleLine2}
        </span>
      </motion.h1>

      <motion.p
        className="text-landing-muted mt-6 max-w-2xl text-center text-lg md:text-xl"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        {heroContent.description}
      </motion.p>

      <motion.div
        className="mt-9 flex flex-wrap justify-center gap-3.5"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        <SignUpButton mode="modal">
          <button
            className="inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-base font-semibold whitespace-nowrap text-white shadow-[0_1px_0_oklch(1_0_0/0.18)_inset,0_12px_30px_-12px_var(--landing-accent-glow)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_1px_0_oklch(1_0_0/0.22)_inset,0_18px_40px_-14px_var(--landing-accent-glow)] active:translate-y-px"
            style={{
              background:
                'linear-gradient(180deg, var(--landing-accent), var(--landing-accent-press))',
            }}
          >
            Start Now
          </button>
        </SignUpButton>
        <a href="#how-it-works">
          <button className="border-landing-line-2 text-landing-text inline-flex cursor-pointer items-center gap-2 rounded-full border bg-[oklch(1_0_0/0.03)] px-6 py-3 text-base font-semibold whitespace-nowrap backdrop-blur-sm transition-colors hover:bg-[oklch(1_0_0/0.07)]">
            Learn More
          </button>
        </a>
      </motion.div>
    </section>
  )
}
