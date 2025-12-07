import { Button } from '@/components/ui/button'

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
    'py-7 px-12 text-lg  bg-gradient-to-l from-purple-600 via-purple-500 to-purple-400 text-white hover:opacity-90 rounded-full md:px-20',
  outline:
    'py-7 px-12 text-lg bg-transparent border-2 border-purple-500 text-white hover:bg-purple-500 rounded-full transition-colors md:px-20',
} as const

export default function HeroSection() {
  return (
    <section className="min-h-[80vh] flex flex-col items-start justify-start p-8 md:items-center md:justify-center md:p-6">
      <span className="text-2xl font-bold uppercase text-green-300 md:text-3xl">
        {heroContent.badge}
      </span>

      <h1 className="text-7xl font-bold text-white lg:text-8xl">
        {heroContent.title}
      </h1>

      <h2 className="pb-4 text-6xl font-bold bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 bg-clip-text text-transparent md:text-7xl">
        {heroContent.subtitle}
      </h2>

      <p className="mt-4 max-w-2xl text-2xl font-semibold text-purple-300 opacity-90 md:text-center">
        {heroContent.description}
      </p>

      <div className="flex justify-center w-full mt-6 gap-4">
        <Button className={buttonStyles.primary} size="lg">
          Get Started
        </Button>
        <Button className={buttonStyles.outline} size="lg">
          Learn More
        </Button>
      </div>
    </section>
  )
}
