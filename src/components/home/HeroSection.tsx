import { Button } from '@/components/ui/button'

export default function HeroSection() {
  const title = 'Master Your Money'
  const subtitle = 'Transform Your Life'
  const description = 'Smart Budgeting Platform'
  const description2 = 'Powerful financial insights that help you save more,'
  const description3 = 'spend wisely, and achieve your goals faster.'

  return (
    <section className="min-h-[80vh] flex flex-col md:items-center md:justify-center justify-start items-start md:p-6 p-8 leading-3">
      <span className="md:text-3xl text-2xl font-bold text-green-300 uppercase">
        {description}
      </span>
      <h1 className="lg:text-8xl text-7xl font-bold text-white">{title}</h1>
      <h2 className="md:text-7xl text-6xl pb-4 font-bold bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 bg-clip-text text-transparent">
        {subtitle}
      </h2>
      <p className="text-2xl text-purple-300 mt-4 font-semibold opacity-90">
        {description2}
      </p>
      <p className="text-2xl text-purple-300 font-semibold opacity-90">
        {description3}
      </p>
      <div className="mt-6 flex gap-4">
        <Button
          className="py-7 px-20 bg-gradient-to-l from-purple-600 via-purple-500 to-purple-400  text-white hover:bg-purple-300/90 rounded-full"
          variant="secondary"
          size="lg"
        >
          Get Started
        </Button>
        <Button
          className="py-7 px-20 bg-transparent border-purple-500 text-white hover:bg-purple-500 hover:text-white rounded-full border-2"
          size="lg"
        >
          Learn More
        </Button>
      </div>
    </section>
  )
}
