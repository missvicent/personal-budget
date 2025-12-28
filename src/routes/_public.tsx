import { Outlet, createFileRoute } from '@tanstack/react-router'
import PublicHeader from '@/components/common/PublicHeader'

function PublicLayout() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </>
  )
}

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})
