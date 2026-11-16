import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GameCard from './GameCard.jsx'

// Dea's hero: four teks cards dealt in a fan. Select a card to flip it and read its blurb.
const POSITIONS = [
  [-165, 70, -9, 1],
  [-55, 18, -3, 2],
  [55, 60, 4, 3],
  [165, 10, 10, 4],
]

export default function HeroFan({ games }) {
  const [flipped, setFlipped] = useState(null)
  const fronts = useRef({})

  return (
    <div className="fan" role="group" aria-label={`${games.length} featured games. Select a card to flip it.`}>
      {games.map((g, i) => {
        const [x, y, rot, z] = POSITIONS[i]
        const isFlipped = flipped === g.id
        return (
          <div
            key={g.id}
            className={`flipper${isFlipped ? ' flipped' : ''}`}
            style={{ '--x': `${x}px`, '--y': `${y}px`, '--rot': `${rot}deg`, '--z': z, '--i': i }}
          >
            <div className="flip-inner">
              <button
                type="button"
                className="face front"
                ref={(el) => {
                  fronts.current[g.id] = el
                }}
                inert={isFlipped}
                aria-label={`Flip ${g.title} to read about it`}
                onClick={() => setFlipped(g.id)}
              >
                <GameCard game={g} as="static" heading="span" hero />
              </button>
              <div className="face back" inert={!isFlipped}>
                <h3>{g.title}</h3>
                <p>{g.short_description}</p>
                <div className="row">
                  <Link className="btn small yellow" to={`/game/${g.slug}`}>
                    View game
                  </Link>
                  <button
                    type="button"
                    className="linkish"
                    onClick={() => {
                      setFlipped(null)
                      requestAnimationFrame(() => fronts.current[g.id]?.focus())
                    }}
                  >
                    Flip back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
