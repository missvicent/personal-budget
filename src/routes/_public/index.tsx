import { createFileRoute } from '@tanstack/react-router'
import { FeaturesSection, HeroSection } from '@/components/features/home'
import HowItWorks from '@/components/features/home/components/HowItWorks/HowItWorks'

export const Route = createFileRoute('/_public/')({
  component: App,
})

function App() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
    </>
  )
}
