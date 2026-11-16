import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdminList, peso } from '../lib/api.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'

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
      <div className="box tbl-wrap max-md:hidden" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>{columns.map((c) => <th key={c.label} scope="col">{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                {columns.map((c) => <td key={c.label}>{c.render(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="admin-cards md:hidden">
        {rows.map((r) => (
          <li key={r.id} className="box" style={{ padding: '1rem' }}>
            <dl>
              {columns.map((c) => (
                <div key={c.label}>
                  <dt>{c.label}: </dt>
                  <dd>{c.render(r)}</dd>
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
      <div className="wrap section">
        <div className="box login">
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Admin</h1>
          <form className="form" onSubmit={login}>
            <div className={`field${rejected ? ' bad' : ''}`}>
              <label htmlFor="admin-key">Admin key</label>
              <input id="admin-key" type="password" autoComplete="off" value={input} onChange={(e) => setInput(e.target.value)} aria-describedby="admin-msg" />
              <p id="admin-msg" role="alert" className="err">
                {rejected ? 'Invalid admin key. Try again.' : notice}
              </p>
            </div>
            <button type="submit" className="btn" style={{ justifySelf: 'start' }}>Enter</button>
          </form>
        </div>
      </div>
    )
  }

  const t = TABS[tab]
  return (
    <div className="wrap section">
      <div className="head" style={{ marginBottom: '1.2rem' }}>
        <h1 style={{ fontSize: '2.4rem' }}>Admin</h1>
        <button type="button" onClick={logout} className="btn alt small">Log out</button>
      </div>
      <div role="tablist" aria-label="Admin sections" className="tabs">
        {Object.entries(TABS).map(([id, v]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls="admin-panel"
            onClick={() => setTab(id)}
            className="chip"
          >
            {v.label}
          </button>
        ))}
      </div>
      <div id="admin-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} style={{ marginTop: '1.5rem' }}>
        {query.isPending ? (
          <p className="results-n" role="status">Loading…</p>
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
