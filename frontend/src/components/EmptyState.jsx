import { Ghost } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-teks-border p-10 text-center">
      <Ghost className="text-teks-muted" aria-hidden="true" />
      <h3 className="font-display text-lg font-extrabold">{title}</h3>
      {message && <p className="text-teks-muted">{message}</p>}
      {action}
    </div>
  )
}
