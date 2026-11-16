import { Link } from 'react-router-dom'
import { COLLECTION_LINKS, GENRES, SOCIALS } from '../lib/content.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div>
          <strong className="foot-logo">TEKS</strong>
          <p>Tech, Entertainment &amp; Kreative Stories. An online marketplace for games made by Filipino developers.</p>
          <ul className="socials" aria-label="Social links">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href}>{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Shop</h2>
          <ul>
            <li><Link to="/store">All games</Link></li>
            {GENRES.map((g) => (
              <li key={g}><Link to={`/store?genre=${g}`}>{g}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Collections</h2>
          <ul>
            {COLLECTION_LINKS.map((c) => (
              <li key={c.slug}><Link to={`/collections/${c.slug}`}>{c.title}</Link></li>
            ))}
            <li><Link to="/library">My Library</Link></li>
          </ul>
        </div>
        <div>
          <h2>TEKS</h2>
          <ul>
            <li><Link to="/sell">Sell your game</Link></li>
            <li><Link to="/about">Why TEKS</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>
        <p className="demo-note">
          Demo build. Games, studios and prices are sample data, and checkout takes no payment. Design by Andrea Salvanera (Dea).
        </p>
      </div>
    </footer>
  )
}
