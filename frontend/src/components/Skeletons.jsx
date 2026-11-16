export function GameCardSkeleton() {
  return (
    <div className="teks sk" aria-hidden="true">
      <div className="art" />
      <div className="info">
        <div className="sk-line" style={{ width: '75%' }} />
        <div className="sk-line" style={{ width: '50%' }} />
        <div className="sk-line" style={{ width: '35%', marginTop: '.4rem' }} />
      </div>
    </div>
  )
}

export function GameGridSkeleton({ count = 8 }) {
  return (
    <div role="status" aria-label="Loading games" className="card-grid">
      {Array.from({ length: count }, (_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function BlockSkeleton({ className = '', style }) {
  return <div role="status" aria-label="Loading" className={`sk sk-block ${className}`} style={{ minHeight: '8rem', ...style }} />
}
