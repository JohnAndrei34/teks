import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'

export default function NotFound({
  title = 'Page not found',
  message = "We couldn't find what you were looking for. It may have moved, or the link may be wrong.",
  documentTitle = 'Not found',
}) {
  useDocumentTitle(documentTitle)
  return (
    <section className="wrap section">
      <div className="empty">
        <p aria-hidden="true" style={{ font: '400 clamp(4rem,12vw,7rem) var(--display)', color: 'var(--red)', margin: 0, lineHeight: 1 }}>404</p>
        <h1 style={{ fontSize: '2rem' }}>{title}</h1>
        <p>{message}</p>
        <div className="actions" style={{ justifyContent: 'center', marginTop: '.6rem' }}>
          <Link className="btn" to="/store">Browse the store</Link>
          <Link className="btn alt" to="/">Go home</Link>
        </div>
      </div>
    </section>
  )
}
