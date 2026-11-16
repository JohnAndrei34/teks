import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink } from 'lucide-react'
import { getConfig, getGame, peso, pesoExact } from '../lib/api.js'
import { COLLECTION_TITLES } from '../lib/content.js'
import { useCart } from '../context/useCart.js'
import { useToast } from '../context/useToast.js'
import { useLibrary } from '../lib/library.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameCard from '../components/GameCard.jsx'
import PlatformIcons from '../components/PlatformIcons.jsx'
import DeveloperTypeBadge from '../components/DeveloperTypeBadge.jsx'
import GameGrid from '../components/GameGrid.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { BlockSkeleton } from '../components/Skeletons.jsx'
import NotFound from './NotFound.jsx'

const formatDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : null

export default function GameDetails() {
  const { slug } = useParams()
  const { addToCart, inCart } = useCart()
  const { toast } = useToast()
  const library = useLibrary()
  const query = useQuery({
    queryKey: ['game', slug],
    queryFn: () => getGame(slug),
    retry: (count, err) => err.status !== 404 && count < 1,
  })
  const config = useQuery({ queryKey: ['config'], queryFn: getConfig })
  useDocumentTitle(query.data?.title ?? 'Game')

  if (query.error?.status === 404) {
    return <NotFound title="Game not found" message="We couldn't find that game. It may have been removed." documentTitle="Game not found" />
  }
  if (query.isError) {
    return (
      <div className="wrap section">
        <ErrorState message="Couldn't load this game." onRetry={() => query.refetch()} />
      </div>
    )
  }
  if (query.isPending) {
    return (
      <div className="wrap game" style={{ paddingTop: '2rem' }}>
        <BlockSkeleton style={{ aspectRatio: '300/260' }} />
        <BlockSkeleton style={{ minHeight: '24rem' }} />
      </div>
    )
  }

  const g = query.data
  const onSale = g.sale_price != null && g.sale_price < g.price
  const unit = onSale ? g.sale_price : g.price
  const owned = library.includes(g.id)
  const added = inCart(g.id)
  const share = config.data?.developer_share_percent
  const devCut = share ? Math.round(unit * share) / 100 : null
  const { same_developer: sameDev, same_collection_or_genre: similar } = g.related

  return (
    <div className="wrap">
      <p className="crumbs">
        <Link to="/store">Store</Link>
        {g.collection && (
          <>
            {' / '}
            <Link to={`/collections/${g.collection}`}>{COLLECTION_TITLES[g.collection] ?? g.collection}</Link>
          </>
        )}
      </p>
      <div className="game">
        <div className="big-card">
          <GameCard game={g} as="static" heading="div" hero />
        </div>
        <div>
          <h1>{g.title}</h1>
          <p className="by">
            by <Link to={`/developers/${g.developer.slug}`}>{g.developer.name}</Link>
            <DeveloperTypeBadge type={g.developer.type} />
          </p>
          <div className="tags">
            <span className="tag">{g.genre}</span>
            {g.collection && (
              <Link className="tag" to={`/collections/${g.collection}`}>
                {COLLECTION_TITLES[g.collection] ?? g.collection}
              </Link>
            )}
            <PlatformIcons platforms={g.platforms} showLabels />
          </div>
          {g.release_date && <p className="split">Released {formatDate(g.release_date)}</p>}
          <p style={{ marginTop: '1rem' }}>{g.description}</p>

          <div className="buy">
            <span className="price">
              {onSale ? (
                <>
                  <span className="sr-only">Original price </span>
                  <s>{peso(g.price)}</s>
                  <span className="sr-only">Sale price </span>
                  {peso(g.sale_price)}
                </>
              ) : (
                peso(g.price)
              )}
            </span>
            {onSale && g.promo_caption && <span className="promo">{g.promo_caption}</span>}
            {owned ? (
              <Link className="btn" to="/library">In your library</Link>
            ) : added ? (
              <Link className="btn red" to="/cart">In cart. Check out</Link>
            ) : (
              <button
                type="button"
                className="btn red"
                onClick={() => {
                  addToCart(g)
                  toast(`${g.title} added to cart`)
                }}
              >
                Add to cart
              </button>
            )}
          </div>

          {g.highlights?.length > 0 && (
            <>
              <h3>What you get</h3>
              <ul className="list">
                {g.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </>
          )}

          {devCut != null && (
            <>
              <h3>Where your {peso(unit)} goes</h3>
              <div className="bar-split" role="img" aria-label={`${share} percent to the developer`}>
                <i style={{ width: `${share}%` }} />
                <b />
              </div>
              <p className="split">
                {g.developer.name} receives {pesoExact(devCut)}. TEKS keeps the remaining {pesoExact(Math.round((unit - devCut) * 100) / 100)} to run the store.
              </p>
            </>
          )}

          {g.cultural_note && (
            <aside className="box cult" aria-labelledby="cultural-note">
              <h3 id="cultural-note">Cultural note</h3>
              <p>{g.cultural_note}</p>
            </aside>
          )}

          {g.trailer_url && (
            <p style={{ marginTop: '1.2rem' }}>
              <a className="linkish" href={g.trailer_url} target="_blank" rel="noopener noreferrer">
                Watch trailer <ExternalLink size={14} aria-hidden="true" style={{ display: 'inline' }} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          )}
        </div>
      </div>

      {sameDev.length > 0 && (
        <section className="section" style={{ paddingTop: '1rem' }}>
          <div className="head">
            <h2>More from {g.developer.name}</h2>
            <Link className="btn alt small" to={`/developers/${g.developer.slug}`}>View developer</Link>
          </div>
          <GameGrid games={sameDev} />
        </section>
      )}
      {similar.length > 0 && (
        <section className="section" style={{ paddingTop: '1rem' }}>
          <div className="head">
            <h2>You might also like</h2>
          </div>
          <GameGrid games={similar} />
        </section>
      )}
    </div>
  )
}
