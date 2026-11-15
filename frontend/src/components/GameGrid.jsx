import GameCard from './GameCard.jsx'
import EmptyState from './EmptyState.jsx'
import ErrorState from './ErrorState.jsx'
import { GameGridSkeleton } from './Skeletons.jsx'

export default function GameGrid({ games }) {
  return (
    <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {games.map((g) => (
        <li key={g.id}>
          <GameCard game={g} />
        </li>
      ))}
    </ul>
  )
}

// Handles loading / error / empty / data for any useQuery result that returns a game list.
export function GamesQueryGrid({ query, emptyTitle, emptyMessage, skeletonCount = 4, limit }) {
  if (query.isPending) return <GameGridSkeleton count={skeletonCount} />
  if (query.isError) return <ErrorState message="Couldn't load games." onRetry={() => query.refetch()} />
  const games = limit ? query.data.slice(0, limit) : query.data
  if (!games.length) return <EmptyState title={emptyTitle} message={emptyMessage} />
  return <GameGrid games={games} />
}
