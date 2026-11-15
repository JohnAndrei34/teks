import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, MapPin } from 'lucide-react'
import { getDeveloper } from '../lib/api.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import DeveloperTypeBadge from '../components/DeveloperTypeBadge.jsx'
import GameGrid from '../components/GameGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { BlockSkeleton } from '../components/Skeletons.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import NotFound from './NotFound.jsx'

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

function Avatar({ dev }) {
  const [failed, setFailed] = useState(false)
  if (dev.logo_image && !failed) {
    return (
      <img
        src={dev.logo_image}
        alt={`${dev.name} logo`}
        onError={() => setFailed(true)}
        className="h-24 w-24 rounded-2xl border border-teks-border object-cover"
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={`${dev.name} (no logo)`}
      className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-teks-primary to-teks-gold font-display text-3xl font-extrabold text-white"
    >
      {initials(dev.name)}
    </div>
  )
}

export default function DeveloperPage() {
  const { slug } = useParams()
  const query = useQuery({
    queryKey: ['developer', slug],
    queryFn: () => getDeveloper(slug),
    retry: (count, err) => err.status !== 404 && count < 1,
  })
  useDocumentTitle(query.data?.name ?? 'Developer')

  if (query.error?.status === 404) {
    return (
      <NotFound
        title="Developer not found"
        message="We couldn't find that developer."
        documentTitle="Developer not found"
      />
    )
  }
  if (query.isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message="Couldn't load this developer." onRetry={() => query.refetch()} />
      </div>
    )
  }
  if (query.isPending) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-10">
        <BlockSkeleton className="h-32" />
        <BlockSkeleton className="h-64" />
      </div>
    )
  }

  const d = query.data
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar dev={d} />
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{d.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-teks-muted">
            <DeveloperTypeBadge type={d.type} />
            <span className="flex items-center gap-1">
              <MapPin size={14} aria-hidden="true" /> {d.location}
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-teks-muted">{d.bio}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
            {d.website_url && (
              <a href={d.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teks-gold hover:underline">
                Website <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            {d.facebook_url && (
              <a href={d.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teks-gold hover:underline">
                Facebook <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="mt-12">
        <SectionHeader title={`Games by ${d.name}`} />
        {d.games.length ? <GameGrid games={d.games} /> : <EmptyState title="No games yet" message="This developer hasn't published a game yet." />}
      </section>
    </div>
  )
}
