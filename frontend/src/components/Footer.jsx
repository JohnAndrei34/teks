import { Link } from 'react-router-dom'
import { BRAND, COLLECTION_LINKS, GENRES, SOCIALS } from '../lib/content.js'

function Column({ title, children }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-teks-gold">{title}</h2>
      <ul className="space-y-2 text-sm text-teks-muted">{children}</ul>
    </div>
  )
}

const L = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-teks-text">{children}</Link>
  </li>
)

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-teks-border bg-teks-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="font-display text-2xl font-extrabold text-teks-primary">
            TEKS<span className="text-teks-gold">.</span>
          </p>
          <p className="mt-2 text-sm text-teks-muted">{BRAND.tagline}</p>
          <ul className="mt-4 flex gap-4 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="text-teks-muted underline-offset-4 hover:text-teks-text hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Column title="Shop">
          <L to="/store">All games</L>
          {GENRES.map((g) => (
            <L key={g} to={`/store?genre=${g}`}>{g}</L>
          ))}
        </Column>
        <Column title="Collections">
          {COLLECTION_LINKS.map((c) => (
            <L key={c.slug} to={`/collections/${c.slug}`}>{c.title}</L>
          ))}
        </Column>
        <Column title="For Developers">
          <L to="/sell">Sell on TEKS</L>
          <L to="/contact">Developer inquiries</L>
        </Column>
        <Column title="TEKS">
          <L to="/about">About</L>
          <L to="/contact">Contact</L>
          <L to="/cart">Cart</L>
        </Column>
      </div>
      <p className="border-t border-teks-border py-4 text-center text-xs text-teks-muted">
        © {new Date().getFullYear()} TEKS. All rights reserved.
      </p>
    </footer>
  )
}
