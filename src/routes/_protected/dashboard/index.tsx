import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  )
}
