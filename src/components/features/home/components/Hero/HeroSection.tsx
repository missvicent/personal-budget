import { motion } from 'framer-motion'
import { SignInButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
  }),
}

interface HeroContent {
  badge: string
  title: string
  subtitle: string
  description: string
}

// Content configuration
const heroContent: HeroContent = {
  badge: 'Smart Budgeting Platform',
  title: 'Master Your Money',
  subtitle: 'Transform Your Life',
  description:
    'Powerful financial insights that help you save more, spend wisely, and achieve your goals faster.',
}

// Reusable button styles
const buttonStyles = {
  primary:
    'py-7 px-8 text-lg bg-gradient-to-l from-purple-600 via-purple-500 to-purple-400 text-white hover:opacity-90 rounded-full md:px-20',
  outline:
    'py-7 px-8 text-lg bg-transparent border-2 border-purple-500 text-white hover:bg-purple-500 rounded-full transition-colors md:px-20',
} as const

export default function HeroSection() {
  return (
    <section className="min-h-content flex flex-col items-center justify-center p-8 md:p-6">
      <motion.span
        className="text-2xl font-bold text-green-300 uppercase md:text-3xl"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        {heroContent.badge}
      </motion.span>

      <motion.h1
        className="text-7xl font-bold text-white lg:text-8xl"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        {heroContent.title}
      </motion.h1>

      <motion.h2
        className="bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 bg-clip-text pb-4 text-6xl font-bold text-transparent md:text-7xl"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        {heroContent.subtitle}
      </motion.h2>

      <motion.p
        className="mt-4 max-w-2xl text-center text-2xl font-semibold text-purple-300 opacity-90"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        {heroContent.description}
      </motion.p>

      <motion.div
        className="mt-6 flex w-full justify-center gap-4"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        <SignInButton mode="modal">
          <Button className={buttonStyles.primary} size="sm">
            Start Now
          </Button>
        </SignInButton>
        <a href="#how-it-works">
          <Button className={buttonStyles.outline} size="sm">
            Learn More
          </Button>
        </a>
      </motion.div>
    </section>
  )
}
