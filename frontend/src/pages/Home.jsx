import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCollections, getConfig } from '../lib/api.js'
import { GENRES, TEKS_STORY } from '../lib/content.js'
import { useAllGames } from '../lib/useAllGames.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import CollectionCard from '../components/CollectionCard.jsx'
import GameCover from '../components/GameCover.jsx'
import HeroFan from '../components/HeroFan.jsx'
import { GamesQueryGrid } from '../components/GameGrid.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { BlockSkeleton } from '../components/Skeletons.jsx'

// The fan shows the featured games, topped up to four with Maiba-Taya (as in Dea's original), then the next games.
const heroGames = (games) => {
  const picked = games.filter((g) => g.featured)
  for (const g of [...games.filter((x) => x.slug === 'maiba-taya'), ...games]) {
    if (picked.length >= 4) break
    if (!picked.includes(g)) picked.push(g)
  }
  return picked.sort((a, b) => (a.card_no ?? a.id) - (b.card_no ?? b.id)).slice(0, 4)
}

export default function Home() {
  useDocumentTitle('')
  const all = useAllGames()
  const collections = useQuery({ queryKey: ['collections'], queryFn: getCollections })
  const config = useQuery({ queryKey: ['config'], queryFn: getConfig })
  const share = config.data?.developer_share_percent
  const shareText = share ? `${share}%` : 'a fair share'
  const games = all.data
  const stack = games ? ['aswang-hours', 'maiba-taya', 'sigaw-ng-bayan'].map((s) => games.find((g) => g.slug === s)).filter(Boolean) : []

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>Collect Filipino stories. Then play them.</h1>
            <p className="lead">
              TEKS is one store for games made by Filipino developers. Meet the aswang, outrun the taya, and run your own
              sari-sari store, all in one place.
            </p>
            <div className="actions">
              <Link className="btn" to="/store">Browse the store</Link>
              <Link className="btn alt" to="/sell">Sell your game</Link>
            </div>
          </div>
          {games ? <HeroFan games={heroGames(games)} /> : <div className="fan" aria-hidden="true" />}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head">
            <div>
              <h2>New in the store</h2>
              <p>Eight games to start your collection.</p>
            </div>
            <Link className="btn alt small" to="/store">
              See all {games ? `${games.length} ` : ''}games
            </Link>
          </div>
          <GamesQueryGrid query={all} emptyTitle="No games yet" skeletonCount={8} limit={8} />
          <div className="filter-row" style={{ marginTop: '2rem' }}>
            <span className="lab">Browse by genre</span>
            {GENRES.map((g) => (
              <Link key={g} className="chip" to={`/store?genre=${g}`}>{g}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head">
            <div>
              <h2>Pick a collection</h2>
              <p>Every game here is Filipino-made. These four shelves show what it draws from.</p>
            </div>
          </div>
          {collections.isPending ? (
            <BlockSkeleton style={{ minHeight: '14rem' }} />
          ) : collections.isError ? (
            <ErrorState message="Couldn't load collections." onRetry={() => collections.refetch()} />
          ) : (
            <div className="panels">
              {collections.data.map((c) => (
                <CollectionCard key={c.slug} collection={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="band">
        <div className="wrap section">
          <div>
            <h2>Why a store of our own</h2>
            <p>
              Filipino games are scattered across global stores and social pages, buried under thousands of new releases
              every year. TEKS puts them on one shelf, so players can find them and developers can sell them directly.
            </p>
            <p>{TEKS_STORY}</p>
            <p>Developers keep {shareText} of every sale.</p>
            <Link className="btn yellow" to="/about">Read the story behind the name</Link>
          </div>
          <div className="stack" aria-hidden="true">
            {stack.map((g, i) => (
              <div
                key={g.id}
                className="mini"
                style={{ transform: `translate(calc(-50% + ${(i - 1) * 78}px), -50%) rotate(${(i - 1) * 9}deg)`, zIndex: i === 1 ? 3 : 1 }}
              >
                <GameCover game={g} decorative />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap two">
          <div className="box">
            <h2>For players</h2>
            <ol className="steps">
              <li>Browse by genre or collection.</li>
              <li>Buy the games you want. Each one becomes a card.</li>
              <li>Open your library and play.</li>
            </ol>
            <Link className="btn" to="/store">Start collecting</Link>
          </div>
          <div className="box dark">
            <h2>For developers</h2>
            <ol className="steps">
              <li>Send us your game and a short pitch.</li>
              <li>We review it and get back to you.</li>
              <li>Players buy it, and you keep {shareText} of each sale.</li>
            </ol>
            <Link className="btn yellow" to="/sell">Submit a game</Link>
          </div>
        </div>
      </section>
    </>
  )
}
