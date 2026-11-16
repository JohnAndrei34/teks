import { memo, useMemo } from 'react'
import { artMarkup } from '../lib/teksArt.js'

// Dea's procedural card art. `decorative` hides it from screen readers
// (use it inside a card that already shows the game title as text).
function TeksArt({ motif, palette, title, seed, decorative = false }) {
  const paletteKey = Array.isArray(palette) ? palette.join() : ''
  const markup = useMemo(
    () => artMarkup(motif, paletteKey ? paletteKey.split(',') : null, seed ?? title),
    [motif, paletteKey, seed, title],
  )
  return (
    <svg
      viewBox="0 0 300 220"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      {...(decorative ? { 'aria-hidden': 'true' } : { role: 'img', 'aria-label': `${title} card art` })}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}

export default memo(TeksArt)
