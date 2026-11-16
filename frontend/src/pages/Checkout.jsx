import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createOrder, peso } from '../lib/api.js'
import { CART_NOTE, DEMO_BANNER, PAYMENT_METHODS } from '../lib/content.js'
import { useCart } from '../context/useCart.js'
import { addToLibrary } from '../lib/library.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import Field from '../components/FormField.jsx'
import { fieldProps } from '../lib/formStyles.js'
import { cartTotals, unitPrice } from '../lib/cart.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE = /^(09\d{9}|\+639\d{9})$/

function validate(f) {
  const e = {}
  if (f.customer_name.trim().length < 2) e.customer_name = 'Enter your full name.'
  if (!EMAIL.test(f.email.trim())) e.email = 'Enter a valid email address.'
  if (!MOBILE.test(f.mobile.trim())) e.mobile = 'Use the format 09XXXXXXXXX.'
  if (!f.payment_method) e.payment_method = 'Choose a payment method.'
  return e
}

export default function Checkout() {
  useDocumentTitle('Checkout')
  const navigate = useNavigate()
  const { items, promo, clearCart } = useCart()
  const [form, setForm] = useState({ customer_name: '', email: '', mobile: '', payment_method: '' })
  const [errors, setErrors] = useState({})
  const { subtotal, discount, total } = cartTotals(items, promo)

  const mutation = useMutation({
    mutationFn: async (body) => {
      // Brief demo delay so the "processing" state is visible.
      const [order] = await Promise.all([createOrder(body), sleep(1500)])
      return order
    },
    onSuccess: (order, body) => {
      addToLibrary(body.game_ids) // the games now show up in My Library on this browser
      navigate(`/order/${order.code}`)
      clearCart()
    },
  })

  if (!items.length && !mutation.isSuccess) return <Navigate to="/cart" replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }
    mutation.mutate({
      customer_name: form.customer_name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      payment_method: form.payment_method,
      promo_code: promo?.code ?? null,
      game_ids: items.map((i) => i.id),
    })
  }

  return (
    <div className="wrap cart">
      <div>
        <h1>Checkout</h1>
        <p role="note" className="note" style={{ marginTop: '-.6rem', marginBottom: '1.5rem' }}>{DEMO_BANNER}</p>
        <form className="box form" onSubmit={onSubmit} noValidate>
          <Field id="customer_name" label="Full name" error={errors.customer_name}>
            <input {...fieldProps('customer_name', errors)} value={form.customer_name} onChange={set('customer_name')} autoComplete="name" />
          </Field>
          <div className="pair">
            <Field id="email" label="Email" error={errors.email} hint="We'll send your order details here.">
              <input {...fieldProps('email', errors)} type="email" value={form.email} onChange={set('email')} autoComplete="email" />
            </Field>
            <Field id="mobile" label="Mobile number" error={errors.mobile} hint="Format: 09XXXXXXXXX">
              <input {...fieldProps('mobile', errors)} type="tel" inputMode="numeric" value={form.mobile} onChange={set('mobile')} autoComplete="tel" placeholder="09XXXXXXXXX" />
            </Field>
          </div>

          <div>
            <fieldset className="pays" aria-describedby="payment_method-msg">
              <legend>Payment method</legend>
              {PAYMENT_METHODS.map((m) => (
                <label key={m.value} className="pay">
                  <input
                    type="radio"
                    name="payment_method"
                    id={m.value === PAYMENT_METHODS[0].value ? 'payment_method' : undefined}
                    value={m.value}
                    checked={form.payment_method === m.value}
                    onChange={set('payment_method')}
                    className="sr-only"
                  />
                  <span className="badge">{m.badge}</span>
                  <span className="lab">{m.label}</span>
                  <small>{m.hint}</small>
                </label>
              ))}
            </fieldset>
            <p id="payment_method-msg" className="err">{errors.payment_method}</p>
          </div>

          {mutation.isError && <p role="alert" className="err">{mutation.error.message}</p>}
          <button type="submit" className="btn red" disabled={mutation.isPending} style={{ justifySelf: 'start' }}>
            {mutation.isPending ? 'Processing payment…' : `Pay ${peso(total)} (demo)`}
          </button>
        </form>
      </div>

      <aside className="sum" aria-label="Order summary">
        <h2>Order summary</h2>
        {items.map((i) => (
          <div key={i.id} className="row">
            <span>{i.title}</span>
            <span>{peso(unitPrice(i))}</span>
          </div>
        ))}
        <div className="row" style={{ marginTop: '.8rem' }}><span>Subtotal</span><span>{peso(subtotal)}</span></div>
        <div className="row"><span>Discount{promo ? ` (${promo.code})` : ''}</span><span>−{peso(discount)}</span></div>
        <div className="row total"><span>Total</span><span>{peso(total)}</span></div>
        <p><small>{CART_NOTE}</small></p>
        <Link className="linkish" to="/cart">Edit cart</Link>
      </aside>
    </div>
  )
}
