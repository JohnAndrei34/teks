import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { getGame, peso } from '../lib/api.js'
import { useLibrary } from '../lib/library.js'
import GameCover from './GameCover.jsx'
import PlatformIcons from './PlatformIcons.jsx'

const cardNo = (g) => `No. ${String(g.card_no ?? g.id).padStart(2, '0')}`

// The teks card (Dea's design). `as`:
//   'link'   a link to the game page (default; used in grids)
//   'static' a plain card (game page, hero front)
// `heading` is the element for the title; the hero front sits inside a <button>, so it uses 'span'.
export default function GameCard({ game, as = 'link', heading = 'h3', hero = false }) {
  const queryClient = useQueryClient()
  const library = useLibrary()
  const owned = library.includes(game.id)
  const onSale = game.sale_price != null && game.sale_price < game.price
  const Heading = heading
  const prefetch = () =>
    queryClient.prefetchQuery({ queryKey: ['game', game.slug], queryFn: () => getGame(game.slug) })

  const body = (
    <>
      <GameCover game={game} decorative>
        <span className="no">{cardNo(game)}</span>
        {game.is_new && <span className="flag new">NEW</span>}
        {onSale && <span className="flag sale">SALE</span>}
      </GameCover>
      <div className="info">
        <Heading className={heading === 'span' ? 'h3' : undefined}>{game.title}</Heading>
        <p className="studio">{game.developer?.name}</p>
        <div className="meta">
          <span className="meta-l">
            {owned ? <span className="tag owned">In library</span> : <span className="tag">{game.genre}</span>}
            {!hero && <PlatformIcons platforms={game.platforms} />}
          </span>
          <span className="price">
            {onSale ? (
              <>
                <span className="sr-only">Original price </span>
                <s>{peso(game.price)}</s>
                <span className="sr-only">Sale price </span>
                {peso(game.sale_price)}
              </>
            ) : (
              peso(game.price)
            )}
          </span>
        </div>
      </div>
    </>
  )

  if (as === 'static') return <div className="teks">{body}</div>
  return (
    <Link
      to={`/game/${game.slug}`}
      className="teks"
      onMouseEnter={prefetch}
      onTouchStart={prefetch}
      onFocus={prefetch}
    >
      {body}
    </Link>
  )
}
