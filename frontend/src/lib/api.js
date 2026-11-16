export async function api(path, options = {}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const error = new Error(typeof body?.detail === 'string' ? body.detail : 'Something went wrong')
    error.status = res.status
    throw error
  }
  return res.json()
}

const pesoFormat = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

export const peso = (n) => pesoFormat.format(n)

// For developer payouts, which can include centavos (e.g. 80% of 149 is 119.20).
const pesoCurrency = (digits) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: digits, maximumFractionDigits: digits })
const pesoWhole = pesoCurrency(0)
const pesoCents = pesoCurrency(2)
export const pesoExact = (n) => (Number.isInteger(n) ? pesoWhole : pesoCents).format(n)

const toQuery = (params = {}) => {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value)
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

export const getGames = (params) => api(`/games${toQuery(params)}`)
export const getGame = (slug) => api(`/games/${encodeURIComponent(slug)}`)
export const getCollections = () => api('/collections')
export const getCollection = (slug) => api(`/collections/${encodeURIComponent(slug)}`)
export const getDeveloper = (slug) => api(`/developers/${encodeURIComponent(slug)}`)
export const getConfig = () => api('/config')

const post = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body) })

export const checkPromo = (code) => api(`/promo/${encodeURIComponent(code)}`)
export const createOrder = (body) => post('/orders', body)
export const getOrder = (code) => api(`/orders/${encodeURIComponent(code)}`)
export const createContact = (body) => post('/contact', body)
export const createSubmission = (body) => post('/submissions', body)
export const getAdminList = (kind, key) => api(`/admin/${kind}`, { headers: { 'X-Admin-Key': key } })
