import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCollection } from '../lib/api.js'
import { COLLECTION_LINKS } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameGrid from '../components/GameGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { BlockSkeleton, GameGridSkeleton } from '../components/Skeletons.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
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
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message="Couldn't load this collection." onRetry={() => query.refetch()} />
      </div>
    )
  }

  const c = query.data
  return (
    <>
      <section className="sun-rays border-b border-teks-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teks-gold">Pinoy Collection</p>
          {c ? (
            <>
              <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{c.title}</h1>
              <p className="mt-2 text-xl text-teks-gold">{c.tagline}</p>
              <p className="mt-4 max-w-3xl text-teks-muted">{c.description}</p>
            </>
          ) : (
            <BlockSkeleton className="h-40 max-w-3xl" />
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {!c ? (
          <GameGridSkeleton count={4} />
        ) : c.games.length ? (
          <GameGrid games={c.games} />
        ) : (
          <EmptyState title="No games in this collection yet" message="Check back soon." />
        )}

        <div className="mt-14">
          <SectionHeader title="More collections" />
          <ul className="flex flex-wrap gap-3">
            {COLLECTION_LINKS.filter((o) => o.slug !== slug).map((o) => (
              <li key={o.slug}>
                <Link
                  to={`/collections/${o.slug}`}
                  className="inline-block rounded-full border border-teks-border bg-teks-surface px-5 py-2 font-semibold hover:border-teks-gold hover:text-teks-gold"
                >
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
