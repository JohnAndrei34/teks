import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdminList, peso } from '../lib/api.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { inputClass } from '../lib/formStyles.js'

const KEY = 'teks-admin-key'
const readKey = () => {
  try {
    return sessionStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}
const date = (v) => new Date(v).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })

const TABS = {
  orders: {
    label: 'Orders',
    columns: [
      { label: 'Code', render: (r) => r.code },
      { label: 'Date', render: (r) => date(r.created_at) },
      { label: 'Customer', render: (r) => `${r.customer_name} (${r.email})` },
      { label: 'Payment', render: (r) => r.payment_method },
      { label: 'Promo', render: (r) => r.promo_code ?? '–' },
      { label: 'Total', render: (r) => peso(r.total) },
      { label: 'Status', render: (r) => r.status },
    ],
  },
  submissions: {
    label: 'Submissions',
    columns: [
      { label: 'Date', render: (r) => date(r.created_at) },
      { label: 'Studio', render: (r) => `${r.studio_name} (${r.developer_type})` },
      { label: 'Game', render: (r) => r.game_title },
      { label: 'Genre', render: (r) => `${r.genre}${r.collection ? ` / ${r.collection}` : ''}` },
      { label: 'Platforms', render: (r) => r.platforms?.join(', ') },
      { label: 'Contact', render: (r) => `${r.contact_name} (${r.email})` },
      { label: 'Build', render: (r) => r.build_url },
      { label: 'Description', render: (r) => r.description },
      { label: 'Status', render: (r) => r.status },
    ],
  },
  messages: {
    label: 'Messages',
    columns: [
      { label: 'Date', render: (r) => date(r.created_at) },
      { label: 'Type', render: (r) => r.inquiry_type },
      { label: 'From', render: (r) => `${r.name} (${r.email})` },
      { label: 'Message', render: (r) => r.message },
    ],
  },
}

function DataList({ columns, rows }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="text-teks-muted">
            <tr>{columns.map((c) => <th key={c.label} scope="col" className="border-b border-teks-border px-3 py-2 font-semibold">{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="align-top odd:bg-teks-surface">
                {columns.map((c) => <td key={c.label} className="max-w-xs break-words px-3 py-2">{c.render(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-teks-border bg-teks-surface p-4">
            <dl className="space-y-1 text-sm">
              {columns.map((c) => (
                <div key={c.label}>
                  <dt className="inline text-teks-muted">{c.label}: </dt>
                  <dd className="inline break-words">{c.render(r)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function Admin() {
  useDocumentTitle('Admin')
  const [key, setKey] = useState(readKey)
  const [input, setInput] = useState('')
  const [tab, setTab] = useState('orders')
  const [notice, setNotice] = useState('')

  const query = useQuery({
    queryKey: ['admin', tab, key],
    queryFn: () => getAdminList(tab, key),
    enabled: Boolean(key),
    retry: false,
    staleTime: 0,
    gcTime: 0,
  })
  const rejected = query.error?.status === 401
  const loggedIn = Boolean(key) && !rejected

  useEffect(() => {
    if (rejected) {
      try {
        sessionStorage.removeItem(KEY)
      } catch {
        /* ignore */
      }
    }
  }, [rejected])

  const login = (e) => {
    e.preventDefault()
    const k = input.trim()
    if (!k) return
    try {
      sessionStorage.setItem(KEY, k)
    } catch {
      /* ignore */
    }
    setNotice('')
    setKey(k)
    setInput('')
  }
  const logout = () => {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
    setKey('')
    setNotice('')
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="font-display text-2xl font-extrabold">Admin</h1>
        <form onSubmit={login} className="mt-4 space-y-3">
          <label htmlFor="admin-key" className="block text-sm font-semibold">Admin key</label>
          <input id="admin-key" type="password" autoComplete="off" value={input} onChange={(e) => setInput(e.target.value)} className={inputClass} aria-describedby="admin-msg" />
          <p id="admin-msg" role="alert" className="text-sm text-teks-primary-soft">
            {rejected ? 'Invalid admin key. Try again.' : notice}
          </p>
          <button type="submit" className="rounded-lg bg-teks-primary px-5 py-2.5 font-semibold text-white hover:bg-teks-primary-soft">Enter</button>
        </form>
      </div>
    )
  }

  const t = TABS[tab]
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold">Admin</h1>
        <button type="button" onClick={logout} className="rounded-lg border border-teks-border px-3 py-1.5 text-sm font-semibold hover:border-teks-gold">Log out</button>
      </div>
      <div role="tablist" aria-label="Admin sections" className="mt-5 flex gap-2">
        {Object.entries(TABS).map(([id, v]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls="admin-panel"
            onClick={() => setTab(id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === id ? 'bg-teks-gold text-teks-bg' : 'bg-teks-surface hover:text-teks-gold'}`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div id="admin-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-5">
        {query.isPending ? (
          <p className="text-teks-muted" role="status">Loading…</p>
        ) : query.isError ? (
          <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
        ) : query.data.length ? (
          <DataList columns={t.columns} rows={query.data} />
        ) : (
          <EmptyState title={`No ${t.label.toLowerCase()} yet`} />
        )}
      </div>
    </div>
  )
}
