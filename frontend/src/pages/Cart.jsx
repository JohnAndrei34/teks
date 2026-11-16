import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { checkPromo, getConfig, peso, pesoExact } from '../lib/api.js'
import { CART_NOTE } from '../lib/content.js'
import { cartTotals, unitPrice } from '../lib/cart.js'
import { useCart } from '../context/useCart.js'
import { useToast } from '../context/useToast.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameCover from '../components/GameCover.jsx'

export default function Cart() {
  useDocumentTitle('Cart')
  const { items, removeFromCart, promo, setPromo } = useCart()
  const { toast } = useToast()
  const config = useQuery({ queryKey: ['config'], queryFn: getConfig })
  const share = config.data?.developer_share_percent
  const [code, setCode] = useState('')
  const [promoMsg, setPromoMsg] = useState(null)
  const [checking, setChecking] = useState(false)
  const { subtotal, discount, total } = cartTotals(items, promo)

  const applyPromo = async (e) => {
    e.preventDefault()
    const value = code.trim().toUpperCase()
    if (!value) return
    setChecking(true)
    try {
      const res = await checkPromo(value)
      if (res.valid) {
        setPromo({ code: value, percent: res.percent })
        setPromoMsg(null)
        setCode('')
      } else {
        setPromoMsg('Invalid code')
      }
    } catch {
      setPromoMsg("Couldn't check the code. Try again.")
    } finally {
      setChecking(false)
    }
  }

  if (!items.length) {
    return (
      <div className="wrap section">
        <div className="empty">
          <h1 style={{ fontSize: '2rem' }}>Your cart is empty</h1>
          <p>Add a game from the store and it will show up here.</p>
          <Link className="btn" to="/store">Browse the store</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wrap cart">
      <div>
        <h1>Cart</h1>
        <p className="split" style={{ marginTop: '-1rem', marginBottom: '1.2rem' }}>{CART_NOTE}</p>
        <ul className="lines">
          {items.map((i) => (
            <li key={i.id} className="line">
              <Link className="thumb" to={`/game/${i.slug}`} aria-label={i.title}>
                <GameCover game={i} decorative />
              </Link>
              <div>
                <h3><Link to={`/game/${i.slug}`}>{i.title}</Link></h3>
                <p>{i.developer}</p>
                <button
                  type="button"
                  className="linkish"
                  onClick={() => {
                    removeFromCart(i.id)
                    toast(`${i.title} removed`)
                  }}
                >
                  Remove<span className="sr-only"> {i.title}</span>
                </button>
              </div>
              <span className="price">
                {unitPrice(i) < i.price && <s>{peso(i.price)}</s>}
                {peso(unitPrice(i))}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <aside className="sum" aria-label="Order summary">
        <h2>Summary</h2>
        <form className="promo-form" onSubmit={applyPromo}>
          <div className="field">
            <label htmlFor="promo">Promo code</label>
            <div className="promo-row">
              <input id="promo" className="input" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" aria-describedby="promo-msg" />
              <button type="submit" className="btn small" disabled={checking}>Apply</button>
            </div>
            <p id="promo-msg" role="status" className={promoMsg ? 'err' : 'hint'} style={promoMsg || promo ? undefined : { display: 'none' }}>
              {promoMsg ?? (promo ? `${promo.code} applied: ${promo.percent}% off` : '')}
            </p>
            {promo && (
              <button type="button" className="linkish" onClick={() => setPromo(null)} style={{ justifySelf: 'start' }}>
                Remove code
              </button>
            )}
          </div>
        </form>
        <div className="row"><span>{items.length} {items.length === 1 ? 'game' : 'games'}</span><span>{peso(subtotal)}</span></div>
        {discount > 0 && <div className="row"><span>Discount{promo ? ` (${promo.code})` : ''}</span><span>−{peso(discount)}</span></div>}
        {share != null && <div className="row"><span>Goes to developers</span><span>{pesoExact(Math.round(total * share) / 100)}</span></div>}
        <div className="row total"><span>Total</span><span>{peso(total)}</span></div>
        <Link className="btn red" to="/checkout" style={{ width: '100%', marginTop: '1rem' }}>Continue to checkout</Link>
      </aside>
    </div>
  )
}
