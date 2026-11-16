import { useQuery } from '@tanstack/react-query'
import { getGames } from './api.js'

// The whole catalog (12 games) in card-number order, as Dea's original lists it.
// Shared by Home, Library and the order page.
const byCardNo = (games) => [...games].sort((a, b) => (a.card_no ?? a.id) - (b.card_no ?? b.id))

export const useAllGames = () =>
  useQuery({ queryKey: ['games', { all: true }], queryFn: () => getGames({ sort: 'newest' }), select: byCardNo })
