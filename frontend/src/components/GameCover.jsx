import { useState } from 'react'
import TeksArt from './TeksArt.jsx'

// The art box of a teks card. TeksArt is always drawn; a real cover image,
// when one exists and loads, fades in on top of it (no flash if the URL is dead).
// Children (stickers such as "No. 01") are rendered inside the box.
export default function GameCover({ game, decorative = false, lazy = true, className = '', children }) {
  const [loaded, setLoaded] = useState(null) // the url that finished loading
  const [failed, setFailed] = useState(null)
  const url = game.cover_image
  const show = url && failed !== url
  return (
    <div className={`art ${className}`}>
      <TeksArt motif={game.motif} palette={game.palette} title={game.title} seed={game.slug ?? game.title} decorative={decorative} />
      {show && (
        <img
          key={url}
          src={url}
          alt=""
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={() => setLoaded(url)}
          onError={() => setFailed(url)}
          className={`cover${loaded === url ? ' on' : ''}`}
        />
      )}
      {children}
    </div>
  )
}
