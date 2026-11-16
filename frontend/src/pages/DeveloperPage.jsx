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
import NotFound from './NotFound.jsx'

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

function ExtLink({ href, children }) {
  return (
    <a className="linkish" href={href} target="_blank" rel="noopener noreferrer">
      {children} <ExternalLink size={14} aria-hidden="true" style={{ display: 'inline' }} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
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
    return <NotFound title="Developer not found" message="We couldn't find that developer." documentTitle="Developer not found" />
  }
  if (query.isError) {
    return <div className="wrap section"><ErrorState message="Couldn't load this developer." onRetry={() => query.refetch()} /></div>
  }
  if (query.isPending) {
    return (
      <div className="wrap section" style={{ display: 'grid', gap: '1.5rem' }}>
        <BlockSkeleton />
        <BlockSkeleton style={{ minHeight: '16rem' }} />
      </div>
    )
  }

  const d = query.data
  return (
    <>
      <section className="page-head">
        <div className="wrap dev-head">
          <span className="avatar lg" role="img" aria-label={`${d.name} (no logo)`}>{initials(d.name)}</span>
          <div style={{ flex: 1, minWidth: '16rem' }}>
            <h1 style={{ fontSize: 'clamp(2rem,5vw,3.4rem)' }}>{d.name}</h1>
            <div className="meta-line">
              <DeveloperTypeBadge type={d.type} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem' }}>
                <MapPin size={16} aria-hidden="true" /> {d.location}
              </span>
            </div>
            <p style={{ color: 'var(--ink)' }}>{d.bio}</p>
            <div className="links">
              {d.website_url && <ExtLink href={d.website_url}>Website</ExtLink>}
              {d.facebook_url && <ExtLink href={d.facebook_url}>Facebook</ExtLink>}
            </div>
          </div>
        </div>
      </section>
      <section className="wrap section">
        <div className="head"><h2>Games by {d.name}</h2></div>
        {d.games.length ? <GameGrid games={d.games} /> : <EmptyState title="No games yet" message="This developer hasn't published a game yet." />}
      </section>
    </>
  )
}
