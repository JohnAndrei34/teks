import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Copy, Download } from 'lucide-react'
import { getConfig, getOrder, peso, pesoExact } from '../lib/api.js'
import { PAYMENT_LABELS } from '../lib/content.js'
import { useToast } from '../context/useToast.js'
import { useAllGames } from '../lib/useAllGames.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import GameCover from '../components/GameCover.jsx'
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
  const all = useAllGames()
  useDocumentTitle(query.data ? `Order ${query.data.code}` : 'Order')

  if (query.error?.status === 404) {
    return <NotFound title="Order not found" message="We couldn't find an order with that code. Check the code and try again." documentTitle="Order not found" />
  }
  if (query.isError) {
    return <div className="wrap section"><ErrorState message="Couldn't load this order." onRetry={() => query.refetch()} /></div>
  }
  if (query.isPending) {
    return <div className="wrap section" style={{ display: 'grid', gap: '1.5rem' }}><BlockSkeleton /><BlockSkeleton style={{ minHeight: '16rem' }} /></div>
  }

  const o = query.data
  const share = config.data?.developer_share_percent
  const toDevs = share ? Math.floor((o.total * share) / 100) : null
  const gameOf = (item) => all.data?.find((g) => g.id === item.game_id)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(o.code)
      toast('Order code copied')
    } catch {
      toast('Copy failed. Select the code and copy it manually.')
    }
  }

  return (
    <div className="wrap" style={{ paddingBottom: '4rem' }}>
      <div className="success">
        <h1>Salamat, {o.customer_name.split(' ')[0]}!</h1>
        <p>Your order is confirmed (demo). No real payment was processed.</p>
        <p className="code-row">
          <span>Order code</span>
          <span className="code">{o.code}</span>
          <button type="button" className="btn alt small" onClick={copy}>
            <Copy size={16} aria-hidden="true" /> Copy<span className="sr-only"> order code</span>
          </button>
        </p>
        <Link className="btn yellow" to="/library">Open My Library</Link>
      </div>

      <dl className="box facts">
        <div><dt>Date</dt><dd>{new Date(o.created_at).toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })}</dd></div>
        <div><dt>Payment method</dt><dd>{PAYMENT_LABELS[o.payment_method] ?? o.payment_method}</dd></div>
        <div><dt>Email</dt><dd>{o.email}</dd></div>
        <div><dt>Status</dt><dd>{o.status}</dd></div>
      </dl>

      <section aria-labelledby="items-h" style={{ marginTop: '2rem' }}>
        <h2 id="items-h" style={{ fontSize: '1.8rem', marginBottom: '1.2rem' }}>Your games</h2>
        <ul className="lines">
          {o.items.map((i) => {
            const g = gameOf(i)
            return (
              <li key={i.id} className="line">
                <Link className="thumb" to={g ? `/game/${g.slug}` : '/store'} aria-label={i.title}>
                  <GameCover game={g ?? { title: i.title }} decorative />
                </Link>
                <div>
                  <h3>{i.title}</h3>
                  <p>{peso(i.price)}</p>
                </div>
                <button type="button" className="btn small" onClick={() => toast('Download started (demo)')}>
                  <Download size={16} aria-hidden="true" /> Download<span className="sr-only"> {i.title}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="sum" style={{ position: 'static', maxWidth: '26rem' }}>
        <div className="row"><span>Subtotal</span><span>{peso(o.subtotal)}</span></div>
        <div className="row"><span>Discount{o.promo_code ? ` (${o.promo_code})` : ''}</span><span>−{peso(o.discount)}</span></div>
        <div className="row total"><span>Total</span><span>{peso(o.total)}</span></div>
      </div>

      <div className="box" style={{ marginTop: '1.5rem' }}>
        <h3>Where your money went</h3>
        {share != null && (
          <div className="bar-split" role="img" aria-label={`${share} percent to the developers`}>
            <i style={{ width: `${share}%` }} />
            <b />
          </div>
        )}
        <p className="split">
          {toDevs != null ? `${pesoExact(toDevs)} went directly to Filipino developers.` : 'A fair share of this order went directly to Filipino developers.'}
        </p>
      </div>

      <p style={{ marginTop: '2rem' }}>
        <Link className="btn alt" to="/store">Keep browsing</Link>
      </p>
    </div>
  )
}
