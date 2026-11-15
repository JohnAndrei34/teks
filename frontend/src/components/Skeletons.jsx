export function GameCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-teks-border bg-teks-surface" aria-hidden="true">
      <div className="aspect-[4/3] bg-teks-surface-2" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 rounded bg-teks-surface-2" />
        <div className="h-3 w-1/2 rounded bg-teks-surface-2" />
        <div className="h-5 w-1/3 rounded-full bg-teks-surface-2" />
        <div className="h-4 w-1/4 self-end rounded bg-teks-surface-2" />
      </div>
    </div>
  )
}

export function GameGridSkeleton({ count = 8 }) {
  return (
    <div
      role="status"
      aria-label="Loading games"
      className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function BlockSkeleton({ className = 'h-40' }) {
  return <div role="status" aria-label="Loading" className={`animate-pulse rounded-2xl bg-teks-surface-2 ${className}`} />
}
