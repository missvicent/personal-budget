import { createFileRoute } from '@tanstack/react-router'
import { FeaturesSection, HeroSection } from '@/components/features/home'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  )
}
