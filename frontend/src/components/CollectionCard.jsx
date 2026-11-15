import { Link } from 'react-router-dom'
import GameCover from './GameCover.jsx'

export default function CollectionCard({ collection }) {
  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-teks-border bg-teks-surface transition duration-200 hover:-translate-y-1 hover:rotate-1 hover:border-teks-gold"
    >
      <GameCover
        src={collection.cover_image}
        title={collection.title}
        alt={`${collection.title} collection cover`}
        className="aspect-[16/9] w-full"
      />
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-lg font-extrabold">{collection.title}</h3>
        <p className="text-sm text-teks-muted">{collection.tagline}</p>
        <p className="mt-auto pt-2 text-xs font-semibold text-teks-gold">
          {collection.game_count} {collection.game_count === 1 ? 'game' : 'games'} →
        </p>
      </div>
    </Link>
  )
}
