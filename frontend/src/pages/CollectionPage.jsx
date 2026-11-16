import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCollection } from '../lib/api.js'
import { COLLECTION_LINKS } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameGrid from '../components/GameGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { BlockSkeleton, GameGridSkeleton } from '../components/Skeletons.jsx'
import NotFound from './NotFound.jsx'

export default function CollectionPage() {
  const { slug } = useParams()
  const query = useQuery({
    queryKey: ['collection', slug],
    queryFn: () => getCollection(slug),
    retry: (count, err) => err.status !== 404 && count < 1,
  })
  useDocumentTitle(query.data?.title ?? 'Collection')

  if (query.error?.status === 404) {
    return (
      <NotFound
        title="Collection not found"
        message="That collection doesn't exist. Try one of ours below or browse the store."
        documentTitle="Collection not found"
      />
    )
  }
  if (query.isError) {
    return (
      <div className="wrap section">
        <ErrorState message="Couldn't load this collection." onRetry={() => query.refetch()} />
      </div>
    )
  }

  const c = query.data
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">Pinoy Collection</p>
          {c ? (
            <>
              <h1>{c.title}</h1>
              <p style={{ fontWeight: 800, color: 'var(--ink)' }}>{c.tagline}</p>
              <p>{c.description}</p>
            </>
          ) : (
            <BlockSkeleton style={{ minHeight: '9rem', maxWidth: '48rem' }} />
          )}
        </div>
      </section>

      <div className="wrap section">
        {!c ? (
          <GameGridSkeleton count={4} />
        ) : c.games.length ? (
          <GameGrid games={c.games} />
        ) : (
          <EmptyState title="No games in this collection yet" message="Check back soon." />
        )}

        <div className="filter-row" style={{ marginTop: '3rem' }}>
          <span className="lab">More collections</span>
          {COLLECTION_LINKS.filter((o) => o.slug !== slug).map((o) => (
            <Link key={o.slug} to={`/collections/${o.slug}`} className="chip">
              {o.title}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
