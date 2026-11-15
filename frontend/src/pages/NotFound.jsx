import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'

export default function NotFound({
  title = 'Page not found',
  message = "We couldn't find what you were looking for. It may have moved, or the link may be wrong.",
  documentTitle = 'Not found',
}) {
  useDocumentTitle(documentTitle)
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-teks-primary" aria-hidden="true">404</p>
      <h1 className="font-display text-3xl font-extrabold">{title}</h1>
      <p className="text-teks-muted">{message}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link to="/store" className="rounded-lg bg-teks-primary px-5 py-2.5 font-semibold text-white hover:bg-teks-primary-soft">
          Browse games
        </Link>
        <Link to="/" className="rounded-lg border border-teks-border px-5 py-2.5 font-semibold hover:border-teks-gold">
          Go home
        </Link>
      </div>
    </section>
  )
}
