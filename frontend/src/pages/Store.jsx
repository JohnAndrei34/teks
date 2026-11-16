import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getGames } from '../lib/api.js'
import { COLLECTION_LINKS, COLLECTION_TITLES, GENRES, PLATFORMS, SORTS, STORE_SUBTITLE } from '../lib/content.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameGrid from '../components/GameGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { GameGridSkeleton } from '../components/Skeletons.jsx'

const validInt = (v) => (/^\d+$/.test(v ?? '') ? v : '')

function Chips({ label, value, options, onPick, allLabel = 'All' }) {
  return (
    <div className="filter-row" role="group" aria-label={label}>
      <span className="lab">{label}</span>
      {[{ value: '', label: allLabel }, ...options].map((o) => (
        <button key={o.value} type="button" className="chip" aria-pressed={value === o.value} onClick={() => onPick(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function Store() {
  useDocumentTitle('Store')
  const [params, setParams] = useSearchParams()

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
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Store</h1>
          <p>{STORE_SUBTITLE}</p>
        </div>
      </section>
      <div className="wrap">
        <div className="filters">
          <div className="toolbar">
            <div className="field search">
              <label htmlFor="search">Search</label>
              <input id="search" type="search" placeholder="Title or developer" value={draft.q} onChange={(e) => onDraft('q', e.target.value)} />
            </div>
            <div className="field sort">
              <label htmlFor="sort">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => setParam('sort', e.target.value === 'featured' ? '' : e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Chips label="Genre" value={genre} options={GENRES.map((g) => ({ value: g, label: g }))} onPick={(v) => setParam('genre', v)} />
          <Chips label="Collection" value={collection} options={COLLECTION_LINKS.map((c) => ({ value: c.slug, label: c.title }))} onPick={(v) => setParam('collection', v)} />
          <Chips label="Platform" value={platform} options={PLATFORMS.map((p) => ({ value: p, label: p }))} onPick={(v) => setParam('platform', v)} />
          <div className="filter-row" role="group" aria-label="Price in pesos">
            <span className="lab">Price (₱)</span>
            <div className="price-range">
              <input className="input" aria-label="Minimum price in pesos" inputMode="numeric" placeholder="Min" value={draft.min_price} onChange={(e) => onDraft('min_price', e.target.value.replace(/\D/g, ''))} />
              <span aria-hidden="true">–</span>
              <input className="input" aria-label="Maximum price in pesos" inputMode="numeric" placeholder="Max" value={draft.max_price} onChange={(e) => onDraft('max_price', e.target.value.replace(/\D/g, ''))} />
            </div>
            {hasFilters && (
              <button type="button" className="linkish" onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        </div>

        <section aria-label="Results" aria-busy={query.isFetching}>
          {query.isPending ? (
            <GameGridSkeleton count={8} />
          ) : query.isError ? (
            <ErrorState message="Couldn't load games." onRetry={() => query.refetch()} />
          ) : (
            <>
              <p className="results-n" role="status">
                {query.data.length} {query.data.length === 1 ? 'game' : 'games'}
              </p>
              {query.data.length ? (
                <div style={query.isPlaceholderData ? { opacity: 0.6 } : undefined}>
                  <GameGrid games={query.data} />
                </div>
              ) : (
                <EmptyState
                  title="No games match"
                  message="Try a different word, or clear the filters to see everything."
                  action={hasFilters && <button type="button" className="btn" onClick={clearFilters}>Clear filters</button>}
                />
              )}
            </>
          )}
        </section>
        <div style={{ height: '4rem' }} />
      </div>
    </>
  )
}
