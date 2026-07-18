export function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`rounded-lg bg-slate-700/40 animate-pulse ${className}`}
    />
  )
}

export function CardSkeleton({ rows = 3 }) {
  return (
    <div
      className="rounded-2xl border border-slate-700/50 p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-card)' }}
    >
      <SkeletonBlock className="h-4 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBlock key={i} className="h-3 w-full" />
      ))}
    </div>
  )
}

export function KPICardSkeleton() {
  return (
    <div
      className="rounded-2xl border border-slate-700/50 p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-start justify-between">
        <SkeletonBlock className="w-9 h-9 rounded-xl" />
        <SkeletonBlock className="w-14 h-5 rounded-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <SkeletonBlock className="h-7 w-2/3" />
        <SkeletonBlock className="h-3 w-1/2" />
      </div>
      <SkeletonBlock className="h-3 w-3/4" />
    </div>
  )
}
