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
