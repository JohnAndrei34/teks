import { Monitor, Smartphone } from 'lucide-react'

export default function PlatformIcons({ platforms = [], showLabels = false }) {
  return (
    <ul className="plats" aria-label="Platforms">
      {platforms.map((p) => {
        const Icon = p === 'Mobile' ? Smartphone : Monitor
        return (
          <li key={p} title={p}>
            <Icon size={16} aria-hidden="true" />
            {showLabels ? <span>{p}</span> : <span className="sr-only">{p}</span>}
          </li>
        )
      })}
    </ul>
  )
}
