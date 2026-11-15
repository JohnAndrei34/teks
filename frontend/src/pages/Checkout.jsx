import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createOrder, peso } from '../lib/api.js'
import { CART_NOTE, DEMO_BANNER, PAYMENT_METHODS } from '../lib/content.js'
import { useCart } from '../context/useCart.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import Field from '../components/FormField.jsx'
import { fieldProps, inputClass } from '../lib/formStyles.js'
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
    onSuccess: (order) => {
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold">Checkout</h1>
      <p role="note" className="mt-4 rounded-xl border-2 border-teks-gold bg-teks-gold/10 px-4 py-3 font-semibold text-teks-gold">
        {DEMO_BANNER}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={onSubmit} noValidate className="space-y-5 lg:order-1">
          <Field id="customer_name" label="Full name" error={errors.customer_name}>
            <input {...fieldProps('customer_name', errors)} value={form.customer_name} onChange={set('customer_name')} autoComplete="name" className={inputClass} />
          </Field>
          <Field id="email" label="Email" error={errors.email} hint="We'll send your order details here.">
            <input {...fieldProps('email', errors)} type="email" value={form.email} onChange={set('email')} autoComplete="email" className={inputClass} />
          </Field>
          <Field id="mobile" label="Mobile number" error={errors.mobile} hint="Format: 09XXXXXXXXX">
            <input {...fieldProps('mobile', errors)} type="tel" inputMode="numeric" value={form.mobile} onChange={set('mobile')} autoComplete="tel" placeholder="09XXXXXXXXX" className={inputClass} />
          </Field>

          <fieldset aria-describedby="payment_method-msg">
            <legend className="mb-2 text-sm font-semibold">Payment method</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-teks-gold ${
                    form.payment_method === m.value ? 'border-teks-gold bg-teks-surface-2' : 'border-teks-border bg-teks-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={m.value}
                    checked={form.payment_method === m.value}
                    onChange={set('payment_method')}
                    className="sr-only"
                  />
                  <span className="w-fit rounded bg-teks-bg px-2 py-0.5 font-display text-sm font-extrabold text-teks-gold">{m.badge}</span>
                  <span className="font-semibold">{m.label}</span>
                  <span className="text-xs text-teks-muted">{m.hint}</span>
                </label>
              ))}
            </div>
            <p id="payment_method-msg" className="mt-1 text-sm text-teks-primary-soft">{errors.payment_method}</p>
          </fieldset>

          {mutation.isError && (
            <p role="alert" className="rounded-lg border border-teks-primary bg-teks-primary/10 px-4 py-3 text-teks-primary-soft">
              {mutation.error.message}
            </p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-teks-primary px-5 py-3 font-semibold text-white hover:bg-teks-primary-soft disabled:opacity-70 sm:w-auto"
          >
            {mutation.isPending ? 'Processing payment…' : `Pay ${peso(total)} (demo)`}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-teks-border bg-teks-surface p-5 lg:order-2" aria-label="Order summary">
          <h2 className="font-display text-lg font-extrabold">Order summary</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span>{i.title}</span>
                <span>{peso(unitPrice(i))}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-teks-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-teks-muted">Subtotal</dt><dd>{peso(subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-teks-muted">Discount{promo ? ` (${promo.code})` : ''}</dt><dd>−{peso(discount)}</dd>
            </div>
            <div className="flex justify-between border-t border-teks-border pt-2 text-lg font-extrabold">
              <dt>Total</dt><dd className="text-teks-gold">{peso(total)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-teks-muted">{CART_NOTE}</p>
          <Link to="/cart" className="mt-2 inline-block text-sm text-teks-gold hover:underline">Edit cart</Link>
        </aside>
      </div>
    </div>
  )
}
