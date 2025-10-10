import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/ui/layout/Header'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <div className="bg-gradient-to-br from-black via-purple-950 to-purple-925">
        <Header />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold text-white">Personal Budget</h1>
        </div>
      </div>
    </>
  )
}
