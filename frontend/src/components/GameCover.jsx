import { useState } from 'react'

const GRADIENTS = [
  ['#e63946', '#f6b73c'],
  ['#35c4ad', '#2a2640'],
  ['#f6b73c', '#8e2de2'],
  ['#4a69bd', '#e63946'],
  ['#2a2640', '#35c4ad'],
]

function gradientFor(text = '') {
  let h = 0
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) % 997
  const [a, b] = GRADIENTS[h % GRADIENTS.length]
  return `linear-gradient(135deg, ${a}, ${b})`
}

// Shows the image; if it fails to load, shows a styled card with the title instead.
export default function GameCover({ src, title, alt, className = '', lazy = true }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const failed = !src || failedSrc === src

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt ?? `${title} cover (image unavailable)`}
        className={`flex items-center justify-center p-4 text-center ${className}`}
        style={{ backgroundImage: gradientFor(title) }}
      >
        <span className="font-display text-xl font-extrabold leading-tight text-white drop-shadow-md">
          {title}
        </span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt ?? `${title} cover art`}
      loading={lazy ? 'lazy' : 'eager'}
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  )
}
