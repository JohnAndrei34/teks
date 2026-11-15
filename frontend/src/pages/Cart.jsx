import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { checkPromo, peso } from '../lib/api.js'
import { CART_NOTE } from '../lib/content.js'
import { cartTotals, unitPrice } from '../lib/cart.js'
import { useCart } from '../context/useCart.js'
import { useToast } from '../context/useToast.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameCover from '../components/GameCover.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { inputClass } from '../lib/formStyles.js'

export default function Cart() {
  useDocumentTitle('Cart')
  const { items, removeFromCart, promo, setPromo } = useCart()
  const { toast } = useToast()
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
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="mb-6 font-display text-3xl font-extrabold">Your cart</h1>
        <EmptyState
          title="Your cart is empty"
          message="Find a Filipino game you'd like to collect."
          action={
            <Link to="/store" className="rounded-lg bg-teks-primary px-5 py-2.5 font-semibold text-white hover:bg-teks-primary-soft">
              Browse the store
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold">Your cart</h1>
      <p className="mt-1 text-teks-muted">{CART_NOTE}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.id} className="flex gap-3 rounded-2xl border border-teks-border bg-teks-surface p-3">
              <Link to={`/game/${i.slug}`} className="shrink-0">
                <GameCover src={i.cover_image} title={i.title} className="h-20 w-28 rounded-lg" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/game/${i.slug}`} className="font-display font-extrabold hover:text-teks-gold">
                  {i.title}
                </Link>
                <p className="text-sm text-teks-muted">{i.developer}</p>
                <p className="mt-1 font-semibold">
                  {unitPrice(i) < i.price && <s className="mr-2 text-sm font-normal text-teks-muted">{peso(i.price)}</s>}
                  {peso(unitPrice(i))}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  removeFromCart(i.id)
                  toast(`${i.title} removed`)
                }}
                aria-label={`Remove ${i.title} from cart`}
                className="self-start rounded-lg p-2 text-teks-muted hover:text-teks-primary-soft"
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-teks-border bg-teks-surface p-5" aria-label="Order summary">
          <form onSubmit={applyPromo}>
            <label htmlFor="promo" className="mb-1 block text-sm font-semibold">Promo code</label>
            <div className="flex gap-2">
              <input
                id="promo"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={inputClass}
                autoComplete="off"
                aria-describedby="promo-msg"
              />
              <button
                type="submit"
                disabled={checking}
                className="rounded-lg border border-teks-gold px-4 font-semibold text-teks-gold hover:bg-teks-gold hover:text-teks-bg disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            <p id="promo-msg" role="status" className={`mt-1 text-sm ${promoMsg ? 'text-teks-primary-soft' : 'text-teks-teal'}`}>
              {promoMsg ?? (promo ? `${promo.code} applied: ${promo.percent}% off` : '')}
            </p>
            {promo && (
              <button type="button" onClick={() => setPromo(null)} className="text-sm text-teks-muted underline">
                Remove code
              </button>
            )}
          </form>

          <dl className="mt-4 space-y-2 border-t border-teks-border pt-4">
            <div className="flex justify-between"><dt className="text-teks-muted">Subtotal</dt><dd>{peso(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-teks-muted">Discount</dt><dd>−{peso(discount)}</dd></div>
            <div className="flex justify-between border-t border-teks-border pt-2 text-lg font-extrabold">
              <dt>Total</dt><dd className="text-teks-gold">{peso(total)}</dd>
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-5 block rounded-lg bg-teks-primary px-5 py-3 text-center font-semibold text-white hover:bg-teks-primary-soft"
          >
            Continue to checkout
          </Link>
        </aside>
      </div>
    </div>
  )
}
