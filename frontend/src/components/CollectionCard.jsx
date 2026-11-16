import { Link } from 'react-router-dom'

// Her four "Pick a collection" panels: red, blue, green, pink in that order.
const COLORS = { folklore: '', 'traditional-games': 'blue', history: 'green', 'everyday-life': 'pink' }

export default function CollectionCard({ collection }) {
  const n = collection.game_count
  return (
    <Link to={`/collections/${collection.slug}`} className={`panel ${COLORS[collection.slug] ?? ''}`}>
      <h3>{collection.title}</h3>
      <p>{collection.tagline}</p>
      <span className="n">
        {n} {n === 1 ? 'game' : 'games'}
      </span>
    </Link>
  )
}
