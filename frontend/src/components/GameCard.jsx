import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { getGame, peso } from '../lib/api.js'
import { COLLECTION_TITLES } from '../lib/content.js'
import GameCover from './GameCover.jsx'
import PlatformIcons from './PlatformIcons.jsx'

export default function GameCard({ game }) {
  const queryClient = useQueryClient()
  const prefetch = () =>
    queryClient.prefetchQuery({ queryKey: ['game', game.slug], queryFn: () => getGame(game.slug) })
  const onSale = game.sale_price != null && game.sale_price < game.price

  return (
    <article className="group relative h-full">
      <Link
        to={`/game/${game.slug}`}
        onMouseEnter={prefetch}
        onTouchStart={prefetch}
        onFocus={prefetch}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-teks-border bg-teks-surface transition duration-200 hover:-translate-y-1 hover:-rotate-1 hover:border-teks-gold hover:shadow-lg hover:shadow-black/40 focus-visible:-translate-y-1"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-teks-surface-2">
          <GameCover src={game.cover_image} title={game.title} className="h-full w-full" />
          <span
            aria-hidden="true"
            className="absolute left-2 top-2 rounded-md bg-teks-bg/85 px-2 py-0.5 font-display text-xs font-extrabold text-teks-gold ring-1 ring-teks-gold/50"
          >
            #{String(game.id).padStart(2, '0')}
          </span>
          {game.is_new && (
            <span className="absolute right-2 top-2 rounded-md bg-teks-teal px-2 py-0.5 text-xs font-bold text-teks-bg">
              NEW
            </span>
          )}
          {onSale && (
            <span className="absolute bottom-2 right-2 rounded-md bg-teks-primary px-2 py-0.5 text-xs font-bold text-white">
              SALE
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="font-display text-base font-extrabold leading-snug">{game.title}</h3>
          <p className="text-sm text-teks-muted">{game.developer?.name}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-teks-surface-2 px-2 py-0.5 text-xs font-semibold">{game.genre}</span>
            {game.collection && (
              <span className="rounded-full border border-teks-gold/50 px-2 py-0.5 text-xs font-semibold text-teks-gold">
                {COLLECTION_TITLES[game.collection] ?? game.collection}
              </span>
            )}
          </div>
          <div className="mt-auto flex items-end justify-between pt-2">
            <PlatformIcons platforms={game.platforms} />
            <p className="text-right">
              {onSale ? (
                <>
                  <span className="sr-only">Original price </span>
                  <s className="mr-1.5 text-xs text-teks-muted">{peso(game.price)}</s>
                  <span className="sr-only">Sale price </span>
                  <span className="font-extrabold text-teks-gold">{peso(game.sale_price)}</span>
                </>
              ) : (
                <span className="font-extrabold">{peso(game.price)}</span>
              )}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}
