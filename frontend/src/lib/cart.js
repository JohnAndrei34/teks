export const unitPrice = (i) => (i.sale_price != null && i.sale_price < i.price ? i.sale_price : i.price)

// Display-only totals. The backend recomputes everything when the order is placed.
export function cartTotals(items, promo) {
  const subtotal = items.reduce((n, i) => n + unitPrice(i), 0)
  const discount = promo ? Math.floor((subtotal * promo.percent) / 100) : 0
  return { subtotal, discount, total: subtotal - discount }
}
