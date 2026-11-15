import { AlertTriangle } from 'lucide-react'

export default function ErrorState({ message = 'Something went wrong while loading this.', onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-teks-primary/40 bg-teks-surface p-8 text-center">
      <AlertTriangle className="text-teks-primary-soft" aria-hidden="true" />
      <p className="text-teks-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-teks-primary px-4 py-2 text-sm font-semibold text-white hover:bg-teks-primary-soft"
        >
          Try again
        </button>
      )}
    </div>
  )
}
