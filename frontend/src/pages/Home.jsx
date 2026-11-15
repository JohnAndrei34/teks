import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Gamepad2, HeartHandshake, MonitorSmartphone } from 'lucide-react'
import { getCollections, getConfig, getGames } from '../lib/api.js'
import { BRAND, GENRES, TEKS_STORY, WHY_TEKS } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import SectionHeader from '../components/SectionHeader.jsx'
import CollectionCard from '../components/CollectionCard.jsx'
import { GamesQueryGrid } from '../components/GameGrid.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { BlockSkeleton } from '../components/Skeletons.jsx'

const section = 'mx-auto max-w-7xl px-4 pt-14'

export default function Home() {
  useDocumentTitle('')
  const collections = useQuery({ queryKey: ['collections'], queryFn: getCollections })
  const featured = useQuery({ queryKey: ['games', { featured: true }], queryFn: () => getGames({ featured: true }) })
  const newest = useQuery({
    queryKey: ['games', { is_new: true, sort: 'newest' }],
    queryFn: () => getGames({ is_new: true, sort: 'newest' }),
  })
  const config = useQuery({ queryKey: ['config'], queryFn: getConfig })
  const fair = WHY_TEKS.fairShare(config.data?.developer_share_percent)

  return (
    <>
      <section className="sun-rays border-b border-teks-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teks-gold">{BRAND.full}</p>
          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">{BRAND.tagline}</h1>
          <p className="mt-4 max-w-2xl text-lg text-teks-muted">{BRAND.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/store" className="rounded-lg bg-teks-primary px-6 py-3 font-semibold text-white hover:bg-teks-primary-soft">
              Browse Games
            </Link>
            <Link to="/sell" className="rounded-lg border border-teks-gold px-6 py-3 font-semibold text-teks-gold hover:bg-teks-gold hover:text-teks-bg">
              Sell on TEKS
            </Link>
          </div>
        </div>
      </section>

      <section className={section} aria-labelledby="what-is-teks">
        <div className="rounded-2xl border border-dashed border-teks-gold/60 bg-teks-surface p-6 sm:p-8">
          <h2 id="what-is-teks" className="font-display text-2xl font-extrabold">What is TEKS?</h2>
          <p className="mt-2 max-w-3xl text-teks-muted">{TEKS_STORY}</p>
        </div>
      </section>

      <section className={section}>
        <SectionHeader title="Pinoy Collections" subtitle="Games rooted in Filipino stories and traditions." as="h2" />
        {collections.isPending ? (
          <BlockSkeleton className="h-56" />
        ) : collections.isError ? (
          <ErrorState message="Couldn't load collections." onRetry={() => collections.refetch()} />
        ) : (
          <ul className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {collections.data.map((c) => (
              <li key={c.slug}>
                <CollectionCard collection={c} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={section}>
        <SectionHeader title="Featured" to="/store?sort=featured" />
        <GamesQueryGrid query={featured} emptyTitle="No featured games yet" skeletonCount={3} />
      </section>

      <section className={section}>
        <SectionHeader title="New Releases" to="/store?sort=newest" />
        <GamesQueryGrid query={newest} emptyTitle="No new releases yet" skeletonCount={3} />
      </section>

      <section className={section}>
        <SectionHeader title="Browse by Genre" />
        <ul className="flex flex-wrap gap-3">
          {GENRES.map((g) => (
            <li key={g}>
              <Link
                to={`/store?genre=${g}`}
                className="inline-block rounded-full border border-teks-border bg-teks-surface px-5 py-2 font-semibold hover:border-teks-gold hover:text-teks-gold"
              >
                {g}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={section} aria-labelledby="why-teks">
        <h2 id="why-teks" className="mb-5 font-display text-2xl font-extrabold sm:text-3xl">Why TEKS</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Gamepad2, ...WHY_TEKS.home },
            { icon: HeartHandshake, ...fair },
            { icon: MonitorSmartphone, ...WHY_TEKS.platforms },
          ].map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-2xl border border-teks-border bg-teks-surface p-5">
              <Icon className="mb-3 text-teks-gold" aria-hidden="true" />
              <h3 className="font-display font-extrabold">{title}</h3>
              <p className="mt-1 text-sm text-teks-muted">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${section} pb-2`}>
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-gradient-to-r from-teks-primary to-teks-gold p-8 text-teks-bg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold">Make games? Sell them on TEKS.</h2>
            <p className="mt-1 max-w-xl font-medium">
              Student teams, indie devs and studios are welcome. Share your Filipino story with players.
            </p>
          </div>
          <Link to="/sell" className="shrink-0 rounded-lg bg-teks-bg px-6 py-3 font-semibold text-teks-text hover:bg-teks-dark">
            Sell on TEKS
          </Link>
        </div>
      </section>
    </>
  )
}
