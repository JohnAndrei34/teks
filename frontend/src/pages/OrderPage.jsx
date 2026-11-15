import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Copy, Download } from 'lucide-react'
import { getConfig, getOrder, peso } from '../lib/api.js'
import { PAYMENT_LABELS } from '../lib/content.js'
import { useToast } from '../context/useToast.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import ErrorState from '../components/ErrorState.jsx'
import { BlockSkeleton } from '../components/Skeletons.jsx'
import NotFound from './NotFound.jsx'

export default function OrderPage() {
  const { code } = useParams()
  const { toast } = useToast()
  const query = useQuery({
    queryKey: ['order', code],
    queryFn: () => getOrder(code),
    retry: (count, err) => err.status !== 404 && count < 1,
  })
  const config = useQuery({ queryKey: ['config'], queryFn: getConfig })
  useDocumentTitle(query.data ? `Order ${query.data.code}` : 'Order')

  if (query.error?.status === 404) {
    return <NotFound title="Order not found" message="We couldn't find an order with that code. Check the code and try again." documentTitle="Order not found" />
  }
  if (query.isError) {
    return <div className="mx-auto max-w-2xl px-4 py-16"><ErrorState message="Couldn't load this order." onRetry={() => query.refetch()} /></div>
  }
  if (query.isPending) {
    return <div className="mx-auto max-w-3xl space-y-4 px-4 py-10"><BlockSkeleton className="h-32" /><BlockSkeleton className="h-64" /></div>
  }

  const o = query.data
  const share = config.data?.developer_share_percent
  const toDevs = share ? Math.floor((o.total * share) / 100) : null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(o.code)
      toast('Order code copied')
    } catch {
      toast('Copy failed. Select the code and copy it manually.')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Salamat, {o.customer_name.split(' ')[0]}!</h1>
        <p className="mt-2 text-teks-muted">Your order is confirmed (demo). No real payment was processed.</p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-xl border border-dashed border-teks-gold px-4 py-2">
          <span className="text-sm text-teks-muted">Order code</span>
          <span className="font-display text-lg font-extrabold text-teks-gold">{o.code}</span>
          <button type="button" onClick={copy} aria-label="Copy order code" className="rounded p-1 text-teks-muted hover:text-teks-gold">
            <Copy size={18} aria-hidden="true" />
          </button>
        </p>
      </header>

      <dl className="mt-8 grid gap-4 rounded-2xl border border-teks-border bg-teks-surface p-5 sm:grid-cols-2">
        <div><dt className="text-sm text-teks-muted">Date</dt><dd>{new Date(o.created_at).toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })}</dd></div>
        <div><dt className="text-sm text-teks-muted">Payment method</dt><dd>{PAYMENT_LABELS[o.payment_method] ?? o.payment_method}</dd></div>
        <div><dt className="text-sm text-teks-muted">Email</dt><dd className="break-all">{o.email}</dd></div>
        <div><dt className="text-sm text-teks-muted">Status</dt><dd>{o.status}</dd></div>
      </dl>

      <section className="mt-6" aria-labelledby="items-h">
        <h2 id="items-h" className="mb-3 font-display text-xl font-extrabold">Your games</h2>
        <ul className="space-y-2">
          {o.items.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teks-border bg-teks-surface p-3">
              <div>
                <p className="font-semibold">{i.title}</p>
                <p className="text-sm text-teks-muted">{peso(i.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => toast('Download started (demo)')}
                className="flex items-center gap-2 rounded-lg border border-teks-gold px-3 py-1.5 text-sm font-semibold text-teks-gold hover:bg-teks-gold hover:text-teks-bg"
              >
                <Download size={16} aria-hidden="true" /> Download<span className="sr-only"> {i.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <dl className="mt-6 space-y-2 rounded-2xl border border-teks-border bg-teks-surface p-5">
        <div className="flex justify-between"><dt className="text-teks-muted">Subtotal</dt><dd>{peso(o.subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-teks-muted">Discount{o.promo_code ? ` (${o.promo_code})` : ''}</dt><dd>−{peso(o.discount)}</dd></div>
        <div className="flex justify-between border-t border-teks-border pt-2 text-lg font-extrabold"><dt>Total</dt><dd className="text-teks-gold">{peso(o.total)}</dd></div>
      </dl>

      <p className="mt-6 rounded-xl bg-teks-teal/10 px-4 py-3 text-center font-semibold text-teks-teal">
        {toDevs != null ? `${peso(toDevs)} went directly to Filipino developers.` : 'A fair share of this order went directly to Filipino developers.'}
      </p>

      <p className="mt-8 text-center">
        <Link to="/store" className="font-semibold text-teks-gold hover:underline">Keep browsing →</Link>
      </p>
    </div>
  )
}
