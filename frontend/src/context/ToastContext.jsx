import { useCallback, useMemo, useRef, useState } from 'react'
import { ToastContext } from './toastContext.js'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const toast = useCallback((message) => {
    const id = nextId.current++
    setToasts((prev) => [...prev.slice(-2), { id, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div key={t.id} className="rounded-lg border border-teks-gold/60 bg-teks-surface px-4 py-2 text-sm font-semibold shadow-xl">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
