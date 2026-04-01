export function OverviewSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 md:p-8">
      <div className="flex max-w-2xl flex-col items-center gap-8">
        {/* Badge */}
        <div className="bg-muted h-8 w-52 animate-pulse rounded-full" />

        {/* Icon + heading + description */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-muted h-16 w-16 animate-pulse rounded-2xl" />
          <div className="bg-muted h-8 w-72 animate-pulse rounded-md" />
          <div className="flex flex-col items-center gap-2">
            <div className="bg-muted h-4 w-80 animate-pulse rounded-md" />
            <div className="bg-muted h-4 w-64 animate-pulse rounded-md" />
          </div>
        </div>

        {/* Feature cards grid */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border-border bg-card flex flex-col gap-2 rounded-xl border p-4"
            >
              <div className="bg-muted h-8 w-8 animate-pulse rounded-md" />
              <div className="bg-muted h-4 w-32 animate-pulse rounded-md" />
              <div className="bg-muted h-3 w-full animate-pulse rounded-md" />
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="bg-muted h-11 w-56 animate-pulse rounded-full" />
      </div>
    </div>
  )
}
