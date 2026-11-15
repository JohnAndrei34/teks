import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'

export default function ComingSoon({ title }) {
  useDocumentTitle(title)
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">{title}</h1>
      <p className="text-teks-muted">Coming soon. This page is still being built.</p>
      <Link to="/store" className="rounded-lg bg-teks-primary px-5 py-2.5 font-semibold text-white hover:bg-teks-primary-soft">
        Browse games
      </Link>
    </section>
  )
}
