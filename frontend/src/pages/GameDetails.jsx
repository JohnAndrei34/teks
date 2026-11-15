import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Check, ExternalLink, Lightbulb, ShoppingCart } from 'lucide-react'
import { getConfig, getGame, peso } from '../lib/api.js'
import { COLLECTION_TITLES } from '../lib/content.js'
import { useCart } from '../context/useCart.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameCover from '../components/GameCover.jsx'
import PlatformIcons from '../components/PlatformIcons.jsx'
import DeveloperTypeBadge from '../components/DeveloperTypeBadge.jsx'
import GameGrid from '../components/GameGrid.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { BlockSkeleton } from '../components/Skeletons.jsx'
import NotFound from './NotFound.jsx'

const formatDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : null

function Gallery({ game }) {
  const images = [game.cover_image, ...(game.screenshots ?? [])]
  const [active, setActive] = useState(0)
  return (
    <div>
      <GameCover
        key={images[active]}
        src={images[active]}
        title={game.title}
        alt={active === 0 ? `${game.title} cover art` : `${game.title} screenshot ${active}`}
        lazy={false}
        className="aspect-[4/3] w-full rounded-2xl border border-teks-border"
      />
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2" aria-label="Gallery">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={i === 0 ? 'Show cover art' : `Show screenshot ${i}`}
                aria-current={i === active}
                className={`block overflow-hidden rounded-lg border-2 ${i === active ? 'border-teks-gold' : 'border-teks-border'}`}
              >
                <GameCover src={src} title={game.title} alt="" className="h-16 w-24" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function GameDetails() {
  const { slug } = useParams()
  const { addToCart, inCart } = useCart()
  const query = useQuery({
    queryKey: ['game', slug],
    queryFn: () => getGame(slug),
    retry: (count, err) => err.status !== 404 && count < 1,
  })
  const config = useQuery({ queryKey: ['config'], queryFn: getConfig })
  useDocumentTitle(query.data?.title ?? 'Game')

  if (query.error?.status === 404) {
    return (
      <NotFound title="Game not found" message="We couldn't find that game. It may have been removed." documentTitle="Game not found" />
    )
  }
  if (query.isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message="Couldn't load this game." onRetry={() => query.refetch()} />
      </div>
    )
  }
  if (query.isPending) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-2">
        <BlockSkeleton className="aspect-[4/3]" />
        <BlockSkeleton className="h-96" />
      </div>
    )
  }

  const g = query.data
  const onSale = g.sale_price != null && g.sale_price < g.price
  const added = inCart(g.id)
  const share = config.data?.developer_share_percent
  const { same_developer: sameDev, same_collection_or_genre: similar } = g.related

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-teks-muted">
        <Link to="/store" className="hover:text-teks-text">Store</Link> <span aria-hidden="true">/</span> {g.title}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <Gallery key={g.slug} game={g} />

        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{g.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-teks-muted">by</span>
            <Link to={`/developers/${g.developer.slug}`} className="font-semibold text-teks-gold hover:underline">
              {g.developer.name}
            </Link>
            <DeveloperTypeBadge type={g.developer.type} />
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-teks-surface-2 px-3 py-1 text-sm font-semibold">{g.genre}</span>
            {g.collection && (
              <Link
                to={`/collections/${g.collection}`}
                className="rounded-full border border-teks-gold/50 px-3 py-1 text-sm font-semibold text-teks-gold hover:bg-teks-gold hover:text-teks-bg"
              >
                {COLLECTION_TITLES[g.collection] ?? g.collection}
              </Link>
            )}
            <PlatformIcons platforms={g.platforms} showLabels />
          </div>
          {g.release_date && <p className="mt-3 text-sm text-teks-muted">Released {formatDate(g.release_date)}</p>}

          <p className="mt-5 text-lg">{g.short_description}</p>

          <div className="mt-6 rounded-2xl border border-teks-border bg-teks-surface p-5">
            <p className="flex items-baseline gap-3">
              {onSale ? (
                <>
                  <span className="sr-only">Sale price</span>
                  <span className="font-display text-3xl font-extrabold text-teks-gold">{peso(g.sale_price)}</span>
                  <span className="sr-only">Original price</span>
                  <s className="text-teks-muted">{peso(g.price)}</s>
                  {g.promo_caption && <span className="rounded bg-teks-primary px-2 py-0.5 text-xs font-bold text-white">{g.promo_caption}</span>}
                </>
              ) : (
                <span className="font-display text-3xl font-extrabold">{peso(g.price)}</span>
              )}
            </p>
            {added ? (
              <p className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 font-semibold text-teks-teal">
                  <Check size={18} aria-hidden="true" /> In cart
                </span>
                <Link to="/cart" className="rounded-lg border border-teks-teal px-4 py-2 font-semibold text-teks-teal hover:bg-teks-teal hover:text-teks-bg">
                  View cart
                </Link>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(g)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-teks-primary px-5 py-3 font-semibold text-white hover:bg-teks-primary-soft sm:w-auto"
              >
                <ShoppingCart size={18} aria-hidden="true" /> Add to Cart
              </button>
            )}
            <p className="mt-3 text-sm text-teks-muted">
              {share ? `${share}% of this purchase goes directly to the developer.` : 'A fair share of this purchase goes directly to the developer.'}
            </p>
            {g.trailer_url && (
              <a
                href={g.trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teks-gold hover:underline"
              >
                Watch trailer <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>

          {g.cultural_note && (
            <aside className="mt-6 rounded-2xl border-l-4 border-teks-gold bg-teks-surface p-5" aria-labelledby="cultural-note">
              <h2 id="cultural-note" className="flex items-center gap-2 font-display font-extrabold text-teks-gold">
                <Lightbulb size={18} aria-hidden="true" /> Cultural note
              </h2>
              <p className="mt-1 text-teks-muted">{g.cultural_note}</p>
            </aside>
          )}
        </div>
      </div>

      <section className="mt-10 max-w-3xl" aria-labelledby="about-game">
        <h2 id="about-game" className="font-display text-2xl font-extrabold">About this game</h2>
        <p className="mt-2 whitespace-pre-line text-teks-muted">{g.description}</p>
      </section>

      {sameDev.length > 0 && (
        <section className="mt-14">
          <SectionHeader title="More from this developer" to={`/developers/${g.developer.slug}`} linkLabel="View developer" />
          <GameGrid games={sameDev} />
        </section>
      )}
      {similar.length > 0 && (
        <section className="mt-14">
          <SectionHeader title="You may also like" />
          <GameGrid games={similar} />
        </section>
      )}
    </div>
  )
}
