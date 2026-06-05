import { Outlet, createFileRoute } from '@tanstack/react-router'
import PublicHeader from '@/components/common/PublicHeader'
import Footer from '@/components/common/Footer'

function PublicLayout() {
  return (
    <div className="landing-shell flex min-h-screen flex-col overflow-x-hidden">
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
