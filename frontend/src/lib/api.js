export async function api(path, options = {}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(typeof body?.detail === 'string' ? body.detail : 'Something went wrong')
  }
  return res.json()
}

const pesoFormat = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

export const peso = (n) => pesoFormat.format(n)
