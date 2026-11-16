import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { COLLECTION_LINKS } from '../lib/content.js'
import { useCart } from '../context/useCart.js'

export default function Navbar() {
  const { count } = useCart()
  const { pathname } = useLocation()
  const [openPath, setOpenPath] = useState(null) // the menu is open only on the path it was opened on
  const open = openPath === pathname
  const dropRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !dropRef.current?.contains(e.target)) setOpenPath(null)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link to="/" className="logo" aria-label="TEKS home">
          <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
            <rect x="9" y="5" width="22" height="30" rx="4" fill="#E5322D" stroke="#0E1650" strokeWidth="3" transform="rotate(-12 20 20)" />
            <rect x="9" y="5" width="22" height="30" rx="4" fill="#FFCF1B" stroke="#0E1650" strokeWidth="3" transform="rotate(8 20 20)" />
            <circle cx="20" cy="18" r="5" fill="#0E1650" />
          </svg>
          <span>TEKS</span>
        </Link>
        <nav className="nav" aria-label="Main">
          <NavLink to="/store">Store</NavLink>
          <div className="nav-drop" ref={dropRef}>
            <button
              type="button"
              className="navbtn"
              aria-expanded={open}
              aria-haspopup="true"
              aria-controls="collections-menu"
              aria-current={pathname.startsWith('/collections/') ? 'true' : undefined}
              onClick={() => setOpenPath(open ? null : pathname)}
            >
              Collections
              <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1.5l5 5 5-5" />
              </svg>
            </button>
            {open && (
              <div className="menu" id="collections-menu">
                {COLLECTION_LINKS.map((c) => (
                  <NavLink key={c.slug} to={`/collections/${c.slug}`}>
                    {c.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/library">My Library</NavLink>
          <NavLink to="/sell">Sell a game</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <NavLink to="/cart" className="cart-link" aria-label={`Cart, ${count} ${count === 1 ? 'game' : 'games'}`}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4h3l2.4 11h10l2-8H7" />
            <circle cx="10" cy="20" r="1.4" />
            <circle cx="17" cy="20" r="1.4" />
          </svg>
          {count > 0 && <span className="count">{count}</span>}
        </NavLink>
      </div>
    </header>
  )
}
