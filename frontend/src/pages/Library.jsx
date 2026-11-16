import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLibrary } from '../lib/library.js'
import { useAllGames } from '../lib/useAllGames.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameCard from '../components/GameCard.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { GameGridSkeleton } from '../components/Skeletons.jsx'

// Dea's "Collection" view, renamed My Library. Ownership is kept in this browser only.
export default function Library() {
  useDocumentTitle('My Library')
  const ids = useLibrary()
  const all = useAllGames()
  const [playing, setPlaying] = useState(null)
  const dialog = useRef(null)

  if (all.isError) {
    return <div className="wrap section"><ErrorState message="Couldn't load your library." onRetry={() => all.refetch()} /></div>
  }
  if (all.isPending) {
    return <div className="wrap section"><GameGridSkeleton count={Math.max(ids.length, 4)} /></div>
  }

  const mine = all.data.filter((g) => ids.includes(g.id))
  if (!mine.length) {
    return (
      <div className="wrap section">
        <div className="empty">
          <h1 style={{ fontSize: '2rem' }}>Your library is empty</h1>
          <p>Games you buy show up here as cards. Pick up your first one in the store.</p>
          <Link className="btn" to="/store">Browse the store</Link>
        </div>
      </div>
    )
  }

  const play = (g) => {
    setPlaying(g)
    dialog.current?.showModal()
  }

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>My Library</h1>
          <p>{mine.length} of {all.data.length} cards collected. Saved on this browser.</p>
        </div>
      </section>
      <div className="wrap section">
        <ul className="card-grid">
          {mine.map((g) => (
            <li key={g.id} className="owned-card">
              <GameCard game={g} />
              <button type="button" className="btn small" onClick={() => play(g)}>
                Play<span className="sr-only"> {g.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <dialog ref={dialog} aria-labelledby="play-title" onClose={() => setPlaying(null)}>
        <h2 id="play-title">{playing?.title}</h2>
        <p>This is a demo build, so the game launcher is not connected. In the full platform, this button starts the game.</p>
        <form method="dialog"><button className="btn">Close</button></form>
      </dialog>
    </>
  )
}
