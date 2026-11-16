import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | TEKS` : 'TEKS: Filipino games, in one store'
  }, [title])
}
