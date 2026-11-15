import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, ShoppingCart, X } from 'lucide-react'
import { COLLECTION_LINKS } from '../lib/content.js'
import { useCart } from '../context/useCart.js'

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-teks-surface-2 text-teks-gold' : 'text-teks-text hover:text-teks-gold'
  }`

export default function Navbar() {
  const { count } = useCart()
  const location = useLocation()
  const [openPath, setOpenPath] = useState(null) // menu is open only for the path it was opened on
  const [dropPath, setDropPath] = useState(null)
  const open = openPath === location.pathname
  const dropOpen = dropPath === location.pathname
  const dropRef = useRef(null)

  useEffect(() => {
    if (!dropOpen) return undefined
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !dropRef.current?.contains(e.target)) {
        setDropPath(null)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [dropOpen])

  const collectionsLinks = COLLECTION_LINKS.map((c) => (
    <NavLink key={c.slug} to={`/collections/${c.slug}`} className={linkClass}>
      {c.title}
    </NavLink>
  ))

  return (
    <header className="sticky top-0 z-50 border-b border-teks-border bg-teks-bg/95 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-2 font-display text-2xl font-extrabold tracking-tight text-teks-primary">
          TEKS<span className="text-teks-gold">.</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/store" className={linkClass}>Store</NavLink>
          <div className="relative" ref={dropRef}>
            <button
              type="button"
              aria-expanded={dropOpen}
              aria-haspopup="true"
              onClick={() => setDropPath(dropOpen ? null : location.pathname)}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-teks-text hover:text-teks-gold"
            >
              Collections <ChevronDown size={16} aria-hidden="true" />
            </button>
            {dropOpen && (
              <div className="absolute left-0 top-full mt-1 flex w-52 flex-col rounded-xl border border-teks-border bg-teks-surface p-2 shadow-xl">
                {collectionsLinks}
              </div>
            )}
          </div>
          <NavLink to="/sell" className={linkClass}>Sell on TEKS</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/cart"
            aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
            className="relative rounded-lg p-2 text-teks-text hover:text-teks-gold"
          >
            <ShoppingCart aria-hidden="true" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-teks-primary px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-teks-text lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenPath(open ? null : location.pathname)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-teks-border bg-teks-surface px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/store" className={linkClass}>Store</NavLink>
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-teks-muted">Collections</p>
            <div className="flex flex-col gap-1 pl-3">{collectionsLinks}</div>
            <NavLink to="/sell" className={linkClass}>Sell on TEKS</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
