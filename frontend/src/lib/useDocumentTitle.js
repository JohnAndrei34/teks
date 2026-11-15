import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | TEKS` : 'TEKS: Collect Pinoy stories, one game at a time.'
  }, [title])
}
