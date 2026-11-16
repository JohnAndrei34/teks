import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext.js'

const KEY = 'teks-cart'
const PROMO_KEY = 'teks-promo'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function loadPromo() {
  try {
    const p = JSON.parse(localStorage.getItem(PROMO_KEY))
    return p && p.code && p.percent ? p : null
  } catch {
    return null
  }
}

// Cart items are for display only. The backend recomputes all prices at checkout.
export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const [promo, setPromo] = useState(loadPromo) // { code, percent } validated via /promo

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable: cart still works for this session */
    }
  }, [items])

  useEffect(() => {
    try {
      if (promo) localStorage.setItem(PROMO_KEY, JSON.stringify(promo))
      else localStorage.removeItem(PROMO_KEY)
    } catch {
      /* ignore */
    }
  }, [promo])

  const addToCart = useCallback((game) => {
    setItems((prev) =>
      prev.some((i) => i.id === game.id)
        ? prev
        : [
            ...prev,
            {
              id: game.id,
              slug: game.slug,
              title: game.title,
              cover_image: game.cover_image,
              motif: game.motif,
              palette: game.palette,
              developer: game.developer?.name,
              price: game.price,
              sale_price: game.sale_price,
            },
          ],
    )
  }, [])
  const removeFromCart = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), [])
  const clearCart = useCallback(() => {
    setItems([])
    setPromo(null)
  }, [])

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      clearCart,
      promo,
      setPromo,
      count: items.length,
      inCart: (id) => items.some((i) => i.id === id),
    }),
    [items, promo, addToCart, removeFromCart, clearCart],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
