import { Outlet, createFileRoute } from '@tanstack/react-router'
import PublicHeader from '@/components/common/PublicHeader'
import Footer from '@/components/common/Footer'

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-black via-purple-950 to-purple-900">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})
