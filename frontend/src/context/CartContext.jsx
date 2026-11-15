import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext.js'

const KEY = 'teks-cart'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

// Cart items are for display only. The backend recomputes all prices at checkout.
export function CartProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable: cart still works for this session */
    }
  }, [items])

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
              developer: game.developer?.name,
              price: game.price,
              sale_price: game.sale_price,
            },
          ],
    )
  }, [])
  const removeFromCart = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), [])
  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      clearCart,
      count: items.length,
      inCart: (id) => items.some((i) => i.id === id),
    }),
    [items, addToCart, removeFromCart, clearCart],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
