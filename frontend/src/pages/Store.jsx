import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import { getGames } from '../lib/api.js'
import { COLLECTION_LINKS, COLLECTION_TITLES, GENRES, PLATFORMS, SORTS } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameGrid from '../components/GameGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { GameGridSkeleton } from '../components/Skeletons.jsx'

const field =
  'w-full rounded-lg border border-teks-border bg-teks-surface px-3 py-2 text-sm placeholder:text-teks-muted'
const label = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-teks-muted'

const validInt = (v) => (/^\d+$/.test(v ?? '') ? v : '')

export default function Store() {
  useDocumentTitle('Store')
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const genre = GENRES.includes(params.get('genre')) ? params.get('genre') : ''
  const collection = params.get('collection') in COLLECTION_TITLES ? params.get('collection') : ''
  const platform = PLATFORMS.includes(params.get('platform')) ? params.get('platform') : ''
  const sort = SORTS.some((s) => s.value === params.get('sort')) ? params.get('sort') : 'featured'
  const q = params.get('q') ?? ''
  const minPrice = validInt(params.get('min_price'))
  const maxPrice = validInt(params.get('max_price'))

  // Text inputs keep a local draft and write to the URL after a short pause.
  const [draft, setDraft] = useState({ q, min_price: minPrice, max_price: maxPrice })
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const setParam = (key, value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )

  const onDraft = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }))
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setParam(key, value.trim()), 400)
  }

  const clearFilters = () => {
    clearTimeout(timer.current)
    setDraft({ q: '', min_price: '', max_price: '' })
    setParams({}, { replace: true })
  }

  const filters = { genre, collection, platform, q, min_price: minPrice, max_price: maxPrice, sort }
  const hasFilters = Boolean(genre || collection || platform || q || minPrice || maxPrice || sort !== 'featured')
  const query = useQuery({
    queryKey: ['games', filters],
    queryFn: () => getGames(filters),
    placeholderData: keepPreviousData,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Store</h1>
      <p className="mt-1 text-teks-muted">Games by Filipino developers, for PC and mobile.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-[16rem_1fr]">
        <aside aria-label="Filters">
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg border border-teks-border bg-teks-surface px-4 py-2.5 font-semibold md:hidden"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={18} aria-hidden="true" /> Filters
            </span>
            <span className="text-sm text-teks-muted">{filtersOpen ? 'Hide' : 'Show'}</span>
          </button>

          <div id="filter-panel" className={`${filtersOpen ? 'block' : 'hidden'} mt-3 space-y-4 md:mt-0 md:block`}>
            <div>
              <label htmlFor="search" className={label}>Search</label>
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-teks-muted" aria-hidden="true" />
                <input
                  id="search"
                  type="search"
                  value={draft.q}
                  onChange={(e) => onDraft('q', e.target.value)}
                  placeholder="Title or developer"
                  className={`${field} pl-9`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="genre" className={label}>Genre</label>
              <select id="genre" value={genre} onChange={(e) => setParam('genre', e.target.value)} className={field}>
                <option value="">All genres</option>
                {GENRES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="collection" className={label}>Collection</label>
              <select id="collection" value={collection} onChange={(e) => setParam('collection', e.target.value)} className={field}>
                <option value="">All collections</option>
                {COLLECTION_LINKS.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="platform" className={label}>Platform</label>
              <select id="platform" value={platform} onChange={(e) => setParam('platform', e.target.value)} className={field}>
                <option value="">PC & Mobile</option>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <fieldset>
              <legend className={label}>Price (₱)</legend>
              <div className="flex items-center gap-2">
                <input
                  aria-label="Minimum price in pesos"
                  inputMode="numeric"
                  placeholder="Min"
                  value={draft.min_price}
                  onChange={(e) => onDraft('min_price', e.target.value.replace(/\D/g, ''))}
                  className={field}
                />
                <span aria-hidden="true">–</span>
                <input
                  aria-label="Maximum price in pesos"
                  inputMode="numeric"
                  placeholder="Max"
                  value={draft.max_price}
                  onChange={(e) => onDraft('max_price', e.target.value.replace(/\D/g, ''))}
                  className={field}
                />
              </div>
            </fieldset>
            <div>
              <label htmlFor="sort" className={label}>Sort by</label>
              <select id="sort" value={sort} onChange={(e) => setParam('sort', e.target.value === 'featured' ? '' : e.target.value)} className={field}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="text-sm font-semibold text-teks-gold hover:underline">
                Clear filters
              </button>
            )}
          </div>
        </aside>

        <section aria-label="Results" aria-busy={query.isFetching}>
          {query.isPending ? (
            <GameGridSkeleton count={8} />
          ) : query.isError ? (
            <ErrorState message="Couldn't load games." onRetry={() => query.refetch()} />
          ) : (
            <>
              <p className="mb-4 text-sm text-teks-muted" role="status">
                {query.data.length} {query.data.length === 1 ? 'game' : 'games'}
              </p>
              {query.data.length ? (
                <div className={query.isPlaceholderData ? 'opacity-60 transition-opacity' : ''}>
                  <GameGrid games={query.data} />
                </div>
              ) : (
                <EmptyState
                  title="No games match your filters"
                  message="Try a different search or remove some filters."
                  action={
                    hasFilters && (
                      <button type="button" onClick={clearFilters} className="rounded-lg bg-teks-primary px-4 py-2 text-sm font-semibold text-white">
                        Clear filters
                      </button>
                    )
                  }
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
